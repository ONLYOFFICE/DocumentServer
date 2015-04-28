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
(function ($, window, undefined) {
    var asc = window["Asc"];
    var asc_applyFunction = asc.applyFunction;
    var asc_Range = asc.Range;
    function CCollaborativeEditing(handlers, isViewerMode) {
        if (! (this instanceof CCollaborativeEditing)) {
            return new CCollaborativeEditing();
        }
        this.m_nUseType = 1;
        this.handlers = new asc.asc_CHandlersList(handlers);
        this.m_bIsViewerMode = !!isViewerMode;
        this.m_bGlobalLock = false;
        this.m_bGlobalLockEditCell = false;
        this.m_arrCheckLocks = [];
        this.m_arrNeedUnlock = [];
        this.m_arrNeedUnlock2 = [];
        this.m_arrChanges = [];
        this.m_oRecalcIndexColumns = {};
        this.m_oRecalcIndexRows = {};
        this.m_oInsertColumns = {};
        this.m_oInsertRows = {};
        this.init();
        return this;
    }
    CCollaborativeEditing.prototype.init = function () {};
    CCollaborativeEditing.prototype.clearRecalcIndex = function () {
        delete this.m_oRecalcIndexColumns;
        delete this.m_oRecalcIndexRows;
        this.m_oRecalcIndexColumns = {};
        this.m_oRecalcIndexRows = {};
    };
    CCollaborativeEditing.prototype.isCoAuthoringExcellEnable = function () {
        return ASC_SPREADSHEET_API_CO_AUTHORING_ENABLE;
    };
    CCollaborativeEditing.prototype.startCollaborationEditing = function () {
        this.m_nUseType = -1;
    };
    CCollaborativeEditing.prototype.endCollaborationEditing = function () {
        if (this.m_nUseType <= 0) {
            this.m_nUseType = 0;
        }
    };
    CCollaborativeEditing.prototype.setViewerMode = function (isViewerMode) {
        this.m_bIsViewerMode = isViewerMode;
    };
    CCollaborativeEditing.prototype.getCollaborativeEditing = function () {
        if (true !== this.isCoAuthoringExcellEnable() || this.m_bIsViewerMode) {
            return false;
        }
        return 1 !== this.m_nUseType;
    };
    CCollaborativeEditing.prototype.getOwnLocksLength = function () {
        return this.m_arrNeedUnlock2.length;
    };
    CCollaborativeEditing.prototype.getGlobalLock = function () {
        return this.m_bGlobalLock;
    };
    CCollaborativeEditing.prototype.getGlobalLockEditCell = function () {
        return this.m_bGlobalLockEditCell;
    };
    CCollaborativeEditing.prototype.onStartEditCell = function () {
        if (this.getCollaborativeEditing()) {
            this.m_bGlobalLockEditCell = true;
        }
    };
    CCollaborativeEditing.prototype.onStopEditCell = function () {
        this.m_bGlobalLockEditCell = false;
    };
    CCollaborativeEditing.prototype.onStartCheckLock = function () {
        this.m_arrCheckLocks.length = 0;
    };
    CCollaborativeEditing.prototype.addCheckLock = function (oItem) {
        this.m_arrCheckLocks.push(oItem);
    };
    CCollaborativeEditing.prototype.onEndCheckLock = function (callback) {
        var t = this;
        if (this.m_arrCheckLocks.length > 0) {
            this.handlers.trigger("askLock", this.m_arrCheckLocks, function (result) {
                t.onCallbackAskLock(result, callback);
            });
            if (undefined !== callback) {
                this.m_bGlobalLock = true;
            }
        } else {
            asc_applyFunction(callback, true);
            this.m_bGlobalLockEditCell = false;
        }
    };
    CCollaborativeEditing.prototype.onCallbackAskLock = function (result, callback) {
        this.m_bGlobalLock = false;
        this.m_bGlobalLockEditCell = false;
        if (result["lock"]) {
            var count = this.m_arrCheckLocks.length;
            for (var i = 0; i < count; ++i) {
                var oItem = this.m_arrCheckLocks[i];
                if (true !== oItem && false !== oItem) {
                    var oNewLock = new asc.CLock(oItem);
                    oNewLock.setType(c_oAscLockTypes.kLockTypeMine);
                    this.addUnlock2(oNewLock);
                }
            }
            asc_applyFunction(callback, true);
        } else {
            if (result["error"]) {
                asc_applyFunction(callback, false);
            }
        }
    };
    CCollaborativeEditing.prototype.addUnlock = function (LockClass) {
        this.m_arrNeedUnlock.push(LockClass);
    };
    CCollaborativeEditing.prototype.addUnlock2 = function (Lock) {
        this.m_arrNeedUnlock2.push(Lock);
        this.handlers.trigger("updateDocumentCanSave");
    };
    CCollaborativeEditing.prototype.removeUnlock = function (Lock) {
        for (var i = 0; i < this.m_arrNeedUnlock.length; ++i) {
            if (Lock.Element["guid"] === this.m_arrNeedUnlock[i].Element["guid"]) {
                this.m_arrNeedUnlock.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    CCollaborativeEditing.prototype.addChanges = function (oChanges) {
        this.m_arrChanges.push(oChanges);
    };
    CCollaborativeEditing.prototype.applyChanges = function () {
        if (!this.isCoAuthoringExcellEnable()) {
            return true;
        }
        var t = this;
        var length = this.m_arrChanges.length;
        if (0 < length) {
            this.handlers.trigger("applyChanges", this.m_arrChanges, function () {
                t.m_arrChanges.splice(0, length);
                t.handlers.trigger("updateAfterApplyChanges");
            });
            return false;
        }
        return true;
    };
    CCollaborativeEditing.prototype.sendChanges = function () {
        if (!this.isCoAuthoringExcellEnable()) {
            return;
        }
        var bIsCollaborative = this.getCollaborativeEditing();
        var bCheckRedraw = false;
        var bRedrawGraphicObjects = false;
        if (bIsCollaborative && (0 < this.m_arrNeedUnlock.length || 0 < this.m_arrNeedUnlock2.length)) {
            bCheckRedraw = true;
            this.handlers.trigger("cleanSelection");
        }
        var oLock = null;
        while (bIsCollaborative && 0 < this.m_arrNeedUnlock2.length) {
            oLock = this.m_arrNeedUnlock2.shift();
            oLock.setType(c_oAscLockTypes.kLockTypeNone, false);
            var drawing = g_oTableId.Get_ById(oLock.Element["rangeOrObjectId"]);
            if (drawing && drawing.lockType !== c_oAscLockTypes.kLockTypeNone) {
                drawing.lockType = c_oAscLockTypes.kLockTypeNone;
                bRedrawGraphicObjects = true;
            }
            this.handlers.trigger("releaseLocks", oLock.Element["guid"]);
        }
        var nIndex = 0;
        var nCount = this.m_arrNeedUnlock.length;
        for (; bIsCollaborative && nIndex < nCount; ++nIndex) {
            oLock = this.m_arrNeedUnlock[nIndex];
            if (c_oAscLockTypes.kLockTypeOther2 === oLock.getType()) {
                if (!this.handlers.trigger("checkCommentRemoveLock", oLock.Element)) {
                    drawing = g_oTableId.Get_ById(oLock.Element["rangeOrObjectId"]);
                    if (drawing && drawing.lockType !== c_oAscLockTypes.kLockTypeNone) {
                        drawing.lockType = c_oAscLockTypes.kLockTypeNone;
                        bRedrawGraphicObjects = true;
                    }
                }
                this.m_arrNeedUnlock.splice(nIndex, 1);
                --nIndex;
                --nCount;
            }
        }
        this.handlers.trigger("sendChanges", this.getRecalcIndexSave(this.m_oRecalcIndexColumns), this.getRecalcIndexSave(this.m_oRecalcIndexRows));
        if (bIsCollaborative) {
            this._recalcLockArrayOthers();
            delete this.m_oInsertColumns;
            delete this.m_oInsertRows;
            this.m_oInsertColumns = {};
            this.m_oInsertRows = {};
            this.clearRecalcIndex();
            History.Clear();
            if (bCheckRedraw) {
                this.handlers.trigger("drawSelection");
                this.handlers.trigger("drawFrozenPaneLines");
                this.handlers.trigger("updateAllSheetsLock");
                this.handlers.trigger("showComments");
            }
            if (bCheckRedraw || bRedrawGraphicObjects) {
                this.handlers.trigger("showDrawingObjects");
            }
            if (0 === this.m_nUseType) {
                this.m_nUseType = 1;
            }
        } else {
            History.Reset_SavedIndex();
        }
    };
    CCollaborativeEditing.prototype.getRecalcIndexSave = function (oRecalcIndex) {
        var bHasIndex = false;
        var result = {};
        var element = null;
        for (var sheetId in oRecalcIndex) {
            if (!oRecalcIndex.hasOwnProperty(sheetId)) {
                continue;
            }
            result[sheetId] = {
                "_arrElements": []
            };
            for (var i = 0, length = oRecalcIndex[sheetId]._arrElements.length; i < length; ++i) {
                bHasIndex = true;
                element = oRecalcIndex[sheetId]._arrElements[i];
                result[sheetId]["_arrElements"].push({
                    "_recalcType": element._recalcType,
                    "_position": element._position,
                    "_count": element._count,
                    "m_bIsSaveIndex": element.m_bIsSaveIndex
                });
            }
        }
        return bHasIndex ? result : null;
    };
    CCollaborativeEditing.prototype.S4 = function () {
        return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
    };
    CCollaborativeEditing.prototype.createGUID = function () {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    };
    CCollaborativeEditing.prototype.getLockInfo = function (typeElem, subType, sheetId, info) {
        var oLockInfo = new asc.asc_CLockInfo();
        oLockInfo["sheetId"] = sheetId;
        oLockInfo["type"] = typeElem;
        oLockInfo["subType"] = subType;
        oLockInfo["guid"] = this.createGUID();
        oLockInfo["rangeOrObjectId"] = info;
        return oLockInfo;
    };
    CCollaborativeEditing.prototype.getLockByElem = function (element, type) {
        var arrayElements = (c_oAscLockTypes.kLockTypeMine === type) ? this.m_arrNeedUnlock2 : this.m_arrNeedUnlock;
        for (var i = 0; i < arrayElements.length; ++i) {
            if (element["guid"] === arrayElements[i].Element["guid"]) {
                return arrayElements[i];
            }
        }
        return null;
    };
    CCollaborativeEditing.prototype.getLockIntersection = function (element, type, bCheckOnlyLockAll) {
        var arrayElements = (c_oAscLockTypes.kLockTypeMine === type) ? this.m_arrNeedUnlock2 : this.m_arrNeedUnlock;
        var oUnlockElement = null,
        rangeTmp1, rangeTmp2;
        for (var i = 0; i < arrayElements.length; ++i) {
            oUnlockElement = arrayElements[i].Element;
            if (c_oAscLockTypeElem.Sheet === element["type"] && element["type"] === oUnlockElement["type"]) {
                if ((c_oAscLockTypes.kLockTypeMine !== type && false === bCheckOnlyLockAll) || element["sheetId"] === oUnlockElement["sheetId"]) {
                    return arrayElements[i];
                }
            }
            if (element["sheetId"] !== oUnlockElement["sheetId"]) {
                continue;
            }
            if (null !== element["subType"] && null !== oUnlockElement["subType"]) {
                return arrayElements[i];
            }
            if (true === bCheckOnlyLockAll || (c_oAscLockTypeElemSubType.ChangeProperties === oUnlockElement["subType"] && c_oAscLockTypeElem.Sheet !== element["type"])) {
                continue;
            }
            if (element["type"] === oUnlockElement["type"]) {
                if (element["type"] === c_oAscLockTypeElem.Object) {
                    if (element["rangeOrObjectId"] === oUnlockElement["rangeOrObjectId"]) {
                        return arrayElements[i];
                    }
                } else {
                    if (element["type"] === c_oAscLockTypeElem.Range) {
                        if (c_oAscLockTypeElemSubType.InsertRows === oUnlockElement["subType"] || c_oAscLockTypeElemSubType.InsertColumns === oUnlockElement["subType"]) {
                            continue;
                        }
                        rangeTmp1 = oUnlockElement["rangeOrObjectId"];
                        rangeTmp2 = element["rangeOrObjectId"];
                        if (rangeTmp2["c1"] > rangeTmp1["c2"] || rangeTmp2["c2"] < rangeTmp1["c1"] || rangeTmp2["r1"] > rangeTmp1["r2"] || rangeTmp2["r2"] < rangeTmp1["r1"]) {
                            continue;
                        }
                        return arrayElements[i];
                    }
                }
            } else {
                if (oUnlockElement["type"] === c_oAscLockTypeElem.Sheet || (element["type"] === c_oAscLockTypeElem.Sheet && c_oAscLockTypes.kLockTypeMine !== type)) {
                    return arrayElements[i];
                }
            }
        }
        return false;
    };
    CCollaborativeEditing.prototype.getLockElem = function (typeElem, type, sheetId) {
        var arrayElements = (c_oAscLockTypes.kLockTypeMine === type) ? this.m_arrNeedUnlock2 : this.m_arrNeedUnlock;
        var count = arrayElements.length;
        var element = null,
        oRangeOrObjectId = null;
        var result = [];
        var c1, c2, r1, r2;
        if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
            this.m_oRecalcIndexColumns[sheetId] = new CRecalcIndex();
        }
        if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
            this.m_oRecalcIndexRows[sheetId] = new CRecalcIndex();
        }
        for (var i = 0; i < count; ++i) {
            element = arrayElements[i].Element;
            if (element["sheetId"] !== sheetId || element["type"] !== typeElem) {
                continue;
            }
            if (c_oAscLockTypes.kLockTypeMine === type && c_oAscLockTypeElem.Range === typeElem && (c_oAscLockTypeElemSubType.DeleteColumns === element["subType"] || c_oAscLockTypeElemSubType.DeleteRows === element["subType"])) {
                continue;
            }
            if (c_oAscLockTypeElem.Range === typeElem && (c_oAscLockTypeElemSubType.InsertColumns === element["subType"] || c_oAscLockTypeElemSubType.InsertRows === element["subType"])) {
                continue;
            }
            if (c_oAscLockTypeElemSubType.ChangeProperties === element["subType"]) {
                continue;
            }
            oRangeOrObjectId = element["rangeOrObjectId"];
            if (c_oAscLockTypeElem.Range === typeElem) {
                if (c_oAscLockTypes.kLockTypeMine !== type && c_oAscLockTypeElem.Range === typeElem && (c_oAscLockTypeElemSubType.DeleteColumns === element["subType"] || c_oAscLockTypeElemSubType.DeleteRows === element["subType"])) {
                    c1 = oRangeOrObjectId["c1"];
                    c2 = oRangeOrObjectId["c2"];
                    r1 = oRangeOrObjectId["r1"];
                    r2 = oRangeOrObjectId["r2"];
                } else {
                    c1 = this.m_oRecalcIndexColumns[sheetId].getLockOther(oRangeOrObjectId["c1"], type);
                    c2 = this.m_oRecalcIndexColumns[sheetId].getLockOther(oRangeOrObjectId["c2"], type);
                    r1 = this.m_oRecalcIndexRows[sheetId].getLockOther(oRangeOrObjectId["r1"], type);
                    r2 = this.m_oRecalcIndexRows[sheetId].getLockOther(oRangeOrObjectId["r2"], type);
                }
                if (null === c1 || null === c2 || null === r1 || null === r2) {
                    continue;
                }
                oRangeOrObjectId = new asc_Range(c1, r1, c2, r2);
            }
            result.push(oRangeOrObjectId);
        }
        return result;
    };
    CCollaborativeEditing.prototype.getLockCellsMe = function (sheetId) {
        return this.getLockElem(c_oAscLockTypeElem.Range, c_oAscLockTypes.kLockTypeMine, sheetId);
    };
    CCollaborativeEditing.prototype.getLockCellsOther = function (sheetId) {
        return this.getLockElem(c_oAscLockTypeElem.Range, c_oAscLockTypes.kLockTypeOther, sheetId);
    };
    CCollaborativeEditing.prototype.getLockObjectsMe = function (sheetId) {
        return this.getLockElem(c_oAscLockTypeElem.Object, c_oAscLockTypes.kLockTypeMine, sheetId);
    };
    CCollaborativeEditing.prototype.getLockObjectsOther = function (sheetId) {
        return this.getLockElem(c_oAscLockTypeElem.Object, c_oAscLockTypes.kLockTypeOther, sheetId);
    };
    CCollaborativeEditing.prototype.isLockAllOther = function (sheetId) {
        var arrayElements = this.m_arrNeedUnlock;
        var count = arrayElements.length;
        var element = null;
        var oLockedObjectType = c_oAscMouseMoveLockedObjectType.None;
        for (var i = 0; i < count; ++i) {
            element = arrayElements[i].Element;
            if (element["sheetId"] === sheetId) {
                if (element["type"] === c_oAscLockTypeElem.Sheet) {
                    oLockedObjectType = c_oAscMouseMoveLockedObjectType.Sheet;
                    break;
                } else {
                    if (element["type"] === c_oAscLockTypeElem.Range && null !== element["subType"]) {
                        oLockedObjectType = c_oAscMouseMoveLockedObjectType.TableProperties;
                    }
                }
            }
        }
        return oLockedObjectType;
    };
    CCollaborativeEditing.prototype._recalcLockArray = function (typeLock, oRecalcIndexColumns, oRecalcIndexRows) {
        var arrayElements = (c_oAscLockTypes.kLockTypeMine === typeLock) ? this.m_arrNeedUnlock2 : this.m_arrNeedUnlock;
        var count = arrayElements.length;
        var element = null,
        oRangeOrObjectId = null;
        var i;
        var sheetId = -1;
        for (i = 0; i < count; ++i) {
            element = arrayElements[i].Element;
            if (c_oAscLockTypeElem.Range !== element["type"] || c_oAscLockTypeElemSubType.InsertColumns === element["subType"] || c_oAscLockTypeElemSubType.InsertRows === element["subType"] || c_oAscLockTypeElemSubType.DeleteColumns === element["subType"] || c_oAscLockTypeElemSubType.DeleteRows === element["subType"]) {
                continue;
            }
            sheetId = element["sheetId"];
            oRangeOrObjectId = element["rangeOrObjectId"];
            if (oRecalcIndexColumns && oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["c1"] = oRecalcIndexColumns[sheetId].getLockMe(oRangeOrObjectId["c1"]);
                oRangeOrObjectId["c2"] = oRecalcIndexColumns[sheetId].getLockMe(oRangeOrObjectId["c2"]);
            }
            if (oRecalcIndexRows && oRecalcIndexRows.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["r1"] = oRecalcIndexRows[sheetId].getLockMe(oRangeOrObjectId["r1"]);
                oRangeOrObjectId["r2"] = oRecalcIndexRows[sheetId].getLockMe(oRangeOrObjectId["r2"]);
            }
        }
    };
    CCollaborativeEditing.prototype._recalcLockArrayOthers = function () {
        var typeLock = c_oAscLockTypes.kLockTypeOther;
        var arrayElements = (c_oAscLockTypes.kLockTypeMine === typeLock) ? this.m_arrNeedUnlock2 : this.m_arrNeedUnlock;
        var count = arrayElements.length;
        var element = null,
        oRangeOrObjectId = null;
        var i;
        var sheetId = -1;
        for (i = 0; i < count; ++i) {
            element = arrayElements[i].Element;
            if (c_oAscLockTypeElem.Range !== element["type"] || c_oAscLockTypeElemSubType.InsertColumns === element["subType"] || c_oAscLockTypeElemSubType.InsertRows === element["subType"]) {
                continue;
            }
            sheetId = element["sheetId"];
            oRangeOrObjectId = element["rangeOrObjectId"];
            if (this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["c1"] = this.m_oRecalcIndexColumns[sheetId].getLockOther(oRangeOrObjectId["c1"]);
                oRangeOrObjectId["c2"] = this.m_oRecalcIndexColumns[sheetId].getLockOther(oRangeOrObjectId["c2"]);
            }
            if (this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
                oRangeOrObjectId["r1"] = this.m_oRecalcIndexRows[sheetId].getLockOther(oRangeOrObjectId["r1"]);
                oRangeOrObjectId["r2"] = this.m_oRecalcIndexRows[sheetId].getLockOther(oRangeOrObjectId["r2"]);
            }
        }
    };
    CCollaborativeEditing.prototype.addRecalcIndex = function (type, oRecalcIndex) {
        if (null == oRecalcIndex) {
            return null;
        }
        var nIndex = 0;
        var nRecalcType = c_oAscRecalcIndexTypes.RecalcIndexAdd;
        var oRecalcIndexElement = null;
        var oRecalcIndexResult = {};
        var oRecalcIndexTmp = ("0" === type) ? this.m_oRecalcIndexColumns : this.m_oRecalcIndexRows;
        for (var sheetId in oRecalcIndex) {
            if (oRecalcIndex.hasOwnProperty(sheetId)) {
                if (!oRecalcIndexTmp.hasOwnProperty(sheetId)) {
                    oRecalcIndexTmp[sheetId] = new CRecalcIndex();
                }
                if (!oRecalcIndexResult.hasOwnProperty(sheetId)) {
                    oRecalcIndexResult[sheetId] = new CRecalcIndex();
                }
                for (; nIndex < oRecalcIndex[sheetId]["_arrElements"].length; ++nIndex) {
                    oRecalcIndexElement = oRecalcIndex[sheetId]["_arrElements"][nIndex];
                    if (true === oRecalcIndexElement["m_bIsSaveIndex"]) {
                        continue;
                    }
                    nRecalcType = (c_oAscRecalcIndexTypes.RecalcIndexAdd === oRecalcIndexElement["_recalcType"]) ? c_oAscRecalcIndexTypes.RecalcIndexRemove : c_oAscRecalcIndexTypes.RecalcIndexAdd;
                    oRecalcIndexTmp[sheetId].add(nRecalcType, oRecalcIndexElement["_position"], oRecalcIndexElement["_count"], true);
                    oRecalcIndexResult[sheetId].add(nRecalcType, oRecalcIndexElement["_position"], oRecalcIndexElement["_count"], true);
                }
            }
        }
        return oRecalcIndexResult;
    };
    CCollaborativeEditing.prototype.undoCols = function (sheetId, count) {
        if (this.isCoAuthoringExcellEnable()) {
            if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                return;
            }
            this.m_oRecalcIndexColumns[sheetId].remove(count);
        }
    };
    CCollaborativeEditing.prototype.undoRows = function (sheetId, count) {
        if (this.isCoAuthoringExcellEnable()) {
            if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
                return;
            }
            this.m_oRecalcIndexRows[sheetId].remove(count);
        }
    };
    CCollaborativeEditing.prototype.removeCols = function (sheetId, position, count) {
        if (this.isCoAuthoringExcellEnable()) {
            if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                this.m_oRecalcIndexColumns[sheetId] = new CRecalcIndex();
            }
            this.m_oRecalcIndexColumns[sheetId].add(c_oAscRecalcIndexTypes.RecalcIndexRemove, position, count, false);
        }
    };
    CCollaborativeEditing.prototype.addCols = function (sheetId, position, count) {
        if (this.isCoAuthoringExcellEnable()) {
            if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
                this.m_oRecalcIndexColumns[sheetId] = new CRecalcIndex();
            }
            this.m_oRecalcIndexColumns[sheetId].add(c_oAscRecalcIndexTypes.RecalcIndexAdd, position, count, false);
        }
    };
    CCollaborativeEditing.prototype.removeRows = function (sheetId, position, count) {
        if (this.isCoAuthoringExcellEnable()) {
            if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
                this.m_oRecalcIndexRows[sheetId] = new CRecalcIndex();
            }
            this.m_oRecalcIndexRows[sheetId].add(c_oAscRecalcIndexTypes.RecalcIndexRemove, position, count, false);
        }
    };
    CCollaborativeEditing.prototype.addRows = function (sheetId, position, count) {
        if (this.isCoAuthoringExcellEnable()) {
            if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
                this.m_oRecalcIndexRows[sheetId] = new CRecalcIndex();
            }
            this.m_oRecalcIndexRows[sheetId].add(c_oAscRecalcIndexTypes.RecalcIndexAdd, position, count, false);
        }
    };
    CCollaborativeEditing.prototype.addColsRange = function (sheetId, range) {
        if (!this.m_oInsertColumns.hasOwnProperty(sheetId)) {
            this.m_oInsertColumns[sheetId] = [];
        }
        var arrInsertColumns = this.m_oInsertColumns[sheetId];
        var countCols = range.c2 - range.c1 + 1;
        var isAddNewRange = true;
        for (var i = 0; i < arrInsertColumns.length; ++i) {
            if (arrInsertColumns[i].c1 > range.c1) {
                arrInsertColumns[i].c1 += countCols;
                arrInsertColumns[i].c2 += countCols;
            } else {
                if (arrInsertColumns[i].c1 <= range.c1 && arrInsertColumns[i].c2 >= range.c1) {
                    arrInsertColumns[i].c2 += countCols;
                    isAddNewRange = false;
                }
            }
        }
        if (isAddNewRange) {
            arrInsertColumns.push(range);
        }
    };
    CCollaborativeEditing.prototype.addRowsRange = function (sheetId, range) {
        if (!this.m_oInsertRows.hasOwnProperty(sheetId)) {
            this.m_oInsertRows[sheetId] = [];
        }
        var arrInsertRows = this.m_oInsertRows[sheetId];
        var countRows = range.r2 - range.r1 + 1;
        var isAddNewRange = true;
        for (var i = 0; i < arrInsertRows.length; ++i) {
            if (arrInsertRows[i].r1 > range.r1) {
                arrInsertRows[i].r1 += countRows;
                arrInsertRows[i].r2 += countRows;
            } else {
                if (arrInsertRows[i].r1 <= range.r1 && arrInsertRows[i].r2 >= range.r1) {
                    arrInsertRows[i].r2 += countRows;
                    isAddNewRange = false;
                }
            }
        }
        if (isAddNewRange) {
            arrInsertRows.push(range);
        }
    };
    CCollaborativeEditing.prototype.removeColsRange = function (sheetId, range) {
        if (!this.m_oInsertColumns.hasOwnProperty(sheetId)) {
            return;
        }
        var arrInsertColumns = this.m_oInsertColumns[sheetId];
        var countCols = range.c2 - range.c1 + 1;
        for (var i = 0; i < arrInsertColumns.length; ++i) {
            if (arrInsertColumns[i].c1 > range.c2) {
                arrInsertColumns[i].c1 -= countCols;
                arrInsertColumns[i].c2 -= countCols;
            } else {
                if (arrInsertColumns[i].c1 >= range.c1 && arrInsertColumns[i].c2 <= range.c2) {
                    arrInsertColumns.splice(i, 1);
                    i -= 1;
                } else {
                    if (arrInsertColumns[i].c1 >= range.c1 && arrInsertColumns[i].c1 <= range.c2 && arrInsertColumns[i].c2 > range.c2) {
                        arrInsertColumns[i].c1 = range.c2 + 1;
                        arrInsertColumns[i].c1 -= countCols;
                        arrInsertColumns[i].c2 -= countCols;
                    } else {
                        if (arrInsertColumns[i].c1 < range.c1 && arrInsertColumns[i].c2 >= range.c1 && arrInsertColumns[i].c2 <= range.c2) {
                            arrInsertColumns[i].c2 = range.c1 - 1;
                        } else {
                            if (arrInsertColumns[i].c1 < range.c1 && arrInsertColumns[i].c2 > range.c2) {
                                arrInsertColumns[i].c2 -= countCols;
                            }
                        }
                    }
                }
            }
        }
    };
    CCollaborativeEditing.prototype.removeRowsRange = function (sheetId, range) {
        if (!this.m_oInsertRows.hasOwnProperty(sheetId)) {
            return;
        }
        var arrInsertRows = this.m_oInsertRows[sheetId];
        var countRows = range.r2 - range.r1 + 1;
        for (var i = 0; i < arrInsertRows.length; ++i) {
            if (arrInsertRows[i].r1 > range.r2) {
                arrInsertRows[i].r1 -= countRows;
                arrInsertRows[i].r2 -= countRows;
            } else {
                if (arrInsertRows[i].r1 >= range.r1 && arrInsertRows[i].r2 <= range.r2) {
                    arrInsertRows.splice(i, 1);
                    i -= 1;
                } else {
                    if (arrInsertRows[i].r1 >= range.r1 && arrInsertRows[i].r1 <= range.r2 && arrInsertRows[i].r2 > range.r2) {
                        arrInsertRows[i].r1 = range.r2 + 1;
                        arrInsertRows[i].r1 -= countRows;
                        arrInsertRows[i].r2 -= countRows;
                    } else {
                        if (arrInsertRows[i].r1 < range.r1 && arrInsertRows[i].r2 >= range.r1 && arrInsertRows[i].r2 <= range.r2) {
                            arrInsertRows[i].r2 = range.r1 - 1;
                        } else {
                            if (arrInsertRows[i].r1 < range.r1 && arrInsertRows[i].r2 > range.r2) {
                                arrInsertRows[i].r2 -= countRows;
                            }
                        }
                    }
                }
            }
        }
    };
    CCollaborativeEditing.prototype.isIntersectionInCols = function (sheetId, col) {
        if (!this.m_oInsertColumns.hasOwnProperty(sheetId)) {
            return false;
        }
        var arrInsertColumns = this.m_oInsertColumns[sheetId];
        for (var i = 0; i < arrInsertColumns.length; ++i) {
            if (arrInsertColumns[i].c1 <= col && col <= arrInsertColumns[i].c2) {
                return true;
            }
        }
        return false;
    };
    CCollaborativeEditing.prototype.isIntersectionInRows = function (sheetId, row) {
        if (!this.m_oInsertRows.hasOwnProperty(sheetId)) {
            return false;
        }
        var arrInsertRows = this.m_oInsertRows[sheetId];
        for (var i = 0; i < arrInsertRows.length; ++i) {
            if (arrInsertRows[i].r1 <= row && row <= arrInsertRows[i].r2) {
                return true;
            }
        }
        return false;
    };
    CCollaborativeEditing.prototype.getArrayInsertColumnsBySheetId = function (sheetId) {
        if (!this.m_oInsertColumns.hasOwnProperty(sheetId)) {
            return [];
        }
        return this.m_oInsertColumns[sheetId];
    };
    CCollaborativeEditing.prototype.getArrayInsertRowsBySheetId = function (sheetId) {
        if (!this.m_oInsertRows.hasOwnProperty(sheetId)) {
            return [];
        }
        return this.m_oInsertRows[sheetId];
    };
    CCollaborativeEditing.prototype.getLockMeColumn = function (sheetId, col) {
        if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
            return col;
        }
        return this.m_oRecalcIndexColumns[sheetId].getLockMe(col);
    };
    CCollaborativeEditing.prototype.getLockMeRow = function (sheetId, row) {
        if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
            return row;
        }
        return this.m_oRecalcIndexRows[sheetId].getLockMe(row);
    };
    CCollaborativeEditing.prototype.getLockMeColumn2 = function (sheetId, col) {
        if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
            return col;
        }
        return this.m_oRecalcIndexColumns[sheetId].getLockMe2(col);
    };
    CCollaborativeEditing.prototype.getLockMeRow2 = function (sheetId, row) {
        if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
            return row;
        }
        return this.m_oRecalcIndexRows[sheetId].getLockMe2(row);
    };
    CCollaborativeEditing.prototype.getLockOtherColumn2 = function (sheetId, col) {
        if (!this.m_oRecalcIndexColumns.hasOwnProperty(sheetId)) {
            return col;
        }
        return this.m_oRecalcIndexColumns[sheetId].getLockSaveOther(col);
    };
    CCollaborativeEditing.prototype.getLockOtherRow2 = function (sheetId, row) {
        if (!this.m_oRecalcIndexRows.hasOwnProperty(sheetId)) {
            return row;
        }
        return this.m_oRecalcIndexRows[sheetId].getLockSaveOther(row);
    };
    function CLock(element) {
        if (! (this instanceof CLock)) {
            return new CLock(element);
        }
        this.Type = c_oAscLockTypes.kLockTypeNone;
        this.UserId = null;
        this.Element = element;
        this.init();
        return this;
    }
    CLock.prototype.init = function () {};
    CLock.prototype.getType = function () {
        return this.Type;
    };
    CLock.prototype.setType = function (newType) {
        if (newType === c_oAscLockTypes.kLockTypeNone) {
            this.UserId = null;
        }
        this.Type = newType;
    };
    CLock.prototype.Lock = function (bMine) {
        if (c_oAscLockTypes.kLockTypeNone === this.Type) {
            if (true === bMine) {
                this.Type = c_oAscLockTypes.kLockTypeMine;
            } else {
                this.Type = c_oAscLockTypes.kLockTypeOther;
            }
        }
    };
    CLock.prototype.setUserId = function (UserId) {
        this.UserId = UserId;
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
    CRecalcIndexElement.prototype.getLockOther = function (position, type) {
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
    };
    CRecalcIndexElement.prototype.getLockSaveOther = function (position, type) {
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
    };
    CRecalcIndexElement.prototype.getLockMe = function (position) {
        var inc = (c_oAscRecalcIndexTypes.RecalcIndexAdd === this._recalcType) ? -1 : +1;
        if (position < this._position) {
            return position;
        } else {
            return (position + inc);
        }
    };
    CRecalcIndexElement.prototype.getLockMe2 = function (position) {
        var inc = (c_oAscRecalcIndexTypes.RecalcIndexAdd === this._recalcType) ? -1 : +1;
        if (true !== this.m_bIsSaveIndex || position < this._position) {
            return position;
        } else {
            return (position + inc);
        }
    };
    function CRecalcIndex() {
        if (! (this instanceof CRecalcIndex)) {
            return new CRecalcIndex();
        }
        this._arrElements = [];
        return this;
    }
    CRecalcIndex.prototype.add = function (recalcType, position, count, bIsSaveIndex) {
        for (var i = 0; i < count; ++i) {
            this._arrElements.push(new CRecalcIndexElement(recalcType, position, bIsSaveIndex));
        }
    };
    CRecalcIndex.prototype.remove = function (count) {
        for (var i = 0; i < count; ++i) {
            this._arrElements.pop();
        }
    };
    CRecalcIndex.prototype.clear = function () {
        this._arrElements.length = 0;
    };
    CRecalcIndex.prototype.getLockOther = function (position, type) {
        var newPosition = position;
        var count = this._arrElements.length;
        if (0 >= count) {
            return newPosition;
        }
        var bIsDirect = !this._arrElements[0].m_bIsSaveIndex;
        var i;
        if (bIsDirect) {
            for (i = 0; i < count; ++i) {
                newPosition = this._arrElements[i].getLockOther(newPosition, type);
                if (null === newPosition) {
                    break;
                }
            }
        } else {
            for (i = count - 1; i >= 0; --i) {
                newPosition = this._arrElements[i].getLockOther(newPosition, type);
                if (null === newPosition) {
                    break;
                }
            }
        }
        return newPosition;
    };
    CRecalcIndex.prototype.getLockSaveOther = function (position, type) {
        var newPosition = position;
        var count = this._arrElements.length;
        for (var i = 0; i < count; ++i) {
            newPosition = this._arrElements[i].getLockSaveOther(newPosition, type);
            if (null === newPosition) {
                break;
            }
        }
        return newPosition;
    };
    CRecalcIndex.prototype.getLockMe = function (position) {
        var newPosition = position;
        var count = this._arrElements.length;
        if (0 >= count) {
            return newPosition;
        }
        var bIsDirect = this._arrElements[0].m_bIsSaveIndex;
        var i;
        if (bIsDirect) {
            for (i = 0; i < count; ++i) {
                newPosition = this._arrElements[i].getLockMe(newPosition);
                if (null === newPosition) {
                    break;
                }
            }
        } else {
            for (i = count - 1; i >= 0; --i) {
                newPosition = this._arrElements[i].getLockMe(newPosition);
                if (null === newPosition) {
                    break;
                }
            }
        }
        return newPosition;
    };
    CRecalcIndex.prototype.getLockMe2 = function (position) {
        var newPosition = position;
        var count = this._arrElements.length;
        if (0 >= count) {
            return newPosition;
        }
        var bIsDirect = this._arrElements[0].m_bIsSaveIndex;
        var i;
        if (bIsDirect) {
            for (i = 0; i < count; ++i) {
                newPosition = this._arrElements[i].getLockMe2(newPosition);
                if (null === newPosition) {
                    break;
                }
            }
        } else {
            for (i = count - 1; i >= 0; --i) {
                newPosition = this._arrElements[i].getLockMe2(newPosition);
                if (null === newPosition) {
                    break;
                }
            }
        }
        return newPosition;
    };
    asc.CCollaborativeEditing = CCollaborativeEditing;
    asc.CLock = CLock;
    asc.CRecalcIndexElement = CRecalcIndexElement;
    asc.CRecalcIndex = CRecalcIndex;
})(jQuery, window);