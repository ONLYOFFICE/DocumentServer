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
 define(["core", "common/main/lib/view/Header", "presentationeditor/main/app/view/DocumentPreview", "presentationeditor/main/app/view/Viewport"], function (Viewport) {
    PE.Controllers.Viewport = Backbone.Controller.extend({
        models: [],
        collections: [],
        views: ["Viewport", "Common.Views.Header", "DocumentPreview"],
        initialize: function () {
            this.addListeners({
                "Viewport": {}
            });
        },
        setApi: function (api) {
            this.api = api;
        },
        onLaunch: function () {
            this.viewport = this.createView("Viewport").render();
            this.header = this.createView("Common.Views.Header", {
                headerCaption: "Presentation Editor"
            }).render();
            this.docPreview = this.createView("DocumentPreview", {}).render();
            Common.NotificationCenter.on("layout:changed", _.bind(this.onLayoutChanged, this));
            $(window).on("resize", _.bind(this.onWindowResize, this));
            this.viewport.hlayout.on("layout:resizedrag", function () {
                this.api.Resize();
            },
            this);
        },
        onLayoutChanged: function (area) {
            switch (area) {
            default:
                this.viewport.vlayout.doLayout();
            case "rightmenu":
                this.viewport.hlayout.doLayout();
                break;
            case "leftmenu":
                var panel = this.viewport.hlayout.items[0];
                if (panel.resize.el) {
                    panel.el.width() > 40 ? panel.resize.el.show() : panel.resize.el.hide();
                }
                this.viewport.hlayout.doLayout();
                break;
            case "header":
                case "toolbar":
                case "status":
                this.viewport.vlayout.doLayout();
                break;
            }
            this.api.Resize();
        },
        onWindowResize: function (e) {
            this.onLayoutChanged("window");
        }
    });
});