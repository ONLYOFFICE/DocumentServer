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
 define(["common/main/lib/view/DocumentAccessDialog"], function () { ! DE.Views.FileMenuPanels && (DE.Views.FileMenuPanels = {});
    DE.Views.FileMenuPanels.ViewSaveAs = Common.UI.BaseView.extend({
        el: "#panel-saveas",
        menu: undefined,
        formats: [[{
            name: "PDF",
            imgCls: "pdf",
            type: c_oAscFileType.PDF
        },
        {
            name: "TXT",
            imgCls: "txt",
            type: c_oAscFileType.TXT
        },
        {
            name: "DOCX",
            imgCls: "docx",
            type: c_oAscFileType.DOCX
        }], [{
            name: "ODT",
            imgCls: "odt",
            type: c_oAscFileType.ODT
        },
        {
            name: "HTML (Zipped)",
            imgCls: "html",
            type: c_oAscFileType.HTML_ZIP
        }]],
        template: _.template(["<table><tbody>", "<% _.each(rows, function(row) { %>", "<tr>", "<% _.each(row, function(item) { %>", '<td><span class="btn-doc-format <%= item.imgCls %>" /></td>', "<% }) %>", "</tr>", "<% }) %>", "</tbody></table>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.menu = options.menu;
        },
        render: function () {
            $(this.el).html(this.template({
                rows: this.formats
            }));
            $(".btn-doc-format", this.el).on("click", _.bind(this.onFormatClick, this));
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el),
                    suppressScrollX: true
                });
            }
            this.flatFormats = _.flatten(this.formats);
            return this;
        },
        onFormatClick: function (e) {
            var format = /\s(\w+)/.exec(e.currentTarget.className);
            if (format) {
                format = format[1];
                var item = _.findWhere(this.flatFormats, {
                    imgCls: format
                });
                if (item && this.menu) {
                    this.menu.fireEvent("saveas:format", [this.menu, item.type]);
                }
            }
        }
    });
    DE.Views.FileMenuPanels.Settings = Common.UI.BaseView.extend(_.extend({
        el: "#panel-settings",
        menu: undefined,
        template: _.template(["<table><tbody>", '<tr class="edit">', '<td class="left"><label><%= scope.txtInput %></label></td>', '<td class="right"><div id="fms-chb-input-mode"/></td>', "</tr>", '<tr class="divider edit"></tr>', '<tr class="coauth">', '<td class="left"><label><%= scope.txtLiveComment %></label></td>', '<td class="right"><div id="fms-chb-live-comment"/></td>', "</tr>", '<tr class="divider coauth"></tr>', '<tr class="edit">', '<td class="left"><label><%= scope.txtSpellCheck %></label></td>', '<td class="right"><div id="fms-chb-spell-check"/></td>', "</tr>", '<tr class="divider edit"></tr>', '<tr class="autosave">', '<td class="left"><label><%= scope.textAutoSave %></label></td>', '<td class="right"><span id="fms-chb-autosave" /></td>', "</tr>", '<tr class="divider autosave"></tr>', "<tr>", '<td class="left"><label><%= scope.textAlignGuides %></label></td>', '<td class="right"><span id="fms-chb-align-guides" /></td>', "</tr>", '<tr class="divider"></tr>', "<tr>", '<td class="left"><label><%= scope.strZoom %></label></td>', '<td class="right"><div id="fms-cmb-zoom" class="input-group-nr" /></td>', "</tr>", '<tr class="divider"></tr>', '<tr class="coauth">', '<td class="left"><label><%= scope.strShowChanges %></label></td>', '<td class="right"><span id="fms-cmb-show-changes" /></td>', "</tr>", '<tr class="divider coauth"></tr>', "<tr>", '<td class="left"><label><%= scope.strFontRender %></label></td>', '<td class="right"><span id="fms-cmb-font-render" /></td>', "</tr>", '<tr class="divider"></tr>', '<tr class="edit">', '<td class="left"><label><%= scope.strUnit %></label></td>', '<td class="right"><span id="fms-cmb-unit" /></td>', "</tr>", '<tr class="divider edit"></tr>', "<tr>", '<td class="left"></td>', '<td class="right"><button id="fms-btn-apply" class="btn normal dlg-btn primary"><%= scope.okButtonText %></button></td>', "</tr>", "</tbody></table>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.menu = options.menu;
        },
        render: function () {
            $(this.el).html(this.template({
                scope: this
            }));
            this.chInputMode = new Common.UI.CheckBox({
                el: $("#fms-chb-input-mode"),
                labelText: this.strInputMode
            });
            this.chLiveComment = new Common.UI.CheckBox({
                el: $("#fms-chb-live-comment"),
                labelText: this.strLiveComment
            });
            this.chSpell = new Common.UI.CheckBox({
                el: $("#fms-chb-spell-check"),
                labelText: this.strSpellCheckMode
            });
            this.chAutosave = new Common.UI.CheckBox({
                el: $("#fms-chb-autosave"),
                labelText: this.strAutosave
            });
            this.chAlignGuides = new Common.UI.CheckBox({
                el: $("#fms-chb-align-guides"),
                labelText: this.strAlignGuides
            });
            this.cmbZoom = new Common.UI.ComboBox({
                el: $("#fms-cmb-zoom"),
                style: "width: 160px;",
                editable: false,
                cls: "input-group-nr",
                data: [{
                    value: 50,
                    displayValue: "50%"
                },
                {
                    value: 60,
                    displayValue: "60%"
                },
                {
                    value: 70,
                    displayValue: "70%"
                },
                {
                    value: 80,
                    displayValue: "80%"
                },
                {
                    value: 90,
                    displayValue: "90%"
                },
                {
                    value: 100,
                    displayValue: "100%"
                },
                {
                    value: 110,
                    displayValue: "110%"
                },
                {
                    value: 120,
                    displayValue: "120%"
                },
                {
                    value: 150,
                    displayValue: "150%"
                },
                {
                    value: 175,
                    displayValue: "175%"
                },
                {
                    value: 200,
                    displayValue: "200%"
                }]
            });
            this.cmbShowChanges = new Common.UI.ComboBox({
                el: $("#fms-cmb-show-changes"),
                style: "width: 160px;",
                editable: false,
                cls: "input-group-nr",
                data: [{
                    value: "none",
                    displayValue: this.txtNone
                },
                {
                    value: "all",
                    displayValue: this.txtAll
                },
                {
                    value: "last",
                    displayValue: this.txtLast
                }]
            });
            this.cmbFontRender = new Common.UI.ComboBox({
                el: $("#fms-cmb-font-render"),
                style: "width: 160px;",
                editable: false,
                cls: "input-group-nr",
                data: [{
                    value: 0,
                    displayValue: this.txtWin
                },
                {
                    value: 1,
                    displayValue: this.txtMac
                },
                {
                    value: 2,
                    displayValue: this.txtNative
                }]
            });
            this.cmbUnit = new Common.UI.ComboBox({
                el: $("#fms-cmb-unit"),
                style: "width: 160px;",
                editable: false,
                cls: "input-group-nr",
                data: [{
                    value: Common.Utils.Metric.c_MetricUnits["cm"],
                    displayValue: this.txtCm
                },
                {
                    value: Common.Utils.Metric.c_MetricUnits["pt"],
                    displayValue: this.txtPt
                }]
            });
            this.btnApply = new Common.UI.Button({
                el: "#fms-btn-apply"
            });
            this.btnApply.on("click", _.bind(this.applySettings, this));
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el),
                    suppressScrollX: true
                });
            }
            return this;
        },
        show: function () {
            Common.UI.BaseView.prototype.show.call(this, arguments);
            this.updateSettings();
        },
        setMode: function (mode) {
            $("tr.edit", this.el)[mode.isEdit ? "show" : "hide"]();
            $("tr.autosave", this.el)[mode.isEdit && mode.canAutosave ? "show" : "hide"]();
            $("tr.coauth", this.el)[mode.canCoAuthoring && mode.isEdit ? "show" : "hide"]();
        },
        updateSettings: function () {
            var value = window.localStorage.getItem("de-settings-inputmode");
            this.chInputMode.setValue(value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-settings-zoom");
            var item = this.cmbZoom.store.findWhere({
                value: parseInt(value)
            });
            this.cmbZoom.setValue(item ? parseInt(item.get("value")) : 100);
            value = window.localStorage.getItem("de-settings-livecomment");
            this.chLiveComment.setValue(!(value !== null && parseInt(value) == 0));
            value = window.localStorage.getItem("de-settings-showchanges");
            item = this.cmbShowChanges.store.findWhere({
                value: value
            });
            this.cmbShowChanges.setValue(item ? item.get("value") : "last");
            value = window.localStorage.getItem("de-settings-fontrender");
            item = this.cmbFontRender.store.findWhere({
                value: parseInt(value)
            });
            this.cmbFontRender.setValue(item ? item.get("value") : (window.devicePixelRatio > 1 ? 1 : 0));
            value = window.localStorage.getItem("de-settings-unit");
            item = this.cmbUnit.store.findWhere({
                value: parseInt(value)
            });
            this.cmbUnit.setValue(item ? parseInt(item.get("value")) : 0);
            this._oldUnits = this.cmbUnit.getValue();
            value = window.localStorage.getItem("de-settings-autosave");
            this.chAutosave.setValue(value === null || parseInt(value) == 1);
            value = window.localStorage.getItem("de-settings-spellcheck");
            this.chSpell.setValue(value === null || parseInt(value) == 1);
            value = window.localStorage.getItem("de-settings-showsnaplines");
            this.chAlignGuides.setValue(value === null || parseInt(value) == 1);
        },
        applySettings: function () {
            window.localStorage.setItem("de-settings-inputmode", this.chInputMode.isChecked() ? 1 : 0);
            window.localStorage.setItem("de-settings-zoom", this.cmbZoom.getValue());
            window.localStorage.setItem("de-settings-livecomment", this.chLiveComment.isChecked() ? 1 : 0);
            window.localStorage.setItem("de-settings-showchanges", this.cmbShowChanges.getValue());
            window.localStorage.setItem("de-settings-fontrender", this.cmbFontRender.getValue());
            window.localStorage.setItem("de-settings-unit", this.cmbUnit.getValue());
            window.localStorage.setItem("de-settings-autosave", this.chAutosave.isChecked() ? 1 : 0);
            window.localStorage.setItem("de-settings-spellcheck", this.chSpell.isChecked() ? 1 : 0);
            window.localStorage.setItem("de-settings-showsnaplines", this.chAlignGuides.isChecked() ? 1 : 0);
            if (this.menu) {
                this.menu.fireEvent("settings:apply", [this.menu]);
                if (this._oldUnits !== this.cmbUnit.getValue()) {
                    Common.NotificationCenter.trigger("settings:unitschanged", this);
                }
            }
        },
        strLiveComment: "Turn on option",
        strInputMode: "Turn on hieroglyphs",
        strZoom: "Default Zoom Value",
        strShowChanges: "Realtime Collaboration Changes",
        txtAll: "View All",
        txtNone: "View Nothing",
        txtLast: "View Last",
        txtLiveComment: "Live Commenting",
        okButtonText: "Apply",
        txtInput: "Alternate Input",
        txtWin: "as Windows",
        txtMac: "as OS X",
        txtNative: "Native",
        strFontRender: "Font Hinting",
        strUnit: "Unit of Measurement",
        txtCm: "Centimeter",
        txtPt: "Point",
        textAutoSave: "Autosave",
        strAutosave: "Turn on autosave",
        txtSpellCheck: "Spell Checking",
        strSpellCheckMode: "Turn on spell checking option",
        textAlignGuides: "Alignment Guides",
        strAlignGuides: "Turn on alignment guides"
    },
    DE.Views.FileMenuPanels.Settings || {}));
    DE.Views.FileMenuPanels.RecentFiles = Common.UI.BaseView.extend({
        el: "#panel-recentfiles",
        menu: undefined,
        template: _.template(['<div id="id-recent-view" style="margin: 20px 0;"></div>'].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.menu = options.menu;
            this.recent = options.recent;
        },
        render: function () {
            $(this.el).html(this.template());
            this.viewRecentPicker = new Common.UI.DataView({
                el: $("#id-recent-view"),
                store: new Common.UI.DataViewStore(this.recent),
                itemTemplate: _.template(['<div class="recent-wrap">', '<div class="recent-icon"></div>', '<div class="file-name"><%= Common.Utils.String.htmlEncode(title) %></div>', '<div class="file-info"><%= Common.Utils.String.htmlEncode(folder) %></div>', "</div>"].join(""))
            });
            this.viewRecentPicker.on("item:click", _.bind(this.onRecentFileClick, this));
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el),
                    suppressScrollX: true
                });
            }
            return this;
        },
        onRecentFileClick: function (view, itemview, record) {
            if (this.menu) {
                this.menu.fireEvent("recent:open", [this.menu, record.get("url")]);
            }
        }
    });
    DE.Views.FileMenuPanels.CreateNew = Common.UI.BaseView.extend(_.extend({
        el: "#panel-createnew",
        menu: undefined,
        events: function () {
            return {
                "click .blank-document-btn": _.bind(this._onBlankDocument, this),
                "click .thumb-list .thumb-wrap": _.bind(this._onDocumentTemplate, this)
            };
        },
        template: _.template(['<h3 style="margin-top: 20px;"><%= scope.fromBlankText %></h3><hr noshade />', '<div class="blank-document">', '<div class="blank-document-btn"></div>', '<div class="blank-document-info">', "<h3><%= scope.newDocumentText %></h3>", "<%= scope.newDescriptionText %>", "</div>", "</div>", "<h3><%= scope.fromTemplateText %></h3><hr noshade />", '<div class="thumb-list">', "<% _.each(docs, function(item) { %>", '<div class="thumb-wrap" template="<%= item.name %>">', '<div class="thumb"<% if (!_.isEmpty(item.icon)) { %> style="background-image: url(<%= item.icon %>);" <% } %> />', '<div class="title"><%= item.name %></div>', "</div>", "<% }) %>", "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.menu = options.menu;
        },
        render: function () {
            $(this.el).html(this.template({
                scope: this,
                docs: this.options[0].docs
            }));
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el),
                    suppressScrollX: true
                });
            }
            return this;
        },
        _onBlankDocument: function () {
            if (this.menu) {
                this.menu.fireEvent("create:new", [this.menu, "blank"]);
            }
        },
        _onDocumentTemplate: function (e) {
            if (this.menu) {
                this.menu.fireEvent("create:new", [this.menu, e.currentTarget.attributes["template"].value]);
            }
        },
        fromBlankText: "From Blank",
        newDocumentText: "New Text Document",
        newDescriptionText: "Create a new blank text document which you will be able to style and format after it is created during the editing. Or choose one of the templates to start a document of a certain type or purpose where some styles have already been pre-applied.",
        fromTemplateText: "From Template",
        noTemplatesText: "There are no templates"
    },
    DE.Views.FileMenuPanels.CreateNew || {}));
    DE.Views.FileMenuPanels.DocumentInfo = Common.UI.BaseView.extend(_.extend({
        el: "#panel-info",
        menu: undefined,
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.rendered = false;
            this.template = _.template(['<table class="main">', "<tr>", '<td class="left"><label>' + this.txtTitle + "</label></td>", '<td class="right"><label id="id-info-title">-</label></td>', "</tr>", '<tr class="author">', '<td class="left"><label>' + this.txtAuthor + "</label></td>", '<td class="right"><span class="userLink" id="id-info-author">-</span></td>', "</tr>", '<tr class="placement">', '<td class="left"><label>' + this.txtPlacement + "</label></td>", '<td class="right"><label id="id-info-placement">-</label></td>', "</tr>", '<tr class="date">', '<td class="left"><label>' + this.txtDate + "</label></td>", '<td class="right"><label id="id-info-date">-</label></td>', "</tr>", '<tr class="divider date"></tr>', '<tr class="rights">', '<td class="left" style="vertical-align: top;"><label>' + this.txtRights + "</label></td>", '<td class="right"><div id="id-info-rights"></div></td>', "</tr>", '<tr class="edit-rights">', '<td class="left"></td><td class="right"><button id="id-info-btn-edit" class="btn normal dlg-btn primary" style="margin-right: 10px;width: auto;">' + this.txtBtnAccessRights + "</button></td>", "</tr>", '<tr class="divider rights"></tr>', "<tr>", '<td class="left" style="vertical-align: top;"><label>' + this.txtStatistics + "</label></td>", '<td class="right" style="vertical-align: top;"><div id="id-info-statistic">', "<table>", "<tr>", "<td><label>" + this.txtPages + "</label></td>", '<td><label id="id-info-pages"></label></td>', "</tr>", "<tr>", "<td><label>" + this.txtParagraphs + "</label></td>", '<td><label id="id-info-paragraphs"></label></td>', "</tr>", "<tr>", "<td><label>" + this.txtWords + "</label></td>", '<td><label id="id-info-words"></label></td>', "</tr>", "<tr>", "<td><label>" + this.txtSymbols + "</label></td>", '<td><label id="id-info-symbols"></label></td>', "</tr>", "<tr>", "<td><label>" + this.txtSpaces + "</label></td>", '<td><label id="id-info-spaces"></label></td>', "</tr>", "</table>", "</div></td>", "</tr>", "</table>"].join(""));
            this.templateRights = _.template(["<table>", "<% _.each(users, function(item) { %>", "<tr>", '<td><span class="userLink"><%= Common.Utils.String.htmlEncode(item.user) %></span></td>', "<td><%= Common.Utils.String.htmlEncode(item.permissions) %></td>", "</tr>", "<% }); %>", "</table>"].join(""));
            this.infoObj = {
                PageCount: 0,
                WordsCount: 0,
                ParagraphCount: 0,
                SymbolsCount: 0,
                SymbolsWSCount: 0
            };
            this.inProgress = false;
            this.menu = options.menu;
        },
        render: function () {
            $(this.el).html(this.template());
            this.lblTitle = $("#id-info-title");
            this.lblPlacement = $("#id-info-placement");
            this.lblDate = $("#id-info-date");
            this.lblAuthor = $("#id-info-author");
            this.lblStatPages = $("#id-info-pages");
            this.lblStatWords = $("#id-info-words");
            this.lblStatParagraphs = $("#id-info-paragraphs");
            this.lblStatSymbols = $("#id-info-symbols");
            this.lblStatSpaces = $("#id-info-spaces");
            this.cntRights = $("#id-info-rights");
            this.btnEditRights = new Common.UI.Button({
                el: "#id-info-btn-edit"
            });
            this.btnEditRights.on("click", _.bind(this.changeAccessRights, this));
            this.rendered = true;
            this.updateInfo(this.doc);
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el),
                    suppressScrollX: true
                });
            }
            return this;
        },
        show: function () {
            Common.UI.BaseView.prototype.show.call(this, arguments);
            this.updateStatisticInfo();
        },
        hide: function () {
            Common.UI.BaseView.prototype.hide.call(this, arguments);
            this.stopUpdatingStatisticInfo();
        },
        updateInfo: function (doc) {
            this.doc = doc;
            if (!this.rendered) {
                return;
            }
            doc = doc || {};
            this.lblTitle.text((doc.title) ? doc.title : "-");
            if (doc.info) {
                if (doc.info.author) {
                    this.lblAuthor.text(doc.info.author);
                }
                this._ShowHideInfoItem("author", doc.info.author !== undefined && doc.info.author !== null);
                if (doc.info.created) {
                    this.lblDate.text(doc.info.created);
                }
                this._ShowHideInfoItem("date", doc.info.created !== undefined && doc.info.created !== null);
                if (doc.info.folder) {
                    this.lblPlacement.text(doc.info.folder);
                }
                this._ShowHideInfoItem("placement", doc.info.folder !== undefined && doc.info.folder !== null);
                if (doc.info.sharingSettings) {
                    this.cntRights.html(this.templateRights({
                        users: doc.info.sharingSettings
                    }));
                }
                this._ShowHideInfoItem("rights", doc.info.sharingSettings !== undefined && doc.info.sharingSettings !== null && this._readonlyRights !== true);
                this._ShowHideInfoItem("edit-rights", !!this.sharingSettingsUrl && this.sharingSettingsUrl.length && this._readonlyRights !== true);
            } else {
                this._ShowHideDocInfo(false);
            }
        },
        _ShowHideInfoItem: function (cls, visible) {
            $("tr." + cls, this.el)[visible ? "show" : "hide"]();
        },
        _ShowHideDocInfo: function (visible) {
            this._ShowHideInfoItem("date", visible);
            this._ShowHideInfoItem("placement", visible);
            this._ShowHideInfoItem("author", visible);
            this._ShowHideInfoItem("rights", visible);
            this._ShowHideInfoItem("edit-rights", visible);
        },
        updateStatisticInfo: function () {
            if (this.api && this.doc) {
                this.api.startGetDocInfo();
            }
        },
        stopUpdatingStatisticInfo: function () {
            if (this.api) {
                this.api.stopGetDocInfo();
            }
        },
        setApi: function (o) {
            this.api = o;
            this.api.asc_registerCallback("asc_onGetDocInfoStart", _.bind(this._onGetDocInfoStart, this));
            this.api.asc_registerCallback("asc_onGetDocInfoStop", _.bind(this._onGetDocInfoEnd, this));
            this.api.asc_registerCallback("asc_onDocInfo", _.bind(this._onDocInfo, this));
            this.api.asc_registerCallback("asc_onGetDocInfoEnd", _.bind(this._onGetDocInfoEnd, this));
            return this;
        },
        setMode: function (mode) {
            this.sharingSettingsUrl = mode.sharingSettingsUrl;
            return this;
        },
        _onGetDocInfoStart: function () {
            var me = this;
            this.inProgress = true;
            this.infoObj = {
                PageCount: 0,
                WordsCount: 0,
                ParagraphCount: 0,
                SymbolsCount: 0,
                SymbolsWSCount: 0
            };
            _.defer(function () {
                if (!me.inProgress) {
                    return;
                }
                me.lblStatPages.text(me.txtLoading);
                me.lblStatWords.text(me.txtLoading);
                me.lblStatParagraphs.text(me.txtLoading);
                me.lblStatSymbols.text(me.txtLoading);
                me.lblStatSpaces.text(me.txtLoading);
            },
            2000);
        },
        _onDocInfo: function (obj) {
            if (obj) {
                if (obj.get_PageCount() > -1) {
                    this.infoObj.PageCount = obj.get_PageCount();
                }
                if (obj.get_WordsCount() > -1) {
                    this.infoObj.WordsCount = obj.get_WordsCount();
                }
                if (obj.get_ParagraphCount() > -1) {
                    this.infoObj.ParagraphCount = obj.get_ParagraphCount();
                }
                if (obj.get_SymbolsCount() > -1) {
                    this.infoObj.SymbolsCount = obj.get_SymbolsCount();
                }
                if (obj.get_SymbolsWSCount() > -1) {
                    this.infoObj.SymbolsWSCount = obj.get_SymbolsWSCount();
                }
            }
        },
        _onGetDocInfoEnd: function () {
            this.inProgress = false;
            this.lblStatPages.text(this.infoObj.PageCount);
            this.lblStatWords.text(this.infoObj.WordsCount);
            this.lblStatParagraphs.text(this.infoObj.ParagraphCount);
            this.lblStatSymbols.text(this.infoObj.SymbolsCount);
            this.lblStatSpaces.text(this.infoObj.SymbolsWSCount);
        },
        changeAccessRights: function (btn, event, opts) {
            var me = this;
            var win = new Common.Views.DocumentAccessDialog({
                settingsurl: this.sharingSettingsUrl
            });
            win.on("accessrights", function (obj, rights) {
                me.doc.info.sharingSettings = rights;
                me.cntRights.html(me.templateRights({
                    users: me.doc.info.sharingSettings
                }));
            });
            win.show();
        },
        onLostEditRights: function () {
            this._readonlyRights = true;
            if (!this.rendered) {
                return;
            }
            this._ShowHideInfoItem("rights", false);
            this._ShowHideInfoItem("edit-rights", false);
        },
        txtTitle: "Document Title",
        txtAuthor: "Author",
        txtPlacement: "Placement",
        txtDate: "Creation Date",
        txtRights: "Persons who have rights",
        txtStatistics: "Statistics",
        txtPages: "Pages",
        txtWords: "Words",
        txtParagraphs: "Paragraphs",
        txtSymbols: "Symbols",
        txtSpaces: "Symbols with spaces",
        txtLoading: "Loading...",
        txtBtnAccessRights: "Change access rights"
    },
    DE.Views.FileMenuPanels.DocumentInfo || {}));
    DE.Views.FileMenuPanels.Help = Common.UI.BaseView.extend({
        el: "#panel-help",
        menu: undefined,
        template: _.template(['<div style="width:100%; height:100%; position: relative;">', '<div id="id-help-contents" style="position: absolute; width:200px; top: 0; bottom: 0;" class="no-padding"></div>', '<div id="id-help-frame" style="position: absolute; left: 200px; top: 0; right: 0; bottom: 0;" class="no-padding"></div>', "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.menu = options.menu;
            this.urlPref = "resources/help/en/";
            this.itemclicked = false;
            this.en_data = [{
                src: "UsageInstructions/SetPageParameters.htm",
                name: "Set page parameters",
                headername: "Usage Instructions",
                selected: true
            },
            {
                src: "UsageInstructions/CopyPasteUndoRedo.htm",
                name: "Copy/paste text passages, undo/redo your actions"
            },
            {
                src: "UsageInstructions/NonprintingCharacters.htm",
                name: "Show/hide nonprinting characters"
            },
            {
                src: "UsageInstructions/AlignText.htm",
                name: "Align your text in a line or paragraph"
            },
            {
                src: "UsageInstructions/FormattingPresets.htm",
                name: "Apply formatting presets"
            },
            {
                src: "UsageInstructions/BackgroundColor.htm",
                name: "Select background color for a paragraph"
            },
            {
                src: "UsageInstructions/ParagraphIndents.htm",
                name: "Change paragraph indents"
            },
            {
                src: "UsageInstructions/LineSpacing.htm",
                name: "Set paragraph line spacing"
            },
            {
                src: "UsageInstructions/PageBreaks.htm",
                name: "Insert page breaks"
            },
            {
                src: "UsageInstructions/AddBorders.htm",
                name: "Add Borders"
            },
            {
                src: "UsageInstructions/FontTypeSizeColor.htm",
                name: "Set font type, size, and color"
            },
            {
                src: "UsageInstructions/DecorationStyles.htm",
                name: "Apply font decoration styles"
            },
            {
                src: "UsageInstructions/CopyClearFormatting.htm",
                name: "Copy/clear text formatting"
            },
            {
                src: "UsageInstructions/CreateLists.htm",
                name: "Create lists"
            },
            {
                src: "UsageInstructions/InsertTables.htm",
                name: "Insert tables"
            },
            {
                src: "UsageInstructions/InsertImages.htm",
                name: "Insert images"
            },
            {
                src: "UsageInstructions/AddHyperlinks.htm",
                name: "Add hyperlinks"
            },
            {
                src: "UsageInstructions/InsertHeadersFooters.htm",
                name: "Insert headers and footers"
            },
            {
                src: "UsageInstructions/InsertPageNumbers.htm",
                name: "Insert page numbers"
            },
            {
                src: "UsageInstructions/ViewDocInfo.htm",
                name: "View document information"
            },
            {
                src: "UsageInstructions/SavePrintDownload.htm",
                name: "Save/print/download your document"
            },
            {
                src: "UsageInstructions/OpenCreateNew.htm",
                name: "Create a new document or open an existing one"
            },
            {
                src: "HelpfulHints/About.htm",
                name: "About ONLYOFFICE Document Editor",
                headername: "Helpful Hints"
            },
            {
                src: "HelpfulHints/SupportedFormats.htm",
                name: "Supported Formats of Electronic Documents"
            },
            {
                src: "HelpfulHints/Navigation.htm",
                name: "Navigation through Your Document"
            },
            {
                src: "HelpfulHints/Search.htm",
                name: "Search Function"
            },
            {
                src: "HelpfulHints/KeyboardShortcuts.htm",
                name: "Keyboard Shortcuts"
            }];
            if (Common.Utils.isIE) {
                window.onhelp = function () {
                    return false;
                };
            }
        },
        render: function () {
            var me = this;
            $(this.el).html(this.template());
            this.viewHelpPicker = new Common.UI.DataView({
                el: $("#id-help-contents"),
                store: new Common.UI.DataViewStore([]),
                keyMoveDirection: "vertical",
                itemTemplate: _.template(['<div id="<%= id %>" class="help-item-wrap">', '<div class="caption"><%= name %></div>', "</div>"].join(""))
            });
            this.viewHelpPicker.on("item:add", function (dataview, itemview, record) {
                if (record.has("headername")) {
                    $(itemview.el).before('<div class="header-name">' + record.get("headername") + "</div>");
                }
            });
            this.viewHelpPicker.on("item:select", function (dataview, itemview, record) {
                me.itemclicked = true;
                me.iFrame.src = me.urlPref + record.get("src");
            });
            this.iFrame = document.createElement("iframe");
            this.iFrame.src = "";
            this.iFrame.align = "top";
            this.iFrame.frameBorder = "0";
            this.iFrame.width = "100%";
            this.iFrame.height = "100%";
            this.iFrame.onload = _.bind(function () {
                if (!this.itemclicked) {
                    var src = arguments[0].currentTarget.contentDocument.URL;
                    var rec = this.viewHelpPicker.store.find(function (record) {
                        return (src.indexOf(record.get("src")) > 0);
                    });
                    if (rec) {
                        this.viewHelpPicker.selectRecord(rec, true);
                        this.viewHelpPicker.scrollToRecord(rec);
                    }
                }
                this.itemclicked = false;
            },
            this);
            Common.Gateway.on("internalcommand", function (data) {
                if (data.type == "help:hyperlink") {
                    if (!me.itemclicked) {
                        var src = data.data;
                        var rec = me.viewHelpPicker.store.find(function (record) {
                            return (src.indexOf(record.get("src")) > 0);
                        });
                        if (rec) {
                            me.viewHelpPicker.selectRecord(rec, true);
                            me.viewHelpPicker.scrollToRecord(rec);
                        }
                    }
                    me.itemclicked = false;
                }
            });
            $("#id-help-frame").append(this.iFrame);
            return this;
        },
        setLangConfig: function (lang) {
            var me = this;
            var store = this.viewHelpPicker.store;
            if (lang) {
                lang = lang.split("-")[0];
                var config = {
                    dataType: "json",
                    error: function () {
                        if (me.urlPref.indexOf("resources/help/en/") < 0) {
                            me.urlPref = "resources/help/en/";
                            store.url = "resources/help/en/Contents.json";
                            store.fetch(config);
                        } else {
                            me.urlPref = "resources/help/en/";
                            store.reset(me.en_data);
                        }
                    },
                    success: function () {
                        var rec = store.at(0);
                        me.viewHelpPicker.selectRecord(rec);
                        me.iFrame.src = me.urlPref + rec.get("src");
                    }
                };
                store.url = "resources/help/" + lang + "/Contents.json";
                store.fetch(config);
                this.urlPref = "resources/help/" + lang + "/";
            }
        },
        show: function () {
            Common.UI.BaseView.prototype.show.call(this);
            if (!this._scrollerInited) {
                this.viewHelpPicker.scroller.update();
                this._scrollerInited = true;
            }
        }
    });
});