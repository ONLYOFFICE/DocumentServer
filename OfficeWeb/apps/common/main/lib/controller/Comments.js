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
 if (Common === undefined) {
    var Common = {};
}
Common.Controllers = Common.Controllers || {};
define(["core", "common/main/lib/model/Comment", "common/main/lib/collection/Comments", "common/main/lib/view/Comments"], function () {
    function buildCommentData() {
        if (typeof asc_CCommentDataWord !== "undefined") {
            return new asc_CCommentDataWord(null);
        }
        return new asc_CCommentData(null);
    }
    Common.Controllers.Comments = Backbone.Controller.extend(_.extend({
        models: [],
        collections: ["Common.Collections.Comments"],
        views: ["Common.Views.Comments", "Common.Views.CommentsPopover"],
        sdkViewName: "#id_main",
        subEditStrings: {},
        filter: undefined,
        hintmode: false,
        isSelectedComment: false,
        uids: [],
        oldUids: [],
        isDummyComment: false,
        initialize: function () {
            this.addListeners({
                "Common.Views.Comments": {
                    "comment:add": _.bind(this.onCreateComment, this),
                    "comment:change": _.bind(this.onChangeComment, this),
                    "comment:remove": _.bind(this.onRemoveComment, this),
                    "comment:resolve": _.bind(this.onResolveComment, this),
                    "comment:show": _.bind(this.onShowComment, this),
                    "comment:addReply": _.bind(this.onAddReplyComment, this),
                    "comment:changeReply": _.bind(this.onChangeReplyComment, this),
                    "comment:removeReply": _.bind(this.onRemoveReplyComment, this),
                    "comment:editReply": _.bind(this.onShowEditReplyComment, this),
                    "comment:closeEditing": _.bind(this.closeEditing, this),
                    "comment:disableHint": _.bind(this.disableHint, this),
                    "comment:addDummyComment": _.bind(this.onAddDummyComment, this)
                }
            });
            Common.NotificationCenter.on("comments:updatefilter", _.bind(this.onUpdateFilter, this));
        },
        onLaunch: function () {
            this.collection = this.getApplication().getCollection("Common.Collections.Comments");
            if (this.collection) {
                this.collection.comparator = function (collection) {
                    return -collection.get("time");
                };
            }
            this.popoverComments = new Common.Collections.Comments();
            if (this.popoverComments) {
                this.popoverComments.comparator = function (collection) {
                    return -collection.get("time");
                };
            }
            this.view = this.createView("Common.Views.Comments", {
                store: this.collection,
                popoverComments: this.popoverComments
            });
            this.view.render();
            this.bindViewEvents(this.view, this.events);
        },
        setConfig: function (data, api) {
            this.setApi(api);
            if (data) {
                this.currentUserId = data.config.user.id;
                this.currentUserName = data.config.user.name;
                this.sdkViewName = data["sdkviewname"] || this.sdkViewName;
                this.hintmode = data["hintmode"] || false;
            }
        },
        setApi: function (api) {
            if (api) {
                this.api = api;
                this.api.asc_registerCallback("asc_onAddComment", _.bind(this.onApiAddComment, this));
                this.api.asc_registerCallback("asc_onAddComments", _.bind(this.onApiAddComments, this));
                this.api.asc_registerCallback("asc_onRemoveComment", _.bind(this.onApiRemoveComment, this));
                this.api.asc_registerCallback("asc_onChangeComments", _.bind(this.onChangeComments, this));
                this.api.asc_registerCallback("asc_onRemoveComments", _.bind(this.onRemoveComments, this));
                this.api.asc_registerCallback("asc_onChangeCommentData", _.bind(this.onApiChangeCommentData, this));
                this.api.asc_registerCallback("asc_onLockComment", _.bind(this.onApiLockComment, this));
                this.api.asc_registerCallback("asc_onUnLockComment", _.bind(this.onApiUnLockComment, this));
                this.api.asc_registerCallback("asc_onShowComment", _.bind(this.onApiShowComment, this));
                this.api.asc_registerCallback("asc_onHideComment", _.bind(this.onApiHideComment, this));
                this.api.asc_registerCallback("asc_onUpdateCommentPosition", _.bind(this.onApiUpdateCommentPosition, this));
                this.api.asc_registerCallback("asc_onDocumentPlaceChanged", _.bind(this.onDocumentPlaceChanged, this));
            }
        },
        setMode: function (mode) {
            this.mode = mode;
            return this;
        },
        onCreateComment: function (panel, commentVal, editMode, hidereply, documentFlag) {
            if (this.api && commentVal && commentVal.length > 0) {
                var comment = buildCommentData();
                if (comment) {
                    this.showPopover = true;
                    this.editPopover = editMode ? true : false;
                    this.hidereply = hidereply;
                    this.isSelectedComment = false;
                    this.uids = [];
                    comment.asc_putText(commentVal);
                    comment.asc_putTime(this.utcDateToString(new Date()));
                    comment.asc_putUserId(this.currentUserId);
                    comment.asc_putUserName(this.currentUserName);
                    comment.asc_putSolved(false);
                    if (!_.isUndefined(comment.asc_putDocumentFlag)) {
                        comment.asc_putDocumentFlag(documentFlag);
                    }
                    this.api.asc_addComment(comment);
                    this.view.showEditContainer(false);
                }
            }
            this.view.txtComment.focus();
        },
        onRemoveComment: function (id) {
            if (this.api && id) {
                this.api.asc_removeComment(id);
            }
        },
        onResolveComment: function (uid, id) {
            var t = this,
            reply = null,
            addReply = null,
            ascComment = buildCommentData(),
            comment = t.findComment(uid, id);
            if (_.isUndefined(uid)) {
                uid = comment.get("uid");
            }
            if (ascComment && comment) {
                ascComment.asc_putText(comment.get("comment"));
                ascComment.asc_putQuoteText(comment.get("quote"));
                ascComment.asc_putTime(t.utcDateToString(new Date(comment.get("time"))));
                ascComment.asc_putUserId(t.currentUserId);
                ascComment.asc_putUserName(t.currentUserName);
                ascComment.asc_putSolved(!comment.get("resolved"));
                if (!_.isUndefined(ascComment.asc_putDocumentFlag)) {
                    ascComment.asc_putDocumentFlag(comment.get("unattached"));
                }
                reply = comment.get("replys");
                if (reply && reply.length) {
                    reply.forEach(function (reply) {
                        addReply = buildCommentData();
                        if (addReply) {
                            addReply.asc_putText(reply.get("reply"));
                            addReply.asc_putTime(t.utcDateToString(new Date(reply.get("time"))));
                            addReply.asc_putUserId(reply.get("userid"));
                            addReply.asc_putUserName(reply.get("username"));
                            ascComment.asc_addReply(addReply);
                        }
                    });
                }
                t.api.asc_changeComment(uid, ascComment);
                return true;
            }
            return false;
        },
        onShowComment: function (id, selected) {
            var comment = this.findComment(id, undefined);
            if (comment) {
                if (null !== comment.get("quote")) {
                    if (this.api) {
                        if (this.hintmode) {
                            this.animate = true;
                            if (comment.get("unattached")) {
                                if (this.getPopover()) {
                                    this.getPopover().hide();
                                    return;
                                }
                            }
                        } else {
                            var model = this.popoverComments.findWhere({
                                uid: id
                            });
                            if (model) {
                                return;
                            }
                        }
                        if (!_.isUndefined(selected) && this.hintmode) {
                            this.isSelectedComment = selected;
                        }
                        this.api.asc_selectComment(id);
                        this.api.asc_showComment(id, false);
                    }
                } else {
                    if (this.hintmode) {
                        this.api.asc_selectComment(id);
                    }
                    if (this.getPopover()) {
                        this.getPopover().hide();
                    }
                    this.isSelectedComment = false;
                    this.uids = [];
                }
            }
        },
        onChangeComment: function (id, commentVal) {
            if (commentVal && commentVal.length > 0) {
                var t = this,
                comment2 = null,
                reply = null,
                addReply = null,
                ascComment = buildCommentData(),
                comment = t.findComment(id);
                if (comment && ascComment) {
                    ascComment.asc_putText(commentVal);
                    ascComment.asc_putQuoteText(comment.get("quote"));
                    ascComment.asc_putTime(t.utcDateToString(new Date(comment.get("time"))));
                    ascComment.asc_putUserId(t.currentUserId);
                    ascComment.asc_putUserName(t.currentUserName);
                    ascComment.asc_putSolved(comment.get("resolved"));
                    if (!_.isUndefined(ascComment.asc_putDocumentFlag)) {
                        ascComment.asc_putDocumentFlag(comment.get("unattached"));
                    }
                    comment.set("editTextInPopover", false);
                    comment2 = t.findPopupComment(id);
                    if (comment2) {
                        comment2.set("editTextInPopover", false);
                    }
                    if (t.subEditStrings[id]) {
                        delete t.subEditStrings[id];
                    }
                    if (t.subEditStrings[id + "-R"]) {
                        delete t.subEditStrings[id + "-R"];
                    }
                    reply = comment.get("replys");
                    if (reply && reply.length) {
                        reply.forEach(function (reply) {
                            addReply = buildCommentData();
                            if (addReply) {
                                addReply.asc_putText(reply.get("reply"));
                                addReply.asc_putTime(t.utcDateToString(new Date(reply.get("time"))));
                                addReply.asc_putUserId(reply.get("userid"));
                                addReply.asc_putUserName(reply.get("username"));
                                ascComment.asc_addReply(addReply);
                            }
                        });
                    }
                    t.api.asc_changeComment(id, ascComment);
                    return true;
                }
            }
            return false;
        },
        onChangeReplyComment: function (id, replyId, replyVal) {
            if (replyVal && replyVal.length > 0) {
                var me = this,
                reply = null,
                addReply = null,
                ascComment = buildCommentData(),
                comment = me.findComment(id);
                if (ascComment && comment) {
                    ascComment.asc_putText(comment.get("comment"));
                    ascComment.asc_putQuoteText(comment.get("quote"));
                    ascComment.asc_putTime(me.utcDateToString(new Date(comment.get("time"))));
                    ascComment.asc_putUserId(comment.get("userid"));
                    ascComment.asc_putUserName(comment.get("username"));
                    ascComment.asc_putSolved(comment.get("resolved"));
                    if (!_.isUndefined(ascComment.asc_putDocumentFlag)) {
                        ascComment.asc_putDocumentFlag(comment.get("unattached"));
                    }
                    reply = comment.get("replys");
                    if (reply && reply.length) {
                        reply.forEach(function (reply) {
                            addReply = buildCommentData();
                            if (addReply) {
                                if (reply.get("id") === replyId && !_.isUndefined(replyVal)) {
                                    addReply.asc_putText(replyVal);
                                    addReply.asc_putUserId(me.currentUserId);
                                    addReply.asc_putUserName(me.currentUserName);
                                } else {
                                    addReply.asc_putText(reply.get("reply"));
                                    addReply.asc_putUserId(reply.get("userid"));
                                    addReply.asc_putUserName(reply.get("username"));
                                }
                                addReply.asc_putTime(me.utcDateToString(new Date(reply.get("time"))));
                                ascComment.asc_addReply(addReply);
                            }
                        });
                    }
                    me.api.asc_changeComment(id, ascComment);
                    return true;
                }
            }
            return false;
        },
        onAddReplyComment: function (id, replyVal) {
            if (replyVal.length > 0) {
                var me = this,
                uid = null,
                reply = null,
                addReply = null,
                ascComment = buildCommentData(),
                comment = me.findComment(id);
                if (ascComment && comment) {
                    uid = comment.get("uid");
                    if (uid) {
                        if (me.subEditStrings[uid]) {
                            delete me.subEditStrings[uid];
                        }
                        if (me.subEditStrings[uid + "-R"]) {
                            delete me.subEditStrings[uid + "-R"];
                        }
                        comment.set("showReplyInPopover", false);
                    }
                    ascComment.asc_putText(comment.get("comment"));
                    ascComment.asc_putQuoteText(comment.get("quote"));
                    ascComment.asc_putTime(me.utcDateToString(new Date(comment.get("time"))));
                    ascComment.asc_putUserId(comment.get("userid"));
                    ascComment.asc_putUserName(comment.get("username"));
                    ascComment.asc_putSolved(comment.get("resolved"));
                    if (!_.isUndefined(ascComment.asc_putDocumentFlag)) {
                        ascComment.asc_putDocumentFlag(comment.get("unattached"));
                    }
                    reply = comment.get("replys");
                    if (reply && reply.length) {
                        reply.forEach(function (reply) {
                            addReply = buildCommentData();
                            if (addReply) {
                                addReply.asc_putText(reply.get("reply"));
                                addReply.asc_putTime(me.utcDateToString(new Date(reply.get("time"))));
                                addReply.asc_putUserId(reply.get("userid"));
                                addReply.asc_putUserName(reply.get("username"));
                                ascComment.asc_addReply(addReply);
                            }
                        });
                    }
                    addReply = buildCommentData();
                    if (addReply) {
                        addReply.asc_putText(replyVal);
                        addReply.asc_putTime(me.utcDateToString(new Date()));
                        addReply.asc_putUserId(me.currentUserId);
                        addReply.asc_putUserName(me.currentUserName);
                        ascComment.asc_addReply(addReply);
                        me.api.asc_changeComment(id, ascComment);
                        return true;
                    }
                }
            }
            return false;
        },
        onRemoveReplyComment: function (id, replyId) {
            if (!_.isUndefined(id) && !_.isUndefined(replyId)) {
                var me = this,
                replies = null,
                addReply = null,
                ascComment = buildCommentData(),
                comment = me.findComment(id);
                if (ascComment && comment) {
                    ascComment.asc_putText(comment.get("comment"));
                    ascComment.asc_putQuoteText(comment.get("quote"));
                    ascComment.asc_putTime(me.utcDateToString(new Date(comment.get("time"))));
                    ascComment.asc_putUserId(comment.get("userid"));
                    ascComment.asc_putUserName(comment.get("username"));
                    ascComment.asc_putSolved(comment.get("resolved"));
                    if (!_.isUndefined(ascComment.asc_putDocumentFlag)) {
                        ascComment.asc_putDocumentFlag(comment.get("unattached"));
                    }
                    replies = comment.get("replys");
                    if (replies && replies.length) {
                        replies.forEach(function (reply) {
                            if (reply.get("id") !== replyId) {
                                addReply = buildCommentData();
                                if (addReply) {
                                    addReply.asc_putText(reply.get("reply"));
                                    addReply.asc_putTime(me.utcDateToString(new Date(reply.get("time"))));
                                    addReply.asc_putUserId(reply.get("userid"));
                                    addReply.asc_putUserName(reply.get("username"));
                                    ascComment.asc_addReply(addReply);
                                }
                            }
                        });
                    }
                    me.api.asc_changeComment(id, ascComment);
                    return true;
                }
            }
            return false;
        },
        onShowEditReplyComment: function (id, replyId, inpopover) {
            var i, model, repliesSrc, repliesCopy;
            if (!_.isUndefined(id) && !_.isUndefined(replyId)) {
                if (inpopover) {
                    model = this.popoverComments.findWhere({
                        uid: id
                    });
                    if (model) {
                        repliesSrc = model.get("replys");
                        repliesCopy = _.clone(model.get("replys"));
                        if (repliesCopy) {
                            for (i = 0; i < repliesCopy.length; ++i) {
                                if (replyId === repliesCopy[i].get("id")) {
                                    repliesCopy[i].set("editTextInPopover", true);
                                    repliesSrc.length = 0;
                                    model.set("replys", repliesCopy);
                                    return true;
                                }
                            }
                        }
                    }
                } else {
                    model = this.collection.findWhere({
                        uid: id
                    });
                    if (model) {
                        repliesSrc = model.get("replys");
                        repliesCopy = _.clone(model.get("replys"));
                        if (repliesCopy) {
                            for (i = 0; i < repliesCopy.length; ++i) {
                                if (replyId === repliesCopy[i].get("id")) {
                                    repliesCopy[i].set("editText", true);
                                    repliesSrc.length = 0;
                                    model.set("replys", repliesCopy);
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        },
        onUpdateFilter: function (filter, applyOnly) {
            if (filter) {
                this.filter = {
                    property: filter.property,
                    value: filter.value
                };
                if (!applyOnly) {
                    if (this.getPopover()) {
                        this.getPopover().hide();
                    }
                }
                var t = this,
                endComment = null;
                this.collection.each(function (model) {
                    var prop = model.get(t.filter.property);
                    if (prop) {
                        model.set("hide", (null === prop.match(t.filter.value)));
                    }
                    if (model.get("last")) {
                        model.set("last", false);
                    }
                    if (!model.get("hide")) {
                        endComment = model;
                    }
                });
                if (endComment) {
                    endComment.set("last", true);
                }
            }
        },
        onApiAddComment: function (id, data) {
            var comment = this.readSDKComment(id, data);
            if (comment) {
                this.collection.push(comment);
                this.updateComments(true);
                if (this.showPopover) {
                    if (null !== data.asc_getQuoteText()) {
                        this.api.asc_selectComment(id);
                        this.api.asc_showComment(id, true);
                    }
                    this.showPopover = undefined;
                    this.editPopover = false;
                }
            }
        },
        onApiAddComments: function (data) {
            for (var i = 0; i < data.length; ++i) {
                var comment = this.readSDKComment(data[i].Id, data[i].Comment);
                this.collection.push(comment);
            }
            this.updateComments(true);
        },
        onApiRemoveComment: function (id, silentUpdate) {
            if (this.collection.length) {
                var model = this.collection.findWhere({
                    uid: id
                });
                if (model) {
                    this.collection.remove(model);
                    if (!silentUpdate) {
                        this.updateComments(true);
                    }
                }
                if (this.popoverComments.length) {
                    model = this.popoverComments.findWhere({
                        uid: id
                    });
                    if (model) {
                        this.popoverComments.remove(model);
                        if (0 === this.popoverComments.length) {
                            if (this.getPopover()) {
                                this.getPopover().hide();
                            }
                        }
                    }
                }
            }
        },
        onChangeComments: function (data) {
            for (var i = 0; i < data.length; ++i) {
                this.onApiChangeCommentData(data[i].Comment.Id, data[i].Comment, true);
            }
            this.updateComments(true);
        },
        onRemoveComments: function (data) {
            for (var i = 0; i < data.length; ++i) {
                this.onApiRemoveComment(data[i], true);
            }
            this.updateComments(true);
        },
        onApiChangeCommentData: function (id, data, silentUpdate) {
            var t = this,
            i = 0,
            date = null,
            replies = null,
            repliesCount = 0,
            dateReply = null,
            comment = this.findComment(id);
            if (comment) {
                t = this;
                date = (data.asc_getTime() == "") ? new Date() : new Date(this.stringUtcToLocalDate(data.asc_getTime()));
                comment.set("comment", data.asc_getText());
                comment.set("userid", data.asc_getUserId());
                comment.set("username", data.asc_getUserName());
                comment.set("resolved", data.asc_getSolved());
                comment.set("quote", data.asc_getQuoteText());
                comment.set("time", date.getTime());
                comment.set("date", t.dateToLocaleTimeString(date));
                replies = _.clone(comment.get("replys"));
                replies.length = 0;
                repliesCount = data.asc_getRepliesCount();
                for (i = 0; i < repliesCount; ++i) {
                    dateReply = (data.asc_getReply(i).asc_getTime() == "") ? new Date() : new Date(this.stringUtcToLocalDate(data.asc_getReply(i).asc_getTime()));
                    replies.push(new Common.Models.Reply({
                        id: Common.UI.getId(),
                        userid: data.asc_getReply(i).asc_getUserId(),
                        username: data.asc_getReply(i).asc_getUserName(),
                        date: t.dateToLocaleTimeString(dateReply),
                        reply: data.asc_getReply(i).asc_getText(),
                        time: dateReply.getTime(),
                        editText: false,
                        editTextInPopover: false,
                        showReplyInPopover: false,
                        scope: t.view
                    }));
                }
                replies.sort(function (a, b) {
                    return a.get("time") - b.get("time");
                });
                comment.set("replys", replies);
                if (!silentUpdate) {
                    this.updateComments(false, true);
                    if (this.getPopover() && this.getPopover().isVisible()) {
                        this.api.asc_showComment(id, true);
                    }
                }
            }
        },
        onApiLockComment: function (id, userId) {
            var cur = this.findComment(id),
            usersStore = null,
            user = null;
            if (cur) {
                usersStore = this.getApplication().getCollection("Common.Collections.Users");
                if (usersStore) {
                    user = usersStore.findWhere({
                        id: userId
                    });
                    if (user) {
                        cur.set("lock", true);
                        cur.set("lockuserid", this.view.getUserName(user.get("username")));
                    }
                }
            }
        },
        onApiUnLockComment: function (id) {
            var cur = this.findComment(id);
            if (cur) {
                cur.set("lock", false);
            }
        },
        onApiShowComment: function (uids, posX, posY, leftX, opts, hint) {
            if (hint && this.isSelectedComment && (0 === _.difference(this.uids, uids).length)) {
                return;
            }
            if (this.mode && !this.mode.canComments) {
                hint = true;
            }
            if (this.getPopover()) {
                this.clearDummyComment();
                if (this.isSelectedComment && (0 === _.difference(this.uids, uids).length)) {
                    if (this.api) {
                        this.getPopover().commentsView.setFocusToTextBox(true);
                        this.api.asc_enableKeyEvents(true);
                    }
                    return;
                }
                var i = 0,
                saveTxtId = "",
                saveTxtReplyId = "",
                comment = null,
                text = "",
                animate = true;
                this.popoverComments.reset();
                for (i = 0; i < uids.length; ++i) {
                    saveTxtId = uids[i];
                    saveTxtReplyId = uids[i] + "-R";
                    comment = this.findComment(saveTxtId);
                    if (this.subEditStrings[saveTxtId]) {
                        comment.set("editTextInPopover", true);
                        text = this.subEditStrings[saveTxtId];
                    } else {
                        if (this.subEditStrings[saveTxtReplyId]) {
                            comment.set("showReplyInPopover", true);
                            text = this.subEditStrings[saveTxtReplyId];
                        }
                    }
                    comment.set("hint", !_.isUndefined(hint) ? hint : false);
                    if (!hint && this.hintmode) {
                        if (0 === _.difference(this.uids, uids).length && (this.uids.length === 0)) {
                            animate = false;
                        }
                        if (this.oldUids.length && (0 === _.difference(this.oldUids, uids).length)) {
                            animate = false;
                            this.oldUids = [];
                        }
                    }
                    if (this.animate) {
                        animate = this.animate;
                        this.animate = false;
                    }
                    this.isSelectedComment = !hint;
                    this.uids = _.clone(uids);
                    this.popoverComments.push(comment);
                }
                if (this.getPopover().isVisible()) {
                    this.getPopover().hide();
                }
                this.getPopover().setLeftTop(posX, posY, leftX);
                this.getPopover().show(animate, false, true, text);
            }
        },
        onApiHideComment: function (hint) {
            var t = this;
            if (this.getPopover()) {
                if (this.isSelectedComment && hint) {
                    return;
                }
                this.popoverComments.each(function (model) {
                    if (model.get("editTextInPopover")) {
                        t.subEditStrings[model.get("uid")] = t.getPopover().getEditText();
                    }
                    if (model.get("showReplyInPopover")) {
                        t.subEditStrings[model.get("uid") + "-R"] = t.getPopover().getEditText();
                    }
                });
                this.getPopover().saveText(true);
                this.getPopover().hide();
                this.collection.clearEditing();
                this.popoverComments.clearEditing();
                this.oldUids = _.clone(this.uids);
                this.isSelectedComment = false;
                this.uids = [];
                this.popoverComments.reset();
            }
        },
        onApiUpdateCommentPosition: function (uids, posX, posY, leftX) {
            var i, useAnimation = false,
            comment = null,
            text = undefined,
            saveTxtId = "",
            saveTxtReplyId = "";
            if (this.getPopover()) {
                this.getPopover().saveText();
                if (posY < 0 || this.getPopover().sdkBounds.height < posY || (!_.isUndefined(leftX) && this.getPopover().sdkBounds.width < leftX)) {
                    this.getPopover().hide();
                } else {
                    if (0 === this.popoverComments.length) {
                        this.popoverComments.reset();
                        for (i = 0; i < uids.length; ++i) {
                            saveTxtId = uids[i];
                            saveTxtReplyId = uids[i] + "-R";
                            comment = this.findComment(saveTxtId);
                            if (this.subEditStrings[saveTxtId]) {
                                comment.set("editTextInPopover", true);
                                text = this.subEditStrings[saveTxtId];
                            } else {
                                if (this.subEditStrings[saveTxtReplyId]) {
                                    comment.set("showReplyInPopover", true);
                                    text = this.subEditStrings[saveTxtReplyId];
                                }
                            }
                            this.popoverComments.push(comment);
                        }
                        useAnimation = true;
                        this.getPopover().show(useAnimation, undefined, undefined, text);
                    } else {
                        if (!this.getPopover().isVisible()) {
                            this.getPopover().show(false, undefined, undefined, text);
                        }
                    }
                    this.getPopover().setLeftTop(posX, posY, leftX);
                }
            }
        },
        onDocumentPlaceChanged: function () {
            if (this.isDummyComment && this.getPopover()) {
                if (this.getPopover().isVisible()) {
                    var anchor = this.api.asc_getAnchorPosition();
                    if (anchor) {
                        this.getPopover().setLeftTop(anchor.asc_getX() + anchor.asc_getWidth(), anchor.asc_getY(), this.hintmode ? anchor.asc_getX() : undefined);
                    }
                }
            }
        },
        updateComments: function (needRender, disableSort) {
            var i, end = true;
            if (_.isUndefined(disableSort)) {
                this.collection.sort();
            }
            if (needRender) {
                for (i = this.collection.length - 1; i >= 0; --i) {
                    if (end) {
                        this.collection.at(i).set("last", true, {
                            silent: true
                        });
                    } else {
                        if (this.collection.at(i).get("last")) {
                            this.collection.at(i).set("last", false, {
                                silent: true
                            });
                        }
                    }
                    end = false;
                }
                this.onUpdateFilter(this.filter, true);
                this.view.render();
            }
            this.view.renderResolvedComboButtons();
            this.view.update();
        },
        findComment: function (uid, id) {
            if (_.isUndefined(uid)) {
                return this.collection.findWhere({
                    id: id
                });
            }
            return this.collection.findWhere({
                uid: uid
            });
        },
        findPopupComment: function (id) {
            return this.popoverComments.findWhere({
                id: id
            });
        },
        closeEditing: function (id) {
            var t = this;
            if (!_.isUndefined(id)) {
                var comment2 = this.findPopupComment(id);
                if (comment2) {
                    comment2.set("editTextInPopover", false);
                    comment2.set("showReplyInPopover", false);
                }
                if (this.subEditStrings[id]) {
                    delete this.subEditStrings[id];
                }
                if (this.subEditStrings[id + "-R"]) {
                    delete this.subEditStrings[id + "-R"];
                }
            }
            this.collection.clearEditing();
            this.collection.each(function (model) {
                var replies = _.clone(model.get("replys"));
                model.get("replys").length = 0;
                replies.forEach(function (reply) {
                    if (reply.get("editText")) {
                        reply.set("editText", false);
                    }
                    if (reply.get("editTextInPopover")) {
                        reply.set("editTextInPopover", false);
                    }
                });
                model.set("replys", replies);
            });
            this.view.showEditContainer(false);
            this.view.update();
        },
        disableHint: function (comment) {
            if (comment && this.mode.canComments) {
                comment.set("hint", false);
                this.isSelectedComment = true;
            }
        },
        blockPopover: function (flag) {
            this.isSelectedComment = flag;
            if (flag) {
                if (this.getPopover().isVisible()) {
                    this.getPopover().hide();
                }
            }
        },
        getPopover: function () {
            return this.view.getPopover(this.sdkViewName);
        },
        readSDKComment: function (id, data) {
            var date = (data.asc_getTime() == "") ? new Date() : new Date(this.stringUtcToLocalDate(data.asc_getTime()));
            var comment = new Common.Models.Comment({
                uid: id,
                userid: data.asc_getUserId(),
                username: data.asc_getUserName(),
                date: this.dateToLocaleTimeString(date),
                quote: data.asc_getQuoteText(),
                comment: data.asc_getText(),
                resolved: data.asc_getSolved(),
                unattached: !_.isUndefined(data.asc_getDocumentFlag) ? data.asc_getDocumentFlag() : false,
                id: Common.UI.getId(),
                time: date.getTime(),
                showReply: false,
                editText: false,
                last: undefined,
                editTextInPopover: (this.editPopover ? true : false),
                showReplyInPopover: false,
                hideAddReply: !_.isUndefined(this.hidereply) ? this.hidereply : (this.showPopover ? true : false),
                scope: this.view
            });
            if (comment) {
                var replies = this.readSDKReplies(data);
                if (replies.length) {
                    comment.set("replys", replies);
                }
            }
            return comment;
        },
        readSDKReplies: function (data) {
            var i = 0,
            replies = [],
            date = null;
            var repliesCount = data.asc_getRepliesCount();
            if (repliesCount) {
                for (i = 0; i < repliesCount; ++i) {
                    date = (data.asc_getReply(i).asc_getTime() == "") ? new Date() : new Date(this.stringUtcToLocalDate(data.asc_getReply(i).asc_getTime()));
                    replies.push(new Common.Models.Reply({
                        id: Common.UI.getId(),
                        userid: data.asc_getReply(i).asc_getUserId(),
                        username: data.asc_getReply(i).asc_getUserName(),
                        date: this.dateToLocaleTimeString(date),
                        reply: data.asc_getReply(i).asc_getText(),
                        time: date.getTime(),
                        editText: false,
                        editTextInPopover: false,
                        showReplyInPopover: false,
                        scope: this.view
                    }));
                }
                replies.sort(function (a, b) {
                    return a.get("time") - b.get("time");
                });
            }
            return replies;
        },
        addDummyComment: function () {
            if (this.api) {
                var me = this,
                anchor = null,
                date = new Date(),
                dialog = this.getPopover();
                if (dialog) {
                    if (this.popoverComments.length) {
                        _.delay(function () {
                            me.api.asc_enableKeyEvents(false);
                            dialog.commentsView.setFocusToTextBox();
                        },
                        200);
                        return;
                    }
                    var comment = new Common.Models.Comment({
                        id: -1,
                        time: date.getTime(),
                        date: this.dateToLocaleTimeString(date),
                        userid: this.currentUserId,
                        username: this.currentUserName,
                        editTextInPopover: true,
                        showReplyInPopover: false,
                        hideAddReply: true,
                        scope: this.view,
                        dummy: true
                    });
                    this.popoverComments.reset();
                    this.popoverComments.push(comment);
                    this.uids = [];
                    this.isSelectedComment = true;
                    this.isDummyComment = true;
                    if (!_.isUndefined(this.api.asc_SetDocumentPlaceChangedEnabled)) {
                        me.api.asc_SetDocumentPlaceChangedEnabled(true);
                    }
                    dialog.handlerHide = (function () {});
                    if (dialog.isVisible()) {
                        dialog.hide();
                    }
                    dialog.handlerHide = (function () {
                        me.clearDummyComment();
                    });
                    anchor = this.api.asc_getAnchorPosition();
                    if (anchor) {
                        dialog.setLeftTop(anchor.asc_getX() + anchor.asc_getWidth(), anchor.asc_getY(), this.hintmode ? anchor.asc_getX() : undefined);
                        dialog.show(true, false, true);
                    }
                }
            }
        },
        onAddDummyComment: function (commentVal) {
            if (this.api && commentVal && commentVal.length > 0) {
                var comment = buildCommentData();
                if (comment) {
                    this.showPopover = true;
                    this.editPopover = false;
                    this.hidereply = false;
                    this.isSelectedComment = false;
                    this.uids = [];
                    this.isDummyComment = false;
                    this.popoverComments.reset();
                    comment.asc_putText(commentVal);
                    comment.asc_putTime(this.utcDateToString(new Date()));
                    comment.asc_putUserId(this.currentUserId);
                    comment.asc_putUserName(this.currentUserName);
                    comment.asc_putSolved(false);
                    if (!_.isUndefined(comment.asc_putDocumentFlag)) {
                        comment.asc_putDocumentFlag(false);
                    }
                    this.api.asc_addComment(comment);
                    this.view.showEditContainer(false);
                    if (!_.isUndefined(this.api.asc_SetDocumentPlaceChangedEnabled)) {
                        this.api.asc_SetDocumentPlaceChangedEnabled(false);
                    }
                }
            }
        },
        clearDummyComment: function () {
            if (this.isDummyComment) {
                this.isDummyComment = false;
                this.showPopover = true;
                this.editPopover = false;
                this.hidereply = false;
                this.isSelectedComment = false;
                this.uids = [];
                var dialog = this.getPopover();
                if (dialog) {
                    dialog.handlerHide = (function () {});
                    if (dialog.isVisible()) {
                        dialog.hide();
                    }
                }
                this.popoverComments.reset();
                if (!_.isUndefined(this.api.asc_SetDocumentPlaceChangedEnabled)) {
                    this.api.asc_SetDocumentPlaceChangedEnabled(false);
                }
            }
        },
        onEditComments: function (comments) {
            if (this.api) {
                var i = 0,
                t = this,
                comment = null;
                var anchor = this.api.asc_getAnchorPosition();
                if (anchor) {
                    this.isSelectedComment = true;
                    this.popoverComments.reset();
                    for (i = 0; i < comments.length; ++i) {
                        comment = this.findComment(comments[i].asc_getId());
                        comment.set("editTextInPopover", true);
                        comment.set("hint", false);
                        this.popoverComments.push(comment);
                    }
                    if (this.getPopover()) {
                        if (this.getPopover().isVisible()) {
                            this.getPopover().hide();
                        }
                        this.getPopover().setLeftTop(anchor.asc_getX() + anchor.asc_getWidth(), anchor.asc_getY(), this.hintmode ? anchor.asc_getX() : undefined);
                        this.getPopover().show(true, false, true);
                    }
                }
            }
        },
        focusOnInput: function () {
            if (this.view && this.api) {
                var panel = $("#comments-new-comment-ct", this.view.el);
                if (panel && panel.length) {
                    if ("none" !== panel.css("display")) {
                        this.api.asc_enableKeyEvents(false);
                        this.view.txtComment.focus();
                    }
                }
            }
        },
        timeZoneOffsetInMs: (new Date()).getTimezoneOffset() * 60000,
        stringUtcToLocalDate: function (date) {
            if (typeof date === "string") {
                return parseInt(date) + this.timeZoneOffsetInMs;
            }
            return 0;
        },
        utcDateToString: function (date) {
            if (Object.prototype.toString.call(date) === "[object Date]") {
                return (date.getTime() - this.timeZoneOffsetInMs).toString();
            }
            return "";
        },
        dateToLocaleTimeString: function (date) {
            function format(date) {
                var strTime, hours = date.getHours(),
                minutes = date.getMinutes(),
                ampm = hours >= 12 ? "pm" : "am";
                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                strTime = hours + ":" + minutes + " " + ampm;
                return strTime;
            }
            return (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + date.getFullYear() + " " + format(date);
        }
    },
    Common.Controllers.Comments || {}));
});