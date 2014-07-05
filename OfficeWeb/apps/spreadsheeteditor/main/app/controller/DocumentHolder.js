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
 Ext.define("SSE.controller.DocumentHolder", {
    extend: "Ext.app.Controller",
    requires: [],
    views: ["DocumentHolder"],
    uses: ["SSE.view.AutoFilterDialog", "SSE.view.DigitalFilterDialog", "SSE.view.SetValueDialog", "SSE.view.ParagraphSettingsAdvanced", "SSE.view.HyperlinkSettings"],
    refs: [{
        ref: "documentHolder",
        selector: "ssedocumentholder"
    },
    {
        ref: "splitterMainMenu",
        selector: "#main-menu-splitter"
    }],
    init: function () {
        this.tooltips = {
            hyperlink: {},
            comment: {},
            coauth: {
                ttHeight: 20
            }
        };
        this.mouse = {};
        this.popupmenu = false;
        this.control({
            "ssedocumentholder": {
                resize: this._handleDocumentResize,
                afterrender: this._onAfterRender
            },
            "menu[group=menu-document]": {
                show: function () {
                    this.popupmenu = true;
                    if (this.tooltips.comment.editCommentId || this.tooltips.comment.viewCommentId) {
                        this.tooltips.comment.viewCommentId = this.tooltips.comment.editCommentId = this.tooltips.comment.moveCommentId = undefined;
                        this.getController("Common.controller.CommentsPopover").onApiHideComment();
                    }
                },
                hide: function (cnt, eOpt) {
                    this.popupmenu = false;
                    this.getDocumentHolder().fireEvent("editcomplete", this.getDocumentHolder());
                }
            },
            "#view-main-menu": {
                panelbeforeshow: function (fullscreen) {
                    this._isMenuHided = true;
                    if (fullscreen !== true) {
                        this.getSplitterMainMenu().show();
                        this.getDocumentHolder().addCls("left-border");
                        Ext.ComponentQuery.query("#infobox-container-cell-name")[0].addCls("left-border");
                    }
                },
                panelbeforehide: function () {
                    this._isMenuHided = true;
                },
                panelshow: function (panel, fullscreen) {
                    this._isMenuHided = false;
                    this._isFullscreenMenu = fullscreen;
                    if (!fullscreen) {
                        var me = this;
                        me._handleDocumentResize(me.getDocumentHolder(), me.getDocumentHolder().getWidth(), me.getDocumentHolder().getHeight());
                        if (!panel.isSizeInit) {
                            panel.isSizeInit = true;
                            var view = panel.down("dataview");
                            if (view) {
                                var nodes = view.getNodes(),
                                width_parent = panel.getWidth();
                                for (var item in nodes) {
                                    nodes[item].style["width"] = width_parent + "px";
                                }
                            }
                        }
                    }
                },
                panelhide: function (panel, fullscreen) {
                    this._isMenuHided = false;
                    this._isFullscreenMenu = false;
                    if (!fullscreen) {
                        var me = this;
                        me._handleDocumentResize(me.getDocumentHolder(), me.getDocumentHolder().getWidth(), me.getDocumentHolder().getHeight());
                        me.getSplitterMainMenu().hide();
                        me.getDocumentHolder().removeCls("left-border");
                        Ext.ComponentQuery.query("#infobox-container-cell-name")[0].removeCls("left-border");
                    }
                }
            },
            "#cmi-add-comment": {
                click: this._addComment
            },
            "menu[action=insert-cells]": {
                click: this.handleCellInsertMenu
            },
            "menu[action=delete-cells]": {
                click: this.handleCellDeleteMenu
            },
            "#cmi-sort-cells": {
                click: this.handleCellSortMenu
            },
            "#context-menu-cell": {
                click: this.handleCellsMenu
            },
            "#main-menu-splitter": {
                beforedragstart: function (obj, event) {
                    return !event.currentTarget.disabled;
                },
                move: function (obj, x, y) {
                    if (this._isMenuHided) {
                        return;
                    }
                    var jsp_container, width_parent = obj.up("container").down("ssemainmenu").getWidth();
                    if (width_parent > 40) {
                        width_parent -= 40;
                        Ext.ComponentQuery.query("dataview[group=scrollable]").forEach(function (list) {
                            var nodes = list.getNodes();
                            for (var item in nodes) {
                                nodes[item].style["width"] = width_parent + "px";
                            }
                            list.getEl().setWidth(width_parent);
                            jsp_container = list.getEl().down(".jspContainer");
                            if (jsp_container) {
                                jsp_container.setWidth(width_parent);
                                list.getEl().down(".jspPane").setWidth(width_parent);
                            }
                        });
                    }
                }
            },
            "menu[action=setting-hide]": {
                click: function (menu, item) {
                    var current = this.api.asc_getSheetViewSettings();
                    switch (item.action) {
                    case "headers":
                        current.asc_setShowRowColHeaders(item.checked);
                        break;
                    case "lines":
                        current.asc_setShowGridLines(item.checked);
                        break;
                    }
                    this.api.asc_setSheetViewSettings(current);
                }
            },
            "menuitem[group=popupparagraphvalign]": {
                click: this._onParagraphVAlign
            },
            "menuitem[action=image-grouping]": {
                click: function (btn) {
                    this.api[btn.grouping ? "asc_groupGraphicsObjects" : "asc_unGroupGraphicsObjects"]();
                    this.getDocumentHolder().fireEvent("editcomplete", this.getDocumentHolder());
                }
            },
            "menuitem[action=add-hyperlink-shape]": {
                click: this._handleAddHyperlink
            },
            "menuitem[action=remove-hyperlink-shape]": {
                click: this._handleRemoveHyperlink
            },
            "menuitem[action=remove-hyperlink]": {
                click: this._handleRemoveHyperlink
            },
            "menuitem[action=text-advanced]": {
                click: this._handleTextAdvanced
            }
        });
        this.wrapEvents = {
            apiShowComment: Ext.bind(this.onApiShowComment, this),
            apiHideComment: Ext.bind(this.onApiHideComment, this)
        };
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onMouseMove", Ext.bind(this.onApiMouseMove, this));
        this.api.asc_registerCallback("asc_onHideComment", this.wrapEvents.apiHideComment);
        this.api.asc_registerCallback("asc_onShowComment", this.wrapEvents.apiShowComment);
        this.api.asc_registerCallback("asc_onHyperlinkClick", Ext.bind(this.onHyperlinkClick, this));
        this.api.asc_registerCallback("asc_onSetAFDialog", Ext.bind(this.onAutofilter, this));
        this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
        return this;
    },
    resetApi: function (api) {
        this.api.asc_unregisterCallback("asc_onHideComment", this.wrapEvents.apiHideComment);
        this.api.asc_unregisterCallback("asc_onShowComment", this.wrapEvents.apiShowComment);
        this.api.asc_registerCallback("asc_onHideComment", this.wrapEvents.apiHideComment);
        this.api.asc_registerCallback("asc_onShowComment", this.wrapEvents.apiShowComment);
    },
    onCoAuthoringDisconnect: function () {
        this.permissions.isEdit = false;
    },
    loadConfig: function (data) {
        this.editorConfig = data.config;
    },
    setMode: function (m) {
        this.permissions = m;
    },
    onApiMouseMove: function (dataarray) {
        if (!this._isFullscreenMenu && dataarray.length) {
            var index_hyperlink, index_comments, index_locked;
            for (var i = dataarray.length; i > 0; i--) {
                switch (dataarray[i - 1].asc_getType()) {
                case c_oAscMouseMoveType.Hyperlink:
                    index_hyperlink = i;
                    break;
                case c_oAscMouseMoveType.Comment:
                    index_comments = i;
                    break;
                case c_oAscMouseMoveType.LockedObject:
                    index_locked = i;
                    break;
                }
            }
            var me = this;
            if (index_hyperlink) {
                var data = dataarray[index_hyperlink - 1];
                var props = data.asc_getHyperlink();
                if (props.asc_getType() == c_oAscHyperlinkType.WebLink) {
                    var linkstr = props.asc_getTooltip();
                    if (linkstr) {
                        linkstr = Ext.String.htmlEncode(linkstr) + "<br><b>" + me.textCtrlClick + "</b>";
                    } else {
                        linkstr = props.asc_getHyperlinkUrl() + "<br><b>" + me.textCtrlClick + "</b>";
                    }
                } else {
                    linkstr = props.asc_getTooltip() || (props.asc_getSheet() + "!" + props.asc_getRange());
                }
                if (me.tooltips.hyperlink.ref && me.tooltips.hyperlink.ref.isVisible()) {
                    if (me.tooltips.hyperlink.text != linkstr) {
                        me.tooltips.hyperlink.ref.close();
                    }
                }
                if (!me.tooltips.hyperlink.ref || !me.tooltips.hyperlink.ref.isVisible()) {
                    me.tooltips.hyperlink.text = linkstr;
                    me.tooltips.hyperlink.ref = Ext.create("Ext.tip.ToolTip", {
                        closeAction: "destroy",
                        dismissDelay: 2000,
                        html: linkstr,
                        listeners: {
                            beforeclose: function () {
                                me.tooltips.hyperlink.ref = undefined;
                                me.tooltips.hyperlink.text = "";
                            },
                            hide: function () {
                                me.tooltips.hyperlink.ref = undefined;
                                me.tooltips.hyperlink.text = "";
                            }
                        }
                    });
                    me.tooltips.hyperlink.ref.show();
                    var xy = me.tooltips.hyperlink.ref.getEl().getAlignToXY("editor_sdk", "tl?", [data.asc_getX() + 4, data.asc_getY() + 6]);
                    me.tooltips.hyperlink.ref.showAt(xy);
                }
            }
            if (me.permissions.isEdit) {
                if (index_comments && !this.popupmenu) {
                    data = dataarray[index_comments - 1];
                    if (!me.tooltips.comment.editCommentId && me.tooltips.comment.moveCommentId != data.asc_getCommentIndexes()[0]) {
                        me.tooltips.comment.moveCommentId = data.asc_getCommentIndexes()[0];
                        if (me.tooltips.comment.moveCommentTimer) {
                            clearTimeout(me.tooltips.comment.moveCommentTimer);
                        }
                        var idxs = data.asc_getCommentIndexes(),
                        x = data.asc_getX(),
                        y = data.asc_getY(),
                        leftx = data.asc_getReverseX();
                        me.tooltips.comment.moveCommentTimer = setTimeout(function () {
                            if (me.tooltips.comment.moveCommentId && !me.tooltips.comment.editCommentId) {
                                me.tooltips.comment.viewCommentId = me.tooltips.comment.moveCommentId;
                                me.getController("Common.controller.CommentsPopover").onApiShowComment(idxs, x, y, leftx, false);
                            }
                        },
                        400);
                    }
                } else {
                    me.tooltips.comment.moveCommentId = undefined;
                    if (me.tooltips.comment.viewCommentId != undefined) {
                        me.tooltips.comment = {};
                        this.getController("Common.controller.CommentsPopover").onApiHideComment();
                    }
                }
                if (index_locked) {
                    data = dataarray[index_locked - 1];
                    if (!me.tooltips.coauth.XY) {
                        me._handleDocumentResize(me.getDocumentHolder(), me.getDocumentHolder().getWidth(), me.getDocumentHolder().getHeight());
                    }
                    if (me.tooltips.coauth.x_point != data.asc_getX() || me.tooltips.coauth.y_point != data.asc_getY()) {
                        me.hideTips();
                        me.tooltips.coauth.x_point = data.asc_getX();
                        me.tooltips.coauth.y_point = data.asc_getY();
                        var src = Ext.DomHelper.append(Ext.getBody(), {
                            tag: "div",
                            cls: "username-tip"
                        },
                        true);
                        src.applyStyles({
                            height: me.tooltips.coauth.ttHeight + "px",
                            position: "absolute",
                            zIndex: "19000",
                            visibility: "visible"
                        });
                        me.tooltips.coauth.ref = src;
                        var is_sheet_lock = data.asc_getLockedObjectType() == c_oAscMouseMoveLockedObjectType.Sheet || data.asc_getLockedObjectType() == c_oAscMouseMoveLockedObjectType.TableProperties;
                        var showPoint = [me.tooltips.coauth.x_point + me.tooltips.coauth.XY[0], me.tooltips.coauth.y_point + me.tooltips.coauth.XY[1]]; ! is_sheet_lock && (showPoint[0] = me.tooltips.coauth.bodyWidth - showPoint[0]);
                        if (showPoint[1] > me.tooltips.coauth.XY[1] && showPoint[1] + me.tooltips.coauth.ttHeight < me.tooltips.coauth.XY[1] + me.tooltips.coauth.apiHeight) {
                            Ext.DomHelper.overwrite(src, me._getUserName(data.asc_getUserId()));
                            src.applyStyles({
                                visibility: "visible"
                            });
                            is_sheet_lock && src.applyStyles({
                                top: showPoint[1] + "px",
                                left: showPoint[0] + "px"
                            }) || src.applyStyles({
                                top: showPoint[1] + "px",
                                right: showPoint[0] + "px"
                            });
                        }
                    }
                } else {
                    me.hideTips();
                }
            }
        }
    },
    onApiHideComment: function () {
        this.tooltips.comment.viewCommentId = this.tooltips.comment.editCommentId = this.tooltips.comment.moveCommentId = undefined;
    },
    onApiShowComment: function (commentId, posX, posY, leftx, isnew) {
        commentId = commentId[0];
        if (this.tooltips.comment.viewCommentId) {
            this.tooltips.comment.viewCommentId = undefined;
            this.tooltips.comment.editCommentId = commentId;
            this.getController("Common.controller.CommentsPopover").makeCommentEditable(commentId);
        } else {
            if (this.tooltips.comment.editCommentId == commentId) {} else {
                this.tooltips.comment.editCommentId = commentId;
                if (isnew) {
                    if (!this.getDocumentHolder().isLiveCommenting) {
                        var mainMenuCmp = Ext.getCmp("view-main-menu");
                        mainMenuCmp && mainMenuCmp.selectMenu("menuComments");
                    }
                    var popupComment = Ext.ComponentQuery.query("commoncommentspopover");
                    if (popupComment.length) {
                        popupComment = popupComment[0];
                        popupComment.fireTransformToAdd();
                        var dataView = popupComment.query("dataview")[0];
                        if (dataView) {
                            dataView.on("viewready", function () {
                                popupComment.fireTransformToAdd();
                            },
                            this);
                        }
                    }
                }
            }
        }
    },
    onHyperlinkClick: function (url) {
        var newDocumentPage = window.open(url, "_blank");
        if (newDocumentPage) {
            newDocumentPage.focus();
        }
    },
    _getUserName: function (id) {
        var usersStore = Ext.getStore("Common.store.Users");
        if (usersStore) {
            var rec = usersStore.findRecord("id", id);
            if (rec) {
                return Ext.String.ellipsis(Ext.String.htmlEncode(rec.get("username")), 25, true);
            }
        }
        return this.guestText;
    },
    hideTips: function () {
        if (this.tooltips.coauth.ref) {
            Ext.destroy(this.tooltips.coauth.ref);
            this.tooltips.coauth.ref = undefined;
            this.tooltips.coauth.x_point = undefined;
            this.tooltips.coauth.y_point = undefined;
        }
    },
    _handleDocumentResize: function (obj, width, height) {
        var me = this;
        setTimeout(function () {
            me.tooltips.coauth.XY = obj.getPosition();
            me.tooltips.coauth.apiHeight = height;
            me.tooltips.coauth.bodyWidth = Ext.getBody().getWidth();
        },
        10);
    },
    _onAfterRender: function (ct) {
        ct.addCls("top-border");
        document.body.onmousedown = Ext.bind(this._handleRightDown, this);
        document.body.onmouseup = Ext.bind(this._handleRightUp, this);
        var meEl = ct.getEl();
        meEl.on({
            contextmenu: {
                fn: this._showObjectMenu,
                preventDefault: true,
                scope: this
            },
            mousewheel: this._handleDocumentWheel,
            keydown: this._handleKeyDown,
            click: function (event, el) {
                if (this.api) {
                    this.api.isTextAreaBlur = false;
                    if (! (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement)) {
                        this.getDocumentHolder().focus(false);
                    }
                }
            },
            scope: this
        });
        Ext.getDoc().on("mousewheel", this._handleDocumentWheel, this);
        Ext.getDoc().on("keydown", this._handleDocumentKeyDown, this);
    },
    _handleDocumentWheel: function (event) {
        if (this.api) {
            var delta = event.getWheelDelta();
            if (event.ctrlKey) {
                var f = this.api.asc_getZoom();
                if (delta < 0) {
                    f -= 0.1;
                    if (! (f < 0.5)) {
                        this.api.asc_setZoom(f);
                    }
                } else {
                    if (delta > 0) {
                        f += 0.1;
                        if (f > 0 && !(f > 2)) {
                            this.api.asc_setZoom(f);
                        }
                    }
                }
                event.stopEvent();
            }
        }
    },
    _handleDocumentKeyDown: function (event) {
        if (this.api) {
            var key = event.getKey();
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                if (key === event.NUM_PLUS || (Ext.isOpera && key == 43)) {
                    if (!this.api.isCellEdited) {
                        var f = this.api.asc_getZoom() + 0.1;
                        if (f > 0 && !(f > 2)) {
                            this.api.asc_setZoom(f);
                        }
                        event.stopEvent();
                        return false;
                    }
                } else {
                    if (key === event.NUM_MINUS || (Ext.isOpera && key == 45)) {
                        if (!this.api.isCellEdited) {
                            f = this.api.asc_getZoom() - 0.1;
                            if (! (f < 0.5)) {
                                this.api.asc_setZoom(f);
                            }
                            event.stopEvent();
                            return false;
                        }
                    }
                }
            }
        }
    },
    _handleRightDown: function (event, docElement, eOpts) {
        event.button == 0 && (this.mouse.isLeftButtonDown = true);
        event.button == 2 && (this.mouse.isRightButtonDown = true);
    },
    _handleRightUp: function (event, docElement, eOpts) {
        event.button == 0 && (this.mouse.isLeftButtonDown = false);
    },
    _handleKeyDown: function (event, docElement, eOpts) {
        if (event.getKey() == event.F10 && event.shiftKey) {
            event.stopEvent();
            this._showObjectMenu(event, docElement, eOpts);
        }
    },
    _showObjectMenu: function (event, docElement, eOpts) {
        if (this.api && this.permissions.isEdit && !this.mouse.isLeftButtonDown) {
            var iscellmenu, isrowmenu, iscolmenu, isallmenu, ischartmenu, isimagemenu, istextshapemenu;
            var holder = this.getDocumentHolder();
            var cellinfo = this.api.asc_getCellInfo();
            var seltype = cellinfo.asc_getFlags().asc_getSelectionType();
            switch (seltype) {
            case c_oAscSelectionType.RangeCells:
                iscellmenu = true;
                break;
            case c_oAscSelectionType.RangeRow:
                isrowmenu = true;
                break;
            case c_oAscSelectionType.RangeCol:
                iscolmenu = true;
                break;
            case c_oAscSelectionType.RangeMax:
                isallmenu = true;
                break;
            case c_oAscSelectionType.RangeImage:
                isimagemenu = true;
                break;
            case c_oAscSelectionType.RangeShape:
                isimagemenu = true;
                break;
            case c_oAscSelectionType.RangeShapeText:
                istextshapemenu = true;
                break;
            }
            if (isimagemenu) {
                holder.mnuUnGroupImg.setDisabled(!this.api.asc_canUnGroupGraphicsObjects());
                holder.mnuGroupImg.setDisabled(!this.api.asc_canGroupGraphicsObjects());
                this._showPopupMenu(holder.imgMenu, {},
                event, docElement, eOpts);
            } else {
                if (istextshapemenu) {
                    holder.pmiTextAdvanced.textInfo = undefined;
                    var SelectedObjects = this.api.asc_getGraphicObjectProps();
                    for (var i = 0; i < SelectedObjects.length; i++) {
                        var elType = SelectedObjects[i].asc_getObjectType();
                        if (elType == c_oAscTypeSelectElement.Image) {
                            var value = SelectedObjects[i].asc_getObjectValue();
                            var align = value.asc_getVerticalTextAlign();
                            holder.menuParagraphTop.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_TOP);
                            holder.menuParagraphCenter.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_CTR);
                            holder.menuParagraphBottom.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM);
                        } else {
                            if (elType == c_oAscTypeSelectElement.Paragraph) {
                                holder.pmiTextAdvanced.textInfo = SelectedObjects[i].asc_getObjectValue();
                            }
                        }
                    }
                    var hyperinfo = cellinfo.asc_getHyperlink();
                    holder.pmiInsHyperlinkShape.setVisible(this.api.asc_canAddShapeHyperlink() !== false);
                    holder.pmiInsHyperlinkShape.cellInfo = cellinfo;
                    holder.pmiInsHyperlinkShape.setText((hyperinfo) ? holder.editHyperlinkText : holder.txtInsHyperlink);
                    holder.pmiRemoveHyperlinkShape.setVisible(hyperinfo !== undefined && hyperinfo !== null);
                    holder.pmiTextAdvanced.setVisible(holder.pmiTextAdvanced.textInfo !== undefined);
                    this._showPopupMenu(holder.textInShapeMenu, {},
                    event, docElement, eOpts);
                } else {
                    if ((seltype !== c_oAscSelectionType.RangeImage && seltype !== c_oAscSelectionType.RangeShape && seltype !== c_oAscSelectionType.RangeShapeText)) {
                        holder.pmiInsertEntire.setVisible(isrowmenu || iscolmenu);
                        holder.pmiDeleteEntire.setVisible(isrowmenu || iscolmenu);
                        holder.pmiInsertCells.setVisible(iscellmenu);
                        holder.pmiDeleteCells.setVisible(iscellmenu);
                        holder.pmiSortCells.setVisible(iscellmenu || isallmenu);
                        holder.pmiInsFunction.setVisible(iscellmenu);
                        holder.pmiInsHyperlink.setVisible(iscellmenu);
                        holder.pmiDelHyperlink.setVisible(false);
                        if (iscellmenu) {
                            if (cellinfo.asc_getHyperlink()) {
                                holder.pmiInsHyperlink.setText(holder.editHyperlinkText);
                                holder.pmiDelHyperlink.setVisible(true);
                            } else {
                                holder.pmiInsHyperlink.setText(holder.txtInsHyperlink);
                            }
                        }
                        holder.pmiRowHeight.setVisible(isrowmenu || isallmenu);
                        holder.pmiColumnWidth.setVisible(iscolmenu || isallmenu);
                        holder.pmiEntireHide.setVisible(iscolmenu || isrowmenu);
                        holder.pmiEntireShow.setVisible(iscolmenu || isrowmenu);
                        holder.ssMenu.items.items[10].setVisible(iscellmenu && this.permissions.canCoAuthoring);
                        holder.pmiAddComment.setVisible(iscellmenu && this.permissions.canCoAuthoring);
                        holder.pmiCellMenuSeparator.setVisible(iscellmenu || isrowmenu || iscolmenu || isallmenu);
                        holder.pmiEntireHide.isrowmenu = isrowmenu;
                        holder.pmiEntireShow.isrowmenu = isrowmenu;
                        this._showPopupMenu(holder.ssMenu, {},
                        event, docElement, eOpts);
                    }
                }
            }
        }
        this.mouse.isRightButtonDown = false;
    },
    _showPopupMenu: function (menu, value, event, docElement, eOpts) {
        if (Ext.isDefined(menu)) {
            Ext.menu.Manager.hideAll();
            var showPoint = event.getXY();
            if (!this.mouse.isRightButtonDown) {
                var coord = this.api.asc_getActiveCellCoord();
                var offset = $("#" + this.getDocumentHolder().id).offset();
                showPoint[0] = coord.asc_getX() + coord.asc_getWidth() + offset.left;
                showPoint[1] = (coord.asc_getY() < 0 ? 0 : coord.asc_getY()) + coord.asc_getHeight() + offset.top;
            } else {}
            if (Ext.isFunction(menu.initMenu)) {
                menu.initMenu(value);
            }
            menu.showAt(event.getXY());
        }
    },
    _addComment: function (item, e, eOpt) {
        var ascCommentData = new asc_CCommentData();
        var now = new Date(),
        timeZoneOffsetInMs = now.getTimezoneOffset() * 60000;
        if (ascCommentData) {
            ascCommentData.asc_putText("");
            ascCommentData.asc_putTime((now.getTime() - timeZoneOffsetInMs).toString());
            ascCommentData.asc_putUserId(this.editorConfig.user.id);
            ascCommentData.asc_putUserName(this.editorConfig.user.name);
            ascCommentData.asc_putDocumentFlag(false);
            ascCommentData.asc_putSolved(false);
            this.api.asc_addComment(ascCommentData);
        }
    },
    handleCellsMenu: function (menu, item) {
        if (item) {
            if (item.action == "insert-entire") {
                switch (this.api.asc_getCellInfo().asc_getFlags().asc_getSelectionType()) {
                case c_oAscSelectionType.RangeRow:
                    this.api.asc_insertCells(c_oAscInsertOptions.InsertRows);
                    break;
                case c_oAscSelectionType.RangeCol:
                    this.api.asc_insertCells(c_oAscInsertOptions.InsertColumns);
                    break;
                }
            } else {
                if (item.action == "delete-entire") {
                    switch (this.api.asc_getCellInfo().asc_getFlags().asc_getSelectionType()) {
                    case c_oAscSelectionType.RangeRow:
                        this.api.asc_deleteCells(c_oAscDeleteOptions.DeleteRows);
                        break;
                    case c_oAscSelectionType.RangeCol:
                        this.api.asc_deleteCells(c_oAscDeleteOptions.DeleteColumns);
                        break;
                    }
                } else {
                    if (item.action == "row-height" || item.action == "column-width") {
                        var me = this;
                        var win = Ext.widget("setvaluedialog", {
                            title: item.text,
                            startvalue: item.action == "row-height" ? me.api.asc_getRowHeight() : me.api.asc_getColumnWidth(),
                            maxvalue: 409,
                            valuecaption: item.action == "row-height" ? this.txtHeight : this.txtWidth
                        });
                        win.addListener("onmodalresult", function (o, mr, v) {
                            if (mr) {
                                item.action == "row-height" ? me.api.asc_setRowHeight(v) : me.api.asc_setColumnWidth(v);
                            }
                            me.getDocumentHolder().fireEvent("editcomplete", me.getDocumentHolder());
                        },
                        me, {
                            single: true
                        });
                        win.show();
                    } else {
                        if (item.action == "clear-all") {
                            this.api.asc_emptyCells(c_oAscCleanOptions.All);
                        }
                    }
                }
            }
        }
    },
    handleCellInsertMenu: function (menu, item) {
        this.api.asc_insertCells(item.kind);
        this.getDocumentHolder().fireEvent("editcomplete", this.getDocumentHolder());
    },
    handleCellDeleteMenu: function (menu, item) {
        this.api.asc_deleteCells(item.kind);
        this.getDocumentHolder().fireEvent("editcomplete", this.getDocumentHolder());
    },
    handleCellSortMenu: function (menu, item) {
        this.api.asc_sortColFilter(item.direction, "");
    },
    onAutofilter: function (config) {
        var me = this;
        var dlgFilter = Ext.widget("sseautofilterdialog", {});
        dlgFilter.addListener("onmodalresult", function (obj, mr, s) {
            if (mr == 1) {
                var sett = obj.getSettings();
                me.api.asc_applyAutoFilter("mainFilter", sett);
            } else {
                if (mr == 2) {
                    dlgCustom.show();
                    return;
                } else {
                    if (mr == 3) {
                        me.api.asc_sortColFilter(s, config.asc_getCellId());
                    }
                }
            }
            me.mouse.isLeftButtonDown = me.mouse.isRightButtonDown = false;
            me.getDocumentHolder().fireEvent("editcomplete", me.getDocumentHolder());
        },
        this);
        dlgFilter.setSettings(config);
        dlgFilter.show();
        var dlgCustom = Ext.widget("ssedigitalfilterdialog", {});
        dlgCustom.setSettings(config);
        dlgCustom.addListener("onmodalresult", function (obj, mr, s) {
            if (mr == 1) {
                me.api.asc_applyAutoFilter("digitalFilter", obj.getSettings());
            }
            me.mouse.isLeftButtonDown = me.mouse.isRightButtonDown = false;
            me.getDocumentHolder().fireEvent("editcomplete", me.getDocumentHolder());
        },
        this);
    },
    onCellChanged: function (text, cursorPosition, isFormula, formulaPos, formulaName) {
        if (isFormula && text.length > 1) {
            var menu = this.getDocumentHolder().funcMenu;
            var arr = dlgFormulas.arrayFormula.filter(function (item) {
                return new RegExp("^" + text.substr(1), "i").test(item);
            });
            if (arr && arr.length) {
                var i = -1;
                while (++i < 5) {
                    if (arr[i]) {
                        menu.items.getAt(i).setText(arr[i]);
                        menu.items.getAt(i).show();
                    } else {
                        menu.items.getAt(i).hide();
                    }
                }
                var coord = this.api.asc_getActiveCellCoord();
                var xy = menu.show().getEl().getAlignToXY("editor_sdk", "tl?", [coord.asc_getX(), coord.asc_getY() + coord.asc_getHeight() + 4]);
                menu.showAt(xy);
            }
        }
        console.log("onCellChanged: " + text + ", " + cursorPosition + ", " + isFormula + ", " + formulaPos + ", " + formulaName);
    },
    _onParagraphVAlign: function (item, e) {
        var properties = new Asc.asc_CImgProperty();
        properties.asc_putVerticalTextAlign(item.valign);
        this.api.asc_setGraphicObjectProps(properties);
    },
    _handleAddHyperlink: function (item) {
        var me = this;
        var win, props;
        if (me.api && item) {
            var wc = me.api.asc_getWorksheetsCount(),
            i = -1;
            var items = [];
            while (++i < wc) {
                if (!this.api.asc_isWorksheetHidden(i)) {
                    items.push([me.api.asc_getWorksheetName(i)]);
                }
            }
            win = Ext.widget("ssehyperlinksettings", {
                sheets: items
            });
            win.setSettings(item.cellInfo.asc_getHyperlink(), item.cellInfo.asc_getText(), item.cellInfo.asc_getFlags().asc_getLockText());
        }
        if (win) {
            win.addListener("onmodalresult", function (o, mr) {
                if (mr == 1) {
                    props = win.getSettings();
                    me.api.asc_insertHyperlink(props);
                }
                me.getDocumentHolder().fireEvent("editcomplete", me.getDocumentHolder());
            },
            false);
            win.show();
        }
    },
    _handleRemoveHyperlink: function () {
        if (this.api) {
            this.api.asc_removeHyperlink();
            this.getDocumentHolder().fireEvent("editcomplete", this.getDocumentHolder());
        }
    },
    _handleTextAdvanced: function (item) {
        var me = this;
        var win;
        if (me.api && item) {
            win = Ext.create("SSE.view.ParagraphSettingsAdvanced");
            win.updateMetricUnit();
            win.setSettings({
                paragraphProps: item.textInfo,
                api: me.api
            });
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                if (mr == 1 && s) {
                    me.api.asc_setGraphicObjectProps(s.paragraphProps);
                }
            },
            me), false);
            win.addListener("close", function () {
                me.getDocumentHolder().fireEvent("editcomplete", me.getDocumentHolder());
            },
            false);
            win.show();
        }
    },
    guestText: "Guest",
    textCtrlClick: "Press CTRL and click link",
    txtRowHeight: "Row Height",
    txtHeight: "Height",
    txtWidth: "Width",
    tipIsLocked: "This element is being edited by another user."
});