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
 define(["core", "common/main/lib/component/Window", "common/main/lib/view/CopyWarningDialog", "common/main/lib/view/ImageFromUrlDialog", "spreadsheeteditor/main/app/view/Toolbar", "spreadsheeteditor/main/app/collection/TableTemplates", "spreadsheeteditor/main/app/view/HyperlinkSettingsDialog", "spreadsheeteditor/main/app/view/TableOptionsDialog"], function () {
    SSE.Controllers.Toolbar = Backbone.Controller.extend({
        models: [],
        collections: [],
        views: ["Toolbar"],
        initialize: function () {
            var me = this;
            this.addListeners({
                "Statusbar": {
                    "sheet:changed": _.bind(this.onApiSheetChanged, this)
                }
            });
            this.editMode = true;
            this._isAddingShape = false;
            this._state = {
                prstyle: undefined,
                clrtext: undefined,
                pralign: undefined,
                clrback: undefined,
                valign: undefined,
                can_undo: undefined,
                can_redo: undefined,
                bold: undefined,
                italic: undefined,
                underline: undefined,
                wrap: undefined,
                merge: undefined,
                filter: undefined,
                angle: undefined,
                controlsdisabled: {
                    rows: undefined,
                    cols: undefined,
                    filters: undefined,
                },
                show_copywarning: true,
                selection_type: undefined
            };
            var checkInsertAutoshape = function (e, action) {
                var cmp = $(e.target),
                cmp_sdk = cmp.closest("#editor_sdk"),
                btn_id = cmp.closest("button").attr("id");
                if (btn_id === undefined) {
                    btn_id = cmp.closest(".btn-group").attr("id");
                }
                if (me.api && me.api.asc_isAddAutoshape()) {
                    if (cmp_sdk.length <= 0 || action == "cancel") {
                        if (me.toolbar.btnInsertText.pressed && btn_id != me.toolbar.btnInsertText.id || me.toolbar.btnInsertShape.pressed && btn_id != me.toolbar.btnInsertShape.id) {
                            me._isAddingShape = false;
                            me._addAutoshape(false);
                            me.toolbar.btnInsertShape.toggle(false, true);
                            me.toolbar.btnInsertText.toggle(false, true);
                            Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                        } else {
                            if (me.toolbar.btnInsertShape.pressed && btn_id == me.toolbar.btnInsertShape.id) {
                                _.defer(function () {
                                    me.api.asc_endAddShape();
                                    Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                                },
                                100);
                            }
                        }
                    }
                }
            };
            this.checkInsertAutoshape = function (cmp) {
                checkInsertAutoshape({},
                cmp.action);
            };
            this._addAutoshape = function (isstart, type) {
                if (this.api) {
                    if (isstart) {
                        this.api.asc_startAddShape(type);
                        $(document.body).on("mouseup", checkInsertAutoshape);
                    } else {
                        this.api.asc_endAddShape();
                        $(document.body).off("mouseup", checkInsertAutoshape);
                    }
                }
            };
            this.onApiEndAddShape = function () {
                if (this.toolbar.btnInsertShape.pressed) {
                    this.toolbar.btnInsertShape.toggle(false, true);
                }
                if (this.toolbar.btnInsertText.pressed) {
                    this.toolbar.btnInsertText.toggle(false, true);
                }
                $(document.body).off("mouseup", checkInsertAutoshape);
            };
        },
        onLaunch: function () {
            this.toolbar = this.createView("Toolbar");
            this.toolbar.on("render:after", _.bind(this.onToolbarAfterRender, this));
        },
        onToolbarAfterRender: function (toolbar) {
            var me = this;
            toolbar.btnNewDocument.on("click", _.bind(this.onNewDocument, this));
            toolbar.btnOpenDocument.on("click", _.bind(this.onOpenDocument, this));
            toolbar.btnPrint.on("click", _.bind(this.onPrint, this));
            toolbar.btnPrint.menu.on("item:click", _.bind(this.onPrintMenu, this));
            toolbar.btnSave.on("click", _.bind(this.onSave, this));
            toolbar.btnUndo.on("click", _.bind(this.onUndo, this));
            toolbar.btnRedo.on("click", _.bind(this.onRedo, this));
            toolbar.btnCopy.on("click", _.bind(this.onCopyPaste, this, true));
            toolbar.btnPaste.on("click", _.bind(this.onCopyPaste, this, false));
            toolbar.btnIncFontSize.on("click", _.bind(this.onIncreaseFontSize, this));
            toolbar.btnDecFontSize.on("click", _.bind(this.onDecreaseFontSize, this));
            toolbar.btnBold.on("click", _.bind(this.onBold, this));
            toolbar.btnItalic.on("click", _.bind(this.onItalic, this));
            toolbar.btnUnderline.on("click", _.bind(this.onUnderline, this));
            toolbar.btnTextColor.on("click", _.bind(this.onTextColor, this));
            toolbar.btnBackColor.on("click", _.bind(this.onBackColor, this));
            toolbar.mnuTextColorPicker.on("select", _.bind(this.onTextColorSelect, this));
            toolbar.mnuBackColorPicker.on("select", _.bind(this.onBackColorSelect, this));
            toolbar.btnBorders.on("click", _.bind(this.onBorders, this));
            toolbar.btnBorders.menu.on("item:click", _.bind(this.onBordersMenu, this));
            toolbar.mnuBorderWidth.on("item:toggle", _.bind(this.onBordersWidth, this));
            toolbar.mnuBorderColorPicker.on("select", _.bind(this.onBordersColor, this));
            toolbar.btnAlignLeft.on("click", _.bind(this.onHorizontalAlign, this, "left"));
            toolbar.btnAlignCenter.on("click", _.bind(this.onHorizontalAlign, this, "center"));
            toolbar.btnAlignRight.on("click", _.bind(this.onHorizontalAlign, this, "right"));
            toolbar.btnAlignJust.on("click", _.bind(this.onHorizontalAlign, this, "justify"));
            toolbar.btnHorizontalAlign.menu.on("item:click", _.bind(this.onHorizontalAlignMenu, this));
            toolbar.btnVerticalAlign.menu.on("item:click", _.bind(this.onVerticalAlignMenu, this));
            toolbar.btnMerge.on("click", _.bind(this.onMergeCellsMenu, this, toolbar.btnMerge.menu, toolbar.btnMerge.menu.items[0]));
            toolbar.btnMerge.menu.on("item:click", _.bind(this.onMergeCellsMenu, this));
            toolbar.btnAlignTop.on("click", _.bind(this.onVerticalAlign, this, "top"));
            toolbar.btnAlignMiddle.on("click", _.bind(this.onVerticalAlign, this, "center"));
            toolbar.btnAlignBottom.on("click", _.bind(this.onVerticalAlign, this, "bottom"));
            toolbar.btnWrap.on("click", _.bind(this.onWrap, this));
            toolbar.btnTextOrient.menu.on("item:click", _.bind(this.onTextOrientationMenu, this));
            toolbar.btnInsertImage.menu.on("item:click", _.bind(this.onInsertImageMenu, this));
            toolbar.btnInsertHyperlink.on("click", _.bind(this.onHyperlink, this));
            toolbar.btnInsertChart.on("click", _.bind(this.onInsertChart, this));
            toolbar.btnEditChart.on("click", _.bind(this.onInsertChart, this));
            toolbar.btnInsertText.on("click", _.bind(this.onInsertText, this));
            toolbar.btnInsertShape.menu.on("hide:after", _.bind(this.onInsertShapeHide, this));
            toolbar.btnSortDown.on("click", _.bind(this.onSortType, this, "ascending"));
            toolbar.btnSortUp.on("click", _.bind(this.onSortType, this, "descending"));
            toolbar.mnuitemSortAZ.on("click", _.bind(this.onSortType, this, "ascending"));
            toolbar.mnuitemSortZA.on("click", _.bind(this.onSortType, this, "descending"));
            toolbar.btnSetAutofilter.on("click", _.bind(this.onAutoFilter, this));
            toolbar.mnuitemAutoFilter.on("click", _.bind(this.onAutoFilter, this));
            toolbar.btnClearAutofilter.on("click", _.bind(this.onClearFilter, this));
            toolbar.mnuitemClearFilter.on("click", _.bind(this.onClearFilter, this));
            toolbar.btnTableTemplate.menu.on("show:after", _.bind(this.onTableTplMenuOpen, this));
            toolbar.btnPercentStyle.on("click", _.bind(this.onNumberFormat, this));
            toolbar.btnCurrencyStyle.on("click", _.bind(this.onNumberFormat, this));
            toolbar.btnDecDecimal.on("click", _.bind(this.onDecrement, this));
            toolbar.btnIncDecimal.on("click", _.bind(this.onIncrement, this));
            toolbar.btnInsertFormula.on("click", _.bind(this.onInsertFormulaMenu, this));
            toolbar.btnSettings.on("click", _.bind(this.onAdvSettingsClick, this));
            toolbar.btnInsertFormula.menu.on("item:click", _.bind(this.onInsertFormulaMenu, this));
            toolbar.btnClearStyle.menu.on("item:click", _.bind(this.onClearStyleMenu, this));
            toolbar.btnAddCell.menu.on("item:click", _.bind(this.onCellInsertMenu, this));
            toolbar.btnCopyStyle.on("toggle", _.bind(this.onCopyStyleToggle, this));
            toolbar.btnDeleteCell.menu.on("item:click", _.bind(this.onCellDeleteMenu, this));
            toolbar.btnColorSchemas.menu.on("item:click", _.bind(this.onColorSchemaClick, this));
            toolbar.cmbFontName.on("selected", _.bind(this.onFontNameSelect, this));
            toolbar.cmbFontName.on("show:after", _.bind(this.onFontNameOpen, this));
            toolbar.cmbFontName.on("hide:after", _.bind(this.onHideMenus, this));
            toolbar.cmbFontName.on("combo:blur", _.bind(this.onComboBlur, this));
            toolbar.cmbFontSize.on("selected", _.bind(this.onFontSizeSelect, this));
            toolbar.cmbFontSize.on("changed:before", _.bind(this.onFontSizeChanged, this, true));
            toolbar.cmbFontSize.on("changed:after", _.bind(this.onFontSizeChanged, this, false));
            toolbar.cmbFontSize.on("show:after", _.bind(this.onFontSizeOpen, this));
            toolbar.cmbFontSize.on("hide:after", _.bind(this.onHideMenus, this));
            toolbar.cmbFontSize.on("combo:blur", _.bind(this.onComboBlur, this));
            if (toolbar.mnuZoomIn) {
                toolbar.mnuZoomIn.on("click", _.bind(this.onZoomInClick, this));
            }
            if (toolbar.mnuZoomOut) {
                toolbar.mnuZoomOut.on("click", _.bind(this.onZoomOutClick, this));
            }
            toolbar.btnShowMode.menu.on("item:click", _.bind(this.onHideMenu, this));
            toolbar.listStyles.on("click", _.bind(this.onListStyleSelect, this));
            toolbar.btnNumberFormat.menu.on("item:click", _.bind(this.onNumberFormatMenu, this));
            toolbar.btnCurrencyStyle.menu.on("item:click", _.bind(this.onNumberFormatMenu, this));
            toolbar.mnuitemCompactToolbar.on("toggle", _.bind(this.onChangeViewMode, this));
            $("#id-toolbar-menu-new-fontcolor").on("click", _.bind(this.onNewTextColor, this));
            $("#id-toolbar-menu-new-paracolor").on("click", _.bind(this.onNewBackColor, this));
            $("#id-toolbar-menu-new-bordercolor").on("click", _.bind(this.onNewBorderColor, this));
            _.each(toolbar.btnNumberFormat.menu.items, function (item) {
                if (item.menu) {
                    item.menu.on("item:click", _.bind(me.onNumberFormatMenu, me));
                }
            });
            this.onSetupCopyStyleButton();
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onInitTablePictures", _.bind(this.onApiInitTableTemplates, this));
            this.api.asc_registerCallback("asc_onInitEditorStyles", _.bind(this.onApiInitEditorStyles, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            Common.NotificationCenter.on("copywarning:show", _.bind(function () {
                this._state.show_copywarning = false;
            },
            this));
        },
        onNewDocument: function (btn, e) {
            if (this.api) {
                this.api.asc_openNewDocument();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "New Document");
        },
        onOpenDocument: function (btn, e) {
            if (this.api) {
                this.api.asc_loadDocumentFromDisk();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Open Document");
        },
        onPrint: function (e) {
            if (this.api) {
                this.api.asc_Print();
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("Print");
                Common.component.Analytics.trackEvent("ToolBar", "Print");
            }
        },
        onPrintMenu: function (menu, item) {
            if (item.value === "print" && this.api) {
                this.api.asc_Print();
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("Print");
                Common.component.Analytics.trackEvent("ToolBar", "Print");
            }
        },
        onSave: function (e) {
            if (this.api) {
                var isModified = this.api.asc_isDocumentCanSave();
                var isSyncButton = $(".btn-icon", this.toolbar.btnSave.cmpEl).hasClass("btn-synch");
                if (!isModified && !isSyncButton) {
                    return;
                }
                this.api.asc_Save();
            }
            Common.component.Analytics.trackEvent("Save");
            Common.component.Analytics.trackEvent("ToolBar", "Save");
        },
        onUndo: function (btn, e) {
            if (this.api) {
                this.api.asc_Undo();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Undo");
        },
        onRedo: function (btn, e) {
            if (this.api) {
                this.api.asc_Redo();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Redo");
        },
        onCopyPaste: function (copy, e) {
            var me = this;
            if (me.api) {
                if (typeof window["AscDesktopEditor"] === "object") {
                    copy ? me.api.asc_Copy() : me.api.asc_Paste();
                    Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                } else {
                    var value = window.localStorage.getItem("sse-hide-copywarning");
                    if (! (value && parseInt(value) == 1) && this._state.show_copywarning) {
                        (new Common.Views.CopyWarningDialog({
                            handler: function (dontshow) {
                                copy ? me.api.asc_Copy() : me.api.asc_Paste();
                                if (dontshow) {
                                    window.localStorage.setItem("sse-hide-copywarning", 1);
                                }
                                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                            }
                        })).show();
                    } else {
                        copy ? me.api.asc_Copy() : me.api.asc_Paste();
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                    }
                }
                Common.component.Analytics.trackEvent("ToolBar", "Copy Warning");
            } else {
                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
            }
        },
        onIncreaseFontSize: function (e) {
            if (this.api) {
                this.api.asc_increaseFontSize();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        onDecreaseFontSize: function (e) {
            if (this.api) {
                this.api.asc_decreaseFontSize();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        onBold: function (btn, e) {
            this._state.bold = undefined;
            if (this.api) {
                this.api.asc_setCellBold(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Bold");
        },
        onItalic: function (btn, e) {
            this._state.italic = undefined;
            if (this.api) {
                this.api.asc_setCellItalic(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Italic");
        },
        onUnderline: function (btn, e) {
            this._state.underline = undefined;
            if (this.api) {
                this.api.asc_setCellUnderline(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Underline");
        },
        onTextColor: function () {
            this.toolbar.mnuTextColorPicker.trigger("select", this.toolbar.mnuTextColorPicker, this.toolbar.mnuTextColorPicker.currentColor, true);
        },
        onBackColor: function () {
            this.toolbar.mnuBackColorPicker.trigger("select", this.toolbar.mnuBackColorPicker, this.toolbar.mnuBackColorPicker.currentColor, true);
        },
        onTextColorSelect: function (picker, color, fromBtn) {
            this._state.clrtext_asccolor = this._state.clrtext = undefined;
            var clr = (typeof(color) == "object") ? color.color : color;
            this.toolbar.btnTextColor.currentColor = color;
            $(".btn-color-value-line", this.toolbar.btnTextColor.cmpEl).css("background-color", "#" + clr);
            this.toolbar.mnuTextColorPicker.currentColor = color;
            if (this.api) {
                this.toolbar.btnTextColor.ischanged = (fromBtn !== true);
                this.api.asc_setCellTextColor(Common.Utils.ThemeColor.getRgbColor(color));
                this.toolbar.btnTextColor.ischanged = false;
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Text Color");
        },
        onBackColorSelect: function (picker, color, fromBtn) {
            this._state.clrshd_asccolor = this._state.clrback = undefined;
            var clr = (typeof(color) == "object") ? color.color : color;
            this.toolbar.btnBackColor.currentColor = color;
            $(".btn-color-value-line", this.toolbar.btnBackColor.cmpEl).css("background-color", clr == "transparent" ? "transparent" : "#" + clr);
            this.toolbar.mnuBackColorPicker.currentColor = color;
            if (this.api) {
                this.toolbar.btnBackColor.ischanged = (fromBtn !== true);
                this.api.asc_setCellBackgroundColor(color == "transparent" ? null : Common.Utils.ThemeColor.getRgbColor(color));
                this.toolbar.btnBackColor.ischanged = false;
            }
            Common.component.Analytics.trackEvent("ToolBar", "Background Color");
        },
        onNewTextColor: function (picker, color) {
            this.toolbar.mnuTextColorPicker.addNewColor();
        },
        onNewBackColor: function (picker, color) {
            this.toolbar.mnuBackColorPicker.addNewColor();
        },
        onNewBorderColor: function (picker, color) {
            this.toolbar.btnBorders.menu.hide();
            this.toolbar.btnBorders.toggle(false, true);
            this.toolbar.mnuBorderColorPicker.addNewColor();
        },
        onBorders: function (btn) {
            var menuItem;
            _.each(btn.menu.items, function (item) {
                if (btn.options.borderId == item.options.borderId) {
                    menuItem = item;
                    return false;
                }
            });
            if (menuItem) {
                this.onBordersMenu(btn.menu, menuItem);
            }
        },
        onBordersMenu: function (menu, item) {
            var me = this;
            if (me.api && !_.isUndefined(item.options.borderId)) {
                var btnBorders = me.toolbar.btnBorders,
                new_borders = [],
                bordersWidth = btnBorders.options.borderswidth,
                bordersColor = btnBorders.options.borderscolor;
                if (btnBorders.rendered) {
                    var iconEl = $(".btn-icon", btnBorders.cmpEl);
                    if (iconEl) {
                        iconEl.removeClass(btnBorders.options.icls);
                        btnBorders.options.icls = item.options.icls;
                        iconEl.addClass(btnBorders.options.icls);
                    }
                }
                btnBorders.options.borderId = item.options.borderId;
                if (item.options.borderId == "inner") {
                    new_borders[c_oAscBorderOptions.InnerV] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                    new_borders[c_oAscBorderOptions.InnerH] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                } else {
                    if (item.options.borderId == "all") {
                        new_borders[c_oAscBorderOptions.InnerV] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                        new_borders[c_oAscBorderOptions.InnerH] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                        new_borders[c_oAscBorderOptions.Left] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                        new_borders[c_oAscBorderOptions.Top] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                        new_borders[c_oAscBorderOptions.Right] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                        new_borders[c_oAscBorderOptions.Bottom] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                    } else {
                        if (item.options.borderId == "outer") {
                            new_borders[c_oAscBorderOptions.Left] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                            new_borders[c_oAscBorderOptions.Top] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                            new_borders[c_oAscBorderOptions.Right] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                            new_borders[c_oAscBorderOptions.Bottom] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                        } else {
                            if (item.options.borderId != "none") {
                                new_borders[item.options.borderId] = new Asc.asc_CBorder(bordersWidth, bordersColor);
                            }
                        }
                    }
                }
                me.api.asc_setCellBorders(new_borders);
                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Borders");
            }
        },
        onBordersWidth: function (menu, item, state) {
            if (state) {
                $("#id-toolbar-mnu-item-border-width .menu-item-icon").css("border-width", (item.value == "thin" ? 1 : (item.value == "medium" ? 2 : 3)) + "px");
                this.toolbar.btnBorders.options.borderswidth = item.value;
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Border Width");
            }
        },
        onBordersColor: function (picker, color) {
            $("#id-toolbar-mnu-item-border-color .menu-item-icon").css("border-color", "#" + ((typeof(color) == "object") ? color.color : color));
            this.toolbar.btnBorders.options.borderscolor = Common.Utils.ThemeColor.getRgbColor(color);
            this.toolbar.mnuBorderColorPicker.currentColor = color;
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Border Color");
        },
        onHorizontalAlign: function (type, btn, e) {
            this._state.pralign = undefined;
            if (this.api) {
                this.api.asc_setCellAlign(!btn.pressed ? "left" : type);
                this.toolbar.btnWrap.allowDepress = !(type == "justify");
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Horizontal align");
        },
        onHorizontalAlignMenu: function (menu, item) {
            var btnHorizontalAlign = this.toolbar.btnHorizontalAlign,
            iconEl = $(".btn-icon", btnHorizontalAlign.cmpEl);
            if (iconEl) {
                iconEl.removeClass(btnHorizontalAlign.options.icls);
                btnHorizontalAlign.options.icls = !item.checked ? "btn-align-left" : item.options.icls;
                iconEl.addClass(btnHorizontalAlign.options.icls);
            }
            this._state.pralign = undefined;
            if (this.api) {
                this.api.asc_setCellAlign(!item.checked ? "left" : item.value);
            }
            this.toolbar.btnWrap.allowDepress = !(item.value == "justify");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Horizontal Align");
        },
        onVerticalAlignMenu: function (menu, item) {
            var btnVerticalAlign = this.toolbar.btnVerticalAlign,
            iconEl = $(".btn-icon", btnVerticalAlign.cmpEl);
            if (iconEl) {
                iconEl.removeClass(btnVerticalAlign.options.icls);
                btnVerticalAlign.options.icls = !item.checked ? "btn-valign-bottom" : item.options.icls;
                iconEl.addClass(btnVerticalAlign.options.icls);
            }
            this._state.valign = undefined;
            if (this.api) {
                this.api.asc_setCellVertAlign(!item.checked ? "bottom" : item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Vertical Align");
        },
        onVerticalAlign: function (type, btn, e) {
            this._state.valign = undefined;
            if (this.api) {
                this.api.asc_setCellVertAlign(!btn.pressed ? "bottom" : type);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Vertical align");
        },
        onMergeCellsMenu: function (menu, item) {
            var me = this;
            function doMergeCells(how) {
                me._state.merge = undefined;
                me.api.asc_mergeCells(how);
                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Merge");
            }
            if (me.api) {
                var merged = me.api.asc_getCellInfo().asc_getFlags().asc_getMerge();
                if (!merged && me.api.asc_mergeCellsDataLost(item.value)) {
                    Common.UI.warning({
                        msg: me.warnMergeLostData,
                        buttons: ["yes", "no"],
                        callback: function (btn) {
                            if (btn == "ok") {
                                doMergeCells(item.value);
                            } else {
                                me.toolbar.btnMerge.toggle(false, true);
                                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                                Common.component.Analytics.trackEvent("ToolBar", "Merge");
                            }
                        }
                    });
                } else {
                    doMergeCells(item.value);
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Merge cells");
        },
        onWrap: function (btn, e) {
            this._state.wrap = undefined;
            if (this.api) {
                this.api.asc_setCellTextWrap(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Wrap");
        },
        onTextOrientationMenu: function (menu, item) {
            var angle = 0;
            switch (item.value) {
            case "countcw":
                angle = 45;
                break;
            case "clockwise":
                angle = -45;
                break;
            case "rotateup":
                angle = 90;
                break;
            case "rotatedown":
                angle = -90;
                break;
            }
            this._state.angle = undefined;
            if (this.api) {
                this.api.asc_setCellAngle(angle);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Text orientation");
        },
        onInsertImageMenu: function (menu, item, e) {
            if (item.value === "file") {
                this.toolbar.fireEvent("insertimage", this.toolbar);
                if (this.api) {
                    this.api.asc_showImageFileDialog();
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Image");
            } else {
                var me = this;
                (new Common.Views.ImageFromUrlDialog({
                    handler: function (result, value) {
                        if (result == "ok") {
                            if (me.api) {
                                var checkUrl = value.replace(/\s/g, "");
                                if (!_.isEmpty(checkUrl)) {
                                    me.toolbar.fireEvent("insertimage", me.toolbar);
                                    me.api.asc_addImageDrawingObject(checkUrl);
                                    Common.component.Analytics.trackEvent("ToolBar", "Image");
                                } else {
                                    Common.UI.warning({
                                        msg: this.textEmptyImgUrl
                                    });
                                }
                            }
                            Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                        }
                    }
                })).show();
            }
        },
        onHyperlink: function (btn) {
            var me = this;
            var win, props;
            if (me.api) {
                var wc = me.api.asc_getWorksheetsCount(),
                i = -1,
                items = [];
                while (++i < wc) {
                    if (!this.api.asc_isWorksheetHidden(i)) {
                        items.push({
                            displayValue: me.api.asc_getWorksheetName(i),
                            value: me.api.asc_getWorksheetName(i)
                        });
                    }
                }
                var handlerDlg = function (dlg, result) {
                    if (result == "ok") {
                        props = dlg.getSettings();
                        me.api.asc_insertHyperlink(props);
                    }
                    Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                };
                var cell = me.api.asc_getCellInfo(),
                seltype = cell.asc_getFlags().asc_getSelectionType();
                props = cell.asc_getHyperlink();
                win = new SSE.Views.HyperlinkSettingsDialog({
                    handler: handlerDlg
                });
                win.show();
                win.setSettings({
                    sheets: items,
                    currentSheet: me.api.asc_getWorksheetName(me.api.asc_getActiveWorksheetIndex()),
                    props: props,
                    text: cell.asc_getText(),
                    isLock: cell.asc_getFlags().asc_getLockText(),
                    allowInternal: (seltype !== c_oAscSelectionType.RangeImage && seltype !== c_oAscSelectionType.RangeShape && seltype !== c_oAscSelectionType.RangeShapeText && seltype !== c_oAscSelectionType.RangeChart && seltype !== c_oAscSelectionType.RangeChartText)
                });
            }
            Common.component.Analytics.trackEvent("ToolBar", "Add Hyperlink");
        },
        onInsertChart: function (btn) {
            if (!this.editMode) {
                return;
            }
            var me = this,
            info = me.api.asc_getCellInfo();
            if (info.asc_getFlags().asc_getSelectionType() != c_oAscSelectionType.RangeImage) {
                var win, props;
                if (me.api) {
                    props = me.api.asc_getChartObject();
                    if (props) {
                        var ischartedit = (me.toolbar.mode.isEditDiagram || info.asc_getFlags().asc_getSelectionType() == c_oAscSelectionType.RangeChart || info.asc_getFlags().asc_getSelectionType() == c_oAscSelectionType.RangeChartText);
                        (new SSE.Views.ChartSettingsDlg({
                            chartSettings: props,
                            api: me.api,
                            handler: function (result, value) {
                                if (result == "ok") {
                                    if (me.api) {
                                        (ischartedit) ? me.api.asc_editChartDrawingObject(value.chartSettings) : me.api.asc_addChartDrawingObject(value.chartSettings);
                                    }
                                }
                                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                            }
                        })).show();
                    }
                }
            }
        },
        onInsertText: function (btn, e) {
            if (this.api) {
                this._addAutoshape(btn.pressed, "textRect");
            }
            if (this.toolbar.btnInsertShape.pressed) {
                this.toolbar.btnInsertShape.toggle(false, true);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, this.toolbar.btnInsertShape);
            Common.component.Analytics.trackEvent("ToolBar", "Add Text");
        },
        onInsertShapeHide: function (btn, e) {
            if (this.toolbar.btnInsertShape.pressed && !this._isAddingShape) {
                this.toolbar.btnInsertShape.toggle(false, true);
            }
            this._isAddingShape = false;
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onSortType: function (type, btn) {
            if (this.api) {
                this.api.asc_sortColFilter(type, "");
            }
        },
        onAutoFilter: function (btn) {
            this._state.filter = undefined;
            if (this.api) {
                this.api.asc_addAutoFilter();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Auto filter");
        },
        onClearFilter: function (btn) {
            if (this.api) {
                this.api.asc_clearFilter();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Clear filter");
        },
        onNumberFormat: function (btn) {
            if (this.api) {
                this.api.asc_setCellFormat(btn.options.formatId);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Number Format");
        },
        onNumberFormatMenu: function (menu, item) {
            if (this.api) {
                this.api.asc_setCellFormat(item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Number Format");
        },
        onDecrement: function (btn) {
            if (this.api) {
                this.api.asc_decreaseCellDigitNumbers();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Decrement");
        },
        onIncrement: function (btn) {
            if (this.api) {
                this.api.asc_increaseCellDigitNumbers();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Increment");
        },
        onInsertFormulaMenu: function (menu, item, e) {
            if (this.api) {
                if (item.value === "more") {
                    var controller = this.getApplication().getController("FormulaDialog");
                    if (controller) {
                        this.api.asc_enableKeyEvents(false);
                        controller.showDialog();
                    }
                } else {
                    item.value = item.value || "SUM";
                    this.api.asc_insertFormula(item.value, true);
                    Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                    Common.component.Analytics.trackEvent("ToolBar", "Insert formula");
                }
            }
        },
        onClearStyleMenu: function (menu, item, e) {
            if (this.api) {
                this.api.asc_emptyCells(item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Clear");
        },
        onCopyStyleToggle: function (btn, state, e) {
            if (this.api) {
                this.api.asc_formatPainter(state ? 1 : 0);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            this.modeAlwaysSetStyle = state;
        },
        onCellInsertMenu: function (menu, item, e) {
            if (this.api) {
                this.api.asc_insertCells(item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Cell insert");
        },
        onCellDeleteMenu: function (menu, item, e) {
            if (this.api) {
                this.api.asc_deleteCells(item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Cell delete");
        },
        onColorSchemaClick: function (menu, item) {
            if (this.api) {
                this.api.asc_ChangeColorScheme(item.value);
                Common.component.Analytics.trackEvent("ToolBar", "Color Scheme");
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onComboBlur: function () {
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onFontNameSelect: function (combo, record) {
            if (this.api) {
                this.api.asc_setCellFontName(record.name);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Font Name");
        },
        onFontNameOpen: function (combo) {
            _.delay(function () {
                $("input", combo.cmpEl).select().focus();
            },
            10);
        },
        onFontSizeSelect: function (combo, record) {
            if (this.api) {
                this.api.asc_setCellFontSize(record.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        onFontSizeChanged: function (before, combo, record, e) {
            var value, me = this;
            if (before) {
                var item = combo.store.findWhere({
                    displayValue: record.value
                });
                if (!item) {
                    value = /^\+?(\d*\.?\d+)$|^\+?(\d+\.?\d*)$/.exec(record.value);
                    if (!value) {
                        value = this._getApiTextSize();
                        Common.UI.error({
                            msg: this.textFontSizeErr,
                            callback: function () {
                                _.defer(function (btn) {
                                    me.api.asc_enableKeyEvents(false);
                                    $("input", combo.cmpEl).focus();
                                });
                            }
                        });
                        combo.setRawValue(value);
                        e.preventDefault();
                        return false;
                    }
                }
            } else {
                value = parseFloat(record.value);
                value = value > 300 ? 300 : value < 1 ? 1 : Math.floor((value + 0.4) * 2) / 2;
                combo.setRawValue(value);
                if (this.api) {
                    this.api.asc_setCellFontSize(value);
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            }
        },
        onFontSizeOpen: function (combo) {
            _.delay(function () {
                $("input", combo.cmpEl).select().focus();
            },
            10);
        },
        onAdvSettingsClick: function (btn, e) {
            this.toolbar.fireEvent("file:settings", this);
            btn.cmpEl.blur();
        },
        onZoomInClick: function (btn) {
            if (this.api) {
                var f = this.api.asc_getZoom() + 0.1;
                if (f > 0 && !(f > 2)) {
                    this.api.asc_setZoom(f);
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomOutClick: function (btn) {
            if (this.api) {
                var f = this.api.asc_getZoom() - 0.1;
                if (! (f < 0.5)) {
                    this.api.asc_setZoom(f);
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onHideMenu: function (menu, item) {
            var params = {},
            option;
            switch (item.value) {
            case "title":
                params.title = item.checked;
                option = "sse-hidden-title";
                break;
            case "formula":
                params.formula = item.checked;
                option = "sse-hidden-formula";
                break;
            case "headings":
                params.headings = item.checked;
                break;
            case "gridlines":
                params.gridlines = item.checked;
                break;
            case "freezepanes":
                params.freezepanes = true;
                break;
            }
            this.hideElements(params);
            option && localStorage.setItem(option, item.checked);
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onListStyleSelect: function (combo, record) {
            this._state.prstyle = undefined;
            if (this.api) {
                this.api.asc_setCellStyle(record.get("name"));
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Style");
            }
        },
        createDelayedElements: function () {
            var me = this;
            this.api.asc_registerCallback("asc_onShowChartDialog", _.bind(this.onApiChartDblClick, this));
            this.api.asc_registerCallback("asc_onCanUndoChanged", _.bind(this.onApiCanRevert, this, "undo"));
            this.api.asc_registerCallback("asc_onCanRedoChanged", _.bind(this.onApiCanRevert, this, "redo"));
            this.api.asc_registerCallback("asc_onEditCell", _.bind(this.onApiEditCell, this));
            this.api.asc_registerCallback("asc_onEndAddShape", _.bind(this.onApiEndAddShape, this));
            this.api.asc_registerCallback("asc_onZoomChanged", _.bind(this.onApiZoomChange, this));
            this.api.asc_registerCallback("asc_onSheetsChanged", _.bind(this.onApiSheetChanged, this));
            this.api.asc_registerCallback("asc_onStopFormatPainter", _.bind(this.onApiStyleChange, this));
            this.api.asc_registerCallback("asc_onUpdateSheetViewSettings", _.bind(this.onApiSheetChanged, this));
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: {
                    "command+l,ctrl+l": function (e) {
                        if (me.editMode && me.api.asc_getCellInfo().asc_getIsFormatTable() !== true) {
                            me._setTableFormat(me.toolbar.mnuTableTemplatePicker.store.at(23).get("name"));
                        }
                        return false;
                    },
                    "command+shift+l,ctrl+shift+l": function (e) {
                        me._state.filter = undefined;
                        if (me.editMode && me.api) {
                            me.api.asc_addAutoFilter();
                        }
                        return false;
                    },
                    "command+s,ctrl+s": function (e) {
                        me.onSave();
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    "command+k,ctrl+k": function (e) {
                        if (me.editMode && !me.toolbar.mode.isEditDiagram && !me.api.isCellEdited) {
                            me.onHyperlink();
                        }
                        e.preventDefault();
                    }
                }
            });
            this.wrapOnSelectionChanged = _.bind(this.onApiSelectionChanged, this);
            this.api.asc_registerCallback("asc_onSelectionChanged", this.wrapOnSelectionChanged);
            this.onApiSelectionChanged(this.api.asc_getCellInfo());
            this.api.asc_registerCallback("asc_onEditorSelectionChanged", _.bind(this.onApiEditorSelectionChanged, this));
            this.attachToControlEvents();
            this.onApiSheetChanged();
            Common.NotificationCenter.on("cells:range", _.bind(this.onCellsRange, this));
        },
        onChangeViewMode: function (item, compact) {
            var me = this,
            toolbarFull = $("#id-toolbar-full"),
            toolbarShort = $("#id-toolbar-short");
            me.toolbar.isCompactView = compact;
            if (toolbarFull && toolbarShort) {
                me.api.asc_unregisterCallback("asc_onSelectionChanged", me.wrapOnSelectionChanged);
                if (compact) {
                    toolbarShort.css({
                        display: "table"
                    });
                    toolbarFull.css({
                        display: "none"
                    });
                    toolbarShort.parent().css({
                        height: "41px"
                    });
                    me.toolbar.rendererComponents("short");
                } else {
                    toolbarShort.css({
                        display: "none"
                    });
                    toolbarFull.css({
                        display: "table"
                    });
                    toolbarShort.parent().css({
                        height: "67px"
                    });
                    me.toolbar.rendererComponents("full");
                    _.defer(function () {
                        var listStylesVisible = (me.toolbar.listStyles.rendered);
                        if (me.toolbar.listStyles.menuPicker.store.length > 0 && listStylesVisible) {
                            me.toolbar.listStyles.fillComboView(me.toolbar.listStyles.menuPicker.getSelectedRec(), true);
                        }
                    },
                    100);
                }
                me._state.coauthdisable = undefined;
                me.api.asc_registerCallback("asc_onSelectionChanged", me.wrapOnSelectionChanged);
                me.onApiSelectionChanged(me.api.asc_getCellInfo());
                window.localStorage.setItem("sse-toolbar-compact", compact ? 1 : 0);
                Common.NotificationCenter.trigger("layout:changed", "toolbar");
            }
        },
        fillTableTemplates: function () {
            var me = this;
            function createPicker(element) {
                var picker = new Common.UI.DataView({
                    el: element,
                    store: me.getCollection("TableTemplates"),
                    itemTemplate: _.template('<div class="item-template"><img src="<%= imageUrl %>" id="<%= id %>"></div>')
                });
                picker.on("item:click", function (picker, item, record) {
                    if (me.api) {
                        me._setTableFormat(record.get("name"));
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                        Common.component.Analytics.trackEvent("ToolBar", "Table Templates");
                    }
                });
                if (picker.scroller) {
                    picker.scroller.update({});
                }
                return picker;
            }
            if (_.isUndefined(this.toolbar.mnuTableTemplatePicker)) {
                this.toolbar.mnuTableTemplatePicker = createPicker($("#id-toolbar-menu-table-templates"));
            }
            if (_.isUndefined(this.toolbar.mnuTableTemplatePickerShort)) {
                this.toolbar.mnuTableTemplatePickerShort = createPicker($("#id-toolbar-short-menu-table-templates"));
            }
        },
        onTableTplMenuOpen: function (cmp) {
            var scroller = this.toolbar.mnuTableTemplatePicker.scroller;
            if (scroller) {
                scroller.update();
                scroller.scrollTop(0);
            }
        },
        onApiInitTableTemplates: function (images) {
            var store = this.getCollection("TableTemplates");
            if (store) {
                var templates = [];
                _.each(images, function (item) {
                    templates.push({
                        name: item.asc_getName(),
                        caption: item.asc_getDisplayName(),
                        type: item.asc_getType(),
                        imageUrl: item.asc_getImage(),
                        allowSelected: false,
                        selected: false
                    });
                });
                store.reset();
                store.add(templates);
            }
            this.fillTableTemplates();
        },
        onApiInitEditorStyles: function (styles) {
            window.styles_loaded = false;
            var self = this,
            listStyles = self.toolbar.listStyles;
            if (!listStyles) {
                self.styles = styles;
                return;
            }
            var canvasDefaultStyles = document.createElement("canvas");
            canvasDefaultStyles.id = "bigimgdefaultstyles";
            var isDocStyles = styles.asc_getDocStylesImage().length > 0;
            var fillStyles = function () {
                listStyles.menuPicker.store.reset([]);
                var thumbWidth = styles.asc_getStyleThumbnailWidth(),
                thumbHeight = styles.asc_getStyleThumbnailHeight();
                var merged_array = styles.asc_getDefaultStyles();
                isDocStyles && (merged_array = merged_array.concat(styles.asc_getDocStyles()));
                var thumb = document.createElement("canvas");
                var ctx = thumb.getContext("2d");
                thumb.width = thumbWidth;
                thumb.height = thumbHeight;
                _.each(merged_array, function (style) {
                    ctx.clearRect(0, 0, thumbWidth, thumbHeight);
                    ctx.save();
                    ctx.translate(0, -style.asc_getThumbnailOffset() * thumbHeight);
                    ctx.drawImage(((style.asc_getType() == c_oAscStyleImage.Default) ? canvasDefaultStyles : canvasDocStyles), 0, 0);
                    ctx.restore();
                    listStyles.menuPicker.store.add({
                        imageUrl: thumb.toDataURL(),
                        name: style.asc_getName(),
                        uid: Common.UI.getId()
                    });
                });
                if (listStyles.menuPicker.store.length > 0 && listStyles.rendered) {
                    listStyles.fillComboView(listStyles.menuPicker.store.at(0), true);
                    listStyles.selectByIndex(0);
                }
                window.styles_loaded = true;
            };
            var imgDefaultStyles = new Image(),
            imgLoaded = 1;
            if (isDocStyles) {
                imgLoaded++;
                var canvasDocStyles = document.createElement("canvas");
                canvasDocStyles.id = "bigimgdocstyles";
                var imgDocStyles = new Image();
                imgDocStyles.onload = function () {
                    canvasDocStyles.width = imgDocStyles.width;
                    canvasDocStyles.height = imgDocStyles.height;
                    canvasDocStyles.getContext("2d").drawImage(imgDocStyles, 0, 0);
                    if (! (--imgLoaded > 0)) {
                        fillStyles();
                    }
                };
            }
            imgDefaultStyles.onload = function () {
                canvasDefaultStyles.width = imgDefaultStyles.width;
                canvasDefaultStyles.height = imgDefaultStyles.height;
                canvasDefaultStyles.getContext("2d").drawImage(imgDefaultStyles, 0, 0);
                if (! (--imgLoaded > 0)) {
                    fillStyles();
                }
            };
            imgDefaultStyles.src = styles.asc_getDefaultStylesImage();
            imgDocStyles && (imgDocStyles.src = styles.asc_getDocStylesImage());
        },
        onApiCoAuthoringDisconnect: function () {
            this.toolbar.setMode({
                isDisconnected: true
            });
            this.editMode = false;
        },
        onApiChartDblClick: function () {
            this.onInsertChart(this.btnInsertChart);
        },
        onApiCanRevert: function (which, can) {
            if (which == "undo") {
                if (this._state.can_undo !== can) {
                    this.toolbar.btnUndo.setDisabled(!can);
                    this._state.can_undo = can;
                }
            } else {
                if (this._state.can_redo !== can) {
                    this.toolbar.btnRedo.setDisabled(!can);
                    this._state.can_redo = can;
                }
            }
        },
        setDisabledComponents: function (components, disable) {
            _.each([].concat(components), function (component) {
                if (component.isDisabled() !== disable) {
                    component.setDisabled(disable);
                }
            });
        },
        onApiEditCell: function (state) {
            var toolbar = this.toolbar;
            if (toolbar.mode.isEditDiagram) {
                is_cell_edited = (state == c_oAscCellEditorState.editStart);
                toolbar.lockToolbar(SSE.enumLock.editCell, state == c_oAscCellEditorState.editStart, {
                    array: [toolbar.btnDecDecimal, toolbar.btnIncDecimal, toolbar.btnNumberFormat]
                });
            } else {
                if (state == c_oAscCellEditorState.editStart || state == c_oAscCellEditorState.editEnd) {
                    toolbar.lockToolbar(SSE.enumLock.editCell, state == c_oAscCellEditorState.editStart, {
                        array: [toolbar.btnClearStyle.menu.items[1], toolbar.btnClearStyle.menu.items[2], toolbar.btnClearStyle.menu.items[3], toolbar.btnClearStyle.menu.items[4], toolbar.mnuitemClearFilter],
                        merge: true,
                        clear: [SSE.enumLock.editFormula, SSE.enumLock.editText]
                    });
                    var is_cell_edited = (state == c_oAscCellEditorState.editStart);
                    (is_cell_edited) ? Common.util.Shortcuts.suspendEvents("command+l, ctrl+l, command+shift+l, ctrl+shift+l, command+k, ctrl+k, command+alt+h, ctrl+alt+h") : Common.util.Shortcuts.resumeEvents("command+l, ctrl+l, command+shift+l, ctrl+shift+l, command+k, ctrl+k, command+alt+h, ctrl+alt+h");
                    if (is_cell_edited) {
                        toolbar.listStyles.suspendEvents();
                        toolbar.listStyles.menuPicker.selectRecord(null);
                        toolbar.listStyles.resumeEvents();
                        this._state.prstyle = undefined;
                    }
                } else {
                    if (state == c_oAscCellEditorState.editText) {
                        var is_text = true,
                        is_formula = false;
                    } else {
                        if (state == c_oAscCellEditorState.editFormula) {
                            is_text = !(is_formula = true);
                        } else {
                            if (state == c_oAscCellEditorState.editEmptyCell) {
                                is_text = is_formula = false;
                            }
                        }
                    }
                    toolbar.lockToolbar(SSE.enumLock.editFormula, is_formula, {
                        array: [toolbar.cmbFontName, toolbar.cmbFontSize, toolbar.btnIncFontSize, toolbar.btnDecFontSize, toolbar.btnBold, toolbar.btnItalic, toolbar.btnUnderline, toolbar.btnTextColor]
                    });
                    toolbar.lockToolbar(SSE.enumLock.editText, is_text, {
                        array: [toolbar.btnInsertFormula]
                    });
                }
            }
            this._state.coauthdisable = undefined;
            this._state.selection_type = undefined;
            this.checkInsertAutoshape({
                action: "cancel"
            });
        },
        onApiZoomChange: function (zf, type) {
            switch (type) {
            case 1:
                case 2:
                case 0:
                default:
                $(".menu-zoom .zoom", this.toolbar.el).html(Math.floor((zf + 0.005) * 100) + "%");
            }
        },
        onApiSheetChanged: function () {
            if (this.api) {
                var params = this.api.asc_getSheetViewSettings(),
                menu = this.toolbar.btnShowMode.menu;
                if (menu) {
                    menu.items[3].setChecked(!params.asc_getShowRowColHeaders());
                    menu.items[4].setChecked(!params.asc_getShowGridLines());
                    menu.items[5].setChecked(params.asc_getIsFreezePane());
                }
            }
        },
        onApiEditorSelectionChanged: function (fontobj) {
            if (!this.editMode) {
                return;
            }
            var toolbar = this.toolbar,
            val;
            var fontparam = fontobj.asc_getName();
            if (fontparam != toolbar.cmbFontName.getValue()) {
                Common.NotificationCenter.trigger("fonts:change", fontobj);
            }
            if (!toolbar.mode.isEditDiagram) {
                val = fontobj.asc_getBold();
                if (this._state.bold !== val) {
                    toolbar.btnBold.toggle(val === true, true);
                    this._state.bold = val;
                }
                val = fontobj.asc_getItalic();
                if (this._state.italic !== val) {
                    toolbar.btnItalic.toggle(val === true, true);
                    this._state.italic = val;
                }
                val = fontobj.asc_getUnderline();
                if (this._state.underline !== val) {
                    toolbar.btnUnderline.toggle(val === true, true);
                    this._state.underline = val;
                }
            }
            var str_size = fontobj.asc_getSize();
            if (toolbar.cmbFontSize.getValue() != str_size) {
                toolbar.cmbFontSize.setValue((str_size !== undefined) ? str_size : "");
            }
            var clr, color, fontColorPicker = this.toolbar.mnuTextColorPicker;
            if (!toolbar.btnTextColor.ischanged && !fontColorPicker.isDummy) {
                color = fontobj.asc_getColor();
                if (color) {
                    if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                        clr = {
                            color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                            effectValue: color.get_value()
                        };
                    } else {
                        clr = Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                    }
                }
                var type1 = typeof(clr),
                type2 = typeof(this._state.clrtext);
                if ((type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrtext.effectValue || this._state.clrtext.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrtext !== undefined && this._state.clrtext.indexOf(clr) < 0)) {
                    if (_.isObject(clr)) {
                        var isselected = false;
                        for (var i = 0; i < 10; i++) {
                            if (Common.Utils.ThemeColor.ThemeValues[i] == clr.effectValue) {
                                fontColorPicker.select(clr, true);
                                isselected = true;
                                break;
                            }
                        }
                        if (!isselected) {
                            fontColorPicker.clearSelection();
                        }
                    } else {
                        fontColorPicker.select(clr, true);
                    }
                    this._state.clrtext = clr;
                }
                this._state.clrtext_asccolor = color;
            }
        },
        onApiSelectionChanged: function (info) {
            if (!this.editMode) {
                return;
            }
            var selectionType = info.asc_getFlags().asc_getSelectionType();
            var coauth_disable = (!this.toolbar.mode.isEditDiagram) ? (info.asc_getLocked() === true) : false;
            if (this._disableEditOptions(selectionType, coauth_disable)) {
                return;
            }
            var me = this,
            toolbar = this.toolbar,
            fontobj = info.asc_getFont(),
            val;
            var fontparam = fontobj.asc_getName();
            if (fontparam != toolbar.cmbFontName.getValue()) {
                Common.NotificationCenter.trigger("fonts:change", fontobj);
            }
            if (!toolbar.mode.isEditDiagram) {
                val = fontobj.asc_getBold();
                if (this._state.bold !== val) {
                    toolbar.btnBold.toggle(val === true, true);
                    this._state.bold = val;
                }
                val = fontobj.asc_getItalic();
                if (this._state.italic !== val) {
                    toolbar.btnItalic.toggle(val === true, true);
                    this._state.italic = val;
                }
                val = fontobj.asc_getUnderline();
                if (this._state.underline !== val) {
                    toolbar.btnUnderline.toggle(val === true, true);
                    this._state.underline = val;
                }
            }
            var str_size = fontobj.asc_getSize();
            if (toolbar.cmbFontSize.getValue() != str_size) {
                toolbar.cmbFontSize.setValue((str_size !== undefined) ? str_size : "");
            }
            var clr, color, fontColorPicker = this.toolbar.mnuTextColorPicker,
            paragraphColorPicker = this.toolbar.mnuBackColorPicker;
            if (!toolbar.btnTextColor.ischanged && !fontColorPicker.isDummy) {
                color = fontobj.asc_getColor();
                if (color) {
                    if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                        clr = {
                            color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                            effectValue: color.get_value()
                        };
                    } else {
                        clr = Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                    }
                }
                var type1 = typeof(clr),
                type2 = typeof(this._state.clrtext);
                if ((type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrtext.effectValue || this._state.clrtext.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrtext !== undefined && this._state.clrtext.indexOf(clr) < 0)) {
                    if (_.isObject(clr)) {
                        var isselected = false;
                        for (var i = 0; i < 10; i++) {
                            if (Common.Utils.ThemeColor.ThemeValues[i] == clr.effectValue) {
                                fontColorPicker.select(clr, true);
                                isselected = true;
                                break;
                            }
                        }
                        if (!isselected) {
                            fontColorPicker.clearSelection();
                        }
                    } else {
                        fontColorPicker.select(clr, true);
                    }
                    this._state.clrtext = clr;
                }
                this._state.clrtext_asccolor = color;
            }
            if (!toolbar.btnBackColor.ischanged && !paragraphColorPicker.isDummy) {
                color = info.asc_getFill().asc_getColor();
                if (color) {
                    if (color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME) {
                        clr = {
                            color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                            effectValue: color.get_value()
                        };
                    } else {
                        clr = Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                    }
                } else {
                    clr = "transparent";
                }
                type1 = typeof(clr);
                type2 = typeof(this._state.clrback);
                if ((type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrback.effectValue || this._state.clrback.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrback !== undefined && this._state.clrback.indexOf(clr) < 0)) {
                    if (_.isObject(clr)) {
                        var isselected = false;
                        for (i = 0; i < 10; i++) {
                            if (Common.Utils.ThemeColor.ThemeValues[i] == clr.effectValue) {
                                paragraphColorPicker.select(clr, true);
                                isselected = true;
                                break;
                            }
                        }
                        if (!isselected) {
                            paragraphColorPicker.clearSelection();
                        }
                    } else {
                        paragraphColorPicker.select(clr, true);
                    }
                    this._state.clrback = clr;
                }
                this._state.clrshd_asccolor = color;
            }
            if (selectionType == c_oAscSelectionType.RangeChart || selectionType == c_oAscSelectionType.RangeChartText) {
                return;
            }
            if (!toolbar.mode.isEditDiagram) {
                fontparam = info.asc_getHorAlign();
                if (this._state.pralign !== fontparam) {
                    this._state.pralign = fontparam;
                    var index = -1,
                    align;
                    switch (fontparam) {
                    case "left":
                        index = 0;
                        align = "btn-align-left";
                        break;
                    case "center":
                        index = 1;
                        align = "btn-align-center";
                        break;
                    case "right":
                        index = 2;
                        align = "btn-align-right";
                        break;
                    case "justify":
                        index = 3;
                        align = "btn-align-just";
                        break;
                    default:
                        index = -255;
                        align = "btn-align-left";
                        break;
                    }
                    if (! (index < 0)) {
                        toolbar.btnAlignRight.toggle(index === 2, true);
                        toolbar.btnAlignLeft.toggle(index === 0, true);
                        toolbar.btnAlignCenter.toggle(index === 1, true);
                        toolbar.btnAlignJust.toggle(index === 3, true);
                        toolbar.btnHorizontalAlign.menu.items[index].setChecked(true, false);
                    } else {
                        if (index == -255) {
                            toolbar.btnAlignRight.toggle(false, true);
                            toolbar.btnAlignLeft.toggle(false, true);
                            toolbar.btnAlignCenter.toggle(false, true);
                            toolbar.btnAlignJust.toggle(false, true);
                            this._clearChecked(toolbar.btnHorizontalAlign.menu);
                        }
                    }
                    var btnHorizontalAlign = this.toolbar.btnHorizontalAlign;
                    if (btnHorizontalAlign.rendered) {
                        var hIconEl = $(".btn-icon", btnHorizontalAlign.cmpEl);
                        if (hIconEl) {
                            hIconEl.removeClass(btnHorizontalAlign.options.icls);
                            btnHorizontalAlign.options.icls = align;
                            hIconEl.addClass(btnHorizontalAlign.options.icls);
                        }
                    }
                    toolbar.btnTextOrient.menu.items[1].setDisabled(fontparam == "justify");
                    toolbar.btnTextOrient.menu.items[2].setDisabled(fontparam == "justify");
                }
                fontparam = info.asc_getVertAlign();
                if (this._state.valign !== fontparam) {
                    this._state.valign = fontparam;
                    index = -1;
                    align = "";
                    switch (fontparam) {
                    case "top":
                        index = 0;
                        align = "btn-valign-top";
                        break;
                    case "center":
                        index = 1;
                        align = "btn-valign-middle";
                        break;
                    case "bottom":
                        index = 2;
                        align = "btn-valign-bottom";
                        break;
                    }
                    if (index > -1) {
                        toolbar.btnAlignTop.toggle(index === 0, true);
                        toolbar.btnAlignMiddle.toggle(index === 1, true);
                        toolbar.btnAlignBottom.toggle(index === 2, true);
                        toolbar.btnVerticalAlign.menu.items[index].setChecked(true, false);
                        var btnVerticalAlign = this.toolbar.btnVerticalAlign;
                        if (btnVerticalAlign.rendered) {
                            var vIconEl = $(".btn-icon", btnVerticalAlign.cmpEl);
                            if (vIconEl) {
                                vIconEl.removeClass(btnVerticalAlign.options.icls);
                                btnVerticalAlign.options.icls = align;
                                vIconEl.addClass(btnVerticalAlign.options.icls);
                            }
                        }
                    }
                }
                var need_disable = this._state.controlsdisabled.filters || (info.asc_getIsFormatTable() === true);
                toolbar.lockToolbar(SSE.enumLock.ruleMerge, need_disable, {
                    array: [toolbar.btnMerge]
                });
                val = info.asc_getFlags().asc_getMerge();
                if (this._state.merge !== val) {
                    toolbar.btnMerge.toggle(val === true, true);
                    this._state.merge = val;
                }
                val = info.asc_getIsAutoFilter();
                if (this._state.filter !== val) {
                    toolbar.btnSetAutofilter.toggle(val === true, true);
                    toolbar.mnuitemAutoFilter.setChecked(val === true, true);
                    this._state.filter = val;
                }
                need_disable = this._state.controlsdisabled.filters || (val === null);
                toolbar.lockToolbar(SSE.enumLock.ruleFilter, need_disable, {
                    array: [toolbar.btnSortDown, toolbar.btnSortUp, toolbar.mnuitemSortAZ, toolbar.mnuitemSortZA, toolbar.btnTableTemplate, toolbar.btnSetAutofilter, toolbar.mnuitemAutoFilter, toolbar.btnAutofilter]
                });
                need_disable = this._state.controlsdisabled.filters || (info.asc_getClearFilter() !== true);
                toolbar.lockToolbar(SSE.enumLock.ruleDelFilter, need_disable, {
                    array: [toolbar.btnClearAutofilter, toolbar.mnuitemClearFilter]
                });
                if (!toolbar.btnWrap.isDisabled()) {
                    val = info.asc_getFlags().asc_getWrapText();
                    if (this._state.wrap !== val) {
                        toolbar.btnWrap.toggle(val === true, true);
                        this._state.wrap = val;
                    }
                }
            }
            fontparam = toolbar.numFormatTypes[info.asc_getNumFormatType()];
            if (!fontparam) {
                fontparam = toolbar.numFormatTypes[1];
            }
            toolbar.btnNumberFormat.setCaption(fontparam);
            val = info.asc_getAngle();
            if (this._state.angle !== val) {
                this._clearChecked(toolbar.btnTextOrient.menu);
                switch (val) {
                case 45:
                    toolbar.btnTextOrient.menu.items[1].setChecked(true, true);
                    break;
                case -45:
                    toolbar.btnTextOrient.menu.items[2].setChecked(true, true);
                    break;
                case 90:
                    toolbar.btnTextOrient.menu.items[3].setChecked(true, true);
                    break;
                case -90:
                    toolbar.btnTextOrient.menu.items[4].setChecked(true, true);
                    break;
                default:
                    toolbar.btnTextOrient.menu.items[0].setChecked(true, true);
                    break;
                }
                this._state.angle = val;
            }
            val = info.asc_getStyleName();
            if (this._state.prstyle != val && !this.toolbar.listStyles.isDisabled()) {
                var listStyle = this.toolbar.listStyles,
                listStylesVisible = (listStyle.rendered);
                if (listStylesVisible) {
                    listStyle.suspendEvents();
                    var styleRec = listStyle.menuPicker.store.findWhere({
                        name: val
                    });
                    this._state.prstyle = (listStyle.menuPicker.store.length > 0) ? val : undefined;
                    listStyle.menuPicker.selectRecord(styleRec);
                    listStyle.resumeEvents();
                }
            }
            val = (selectionType == c_oAscSelectionType.RangeRow);
            if (this._state.controlsdisabled.rows !== val) {
                this._state.controlsdisabled.rows = val;
                toolbar.btnAddCell.menu.items[0].setDisabled(val);
                toolbar.btnAddCell.menu.items[3].setDisabled(val);
                toolbar.btnDeleteCell.menu.items[0].setDisabled(val);
                toolbar.btnDeleteCell.menu.items[3].setDisabled(val);
            }
            val = (selectionType == c_oAscSelectionType.RangeCol);
            if (this._state.controlsdisabled.cols !== val) {
                this._state.controlsdisabled.cols = val;
                toolbar.btnAddCell.menu.items[1].setDisabled(val);
                toolbar.btnAddCell.menu.items[2].setDisabled(val);
                toolbar.btnDeleteCell.menu.items[1].setDisabled(val);
                toolbar.btnDeleteCell.menu.items[2].setDisabled(val);
            }
        },
        onApiStyleChange: function () {
            this.toolbar.btnCopyStyle.toggle(false, true);
            this.modeAlwaysSetStyle = false;
        },
        updateThemeColors: function () {
            var updateColors = function (picker, defaultColor) {
                if (picker) {
                    var clr;
                    var effectcolors = Common.Utils.ThemeColor.getEffectColors();
                    for (var i = 0; i < effectcolors.length; i++) {
                        if (typeof(picker.currentColor) == "object" && clr === undefined && picker.currentColor.effectId == effectcolors[i].effectId) {
                            clr = effectcolors[i];
                        }
                    }
                    picker.updateColors(effectcolors, Common.Utils.ThemeColor.getStandartColors());
                    if (picker.currentColor === undefined) {
                        picker.currentColor = defaultColor;
                    } else {
                        if (clr !== undefined) {
                            picker.currentColor = clr;
                        }
                    }
                }
            };
            updateColors(this.toolbar.mnuTextColorPicker, Common.Utils.ThemeColor.getStandartColors()[1]);
            if (this.toolbar.btnTextColor.currentColor === undefined) {
                this.toolbar.btnTextColor.currentColor = Common.Utils.ThemeColor.getStandartColors()[1];
            } else {
                this.toolbar.btnTextColor.currentColor = this.toolbar.mnuTextColorPicker.currentColor.color || this.toolbar.mnuTextColorPicker.currentColor;
            }
            $(".btn-color-value-line", this.toolbar.btnTextColor.cmpEl).css("background-color", "#" + this.toolbar.btnTextColor.currentColor);
            updateColors(this.toolbar.mnuBackColorPicker, Common.Utils.ThemeColor.getStandartColors()[3]);
            if (this.toolbar.btnBackColor.currentColor === undefined) {
                this.toolbar.btnBackColor.currentColor = Common.Utils.ThemeColor.getStandartColors()[3];
            } else {
                this.toolbar.btnBackColor.currentColor = this.toolbar.mnuBackColorPicker.currentColor.color || this.toolbar.mnuBackColorPicker.currentColor;
            }
            $(".btn-color-value-line", this.toolbar.btnBackColor.cmpEl).css("background-color", this.toolbar.btnBackColor.currentColor == "transparent" ? "transparent" : "#" + this.toolbar.btnBackColor.currentColor);
            if (this._state.clrtext_asccolor !== undefined || this._state.clrshd_asccolor !== undefined) {
                this._state.clrtext = undefined;
                this._state.clrback = undefined;
                this.onApiSelectionChanged(this.api.asc_getCellInfo());
            }
            this._state.clrtext_asccolor = undefined;
            this._state.clrshd_asccolor = undefined;
            updateColors(this.toolbar.mnuBorderColorPicker, Common.Utils.ThemeColor.getEffectColors()[1]);
            this.toolbar.btnBorders.options.borderscolor = this.toolbar.mnuBorderColorPicker.currentColor.color || this.toolbar.mnuBorderColorPicker.currentColor;
            $("#id-toolbar-mnu-item-border-color .menu-item-icon").css("border-color", "#" + this.toolbar.btnBorders.options.borderscolor);
        },
        hideElements: function (opts) {
            if (!_.isUndefined(opts.title)) {
                var headerView = this.getApplication().getController("Viewport").getView("Common.Views.Header");
                headerView && headerView.setVisible(!opts.title);
                Common.NotificationCenter.trigger("layout:changed", "header");
            }
            if (!_.isUndefined(opts.compact)) {
                this.onChangeViewMode(opts.compact);
            }
            if (!_.isUndefined(opts.formula)) {
                var cellEditor = this.getApplication().getController("CellEditor").getView("CellEditor");
                cellEditor && cellEditor.setVisible(!opts.formula);
                Common.NotificationCenter.trigger("layout:changed", "celleditor", opts.formula ? "hidden" : "showed");
            }
            if (!_.isUndefined(opts.headings)) {
                if (this.api) {
                    var current = this.api.asc_getSheetViewSettings();
                    current.asc_setShowRowColHeaders(!opts.headings);
                    this.api.asc_setSheetViewSettings(current);
                }
            }
            if (!_.isUndefined(opts.gridlines)) {
                if (this.api) {
                    current = this.api.asc_getSheetViewSettings();
                    current.asc_setShowGridLines(!opts.gridlines);
                    this.api.asc_setSheetViewSettings(current);
                }
            }
            if (!_.isUndefined(opts.freezepanes)) {
                if (this.api) {
                    this.api.asc_freezePane();
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        fillAutoShapes: function () {
            var me = this,
            shapesStore = this.getApplication().getCollection("ShapeGroups");
            for (var i = 0; i < shapesStore.length - 1; i++) {
                var shapeGroup = shapesStore.at(i);
                var menuItem = new Common.UI.MenuItem({
                    caption: shapeGroup.get("groupName"),
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [{
                            template: _.template('<div id="id-toolbar-menu-shapegroup' + i + '" class="menu-shape" style="width: ' + (shapeGroup.get("groupWidth") - 8) + 'px; margin-left: 5px;"></div>')
                        }]
                    })
                });
                me.toolbar.btnInsertShape.menu.addItem(menuItem);
                var shapePicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-shapegroup" + i),
                    store: shapeGroup.get("groupStore"),
                    itemTemplate: _.template('<div class="item-shape"><img src="<%= imageUrl %>" id="<%= id %>"></div>')
                });
                shapePicker.on("item:click", function (picker, item, record) {
                    if (me.api) {
                        me._addAutoshape(true, record.get("data").shapeType);
                        me._isAddingShape = true;
                        if (me.toolbar.btnInsertText.pressed) {
                            me.toolbar.btnInsertText.toggle(false, true);
                        }
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar, me.toolbar.btnInsertShape);
                        Common.component.Analytics.trackEvent("ToolBar", "Add Shape");
                    }
                });
            }
        },
        attachToControlEvents: function () {},
        onSheetChanged: function () {
            if (this.api) {
                var params = this.api.asc_getSheetViewSettings();
                var menu = this.getMenuHideOptions();
                if (menu) {
                    menu.items.getAt(3).setChecked(!params.asc_getShowRowColHeaders());
                    menu.items.getAt(4).setChecked(!params.asc_getShowGridLines());
                }
            }
        },
        _disableEditOptions: function (seltype, coauth_disable) {
            if (this.api.isCellEdited) {
                return true;
            }
            if (this.api.isRangeSelection) {
                return true;
            }
            if (this._state.selection_type === seltype && this._state.coauthdisable === coauth_disable) {
                return (seltype === c_oAscSelectionType.RangeImage);
            }
            var toolbar = this.toolbar,
            is_chart_text = seltype == c_oAscSelectionType.RangeChartText,
            is_chart = seltype == c_oAscSelectionType.RangeChart,
            is_shape_text = seltype == c_oAscSelectionType.RangeShapeText,
            is_shape = seltype == c_oAscSelectionType.RangeShape,
            is_image = seltype == c_oAscSelectionType.RangeImage,
            is_mode_2 = is_shape_text || is_shape || is_chart_text || is_chart;
            if (coauth_disable) {
                toolbar.lockToolbar(SSE.enumLock.coAuth, coauth_disable);
            } else {
                var _set = SSE.enumLock;
                var type = seltype;
                switch (seltype) {
                case c_oAscSelectionType.RangeImage:
                    type = _set.selImage;
                    break;
                case c_oAscSelectionType.RangeShape:
                    type = _set.selShape;
                    break;
                case c_oAscSelectionType.RangeShapeText:
                    type = _set.selShapeText;
                    break;
                case c_oAscSelectionType.RangeChart:
                    type = _set.selChart;
                    break;
                case c_oAscSelectionType.RangeChartText:
                    type = _set.selChartText;
                    break;
                }
                toolbar.lockToolbar(type, type != seltype, {
                    array: [toolbar.btnClearStyle.menu.items[1], toolbar.btnClearStyle.menu.items[2], toolbar.btnClearStyle.menu.items[3], toolbar.btnClearStyle.menu.items[4], toolbar.mnuitemSortAZ, toolbar.mnuitemSortZA, toolbar.mnuitemAutoFilter, toolbar.mnuitemClearFilter],
                    merge: true,
                    clear: [_set.selImage, _set.selChart, _set.selChartText, _set.selShape, _set.selShapeText, _set.coAuth]
                });
            }
            $("#ce-func-label").toggleClass("disabled", is_image || is_mode_2 || coauth_disable);
            this._state.controlsdisabled.filters = is_image || is_mode_2 || coauth_disable;
            if (is_image || is_mode_2 || coauth_disable) {
                toolbar.listStyles.suspendEvents();
                toolbar.listStyles.menuPicker.selectRecord(null);
                toolbar.listStyles.resumeEvents();
                this._state.prstyle = undefined;
            }
            this._state.selection_type = seltype;
            this._state.coauthdisable = coauth_disable;
            return is_image;
        },
        _getApiTextSize: function () {
            var cellInfo = this.api.asc_getCellInfo();
            return cellInfo ? cellInfo.asc_getFont().asc_getSize() : 12;
        },
        _clearChecked: function (menu) {
            _.each(menu.items, function (item) {
                if (item.setChecked) {
                    item.setChecked(false, true);
                }
            });
        },
        _setTableFormat: function (fmtname) {
            var me = this;
            if (me.api.isRangeSelection !== true) {
                if (me.api.asc_getAddFormatTableOptions() != false) {
                    var handlerDlg = function (dlg, result) {
                        if (result == "ok") {
                            me._state.filter = undefined;
                            me.api.asc_setSelectionDialogMode(c_oAscSelectionDialogType.None);
                            me.api.asc_addAutoFilter(fmtname, dlg.getSettings());
                        }
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                    };
                    var win = new SSE.Views.TableOptionsDialog({
                        handler: handlerDlg
                    });
                    win.show();
                    win.setSettings({
                        api: me.api
                    });
                } else {
                    me._state.filter = undefined;
                    me.api.asc_addAutoFilter(fmtname);
                }
            }
        },
        onHideMenus: function (e) {
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, {
                restorefocus: true
            });
        },
        onSetupCopyStyleButton: function () {
            this.modeAlwaysSetStyle = false;
            var acsCopyFmtStyleState = {
                kOff: 0,
                kOn: 1,
                kMultiple: 2
            };
            var me = this;
            Common.NotificationCenter.on({
                "edit:complete": function () {
                    if (me.api && me.modeAlwaysSetStyle) {
                        me.api.asc_formatPainter(acsCopyFmtStyleState.kOff);
                        me.toolbar.btnCopyStyle.toggle(false, true);
                        me.modeAlwaysSetStyle = false;
                    }
                }
            });
            $(me.toolbar.btnCopyStyle.cmpEl).dblclick(function () {
                if (me.api) {
                    me.modeAlwaysSetStyle = true;
                    me.toolbar.btnCopyStyle.toggle(true, true);
                    me.api.asc_formatPainter(acsCopyFmtStyleState.kMultiple);
                }
            });
        },
        onCellsRange: function (status) {
            this.api.isRangeSelection = (status != c_oAscSelectionDialogType.None);
            this.onApiEditCell(this.api.isRangeSelection ? c_oAscCellEditorState.editStart : c_oAscCellEditorState.editEnd);
            var toolbar = this.toolbar;
            toolbar.lockToolbar(SSE.enumLock.selRange, this.api.isRangeSelection);
            this.setDisabledComponents([toolbar.btnUndo], this.api.isRangeSelection || !this.api.asc_getCanUndo());
            this.setDisabledComponents([toolbar.btnRedo], this.api.isRangeSelection || !this.api.asc_getCanRedo());
            this.onApiSelectionChanged(this.api.asc_getCellInfo());
        },
        DisableToolbar: function (disable) {
            var mask = $(".toolbar-mask");
            if (disable && mask.length > 0 || !disable && mask.length == 0) {
                return;
            }
            var toolbar = this.toolbar;
            toolbar.$el.find(".toolbar").toggleClass("masked", disable);
            this.toolbar.lockToolbar(SSE.enumLock.menuFileOpen, disable, {
                array: [toolbar.btnShowMode]
            });
            if (disable) {
                mask = $("<div class='toolbar-mask'>").appendTo(toolbar.$el);
                var left = toolbar.isCompactView ? 75 : (toolbar.mode.nativeApp ? 80 : 48);
                mask.css("left", left + "px");
                mask.css("right", (toolbar.isCompactView ? 0 : 45) + "px");
                Common.util.Shortcuts.suspendEvents("command+l, ctrl+l, command+shift+l, ctrl+shift+l, command+k, ctrl+k, command+alt+h, ctrl+alt+h");
            } else {
                mask.remove();
                Common.util.Shortcuts.resumeEvents("command+l, ctrl+l, command+shift+l, ctrl+shift+l, command+k, ctrl+k, command+alt+h, ctrl+alt+h");
            }
        },
        textEmptyImgUrl: "You need to specify image URL.",
        warnMergeLostData: "Operation will can destroy data in the selected cells.<br>Continue?",
        textWarning : "Warning",
        textFontSizeErr: "The entered value must be more than 0",
        textCancel: "Cancel"
    });
});