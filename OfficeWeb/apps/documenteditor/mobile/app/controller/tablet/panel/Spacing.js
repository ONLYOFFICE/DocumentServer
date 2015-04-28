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
 Ext.define("DE.controller.tablet.panel.Spacing", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            spacingPanel: "spacingpanel",
            navigateView: "#id-spacing-navigate",
            spacingListView: "#id-spacing-root",
            spacingValueListView: "#id-spacing-linespacing"
        },
        control: {
            spacingPanel: {
                show: "onSpacingPanelShow",
                hide: "onSpacingPanelHide"
            },
            navigateView: {
                push: "onSpacingListViewPush",
                pop: "onSpacingListViewPop",
                back: "onSpacingListViewBack"
            },
            spacingListView: {
                itemsingletap: "onSpacingListItemTap"
            },
            spacingValueListView: {
                itemsingletap: "onSpacingValueListItemTap"
            }
        },
        handleApiEvent: false
    },
    init: function () {},
    launch: function () {},
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onParaSpacingLine", Ext.bind(this.onApiLineSpacing, this));
        }
    },
    onSpacingPanelShow: function (cmp) {
        this.setHandleApiEvent(true);
        this.api && this.api.UpdateInterfaceState();
    },
    onSpacingPanelHide: function (cmp) {
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
    onSpacingListItemTap: function (cmp, index, target, record) {
        var navigateView = this.getNavigateView(),
        cmdId = record.get("id");
        if (!Ext.isEmpty(cmdId)) {
            if (cmdId == "id-linespacing-increaseindent") {
                this.api && this.api.IncreaseIndent();
                Common.component.Analytics.trackEvent("ToolBar", "Indent");
            } else {
                if (cmdId == "id-linespacing-decrementindent") {
                    this.api && this.api.DecreaseIndent();
                    Common.component.Analytics.trackEvent("ToolBar", "Indent");
                }
            }
        }
        if (navigateView) {
            var cmpId = record.get("child");
            if (!Ext.isEmpty(cmpId)) {
                var childCmp = Ext.getCmp(cmpId);
                if (childCmp) {
                    navigateView.push(childCmp);
                }
            }
        }
    },
    onSpacingValueListItemTap: function (cmp, index, target, record) {
        var spacingVal = parseFloat(record.get("setting")),
        LINERULE_AUTO = 1;
        this.api && this.api.put_PrLineSpacing(LINERULE_AUTO, spacingVal);
        Common.component.Analytics.trackEvent("ToolBar", "Line Spacing");
    },
    getHeightById: function (id) {
        switch (id) {
        case "id-spacing-linespacing":
            return 360;
        default:
            case "id-spacing-root":
            return 235;
        }
    },
    onSpacingListViewPush: function (cmp, view) {
        var parentCmp = cmp.getParent();
        if (parentCmp) {
            parentCmp.setHeight(this.getHeightById(view.id));
        }
    },
    onSpacingListViewPop: function (cmp, view) {},
    onSpacingListViewBack: function (cmp) {
        var parentCmp = cmp.getParent(),
        activeItem = cmp.getActiveItem();
        if (parentCmp && activeItem) {
            parentCmp.setHeight(this.getHeightById(activeItem && activeItem.id));
        }
    },
    onApiLineSpacing: function (info) {
        if (this.getHandleApiEvent()) {
            if (Ext.isDefined(info)) {
                var spacingValueListView = this.getSpacingValueListView();
                if (spacingValueListView) {
                    if (info.get_Line() === null || info.get_LineRule() === null || info.get_LineRule() != 1) {
                        spacingValueListView.deselectAll();
                        return;
                    }
                    var line = info.get_Line();
                    if (Math.abs(line - 1) < 0.0001) {
                        spacingValueListView.select(0);
                    } else {
                        if (Math.abs(line - 1.15) < 0.0001) {
                            spacingValueListView.select(1);
                        } else {
                            if (Math.abs(line - 1.5) < 0.0001) {
                                spacingValueListView.select(2);
                            } else {
                                if (Math.abs(line - 2) < 0.0001) {
                                    spacingValueListView.select(3);
                                } else {
                                    if (Math.abs(line - 2.5) < 0.0001) {
                                        spacingValueListView.select(4);
                                    } else {
                                        if (Math.abs(line - 3) < 0.0001) {
                                            spacingValueListView.select(5);
                                        } else {
                                            spacingValueListView.deselectAll();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});