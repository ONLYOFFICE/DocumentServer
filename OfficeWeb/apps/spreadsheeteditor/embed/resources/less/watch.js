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
 (function () {
    var path = require("path"),
    util = require("util"),
    fs = require("fs"),
    watchr = require("watchr"),
    less = require("less"),
    cwd = process.cwd(),
    watchPath = process.argv.length === 3 ? path.resolve(cwd, process.argv[2]) : cwd;
    var options = {
        compress: false,
        yuicompress: false,
        optimization: 1,
        silent: false,
        paths: [],
        color: true,
        strictImports: false
    };
    var parseLessFile = function (input, output) {
        return function (e, data) {
            if (e) {
                console.log("lessc:", e.message);
            }
            new(less.Parser)({
                paths: [path.dirname(input)],
                optimization: options.optimization,
                filename: input
            }).parse(data, function (err, tree) {
                if (err) {
                    less.writeError(err, options);
                } else {
                    try {
                        var css = tree.toCSS({
                            compress: options.compress
                        });
                        if (output) {
                            var fd = fs.openSync(output, "w");
                            fs.writeSync(fd, css, 0, "utf8");
                        } else {
                            console.log("WARNING: output is undefined");
                            util.print(css);
                        }
                    } catch(e) {
                        less.writeError(e, options);
                    }
                }
            });
        };
    };
    console.log(">>> Script is polling for changes. Press Ctrl-C to Stop.");
    watchr.watch({
        path: watchPath,
        listener: function (eventName, filePath, fileCurrentStat, filePreviousStat) {
            if (eventName == "change" || eventName == "update") {
                console.log(">>> Change detected at", new Date().toLocaleTimeString(), "to:", path.basename(filePath));
                var baseFilePath = path.basename(filePath, ".less");
                fs.readFile(filePath, "utf-8", parseLessFile(filePath, "../css/" + baseFilePath + ".css"));
                console.log("overwrite", baseFilePath + ".css");
            }
        },
        next: function (err, watcher) {
            if (err) {
                console.log("!!! epic fail");
                throw err;
            }
            console.log("Now watching:", watchPath);
        }
    });
})();