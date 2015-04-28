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
 Ext.define("DE.view.tablet.panel.Spacing", {
    extend: "Common.view.PopoverPanel",
    alias: "widget.spacingpanel",
    requires: (["Ext.NavigationView", "Common.component.SettingsList"]),
    initialize: function () {
        var me = this;
        me.add({
            xtype: "navigationview",
            id: "id-spacing-navigate",
            autoDestroy: false,
            defaultBackButtonText: this.backText,
            navigationBar: {
                height: 44,
                minHeight: 44,
                ui: "edit"
            },
            items: [{
                xtype: "settingslist",
                title: this.spacingText,
                id: "id-spacing-root",
                ui: "round",
                scrollable: {
                    disabled: true
                },
                store: Ext.create("Common.store.SettingsList", {
                    data: [{
                        setting: this.lineSpacingText,
                        icon: "spacing",
                        group: "line",
                        child: "id-spacing-linespacing"
                    },
                    {
                        setting: this.incIndentText,
                        icon: "indent-inc",
                        group: "indent",
                        id: "id-linespacing-increaseindent"
                    },
                    {
                        setting: this.decIndentText,
                        icon: "indent-dec",
                        group: "indent",
                        id: "id-linespacing-decrementindent"
                    }]
                })
            }]
        });
        me.add({
            title: this.spacingText,
            hidden: true,
            id: "id-spacing-linespacing",
            xtype: "settingslist",
            disableSelection: false,
            allowDeselect: true,
            store: Ext.create("Common.store.SettingsList", {
                data: [{
                    setting: "1.0",
                    group: "spacing"
                },
                {
                    setting: "1.15",
                    group: "spacing"
                },
                {
                    setting: "1.5",
                    group: "spacing"
                },
                {
                    setting: "2",
                    group: "spacing"
                },
                {
                    setting: "2.5",
                    group: "spacing"
                },
                {
                    setting: "3.0",
                    group: "spacing"
                }]
            })
        });
        this.callParent(arguments);
    },
    backText: "Back",
    spacingText: "Spacing",
    lineSpacingText: "Paragraph Line Spacing",
    incIndentText: "Increase Indent",
    decIndentText: "Decrement Indent"
});