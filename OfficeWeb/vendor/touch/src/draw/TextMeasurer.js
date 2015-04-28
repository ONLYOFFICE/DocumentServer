/**
 * Utility class to provide a way to *approximately* measure the dimension of texts without a drawing context.
 */
Ext.define("Ext.draw.TextMeasurer", {
    singleton: true,

    uses: ['Ext.draw.engine.Canvas'],

    measureDiv: null,
    measureCache: {},

    /**
     * @private Measure the size of a text with specific font by using DOM to measure it.
     * Could be very expensive therefore should be used lazily.
     * @param {String} text
     * @param {String} font
     * @return {Object} An object with `width` and `height` properties.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    actualMeasureText: function (text, font) {
        var me = Ext.draw.TextMeasurer,
            measureDiv = me.measureDiv,
            FARAWAY = 100000,
            size;

        if (!measureDiv) {
            var parent = Ext.Element.create({
                style: {
                    "overflow": "hidden",
                    "position": "relative",
                    "float": "left", // DO NOT REMOVE THE QUOTE OR IT WILL BREAK COMPRESSOR
                    "width": 0,
                    "height": 0
                }
            });
            me.measureDiv = measureDiv = Ext.Element.create({});
            measureDiv.setStyle({
                "position": 'absolute',
                "x": FARAWAY,
                "y": FARAWAY,
                "z-index": -FARAWAY,
                "white-space": "nowrap",
                "display": 'block',
                "padding": 0,
                "margin": 0
            });
            Ext.getBody().appendChild(parent);
            parent.appendChild(measureDiv);
        }
        if (font) {
            measureDiv.setStyle({
                font: font,
                lineHeight: 'normal'
            });
        }
        measureDiv.setText('(' + text + ')');
        size = measureDiv.getSize();
        measureDiv.setText('()');
        size.width -= measureDiv.getSize().width;
        return size;
    },

    /**
     * Measure a single-line text with specific font.
     * This will split the text to characters and add up their size.
     * That may *not* be the exact size of the text as it is displayed.
     * @param {String} text
     * @param {String} font
     * @return {Object} An object with `width` and `height` properties.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    measureTextSingleLine: function (text, font) {
        text = text.toString();
        var cache = this.measureCache,
            chars = text.split(''),
            width = 0,
            height = 0,
            cachedItem, charactor, i, ln, size;

        if (!cache[font]) {
            cache[font] = {};
        }
        cache = cache[font];

        if (cache[text]) {
            return cache[text];
        }

        for (i = 0, ln = chars.length; i < ln; i++) {
            charactor = chars[i];
            if (!(cachedItem = cache[charactor])) {
                size = this.actualMeasureText(charactor, font);
                cachedItem = cache[charactor] = size;
            }
            width += cachedItem.width;
            height = Math.max(height, cachedItem.height);
        }
        return cache[text] = {
            width: width,
            height: height
        };
    },

    /**
     * Measure a text with specific font.
     * This will split the text to lines and add up their size.
     * That may *not* be the exact size of the text as it is displayed.
     * @param {String} text
     * @param {String} font
     * @return {Object} An object with `width` and `height` properties.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    measureText: function (text, font) {
        var lines = text.split('\n'),
            ln = lines.length,
            height = 0,
            width = 0,
            line, i;

        if (ln === 1) {
            return this.measureTextSingleLine(text, font);
        }

        for (i = 0; i < ln; i++) {
            line = this.measureTextSingleLine(lines[i], font);
            height += line.height;
            width = Math.max(width, line.width);
        }

        return {
            width: width,
            height: height
        };
    }
});