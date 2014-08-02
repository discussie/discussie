Discussie
=========

Features
--------

* Discussions with Posts
* Post bodies rendered as markdown

Running
-------

First install Go: http://golang.org/doc/install

Then:

```
cd cmd/discussied
go build && ./discussied
```

Open up http://localhost:8000/ in your browser.

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

Preview a post by just rendering it as markdown:

```
echo '{"body": "**ok**"}' | http POST localhost:8000/api/render/
```

List most recent posts from newest to oldest:

```
http localhost:8000/api/posts/recent/
```


How to use app
--------------

To run locally simply run go api and go to `http://localhost:8000` in your browser.

### Javascript optimization

To optimize javascript install `r.js` by running `npm install -g requirejs`. Then run `make jsbuild` to build and commit an optimized version of `app.js`.

Api Endpoints Dev
----------------

### Current

`GET /api/discussions/` - Get list of disussions.

`POST /api/discussions/` - Create a new discussion.

`GET /api/discussions/{id}` - Get list of discussion posts.

`POST /api/discussions/{id}` - Create a new discussion post.

`POST /api/render/` - Render markdown string into HTML.

`GET /api/posts/recent/` - Get list of most recent posts.

### Wishlist

`PUT? /api/posts/{id}` - Update post.

`DELETE /api/posts/{id}` - Delete post.

`PUT? /api/discussion/{id}` - Update discussion.

`DELETE /api/discussion/{id}` - Delete discussion. (Should we allow?)

### License

See LICENSE for full text (hint: it's [Apache License
v2](http://www.apache.org/licenses/LICENSE-2.0.html)).

Copyright 2014 Michael Schurter & Piet van Zoen
