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
 Ext.define("Common.plugin.TextAreaAutoHeight", {
    extend: "Ext.AbstractPlugin",
    alias: "plugin.textareaautoheight",
    settings: {
        minHeight: 32,
        maxHeight: 120,
        growStep: 17
    },
    init: function (cmp) {
        this.callParent(arguments);
        cmp.addEvents("elastic");
        cmp.on("afterrender", this.onAfterRender, this);
        cmp.on("change", this.onChange, this);
    },
    onAfterRender: function (cmp) {
        var textareaEl = cmp.getEl().down("textarea");
        if (textareaEl) {
            this.initHelper(textareaEl.id);
            this.elasticTextArea(textareaEl.id);
        }
    },
    onChange: function (cmp) {
        if (!this.textareaElId) {
            this.textareaElId = cmp.getEl().down("textarea").id;
        }
        this.elasticTextArea(this.textareaElId);
    },
    initHelper: function (elementId) {
        var getStyles = function (el, args) {
            var ret = {},
            total = args.length;
            for (var n = 0; n < total; n++) {
                ret[args[n]] = el.getStyle(args[n]);
            }
            return ret;
        };
        var applyStyles = function (el, styles) {
            if (styles) {
                var i = 0,
                len;
                el = Ext.fly(el);
                if (Ext.isFunction(styles)) {
                    styles = styles.call();
                }
                if (typeof styles == "string") {
                    styles = styles.split(/:|;/g);
                    for (len = styles.length; i < len;) {
                        el.setStyle(styles[i++], styles[i++]);
                    }
                } else {
                    if (Ext.isObject(styles)) {
                        el.setStyle(styles);
                    }
                }
            }
        };
        this.domEl = Ext.get(elementId);
        this.textareaElId = elementId;
        var styles = getStyles(this.domEl, ["font-size", "font-family", "font-weight", "font-style", "line-height", "letter-spacing", "padding-left", "padding-top", "padding-right", "padding-bottom"]);
        this.domEl.setStyle("overflow", "hidden");
        if (!this.helperEl) {
            this.helperEl = Ext.DomHelper.append(this.domEl.parent(), {
                id: elementId + "-textarea-elastic-helper",
                tag: "div",
                style: "position: absolute; top: 0; left: 0; visibility: hidden; white-space: pre-wrap; word-wrap: break-word;"
            },
            true);
            applyStyles(this.helperEl, styles);
        }
    },
    elasticTextArea: function (elementId) {
        var me = this,
        value = this.domEl.dom.value || "&nbsp;";
        this.helperEl.setWidth(this.domEl.getWidth());
        this.helperEl.update(value.replace(/<br \/>&nbsp;/, "<br />").replace(/<|>/g, " ").replace(/&/g, "&amp;").replace(/\n/g, "<br />"));
        var textHeight = this.helperEl.getHeight();
        if ((textHeight > me.settings.maxHeight) && (me.settings.maxHeight > 0)) {
            textHeight = me.settings.maxHeight;
            this.domEl.setStyle("overflow", "auto");
        }
        if ((textHeight < me.settings.minHeight) && (me.settings.minHeight > 0)) {
            textHeight = me.settings.minHeight;
        }
        var newHeight = textHeight + me.settings.growStep;
        if (me.cmp.getHeight() != newHeight) {
            me.cmp.setHeight(newHeight);
            me.cmp.fireEvent("elastic", me.cmp, this.domEl.getWidth(), newHeight);
        }
    }
});