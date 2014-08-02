package discussie

import (
	"time"
)

type Discussion struct {
	ID      string    `json:"id"`
	Title   string    `json:"title"`
	Created time.Time `json:"created"`
	Author  string    `json:"author"` //FIXME?
}

type Post struct {
	ID           string    `json:"id"`
	DiscussionID string    `json:"discussion"`
	Created      time.Time `json:"created"`
	Author       string    `json:"author"` //FIXME?
	Body         string    `json:"body"`
}
