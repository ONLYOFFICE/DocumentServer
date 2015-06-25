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
 define(["core", "common/main/lib/util/utils", "common/main/lib/view/CopyWarningDialog", "spreadsheeteditor/main/app/view/DocumentHolder", "spreadsheeteditor/main/app/view/HyperlinkSettingsDialog", "spreadsheeteditor/main/app/view/ParagraphSettingsAdvanced", "spreadsheeteditor/main/app/view/SetValueDialog", "spreadsheeteditor/main/app/view/AutoFilterDialog"], function () {
    SSE.Controllers.DocumentHolder = Backbone.Controller.extend(_.extend({
        models: [],
        collections: [],
        views: ["DocumentHolder"],
        initialize: function () {
            var me = this;
            me.tooltips = {
                hyperlink: {},
                comment: {},
                coauth: {
                    ttHeight: 20
                },
                row_column: {
                    ttHeight: 20
                }
            };
            me.mouse = {};
            me.popupmenu = false;
            me.rangeSelectionMode = false;
            me.show_copywarning = true;
            this.wrapEvents = {
                apiHideComment: _.bind(this.onApiHideComment, this)
            };
            this.addListeners({
                "DocumentHolder": {
                    "createdelayedelements": this.onCreateDelayedElements
                }
            });
            var keymap = {};
            this.hkComments = "command+alt+h,ctrl+alt+h";
            keymap[this.hkComments] = function () {
                me.onAddComment();
            };
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: keymap
            });
        },
        onLaunch: function () {
            var me = this;
            me.documentHolder = this.createView("DocumentHolder");
            me.documentHolder.render();
            me.documentHolder.el.tabIndex = -1;
            $(document).on("mousewheel", _.bind(me.onDocumentWheel, me));
            $(document).on("mousedown", _.bind(me.onDocumentRightDown, me));
            $(document).on("mouseup", _.bind(me.onDocumentRightUp, me));
            $(document).on("keydown", _.bind(me.onDocumentKeyDown, me));
            $(window).on("resize", _.bind(me.onDocumentResize, me));
            var viewport = SSE.getController("Viewport").getView("Viewport");
            viewport.hlayout.on("layout:resizedrag", _.bind(me.onDocumentResize, me));
            Common.NotificationCenter.on({
                "window:show": function (e) {
                    me.hideHyperlinkTip();
                },
                "modal:show": function (e) {
                    me.hideCoAuthTips();
                },
                "layout:changed": function (e) {
                    me.hideHyperlinkTip();
                    me.hideCoAuthTips();
                    me.onDocumentResize();
                },
                "cells:range": function (status) {
                    me.onCellsRange(status);
                },
                "copywarning:show": function () {
                    me.show_copywarning = false;
                }
            });
        },
        onCreateDelayedElements: function (view) {
            var me = this;
            view.pmiCut.on("click", _.bind(me.onCopyPaste, me));
            view.pmiCopy.on("click", _.bind(me.onCopyPaste, me));
            view.pmiPaste.on("click", _.bind(me.onCopyPaste, me));
            view.pmiImgCut.on("click", _.bind(me.onCopyPaste, me));
            view.pmiImgCopy.on("click", _.bind(me.onCopyPaste, me));
            view.pmiImgPaste.on("click", _.bind(me.onCopyPaste, me));
            view.pmiTextCut.on("click", _.bind(me.onCopyPaste, me));
            view.pmiTextCopy.on("click", _.bind(me.onCopyPaste, me));
            view.pmiTextPaste.on("click", _.bind(me.onCopyPaste, me));
            view.pmiInsertEntire.on("click", _.bind(me.onInsertEntire, me));
            view.pmiDeleteEntire.on("click", _.bind(me.onDeleteEntire, me));
            view.pmiInsertCells.menu.on("item:click", _.bind(me.onInsertCells, me));
            view.pmiDeleteCells.menu.on("item:click", _.bind(me.onDeleteCells, me));
            view.pmiSortCells.menu.on("item:click", _.bind(me.onSortCells, me));
            view.pmiClear.menu.on("item:click", _.bind(me.onClear, me));
            view.pmiInsFunction.on("click", _.bind(me.onInsFunction, me));
            view.menuAddHyperlink.on("click", _.bind(me.onInsHyperlink, me));
            view.menuEditHyperlink.on("click", _.bind(me.onInsHyperlink, me));
            view.menuRemoveHyperlink.on("click", _.bind(me.onDelHyperlink, me));
            view.pmiRowHeight.on("click", _.bind(me.onSetSize, me));
            view.pmiColumnWidth.on("click", _.bind(me.onSetSize, me));
            view.pmiEntireHide.on("click", _.bind(me.onEntireHide, me));
            view.pmiEntireShow.on("click", _.bind(me.onEntireShow, me));
            view.pmiAddComment.on("click", _.bind(me.onAddComment, me));
            view.imgMenu.on("item:click", _.bind(me.onImgMenu, me));
            view.menuParagraphVAlign.menu.on("item:click", _.bind(me.onParagraphVAlign, me));
            view.menuAddHyperlinkShape.on("click", _.bind(me.onInsHyperlink, me));
            view.menuEditHyperlinkShape.on("click", _.bind(me.onInsHyperlink, me));
            view.menuRemoveHyperlinkShape.on("click", _.bind(me.onRemoveHyperlinkShape, me));
            view.pmiTextAdvanced.on("click", _.bind(me.onTextAdvanced, me));
            view.mnuShapeAdvanced.on("click", _.bind(me.onShapeAdvanced, me));
            view.mnuChartEdit.on("click", _.bind(me.onChartEdit, me));
            var documentHolderEl = view.cmpEl;
            if (documentHolderEl) {
                documentHolderEl.on({
                    keydown: function (e) {
                        if (e.keyCode == e.F10 && e.shiftKey) {
                            e.stopEvent();
                            me.showObjectMenu(e);
                        }
                    },
                    mousedown: function (e) {
                        if (e.target.localName == "canvas" && e.button != 2) {
                            Common.UI.Menu.Manager.hideAll();
                        }
                    },
                    click: function (e) {
                        if (me.api) {
                            me.api.isTextAreaBlur = false;
                            if (e.target.localName == "canvas") {
                                documentHolderEl.focus();
                            }
                        }
                    }
                });
                var addEvent = function (elem, type, fn) {
                    elem.addEventListener ? elem.addEventListener(type, fn, false) : elem.attachEvent("on" + type, fn);
                };
                var eventname = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
                addEvent(view.el, eventname, _.bind(this.onDocumentWheel, this));
            }
        },
        loadConfig: function (data) {
            this.editorConfig = data.config;
        },
        setMode: function (permissions) {
            this.permissions = permissions; ! (this.permissions.canCoAuthoring && this.permissions.isEdit && this.permissions.canComments) ? Common.util.Shortcuts.suspendEvents(this.hkComments) : Common.util.Shortcuts.resumeEvents(this.hkComments);
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onContextMenu", _.bind(this.onApiContextMenu, this));
            this.api.asc_registerCallback("asc_onMouseMove", _.bind(this.onApiMouseMove, this));
            this.api.asc_registerCallback("asc_onHideComment", this.wrapEvents.apiHideComment);
            this.api.asc_registerCallback("asc_onHyperlinkClick", _.bind(this.onApiHyperlinkClick, this));
            this.api.asc_registerCallback("asc_onSetAFDialog", _.bind(this.onApiAutofilter, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onApiCoAuthoringDisconnect, this));
            return this;
        },
        resetApi: function (api) {
            this.api.asc_unregisterCallback("asc_onHideComment", this.wrapEvents.apiHideComment);
            this.api.asc_registerCallback("asc_onHideComment", this.wrapEvents.apiHideComment);
        },
        onCopyPaste: function (item) {
            var me = this;
            if (me.api) {
                if (typeof window["AscDesktopEditor"] === "object") {
                    (item.value == "cut") ? me.api.asc_Cut() : ((item.value == "copy") ? me.api.asc_Copy() : me.api.asc_Paste());
                } else {
                    var value = window.localStorage.getItem("sse-hide-copywarning");
                    if (! (value && parseInt(value) == 1) && me.show_copywarning) {
                        (new Common.Views.CopyWarningDialog({
                            handler: function (dontshow) {
                                (item.value == "cut") ? me.api.asc_Cut() : ((item.value == "copy") ? me.api.asc_Copy() : me.api.asc_Paste());
                                if (dontshow) {
                                    window.localStorage.setItem("sse-hide-copywarning", 1);
                                }
                                Common.NotificationCenter.trigger("edit:complete", me.documentHolder);
                            }
                        })).show();
                    } else {
                        (item.value == "cut") ? me.api.asc_Cut() : ((item.value == "copy") ? me.api.asc_Copy() : me.api.asc_Paste());
                        Common.NotificationCenter.trigger("edit:complete", me.documentHolder);
                    }
                    Common.component.Analytics.trackEvent("ToolBar", "Copy Warning");
                }
            }
        },
        onInsertEntire: function (item) {
            if (this.api) {
                switch (this.api.asc_getCellInfo().asc_getFlags().asc_getSelectionType()) {
                case c_oAscSelectionType.RangeRow:
                    this.api.asc_insertCells(c_oAscInsertOptions.InsertRows);
                    break;
                case c_oAscSelectionType.RangeCol:
                    this.api.asc_insertCells(c_oAscInsertOptions.InsertColumns);
                    break;
                }
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Insert Entire");
            }
        },
        onInsertCells: function (menu, item) {
            if (this.api) {
                this.api.asc_insertCells(item.value);
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Insert Cells");
            }
        },
        onDeleteEntire: function (item) {
            if (this.api) {
                switch (this.api.asc_getCellInfo().asc_getFlags().asc_getSelectionType()) {
                case c_oAscSelectionType.RangeRow:
                    this.api.asc_deleteCells(c_oAscDeleteOptions.DeleteRows);
                    break;
                case c_oAscSelectionType.RangeCol:
                    this.api.asc_deleteCells(c_oAscDeleteOptions.DeleteColumns);
                    break;
                }
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Delete Entire");
            }
        },
        onDeleteCells: function (menu, item) {
            if (this.api) {
                this.api.asc_deleteCells(item.value);
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Delete Cells");
            }
        },
        onSortCells: function (menu, item) {
            if (this.api) {
                this.api.asc_sortColFilter(item.value, "");
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Sort Cells");
            }
        },
        onClear: function (menu, item) {
            if (this.api) {
                this.api.asc_emptyCells(item.value);
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Clear");
            }
        },
        onInsFunction: function (item) {
            var controller = this.getApplication().getController("FormulaDialog");
            if (controller && this.api) {
                this.api.asc_enableKeyEvents(false);
                controller.showDialog();
            }
        },
        onInsHyperlink: function (item) {
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
                    Common.NotificationCenter.trigger("edit:complete", me.documentHolder);
                };
                var cell = me.api.asc_getCellInfo();
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
                    allowInternal: item.options.inCell
                });
            }
            Common.component.Analytics.trackEvent("DocumentHolder", "Add Hyperlink");
        },
        onDelHyperlink: function (item) {
            if (this.api) {
                this.api.asc_removeHyperlink();
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Remove Hyperlink");
            }
        },
        onSetSize: function (item) {
            var me = this;
            (new SSE.Views.SetValueDialog({
                title: item.caption,
                startvalue: item.options.action == "row-height" ? me.api.asc_getRowHeight() : me.api.asc_getColumnWidth(),
                maxvalue: 409,
                step: item.options.action == "row-height" ? 0.75 : 1,
                defaultUnit: item.options.action == "row-height" ? "pt" : "sym",
                handler: function (dlg, result) {
                    if (result == "ok") {
                        var val = dlg.getSettings();
                        (item.options.action == "row-height") ? me.api.asc_setRowHeight(val) : me.api.asc_setColumnWidth(val);
                    }
                    Common.NotificationCenter.trigger("edit:complete", me.documentHolder);
                }
            })).show();
        },
        onEntireHide: function (item) {
            if (this.api) {
                this.api[item.isrowmenu ? "asc_hideRows" : "asc_hideColumns"]();
            }
        },
        onEntireShow: function (item) {
            if (this.api) {
                this.api[item.isrowmenu ? "asc_showRows" : "asc_showColumns"]();
            }
        },
        onAddComment: function (item) {
            if (this.api && this.permissions.canCoAuthoring && this.permissions.isEdit && this.permissions.canComments) {
                this.api.asc_enableKeyEvents(false);
                var controller = SSE.getController("Common.Controllers.Comments"),
                cellinfo = this.api.asc_getCellInfo();
                if (controller) {
                    var comments = cellinfo.asc_getComments();
                    if (comments.length) {
                        controller.onEditComments(comments);
                    } else {
                        controller.addDummyComment();
                    }
                }
            }
        },
        onImgMenu: function (menu, item) {
            if (this.api) {
                if (item.options.type == "arrange") {
                    this.api.asc_setSelectedDrawingObjectLayer(item.value);
                    Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                    Common.component.Analytics.trackEvent("DocumentHolder", "Arrange");
                } else {
                    if (item.options.type == "group") {
                        this.api[(item.value == "grouping") ? "asc_groupGraphicsObjects" : "asc_unGroupGraphicsObjects"]();
                        Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                        Common.component.Analytics.trackEvent("DocumentHolder", (item.value == "grouping") ? "Grouping" : "Ungrouping");
                    }
                }
            }
        },
        onParagraphVAlign: function (menu, item) {
            if (this.api) {
                var properties = new Asc.asc_CImgProperty();
                properties.asc_putVerticalTextAlign(item.value);
                this.api.asc_setGraphicObjectProps(properties);
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Paragraph Vertical Align");
            }
        },
        onRemoveHyperlinkShape: function (item) {
            if (this.api) {
                this.api.asc_removeHyperlink();
                Common.NotificationCenter.trigger("edit:complete", this.documentHolder);
                Common.component.Analytics.trackEvent("DocumentHolder", "Remove Hyperlink");
            }
        },
        onTextAdvanced: function (item) {
            var me = this;
            (new SSE.Views.ParagraphSettingsAdvanced({
                paragraphProps: item.textInfo,
                api: me.api,
                handler: function (result, value) {
                    if (result == "ok") {
                        if (me.api) {
                            me.api.asc_setGraphicObjectProps(value.paragraphProps);
                            Common.component.Analytics.trackEvent("DocumentHolder", "Apply advanced paragraph settings");
                        }
                    }
                    Common.NotificationCenter.trigger("edit:complete", me);
                }
            })).show();
        },
        onShapeAdvanced: function (item) {
            var me = this;
            (new SSE.Views.ShapeSettingsAdvanced({
                shapeProps: item.shapeInfo,
                api: me.api,
                handler: function (result, value) {
                    if (result == "ok") {
                        if (me.api) {
                            me.api.asc_setGraphicObjectProps(value.shapeProps);
                            Common.component.Analytics.trackEvent("DocumentHolder", "Apply advanced shape settings");
                        }
                    }
                    Common.NotificationCenter.trigger("edit:complete", me);
                }
            })).show();
        },
        onChartEdit: function (item) {
            var me = this;
            var win, props;
            if (me.api) {
                props = me.api.asc_getChartObject();
                if (props) {
                    (new SSE.Views.ChartSettingsDlg({
                        chartSettings: props,
                        api: me.api,
                        handler: function (result, value) {
                            if (result == "ok") {
                                if (me.api) {
                                    me.api.asc_editChartDrawingObject(value.chartSettings);
                                }
                            }
                            Common.NotificationCenter.trigger("edit:complete", me);
                        }
                    })).show();
                }
            }
        },
        onApiCoAuthoringDisconnect: function () {
            this.permissions.isEdit = false;
        },
        hideCoAuthTips: function () {
            if (this.tooltips.coauth.ref) {
                $(this.tooltips.coauth.ref).remove();
                this.tooltips.coauth.ref = undefined;
                this.tooltips.coauth.x_point = undefined;
                this.tooltips.coauth.y_point = undefined;
            }
        },
        hideHyperlinkTip: function () {
            if (!this.tooltips.hyperlink.isHidden && this.tooltips.hyperlink.ref) {
                this.tooltips.hyperlink.ref.hide();
                this.tooltips.hyperlink.isHidden = true;
            }
        },
        onApiMouseMove: function (dataarray) {
            if (!this._isFullscreenMenu && dataarray.length) {
                var index_hyperlink, index_comments, index_locked, index_column, index_row;
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
                    case c_oAscMouseMoveType.ResizeColumn:
                        index_column = i;
                        break;
                    case c_oAscMouseMoveType.ResizeRow:
                        index_row = i;
                        break;
                    }
                }
                var me = this,
                showPoint = [0, 0],
                coAuthTip = me.tooltips.coauth,
                commentTip = me.tooltips.comment,
                hyperlinkTip = me.tooltips.hyperlink,
                row_columnTip = me.tooltips.row_column,
                pos = [me.documentHolder.cmpEl.offset().left - $(window).scrollLeft(), me.documentHolder.cmpEl.offset().top - $(window).scrollTop()];
                hyperlinkTip.isHidden = false;
                row_columnTip.isHidden = false;
                var getUserName = function (id) {
                    var usersStore = SSE.getCollection("Common.Collections.Users");
                    if (usersStore) {
                        var rec = usersStore.findUser(id);
                        if (rec) {
                            return rec.get("username");
                        }
                    }
                    return me.guestText;
                };
                if (index_hyperlink) {
                    var data = dataarray[index_hyperlink - 1],
                    props = data.asc_getHyperlink();
                    if (props.asc_getType() == c_oAscHyperlinkType.WebLink) {
                        var linkstr = props.asc_getTooltip();
                        if (linkstr) {
                            linkstr = Common.Utils.String.htmlEncode(linkstr) + "<br><b>" + me.textCtrlClick + "</b>";
                        } else {
                            linkstr = props.asc_getHyperlinkUrl() + "<br><b>" + me.textCtrlClick + "</b>";
                        }
                    } else {
                        linkstr = props.asc_getTooltip() || (props.asc_getSheet() + "!" + props.asc_getRange());
                    }
                    if (hyperlinkTip.ref && hyperlinkTip.ref.isVisible()) {
                        if (hyperlinkTip.text != linkstr) {
                            hyperlinkTip.ref.hide();
                            hyperlinkTip.isHidden = true;
                        }
                    }
                    if (!hyperlinkTip.ref || !hyperlinkTip.ref.isVisible()) {
                        hyperlinkTip.text = linkstr;
                        hyperlinkTip.ref = new Common.UI.Tooltip({
                            owner: me.documentHolder,
                            html: true,
                            title: linkstr
                        }).on("tooltip:hide", function (tip) {
                            hyperlinkTip.ref = undefined;
                            hyperlinkTip.text = "";
                        });
                        hyperlinkTip.ref.show([-10000, -10000]);
                        hyperlinkTip.isHidden = false;
                    }
                    showPoint = [data.asc_getX(), data.asc_getY()];
                    showPoint[0] += (pos[0] + 6);
                    showPoint[1] += (pos[1] - 20);
                    showPoint[1] -= hyperlinkTip.ref.getBSTip().$tip.height();
                    var tipwidth = hyperlinkTip.ref.getBSTip().$tip.width();
                    if (showPoint[0] + tipwidth > me.tooltips.coauth.bodyWidth) {
                        showPoint[0] = me.tooltips.coauth.bodyWidth - tipwidth;
                    }
                    hyperlinkTip.ref.getBSTip().$tip.css({
                        top: showPoint[1] + "px",
                        left: showPoint[0] + "px"
                    });
                } else {
                    me.hideHyperlinkTip();
                }
                if (index_column !== undefined || index_row !== undefined) {
                    var data = dataarray[(index_column !== undefined) ? (index_column - 1) : (index_row - 1)];
                    var str = Common.Utils.String.format((index_column !== undefined) ? this.textChangeColumnWidth : this.textChangeRowHeight, data.asc_getSizeCCOrPt().toFixed(2), data.asc_getSizePx());
                    if (row_columnTip.ref && row_columnTip.ref.isVisible()) {
                        if (row_columnTip.text != str) {
                            row_columnTip.text = str;
                            row_columnTip.ref.setTitle(str);
                            row_columnTip.ref.updateTitle();
                        }
                    }
                    if (!row_columnTip.ref || !row_columnTip.ref.isVisible()) {
                        row_columnTip.text = str;
                        row_columnTip.ref = new Common.UI.Tooltip({
                            owner: me.documentHolder,
                            html: true,
                            title: str
                        }).on("tooltip:hide", function (tip) {
                            row_columnTip.ref = undefined;
                            row_columnTip.text = "";
                        });
                        row_columnTip.ref.show([-10000, -10000]);
                        row_columnTip.isHidden = false;
                        showPoint = [data.asc_getX(), data.asc_getY()];
                        showPoint[0] += (pos[0] + 6);
                        showPoint[1] += (pos[1] - 20 - row_columnTip.ttHeight);
                        var tipwidth = row_columnTip.ref.getBSTip().$tip.width();
                        if (showPoint[0] + tipwidth > me.tooltips.coauth.bodyWidth) {
                            showPoint[0] = me.tooltips.coauth.bodyWidth - tipwidth - 20;
                        }
                        row_columnTip.ref.getBSTip().$tip.css({
                            top: showPoint[1] + "px",
                            left: showPoint[0] + "px"
                        });
                    }
                } else {
                    if (!row_columnTip.isHidden && row_columnTip.ref) {
                        row_columnTip.ref.hide();
                        row_columnTip.isHidden = true;
                    }
                }
                if (me.permissions.isEdit) {
                    if (index_comments && !this.popupmenu) {
                        data = dataarray[index_comments - 1];
                        if (!commentTip.editCommentId && commentTip.moveCommentId != data.asc_getCommentIndexes()[0]) {
                            commentTip.moveCommentId = data.asc_getCommentIndexes()[0];
                            if (commentTip.moveCommentTimer) {
                                clearTimeout(commentTip.moveCommentTimer);
                            }
                            var idxs = data.asc_getCommentIndexes(),
                            x = data.asc_getX(),
                            y = data.asc_getY(),
                            leftx = data.asc_getReverseX();
                            commentTip.moveCommentTimer = setTimeout(function () {
                                if (commentTip.moveCommentId && !commentTip.editCommentId) {
                                    commentTip.viewCommentId = commentTip.moveCommentId;
                                    var commentsController = me.getApplication().getController("Common.Controllers.Comments");
                                    if (commentsController) {
                                        if (!commentsController.isSelectedComment) {
                                            commentsController.onApiShowComment(idxs, x, y, leftx, false, true);
                                        }
                                    }
                                }
                            },
                            400);
                        }
                    } else {
                        commentTip.moveCommentId = undefined;
                        if (commentTip.viewCommentId != undefined) {
                            commentTip = {};
                            var commentsController = this.getApplication().getController("Common.Controllers.Comments");
                            if (commentsController) {
                                commentsController.onApiHideComment(true);
                            }
                        }
                    }
                    if (index_locked) {
                        data = dataarray[index_locked - 1];
                        if (!coAuthTip.XY) {
                            me.onDocumentResize();
                        }
                        if (coAuthTip.x_point != data.asc_getX() || coAuthTip.y_point != data.asc_getY()) {
                            me.hideCoAuthTips();
                            coAuthTip.x_point = data.asc_getX();
                            coAuthTip.y_point = data.asc_getY();
                            var src = $(document.createElement("div")),
                            is_sheet_lock = data.asc_getLockedObjectType() == c_oAscMouseMoveLockedObjectType.Sheet || data.asc_getLockedObjectType() == c_oAscMouseMoveLockedObjectType.TableProperties;
                            coAuthTip.ref = src;
                            src.addClass("username-tip");
                            src.css({
                                height: coAuthTip.ttHeight + "px",
                                position: "absolute",
                                zIndex: "900",
                                visibility: "visible"
                            });
                            $(document.body).append(src);
                            showPoint = [coAuthTip.x_point + coAuthTip.XY[0], coAuthTip.y_point + coAuthTip.XY[1]]; ! is_sheet_lock && (showPoint[0] = coAuthTip.bodyWidth - showPoint[0]);
                            if (showPoint[1] > coAuthTip.XY[1] && showPoint[1] + coAuthTip.ttHeight < coAuthTip.XY[1] + coAuthTip.apiHeight) {
                                src.text(getUserName(data.asc_getUserId()));
                                if (coAuthTip.bodyWidth - showPoint[0] < coAuthTip.ref.width()) {
                                    src.css({
                                        visibility: "visible",
                                        left: "0px",
                                        top: (showPoint[1] - coAuthTip.ttHeight) + "px"
                                    });
                                } else {
                                    src.css({
                                        visibility: "visible",
                                        right: showPoint[0] + "px",
                                        top: showPoint[1] + "px"
                                    });
                                }
                            }
                        }
                    } else {
                        me.hideCoAuthTips();
                    }
                }
            }
        },
        onApiHideComment: function () {
            this.tooltips.comment.viewCommentId = this.tooltips.comment.editCommentId = this.tooltips.comment.moveCommentId = undefined;
        },
        onApiHyperlinkClick: function (url) {
            if (url) {
                var isvalid = url.strongMatch(Common.Utils.hostnameRe); ! isvalid && (isvalid = url.strongMatch(Common.Utils.emailRe)); ! isvalid && (isvalid = url.strongMatch(Common.Utils.ipRe)); ! isvalid && (isvalid = url.strongMatch(Common.Utils.localRe));
                if (isvalid) {
                    var newDocumentPage = window.open(url, "_blank");
                    if (newDocumentPage) {
                        newDocumentPage.focus();
                    }
                }
            }
        },
        onApiAutofilter: function (config) {
            var me = this;
            if (me.permissions.isEdit) {
                var dlgFilter = new SSE.Views.AutoFilterDialog({
                    api: this.api
                }).on({
                    "close": function () {
                        if (me.api) {
                            me.api.asc_enableKeyEvents(true);
                        }
                    }
                });
                if (me.api) {
                    me.api.asc_enableKeyEvents(false);
                }
                Common.UI.Menu.Manager.hideAll();
                dlgFilter.setSettings(config);
                dlgFilter.show();
            }
        },
        onApiContextMenu: function (event) {
            var me = this;
            _.delay(function () {
                me.showObjectMenu.call(me, event);
            },
            10);
        },
        onAfterRender: function (view) {},
        onDocumentResize: function (e) {
            var me = this;
            if (me.documentHolder) {
                me.tooltips.coauth.XY = [me.documentHolder.cmpEl.offset().left - $(window).scrollLeft(), me.documentHolder.cmpEl.offset().top - $(window).scrollTop()];
                me.tooltips.coauth.apiHeight = me.documentHolder.cmpEl.height();
                me.tooltips.coauth.bodyWidth = $(window).width();
            }
        },
        onDocumentWheel: function (e) {
            if (this.api) {
                var delta = (_.isUndefined(e.originalEvent)) ? e.wheelDelta : e.originalEvent.wheelDelta;
                if (_.isUndefined(delta)) {
                    delta = e.deltaY;
                }
                if (e.ctrlKey || e.metaKey) {
                    var factor = this.api.asc_getZoom();
                    if (delta < 0) {
                        factor -= 0.1;
                        if (! (factor < 0.5)) {
                            this.api.asc_setZoom(factor);
                        }
                    } else {
                        if (delta > 0) {
                            factor += 0.1;
                            if (factor > 0 && !(factor > 2)) {
                                this.api.asc_setZoom(factor);
                            }
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        },
        onDocumentKeyDown: function (event) {
            if (this.api) {
                var key = event.keyCode;
                if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                    if (key === Common.UI.Keys.NUM_PLUS || key === Common.UI.Keys.EQUALITY || (Common.Utils.isOpera && key == 43)) {
                        if (!this.api.isCellEdited) {
                            var factor = this.api.asc_getZoom() + 0.1;
                            if (factor > 0 && !(factor > 2)) {
                                this.api.asc_setZoom(factor);
                            }
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        }
                    } else {
                        if (key === Common.UI.Keys.NUM_MINUS || key === Common.UI.Keys.MINUS || (Common.Utils.isOpera && key == 45)) {
                            if (!this.api.isCellEdited) {
                                factor = this.api.asc_getZoom() - 0.1;
                                if (! (factor < 0.5)) {
                                    this.api.asc_setZoom(factor);
                                }
                                event.preventDefault();
                                event.stopPropagation();
                                return false;
                            }
                        }
                    }
                } else {
                    if (key == Common.UI.Keys.F10 && event.shiftKey) {
                        this.showObjectMenu(event);
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                }
            }
        },
        onDocumentRightDown: function (event) {
            event.button == 0 && (this.mouse.isLeftButtonDown = true);
        },
        onDocumentRightUp: function (event) {
            event.button == 0 && (this.mouse.isLeftButtonDown = false);
        },
        showObjectMenu: function (event) {
            if (this.api && this.permissions.isEdit && !this.mouse.isLeftButtonDown && !this.rangeSelectionMode) {
                var iscellmenu, isrowmenu, iscolmenu, isallmenu, ischartmenu, isimagemenu, istextshapemenu, isshapemenu, istextchartmenu, documentHolder = this.documentHolder,
                cellinfo = this.api.asc_getCellInfo(),
                seltype = cellinfo.asc_getFlags().asc_getSelectionType(),
                isCellLocked = cellinfo.asc_getLocked(),
                isObjLocked = false,
                commentsController = this.getApplication().getController("Common.Controllers.Comments");
                if (!this.permissions.isEditDiagram) {
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
                        isshapemenu = true;
                        break;
                    case c_oAscSelectionType.RangeChart:
                        ischartmenu = true;
                        break;
                    case c_oAscSelectionType.RangeChartText:
                        istextchartmenu = true;
                        break;
                    case c_oAscSelectionType.RangeShapeText:
                        istextshapemenu = true;
                        break;
                    }
                } else {
                    var insfunc = (seltype == c_oAscSelectionType.RangeCells);
                }
                if (isimagemenu || isshapemenu || ischartmenu) {
                    isimagemenu = isshapemenu = ischartmenu = false;
                    var has_chartprops = false;
                    var selectedObjects = this.api.asc_getGraphicObjectProps();
                    for (var i = 0; i < selectedObjects.length; i++) {
                        if (selectedObjects[i].asc_getObjectType() == c_oAscTypeSelectElement.Image) {
                            var elValue = selectedObjects[i].asc_getObjectValue();
                            isObjLocked = isObjLocked || elValue.asc_getLocked();
                            var shapeprops = elValue.asc_getShapeProperties();
                            if (shapeprops) {
                                if (shapeprops.asc_getFromChart()) {
                                    ischartmenu = true;
                                } else {
                                    documentHolder.mnuShapeAdvanced.shapeInfo = elValue;
                                    isshapemenu = true;
                                }
                            } else {
                                if (elValue.asc_getChartProperties()) {
                                    ischartmenu = true;
                                    has_chartprops = true;
                                } else {
                                    isimagemenu = true;
                                }
                            }
                        }
                    }
                    documentHolder.mnuUnGroupImg.setDisabled(isObjLocked || !this.api.asc_canUnGroupGraphicsObjects());
                    documentHolder.mnuGroupImg.setDisabled(isObjLocked || !this.api.asc_canGroupGraphicsObjects());
                    documentHolder.mnuShapeAdvanced.setVisible(isshapemenu && !isimagemenu && !ischartmenu);
                    documentHolder.mnuShapeAdvanced.setDisabled(isObjLocked);
                    documentHolder.mnuChartEdit.setVisible(ischartmenu && !isimagemenu && !isshapemenu && has_chartprops);
                    documentHolder.mnuChartEdit.setDisabled(isObjLocked);
                    documentHolder.pmiImgCut.setDisabled(isObjLocked);
                    documentHolder.pmiImgPaste.setDisabled(isObjLocked);
                    this.showPopupMenu(documentHolder.imgMenu, {},
                    event);
                    documentHolder.mnuShapeSeparator.setVisible(documentHolder.mnuShapeAdvanced.isVisible() || documentHolder.mnuChartEdit.isVisible());
                } else {
                    if (istextshapemenu || istextchartmenu) {
                        documentHolder.pmiTextAdvanced.textInfo = undefined;
                        var selectedObjects = this.api.asc_getGraphicObjectProps();
                        for (var i = 0; i < selectedObjects.length; i++) {
                            var elType = selectedObjects[i].asc_getObjectType();
                            if (elType == c_oAscTypeSelectElement.Image) {
                                var value = selectedObjects[i].asc_getObjectValue(),
                                align = value.asc_getVerticalTextAlign();
                                isObjLocked = isObjLocked || value.asc_getLocked();
                                documentHolder.menuParagraphTop.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_TOP);
                                documentHolder.menuParagraphCenter.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_CTR);
                                documentHolder.menuParagraphBottom.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM);
                            } else {
                                if (elType == c_oAscTypeSelectElement.Paragraph) {
                                    documentHolder.pmiTextAdvanced.textInfo = selectedObjects[i].asc_getObjectValue();
                                    isObjLocked = isObjLocked || documentHolder.pmiTextAdvanced.textInfo.asc_getLocked();
                                }
                            }
                        }
                        var hyperinfo = cellinfo.asc_getHyperlink(),
                        can_add_hyperlink = this.api.asc_canAddShapeHyperlink();
                        documentHolder.menuHyperlinkShape.setVisible(istextshapemenu && can_add_hyperlink !== false && hyperinfo);
                        documentHolder.menuAddHyperlinkShape.setVisible(istextshapemenu && can_add_hyperlink !== false && !hyperinfo);
                        documentHolder.menuParagraphVAlign.setVisible(istextchartmenu !== true);
                        documentHolder.pmiTextAdvanced.setVisible(documentHolder.pmiTextAdvanced.textInfo !== undefined);
                        _.each(documentHolder.textInShapeMenu.items, function (item) {
                            item.setDisabled(isObjLocked);
                        });
                        documentHolder.pmiTextCopy.setDisabled(false);
                        this.showPopupMenu(documentHolder.textInShapeMenu, {},
                        event);
                        documentHolder.textInShapeMenu.items[3].setVisible(documentHolder.menuHyperlinkShape.isVisible() || documentHolder.menuAddHyperlinkShape.isVisible() || documentHolder.menuParagraphVAlign.isVisible());
                    } else {
                        if (!this.permissions.isEditDiagram || (seltype !== c_oAscSelectionType.RangeImage && seltype !== c_oAscSelectionType.RangeShape && seltype !== c_oAscSelectionType.RangeChart && seltype !== c_oAscSelectionType.RangeChartText && seltype !== c_oAscSelectionType.RangeShapeText)) {
                            var iscelledit = this.api.isCellEdited;
                            documentHolder.pmiInsertEntire.setVisible(isrowmenu || iscolmenu);
                            documentHolder.pmiDeleteEntire.setVisible(isrowmenu || iscolmenu);
                            documentHolder.pmiInsertCells.setVisible(iscellmenu && !iscelledit);
                            documentHolder.pmiDeleteCells.setVisible(iscellmenu && !iscelledit);
                            documentHolder.pmiSortCells.setVisible((iscellmenu || isallmenu) && !iscelledit);
                            documentHolder.pmiInsFunction.setVisible(iscellmenu || insfunc);
                            var hyperinfo = cellinfo.asc_getHyperlink();
                            documentHolder.menuHyperlink.setVisible(iscellmenu && hyperinfo && !iscelledit);
                            documentHolder.menuAddHyperlink.setVisible(iscellmenu && !hyperinfo && !iscelledit);
                            documentHolder.pmiRowHeight.setVisible(isrowmenu || isallmenu);
                            documentHolder.pmiColumnWidth.setVisible(iscolmenu || isallmenu);
                            documentHolder.pmiEntireHide.setVisible(iscolmenu || isrowmenu);
                            documentHolder.pmiEntireShow.setVisible(iscolmenu || isrowmenu);
                            documentHolder.ssMenu.items[10].setVisible(iscellmenu && !iscelledit && this.permissions.canCoAuthoring && this.permissions.canComments);
                            documentHolder.pmiAddComment.setVisible(iscellmenu && !iscelledit && this.permissions.canCoAuthoring && this.permissions.canComments);
                            documentHolder.pmiCellMenuSeparator.setVisible(iscellmenu || isrowmenu || iscolmenu || isallmenu || insfunc);
                            documentHolder.pmiEntireHide.isrowmenu = isrowmenu;
                            documentHolder.pmiEntireShow.isrowmenu = isrowmenu;
                            documentHolder.setMenuItemCommentCaptionMode(cellinfo.asc_getComments().length > 0);
                            commentsController && commentsController.blockPopover(true);
                            documentHolder.pmiClear.menu.items[1].setDisabled(iscelledit);
                            documentHolder.pmiClear.menu.items[2].setDisabled(iscelledit);
                            documentHolder.pmiClear.menu.items[3].setDisabled(iscelledit);
                            documentHolder.pmiClear.menu.items[4].setDisabled(iscelledit);
                            _.each(documentHolder.ssMenu.items, function (item) {
                                item.setDisabled(isCellLocked);
                            });
                            documentHolder.pmiCopy.setDisabled(false);
                            this.showPopupMenu(documentHolder.ssMenu, {},
                            event);
                        }
                    }
                }
            }
        },
        showPopupMenu: function (menu, value, event) {
            if (!_.isUndefined(menu) && menu !== null) {
                Common.UI.Menu.Manager.hideAll();
                var me = this,
                documentHolderView = me.documentHolder,
                showPoint = [event.pageX - documentHolderView.cmpEl.offset().left, event.pageY - documentHolderView.cmpEl.offset().top],
                menuContainer = documentHolderView.cmpEl.find(Common.Utils.String.format("#menu-container-{0}", menu.id));
                if (!menu.rendered) {
                    if (menuContainer.length < 1) {
                        menuContainer = $(Common.Utils.String.format('<div id="menu-container-{0}" style="position: absolute; z-index: 10000;"><div class="dropdown-toggle" data-toggle="dropdown"></div></div>', menu.id));
                        documentHolderView.cmpEl.append(menuContainer);
                    }
                    menu.render(menuContainer);
                    menu.cmpEl.attr({
                        tabindex: "-1"
                    });
                }
                if (
                /*this.mouse.isRightButtonDown &&*/
                event.button !== 2) {
                    var coord = me.api.asc_getActiveCellCoord(),
                    offset = {
                        left: 0,
                        top: 0
                    };
                    showPoint[0] = coord.asc_getX() + coord.asc_getWidth() + offset.left;
                    showPoint[1] = (coord.asc_getY() < 0 ? 0 : coord.asc_getY()) + coord.asc_getHeight() + offset.top;
                }
                menuContainer.css({
                    left: showPoint[0],
                    top: showPoint[1]
                });
                if (_.isFunction(menu.options.initMenu)) {
                    menu.options.initMenu(value);
                    menu.alignPosition();
                }
                _.delay(function () {
                    menu.cmpEl.focus();
                },
                10);
                menu.show();
            }
        },
        onCellsRange: function (status) {
            this.rangeSelectionMode = (status != c_oAscSelectionDialogType.None);
        },
        guestText: "Guest",
        textCtrlClick: "Press CTRL and click link",
        txtRowHeight: "Row Height",
        txtHeight: "Height",
        txtWidth: "Width",
        tipIsLocked: "This element is being edited by another user.",
        textChangeColumnWidth: "Column Width {0} symbols ({1} pixels)",
        textChangeRowHeight: "Row Height {0} points ({1} pixels)"
    },
    SSE.Controllers.DocumentHolder || {}));
});