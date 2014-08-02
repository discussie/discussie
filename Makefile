all: run

run:
	cd cmd/discussied/ && go run main.go

push: jsbuild
	git push

jsbuild:
	r.js -o build.js
	git reset
	git add public/js/app-built.js
	git commit -m "Optimize js."