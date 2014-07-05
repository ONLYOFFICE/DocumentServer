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
 Ext.define("PE.view.DocumentStatusInfo", {
    extend: "Ext.container.Container",
    alias: "widget.documentstatusinfo",
    requires: ["Ext.form.field.Number", "Ext.button.Button", "Ext.form.Label", "Ext.toolbar.Spacer", "Ext.util.Cookies"],
    uses: ["Ext.tip.ToolTip", "Ext.menu.Menu", "Common.view.Participants"],
    layout: {
        type: "hbox",
        align: "middle"
    },
    config: {
        caption: ""
    },
    cls: "pe-documentstatusinfo",
    height: 27,
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig);
        this.addEvents("editcomplete");
        var txtPages = Ext.widget("label", {
            id: "status-label-pages",
            text: Ext.String.format(me.pageIndexText, 0, 0),
            cls: "statusinfo-pages",
            style: "cursor: pointer;margin:0 40px;",
            listeners: {
                afterrender: function (ct) {
                    ct.getEl().on("mousedown", onShowPageMenu, me);
                }
            }
        });
        var txtCaption = Ext.widget("label", {
            id: "status-label-caption",
            text: this.getCaption(),
            cls: "statusinfo-caption",
            height: 14
        });
        var txtZoom = Ext.widget("label", {
            id: "status-label-zoom",
            text: Ext.String.format(me.zoomText, 0),
            cls: "statusinfo-pages",
            style: "cursor: pointer; white-space:nowrap; text-align: center; margin: 0 5px;",
            listeners: {
                afterrender: Ext.bind(function (ct) {
                    ct.getEl().on("mousedown", onShowZoomMenu, this);
                    ct.getEl().set({
                        "data-qtip": me.tipZoomFactor,
                        "data-qalign": "bl-tl?"
                    });
                    ct.setWidth(Ext.util.TextMetrics.measure(ct.getEl(), Ext.String.format(me.zoomText, 999)).width);
                },
                this)
            }
        });
        var btnFitToPage = Ext.widget("button", {
            id: "status-button-fit-page",
            cls: "asc-statusbar-icon-btn",
            iconCls: "asc-statusbar-btn btn-fittopage",
            enableToggle: true,
            listeners: {
                toggle: function (btn, pressed) {
                    if (me.api) {
                        if (pressed) {
                            me.api.zoomFitToPage();
                        } else {
                            me.api.zoomCustomMode();
                        }
                    }
                    btnFitToWidth.toggle(false, true);
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.tipFitPage,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        var btnFitToWidth = Ext.widget("button", {
            id: "status-button-fit-width",
            cls: "asc-statusbar-icon-btn",
            iconCls: "asc-statusbar-btn btn-fittowidth",
            enableToggle: true,
            style: "margin: 0 20px 0 5px;",
            listeners: {
                toggle: function (btn, pressed) {
                    if (me.api) {
                        if (pressed) {
                            me.api.zoomFitToWidth();
                        } else {
                            me.api.zoomCustomMode();
                        }
                    }
                    btnFitToPage.toggle(false, true);
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.tipFitWidth,
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        var btnZoomIn = Ext.widget("button", {
            id: "status-button-zoom-in",
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-statusbar-btn btn-zoomin",
            style: "margin-right:40px",
            listeners: {
                click: function () {
                    if (me.api) {
                        me.api.zoomIn();
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.tipZoomIn + " (Ctrl++)",
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        var btnZoomOut = Ext.widget("button", {
            id: "status-button-zoom-out",
            cls: "asc-btn-zoom asc-statusbar-icon-btn",
            iconCls: "asc-statusbar-btn btn-zoomout",
            listeners: {
                click: function () {
                    if (me.api) {
                        me.api.zoomOut();
                    }
                },
                render: function (obj) {
                    obj.getEl().set({
                        "data-qtip": me.tipZoomOut + " (Ctrl+-)",
                        "data-qalign": "bl-tl?"
                    });
                }
            }
        });
        this.userPanel = Ext.widget("statusinfoparticipants", {
            userIconCls: "pe-icon-statusinfo-users"
        });
        this.fieldPageNumber = Ext.widget("numberfield", {
            id: "status-field-page",
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
                            var page = me.fieldPageNumber.getValue();
                            if (Ext.isNumber(page)) {
                                if (page > me.fieldPageNumber.maxValue) {
                                    page = me.fieldPageNumber.maxValue;
                                }
                                if (page < me.fieldPageNumber.minValue) {
                                    page = me.fieldPageNumber.minValue;
                                }
                                me.fieldPageNumber.setValue(page);
                                me.fieldPageNumber.selectText();
                                me.api.goToPage(page - 1);
                            }
                        }
                    }
                }
            }
        });
        var onShowPageMenu = function () {
            this.menuGoToPage.show();
            this.menuGoToPage.showBy(txtPages, "bl-tl", [0, -10]);
        };
        var onShowZoomMenu = function () {
            me.menuZoomTo.show();
            me.menuZoomTo.showBy(txtZoom, "b-t", [0, -10]);
        };
        var onZoomChange = function (percent, type) {
            btnFitToPage.toggle(type == 2, true);
            btnFitToWidth.toggle(type == 1, true);
            txtZoom.setText(Ext.String.format(me.zoomText, percent));
            txtZoom.zf = percent;
            me.doLayout();
        };
        var onCountPages = function (count) {
            if (me.api) {
                txtPages.setText(Ext.String.format(me.pageIndexText, me.api.getCurrentPage() + 1, count));
            }
            me.fieldPageNumber.setMinValue((count > 0) ? 1 : 0);
            me.fieldPageNumber.setMaxValue(count);
        };
        var onCurrentPage = function (number) {
            if (me.api) {
                txtPages.setText(Ext.String.format(me.pageIndexText, number + 1, me.api.getCountPages()));
            }
            me.fieldPageNumber.setValue(number + 1);
        };
        this.setApi = function (o) {
            this.api = o;
            if (this.api) {
                this.api.asc_registerCallback("asc_onZoomChange", Ext.bind(onZoomChange, this));
                this.api.asc_registerCallback("asc_onCountPages", Ext.bind(onCountPages, this));
                this.api.asc_registerCallback("asc_onCurrentPage", Ext.bind(onCurrentPage, this));
                this.userPanel.setApi(this.api);
            }
            return this;
        };
        this.items = [txtPages, me.userPanel, {
            xtype: "container",
            flex: 1,
            layout: {
                type: "hbox",
                pack: "center"
            },
            items: [txtCaption]
        },
        btnFitToPage, btnFitToWidth, btnZoomOut, txtZoom, btnZoomIn];
        me.callParent(arguments);
    },
    applyCaption: function (value) {
        var c = Ext.get("status-label-caption");
        if (c) {
            Ext.DomHelper.overwrite(c, value);
        }
        this.doLayout();
        return value;
    },
    createDelayedElements: function () {
        var me = this;
        var txtGoToPage = Ext.widget("label", {
            id: "status-label-page",
            text: me.goToPageText
        });
        var defaultPadding = 20;
        var defaultContainerOffset = 7;
        this.menuGoToPage = Ext.widget("menu", {
            id: "status-menu-page",
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
                me.fieldPageNumber],
                listeners: {
                    afterrender: function (ct) {
                        var textWidth = txtGoToPage.getWidth();
                        ct.getEl().setWidth(defaultContainerOffset + 2 * defaultPadding + textWidth + me.fieldPageNumber.getWidth());
                    }
                }
            }],
            listeners: {
                show: function (ct) {
                    if (me.api) {
                        me.fieldPageNumber.setValue(me.api.getCurrentPage() + 1);
                        me.fieldPageNumber.focus(true, 300);
                    }
                }
            }
        });
        function onItemClick(item) {
            if (me.api) {
                me.api.zoom(item.zf);
            }
        }
        this.menuZoomTo = Ext.widget("menu", {
            plain: true,
            bodyCls: "status-zoom-menu",
            minWidth: 100,
            defaults: {
                listeners: {
                    click: onItemClick
                }
            },
            listeners: {
                hide: function () {
                    me.fireEvent("editcomplete", me);
                }
            },
            items: [{
                text: "50%",
                zf: 50
            },
            {
                text: "75%",
                zf: 75
            },
            {
                text: "100%",
                zf: 100
            },
            {
                text: "125%",
                zf: 125
            },
            {
                text: "150%",
                zf: 150
            },
            {
                text: "175%",
                zf: 175
            },
            {
                text: "200%",
                zf: 200
            }]
        });
    },
    setMode: function (m) {
        this.userPanel.setMode(m);
    },
    zoomText: "Zoom {0}%",
    goToPageText: "Go to Slide",
    pageIndexText: "Slide {0} of {1}",
    tipFitPage: "Fit Slide",
    tipFitWidth: "Fit Width",
    tipZoomIn: "Zoom In",
    tipZoomOut: "Zoom Out",
    tipZoomFactor: "Magnification"
});