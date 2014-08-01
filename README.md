Discussie
=========

How to run the backend
----------------------

First install Go: http://golang.org/doc/install

Then:

```
cd cmd/discussied
go build && ./discussied
```

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

List posts on a discussion:

```
http localhost:8000/api/discussions/
```

Create a post on a discussion:

```
echo '{
    "author": "schmichael",
    "body": "lolwat"
}' | http POST localhost:8000/api/discussions/BIG-LONG-ID
```

Note that you'll have to fill in the right BIG-LONG-ID by re-listing
discussions.
