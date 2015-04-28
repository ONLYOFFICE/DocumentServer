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
 Ext.define("Common.component.PlanarSpinner", {
    extend: "Ext.field.Spinner",
    xtype: "planarspinnerfield",
    config: {},
    constructor: function () {
        var me = this;
        me.callParent(arguments);
        me.addCls("planar-spinner");
    },
    updateComponent: function (newComponent) {
        this.callParent(arguments);
        var innerElement = this.innerElement,
        cls = this.getCls();
        if (newComponent) {
            this.spinDownButton = Ext.widget("button", {
                cls: "x-button x-button-base " + cls + "-button " + cls + "-button-down",
                iconCls: "spinner-down"
            });
            this.spinUpButton = Ext.widget("button", {
                cls: "x-button x-button-base " + cls + "-button " + cls + "-button-up",
                iconCls: "spinner-up"
            });
            this.downRepeater = this.createRepeater(this.spinDownButton.element, this.onSpinDown);
            this.upRepeater = this.createRepeater(this.spinUpButton.element, this.onSpinUp);
        }
    },
    updateGroupButtons: function (newGroupButtons, oldGroupButtons) {
        var me = this,
        innerElement = me.innerElement,
        cls = me.getBaseCls() + "-grouped-buttons";
        me.getComponent();
        if (newGroupButtons != oldGroupButtons) {
            if (newGroupButtons) {
                this.addCls(cls);
                innerElement.insertFirst(me.spinDownButton.element);
                innerElement.appendChild(me.spinUpButton.element);
            } else {
                this.removeCls(cls);
                innerElement.insertFirst(me.spinDownButton.element);
                innerElement.appendChild(me.spinUpButton.element);
            }
        }
    }
});