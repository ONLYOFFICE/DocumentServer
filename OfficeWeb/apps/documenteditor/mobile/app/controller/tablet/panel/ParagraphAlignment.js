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
 Ext.define("DE.controller.tablet.panel.ParagraphAlignment", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            paraAlignPanel: "paragraphalignmentpanel",
            paraAlignsToggle: "#id-toggle-paragraphalignment",
            paragraphAlignmentButton: "#id-tb-btn-align",
            paraAlignLeft: "#id-btn-paragraphalignment-left",
            paraAlignCenter: "#id-btn-paragraphalignment-center",
            paraAlignRight: "#id-btn-paragraphalignment-right",
            paraAlignFill: "#id-btn-paragraphalignment-fill"
        },
        control: {
            paraAlignPanel: {
                show: "onParaAlignPanelShow",
                hide: "onParaAlignPanelHide"
            },
            paraAlignLeft: {
                tap: "onParaAlignLeftTap"
            },
            paraAlignCenter: {
                tap: "onParaAlignCenterTap"
            },
            paraAlignRight: {
                tap: "onParaAlignRightTap"
            },
            paraAlignFill: {
                tap: "onParaAlignFillTap"
            }
        },
        handleApiEvent: false
    },
    init: function () {},
    launch: function () {},
    onParaAlignPanelShow: function (cmp) {
        this.setHandleApiEvent(true);
        this.api && this.api.UpdateInterfaceState();
    },
    onParaAlignPanelHide: function (cmp) {
        this.setHandleApiEvent(false);
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onPrAlign", Ext.bind(this.onApiParagraphAlign, this));
        }
    },
    onParaAlignLeftTap: function (btn) {
        if (this.api) {
            this.api.put_PrAlign(1);
            Common.component.Analytics.trackEvent("ToolBar", "Align");
        }
    },
    onParaAlignCenterTap: function (btn) {
        if (this.api) {
            this.api.put_PrAlign(2);
            Common.component.Analytics.trackEvent("ToolBar", "Align");
        }
    },
    onParaAlignRightTap: function (btn) {
        if (this.api) {
            this.api.put_PrAlign(0);
            Common.component.Analytics.trackEvent("ToolBar", "Align");
        }
    },
    onParaAlignFillTap: function (btn) {
        if (this.api) {
            this.api.put_PrAlign(3);
            Common.component.Analytics.trackEvent("ToolBar", "Align");
        }
    },
    toggleSegmentedButton: function (btn) {
        var toggler = this.getParaAlignsToggle();
        if (toggler) {
            var pressedButtonsNew = [];
            if (btn) {
                pressedButtonsNew.push(btn);
            }
            toggler.setPressedButtons(pressedButtonsNew);
        }
    },
    onApiParagraphAlign: function (v) {
        var paragraphAlignmentButton = this.getParagraphAlignmentButton();
        if (paragraphAlignmentButton && Ext.isDefined(v)) {
            switch (v) {
            case 0:
                paragraphAlignmentButton.setIconCls("align-right");
                break;
            case 1:
                paragraphAlignmentButton.setIconCls("align-left");
                break;
            case 2:
                paragraphAlignmentButton.setIconCls("align-center");
                break;
            default:
                case 3:
                paragraphAlignmentButton.setIconCls("align-fill");
            }
        }
        if (this.getHandleApiEvent()) {
            if (!Ext.isDefined(v)) {
                this.toggleSegmentedButton();
                return;
            }
            switch (v) {
            case 0:
                this.toggleSegmentedButton(this.getParaAlignRight());
                break;
            case 1:
                this.toggleSegmentedButton(this.getParaAlignLeft());
                break;
            case 2:
                this.toggleSegmentedButton(this.getParaAlignCenter());
                break;
            default:
                case 3:
                this.toggleSegmentedButton(this.getParaAlignFill());
            }
        }
    }
});