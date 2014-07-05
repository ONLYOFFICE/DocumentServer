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
 Ext.define("Common.view.DocumentAccessDialog", {
    extend: "Ext.window.Window",
    alias: "widget.commondocumentaccessdialog",
    uses: ["Common.component.LoadMask"],
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 534,
    width: 850,
    layout: "fit",
    closable: true,
    style: "background-color:white;",
    initComponent: function () {
        this.items = [{
            xtype: "container",
            flex: 1,
            html: '<div id="id-sharing-placeholder"></div>'
        }];
        this.title = this.textTitle;
        this.addEvents("accessrights");
        this.callParent(arguments);
    },
    afterRender: function (cmp) {
        this.callParent(arguments);
        var iframe = document.createElement("iframe");
        iframe.src = this.settingsurl;
        iframe.width = 850;
        iframe.height = 500;
        iframe.align = "top";
        iframe.frameBorder = 0;
        iframe.scrolling = "no";
        iframe.onload = Ext.bind(this._onLoad, this);
        var target = cmp.down("#id-sharing-placeholder", true);
        target.parentNode.replaceChild(iframe, target);
        this.loadMask = Ext.widget("cmdloadmask", this);
        this.loadMask.setTitle(this.textLoading);
        this.loadMask.show();
        this._bindWindowEvents.call(this);
    },
    _bindWindowEvents: function () {
        var me = this;
        if (window.addEventListener) {
            window.addEventListener("message", function (msg) {
                me._onWindowMessage(msg);
            },
            false);
        } else {
            if (window.attachEvent) {
                window.attachEvent("onmessage", function (msg) {
                    me._onWindowMessage(msg);
                });
            }
        }
    },
    _onWindowMessage: function (msg) {
        if (msg && window.JSON) {
            try {
                this._onMessage.call(this, window.JSON.parse(msg.data));
            } catch(e) {}
        }
    },
    _onMessage: function (msg) {
        if (msg && msg.needUpdate) {
            this.fireEvent("accessrights", this, msg.sharingSettings);
        }
        this.close();
    },
    _onLoad: function () {
        this.loadMask.hide();
    },
    textTitle: "Sharing Settings",
    textLoading: "Loading"
});