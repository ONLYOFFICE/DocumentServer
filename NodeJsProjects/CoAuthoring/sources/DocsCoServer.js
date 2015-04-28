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
 var sockjs = require("sockjs"),
_ = require("underscore"),
https = require("https"),
http = require("http"),
url = require("url"),
logger = require("./../../Common/sources/logger"),
config = require("./config.json"),
sqlBase = require("./baseConnector");
var defaultHttpPort = 80,
defaultHttpsPort = 443;
var messages = {},
connections = [],
objServiceInfo = {},
objServicePucker = {},
arrCacheDocumentsChanges = [],
nCacheSize = 100;
var asc_coAuthV = "3.0.8";
function DocumentChanges(docId) {
    this.docId = docId;
    this.arrChanges = [];
    return this;
}
DocumentChanges.prototype.getLength = function () {
    return this.arrChanges.length;
};
DocumentChanges.prototype.push = function (change) {
    this.arrChanges.push(change);
};
DocumentChanges.prototype.splice = function (start, deleteCount) {
    this.arrChanges.splice(start, deleteCount);
};
DocumentChanges.prototype.concat = function (item) {
    this.arrChanges = this.arrChanges.concat(item);
};
var c_oAscServerStatus = {
    NotFound: 0,
    Editing: 1,
    MustSave: 2,
    Corrupted: 3,
    Closed: 4
};
var c_oAscChangeBase = {
    No: 0,
    Delete: 1,
    All: 2
};
var c_oAscServerCommandErrors = {
    NoError: 0,
    DocumentIdError: 1,
    ParseError: 2,
    CommandError: 3
};
var c_oAscSaveTimeOutDelay = 5000;
var c_oAscLockTimeOutDelay = 500;
var c_oAscRecalcIndexTypes = {
    RecalcIndexAdd: 1,
    RecalcIndexRemove: 2
};
var FileStatus = {
    None: 0,
    Ok: 1,
    WaitQueue: 2,
    NeedParams: 3,
    Convert: 4,
    Err: 5,
    ErrToReload: 6,
    SaveVersion: 7,
    UpdateVersion: 8
};
var c_oAscLockTypes = {
    kLockTypeNone: 1,
    kLockTypeMine: 2,
    kLockTypeOther: 3,
    kLockTypeOther2: 4,
    kLockTypeOther3: 5
};
var c_oAscLockTypeElem = {
    Range: 1,
    Object: 2,
    Sheet: 3
};
var c_oAscLockTypeElemSubType = {
    DeleteColumns: 1,
    InsertColumns: 2,
    DeleteRows: 3,
    InsertRows: 4,
    ChangeProperties: 5
};
var c_oAscLockTypeElemPresentation = {
    Object: 1,
    Slide: 2,
    Presentation: 3
};
function CRecalcIndexElement(recalcType, position, bIsSaveIndex) {
    if (! (this instanceof CRecalcIndexElement)) {
        return new CRecalcIndexElement(recalcType, position, bIsSaveIndex);
    }
    this._recalcType = recalcType;
    this._position = position;
    this._count = 1;
    this.m_bIsSaveIndex = !!bIsSaveIndex;
    return this;
}
CRecalcIndexElement.prototype = {
    constructor: CRecalcIndexElement,
    getLockOther: function (position, type) {
        var inc = (c_oAscRecalcIndexTypes.RecalcIndexAdd === this._recalcType) ? +1 : -1;
        if (position === this._position && c_oAscRecalcIndexTypes.RecalcIndexRemove === this._recalcType && true === this.m_bIsSaveIndex) {
            return null;
        } else {
            if (position === this._position && c_oAscRecalcIndexTypes.RecalcIndexRemove === this._recalcType && c_oAscLockTypes.kLockTypeMine === type && false === this.m_bIsSaveIndex) {
                return null;
            } else {
                if (position < this._position) {
                    return position;
                } else {
                    return (position + inc);
                }
            }
        }
    },
    getLockSaveOther: function (position, type) {
        if (this.m_bIsSaveIndex) {
            return position;
        }
        var inc = (c_oAscRecalcIndexTypes.RecalcIndexAdd === this._recalcType) ? +1 : -1;
        if (position === this._position && c_oAscRecalcIndexTypes.RecalcIndexRemove === this._recalcType && true === this.m_bIsSaveIndex) {
            return null;
        } else {
            if (position === this._position && c_oAscRecalcIndexTypes.RecalcIndexRemove === this._recalcType && c_oAscLockTypes.kLockTypeMine === type && false === this.m_bIsSaveIndex) {
                return null;
            } else {
                if (position < this._position) {
                    return position;
                } else {
                    return (position + inc);
                }
            }
        }
    },
    getLockMe: function (position) {
        var inc = (c_oAscRecalcIndexTypes.RecalcIndexAdd === this._recalcType) ? -1 : +1;
        if (position < this._position) {
            return position;
        } else {
            return (position + inc);
        }
    },
    getLockMe2: function (position) {
        var inc = (c_oAscRecalcIndexTypes.RecalcIndexAdd === this._recalcType) ? -1 : +1;
        if (true !== this.m_bIsSaveIndex || position < this._position) {
            return position;
        } else {
            return (position + inc);
        }
    }
};
function CRecalcIndex() {
    if (! (this instanceof CRecalcIndex)) {
        return new CRecalcIndex();
    }
    this._arrElements = [];
    return this;
}
CRecalcIndex.prototype = {
    constructor: CRecalcIndex,
    add: function (recalcType, position, count, bIsSaveIndex) {
        for (var i = 0; i < count; ++i) {
            this._arrElements.push(new CRecalcIndexElement(recalcType, position, bIsSaveIndex));
        }
    },
    clear: function () {
        this._arrElements.length = 0;
    },
    getLockOther: function (position, type) {
        var newPosition = position;
        var count = this._arrElements.length;
        for (var i = 0; i < count; ++i) {
            newPosition = this._arrElements[i].getLockOther(newPosition, type);
            if (null === newPosition) {
                break;
            }
        }
        return newPosition;
    },
    getLockSaveOther: function (position, type) {
        var newPosition = position;
        var count = this._arrElements.length;
        for (var i = 0; i < count; ++i) {
            newPosition = this._arrElements[i].getLockSaveOther(newPosition, type);
            if (null === newPosition) {
                break;
            }
        }
        return newPosition;
    },
    getLockMe: function (position) {
        var newPosition = position;
        var count = this._arrElements.length;
        for (var i = count - 1; i >= 0; --i) {
            newPosition = this._arrElements[i].getLockMe(newPosition);
            if (null === newPosition) {
                break;
            }
        }
        return newPosition;
    },
    getLockMe2: function (position) {
        var newPosition = position;
        var count = this._arrElements.length;
        for (var i = count - 1; i >= 0; --i) {
            newPosition = this._arrElements[i].getLockMe2(newPosition);
            if (null === newPosition) {
                break;
            }
        }
        return newPosition;
    }
};
function sendData(conn, data) {
    conn.write(JSON.stringify(data));
}
function getOriginalParticipantsId(docId) {
    var result = [],
    tmpObject = {},
    elConnection;
    for (var i = 0, length = connections.length; i < length; ++i) {
        elConnection = connections[i].connection;
        if (elConnection.docId === docId && false === elConnection.isViewer) {
            tmpObject[elConnection.user.idOriginal] = 1;
        }
    }
    for (var name in tmpObject) {
        if (tmpObject.hasOwnProperty(name)) {
            result.push(name);
        }
    }
    return result;
}
function sendServerRequest(server, postData, onReplyCallback) {
    if (!server.host || !server.path) {
        return;
    }
    var options = {
        host: server.host,
        path: server.path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": postData.length
        },
        rejectUnauthorized: false
    };
    if (server.port) {
        options.port = server.port;
    }
    var requestFunction = server.https ? https.request : http.request;
    logger.info("postData: %s", postData);
    var req = requestFunction(options, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (replyData) {
            logger.info("replyData: %s", replyData);
            if (onReplyCallback) {
                onReplyCallback(replyData);
            }
        });
        res.on("end", function () {
            logger.info("end");
        });
    });
    req.on("error", function (e) {
        logger.warn("problem with request on server: %s", e.message);
    });
    req.write(postData);
    req.end();
}
function parseUrl(callbackUrl) {
    var result = null;
    try {
        var parseObject = url.parse(decodeURIComponent(callbackUrl));
        var isHttps = "https:" === parseObject.protocol;
        var port = parseObject.port;
        if (!port) {
            port = isHttps ? defaultHttpsPort : defaultHttpPort;
        }
        result = {
            "https": isHttps,
            "host": parseObject.hostname,
            "port": port,
            "path": parseObject.path,
            "href": parseObject.href
        };
    } catch(e) {
        result = null;
    }
    return result;
}
function deleteCallback(id) {
    sqlBase.deleteCallback(id);
    delete objServiceInfo[id];
}
function sendStatusDocument(docId, bChangeBase) {
    var callback = objServiceInfo[docId];
    if (null == callback) {
        return;
    }
    var status = c_oAscServerStatus.Editing;
    var participants = getOriginalParticipantsId(docId);
    var oPucker = objServicePucker[docId];
    if (0 === participants.length && !(oPucker && oPucker.inDataBase && 0 !== oPucker.index)) {
        status = c_oAscServerStatus.Closed;
    }
    if (c_oAscChangeBase.No !== bChangeBase) {
        if (c_oAscServerStatus.Editing === status && c_oAscChangeBase.All === bChangeBase) {
            sqlBase.insertInTable(sqlBase.tableId.callbacks, docId, callback.href);
        } else {
            if (c_oAscServerStatus.Closed === status) {
                deleteCallback(docId);
            }
        }
    }
    var sendData = JSON.stringify({
        "key": docId,
        "status": status,
        "url": "",
        "users": participants
    });
    sendServerRequest(callback, sendData, function (replyData) {
        onReplySendStatusDocument(docId, replyData);
    });
}
function onReplySendStatusDocument(docId, replyData) {
    if (!replyData) {
        return;
    }
    var i, oData, users;
    try {
        oData = JSON.parse(replyData);
    } catch(e) {
        logger.error("error reply SendStatusDocument: %s docId = %s", e, docId);
        oData = null;
    }
    if (!oData) {
        return;
    }
    users = Array.isArray(oData) ? oData : oData.users;
    if (Array.isArray(users)) {
        for (i = 0; i < users.length; ++i) {
            dropUserFromDocument(docId, users[i], "");
        }
    }
}
function dropUserFromDocument(docId, userId, description) {
    var elConnection;
    for (var i = 0, length = connections.length; i < length; ++i) {
        elConnection = connections[i].connection;
        if (elConnection.docId === docId && userId === elConnection.user.idOriginal) {
            sendData(elConnection, {
                type: "drop",
                description: description
            });
        }
    }
}
function removeDocumentChanges(docId) {
    for (var i = 0, length = arrCacheDocumentsChanges.length; i < length; ++i) {
        if (docId === arrCacheDocumentsChanges[i].docId) {
            arrCacheDocumentsChanges.splice(i, 1);
            return;
        }
    }
}
function bindEvents(docId, callback) {
    var bChangeBase = c_oAscChangeBase.Delete;
    if (!objServiceInfo[docId]) {
        var oCallbackUrl = parseUrl(callback);
        if (null === oCallbackUrl) {
            return c_oAscServerCommandErrors.ParseError;
        }
        objServiceInfo[docId] = oCallbackUrl;
        bChangeBase = c_oAscChangeBase.All;
    }
    sendStatusDocument(docId, bChangeBase);
}
function removeChanges(id, isCorrupted, isConvertService) {
    logger.info("removeChanges: %s", id);
    delete messages[id];
    deleteCallback(id);
    removeDocumentChanges(id);
    if (!isCorrupted) {
        deletePucker(id);
        sqlBase.deleteChanges(id, null);
    } else {
        sqlBase.updateStatusFile(id);
        logger.error("saved corrupted id = %s convert = %s", id, isConvertService);
    }
}
function deletePucker(docId) {
    sqlBase.deletePucker(docId);
    delete objServicePucker[docId];
}
function _createPucker(url, documentFormatSave, indexUser, inDataBase) {
    var serverUrl = parseUrl(url);
    if (null === serverUrl) {
        logger.error("Error server url = %s", url);
        return null;
    }
    return {
        url: url,
        server: serverUrl,
        documentFormatSave: documentFormatSave,
        inDataBase: inDataBase,
        index: 0,
        indexUser: indexUser
    };
}
function createPucker(docId, url, documentFormatSave, indexUser, inDataBase) {
    var pucker = null;
    if (!objServicePucker.hasOwnProperty(docId)) {
        pucker = _createPucker(url, documentFormatSave, indexUser, inDataBase);
        if (null === pucker) {
            return null;
        }
        objServicePucker[docId] = pucker;
    }
    return objServicePucker[docId];
}
function updatePucker(docId, indexUser) {
    var pucker = objServicePucker[docId];
    var nOldIndex;
    if (pucker) {
        nOldIndex = pucker.indexUser;
        pucker.indexUser = indexUser;
        if (!pucker.inDataBase) {
            sqlBase.insertInTable(sqlBase.tableId.pucker, docId, pucker.url, pucker.documentFormatSave, pucker.indexUser);
            pucker.inDataBase = true;
        } else {
            if (nOldIndex !== pucker.indexUser) {
                sqlBase.updateIndexUser(docId, pucker.indexUser);
            }
        }
    }
}
exports.version = asc_coAuthV;
exports.install = function (server, callbackFunction) {
    var sockjs_opts = {
        sockjs_url: "./../../Common/sources/sockjs-0.3.min.js"
    },
    sockjs_echo = sockjs.createServer(sockjs_opts),
    locks = {},
    lockDocuments = {},
    arrSaveLock = {},
    saveTimers = {},
    urlParse = new RegExp("^/doc/([0-9-.a-zA-Z_=]*)/c.+", "i");
    sockjs_echo.on("connection", function (conn) {
        if (null == conn) {
            logger.error("null == conn");
            return;
        }
        conn.on("data", function (message) {
            try {
                var data = JSON.parse(message);
                switch (data.type) {
                case "auth":
                    auth(conn, data);
                    break;
                case "message":
                    onMessage(conn, data);
                    break;
                case "getLock":
                    getLock(conn, data, false);
                    break;
                case "saveChanges":
                    saveChanges(conn, data);
                    break;
                case "isSaveLock":
                    isSaveLock(conn, data);
                    break;
                case "unSaveLock":
                    unSaveLock(conn, -1);
                    break;
                case "getMessages":
                    getMessages(conn, data);
                    break;
                case "unLockDocument":
                    checkEndAuthLock(data.isSave, conn.docId, conn.user.id, null, conn);
                    break;
                }
            } catch(e) {
                logger.error("error receiving response: %s docId = %s type = %s", e, conn ? conn.docId : "null", (data && data.type) ? data.type : "null");
            }
        });
        conn.on("error", function () {
            logger.error("On error");
        });
        conn.on("close", function () {
            var connection = this,
            userLocks, participants, reconnected, oPucker, bHasEditors, bHasChanges;
            var docId = conn.docId;
            if (null == docId) {
                return;
            }
            logger.info("Connection closed or timed out");
            connections = _.reject(connections, function (el) {
                return el.connection.id === connection.id;
            });
            reconnected = _.any(connections, function (el) {
                return el.connection.sessionId === connection.sessionId;
            });
            var state = (false == reconnected) ? false : undefined;
            participants = getParticipants(docId);
            sendParticipantsState(participants, state, connection);
            if (!reconnected) {
                if (undefined != arrSaveLock[docId] && connection.user.id == arrSaveLock[docId].user) {
                    if (null != arrSaveLock[docId].saveLockTimeOutId) {
                        clearTimeout(arrSaveLock[docId].saveLockTimeOutId);
                    }
                    arrSaveLock[docId] = undefined;
                }
                oPucker = objServicePucker[docId];
                bHasEditors = hasEditors(docId);
                bHasChanges = oPucker && oPucker.inDataBase && 0 !== oPucker.index;
                if (false === connection.isViewer) {
                    if (!bHasEditors) {
                        if (null != arrSaveLock[docId] && null != arrSaveLock[docId].saveLockTimeOutId) {
                            clearTimeout(arrSaveLock[docId].saveLockTimeOutId);
                        }
                        arrSaveLock[docId] = undefined;
                        if (bHasChanges) {
                            _createSaveTimer(docId);
                        } else {
                            deletePucker(docId);
                            sendStatusDocument(docId, c_oAscChangeBase.All);
                        }
                    } else {
                        sendStatusDocument(docId, c_oAscChangeBase.No);
                    }
                    userLocks = getUserLocks(docId, connection.sessionId);
                    if (0 < userLocks.length) {
                        _.each(participants, function (participant) {
                            if (!participant.connection.isViewer) {
                                sendData(participant.connection, {
                                    type: "releaseLock",
                                    locks: _.map(userLocks, function (e) {
                                        return {
                                            block: e.block,
                                            user: e.user,
                                            time: Date.now(),
                                            changes: null
                                        };
                                    })
                                });
                            }
                        });
                    }
                    checkEndAuthLock(false, docId, connection.user.id, participants);
                } else {
                    if (!bHasEditors && !bHasChanges) {
                        deletePucker(docId);
                    }
                }
            }
        });
    });
    function getDocumentChangesCache(docId) {
        var oPucker = objServicePucker[docId];
        if (oPucker && oPucker.inDataBase) {
            var i, length;
            for (i = 0, length = arrCacheDocumentsChanges.length; i < length; ++i) {
                if (docId === arrCacheDocumentsChanges[i].docId) {
                    return arrCacheDocumentsChanges[i];
                }
            }
        }
        return null;
    }
    function getDocumentChanges(docId, callback) {
        var oPucker = objServicePucker[docId];
        if (oPucker && oPucker.inDataBase) {
            var i, length;
            for (i = 0, length = arrCacheDocumentsChanges.length; i < length; ++i) {
                if (docId === arrCacheDocumentsChanges[i].docId) {
                    callback(arrCacheDocumentsChanges[i].arrChanges, oPucker.index);
                    return;
                }
            }
            var callbackGetChanges = function (error, arrayElements) {
                if (!oPucker || error) {
                    return;
                }
                var j, element;
                var objChangesDocument = new DocumentChanges(docId);
                for (j = 0; j < arrayElements.length; ++j) {
                    element = arrayElements[j];
                    objChangesDocument.push({
                        docid: docId,
                        change: element["dc_data"],
                        time: Date.parse(element["dc_date"] + " GMT"),
                        user: element["dc_user_id"],
                        useridoriginal: element["dc_user_id_original"]
                    });
                }
                oPucker.index = objChangesDocument.getLength();
                arrCacheDocumentsChanges.push(objChangesDocument);
                callback(objChangesDocument.arrChanges, oPucker.index);
            };
            sqlBase.getChanges(docId, callbackGetChanges);
            return;
        }
        callback(undefined, 0);
    }
    function getUserLocks(docId, sessionId) {
        var userLocks = [],
        i;
        var docLock = locks[docId];
        if (docLock) {
            if ("array" === typeOf(docLock)) {
                for (i = 0; i < docLock.length; ++i) {
                    if (docLock[i].sessionId === sessionId) {
                        userLocks.push(docLock[i]);
                        docLock.splice(i, 1);
                        --i;
                    }
                }
            } else {
                for (i in docLock) {
                    if (docLock[i].sessionId === sessionId) {
                        userLocks.push(docLock[i]);
                        delete docLock[i];
                    }
                }
            }
        }
        return userLocks;
    }
    function checkEndAuthLock(isSave, docId, userId, participants, currentConnection) {
        var result = false;
        if (lockDocuments.hasOwnProperty(docId) && userId === lockDocuments[docId].id) {
            delete lockDocuments[docId];
            if (!participants) {
                participants = getParticipants(docId);
            }
            var participantsMap = _.map(participants, function (conn) {
                var tmpUser = conn.connection.user;
                return {
                    id: tmpUser.id,
                    username: tmpUser.name,
                    indexUser: tmpUser.indexUser,
                    view: conn.connection.isViewer
                };
            });
            getDocumentChanges(docId, function (objChangesDocument, changesIndex) {
                var connection;
                for (var i = 0, l = participants.length; i < l; ++i) {
                    connection = participants[i].connection;
                    if (userId !== connection.user.id && !connection.isViewer) {
                        sendAuthInfo(objChangesDocument, changesIndex, connection, participantsMap);
                    }
                }
            });
            result = true;
        } else {
            if (isSave) {
                var userLocks = getUserLocks(docId, currentConnection.sessionId);
                if (0 < userLocks.length) {
                    if (!participants) {
                        participants = getParticipants(docId);
                    }
                    for (var i = 0, l = participants.length; i < l; ++i) {
                        var connection = participants[i].connection;
                        if (userId !== connection.user.id && !connection.isViewer) {
                            sendData(connection, {
                                type: "releaseLock",
                                locks: _.map(userLocks, function (e) {
                                    return {
                                        block: e.block,
                                        user: e.user,
                                        time: Date.now(),
                                        changes: null
                                    };
                                })
                            });
                        }
                    }
                }
                unSaveLock(currentConnection, -1);
            }
        }
        return result;
    }
    function sendParticipantsState(participants, stateConnect, oConnection) {
        var tmpUser = oConnection.user;
        _.each(participants, function (participant) {
            if (participant.connection.user.id !== tmpUser.id) {
                sendData(participant.connection, {
                    type: "connectState",
                    state: stateConnect,
                    id: tmpUser.id,
                    username: tmpUser.name,
                    indexUser: tmpUser.indexUser,
                    view: oConnection.isViewer
                });
            }
        });
    }
    function sendFileError(conn, errorId) {
        logger.error("error description: %s", errorId);
        sendData(conn, {
            type: "error",
            description: errorId
        });
    }
    function getParticipants(docId, excludeUserId, excludeViewer) {
        return _.filter(connections, function (el) {
            return el.connection.docId === docId && el.connection.user.id !== excludeUserId && el.connection.isViewer !== excludeViewer;
        });
    }
    function hasEditors(docId) {
        var result = false,
        elConnection;
        for (var i = 0, length = connections.length; i < length; ++i) {
            elConnection = connections[i].connection;
            if (elConnection.docId === docId && false === elConnection.isViewer) {
                result = true;
                break;
            }
        }
        return result;
    }
    function sendChangesToServer(docId) {
        var sendData = JSON.stringify({
            "id": docId,
            "c": "sfc",
            "url": "/CommandService.ashx?c=saved&conv=1&key=" + docId + "&status=",
            "outputformat" : objServicePucker[docId].documentFormatSave,
            "data": c_oAscSaveTimeOutDelay
        });
        sendServerRequest(objServicePucker[docId].server, sendData);
    }
    function _recalcLockArray(userId, _locks, oRecalcIndexColumns, oRecalcIndexRows) {
        if (null == _locks) {
            return;
        }
        var count = _locks.length;
        var element = null,
        oRangeOrObjectId = null;
        var i;
        var sheetId = -1;
        for (i = 0; i < count; ++i) {
            if (userId === _locks[i].user) {
                continue;
            }
            element = _locks[i].block;
            if (c_oAscLockTypeElem.Range !== element["type"] || c_oAscLockTypeElemSubType.InsertColumns === element["subType"] || c_oAscLockTypeElemSubType.InsertRows === element["subType"]) {
                continue;
            }
            sheetId = element["sheetId"];
            oRangeOrObjectId = element["rangeOrObjectId"];
            if (oRecalcIndexColumns && oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["c1"] = oRecalcIndexColumns[sheetId].getLockMe2(oRangeOrObjectId["c1"]);
                oRangeOrObjectId["c2"] = oRecalcIndexColumns[sheetId].getLockMe2(oRangeOrObjectId["c2"]);
            }
            if (oRecalcIndexRows && oRecalcIndexRows.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["r1"] = oRecalcIndexRows[sheetId].getLockMe2(oRangeOrObjectId["r1"]);
                oRangeOrObjectId["r2"] = oRecalcIndexRows[sheetId].getLockMe2(oRangeOrObjectId["r2"]);
            }
        }
    }
    function _addRecalcIndex(oRecalcIndex) {
        if (null == oRecalcIndex) {
            return null;
        }
        var nIndex = 0;
        var nRecalcType = c_oAscRecalcIndexTypes.RecalcIndexAdd;
        var oRecalcIndexElement = null;
        var oRecalcIndexResult = {};
        for (var sheetId in oRecalcIndex) {
            if (oRecalcIndex.hasOwnProperty(sheetId)) {
                if (!oRecalcIndexResult.hasOwnProperty(sheetId)) {
                    oRecalcIndexResult[sheetId] = new CRecalcIndex();
                }
                for (; nIndex < oRecalcIndex[sheetId]._arrElements.length; ++nIndex) {
                    oRecalcIndexElement = oRecalcIndex[sheetId]._arrElements[nIndex];
                    if (true === oRecalcIndexElement.m_bIsSaveIndex) {
                        continue;
                    }
                    nRecalcType = (c_oAscRecalcIndexTypes.RecalcIndexAdd === oRecalcIndexElement._recalcType) ? c_oAscRecalcIndexTypes.RecalcIndexRemove : c_oAscRecalcIndexTypes.RecalcIndexAdd;
                    oRecalcIndexResult[sheetId].add(nRecalcType, oRecalcIndexElement._position, oRecalcIndexElement._count, true);
                }
            }
        }
        return oRecalcIndexResult;
    }
    function compareExcelBlock(newBlock, oldBlock) {
        if (null !== newBlock.subType && null !== oldBlock.subType) {
            return true;
        }
        if ((c_oAscLockTypeElemSubType.ChangeProperties === oldBlock.subType && c_oAscLockTypeElem.Sheet !== newBlock.type) || (c_oAscLockTypeElemSubType.ChangeProperties === newBlock.subType && c_oAscLockTypeElem.Sheet !== oldBlock.type)) {
            return false;
        }
        var resultLock = false;
        if (newBlock.type === c_oAscLockTypeElem.Range) {
            if (oldBlock.type === c_oAscLockTypeElem.Range) {
                if (c_oAscLockTypeElemSubType.InsertRows === oldBlock.subType || c_oAscLockTypeElemSubType.InsertColumns === oldBlock.subType) {
                    resultLock = false;
                } else {
                    if (isInterSection(newBlock.rangeOrObjectId, oldBlock.rangeOrObjectId)) {
                        resultLock = true;
                    }
                }
            } else {
                if (oldBlock.type === c_oAscLockTypeElem.Sheet) {
                    resultLock = true;
                }
            }
        } else {
            if (newBlock.type === c_oAscLockTypeElem.Sheet) {
                resultLock = true;
            } else {
                if (newBlock.type === c_oAscLockTypeElem.Object) {
                    if (oldBlock.type === c_oAscLockTypeElem.Sheet) {
                        resultLock = true;
                    } else {
                        if (oldBlock.type === c_oAscLockTypeElem.Object && oldBlock.rangeOrObjectId === newBlock.rangeOrObjectId) {
                            resultLock = true;
                        }
                    }
                }
            }
        }
        return resultLock;
    }
    function isInterSection(range1, range2) {
        if (range2.c1 > range1.c2 || range2.c2 < range1.c1 || range2.r1 > range1.r2 || range2.r2 < range1.r1) {
            return false;
        }
        return true;
    }
    function typeOf(obj) {
        if (obj === undefined) {
            return "undefined";
        }
        if (obj === null) {
            return "null";
        }
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
    function comparePresentationBlock(newBlock, oldBlock) {
        var resultLock = false;
        switch (newBlock.type) {
        case c_oAscLockTypeElemPresentation.Presentation:
            if (c_oAscLockTypeElemPresentation.Presentation === oldBlock.type) {
                resultLock = newBlock.val === oldBlock.val;
            }
            break;
        case c_oAscLockTypeElemPresentation.Slide:
            if (c_oAscLockTypeElemPresentation.Slide === oldBlock.type) {
                resultLock = newBlock.val === oldBlock.val;
            } else {
                if (c_oAscLockTypeElemPresentation.Object === oldBlock.type) {
                    resultLock = newBlock.val === oldBlock.slideId;
                }
            }
            break;
        case c_oAscLockTypeElemPresentation.Object:
            if (c_oAscLockTypeElemPresentation.Slide === oldBlock.type) {
                resultLock = newBlock.slideId === oldBlock.val;
            } else {
                if (c_oAscLockTypeElemPresentation.Object === oldBlock.type) {
                    resultLock = newBlock.objId === oldBlock.objId;
                }
            }
            break;
        }
        return resultLock;
    }
    function auth(conn, data) {
        if (data.version !== asc_coAuthV) {
            sendFileError(conn, "Old Version Sdk");
            return;
        }
        if (data.token && data.user) {
            var docId;
            var user = data.user;
            var parsed = urlParse.exec(conn.url);
            if (parsed.length > 1) {
                docId = conn.docId = parsed[1];
            } else {}
            if (false === data.isViewer && saveTimers[docId]) {
                clearTimeout(saveTimers[docId]);
            }
            var bIsRestore = null != data.sessionId;
            var pucker = createPucker(docId, data.server, data.documentFormatSave, 0, false);
            if (!pucker) {
                sendFileError(conn, "pucker error");
                return;
            }
            var curIndexUser = bIsRestore ? user.indexUser : pucker.indexUser;
            var curUserId = user.id + curIndexUser;
            conn.sessionState = 1;
            conn.user = {
                id: curUserId,
                idOriginal: user.id,
                name: user.name,
                indexUser: curIndexUser
            };
            conn.isViewer = data.isViewer;
            if (!conn.isViewer) {
                updatePucker(docId, Math.max(pucker.indexUser, curIndexUser + 1));
            }
            if (bIsRestore) {
                logger.info("restored old session id = %s", data.sessionId);
                sqlBase.checkStatusFile(docId, function (error, result) {
                    if (null !== error || 0 === result.length) {
                        sendFileError(conn, "DataBase error");
                        return;
                    }
                    var status = result[0]["tr_status"];
                    if (FileStatus.Ok === status) {} else {
                        if (FileStatus.SaveVersion === status) {
                            sqlBase.updateStatusFile(docId);
                        } else {
                            if (FileStatus.UpdateVersion === status) {
                                sendFileError(conn, "Update Version error");
                                return;
                            } else {
                                sendFileError(conn, "Other error");
                                return;
                            }
                        }
                    }
                    getDocumentChanges(docId, function (objChangesDocument, changesIndex) {
                        var bIsSuccessRestore = true;
                        if (objChangesDocument && 0 < objChangesDocument.length) {
                            var change = objChangesDocument[objChangesDocument.length - 1];
                            if (change["change"]) {
                                if (change["user"] !== curUserId) {
                                    bIsSuccessRestore = 0 === (((data["lastOtherSaveTime"] - change["time"]) / 1000) >> 0);
                                }
                            }
                        }
                        if (bIsSuccessRestore) {
                            conn.sessionId = data.sessionId;
                            var arrayBlocks = data["block"];
                            if (arrayBlocks && (0 === arrayBlocks.length || getLock(conn, data, true))) {
                                connections = _.reject(connections, function (el) {
                                    return el.connection.sessionId === data.sessionId;
                                });
                                endAuth(conn, true);
                            } else {
                                sendFileError(conn, "Restore error. Locks not checked.");
                            }
                        } else {
                            sendFileError(conn, "Restore error. Document modified.");
                        }
                    });
                });
            } else {
                conn.sessionId = conn.id;
                endAuth(conn, false, data.documentCallbackUrl);
            }
        }
    }
    function endAuth(conn, bIsRestore, documentCallbackUrl) {
        var docId = conn.docId;
        connections.push({
            connection: conn
        });
        var participants = getParticipants(docId);
        var tmpConnection, tmpUser, firstParticipantNoView, participantsMap = [],
        countNoView = 0;
        for (var i = 0; i < participants.length; ++i) {
            tmpConnection = participants[i].connection;
            tmpUser = tmpConnection.user;
            participantsMap.push({
                id: tmpUser.id,
                username: tmpUser.name,
                indexUser: tmpUser.indexUser,
                view: tmpConnection.isViewer
            });
            if (!tmpConnection.isViewer) {
                ++countNoView;
                if (!firstParticipantNoView) {
                    firstParticipantNoView = participantsMap[participantsMap.length - 1];
                }
            }
        }
        if (!conn.isViewer) {
            if (documentCallbackUrl) {
                bindEvents(docId, documentCallbackUrl);
            } else {
                sendStatusDocument(docId, c_oAscChangeBase.No);
            }
        }
        if (!bIsRestore && 2 === countNoView && !conn.isViewer) {
            lockDocuments[docId] = firstParticipantNoView;
        }
        if (lockDocuments[docId] && !conn.isViewer) {
            var sendObject = {
                type: "waitAuth",
                lockDocument: lockDocuments[docId]
            };
            sendData(conn, sendObject);
        } else {
            if (bIsRestore) {
                sendAuthInfo(undefined, undefined, conn, participantsMap);
            } else {
                getDocumentChanges(docId, function (objChangesDocument, changesIndex) {
                    sendAuthInfo(objChangesDocument, changesIndex, conn, participantsMap);
                });
            }
        }
        sendParticipantsState(participants, true, conn);
    }
    function sendAuthInfo(objChangesDocument, changesIndex, conn, participantsMap) {
        var docId = conn.docId;
        var sendObject = {
            type: "auth",
            result: 1,
            sessionId: conn.sessionId,
            participants: participantsMap,
            messages: messages[docId],
            locks: locks[docId],
            changes: objChangesDocument,
            changesIndex: changesIndex,
            indexUser: conn.user.indexUser
        };
        sendData(conn, sendObject);
    }
    function onMessage(conn, data) {
        var participants = getParticipants(conn.docId),
        msg = {
            docid: conn.docId,
            message: data.message,
            time: Date.now(),
            user: conn.user.id,
            username: conn.user.name
        };
        if (!messages.hasOwnProperty(conn.docId)) {
            messages[conn.docId] = [msg];
        } else {
            messages[conn.docId].push(msg);
        }
        logger.info("insert message: %s", JSON.stringify(msg));
        _.each(participants, function (participant) {
            sendData(participant.connection, {
                type: "message",
                messages: [msg]
            });
        });
    }
    function getLock(conn, data, bIsRestore) {
        logger.info("getLock docid: %s", conn.docId);
        var fLock = null;
        switch (data["editorType"]) {
        case 0:
            fLock = getLockWord;
            break;
        case 1:
            fLock = getLockExcel;
            break;
        case 2:
            fLock = getLockPresentation;
            break;
        }
        return fLock ? fLock(conn, data, bIsRestore) : false;
    }
    function getLockWord(conn, data, bIsRestore) {
        var docId = conn.docId,
        participants = getParticipants(docId, undefined, true),
        arrayBlocks = data.block;
        if (!locks.hasOwnProperty(docId)) {
            locks[docId] = {};
        }
        var i, documentLocks = locks[docId];
        if (_checkLock(documentLocks, arrayBlocks)) {
            for (i = 0; i < arrayBlocks.length; ++i) {
                documentLocks[arrayBlocks[i]] = {
                    time: Date.now(),
                    user: conn.user.id,
                    block: arrayBlocks[i],
                    sessionId: conn.sessionId
                };
            }
        } else {
            if (bIsRestore) {
                return false;
            }
        }
        sendGetLock(participants, documentLocks);
        return true;
    }
    function getLockExcel(conn, data, bIsRestore) {
        var docId = conn.docId,
        userId = conn.user.id,
        participants = getParticipants(docId, undefined, true),
        arrayBlocks = data.block;
        if (!locks.hasOwnProperty(docId)) {
            locks[docId] = [];
        }
        var i, documentLocks = locks[docId];
        if (_checkLockExcel(documentLocks, arrayBlocks, userId)) {
            for (i = 0; i < arrayBlocks.length; ++i) {
                documentLocks.push({
                    time: Date.now(),
                    user: userId,
                    block: arrayBlocks[i],
                    sessionId: conn.sessionId
                });
            }
        } else {
            if (bIsRestore) {
                return false;
            }
        }
        sendGetLock(participants, documentLocks);
        return true;
    }
    function getLockPresentation(conn, data, bIsRestore) {
        var docId = conn.docId,
        userId = conn.user.id,
        participants = getParticipants(docId, undefined, true),
        arrayBlocks = data.block;
        if (!locks.hasOwnProperty(docId)) {
            locks[docId] = [];
        }
        var i, documentLocks = locks[docId];
        if (_checkLockPresentation(documentLocks, arrayBlocks, userId)) {
            for (i = 0; i < arrayBlocks.length; ++i) {
                documentLocks.push({
                    time: Date.now(),
                    user: userId,
                    block: arrayBlocks[i],
                    sessionId: conn.sessionId
                });
            }
        } else {
            if (bIsRestore) {
                return false;
            }
        }
        sendGetLock(participants, documentLocks);
        return true;
    }
    function sendGetLock(participants, documentLocks) {
        _.each(participants, function (participant) {
            sendData(participant.connection, {
                type: "getLock",
                locks: documentLocks
            });
        });
    }
    function saveChanges(conn, data) {
        var docId = conn.docId,
        userId = conn.user.id;
        logger.info("saveChanges docid: %s", docId);
        var pucker = objServicePucker[docId];
        if (!pucker) {
            logger.error("saveChanges find pucker error docid: %s", docId);
            return;
        }
        var participants = getParticipants(docId, userId, true);
        var objChangesDocument = getDocumentChangesCache(docId);
        var deleteIndex = -1;
        if (data.startSaveChanges && null != data.deleteIndex) {
            deleteIndex = data.deleteIndex;
            if (-1 !== deleteIndex) {
                var deleteCount = pucker.index - deleteIndex;
                if (0 < deleteCount) {
                    if (objChangesDocument) {
                        objChangesDocument.splice(deleteIndex, deleteCount);
                    }
                    pucker.index -= deleteCount;
                    sqlBase.deleteChanges(docId, deleteIndex);
                } else {
                    if (0 > deleteCount) {
                        logger.error("saveChanges docid: %s ; deleteIndex: %s ; startIndex: %s ; deleteCount: %s", docId, deleteIndex, pucker.index, deleteCount);
                    }
                }
            }
        }
        var startIndex = pucker.index;
        var newChanges = JSON.parse(data.changes);
        var arrNewDocumentChanges = [];
        logger.info("saveChanges docid: %s ; deleteIndex: %s ; startIndex: %s ; length: %s", docId, deleteIndex, startIndex, newChanges.length);
        if (0 < newChanges.length) {
            var oElement = null;
            for (var i = 0; i < newChanges.length; ++i) {
                oElement = newChanges[i];
                arrNewDocumentChanges.push({
                    docid: docId,
                    change: JSON.stringify(oElement),
                    time: Date.now(),
                    user: userId,
                    useridoriginal: conn.user.idOriginal
                });
            }
            if (objChangesDocument) {
                objChangesDocument.concat(arrNewDocumentChanges);
            }
            pucker.index += arrNewDocumentChanges.length;
            sqlBase.insertChanges(arrNewDocumentChanges, docId, startIndex, conn.user);
        }
        var changesIndex = (-1 === deleteIndex && data.startSaveChanges) ? startIndex : -1;
        if (data.endSaveChanges) {
            if (data.isExcel && false !== data.isCoAuthoring && data.excelAdditionalInfo) {
                var tmpAdditionalInfo = JSON.parse(data.excelAdditionalInfo);
                var oRecalcIndexColumns = _addRecalcIndex(tmpAdditionalInfo["indexCols"]);
                var oRecalcIndexRows = _addRecalcIndex(tmpAdditionalInfo["indexRows"]);
                if (null !== oRecalcIndexColumns || null !== oRecalcIndexRows) {
                    _recalcLockArray(userId, locks[docId], oRecalcIndexColumns, oRecalcIndexRows);
                }
            }
            var userLocks = getUserLocks(docId, conn.sessionId);
            if (!checkEndAuthLock(false, docId, userId)) {
                var arrLocks = _.map(userLocks, function (e) {
                    return {
                        block: e.block,
                        user: e.user,
                        time: Date.now(),
                        changes: null
                    };
                });
                _.each(participants, function (participant) {
                    sendData(participant.connection, {
                        type: "saveChanges",
                        changes: arrNewDocumentChanges,
                        changesIndex: pucker.index,
                        locks: arrLocks,
                        excelAdditionalInfo: data.excelAdditionalInfo
                    });
                });
            }
            unSaveLock(conn, changesIndex);
        } else {
            _.each(participants, function (participant) {
                sendData(participant.connection, {
                    type: "saveChanges",
                    changes: arrNewDocumentChanges,
                    changesIndex: pucker.index,
                    locks: []
                });
            });
            sendData(conn, {
                type: "savePartChanges",
                changesIndex: changesIndex
            });
        }
    }
    function isSaveLock(conn) {
        var _docId = conn.docId;
        var _userId = conn.user.id;
        var _time = Date.now();
        var isSaveLock = (undefined === arrSaveLock[_docId]) ? false : arrSaveLock[_docId].savelock;
        if (false === isSaveLock) {
            arrSaveLock[conn.docId] = {
                docid: _docId,
                savelock: true,
                time: Date.now(),
                user: conn.user.id
            };
            var _tmpSaveLock = arrSaveLock[_docId];
            arrSaveLock[conn.docId].saveLockTimeOutId = setTimeout(function () {
                if (_tmpSaveLock && _userId == _tmpSaveLock.user && _time == _tmpSaveLock.time) {
                    arrSaveLock[_docId] = undefined;
                }
            },
            60000);
        }
        sendData(conn, {
            type: "saveLock",
            saveLock: isSaveLock
        });
    }
    function unSaveLock(conn, index) {
        if (undefined != arrSaveLock[conn.docId] && conn.user.id != arrSaveLock[conn.docId].user) {
            return;
        }
        if (arrSaveLock[conn.docId] && null != arrSaveLock[conn.docId].saveLockTimeOutId) {
            clearTimeout(arrSaveLock[conn.docId].saveLockTimeOutId);
        }
        arrSaveLock[conn.docId] = undefined;
        sendData(conn, {
            type: "unSaveLock",
            index: index
        });
    }
    function getMessages(conn) {
        sendData(conn, {
            type: "message",
            messages: messages[conn.docId]
        });
    }
    function _checkLock(documentLocks, arrayBlocks) {
        var isLock = false;
        var i, lengthArray = (arrayBlocks) ? arrayBlocks.length : 0;
        for (i = 0; i < lengthArray; ++i) {
            logger.info("getLock id: %s", arrayBlocks[i]);
            if (documentLocks.hasOwnProperty(arrayBlocks[i]) && documentLocks[arrayBlocks[i]] !== null) {
                isLock = true;
                break;
            }
        }
        if (0 === lengthArray) {
            isLock = true;
        }
        return !isLock;
    }
    function _checkLockExcel(documentLocks, arrayBlocks, userId) {
        var documentLock;
        var isLock = false;
        var isExistInArray = false;
        var i, blockRange;
        var lengthArray = (arrayBlocks) ? arrayBlocks.length : 0;
        for (i = 0; i < lengthArray && false === isLock; ++i) {
            blockRange = arrayBlocks[i];
            for (var keyLockInArray in documentLocks) {
                if (true === isLock) {
                    break;
                }
                if (!documentLocks.hasOwnProperty(keyLockInArray)) {
                    continue;
                }
                documentLock = documentLocks[keyLockInArray];
                if (documentLock.user === userId && blockRange.sheetId === documentLock.block.sheetId && blockRange.type === c_oAscLockTypeElem.Object && documentLock.block.type === c_oAscLockTypeElem.Object && documentLock.block.rangeOrObjectId === blockRange.rangeOrObjectId) {
                    isExistInArray = true;
                    break;
                }
                if (c_oAscLockTypeElem.Sheet === blockRange.type && c_oAscLockTypeElem.Sheet === documentLock.block.type) {
                    if (documentLock.user === userId) {
                        if (blockRange.sheetId === documentLock.block.sheetId) {
                            isExistInArray = true;
                            break;
                        } else {
                            continue;
                        }
                    } else {
                        isLock = true;
                        break;
                    }
                }
                if (documentLock.user === userId || !(documentLock.block) || blockRange.sheetId !== documentLock.block.sheetId) {
                    continue;
                }
                isLock = compareExcelBlock(blockRange, documentLock.block);
            }
        }
        if (0 === lengthArray) {
            isLock = true;
        }
        return !isLock && !isExistInArray;
    }
    function _checkLockPresentation(documentLocks, arrayBlocks, userId) {
        var isLock = false;
        var i, documentLock, blockRange;
        var lengthArray = (arrayBlocks) ? arrayBlocks.length : 0;
        for (i = 0; i < lengthArray && false === isLock; ++i) {
            blockRange = arrayBlocks[i];
            for (var keyLockInArray in documentLocks) {
                if (true === isLock) {
                    break;
                }
                if (!documentLocks.hasOwnProperty(keyLockInArray)) {
                    continue;
                }
                documentLock = documentLocks[keyLockInArray];
                if (documentLock.user === userId || !(documentLock.block)) {
                    continue;
                }
                isLock = comparePresentationBlock(blockRange, documentLock.block);
            }
        }
        if (0 === lengthArray) {
            isLock = true;
        }
        return !isLock;
    }
    function _createSaveTimer(docId) {
        var oTimeoutFunction = function () {
            if (sqlBase.isLockCriticalSection(docId)) {
                saveTimers[docId] = setTimeout(oTimeoutFunction, c_oAscLockTimeOutDelay);
            } else {
                delete saveTimers[docId];
                sendChangesToServer(docId);
            }
        };
        saveTimers[docId] = setTimeout(oTimeoutFunction, c_oAscSaveTimeOutDelay);
    }
    sockjs_echo.installHandlers(server, {
        prefix: "/doc/[0-9-.a-zA-Z_=]*/c",
        log: function (severity, message) {
            logger.info(message);
        }
    });
    var callbackLoadPuckerMySql = function (error, arrayElements) {
        if (null != arrayElements) {
            var i, element;
            for (i = 0; i < arrayElements.length; ++i) {
                element = arrayElements[i];
                createPucker(element["dp_key"], element["dp_callback"], element["dp_documentFormatSave"], element["dp_indexUser"], true);
            }
        }
        sqlBase.loadTable(sqlBase.tableId.callbacks, callbackLoadCallbacksMySql);
    };
    var callbackLoadCallbacksMySql = function (error, arrayElements) {
        if (null != arrayElements) {
            var i, element, callbackUrl;
            for (i = 0; i < arrayElements.length; ++i) {
                element = arrayElements[i];
                callbackUrl = parseUrl(element["dc_callback"]);
                if (null === callbackUrl) {
                    logger.error("error parse callback = %s", element["dc_callback"]);
                }
                objServiceInfo[element["dc_key"]] = callbackUrl;
            }
            var docId;
            for (docId in objServiceInfo) {
                if (objServicePucker[docId]) {
                    _createSaveTimer(docId);
                } else {
                    deleteCallback(docId);
                }
            }
        }
        callbackFunction();
    };
    sqlBase.loadTable(sqlBase.tableId.pucker, callbackLoadPuckerMySql);
};
exports.commandFromServer = function (query) {
    var docId = query.key;
    if (null == docId) {
        return c_oAscServerCommandErrors.DocumentIdError;
    }
    logger.info("commandFromServer: docId = %s c = %s", docId, query.c);
    var result = c_oAscServerCommandErrors.NoError;
    switch (query.c) {
    case "info":
        bindEvents(docId, query.callback);
        break;
    case "drop":
        if (query.userid) {
            dropUserFromDocument(docId, query.userid, query.description);
        } else {
            if (query.users) {
                onReplySendStatusDocument(docId, query.users);
            }
        }
        break;
    case "saved":
        removeChanges(docId, "1" !== query.status, "1" === query.conv);
        break;
    default:
        result = c_oAscServerCommandErrors.CommandError;
        break;
    }
    return result;
};