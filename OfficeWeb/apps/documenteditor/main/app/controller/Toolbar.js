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
 define(["core", "common/main/lib/component/Window", "common/main/lib/view/CopyWarningDialog", "common/main/lib/view/ImageFromUrlDialog", "common/main/lib/view/InsertTableDialog", "documenteditor/main/app/view/Toolbar", "documenteditor/main/app/view/HyperlinkSettingsDialog", "documenteditor/main/app/view/DropcapSettingsAdvanced"], function () {
    DE.Controllers.Toolbar = Backbone.Controller.extend(_.extend({
        models: [],
        collections: [],
        views: ["Toolbar"],
        initialize: function () {
            this._state = {
                activated: false,
                bullets: {
                    type: undefined,
                    subtype: undefined
                },
                prstyle: undefined,
                prcontrolsdisable: undefined,
                dropcap: c_oAscDropCap.None,
                clrhighlight: undefined,
                clrtext: undefined,
                pgsize: [0, 0],
                linespace: undefined,
                pralign: undefined,
                clrback: undefined,
                valign: undefined,
                can_undo: undefined,
                can_redo: undefined,
                bold: undefined,
                italic: undefined,
                strike: undefined,
                underline: undefined,
                pgorient: undefined,
                lock_doc: undefined,
                can_copycut: undefined,
                show_copywarning: true
            };
            this.flg = {};
            this.diagramEditor = null;
            this._isAddingShape = false;
            this._isAddingEquation = false;
            this.editMode = true;
            this.addListeners({
                "Toolbar": {
                    "changecompact": this.onChangeCompactView
                }
            });
            var me = this;
            var checkInsertAutoshape = function (e) {
                var cmp = $(e.target),
                cmp_sdk = cmp.closest("#editor_sdk"),
                btn_id = cmp.closest("button").attr("id");
                if (btn_id === undefined) {
                    btn_id = cmp.closest(".btn-group").attr("id");
                }
                if (cmp.attr("id") != "editor_sdk" && cmp_sdk.length <= 0) {
                    if (me.toolbar.btnInsertText.pressed && btn_id != me.toolbar.btnInsertText.id || me.toolbar.btnInsertShape.pressed && btn_id != me.toolbar.btnInsertShape.id || me.toolbar.btnInsertEquation.pressed && btn_id != me.toolbar.btnInsertEquation.id) {
                        me._isAddingShape = false;
                        me._isAddingEquation = false;
                        me._addAutoshape(false);
                        me.toolbar.btnInsertShape.toggle(false, true);
                        me.toolbar.btnInsertText.toggle(false, true);
                        me.toolbar.btnInsertEquation.toggle(false, true);
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                    } else {
                        if (me.toolbar.btnInsertShape.pressed && btn_id == me.toolbar.btnInsertShape.id) {
                            _.defer(function () {
                                me.api.StartAddShape("", false);
                                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                            },
                            100);
                        }
                    }
                }
            };
            this.onApiEndAddShape = function () {
                this.toolbar.fireEvent("insertshape", this.toolbar);
                if (this.toolbar.btnInsertShape.pressed) {
                    this.toolbar.btnInsertShape.toggle(false, true);
                }
                if (this.toolbar.btnInsertText.pressed) {
                    this.toolbar.btnInsertText.toggle(false, true);
                }
                $(document.body).off("mouseup", checkInsertAutoshape);
            };
            this._addAutoshape = function (isstart, type) {
                if (this.api) {
                    if (isstart) {
                        this.api.StartAddShape(type, true);
                        $(document.body).on("mouseup", checkInsertAutoshape);
                    } else {
                        this.api.StartAddShape("", false);
                        $(document.body).off("mouseup", checkInsertAutoshape);
                    }
                }
            };
        },
        onLaunch: function () {
            this.toolbar = this.createView("Toolbar");
            this.toolbar.on("render:after", _.bind(this.onToolbarAfterRender, this));
        },
        onToolbarAfterRender: function (toolbar) {
            toolbar.btnNewDocument.on("click", _.bind(this.onNewDocument, this));
            toolbar.btnOpenDocument.on("click", _.bind(this.onOpenDocument, this));
            toolbar.btnPrint.on("click", _.bind(this.onPrint, this));
            toolbar.btnSave.on("click", _.bind(this.onSave, this));
            toolbar.btnUndo.on("click", _.bind(this.onUndo, this));
            toolbar.btnRedo.on("click", _.bind(this.onRedo, this));
            toolbar.btnCopy.on("click", _.bind(this.onCopyPaste, this, true));
            toolbar.btnPaste.on("click", _.bind(this.onCopyPaste, this, false));
            toolbar.btnIncFontSize.on("click", _.bind(this.onIncrease, this));
            toolbar.btnDecFontSize.on("click", _.bind(this.onDecrease, this));
            toolbar.btnBold.on("click", _.bind(this.onBold, this));
            toolbar.btnItalic.on("click", _.bind(this.onItalic, this));
            toolbar.btnUnderline.on("click", _.bind(this.onUnderline, this));
            toolbar.btnStrikeout.on("click", _.bind(this.onStrikeout, this));
            toolbar.btnSuperscript.on("click", _.bind(this.onSuperscript, this));
            toolbar.btnSubscript.on("click", _.bind(this.onSubscript, this));
            toolbar.btnAlignLeft.on("click", _.bind(this.onHorizontalAlign, this, 1));
            toolbar.btnAlignCenter.on("click", _.bind(this.onHorizontalAlign, this, 2));
            toolbar.btnAlignRight.on("click", _.bind(this.onHorizontalAlign, this, 0));
            toolbar.btnAlignJust.on("click", _.bind(this.onHorizontalAlign, this, 3));
            toolbar.btnHorizontalAlign.menu.on("item:click", _.bind(this.onMenuHorizontalAlignSelect, this));
            toolbar.btnDecLeftOffset.on("click", _.bind(this.onDecOffset, this));
            toolbar.btnIncLeftOffset.on("click", _.bind(this.onIncOffset, this));
            toolbar.btnMarkers.on("click", _.bind(this.onMarkers, this));
            toolbar.btnNumbers.on("click", _.bind(this.onNumbers, this));
            toolbar.cmbFontName.on("selected", _.bind(this.onFontNameSelect, this));
            toolbar.cmbFontName.on("show:after", _.bind(this.onFontNameOpen, this));
            toolbar.cmbFontName.on("hide:after", _.bind(this.onHideMenus, this));
            toolbar.cmbFontName.on("combo:blur", _.bind(this.onComboBlur, this));
            toolbar.cmbFontSize.on("selected", _.bind(this.onFontSizeSelect, this));
            toolbar.cmbFontSize.on("changed:before", _.bind(this.onFontSizeChanged, this, true));
            toolbar.cmbFontSize.on("changed:after", _.bind(this.onFontSizeChanged, this, false));
            toolbar.cmbFontSize.on("combo:blur", _.bind(this.onComboBlur, this));
            toolbar.cmbFontSize.on("show:after", _.bind(this.onFontSizeOpen, this));
            toolbar.cmbFontSize.on("hide:after", _.bind(this.onHideMenus, this));
            toolbar.mnuMarkersPicker.on("item:click", _.bind(this.onSelectBullets, this, toolbar.btnMarkers));
            toolbar.mnuNumbersPicker.on("item:click", _.bind(this.onSelectBullets, this, toolbar.btnNumbers));
            toolbar.mnuMultilevelPicker.on("item:click", _.bind(this.onSelectBullets, this, toolbar.btnMultilevels));
            toolbar.btnHighlightColor.on("click", _.bind(this.onBtnHighlightColor, this));
            toolbar.btnFontColor.on("click", _.bind(this.onBtnFontColor, this));
            toolbar.btnParagraphColor.on("click", _.bind(this.onBtnParagraphColor, this));
            toolbar.mnuHighlightColorPicker.on("select", _.bind(this.onSelectHighlightColor, this));
            toolbar.mnuFontColorPicker.on("select", _.bind(this.onSelectFontColor, this));
            toolbar.mnuParagraphColorPicker.on("select", _.bind(this.onParagraphColorPickerSelect, this));
            toolbar.mnuHighlightTransparent.on("click", _.bind(this.onHighlightTransparentClick, this));
            $("#id-toolbar-menu-auto-fontcolor").on("click", _.bind(this.onAutoFontColor, this));
            $("#id-toolbar-menu-new-fontcolor").on("click", _.bind(this.onNewFontColor, this));
            $("#id-toolbar-menu-new-paracolor").on("click", _.bind(this.onNewParagraphColor, this));
            toolbar.mnuLineSpace.on("item:toggle", _.bind(this.onLineSpaceToggle, this));
            toolbar.mnuNonPrinting.on("item:toggle", _.bind(this.onMenuNonPrintingToggle, this));
            toolbar.btnShowHidenChars.on("toggle", _.bind(this.onNonPrintingToggle, this));
            toolbar.btnInsertPageBreak.on("click", _.bind(this.onPageBreakClick, this));
            toolbar.btnInsertPageBreak.menu.on("item:click", _.bind(this.onPageBreakClick, this));
            toolbar.mnuInsertSectionBreak.menu.on("item:click", _.bind(this.onSectionBreakClick, this));
            toolbar.btnInsertHyperlink.on("click", _.bind(this.onHyperlinkClick, this));
            toolbar.mnuTablePicker.on("select", _.bind(this.onTablePickerSelect, this));
            toolbar.mnuInsertTable.on("item:click", _.bind(this.onInsertTableClick, this));
            toolbar.mnuInsertImage.on("item:click", _.bind(this.onInsertImageClick, this));
            toolbar.btnInsertText.on("click", _.bind(this.onInsertTextClick, this));
            toolbar.btnInsertShape.menu.on("hide:after", _.bind(this.onInsertShapeHide, this));
            toolbar.btnInsertEquation.menu.on("hide:after", _.bind(this.onInsertEquationHide, this));
            toolbar.btnDropCap.menu.on("item:click", _.bind(this.onDropCapSelect, this));
            toolbar.mnuDropCapAdvanced.on("click", _.bind(this.onDropCapAdvancedClick, this));
            toolbar.btnPageOrient.on("toggle", _.bind(this.onPageOrientToggle, this));
            toolbar.btnClearStyle.on("click", _.bind(this.onClearStyleClick, this));
            toolbar.btnCopyStyle.on("toggle", _.bind(this.onCopyStyleToggle, this));
            toolbar.btnAdvSettings.on("click", _.bind(this.onAdvSettingsClick, this));
            toolbar.mnuPageSize.on("item:click", _.bind(this.onPageSizeClick, this));
            toolbar.mnuColorSchema.on("item:click", _.bind(this.onColorSchemaClick, this));
            toolbar.mnuInsertChartPicker.on("item:click", _.bind(this.onSelectChart, this));
            toolbar.mnuPageNumberPosPicker.on("item:click", _.bind(this.onInsertPageNumberClick, this));
            toolbar.btnEditHeader.menu.on("item:click", _.bind(this.onEditHeaderFooterClick, this));
            toolbar.mnuPageNumCurrentPos.on("click", _.bind(this.onPageNumCurrentPosClick, this));
            toolbar.listStyles.on("click", _.bind(this.onListStyleSelect, this));
            toolbar.mnuitemHideTitleBar.on("toggle", _.bind(this.onHideTitleBar, this));
            toolbar.mnuitemHideStatusBar.on("toggle", _.bind(this.onHideStatusBar, this));
            toolbar.mnuitemHideRulers.on("toggle", _.bind(this.onHideRulers, this));
            toolbar.btnFitPage.on("toggle", _.bind(this.onZoomToPageToggle, this));
            toolbar.btnFitWidth.on("toggle", _.bind(this.onZoomToWidthToggle, this));
            toolbar.mnuZoomIn.on("click", _.bind(this.onZoomInClick, this));
            toolbar.mnuZoomOut.on("click", _.bind(this.onZoomOutClick, this));
            this.onSetupCopyStyleButton();
        },
        setApi: function (api) {
            this.api = api;
            this.toolbar.setApi(api);
            this.api.asc_registerCallback("asc_onFontSize", _.bind(this.onApiFontSize, this));
            this.api.asc_registerCallback("asc_onBold", _.bind(this.onApiBold, this));
            this.api.asc_registerCallback("asc_onItalic", _.bind(this.onApiItalic, this));
            this.api.asc_registerCallback("asc_onUnderline", _.bind(this.onApiUnderline, this));
            this.api.asc_registerCallback("asc_onStrikeout", _.bind(this.onApiStrikeout, this));
            this.api.asc_registerCallback("asc_onVerticalAlign", _.bind(this.onApiVerticalAlign, this));
            this.api.asc_registerCallback("asc_onCanUndo", _.bind(this.onApiCanRevert, this, "undo"));
            this.api.asc_registerCallback("asc_onCanRedo", _.bind(this.onApiCanRevert, this, "redo"));
            this.api.asc_registerCallback("asc_onListType", _.bind(this.onApiBullets, this));
            this.api.asc_registerCallback("asc_onPrAlign", _.bind(this.onApiParagraphAlign, this));
            this.api.asc_registerCallback("asc_onTextColor", _.bind(this.onApiTextColor, this));
            this.api.asc_registerCallback("asc_onParaSpacingLine", _.bind(this.onApiLineSpacing, this));
            this.api.asc_registerCallback("asc_onCanAddHyperlink", _.bind(this.onApiCanAddHyperlink, this));
            this.api.asc_registerCallback("asc_onFocusObject", _.bind(this.onApiFocusObject, this));
            this.api.asc_registerCallback("asc_onDocSize", _.bind(this.onApiPageSize, this));
            this.api.asc_registerCallback("asc_onPaintFormatChanged", _.bind(this.onApiStyleChange, this));
            this.api.asc_registerCallback("asc_onParaStyleName", _.bind(this.onApiParagraphStyleChange, this));
            this.api.asc_registerCallback("asc_onEndAddShape", _.bind(this.onApiEndAddShape, this));
            this.api.asc_registerCallback("asc_onPageOrient", _.bind(this.onApiPageOrient, this));
            this.api.asc_registerCallback("asc_onLockDocumentProps", _.bind(this.onApiLockDocumentProps, this));
            this.api.asc_registerCallback("asc_onUnLockDocumentProps", _.bind(this.onApiUnLockDocumentProps, this));
            this.api.asc_registerCallback("asc_onLockDocumentSchema", _.bind(this.onApiLockDocumentSchema, this));
            this.api.asc_registerCallback("asc_onUnLockDocumentSchema", _.bind(this.onApiUnLockDocumentSchema, this));
            this.api.asc_registerCallback("asc_onLockHeaderFooters", _.bind(this.onApiLockHeaderFooters, this));
            this.api.asc_registerCallback("asc_onUnLockHeaderFooters", _.bind(this.onApiUnLockHeaderFooters, this));
            this.api.asc_registerCallback("asc_onZoomChange", _.bind(this.onApiZoomChange, this));
            this.api.asc_registerCallback("asc_onMarkerFormatChanged", _.bind(this.onApiStartHighlight, this));
            this.api.asc_registerCallback("asc_onTextHighLight", _.bind(this.onApiHighlightColor, this));
            this.api.asc_registerCallback("asc_onInitEditorStyles", _.bind(this.onApiInitEditorStyles, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            this.api.asc_registerCallback("asc_onCanCopyCut", _.bind(this.onApiCanCopyCut, this));
            Common.NotificationCenter.on("copywarning:show", _.bind(function () {
                this._state.show_copywarning = false;
            },
            this));
            this.api.asc_registerCallback("asc_onMathTypes", _.bind(this.onMathTypes, this));
            this.onApiPageSize(this.api.get_DocumentWidth(), this.api.get_DocumentHeight());
        },
        onChangeCompactView: function (view, compact) {
            window.localStorage.setItem("de-compact-toolbar", compact ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "toolbar");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onApiFontSize: function (size) {
            if (!this.flg.setFontSize) {
                if (this.toolbar.cmbFontSize.getValue() != size) {
                    this.toolbar.cmbFontSize.setValue(size);
                }
            }
        },
        onApiBold: function (on) {
            if (this._state.bold !== on) {
                this.toolbar.btnBold.toggle(on === true, true);
                this._state.bold = on;
            }
        },
        onApiItalic: function (on) {
            if (this._state.italic !== on) {
                this.toolbar.btnItalic.toggle(on === true, true);
                this._state.italic = on;
            }
        },
        onApiUnderline: function (on) {
            if (this._state.underline !== on) {
                this.toolbar.btnUnderline.toggle(on === true, true);
                this._state.underline = on;
            }
        },
        onApiStrikeout: function (on) {
            if (this._state.strike !== on) {
                this.toolbar.btnStrikeout.toggle(on === true, true);
                this._state.strike = on;
            }
        },
        onApiVerticalAlign: function (typeBaseline) {
            if (this._state.valign !== typeBaseline) {
                this.toolbar.btnSuperscript.toggle(typeBaseline == 1, true);
                this.toolbar.btnSubscript.toggle(typeBaseline == 2, true);
                this._state.valign = typeBaseline;
            }
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
        onApiCanCopyCut: function (can) {
            if (this._state.can_copycut !== can) {
                this.toolbar.btnCopy.setDisabled(!can);
                this._state.can_copycut = can;
            }
        },
        onApiBullets: function (v) {
            var type = v.get_ListType();
            if (this._state.bullets.type != type || this._state.bullets.subtype != v.get_ListSubType() || this.toolbar.btnMarkers.pressed && (type !== 0) || this.toolbar.btnNumbers.pressed && (type !== 1) || this.toolbar.btnMultilevels.pressed && (type !== 2)) {
                this._state.bullets.type = type;
                this._state.bullets.subtype = v.get_ListSubType();
                this._clearBullets();
                switch (this._state.bullets.type) {
                case 0:
                    this.toolbar.btnMarkers.toggle(true, true);
                    this.toolbar.mnuMarkersPicker.selectByIndex(this._state.bullets.subtype, true);
                    break;
                case 1:
                    var idx = 0;
                    switch (this._state.bullets.subtype) {
                    case 1:
                        idx = 4;
                        break;
                    case 2:
                        idx = 5;
                        break;
                    case 3:
                        idx = 6;
                        break;
                    case 4:
                        idx = 1;
                        break;
                    case 5:
                        idx = 2;
                        break;
                    case 6:
                        idx = 3;
                        break;
                    case 7:
                        idx = 7;
                        break;
                    }
                    this.toolbar.btnNumbers.toggle(true, true);
                    this.toolbar.mnuNumbersPicker.selectByIndex(idx, true);
                    break;
                case 2:
                    this.toolbar.btnMultilevels.toggle(true, true);
                    this.toolbar.mnuMultilevelPicker.selectByIndex(this._state.bullets.subtype, true);
                    break;
                }
            }
        },
        onApiParagraphAlign: function (v) {
            if (this._state.pralign !== v) {
                this._state.pralign = v;
                var index = -1,
                align, toolbar = this.toolbar;
                switch (v) {
                case 0:
                    index = 2;
                    align = "btn-align-right";
                    break;
                case 1:
                    index = 0;
                    align = "btn-align-left";
                    break;
                case 2:
                    index = 1;
                    align = "btn-align-center";
                    break;
                case 3:
                    index = 3;
                    align = "btn-align-just";
                    break;
                default:
                    index = -255;
                    align = "btn-align-left";
                    break;
                }
                if (! (index < 0)) {
                    this.toolbar.btnHorizontalAlign.menu.items[index].setChecked(true);
                } else {
                    if (index == -255) {
                        this._clearChecked(this.toolbar.btnHorizontalAlign.menu);
                    }
                }
                var btnHorizontalAlign = this.toolbar.btnHorizontalAlign;
                if (btnHorizontalAlign.rendered) {
                    var iconEl = $(".btn-icon", btnHorizontalAlign.cmpEl);
                    if (iconEl) {
                        iconEl.removeClass(btnHorizontalAlign.options.icls);
                        btnHorizontalAlign.options.icls = align;
                        iconEl.addClass(btnHorizontalAlign.options.icls);
                    }
                }
                if (v === null || v === undefined) {
                    toolbar.btnAlignRight.toggle(false, true);
                    toolbar.btnAlignLeft.toggle(false, true);
                    toolbar.btnAlignCenter.toggle(false, true);
                    toolbar.btnAlignJust.toggle(false, true);
                    return;
                }
                toolbar.btnAlignRight.toggle(v === 0, true);
                toolbar.btnAlignLeft.toggle(v === 1, true);
                toolbar.btnAlignCenter.toggle(v === 2, true);
                toolbar.btnAlignJust.toggle(v === 3, true);
            }
        },
        onApiLineSpacing: function (vc) {
            var line = (vc.get_Line() === null || vc.get_LineRule() === null || vc.get_LineRule() != 1) ? -1 : vc.get_Line();
            if (this._state.linespace !== line) {
                this._state.linespace = line;
                _.each(this.toolbar.mnuLineSpace.items, function (item) {
                    item.setChecked(false, true);
                });
                if (line < 0) {
                    return;
                }
                if (Math.abs(line - 1) < 0.0001) {
                    this.toolbar.mnuLineSpace.items[0].setChecked(true, true);
                } else {
                    if (Math.abs(line - 1.15) < 0.0001) {
                        this.toolbar.mnuLineSpace.items[1].setChecked(true, true);
                    } else {
                        if (Math.abs(line - 1.5) < 0.0001) {
                            this.toolbar.mnuLineSpace.items[2].setChecked(true, true);
                        } else {
                            if (Math.abs(line - 2) < 0.0001) {
                                this.toolbar.mnuLineSpace.items[3].setChecked(true, true);
                            } else {
                                if (Math.abs(line - 2.5) < 0.0001) {
                                    this.toolbar.mnuLineSpace.items[4].setChecked(true, true);
                                } else {
                                    if (Math.abs(line - 3) < 0.0001) {
                                        this.toolbar.mnuLineSpace.items[5].setChecked(true, true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        onApiCanAddHyperlink: function (value) {
            var need_disable = !value || this._state.prcontrolsdisable;
            if (need_disable != this.toolbar.btnInsertHyperlink.isDisabled() && this.editMode) {
                this.toolbar.btnInsertHyperlink.setDisabled(need_disable);
            }
        },
        onApiPageSize: function (w, h) {
            if (Math.abs(this._state.pgsize[0] - w) > 0.01 || Math.abs(this._state.pgsize[1] - h) > 0.01) {
                this._state.pgsize = [w, h];
                if (this.toolbar.mnuPageSize) {
                    _.each(this.toolbar.mnuPageSize.items, function (item) {
                        if (Math.abs(item.value[0] - w) < 0.01 && Math.abs(item.value[1] - h) < 0.01) {
                            item.setChecked(true);
                            return false;
                        }
                    },
                    this);
                }
            }
        },
        onApiFocusObject: function (selectedObjects) {
            if (!this.editMode) {
                return;
            }
            var pr, sh, i = -1,
            type, paragraph_locked = false,
            header_locked = false,
            can_add_table = false,
            can_add_image = false,
            enable_dropcap = undefined,
            disable_dropcapadv = true,
            frame_pr = undefined,
            toolbar = this.toolbar,
            in_header = false,
            in_chart = false,
            in_equation = false,
            btn_eq_state = false;
            while (++i < selectedObjects.length) {
                type = selectedObjects[i].get_ObjectType();
                pr = selectedObjects[i].get_ObjectValue();
                if (type === c_oAscTypeSelectElement.Paragraph) {
                    paragraph_locked = pr.get_Locked();
                    can_add_table = pr.get_CanAddTable();
                    can_add_image = pr.get_CanAddImage();
                    frame_pr = pr;
                    sh = pr.get_Shade();
                } else {
                    if (type === c_oAscTypeSelectElement.Header) {
                        header_locked = pr.get_Locked();
                        in_header = true;
                    } else {
                        if (type === c_oAscTypeSelectElement.Image) {
                            in_header = true;
                            if (pr && pr.get_ChartProperties()) {
                                in_chart = true;
                            }
                        } else {
                            if (type === c_oAscTypeSelectElement.Math) {
                                in_equation = true;
                                if (c_oAscMathInterfaceType.Common === pr.get_Type()) {
                                    btn_eq_state = true;
                                }
                            }
                        }
                    }
                }
                if (type === c_oAscTypeSelectElement.Table || type === c_oAscTypeSelectElement.Header || type === c_oAscTypeSelectElement.Image) {
                    enable_dropcap = false;
                }
                if (enable_dropcap !== false && type == c_oAscTypeSelectElement.Paragraph) {
                    enable_dropcap = true;
                }
            }
            if (sh) {
                this.onParagraphColor(sh);
            }
            var need_disable = paragraph_locked || header_locked;
            if (this._state.prcontrolsdisable != need_disable) {
                if (this._state.activated) {
                    this._state.prcontrolsdisable = need_disable;
                }
                _.each(toolbar.paragraphControls, function (item) {
                    item.setDisabled(need_disable);
                },
                this);
            }
            var need_text_disable = paragraph_locked || header_locked || in_chart;
            if (this._state.textonlycontrolsdisable != need_text_disable) {
                if (this._state.activated) {
                    this._state.textonlycontrolsdisable = need_text_disable;
                }
                if (!need_disable) {
                    _.each(toolbar.textOnlyControls, function (item) {
                        item.setDisabled(need_text_disable);
                    },
                    this);
                }
                toolbar.btnCopyStyle.setDisabled(need_text_disable);
                toolbar.btnClearStyle.setDisabled(need_text_disable);
            }
            if (enable_dropcap && frame_pr) {
                var value = frame_pr.get_FramePr(),
                drop_value = c_oAscDropCap.None;
                if (value !== undefined) {
                    drop_value = value.get_DropCap();
                    enable_dropcap = (drop_value === c_oAscDropCap.Drop || drop_value === c_oAscDropCap.Margin);
                    disable_dropcapadv = false;
                } else {
                    enable_dropcap = frame_pr.get_CanAddDropCap();
                }
                if (enable_dropcap) {
                    this.onDropCap(drop_value);
                }
            }
            need_disable = need_disable || !enable_dropcap || in_equation;
            if (need_disable !== toolbar.btnDropCap.isDisabled()) {
                toolbar.btnDropCap.setDisabled(need_disable);
            }
            if (!toolbar.btnDropCap.isDisabled() && disable_dropcapadv !== toolbar.mnuDropCapAdvanced.isDisabled()) {
                toolbar.mnuDropCapAdvanced.setDisabled(disable_dropcapadv);
            }
            need_disable = !can_add_table || header_locked || in_equation;
            if (need_disable != toolbar.btnInsertTable.isDisabled()) {
                toolbar.btnInsertTable.setDisabled(need_disable);
            }
            need_disable = toolbar.mnuPageNumCurrentPos.isDisabled() && toolbar.mnuPageNumberPosPicker.isDisabled();
            if (need_disable != toolbar.mnuInsertPageNum.isDisabled()) {
                toolbar.mnuInsertPageNum.setDisabled(need_disable);
            }
            need_disable = paragraph_locked || header_locked || in_header || in_equation && !btn_eq_state;
            if (need_disable != toolbar.btnInsertPageBreak.isDisabled()) {
                toolbar.btnInsertPageBreak.setDisabled(need_disable);
            }
            need_disable = paragraph_locked || header_locked || !can_add_image || in_equation;
            if (need_disable != toolbar.btnInsertChart.isDisabled()) {
                toolbar.btnInsertChart.setDisabled(need_disable);
                toolbar.btnInsertImage.setDisabled(need_disable);
                toolbar.btnInsertShape.setDisabled(need_disable);
                toolbar.btnInsertText.setDisabled(need_disable);
            }
            need_disable = paragraph_locked || header_locked || in_chart || !can_add_image && !in_equation;
            if (need_disable !== toolbar.btnInsertEquation.isDisabled()) {
                toolbar.btnInsertEquation.setDisabled(need_disable);
            }
            need_disable = paragraph_locked || header_locked || in_equation;
            if (need_disable !== toolbar.btnSuperscript.isDisabled()) {
                toolbar.btnSuperscript.setDisabled(need_disable);
                toolbar.btnSubscript.setDisabled(need_disable);
            }
            if (in_equation !== toolbar.btnEditHeader.isDisabled()) {
                toolbar.btnEditHeader.setDisabled(in_equation);
            }
        },
        onApiStyleChange: function (v) {
            this.toolbar.btnCopyStyle.toggle(v, true);
            this.modeAlwaysSetStyle = false;
        },
        onApiParagraphStyleChange: function (name) {
            if (this._state.prstyle != name) {
                var listStyle = this.toolbar.listStyles,
                listStylesVisible = (listStyle.rendered);
                if (listStylesVisible) {
                    listStyle.suspendEvents();
                    var styleRec = listStyle.menuPicker.store.findWhere({
                        title: name
                    });
                    this._state.prstyle = (listStyle.menuPicker.store.length > 0) ? name : undefined;
                    listStyle.menuPicker.selectRecord(styleRec);
                    listStyle.resumeEvents();
                }
            }
        },
        onApiPageOrient: function (isportrait) {
            if (this._state.pgorient !== isportrait) {
                this.toolbar.btnPageOrient.toggle(!isportrait, true);
                this._state.pgorient = isportrait;
            }
        },
        onApiLockDocumentProps: function () {
            if (this._state.lock_doc !== true) {
                this.toolbar.btnPageOrient.setDisabled(true);
                this.toolbar.btnPageSize.setDisabled(true);
                if (this._state.activated) {
                    this._state.lock_doc = true;
                }
            }
        },
        onApiUnLockDocumentProps: function () {
            if (this._state.lock_doc !== false) {
                this.toolbar.btnPageOrient.setDisabled(false);
                this.toolbar.btnPageSize.setDisabled(false);
                if (this._state.activated) {
                    this._state.lock_doc = false;
                }
            }
        },
        onApiLockDocumentSchema: function () {
            this.toolbar.btnColorSchemas.setDisabled(true);
        },
        onApiUnLockDocumentSchema: function () {
            this.toolbar.btnColorSchemas.setDisabled(false);
        },
        onApiLockHeaderFooters: function () {
            this.toolbar.mnuPageNumberPosPicker.setDisabled(true);
            this.toolbar.mnuInsertPageNum.setDisabled(this.toolbar.mnuPageNumCurrentPos.isDisabled());
        },
        onApiUnLockHeaderFooters: function () {
            this.toolbar.mnuPageNumberPosPicker.setDisabled(false);
            this.toolbar.mnuInsertPageNum.setDisabled(false);
        },
        onApiZoomChange: function (percent, type) {
            this.toolbar.btnFitPage.setChecked(type == 2, true);
            this.toolbar.btnFitWidth.setChecked(type == 1, true);
            $(".menu-zoom .zoom", this.toolbar.el).html(percent + "%");
        },
        onApiStartHighlight: function (pressed) {
            this.toolbar.btnHighlightColor.toggle(pressed, true);
        },
        onApiHighlightColor: function (c) {
            var textpr = this.api.get_TextProps().get_TextPr();
            if (textpr) {
                c = textpr.get_HighLight();
                if (c == -1) {
                    if (this._state.clrhighlight != -1) {
                        this.toolbar.mnuHighlightTransparent.setChecked(true, true);
                        if (this.toolbar.mnuHighlightColorPicker.cmpEl) {
                            this._state.clrhighlight = -1;
                            this.toolbar.mnuHighlightColorPicker.select(null, true);
                        }
                    }
                } else {
                    if (c !== null) {
                        if (this._state.clrhighlight != c.get_hex().toUpperCase()) {
                            this.toolbar.mnuHighlightTransparent.setChecked(false);
                            this._state.clrhighlight = c.get_hex().toUpperCase();
                            if (_.contains(this.toolbar.mnuHighlightColorPicker.colors, this._state.clrhighlight)) {
                                this.toolbar.mnuHighlightColorPicker.select(this._state.clrhighlight, true);
                            }
                        }
                    } else {
                        if (this._state.clrhighlight !== c) {
                            this.toolbar.mnuHighlightTransparent.setChecked(false, true);
                            this.toolbar.mnuHighlightColorPicker.select(null, true);
                            this._state.clrhighlight = c;
                        }
                    }
                }
            }
        },
        onApiInitEditorStyles: function (styles) {
            this._onInitEditorStyles(styles);
        },
        onNewDocument: function (btn, e) {
            if (this.api) {
                this.api.OpenNewDocument();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "New Document");
        },
        onOpenDocument: function (btn, e) {
            if (this.api) {
                this.api.LoadDocumentFromDisk();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Open Document");
        },
        onPrint: function (e) {
            if (this.api) {
                this.api.asc_Print();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("Print");
            Common.component.Analytics.trackEvent("ToolBar", "Print");
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
            this.toolbar.btnSave.setDisabled(true);
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("Save");
            Common.component.Analytics.trackEvent("ToolBar", "Save");
        },
        onUndo: function (btn, e) {
            if (this.api) {
                this.api.Undo();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Undo");
        },
        onRedo: function (btn, e) {
            if (this.api) {
                this.api.Redo();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Redo");
        },
        onCopyPaste: function (copy, e) {
            var me = this;
            if (me.api) {
                var value = window.localStorage.getItem("de-hide-copywarning");
                if (! (value && parseInt(value) == 1) && this._state.show_copywarning) {
                    (new Common.Views.CopyWarningDialog({
                        handler: function (dontshow) {
                            copy ? me.api.Copy() : me.api.Paste();
                            if (dontshow) {
                                window.localStorage.setItem("de-hide-copywarning", 1);
                            }
                            Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                        }
                    })).show();
                } else {
                    copy ? me.api.Copy() : me.api.Paste();
                    Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                }
                Common.component.Analytics.trackEvent("ToolBar", "Copy Warning");
            } else {
                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
            }
        },
        onIncrease: function (e) {
            if (this.api) {
                this.api.FontSizeIn();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        onDecrease: function (e) {
            if (this.api) {
                this.api.FontSizeOut();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        },
        onBold: function (btn, e) {
            this._state.bold = undefined;
            if (this.api) {
                this.api.put_TextPrBold(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Bold");
        },
        onItalic: function (btn, e) {
            this._state.italic = undefined;
            if (this.api) {
                this.api.put_TextPrItalic(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Italic");
        },
        onUnderline: function (btn, e) {
            this._state.underline = undefined;
            if (this.api) {
                this.api.put_TextPrUnderline(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Underline");
        },
        onStrikeout: function (btn, e) {
            this._state.strike = undefined;
            if (this.api) {
                this.api.put_TextPrStrikeout(btn.pressed);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Strikeout");
        },
        onSuperscript: function (btn, e) {
            if (!this.toolbar.btnSubscript.pressed) {
                this._state.valign = undefined;
                if (this.api) {
                    this.api.put_TextPrBaseline(btn.pressed ? 1 : 0);
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Superscript");
            }
        },
        onSubscript: function (btn, e) {
            if (!this.toolbar.btnSuperscript.pressed) {
                this._state.valign = undefined;
                if (this.api) {
                    this.api.put_TextPrBaseline(btn.pressed ? 2 : 0);
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Subscript");
            }
        },
        onDecOffset: function (btn, e) {
            if (this.api) {
                this.api.DecreaseIndent();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Indent");
        },
        onIncOffset: function (btn, e) {
            if (this.api) {
                this.api.IncreaseIndent();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Indent");
        },
        onHorizontalAlign: function (type, btn, e) {
            this._state.pralign = undefined;
            if (this.api) {
                this.api.put_PrAlign(type);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Align");
        },
        onMenuHorizontalAlignSelect: function (menu, item) {
            this._state.pralign = undefined;
            var btnHorizontalAlign = this.toolbar.btnHorizontalAlign,
            iconEl = $(".btn-icon", btnHorizontalAlign.cmpEl);
            if (iconEl) {
                iconEl.removeClass(btnHorizontalAlign.options.icls);
                btnHorizontalAlign.options.icls = !item.checked ? "btn-align-left" : item.options.icls;
                iconEl.addClass(btnHorizontalAlign.options.icls);
            }
            if (this.api && item.checked) {
                this.api.put_PrAlign(item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Horizontal Align");
        },
        onMarkers: function (btn, e) {
            var record = {
                data: {
                    type: 0,
                    subtype: btn.pressed ? 0 : -1
                }
            };
            this.onSelectBullets(null, null, null, record);
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onNumbers: function (btn, e) {
            var record = {
                data: {
                    type: 1,
                    subtype: btn.pressed ? 0 : -1
                }
            };
            this.onSelectBullets(null, null, null, record);
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onComboBlur: function () {
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onFontNameSelect: function (combo, record) {
            if (this.api) {
                this.api.put_TextPrFontName(record.name);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Font Name");
        },
        onFontNameOpen: function (combo) {
            _.delay(function () {
                $("input", combo.cmpEl).select().focus();
            },
            10);
        },
        onFontSizeSelect: function (combo, record) {
            this.flg.setFontSize = true;
            if (this.api) {
                this.api.put_TextPrFontSize(record.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            this.flg.setFontSize = false;
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
                this.flg.setFontSize = true;
                if (this.api) {
                    this.api.put_TextPrFontSize(value);
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                this.flg.setFontSize = false;
            }
        },
        onFontSizeOpen: function (combo) {
            _.delay(function () {
                $("input", combo.cmpEl).select().focus();
            },
            10);
        },
        onSelectBullets: function (btn, picker, itemView, record) {
            var rawData = {},
            isPickerSelect = _.isFunction(record.toJSON);
            if (isPickerSelect) {
                if (record.get("selected")) {
                    rawData = record.toJSON();
                } else {
                    return;
                }
            } else {
                rawData = record;
            }
            if (btn) {
                btn.toggle(rawData.data.subtype > -1, true);
            }
            this._state.bullets.type = rawData.data.type;
            this._state.bullets.subtype = rawData.data.subtype;
            if (this.api) {
                this.api.put_ListType(rawData.data.type, rawData.data.subtype);
            }
            Common.component.Analytics.trackEvent("ToolBar", "List Type");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onLineSpaceToggle: function (menu, item, state, e) {
            if ( !! state) {
                this._state.linespace = undefined;
                if (this.api) {
                    this.api.put_PrLineSpacing(c_paragraphLinerule.LINERULE_AUTO, item.value);
                }
                Common.component.Analytics.trackEvent("ToolBar", "Line Spacing");
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            }
        },
        onMenuNonPrintingToggle: function (menu, item, state, e) {
            var me = this;
            if (item.value === "characters") {
                window.localStorage.setItem("de-show-hiddenchars", state);
                me.toolbar.btnShowHidenChars.toggle(state, true);
                if (me.api) {
                    me.api.put_ShowParaMarks(state);
                }
                Common.NotificationCenter.trigger("edit:complete", me);
                Common.component.Analytics.trackEvent("ToolBar", "Hidden Characters");
            } else {
                if (item.value === "table") {
                    window.localStorage.setItem("de-show-tableline", state);
                    me.api && me.api.put_ShowTableEmptyLine(state);
                    Common.NotificationCenter.trigger("edit:complete", me);
                }
            }
        },
        onNonPrintingToggle: function (btn, state) {
            var me = this;
            if (state) {
                me.toolbar.mnuNonPrinting.items[0].setChecked(true, true);
                Common.component.Analytics.trackEvent("ToolBar", "Hidden Characters");
            } else {
                me.toolbar.mnuNonPrinting.items[0].setChecked(false, true);
            }
            if (me.api) {
                me.api.put_ShowParaMarks(state);
            }
            window.localStorage.setItem("de-show-hiddenchars", state);
            Common.NotificationCenter.trigger("edit:complete", me);
        },
        onPageBreakClick: function (menu, item, e) {
            if (this.api) {
                if (item.value === "section") {} else {
                    this.api.put_AddPageBreak();
                    Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                    Common.component.Analytics.trackEvent("ToolBar", "Page Break");
                }
            }
        },
        onSectionBreakClick: function (menu, item, e) {
            if (this.api) {
                this.api.add_SectionBreak(item.value);
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Section Break");
            }
        },
        onHyperlinkClick: function (btn) {
            var me = this,
            win, props, text;
            if (me.api) {
                var handlerDlg = function (dlg, result) {
                    if (result == "ok") {
                        props = dlg.getSettings();
                        (text !== false) ? me.api.add_Hyperlink(props) : me.api.change_Hyperlink(props);
                    }
                    Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                };
                text = me.api.can_AddHyperlink();
                if (text !== false) {
                    win = new DE.Views.HyperlinkSettingsDialog({
                        handler: handlerDlg
                    });
                    props = new CHyperlinkProperty();
                    props.put_Text(text);
                    win.show();
                    win.setSettings(props);
                } else {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && _.isArray(selectedElements)) {
                        _.each(selectedElements, function (el, i) {
                            if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.Hyperlink) {
                                props = selectedElements[i].get_ObjectValue();
                            }
                        });
                    }
                    if (props) {
                        win = new DE.Views.HyperlinkSettingsDialog({
                            handler: handlerDlg
                        });
                        win.show();
                        win.setSettings(props);
                    }
                }
            }
            Common.component.Analytics.trackEvent("ToolBar", "Add Hyperlink");
        },
        onTablePickerSelect: function (picker, columns, rows, e) {
            if (this.api) {
                this.toolbar.fireEvent("inserttable", this.toolbar);
                this.api.put_Table(columns, rows);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Table");
        },
        onInsertTableClick: function (menu, item, e) {
            if (item.value === "custom") {
                var me = this;
                (new Common.Views.InsertTableDialog({
                    handler: function (result, value) {
                        if (result == "ok") {
                            if (me.api) {
                                me.toolbar.fireEvent("inserttable", me.toolbar);
                                me.api.put_Table(value.columns, value.rows);
                            }
                            Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                            Common.component.Analytics.trackEvent("ToolBar", "Table");
                        }
                    }
                })).show();
            }
        },
        onInsertImageClick: function (menu, item, e) {
            var me = this;
            if (item.value === "file") {
                this.toolbar.fireEvent("insertimage", this.toolbar);
                if (this.api) {
                    this.api.AddImage();
                }
                Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Image");
            } else {
                (new Common.Views.ImageFromUrlDialog({
                    handler: function (result, value) {
                        if (result == "ok") {
                            if (me.api) {
                                var checkUrl = value.replace(/ /g, "");
                                if (!_.isEmpty(checkUrl)) {
                                    me.toolbar.fireEvent("insertimage", me.toolbar);
                                    me.api.AddImageUrl(checkUrl);
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
        onInsertTextClick: function (btn, e) {
            if (this.api) {
                this._addAutoshape(btn.pressed, "textRect");
            }
            if (this.toolbar.btnInsertShape.pressed) {
                this.toolbar.btnInsertShape.toggle(false, true);
            }
            if (this.toolbar.btnInsertEquation.pressed) {
                this.toolbar.btnInsertEquation.toggle(false, true);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, this.toolbar.btnInsertShape);
            Common.component.Analytics.trackEvent("ToolBar", "Add Text");
        },
        onInsertShapeHide: function (btn, e) {
            if (this.toolbar.btnInsertShape.pressed && !this._isAddingShape) {
                this.toolbar.btnInsertShape.toggle(false, true);
            }
            this._isAddingShape = false;
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, this.toolbar.btnInsertShape);
        },
        onInsertEquationHide: function (btn, e) {
            if (this.toolbar.btnInsertEquation.pressed && !this._isAddingEquation) {
                this.toolbar.btnInsertEquation.toggle(false, true);
            }
            this._isAddingEquation = false;
            Common.NotificationCenter.trigger("edit:complete", this.toolbar, this.toolbar.btnInsertEquation);
        },
        onPageOrientToggle: function (btn, state, e) {
            this._state.pgorient = undefined;
            if (this.api) {
                this.api.change_PageOrient(!state);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Page Orientation");
        },
        onClearStyleClick: function (btn, e) {
            if (this.api) {
                this.api.ClearFormating();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onCopyStyleToggle: function (btn, state, e) {
            if (this.api) {
                this.api.SetPaintFormat(state ? 1 : 0);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            this.modeAlwaysSetStyle = state;
        },
        onAdvSettingsClick: function (btn, e) {
            this.toolbar.fireEvent("file:settings", this);
            btn.cmpEl.blur();
        },
        onPageSizeClick: function (menu, item, state) {
            if (this.api && state) {
                this._state.pgsize = [0, 0];
                this.api.change_DocSize(item.value[0], item.value[1]);
                Common.component.Analytics.trackEvent("ToolBar", "Page Size");
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onColorSchemaClick: function (menu, item) {
            if (this.api) {
                this.api.ChangeColorScheme(item.value);
                Common.component.Analytics.trackEvent("ToolBar", "Color Scheme");
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onDropCapSelect: function (menu, item) {
            if (_.isUndefined(item.value)) {
                return;
            }
            this._state.dropcap = undefined;
            if (this.api && item.checked) {
                if (item.value === c_oAscDropCap.None) {
                    this.api.removeDropcap(true);
                } else {
                    var SelectedObjects = this.api.getSelectedElements(),
                    i = -1;
                    while (++i < SelectedObjects.length) {
                        if (SelectedObjects[i].get_ObjectType() == c_oAscTypeSelectElement.Paragraph) {
                            var pr = SelectedObjects[i].get_ObjectValue();
                            var value = pr.get_FramePr();
                            if (!_.isUndefined(value)) {
                                value = new CParagraphFrame();
                                value.put_FromDropCapMenu(true);
                                value.put_DropCap(item.value);
                                this.api.put_FramePr(value);
                            } else {
                                this.api.asc_addDropCap((item.value === c_oAscDropCap.Drop));
                            }
                            break;
                        }
                    }
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Drop Cap");
        },
        onDropCap: function (v) {
            if (this._state.dropcap === v) {
                return;
            }
            var index = -1;
            switch (v) {
            case c_oAscDropCap.None:
                index = 0;
                break;
            case c_oAscDropCap.Drop:
                index = 1;
                break;
            case c_oAscDropCap.Margin:
                index = 2;
                break;
            }
            if (index < 0) {
                this._clearChecked(this.toolbar.btnDropCap.menu);
            } else {
                this.toolbar.btnDropCap.menu.items[index].setChecked(true);
            }
            this._state.dropcap = v;
        },
        onDropCapAdvancedClick: function () {
            var win, props, text, me = this;
            if (_.isUndefined(me.fontstore)) {
                me.fontstore = new Common.Collections.Fonts();
                var fonts = me.toolbar.cmbFontName.store.toJSON();
                var arr = [];
                _.each(fonts, function (font, index) {
                    if (!font.cloneid) {
                        arr.push(_.clone(font));
                    }
                });
                me.fontstore.add(arr);
            }
            if (me.api) {
                var selectedElements = me.api.getSelectedElements(),
                selectedElementsLenght = selectedElements.length;
                if (selectedElements && _.isArray(selectedElements)) {
                    for (var i = 0; i < selectedElementsLenght; i++) {
                        if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.Paragraph) {
                            props = selectedElements[i].get_ObjectValue();
                            break;
                        }
                    }
                }
                if (props) {
                    (new DE.Views.DropcapSettingsAdvanced({
                        tableStylerRows: 2,
                        tableStylerColumns: 1,
                        fontStore: me.fontstore,
                        paragraphProps: props,
                        borderProps: me.borderAdvancedProps,
                        api: me.api,
                        isFrame: false,
                        handler: function (result, value) {
                            if (result == "ok") {
                                me.borderAdvancedProps = value.borderProps;
                                if (value.paragraphProps && value.paragraphProps.get_DropCap() === c_oAscDropCap.None) {
                                    me.api.removeDropcap(true);
                                } else {
                                    me.api.put_FramePr(value.paragraphProps);
                                }
                            }
                            Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                        }
                    })).show();
                }
            }
        },
        onSelectChart: function (picker, item, record) {
            var me = this,
            type = record.get("type");
            if (!this.diagramEditor) {
                this.diagramEditor = this.getApplication().getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
            }
            if (this.diagramEditor && me.api) {
                this.diagramEditor.setEditMode(false);
                this.diagramEditor.show();
                var chart = me.api.asc_getChartObject(type);
                if (chart) {
                    this.diagramEditor.setChartData(new Asc.asc_CChartBinary(chart));
                }
                me.toolbar.fireEvent("insertchart", me.toolbar);
            }
        },
        onInsertPageNumberClick: function (picker, item, record) {
            if (this.api) {
                this.api.put_PageNum(record.get("data").type, record.get("data").subtype);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Page Number");
        },
        onEditHeaderFooterClick: function (menu, item) {
            if (this.api) {
                if (item.value == "header") {
                    this.api.GoToHeader(this.api.getCurrentPage());
                } else {
                    if (item.value == "footer") {
                        this.api.GoToFooter(this.api.getCurrentPage());
                    } else {
                        return;
                    }
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Edit " + item.value);
            }
        },
        onPageNumCurrentPosClick: function (item) {
            if (this.api) {
                this.api.put_PageNum(-1);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Page Number");
        },
        onListStyleSelect: function (combo, record) {
            this._state.prstyle = undefined;
            if (this.api) {
                this.api.put_Style(record.get("title"));
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Style");
        },
        onHideTitleBar: function (item, checked) {
            var headerView = this.getApplication().getController("Viewport").getView("Common.Views.Header");
            headerView && headerView.setVisible(!checked);
            window.localStorage.setItem("de-hidden-title", checked ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "header");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onHideStatusBar: function (item, checked) {
            var headerView = this.getApplication().getController("Statusbar").getView("Statusbar");
            headerView && headerView.setVisible(!checked);
            window.localStorage.setItem("de-hidden-status", checked ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "status");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onHideRulers: function (item, checked) {
            if (this.api) {
                this.api.asc_SetViewRulers(!checked);
            }
            window.localStorage.setItem("de-hidden-rulers", checked ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "rulers");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomToPageToggle: function (item, state) {
            if (this.api) {
                if (state) {
                    this.api.zoomFitToPage();
                } else {
                    this.api.zoomCustomMode();
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomToWidthToggle: function (item, state) {
            if (this.api) {
                if (state) {
                    this.api.zoomFitToWidth();
                } else {
                    this.api.zoomCustomMode();
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomInClick: function (btn) {
            if (this.api) {
                this.api.zoomIn();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomOutClick: function (btn) {
            if (this.api) {
                this.api.zoomOut();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        _clearBullets: function () {
            this.toolbar.btnMarkers.toggle(false, true);
            this.toolbar.btnNumbers.toggle(false, true);
            this.toolbar.btnMultilevels.toggle(false, true);
            this.toolbar.mnuMarkersPicker.selectByIndex(0, true);
            this.toolbar.mnuNumbersPicker.selectByIndex(0, true);
            this.toolbar.mnuMultilevelPicker.selectByIndex(0, true);
        },
        _getApiTextSize: function () {
            var out_value = 12,
            textPr = this.api.get_TextProps();
            if (textPr && textPr.get_TextPr) {
                out_value = textPr.get_TextPr().get_FontSize();
            }
            return out_value;
        },
        onNewFontColor: function (picker, color) {
            this.toolbar.mnuFontColorPicker.addNewColor();
        },
        onAutoFontColor: function (e) {
            this._state.clrtext = this._state.clrtext_asccolor = undefined;
            var color = new CAscColor();
            color.put_auto(true);
            this.api.put_TextColor(color);
            this.toolbar.btnFontColor.currentColor = {
                color: color,
                isAuto: true
            };
            $(".btn-color-value-line", this.toolbar.btnFontColor.cmpEl).css("background-color", "#000");
            this.toolbar.mnuFontColorPicker.clearSelection();
            this.toolbar.mnuFontColorPicker.currentColor = {
                color: color,
                isAuto: true
            };
        },
        onNewParagraphColor: function (picker, color) {
            this.toolbar.mnuParagraphColorPicker.addNewColor();
        },
        onSelectHighlightColor: function (picker, color) {
            this._setMarkerColor(color, "menu");
        },
        onSelectFontColor: function (picker, color) {
            this._state.clrtext = this._state.clrtext_asccolor = undefined;
            var clr = (typeof(color) == "object") ? (color.isAuto ? "#000" : color.color) : color;
            this.toolbar.btnFontColor.currentColor = color;
            $(".btn-color-value-line", this.toolbar.btnFontColor.cmpEl).css("background-color", "#" + clr);
            this.toolbar.mnuFontColorPicker.currentColor = color;
            if (this.api) {
                this.api.put_TextColor(color.isAuto ? color.color : Common.Utils.ThemeColor.getRgbColor(color));
            }
            Common.component.Analytics.trackEvent("ToolBar", "Text Color");
        },
        onParagraphColorPickerSelect: function (picker, color) {
            this._state.clrback = this._state.clrshd_asccolor = undefined;
            var clr = (typeof(color) == "object") ? color.color : color;
            this.toolbar.btnParagraphColor.currentColor = color;
            $(".btn-color-value-line", this.toolbar.btnParagraphColor.cmpEl).css("background-color", color != "transparent" ? "#" + clr : clr);
            this.toolbar.mnuParagraphColorPicker.currentColor = color;
            if (this.api) {
                if (color == "transparent") {
                    this.api.put_ParagraphShade(false);
                } else {
                    this.api.put_ParagraphShade(true, Common.Utils.ThemeColor.getRgbColor(color));
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this);
        },
        onBtnHighlightColor: function (btn) {
            if (btn.pressed) {
                this._setMarkerColor(btn.currentColor);
                Common.component.Analytics.trackEvent("ToolBar", "Highlight Color");
            } else {
                this.api.SetMarkerFormat(false);
            }
        },
        onBtnFontColor: function () {
            this.toolbar.mnuFontColorPicker.trigger("select", this.toolbar.mnuFontColorPicker, this.toolbar.mnuFontColorPicker.currentColor);
        },
        onBtnParagraphColor: function () {
            this.toolbar.mnuParagraphColorPicker.trigger("select", this.toolbar.mnuParagraphColorPicker, this.toolbar.mnuParagraphColorPicker.currentColor);
        },
        onHighlightTransparentClick: function (item, e) {
            this._setMarkerColor("transparent", "menu");
            item.setChecked(true, true);
            this.toolbar.btnHighlightColor.currentColor = "transparent";
            $(".btn-color-value-line", this.toolbar.btnHighlightColor.cmpEl).css("background-color", "transparent");
        },
        onParagraphColor: function (shd) {
            var picker = this.toolbar.mnuParagraphColorPicker,
            clr;
            if (shd !== null && shd !== undefined && shd.get_Value() === shd_Clear) {
                var color = shd.get_Color();
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
            } else {
                clr = "transparent";
            }
            var type1 = typeof(clr),
            type2 = typeof(this._state.clrback);
            if ((type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrback.effectValue || this._state.clrback.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrback.indexOf(clr) < 0)) {
                if (typeof(clr) == "object") {
                    var isselected = false;
                    for (var i = 0; i < 10; i++) {
                        if (Common.Utils.ThemeColor.ThemeValues[i] == clr.effectValue) {
                            picker.select(clr, true);
                            isselected = true;
                            break;
                        }
                    }
                    if (!isselected) {
                        picker.clearSelection();
                    }
                } else {
                    picker.select(clr, true);
                }
                this._state.clrback = clr;
            }
            this._state.clrshd_asccolor = shd;
        },
        onApiTextColor: function (color) {
            if (color.get_auto()) {
                if (this._state.clrtext !== "auto") {
                    this.toolbar.mnuFontColorPicker.clearSelection();
                    var clr_item = this.toolbar.btnFontColor.menu.$el.find("#id-toolbar-menu-auto-fontcolor > a"); ! clr_item.hasClass("selected") && clr_item.addClass("selected");
                    this._state.clrtext = "auto";
                }
            } else {
                var picker = this.toolbar.mnuFontColorPicker,
                clr;
                if (color) {
                    color.get_type() == c_oAscColor.COLOR_TYPE_SCHEME ? clr = {
                        color: Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b()),
                        effectValue: color.get_value()
                    } : clr = Common.Utils.ThemeColor.getHexColor(color.get_r(), color.get_g(), color.get_b());
                }
                var type1 = typeof(clr),
                type2 = typeof(this._state.clrtext);
                if ((this._state.clrtext == "auto") || (type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrtext.effectValue || this._state.clrtext.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrtext.indexOf(clr) < 0)) {
                    var clr_item = this.toolbar.btnFontColor.menu.$el.find("#id-toolbar-menu-auto-fontcolor > a");
                    clr_item.hasClass("selected") && clr_item.removeClass("selected");
                    if (typeof(clr) == "object") {
                        var isselected = false;
                        for (var i = 0; i < 10; i++) {
                            if (Common.Utils.ThemeColor.ThemeValues[i] == clr.effectValue) {
                                picker.select(clr, true);
                                isselected = true;
                                break;
                            }
                        }
                        if (!isselected) {
                            picker.clearSelection();
                        }
                    } else {
                        picker.select(clr, true);
                    }
                    this._state.clrtext = clr;
                }
            }
            this._state.clrtext_asccolor = color;
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
                        if (me.toolbar.btnInsertEquation.pressed) {
                            me.toolbar.btnInsertEquation.toggle(false, true);
                        }
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar, me.toolbar.btnInsertShape);
                        Common.component.Analytics.trackEvent("ToolBar", "Add Shape");
                    }
                });
            }
        },
        fillEquations: function () {
            var me = this,
            equationsStore = this.getApplication().getCollection("EquationGroups");
            me.equationPickers = [];
            for (var i = 0; i < equationsStore.length; ++i) {
                var equationGroup = equationsStore.at(i);
                var menuItem = new Common.UI.MenuItem({
                    caption: equationGroup.get("groupName"),
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [{
                            template: _.template('<div id="id-toolbar-menu-equationgroup' + i + '" class="menu-shape" style="width:' + (equationGroup.get("groupWidth") + 8) + "px; " + equationGroup.get("groupHeight") + 'margin-left:5px;"></div>')
                        }]
                    })
                });
                me.toolbar.btnInsertEquation.menu.addItem(menuItem);
                var equationPicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-equationgroup" + i),
                    store: equationGroup.get("groupStore"),
                    itemTemplate: _.template('<div class="item-equation" ' + 'style="background-position:<%= posX %>px <%= posY %>px;" >' + '<div style="width:<%= width %>px;height:<%= height %>px;" id="<%= id %>">')
                });
                if (equationGroup.get("groupHeight").length) {
                    me.equationPickers.push(equationPicker);
                    me.toolbar.btnInsertEquation.menu.on("show:after", function () {
                        if (me.equationPickers.length) {
                            var element = $(this.el).find(".over").find(".menu-shape");
                            if (element.length) {
                                for (var i = 0; i < me.equationPickers.length; ++i) {
                                    if (element[0].id == me.equationPickers[i].el.id) {
                                        me.equationPickers[i].scroller.update({
                                            alwaysVisibleY: true
                                        });
                                        me.equationPickers.splice(i, 1);
                                        return;
                                    }
                                }
                            }
                        }
                    });
                }
                equationPicker.on("item:click", function (picker, item, record) {
                    if (me.api) {
                        me.api.asc_AddMath(record.get("data").equationType);
                        me._isAddingEquation = true;
                        if (me.toolbar.btnInsertText.pressed) {
                            me.toolbar.btnInsertText.toggle(false, true);
                        }
                        if (me.toolbar.btnInsertShape.pressed) {
                            me.toolbar.btnInsertShape.toggle(false, true);
                        }
                        if (me.toolbar.btnInsertEquation.pressed) {
                            me.toolbar.btnInsertEquation.toggle(false, true);
                        }
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar, me.toolbar.btnInsertEquation);
                        Common.component.Analytics.trackEvent("ToolBar", "Add Equation");
                    }
                });
            }
        },
        onMathTypes: function (equation) {
            var equationgrouparray = [],
            equationsStore = this.getCollection("EquationGroups");
            equationsStore.reset();
            var c_oAscMathMainTypeStrings = {},
            c_oAscMathMainType = {
                Symbol: 0,
                Fraction: 1,
                Script: 2,
                Radical: 3,
                Integral: 4,
                LargeOperator: 5,
                Bracket: 6,
                Function: 7,
                Accent: 8,
                LimitLog: 9,
                Operator: 10,
                Matrix: 11
            };
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Symbol] = [this.textSymbols, 11];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Fraction] = [this.textFraction, 4];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Script] = [this.textScript, 4];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Radical] = [this.textRadical, 4];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Integral] = [this.textIntegral, 3, true];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.LargeOperator] = [this.textLargeOperator, 5, true];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Bracket] = [this.textBracket, 4, true];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Function] = [this.textFunction, 3, true];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Accent] = [this.textAccent, 4];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.LimitLog] = [this.textLimitAndLog, 3];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Operator] = [this.textOperator, 4];
            c_oAscMathMainTypeStrings[c_oAscMathMainType.Matrix] = [this.textMatrix, 4, true];
            var c_oAscMathType = {
                Symbol_pm: 0,
                Symbol_infinity: 1,
                Symbol_equals: 2,
                Symbol_neq: 3,
                Symbol_about: 4,
                Symbol_times: 5,
                Symbol_div: 6,
                Symbol_factorial: 7,
                Symbol_propto: 8,
                Symbol_less: 9,
                Symbol_ll: 10,
                Symbol_greater: 11,
                Symbol_gg: 12,
                Symbol_leq: 13,
                Symbol_geq: 14,
                Symbol_mp: 15,
                Symbol_cong: 16,
                Symbol_approx: 17,
                Symbol_equiv: 18,
                Symbol_forall: 19,
                Symbol_additional: 20,
                Symbol_partial: 21,
                Symbol_sqrt: 22,
                Symbol_cbrt: 23,
                Symbol_qdrt: 24,
                Symbol_cup: 25,
                Symbol_cap: 26,
                Symbol_emptyset: 27,
                Symbol_percent: 28,
                Symbol_degree: 29,
                Symbol_fahrenheit: 30,
                Symbol_celsius: 31,
                Symbol_inc: 32,
                Symbol_nabla: 33,
                Symbol_exists: 34,
                Symbol_notexists: 35,
                Symbol_in: 36,
                Symbol_ni: 37,
                Symbol_leftarrow: 38,
                Symbol_uparrow: 39,
                Symbol_rightarrow: 40,
                Symbol_downarrow: 41,
                Symbol_leftrightarrow: 42,
                Symbol_therefore: 43,
                Symbol_plus: 44,
                Symbol_minus: 45,
                Symbol_not: 46,
                Symbol_ast: 47,
                Symbol_bullet: 48,
                Symbol_vdots: 49,
                Symbol_cdots: 50,
                Symbol_rddots: 51,
                Symbol_ddots: 52,
                Symbol_aleph: 53,
                Symbol_beth: 54,
                Symbol_QED: 55,
                Symbol_alpha: 65536,
                Symbol_beta: 65537,
                Symbol_gamma: 65538,
                Symbol_delta: 65539,
                Symbol_varepsilon: 65540,
                Symbol_epsilon: 65541,
                Symbol_zeta: 65542,
                Symbol_eta: 65543,
                Symbol_theta: 65544,
                Symbol_vartheta: 65545,
                Symbol_iota: 65546,
                Symbol_kappa: 65547,
                Symbol_lambda: 65548,
                Symbol_mu: 65549,
                Symbol_nu: 65550,
                Symbol_xsi: 65551,
                Symbol_o: 65552,
                Symbol_pi: 65553,
                Symbol_varpi: 65554,
                Symbol_rho: 65555,
                Symbol_varrho: 65556,
                Symbol_sigma: 65557,
                Symbol_varsigma: 65558,
                Symbol_tau: 65559,
                Symbol_upsilon: 65560,
                Symbol_varphi: 65561,
                Symbol_phi: 65562,
                Symbol_chi: 65563,
                Symbol_psi: 65564,
                Symbol_omega: 65565,
                Symbol_Alpha: 131072,
                Symbol_Beta: 131073,
                Symbol_Gamma: 131074,
                Symbol_Delta: 131075,
                Symbol_Epsilon: 131076,
                Symbol_Zeta: 131077,
                Symbol_Eta: 131078,
                Symbol_Theta: 131079,
                Symbol_Iota: 131080,
                Symbol_Kappa: 131081,
                Symbol_Lambda: 131082,
                Symbol_Mu: 131083,
                Symbol_Nu: 131084,
                Symbol_Xsi: 131085,
                Symbol_O: 131086,
                Symbol_Pi: 131087,
                Symbol_Rho: 131088,
                Symbol_Sigma: 131089,
                Symbol_Tau: 131090,
                Symbol_Upsilon: 131091,
                Symbol_Phi: 131092,
                Symbol_Chi: 131093,
                Symbol_Psi: 131094,
                Symbol_Omega: 131095,
                FractionVertical: 16777216,
                FractionDiagonal: 16777217,
                FractionHorizontal: 16777218,
                FractionSmall: 16777219,
                FractionDifferential_1: 16842752,
                FractionDifferential_2: 16842753,
                FractionDifferential_3: 16842754,
                FractionDifferential_4: 16842755,
                FractionPi_2: 16842756,
                ScriptSup: 33554432,
                ScriptSub: 33554433,
                ScriptSubSup: 33554434,
                ScriptSubSupLeft: 33554435,
                ScriptCustom_1: 33619968,
                ScriptCustom_2: 33619969,
                ScriptCustom_3: 33619970,
                ScriptCustom_4: 33619971,
                RadicalSqrt: 50331648,
                RadicalRoot_n: 50331649,
                RadicalRoot_2: 50331650,
                RadicalRoot_3: 50331651,
                RadicalCustom_1: 50397184,
                RadicalCustom_2: 50397185,
                Integral: 67108864,
                IntegralSubSup: 67108865,
                IntegralCenterSubSup: 67108866,
                IntegralDouble: 67108867,
                IntegralDoubleSubSup: 67108868,
                IntegralDoubleCenterSubSup: 67108869,
                IntegralTriple: 67108870,
                IntegralTripleSubSup: 67108871,
                IntegralTripleCenterSubSup: 67108872,
                IntegralOriented: 67174400,
                IntegralOrientedSubSup: 67174401,
                IntegralOrientedCenterSubSup: 67174402,
                IntegralOrientedDouble: 67174403,
                IntegralOrientedDoubleSubSup: 67174404,
                IntegralOrientedDoubleCenterSubSup: 67174405,
                IntegralOrientedTriple: 67174406,
                IntegralOrientedTripleSubSup: 67174407,
                IntegralOrientedTripleCenterSubSup: 67174408,
                Integral_dx: 67239936,
                Integral_dy: 67239937,
                Integral_dtheta: 67239938,
                LargeOperator_Sum: 83886080,
                LargeOperator_Sum_CenterSubSup: 83886081,
                LargeOperator_Sum_SubSup: 83886082,
                LargeOperator_Sum_CenterSub: 83886083,
                LargeOperator_Sum_Sub: 83886084,
                LargeOperator_Prod: 83951616,
                LargeOperator_Prod_CenterSubSup: 83951617,
                LargeOperator_Prod_SubSup: 83951618,
                LargeOperator_Prod_CenterSub: 83951619,
                LargeOperator_Prod_Sub: 83951620,
                LargeOperator_CoProd: 83951621,
                LargeOperator_CoProd_CenterSubSup: 83951622,
                LargeOperator_CoProd_SubSup: 83951623,
                LargeOperator_CoProd_CenterSub: 83951624,
                LargeOperator_CoProd_Sub: 83951625,
                LargeOperator_Union: 84017152,
                LargeOperator_Union_CenterSubSup: 84017153,
                LargeOperator_Union_SubSup: 84017154,
                LargeOperator_Union_CenterSub: 84017155,
                LargeOperator_Union_Sub: 84017156,
                LargeOperator_Intersection: 84017157,
                LargeOperator_Intersection_CenterSubSup: 84017158,
                LargeOperator_Intersection_SubSup: 84017159,
                LargeOperator_Intersection_CenterSub: 84017160,
                LargeOperator_Intersection_Sub: 84017161,
                LargeOperator_Disjunction: 84082688,
                LargeOperator_Disjunction_CenterSubSup: 84082689,
                LargeOperator_Disjunction_SubSup: 84082690,
                LargeOperator_Disjunction_CenterSub: 84082691,
                LargeOperator_Disjunction_Sub: 84082692,
                LargeOperator_Conjunction: 84082693,
                LargeOperator_Conjunction_CenterSubSup: 84082694,
                LargeOperator_Conjunction_SubSup: 84082695,
                LargeOperator_Conjunction_CenterSub: 84082696,
                LargeOperator_Conjunction_Sub: 84082697,
                LargeOperator_Custom_1: 84148224,
                LargeOperator_Custom_2: 84148225,
                LargeOperator_Custom_3: 84148226,
                LargeOperator_Custom_4: 84148227,
                LargeOperator_Custom_5: 84148228,
                Bracket_Round: 100663296,
                Bracket_Square: 100663297,
                Bracket_Curve: 100663298,
                Bracket_Angle: 100663299,
                Bracket_LowLim: 100663300,
                Bracket_UppLim: 100663301,
                Bracket_Line: 100663302,
                Bracket_LineDouble: 100663303,
                Bracket_Square_OpenOpen: 100663304,
                Bracket_Square_CloseClose: 100663305,
                Bracket_Square_CloseOpen: 100663306,
                Bracket_SquareDouble: 100663307,
                Bracket_Round_Delimiter_2: 100728832,
                Bracket_Curve_Delimiter_2: 100728833,
                Bracket_Angle_Delimiter_2: 100728834,
                Bracket_Angle_Delimiter_3: 100728835,
                Bracket_Round_OpenNone: 100794368,
                Bracket_Round_NoneOpen: 100794369,
                Bracket_Square_OpenNone: 100794370,
                Bracket_Square_NoneOpen: 100794371,
                Bracket_Curve_OpenNone: 100794372,
                Bracket_Curve_NoneOpen: 100794373,
                Bracket_Angle_OpenNone: 100794374,
                Bracket_Angle_NoneOpen: 100794375,
                Bracket_LowLim_OpenNone: 100794376,
                Bracket_LowLim_NoneNone: 100794377,
                Bracket_UppLim_OpenNone: 100794378,
                Bracket_UppLim_NoneOpen: 100794379,
                Bracket_Line_OpenNone: 100794380,
                Bracket_Line_NoneOpen: 100794381,
                Bracket_LineDouble_OpenNone: 100794382,
                Bracket_LineDouble_NoneOpen: 100794383,
                Bracket_SquareDouble_OpenNone: 100794384,
                Bracket_SquareDouble_NoneOpen: 100794385,
                Bracket_Custom_1: 100859904,
                Bracket_Custom_2: 100859905,
                Bracket_Custom_3: 100859906,
                Bracket_Custom_4: 100859907,
                Bracket_Custom_5: 100925440,
                Bracket_Custom_6: 100925441,
                Bracket_Custom_7: 100925442,
                Function_Sin: 117440512,
                Function_Cos: 117440513,
                Function_Tan: 117440514,
                Function_Csc: 117440515,
                Function_Sec: 117440516,
                Function_Cot: 117440517,
                Function_1_Sin: 117506048,
                Function_1_Cos: 117506049,
                Function_1_Tan: 117506050,
                Function_1_Csc: 117506051,
                Function_1_Sec: 117506052,
                Function_1_Cot: 117506053,
                Function_Sinh: 117571584,
                Function_Cosh: 117571585,
                Function_Tanh: 117571586,
                Function_Csch: 117571587,
                Function_Sech: 117571588,
                Function_Coth: 117571589,
                Function_1_Sinh: 117637120,
                Function_1_Cosh: 117637121,
                Function_1_Tanh: 117637122,
                Function_1_Csch: 117637123,
                Function_1_Sech: 117637124,
                Function_1_Coth: 117637125,
                Function_Custom_1: 117702656,
                Function_Custom_2: 117702657,
                Function_Custom_3: 117702658,
                Accent_Dot: 134217728,
                Accent_DDot: 134217729,
                Accent_DDDot: 134217730,
                Accent_Hat: 134217731,
                Accent_Check: 134217732,
                Accent_Accent: 134217733,
                Accent_Grave: 134217734,
                Accent_Smile: 134217735,
                Accent_Tilde: 134217736,
                Accent_Bar: 134217737,
                Accent_DoubleBar: 134217738,
                Accent_CurveBracketTop: 134217739,
                Accent_CurveBracketBot: 134217740,
                Accent_GroupTop: 134217741,
                Accent_GroupBot: 134217742,
                Accent_ArrowL: 134217743,
                Accent_ArrowR: 134217744,
                Accent_ArrowD: 134217745,
                Accent_HarpoonL: 134217746,
                Accent_HarpoonR: 134217747,
                Accent_BorderBox: 134283264,
                Accent_BorderBoxCustom: 134283265,
                Accent_BarTop: 134348800,
                Accent_BarBot: 134348801,
                Accent_Custom_1: 134414336,
                Accent_Custom_2: 134414337,
                Accent_Custom_3: 134414338,
                LimitLog_LogBase: 150994944,
                LimitLog_Log: 150994945,
                LimitLog_Lim: 150994946,
                LimitLog_Min: 150994947,
                LimitLog_Max: 150994948,
                LimitLog_Ln: 150994949,
                LimitLog_Custom_1: 151060480,
                LimitLog_Custom_2: 151060481,
                Operator_ColonEquals: 167772160,
                Operator_EqualsEquals: 167772161,
                Operator_PlusEquals: 167772162,
                Operator_MinusEquals: 167772163,
                Operator_Definition: 167772164,
                Operator_UnitOfMeasure: 167772165,
                Operator_DeltaEquals: 167772166,
                Operator_ArrowL_Top: 167837696,
                Operator_ArrowR_Top: 167837697,
                Operator_ArrowL_Bot: 167837698,
                Operator_ArrowR_Bot: 167837699,
                Operator_DoubleArrowL_Top: 167837700,
                Operator_DoubleArrowR_Top: 167837701,
                Operator_DoubleArrowL_Bot: 167837702,
                Operator_DoubleArrowR_Bot: 167837703,
                Operator_ArrowD_Top: 167837704,
                Operator_ArrowD_Bot: 167837705,
                Operator_DoubleArrowD_Top: 167837706,
                Operator_DoubleArrowD_Bot: 167837707,
                Operator_Custom_1: 167903232,
                Operator_Custom_2: 167903233,
                Matrix_1_2: 184549376,
                Matrix_2_1: 184549377,
                Matrix_1_3: 184549378,
                Matrix_3_1: 184549379,
                Matrix_2_2: 184549380,
                Matrix_2_3: 184549381,
                Matrix_3_2: 184549382,
                Matrix_3_3: 184549383,
                Matrix_Dots_Center: 184614912,
                Matrix_Dots_Baseline: 184614913,
                Matrix_Dots_Vertical: 184614914,
                Matrix_Dots_Diagonal: 184614915,
                Matrix_Identity_2: 184680448,
                Matrix_Identity_2_NoZeros: 184680449,
                Matrix_Identity_3: 184680450,
                Matrix_Identity_3_NoZeros: 184680451,
                Matrix_2_2_RoundBracket: 184745984,
                Matrix_2_2_SquareBracket: 184745985,
                Matrix_2_2_LineBracket: 184745986,
                Matrix_2_2_DLineBracket: 184745987,
                Matrix_Flat_Round: 184811520,
                Matrix_Flat_Square: 184811521
            };
            var translationTable = {},
            name = "",
            translate = "";
            for (name in c_oAscMathType) {
                if (c_oAscMathType.hasOwnProperty(name)) {
                    translate = "txt" + name;
                    translationTable[c_oAscMathType[name]] = this[translate];
                }
            }
            var i, id = 0,
            count = 0,
            length = 0,
            width = 0,
            height = 0,
            store = null,
            list = null,
            eqStore = null,
            eq = null;
            if (equation) {
                count = equation.get_Data().length;
                if (count) {
                    for (var j = 0; j < count; ++j) {
                        id = equation.get_Data()[j].get_Id();
                        width = equation.get_Data()[j].get_W();
                        height = equation.get_Data()[j].get_H();
                        store = new Backbone.Collection([], {
                            model: DE.Models.EquationModel
                        });
                        if (store) {
                            var allItemsCount = 0,
                            itemsCount = 0,
                            ids = 0;
                            length = equation.get_Data()[j].get_Data().length;
                            for (i = 0; i < length; ++i) {
                                eqStore = equation.get_Data()[j].get_Data()[i];
                                itemsCount = eqStore.get_Data().length;
                                for (var p = 0; p < itemsCount; ++p) {
                                    eq = eqStore.get_Data()[p];
                                    ids = eq.get_Id();
                                    translate = "";
                                    if (translationTable.hasOwnProperty(ids)) {
                                        translate = translationTable[ids];
                                    }
                                    store.add({
                                        data: {
                                            equationType: ids
                                        },
                                        tip: translate,
                                        allowSelected: false,
                                        selected: false,
                                        width: eqStore.get_W(),
                                        height: eqStore.get_H(),
                                        posX: -eq.get_X(),
                                        posY: -eq.get_Y()
                                    });
                                }
                                allItemsCount += itemsCount;
                            }
                            width = c_oAscMathMainTypeStrings[id][1] * (width + 10);
                            var normHeight = parseInt(370 / (height + 10)) * (height + 10);
                            equationgrouparray.push({
                                groupName: c_oAscMathMainTypeStrings[id][0],
                                groupStore: store,
                                groupWidth: width,
                                groupHeight: c_oAscMathMainTypeStrings[id][2] ? " height:" + normHeight + "px!important; ": ""
                            });
                        }
                    }
                    equationsStore.add(equationgrouparray);
                    this.fillEquations();
                }
            }
        },
        activateControls: function () {
            _.each(this.toolbar.toolbarControls, function (item) {
                item.setDisabled(false);
            },
            this);
            this.toolbar.btnUndo.setDisabled(this._state.can_undo !== true);
            this.toolbar.btnRedo.setDisabled(this._state.can_redo !== true);
            this.toolbar.btnCopy.setDisabled(this._state.can_copycut !== true);
            this._state.activated = true;
        },
        updateThemeColors: function () {
            var updateColors = function (picker, defaultColorIndex) {
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
                        picker.currentColor = effectcolors[defaultColorIndex];
                    } else {
                        if (clr !== undefined) {
                            picker.currentColor = clr;
                        }
                    }
                }
            };
            updateColors(this.toolbar.mnuFontColorPicker, 1);
            if (this.toolbar.btnFontColor.currentColor === undefined || !this.toolbar.btnFontColor.currentColor.isAuto) {
                this.toolbar.btnFontColor.currentColor = this.toolbar.mnuFontColorPicker.currentColor.color || this.toolbar.mnuFontColorPicker.currentColor;
                $(".btn-color-value-line", this.toolbar.btnFontColor.cmpEl).css("background-color", "#" + this.toolbar.btnFontColor.currentColor);
            }
            if (this._state.clrtext_asccolor !== undefined) {
                this._state.clrtext = undefined;
                this.onApiTextColor(this._state.clrtext_asccolor);
            }
            this._state.clrtext_asccolor = undefined;
            updateColors(this.toolbar.mnuParagraphColorPicker, 0);
            this.toolbar.btnParagraphColor.currentColor = this.toolbar.mnuParagraphColorPicker.currentColor.color || this.toolbar.mnuParagraphColorPicker.currentColor;
            $(".btn-color-value-line", this.toolbar.btnParagraphColor.cmpEl).css("background-color", "#" + this.toolbar.btnParagraphColor.currentColor);
            if (this._state.clrshd_asccolor !== undefined) {
                this._state.clrback = undefined;
                this.onParagraphColor(this._state.clrshd_asccolor);
            }
            this._state.clrshd_asccolor = undefined;
        },
        _clearChecked: function (menu) {
            _.each(menu.items, function (item) {
                if (item.setChecked) {
                    item.setChecked(false, true);
                }
            });
        },
        _onInitEditorStyles: function (styles) {
            window.styles_loaded = false;
            var self = this,
            listStyles = self.toolbar.listStyles;
            if (!listStyles) {
                self.styles = styles;
                return;
            }
            var canvasDefaultStyles = document.createElement("canvas");
            var canvasDocStyles = document.createElement("canvas");
            canvasDefaultStyles.id = "bigimgdefaultstyles";
            canvasDocStyles.id = "bigimgdocstyles";
            var isDefaultStylesLoad = !(styles.get_DefaultStylesImage().length > 0);
            var isDocStylesLoad = !(styles.get_DocStylesImage().length > 0);
            var fillStyles = function () {
                if (isDefaultStylesLoad && isDocStylesLoad) {
                    listStyles.menuPicker.store.reset([]);
                    var thumbWidth = styles.get_STYLE_THUMBNAIL_WIDTH(),
                    thumbHeight = styles.get_STYLE_THUMBNAIL_HEIGHT();
                    _.each(styles.get_MergedStyles(), function (style) {
                        var thumb = document.createElement("canvas");
                        thumb.width = thumbWidth;
                        thumb.height = thumbHeight;
                        var ctx = thumb.getContext("2d");
                        ctx.save();
                        ctx.translate(0, -style.get_ThumbnailOffset() * thumbHeight);
                        ctx.drawImage(((style.get_Type() == c_oAscStyleImage.Default) ? canvasDefaultStyles : canvasDocStyles), 0, 0);
                        ctx.restore();
                        listStyles.menuPicker.store.add({
                            imageUrl: thumb.toDataURL(),
                            title: style.get_Name(),
                            tip: style.get_Name(),
                            id: Common.UI.getId()
                        });
                    });
                    if (listStyles.menuPicker.store.length > 0 && listStyles.rendered) {
                        listStyles.fillComboView(listStyles.menuPicker.store.at(0), true);
                        Common.NotificationCenter.trigger("edit:complete", this);
                    }
                }
                window.styles_loaded = true;
            };
            var imgDefaultStyles = new Image();
            var imgDocStyles = new Image();
            imgDefaultStyles.onload = function () {
                canvasDefaultStyles.width = imgDefaultStyles.width;
                canvasDefaultStyles.height = imgDefaultStyles.height;
                canvasDefaultStyles.getContext("2d").drawImage(imgDefaultStyles, 0, 0);
                isDefaultStylesLoad = true;
                fillStyles();
            };
            imgDocStyles.onload = function () {
                canvasDocStyles.width = imgDocStyles.width;
                canvasDocStyles.height = imgDocStyles.height;
                canvasDocStyles.getContext("2d").drawImage(imgDocStyles, 0, 0);
                isDocStylesLoad = true;
                fillStyles();
            };
            imgDefaultStyles.src = styles.get_DefaultStylesImage();
            imgDocStyles.src = styles.get_DocStylesImage();
        },
        _setMarkerColor: function (strcolor, h) {
            var me = this;
            if (h === "menu") {
                me.toolbar.mnuHighlightTransparent.setChecked(false);
                me.toolbar.btnHighlightColor.currentColor = strcolor;
                $(".btn-color-value-line", me.toolbar.btnHighlightColor.cmpEl).css("background-color", "#" + strcolor);
                me.toolbar.btnHighlightColor.toggle(true, true);
                me.toolbar.btnHighlightColor.cmpEl.removeClass("open");
            }
            strcolor = strcolor || "transparent";
            if (strcolor == "transparent") {
                me.api.SetMarkerFormat(true, false);
            } else {
                var r = strcolor[0] + strcolor[1],
                g = strcolor[2] + strcolor[3],
                b = strcolor[4] + strcolor[5];
                me.api.SetMarkerFormat(true, true, parseInt(r, 16), parseInt(g, 16), parseInt(b, 16));
            }
            Common.NotificationCenter.trigger("edit:complete", me.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Highlight Color");
        },
        onHideMenus: function (e) {
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
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
                        me.api.SetPaintFormat(acsCopyFmtStyleState.kOff);
                        me.toolbar.btnCopyStyle.toggle(false, true);
                        me.modeAlwaysSetStyle = false;
                    }
                }
            });
            $(me.toolbar.btnCopyStyle.cmpEl).dblclick(function () {
                if (me.api) {
                    me.modeAlwaysSetStyle = true;
                    me.toolbar.btnCopyStyle.toggle(true, true);
                    me.api.SetPaintFormat(acsCopyFmtStyleState.kMultiple);
                }
            });
        },
        onApiCoAuthoringDisconnect: function () {
            this.toolbar.setMode({
                isDisconnected: true
            });
            this.editMode = false;
        },
        DisableToolbar: function (disable) {
            var mask = $(".toolbar-mask");
            if (disable && mask.length > 0 || !disable && mask.length == 0) {
                return;
            }
            var toolbar = this.toolbar;
            toolbar.$el.find(".toolbar").toggleClass("masked", disable);
            toolbar.btnHide.setDisabled(disable);
            if (disable) {
                mask = $("<div class='toolbar-mask'>").appendTo(toolbar.$el);
                var left = toolbar.isCompactView ? 75 : (toolbar.mode.nativeApp ? 80 : 48);
                mask.css("left", left + "px");
                mask.css("right", (toolbar.isCompactView ? 0 : 45) + "px");
                Common.util.Shortcuts.suspendEvents("command+alt+h, ctrl+alt+h");
            } else {
                mask.remove();
                Common.util.Shortcuts.resumeEvents("command+alt+h, ctrl+alt+h");
            }
        },
        textEmptyImgUrl: "You need to specify image URL.",
        textWarning: "Warning",
        textFontSizeErr: "The entered value must be more than 0",
        textSymbols: "Symbols",
        textFraction: "Fraction",
        textScript: "Script",
        textRadical: "Radical",
        textIntegral: "Integral",
        textLargeOperator: "Large Operator",
        textBracket: "Bracket",
        textFunction: "Function",
        textAccent: "Accent",
        textLimitAndLog: "Limit And Log",
        textOperator: "Operator",
        textMatrix: "Matrix",
        txtSymbol_pm: "Plus Minus",
        txtSymbol_infinity: "Infinity",
        txtSymbol_equals: "Equal",
        txtSymbol_neq: "Not Equal To",
        txtSymbol_about: "Approximately",
        txtSymbol_times: "Multiplication Sign",
        txtSymbol_div: "Division Sign",
        txtSymbol_factorial: "Factorial",
        txtSymbol_propto: "Proportional To",
        txtSymbol_less: "Less Than",
        txtSymbol_ll: "Much Less Than",
        txtSymbol_greater: "Greater Than",
        txtSymbol_gg: "Much Greater Than",
        txtSymbol_leq: "Less Than or Equal To",
        txtSymbol_geq: "Greater Than or Equal To",
        txtSymbol_mp: "Minus Plus",
        txtSymbol_cong: "Approximately Equal To",
        txtSymbol_approx: "Almost Equal To",
        txtSymbol_equiv: "Identical To",
        txtSymbol_forall: "For All",
        txtSymbol_additional: "Complement",
        txtSymbol_partial: "Partial Differential",
        txtSymbol_sqrt: "Radical Sign",
        txtSymbol_cbrt: "Cube Root",
        txtSymbol_qdrt: "Fourth Root",
        txtSymbol_cup: "Union",
        txtSymbol_cap: "Intersection",
        txtSymbol_emptyset: "Empty Set",
        txtSymbol_percent: "Percentage",
        txtSymbol_degree: "Degrees",
        txtSymbol_fahrenheit: "Degrees Fahrenheit",
        txtSymbol_celsius: "Degrees Celsius",
        txtSymbol_inc: "Increment",
        txtSymbol_nabla: "Nabla",
        txtSymbol_exists: "There Exist",
        txtSymbol_notexists: "There Does Not Exist",
        txtSymbol_in: "Element Of",
        txtSymbol_ni: "Contains as Member",
        txtSymbol_leftarrow: "Left Arrow",
        txtSymbol_uparrow: "Up Arrow",
        txtSymbol_rightarrow: "Right Arrow",
        txtSymbol_downarrow: "Down Arrow",
        txtSymbol_leftrightarrow: "Left-Right Arrow",
        txtSymbol_therefore: "Therefore",
        txtSymbol_plus: "Plus",
        txtSymbol_minus: "Minus",
        txtSymbol_not: "Not Sign",
        txtSymbol_ast: "Asterisk Operator",
        txtSymbol_bullet: "Bulet Operator",
        txtSymbol_vdots: "Vertical Ellipsis",
        txtSymbol_cdots: "Midline Horizontal Ellipsis",
        txtSymbol_rddots: "Up Right Diagonal Ellipsis",
        txtSymbol_ddots: "Down Right Diagonal Ellipsis",
        txtSymbol_aleph: "Alef",
        txtSymbol_beth: "Bet",
        txtSymbol_QED: "End of Proof",
        txtSymbol_alpha: "Alpha",
        txtSymbol_beta: "Beta",
        txtSymbol_gamma: "Gamma",
        txtSymbol_delta: "Delta",
        txtSymbol_varepsilon: "Epsilon Variant",
        txtSymbol_epsilon: "Epsilon",
        txtSymbol_zeta: "Zeta",
        txtSymbol_eta: "Eta",
        txtSymbol_theta: "Theta",
        txtSymbol_vartheta: "Theta Variant",
        txtSymbol_iota: "Iota",
        txtSymbol_kappa: "Kappa",
        txtSymbol_lambda: "Lambda",
        txtSymbol_mu: "Mu",
        txtSymbol_nu: "Nu",
        txtSymbol_xsi: "Xsi",
        txtSymbol_o: "Omicron",
        txtSymbol_pi: "Pi",
        txtSymbol_varpi: "Pi Variant",
        txtSymbol_rho: "Rho",
        txtSymbol_varrho: "Rho Variant",
        txtSymbol_sigma: "Sigma",
        txtSymbol_varsigma: "Sigma Variant",
        txtSymbol_tau: "Tau",
        txtSymbol_upsilon: "Upsilon",
        txtSymbol_varphi: "Phi Variant",
        txtSymbol_phi: "Phi",
        txtSymbol_chi: "Chi",
        txtSymbol_psi: "Psi",
        txtSymbol_omega: "Omega",
        txtSymbol_Alpha: "Alpha",
        txtSymbol_Beta: "Beta",
        txtSymbol_Gamma: "Gamma",
        txtSymbol_Delta: "Delta",
        txtSymbol_Epsilon: "Epsilon",
        txtSymbol_Zeta: "Zeta",
        txtSymbol_Eta: "Eta",
        txtSymbol_Theta: "Theta",
        txtSymbol_Iota: "Iota",
        txtSymbol_Kappa: "Kappa",
        txtSymbol_Lambda: "Lambda",
        txtSymbol_Mu: "Mu",
        txtSymbol_Nu: "Nu",
        txtSymbol_Xsi: "Xi",
        txtSymbol_O: "Omicron",
        txtSymbol_Pi: "Pi",
        txtSymbol_Rho: "Rho",
        txtSymbol_Sigma: "Sigma",
        txtSymbol_Tau: "Tau",
        txtSymbol_Upsilon: "Upsilon",
        txtSymbol_Phi: "Phi",
        txtSymbol_Chi: "Chi",
        txtSymbol_Psi: "Psi",
        txtSymbol_Omega: "Omega",
        txtFractionVertical: "Stacked Fraction",
        txtFractionDiagonal: "Skewed Fraction",
        txtFractionHorizontal: "Linear Fraction",
        txtFractionSmall: "Small Fraction",
        txtFractionDifferential_1: "Differential",
        txtFractionDifferential_2: "Differential",
        txtFractionDifferential_3: "Differential",
        txtFractionDifferential_4: "Differential",
        txtFractionPi_2: "Pi Over 2",
        txtScriptSup: "Superscript",
        txtScriptSub: "Subscript",
        txtScriptSubSup: "Subscript-Superscript",
        txtScriptSubSupLeft: "Left Subscript-Superscript",
        txtScriptCustom_1: "Script",
        txtScriptCustom_2: "Script",
        txtScriptCustom_3: "Script",
        txtScriptCustom_4: "Script",
        txtRadicalSqrt: "Square Root",
        txtRadicalRoot_n: "Radical With Degree",
        txtRadicalRoot_2: "Square Root With Degree",
        txtRadicalRoot_3: "Cubic Root",
        txtRadicalCustom_1: "Radical",
        txtRadicalCustom_2: "Radical",
        txtIntegral: "Integral",
        txtIntegralSubSup: "Integral",
        txtIntegralCenterSubSup: "Integral",
        txtIntegralDouble: "Double Integral",
        txtIntegralDoubleSubSup: "Double Integral",
        txtIntegralDoubleCenterSubSup: "Double Integral",
        txtIntegralTriple: "Triple Integral",
        txtIntegralTripleSubSup: "Triple Integral",
        txtIntegralTripleCenterSubSup: "Triple Integral",
        txtIntegralOriented: "Contour Integral",
        txtIntegralOrientedSubSup: "Contour Integral",
        txtIntegralOrientedCenterSubSup: "Contour Integral",
        txtIntegralOrientedDouble: "Surface Integral",
        txtIntegralOrientedDoubleSubSup: "Surface Integral",
        txtIntegralOrientedDoubleCenterSubSup: "Surface Integral",
        txtIntegralOrientedTriple: "Volume Integral",
        txtIntegralOrientedTripleSubSup: "Volume Integral",
        txtIntegralOrientedTripleCenterSubSup: "Volume Integral",
        txtIntegral_dx: "Differential x",
        txtIntegral_dy: "Differential y",
        txtIntegral_dtheta: "Differential theta",
        txtLargeOperator_Sum: "Summation",
        txtLargeOperator_Sum_CenterSubSup: "Summation",
        txtLargeOperator_Sum_SubSup: "Summation",
        txtLargeOperator_Sum_CenterSub: "Summation",
        txtLargeOperator_Sum_Sub: "Summation",
        txtLargeOperator_Prod: "Product",
        txtLargeOperator_Prod_CenterSubSup: "Product",
        txtLargeOperator_Prod_SubSup: "Product",
        txtLargeOperator_Prod_CenterSub: "Product",
        txtLargeOperator_Prod_Sub: "Product",
        txtLargeOperator_CoProd: "Co-Product",
        txtLargeOperator_CoProd_CenterSubSup: "Co-Product",
        txtLargeOperator_CoProd_SubSup: "Co-Product",
        txtLargeOperator_CoProd_CenterSub: "Co-Product",
        txtLargeOperator_CoProd_Sub: "Co-Product",
        txtLargeOperator_Union: "Union",
        txtLargeOperator_Union_CenterSubSup: "Union",
        txtLargeOperator_Union_SubSup: "Union",
        txtLargeOperator_Union_CenterSub: "Union",
        txtLargeOperator_Union_Sub: "Union",
        txtLargeOperator_Intersection: "Intersection",
        txtLargeOperator_Intersection_CenterSubSup: "Intersection",
        txtLargeOperator_Intersection_SubSup: "Intersection",
        txtLargeOperator_Intersection_CenterSub: "Intersection",
        txtLargeOperator_Intersection_Sub: "Intersection",
        txtLargeOperator_Disjunction: "Vee",
        txtLargeOperator_Disjunction_CenterSubSup: "Vee",
        txtLargeOperator_Disjunction_SubSup: "Vee",
        txtLargeOperator_Disjunction_CenterSub: "Vee",
        txtLargeOperator_Disjunction_Sub: "Vee",
        txtLargeOperator_Conjunction: "Wedge",
        txtLargeOperator_Conjunction_CenterSubSup: "Wedge",
        txtLargeOperator_Conjunction_SubSup: "Wedge",
        txtLargeOperator_Conjunction_CenterSub: "Wedge",
        txtLargeOperator_Conjunction_Sub: "Wedge",
        txtLargeOperator_Custom_1: "Summation",
        txtLargeOperator_Custom_2: "Summation",
        txtLargeOperator_Custom_3: "Summation",
        txtLargeOperator_Custom_4: "Product",
        txtLargeOperator_Custom_5: "Union",
        txtBracket_Round: "Brackets",
        txtBracket_Square: "Brackets",
        txtBracket_Curve: "Brackets",
        txtBracket_Angle: "Brackets",
        txtBracket_LowLim: "Brackets",
        txtBracket_UppLim: "Brackets",
        txtBracket_Line: "Brackets",
        txtBracket_LineDouble: "Brackets",
        txtBracket_Square_OpenOpen: "Brackets",
        txtBracket_Square_CloseClose: "Brackets",
        txtBracket_Square_CloseOpen: "Brackets",
        txtBracket_SquareDouble: "Brackets",
        txtBracket_Round_Delimiter_2: "Brackets with Separators",
        txtBracket_Curve_Delimiter_2: "Brackets with Separators",
        txtBracket_Angle_Delimiter_2: "Brackets with Separators",
        txtBracket_Angle_Delimiter_3: "Brackets with Separators",
        txtBracket_Round_OpenNone: "Single Bracket",
        txtBracket_Round_NoneOpen: "Single Bracket",
        txtBracket_Square_OpenNone: "Single Bracket",
        txtBracket_Square_NoneOpen: "Single Bracket",
        txtBracket_Curve_OpenNone: "Single Bracket",
        txtBracket_Curve_NoneOpen: "Single Bracket",
        txtBracket_Angle_OpenNone: "Single Bracket",
        txtBracket_Angle_NoneOpen: "Single Bracket",
        txtBracket_LowLim_OpenNone: "Single Bracket",
        txtBracket_LowLim_NoneNone: "Single Bracket",
        txtBracket_UppLim_OpenNone: "Single Bracket",
        txtBracket_UppLim_NoneOpen: "Single Bracket",
        txtBracket_Line_OpenNone: "Single Bracket",
        txtBracket_Line_NoneOpen: "Single Bracket",
        txtBracket_LineDouble_OpenNone: "Single Bracket",
        txtBracket_LineDouble_NoneOpen: "Single Bracket",
        txtBracket_SquareDouble_OpenNone: "Single Bracket",
        txtBracket_SquareDouble_NoneOpen: "Single Bracket",
        txtBracket_Custom_1: "Case (Two Conditions)",
        txtBracket_Custom_2: "Cases (Three Conditions)",
        txtBracket_Custom_3: "Stack Object",
        txtBracket_Custom_4: "Stack Object",
        txtBracket_Custom_5: "Cases Example",
        txtBracket_Custom_6: "Binomial Coefficient",
        txtBracket_Custom_7: "Binomial Coefficient",
        txtFunction_Sin: "Sine Function",
        txtFunction_Cos: "Cosine Function",
        txtFunction_Tan: "Tangent Function",
        txtFunction_Csc: "Cosecant Function",
        txtFunction_Sec: "Secant Function",
        txtFunction_Cot: "Cotangent Function",
        txtFunction_1_Sin: "Inverse Sine Function",
        txtFunction_1_Cos: "Inverse Cosine Function",
        txtFunction_1_Tan: "Inverse Tangent Function",
        txtFunction_1_Csc: "Inverse Cosecant Function",
        txtFunction_1_Sec: "Inverse Secant Function",
        txtFunction_1_Cot: "Inverse Cotangent Function",
        txtFunction_Sinh: "Hyperbolic Sine Function",
        txtFunction_Cosh: "Hyperbolic Cosine Function",
        txtFunction_Tanh: "Hyperbolic Tangent Function",
        txtFunction_Csch: "Hyperbolic Cosecant Function",
        txtFunction_Sech: "Hyperbolic Secant Function",
        txtFunction_Coth: "Hyperbolic Cotangent Function",
        txtFunction_1_Sinh: "Hyperbolic Inverse Sine Function",
        txtFunction_1_Cosh: "Hyperbolic Inverse Cosine Function",
        txtFunction_1_Tanh: "Hyperbolic Inverse Tangent Function",
        txtFunction_1_Csch: "Hyperbolic Inverse Cosecant Function",
        txtFunction_1_Sech: "Hyperbolic Inverse Secant Function",
        txtFunction_1_Coth: "Hyperbolic Inverse Cotangent Function",
        txtFunction_Custom_1: "Sine theta",
        txtFunction_Custom_2: "Cos 2x",
        txtFunction_Custom_3: "Tangent formula",
        txtAccent_Dot: "Dot",
        txtAccent_DDot: "Double Dot",
        txtAccent_DDDot: "Triple Dot",
        txtAccent_Hat: "Hat",
        txtAccent_Check: "Check",
        txtAccent_Accent: "Acute",
        txtAccent_Grave: "Grave",
        txtAccent_Smile: "Breve",
        txtAccent_Tilde: "Tilde",
        txtAccent_Bar: "Bar",
        txtAccent_DoubleBar: "Double Overbar",
        txtAccent_CurveBracketTop: "Overbrace",
        txtAccent_CurveBracketBot: "Underbrace",
        txtAccent_GroupTop: "Grouping Character Above",
        txtAccent_GroupBot: "Grouping Character Below",
        txtAccent_ArrowL: "Leftwards Arrow Above",
        txtAccent_ArrowR: "Rightwards Arrow Above",
        txtAccent_ArrowD: "Right-Left Arrow Above",
        txtAccent_HarpoonL: "Leftwards Harpoon Above",
        txtAccent_HarpoonR: "Rightwards Harpoon Above",
        txtAccent_BorderBox: "Boxed Formula (With Placeholder)",
        txtAccent_BorderBoxCustom: "Boxed Formula (Example)",
        txtAccent_BarTop: "Overbar",
        txtAccent_BarBot: "Underbar",
        txtAccent_Custom_1: "Vector A",
        txtAccent_Custom_2: "ABC With Overbar",
        txtAccent_Custom_3: "x XOR y With Overbar",
        txtLimitLog_LogBase: "Logarithm",
        txtLimitLog_Log: "Logarithm",
        txtLimitLog_Lim: "Limit",
        txtLimitLog_Min: "Minimum",
        txtLimitLog_Max: "Maximum",
        txtLimitLog_Ln: "Natural Logarithm",
        txtLimitLog_Custom_1: "Limit Example",
        txtLimitLog_Custom_2: "Maximum Example",
        txtOperator_ColonEquals: "Colon Equal",
        txtOperator_EqualsEquals: "Equal Equal",
        txtOperator_PlusEquals: "Plus Equal",
        txtOperator_MinusEquals: "Minus Equal",
        txtOperator_Definition: "Equal to By Definition",
        txtOperator_UnitOfMeasure: "Measured By",
        txtOperator_DeltaEquals: "Delta Equal To",
        txtOperator_ArrowL_Top: "Leftwards Arrow Above",
        txtOperator_ArrowR_Top: "Rightwards Arrow Above",
        txtOperator_ArrowL_Bot: "Leftwards Arrow Below",
        txtOperator_ArrowR_Bot: "Rightwards Arrow Below",
        txtOperator_DoubleArrowL_Top: "Leftwards Arrow Above",
        txtOperator_DoubleArrowR_Top: "Rightwards Arrow Above",
        txtOperator_DoubleArrowL_Bot: "Leftwards Arrow Below",
        txtOperator_DoubleArrowR_Bot: "Rightwards Arrow Below",
        txtOperator_ArrowD_Top: "Right-Left Arrow Above",
        txtOperator_ArrowD_Bot: "Right-Left Arrow Above",
        txtOperator_DoubleArrowD_Top: "Right-Left Arrow Below",
        txtOperator_DoubleArrowD_Bot: "Right-Left Arrow Below",
        txtOperator_Custom_1: "Yileds",
        txtOperator_Custom_2: "Delta Yields",
        txtMatrix_1_2: "1x2 Empty Matrix",
        txtMatrix_2_1: "2x1 Empty Matrix",
        txtMatrix_1_3: "1x3 Empty Matrix",
        txtMatrix_3_1: "3x1 Empty Matrix",
        txtMatrix_2_2: "2x2 Empty Matrix",
        txtMatrix_2_3: "2x3 Empty Matrix",
        txtMatrix_3_2: "3x2 Empty Matrix",
        txtMatrix_3_3: "3x3 Empty Matrix",
        txtMatrix_Dots_Center: "Midline Dots",
        txtMatrix_Dots_Baseline: "Baseline Dots",
        txtMatrix_Dots_Vertical: "Vertical Dots",
        txtMatrix_Dots_Diagonal: "Diagonal Dots",
        txtMatrix_Identity_2: "2x2 Identity Matrix",
        txtMatrix_Identity_2_NoZeros: "3x3 Identity Matrix",
        txtMatrix_Identity_3: "3x3 Identity Matrix",
        txtMatrix_Identity_3_NoZeros: "3x3 Identity Matrix",
        txtMatrix_2_2_RoundBracket: "Empty Matrix with Brackets",
        txtMatrix_2_2_SquareBracket: "Empty Matrix with Brackets",
        txtMatrix_2_2_LineBracket: "Empty Matrix with Brackets",
        txtMatrix_2_2_DLineBracket: "Empty Matrix with Brackets",
        txtMatrix_Flat_Round: "Sparse Matrix",
        txtMatrix_Flat_Square: "Sparse Matrix"
    },
    DE.Controllers.Toolbar || {}));
});