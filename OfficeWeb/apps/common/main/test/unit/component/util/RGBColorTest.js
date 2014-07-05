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
 TestCase("RGBColorTest", {
    "test create fail color": function () {
        var color1 = new Common.component.util.RGBColor("rgb(123, 234 32)");
        var color2 = new Common.component.util.RGBColor("067ffEC1");
        var color3 = new Common.component.util.RGBColor("#00FC");
        assertFalse(color1.ok);
        assertFalse(color2.ok);
        assertFalse(color3.ok);
    },
    "test create by RGB": function () {
        var color = new Common.component.util.RGBColor("rgb(123, 234,45)");
        assertTrue(color.ok);
        assertEquals(color.r, 123);
        assertEquals(color.g, 234);
        assertEquals(color.b, 45);
    },
    "test create by HEX 6": function () {
        var color = new Common.util.RGBColor("#00ffEC");
        assertTrue(color.ok);
        assertEquals(color.r, 0);
        assertEquals(color.g, 255);
        assertEquals(color.b, 236);
    },
    "test create by RGB 3": function () {
        var color = new Common.util.RGBColor("#6f0");
        assertTrue(color.ok);
        assertEquals(color.r, 102);
        assertEquals(color.g, 255);
        assertEquals(color.b, 0);
    },
    "test equal": function () {
        assertTrue(new Common.util.RGBColor("#6f0").isEqual(new Common.util.RGBColor("#66ff00")));
    },
    "test toRGB": function () {
        assertEquals(new Common.util.RGBColor("#6f0").toRGB(), "rgb(102, 255, 0)");
    },
    "test toHEX": function () {
        assertEquals(new Common.util.RGBColor("rgb(102, 255, 0)").toHex(), "#66ff00");
    }
});