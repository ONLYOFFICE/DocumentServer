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
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var prot;
    function asc_CUser(val) {
        this.id = null;
        this.userName = null;
        this.state = undefined;
        this.indexUser = -1;
        this.color = null;
        this.view = false;
        this._setUser(val);
        return this;
    }
    asc_CUser.prototype._setUser = function (val) {
        if (val) {
            this.id = val["id"];
            this.userName = val["username"];
            this.indexUser = val["indexUser"];
            this.color = g_oArrUserColors[this.indexUser % g_oArrUserColors.length];
            this.state = val["state"];
            this.view = val["view"];
        }
    };
    asc_CUser.prototype.asc_getId = function () {
        return this.id;
    };
    asc_CUser.prototype.asc_getUserName = function () {
        return this.userName;
    };
    asc_CUser.prototype.asc_getState = function () {
        return this.state;
    };
    asc_CUser.prototype.asc_getColor = function () {
        return "#" + ("000000" + this.color.toString(16)).substr(-6);
    };
    asc_CUser.prototype.asc_getColorValue = function () {
        return this.color;
    };
    asc_CUser.prototype.asc_getView = function () {
        return this.view;
    };
    asc_CUser.prototype.asc_setId = function (val) {
        this.id = val;
    };
    asc_CUser.prototype.asc_setUserName = function (val) {
        this.userName = val;
    };
    asc_CUser.prototype.asc_setState = function (val) {
        this.state = val;
    };
    asc_CUser.prototype.asc_setColor = function (val) {
        this.color = val;
    };
    window["Asc"]["asc_CUser"] = window["Asc"].asc_CUser = asc_CUser;
    prot = asc_CUser.prototype;
    prot["asc_getId"] = prot.asc_getId;
    prot["asc_getUserName"] = prot.asc_getUserName;
    prot["asc_getState"] = prot.asc_getState;
    prot["asc_setId"] = prot.asc_setId;
    prot["asc_getColor"] = prot.asc_getColor;
    prot["asc_getColorValue"] = prot.asc_getColorValue;
    prot["asc_getView"] = prot.asc_getView;
    prot["asc_setUserName"] = prot.asc_setUserName;
    prot["asc_setState"] = prot.asc_setState;
    prot["asc_setColor"] = prot.asc_setColor;
})(window);
var ConnectionState = {
    Reconnect: -1,
    None: 0,
    WaitAuth: 1,
    Authorized: 2,
    Closed: 3,
    SaveChanges: 4
};