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
 Ext.define("SSE.controller.Document", {
    extend: "Ext.app.Controller",
    config: {
        refs: {},
        control: {
            "#id-btn-zoom-in": {
                tap: "onZoomIn"
            },
            "#id-btn-zoom-out": {
                tap: "onZoomOut"
            }
        }
    },
    _currZoom: 1,
    _baseZoom: 1,
    _maxZoom: 2,
    _incrementZoom: 0.05,
    init: function () {},
    launch: function () {},
    setApi: function (o) {
        this.api = o;
        if (this.api) {
            this.api.asc_registerCallback("asc_onDoubleTapEvent", Ext.bind(this._onDoubleTapDocument, this));
            this.api.asc_registerCallback("asc_onStartAction", Ext.bind(this._onLongActionBegin, this));
            this.api.asc_registerCallback("asc_onEndAction", Ext.bind(this._onLongActionEnd, this));
        }
    },
    _onLongActionBegin: function (type, id) {},
    _onLongActionEnd: function (type, id) {
        if (type === c_oAscAsyncActionType["BlockInteraction"]) {
            switch (id) {
            case c_oAscAsyncAction["Open"]:
                var i = this.api.asc_getActiveWorksheetIndex();
                this.api.asc_showWorksheet(i);
                break;
            }
        }
    },
    _onDoubleTapDocument: function () {
        if (this.api) {
            if (this._currZoom != this._baseZoom) {
                this._currZoom = this._baseZoom;
            } else {
                this._currZoom = this._maxZoom;
            }
            this.api.asc_setZoom(this._currZoom);
        }
    },
    onZoomIn: function (event, node, opt) {
        this._currZoom += this._incrementZoom;
        if (this._currZoom > this._maxZoom) {
            this._currZoom = this._maxZoom;
        }
        this.api.asc_setZoom(this._currZoom);
    },
    onZoomOut: function (event, node, opt) {
        this._currZoom -= this._incrementZoom;
        if (this._currZoom < this._baseZoom) {
            this._currZoom = this._baseZoom;
        }
        this.api.asc_setZoom(this._currZoom);
    }
});