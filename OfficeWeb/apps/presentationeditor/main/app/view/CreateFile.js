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
 Ext.define("PE.view.CreateFile", {
    extend: "Ext.panel.Panel",
    alias: "widget.pecreatenew",
    cls: "pe-file-createnew",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    requires: ["Ext.container.Container", "Ext.data.Model", "Ext.data.Store", "Ext.view.View", "Ext.XTemplate", "Common.plugin.DataViewScrollPane"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.callParent(arguments);
        var me = this;
        me.add({
            xtype: "container",
            html: "<h3>" + me.fromBlankText + "</h3>" + "<hr noshade>" + '<div class="blank-document">' + '<div id="id-create-blank-document" class="btn-blank-document"></div>' + '<div class="blank-document-info">' + "<h3>" + me.newDocumentText + "</h3>" + me.newDescriptionText + "</div>" + "</div>" + '<div style="clear: both;"></div>' + "<h3>" + me.fromTemplateText + "</h3>" + "<hr noshade>"
        },
        {
            xtype: "container",
            flex: 1,
            layout: "fit",
            cls: "container-template-list",
            items: [{
                xtype: "dataview",
                store: "FileTemplates",
                tpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<tpl if="this.isEmptyIcon(icon)">', '<div class="thumb"></div>', "</tpl>", '<tpl if="this.isEmptyIcon(icon) == false">', '<div class="thumb" style="background-image: url(' + "'{icon}'" + ');"></div>', "</tpl>", '<div class="title">{name:htmlEncode}</div>', "</div>", "</tpl>", {
                    isEmptyIcon: function (icon) {
                        return icon == "";
                    }
                }),
                singleSelect: true,
                trackOver: true,
                autoScroll: true,
                overItemCls: "x-item-over",
                itemSelector: "div.thumb-wrap",
                cls: "x-view-context",
                emptyText: '<div class="empty-text">' + this.noTemplatesText + "</div>",
                deferEmptyText: false,
                plugins: [{
                    ptype: "dataviewscrollpane",
                    pluginId: "scrollpane",
                    areaSelector: ".x-view-context",
                    settings: {
                        enableKeyboardNavigation: true
                    }
                }]
            }]
        });
    },
    fromBlankText: "From Blank",
    newDocumentText: "New Presentation",
    newDescriptionText: "Create a new blank presentation which you will be able to style and format after it is created during the editing. Or choose one of the templates to start a document of a certain type or purpose where some styles have already been pre-applied.",
    fromTemplateText: "From Template",
    noTemplatesText: "There are no templates"
});