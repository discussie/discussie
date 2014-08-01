Discussie
=========

How to run the backend
----------------------

First install Go: http://golang.org/doc/install

Then:

```
cd cmd/discussied
go build && PORT=8000 ./discussied
```

(Because Piet doesn't know how to set default values in Go yet.)

How to use the API
------------------

First install http://httpie.org/

List discussions:

```
http localhost:8000/api/discussions/
```

Create a discussion:

```
echo '{
    "author": "schmichael",
    "title": "Cat GIFs"
}' | http POST localhost:8000/api/discussions/
```

To access posts you'll have to use the Big Long ID returned by POSTing a new
discussion (or in the discussion listing).

List posts on a discussion:

```
http localhost:8000/api/discussions/BIG-LONG-ID
```

Create a post on a discussion:

```
echo '{
    "author": "schmichael",
    "body": "lolwat"
}' | http POST localhost:8000/api/discussions/BIG-LONG-ID
```
