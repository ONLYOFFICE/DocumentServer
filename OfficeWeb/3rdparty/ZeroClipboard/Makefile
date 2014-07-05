NODE_PATH ?= ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
JS_BEAUTIFIER = $(NODE_PATH)/uglify-js/bin/uglifyjs -b -i 2 -nm -ns

all: \
	ZeroClipboard.min.js

ZeroClipboard.min.js: Makefile
	@rm -f $@
	$(JS_COMPILER) ./src/javascript/ZeroClipboard.js > $@

testpage:
	git stash
	git checkout gh-pages
	git checkout master ZeroClipboard.min.js ZeroClipboard.swf
	rm -f javascript/ZeroClipboard*
	mv ZeroClipboard.* javascripts/
	git add .
	git commit -a -m "Update demo files to latest changes."
	git push
	git checkout master
	git stash pop