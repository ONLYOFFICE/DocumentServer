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
 Ext.define("Common.view.Participants", {
    extend: "Ext.container.Container",
    alias: "widget.statusinfoparticipants",
    requires: ["Ext.form.Label", "Ext.toolbar.Spacer", "Ext.Img"],
    layout: {
        type: "hbox",
        align: "middle"
    },
    height: 27,
    width: 80,
    hidden: true,
    config: {
        pack: "start"
    },
    constructor: function (config) {
        if (this.layout && config) {
            this.layout.pack = config.pack;
        }
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        this.btnUsers = Ext.widget("button", {
            text: "1",
            cls: "asc-statusinfo-text-btn",
            iconCls: Ext.isDefined(this.userIconCls) ? this.userIconCls : "icon-statusinfo-users",
            listeners: {
                click: function () {
                    var cmp = Ext.getCmp("view-main-menu");
                    var btn = Ext.getCmp("id-menu-chat");
                    if (cmp && btn) {
                        if (btn.pressed) {
                            btn.toggle(false);
                        } else {
                            cmp.selectMenu("menuChat");
                        }
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.tipUsers,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        this.items = [{
            xtype: "tbseparator",
            width: 2,
            height: 27,
            style: "padding-top:2px;",
            html: '<div style="width: 100%; height: 100%; border-left: 1px solid rgba(0, 0, 0, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.5);"></div>'
        },
        {
            xtype: "tbspacer",
            width: 12
        },
        this.btnUsers, {
            xtype: "tbspacer",
            width: 10
        },
        {
            xtype: "tbseparator",
            width: 2,
            height: 27,
            style: "padding-top:2px;",
            html: '<div style="width: 100%; height: 100%; border-left: 1px solid rgba(0, 0, 0, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.5);"></div>'
        }];
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onParticipantsChanged", Ext.bind(this._onParticipantsChanged, this));
        this.api.asc_registerCallback("asc_onAuthParticipantsChanged", Ext.bind(this._onParticipantsChanged, this));
        return this;
    },
    _onParticipantsChanged: function (users) {
        if (users.length > 1) {
            this.setVisible(true);
        }
        this.btnUsers.setText(users.length);
        if (this.btnUsers.getEl()) {
            var tip = this.tipUsers + "<br/><br/>";
            for (var i = 0; i < users.length && i < 4; i++) {
                tip += "<br/>" + users[i].asc_getUserName();
            }
            if (users.length > 4) {
                tip += "<br/>" + this.tipMoreUsers.replace("%1", users.length - 4);
                tip += "<br/><br/>" + this.tipShowUsers;
            }
            this.btnUsers.getEl().set({
                "data-qtip": tip,
                "data-qalign": "bl-tl?",
                "data-qwidth" : "250"
            });
        }
    },
    setMode: function (m) {
        this.editorConfig = {
            user: m.user
        };
    },
    tipUsers: "Document is in the collaborative editing mode.",
    tipMoreUsers: "and %1 users.",
    tipShowUsers: "To see all users click the icon below."
});