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
 Ext.define("DE.controller.tablet.panel.Font", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            fontPanel: "fontpanel",
            navigateView: "#id-font-navigate",
            fontSizeSpinner: "fontpanel planarspinnerfield",
            fontView: "#id-font-root",
            fontNameView: "#id-font-name",
            fontNameButton: "#id-btn-fontname",
            fontButton: "#id-tb-btn-font",
            fontBaseToggle: "#id-toggle-baseline",
            fontBaseUp: "#id-btn-baseline-up",
            fontBaseDown: "#id-btn-baseline-down"
        },
        control: {
            fontPanel: {
                show: "onFontPanelShow",
                hide: "onFontPanelHide"
            },
            navigateView: {
                push: "onNavigateViewPush",
                pop: "onNavigateViewPop",
                back: "onNavigateViewBack"
            },
            fontNameButton: {
                tap: "onFontNameButtonTap"
            },
            fontSizeSpinner: {
                blur: "onFontSizeSpinnerBlur",
                focus: "onFontSizeSpinnerFocus",
                keyup: "onFontSizeSpinnerKeyUp",
                spin: "onFontSizeSpinnerSpin"
            },
            fontNameView: {
                select: "onFontNameSelect",
                itemtap: "onFontNameItemTap"
            },
            fontBaseUp: {
                tap: "onFontBaseUpTap"
            },
            fontBaseDown: {
                tap: "onFontBaseDownTap"
            }
        },
        handleApiEvent: false
    },
    init: function () {},
    launch: function () {},
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onFontFamily", Ext.bind(this.onApiFontChange, this));
            this.api.asc_registerCallback("asc_onInitEditorFonts", Ext.bind(this.onApiLoadFonts, this));
            this.api.asc_registerCallback("asc_onFontSize", Ext.bind(this.onApiFontSize, this));
            this.api.asc_registerCallback("asc_onVerticalAlign", Ext.bind(this.onApiVerticalAlign, this));
            this.api.asc_registerCallback("asc_onDocumentContentReady", Ext.bind(this.onDocumentContentReady, this));
        }
    },
    onFontPanelShow: function (cmp) {
        this.setHandleApiEvent(true);
        this.api && this.api.UpdateInterfaceState();
    },
    onFontPanelHide: function (cmp) {
        this.setHandleApiEvent(false);
        var navigateView = this.getNavigateView(),
        fontSizeSpinner = this.getFontSizeSpinner();
        if (fontSizeSpinner) {
            Ext.defer(function () {
                fontSizeSpinner.blur();
            },
            200);
        }
        if (navigateView) {
            navigateView.reset();
            navigateView.addCls("plain");
            navigateView.getNavigationBar().hide();
            var activeItem = navigateView.getActiveItem(),
            panelSize = this.getSizeById(activeItem && activeItem.id);
            cmp.setSize(panelSize.width, panelSize.height);
        }
    },
    onFontNameButtonTap: function () {
        var navigateView = this.getNavigateView(),
        fontNameView = this.getFontNameView();
        if (navigateView) {
            var navigationBar = navigateView.getNavigationBar();
            if (navigationBar) {
                navigationBar.show();
            }
            navigateView.push(fontNameView);
        }
    },
    onFontSizeSpinnerFocus: function () {
        this.api && this.api.asc_enableKeyEvents(false);
    },
    onFontSizeSpinnerBlur: function (field) {
        this.api && this.api.asc_enableKeyEvents(true);
        this.getFontSizeSpinner().setValue(field.getValue());
        if (this.api) {
            this.api.put_TextPrFontSize(field.getValue());
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        }
    },
    onFontSizeSpinnerKeyUp: function (field, event) {
        if (event.browserEvent.keyCode == 13 || event.browserEvent.keyCode == 10) {
            event.stopEvent();
            field.element.dom.blur();
            if (this.api) {
                this.api.put_TextPrFontSize(field.getValue());
                Common.component.Analytics.trackEvent("ToolBar", "Font Size");
            }
        }
    },
    onFontSizeSpinnerSpin: function (spin, value) {
        if (this.api) {
            this.api.put_TextPrFontSize(value);
            Common.component.Analytics.trackEvent("ToolBar", "Font Size");
        }
    },
    getSizeById: function (id) {
        switch (id) {
        case "id-font-name":
            return {
                width: 350,
                height: 300
            };
        default:
            case "id-font-root":
            return {
                width: 440,
                height: 46
            };
        }
    },
    toggleSegmentedButton: function (btn) {
        var toggler = this.getFontBaseToggle();
        if (toggler) {
            var pressedButtonsNew = [];
            if (btn) {
                pressedButtonsNew.push(btn);
            }
            toggler.setPressedButtons(pressedButtonsNew);
        }
    },
    onNavigateViewPush: function (cmp, view) {
        var parentCmp = cmp.getParent(),
        panelSize = this.getSizeById(view && view.id);
        if (parentCmp) {
            parentCmp.setSize(panelSize.width, panelSize.height);
            var navigationView = this.getNavigateView();
            if (navigationView) {
                navigationView.removeCls("plain");
                navigationView.getNavigationBar().show();
            }
            var fontButton = this.getFontButton();
            if (fontButton) {
                parentCmp.alignTo(fontButton);
            }
        }
    },
    onNavigateViewPop: function (cmp, view) {},
    onNavigateViewBack: function (cmp) {
        var parentCmp = cmp.getParent(),
        activeItem = cmp.getActiveItem(),
        panelSize = this.getSizeById(activeItem && activeItem.id);
        if (activeItem && activeItem.id == "id-font-root") {
            var navigationView = this.getNavigateView();
            if (navigationView) {
                navigationView.addCls("plain");
                navigationView.getNavigationBar().hide();
            }
        }
        if (parentCmp) {
            parentCmp.setSize(panelSize.width, panelSize.height);
            var fontButton = this.getFontButton();
            if (fontButton) {
                parentCmp.alignTo(fontButton);
            }
        }
    },
    onFontNameSelect: function (cmp, rec) {
        var fontNameButton = this.getFontNameButton();
        if (fontNameButton) {
            fontNameButton.setText(rec.get("setting"));
        }
    },
    onFontNameItemTap: function (cmp, index, item, rec) {
        if (this.api) {
            this.api.put_TextPrFontName(rec.get("setting"));
            Common.component.Analytics.trackEvent("ToolBar", "Font Name");
        }
    },
    onFontBaseUpTap: function (btn) {
        if (this.api) {
            var toggler = this.getFontBaseToggle();
            if (toggler) {
                this.api.put_TextPrBaseline(toggler.isPressed(btn) ? 1 : 0);
                Common.component.Analytics.trackEvent("ToolBar", "Superscript");
            }
        }
    },
    onFontBaseDownTap: function (btn) {
        if (this.api) {
            var toggler = this.getFontBaseToggle();
            if (toggler) {
                this.api.put_TextPrBaseline(toggler.isPressed(btn) ? 2 : 0);
                Common.component.Analytics.trackEvent("ToolBar", "Subscript");
            }
        }
    },
    onDocumentContentReady: function () {
        if (this.api) {
            var fl = this.api.get_PropertyEditorFonts();
            if (fl) {
                this.onApiLoadFonts(fl);
            }
        }
    },
    onApiFontChange: function (font) {
        if (this.getHandleApiEvent()) {
            var fontNameView = this.getFontNameView();
            if (fontNameView) {
                var fontName = font.get_Name(),
                fontRec = fontNameView.getStore().findRecord("setting", fontName);
                if (fontRec) {
                    fontNameView.select(fontRec);
                }
            }
        }
    },
    onApiLoadFonts: function (fl) {
        var fontNameView = this.getFontNameView();
        if (fontNameView) {
            var rawFontsArray = [];
            Ext.each(fl, function (font) {
                rawFontsArray.push({
                    setting: font.asc_getFontName(),
                    group: "font"
                });
            });
            fontNameView.getStore().setData(rawFontsArray);
        }
    },
    onApiFontSize: function (size) {
        if (this.getHandleApiEvent()) {
            var fontSizeSpinner = this.getFontSizeSpinner();
            if (fontSizeSpinner) {
                fontSizeSpinner.setValue(size);
            }
        }
    },
    onApiVerticalAlign: function (type) {
        if (this.getHandleApiEvent()) {
            switch (type) {
            case 1:
                this.toggleSegmentedButton(this.getFontBaseUp());
                break;
            case 2:
                this.toggleSegmentedButton(this.getFontBaseDown());
                break;
            default:
                this.toggleSegmentedButton();
            }
        }
    }
});