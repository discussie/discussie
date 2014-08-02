package discussie

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/russross/blackfriday"
)

func Router(ctx *Context) *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/discussions/", adapt(ctx, discussionHandler)).Methods("GET", "POST")
	r.HandleFunc("/api/discussions/{id}", adapt(ctx, postHandler)).Methods("GET", "POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("../../public/")))
	return r
}

type handler func(*Context, *http.Request) (body interface{}, code int, err error)

func adapt(ctx *Context, h handler) func(http.ResponseWriter, *http.Request) {
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
		return c.dmgr.ListDiscussions(), 200, nil
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
		posts := c.dmgr.ListPosts(discID)
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
	return struct {
		P string `json:"post_id"`
	}{P: post.ID}, 200, nil
}
