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
function asc_CCommentCoords(obj) {
    this.nRow = null;
    this.nCol = null;
    this.nLeft = null;
    this.nLeftOffset = null;
    this.nTop = null;
    this.nTopOffset = null;
    this.nRight = null;
    this.nRightOffset = null;
    this.nBottom = null;
    this.nBottomOffset = null;
    this.dLeftMM = null;
    this.dTopMM = null;
    this.dLeftPX = null;
    this.dReverseLeftPX = null;
    this.dTopPX = null;
    this.dWidthMM = null;
    this.dHeightMM = null;
    this.dWidthPX = null;
    this.dHeightPX = null;
    this.bMoveWithCells = false;
    this.bSizeWithCells = false;
    if (obj) {
        this.nRow = obj.nRow;
        this.nCol = obj.nCol;
        this.nLeft = obj.nLeft;
        this.nLeftOffset = obj.nLeftOffset;
        this.nTop = obj.nTop;
        this.nTopOffset = obj.nTopOffset;
        this.nRight = obj.nRight;
        this.nRightOffset = obj.nRightOffset;
        this.nBottom = obj.nBottom;
        this.nBottomOffset = obj.nBottomOffset;
        this.dLeftMM = obj.dLeftMM;
        this.dTopMM = obj.dTopMM;
        this.dLeftPX = obj.dLeftPX;
        this.dReverseLeftPX = obj.dReverseLeftPX;
        this.dTopPX = obj.dTopPX;
        this.dWidthMM = obj.dWidthMM;
        this.dHeightMM = obj.dHeightMM;
        this.dWidthPX = obj.dWidthPX;
        this.dHeightPX = obj.dHeightPX;
        this.bMoveWithCells = obj.bMoveWithCells;
        this.bSizeWithCells = obj.bSizeWithCells;
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
var g_oCCommentDataProperties = {
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
function asc_CCommentData(obj) {
    this.Properties = g_oCCommentDataProperties;
    this.bHidden = false;
    this.wsId = null;
    this.nCol = 0;
    this.nRow = 0;
    this.nId = null;
    this.oParent = null;
    this.nLevel = 0;
    this.sText = "";
    this.sQuoteText = "";
    this.sTime = "";
    this.sUserId = "";
    this.sUserName = "";
    this.bDocument = true;
    this.bSolved = false;
    this.aReplies = [];
    if (obj) {
        this.bHidden = obj.bHidden;
        this.wsId = obj.wsId;
        this.nCol = obj.nCol;
        this.nRow = obj.nRow;
        this.nId = obj.nId;
        this.oParent = obj.oParent;
        this.nLevel = (null === this.oParent) ? 0 : this.oParent.asc_getLevel() + 1;
        this.sText = obj.sText;
        this.sQuoteText = obj.sQuoteText;
        this.sTime = obj.sTime;
        this.sUserId = obj.sUserId;
        this.sUserName = obj.sUserName;
        this.bDocument = obj.bDocument;
        this.bSolved = obj.bSolved;
        this.aReplies = [];
        for (var i = 0; i < obj.aReplies.length; i++) {
            var item = new asc_CCommentData(obj.aReplies[i]);
            this.aReplies.push(item);
        }
    }
}
asc_CCommentData.prototype = {
    guid: function () {
        function S4() {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    setId: function () {
        if (this.bDocument) {
            this.nId = "doc_" + this.guid();
        } else {
            this.nId = "sheet" + this.wsId + "_" + this.guid();
        }
    },
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
        this.sText = val ? val.slice(0, c_oAscMaxCellOrCommentLength) : val;
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
    asc_getMasterCommentId: function () {
        return this.wsId;
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
        return null;
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
prot["asc_getMasterCommentId"] = prot.asc_getMasterCommentId;
var g_oCompositeCommentDataProperties = {
    commentBefore: 0,
    commentAfter: 1
};
function CompositeCommentData() {
    this.commentBefore = null;
    this.commentAfter = null;
    this.Properties = g_oCompositeCommentDataProperties;
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
        return null;
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
function CCellCommentator(currentSheet) {
    this.worksheet = currentSheet;
    this.overlayCtx = currentSheet.overlayCtx;
    this.drawingCtx = currentSheet.drawingCtx;
    this.bShow = true;
    this.commentIconColor = new CColor(255, 144, 0);
    this.commentFillColor = new CColor(255, 255, 0);
    this.commentPadding = 4;
    this.minAreaWidth = 160;
    this.minAreaHeight = 80;
    this.aComments = [];
    this.aCommentCoords = [];
    this.lastSelectedId = null;
    this.bSaveHistory = true;
}
CCellCommentator.sStartCommentId = "comment_";
CCellCommentator.prototype.isViewerMode = function () {
    return this.worksheet.handlers.trigger("getViewerMode");
};
CCellCommentator.prototype.isLockedComment = function (oComment, callbackFunc) {
    Asc.applyFunction(callbackFunc, true);
};
CCellCommentator.prototype.moveRangeComments = function (rangeFrom, rangeTo) {
    if (rangeFrom && rangeTo) {
        var colOffset = rangeTo.c1 - rangeFrom.c1;
        var rowOffset = rangeTo.r1 - rangeFrom.r1;
        this.worksheet.model.workbook.handlers.trigger("asc_onHideComment");
        for (var i = 0; i < this.aComments.length; i++) {
            var comment = this.aComments[i];
            if ((comment.nCol >= rangeFrom.c1) && (comment.nCol <= rangeFrom.c2) && (comment.nRow >= rangeFrom.r1) && (comment.nRow <= rangeFrom.r2)) {
                var commentBefore = new asc_CCommentData(comment);
                comment.nCol += colOffset;
                comment.nRow += rowOffset;
                var cellAddress = new CellAddress(comment.nRow, comment.nCol, 0);
                comment.sQuoteText = cellAddress.getID() + " : " + this.worksheet.model.getCell(cellAddress).getValueWithFormat();
                this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
                var commentAfter = new asc_CCommentData(comment);
                var compositeComment = new CompositeCommentData();
                compositeComment.commentBefore = commentBefore;
                compositeComment.commentAfter = commentAfter;
                History.Create_NewPoint();
                History.Add(g_oUndoRedoComment, historyitem_Comment_Change, this.worksheet.model.getId(), null, compositeComment);
            }
        }
    }
};
CCellCommentator.prototype.deleteCommentsRange = function (range) {
    if (range) {
        var aCommentId = [],
        i;
        for (i = 0; i < this.aComments.length; ++i) {
            var comment = this.aComments[i];
            if ((comment.nCol >= range.c1) && (comment.nCol <= range.c2) && (comment.nRow >= range.r1) && (comment.nRow <= range.r2)) {
                aCommentId.push(comment.asc_getId());
            }
        }
        History.StartTransaction();
        for (i = 0; i < aCommentId.length; i++) {
            this.asc_removeComment(aCommentId[i]);
        }
        History.EndTransaction();
    }
};
CCellCommentator.prototype.prepareComments = function (arrComments) {
    var commentList = [];
    for (var i = 0; i < arrComments.length; ++i) {
        var comment = {
            "Id": arrComments[i].asc_getId(),
            "Comment": arrComments[i]
        };
        this.addCommentSerialize(comment["Comment"]);
        commentList.push(comment);
    }
    return commentList;
};
CCellCommentator.prototype.addCommentSerialize = function (oComment) {
    if (oComment) {
        if (!oComment.bDocument && (oComment.nCol != null) && (oComment.nRow != null)) {
            var cellAddress = new CellAddress(oComment.nRow, oComment.nCol, 0);
            oComment.sQuoteText = cellAddress.getID() + " : " + this.worksheet.model.getCell(cellAddress).getValueWithFormat();
        }
        this.aComments.push(oComment);
    }
};
CCellCommentator.prototype.getCommentsXY = function (x, y) {
    var findCol = this.worksheet._findColUnderCursor(this.pxToPt(x), true);
    var findRow = this.worksheet._findRowUnderCursor(this.pxToPt(y), true);
    return (findCol && findRow) ? this.asc_getComments(findCol.col, findRow.row) : [];
};
CCellCommentator.prototype.drawCommentCells = function () {
    if (this.isViewerMode() || !this.bShow) {
        return;
    }
    this.drawingCtx.setFillStyle(this.commentIconColor);
    var commentCell, mergedRange, nCol, nRow, x, y, metrics;
    for (var i = 0; i < this.aComments.length; ++i) {
        commentCell = this.aComments[i];
        if (commentCell.asc_getDocumentFlag() || commentCell.asc_getHiddenFlag() || commentCell.asc_getSolved()) {
            continue;
        }
        mergedRange = this.worksheet.model.getMergedByCell(commentCell.nRow, commentCell.nCol);
        nCol = mergedRange ? mergedRange.c2 : commentCell.nCol;
        nRow = mergedRange ? mergedRange.r1 : commentCell.nRow;
        if (metrics = this.worksheet.getCellMetrics(nCol, nRow)) {
            x = metrics.left + metrics.width;
            y = metrics.top;
            this.drawingCtx.beginPath();
            this.drawingCtx.moveTo(x - this.pxToPt(7), y);
            this.drawingCtx.lineTo(x - this.pxToPt(1), y);
            this.drawingCtx.lineTo(x - this.pxToPt(1), y + this.pxToPt(6));
            this.drawingCtx.fill();
        }
    }
};
CCellCommentator.prototype.getTextMetrics = function (text, units) {
    var metrics = {
        width: 0,
        height: 0
    };
    if (text && text.length && ((typeof(text) == "string") || (typeof(text) == "number"))) {
        var textOptions = this.overlayCtx.measureText(text, units);
        metrics.width = textOptions.width;
        metrics.height = textOptions.lineHeight;
    }
    return metrics;
};
CCellCommentator.prototype.updateCommentPosition = function () {
    if (this.lastSelectedId) {
        var comment = this.asc_findComment(this.lastSelectedId);
        if (comment) {
            var commentList = this.asc_getComments(comment.asc_getCol(), comment.asc_getRow());
            if (commentList.length) {
                this.drawCommentCells();
                var coords = this.getCommentsCoords(commentList);
                var indexes = [];
                for (var i = 0; i < commentList.length; i++) {
                    indexes.push(commentList[i].asc_getId());
                }
                var isVisible = (null !== this.worksheet.getCellVisibleRange(comment.asc_getCol(), comment.asc_getRow()));
                this.worksheet.model.workbook.handlers.trigger("asc_onUpdateCommentPosition", indexes, (isVisible ? coords.asc_getLeftPX() : -1), (isVisible ? coords.asc_getTopPX() : -1), (isVisible ? coords.asc_getReverseLeftPX() : -1));
            }
        }
    }
};
CCellCommentator.prototype.updateCommentsDependencies = function (bInsert, operType, updateRange) {
    var t = this;
    var UpdatePair = function (comment, bChange) {
        this.comment = comment;
        this.bChange = bChange;
    };
    var aChangedComments = [];
    function updateCommentsList(aComments) {
        if (aComments.length) {
            t.bSaveHistory = false;
            var changeArray = [];
            var removeArray = [];
            for (var i = 0; i < aComments.length; i++) {
                if (aComments[i].bChange) {
                    t.asc_changeComment(aComments[i].comment.asc_getId(), aComments[i].comment, true, true, true, false);
                    changeArray.push({
                        "Id": aComments[i].comment.asc_getId(),
                        "Comment": aComments[i].comment
                    });
                } else {
                    t.asc_removeComment(aComments[i].comment.asc_getId(), true, true, false);
                    removeArray.push(aComments[i].comment.asc_getId());
                }
            }
            if (changeArray.length) {
                t.worksheet.model.workbook.handlers.trigger("asc_onChangeComments", changeArray);
            }
            if (removeArray.length) {
                t.worksheet.model.workbook.handlers.trigger("asc_onRemoveComments", removeArray);
            }
            t.bSaveHistory = true;
        }
    }
    var i, comment;
    if (bInsert) {
        switch (operType) {
        case c_oAscInsertOptions.InsertCellsAndShiftDown:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if ((comment.nRow >= updateRange.r1) && (comment.nCol >= updateRange.c1) && (comment.nCol <= updateRange.c2)) {
                    comment.nRow += updateRange.r2 - updateRange.r1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                }
            }
            break;
        case c_oAscInsertOptions.InsertCellsAndShiftRight:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if ((comment.nCol >= updateRange.c1) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                    comment.nCol += updateRange.c2 - updateRange.c1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                }
            }
            break;
        case c_oAscInsertOptions.InsertColumns:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if (comment.nCol >= updateRange.c1) {
                    comment.nCol += updateRange.c2 - updateRange.c1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                }
            }
            break;
        case c_oAscInsertOptions.InsertRows:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if (comment.nRow >= updateRange.r1) {
                    comment.nRow += updateRange.r2 - updateRange.r1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                }
            }
            break;
        }
    } else {
        switch (operType) {
        case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if ((comment.nRow > updateRange.r1) && (comment.nCol >= updateRange.c1) && (comment.nCol <= updateRange.c2)) {
                    comment.nRow -= updateRange.r2 - updateRange.r1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                } else {
                    if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                        aChangedComments.push(new UpdatePair(comment, false));
                    }
                }
            }
            break;
        case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if ((comment.nCol > updateRange.c2) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                    comment.nCol -= updateRange.c2 - updateRange.c1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                } else {
                    if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol) && (comment.nRow >= updateRange.r1) && (comment.nRow <= updateRange.r2)) {
                        aChangedComments.push(new UpdatePair(comment, false));
                    }
                }
            }
            break;
        case c_oAscDeleteOptions.DeleteColumns:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if (comment.nCol > updateRange.c2) {
                    comment.nCol -= updateRange.c2 - updateRange.c1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                } else {
                    if ((updateRange.c1 <= comment.nCol) && (updateRange.c2 >= comment.nCol)) {
                        aChangedComments.push(new UpdatePair(comment, false));
                    }
                }
            }
            break;
        case c_oAscDeleteOptions.DeleteRows:
            for (i = 0; i < this.aComments.length; i++) {
                comment = new asc_CCommentData(this.aComments[i]);
                if (comment.nRow > updateRange.r2) {
                    comment.nRow -= updateRange.r2 - updateRange.r1 + 1;
                    aChangedComments.push(new UpdatePair(comment, true));
                } else {
                    if ((updateRange.r1 <= comment.nRow) && (updateRange.r2 >= comment.nRow)) {
                        aChangedComments.push(new UpdatePair(comment, false));
                    }
                }
            }
            break;
        }
    }
    updateCommentsList(aChangedComments);
};
CCellCommentator.prototype.sortComments = function (activeRange, changes) {
    var t = this;
    if (changes && activeRange) {
        var updateCommentsList = function (aComments) {
            if (aComments.length) {
                History.StartTransaction();
                for (var i = 0; i < aComments.length; i++) {
                    t.asc_changeComment(aComments[i].asc_getId(), aComments[i], true);
                }
                History.EndTransaction();
                t.drawCommentCells();
            }
        };
        var aChangedComments = [];
        for (var i = 0; i < changes.places.length; i++) {
            var list = this.asc_getComments(activeRange.c1, changes.places[i].from);
            for (var j = 0; j < list.length; j++) {
                var comment = new asc_CCommentData(list[j]);
                comment.nRow = changes.places[i].to;
                aChangedComments.push(comment);
            }
        }
        updateCommentsList(aChangedComments);
    }
};
CCellCommentator.prototype.resetLastSelectedId = function () {
    this.cleanLastSelection();
    this.lastSelectedId = null;
};
CCellCommentator.prototype.cleanLastSelection = function () {
    var metrics;
    if (this.lastSelectedId) {
        var lastComment = this.asc_findComment(this.lastSelectedId);
        if (lastComment && (metrics = this.worksheet.getCellMetrics(lastComment.nCol, lastComment.nRow))) {
            var extraOffset = this.pxToPt(1);
            this.overlayCtx.clearRect(metrics.left, metrics.top, metrics.width - extraOffset, metrics.height - extraOffset);
        }
    }
};
CCellCommentator.prototype.calcCommentsCoords = function (bSave) {
    this.aCommentCoords = [];
    for (var i = 0; i < this.aComments.length; i++) {
        var commentCell = this.aComments[i];
        if (commentCell.asc_getDocumentFlag() || !this.commentCoordsExist(commentCell.asc_getCol(), commentCell.asc_getRow())) {
            var commentList = this.asc_getComments(commentCell.asc_getCol(), commentCell.asc_getRow());
            if (bSave && (commentCell.asc_getCol() == 0) && (commentCell.asc_getRow() == 0)) {
                var documentComments = this.asc_getDocumentComments();
                for (var j = 0; j < documentComments.length; j++) {
                    commentList.push(documentComments[j]);
                }
            }
            if (commentList.length) {
                this.aCommentCoords.push(this.getCommentsCoords(commentList));
            }
        }
    }
};
CCellCommentator.prototype.calcCommentArea = function (comment, coords) {
    var originalFont = this.overlayCtx.getFont();
    var outputFont = originalFont.clone();
    outputFont.Bold = true;
    outputFont.FontSize = 9;
    this.overlayCtx.setFont(outputFont);
    var txtMetrics = this.getTextMetrics(comment.sUserName, 1);
    coords.dHeightPX += this.ptToPx(txtMetrics.height);
    var userWidth = this.ptToPx(txtMetrics.width);
    if (coords.dWidthPX < userWidth) {
        coords.dWidthPX = userWidth;
    }
    txtMetrics = this.getTextMetrics(comment.sTime, 1);
    coords.dHeightPX += this.ptToPx(txtMetrics.height);
    var timeWidth = this.ptToPx(txtMetrics.width);
    if (coords.dWidthPX < timeWidth) {
        coords.dWidthPX = timeWidth;
    }
    outputFont.Bold = false;
    outputFont.FontSize = 9;
    this.overlayCtx.setFont(outputFont);
    var commentSpl = comment.sText.split("\n"),
    i;
    for (i = 0; i < commentSpl.length; i++) {
        txtMetrics = this.getTextMetrics(commentSpl[i], 1);
        coords.dHeightPX += this.ptToPx(txtMetrics.height);
        var lineWidth = this.ptToPx(txtMetrics.width);
        if (coords.dWidthPX < lineWidth) {
            coords.dWidthPX = lineWidth;
        }
    }
    for (i = 0; i < comment.aReplies.length; i++) {
        this.calcCommentArea(comment.aReplies[i], coords);
    }
    if (coords.dWidthPX < this.minAreaWidth) {
        coords.dWidthPX = this.minAreaWidth;
    }
    if (coords.dHeightPX < this.minAreaHeight) {
        coords.dHeightPX = this.minAreaHeight;
    }
    coords.dWidthMM = this.pxToMm(coords.dWidthPX);
    coords.dHeightMM = this.pxToMm(coords.dHeightPX);
    var headerRowOffPx = this.worksheet.getCellTop(0, 0);
    var headerColOffPx = this.worksheet.getCellLeft(0, 0);
    var headerCellsOffsetPt = this.worksheet.getCellsOffset(1);
    coords.nCol = comment.nCol;
    coords.nRow = comment.nRow;
    var mergedRange = this.worksheet.model.getMergedByCell(comment.nRow, comment.nCol);
    coords.nLeft = (mergedRange ? mergedRange.c2 : comment.nCol) + 1;
    if (!this.worksheet.cols[coords.nLeft]) {
        this.worksheet.expandColsOnScroll(true);
        this.worksheet.handlers.trigger("reinitializeScrollX");
    }
    coords.nTop = mergedRange ? mergedRange.r1 : comment.nRow;
    coords.nLeftOffset = 0;
    coords.nTopOffset = 0;
    var fvr = this.worksheet.getFirstVisibleRow(false);
    var fvc = this.worksheet.getFirstVisibleCol(false);
    var frozenOffset = this.worksheet.getFrozenPaneOffset();
    if (this.worksheet.topLeftFrozenCell) {
        if (comment.nCol < fvc) {
            frozenOffset.offsetX = 0;
            fvc = 0;
        }
        if (comment.nRow < fvr) {
            frozenOffset.offsetY = 0;
            fvr = 0;
        }
    }
    var fvrLeft = this.worksheet.getCellLeft(fvc, 1) - headerCellsOffsetPt.left;
    var fvcTop = this.worksheet.getCellTop(fvr, 1) - headerCellsOffsetPt.top;
    coords.dReverseLeftPX = this.ptToPx(this.worksheet.getCellLeft(comment.nCol, 1) - fvrLeft + frozenOffset.offsetX);
    coords.dLeftPX = this.ptToPx(this.worksheet.getCellLeft(coords.nLeft, 1) - fvrLeft + frozenOffset.offsetX);
    coords.dTopPX = this.ptToPx(this.worksheet.getCellTop(coords.nTop, 1) - fvcTop + frozenOffset.offsetY);
    var fvrPx = this.worksheet.getCellTop(0, 0);
    if (coords.dTopPX < fvrPx) {
        coords.dTopPX = fvrPx;
    }
    coords.dLeftMM = this.worksheet.getCellLeft(coords.nLeft, 3) - this.worksheet.getCellLeft(fvc, 3);
    coords.dTopMM = this.worksheet.getCellTop(coords.nTop, 3) - this.worksheet.getCellTop(fvr, 3);
    var findCol = this.worksheet._findColUnderCursor(this.worksheet.getCellLeft(coords.nLeft, 1) + this.pxToPt(coords.dWidthPX + headerColOffPx) - this.worksheet.getCellLeft(fvc, 1), true);
    var findRow = this.worksheet._findRowUnderCursor(this.worksheet.getCellTop(coords.nTop, 1) + this.pxToPt(coords.dHeightPX + headerRowOffPx) - this.worksheet.getCellTop(fvr, 1), true);
    coords.nRight = findCol ? findCol.col : 0;
    coords.nBottom = findRow ? findRow.row : 0;
    coords.nRightOffset = this.worksheet.getCellLeft(coords.nLeft, 0) + coords.nLeftOffset + coords.dWidthPX + headerColOffPx - this.worksheet.getCellLeft(coords.nRight, 0);
    coords.nBottomOffset = this.worksheet.getCellTop(coords.nTop, 0) + coords.nTopOffset + coords.dHeightPX + headerRowOffPx - this.worksheet.getCellTop(coords.nBottom, 0);
    this.overlayCtx.setFont(originalFont);
};
CCellCommentator.prototype.getCommentsCoords = function (comments) {
    var coords = new asc_CCommentCoords();
    for (var i = 0; i < comments.length; i++) {
        this.calcCommentArea(comments[i], coords);
    }
    if (comments.length) {
        coords.dWidthPX += this.commentPadding * 2;
        coords.dWidthMM = this.pxToMm(coords.dWidthPX);
        coords.dHeightPX += this.commentPadding * 2;
        coords.dHeightMM = this.pxToMm(coords.dHeightPX);
    }
    return coords;
};
CCellCommentator.prototype.commentCoordsExist = function (col, row) {
    var result = false;
    for (var i = 0; i < this.aCommentCoords.length; i++) {
        if ((col == this.aCommentCoords[i].nCol) && (row == this.aCommentCoords[i].nRow)) {
            return true;
        }
    }
    return result;
};
CCellCommentator.prototype.prepareCommentsToSave = function () {
    this.calcCommentsCoords(true);
};
CCellCommentator.prototype.cleanSelectedComment = function () {
    var metrics;
    if (this.lastSelectedId) {
        var comment = this.asc_findComment(this.lastSelectedId);
        if (comment && !comment.asc_getDocumentFlag() && !comment.asc_getSolved() && (metrics = this.worksheet.getCellMetrics(comment.asc_getCol(), comment.asc_getRow()))) {
            this.overlayCtx.clearRect(metrics.left, metrics.top, metrics.width, metrics.height);
        }
    }
};
CCellCommentator.prototype.pxToPt = function (val) {
    return val * this.ascCvtRatio(0, 1);
};
CCellCommentator.prototype.ptToPx = function (val) {
    return val * this.ascCvtRatio(1, 0);
};
CCellCommentator.prototype.mmToPx = function (val) {
    return val * this.ascCvtRatio(3, 0);
};
CCellCommentator.prototype.pxToMm = function (val) {
    return val * this.ascCvtRatio(0, 3);
};
CCellCommentator.prototype.ascCvtRatio = function (fromUnits, toUnits) {
    return Asc.getCvtRatio(fromUnits, toUnits, this.overlayCtx.getPPIX());
};
CCellCommentator.prototype.asc_showComments = function () {
    if (!this.bShow) {
        this.bShow = true;
        this.drawCommentCells();
    }
};
CCellCommentator.prototype.asc_hideComments = function () {
    this.bShow = false;
    this.drawCommentCells();
    this.worksheet.model.workbook.handlers.trigger("asc_onHideComment");
};
CCellCommentator.prototype.asc_showComment = function (id, bNew) {
    var comment = this.asc_findComment(id);
    if (comment) {
        var commentList = this.asc_getComments(comment.asc_getCol(), comment.asc_getRow());
        var coords = this.getCommentsCoords(commentList);
        var indexes = [];
        for (var i = 0; i < commentList.length; i++) {
            indexes.push(commentList[i].asc_getId());
        }
        if (indexes.length) {
            this.worksheet.model.workbook.handlers.trigger("asc_onShowComment", indexes, coords.asc_getLeftPX(), coords.asc_getTopPX(), coords.asc_getReverseLeftPX(), bNew);
            this.drawCommentCells();
        }
        this.lastSelectedId = id;
    } else {
        this.lastSelectedId = null;
    }
};
CCellCommentator.prototype.asc_selectComment = function (id, bMove) {
    var comment = this.asc_findComment(id);
    var metrics;
    this.cleanLastSelection();
    this.lastSelectedId = null;
    if (comment && !comment.asc_getDocumentFlag() && !comment.asc_getSolved()) {
        this.lastSelectedId = id;
        var col = comment.asc_getCol();
        var row = comment.asc_getRow();
        var fvc = this.worksheet.getFirstVisibleCol(true);
        var fvr = this.worksheet.getFirstVisibleRow(true);
        var lvc = this.worksheet.getLastVisibleCol();
        var lvr = this.worksheet.getLastVisibleRow();
        var offset;
        if (bMove) {
            if ((row < fvr) || (row > lvr)) {
                offset = row - fvr - Math.round((lvr - fvr) / 2);
                this.worksheet.scrollVertical(offset);
                this.worksheet.handlers.trigger("reinitializeScrollY");
            }
            if ((col < fvc) || (col > lvc)) {
                offset = col - fvc - Math.round((lvc - fvc) / 2);
                this.worksheet.scrollHorizontal(offset);
                this.worksheet.handlers.trigger("reinitializeScrollX");
            }
        }
        if (metrics = this.worksheet.getCellMetrics(col, row)) {
            var extraOffset = this.pxToPt(1);
            this.overlayCtx.ctx.globalAlpha = 0.2;
            this.overlayCtx.beginPath();
            this.overlayCtx.clearRect(metrics.left, metrics.top, metrics.width - extraOffset, metrics.height - extraOffset);
            this.overlayCtx.setFillStyle(this.commentFillColor);
            this.overlayCtx.fillRect(metrics.left, metrics.top, metrics.width - extraOffset, metrics.height - extraOffset);
            this.overlayCtx.ctx.globalAlpha = 1;
        }
    }
};
CCellCommentator.prototype.asc_findComment = function (id) {
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
        return null;
    }
    for (var i = 0; i < this.aComments.length; i++) {
        var commentCell = this.aComments[i];
        var obj = checkCommentId(id, commentCell);
        if (obj) {
            return obj;
        }
    }
    return null;
};
CCellCommentator.prototype.asc_addComment = function (comment, bIsNotUpdate) {
    var t = this;
    var oComment = comment;
    var bChange = false;
    oComment.wsId = this.worksheet.model.getId();
    oComment.setId();
    if (!oComment.bDocument) {
        if (!bIsNotUpdate) {
            oComment.asc_putCol(this.worksheet.getSelectedColumnIndex());
            oComment.asc_putRow(this.worksheet.getSelectedRowIndex());
        }
        var existComments = this.asc_getComments(oComment.nCol, oComment.nRow);
        if (existComments.length) {
            oComment = existComments[0];
            bChange = true;
        } else {
            if ((oComment.nCol != null) && (oComment.nRow != null)) {
                var cellAddress = new CellAddress(oComment.nRow, oComment.nCol, 0);
                oComment.sQuoteText = cellAddress.getID() + " : " + this.worksheet.model.getCell(cellAddress).getValueWithFormat();
            }
        }
    }
    var onAddCommentCallback = function (isSuccess) {
        if (false === isSuccess) {
            return;
        }
        t._addComment(oComment, bChange, bIsNotUpdate);
    };
    this.isLockedComment(oComment, onAddCommentCallback);
};
CCellCommentator.prototype.asc_changeComment = function (id, oComment, bChangeCoords, bNoEvent, bNoAscLock, bNoDraw) {
    var t = this;
    var comment = this.asc_findComment(id);
    if (null === comment) {
        return;
    }
    var onChangeCommentCallback = function (isSuccess) {
        if (false === isSuccess) {
            return;
        }
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
                comment.sQuoteText = cellAddress.getID() + " : " + t.worksheet.model.getCell(cellAddress).getValueWithFormat();
            }
            var count = oComment.asc_getRepliesCount();
            for (var i = 0; i < count; i++) {
                comment.asc_addReply(oComment.asc_getReply(i));
            }
            if (!bNoEvent) {
                t.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", comment.asc_getId(), comment);
            }
        }
        if (t.bSaveHistory) {
            var commentAfter = new asc_CCommentData(comment);
            var compositeComment = new CompositeCommentData();
            compositeComment.commentBefore = commentBefore;
            compositeComment.commentAfter = commentAfter;
            History.Create_NewPoint();
            History.Add(g_oUndoRedoComment, historyitem_Comment_Change, t.worksheet.model.getId(), null, compositeComment);
        }
        if (!bNoDraw) {
            t.drawCommentCells();
        }
    };
    if (bNoAscLock) {
        onChangeCommentCallback(true);
    } else {
        this.isLockedComment(comment, onChangeCommentCallback);
    }
};
CCellCommentator.prototype.asc_removeComment = function (id, bNoEvent, bNoAscLock, bNoDraw) {
    var t = this;
    var comment = this.asc_findComment(id);
    if (null === comment) {
        return;
    }
    var onRemoveCommentCallback = function (isSuccess) {
        if (false === isSuccess) {
            return;
        }
        t._removeComment(comment, bNoEvent, !bNoDraw);
    };
    if (bNoAscLock) {
        onRemoveCommentCallback(true);
    } else {
        this.isLockedComment(comment, onRemoveCommentCallback);
    }
};
CCellCommentator.prototype.asc_getComments = function (col, row) {
    var comments = [];
    var _col = col,
    _row = row,
    mergedRange = null;
    var length = this.aComments.length;
    if (!this.bShow) {
        return comments;
    }
    if (0 < length) {
        if (null == _col || null == _row) {
            var selectedCell = this.worksheet.getSelectedRange();
            var oFirst = selectedCell.getFirst();
            _col = oFirst.col - 1;
            _row = oFirst.row - 1;
        } else {
            mergedRange = this.worksheet.model.getMergedByCell(row, col);
        }
        for (var i = 0; i < length; i++) {
            var commentCell = this.aComments[i];
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
};
CCellCommentator.prototype.asc_getDocumentComments = function () {
    var comments = [];
    for (var i = 0; i < this.aComments.length; i++) {
        var commentCell = this.aComments[i];
        if ((commentCell.nLevel == 0) && commentCell.asc_getDocumentFlag()) {
            comments.push(commentCell);
        }
    }
    return comments;
};
CCellCommentator.prototype._addComment = function (oComment, bChange, bIsNotUpdate) {
    if (!bChange) {
        History.Create_NewPoint();
        History.Add(g_oUndoRedoComment, historyitem_Comment_Add, this.worksheet.model.getId(), null, new asc_CCommentData(oComment));
        this.aComments.push(oComment);
        if (!bIsNotUpdate) {
            this.drawCommentCells();
        }
    }
    this.worksheet.model.workbook.handlers.trigger("asc_onAddComment", oComment.asc_getId(), oComment);
};
CCellCommentator.prototype._removeComment = function (comment, bNoEvent, isDraw) {
    if (!comment) {
        return;
    }
    var i, id = comment.asc_getId();
    if (comment.oParent) {
        for (i = 0; i < comment.oParent.aReplies.length; ++i) {
            if (comment.asc_getId() == comment.oParent.aReplies[i].asc_getId()) {
                if (this.bSaveHistory) {
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoComment, historyitem_Comment_Remove, this.worksheet.model.getId(), null, new asc_CCommentData(comment.oParent.aReplies[i]));
                }
                comment.oParent.aReplies.splice(i, 1);
                break;
            }
        }
    } else {
        for (i = 0; i < this.aComments.length; i++) {
            if (comment.asc_getId() == this.aComments[i].asc_getId()) {
                if (this.bSaveHistory) {
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoComment, historyitem_Comment_Remove, this.worksheet.model.getId(), null, new asc_CCommentData(this.aComments[i]));
                }
                this.aComments.splice(i, 1);
                break;
            }
        }
        if (isDraw) {
            this.worksheet.draw();
        }
    }
    if (isDraw) {
        this.drawCommentCells();
    }
    if (!bNoEvent) {
        this.worksheet.model.workbook.handlers.trigger("asc_onRemoveComment", id);
    }
};
CCellCommentator.prototype.isMissComments = function (range) {
    var oComment, bMiss = false;
    for (var i = 0, length = this.aComments.length; i < length; ++i) {
        oComment = this.aComments[i];
        if (!oComment.bHidden && range.contains(oComment.nCol, oComment.nRow)) {
            if (bMiss) {
                return true;
            }
            bMiss = true;
        }
    }
    return false;
};
CCellCommentator.prototype.mergeComments = function (range) {
    var i, length, deleteComments = [],
    oComment,
    r1 = range.r1,
    c1 = range.c1,
    mergeComment = null;
    for (i = 0, length = this.aComments.length; i < length; ++i) {
        oComment = this.aComments[i];
        if (range.contains(oComment.nCol, oComment.nRow)) {
            if (null === mergeComment) {
                mergeComment = oComment;
            } else {
                if (oComment.nRow <= mergeComment.nRow && oComment.nCol < mergeComment.nCol) {
                    deleteComments.push(mergeComment);
                    mergeComment = oComment;
                } else {
                    deleteComments.push(oComment);
                }
            }
        }
    }
    if (mergeComment && (mergeComment.nCol !== c1 || mergeComment.nRow !== r1)) {
        this._removeComment(mergeComment, false, false);
        mergeComment.nCol = c1;
        mergeComment.nRow = r1;
        var cellAddress = new CellAddress(mergeComment.nRow, mergeComment.nCol, 0);
        mergeComment.sQuoteText = cellAddress.getID() + " : " + this.worksheet.model.getCell(cellAddress).getValueWithFormat();
        this._addComment(mergeComment, false, true);
    }
    for (i = 0, length = deleteComments.length; i < length; ++i) {
        this._removeComment(deleteComments[i], false, false);
    }
};
CCellCommentator.prototype.Undo = function (type, data) {
    var i, parentComment;
    switch (type) {
    case historyitem_Comment_Add:
        if (data.oParent) {
            parentComment = this.asc_findComment(data.oParent.asc_getId());
            for (i = 0; i < parentComment.aReplies.length; i++) {
                if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                    parentComment.aReplies.splice(i, 1);
                    break;
                }
            }
        } else {
            for (i = 0; i < this.aComments.length; i++) {
                if (this.aComments[i].asc_getId() == data.asc_getId()) {
                    this.aComments.splice(i, 1);
                    this.worksheet.model.workbook.handlers.trigger("asc_onRemoveComment", data.asc_getId());
                    break;
                }
            }
        }
        break;
    case historyitem_Comment_Remove:
        if (data.oParent) {
            parentComment = this.asc_findComment(data.oParent.asc_getId());
            parentComment.aReplies.push(data);
        } else {
            this.aComments.push(data);
            this.worksheet.model.workbook.handlers.trigger("asc_onAddComment", data.asc_getId(), data);
        }
        break;
    case historyitem_Comment_Change:
        if (data.commentAfter.oParent) {
            parentComment = this.asc_findComment(data.commentAfter.oParent.asc_getId());
            for (i = 0; i < parentComment.aReplies.length; i++) {
                if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                    parentComment.aReplies.splice(i, 1);
                    parentComment.aReplies.push(data.commentBefore);
                    break;
                }
            }
        } else {
            for (i = 0; i < this.aComments.length; i++) {
                if (this.aComments[i].asc_getId() == data.commentAfter.asc_getId()) {
                    this.aComments.splice(i, 1);
                    this.aComments.push(data.commentBefore);
                    this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", data.commentBefore.asc_getId(), data.commentBefore);
                    break;
                }
            }
        }
        break;
    }
};
CCellCommentator.prototype.Redo = function (type, data) {
    var parentComment, i;
    switch (type) {
    case historyitem_Comment_Add:
        if (data.oParent) {
            parentComment = this.asc_findComment(data.oParent.asc_getId());
            parentComment.aReplies.push(data);
        } else {
            this.aComments.push(data);
            this.worksheet.model.workbook.handlers.trigger("asc_onAddComment", data.asc_getId(), data);
        }
        break;
    case historyitem_Comment_Remove:
        if (data.oParent) {
            parentComment = this.asc_findComment(data.oParent.asc_getId());
            for (i = 0; i < parentComment.aReplies.length; i++) {
                if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                    parentComment.aReplies.splice(i, 1);
                    break;
                }
            }
        } else {
            for (i = 0; i < this.aComments.length; i++) {
                if (this.aComments[i].asc_getId() == data.asc_getId()) {
                    this.aComments.splice(i, 1);
                    this.worksheet.model.workbook.handlers.trigger("asc_onRemoveComment", data.asc_getId());
                    break;
                }
            }
        }
        break;
    case historyitem_Comment_Change:
        if (data.commentBefore.oParent) {
            parentComment = this.asc_findComment(data.commentBefore.oParent.asc_getId());
            for (i = 0; i < parentComment.aReplies.length; i++) {
                if (parentComment.aReplies[i].asc_getId() == data.asc_getId()) {
                    parentComment.aReplies.splice(i, 1);
                    parentComment.aReplies.push(data.commentAfter);
                    break;
                }
            }
        } else {
            for (i = 0; i < this.aComments.length; i++) {
                if (this.aComments[i].asc_getId() == data.commentBefore.asc_getId()) {
                    this.aComments.splice(i, 1);
                    this.aComments.push(data.commentAfter);
                    this.worksheet.model.workbook.handlers.trigger("asc_onChangeCommentData", data.commentAfter.asc_getId(), data.commentAfter);
                    break;
                }
            }
        }
        break;
    }
};