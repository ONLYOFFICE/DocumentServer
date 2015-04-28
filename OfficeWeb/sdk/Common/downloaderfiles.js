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
function FileHandler() {
    this.get = function (file) {
        if (AscBrowser.isAppleDevices) {
            var downloadWindow = window.open(file, "_parent", "", false);
            downloadWindow.document.title = "Downloading...";
            window.focus();
        } else {
            var frmWindow = getIFrameWindow(file);
            var frm = frmWindow.document.getElementById("frmFile");
            frm.submit();
        }
    };
    var getIFrameWindow = function (file) {
        var ifr = document.getElementById("fileFrame");
        if (null != ifr) {
            document.body.removeChild(ifr);
        }
        createFrame(file);
        var wnd = window.frames["fileFrame"];
        return wnd;
    };
    var createFrame = function (file) {
        var frame = document.createElement("iframe");
        frame.name = "fileFrame";
        frame.id = "fileFrame";
        document.body.appendChild(frame);
        generateIFrameContent(file);
        frame.style.width = "0px";
        frame.style.height = "0px";
        frame.style.border = "0px";
        frame.style.display = "none";
    };
    var generateIFrameContent = function (file) {
        var frameWindow = window.frames["fileFrame"];
        var content = "<form id='frmFile' method='post' enctype='multipart/form-data' action='" + file + "'></form>";
        frameWindow.document.open();
        frameWindow.document.write(content);
        frameWindow.document.close();
    };
}
function getFile(filePath) {
    var fh = new FileHandler();
    fh.get(filePath);
}