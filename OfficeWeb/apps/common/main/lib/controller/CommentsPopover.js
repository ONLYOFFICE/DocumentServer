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
 Ext.define("Common.controller.CommentsPopover", {
    extend: "Common.controller.CommentsBase",
    requires: ["Common.view.CommentsEditForm"],
    views: ["Common.view.CommentsPopover"],
    init: function () {
        this.visiblePopovers = new Ext.util.MixedCollection();
        this.isDocumentContentReady = false;
        this.control({
            "commoncommentspopover": {
                afterrender: this.onAfterRenderPopover,
                transformToAdd: this.onTransformToAdd
            },
            "commoncommentspopover > dataview": {
                afterrender: this.onAfterRenderComment,
                itemupdate: this.onUpdateComment,
                viewready: this.onViewReadyComments
            },
            "commoncommentspopover textarea[action=add-reply-textarea]": {
                elastic: this.onElasticAddReply,
                keydown: this.onKeyDownTextArea
            },
            "commoncommentspopover label[action=link]": {
                afterrender: this.onAfterRenderAddReply
            },
            "commoncommentspopover button[action=reply]": {
                click: this.onBtnAddReply
            },
            "commoncommentspopover button[action=close]": {
                click: this.onBtnCloseReply
            }
        });
    },
    config: {
        movingTopLimit: -32,
        movingBottomLimit: -6,
        autoPopup: true,
        lastPosition: {
            x: 0,
            y: 0
        }
    },
    sdkViewName: "#id_main",
    setConfig: function (data, api) {
        this.superclass.loadConfig.call(this, data);
        this.setApi(api);
        this.sdkViewName = data["sdkviewname"] || this.sdkViewName;
        this.setMovingTopLimit(data.movingtoplimit || -32);
        this.setMovingBottomLimit(data.movingbottomlimit || -6);
        this.setAutoPopup(data.autopopup || true);
    },
    setApi: function (o) {
        this.callParent(arguments);
    },
    registerCallbacks: function () {
        this.api.asc_registerCallback("asc_onAddComment", Ext.bind(this.onApiAddComment, this));
        this.api.asc_registerCallback("asc_onShowComment", Ext.bind(this.onApiShowComment, this));
        this.api.asc_registerCallback("asc_onHideComment", Ext.bind(this.onApiHideComment, this));
        this.api.asc_registerCallback("asc_onUpdateCommentPosition", Ext.bind(this.onApiUpdateCommentPosition, this));
        this.api.asc_registerCallback("asc_onRemoveComment", Ext.bind(this.onApiRemoveComment, this));
    },
    onApiAddComment: function (commentId, data) {
        if (this.isDocumentContentReady && this.getAutoPopup()) {
            this.api.asc_selectComment(commentId);
            this.api.asc_showComment(commentId, true);
        }
    },
    onApiShowComment: function (commentId, posX, posY, leftX, canedit) {
        commentId = commentId[commentId.length - 1];
        if (!Ext.isEmpty(Ext.get("id-doc-comment-" + commentId))) {
            return;
        }
        this.setLastPosition({
            x: posX,
            y: posY,
            lx: leftX
        });
        this.onApiHideComment();
        var docArea = Ext.getCmp("editor_sdk");
        if (docArea) {
            var sdkMainView = docArea.getEl().down(this.sdkViewName);
            if (sdkMainView) {
                var ownerCommentEl = sdkMainView.createChild({
                    tag: "div",
                    id: "id-doc-comment-" + commentId,
                    cls: "comment-popover-root",
                    style: "top: " + posY + "px; left: " + posX + "px;"
                });
                if (ownerCommentEl) {
                    var newPopover = Ext.widget("commoncommentspopover", {
                        commentId: commentId,
                        userId: this.getCurrentUserId(),
                        editable: !(canedit === false),
                        renderTo: ownerCommentEl,
                        maxHeight: sdkMainView.getHeight() + this.getMovingTopLimit() + this.getMovingBottomLimit()
                    });
                    if (newPopover) {
                        if (posX + newPopover.getWidth() > sdkMainView.getWidth()) {
                            if (leftX) {
                                ownerCommentEl.addCls("left-sided").setLeft(leftX - newPopover.getWidth() - parseInt(ownerCommentEl.getStyle("margin-right")));
                            } else {
                                var marginLeft = parseInt(ownerCommentEl.getStyle("margin-left"));
                                if (marginLeft) {
                                    ownerCommentEl.setLeft(sdkMainView.getWidth() - newPopover.getWidth() - marginLeft * 2);
                                }
                            }
                        }
                        if (posY + newPopover.getHeight() > sdkMainView.getHeight()) {
                            ownerCommentEl.setTop(sdkMainView.getHeight() - newPopover.getHeight());
                        }
                        newPopover.getEl().alignTo(ownerCommentEl, "tl");
                        newPopover.show();
                        this.visiblePopovers.add(commentId, newPopover);
                    }
                }
            }
        }
    },
    onApiHideComment: function () {
        if (this.visiblePopovers.length) {
            this.keepIncompleteComments();
            this.visiblePopovers.eachKey(function (key, widget) {
                var ownerCommentEl = Ext.get("id-doc-comment-" + key);
                if (ownerCommentEl) {
                    widget.destroy();
                    ownerCommentEl.remove();
                }
            });
            this.visiblePopovers.clear();
            this.editControls = undefined;
        }
    },
    onApiRemoveComment: function (commentId) {
        this.clearIncompleteComments(commentId);
        var ownerCommentEl = Ext.get("id-doc-comment-" + commentId);
        if (ownerCommentEl) {
            var widget = this.visiblePopovers.get(commentId);
            if (widget) {
                widget.destroy();
                ownerCommentEl.remove();
                this.visiblePopovers.removeAtKey(commentId); ! this.visiblePopovers.length && (this.editControls = undefined);
            }
        }
    },
    onApiUpdateCommentPosition: function (commentId, newPosX, newPosY, leftX) {
        var ownerCommentEl = Ext.get("id-doc-comment-" + commentId),
        popoverCmp = this.getViewByCommentId(commentId),
        docArea = Ext.getCmp("editor_sdk"),
        me = this;
        if (docArea && ownerCommentEl && popoverCmp) {
            var sdkMainView = docArea.getEl().down(this.sdkViewName);
            if (sdkMainView) {
                var ownerMarginLeft = parseInt(ownerCommentEl.getStyle("margin-left")),
                ownerMarginTop = parseInt(ownerCommentEl.getStyle("margin-top"));
                this.setLastPosition({
                    x: newPosX,
                    y: newPosY,
                    lx: leftX
                });
                if (newPosY > 0 && newPosY < sdkMainView.getHeight()) {
                    if (!popoverCmp.isVisible()) {
                        popoverCmp.show();
                        var commentsList = this.getDataViewInView(popoverCmp);
                        if (commentsList) {
                            commentsList.doComponentLayout();
                            me.updateCommentsScrollView(commentsList, true);
                        }
                        this.fixViewSize(popoverCmp);
                    }
                } else {
                    popoverCmp.hide();
                }
                if (popoverCmp.isVisible()) {
                    if (newPosX + popoverCmp.getWidth() > sdkMainView.getWidth()) {
                        if (leftX) {
                            ownerCommentEl.addCls("left-sided").setLeft(leftX - popoverCmp.getWidth() - parseInt(ownerCommentEl.getStyle("margin-right")));
                        } else {
                            ownerCommentEl.setLeft(sdkMainView.getWidth() - popoverCmp.getWidth() - ownerMarginLeft * 2);
                        }
                    } else {
                        ownerCommentEl.removeCls("left-sided").setLeft(newPosX);
                    }
                    var arrow = popoverCmp.getEl().down(".popover-arrow");
                    var arrowCt = arrow.up(".x-container");
                    if (newPosY + popoverCmp.getHeight() + ownerMarginTop - this.getMovingBottomLimit() > sdkMainView.getHeight() && newPosY < sdkMainView.getHeight()) {
                        var top = sdkMainView.getHeight() - popoverCmp.getHeight() - ownerMarginTop + this.getMovingBottomLimit();
                        if (newPosY - top + arrow.getHeight() + 5 + (arrow.getTop() - arrowCt.getTop()) < popoverCmp.getHeight()) {
                            arrowCt.setStyle("margin-top", (newPosY - top) + "px");
                        }
                        ownerCommentEl.setTop(sdkMainView.getHeight() - popoverCmp.getHeight() - ownerMarginTop + this.getMovingBottomLimit());
                    } else {
                        if (newPosY < Math.abs(ownerMarginTop + this.getMovingTopLimit())) {
                            ownerCommentEl.setTop(Math.abs(ownerMarginTop + this.getMovingTopLimit()));
                        } else {
                            if (!/^0/.test(arrowCt.getStyle("margin-top"))) {
                                arrowCt.setStyle("margin-top", 0);
                            }
                            ownerCommentEl.setTop(newPosY);
                        }
                    }
                }
                var popover = this.visiblePopovers.get(commentId);
                if (popover) {
                    popover.getEl().alignTo(ownerCommentEl, "tl-tl");
                }
            }
        }
    },
    onDocumentContentReady: function () {
        this.isDocumentContentReady = true;
    },
    getViewByCommentId: function (commentId) {
        return Ext.getCmp("id-popover-comments-" + commentId);
    },
    getViewByCmp: function (cmp) {
        if (cmp) {
            return cmp.findParentBy(function (obj) {
                if (obj.getEl() && obj.getEl().hasCls("common-commentspopover")) {
                    return true;
                }
            });
        }
        return null;
    },
    getDataViewInView: function (view) {
        if (view) {
            return view.down("dataview");
        }
        return null;
    },
    fixViewSize: function (view) {
        var dataview = view.down("dataview"),
        link = view.down("container[action=add-reply-link-container]"),
        form = view.down("container[action=add-reply-form-container]");
        if (dataview) {
            var dataviewEl = dataview.getEl(),
            height = dataviewEl.getHeight(),
            plugin = dataview.getPlugin("scrollpane");
            if (plugin) {
                var pane = dataviewEl.down(".jspPane");
                if (pane) {
                    height = pane.getHeight();
                }
            }
            if (height < view.minHeight) {
                height = view.minHeight;
            }
            if (form && !form.isHidden()) {
                height += form.getHeight();
            } else {
                if (link) {
                    height += link.getHeight();
                }
            }
            if (height > view.maxHeight) {
                height = view.maxHeight;
            }
            view.setHeight(height);
            this.onApiUpdateCommentPosition(view.getCommentId(), this.getLastPosition().x, this.getLastPosition().y, this.getLastPosition().lx);
        }
    },
    onAfterRenderPopover: function (cmp) {
        this.fixViewSize(cmp);
    },
    onTransformToAdd: function (cmp) {
        var me = this;
        this.showEditCommentControls(cmp.commentId);
        var addReplyLink = cmp.down("#id-popover-add-reply-link-" + cmp.commentId),
        editForm = Ext.getCmp("controls-edit-msg-popover-" + cmp.commentId);
        if (addReplyLink) {
            addReplyLink.hide();
        }
        if (editForm) {
            var buttons = editForm.query("button"),
            textarea = editForm.query("textarea");
            textarea && textarea[0].focus(false, 100);
            Ext.each(buttons, function (button) {
                if (button.action == "edit") {
                    button.setText(me.textAdd);
                }
                button.on("click", function (cmp) {
                    Ext.each(buttons, function (button) {
                        button.un("click");
                    });
                    addReplyLink && addReplyLink.show();
                    me.hideEditCommentControls(cmp);
                    if (button.action != "edit") {
                        me.onApiHideComment();
                    }
                },
                {
                    single: true
                });
            });
        }
        cmp.doLayout();
        cmp.doComponentLayout();
        me.fixViewSize(cmp);
    },
    onAfterRenderAddReply: function (cmp) {
        var me = this;
        cmp.getEl().on("click", function (event, node) {
            me.showAddReplyControls(cmp);
        });
    },
    onAfterRenderComment: function (cmp) {
        cmp.getSelectionModel().keyNav.disable();
    },
    onUpdateComment: function (record, index, node) {
        var me = this,
        commentId = record.get("id"),
        popoverView = this.getViewByCommentId(commentId);
        if (popoverView) {
            var commentsList = this.getDataViewInView(popoverView);
            if (commentsList) {
                commentsList.doComponentLayout();
                me.updateHandlers(record, "id-popover-comment-" + commentId, {
                    onResolveComment: me.onResolveComment,
                    showEditCommentControls: me.showEditCommentControls,
                    showEditReplyControls: me.showEditReplyControls
                });
                var replys = record.get("replays");
                if (replys) {
                    replys.each(function (reply) {
                        me.hideEditReplyControls(commentId, reply.get("id"));
                    });
                }
                if (commentsList) {
                    this.updateCommentsScrollView(commentsList, true);
                }
            }
            this.fixViewSize(popoverView);
            var popoverViewEl = popoverView.getEl();
            if (record.get("lock")) {
                popoverViewEl.addCls("lock");
                var userStore = this.getCommonStoreUsersStore(),
                lockUserName = me.textAnonym;
                if (userStore) {
                    var userRec = userStore.findRecord("id", record.get("lockuserid"));
                    if (userRec) {
                        lockUserName = userRec.get("username");
                    }
                }
                var authEl = popoverViewEl.down(".lock-author");
                if (authEl) {
                    authEl.dom.innerHTML = lockUserName;
                }
            } else {
                popoverViewEl.removeCls("lock");
            }
        }
    },
    onViewReadyComments: function (cmp) {
        var me = this,
        popoverView = this.getViewByCmp(cmp),
        commentsList = this.getDataViewInView(popoverView),
        commentsStore = cmp.getStore();
        var record = commentsStore.findRecord("id", popoverView.getCommentId());
        if (record) {
            me.updateHandlers(record, "id-popover-comment-" + popoverView.getCommentId(), {
                onResolveComment: me.onResolveComment,
                showEditCommentControls: me.showEditCommentControls,
                showEditReplyControls: me.showEditReplyControls
            });
        }
        if (commentsList) {
            if (popoverView.editable) {
                this.showIncompleteCommentEditControls(popoverView.getCommentId());
            }
            this.updateCommentsScrollView(commentsList);
            this.fixViewSize(popoverView);
            var popoverViewEl = popoverView.getEl();
            if (record && record.get("lock")) {
                popoverViewEl.addCls("lock");
                var userStore = this.getCommonStoreUsersStore(),
                lockUserName = me.textAnonym;
                if (userStore) {
                    var userRec = userStore.findRecord("id", record.get("lockuserid"));
                    if (userRec) {
                        lockUserName = userRec.get("username");
                    }
                }
                var authEl = popoverViewEl.down(".lock-author");
                if (authEl) {
                    authEl.dom.innerHTML = lockUserName;
                }
            } else {
                popoverViewEl.removeCls("lock");
            }
        }
    },
    updateCommentsScrollView: function (dataview, scrollBegin) {
        if (dataview) {
            var plugin = dataview.getPlugin("scrollpane");
            if (plugin) {
                var popover = this.getViewByCmp(dataview);
                if (popover) {
                    popover.doLayout();
                }
                plugin.updateScrollPane();
                dataview.fireEvent("resize");
                if (scrollBegin) {
                    this.scrollViewToBegin(dataview);
                }
            }
        }
    },
    scrollViewToBegin: function (dataview) {
        if (dataview) {
            var plugin = dataview.getPlugin("scrollpane");
            if (plugin) {
                var doScroll = new Ext.util.DelayedTask(function () {
                    plugin.jspApi.scrollToPercentY(0, true);
                });
                doScroll.delay(100);
            }
        }
    },
    scrollViewToNode: function (dataview, node) {
        if (dataview && node) {
            var plugin = dataview.getPlugin("scrollpane");
            if (plugin) {
                var doScroll = new Ext.util.DelayedTask(function () {
                    plugin.scrollToElement(node, false, true);
                });
                doScroll.delay(100);
            }
        }
    },
    showAddReplyControls: function (cmp, msg) {
        var popoverView = this.getViewByCmp(cmp),
        parentCmp = cmp.up("#id-popover-comments-" + popoverView.getCommentId()),
        containerEditReply = parentCmp.down("#id-popover-controls-reply-" + popoverView.getCommentId()),
        linkEditReply = parentCmp.down("#id-popover-add-reply-link-" + popoverView.getCommentId()),
        textarea = parentCmp.down("textarea");
        if (containerEditReply && linkEditReply) {
            this.hideEditControls();
            this.editControls = {
                action: "add-reply",
                component: cmp
            };
            containerEditReply.show();
            linkEditReply.hide();
            if (textarea) {
                if (msg) {
                    textarea.setValue(msg);
                } (new Ext.util.DelayedTask(function () {
                    textarea.focus();
                },
                this)).delay(100);
            }
        }
        this.fixViewSize(popoverView);
    },
    hideAddReplyControls: function (cmp) {
        var popoverView = this.getViewByCmp(cmp),
        parentCmp = cmp.up("#id-popover-comments-" + popoverView.getCommentId()),
        containerEditReply = parentCmp.down("#id-popover-controls-reply-" + popoverView.getCommentId()),
        linkEditReply = parentCmp.down("#id-popover-add-reply-link-" + popoverView.getCommentId());
        if (containerEditReply && linkEditReply) {
            linkEditReply.show();
            containerEditReply.hide();
        }
        popoverView.doLayout();
        popoverView.doComponentLayout();
        this.fixViewSize(popoverView);
        this.editControls = undefined;
    },
    onResolveComment: function (commentId) {
        var me = this,
        popoverView = this.getViewByCommentId(commentId),
        menuResolve = Ext.getCmp("comments-popover-menu-resolve-" + commentId);
        if (popoverView) {
            var commentResolveEl = popoverView.getEl().down(".resolve");
            if (commentResolveEl) {
                var commentsStore = this.getCommonStoreCommentsStore();
                if (commentsStore) {
                    var comment = commentsStore.findRecord("id", commentId);
                    if (comment) {
                        var resolved = comment.get("resolved");
                        if (!resolved) {
                            this.resolveComment(commentId, !resolved);
                        } else {
                            if (!menuResolve) {
                                menuResolve = Ext.widget("menu", {
                                    id: "comments-popover-menu-resolve-" + commentId,
                                    renderTo: Ext.getBody(),
                                    plain: true,
                                    minWidth: 50,
                                    bodyCls: "menu-resolve-comment",
                                    items: [{
                                        text: me.textOpenAgain,
                                        listeners: {
                                            click: function (item, event) {
                                                item.ownerCt.hide();
                                                me.resolveComment(commentId, false);
                                            }
                                        }
                                    }]
                                });
                            }
                            menuResolve.show();
                            menuResolve.showBy(commentResolveEl, "tr-br", [0, 5]);
                        }
                    }
                }
            }
        }
    },
    showEditCommentControls: function (commentId, msg) {
        var me = this,
        popoverView = this.getViewByCommentId(commentId);
        if (popoverView) {
            var commentsList = this.getDataViewInView(popoverView);
            if (commentsList) {
                var commentEl = commentsList.getEl().down("#id-popover-comment-" + commentId);
                if (commentEl) {
                    var commentMsgEl = commentEl.down(".comment-message");
                    if (commentMsgEl) {
                        var message = commentMsgEl.down(".comment"),
                        editControlsEl = commentEl.down(".edit-info"),
                        editCommentControls = Ext.getCmp("controls-edit-msg-popover-" + commentId),
                        commentsStore = commentsList.getStore();
                        if (commentsStore) {
                            var comment = commentsStore.findRecord("id", commentId);
                            if (comment) {
                                if (editCommentControls) {
                                    editCommentControls.destroy();
                                }
                                if (editControlsEl) {
                                    editControlsEl.hide();
                                }
                                if (message) {
                                    message.setVisibilityMode(Ext.Element.DISPLAY);
                                    message.hide();
                                }
                                this.hideEditControls();
                                this.editControls = {
                                    action: "comment",
                                    comment: commentId
                                };
                                var editForm = Ext.widget("commoncommentseditform", {
                                    scope: this,
                                    editId: "popover-" + commentId,
                                    renderTo: commentMsgEl,
                                    msgValue: msg || comment.get("comment"),
                                    onEditHandler: this.onBtnEditComment,
                                    onCancelHandler: this.onBtnCancelEditComment
                                });
                                commentsList.on("resize", function () {
                                    editForm.doLayout();
                                },
                                this, {
                                    delay: 100
                                });
                                var onElastic = function () {
                                    me.fixViewSize(popoverView);
                                    me.updateCommentsScrollView(commentsList);
                                };
                                if (editForm) {
                                    var textarea = editForm.down("textarea");
                                    if (textarea) {
                                        textarea.on("elastic", onElastic);
                                        (new Ext.util.DelayedTask(function () {
                                            textarea.focus();
                                            if (textarea.getValue()) {
                                                textarea.selectText(textarea.getValue().length);
                                            }
                                        },
                                        this)).delay(100);
                                    }
                                }
                                onElastic();
                            }
                        }
                    }
                }
            }
        }
    },
    hideEditCommentControls: function (commentId) {
        var popoverView = this.getViewByCommentId(commentId);
        if (popoverView) {
            var commentsList = this.getDataViewInView(popoverView);
            if (commentsList) {
                var commentEl = commentsList.getEl().down("#id-popover-comment-" + commentId),
                commentMsgEl = commentEl.down(".comment-message");
                if (commentMsgEl) {
                    var message = commentMsgEl.down(".comment"),
                    editControlsEl = commentEl.down(".edit-info"),
                    editCommentControls = Ext.getCmp("controls-edit-msg-popover-" + commentId);
                    if (editControlsEl) {
                        editControlsEl.show();
                    }
                    if (editCommentControls) {
                        editCommentControls.hide();
                    }
                    if (message) {
                        message.setVisibilityMode(Ext.Element.DISPLAY);
                        message.show();
                    }
                    this.fixViewSize(popoverView);
                    this.updateCommentsScrollView(commentsList);
                    this.editControls = undefined;
                }
            }
        }
    },
    showEditReplyControls: function (commentId, replyId, msg) {
        var me = this,
        popoverView = this.getViewByCommentId(commentId);
        if (popoverView) {
            var commentsList = this.getDataViewInView(popoverView);
            if (commentsList) {
                var replyEl = commentsList.getEl().down("#reply-" + replyId),
                replyMsgEl = replyEl.down(".reply-message");
                if (replyMsgEl) {
                    var message = replyMsgEl.down(".message"),
                    editControlsEl = replyEl.down(".edit-info"),
                    editReplyControls = Ext.getCmp("controls-edit-msg-popover-" + replyId);
                    var commentsStore = Ext.getStore("Common.store.Comments");
                    if (commentsStore) {
                        var comment = commentsStore.findRecord("id", commentId);
                        if (comment) {
                            var reply = comment.replys().findRecord("id", replyId);
                            if (reply) {
                                if (editReplyControls) {
                                    editReplyControls.destroy();
                                }
                                if (editControlsEl) {
                                    editControlsEl.hide();
                                }
                                if (message) {
                                    message.setVisibilityMode(Ext.Element.DISPLAY);
                                    message.hide();
                                }
                                this.hideEditControls();
                                this.editControls = {
                                    action: "edit-reply",
                                    comment: commentId,
                                    reply: replyId
                                };
                                var editForm = Ext.widget("commoncommentseditform", {
                                    scope: this,
                                    editId: "popover-" + replyId,
                                    renderTo: replyMsgEl,
                                    msgValue: msg || reply.get("reply"),
                                    onEditHandler: this.onBtnEditReply,
                                    onCancelHandler: this.onBtnCancelEditReply
                                });
                                commentsList.on("resize", function () {
                                    editForm.doLayout();
                                },
                                this, {
                                    delay: 100
                                });
                                var onElastic = function () {
                                    me.fixViewSize(popoverView);
                                    me.updateCommentsScrollView(commentsList);
                                    var scrollToNode = Ext.get("controls-edit-msg-popover-" + replyId);
                                    if (scrollToNode) {
                                        me.scrollViewToNode(commentsList, scrollToNode.dom);
                                    }
                                };
                                if (editForm) {
                                    var textarea = editForm.down("textarea");
                                    if (textarea) {
                                        textarea.on("elastic", onElastic);
                                        (new Ext.util.DelayedTask(function () {
                                            textarea.focus();
                                            if (textarea.getValue()) {
                                                textarea.selectText(textarea.getValue().length);
                                            }
                                        },
                                        this)).delay(100);
                                    }
                                }
                                onElastic();
                            }
                        }
                    }
                }
            }
        }
    },
    hideEditReplyControls: function (commentId, replyId) {
        var popoverView = this.getViewByCommentId(commentId);
        if (popoverView) {
            var commentsList = this.getDataViewInView(popoverView);
            if (commentsList) {
                var replyEl = commentsList.getEl().down("#reply-" + replyId),
                replyMsgEl = replyEl.down(".reply-message");
                if (replyMsgEl) {
                    var message = replyMsgEl.down(".message"),
                    editControlsEl = replyEl.down(".edit-info"),
                    editReplyControls = Ext.getCmp("controls-edit-msg-popover-" + replyId);
                    if (editControlsEl) {
                        editControlsEl.show();
                    }
                    if (editReplyControls) {
                        editReplyControls.hide();
                    }
                    if (message) {
                        message.setVisibilityMode(Ext.Element.DISPLAY);
                        message.show();
                    }
                    this.fixViewSize(popoverView);
                    this.updateCommentsScrollView(commentsList);
                    this.editControls = undefined;
                }
            }
        }
    },
    makeCommentEditable: function (commentId) {
        var commentPopover = Ext.ComponentQuery.query("commoncommentspopover")[0];
        $("#" + commentPopover.id).find(".edit-info").show();
        var addReplyLink = commentPopover.down("#id-popover-add-reply-link-" + commentId);
        addReplyLink && addReplyLink.show();
        commentPopover.editable = true;
        commentPopover.doLayout();
        commentPopover.doComponentLayout();
        this.fixViewSize(commentPopover);
    },
    onBtnEditComment: function (cmp) {
        var commentRoot = cmp.getEl().up(".comment-wrap");
        if (commentRoot) {
            var commentId = commentRoot.id.match(/id-popover-comment-(.+)/)[1];
            var editRoot = cmp.findParentBy(function (obj) {
                if (obj.getEl() && obj.getEl().hasCls("controls-edit-msg-container")) {
                    return true;
                }
            });
            if (editRoot) {
                var textarea = editRoot.down("textarea");
                if (textarea) {
                    this.editComment(commentId, textarea.getValue());
                }
            }
            var addReplyLink = Ext.getCmp("id-popover-add-reply-link-" + commentId);
            addReplyLink && addReplyLink.show();
            this.hideEditCommentControls(commentId);
        }
    },
    onBtnCancelEditComment: function (cmp) {
        var commentRoot = cmp.getEl().up(".comment-wrap");
        if (commentRoot) {
            this.hideEditCommentControls(commentRoot.id.match(/id-popover-comment-(.+)/)[1]);
        }
    },
    onBtnEditReply: function (cmp) {
        var replyRoot = cmp.getEl().up(".reply"),
        commentRoot = cmp.getEl().up(".comment-wrap");
        if (replyRoot && commentRoot) {
            var commentId = commentRoot.id.match(/id-popover-comment-(.+)/)[1],
            replyId = replyRoot.id.match(/\d+/g);
            var editRoot = cmp.findParentBy(function (obj) {
                if (obj.getEl() && obj.getEl().hasCls("controls-edit-msg-container")) {
                    return true;
                }
            });
            if (editRoot) {
                var textarea = editRoot.down("textarea");
                if (textarea) {
                    this.editReply(commentId, replyId, textarea.getValue());
                }
            }
            this.editControls = undefined;
        }
    },
    onBtnCancelEditReply: function (cmp) {
        var replyRoot = cmp.getEl().up(".reply"),
        commentRoot = cmp.getEl().up(".comment-wrap");
        if (replyRoot && commentRoot) {
            this.hideEditReplyControls(commentRoot.id.match(/id-popover-comment-(.+)/)[1], replyRoot.id.match(/\d+/g));
        }
    },
    onBtnAddReply: function (cmp) {
        var popoverView = this.getViewByCmp(cmp),
        commentsList = this.getDataViewInView(popoverView),
        parentCmp = cmp.up("#id-popover-comments-" + popoverView.getCommentId());
        if (parentCmp) {
            var textarea = parentCmp.down("textarea");
            if (textarea) {
                if (textarea.getValue().length < 1) {
                    return;
                }
                var replyVal = Ext.String.trim(textarea.getValue());
                if (this.addReply(popoverView.getCommentId(), replyVal)) {
                    textarea.setValue("");
                    this.hideAddReplyControls(cmp);
                    this.updateCommentsScrollView(commentsList, true);
                }
            }
        }
    },
    onBtnCloseReply: function (cmp) {
        var popoverView = this.getViewByCmp(cmp),
        parentCmp = cmp.up("#id-popover-comments-" + popoverView.getCommentId());
        if (parentCmp) {
            var textarea = parentCmp.down("textarea");
            if (textarea) {
                textarea.setValue("");
                this.hideAddReplyControls(cmp);
            }
        }
    },
    onElasticAddReply: function (cmp, width, height) {
        var parent = cmp.ownerCt;
        if (parent) {
            var editContainer = parent.down("container");
            if (editContainer && editContainer.rendered) {
                var paddingTop = parseInt(parent.getEl().getStyle("padding-top")),
                paddingBottom = parseInt(parent.getEl().getStyle("padding-bottom"));
                parent.setHeight(height + editContainer.getHeight() + paddingTop + paddingBottom + 5);
                var rootParent = parent.ownerCt;
                if (rootParent) {
                    this.fixViewSize(rootParent);
                }
            }
        }
    },
    onKeyDownTextArea: function (cmp, event) {
        if (event.getKey() == event.ENTER) {
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                var popoverView = this.getViewByCmp(cmp),
                commentsList = this.getDataViewInView(popoverView),
                parentCmp = cmp.up("#id-popover-comments-" + popoverView.getCommentId());
                if (parentCmp) {
                    if (cmp.getValue().length < 1) {
                        return;
                    }
                    var replyVal = Ext.String.trim(cmp.getValue());
                    if (this.addReply(popoverView.getCommentId(), replyVal)) {
                        cmp.setValue("");
                        this.hideAddReplyControls(cmp);
                        this.updateCommentsScrollView(commentsList, true);
                    }
                }
            }
        }
    },
    keepIncompleteComments: function () {
        var comment_keys, text, me = this,
        comment_key;
        me.visiblePopovers.eachKey(function (key, widget) {
            if (widget.editable) {
                me.clearIncompleteComments(key);
                comment_keys = [];
                if (me.editControls) {
                    if (me.editControls.action == "comment") {
                        comment_key = "self";
                        text = $("#controls-edit-msg-popover-" + key + " textarea").filter(":visible");
                    } else {
                        if (me.editControls.action == "add-reply") {
                            comment_key = "reply";
                            text = $("#id-popover-controls-reply-" + key + " textarea").filter(":visible");
                        } else {
                            comment_key = me.editControls.reply;
                            text = $("#controls-edit-msg-popover-" + comment_key + " textarea").filter(":visible");
                        }
                    }
                    if (text && text[0] && text[0].value.length) {
                        comment_keys.push(comment_key);
                        window.sessionStorage.setItem(comment_key, text[0].value);
                    }
                }
                if (comment_keys.length) {
                    window.sessionStorage.setItem(key, comment_keys);
                }
            }
        });
    },
    clearIncompleteComments: function (commentId) {
        var comment_keys = window.sessionStorage.getItem(commentId);
        if (comment_keys) {
            comment_keys = comment_keys.match(/[a-zA-Z0-9-_]+/);
            comment_keys.forEach(function (item) {
                window.sessionStorage.removeItem(item);
            });
            window.sessionStorage.removeItem(commentId);
        }
    },
    showIncompleteCommentEditControls: function (commentId) {
        var me = this;
        var comment_keys = window.sessionStorage.getItem(commentId),
        text;
        if (comment_keys) {
            comment_keys = comment_keys.match(/[a-zA-Z0-9-_]+/ig);
            comment_keys.forEach(function (item) {
                text = window.sessionStorage.getItem(item);
                if (item == "self") {
                    me.showEditCommentControls(commentId, text);
                } else {
                    if (item == "reply") {
                        var addReplyLink = Ext.getCmp("id-popover-add-reply-link-" + commentId);
                        me.showAddReplyControls(addReplyLink, text);
                    } else {
                        me.showEditReplyControls(commentId, item, text);
                    }
                }
            });
        }
    },
    hideEditControls: function () {
        if (this.editControls) {
            switch (this.editControls.action) {
            case "comment":
                this.hideEditCommentControls(this.editControls.comment);
                break;
            case "add-reply":
                this.hideAddReplyControls(this.editControls.component);
                break;
            case "edit-reply":
                this.hideEditReplyControls(this.editControls.comment, this.editControls.reply);
                break;
            }
        }
    },
    textAnonym: "Guest",
    textOpenAgain: "Open Again",
    textAdd: "Add"
});