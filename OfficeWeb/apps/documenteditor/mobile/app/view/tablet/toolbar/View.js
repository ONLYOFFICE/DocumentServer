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
 Ext.define("DE.view.tablet.toolbar.View", {
    extend: "Ext.Toolbar",
    xtype: "viewtoolbar",
    config: {
        docked: "top",
        zIndex: 10,
        minHeight: 44,
        ui: "edit"
    },
    initialize: function () {
        this.add([{
            xtype: "toolbar",
            minHeight: 40,
            flex: 1,
            style: "margin: 0; padding: 0;",
            items: [{
                id: "id-tb-btn-view-done",
                ui: "base-blue",
                cls: "text-offset-12",
                hidden: true,
                text: this.doneText
            },
            {
                id: "id-tb-btn-editmode",
                ui: "base",
                cls: "text-offset-12",
                text: this.editText
            },
            {
                id: "id-tb-btn-readable",
                ui: "base",
                cls: "text-offset-12",
                text: this.readerText
            }]
        },
        {
            id: "id-tb-btn-search",
            ui: "base",
            iconCls: "search"
        },
        {
            id: "id-tb-btn-incfontsize",
            ui: "base",
            iconCls: "textbigger",
            hidden: true
        },
        {
            id: "id-tb-btn-decfontsize",
            ui: "base",
            iconCls: "textless",
            hidden: true
        },
        {
            id: "id-tb-btn-fullscreen",
            ui: "base",
            iconCls: "fullscreen"
        },
        {
            xtype: "toolbar",
            minHeight: 40,
            style: "margin: 0; padding: 0;",
            layout: {
                type: "hbox",
                pack: "end"
            },
            flex: 1,
            items: [{
                id: "id-tb-btn-view-share",
                ui: "base",
                iconCls: "share"
            }]
        }]);
        this.callParent(arguments);
    },
    doneText: "Done",
    editText: "Edit",
    readerText: "Reader"
});