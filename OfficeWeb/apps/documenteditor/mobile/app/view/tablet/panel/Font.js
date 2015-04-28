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
 Ext.define("DE.view.tablet.panel.Font", {
    extend: "Common.view.PopoverPanel",
    alias: "widget.fontpanel",
    requires: (["Ext.NavigationView", "Common.component.PlanarSpinner"]),
    initialize: function () {
        var me = this;
        me.add({
            xtype: "navigationview",
            id: "id-font-navigate",
            autoDestroy: false,
            cls: "plain",
            defaultBackButtonText: this.backText,
            navigationBar: {
                height: 44,
                minHeight: 44,
                hidden: true,
                ui: "edit"
            },
            layout: {
                type: "card",
                animation: null
            },
            items: [{
                xtype: "container",
                layout: "hbox",
                height: 31,
                id: "id-font-root",
                style: "background: transparent;",
                items: [{
                    xtype: "button",
                    id: "id-btn-fontname",
                    ui: "base",
                    style: "font-size: .7em;",
                    text: this.fontNameText,
                    width: 185
                },
                {
                    xtype: "spacer",
                    width: 7
                },
                {
                    xtype: "planarspinnerfield",
                    width: 135,
                    minValue: 6,
                    maxValue: 100,
                    stepValue: 1,
                    cycle: false,
                    component: {
                        disabled: false
                    }
                },
                {
                    xtype: "spacer",
                    width: 7
                },
                {
                    xtype: "segmentedbutton",
                    id: "id-toggle-baseline",
                    ui: "base",
                    cls: "divided",
                    allowDepress: true,
                    items: [{
                        id: "id-btn-baseline-up",
                        ui: "base",
                        iconCls: "superscript"
                    },
                    {
                        id: "id-btn-baseline-down",
                        ui: "base",
                        iconCls: "subscript"
                    }]
                }]
            }]
        });
        me.add({
            xtype: "settingslist",
            hidden: true,
            title: this.fontNameText,
            id: "id-font-name",
            disableSelection: false,
            variableHeights: false,
            store: Ext.create("Common.store.SettingsList", {})
        });
        this.callParent(arguments);
    },
    fontNameText: "Font Name",
    backText: "Back"
});