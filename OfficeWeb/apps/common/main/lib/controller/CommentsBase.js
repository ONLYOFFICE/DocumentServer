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
 Ext.define("Common.controller.CommentsBase", {
    extend: "Ext.app.Controller",
    models: ["Common.model.Reply", "Common.model.Comment"],
    stores: ["Common.store.Comments", "Common.store.Users"],
    config: {
        currentUserId: undefined,
        currentUserName: undefined
    },
    timeZoneOffsetInMs: (new Date()).getTimezoneOffset() * 60000,
    init: function () {},
    loadConfig: function (data) {
        this.setCurrentUserId(data.config.user.id);
        this.setCurrentUserName(data.config.user.name);
    },
    setApi: function (o) {
        this.api = o;
    },
    utcDateToString: function (date) {
        if (Object.prototype.toString.call(date) === "[object Date]") {
            return (date.getTime() - this.timeZoneOffsetInMs).toString();
        }
        return "";
    },
    addComment: function (comment) {
        if (this.api) {
            var commentVal = Ext.String.trim(comment);
            if (commentVal.length > 0) {
                var ascCommentData = new asc_CCommentData();
                if (ascCommentData) {
                    ascCommentData.asc_putText(commentVal);
                    ascCommentData.asc_putTime(this.utcDateToString(new Date()));
                    ascCommentData.asc_putUserId(this.getCurrentUserId());
                    ascCommentData.asc_putUserName(this.getCurrentUserName());
                    ascCommentData.asc_putSolved(false);
                    this.api.asc_addComment(ascCommentData);
                }
            }
        }
    },
    resolveComment: function (commentId, resolve) {
        if (this.api) {
            var commentsStore = this.getCommonStoreCommentsStore(),
            ascCommentData = new asc_CCommentData(),
            me = this;
            if (commentsStore && ascCommentData) {
                var currentCommentData = commentsStore.findRecord("id", commentId);
                if (currentCommentData) {
                    ascCommentData.asc_putText(currentCommentData.get("comment"));
                    ascCommentData.asc_putQuoteText(currentCommentData.get("quote"));
                    ascCommentData.asc_putTime(this.utcDateToString(new Date(currentCommentData.get("date"))));
                    ascCommentData.asc_putUserId(currentCommentData.get("userid"));
                    ascCommentData.asc_putUserName(currentCommentData.get("username"));
                    ascCommentData.asc_putSolved(resolve);
                    currentCommentData.replys().each(function (reply) {
                        var addReply = new asc_CCommentData();
                        addReply.asc_putText(reply.get("reply"));
                        addReply.asc_putTime(me.utcDateToString(new Date(reply.get("date"))));
                        addReply.asc_putUserId(reply.get("userid"));
                        addReply.asc_putUserName(reply.get("username"));
                        ascCommentData.asc_addReply(addReply);
                    });
                    this.api.asc_changeComment(commentId, ascCommentData);
                }
            }
        }
    },
    editComment: function (commentId, newComment) {
        if (this.api) {
            var commentVal = Ext.String.trim(newComment),
            commentsStore = this.getCommonStoreCommentsStore(),
            me = this;
            if (commentVal.length > 0) {
                var ascCommentData = new asc_CCommentData(),
                currentCommentData = commentsStore.findRecord("id", commentId);
                if (ascCommentData) {
                    ascCommentData.asc_putText(commentVal);
                    ascCommentData.asc_putQuoteText(currentCommentData.get("quote"));
                    ascCommentData.asc_putTime(this.utcDateToString(new Date(currentCommentData.get("date"))));
                    ascCommentData.asc_putUserId(this.getCurrentUserId());
                    ascCommentData.asc_putUserName(this.getCurrentUserName());
                    ascCommentData.asc_putSolved(currentCommentData.get("resolved"));
                    currentCommentData.replys().each(function (reply) {
                        var addReply = new asc_CCommentData();
                        addReply.asc_putText(reply.get("reply"));
                        addReply.asc_putTime(me.utcDateToString(new Date(reply.get("date"))));
                        addReply.asc_putUserId(reply.get("userid"));
                        addReply.asc_putUserName(reply.get("username"));
                        ascCommentData.asc_addReply(addReply);
                    });
                    this.api.asc_changeComment(commentId, ascCommentData);
                }
            }
        }
    },
    deleteComment: function (commentId) {
        if (this.api) {
            this.api.asc_removeComment(commentId);
        }
    },
    selectComment: function (commentId) {
        if (this.api) {
            this.api.asc_selectComment(commentId);
            this.api.asc_showComment(commentId);
        }
    },
    addReply: function (commentId, reply) {
        if (this.api) {
            var replyVal = Ext.String.trim(reply),
            commentsStore = this.getCommonStoreCommentsStore(),
            me = this;
            if (commentsStore && reply.length > 0) {
                var ascCommentData = new asc_CCommentData(),
                currentCommentData = commentsStore.findRecord("id", commentId);
                if (ascCommentData && currentCommentData) {
                    ascCommentData.asc_putText(currentCommentData.get("comment"));
                    ascCommentData.asc_putQuoteText(currentCommentData.get("quote"));
                    ascCommentData.asc_putTime(this.utcDateToString(new Date(currentCommentData.get("date"))));
                    ascCommentData.asc_putUserId(currentCommentData.get("userid"));
                    ascCommentData.asc_putUserName(currentCommentData.get("username"));
                    ascCommentData.asc_putSolved(currentCommentData.get("resolved"));
                    var appendComment = function (data) {
                        var addReply = new asc_CCommentData();
                        addReply.asc_putText(data.reply);
                        addReply.asc_putTime(data.date);
                        addReply.asc_putUserId(data.userid);
                        addReply.asc_putUserName(data.username);
                        ascCommentData.asc_addReply(addReply);
                    };
                    appendComment({
                        reply: replyVal,
                        date: this.utcDateToString(new Date()),
                        userid: this.getCurrentUserId(),
                        username: this.getCurrentUserName()
                    });
                    currentCommentData.replys().each(function (reply) {
                        appendComment({
                            reply: reply.get("reply"),
                            date: me.utcDateToString(new Date(reply.get("date"))),
                            userid: reply.get("userid"),
                            username: reply.get("username")
                        });
                    });
                    this.api.asc_changeComment(commentId, ascCommentData);
                    return true;
                }
            }
        }
        return false;
    },
    editReply: function (commentId, replyId, newReply) {
        if (this.api) {
            var replyVal = Ext.String.trim(newReply),
            me = this,
            commentsStore = this.getCommonStoreCommentsStore();
            if (commentsStore && replyVal.length > 0) {
                var ascCommentData = new asc_CCommentData(),
                currentCommentData = commentsStore.findRecord("id", commentId);
                if (ascCommentData) {
                    ascCommentData.asc_putText(currentCommentData.get("comment"));
                    ascCommentData.asc_putQuoteText(currentCommentData.get("quote"));
                    ascCommentData.asc_putTime(this.utcDateToString(new Date(currentCommentData.get("date"))));
                    ascCommentData.asc_putUserId(currentCommentData.get("userid"));
                    ascCommentData.asc_putUserName(currentCommentData.get("username"));
                    ascCommentData.asc_putSolved(currentCommentData.get("resolved"));
                    var appendComment = function (data) {
                        var addReply = new asc_CCommentData();
                        addReply.asc_putText(data.reply);
                        addReply.asc_putTime(data.date);
                        addReply.asc_putUserId(data.userid);
                        addReply.asc_putUserName(data.username);
                        ascCommentData.asc_addReply(addReply);
                    };
                    currentCommentData.replys().each(function (reply) {
                        var id = reply.get("id");
                        appendComment({
                            reply: (id == replyId) ? replyVal : reply.get("reply"),
                            date: me.utcDateToString(new Date(reply.get("date"))),
                            userid: (id == replyId) ? me.getCurrentUserId() : reply.get("userid"),
                            username: (id == replyId) ? me.getCurrentUserName() : reply.get("username")
                        });
                    });
                    this.api.asc_changeComment(commentId, ascCommentData);
                }
            }
        }
    },
    deleteReply: function (commentId, replyId) {
        if (this.api) {
            var commentsStore = this.getCommonStoreCommentsStore(),
            userStore = this.getCommonStoreCommentsStore(),
            ascCommentData = new asc_CCommentData(),
            me = this;
            if (commentsStore && userStore && ascCommentData) {
                var currentCommentData = commentsStore.findRecord("id", commentId),
                user = userStore.findRecord("id", currentCommentData.get("userid"));
                ascCommentData.asc_putText(currentCommentData.get("comment"));
                ascCommentData.asc_putQuoteText(currentCommentData.get("quote"));
                ascCommentData.asc_putTime(this.utcDateToString(new Date(currentCommentData.get("date"))));
                ascCommentData.asc_putUserId(currentCommentData.get("userid"));
                ascCommentData.asc_putUserName(user ? user.get("username") : "");
                ascCommentData.asc_putSolved(currentCommentData.get("resolved"));
                var appendComment = function (data) {
                    var addReply = new asc_CCommentData();
                    addReply.asc_putText(data.reply);
                    addReply.asc_putTime(data.date);
                    addReply.asc_putUserId(data.userid);
                    addReply.asc_putUserName(data.username);
                    ascCommentData.asc_addReply(addReply);
                };
                currentCommentData.replys().each(function (reply) {
                    if (replyId != reply.get("id")) {
                        var addReply = new asc_CCommentData();
                        addReply.asc_putText(reply.get("reply"));
                        addReply.asc_putTime(me.utcDateToString(new Date(reply.get("date"))));
                        addReply.asc_putUserId(reply.get("userid"));
                        addReply.asc_putUserName(reply.get("username"));
                        ascCommentData.asc_addReply(addReply);
                    }
                });
                this.api.asc_changeComment(commentId, ascCommentData);
            }
        }
    },
    updateHandlers: function (record, commentNode, handlers) {
        var me = this,
        commentId = record.get("id"),
        rootNodeEl = Ext.get(commentNode);
        if (Ext.isDefined(rootNodeEl)) {
            var updateCommentHandler = function (clsEl, handler) {
                var controlEl = rootNodeEl.down(clsEl);
                if (controlEl) {
                    var func = Ext.bind(function (event, el) {
                        handler.call(el, commentId);
                    },
                    me);
                    controlEl.un("click");
                    controlEl.on("click", func);
                }
            };
            var updateReplyHandler = function (clsEl, handler) {
                var replys = rootNodeEl.down(".replys");
                if (replys) {
                    var editElements = replys.query(clsEl);
                    Ext.each(editElements, function (element) {
                        var el = Ext.get(element),
                        rootReply = el.up(".reply");
                        if (rootReply) {
                            var replyId = rootReply.id.match(/\d+/g);
                            if (replyId != null && replyId.length > 0) {
                                var func = Ext.bind(function (event, el) {
                                    handler.call(el, commentId, replyId);
                                },
                                me);
                                el.un("click");
                                el.on("click", func);
                            }
                        }
                    });
                }
            };
            var updateReplyTextHandler = function (clsEl, handler) {
                var replys = rootNodeEl.down(".replys");
                if (replys) {
                    var msgElements = replys.query(clsEl);
                    Ext.each(msgElements, function (element) {
                        var controlEl = Ext.get(element);
                        if (controlEl) {
                            var func = Ext.bind(function (event, el) {
                                handler.call(el, commentId);
                            },
                            me);
                            controlEl.un("click");
                            controlEl.on("click", func);
                        }
                    });
                }
            };
            updateCommentHandler(".resolve", function (commentId) {
                if (handlers && handlers.onResolveComment) {
                    handlers.onResolveComment.call(me, commentId);
                }
            });
            updateCommentHandler(".comment.edit", function (commentId) {
                if (handlers && handlers.showEditCommentControls) {
                    handlers.showEditCommentControls.call(me, commentId);
                }
            });
            updateCommentHandler(".comment.delete", function (commentId) {
                me.deleteComment(commentId);
            });
            updateCommentHandler(".quote", function (commentId) {
                me.selectComment(commentId);
            });
            updateCommentHandler(".comment-message", function (commentId) {
                me.selectComment(commentId);
            });
            updateReplyTextHandler(".reply-message", function (commentId) {
                me.selectComment(commentId);
            });
            updateReplyHandler(".edit", function (commentId, replyId) {
                if (handlers && handlers.showEditReplyControls) {
                    handlers.showEditReplyControls.call(me, commentId, replyId);
                }
            });
            updateReplyHandler(".delete", function (commentId, replyId) {
                me.deleteReply(commentId, replyId[0]);
            });
        }
    }
});