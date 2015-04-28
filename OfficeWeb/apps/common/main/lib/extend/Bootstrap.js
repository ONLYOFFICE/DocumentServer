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
 function onDropDownKeyDown(e) {
    var $this = $(this),
    $parent = $this.parent(),
    beforeEvent = jQuery.Event("keydown.before.bs.dropdown"),
    afterEvent = jQuery.Event("keydown.after.bs.dropdown");
    $parent.trigger(beforeEvent);
    if (beforeEvent.isDefaultPrevented()) {
        return;
    }
    patchDropDownKeyDown.call(this, e);
    e.preventDefault();
    e.stopPropagation();
    $parent.trigger(afterEvent);
}
function patchDropDownKeyDown(e) {
    if (!/(38|40|27)/.test(e.keyCode)) {
        return;
    }
    var $this = $(this);
    e.preventDefault();
    e.stopPropagation();
    if ($this.is(".disabled, :disabled")) {
        return;
    }
    var $parent = getParent($this);
    var isActive = $parent.hasClass("open");
    if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) {
            $items = $("[role=menu] li.dropdown-submenu.over:visible", $parent);
            if ($items.size()) {
                $items.eq($items.size() - 1).removeClass("over");
                return false;
            } else {
                $parent.find("[data-toggle=dropdown]").focus();
            }
        }
        return $this.click();
    }
    var $items = $("[role=menu] li:not(.divider):not(.disabled):visible", $parent).find("> a");
    if (!$items.length) {
        return;
    }
    var index = $items.index($items.filter(":focus"));
    if (e.keyCode == 38) {
        index > 0 ? index--:(index = $items.length - 1);
    } else {
        if (e.keyCode == 40) {
            index < $items.length - 1 ? index++:(index = 0);
        }
    }
    if (!~index) {
        index = 0;
    }
    $items.eq(index).focus();
}
function getParent($this) {
    var selector = $this.attr("data-target");
    if (!selector) {
        selector = $this.attr("href");
        selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, "");
    }
    var $parent = selector && $(selector);
    return $parent && $parent.length ? $parent : $this.parent();
}
$(document).off("keydown.bs.dropdown.data-api").on("keydown.bs.dropdown.data-api", "[data-toggle=dropdown], [role=menu]", onDropDownKeyDown);