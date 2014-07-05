#include "license.nodehun"
#include "nodehun.hpp"
#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>

using namespace v8;

bool Nodehun::dictionaryDirectoryExists(const char *file){
  static uv_loop_t* loop = uv_default_loop();
  uv_fs_t open_req;
  uv_fs_t close_req;
  uv_fs_open(loop, &open_req, file, O_RDONLY, 0, NULL);
  if(open_req.result == -1){
    uv_fs_close(loop, &close_req, open_req.result, NULL);
    uv_fs_req_cleanup(&open_req);
    uv_fs_req_cleanup(&close_req);
    return false;
  }
  uv_fs_close(loop, &close_req, open_req.result, NULL);
  if(close_req.result == -1){
    uv_fs_req_cleanup(&open_req);
    uv_fs_req_cleanup(&close_req);
    return false;
  }
  uv_fs_req_cleanup(&open_req);
  uv_fs_req_cleanup(&close_req);
  return true;
}

Persistent<FunctionTemplate> Nodehun::SpellDictionary::constructor;

void Nodehun::SpellDictionary::Init(Handle<Object> target) {
  HandleScope scope;
  
  Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
  Local<String> name = String::NewSymbol("Dictionary");
  
  constructor = Persistent<FunctionTemplate>::New(tpl);
  constructor->InstanceTemplate()->SetInternalFieldCount(5);
  constructor->SetClassName(name);
  
  NODE_SET_PROTOTYPE_METHOD(constructor, "spellSuggest", spellSuggest);
  NODE_SET_PROTOTYPE_METHOD(constructor, "spellSuggestions", spellSuggestions);
  NODE_SET_PROTOTYPE_METHOD(constructor,"addDictionary", addDictionary);
  NODE_SET_PROTOTYPE_METHOD(constructor,"addWord", addWord);
  NODE_SET_PROTOTYPE_METHOD(constructor,"removeWord", removeWord);
  
  target->Set(name, constructor->GetFunction());
}

Nodehun::SpellDictionary::SpellDictionary(const char *language){
  std::string path, affPath, dicPath;
  path.append(Nodehun::_dictionariesPath);
  path.append(language);
  path.append(__SLASH__);
  path.append(language);
  
  affPath.append(path);
  dicPath.append(path);
  affPath.append(".aff");
  dicPath.append(".dic");
  
  pathsExist = Nodehun::dictionaryDirectoryExists(affPath.c_str()) && Nodehun::dictionaryDirectoryExists(dicPath.c_str());
  if(pathsExist)
    spellClass = new Hunspell(affPath.c_str(), dicPath.c_str(),NULL,false);
}

Nodehun::SpellDictionary::SpellDictionary(const char *affbuf, const char *dictbuf){
  pathsExist = true;
  spellClass = new Hunspell(affbuf, dictbuf,NULL,false);
}

Handle<Value> Nodehun::SpellDictionary::New(const Arguments& args) {
  HandleScope scope;
  int argl = args.Length();
  if (!args.IsConstructCall())
    return ThrowException(Exception::TypeError(String::New("Use the new operator to create instances of this object.")));
  if(argl < 1 || !args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));

  String::Utf8Value arg0(args[0]->ToString());
  Nodehun::SpellDictionary * obj;
  if(argl == 1 || argl > 1 && !args[1]->IsString()){    
    obj = new Nodehun::SpellDictionary(*arg0);
    if(!obj->pathsExist)
      return ThrowException(Exception::TypeError(String::New("No such dictionary exists.")));
  }
  else {
    String::Utf8Value arg1(args[1]->ToString());
    obj = new Nodehun::SpellDictionary(*arg0,*arg1);
    if(!obj->pathsExist)
      return ThrowException(Exception::TypeError(String::New("There was an error compiling either the affix or dictionary file you passed. Perhaps one or both of them is invalid.")));
  }
  obj->Wrap(args.This());  
  return args.This();
}

Handle<Value> Nodehun::SpellDictionary::spellSuggest(const Arguments& args) {
  HandleScope scope;
  if (args.Length() < 2) 
    return ThrowException(Exception::TypeError(String::New("Missing required arguments.")));
  if(!args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));
  if(!args[1]->IsFunction())
    return ThrowException(Exception::TypeError(String::New("Second argument must be a function.")));

  Nodehun::SpellDictionary* obj = ObjectWrap::Unwrap<Nodehun::SpellDictionary>(args.This());
  
  String::Utf8Value arg0(args[0]->ToString());
  Local<Function> callback = Local<Function>::Cast(args[1]);
  
  Nodehun::SpellData* spellData = new Nodehun::SpellData();
  spellData->request.data = spellData;
  spellData->callback = Persistent<Function>::New(callback);
  spellData->word.append(*arg0);
  
  spellData->spellClass = obj->spellClass;
  spellData->multiple = false;
  uv_queue_work(uv_default_loop(), &spellData->request,
		Nodehun::SpellDictionary::CheckSuggestions, Nodehun::SpellDictionary::SendSuggestions);
  return Undefined();
}

