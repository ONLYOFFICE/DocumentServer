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
 Ext.define("SSE.controller.CellEdit", {
    extend: "Ext.app.Controller",
    views: ["CellInfo"],
    refs: [{
        ref: "infoBox",
        selector: "ssecellinfo"
    },
    {
        ref: "dlgFormula",
        selector: "sseformuladialog"
    },
    {
        ref: "formulaList",
        selector: "#formulas-list"
    },
    {
        ref: "toolBar",
        selector: "ssetoolbar"
    },
    {
        ref: "cellTextBox",
        selector: "#infobox-cell-edit"
    },
    {
        ref: "buttonExpand",
        selector: "#infobox-cell-multiline-button"
    }],
    init: function () {
        this.control({
            "sseformuladialog": {
                beforeshow: function (o, eOpts) {},
                show: function () {
                    this.getFormulaList().getSelectionModel().select(0);
                    this.getDlgFormula().focus(undefined, 100);
                },
                beforerender: function () {
                    if (! (this.getFormulaList().getStore().getCount() > 0)) {
                        this._reloadFormulas();
                    }
                    this.getDlgFormula().setGroups(this.arrGroups);
                },
                hide: function () {
                    this.getToolBar().fireEvent("editcomplete", this.getToolBar());
                }
            },
            "sseformuladialog #formulas-group-combo": {
                select: function (combo, records, eOpts) {
                    this.getFormulaList().getStore().clearFilter();
                    if (records[0].data["groupid"] !== "all") {
                        this.getFormulaList().getStore().filter("group", records[0].data["groupid"]);
                    }
                }
            },
            "sseformuladialog #formulas-button-ok": {
                click: function (btn) {
                    var data = this.getFormulaList().getSelectionModel().getSelection()[0].data;
                    this.api.asc_insertFormula(data.func);
                    this.getDlgFormula().hide();
                }
            },
            "#formulas-list > gridview": {
                afterrender: function (cmp) {
                    this.funcSearch = {
                        index: 0,
                        update: false,
                        word: ""
                    };
                    cmp.addElListener("keypress", Ext.bind(this.keypressFormulasList, this));
                }
            },
            "#toolbar-button-insertformula": {
                click: function (btn) {
                    this._handleInsertFormula(btn.menu, {
                        func: "SUM"
                    });
                }
            },
            "#toolbar-menu-insertformula": {
                click: this._handleInsertFormula
            },
            "#infobox-cell-edit": {
                blur: function (o) {
                    if (this.api.isTextAreaBlur !== null) {
                        this.api.isTextAreaBlur = true;
                    }
                },
                specialkey: function (o, e) {
                    if (e.getKey() == e.ENTER && !e.altKey) {
                        this.api.isTextAreaBlur = null;
                    }
                }
            },
            "ssecellinfo #infobox-cell-name": {
                specialkey: function (o, e) {
                    if (e.getKey() == e.ENTER) {
                        this.api.asc_findCell(o.getValue());
                        this.getInfoBox().fireEvent("editcomplete", this.getInfoBox());
                    }
                }
            },
            "ssecellinfo": {
                resize: function (o, adjWidth, adjHeight, opts) {
                    this.getButtonExpand()[adjHeight > 23 ? "addCls" : "removeCls"]("button-collapse");
                }
            },
            "ssecellinfo #infobox-cell-multiline-button": {
                click: this._expandFormulaField
            },
            "#field-formula-splitter": {
                beforedragstart: function (obj, event) {
                    return event.currentTarget && !event.currentTarget.disabled;
                },
                move: function (obj, x, y) {
                    delete this.getInfoBox().width;
                }
            }
        });
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.isTextAreaBlur = false;
            this.api.asc_registerCallback("asc_onSelectionNameChanged", Ext.bind(this.updateBox, this));
            this.api.asc_registerCallback("asc_onEditCell", Ext.bind(this._onEditCell, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        }
    },
    updateBox: function (info) {
        this.getInfoBox().updateCellInfo(info);
    },
    _onEditCell: function (state) {
        if (state == c_oAscCellEditorState.editStart) {
            this.api.isCellEdited = true;
        } else {
            if (state == c_oAscCellEditorState.editEnd) {
                this.api.isCellEdited = false;
            }
        }
    },
    _reloadFormulas: function () {
        var arrFuncs = [];
        this.arrGroups = [];
        dlgFormulas.arrayFormula = [];
        var groupFuncs, groupName, addGroup;
        var qa = this.api.asc_getFormulasInfo();
        for (var i = 0; i < qa.length; i++) {
            groupName = qa[i].asc_getGroupName();
            groupFuncs = qa[i].asc_getFormulasArray();
            addGroup = false;
            for (var j = 0; j < groupFuncs.length; j++) {
                if (addGroup !== true) {
                    this.arrGroups.push(groupName);
                    addGroup = true;
                }
                arrFuncs.push({
                    group: groupName,
                    func: groupFuncs[j].asc_getName(),
                    args: groupFuncs[j].asc_getArguments()
                });
                dlgFormulas.arrayFormula.push(groupFuncs[j].asc_getName());
            }
        }
        this.getFormulaList().getStore().loadData(arrFuncs);
    },
    _smoothScrollIntoView: function (element, container) {
        var c = Ext.getDom(container) || Ext.getBody().dom,
        o = element.getOffsetsTo(c),
        t = o[1] + c.scrollTop;
        var newCTop = t - c.clientHeight / 2;
        if (newCTop < 0) {
            newCTop = 0;
        }
        container.scrollTo("top", newCTop, true);
    },
    scrollViewToNode: function (dataview, node) {
        if (dataview && node) {
            var plugin = dataview.getPlugin("scrollpane");
            if (plugin) {
                var doScroll = new Ext.util.DelayedTask(function () {
                    plugin.scrollToElement(node, false, true);
                });
                doScroll.delay(100);
            }
        }
    },
    keypressFormulasList: function (event, el) {
        if ((new Date().getTime()) - this.funcSearch.presstime > 3000) {
            this.funcSearch.word = "";
        }
        var store = this.getFormulaList().getStore();
        var symbol = String.fromCharCode(event.getCharCode());
        var index = this.funcSearch.index;
        if (/[a-zA-Z]/.test(symbol)) {
            this.funcSearch.word += symbol;
            this.funcSearch.index = store.find("func", this.funcSearch.word, index);
            if (this.funcSearch.index < 0) {
                this.funcSearch.word = symbol;
                this.funcSearch.index = store.find("func", this.funcSearch.word, index + 1);
            }
            if (this.funcSearch.index < 0) {
                this.funcSearch.index = store.find("func", this.funcSearch.word, 0);
            }
            if (! (this.funcSearch.index < 0)) {
                this.getFormulaList().getSelectionModel().select(this.funcSearch.index);
                var row = this.getFormulaList().getView().getNode(this.funcSearch.index);
                this.scrollViewToNode(this.getFormulaList(), row);
            }
        }
        this.funcSearch.presstime = new Date().getTime();
    },
    _handleInsertFormula: function (menu, item, opt) {
        if (item.func === "more") {
            var me = this;
            dlgFormulas.addListener("onmodalresult", function (o, mr, s) {
                me.getToolBar().fireEvent("editcomplete", me.getToolBar(), {
                    checkorder: true
                });
                Common.component.Analytics.trackEvent("Toolbar", "Insert formula");
            },
            this, {
                single: true
            });
            dlgFormulas.show();
        } else {
            if (! (this.getFormulaList().getStore().getCount() > 0)) {
                this._reloadFormulas();
            }
            var index = this.getFormulaList().getStore().findExact("func", item.func);
            if (! (index < 0)) {
                var record = this.getFormulaList().getStore().getAt(index);
                this.api.asc_insertFormula(record.data.func, true);
            }
            this.getToolBar().fireEvent("editcomplete", this.getToolBar(), {
                checkorder: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Insert formula");
        }
    },
    _expandFormulaField: function () {
        if (this.getInfoBox().getHeight() > 23) {
            this.getInfoBox().keep_height = this.getInfoBox().getHeight();
            this.getInfoBox().setHeight(23);
            this.getButtonExpand().removeCls("button-collapse");
        } else {
            this.getInfoBox().setHeight(this.getInfoBox().keep_height);
            this.getButtonExpand().addCls("button-collapse");
        }
    },
    onCoAuthoringDisconnect: function () {
        if (dlgFormulas.isVisible()) {
            dlgFormulas.hide();
        }
        this.getInfoBox().setMode({
            isDisconnected: true
        });
    }
});