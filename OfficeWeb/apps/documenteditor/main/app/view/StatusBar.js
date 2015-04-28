/**
 *  StatusBar View
 *
 *  Created by Maxim Kadushkin
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'text!documenteditor/main/app/template/StatusBar.template',
    'jquery',
    'underscore',
    'backbone',
    'tip',
    'common/main/lib/component/Menu',
    'common/main/lib/component/Window',
    'documenteditor/main/app/model/Pages'
 ],
    function(template, $, _, Backbone){
        'use strict';

        function _onCountPages(count){
            this.pages.set('count', count);
        }

        function _onCurrentPage(number){
            this.pages.set('current', number+1);
        }

        var _tplPages = _.template('Page <%= current %> of <%= count %>');

        function _updatePagesCaption(model,value,opts) {
            $('#status-label-pages').text(
                Common.Utils.String.format(this.pageIndexText, model.get('current'), model.get('count')) );
        }

        function _clickLanguage(menu, item, state) {
            var $parent = $(menu.el.parentNode);

            $parent.find('#status-label-lang').text(item.caption);
            $parent.find('.icon-lang-flag')
                    .removeClass(this.langMenu.prevTip)
                    .addClass(item.value.tip);

            this.langMenu.prevTip = item.value.tip;

            this.fireEvent('langchanged', [this, item.value.code, item.caption]);
        }

        if ( DE.Views.Statusbar )
            var LanguageDialog = DE.Views.Statusbar.LanguageDialog || {};

        DE.Views.Statusbar = Backbone.View.extend(_.extend({
            el: '#statusbar',
            template: _.template(template),

            events: {
            },

            api: undefined,
            pages: undefined,

            initialize: function () {
                this.pages = new DE.Models.Pages({current:1, count:1});
                this.pages.on('change', _.bind(_updatePagesCaption,this));
            },

            render: function () {
                $(this.el).html(this.template({
                    scope: this
                }));

                this.btnZoomToPage = new Common.UI.Button({
                    el: $('#btn-zoom-topage',this.el),
                    hint: this.tipFitPage,
                    hintAnchor: 'top',
                    toggleGroup: 'status-zoom',
                    enableToggle: true
                });

                this.btnZoomToWidth = new Common.UI.Button({
                    el: $('#btn-zoom-towidth',this.el),
                    hint: this.tipFitWidth,
                    hintAnchor: 'top',
                    toggleGroup: 'status-zoom',
                    enableToggle: true
                });

                this.btnZoomDown = new Common.UI.Button({
                    el: $('#btn-zoom-down',this.el),
                    hint: this.tipZoomOut + Common.Utils.String.platformKey('Ctrl+-'),
                    hintAnchor: 'top'
                });

                this.btnZoomUp = new Common.UI.Button({
                    el: $('#btn-zoom-up',this.el),
                    hint: this.tipZoomIn + Common.Utils.String.platformKey('Ctrl++'),
                    hintAnchor: 'top-right'
                });

                this.btnDocLanguage = new Common.UI.Button({
                    el: $('#btn-doc-lang',this.el),
                    hint: this.tipSetDocLang,
                    hintAnchor: 'top'
                });

                this.btnSetSpelling = new Common.UI.Button({
                    el: $('#btn-doc-spell',this.el),
                    enableToggle: true,
                    hint: this.tipSetSpelling,
                    hintAnchor: 'top'
                });

                var panelLang = $('.cnt-lang',this.el);
                this.langMenu = new Common.UI.Menu({
                    style: 'margin-top:-5px;',
                    maxHeight: 300,
                    menuAlign: 'bl-tl'
                });

                this.btnLanguage = new Common.UI.Button({
                    el: panelLang,
                    hint: this.tipSetLang,
                    hintAnchor: 'top-left'
                });
                this.btnLanguage.cmpEl.on('show.bs.dropdown', function () {
                        _.defer(function(){
                            me.api.asc_enableKeyEvents(false);
                            me.btnLanguage.cmpEl.find('ul').focus();
                        }, 100);
                    }
                );
                this.btnLanguage.cmpEl.on('hide.bs.dropdown', function () {
                        _.defer(function(){
                            me.api.asc_enableKeyEvents(true);
                        }, 100);
                    }
                );

                this.langMenu.render(panelLang);
                this.langMenu.cmpEl.attr({tabindex: -1});

                this.cntZoom = new Common.UI.Button({
                    el: $('.cnt-zoom',this.el),
                    hint: this.tipZoomFactor,
                    hintAnchor: 'top'
                });
                this.cntZoom.cmpEl.on('show.bs.dropdown', function () {
                        _.defer(function(){
                            me.api.asc_enableKeyEvents(false);
                            me.cntZoom.cmpEl.find('ul').focus();
                        }, 100);
                    }
                );
                this.cntZoom.cmpEl.on('hide.bs.dropdown', function () {
                        _.defer(function(){
                            me.api.asc_enableKeyEvents(true);
                        }, 100);
                    }
                );

                this.zoomMenu = new Common.UI.Menu({
                    style: 'margin-top:-5px;',
                    menuAlign: 'bl-tl',
                    items: [
                        { caption: "50%", value: 50 },
                        { caption: "75%", value: 75 },
                        { caption: "100%", value: 100 },
                        { caption: "125%", value: 125 },
                        { caption: "150%", value: 150 },
                        { caption: "175%", value: 175 },
                        { caption: "200%", value: 200 }
                    ]
                });
                this.zoomMenu.render($('.cnt-zoom',this.el));
                this.zoomMenu.cmpEl.attr({tabindex: -1});

                this.langMenu.prevTip = 'en';
                this.langMenu.on('item:click', _.bind(_clickLanguage,this));

                /** coauthoring begin **/
                this.panelUsers = $('#status-users-ct', this.el);
                this.panelUsers.find('#status-users-block').on('click', _.bind(this.onUsersClick, this));
                /** coauthoring end **/

                // Go To Page

                var me = this;

                this.txtGoToPage = new Common.UI.InputField({
                    el          : $('#status-goto-page'),
                    allowBlank  : true,
                    validateOnChange: true,
                    style       : 'width: 60px;',
                    maskExp: /[0-9]/,
                    validation  : function(value) {
                        if (/(^[0-9]+$)/.test(value)) {
                            value = parseInt(value);
                            if (undefined !== value && value > 0 && value <= me.pages.get('count'))
                                return true;
                        }

                        return me.txtPageNumInvalid;
                    }
                }).on('keypress:after', function(input, e) {
                        var box = me.$el.find('#status-goto-box');
                        if (e.keyCode === Common.UI.Keys.RETURN) {
                            var edit = box.find('input[type=text]'), page = parseInt(edit.val());
                            if (!page || page-- > me.pages.get('count') || page < 0) {
                                edit.select();
                                return false;
                            }

                            box.focus();                        // for IE
                            box.parent().removeClass('open');

                            me.api.goToPage(page);
                            me.api.asc_enableKeyEvents(true);

                            return false;
                        }
                    }
                );

                var goto = this.$el.find('#status-goto-box');
                goto.on('click', function() {
                    return false;
                });
                goto.parent().on('show.bs.dropdown',
                    function () {
                        me.txtGoToPage.setValue(me.api.getCurrentPage() + 1);
                        me.txtGoToPage.checkValidate();
                        var edit = me.txtGoToPage.$el.find('input');
                        _.defer(function(){edit.focus(); edit.select();}, 100);

                    }
                );
                goto.parent().on('hide.bs.dropdown',
                    function () { var box = me.$el.find('#status-goto-box');
                        if (me.api && box) {
                            box.focus();                        // for IE
                            box.parent().removeClass('open');

                            me.api.asc_enableKeyEvents(true);
                        }
                    }
                );

                return this;
            },

            setApi: function(api) {
                this.api = api;

                if (this.api) {
                    this.api.asc_registerCallback('asc_onCountPages',   _.bind(_onCountPages, this));
                    this.api.asc_registerCallback('asc_onCurrentPage',  _.bind(_onCurrentPage, this));

                    /** coauthoring begin **/
                    this.api.asc_registerCallback('asc_onAuthParticipantsChanged', _.bind(this.onApiUsersChanged, this));
                    this.api.asc_registerCallback('asc_onParticipantsChanged', _.bind(this.onApiUsersChanged, this));
                    /** coauthoring end **/
                }

                return this;

            },

            setMode: function(mode) {
                this.$el.find('.el-edit')[mode.isEdit?'show':'hide']();
            },

            setVisible: function(visible) {
                visible
                    ? this.show()
                    : this.hide();
            },

            /** coauthoring begin **/
            onUsersClick: function() {
                this.fireEvent('click:users', this);
            },

            onApiUsersChanged: function(users) {
                var editusers = [];
                _.each(users, function(item){
                    if (!item.asc_getView())
                        editusers.push(item);
                });

                var length = _.size(editusers);
                this.panelUsers[length > 1 ? 'show' : 'hide']();

                var ttblock = this.panelUsers.find('#status-users-block');
                if (ttblock.data('bs.tooltip')) ttblock.removeData('bs.tooltip');

                if (length > 1) {
                    this.panelUsers.find('#status-users-count').text(length);

                    var tip = this.tipUsers + '<br/><br/>', i = 0;
                    for (var n in editusers) {
                        tip += '\n' + Common.Utils.String.htmlEncode(editusers[n].asc_getUserName());
                        if (++i > 3) break;
                    }

                    if (length > 4) {
                        tip += '<br/>' + this.tipMoreUsers.replace('%1', length-4);
                        tip += '<br/><br/>' + this.tipShowUsers;
                    }

                    ttblock.tooltip({
                        title: tip,
                        html: true,
                        placement: 'top-left'
                    });
                }
            },
            /** coauthoring end **/

            reloadLanguages: function(array) {
                _.each(array, function(item) {
                    this.langMenu.addItem({
                        iconCls     : item['tip'],
                        caption     : item['title'],
                        value       : {tip: item['tip'], code: item['code']},
                        checkable   : true,
                        checked     : this.langMenu.saved == item.title,
                        toggleGroup : 'language'
                    });
                }, this);

                this.langMenu.doLayout();
            },

            setLanguage: function(info) {
                if (this.langMenu.prevTip != info.tip) {
                    var $parent = $(this.langMenu.el.parentNode);
                    $parent.find('.icon-lang-flag')
                        .removeClass(this.langMenu.prevTip)
                        .addClass(info.tip);

                    this.langMenu.prevTip = info.tip;

                    $parent.find('#status-label-lang').text(info.title);

                    var index = $parent.find('ul li a:contains("'+info.title+'")').parent().index();
                    index < 0 ? this.langMenu.saved = info.title :
                                this.langMenu.items[index-1].setChecked(true);
                }
            },

            showStatusMessage: function(message) {
                $('#status-label-action').text(message);
            },

            clearStatusMessage: function() {
                $('#status-label-action').text('');
            },

            pageIndexText       : 'Page {0} of {1}',
            goToPageText        : 'Go to Page',
            tipUsers            : 'Document is in the collaborative editing mode.',
            tipMoreUsers        : 'and %1 users.',
            tipShowUsers        : 'To see all users click the icon below.',
            tipFitPage          : 'Fit Page',
            tipFitWidth         : 'Fit Width',
            tipZoomIn           : 'Zoom In',
            tipZoomOut          : 'Zoom Out',
            tipZoomFactor       : 'Magnification',
            tipSetLang          : 'Set Text Language',
            tipSetDocLang       : 'Set Document Language',
            tipSetSpelling      : 'Turn on spell checking option',
            txtPageNumInvalid   : 'Page number invalid'
        }, DE.Views.Statusbar || {}));

        DE.Views.Statusbar.LanguageDialog = Common.UI.Window.extend(_.extend({
            options: {
                header: false,
                width: 350,
                cls: 'modal-dlg'
            },

            template:   '<div class="box">' +
                            '<div class="input-row">' +
                                '<label><%= label %></label>' +
                            '</div>' +
                            '<div class="input-row" id="id-document-language">' +
                            '</div>' +
                        '</div>' +
                        '<div class="footer right">' +
                            '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;"><%= btns.ok %></button>'+
                            '<button class="btn normal dlg-btn" result="cancel"><%= btns.cancel %></button>'+
                        '</div>',

            initialize : function(options) {
                _.extend(this.options, options || {}, {
                    label: this.labelSelect,
                    btns: {ok: this.btnOk, cancel: this.btnCancel}
                });
                this.options.tpl = _.template(this.template, this.options);

                Common.UI.Window.prototype.initialize.call(this, this.options);
            },

            render: function() {
                Common.UI.Window.prototype.render.call(this);

                var $window = this.getChild();
                $window.find('.dlg-btn').on('click', _.bind(this.onBtnClick, this));

                this.cmbLanguage = new Common.UI.ComboBox({
                    el: $window.find('#id-document-language'),
                    cls: 'input-group-nr',
                    menuStyle: 'min-width: 318px; max-height: 300px;',
                    editable: false,
                    template: _.template([
                        '<span class="input-group combobox <%= cls %> combo-langs" id="<%= id %>" style="<%= style %>">',
                            '<input type="text" class="form-control">',
                            '<span class="input-lang-icon" style="position: absolute;"></span>',
                            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>',
                            '<ul class="dropdown-menu <%= menuCls %>" style="<%= menuStyle %>" role="menu">',
                                '<% _.each(items, function(item) { %>',
                                    '<li id="<%= item.id %>" data-value="<%= item.value %>">',
                                        '<a tabindex="-1" type="menuitem" style="padding-left: 26px !important;">',
                                            '<span class="menu-item-icon <%= item.value %> " style="position: absolute;margin-left:-21px;"></span>',
                                            '<%= scope.getDisplayValue(item) %>',
                                        '</a>',
                                    '</li>',
                                '<% }); %>',
                            '</ul>',
                        '</span>'
                    ].join('')),
                    data: this.options.languages
                });

                this.cmbLanguage.scroller.update({alwaysVisibleY: true});
                this.cmbLanguage.on('selected', _.bind(this.onLangSelect, this));
                this.cmbLanguage.setValue(Common.util.LanguageInfo.getLocalLanguageName(this.options.current)[0]);
                this.onLangSelect(this.cmbLanguage, this.cmbLanguage.getSelectedRecord());
            },

            close: function(suppressevent) {
                var $window = this.getChild();
                if (!$window.find('.combobox.open').length) {
                    Common.UI.Window.prototype.close.call(this, arguments);
                }
            },

            onBtnClick: function(event) {
                if (this.options.handler) {
                    this.options.handler.call(this, event.currentTarget.attributes['result'].value, this.cmbLanguage.getValue());
                }

                this.close();
            },

            onLangSelect: function(cmb, rec, e) {
                var icon    = cmb.$el.find('.input-lang-icon'),
                    plang   = icon.attr('lang');

                if (plang) icon.removeClass(plang);
                icon.addClass(rec.value).attr('lang',rec.value);
            },

            labelSelect     : 'Select document language',
            btnCancel       : 'Cancel',
            btnOk           : 'Ok'
        }, LanguageDialog||{}));
    }
);