Handle<Value> Nodehun::SpellDictionary::spellSuggestions(const Arguments& args) {
  HandleScope scope;
  if (args.Length() < 2) 
    return ThrowException(Exception::TypeError(String::New("Missing required arguments.")));
  if(!args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));
  if(!args[1]->IsFunction())
    return ThrowException(Exception::TypeError(String::New("Second argument must be a function.")));

  Nodehun::SpellDictionary* obj = ObjectWrap::Unwrap<Nodehun::SpellDictionary>(args.This());
  
  String::Utf8Value arg0(args[0]->ToString());
  Local<Function> callback = Local<Function>::Cast(args[1]);
  
  Nodehun::SpellData* spellData = new Nodehun::SpellData();
  spellData->request.data = spellData;
  spellData->callback = Persistent<Function>::New(callback);
  spellData->word.append(*arg0);
  
  spellData->spellClass = obj->spellClass;
  spellData->multiple = true;
  uv_queue_work(uv_default_loop(), &spellData->request,
		Nodehun::SpellDictionary::CheckSuggestions, Nodehun::SpellDictionary::SendSuggestions);
  return Undefined();
}

void Nodehun::SpellDictionary::CheckSuggestions(uv_work_t* request) {
  Nodehun::SpellData* spellData = static_cast<Nodehun::SpellData*>(request->data);
  spellData->wordCorrect = spellData->spellClass->spell(spellData->word.c_str());
  if (!spellData->wordCorrect && spellData->multiple)
    spellData->numSuggest = spellData->spellClass->suggest(&(spellData->suggestions),spellData->word.c_str());
  else
    spellData->numSuggest = 0;
}

void Nodehun::SpellDictionary::SendSuggestions( uv_work_t* request, int status ){
  HandleScope scope;
  Nodehun::SpellData* spellData = static_cast<Nodehun::SpellData*>(request->data);
  
  const unsigned argc = 2;
  Local<Value> argv[argc];
  argv[0] = Local<Value>::New(Boolean::New(spellData->wordCorrect));
  if(spellData->wordCorrect || spellData->numSuggest == 0){
    if(spellData->multiple)
      argv[1] = Array::New(0);
    else
      argv[1] = Local<Value>::New(Null());
  }
  else if(spellData->numSuggest > 0){
    if(spellData->multiple){
      Local<Array> suglist = Array::New(spellData->numSuggest);
      for(int i = 0; i < spellData->numSuggest; i++)
	suglist->Set(i,String::New(spellData->suggestions[i]));
      argv[1] = suglist;
    }
    else{
      argv[1] = String::New(spellData->suggestions[0]);
    }
    spellData->spellClass->free_list(&(spellData->suggestions),spellData->numSuggest);
    spellData->suggestions = NULL;
  }
  
  TryCatch try_catch;
  spellData->callback->Call(Context::GetCurrent()->Global(), argc, argv);
  if (try_catch.HasCaught())
    node::FatalException(try_catch);
  spellData->callback.Dispose();
  delete spellData;
}

Handle<Value> Nodehun::SpellDictionary::addDictionary(const Arguments& args) {
  HandleScope scope;
  int argl = args.Length();
  if (argl < 1 || !args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));
  
  Nodehun::SpellDictionary* obj = ObjectWrap::Unwrap<Nodehun::SpellDictionary>(args.This());
  Nodehun::DictData* dictData = new Nodehun::DictData();
  String::Utf8Value arg0(args[0]->ToString());
  dictData->notpath = false;
  dictData->callbackExists = false;

  if(argl > 1 && args[1]->IsFunction()){
    Local<Function> callback = Local<Function>::Cast(args[1]);
    dictData->callback = Persistent<Function>::New(callback);
    dictData->callbackExists = true;
  }
  else if(argl > 1 && args[1]->IsBoolean()){
    dictData->notpath = args[1]->BooleanValue();
  }

  if(!dictData->callbackExists && argl > 2 && args[2]->IsFunction()){
    Local<Function> callback = Local<Function>::Cast(args[2]);
    dictData->callback = Persistent<Function>::New(callback);
    dictData->callbackExists = true;
  }



  if(!dictData->notpath){
    dictData->path.append(Nodehun::_dictionariesPath);
    dictData->path.append(*arg0);
    dictData->path.append(__SLASH__);
    dictData->path.append(*arg0);
    dictData->path.append(".dic");
  }
  
  dictData->dict = (char*)malloc(strlen(*arg0)+1);
  strcpy(dictData->dict,*arg0);
  dictData->spellClass = obj->spellClass;
  dictData->request.data = dictData;

  uv_queue_work(uv_default_loop(), &dictData->request,
		Nodehun::SpellDictionary::addDictionaryWork, Nodehun::SpellDictionary::addDictionaryFinish);
  return Undefined();
}

void Nodehun::SpellDictionary::addDictionaryWork(uv_work_t* request){
  Nodehun::DictData* dictData = static_cast<Nodehun::DictData*>(request->data);
  
  if(!dictData->notpath && !Nodehun::dictionaryDirectoryExists(dictData->path.c_str())){
    dictData->success = false;
  }
  else{
    int status = dictData->spellClass->add_dic(dictData->dict,dictData->notpath);
    dictData->success = status == 0;
  }
}

