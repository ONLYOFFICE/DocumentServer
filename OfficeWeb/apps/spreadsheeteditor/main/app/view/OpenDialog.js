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
 Ext.define("SSE.view.OpenDialog", {
    extend: "Ext.window.Window",
    alias: "widget.sseopendialog",
    requires: ["Ext.window.Window", "Common.plugin.ComboBoxScrollPane"],
    modal: true,
    closable: false,
    resizable: false,
    height: 218,
    width: 250,
    padding: "15px 0 0 0",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    cls: "csv-open-dialog",
    initComponent: function () {
        this.title = this.title || this.txtTitle;
        var encodedata = [];
        if (this.codepages) {
            encodedata = [];
            for (var i = 0; i < this.codepages.length; i++) {
                var codepage = this.codepages[i];
                var c = [];
                c[0] = codepage.asc_getCodePage();
                c[1] = codepage.asc_getCodePageName();
                encodedata.push(c);
            }
        } else {
            encodedata = [[37, "IBM EBCDIC (US-Canada)"], [437, "OEM United States"], [500, "IBM EBCDIC (International)"], [708, "Arabic (ASMO 708)"], [720, "Arabic (DOS)"], [737, "Greek (DOS)"], [775, "Baltic (DOS)"], [850, "Western European (DOS)"], [852, "Central European (DOS)"], [855, "OEM Cyrillic"], [857, "Turkish (DOS)"], [858, "OEM Multilingual Latin I"], [860, "Portuguese (DOS)"], [861, "Icelandic (DOS)"], [862, "Hebrew (DOS)"], [863, "French Canadian (DOS)"], [864, "Arabic (864) "], [865, "Nordic (DOS)"], [866, "Cyrillic (DOS)"], [869, "Greek, Modern (DOS)"], [870, "IBM EBCDIC (Multilingual Latin-2)"], [874, "Thai (Windows)"], [875, "IBM EBCDIC (Greek Modern)"], [932, "Japanese (Shift-JIS)"], [936, "Chinese Simplified (GB2312)"], [949, "Korean"], [950, "Chinese Traditional (Big5)"], [1026, "IBM EBCDIC (Turkish Latin-5)"], [1047, "IBM Latin-1"], [1140, "IBM EBCDIC (US-Canada-Euro)"], [1141, "IBM EBCDIC (Germany-Euro)"], [1142, "IBM EBCDIC (Denmark-Norway-Euro)"], [1143, "IBM EBCDIC (Finland-Sweden-Euro)"], [1144, "IBM EBCDIC (Italy-Euro)"], [1145, "IBM EBCDIC (Spain-Euro)"], [1146, "IBM EBCDIC (UK-Euro)"], [1147, "IBM EBCDIC (France-Euro)"], [1148, "IBM EBCDIC (International-Euro)"], [1149, "IBM EBCDIC (Icelandic-Euro)"], [1200, "Unicode"], [1201, "Unicode (Big-Endian)"], [1250, "Central European (Windows)"], [1251, "Cyrillic (Windows)"], [1252, "Western European (Windows)"], [1253, "Greek (Windows)"], [1254, "Turkish (Windows)"], [1255, "Hebrew (Windows) "], [1256, "Arabic (Windows) "], [1257, "Baltic (Windows)"], [1258, "Vietnamese (Windows)"], [1361, "Korean (Johab)"], [10000, "Western European (Mac)"], [10001, "Japanese (Mac)"], [10002, "Chinese Traditional (Mac)"], [10003, "Korean (Mac)"], [10004, "Arabic (Mac) "], [10005, "Hebrew (Mac)"], [10006, "Greek (Mac) "], [10007, "Cyrillic (Mac)"], [10008, "Chinese Simplified (Mac)"], [10010, "Romanian (Mac)"], [10017, "Ukrainian (Mac)"], [10021, "Thai (Mac)"], [10029, "Central European (Mac) "], [10079, "Icelandic (Mac)"], [10081, "Turkish (Mac)"], [10082, "Croatian (Mac)"], [12000, "Unicode (UTF-32)"], [12001, "Unicode (UTF-32 Big-Endian)"], [20000, "Chinese Traditional (CNS)"], [20001, "TCA Taiwan"], [20002, "Chinese Traditional (Eten)"], [20003, "IBM5550 Taiwan"], [20004, "TeleText Taiwan"], [20005, "Wang Taiwan"], [20105, "Western European (IA5)"], [20106, "German (IA5)"], [20107, "Swedish (IA5) "], [20108, "Norwegian (IA5) "], [20127, "US-ASCII"], [20261, "T.61 "], [20269, "ISO-6937"], [20273, "IBM EBCDIC (Germany)"], [20277, "IBM EBCDIC (Denmark-Norway) "], [20278, "IBM EBCDIC (Finland-Sweden)"], [20280, "IBM EBCDIC (Italy)"], [20284, "IBM EBCDIC (Spain)"], [20285, "IBM EBCDIC (UK)"], [20290, "IBM EBCDIC (Japanese katakana)"], [20297, "IBM EBCDIC (France)"], [20420, "IBM EBCDIC (Arabic)"], [20423, "IBM EBCDIC (Greek)"], [20424, "IBM EBCDIC (Hebrew)"], [20833, "IBM EBCDIC (Korean Extended)"], [20838, "IBM EBCDIC (Thai)"], [20866, "Cyrillic (KOI8-R)"], [20871, "IBM EBCDIC (Icelandic) "], [20880, "IBM EBCDIC (Cyrillic Russian)"], [20905, "IBM EBCDIC (Turkish)"], [20924, "IBM Latin-1 "], [20932, "Japanese (JIS 0208-1990 and 0212-1990)"], [20936, "Chinese Simplified (GB2312-80) "], [20949, "Korean Wansung "], [21025, "IBM EBCDIC (Cyrillic Serbian-Bulgarian)"], [21866, "Cyrillic (KOI8-U)"], [28591, "Western European (ISO) "], [28592, "Central European (ISO)"], [28593, "Latin 3 (ISO)"], [28594, "Baltic (ISO)"], [28595, "Cyrillic (ISO) "], [28596, "Arabic (ISO)"], [28597, "Greek (ISO) "], [28598, "Hebrew (ISO-Visual)"], [28599, "Turkish (ISO)"], [28603, "Estonian (ISO)"], [28605, "Latin 9 (ISO)"], [29001, "Europa"], [38598, "Hebrew (ISO-Logical)"], [50220, "Japanese (JIS)"], [50221, "Japanese (JIS-Allow 1 byte Kana) "], [50222, "Japanese (JIS-Allow 1 byte Kana - SO/SI)"], [50225, "Korean (ISO)"], [50227, "Chinese Simplified (ISO-2022)"], [51932, "Japanese (EUC)"], [51936, "Chinese Simplified (EUC) "], [51949, "Korean (EUC)"], [52936, "Chinese Simplified (HZ)"], [54936, "Chinese Simplified (GB18030)"], [57002, "ISCII Devanagari "], [57003, "ISCII Bengali "], [57004, "ISCII Tamil"], [57005, "ISCII Telugu "], [57006, "ISCII Assamese "], [57007, "ISCII Oriya"], [57008, "ISCII Kannada"], [57009, "ISCII Malayalam "], [57010, "ISCII Gujarati"], [57011, "ISCII Punjabi"], [65000, "Unicode (UTF-7)"], [65001, "Unicode (UTF-8)"]];
        }
        var encodestore = Ext.create("Ext.data.ArrayStore", {
            autoDestroy: true,
            storeId: "encodeStore",
            idIndex: 0,
            fields: [{
                name: "value",
                type: "int"
            },
            {
                name: "name",
                type: "string"
            }],
            data: encodedata
        });
        this.cmbEncoding = Ext.create("Ext.form.field.ComboBox", {
            store: encodestore,
            displayField: "name",
            queryMode: "local",
            typeAhead: false,
            editable: false,
            listeners: {
                keydown: this._handleKeyDown,
                select: function (combo, records, eOpts) {
                    this.encoding = records[0].data.value;
                },
                scope: this
            },
            enableKeyEvents: true,
            plugins: [{
                pluginId: "scrollpane",
                ptype: "comboboxscrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        this.cmbEncoding.select(encodestore.getAt(0));
        this.encoding = encodestore.getAt(0).data.value;
        var delimiterstore = Ext.create("Ext.data.ArrayStore", {
            autoDestroy: true,
            storeId: "delimiterStore",
            idIndex: 0,
            fields: [{
                name: "value",
                type: "int"
            },
            {
                name: "description",
                type: "string"
            }],
            data: [[4, ","], [2, ";"], [3, ":"], [1, this.txtTab], [5, this.txtSpace]]
        });
        this.cmbDelimiter = Ext.create("Ext.form.field.ComboBox", {
            width: 70,
            store: delimiterstore,
            displayField: "description",
            queryMode: "local",
            typeAhead: false,
            editable: false,
            listeners: {
                select: function (combo, records, eOpts) {
                    this.delimiter = records[0].data.value;
                },
                scope: this
            }
        });
        this.cmbDelimiter.select(delimiterstore.getAt(0));
        this.delimiter = delimiterstore.getAt(0).data.value;
        this.items = [{
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            padding: "0 20px 0 20px",
            height: 46,
            width: 210,
            items: [{
                xtype: "label",
                text: this.txtEncoding,
                style: "font-weight: bold;margin:0 0 4px 0;"
            },
            this.cmbEncoding]
        },
        {
            xtype: "tbspacer",
            height: 10
        },
        {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "left"
            },
            padding: "0 20px 0 20px",
            height: 46,
            width: 210,
            items: [{
                xtype: "label",
                text: this.txtDelimiter,
                style: "font-weight: bold;margin:0 0 4px 0;"
            },
            this.cmbDelimiter]
        },
        {
            xtype: "tbspacer",
            height: 10
        },
        {
            xtype: "tbspacer",
            height: 8,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        {
            xtype: "container",
            height: 40,
            layout: {
                type: "vbox",
                align: "center",
                pack: "center"
            },
            items: [{
                xtype: "container",
                width: 86,
                height: 24,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [this.btnOk = Ext.widget("button", {
                    cls: "asc-blue-button",
                    width: 86,
                    height: 22,
                    margin: "0 5px 0 0",
                    text: this.okButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 1, {
                                encoding: this.encoding,
                                delimiter: this.delimiter
                            });
                            this.close();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.callParent(arguments);
    },
    setSettings: function (s) {
        var index = this.cmbEncoding.getStore().find("value", s.asc_getCodePage ? s.asc_getCodePage() : s.encoding);
        if (! (index < 0)) {
            this.cmbEncoding.select(this.cmbEncoding.getStore().getAt(index));
            this.encoding = s.asc_getCodePage();
        }
        index = this.cmbDelimiter.getStore().find("value", s.asc_getDelimiter ? s.asc_getDelimiter() : s.delimiter);
        if (! (index < 0)) {
            this.cmbDelimiter.select(this.cmbDelimiter.getStore().getAt(index));
            this.delimiter = s.asc_getDelimiter();
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
    _handleKeyDown: function (combo, event) {
        if (event.ctrlKey || event.altKey) {
            return;
        }
        var charcode = String.fromCharCode(event.getCharCode());
        if (/[A-Z0-9]/.test(charcode)) {
            if ((new Date().getTime()) - combo.lastsearchtime > 3000) {
                combo.lastsearchquery = "";
            }
            var str = combo.lastsearchquery + charcode;
            var index = combo.getStore().find("name", str, combo.lastsearchindex);
            if (index < 0) {
                str = charcode;
                index = combo.getStore().find("name", str, combo.lastsearchindex);
                if (index < 0) {
                    index = combo.getStore().find("name", str, 0);
                }
            }
            combo.lastsearchtime = new Date().getTime();
            if (! (index < 0)) {
                var item = combo.getStore().getAt(index);
                var node = combo.getPicker().getNode(item);
                combo.select(item);
                this.scrollViewToNode(combo, node);
                combo.lastsearchquery = str;
                combo.lastsearchindex = ++index < combo.getStore().getCount() ? index : 0;
            } else {
                combo.lastsearchquery = "";
                combo.lastsearchindex = 0;
            }
        }
    },
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtEncoding: "Encoding ",
    txtDelimiter: "Delimiter",
    txtTab: "Tab",
    txtSpace: "Space",
    txtTitle: "Choose CSV options"
});