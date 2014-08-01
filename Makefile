all: run

run:
	cd cmd/discussied/ && go run main.go

jsbuild:
	r.js -o build.js