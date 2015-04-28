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
    var c_TrackingType = {
        TT_USER_COUNT: 0,
        TT_ACTIVE_CONNECTION: 1,
        TT_TIME_USAGE: 2,
        TT_DOCUMENT_SESSION: 3,
        TT_NONE: 4,
        TT_USER_COUNT_2: 5,
        TT_ACTIVE_CONNECTION_AWS: 6
    };
    function CTrackFile(obj) {
        this.trackingType = c_TrackingType.TT_USER_COUNT;
        this.licenseId = null;
        this.trackingUrl = g_sTrackingServiceLocalUrl;
        this.isPeriodicalyTracking = false;
        this.isAliveTrackingOnly = false;
        this.isTrackDone = false;
        this.bAliveUser2 = false;
        if (undefined != obj && null != obj) {
            if (undefined != obj["licenseId"] && null != obj["licenseId"]) {
                this.licenseId = obj["licenseId"];
            }
            if (undefined != obj["trackingType"] && null != obj["trackingType"]) {
                this.trackingType = obj["trackingType"];
            }
            if (undefined != obj["trackingUrl"] && null != obj["trackingUrl"]) {
                this.trackingUrl = obj["trackingUrl"];
            }
        }
        switch (this.trackingType) {
        case c_TrackingType.TT_ACTIVE_CONNECTION:
            case c_TrackingType.TT_ACTIVE_CONNECTION_AWS:
            this.isPeriodicalyTracking = true;
            this.isAliveTrackingOnly = false;
            break;
        case c_TrackingType.TT_DOCUMENT_SESSION:
            this.isPeriodicalyTracking = false;
            this.isAliveTrackingOnly = true;
            break;
        case c_TrackingType.TT_USER_COUNT_2:
            this.bAliveUser2 = true;
            this.isPeriodicalyTracking = false;
            this.isAliveTrackingOnly = true;
            break;
        case c_TrackingType.TT_NONE:
            this.isTrackDone = true;
            this.isPeriodicalyTracking = false;
            break;
        default:
            break;
        }
        this.sendTrackFunc = null;
        this.trackingInterval = 300 * 1000;
        this.docId = null;
        this.userId = null;
        this.bAliveUser = false;
    }
    CTrackFile.prototype.Start = function () {
        var oThis = this;
        if (this.isPeriodicalyTracking || !this.isTrackDone) {
            var _OnTrackingTimer = function () {
                oThis.Start();
            };
            var _OnSendTrack = function () {
                setTimeout(_OnTrackingTimer, oThis.trackingInterval);
            };
            if (this.isAliveTrackingOnly && !this.bAliveUser && !this.bAliveUser2) {
                _OnSendTrack();
            } else {
                this.isTrackDone = true;
                this._sendTrack(_OnSendTrack);
            }
        }
    };
    CTrackFile.prototype.Stop = function () {};
    CTrackFile.prototype.setInterval = function (inverval) {
        this.trackingInterval = inverval * 1000;
    };
    CTrackFile.prototype.setDocId = function (docId) {
        this.docId = docId;
    };
    CTrackFile.prototype.setUserId = function (userId) {
        this.userId = userId;
    };
    CTrackFile.prototype.setTrackFunc = function (func) {
        if (undefined != func) {
            this.sendTrackFunc = func;
        }
    };
    CTrackFile.prototype.setUserAlive = function () {
        this.bAliveUser = true;
    };
    CTrackFile.prototype._sendTrack = function (callback) {
        var rData = {
            "docId": this.docId,
            "clientId": this.userId,
            "isAlive": this.bAliveUser ? 1 : 0
        };
        this.bAliveUser = false;
        if (this.sendTrackFunc != null) {
            this.sendTrackFunc(callback, this.trackingUrl, JSON.stringify(rData));
        }
    };
    asc.CTrackFile = CTrackFile;
})(window, undefined);