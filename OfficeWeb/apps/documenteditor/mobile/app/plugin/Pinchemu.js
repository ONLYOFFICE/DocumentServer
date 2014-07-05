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
 Ext.define("DE.plugin.Pinchemu", {
    extend: "Ext.Component",
    alias: "plugin.pinchemu",
    config: {
        helpers: true
    },
    init: function (cmp) {
        var self = this;
        self.touchHelpers = [];
        self.touchHelpers[0] = Ext.create("Ext.Button", {
            top: 0,
            left: 0,
            style: "opacity: 0.6;",
            iconMask: true,
            round: true,
            hidden: true
        });
        self.touchHelpers[1] = Ext.create("Ext.Button", {
            top: 0,
            left: 0,
            style: "opacity: 0.6;",
            iconMask: true,
            round: true,
            hidden: true
        });
        Ext.Viewport.add(self.touchHelpers[0]);
        Ext.Viewport.add(self.touchHelpers[1]);
        self.cmp = cmp;
        self.cmp.on({
            scope: self,
            painted: self.initPinchsim
        });
    },
    initPinchsim: function () {
        var self = this;
        this.pinchStarted = false;
        var item = self.cmp;
        if (!item.pinchSimEnabled) {
            if (item.rendered) {
                self.initHandlers(item);
            } else {
                item.on({
                    painted: self.initHandlers
                });
            }
        }
    },
    initHandlers: function (item) {
        var self = this;
        item.element.on({
            scope: self,
            touchstart: function (ev) {
                if ((ev.event.ctrlKey || ev.event.shiftKey) && self.pinchStarted === false) {
                    self.pinchStarted = true;
                    if (ev.event.ctrlKey) {
                        self.zoomStart = 100;
                        self.zoomDirection = 1;
                    } else {
                        if (ev.event.shiftKey) {
                            self.zoomStart = 340;
                            self.zoomDirection = -1;
                        }
                    }
                    self.zoomFactor = 1;
                    self.onTouchStart(item, ev);
                }
            },
            touchend: function (ev) {
                if (self.pinchStarted) {
                    self.pinchStarted = false;
                    self.onTouchEnd(item, ev);
                }
            },
            touchcancel: function (ev) {
                if (self.pinchStarted) {
                    self.pinchStarted = false;
                    self.onTouchEnd(item, ev);
                }
            },
            touchmove: function (ev) {
                if ((ev.event.ctrlKey || ev.event.shiftKey) && this.pinchStarted === true) {
                    self.onTouchMove(item, ev);
                } else {
                    if (self.pinchStarted) {
                        self.pinchStarted = false;
                        self.onTouchEnd(item, ev);
                    }
                }
            }
        });
        item.pinchSimEnabled = true;
    },
    showHelpers: function (ev) {
        var touches = ev.touches;
        if (typeof touches === "object" && this.getHelpers()) {
            this.moveHelpers(touches);
            this.setHelpersArrows(ev);
            this.touchHelpers[0].show();
            this.touchHelpers[1].show();
        }
    },
    setHelpersArrows: function (ev) {
        if (ev.event.ctrlKey) {
            this.touchHelpers[0].setIconCls("arrow_right");
            this.touchHelpers[1].setIconCls("arrow_left");
        } else {
            this.touchHelpers[0].setIconCls("arrow_left");
            this.touchHelpers[1].setIconCls("arrow_right");
        }
    },
    moveHelpers: function (touches) {
        this.touchHelpers[0].setTop(touches[0].point.y);
        this.touchHelpers[0].setLeft(touches[0].point.x);
        this.touchHelpers[1].setTop(touches[1].point.y);
        this.touchHelpers[1].setLeft(touches[1].point.x);
    },
    hideHelpers: function () {
        this.touchHelpers[0].hide();
        this.touchHelpers[1].hide();
    },
    convertEvent: function (ev) {
        var self = this;
        var touches = Array.prototype.slice.call(ev.touches);
        if (!touches) {
            touches = self.lastTouches;
        }
        ev.touches = touches;
        if (touches.length > 0) {
            if (!self.touchStartPoint) {
                var startX = touches[0].point.x;
                var startY = touches[0].point.y;
                var startPageX = touches[0].pageX;
                var startPageY = touches[0].pageY;
                touches[0].point.x = touches[0].point.x + self.zoomStart / 2;
                touches[0].pageX = touches[0].pageX + self.zoomStart / 2;
                touches[1] = {};
                touches[1].identifier = 2;
                touches[1].pageX = startPageX - self.zoomStart / 2;
                touches[1].pageY = startPageY;
                touches[1].point = touches[0].point.clone();
                touches[1].point.x = startX - self.zoomStart / 2;
                touches[1].point.y = touches[0].point.y;
                touches[1].target = touches[0].target;
                touches[1].targets = touches[0].targets;
                touches[1].timeStamp = touches[0].timeStamp;
                this.touchStartPoint = {
                    x: startX,
                    y: startY,
                    pageX: startPageX,
                    pageY: startPageY,
                    distance: touches[0].point.getDistanceTo(touches[1].point)
                };
            } else {
                touches[0].point = self.lastTouches[0].point.clone();
                touches[0].point.x = Ext.Number.constrain(self.lastTouches[0].point.x + self.zoomFactor * self.zoomDirection, self.touchStartPoint.x + self.zoomFactor);
                touches[0].pageX = Ext.Number.constrain(self.lastTouches[0].pageX + self.zoomFactor * self.zoomDirection, self.touchStartPoint.x + self.zoomFactor);
                touches[1] = {};
                touches[1].point = self.lastTouches[1].point.clone();
                touches[1].point.x = Ext.Number.constrain(self.lastTouches[1].point.x - self.zoomFactor * self.zoomDirection, self.touchStartPoint.x + self.zoomFactor);
                touches[1].pageX = Ext.Number.constrain(self.lastTouches[1].pageX - self.zoomFactor * self.zoomDirection, self.touchStartPoint.x + self.zoomFactor);
                touches[1].pageY = self.lastTouches[1].pageY;
                touches[1].target = touches[0].target;
                touches[1].targets = touches[0].targets;
                touches[1].timeStamp = touches[0].timeStamp;
            }
            self.lastTouches = touches;
        }
        ev.scale = self.getNewScale(ev);
        return ev;
    },
    getNewScale: function (ev) {
        var self = this;
        if (ev.touches.length > 0) {
            var newDistance = ev.touches[0].point.getDistanceTo(ev.touches[1].point);
            self.lastScale = newDistance / self.touchStartPoint.distance;
            return self.lastScale;
        } else {
            return self.lastScale;
        }
    },
    onTouchStart: function () {
        this.lastScale = 1;
        var ev = this.convertEvent(arguments[1]);
        this.showHelpers(ev);
    },
    onTouchMove: function () {
        var ev = this.convertEvent(arguments[1]);
        this.lastTouches = Array.prototype.slice.call(ev.touches);
        this.moveHelpers(ev.touches);
    },
    onTouchEnd: function () {
        var ev = this.convertEvent(arguments[1]);
        this.hideHelpers();
        this.touchStartPoint = null;
        this.lastTouches = null;
        this.lastScale = null;
    }
});