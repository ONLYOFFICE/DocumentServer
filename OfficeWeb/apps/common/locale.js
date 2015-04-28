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
Common.Locale = new(function () {
    var l10n = {};
    var _createXMLHTTPObject = function () {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest != "undefined") {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    };
    var _applyLocalization = function () {
        try {
            for (var prop in l10n) {
                var p = prop.split(".");
                if (p && p.length > 2) {
                    var obj = window;
                    for (var i = 0; i < p.length - 1; ++i) {
                        if (obj[p[i]] === undefined) {
                            obj[p[i]] = new Object();
                        }
                        obj = obj[p[i]];
                    }
                    if (obj) {
                        obj[p[p.length - 1]] = l10n[prop];
                    }
                }
            }
        } catch(e) {}
    };
    var _get = function (prop, scope) {
        var res = "";
        if (scope && scope.name) {
            res = l10n[scope.name + "." + prop];
        }
        return res || (scope ? eval(scope.name).prototype[prop] : "");
    };
    var _getUrlParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    try {
        var langParam = _getUrlParameterByName("lang");
        var xhrObj = _createXMLHTTPObject();
        if (xhrObj && langParam) {
            var lang = langParam.split("-")[0];
            xhrObj.open("GET", "locale/" + lang + ".json", false);
            xhrObj.send("");
            l10n = eval("(" + xhrObj.responseText + ")");
        }
    } catch(e) {}
    return {
        apply: _applyLocalization,
        get: _get
    };
})();