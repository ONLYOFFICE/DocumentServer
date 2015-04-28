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
var AscBrowser = {
    userAgent: "",
    isIE: false,
    isMacOs: false,
    isSafariMacOs: false,
    isAppleDevices: false,
    isAndroid: false,
    isMobile: false,
    isMobileVersion: false,
    isGecko: false,
    isChrome: false,
    isOpera: false,
    isWebkit: false,
    isSafari: false,
    isArm: false,
    isMozilla: false,
    isRetina: false
};
AscBrowser.userAgent = navigator.userAgent.toLowerCase();
AscBrowser.isIE = (AscBrowser.userAgent.indexOf("msie") > -1 || AscBrowser.userAgent.indexOf("trident") > -1);
AscBrowser.isMacOs = (AscBrowser.userAgent.indexOf("mac") > -1);
AscBrowser.isChrome = (AscBrowser.userAgent.indexOf("chrome") > -1);
AscBrowser.isSafari = !AscBrowser.isChrome && (AscBrowser.userAgent.indexOf("safari") > -1);
AscBrowser.isSafariMacOs = (AscBrowser.isSafari && AscBrowser.isMacOs);
AscBrowser.isAppleDevices = (AscBrowser.userAgent.indexOf("ipad") > -1 || AscBrowser.userAgent.indexOf("iphone") > -1 || AscBrowser.userAgent.indexOf("ipod") > -1);
AscBrowser.isAndroid = (AscBrowser.userAgent.indexOf("android") > -1);
AscBrowser.isMobile = /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera);
AscBrowser.isGecko = (AscBrowser.userAgent.indexOf("gecko/") > -1);
AscBrowser.isOpera = !!window.opera;
AscBrowser.isWebkit = (AscBrowser.userAgent.indexOf("webkit") > -1);
AscBrowser.isArm = (AscBrowser.userAgent.indexOf("arm") > -1);
AscBrowser.isMozilla = !AscBrowser.isIE && (AscBrowser.userAgent.indexOf("firefox") > -1);
AscBrowser.isRetina = 2 === window.devicePixelRatio;