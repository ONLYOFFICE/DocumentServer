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
 define(["jquery", "underscore", "backbone", "text!documenteditor/main/app/template/Toolbar.template", "common/main/lib/collection/Fonts", "common/main/lib/component/Button", "common/main/lib/component/ComboBox", "common/main/lib/component/DataView", "common/main/lib/component/ColorPalette", "common/main/lib/component/ThemeColorPalette", "common/main/lib/component/Menu", "common/main/lib/component/DimensionPicker", "common/main/lib/component/Window", "common/main/lib/component/ComboBoxFonts", "common/main/lib/component/ComboDataView", "common/main/lib/component/SynchronizeTip"], function ($, _, Backbone, toolbarTemplate) {
    DE.Views.Toolbar = Backbone.View.extend(_.extend({
        el: "#toolbar",
        template: _.template(toolbarTemplate),
        events: {},
        initialize: function () {
            var me = this,
            value, valueCompact, valueTitle, valueStatus, valueRulers;
            value = window.localStorage.getItem("de-compact-toolbar");
            valueCompact = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-hidden-title");
            valueTitle = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-hidden-status");
            valueStatus = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-hidden-rulers");
            valueRulers = (value !== null && parseInt(value) == 1);
            this.SchemeNames = [this.txtScheme1, this.txtScheme2, this.txtScheme3, this.txtScheme4, this.txtScheme5, this.txtScheme6, this.txtScheme7, this.txtScheme8, this.txtScheme9, this.txtScheme10, this.txtScheme11, this.txtScheme12, this.txtScheme13, this.txtScheme14, this.txtScheme15, this.txtScheme16, this.txtScheme17, this.txtScheme18, this.txtScheme19, this.txtScheme20, this.txtScheme21];
            this.paragraphControls = [];
            this.toolbarControls = [];
            this.textOnlyControls = [];
            this._state = {
                hasCollaborativeChanges: undefined
            };
            this.btnSaveCls = "btn-save";
            this.btnSaveTip = this.tipSave + Common.Utils.String.platformKey("Ctrl+S");
            this.btnNewDocument = new Common.UI.Button({
                id: "id-toolbar-btn-newdocument",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-newdocument",
                hint: this.tipNewDocument
            });
            this.toolbarControls.push(this.btnNewDocument);
            this.btnOpenDocument = new Common.UI.Button({
                id: "id-toolbar-btn-opendocument",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-opendocument",
                hint: this.tipOpenDocument
            });
            this.toolbarControls.push(this.btnOpenDocument);
            this.btnPrint = new Common.UI.Button({
                id: "id-toolbar-btn-print",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-print",
                hint: this.tipPrint + Common.Utils.String.platformKey("Ctrl+P")
            });
            this.toolbarControls.push(this.btnPrint);
            this.btnSave = new Common.UI.Button({
                id: "id-toolbar-btn-save",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: this.btnSaveCls,
                hint: this.btnSaveTip
            });
            this.toolbarControls.push(this.btnSave);
            this.btnUndo = new Common.UI.Button({
                id: "id-toolbar-btn-undo",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-undo",
                hint: this.tipUndo + Common.Utils.String.platformKey("Ctrl+Z")
            });
            this.toolbarControls.push(this.btnUndo);
            this.btnRedo = new Common.UI.Button({
                id: "id-toolbar-btn-redo",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-redo",
                hint: this.tipRedo + Common.Utils.String.platformKey("Ctrl+Y")
            });
            this.toolbarControls.push(this.btnRedo);
            this.btnCopy = new Common.UI.Button({
                id: "id-toolbar-btn-copy",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-copy",
                hint: this.tipCopy + Common.Utils.String.platformKey("Ctrl+C")
            });
            this.toolbarControls.push(this.btnCopy);
            this.btnPaste = new Common.UI.Button({
                id: "id-toolbar-btn-paste",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-paste",
                hint: this.tipPaste + Common.Utils.String.platformKey("Ctrl+V")
            });
            this.paragraphControls.push(this.btnPaste);
            this.btnIncFontSize = new Common.UI.Button({
                id: "id-toolbar-btn-incfont",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-incfont",
                hint: this.tipIncFont + Common.Utils.String.platformKey("Ctrl+]")
            });
            this.paragraphControls.push(this.btnIncFontSize);
            this.btnDecFontSize = new Common.UI.Button({
                id: "id-toolbar-btn-decfont",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-decfont",
                hint: this.tipDecFont + Common.Utils.String.platformKey("Ctrl+[")
            });
            this.paragraphControls.push(this.btnDecFontSize);
            this.btnBold = new Common.UI.Button({
                id: "id-toolbar-btn-bold",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-bold",
                hint: this.textBold + Common.Utils.String.platformKey("Ctrl+B"),
                enableToggle: true
            });
            this.paragraphControls.push(this.btnBold);
            this.btnItalic = new Common.UI.Button({
                id: "id-toolbar-btn-italic",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-italic",
                hint: this.textItalic + Common.Utils.String.platformKey("Ctrl+I"),
                enableToggle: true
            });
            this.paragraphControls.push(this.btnItalic);
            this.btnUnderline = new Common.UI.Button({
                id: "id-toolbar-btn-underline",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-underline",
                hint: this.textUnderline + Common.Utils.String.platformKey("Ctrl+U"),
                enableToggle: true
            });
            this.paragraphControls.push(this.btnUnderline);
            this.btnStrikeout = new Common.UI.Button({
                id: "id-toolbar-btn-strikeout",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-strikeout",
                hint: this.textStrikeout,
                enableToggle: true
            });
            this.paragraphControls.push(this.btnStrikeout);
            this.btnSuperscript = new Common.UI.Button({
                id: "id-toolbar-btn-superscript",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-superscript",
                hint: this.textSuperscript,
                enableToggle: true,
                toggleGroup: "superscriptGroup"
            });
            this.paragraphControls.push(this.btnSuperscript);
            this.btnSubscript = new Common.UI.Button({
                id: "id-toolbar-btn-subscript",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-subscript",
                hint: this.textSubscript,
                enableToggle: true,
                toggleGroup: "superscriptGroup"
            });
            this.paragraphControls.push(this.btnSubscript);
            this.btnHighlightColor = new Common.UI.Button({
                id: "id-toolbar-btn-highlight",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-highlight",
                hint: this.tipHighlightColor,
                enableToggle: true,
                allowDepress: true,
                split: true,
                menu: new Common.UI.Menu({
                    style: "min-width: 100px;",
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-highlight" style="width: 120px; height: 120px; margin: 10px;"></div>')
                    },
                    {
                        caption: "--"
                    },
                    this.mnuHighlightTransparent = new Common.UI.MenuItem({
                        caption: this.strMenuNoFill,
                        checkable: true
                    })]
                })
            });
            this.paragraphControls.push(this.btnHighlightColor);
            this.textOnlyControls.push(this.btnHighlightColor);
            this.btnFontColor = new Common.UI.Button({
                id: "id-toolbar-btn-fontcolor",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-fontcolor",
                hint: this.tipFontColor,
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        id: "id-toolbar-menu-auto-fontcolor",
                        caption: this.textAutoColor,
                        template: _.template('<a tabindex="-1" type="menuitem"><span class="menu-item-icon" style="background-image: none; width: 12px; height: 12px; margin: 1px 7px 0 -7px; background-color: #000;"></span><%= caption %></a>')
                    },
                    {
                        caption: "--"
                    },
                    {
                        template: _.template('<div id="id-toolbar-menu-fontcolor" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="id-toolbar-menu-new-fontcolor" style="padding-left:12px;">' + this.textNewColor + "</a>")
                    }]
                })
            });
            this.paragraphControls.push(this.btnFontColor);
            this.btnParagraphColor = new Common.UI.Button({
                id: "id-toolbar-btn-paracolor",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-paracolor",
                hint: this.tipPrColor,
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-paracolor" style="width: 165px; height: 220px; margin: 10px;"></div>')
                    },
                    {
                        template: _.template('<a id="id-toolbar-menu-new-paracolor" style="padding-left:12px;">' + this.textNewColor + "</a>")
                    }]
                })
            });
            this.paragraphControls.push(this.btnParagraphColor);
            this.textOnlyControls.push(this.btnParagraphColor);
            this.btnAlignLeft = new Common.UI.Button({
                id: "id-toolbar-btn-align-left",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-left",
                hint: this.tipAlignLeft + Common.Utils.String.platformKey("Ctrl+L"),
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "alignGroup"
            });
            this.paragraphControls.push(this.btnAlignLeft);
            this.btnAlignCenter = new Common.UI.Button({
                id: "id-toolbar-btn-align-center",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-center",
                hint: this.tipAlignCenter + Common.Utils.String.platformKey("Ctrl+E"),
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "alignGroup"
            });
            this.paragraphControls.push(this.btnAlignCenter);
            this.btnAlignRight = new Common.UI.Button({
                id: "id-toolbar-btn-align-right",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-right",
                hint: this.tipAlignRight + Common.Utils.String.platformKey("Ctrl+R"),
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "alignGroup"
            });
            this.paragraphControls.push(this.btnAlignRight);
            this.btnAlignJust = new Common.UI.Button({
                id: "id-toolbar-btn-align-just",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-just",
                hint: this.tipAlignJust + Common.Utils.String.platformKey("Ctrl+J"),
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "alignGroup"
            });
            this.paragraphControls.push(this.btnAlignJust);
            this.btnHorizontalAlign = new Common.UI.Button({
                id: "id-toolbar-btn-halign",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-align-left",
                hint: this.tipHAligh,
                icls: "btn-align-left",
                menu: new Common.UI.Menu({
                    items: [{
                        caption: this.tipAlignLeft + Common.Utils.String.platformKey("Ctrl+L"),
                        iconCls: "mnu-align-left",
                        icls: "btn-align-left",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        checked: true,
                        value: 1
                    },
                    {
                        caption: this.tipAlignCenter + Common.Utils.String.platformKey("Ctrl+E"),
                        iconCls: "mnu-align-center",
                        icls: "btn-align-center",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        value: 2
                    },
                    {
                        caption: this.tipAlignRight + Common.Utils.String.platformKey("Ctrl+R"),
                        iconCls: "mnu-align-right",
                        icls: "btn-align-right",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        value: 0
                    },
                    {
                        caption: this.tipAlignJust + Common.Utils.String.platformKey("Ctrl+J"),
                        iconCls: "mnu-align-just",
                        icls: "btn-align-just",
                        checkable: true,
                        toggleGroup: "halignGroup",
                        value: 3
                    }]
                })
            });
            this.paragraphControls.push(this.btnHorizontalAlign);
            this.btnDecLeftOffset = new Common.UI.Button({
                id: "id-toolbar-btn-decoffset",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-decoffset",
                hint: this.tipDecPrLeft + Common.Utils.String.platformKey("Ctrl+Shift+M")
            });
            this.paragraphControls.push(this.btnDecLeftOffset);
            this.btnIncLeftOffset = new Common.UI.Button({
                id: "id-toolbar-btn-incoffset",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-incoffset",
                hint: this.tipIncPrLeft + Common.Utils.String.platformKey("Ctrl+M")
            });
            this.paragraphControls.push(this.btnIncLeftOffset);
            this.btnLineSpace = new Common.UI.Button({
                id: "id-toolbar-btn-linespace",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-linespace",
                hint: this.tipLineSpace,
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
            this.paragraphControls.push(this.btnLineSpace);
            this.btnShowHidenChars = new Common.UI.Button({
                id: "id-toolbar-btn-hidenchars",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-hidenchars",
                hint: this.tipShowHiddenChars,
                enableToggle: true,
                split: true,
                menu: new Common.UI.Menu({
                    style: "min-width: 60px;",
                    items: [{
                        caption: this.mniHiddenChars,
                        value: "characters",
                        checkable: true
                    },
                    {
                        caption: this.mniHiddenBorders,
                        value: "table",
                        checkable: true
                    }]
                })
            });
            this.toolbarControls.push(this.btnShowHidenChars);
            this.btnMarkers = new Common.UI.Button({
                id: "id-toolbar-btn-markers",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-setmarkers",
                hint: this.tipMarkers,
                enableToggle: true,
                toggleGroup: "markersGroup",
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-markers" class="menu-markers" style="width: 185px; margin: 0 5px;"></div>')
                    }]
                })
            });
            this.paragraphControls.push(this.btnMarkers);
            this.textOnlyControls.push(this.btnMarkers);
            this.btnNumbers = new Common.UI.Button({
                id: "id-toolbar-btn-numbering",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-numbering",
                hint: this.tipNumbers,
                enableToggle: true,
                toggleGroup: "markersGroup",
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-numbering" class="menu-markers" style="width: 330px; margin: 0 5px;"></div>')
                    }]
                })
            });
            this.paragraphControls.push(this.btnNumbers);
            this.textOnlyControls.push(this.btnNumbers);
            this.btnMultilevels = new Common.UI.Button({
                id: "id-toolbar-btn-multilevels",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-multilevels",
                hint: this.tipMultilevels,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-multilevels" class="menu-markers" style="width: 165px; margin: 0 5px;"></div>')
                    }]
                })
            });
            this.paragraphControls.push(this.btnMultilevels);
            this.textOnlyControls.push(this.btnMultilevels);
            this.btnInsertTable = new Common.UI.Button({
                id: "id-toolbar-btn-inserttable",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-inserttable",
                hint: this.tipInsertTable,
                menu: new Common.UI.Menu({
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-tablepicker" class="dimension-picker" style="margin: 5px 10px;"></div>')
                    },
                    {
                        caption: this.mniCustomTable,
                        value: "custom"
                    }]
                })
            });
            this.paragraphControls.push(this.btnInsertTable);
            this.btnInsertImage = new Common.UI.Button({
                id: "id-toolbar-btn-insertimage",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertimage",
                hint: this.tipInsertImage,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: this.mniImageFromFile,
                        value: "file"
                    },
                    {
                        caption: this.mniImageFromUrl,
                        value: "url"
                    }]
                })
            });
            this.paragraphControls.push(this.btnInsertImage);
            this.btnInsertChart = new Common.UI.Button({
                id: "id-toolbar-btn-insertchart",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertchart",
                hint: this.tipInsertChart,
                menu: new Common.UI.Menu({
                    style: "width: 330px;",
                    items: [{
                        template: _.template('<div id="id-toolbar-menu-insertchart" class="menu-insertchart" style="margin: 5px 5px 5px 10px;"></div>')
                    }]
                })
            });
            this.paragraphControls.push(this.btnInsertChart);
            this.btnInsertText = new Common.UI.Button({
                id: "id-toolbar-btn-inserttext",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-text",
                hint: this.tipInsertText,
                enableToggle: true
            });
            this.paragraphControls.push(this.btnInsertText);
            this.btnInsertPageBreak = new Common.UI.Button({
                id: "id-toolbar-btn-pagebreak",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-pagebreak",
                hint: this.tipPageBreak,
                split: true,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: this.textInsPageBreak
                    },
                    this.mnuInsertSectionBreak = new Common.UI.MenuItem({
                        caption: this.textInsSectionBreak,
                        value: "section",
                        menu: new Common.UI.Menu({
                            menuAlign: "tl-tr",
                            items: [{
                                caption: this.textNextPage,
                                value: c_oAscSectionBreakType.NextPage
                            },
                            {
                                caption: this.textContPage,
                                value: c_oAscSectionBreakType.Continuous
                            },
                            {
                                caption: this.textEvenPage,
                                value: c_oAscSectionBreakType.EvenPage
                            },
                            {
                                caption: this.textOddPage,
                                value: c_oAscSectionBreakType.OddPage
                            }]
                        })
                    })]
                })
            });
            this.paragraphControls.push(this.btnInsertPageBreak);
            this.btnInsertHyperlink = new Common.UI.Button({
                id: "id-toolbar-btn-inserthyperlink",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-inserthyperlink",
                hint: this.tipInsertHyperlink + Common.Utils.String.platformKey("Ctrl+K")
            });
            this.paragraphControls.push(this.btnInsertHyperlink);
            this.btnEditHeader = new Common.UI.Button({
                id: "id-toolbar-btn-editheader",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-editheader",
                hint: this.tipEditHeader,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: this.mniEditHeader,
                        value: "header"
                    },
                    {
                        caption: this.mniEditFooter,
                        value: "footer"
                    },
                    {
                        caption: "--"
                    },
                    me.mnuInsertPageNum = new Common.UI.MenuItem({
                        caption: this.textInsertPageNumber,
                        menu: new Common.UI.Menu({
                            menuAlign: "tl-tr",
                            items: [{
                                template: _.template('<div id="id-toolbar-menu-pageposition" class="menu-pageposition"></div>')
                            },
                            me.mnuPageNumCurrentPos = new Common.UI.MenuItem({
                                caption: this.textToCurrent,
                                value: "current"
                            })]
                        })
                    })]
                })
            });
            this.paragraphControls.push(this.mnuPageNumCurrentPos);
            this.toolbarControls.push(this.btnEditHeader);
            this.btnInsertShape = new Common.UI.Button({
                id: "id-toolbar-btn-insertshape",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertshape",
                hint: this.tipInsertShape,
                enableToggle: true,
                menu: new Common.UI.Menu({
                    cls: "menu-shapes"
                })
            });
            this.paragraphControls.push(this.btnInsertShape);
            this.btnInsertEquation = new Common.UI.Button({
                id: "id-toolbar-btn-insertequation",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-insertequation",
                hint: this.tipInsertEquation,
                enableToggle: true,
                menu: new Common.UI.Menu({
                    cls: "menu-shapes"
                })
            });
            this.paragraphControls.push(this.btnInsertEquation);
            this.btnDropCap = new Common.UI.Button({
                id: "id-toolbar-btn-dropcap",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-dropcap",
                hint: this.tipDropCap,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: this.textNone,
                        iconCls: "mnu-dropcap-none",
                        checkable: true,
                        toggleGroup: "menuDropCap",
                        value: c_oAscDropCap.None,
                        checked: true
                    },
                    {
                        caption: this.textInText,
                        iconCls: "mnu-dropcap-intext",
                        checkable: true,
                        toggleGroup: "menuDropCap",
                        value: c_oAscDropCap.Drop
                    },
                    {
                        caption: this.textInMargin,
                        iconCls: "mnu-dropcap-inmargin",
                        checkable: true,
                        toggleGroup: "menuDropCap",
                        value: c_oAscDropCap.Margin
                    },
                    {
                        caption: "--"
                    },
                    this.mnuDropCapAdvanced = new Common.UI.MenuItem({
                        caption: this.mniEditDropCap
                    })]
                })
            });
            this.paragraphControls.push(this.btnDropCap);
            this.btnPageOrient = new Common.UI.Button({
                id: "id-toolbar-btn-pageorient",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-pageorient",
                hint: this.tipPageOrient,
                enableToggle: true
            });
            this.toolbarControls.push(this.btnPageOrient);
            var pageSizeTemplate = _.template('<a id="<%= id %>" tabindex="-1" type="menuitem"><div><b><%= caption %></b></div><div><%= options.subtitle %></div></a>');
            this.btnPageSize = new Common.UI.Button({
                id: "id-toolbar-btn-pagesize",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-pagesize",
                hint: this.tipPageSize,
                menu: new Common.UI.Menu({
                    items: [{
                        caption: "US Letter",
                        subtitle: "21,59cm x 27,94cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [215.9, 279.4]
                    },
                    {
                        caption: "US Legal",
                        subtitle: "21,59cm x 35,56cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [215.9, 355.6]
                    },
                    {
                        caption: "A4",
                        subtitle: "21cm x 29,7cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [210, 297],
                        checked: true
                    },
                    {
                        caption: "A5",
                        subtitle: "14,81cm x 20,99cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [148.1, 209.9]
                    },
                    {
                        caption: "B5",
                        subtitle: "17,6cm x 25,01cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [176, 250.1]
                    },
                    {
                        caption: "Envelope #10",
                        subtitle: "10,48cm x 24,13cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [104.8, 241.3]
                    },
                    {
                        caption: "Envelope DL",
                        subtitle: "11,01cm x 22,01cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [110.1, 220.1]
                    },
                    {
                        caption: "Tabloid",
                        subtitle: "27,94cm x 43,17cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [279.4, 431.7]
                    },
                    {
                        caption: "A3",
                        subtitle: "29,7cm x 42,01cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [297, 420.1]
                    },
                    {
                        caption: "Tabloid Oversize",
                        subtitle: "30,48cm x 45,71cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [304.8, 457.1]
                    },
                    {
                        caption: "ROC 16K",
                        subtitle: "19,68cm x 27,3cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [196.8, 273]
                    },
                    {
                        caption: "Envelope Choukei 3",
                        subtitle: "11,99cm x 23,49cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [119.9, 234.9]
                    },
                    {
                        caption: "Super B/A3",
                        subtitle: "33,02cm x 48,25cm",
                        template: pageSizeTemplate,
                        checkable: true,
                        toggleGroup: "menuPageSize",
                        value: [330.2, 482.5]
                    }]
                })
            });
            this.toolbarControls.push(this.btnPageSize);
            this.btnClearStyle = new Common.UI.Button({
                id: "id-toolbar-btn-clearstyle",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-clearstyle",
                hint: this.tipClearStyle
            });
            this.toolbarControls.push(this.btnClearStyle);
            this.btnCopyStyle = new Common.UI.Button({
                id: "id-toolbar-btn-copystyle",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-copystyle",
                hint: this.tipCopyStyle + Common.Utils.String.platformKey("Ctrl+Shift+C"),
                enableToggle: true
            });
            this.toolbarControls.push(this.btnCopyStyle);
            this.btnColorSchemas = new Common.UI.Button({
                id: "id-toolbar-btn-colorschemas",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-colorschemas",
                hint: this.tipColorSchemas,
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
            this.toolbarControls.push(this.btnColorSchemas);
            this.btnHide = new Common.UI.Button({
                id: "id-toolbar-btn-hidebars",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-hidebars",
                hint: this.tipViewSettings,
                menu: new Common.UI.Menu({
                    cls: "pull-right",
                    style: "min-width: 180px;",
                    items: [this.mnuitemCompactToolbar = new Common.UI.MenuItem({
                        caption: this.textCompactView,
                        checkable: true,
                        checked: valueCompact
                    }), this.mnuitemHideTitleBar = new Common.UI.MenuItem({
                        caption: this.textHideTitleBar,
                        checkable: true,
                        checked: valueTitle
                    }), this.mnuitemHideStatusBar = new Common.UI.MenuItem({
                        caption: this.textHideStatusBar,
                        checkable: true,
                        checked: valueStatus
                    }), this.mnuitemHideRulers = new Common.UI.MenuItem({
                        caption: this.textHideLines,
                        checkable: true,
                        checked: valueRulers
                    }), {
                        caption: "--"
                    },
                    this.btnFitPage = new Common.UI.MenuItem({
                        caption: this.textFitPage,
                        checkable: true
                    }), this.btnFitWidth = new Common.UI.MenuItem({
                        caption: this.textFitWidth,
                        checkable: true
                    }), (new Common.UI.MenuItem({
                        template: _.template(['<div id="id-toolbar-menu-zoom" class="menu-zoom" style="height: 25px;" ', "<% if(!_.isUndefined(options.stopPropagation)) { %>", 'data-stopPropagation="true"', "<% } %>", ">", '<label class="title">' + this.textZoom + "</label>", '<button id="id-menu-zoom-in" type="button" style="float:right; margin: 2px 5px 0 0;" class="btn small btn-toolbar btn-toolbar-default"><span class="btn-icon btn-zoomin">&nbsp;</span></button>', '<label class="zoom">100%</label>', '<button id="id-menu-zoom-out" type="button" style="float:right; margin-top: 2px;" class="btn small btn-toolbar btn-toolbar-default"><span class="btn-icon btn-zoomout">&nbsp;</span></button>', "</div>"].join("")),
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
            this.toolbarControls.push(this.btnHide);
            this.btnAdvSettings = new Common.UI.Button({
                id: "id-toolbar-btn-settings",
                cls: "btn-toolbar btn-toolbar-default",
                iconCls: "btn-settings",
                hint: this.tipAdvSettings
            });
            this.toolbarControls.push(this.btnAdvSettings);
            this.mnuLineSpace = this.btnLineSpace.menu;
            this.mnuNonPrinting = this.btnShowHidenChars.menu;
            this.mnuInsertTable = this.btnInsertTable.menu;
            this.mnuInsertImage = this.btnInsertImage.menu;
            this.mnuPageSize = this.btnPageSize.menu;
            this.mnuColorSchema = this.btnColorSchemas.menu;
            this.btnMarkers.on("render:after", function (btn) {
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
            this.btnNumbers.on("render:after", function (btn) {
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
                        offsety: 518,
                        data: {
                            type: 1,
                            subtype: 4
                        }
                    },
                    {
                        offsety: 592,
                        data: {
                            type: 1,
                            subtype: 5
                        }
                    },
                    {
                        offsety: 666,
                        data: {
                            type: 1,
                            subtype: 6
                        }
                    },
                    {
                        offsety: 296,
                        data: {
                            type: 1,
                            subtype: 1
                        }
                    },
                    {
                        offsety: 370,
                        data: {
                            type: 1,
                            subtype: 2
                        }
                    },
                    {
                        offsety: 444,
                        data: {
                            type: 1,
                            subtype: 3
                        }
                    },
                    {
                        offsety: 740,
                        data: {
                            type: 1,
                            subtype: 7
                        }
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-numberlist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
            });
            this.btnMultilevels.on("render:after", function (btn) {
                me.mnuMultilevelPicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-multilevels"),
                    parentMenu: btn.menu,
                    restoreHeight: 164,
                    store: new Common.UI.DataViewStore([{
                        offsety: 0,
                        data: {
                            type: 2,
                            subtype: -1
                        }
                    },
                    {
                        offsety: 74,
                        data: {
                            type: 2,
                            subtype: 1
                        }
                    },
                    {
                        offsety: 148,
                        data: {
                            type: 2,
                            subtype: 2
                        }
                    },
                    {
                        offsety: 222,
                        data: {
                            type: 2,
                            subtype: 3
                        }
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-multilevellist" style="background-position: 0 -<%= offsety %>px;"></div>')
                });
            });
            this.btnInsertTable.on("render:after", function (btn) {
                me.mnuTablePicker = new Common.UI.DimensionPicker({
                    el: $("#id-toolbar-menu-tablepicker"),
                    minRows: 8,
                    minColumns: 10,
                    maxRows: 8,
                    maxColumns: 10
                });
            });
            this.btnHighlightColor.on("render:after", function (btn) {
                var colorVal = $('<div class="btn-color-value-line"></div>');
                $("button:first-child", btn.cmpEl).append(colorVal);
                btn.currentColor = "FFFF00";
                colorVal.css("background-color", "#" + btn.currentColor);
                me.mnuHighlightColorPicker = new Common.UI.ColorPalette({
                    el: $("#id-toolbar-menu-highlight"),
                    value: "FFFF00",
                    colors: ["FFFF00", "00FF00", "00FFFF", "FF00FF", "0000FF", "FF0000", "00008B", "008B8B", "006400", "800080", "8B0000", "808000", "FFFFFF", "D3D3D3", "A9A9A9", "000000"]
                });
                me.mnuHighlightColorPicker.select("FFFF00");
            });
            this.btnFontColor.on("render:after", function (btn) {
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
            this.btnParagraphColor.on("render:after", function (btn) {
                var colorVal = $('<div class="btn-color-value-line"></div>');
                $("button:first-child", btn.cmpEl).append(colorVal);
                colorVal.css("background-color", btn.currentColor || "transparent");
                me.mnuParagraphColorPicker = new Common.UI.ThemeColorPalette({
                    el: $("#id-toolbar-menu-paracolor"),
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
                    "-", "--", "-", me.textStandartColors, "-", "transparent", "5301B3", "980ABD", "B2275F", "F83D26", "F86A1D", "F7AC16", "F7CA12", "FAFF44", "D6EF39", "-", "--"]
                });
            });
            this.btnInsertChart.on("render:after", function (btn) {
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
            this.btnEditHeader.on("render:after", function (btn) {
                me.mnuPageNumberPosPicker = new Common.UI.DataView({
                    el: $("#id-toolbar-menu-pageposition"),
                    store: new Common.UI.DataViewStore([{
                        offsety: 132,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
                        }
                    },
                    {
                        offsety: 99,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
                        }
                    },
                    {
                        offsety: 66,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_TOP,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
                        }
                    },
                    {
                        offsety: 33,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_LEFT
                        }
                    },
                    {
                        offsety: 0,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_CENTER
                        }
                    },
                    {
                        offsety: 165,
                        allowSelected: false,
                        data: {
                            type: c_pageNumPosition.PAGE_NUM_POSITION_BOTTOM,
                            subtype: c_pageNumPosition.PAGE_NUM_POSITION_RIGHT
                        }
                    }]),
                    itemTemplate: _.template('<div id="<%= id %>" class="item-pagenumber" style="background-position: 0 -<%= offsety %>px"></div>')
                });
            });
            this.cmbFontSize = new Common.UI.ComboBox({
                cls: "input-group-nr",
                menuStyle: "min-width: 55px;",
                hint: this.tipFontSize,
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
            this.paragraphControls.push(this.cmbFontSize);
            this.cmbFontName = new Common.UI.ComboBoxFonts({
                cls: "input-group-nr",
                menuCls: "scrollable-menu",
                menuStyle: "min-width: 325px;",
                hint: this.tipFontName,
                store: new Common.Collections.Fonts()
            });
            this.paragraphControls.push(this.cmbFontName);
            this.listStyles = new Common.UI.ComboDataView({
                cls: "combo-styles",
                itemWidth: 104,
                itemHeight: 38,
                enableKeyEvents: true,
                beforeOpenHandler: function (e) {
                    var cmp = this,
                    menu = cmp.openButton.menu,
                    minMenuColumn = 6;
                    if (menu.cmpEl) {
                        var itemEl = $(cmp.cmpEl.find(".dataview.inner .style").get(0)).parent();
                        var itemMargin = -1;
                        var itemWidth = parseInt(itemEl.css("width"));
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
            this.listStyles.fieldPicker.itemTemplate = _.template(['<div class="style" id="<%= id %>">', '<div style="background-image: url(<%= imageUrl %>); width: ' + this.listStyles.itemWidth + "px; height: " + this.listStyles.itemHeight + 'px;"/>', "</div>"].join(""));
            this.listStyles.menuPicker.itemTemplate = _.template(['<div class="style" id="<%= id %>">', '<div style="background-image: url(<%= imageUrl %>); width: ' + this.listStyles.itemWidth + "px; height: " + this.listStyles.itemHeight + 'px;"/>', "</div>"].join(""));
            this.paragraphControls.push(this.listStyles);
            this.textOnlyControls.push(this.listStyles);
            _.each(this.toolbarControls.concat(this.paragraphControls), function (cmp) {
                if (_.isFunction(cmp.setDisabled)) {
                    cmp.setDisabled(true);
                }
            });
            var hidetip = window.localStorage.getItem("de-hide-synch");
            this.showSynchTip = !(hidetip && parseInt(hidetip) == 1);
            this.needShowSynchTip = false;
            return this;
        },
        render: function () {
            var me = this,
            el = $(this.el);
            this.trigger("render:before", this);
            var value = window.localStorage.getItem("de-compact-toolbar");
            var valueCompact = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-hidden-title");
            var valueTitle = (value !== null && parseInt(value) == 1);
            value = window.localStorage.getItem("de-hidden-status");
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
                if (placeholderDom) {
                    if (cmp.rendered) {
                        cmp.el = document.getElementById(cmp.id);
                        placeholderDom.appendChild(document.getElementById(cmp.id));
                    } else {
                        cmp.render(placeholderEl);
                    }
                }
            };
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-newdocument", this.btnNewDocument);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-opendocument", this.btnOpenDocument);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-field-fontname", this.cmbFontName);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-field-fontsize", this.cmbFontSize);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-print", this.btnPrint);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-save", this.btnSave);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-undo", this.btnUndo);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-redo", this.btnRedo);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-copy", this.btnCopy);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-paste", this.btnPaste);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-incfont", this.btnIncFontSize);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-decfont", this.btnDecFontSize);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-bold", this.btnBold);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-italic", this.btnItalic);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-underline", this.btnUnderline);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-strikeout", this.btnStrikeout);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-superscript", this.btnSuperscript);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-subscript", this.btnSubscript);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-highlight", this.btnHighlightColor);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-fontcolor", this.btnFontColor);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-align-left", this.btnAlignLeft);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-align-center", this.btnAlignCenter);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-align-right", this.btnAlignRight);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-align-just", this.btnAlignJust);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-incoffset", this.btnIncLeftOffset);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-decoffset", this.btnDecLeftOffset);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-linespace", this.btnLineSpace);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-hidenchars", this.btnShowHidenChars);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-markers", this.btnMarkers);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-numbering", this.btnNumbers);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-multilevels", this.btnMultilevels);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-inserttable", this.btnInsertTable);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertimage", this.btnInsertImage);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertchart", this.btnInsertChart);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-inserttext", this.btnInsertText);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-dropcap", this.btnDropCap);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-pagebreak", this.btnInsertPageBreak);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-inserthyperlink", this.btnInsertHyperlink);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-editheader", this.btnEditHeader);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertshape", this.btnInsertShape);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-insertequation", this.btnInsertEquation);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-pageorient", this.btnPageOrient);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-pagesize", this.btnPageSize);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-clearstyle", this.btnClearStyle);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-copystyle", this.btnCopyStyle);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-colorschemas", this.btnColorSchemas);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-hidebars", this.btnHide);
            replacePlacholder("#id-toolbar-" + prefix + "-placeholder-btn-settings", this.btnAdvSettings);
            replacePlacholder("#id-toolbar-full-placeholder-btn-paracolor", this.btnParagraphColor);
            replacePlacholder("#id-toolbar-full-placeholder-field-styles", this.listStyles);
            replacePlacholder("#id-toolbar-short-placeholder-btn-halign", this.btnHorizontalAlign);
        },
        createDelayedElements: function () {
            if (this.api) {
                var schemes = this.api.get_PropertyThemeColorSchemes();
                if (schemes) {
                    this.onSendThemeColorSchemes(schemes);
                }
                this.mnuNonPrinting.items[0].setChecked(this.api.get_ShowParaMarks(), true);
                this.mnuNonPrinting.items[1].setChecked(this.api.get_ShowTableEmptyLine(), true);
                this.btnShowHidenChars.toggle(this.mnuNonPrinting.items[0].checked, true);
            }
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onCollaborativeChanges", _.bind(this.onCollaborativeChanges, this));
            this.api.asc_registerCallback("asc_onAuthParticipantsChanged", _.bind(this.onApiUsersChanged, this));
            this.api.asc_registerCallback("asc_onParticipantsChanged", _.bind(this.onApiUsersChanged, this));
            return this;
        },
        setMode: function (mode) {
            if (mode.isDisconnected) {
                this.btnNewDocument.setDisabled(true);
                this.btnOpenDocument.setDisabled(true);
                this.btnSave.setDisabled(true);
                this.btnCopy.setDisabled(true);
                this.btnPaste.setDisabled(true);
                this.btnUndo.setDisabled(true);
                this.btnRedo.setDisabled(true);
                this.btnIncFontSize.setDisabled(true);
                this.btnDecFontSize.setDisabled(true);
                this.btnBold.setDisabled(true);
                this.btnItalic.setDisabled(true);
                this.btnUnderline.setDisabled(true);
                this.btnStrikeout.setDisabled(true);
                this.btnSuperscript.setDisabled(true);
                this.btnSubscript.setDisabled(true);
                this.btnHighlightColor.setDisabled(true);
                this.btnFontColor.setDisabled(true);
                this.btnParagraphColor.setDisabled(true);
                this.btnMarkers.setDisabled(true);
                this.btnNumbers.setDisabled(true);
                this.btnMultilevels.setDisabled(true);
                this.btnAlignLeft.setDisabled(true);
                this.btnAlignCenter.setDisabled(true);
                this.btnAlignRight.setDisabled(true);
                this.btnAlignJust.setDisabled(true);
                this.btnDecLeftOffset.setDisabled(true);
                this.btnIncLeftOffset.setDisabled(true);
                this.btnLineSpace.setDisabled(true);
                this.btnShowHidenChars.setDisabled(true);
                this.btnInsertTable.setDisabled(true);
                this.btnInsertImage.setDisabled(true);
                this.btnInsertChart.setDisabled(true);
                this.btnInsertText.setDisabled(true);
                this.btnDropCap.setDisabled(true);
                this.btnInsertPageBreak.setDisabled(true);
                this.btnInsertHyperlink.setDisabled(true);
                this.btnEditHeader.setDisabled(true);
                this.btnInsertShape.setDisabled(true);
                this.btnInsertEquation.setDisabled(true);
                this.btnPageOrient.setDisabled(true);
                this.btnPageSize.setDisabled(true);
                this.btnClearStyle.setDisabled(true);
                this.btnCopyStyle.setDisabled(true);
                this.btnColorSchemas.setDisabled(true);
                this.btnHorizontalAlign.setDisabled(true);
                this.cmbFontName.setDisabled(true);
                this.cmbFontSize.setDisabled(true);
                this.listStyles.setDisabled(true);
            }
            this.mode = mode;
            if (!mode.nativeApp) {
                var nativeBtnGroup = $(".toolbar-group-native");
                if (nativeBtnGroup) {
                    nativeBtnGroup.hide();
                }
            }
            if (mode.isDesktopApp) {
                $(".toolbar-group-native").hide();
                this.mnuitemHideTitleBar.hide();
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
                        var listStylesVisible = (me.listStyles.rendered);
                        if (me.listStyles.menuPicker.store.length > 0 && listStylesVisible) {
                            me.listStyles.fillComboView(me.listStyles.menuPicker.getSelectedRec(), true);
                        }
                    },
                    100);
                }
                this.fireEvent("changecompact", [this, compact]);
            }
        },
        onSendThemeColorSchemes: function (schemas) {
            var me = this;
            if (this.mnuColorSchema && this.mnuColorSchema.items.length > 0) {
                _.each(this.mnuColorSchema.items, function (item) {
                    item.remove();
                });
            }
            if (this.mnuColorSchema == null) {
                this.mnuColorSchema = new Common.UI.Menu({
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
            this.mnuColorSchema.items = [];
            var itemTemplate = _.template(['<a id="<%= id %>"  tabindex="-1" type="menuitem" class="<%= options.cls %>">', '<span class="colors">', "<% _.each(options.colors, function(color) { %>", '<span class="color" style="background: <%= color %>;"></span>', "<% }) %>", "</span>", '<span class="text"><%= caption %></span>', "</a>"].join(""));
            _.each(schemas, function (schema, index) {
                var colors = schema.get_colors();
                var schemecolors = [];
                for (var j = 2; j < 7; j++) {
                    var clr = "#" + Common.Utils.ThemeColor.getHexColor(colors[j].get_r(), colors[j].get_g(), colors[j].get_b());
                    schemecolors.push(clr);
                }
                if (index == 21) {
                    this.mnuColorSchema.addItem({
                        caption: "--"
                    });
                } else {
                    this.mnuColorSchema.addItem({
                        template: itemTemplate,
                        cls: "color-schemas-menu",
                        colors: schemecolors,
                        caption: (index < 21) ? (me.SchemeNames[index] || schema.get_name()) : schema.get_name(),
                        value: index
                    });
                }
            },
            this);
        },
        onCollaborativeChanges: function () {
            if (this._state.hasCollaborativeChanges) {
                return;
            }
            if (!this.btnSave.rendered) {
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
                window.localStorage.setItem("de-hide-synch", 1);
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
        strMenuNoFill: "No Fill",
        tipFontName: "Font Name",
        tipFontSize: "Font Size",
        tipParagraphStyle: "Paragraph Style",
        tipCopy: "Copy",
        tipPaste: "Paste",
        tipUndo: "Undo",
        tipRedo: "Redo",
        tipPrint: "Print",
        tipSave: "Save",
        tipIncFont: "Increment font size",
        tipDecFont: "Decrement font size",
        tipHighlightColor: "Highlight color",
        tipFontColor: "Font color",
        tipMarkers: "Bullets",
        tipNumbers: "Numbering",
        tipMultilevels: "Outline",
        tipAlignLeft: "Align Left",
        tipAlignRight: "Align Right",
        tipAlignCenter: "Align Center",
        tipAlignJust: "Justified",
        tipDecPrLeft: "Decrease Indent",
        tipIncPrLeft: "Increase Indent",
        tipShowHiddenChars: "Nonprinting Characters",
        tipLineSpace: "Paragraph Line Spacing",
        tipPrColor: "Background color",
        tipInsertTable: "Insert Table",
        tipInsertImage: "Insert Picture",
        tipPageBreak: "Insert Page or Section break",
        tipInsertNum: "Insert Page Number",
        tipClearStyle: "Clear Style",
        tipCopyStyle: "Copy Style",
        tipPageSize: "Page Size",
        tipPageOrient: "Page Orientation",
        tipBack: "Back",
        tipInsertShape: "Insert Autoshape",
        tipInsertEquation: "Insert Equation",
        mniImageFromFile: "Picture from file",
        mniImageFromUrl: "Picture from url",
        mniCustomTable: "Insert Custom Table",
        textTitleError: "Error",
        textInsertPageNumber: "Insert page number",
        textToCurrent: "To Current Position",
        tipEditHeader: "Edit Document Header or Footer",
        mniEditHeader: "Edit Document Header",
        mniEditFooter: "Edit Document Footer",
        tipInsertHyperlink: "Add Hyperlink",
        mniHiddenChars: "Nonprinting Characters",
        mniHiddenBorders: "Hidden Table Borders",
        tipNewDocument: "New Document",
        tipOpenDocument: "Open Document",
        tipSynchronize: "The document has been changed by another user. Please click to save your changes and reload the updates.",
        textNewColor: "Add New Custom Color",
        textAutoColor: "Automatic",
        tipInsertChart: "Insert Chart",
        textLine: "Line Chart",
        textColumn: "Column Chart",
        textBar: "Bar Chart",
        textArea: "Area Chart",
        textPie: "Pie Chart",
        textPoint: "Point Chart",
        textStock: "Stock Chart",
        textThemeColors: "Theme Colors",
        textStandartColors: "Standart Colors",
        tipColorSchemas: "Change Color Scheme",
        tipInsertText: "Insert Text",
        tipHAligh: "Horizontal Align",
        tipViewSettings: "View Settings",
        tipAdvSettings: "Advanced Settings",
        textCompactView: "View Compact Toolbar",
        textHideTitleBar: "Hide Title Bar",
        textHideStatusBar: "Hide Status Bar",
        textHideLines: "Hide Rulers",
        textFitPage: "Fit Page",
        textFitWidth: "Fit Width",
        textZoom: "Zoom",
        mniEditDropCap: "Drop Cap Settings",
        textNone: "None",
        textInText: "In Text",
        textInMargin: "In Margin",
        tipDropCap: "Insert drop cap",
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
        textInsPageBreak: "Insert Page Break",
        textInsSectionBreak: "Insert Section Break",
        textNextPage: "Next Page",
        textContPage: "Continuous Page",
        textEvenPage: "Even Page",
        textOddPage: "Odd Page",
        tipSaveCoauth: "Save your changes for the other users to see them."
    },
    DE.Views.Toolbar || {}));
});