/**
 * @aside example video
 * Provides a simple Container for HTML5 Video.
 *
 * ## Notes
 *
 * - There are quite a few issues with the `<video>` tag on Android devices. On Android 2+, the video will
 * appear and play on first attempt, but any attempt afterwards will not work.
 *
 * ## Useful Properties
 *
 * - {@link #url}
 * - {@link #autoPause}
 * - {@link #autoResume}
 *
 * ## Useful Methods
 *
 * - {@link #method-pause}
 * - {@link #method-play}
 * - {@link #toggle}
 *
 * ## Example
 *
 *     var panel = Ext.create('Ext.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype    : 'video',
 *                 x        : 600,
 *                 y        : 300,
 *                 width    : 175,
 *                 height   : 98,
 *                 url      : "porsche911.mov",
 *                 posterUrl: 'porsche.png'
 *             }
 *         ]
 *     });
 */
Ext.define('Ext.Video', {
    extend: 'Ext.Media',
    xtype: 'video',

    config: {
        /**
         * @cfg {String/Array} urls
         * Location of the video to play. This should be in H.264 format and in a .mov file format.
         * @accessor
         */

        /**
         * @cfg {String} posterUrl
         * Location of a poster image to be shown before showing the video.
         * @accessor
         */
        posterUrl: null,

        /**
         * @cfg
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'video'
    },

    template: [{
        /**
         * @property {Ext.dom.Element} ghost
         * @private
         */
        reference: 'ghost',
        classList: [Ext.baseCSSPrefix + 'video-ghost']
    }, {
        tag: 'video',
        reference: 'media',
        classList: [Ext.baseCSSPrefix + 'media']
    }],

    initialize: function() {
        var me = this;

        me.callParent();

        me.media.hide();

        me.onBefore({
            erased: 'onErased',
            scope: me
        });

        me.ghost.on({
            tap: 'onGhostTap',
            scope: me
        });

        me.media.on({
            pause: 'onPause',
            scope: me
        });

        if (Ext.os.is.Android4 || Ext.os.is.iPad) {
            this.isInlineVideo = true;
        }
    },

    applyUrl: function(url) {
        return [].concat(url);
    },

    updateUrl: function(newUrl) {
        var me = this,
            media = me.media,
            newLn = newUrl.length,
            existingSources = media.query('source'),
            oldLn = existingSources.length,
            i;


        for (i = 0; i < oldLn; i++) {
            Ext.fly(existingSources[i]).destroy();
        }

        for (i = 0; i < newLn; i++) {
            media.appendChild(Ext.Element.create({
                tag: 'source',
                src: newUrl[i]
            }));
        }

        if (me.isPlaying()) {
            me.play();
        }
    },

    onErased: function() {
        this.pause();
        this.media.setTop(-2000);
        this.ghost.show();
    },

    /**
     * @private
     * Called when the {@link #ghost} element is tapped.
     */
    onGhostTap: function() {
        var me = this,
            media = this.media,
            ghost = this.ghost;

        media.show();
        if (Ext.os.is.Android2) {
            setTimeout(function() {
                me.play();
                setTimeout(function() {
                    media.hide();
                }, 10);
            }, 10);
        } else {
            // Browsers which support native video tag display only, move the media down so
            // we can control the Viewport
            ghost.hide();
            me.play();
        }
    },

    /**
     * @private
     * native video tag display only, move the media down so we can control the Viewport
     */
    onPause: function() {
        this.callParent(arguments);
        if (!this.isInlineVideo) {
            this.media.setTop(-2000);
            this.ghost.show();
        }
    },

    /**
     * @private
     * native video tag display only, move the media down so we can control the Viewport
     */
    onPlay: function() {
        this.callParent(arguments);
        this.media.setTop(0);
    },

    /**
     * Updates the URL to the poster, even if it is rendered.
     * @param {Object} newUrl
     */
    updatePosterUrl: function(newUrl) {
        var ghost = this.ghost;
        if (ghost) {
            ghost.setStyle('background-image', 'url(' + newUrl + ')');
        }
    }
});
