//this file could be a standard one that loads everything the ux needs.

//this could work pretty well - load this file in development and use it
//with the normal SDK Tools builder to build a ux/auth/package.js file (or similar name)
//that contains everything that was loaded by this file.

Ext.require([
    "Ext.ux.auth.model.Session",
    "Ext.ux.auth.controller.Sessions"
]);