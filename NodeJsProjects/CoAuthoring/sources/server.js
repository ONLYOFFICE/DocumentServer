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
 var config = require("./config.json");
process.env.NODE_ENV = config["server"]["mode"];
var logger = require("./../../Common/sources/logger");
var express = require("express");
var http = require("http");
var https = require("https");
var fs = require("fs");
var app = express();
var server = {};
if (config["ssl"]) {
    var privateKey = fs.readFileSync(config["ssl"]["key"]).toString();
    var certificateKey = fs.readFileSync(config["ssl"]["cert"]).toString();
    var trustedCertificate = fs.readFileSync(config["ssl"]["ca"]).toString();
    var options = {
        key: privateKey,
        cert: certificateKey,
        ca: [trustedCertificate]
    };
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}
app.configure("development", function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});
app.configure("production", function () {
    app.use(express.errorHandler());
});
var docsCoServer = require("./DocsCoServer");
docsCoServer.install(server, function () {
    server.listen(config["server"]["port"], function () {
        logger.info("Express server listening on port %d in %s mode", config["server"]["port"], app.settings.env);
    });
    app.get("/index.html", function (req, res) {
        res.send("Server is functioning normally");
    });
});