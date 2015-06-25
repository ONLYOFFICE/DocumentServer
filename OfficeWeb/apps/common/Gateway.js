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
Common.Gateway = new(function () {
    var me = this,
    $me = $(me);
    var commandMap = {
        "init": function (data) {
            $me.trigger("init", data);
        },
        "openDocument": function (data) {
            $me.trigger("opendocument", data);
        },
        "showMessage": function (data) {
            $me.trigger("showmessage", data);
        },
        "applyEditRights": function (data) {
            $me.trigger("applyeditrights", data);
        },
        "processSaveResult": function (data) {
            $me.trigger("processsaveresult", data);
        },
        "processRightsChange": function (data) {
            $me.trigger("processrightschange", data);
        },
        "refreshHistory": function (data) {
            $me.trigger("refreshhistory", data);
        },
        "setHistoryData": function (data) {
            $me.trigger("sethistorydata", data);
        },
        "processMouse": function (data) {
            $me.trigger("processmouse", data);
        },
        "internalCommand": function (data) {
            $me.trigger("internalcommand", data);
        },
        "resetFocus": function (data) {
            $me.trigger("resetfocus", data);
        }
    };
    var _postMessage = function (msg) {
        if (window.parent && window.JSON) {
            window.parent.postMessage(window.JSON.stringify(msg), "*");
        }
    };
    var _onMessage = function (msg) {
        var data = msg.data;
        if (Object.prototype.toString.apply(data) !== "[object String]" || !window.JSON) {
            return;
        }
        var cmd, handler;
        try {
            cmd = window.JSON.parse(data);
        } catch(e) {
            cmd = "";
        }
        if (cmd) {
            handler = commandMap[cmd.command];
            if (handler) {
                handler.call(this, cmd.data);
            }
        }
    };
    var fn = function (e) {
        _onMessage(e);
    };
    if (window.attachEvent) {
        window.attachEvent("onmessage", fn);
    } else {
        window.addEventListener("message", fn, false);
    }
    return {
        ready: function () {
            _postMessage({
                event: "onReady"
            });
        },
        goBack: function (new_window) {
            _postMessage({
                event: "onBack",
                data: (new_window == true)
            });
        },
        save: function (url) {
            _postMessage({
                event: "onSave",
                data: url
            });
        },
        requestEditRights: function () {
            _postMessage({
                event: "onRequestEditRights"
            });
        },
        requestHistory: function () {
            _postMessage({
                event: "onRequestHistory"
            });
        },
        requestHistoryData: function (revision) {
            _postMessage({
                event: "onRequestHistoryData",
                data: revision
            });
        },
        requestHistoryClose: function (revision) {
            _postMessage({
                event: "onRequestHistoryClose"
            });
        },
        reportError: function (code, description) {
            _postMessage({
                event: "onError",
                data: {
                    errorCode: code,
                    errorDescription: description
                }
            });
        },
        setDocumentModified: function (modified) {
            _postMessage({
                event: "onDocumentStateChange",
                data: modified
            });
        },
        internalMessage: function (type, data) {
            _postMessage({
                event: "onInternalMessage",
                data: {
                    type: type,
                    data: data
                }
            });
        },
        updateVersion: function () {
            _postMessage({
                event: "onOutdatedVersion"
            });
        },
        on: function (event, handler) {
            var localHandler = function (event, data) {
                handler.call(me, data);
            };
            $me.on(event, localHandler);
        }
    };
})();