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
 "use strict";
(function (window, undefined) {
    if (!window["Asc"]) {
        window["Asc"] = {};
    }
    var prot;
    function asc_CAdvancedOptions(id, opt) {
        this.optionId = null;
        this.options = null;
        switch (id) {
        case c_oAscAdvancedOptionsID.CSV:
            this.optionId = id;
            this.options = new asc_CCSVOptions(opt);
            break;
        }
    }
    asc_CAdvancedOptions.prototype = {
        asc_getOptionId: function () {
            return this.optionId;
        },
        asc_getOptions: function () {
            return this.options;
        }
    };
    window["Asc"].asc_CAdvancedOptions = asc_CAdvancedOptions;
    window["Asc"]["asc_CAdvancedOptions"] = asc_CAdvancedOptions;
    prot = asc_CAdvancedOptions.prototype;
    prot["asc_getOptionId"] = prot.asc_getOptionId;
    prot["asc_getOptions"] = prot.asc_getOptions;
    function asc_CCSVOptions(opt) {
        this.codePages = function () {
            var arr = [],
            c;
            for (var i = 0; i < opt["encodings"].length; i++) {
                c = new asc_CCodePage();
                c.asc_setCodePageName(opt["encodings"][i]["name"]);
                c.asc_setCodePage(opt["encodings"][i]["codepage"]);
                c.asc_setText(opt["encodings"][i]["text"]);
                arr.push(c);
            }
            return arr;
        } ();
        this.recommendedSettings = new asc_CCSVAdvancedOptions(opt["codepage"], opt["delimiter"]);
    }
    asc_CCSVOptions.prototype = {
        asc_getCodePages: function () {
            return this.codePages;
        },
        asc_getRecommendedSettings: function () {
            return this.recommendedSettings;
        }
    };
    window["Asc"].asc_CCSVOptions = asc_CCSVOptions;
    window["Asc"]["asc_CCSVOptions"] = asc_CCSVOptions;
    prot = asc_CCSVOptions.prototype;
    prot["asc_getCodePages"] = prot.asc_getCodePages;
    prot["asc_getRecommendedSettings"] = prot.asc_getRecommendedSettings;
    function asc_CCSVAdvancedOptions(codepage, delimiter) {
        this.codePage = codepage;
        this.delimiter = delimiter;
    }
    asc_CCSVAdvancedOptions.prototype = {
        asc_getDelimiter: function () {
            return this.delimiter;
        },
        asc_setDelimiter: function (v) {
            this.delimiter = v;
        },
        asc_getCodePage: function () {
            return this.codePage;
        },
        asc_setCodePage: function (v) {
            this.codePage = v;
        }
    };
    window["Asc"].asc_CCSVAdvancedOptions = asc_CCSVAdvancedOptions;
    window["Asc"]["asc_CCSVAdvancedOptions"] = asc_CCSVAdvancedOptions;
    prot = asc_CCSVAdvancedOptions.prototype;
    prot["asc_getDelimiter"] = prot.asc_getDelimiter;
    prot["asc_setDelimiter"] = prot.asc_setDelimiter;
    prot["asc_getCodePage"] = prot.asc_getCodePage;
    prot["asc_setCodePage"] = prot.asc_setCodePage;
    function asc_CCodePage(codepage) {
        this.codePageName = null;
        this.codePage = null;
        this.text = null;
    }
    asc_CCodePage.prototype = {
        asc_getCodePageName: function () {
            return this.codePageName;
        },
        asc_setCodePageName: function (v) {
            this.codePageName = v;
        },
        asc_getCodePage: function () {
            return this.codePage;
        },
        asc_setCodePage: function (v) {
            this.codePage = v;
        },
        asc_getText: function () {
            return this.text;
        },
        asc_setText: function (v) {
            this.text = v;
        }
    };
    window["Asc"].asc_CCodePage = asc_CCodePage;
    window["Asc"]["asc_CCodePage"] = asc_CCodePage;
    prot = asc_CCodePage.prototype;
    prot["asc_getCodePageName"] = prot.asc_getCodePageName;
    prot["asc_setCodePageName"] = prot.asc_setCodePageName;
    prot["asc_getCodePage"] = prot.asc_getCodePage;
    prot["asc_setCodePage"] = prot.asc_setCodePage;
    prot["asc_getText"] = prot.asc_getText;
    prot["asc_setText"] = prot.asc_setText;
    function asc_CDelimiter(delimiter) {
        this.delimiterName = delimiter;
    }
    asc_CDelimiter.prototype = {
        asc_getDelimiterName: function () {
            return this.delimiterName;
        },
        asc_setDelimiterName: function (v) {
            this.delimiterName = v;
        }
    };
    window["Asc"].asc_CDelimiter = asc_CDelimiter;
    window["Asc"]["asc_CDelimiter"] = asc_CDelimiter;
    prot = asc_CDelimiter.prototype;
    prot["asc_getDelimiterName"] = prot.asc_getDelimiterName;
    prot["asc_setDelimiterName"] = prot.asc_setDelimiterName;
    CFont.prototype = {
        asc_getFontId: function () {
            return this.id;
        },
        asc_getFontName: function () {
            return this.name;
        },
        asc_getFontThumbnail: function () {
            return this.thumbnail;
        },
        asc_getFontType: function () {
            return this.type;
        }
    };
    window["Asc"].CFont = CFont;
    window["Asc"]["CFont"] = CFont;
    prot = CFont.prototype;
    prot["asc_getFontId"] = prot.asc_getFontId;
    prot["asc_getFontName"] = prot.asc_getFontName;
    prot["asc_getFontThumbnail"] = prot.asc_getFontThumbnail;
    prot["asc_getFontType"] = prot.asc_getFontType;
    function asc_CFormulaGroup(name) {
        this.groupName = name;
        this.formulasArray = [];
    }
    asc_CFormulaGroup.prototype = {
        asc_getGroupName: function () {
            return this.groupName;
        },
        asc_getFormulasArray: function () {
            return this.formulasArray;
        },
        asc_addFormulaElement: function (o) {
            return this.formulasArray.push(o);
        }
    };
    window["Asc"].asc_CFormulaGroup = asc_CFormulaGroup;
    window["Asc"]["asc_CFormulaGroup"] = asc_CFormulaGroup;
    prot = asc_CFormulaGroup.prototype;
    prot["asc_getGroupName"] = prot.asc_getGroupName;
    prot["asc_getFormulasArray"] = prot.asc_getFormulasArray;
    prot["asc_addFormulaElement"] = prot.asc_addFormulaElement;
    function asc_CFormula(o) {
        this.name = o.name;
        this.arg = o.args;
    }
    asc_CFormula.prototype = {
        asc_getName: function () {
            return this.name;
        },
        asc_getArguments: function () {
            return this.arg;
        }
    };
    window["Asc"].asc_CFormula = asc_CFormula;
    window["Asc"]["asc_CFormula"] = asc_CFormula;
    prot = asc_CFormula.prototype;
    prot["asc_getName"] = prot.asc_getName;
    prot["asc_getArguments"] = prot.asc_getArguments;
})(window);