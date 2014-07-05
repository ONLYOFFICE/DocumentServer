Nodehun
=======

Installation
------------
Nodehun has no "node_module" dependencies (yet), so it can either be installed via npm or simply checked out of git. You'll need [node-gyp](https://github.com/TooTallNate/node-gyp) to build. Nodehun should work on Windows or Unix. You'll also need to make sure that libuv source
code is on your system. Usually having node installed is enough, but there are weird cases.
	
	npm install nodehun
	cd src
	node-gyp configure
	node-gyp build
	

Introduction
------------
Yes there are already two nodejs spell checkers based of off hunspell, but one doesn't seem to even be supported anymore, and the other seems to only support simple spelling suggestions. Nodehun aims to expose as much of hunspell's functionality as possible in an easy to understand and maintain way, while also offering additional functionality not even present in hunspell.

Spell Suggest and Initialization, directory based
-------------------------------------------------
Initializing nodehun is very easy, it will automatically find the dictionary you are looking for as long as it is inside the dictionaries folder (nodehun ships with US english and Canadian English, but tons of languages are available for free at [open office](http://extensions.services.openoffice.org/dictionary), you should be able to just drop any of open office's dictionary folders into nodehun's dictionary folder and it should automatically work, see the readme file in the dictionaries folder for more directions). From initialization there are only a few built in objects that come with nodehun, most of the functionality you will use are methods in the built in object "Dictionary". Simple spell suggest is very easy.
	     
	var nodehun = require('nodehun'),
	    USDictionary = new nodehun.Dictionary('en_US');
		
	USDictionary.spellSuggest('color',function(a,b){
		console.log(a,b);
		// because "color" is a defined word in the US English dictionary
		// the output will be: true, null
	});
	
	USDictionary.spellSuggest('calor',function(a,b){
		console.log(a,b);
		// because "calor" is not a defined word in the US English dictionary
		// the output will be: false, "carol"
	});
	
Spell Suggest and Initialization, buffer based.
-------------------------------------------------
Another option for initializing a nodehun dictionary is to pass the raw string output of both the affix and dictionary files of a particular language. This allows you to use an alternate data-store than the servers file system. Please do not actually use `readFileSync`.
	     
	var nodehun = require('nodehun'),
	    fs = require('fs'),
	    USDictionary = new nodehun.Dictionary(fs.readFileSync('./en_US.aff').toString(),fs.readFileSync('./en_US.dic').toString());
		
	USDictionary.spellSuggest('color',function(a,b){
		console.log(a,b);
		// because "color" is a defined word in the US English dictionary
		// the output will be: true, null
	});
	
	USDictionary.spellSuggest('calor',function(a,b){
		console.log(a,b);
		// because "calor" is not a defined word in the US English dictionary
		// the output will be: false, "carol"
	});
	
Spell Suggestions
-----------------
Nodehun also offers a method that returns an array of words that could possibly match a misspelled word, ordered by most likely to be correct.
	
	var nodehun = require('nodehun'),
		USDictionary = new nodehun.Dictionary('en_US');
	
	USDictionary.spellSuggestions('color',function(a,b){
		console.log(a,b);
		// because "color" is a defined word in the US English dictionary
		// the output will be: true, []
	});

	USDictionary.spellSuggest('calor',function(a,b){
		console.log(a,b);
		// because "calor" is not a defined word in the US English dictionary
		// the output will be: false, [ 'carol','valor','color','cal or','cal-or','caloric','calorie']
	});
	
Add Dictionary
--------------
Nodehun also can add another dictionary on top of an existing dictionary object at runtime (this means it is not permanent) in order to merge two dictionaries.
	
	var nodehun = require('nodehun'),
		USDictionary = new nodehun.Dictionary('en_US');
	
	USDictionary.spellSuggest('colour',function(a,b){
		console.log(a,b);
		// because "colour" is not a defined word in the US English dictionary
		// the output will be: false, "color"
	});
	
	USDictionary.addDictionary('en_CA',function(a,b){
		console.log(a,b);
		// because the Canadian English dictionary exists,
		// the output will be: true, 'en_CA'
		USDictionary.spellSuggest('colour',function(a,b){
			console.log(a,b);
			// because "colour" is a defined word in the Canadian English dictionary
			// the output will be: true, null
		});
		
	});
	
Add Dictionary, buffer based
----------------------------
Similar to the alternate means of initializing a nodehun dictionary you can also add a dictionary to an existing one with a raw string, even if the original dictionary wasn't initialized that way. NOTICE: the second argument is now the boolean value `true`, which indicates that the string being passed is a dictionary; if the value was `false` then it would treat the first argument as a path. The callback can be either the 2nd or 3rd argument, if it is the second argument the function will assume you've passed a "path" string. Once again, please do not actually use `readFileSync`.
	
	var nodehun = require('nodehun'),
	    fs = require('fs'),	    
	    USDictionary = new nodehun.Dictionary('en_US');
	
	USDictionary.spellSuggest('colour',function(a,b){
		console.log(a,b);
		// because "colour" is not a defined word in the US English dictionary
		// the output will be: false, "color"
	});
	
	USDictionary.addDictionary(fs.readFileSync('./en_CA.dic').toString(),true,function(a,b){
		console.log(a,b);
		// because the Canadian English dictionary exists,
		// the output will be: true, 'en_CA'
		USDictionary.spellSuggest('colour',function(a,b){
			console.log(a,b);
			// because "colour" is a defined word in the Canadian English dictionary
			// the output will be: true, null
		});
		
	});
	

Add Word
--------
Nodehun can also add a single word to a dictionary at runtime (this means it is not permanent) in order to have a custom runtime dictionary. If you know anything about Hunspell you can also add flags to the word.
	
	var nodehun = require('nodehun'),
		USDictionary = new nodehun.Dictionary('en_US');
	
	USDictionary.spellSuggest('colour',function(a,b){
		console.log(a,b);
		// because "colour" is not a defined word in the US English dictionary
		// the output will be: false, "color"
	});
	
	USDictionary.addWord('colour',function(a,b){
		console.log(a,b);
		// if the method succeeded then
		// the output will be: true, 'colour'
		USDictionary.spellSuggest('colour',function(a,b){
			console.log(a,b);
			// because "colour" has been added to the US dictionary object.
			// the output will be: true, null
		});
		
	});
	
Remove Word
-----------
Nodehun can also remove a single word from a dictionary at runtime (this means it is not permanent) in order to have a custom runtime dictionary. If you know anything about Hunspell this method will ignore flags and just strip words that match.
	
	var nodehun = require('nodehun'),
		USDictionary = new nodehun.Dictionary('en_US');
	
	USDictionary.spellSuggest('color',function(a,b){
		console.log(a,b);
		// because "color" is a defined word in the US English dictionary
		// the output will be: true, null
	});
	
	USDictionary.removeWord('color',function(a,b){
		console.log(a,b);
		// if the method succeeded then
		// the output will be: true, 'color'
		USDictionary.spellSuggest('color',function(a,b){
			console.log(a,b);
			// because "color" has been removed from the US dictionary object.
			// the output will be: false, "colors"
			// note that plurals are considered separte words.
		});
		
	});
	
Add Dictionary Permanently and Add Word Permanently
---------------------------------------------------
I have deprecated and scrapped these methods as they really violate good design philosophy of a well written node module. These methods can both be easily replicated using node itself. I am trying to move nodehun away from needing files at all, as they are a poor data-store for a distributed system.