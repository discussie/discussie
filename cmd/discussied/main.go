package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path"

	"bitbucket.org/schmichael/discussie"
)

func main() {
	bind := flag.String("bind", "localhost:8000", "host:port to listen on")
	dbFile := flag.String("db", "discussie.sqlite3", "filename for db")
	flag.Parse()

	ctx, err := discussie.NewContext(*dbFile)
	if err != nil {
		log.Fatalf("Error creating context: %v", err)
	}

	router := discussie.Router(ctx)
	m := http.NewServeMux()
	m.Handle("/", router)

	log.Printf("Starting %s on http://%s", path.Base(os.Args[0]), *bind)
	log.Fatal(http.ListenAndServe(*bind, m))
}
