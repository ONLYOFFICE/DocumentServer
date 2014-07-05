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
 var url_create_template = "{0}?title={1}&template={2}&action=create&doctype=spreadsheet";
var url_create_new = "{0}?title={1}&action=create&doctype=spreadsheet";
Ext.define("SSE.controller.CreateFile", {
    extend: "Ext.app.Controller",
    uses: ["SSE.view.OpenDialog"],
    views: ["CreateFile"],
    stores: ["FileTemplates"],
    refs: [{
        ref: "filePanel",
        selector: "ssefile"
    }],
    init: function () {
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
        this.control({
            "ssecreatenew": {
                afterrender: Ext.bind(this.onRenderView, this, {
                    single: true
                })
            },
            "ssecreatenew dataview": {
                itemclick: this.onTemplateClick
            },
            "ssefile #file-button-createnew": {
                click: function (el, event) {
                    var templates = this.getFileTemplatesStore();
                    if (! (templates && templates.getCount())) {
                        this.onBlankDocClick(event, el);
                    }
                }
            },
            "ssefile button[docType]": {
                click: this.clickBtnDownloadAs
            },
            "ssefile button[docType=0]": {
                click: this.clickBtnDownloadAs
            }
        });
    },
    loadConfig: function (data) {
        var templates = this.getFileTemplatesStore();
        if (templates) {
            templates.removeAll();
            if (data && data.config) {
                this.createUrl = data.config.createUrl;
                this.nativeApp = data.config.nativeApp;
                if (data.config.templates) {
                    templates.add(data.config.templates);
                }
            }
        }
    },
    onRenderView: function () {
        var btnBlankDocument = Ext.fly("id-create-blank-document");
        if (btnBlankDocument) {
            btnBlankDocument.addClsOnOver("over");
            btnBlankDocument.on("click", this.onBlankDocClick, this);
        }
    },
    onBlankDocClick: function (event, el) {
        var filePanel = this.getFilePanel();
        if (filePanel) {
            filePanel.closeMenu();
        }
        if (this.nativeApp === true) {
            this.api.asc_openNewDocument();
        } else {
            if (this.createUrl && this.createUrl.length) {
                var newDocumentPage = window.open(Ext.String.format(url_create_new, this.createUrl, this.newDocumentTitle));
                if (newDocumentPage) {
                    newDocumentPage.focus();
                }
            }
        }
        Common.component.Analytics.trackEvent("Create New", "Blank");
    },
    onTemplateClick: function (view, record, item, index, e) {
        var filePanel = this.getFilePanel();
        if (filePanel) {
            filePanel.closeMenu();
        }
        if (this.nativeApp === true) {
            this.api.asc_openNewDocument(record.data.name);
        } else {
            if (this.createUrl && this.createUrl.length) {
                var newDocumentPage = window.open(Ext.String.format(url_create_template, this.createUrl, this.newDocumentTitle, record.data.name));
                if (newDocumentPage) {
                    newDocumentPage.focus();
                }
            }
        }
        Common.component.Analytics.trackEvent("Create New");
    },
    setApi: function (o) {
        this.api = o;
        return this;
    },
    clickBtnDownloadAs: function (btn) {
        if (this.api) {
            if (this.api.asc_drawingObjectsExist() && btn.docType != c_oAscFileType.XLSX) {
                Ext.create("Ext.window.MessageBox", {
                    buttonText: {
                        ok: "OK",
                        yes: "Yes",
                        no: "No",
                        cancel: this.textCancel
                    }
                }).show({
                    title: this.textWarning,
                    msg: this.warnDownloadAs,
                    icon: Ext.Msg.QUESTION,
                    buttons: Ext.Msg.OKCANCEL,
                    scope: this,
                    fn: function (res, text) {
                        if (res == "ok") {
                            this.getFilePanel().fireEvent("downloadas");
                            this.api.asc_DownloadAs(btn.docType);
                            this.getFilePanel().closeMenu();
                        }
                    }
                });
            } else {
                this.getFilePanel().fireEvent("downloadas");
                this.api.asc_DownloadAs(btn.docType);
                this.getFilePanel().closeMenu();
            }
        }
        Common.component.Analytics.trackEvent("Download As", String(btn.docType));
    },
    warnDownloadAs: "If you continue saving in this format all the charts and images will be lost.<br>Are you sure you want to continue?",
    newDocumentTitle : "Unnamed document",
    textWarning: "Warning",
    textCancel: "Cancel"
});