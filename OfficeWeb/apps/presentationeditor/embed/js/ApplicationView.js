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
 var ApplicationView = new(function () {
    function createView() {
        $("#id-btn-share").popover({
            trigger: "manual",
            template: '<div class="popover share" id="id-popover-share"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            content: '<div class="share-link">' + '<span class="caption">Link:</span>' + '<span id="id-short-url" class="input-medium uneditable-input"></span>' + '<button id="id-btn-copy-short" type="button" class="btn btn-mini btn-primary" style="width: 65px;" data-copied-text="Copied">Copy</button>' + "</div> " + '<div class="share-buttons" style="height: 25px" id="id-popover-social-container" data-loaded="false">' + "<ul></ul>" + "</div>"
        }).popover("show");
        $("#id-btn-embed").popover({
            trigger: "manual",
            template: '<div class="popover embed" id="id-popover-embed"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            content: '<div class="size-manual">' + '<span class="caption">Width:</span>' + '<input id="id-input-embed-width" class="input-mini" type="text" value="400px">' + '<input id="id-input-embed-height" class="right input-mini" type="text" value="600px">' + '<span class="right caption">Height:</span>' + "</div>" + '<textarea id="id-textarea-embed" rows="4" readonly></textarea>' + '<button id="id-btn-copy-embed" type="button" class="btn btn-mini btn-primary" data-copied-text="Copied">Copy</button>'
        }).popover("show");
        $("body").popover({
            trigger: "manual",
            animation: false,
            template: '<div class="popover hyperlink" id="id-tip-hyperlink"><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            content: "<br><b>Press Ctrl and click link</b>"
        }).popover("show");
    }
    return {
        create: createView
    };
})();