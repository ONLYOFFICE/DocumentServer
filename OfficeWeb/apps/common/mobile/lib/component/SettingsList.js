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
 Ext.define("Common.component.SettingsList", {
    extend: "Ext.List",
    alias: "widget.settingslist",
    config: {
        disableSelection: true,
        pinHeaders: false,
        grouped: true,
        cls: "settings",
        ui: "round",
        itemTpl: Ext.create("Ext.XTemplate", '<tpl for=".">', '<tpl if="this.hasIcon(icon)">', '<span class="list-icon {icon}"></span>', "</tpl>", '<tpl if="this.hasIcon(icon)">', '<strong class="icon-offset">{setting}</strong>', "<tpl else>", "<strong>{setting}</strong>", "</tpl>", '<tpl if="this.hasChild(child)">', '<span class="list-icon disclosure"></span>', "</tpl>", "</tpl>", {
            hasIcon: function (icon) {
                return !Ext.isEmpty(icon);
            },
            hasChild: function (child) {
                return !Ext.isEmpty(child);
            }
        })
    },
    findGroupHeaderIndices: function () {
        var me = this,
        store = me.getStore(),
        storeLn = store.getCount(),
        groups = store.getGroups(),
        groupLn = groups.length,
        headerIndices = me.headerIndices = {},
        footerIndices = me.footerIndices = {},
        i,
        previousIndex,
        firstGroupedRecord,
        storeIndex;
        me.groups = groups;
        for (i = 0; i < groupLn; i++) {
            firstGroupedRecord = groups[i].children[0];
            storeIndex = store.indexOf(firstGroupedRecord);
            headerIndices[storeIndex] = true;
            previousIndex = storeIndex - 1;
            if (previousIndex >= 0) {
                footerIndices[previousIndex] = true;
            }
        }
        footerIndices[storeLn - 1] = true;
        return headerIndices;
    }
});