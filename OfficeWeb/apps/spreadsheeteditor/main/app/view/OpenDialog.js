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
 define(["common/main/lib/component/Window"], function () {
    SSE.Views = SSE.Views || {};
    SSE.Views.OpenDialog = Common.UI.Window.extend(_.extend({
        applyFunction: undefined,
        initialize: function (options) {
            var t = this,
            _options = {};
            _.extend(_options, {
                width: 250,
                height: 220,
                contentWidth: 390,
                header: true,
                cls: "open-dlg",
                contentTemplate: "",
                title: t.txtTitle
            },
            options);
            this.template = options.template || ['<div class="box" style="height:' + (_options.height - 85) + 'px;">', '<div class="content-panel" >', '<label class="header">' + t.txtEncoding + "</label>", '<div id="id-codepages-combo" class="input-group-nr" style="margin-top:10px;margin-bottom:10px;"></div>', '<label class="header">' + t.txtDelimiter + "</label>", '<div id="id-delimiters-combo" class="input-group-nr" style="margin-top:10px;max-width: 110px;"></div>', "</div>", "</div>", '<div class="separator horizontal"/>', '<div class="footer center">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right:10px;">' + t.okButtonText + "</button>", "</div>"].join("");
            this.handler = options.handler;
            this.codepages = options.codepages;
            this.settings = options.settings;
            _options.tpl = _.template(this.template, _options);
            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            if (this.$window) {
                this.$window.find(".tool").hide();
                this.$window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
                this.initCodePages();
            }
        },
        onBtnClick: function (event) {
            if (this.handler && this.cmbEncoding && this.cmbDelimiter) {
                this.handler.call(this, this.cmbEncoding.getValue(), this.cmbDelimiter.getValue());
            }
            this.close();
        },
        initCodePages: function () {
            var i, c, codepage, encodedata = [],
            listItems = [],
            length = 0;
            if (this.codepages) {
                encodedata = [];
                for (i = 0; i < this.codepages.length; ++i) {
                    codepage = this.codepages[i];
                    c = [];
                    c[0] = codepage.asc_getCodePage();
                    c[1] = codepage.asc_getCodePageName();
                    encodedata.push(c);
                }
            } else {
                encodedata = [[37, "IBM EBCDIC (US-Canada)"], [437, "OEM United States"], [500, "IBM EBCDIC (International)"], [708, "Arabic (ASMO 708)"], [720, "Arabic (DOS)"], [737, "Greek (DOS)"], [775, "Baltic (DOS)"], [850, "Western European (DOS)"], [852, "Central European (DOS)"], [855, "OEM Cyrillic"], [857, "Turkish (DOS)"], [858, "OEM Multilingual Latin I"], [860, "Portuguese (DOS)"], [861, "Icelandic (DOS)"], [862, "Hebrew (DOS)"], [863, "French Canadian (DOS)"], [864, "Arabic (864) "], [865, "Nordic (DOS)"], [866, "Cyrillic (DOS)"], [869, "Greek, Modern (DOS)"], [870, "IBM EBCDIC (Multilingual Latin-2)"], [874, "Thai (Windows)"], [875, "IBM EBCDIC (Greek Modern)"], [932, "Japanese (Shift-JIS)"], [936, "Chinese Simplified (GB2312)"], [949, "Korean"], [950, "Chinese Traditional (Big5)"], [1026, "IBM EBCDIC (Turkish Latin-5)"], [1047, "IBM Latin-1"], [1140, "IBM EBCDIC (US-Canada-Euro)"], [1141, "IBM EBCDIC (Germany-Euro)"], [1142, "IBM EBCDIC (Denmark-Norway-Euro)"], [1143, "IBM EBCDIC (Finland-Sweden-Euro)"], [1144, "IBM EBCDIC (Italy-Euro)"], [1145, "IBM EBCDIC (Spain-Euro)"], [1146, "IBM EBCDIC (UK-Euro)"], [1147, "IBM EBCDIC (France-Euro)"], [1148, "IBM EBCDIC (International-Euro)"], [1149, "IBM EBCDIC (Icelandic-Euro)"], [1200, "Unicode"], [1201, "Unicode (Big-Endian)"], [1250, "Central European (Windows)"], [1251, "Cyrillic (Windows)"], [1252, "Western European (Windows)"], [1253, "Greek (Windows)"], [1254, "Turkish (Windows)"], [1255, "Hebrew (Windows) "], [1256, "Arabic (Windows) "], [1257, "Baltic (Windows)"], [1258, "Vietnamese (Windows)"], [1361, "Korean (Johab)"], [10000, "Western European (Mac)"], [10001, "Japanese (Mac)"], [10002, "Chinese Traditional (Mac)"], [10003, "Korean (Mac)"], [10004, "Arabic (Mac) "], [10005, "Hebrew (Mac)"], [10006, "Greek (Mac) "], [10007, "Cyrillic (Mac)"], [10008, "Chinese Simplified (Mac)"], [10010, "Romanian (Mac)"], [10017, "Ukrainian (Mac)"], [10021, "Thai (Mac)"], [10029, "Central European (Mac) "], [10079, "Icelandic (Mac)"], [10081, "Turkish (Mac)"], [10082, "Croatian (Mac)"], [12000, "Unicode (UTF-32)"], [12001, "Unicode (UTF-32 Big-Endian)"], [20000, "Chinese Traditional (CNS)"], [20001, "TCA Taiwan"], [20002, "Chinese Traditional (Eten)"], [20003, "IBM5550 Taiwan"], [20004, "TeleText Taiwan"], [20005, "Wang Taiwan"], [20105, "Western European (IA5)"], [20106, "German (IA5)"], [20107, "Swedish (IA5) "], [20108, "Norwegian (IA5) "], [20127, "US-ASCII"], [20261, "T.61 "], [20269, "ISO-6937"], [20273, "IBM EBCDIC (Germany)"], [20277, "IBM EBCDIC (Denmark-Norway) "], [20278, "IBM EBCDIC (Finland-Sweden)"], [20280, "IBM EBCDIC (Italy)"], [20284, "IBM EBCDIC (Spain)"], [20285, "IBM EBCDIC (UK)"], [20290, "IBM EBCDIC (Japanese katakana)"], [20297, "IBM EBCDIC (France)"], [20420, "IBM EBCDIC (Arabic)"], [20423, "IBM EBCDIC (Greek)"], [20424, "IBM EBCDIC (Hebrew)"], [20833, "IBM EBCDIC (Korean Extended)"], [20838, "IBM EBCDIC (Thai)"], [20866, "Cyrillic (KOI8-R)"], [20871, "IBM EBCDIC (Icelandic) "], [20880, "IBM EBCDIC (Cyrillic Russian)"], [20905, "IBM EBCDIC (Turkish)"], [20924, "IBM Latin-1 "], [20932, "Japanese (JIS 0208-1990 and 0212-1990)"], [20936, "Chinese Simplified (GB2312-80) "], [20949, "Korean Wansung "], [21025, "IBM EBCDIC (Cyrillic Serbian-Bulgarian)"], [21866, "Cyrillic (KOI8-U)"], [28591, "Western European (ISO) "], [28592, "Central European (ISO)"], [28593, "Latin 3 (ISO)"], [28594, "Baltic (ISO)"], [28595, "Cyrillic (ISO) "], [28596, "Arabic (ISO)"], [28597, "Greek (ISO) "], [28598, "Hebrew (ISO-Visual)"], [28599, "Turkish (ISO)"], [28603, "Estonian (ISO)"], [28605, "Latin 9 (ISO)"], [29001, "Europa"], [38598, "Hebrew (ISO-Logical)"], [50220, "Japanese (JIS)"], [50221, "Japanese (JIS-Allow 1 byte Kana) "], [50222, "Japanese (JIS-Allow 1 byte Kana - SO/SI)"], [50225, "Korean (ISO)"], [50227, "Chinese Simplified (ISO-2022)"], [51932, "Japanese (EUC)"], [51936, "Chinese Simplified (EUC) "], [51949, "Korean (EUC)"], [52936, "Chinese Simplified (HZ)"], [54936, "Chinese Simplified (GB18030)"], [57002, "ISCII Devanagari "], [57003, "ISCII Bengali "], [57004, "ISCII Tamil"], [57005, "ISCII Telugu "], [57006, "ISCII Assamese "], [57007, "ISCII Oriya"], [57008, "ISCII Kannada"], [57009, "ISCII Malayalam "], [57010, "ISCII Gujarati"], [57011, "ISCII Punjabi"], [65000, "Unicode (UTF-7)"], [65001, "Unicode (UTF-8)"]];
            }
            length = encodedata.length;
            if (length) {
                for (i = 0; i < length; ++i) {
                    listItems.push({
                        value: encodedata[i][0],
                        displayValue: encodedata[i][1]
                    });
                }
                this.cmbEncoding = new Common.UI.ComboBox({
                    el: $("#id-codepages-combo", this.$window),
                    menuStyle: "min-width: 220px;",
                    cls: "input-group-nr",
                    menuCls: "scrollable-menu",
                    data: listItems,
                    editable: false
                });
                this.cmbDelimiter = new Common.UI.ComboBox({
                    el: $("#id-delimiters-combo", this.$window),
                    menuStyle: "min-width: 110px;",
                    cls: "input-group-nr",
                    data: [{
                        value: 4,
                        displayValue: ","
                    },
                    {
                        value: 2,
                        displayValue: ";"
                    },
                    {
                        value: 3,
                        displayValue: ":"
                    },
                    {
                        value: 1,
                        displayValue: this.txtTab
                    },
                    {
                        value: 5,
                        displayValue: this.txtSpace
                    }],
                    editable: false
                });
                this.cmbDelimiter.setValue(4);
                if (encodedata.length) {
                    this.cmbEncoding.setValue(encodedata[0][0]);
                    if (this.settings && this.settings.asc_getCodePage()) {
                        this.cmbEncoding.setValue(this.settings.asc_getCodePage());
                    }
                    if (this.settings && this.settings.asc_getDelimiter()) {
                        this.cmbDelimiter.setValue(this.settings.asc_getDelimiter());
                    }
                }
            }
        },
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        txtDelimiter: "Delimiter",
        txtEncoding: "Encoding ",
        txtSpace: "Space",
        txtTab: "Tab",
        txtTitle: "Choose CSV options"
    },
    SSE.Views.OpenDialog || {}));
});