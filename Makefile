.PHONY: build start

build:
	deno bundle -c tsconfig.json ./client/main.ts ./dist/main.js

start:
	deno run --allow-env --allow-net ./server/server.ts
