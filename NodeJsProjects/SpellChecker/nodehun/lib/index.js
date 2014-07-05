// Module variables
var nativeNodeHun		=	require('./../src/build/Release/nodehun'),
	os					=	require('os'),
	fs					=	require('fs'),
	path				=	require('path'),
	dictionariesPath	=	(function(){
		var dir = __dirname.split(path.sep);
		dir.pop();
		dir.push('dictionaries');
		return dir.join(path.sep) + path.sep;
	}()),
	nativeKeys			=	Object.keys(nativeNodeHun),
	i					=	nativeKeys.length,
	privateRe			=	/^_/,
	dictionaries		=	[],
	key;

// Initializations that need to take place
nativeNodeHun._setDictionariesPath(dictionariesPath);

// Set all public methods to be exposed
while(i--){
	key = nativeKeys[i];
	if(!privateRe.test(key))
		exports[key] = nativeNodeHun[key];
}
/*--exports--
name:addDictionaryPerm
description: adds a new dictionary to the dictionaries path.
	The last two parameters are optional. The third parameter
	specifies another dictionary on which to base this new
	dictionary on. The fourth parameter, when false, which is
	default, will copy the affixes and words into the new dictionary
	folder; when true, only the affixes will be copied.
@param{string}
@param{function}
@param{string=}
@param{bool=}
*/
exports.addDictionaryPerm = function(dictionary,callback,base,notDict){
	var dictPath = dictionariesPath + dictionary,
		affPath = dictPath + path.sep + dictionary + '.aff',
		dicPath = dictPath + path.sep + dictionary + '.dic',
		oneDone = false,
		error = false,
		baseAff,baseDic;
	// Make the dictionary directory
	fs.mkdir(dictPath,function(err){
		// If the directory already exists, error out.
		if(err){
			callback(err,false);
		}
		else{
			//If a base dictionary was indicated let's read it
			if(typeof base === "string"){
				baseAff = dictionariesPath + base + path.sep + base + '.aff';
				fs.readFile(baseAff,function(err,abuf){
					if(err){
						error = true;
						callback(err,false);
					}
					else{
						fs.open(affPath,'w',function(err,fd){
							if(err && !error){
								error = true
								callback(err,false);
							}
							else if(!error){
								fs.write(fd,abuf,0,abuf.length,null,function(err,written){
									if(!error){
										if(err){
											callback(err,false);
											error = true;
										}
										else{
											if(oneDone) callback(null,true);
											oneDone = true;
										}
									}
								});
							}
						});
					}
				});
			}
			else{
				fs.open(affPath,'w',function(err,fd){
					if(err && !error){
						callback(err,false);
					}
					else if(!error){
						fs.write(fd,new Buffer('0\n'),0,2,null,function(err,written){
							if(!error){
								if(err){
									callback(err,false);
									error = true;
								}
								else{
									if(oneDone) callback(null,true);
									oneDone = true;
								}
							}
						})
					}
				});
			}
			if(typeof base === "string" && !notDict){
				baseDic = dictionariesPath + base + path.sep + base + '.dic';
				fs.readFile(baseDic,function(err,abuf){
					if(err && !error){
						error = true;
						callback(err);
					}
					else if(!error){
						fs.open(dicPath,'w',function(err,fd){
							if(err && !error){
								callback(err,false);
							}
							else{
								fs.write(fd,abuf,0,abuf.length,null,function(err,written){
									if(!error){
										if(err){
											callback(err,false);
											error = true;
										}
										else{
											if(oneDone) callback(null,true);
											oneDone = true;
										}
									}
								})
							}
						});
					}
				});
			}
			else{
				fs.open(dicPath,'w',function(err,fd){
					if(err && !error){
						callback(err,false);
					}
					else if(!error){
						fs.write(fd,new Buffer('0\n'),0,2,null,function(err,written){
							if(!error){
								if(err){
									callback(err,false);
									error = true;
								}
								else{
									if(oneDone) callback(null,true);
									oneDone = true;
								}
							}
						})
					}
				});
			}
		}
	});
};