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
 var g_mouse_event_type_down = 0;
var g_mouse_event_type_move = 1;
var g_mouse_event_type_up = 2;
var g_mouse_event_type_wheel = 3;
var g_mouse_button_left = 0;
var g_mouse_button_center = 1;
var g_mouse_button_right = 2;
var g_mouse_event_settings_lock = 1;
var g_mouse_event_settings_count = 2;
function CMouseEventHandler() {
    this.X = 0;
    this.Y = 0;
    this.Button = g_mouse_button_left;
    this.Type = g_mouse_event_type_move;
    this.AltKey = false;
    this.CtrlKey = false;
    this.ShiftKey = false;
    this.Sender = null;
    this.LastClickTime = -1;
    this.ClickCount = 0;
    this.WheelDelta = 0;
    this.IsPressed = false;
    this.LastX = 0;
    this.LastY = 0;
    this.KoefPixToMM = 1;
    this.IsLocked = false;
    this.IsLockedEvent = false;
    this.buttonObject = null;
    this.LockMouse = function () {
        if (!this.IsLocked) {
            this.IsLocked = true;
            if (window.captureEvents) {
                window.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);
            }
            return true;
        }
        return false;
    };
    this.UnLockMouse = function () {
        if (this.IsLocked) {
            this.IsLocked = false;
            if (window.releaseEvents) {
                window.releaseEvents(Event.MOUSEMOVE);
            }
            return true;
        }
        return false;
    };
}
function CKeyboardEvent() {
    this.AltKey = false;
    this.CtrlKey = false;
    this.ShiftKey = false;
    this.Sender = null;
    this.CharCode = 0;
    this.KeyCode = 0;
}
var global_mouseEvent = new CMouseEventHandler();
var global_keyboardEvent = new CKeyboardEvent();
function check_KeyboardEvent(e) {
    global_keyboardEvent.AltKey = e.altKey;
    if (e.metaKey !== undefined) {
        global_keyboardEvent.CtrlKey = e.ctrlKey || e.metaKey;
    } else {
        global_keyboardEvent.CtrlKey = e.ctrlKey;
    }
    global_keyboardEvent.ShiftKey = e.shiftKey;
    global_keyboardEvent.Sender = (e.srcElement) ? e.srcElement : e.target;
    global_keyboardEvent.CharCode = e.charCode;
    global_keyboardEvent.KeyCode = e.keyCode;
    global_keyboardEvent.Which = e.which;
}
function check_KeyboardEvent2(e) {
    global_keyboardEvent.AltKey = e.altKey;
    if (e.metaKey !== undefined) {
        global_keyboardEvent.CtrlKey = e.ctrlKey || e.metaKey;
    } else {
        global_keyboardEvent.CtrlKey = e.ctrlKey;
    }
    global_keyboardEvent.ShiftKey = e.shiftKey;
}
function check_MouseMoveEvent(e) {
    if (e.IsLocked && !e.IsLockedEvent) {
        return;
    }
    if (e.pageX || e.pageY) {
        global_mouseEvent.X = e.pageX;
        global_mouseEvent.Y = e.pageY;
    } else {
        if (e.clientX || e.clientY) {
            global_mouseEvent.X = e.clientX;
            global_mouseEvent.Y = e.clientY;
        }
    }
    global_mouseEvent.AltKey = e.altKey;
    global_mouseEvent.ShiftKey = e.shiftKey;
    global_mouseEvent.CtrlKey = e.ctrlKey || e.metaKey;
    global_mouseEvent.Type = g_mouse_event_type_move;
    if (!global_mouseEvent.IsLocked) {
        global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;
    }
    if ((Math.abs(global_mouseEvent.X - global_mouseEvent.LastX) > 3) || (Math.abs(global_mouseEvent.Y - global_mouseEvent.LastY) > 3)) {
        global_mouseEvent.LastClickTime = -1;
        global_mouseEvent.ClickCount = 0;
    }
}
function CreateMouseUpEventObject(x, y) {
    var e = new Object();
    e.PageX = x;
    e.PageY = y;
    e.altKey = global_mouseEvent.AltKey;
    e.shiftKey = global_mouseEvent.ShiftKey;
    e.ctrlKey = global_mouseEvent.CtrlKey;
    e.srcElement = global_mouseEvent.Sender;
    e.button = 0;
    return e;
}
function check_MouseUpEvent(e) {
    if (e.pageX || e.pageY) {
        global_mouseEvent.X = e.pageX;
        global_mouseEvent.Y = e.pageY;
    } else {
        if (e.clientX || e.clientY) {
            global_mouseEvent.X = e.clientX;
            global_mouseEvent.Y = e.clientY;
        }
    }
    global_mouseEvent.AltKey = e.altKey;
    global_mouseEvent.ShiftKey = e.shiftKey;
    global_mouseEvent.CtrlKey = e.ctrlKey || e.metaKey;
    global_mouseEvent.Type = g_mouse_event_type_up;
    global_mouseEvent.Button = e.button;
    var lockedElement = null;
    var newSender = (e.srcElement) ? e.srcElement : e.target;
    if (global_mouseEvent.Sender && global_mouseEvent.Sender.id == newSender.id) {
        lockedElement = global_mouseEvent.Sender;
    }
    if (global_mouseEvent.IsLocked == true && global_mouseEvent.Sender != newSender && false === window.g_bIsMouseUpLockedSend) {
        Window_OnMouseUp(e);
    }
    window.g_bIsMouseUpLockedSend = true;
    global_mouseEvent.Sender = newSender;
    global_mouseEvent.UnLockMouse();
    global_mouseEvent.IsPressed = false;
    return lockedElement;
}
function check_MouseDownEvent(e, isClicks) {
    if (e.pageX || e.pageY) {
        global_mouseEvent.X = e.pageX;
        global_mouseEvent.Y = e.pageY;
    } else {
        if (e.clientX || e.clientY) {
            global_mouseEvent.X = e.clientX;
            global_mouseEvent.Y = e.clientY;
        }
    }
    global_mouseEvent.LastX = global_mouseEvent.X;
    global_mouseEvent.LastY = global_mouseEvent.Y;
    global_mouseEvent.AltKey = e.altKey;
    global_mouseEvent.ShiftKey = e.shiftKey;
    global_mouseEvent.CtrlKey = e.ctrlKey || e.metaKey;
    global_mouseEvent.Type = g_mouse_event_type_down;
    global_mouseEvent.Button = e.button;
    global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;
    if (isClicks) {
        var CurTime = new Date().getTime();
        if (0 == global_mouseEvent.ClickCount) {
            global_mouseEvent.ClickCount = 1;
            global_mouseEvent.LastClickTime = CurTime;
        } else {
            if (500 > CurTime - global_mouseEvent.LastClickTime) {
                global_mouseEvent.LastClickTime = CurTime;
                global_mouseEvent.ClickCount++;
            } else {
                global_mouseEvent.ClickCount = 1;
                global_mouseEvent.LastClickTime = CurTime;
            }
        }
    } else {
        global_mouseEvent.LastClickTime = -1;
        global_mouseEvent.ClickCount = 1;
    }
    window.g_bIsMouseUpLockedSend = false;
}
function check_MouseDownEvent2(x, y) {
    global_mouseEvent.X = x;
    global_mouseEvent.Y = y;
    global_mouseEvent.LastX = global_mouseEvent.X;
    global_mouseEvent.LastY = global_mouseEvent.Y;
    global_mouseEvent.Type = g_mouse_event_type_down;
    global_mouseEvent.Sender = editor.WordControl.m_oEditor.HtmlElement;
    global_mouseEvent.LastClickTime = -1;
    global_mouseEvent.ClickCount = 1;
    window.g_bIsMouseUpLockedSend = false;
}
function global_OnMouseWheel(e) {
    global_mouseEvent.AltKey = e.altKey;
    global_mouseEvent.ShiftKey = e.shiftKey;
    global_mouseEvent.CtrlKey = e.ctrlKey || e.metaKey;
    if (undefined != e.wheelDelta) {
        global_mouseEvent.WheelDelta = (e.wheelDelta > 0) ? -45 : 45;
    } else {
        global_mouseEvent.WheelDelta = (e.detail > 0) ? 45 : -45;
    }
    global_mouseEvent.type = g_mouse_event_type_wheel;
    global_mouseEvent.Sender = (e.srcElement) ? e.srcElement : e.target;
    global_mouseEvent.LastClickTime = -1;
    global_mouseEvent.ClickCount = 0;
}
function InitCaptureEvents() {
    window.onmousemove = function (event) {
        return Window_OnMouseMove(event);
    };
    window.onmouseup = function (event) {
        return Window_OnMouseUp(event);
    };
}
function Window_OnMouseMove(e) {
    if (!global_mouseEvent.IsLocked) {
        return;
    }
    if ((undefined != global_mouseEvent.Sender) && (null != global_mouseEvent.Sender) && (undefined != global_mouseEvent.Sender.onmousemove) && (null != global_mouseEvent.Sender.onmousemove)) {
        global_mouseEvent.IsLockedEvent = true;
        global_mouseEvent.Sender.onmousemove(e);
        global_mouseEvent.IsLockedEvent = false;
    }
}
function Window_OnMouseUp(e) {
    if (false === window.g_bIsMouseUpLockedSend) {
        window.g_bIsMouseUpLockedSend = true;
        if (global_mouseEvent.IsLocked) {
            if (undefined != global_mouseEvent.Sender.onmouseup && null != global_mouseEvent.Sender.onmouseup) {
                global_mouseEvent.Sender.onmouseup(e, true);
            }
        }
    }
    if (window.editor !== undefined) {
        editor.WordControl.m_oDrawingDocument.UnlockCursorType();
        editor.WordControl.m_oDrawingDocument.SetCursorType("default");
        if (editor.WordControl.m_oScrollVerApi) {
            editor.WordControl.m_oScrollVerApi.evt_mouseup(e);
        }
        if (editor.WordControl.m_oScrollHorApi) {
            editor.WordControl.m_oScrollHorApi.evt_mouseup(e);
        }
    }
}
InitCaptureEvents();
function button_eventHandlers(disable_pos, norm_pos, over_pos, down_pos, control, click_func_delegate) {
    this.state_normal = norm_pos;
    this.state_over = over_pos;
    this.state_down = down_pos;
    this.Click_func = click_func_delegate;
    this.Control = control;
    this.IsPressed = false;
    var oThis = this;
    this.Control.HtmlElement.onmouseover = function (e) {
        check_MouseMoveEvent(e);
        if (global_mouseEvent.IsLocked) {
            if (global_mouseEvent.Sender.id != oThis.Control.HtmlElement.id) {
                return;
            }
            oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_down;
            return;
        }
        oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
    };
    this.Control.HtmlElement.onmouseout = function (e) {
        check_MouseMoveEvent(e);
        if (global_mouseEvent.IsLocked) {
            if (global_mouseEvent.Sender.id != oThis.Control.HtmlElement.id) {
                return;
            }
            oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
            return;
        }
        oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_normal;
    };
    this.Control.HtmlElement.onmousedown = function (e) {
        check_MouseDownEvent(e);
        global_mouseEvent.LockMouse();
        global_mouseEvent.buttonObject = oThis;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        if (global_mouseEvent.IsLocked) {
            if (global_mouseEvent.Sender.id != oThis.Control.HtmlElement.id) {
                return;
            }
            oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_down;
            return;
        }
        oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_down;
    };
    this.Control.HtmlElement.onmouseup = function (e) {
        var lockedElement = check_MouseUpEvent(e);
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        if (null != lockedElement && global_mouseEvent.buttonObject != null) {
            oThis.Click_func();
        }
        if (null != lockedElement) {
            oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
        } else {
            if (null != global_mouseEvent.buttonObject) {
                global_mouseEvent.buttonObject.Control.HtmlElement.style.backgroundPosition = global_mouseEvent.buttonObject.state_normal;
            }
            if ((global_mouseEvent.buttonObject == null) || (oThis.Control.HtmlElement.id != global_mouseEvent.buttonObject.Control.HtmlElement.id)) {
                oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_over;
            }
        }
        global_mouseEvent.buttonObject = null;
    };
    this.Control.HtmlElement.ontouchstart = function (e) {
        oThis.Control.HtmlElement.onmousedown(e.touches[0]);
        return false;
    };
    this.Control.HtmlElement.ontouchend = function (e) {
        var lockedElement = check_MouseUpEvent(e.changedTouches[0]);
        if (null != lockedElement) {
            oThis.Click_func();
            oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_normal;
        } else {
            if (null != global_mouseEvent.buttonObject) {
                global_mouseEvent.buttonObject.Control.HtmlElement.style.backgroundPosition = global_mouseEvent.buttonObject.state_normal;
            }
            if (oThis.Control.HtmlElement.id != global_mouseEvent.buttonObject.Control.HtmlElement.id) {
                oThis.Control.HtmlElement.style.backgroundPosition = oThis.state_normal;
            }
        }
        global_mouseEvent.buttonObject = null;
        return false;
    };
}
function CTouchManager() {
    this.touches = [];
    this.ScrollY = null;
    this.ScrollH = null;
    this.ScrollHandleV = null;
    this.ScrollHandleH = null;
    this.StartTouches = function (e, scrollX, scrollY) {
        this.ScrollH = scrollX;
        this.ScrollY = scrollY;
        this.touches.splice(0, this.touches.length);
        var len = e.touches.length;
        for (var i = 0; i < len; i++) {
            var _e = e.touches[i];
            if (_e.pageX || _e.pageY) {
                this.touches.push({
                    x: _e.pageX,
                    y: _e.pageY
                });
            } else {
                if (e.clientX || e.clientY) {
                    this.touches.push({
                        x: _e.clientX,
                        y: _e.clientY
                    });
                }
            }
        }
        if (this.touches.length > 1) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
        return true;
    };
    this.MoveTouches = function (e) {
        if (this.touches.length > 1 && e.touches.length > 1) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            var len = Math.min(this.touches.length, e.touches.length);
            var _maxX = 0;
            var _maxY = 0;
            for (var i = 0; i < len; i++) {
                var _e = e.touches[i];
                if (_e.pageX || _e.pageY) {
                    var _x = _e.pageX - this.touches[i].x;
                    var _y = _e.pageY - this.touches[i].y;
                    if (Math.abs(_x) > Math.abs(_maxX)) {
                        _maxX = _x;
                    }
                    if (Math.abs(_y) > Math.abs(_maxY)) {
                        _maxY = _y;
                    }
                } else {
                    if (e.clientX || e.clientY) {
                        var _x = _e.clientX - this.touches[i].x;
                        var _y = _e.clientY - this.touches[i].y;
                        if (Math.abs(_x) > Math.abs(_maxX)) {
                            _maxX = _x;
                        }
                        if (Math.abs(_y) > Math.abs(_maxY)) {
                            _maxY = _y;
                        }
                    }
                }
            }
            if (this.ScrollH === undefined) {
                _maxX = 0;
            }
            if (this.ScrollY === undefined) {
                _maxY = 0;
            }
            if (_maxX != 0 || _maxY != 0) {
                if (Math.abs(_maxX) > Math.abs(_maxY) && null != this.ScrollHandleH) {
                    this.ScrollHandleH(this.ScrollH - _maxX);
                } else {
                    if (null != this.ScrollHandleV) {
                        this.ScrollHandleV(this.ScrollY - _maxY);
                    }
                }
            }
            return false;
        }
        return true;
    };
    this.EndTouches = function (e) {
        if (this.touches.length > 1) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
        this.touches.splice(0, this.touches.length);
        return true;
    };
}
var MobileTouchMode = {
    None: 0,
    Scroll: 1,
    Zoom: 2,
    Select: 3,
    InlineObj: 4,
    FlowObj: 5,
    Cursor: 6,
    TableMove: 7,
    TableRuler: 8
};
function CMobileTouchManager() {
    this.AnimateScroll = false;
    this.AnimateZoom = false;
    this.bIsTextSelected = false;
    this.bIsTextSelecting = false;
    this.LogicDocument = null;
    this.DrawingDocument = null;
    this.HtmlPage = null;
    this.Mode = 0;
    this.ReadingGlassTime = 750;
    this.TimeDown = 0;
    this.DownPoint = null;
    this.DownPointOriginal = {
        X: 0,
        Y: 0
    };
    this.MoveAfterDown = false;
    this.MoveMinDist = 10;
    this.RectSelect1 = null;
    this.RectSelect2 = null;
    this.PageSelect1 = 0;
    this.PageSelect2 = 0;
    this.CheckFirstRect = true;
    this.TrackTargetEps = 20;
    this.ScrollH = 0;
    this.ScrollV = 0;
    this.ZoomDistance = 0;
    this.ZoomValue = 100;
    this.ZoomValueMin = 50;
    this.ZoomValueMax = 300;
    this.iScroll = null;
    this.TableMovePoint = null;
    this.TableHorRulerPoints = null;
    this.TableVerRulerPoints = null;
    this.TableStartTrack_Check = false;
    this.TableRulersRectOffset = 5;
    this.TableRulersRectSize = 20;
    this.TableCurrentMoveDir = -1;
    this.TableCurrentMovePos = -1;
    this.TableCurrentMoveValue = 0;
    this.TableCurrentMoveValueOld = 0;
    this.TableCurrentMoveValueMin = null;
    this.TableCurrentMoveValueMax = null;
    this.ShowMenuTimerId = -1;
    this.Init = function (ctrl) {
        this.HtmlPage = ctrl;
        this.LogicDocument = ctrl.m_oLogicDocument;
        this.DrawingDocument = ctrl.m_oDrawingDocument;
        this.iScroll = new window.CTouchScroll(ctrl, {
            onAnimationEnd: function (param) {
                param.api.MobileTouchManager.OnScrollAnimationEnd();
            }
        });
        LoadMobileImages();
    };
    this.MoveCursorToPoint = function (e) {
        check_MouseMoveEvent(e);
        var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
        var old_click_count = global_mouseEvent.ClickCount;
        global_mouseEvent.ClickCount = 1;
        var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
        this.DrawingDocument.NeedScrollToTargetFlag = true;
        this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
        this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
        this.DrawingDocument.NeedScrollToTargetFlag = false;
        global_mouseEvent.ClickCount = old_click_count;
    };
    this.onTouchStart = function (e) {
        if (null != this.DrawingDocument.m_oDocumentRenderer) {
            return this.onTouchStart_renderer(e);
        }
        check_MouseDownEvent(e.touches ? e.touches[0] : e, true);
        global_mouseEvent.LockMouse();
        this.HtmlPage.m_oApi.asc_fireCallback("asc_onHidePopMenu");
        this.ScrollH = this.HtmlPage.m_dScrollX;
        this.ScrollV = this.HtmlPage.m_dScrollY;
        this.TableCurrentMoveValueMin = null;
        this.TableCurrentMoveValueMax = null;
        this.MoveAfterDown = false;
        this.TimeDown = new Date().getTime();
        var bIsKoefPixToMM = false;
        var _matrix = this.DrawingDocument.TextMatrix;
        if (_matrix && global_MatrixTransformer.IsIdentity(_matrix)) {
            _matrix = null;
        }
        if (null != this.RectSelect1 && null != this.RectSelect2) {
            var pos1 = null;
            var pos4 = null;
            if (!_matrix) {
                pos1 = this.DrawingDocument.ConvertCoordsToCursor3(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
                pos4 = this.DrawingDocument.ConvertCoordsToCursor3(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
            } else {
                var _xx1 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
                var _yy1 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);
                var _xx2 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
                var _yy2 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
                pos1 = this.DrawingDocument.ConvertCoordsToCursor3(_xx1, _yy1, this.PageSelect1);
                pos4 = this.DrawingDocument.ConvertCoordsToCursor3(_xx2, _yy2, this.PageSelect2);
            }
            if (Math.abs(pos1.X - global_mouseEvent.X) < this.TrackTargetEps && Math.abs(pos1.Y - global_mouseEvent.Y) < this.TrackTargetEps) {
                this.Mode = MobileTouchMode.Select;
                this.DragSelect = 1;
            } else {
                if (Math.abs(pos4.X - global_mouseEvent.X) < this.TrackTargetEps && Math.abs(pos4.Y - global_mouseEvent.Y) < this.TrackTargetEps) {
                    this.Mode = MobileTouchMode.Select;
                    this.DragSelect = 2;
                }
            }
        } else {
            var _xOffset = this.HtmlPage.X;
            var _yOffset = this.HtmlPage.Y;
            if (true === this.HtmlPage.m_bIsRuler) {
                _xOffset += (5 * g_dKoef_mm_to_pix);
                _yOffset += (7 * g_dKoef_mm_to_pix);
            }
            var _eps = this.TrackTargetEps;
            var bIsTable = false;
            var _table_outline_dr = this.DrawingDocument.TableOutlineDr;
            if (this.TableMovePoint != null && _table_outline_dr) {
                var _Transform = _table_outline_dr.TableMatrix;
                var _PageNum = _table_outline_dr.CurrentPageIndex;
                if (!_Transform || global_MatrixTransformer.IsIdentity(_Transform)) {
                    var _x = global_mouseEvent.X - _xOffset;
                    var _y = global_mouseEvent.Y - _yOffset;
                    var posLT = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableMovePoint.X, this.TableMovePoint.Y, _PageNum);
                    var _offset = this.TableRulersRectSize + this.TableRulersRectOffset;
                    if (_x > (posLT.X - _offset - _eps) && _x < (posLT.X - this.TableRulersRectOffset + _eps) && _y > (posLT.Y - _offset - _eps) && _y < (posLT.Y - this.TableRulersRectOffset + _eps)) {
                        this.Mode = MobileTouchMode.TableMove;
                        bIsTable = true;
                    }
                    if (!bIsTable) {
                        if (_y > (posLT.Y - _offset - _eps) && _y < (posLT.Y - this.TableRulersRectOffset + _eps)) {
                            var _len = this.TableHorRulerPoints.length;
                            var _indexF = -1;
                            var _minF = 1000000;
                            for (var i = 0; i < _len; i++) {
                                var posM1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableHorRulerPoints[i].C, this.TableMovePoint.Y, _PageNum);
                                var _dist = Math.abs(_x - posM1.X);
                                if (_minF > _dist) {
                                    _indexF = i;
                                    _minF = _dist;
                                }
                            }
                            if (_minF < _eps) {
                                var _p = this.TableHorRulerPoints[_indexF];
                                this.TableCurrentMoveDir = 0;
                                this.TableCurrentMovePos = _indexF;
                                this.TableCurrentMoveValue = _p.X;
                                this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
                                this.Mode = MobileTouchMode.TableRuler;
                                if (_indexF == 0) {
                                    this.TableCurrentMoveValueMin = this.TableMovePoint.X;
                                } else {
                                    this.TableCurrentMoveValueMin = this.TableHorRulerPoints[_indexF - 1].X + this.TableHorRulerPoints[_indexF - 1].W;
                                }
                                if (_indexF < (_len - 1)) {
                                    this.TableCurrentMoveValueMax = this.TableHorRulerPoints[_indexF + 1].X;
                                } else {
                                    this.TableCurrentMoveValueMax = null;
                                }
                                bIsTable = true;
                            }
                        }
                        if (!bIsTable && _x >= (posLT.X - _offset - _eps) && _x <= (posLT.X - this.TableRulersRectOffset + _eps)) {
                            var _len = this.TableVerRulerPoints.length;
                            var _indexF = -1;
                            var _minF = 1000000;
                            for (var i = 0; i < _len; i++) {
                                var posM1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableMovePoint.X, this.TableVerRulerPoints[i].Y, _PageNum);
                                var posM2 = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableMovePoint.X, this.TableVerRulerPoints[i].Y + this.TableVerRulerPoints[i].H, _PageNum);
                                if (_y >= (posM1.Y - _eps) && _y <= (posM2.Y + _eps)) {
                                    var _dist = Math.abs(_y - ((posM1.Y + posM2.Y) / 2));
                                    if (_minF > _dist) {
                                        _indexF = i;
                                        _minF = _dist;
                                    }
                                }
                            }
                            if (_indexF != -1) {
                                var _p = this.TableVerRulerPoints[_indexF];
                                this.TableCurrentMoveDir = 1;
                                this.TableCurrentMovePos = _indexF;
                                this.TableCurrentMoveValue = _p.Y;
                                this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
                                this.Mode = MobileTouchMode.TableRuler;
                                if (_indexF == 0) {
                                    this.TableCurrentMoveValueMin = this.TableMovePoint.Y;
                                } else {
                                    this.TableCurrentMoveValueMin = this.TableVerRulerPoints[_indexF - 1].Y + this.TableVerRulerPoints[_indexF - 1].H;
                                }
                                if (_indexF < (_len - 1)) {
                                    this.TableCurrentMoveValueMax = this.TableVerRulerPoints[_indexF + 1].Y;
                                } else {
                                    this.TableCurrentMoveValueMax = null;
                                }
                                bIsTable = true;
                            }
                        }
                    }
                } else {
                    var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                    if (pos.Page == _PageNum) {
                        var _invert = global_MatrixTransformer.Invert(_Transform);
                        var _posx = _invert.TransformPointX(pos.X, pos.Y);
                        var _posy = _invert.TransformPointY(pos.X, pos.Y);
                        var _koef = g_dKoef_pix_to_mm * 100 / this.HtmlPage.m_nZoomValue;
                        var _eps1 = this.TrackTargetEps * _koef;
                        var _offset1 = this.TableRulersRectOffset * _koef;
                        var _offset2 = _offset1 + this.TableRulersRectSize * _koef;
                        if ((_posx >= (this.TableMovePoint.X - _offset2 - _eps1)) && (_posx <= (this.TableMovePoint.X - _offset1 + _eps1)) && (_posy >= (this.TableMovePoint.Y - _offset2 - _eps1)) && (_posy <= (this.TableMovePoint.Y - _offset1 + _eps1))) {
                            this.Mode = MobileTouchMode.TableMove;
                            bIsTable = true;
                        }
                        if (!bIsTable) {
                            if (_posy > (this.TableMovePoint.Y - _offset2 - _eps1) && _posy < (this.TableMovePoint.Y - _offset1 + _eps1)) {
                                var _len = this.TableHorRulerPoints.length;
                                for (var i = 0; i < _len; i++) {
                                    var _p = this.TableHorRulerPoints[i];
                                    if (_posx > (_p.X - _eps1) && _posx < (_p.X + _p.W + _eps1)) {
                                        this.TableCurrentMoveDir = 0;
                                        this.TableCurrentMovePos = i;
                                        this.TableCurrentMoveValue = this.TableHorRulerPoints[i].X;
                                        this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
                                        this.Mode = MobileTouchMode.TableRuler;
                                        if (i == 0) {
                                            this.TableCurrentMoveValueMin = this.TableMovePoint.X;
                                        } else {
                                            this.TableCurrentMoveValueMin = this.TableHorRulerPoints[i - 1].X + this.TableHorRulerPoints[i - 1].W;
                                        }
                                        if (i < (_len - 1)) {
                                            this.TableCurrentMoveValueMax = this.TableHorRulerPoints[i + 1].X;
                                        } else {
                                            this.TableCurrentMoveValueMax = null;
                                        }
                                        bIsTable = true;
                                        break;
                                    }
                                }
                            }
                            if (!bIsTable && _posx >= (this.TableMovePoint.X - _offset2 - _eps1) && _posx <= (this.TableMovePoint.X - _offset1 + _eps1)) {
                                var _len = this.TableVerRulerPoints.length;
                                for (var i = 0; i < _len; i++) {
                                    var _p = this.TableVerRulerPoints[i];
                                    if (_posy >= (_p.Y - _eps1) && _posy <= (_p.Y + _p.H + _eps1)) {
                                        this.TableCurrentMoveDir = 1;
                                        this.TableCurrentMovePos = i;
                                        this.TableCurrentMoveValue = this.TableVerRulerPoints[i].Y;
                                        this.TableCurrentMoveValueOld = this.TableCurrentMoveValue;
                                        this.Mode = MobileTouchMode.TableRuler;
                                        if (i == 0) {
                                            this.TableCurrentMoveValueMin = this.TableMovePoint.Y;
                                        } else {
                                            this.TableCurrentMoveValueMin = this.TableVerRulerPoints[i - 1].Y + this.TableVerRulerPoints[i - 1].H;
                                        }
                                        if (i < (_len - 1)) {
                                            this.TableCurrentMoveValueMax = this.TableVerRulerPoints[i + 1].Y;
                                        } else {
                                            this.TableCurrentMoveValueMax = null;
                                        }
                                        bIsTable = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!bIsTable) {
                var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                var dKoef = (100 * g_dKoef_pix_to_mm / this.HtmlPage.m_nZoomValue);
                global_mouseEvent.KoefPixToMM = 5;
                if (this.LogicDocument.DrawingObjects.isPointInDrawingObjects2(pos.X, pos.Y, pos.Page)) {
                    bIsKoefPixToMM = true;
                    this.Mode = MobileTouchMode.FlowObj;
                } else {
                    this.Mode = MobileTouchMode.None;
                }
                global_mouseEvent.KoefPixToMM = 1;
            }
        }
        if (e.touches && 2 == e.touches.length) {
            this.Mode = MobileTouchMode.Zoom;
        }
        switch (this.Mode) {
        case MobileTouchMode.None:
            this.Mode = MobileTouchMode.Scroll;
            this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            this.DownPointOriginal.X = global_mouseEvent.X;
            this.DownPointOriginal.Y = global_mouseEvent.Y;
            this.iScroll._start(e);
            break;
        case MobileTouchMode.Scroll:
            this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            this.DownPointOriginal.X = global_mouseEvent.X;
            this.DownPointOriginal.Y = global_mouseEvent.Y;
            this.iScroll._start(e);
            break;
        case MobileTouchMode.Select:
            if (1 == this.DragSelect) {
                global_mouseEvent.Button = 0;
                if (!_matrix) {
                    this.LogicDocument.OnMouseDown(global_mouseEvent, this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h / 2, this.PageSelect2);
                } else {
                    var __X = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h / 2);
                    var __Y = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h / 2);
                    this.LogicDocument.OnMouseDown(global_mouseEvent, __X, __Y, this.PageSelect2);
                }
                var pos1 = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                this.LogicDocument.OnMouseMove(global_mouseEvent, pos1.X, pos1.Y, pos1.Page);
            } else {
                if (2 == this.DragSelect) {
                    global_mouseEvent.Button = 0;
                    if (!_matrix) {
                        this.LogicDocument.OnMouseDown(global_mouseEvent, this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h / 2, this.PageSelect1);
                    } else {
                        var __X = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h / 2);
                        var __Y = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h / 2);
                        this.LogicDocument.OnMouseDown(global_mouseEvent, __X, __Y, this.PageSelect1);
                    }
                    var pos4 = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                    this.LogicDocument.OnMouseMove(global_mouseEvent, pos4.X, pos4.Y, pos4.Page);
                }
            }
            break;
        case MobileTouchMode.InlineObj:
            break;
        case MobileTouchMode.FlowObj:
            if (global_mouseEvent.ClickCount > 0) {
                global_mouseEvent.ClickCount--;
            }
            if (bIsKoefPixToMM) {
                global_mouseEvent.KoefPixToMM = 5;
            }
            this.HtmlPage.onMouseDown(e.touches ? e.touches[0] : e);
            global_mouseEvent.KoefPixToMM = 1;
            break;
        case MobileTouchMode.Zoom:
            this.HtmlPage.NoneRepaintPages = true;
            var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
            var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;
            var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
            var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;
            this.ZoomDistance = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
            this.ZoomValue = this.HtmlPage.m_nZoomValue;
            break;
        case MobileTouchMode.Cursor:
            this.Mode = MobileTouchMode.Scroll;
            this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            break;
        case MobileTouchMode.TableMove:
            if (global_mouseEvent.ClickCount > 0) {
                global_mouseEvent.ClickCount--;
            }
            this.HtmlPage.onMouseDown(e.touches ? e.touches[0] : e);
            break;
        case MobileTouchMode.TableRuler:
            this.HtmlPage.OnUpdateOverlay();
            break;
        }
        if (this.HtmlPage.m_oApi.isViewMode) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
    };
    this.onTouchMove = function (e) {
        if (null != this.DrawingDocument.m_oDocumentRenderer) {
            return this.onTouchMove_renderer(e);
        }
        if (this.Mode != MobileTouchMode.FlowObj && this.Mode != MobileTouchMode.TableMove) {
            check_MouseMoveEvent(e.touches ? e.touches[0] : e);
        }
        if (!this.MoveAfterDown) {
            if (Math.abs(this.DownPointOriginal.X - global_mouseEvent.X) > this.MoveMinDist || Math.abs(this.DownPointOriginal.Y - global_mouseEvent.Y) > this.MoveMinDist) {
                this.MoveAfterDown = true;
            }
        }
        switch (this.Mode) {
        case MobileTouchMode.Cursor:
            var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            var old_click_count = global_mouseEvent.ClickCount;
            global_mouseEvent.ClickCount = 1;
            var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
            this.DrawingDocument.NeedScrollToTargetFlag = true;
            global_mouseEvent.Type = g_mouse_event_type_down;
            this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y + nearPos.Height / 2, pos.Page);
            global_mouseEvent.Type = g_mouse_event_type_up;
            this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y + nearPos.Height / 2, pos.Page);
            this.DrawingDocument.NeedScrollToTargetFlag = false;
            global_mouseEvent.ClickCount = old_click_count;
            break;
        case MobileTouchMode.Scroll:
            var _newTime = new Date().getTime();
            if ((_newTime - this.TimeDown) > this.ReadingGlassTime && !this.MoveAfterDown) {
                this.Mode = MobileTouchMode.Cursor;
                var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                var old_click_count = global_mouseEvent.ClickCount;
                global_mouseEvent.ClickCount = 1;
                var nearPos = this.LogicDocument.Get_NearestPos(pos.Page, pos.X, pos.Y);
                this.DrawingDocument.NeedScrollToTargetFlag = true;
                global_mouseEvent.Type = g_mouse_event_type_down;
                this.LogicDocument.OnMouseDown(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
                global_mouseEvent.Type = g_mouse_event_type_up;
                this.LogicDocument.OnMouseUp(global_mouseEvent, nearPos.X, nearPos.Y, pos.Page);
                this.DrawingDocument.NeedScrollToTargetFlag = false;
                global_mouseEvent.ClickCount = old_click_count;
            } else {
                var _offsetX = global_mouseEvent.X - this.DownPointOriginal.X;
                var _offsetY = global_mouseEvent.Y - this.DownPointOriginal.Y;
                this.iScroll._move(e);
                e.preventDefault();
                e.returnValue = false;
            }
            break;
        case MobileTouchMode.Zoom:
            if (2 != e.touches.length) {
                this.Mode = MobileTouchMode.None;
                return;
            }
            var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
            var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;
            var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
            var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;
            var zoomCurrentDist = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
            if (zoomCurrentDist == 0) {
                zoomCurrentDist = 1;
            }
            var _zoomFix = this.ZoomValue / 100;
            var _zoomCur = _zoomFix * (zoomCurrentDist / this.ZoomDistance);
            _zoomCur = (_zoomCur * 100) >> 0;
            if (_zoomCur < this.ZoomValueMin) {
                _zoomCur = this.ZoomValueMin;
            } else {
                if (_zoomCur > this.ZoomValueMax) {
                    _zoomCur = this.ZoomValueMax;
                }
            }
            this.HtmlPage.m_oApi.zoom(_zoomCur);
            break;
        case MobileTouchMode.InlineObj:
            break;
        case MobileTouchMode.FlowObj:
            this.HtmlPage.onMouseMove(e.touches ? e.touches[0] : e);
            break;
        case MobileTouchMode.Select:
            global_mouseEvent.ClickCount = 1;
            var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            this.LogicDocument.OnMouseMove(global_mouseEvent, pos.X, pos.Y, pos.Page);
            break;
        case MobileTouchMode.TableMove:
            this.HtmlPage.onMouseMove(e.touches ? e.touches[0] : e);
            break;
        case MobileTouchMode.TableRuler:
            var pos = this.DrawingDocument.ConvertCoordsFromCursorPage(global_mouseEvent.X, global_mouseEvent.Y, this.DrawingDocument.TableOutlineDr.CurrentPageIndex);
            var _Transform = null;
            if (this.DrawingDocument.TableOutlineDr) {
                _Transform = this.DrawingDocument.TableOutlineDr.TableMatrix;
            }
            if (_Transform && !global_MatrixTransformer.IsIdentity(_Transform)) {
                var _invert = _Transform.CreateDublicate();
                _invert.Invert();
                var __x = _invert.TransformPointX(pos.X, pos.Y);
                var __y = _invert.TransformPointY(pos.X, pos.Y);
                pos.X = __x;
                pos.Y = __y;
            }
            if (this.TableCurrentMoveDir == 0) {
                this.TableCurrentMoveValue = pos.X;
                if (null != this.TableCurrentMoveValueMin) {
                    if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
                    }
                }
                if (null != this.TableCurrentMoveValueMax) {
                    if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
                    }
                }
            } else {
                this.TableCurrentMoveValue = pos.Y;
                if (null != this.TableCurrentMoveValueMin) {
                    if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
                    }
                }
                if (null != this.TableCurrentMoveValueMax) {
                    if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
                    }
                }
            }
            this.HtmlPage.OnUpdateOverlay();
            break;
        default:
            break;
        }
    };
    this.onTouchEnd = function (e) {
        if (null != this.DrawingDocument.m_oDocumentRenderer) {
            return this.onTouchEnd_renderer(e);
        }
        if (this.Mode != MobileTouchMode.FlowObj && this.Mode != MobileTouchMode.TableMove) {
            check_MouseUpEvent(e.changedTouches ? e.changedTouches[0] : e);
        }
        this.ScrollH = this.HtmlPage.m_dScrollX;
        this.ScrollV = this.HtmlPage.m_dScrollY;
        switch (this.Mode) {
        case MobileTouchMode.Cursor:
            this.Mode = MobileTouchMode.None;
            break;
        case MobileTouchMode.Scroll:
            if (!this.MoveAfterDown) {
                global_mouseEvent.Button = 0;
                var pos = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
                this.LogicDocument.OnMouseDown(global_mouseEvent, pos.X, pos.Y, pos.Page);
                global_mouseEvent.Type = g_mouse_event_type_up;
                this.LogicDocument.OnMouseUp(global_mouseEvent, pos.X, pos.Y, pos.Page);
                this.LogicDocument.Document_UpdateInterfaceState();
                var horRuler = this.HtmlPage.m_oHorRuler;
                var _oldRulerType = horRuler.CurrentObjectType;
                this.LogicDocument.Document_UpdateRulersState();
                if (horRuler.CurrentObjectType != _oldRulerType) {
                    this.HtmlPage.OnUpdateOverlay();
                }
                this.LogicDocument.Update_CursorType(pos.X, pos.Y, pos.Page, global_mouseEvent);
                this.HtmlPage.m_oApi.asc_fireCallback("asc_onTapEvent", e);
            } else {
                this.iScroll._end(e);
            }
            this.Mode = MobileTouchMode.None;
            break;
        case MobileTouchMode.Zoom:
            this.HtmlPage.NoneRepaintPages = false;
            this.HtmlPage.m_bIsFullRepaint = true;
            this.HtmlPage.OnScroll();
            this.Mode = MobileTouchMode.None;
            break;
        case MobileTouchMode.InlineObj:
            break;
        case MobileTouchMode.FlowObj:
            this.HtmlPage.onMouseUp(e.changedTouches ? e.changedTouches[0] : e);
            this.Mode = MobileTouchMode.None;
            break;
        case MobileTouchMode.Select:
            this.DragSelect = 0;
            this.Mode = MobileTouchMode.None;
            break;
        case MobileTouchMode.TableMove:
            this.HtmlPage.onMouseUp(e.changedTouches ? e.changedTouches[0] : e);
            this.Mode = MobileTouchMode.None;
            break;
        case MobileTouchMode.TableRuler:
            this.HtmlPage.StartUpdateOverlay();
            this.Mode = MobileTouchMode.None;
            var _xOffset = this.HtmlPage.X;
            var _yOffset = this.HtmlPage.Y;
            if (true === this.HtmlPage.m_bIsRuler) {
                _xOffset += (5 * g_dKoef_mm_to_pix);
                _yOffset += (7 * g_dKoef_mm_to_pix);
            }
            var pos = this.DrawingDocument.ConvertCoordsFromCursorPage(global_mouseEvent.X, global_mouseEvent.Y, this.DrawingDocument.TableOutlineDr.CurrentPageIndex);
            var _Transform = null;
            if (this.DrawingDocument.TableOutlineDr) {
                _Transform = this.DrawingDocument.TableOutlineDr.TableMatrix;
            }
            if (_Transform && !global_MatrixTransformer.IsIdentity(_Transform)) {
                var _invert = _Transform.CreateDublicate();
                _invert.Invert();
                var __x = _invert.TransformPointX(pos.X, pos.Y);
                var __y = _invert.TransformPointY(pos.X, pos.Y);
                pos.X = __x;
                pos.Y = __y;
            }
            if (this.TableCurrentMoveDir == 0) {
                this.TableCurrentMoveValue = pos.X;
                if (null != this.TableCurrentMoveValueMin) {
                    if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
                    }
                }
                if (null != this.TableCurrentMoveValueMax) {
                    if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
                    }
                }
                var _markup = this.HtmlPage.m_oHorRuler.m_oTableMarkup;
                _markup.Cols[this.TableCurrentMovePos] += (this.TableCurrentMoveValue - this.TableCurrentMoveValueOld);
                _markup.Cols[this.TableCurrentMovePos] = Math.max(_markup.Cols[this.TableCurrentMovePos], 1);
                _markup.Table.Update_TableMarkupFromRuler(_markup, true, this.TableCurrentMovePos + 1);
            } else {
                this.TableCurrentMoveValue = pos.Y;
                if (null != this.TableCurrentMoveValueMin) {
                    if (this.TableCurrentMoveValueMin > this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMin;
                    }
                }
                if (null != this.TableCurrentMoveValueMax) {
                    if (this.TableCurrentMoveValueMax < this.TableCurrentMoveValue) {
                        this.TableCurrentMoveValue = this.TableCurrentMoveValueMax;
                    }
                }
                var _markup = this.HtmlPage.m_oHorRuler.m_oTableMarkup;
                _markup.Rows[this.TableCurrentMovePos].H += (this.TableCurrentMoveValue - this.TableCurrentMoveValueOld);
                _markup.Table.Update_TableMarkupFromRuler(_markup, false, this.TableCurrentMovePos + 1);
            }
            this.HtmlPage.OnUpdateOverlay();
            this.HtmlPage.EndUpdateOverlay();
            break;
        default:
            break;
        }
        this.iScroll._scrollbar("h");
        this.iScroll._scrollbar("v");
        if (this.HtmlPage.m_oApi.isViewMode) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return false;
        }
        this.CheckSelectEnd(true);
    };
    this.onTouchStart_renderer = function (e) {
        check_MouseDownEvent(e.touches ? e.touches[0] : e, true);
        global_mouseEvent.LockMouse();
        this.ScrollH = this.HtmlPage.m_dScrollX;
        this.ScrollV = this.HtmlPage.m_dScrollY;
        this.MoveAfterDown = false;
        if (e.touches && 2 == e.touches.length) {
            this.Mode = MobileTouchMode.Zoom;
        }
        switch (this.Mode) {
        case MobileTouchMode.None:
            this.Mode = MobileTouchMode.Scroll;
            this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            this.DownPointOriginal.X = global_mouseEvent.X;
            this.DownPointOriginal.Y = global_mouseEvent.Y;
            this.iScroll._start(e);
            break;
        case MobileTouchMode.Scroll:
            this.DownPoint = this.DrawingDocument.ConvertCoordsFromCursor2(global_mouseEvent.X, global_mouseEvent.Y);
            this.DownPointOriginal.X = global_mouseEvent.X;
            this.DownPointOriginal.Y = global_mouseEvent.Y;
            this.iScroll._start(e);
            break;
        case MobileTouchMode.Zoom:
            this.HtmlPage.NoneRepaintPages = true;
            var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
            var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;
            var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
            var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;
            this.ZoomDistance = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
            this.ZoomValue = this.HtmlPage.m_nZoomValue;
            break;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    };
    this.onTouchMove_renderer = function (e) {
        check_MouseMoveEvent(e.touches ? e.touches[0] : e);
        if (!this.MoveAfterDown) {
            if (Math.abs(this.DownPointOriginal.X - global_mouseEvent.X) > this.MoveMinDist || Math.abs(this.DownPointOriginal.Y - global_mouseEvent.Y) > this.MoveMinDist) {
                this.MoveAfterDown = true;
            }
        }
        switch (this.Mode) {
        case MobileTouchMode.Scroll:
            var _offsetX = global_mouseEvent.X - this.DownPointOriginal.X;
            var _offsetY = global_mouseEvent.Y - this.DownPointOriginal.Y;
            this.iScroll._move(e);
            break;
        case MobileTouchMode.Zoom:
            if (2 != e.touches.length) {
                this.Mode = MobileTouchMode.None;
                return;
            }
            var _x1 = (e.touches[0].pageX !== undefined) ? e.touches[0].pageX : e.touches[0].clientX;
            var _y1 = (e.touches[0].pageY !== undefined) ? e.touches[0].pageY : e.touches[0].clientY;
            var _x2 = (e.touches[1].pageX !== undefined) ? e.touches[1].pageX : e.touches[1].clientX;
            var _y2 = (e.touches[1].pageY !== undefined) ? e.touches[1].pageY : e.touches[1].clientY;
            var zoomCurrentDist = Math.sqrt((_x1 - _x2) * (_x1 - _x2) + (_y1 - _y2) * (_y1 - _y2));
            if (zoomCurrentDist == 0) {
                zoomCurrentDist = 1;
            }
            var _zoomFix = this.ZoomValue / 100;
            var _zoomCur = _zoomFix * (zoomCurrentDist / this.ZoomDistance);
            _zoomCur = (_zoomCur * 100) >> 0;
            if (_zoomCur < this.ZoomValueMin) {
                _zoomCur = this.ZoomValueMin;
            } else {
                if (_zoomCur > this.ZoomValueMax) {
                    _zoomCur = this.ZoomValueMax;
                }
            }
            this.HtmlPage.m_oApi.zoom(_zoomCur);
            break;
        default:
            break;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    };
    this.onTouchEnd_renderer = function (e) {
        check_MouseUpEvent(e.changedTouches ? e.changedTouches[0] : e);
        this.ScrollH = this.HtmlPage.m_dScrollX;
        this.ScrollV = this.HtmlPage.m_dScrollY;
        switch (this.Mode) {
        case MobileTouchMode.Scroll:
            this.iScroll._end(e);
            this.Mode = MobileTouchMode.None;
            if (!this.MoveAfterDown) {
                this.HtmlPage.m_oApi.asc_fireCallback("asc_onTapEvent", e);
            }
            break;
        case MobileTouchMode.Zoom:
            this.HtmlPage.NoneRepaintPages = false;
            this.HtmlPage.m_bIsFullRepaint = true;
            this.HtmlPage.OnScroll();
            this.Mode = MobileTouchMode.None;
            break;
        default:
            break;
        }
        this.iScroll._scrollbar("h");
        this.iScroll._scrollbar("v");
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    };
    this.CheckSelectEnd = function (bIsAttack) {
        var _bIsRet = false;
        if (!bIsAttack) {
            _bIsRet = this.IsTrackingCurrent;
        }
        if (_bIsRet) {
            return;
        }
        if (null != this.RectSelect1 && null != this.RectSelect2 && !this.HtmlPage.m_oApi.isViewMode) {
            var _matrix = this.DrawingDocument.TextMatrix;
            var pos1 = null;
            var pos4 = null;
            if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix)) {
                pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
                pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
            } else {
                var _x1 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
                var _y1 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);
                var _x2 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
                var _y2 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
                pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_x1, _y1, this.PageSelect1);
                pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_x2, _y2, this.PageSelect2);
            }
            var _x = (pos1.X + pos4.X) >> 1;
            var _y = pos1.Y;
            if (!this.iScroll.animating) {
                this.SendShowMenu(_x, _y);
            }
        }
    };
    this.CheckZoomCriticalValues = function (zoomMin) {
        if (zoomMin !== undefined) {
            this.ZoomValueMin = zoomMin;
            return;
        }
        var w = this.HtmlPage.m_oEditor.AbsolutePosition.R - this.HtmlPage.m_oEditor.AbsolutePosition.L;
        var Zoom = 100;
        if (0 != this.HtmlPage.m_dDocumentPageWidth) {
            Zoom = 100 * (w - 10) / this.HtmlPage.m_dDocumentPageWidth;
            if (Zoom < 5) {
                Zoom = 5;
            }
            if (this.HtmlPage.m_oApi.isMobileVersion) {
                var _w = this.HtmlPage.m_oEditor.HtmlElement.width;
                if (this.bIsRetinaSupport) {
                    _w >>= 1;
                }
                Zoom = 100 * _w * g_dKoef_pix_to_mm / this.HtmlPage.m_dDocumentPageWidth;
            }
        }
        var _new_value = (Zoom - 0.5) >> 0;
        this.ZoomValueMin = _new_value;
        if (this.ZoomValue < this.ZoomValueMin) {
            this.ZoomValue = this.ZoomValueMin;
            this.HtmlPage.m_oApi.zoom(this.ZoomValue);
        }
    };
    this.Resize = function () {
        if (this.iScroll != null) {
            this.iScroll.refresh(true);
        }
    };
    this.SendShowMenu = function (x, y) {
        if (-1 != this.ShowMenuTimerId) {
            clearTimeout(this.ShowMenuTimerId);
        }
        var that = this;
        that.ShowMenuTimerId = setTimeout(function () {
            that.HtmlPage.m_oApi.asc_fireCallback("asc_onShowPopMenu", x, y);
        },
        500);
    };
    this.OnScrollAnimationEnd = function () {
        if (this.HtmlPage.m_oApi.isViewMode) {
            return;
        }
        if (null != this.RectSelect1 && null != this.RectSelect2) {
            var pos1 = null;
            var pos4 = null;
            var _matrix = this.DrawingDocument.TextMatrix;
            if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix)) {
                pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
                pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
            } else {
                var _x1 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
                var _y1 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);
                var _x2 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
                var _y2 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
                pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_x1, _y1, this.PageSelect1);
                pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_x2, _y2, this.PageSelect2);
            }
            var _x = (pos1.X + pos4.X) >> 1;
            var _y = pos1.Y;
            this.SendShowMenu(_x, _y);
        }
    };
    this.CheckSelect = function (overlay) {
        if (null == this.RectSelect1 || null == this.RectSelect2) {
            return;
        }
        var _matrix = this.DrawingDocument.TextMatrix;
        if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix)) {
            var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
            var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h, this.PageSelect1);
            var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y, this.PageSelect2);
            var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
            var ctx = overlay.m_oContext;
            ctx.strokeStyle = "#1B63BA";
            ctx.moveTo(pos1.X >> 0, pos1.Y >> 0);
            ctx.lineTo(pos2.X >> 0, pos2.Y >> 0);
            ctx.moveTo(pos3.X >> 0, pos3.Y >> 0);
            ctx.lineTo(pos4.X >> 0, pos4.Y >> 0);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            overlay.AddEllipse(pos1.X, pos1.Y - 5, 6.5);
            overlay.AddEllipse(pos4.X, pos4.Y + 5, 6.5);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";
            overlay.AddEllipse(pos1.X, pos1.Y - 5, 6);
            overlay.AddEllipse(pos4.X, pos4.Y + 5, 6);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#1B63BA";
            overlay.AddEllipse(pos1.X, pos1.Y - 5, 5);
            overlay.AddEllipse(pos4.X, pos4.Y + 5, 5);
            ctx.fill();
        } else {
            var _xx11 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
            var _yy11 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);
            var _xx12 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h);
            var _yy12 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h);
            var _xx21 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y);
            var _yy21 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y);
            var _xx22 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
            var _yy22 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
            var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx11, _yy11, this.PageSelect1);
            var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx12, _yy12, this.PageSelect1);
            var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx21, _yy21, this.PageSelect2);
            var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx22, _yy22, this.PageSelect2);
            var ctx = overlay.m_oContext;
            ctx.strokeStyle = "#1B63BA";
            ctx.moveTo(pos1.X, pos1.Y);
            ctx.lineTo(pos2.X, pos2.Y);
            ctx.moveTo(pos3.X, pos3.Y);
            ctx.lineTo(pos4.X, pos4.Y);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            overlay.AddEllipse(pos1.X, pos1.Y - 5, 6.5);
            overlay.AddEllipse(pos4.X, pos4.Y + 5, 6.5);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";
            overlay.AddEllipse(pos1.X, pos1.Y - 5, 6);
            overlay.AddEllipse(pos4.X, pos4.Y + 5, 6);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#1B63BA";
            overlay.AddEllipse(pos1.X, pos1.Y - 5, 5);
            overlay.AddEllipse(pos4.X, pos4.Y + 5, 5);
            ctx.fill();
        }
    };
    this.CheckSelect2 = function (overlay) {
        if (null == this.RectSelect1 || null == this.RectSelect2) {
            return;
        }
        var _matrix = this.DrawingDocument.TextMatrix;
        if (!_matrix || global_MatrixTransformer.IsIdentity(_matrix)) {
            var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y, this.PageSelect1);
            var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h, this.PageSelect1);
            var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y, this.PageSelect2);
            var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h, this.PageSelect2);
            var ctx = overlay.m_oContext;
            ctx.strokeStyle = "#1B63BA";
            ctx.moveTo(pos1.X >> 0, pos1.Y >> 0);
            ctx.lineTo(pos2.X >> 0, pos2.Y >> 0);
            ctx.moveTo(pos3.X >> 0, pos3.Y >> 0);
            ctx.lineTo(pos4.X >> 0, pos4.Y >> 0);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            if (!window.g_table_track_round.asc_complete) {
                return;
            }
            var _w = window.g_table_track_round.width;
            var _h = window.g_table_track_round.height;
            var _x1 = (pos1.X - (_w / 2)) >> 0;
            var _y1 = (pos1.Y - 5 - (_h / 2)) >> 0;
            var _x2 = (pos4.X - (_w / 2)) >> 0;
            var _y2 = (pos4.Y + 5 - (_h / 2)) >> 0;
            ctx.drawImage(window.g_table_track_round, _x1, _y1);
            ctx.drawImage(window.g_table_track_round, _x2, _y2);
            overlay.CheckRect(_x1, _y1, _w, _h);
            overlay.CheckRect(_x2, _y2, _w, _h);
        } else {
            var _xx11 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y);
            var _yy11 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y);
            var _xx12 = _matrix.TransformPointX(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h);
            var _yy12 = _matrix.TransformPointY(this.RectSelect1.x, this.RectSelect1.y + this.RectSelect1.h);
            var _xx21 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y);
            var _yy21 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y);
            var _xx22 = _matrix.TransformPointX(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
            var _yy22 = _matrix.TransformPointY(this.RectSelect2.x + this.RectSelect2.w, this.RectSelect2.y + this.RectSelect2.h);
            var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx11, _yy11, this.PageSelect1);
            var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx12, _yy12, this.PageSelect1);
            var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx21, _yy21, this.PageSelect2);
            var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_xx22, _yy22, this.PageSelect2);
            var ctx = overlay.m_oContext;
            ctx.strokeStyle = "#1B63BA";
            ctx.moveTo(pos1.X, pos1.Y);
            ctx.lineTo(pos2.X, pos2.Y);
            ctx.moveTo(pos3.X, pos3.Y);
            ctx.lineTo(pos4.X, pos4.Y);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            if (!window.g_table_track_round.asc_complete) {
                return;
            }
            var ex01 = _matrix.TransformPointX(0, 0);
            var ey01 = _matrix.TransformPointY(0, 0);
            var ex11 = _matrix.TransformPointX(0, 1);
            var ey11 = _matrix.TransformPointY(0, 1);
            var _len = Math.sqrt((ex11 - ex01) * (ex11 - ex01) + (ey11 - ey01) * (ey11 - ey01));
            if (_len == 0) {
                _len = 0.01;
            }
            var ex = 5 * (ex11 - ex01) / _len;
            var ey = 5 * (ey11 - ey01) / _len;
            var _w = window.g_table_track_round.width;
            var _h = window.g_table_track_round.height;
            var _x1 = (pos1.X - ex - (_w / 2)) >> 0;
            var _y1 = (pos1.Y - ey - (_h / 2)) >> 0;
            var _x2 = (pos4.X + ex - (_w / 2)) >> 0;
            var _y2 = (pos4.Y + ey - (_h / 2)) >> 0;
            ctx.drawImage(window.g_table_track_round, _x1, _y1);
            ctx.drawImage(window.g_table_track_round, _x2, _y2);
            overlay.CheckRect(_x1, _y1, _w, _h);
            overlay.CheckRect(_x2, _y2, _w, _h);
        }
    };
    this.CheckTableRules = function (overlay) {
        if (this.HtmlPage.m_oApi.isViewMode) {
            return;
        }
        var horRuler = this.HtmlPage.m_oHorRuler;
        var verRuler = this.HtmlPage.m_oVerRuler;
        var _table_outline_dr = this.DrawingDocument.TableOutlineDr;
        var _tableOutline = _table_outline_dr.TableOutline;
        if (horRuler.CurrentObjectType != RULER_OBJECT_TYPE_TABLE || verRuler.CurrentObjectType != RULER_OBJECT_TYPE_TABLE || !_tableOutline) {
            this.TableMovePoint = null;
            this.TableHorRulerPoints = null;
            this.TableVerRulerPoints = null;
            return;
        }
        var _table_markup = horRuler.m_oTableMarkup;
        this.HtmlPage.CheckShowOverlay();
        var _epsRects = this.TableRulersRectOffset;
        var _rectWidth = this.TableRulersRectSize;
        var ctx = overlay.m_oContext;
        ctx.fillStyle = "#F0F0F0";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        var _tableW = 0;
        var _cols = _table_markup.Cols;
        for (var i = 0; i < _cols.length; i++) {
            _tableW += _cols[i];
        }
        if (!_table_outline_dr.TableMatrix || global_MatrixTransformer.IsIdentity(_table_outline_dr.TableMatrix)) {
            this.TableMovePoint = {
                X: _tableOutline.X,
                Y: _tableOutline.Y
            };
            var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _tableOutline.Y, _tableOutline.PageNum);
            var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X + _tableW, _tableOutline.Y, _tableOutline.PageNum);
            ctx.beginPath();
            var TableMoveRect_x = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
            var TableMoveRect_y = (pos1.Y >> 0) + 0.5 - (_epsRects + _rectWidth);
            overlay.AddRect(TableMoveRect_x, TableMoveRect_y, _rectWidth, _rectWidth);
            overlay.AddRect((pos1.X >> 0) + 0.5, TableMoveRect_y, (pos2.X - pos1.X) >> 0, _rectWidth);
            var _count = _table_markup.Rows.length;
            var _y1 = 0;
            var _y2 = 0;
            for (var i = 0; i < _count; i++) {
                if (i == 0) {
                    _y1 = _table_markup.Rows[i].Y;
                }
                _y2 = _table_markup.Rows[i].Y;
                _y2 += _table_markup.Rows[i].H;
            }
            var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y1, this.DrawingDocument.m_lCurrentPage);
            var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y2, this.DrawingDocument.m_lCurrentPage);
            overlay.AddRect((pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth), (pos3.Y >> 0) + 0.5, _rectWidth, (pos4.Y - pos3.Y) >> 0);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#0000FF";
            var dKoef = (this.HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);
            var xDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.left;
            var yDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.top;
            var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;
            this.TableVerRulerPoints = [];
            var _rectIndex = 0;
            var _x = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
            for (var i = 1; i <= _count; i++) {
                var _newPos = (i != _count) ? _table_markup.Rows[i].Y : _oldY;
                var _p = {
                    Y: _oldY,
                    H: (_newPos - _oldY)
                };
                var _r_x = _x;
                var _r_y = ((yDst + dKoef * _oldY) >> 0) + 0.5;
                var _r_h = ((_newPos - _oldY) * dKoef) >> 0;
                overlay.AddRect(_r_x, _r_y, _rectWidth, _r_h);
                this.TableVerRulerPoints[_rectIndex++] = _p;
                if (i != _count) {
                    _oldY = _table_markup.Rows[i].Y + _table_markup.Rows[i].H;
                }
            }
            this.TableHorRulerPoints = [];
            _rectIndex = 0;
            var _col = _table_markup.X;
            for (var i = 1; i <= _cols.length; i++) {
                _col += _cols[i - 1];
                var _x = _col - _table_markup.Margins[i - 1].Right;
                var _r = _col + ((i == _cols.length) ? 0 : _table_markup.Margins[i].Left);
                var __x = ((xDst + dKoef * _x) >> 0) + 0.5;
                var __r = ((xDst + dKoef * _r) >> 0) + 0.5;
                overlay.AddRect(__x, TableMoveRect_y, __r - __x, _rectWidth);
                this.TableHorRulerPoints[_rectIndex++] = {
                    X: _x,
                    W: _r - _x,
                    C: _col
                };
            }
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            if (this.Mode == MobileTouchMode.TableRuler) {
                if (0 == this.TableCurrentMoveDir) {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex);
                    overlay.VertLine(_pos.X, true);
                } else {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex);
                    overlay.HorLine(_pos.Y, true);
                }
            }
        } else {
            var dKoef = (this.HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);
            var xDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.left;
            var yDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.top;
            ctx.lineWidth = 1 / dKoef;
            var _coord_transform = new CMatrix();
            _coord_transform.sx = dKoef;
            _coord_transform.sy = dKoef;
            _coord_transform.tx = xDst;
            _coord_transform.ty = yDst;
            _coord_transform.Multiply(_table_outline_dr.TableMatrix, MATRIX_ORDER_PREPEND);
            ctx.setTransform(_coord_transform.sx, _coord_transform.shy, _coord_transform.shx, _coord_transform.sy, _coord_transform.tx, _coord_transform.ty);
            this.TableMovePoint = {
                X: _tableOutline.X,
                Y: _tableOutline.Y
            };
            ctx.beginPath();
            var _rectW = _rectWidth / dKoef;
            var _offset = (_epsRects + _rectWidth) / dKoef;
            ctx.rect(this.TableMovePoint.X - _offset, this.TableMovePoint.Y - _offset, _rectW, _rectW);
            ctx.rect(this.TableMovePoint.X, this.TableMovePoint.Y - _offset, _tableW, _rectW);
            var _count = _table_markup.Rows.length;
            var _y1 = 0;
            var _y2 = 0;
            for (var i = 0; i < _count; i++) {
                if (i == 0) {
                    _y1 = _table_markup.Rows[i].Y;
                }
                _y2 = _table_markup.Rows[i].Y;
                _y2 += _table_markup.Rows[i].H;
            }
            ctx.rect(this.TableMovePoint.X - _offset, this.TableMovePoint.Y, _rectW, _y2 - _y1);
            overlay.CheckRectT(this.TableMovePoint.X, this.TableMovePoint.Y, _tableW, _y2 - _y1, _coord_transform, 2 * (_epsRects + _rectWidth));
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.fillStyle = "#FFFFFF";
            ctx.strokeStyle = "#0000FF";
            var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;
            _oldY -= _table_outline_dr.TableMatrix.ty;
            this.TableVerRulerPoints = [];
            var _rectIndex = 0;
            var _xx = this.TableMovePoint.X - _offset;
            for (var i = 1; i <= _count; i++) {
                var _newPos = (i != _count) ? (_table_markup.Rows[i].Y - _table_outline_dr.TableMatrix.ty) : _oldY;
                var _p = {
                    Y: _oldY,
                    H: (_newPos - _oldY)
                };
                ctx.rect(_xx, _p.Y, _rectW, _p.H);
                this.TableVerRulerPoints[_rectIndex++] = _p;
                if (i != _count) {
                    _oldY = _table_markup.Rows[i].Y + _table_markup.Rows[i].H;
                    _oldY -= _table_outline_dr.TableMatrix.ty;
                }
            }
            this.TableHorRulerPoints = [];
            _rectIndex = 0;
            var _col = this.TableMovePoint.X;
            for (var i = 1; i <= _cols.length; i++) {
                _col += _cols[i - 1];
                var _x = _col - _table_markup.Margins[i - 1].Right;
                var _r = _col + ((i == _cols.length) ? 0 : _table_markup.Margins[i].Left);
                ctx.rect(_x, this.TableMovePoint.Y - _offset, _r - _x, _rectW);
                this.TableHorRulerPoints[_rectIndex++] = {
                    X: _x,
                    W: _r - _x,
                    C: _col
                };
            }
            ctx.fill();
            ctx.stroke();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            if (this.Mode == MobileTouchMode.TableRuler) {
                if (0 == this.TableCurrentMoveDir) {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
                    overlay.VertLine(_pos.X, true);
                } else {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
                    overlay.HorLine(_pos.Y, true);
                }
            }
        }
    };
    this.CheckTableRules2 = function (overlay) {
        if (this.HtmlPage.m_oApi.isViewMode) {
            return;
        }
        var horRuler = this.HtmlPage.m_oHorRuler;
        var verRuler = this.HtmlPage.m_oVerRuler;
        var _table_outline_dr = this.DrawingDocument.TableOutlineDr;
        var _tableOutline = _table_outline_dr.TableOutline;
        if (horRuler.CurrentObjectType != RULER_OBJECT_TYPE_TABLE || verRuler.CurrentObjectType != RULER_OBJECT_TYPE_TABLE || !_tableOutline) {
            this.TableMovePoint = null;
            this.TableHorRulerPoints = null;
            this.TableVerRulerPoints = null;
            return;
        }
        if (!window.g_table_track_mobile_move.asc_complete || !window.g_table_track_round.asc_complete || !window.g_table_track_diamond.asc_complete) {
            return;
        }
        var _table_markup = horRuler.m_oTableMarkup;
        this.HtmlPage.CheckShowOverlay();
        var _epsRects = this.TableRulersRectOffset;
        var _rectWidth = this.TableRulersRectSize;
        var ctx = overlay.m_oContext;
        ctx.strokeStyle = "#616161";
        ctx.lineWidth = 1;
        var _tableW = 0;
        var _cols = _table_markup.Cols;
        for (var i = 0; i < _cols.length; i++) {
            _tableW += _cols[i];
        }
        if (!_table_outline_dr.TableMatrix || global_MatrixTransformer.IsIdentity(_table_outline_dr.TableMatrix)) {
            this.TableMovePoint = {
                X: _tableOutline.X,
                Y: _tableOutline.Y
            };
            var pos1 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _tableOutline.Y, _tableOutline.PageNum);
            var pos2 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X + _tableW, _tableOutline.Y, _tableOutline.PageNum);
            ctx.beginPath();
            var TableMoveRect_x = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
            var TableMoveRect_y = (pos1.Y >> 0) + 0.5 - (_epsRects + _rectWidth);
            overlay.CheckPoint(TableMoveRect_x, TableMoveRect_y);
            overlay.CheckPoint(TableMoveRect_x + _rectWidth, TableMoveRect_y + _rectWidth);
            ctx.drawImage(window.g_table_track_mobile_move, TableMoveRect_x, TableMoveRect_y);
            var gradObj = ctx.createLinearGradient((pos1.X >> 0) + 0.5, TableMoveRect_y, (pos1.X >> 0) + 0.5, TableMoveRect_y + _rectWidth);
            gradObj.addColorStop(0, "#f1f1f1");
            gradObj.addColorStop(1, "#dfdfdf");
            ctx.fillStyle = gradObj;
            overlay.AddRoundRect((pos1.X >> 0) + 0.5, TableMoveRect_y, (pos2.X - pos1.X) >> 0, _rectWidth, 4);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            var _count = _table_markup.Rows.length;
            var _y1 = 0;
            var _y2 = 0;
            for (var i = 0; i < _count; i++) {
                if (i == 0) {
                    _y1 = _table_markup.Rows[i].Y;
                }
                _y2 = _table_markup.Rows[i].Y;
                _y2 += _table_markup.Rows[i].H;
            }
            var pos3 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y1, this.DrawingDocument.m_lCurrentPage);
            var pos4 = this.DrawingDocument.ConvertCoordsToCursorWR(_tableOutline.X, _y2, this.DrawingDocument.m_lCurrentPage);
            var _ttX = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
            gradObj = ctx.createLinearGradient(_ttX, (pos3.Y >> 0) + 0.5, _ttX, (pos3.Y >> 0) + 0.5 + (pos4.Y - pos3.Y) >> 0);
            gradObj.addColorStop(0, "#f1f1f1");
            gradObj.addColorStop(1, "#dfdfdf");
            ctx.fillStyle = gradObj;
            overlay.AddRoundRect((pos1.X >> 0) + 1.5 - (_epsRects + _rectWidth), (pos3.Y >> 0) + 0.5, _rectWidth - 1, (pos4.Y - pos3.Y) >> 0, 4);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            var ___w = window.g_table_track_diamond.width;
            var ___h = window.g_table_track_diamond.height;
            var dKoef = (this.HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);
            var xDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.left;
            var yDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.top;
            var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;
            this.TableVerRulerPoints = [];
            var _rectIndex = 0;
            var _x = (pos1.X >> 0) + 0.5 - (_epsRects + _rectWidth);
            for (var i = 1; i <= _count; i++) {
                var _newPos = (i != _count) ? _table_markup.Rows[i].Y : _oldY;
                var _p = {
                    Y: _oldY,
                    H: (_newPos - _oldY)
                };
                var _r_x = _x;
                var _r_y = ((yDst + dKoef * _oldY) >> 0) + 0.5;
                var _r_h = ((_newPos - _oldY) * dKoef) >> 0;
                var xImage = (_r_x + 1) >> 0;
                var yImage = (_r_y + (_r_h / 2) - (___h / 2)) >> 0;
                overlay.CheckRect(xImage, yImage, ___w, ___h);
                ctx.drawImage(window.g_table_track_diamond, xImage, yImage);
                this.TableVerRulerPoints[_rectIndex++] = _p;
                if (i != _count) {
                    _oldY = _table_markup.Rows[i].Y + _table_markup.Rows[i].H;
                }
            }
            this.TableHorRulerPoints = [];
            _rectIndex = 0;
            var _col = _table_markup.X;
            for (var i = 1; i <= _cols.length; i++) {
                _col += _cols[i - 1];
                var _x = _col - _table_markup.Margins[i - 1].Right;
                var _r = _col + ((i == _cols.length) ? 0 : _table_markup.Margins[i].Left);
                var __x = ((xDst + dKoef * _x) >> 0) + 0.5;
                var __r = ((xDst + dKoef * _r) >> 0) + 0.5;
                var __c = ((xDst + dKoef * _col) >> 0) + 0.5;
                var xImage = (__c - (___w / 2)) >> 0;
                var yImage = (TableMoveRect_y + 1) >> 0;
                overlay.CheckRect(xImage, yImage, ___w, ___h);
                ctx.drawImage(window.g_table_track_diamond, xImage, yImage);
                this.TableHorRulerPoints[_rectIndex++] = {
                    X: _x,
                    W: _r - _x,
                    C: _col
                };
            }
            ctx.beginPath();
            if (this.Mode == MobileTouchMode.TableRuler) {
                if (0 == this.TableCurrentMoveDir) {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex);
                    overlay.VertLine(_pos.X, true);
                } else {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex);
                    overlay.HorLine(_pos.Y, true);
                }
            }
        } else {
            var dKoef = (this.HtmlPage.m_nZoomValue * g_dKoef_mm_to_pix / 100);
            var xDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.left;
            var yDst = this.DrawingDocument.m_arrPages[this.DrawingDocument.m_lCurrentPage].drawingPage.top;
            ctx.lineWidth = 1 / dKoef;
            var _coord_transform = new CMatrix();
            _coord_transform.sx = dKoef;
            _coord_transform.sy = dKoef;
            _coord_transform.tx = xDst;
            _coord_transform.ty = yDst;
            _coord_transform.Multiply(_table_outline_dr.TableMatrix, MATRIX_ORDER_PREPEND);
            ctx.setTransform(_coord_transform.sx, _coord_transform.shy, _coord_transform.shx, _coord_transform.sy, _coord_transform.tx, _coord_transform.ty);
            this.TableMovePoint = {
                X: _tableOutline.X,
                Y: _tableOutline.Y
            };
            ctx.beginPath();
            var _rectW = _rectWidth / dKoef;
            var _offset = (_epsRects + _rectWidth) / dKoef;
            ctx.drawImage(window.g_table_track_mobile_move, this.TableMovePoint.X - _offset, this.TableMovePoint.Y - _offset, _rectW, _rectW);
            var gradObj = ctx.createLinearGradient(this.TableMovePoint.X, this.TableMovePoint.Y - _offset, this.TableMovePoint.X, this.TableMovePoint.Y - _offset + _rectW);
            gradObj.addColorStop(0, "#f1f1f1");
            gradObj.addColorStop(1, "#dfdfdf");
            ctx.fillStyle = gradObj;
            overlay.AddRoundRectCtx(ctx, this.TableMovePoint.X, this.TableMovePoint.Y - _offset, _tableW, _rectW, 5 / dKoef);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            var _count = _table_markup.Rows.length;
            var _y1 = 0;
            var _y2 = 0;
            for (var i = 0; i < _count; i++) {
                if (i == 0) {
                    _y1 = _table_markup.Rows[i].Y;
                }
                _y2 = _table_markup.Rows[i].Y;
                _y2 += _table_markup.Rows[i].H;
            }
            gradObj = ctx.createLinearGradient(this.TableMovePoint.X - _offset, this.TableMovePoint.Y, this.TableMovePoint.X - _offset, this.TableMovePoint.X - _offset + _y2 - _y1);
            gradObj.addColorStop(0, "#f1f1f1");
            gradObj.addColorStop(1, "#dfdfdf");
            ctx.fillStyle = gradObj;
            overlay.AddRoundRectCtx(ctx, this.TableMovePoint.X - _offset, this.TableMovePoint.Y, _rectW, _y2 - _y1, 5 / dKoef);
            overlay.CheckRectT(this.TableMovePoint.X, this.TableMovePoint.Y, _tableW, _y2 - _y1, _coord_transform, 2 * (_epsRects + _rectWidth));
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            var _oldY = _table_markup.Rows[0].Y + _table_markup.Rows[0].H;
            _oldY -= _table_outline_dr.TableMatrix.ty;
            var ___w = window.g_table_track_diamond.width;
            var ___h = window.g_table_track_diamond.height;
            this.TableVerRulerPoints = [];
            var _rectIndex = 0;
            var _xx = this.TableMovePoint.X - _offset;
            for (var i = 1; i <= _count; i++) {
                var _newPos = (i != _count) ? (_table_markup.Rows[i].Y - _table_outline_dr.TableMatrix.ty) : _oldY;
                var _p = {
                    Y: _oldY,
                    H: (_newPos - _oldY)
                };
                var ___y = (_p.Y + (_p.H / 2) - ((___h / dKoef) / 2));
                ctx.drawImage(window.g_table_track_diamond, _xx, ___y, ___w / dKoef, ___h / dKoef);
                this.TableVerRulerPoints[_rectIndex++] = _p;
                if (i != _count) {
                    _oldY = _table_markup.Rows[i].Y + _table_markup.Rows[i].H;
                    _oldY -= _table_outline_dr.TableMatrix.ty;
                }
            }
            this.TableHorRulerPoints = [];
            _rectIndex = 0;
            var _col = this.TableMovePoint.X;
            for (var i = 1; i <= _cols.length; i++) {
                _col += _cols[i - 1];
                var _x = _col - _table_markup.Margins[i - 1].Right;
                var _r = _col + ((i == _cols.length) ? 0 : _table_markup.Margins[i].Left);
                var ___x = (_col - ((___w / dKoef) / 2));
                ctx.drawImage(window.g_table_track_diamond, ___x, (this.TableMovePoint.Y - _offset), ___w / dKoef, ___h / dKoef);
                this.TableHorRulerPoints[_rectIndex++] = {
                    X: _x,
                    W: _r - _x,
                    C: _col
                };
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.beginPath();
            if (this.Mode == MobileTouchMode.TableRuler) {
                if (0 == this.TableCurrentMoveDir) {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TableCurrentMoveValue, 0, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
                    overlay.VertLine(_pos.X, true);
                } else {
                    var _pos = this.DrawingDocument.ConvertCoordsToCursorWR(0, this.TableCurrentMoveValue, _table_outline_dr.CurrentPageIndex, _table_outline_dr.TableMatrix);
                    overlay.HorLine(_pos.Y, true);
                }
            }
        }
    };
}
function CReaderTouchManager() {
    this.HtmlPage = null;
    this.iScroll = null;
    this.bIsLock = false;
    this.bIsMoveAfterDown = false;
    this.Init = function (ctrl) {
        this.HtmlPage = ctrl;
        this.LogicDocument = ctrl.m_oLogicDocument;
        this.DrawingDocument = ctrl.m_oDrawingDocument;
        this.iScroll = new window.CTouchScroll(ctrl, {
            bounce: true
        },
        this.HtmlPage.ReaderModeDiv);
        this.HtmlPage.m_oApi.asc_fireCallback("asc_onHidePopMenu");
    };
    this.onTouchStart = function (e) {
        this.iScroll._start(e);
        this.bIsLock = true;
        this.bIsMoveAfterDown = false;
    };
    this.onTouchMove = function (e) {
        if (!this.bIsLock) {
            return;
        }
        this.iScroll._move(e);
        this.bIsMoveAfterDown = true;
    };
    this.onTouchEnd = function (e) {
        this.iScroll._end(e);
        this.bIsLock = false;
        if (this.bIsMoveAfterDown === false) {
            this.HtmlPage.m_oApi.asc_fireCallback("asc_onTapEvent", e);
        }
    };
    this.Resize = function () {
        this.HtmlPage.ReaderModeDivWrapper.style.width = this.HtmlPage.m_oMainView.HtmlElement.style.width;
        this.HtmlPage.ReaderModeDivWrapper.style.height = this.HtmlPage.m_oMainView.HtmlElement.style.height;
        if (this.iScroll != null) {
            this.iScroll.refresh();
            this.iScroll._pos(this.iScroll.x, this.iScroll.y, false);
        }
    };
    this.ChangeFontSize = function () {
        if (this.iScroll != null) {
            this.iScroll.refresh();
            this.iScroll._pos(this.iScroll.x, this.iScroll.y, false);
        }
    };
    this.Destroy = function () {
        if (this.iScroll != null) {
            this.iScroll.destroy();
        }
    };
}
function LoadMobileImages() {
    window.g_table_track_mobile_move = new Image();
    window.g_table_track_mobile_move.asc_complete = false;
    window.g_table_track_mobile_move.onload = function () {
        window.g_table_track_mobile_move.asc_complete = true;
    };
    window.g_table_track_mobile_move.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArlJREFUeNqMlc9rWkEQx8ffGqMJBJpSUEIISInxpCfT1krioQQ85xISEKGBkGuhpxwEL4GAoOBJ8V9IxJCQ1l4SkFKxQvEfKEXQ0Nb4IxLtfBefvMeriQPj7ps377Mzu7OjZjgckoYlGo2+tFqtcZ1OFyAiG00nfx8eHj7f3d19SKfTP5g11LBRs7u761lYWPiytbVl9/l8ZDKZpqL1ej0qlUp0enr6p9FovM5kMhU92w02my0OmN/vJ0TcbreJVxZzCH9ARqORQqGQCurxeAC2n52dxfkxDOCMXq9/5fV6aTAYEIc/BkHYkWKx2Ni2ubn5X+j5+fkbweIf5GdFmoAhMkny+TzF43GyWCzi+ejoSIA3NjYUQA4IA5xMmGnhBO33+4rowuEwbW9vKz7Gdtzf36uiHH2n1eJQkCoE0WFeKBTE2O12qdlsKhQ2vLu6uhKjXMHSyuhivLi4oEQiQVLUk/T4+JiKxaLCJtKXQNDLy0tKJpM0NzcnrThR4HNyciLm6+vraiAEB8P1KE9hoqCMzGYzGQwG4asASoZAIEDz8/OUSqWeBGLxg4MDWl1dHe+rKkKUDWpqf3//SeDh4SG5XC5x6nKGYg+lW+J2u6nT6TwKBEzuo0pZPiJSyPX1NWWz2bFdy1UWiUQIt0rykUSe8pDrr837MCMvakgwGCSHw0G5XE487+3t0dLSkip6FDozumABOODVvt3c3PiXl5cVjq1Wi1ZWVmhnZ0dcL6fTqYoMUqlUYP8Klg7dhlNp3N7evuM7a0DZcE9UrL64uEh2u318APJ35XIZl6HN0I/1er2GfmhkfcGb/JYP4/3s7OwaL2Ceph/yvnU5i+/VajVVq9U+semnaLCjTvGM9TkuAaKesmP3WX+z/mKts3Y00l/ACDIzamfa0UKPCU4QR9tDEwIcfwH/BBgAl4G4NBf6Z6AAAAAASUVORK5CYII=";
    window.g_table_track_round = new Image();
    window.g_table_track_round.asc_complete = false;
    window.g_table_track_round.onload = function () {
        window.g_table_track_round.asc_complete = true;
    };
    window.g_table_track_round.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmlJREFUeNp8k01oE0EUx9/uZjdxtQlpU9Acc2mL2lMOKhgQlCAU8ZSDeBFMoWc95ODJY80ht7YxF1MUIQcrfvQQsIdSESQBay2JtClVaIsbljZfJpPdGd/EiUYTfeTHbGbn/995b95IjDEYEMeQKHIVGUX2kSVkESG9C6W/DSild4ktPci8I7BaaINZozDqluHyGRWuBZ2gSHRGluX5gQaWZd3ZO5Ti0YUKfDH7tzV+SoL5qBt8J1hUUZQUn5O7L3O5nIfYSvz2XHmgmEdhn8FMsoyfVR4mk0mVzzk628CoVCrTmbdHsGtYIKsa/Cs+fSWwnK9BJBK5gbJ0dweKqqrh1Y0Kmsnw/5BgZf0INE2b4hk4xCwf/XvfjoC0XCBT2lnYHwwoqcGBQbHYHj/XdQ3URqNh+HQy0arWQNY86K3066kNdusQRvQhqNfr5V4DqVgsrl2a9IVerq2D7GpinVw425MOo8CsBtCmCeHgecjn8ys8hc4xYjGGAoHA2Gbh8/vQdAY2dr+DpLlRr/GKo9jGXxMYqcLFyWFYTlwHl8t5lhCy0/1Eu1Qqma9ePE8+m52C034bWuYWNM1twRb+34YLYxo8vh+GdPrRLIqrvHVANJJDtOy5VCq12LZs9uT1B3Yz9pRdiabYrXsZtvRmk1HKWCKRmMN1QWSEn143BV5ylzAJ6Lo+HovFwqFQaMLr9R43DKOazWY/xuPxrG3bRVyzg/Aitn61svSzAfglGuZHipxEvAjvqhZiikt1IJ6bqKV/3AVh4kR0xC1GpZMrQB2piZFw8cDbKNKRRV0c4tkWcCOsxG/RDwEGALPnFhI3WYx7AAAAAElFTkSuQmCC";
    window.g_table_track_diamond = new Image();
    window.g_table_track_diamond.asc_complete = false;
    window.g_table_track_diamond.onload = function () {
        window.g_table_track_diamond.asc_complete = true;
    };
    window.g_table_track_diamond.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmdJREFUeNqck0toE1EUQO9MakqbKi5CqyIIIm0hDUTIQuhGKtSqIEQRXIjZda92Iemu6iJGdKFWhCI2JJhAVi2ouJBuulKXXWgM2OYzNb8Z8898cr2vHT9pZhLxwWF493OYefMuICL04ArxXn92re2a1DTtliBp6F0s4WZeQ9r7/kumKMqcIGo4fU/E8ZtFPL0g4mZORYrPm/XwYLBUVZ3LV7jA9SdF2CrgTmxbQvA+lSAjcXcpP2/Ux5uLREiKlrbcdokHL8XNhPy/in4LyxZTIW/0aWaiXkKOHZwgCMe4geFv1x6lIClZgbNYoddCTYaRoSaEbhyFQZDG7Hb7F56jlclk+gBbIFey0CwLoNR/gCrXQVWanVCc5VmdXM5SmwbpdHof8+x8ptvtzubTnx9EfU440l+AppQEpSaB2qiC2qz/gfYszvJ2Sw4iPgdU84nHLpcr1XZmTqdz+cP6u1exO5Nw2FaCBjU0q0WQ62WQScKebN+QUmDvlyC2MAkbn9ZiDodj6ZeDnTSn0xeJRLbcJycO3p6dGVtd24CCWAatBdDSVHqzCqjVHIzYarByfxo+rr997fF4FqkvTZTYP9wdg13pfuIEcS4UCq2msmWcuBpE29QyDp2Noe1MEEcvv8RESsJoNPqG6i4Qo8QB9iJt42Qo/F7C8UvP0XrqIR6/+IxEoqmoYzb3CsPh8EqShFOzQfyaLHYVGQ76HuFMIBBYisfjCb/f/4L2581EDE4XtC26Mkw4SAwTh3R5hV1+IkvUqE/t6DOS/SUc0KVsJBSiSjSMRF1lupDX7yITa0SL6ltm9T8FGADChEYX8dVTaAAAAABJRU5ErkJggg==";
}