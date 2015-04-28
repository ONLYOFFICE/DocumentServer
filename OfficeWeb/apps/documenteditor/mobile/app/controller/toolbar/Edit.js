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
 Ext.define("DE.controller.toolbar.Edit", {
    extend: "Ext.app.Controller",
    requires: (["Ext.MessageBox", "Ext.util.Point", "Ext.util.Region", "DE.view.tablet.panel.Font", "DE.view.tablet.panel.FontStyle", "DE.view.tablet.panel.Insert", "DE.view.tablet.panel.ListStyle", "DE.view.tablet.panel.ParagraphAlignment", "DE.view.tablet.panel.Spacing", "DE.view.tablet.panel.TextColor"]),
    config: {
        refs: {
            doneButton: "#id-tb-btn-done",
            saveButton: "#id-tb-btn-save",
            undoButton: "#id-tb-btn-undo",
            fontButton: "#id-tb-btn-font",
            fontStyleButton: "#id-tb-btn-style",
            textColorButton: "#id-tb-btn-color",
            paragraphAlignmentButton: "#id-tb-btn-align",
            listStyleButton: "#id-tb-btn-liststyle",
            paragraphButton: "#id-tb-btn-paragraph",
            tableButton: "#id-tb-btn-table",
            shareButton: "#id-tb-btn-share",
            textColorPanel: "#id-panel-text-color",
            paragraphPanel: "#id-panel-spacing",
            paragraphAlignmentPanel: "#id-panel-paragraph-alignment",
            fontStylePanel: "#id-panel-font-style",
            listStylePanel: "#id-panel-liststyle",
            insertPanel: "#id-panel-insert",
            fontPanel: "#id-panel-font"
        },
        control: {
            doneButton: {
                tap: "onTapDone"
            },
            saveButton: {
                tap: "onTapSave"
            },
            undoButton: {
                tap: "onTapUndo"
            },
            fontButton: {
                tap: "onTapFont"
            },
            fontStyleButton: {
                tap: "onTapFontStyle"
            },
            textColorButton: {
                tap: "onTapTextColor"
            },
            paragraphAlignmentButton: {
                tap: "onTabParagraphAlignment"
            },
            listStyleButton: {
                tap: "onTapListStyle"
            },
            paragraphButton: {
                tap: "onTapParagraphButton"
            },
            tableButton: {
                tap: "onTapTable"
            },
            shareButton: {
                tap: "onTapShare"
            }
        }
    },
    launch: function () {
        this.callParent(arguments);
        Ext.getCmp("id-conteiner-document").on("resize", this.onEditorResize, this);
        var toolbarButtons = Ext.ComponentQuery.query("edittoolbar > button, edittoolbar > toolbar > button");
        Ext.each(Ext.ComponentQuery.query("commonpopoverpanel"), function (panel) {
            var modal = panel.getModal();
            if (modal) {
                modal.on("tap", function (mask, event) {
                    Ext.each(toolbarButtons, function (button) {
                        if (button !== panel.alignByCmp) {
                            var mousePoint = Ext.util.Point.fromEvent(event),
                            buttonRect = Ext.util.Region.from(button.element.getPageBox());
                            if (!buttonRect.isOutOfBound(mousePoint)) {
                                button.fireEvent("tap", button, event);
                            }
                        }
                    },
                    this);
                },
                this);
            }
        },
        this);
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
    },
    initControl: function () {
        this.callParent(arguments);
    },
    initApi: function () {},
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onCanUndo", Ext.bind(this.onApiCanUndo, this));
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(this.onCoAuthoringDisconnect, this));
            this.api.asc_registerCallback("asc_onDocumentModifiedChanged", Ext.bind(this.onApiDocumentModified, this));
        }
    },
    loadConfig: function (data) {
        var doneButton = this.getDoneButton();
        if (doneButton && data && data.config && data.config.canBackToFolder === true) {
            doneButton.show();
        }
    },
    onApiCanUndo: function (can) {
        var undoButton = this.getUndoButton();
        undoButton && undoButton.setDisabled(!can);
    },
    onCoAuthoringDisconnect: function () {
        Ext.each(Ext.ComponentQuery.query("commonpopoverpanel"), function (panel) {
            panel.hide();
        });
        Ext.each(Ext.ComponentQuery.query("edittoolbar > button, edittoolbar > toolbar > button"), function (btn) {
            btn.removeCls("x-button-pressing");
            btn.disable();
        });
        var shareButton = this.getShareButton();
        shareButton && shareButton.enable();
    },
    onApiDocumentModified: function () {
        var isModified = this.api.isDocumentModified();
        if (this.isDocModified !== isModified) {
            if (this.getSaveButton()) {
                this.getSaveButton().setDisabled(!isModified);
            }
            Common.Gateway.setDocumentModified(isModified);
            this.isDocModified = isModified;
        }
    },
    showToolbarPanel: function (panel, button) {
        if (panel && button) {
            panel.on("hide", Ext.bind(function () {
                button.removeCls("x-button-pressing");
            },
            this), this, {
                single: true
            });
            button.addCls("x-button-pressing");
            Ext.each(Ext.ComponentQuery.query("popclip"), function (cmp) {
                cmp.hide(true);
            },
            this);
            panel.alignByCmp = button;
            panel.setLeft(0);
            panel.setTop(0);
            panel.showBy(button);
        }
    },
    onTapDone: function () {
        if (this.api.isDocumentModified()) {
            Ext.Msg.show({
                title: this.dlgLeaveTitleText,
                message: this.dlgLeaveMsgText,
                buttons: [{
                    text: this.leaveButtonText,
                    itemId: "cancel",
                    ui: "base"
                },
                {
                    text: this.stayButtonText,
                    itemId: "ok",
                    ui: "base-blue"
                }],
                promptConfig: false,
                scope: this,
                fn: function (button) {
                    if (button == "cancel") {
                        Common.Gateway.goBack();
                    }
                }
            });
        } else {
            Common.Gateway.goBack();
        }
    },
    onTapSave: function () {
        this.api && this.api.asc_Save();
        Common.component.Analytics.trackEvent("ToolBar", "Save");
    },
    onTapUndo: function () {
        this.api && this.api.Undo();
        Common.component.Analytics.trackEvent("ToolBar", "Undo");
    },
    onTapShare: function () {
        this.api && this.api.asc_Print();
        Common.component.Analytics.trackEvent("ToolBar", "Share");
    },
    onTapFont: function () {
        this.showToolbarPanel(this.getFontPanel(), this.getFontButton());
    },
    onTapFontStyle: function () {
        this.showToolbarPanel(this.getFontStylePanel(), this.getFontStyleButton());
    },
    onTapTextColor: function () {
        this.showToolbarPanel(this.getTextColorPanel(), this.getTextColorButton());
    },
    onTabParagraphAlignment: function () {
        this.showToolbarPanel(this.getParagraphAlignmentPanel(), this.getParagraphAlignmentButton());
    },
    onTapListStyle: function () {
        this.showToolbarPanel(this.getListStylePanel(), this.getListStyleButton());
    },
    onTapParagraphButton: function () {
        this.showToolbarPanel(this.getParagraphPanel(), this.getParagraphButton());
    },
    onTapTable: function () {
        this.showToolbarPanel(this.getInsertPanel(), this.getTableButton());
    },
    onEditorResize: function (cmp) {
        var overlayPanels = Ext.ComponentQuery.query("commonpopoverpanel");
        Ext.each(overlayPanels, function (panel) {
            panel.hide();
        });
    },
    dlgLeaveTitleText: "You leave the application",
    dlgLeaveMsgText: "You have unsaved changes in this document. Click 'Stay on this Page' then 'Save' to save them. Click 'Leave this Page' to discard all the unsaved changes.",
    leaveButtonText: "Leave this Page",
    stayButtonText: "Stay on this Page"
});