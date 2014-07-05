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
 Ext.define("Common.component.SearchField", {
    extend: "Ext.container.Container",
    alias: "widget.commonsearchfield",
    height: 22,
    layout: {
        type: "hbox",
        align: "stretch"
    },
    cls: "common-searchfield",
    require: ["Ext.data.Store", "Ext.button.Button", "Ext.container.Container"],
    initComponent: function () {
        var me = this;
        me.searching = false;
        me.txtSearchQuery = Ext.create("Ext.form.field.Text", {
            flex: 1,
            emptyText: this.emptyText,
            tabIndex: this.tabIndex || -1,
            listeners: {
                specialkey: function (o, e) {
                    if (e.getKey() == e.ENTER) {
                        me.stopSearch();
                        me.startSearch();
                    } else {
                        if (e.getKey() == e.TAB) {
                            me.stopSearch();
                            me.focus();
                            me.blur();
                        }
                    }
                },
                change: function (o, e) {
                    me.btnClear.setVisible(!me.isValueEmpty());
                },
                blur: function (o, e) {
                    if (!me.isValueValid()) {
                        me.clear();
                    }
                }
            }
        });
        me.btnClear = Ext.create("Ext.button.Button", {
            iconCls: "search-btn-clear-icon",
            hidden: true,
            listeners: {
                click: function () {
                    me.searching ? me.stopSearch() : me.clear();
                }
            }
        });
        me.items = [me.txtSearchQuery, me.btnClear];
        me.relayEvents(me.txtSearchQuery, ["change"]);
        me.addEvents("searchstart", "searchstop", "searchclear");
        me.callParent(arguments);
    },
    startSearch: function (suppressEvent) {
        var me = this;
        if (!me.searching && me.isValueValid()) {
            me.searching = true;
            me.btnClear.setIconCls("search-btn-start-icon").toggle(true).disable();
            if (!suppressEvent) {
                me.fireEvent("searchstart", me, me.getText());
            }
        }
    },
    stopSearch: function (suppressEvent) {
        var me = this;
        if (me.searching) {
            me.searching = false;
            me.btnClear.setIconCls("search-btn-clear-icon").toggle(false).enable();
            if (!suppressEvent) {
                me.fireEvent("searchstop", me);
            }
        }
    },
    clear: function (suppressEvent) {
        var me = this;
        if (!me.searching) {
            me.txtSearchQuery.reset();
            if (!suppressEvent) {
                me.fireEvent("searchclear", me);
            }
        }
    },
    isValueValid: function () {
        var value = this.txtSearchQuery.getValue();
        return !Ext.isEmpty(value);
    },
    isValueEmpty: function () {
        return this.txtSearchQuery.getValue().length == 0;
    },
    setText: function (text) {
        this.txtSearchQuery.setValue(text);
    },
    getText: function () {
        return this.txtSearchQuery.getValue();
    },
    setValue: function (text) {
        this.txtSearchQuery.setValue(text);
    },
    getValue: function () {
        return this.txtSearchQuery.getValue();
    },
    focus: function (selectText, delay) {
        this.txtSearchQuery.focus(selectText, delay);
    }
});