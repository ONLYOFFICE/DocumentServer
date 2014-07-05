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
 Ext.define("PE.view.DockableTabPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.pedockabletabpanel",
    requires: ["PE.view.UndockedWindow"],
    draggable: true,
    tolerance: 5,
    layout: "card",
    constructor: function (config) {
        this.controls = [];
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.tools = [{
            type: "pin",
            qtip: this.textUndock,
            handler: function () {
                var pos = me.ownerCt.ownerCt.getPosition();
                if (me.actionConfig) {
                    me.undock.apply(me, [me.actionConfig.undockPos[0], me.actionConfig.undockPos[1]]);
                } else {
                    me.undock.apply(me, [pos[0] - 20, pos[1] + 10]);
                }
            },
            scope: me
        }];
        me.addEvents("docked", "undocked");
        me.callParent(arguments);
    },
    initDraggable: function () {
        var me = this;
        me.draggable = {
            delegate: me.getHeader().getEl(),
            tolerance: 100,
            constrain: true,
            constrainTo: document.body,
            listeners: {
                dragstart: function () {
                    me.startDragPos = me.getPosition(true);
                },
                dragend: function () {
                    var owner_pos = me.ownerCt.getPosition(),
                    pos = me.getPosition(true);
                    if (pos[0] < owner_pos[0] - 20) {
                        var calcSizeObj = me.getPanelSize.apply(me);
                        me.hide();
                        Ext.defer(me.undock, 5, me, [pos[0], pos[1], false, null, calcSizeObj]);
                    } else {
                        me.setPosition(me.startDragPos);
                    }
                }
            }
        };
        if (me.tabButtons) {
            me.getHeader().insert(0, me.tabButtons);
        }
        Ext.Component.prototype.initDraggable.call(me);
    },
    dock: function (suspend) {
        var me = this,
        ownerCt, size, win;
        if (me.dockConfig) {
            ownerCt = me.dockConfig.ownerCt;
            win = me.dockConfig.win;
            size = me.dockConfig.size;
            win.remove(me, false);
            if (me.tabButtons) {
                me.getHeader().insert(0, me.tabButtons);
            }
            me.getHeader().show();
            me.setSize(size);
            ownerCt.add(me);
            win.hide();
            delete me.dockConfig;
            if (!suspend) {
                me.fireEvent("docked", me);
            }
        }
    },
    getPanelSize: function () {
        return {
            size: this.getSize(),
            bodySize: this.body.getSize(),
            header: this.getHeader().getHeight()
        };
    },
    undock: function (x, y, suspend, ownerWidth, calcSizeObj) {
        var me = this,
        ownerCt = me.ownerCt,
        ownerPos = (ownerCt) ? ownerCt.ownerCt.getPosition() : [0, 0],
        ctWidth = (ownerWidth > 0) ? ownerWidth : ownerCt.ownerCt.getWidth(),
        size = (calcSizeObj) ? calcSizeObj.size : me.getSize(),
        bodySize = (calcSizeObj) ? calcSizeObj.bodySize : me.body.getSize(),
        header = (calcSizeObj) ? calcSizeObj.header : me.getHeader().getHeight();
        if (me.dockConfig) {
            return;
        }
        size.width = ctWidth;
        bodySize.width = ctWidth;
        ownerCt.remove(me, false);
        me.show();
        me.getHeader().hide();
        me.setPosition(0, 0);
        if (me.isVisible()) {
            me.setSize(bodySize);
            me.body.setSize(bodySize);
        } else {
            me.setWidth(ctWidth);
        }
        if (me.win === undefined) {
            me.win = Ext.create("PE.view.UndockedWindow", {
                items: me,
                title: me.title,
                tools: [{
                    type: "pin",
                    qtip: me.textRedock,
                    handler: function () {
                        me.dock();
                    }
                }],
                listeners: {
                    move: function (cmp, x, y) {
                        var xy = ownerCt.getPosition();
                        if (ownerCt.isVisible(true)) {
                            if ((xy[0] - x) <= me.tolerance) {
                                Ext.defer(me.dock, 10, me);
                            }
                        }
                    },
                    afterrender: function () {
                        me.win.dd.addListener("dragend", Ext.bind(function () {
                            var xy = me.win.getPosition();
                            me.actionConfig = {
                                undockPos: [xy[0], xy[1]]
                            };
                            me.fireEvent("changeposition", me);
                        },
                        this), this);
                    }
                }
            });
        } else {
            me.win.add(me);
        }
        if (me.tabButtons) {
            me.win.getHeader().insert(0, me.tabButtons);
        }
        me.dockConfig = {
            ownerCt: ownerCt,
            win: me.win,
            size: size,
            headerHeight: header
        };
        me.win.show();
        if (Ext.isNumber(x) && Ext.isNumber(y)) {
            var pos = this.checkWindowPosition({
                x: x,
                y: y
            },
            {
                width: me.win.getWidth(),
                height: me.win.getHeight()
            });
            me.win.setPagePosition(pos.x, (pos.y + me.win.getHeight() > Ext.getBody().getSize().height) ? 0 : pos.y);
            me.actionConfig = {
                undockPos: [pos.x, pos.y]
            };
        }
        ownerCt.doLayout();
        me.doLayout();
        if (!suspend) {
            me.fireEvent("undocked", me, ownerPos, ctWidth);
        }
    },
    isUndocked: function () {
        return typeof this.dockConfig !== "undefined";
    },
    checkWindowPosition: function (position, size) {
        var bodypos = Ext.getBody().getSize();
        if (position.x > bodypos.width - 10) {
            position.x = Math.max(bodypos.width - 10 - size.width, 0);
        } else {
            if (position.x < 0) {
                position.x = 10;
            }
        }
        if (position.y > bodypos.height - 10) {
            position.y = Math.max(bodypos.height - 10 - size.height, 0);
        } else {
            if (position.y < 0) {
                position.y = 10;
            }
        }
        return position;
    },
    textRedock: "Redock to original panel",
    textUndock: "Undock panel"
});