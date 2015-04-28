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
 define(["jquery", "underscore", "backbone", "gateway", "common/main/lib/component/Menu"], function ($, _, Backbone, gateway) {
    SSE.Views.DocumentHolder = Backbone.View.extend(_.extend({
        el: "#editor_sdk",
        template: null,
        events: {},
        initialize: function () {
            var me = this;
            this.setApi = function (api) {
                me.api = api;
                return me;
            };
            var value = window.localStorage.getItem("sse-settings-livecomment");
            me.isLiveCommenting = !(value !== null && parseInt(value) == 0);
        },
        render: function () {
            this.fireEvent("render:before", this);
            this.cmpEl = $(this.el);
            this.fireEvent("render:after", this);
            return this;
        },
        focus: function () {
            var me = this;
            _.defer(function () {
                me.cmpEl.focus();
            },
            50);
        },
        createDelayedElements: function () {
            var me = this;
            me.pmiCut = new Common.UI.MenuItem({
                caption: me.txtCut,
                value: "cut"
            });
            me.pmiCopy = new Common.UI.MenuItem({
                caption: me.txtCopy,
                value: "copy"
            });
            me.pmiPaste = new Common.UI.MenuItem({
                caption: me.txtPaste,
                value: "paste"
            });
            me.pmiInsertEntire = new Common.UI.MenuItem({
                caption: me.txtInsert
            });
            me.pmiInsertCells = new Common.UI.MenuItem({
                caption: me.txtInsert,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [{
                        caption: me.txtShiftRight,
                        value: c_oAscInsertOptions.InsertCellsAndShiftRight
                    },
                    {
                        caption: me.txtShiftDown,
                        value: c_oAscInsertOptions.InsertCellsAndShiftDown
                    },
                    {
                        caption: me.txtRow,
                        value: c_oAscInsertOptions.InsertRows
                    },
                    {
                        caption: me.txtColumn,
                        value: c_oAscInsertOptions.InsertColumns
                    }]
                })
            });
            me.pmiDeleteEntire = new Common.UI.MenuItem({
                caption: me.txtDelete
            });
            me.pmiDeleteCells = new Common.UI.MenuItem({
                caption: me.txtDelete,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [{
                        caption: me.txtShiftLeft,
                        value: c_oAscDeleteOptions.DeleteCellsAndShiftLeft
                    },
                    {
                        caption: me.txtShiftUp,
                        value: c_oAscDeleteOptions.DeleteCellsAndShiftTop
                    },
                    {
                        caption: me.txtRow,
                        value: c_oAscDeleteOptions.DeleteRows
                    },
                    {
                        caption: me.txtColumn,
                        value: c_oAscDeleteOptions.DeleteColumns
                    }]
                })
            });
            me.pmiClear = new Common.UI.MenuItem({
                caption: me.txtClear,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [{
                        caption: me.txtClearAll,
                        value: c_oAscCleanOptions.All
                    },
                    {
                        caption: me.txtClearText,
                        value: c_oAscCleanOptions.Text
                    },
                    {
                        caption: me.txtClearFormat,
                        value: c_oAscCleanOptions.Format
                    },
                    {
                        caption: me.txtClearComments,
                        value: c_oAscCleanOptions.Comments
                    },
                    {
                        caption: me.txtClearHyper,
                        value: c_oAscCleanOptions.Hyperlinks
                    }]
                })
            });
            me.pmiSortCells = new Common.UI.MenuItem({
                caption: me.txtSort,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [{
                        caption: me.txtAscending,
                        value: "ascending"
                    },
                    {
                        caption: me.txtDescending,
                        value: "descending"
                    }]
                })
            });
            me.pmiInsFunction = new Common.UI.MenuItem({
                caption: me.txtFormula
            });
            me.menuAddHyperlink = new Common.UI.MenuItem({
                caption: me.txtInsHyperlink,
                inCell: true
            });
            me.menuEditHyperlink = new Common.UI.MenuItem({
                caption: me.editHyperlinkText,
                inCell: true
            });
            me.menuRemoveHyperlink = new Common.UI.MenuItem({
                caption: me.removeHyperlinkText
            });
            me.menuHyperlink = new Common.UI.MenuItem({
                caption: me.txtInsHyperlink,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [me.menuEditHyperlink, me.menuRemoveHyperlink]
                })
            });
            me.pmiRowHeight = new Common.UI.MenuItem({
                caption: me.txtRowHeight,
                action: "row-height"
            });
            me.pmiColumnWidth = new Common.UI.MenuItem({
                caption: me.txtColumnWidth,
                action: "column-width"
            });
            me.pmiEntireHide = new Common.UI.MenuItem({
                caption: me.txtHide
            });
            me.pmiEntireShow = new Common.UI.MenuItem({
                caption: me.txtShow
            });
            me.pmiAddComment = new Common.UI.MenuItem({
                id: "id-context-menu-item-add-comment",
                caption: me.txtAddComment
            });
            me.pmiCellMenuSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            me.ssMenu = new Common.UI.Menu({
                id: "id-context-menu-cell",
                items: [me.pmiCut, me.pmiCopy, me.pmiPaste, {
                    caption: "--"
                },
                me.pmiInsertEntire, me.pmiInsertCells, me.pmiDeleteEntire, me.pmiDeleteCells, me.pmiClear, me.pmiSortCells, {
                    caption: "--"
                },
                me.pmiAddComment, me.pmiCellMenuSeparator, me.pmiInsFunction, me.menuAddHyperlink, me.menuHyperlink, me.pmiRowHeight, me.pmiColumnWidth, me.pmiEntireHide, me.pmiEntireShow]
            });
            me.mnuGroupImg = new Common.UI.MenuItem({
                caption: this.txtGroup,
                iconCls: "mnu-group",
                type: "group",
                value: "grouping"
            });
            me.mnuUnGroupImg = new Common.UI.MenuItem({
                caption: this.txtUngroup,
                iconCls: "mnu-ungroup",
                type: "group",
                value: "ungrouping"
            });
            me.mnuShapeSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            me.mnuShapeAdvanced = new Common.UI.MenuItem({
                caption: me.advancedShapeText
            });
            me.mnuChartEdit = new Common.UI.MenuItem({
                caption: me.chartText
            });
            me.pmiImgCut = new Common.UI.MenuItem({
                caption: me.txtCut,
                value: "cut"
            });
            me.pmiImgCopy = new Common.UI.MenuItem({
                caption: me.txtCopy,
                value: "copy"
            });
            me.pmiImgPaste = new Common.UI.MenuItem({
                caption: me.txtPaste,
                value: "paste"
            });
            this.imgMenu = new Common.UI.Menu({
                items: [me.pmiImgCut, me.pmiImgCopy, me.pmiImgPaste, {
                    caption: "--"
                },
                {
                    caption: this.textArrangeFront,
                    iconCls: "mnu-arrange-front",
                    type: "arrange",
                    value: c_oAscDrawingLayerType.BringToFront
                },
                {
                    caption: this.textArrangeBack,
                    iconCls: "mnu-arrange-back",
                    type: "arrange",
                    value: c_oAscDrawingLayerType.SendToBack
                },
                {
                    caption: this.textArrangeForward,
                    iconCls: "mnu-arrange-forward",
                    type: "arrange",
                    value: c_oAscDrawingLayerType.BringForward
                },
                {
                    caption: this.textArrangeBackward,
                    iconCls: "mnu-arrange-backward",
                    type: "arrange",
                    value: c_oAscDrawingLayerType.SendBackward
                },
                {
                    caption: "--"
                },
                me.mnuGroupImg, me.mnuUnGroupImg, me.mnuShapeSeparator, me.mnuChartEdit, me.mnuShapeAdvanced]
            });
            this.menuParagraphVAlign = new Common.UI.MenuItem({
                caption: this.vertAlignText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [me.menuParagraphTop = new Common.UI.MenuItem({
                        caption: me.topCellText,
                        checkable: true,
                        toggleGroup: "popupparagraphvalign",
                        value: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                    }), me.menuParagraphCenter = new Common.UI.MenuItem({
                        caption: me.centerCellText,
                        checkable: true,
                        toggleGroup: "popupparagraphvalign",
                        value: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR
                    }), this.menuParagraphBottom = new Common.UI.MenuItem({
                        caption: me.bottomCellText,
                        checkable: true,
                        toggleGroup: "popupparagraphvalign",
                        value: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                    })]
                })
            });
            me.menuAddHyperlinkShape = new Common.UI.MenuItem({
                caption: me.txtInsHyperlink
            });
            me.menuEditHyperlinkShape = new Common.UI.MenuItem({
                caption: me.editHyperlinkText
            });
            me.menuRemoveHyperlinkShape = new Common.UI.MenuItem({
                caption: me.removeHyperlinkText
            });
            me.menuHyperlinkShape = new Common.UI.MenuItem({
                caption: me.txtInsHyperlink,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [me.menuEditHyperlinkShape, me.menuRemoveHyperlinkShape]
                })
            });
            this.pmiTextAdvanced = new Common.UI.MenuItem({
                caption: me.txtTextAdvanced
            });
            me.pmiTextCut = new Common.UI.MenuItem({
                caption: me.txtCut,
                value: "cut"
            });
            me.pmiTextCopy = new Common.UI.MenuItem({
                caption: me.txtCopy,
                value: "copy"
            });
            me.pmiTextPaste = new Common.UI.MenuItem({
                caption: me.txtPaste,
                value: "paste"
            });
            this.textInShapeMenu = new Common.UI.Menu({
                items: [me.pmiTextCut, me.pmiTextCopy, me.pmiTextPaste, {
                    caption: "--"
                },
                me.menuParagraphVAlign, me.menuAddHyperlinkShape, me.menuHyperlinkShape, {
                    caption: "--"
                },
                me.pmiTextAdvanced]
            });
            this.funcMenu = new Common.UI.Menu({
                items: [{
                    caption: "item 1"
                },
                {
                    caption: "item 2"
                },
                {
                    caption: "item 3"
                },
                {
                    caption: "item 4"
                },
                {
                    caption: "item 5"
                }]
            });
            me.fireEvent("createdelayedelements", [me]);
        },
        setMenuItemCommentCaptionMode: function (edit) {
            edit ? this.pmiAddComment.setCaption(this.txtEditComment) : this.pmiAddComment.setCaption(this.txtAddComment);
        },
        setLiveCommenting: function (value) {
            this.isLiveCommenting = value;
        },
        txtSort: "Sort",
        txtAscending: "Ascending",
        txtDescending: "Descending",
        txtFormula: "Insert Function",
        txtInsHyperlink: "Hyperlink",
        txtCut: "Cut",
        txtCopy: "Copy",
        txtPaste: "Paste",
        txtInsert: "Insert",
        txtDelete: "Delete",
        txtClear: "Clear",
        txtClearAll: "All",
        txtClearText: "Text",
        txtClearFormat: "Format",
        txtClearHyper: "Hyperlink",
        txtClearComments: "Comments",
        txtShiftRight: "Shift cells right",
        txtShiftLeft: "Shift cells left",
        txtShiftUp: "Shift cells up",
        txtShiftDown: "Shift cells down",
        txtRow: "Entire Row",
        txtColumn: "Entire Column",
        txtColumnWidth: "Column Width",
        txtRowHeight: "Row Height",
        txtWidth: "Width",
        txtHide: "Hide",
        txtShow: "Show",
        textArrangeFront: "Bring To Front",
        textArrangeBack: "Send To Back",
        textArrangeForward: "Bring Forward",
        textArrangeBackward: "Send Backward",
        txtArrange: "Arrange",
        txtAddComment: "Add Comment",
        txtEditComment: "Edit Comment",
        txtUngroup: "Ungroup",
        txtGroup: "Group",
        topCellText: "Align Top",
        centerCellText: "Align Center",
        bottomCellText: "Align Bottom",
        vertAlignText: "Vertical Alignment",
        txtTextAdvanced: "Text Advanced Settings",
        editHyperlinkText: "Edit Hyperlink",
        removeHyperlinkText: "Remove Hyperlink",
        editChartText: "Edit Data",
        advancedShapeText: "Shape Advanced Settings",
        chartText: "Chart Advanced Settings"
    },
    SSE.Views.DocumentHolder || {}));
});