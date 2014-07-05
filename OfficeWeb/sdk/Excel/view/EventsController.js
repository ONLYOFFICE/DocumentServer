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
 (function ($, window, undefined) {
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var namespace = "ASC_Spreadsheet";
    function asc_CEventsController() {
        if (! (this instanceof asc_CEventsController)) {
            return new asc_CEventsController();
        }
        this.view = undefined;
        this.widget = undefined;
        this.element = undefined;
        this.handlers = undefined;
        this.settings = $.extend(true, {},
        this.defaults);
        this.vsb = undefined;
        this.vsbApi = undefined;
        this.hsb = undefined;
        this.hsbApi = undefined;
        this.resizeTimerId = undefined;
        this.scrollTimerId = undefined;
        this.moveRangeTimerId = undefined;
        this.moveResizeRangeTimerId = undefined;
        this.fillHandleModeTimerId = undefined;
        this.moveRangeId = undefined;
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
        this.isMoveResizeChartsRange = false;
        this.isSelectionDialogMode = false;
        this.isFormulaEditMode = false;
        this.endWasPressed = false;
        this.clickCounter = new ClickCounter();
        this.isMousePressed = false;
        this.isShapeAction = false;
        this.isMouseDownMode = false;
        this.isDblClickInMouseDown = false;
        this.isDoBrowserDblClick = false;
        this.mouseDownLastCord = null;
        return this;
    }
    asc_CEventsController.prototype = {
        constructor: asc_CEventsController,
        defaults: {
            vscrollStep: 10,
            hscrollStep: 10,
            scrollTimeout: 20,
            showArrows: true,
            scrollBackgroundColor: "#DDDDDD",
            scrollerColor: "#EDEDED",
            isViewerMode: false,
            wheelScrollLines: 3
        },
        init: function (view, widgetElem, canvasElem, handlers, settings) {
            var self = this;
            this.view = view;
            this.widget = widgetElem;
            this.element = canvasElem;
            this.handlers = new asc.asc_CHandlersList(handlers);
            this.settings = $.extend(true, {},
            this.settings, settings);
            this._createScrollBars();
            if (this.view.Api.isMobileVersion) {
                var __hasTouch = "ontouchstart" in window;
                if (__hasTouch) {
                    this.widget[0].addEventListener("touchstart", function (e) {
                        self._onTouchStart(e);
                        return false;
                    },
                    false);
                    this.widget[0].addEventListener("touchmove", function (e) {
                        self._onTouchMove(e);
                        return false;
                    },
                    false);
                    this.widget[0].addEventListener("touchend", function (e) {
                        self._onTouchEnd(e);
                        return false;
                    },
                    false);
                } else {
                    this.widget[0].addEventListener("touchstart", function (e) {
                        self._onMouseDown(e.touches[0]);
                        return false;
                    },
                    false);
                    this.widget[0].addEventListener("touchmove", function (e) {
                        self._onMouseMove(e.touches[0]);
                        return false;
                    },
                    false);
                    this.widget[0].addEventListener("touchend", function (e) {
                        self._onMouseUp(e.changedTouches[0]);
                        return false;
                    },
                    false);
                }
                window.addEventListener("resize", function () {
                    self._onWindowResize.apply(self, arguments);
                });
                return;
            }
            $(window).on("resize." + namespace, function () {
                self._onWindowResize.apply(self, arguments);
            }).on("keydown." + namespace, function () {
                return self._onWindowKeyDown.apply(self, arguments);
            }).on("keypress." + namespace, function () {
                return self._onWindowKeyPress.apply(self, arguments);
            }).on("keyup." + namespace, function () {
                return self._onWindowKeyUp.apply(self, arguments);
            }).on("mousemove." + namespace, function () {
                return self._onWindowMouseMove.apply(self, arguments);
            }).on("mouseup." + namespace, function () {
                return self._onWindowMouseUp.apply(self, arguments);
            }).on("mouseleave." + namespace, function () {
                return self._onWindowMouseLeaveOut.apply(self, arguments);
            }).on("mouseout." + namespace, function () {
                return self._onWindowMouseLeaveOut.apply(self, arguments);
            });
            if (this.element.onselectstart) {
                this.element.onselectstart = function () {
                    return false;
                };
            }
            if (AscBrowser.isIE || AscBrowser.isOpera) {
                document.onselectstart = function () {
                    return false;
                };
            }
            this.element.on("mousedown", function () {
                return self._onMouseDown.apply(self, arguments);
            }).on("mouseup", function () {
                return self._onMouseUp.apply(self, arguments);
            }).on("mousemove", function () {
                return self._onMouseMove.apply(self, arguments);
            }).on("mouseleave", function () {
                return self._onMouseLeave.apply(self, arguments);
            }).on("mousewheel", function () {
                return self._onMouseWheel.apply(self, arguments);
            }).on("dblclick", function () {
                return self._onMouseDblClick.apply(self, arguments);
            });
            var oShapeCursor = $("#id_target_cursor");
            if (oShapeCursor) {
                oShapeCursor.on("mousedown", function () {
                    return self._onMouseDown.apply(self, arguments);
                }).on("mouseup", function () {
                    return self._onMouseUp.apply(self, arguments);
                }).on("mousemove", function () {
                    return self._onMouseMove.apply(self, arguments);
                });
            }
            this.element[0].ontouchstart = function (e) {
                self._onMouseDown(e.touches[0]);
                return false;
            };
            this.element[0].ontouchmove = function (e) {
                self._onMouseMove(e.touches[0]);
                return false;
            };
            this.element[0].ontouchend = function (e) {
                self._onMouseUp(e.changedTouches[0]);
                return false;
            };
            return this;
        },
        destroy: function () {
            $(window).off("." + namespace);
            return this;
        },
        enableKeyEventsHandler: function (flag) {
            this.enableKeyEvents = !!flag;
        },
        setCellEditMode: function (flag) {
            this.isCellEditMode = !!flag;
        },
        setViewerMode: function (isViewerMode) {
            this.settings.isViewerMode = !!isViewerMode;
        },
        getViewerMode: function () {
            return this.settings.isViewerMode;
        },
        setFocus: function (hasFocus) {
            this.hasFocus = !!hasFocus;
        },
        setStrictClose: function (enabled) {
            this.strictClose = !!enabled;
        },
        setFormulaEditMode: function (isFormulaEditMode) {
            this.isFormulaEditMode = !!isFormulaEditMode;
        },
        setSelectionDialogMode: function (isSelectionDialogMode) {
            this.isSelectionDialogMode = isSelectionDialogMode;
        },
        reinitializeScroll: function (whichSB) {
            var self = this,
            opt = this.settings,
            ws = self.view.getWorksheet(),
            isVert = !whichSB || whichSB === 1,
            isHoriz = !whichSB || whichSB === 2;
            if (isVert || isHoriz) {
                this.handlers.trigger("reinitializeScroll", whichSB, function (vSize, hSize) {
                    if (isVert) {
                        var vsHelperH = self.vsb.outerHeight() + Math.max(vSize * opt.vscrollStep, 1);
                        self.vsb.find("#ws-v-scroll-helper").height(vsHelperH);
                        self.vsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleRow());
                    }
                    if (isHoriz) {
                        var hsHelperW = self.hsb.outerWidth() + Math.max(hSize * opt.hscrollStep, 1);
                        self.hsb.find("#ws-h-scroll-helper").width(hsHelperW);
                        self.hsbApi.Reinit(opt, opt.vscrollStep * ws.getFirstVisibleCol());
                    }
                    ws.objectRender.setScrollOffset();
                });
            }
            return this;
        },
        scrollVertical: function (delta, event) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            this.vsbApi.scrollByY(this.settings.vscrollStep * delta);
            return true;
        },
        scrollHorizontal: function (delta, event) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            this.hsbApi.scrollByX(this.settings.hscrollStep * delta);
            return true;
        },
        doMouseDblClick: function (event, isHideCursor, isCoord) {
            var t = this;
            if (t.settings.isViewerMode || t.isFormulaEditMode || t.isSelectionDialogMode) {
                return true;
            }
            if (this.targetInfo && (this.targetInfo.target == "moveResizeRange" || this.targetInfo.target == "moveRange" || this.targetInfo.target == "fillhandle")) {
                return true;
            }
            if (t.isCellEditMode) {
                if (!t.handlers.trigger("stopCellEditing")) {
                    return true;
                }
            }
            var coord = t._getCoordinates(event);
            var graphicsInfo = t.handlers.trigger("getGraphicsInfo", coord.x, coord.y);
            if (t.isShapeAction || graphicsInfo) {
                return;
            }
            setTimeout(function () {
                t.isCellEditMode = true;
                var coord = t._getCoordinates(event);
                t.handlers.trigger("mouseDblClick", coord.x, coord.y, isHideCursor, isCoord, function (resized) {
                    if (resized) {
                        t.isCellEditMode = false;
                        t.handlers.trigger("updateWorksheet", t.element[0], coord.x, coord.y, event.ctrlKey, function (info) {
                            t.targetInfo = info;
                        });
                    }
                });
            },
            100);
            return true;
        },
        showCellEditorCursor: function () {
            if (this.isCellEditMode) {
                if (this.isDoBrowserDblClick) {
                    this.isDoBrowserDblClick = false;
                    this.handlers.trigger("showCellEditorCursor");
                }
            }
        },
        _createScrollBars: function () {
            var self = this,
            opt = this.settings;
            this.vsb = this.widget.find("#ws-v-scrollbar");
            if (this.vsb.length < 1) {
                this.vsb = $('<div id="ws-v-scrollbar"><div id="ws-v-scroll-helper"/></div>').appendTo(this.widget);
            }
            if (!this.vsbApi) {
                this.vsbApi = new ScrollObject(this.vsb[0].id, opt);
                this.vsbApi.bind("scrollvertical", function (evt) {
                    self.handlers.trigger("scrollY", evt.scrollPositionY / opt.vscrollStep);
                });
                this.vsbApi.bind("scrollVEnd", function (evt) {
                    self.handlers.trigger("addRow", true);
                });
                this.vsbApi.onLockMouse = function () {
                    $(window).on("mousemove.scroll", function (e) {
                        return self.vsbApi.mouseDown ? self.vsbApi.evt_mousemove.call(self.vsbApi, e) : false;
                    }).on("mouseup.scroll", function (e) {
                        return self.vsbApi.mouseDown ? self.vsbApi.evt_mouseup.call(self.vsbApi, e) : false;
                    });
                };
                this.vsbApi.offLockMouse = function () {
                    $(window).off(".scroll");
                };
            }
            this.hsb = this.widget.find("#ws-h-scrollbar");
            if (this.hsb.length < 1) {
                this.hsb = $('<div id="ws-h-scrollbar"><div id="ws-h-scroll-helper"/></div>').appendTo(this.widget);
            }
            if (!this.hsbApi) {
                this.hsbApi = new ScrollObject(this.hsb[0].id, $.extend(true, {},
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
                    $(window).on("mousemove.scroll", function (e) {
                        return self.hsbApi.mouseDown ? self.hsbApi.evt_mousemove.call(self.hsbApi, e) : false;
                    }).on("mouseup.scroll", function (e) {
                        return self.hsbApi.mouseDown ? self.hsbApi.evt_mouseup.call(self.hsbApi, e) : false;
                    });
                };
                this.hsbApi.offLockMouse = function () {
                    $(window).off(".scroll");
                };
            }
            if (!this.view.Api.isMobileVersion) {
                if (this.widget.find("#ws-scrollbar-corner").length < 1) {
                    $('<div id="ws-scrollbar-corner"/>').appendTo(this.widget);
                }
            } else {
                this.hsb[0].style.zIndex = -10;
                this.hsb[0].style.right = 0;
                this.hsb[0].style.display = "none";
                this.vsb[0].style.zIndex = -10;
                this.vsb[0].style.bottom = 0;
                this.vsb[0].style.display = "none";
            }
        },
        _changeSelection: function (event, isSelectMode, callback) {
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
                if (d.deltaX) {
                    t.scrollHorizontal(d.deltaX);
                }
                if (d.deltaY) {
                    t.scrollVertical(d.deltaY);
                }
                if (t.isFormulaEditMode) {
                    t.handlers.trigger("enterCellRange");
                } else {
                    if (t.isCellEditMode) {
                        if (!t.handlers.trigger("stopCellEditing")) {
                            return;
                        }
                    }
                }
                if ($.isFunction(callback)) {
                    callback();
                }
            });
        },
        _changeSelection2: function (event) {
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
        },
        _moveRangeHandle2: function (event) {
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
        },
        _moveResizeRangeHandle2: function (event) {
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
        },
        _changeSelectionDone: function (event) {
            var coord = this._getCoordinates(event);
            if (false === event.ctrlKey) {
                coord.x = -1;
                coord.y = -1;
            }
            this.handlers.trigger("changeSelectionDone", coord.x, coord.y);
        },
        _resizeElement: function (event) {
            var coord = this._getCoordinates(event);
            this.handlers.trigger("resizeElement", this.targetInfo, coord.x, coord.y);
        },
        _resizeElementDone: function (event) {
            var coord = this._getCoordinates(event);
            this.handlers.trigger("resizeElementDone", this.targetInfo, coord.x, coord.y, this.isResizeModeMove);
            this.isResizeModeMove = false;
        },
        _changeFillHandle: function (event, callback) {
            var t = this;
            var coord = this._getCoordinates(event);
            this.handlers.trigger("changeFillHandle", coord.x, coord.y, function (d) {
                if (!d) {
                    return;
                }
                if (d.deltaX) {
                    t.scrollHorizontal(d.deltaX);
                }
                if (d.deltaY) {
                    t.scrollVertical(d.deltaY);
                }
                if ($.isFunction(callback)) {
                    callback();
                }
            });
        },
        _changeFillHandle2: function (event) {
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
        },
        _changeFillHandleDone: function (event) {
            var coord = this._getCoordinates(event);
            var ctrlPress = event.ctrlKey;
            this.handlers.trigger("changeFillHandleDone", coord.x, coord.y, ctrlPress);
        },
        _moveRangeHandle: function (event, callback) {
            var t = this;
            var coord = this._getCoordinates(event);
            this.handlers.trigger("moveRangeHandle", coord.x, coord.y, function (d) {
                if (!d) {
                    return;
                }
                if (d.deltaX) {
                    t.scrollHorizontal(d.deltaX);
                }
                if (d.deltaY) {
                    t.scrollVertical(d.deltaY);
                }
                if ($.isFunction(callback)) {
                    callback();
                }
            },
            event.ctrlKey);
        },
        _moveResizeRangeHandle: function (event, target, callback) {
            var t = this;
            var coord = this._getCoordinates(event);
            this.handlers.trigger("moveResizeRangeHandle", coord.x, coord.y, target, function (d) {
                if (!d) {
                    return;
                }
                if (d.deltaX) {
                    t.scrollHorizontal(d.deltaX);
                }
                if (d.deltaY) {
                    t.scrollVertical(d.deltaY);
                }
                if ($.isFunction(callback)) {
                    callback();
                }
            });
        },
        _autoFiltersClick: function (event) {
            var t = this;
            var coord = t._getCoordinates(event);
            this.handlers.trigger("autoFiltersClick", coord.x, coord.y);
        },
        _commentCellClick: function (event) {
            var t = this;
            var coord = t._getCoordinates(event);
            this.handlers.trigger("commentCellClick", coord.x, coord.y);
        },
        _moveRangeHandleDone: function (event) {
            this.handlers.trigger("moveRangeHandleDone", event.ctrlKey);
        },
        _moveResizeRangeHandleDone: function (event, target) {
            this.handlers.trigger("moveResizeRangeHandleDone", target);
        },
        _onWindowResize: function (event) {
            var self = this;
            window.clearTimeout(this.resizeTimerId);
            this.resizeTimerId = window.setTimeout(function () {
                self.handlers.trigger("resize", event);
            },
            150);
        },
        _onWindowKeyDown: function (event) {
            var t = this,
            dc = 0,
            dr = 0,
            isViewerMode = t.settings.isViewerMode;
            t.__retval = true;
            if (event.metaKey) {
                event.ctrlKey = true;
            }
            function stop(immediate) {
                event.stopPropagation();
                immediate ? event.stopImmediatePropagation() : true;
                event.preventDefault();
                t.__retval = false;
            }
            if (event.which === 18) {
                t.lastKeyCode = event.which;
            }
            var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
            if (!t.isMousePressed && graphicObjects.length && t.enableKeyEvents) {
                if (event.metaKey) {
                    event.ctrlKey = true;
                }
                if (t.handlers.trigger("graphicObjectWindowKeyDown", event)) {
                    return true;
                }
            }
            var selectionActivePointChanged = false;
            this.showCellEditorCursor();
            while (t.isCellEditMode && !t.hasFocus || !t.enableKeyEvents || t.isSelectMode || t.isFillHandleMode || t.isMoveRangeMode || t.isMoveResizeRange) {
                if (t.isCellEditMode && !t.strictClose && event.which >= 37 && event.which <= 40) {
                    break;
                }
                if (!t.enableKeyEvents && event.ctrlKey && (80 === event.which)) {
                    break;
                }
                return true;
            }
            t.skipKeyPress = true;
            switch (event.which) {
            case 113:
                var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
                if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode || graphicObjects.length) {
                    return true;
                }
                if ($.browser.opera) {
                    stop();
                }
                t.strictClose = true;
                t.handlers.trigger("editCell", 0, 0, false, true, false, undefined);
                return t.__retval;
            case 8:
                if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {
                    return true;
                }
                t.handlers.trigger("editCell", 0, 0, false, false, true, undefined, function (res) {
                    if (res) {
                        $(window).trigger(event);
                    }
                });
                return true;
            case 46:
                if (isViewerMode || t.isCellEditMode || t.isSelectionDialogMode) {
                    return true;
                }
                t.handlers.trigger("empty");
                return true;
            case 9:
                if (t.isCellEditMode) {
                    return true;
                }
                stop();
                selectionActivePointChanged = true;
                if (event.shiftKey) {
                    dc = -1;
                    event.shiftKey = false;
                } else {
                    dc = +1;
                }
                break;
            case 13:
                if (t.isCellEditMode) {
                    return true;
                }
                selectionActivePointChanged = true;
                if (event.shiftKey) {
                    dr = -1;
                    event.shiftKey = false;
                } else {
                    dr = +1;
                }
                break;
            case 27:
                stop();
                return t.__retval;
            case 144:
                case 145:
                if ($.browser.opera) {
                    stop();
                }
                return t.__retval;
            case 32:
                if (t.isCellEditMode) {
                    return true;
                }
                if (!event.ctrlKey && !event.shiftKey) {
                    t.skipKeyPress = false;
                    return true;
                }
                stop();
                if (event.ctrlKey && event.shiftKey) {
                    t.handlers.trigger("changeSelection", true, 0, 0, true, false);
                } else {
                    if (event.ctrlKey) {
                        t.handlers.trigger("selectColumnsByRange");
                    } else {
                        t.handlers.trigger("selectRowsByRange");
                    }
                }
                return t.__retval;
            case 33:
                stop();
                if (event.ctrlKey) {
                    t.handlers.trigger("showNextPrevWorksheet", -1);
                    return true;
                } else {
                    event.altKey ? dc = -0.5 : dr = -0.5;
                }
                break;
            case 34:
                stop();
                if (event.ctrlKey) {
                    t.handlers.trigger("showNextPrevWorksheet", +1);
                    return true;
                } else {
                    event.altKey ? dc = +0.5 : dr = +0.5;
                }
                break;
            case 37:
                stop();
                dc = event.ctrlKey ? -1.5 : -1;
                break;
            case 38:
                stop();
                dr = event.ctrlKey ? -1.5 : -1;
                break;
            case 39:
                stop();
                dc = event.ctrlKey ? +1.5 : +1;
                break;
            case 40:
                stop();
                dr = event.ctrlKey ? +1.5 : +1;
                break;
            case 36:
                stop();
                dc = -2.5;
                if (event.ctrlKey) {
                    dr = -2.5;
                }
                break;
            case 35:
                dc = 2.5;
                if (event.ctrlKey) {
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
                    return false;
                }
            case 65:
                case 67:
                if (t.isCellEditMode) {
                    return true;
                }
            case 80:
                if (t.isCellEditMode) {
                    stop();
                    return false;
                }
                if (!event.ctrlKey) {
                    t.skipKeyPress = false;
                    return true;
                }
                if (!t.__handlers) {
                    t.__handlers = {
                        53: function () {
                            stop();
                            t.handlers.trigger("setFontAttributes", "s");
                        },
                        65: function () {
                            stop();
                            t.handlers.trigger("changeSelection", true, 0, 0, true, false);
                        },
                        66: function () {
                            stop();
                            t.handlers.trigger("setFontAttributes", "b");
                        },
                        73: function () {
                            stop();
                            t.handlers.trigger("setFontAttributes", "i");
                        },
                        85: function () {
                            stop();
                            t.handlers.trigger("setFontAttributes", "u");
                        },
                        80: function () {
                            stop();
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
                                        SafariIntervalFocus();
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
                            stop();
                            t.handlers.trigger("redo");
                        },
                        90: function () {
                            stop();
                            t.handlers.trigger("undo");
                        }
                    };
                }
                t.__handlers[event.which]();
                return t.__retval;
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
            default:
                if (!event.ctrlKey) {
                    t.skipKeyPress = false;
                }
                return true;
            }
            if ((dc !== 0 || dr !== 0) && false === t.handlers.trigger("isGlobalLockEditCell")) {
                if (selectionActivePointChanged) {
                    t.handlers.trigger("selectionActivePointChanged", dc, dr, function (d) {
                        if (d.deltaX) {
                            t.scrollHorizontal(d.deltaX);
                        }
                        if (d.deltaY) {
                            t.scrollVertical(d.deltaY);
                        }
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
                    t.handlers.trigger("changeSelection", !event.shiftKey, dc, dr, false, false, function (d) {
                        if (d.deltaX) {
                            t.scrollHorizontal(d.deltaX);
                        }
                        if (d.deltaY) {
                            t.scrollVertical(d.deltaY);
                        }
                        if (t.isFormulaEditMode) {
                            t.handlers.trigger("enterCellRange");
                        } else {
                            if (t.isCellEditMode) {
                                if (!t.handlers.trigger("stopCellEditing")) {
                                    return true;
                                }
                            }
                        }
                    });
                }
            }
            return t.__retval;
        },
        _onWindowKeyPress: function (event) {
            var t = this;
            if (!t.enableKeyEvents) {
                return true;
            }
            if (t.settings.isViewerMode || t.isSelectionDialogMode) {
                return true;
            }
            var graphicObjects = t.handlers.trigger("getSelectedGraphicObjects");
            if (!t.isMousePressed && graphicObjects.length && t.enableKeyEvents) {
                if (t.skipKeyPress || event.which < 32) {
                    t.skipKeyPress = true;
                    return true;
                }
                if (t.isCellEditMode) {
                    t.handlers.trigger("stopCellEditing");
                    t.isCellEditMode = false;
                }
                if (t.handlers.trigger("graphicObjectWindowKeyPress", event)) {
                    return true;
                }
            }
            this.showCellEditorCursor();
            if (t.isCellEditMode && !t.hasFocus || !t.enableKeyEvents || t.isSelectMode) {
                return true;
            }
            if (t.skipKeyPress || event.which < 32) {
                t.skipKeyPress = true;
                return true;
            }
            if (!t.isCellEditMode) {
                t.handlers.trigger("editCell", 0, 0, false, false, true, undefined, function (res) {
                    if (res) {
                        $(window).trigger(event);
                    }
                });
            }
            return true;
        },
        _onWindowKeyUp: function (event) {
            var t = this;
            if (t.lastKeyCode === 18 && event.which === 18) {
                return false;
            }
            if (16 === event.which) {
                this.handlers.trigger("updateSelectionName");
            }
            return true;
        },
        _onWindowMouseMove: function (event) {
            var t = this;
            var coord = t._getCoordinates(event);
            if (this.isSelectMode && !this.hasCursor) {
                this._changeSelection2(event);
            }
            if (this.isResizeMode && !this.hasCursor) {
                this.isResizeModeMove = true;
                this._resizeElement(event);
            }
            event.isLocked = t.isMousePressed;
            if (t.isShapeAction && t.isMouseDownMode) {
                t.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
            }
            return true;
        },
        _onWindowMouseUp: function (event) {
            this.vsbApi.evt_mouseup(event);
            this.hsbApi.evt_mouseup(event);
            var coord = this._getCoordinates(event);
            if (this.isShapeAction) {
                if (this.isMouseDownMode) {
                    event.isLocked = this.isMousePressed = false;
                    this.isMouseDownMode = false;
                    event.ClickCount = this.clickCounter.clickCount;
                    this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
                    this._changeSelectionDone(event);
                    return true;
                } else {}
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
                this.isMoveResizeChartsRange = false;
                this.handlers.trigger("moveResizeRangeHandleDone", this.targetInfo);
            }
            this.showCellEditorCursor();
            return true;
        },
        _onWindowMouseUpExternal: function (x, y) {
            if (this.isSelectMode) {
                this.isSelectMode = false;
                this.handlers.trigger("changeSelectionDone", x, y);
            }
            if (this.isResizeMode) {
                this.isResizeMode = false;
                this.handlers.trigger("resizeElementDone", this.targetInfo, x, y, this.isResizeModeMove);
                this.isResizeModeMove = false;
            }
            if (this.isFillHandleMode) {
                this.isFillHandleMode = false;
                this.handlers.trigger("changeFillHandleDone", x, y, false);
            }
            if (this.isMoveRangeMode) {
                this.isMoveRangeMode = false;
                this.handlers.trigger("moveRangeHandleDone");
            }
            if (this.isMoveResizeRange) {
                this.isMoveResizeRange = false;
                this.isMoveResizeChartsRange = false;
                this.handlers.trigger("moveResizeRangeHandleDone", this.targetInfo);
            }
            this.showCellEditorCursor();
            return true;
        },
        _onWindowMouseLeaveOut: function (event) {
            if (!this.isDoBrowserDblClick) {
                return true;
            }
            var relatedTarget = event.relatedTarget || event.fromElement;
            if (relatedTarget && ("ce-canvas-outer" === relatedTarget.id || "ce-canvas" === relatedTarget.id || "ce-canvas-overlay" === relatedTarget.id || "ce-cursor" === relatedTarget.id || "ws-canvas-overlay" === relatedTarget.id)) {
                return true;
            }
            this.showCellEditorCursor();
            return true;
        },
        _onMouseDown: function (event) {
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
                t.isShapeAction = true;
                t.isMouseDownMode = true;
                if (event.metaKey) {
                    event.ctrlKey = true;
                }
                t.clickCounter.mouseDownEvent(coord.x, coord.y, event.button);
                event.ClickCount = t.clickCounter.clickCount;
                if ((event.ClickCount == 2) && t.isShapeAction) {
                    t.isDblClickInMouseDown = true;
                }
                t.handlers.trigger("graphicObjectMouseDown", event, coord.x, coord.y);
                t.handlers.trigger("updateSelectionShape", true);
                return;
            } else {
                t.isShapeAction = false;
            }
            if (event.originalEvent && 2 === event.originalEvent.detail) {
                if (this.mouseDownLastCord && coord.x === this.mouseDownLastCord.x && coord.y === this.mouseDownLastCord.y && 0 === event.button) {
                    this.isDblClickInMouseDown = true;
                    this.isDoBrowserDblClick = true;
                    this.doMouseDblClick(event, false, true);
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
            this.mouseDownLastCord = coord;
            t.hasFocus = true;
            if (!t.isCellEditMode) {
                if (event.shiftKey) {
                    t.isSelectMode = true;
                    t._changeSelection(event, true);
                    return;
                }
                if (t.targetInfo) {
                    if (t.targetInfo.target === "colresize" || t.targetInfo.target === "rowresize") {
                        t.isResizeMode = true;
                        t._resizeElement(event);
                        return;
                    } else {
                        if (t.targetInfo && t.targetInfo.target === "fillhandle" && false === this.settings.isViewerMode) {
                            this.isFillHandleMode = true;
                            t._changeFillHandle(event);
                            return;
                        } else {
                            if (t.targetInfo && t.targetInfo.target === "moveRange" && false === this.settings.isViewerMode) {
                                this.isMoveRangeMode = true;
                                t._moveRangeHandle(event);
                                return;
                            } else {
                                if (t.targetInfo && (t.targetInfo.target === "aFilterObject")) {
                                    t._autoFiltersClick(event);
                                    return;
                                } else {
                                    if (t.targetInfo && (undefined !== t.targetInfo.commentIndexes) && (false === this.settings.isViewerMode)) {
                                        t._commentCellClick(event);
                                    } else {
                                        if (t.targetInfo && t.targetInfo.target === "moveResizeRange" && false === this.settings.isViewerMode) {
                                            this.isMoveResizeRange = true;
                                            this.isMoveResizeChartsRange = true;
                                            t._moveResizeRangeHandle(event, t.targetInfo);
                                            return;
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
                            if (t.targetInfo && t.targetInfo.target === "moveResizeRange" && false === this.settings.isViewerMode) {
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
                            if (d.deltaX) {
                                t.scrollHorizontal(d.deltaX);
                            }
                            if (d.deltaY) {
                                t.scrollVertical(d.deltaY);
                            }
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
                if (t.targetInfo && t.targetInfo.target === "fillhandle" && false === this.settings.isViewerMode) {
                    t.isFillHandleMode = true;
                    t._changeFillHandle(event);
                    return;
                } else {
                    t.isSelectMode = true;
                    t.handlers.trigger("changeSelection", true, coord.x, coord.y, true, true);
                    return;
                }
            }
        },
        _onMouseUp: function (event) {
            var coord = this._getCoordinates(event);
            event.isLocked = this.isMousePressed = false;
            if (this.isShapeAction) {
                if (event.metaKey) {
                    event.ctrlKey = true;
                }
                if (this.isCellEditMode) {
                    this.handlers.trigger("stopCellEditing");
                    this.isCellEditMode = false;
                }
                event.ClickCount = this.clickCounter.clickCount;
                this.handlers.trigger("graphicObjectMouseUp", event, coord.x, coord.y);
                this.isMouseDownMode = false;
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
                this.isMoveResizeChartsRange = false;
                this._moveResizeRangeHandleDone(event, this.targetInfo);
                return true;
            }
            this.showCellEditorCursor();
        },
        _onMouseMove: function (event) {
            var t = this;
            var coord = t._getCoordinates(event);
            event.isLocked = t.isMousePressed;
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
                t._moveRangeHandle(event);
                return true;
            }
            if (t.isMoveResizeRange) {
                t._moveResizeRangeHandle(event, t.targetInfo);
                return true;
            }
            if (t.isShapeAction || graphicsInfo) {
                t.handlers.trigger("graphicObjectMouseMove", event, coord.x, coord.y);
                t.handlers.trigger("updateWorksheet", t.element[0], coord.x, coord.y, event.ctrlKey, function (info) {
                    t.targetInfo = info;
                });
                return true;
            }
            t.handlers.trigger("updateWorksheet", t.element[0], coord.x, coord.y, event.ctrlKey, function (info) {
                t.targetInfo = info;
            });
            return true;
        },
        _onMouseLeave: function (event) {
            var t = this;
            this.hasCursor = false;
            if (!this.isSelectMode && !this.isResizeMode && !this.isMoveResizeRange) {
                this.targetInfo = undefined;
                this.handlers.trigger("updateWorksheet", this.element[0]);
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
        },
        _onMouseWheel: function (event, delta) {
            if (this.isFillHandleMode || this.isMoveRangeMode || this.isMoveResizeChartsRange || this.isMoveResizeRange) {
                return true;
            }
            var self = this;
            delta *= event.shiftKey ? 1 : this.settings.wheelScrollLines;
            this.handlers.trigger("updateWorksheet", this.element[0], undefined, undefined, undefined, function () {
                event.shiftKey ? self.scrollHorizontal(-delta, event) : self.scrollVertical(-delta, event);
                self._onMouseMove(event);
            });
            return true;
        },
        _onMouseDblClick: function (event) {
            var t = this;
            var coord = t._getCoordinates(event);
            if (this.handlers.trigger("isGlobalLockEditCell")) {
                return false;
            }
            if (false === this.isDblClickInMouseDown) {
                return this.doMouseDblClick(event, false, true);
            }
            this.isDblClickInMouseDown = false;
            this.showCellEditorCursor();
            return true;
        },
        _getCoordinates: function (event) {
            var offs = this.element.offset();
            var x = event.pageX - offs.left;
            var y = event.pageY - offs.top;
            return {
                x: x,
                y: y
            };
        },
        _onTouchStart: function (event) {
            this.view.MobileTouchManager.onTouchStart(event);
        },
        _onTouchMove: function (event) {
            var n = new Date().getTime();
            this.view.MobileTouchManager.onTouchMove(event);
        },
        _onTouchEnd: function (event) {
            this.view.MobileTouchManager.onTouchEnd(event);
        }
    };
    window["Asc"]["asc_CEventsController"] = window["Asc"].asc_CEventsController = asc_CEventsController;
})(jQuery, window);