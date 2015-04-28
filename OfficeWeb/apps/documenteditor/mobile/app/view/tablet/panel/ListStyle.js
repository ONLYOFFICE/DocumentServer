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
 Ext.define("DE.view.tablet.panel.ListStyle", {
    extend: "Common.view.PopoverPanel",
    alias: "widget.liststylepanel",
    requires: (["Ext.NavigationView", "Common.component.SettingsList"]),
    initialize: function () {
        var me = this;
        me.add({
            xtype: "navigationview",
            id: "id-liststyle-navigate",
            autoDestroy: false,
            defaultBackButtonText: this.backText,
            navigationBar: {
                height: 44,
                minHeight: 44,
                ui: "edit"
            },
            items: [{
                xtype: "settingslist",
                title: this.listStyleText,
                id: "id-liststyle-root",
                ui: "round",
                scrollable: {
                    disabled: true
                },
                store: Ext.create("Common.store.SettingsList", {
                    data: [{
                        setting: this.bulletsText,
                        icon: "bullets",
                        group: "markers",
                        child: "id-liststyle-bullets"
                    },
                    {
                        setting: this.numberingText,
                        icon: "numbering",
                        group: "markers",
                        child: "id-liststyle-numbering"
                    },
                    {
                        setting: this.outlineText,
                        icon: "outline",
                        group: "markers",
                        child: "id-liststyle-outline"
                    },
                    {
                        setting: this.incIndentText,
                        icon: "indent-inc",
                        group: "indent",
                        id: "id-list-indent-increment"
                    },
                    {
                        setting: this.decIndentText,
                        icon: "indent-dec",
                        group: "indent",
                        id: "id-list-indent-decrement"
                    }]
                })
            }]
        });
        me.add({
            title: this.bulletsText,
            hidden: true,
            id: "id-liststyle-bullets",
            xtype: "container",
            layout: "vbox",
            cls: "round",
            items: [{
                xtype: "dataview",
                flex: 1,
                cls: "icon-view bullets",
                action: "style",
                style: "display: inline-block;",
                disableSelection: true,
                scrollable: {
                    disabled: true
                },
                store: {
                    field: ["bullet", "cls", "type", "subtype"],
                    data: [{
                        bullet: "none",
                        type: 0,
                        subtype: -1,
                        cls: "top-left"
                    },
                    {
                        bullet: "bullet-0",
                        type: 0,
                        subtype: 1,
                        cls: ""
                    },
                    {
                        bullet: "bullet-1",
                        type: 0,
                        subtype: 2,
                        cls: ""
                    },
                    {
                        bullet: "bullet-2",
                        type: 0,
                        subtype: 3,
                        cls: "top-right"
                    },
                    {
                        bullet: "bullet-3",
                        type: 0,
                        subtype: 4,
                        cls: "bottom-left"
                    },
                    {
                        bullet: "bullet-4",
                        type: 0,
                        subtype: 5,
                        cls: ""
                    },
                    {
                        bullet: "bullet-5",
                        type: 0,
                        subtype: 6,
                        cls: ""
                    },
                    {
                        bullet: "bullet-6",
                        type: 0,
                        subtype: 7,
                        cls: "bottom-right"
                    }]
                },
                itemTpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="item-inner {cls}">', "<tpl if=\"bullet == 'none'\">", '<div class="text">' + me.noneText + "</div>", "<tpl else>", '<div class="icon {bullet}">&nbsp;</div>', "</tpl>", "</div>", "</tpl>")
            }]
        });
        me.add({
            title: this.numberingText,
            hidden: true,
            id: "id-liststyle-numbering",
            xtype: "container",
            layout: "vbox",
            cls: "round",
            items: [{
                xtype: "dataview",
                flex: 1,
                cls: "icon-view numbering",
                action: "style",
                style: "display: inline-block;",
                disableSelection: true,
                scrollable: {
                    disabled: true
                },
                store: {
                    field: ["numbering", "cls", "type", "subtype"],
                    data: [{
                        numbering: "none",
                        type: 1,
                        subtype: -1,
                        cls: "top-left"
                    },
                    {
                        numbering: "numbering-0",
                        type: 1,
                        subtype: 4,
                        cls: ""
                    },
                    {
                        numbering: "numbering-1",
                        type: 1,
                        subtype: 5,
                        cls: ""
                    },
                    {
                        numbering: "numbering-2",
                        type: 1,
                        subtype: 6,
                        cls: "top-right"
                    },
                    {
                        numbering: "numbering-3",
                        type: 1,
                        subtype: 1,
                        cls: "bottom-left"
                    },
                    {
                        numbering: "numbering-4",
                        type: 1,
                        subtype: 2,
                        cls: ""
                    },
                    {
                        numbering: "numbering-5",
                        type: 1,
                        subtype: 3,
                        cls: ""
                    },
                    {
                        numbering: "numbering-6",
                        type: 1,
                        subtype: 7,
                        cls: "bottom-right"
                    }]
                },
                itemTpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="item-inner {cls}">', "<tpl if=\"numbering == 'none'\">", '<div class="text">' + me.noneText + "</div>", "<tpl else>", '<div class="icon {numbering}">&nbsp;</div>', "</tpl>", "</div>", "</tpl>")
            }]
        });
        me.add({
            title: this.outlineText,
            hidden: true,
            id: "id-liststyle-outline",
            xtype: "container",
            layout: "vbox",
            cls: "round",
            items: [{
                xtype: "dataview",
                flex: 1,
                cls: "icon-view outline",
                action: "style",
                style: "display: inline-block;",
                disableSelection: true,
                scrollable: {
                    disabled: true
                },
                store: {
                    field: ["outline", "cls", "type", "subtype"],
                    data: [{
                        outline: "none",
                        type: 2,
                        subtype: -1,
                        cls: "top-left bottom-left"
                    },
                    {
                        outline: "outline-0",
                        type: 2,
                        subtype: 1,
                        cls: ""
                    },
                    {
                        outline: "outline-1",
                        type: 2,
                        subtype: 2,
                        cls: ""
                    },
                    {
                        outline: "outline-2",
                        type: 2,
                        subtype: 3,
                        cls: "top-right bottom-right"
                    }]
                },
                itemTpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="item-inner {cls}">', "<tpl if=\"outline == 'none'\">", '<div class="text">' + me.noneText + "</div>", "<tpl else>", '<div class="icon {outline}">&nbsp;</div>', "</tpl>", "</div>", "</tpl>")
            }]
        });
        this.callParent(arguments);
    },
    backText: "Back",
    listStyleText: "List Style",
    bulletsText: "Bullets",
    numberingText: "Numbering",
    outlineText: "Outline",
    incIndentText: "Increment indent",
    decIndentText: "Decrement Indent",
    noneText: "none"
});