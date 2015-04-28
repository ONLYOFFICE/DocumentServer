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
 module.exports = function (grunt) {
    var _ = require("lodash"),
    defaultConfig,
    packageFile,
    revisionHash = "@@REVISION",
    revisionTimeStamp = "@@REVISIONDATE";
    grunt.loadNpmTasks("grunt-contrib");
    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-mocha");
    function doRegisterTask(name, callbackConfig) {
        return grunt.registerTask(name + "-init", function () {
            var additionalConfig = {},
            initConfig = {};
            if (_.isFunction(callbackConfig)) {
                additionalConfig = callbackConfig.call(this, defaultConfig, packageFile);
            }
            if (!_.isUndefined(packageFile[name]["clean"])) {
                initConfig["clean"] = {
                    options: {
                        force: true
                    },
                    files: packageFile[name]["clean"]
                };
            }
            if (!_.isUndefined(packageFile[name]["copy"])) {
                initConfig["copy"] = packageFile[name]["copy"];
            }
            grunt.initConfig(_.assign(initConfig, additionalConfig || {}));
        });
    }
    function doRegisterInitializeAppTask(name, appName, configFile) {
        return grunt.registerTask("init-build-" + name, "Initialize build " + appName, function () {
            defaultConfig = configFile;
            packageFile = require("./" + defaultConfig);
            if (packageFile) {
                grunt.log.ok(appName + " config loaded successfully".green);
            } else {
                grunt.log.error().writeln("Could not load config file".red);
            }
        });
    }
    grunt.registerTask("init-config", "Initialize build script", function () {
        var exec = require("child_process").exec,
        done = this.async(),
        commandsRef = 0;
        function doneTask() {
            if (--commandsRef <= 0) {
                done(true);
            }
        }
        function doCommand(command, callback) {
            commandsRef++;
            exec(command, callback);
        }
        doCommand('hg log -r -1 --template "{node|short}"', function (error, stdout, stderr) {
            if (error) {
                grunt.log.writeln("Error: " + error);
            } else {
                revisionHash = stdout;
            }
            doneTask();
        });
        doCommand('hg log -r -1 --template "{date|isodate}"', function (error, stdout, stderr) {
            if (error) {
                grunt.log.writeln("Error: " + error);
            } else {
                revisionTimeStamp = stdout;
            }
            doneTask();
        });
    });
    grunt.initConfig({
        mocha: {
            test: {
                options: {
                    reporter: "Spec"
                },
                src: ["../test/common/index.html"]
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                force: true
            },
            common: ["../apps/common/main/lib/**/*.js"]
        }
    });
    doRegisterTask("sdk");
    doRegisterTask("api");
    doRegisterTask("sockjs");
    doRegisterTask("xregexp");
    doRegisterTask("megapixel");
    doRegisterTask("touch");
    doRegisterTask("jquery");
    doRegisterTask("underscore");
    doRegisterTask("zeroclipboard");
    doRegisterTask("bootstrap");
    doRegisterTask("requirejs", function (defaultConfig, packageFile) {
        return {
            uglify: {
                pkg: grunt.file.readJSON(defaultConfig),
                options: {
                    banner: "/** vim: et:ts=4:sw=4:sts=4\n" + " * @license RequireJS 2.1.2 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.\n" + " * Available via the MIT or new BSD license.\n" + " * see: http://github.com/jrburke/requirejs for details\n" + " */\n"
                },
                build: {
                    src: packageFile["requirejs"]["min"]["src"],
                    dest: packageFile["requirejs"]["min"]["dest"]
                }
            }
        };
    });
    grunt.registerTask("main-app-init", function () {
        grunt.initConfig({
            pkg: grunt.file.readJSON(defaultConfig),
            clean: {
                options: {
                    force: true
                },
                files: packageFile["main"]["clean"]
            },
            less: {
                options: {
                    cleancss: true
                },
                production: {
                    files: {
                        "<%= pkg.main.less.files.dest %>": packageFile["main"]["less"]["files"]["src"]
                    }
                }
            },
            requirejs: {
                compile: {
                    options: packageFile["main"]["js"]["requirejs"]["options"]
                }
            },
            replace: {
                fixLessUrl: {
                    src: ["<%= pkg.main.less.files.dest %>"],
                    overwrite: true,
                    replacements: packageFile["main"]["less"]["replacements"]
                }
            },
            concat: {
                options: {
                    stripBanners: true,
                    banner: "/*\n" + ' * Copyright (c) Ascensio System SIA <%= grunt.template.today("yyyy") %>. All rights reserved\n' + " *\n" + " * <%= pkg.homepage %> \n" + " *\n" + " * Version: <%= pkg.version %> (build:<%= pkg.build %>, rev:" + revisionHash + ", date:" + revisionTimeStamp + ")\n" + " */\n"
                },
                dist: {
                    src: [packageFile["main"]["js"]["requirejs"]["options"]["out"]],
                    dest: packageFile["main"]["js"]["requirejs"]["options"]["out"]
                }
            },
            imagemin: {
                options: {
                    optimizationLevel: 3
                },
                dynamic: {
                    files: [].concat(packageFile["main"]["imagemin"]["images-app"]).concat(packageFile["main"]["imagemin"]["images-common"])
                }
            },
            copy: {
                localization: {
                    files: packageFile["main"]["copy"]["localization"]
                },
                help: {
                    files: packageFile["main"]["copy"]["help"]
                },
                "index-page": {
                    files: packageFile["main"]["copy"]["index-page"]
                }
            }
        });
    });
    grunt.registerTask("mobile-app-init", function () {
        grunt.initConfig({
            pkg: grunt.file.readJSON(defaultConfig),
            clean: {
                options: {
                    force: true
                },
                files: packageFile["mobile"]["clean"]
            },
            uglify: {
                options: {
                    banner: "/*\n" + ' * Copyright (c) Ascensio System SIA <%= grunt.template.today("yyyy") %>. All rights reserved\n' + " *\n" + " * <%= pkg.homepage %>\n" + " *\n" + " * Version: <%= pkg.version %> (build:<%= pkg.build %>)\n" + " */\n"
                },
                build: {
                    src: packageFile["mobile"]["js"]["src"],
                    dest: packageFile["mobile"]["js"]["dist"]
                }
            },
            cssmin: {
                styles: {
                    files: {
                        "<%= pkg.mobile.css.normal.dist %>": packageFile["mobile"]["css"]["normal"]["src"],
                        "<%= pkg.mobile.css.retina.dist %>": packageFile["mobile"]["css"]["retina"]["src"]
                    }
                }
            },
            copy: {
                localization: {
                    files: packageFile["mobile"]["copy"]["localization"]
                },
                "index-page": {
                    files: packageFile["mobile"]["copy"]["index-page"]
                },
                "images-app": {
                    files: packageFile["mobile"]["copy"]["images-app"]
                }
            }
        });
    });
    grunt.registerTask("embed-app-init", function () {
        grunt.initConfig({
            pkg: grunt.file.readJSON(defaultConfig),
            clean: {
                options: {
                    force: true
                },
                files: packageFile["embed"]["clean"]
            },
            uglify: {
                options: {
                    banner: "/*\n" + ' * Copyright (c) Ascensio System SIA <%= grunt.template.today("yyyy") %>. All rights reserved\n' + " *\n" + " * <%= pkg.homepage %>\n" + " *\n" + " * Version: <%= pkg.version %> (build:<%= pkg.build %>)\n" + " */\n"
                },
                build: {
                    src: packageFile["embed"]["js"]["src"],
                    dest: packageFile["embed"]["js"]["dist"]
                }
            },
            less: {
                production: {
                    options: {
                        cleancss: true
                    },
                    files: {
                        "<%= pkg.embed.less.dist %>": packageFile["embed"]["less"]["src"]
                    }
                }
            },
            copy: {
                "index-page": {
                    files: packageFile["embed"]["copy"]["index-page"]
                },
                "images-app": {
                    files: packageFile["embed"]["copy"]["images-app"]
                }
            }
        });
    });
    grunt.registerTask("increment-build", function () {
        var pkg = grunt.file.readJSON(defaultConfig);
        pkg.build = parseInt(pkg.build) + 1;
        grunt.file.write(defaultConfig, JSON.stringify(pkg, null, 4));
    });
    grunt.registerTask("deploy-api", ["api-init", "clean", "copy"]);
    grunt.registerTask("deploy-sdk", ["sdk-init", "clean", "copy"]);
    grunt.registerTask("deploy-sockjs", ["sockjs-init", "clean", "copy"]);
    grunt.registerTask("deploy-xregexp", ["xregexp-init", "clean", "copy"]);
    grunt.registerTask("deploy-megapixel", ["megapixel-init", "clean", "copy"]);
    grunt.registerTask("deploy-touch", ["touch-init", "clean", "copy"]);
    grunt.registerTask("deploy-jquery", ["jquery-init", "clean", "copy"]);
    grunt.registerTask("deploy-underscore", ["underscore-init", "clean", "copy"]);
    grunt.registerTask("deploy-zeroclipboard", ["zeroclipboard-init", "clean", "copy"]);
    grunt.registerTask("deploy-bootstrap", ["bootstrap-init", "clean", "copy"]);
    grunt.registerTask("deploy-requirejs", ["requirejs-init", "clean", "uglify"]);
    grunt.registerTask("deploy-app-main", ["main-app-init", "clean", "less", "replace:fixLessUrl", "requirejs", "concat", "imagemin", "copy"]);
    grunt.registerTask("deploy-app-mobile", ["mobile-app-init", "clean", "uglify", "cssmin:styles", "copy"]);
    grunt.registerTask("deploy-app-embed", ["embed-app-init", "clean", "uglify", "less", "copy"]);
    doRegisterInitializeAppTask("documenteditor", "DocumentEditor", "documenteditor.json");
    doRegisterInitializeAppTask("spreadsheeteditor", "SpreadsheetEditor", "spreadsheeteditor.json");
    doRegisterInitializeAppTask("presentationeditor", "PresentationEditor", "presentationeditor.json");
    grunt.registerTask("deploy-app", "Deploy application.", function () {
        if (packageFile) {
            if (packageFile["tasks"]["deploy"]) {
                grunt.task.run(packageFile["tasks"]["deploy"]);
            } else {
                grunt.log.error().writeln('Not found "deploy" task in configure'.red);
            }
        } else {
            grunt.log.error().writeln("Is not load configure file.".red);
        }
    });
    grunt.registerTask("deploy-documenteditor", ["init-build-documenteditor", "init-config", "deploy-app"]);
    grunt.registerTask("deploy-spreadsheeteditor", ["init-build-spreadsheeteditor", "init-config", "deploy-app"]);
    grunt.registerTask("deploy-presentationeditor", ["init-build-presentationeditor", "init-config", "deploy-app"]);
    grunt.registerTask("default", ["deploy-documenteditor", "deploy-spreadsheeteditor", "deploy-presentationeditor"]);
};