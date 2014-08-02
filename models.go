package discussie

import "time"

var (
	ErrEmptyDiscussionTitle  = newValidationError("discussion title not set")
	ErrEmptyDiscussionAuthor = newValidationError("discussion author not set")
	ErrEmptyPostBody         = newValidationError("post body not set")
	ErrEmptyPostAuthor       = newValidationError("post author not set")
)

type ValidationError struct {
	msg string
}

func newValidationError(msg string) ValidationError {
	return ValidationError{msg: msg}
}

func (v ValidationError) Error() string {
	return v.msg
}

type Discussion struct {
	ID      string    `json:"id"`
	Title   string    `json:"title"`
	Created time.Time `json:"created"`
	Author  string    `json:"author"` //FIXME?
}

func (d *Discussion) Validate() error {
	if d.Title == "" {
		return ErrEmptyDiscussionTitle
	}
	if d.Author == "" {
		return ErrEmptyDiscussionAuthor
	}
	return nil
}

type Post struct {
	ID           string    `json:"id"`
	DiscussionID string    `json:"discussion"`
	Created      time.Time `json:"created"`
	Author       string    `json:"author"` //FIXME?
	Body         string    `json:"body"`
}

func (p *Post) Validate() error {
	if p.Body == "" {
		return ErrEmptyPostBody
	}
	if p.Author == "" {
		return ErrEmptyPostAuthor
	}
	return nil
}
