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
 Ext.define("PE.view.DocumentPreview", {
    extend: "Ext.container.Container",
    alias: "widget.pedocumentpreview",
    layout: "fit",
    shadow: false,
    floating: true,
    toFrontOnShow: true,
    hidden: true,
    modal: true,
    requires: ["Ext.container.Container", "Ext.button.Button", "Ext.form.Label"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    listeners: {
        afterrender: function () {
            var parent = this.floatParent;
            if (Ext.isDefined(parent)) {
                parent.addListener("resize", Ext.bind(this.resizePreview, this));
            }
        },
        hide: function (cmp, eOpts) {
            this.controlsContainer.hide();
            Ext.getCmp("pe-applicationUI").show();
            if (this.api) {
                setTimeout(Ext.bind(function () {
                    this.api.Resize();
                    var tb = Ext.getCmp("toolbar-combo-view-themes");
                    if (tb) {
                        tb.doComponentLayout();
                        tb.fillComboView(tb.dataMenu.picker.getSelectedRec(), true, true);
                        tb.dataMenu.picker.updateScrollPane();
                    }
                },
                this), 50);
            }
            this.fireEvent("editcomplete", this);
        },
        show: function (cmp, eOpts) {
            this.controlsContainer.show();
            this.controlsContainer.setPosition(0, this.getHeight() - this._ControlPanelHeight);
            var span = this.btnPlay.getEl().down(".asc-slide-preview-btn");
            if (span.hasCls("btn-play")) {
                span.removeCls("btn-play");
                span.addCls("btn-pause");
                this.btnPlay.getEl().set({
                    "data-qtip": this.txtPause,
                    "data-qalign": "bl-tl?"
                });
            }
            this.fireEvent("editcomplete", this);
        }
    },
    initComponent: function () {
        var me = this;
        me.btnPrev = Ext.create("Ext.button.Button", {
            iconCls: "asc-slide-preview-btn btn-prev",
            listeners: {
                click: function () {
                    if (me.api) {
                        me.api.DemonstrationPrevSlide();
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.txtPrev,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        me.btnNext = Ext.create("Ext.button.Button", {
            iconCls: "asc-slide-preview-btn btn-next",
            listeners: {
                click: function () {
                    if (me.api) {
                        me.api.DemonstrationNextSlide();
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.txtNext,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        me.btnClose = Ext.create("Ext.button.Button", {
            iconCls: "asc-slide-preview-btn btn-close",
            listeners: {
                click: function () {
                    if (me.api) {
                        me.api.EndDemonstration();
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.txtClose,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        me.btnPlay = Ext.create("Ext.button.Button", {
            iconCls: "asc-slide-preview-btn btn-play",
            listeners: {
                click: function () {
                    var span = me.btnPlay.getEl().down(".asc-slide-preview-btn");
                    if (span.hasCls("btn-play")) {
                        span.removeCls("btn-play");
                        span.addCls("btn-pause");
                        me.btnPlay.getEl().set({
                            "data-qtip": me.txtPause,
                            "data-qalign": "bl-tl?"
                        });
                        if (me.api) {
                            me.api.DemonstrationPlay();
                        }
                    } else {
                        if (span.hasCls("btn-pause")) {
                            span.removeCls("btn-pause");
                            span.addCls("btn-play");
                            me.btnPlay.getEl().set({
                                "data-qtip": me.txtPlay,
                                "data-qalign": "bl-tl?"
                            });
                            if (me.api) {
                                me.api.DemonstrationPause();
                            }
                        }
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.txtPlay,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        me.txtPages = Ext.widget("label", {
            cls: "preview-slides",
            listeners: {
                afterrender: Ext.bind(function (ct) {
                    ct.getEl().on("mousedown", onShowPageMenu, this);
                },
                this)
            }
        });
        var txtGoToPage = Ext.widget("label", {
            text: me.goToSlideText
        });
        var fieldPageNumber = Ext.widget("numberfield", {
            id: "preview-field-slide",
            width: 40,
            minValue: 1,
            maxValue: 10000,
            value: 1,
            allowDecimals: false,
            hideTrigger: true,
            keyNavEnabled: false,
            mouseWheelEnabled: false,
            enableKeyEvents: true,
            selectOnFocus: true,
            listeners: {
                specialkey: function (field, event, eOpts) {
                    if (event.getKey() == event.ENTER) {
                        if (me.api) {
                            var page = fieldPageNumber.getValue();
                            if (Ext.isNumber(page)) {
                                if (page > fieldPageNumber.maxValue) {
                                    page = fieldPageNumber.maxValue;
                                }
                                if (page < fieldPageNumber.minValue) {
                                    page = fieldPageNumber.minValue;
                                }
                                fieldPageNumber.setValue(page);
                                fieldPageNumber.selectText();
                                me.api.DemonstrationGoToSlide(page - 1);
                            }
                        }
                    }
                }
            }
        });
        var defaultPadding = 20;
        var defaultContainerOffset = 7;
        me.menuGoToPage = Ext.widget("menu", {
            id: "preview-menu-slide",
            autoHeight: true,
            autoWidth: true,
            plain: true,
            items: [{
                xtype: "container",
                cls: "pe-documentstatusinfo-menu-inner",
                layout: {
                    type: "hbox",
                    align: "middle",
                    padding: defaultPadding / 2 + "px " + defaultPadding + "px"
                },
                items: [txtGoToPage, {
                    xtype: "tbspacer",
                    width: defaultContainerOffset
                },
                fieldPageNumber],
                listeners: {
                    afterrender: function (ct) {
                        var textWidth = txtGoToPage.getWidth();
                        ct.getEl().setWidth(defaultContainerOffset + 2 * defaultPadding + textWidth + fieldPageNumber.getWidth());
                    }
                }
            }],
            listeners: {
                show: function (ct) {
                    if (me.api) {
                        fieldPageNumber.setValue(me.api.getCurrentPage() + 1);
                        fieldPageNumber.focus(true, 300);
                    }
                }
            }
        });
        var onShowPageMenu = function () {
            me.menuGoToPage.show();
            me.menuGoToPage.showBy(me.txtPages, "bl-tl", [0, -10]);
        };
        me.onCountSlides = function (count) {
            fieldPageNumber.setMinValue((count > 0) ? 1 : 0);
            fieldPageNumber.setMaxValue(count);
        };
        me.onDemonstrationSlideChanged = function (slideNum) {
            if (me.api && Ext.isNumber(slideNum)) {
                var count = me.api.getCountPages();
                me.txtPages.setText(Ext.String.format(me.slideIndexText, slideNum + 1, count));
                me.btnPrev.setDisabled(slideNum <= 0);
                me.btnNext.setDisabled(slideNum >= count - 1);
                fieldPageNumber.setValue(slideNum + 1);
                var w = me.txtPages.getWidth();
                if (me._PagesPanelSize !== w) {
                    me.controlsContainer.setWidth(me._ControlPanelWidth + w);
                    me._PagesPanelSize = w;
                }
                me.controlsContainer.doLayout();
            }
        };
        me.items = [{
            xtype: "container",
            id: "presentation-preview",
            listeners: {
                resize: function (Component, adjWidth, adjHeight, eOpts) {
                    if (this.api) {
                        setTimeout(Ext.bind(function () {
                            this.api.Resize();
                        },
                        this), 50);
                    }
                },
                scope: this
            }
        }];
        this.controlsContainer = Ext.create("Ext.container.Container", {
            id: "preview-controls-panel",
            cls: "pe-documentpreview",
            floating: true,
            shadow: false,
            toFrontOnShow: true,
            layout: {
                type: "hbox",
                align: "middle"
            },
            height: me._ControlPanelHeight = 35,
            width: me._ControlPanelWidth = 122,
            items: [{
                xtype: "tbspacer",
                width: 3
            },
            me.btnPrev, me.btnPlay, me.btnNext, {
                xtype: "tbseparator",
                width: 2,
                height: "100%",
                style: "padding-top:8px; padding-bottom:8px;",
                html: '<div style="width: 100%; height: 100%; border-right: 1px solid #DADADA"></div>'
            },
            {
                xtype: "tbspacer",
                width: 8
            },
            me.txtPages, {
                xtype: "tbspacer",
                width: 8
            },
            {
                xtype: "tbseparator",
                width: 6,
                height: "100%",
                style: "padding-top:8px; padding-bottom:8px;",
                html: '<div style="width: 100%; height: 100%; border-left: 1px solid #DADADA"></div>'
            },
            me.btnClose]
        });
        this.addEvents("editcomplete");
        this.callParent(arguments);
    },
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onCountPages", Ext.bind(this.onCountSlides, this));
            this.api.asc_registerCallback("asc_onEndDemonstration", Ext.bind(this.onEndDemonstration, this));
            this.api.asc_registerCallback("asc_onDemonstrationSlideChanged", Ext.bind(this.onDemonstrationSlideChanged, this));
            this.api.DemonstrationEndShowMessage(this.txtFinalMessage);
        }
        return this;
    },
    resizePreview: function (Component, adjWidth, adjHeight, eOpts) {
        this.setSize(adjWidth, adjHeight);
        this.controlsContainer.setPosition(0, adjHeight - this._ControlPanelHeight);
        if (this.menuGoToPage.isVisible()) {
            this.menuGoToPage.showBy(this.txtPages, "bl-tl", [0, -10]);
        }
    },
    onEndDemonstration: function () {
        this.hide();
    },
    txtPrev: "Previous Slide",
    txtNext: "Next Slide",
    txtClose: "Close Preview",
    goToSlideText: "Go to Slide",
    slideIndexText: "Slide {0} of {1}",
    txtPlay: "Start Presentation",
    txtPause: "Pause Presentation",
    txtFinalMessage: "The end of slide preview. Click to exit."
});