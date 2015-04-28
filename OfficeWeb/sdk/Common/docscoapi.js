/*
 * (c) Copyright Ascensio System SIA 2010-2015
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 "use strict";
(function (window, undefined) {
    var asc = window["Asc"];
    var asc_coAuthV = "3.0.8";
    function CDocsCoApi(options) {
        this._CoAuthoringApi = new DocsCoApi();
        this._onlineWork = false;
        if (options) {
            this.onAuthParticipantsChanged = options.onAuthParticipantsChanged;
            this.onParticipantsChanged = options.onParticipantsChanged;
            this.onMessage = options.onMessage;
            this.onLocksAcquired = options.onLocksAcquired;
            this.onLocksReleased = options.onLocksReleased;
            this.onLocksReleasedEnd = options.onLocksReleasedEnd;
            this.onDisconnect = options.onDisconnect;
            this.onFirstLoadChangesEnd = options.onFirstLoadChangesEnd;
            this.onConnectionStateChanged = options.onConnectionStateChanged;
            this.onSetIndexUser = options.onSetIndexUser;
            this.onSaveChanges = options.onSaveChanges;
            this.onStartCoAuthoring = options.onStartCoAuthoring;
            this.onEndCoAuthoring = options.onEndCoAuthoring;
            this.onUnSaveLock = options.onUnSaveLock;
            this.onRecalcLocks = options.onRecalcLocks;
        }
    }
    CDocsCoApi.prototype.init = function (user, docid, documentCallbackUrl, token, callback, editorType, documentFormatSave, isViewer) {
        if (this._CoAuthoringApi && this._CoAuthoringApi.isRightURL()) {
            var t = this;
            this._CoAuthoringApi.onAuthParticipantsChanged = function (e, count) {
                t.callback_OnAuthParticipantsChanged(e, count);
            };
            this._CoAuthoringApi.onParticipantsChanged = function (e, count) {
                t.callback_OnParticipantsChanged(e, count);
            };
            this._CoAuthoringApi.onMessage = function (e, clear) {
                t.callback_OnMessage(e, clear);
            };
            this._CoAuthoringApi.onLocksAcquired = function (e) {
                t.callback_OnLocksAcquired(e);
            };
            this._CoAuthoringApi.onLocksReleased = function (e, bChanges) {
                t.callback_OnLocksReleased(e, bChanges);
            };
            this._CoAuthoringApi.onLocksReleasedEnd = function () {
                t.callback_OnLocksReleasedEnd();
            };
            this._CoAuthoringApi.onDisconnect = function (e, isDisconnectAtAll, isCloseCoAuthoring) {
                t.callback_OnDisconnect(e, isDisconnectAtAll, isCloseCoAuthoring);
            };
            this._CoAuthoringApi.onFirstLoadChangesEnd = function () {
                t.callback_OnFirstLoadChangesEnd();
            };
            this._CoAuthoringApi.onConnectionStateChanged = function (e) {
                t.callback_OnConnectionStateChanged(e);
            };
            this._CoAuthoringApi.onSetIndexUser = function (e) {
                t.callback_OnSetIndexUser(e);
            };
            this._CoAuthoringApi.onSaveChanges = function (e, userId, bFirstLoad) {
                t.callback_OnSaveChanges(e, userId, bFirstLoad);
            };
            this._CoAuthoringApi.onStartCoAuthoring = function (e) {
                t.callback_OnStartCoAuthoring(e);
            };
            this._CoAuthoringApi.onEndCoAuthoring = function (e) {
                t.callback_OnEndCoAuthoring(e);
            };
            this._CoAuthoringApi.onUnSaveLock = function () {
                t.callback_OnUnSaveLock();
            };
            this._CoAuthoringApi.onRecalcLocks = function (e) {
                t.callback_OnRecalcLocks(e);
            };
            this._CoAuthoringApi.init(user, docid, documentCallbackUrl, token, callback, editorType, documentFormatSave, isViewer);
            this._onlineWork = true;
        } else {
            this.callback_OnSetIndexUser("123");
            this.onFirstLoadChangesEnd();
        }
    };
    CDocsCoApi.prototype.set_url = function (url) {
        if (this._CoAuthoringApi) {
            this._CoAuthoringApi.set_url(url);
        }
    };
    CDocsCoApi.prototype.get_onlineWork = function () {
        return this._onlineWork;
    };
    CDocsCoApi.prototype.get_state = function () {
        if (this._CoAuthoringApi) {
            return this._CoAuthoringApi.get_state();
        }
        return 0;
    };
    CDocsCoApi.prototype.getMessages = function () {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.getMessages();
        }
    };
    CDocsCoApi.prototype.sendMessage = function (message) {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.sendMessage(message);
        }
    };
    CDocsCoApi.prototype.askLock = function (arrayBlockId, callback) {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.askLock(arrayBlockId, callback);
        } else {
            var t = this;
            window.setTimeout(function () {
                if (callback && _.isFunction(callback)) {
                    var lengthArray = (arrayBlockId) ? arrayBlockId.length : 0;
                    if (0 < lengthArray) {
                        callback({
                            "lock": arrayBlockId[0]
                        });
                        for (var i = 0; i < lengthArray; ++i) {
                            t.callback_OnLocksAcquired({
                                "state": 2,
                                "block": arrayBlockId[i]
                            });
                        }
                    }
                }
            },
            1);
        }
    };
    CDocsCoApi.prototype.askSaveChanges = function (callback) {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.askSaveChanges(callback);
        } else {
            window.setTimeout(function () {
                if (callback && _.isFunction(callback)) {
                    callback({
                        "saveLock": false
                    });
                }
            },
            100);
        }
    };
    CDocsCoApi.prototype.unSaveLock = function () {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.unSaveLock();
        } else {
            var t = this;
            window.setTimeout(function () {
                t.callback_OnUnSaveLock();
            },
            100);
        }
    };
    CDocsCoApi.prototype.saveChanges = function (arrayChanges, deleteIndex, excelAdditionalInfo) {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.saveChanges(arrayChanges, null, deleteIndex, excelAdditionalInfo);
        }
    };
    CDocsCoApi.prototype.unLockDocument = function (isSave) {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.unLockDocument(isSave);
        }
    };
    CDocsCoApi.prototype.getUsers = function () {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.getUsers();
        }
    };
    CDocsCoApi.prototype.getUser = function (userId) {
        if (this._CoAuthoringApi && this._onlineWork) {
            return this._CoAuthoringApi.getUser(userId);
        }
        return null;
    };
    CDocsCoApi.prototype.releaseLocks = function (blockId) {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.releaseLocks(blockId);
        }
    };
    CDocsCoApi.prototype.disconnect = function () {
        if (this._CoAuthoringApi && this._onlineWork) {
            this._CoAuthoringApi.disconnect();
        }
    };
    CDocsCoApi.prototype.callback_OnAuthParticipantsChanged = function (e, count) {
        if (this.onAuthParticipantsChanged) {
            this.onAuthParticipantsChanged(e, count);
        }
    };
    CDocsCoApi.prototype.callback_OnParticipantsChanged = function (e, count) {
        if (this.onParticipantsChanged) {
            this.onParticipantsChanged(e, count);
        }
    };
    CDocsCoApi.prototype.callback_OnMessage = function (e, clear) {
        if (this.onMessage) {
            this.onMessage(e, clear);
        }
    };
    CDocsCoApi.prototype.callback_OnLocksAcquired = function (e) {
        if (this.onLocksAcquired) {
            this.onLocksAcquired(e);
        }
    };
    CDocsCoApi.prototype.callback_OnLocksReleased = function (e, bChanges) {
        if (this.onLocksReleased) {
            this.onLocksReleased(e, bChanges);
        }
    };
    CDocsCoApi.prototype.callback_OnLocksReleasedEnd = function () {
        if (this.onLocksReleasedEnd) {
            this.onLocksReleasedEnd();
        }
    };
    CDocsCoApi.prototype.callback_OnDisconnect = function (e, isDisconnectAtAll, isCloseCoAuthoring) {
        if (this.onDisconnect) {
            this.onDisconnect(e, isDisconnectAtAll, isCloseCoAuthoring);
        }
    };
    CDocsCoApi.prototype.callback_OnFirstLoadChangesEnd = function () {
        if (this.onFirstLoadChangesEnd) {
            this.onFirstLoadChangesEnd();
        }
    };
    CDocsCoApi.prototype.callback_OnConnectionStateChanged = function (e) {
        if (this.onConnectionStateChanged) {
            this.onConnectionStateChanged(e);
        }
    };
    CDocsCoApi.prototype.callback_OnSetIndexUser = function (e) {
        if (this.onSetIndexUser) {
            this.onSetIndexUser(e);
        }
    };
    CDocsCoApi.prototype.callback_OnSaveChanges = function (e, userId, bFirstLoad) {
        if (this.onSaveChanges) {
            this.onSaveChanges(e, userId, bFirstLoad);
        }
    };
    CDocsCoApi.prototype.callback_OnStartCoAuthoring = function (e) {
        if (this.onStartCoAuthoring) {
            this.onStartCoAuthoring(e);
        }
    };
    CDocsCoApi.prototype.callback_OnEndCoAuthoring = function (e) {
        if (this.onEndCoAuthoring) {
            this.onEndCoAuthoring(e);
        }
    };
    CDocsCoApi.prototype.callback_OnUnSaveLock = function () {
        if (this.onUnSaveLock) {
            this.onUnSaveLock();
        }
    };
    CDocsCoApi.prototype.callback_OnRecalcLocks = function (e) {
        if (this.onRecalcLocks) {
            this.onRecalcLocks(e);
        }
    };
    function LockBufferElement(arrayBlockId, callback) {
        this._arrayBlockId = arrayBlockId;
        this._callback = callback;
    }
    function DocsCoApi(options) {
        if (options) {
            this.onAuthParticipantsChanged = options.onAuthParticipantsChanged;
            this.onParticipantsChanged = options.onParticipantsChanged;
            this.onMessage = options.onMessage;
            this.onLocksAcquired = options.onLocksAcquired;
            this.onLocksReleased = options.onLocksReleased;
            this.onLocksReleasedEnd = options.onLocksReleasedEnd;
            this.onRelockFailed = options.onRelockFailed;
            this.onDisconnect = options.onDisconnect;
            this.onConnect = options.onConnect;
            this.onSaveChanges = options.onSaveChanges;
            this.onFirstLoadChangesEnd = options.onFirstLoadChangesEnd;
            this.onConnectionStateChanged = options.onConnectionStateChanged;
            this.onUnSaveLock = options.onUnSaveLock;
            this.onRecalcLocks = options.onRecalcLocks;
        }
        this._state = ConnectionState.None;
        this._participants = {};
        this._countEditUsers = 0;
        this._countUsers = 0;
        this._locks = {};
        this._msgBuffer = [];
        this._lockCallbacks = {};
        this._saveCallback = [];
        this.saveLockCallbackErrorTimeOutId = null;
        this.saveCallbackErrorTimeOutId = null;
        this.unSaveLockCallbackErrorTimeOutId = null;
        this._id = null;
        this._indexUser = -1;
        this.isCoAuthoring = false;
        this.isCloseCoAuthoring = false;
        this.maxCountSaveChanges = 20000;
        this.currentIndex = 0;
        this.deleteIndex = 0;
        this.arrayChanges = null;
        this.lastOtherSaveTime = -1;
        this.changesIndex = 0;
        this.excelAdditionalInfo = null;
        this._url = "";
        this.reconnectTimeout = null;
        this.attemptCount = 0;
        this.maxAttemptCount = 50;
        this.reconnectInterval = 2000;
        this.errorTimeOut = 10000;
        this.errorTimeOutSave = 60000;
        this._docid = null;
        this._documentCallbackUrl = null;
        this._token = null;
        this._user = null;
        this._userId = "Anonymous";
        this._initCallback = null;
        this.ownedLockBlocks = [];
        this.sockjs_url = null;
        this.sockjs = null;
        this.editorType = -1;
        this._isExcel = false;
        this._isPresentation = false;
        this._isAuth = false;
        this._documentFormatSave = 0;
        this._isViewer = false;
        this._isReSaveAfterAuth = false;
        this._lockBuffer = [];
    }
    DocsCoApi.prototype.isRightURL = function () {
        return ("" != this._url);
    };
    DocsCoApi.prototype.set_url = function (url) {
        this._url = url;
    };
    DocsCoApi.prototype.get_state = function () {
        return this._state;
    };
    DocsCoApi.prototype.get_indexUser = function () {
        return this._indexUser;
    };
    DocsCoApi.prototype.getSessionId = function () {
        return this._id;
    };
    DocsCoApi.prototype.getUser = function () {
        return this._user;
    };
    DocsCoApi.prototype.getLocks = function () {
        return this._locks;
    };
    DocsCoApi.prototype._sendBufferedLocks = function () {
        var elem;
        for (var i = 0, length = this._lockBuffer.length; i < length; ++i) {
            elem = this._lockBuffer[i];
            this.askLock(elem._arrayBlockId, elem._callback);
        }
        this._lockBuffer = [];
    };
    DocsCoApi.prototype.askLock = function (arrayBlockId, callback) {
        if (ConnectionState.SaveChanges === this._state) {
            this._lockBuffer.push(new LockBufferElement(arrayBlockId, callback));
            return;
        }
        var i = 0;
        var lengthArray = (arrayBlockId) ? arrayBlockId.length : 0;
        var isLock = false;
        var idLockInArray = null;
        for (; i < lengthArray; ++i) {
            idLockInArray = (this._isExcel || this._isPresentation) ? arrayBlockId[i]["guid"] : arrayBlockId[i];
            if (this._locks[idLockInArray] && 0 !== this._locks[idLockInArray].state) {
                isLock = true;
                break;
            }
        }
        if (0 === lengthArray) {
            isLock = true;
        }
        idLockInArray = (this._isExcel || this._isPresentation) ? arrayBlockId[0]["guid"] : arrayBlockId[0];
        if (!isLock) {
            this._locks[idLockInArray] = {
                "state": 1
            };
            if (callback && _.isFunction(callback)) {
                this._lockCallbacks[idLockInArray] = callback;
                var lockCalbacks = this._lockCallbacks;
                window.setTimeout(function () {
                    if (lockCalbacks.hasOwnProperty(idLockInArray)) {
                        callback({
                            error: "Timed out"
                        });
                        delete lockCalbacks[idLockInArray];
                    }
                },
                this.errorTimeOut);
            }
            this._send({
                "type": "getLock",
                "editorType": this.editorType,
                "block": arrayBlockId
            });
        } else {
            window.setTimeout(function () {
                if (callback && _.isFunction(callback)) {
                    callback({
                        error: idLockInArray + "-lock"
                    });
                }
            },
            100);
        }
    };
    DocsCoApi.prototype.askSaveChanges = function (callback) {
        if (this._saveCallback[this._saveCallback.length - 1]) {
            return;
        }
        if (null !== this.saveLockCallbackErrorTimeOutId) {
            clearTimeout(this.saveLockCallbackErrorTimeOutId);
        }
        if (ConnectionState.Reconnect === this._state) {
            this.saveLockCallbackErrorTimeOutId = window.setTimeout(function () {
                if (callback && _.isFunction(callback)) {
                    callback({
                        error: "No connection"
                    });
                }
            },
            100);
            return;
        }
        if (callback && _.isFunction(callback)) {
            var t = this;
            var indexCallback = this._saveCallback.length;
            this._saveCallback[indexCallback] = callback;
            this.saveLockCallbackErrorTimeOutId = window.setTimeout(function () {
                t.saveLockCallbackErrorTimeOutId = null;
                var oTmpCallback = t._saveCallback[indexCallback];
                if (oTmpCallback) {
                    t._saveCallback[indexCallback] = null;
                    oTmpCallback({
                        error: "Timed out"
                    });
                }
            },
            this.errorTimeOut);
        }
        this._send({
            "type": "isSaveLock"
        });
    };
    DocsCoApi.prototype.unSaveLock = function () {
        var t = this;
        this.unSaveLockCallbackErrorTimeOutId = window.setTimeout(function () {
            t.unSaveLockCallbackErrorTimeOutId = null;
            t.unSaveLock();
        },
        this.errorTimeOut);
        this._send({
            "type": "unSaveLock"
        });
    };
    DocsCoApi.prototype.releaseLocks = function (blockId) {
        if (this._locks[blockId] && 2 === this._locks[blockId].state) {
            this._locks[blockId] = {
                "state": 0
            };
        }
    };
    DocsCoApi.prototype._reSaveChanges = function () {
        this.saveChanges(this.arrayChanges, this.currentIndex);
    };
    DocsCoApi.prototype.saveChanges = function (arrayChanges, currentIndex, deleteIndex, excelAdditionalInfo) {
        if (null === currentIndex) {
            this.deleteIndex = deleteIndex;
            if (null != this.deleteIndex && -1 !== this.deleteIndex) {
                this.deleteIndex += this.changesIndex;
            }
            this.currentIndex = 0;
            this.arrayChanges = arrayChanges;
            this.excelAdditionalInfo = excelAdditionalInfo;
        } else {
            this.currentIndex = currentIndex;
        }
        var startIndex = this.currentIndex * this.maxCountSaveChanges;
        var endIndex = Math.min(this.maxCountSaveChanges * (this.currentIndex + 1), arrayChanges.length);
        if (endIndex === arrayChanges.length) {
            for (var key in this._locks) {
                if (this._locks.hasOwnProperty(key)) {
                    if (2 === this._locks[key].state) {
                        delete this._locks[key];
                    }
                }
            }
        }
        var t = this;
        this.saveCallbackErrorTimeOutId = window.setTimeout(function () {
            t.saveCallbackErrorTimeOutId = null;
            t._reSaveChanges();
        },
        this.errorTimeOutSave);
        this._state = ConnectionState.SaveChanges;
        this._send({
            "type": "saveChanges",
            "changes": JSON.stringify(arrayChanges.slice(startIndex, endIndex)),
            "startSaveChanges": (startIndex === 0),
            "endSaveChanges": (endIndex === arrayChanges.length),
            "isCoAuthoring": this.isCoAuthoring,
            "isExcel": this._isExcel,
            "deleteIndex": this.deleteIndex,
            "excelAdditionalInfo": this.excelAdditionalInfo ? JSON.stringify(this.excelAdditionalInfo) : null
        });
    };
    DocsCoApi.prototype.unLockDocument = function (isSave) {
        this._send({
            "type": "unLockDocument",
            "isSave": isSave
        });
    };
    DocsCoApi.prototype.getUsers = function () {
        if (this.onAuthParticipantsChanged) {
            this.onAuthParticipantsChanged(this._participants, this._countUsers);
        }
    };
    DocsCoApi.prototype.getUser = function (userId) {
        return this._participants[userId];
    };
    DocsCoApi.prototype.disconnect = function () {
        this.isCloseCoAuthoring = true;
        return this.sockjs.close();
    };
    DocsCoApi.prototype.getMessages = function () {
        this._send({
            "type": "getMessages"
        });
    };
    DocsCoApi.prototype.sendMessage = function (message) {
        if (typeof message === "string") {
            this._send({
                "type": "message",
                "message": message
            });
        }
    };
    DocsCoApi.prototype._sendPrebuffered = function () {
        for (var i = 0; i < this._msgBuffer.length; i++) {
            this._send(this._msgBuffer[i]);
        }
        this._msgBuffer = [];
    };
    DocsCoApi.prototype._send = function (data) {
        if (data !== null && typeof data === "object") {
            if (this._state > 0) {
                this.sockjs.send(JSON.stringify(data));
            } else {
                this._msgBuffer.push(data);
            }
        }
    };
    DocsCoApi.prototype._onMessages = function (data, clear) {
        if (data["messages"] && this.onMessage) {
            this.onMessage(data["messages"], clear);
        }
    };
    DocsCoApi.prototype._onGetLock = function (data) {
        if (data["locks"]) {
            for (var key in data["locks"]) {
                if (data["locks"].hasOwnProperty(key)) {
                    var lock = data["locks"][key],
                    blockTmp = (this._isExcel || this._isPresentation) ? lock["block"]["guid"] : key,
                    blockValue = (this._isExcel || this._isPresentation) ? lock["block"] : key;
                    if (lock !== null) {
                        var changed = true;
                        if (this._locks[blockTmp] && 1 !== this._locks[blockTmp].state) {
                            changed = !(this._locks[blockTmp].state === (lock["sessionId"] === this._id ? 2 : 3) && this._locks[blockTmp]["user"] === lock["user"] && this._locks[blockTmp]["time"] === lock["time"] && this._locks[blockTmp]["block"] === blockTmp);
                        }
                        if (changed) {
                            this._locks[blockTmp] = {
                                "state": lock["sessionId"] === this._id ? 2 : 3,
                                "user": lock["user"],
                                "time": lock["time"],
                                "block": blockTmp,
                                "blockValue": blockValue
                            };
                        }
                        if (this._lockCallbacks.hasOwnProperty(blockTmp) && this._lockCallbacks[blockTmp] !== null && _.isFunction(this._lockCallbacks[blockTmp])) {
                            if (lock["sessionId"] === this._id) {
                                this._lockCallbacks[blockTmp]({
                                    "lock": this._locks[blockTmp]
                                });
                            } else {
                                this._lockCallbacks[blockTmp]({
                                    "error": "Already locked by " + lock["user"]
                                });
                            }
                            delete this._lockCallbacks[blockTmp];
                        }
                        if (this.onLocksAcquired && changed) {
                            this.onLocksAcquired(this._locks[blockTmp]);
                        }
                    }
                }
            }
        }
    };
    DocsCoApi.prototype._onReleaseLock = function (data) {
        if (data["locks"]) {
            var bSendEnd = false;
            for (var block in data["locks"]) {
                if (data["locks"].hasOwnProperty(block)) {
                    var lock = data["locks"][block],
                    blockTmp = (this._isExcel || this._isPresentation) ? lock["block"]["guid"] : lock["block"];
                    if (lock !== null) {
                        this._locks[blockTmp] = {
                            "state": 0,
                            "user": lock["user"],
                            "time": lock["time"],
                            "changes": lock["changes"],
                            "block": lock["block"]
                        };
                        if (this.onLocksReleased) {
                            this.onLocksReleased(this._locks[blockTmp], false);
                            bSendEnd = true;
                        }
                    }
                }
            }
            if (bSendEnd && this.onLocksReleasedEnd) {
                this.onLocksReleasedEnd();
            }
        }
    };
    DocsCoApi.prototype._onSaveChanges = function (data) {
        if (data["locks"]) {
            var bSendEnd = false;
            for (var block in data["locks"]) {
                if (data["locks"].hasOwnProperty(block)) {
                    var lock = data["locks"][block],
                    blockTmp = (this._isExcel || this._isPresentation) ? lock["block"]["guid"] : lock["block"];
                    if (lock !== null) {
                        this._locks[blockTmp] = {
                            "state": 0,
                            "user": lock["user"],
                            "time": lock["time"],
                            "changes": lock["changes"],
                            "block": lock["block"]
                        };
                        if (this.onLocksReleased) {
                            this.onLocksReleased(this._locks[blockTmp], true);
                            bSendEnd = true;
                        }
                    }
                }
            }
            if (bSendEnd && this.onLocksReleasedEnd) {
                this.onLocksReleasedEnd();
            }
        }
        this._updateChanges(data["changes"], data["changesIndex"], false);
        if (this.onRecalcLocks) {
            this.onRecalcLocks(data["excelAdditionalInfo"]);
        }
    };
    DocsCoApi.prototype._onStartCoAuthoring = function (isStartEvent) {
        if (false === this.isCoAuthoring) {
            this.isCoAuthoring = true;
            if (this.onStartCoAuthoring) {
                this.onStartCoAuthoring(isStartEvent);
            }
        }
    };
    DocsCoApi.prototype._onEndCoAuthoring = function (isStartEvent) {
        if (true === this.isCoAuthoring) {
            this.isCoAuthoring = false;
            if (this.onEndCoAuthoring) {
                this.onEndCoAuthoring(isStartEvent);
            }
        }
    };
    DocsCoApi.prototype._onSaveLock = function (data) {
        if (undefined != data["saveLock"] && null != data["saveLock"]) {
            var indexCallback = this._saveCallback.length - 1;
            var oTmpCallback = this._saveCallback[indexCallback];
            if (oTmpCallback) {
                if (null !== this.saveLockCallbackErrorTimeOutId) {
                    clearTimeout(this.saveLockCallbackErrorTimeOutId);
                }
                this._saveCallback[indexCallback] = null;
                oTmpCallback(data);
            }
        }
    };
    DocsCoApi.prototype._onUnSaveLock = function (data) {
        if (null !== this.saveCallbackErrorTimeOutId) {
            clearTimeout(this.saveCallbackErrorTimeOutId);
        }
        if (null !== this.unSaveLockCallbackErrorTimeOutId) {
            clearTimeout(this.unSaveLockCallbackErrorTimeOutId);
        }
        this._state = ConnectionState.Authorized;
        this._sendBufferedLocks();
        if (-1 !== data["index"]) {
            this.changesIndex = data["index"];
        }
        if (this.onUnSaveLock) {
            this.onUnSaveLock();
        }
    };
    DocsCoApi.prototype._updateChanges = function (allServerChanges, changesIndex, bFirstLoad) {
        if (this.onSaveChanges) {
            this.changesIndex = changesIndex;
            if (allServerChanges) {
                for (var i = 0; i < allServerChanges.length; ++i) {
                    var change = allServerChanges[i];
                    var changesOneUser = change["change"];
                    if (changesOneUser) {
                        if (change["user"] !== this._userId) {
                            this.lastOtherSaveTime = change["time"];
                        }
                        this.onSaveChanges(JSON.parse(changesOneUser), change["user"], bFirstLoad);
                    }
                }
            }
        }
    };
    DocsCoApi.prototype._onSetIndexUser = function (data) {
        if (this.onSetIndexUser) {
            this.onSetIndexUser(data);
        }
    };
    DocsCoApi.prototype._onSavePartChanges = function (data) {
        if (null !== this.saveCallbackErrorTimeOutId) {
            clearTimeout(this.saveCallbackErrorTimeOutId);
        }
        if (-1 !== data["changesIndex"]) {
            this.changesIndex = data["changesIndex"];
        }
        this.saveChanges(this.arrayChanges, this.currentIndex + 1);
    };
    DocsCoApi.prototype._onPreviousLocks = function (locks, previousLocks) {
        var i = 0;
        if (locks && previousLocks) {
            for (var block in locks) {
                if (locks.hasOwnProperty(block)) {
                    var lock = locks[block];
                    if (lock !== null && lock["block"]) {
                        for (i = 0; i < previousLocks.length; i++) {
                            if (previousLocks[i] === lock["block"] && lock["sessionId"] === this._id) {
                                previousLocks.remove(i);
                                break;
                            }
                        }
                    }
                }
            }
            if (previousLocks.length > 0 && this.onRelockFailed) {
                this.onRelockFailed(previousLocks);
            }
            previousLocks = [];
        }
    };
    DocsCoApi.prototype._onAuthParticipantsChanged = function (participants) {
        this._participants = {};
        this._countEditUsers = 0;
        this._countUsers = 0;
        if (participants) {
            var tmpUser;
            for (var i = 0; i < participants.length; ++i) {
                tmpUser = new asc.asc_CUser(participants[i]);
                this._participants[tmpUser.asc_getId()] = tmpUser;
                if (!tmpUser.asc_getView()) {
                    ++this._countEditUsers;
                }++this._countUsers;
            }
            if (this.onAuthParticipantsChanged) {
                this.onAuthParticipantsChanged(this._participants, this._countUsers);
            }
            if (1 < this._countEditUsers) {
                this._onStartCoAuthoring(true);
            } else {
                this._onEndCoAuthoring(true);
            }
        }
    };
    DocsCoApi.prototype._onConnectionStateChanged = function (data) {
        var userStateChanged = null,
        userId, stateChanged = false,
        isEditUser = true;
        if (undefined !== data["state"] && this.onConnectionStateChanged) {
            userStateChanged = new asc.asc_CUser(data);
            userId = userStateChanged.asc_getId();
            isEditUser = !userStateChanged.asc_getView();
            if (userStateChanged.asc_getState()) {
                this._participants[userId] = userStateChanged;
                ++this._countUsers;
                if (isEditUser) {
                    ++this._countEditUsers;
                }
                stateChanged = true;
            } else {
                if (this._participants.hasOwnProperty(userId)) {
                    delete this._participants[userId];
                    --this._countUsers;
                    if (isEditUser) {
                        --this._countEditUsers;
                    }
                    stateChanged = true;
                }
            }
            if (stateChanged) {
                if (1 < this._countEditUsers) {
                    this._onStartCoAuthoring(false);
                } else {
                    this._onEndCoAuthoring(false);
                }
                this.onParticipantsChanged(this._participants, this._countUsers);
                this.onConnectionStateChanged(userStateChanged);
            }
        }
    };
    DocsCoApi.prototype._onDrop = function (data) {
        this.disconnect();
        this.onDisconnect(data ? data["description"] : "", true, this.isCloseCoAuthoring);
    };
    DocsCoApi.prototype._onAuth = function (data) {
        if (true === this._isAuth) {
            this._state = ConnectionState.Authorized;
            this._onAuthParticipantsChanged(data["participants"]);
            this._onMessages(data, true);
            this._onGetLock(data);
            if (this._isReSaveAfterAuth) {
                var t = this;
                var callbackAskSaveChanges = function (e) {
                    if (false == e["saveLock"]) {
                        t._reSaveChanges();
                    } else {
                        setTimeout(function () {
                            t.askSaveChanges(callbackAskSaveChanges);
                        },
                        1000);
                    }
                };
                this.askSaveChanges(callbackAskSaveChanges);
            }
            return;
        }
        if (data["result"] === 1) {
            this._isAuth = true;
            this._state = ConnectionState.Authorized;
            this._id = data["sessionId"];
            this._onAuthParticipantsChanged(data["participants"]);
            this._onSetIndexUser(this._indexUser = data["indexUser"]);
            this._userId = this._user.asc_getId() + this._indexUser;
            this._onMessages(data, false);
            this._onGetLock(data);
            if (window["AscApplyChanges"] && window["AscChanges"]) {
                var userOfflineChanges = window["AscChanges"],
                changeOneUser;
                for (var i = 0; i < userOfflineChanges.length; ++i) {
                    changeOneUser = userOfflineChanges[i];
                    for (var j = 0; j < changeOneUser.length; ++j) {
                        this.onSaveChanges(changeOneUser[j], null, true);
                    }
                }
            }
            this._updateChanges(data["changes"], data["changesIndex"], true);
            if (this.onFirstLoadChangesEnd) {
                this.onFirstLoadChangesEnd();
            }
            this._sendPrebuffered();
        }
        if (this._initCallback) {
            this._initCallback({
                result: data["result"]
            });
        }
    };
    DocsCoApi.prototype.init = function (user, docid, documentCallbackUrl, token, callback, editorType, documentFormatSave, isViewer) {
        this._user = user;
        this._docid = docid;
        this._documentCallbackUrl = documentCallbackUrl;
        this._token = token;
        this._initCallback = callback;
        this.ownedLockBlocks = [];
        this.sockjs_url = this._url + "/doc/" + docid + "/c";
        this.editorType = editorType;
        this._isExcel = c_oEditorId.Spreadsheet === editorType;
        this._isPresentation = c_oEditorId.Presentation === editorType;
        this._isAuth = false;
        this._documentFormatSave = documentFormatSave;
        this._isViewer = isViewer;
        this._initSocksJs();
    };
    DocsCoApi.prototype._initSocksJs = function () {
        var t = this;
        var sockjs = this.sockjs = new SockJS(this.sockjs_url, null, {
            debug: true
        });
        sockjs.onopen = function () {
            if (t.reconnectTimeout) {
                clearTimeout(t.reconnectTimeout);
                t.attemptCount = 0;
            }
            t._state = ConnectionState.WaitAuth;
            if (t.onConnect) {
                t.onConnect();
            }
            if (t._locks) {
                t.ownedLockBlocks = [];
                for (var block in t._locks) {
                    if (t._locks.hasOwnProperty(block)) {
                        var lock = t._locks[block];
                        if (lock["state"] === 2) {
                            t.ownedLockBlocks.push(lock["blockValue"]);
                        }
                    }
                }
                t._locks = {};
            }
            t._send({
                "type": "auth",
                "docid": t._docid,
                "documentCallbackUrl": t._documentCallbackUrl,
                "token": t._token,
                "user": {
                    "id": t._user.asc_getId(),
                    "name": t._user.asc_getUserName(),
                    "indexUser": t._indexUser
                },
                "editorType": t.editorType,
                "lastOtherSaveTime": t.lastOtherSaveTime,
                "block": t.ownedLockBlocks,
                "sessionId": t._id,
                "server": window.location.protocol + "//" + window.location.host + g_sMainServiceLocalUrl,
                "documentFormatSave": t._documentFormatSave,
                "isViewer": t._isViewer,
                "version": asc_coAuthV
            });
        };
        sockjs.onmessage = function (e) {
            var dataObject = JSON.parse(e.data);
            var type = dataObject.type;
            switch (type) {
            case "auth":
                t._onAuth(dataObject);
                break;
            case "message":
                t._onMessages(dataObject, false);
                break;
            case "getLock":
                t._onGetLock(dataObject);
                break;
            case "releaseLock":
                t._onReleaseLock(dataObject);
                break;
            case "connectState":
                t._onConnectionStateChanged(dataObject);
                break;
            case "saveChanges":
                t._onSaveChanges(dataObject);
                break;
            case "saveLock":
                t._onSaveLock(dataObject);
                break;
            case "unSaveLock":
                t._onUnSaveLock(dataObject);
                break;
            case "savePartChanges":
                t._onSavePartChanges(dataObject);
                break;
            case "drop":
                t._onDrop(dataObject);
                break;
            case "waitAuth":
                break;
            case "error":
                t._onDrop(dataObject);
                break;
            }
        };
        sockjs.onclose = function (evt) {
            if (ConnectionState.SaveChanges === t._state) {
                t._isReSaveAfterAuth = true;
                if (null !== t.saveCallbackErrorTimeOutId) {
                    clearTimeout(t.saveCallbackErrorTimeOutId);
                }
            }
            t._state = ConnectionState.Reconnect;
            var bIsDisconnectAtAll = t.attemptCount >= t.maxAttemptCount || t.isCloseCoAuthoring;
            if (bIsDisconnectAtAll) {
                t._state = ConnectionState.Closed;
            }
            if (t.isCloseCoAuthoring) {
                return;
            }
            if (t.onDisconnect) {
                t.onDisconnect(evt.reason, bIsDisconnectAtAll, t.isCloseCoAuthoring);
            }
            if (t.attemptCount < t.maxAttemptCount) {
                t._tryReconnect();
            }
        };
        return sockjs;
    };
    DocsCoApi.prototype._tryReconnect = function () {
        var t = this;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }++this.attemptCount;
        this.reconnectTimeout = setTimeout(function () {
            delete t.sockjs;
            t._initSocksJs();
        },
        this.reconnectInterval);
    };
    window["CDocsCoApi"] = CDocsCoApi;
})(window);