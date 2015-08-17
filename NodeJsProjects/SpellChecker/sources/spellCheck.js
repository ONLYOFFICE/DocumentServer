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
 var sockjs = require("sockjs"),
nodehun = require("nodehun"),
config = require("./config.json"),
logger = require("./../../Common/sources/logger"),
fs = require("fs");
var arrDictionaries = {};
(function () {
    var arrDictionariesConfig = config["dictionaries"];
    var oDictTmp = null,
    pathTmp = "",
    oDictName = null;
    for (var indexDict = 0, lengthDict = arrDictionariesConfig.length; indexDict < lengthDict; ++indexDict) {
        oDictTmp = arrDictionariesConfig[indexDict];
        oDictName = oDictTmp.name;
        pathTmp = __dirname + "/../Dictionaries/" + oDictName + "/" + oDictName + ".";
        arrDictionaries[oDictTmp.id] = new nodehun(fs.readFileSync(pathTmp + "aff"), fs.readFileSync(pathTmp + "dic"));
    }
})();
exports.install = function (server, callbackFunction) {
    var sockjs_opts = {
        sockjs_url: "./../../Common/sources/sockjs-0.3.min.js"
    },
    sockjs_echo = sockjs.createServer(sockjs_opts);
    sockjs_echo.on("connection", function (conn) {
        if (null == conn) {
            logger.error("null == conn");
            return;
        }
        conn.on("data", function (message) {
            try {
                var data = JSON.parse(message);
                switch (data.type) {
                case "spellCheck":
                    spellCheck(conn, data);
                    break;
                }
            } catch(e) {
                logger.error("error receiving response: %s", e);
            }
        });
        conn.on("error", function () {
            logger.error("On error");
        });
        conn.on("close", function () {
            logger.info("Connection closed or timed out");
        });
    });
    function sendData(conn, data) {
        conn.write(JSON.stringify(data));
    }
    function spellCheck(conn, data) {
        var oSpellInfo;
        function checkEnd() {
            if (0 === oSpellInfo.usrWordsLength) {
                sendData(conn, {
                    type: "spellCheck",
                    spellCheckData: JSON.stringify(data)
                });
            }
        }
        function spellSuggest(index, word, lang) {
            oSpellInfo.arrTimes[index] = new Date();
            logger.info("start %s word = %s, lang = %s", data.type, word, lang);
            var oDictionary = arrDictionaries[lang];
            if (undefined === oDictionary) {
                data.usrCorrect[index] = false;
                --data.usrWordsLength;
                checkEnd();
            } else {
                if ("spell" === data.type) {
                    oDictionary.isCorrect(word, function (err, correct, origWord) {
                        data.usrCorrect[index] = (!err && correct);
                        logger.info("spell word = %s, lang = %s, time = %s", word, lang, new Date() - oSpellInfo.arrTimes[index]);
                        --oSpellInfo.usrWordsLength;
                        checkEnd();
                    });
                } else {
                    if ("suggest" === data.type) {
                        oDictionary.spellSuggestions(word, function (err, correct, suggestions, origWord) {
                            data.usrSuggest[index] = suggestions;
                            logger.info("suggest word = %s, lang = %s, time = %s", word, lang, new Date() - oSpellInfo.arrTimes[index]);
                            --oSpellInfo.usrWordsLength;
                            checkEnd();
                        });
                    }
                }
            }
        }
        data = JSON.parse(data.spellCheckData);
        data.usrCorrect = [];
        data.usrSuggest = [];
        oSpellInfo = {
            usrWordsLength: data.usrWords.length,
            arrTimes: []
        };
        for (var i = 0, length = data.usrWords.length; i < length; ++i) {
            spellSuggest(i, data.usrWords[i], data.usrLang[i]);
        }
    }
    sockjs_echo.installHandlers(server, {
        prefix: "/doc/[0-9-.a-zA-Z_=]*/c",
        log: function (severity, message) {
            logger.info(message);
        }
    });
    callbackFunction();
};
exports.spellSuggest = function (type, word, lang, callbackFunction) {
    var oDictionary = arrDictionaries[lang];
    if (undefined === oDictionary) {
        callbackFunction(false);
    } else {
        if ("spell" === type) {
            oDictionary.isCorrect(word, function (err, correct, origWord) {
                callbackFunction(!err && correct);
            });
        } else {
            if ("suggest" === type) {
                oDictionary.spellSuggestions(word, function (err, correct, suggestions, origWord) {
                    callbackFunction(suggestions);
                });
            }
        }
    }
};