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
 (function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        if (typeof exports === "object") {
            factory(require("jquery"));
        } else {
            factory(jQuery);
        }
    }
} (function ($) {
    var defaultSettings = {
        wheelSpeed: 10,
        wheelPropagation: false,
        minScrollbarLength: null,
        useBothWheelAxes: false,
        useKeyboard: true,
        suppressScrollX: false,
        suppressScrollY: false,
        scrollXMarginOffset: 0,
        scrollYMarginOffset: 0,
        includePadding: false,
        includeMargin: true
    };
    var getEventClassName = (function () {
        var incrementingId = 0;
        return function () {
            var id = incrementingId;
            incrementingId += 1;
            return ".perfect-scrollbar-" + id;
        };
    } ());
    $.fn.perfectScrollbar = function (suppliedSettings, option) {
        return this.each(function () {
            var settings = $.extend(true, {},
            defaultSettings),
            $this = $(this);
            if (typeof suppliedSettings === "object") {
                $.extend(true, settings, suppliedSettings);
            } else {
                option = suppliedSettings;
            }
            if (option === "update") {
                if ($this.data("perfect-scrollbar-update")) {
                    $this.data("perfect-scrollbar-update")();
                }
                return $this;
            } else {
                if (option === "destroy") {
                    if ($this.data("perfect-scrollbar-destroy")) {
                        $this.data("perfect-scrollbar-destroy")();
                    }
                    return $this;
                }
            }
            if ($this.data("perfect-scrollbar")) {
                return $this.data("perfect-scrollbar");
            }
            $this.addClass("ps-container");
            var $scrollbarXRail = $("<div class='ps-scrollbar-x-rail'></div>").appendTo($this),
            $scrollbarYRail = $("<div class='ps-scrollbar-y-rail'></div>").appendTo($this),
            $scrollbarX = $("<div class='ps-scrollbar-x'></div>").appendTo($scrollbarXRail),
            $scrollbarY = $("<div class='ps-scrollbar-y'></div>").appendTo($scrollbarYRail),
            scrollbarXActive,
            scrollbarYActive,
            containerWidth,
            containerHeight,
            contentWidth,
            contentHeight,
            scrollbarXWidth,
            scrollbarXLeft,
            scrollbarXBottom = parseInt($scrollbarXRail.css("bottom"), 10),
            scrollbarYHeight,
            scrollbarYTop,
            scrollbarYRight = parseInt($scrollbarYRail.css("right"), 10),
            scrollbarYRailHeight,
            eventClassName = getEventClassName();
            var updateContentScrollTop = function (currentTop, deltaY) {
                var newTop = currentTop + deltaY,
                maxTop = scrollbarYRailHeight - scrollbarYHeight;
                if (newTop < 0) {
                    scrollbarYTop = 0;
                } else {
                    if (newTop > maxTop) {
                        scrollbarYTop = maxTop;
                    } else {
                        scrollbarYTop = newTop;
                    }
                }
                var scrollTop = parseInt(scrollbarYTop * (contentHeight - containerHeight) / (scrollbarYRailHeight - scrollbarYHeight), 10);
                $this.scrollTop(scrollTop);
                $scrollbarXRail.css({
                    bottom: scrollbarXBottom - scrollTop
                });
            };
            var updateContentScrollLeft = function (currentLeft, deltaX) {
                var newLeft = currentLeft + deltaX,
                maxLeft = containerWidth - scrollbarXWidth;
                if (newLeft < 0) {
                    scrollbarXLeft = 0;
                } else {
                    if (newLeft > maxLeft) {
                        scrollbarXLeft = maxLeft;
                    } else {
                        scrollbarXLeft = newLeft;
                    }
                }
                var scrollLeft = parseInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth), 10);
                $this.scrollLeft(scrollLeft);
                $scrollbarYRail.css({
                    right: scrollbarYRight - scrollLeft
                });
            };
            var getSettingsAdjustedThumbSize = function (thumbSize) {
                if (settings.minScrollbarLength) {
                    thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
                }
                return thumbSize;
            };
            var updateScrollbarCss = function () {
                $scrollbarXRail.css({
                    left: $this.scrollLeft(),
                    bottom: scrollbarXBottom - $this.scrollTop(),
                    width: containerWidth,
                    display: scrollbarXActive ? "inherit" : "none"
                });
                if ($scrollbarYRail.hasClass("in-scrolling")) {
                    $scrollbarYRail.css({
                        right: scrollbarYRight - $this.scrollLeft(),
                        height: scrollbarYRailHeight,
                        display: scrollbarYActive ? "inherit" : "none"
                    });
                } else {
                    $scrollbarYRail.css({
                        top: $this.scrollTop(),
                        right: scrollbarYRight - $this.scrollLeft(),
                        height: scrollbarYRailHeight,
                        display: scrollbarYActive ? "inherit" : "none"
                    });
                }
                $scrollbarX.css({
                    left: scrollbarXLeft,
                    width: scrollbarXWidth
                });
                $scrollbarY.css({
                    top: scrollbarYTop,
                    height: scrollbarYHeight
                });
            };
            var updateBarSizeAndPosition = function () {
                containerWidth = settings.includePadding ? $this.innerWidth() : $this.width();
                containerHeight = settings.includePadding ? $this.innerHeight() : $this.height();
                scrollbarYRailHeight = containerHeight - (settings.includeMargin ? (parseInt($scrollbarYRail.css("margin-top")) + parseInt($scrollbarYRail.css("margin-bottom"))) : 0);
                contentWidth = $this.prop("scrollWidth");
                contentHeight = $this.prop("scrollHeight");
                if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
                    scrollbarXActive = true;
                    scrollbarXWidth = getSettingsAdjustedThumbSize(parseInt(containerWidth * containerWidth / contentWidth, 10));
                    scrollbarXLeft = parseInt($this.scrollLeft() * (containerWidth - scrollbarXWidth) / (contentWidth - containerWidth), 10);
                } else {
                    scrollbarXActive = false;
                    scrollbarXWidth = 0;
                    scrollbarXLeft = 0;
                    $this.scrollLeft(0);
                }
                if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
                    scrollbarYActive = true;
                    scrollbarYHeight = getSettingsAdjustedThumbSize(parseInt(scrollbarYRailHeight * containerHeight / contentHeight, 10));
                    scrollbarYTop = parseInt($this.scrollTop() * (scrollbarYRailHeight - scrollbarYHeight) / (contentHeight - containerHeight), 10);
                } else {
                    scrollbarYActive = false;
                    scrollbarYHeight = 0;
                    scrollbarYTop = 0;
                    $this.scrollTop(0);
                }
                if (scrollbarYTop >= scrollbarYRailHeight - scrollbarYHeight) {
                    scrollbarYTop = scrollbarYRailHeight - scrollbarYHeight;
                }
                if (scrollbarXLeft >= containerWidth - scrollbarXWidth) {
                    scrollbarXLeft = containerWidth - scrollbarXWidth;
                }
                updateScrollbarCss();
            };
            var bindMouseScrollXHandler = function () {
                var currentLeft, currentPageX;
                $scrollbarX.bind("mousedown" + eventClassName, function (e) {
                    currentPageX = e.pageX;
                    currentLeft = $scrollbarX.position().left;
                    $scrollbarXRail.addClass("in-scrolling");
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).bind("mousemove" + eventClassName, function (e) {
                    if ($scrollbarXRail.hasClass("in-scrolling")) {
                        updateContentScrollLeft(currentLeft, e.pageX - currentPageX);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
                $(document).bind("mouseup" + eventClassName, function (e) {
                    if ($scrollbarXRail.hasClass("in-scrolling")) {
                        $scrollbarXRail.removeClass("in-scrolling");
                    }
                });
                currentLeft = currentPageX = null;
            };
            var bindMouseScrollYHandler = function () {
                var currentTop, currentPageY;
                $scrollbarY.bind("mousedown" + eventClassName, function (e) {
                    currentPageY = e.pageY;
                    currentTop = $scrollbarY.position().top;
                    $scrollbarYRail.addClass("in-scrolling");
                    var margin = parseInt($scrollbarYRail.css("margin-top"));
                    var rect = $scrollbarYRail[0].getBoundingClientRect();
                    $scrollbarYRail.css({
                        position: "fixed",
                        left: rect.left,
                        top: rect.top - margin
                    });
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).bind("mousemove" + eventClassName, function (e) {
                    if ($scrollbarYRail.hasClass("in-scrolling")) {
                        updateContentScrollTop(currentTop, e.pageY - currentPageY);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
                $(document).bind("mouseup" + eventClassName, function (e) {
                    if ($scrollbarYRail.hasClass("in-scrolling")) {
                        $scrollbarYRail.removeClass("in-scrolling");
                        $scrollbarYRail.css({
                            position: "",
                            left: "",
                            top: ""
                        });
                        updateScrollbarCss();
                    }
                });
                currentTop = currentPageY = null;
            };
            var shouldPreventDefault = function (deltaX, deltaY) {
                var scrollTop = $this.scrollTop();
                if (deltaX === 0) {
                    if (!scrollbarYActive) {
                        return false;
                    }
                    if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
                        return !settings.wheelPropagation;
                    }
                }
                var scrollLeft = $this.scrollLeft();
                if (deltaY === 0) {
                    if (!scrollbarXActive) {
                        return false;
                    }
                    if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
                        return !settings.wheelPropagation;
                    }
                }
                return true;
            };
            var bindMouseWheelHandler = function () {
                settings.wheelSpeed /= 10;
                var shouldPrevent = false;
                $this.bind("mousewheel" + eventClassName, function (e, deprecatedDelta, deprecatedDeltaX, deprecatedDeltaY) {
                    var deltaX = e.deltaX * e.deltaFactor || deprecatedDeltaX,
                    deltaY = e.deltaY * e.deltaFactor || deprecatedDeltaY;
                    if (e && e.target && (e.target.type === "textarea" || e.target.type === "input")) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        var scroll = $(e.target).scrollTop(),
                        wheelDeltaY = 0;
                        if (e.originalEvent) {
                            if (e.originalEvent.wheelDelta) {
                                wheelDeltaY = e.originalEvent.wheelDelta / -40;
                            }
                            if (e.originalEvent.deltaY) {
                                wheelDeltaY = e.originalEvent.deltaY;
                            }
                            if (e.originalEvent.detail) {
                                wheelDeltaY = e.originalEvent.detail;
                            }
                        }
                        $(e.target).scrollTop(scroll - wheelDeltaY);
                        return;
                    }
                    shouldPrevent = false;
                    if (!settings.useBothWheelAxes) {
                        $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
                        $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
                    } else {
                        if (scrollbarYActive && !scrollbarXActive) {
                            if (deltaY) {
                                $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
                            } else {
                                $this.scrollTop($this.scrollTop() + (deltaX * settings.wheelSpeed));
                            }
                            shouldPrevent = true;
                        } else {
                            if (scrollbarXActive && !scrollbarYActive) {
                                if (deltaX) {
                                    $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
                                } else {
                                    $this.scrollLeft($this.scrollLeft() - (deltaY * settings.wheelSpeed));
                                }
                                shouldPrevent = true;
                            }
                        }
                    }
                    updateBarSizeAndPosition();
                    shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
                    if (shouldPrevent) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
                $this.bind("MozMousePixelScroll" + eventClassName, function (e) {
                    if (shouldPrevent) {
                        e.preventDefault();
                    }
                });
            };
            var bindKeyboardHandler = function () {
                var hovered = false;
                $this.bind("mouseenter" + eventClassName, function (e) {
                    hovered = true;
                });
                $this.bind("mouseleave" + eventClassName, function (e) {
                    hovered = false;
                });
                var shouldPrevent = false;
                $(document).bind("keydown" + eventClassName, function (e) {
                    if (!hovered || $(document.activeElement).is(":input,[contenteditable]")) {
                        return;
                    }
                    var deltaX = 0,
                    deltaY = 0;
                    switch (e.which) {
                    case 37:
                        deltaX = -30;
                        break;
                    case 38:
                        deltaY = 30;
                        break;
                    case 39:
                        deltaX = 30;
                        break;
                    case 40:
                        deltaY = -30;
                        break;
                    case 33:
                        deltaY = 90;
                        break;
                    case 32:
                        case 34:
                        deltaY = -90;
                        break;
                    case 35:
                        deltaY = -containerHeight;
                        break;
                    case 36:
                        deltaY = containerHeight;
                        break;
                    default:
                        return;
                    }
                    $this.scrollTop($this.scrollTop() - deltaY);
                    $this.scrollLeft($this.scrollLeft() + deltaX);
                    shouldPrevent = shouldPreventDefault(deltaX, deltaY);
                    if (shouldPrevent) {
                        e.preventDefault();
                    }
                });
            };
            var bindRailClickHandler = function () {
                var stopPropagation = function (e) {
                    e.stopPropagation();
                };
                $scrollbarY.bind("click" + eventClassName, stopPropagation);
                $scrollbarYRail.bind("click" + eventClassName, function (e) {
                    var halfOfScrollbarLength = parseInt(scrollbarYHeight / 2, 10),
                    positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength,
                    maxPositionTop = scrollbarYRailHeight - scrollbarYHeight,
                    positionRatio = positionTop / maxPositionTop;
                    if (positionRatio < 0) {
                        positionRatio = 0;
                    } else {
                        if (positionRatio > 1) {
                            positionRatio = 1;
                        }
                    }
                    $this.scrollTop((contentHeight - containerHeight) * positionRatio);
                });
                $scrollbarX.bind("click" + eventClassName, stopPropagation);
                $scrollbarXRail.bind("click" + eventClassName, function (e) {
                    var halfOfScrollbarLength = parseInt(scrollbarXWidth / 2, 10),
                    positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength,
                    maxPositionLeft = containerWidth - scrollbarXWidth,
                    positionRatio = positionLeft / maxPositionLeft;
                    if (positionRatio < 0) {
                        positionRatio = 0;
                    } else {
                        if (positionRatio > 1) {
                            positionRatio = 1;
                        }
                    }
                    $this.scrollLeft((contentWidth - containerWidth) * positionRatio);
                });
            };
            var bindMobileTouchHandler = function () {
                var applyTouchMove = function (differenceX, differenceY) {
                    $this.scrollTop($this.scrollTop() - differenceY);
                    $this.scrollLeft($this.scrollLeft() - differenceX);
                    updateBarSizeAndPosition();
                };
                var startCoords = {},
                startTime = 0,
                speed = {},
                breakingProcess = null,
                inGlobalTouch = false;
                $(window).bind("touchstart" + eventClassName, function (e) {
                    inGlobalTouch = true;
                });
                $(window).bind("touchend" + eventClassName, function (e) {
                    inGlobalTouch = false;
                });
                $this.bind("touchstart" + eventClassName, function (e) {
                    var touch = e.originalEvent.targetTouches[0];
                    startCoords.pageX = touch.pageX;
                    startCoords.pageY = touch.pageY;
                    startTime = (new Date()).getTime();
                    if (breakingProcess !== null) {
                        clearInterval(breakingProcess);
                    }
                    e.stopPropagation();
                });
                $this.bind("touchmove" + eventClassName, function (e) {
                    if (!inGlobalTouch && e.originalEvent.targetTouches.length === 1) {
                        var touch = e.originalEvent.targetTouches[0];
                        var currentCoords = {};
                        currentCoords.pageX = touch.pageX;
                        currentCoords.pageY = touch.pageY;
                        var differenceX = currentCoords.pageX - startCoords.pageX,
                        differenceY = currentCoords.pageY - startCoords.pageY;
                        applyTouchMove(differenceX, differenceY);
                        startCoords = currentCoords;
                        var currentTime = (new Date()).getTime();
                        var timeGap = currentTime - startTime;
                        if (timeGap > 0) {
                            speed.x = differenceX / timeGap;
                            speed.y = differenceY / timeGap;
                            startTime = currentTime;
                        }
                        e.preventDefault();
                    }
                });
                $this.bind("touchend" + eventClassName, function (e) {
                    clearInterval(breakingProcess);
                    breakingProcess = setInterval(function () {
                        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                            clearInterval(breakingProcess);
                            return;
                        }
                        applyTouchMove(speed.x * 30, speed.y * 30);
                        speed.x *= 0.8;
                        speed.y *= 0.8;
                    },
                    10);
                });
            };
            var bindScrollHandler = function () {
                $this.bind("scroll" + eventClassName, function (e) {
                    updateBarSizeAndPosition();
                });
            };
            var destroy = function () {
                $this.unbind(eventClassName);
                $(window).unbind(eventClassName);
                $(document).unbind(eventClassName);
                $this.data("perfect-scrollbar", null);
                $this.data("perfect-scrollbar-update", null);
                $this.data("perfect-scrollbar-destroy", null);
                $scrollbarX.remove();
                $scrollbarY.remove();
                $scrollbarXRail.remove();
                $scrollbarYRail.remove();
                $scrollbarX = $scrollbarY = containerWidth = containerHeight = contentWidth = contentHeight = scrollbarXWidth = scrollbarXLeft = scrollbarXBottom = scrollbarYHeight = scrollbarYTop = scrollbarYRight = null;
            };
            var ieSupport = function (version) {
                $this.addClass("ie").addClass("ie" + version);
                var bindHoverHandlers = function () {
                    var mouseenter = function () {
                        $(this).addClass("hover");
                    };
                    var mouseleave = function () {
                        $(this).removeClass("hover");
                    };
                    $this.bind("mouseenter" + eventClassName, mouseenter).bind("mouseleave" + eventClassName, mouseleave);
                    $scrollbarXRail.bind("mouseenter" + eventClassName, mouseenter).bind("mouseleave" + eventClassName, mouseleave);
                    $scrollbarYRail.bind("mouseenter" + eventClassName, mouseenter).bind("mouseleave" + eventClassName, mouseleave);
                    $scrollbarX.bind("mouseenter" + eventClassName, mouseenter).bind("mouseleave" + eventClassName, mouseleave);
                    $scrollbarY.bind("mouseenter" + eventClassName, mouseenter).bind("mouseleave" + eventClassName, mouseleave);
                };
                var fixIe6ScrollbarPosition = function () {
                    updateScrollbarCss = function () {
                        $scrollbarX.css({
                            left: scrollbarXLeft + $this.scrollLeft(),
                            bottom: scrollbarXBottom,
                            width: scrollbarXWidth
                        });
                        $scrollbarY.css({
                            top: scrollbarYTop + $this.scrollTop(),
                            right: scrollbarYRight,
                            height: scrollbarYHeight
                        });
                        $scrollbarX.hide().show();
                        $scrollbarY.hide().show();
                    };
                };
                if (version === 6) {
                    bindHoverHandlers();
                    fixIe6ScrollbarPosition();
                }
            };
            var supportsTouch = (("ontouchstart" in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
            var initialize = function () {
                var ieMatch = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
                if (ieMatch && ieMatch[1] === "msie") {
                    ieSupport(parseInt(ieMatch[2], 10));
                }
                updateBarSizeAndPosition();
                bindScrollHandler();
                bindMouseScrollXHandler();
                bindMouseScrollYHandler();
                bindRailClickHandler();
                if (supportsTouch) {
                    bindMobileTouchHandler();
                }
                if ($this.mousewheel) {
                    bindMouseWheelHandler();
                }
                if (settings.useKeyboard) {
                    bindKeyboardHandler();
                }
                $this.data("perfect-scrollbar", $this);
                $this.data("perfect-scrollbar-update", updateBarSizeAndPosition);
                $this.data("perfect-scrollbar-destroy", destroy);
            };
            initialize();
            return $this;
        });
    };
}));