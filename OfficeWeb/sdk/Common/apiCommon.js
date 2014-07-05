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
 (function (window, undefined) {
    var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
    var prot;
    function asc_CAscEditorPermissions(settings) {
        if (! (this instanceof asc_CAscEditorPermissions)) {
            return new asc_CAscEditorPermissions();
        }
        if (settings) {
            this.canEdit = settings["canEdit"];
            this.canDownload = settings["canDownload"];
            this.canCoAuthoring = settings["canCoAuthoring"];
            this.canReaderMode = settings["canReaderMode"];
            this.canBranding = settings["canBranding"];
            this.isAutosaveEnable = settings["isAutosaveEnable"];
            this.AutosaveMinInterval = settings["AutosaveMinInterval"];
        } else {
            this.canEdit = true;
            this.canDownload = true;
            this.canCoAuthoring = true;
            this.canReaderMode = true;
            this.canBranding = true;
            this.isAutosaveEnable = true;
            this.AutosaveMinInterval = 300;
        }
        return this;
    }
    asc_CAscEditorPermissions.prototype = {
        constructor: asc_CAscEditorPermissions,
        asc_getCanEdit: function () {
            return this.canEdit;
        },
        asc_getCanDownload: function () {
            return this.canDownload;
        },
        asc_getCanCoAuthoring: function () {
            return this.canCoAuthoring;
        },
        asc_getCanReaderMode: function () {
            return this.canReaderMode;
        },
        asc_getCanBranding: function (v) {
            return this.canBranding;
        },
        asc_getIsAutosaveEnable: function () {
            return this.isAutosaveEnable;
        },
        asc_getAutosaveMinInterval: function () {
            return this.AutosaveMinInterval;
        },
        asc_setCanEdit: function (v) {
            this.canEdit = v;
        },
        asc_setCanDownload: function (v) {
            this.canDownload = v;
        },
        asc_setCanCoAuthoring: function (v) {
            this.canCoAuthoring = v;
        },
        asc_setCanReaderMode: function (v) {
            this.canReaderMode = v;
        },
        asc_setCanBranding: function (v) {
            this.canBranding = v;
        },
        asc_setIsAutosaveEnable: function (v) {
            this.isAutosaveEnable = v;
        },
        asc_setAutosaveMinInterval: function (v) {
            this.AutosaveMinInterval = v;
        }
    };
    window["Asc"]["asc_CAscEditorPermissions"] = window["Asc"].asc_CAscEditorPermissions = asc_CAscEditorPermissions;
    prot = asc_CAscEditorPermissions.prototype;
    prot["asc_getCanEdit"] = prot.asc_getCanEdit;
    prot["asc_getCanDownload"] = prot.asc_getCanDownload;
    prot["asc_getCanCoAuthoring"] = prot.asc_getCanCoAuthoring;
    prot["asc_getCanReaderMode"] = prot.asc_getCanReaderMode;
    prot["asc_getCanBranding"] = prot.asc_getCanBranding;
    prot["asc_getIsAutosaveEnable"] = prot.asc_getIsAutosaveEnable;
    prot["asc_getAutosaveMinInterval"] = prot.asc_getAutosaveMinInterval;
    function asc_CAscLicense(settings) {
        if (! (this instanceof asc_CAscLicense)) {
            return new asc_CAscLicense();
        }
        if (settings) {
            this.customer = settings["customer"];
            this.customerAddr = settings["customer_addr"];
            this.customerWww = settings["customer_www"];
            this.customerMail = settings["customer_mail"];
            this.customerInfo = settings["customer_info"];
            this.customerLogo = settings["customer_logo"];
        } else {
            this.customer = null;
            this.customerAddr = null;
            this.customerWww = null;
            this.customerMail = null;
            this.customerInfo = null;
            this.customerLogo = null;
        }
        return this;
    }
    asc_CAscLicense.prototype.asc_getCustomer = function () {
        return this.customer;
    };
    asc_CAscLicense.prototype.asc_getCustomerAddr = function () {
        return this.customerAddr;
    };
    asc_CAscLicense.prototype.asc_getCustomerWww = function () {
        return this.customerWww;
    };
    asc_CAscLicense.prototype.asc_getCustomerMail = function () {
        return this.customerMail;
    };
    asc_CAscLicense.prototype.asc_getCustomerInfo = function () {
        return this.customerInfo;
    };
    asc_CAscLicense.prototype.asc_getCustomerLogo = function () {
        return this.customerLogo;
    };
    window["Asc"]["asc_CAscLicense"] = window["Asc"].asc_CAscLicense = asc_CAscLicense;
    prot = asc_CAscLicense.prototype;
    prot["asc_getCustomer"] = prot.asc_getCustomer;
    prot["asc_getCustomerAddr"] = prot.asc_getCustomerAddr;
    prot["asc_getCustomerWww"] = prot.asc_getCustomerWww;
    prot["asc_getCustomerMail"] = prot.asc_getCustomerMail;
    prot["asc_getCustomerInfo"] = prot.asc_getCustomerInfo;
    prot["asc_getCustomerLogo"] = prot.asc_getCustomerLogo;
})(window);