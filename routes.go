package discussie

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func Router(ctx *Context) *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/api/discussions/", ctx.DiscussionHandler).Methods("GET", "POST")
	r.HandleFunc("/api/discussions/{id}", ctx.PostHandler).Methods("GET", "POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("../../public/")))
	return r
}

func die(rw http.ResponseWriter, msg string, err error) {
	out := msg + err.Error()
	log.Printf(out)
	rw.WriteHeader(500)
	rw.Write([]byte(out))
	return
}

func setAPIHeaders(rw http.ResponseWriter) {
	rw.Header().Set("Content-Type", "application/json")
}

func (c *Context) DiscussionHandler(rw http.ResponseWriter, req *http.Request) {
	setAPIHeaders(rw)

	if req.Method == "GET" {
		enc := json.NewEncoder(rw)
		if err := enc.Encode(c.dmgr.ListDiscussions()); err != nil {
			die(rw, "Error listing discussions: ", err)
		}
		return
	}

	disc := &Discussion{}
	dec := json.NewDecoder(req.Body)
	defer req.Body.Close()
	if err := dec.Decode(disc); err != nil {
		die(rw, "Error creating discussion 1: ", err)
		return
	}
	if err := c.dmgr.Discuss(disc); err != nil {
		if ve, ok := err.(ValidationError); ok {
			rw.WriteHeader(400)
			rw.Write([]byte(ve.String()))
			return
		}
		die(rw, "Error creating discussion 2: ", err)
		return
	}
	rw.Write([]byte(`{ "discussion_id": "` + disc.ID + `" }`))
}

func (c *Context) PostHandler(rw http.ResponseWriter, req *http.Request) {
	setAPIHeaders(rw)

	vars := mux.Vars(req)
	discID := vars["id"]
	if discID == "" {
		die(rw, "no id found", nil)
	}

	if req.Method == "GET" {
		enc := json.NewEncoder(rw)
		if err := enc.Encode(c.dmgr.ListPosts(discID)); err != nil {
			die(rw, "Error encoding posts: ", err)
		}
		return
	}

	post := &Post{DiscussionID: discID}
	dec := json.NewDecoder(req.Body)
	defer req.Body.Close()
	if err := dec.Decode(post); err != nil {
		die(rw, "Error creating post 1: ", err)
		return
	}
	if err := c.dmgr.Post(post); err != nil {
		if err == DiscussionNotFound {
			rw.WriteHeader(404)
			rw.Write([]byte(err.Error()))
			return
		}
		if ve, ok := err.(ValidationError); ok {
			rw.WriteHeader(400)
			rw.Write([]byte(ve.String()))
			return
		}
		die(rw, "Error creating post 2: ", err)
		return
	}
	rw.Write([]byte(`{ "post_id": "` + post.ID + `" }`))
}
