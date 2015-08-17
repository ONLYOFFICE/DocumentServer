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
 define(["core", "common/main/lib/collection/HistoryVersions", "common/main/lib/view/History"], function () {
    Common.Controllers.History = Backbone.Controller.extend(_.extend({
        models: [],
        collections: ["Common.Collections.HistoryVersions"],
        views: ["Common.Views.History"],
        initialize: function () {
            this.currentChangeId = -1;
            this.currentArrColors = [];
            this.currentDocId = "";
            this.currentDocIdPrev = "";
        },
        events: {},
        onLaunch: function () {
            this.panelHistory = this.createView("Common.Views.History", {
                storeHistory: this.getApplication().getCollection("Common.Collections.HistoryVersions")
            });
            this.panelHistory.on("render:after", _.bind(this.onAfterRender, this));
            Common.Gateway.on("sethistorydata", _.bind(this.onSetHistoryData, this));
        },
        setApi: function (api) {
            this.api = api;
        },
        onAfterRender: function (historyView) {
            historyView.viewHistoryList.on("item:click", _.bind(this.onSelectRevision, this));
            historyView.btnBackToDocument.on("click", _.bind(this.onClickBackToDocument, this));
        },
        onSelectRevision: function (picker, item, record) {
            var url = record.get("url"),
            rev = record.get("revision"),
            urlGetTime = new Date();
            this.currentChangeId = record.get("changeid");
            this.currentArrColors = record.get("arrColors");
            this.currentDocId = record.get("docId");
            this.currentDocIdPrev = record.get("docIdPrev");
            if (_.isEmpty(url) || (urlGetTime - record.get("urlGetTime") > 5 * 60000)) {
                _.delay(function () {
                    Common.Gateway.requestHistoryData(rev);
                },
                10);
            } else {
                var urlDiff = record.get("urlDiff"),
                hist = new Asc.asc_CVersionHistory();
                hist.asc_setDocId(_.isEmpty(urlDiff) ? this.currentDocId : this.currentDocIdPrev);
                hist.asc_setUrl(url);
                hist.asc_setUrlChanges(urlDiff);
                hist.asc_setCurrentChangeId(this.currentChangeId);
                hist.asc_setArrColors(this.currentArrColors);
                this.api.asc_showRevision(hist);
                var commentsController = this.getApplication().getController("Common.Controllers.Comments");
                if (commentsController) {
                    commentsController.onApiHideComment();
                }
            }
        },
        onSetHistoryData: function (opts) {
            if (opts.data.error) {
                var config = {
                    closable: false,
                    title: this.notcriticalErrorTitle,
                    msg: opts.data.error,
                    iconCls: "warn",
                    buttons: ["ok"]
                };
                Common.UI.alert(config);
            } else {
                var data = opts.data;
                var historyStore = this.getApplication().getCollection("Common.Collections.HistoryVersions");
                if (historyStore && data !== null) {
                    var rev, revisions = historyStore.findRevisions(data.version),
                    urlGetTime = new Date();
                    if (revisions && revisions.length > 0) {
                        for (var i = 0; i < revisions.length; i++) {
                            rev = revisions[i];
                            rev.set("url", opts.data.url);
                            rev.set("urlDiff", opts.data.urlDiff);
                            rev.set("urlGetTime", urlGetTime);
                        }
                    }
                    var hist = new Asc.asc_CVersionHistory();
                    hist.asc_setUrl(opts.data.url);
                    hist.asc_setUrlChanges(opts.data.urlDiff);
                    hist.asc_setDocId(_.isEmpty(opts.data.urlDiff) ? this.currentDocId : this.currentDocIdPrev);
                    hist.asc_setCurrentChangeId(this.currentChangeId);
                    hist.asc_setArrColors(this.currentArrColors);
                    this.api.asc_showRevision(hist);
                    var commentsController = this.getApplication().getController("Common.Controllers.Comments");
                    if (commentsController) {
                        commentsController.onApiHideComment();
                    }
                }
            }
        },
        onClickBackToDocument: function () {
            Common.Gateway.requestHistoryClose();
        },
        notcriticalErrorTitle: "Warning"
    },
    Common.Controllers.History || {}));
});