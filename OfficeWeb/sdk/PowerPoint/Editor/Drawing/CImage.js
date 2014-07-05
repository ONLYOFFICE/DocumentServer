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
 function CompareImageProperties(imgProps1, imgProps2) {
    var _result_image_properties = {};
    if (imgProps1.Width == null || imgProps2.Width == null) {
        _result_image_properties.Width = null;
    } else {
        _result_image_properties.Width = (imgProps1.Width === imgProps2.Width) ? imgProps1.Width : null;
    }
    if (imgProps1.Height == null || imgProps2.Height == null) {
        _result_image_properties.Height = null;
    } else {
        _result_image_properties.Height = (imgProps1.Height === imgProps2.Height) ? imgProps1.Height : null;
    }
    _result_image_properties.Paddings = ComparePaddings(imgProps1.Paddings, imgProps2.Paddings);
    _result_image_properties.Position = CompareImgPosition(imgProps1.Position, imgProps2.Position);
    if (! (typeof imgProps1.ImageUrl === "string") || !(typeof imgProps2.ImageUrl === "string") || imgProps1.ImageUrl !== imgProps2.ImageUrl) {
        _result_image_properties.ImageUrl = null;
    } else {
        _result_image_properties = imgProps1.ImageUrl;
    }
    _result_image_properties.IsLocked = imgProps1.IsLocked === true || imgProps2.IsLocked === true;
    return _result_image_properties;
}
function ComparePaddings(paddings1, paddings2) {
    if ((paddings1 === null || !(typeof paddings1 === "object")) || (paddings2 === null || !(typeof paddings2 === "object"))) {
        return null;
    }
    var _result_paddings = {};
    if (! (typeof paddings1.Left === "number") && !(typeof paddings2.Left === "number") || (paddings1.Left !== paddings2.Left)) {
        _result_paddings.Left = null;
    } else {
        _result_paddings.Left = paddings1.Left;
    }
    if (! (typeof paddings1.Top === "number") && !(typeof paddings2.Top === "number") || (paddings1.Top !== paddings2.Top)) {
        _result_paddings.Top = null;
    } else {
        _result_paddings.Top = paddings1.Top;
    }
    if (! (typeof paddings1.Right === "number") && !(typeof paddings2.Right === "number") || (paddings1.Right !== paddings2.Right)) {
        _result_paddings.Right = null;
    } else {
        _result_paddings.Right = paddings1.Right;
    }
    if (! (typeof paddings1.Bottom === "number") && !(typeof paddings2.Bottom === "number") || (paddings1.Bottom !== paddings2.Bottom)) {
        _result_paddings.Bottom = null;
    } else {
        _result_paddings.Bottom = paddings1.Bottom;
    }
    return _result_paddings;
}
function CompareImgPosition(pos1, pos2) {
    if ((pos1 === null || !(typeof pos1 === "object")) || (pos2 === null || !(typeof pos2 === "object"))) {
        return null;
    }
    var _result_position = {};
    if (! (typeof pos1.X === "number") && !(typeof pos1.X === "number") || (pos1.X !== pos1.X)) {
        _result_position.X = null;
    } else {
        _result_position.X = pos1.X;
    }
    if (! (typeof pos1.Y === "number") && !(typeof pos1.Y === "number") || (pos1.Y !== pos1.Y)) {
        _result_position.Y = null;
    } else {
        _result_position.Y = pos1.Y;
    }
    return _result_position;
}