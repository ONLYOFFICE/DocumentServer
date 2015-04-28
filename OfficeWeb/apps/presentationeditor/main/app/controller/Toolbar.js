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
 define(["core", "common/main/lib/component/Window", "common/main/lib/view/CopyWarningDialog", "common/main/lib/view/ImageFromUrlDialog", "common/main/lib/view/InsertTableDialog", "presentationeditor/main/app/view/Toolbar", "presentationeditor/main/app/view/HyperlinkSettingsDialog", "presentationeditor/main/app/view/SlideSizeSettings"], function () {
    PE.Controllers.Toolbar = Backbone.Controller.extend(_.extend({
        models: [],
        collections: [],
        views: ["Toolbar"],
        initialize: function () {
            this._state = {
                activated: false,
                themeId: undefined,
                bullets: {
                    type: undefined,
                    subtype: undefined
                },
                prcontrolsdisable: undefined,
                slidecontrolsdisable: undefined,
                slidelayoutdisable: undefined,
                shapecontrolsdisable: undefined,
                no_paragraph: undefined,
                no_object: undefined,
                clrtext: undefined,
                linespace: undefined,
                pralign: undefined,
                valign: undefined,
                vtextalign: undefined,
                can_undo: undefined,
                can_redo: undefined,
                bold: undefined,
                italic: undefined,
                strike: undefined,
                underline: undefined,
                can_group: undefined,
                can_ungroup: undefined,
                lock_doc: undefined,
                changeslide_inited: false,
                show_copywarning: true,
                no_slides: undefined,
                can_increase: undefined,
                can_decrease: undefined,
                can_hyper: undefined,
                zoom_type: undefined,
                zoom_percent: undefined
            };
            this._isAddingShape = false;
            this.slideSizeArr = [[254, 190.5], [254, 143], [254, 158.7], [254, 190.5], [338.3, 253.7], [355.6, 266.7], [275, 190.5], [300.7, 225.5], [199.1, 149.3], [285.7, 190.5], [254, 190.5], [203.2, 25.4]];
            this.currentPageSize = {
                type: -1,
                width: 0,
                height: 0
            };
            this.flg = {};
            this.diagramEditor = null;
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
                    if (me.toolbar.btnInsertText.pressed && btn_id != me.toolbar.btnInsertText.id || me.toolbar.btnInsertShape.pressed && btn_id != me.toolbar.btnInsertShape.id) {
                        me._isAddingShape = false;
                        me._addAutoshape(false);
                        me.toolbar.btnInsertShape.toggle(false, true);
                        me.toolbar.btnInsertText.toggle(false, true);
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
            toolbar.btnAddSlide.on("click", _.bind(this.onBtnAddSlide, this));
            toolbar.mnuAddSlidePicker.on("item:click", _.bind(this.onAddSlide, this));
            if (toolbar.mnuChangeSlidePicker) {
                toolbar.mnuChangeSlidePicker.on("item:click", _.bind(this.onChangeSlide, this));
            }
            toolbar.btnPreview.on("click", _.bind(this.onPreview, this));
            toolbar.btnPrint.on("click", _.bind(this.onPrint, this));
            toolbar.btnSave.on("click", _.bind(this.onSave, this));
            toolbar.btnUndo.on("click", _.bind(this.onUndo, this));
            toolbar.btnRedo.on("click", _.bind(this.onRedo, this));
            toolbar.btnCopy.on("click", _.bind(this.onCopyPaste, this, true));
            toolbar.btnPaste.on("click", _.bind(this.onCopyPaste, this, false));
            toolbar.btnBold.on("click", _.bind(this.onBold, this));
            toolbar.btnItalic.on("click", _.bind(this.onItalic, this));
            toolbar.btnUnderline.on("click", _.bind(this.onUnderline, this));
            toolbar.btnStrikeout.on("click", _.bind(this.onStrikeout, this));
            toolbar.btnSuperscript.on("click", _.bind(this.onSuperscript, this));
            toolbar.btnSubscript.on("click", _.bind(this.onSubscript, this));
            toolbar.btnHorizontalAlign.menu.on("item:click", _.bind(this.onMenuHorizontalAlignSelect, this));
            toolbar.btnVerticalAlign.menu.on("item:click", _.bind(this.onMenuVerticalAlignSelect, this));
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
            toolbar.cmbFontSize.on("show:after", _.bind(this.onFontSizeOpen, this));
            toolbar.cmbFontSize.on("hide:after", _.bind(this.onHideMenus, this));
            toolbar.cmbFontSize.on("combo:blur", _.bind(this.onComboBlur, this));
            toolbar.mnuMarkersPicker.on("item:click", _.bind(this.onSelectBullets, this, toolbar.btnMarkers));
            toolbar.mnuNumbersPicker.on("item:click", _.bind(this.onSelectBullets, this, toolbar.btnNumbers));
            toolbar.btnFontColor.on("click", _.bind(this.onBtnFontColor, this));
            toolbar.mnuFontColorPicker.on("select", _.bind(this.onSelectFontColor, this));
            $("#id-toolbar-menu-new-fontcolor").on("click", _.bind(this.onNewFontColor, this));
            toolbar.btnLineSpace.menu.on("item:toggle", _.bind(this.onLineSpaceToggle, this));
            toolbar.btnShapeAlign.menu.on("item:click", _.bind(this.onShapeAlign, this));
            toolbar.btnShapeArrange.menu.on("item:click", _.bind(this.onShapeArrange, this));
            toolbar.btnInsertHyperlink.on("click", _.bind(this.onHyperlinkClick, this));
            toolbar.mnuTablePicker.on("select", _.bind(this.onTablePickerSelect, this));
            toolbar.btnInsertTable.menu.on("item:click", _.bind(this.onInsertTableClick, this));
            toolbar.btnInsertImage.menu.on("item:click", _.bind(this.onInsertImageClick, this));
            toolbar.btnInsertText.on("click", _.bind(this.onInsertTextClick, this));
            toolbar.btnInsertShape.menu.on("hide:after", _.bind(this.onInsertShapeHide, this));
            toolbar.btnClearStyle.on("click", _.bind(this.onClearStyleClick, this));
            toolbar.btnCopyStyle.on("toggle", _.bind(this.onCopyStyleToggle, this));
            toolbar.btnAdvSettings.on("click", _.bind(this.onAdvSettingsClick, this));
            toolbar.btnColorSchemas.menu.on("item:click", _.bind(this.onColorSchemaClick, this));
            toolbar.btnSlideSize.menu.on("item:click", _.bind(this.onSlideSize, this));
            toolbar.mnuInsertChartPicker.on("item:click", _.bind(this.onSelectChart, this));
            toolbar.listTheme.on("click", _.bind(this.onListThemeSelect, this));
            toolbar.mnuitemHideTitleBar.on("toggle", _.bind(this.onHideTitleBar, this));
            toolbar.mnuitemHideStatusBar.on("toggle", _.bind(this.onHideStatusBar, this));
            toolbar.mnuitemHideRulers.on("toggle", _.bind(this.onHideRulers, this));
            toolbar.btnFitPage.on("toggle", _.bind(this.onZoomToPageToggle, this));
            toolbar.btnFitWidth.on("toggle", _.bind(this.onZoomToWidthToggle, this));
            toolbar.mnuZoomIn.on("click", _.bind(this.onZoomInClick, this));
            toolbar.mnuZoomOut.on("click", _.bind(this.onZoomOutClick, this));
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
            this.api.asc_registerCallback("asc_onPaintFormatChanged", _.bind(this.onApiStyleChange, this));
            this.api.asc_registerCallback("asc_onListType", _.bind(this.onApiBullets, this));
            this.api.asc_registerCallback("asc_canIncreaseIndent", _.bind(this.onApiCanIncreaseIndent, this));
            this.api.asc_registerCallback("asc_canDecreaseIndent", _.bind(this.onApiCanDecreaseIndent, this));
            this.api.asc_registerCallback("asc_onLineSpacing", _.bind(this.onApiLineSpacing, this));
            this.api.asc_registerCallback("asc_onPrAlign", _.bind(this.onApiParagraphAlign, this));
            this.api.asc_registerCallback("asc_onVerticalTextAlign", _.bind(this.onApiVerticalTextAlign, this));
            this.api.asc_registerCallback("asc_onCanAddHyperlink", _.bind(this.onApiCanAddHyperlink, this));
            this.api.asc_registerCallback("asc_onTextColor", _.bind(this.onApiTextColor, this));
            this.api.asc_registerCallback("asc_onUpdateThemeIndex", _.bind(this.onApiUpdateThemeIndex, this));
            this.api.asc_registerCallback("asc_onEndAddShape", _.bind(this.onApiEndAddShape, this));
            this.api.asc_registerCallback("asc_onCanGroup", _.bind(this.onApiCanGroup, this));
            this.api.asc_registerCallback("asc_onCanUnGroup", _.bind(this.onApiCanUnGroup, this));
            this.api.asc_registerCallback("asc_onPresentationSize", _.bind(this.onApiPageSize, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            this.api.asc_registerCallback("asc_onZoomChange", _.bind(this.onApiZoomChange, this));
            this.api.asc_registerCallback("asc_onStartAction", _.bind(this.onApiLongActionBegin, this));
            this.api.asc_registerCallback("asc_onEndAction", _.bind(this.onApiLongActionEnd, this));
            this.api.asc_registerCallback("asc_onFocusObject", _.bind(this.onApiFocusObject, this));
            this.api.asc_registerCallback("asc_onLockDocumentProps", _.bind(this.onApiLockDocumentProps, this));
            this.api.asc_registerCallback("asc_onUnLockDocumentProps", _.bind(this.onApiUnLockDocumentProps, this));
            this.api.asc_registerCallback("asc_onLockDocumentTheme", _.bind(this.onApiLockDocumentTheme, this));
            this.api.asc_registerCallback("asc_onUnLockDocumentTheme", _.bind(this.onApiUnLockDocumentTheme, this));
            this.api.asc_registerCallback("asc_onInitEditorStyles", _.bind(this.onApiInitEditorStyles, this));
            Common.NotificationCenter.on("copywarning:show", _.bind(function () {
                this._state.show_copywarning = false;
            },
            this));
            this.api.asc_registerCallback("asc_onCountPages", _.bind(this.onApiCountPages, this));
            this.onApiPageSize(this.api.get_PresentationWidth(), this.api.get_PresentationHeight());
            this.onSetupCopyStyleButton();
        },
        onChangeCompactView: function (view, compact) {
            window.localStorage.setItem("pe-compact-toolbar", compact ? 1 : 0);
            if (!compact && !this._state.changeslide_inited) {
                this.toolbar.mnuChangeSlidePicker.on("item:click", _.bind(this.onChangeSlide, this));
            }
            this._state.changeslide_inited = true;
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
                    this.toolbar.lockToolbar(PE.enumLock.undoLock, !can, {
                        array: [this.toolbar.btnUndo]
                    });
                    if (this._state.activated) {
                        this._state.can_undo = can;
                    }
                }
            } else {
                if (this._state.can_redo !== can) {
                    this.toolbar.lockToolbar(PE.enumLock.redoLock, !can, {
                        array: [this.toolbar.btnRedo]
                    });
                    if (this._state.activated) {
                        this._state.can_redo = can;
                    }
                }
            }
        },
        onApiCanIncreaseIndent: function (value) {
            if (this._state.can_increase !== value) {
                this.toolbar.lockToolbar(PE.enumLock.incIndentLock, !value, {
                    array: [this.toolbar.btnIncLeftOffset]
                });
                if (this._state.activated) {
                    this._state.can_increase = value;
                }
            }
        },
        onApiCanDecreaseIndent: function (value) {
            if (this._state.can_decrease !== value) {
                this.toolbar.lockToolbar(PE.enumLock.decIndentLock, !value, {
                    array: [this.toolbar.btnDecLeftOffset]
                });
                if (this._state.activated) {
                    this._state.can_decrease = value;
                }
            }
        },
        onApiBullets: function (v) {
            if (this._state.bullets.type != v.get_ListType() || this._state.bullets.subtype != v.get_ListSubType()) {
                this._state.bullets.type = v.get_ListType();
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
                }
            }
        },
        onApiParagraphAlign: function (v) {
            if (this._state.pralign !== v) {
                this._state.pralign = v;
                var index = -1,
                align, btnHorizontalAlign = this.toolbar.btnHorizontalAlign;
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
                    btnHorizontalAlign.menu.items[index].setChecked(true);
                } else {
                    if (index == -255) {
                        this._clearChecked(btnHorizontalAlign.menu);
                    }
                }
                if (btnHorizontalAlign.rendered) {
                    var iconEl = $(".btn-icon", btnHorizontalAlign.cmpEl);
                    if (iconEl) {
                        iconEl.removeClass(btnHorizontalAlign.options.icls);
                        btnHorizontalAlign.options.icls = align;
                        iconEl.addClass(btnHorizontalAlign.options.icls);
                    }
                }
            }
        },
        onApiVerticalTextAlign: function (v) {
            if (this._state.vtextalign !== v) {
                this._state.vtextalign = v;
                var index = -1,
                align = "",
                btnVerticalAlign = this.toolbar.btnVerticalAlign;
                switch (v) {
                case c_oAscVerticalTextAlign.TEXT_ALIGN_TOP:
                    index = 0;
                    align = "btn-align-top";
                    break;
                case c_oAscVerticalTextAlign.TEXT_ALIGN_CTR:
                    index = 1;
                    align = "btn-align-middle";
                    break;
                case c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM:
                    index = 2;
                    align = "btn-align-bottom";
                    break;
                default:
                    index = -255;
                    align = "btn-align-middle";
                    break;
                }
                if (! (index < 0)) {
                    btnVerticalAlign.menu.items[index].setChecked(true);
                } else {
                    if (index == -255) {
                        this._clearChecked(btnVerticalAlign.menu);
                    }
                }
                if (btnVerticalAlign.rendered) {
                    var iconEl = $(".btn-icon", btnVerticalAlign.cmpEl);
                    if (iconEl) {
                        iconEl.removeClass(btnVerticalAlign.options.icls);
                        btnVerticalAlign.options.icls = align;
                        iconEl.addClass(btnVerticalAlign.options.icls);
                    }
                }
            }
        },
        onApiLineSpacing: function (vc) {
            var line = (vc.get_Line() === null || vc.get_LineRule() === null || vc.get_LineRule() != 1) ? -1 : vc.get_Line();
            if (this._state.linespace !== line) {
                this._state.linespace = line;
                var mnuLineSpace = this.toolbar.btnLineSpace.menu;
                _.each(mnuLineSpace.items, function (item) {
                    item.setChecked(false, true);
                });
                if (line < 0) {
                    return;
                }
                if (Math.abs(line - 1) < 0.0001) {
                    mnuLineSpace.items[0].setChecked(true, true);
                } else {
                    if (Math.abs(line - 1.15) < 0.0001) {
                        mnuLineSpace.items[1].setChecked(true, true);
                    } else {
                        if (Math.abs(line - 1.5) < 0.0001) {
                            mnuLineSpace.items[2].setChecked(true, true);
                        } else {
                            if (Math.abs(line - 2) < 0.0001) {
                                mnuLineSpace.items[3].setChecked(true, true);
                            } else {
                                if (Math.abs(line - 2.5) < 0.0001) {
                                    mnuLineSpace.items[4].setChecked(true, true);
                                } else {
                                    if (Math.abs(line - 3) < 0.0001) {
                                        mnuLineSpace.items[5].setChecked(true, true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        onApiCanAddHyperlink: function (value) {
            if (this._state.can_hyper !== value && this.editMode) {
                this.toolbar.lockToolbar(PE.enumLock.hyperlinkLock, !value, {
                    array: [this.toolbar.btnInsertHyperlink]
                });
                if (this._state.activated) {
                    this._state.can_hyper = value;
                }
            }
        },
        onApiPageSize: function (width, height) {
            if (Math.abs(this.currentPageSize.width - width) > 0.001 || Math.abs(this.currentPageSize.height - height) > 0.001) {
                this.currentPageSize.width = width;
                this.currentPageSize.height = height;
                this.currentPageSize.type = -1;
                for (var i = 0; i < this.slideSizeArr.length; i++) {
                    if (Math.abs(this.slideSizeArr[i][0] - this.currentPageSize.width) < 0.001 && Math.abs(this.slideSizeArr[i][1] - this.currentPageSize.height) < 0.001) {
                        this.currentPageSize.type = i;
                        break;
                    }
                }
                this.toolbar.btnSlideSize.menu.items[0].setChecked(this.currentPageSize.type == 0);
                this.toolbar.btnSlideSize.menu.items[1].setChecked(this.currentPageSize.type == 1);
            }
        },
        onApiLongActionBegin: function (type, id) {
            switch (id) {
            case c_oAscAsyncAction.Save:
                this.toolbar.btnSave.setDisabled(true);
                this.toolbar.fireEvent("file:saving", this, true);
                break;
            }
        },
        onApiLongActionEnd: function (type, id) {
            switch (id) {
            case c_oAscAsyncAction.Save:
                this.toolbar.btnSave.setDisabled(false);
                this.toolbar.fireEvent("file:saving", this, false);
                break;
            }
        },
        onApiCountPages: function (count) {
            if (this._state.no_slides !== (count <= 0)) {
                this._state.no_slides = (count <= 0);
                this.toolbar.lockToolbar(PE.enumLock.noSlides, this._state.no_slides, {
                    array: this.toolbar.paragraphControls
                });
                this.toolbar.lockToolbar(PE.enumLock.noSlides, this._state.no_slides, {
                    array: [this.toolbar.btnChangeSlide, this.toolbar.btnPreview, this.toolbar.btnCopy, this.toolbar.btnPaste, this.toolbar.btnCopyStyle, this.toolbar.btnInsertTable, this.toolbar.btnInsertImage, this.toolbar.btnInsertChart, this.toolbar.btnInsertText, this.toolbar.btnInsertShape, this.toolbar.btnColorSchemas, this.toolbar.btnShapeAlign, this.toolbar.btnShapeArrange, this.toolbar.btnSlideSize, this.toolbar.listTheme]
                });
            }
        },
        onApiFocusObject: function (selectedObjects) {
            if (!this.editMode) {
                return;
            }
            var me = this,
            pr, sh, i = -1,
            type, paragraph_locked = undefined,
            shape_locked = undefined,
            slide_deleted = undefined,
            slide_layout_lock = undefined,
            no_paragraph = true,
            no_object = true;
            while (++i < selectedObjects.length) {
                type = selectedObjects[i].get_ObjectType();
                pr = selectedObjects[i].get_ObjectValue();
                if (type == c_oAscTypeSelectElement.Paragraph) {
                    paragraph_locked = pr.get_Locked();
                    no_paragraph = false;
                    no_object = false;
                } else {
                    if (type == c_oAscTypeSelectElement.Slide) {
                        slide_deleted = pr.get_LockDelete();
                        slide_layout_lock = pr.get_LockLayout();
                    } else {
                        if (type == c_oAscTypeSelectElement.Image || type == c_oAscTypeSelectElement.Shape || type == c_oAscTypeSelectElement.Chart || type == c_oAscTypeSelectElement.Table) {
                            shape_locked = pr.get_Locked();
                            no_object = false;
                        }
                    }
                }
            }
            if (paragraph_locked !== undefined && this._state.prcontrolsdisable !== paragraph_locked) {
                if (this._state.activated) {
                    this._state.prcontrolsdisable = paragraph_locked;
                }
                this.toolbar.lockToolbar(PE.enumLock.paragraphLock, paragraph_locked, {
                    array: me.toolbar.paragraphControls
                });
            }
            if (this._state.no_paragraph !== no_paragraph) {
                if (this._state.activated) {
                    this._state.no_paragraph = no_paragraph;
                }
                this.toolbar.lockToolbar(PE.enumLock.noParagraphSelected, no_paragraph, {
                    array: me.toolbar.paragraphControls
                });
                this.toolbar.lockToolbar(PE.enumLock.noParagraphSelected, no_paragraph, {
                    array: [me.toolbar.btnCopyStyle]
                });
            }
            if (shape_locked !== undefined && this._state.shapecontrolsdisable !== shape_locked) {
                if (this._state.activated) {
                    this._state.shapecontrolsdisable = shape_locked;
                }
                this.toolbar.lockToolbar(PE.enumLock.shapeLock, shape_locked, {
                    array: me.toolbar.shapeControls
                });
            }
            if (this._state.no_object !== no_object) {
                if (this._state.activated) {
                    this._state.no_object = no_object;
                }
                this.toolbar.lockToolbar(PE.enumLock.noObjectSelected, no_object, {
                    array: [me.toolbar.btnShapeAlign, me.toolbar.btnShapeArrange]
                });
            }
            if (slide_layout_lock !== undefined && this._state.slidelayoutdisable !== slide_layout_lock) {
                if (this._state.activated) {
                    this._state.slidelayoutdisable = slide_layout_lock;
                }
                this.toolbar.lockToolbar(PE.enumLock.slideLock, slide_layout_lock, {
                    array: [me.toolbar.btnChangeSlide]
                });
            }
            if (slide_deleted !== undefined && this._state.slidecontrolsdisable !== slide_deleted) {
                if (this._state.activated) {
                    this._state.slidecontrolsdisable = slide_deleted;
                }
                this.toolbar.lockToolbar(PE.enumLock.slideDeleted, slide_deleted, {
                    array: me.toolbar.slideOnlyControls.concat(me.toolbar.paragraphControls)
                });
            }
        },
        onApiStyleChange: function (v) {
            this.toolbar.btnCopyStyle.toggle(v, true);
            this.modeAlwaysSetStyle = false;
        },
        onApiUpdateThemeIndex: function (v) {
            if (this._state.themeId !== v) {
                var listStyle = this.toolbar.listTheme,
                listStylesVisible = (listStyle.rendered);
                if (listStylesVisible) {
                    listStyle.suspendEvents();
                    var styleRec = listStyle.menuPicker.store.findWhere({
                        themeId: v
                    });
                    this._state.themeId = (listStyle.menuPicker.store.length > 0) ? v : undefined;
                    listStyle.menuPicker.selectRecord(styleRec);
                    listStyle.resumeEvents();
                }
            }
        },
        onApiCanGroup: function (value) {
            if (this._state.can_group !== value) {
                this.toolbar.mnuGroupShapes.setDisabled(!value);
                if (this._state.activated) {
                    this._state.can_group = value;
                }
            }
        },
        onApiCanUnGroup: function (value) {
            if (this._state.can_ungroup !== value) {
                this.toolbar.mnuUnGroupShapes.setDisabled(!value);
                if (this._state.activated) {
                    this._state.can_ungroup = value;
                }
            }
        },
        onApiLockDocumentProps: function () {
            if (this._state.lock_doc !== true) {
                this.toolbar.lockToolbar(PE.enumLock.docPropsLock, true, {
                    array: [this.toolbar.btnSlideSize]
                });
                if (this._state.activated) {
                    this._state.lock_doc = true;
                }
            }
        },
        onApiUnLockDocumentProps: function () {
            if (this._state.lock_doc !== false) {
                this.toolbar.lockToolbar(PE.enumLock.docPropsLock, false, {
                    array: [this.toolbar.btnSlideSize]
                });
                if (this._state.activated) {
                    this._state.lock_doc = false;
                }
            }
        },
        onApiLockDocumentTheme: function () {
            this.toolbar.lockToolbar(PE.enumLock.themeLock, true, {
                array: [this.toolbar.btnColorSchemas]
            });
        },
        onApiUnLockDocumentTheme: function () {
            this.toolbar.lockToolbar(PE.enumLock.themeLock, false, {
                array: [this.toolbar.btnColorSchemas]
            });
        },
        onApiCoAuthoringDisconnect: function () {
            this.toolbar.setMode({
                isDisconnected: true
            });
            this.editMode = false;
        },
        onApiZoomChange: function (percent, type) {
            if (this._state.zoom_type !== type) {
                this.toolbar.btnFitPage.setChecked(type == 2, true);
                this.toolbar.btnFitWidth.setChecked(type == 1, true);
                this._state.zoom_type = type;
            }
            if (this._state.zoom_percent !== percent) {
                $(".menu-zoom .zoom", this.toolbar.el).html(percent + "%");
                this._state.zoom_percent = percent;
            }
        },
        onApiInitEditorStyles: function (themes) {
            if (themes) {
                this._onInitEditorThemes(themes[0], themes[1]);
            }
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
        onAddSlide: function (picker, item, record) {
            if (this.api) {
                this.api.AddSlide(record.get("data").idx);
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Add Slide");
            }
        },
        onBtnAddSlide: function () {
            this.api.AddSlide();
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Add Slide");
        },
        onChangeSlide: function (picker, item, record) {
            if (this.api) {
                this.api.ChangeLayout(record.get("data").idx);
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Change Layout");
            }
        },
        onPreview: function (btn, e) {
            var previewPanel = PE.getController("Viewport").getView("DocumentPreview");
            if (previewPanel) {
                previewPanel.show();
                if (this.api) {
                    var current = this.api.getCurrentPage();
                    this.api.StartDemonstration("presentation-preview", _.isNumber(current) ? current : 0);
                    Common.component.Analytics.trackEvent("ToolBar", "Preview");
                }
            }
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
            if (this.api && this.api.asc_isDocumentCanSave) {
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
                var value = window.localStorage.getItem("pe-hide-copywarning");
                if (! (value && parseInt(value) == 1) && this._state.show_copywarning) {
                    (new Common.Views.CopyWarningDialog({
                        handler: function (dontshow) {
                            copy ? me.api.Copy() : me.api.Paste();
                            if (dontshow) {
                                window.localStorage.setItem("pe-hide-copywarning", 1);
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
        onMenuVerticalAlignSelect: function (menu, item) {
            var btnVerticalAlign = this.toolbar.btnVerticalAlign,
            iconEl = $(".btn-icon", btnVerticalAlign.cmpEl);
            if (iconEl) {
                iconEl.removeClass(btnVerticalAlign.options.icls);
                btnVerticalAlign.options.icls = !item.checked ? "btn-align-middle" : item.options.icls;
                iconEl.addClass(btnVerticalAlign.options.icls);
            }
            this._state.vtextalign = undefined;
            if (this.api && item.checked) {
                this.api.setVerticalAlign(item.value);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Vertical Align");
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
            if (this.api) {
                this.api.put_ListType(rawData.data.type, rawData.data.subtype);
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "List Type");
        },
        onLineSpaceToggle: function (menu, item, state, e) {
            if ( !! state) {
                this._state.linespace = undefined;
                if (this.api) {
                    this.api.put_PrLineSpacing(c_paragraphLinerule.LINERULE_AUTO, item.value);
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Line Spacing");
            }
        },
        onShapeAlign: function (menu, item) {
            if (this.api) {
                if (item.value < 6) {
                    this.api.put_ShapesAlign(item.value);
                    Common.component.Analytics.trackEvent("ToolBar", "Shape Align");
                } else {
                    if (item.value == 6) {
                        this.api.DistributeHorizontally();
                        Common.component.Analytics.trackEvent("ToolBar", "Distribute");
                    } else {
                        this.api.DistributeVertically();
                        Common.component.Analytics.trackEvent("ToolBar", "Distribute");
                    }
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            }
        },
        onShapeArrange: function (menu, item) {
            if (this.api) {
                switch (item.value) {
                case 1:
                    this.api.shapes_bringToFront();
                    Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
                    break;
                case 2:
                    this.api.shapes_bringToBack();
                    Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
                    break;
                case 3:
                    this.api.shapes_bringForward();
                    Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
                    break;
                case 4:
                    this.api.shapes_bringBackward();
                    Common.component.Analytics.trackEvent("ToolBar", "Shape Arrange");
                    break;
                case 5:
                    this.api.groupShapes();
                    Common.component.Analytics.trackEvent("ToolBar", "Shape Group");
                    break;
                case 6:
                    this.api.unGroupShapes();
                    Common.component.Analytics.trackEvent("ToolBar", "Shape UnGroup");
                    break;
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
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
                    var _arr = [];
                    for (var i = 0; i < me.api.getCountPages(); i++) {
                        _arr.push({
                            displayValue: i + 1,
                            value: i
                        });
                    }
                    win = new PE.Views.HyperlinkSettingsDialog({
                        handler: handlerDlg,
                        slides: _arr
                    });
                    props = new CHyperlinkProperty();
                    props.put_Text(text);
                    win.show();
                    win.setSettings(props);
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
            if (item.value === "file") {
                this.toolbar.fireEvent("insertimage", this.toolbar);
                if (this.api) {
                    this.api.AddImage();
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Image");
            } else {
                var me = this;
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
        onColorSchemaClick: function (menu, item) {
            if (this.api) {
                this.api.ChangeColorScheme(item.value);
                Common.component.Analytics.trackEvent("ToolBar", "Color Scheme");
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onSlideSize: function (menu, item) {
            if (item.value !== "advanced") {
                this.currentPageSize = {
                    type: item.value,
                    width: this.slideSizeArr[item.value][0],
                    height: this.slideSizeArr[item.value][1]
                };
                if (this.api) {
                    this.api.changeSlideSize(this.slideSizeArr[item.value][0], this.slideSizeArr[item.value][1]);
                }
                Common.NotificationCenter.trigger("edit:complete", this.toolbar);
                Common.component.Analytics.trackEvent("ToolBar", "Slide Size");
            } else {
                var win, props, me = this;
                var handlerDlg = function (dlg, result) {
                    if (result == "ok") {
                        props = dlg.getSettings();
                        me.currentPageSize = {
                            type: props[0],
                            width: props[1],
                            height: props[2]
                        };
                        me.toolbar.btnSlideSize.menu.items[0].setChecked(props[0] == 0);
                        me.toolbar.btnSlideSize.menu.items[1].setChecked(props[0] == 1);
                        if (me.api) {
                            me.api.changeSlideSize(props[1], props[2]);
                        }
                    }
                    Common.NotificationCenter.trigger("edit:complete", me.toolbar);
                };
                win = new PE.Views.SlideSizeSettings({
                    handler: handlerDlg
                });
                win.show();
                win.setSettings(me.currentPageSize.type, me.currentPageSize.width, me.currentPageSize.height);
                Common.component.Analytics.trackEvent("ToolBar", "Slide Size");
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
        onListThemeSelect: function (combo, record) {
            this._state.themeId = undefined;
            if (this.api) {
                this.api.ChangeTheme(record.get("themeId"));
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
            Common.component.Analytics.trackEvent("ToolBar", "Style");
        },
        onHideTitleBar: function (item, checked) {
            var headerView = this.getApplication().getController("Viewport").getView("Common.Views.Header");
            headerView && headerView.setVisible(!checked);
            window.localStorage.setItem("pe-hidden-title", checked ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "header");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onHideStatusBar: function (item, checked) {
            var headerView = this.getApplication().getController("Statusbar").getView("Statusbar");
            headerView && headerView.setVisible(!checked);
            window.localStorage.setItem("pe-hidden-status", checked ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "status");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onHideRulers: function (item, checked) {
            if (this.api) {
                this.api.asc_SetViewRulers(!checked);
            }
            window.localStorage.setItem("pe-hidden-rulers", checked ? 1 : 0);
            Common.NotificationCenter.trigger("layout:changed", "rulers");
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomToPageToggle: function (item, state) {
            if (this.api) {
                this._state.zoom_type = undefined;
                this._state.zoom_percent = undefined;
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
                this._state.zoom_type = undefined;
                this._state.zoom_percent = undefined;
                if (state) {
                    this.api.zoomFitToWidth();
                } else {
                    this.api.zoomCustomMode();
                }
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomInClick: function (btn) {
            this._state.zoom_type = undefined;
            this._state.zoom_percent = undefined;
            if (this.api) {
                this.api.zoomIn();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        onZoomOutClick: function (btn) {
            this._state.zoom_type = undefined;
            this._state.zoom_percent = undefined;
            if (this.api) {
                this.api.zoomOut();
            }
            Common.NotificationCenter.trigger("edit:complete", this.toolbar);
        },
        _clearBullets: function () {
            this.toolbar.btnMarkers.toggle(false, true);
            this.toolbar.btnNumbers.toggle(false, true);
            this.toolbar.mnuMarkersPicker.selectByIndex(0, true);
            this.toolbar.mnuNumbersPicker.selectByIndex(0, true);
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
        onSelectFontColor: function (picker, color) {
            this._state.clrtext = this._state.clrtext_asccolor = undefined;
            var clr = (typeof(color) == "object") ? color.color : color;
            this.toolbar.btnFontColor.currentColor = color;
            $(".btn-color-value-line", this.toolbar.btnFontColor.cmpEl).css("background-color", "#" + clr);
            this.toolbar.mnuFontColorPicker.currentColor = color;
            if (this.api) {
                this.api.put_TextColor(Common.Utils.ThemeColor.getRgbColor(color));
            }
            Common.component.Analytics.trackEvent("ToolBar", "Text Color");
        },
        onBtnFontColor: function () {
            this.toolbar.mnuFontColorPicker.trigger("select", this.toolbar.mnuFontColorPicker, this.toolbar.mnuFontColorPicker.currentColor);
        },
        onApiTextColor: function (color) {
            var clr;
            var picker = this.toolbar.mnuFontColorPicker;
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
            if ((type1 !== type2) || (type1 == "object" && (clr.effectValue !== this._state.clrtext.effectValue || this._state.clrtext.color.indexOf(clr.color) < 0)) || (type1 != "object" && this._state.clrtext.indexOf(clr) < 0)) {
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
                        Common.NotificationCenter.trigger("edit:complete", me.toolbar, me.toolbar.btnInsertShape);
                        Common.component.Analytics.trackEvent("ToolBar", "Add Shape");
                    }
                });
            }
        },
        updateThemeColors: function () {
            if (Common.Utils.ThemeColor.getEffectColors() === undefined) {
                return;
            }
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
            if (this.toolbar.btnFontColor.currentColor === undefined) {
                this.toolbar.btnFontColor.currentColor = this.toolbar.mnuFontColorPicker.currentColor.color || this.toolbar.mnuFontColorPicker.currentColor;
                $(".btn-color-value-line", this.toolbar.btnFontColor.cmpEl).css("background-color", "#" + this.toolbar.btnFontColor.currentColor);
            }
            if (this._state.clrtext_asccolor !== undefined) {
                this._state.clrtext = undefined;
                this.onApiTextColor(this._state.clrtext_asccolor);
            }
            this._state.clrtext_asccolor = undefined;
        },
        _clearChecked: function (menu) {
            _.each(menu.items, function (item) {
                if (item.setChecked) {
                    item.setChecked(false, true);
                }
            });
        },
        _onInitEditorThemes: function (editorThemes, documentThemes) {
            var me = this;
            window.styles_loaded = false;
            if (!me.toolbar.listTheme) {
                me.themes = [editorThemes, documentThemes];
                return;
            }
            var defaultThemes = editorThemes || [],
            docThemes = documentThemes || [];
            me.toolbar.listTheme.menuPicker.store.reset([]);
            _.each(defaultThemes.concat(docThemes), function (theme) {
                me.toolbar.listTheme.menuPicker.store.add({
                    imageUrl: theme.get_Image(),
                    uid: Common.UI.getId(),
                    themeId: theme.get_Index()
                });
            });
            if (me.toolbar.listTheme.menuPicker.store.length > 0 && me.toolbar.listTheme.rendered) {
                me.toolbar.listTheme.fillComboView(me.toolbar.listTheme.menuPicker.store.at(0), true);
                Common.NotificationCenter.trigger("edit:complete", this);
            }
            window.styles_loaded = true;
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
        activateControls: function () {
            this.toolbar.lockToolbar(PE.enumLock.disableOnStart, false, {
                array: this.toolbar.slideOnlyControls.concat(this.toolbar.shapeControls)
            });
            this._state.activated = true;
        },
        DisableToolbar: function (disable) {
            var mask = $(".toolbar-mask");
            if (disable && mask.length > 0 || !disable && mask.length == 0) {
                return;
            }
            var toolbar = this.toolbar;
            toolbar.$el.find(".toolbar").toggleClass("masked", disable);
            this.toolbar.lockToolbar(PE.enumLock.menuFileOpen, disable, {
                array: [toolbar.btnAddSlide, toolbar.btnChangeSlide, toolbar.btnPreview, toolbar.btnHide]
            });
            if (disable) {
                mask = $("<div class='toolbar-mask'>").appendTo(toolbar.$el);
                var left = toolbar.isCompactView ? 150 : (toolbar.mode.nativeApp ? 190 : 145);
                mask.css("left", left + "px");
                mask.css("right", (toolbar.isCompactView ? 0 : 45) + "px");
                Common.util.Shortcuts.suspendEvents("command+k, ctrl+k, command+alt+h, ctrl+alt+h, command+f5, ctrl+f5");
            } else {
                mask.remove();
                Common.util.Shortcuts.resumeEvents("command+k, ctrl+k, command+alt+h, ctrl+alt+h, command+f5, ctrl+f5");
            }
        },
        textEmptyImgUrl: "You need to specify image URL.",
        textWarning: "Warning",
        textFontSizeErr: "The entered value must be more than 0"
    },
    PE.Controllers.Toolbar || {}));
});