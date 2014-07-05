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
 Ext.define("DE.view.DocumentLanguage", {
    extend: "Ext.window.Window",
    alias: "widget.dedocumentlanguage",
    requires: ["Ext.window.Window", "Ext.form.field.ComboBox", "Common.plugin.ComboBoxScrollPane", "Common.component.util.LanguageName"],
    modal: true,
    closable: true,
    closeAction: "hide",
    resizable: false,
    preventHeader: true,
    plain: true,
    height: 114,
    width: 350,
    padding: "20px",
    layout: "vbox",
    layoutConfig: {
        align: "stretch"
    },
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        var _btnOk = Ext.create("Ext.Button", {
            id: "langdialog-button-ok",
            text: this.okButtonText,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    this._modalresult = 1;
                    this.fireEvent("onmodalresult", this._modalresult);
                    this.close();
                },
                scope: this
            }
        });
        var _btnCancel = Ext.create("Ext.Button", {
            id: "langdialog-button-cancel",
            text: this.cancelButtonText,
            width: 80,
            cls: "asc-darkgray-button",
            listeners: {
                click: function () {
                    this._modalresult = 0;
                    this.fireEvent("onmodalresult", this._modalresult);
                    this.close();
                },
                scope: this
            }
        });
        this.cmbLangs = Ext.create("Ext.form.field.ComboBox", {
            store: this.langs,
            mode: "local",
            triggerAction: "all",
            editable: false,
            enableKeyEvents: true,
            width: 310,
            listConfig: {
                maxHeight: 200
            },
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    this.langNum = records[0].index;
                },
                this),
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        _btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            _btnCancel.fireEvent("click");
                        }
                    }
                }
            },
            plugins: [{
                ptype: "comboboxscrollpane",
                pluginId: "scrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        this.addEvents("onmodalresult");
        this.items = [{
            xtype: "label",
            text: this.textLang,
            width: "100%",
            style: "text-align:left"
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        this.cmbLangs, {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "container",
            width: 310,
            layout: "hbox",
            layoutConfig: {
                align: "stretch"
            },
            items: [{
                xtype: "tbspacer",
                flex: 1
            },
            _btnOk, {
                xtype: "tbspacer",
                width: 5
            },
            _btnCancel]
        }];
        this.callParent(arguments);
    },
    setSettings: function (currentLang) {
        this.langNum = undefined;
        if (currentLang) {
            var rec = this.cmbLangs.findRecord("field1", currentLang);
            if (rec) {
                this.cmbLangs.select(rec);
            } else {
                if (this.cmbLangs.picker && this.cmbLangs.picker.selModel) {
                    this.cmbLangs.picker.selModel.deselectAll();
                    this.cmbLangs.picker.selModel.lastSelected = null;
                }
                this.cmbLangs.setValue(Common.util.LanguageName.getLocalLanguageName(currentLang)[1]);
            }
        }
    },
    getSettings: function () {
        return (this.langNum !== undefined) ? this.langs[this.langNum][0] : undefined;
    },
    textLang: "Select document language",
    cancelButtonText: "Cancel",
    okButtonText: "Ok"
});