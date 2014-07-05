/*
 * (c) Copyright Ascensio System SIA 2010-2014
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
dataBase = null,
http = require("http"),
config = require("./config.json");
if (config["mongodb"]) {
    dataBase = require("./database");
}
var logger = require("./../../Common/sources/logger");
var c_oAscRecalcIndexTypes = {
    RecalcIndexAdd: 1,
    RecalcIndexRemove: 2
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
exports.install = function (server, callbackFunction) {
    var sockjs_opts = {
        sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"
    },
    sockjs_echo = sockjs.createServer(sockjs_opts),
    connections = [],
    messages = {},
    objchanges = {},
    indexuser = {},
    locks = {},
    arrsavelock = [],
    dataHandler,
    urlParse = new RegExp("^/doc/([0-9-.a-zA-Z_=]*)/c.+", "i"),
    serverPort = 80;
    sockjs_echo.on("connection", function (conn) {
        if (null == conn) {
            logger.error("null == conn");
            return;
        }
        conn.on("data", function (message) {
            try {
                var data = JSON.parse(message);
                dataHandler[data.type](conn, data);
            } catch(e) {
                logger.error("error receiving response:" + e);
            }
        });
        conn.on("error", function () {
            logger.error("On error");
        });
        conn.on("close", function () {
            var connection = this,
            docLock, userLocks, participants, reconected;
            logger.info("Connection closed or timed out");
            connections = _.reject(connections, function (el) {
                return el.connection.id === connection.id;
            });
            reconected = _.any(connections, function (el) {
                return el.connection.sessionId === connection.sessionId;
            });
            var state = (false == reconected) ? false : undefined;
            participants = getParticipants(conn.docId);
            var participantsMap = _.map(participants, function (conn) {
                return {
                    id: conn.connection.userId,
                    username: conn.connection.userName
                };
            });
            sendParticipantsState(participants, state, connection.userId, connection.userName, participantsMap);
            if (!reconected) {
                if (undefined != arrsavelock[conn.docId] && connection.userId == arrsavelock[conn.docId].user) {
                    if (null != arrsavelock[conn.docId].saveLockTimeOutId) {
                        clearTimeout(arrsavelock[conn.docId].saveLockTimeOutId);
                    }
                    arrsavelock[conn.docId] = undefined;
                }
                if (0 >= participants.length) {
                    if (dataBase) {
                        dataBase.remove("messages", {
                            docid: conn.docId
                        });
                    }
                    delete messages[conn.docId];
                    if (objchanges[conn.docId] && 0 < objchanges[conn.docId].length) {
                        sendChangesToServer(conn.serverHost, conn.serverPath, conn.docId);
                    }
                    if (dataBase) {
                        dataBase.remove("changes", {
                            docid: conn.docId
                        });
                    }
                    delete objchanges[conn.docId];
                    if (null != arrsavelock[conn.docId] && null != arrsavelock[conn.docId].saveLockTimeOutId) {
                        clearTimeout(arrsavelock[conn.docId].saveLockTimeOutId);
                    }
                    arrsavelock[conn.docId] = undefined;
                }
                docLock = locks[connection.docId];
                if (docLock) {
                    userLocks = [];
                    if ("array" === typeOf(docLock)) {
                        for (var nIndex = 0; nIndex < docLock.length; ++nIndex) {
                            if (docLock[nIndex].sessionId === connection.sessionId) {
                                userLocks.push(docLock[nIndex]);
                                docLock.splice(nIndex, 1);
                                --nIndex;
                            }
                        }
                    } else {
                        for (var keyLockElem in docLock) {
                            if (docLock[keyLockElem].sessionId === connection.sessionId) {
                                userLocks.push(docLock[keyLockElem]);
                                delete docLock[keyLockElem];
                            }
                        }
                    }
                    _.each(participants, function (participant) {
                        sendData(participant.connection, {
                            type: "releaselock",
                            locks: _.map(userLocks, function (e) {
                                return {
                                    block: e.block,
                                    user: e.user,
                                    time: Date.now(),
                                    changes: null
                                };
                            })
                        });
                    });
                }
            }
        });
    });
    function sendData(conn, data) {
        conn.write(JSON.stringify(data));
    }
    function sendParticipantsState(participants, stateConnect, _userId, _userName, participantsMap) {
        _.each(participants, function (participant) {
            if (participant.connection.userId !== _userId) {
                sendData(participant.connection, {
                    type: "participants",
                    participants: participantsMap
                });
                sendData(participant.connection, {
                    type: "connectstate",
                    state: stateConnect,
                    id: _userId,
                    username: _userName
                });
            }
        });
    }
    function getParticipants(docId, exludeuserId) {
        return _.filter(connections, function (el) {
            return el.connection.docId === docId && el.connection.userId !== exludeuserId;
        });
    }
    function sendChangesToServer(serverHost, serverPath, docId) {
        if (!serverHost || !serverPath) {
            return;
        }
        var options = {
            host: serverHost,
            port: serverPort,
            path: serverPath,
            method: "POST"
        };
        var req = http.request(options, function (res) {
            res.setEncoding("utf8");
        });
        req.on("error", function (e) {
            logger.warn("problem with request on server: " + e.message);
        });
        var sendData = JSON.stringify({
            "id": docId,
            "c": "cc"
        });
        req.write(sendData);
        req.end();
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
            if (oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["c1"] = oRecalcIndexColumns[sheetId].getLockMe2(oRangeOrObjectId["c1"]);
                oRangeOrObjectId["c2"] = oRecalcIndexColumns[sheetId].getLockMe2(oRangeOrObjectId["c2"]);
            }
            if (oRecalcIndexRows.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["r1"] = oRecalcIndexRows[sheetId].getLockMe2(oRangeOrObjectId["r1"]);
                oRangeOrObjectId["r2"] = oRecalcIndexRows[sheetId].getLockMe2(oRangeOrObjectId["r2"]);
            }
        }
    }
    function _addRecalcIndex(oRecalcIndex) {
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
    dataHandler = (function () {
        function auth(conn, data) {
            if (data.token && data.user) {
                var parsed = urlParse.exec(conn.url);
                if (parsed.length > 1) {
                    conn.docId = parsed[1];
                } else {}
                if (!indexuser.hasOwnProperty(conn.docId)) {
                    indexuser[conn.docId] = 1;
                } else {
                    indexuser[conn.docId] += 1;
                }
                conn.sessionState = 1;
                conn.userId = data.user + indexuser[conn.docId];
                conn.userName = data.username;
                conn.serverHost = data.serverHost;
                conn.serverPath = data.serverPath;
                if (data.sessionId !== null && _.isString(data.sessionId) && data.sessionId !== "") {
                    logger.info("restored old session id=" + data.sessionId);
                    connections = _.reject(connections, function (el) {
                        return el.connection.sessionId === data.sessionId;
                    });
                    conn.sessionId = data.sessionId;
                } else {
                    conn.sessionId = conn.id;
                }
                connections.push({
                    connection: conn
                });
                var participants = getParticipants(conn.docId);
                var participantsMap = _.map(participants, function (conn) {
                    return {
                        id: conn.connection.userId,
                        username: conn.connection.userName
                    };
                });
                sendData(conn, {
                    type: "auth",
                    result: 1,
                    sessionId: conn.sessionId,
                    participants: participantsMap,
                    messages: messages[conn.docid],
                    locks: locks[conn.docId],
                    changes: objchanges[conn.docId],
                    indexuser: indexuser[conn.docId]
                });
                sendParticipantsState(participants, true, conn.userId, conn.userName, participantsMap);
            }
        }
        function message(conn, data) {
            var participants = getParticipants(conn.docId),
            msg = {
                docid: conn.docId,
                message: data.message,
                time: Date.now(),
                user: conn.userId,
                username: conn.userName
            };
            if (!messages.hasOwnProperty(conn.docId)) {
                messages[conn.docId] = [msg];
            } else {
                messages[conn.docId].push(msg);
            }
            logger.info("database insert message: " + JSON.stringify(msg));
            if (dataBase) {
                dataBase.insert("messages", msg);
            }
            _.each(participants, function (participant) {
                sendData(participant.connection, {
                    type: "message",
                    messages: [msg]
                });
            });
        }
        function getlock(conn, data) {
            var participants = getParticipants(conn.docId),
            documentLocks;
            if (!locks.hasOwnProperty(conn.docId)) {
                locks[conn.docId] = {};
            }
            documentLocks = locks[conn.docId];
            var arrayBlocks = data.block;
            var isLock = false;
            var i = 0;
            var lengthArray = (arrayBlocks) ? arrayBlocks.length : 0;
            for (; i < lengthArray; ++i) {
                logger.info("getLock id: " + arrayBlocks[i]);
                if (documentLocks.hasOwnProperty(arrayBlocks[i]) && documentLocks[arrayBlocks[i]] !== null) {
                    isLock = true;
                    break;
                }
            }
            if (0 === lengthArray) {
                isLock = true;
            }
            if (!isLock) {
                for (i = 0; i < lengthArray; ++i) {
                    documentLocks[arrayBlocks[i]] = {
                        time: Date.now(),
                        user: conn.userId,
                        block: arrayBlocks[i],
                        sessionId: conn.sessionId
                    };
                }
            }
            _.each(participants, function (participant) {
                sendData(participant.connection, {
                    type: "getlock",
                    locks: locks[conn.docId]
                });
            });
        }
        function getlockrange(conn, data) {
            var participants = getParticipants(conn.docId),
            documentLocks,
            documentLock;
            if (!locks.hasOwnProperty(conn.docId)) {
                locks[conn.docId] = [];
            }
            documentLocks = locks[conn.docId];
            var arrayBlocks = data.block;
            var isLock = false;
            var isExistInArray = false;
            var i = 0,
            blockRange = null;
            var lengthArray = (arrayBlocks) ? arrayBlocks.length : 0;
            for (; i < lengthArray && false === isLock; ++i) {
                blockRange = arrayBlocks[i];
                for (var keyLockInArray in documentLocks) {
                    if (true === isLock) {
                        break;
                    }
                    if (!documentLocks.hasOwnProperty(keyLockInArray)) {
                        continue;
                    }
                    documentLock = documentLocks[keyLockInArray];
                    if (documentLock.user === conn.userId && blockRange.sheetId === documentLock.block.sheetId && blockRange.type === c_oAscLockTypeElem.Object && documentLock.block.type === c_oAscLockTypeElem.Object && documentLock.block.rangeOrObjectId === blockRange.rangeOrObjectId) {
                        isExistInArray = true;
                        break;
                    }
                    if (c_oAscLockTypeElem.Sheet === blockRange.type && c_oAscLockTypeElem.Sheet === documentLock.block.type) {
                        if (documentLock.user === conn.userId) {
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
                    if (documentLock.user === conn.userId || !(documentLock.block) || blockRange.sheetId !== documentLock.block.sheetId) {
                        continue;
                    }
                    isLock = compareExcelBlock(blockRange, documentLock.block);
                }
            }
            if (0 === lengthArray) {
                isLock = true;
            }
            if (!isLock && !isExistInArray) {
                for (i = 0; i < lengthArray; ++i) {
                    blockRange = arrayBlocks[i];
                    documentLocks.push({
                        time: Date.now(),
                        user: conn.userId,
                        block: blockRange,
                        sessionId: conn.sessionId
                    });
                }
            }
            _.each(participants, function (participant) {
                sendData(participant.connection, {
                    type: "getlock",
                    locks: locks[conn.docId]
                });
            });
        }
        function getlockpresentation(conn, data) {
            var participants = getParticipants(conn.docId),
            documentLocks,
            documentLock;
            if (!locks.hasOwnProperty(conn.docId)) {
                locks[conn.docId] = [];
            }
            documentLocks = locks[conn.docId];
            var arrayBlocks = data.block;
            var isLock = false;
            var isExistInArray = false;
            var i = 0,
            blockRange = null;
            var lengthArray = (arrayBlocks) ? arrayBlocks.length : 0;
            for (; i < lengthArray && false === isLock; ++i) {
                blockRange = arrayBlocks[i];
                for (var keyLockInArray in documentLocks) {
                    if (true === isLock) {
                        break;
                    }
                    if (!documentLocks.hasOwnProperty(keyLockInArray)) {
                        continue;
                    }
                    documentLock = documentLocks[keyLockInArray];
                    if (documentLock.user === conn.userId || !(documentLock.block)) {
                        continue;
                    }
                    isLock = comparePresentationBlock(blockRange, documentLock.block);
                }
            }
            if (0 === lengthArray) {
                isLock = true;
            }
            if (!isLock && !isExistInArray) {
                for (i = 0; i < lengthArray; ++i) {
                    blockRange = arrayBlocks[i];
                    documentLocks.push({
                        time: Date.now(),
                        user: conn.userId,
                        block: blockRange,
                        sessionId: conn.sessionId
                    });
                }
            }
            _.each(participants, function (participant) {
                sendData(participant.connection, {
                    type: "getlock",
                    locks: locks[conn.docId]
                });
            });
        }
        function savechanges(conn, data) {
            var docLock, userLocks, participants;
            if (data.endSaveChanges) {
                docLock = locks[conn.docId];
                if (docLock) {
                    if ("array" === typeOf(docLock)) {
                        userLocks = [];
                        for (var nIndex = 0; nIndex < docLock.length; ++nIndex) {
                            if (null !== docLock[nIndex] && docLock[nIndex].sessionId === conn.sessionId) {
                                userLocks.push(docLock[nIndex]);
                                docLock.splice(nIndex, 1);
                                --nIndex;
                            }
                        }
                    } else {
                        userLocks = _.filter(docLock, function (el) {
                            return el !== null && el.sessionId === conn.sessionId;
                        });
                        for (var i = 0; i < userLocks.length; i++) {
                            delete docLock[userLocks[i].block];
                        }
                    }
                }
            } else {
                userLocks = [];
            }
            var objchange = {
                docid: conn.docId,
                changes: data.changes,
                time: Date.now(),
                user: conn.userId
            };
            if (!objchanges.hasOwnProperty(conn.docId)) {
                objchanges[conn.docId] = [objchange];
            } else {
                objchanges[conn.docId].push(objchange);
            }
            logger.info("database insert changes: " + JSON.stringify(objchange));
            if (dataBase) {
                dataBase.insert("changes", objchange);
            }
            if (!data.endSaveChanges) {
                sendData(conn, {
                    type: "savePartChanges"
                });
            } else {
                if (data.isExcel) {
                    var oElement = null;
                    var oRecalcIndexColumns = null,
                    oRecalcIndexRows = null;
                    var oChanges = JSON.parse(data.changes);
                    var nCount = oChanges.length;
                    var nIndexChanges = 0;
                    for (; nIndexChanges < nCount; ++nIndexChanges) {
                        oElement = oChanges[nIndexChanges];
                        if ("object" === typeof oElement) {
                            if ("0" === oElement["type"]) {
                                oRecalcIndexColumns = _addRecalcIndex(oElement["index"]);
                            } else {
                                if ("1" === oElement["type"]) {
                                    oRecalcIndexRows = _addRecalcIndex(oElement["index"]);
                                }
                            }
                        }
                        if (null !== oRecalcIndexColumns && null !== oRecalcIndexRows) {
                            _recalcLockArray(conn.userId, locks[conn.docId], oRecalcIndexColumns, oRecalcIndexRows);
                            oRecalcIndexColumns = null;
                            oRecalcIndexRows = null;
                            break;
                        }
                    }
                }
            }
            participants = getParticipants(conn.docId, conn.userId);
            _.each(participants, function (participant) {
                sendData(participant.connection, {
                    type: "savechanges",
                    changes: data.changes,
                    locks: _.map(userLocks, function (e) {
                        return {
                            block: e.block,
                            user: e.user,
                            time: Date.now(),
                            changes: null
                        };
                    })
                });
            });
        }
        function issavelock(conn) {
            var _docId = conn.docId;
            var _userId = conn.userId;
            var _time = Date.now();
            var isSaveLock = (undefined === arrsavelock[_docId]) ? false : arrsavelock[_docId].savelock;
            if (false === isSaveLock) {
                arrsavelock[conn.docId] = {
                    docid: _docId,
                    savelock: true,
                    time: Date.now(),
                    user: conn.userId
                };
                var _tmpSaveLock = arrsavelock[_docId];
                arrsavelock[conn.docId].saveLockTimeOutId = setTimeout(function () {
                    if (_tmpSaveLock && _userId == _tmpSaveLock.user && _time == _tmpSaveLock.time) {
                        arrsavelock[_docId] = undefined;
                    }
                },
                60000);
            }
            sendData(conn, {
                type: "savelock",
                savelock: isSaveLock
            });
        }
        function unsavelock(conn) {
            if (undefined != arrsavelock[conn.docId] && conn.userId != arrsavelock[conn.docId].user) {
                return;
            }
            if (arrsavelock[conn.docId] && null != arrsavelock[conn.docId].saveLockTimeOutId) {
                clearTimeout(arrsavelock[conn.docId].saveLockTimeOutId);
            }
            arrsavelock[conn.docId] = undefined;
            sendData(conn, {
                type: "unsavelock"
            });
        }
        function getmessages(conn) {
            sendData(conn, {
                type: "message",
                messages: messages[conn.docId]
            });
        }
        function getusers(conn) {
            var participants = getParticipants(conn.docId);
            sendData(conn, {
                type: "getusers",
                participants: _.map(participants, function (conn) {
                    return {
                        id: conn.connection.userId,
                        username: conn.connection.userName
                    };
                })
            });
        }
        return {
            auth: auth,
            message: message,
            getlock: getlock,
            getlockrange: getlockrange,
            getlockpresentation: getlockpresentation,
            savechanges: savechanges,
            issavelock: issavelock,
            unsavelock: unsavelock,
            getmessages: getmessages,
            getusers: getusers
        };
    } ());
    sockjs_echo.installHandlers(server, {
        prefix: "/doc/[0-9-.a-zA-Z_=]*/c",
        log: function (severity, message) {
            logger.info(message);
        }
    });
    var callbackLoadMessages = (function (arrayElements) {
        if (null != arrayElements) {
            messages = arrayElements;
            if (dataBase) {
                dataBase.remove("messages", {});
            }
        }
        if (dataBase) {
            dataBase.load("changes", callbackLoadChanges);
        } else {
            callbackLoadChanges(null);
        }
    });
    var callbackLoadChanges = (function (arrayElements) {
        if (null != arrayElements) {
            if (dataBase) {
                dataBase.remove("changes", {});
            }
        }
        callbackFunction();
    });
    if (dataBase) {
        dataBase.load("messages", callbackLoadMessages);
    } else {
        callbackLoadMessages(null);
    }
};