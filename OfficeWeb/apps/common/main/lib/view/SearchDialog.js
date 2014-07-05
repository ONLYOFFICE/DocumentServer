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
 Ext.define("Common.view.SearchDialog", {
    extend: "Ext.window.Window",
    alias: "widget.commonsearchdialog",
    requires: ["Ext.window.Window", "Ext.form.field.Checkbox"],
    closable: true,
    resizable: false,
    height: 120,
    width: 550,
    padding: "12px 20px 0 20px",
    constrain: true,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        show: function () {
            this.txtSearchQuery.focus(false, 100);
        }
    },
    initComponent: function () {
        var me = this;
        this.isSearchMode = true;
        this.isViewMode = Ext.isDefined(this.initialConfig.isViewMode) ? this.initialConfig.isViewMode : false;
        this.btnSearchPrev = Ext.create("Ext.Button", {
            cls: "dlg-search",
            width: 45,
            iconCls: "asc-btn-search previous",
            style: "margin: 0 6px 0 8px",
            group: "search-text",
            direction: "prev"
        });
        this.btnSearchNext = Ext.create("Ext.Button", {
            cls: "dlg-search",
            width: 45,
            iconCls: "asc-btn-search next",
            group: "search-text",
            direction: "next"
        });
        this.btnReplace = Ext.create("Ext.Button", {
            text: this.txtBtnReplace,
            height: 22,
            width: 96,
            group: "replace-text",
            style: "margin: 0 0 0 8px",
            type: "single"
        });
        this.btnReplaceAll = Ext.create("Ext.Button", {
            text: this.txtBtnReplaceAll,
            height: 22,
            width: 96,
            group: "replace-text",
            hidden: true,
            type: "all"
        });
        this.btnOpenReplace = Ext.create("Ext.Button", {
            text: this.txtBtnReplace,
            height: 22,
            width: 96,
            hidden: this.isViewMode,
            handler: function () {
                me.replaceMode();
            }
        });
        this.chCaseSensitive = Ext.widget("checkbox", {
            boxLabel: this.textMatchCase,
            style: "margin: 0 20px 0 0",
            checked: this.matchcase && this.matchcase.checked === true,
            hidden: this.matchcase === false || (typeof(this.matchcase) == "object" && this.matchcase.visible === false)
        });
        this.chWholeWords = Ext.widget("checkbox", {
            boxLabel: this.textWholeWords,
            style: "margin: 0 20px 0 0",
            checked: this.wholewords && this.wholewords.checked === true,
            hidden: this.wholewords === false || (typeof(this.wholewords) == "object" && this.wholewords.visible === false)
        });
        this.chHighlight = Ext.widget("checkbox", {
            boxLabel: this.textHighlight,
            style: "margin: 0 20px 0 0",
            action: "highlight",
            checked: this.highlight && this.highlight.checked === true,
            hidden: this.highlight === false || (typeof(this.highlight) == "object" && this.highlight.visible === false)
        });
        this.txtSearchQuery = Ext.create("Common.component.SearchField", {
            id: "search-dialog-text-search",
            flex: 1,
            emptyText: this.textSearchStart,
            tabIndex: 1,
            style: "border-radius: 2px;"
        });
        this.txtReplaceQuery = Ext.create("Common.component.SearchField", {
            id: "search-dialog-text-replace",
            flex: 1,
            style: "border-radius: 2px;",
            emptyText: this.textSearchStart,
            tabIndex: 2,
            listeners: {
                searchstart: function (obj, text) {
                    obj.stopSearch(true);
                }
            }
        });
        this.items = [{
            xtype: "container",
            width: 310,
            height: 22,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [this.txtSearchQuery, this.btnSearchPrev, this.btnSearchNext]
        },
        {
            xtype: "container",
            width: 310,
            height: 22,
            style: "margin: 10px 0 0 0",
            hidden: true,
            layout: {
                type: "hbox"
            },
            items: [this.txtReplaceQuery, this.btnReplace]
        },
        {
            xtype: "container",
            width: 310,
            height: 22,
            style: "margin: 10px 0 0 0",
            layout: {
                type: "hbox"
            },
            items: [this.chCaseSensitive, this.chWholeWords, this.chHighlight, {
                xtype: "box",
                flex: 1
            },
            this.btnReplaceAll, this.btnOpenReplace]
        }];
        if (this.simplesearch) {
            this.items[2].hidden = true;
            this.minHeight = 86;
            this.height = 86;
        }
        this.callParent(arguments);
        this.setTitle(this.isViewMode ? this.textTitle2 : this.textTitle);
    },
    replaceMode: function () {
        this.isSearchMode = false;
        this.setSize({
            height: 150
        });
        this.items.getAt(1).show();
        this.btnReplaceAll.show();
        this.btnOpenReplace.hide();
    },
    searchMode: function () {
        this.isSearchMode = true;
        this.setSize({
            height: 120
        });
        this.items.getAt(1).hide();
        this.btnReplaceAll.hide();
        if (!this.isViewMode) {
            this.btnOpenReplace.show();
        }
    },
    getSettings: function () {
        var out = {
            textsearch: this.txtSearchQuery.getText(),
            casesensitive: this.chCaseSensitive.getValue(),
            wholewords: this.chWholeWords.getValue(),
            highlight: this.chHighlight.getValue()
        }; ! this.isSearchMode && (out.textreplace = this.txtReplaceQuery.getText());
        return out;
    },
    selectSearch: function () {
        if (this.txtSearchQuery.getText().length > 0) {
            this.txtSearchQuery.focus(100, true);
        }
    },
    setViewMode: function (mode) {
        if (this.isViewMode !== mode) {
            this.isViewMode = mode;
            this.setTitle(this.isViewMode ? this.textTitle2 : this.textTitle);
            this.btnOpenReplace.setVisible(!mode);
        }
    },
    textTitle: "Search & Replace",
    textTitle2: "Search",
    txtBtnReplace: "Replace",
    txtBtnReplaceAll: "Replace All",
    textMatchCase: "Case sensitive",
    textWholeWords: "Whole words only",
    textHighlight: "Highlight results",
    textSearchStart: "Enter text here"
});