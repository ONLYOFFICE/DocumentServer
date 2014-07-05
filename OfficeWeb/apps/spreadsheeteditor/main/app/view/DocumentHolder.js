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
 Ext.define("SSE.view.DocumentHolder", {
    extend: "Ext.container.Container",
    alias: "widget.ssedocumentholder",
    cls: "sse-documentholder",
    uses: ["Ext.menu.Menu", "Ext.menu.Manager", "SSE.view.FormulaDialog", "Common.plugin.MenuExpand"],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    layout: "fit",
    initComponent: function () {
        var me = this;
        this.setApi = function (o) {
            me.api = o;
            return me;
        };
        var value = window.localStorage.getItem("sse-settings-livecomment");
        me.isLiveCommenting = !(value !== null && parseInt(value) == 0);
        me.addEvents("editcomplete");
        me.callParent(arguments);
    },
    createDelayedElements: function () {
        var me = this;
        function fixSubmenuPosition(submenu) {
            if (!submenu.getPosition()[0]) {
                if (submenu.floatParent) {
                    var xy = submenu.el.getAlignToXY(submenu.parentItem.getEl(), "tl-tr?"),
                    region = submenu.floatParent.getTargetEl().getViewRegion();
                    submenu.setPosition([xy[0] - region.x, xy[1] - region.y]);
                }
            }
        }
        this.pmiInsertEntire = Ext.widget("menuitem", {
            action: "insert-entire",
            text: me.txtInsert
        });
        this.pmiInsertCells = Ext.widget("menuitem", {
            text: me.txtInsert,
            hideOnClick: false,
            menu: {
                action: "insert-cells",
                showSeparator: false,
                bodyCls: "no-icons",
                items: [{
                    text: me.txtShiftRight,
                    kind: c_oAscInsertOptions.InsertCellsAndShiftRight
                },
                {
                    text: me.txtShiftDown,
                    kind: c_oAscInsertOptions.InsertCellsAndShiftDown
                },
                {
                    text: me.txtRow,
                    kind: c_oAscInsertOptions.InsertRows
                },
                {
                    text: me.txtColumn,
                    kind: c_oAscInsertOptions.InsertColumns
                }],
                plugins: [{
                    ptype: "menuexpand"
                }],
                listeners: {
                    show: fixSubmenuPosition
                }
            }
        });
        this.pmiDeleteEntire = Ext.widget("menuitem", {
            action: "delete-entire",
            text: me.txtDelete
        });
        this.pmiDeleteCells = Ext.widget("menuitem", {
            text: me.txtDelete,
            hideOnClick: false,
            menu: {
                action: "delete-cells",
                showSeparator: false,
                bodyCls: "no-icons",
                items: [{
                    text: me.txtShiftLeft,
                    kind: c_oAscDeleteOptions.DeleteCellsAndShiftLeft
                },
                {
                    text: me.txtShiftUp,
                    kind: c_oAscDeleteOptions.DeleteCellsAndShiftTop
                },
                {
                    text: me.txtRow,
                    kind: c_oAscDeleteOptions.DeleteRows
                },
                {
                    text: me.txtColumn,
                    kind: c_oAscDeleteOptions.DeleteColumns
                }],
                plugins: [{
                    ptype: "menuexpand"
                }],
                listeners: {
                    show: fixSubmenuPosition
                }
            }
        });
        this.pmiSortCells = Ext.widget("menuitem", {
            text: me.txtSort,
            hideOnClick: false,
            menu: {
                id: "cmi-sort-cells",
                bodyCls: "no-icons",
                showSeparator: false,
                items: [{
                    text: me.txtAscending,
                    direction: "descending"
                },
                {
                    text: me.txtDescending,
                    direction: "ascending"
                }],
                plugins: [{
                    ptype: "menuexpand"
                }],
                listeners: {
                    show: fixSubmenuPosition
                }
            }
        });
        this.pmiInsFunction = Ext.widget("menuitem", {
            text: me.txtFormula,
            listeners: {
                click: function (item) {
                    dlgFormulas.addListener("onmodalresult", function (o, mr, s) {
                        me.fireEvent("editcomplete", me);
                    },
                    me, {
                        single: true
                    });
                    dlgFormulas.show();
                }
            }
        });
        this.pmiInsHyperlink = Ext.widget("menuitem", {
            action: "insert-hyperlink",
            text: me.txtInsHyperlink
        });
        this.pmiDelHyperlink = Ext.widget("menuitem", {
            action: "remove-hyperlink",
            text: me.removeHyperlinkText
        });
        this.pmiRowHeight = Ext.widget("menuitem", {
            action: "row-height",
            text: this.txtRowHeight
        });
        this.pmiColumnWidth = Ext.widget("menuitem", {
            action: "column-width",
            text: this.txtColumnWidth
        });
        this.pmiEntireHide = Ext.widget("menuitem", {
            text: this.txtHide,
            handler: function (item, event) {
                me.api[item.isrowmenu ? "asc_hideRows" : "asc_hideColumns"]();
            }
        });
        this.pmiEntireShow = Ext.widget("menuitem", {
            text: this.txtShow,
            handler: function (item, event) {
                me.api[item.isrowmenu ? "asc_showRows" : "asc_showColumns"]();
            }
        });
        this.pmiAddComment = Ext.widget("menuitem", {
            id: "cmi-add-comment",
            text: this.txtAddComment
        });
        this.pmiCellMenuSeparator = Ext.widget("menuseparator");
        this.ssMenu = Ext.widget("menu", {
            id: "context-menu-cell",
            showSeparator: false,
            bodyCls: "no-icons",
            group: "menu-document",
            items: [{
                text: this.txtCut,
                group: "copy-paste",
                action: "cut"
            },
            {
                text: this.txtCopy,
                group: "copy-paste",
                action: "copy"
            },
            {
                text: this.txtPaste,
                group: "copy-paste",
                action: "paste"
            },
            {
                xtype: "menuseparator"
            },
            this.pmiInsertEntire, this.pmiInsertCells, this.pmiDeleteEntire, this.pmiDeleteCells, {
                action: "clear-all",
                text: me.txtClear
            },
            this.pmiSortCells, {
                xtype: "menuseparator"
            },
            this.pmiAddComment, this.pmiCellMenuSeparator, this.pmiInsFunction, this.pmiInsHyperlink, this.pmiDelHyperlink, this.pmiRowHeight, this.pmiColumnWidth, this.pmiEntireHide, this.pmiEntireShow],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        this.mnuGroupImg = Ext.create("Ext.menu.Item", {
            iconCls: "mnu-icon-item mnu-group",
            text: this.txtGroup,
            action: "image-grouping",
            grouping: true
        });
        this.mnuUnGroupImg = Ext.create("Ext.menu.Item", {
            iconCls: "mnu-icon-item mnu-ungroup",
            text: this.txtUngroup,
            action: "image-grouping",
            grouping: false
        });
        this.imgMenu = Ext.widget("menu", {
            showSeparator: false,
            group: "menu-document",
            listeners: {
                click: function (menu, item) {
                    if (item) {
                        me.api.asc_setSelectedDrawingObjectLayer(item.arrange);
                    }
                    me.fireEvent("editcomplete", me);
                }
            },
            items: [{
                iconCls: "mnu-icon-item mnu-arrange-front",
                text: this.textArrangeFront,
                arrange: c_oAscDrawingLayerType.BringToFront
            },
            {
                iconCls: "mnu-icon-item mnu-arrange-back",
                text: this.textArrangeBack,
                arrange: c_oAscDrawingLayerType.SendToBack
            },
            {
                iconCls: "mnu-icon-item mnu-arrange-forward",
                text: this.textArrangeForward,
                arrange: c_oAscDrawingLayerType.BringForward
            },
            {
                iconCls: "mnu-icon-item mnu-arrange-backward",
                text: this.textArrangeBackward,
                arrange: c_oAscDrawingLayerType.SendBackward
            },
            {
                xtype: "menuseparator"
            },
            this.mnuGroupImg, this.mnuUnGroupImg]
        });
        this.menuParagraphVAlign = Ext.widget("menuitem", {
            text: this.vertAlignText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [this.menuParagraphTop = Ext.widget("menucheckitem", {
                    text: this.topCellText,
                    checked: false,
                    group: "popupparagraphvalign",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                }), this.menuParagraphCenter = Ext.widget("menucheckitem", {
                    text: this.centerCellText,
                    checked: false,
                    group: "popupparagraphvalign",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR
                }), this.menuParagraphBottom = Ext.widget("menucheckitem", {
                    text: this.bottomCellText,
                    checked: false,
                    group: "popupparagraphvalign",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                })],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        this.pmiInsHyperlinkShape = Ext.widget("menuitem", {
            text: me.txtInsHyperlink,
            action: "add-hyperlink-shape"
        });
        this.pmiRemoveHyperlinkShape = Ext.widget("menuitem", {
            text: me.removeHyperlinkText,
            action: "remove-hyperlink-shape"
        });
        this.pmiTextAdvanced = Ext.widget("menuitem", {
            text: me.txtTextAdvanced,
            action: "text-advanced"
        });
        this.textInShapeMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            group: "menu-document",
            items: [this.menuParagraphVAlign, this.pmiInsHyperlinkShape, this.pmiRemoveHyperlinkShape, {
                xtype: "menuseparator"
            },
            this.pmiTextAdvanced]
        });
        this.funcMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            group: "menu-document",
            items: [{
                text: "item 1"
            },
            {
                text: "item 2"
            },
            {
                text: "item 3"
            },
            {
                text: "item 4"
            },
            {
                text: "item 5"
            }]
        });
    },
    setLiveCommenting: function (value) {
        this.isLiveCommenting = value;
    },
    txtSort: "Sort",
    txtAscending: "Ascending",
    txtDescending: "Descending",
    txtFormula: "Insert Function",
    txtInsHyperlink: "Add Hyperlink",
    txtCut: "Cut",
    txtCopy: "Copy",
    txtPaste: "Paste",
    txtInsert: "Insert",
    txtDelete: "Delete",
    txtFilter: "Filter",
    txtClear: "Clear All",
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
    txtUngroup: "Ungroup",
    txtGroup: "Group",
    topCellText: "Align Top",
    centerCellText: "Align Center",
    bottomCellText: "Align Bottom",
    vertAlignText: "Vertical Alignment",
    txtTextAdvanced: "Text Advanced Settings",
    editHyperlinkText: "Edit Hyperlink",
    removeHyperlinkText: "Remove Hyperlink"
});