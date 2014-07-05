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
 Ext.define("DE.view.DockablePanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.dedockablepanel",
    requires: ["DE.view.UndockedWindow"],
    draggable: true,
    tolerance: 5,
    bodyPadding: "0 0 0 15px",
    listeners: {
        show: function (cmp) {
            if (cmp.dockConfig && !cmp.dockConfig.isVisible) {
                var size = cmp.getSize();
                var header = cmp.ownerCt.getHeader().getSize();
                cmp.dockConfig.isVisible = true;
                cmp.dockConfig.size.height = size.height;
                cmp.setHeight(size.height - header.height);
            }
        }
    },
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
                        me.undock.apply(me, pos);
                    } else {
                        me.setPosition(me.startDragPos);
                    }
                }
            }
        };
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
            me.getHeader().show();
            me.setSize(size);
            ownerCt.add(me);
            win.destroy();
            delete me.dockConfig;
            if (!suspend) {
                me.fireEvent("docked", me);
            }
        }
    },
    undock: function (x, y, suspend, ownerWidth) {
        var me = this,
        ownerCt = me.ownerCt,
        ownerPos = (ownerCt) ? ownerCt.ownerCt.getPosition() : [0, 0],
        size = me.getSize(),
        bodySize = me.body.getSize(),
        ctWidth = (ownerWidth > 0) ? ownerWidth : ownerCt.ownerCt.getWidth(),
        win,
        isVisible = me.isVisible();
        if (me.dockConfig) {
            return;
        }
        size.width = ctWidth;
        bodySize.width = ctWidth;
        ownerCt.remove(me, false);
        me.getHeader().hide();
        me.setPosition(0, 0);
        if (isVisible) {
            me.setSize(bodySize);
        } else {
            me.setWidth(ctWidth);
        }
        win = Ext.create("DE.view.UndockedWindow", {
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
                    win.dd.addListener("dragend", Ext.bind(function () {
                        var xy = win.getPosition();
                        me.actionConfig = {
                            undockPos: [xy[0], xy[1]]
                        };
                        me.fireEvent("changeposition", me);
                    },
                    this), this);
                }
            }
        });
        me.dockConfig = {
            ownerCt: ownerCt,
            win: win,
            size: size,
            isVisible: isVisible
        };
        win.show();
        if (Ext.isNumber(x) && Ext.isNumber(y)) {
            var pos = this.checkWindowPosition({
                x: x,
                y: y
            },
            {
                width: win.getWidth(),
                height: win.getHeight()
            });
            win.setPagePosition(pos.x, pos.y);
            me.actionConfig = {
                undockPos: [pos.x, pos.y]
            };
        }
        ownerCt.doLayout();
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
    SuspendEvents: function () {
        for (var i = 0; i < this.controls.length; i++) {
            this.controls[i].suspendEvents(false);
        }
    },
    ResumeEvents: function () {
        for (var i = 0; i < this.controls.length; i++) {
            this.controls[i].resumeEvents();
        }
    },
    textRedock: "Redock to original panel"
});