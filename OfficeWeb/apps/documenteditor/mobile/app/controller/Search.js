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
 Ext.define("DE.controller.Search", (function () {
    return {
        extend: "Ext.app.Controller",
        config: {
            refs: {
                searchToolbar: "searchtoolbar",
                nextResultButton: "#id-btn-search-down",
                previousResultButton: "#id-btn-search-up",
                searchField: "#id-field-search"
            },
            control: {
                searchToolbar: {
                    hide: "onSearchToolbarHide"
                },
                previousResultButton: {
                    tap: "onPreviousResultButtonTap"
                },
                nextResultButton: {
                    tap: "onNextResultButtonTap"
                },
                searchField: {
                    keyup: "onSearchKeyUp",
                    change: "onSearchChange",
                    clearicontap: "onClearSearch"
                }
            }
        },
        init: function () {},
        setApi: function (o) {
            this.api = o;
        },
        updateNavigation: function () {
            var text = this.getSearchField().getValue();
            this.getNextResultButton().setDisabled(!(text.length > 0));
            this.getPreviousResultButton().setDisabled(!(text.length > 0));
        },
        clearSearchResults: function () {
            if (this.getSearchField()) {
                this.getSearchField().setValue("");
                this.updateNavigation();
            }
            window.focus();
            document.activeElement.blur();
        },
        onSearchToolbarHide: function () {
            this.clearSearchResults();
        },
        onNextResultButtonTap: function () {
            this.api.asc_findText(this.getSearchField().getValue(), true);
        },
        onPreviousResultButtonTap: function () {
            this.api.asc_findText(this.getSearchField().getValue(), false);
        },
        onSearchKeyUp: function (field, e) {
            if (e.event.keyCode == 13 && field.getValue().length > 0) {
                this.api.asc_findText(field.getValue(), true);
            }
            this.updateNavigation();
        },
        onSearchChange: function (field, newValue, oldValue) {
            this.updateNavigation();
        },
        onClearSearch: function (field, e) {
            this.clearSearchResults();
        }
    };
})());