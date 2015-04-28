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
 Ext.define("DE.view.tablet.panel.TextColor", {
    extend: "Common.view.PopoverPanel",
    alias: "widget.textcolorsettingspanel",
    requires: (["Ext.NavigationView", "Common.component.SettingsList"]),
    initialize: function () {
        var me = this;
        me.add({
            xtype: "navigationview",
            id: "id-textcolor-navigate",
            autoDestroy: false,
            defaultBackButtonText: this.backText,
            navigationBar: {
                height: 44,
                minHeight: 44,
                ui: "edit"
            },
            items: [{
                xtype: "settingslist",
                title: this.colorText,
                id: "id-textcolor-root",
                scrollable: {
                    disabled: true
                },
                store: Ext.create("Common.store.SettingsList", {
                    data: [{
                        setting: this.highlightColorText,
                        icon: "highlightcolor",
                        group: "color",
                        child: "id-textcolor-highlight"
                    },
                    {
                        setting: this.textColorText,
                        icon: "textcolor",
                        group: "color",
                        child: "id-textcolor-text"
                    }]
                })
            }]
        });
        me.add({
            title: this.highlightColorText,
            hidden: true,
            id: "id-textcolor-highlight",
            xtype: "container",
            layout: "vbox",
            cls: "round",
            items: [{
                xtype: "dataview",
                flex: 1,
                cls: "color",
                style: "display: inline-block;",
                store: {
                    field: ["color"],
                    data: [{
                        color: "FFFF00"
                    },
                    {
                        color: "00FF00"
                    },
                    {
                        color: "00FFFF"
                    },
                    {
                        color: "FF00FF"
                    },
                    {
                        color: "0000FF"
                    },
                    {
                        color: "FF0000"
                    },
                    {
                        color: "00008B"
                    },
                    {
                        color: "008B8B"
                    },
                    {
                        color: "006400"
                    },
                    {
                        color: "800080"
                    },
                    {
                        color: "8B0000"
                    },
                    {
                        color: "808000"
                    },
                    {
                        color: "FFFFFF"
                    },
                    {
                        color: "D3D3D3"
                    },
                    {
                        color: "A9A9A9"
                    },
                    {
                        color: "000000"
                    }]
                },
                itemTpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="item-inner" style="background-color: #{color};"></div>', "</tpl>")
            },
            {
                xtype: "container",
                padding: "12 18",
                items: [{
                    xtype: "button",
                    id: "id-btn-highlight-none",
                    ui: "light",
                    cls: "border-radius-10",
                    height: 44,
                    text: this.noFillText
                }]
            }]
        });
        me.add({
            title: this.textColorText,
            hidden: true,
            id: "id-textcolor-text",
            xtype: "container",
            layout: "vbox",
            cls: "round",
            items: [{
                xtype: "dataview",
                flex: 1,
                cls: "color",
                style: "display: inline-block;",
                store: {
                    field: ["color"],
                    data: [{
                        color: "FFFFFF"
                    },
                    {
                        color: "EBEBEB"
                    },
                    {
                        color: "D6D6D6"
                    },
                    {
                        color: "C0C0C0"
                    },
                    {
                        color: "AAAAAA"
                    },
                    {
                        color: "929292"
                    },
                    {
                        color: "7A7A7A"
                    },
                    {
                        color: "606060"
                    },
                    {
                        color: "444444"
                    },
                    {
                        color: "232323"
                    },
                    {
                        color: "000000"
                    },
                    {
                        color: "0C3649"
                    },
                    {
                        color: "0E1957"
                    },
                    {
                        color: "14003B"
                    },
                    {
                        color: "2E013E"
                    },
                    {
                        color: "3A051C"
                    },
                    {
                        color: "580504"
                    },
                    {
                        color: "561C04"
                    },
                    {
                        color: "553403"
                    },
                    {
                        color: "523E02"
                    },
                    {
                        color: "646302"
                    },
                    {
                        color: "4E5703"
                    },
                    {
                        color: "263F0E"
                    },
                    {
                        color: "144C64"
                    },
                    {
                        color: "18297A"
                    },
                    {
                        color: "1F0052"
                    },
                    {
                        color: "440259"
                    },
                    {
                        color: "530D2A"
                    },
                    {
                        color: "7D0C08"
                    },
                    {
                        color: "772907"
                    },
                    {
                        color: "764A05"
                    },
                    {
                        color: "745904"
                    },
                    {
                        color: "8A8803"
                    },
                    {
                        color: "6D780A"
                    },
                    {
                        color: "395919"
                    },
                    {
                        color: "216C8E"
                    },
                    {
                        color: "253AA9"
                    },
                    {
                        color: "310076"
                    },
                    {
                        color: "60047C"
                    },
                    {
                        color: "74153F"
                    },
                    {
                        color: "AE1610"
                    },
                    {
                        color: "A63D0E"
                    },
                    {
                        color: "A3690B"
                    },
                    {
                        color: "A27D09"
                    },
                    {
                        color: "C0BF06"
                    },
                    {
                        color: "98A811"
                    },
                    {
                        color: "507C27"
                    },
                    {
                        color: "2C8BB3"
                    },
                    {
                        color: "314DD5"
                    },
                    {
                        color: "3E0094"
                    },
                    {
                        color: "7A069F"
                    },
                    {
                        color: "941E51"
                    },
                    {
                        color: "DA1E17"
                    },
                    {
                        color: "D15014"
                    },
                    {
                        color: "CE8611"
                    },
                    {
                        color: "CC9F0E"
                    },
                    {
                        color: "F0EF0A"
                    },
                    {
                        color: "C0D41B"
                    },
                    {
                        color: "689F34"
                    },
                    {
                        color: "36A1D7"
                    },
                    {
                        color: "3D55FE"
                    },
                    {
                        color: "5301B3"
                    },
                    {
                        color: "980ABD"
                    },
                    {
                        color: "B2275F"
                    },
                    {
                        color: "F83D26"
                    },
                    {
                        color: "F86A1D"
                    },
                    {
                        color: "F7AC16"
                    },
                    {
                        color: "F7CA12"
                    },
                    {
                        color: "FAFF44"
                    },
                    {
                        color: "D6EF39"
                    },
                    {
                        color: "79BE40"
                    },
                    {
                        color: "41C5FB"
                    },
                    {
                        color: "5581FD"
                    },
                    {
                        color: "6800EB"
                    },
                    {
                        color: "BD10F3"
                    },
                    {
                        color: "DE337D"
                    },
                    {
                        color: "F86056"
                    },
                    {
                        color: "F8864D"
                    },
                    {
                        color: "F8B544"
                    },
                    {
                        color: "F8CD44"
                    },
                    {
                        color: "FBFA6D"
                    },
                    {
                        color: "E1F266"
                    },
                    {
                        color: "97D65F"
                    },
                    {
                        color: "6CD4FC"
                    },
                    {
                        color: "81A3FE"
                    },
                    {
                        color: "8D3BFD"
                    },
                    {
                        color: "D145FE"
                    },
                    {
                        color: "E76DA0"
                    },
                    {
                        color: "FA8B84"
                    },
                    {
                        color: "F9A67F"
                    },
                    {
                        color: "F9C879"
                    },
                    {
                        color: "FADA79"
                    },
                    {
                        color: "FBFB96"
                    },
                    {
                        color: "E8F590"
                    },
                    {
                        color: "B2E08B"
                    },
                    {
                        color: "9FE3FD"
                    },
                    {
                        color: "AEC3FE"
                    },
                    {
                        color: "B385FD"
                    },
                    {
                        color: "E18BFF"
                    },
                    {
                        color: "EFA2C1"
                    },
                    {
                        color: "FBB4B0"
                    },
                    {
                        color: "FBC5AC"
                    },
                    {
                        color: "FBDAA9"
                    },
                    {
                        color: "FBE6A9"
                    },
                    {
                        color: "FCFDBA"
                    },
                    {
                        color: "F0F9B8"
                    },
                    {
                        color: "CDEAB5"
                    },
                    {
                        color: "CFF0FE"
                    },
                    {
                        color: "D6E2FE"
                    },
                    {
                        color: "DAC7FE"
                    },
                    {
                        color: "F0C7FE"
                    },
                    {
                        color: "F6D2E1"
                    },
                    {
                        color: "FCDAD9"
                    },
                    {
                        color: "FDE2D7"
                    },
                    {
                        color: "FDEDD5"
                    },
                    {
                        color: "FDF2D5"
                    },
                    {
                        color: "FDFDDD"
                    },
                    {
                        color: "F7FBDB"
                    },
                    {
                        color: "E0EED4"
                    }]
                },
                itemTpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="item-inner" style="background-color: #{color};"></div>', "</tpl>")
            }]
        });
        this.callParent(arguments);
    },
    backText: "Back",
    colorText: "Color",
    highlightColorText: "Highlight color",
    textColorText: "Text color",
    noFillText: "No Fill"
});