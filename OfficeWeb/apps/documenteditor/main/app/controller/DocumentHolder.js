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
 var c_paragraphLinerule = {
    LINERULE_LEAST: 0,
    LINERULE_AUTO: 1,
    LINERULE_EXACT: 2
};
var c_pageNumPosition = {
    PAGE_NUM_POSITION_TOP: 1,
    PAGE_NUM_POSITION_BOTTOM: 2,
    PAGE_NUM_POSITION_RIGHT: 0,
    PAGE_NUM_POSITION_LEFT: 1,
    PAGE_NUM_POSITION_CENTER: 2
};
var c_tableWrap = {
    TABLE_WRAP_NONE: 0,
    TABLE_WRAP_PARALLEL: 1
};
var c_tableAlign = {
    TABLE_ALIGN_LEFT: 0,
    TABLE_ALIGN_CENTER: 1,
    TABLE_ALIGN_RIGHT: 2
};
var c_tableBorder = {
    BORDER_VERTICAL_LEFT: 0,
    BORDER_HORIZONTAL_TOP: 1,
    BORDER_VERTICAL_RIGHT: 2,
    BORDER_HORIZONTAL_BOTTOM: 3,
    BORDER_VERTICAL_CENTER: 4,
    BORDER_HORIZONTAL_CENTER: 5,
    BORDER_INNER: 6,
    BORDER_OUTER: 7,
    BORDER_ALL: 8,
    BORDER_NONE: 9,
    BORDER_ALL_TABLE: 10,
    BORDER_NONE_TABLE: 11,
    BORDER_INNER_TABLE: 12,
    BORDER_OUTER_TABLE: 13
};
define(["core", "documenteditor/main/app/view/DocumentHolder"], function () {
    DE.Controllers.DocumentHolder = Backbone.Controller.extend({
        models: [],
        collections: [],
        views: ["DocumentHolder"],
        initialize: function () {},
        onLaunch: function () {
            this.documentHolder = this.createView("DocumentHolder").render();
            this.documentHolder.el.tabIndex = -1;
        },
        setApi: function (api) {
            this.api = api;
        },
        createDelayedElements: function () {
            var diagramEditor = this.getApplication().getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
            if (diagramEditor) {
                diagramEditor.on("internalmessage", _.bind(function (cmp, message) {
                    var command = message.data.command;
                    var data = message.data.data;
                    if (this.api) {
                        (diagramEditor.isEditMode()) ? this.api.asc_editChartDrawingObject(data) : this.api.asc_addChartDrawingObject(data);
                    }
                },
                this));
                diagramEditor.on("hide", _.bind(function (cmp, message) {
                    this.documentHolder.fireEvent("editcomplete", this.documentHolder);
                    if (this.api) {
                        this.api.asc_enableKeyEvents(true);
                    }
                },
                this));
            }
        }
    });
});