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
 Ext.define("DE.controller.DocumentHolder", {
    extend: "Ext.app.Controller",
    views: ["DocumentHolder"],
    refs: [{
        ref: "splitterMainMenu",
        selector: "#main-menu-splitter"
    }],
    init: function () {
        this.control({
            "menuitem[group=popupparagraphvalign]": {
                click: this._onParagraphVAlign
            },
            "#view-main-menu": {
                panelbeforeshow: function (fullscreen) {
                    this._isMenuHided = true;
                    if (fullscreen !== true) {
                        this.getSplitterMainMenu().show();
                    }
                },
                panelbeforehide: function () {
                    this._isMenuHided = true;
                },
                panelshow: function (panel, fulscreen) {
                    this._isMenuHided = false;
                    if (!fulscreen) {
                        if (!panel.isSizeInit) {
                            panel.isSizeInit = true;
                            var view = panel.down("dataview");
                            if (view) {
                                var nodes = view.getNodes(),
                                width_parent = panel.getWidth();
                                for (var item in nodes) {
                                    nodes[item].style["width"] = width_parent + "px";
                                }
                            }
                        }
                    }
                },
                panelhide: function (panel, fulscreen) {
                    this._isMenuHided = false;
                    this.getSplitterMainMenu().hide();
                }
            },
            "#main-menu-splitter": {
                beforedragstart: function (obj, event) {
                    return !event.currentTarget.disabled;
                },
                move: this._onDocumentSplitterMove
            }
        });
    },
    setApi: function (o) {
        this.api = o;
        return this;
    },
    _onDocumentSplitterMove: function (obj, x, y) {
        if (this._isMenuHided) {
            return;
        }
        var jsp_container, width_parent = obj.up("container").down("demainmenu").getWidth();
        if (width_parent > 40) {
            width_parent -= 40;
            Ext.ComponentQuery.query("dataview[group=scrollable]").forEach(function (list) {
                var nodes = list.getNodes();
                for (var item in nodes) {
                    nodes[item].style["width"] = width_parent + "px";
                }
                list.getEl().setWidth(width_parent);
                jsp_container = list.getEl().down(".jspContainer");
                if (jsp_container) {
                    jsp_container.setWidth(width_parent);
                    list.getEl().down(".jspPane").setWidth(width_parent);
                }
            });
        }
    },
    _onParagraphVAlign: function (item, e) {
        var properties = new CImgProperty();
        properties.put_VerticalTextAlign(item.valign);
        this.api.ImgApply(properties);
    }
});