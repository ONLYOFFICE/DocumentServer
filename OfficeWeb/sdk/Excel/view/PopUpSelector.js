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
 "use strict";
(function ($, window, undefined) {
    var asc = window["Asc"];
    var asc_HL = asc.HandlersList;
    function PopUpSelector(element, handlers) {
        this.handlers = new asc_HL(handlers);
        this.scrollOptions = {
            wheelPropagation: false,
            minScrollbarLength: null,
            useBothWheelAxes: false,
            useKeyboard: true,
            suppressScrollX: false,
            suppressScrollY: false,
            scrollXMarginOffset: 5,
            scrollYMarginOffset: 5,
            includePadding: false
        };
        this.element = element;
        this.selector = null;
        this.selectorStyle = null;
        this.selectorList = null;
        this.selectorListEl = [];
        this.selectorListJQ = null;
        this.selectElement = null;
        this.firstElement = null;
        this.isFormula = false;
        this.isVisible = false;
        this.skipClose = false;
        this.fMouseDown = null;
        this.fMouseDblClick = null;
        this.fMouseOver = null;
        this._init();
        return this;
    }
    PopUpSelector.prototype._init = function () {
        var t = this;
        if (null != this.element) {
            this.selector = document.createElement("div");
            this.selectorStyle = this.selector.style;
            this.selector.id = "apiPopUpSelector";
            this.selector.className = "combobox";
            this.selector.innerHTML = '<ul id="apiPopUpList" class="dropdown-menu"></ul>';
            this.element.appendChild(this.selector);
            this.selectorList = document.getElementById("apiPopUpList");
            this.fMouseDown = function (event) {
                t._onMouseDown(event);
            };
            this.fMouseDblClick = function (event) {
                t._onMouseDblClick(event);
            };
            this.fMouseOver = function (event) {
                t._onMouseOver(event);
            };
            if (this.selector.addEventListener) {
                this.selector.addEventListener("mousedown", function () {
                    t.skipClose = true;
                },
                false);
            }
            if (window.addEventListener) {
                window.addEventListener("mousedown", function () {
                    if (t.skipClose) {
                        t.skipClose = false;
                        return;
                    }
                    t.hide();
                },
                false);
            }
            this.selectorListJQ = $("#apiPopUpList");
            if (this.selectorListJQ.perfectScrollbar) {
                this.selectorListJQ.perfectScrollbar(this.scrollOptions);
            }
            this.setAlwaysVisibleY(true);
        }
    };
    PopUpSelector.prototype.show = function (isFormula, arrItems, cellRect) {
        this._clearList();
        if (!this.isVisible) {
            this.selector.className = "combobox open";
            this.isVisible = true;
        }
        this.isFormula = isFormula;
        var item, isFirst, value, selectElement = null;
        for (var i = 0; i < arrItems.length; ++i) {
            item = document.createElement("li");
            isFirst = (0 === i);
            if (isFirst) {
                this.firstElement = item;
            }
            if (this.isFormula) {
                if (isFirst) {
                    selectElement = item;
                }
                value = arrItems[i].name;
                item.setAttribute("title", arrItems[i].arg);
            } else {
                value = arrItems[i];
            }
            item.innerHTML = "<a>" + value + "</a>";
            item.setAttribute("val", value);
            if (item.addEventListener) {
                item.addEventListener("mousedown", this.fMouseDown, false);
                item.addEventListener("dblclick", this.fMouseDblClick, false);
                if (!this.isFormula) {
                    item.addEventListener("mouseover", this.fMouseOver, false);
                }
            }
            this.selectorList.appendChild(item);
            this.selectorListEl.push(item);
        }
        this.setPosition(cellRect);
        this.selectorListJQ.perfectScrollbar("update");
        this._onChangeSelection(selectElement);
    };
    PopUpSelector.prototype.hide = function () {
        if (this.isVisible) {
            this.selectorListJQ.scrollTop(0);
            this.selector.className = "combobox";
            this.isVisible = false;
            this._clearList();
        }
    };
    PopUpSelector.prototype.setPosition = function (cellRect) {
        var top = cellRect.asc_getY() + cellRect.asc_getHeight(),
        left = cellRect.asc_getX();
        var diff = top + this.selectorList.offsetHeight - this.element.offsetHeight;
        if (0 < diff) {
            top -= diff;
            left += cellRect.asc_getWidth();
        } else {
            left += 10;
        }
        this.selectorStyle["left"] = left + "px";
        this.selectorStyle["top"] = top + "px";
    };
    PopUpSelector.prototype.getVisible = function () {
        return this.isVisible;
    };
    PopUpSelector.prototype._clearList = function () {
        var i;
        for (i = 0; i < this.selectorListEl.length; ++i) {
            this.selectorList.removeChild(this.selectorListEl[i]);
        }
        this.selectorListEl.length = 0;
        this.selectElement = null;
        this.firstElement = null;
        this.isFormula = false;
    };
    PopUpSelector.prototype.onKeyDown = function (event) {
        var retVal = false;
        switch (event.which) {
        case 9:
            if (this.isFormula) {
                event.stopPropagation();
                event.preventDefault();
                this._onMouseDblClick();
            } else {
                retVal = true;
            }
            break;
        case 13:
            if (null !== this.selectElement) {
                event.stopPropagation();
                event.preventDefault();
                if (this.isFormula) {
                    this._onMouseDblClick();
                } else {
                    this._onInsert(this.selectElement.getAttribute("val"));
                }
            } else {
                retVal = true;
            }
            break;
        case 27:
            this.hide();
            break;
        case 38:
            this._onChangeSelection(null !== this.selectElement ? this.selectElement.previousSibling : this.firstElement);
            break;
        case 40:
            this._onChangeSelection(null !== this.selectElement ? this.selectElement.nextSibling : this.firstElement);
            break;
        case 16:
            break;
        default:
            retVal = true;
        }
        if (retVal) {
            this.hide();
        }
        return retVal;
    };
    PopUpSelector.prototype._onInsert = function (value) {
        this.hide();
        this.handlers.trigger("insert", value);
    };
    PopUpSelector.prototype._onMouseDown = function (event) {
        this.skipClose = true;
        var element = event.currentTarget;
        if (this.isFormula) {
            this._onChangeSelection(element);
        } else {
            this._onInsert(element.getAttribute("val"));
        }
    };
    PopUpSelector.prototype._onMouseDblClick = function (event) {
        if (!this.isVisible) {
            return;
        }
        if (!this.isFormula) {
            this._onMouseDown(event);
            return;
        }
        var elementVal = (event ? event.currentTarget : this.selectElement).getAttribute("val");
        this._onInsert(elementVal);
    };
    PopUpSelector.prototype._onMouseOver = function (event) {
        if (this.isFormula) {
            return;
        }
        this._onChangeSelection(event.currentTarget);
    };
    PopUpSelector.prototype._onChangeSelection = function (newElement) {
        if (null === newElement || null === newElement.getAttribute("val")) {
            return;
        }
        if (null !== this.selectElement) {
            this.selectElement.className = "";
        }
        this.selectElement = newElement;
        this.selectElement.className = "selected";
        this.scrollToRecord();
    };
    PopUpSelector.prototype.scrollToRecord = function () {
        var innerEl = $(this.selectorList);
        var inner_top = innerEl.offset().top;
        var div = $(this.selectElement);
        var div_top = div.offset().top;
        if (div_top < inner_top || div_top + div.height() > inner_top + innerEl.height()) {
            this.selectorListJQ.scrollTop(this.selectorListJQ.scrollTop() + div_top - inner_top);
        }
    };
    PopUpSelector.prototype.setAlwaysVisibleY = function (flag) {
        if (flag) {
            $(this.selectorList).find(".ps-scrollbar-y-rail").addClass("always-visible-y");
            $(this.selectorList).find(".ps-scrollbar-y").addClass("always-visible-y");
        } else {
            $(this.selectorList).find(".ps-scrollbar-y-rail").removeClass("always-visible-y");
            $(this.selectorList).find(".ps-scrollbar-y").removeClass("always-visible-y");
        }
    };
    window["Asc"].PopUpSelector = PopUpSelector;
})(jQuery, window);