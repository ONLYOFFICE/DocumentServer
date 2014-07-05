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
 Ext.define("Common.component.LoadMask", {
    extend: "Ext.Component",
    alias: "widget.cmdloadmask",
    mixins: {
        floating: "Ext.util.Floating"
    },
    useMsg: true,
    disabled: false,
    baseCls: "cmd-loadmask",
    config: {
        title: ""
    },
    renderTpl: ['<div style="position:relative" class="{baseCls}-body">', "<div>", '<div class="{baseCls}-image"></div>', '<div class="{baseCls}-title"></div>', "</div>", '<div class="{baseCls}-pwd-ct">', '<div class="{baseCls}-pwd-by">POWERED BY</div>', '<div class="{baseCls}-pwd-tm">ONLYOFFICE</div>', "</div>", "</div>"],
    modal: true,
    width: "auto",
    floating: {
        shadow: false
    },
    focusOnToFront: false,
    constructor: function (el, config) {
        var me = this;
        if (el.isComponent) {
            me.ownerCt = el;
            me.bindComponent(el);
        } else {
            me.ownerCt = new Ext.Component({
                el: Ext.get(el),
                rendered: true,
                componentLayoutCounter: 1
            });
            me.container = el;
        }
        me.callParent([config]);
        me.renderSelectors = {
            titleEl: "." + me.baseCls + "-title"
        };
    },
    bindComponent: function (comp) {
        this.mon(comp, {
            resize: this.onComponentResize,
            scope: this
        });
    },
    applyTitle: function (title) {
        var me = this;
        me.title = title;
        if (me.rendered) {
            me.titleEl.update(me.title);
            var parent = me.floatParent ? me.floatParent.getTargetEl() : me.container;
            var xy = me.getEl().getAlignToXY(parent, "c-c");
            var pos = parent.translatePoints(xy[0], xy[1]);
            if (Ext.isDefined(pos.left) || Ext.isDefined(pos.top)) {
                me.setPosition(pos.left, pos.top);
            }
        }
    },
    afterRender: function () {
        this.callParent(arguments);
        this.container = this.floatParent.getContentTarget();
    },
    onComponentResize: function () {
        var me = this;
        if (me.rendered && me.isVisible()) {
            me.toFront();
            me.center();
        }
    },
    onDisable: function () {
        this.callParent(arguments);
        if (this.loading) {
            this.onLoad();
        }
    },
    onBeforeLoad: function () {
        var me = this,
        owner = me.ownerCt || me.floatParent,
        origin;
        if (!this.disabled) {
            if (owner.componentLayoutCounter) {
                Ext.Component.prototype.show.call(me);
            } else {
                origin = owner.afterComponentLayout;
                owner.afterComponentLayout = function () {
                    owner.afterComponentLayout = origin;
                    origin.apply(owner, arguments);
                    if (me.loading) {
                        Ext.Component.prototype.show.call(me);
                    }
                };
            }
        }
    },
    onHide: function () {
        var me = this;
        me.callParent(arguments);
        me.showOnParentShow = true;
    },
    onShow: function () {
        var me = this;
        me.callParent(arguments);
        me.loading = true;
        me.setTitle(me.title);
    },
    afterShow: function () {
        this.callParent(arguments);
        this.center();
    },
    onLoad: function () {
        this.loading = false;
        Ext.Component.prototype.hide.call(this);
    }
});