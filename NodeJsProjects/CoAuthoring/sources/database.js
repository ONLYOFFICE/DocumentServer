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
 var mongoDB = require("mongodb");
var config = require("./config.json");
var _errorConnection = true;
var logger = require("./../../Common/sources/logger");
function CreateDbClient() {
    return new mongoDB.Db(config["mongodb"]["database"], new mongoDB.Server(config["mongodb"]["host"], config["mongodb"]["port"], {
        auto_reconnect: true
    }), {
        safe: false
    });
}
exports.insert = function (_collectionName, _newElement) {
    var _db = CreateDbClient();
    if (!_db) {
        logger.error("Error _db");
        return;
    }
    _db.open(function (err, db) {
        if (!err) {
            db.collection(_collectionName, function (err, collection) {
                if (!err) {
                    collection.insert(_newElement);
                } else {
                    logger.error("Error collection");
                    return;
                }
                db.close();
            });
        } else {
            logger.error("Error open database");
        }
    });
};
exports.remove = function (_collectionName, _removeElements) {
    var _db = CreateDbClient();
    if (!_db) {
        logger.error("Error _db");
        return;
    }
    _db.open(function (err, db) {
        if (!err) {
            db.collection(_collectionName, function (err, collection) {
                if (!err) {
                    collection.remove(_removeElements, function (err, collection) {
                        logger.info("All elements remove");
                    });
                } else {
                    logger.error("Error collection");
                    return;
                }
                db.close();
            });
        } else {
            logger.error("Error open database");
        }
    });
};
exports.load = function (_collectionName, callbackFunction) {
    var _db = CreateDbClient();
    if (!_db) {
        logger.error("Error _db");
        return callbackFunction(null);
    }
    var result = [];
    _db.open(function (err, db) {
        db.collection(_collectionName, function (err, collection) {
            collection.find(function (err, cursor) {
                cursor.each(function (err, item) {
                    if (item != null) {
                        if (!result.hasOwnProperty(item.docid)) {
                            result[item.docid] = [item];
                        } else {
                            result[item.docid].push(item);
                        }
                    } else {
                        callbackFunction(result);
                    }
                });
                db.close();
            });
        });
    });
};