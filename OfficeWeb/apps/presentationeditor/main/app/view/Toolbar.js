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
 define(["backbone", "text!presentationeditor/main/app/template/Toolbar.template", "common/main/lib/collection/Fonts", "common/main/lib/component/Button", "common/main/lib/component/ComboBox", "common/main/lib/component/DataView", "common/main/lib/component/ColorPalette", "common/main/lib/component/ThemeColorPalette", "common/main/lib/component/Menu", "common/main/lib/component/DimensionPicker", "common/main/lib/component/Window", "common/main/lib/component/ComboBoxFonts", "common/main/lib/component/ComboDataView", "common/main/lib/component/SynchronizeTip"], function (Backbone, toolbarTemplate) {
    PE.enumLock = {
        paragraphLock: "para-lock",
        shapeLock: "shape-lock",
        slideLock: "slide-lock",
        slideDeleted: "slide-deleted",
        noSlides: "no-slides",
        lostConnect: "disconnect",
        incIndentLock: "can-inc-indent",
        decIndentLock: "can-dec-indent",
        hyperlinkLock: "can-hyperlink",
        undoLock: "can-undo",
        redoLock: "can-redo",
        docPropsLock: "doc-props-lock",
        themeLock: "theme-lock",
        menuFileOpen: "menu-file-open",
        noParagraphSelected: "no-paragraph",
        noObjectSelected: "no-object",
        disableOnStart: "on-start"
    };
    PE.Views.Toolbar = Backbone.View.extend(_.extend({
        el: "#toolbar",
        template: _.template(toolbarTemplate),
        events: {},
        initialize: function () {
            var me = this;
            me.paragraphControls = [];
            me.shapeControls = [];
            me.slideOnlyControls = [];
            me.synchTooltip = undefined;
            me.schemeNames = [me.txtScheme1, me.txtScheme2, me.txtScheme3, me.txtScheme4, me.txtScheme5, me.txtScheme6, me.txtScheme7, me.txtScheme8, me.txtScheme9, me.txtScheme10, me.txtScheme11, me.txtScheme12, me.txtScheme13, me.txtScheme14, me.txtScheme15, me.txtScheme16, me.txtScheme17, me.txtScheme18, me.txtScheme19, me.txtScheme20, me.txtScheme21];
            me._state = {
                hasCollaborativeChanges: undefined
            };
            me.btnSaveCls = "btn-save";
            me.btnSaveTip = this.tipSave + Common.Utils.String.platformKey("Ctrl+S");
            var hidetip = window.localStorage.getItem("pe-hide-synch");
            me.showSynchTip = !(hidetip && parseInt(hidetip) == 1);
            me.needShowSynchTip = false;
            var value = window.localStorage.getItem("pe-compact-toolbar");
            var valueCompact = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("pe-hidden-title");
            var valueTitle = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("pe-hidden-status");
            var valueStatus = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("pe-hidden-rulers");
            var valueRulers = (value !== null && parseInt(value) == 1);
            var _set = PE.enumLock;
            me.btnNewDocument = new Common.UI.Button({
                id: "id-toolbar-btn-newdocument",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-newdocument",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides],
                hint: me.tipNewDocument
            });
            me.paragraphControls.push(me.btnNewDocument);
            me.btnOpenDocument = new Common.UI.Button({
                id: "id-toolbar-btn-opendocument",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-opendocument",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides],
                hint: me.tipOpenDocument
            });
            me.paragraphControls.push(me.btnOpenDocument);
            me.btnAddSlide = new Common.UI.Button({
                id: "id-toolbar-button-add-slide",
                cls: "btn-toolbar",
                iconCls: "btn-addslide",
                hint: me.tipAddSlide + Common.Utils.String.platformKey("Ctrl+M"),
                split: true,
                lock: [_set.menuFileOpen, _set.slideDeleted, _set.lostConnect, _set.disableOnStart],
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-addslide" class="menu-layouts" style="width: 302px; margin: 0 4px;"></div>')
                    }]
                })
            }).on("render:after", function (btn) {
                me.mnuAddSlidePicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-addslide"),
                    parentMenu: btn.menu,
                    restoreHeight: 300,
                    style: "max-height: 300px;",
                    store: PE.getCollection("SlideLayouts"),
                    itemTemplate: _.template(['<div class="layout" id="<%= id %>" style="width: <%= itemWidth %>px;">', '<div style="background-image: url(<%= imageUrl %>); width: <%= itemWidth %>px; height: <%= itemHeight %>px;"/>', '<div class="title"><%= title %></div> ', "</div>"].join(""))
                });
                if (me.btnAddSlide.menu) {
                    me.btnAddSlide.menu.on("show:after", function () {
                        me.mnuAddSlidePicker.scroller.update({
                            alwaysVisibleY: true
                        });
                    });
                }
            });
            me.slideOnlyControls.push(me.btnAddSlide);
            me.btnChangeSlide = new Common.UI.Button({
                id: "id-toolbar-button-change-slide",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-changeslide",
                lock: [_set.menuFileOpen, _set.slideDeleted, _set.slideLock, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipChangeSlide,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-changeslide" class="menu-layouts" style="width: 302px; margin: 0 4px;"></div>')
                    }]
                })
            }).on("render:after", function (btn) {
                me.mnuChangeSlidePicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-changeslide"),
                    parentMenu: btn.menu,
                    restoreHeight: 300,
                    style: "max-height: 300px;",
                    store: PE.getCollection("SlideLayouts"),
                    itemTemplate: _.template(['<div class="layout" id="<%= id %>" style="width: <%= itemWidth %>px;">', '<div style="background-image: url(<%= imageUrl %>); width: <%= itemWidth %>px; height: <%= itemHeight %>px;"/>', '<div class="title"><%= title %></div> ', "</div>"].join(""))
                });
                if (me.btnChangeSlide.menu) {
                    me.btnChangeSlide.menu.on("show:after", function () {
                        me.mnuChangeSlidePicker.scroller.update({
                            alwaysVisibleY: true
                        });
                    });
                }
            });
            me.slideOnlyControls.push(me.btnChangeSlide);
            me.btnPreview = new Common.UI.Button({
                id: "id-toolbar-button-preview",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-preview",
                lock: [_set.menuFileOpen, _set.slideDeleted, _set.noSlides, _set.disableOnStart],
                hint: me.tipPreview
            });
            me.slideOnlyControls.push(me.btnPreview);
            me.btnPrint = new Common.UI.Button({
                id: "id-toolbar-btn-print",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-print",
                lock: [_set.slideDeleted, _set.noSlides],
                hint: me.tipPrint + Common.Utils.String.platformKey("Ctrl+P")
            });
            me.paragraphControls.push(me.btnPrint);
            me.btnSave = new Common.UI.Button({
                id: "id-toolbar-btn-save",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: me.btnSaveCls,
                lock: [_set.lostConnect],
                hint: me.btnSaveTip
            });
            me.btnUndo = new Common.UI.Button({
                id: "id-toolbar-btn-undo",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-undo",
                lock: [_set.undoLock, _set.slideDeleted, _set.lostConnect, _set.disableOnStart],
                hint: me.tipUndo + Common.Utils.String.platformKey("Ctrl+Z")
            });
            me.slideOnlyControls.push(me.btnUndo);
            me.btnRedo = new Common.UI.Button({
                id: "id-toolbar-btn-redo",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-redo",
                lock: [_set.redoLock, _set.slideDeleted, _set.lostConnect, _set.disableOnStart],
                hint: me.tipRedo + Common.Utils.String.platformKey("Ctrl+Y")
            });
            me.slideOnlyControls.push(me.btnRedo);
            me.btnCopy = new Common.UI.Button({
                id: "id-toolbar-btn-copy",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-copy",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipCopy + Common.Utils.String.platformKey("Ctrl+C")
            });
            me.slideOnlyControls.push(me.btnCopy);
            me.btnPaste = new Common.UI.Button({
                id: "id-toolbar-btn-paste",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-paste",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides],
                hint: me.tipPaste + Common.Utils.String.platformKey("Ctrl+V")
            });
            me.paragraphControls.push(me.btnPaste);
            me.cmbFontName = new Common.UI.ComboBoxFonts({
                cls: "input-group-nr",
                menuCls: "scrollable-menu",
                menuStyle: "min-width: 325px;",
                hint: me.tipFontName,
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                store: new Common.Collections.Fonts()
            });
            me.paragraphControls.push(me.cmbFontName);
            me.cmbFontSize = new Common.UI.ComboBox({
                cls: "input-group-nr",
                menuStyle: "min-width: 55px;",
                hint: me.tipFontSize,
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                data: [{
                    value: 8,
                    displayValue: "8"
                },
                {
                    value: 9,
                    displayValue: "9"
                },
                {
                    value: 10,
                    displayValue: "10"
                },
                {
                    value: 11,
                    displayValue: "11"
                },
                {
                    value: 12,
                    displayValue: "12"
                },
                {
                    value: 14,
                    displayValue: "14"
                },
                {
                    value: 16,
                    displayValue: "16"
                },
                {
                    value: 18,
                    displayValue: "18"
                },
                {
                    value: 20,
                    displayValue: "20"
                },
                {
                    value: 22,
                    displayValue: "22"
                },
                {
                    value: 24,
                    displayValue: "24"
                },
                {
                    value: 26,
                    displayValue: "26"
                },
                {
                    value: 28,
                    displayValue: "28"
                },
                {
                    value: 36,
                    displayValue: "36"
                },
                {
                    value: 48,
                    displayValue: "48"
                },
                {
                    value: 72,
                    displayValue: "72"
                }]
            });
            me.paragraphControls.push(me.cmbFontSize);
            me.btnBold = new Common.UI.Button({
                id: "id-toolbar-btn-bold",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-bold",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.textBold + Common.Utils.String.platformKey("Ctrl+B"),
                enableToggle: true
            });
            me.paragraphControls.push(me.btnBold);
            me.btnItalic = new Common.UI.Button({
                id: "id-toolbar-btn-italic",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-italic",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.textItalic + Common.Utils.String.platformKey("Ctrl+I"),
                enableToggle: true
            });
            me.paragraphControls.push(me.btnItalic);
            me.btnUnderline = new Common.UI.Button({
                id: "id-toolbar-btn-underline",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-underline",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.textUnderline + Common.Utils.String.platformKey("Ctrl+U"),
                enableToggle: true
            });
            me.paragraphControls.push(me.btnUnderline);
            me.btnStrikeout = new Common.UI.Button({
                id: "id-toolbar-btn-strikeout",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-strikeout",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.textStrikeout,
                enableToggle: true
            });
            me.paragraphControls.push(me.btnStrikeout);
            me.btnSuperscript = new Common.UI.Button({
                id: "id-toolbar-btn-superscript",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-superscript",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.textSuperscript,
                enableToggle: true,
                toggleGroup: "superscriptGroup"
            });
            me.paragraphControls.push(me.btnSuperscript);
            me.btnSubscript = new Common.UI.Button({
                id: "id-toolbar-btn-subscript",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-subscript",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.textSubscript,
                enableToggle: true,
                toggleGroup: "superscriptGroup"
            });
            me.paragraphControls.push(me.btnSubscript);
            me.btnFontColor = new Common.UI.Button({
                id: "id-toolbar-btn-fontcolor",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-fontcolor",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipFontColor,
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-fontcolor" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="id-toolbar-menu-new-fontcolor" style="padding-left:12px;">' + me.textNewColor + "</a>")
                    }]
                })
            }).on("render:after", function (btn) {
                var colorVal = $('<div class="btn-color-value-line"></div>');
                $("button:first-child", btn.cmpEl).append(colorVal);
                colorVal.css("background-color", btn.currentColor || "transparent");
                me.mnuFontColorPicker = new Common.UI.ThemeColorPalette({
                    el: $("#id-toolbar-menu-fontcolor"),
                    dynamiccolors: 10,
                    colors: [me.textThemeColors, "-", {
                        color: "3366FF",
                        effectId: 1
                    },
                    {
                        color: "0000FF",
                        effectId: 2
                    },
                    {
                        color: "000090",
                        effectId: 3
                    },
                    {
                        color: "660066",
                        effectId: 4
                    },
                    {
                        color: "800000",
                        effectId: 5
                    },
                    {
                        color: "FF0000",
                        effectId: 1
                    },
                    {
                        color: "FF6600",
                        effectId: 1
                    },
                    {
                        color: "FFFF00",
                        effectId: 2
                    },
                    {
                        color: "CCFFCC",
                        effectId: 3
                    },
                    {
                        color: "008000",
                        effectId: 4
                    },
                    "-", {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 3
                    },
                    {
                        color: "FFFFFF",
                        effectId: 4
                    },
                    {
                        color: "000000",
                        effectId: 5
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    {
                        color: "FFFFFF",
                        effectId: 2
                    },
                    {
                        color: "000000",
                        effectId: 1
                    },
                    "-", "--", "-", me.textStandartColors, "-", "3D55FE", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"]
                });
            });
            me.paragraphControls.push(me.btnFontColor);
            me.btnClearStyle = new Common.UI.Button({
                id: "id-toolbar-btn-clearstyle",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-clearstyle",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipClearStyle
            });
            me.paragraphControls.push(me.btnClearStyle);
            me.btnCopyStyle = new Common.UI.Button({
                id: "id-toolbar-btn-copystyle",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-copystyle",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.noParagraphSelected, _set.disableOnStart],
                hint: me.tipCopyStyle + Common.Utils.String.platformKey("Ctrl+Shift+C"),
                enableToggle: true
            });
            me.slideOnlyControls.push(me.btnCopyStyle);
            me.btnMarkers = new Common.UI.Button({
                id: "id-toolbar-btn-markers",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-setmarkers",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipMarkers,
                enableToggle: true,
                toggleGroup: "markersGroup",
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-markers" class="menu-markers" style="width: 185px; margin: 0 5px;"></div>')
                    }]
                })
            }).on("render:after", function (btn) {
                me.mnuMarkersPicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-markers"),
                    parentMenu: btn.menu,
                    restoreHeight: 92,
                    store: new Common.UI.DataViewStore([{
                        offsety: 0,
                        data: {
                            type: 0,
                            subtype: -1
                        }
                    },
                    {
                        offsety: 38,
                        data: {
                            type: 0,
                            subtype: 1
                        }
                    },
                    {
                        offsety: 76,
                        data: {
                            type: 0,
                            subtype: 2
                        }
                    },
                    {
                        offsety: 114,
                        data: {
                            type: 0,
                            subtype: 3
                        }
                    },
                    {
                        offsety: 152,
                        data: {
                            type: 0,
                            subtype: 4
                        }
                    },
                    {
                        offsety: 190,
                        data: {
                            type: 0,
                            subtype: 5
                        }
                    },
                    {
                        offsety: 228,
                        data: {
                            type: 0,
                            subtype: 6
                        }
                    },
                    {
                        offsety: 266,
                        data: {
                            type: 0,
                            subtype: 7
                        }
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-markerlist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
            });
            me.paragraphControls.push(me.btnMarkers);
            me.btnNumbers = new Common.UI.Button({
                id: "id-toolbar-btn-numbering",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-numbering",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipNumbers,
                enableToggle: true,
                toggleGroup: "markersGroup",
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-numbering" class="menu-markers" style="width: 330px; margin: 0 5px;"></div>')
                    }]
                })
            }).on("render:after", function (btn) {
                me.mnuNumbersPicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-numbering"),
                    parentMenu: btn.menu,
                    restoreHeight: 164,
                    store: new Common.UI.DataViewStore([{
                        offsety: 0,
                        data: {
                            type: 1,
                            subtype: -1
                        }
                    },
                    {
                        offsety: 296,
                        data: {
                            type: 1,
                            subtype: 4
                        }
                    },
                    {
                        offsety: 370,
                        data: {
                            type: 1,
                            subtype: 5
                        }
                    },
                    {
                        offsety: 444,
                        data: {
                            type: 1,
                            subtype: 6
                        }
                    },
                    {
                        offsety: 74,
                        data: {
                            type: 1,
                            subtype: 1
                        }
                    },
                    {
                        offsety: 148,
                        data: {
                            type: 1,
                            subtype: 2
                        }
                    },
                    {
                        offsety: 222,
                        data: {
                            type: 1,
                            subtype: 3
                        }
                    },
                    {
                        offsety: 518,
                        data: {
                            type: 1,
                            subtype: 7
                        }
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-numberlist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
            });
            me.paragraphControls.push(me.btnNumbers);
            me.btnHorizontalAlign = new Common.UI.Button({
                id: "id-toolbar-btn-halign",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-left",
                icls: "btn-align-left",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipHAligh,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textAlignLeft + Common.Utils.String.platformKey("Ctrl+L"),
                        iconCls: "mnu-align-left",
                        icls: "btn-align-left",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        checked: true,
                        value: 1
                    },
                    {
                        caption: me.textAlignCenter + Common.Utils.String.platformKey("Ctrl+E"),
                        iconCls: "mnu-align-center",
                        icls: "btn-align-center",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        value: 2
                    },
                    {
                        caption: me.textAlignRight + Common.Utils.String.platformKey("Ctrl+R"),
                        iconCls: "mnu-align-right",
                        icls: "btn-align-right",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        value: 0
                    },
                    {
                        caption: me.textAlignJust + Common.Utils.String.platformKey("Ctrl+J"),
                        iconCls: "mnu-align-just",
                        icls: "btn-align-just",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        value: 3
                    }]
                })
            });
            me.paragraphControls.push(me.btnHorizontalAlign);
            me.btnVerticalAlign = new Common.UI.Button({
                id: "id-toolbar-btn-valign",
                cls: "btn-toolbar btn-toolbar-default",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipVAligh,
                iconCls: "btn-align-middle",
                icls: "btn-align-middle",
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textAlignTop,
                        iconCls: "mnu-align-top",
                        icls: "btn-align-top",
                        checkable: true,
                        toggleGroup: "valignGroup",
                        value: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                    },
                    {
                        caption: me.textAlignMiddle,
                        iconCls: "mnu-align-middle",
                        icls: "btn-align-middle",
                        checkable: true,
                        toggleGroup: "valignGroup",
                        value: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR,
                        checked: true
                    },
                    {
                        caption: me.textAlignBottom,
                        iconCls: "mnu-align-bottom",
                        icls: "btn-align-bottom",
                        checkable: true,
                        toggleGroup: "valignGroup",
                        value: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                    }]
                })
            });
            me.paragraphControls.push(me.btnVerticalAlign);
            me.btnDecLeftOffset = new Common.UI.Button({
                id: "id-toolbar-btn-decoffset",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-decoffset",
                lock: [_set.decIndentLock, _set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipDecPrLeft + Common.Utils.String.platformKey("Ctrl+Shift+M")
            });
            me.paragraphControls.push(me.btnDecLeftOffset);
            me.btnIncLeftOffset = new Common.UI.Button({
                id: "id-toolbar-btn-incoffset",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-incoffset",
                lock: [_set.incIndentLock, _set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipIncPrLeft
            });
            me.paragraphControls.push(me.btnIncLeftOffset);
            me.btnLineSpace = new Common.UI.Button({
                id: "id-toolbar-btn-linespace",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-linespace",
                lock: [_set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipLineSpace,
                menu: new Common.UI.Menu({
                    style: "min-width: 60px;",
                    items: [{
                        caption: "1.0",
                        value: 1,
                        checkable: true,
                        toggleGroup: "linesize"
                    },
                    {
                        caption: "1.15",
                        value: 1.15,
                        checkable: true,
                        toggleGroup: "linesize"
                    },
                    {
                        caption: "1.5",
                        value: 1.5,
                        checkable: true,
                        toggleGroup: "linesize"
                    },
                    {
                        caption: "2.0",
                        value: 2,
                        checkable: true,
                        toggleGroup: "linesize"
                    },
                    {
                        caption: "2.5",
                        value: 2.5,
                        checkable: true,
                        toggleGroup: "linesize"
                    },
                    {
                        caption: "3.0",
                        value: 3,
                        checkable: true,
                        toggleGroup: "linesize"
                    }]
                })
            });
            me.paragraphControls.push(me.btnLineSpace);
            me.btnInsertTable = new Common.UI.Button({
                id: "id-toolbar-btn-inserttable",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-inserttable",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipInsertTable,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-tablepicker" class="dimension-picker" style="margin: 5px 10px;"></div>')
                    },
                    {
                        caption: me.mniCustomTable,
                        value: "custom"
                    }]
                })
            }).on("render:after", function (btn) {
                me.mnuTablePicker = new Common.UI.DimensionPicker({
                    el: $("#id-toolbar-menu-tablepicker"),
                    minRows: 8,
                    minColumns: 10,
                    maxRows: 8,
                    maxColumns: 10
                });
            });
            me.slideOnlyControls.push(me.btnInsertTable);
            me.btnInsertImage = new Common.UI.Button({
                id: "id-toolbar-btn-insertimage",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertimage",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipInsertImage,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.mniImageFromFile,
                        value: "file"
                    },
                    {
                        caption: me.mniImageFromUrl,
                        value: "url"
                    }]
                })
            });
            me.slideOnlyControls.push(me.btnInsertImage);
            me.btnInsertChart = new Common.UI.Button({
                id: "id-toolbar-btn-insertchart",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertchart",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipInsertChart,
                menu: new Common.UI.Menu({
                    style: "width: 330px;",
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-insertchart" class="menu-insertchart" style="margin: 5px 5px 5px 10px;"></div>')
                    }]
                })
            }).on("render:after", function (btn) {
                me.mnuInsertChartPicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-insertchart"),
                    parentMenu: btn.menu,
                    restoreHeight: 411,
                    groups: new Common.UI.DataViewGroupStore([{
                        id: "menu-chart-group-bar",
                        caption: me.textColumn
                    },
                    {
                        id: "menu-chart-group-line",
                        caption: me.textLine
                    },
                    {
                        id: "menu-chart-group-pie",
                        caption: me.textPie
                    },
                    {
                        id: "menu-chart-group-hbar",
                        caption: me.textBar
                    },
                    {
                        id: "menu-chart-group-area",
                        caption: me.textArea
                    },
                    {
                        id: "menu-chart-group-scatter",
                        caption: me.textPoint
                    },
                    {
                        id: "menu-chart-group-stock",
                        caption: me.textStock
                    }]),
                    store: new Common.UI.DataViewStore([{
                        group: "menu-chart-group-bar",
                        type: c_oAscChartTypeSettings.barNormal,
                        allowSelected: true,
                        iconCls: "column-normal",
                        selected: true
                    },
                    {
                        group: "menu-chart-group-bar",
                        type: c_oAscChartTypeSettings.barStacked,
                        allowSelected: true,
                        iconCls: "column-stack"
                    },
                    {
                        group: "menu-chart-group-bar",
                        type: c_oAscChartTypeSettings.barStackedPer,
                        allowSelected: true,
                        iconCls: "column-pstack"
                    },
                    {
                        group: "menu-chart-group-line",
                        type: c_oAscChartTypeSettings.lineNormal,
                        allowSelected: true,
                        iconCls: "line-normal"
                    },
                    {
                        group: "menu-chart-group-line",
                        type: c_oAscChartTypeSettings.lineStacked,
                        allowSelected: true,
                        iconCls: "line-stack"
                    },
                    {
                        group: "menu-chart-group-line",
                        type: c_oAscChartTypeSettings.lineStackedPer,
                        allowSelected: true,
                        iconCls: "line-pstack"
                    },
                    {
                        group: "menu-chart-group-pie",
                        type: c_oAscChartTypeSettings.pie,
                        allowSelected: true,
                        iconCls: "pie-normal"
                    },
                    {
                        group: "menu-chart-group-pie",
                        type: c_oAscChartTypeSettings.doughnut,
                        allowSelected: true,
                        iconCls: "pie-doughnut"
                    },
                    {
                        group: "menu-chart-group-hbar",
                        type: c_oAscChartTypeSettings.hBarNormal,
                        allowSelected: true,
                        iconCls: "bar-normal"
                    },
                    {
                        group: "menu-chart-group-hbar",
                        type: c_oAscChartTypeSettings.hBarStacked,
                        allowSelected: true,
                        iconCls: "bar-stack"
                    },
                    {
                        group: "menu-chart-group-hbar",
                        type: c_oAscChartTypeSettings.hBarStackedPer,
                        allowSelected: true,
                        iconCls: "bar-pstack"
                    },
                    {
                        group: "menu-chart-group-area",
                        type: c_oAscChartTypeSettings.areaNormal,
                        allowSelected: true,
                        iconCls: "area-normal"
                    },
                    {
                        group: "menu-chart-group-area",
                        type: c_oAscChartTypeSettings.areaStacked,
                        allowSelected: true,
                        iconCls: "area-stack"
                    },
                    {
                        group: "menu-chart-group-area",
                        type: c_oAscChartTypeSettings.areaStackedPer,
                        allowSelected: true,
                        iconCls: "area-pstack"
                    },
                    {
                        group: "menu-chart-group-scatter",
                        type: c_oAscChartTypeSettings.scatter,
                        allowSelected: true,
                        iconCls: "point-normal"
                    },
                    {
                        group: "menu-chart-group-stock",
                        type: c_oAscChartTypeSettings.stock,
                        allowSelected: true,
                        iconCls: "stock-normal"
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-chartlist <%= iconCls %>"></div>')
                });
            });
            this.btnInsertChart.menu.on("show:after", function (btn) {
                me.mnuInsertChartPicker.deselectAll();
            });
            me.slideOnlyControls.push(me.btnInsertChart);
            me.btnInsertText = new Common.UI.Button({
                id: "id-toolbar-btn-inserttext",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-inserttext",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipInsertText,
                enableToggle: true
            });
            me.slideOnlyControls.push(me.btnInsertText);
            me.btnInsertHyperlink = new Common.UI.Button({
                id: "id-toolbar-btn-inserthyperlink",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-inserthyperlink",
                lock: [_set.hyperlinkLock, _set.slideDeleted, _set.paragraphLock, _set.lostConnect, _set.noSlides, _set.noParagraphSelected],
                hint: me.tipInsertHyperlink + Common.Utils.String.platformKey("Ctrl+K")
            });
            me.paragraphControls.push(me.btnInsertHyperlink);
            me.btnInsertShape = new Common.UI.Button({
                id: "id-toolbar-btn-insertshape",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertshape",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipInsertShape,
                enableToggle: true,
                menu: new Common.UI.Menu({
                    cls: "menu-shapes"
                })
            });
            me.slideOnlyControls.push(me.btnInsertShape);
            me.btnColorSchemas = new Common.UI.Button({
                id: "id-toolbar-btn-colorschemas",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-colorschemas",
                lock: [_set.themeLock, _set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipColorSchemas,
                menu: new Common.UI.Menu({
                    items: [],
                    maxHeight: 600,
                    restoreHeight: 600
                }).on("render:after", function (mnu) {
                    this.scroller = new Common.UI.Scroller({
                        el: $(this.el).find(".dropdown-menu "),
                        useKeyboard: this.enableKeyEvents && !this.handleSelect,
                        minScrollbarLength: 40,
                        alwaysVisibleY: true
                    });
                }).on("show:after", function (btn, e) {
                    var mnu = $(this.el).find(".dropdown-menu "),
                    docH = $(document).height(),
                    menuH = mnu.outerHeight(),
                    top = parseInt(mnu.css("top"));
                    if (menuH > docH) {
                        mnu.css("max-height", (docH - parseInt(mnu.css("padding-top")) - parseInt(mnu.css("padding-bottom")) - 5) + "px");
                        this.scroller.update({
                            minScrollbarLength: 40
                        });
                    } else {
                        if (mnu.height() < this.options.restoreHeight) {
                            mnu.css("max-height", (Math.min(docH - parseInt(mnu.css("padding-top")) - parseInt(mnu.css("padding-bottom")) - 5, this.options.restoreHeight)) + "px");
                            menuH = mnu.outerHeight();
                            if (top + menuH > docH) {
                                mnu.css("top", 0);
                            }
                            this.scroller.update({
                                minScrollbarLength: 40
                            });
                        }
                    }
                })
            });
            me.slideOnlyControls.push(me.btnColorSchemas);
            me.btnHide = new Common.UI.Button({
                id: "id-toolbar-btn-hidebars",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-hidebars",
                lock: [_set.menuFileOpen, _set.slideDeleted, _set.disableOnStart],
                hint: me.tipViewSettings,
                menu: new Common.UI.Menu({
                    cls: "pull-right",
                    style: "min-width: 180px;",
                    items: [me.mnuitemCompactToolbar = new Common.UI.MenuItem({
                        caption: me.textCompactView,
                        checkable: true,
                        checked: valueCompact
                    }), me.mnuitemHideTitleBar = new Common.UI.MenuItem({
                        caption: me.textHideTitleBar,
                        checkable: true,
                        checked: valueTitle
                    }), me.mnuitemHideStatusBar = new Common.UI.MenuItem({
                        caption: me.textHideStatusBar,
                        checkable: true,
                        checked: valueStatus
                    }), this.mnuitemHideRulers = new Common.UI.MenuItem({
                        caption: this.textHideLines,
                        checkable: true,
                        checked: valueRulers
                    }), {
                        caption: "--"
                    },
                    me.btnFitPage = new Common.UI.MenuItem({
                        caption: me.textFitPage,
                        checkable: true
                    }), me.btnFitWidth = new Common.UI.MenuItem({
                        caption: me.textFitWidth,
                        checkable: true
                    }), (new Common.UI.MenuItem({
                        template: _.template(['<div id="id-toolbar-menu-zoom" class="menu-zoom" style="height: 25px;" ', "<% if(!_.isUndefined(options.stopPropagation)) { %>", 'data-stopPropagation="true"', "<% } %>", ">", '<label class="title">' + me.textZoom + "</label>", '<button id="id-menu-zoom-in" type="button" style="float:right; margin: 2px 5px 0 0;" class="btn small btn-toolbar btn-toolbar-default"><span class="btn-icon btn-zoomin">&nbsp;</span></button>', '<label class="zoom">100%</label>', '<button id="id-menu-zoom-out" type="button" style="float:right; margin-top: 2px;" class="btn small btn-toolbar btn-toolbar-default"><span class="btn-icon btn-zoomout">&nbsp;</span></button>', "</div>"].join("")),
                        stopPropagation: true
                    }))]
                })
            }).on("render:after", _.bind(function (cmp) {
                me.mnuZoomOut = new Common.UI.Button({
                    el: $("#id-menu-zoom-out"),
                    cls: "btn-toolbar btn-toolbar-default"
                });
                me.mnuZoomIn = new Common.UI.Button({
                    el: $("#id-menu-zoom-in"),
                    cls: "btn-toolbar btn-toolbar-default"
                });
            }), me);
            me.slideOnlyControls.push(me.btnHide);
            me.btnAdvSettings = new Common.UI.Button({
                id: "id-toolbar-btn-settings",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-settings",
                lock: [_set.slideDeleted, _set.disableOnStart],
                hint: me.tipAdvSettings
            });
            me.slideOnlyControls.push(me.btnAdvSettings);
            me.btnShapeAlign = new Common.UI.Button({
                id: "id-toolbar-btn-shape-align",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-shape",
                lock: [_set.slideDeleted, _set.shapeLock, _set.lostConnect, _set.noSlides, _set.noObjectSelected, _set.disableOnStart],
                hint: me.tipShapeAlign,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textShapeAlignLeft,
                        iconCls: "mnu-shape-align-left",
                        value: c_oAscAlignShapeType.ALIGN_LEFT
                    },
                    {
                        caption: me.textShapeAlignCenter,
                        iconCls: "mnu-shape-align-center",
                        value: c_oAscAlignShapeType.ALIGN_CENTER
                    },
                    {
                        caption: me.textShapeAlignRight,
                        iconCls: "mnu-shape-align-right",
                        value: c_oAscAlignShapeType.ALIGN_RIGHT
                    },
                    {
                        caption: me.textShapeAlignTop,
                        iconCls: "mnu-shape-align-top",
                        value: c_oAscAlignShapeType.ALIGN_TOP
                    },
                    {
                        caption: me.textShapeAlignMiddle,
                        iconCls: "mnu-shape-align-middle",
                        value: c_oAscAlignShapeType.ALIGN_MIDDLE
                    },
                    {
                        caption: me.textShapeAlignBottom,
                        iconCls: "mnu-shape-align-bottom",
                        value: c_oAscAlignShapeType.ALIGN_BOTTOM
                    },
                    {
                        caption: "--"
                    },
                    {
                        caption: me.txtDistribHor,
                        iconCls: "mnu-distrib-hor",
                        value: 6
                    },
                    {
                        caption: me.txtDistribVert,
                        iconCls: "mnu-distrib-vert",
                        value: 7
                    }]
                })
            });
            me.shapeControls.push(me.btnShapeAlign);
            me.slideOnlyControls.push(me.btnShapeAlign);
            me.btnShapeArrange = new Common.UI.Button({
                id: "id-toolbar-btn-shape-arrange",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-arrange-shape",
                lock: [_set.slideDeleted, _set.lostConnect, _set.noSlides, _set.noObjectSelected, _set.disableOnStart],
                hint: me.tipShapeArrange,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.textArrangeFront,
                        iconCls: "mnu-arrange-front",
                        value: 1
                    },
                    {
                        caption: me.textArrangeBack,
                        iconCls: "mnu-arrange-back",
                        value: 2
                    },
                    {
                        caption: me.textArrangeForward,
                        iconCls: "mnu-arrange-forward",
                        value: 3
                    },
                    {
                        caption: me.textArrangeBackward,
                        iconCls: "mnu-arrange-backward",
                        value: 4
                    },
                    {
                        caption: "--"
                    },
                    me.mnuGroupShapes = new Common.UI.MenuItem({
                        caption: me.txtGroup,
                        iconCls: "mnu-group",
                        value: 5
                    }), me.mnuUnGroupShapes = new Common.UI.MenuItem({
                        caption: me.txtUngroup,
                        iconCls: "mnu-ungroup",
                        value: 6
                    })]
                })
            });
            me.slideOnlyControls.push(me.btnShapeArrange);
            me.btnSlideSize = new Common.UI.Button({
                id: "id-toolbar-btn-slide-size",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-slidesize",
                lock: [_set.docPropsLock, _set.slideDeleted, _set.lostConnect, _set.noSlides, _set.disableOnStart],
                hint: me.tipSlideSize,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: me.mniSlideStandard,
                        checkable: true,
                        toggleGroup: "slidesize",
                        value: 0
                    },
                    {
                        caption: me.mniSlideWide,
                        checkable: true,
                        toggleGroup: "slidesize",
                        value: 1
                    },
                    {
                        caption: "--"
                    },
                    {
                        caption: me.mniSlideAdvanced,
                        value: "advanced"
                    }]
                })
            });
            me.slideOnlyControls.push(me.btnSlideSize);
            me.listTheme = new Common.UI.ComboDataView({
                cls: "combo-styles",
                itemWidth: 85,
                enableKeyEvents: true,
                itemHeight: 38,
                hint: this.tipSlideTheme,
                lock: [_set.lostConnect, _set.noSlides],
                beforeOpenHandler: function (e) {
                    var cmp = this,
                    menu = cmp.openButton.menu,
                    minMenuColumn = 6;
                    if (menu.cmpEl) {
                        var itemEl = $(cmp.cmpEl.find(".dataview.inner .style").get(0)).parent();
                        var itemMargin = -1;
                        var itemWidth = itemEl.is(":visible") ? parseInt(itemEl.css("width")) : 112;
                        var minCount = cmp.menuPicker.store.length >= minMenuColumn ? minMenuColumn : cmp.menuPicker.store.length,
                        columnCount = Math.min(cmp.menuPicker.store.length, Math.round($(".dataview", $(cmp.fieldPicker.el)).width() / (itemMargin + itemWidth) + 0.5));
                        columnCount = columnCount < minCount ? minCount : columnCount;
                        menu.menuAlignEl = cmp.cmpEl;
                        menu.menuAlign = "tl-tl";
                        menu.setOffset(cmp.cmpEl.width() - cmp.openButton.$el.width() - columnCount * (itemMargin + itemWidth) - 1);
                        menu.cmpEl.css({
                            "width": columnCount * (itemWidth + itemMargin),
                            "min-height": cmp.cmpEl.height()
                        });
                    }
                    if (cmp.menuPicker.scroller) {
                        cmp.menuPicker.scroller.update({
                            includePadding: true,
                            suppressScrollX: true
                        });
                    }
                }
            });
            me.listTheme.fieldPicker.itemTemplate = _.template(['<div class="style" id="<%= id %>">', '<div style="background-image: url(<%= imageUrl %>); width: ' + me.listTheme.itemWidth + "px; height: " + me.listTheme.itemHeight + 'px;"/>', "</div>"].join(""));
            me.listTheme.menuPicker.itemTemplate = _.template(['<div class="style" id="<%= id %>">', '<div style="background-image: url(<%= imageUrl %>); width: ' + me.listTheme.itemWidth + "px; height: " + me.listTheme.itemHeight + 'px;"/>', "</div>"].join(""));
            this.lockControls = [this.btnNewDocument, this.btnOpenDocument, this.btnAddSlide, this.btnChangeSlide, this.btnSave, this.btnCopy, this.btnPaste, this.btnUndo, this.btnRedo, this.cmbFontName, this.cmbFontSize, this.btnBold, this.btnItalic, this.btnUnderline, this.btnStrikeout, this.btnSuperscript, this.btnSubscript, this.btnFontColor, this.btnClearStyle, this.btnCopyStyle, this.btnMarkers, this.btnNumbers, this.btnDecLeftOffset, this.btnIncLeftOffset, this.btnLineSpace, this.btnHorizontalAlign, this.btnVerticalAlign, this.btnShapeArrange, this.btnShapeAlign, this.btnInsertTable, this.btnInsertImage, this.btnInsertChart, this.btnInsertText, this.btnInsertHyperlink, this.btnInsertShape, this.btnColorSchemas, this.btnSlideSize, this.listTheme];
            _.each([me.btnSave].concat(me.paragraphControls), function (cmp) {
                if (_.isFunction(cmp.setDisabled)) {
                    cmp.setDisabled(true);
                }
            });
            this.lockToolbar(PE.enumLock.disableOnStart, true, {
                array: me.slideOnlyControls.concat(me.shapeControls)
            });
            return this;
        },
        lockToolbar: function (causes, lock, opts) { ! opts && (opts = {});
            var controls = opts.array || this.lockControls;
            opts.merge && (controls = _.union(this.lockControls, controls));
            function doLock(cmp, cause) {
                if (_.contains(cmp.options.lock, cause)) {
                    var index = cmp.keepState.indexOf(cause);
                    if (lock) {
                        if (index < 0) {
                            cmp.keepState.push(cause);
                        }
                    } else {
                        if (! (index < 0)) {
                            cmp.keepState.splice(index, 1);
                        }
                    }
                }
            }
            _.each(controls, function (item) {
                if (_.isFunction(item.setDisabled)) { ! item.keepState && (item.keepState = []);
                    if (opts.clear && opts.clear.length > 0 && item.keepState.length > 0) {
                        item.keepState = _.difference(item.keepState, opts.clear);
                    }
                    _.isArray(causes) ? _.each(causes, function (c) {
                        doLock(item, c);
                    }) : doLock(item, causes);
                    if (! (item.keepState.length > 0)) {
                        item.isDisabled() && item.setDisabled(false);
                    } else { ! item.isDisabled() && item.setDisabled(true);
                    }
                }
            });
        },
        render: function () {
            var me = this,
            el = $(this.el);
            this.trigger("render:before", this);
            var value = window.localStorage.getItem("pe-compact-toolbar");
            var valueCompact = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("pe-hidden-title");
            var valueTitle = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("pe-hidden-status");
            var valueStatus = (value !== null && parseInt(value) == 1);
            el.html(this.template({
                isCompactView: valueCompact
            }));
            me.rendererComponents(valueCompact ? "short" : "full");
            me.isCompactView = valueCompact;
            this.mnuitemCompactToolbar.on("toggle", _.bind(this.changeViewMode, this));
            this.trigger("render:after", this);
            return this;
        },
        rendererComponents: function (mode) {
            var prefix = (mode === "short") ? "short" : "full";
            var replacePlacholder = function (id, cmp) {
                var placeholderEl = $(id),
                placeholderDom = placeholderEl.get(0);
                if (placeholderDom && cmp) {
                    if (cmp.rendered) {
                        cmp.el = document.getElementById(cmp.id);
                        placeholderDom.appendChild(document.getElementById(cmp.id));
                    } else {
                        cmp.render(placeholderEl);
                    }
                }
            };
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-field-fontname", this.cmbFontName);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-field-fontsize", this.cmbFontSize);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-newdocument", this.btnNewDocument);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-opendocument", this.btnOpenDocument);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-addslide", this.btnAddSlide);
            if (mode === "short") {
                $("button", this.btnAddSlide.cmpEl).removeClass("btn-toolbar-large").addClass("btn-toolbar-default");
            } else {
                $("button", this.btnAddSlide.cmpEl).removeClass("btn-toolbar-default").addClass("btn-toolbar-large");
            }
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-changeslide", this.btnChangeSlide);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-preview", this.btnPreview);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-print", this.btnPrint);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-save", this.btnSave);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-undo", this.btnUndo);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-redo", this.btnRedo);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-copy", this.btnCopy);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-paste", this.btnPaste);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-bold", this.btnBold);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-italic", this.btnItalic);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-underline", this.btnUnderline);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-strikeout", this.btnStrikeout);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-superscript", this.btnSuperscript);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-subscript", this.btnSubscript);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-fontcolor", this.btnFontColor);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-clearstyle", this.btnClearStyle);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-copystyle", this.btnCopyStyle);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-markers", this.btnMarkers);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-numbering", this.btnNumbers);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-incoffset", this.btnIncLeftOffset);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-decoffset", this.btnDecLeftOffset);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-halign", this.btnHorizontalAlign);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-valign", this.btnVerticalAlign);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-linespace", this.btnLineSpace);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-arrange-shape", this.btnShapeArrange);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-align-shape", this.btnShapeAlign);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertshape", this.btnInsertShape);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-inserttext", this.btnInsertText);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-inserthyperlink", this.btnInsertHyperlink);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-inserttable", this.btnInsertTable);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertimage", this.btnInsertImage);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertchart", this.btnInsertChart);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-colorschemas", this.btnColorSchemas);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-slidesize", this.btnSlideSize);
            replacePlacholder("#id-toolbar-full-placeholder-field-styles", this.listTheme);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-hidebars", this.btnHide);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-settings", this.btnAdvSettings);
            replacePlacholder("#id-toolbar-full-placeholder-field-styles", this.listTheme);
        },
        createDelayedElements: function () {
            this.lockToolbar(PE.enumLock.disableOnStart, false, {
                array: this.slideOnlyControls.concat(this.shapeControls)
            });
            if (this.needShowSynchTip) {
                this.needShowSynchTip = false;
                this.onCollaborativeChanges();
            }
        },
        setApi: function (api) {
            this.api = api;
            if (this.api) {
                this.api.asc_registerCallback("asc_onSendThemeColorSchemes", _.bind(this.onSendThemeColorSchemes, this));
                this.api.asc_registerCallback("asc_onCollaborativeChanges", _.bind(this.onCollaborativeChanges, this));
                this.api.asc_registerCallback("asc_onAuthParticipantsChanged", _.bind(this.onApiUsersChanged, this));
                this.api.asc_registerCallback("asc_onParticipantsChanged", _.bind(this.onApiUsersChanged, this));
            }
            return this;
        },
        setMode: function (mode) {
            if (mode.isDisconnected) {
                this.lockToolbar(PE.enumLock.lostConnect, true);
            }
            this.mode = mode;
            if (!mode.nativeApp) {
                var nativeBtnGroup = $(".toolbar-group-native");
                if (nativeBtnGroup) {
                    nativeBtnGroup.hide();
                }
            }
        },
        changeViewMode: function (item, compact) {
            var me = this,
            toolbarFull = $("#id-toolbar-full"),
            toolbarShort = $("#id-toolbar-short");
            me.isCompactView = compact;
            if (toolbarFull && toolbarShort) {
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
                    this.rendererComponents("short");
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
                    this.rendererComponents("full");
                    _.defer(function () {
                        var listStylesVisible = (me.listTheme.rendered);
                        if (me.listTheme.menuPicker.store.length > 0 && listStylesVisible) {
                            me.listTheme.fillComboView(me.listTheme.menuPicker.getSelectedRec(), true);
                        }
                    },
                    100);
                }
                this.fireEvent("changecompact", [this, compact]);
            }
        },
        onSendThemeColorSchemes: function (schemas) {
            var me = this,
            mnuColorSchema = me.btnColorSchemas.menu;
            if (mnuColorSchema) {
                if (mnuColorSchema && mnuColorSchema.items.length > 0) {
                    _.each(mnuColorSchema.items, function (item) {
                        item.remove();
                    });
                }
                if (mnuColorSchema == null) {
                    mnuColorSchema = new Common.UI.Menu({
                        maxHeight: 600,
                        restoreHeight: 600
                    }).on("render:after", function (mnu) {
                        this.scroller = new Common.UI.Scroller({
                            el: $(this.el).find(".dropdown-menu "),
                            useKeyboard: this.enableKeyEvents && !this.handleSelect,
                            minScrollbarLength: 40
                        });
                    });
                }
                mnuColorSchema.items = [];
                var itemTemplate = _.template(['<a id="<%= id %>" class="<%= options.cls %>" tabindex="-1" type="menuitem">', '<span class="colors">', "<% _.each(options.colors, function(color) { %>", '<span class="color" style="background: <%= color %>;"></span>', "<% }) %>", "</span>", '<span class="text"><%= caption %></span>', "</a>"].join(""));
                _.each(schemas, function (schema, index) {
                    var colors = schema.get_colors();
                    var schemecolors = [];
                    for (var j = 2; j < 7; j++) {
                        var clr = "#" + Common.Utils.ThemeColor.getHexColor(colors[j].get_r(), colors[j].get_g(), colors[j].get_b());
                        schemecolors.push(clr);
                    }
                    if (index == 21) {
                        mnuColorSchema.addItem({
                            caption: "--"
                        });
                    } else {
                        mnuColorSchema.addItem({
                            template: itemTemplate,
                            cls: "color-schemas-menu",
                            colors: schemecolors,
                            caption: (index < 21) ? (me.schemeNames[index] || schema.get_name()) : schema.get_name(),
                            value: index
                        });
                    }
                },
                this);
            }
        },
        onCollaborativeChanges: function () {
            if (this._state.hasCollaborativeChanges) {
                return;
            }
            if (!this.btnSave.rendered) {
                this.needShowSynchTip = true;
                return;
            }
            var previewPanel = PE.getController("Viewport").getView("DocumentPreview");
            if (previewPanel && previewPanel.isVisible()) {
                this.needShowSynchTip = true;
                return;
            }
            this._state.hasCollaborativeChanges = true;
            var iconEl = $(".btn-icon", this.btnSave.cmpEl);
            iconEl.removeClass(this.btnSaveCls);
            iconEl.addClass("btn-synch");
            if (this.showSynchTip) {
                this.btnSave.updateHint("");
                if (this.synchTooltip === undefined) {
                    this.createSynchTip();
                }
                this.synchTooltip.show();
            } else {
                this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey("Ctrl+S"));
            }
            this.btnSave.setDisabled(false);
        },
        createSynchTip: function () {
            this.synchTooltip = new Common.UI.SynchronizeTip({
                target: $("#id-toolbar-btn-save")
            });
            this.synchTooltip.on("dontshowclick", function () {
                this.showSynchTip = false;
                this.synchTooltip.hide();
                this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey("Ctrl+S"));
                window.localStorage.setItem("pe-hide-synch", 1);
            },
            this);
            this.synchTooltip.on("closeclick", function () {
                this.synchTooltip.hide();
                this.btnSave.updateHint(this.tipSynchronize + Common.Utils.String.platformKey("Ctrl+S"));
            },
            this);
        },
        synchronizeChanges: function () {
            if (this.btnSave.rendered) {
                var iconEl = $(".btn-icon", this.btnSave.cmpEl);
                if (iconEl.hasClass("btn-synch")) {
                    iconEl.removeClass("btn-synch");
                    iconEl.addClass(this.btnSaveCls);
                    if (this.synchTooltip) {
                        this.synchTooltip.hide();
                    }
                    this.btnSave.updateHint(this.btnSaveTip);
                    this.btnSave.setDisabled(true);
                    this._state.hasCollaborativeChanges = false;
                }
            }
        },
        onApiUsersChanged: function (users) {
            var length = _.size(users);
            var cls = (length > 1) ? "btn-save-coauth" : "btn-save";
            if (cls !== this.btnSaveCls && this.btnSave.rendered) {
                this.btnSaveTip = ((length > 1) ? this.tipSaveCoauth : this.tipSave) + Common.Utils.String.platformKey("Ctrl+S");
                var iconEl = $(".btn-icon", this.btnSave.cmpEl);
                if (!iconEl.hasClass("btn-synch")) {
                    iconEl.removeClass(this.btnSaveCls);
                    iconEl.addClass(cls);
                    this.btnSave.updateHint(this.btnSaveTip);
                }
                this.btnSaveCls = cls;
            }
        },
        textBold: "Bold",
        textItalic: "Italic",
        textUnderline: "Underline",
        textStrikeout: "Strikeout",
        textSuperscript: "Superscript",
        textSubscript: "Subscript",
        tipFontName: "Font Name",
        tipFontSize: "Font Size",
        tipCopy: "Copy",
        tipPaste: "Paste",
        tipUndo: "Undo",
        tipRedo: "Redo",
        tipPrint: "Print",
        tipSave: "Save",
        tipFontColor: "Font color",
        tipMarkers: "Bullets",
        tipNumbers: "Numbering",
        tipBack: "Back",
        tipClearStyle: "Clear Style",
        tipCopyStyle: "Copy Style",
        textTitleError: "Error",
        tipHAligh: "Horizontal Align",
        tipVAligh: "Vertical Align",
        textAlignTop: "Align text to the top",
        textAlignMiddle: "Align text to the middle",
        textAlignBottom: "Align text to the bottom",
        textAlignLeft: "Left align text",
        textAlignRight: "Right align text",
        textAlignCenter: "Center text",
        textAlignJust: "Justify",
        tipDecPrLeft: "Decrease Indent",
        tipIncPrLeft: "Increase Indent",
        tipLineSpace: "Line Spacing",
        tipInsertTable: "Insert Table",
        tipInsertImage: "Insert Picture",
        mniImageFromFile: "Picture from file",
        mniImageFromUrl: "Picture from url",
        mniCustomTable: "Insert Custom Table",
        tipInsertHyperlink: "Add Hyperlink",
        tipInsertText: "Insert Text",
        tipInsertShape: "Insert Autoshape",
        tipPreview: "Start Preview",
        tipAddSlide: "Add Slide",
        tipNewDocument: "New Document",
        tipOpenDocument: "Open Document",
        tipShapeAlign: "Align Shape",
        tipShapeArrange: "Arrange Shape",
        textShapeAlignLeft: "Align Left",
        textShapeAlignRight: "Align Right",
        textShapeAlignCenter: "Align Center",
        textShapeAlignTop: "Align Top",
        textShapeAlignBottom: "Align Bottom",
        textShapeAlignMiddle: "Align Middle",
        textArrangeFront: "Bring To Front",
        textArrangeBack: "Send To Back",
        textArrangeForward: "Bring Forward",
        textArrangeBackward: "Send Backward",
        txtGroup: "Group",
        txtUngroup: "Ungroup",
        txtDistribHor: "Distribute Horizontally",
        txtDistribVert: "Distribute Vertically",
        tipChangeSlide: "Change Slide Layout",
        textOK: "OK",
        textCancel: "Cancel",
        tipColorSchemas: "Change Color Scheme",
        textNewColor: "Add New Custom Color",
        textThemeColors: "Theme Colors",
        textStandartColors: "Standart Colors",
        mniSlideStandard: "Standard (4:3)",
        mniSlideWide: "Widescreen (16:9)",
        mniSlideAdvanced: "Advanced Settings",
        tipSlideSize: "Select Slide Size",
        tipViewSettings: "View Settings",
        tipAdvSettings: "Advanced Settings",
        textCompactView: "View Compact Toolbar",
        textHideTitleBar: "Hide Title Bar",
        textHideStatusBar: "Hide Status Bar",
        textHideLines: "Hide Rulers",
        textFitPage: "Fit Slide",
        textFitWidth: "Fit Width",
        textZoom: "Zoom",
        tipInsertChart: "Insert Chart",
        textLine: "Line Chart",
        textColumn: "Column Chart",
        textBar: "Bar Chart",
        textArea: "Area Chart",
        textPie: "Pie Chart",
        textPoint: "Point Chart",
        textStock: "Stock Chart",
        tipSynchronize: "The document has been changed by another user. Please click to save your changes and reload the updates.",
        txtScheme1: "Office",
        txtScheme2: "Grayscale",
        txtScheme3: "Apex",
        txtScheme4: "Aspect",
        txtScheme5: "Civic",
        txtScheme6: "Concourse",
        txtScheme7: "Equity",
        txtScheme8: "Flow",
        txtScheme9: "Foundry",
        txtScheme10: "Median",
        txtScheme11: "Metro",
        txtScheme12: "Module",
        txtScheme13: "Opulent",
        txtScheme14: "Oriel",
        txtScheme15: "Origin",
        txtScheme16: "Paper",
        txtScheme17: "Solstice",
        txtScheme18: "Technic",
        txtScheme19: "Trek",
        txtScheme20: "Urban",
        txtScheme21: "Verve",
        tipSlideTheme: "Slide Theme",
        tipSaveCoauth: "Save your changes for the other users to see them."
    },
    PE.Views.Toolbar || {}));
});