void Nodehun::SpellDictionary::addDictionaryFinish(uv_work_t* request, int status){
  HandleScope scope;
  Nodehun::DictData* dictData = static_cast<Nodehun::DictData*>(request->data);
  
  if(dictData->callbackExists){
    const unsigned argc = 2;
    Local<Value> argv[argc];
    argv[0] = Local<Value>::New(Boolean::New(dictData->success));
    argv[1] = Local<Value>::New(String::New(dictData->dict));
    TryCatch try_catch;
    dictData->callback->Call(Context::GetCurrent()->Global(), argc, argv);
    if (try_catch.HasCaught()) {
      node::FatalException(try_catch);
    }
    dictData->callback.Dispose();
  }
  free(dictData->dict);
  delete dictData;
}

Handle<Value> Nodehun::SpellDictionary::addWord(const Arguments& args) {
  HandleScope scope;
  
  if (args.Length() < 1 || !args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));

  Nodehun::SpellDictionary* obj = ObjectWrap::Unwrap<Nodehun::SpellDictionary>(args.This());
  String::Utf8Value arg0(args[0]->ToString());
  Nodehun::WordData* wordData = new Nodehun::WordData();
  if(args.Length() > 1 && args[1]->IsFunction()){
    Local<Function> callback = Local<Function>::Cast(args[1]);
    wordData->callback = Persistent<Function>::New(callback);
    wordData->callbackExists = true;
  }
  else{
    wordData->callbackExists = false;
  }
  //add word
  wordData->removeWord = false;
  wordData->word.append(*arg0);
  wordData->spellClass = obj->spellClass;
  wordData->request.data = wordData;
  
  uv_queue_work(uv_default_loop(), &wordData->request,
		Nodehun::SpellDictionary::addRemoveWordWork, Nodehun::SpellDictionary::addRemoveWordFinish);
  return Undefined();
}

Handle<Value> Nodehun::SpellDictionary::removeWord(const Arguments& args) {
  HandleScope scope;
  
  if (args.Length() < 1 || !args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));

  Nodehun::SpellDictionary* obj = ObjectWrap::Unwrap<Nodehun::SpellDictionary>(args.This());
  String::Utf8Value arg0(args[0]->ToString());
  Nodehun::WordData* wordData = new Nodehun::WordData();
  if(args.Length() > 1 && args[1]->IsFunction()){
    Local<Function> callback = Local<Function>::Cast(args[1]);
    wordData->callback = Persistent<Function>::New(callback);
    wordData->callbackExists = true;
  }
  else{
    wordData->callbackExists = false;
  }
  //remove word
  wordData->removeWord = true;
  wordData->word.append(*arg0);
  wordData->spellClass = obj->spellClass;
  wordData->request.data = wordData;
  
  uv_queue_work(uv_default_loop(), &wordData->request,
		Nodehun::SpellDictionary::addRemoveWordWork, Nodehun::SpellDictionary::addRemoveWordFinish);
  return Undefined();
}

void Nodehun::SpellDictionary::addRemoveWordWork(uv_work_t* request){
  Nodehun::WordData* wordData = static_cast<Nodehun::WordData*>(request->data);
  int status;
  if(wordData->removeWord)
    status = wordData->spellClass->remove(wordData->word.c_str());
  else
    status = wordData->spellClass->add(wordData->word.c_str());
  wordData->success = status == 0;
}

void Nodehun::SpellDictionary::addRemoveWordFinish(uv_work_t* request, int status){
  HandleScope scope;
  Nodehun::WordData* wordData = static_cast<Nodehun::WordData*>(request->data);
  
  if(wordData->callbackExists){
    const unsigned argc = 2;
    Local<Value> argv[argc];
    argv[0] = Local<Value>::New(Boolean::New(wordData->success));
    argv[1] = Local<Value>::New(String::New(wordData->word.c_str()));
    TryCatch try_catch;
    wordData->callback->Call(Context::GetCurrent()->Global(), argc, argv);

    if (try_catch.HasCaught())
      node::FatalException(try_catch);

    wordData->callback.Dispose();
  }
  delete wordData;
}

Handle<Value> Nodehun::SetDictionariesPath(const Arguments& args) {
  HandleScope scope;
  if (args.Length() < 1 || !args[0]->IsString())
    return ThrowException(Exception::TypeError(String::New("First argument must be a string.")));

  String::Utf8Value arg0(args[0]->ToString());
  Nodehun::_dictionariesPath = *arg0;
  return scope.Close(Undefined());
}

void Nodehun::RegisterModule(Handle<Object> target) {
  HandleScope scope;
  SpellDictionary::Init(target);
  target->Set(String::NewSymbol("_setDictionariesPath"),
	      FunctionTemplate::New(Nodehun::SetDictionariesPath)->GetFunction());
}

NODE_MODULE(nodehun, Nodehun::RegisterModule);
