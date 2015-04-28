/**
 * This component is used in {@link Ext.navigation.View} to control animations in the toolbar. You should never need to
 * interact with the component directly, unless you are subclassing it.
 * @private
 * @author Robert Dougan <rob@sencha.com>
 */
Ext.define('Ext.navigation.Bar', {
    extend: 'Ext.TitleBar',

    requires: [
        'Ext.Button',
        'Ext.Spacer'
    ],

    // @private
    isToolbar: true,

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'toolbar',

        /**
         * @cfg
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'navigation-bar',

        /**
         * @cfg {String} ui
         * Style options for Toolbar. Either 'light' or 'dark'.
         * @accessor
         */
        ui: 'dark',

        /**
         * @cfg {String} title
         * The title of the toolbar. You should NEVER set this, it is used internally. You set the title of the
         * navigation bar by giving a navigation views children a title configuration.
         * @private
         * @accessor
         */
        title: null,

        /**
         * @cfg
         * @hide
         * @accessor
         */
        defaultType: 'button',

        /**
         * @cfg
         * @ignore
         * @accessor
         */
        layout: {
            type: 'hbox'
        },

        /**
         * @cfg {Array/Object} items The child items to add to this NavigationBar. The {@link #cfg-defaultType} of
         * a NavigationBar is {@link Ext.Button}, so you do not need to specify an `xtype` if you are adding
         * buttons.
         *
         * You can also give items a `align` configuration which will align the item to the `left` or `right` of
         * the NavigationBar.
         * @hide
         * @accessor
         */

        /**
         * @cfg {String} defaultBackButtonText
         * The text to be displayed on the back button if:
         * a) The previous view does not have a title
         * b) The {@link #useTitleForBackButtonText} configuration is true.
         * @private
         * @accessor
         */
        defaultBackButtonText: 'Back',

        /**
         * @cfg {Object} animation
         * @private
         * @accessor
         */
        animation: {
            duration: 300
        },

        /**
         * @cfg {Boolean} useTitleForBackButtonText
         * Set to false if you always want to display the {@link #defaultBackButtonText} as the text
         * on the back button. True if you want to use the previous views title.
         * @private
         * @accessor
         */
        useTitleForBackButtonText: null,

        /**
         * @cfg {Ext.navigation.View} view A reference to the navigation view this bar is linked to.
         * @private
         * @accessor
         */
        view: null,

        /**
         * @cfg {Boolean} androidAnimation Optionally enable CSS transforms on Android 2
         * for NavigationBar animations.  Note that this may cause flickering if the
         * NavigationBar is hidden.
         * @accessor
         */
        android2Transforms: false,

        /**
         * @cfg {Ext.Button/Object} backButton The configuration for the back button
         * @private
         * @accessor
         */
        backButton: {
            align: 'left',
            ui: 'back',
            hidden: true
        }
    },

    /**
     * @event back
     * Fires when the back button was tapped.
     * @param {Ext.navigation.Bar} this This bar
     */

    constructor: function(config) {
        config = config || {};

        if (!config.items) {
            config.items = [];
        }

        this.backButtonStack = [];
        this.activeAnimations = [];

        this.callParent([config]);
    },

    /**
     * @private
     */
    applyBackButton: function(config) {
        return Ext.factory(config, Ext.Button, this.getBackButton());
    },

    /**
     * @private
     */
    updateBackButton: function(newBackButton, oldBackButton) {
        if (oldBackButton) {
            this.remove(oldBackButton);
        }

        if (newBackButton) {
            this.add(newBackButton);

            newBackButton.on({
                scope: this,
                tap: this.onBackButtonTap
            });
        }
    },

    onBackButtonTap: function() {
        this.fireEvent('back', this);
    },

    /**
     * @private
     */
    updateView: function(newView) {
        var me = this,
            backButton = me.getBackButton(),
            innerItems, i, backButtonText, item, title;

        me.getItems();

        if (newView) {
            //update the back button stack with the current inner items of the view
            innerItems = newView.getInnerItems();
            for (i = 0; i < innerItems.length; i++) {
                item = innerItems[i];
                title = (item.getTitle) ? item.getTitle() : item.config.title;

                me.backButtonStack.push(title || '&nbsp;');
            }

            me.setTitle(me.getTitleText());

            backButtonText = me.getBackButtonText();
            if (backButtonText) {
                backButton.setText(backButtonText);
                backButton.show();
            }
        }
    },

    /**
     * @private
     */
    onViewAdd: function(view, item) {
        var me = this,
            backButtonStack = me.backButtonStack,
            hasPrevious, title;

        me.endAnimation();

        title = (item.getTitle) ? item.getTitle() : item.config.title;

        backButtonStack.push(title || '&nbsp;');
        hasPrevious = backButtonStack.length > 1;

        me.doChangeView(view, hasPrevious, false);
    },

    /**
     * @private
     */
    onViewRemove: function(view) {
        var me = this,
            backButtonStack = me.backButtonStack,
            hasPrevious;

        me.endAnimation();
        backButtonStack.pop();
        hasPrevious = backButtonStack.length > 1;

        me.doChangeView(view, hasPrevious, true);
    },

    /**
     * @private
     */
    doChangeView: function(view, hasPrevious, reverse) {
        var me = this,
            leftBox = me.leftBox,
            leftBoxElement = leftBox.element,
            titleComponent = me.titleComponent,
            titleElement = titleComponent.element,
            backButton = me.getBackButton(),
            titleText = me.getTitleText(),
            backButtonText = me.getBackButtonText(),
            animation = me.getAnimation() && view.getLayout().getAnimation(),
            animated = animation && animation.isAnimation && view.isPainted(),
            properties, leftGhost, titleGhost, leftProps, titleProps;

        if (animated) {
            leftGhost = me.createProxy(leftBox.element);
            leftBoxElement.setStyle('opacity', '0');
            backButton.setText(backButtonText);
            backButton[hasPrevious ? 'show' : 'hide']();

            titleGhost = me.createProxy(titleComponent.element.getParent());
            titleElement.setStyle('opacity', '0');
            me.setTitle(titleText);

            me.refreshTitlePosition();

            properties = me.measureView(leftGhost, titleGhost, reverse);
            leftProps = properties.left;
            titleProps = properties.title;

            me.isAnimating = true;

            me.animate(leftBoxElement, leftProps.element);
            me.animate(titleElement, titleProps.element, function() {
                titleElement.setLeft(properties.titleLeft);
                me.isAnimating = false;
            });

            if (Ext.os.is.Android2 && !this.getAndroid2Transforms()) {
                leftGhost.ghost.destroy();
                titleGhost.ghost.destroy();
            }
            else {
                me.animate(leftGhost.ghost, leftProps.ghost);
                me.animate(titleGhost.ghost, titleProps.ghost, function() {
                    leftGhost.ghost.destroy();
                    titleGhost.ghost.destroy();
                });
            }
        }
        else {
            if (hasPrevious) {
                backButton.setText(backButtonText);
                backButton.show();
            }
            else {
                backButton.hide();
            }
            me.setTitle(titleText);
        }
    },

    /**
     * Calculates and returns the position values needed for the back button when you are pushing a title.
     * @private
     */
    measureView: function(oldLeft, oldTitle, reverse) {
        var me = this,
            barElement = me.element,
            newLeftElement = me.leftBox.element,
            titleElement = me.titleComponent.element,
            minOffset = Math.min(barElement.getWidth() / 3, 200),
            newLeftWidth = newLeftElement.getWidth(),
            barX = barElement.getX(),
            barWidth = barElement.getWidth(),
            titleX = titleElement.getX(),
            titleLeft = titleElement.getLeft(),
            titleWidth = titleElement.getWidth(),
            oldLeftX = oldLeft.x,
            oldLeftWidth = oldLeft.width,
            oldLeftLeft = oldLeft.left,
            useLeft = Ext.os.is.Android2 && !this.getAndroid2Transforms(),
            newOffset, oldOffset, leftAnims, titleAnims, omega, theta;

        theta = barX - oldLeftX - oldLeftWidth;
        if (reverse) {
            newOffset = theta;
            oldOffset = Math.min(titleX - oldLeftWidth, minOffset);
        }
        else {
            oldOffset = theta;
            newOffset = Math.min(titleX - barX, minOffset);
        }

        if (useLeft) {
            leftAnims = {
                element: {
                    from: {
                        left: newOffset,
                        opacity: 1
                    },
                    to: {
                        left: 0,
                        opacity: 1
                    }
                }
            };
        }
        else {
            leftAnims = {
                element: {
                    from: {
                        transform: {
                            translateX: newOffset
                        },
                        opacity: 0
                    },
                    to: {
                        transform: {
                            translateX: 0
                        },
                        opacity: 1
                    }
                },
                ghost: {
                    to: {
                        transform: {
                            translateX: oldOffset
                        },
                        opacity: 0
                    }
                }
            };
        }

        theta = barX - titleX + newLeftWidth;
        if ((oldLeftLeft + titleWidth) > titleX) {
            omega = barX - titleX - titleWidth;
        }

        if (reverse) {
            titleElement.setLeft(0);

            oldOffset = barX + barWidth;

            if (omega !== undefined) {
                newOffset = omega;
            }
            else {
                newOffset = theta;
            }
        }
        else {
            newOffset = barWidth - titleX;

            if (omega !== undefined) {
                oldOffset = omega;
            }
            else {
                oldOffset = theta;
            }
        }

        if (useLeft) {
            titleAnims = {
                element: {
                    from: {
                        left: newOffset,
                        opacity: 1
                    },
                    to: {
                        left: titleLeft,
                        opacity: 1
                    }
                }
            };
        }
        else {
            titleAnims = {
                element: {
                    from: {
                        transform: {
                            translateX: newOffset
                        },
                        opacity: 0
                    },
                    to: {
                        transform: {
                            translateX: titleLeft
                        },
                        opacity: 1
                    }
                },
                ghost: {
                    to: {
                        transform: {
                            translateX: oldOffset
                        },
                        opacity: 0
                    }
                }
            };
        }

        return {
            left: leftAnims,
            title: titleAnims,
            titleLeft: titleLeft
        };
    },

    /**
     * Helper method used to animate elements.
     * You pass it an element, objects for the from and to positions an option onEnd callback called when the animation is over.
     * Normally this method is passed configurations returned from the methods such as #measureTitle(true) etc.
     * It is called from the #pushLeftBoxAnimated, #pushTitleAnimated, #popBackButtonAnimated and #popTitleAnimated
     * methods.
     *
     * If the current device is Android, it will use top/left to animate.
     * If it is anything else, it will use transform.
     * @private
     */
    animate: function(element, config, callback) {
        var me = this,
            animation;

        //reset the left of the element
        element.setLeft(0);

        config = Ext.apply(config, {
            element: element,
            easing: 'ease-in-out',
            duration: me.getAnimation().duration || 250,
            preserveEndState: true
        });

        animation = new Ext.fx.Animation(config);
        animation.on('animationend', function() {
            if (callback) {
                callback.call(me);
            }
        }, me);

        Ext.Animator.run(animation);
        me.activeAnimations.push(animation);
    },

    endAnimation: function() {
        var activeAnimations = this.activeAnimations,
            animation, i, ln;

        if (activeAnimations) {
            ln = activeAnimations.length;
            for (i = 0; i < ln; i++) {
                animation = activeAnimations[i];
                if (animation.isAnimating) {
                    animation.stopAnimation();
                }
                else {
                    animation.destroy();
                }
            }
            this.activeAnimations = [];
        }
    },

    refreshTitlePosition: function() {
        if (!this.isAnimating) {
            this.callParent();
        }
    },

    /**
     * Returns the text needed for the current back button at anytime.
     * @private
     */
    getBackButtonText: function() {
        var text = this.backButtonStack[this.backButtonStack.length - 2],
            useTitleForBackButtonText = this.getUseTitleForBackButtonText();

        if (!useTitleForBackButtonText) {
            if (text) {
                text = this.getDefaultBackButtonText();
            }
        }

        return text;
    },

    /**
     * Returns the text needed for the current title at anytime.
     * @private
     */
    getTitleText: function() {
        return this.backButtonStack[this.backButtonStack.length - 1];
    },

    /**
     * Handles removing back button stacks from this bar
     * @private
     */
    beforePop: function(count) {
        count--;
        for (var i = 0; i < count; i++) {
            this.backButtonStack.pop();
        }
    },

    /**
     * We override the hidden method because we don't want to remove it from the view using display:none. Instead we just position it off
     * the screen, much like the navigation bar proxy. This means that all animations, pushing, popping etc. all still work when if you hide/show
     * this bar at any time.
     * @private
     */
    doSetHidden: function(hidden) {
        if (!hidden) {
            this.element.setStyle({
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: 'auto'
            });
        } else {
            this.element.setStyle({
                position: 'absolute',
                top: '-1000px',
                left: '-1000px',
                width: this.element.getWidth() + 'px'
            });
        }
    },

    /**
     * Creates a proxy element of the passed element, and positions it in the same position, using absolute positioning.
     * The createNavigationBarProxy method uses this to create proxies of the backButton and the title elements.
     * @private
     */
    createProxy: function(element) {
        var ghost, x, y, left, width;

        ghost = element.dom.cloneNode(true);
        ghost.id = element.id + '-proxy';

        //insert it into the toolbar
        element.getParent().dom.appendChild(ghost);

        //set the x/y
        ghost = Ext.get(ghost);
        x = element.getX();
        y = element.getY();
        left = element.getLeft();
        width = element.getWidth();
        ghost.setStyle('position', 'absolute');
        ghost.setX(x);
        ghost.setY(y);
        ghost.setHeight(element.getHeight());
        ghost.setWidth(width);

        return {
            x: x,
            y: y,
            left: left,
            width: width,
            ghost: ghost
        };
    }
});
