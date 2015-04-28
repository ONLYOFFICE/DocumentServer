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
 Ext.define("PE.controller.toolbar.View", {
    extend: "Ext.app.Controller",
    config: {
        refs: {
            viewToolbar: "viewtoolbar",
            fullscreenButton: "#id-tb-btn-fullscreen",
            shareButton: "#id-tb-btn-view-share",
            btnPrevSlide: "#id-tb-btn-prev-slide",
            btnNextSlide: "#id-tb-btn-next-slide",
            btnPlaySlide: "#id-tb-btn-play",
            overlayContainer: "#id-preview-overlay-container",
            doneButton: "#id-tb-btn-view-done"
        },
        control: {
            fullscreenButton: {
                tap: "onTapFullscreenButton"
            },
            shareButton: {
                tap: "onTapShareButton"
            },
            btnPrevSlide: {
                tap: "onPrevSlide"
            },
            btnNextSlide: {
                tap: "onNextSlide"
            },
            btnPlaySlide: {
                tap: "onPlaySlide"
            },
            doneButton: {
                tap: "onTapDoneButton"
            }
        },
        isFullscreen: false
    },
    launch: function () {
        this.callParent(arguments);
        var overlayContainer = this.getOverlayContainer();
        if (overlayContainer) {
            overlayContainer.element.on("singletap", this.onSingleTapDocument, this);
            overlayContainer.element.on("touchstart", this.onTouchStartDocument, this);
            overlayContainer.element.on("touchend", this.onTouchEndDocument, this);
        }
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
    },
    initControl: function () {
        this._startX = 0;
        this.callParent(arguments);
    },
    initApi: function () {},
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onEndDemonstration", Ext.bind(this.onApiEndDemonstration, this));
            this.api.asc_registerCallback("asc_onDemonstrationSlideChanged", Ext.bind(this.onApiDemonstrationSlideChanged, this));
            this.api.DemonstrationEndShowMessage(this.txtFinalMessage);
        }
    },
    loadConfig: function (data) {
        var doneButton = this.getDoneButton();
        if (doneButton && data && data.config && data.config.canBackToFolder === true) {
            doneButton.show();
        }
    },
    onTapDoneButton: function () {
        Common.Gateway.goBack();
    },
    onTapFullscreenButton: function (btn) {
        var viewToolbar = this.getViewToolbar();
        if (viewToolbar) {
            this.setIsFullscreen(!this.getIsFullscreen());
            if (this.getIsFullscreen()) {
                btn.addCls("x-button-pressing");
                viewToolbar.setStyle({
                    position: "absolute",
                    left: 0,
                    top: 0,
                    right: 0,
                    opacity: 0.9,
                    "z-index": 7
                });
                this.onSingleTapDocument();
            } else {
                viewToolbar.setStyle({
                    position: "initial",
                    opacity: 1
                });
                viewToolbar.setDocked("top");
            }
        }
    },
    onTapShareButton: function () {
        this.api && this.api.asc_Print();
        Common.component.Analytics.trackEvent("ToolBar View", "Share");
    },
    onSingleTapDocument: function () {
        if (this.getIsFullscreen()) {
            var viewToolbar = this.getViewToolbar();
            if (viewToolbar) {
                if (viewToolbar.isHidden()) {
                    viewToolbar.show({
                        preserveEndState: true,
                        easing: "ease-in",
                        from: {
                            opacity: 0
                        },
                        to: {
                            opacity: 0.9
                        }
                    });
                } else {
                    viewToolbar.hide({
                        easing: "ease-out",
                        from: {
                            opacity: 0.9
                        },
                        to: {
                            opacity: 0
                        }
                    });
                }
            }
        }
    },
    onTouchStartDocument: function (event, node, options, eOpts) {
        this._startX = event.pageX;
    },
    onTouchEndDocument: function (event, node, options, eOpts) {
        if (event.pageX - this._startX < -50) {
            this.api.DemonstrationNextSlide();
        } else {
            if (event.pageX - this._startX > 50) {
                this.api.DemonstrationPrevSlide();
            }
        }
    },
    onPrevSlide: function () {
        if (this.api) {
            this.api.DemonstrationPrevSlide();
        }
    },
    onNextSlide: function () {
        if (this.api) {
            this.api.DemonstrationNextSlide();
        }
    },
    onPlaySlide: function () {
        var btnPlay = this.getBtnPlaySlide();
        if (this.api && btnPlay) {
            if (btnPlay.getIconCls() == "play") {
                this.api.DemonstrationPlay();
                btnPlay.setIconCls("pause");
            } else {
                this.api.DemonstrationPause();
                btnPlay.setIconCls("play");
            }
        }
    },
    onApiEndDemonstration: function () {
        if (this.api) {
            this.api.StartDemonstration("id-presentation-preview", 0);
        }
    },
    onApiDemonstrationSlideChanged: function (slideNum) {
        if (this.api && Ext.isNumber(slideNum)) {
            var count = this.api.getCountPages(),
            btnNextSlide = this.getBtnNextSlide(),
            btnPrevSlide = this.getBtnPrevSlide();
            if (btnPrevSlide) {
                btnPrevSlide.setDisabled(slideNum <= 0);
            }
            if (btnNextSlide) {
                btnNextSlide.setDisabled(slideNum >= count - 1);
            }
        }
    },
    txtFinalMessage: "The end of slide preview"
});