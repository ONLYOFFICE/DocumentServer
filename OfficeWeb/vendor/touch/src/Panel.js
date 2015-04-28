/**
 * @aside guide floating_components
 *
 * Panels are most useful as Overlays - containers that float over your application. They contain extra styling such
 * that when you {@link #showBy} another component, the container will appear in a rounded black box with a 'tip'
 * pointing to a reference component.
 *
 * If you don't need this extra functionality, you should use {@link Ext.Container} instead. See the
 * [Overlays example](#!/example/overlays) for more use cases.
 *
 *      @example miniphone preview
 *
 *      var button = Ext.create('Ext.Button', {
 *           text: 'Button',
 *           id: 'rightButton'
 *      });
 *
 *      Ext.create('Ext.Container', {
 *          fullscreen: true,
 *          items: [
 *              {
 *                   docked: 'top',
 *                   xtype: 'titlebar',
 *                   items: [
 *                       button
 *                   ]
 *               }
 *          ]
 *      });
 *
 *      Ext.create('Ext.Panel', {
 *          html: 'Floating Panel',
 *          left: 0,
 *          padding: 10
 *      }).showBy(button);
 *
 */
Ext.define('Ext.Panel', {
    extend: 'Ext.Container',
    requires: ['Ext.util.LineSegment'],

    alternateClassName: 'Ext.lib.Panel',

    xtype: 'panel',

    isPanel: true,

    config: {
        baseCls: Ext.baseCSSPrefix + 'panel',

        /**
         * @cfg {Number/Boolean/String} bodyPadding
         * A shortcut for setting a padding style on the body element. The value can either be
         * a number to be applied to all sides, or a normal CSS string describing padding.
         * @deprecated 2.0.0
         */
        bodyPadding: null,

        /**
         * @cfg {Number/Boolean/String} bodyMargin
         * A shortcut for setting a margin style on the body element. The value can either be
         * a number to be applied to all sides, or a normal CSS string describing margins.
         * @deprecated 2.0.0
         */
        bodyMargin: null,

        /**
         * @cfg {Number/Boolean/String} bodyBorder
         * A shortcut for setting a border style on the body element. The value can either be
         * a number to be applied to all sides, or a normal CSS string describing borders.
         * @deprecated 2.0.0
         */
        bodyBorder: null
    },

    getElementConfig: function() {
        var config = this.callParent();

        config.children.push({
            reference: 'tipElement',
            className: 'x-anchor',
            hidden: true
        });

        return config;
    },

    applyBodyPadding: function(bodyPadding) {
        if (bodyPadding === true) {
            bodyPadding = 5;
        }

        if (bodyPadding) {
            bodyPadding = Ext.dom.Element.unitizeBox(bodyPadding);
        }

        return bodyPadding;
    },

    updateBodyPadding: function(newBodyPadding) {
        this.element.setStyle('padding', newBodyPadding);
    },

    applyBodyMargin: function(bodyMargin) {
        if (bodyMargin === true) {
            bodyMargin = 5;
        }

        if (bodyMargin) {
            bodyMargin = Ext.dom.Element.unitizeBox(bodyMargin);
        }

        return bodyMargin;
    },

    updateBodyMargin: function(newBodyMargin) {
        this.element.setStyle('margin', newBodyMargin);
    },

    applyBodyBorder: function(bodyBorder) {
        if (bodyBorder === true) {
            bodyBorder = 1;
        }

        if (bodyBorder) {
            bodyBorder = Ext.dom.Element.unitizeBox(bodyBorder);
        }

        return bodyBorder;
    },

    updateBodyBorder: function(newBodyBorder) {
        this.element.setStyle('border-width', newBodyBorder);
    },

    alignTo: function(component) {
        var tipElement = this.tipElement;

        tipElement.hide();

        if (this.currentTipPosition) {
            tipElement.removeCls('x-anchor-' + this.currentTipPosition);
        }

        this.callParent(arguments);

        var LineSegment = Ext.util.LineSegment,
            alignToElement = component.isComponent ? component.renderElement : component,
            element = this.renderElement,
            alignToBox = alignToElement.getPageBox(),
            box = element.getPageBox(),
            left = box.left,
            top = box.top,
            right = box.right,
            bottom = box.bottom,
            centerX = left + (box.width / 2),
            centerY = top + (box.height / 2),
            leftTopPoint = { x: left, y: top },
            rightTopPoint = { x: right, y: top },
            leftBottomPoint = { x: left, y: bottom },
            rightBottomPoint = { x: right, y: bottom },
            boxCenterPoint = { x: centerX, y: centerY },
            alignToCenterX = alignToBox.left + (alignToBox.width / 2),
            alignToCenterY = alignToBox.top + (alignToBox.height / 2),
            alignToBoxCenterPoint = { x: alignToCenterX, y: alignToCenterY },
            centerLineSegment = new LineSegment(boxCenterPoint, alignToBoxCenterPoint),
            offsetLeft = 0,
            offsetTop = 0,
            tipSize, tipWidth, tipHeight, tipPosition, tipX, tipY;

        tipElement.setVisibility(false);
        tipElement.show();
        tipSize = tipElement.getSize();
        tipWidth = tipSize.width;
        tipHeight = tipSize.height;

        if (centerLineSegment.intersects(new LineSegment(leftTopPoint, rightTopPoint))) {
            tipX = Math.min(Math.max(alignToCenterX, left + tipWidth), right - (tipWidth));
            tipY = top;
            offsetTop = tipHeight + 10;
            tipPosition = 'top';
        }
        else if (centerLineSegment.intersects(new LineSegment(leftTopPoint, leftBottomPoint))) {
            tipX = left;
            tipY = Math.min(Math.max(alignToCenterY + (tipWidth / 2), tipWidth * 1.6), bottom - (tipWidth / 2.2));
            offsetLeft = tipHeight + 10;
            tipPosition = 'left';
        }
        else if (centerLineSegment.intersects(new LineSegment(leftBottomPoint, rightBottomPoint))) {
            tipX = Math.min(Math.max(alignToCenterX, left + tipWidth), right - tipWidth);
            tipY = bottom;
            offsetTop = -tipHeight - 10;
            tipPosition = 'bottom';
        }
        else if (centerLineSegment.intersects(new LineSegment(rightTopPoint, rightBottomPoint))) {
            tipX = right;
            tipY = Math.max(Math.min(alignToCenterY - tipHeight, bottom - tipWidth * 1.3), tipWidth / 2);
            offsetLeft = -tipHeight - 10;
            tipPosition = 'right';
        }

        if (tipX || tipY) {
            this.currentTipPosition = tipPosition;
            tipElement.addCls('x-anchor-' + tipPosition);
            tipElement.setLeft(tipX - left);
            tipElement.setTop(tipY - top);
            tipElement.setVisibility(true);

            this.setLeft(this.getLeft() + offsetLeft);
            this.setTop(this.getTop() + offsetTop);
        }
    }
});
