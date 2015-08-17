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
 var ApplicationController = new(function () {
    var me, api, config = {},
    docConfig = {},
    embedConfig = {},
    permissions = {},
    maxPages = 0,
    minToolbarWidth = 550,
    minEmbedWidth = 400,
    minEmbedHeight = 600,
    embedCode = '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="{embed-url}" width="{width}" height="{height}"></iframe>',
    maxZIndex = 9090,
    created = false;
    Common.Analytics.initialize("UA-12442749-13", "Embedded ONLYOFFICE Spreadsheet");
    if (typeof isBrowserSupported !== "undefined" && !isBrowserSupported()) {
        Common.Gateway.reportError(undefined, "Your browser is not supported.");
        return;
    }
    ZeroClipboard.setMoviePath("../../../vendor/ZeroClipboard/ZeroClipboard10.swf");
    var clipShortUrl = new ZeroClipboard.Client();
    var clipEmbedObj = new ZeroClipboard.Client();
    clipShortUrl.zIndex = maxZIndex;
    clipEmbedObj.zIndex = maxZIndex;
    function emptyFn() {}
    function createBuffered(fn, buffer, scope, args) {
        return function () {
            var timerId;
            return function () {
                var me = this;
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                timerId = setTimeout(function () {
                    fn.apply(scope || me, args || arguments);
                },
                buffer);
            };
        } ();
    }
    function updateSocial() {
        var $socialPanel = $("#id-popover-social-container");
        if ($socialPanel.length > 0) {
            if ($socialPanel.attr("data-loaded") == "false") {
                typeof FB !== "undefined" && FB.XFBML && FB.XFBML.parse();
                typeof twttr !== "undefined" && twttr.widgets && twttr.widgets.load();
                $socialPanel.attr("data-loaded", "true");
            }
        }
    }
    function loadConfig(data) {
        config = $.extend(config, data.config);
        embedConfig = $.extend(embedConfig, data.config.embedded);
        $("#id-short-url").val(embedConfig.shareUrl || "Unavailable");
        $("#id-textarea-embed").text(embedCode.replace("{embed-url}", embedConfig.embedUrl).replace("{width}", minEmbedWidth).replace("{height}", minEmbedHeight));
        if (typeof embedConfig.shareUrl !== "undefined" && embedConfig.shareUrl != "") {
            if ($("#id-popover-social-container ul")) {
                $("#id-popover-social-container ul").append('<li><div class="fb-like" data-href="' + embedConfig.shareUrl + '" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div></li>');
                $("#id-popover-social-container ul").append('<li class="share-twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="' + embedConfig.shareUrl + '">Tweet</a></li>');
                $("#id-popover-social-container ul").append('<li class="share-mail"><a class="btn btn-xs btn-default" href="mailto:?subject=I have shared a document with you: ' + embedConfig.docTitle + "&body=I have shared a document with you: " + encodeURIComponent(embedConfig.shareUrl) + '"><span class="glyphicon glyphicon-envelope">Email</a></li>');
            }
        }
        if (typeof embedConfig.shareUrl === "undefined") {
            $("#id-btn-share").hide();
        }
        if (typeof embedConfig.embedUrl === "undefined") {
            $("#id-btn-embed").hide();
        }
        if (typeof embedConfig.fullscreenUrl === "undefined") {
            $("#id-btn-fullscreen").hide();
        }
        if (typeof config.canBackToFolder === "undefined" || !config.canBackToFolder) {
            $("#id-btn-close").hide();
        }
        if (embedConfig.toolbarDocked === "top") {
            $("#toolbar").addClass("top");
            $(".viewer").addClass("top");
        } else {
            $("#toolbar").addClass("bottom");
            $(".viewer").addClass("bottom");
        }
    }
    function loadDocument(data) {
        docConfig = data.doc;
        if (docConfig) {
            permissions = $.extend(permissions, docConfig.permissions);
            var docInfo = {};
            docInfo.Id = docConfig.key;
            docInfo.Url = docConfig.url;
            docInfo.Title = docConfig.title;
            docInfo.Format = docConfig.fileType;
            docInfo.VKey = docConfig.vkey;
            docInfo.Origin = docConfig.origin;
            if (api) {
                api.asc_registerCallback("asc_onGetEditorPermissions", onEditorPermissions);
                api.asc_getEditorPermissions();
                api.asc_enableKeyEvents(true);
                api.asc_setViewerMode(true);
                api.asc_LoadDocument(docInfo);
                Common.Analytics.trackEvent("Load", "Start");
            }
            if (docConfig.title && !embedConfig.docTitle) {
                var el = $("#id-popover-social-container ul .share-mail > a");
                if (el.length) {
                    el.attr("href", el.attr("href").replace(/:\sundefined&/, ": " + docConfig.title + "&"));
                }
            }
        }
    }
    function onSheetsChanged() {
        if (api) {
            maxPages = api.asc_getWorksheetsCount();
            var setActiveWorkSheet = function (index) {
                $.each($("#worksheets").children("li"), function () {
                    $(this).removeClass("active");
                });
                $("#worksheet-" + index).addClass("active");
                api.asc_showWorksheet(index);
            };
            var handleWorksheet = function (e) {
                var $worksheet = $(this);
                var index = $worksheet.attr("id").match(/\d+/);
                if (index.length > 0) {
                    index = parseInt(index[0]);
                    if (index > -1 && index < maxPages) {
                        setActiveWorkSheet(index);
                    }
                }
            };
            $.each($("#worksheets").children("li"), function () {
                $(this).unbind("click");
                $(this).remove();
            });
            for (var i = 0; i < maxPages; i++) {
                $("#worksheets").append('<li id="worksheet-' + i + '">' + api.asc_getWorksheetName(i).replace(/\s/g, "&nbsp;") + "</li>");
                var $worksheet = $("#worksheet-" + i);
                $worksheet && $worksheet.bind("click", handleWorksheet);
            }
            setActiveWorkSheet(api.asc_getActiveWorksheetIndex());
        }
    }
    function onHyperlinkClick(url) {
        if (url) {
            var newDocumentPage = window.open(url, "_blank");
            if (newDocumentPage) {
                newDocumentPage.focus();
            }
        }
    }
    function hidePreloader() {
        $("#loading-mask").fadeOut("slow");
    }
    function onDocumentContentReady() {
        setVisiblePopover($("#id-popover-share"), false);
        setVisiblePopover($("#id-popover-embed"), false);
        handlerToolbarSize();
        hidePreloader();
        Common.Analytics.trackEvent("Load", "Complete");
    }
    function onEditorPermissions(params) {
        if (params.asc_getCanBranding() && (typeof config.customization == "object") && config.customization && config.customization.logo) {
            var logo = $("#header-logo");
            if (config.customization.logo.imageEmbedded) {
                logo.css({
                    "background-image": 'url("' + config.customization.logo.imageEmbedded + '")',
                    "background-position": "0 center",
                    "background-repeat": "no-repeat"
                });
            }
            if (config.customization.logo.url) {
                logo.attr("href", config.customization.logo.url);
            }
        }
    }
    function showMask() {
        $("#id-loadmask").modal({
            backdrop: "static",
            keyboard: false
        });
    }
    function hideMask() {
        $("#id-loadmask").modal("hide");
    }
    function onOpenDocument(progress) {
        var proc = (progress.CurrentFont + progress.CurrentImage) / (progress.FontsCount + progress.ImagesCount);
        $("#loadmask-text").html("LOADING DOCUMENT: " + Math.round(proc * 100) + "%");
    }
    function onLongActionBegin(type, id) {
        var text = "";
        switch (id) {
        case c_oAscAsyncAction["Print"]:
            text = "Downloading document...";
            break;
        default:
            text = "Please wait...";
            break;
        }
        if (type == c_oAscAsyncActionType["BlockInteraction"]) {
            $("#id-loadmask .cmd-loader-title").html(text);
            showMask();
        }
    }
    function onLongActionEnd(type, id) {
        if (type === c_oAscAsyncActionType.BlockInteraction) {
            switch (id) {
            case c_oAscAsyncAction.Open:
                if (api) {
                    api.asc_Resize();
                }
                onDocumentContentReady();
                onSheetsChanged();
                break;
            }
            hideMask();
        }
    }
    function onError(id, level, errData) {
        hidePreloader();
        var message;
        switch (id) {
        case c_oAscError.ID.Unknown:
            message = me.unknownErrorText;
            break;
        case c_oAscError.ID.ConvertationTimeout:
            message = me.convertationTimeoutText;
            break;
        case c_oAscError.ID.ConvertationError:
            message = me.convertationErrorText;
            break;
        case c_oAscError.ID.DownloadError:
            message = me.downloadErrorText;
            break;
        default:
            message = me.errorDefaultMessage.replace("%1", id);
            break;
        }
        if (level == c_oAscError.Level.Critical) {
            Common.Gateway.reportError(id, message);
            $("#id-critical-error-title").text(me.criticalErrorTitle);
            $("#id-critical-error-message").text(message);
            $("#id-critical-error-close").off();
            $("#id-critical-error-close").on("click", function () {
                window.location.reload();
            });
        } else {
            $("#id-critical-error-title").text(me.notcriticalErrorTitle);
            $("#id-critical-error-message").text(message);
            $("#id-critical-error-close").off();
            $("#id-critical-error-close").on("click", function () {
                $("#id-critical-error-dialog").modal("hide");
            });
        }
        $("#id-critical-error-dialog").modal("show");
        Common.Analytics.trackEvent("Internal Error", id.toString());
    }
    function onExternalError(error) {
        if (error) {
            hidePreloader();
            $("#id-error-mask-title").text(error.title);
            $("#id-error-mask-text").text(error.msg);
            $("#id-error-mask").css("display", "block");
            Common.Analytics.trackEvent("External Error", error.title);
        }
    }
    var handlerToolbarSize = createBuffered(function (size) {
        var visibleCaption = function (btn, visible) {
            if (visible) {
                $(btn + " button").addClass("no-caption");
                $(btn + " button span").css("display", "none");
            } else {
                $(btn + " button").removeClass("no-caption");
                $(btn + " button span").css("display", "inline");
            }
        };
        var isMinimize = $("#toolbar").width() < minToolbarWidth;
        visibleCaption("#id-btn-copy", isMinimize);
        visibleCaption("#id-btn-share", isMinimize);
        visibleCaption("#id-btn-embed", isMinimize);
    },
    10);
    function onDocumentResize() {
        if (api) {
            api.asc_Resize();
        }
        handlerToolbarSize();
    }
    function isVisiblePopover(popover) {
        return popover.hasClass("in");
    }
    function setVisiblePopover(popover, visible, owner) {
        api && api.asc_enableKeyEvents(!visible);
        if (visible) {
            if (owner) {
                popover.css("display", "block");
                var popoverData = owner.data("bs.popover"),
                $tip = popoverData.tip(),
                pos = popoverData.getPosition(false),
                actualHeight = $tip[0].offsetHeight,
                placement = (embedConfig.toolbarDocked === "top") ? "bottom" : "top",
                tp;
                $tip.removeClass("fade in top bottom left right");
                switch (placement) {
                case "bottom":
                    tp = {
                        top: pos.top + pos.height,
                        left: owner.position().left + (owner.width() - popover.width()) * 0.5
                    };
                    break;
                default:
                    case "top":
                    tp = {
                        top: pos.top - actualHeight,
                        left: owner.position().left + (owner.width() - popover.width()) * 0.5
                    };
                    break;
                }
                $tip.css(tp).addClass(placement).addClass("in");
            }
            if (popover.hasClass("embed")) {
                clipEmbedObj.show();
            }
            if (popover.hasClass("share")) {
                clipShortUrl.show();
                updateSocial();
            }
        } else {
            popover.removeClass("in");
            popover.css("display", "none");
            popover.hasClass("embed") && clipEmbedObj.hide();
            popover.hasClass("share") && clipShortUrl.hide();
        }
    }
    function updateEmbedCode() {
        var newWidth = parseInt($("#id-input-embed-width").val()),
        newHeight = parseInt($("#id-input-embed-height").val());
        if (newWidth < minEmbedWidth) {
            newWidth = minEmbedWidth;
        }
        if (newHeight < minEmbedHeight) {
            newHeight = minEmbedHeight;
        }
        $("#id-textarea-embed").text(embedCode.replace("{embed-url}", embedConfig.embedUrl).replace("{width}", newWidth).replace("{height}", newHeight));
        $("#id-input-embed-width").val(newWidth + "px");
        $("#id-input-embed-height").val(newHeight + "px");
    }
    function openLink(url) {
        var newDocumentPage = window.open(url);
        if (newDocumentPage) {
            newDocumentPage.focus();
        }
    }
    function createController() {
        if (created) {
            return me;
        }
        me = this;
        created = true;
        var documentMoveTimer;
        clipShortUrl.addEventListener("mousedown", function () {
            if ($("#id-btn-copy-short").hasClass("copied")) {
                return;
            }
            $("#id-btn-copy-short").button("copied");
            $("#id-btn-copy-short").addClass("copied");
            clipShortUrl.setText($("#id-short-url").val());
            setTimeout(function () {
                $("#id-btn-copy-short").button("reset");
                $("#id-btn-copy-short").removeClass("copied");
            },
            2000);
        });
        clipEmbedObj.addEventListener("mousedown", function () {
            if ($("#id-btn-copy-embed").hasClass("copied")) {
                return;
            }
            $("#id-btn-copy-embed").button("copied");
            $("#id-btn-copy-embed").addClass("copied");
            clipEmbedObj.setText($("#id-textarea-embed").text());
            setTimeout(function () {
                $("#id-btn-copy-embed").button("reset");
                $("#id-btn-copy-embed").removeClass("copied");
            },
            2000);
        });
        clipShortUrl.glue("id-btn-copy-short");
        clipEmbedObj.glue("id-btn-copy-embed");
        $("#id-btn-copy").on("click", function () {
            var saveUrl = embedConfig.saveUrl;
            if (typeof saveUrl !== "undefined" && saveUrl.length > 0) {
                openLink(saveUrl);
            } else {
                if (api) {
                    api.asc_Print();
                }
            }
            Common.Analytics.trackEvent("Save");
        });
        $("#id-btn-share").on("click", function (event) {
            setVisiblePopover($("#id-popover-share"), !isVisiblePopover($("#id-popover-share")), $("#id-btn-share"));
            setVisiblePopover($("#id-popover-embed"), false);
            event.preventDefault();
            event.stopPropagation();
        });
        $("#id-btn-embed").on("click", function (event) {
            setVisiblePopover($("#id-popover-embed"), !isVisiblePopover($("#id-popover-embed")), $("#id-btn-embed"));
            setVisiblePopover($("#id-popover-share"), false);
            event.preventDefault();
            event.stopPropagation();
        });
        $("#id-input-embed-width").on("keypress", function (e) {
            if (e.keyCode == 13) {
                updateEmbedCode();
            }
        });
        $("#id-input-embed-height").on("keypress", function (e) {
            if (e.keyCode == 13) {
                updateEmbedCode();
            }
        });
        $("#id-input-embed-width").on("focusin", function (e) {
            api && api.asc_enableKeyEvents(false);
        });
        $("#id-input-embed-height").on("focusin", function (e) {
            api && api.asc_enableKeyEvents(false);
        });
        $("#id-input-embed-width").on("focusout", function (e) {
            updateEmbedCode();
            api && api.asc_enableKeyEvents(true);
        });
        $("#id-input-embed-height").on("focusout", function (e) {
            updateEmbedCode();
            api && api.asc_enableKeyEvents(true);
        });
        $("#id-btn-fullscreen").on("click", function () {
            openLink(embedConfig.fullscreenUrl);
        });
        $("#id-btn-close").on("click", function () {
            Common.Gateway.goBack();
        });
        $("#id-btn-zoom-in").on("click", function () {
            if (api) {
                var f = api.asc_getZoom() + 0.1;
                f > 0 && !(f > 2) && api.asc_setZoom(f);
            }
        });
        $("#id-btn-zoom-out").on("click", function () {
            if (api) {
                var f = api.asc_getZoom() - 0.1; ! (f < 0.5) && api.asc_setZoom(f);
            }
        });
        $(window).resize(function () {
            onDocumentResize();
        });
        $(document).click(function (event) {
            if (event && event.target && $(event.target).closest(".popover").length > 0) {
                return;
            }
            setVisiblePopover($("#id-popover-share"), false);
            setVisiblePopover($("#id-popover-embed"), false);
        });
        $(document).mousemove(function (event) {
            $("#id-btn-zoom-in").fadeIn();
            $("#id-btn-zoom-out").fadeIn();
            clearTimeout(documentMoveTimer);
            documentMoveTimer = setTimeout(function () {
                $("#id-btn-zoom-in").fadeOut();
                $("#id-btn-zoom-out").fadeOut();
            },
            2000);
        });
        api = new Asc.spreadsheet_api("editor_sdk");
        if (api) {
            api.asc_Init("../../../sdk/Fonts/");
            api.asc_registerCallback("asc_onStartAction", onLongActionBegin);
            api.asc_registerCallback("asc_onEndAction", onLongActionEnd);
            api.asc_registerCallback("asc_onError", onError);
            api.asc_registerCallback("asc_onOpenDocumentProgress", onOpenDocument);
            api.asc_registerCallback("asc_onSheetsChanged", onSheetsChanged);
            api.asc_registerCallback("asc_onHyperlinkClick", onHyperlinkClick);
            Common.Gateway.on("init", loadConfig);
            Common.Gateway.on("opendocument", loadDocument);
            Common.Gateway.on("showerror", onExternalError);
            Common.Gateway.ready();
        }
        return me;
    }
    return {
        create: createController,
        errorDefaultMessage: "Error code: %1",
        unknownErrorText: "Unknown error.",
        convertationTimeoutText: "Convertation timeout exceeded.",
        convertationErrorText: "Convertation failed.",
        downloadErrorText: "Download failed.",
        criticalErrorTitle: "Error",
        notcriticalErrorTitle: "Warning"
    };
})();