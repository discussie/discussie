all: run

run:
	go run cmd/discussied/main.go

jsbuild:
	r.js -o build.js