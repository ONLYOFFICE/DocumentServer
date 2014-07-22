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
 Ext.define("Common.view.Header", {
    extend: "Ext.container.Container",
    alias: "widget.commonheader",
    cls: "common-header",
    config: {
        headerCaption: "Default Caption",
        documentCaption: "",
        canBack: false
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.html = '<div id="header-logo"></div>' + '<span id="header-caption"></span>' + '<span id="header-delimiter">-</span>' + '<span id="header-documentcaption"></span>' + '<span id="header-back">' + this.textBack + "</span>";
        this.callParent(arguments);
    },
    afterRender: function (obj) {
        this.callParent(arguments);
        $("#header-logo").on("click", function (e) {
            var newDocumentPage = window.open("http://www.onlyoffice.com");
            newDocumentPage && newDocumentPage.focus();
        });
    },
    applyHeaderCaption: function (value) {
        var hc = Ext.fly("header-caption");
        if (hc) {
            Ext.DomHelper.overwrite(hc, value);
        }
        return value;
    },
    applyDocumentCaption: function (value) {
        if (!value) {
            value = "";
        }
        var hd = Ext.fly("header-delimiter");
        if (hd) {
            hd.setVisible(value.length > 0);
        }
        var dc = Ext.fly("header-documentcaption");
        if (dc) {
            Ext.DomHelper.overwrite(dc, Ext.htmlEncode(value));
        }
        return value;
    },
    applyCanBack: function (value) {
        var back = Ext.fly("header-back");
        if (back) {
            back.un("click");
            back.setVisible(value);
            if (value) {
                back.on("click", Ext.bind(this.onBackClick, this));
            }
        }
    },
    onBackClick: function (e) {
        Common.Gateway.goBack();
        Common.component.Analytics.trackEvent("Back to Folder");
    },
    textBack: "Go to Documents"
});