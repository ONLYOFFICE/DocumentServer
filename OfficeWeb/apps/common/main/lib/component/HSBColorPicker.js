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
 Ext.define("Common.component.HSBColorPicker", {
    extend: "Ext.Component",
    alias: "widget.hsbcolorpicker",
    requires: ["Common.component.util.RGBColor", "Ext.XTemplate"],
    baseCls: "cmp-hsb-colorpicker",
    allowEmptyColor: false,
    changeSaturation: true,
    showCurrentColor: true,
    config: {
        color: "#ff0000"
    },
    renderTpl: ['<div class="{baseCls}-root">', '<tpl if="showCurrentColor">', '<div class="{baseCls}-top-panel">', '<span class="{baseCls}-color-value">', '<span class="transparent-color"></span>', "</span>", '<div class="{baseCls}-color-text"></div>', "</div>", "</tpl>", "<div>", '<div class="{baseCls}-cnt-hb">', '<div class="{baseCls}-cnt-hb-arrow"></div>', "</div>", '<tpl if="changeSaturation">', '<div class="{baseCls}-cnt-root">', '<div class="{baseCls}-cnt-sat">', '<div class="{baseCls}-cnt-sat-arrow"></div>', "</div>", "</div>", "</tpl>", "</div>", '<tpl if="allowEmptyColor">', '<div class="{baseCls}-empty-color">{textNoColor}</div>', "</tpl>", "</div>"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        arrowSatBrightness, arrowHue, areaSatBrightness, areaHue, previewColor, previewTransparentColor, previewColorText, btnNoColor, hueVal = 0,
        saturationVal = 100,
        brightnessVal = 100;
        var onUpdateColor = function (hsb, transparent) {
            var rgbColor = new Common.util.RGBColor(Ext.String.format("hsb({0}, {1}, {2})", hsb.h, hsb.s, hsb.b)),
            hexColor = rgbColor.toHex();
            me.color = transparent ? "transparent" : hexColor;
            refreshUI();
            me.fireEvent("changecolor", me, me.color);
        };
        var refreshUI = function () {
            if (previewColor && previewTransparentColor) {
                if (me.color == "transparent") {
                    previewTransparentColor.show();
                } else {
                    previewColor.setStyle("background-color", me.color);
                    previewTransparentColor.hide();
                }
            }
            if (areaSatBrightness) {
                areaSatBrightness.setStyle("background-color", new Common.util.RGBColor(Ext.String.format("hsb({0}, 100, 100)", hueVal)).toHex());
            }
            if (previewColorText) {
                previewColorText.dom.innerHTML = (me.color == "transparent") ? me.textNoColor : me.color.toUpperCase();
            }
            if (arrowSatBrightness && arrowHue) {
                arrowSatBrightness.setLeft(saturationVal + "%");
                arrowSatBrightness.setTop(100 - brightnessVal + "%");
                arrowHue.setTop(parseInt(hueVal * 100 / 360) + "%");
            }
        };
        var onSBAreaMouseMove = function (event, element, eOpts) {
            if (arrowSatBrightness && areaSatBrightness) {
                var pos = [Math.max(0, Math.min(100, (parseInt((event.getX() - areaSatBrightness.getX()) / areaSatBrightness.getWidth() * 100)))), Math.max(0, Math.min(100, (parseInt((event.getY() - areaSatBrightness.getY()) / areaSatBrightness.getHeight() * 100))))];
                arrowSatBrightness.setLeft(pos[0] + "%");
                arrowSatBrightness.setTop(pos[1] + "%");
                saturationVal = pos[0];
                brightnessVal = 100 - pos[1];
                onUpdateColor({
                    h: hueVal,
                    s: saturationVal,
                    b: brightnessVal
                });
            }
        };
        var onHueAreaMouseMove = function (event, element, eOpts) {
            if (arrowHue && areaHue) {
                var pos = Math.max(0, Math.min(100, (parseInt((event.getY() - areaHue.getY()) / areaHue.getHeight() * 100))));
                arrowHue.setTop(pos + "%");
                hueVal = parseInt(360 * pos / 100);
                onUpdateColor({
                    h: hueVal,
                    s: saturationVal,
                    b: brightnessVal
                });
            }
        };
        var onSBAreaMouseDown = function (event, element, eOpts) {
            Ext.getDoc().on("mouseup", onSBAreaMouseUp);
            Ext.getDoc().on("mousemove", onSBAreaMouseMove);
        };
        var onSBAreaMouseUp = function (event, element, eOpts) {
            Ext.getDoc().un("mouseup", onSBAreaMouseUp);
            Ext.getDoc().un("mousemove", onSBAreaMouseMove);
            onSBAreaMouseMove(event, element, eOpts);
        };
        var onHueAreaMouseDown = function (event, element, eOpts) {
            Ext.getDoc().on("mouseup", onHueAreaMouseUp);
            Ext.getDoc().on("mousemove", onHueAreaMouseMove);
            onHueAreaMouseMove(event, element, eOpts);
        };
        var onHueAreaMouseUp = function (event, element, eOpts) {
            Ext.getDoc().un("mouseup", onHueAreaMouseUp);
            Ext.getDoc().un("mousemove", onHueAreaMouseMove);
        };
        var onNoColorClick = function (cnt) {
            var hsbColor = new Common.util.RGBColor(me.color).toHSB();
            onUpdateColor(hsbColor, true);
        };
        var onAfterRender = function (ct) {
            var rootEl = me.getEl(),
            hsbColor;
            if (rootEl) {
                arrowSatBrightness = rootEl.down("." + me.baseCls + "-cnt-hb-arrow");
                arrowHue = rootEl.down("." + me.baseCls + "-cnt-sat-arrow");
                areaSatBrightness = rootEl.down("." + me.baseCls + "-cnt-hb");
                areaHue = rootEl.down("." + me.baseCls + "-cnt-sat");
                previewColor = rootEl.down("." + me.baseCls + "-color-value");
                previewColorText = rootEl.down("." + me.baseCls + "-color-text");
                btnNoColor = rootEl.down("." + me.baseCls + "-empty-color");
                if (previewColor) {
                    previewTransparentColor = previewColor.child(".transparent-color");
                }
                if (areaSatBrightness) {
                    areaSatBrightness.un("mousedown");
                    areaSatBrightness.on("mousedown", onSBAreaMouseDown, me);
                }
                if (areaHue) {
                    areaHue.un("mousedown");
                    areaHue.on("mousedown", onHueAreaMouseDown, me);
                }
                if (btnNoColor) {
                    btnNoColor.un("click");
                    btnNoColor.on("click", onNoColorClick, me);
                }
                if (me.color == "transparent") {
                    hsbColor = {
                        h: 0,
                        s: 100,
                        b: 100
                    };
                } else {
                    hsbColor = new Common.util.RGBColor(me.color).toHSB();
                }
                hueVal = hsbColor.h;
                saturationVal = hsbColor.s;
                brightnessVal = hsbColor.b;
                if (hueVal == saturationVal && hueVal == brightnessVal && hueVal == 0) {
                    saturationVal = 100;
                }
                refreshUI();
            }
        };
        me.setColor = function (value) {
            if (me.color == value) {
                return;
            }
            var hsbColor;
            if (value == "transparent") {
                hsbColor = {
                    h: 0,
                    s: 100,
                    b: 100
                };
            } else {
                hsbColor = new Common.util.RGBColor(value).toHSB();
            }
            hueVal = hsbColor.h;
            saturationVal = hsbColor.s;
            brightnessVal = hsbColor.b;
            if (hueVal == saturationVal && hueVal == brightnessVal && hueVal == 0) {
                saturationVal = 100;
            }
            me.color = value;
            refreshUI();
        };
        me.on("afterrender", onAfterRender, this);
        me.callParent(arguments);
        this.addEvents("changecolor");
    },
    onRender: function (ct, position) {
        var me = this;
        Ext.applyIf(me.renderData, me.getTemplateArgs());
        me.callParent(arguments);
    },
    getTemplateArgs: function () {
        var me = this;
        return {
            allowEmptyColor: me.allowEmptyColor,
            changeSaturation: me.changeSaturation,
            textNoColor: me.textNoColor,
            showCurrentColor: me.showCurrentColor
        };
    },
    textNoColor: "No Color"
});