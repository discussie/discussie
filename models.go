package discussie

import (
	"time"
)

type Discussion struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Created time.Time `json:"created"` //FIXME
	Author  string `json:"author"`  //FIXME?
}

/*
func NewDicussion(title, author string) *Discussion {
	return &Discussion{
		ID:      newID(),
		Title:   title,
		Created: time.Now(),
		Author:  author,
	}
}
*/

type Post struct {
	ID           string `json:"id"`
	DiscussionID string `json:"discussion"`
	Created      time.Time `json:"created"` //FIXME
	Author       string `json:"author"`  //FIXME?
	Body         string `json:"body"`
}

/*
func NewPost(discID, author, body string) *Post {
	return &Post{
		ID:           newID(),
		DiscussionID: discID,
		Created:      time.Now(),
		Author:       author,
		Body:         body,
	}
}
*/
