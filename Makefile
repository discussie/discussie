all: run

run:
	cd cmd/discussied/ && go run main.go

publish: jsbuild
	git push

gobuild:
	cd cmd/discussied/ && go build

jsbuild:
	r.js -o build.js
	git reset
	git add public/js/app-built.js
	git commit -m "Optimize js."