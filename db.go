package discussie

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var (
	DiscussionNotFound = errors.New("discussion not found")
)

type Manager struct {
	db *sql.DB
}

func newManager(dbFilename string) (*Manager, error) {
	db, err := sql.Open("sqlite3", dbFilename)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %v", err)
	}
	m := &Manager{db: db}
	m.init()
	return m, nil
}

func getDiscussion(tx *sql.Tx, id string) (*Discussion, error) {
	r := tx.QueryRow("SELECT * FROM discussions WHERE id = ?", id)
	d := &Discussion{}
	return d, r.Scan(&d.ID, &d.Title, &d.Created, &d.Author)
}

func (m *Manager) ListDiscussions() ([]*Discussion, error) {
	tx, err := m.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	c, err := tx.Query("SELECT * FROM discussions ORDER BY created DESC")
	if err != nil {
		return nil, err
	}
	defer c.Close()

	all := []*Discussion{}
	for c.Next() {
		d := &Discussion{}
		if err := c.Scan(&d.ID, &d.Title, &d.Created, &d.Author); err != nil {
			return nil, err
		}
		all = append(all, d)
	}
	return all, nil
}

func (m *Manager) Discuss(d *Discussion) error {
	d.ID = newID()
	d.Created = time.Now()
	if err := d.Validate(); err != nil {
		return err
	}

	tx, err := m.db.Begin()
	if err != nil {
		return err
	}

	_, err = tx.Exec("INSERT INTO discussions (id, title, created, author) VALUES (?, ?, ?, ?)",
		d.ID, d.Title, d.Created, d.Author)
	if err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (m *Manager) selectPosts(q string, params ...interface{}) ([]*Post, error) {
	tx, err := m.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	c, err := tx.Query(q, params...)
	if err != nil {
		return nil, err
	}
	defer c.Close()

	all := []*Post{}
	for c.Next() {
		p := &Post{}
		if err := c.Scan(&p.ID, &p.DiscussionID, &p.Created, &p.Author, &p.Body); err != nil {
			return nil, err
		}
		all = append(all, p)
	}
	return all, nil
}

// RecentPosts fetches the most recent posts globally from newest to oldest.
func (m *Manager) RecentPosts(limit int) ([]*Post, error) {
	return m.selectPosts("SELECT * FROM posts ORDER BY created DESC LIMIT ?", limit)
}

// ListPosts fetches posts for a particular discussion order from oldest to newest.
func (m *Manager) ListPosts(discID string) ([]*Post, error) {
	return m.selectPosts("SELECT * FROM posts WHERE discussion_id = ? ORDER BY created ASC", discID)
}

func (m *Manager) Post(p *Post) error {
	p.ID = newID()
	p.Created = time.Now()
	if err := p.Validate(); err != nil {
		return err
	}

	tx, err := m.db.Begin()
	if err != nil {
		return err
	}

	_, err = getDiscussion(tx, p.DiscussionID)
	if err != nil {
		if err == sql.ErrNoRows {
			tx.Rollback()
			return DiscussionNotFound
		}
		tx.Rollback()
		return err
	}

	_, err = tx.Exec("INSERT INTO posts (id, discussion_id, created, author, body) VALUES (?, ?, ?, ?, ?)",
		p.ID, p.DiscussionID, p.Created, p.Author, p.Body)
	if err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}

func (m *Manager) createTable(table, create string) {
	create = fmt.Sprintf(create, table)

	tx, err := m.db.Begin()
	if err != nil {
		log.Fatalf("Error beginning transaction: %v", err)
	}

	row := tx.QueryRow("SELECT COUNT(1) FROM sqlite_master WHERE type = ? AND name = ?", "table", table)
	count := 0
	if err := row.Scan(&count); err != nil {
		log.Fatalf("Error reading results of '%s' table check: %v", table, err)
	}

	if count > 0 {
		tx.Rollback()
		return
	}
	if _, err := tx.Exec(create); err != nil {
		log.Fatalf("Error creating table %s: %v", table, err)
	}
	if err := tx.Commit(); err != nil {
		log.Fatalf("Error commiting table creation %s: %v", table, err)
	}
}

func (m *Manager) init() {
	m.createTable("discussions", "CREATE TABLE %s ( id TEXT PRIMARY KEY, title TEXT, created DATETIME NOT NULL, author TEXT )")

	m.createTable("posts", "CREATE TABLE %s ( id TEXT PRIMARY KEY, discussion_id TEXT, created DATETIME NOT NULL, author TEXT, body TEXT, FOREIGN KEY(discussion_id) REFERENCES discussions(id) )")
}

func newID() string {
	b := make([]byte, 8)
	_, err := rand.Read(b)
	if err != nil {
		panic(fmt.Sprintf("error reading random bytes for ID: %v", err))
	}
	return hex.EncodeToString(b)
}
