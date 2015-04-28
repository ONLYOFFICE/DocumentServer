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
 Ext.define("DE.controller.tablet.panel.FontStyle", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            fontStylePanel: "fontstylepanel",
            fontStylesToggle: "#id-toggle-fontstyles",
            fontStyleBold: "#id-btn-fontstyle-bold",
            fontStyleItalic: "#id-btn-fontstyle-italic",
            fontStyleUnderline: "#id-btn-fontstyle-underline"
        },
        control: {
            fontStylePanel: {
                show: "onFontStyleShow",
                hide: "onFontStyleHide"
            },
            fontStyleBold: {
                tap: "onBoldButtonTap"
            },
            fontStyleItalic: {
                tap: "onItalicButtonTap"
            },
            fontStyleUnderline: {
                tap: "onUnderlineButtonTap"
            }
        },
        handleApiEvent: false
    },
    init: function () {},
    launch: function () {},
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onBold", Ext.bind(this.onApiBold, this));
            this.api.asc_registerCallback("asc_onItalic", Ext.bind(this.onApiItalic, this));
            this.api.asc_registerCallback("asc_onUnderline", Ext.bind(this.onApiUnderline, this));
        }
    },
    onFontStyleShow: function (cmp) {
        this.setHandleApiEvent(true);
        this.api && this.api.UpdateInterfaceState();
    },
    onFontStyleHide: function (cmp) {
        this.setHandleApiEvent(false);
    },
    _toggleSegmentedButton: function (btn, toggle) {
        var toggler = this.getFontStylesToggle();
        if (toggler && btn) {
            var pressedButtonsOld = toggler.getPressedButtons().slice(),
            pressedButtonsNew = toggler.getPressedButtons(),
            pressedIndex = pressedButtonsNew.indexOf(btn);
            if (toggle) {
                if (pressedIndex < 0) {
                    pressedButtonsNew.push(btn);
                }
            } else {
                if (pressedIndex > -1) {
                    pressedButtonsNew.splice(pressedIndex, 1);
                }
            }
            toggler.updatePressedButtons(pressedButtonsNew, pressedButtonsOld);
        }
    },
    onApiBold: function (on) {
        if (this.getHandleApiEvent()) {
            this._toggleSegmentedButton(this.getFontStyleBold(), on);
        }
    },
    onApiItalic: function (on) {
        if (this.getHandleApiEvent()) {
            this._toggleSegmentedButton(this.getFontStyleItalic(), on);
        }
    },
    onApiUnderline: function (on) {
        if (this.getHandleApiEvent()) {
            this._toggleSegmentedButton(this.getFontStyleUnderline(), on);
        }
    },
    onBoldButtonTap: function (btn) {
        var toggler = this.getFontStylesToggle();
        if (toggler && this.api) {
            this.api.put_TextPrBold(toggler.isPressed(btn));
            Common.component.Analytics.trackEvent("ToolBar", "Bold");
        }
    },
    onItalicButtonTap: function (btn) {
        var toggler = this.getFontStylesToggle();
        if (toggler && this.api) {
            this.api.put_TextPrItalic(toggler.isPressed(btn));
            Common.component.Analytics.trackEvent("ToolBar", "Italic");
        }
    },
    onUnderlineButtonTap: function (btn) {
        var toggler = this.getFontStylesToggle();
        if (toggler && this.api) {
            this.api.put_TextPrUnderline(toggler.isPressed(btn));
            Common.component.Analytics.trackEvent("ToolBar", "Underline");
        }
    }
});