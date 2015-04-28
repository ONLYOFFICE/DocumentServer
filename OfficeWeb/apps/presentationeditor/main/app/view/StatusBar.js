/**
 *  StatusBar View
 *
 *  Created by Maxim Kadushkin on 8 April 2014
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'text!presentationeditor/main/app/template/StatusBar.template',
    'backbone',
    'tip',
    'common/main/lib/component/Menu',
    'common/main/lib/component/Window',
    'presentationeditor/main/app/model/Pages'
 ], function(template, Backbone){
        'use strict';

        function _onCountPages(count){
            this.pages.set('count', count);
        }

        function _onCurrentPage(number){
            this.pages.set('current', number+1);
        }

        var _tplPages = _.template('Slide <%= current %> of <%= count %>');

        function _updatePagesCaption(model,value,opts) {
            $('#status-label-pages').text(
                Common.Utils.String.format(this.pageIndexText, model.get('current'), model.get('count')) );
        }

        PE.Views.Statusbar = Backbone.View.extend(_.extend({
            el: '#statusbar',
            template: _.template(template),

            events: {
            },

            api: undefined,
            pages: undefined,

            initialize: function () {
                this.pages = new PE.Models.Pages({current:1, count:1});
                this.pages.on('change', _.bind(_updatePagesCaption,this));
            },

            render: function () {
                var me = this;
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
                    hint: this.tipZoomOut+Common.Utils.String.platformKey('Ctrl+-'),
                    hintAnchor: 'top'
                });

                this.btnZoomUp = new Common.UI.Button({
                    el: $('#btn-zoom-up',this.el),
                    hint: this.tipZoomIn+Common.Utils.String.platformKey('Ctrl++'),
                    hintAnchor: 'top-right'
                });

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

                /** coauthoring begin **/
                this.panelUsers = $('#status-users-ct', this.el);
                this.panelUsers.find('#status-users-block').on('click', _.bind(this.onUsersClick, this));
                /** coauthoring end **/

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
                    this.api.asc_registerCallback('asc_onParticipantsChanged',     _.bind(this.onApiUsersChanged, this));
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

            showStatusMessage: function(message) {
                $('#status-label-action').text(message);
            },

            clearStatusMessage: function() {
                $('#status-label-action').text('');
            },

            pageIndexText   : 'Slide {0} of {1}',
            goToPageText    : 'Go to Slide',
            tipUsers        : 'Document is in the collaborative editing mode.',
            tipMoreUsers    : 'and %1 users.',
            tipShowUsers    : 'To see all users click the icon below.',
            tipFitPage      : 'Fit Slide',
            tipFitWidth     : 'Fit Width',
            tipZoomIn       : 'Zoom In',
            tipZoomOut      : 'Zoom Out',
            tipZoomFactor   : 'Magnification',
            txtPageNumInvalid: 'Slide number invalid'
        }, PE.Views.Statusbar || {}));
    }
);