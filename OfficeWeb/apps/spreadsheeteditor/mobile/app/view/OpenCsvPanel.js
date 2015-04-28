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
 Ext.define("SSE.view.OpenCsvPanel", {
    extend: "Ext.form.Panel",
    alias: "widget.seopencsvpanel",
    requires: ["Ext.form.Panel", "Ext.form.FieldSet", "Ext.field.Select"],
    config: {
        style: "padding: 0;"
    },
    initialize: function () {
        var me = this;
        this.add({
            xtype: "fieldset",
            title: this.txtTitle,
            instructions: this.txtHint,
            defaults: {
                labelWidth: "36%"
            },
            items: [{
                xtype: "selectfield",
                name: "encoding",
                label: this.txtEncoding,
                options: [{
                    value: 37,
                    text: "IBM EBCDIC (US-Canada)"
                },
                {
                    value: 437,
                    text: "OEM United States"
                },
                {
                    value: 500,
                    text: "IBM EBCDIC (International)"
                },
                {
                    value: 708,
                    text: "Arabic (ASMO 708)"
                },
                {
                    value: 720,
                    text: "Arabic (DOS)"
                },
                {
                    value: 737,
                    text: "Greek (DOS)"
                },
                {
                    value: 775,
                    text: "Baltic (DOS)"
                },
                {
                    value: 850,
                    text: "Western European (DOS)"
                },
                {
                    value: 852,
                    text: "Central European (DOS)"
                },
                {
                    value: 855,
                    text: "OEM Cyrillic"
                },
                {
                    value: 857,
                    text: "Turkish (DOS)"
                },
                {
                    value: 858,
                    text: "OEM Multilingual Latin I"
                },
                {
                    value: 860,
                    text: "Portuguese (DOS)"
                },
                {
                    value: 861,
                    text: "Icelandic (DOS)"
                },
                {
                    value: 862,
                    text: "Hebrew (DOS)"
                },
                {
                    value: 863,
                    text: "French Canadian (DOS)"
                },
                {
                    value: 864,
                    text: "Arabic (864) "
                },
                {
                    value: 865,
                    text: "Nordic (DOS)"
                },
                {
                    value: 866,
                    text: "Cyrillic (DOS)"
                },
                {
                    value: 869,
                    text: "Greek, Modern (DOS)"
                },
                {
                    value: 870,
                    text: "IBM EBCDIC (Multilingual Latin-2)"
                },
                {
                    value: 874,
                    text: "Thai (Windows)"
                },
                {
                    value: 875,
                    text: "IBM EBCDIC (Greek Modern)"
                },
                {
                    value: 932,
                    text: "Japanese (Shift-JIS)"
                },
                {
                    value: 936,
                    text: "Chinese Simplified (GB2312)"
                },
                {
                    value: 949,
                    text: "Korean"
                },
                {
                    value: 950,
                    text: "Chinese Traditional (Big5)"
                },
                {
                    value: 1026,
                    text: "IBM EBCDIC (Turkish Latin-5)"
                },
                {
                    value: 1047,
                    text: "IBM Latin-1"
                },
                {
                    value: 1140,
                    text: "IBM EBCDIC (US-Canada-Euro)"
                },
                {
                    value: 1141,
                    text: "IBM EBCDIC (Germany-Euro)"
                },
                {
                    value: 1142,
                    text: "IBM EBCDIC (Denmark-Norway-Euro)"
                },
                {
                    value: 1143,
                    text: "IBM EBCDIC (Finland-Sweden-Euro)"
                },
                {
                    value: 1144,
                    text: "IBM EBCDIC (Italy-Euro)"
                },
                {
                    value: 1145,
                    text: "IBM EBCDIC (Spain-Euro)"
                },
                {
                    value: 1146,
                    text: "IBM EBCDIC (UK-Euro)"
                },
                {
                    value: 1147,
                    text: "IBM EBCDIC (France-Euro)"
                },
                {
                    value: 1148,
                    text: "IBM EBCDIC (International-Euro)"
                },
                {
                    value: 1149,
                    text: "IBM EBCDIC (Icelandic-Euro)"
                },
                {
                    value: 1200,
                    text: "Unicode"
                },
                {
                    value: 1201,
                    text: "Unicode (Big-Endian)"
                },
                {
                    value: 1250,
                    text: "Central European (Windows)"
                },
                {
                    value: 1251,
                    text: "Cyrillic (Windows)"
                },
                {
                    value: 1252,
                    text: "Western European (Windows)"
                },
                {
                    value: 1253,
                    text: "Greek (Windows)"
                },
                {
                    value: 1254,
                    text: "Turkish (Windows)"
                },
                {
                    value: 1255,
                    text: "Hebrew (Windows) "
                },
                {
                    value: 1256,
                    text: "Arabic (Windows) "
                },
                {
                    value: 1257,
                    text: "Baltic (Windows)"
                },
                {
                    value: 1258,
                    text: "Vietnamese (Windows)"
                },
                {
                    value: 1361,
                    text: "Korean (Johab)"
                },
                {
                    value: 10000,
                    text: "Western European (Mac)"
                },
                {
                    value: 10001,
                    text: "Japanese (Mac)"
                },
                {
                    value: 10002,
                    text: "Chinese Traditional (Mac)"
                },
                {
                    value: 10003,
                    text: "Korean (Mac)"
                },
                {
                    value: 10004,
                    text: "Arabic (Mac) "
                },
                {
                    value: 10005,
                    text: "Hebrew (Mac)"
                },
                {
                    value: 10006,
                    text: "Greek (Mac) "
                },
                {
                    value: 10007,
                    text: "Cyrillic (Mac)"
                },
                {
                    value: 10008,
                    text: "Chinese Simplified (Mac)"
                },
                {
                    value: 10010,
                    text: "Romanian (Mac)"
                },
                {
                    value: 10017,
                    text: "Ukrainian (Mac)"
                },
                {
                    value: 10021,
                    text: "Thai (Mac)"
                },
                {
                    value: 10029,
                    text: "Central European (Mac) "
                },
                {
                    value: 10079,
                    text: "Icelandic (Mac)"
                },
                {
                    value: 10081,
                    text: "Turkish (Mac)"
                },
                {
                    value: 10082,
                    text: "Croatian (Mac)"
                },
                {
                    value: 12000,
                    text: "Unicode (UTF-32)"
                },
                {
                    value: 12001,
                    text: "Unicode (UTF-32 Big-Endian)"
                },
                {
                    value: 20000,
                    text: "Chinese Traditional (CNS)"
                },
                {
                    value: 20001,
                    text: "TCA Taiwan"
                },
                {
                    value: 20002,
                    text: "Chinese Traditional (Eten)"
                },
                {
                    value: 20003,
                    text: "IBM5550 Taiwan"
                },
                {
                    value: 20004,
                    text: "TeleText Taiwan"
                },
                {
                    value: 20005,
                    text: "Wang Taiwan"
                },
                {
                    value: 20105,
                    text: "Western European (IA5)"
                },
                {
                    value: 20106,
                    text: "German (IA5)"
                },
                {
                    value: 20107,
                    text: "Swedish (IA5) "
                },
                {
                    value: 20108,
                    text: "Norwegian (IA5) "
                },
                {
                    value: 20127,
                    text: "US-ASCII"
                },
                {
                    value: 20261,
                    text: "T.61 "
                },
                {
                    value: 20269,
                    text: "ISO-6937"
                },
                {
                    value: 20273,
                    text: "IBM EBCDIC (Germany)"
                },
                {
                    value: 20277,
                    text: "IBM EBCDIC (Denmark-Norway) "
                },
                {
                    value: 20278,
                    text: "IBM EBCDIC (Finland-Sweden)"
                },
                {
                    value: 20280,
                    text: "IBM EBCDIC (Italy)"
                },
                {
                    value: 20284,
                    text: "IBM EBCDIC (Spain)"
                },
                {
                    value: 20285,
                    text: "IBM EBCDIC (UK)"
                },
                {
                    value: 20290,
                    text: "IBM EBCDIC (Japanese katakana)"
                },
                {
                    value: 20297,
                    text: "IBM EBCDIC (France)"
                },
                {
                    value: 20420,
                    text: "IBM EBCDIC (Arabic)"
                },
                {
                    value: 20423,
                    text: "IBM EBCDIC (Greek)"
                },
                {
                    value: 20424,
                    text: "IBM EBCDIC (Hebrew)"
                },
                {
                    value: 20833,
                    text: "IBM EBCDIC (Korean Extended)"
                },
                {
                    value: 20838,
                    text: "IBM EBCDIC (Thai)"
                },
                {
                    value: 20866,
                    text: "Cyrillic (KOI8-R)"
                },
                {
                    value: 20871,
                    text: "IBM EBCDIC (Icelandic) "
                },
                {
                    value: 20880,
                    text: "IBM EBCDIC (Cyrillic Russian)"
                },
                {
                    value: 20905,
                    text: "IBM EBCDIC (Turkish)"
                },
                {
                    value: 20924,
                    text: "IBM Latin-1 "
                },
                {
                    value: 20932,
                    text: "Japanese (JIS 0208-1990 and 0212-1990)"
                },
                {
                    value: 20936,
                    text: "Chinese Simplified (GB2312-80) "
                },
                {
                    value: 20949,
                    text: "Korean Wansung "
                },
                {
                    value: 21025,
                    text: "IBM EBCDIC (Cyrillic Serbian-Bulgarian)"
                },
                {
                    value: 21866,
                    text: "Cyrillic (KOI8-U)"
                },
                {
                    value: 28591,
                    text: "Western European (ISO) "
                },
                {
                    value: 28592,
                    text: "Central European (ISO)"
                },
                {
                    value: 28593,
                    text: "Latin 3 (ISO)"
                },
                {
                    value: 28594,
                    text: "Baltic (ISO)"
                },
                {
                    value: 28595,
                    text: "Cyrillic (ISO) "
                },
                {
                    value: 28596,
                    text: "Arabic (ISO)"
                },
                {
                    value: 28597,
                    text: "Greek (ISO) "
                },
                {
                    value: 28598,
                    text: "Hebrew (ISO-Visual)"
                },
                {
                    value: 28599,
                    text: "Turkish (ISO)"
                },
                {
                    value: 28603,
                    text: "Estonian (ISO)"
                },
                {
                    value: 28605,
                    text: "Latin 9 (ISO)"
                },
                {
                    value: 29001,
                    text: "Europa"
                },
                {
                    value: 38598,
                    text: "Hebrew (ISO-Logical)"
                },
                {
                    value: 50220,
                    text: "Japanese (JIS)"
                },
                {
                    value: 50221,
                    text: "Japanese (JIS-Allow 1 byte Kana) "
                },
                {
                    value: 50222,
                    text: "Japanese (JIS-Allow 1 byte Kana - SO/SI)"
                },
                {
                    value: 50225,
                    text: "Korean (ISO)"
                },
                {
                    value: 50227,
                    text: "Chinese Simplified (ISO-2022)"
                },
                {
                    value: 51932,
                    text: "Japanese (EUC)"
                },
                {
                    value: 51936,
                    text: "Chinese Simplified (EUC) "
                },
                {
                    value: 51949,
                    text: "Korean (EUC)"
                },
                {
                    value: 52936,
                    text: "Chinese Simplified (HZ)"
                },
                {
                    value: 54936,
                    text: "Chinese Simplified (GB18030)"
                },
                {
                    value: 57002,
                    text: "ISCII Devanagari "
                },
                {
                    value: 57003,
                    text: "ISCII Bengali "
                },
                {
                    value: 57004,
                    text: "ISCII Tamil"
                },
                {
                    value: 57005,
                    text: "ISCII Telugu "
                },
                {
                    value: 57006,
                    text: "ISCII Assamese "
                },
                {
                    value: 57007,
                    text: "ISCII Oriya"
                },
                {
                    value: 57008,
                    text: "ISCII Kannada"
                },
                {
                    value: 57009,
                    text: "ISCII Malayalam "
                },
                {
                    value: 57010,
                    text: "ISCII Gujarati"
                },
                {
                    value: 57011,
                    text: "ISCII Punjabi"
                },
                {
                    value: 65000,
                    text: "Unicode (UTF-7)"
                },
                {
                    value: 65001,
                    text: "Unicode (UTF-8)"
                }]
            },
            {
                xtype: "selectfield",
                name: "delimiter",
                label: this.txtDelimiter,
                options: [{
                    value: 4,
                    text: ","
                },
                {
                    value: 2,
                    text: ";"
                },
                {
                    value: 3,
                    text: ":"
                },
                {
                    value: 1,
                    text: this.txtTab
                },
                {
                    value: 5,
                    text: this.txtSpace
                }]
            }]
        });
        this.add({
            xtype: "button",
            text: "OK",
            handler: function () {
                me.fireEvent("close", this, {
                    encoding: me.getValues().encoding,
                    delimiter: me.getValues().delimiter
                });
            }
        });
    },
    txtEncoding: "Encoding ",
    txtDelimiter: "Delimiter",
    txtTab: "Tab",
    txtSpace: "Space",
    txtTitle: "Choose CSV opening options",
    txtHint: "Please enter the information above."
});