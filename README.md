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


How to use app
--------------

To run locally simply run go api and go to `http://localhost:8000` in your browser.

### Javascript optimization

To optimize javascript install `r.js` by running `npm install -g requirejs`. Then run `make jsbuild` to build optimized version of `app.js`.