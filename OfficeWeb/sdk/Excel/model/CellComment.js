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
 function asc_CCommentCoords(obj) {
    var _this = this;
    if (obj) {
        _this.nRow = obj.nRow;
        _this.nCol = obj.nCol;
        _this.nLeft = obj.nLeft;
        _this.nLeftOffset = obj.nLeftOffset;
        _this.nTop = obj.nTop;
        _this.nTopOffset = obj.nTopOffset;
        _this.nRight = obj.nRight;
        _this.nRightOffset = obj.nRightOffset;
        _this.nBottom = obj.nBottom;
        _this.nBottomOffset = obj.nBottomOffset;
        _this.dLeftMM = obj.dLeftMM;
        _this.dTopMM = obj.dTopMM;
        _this.dLeftPX = obj.dLeftPX;
        _this.dReverseLeftPX = obj.dReverseLeftPX;
        _this.dTopPX = obj.dTopPX;
        _this.dWidthMM = obj.dWidthMM;
        _this.dHeightMM = obj.dHeightMM;
        _this.dWidthPX = obj.dWidthPX;
        _this.dHeightPX = obj.dHeightPX;
        _this.bMoveWithCells = obj.bMoveWithCells;
        _this.bSizeWithCells = obj.bSizeWithCells;
    } else {
        _this.nRow = null;
        _this.nCol = null;
        _this.nLeft = null;
        _this.nLeftOffset = null;
        _this.nTop = null;
        _this.nTopOffset = null;
        _this.nRight = null;
        _this.nRightOffset = null;
        _this.nBottom = null;
        _this.nBottomOffset = null;
        _this.dLeftMM = null;
        _this.dTopMM = null;
        _this.dLeftPX = null;
        _this.dReverseLeftPX = null;
        _this.dTopPX = null;
        _this.dWidthMM = null;
        _this.dHeightMM = null;
        _this.dWidthPX = null;
        _this.dHeightPX = null;
        _this.bMoveWithCells = false;
        _this.bSizeWithCells = false;
    }
}
asc_CCommentCoords.prototype = {
    asc_setRow: function (val) {
        this.nRow = val;
    },
    asc_getRow: function () {
        return this.nRow;
    },
    asc_setCol: function (val) {
        this.nCol = val;
    },
    asc_getCol: function () {
        return this.nCol;
    },
    asc_setLeft: function (val) {
        this.nLeft = val;
    },
    asc_getLeft: function () {
        return this.nLeft;
    },
    asc_setLeftOffset: function (val) {
        this.nLeftOffset = val;
    },
    asc_getLeftOffset: function () {
        return this.nLeftOffset;
    },
    asc_setTop: function (val) {
        this.nTop = val;
    },
    asc_getTop: function () {
        return this.nTop;
    },
    asc_setTopOffset: function (val) {
        this.nTopOffset = val;
    },
    asc_getTopOffset: function () {
        return this.nTopOffset;
    },
    asc_setRight: function (val) {
        this.nRight = val;
    },
    asc_getRight: function () {
        return this.nRight;
    },
    asc_setRightOffset: function (val) {
        this.nRightOffset = val;
    },
    asc_getRightOffset: function () {
        return this.nRightOffset;
    },
    asc_setBottom: function (val) {
        this.nBottom = val;
    },
    asc_getBottom: function () {
        return this.nBottom;
    },
    asc_setBottomOffset: function (val) {
        this.nBottomOffset = val;
    },
    asc_getBottomOffset: function () {
        return this.nBottomOffset;
    },
    asc_setLeftMM: function (val) {
        this.dLeftMM = val;
    },
    asc_getLeftMM: function () {
        return this.dLeftMM;
    },
    asc_setLeftPX: function (val) {
        this.dLeftPX = val;
    },
    asc_getLeftPX: function () {
        return this.dLeftPX;
    },
    asc_setReverseLeftPX: function (val) {
        this.dReverseLeftPX = val;
    },
    asc_getReverseLeftPX: function () {
        return this.dReverseLeftPX;
    },
    asc_setTopMM: function (val) {
        this.dTopMM = val;
    },
    asc_getTopMM: function () {
        return this.dTopMM;
    },
    asc_setTopPX: function (val) {
        this.dTopPX = val;
    },
    asc_getTopPX: function () {
        return this.dTopPX;
    },
    asc_setWidthMM: function (val) {
        this.dWidthMM = val;
    },
    asc_getWidthMM: function () {
        return this.dWidthMM;
    },
    asc_setHeightMM: function (val) {
        this.dHeightMM = val;
    },
    asc_getHeightMM: function () {
        return this.dHeightMM;
    },
    asc_setWidthPX: function (val) {
        this.dWidthPX = val;
    },
    asc_getWidthPX: function () {
        return this.dWidthPX;
    },
    asc_setHeightPX: function (val) {
        this.dHeightPX = val;
    },
    asc_getHeightPX: function () {
        return this.dHeightPX;
    },
    asc_setMoveWithCells: function (val) {
        this.bMoveWithCells = val;
    },
    asc_getMoveWithCells: function () {
        return this.bMoveWithCells;
    },
    asc_setSizeWithCells: function (val) {
        this.bSizeWithCells = val;
    },
    asc_getSizeWithCells: function () {
        return this.bSizeWithCells;
    }
};
window["Asc"]["asc_CCommentCoords"] = window["Asc"].asc_CCommentCoords = asc_CCommentCoords;
prot = asc_CCommentCoords.prototype;
prot["asc_setRow"] = prot.asc_setRow;
prot["asc_getRow"] = prot.asc_getRow;
prot["asc_setCol"] = prot.asc_setCol;
prot["asc_setCol"] = prot.asc_setCol;
prot["asc_setLeft"] = prot.asc_setLeft;
prot["asc_getLeft"] = prot.asc_getLeft;
prot["asc_setLeftOffset"] = prot.asc_setLeftOffset;
prot["asc_getLeftOffset"] = prot.asc_getLeftOffset;
prot["asc_setTop"] = prot.asc_setTop;
prot["asc_getTop"] = prot.asc_getTop;
prot["asc_setTopOffset"] = prot.asc_setTopOffset;
prot["asc_getTopOffset"] = prot.asc_getTopOffset;
prot["asc_setRight"] = prot.asc_setRight;
prot["asc_getRight"] = prot.asc_getRight;
prot["asc_setRightOffset"] = prot.asc_setRightOffset;
prot["asc_getRightOffset"] = prot.asc_getRightOffset;
prot["asc_setBottom"] = prot.asc_setBottom;
prot["asc_getBottom"] = prot.asc_getBottom;
prot["asc_setBottomOffset"] = prot.asc_setBottomOffset;
prot["asc_getBottomOffset"] = prot.asc_getBottomOffset;
prot["asc_setLeftMM"] = prot.asc_setLeftMM;
prot["asc_getLeftMM"] = prot.asc_getLeftMM;
prot["asc_setLeftPX"] = prot.asc_setLeftPX;
prot["asc_getLeftPX"] = prot.asc_getLeftPX;
prot["asc_setTopMM"] = prot.asc_setTopMM;
prot["asc_getTopMM"] = prot.asc_getTopMM;
prot["asc_setTopPX"] = prot.asc_setTopPX;
prot["asc_getTopPX"] = prot.asc_getTopPX;
prot["asc_setWidthMM"] = prot.asc_setWidthMM;
prot["asc_getWidthMM"] = prot.asc_getWidthMM;
prot["asc_setHeightMM"] = prot.asc_setHeightMM;
prot["asc_getHeightMM"] = prot.asc_getHeightMM;
prot["asc_setWidthPX"] = prot.asc_setWidthPX;
prot["asc_getWidthPX"] = prot.asc_getWidthPX;
prot["asc_setHeightPX"] = prot.asc_setHeightPX;
prot["asc_getHeightPX"] = prot.asc_getHeightPX;
prot["asc_setMoveWithCells"] = prot.asc_setMoveWithCells;
prot["asc_getMoveWithCells"] = prot.asc_getMoveWithCells;
prot["asc_setSizeWithCells"] = prot.asc_setSizeWithCells;
prot["asc_getSizeWithCells"] = prot.asc_getSizeWithCells;
function asc_CCommentData(obj) {
    var _this = this;
    _this.Properties = {
        wsId: 0,
        nCol: 1,
        nRow: 2,
        nId: 3,
        nLevel: 5,
        sText: 6,
        sQuoteText: 7,
        sTime: 8,
        sUserId: 9,
        sUserName: 10,
        bDocument: 11,
        bSolved: 12,
        aReplies: 13,
        bHidden: 14
    };
    if (obj) {
        _this.bHidden = obj.bHidden;
        _this.wsId = obj.wsId;
        _this.nCol = obj.nCol;
        _this.nRow = obj.nRow;
        _this.nId = obj.nId;
        _this.oParent = obj.oParent;
        _this.nLevel = (_this.oParent == null) ? 0 : _this.oParent.asc_getLevel() + 1;
        _this.sText = obj.sText;
        _this.sQuoteText = obj.sQuoteText;
        _this.sTime = obj.sTime;
        _this.sUserId = obj.sUserId;
        _this.sUserName = obj.sUserName;
        _this.bDocument = obj.bDocument;
        _this.bSolved = obj.bSolved;
        _this.aReplies = [];
        for (var i = 0; i < obj.aReplies.length; i++) {
            var item = new asc_CCommentData(obj.aReplies[i]);
            _this.aReplies.push(item);
        }
    } else {
        _this.bHidden = false;
        _this.wsId = null;
        _this.nCol = 0;
        _this.nRow = 0;
        _this.nId = null;
        _this.oParent = null;
        _this.nLevel = 0;
        _this.sText = "";
        _this.sQuoteText = "";
        _this.sTime = "";
        _this.sUserId = "";
        _this.sUserName = "";
        _this.bDocument = true;
        _this.bSolved = false;
        _this.aReplies = [];
    }
    _this.setId = function () {
        if (_this.bDocument) {
            _this.nId = "doc_" + guid();
        } else {
            _this.nId = "sheet" + _this.wsId + "_" + guid();
        }
    };
    function guid() {
        function S4() {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}
asc_CCommentData.prototype = {
    asc_putQuoteText: function (val) {
        this.sQuoteText = val;
    },
    asc_getQuoteText: function () {
        return this.sQuoteText;
    },
    asc_putRow: function (val) {
        this.nRow = val;
    },
    asc_getRow: function () {
        return this.nRow;
    },
    asc_putCol: function (val) {
        this.nCol = val;
    },
    asc_getCol: function () {
        return this.nCol;
    },
    asc_putId: function (val) {
        this.nId = val;
    },
    asc_getId: function () {
        return this.nId;
    },
    asc_putLevel: function (val) {
        this.nLevel = val;
    },
    asc_getLevel: function () {
        return this.nLevel;
    },
    asc_putParent: function (obj) {
        this.oParent = obj;
    },
    asc_getParent: function () {
        return this.oParent;
    },
    asc_putText: function (val) {
        this.sText = val;
    },
    asc_getText: function () {
        return this.sText;
    },
    asc_putTime: function (val) {
        this.sTime = val;
    },
    asc_getTime: function () {
        return this.sTime;
    },
    asc_putUserId: function (val) {
        this.sUserId = val;
    },
    asc_getUserId: function () {
        return this.sUserId;
    },
    asc_putUserName: function (val) {
        this.sUserName = val;
    },
    asc_getUserName: function () {
        return this.sUserName;
    },
    asc_putDocumentFlag: function (val) {
        this.bDocument = val;
    },
    asc_getDocumentFlag: function () {
        return this.bDocument;
    },
    asc_putHiddenFlag: function (val) {
        this.bHidden = val;
    },
    asc_getHiddenFlag: function () {
        return this.bHidden;
    },
    asc_putSolved: function (val) {
        this.bSolved = val;
    },
    asc_getSolved: function () {
        return this.bSolved;
    },
    asc_getRepliesCount: function () {
        return this.aReplies.length;
    },
    asc_getReply: function (index) {
        return this.aReplies[index];
    },
    asc_addReply: function (oReply) {
        oReply.asc_putParent(this);
        oReply.asc_putDocumentFlag(this.asc_getDocumentFlag());
        oReply.asc_putLevel((oReply.oParent == null) ? 0 : oReply.oParent.asc_getLevel() + 1);
        oReply.wsId = (oReply.oParent == null) ? -1 : oReply.oParent.wsId;
        oReply.setId();
        oReply.asc_putCol(this.nCol);
        oReply.asc_putRow(this.nRow);
        this.aReplies.push(oReply);
        return oReply;
    },
    getType: function () {
        return UndoRedoDataTypes.CommentData;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.wsId:
            return this.wsId;
            break;
        case this.Properties.nCol:
            return this.nCol;
            break;
        case this.Properties.nRow:
            return this.nRow;
            break;
        case this.Properties.nId:
            return this.nId;
            break;
        case this.Properties.nLevel:
            return this.nLevel;
            break;
        case this.Properties.sText:
            return this.sText;
            break;
        case this.Properties.sQuoteText:
            return this.sQuoteText;
            break;
        case this.Properties.sTime:
            return this.sTime;
            break;
        case this.Properties.sUserId:
            return this.sUserId;
            break;
        case this.Properties.sUserName:
            return this.sUserName;
            break;
        case this.Properties.bDocument:
            return this.bDocument;
            break;
        case this.Properties.bSolved:
            return this.bSolved;
            break;
        case this.Properties.aReplies:
            return this.aReplies;
            break;
        case this.Properties.bHidden:
            return this.bHidden;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.wsId:
            this.wsId = value;
            break;
        case this.Properties.nCol:
            this.nCol = value;
            break;
        case this.Properties.nRow:
            this.nRow = value;
            break;
        case this.Properties.nId:
            this.nId = value;
            break;
        case this.Properties.nLevel:
            this.nLevel = value;
            break;
        case this.Properties.sText:
            this.sText = value;
            break;
        case this.Properties.sQuoteText:
            this.sQuoteText = value;
            break;
        case this.Properties.sTime:
            this.sTime = value;
            break;
        case this.Properties.sUserId:
            this.sUserId = value;
            break;
        case this.Properties.sUserName:
            this.sUserName = value;
            break;
        case this.Properties.bDocument:
            this.bDocument = value;
            break;
        case this.Properties.bSolved:
            this.bSolved = value;
            break;
        case this.Properties.aReplies:
            this.aReplies = value;
            break;
        case this.Properties.bHidden:
            this.bHidden = value;
            break;
        }
    },
    applyCollaborative: function (nSheetId, collaborativeEditing) {
        if (!this.bDocument) {
            this.nCol = collaborativeEditing.getLockMeColumn2(nSheetId, this.nCol);
            this.nRow = collaborativeEditing.getLockMeRow2(nSheetId, this.nRow);
        }
    }
};
window["Asc"]["asc_CCommentData"] = window["Asc"].asc_CCommentData = asc_CCommentData;
prot = asc_CCommentData.prototype;
prot["asc_putRow"] = prot.asc_putRow;
prot["asc_getRow"] = prot.asc_getRow;
prot["asc_putCol"] = prot.asc_putCol;
prot["asc_getCol"] = prot.asc_getCol;
prot["asc_putId"] = prot.asc_putId;
prot["asc_getId"] = prot.asc_getId;
prot["asc_putLevel"] = prot.asc_putLevel;
prot["asc_getLevel"] = prot.asc_getLevel;
prot["asc_putParent"] = prot.asc_putParent;
prot["asc_getParent"] = prot.asc_getParent;
prot["asc_putText"] = prot.asc_putText;
prot["asc_getText"] = prot.asc_getText;
prot["asc_putQuoteText"] = prot.asc_putQuoteText;
prot["asc_getQuoteText"] = prot.asc_getQuoteText;
prot["asc_putTime"] = prot.asc_putTime;
prot["asc_getTime"] = prot.asc_getTime;
prot["asc_putUserId"] = prot.asc_putUserId;
prot["asc_getUserId"] = prot.asc_getUserId;
prot["asc_putUserName"] = prot.asc_putUserName;
prot["asc_getUserName"] = prot.asc_getUserName;
prot["asc_putDocumentFlag"] = prot.asc_putDocumentFlag;
prot["asc_getDocumentFlag"] = prot.asc_getDocumentFlag;
prot["asc_putHiddenFlag"] = prot.asc_putHiddenFlag;
prot["asc_getHiddenFlag"] = prot.asc_getHiddenFlag;
prot["asc_putSolved"] = prot.asc_putSolved;
prot["asc_getSolved"] = prot.asc_getSolved;
prot["asc_getRepliesCount"] = prot.asc_getRepliesCount;
prot["asc_getReply"] = prot.asc_getReply;
prot["asc_addReply"] = prot.asc_addReply;
function CompositeCommentData() {
    var _this = this;
    _this.commentBefore = null;
    _this.commentAfter = null;
    _this.Properties = {
        commentBefore: 0,
        commentAfter: 1
    };
}
CompositeCommentData.prototype = {
    getType: function () {
        return UndoRedoDataTypes.CompositeCommentData;
    },
    getProperties: function () {
        return this.Properties;
    },
    getProperty: function (nType) {
        switch (nType) {
        case this.Properties.commentBefore:
            return this.commentBefore;
            break;
        case this.Properties.commentAfter:
            return this.commentAfter;
            break;
        }
    },
    setProperty: function (nType, value) {
        switch (nType) {
        case this.Properties.commentBefore:
            this.commentBefore = value;
            break;
        case this.Properties.commentAfter:
            this.commentAfter = value;
            break;
        }
    }
};
function asc_CCellCommentator(currentSheet) {
    var _this = this;
    var asc = window["Asc"];
    var asc_Range = asc.Range;
    var asc_CCollaborativeRange = asc.asc_CCollaborativeRange;
    var isViewerMode = function () {
        return _this.worksheet._trigger("getViewerMode");
    };
    _this.worksheet = currentSheet;
    _this.overlayCtx = currentSheet.overlayCtx;
    _this.drawingCtx = currentSheet.drawingCtx;
    _this.bShow = true;
    _this.commentIconColor = "#FF9000";
    _this.commentBorderColor = "#C7C7C7";
    _this.commentTextColor = "#000000";
    _this.commentFillColor = "#FFFF00";
    _this.commentBorderWidth = 1;
    _this.commentPadding = 4;
    _this.minAreaWidth = 160;
    _this.minAreaHeight = 80;
    _this.aComments = [];
    _this.aCommentCoords = [];
    _this.lastSelectedId = null;
    _this.bSaveHistory = true;
    _this.isLockedComment = function (oComment, lockByDefault, callbackFunc) {
        var _this = this;
        var lockInfo;
        var model = _this.worksheet.model;
        var sheetId = model.getId();
        var objectGuid = oComment.asc_getId();
        if (objectGuid) {
            if (false === _this.worksheet.collaborativeEditing.isCoAuthoringExcellEnable()) {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(true);
                }
                return;
            }
            if (lockByDefault) {
                _this.worksheet.collaborativeEditing.onStartCheckLock();
            }
            if (!oComment.asc_getDocumentFlag()) {
                var c = oComment.asc_getCol();
                var r = oComment.asc_getRow();
                var c1, r1, c2, r2;
                var mergedRange = model.getMergedByCell(r, c);
                if (mergedRange) {
                    c1 = mergedRange.c1;
                    r1 = mergedRange.r1;
                    c2 = mergedRange.c2;
                    r2 = mergedRange.r2;
                } else {
                    c1 = c2 = c;
                    r1 = r2 = r;
                }
                lockInfo = _this.worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, null, sheetId, new asc_CCollaborativeRange(c1, r1, c2, r2));
            } else {
                lockInfo = _this.worksheet.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, objectGuid);
            }
            if (false === _this.worksheet.collaborativeEditing.getCollaborativeEditing()) {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(true);
                }
                callbackFunc = undefined;
            }
            if (false !== _this.worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, false)) {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(true);
                }
                return;
            } else {
                if (false !== _this.worksheet.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                    if ($.isFunction(callbackFunc)) {
                        callbackFunc(false);
                    }
                    return;
                }
            }
            if (lockByDefault) {
                _this.worksheet.collaborativeEditing.addCheckLock(lockInfo);
                _this.worksheet.collaborativeEditing.onEndCheckLock(callbackFunc);
            } else {
                if ($.isFunction(callbackFunc)) {
                    callbackFunc(true);
                }
            }
        }
    };
    _this.callLockComments = function (range) {
        if (range) {
            for (var i = 0; i < _this.aComments.length; i++) {
                var comment = _this.aComments[i];
                if ((comment.nCol >= range.c1) && (comment.nCol <= range.c2) && (comment.nRow >= range.r1) && (comment.nRow <= range.r2)) {
                    _this.worksheet.model.workbook.handlers.trigger("asc_onLockComment", comment.asc_getId(), comment.asc_getUserId());
                }
            }
        }
    };
    _this.unlockComments = function () {
        for (var i = 0; i < _this.aComments.length; i++) {
            _this.worksheet.model.workbook.handlers.trigger("asc_onUnLockComment", _this.aComments[i].asc_getId());
        }
    };
    _this.tryUnlockComment = function (id) {
        for (var i = 0; i < _this.aComments.length; i++) {
            if (_this.aComments[i].asc_getId() == id) {
                _this.worksheet.model.workbook.handlers.trigger("asc_onUnLockComment", id);
                break;
            }
        }
    };
    _this.moveRangeComments = function (rangeFrom, rangeTo) {
        if (rangeFrom && rangeTo) {
            var colOffset = rangeTo.c1 - rangeFrom.c1;
            var rowOffset = rangeTo.r1 - rangeFrom.r1;
            _this.worksheet.model.workbook.handlers.trigger("asc_onHideComment");
            for (var i = 0; i < _this.aComments.length; i++) {
                var comment = _this.aComments[i];
                if ((comment.nCol >= rangeFrom.c1) && (comment.nCol <= rangeFrom.c2) && (comment.nRow >= rangeFrom.r1) && (comment.nRow <= rangeFrom.r2)) {
                    var commentBefore = new asc_CCommentData(comment);
                    comment.nCol += colOffset;
                    comment.nRow += rowOffset;
                    var cellAddress = new CellAddress(comment.nRow, comment.nCol, 0);
                    comment.sQuoteText = cellAddress.getID() + " : " + _this.worksheet.model.getCell(cellAddress).getValueWithFormat();
                    _this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
                    var commentAfter = new asc_CCommentData(comment);
                    var compositeComment = new CompositeCommentData();
                    compositeComment.commentBefore = commentBefore;
                    compositeComment.commentAfter = commentAfter;
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoComment, historyitem_Comment_Change, _this.worksheet.model.getId(), null, compositeComment);
                }
            }
        }
    };
    _this.deleteCommentsRange = function (range) {
        if (range) {
            var aCommentId = [];
            for (var i = 0; i < _this.aComments.length; ++i) {
                var comment = _this.aComments[i];
                if ((comment.nCol >= range.c1) && (comment.nCol <= range.c2) && (comment.nRow >= range.r1) && (comment.nRow <= range.r2)) {
                    aCommentId.push(comment.asc_getId());
                }
            }
            History.StartTransaction();
            for (var i = 0; i < aCommentId.length; i++) {
                _this.asc_removeComment(aCommentId[i]);
            }
            History.EndTransaction();
        }
    };
    _this.addCommentSerialize = function (oComment) {
        var _this = this;
        if (oComment) {
            if (!oComment.bDocument && (oComment.nCol != null) && (oComment.nRow != null)) {
                var cellAddress = new CellAddress(oComment.nRow, oComment.nCol, 0);
                oComment.sQuoteText = cellAddress.getID() + " : " + _this.worksheet.model.getCell(cellAddress).getValueWithFormat();
            }
            _this.aComments.push(oComment);
        }
    };
    _this.getCommentsXY = function (x, y) {
        var _this = this;
        var findCol = _this.worksheet._findColUnderCursor(_this.pxToPt(x), true);
        var findRow = _this.worksheet._findRowUnderCursor(_this.pxToPt(y), true);
        return (findCol && findRow) ? _this.asc_getComments(findCol.col, findRow.row) : [];
    };
    _this.drawCommentCells = function () {
        if (isViewerMode()) {
            return;
        }
        if (!_this.bShow) {
            return;
        }
        var fvr = _this.worksheet.getFirstVisibleRow();
        var fvc = _this.worksheet.getFirstVisibleCol();
        var lvr = _this.worksheet.getLastVisibleRow();
        var lvc = _this.worksheet.getLastVisibleCol();
        var drawCells = [];
        function getCellId(col, row) {
            return (col + "_" + row);
        }
        for (var i = 0; i < _this.aComments.length; i++) {
            var commentCell = _this.aComments[i];
            var mergedRange = _this.worksheet.model.getMergedByCell(commentCell.nRow, commentCell.nCol);
            var drawCol = mergedRange ? mergedRange.c2 : commentCell.nCol;
            var drawRow = mergedRange ? mergedRange.r1 : commentCell.nRow;
            if (commentCell.asc_getDocumentFlag() || commentCell.asc_getHiddenFlag() || commentCell.asc_getSolved() || (drawCol < fvc) || (drawRow < fvr) || (drawCol > lvc) || (drawRow > lvr)) {
                continue;
            }
            var cellId = getCellId(commentCell.nCol, commentCell.nRow);
            if (drawCells[cellId]) {
                continue;
            }
            var metrics = _this.getCellMetrics(drawCol, drawRow);
            if (!metrics.result || (metrics.width <= 0) || (metrics.height <= 0)) {
                continue;
            }
            this.drawingCtx.beginPath();
            this.drawingCtx.setFillStyle(this.commentIconColor);
            this.drawingCtx.moveTo(this.pxToPt(metrics.left + metrics.width - 7), this.pxToPt(metrics.top));
            this.drawingCtx.lineTo(this.pxToPt(metrics.left + metrics.width - 1), this.pxToPt(metrics.top));
            this.drawingCtx.lineTo(this.pxToPt(metrics.left + metrics.width - 1), this.pxToPt(metrics.top + 6));
            this.drawingCtx.closePath();
            this.drawingCtx.fill();
            drawCells[cellId] = cellId;
        }
    };
    _this.getTextMetrics = function (text, units) {
        var _this = this;
        var metrics = {
            width: 0,
            height: 0
        };
        if (text && text.length && ((typeof(text) == "string") || (typeof(text) == "number"))) {
            var textOptions = _this.overlayCtx.measureText(text, units);
            metrics.width = textOptions.width;
            metrics.height = textOptions.lineHeight;
        }
        return metrics;
    };
    _this.getCellMetrics = function (col, row) {
        var metrics = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            result: false
        };
        var fvr = _this.worksheet.getFirstVisibleRow();
        var fvc = _this.worksheet.getFirstVisibleCol();
        var mergedRange = _this.worksheet.model.getMergedByCell(row, col);
        if (mergedRange && (fvc < mergedRange.c2) && (fvr < mergedRange.r2)) {
            var startCol = (mergedRange.c1 > fvc) ? mergedRange.c1 : fvc;
            var startRow = (mergedRange.r1 > fvr) ? mergedRange.r1 : fvr;
            metrics.top = _this.worksheet.getCellTop(startRow, 0) - _this.worksheet.getCellTop(fvr, 0) + _this.worksheet.getCellTop(0, 0);
            metrics.left = _this.worksheet.getCellLeft(startCol, 0) - _this.worksheet.getCellLeft(fvc, 0) + _this.worksheet.getCellLeft(0, 0);
            for (var i = startCol; i <= mergedRange.c2; i++) {
                metrics.width += _this.worksheet.getColumnWidth(i, 0);
            }
            for (var i = startRow; i <= mergedRange.r2; i++) {
                metrics.height += _this.worksheet.getRowHeight(i, 0);
            }
            metrics.result = true;
        } else {
            if ((fvr <= row) && (fvc <= col)) {
                metrics.top = _this.worksheet.getCellTop(row, 0) - _this.worksheet.getCellTop(fvr, 0) + _this.worksheet.getCellTop(0, 0);
                metrics.left = _this.worksheet.getCellLeft(col, 0) - _this.worksheet.getCellLeft(fvc, 0) + _this.worksheet.getCellLeft(0, 0);
                metrics.width = _this.worksheet.getColumnWidth(col, 0);
                metrics.height = _this.worksheet.getRowHeight(row, 0);
                metrics.result = true;
            }
        }
        return metrics;
    };
    _this.updateCommentPosition = function () {
        var _this = this;
        if (_this.lastSelectedId) {
            var comment = _this.asc_findComment(_this.lastSelectedId);
            if (comment) {
                var commentList = _this.asc_getComments(comment.asc_getCol(), comment.asc_getRow());
                if (commentList.length) {
                    _this.drawCommentCells();
                    var coords = _this.getCommentsCoords(commentList);
                    var indexes = [];
                    for (var i = 0; i < commentList.length; i++) {
                        indexes.push(commentList[i].asc_getId());
                    }
                    var metrics = _this.getCellMetrics(comment.asc_getCol(), comment.asc_getRow());
                    _this.worksheet.model.workbook.handlers.trigger("asc_onUpdateCommentPosition", indexes, (metrics.result ? coords.asc_getLeftPX() : -1), (metrics.result ? coords.asc_getTopPX() : -1), (metrics.result ? coords.asc_getReverseLeftPX() : -1));
                }
            }
        }
    };
    _this.updateCommentsDependencies = function (bInsert, operType, updateRange) {
        var bChange = true;
        var UpdatePair = function (comment, bChange) {
            this.comment = comment;
            this.bChange = bChange;
        };
        var aChangedComments = [];
        function updateCommentsList(aComments) {
            if (aComments.length) {
                _this.bSaveHistory = false;
                for (var i = 0; i < aComments.length; i++) {
                    if (aComments[i].bChange) {
                        _this.asc_changeComment(aComments[i].comment.asc_getId(), aComments[i].comment, true);
                    } else {
                        _this.asc_removeComment(aComments[i].comment.asc_getId());
                    }
                }
                _this.bSaveHistory = true;
                _this.drawCommentCells();
            }
        }
        if (bInsert) {
            switch (operType) {
            case c_oAscInsertOptions.InsertCellsAndShiftDown:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if ((comment.nRow >= updateRange.r1) && (comment.nCol >= updateRange.c1) && (comment.nCol <= updateRange.c2)) {
                        comment.nRow += updateRange.r2 - updateRange.r1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscInsertOptions.InsertCellsAndShiftRight:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if ((comment.nCol >= updateRange.c1) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                        comment.nCol += updateRange.c2 - updateRange.c1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscInsertOptions.InsertColumns:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if (comment.nCol >= updateRange.c1) {
                        comment.nCol += updateRange.c2 - updateRange.c1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscInsertOptions.InsertRows:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if (comment.nRow >= updateRange.r1) {
                        comment.nRow += updateRange.r2 - updateRange.r1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            }
        } else {
            switch (operType) {
            case "deleteAllComments":
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                        aChangedComments.push(new UpdatePair(comment, false));
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if ((comment.nRow > updateRange.r1) && (comment.nCol >= updateRange.c1) && (comment.nCol <= updateRange.c2)) {
                        comment.nRow -= updateRange.r2 - updateRange.r1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    } else {
                        if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                            aChangedComments.push(new UpdatePair(comment, false));
                        }
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if ((comment.nCol > updateRange.c2) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                        comment.nCol -= updateRange.c2 - updateRange.c1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    } else {
                        if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                            aChangedComments.push(new UpdatePair(comment, false));
                        }
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscDeleteOptions.DeleteColumns:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if (comment.nCol > updateRange.c2) {
                        comment.nCol -= updateRange.c2 - updateRange.c1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    } else {
                        if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol)) {
                            aChangedComments.push(new UpdatePair(comment, false));
                        }
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            case c_oAscDeleteOptions.DeleteRows:
                for (var i = 0; i < _this.aComments.length; i++) {
                    var comment = new asc_CCommentData(_this.aComments[i]);
                    if (comment.nRow > updateRange.r2) {
                        comment.nRow -= updateRange.r2 - updateRange.r1 + 1;
                        aChangedComments.push(new UpdatePair(comment, true));
                    } else {
                        if ((updateRange.r1 <= comment.nRow) && (updateRange.r2 >= comment.nRow)) {
                            aChangedComments.push(new UpdatePair(comment, false));
                        }
                    }
                }
                updateCommentsList(aChangedComments);
                break;
            }
        }
    };
    _this.showHideComments = function (bHide, bColumn, start, stop) {
        var aChangedComments = [];
        function updateCommentsList(aComments) {
            if (aComments.length) {
                History.StartTransaction();
                for (var i = 0; i < aComments.length; i++) {
                    _this.asc_changeComment(aComments[i].asc_getId(), aComments[i]);
                }
                History.EndTransaction();
                _this.drawCommentCells();
            }
        }
        for (var i = 0; i < _this.aComments.length; i++) {
            var comment = new asc_CCommentData(_this.aComments[i]);
            if (bColumn) {
                if ((comment.nCol >= start) && (comment.nCol <= stop)) {
                    comment.asc_putHiddenFlag(bHide);
                    aChangedComments.push(comment);
                }
            } else {
                if ((comment.nRow >= start) && (comment.nRow <= stop)) {
                    comment.asc_putHiddenFlag(bHide);
                    aChangedComments.push(comment);
                }
            }
        }
        updateCommentsList(aChangedComments);
    };
    _this.sortComments = function (activeRange, changes) {
        if (changes && activeRange) {
            function updateCommentsList(aComments) {
                if (aComments.length) {
                    History.StartTransaction();
                    for (var i = 0; i < aComments.length; i++) {
                        _this.asc_changeComment(aComments[i].asc_getId(), aComments[i], true);
                    }
                    History.EndTransaction();
                    _this.drawCommentCells();
                }
            }
            var aChangedComments = [];
            for (var i = 0; i < changes.places.length; i++) {
                var list = _this.asc_getComments(activeRange.c1, changes.places[i].from);
                for (var j = 0; j < list.length; j++) {
                    var comment = new asc_CCommentData(list[j]);
                    comment.nRow = changes.places[i].to;
                    aChangedComments.push(comment);
                }
            }
            updateCommentsList(aChangedComments);
        }
    };
    _this.resetLastSelectedId = function () {
        _this.cleanLastSelection();
        _this.lastSelectedId = null;
    };
    _this.cleanLastSelection = function () {
        if (_this.lastSelectedId) {
            var lastComment = _this.asc_findComment(_this.lastSelectedId);
            if (lastComment) {
                var lastMetrics = _this.getCellMetrics(lastComment.nCol, lastComment.nRow);
                if (lastMetrics.result) {
                    var extraOffset = 1;
                    _this.overlayCtx.clearRect(_this.pxToPt(lastMetrics.left), _this.pxToPt(lastMetrics.top), _this.pxToPt(lastMetrics.width - extraOffset), _this.pxToPt(lastMetrics.height - extraOffset));
                }
            }
        }
    };
    _this.calcCommentsCoords = function (bSave) {
        _this.aCommentCoords = [];
        for (var i = 0; i < _this.aComments.length; i++) {
            var commentCell = _this.aComments[i];
            if (!_this.commentCoordsExist(commentCell.asc_getCol(), commentCell.asc_getRow())) {
                var commentList = _this.asc_getComments(commentCell.asc_getCol(), commentCell.asc_getRow());
                if (bSave && (commentCell.asc_getCol() == 0) && (commentCell.asc_getRow() == 0)) {
                    var documentComments = _this.asc_getDocumentComments();
                    for (var j = 0; j < documentComments.length; j++) {
                        commentList.push(documentComments[j]);
                    }
                }
                if (commentList.length) {
                    _this.aCommentCoords.push(_this.getCommentsCoords(commentList));
                }
            }
        }
    };
    _this.getCommentsCoords = function (comments) {
        var _this = this;
        var coords = new asc_CCommentCoords();
        function calcCommentArea(comment, coords) {
            var originalFont = _this.overlayCtx.getFont();
            var outputFont = originalFont.clone();
            outputFont.Bold = true;
            outputFont.FontSize = 9;
            _this.overlayCtx.setFont(outputFont);
            var txtMetrics = _this.getTextMetrics(comment.sUserName, 1);
            coords.dHeightPX += _this.ptToPx(txtMetrics.height);
            var userWidth = _this.ptToPx(txtMetrics.width);
            if (coords.dWidthPX < userWidth) {
                coords.dWidthPX = userWidth;
            }
            txtMetrics = _this.getTextMetrics(comment.sTime, 1);
            coords.dHeightPX += _this.ptToPx(txtMetrics.height);
            var timeWidth = _this.ptToPx(txtMetrics.width);
            if (coords.dWidthPX < timeWidth) {
                coords.dWidthPX = timeWidth;
            }
            outputFont.Bold = false;
            outputFont.FontSize = 9;
            _this.overlayCtx.setFont(outputFont);
            var commentSpl = comment.sText.split("\n");
            for (var i = 0; i < commentSpl.length; i++) {
                txtMetrics = _this.getTextMetrics(commentSpl[i], 1);
                coords.dHeightPX += _this.ptToPx(txtMetrics.height);
                var lineWidth = _this.ptToPx(txtMetrics.width);
                if (coords.dWidthPX < lineWidth) {
                    coords.dWidthPX = lineWidth;
                }
            }
            for (var i = 0; i < comment.aReplies.length; i++) {
                calcCommentArea(comment.aReplies[i], coords);
            }
            if (coords.dWidthPX < _this.minAreaWidth) {
                coords.dWidthPX = _this.minAreaWidth;
            }
            if (coords.dHeightPX < _this.minAreaHeight) {
                coords.dHeightPX = _this.minAreaHeight;
            }
            coords.dWidthMM = _this.pxToMm(coords.dWidthPX);
            coords.dHeightMM = _this.pxToMm(coords.dHeightPX);
            var headerRowOffPx = _this.worksheet.getCellTop(0, 0);
            var headerColOffPx = _this.worksheet.getCellLeft(0, 0);
            coords.nCol = comment.nCol;
            coords.nRow = comment.nRow;
            var mergedRange = _this.worksheet.model.getMergedByCell(comment.nRow, comment.nCol);
            coords.nLeft = (mergedRange ? mergedRange.c2 : comment.nCol) + 1;
            if (!_this.worksheet.cols[coords.nLeft]) {
                _this.worksheet.expandColsOnScroll(true);
                _this.worksheet._trigger("reinitializeScrollX");
            }
            coords.nTop = mergedRange ? mergedRange.r1 : comment.nRow;
            coords.nLeftOffset = 0;
            coords.nTopOffset = 0;
            var fvr = _this.worksheet.getFirstVisibleRow();
            var fvc = _this.worksheet.getFirstVisibleCol();
            coords.dReverseLeftPX = _this.worksheet.getCellLeft(comment.nCol, 0) - _this.worksheet.getCellLeft(fvc, 0) + headerColOffPx;
            coords.dLeftPX = _this.worksheet.getCellLeft(coords.nLeft, 0) - _this.worksheet.getCellLeft(fvc, 0) + headerColOffPx;
            coords.dTopPX = _this.worksheet.getCellTop(coords.nTop, 0) - _this.worksheet.getCellTop(fvr, 0) + headerRowOffPx;
            var fvrPx = _this.worksheet.getCellTop(0, 0);
            if (coords.dTopPX < fvrPx) {
                coords.dTopPX = fvrPx;
            }
            coords.dLeftMM = _this.worksheet.getCellLeft(coords.nLeft, 3) - _this.worksheet.getCellLeft(fvc, 3);
            coords.dTopMM = _this.worksheet.getCellTop(coords.nTop, 3) - _this.worksheet.getCellTop(fvr, 3);
            var findCol = _this.worksheet._findColUnderCursor(_this.worksheet.getCellLeft(coords.nLeft, 1) + _this.pxToPt(coords.dWidthPX + headerColOffPx) - _this.worksheet.getCellLeft(fvc, 1), true);
            var findRow = _this.worksheet._findRowUnderCursor(_this.worksheet.getCellTop(coords.nTop, 1) + _this.pxToPt(coords.dHeightPX + headerRowOffPx) - _this.worksheet.getCellTop(fvr, 1), true);
            coords.nRight = findCol ? findCol.col : 0;
            coords.nBottom = findRow ? findRow.row : 0;
            coords.nRightOffset = _this.worksheet.getCellLeft(coords.nLeft, 0) + coords.nLeftOffset + coords.dWidthPX + headerColOffPx - _this.worksheet.getCellLeft(coords.nRight, 0);
            coords.nBottomOffset = _this.worksheet.getCellTop(coords.nTop, 0) + coords.nTopOffset + coords.dHeightPX + headerRowOffPx - _this.worksheet.getCellTop(coords.nBottom, 0);
            _this.overlayCtx.setFont(originalFont);
        }
        for (var i = 0; i < comments.length; i++) {
            calcCommentArea(comments[i], coords);
        }
        if (comments.length) {
            coords.dWidthPX += _this.commentPadding * 2;
            coords.dWidthMM = _this.pxToMm(coords.dWidthPX);
            coords.dHeightPX += _this.commentPadding * 2;
            coords.dHeightMM = _this.pxToMm(coords.dHeightPX);
        }
        return coords;
    };
    _this.commentCoordsExist = function (col, row) {
        var result = false;
        for (var i = 0; i < _this.aCommentCoords.length; i++) {
            if ((col == _this.aCommentCoords[i].nCol) && (row == _this.aCommentCoords[i].nRow)) {
                return true;
            }
        }
        return result;
    };
    _this.prepareCommentsToSave = function () {
        _this.calcCommentsCoords(true);
    };
    _this.cleanSelectedComment = function () {
        if (_this.lastSelectedId) {
            var comment = _this.asc_findComment(_this.lastSelectedId);
            if (comment && !comment.asc_getDocumentFlag() && !comment.asc_getSolved()) {
                var metrics = _this.getCellMetrics(comment.asc_getCol(), comment.asc_getRow());
                if (metrics.result) {
                    var x = _this.pxToPt(metrics.left);
                    var y = _this.pxToPt(metrics.top);
                    var w = _this.pxToPt(metrics.width);
                    var h = _this.pxToPt(metrics.height);
                    _this.overlayCtx.clearRect(x, y, w, h);
                }
            }
        }
    };
    _this.pxToPt = function (val) {
        var tmp = Asc.round(val) * _this.ascCvtRatio(0, 1);
        return tmp > 0 ? tmp : 0;
    };
    _this.ptToPx = function (val) {
        var tmp = val * _this.ascCvtRatio(1, 0);
        return tmp;
    };
    _this.mmToPx = function (val) {
        var tmp = val * _this.ascCvtRatio(3, 0);
        return tmp;
    };
    _this.pxToMm = function (val) {
        var tmp = val * _this.ascCvtRatio(0, 3);
        return tmp;
    };
    _this.ascCvtRatio = function (fromUnits, toUnits) {
        return Asc.getCvtRatio(fromUnits, toUnits, _this.overlayCtx.getPPIX());
    };
}
asc_CCellCommentator.prototype = {
    asc_showComments: function () {
        var _this = this;
        _this.bShow = true;
        _this.drawCommentCells();
    },
    asc_hideComments: function () {
        var _this = this;
        _this.bShow = false;
        _this.drawCommentCells();
        _this.worksheet.model.workbook.handlers.trigger("asc_onHideComment");
    },
    asc_showComment: function (id, bNew) {
        var _this = this;
        var comment = _this.asc_findComment(id);
        if (comment) {
            function callbackFunc(result) {
                if (!result) {
                    _this.worksheet.model.workbook.handlers.trigger("asc_onLockComment", comment.asc_getId(), comment.asc_getUserId());
                } else {
                    _this.worksheet.model.workbook.handlers.trigger("asc_onUnLockComment", comment.asc_getId());
                }
                var commentList = _this.asc_getComments(comment.asc_getCol(), comment.asc_getRow());
                var coords = _this.getCommentsCoords(commentList);
                var indexes = [];
                for (var i = 0; i < commentList.length; i++) {
                    indexes.push(commentList[i].asc_getId());
                }
                if (indexes.length) {
                    if (_this.lastSelectedId != id) {
                        _this.worksheet.model.workbook.handlers.trigger("asc_onHideComment");
                    }
                    _this.worksheet.model.workbook.handlers.trigger("asc_onShowComment", indexes, coords.asc_getLeftPX(), coords.asc_getTopPX(), coords.asc_getReverseLeftPX(), bNew);
                    _this.drawCommentCells();
                }
                _this.lastSelectedId = id;
            }
            _this.isLockedComment(comment, false, callbackFunc);
        } else {
            _this.lastSelectedId = null;
        }
    },
    asc_selectComment: function (id, bMove) {
        var _this = this;
        var comment = _this.asc_findComment(id);
        _this.cleanLastSelection();
        _this.lastSelectedId = null;
        if (comment && !comment.asc_getDocumentFlag() && !comment.asc_getSolved()) {
            _this.lastSelectedId = id;
            var col = comment.asc_getCol();
            var row = comment.asc_getRow();
            var vr = _this.worksheet.visibleRange;
            if (bMove) {
                if ((row < vr.r1) || (row > vr.r2)) {
                    var offset = row - vr.r1 - Math.round((vr.r2 - vr.r1) / 2);
                    _this.worksheet.scrollVertical(offset);
                    _this.worksheet._trigger("reinitializeScrollY");
                }
                if ((col < vr.c1) || (col > vr.c2)) {
                    var offset = col - vr.c1 - Math.round((vr.c2 - vr.c1) / 2);
                    _this.worksheet.scrollHorizontal(offset);
                    _this.worksheet._trigger("reinitializeScrollX");
                }
            }
            var metrics = _this.getCellMetrics(col, row);
            if (metrics.result) {
                var rangeOffset = 0;
                var extraOffset = 1;
                var x = _this.pxToPt(metrics.left + rangeOffset);
                var y = _this.pxToPt(metrics.top + rangeOffset);
                var w = _this.pxToPt(metrics.width - extraOffset - rangeOffset);
                var h = _this.pxToPt(metrics.height - extraOffset - rangeOffset);
                _this.overlayCtx.ctx.globalAlpha = 0.2;
                _this.overlayCtx.beginPath();
                _this.overlayCtx.clearRect(x, y, w, h);
                _this.overlayCtx.setFillStyle(_this.commentFillColor);
                _this.overlayCtx.fillRect(x, y, w, h);
                _this.overlayCtx.ctx.globalAlpha = 1;
            }
        }
    },
    asc_findComment: function (id) {
        var _this = this;
        function checkCommentId(id, commentObject) {
            if (commentObject.asc_getId() == id) {
                return commentObject;
            }
            for (var i = 0; i < commentObject.aReplies.length; i++) {
                var comment = checkCommentId(id, commentObject.aReplies[i]);
                if (comment) {
                    return comment;
                }
            }
        }
        for (var i = 0; i < _this.aComments.length; i++) {
            var commentCell = _this.aComments[i];
            var obj = checkCommentId(id, commentCell);
            if (obj) {
                return obj;
            }
        }
        return null;
    },
    asc_addComment: function (comment) {
        var _this = this;
        var oComment = comment;
        var bChange = false;
        oComment.wsId = _this.worksheet.model.getId();
        oComment.setId();
        if (!oComment.bDocument) {
            var selectedCell = _this.worksheet.getSelectedRange();
            var oFirst = selectedCell.getFirst();
            oComment.asc_putCol(oFirst.col - 1);
            oComment.asc_putRow(oFirst.row - 1);
            var existComments = _this.asc_getComments(oComment.nCol, oComment.nRow);
            if (existComments.length) {
                oComment = existComments[0];
                bChange = true;
            } else {
                if ((oComment.nCol != null) && (oComment.nRow != null)) {
                    var cellAddress = new CellAddress(oComment.nRow, oComment.nCol, 0);
                    oComment.sQuoteText = cellAddress.getID() + " : " + _this.worksheet.model.getCell(cellAddress).getValueWithFormat();
                }
            }
        }
        function callbackFunc(result) {
            if (!result) {
                _this.worksheet.model.workbook.handlers.trigger("asc_onLockComment", oComment.asc_getId(), oComment.asc_getUserId());
                return;
            } else {
                _this.worksheet.model.workbook.handlers.trigger("asc_onUnLockComment", oComment.asc_getId());
                if (!bChange) {
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoComment, historyitem_Comment_Add, _this.worksheet.model.getId(), null, new asc_CCommentData(oComment));
                    _this.aComments.push(oComment);
                    _this.drawCommentCells();
                }
                _this.worksheet.model.workbook.handlers.trigger("asc_onAddComment", oComment.asc_getId(), oComment);
            }
        }
        _this.isLockedComment(oComment, true, callbackFunc);
    },
    asc_changeComment: function (id, oComment, bChangeCoords) {
        var _this = this;
        var comment = _this.asc_findComment(id);
        function callbackFunc(result) {
            if (!result) {
                _this.worksheet.model.workbook.handlers.trigger("asc_onLockComment", comment.asc_getId(), comment.asc_getUserId());
                return;
            } else {
                _this.worksheet.model.workbook.handlers.trigger("asc_onUnLockComment", comment.asc_getId());
                var commentBefore = new asc_CCommentData(comment);
                if (comment) {
                    if (bChangeCoords) {
                        comment.asc_putCol(oComment.asc_getCol());
                        comment.asc_putRow(oComment.asc_getRow());
                    }
                    comment.asc_putText(oComment.asc_getText());
                    comment.asc_putQuoteText(oComment.asc_getQuoteText());
                    comment.asc_putUserId(oComment.asc_getUserId());
                    comment.asc_putUserName(oComment.asc_getUserName());
                    comment.asc_putTime(oComment.asc_getTime());
                    comment.asc_putSolved(oComment.asc_getSolved());
                    comment.asc_putHiddenFlag(oComment.asc_getHiddenFlag());
                    comment.aReplies = [];
                    if (!comment.bDocument && (comment.nCol != null) && (comment.nRow != null)) {
                        var cellAddress = new CellAddress(comment.nRow, comment.nCol, 0);
                        comment.sQuoteText = cellAddress.getID() + " : " + _this.worksheet.model.getCell(cellAddress).getValueWithFormat();
                    }
                    var count = oComment.asc_getRepliesCount();
                    for (var i = 0; i < count; i++) {
                        comment.asc_addReply(oComment.asc_getReply(i));
                    }
                    _this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
                }
                if (_this.bSaveHistory) {
                    var commentAfter = new asc_CCommentData(comment);
                    var compositeComment = new CompositeCommentData();
                    compositeComment.commentBefore = commentBefore;
                    compositeComment.commentAfter = commentAfter;
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoComment, historyitem_Comment_Change, _this.worksheet.model.getId(), null, compositeComment);
                }
                _this.drawCommentCells();
            }
        }
        _this.isLockedComment(comment, true, callbackFunc);
    },
    asc_removeComment: function (id) {
        var _this = this;
        var comment = _this.asc_findComment(id);
        function callbackFunc(result) {
            if (!result) {
                _this.worksheet.model.workbook.handlers.trigger("asc_onLockComment", comment.asc_getId(), oComment.asc_getUserId());
                return;
            } else {
                _this.worksheet.model.workbook.handlers.trigger("asc_onUnLockComment", comment.asc_getId());
                if (comment) {
                    if (comment.oParent) {
                        for (var i = 0; i < comment.oParent.aReplies.length; i++) {
                            if (comment.asc_getId() == comment.oParent.aReplies[i].asc_getId()) {
                                if (_this.bSaveHistory) {
                                    History.Create_NewPoint();
                                    History.Add(g_oUndoRedoComment, historyitem_Comment_Remove, _this.worksheet.model.getId(), null, new asc_CCommentData(comment.oParent.aReplies[i]));
                                }
                                comment.oParent.aReplies.splice(i, 1);
                                bResult = true;
                                break;
                            }
                        }
                    } else {
                        for (var i = 0; i < _this.aComments.length; i++) {
                            if (comment.asc_getId() == _this.aComments[i].asc_getId()) {
                                if (_this.bSaveHistory) {
                                    History.Create_NewPoint();
                                    History.Add(g_oUndoRedoComment, historyitem_Comment_Remove, _this.worksheet.model.getId(), null, new asc_CCommentData(_this.aComments[i]));
                                }
                                _this.aComments.splice(i, 1);
                                bResult = true;
                                break;
                            }
                        }
                        _this.worksheet.draw();
                    }
                    _this.drawCommentCells();
                    _this.worksheet.model.workbook.handlers.trigger("asc_onRemoveComment", id);
                }
            }
        }
        _this.isLockedComment(comment, true, callbackFunc);
    },
    asc_getComments: function (col, row) {
        var comments = [];
        var _this = this;
        var _col = col,
        _row = row,
        mergedRange = null;
        var length = _this.aComments.length;
        if (!this.bShow) {
            return comments;
        }
        if (0 < length) {
            if (null == _col || null == _row) {
                var selectedCell = _this.worksheet.getSelectedRange();
                var oFirst = selectedCell.getFirst();
                _col = oFirst.col - 1;
                _row = oFirst.row - 1;
            } else {
                mergedRange = _this.worksheet.model.getMergedByCell(row, col);
            }
            for (var i = 0; i < length; i++) {
                var commentCell = _this.aComments[i];
                if (!commentCell.asc_getDocumentFlag() && !commentCell.asc_getHiddenFlag() && (commentCell.nLevel == 0)) {
                    if (!mergedRange) {
                        if ((_col == commentCell.nCol) && (_row == commentCell.nRow)) {
                            comments.push(commentCell);
                        }
                    } else {
                        if ((commentCell.nCol >= mergedRange.c1) && (commentCell.nRow >= mergedRange.r1) && (commentCell.nCol <= mergedRange.c2) && (commentCell.nRow <= mergedRange.r2)) {
                            comments.push(commentCell);
                        }
                    }
                }
            }
        }
        return comments;
    },
    asc_getDocumentComments: function () {
        var comments = [];
        for (var i = 0; i < this.aComments.length; i++) {
            var commentCell = this.aComments[i];
            if ((commentCell.nLevel == 0) && commentCell.asc_getDocumentFlag()) {
                comments.push(commentCell);
            }
        }
        return comments;
    },
    Undo: function (type, data) {
        var _this = this;
        switch (type) {
        case historyitem_Comment_Add:
            if (data.oParent) {
                var parentComment = _this.asc_findComment(data.oParent.asc_getId());
                for (var i = 0; i < parentComment.aReplies.length; i++) {
                    if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                        parentComment.aReplies.splice(i, 1);
                        break;
                    }
                }
            } else {
                for (var i = 0; i < _this.aComments.length; i++) {
                    if (_this.aComments[i].asc_getId() == data.asc_getId()) {
                        _this.aComments.splice(i, 1);
                        _this.worksheet.model.workbook.handlers.trigger("asc_onRemoveComment", data.asc_getId());
                        break;
                    }
                }
            }
            break;
        case historyitem_Comment_Remove:
            if (data.oParent) {
                var parentComment = _this.asc_findComment(data.oParent.asc_getId());
                parentComment.aReplies.push(data);
            } else {
                _this.aComments.push(data);
                _this.worksheet.model.workbook.handlers.trigger("asc_onAddComment", data.asc_getId(), data);
            }
            break;
        case historyitem_Comment_Change:
            if (data.commentAfter.oParent) {
                var parentComment = _this.asc_findComment(data.commentAfter.oParent.asc_getId());
                for (var i = 0; i < parentComment.aReplies.length; i++) {
                    if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                        parentComment.aReplies.splice(i, 1);
                        parentComment.aReplies.push(data.commentBefore);
                        break;
                    }
                }
            } else {
                for (var i = 0; i < _this.aComments.length; i++) {
                    if (_this.aComments[i].asc_getId() == data.commentAfter.asc_getId()) {
                        _this.aComments.splice(i, 1);
                        _this.aComments.push(data.commentBefore);
                        _this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", data.commentBefore.asc_getId(), data.commentBefore);
                        break;
                    }
                }
            }
            break;
        }
    },
    Redo: function (type, data) {
        var _this = this;
        switch (type) {
        case historyitem_Comment_Add:
            if (data.oParent) {
                var parentComment = _this.asc_findComment(data.oParent.asc_getId());
                parentComment.aReplies.push(data);
            } else {
                _this.aComments.push(data);
                _this.worksheet.model.workbook.handlers.trigger("asc_onAddComment", data.asc_getId(), data);
            }
            break;
        case historyitem_Comment_Remove:
            if (data.oParent) {
                var parentComment = _this.asc_findComment(data.oParent.asc_getId());
                for (var i = 0; i < parentComment.aReplies.length; i++) {
                    if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                        parentComment.aReplies.splice(i, 1);
                        break;
                    }
                }
            } else {
                for (var i = 0; i < _this.aComments.length; i++) {
                    if (_this.aComments[i].asc_getId() == data.asc_getId()) {
                        _this.aComments.splice(i, 1);
                        _this.worksheet.model.workbook.handlers.trigger("asc_onRemoveComment", data.asc_getId());
                        break;
                    }
                }
            }
            break;
        case historyitem_Comment_Change:
            if (data.commentBefore.oParent) {
                var parentComment = _this.asc_findComment(data.commentBefore.oParent.asc_getId());
                for (var i = 0; i < parentComment.aReplies.length; i++) {
                    if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                        parentComment.aReplies.splice(i, 1);
                        parentComment.aReplies.push(data.commentAfter);
                        break;
                    }
                }
            } else {
                for (var i = 0; i < _this.aComments.length; i++) {
                    if (_this.aComments[i].asc_getId() == data.commentBefore.asc_getId()) {
                        _this.aComments.splice(i, 1);
                        _this.aComments.push(data.commentAfter);
                        _this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", data.commentAfter.asc_getId(), data.commentAfter);
                        break;
                    }
                }
            }
            break;
        }
    }
};
window["Asc"]["asc_CCellCommentator"] = window["Asc"].asc_CCellCommentator = asc_CCellCommentator;
prot = asc_CCellCommentator.prototype;
prot["asc_showComments"] = prot.asc_showComments;
prot["asc_hideComments"] = prot.asc_hideComments;
prot["asc_selectComment"] = prot.asc_selectComment;
prot["asc_showComment"] = prot.asc_showComment;
prot["asc_findComment"] = prot.asc_findComment;
prot["asc_addComment"] = prot.asc_addComment;
prot["asc_changeComment"] = prot.asc_changeComment;
prot["asc_removeComment"] = prot.asc_removeComment;
prot["asc_getComments"] = prot.asc_getComments;
prot["asc_getDocumentComments"] = prot.asc_getDocumentComments;