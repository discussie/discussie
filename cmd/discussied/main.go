package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path"

	"github.com/discussie/discussie"
)

func main() {
	bind := flag.String("bind", "localhost:8000", "host:port to listen on")
	dbFile := flag.String("db", "discussie.sqlite3", "filename for db")
	sitePath := flag.String("site", "../../public", "path to public assets")
	flag.Parse()

	if fi, err := os.Stat(*sitePath); err != nil {
		log.Fatalf("Invalid site path %s: %v", *sitePath, err)
	} else if !fi.IsDir() {
		log.Fatalf("Site path is not a directory: %s", *sitePath)
	}

	ctx, err := discussie.NewContext(*dbFile)
	if err != nil {
		log.Fatalf("Error creating context: %v", err)
	}

	router := discussie.Router(ctx, *sitePath)
	m := http.NewServeMux()
	m.Handle("/", router)

	log.Printf("Starting %s on http://%s", path.Base(os.Args[0]), *bind)
	log.Fatal(http.ListenAndServe(*bind, m))
}
