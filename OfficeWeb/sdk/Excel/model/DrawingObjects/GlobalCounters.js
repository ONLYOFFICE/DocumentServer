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
 function CIdCounter() {
    this.m_sUserId = null;
    this.m_bLoad = true;
    this.m_nIdCounterLoad = 0;
    this.m_nIdCounterEdit = 0;
    this.Get_NewId = function () {
        if (true === this.m_bLoad || null === this.m_sUserId) {
            this.m_nIdCounterLoad++;
            return ("" + this.m_nIdCounterLoad);
        } else {
            this.m_nIdCounterEdit++;
            var cur_id = ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
            while (isRealObject(g_oTableId.Get_ById(cur_id))) {
                this.m_nIdCounterEdit++;
                cur_id = ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
            }
            return cur_id;
        }
    };
    this.Set_UserId = function (sUserId) {
        this.m_sUserId = sUserId;
    };
    this.Set_Load = function (bValue) {
        this.m_bLoad = bValue;
    };
}
var g_oIdCounter = null;
var CLASS_TYPE_TABLE_ID = 0;
var CLASS_TYPE_DOCUMENT_CONTENT = 1;
var CLASS_TYPE_SHAPE = 2;
var CLASS_TYPE_IMAGE = 3;
var CLASS_TYPE_GROUP = 4;
var CLASS_TYPE_XFRM = 5;
var CLASS_TYPE_GEOMETRY = 6;
var CLASS_TYPE_PATH = 7;
var CLASS_TYPE_PARAGRAPH = 8;
var CLASS_TYPE_TEXT_BODY = 9;
var CLASS_TYPE_TEXT_PR = 10;
var CLASS_TYPE_UNI_FILL = 11;
var CLASS_TYPE_PATTERN_FILL = 12;
var CLASS_TYPE_GRAD_FILL = 13;
var CLASS_TYPE_SOLID_FILL = 14;
var CLASS_TYPE_UNI_COLOR = 15;
var CLASS_TYPE_SCHEME_COLOR = 16;
var CLASS_TYPE_RGB_COLOR = 17;
var CLASS_TYPE_PRST_COLOR = 18;
var CLASS_TYPE_SYS_COLOR = 19;
var CLASS_TYPE_LINE = 20;
var CLASS_TYPE_CHART_AS_GROUP = 21;
var CLASS_TYPE_CHART_LEGEND = 22;
var CLASS_TYPE_CHART_TITLE = 23;
var CLASS_TYPE_COLOR_MOD = 24;
var CLASS_TYPE_LEGEND_ENTRY = 25;
var CLASS_TYPE_CHART_DATA = 26;
var CLASS_TYPE_NO_FILL = 27;
var CLASS_TYPE_GS = 28;
var CLASS_TYPE_GRAD_LIN = 29;
var CLASS_TYPE_GRAD_PAT = 30;
var CLASS_TYPE_BLIP_FILL = 31;
var CLASS_TYPE_CHART_LAYOUT = 32;
var g_oTableId = null;