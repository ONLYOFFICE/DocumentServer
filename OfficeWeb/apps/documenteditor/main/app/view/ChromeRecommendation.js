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
 Ext.define("DE.view.ChromeRecommendation", {
    extend: "Ext.window.Window",
    alias: "widget.dechromerecommendation",
    requires: ["Ext.window.Window"],
    modal: true,
    closable: true,
    resizable: false,
    plain: true,
    width: 375,
    height: 185,
    layout: {
        type: "border"
    },
    onEsc: function () {
        this.close();
    },
    initComponent: function () {
        this.addEvents("onmodalresult");
        this.items = [{
            xtype: "container",
            region: "center",
            layout: {
                type: "vbox",
                align: "center"
            },
            items: [{
                xtype: "box",
                padding: "15px 0 0 0",
                html: '<p style="width: 320px; text-align: center; font-size: 8pt; font-family: Arial; color: #636363; padding-top: 10px;">' + this.useChromeMessage + "</p>"
            }]
        },
        {
            xtype: "container",
            region: "south",
            height: 58,
            style: "border-top: 1px solid #E5E5E5",
            padding: "16px 0 0 0",
            layout: {
                type: "hbox",
                align: "center",
                pack: "center"
            },
            items: [{
                xtype: "button",
                cls: "asc-blue-button",
                width: 85,
                text: Ext.Msg.buttonText["ok"],
                margin: "0 5px 0 0",
                listeners: {
                    click: function (btn) {
                        this.fireEvent("onmodalresult", this, 0);
                        this.close();
                    },
                    scope: this
                }
            },
            {
                xtype: "button",
                cls: "asc-darkgray-button",
                text: this.dontShowButtonText,
                autoSize: true,
                listeners: {
                    click: function (btn) {
                        this.fireEvent("onmodalresult", this, 1);
                        this.close();
                    },
                    scope: this
                }
            }]
        }];
        this.callParent(arguments);
    },
    dontShowButtonText: "Don't show again",
    useChromeMessage: "We recommend that you use one of the latest versions of the Google Chrome web browser to speed up your work at documents."
});