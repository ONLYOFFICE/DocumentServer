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
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var asc_applyFunction = asc.applyFunction;
    function asc_CEventsController() {
        if (! (this instanceof asc_CEventsController)) {
            return new asc_CEventsController();
        }
        this.defaults = {
            vscrollStep: 10,
            hscrollStep: 10,
            scrollTimeout: 20,
            showArrows: true,
            isViewerMode: false,
            wheelScrollLines: 3,
            isNeedInvertOnActive: false
        };
        this.view = undefined;
        this.widget = undefined;
        this.element = undefined;
        this.handlers = undefined;
        this.settings = $.extend(true, {},
        this.defaults);
        this.vsb = undefined;
        this.vsbHSt = undefined;
        this.vsbApi = undefined;
        this.hsb = undefined;
        this.hsbHSt = undefined;
        this.hsbApi = undefined;
        this.resizeTimerId = undefined;
        this.scrollTimerId = undefined;
        this.moveRangeTimerId = undefined;
        this.moveResizeRangeTimerId = undefined;
        this.fillHandleModeTimerId = undefined;
        this.enableKeyEvents = true;
        this.isSelectMode = false;
        this.hasCursor = false;
        this.hasFocus = false;
        this.isCellEditMode = undefined;
        this.skipKeyPress = undefined;
        this.strictClose = false;
        this.lastKeyCode = undefined;
        this.targetInfo = undefined;
        this.isResizeMode = false;
        this.isResizeModeMove = false;
        this.isFillHandleMode = false;
        this.isMoveRangeMode = false;
        this.isMoveResizeRange = false;
        this.isSelectionDialogMode = false;
        this.isFormulaEditMode = false;
        this.frozenAnchorMode = false;
        this.clickCounter = new ClickCounter();
        this.isMousePressed = false;
        this.isShapeAction = false;
        this.isDblClickInMouseDown = false;
        this.isDoBrowserDblClick = false;
        this.mouseDownLastCord = null;
        this.vsbApiLockMouse = false;
        this.hsbApiLockMouse = false;
        this.__handlers = null;
        return this;
    }
    asc_CEventsController.prototype.init = function (view, widgetElem, canvasElem, handlers) {
        var self = this;
        this.view = view;
        this.widget = widgetElem;
        this.element = canvasElem;
        this.handlers = new asc.asc_CHandlersList(handlers);
        this._createScrollBars();
        if (this.view.Api.isMobileVersion) {
            var __hasTouch = "ontouchstart" in window;
            if (__hasTouch) {
                this.widget.addEventListener("touchstart", function (e) {
                    self._onTouchStart(e);
                    return false;
                },
                false);
                this.widget.addEventListener("touchmove", function (e) {
                    self._onTouchMove(e);
                    return false;
                },
                false);
                this.widget.addEventListener("touchend", function (e) {
                    self._onTouchEnd(e);
                    return false;
                },
                false);
            } else {
                this.widget.addEventListener("touchstart", function (e) {
                    self._onMouseDown(e.touches[0]);
                    return false;
                },
                false);
                this.widget.addEventListener("touchmove", function (e) {
                    self._onMouseMove(e.touches[0]);
                    return false;
                },
                false);
                this.widget.addEventListener("touchend", function (e) {
                    self._onMouseUp(e.changedTouches[0]);
                    return false;
                },
                false);
            }
            window.addEventListener("resize", function () {
                self._onWindowResize.apply(self, arguments);
            },
            false);
            return this;
        }
        if (window.addEventListener) {
            window.addEventListener("resize", function () {
                self._onWindowResize.apply(self, arguments);
            },
            false);
            window.addEventListener("keydown", function () {
                return self._onWindowKeyDown.apply(self, arguments);
            },
            false);
            window.addEventListener("keypress", function () {
                return self._onWindowKeyPress.apply(self, arguments);
            },
            false);
            window.addEventListener("keyup", function () {
                return self._onWindowKeyUp.apply(self, arguments);
            },
            false);
            window.addEventListener("mousemove", function () {
                return self._onWindowMouseMove.apply(self, arguments);
            },
            false);
            window.addEventListener("mouseup", function () {
                return self._onWindowMouseUp.apply(self, arguments);
            },
            false);
            window.addEventListener("mouseleave", function () {
                return self._onWindowMouseLeaveOut.apply(self, arguments);
            },
            false);
            window.addEventListener("mouseout", function () {
                return self._onWindowMouseLeaveOut.apply(self, arguments);
            },
            false);
        }
        if (this.element.onselectstart) {
            this.element.onselectstart = function () {
                return false;
            };
        }
        if (this.element.addEventListener) {
            this.element.addEventListener("mousedown", function () {
                return self._onMouseDown.apply(self, arguments);
            },
            false);
            this.element.addEventListener("mouseup", function () {
                return self._onMouseUp.apply(self, arguments);
            },
            false);
            this.element.addEventListener("mousemove", function () {
                return self._onMouseMove.apply(self, arguments);
            },
            false);
            this.element.addEventListener("mouseleave", function () {
                return self._onMouseLeave.apply(self, arguments);
            },
            false);
            this.element.addEventListener("dblclick", function () {
                return self._onMouseDblClick.apply(self, arguments);
            },
            false);
        }
        if (this.widget.addEventListener) {
            var nameWheelEvent = "onwheel" in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
            this.widget.addEventListener(nameWheelEvent, function () {
                return self._onMouseWheel.apply(self, arguments);
            },
            false);
        }
        var oShapeCursor = document.getElementById("id_target_cursor");
        if (null != oShapeCursor && oShapeCursor.addEventListener) {
            oShapeCursor.addEventListener("mousedown", function () {
                return self._onMouseDown.apply(self, arguments);
            },
            false);
            oShapeCursor.addEventListener("mouseup", function () {
                return self._onMouseUp.apply(self, arguments);
            },
            false);
            oShapeCursor.addEventListener("mousemove", function () {
                return self._onMouseMove.apply(self, arguments);
            },
            false);
            oShapeCursor.addEventListener("mouseleave", function () {
                return self._onMouseLeave.apply(self, arguments);
            },
            false);
        }
        return this;
    };
    asc_CEventsController.prototype.destroy = function () {
        return this;
    };
    asc_CEventsController.prototype.enableKeyEventsHandler = function (flag) {
        this.enableKeyEvents = !!flag;
    };
    asc_CEventsController.prototype.setCellEditMode = function (flag) {
        this.isCellEditMode = !!flag;
    };
    asc_CEventsController.prototype.setViewerMode = function (isViewerMode) {
        this.settings.isViewerMode = !!isViewerMode;
    };
    asc_CEventsController.prototype.getViewerMode = function () {
        return this.settings.isViewerMode;
    };
    asc_CEventsController.prototype.setFocus = function (hasFocus) {
        this.hasFocus = !!hasFocus;
    };
    asc_CEventsController.prototype.setStrictClose = function (enabled) {
        this.strictClose = !!enabled;
    };
    asc_CEventsController.prototype.setFormulaEditMode = function (isFormulaEditMode) {
        this.isFormulaEditMode = !!isFormulaEditMode;
    };
    asc_CEventsController.prototype.setSelectionDialogMode = function (isSelectionDialogMode) {
        this.isSelectionDialogMode = isSelectionDialogMode;
    };
    asc_CEventsController.prototype.reinitializeScroll = function (whichSB) {
        if (window["NATIVE_EDITOR_ENJINE"]) {
            return;
        }
        var self = this,
        opt = this.settings,
        ws = self.view.getWorksheet(),
        isVert = !whichSB || whichSB === 1,
        isHoriz = !whichSB || whichSB === 2;
        if (isVert || isHoriz) {
            this.handlers.trigger("reinitializeScroll", whichSB, function (vSize, hSize) {
                if (isVert) {
                    vSize = self.vsb.offsetHeight + Math.max(vSize * opt.vscrollStep, 1);
                    self.vsbHSt.height = vSize + "px";
                    self.vsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleRow(true));
                }
                if (isHoriz) {
                    hSize = self.hsb.offsetWidth + Math.max(hSize * opt.hscrollStep, 1);
                    self.hsbHSt.width = hSize + "px";
                    self.hsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleCol(true));
                }
            });
        }
        return this;
    };
    asc_CEventsController.prototype.scroll = function (delta) {
        if (delta) {
            if (delta.deltaX) {
                this.scrollHorizontal(delta.deltaX);
            }
            if (delta.deltaY) {
                this.scrollVertical(delta.deltaY);
            }
        }
    };
    asc_CEventsController.prototype.scrollVertical = function (delta, event) {
        if (window["NATIVE_EDITOR_ENJINE"]) {
            return;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        this.vsbApi.scrollByY(this.settings.vscrollStep * delta);
        return true;
    };
    asc_CEventsController.prototype.scrollHorizontal = function (delta, event) {
        if (window["NATIVE_EDITOR_ENJINE"]) {
            return;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        this.hsbApi.scrollByX(this.settings.hscrollStep * delta);
        return true;
    };
    asc_CEventsController.prototype.doMouseDblClick = function (event, isHideCursor) {
        var t = this;
        var ctrlKey = event.metaKey || event.ctrlKey;
        if (t.settings.isViewerMode || t.isFormulaEditMode || t.isSelectionDialogMode) {
            return true;
        }
        if (this.targetInfo && (this.targetInfo.target == c_oTargetType.MoveResizeRange || this.targetInfo.target == c_oTargetType.MoveRange || this.targetInfo.target == c_oTargetType.FillHandle)) {
            return true;
        }
        if (t.isCellEditMode) {
            if (!t.handlers.trigger("stopCellEditing")) {
                return true;
            }
        }
        var coord = t._getCoordinates(event);
        var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
        if (graphicsInfo) {
            return;
        }
        setTimeout(function () {
            var coord = t._getCoordinates(event);
            t.handlers.trigger("mouseDblClick", coord.x, coord.y, isHideCursor, function () {
                t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, ctrlKey, function (info) {
                    t.targetInfo = info;
                });
            });
        },
        100);
        return true;
    };
    asc_CEventsController.prototype.showCellEditorCursor = function () {
        if (this.isCellEditMode) {
            if (this.isDoBrowserDblClick) {
                this.isDoBrowserDblClick = false;
                this.handlers.trigger("showCellEditorCursor");
            }
        }
    };
    asc_CEventsController.prototype._createScrollBars = function () {
        var self = this,
        opt = this.settings;
        this.vsb = document.createElement("div");
        this.vsb.id = "ws-v-scrollbar";
        this.vsb.innerHTML = '<div id="ws-v-scroll-helper"></div>';
        this.widget.appendChild(this.vsb);
        this.vsbHSt = document.getElementById("ws-v-scroll-helper").style;
        if (!this.vsbApi) {
            this.vsbApi = new ScrollObject(this.vsb.id, opt);
            this.vsbApi.bind("scrollvertical", function (evt) {
                self.handlers.trigger("scrollY", evt.scrollPositionY / opt.vscrollStep);
            });
            this.vsbApi.bind("scrollVEnd", function (evt) {
                self.handlers.trigger("addRow", true);
            });
            this.vsbApi.onLockMouse = function (evt) {
                self.vsbApiLockMouse = true;
            };
            this.vsbApi.offLockMouse = function () {
                self.vsbApiLockMouse = false;
            };
        }
        this.hsb = document.createElement("div");
        this.hsb.id = "ws-h-scrollbar";
        this.hsb.innerHTML = '<div id="ws-h-scroll-helper"></div>';
        this.widget.appendChild(this.hsb);
        this.hsbHSt = document.getElementById("ws-h-scroll-helper").style;
        if (!this.hsbApi) {
            this.hsbApi = new ScrollObject(this.hsb.id, $.extend(true, {},
            opt, {
                wheelScrollLines: 1
            }));
            this.hsbApi.bind("scrollhorizontal", function (evt) {
                self.handlers.trigger("scrollX", evt.scrollPositionX / opt.hscrollStep);
            });
            this.hsbApi.bind("scrollHEnd", function (evt) {
                self.handlers.trigger("addColumn", true);
            });
            this.hsbApi.onLockMouse = function () {
                self.hsbApiLockMouse = true;
            };
            this.hsbApi.offLockMouse = function () {
                self.hsbApiLockMouse = false;
            };
        }
        if (!this.view.Api.isMobileVersion) {
            var corner = document.createElement("div");
            corner.id = "ws-scrollbar-corner";
            this.widget.appendChild(corner);
        } else {
            this.hsb.style.zIndex = -10;
            this.hsb.style.right = 0;
            this.hsb.style.display = "none";
            this.vsb.style.zIndex = -10;
            this.vsb.style.bottom = 0;
            this.vsb.style.display = "none";
        }
    };
    asc_CEventsController.prototype._changeSelection = function (event, isSelectMode, callback) {
        var t = this;
        var coord = this._getCoordinates(event);
        if (t.isFormulaEditMode) {
            if (false === t.handlers.trigger("canEnterCellRange")) {
                if (!t.handlers.trigger("stopCellEditing")) {
                    return;
                }
            }
        }
        this.handlers.trigger("changeSelection", false, coord.x, coord.y, true, isSelectMode, function (d) {
            t.scroll(d);
            if (t.isFormulaEditMode) {
                t.handlers.trigger("enterCellRange");
            } else {
                if (t.isCellEditMode) {
                    if (!t.handlers.trigger("stopCellEditing")) {
                        return;
                    }
                }
            }
            asc_applyFunction(callback);
        });
    };
    asc_CEventsController.prototype._changeSelection2 = function (event) {
        var t = this;
        var fn = function () {
            t._changeSelection2(event);
        };
        var callback = function () {
            if (t.isSelectMode && !t.hasCursor) {
                t.scrollTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
            }
        };
        window.clearTimeout(t.scrollTimerId);
        t.scrollTimerId = window.setTimeout(function () {
            if (t.isSelectMode && !t.hasCursor) {
                t._changeSelection(event, true, callback);
            }
        },
        0);
    };
    asc_CEventsController.prototype._moveRangeHandle2 = function (event) {
        var t = this;
        var fn = function () {
            t._moveRangeHandle2(event);
        };
        var callback = function () {
            if (t.isMoveRangeMode && !t.hasCursor) {
                t.moveRangeTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
            }
        };
        window.clearTimeout(t.moveRangeTimerId);
        t.moveRangeTimerId = window.setTimeout(function () {
            if (t.isMoveRangeMode && !t.hasCursor) {
                t._moveRangeHandle(event, callback);
            }
        },
        0);
    };
    asc_CEventsController.prototype._moveResizeRangeHandle2 = function (event) {
        var t = this;
        var fn = function () {
            t._moveResizeRangeHandle2(event);
        };
        var callback = function () {
            if (t.isMoveResizeRange && !t.hasCursor) {
                t.moveResizeRangeTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
            }
        };
        window.clearTimeout(t.moveResizeRangeTimerId);
        t.moveResizeRangeTimerId = window.setTimeout(function () {
            if (t.isMoveResizeRange && !t.hasCursor) {
                t._moveResizeRangeHandle(event, t.targetInfo, callback);
            }
        },
        0);
    };
    asc_CEventsController.prototype._changeSelectionDone = function (event) {
        var coord = this._getCoordinates(event);
        var ctrlKey = event.metaKey || event.ctrlKey;
        if (false === ctrlKey) {
            coord.x = -1;
            coord.y = -1;
        }
        this.handlers.trigger("changeSelectionDone", coord.x, coord.y);
    };
    asc_CEventsController.prototype._resizeElement = function (event) {
        var coord = this._getCoordinates(event);
        this.handlers.trigger("resizeElement", this.targetInfo, coord.x, coord.y);
    };
    asc_CEventsController.prototype._resizeElementDone = function (event) {
        var coord = this._getCoordinates(event);
        this.handlers.trigger("resizeElementDone", this.targetInfo, coord.x, coord.y, this.isResizeModeMove);
        this.isResizeModeMove = false;
    };
    asc_CEventsController.prototype._changeFillHandle = function (event, callback) {
        var t = this;
        var coord = this._getCoordinates(event);
        this.handlers.trigger("changeFillHandle", coord.x, coord.y, function (d) {
            if (!d) {
                return;
            }
            t.scroll(d);
            asc_applyFunction(callback);
        });
    };
    asc_CEventsController.prototype._changeFillHandle2 = function (event) {
        var t = this;
        var fn = function () {
            t._changeFillHandle2(event);
        };
        var callback = function () {
            if (t.isFillHandleMode && !t.hasCursor) {
                t.fillHandleModeTimerId = window.setTimeout(fn, t.settings.scrollTimeout);
            }
        };
        window.clearTimeout(t.fillHandleModeTimerId);
        t.fillHandleModeTimerId = window.setTimeout(function () {
            if (t.isFillHandleMode && !t.hasCursor) {
                t._changeFillHandle(event, callback);
            }
        },
        0);
    };
    asc_CEventsController.prototype._changeFillHandleDone = function (event) {
        var coord = this._getCoordinates(event);
        this.handlers.trigger("changeFillHandleDone", coord.x, coord.y, event.metaKey || event.ctrlKey);
    };
    asc_CEventsController.prototype._moveRangeHandle = function (event, callback) {
        var t = this;
        var coord = this._getCoordinates(event);
        this.handlers.trigger("moveRangeHandle", coord.x, coord.y, function (d) {
            if (!d) {
                return;
            }
            t.scroll(d);
            asc_applyFunction(callback);
        },
        event.metaKey || event.ctrlKey);
    };
    asc_CEventsController.prototype._moveFrozenAnchorHandle = function (event, target) {
        var t = this;
        var coord = t._getCoordinates(event);
        t.handlers.trigger("moveFrozenAnchorHandle", coord.x, coord.y, target);
    };
    asc_CEventsController.prototype._moveFrozenAnchorHandleDone = function (event, target) {
        var t = this;
        var coord = t._getCoordinates(event);
        t.handlers.trigger("moveFrozenAnchorHandleDone", coord.x, coord.y, target);
    };
    asc_CEventsController.prototype._moveResizeRangeHandle = function (event, target, callback) {
        var t = this;
        var coord = this._getCoordinates(event);
        this.handlers.trigger("moveResizeRangeHandle", coord.x, coord.y, target, function (d) {
            if (!d) {
                return;
            }
            t.scroll(d);
            asc_applyFunction(callback);
        });
    };
    asc_CEventsController.prototype._autoFiltersClick = function (idFilter) {
        this.handlers.trigger("autoFiltersClick", idFilter);
    };
    asc_CEventsController.prototype._commentCellClick = function (event) {
        var t = this;
        var coord = t._getCoordinates(event);
        this.handlers.trigger("commentCellClick", coord.x, coord.y);
    };
    asc_CEventsController.prototype._moveRangeHandleDone = function (event) {
        this.handlers.trigger("moveRangeHandleDone", event.metaKey || event.ctrlKey);
    };
    asc_CEventsController.prototype._moveResizeRangeHandleDone = function (event, target) {
        this.handlers.trigger("moveResizeRangeHandleDone", target);
    };
    asc_CEventsController.prototype._onWindowResize = function (event) {
        var self = this;
        window.clearTimeout(this.resizeTimerId);
        this.resizeTimerId = window.setTimeout(function () {
            self.handlers.trigger("resize", event);
        },
        150);
    };
    asc_CEventsController.prototype._onWindowKeyDown = function (event) {
        var t = this,
        dc = 0,
        dr = 0,
        isViewerMode = t.settings.isViewerMode;
        var ctrlKey = event.metaKey || event.ctrlKey;
        var shiftKey = event.shiftKey;
        var result = true;
        function stop(immediate) {
            event.stopPropagation();
            immediate ? event.stopImmediatePropagation() : true;
            event.preventDefault();
            result = false;
        }
        if (event.which === 18) {
            t.lastKeyCode = event.which;
        }
        var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
        if (!t.isMousePressed && graphicObjects.length && t.enableKeyEvents) {
            if (t.handlers.trigger("graphicObjectWindowKeyDown", event)) {
                return result;
            }
        }
        var selectionActivePointChanged = false;
        this.showCellEditorCursor();
        while (t.isCellEditMode && !t.hasFocus || !t.enableKeyEvents || t.isSelectMode || t.isFillHandleMode || t.isMoveRangeMode || t.isMoveResizeRange) {
            if (t.isCellEditMode && !t.strictClose && t.enableKeyEvents && event.which >= 37 && event.which <= 40) {
                break;
            }
            if (!t.enableKeyEvents && ctrlKey && (80 === event.which)) {
                break;
            }
            return result;
        }
        t.skipKeyPress = true;
        if (!t.isCellEditMode) {
            if (!t.handlers.trigger("popUpSelectorKeyDown", event)) {
                stop();
                return result;
            }
        }
        switch (event.which) {
        case 113:
            if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode || graphicObjects.length) {
                return true;
            }
            if (AscBrowser.isOpera) {
                stop();
            }
            t.strictClose = true;
            t.handlers.trigger("editCell", 0, 0, false, true, false, undefined, false);
            return result;
        case 8:
            if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {
                return true;
            }
            stop();
            t.handlers.trigger("editCell", 0, 0, false, false, true, undefined, false, undefined, event);
            return true;
        case 46:
            if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {
                return true;
            }
            t.handlers.trigger("empty");
            return result;
        case 9:
            if (t.isCellEditMode) {
                return true;
            }
            stop();
            selectionActivePointChanged = true;
            if (shiftKey) {
                dc = -1;
                shiftKey = false;
            } else {
                dc = +1;
            }
            break;
        case 13:
            if (t.isCellEditMode) {
                return true;
            }
            selectionActivePointChanged = true;
            if (shiftKey) {
                dr = -1;
                shiftKey = false;
            } else {
                dr = +1;
            }
            break;
        case 27:
            stop();
            t.handlers.trigger("stopFormatPainter");
            return result;
        case 144:
            case 145:
            if (AscBrowser.isOpera) {
                stop();
            }
            return result;
        case 32:
            if (t.isCellEditMode) {
                return true;
            }
            if (!ctrlKey && !shiftKey) {
                t.skipKeyPress = false;
                return true;
            }
            stop();
            if (ctrlKey && shiftKey) {
                t.handlers.trigger("changeSelection", true, 0, 0, true, false);
            } else {
                if (ctrlKey) {
                    t.handlers.trigger("selectColumnsByRange");
                } else {
                    t.handlers.trigger("selectRowsByRange");
                }
            }
            return result;
        case 33:
            stop();
            if (ctrlKey) {
                t.handlers.trigger("showNextPrevWorksheet", -1);
                return true;
            } else {
                event.altKey ? dc = -0.5 : dr = -0.5;
            }
            break;
        case 34:
            stop();
            if (ctrlKey) {
                t.handlers.trigger("showNextPrevWorksheet", +1);
                return true;
            } else {
                event.altKey ? dc = +0.5 : dr = +0.5;
            }
            break;
        case 37:
            stop();
            dc = ctrlKey ? -1.5 : -1;
            break;
        case 38:
            stop();
            if (t.isCellEditMode && t.handlers.trigger("isPopUpSelectorOpen")) {
                return result;
            }
            dr = ctrlKey ? -1.5 : -1;
            break;
        case 39:
            stop();
            dc = ctrlKey ? +1.5 : +1;
            break;
        case 40:
            stop();
            if (t.isCellEditMode && t.handlers.trigger("isPopUpSelectorOpen")) {
                return result;
            }
            if (!isViewerMode && !t.isCellEditMode && !t.isSelectionDialogMode && event.altKey) {
                t.handlers.trigger("showAutoComplete");
                return result;
            }
            dr = ctrlKey ? +1.5 : +1;
            break;
        case 36:
            stop();
            dc = -2.5;
            if (ctrlKey) {
                dr = -2.5;
            }
            break;
        case 35:
            stop();
            dc = 2.5;
            if (ctrlKey) {
                dr = 2.5;
            }
            break;
        case 53:
            case 66:
            case 73:
            case 85:
            case 86:
            case 88:
            case 89:
            case 90:
            if (isViewerMode || t.isSelectionDialogMode) {
                stop();
                return result;
            }
        case 65:
            case 67:
            if (t.isCellEditMode) {
                return true;
            }
        case 80:
            if (t.isCellEditMode) {
                stop();
                return result;
            }
            if (!ctrlKey) {
                t.skipKeyPress = false;
                return true;
            }
            if (67 !== event.which && 86 !== event.which && 88 !== event.which) {
                stop();
            }
            if (!t.__handlers) {
                t.__handlers = {
                    53: function () {
                        t.handlers.trigger("setFontAttributes", "s");
                    },
                    65: function () {
                        t.handlers.trigger("changeSelection", true, -1, -1, true, false);
                    },
                    66: function () {
                        t.handlers.trigger("setFontAttributes", "b");
                    },
                    73: function () {
                        t.handlers.trigger("setFontAttributes", "i");
                    },
                    85: function () {
                        t.handlers.trigger("setFontAttributes", "u");
                    },
                    80: function () {
                        t.handlers.trigger("print");
                    },
                    67: function () {
                        t.handlers.trigger("copy");
                    },
                    86: function () {
                        if (!window.GlobalPasteFlag) {
                            if (!window.USER_AGENT_SAFARI_MACOS) {
                                window.GlobalPasteFlag = true;
                                t.handlers.trigger("paste");
                            } else {
                                if (0 === window.GlobalPasteFlagCounter) {
                                    SafariIntervalFocus2();
                                    window.GlobalPasteFlag = true;
                                    t.handlers.trigger("paste");
                                }
                            }
                        } else {
                            if (!window.USER_AGENT_SAFARI_MACOS) {
                                stop();
                            }
                        }
                    },
                    88: function () {
                        t.handlers.trigger("cut");
                    },
                    89: function () {
                        t.handlers.trigger("redo");
                    },
                    90: function () {
                        t.handlers.trigger("undo");
                    }
                };
            }
            t.__handlers[event.which]();
            return result;
        case 61:
            case 187:
            if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {
                return true;
            }
            if (event.altKey) {
                t.handlers.trigger("addFunction", "SUM", true);
            } else {
                t.skipKeyPress = false;
            }
            return true;
        case 93:
            stop();
            this.handlers.trigger("onContextMenu", event);
            return result;
        default:
            if (!ctrlKey && !event.altKey) {
                t.skipKeyPress = false;
            }
            return true;
        }
        if ((dc !== 0 || dr !== 0) && false === t.handlers.trigger("isGlobalLockEditCell")) {
            if (selectionActivePointChanged) {
                t.handlers.trigger("selectionActivePointChanged", dc, dr, function (d) {
                    t.scroll(d);
                });
            } else {
                if (this.isCellEditMode && !this.isFormulaEditMode) {
                    if (!t.handlers.trigger("stopCellEditing")) {
                        return true;
                    }
                }
                if (t.isFormulaEditMode) {
                    if (false === t.handlers.trigger("canEnterCellRange")) {
                        if (!t.handlers.trigger("stopCellEditing")) {
                            return true;
                        }
                    }
                }
                t.handlers.trigger("changeSelection", !shiftKey, dc, dr, false, false, function (d) {
                    t.scroll(d);
                    if (t.isFormulaEditMode) {
                        t.handlers.trigger("enterCellRange");
                    } else {
                        if (t.isCellEditMode) {
                            t.handlers.trigger("stopCellEditing");
                        }
                    }
                });
            }
        }
        return result;
    };
    asc_CEventsController.prototype._onWindowKeyPress = function (event) {
        if (!this.enableKeyEvents) {
            return true;
        }
        if (this.settings.isViewerMode || this.isSelectionDialogMode) {
            return true;
        }
        this.showCellEditorCursor();
        if (this.isCellEditMode && !this.hasFocus || this.isSelectMode || !this.handlers.trigger("canReceiveKeyPress")) {
            return true;
        }
        if (this.skipKeyPress || event.which < 32) {
            this.skipKeyPress = true;
            return true;
        }
        var graphicObjects = this.handlers.trigger("getSelectedGraphicObjects");
        if (graphicObjects.length && this.handlers.trigger("graphicObjectWindowKeyPress", event)) {
            return true;
        }
        if (!this.isCellEditMode) {
            this.handlers.trigger("editCell", 0, 0, false, false, true, undefined, true, undefined, event);
        }
        return true;
    };
    asc_CEventsController.prototype._onWindowKeyUp = function (event) {
        var t = this;
        if (t.lastKeyCode === 18 && event.which === 18) {
            return false;
        }
        if (16 === event.which) {
            this.handlers.trigger("updateSelectionName");
        }
        return true;
    };
    asc_CEventsController.prototype._onWindowMouseMove = function (event) {
        var coord = this._getCoordinates(event);
        if (this.isSelectMode && !this.hasCursor) {
            this._changeSelection2(event);
        }
        if (this.isResizeMode && !this.hasCursor) {
            this.isResizeModeMove = true;
            this._resizeElement(event);
        }
        if (this.hsbApiLockMouse) {
            this.hsbApi.mouseDown ? this.hsbApi.evt_mousemove.call(this.hsbApi, event) : false;
        } else {
            if (this.vsbApiLockMouse) {
                this.vsbApi.mouseDown ? this.vsbApi.evt_mousemove.call(this.vsbApi, event) : false;
            }
        }
        if (this.frozenAnchorMode) {
            this._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
            return true;
        }
        if (this.isShapeAction) {
            event.isLocked = this.isMousePressed;
            this.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
        }
        return true;
    };
    asc_CEventsController.prototype._onWindowMouseUp = function (event) {
        var coord = this._getCoordinates(event);
        if (this.hsbApiLockMouse) {
            this.hsbApi.mouseDown ? this.hsbApi.evt_mouseup.call(this.hsbApi, event) : false;
        } else {
            if (this.vsbApiLockMouse) {
                this.vsbApi.mouseDown ? this.vsbApi.evt_mouseup.call(this.vsbApi, event) : false;
            }
        }
        this.isMousePressed = false;
        if (this.isShapeAction) {
            event.isLocked = this.isMousePressed;
            event.ClickCount = this.clickCounter.clickCount;
            this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
            this._changeSelectionDone(event);
            return true;
        }
        if (this.isSelectMode) {
            this.isSelectMode = false;
            this._changeSelectionDone(event);
        }
        if (this.isResizeMode) {
            this.isResizeMode = false;
            this._resizeElementDone(event);
        }
        if (this.isFillHandleMode) {
            this.isFillHandleMode = false;
            this._changeFillHandleDone(event);
        }
        if (this.isMoveRangeMode) {
            this.isMoveRangeMode = false;
            this._moveRangeHandleDone(event);
        }
        if (this.isMoveResizeRange) {
            this.isMoveResizeRange = false;
            this.handlers.trigger("moveResizeRangeHandleDone", this.targetInfo);
        }
        if (this.frozenAnchorMode) {
            this._moveFrozenAnchorHandleDone(event, this.frozenAnchorMode);
            this.frozenAnchorMode = false;
        }
        this.showCellEditorCursor();
        return true;
    };
    asc_CEventsController.prototype._onWindowMouseUpExternal = function (event, x, y) {
        if (null != x && null != y) {
            event.coord = {
                x: x,
                y: y
            };
        }
        this._onWindowMouseUp(event);
    };
    asc_CEventsController.prototype._onWindowMouseLeaveOut = function (event) {
        if (!this.isDoBrowserDblClick) {
            return true;
        }
        var relatedTarget = event.relatedTarget || event.fromElement;
        if (relatedTarget && ("ce-canvas-outer" === relatedTarget.id || "ce-canvas" === relatedTarget.id || "ce-canvas-overlay" === relatedTarget.id || "ce-cursor" === relatedTarget.id || "ws-canvas-overlay" === relatedTarget.id)) {
            return true;
        }
        this.showCellEditorCursor();
        return true;
    };
    asc_CEventsController.prototype._onMouseDown = function (event) {
        var t = this;
        var coord = t._getCoordinates(event);
        event.isLocked = t.isMousePressed = true;
        if (t.handlers.trigger("isGlobalLockEditCell")) {
            return;
        }
        if (!this.enableKeyEvents) {
            t.handlers.trigger("canvasClick");
        }
        var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
        if (asc["editor"].isStartAddShape || graphicsInfo) {
            if (t.isSelectionDialogMode) {
                return;
            }
            if (this.isCellEditMode && !this.handlers.trigger("stopCellEditing")) {
                return;
            }
            t.isShapeAction = true;
            t.clickCounter.mouseDownEvent(coord.x, coord.y, event.button);
            event.ClickCount = t.clickCounter.clickCount;
            if (event.ClickCount == 2) {
                t.isDblClickInMouseDown = true;
            }
            t.handlers.trigger("graphicObjectMouseDown", event, coord.x, coord.y);
            t.handlers.trigger("updateSelectionShape", true);
            return;
        } else {
            t.isShapeAction = false;
        }
        if (2 === event.detail) {
            if (this.mouseDownLastCord && coord.x === this.mouseDownLastCord.x && coord.y === this.mouseDownLastCord.y && 0 === event.button) {
                this.isDblClickInMouseDown = true;
                this.isDoBrowserDblClick = true;
                this.doMouseDblClick(event, false);
                this.mouseDownLastCord = null;
                return;
            }
        }
        if (! (AscBrowser.isIE || AscBrowser.isOpera)) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
        if (!this.targetInfo) {
            this.handlers.trigger("updateWorksheet", this.element, coord.x, coord.y, false, function (info) {
                t.targetInfo = info;
            });
        }
        this.mouseDownLastCord = coord;
        t.hasFocus = true;
        if (!t.isCellEditMode) {
            if (event.shiftKey) {
                t.isSelectMode = true;
                t._changeSelection(event, true);
                return;
            }
            if (t.targetInfo) {
                if (t.targetInfo.target === c_oTargetType.ColumnResize || t.targetInfo.target === c_oTargetType.RowResize) {
                    t.isResizeMode = true;
                    t._resizeElement(event);
                    return;
                } else {
                    if (t.targetInfo && t.targetInfo.target === c_oTargetType.FillHandle && false === this.settings.isViewerMode) {
                        this.isFillHandleMode = true;
                        t._changeFillHandle(event);
                        return;
                    } else {
                        if (t.targetInfo && t.targetInfo.target === c_oTargetType.MoveRange && false === this.settings.isViewerMode) {
                            this.isMoveRangeMode = true;
                            t._moveRangeHandle(event);
                            return;
                        } else {
                            if (t.targetInfo && t.targetInfo.target === c_oTargetType.FilterObject) {
                                t._autoFiltersClick(t.targetInfo.idFilter);
                                return;
                            } else {
                                if (t.targetInfo && undefined !== t.targetInfo.commentIndexes && false === this.settings.isViewerMode) {
                                    t._commentCellClick(event);
                                } else {
                                    if (t.targetInfo && t.targetInfo.target === c_oTargetType.MoveResizeRange && false === this.settings.isViewerMode) {
                                        this.isMoveResizeRange = true;
                                        t._moveResizeRangeHandle(event, t.targetInfo);
                                        return;
                                    } else {
                                        if (t.targetInfo && (t.targetInfo.target === c_oTargetType.FrozenAnchorV || t.targetInfo.target === c_oTargetType.FrozenAnchorH) && false === this.settings.isViewerMode) {
                                            this.frozenAnchorMode = t.targetInfo.target;
                                            t._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if (!t.isFormulaEditMode) {
                if (!t.handlers.trigger("stopCellEditing")) {
                    return;
                }
            } else {
                if (event.shiftKey) {
                    t.isSelectMode = true;
                    t._changeSelection(event, true);
                    return;
                } else {
                    if (t.isFormulaEditMode) {
                        if (t.targetInfo && t.targetInfo.target === c_oTargetType.MoveResizeRange && false === this.settings.isViewerMode) {
                            this.isMoveResizeRange = true;
                            t._moveResizeRangeHandle(event, t.targetInfo);
                            return;
                        } else {
                            if (false === t.handlers.trigger("canEnterCellRange")) {
                                if (!t.handlers.trigger("stopCellEditing")) {
                                    return;
                                }
                            }
                        }
                    }
                    t.isSelectMode = true;
                    t.handlers.trigger("changeSelection", true, coord.x, coord.y, true, true, function (d) {
                        t.scroll(d);
                        if (t.isFormulaEditMode) {
                            t.handlers.trigger("enterCellRange");
                        } else {
                            if (t.isCellEditMode) {
                                if (!t.handlers.trigger("stopCellEditing")) {
                                    return;
                                }
                            }
                        }
                    });
                    return;
                }
            }
        }
        if (2 === event.button) {
            t.handlers.trigger("changeSelectionRightClick", coord.x, coord.y);
        } else {
            if (t.targetInfo && t.targetInfo.target === c_oTargetType.FillHandle && false === this.settings.isViewerMode) {
                t.isFillHandleMode = true;
                t._changeFillHandle(event);
            } else {
                t.isSelectMode = true;
                t.handlers.trigger("changeSelection", true, coord.x, coord.y, true, true);
            }
        }
    };
    asc_CEventsController.prototype._onMouseUp = function (event) {
        if (2 === event.button) {
            this.handlers.trigger("onContextMenu", event);
            return true;
        }
        var coord = this._getCoordinates(event);
        event.isLocked = this.isMousePressed = false;
        if (this.isShapeAction) {
            event.ClickCount = this.clickCounter.clickCount;
            this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
            this._changeSelectionDone(event);
            if (asc["editor"].isStartAddShape) {
                event.preventDefault && event.preventDefault();
                event.stopPropagation && event.stopPropagation();
            }
            return true;
        }
        if (this.isSelectMode) {
            this.isSelectMode = false;
            this._changeSelectionDone(event);
        }
        if (this.isResizeMode) {
            this.isResizeMode = false;
            this._resizeElementDone(event);
        }
        if (this.isFillHandleMode) {
            this.isFillHandleMode = false;
            this._changeFillHandleDone(event);
        }
        if (this.isMoveRangeMode) {
            this.isMoveRangeMode = false;
            this._moveRangeHandleDone(event);
        }
        if (this.isMoveResizeRange) {
            this.isMoveResizeRange = false;
            this._moveResizeRangeHandleDone(event, this.targetInfo);
            return true;
        }
        if (this.frozenAnchorMode) {
            this._moveFrozenAnchorHandleDone(event, this.frozenAnchorMode);
            this.frozenAnchorMode = false;
        }
        this.showCellEditorCursor();
    };
    asc_CEventsController.prototype._onMouseMove = function (event) {
        var t = this;
        var ctrlKey = event.metaKey || event.ctrlKey;
        var coord = t._getCoordinates(event);
        t.hasCursor = true;
        var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
        if (graphicsInfo) {
            this.clickCounter.mouseMoveEvent(coord.x, coord.y);
        }
        if (t.isSelectMode) {
            t._changeSelection(event, true);
            return true;
        }
        if (t.isResizeMode) {
            t._resizeElement(event);
            this.isResizeModeMove = true;
            return true;
        }
        if (t.isFillHandleMode) {
            t._changeFillHandle(event);
            return true;
        }
        if (t.isMoveRangeMode) {
            event.currentTarget.style.cursor = ctrlKey ? "copy" : "move";
            t._moveRangeHandle(event);
            return true;
        }
        if (t.isMoveResizeRange) {
            t._moveResizeRangeHandle(event, t.targetInfo);
            return true;
        }
        if (t.frozenAnchorMode) {
            t._moveFrozenAnchorHandle(event, this.frozenAnchorMode);
            return true;
        }
        if (t.isShapeAction || graphicsInfo) {
            event.isLocked = t.isMousePressed;
            t.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
            t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, ctrlKey, function (info) {
                t.targetInfo = info;
            });
            return true;
        }
        t.handlers.trigger("updateWorksheet", t.element, coord.x, coord.y, ctrlKey, function (info) {
            t.targetInfo = info;
        });
        return true;
    };
    asc_CEventsController.prototype._onMouseLeave = function (event) {
        var t = this;
        this.hasCursor = false;
        if (!this.isSelectMode && !this.isResizeMode && !this.isMoveResizeRange) {
            this.targetInfo = undefined;
            this.handlers.trigger("updateWorksheet", this.element);
        }
        if (this.isMoveRangeMode) {
            t.moveRangeTimerId = window.setTimeout(function () {
                t._moveRangeHandle2(event);
            },
            0);
        }
        if (this.isMoveResizeRange) {
            t.moveResizeRangeTimerId = window.setTimeout(function () {
                t._moveResizeRangeHandle2(event);
            },
            0);
        }
        if (this.isFillHandleMode) {
            t.fillHandleModeTimerId = window.setTimeout(function () {
                t._changeFillHandle2(event);
            },
            0);
        }
        return true;
    };
    asc_CEventsController.prototype._onMouseWheel = function (event) {
        if (this.isFillHandleMode || this.isMoveRangeMode || this.isMoveResizeRange) {
            return true;
        }
        if (undefined !== window["AscDesktopEditor"]) {
            if (false === window["AscDesktopEditor"]["CheckNeedWheel"]()) {
                return true;
            }
        }
        var delta = 0;
        if (undefined !== event.wheelDelta && 0 !== event.wheelDelta) {
            delta = -1 * event.wheelDelta / 40;
        } else {
            if (undefined != event.detail && 0 !== event.detail) {
                delta = event.detail;
            } else {
                if (undefined != event.deltaY && 0 !== event.deltaY) {
                    delta = event.deltaY;
                }
            }
        }
        delta /= 3;
        var self = this;
        delta *= event.shiftKey ? 1 : this.settings.wheelScrollLines;
        this.handlers.trigger("updateWorksheet", this.element, undefined, undefined, undefined, function () {
            event.shiftKey ? self.scrollHorizontal(delta, event) : self.scrollVertical(delta, event);
            self._onMouseMove(event);
        });
        return true;
    };
    asc_CEventsController.prototype._onMouseDblClick = function (event) {
        if (this.handlers.trigger("isGlobalLockEditCell")) {
            return false;
        }
        if (false === this.isDblClickInMouseDown) {
            return this.doMouseDblClick(event, false);
        }
        this.isDblClickInMouseDown = false;
        this.showCellEditorCursor();
        return true;
    };
    asc_CEventsController.prototype._getCoordinates = function (event) {
        if (event.coord) {
            return event.coord;
        }
        var offs = $(this.element).offset();
        var x = event.pageX - offs.left;
        var y = event.pageY - offs.top;
        if (AscBrowser.isRetina) {
            x <<= 1;
            y <<= 1;
        }
        return {
            x: x,
            y: y
        };
    };
    asc_CEventsController.prototype._onTouchStart = function (event) {
        this.view.MobileTouchManager.onTouchStart(event);
    };
    asc_CEventsController.prototype._onTouchMove = function (event) {
        this.view.MobileTouchManager.onTouchMove(event);
    };
    asc_CEventsController.prototype._onTouchEnd = function (event) {
        this.view.MobileTouchManager.onTouchEnd(event);
    };
    window["Asc"]["asc_CEventsController"] = window["Asc"].asc_CEventsController = asc_CEventsController;
})(jQuery, window);