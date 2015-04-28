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
define(["core", "common/main/lib/view/ExternalDiagramEditor"], function () {
    Common.Controllers.ExternalDiagramEditor = Backbone.Controller.extend(_.extend((function () {
        var appLang = "en",
        externalEditor = null;
        var createExternalEditor = function () {
            externalEditor = new DocsAPI.DocEditor("id-diagram-editor-placeholder", {
                width: "100%",
                height: "100%",
                documentType: "spreadsheet",
                document: {
                    permissions: {
                        edit: true,
                        download: false
                    }
                },
                editorConfig: {
                    mode: "editdiagram",
                    lang: appLang,
                    canCoAuthoring: false,
                    canBackToFolder: false,
                    canCreateNew: false,
                    user: {
                        id: ("uid-" + Date.now()),
                        name: this.textAnonymous
                    }
                },
                events: {
                    "onReady": function () {},
                    "onDocumentStateChange": function () {},
                    "onError": function () {},
                    "onInternalMessage": _.bind(this.onInternalMessage, this)
                }
            });
            Common.Gateway.on("processmouse", _.bind(this.onProcessMouse, this));
        };
        return {
            views: ["Common.Views.ExternalDiagramEditor"],
            initialize: function () {
                this.addListeners({
                    "Common.Views.ExternalDiagramEditor": {
                        "setchartdata": _.bind(this.setChartData, this),
                        "drag": _.bind(function (o, state) {
                            externalEditor.serviceCommand("window:drag", state == "start");
                        },
                        this),
                        "show": _.bind(function (cmp) {
                            var h = this.diagramEditorView.getHeight();
                            if (window.innerHeight > h && h < 700 || window.innerHeight < h) {
                                h = Math.min(window.innerHeight, 700);
                                this.diagramEditorView.setHeight(h);
                            }
                            if (externalEditor) {
                                externalEditor.serviceCommand("setAppDisabled", false);
                                if (this.needDisableEditing && this.diagramEditorView._isExternalDocReady) {
                                    this.onDiagrammEditingDisabled();
                                }
                                externalEditor.attachMouseEvents();
                            } else {
                                createExternalEditor.apply(this);
                            }
                            this.isExternalEditorVisible = true;
                        },
                        this),
                        "hide": _.bind(function (cmp) {
                            if (externalEditor) {
                                externalEditor.detachMouseEvents();
                                this.isExternalEditorVisible = false;
                            }
                        },
                        this)
                    }
                });
            },
            onLaunch: function () {
                this.diagramEditorView = this.createView("Common.Views.ExternalDiagramEditor", {
                    handler: _.bind(this.handler, this)
                });
            },
            setApi: function (api) {
                this.api = api;
                this.api.asc_registerCallback("asc_onCloseChartEditor", _.bind(this.onDiagrammEditingDisabled, this));
                return this;
            },
            handler: function (result, value) {
                externalEditor.serviceCommand("queryClose", {
                    mr: result
                });
                return true;
            },
            setChartData: function () {
                externalEditor && externalEditor.serviceCommand("setChartData", this.diagramEditorView._chartData);
                this.diagramEditorView._chartData = null;
            },
            loadConfig: function (data) {
                if (data && data.config && data.config.lang) {
                    appLang = data.config.lang;
                }
            },
            onDiagrammEditingDisabled: function () {
                if (!this.diagramEditorView.isVisible() || !this.diagramEditorView._isExternalDocReady) {
                    this.needDisableEditing = true;
                    return;
                }
                this.diagramEditorView.setControlsDisabled(true);
                Common.UI.alert({
                    title: this.warningTitle,
                    msg: this.warningText,
                    iconCls: "warn",
                    buttons: ["ok"],
                    callback: _.bind(function (btn) {
                        this.setControlsDisabled(false);
                        this.diagramEditorView.hide();
                    },
                    this)
                });
                this.needDisableEditing = false;
            },
            onInternalMessage: function (data) {
                var eventData = data.data;
                if (this.diagramEditorView) {
                    if (eventData.type == "documentReady") {
                        this.diagramEditorView._isExternalDocReady = true;
                        this.diagramEditorView.setControlsDisabled(false);
                        if (this.diagramEditorView._chartData) {
                            externalEditor && externalEditor.serviceCommand("setChartData", this.diagramEditorView._chartData);
                            this.diagramEditorView._chartData = null;
                        }
                        if (this.needDisableEditing) {
                            this.onDiagrammEditingDisabled();
                        }
                    } else {
                        if (eventData.type == "shortcut") {
                            if (eventData.data.key == "escape") {
                                this.diagramEditorView.hide();
                            }
                        } else {
                            if (eventData.type == "canClose") {
                                if (eventData.data.answer === true) {
                                    if (externalEditor) {
                                        externalEditor.serviceCommand("setAppDisabled", true);
                                        externalEditor.serviceCommand((eventData.data.mr == "ok") ? "getChartData" : "clearChartData");
                                    }
                                    this.diagramEditorView.hide();
                                }
                            } else {
                                if (eventData.type == "processMouse") {
                                    if (eventData.data.event == "mouse:up") {
                                        this.diagramEditorView.binding.dragStop();
                                    } else {
                                        if (eventData.data.event == "mouse:move") {
                                            var x = parseInt(this.diagramEditorView.$window.css("left")) + eventData.data.pagex,
                                            y = parseInt(this.diagramEditorView.$window.css("top")) + eventData.data.pagey + 34;
                                            this.diagramEditorView.binding.drag({
                                                pageX: x,
                                                pageY: y
                                            });
                                        }
                                    }
                                } else {
                                    this.diagramEditorView.fireEvent("internalmessage", this.diagramEditorView, eventData);
                                }
                            }
                        }
                    }
                }
            },
            onProcessMouse: function (data) {
                if (data.type == "mouseup" && this.isExternalEditorVisible) {
                    externalEditor && externalEditor.serviceCommand("processmouse", data);
                }
            },
            warningTitle: "Warning",
            warningText: "The object is disabled because of editing by another user.",
            textClose: "Close",
            textAnonymous: "Anonymous"
        };
    })(), Common.Controllers.ExternalDiagramEditor || {}));
});