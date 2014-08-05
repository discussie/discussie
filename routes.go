package discussie

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/russross/blackfriday"
)

func Router(ctx *Context, path string) *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/discussions/", adapt(ctx, discussionHandler)).Methods("GET", "POST")
	r.HandleFunc("/api/discussions/{id}", adapt(ctx, postHandler)).Methods("GET", "POST")
	r.HandleFunc("/api/posts/recent/", adapt(ctx, recentHandler)).Methods("GET")
	r.HandleFunc("/api/render/", adapt(ctx, renderHandler)).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir(path)))
	return r
}

type jsonHandler func(*Context, *http.Request) (body interface{}, code int, err error)

func adapt(ctx *Context, h jsonHandler) func(http.ResponseWriter, *http.Request) {
	return func(rw http.ResponseWriter, req *http.Request) {
		setAPIHeaders(rw)
		body, code, err := h(ctx, req)
		rw.WriteHeader(code)
		if err != nil {
			log.Printf("%d %s -> %v", code, req.URL, err)
			errMsg := err.Error()
			if code == 500 {
				// Don't expose internal errors
				errMsg = "internal error"
			}
			body = struct {
				Error string `json:"error"`
			}{Error: errMsg}
		}
		if respErr := json.NewEncoder(rw).Encode(body); respErr != nil {
			log.Printf("%s Error writing error response: %v", req.URL, respErr)
		}
	}
}

func setAPIHeaders(rw http.ResponseWriter) {
	rw.Header().Set("Content-Type", "application/json")
}

func discussionHandler(c *Context, req *http.Request) (interface{}, int, error) {

	if req.Method == "GET" {
		all, err := c.dmgr.ListDiscussions()
		if err != nil {
			return nil, 500, err
		}
		return all, 200, nil
	}

	disc := &Discussion{}
	dec := json.NewDecoder(req.Body)
	defer req.Body.Close()
	if err := dec.Decode(disc); err != nil {
		return nil, 400, err
	}
	if err := c.dmgr.Discuss(disc); err != nil {
		if ve, ok := err.(ValidationError); ok {
			return nil, 400, ve
		}
		return nil, 500, err
	}
	return &struct {
		D string `json:"discussion_id"`
	}{D: disc.ID}, 200, nil
}

func postHandler(c *Context, req *http.Request) (interface{}, int, error) {
	vars := mux.Vars(req)
	discID := vars["id"]
	if discID == "" {
		return nil, 400, DiscussionNotFound
	}

	if req.Method == "GET" {
		posts, err := c.dmgr.ListPosts(discID)
		if err != nil {
			return nil, 500, err
		}
		// Render as markdown
		for _, p := range posts {
			p.Body = string(blackfriday.MarkdownCommon([]byte(p.Body)))
		}
		return posts, 200, nil
	}

	post := &Post{DiscussionID: discID}
	dec := json.NewDecoder(req.Body)
	defer req.Body.Close()
	if err := dec.Decode(post); err != nil {
		return nil, 400, err
	}
	if err := c.dmgr.Post(post); err != nil {
		if err == DiscussionNotFound {
			return nil, 400, DiscussionNotFound
		}
		if _, ok := err.(ValidationError); ok {
			return nil, 400, err
		}
		return nil, 500, err
	}
	htmlBody := string(blackfriday.MarkdownCommon([]byte(post.Body)))
	return &struct {
		P string `json:"post_id"`
		B string `json:"body"`
	}{P: post.ID, B: htmlBody}, 200, nil
}

func recentHandler(c *Context, req *http.Request) (interface{}, int, error) {
	const recentPostsLimit = 20 //FIXME Make a global default limit? See #3
	posts, err := c.dmgr.RecentPosts(recentPostsLimit)
	if err != nil {
		return nil, 500, err
	}
	return posts, 200, err
}

func renderHandler(_ *Context, req *http.Request) (interface{}, int, error) {
	defer req.Body.Close()
	incoming := struct {
		B string `json:"body"`
	}{}
	if err := json.NewDecoder(req.Body).Decode(&incoming); err != nil {
		return nil, 400, err
	}
	body := string(blackfriday.MarkdownCommon([]byte(incoming.B)))
	return &struct {
		B string `json:"body"`
	}{B: body}, 200, nil
}
