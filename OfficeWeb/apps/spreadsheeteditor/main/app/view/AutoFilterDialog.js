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
 define(["common/main/lib/component/Window"], function () {
    SSE.Views = SSE.Views || {};
    SSE.Views.DigitalFilterDialog = Common.UI.Window.extend(_.extend({
        initialize: function (options) {
            var t = this,
            _options = {};
            _.extend(_options, {
                width: 500,
                height: 230,
                contentWidth: 180,
                header: true,
                cls: "filter-dlg",
                contentTemplate: "",
                title: t.txtTitle,
                items: []
            },
            options);
            this.template = options.template || ['<div class="box" style="height:' + (_options.height - 85) + 'px;">', '<div class="content-panel" >', '<label class="header">', t.textShowRows, "</label>", '<div style="margin-top:15px;">', '<div id="id-search-begin-digital-combo" class="input-group-nr" style="vertical-align:top;width:225px;display:inline-block;"></div>', '<div id="id-sd-cell-search-begin" class="" style="width:225px;display:inline-block;margin-left:18px;"></div>', "</div>", "<div>", '<div id="id-and-radio" class="padding-small" style="display: inline-block; margin-top:10px;"></div>', '<div id="id-or-radio" class="padding-small" style="display: inline-block; margin-left:25px;"></div>', "</div>", '<div style="margin-top:10px;">', '<div id="id-search-end-digital-combo" class="input-group-nr" style="vertical-align:top;width:225px;display:inline-block;"></div>', '<div id="id-sd-cell-search-end" class="" style="width:225px;display:inline-block;margin-left:18px;"></div>', "</div>", "</div>", "</div>", '<div class="separator horizontal" style="width:100%"></div>', '<div class="footer right" style="margin-left:-15px;">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right:10px;">', t.okButtonText, "</button>", '<button class="btn normal dlg-btn" result="cancel">', t.cancelButtonText, "</button>", "</div>"].join("");
            this.api = options.api;
            this.handler = options.handler;
            _options.tpl = _.template(this.template, _options);
            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var conditions = [{
                value: c_oAscCustomAutoFilter.equals,
                displayValue: this.capCondition1
            },
            {
                value: c_oAscCustomAutoFilter.doesNotEqual,
                displayValue: this.capCondition2
            },
            {
                value: c_oAscCustomAutoFilter.isGreaterThan,
                displayValue: this.capCondition3
            },
            {
                value: c_oAscCustomAutoFilter.isGreaterThanOrEqualTo,
                displayValue: this.capCondition4
            },
            {
                value: c_oAscCustomAutoFilter.isLessThan,
                displayValue: this.capCondition5
            },
            {
                value: c_oAscCustomAutoFilter.isLessThanOrEqualTo,
                displayValue: this.capCondition6
            },
            {
                value: c_oAscCustomAutoFilter.beginsWith,
                displayValue: this.capCondition7
            },
            {
                value: c_oAscCustomAutoFilter.doesNotBeginWith,
                displayValue: this.capCondition8
            },
            {
                value: c_oAscCustomAutoFilter.endsWith,
                displayValue: this.capCondition9
            },
            {
                value: c_oAscCustomAutoFilter.doesNotEndWith,
                displayValue: this.capCondition10
            },
            {
                value: c_oAscCustomAutoFilter.contains,
                displayValue: this.capCondition11
            },
            {
                value: c_oAscCustomAutoFilter.doesNotContain,
                displayValue: this.capCondition12
            }];
            this.cmbCondition1 = new Common.UI.ComboBox({
                el: $("#id-search-begin-digital-combo", this.$window),
                menuStyle: "min-width: 225px;",
                cls: "input-group-nr",
                data: conditions,
                editable: false
            });
            this.cmbCondition1.setValue(c_oAscCustomAutoFilter.equals);
            conditions.splice(0, 0, {
                value: 0,
                displayValue: this.textNoFilter
            });
            this.cmbCondition2 = new Common.UI.ComboBox({
                el: $("#id-search-end-digital-combo", this.$window),
                menuStyle: "min-width: 225px;",
                cls: "input-group-nr",
                data: conditions,
                editable: false
            });
            this.cmbCondition2.setValue(0);
            this.rbAnd = new Common.UI.RadioBox({
                el: $("#id-and-radio", this.$window),
                labelText: this.capAnd,
                name: "asc-radio-filter-tab",
                checked: true
            });
            this.rbOr = new Common.UI.RadioBox({
                el: $("#id-or-radio", this.$window),
                labelText: this.capOr,
                name: "asc-radio-filter-tab"
            });
            this.txtValue1 = new Common.UI.InputField({
                el: $("#id-sd-cell-search-begin", this.$window),
                template: _.template(['<div class="input-field" style="<%= style %>">', "<input ", 'type="<%= type %>" ', 'name="<%= name %>" ', 'class="form-control <%= cls %>" style="float:none" ', 'placeholder="<%= placeHolder %>" ', 'value="<%= value %>"', ">", "</div>"].join("")),
                allowBlank: true,
                validation: function () {
                    return true;
                }
            });
            this.txtValue2 = new Common.UI.InputField({
                el: $("#id-sd-cell-search-end", this.$window),
                template: _.template(['<div class="input-field" style="<%= style %>">', "<input ", 'type="<%= type %>" ', 'name="<%= name %>" ', 'class="form-control <%= cls %>" style="float:none" ', 'placeholder="<%= placeHolder %>" ', 'value="<%= value %>"', ">", "</div>"].join("")),
                allowBlank: true,
                validation: function () {
                    return true;
                }
            });
            this.$window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
            this.loadDefaults();
        },
        show: function () {
            Common.UI.Window.prototype.show.call(this);
            var me = this;
            _.defer(function () {
                if (me.txtValue1) {
                    me.txtValue1.focus();
                }
            },
            500);
        },
        close: function () {
            if (this.api) {
                this.api.asc_enableKeyEvents(true);
            }
            Common.UI.Window.prototype.close.call(this);
        },
        onBtnClick: function (event) {
            if (event.currentTarget.attributes && event.currentTarget.attributes.result) {
                if ("ok" === event.currentTarget.attributes.result.value) {
                    this.save();
                }
                this.close();
            }
        },
        setSettings: function (properties) {
            this.properties = properties;
        },
        loadDefaults: function () {
            if (this.properties && this.rbOr && this.rbAnd && this.cmbCondition1 && this.cmbCondition2 && this.txtValue1 && this.txtValue2) {
                (this.properties.asc_getIsChecked()) ? this.rbOr.setValue(true) : this.rbAnd.setValue(true);
                this.cmbCondition1.setValue(this.properties.asc_getFilter1() || c_oAscCustomAutoFilter.equals);
                this.cmbCondition2.setValue(this.properties.asc_getFilter2() || 0);
                this.txtValue1.setValue(null === this.properties.asc_getValFilter1() ? "" : this.properties.asc_getValFilter1());
                this.txtValue2.setValue(null === this.properties.asc_getValFilter2() ? "" : this.properties.asc_getValFilter2());
            }
        },
        save: function () {
            if (this.api && this.properties && this.rbOr && this.rbAnd && this.cmbCondition1 && this.cmbCondition2 && this.txtValue1 && this.txtValue2) {
                var options = new Asc.AutoFiltersOptions();
                if (options) {
                    options.asc_setCellId(this.properties.asc_getCellId());
                    options.asc_setIsChecked(this.rbOr.getValue());
                    options.asc_setFilter1(this.cmbCondition1.getValue());
                    options.asc_setFilter2(this.cmbCondition2.getValue() || undefined);
                    options.asc_setValFilter1(this.txtValue1.getValue());
                    options.asc_setValFilter2(this.txtValue2.getValue());
                    this.api.asc_applyAutoFilter("digitalFilter", options);
                }
            }
        },
        onPrimary: function () {
            this.save();
            this.close();
            return false;
        },
        cancelButtonText: "Cancel",
        capAnd: "And",
        capCondition1: "equals",
        capCondition10: "does not end with",
        capCondition11: "contains",
        capCondition12: "does not contain",
        capCondition2: "does not equal",
        capCondition3: "is greater than",
        capCondition4: "is greater than or equal to",
        capCondition5: "is less than",
        capCondition6: "is less than or equal to",
        capCondition7: "begins with",
        capCondition8: "does not begin with",
        capCondition9: "ends with",
        capOr: "Or",
        textNoFilter: "no filter",
        textShowRows: "Show rows where",
        textUse1: "Use ? to present any single character",
        textUse2 : "Use * to present any series of character",
        txtTitle: "Custom Filter"
    },
    SSE.Views.DigitalFilterDialog || {}));
    SSE.Views.AutoFilterDialog = Common.UI.Window.extend(_.extend({
        initialize: function (options) {
            var t = this,
            _options = {};
            _.extend(_options, {
                width: 270,
                height: 450,
                contentWidth: 400,
                header: true,
                cls: "filter-dlg",
                contentTemplate: "",
                title: t.txtTitle,
                items: []
            },
            options);
            this.template = options.template || ['<div class="box" style="height:' + (_options.height - 85) + 'px;">', '<div class="content-panel">', '<div class="">', '<div id="id-btn-sort-down" class="btn-placeholder border"></div>', '<div id="id-btn-sort-up" class="btn-placeholder border"></div>', '<div id="id-checkbox-custom-filter" style="max-width:50px;margin-left:50px;display:inline-block;"></div>', '<button class="btn normal dlg-btn primary" result="custom" id="id-btn-custom-filter" style="min-width:120px;">', t.btnCustomFilter, "</button>", '<div id="id-sd-cell-search" class="input-row" style="margin-bottom:10px;"></div>', '<div class="border-values" style="margin-top:45px;">', '<div id="id-dlg-filter-values" class="combo-values"/>', "</div>", "</div>", "</div>", "</div>", '<div class="separator horizontal"></div>', '<div class="footer center">', '<div id="id-apply-filter" style="display: inline-block;"></div>', '<button class="btn normal dlg-btn" result="cancel">', t.cancelButtonText, "</button>", "</div>"].join("");
            this.api = options.api;
            this.handler = options.handler;
            this.throughIndexes = [];
            _options.tpl = _.template(this.template, _options);
            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {
            var me = this;
            Common.UI.Window.prototype.render.call(this);
            this.$window.find(".btn").on("click", _.bind(this.onBtnClick, this));
            this.btnOk = new Common.UI.Button({
                cls: "btn normal dlg-btn primary",
                caption: this.okButtonText,
                style: "margin-right:10px;",
                enableToggle: false,
                allowDepress: false
            });
            if (this.btnOk) {
                this.btnOk.render($("#id-apply-filter", this.$window));
                this.btnOk.on("click", _.bind(this.onApplyFilter, this));
            }
            this.btnSortDown = new Common.UI.Button({
                cls: "btn-toolbar btn-toolbar-default border",
                iconCls: "btn-icon btn-sort-down",
                pressed: true,
                enableToggle: true,
                allowDepress: false
            });
            if (this.btnSortDown) {
                this.btnSortDown.render($("#id-btn-sort-down", this.$window));
                this.btnSortDown.on("click", _.bind(this.onSortType, this, "ascending"));
            }
            this.btnSortUp = new Common.UI.Button({
                cls: "btn-toolbar btn-toolbar-default border",
                iconCls: "btn-icon btn-sort-up",
                pressed: true,
                enableToggle: true,
                allowDepress: false
            });
            if (this.btnSortUp) {
                this.btnSortUp.render($("#id-btn-sort-up", this.$window));
                this.btnSortUp.on("click", _.bind(this.onSortType, this, "descending"));
            }
            this.chCustomFilter = new Common.UI.CheckBox({
                el: $("#id-checkbox-custom-filter", this.$window)
            });
            this.chCustomFilter.setDisabled(true);
            this.btnCustomFilter = new Common.UI.Button({
                el: $("#id-btn-custom-filter", this.$window)
            }).on("click", _.bind(this.onShowCustomFilterDialog, this));
            this.input = new Common.UI.InputField({
                el: $("#id-sd-cell-search", this.$window),
                allowBlank: true,
                placeHolder: this.txtEmpty,
                style: "margin-top: 10px;",
                validateOnChange: true,
                validation: function () {
                    return true;
                }
            }).on("changing", function (input, value) {
                if (value.length) {
                    value = value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                    me.filter = new RegExp(value, "ig");
                } else {
                    me.filter = undefined;
                }
                me.setupDataCells();
            });
            this.cells = new Common.UI.DataViewStore();
            this.filterExcludeCells = new Common.UI.DataViewStore();
            if (this.cells) {
                this.cellsList = new Common.UI.ListView({
                    el: $("#id-dlg-filter-values", this.$window),
                    store: this.cells,
                    template: _.template(['<div class="listview inner" style="border:none;"></div>'].join("")),
                    itemTemplate: _.template(["<div>", '<label class="checkbox-indeterminate" style="position:absolute;">', "<% if (!check) { %>", '<input type="button"/>', "<% } else { %>", '<input type="button" class="checked"/>', "<% } %>", "</label>", '<div id="<%= id %>" class="list-item" style="pointer-events:none;margin-left:20px;display:inline-block;"><%= value %></div>', "</div>"].join(""))
                });
                this.cellsList.on("item:select", _.bind(this.onCellCheck, this));
                this.cellsList.onKeyDown = _.bind(this.onListKeyDown, this);
            }
            this.setupListCells();
        },
        show: function () {
            Common.UI.Window.prototype.show.call(this);
            var me = this;
            if (this.input) {
                _.delay(function () {
                    me.input.$el.find("input").focus();
                },
                500, this);
            }
        },
        onBtnClick: function (event) {
            if (event.currentTarget.attributes && event.currentTarget.attributes.result) {
                if ("cancel" === event.currentTarget.attributes.result.value) {
                    this.close();
                }
            }
        },
        onApplyFilter: function () {
            if (this.testFilter()) {
                this.save();
                this.close();
            }
        },
        onSortType: function (type) {
            if (this.api && this.configTo) {
                this.api.asc_sortColFilter(type, this.configTo.asc_getCellId());
            }
            this.close();
        },
        onShowCustomFilterDialog: function () {
            var me = this,
            dlgDigitalFilter = new SSE.Views.DigitalFilterDialog({
                api: this.api
            }).on({
                "close": function () {
                    me.close();
                }
            });
            dlgDigitalFilter.setSettings(this.configTo);
            dlgDigitalFilter.show();
            this.close();
        },
        onCellCheck: function (listView, itemView, record) {
            if (this.checkCellTrigerBlock) {
                return;
            }
            var target = "",
            type = "",
            isLabel = false,
            bound = null;
            var event = window.event ? window.event : window._event;
            if (event) {
                type = event.target.type;
                target = $(event.currentTarget).find(".list-item");
                if (target.length) {
                    bound = target.get(0).getBoundingClientRect();
                    if (bound.left < event.clientX && event.clientX < bound.right && bound.top < event.clientY && event.clientY < bound.bottom) {
                        isLabel = true;
                    }
                }
                if (type === "button" || isLabel) {
                    this.updateCellCheck(listView, record);
                    _.delay(function () {
                        listView.$el.find(".listview").focus();
                    },
                    100, this);
                }
            }
        },
        onListKeyDown: function (e, data) {
            var record = null,
            listView = this.cellsList;
            if (listView.disabled) {
                return;
            }
            if (_.isUndefined(undefined)) {
                data = e;
            }
            if (data.keyCode == Common.UI.Keys.SPACE) {
                data.preventDefault();
                data.stopPropagation();
                this.updateCellCheck(listView, listView.getSelectedRec()[0]);
            } else {
                Common.UI.DataView.prototype.onKeyDown.call(this.cellsList, e, data);
            }
        },
        updateCellCheck: function (listView, record) {
            if (record && listView) {
                listView.isSuspendEvents = true;
                if ("1" !== record.get("groupid")) {
                    var check = !record.get("check");
                    this.cells.each(function (cell) {
                        cell.set("check", check);
                    });
                } else {
                    record.set("check", !record.get("check"));
                }
                this.chCustomFilter.setValue(false);
                this.btnOk.setDisabled(false);
                listView.isSuspendEvents = false;
                listView.scroller.update({
                    minScrollbarLength: 40,
                    alwaysVisibleY: true
                });
            }
        },
        setSettings: function (config) {
            this.config = config;
            this.configTo = config;
        },
        setupListCells: function () {
            function isNumeric(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }
            var me = this,
            isnumber, value, index = 0,
            haveUnselectedCell = false,
            throughIndex = 1,
            isCustomFilter = (this.configTo.asc_getIsCustomFilter() === true);
            if (_.isUndefined(this.config)) {
                return;
            }
            this.cells.reset();
            this.filterExcludeCells.reset();
            me.cells.push(new Common.UI.DataViewModel({
                id: ++index,
                selected: false,
                allowSelected: true,
                value: this.textSelectAll,
                groupid: "0",
                check: true,
                throughIndex: 0
            }));
            this.throughIndexes.push(true);
            this.config.asc_getResult().forEach(function (item) {
                value = item.asc_getVal();
                isnumber = isNumeric(value);
                if ("hidden" !== item.asc_getVisible()) {
                    me.cells.push(new Common.UI.DataViewModel({
                        id: ++index,
                        selected: false,
                        allowSelected: true,
                        cellvalue: value,
                        value: isnumber ? value : (value.length > 0 ? value : me.textEmptyItem),
                        rowvisible: item.asc_getVisible(),
                        intval: isnumber ? parseFloat(value) : undefined,
                        strval: !isnumber ? value : "",
                        groupid: "1",
                        check: item.asc_getVisible(),
                        throughIndex: throughIndex
                    }));
                    if (!item.asc_getVisible()) {
                        haveUnselectedCell = true;
                    }
                    me.throughIndexes.push(item.asc_getVisible());
                    ++throughIndex;
                }
            });
            this.checkCellTrigerBlock = true;
            this.cells.at(0).set("check", !haveUnselectedCell);
            this.checkCellTrigerBlock = undefined;
            this.btnSortDown.toggle(false, false);
            this.btnSortUp.toggle(false, false);
            var sort = this.config.asc_getSortState();
            if (sort) {
                if ("ascending" === sort) {
                    this.btnSortDown.toggle(true, false);
                } else {
                    this.btnSortUp.toggle(true, false);
                }
            }
            this.chCustomFilter.setValue(isCustomFilter);
            this.btnOk.setDisabled(isCustomFilter);
            this.cellsList.scroller.update({
                minScrollbarLength: 40,
                alwaysVisibleY: true
            });
            this.config = undefined;
        },
        setupDataCells: function () {
            function isNumeric(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            }
            var me = this,
            isnumber, value, index = 0,
            applyfilter = true,
            throughIndex = 1;
            this.cells.forEach(function (item) {
                value = item.get("check");
                if (_.isUndefined(value)) {
                    value = false;
                }
                me.throughIndexes[parseInt(item.get("throughIndex"))] = item.get("check");
            });
            this.cells.reset();
            this.filterExcludeCells.reset();
            if (!me.filter) {
                me.cells.push(new Common.UI.DataViewModel({
                    id: ++index,
                    selected: false,
                    allowSelected: true,
                    value: this.textSelectAll,
                    groupid: "0",
                    check: me.throughIndexes[0],
                    throughIndex: 0
                }));
            }
            this.configTo.asc_getResult().forEach(function (item) {
                value = item.asc_getVal();
                isnumber = isNumeric(value);
                applyfilter = true;
                if (me.filter) {
                    if (null === value.match(me.filter)) {
                        applyfilter = false;
                    }
                }
                if ("hidden" !== item.asc_getVisible()) {
                    if (applyfilter) {
                        me.cells.push(new Common.UI.DataViewModel({
                            id: ++index,
                            selected: false,
                            allowSelected: true,
                            cellvalue: value,
                            value: isnumber ? value : (value.length > 0 ? value : me.textEmptyItem),
                            rowvisible: item.asc_getVisible(),
                            intval: isnumber ? parseFloat(value) : undefined,
                            strval: !isnumber ? value : "",
                            groupid: "1",
                            check: me.throughIndexes[throughIndex],
                            throughIndex: throughIndex
                        }));
                    } else {
                        me.filterExcludeCells.push(new Common.UI.DataViewModel({
                            cellvalue: value
                        }));
                    }++throughIndex;
                }
            });
            if (this.cells.length) {
                this.chCustomFilter.setValue(this.configTo.asc_getIsCustomFilter() === true);
            }
            this.cellsList.scroller.update({
                minScrollbarLength: 40,
                alwaysVisibleY: true
            });
        },
        testFilter: function () {
            var me = this,
            isValid = false;
            if (this.cells) {
                this.cells.forEach(function (item) {
                    if ("1" === item.get("groupid")) {
                        if (item.get("check")) {
                            isValid = true;
                        }
                    }
                });
            }
            if (!isValid) {
                Common.UI.warning({
                    title: this.textWarning,
                    msg: this.warnNoSelected,
                    callback: function () {
                        _.delay(function () {
                            me.input.$el.find("input").focus();
                        },
                        100, this);
                    }
                });
            }
            return isValid;
        },
        save: function () {
            if (this.api && this.configTo && this.cells && this.filterExcludeCells) {
                var options = new Asc.AutoFiltersOptions();
                if (options) {
                    options.asc_setCellId(this.configTo.asc_getCellId());
                    var me = this,
                    result_arr = [],
                    visibility;
                    this.cells.forEach(function (item) {
                        if ("1" === item.get("groupid")) {
                            if ((visibility = item.get("rowvisible")) !== "hidden") {
                                visibility = item.get("check");
                                result_arr.push(new Asc.AutoFiltersOptionsElements(item.get("cellvalue"), visibility));
                            }
                        }
                    });
                    this.filterExcludeCells.forEach(function (item) {
                        result_arr.push(new Asc.AutoFiltersOptionsElements(item.get("cellvalue"), false));
                    });
                    options.asc_setResult(result_arr);
                    options.sortState = this.configTo.asc_getSortState();
                    this.api.asc_applyAutoFilter("mainFilter", options);
                }
            }
        },
        onPrimary: function () {
            this.save();
            this.close();
            return false;
        },
        okButtonText: "Ok",
        btnCustomFilter: "Custom Filter",
        textSelectAll: "Select All",
        txtTitle: "Filter",
        warnNoSelected: "You must choose at least one value",
        textWarning: "Warning",
        cancelButtonText: "Cancel",
        textEmptyItem: "{Blanks}",
        txtEmpty: "Enter cell's filter"
    },
    SSE.Views.AutoFilterDialog || {}));
});