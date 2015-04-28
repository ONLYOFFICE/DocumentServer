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
 define(["text!presentationeditor/main/app/template/ParagraphSettingsAdvanced.template", "common/main/lib/view/AdvancedSettingsWindow", "common/main/lib/component/MetricSpinner", "common/main/lib/component/CheckBox", "common/main/lib/component/RadioBox", "common/main/lib/component/ListView"], function (contentTemplate) {
    PE.Views.ParagraphSettingsAdvanced = Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            contentWidth: 320,
            height: 390,
            toggleGroup: "paragraph-adv-settings-group"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle,
                items: [{
                    panelId: "id-adv-paragraph-indents",
                    panelCaption: this.strParagraphIndents
                },
                {
                    panelId: "id-adv-paragraph-font",
                    panelCaption: this.strParagraphFont
                },
                {
                    panelId: "id-adv-paragraph-tabs",
                    panelCaption: this.strTabs
                }],
                contentTemplate: _.template(contentTemplate)({
                    scope: this
                })
            },
            options);
            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
            this._changedProps = null;
            this.checkGroup = 0;
            this._noApply = true;
            this._tabListChanged = false;
            this.spinners = [];
            this.api = this.options.api;
            this._originalProps = new CParagraphProp(this.options.paragraphProps);
        },
        render: function () {
            Common.Views.AdvancedSettingsWindow.prototype.render.call(this);
            var me = this;
            this.numFirstLine = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-first-line"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numFirstLine.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                        this._changedProps.put_Ind(new CParagraphInd());
                    }
                    this._changedProps.get_Ind().put_FirstLine(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.numFirstLine);
            this.numIndentsLeft = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-indent-left"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.numIndentsLeft.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                var numval = field.getNumberValue();
                if (this._changedProps) {
                    if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                        this._changedProps.put_Ind(new CParagraphInd());
                    }
                    this._changedProps.get_Ind().put_Left(Common.Utils.Metric.fnRecalcToMM(numval));
                }
                this.numFirstLine.setMinValue(-numval);
                if (this.numFirstLine.getNumberValue() < -numval) {
                    this.numFirstLine.setValue(-numval);
                }
            },
            this));
            this.spinners.push(this.numIndentsLeft);
            this.numIndentsRight = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-indent-right"),
                step: 0.1,
                width: 85,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.numIndentsRight.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    if (this._changedProps.get_Ind() === null || this._changedProps.get_Ind() === undefined) {
                        this._changedProps.put_Ind(new CParagraphInd());
                    }
                    this._changedProps.get_Ind().put_Right(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
            },
            this));
            this.spinners.push(this.numIndentsRight);
            this.chStrike = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-strike"),
                labelText: this.strStrike
            });
            this.chStrike.on("change", _.bind(this.onStrikeChange, this));
            this.chDoubleStrike = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-double-strike"),
                labelText: this.strDoubleStrike
            });
            this.chDoubleStrike.on("change", _.bind(this.onDoubleStrikeChange, this));
            this.chSuperscript = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-superscript"),
                labelText: this.strSuperscript
            });
            this.chSuperscript.on("change", _.bind(this.onSuperscriptChange, this));
            this.chSubscript = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-subscript"),
                labelText: this.strSubscript
            });
            this.chSubscript.on("change", _.bind(this.onSubscriptChange, this));
            this.chSmallCaps = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-small-caps"),
                labelText: this.strSmallCaps
            });
            this.chSmallCaps.on("change", _.bind(this.onSmallCapsChange, this));
            this.chAllCaps = new Common.UI.CheckBox({
                el: $("#paragraphadv-checkbox-all-caps"),
                labelText: this.strAllCaps
            });
            this.chAllCaps.on("change", _.bind(this.onAllCapsChange, this));
            this.numSpacing = new Common.UI.MetricSpinner({
                el: $("#paragraphadv-spin-spacing"),
                step: 0.01,
                width: 100,
                defaultUnit: "cm",
                defaultValue: 0,
                value: "0 cm",
                maxValue: 55.87,
                minValue: -55.87
            });
            this.numSpacing.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_TextSpacing(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                }
                if (this.api && !this._noApply) {
                    var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                    properties.put_TextSpacing(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()));
                    this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
                }
            },
            this));
            this.spinners.push(this.numSpacing);
            this.numTab = new Common.UI.MetricSpinner({
                el: $("#paraadv-spin-tab"),
                step: 0.1,
                width: 180,
                defaultUnit: "cm",
                value: "1.25 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.spinners.push(this.numTab);
            this.numDefaultTab = new Common.UI.MetricSpinner({
                el: $("#paraadv-spin-default-tab"),
                step: 0.1,
                width: 107,
                defaultUnit: "cm",
                value: "1.25 cm",
                maxValue: 55.87,
                minValue: 0
            });
            this.numDefaultTab.on("change", _.bind(function (field, newValue, oldValue, eOpts) {
                if (this._changedProps) {
                    this._changedProps.put_DefaultTab(parseFloat(Common.Utils.Metric.fnRecalcToMM(field.getNumberValue()).toFixed(1)));
                }
            },
            this));
            this.spinners.push(this.numDefaultTab);
            this.tabList = new Common.UI.ListView({
                el: $("#paraadv-list-tabs"),
                emptyText: this.noTabs,
                store: new Common.UI.DataViewStore()
            });
            this.tabList.store.comparator = function (rec) {
                return rec.get("tabPos");
            };
            this.tabList.on("item:select", _.bind(this.onSelectTab, this));
            var storechanged = function () {
                if (!me._noApply) {
                    me._tabListChanged = true;
                }
            };
            this.listenTo(this.tabList.store, "add", storechanged);
            this.listenTo(this.tabList.store, "remove", storechanged);
            this.listenTo(this.tabList.store, "reset", storechanged);
            this.radioLeft = new Common.UI.RadioBox({
                el: $("#paragraphadv-radio-left"),
                labelText: this.textTabLeft,
                name: "asc-radio-tab",
                checked: true
            });
            this.radioCenter = new Common.UI.RadioBox({
                el: $("#paragraphadv-radio-center"),
                labelText: this.textTabCenter,
                name: "asc-radio-tab"
            });
            this.radioRight = new Common.UI.RadioBox({
                el: $("#paragraphadv-radio-right"),
                labelText: this.textTabRight,
                name: "asc-radio-tab"
            });
            this.btnAddTab = new Common.UI.Button({
                el: $("#paraadv-button-add-tab")
            });
            this.btnAddTab.on("click", _.bind(this.addTab, this));
            this.btnRemoveTab = new Common.UI.Button({
                el: $("#paraadv-button-remove-tab")
            });
            this.btnRemoveTab.on("click", _.bind(this.removeTab, this));
            this.btnRemoveAll = new Common.UI.Button({
                el: $("#paraadv-button-remove-all")
            });
            this.btnRemoveAll.on("click", _.bind(this.removeAllTabs, this));
            this.afterRender();
        },
        getSettings: function () {
            if (this._tabListChanged) {
                if (this._changedProps.get_Tabs() === null || this._changedProps.get_Tabs() === undefined) {
                    this._changedProps.put_Tabs(new CParagraphTabs());
                }
                this.tabList.store.each(function (item, index) {
                    var tab = new CParagraphTab(Common.Utils.Metric.fnRecalcToMM(item.get("tabPos")), item.get("tabAlign"));
                    this._changedProps.get_Tabs().add_Tab(tab);
                },
                this);
            }
            return {
                paragraphProps: this._changedProps
            };
        },
        _setDefaults: function (props) {
            if (props) {
                this._originalProps = new CParagraphProp(props);
                this.numIndentsLeft.setValue((props.get_Ind() !== null && props.get_Ind().get_Left() !== null) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Ind().get_Left()) : "", true);
                this.numFirstLine.setMinValue(-this.numIndentsLeft.getNumberValue());
                this.numFirstLine.setValue((props.get_Ind() !== null && props.get_Ind().get_FirstLine() !== null) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Ind().get_FirstLine()) : "", true);
                this.numIndentsRight.setValue((props.get_Ind() !== null && props.get_Ind().get_Right() !== null) ? Common.Utils.Metric.fnRecalcFromMM(props.get_Ind().get_Right()) : "", true);
                this._noApply = true;
                this.chStrike.setValue((props.get_Strikeout() !== null && props.get_Strikeout() !== undefined) ? props.get_Strikeout() : "indeterminate", true);
                this.chDoubleStrike.setValue((props.get_DStrikeout() !== null && props.get_DStrikeout() !== undefined) ? props.get_DStrikeout() : "indeterminate", true);
                this.chSubscript.setValue((props.get_Subscript() !== null && props.get_Subscript() !== undefined) ? props.get_Subscript() : "indeterminate", true);
                this.chSuperscript.setValue((props.get_Superscript() !== null && props.get_Superscript() !== undefined) ? props.get_Superscript() : "indeterminate", true);
                this.chSmallCaps.setValue((props.get_SmallCaps() !== null && props.get_SmallCaps() !== undefined) ? props.get_SmallCaps() : "indeterminate", true);
                this.chAllCaps.setValue((props.get_AllCaps() !== null && props.get_AllCaps() !== undefined) ? props.get_AllCaps() : "indeterminate", true);
                this.numSpacing.setValue((props.get_TextSpacing() !== null && props.get_TextSpacing() !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(props.get_TextSpacing()) : "", true);
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", this._originalProps);
                this.numDefaultTab.setValue((props.get_DefaultTab() !== null && props.get_DefaultTab() !== undefined) ? Common.Utils.Metric.fnRecalcFromMM(parseFloat(props.get_DefaultTab().toFixed(1))) : "", true);
                var store = this.tabList.store;
                var tabs = props.get_Tabs();
                if (tabs) {
                    var arr = [];
                    var count = tabs.get_Count();
                    for (var i = 0; i < count; i++) {
                        var tab = tabs.get_Tab(i);
                        var pos = Common.Utils.Metric.fnRecalcFromMM(parseFloat(tab.get_Pos().toFixed(1)));
                        var rec = new Common.UI.DataViewModel();
                        rec.set({
                            tabPos: pos,
                            value: parseFloat(pos.toFixed(3)) + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()],
                            tabAlign: tab.get_Value()
                        });
                        arr.push(rec);
                    }
                    store.reset(arr, {
                        silent: false
                    });
                    this.tabList.selectByIndex(0);
                }
                this._noApply = false;
                this._changedProps = new CParagraphProp();
            }
        },
        updateMetricUnit: function () {
            if (this.spinners) {
                for (var i = 0; i < this.spinners.length; i++) {
                    var spinner = this.spinners[i];
                    spinner.setDefaultUnit(Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()]);
                    if (spinner.el.id == "paragraphadv-spin-spacing") {
                        spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.01 : 1);
                    } else {
                        spinner.setStep(Common.Utils.Metric.getCurrentMetric() == Common.Utils.Metric.c_MetricUnits.cm ? 0.1 : 1);
                    }
                }
            }
        },
        afterRender: function () {
            this.updateMetricUnit();
            this._setDefaults(this._originalProps);
        },
        onStrikeChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 1) {
                this._changedProps.put_Strikeout(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 1;
                this.chDoubleStrike.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_DStrikeout(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_Strikeout(field.getValue() == "checked");
                properties.put_DStrikeout(this.chDoubleStrike.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onDoubleStrikeChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 1) {
                this._changedProps.put_DStrikeout(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 1;
                this.chStrike.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_Strikeout(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_DStrikeout(field.getValue() == "checked");
                properties.put_Strikeout(this.chStrike.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onSuperscriptChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 2) {
                this._changedProps.put_Superscript(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 2;
                this.chSubscript.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_Subscript(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_Superscript(field.getValue() == "checked");
                properties.put_Subscript(this.chSubscript.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onSubscriptChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 2) {
                this._changedProps.put_Subscript(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 2;
                this.chSuperscript.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_Superscript(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_Subscript(field.getValue() == "checked");
                properties.put_Superscript(this.chSuperscript.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onSmallCapsChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 3) {
                this._changedProps.put_SmallCaps(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 3;
                this.chAllCaps.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_AllCaps(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_SmallCaps(field.getValue() == "checked");
                properties.put_AllCaps(this.chAllCaps.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        onAllCapsChange: function (field, newValue, oldValue, eOpts) {
            if (this._changedProps && this.checkGroup != 3) {
                this._changedProps.put_AllCaps(field.getValue() == "checked");
            }
            this.checkGroup = 0;
            if (field.getValue() == "checked") {
                this.checkGroup = 3;
                this.chSmallCaps.setValue(0);
                if (this._changedProps) {
                    this._changedProps.put_SmallCaps(false);
                }
                this.checkGroup = 0;
            }
            if (this.api && !this._noApply) {
                var properties = (this._originalProps) ? this._originalProps : new CParagraphProp();
                properties.put_AllCaps(field.getValue() == "checked");
                properties.put_SmallCaps(this.chSmallCaps.getValue() == "checked");
                this.api.SetDrawImagePlaceParagraph("paragraphadv-font-img", properties);
            }
        },
        addTab: function (btn, eOpts) {
            var val = this.numTab.getNumberValue();
            var align = this.radioLeft.getValue() ? 1 : (this.radioCenter.getValue() ? 3 : 2);
            var store = this.tabList.store;
            var rec = store.find(function (record) {
                return (Math.abs(record.get("tabPos") - val) < 0.001);
            });
            if (rec) {
                rec.set("tabAlign", align);
            } else {
                rec = new Common.UI.DataViewModel();
                rec.set({
                    tabPos: val,
                    value: val + " " + Common.Utils.Metric.metricName[Common.Utils.Metric.getCurrentMetric()],
                    tabAlign: align
                });
                store.add(rec);
            }
            this.tabList.selectRecord(rec);
            this.tabList.scrollToRecord(rec);
        },
        removeTab: function (btn, eOpts) {
            var rec = this.tabList.getSelectedRec();
            if (rec.length > 0) {
                var store = this.tabList.store;
                var idx = _.indexOf(store.models, rec[0]);
                store.remove(rec[0]);
                if (idx > store.length - 1) {
                    idx = store.length - 1;
                }
                if (store.length > 0) {
                    this.tabList.selectByIndex(idx);
                    this.tabList.scrollToRecord(store.at(idx));
                }
            }
        },
        removeAllTabs: function (btn, eOpts) {
            this.tabList.store.reset();
        },
        onSelectTab: function (lisvView, itemView, record) {
            var rawData = {},
            isViewSelect = _.isFunction(record.toJSON);
            if (isViewSelect) {
                if (record.get("selected")) {
                    rawData = record.toJSON();
                } else {
                    return;
                }
            } else {
                rawData = record;
            }
            this.numTab.setValue(rawData.tabPos);
            (rawData.tabAlign == 1) ? this.radioLeft.setValue(true) : ((rawData.tabAlign == 3) ? this.radioCenter.setValue(true) : this.radioRight.setValue(true));
        },
        textTitle: "Paragraph - Advanced Settings",
        strIndentsFirstLine: "First line",
        strIndentsLeftText: "Left",
        strIndentsRightText: "Right",
        strParagraphIndents: "Indents & Placement",
        strParagraphFont: "Font",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        textEffects: "Effects",
        textCharacterSpacing: "Character Spacing",
        strDoubleStrike: "Double strikethrough",
        strStrike: "Strikethrough",
        strSuperscript: "Superscript",
        strSubscript: "Subscript",
        strSmallCaps: "Small caps",
        strAllCaps: "All caps",
        strTabs: "Tab",
        textSet: "Specify",
        textRemove: "Remove",
        textRemoveAll: "Remove All",
        textTabLeft: "Left",
        textTabRight: "Right",
        textTabCenter: "Center",
        textAlign: "Alignment",
        textTabPosition: "Tab Position",
        textDefault: "Default Tab",
        noTabs: "The specified tabs will appear in this field"
    },
    PE.Views.ParagraphSettingsAdvanced || {}));
});