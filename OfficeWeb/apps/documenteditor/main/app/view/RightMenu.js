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
 var SCALE_MIN = 40;
var MENU_SCALE_PART = 260;
define(["text!documenteditor/main/app/template/RightMenu.template", "jquery", "underscore", "backbone", "common/main/lib/component/Button", "common/main/lib/component/MetricSpinner", "common/main/lib/component/CheckBox", "documenteditor/main/app/view/ParagraphSettings", "documenteditor/main/app/view/HeaderFooterSettings", "documenteditor/main/app/view/ImageSettings", "documenteditor/main/app/view/ChartSettings", "documenteditor/main/app/view/TableSettings", "documenteditor/main/app/view/ShapeSettings", "common/main/lib/component/Scroller"], function (menuTemplate, $, _, Backbone) {
    DE.Views.RightMenu = Backbone.View.extend(_.extend({
        el: "#right-menu",
        template: _.template(menuTemplate),
        events: {},
        initialize: function () {
            this.minimizedMode = true;
            this.btnText = new Common.UI.Button({
                hint: this.txtParagraphSettings,
                asctype: c_oAscTypeSelectElement.Paragraph,
                enableToggle: true,
                disabled: true,
                toggleGroup: "tabpanelbtnsGroup"
            });
            this.btnTable = new Common.UI.Button({
                hint: this.txtTableSettings,
                asctype: c_oAscTypeSelectElement.Table,
                enableToggle: true,
                disabled: true,
                toggleGroup: "tabpanelbtnsGroup"
            });
            this.btnImage = new Common.UI.Button({
                hint: this.txtImageSettings,
                asctype: c_oAscTypeSelectElement.Image,
                enableToggle: true,
                disabled: true,
                toggleGroup: "tabpanelbtnsGroup"
            });
            this.btnHeaderFooter = new Common.UI.Button({
                hint: this.txtHeaderFooterSettings,
                asctype: c_oAscTypeSelectElement.Header,
                enableToggle: true,
                disabled: true,
                toggleGroup: "tabpanelbtnsGroup"
            });
            this.btnChart = new Common.UI.Button({
                hint: this.txtChartSettings,
                asctype: c_oAscTypeSelectElement.Chart,
                enableToggle: true,
                disabled: true,
                toggleGroup: "tabpanelbtnsGroup"
            });
            this.btnShape = new Common.UI.Button({
                hint: this.txtShapeSettings,
                asctype: c_oAscTypeSelectElement.Shape,
                enableToggle: true,
                disabled: true,
                toggleGroup: "tabpanelbtnsGroup"
            });
            this._settings = [];
            this._settings[c_oAscTypeSelectElement.Paragraph] = {
                panel: "id-paragraph-settings",
                btn: this.btnText
            };
            this._settings[c_oAscTypeSelectElement.Table] = {
                panel: "id-table-settings",
                btn: this.btnTable
            };
            this._settings[c_oAscTypeSelectElement.Image] = {
                panel: "id-image-settings",
                btn: this.btnImage
            };
            this._settings[c_oAscTypeSelectElement.Header] = {
                panel: "id-header-settings",
                btn: this.btnHeaderFooter
            };
            this._settings[c_oAscTypeSelectElement.Shape] = {
                panel: "id-shape-settings",
                btn: this.btnShape
            };
            this._settings[c_oAscTypeSelectElement.Chart] = {
                panel: "id-chart-settings",
                btn: this.btnChart
            };
            return this;
        },
        render: function () {
            var el = $(this.el);
            this.trigger("render:before", this);
            el.css("width", "40px");
            el.show();
            el.html(this.template({}));
            this.btnText.el = $("#id-right-menu-text");
            this.btnText.render();
            this.btnTable.el = $("#id-right-menu-table");
            this.btnTable.render();
            this.btnImage.el = $("#id-right-menu-image");
            this.btnImage.render();
            this.btnHeaderFooter.el = $("#id-right-menu-header");
            this.btnHeaderFooter.render();
            this.btnChart.el = $("#id-right-menu-chart");
            this.btnChart.render();
            this.btnShape.el = $("#id-right-menu-shape");
            this.btnShape.render();
            this.btnText.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnTable.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnImage.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnHeaderFooter.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnChart.on("click", _.bind(this.onBtnMenuClick, this));
            this.btnShape.on("click", _.bind(this.onBtnMenuClick, this));
            this.paragraphSettings = new DE.Views.ParagraphSettings();
            this.headerSettings = new DE.Views.HeaderFooterSettings();
            this.imageSettings = new DE.Views.ImageSettings();
            this.chartSettings = new DE.Views.ChartSettings();
            this.tableSettings = new DE.Views.TableSettings();
            this.shapeSettings = new DE.Views.ShapeSettings();
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el).find(".right-panel"),
                    suppressScrollX: true,
                    useKeyboard: false
                });
            }
            this.trigger("render:after", this);
            return this;
        },
        setApi: function (api) {
            this.api = api;
            var fire = function () {
                this.fireEvent("editcomplete", this);
            };
            this.paragraphSettings.setApi(api).on("editcomplete", _.bind(fire, this));
            this.headerSettings.setApi(api).on("editcomplete", _.bind(fire, this));
            this.imageSettings.setApi(api).on("editcomplete", _.bind(fire, this));
            this.chartSettings.setApi(api).on("editcomplete", _.bind(fire, this));
            this.tableSettings.setApi(api).on("editcomplete", _.bind(fire, this));
            this.shapeSettings.setApi(api).on("editcomplete", _.bind(fire, this));
        },
        setMode: function (mode) {},
        onBtnMenuClick: function (btn, e) {
            var target_pane = $("#" + this._settings[btn.options.asctype].panel);
            var target_pane_parent = target_pane.parent();
            if (btn.pressed) {
                if (this.minimizedMode) {
                    $(this.el).width(MENU_SCALE_PART);
                    target_pane_parent.css("display", "inline-block");
                    this.minimizedMode = false;
                    window.localStorage.setItem("de-hidden-right-settings", 0);
                }
                target_pane_parent.find("> .active").removeClass("active");
                target_pane.addClass("active");
                if (this.scroller) {
                    this.scroller.scrollTop(0);
                }
            } else {
                target_pane_parent.css("display", "none");
                $(this.el).width(SCALE_MIN);
                this.minimizedMode = true;
                window.localStorage.setItem("de-hidden-right-settings", 1);
            }
            this.fireEvent("rightmenuclick", [this, btn.options.asctype, this.minimizedMode]);
        },
        SetActivePane: function (type, open) {
            if (this.minimizedMode && open !== true || this._settings[type] === undefined) {
                return;
            }
            if (this.minimizedMode) {
                this._settings[type].btn.toggle(true, false);
                this._settings[type].btn.trigger("click", this._settings[type].btn);
            } else {
                var target_pane = $("#" + this._settings[type].panel);
                if (!target_pane.hasClass("active")) {
                    target_pane.parent().find("> .active").removeClass("active");
                    target_pane.addClass("active");
                    if (this.scroller) {
                        this.scroller.update();
                    }
                }
                if (!this._settings[type].btn.isActive()) {
                    this._settings[type].btn.toggle(true, false);
                }
            }
        },
        GetActivePane: function () {
            return (this.minimizedMode) ? null : $(".settings-panel.active")[0].id;
        },
        SetDisabled: function (id, disabled, all) {
            if (all) {
                this.paragraphSettings.disableControls(disabled);
                this.shapeSettings.disableControls(disabled);
                this.headerSettings.disableControls(disabled);
                this.tableSettings.disableControls(disabled);
                this.imageSettings.disableControls(disabled);
                this.chartSettings.disableControls(disabled);
            } else {
                var cmp = $("#" + id);
                if (disabled !== cmp.hasClass("disabled")) {
                    cmp.toggleClass("disabled", disabled);
                    (disabled) ? cmp.attr({
                        disabled: disabled
                    }) : cmp.removeAttr("disabled");
                }
            }
        },
        txtParagraphSettings: "Paragraph Settings",
        txtImageSettings: "Image Settings",
        txtTableSettings: "Table Settings",
        txtHeaderFooterSettings: "Header and Footer Settings",
        txtShapeSettings: "Shape Settings",
        txtChartSettings: "Chart Settings"
    },
    DE.Views.RightMenu || {}));
});