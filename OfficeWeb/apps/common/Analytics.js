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
 if (Common === undefined) {
    var Common = {};
}
Common.component = Common.component || {};
Common.Analytics = Common.component.Analytics = new(function () {
    var _category;
    return {
        initialize: function (id, category) {
            if (typeof id === "undefined") {
                throw "Analytics: invalid id.";
            }
            if (typeof category === "undefined" || Object.prototype.toString.apply(category) !== "[object String]") {
                throw "Analytics: invalid category type.";
            }
            _category = category;
            $("head").append('<script type="text/javascript">' + "var _gaq = _gaq || [];" + '_gaq.push(["_setAccount", "' + id + '"]);' + '_gaq.push(["_trackPageview"]);' + "(function() {" + 'var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;' + 'ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";' + 'var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);' + "})();" + "</script>");
        },
        trackEvent: function (action, label, value) {
            if (typeof action !== "undefined" && Object.prototype.toString.apply(action) !== "[object String]") {
                throw "Analytics: invalid action type.";
            }
            if (typeof label !== "undefined" && Object.prototype.toString.apply(label) !== "[object String]") {
                throw "Analytics: invalid label type.";
            }
            if (typeof value !== "undefined" && !(Object.prototype.toString.apply(value) === "[object Number]" && isFinite(value))) {
                throw "Analytics: invalid value type.";
            }
            if (typeof _gaq === "undefined") {
                return;
            }
            if (_category === "undefined") {
                throw "Analytics is not initialized.";
            }
            _gaq.push(["_trackEvent", _category, action, label, value]);
        }
    };
})();