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
 Ext.define("Common.controller.CommentsList", {
    extend: "Common.controller.CommentsBase",
    requires: ["Common.view.CommentsEditForm"],
    views: ["CommentsPanel"],
    stores: ["Common.store.Comments", "Common.store.Users"],
    refs: [{
        ref: "commentsPanel",
        selector: "commoncommentspanel"
    },
    {
        ref: "commentsList",
        selector: "#id-comments"
    },
    {
        ref: "commentTextArea",
        selector: "#id-comment-textarea"
    },
    {
        ref: "btnAddComment",
        selector: "#id-btn-send-comment"
    },
    {
        ref: "linkAddComment",
        selector: "#id-add-comment-link"
    },
    {
        ref: "containerAddComment",
        selector: "#id-add-comment-container"
    }],
    init: function () {
        this.control({
            "#id-btn-send-comment": {
                afterrender: this.onBtnAddAfterRender,
                click: this.onBtnAddCommentClick
            },
            "#id-btn-cancel-comment": {
                click: this.hideAddCommentControls
            },
            "#id-comments": {
                afterrender: this.onAfterRenderComments,
                itemadd: this.onAddComment,
                itemremove: this.onRemoveComment,
                itemupdate: this.onUpdateComment,
                viewready: this.onViewReadyComments,
                refresh: this.onRefreshComments
            },
            "#id-comment-textarea": {
                keydown: this.onTextAreaKeyDown,
                keyup: this.onTextAreaKeyUp
            },
            "#id-add-comment-link": {
                afterrender: this.onAfterRenderAddCommentLink
            },
            "#view-main-menu": {
                panelshow: this.onShowPanel
            }
        });
    },
    setConfig: function (data, api) {
        this.loadConfig(data);
        this.setApi(api);
    },
    loadConfig: function (data) {
        var commentsPanel = this.getCommentsPanel(),
        commentsList = this.getCommentsList(),
        me = this;
        if (commentsPanel) {
            commentsPanel.setCurrentUserId(data.config.user.id);
            commentsList.refresh();
        } else {
            this.control({
                "commoncommentspanel": {
                    beforerender: function () {
                        var commentsPanel = me.getCommentsPanel();
                        if (commentsPanel) {
                            commentsPanel.setCurrentUserId(data.config.user.id);
                            me.getCommentsList().refresh();
                        }
                    }
                }
            });
        }
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.callParent(arguments);
    },
    registerCallbacks: function () {
        this.api.asc_registerCallback("asc_onAddComment", Ext.bind(this.onApiAddComment, this));
        this.api.asc_registerCallback("asc_onAddComments", Ext.bind(this.onApiAddComments, this));
        this.api.asc_registerCallback("asc_onRemoveComment", Ext.bind(this.onApiRemoveComment, this));
        this.api.asc_registerCallback("asc_onChangeCommentData", Ext.bind(this.onApiChangeCommentData, this));
        this.api.asc_registerCallback("asc_onLockComment", Ext.bind(this.onApiLockComment, this));
        this.api.asc_registerCallback("asc_onUnLockComment", Ext.bind(this.onApiUnLockComment, this));
    },
    onApiAddComment: function (commentId, data) {
        var commentsStore = this.getCommonStoreCommentsStore();
        var me = this;
        if (commentsStore) {
            var comment = commentsStore.findRecord("id", commentId);
            if (comment) {
                comment.beginEdit();
                comment.set("comment", data.asc_getText());
                comment.set("date", data.asc_getTime() == "" ? undefined : this.stringUtcToLocalDate(data.asc_getTime()));
                comment.set("userid", data.asc_getUserId());
                comment.set("username", data.asc_getUserName());
                comment.set("resolved", data.asc_getSolved());
                comment.set("quote", data.asc_getQuoteText());
                comment.replys().removeAll();
                var relayCount = data.asc_getRepliesCount();
                for (var i = 0; i < relayCount; i++) {
                    var newReplyId = ++Ext.idSeed;
                    comment.replys().add({
                        id: newReplyId,
                        userid: data.asc_getReply(i).asc_getUserId(),
                        username: data.asc_getReply(i).asc_getUserName(),
                        date: this.stringUtcToLocalDate(data.asc_getReply(i).asc_getTime()),
                        reply: data.asc_getReply(i).asc_getText()
                    });
                }
                comment.replys().sort("date", "DESC");
                comment.endEdit();
                comment.commit();
                comment.replys().each(function (reply) {
                    me.hideEditReplyControls(commentId, reply.get("id"));
                });
            } else {
                var comments = commentsStore.add({
                    id: commentId,
                    userid: data.asc_getUserId(),
                    username: data.asc_getUserName(),
                    date: data.asc_getTime() == "" ? undefined : this.stringUtcToLocalDate(data.asc_getTime()),
                    quote: data.asc_getQuoteText(),
                    comment: data.asc_getText(),
                    resolved: data.asc_getSolved()
                });
                if (comments && comments.length > 0) {
                    var newComment = comments[0];
                    newComment.beginEdit();
                    var relayCount = data.asc_getRepliesCount();
                    for (var i = 0; i < relayCount; i++) {
                        var newReplyId = ++Ext.idSeed;
                        newComment.replys().add({
                            id: newReplyId,
                            userid: data.asc_getReply(i).asc_getUserId(),
                            username: data.asc_getReply(i).asc_getUserName(),
                            date: this.stringUtcToLocalDate(data.asc_getReply(i).asc_getTime()),
                            reply: data.asc_getReply(i).asc_getText()
                        });
                    }
                    newComment.replys().sort("date", "DESC");
                    newComment.endEdit();
                    newComment.commit();
                }
            }
            if (this.commentsFilter && !this.commentsFilter[0].value.test(commentId)) {
                commentsStore.filter(this.commentsFilter);
            }
            this.applySort();
        }
        this.hideAddCommentControls();
    },
    onApiAddComments: function (data) {
        var commentsStore = this.getCommonStoreCommentsStore();
        if (commentsStore) {
            var array = [];
            for (var i = 0; i < data.length; i++) {
                if (commentsStore.findRecord("id", data[i].Id)) {
                    continue;
                }
                array.push({
                    id: data[i].Id,
                    userid: data[i].Comment.asc_getUserId(),
                    username: data[i].Comment.asc_getUserName(),
                    date: data[i].Comment.asc_getTime() == "" ? undefined : this.stringUtcToLocalDate(data[i].Comment.asc_getTime()),
                    quote: data[i].Comment.asc_getQuoteText(),
                    comment: data[i].Comment.asc_getText(),
                    resolved: data[i].Comment.asc_getSolved()
                });
            }
            var comments = commentsStore.add(array),
            newComment,
            replyCount,
            newReplyId;
            for (var j = 0; j < comments.length; j++) {
                newComment = comments[j];
                newComment.beginEdit();
                replyCount = data[j].Comment.asc_getRepliesCount();
                for (var i = 0; i < replyCount; i++) {
                    newReplyId = ++Ext.idSeed;
                    newComment.replys().add({
                        id: newReplyId,
                        userid: data[j].Comment.asc_getReply(i).asc_getUserId(),
                        username: data[j].Comment.asc_getReply(i).asc_getUserName(),
                        date: this.stringUtcToLocalDate(data[j].Comment.asc_getReply(i).asc_getTime()),
                        reply: data[j].Comment.asc_getReply(i).asc_getText()
                    });
                }
                newComment.replys().sort("date", "DESC");
                newComment.endEdit();
                newComment.commit();
            }
            this.commentsFilter && commentsStore.filter(this.commentsFilter);
            this.applySort();
        }
        this.hideAddCommentControls();
    },
    onApiRemoveComment: function (commentId) {
        var commentsStore = this.getCommonStoreCommentsStore();
        if (commentsStore) {
            var record = commentsStore.findRecord("id", commentId);
            if (record) {
                commentsStore.remove(record);
            } else {
                if (this.commentsFilter) {
                    commentsStore.clearFilter();
                    record = commentsStore.findRecord("id", commentId);
                    commentsStore.remove(record);
                    commentsStore.filter(this.commentsFilter);
                }
            }
        }
    },
    onApiChangeCommentData: function (commentId, data) {
        var commentsStore = this.getCommonStoreCommentsStore(),
        me = this;
        if (commentsStore) {
            var comment = commentsStore.findRecord("id", commentId);
            if (!comment && me.commentsFilter) {
                var is_filter_cleared = true;
                commentsStore.clearFilter();
                comment = commentsStore.findRecord("id", commentId);
            }
            if (comment) {
                comment.beginEdit();
                comment.set("comment", data.asc_getText());
                comment.set("date", this.stringUtcToLocalDate(data.asc_getTime()));
                comment.set("userid", data.asc_getUserId());
                comment.set("username", data.asc_getUserName());
                comment.set("resolved", data.asc_getSolved());
                comment.set("quote", data.asc_getQuoteText());
                comment.replys().removeAll();
                var relayCount = data.asc_getRepliesCount();
                for (var i = 0; i < relayCount; i++) {
                    var newReplyId = ++Ext.idSeed;
                    comment.replys().add({
                        id: newReplyId,
                        userid: data.asc_getReply(i).asc_getUserId(),
                        username: data.asc_getReply(i).asc_getUserName(),
                        date: this.stringUtcToLocalDate(data.asc_getReply(i).asc_getTime()),
                        reply: data.asc_getReply(i).asc_getText()
                    });
                }
                comment.replys().sort("date", "DESC");
                comment.endEdit();
                comment.commit();
                comment.replys().each(function (reply) {
                    me.hideEditReplyControls(commentId, reply.get("id"));
                });
            }
            me.commentsFilter && is_filter_cleared && commentsStore.filter(me.commentsFilter);
        }
        this.applySort();
        this.editControls = undefined;
    },
    onApiLockComment: function (commentId, userId) {
        var commentsStore = this.getCommonStoreCommentsStore();
        if (commentsStore) {
            var comment = commentsStore.findRecord("id", commentId);
            if (!comment && this.commentsFilter) {
                var is_filter_cleared = true;
                commentsStore.clearFilter();
                comment = commentsStore.findRecord("id", commentId);
            }
            if (comment && !comment.get("lock")) {
                comment.beginEdit();
                comment.set("lock", true);
                comment.set("lockuserid", userId);
                comment.endEdit();
                comment.commit();
            }
            this.commentsFilter && is_filter_cleared && commentsStore.filter(this.commentsFilter);
        }
    },
    onApiUnLockComment: function (commentId) {
        var commentsStore = this.getCommonStoreCommentsStore();
        if (commentsStore) {
            var comment = commentsStore.findRecord("id", commentId);
            if (!comment && this.commentsFilter) {
                var is_filter_cleared = true;
                commentsStore.clearFilter();
                comment = commentsStore.findRecord("id", commentId);
            }
            if (comment && comment.get("lock")) {
                comment.beginEdit();
                comment.set("lock", false);
                comment.endEdit();
                comment.commit();
            }
            this.commentsFilter && is_filter_cleared && commentsStore.filter(this.commentsFilter);
        }
    },
    stringUtcToLocalDate: function (date) {
        if (typeof date === "string") {
            return parseInt(date) + this.timeZoneOffsetInMs;
        }
        return 0;
    },
    applySort: function () {
        var commentsList = this.getCommentsList(),
        commentsStore = this.getCommonStoreCommentsStore();
        commentsStore && commentsStore.sort();
        commentsList && commentsList.refresh();
    },
    updateCommentsScrollView: function (scrollToNode) {
        var commentsList = this.getCommentsList();
        if (commentsList) {
            var plugin = commentsList.getPlugin("scrollpane");
            if (plugin) {
                var doScroll = new Ext.util.DelayedTask(function () {
                    plugin.scrollToElement(scrollToNode, false, true);
                });
                if (Ext.isDefined(scrollToNode)) {
                    doScroll.delay(100);
                }
                if (commentsList.getWidth() > 0) {
                    plugin.updateScrollPane();
                }
            }
        }
    },
    scrollViewToEnd: function (dataview) {
        if (dataview) {
            var plugin = dataview.getPlugin("scrollpane");
            if (plugin) {
                var doScroll = new Ext.util.DelayedTask(function () {
                    plugin.jspApi.scrollToPercentY(100, true);
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
    createAddReplyControls: function (record) {
        var me = this,
        commentId = record.get("id"),
        commentsPanel = this.getCommentsPanel();
        Ext.widget("container", {
            renderTo: "comment-" + commentId + "-add-reply-container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            height: 16,
            id: "root-add-reply-" + commentId,
            cls: "root-add-reply",
            items: [{
                xtype: "container",
                id: "add-reply-link-" + commentId,
                cls: "reply-link-container add-link",
                action: "comments-list-add-reply-link-container",
                height: 16,
                items: [{
                    xtype: "label",
                    text: me.textAddReply,
                    listeners: {
                        afterrender: function (cmp) {
                            cmp.getEl().on("click", Ext.bind(function (event, node) {
                                me.showAddReplyControls(cmp);
                            }), this);
                        }
                    }
                }]
            },
            commentsPanel.getAddReplyForm({
                scope: me,
                commentId: commentId,
                textAreaHandlers: {
                    onFocus: me.onFocusRetryTextArea,
                    onBlur: Ext.emptyFn,
                    onKeyDown: me.onKeyDownRetryTextArea,
                    onElastic: me.onElasticReplyTextArea
                },
                onReplyHandler: me.onBtnAddReply,
                onCloseHandler: me.onBtnCloseReply
            })],
            listeners: {
                afterrender: Ext.bind(function (cmp) {
                    cmp.setHeight(16);
                    var commentsList = this.getCommentsList();
                    if (commentsList) {
                        commentsList.on("resize", function () {
                            cmp.doLayout();
                        },
                        this, {
                            delay: 300
                        });
                    }
                },
                this)
            }
        });
    },
    showEditCommentControls: function (commentId) {
        var commentsList = this.getCommentsList(),
        commentsPanel = this.getCommentsPanel();
        if (commentsList && commentsPanel) {
            var commentEl = commentsList.getEl().down("#comment-" + commentId),
            commentMsgEl = commentEl.down(".comment-message");
            if (commentMsgEl) {
                var message = commentMsgEl.down(".comment"),
                editControlsEl = commentEl.down(".edit-info"),
                editCommentControls = Ext.getCmp("controls-edit-msg-list-" + commentId);
                var commentsStore = this.getCommonStoreCommentsStore();
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
                            action: "edit-comment",
                            comment: commentId
                        };
                        var editForm = Ext.widget("commoncommentseditform", {
                            scope: this,
                            editId: "list-" + commentId,
                            renderTo: commentMsgEl,
                            msgValue: comment.get("comment"),
                            onEditHandler: this.onBtnEditComment,
                            onCancelHandler: this.onBtnCancelEditComment
                        });
                        if (editForm) {
                            commentsList.on("resize", function () {
                                editForm.doLayout();
                            },
                            this, {
                                delay: 100
                            });
                            this.updateCommentsScrollView();
                            var scrollToNode = Ext.get("controls-edit-msg-list-" + commentId);
                            if (scrollToNode) {
                                this.scrollViewToNode(commentsList, scrollToNode.dom);
                            }
                            var textarea = editForm.down("textarea");
                            if (textarea) {
                                textarea.focus();
                                if (textarea.getValue()) {
                                    textarea.selectText(textarea.getValue().length);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    hideEditCommentControls: function (commentId) {
        var commentsList = this.getCommentsList(),
        commentsPanel = this.getCommentsPanel();
        if (commentsList && commentsPanel) {
            var commentEl = commentsList.getEl().down("#comment-" + commentId),
            commentMsgEl = commentEl.down(".comment-message");
            if (commentMsgEl) {
                var message = commentMsgEl.down(".comment"),
                editControlsEl = commentEl.down(".edit-info"),
                editCommentControls = Ext.getCmp("controls-edit-msg-list-" + commentId);
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
                this.editControls = undefined;
            }
        }
    },
    showEditReplyControls: function (commentId, replyId) {
        var commentsList = this.getCommentsList(),
        commentsPanel = this.getCommentsPanel();
        if (commentsList && commentsPanel) {
            var replyEl = commentsList.getEl().down("#reply-" + replyId),
            replyMsgEl = replyEl.down(".reply-message");
            if (replyMsgEl) {
                var message = replyMsgEl.down(".message"),
                editControlsEl = replyEl.down(".edit-info"),
                editReplyControls = Ext.getCmp("controls-edit-msg-list-" + replyId),
                commentsStore = this.getCommonStoreCommentsStore();
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
                                editId: "list-" + replyId,
                                renderTo: replyMsgEl,
                                msgValue: reply.get("reply"),
                                onEditHandler: this.onBtnEditReply,
                                onCancelHandler: this.onBtnCancelEditReply
                            });
                            if (editForm) {
                                commentsList.on("resize", function () {
                                    editForm.doLayout();
                                },
                                this, {
                                    delay: 100
                                });
                                this.updateCommentsScrollView();
                                var scrollToNode = Ext.get("controls-edit-msg-list-" + replyId);
                                if (scrollToNode) {
                                    this.scrollViewToNode(commentsList, scrollToNode.dom);
                                }
                                var textarea = editForm.down("textarea");
                                if (textarea) {
                                    textarea.focus();
                                    if (textarea.getValue()) {
                                        textarea.selectText(textarea.getValue().length);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    hideEditReplyControls: function (commentId, replyId) {
        var commentsList = this.getCommentsList(),
        commentsPanel = this.getCommentsPanel();
        if (commentsList && commentsPanel) {
            var replyEl = commentsList.getEl().down("#reply-" + replyId),
            replyMsgEl = replyEl.down(".reply-message");
            if (replyMsgEl) {
                var message = replyMsgEl.down(".message"),
                editControlsEl = replyEl.down(".edit-info"),
                editReplyControls = Ext.getCmp("controls-edit-msg-list-" + replyId);
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
                this.editControls = undefined;
            }
        }
    },
    showAddCommentControls: function () {
        var linkAddComment = this.getLinkAddComment(),
        containerAddComment = this.getContainerAddComment();
        if (linkAddComment && containerAddComment) {
            linkAddComment.hide();
            containerAddComment.show();
            this.hideEditControls();
            this.editControls = {
                action: "add-comment"
            };
            var textarea = Ext.getCmp("id-comment-textarea");
            if (textarea) {
                var doSetFocus = new Ext.util.DelayedTask(function () {
                    this.api.asc_enableKeyEvents(false);
                    textarea.focus();
                },
                this);
                doSetFocus.delay(100);
            }
        }
    },
    hideAddCommentControls: function () {
        var linkAddComment = this.getLinkAddComment(),
        containerAddComment = this.getContainerAddComment(),
        commentTextArea = this.getCommentTextArea();
        if (linkAddComment && containerAddComment && commentTextArea) {
            commentTextArea.setValue("");
            containerAddComment.hide();
            linkAddComment.show();
            this.editControls = undefined;
        }
    },
    showAddReplyControls: function (cmp) {
        var containerRoot = cmp.findParentBy(function (obj) {
            if (obj.getEl() && obj.getEl().hasCls("root-add-reply")) {
                return true;
            }
        });
        if (containerRoot) {
            var commentId = containerRoot.getId().match(/root-add-reply-(.+)/)[1];
            if (commentId != null && commentId.length > 0) {
                var label = containerRoot.down("#add-reply-link-" + commentId),
                controls = containerRoot.down("#controls-reply-" + commentId),
                textarea = containerRoot.down("textarea");
                if (label && controls && textarea) {
                    this.hideEditControls();
                    this.editControls = {
                        action: "add-reply",
                        component: cmp
                    };
                    label.setVisible(false);
                    controls.setVisible(true);
                    containerRoot.setHeight(80);
                    (new Ext.util.DelayedTask(function () {
                        this.api.asc_enableKeyEvents(false);
                        textarea.focus();
                    },
                    this)).delay(100);
                    var commentsList = this.getCommentsList();
                    if (commentsList) {
                        var scrollToNode = Ext.get("controls-reply-" + commentId);
                        if (scrollToNode) {
                            this.updateCommentsScrollView();
                            this.scrollViewToNode(commentsList, scrollToNode.dom);
                        }
                    }
                }
            }
        }
    },
    hideAddReplyControls: function (cmp) {
        var containerRoot = cmp.findParentBy(function (obj) {
            if (obj.getEl() && obj.getEl().hasCls("root-add-reply")) {
                return true;
            }
        });
        if (containerRoot) {
            var commentId = containerRoot.getId().match(/root-add-reply-(.+)/)[1];
            if (commentId != null && commentId.length > 0) {
                var label = containerRoot.down("#add-reply-link-" + commentId),
                controls = containerRoot.down("#controls-reply-" + commentId);
                if (label && controls) {
                    label.setVisible(true);
                    controls.setVisible(false);
                    containerRoot.setHeight(16);
                    this.editControls = undefined;
                }
            }
        }
    },
    doDelayedTask: function () {
        this.onAfterRenderAddCommentLink();
    },
    applyCommentsFilter: function (filter) {
        this.commentsFilter = filter;
        var commentsStore = this.getCommonStoreCommentsStore();
        commentsStore.clearFilter();
        if (this.commentsFilter) {
            commentsStore.filter(this.commentsFilter);
        }
        var me = this;
        if (!me.getCommentsList() || !me.getCommentsList().viewReady) {
            var _timer_ = setInterval(function () {
                if (me.getCommentsList() && me.getCommentsList().viewReady) {
                    clearInterval(_timer_);
                    me.applySort();
                }
            },
            100);
        } else {
            me.applySort();
        }
    },
    hideEditControls: function () {
        if (this.editControls) {
            switch (this.editControls.action) {
            case "add-comment":
                this.hideAddCommentControls();
                break;
            case "edit-comment":
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
    onBtnAddReply: function (cmp) {
        var containerRoot = cmp.findParentBy(function (obj) {
            if (obj.getEl() && obj.getEl().hasCls("root-add-reply")) {
                return true;
            }
        });
        if (containerRoot) {
            var textarea = containerRoot.down("textarea");
            if (textarea) {
                if (textarea.getValue() < 1) {
                    return;
                }
                var replyVal = Ext.String.trim(textarea.getValue()),
                commentId = containerRoot.getId().match(/root-add-reply-(.+)/)[1];
                if (commentId != null && commentId.length > 0) {
                    this.addReply(commentId, replyVal);
                }
            }
        }
    },
    onBtnCloseReply: function (cmp) {
        var containerRoot = cmp.findParentBy(function (obj) {
            if (obj.getEl() && obj.getEl().hasCls("root-add-reply")) {
                return true;
            }
        });
        if (containerRoot) {
            var textarea = containerRoot.down("textarea");
            if (textarea) {
                textarea.setValue("");
                this.hideAddReplyControls(cmp);
            }
        }
    },
    onFocusRetryTextArea: function (field) {
        this.showAddReplyControls(field);
    },
    onBtnEditReply: function (cmp) {
        var replyRoot = cmp.getEl().up(".reply"),
        commentRoot = cmp.getEl().up(".comment-wrap");
        if (replyRoot && commentRoot) {
            var commentId = commentRoot.id.match(/comment-(.+)/)[1],
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
        }
    },
    onBtnCancelEditReply: function (cmp) {
        var replyRoot = cmp.getEl().up(".reply"),
        commentRoot = cmp.getEl().up(".comment-wrap");
        if (replyRoot && commentRoot) {
            this.hideEditReplyControls(commentRoot.id.match(/comment-(.+)/)[1], replyRoot.id.match(/\d+/g));
        }
    },
    onKeyDownRetryTextArea: function (field, event) {
        if (event.getKey() == event.ENTER) {
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                var me = this,
                containerRoot = field.findParentBy(function (obj) {
                    if (obj.getEl() && obj.getEl().hasCls("root-add-reply")) {
                        return true;
                    }
                });
                if (containerRoot) {
                    var replyVal = Ext.String.trim(field.getValue()),
                    commentId = containerRoot.getId().match(/root-add-reply-(.+)/)[1];
                    if (commentId != null && commentId.length > 0 && replyVal.length > 0) {
                        event.stopEvent();
                        this.addReply(commentId, replyVal);
                    }
                }
            }
        }
    },
    onElasticReplyTextArea: function (cmp, width, height) {
        var parent = cmp.ownerCt,
        me = this;
        if (parent) {
            var editContainer = parent.down("container");
            if (editContainer) {
                var calculateSize = function () {
                    parent.setHeight(height + editContainer.getHeight() + 5);
                    var rootNode = parent.ownerCt;
                    if (rootNode) {
                        rootNode.setHeight(height + editContainer.getHeight() + 5);
                    }
                    me.updateCommentsScrollView();
                };
                if (editContainer.rendered) {
                    calculateSize();
                } else {
                    editContainer.on("afterrender", function (cmp) {
                        calculateSize();
                    },
                    me, {
                        single: true
                    });
                }
            }
        }
    },
    onBtnEditComment: function (cmp) {
        var commentRoot = cmp.getEl().up(".comment-wrap");
        if (commentRoot) {
            var commentId = commentRoot.id.match(/comment-(.+)/)[1];
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
            this.hideEditCommentControls(commentId);
        }
    },
    onBtnCancelEditComment: function (cmp) {
        var commentRoot = cmp.getEl().up(".comment-wrap");
        if (commentRoot) {
            this.hideEditCommentControls(commentRoot.id.match(/comment-(.+)/)[1]);
        }
    },
    onResolveComment: function (commentId) {
        var me = this,
        commentsList = this.getCommentsList(),
        menuResolve = Ext.getCmp("comments-list-menu-resolve-" + commentId);
        if (commentsList) {
            var commentEl = commentsList.getEl().down("#comment-" + commentId),
            commentResolveEl = commentEl.down(".resolve");
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
                                    id: "comments-list-menu-resolve-" + commentId,
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
    onBtnAddCommentClick: function (btn, e) {
        var commentTextArea = this.getCommentTextArea();
        if (commentTextArea) {
            if (this.addComment(commentTextArea.getValue())) {
                commentTextArea.setValue("");
            }
        }
    },
    onBtnAddAfterRender: function (cmp) {
        var btnEl = cmp.getEl(),
        commentTextArea = this.getCommentTextArea();
        btnEl.on("mousedown", function () {
            commentTextArea.emptyText = this.textEnterCommentHint;
            commentTextArea.applyEmptyText();
        },
        this);
        btnEl.on("mouseup", function () {
            commentTextArea.emptyText = " ";
            commentTextArea.applyEmptyText();
        },
        this);
    },
    onTextAreaKeyUp: function (field, event) {
        if (event.getKey() == event.ENTER) {
            field.emptyText = " ";
            field.applyEmptyText();
        }
    },
    onTextAreaKeyDown: function (field, event) {
        if (event.getKey() == event.ENTER) {
            var commentTextArea = this.getCommentTextArea();
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                if (field.getValue().length < 1) {
                    field.emptyText = this.textEnterCommentHint;
                    field.applyEmptyText();
                } else {
                    if (commentTextArea) {
                        if (this.addComment(commentTextArea.getValue())) {
                            commentTextArea.setValue("");
                        }
                    }
                }
                event.stopEvent();
            }
        }
    },
    onAfterRenderComments: function (cmp) {
        cmp.getSelectionModel().keyNav.disable();
    },
    onAfterRenderAddCommentLink: function (cmp) {
        var me = this,
        linkAddComment = this.getLinkAddComment();
        if (linkAddComment && linkAddComment.getEl()) {
            var labelEl = linkAddComment.getEl().down("label");
            if (labelEl) {
                labelEl.on("click", function (event, el) {
                    me.showAddCommentControls();
                });
            }
        }
    },
    onAddComment: function (records, index, node) {
        var me = this,
        commentsList = this.getCommentsList();
        Ext.each(records, function (record) {
            me.createAddReplyControls(record);
            me.updateHandlers(record, "comment-" + record.get("id"), {
                onResolveComment: me.onResolveComment,
                showEditCommentControls: me.showEditCommentControls,
                showEditReplyControls: me.showEditReplyControls
            });
        });
        if (commentsList) {
            this.updateCommentsScrollView(commentsList.getNode(index));
        }
        if (commentsList) {
            commentsList.fireEvent("resize");
        }
    },
    onRemoveComment: function (record, index) {
        var addReplyWidget = Ext.getCmp("root-add-reply-" + record.get("id"));
        if (addReplyWidget) {
            addReplyWidget.destroy();
        }
    },
    onUpdateComment: function (record, index, node) {
        var me = this,
        commentsList = this.getCommentsList(),
        commentId = record.get("id"),
        addReplyCmp = Ext.getCmp("root-add-reply-" + commentId);
        if (Ext.isDefined(addReplyCmp)) {
            addReplyCmp.destroy();
        }
        me.createAddReplyControls(record);
        commentsList.doComponentLayout();
        me.updateHandlers(record, "comment-" + commentId, {
            onResolveComment: me.onResolveComment,
            showEditCommentControls: me.showEditCommentControls,
            showEditReplyControls: me.showEditReplyControls
        });
        if (commentsList) {
            this.updateCommentsScrollView(commentsList.getNode(index));
        }
    },
    onViewReadyComments: function (cmp) {
        var me = this,
        commentsStore = cmp.getStore();
        commentsStore.each(function (record) {
            me.createAddReplyControls(record);
            me.updateHandlers(record, "comment-" + record.get("id"), {
                onResolveComment: me.onResolveComment,
                showEditCommentControls: me.showEditCommentControls,
                showEditReplyControls: me.showEditReplyControls
            });
        });
    },
    onRefreshComments: function (view) {
        if (view.viewReady) {
            var me = this,
            store = view.getStore(),
            idx = 0;
            store.each(function (record) {
                me.onUpdateComment(record, idx);
            });
            var nodes = view.getNodes(),
            width_parent = view.getWidth();
            width_parent = width_parent ? width_parent + "px" : "100%";
            for (var item in nodes) {
                nodes[item].style["width"] = width_parent;
            }
        }
    },
    onShowPanel: function (panel, fulscreen) {
        var activeStep = panel.down("container");
        if (activeStep && activeStep.isXType("commoncommentspanel")) {
            var replyLinkContainersList = Ext.ComponentQuery.query("container[action=comments-list-add-reply-link-container]");
            if (replyLinkContainersList) {
                Ext.each(replyLinkContainersList, function (container) {
                    var parent = container.ownerCt;
                    if (parent) {
                        parent.doLayout();
                    }
                });
            }
        }
    },
    textAddReply: "Add Reply",
    textOpenAgain: "Open Again",
    textEnterCommentHint: "Enter your comment here"
});