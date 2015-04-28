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
 if (Common === undefined) {
    var Common = {};
}
define(["common/main/lib/component/Window"], function () {
    Common.Views.InsertTableDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 230,
            height: 170,
            header: false,
            style: "min-width: 230px;",
            cls: "modal-dlg"
        },
        initialize: function (options) {
            _.extend(this.options, options || {});
            this.template = ['<div class="box">', "<h4>" + this.txtTitle + "</h4>", '<div class="input-row" style="margin: 10px 0;">', '<label class="text columns-text" style="width: 130px;">' + this.txtColumns + '</label><div class="columns-val" style="float: right;"></div>', "</div>", '<div class="input-row" style="margin: 10px 0;">', '<label class="text rows-text" style="width: 130px;">' + this.txtRows + '</label><div class="rows-val" style="float: right;"></div>', "</div>", "</div>", '<div class="footer center">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var $window = this.getChild();
            $window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
            this.udColumns = new Common.UI.MetricSpinner({
                el: $window.find(".columns-val"),
                step: 1,
                width: 64,
                value: 2,
                defaultUnit: "",
                maxValue: 63,
                minValue: 1,
                allowDecimal: false
            });
            this.udRows = new Common.UI.MetricSpinner({
                el: $window.find(".rows-val"),
                step: 1,
                width: 64,
                value: 2,
                defaultUnit: "",
                maxValue: 100,
                minValue: 1,
                allowDecimal: false
            });
        },
        onBtnClick: function (event) {
            if (this.options.handler) {
                this.options.handler.call(this, event.currentTarget.attributes["result"].value, {
                    columns: this.udColumns.getValue(),
                    rows: this.udRows.getValue()
                });
            }
            this.close();
        },
        onPrimary: function () {
            if (this.options.handler) {
                this.options.handler.call(this, "ok", {
                    columns: this.udColumns.getValue(),
                    rows: this.udRows.getValue()
                });
            }
            this.close();
            return false;
        },
        txtTitle: "Table size",
        txtColumns: "Number of Columns",
        txtRows: "Number of Rows",
        textInvalidRowsCols: "You need to specify valid rows and columns count.",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        txtMinText: "The minimum value for this field is {0}",
        txtMaxText: "The maximum value for this field is {0}"
    },
    Common.Views.InsertTableDialog || {}));
});