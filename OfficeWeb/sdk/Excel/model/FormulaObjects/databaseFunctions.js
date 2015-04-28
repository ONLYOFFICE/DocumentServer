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
cFormulaFunction.Database = {
    "groupName": "Database",
    "DAVERAGE": cDAVERAGE,
    "DCOUNT": cDCOUNT,
    "DCOUNTA": cDCOUNTA,
    "DGET": cDGET,
    "DMAX": cDMAX,
    "DMIN": cDMIN,
    "DPRODUCT": cDPRODUCT,
    "DSTDEV": cDSTDEV,
    "DSTDEVP": cDSTDEVP,
    "DSUM": cDSUM,
    "DVAR": cDVAR,
    "DVARP": cDVARP
};
function cDAVERAGE() {
    cBaseFunction.call(this, "DAVERAGE");
}
cDAVERAGE.prototype = Object.create(cBaseFunction.prototype);
function cDCOUNT() {
    cBaseFunction.call(this, "DCOUNT");
}
cDCOUNT.prototype = Object.create(cBaseFunction.prototype);
function cDCOUNTA() {
    cBaseFunction.call(this, "DCOUNTA");
}
cDCOUNTA.prototype = Object.create(cBaseFunction.prototype);
function cDGET() {
    cBaseFunction.call(this, "DGET");
}
cDGET.prototype = Object.create(cBaseFunction.prototype);
function cDMAX() {
    cBaseFunction.call(this, "DMAX");
}
cDMAX.prototype = Object.create(cBaseFunction.prototype);
function cDMIN() {
    cBaseFunction.call(this, "DMIN");
}
cDMIN.prototype = Object.create(cBaseFunction.prototype);
function cDPRODUCT() {
    cBaseFunction.call(this, "DPRODUCT");
}
cDPRODUCT.prototype = Object.create(cBaseFunction.prototype);
function cDSTDEV() {
    cBaseFunction.call(this, "DSTDEV");
}
cDSTDEV.prototype = Object.create(cBaseFunction.prototype);
function cDSTDEVP() {
    cBaseFunction.call(this, "DSTDEVP");
}
cDSTDEVP.prototype = Object.create(cBaseFunction.prototype);
function cDSUM() {
    cBaseFunction.call(this, "DSUM");
}
cDSUM.prototype = Object.create(cBaseFunction.prototype);
function cDVAR() {
    cBaseFunction.call(this, "DVAR");
}
cDVAR.prototype = Object.create(cBaseFunction.prototype);
function cDVARP() {
    cBaseFunction.call(this, "DVARP");
}
cDVARP.prototype = Object.create(cBaseFunction.prototype);