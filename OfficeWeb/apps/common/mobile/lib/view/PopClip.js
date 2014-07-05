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
 Ext.define("Common.view.PopClip", {
    extend: "Ext.Container",
    alias: "widget.popclip",
    requires: (["Ext.Panel", "Ext.SegmentedButton"]),
    config: {
        style: "position: absolute; z-index: 9090; background-color: transparent; width: 2px; height: 2px;"
    },
    initialize: function () {
        var me = this;
        me.popClipCmp = me.add({
            xtype: "panel",
            layout: "fit",
            ui: "settings",
            style: "padding: 1px;",
            hidden: true,
            items: [{
                xtype: "container",
                items: [{
                    xtype: "segmentedbutton",
                    style: "margin: 0",
                    ui: "base",
                    allowToggle: false,
                    items: [{
                        id: "id-btn-popclip-cut",
                        ui: "base",
                        style: "font-size: 0.7em; border: 0; box-shadow: none;",
                        cls: "text-offset-12",
                        text: this.cutButtonText
                    },
                    {
                        id: "id-btn-popclip-copy",
                        ui: "base",
                        style: "font-size: 0.7em; border: 0; box-shadow: none;",
                        cls: "text-offset-12",
                        text: this.copyButtonText
                    },
                    {
                        id: "id-btn-popclip-paste",
                        ui: "base",
                        style: "font-size: 0.7em; border: 0; box-shadow: none;",
                        cls: "text-offset-12",
                        text: this.pasteButtonText
                    }]
                }]
            }]
        });
        this.callParent(arguments);
    },
    show: function (animation) {
        if (Ext.isDefined(this.isAnim)) {
            return;
        }
        this.callParent(arguments);
        var popClip = this.popClipCmp;
        popClip.showBy(this, "bc-tc?");
        popClip.hide();
        popClip.show();
        popClip.alignTo(this, "bc-tc?");
        this.isAnim = true;
        Ext.Anim.run(popClip, "pop", {
            out: false,
            duration: 250,
            easing: "ease-out",
            autoClear: false
        });
        popClip.element.on("transitionend", function () {
            Ext.isDefined(this.isAnim) && delete this.isAnim;
        },
        this, {
            single: true
        });
    },
    hide: function (animation) {
        var me = this;
        var safeHide = function (arguments) {
            if (Ext.isDefined(me.isAnim)) {
                Ext.defer(safeHide, 50, me, arguments);
            } else {
                Ext.bind(me.callParent, me, arguments);
                me.popClipCmp.hide();
            }
        };
        safeHide(arguments);
    },
    cutButtonText: "Cut",
    copyButtonText: "Copy",
    pasteButtonText: "Paste"
});