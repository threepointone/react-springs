dev:
	babel-node dev.js

hot:
	HOT=1 make dev

build:
	babel src.js -o index.js

.PHONY: dev hot build
