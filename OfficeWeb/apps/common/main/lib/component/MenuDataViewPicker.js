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
 Ext.define("Common.component.MenuDataViewPicker", {
    extend: "Ext.menu.Menu",
    alias: "widget.cmdmenudataviewpicker",
    requires: ["Common.component.DataViewPicker"],
    hideOnClick: true,
    hideMode: "display",
    constructor: function (config) {
        if (!config || !config.viewData) {
            throw Error("Common.component.MenuDataViewPicker creation failed: required parameters are missing.");
        }
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig);
        delete cfg.listeners;
        Ext.apply(me, {
            plain: true,
            showSeparator: false,
            items: Ext.applyIf({
                xtype: "cmddataviewpicker",
                padding: (Ext.isDefined(cfg.pickerpadding)) ? cfg.pickerpadding : "2px 4px 1px 2px",
                store: cfg.store
            },
            cfg)
        });
        me.callParent(arguments);
        me.picker = me.down("cmddataviewpicker");
        me.relayEvents(me.picker, ["select", "itemmouseenter", "itemmouseleave"]);
        if (me.hideOnClick) {
            me.on("select", me.hidePickerOnSelect, me);
        }
        me.on("resize", function (cnt, adjWidth, adjHeight, eOpts) {
            if (me.applyContentWidth && adjWidth >= 20) {
                me.picker.contentWidth = adjWidth - 20;
            }
            me.picker.setSize(adjWidth, adjHeight);
        },
        this);
        me.on("show", function (cnt) {
            me.picker.showUpdated();
        },
        this);
    },
    hidePickerOnSelect: function (picker, columns, rows) {
        Ext.menu.Manager.hideAll();
    }
});