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
    asc.WorksheetView.prototype._isLockedFrozenPane = function (callback) {
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            asc_applyFunction(callback, true);
            return;
        }
        var sheetId = this.model.getId();
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, c_oAscLockNameFrozenPane);
        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            asc_applyFunction(callback, true);
            callback = undefined;
        }
        if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, false)) {
            asc_applyFunction(callback, true);
            return;
        } else {
            if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                asc_applyFunction(callback, false);
                return;
            }
        }
        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock(lockInfo);
        this.collaborativeEditing.onEndCheckLock(callback);
    };
    asc.WorksheetView.prototype._isLockedAll = function (callback) {
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            asc_applyFunction(callback, true);
            return;
        }
        var sheetId = this.model.getId();
        var subType = c_oAscLockTypeElemSubType.ChangeProperties;
        var ar = this.activeRange;
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, subType, sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));
        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            asc_applyFunction(callback, true);
            callback = undefined;
        }
        if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, true)) {
            asc_applyFunction(callback, true);
            return;
        } else {
            if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, true)) {
                asc_applyFunction(callback, false);
                return;
            }
        }
        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock(lockInfo);
        this.collaborativeEditing.onEndCheckLock(callback);
    };
    asc.WorksheetView.prototype._isLockedCells = function (range, subType, callback) {
        if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
            asc_applyFunction(callback, true);
            return true;
        }
        var sheetId = this.model.getId();
        var isIntersection = false;
        var newCallback = callback;
        var t = this;
        this.collaborativeEditing.onStartCheckLock();
        var isArrayRange = Array.isArray(range);
        var nLength = isArrayRange ? range.length : 1;
        var nIndex = 0;
        var ar = null;
        for (; nIndex < nLength; ++nIndex) {
            ar = isArrayRange ? range[nIndex].clone(true) : range.clone(true);
            if (c_oAscLockTypeElemSubType.InsertColumns !== subType && c_oAscLockTypeElemSubType.InsertRows !== subType) {
                isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
            }
            if (false === isIntersection) {
                var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, subType, sheetId, new asc.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));
                if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false)) {
                    asc_applyFunction(callback, false);
                    return false;
                } else {
                    if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
                        newCallback = function (isSuccess) {
                            if (isSuccess) {
                                t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                            }
                            callback(isSuccess);
                        };
                    } else {
                        if (c_oAscLockTypeElemSubType.InsertRows === subType) {
                            newCallback = function (isSuccess) {
                                if (isSuccess) {
                                    t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                                    t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                                }
                                callback(isSuccess);
                            };
                        } else {
                            if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
                                newCallback = function (isSuccess) {
                                    if (isSuccess) {
                                        t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                                        t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                                    }
                                    callback(isSuccess);
                                };
                            } else {
                                if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
                                    newCallback = function (isSuccess) {
                                        if (isSuccess) {
                                            t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                                            t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                                        }
                                        callback(isSuccess);
                                    };
                                }
                            }
                        }
                    }
                    this.collaborativeEditing.addCheckLock(lockInfo);
                }
            } else {
                if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
                    t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                    t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                } else {
                    if (c_oAscLockTypeElemSubType.InsertRows === subType) {
                        t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                        t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                    } else {
                        if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
                            t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                            t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                        } else {
                            if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
                                t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                            }
                        }
                    }
                }
            }
        }
        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            newCallback(true);
            newCallback = undefined;
        }
        this.collaborativeEditing.onEndCheckLock(newCallback);
        return true;
    };
})(jQuery, window);