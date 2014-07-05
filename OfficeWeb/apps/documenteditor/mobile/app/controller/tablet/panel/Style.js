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
 Ext.define("DE.controller.tablet.panel.Style", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            listStylePanel: "liststylepanel",
            navigateView: "#id-liststyle-navigate",
            listStyleView: "#id-liststyle-root",
            bulletsListView: "#id-liststyle-bullets",
            numberingListView: "#id-liststyle-numbering",
            outlineListView: "#id-liststyle-outline",
            bulletsList: "#id-liststyle-bullets dataview",
            numberingList: "#id-liststyle-numbering dataview",
            outlineList: "#id-liststyle-outline dataview"
        },
        control: {
            listStylePanel: {
                show: "onListStylePanelShow",
                hide: "onListStylePanelHide"
            },
            navigateView: {
                push: "onListStyleViewPush",
                pop: "onListStyleViewPop",
                back: "onListStyleViewBack"
            },
            listStyleView: {
                itemsingletap: "onListStyleItemTap"
            },
            bulletsList: {
                itemsingletap: "onCommonListItemTap"
            },
            numberingList: {
                itemsingletap: "onCommonListItemTap"
            },
            outlineList: {
                itemsingletap: "onCommonListItemTap"
            }
        },
        handleApiEvent: false
    },
    init: function () {},
    launch: function () {},
    setApi: function (o) {
        this.api = o;
    },
    onListStylePanelShow: function (cmp) {
        this.setHandleApiEvent(true);
        this.api && this.api.UpdateInterfaceState();
    },
    onListStylePanelHide: function (cmp) {
        this.setHandleApiEvent(false);
        var navigateView = this.getNavigateView();
        if (navigateView) {
            if (Ext.isDefined(navigateView.getLayout().getAnimation().getInAnimation)) {
                navigateView.getLayout().getAnimation().getInAnimation().stop();
            }
            if (Ext.isDefined(navigateView.getLayout().getAnimation().getOutAnimation)) {
                navigateView.getLayout().getAnimation().getOutAnimation().stop();
            }
            navigateView.reset();
            var activeItem = navigateView.getActiveItem(),
            panelHeight = this.getHeightById(activeItem && activeItem.id);
            cmp.setHeight(panelHeight);
        }
    },
    onListStyleItemTap: function (cmp, index, target, record) {
        var navigateView = this.getNavigateView(),
        cmdId = record.get("id");
        if (!Ext.isEmpty(cmdId)) {
            if (cmdId == "id-list-indent-increment") {
                this.onIncrementIndentButton();
            } else {
                if (cmdId == "id-list-indent-decrement") {
                    this.onDecrementIndentButton();
                }
            }
        }
        if (navigateView) {
            var childId = record.get("child");
            if (!Ext.isEmpty(childId)) {
                var childCmp = Ext.getCmp(childId);
                if (childCmp) {
                    navigateView.push(childCmp);
                }
            }
        }
    },
    getHeightById: function (id) {
        switch (id) {
        case "id-liststyle-bullets":
            case "id-liststyle-numbering":
            return 225;
        case "id-liststyle-outline":
            return 150;
        default:
            case "id-liststyle-root":
            return 328;
        }
    },
    onListStyleViewPush: function (cmp, view) {
        var parentCmp = cmp.getParent();
        if (parentCmp) {
            parentCmp.setHeight(this.getHeightById(view.id));
        }
    },
    onListStyleViewPop: function (cmp, view) {},
    onListStyleViewBack: function (cmp) {
        var parentCmp = cmp.getParent(),
        activeItem = cmp.getActiveItem();
        if (parentCmp && activeItem) {
            parentCmp.setHeight(this.getHeightById(activeItem && activeItem.id));
        }
    },
    onCommonListItemTap: function (view, index, target, record) {
        this.api && this.api.put_ListType(parseInt(record.get("type")), parseInt(record.get("subtype")));
        Common.component.Analytics.trackEvent("ToolBar", "List Type");
    },
    onIncrementIndentButton: function () {
        this.api && this.api.IncreaseIndent();
        Common.component.Analytics.trackEvent("ToolBar", "Indent");
    },
    onDecrementIndentButton: function () {
        this.api && this.api.DecreaseIndent();
        Common.component.Analytics.trackEvent("ToolBar", "Indent");
    }
});