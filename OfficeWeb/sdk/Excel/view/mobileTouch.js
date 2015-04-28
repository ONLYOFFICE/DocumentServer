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
    this.ctrl = null;
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
    this.longTapFlag = false;
    this.longTapTimer = -1;
    this.mylatesttap = null;
    this.zoomFactor = 1;
    this.wasZoom = false;
    this.canZoom = true;
    this.wasMove = false;
}
CMobileTouchManager.prototype = {
    Init: function (ctrl) {
        this.ctrl = ctrl;
        this.iScroll = new window.CTouchScroll(ctrl, {
            hScrollbar: true,
            vScrollbar: true,
            momentum: false
        });
    },
    MoveCursorToPoint: function (e) {
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
    },
    onTouchStart: function (e) {
        this.longTapFlag = true;
        this.wasMove = false;
        var thas = this,
        evt = e,
        point = arguments[0].touches ? arguments[0].touches[0] : arguments[0];
        function longTapDetected() {
            if (thas.longTapFlag) {
                alert("clientX " + point.clientX + " clientY " + point.clientY);
            }
            thas.longTapFlag = false;
            clearInterval(this.longTapTimer);
        }
        this.DownPointOriginal.X = point.clientX;
        this.DownPointOriginal.Y = point.clientY;
        this.iScroll._start(e);
        e.preventDefault();
        e.returnValue = false;
        return false;
    },
    onTouchMove: function (e) {
        this.longTapFlag = false;
        this.wasMove = true;
        this.iScroll._move(e);
        e.preventDefault();
        e.returnValue = false;
        return false;
    },
    onTouchEnd: function (e) {
        this.longTapFlag = false;
        this.iScroll._end(e);
        var now = new Date().getTime(),
        point = e.changedTouches ? e.changedTouches[0] : e;
        if (Math.abs(this.DownPointOriginal.X - point.clientX) < this.ctrl.controller.settings.hscrollStep && Math.abs(this.DownPointOriginal.Y - point.clientY) < this.ctrl.controller.settings.vscrollStep) {
            this.ctrl.handlers.trigger("asc_onTapEvent", e);
        }
        e.preventDefault();
        e.returnValue = false;
        this.wasMove = false;
        return;
    },
    onTouchStart_renderer: function (e) {
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
    },
    onTouchMove_renderer: function (e) {
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
    },
    onTouchEnd_renderer: function (e) {
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
    },
    CheckSelectEnd: function (bIsAttack) {
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
    },
    CheckZoomCriticalValues: function (zoomMin) {
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
    },
    Resize: function () {
        if (this.iScroll != null) {
            this.iScroll.refresh(true);
        }
    },
    SendShowMenu: function (x, y) {
        if (-1 != this.ShowMenuTimerId) {
            clearTimeout(this.ShowMenuTimerId);
        }
        var that = this;
        that.ShowMenuTimerId = setTimeout(function () {
            that.HtmlPage.m_oApi.asc_fireCallback("asc_onShowPopMenu", x, y);
        },
        500);
    },
    OnScrollAnimationEnd: function () {
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
    },
    CheckSelect: function (overlay) {
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
    },
    CheckSelect2: function (overlay) {
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
    },
    CheckTableRules: function (overlay) {
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
    },
    CheckTableRules2: function (overlay) {
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
    }
};