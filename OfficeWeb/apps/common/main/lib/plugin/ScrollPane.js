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
 Ext.define("Common.plugin.ScrollPane", {
    extend: "Ext.AbstractPlugin",
    alias: "plugin.scrollpane",
    areaSelector: ".x-panel-body",
    settings: {},
    init: function (cmp) {
        var me = this,
        origin;
        me.settings = $.extend({
            enableKeyboardNavigation: true,
            verticalDragMinHeight: 16,
            horizontalDragMinWidth: 16
        },
        me.settings);
        origin = cmp.afterComponentLayout;
        cmp.afterComponentLayout = function (width, height) {
            origin.apply(cmp, arguments);
            if (width > 0 && height > 0) {
                me.initScrollPane();
            }
        };
        me.callParent(arguments);
    },
    initScrollPane: function (domEl) {
        var me = this,
        children, jspCt, elem;
        if (me.initializing) {
            return;
        }
        me.initializing = true;
        if (!me.area || !me.area.length) {
            elem = domEl || me.cmp.getEl().dom;
            me.area = $(elem).find("*").andSelf().filter(me.areaSelector).first();
        }
        children = me.area.children();
        jspCt = children.filter("div.jspContainer");
        if (children.length > 1 && jspCt.length > 0) {
            jspCt.replaceWith($(".jspPane", jspCt).children());
            jspCt = $();
        }
        if (me.jspApi && jspCt.length === 0) {
            me.area.removeData("jsp");
        }
        me.area.jScrollPane(me.settings);
        me.jspApi = me.area.data("jsp");
        me.doLayout();
        delete me.initializing;
        elem = domEl || me.cmp.getEl().dom;
        this._initSelectingScroll(elem);
        if (jspCt.length) {
            var thumb = jspCt.find(">.jspVerticalBar").find(">.jspTrack").find(">.jspDrag");
            thumb.on("mousedown.asc", function (event) {
                if (thumb[0].setCapture) {
                    thumb[0].setCapture();
                }
                me.cmp.scrolllocked = true;
                $("html").bind("mouseup.asc", function (e) {
                    if (thumb[0].releaseCapture) {
                        thumb[0].releaseCapture();
                    }
                    me.cmp.scrolllocked = false;
                    $("html").unbind("mouseup.asc");
                });
                return false;
            });
        }
    },
    _initSelectingScroll: function (elem) {
        var me = this;
        $(elem).off("mousedown.jsp");
        $(elem).on("mousedown.jsp", function (event) {
            $(document).on("mousemove.jsp", _onTextSelectionScrollMouseMove);
            $(document).on("mouseup.jsp", function (event) {
                $(document).off("mousemove.jsp").off("mouseup.jsp");
                _clearTextSelectionInterval();
            });
        });
        var getPos = function (event, c) {
            var p = c == "X" ? "Left" : "Top";
            return event["page" + c] || (event["client" + c] + (document.documentElement["scroll" + p] || document.body["scroll" + p])) || 0;
        };
        var textSelectionInterval;
        var _onTextSelectionScrollMouseMove = function (event) {
            var offset = $(elem).offset().top;
            var maxOffset = offset + $(elem).innerHeight();
            var mouseOffset = getPos(event, "Y");
            var textDragDistanceAway = mouseOffset < offset ? mouseOffset - offset : (mouseOffset > maxOffset ? mouseOffset - maxOffset : 0);
            if (textDragDistanceAway == 0) {
                _clearTextSelectionInterval();
            } else {
                if (!textSelectionInterval) {
                    textSelectionInterval = setInterval(function () {
                        me.jspApi.scrollByY(textDragDistanceAway);
                    },
                    10);
                }
            }
        };
        var _clearTextSelectionInterval = function () {
            if (textSelectionInterval) {
                clearInterval(textSelectionInterval);
                textSelectionInterval = undefined;
            }
        };
    },
    updateScrollPane: function (domEl) {
        this.initScrollPane(domEl);
        if (this.area) {
            this.area.attr("tabindex", "-1");
        }
    },
    scrollToElement: function (elem, stickToTop, animate) {
        var me = this;
        if (me.jspApi) {
            me.jspApi.scrollToElement(elem, stickToTop, animate);
        }
    },
    doLayout: function () {
        var me = this,
        items = me.cmp.items;
        if (items && typeof items.each === "function") {
            items.each(function (item) {
                item.doComponentLayout();
            });
        }
    }
});