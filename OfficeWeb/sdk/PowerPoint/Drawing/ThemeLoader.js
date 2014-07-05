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
 function CThemeLoadInfo() {
    this.FontMap = null;
    this.ImageMap = null;
    this.Theme = null;
    this.Master = null;
    this.Layouts = new Array();
}
function CThemeLoader() {
    this.Themes = new CAscThemes();
    this.themes_info_editor = new Array();
    var count = this.Themes.EditorThemes.length;
    for (var i = 0; i < count; i++) {
        this.themes_info_editor[i] = null;
    }
    this.themes_info_document = new Array();
    this.Api = null;
    this.CurrentLoadThemeIndex = -1;
    this.ThemesUrl = "";
    this.IsReloadBinaryThemeEditor = true;
    this.IsReloadBinaryThemeEditorNow = false;
    var oThis = this;
    this.StartLoadTheme = function (indexTheme) {
        var theme_info = null;
        var theme_load_info = null;
        this.Api.StartLoadTheme();
        this.CurrentLoadThemeIndex = -1;
        if (indexTheme >= 0) {
            theme_info = this.Themes.EditorThemes[indexTheme];
            theme_load_info = this.themes_info_editor[indexTheme];
            this.CurrentLoadThemeIndex = indexTheme;
        } else {
            theme_info = this.Themes.DocumentThemes[-indexTheme - 1];
            theme_load_info = this.themes_info_document[-indexTheme - 1];
            this.Api.EndLoadTheme(theme_load_info);
            return;
        }
        if (null != theme_load_info) {
            if (indexTheme >= 0 && this.IsReloadBinaryThemeEditor) {
                this.IsReloadBinaryThemeEditorNow = true;
                this._callback_theme_load();
                return;
            }
            this.Api.EndLoadTheme(theme_load_info);
            return;
        }
        this.Api.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadTheme);
        var theme_src = this.ThemesUrl + "theme" + (this.CurrentLoadThemeIndex + 1) + "/theme.js";
        this.LoadThemeJSAsync(theme_src);
        this.Api.StartLoadTheme();
    };
    this.LoadThemeJSAsync = function (theme_src) {
        var scriptElem = document.createElement("script");
        if (scriptElem.readyState && false) {
            scriptElem.onreadystatechange = function () {
                if (this.readyState == "complete" || this.readyState == "loaded") {
                    scriptElem.onreadystatechange = null;
                    setTimeout(oThis._callback_theme_load, 0);
                }
            };
        }
        scriptElem.onload = scriptElem.onerror = oThis._callback_theme_load;
        scriptElem.setAttribute("src", theme_src);
        scriptElem.setAttribute("type", "text/javascript");
        document.getElementsByTagName("head")[0].appendChild(scriptElem);
    };
    this._callback_theme_load = function () {
        var g_th = window["g_theme" + (oThis.CurrentLoadThemeIndex + 1)];
        if (g_th !== undefined) {
            var _loader = new BinaryPPTYLoader();
            _loader.Api = oThis.Api;
            _loader.IsThemeLoader = true;
            var pres = new Object();
            pres.themes = new Array();
            pres.slideMasters = new Array();
            pres.slideLayouts = new Array();
            _loader.Load(g_th, pres);
            if (oThis.IsReloadBinaryThemeEditorNow) {
                oThis.asyncImagesEndLoaded();
                oThis.IsReloadBinaryThemeEditorNow = false;
                return;
            }
            oThis.Api.FontLoader.ThemeLoader = oThis;
            oThis.Api.FontLoader.LoadDocumentFonts2(oThis.themes_info_editor[oThis.CurrentLoadThemeIndex].FontMap);
            return;
        }
    };
    this.asyncFontsStartLoaded = function () {};
    this.asyncFontsEndLoaded = function () {
        this.Api.FontLoader.ThemeLoader = null;
        this.Api.ImageLoader.ThemeLoader = this;
        this.Api.ImageLoader.LoadDocumentImages(this.themes_info_editor[this.CurrentLoadThemeIndex].ImageMap);
    };
    this.asyncImagesStartLoaded = function () {};
    this.asyncImagesEndLoaded = function () {
        this.Api.ImageLoader.ThemeLoader = null;
        this.Api.EndLoadTheme(this.themes_info_editor[this.CurrentLoadThemeIndex]);
        this.CurrentLoadThemeIndex = -1;
    };
    this._getFullImageSrc = function (src) {
        var start = src.substring(0, 6);
        if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
            return this.ThemesUrl + "theme" + this.CurrentLoadThemeIndex + "/media/" + src;
        } else {
            return src;
        }
    };
}