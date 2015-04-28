/**
 * Provides a base class for audio/visual controls. Should not be used directly.
 *
 * Please see the {@link Ext.Audio} and {@link Ext.Video} classes for more information.
 * @private
 */
Ext.define('Ext.Media', {
    extend: 'Ext.Component',
    xtype: 'media',

    /**
     * @event play
     * Fires whenever the media is played.
     * @param {Ext.Media} this
     */

    /**
     * @event pause
     * Fires whenever the media is paused.
     * @param {Ext.Media} this
     * @param {Number} time The time at which the media was paused at in seconds.
     */

    /**
     * @event ended
     * Fires whenever the media playback has ended.
     * @param {Ext.Media} this
     * @param {Number} time The time at which the media ended at in seconds.
     */

    /**
     * @event stop
     * Fires whenever the media is stopped.
     * The `pause` event will also fire after the `stop` event if the media is currently playing.
     * The `timeupdate` event will also fire after the `stop` event regardless of playing status.
     * @param {Ext.Media} this
     */

    /**
     * @event volumechange
     * Fires whenever the volume is changed.
     * @param {Ext.Media} this
     * @param {Number} volume The volume level from 0 to 1.
     */

    /**
     * @event mutedchange
     * Fires whenever the muted status is changed.
     * The volumechange event will also fire after the `mutedchange` event fires.
     * @param {Ext.Media} this
     * @param {Boolean} muted The muted status.
     */

    /**
     * @event timeupdate
     * Fires when the media is playing every 15 to 250ms.
     * @param {Ext.Media} this
     * @param {Number} time The current time in seconds.
     */

    config: {
        /**
         * @cfg {String} url
         * Location of the media to play.
         * @accessor
         */
        url: '',

        /**
         * @cfg {Boolean} enableControls
         * Set this to `false` to turn off the native media controls.
         * Defaults to `false` when you are on Android, as it doesn't support controls.
         * @accessor
         */
        enableControls: Ext.os.is.Android ? false : true,

        /**
         * @cfg {Boolean} autoResume
         * Will automatically start playing the media when the container is activated.
         * @accessor
         */
        autoResume: false,

        /**
         * @cfg {Boolean} autoPause
         * Will automatically pause the media when the container is deactivated.
         * @accessor
         */
        autoPause: true,

        /**
         * @cfg {Boolean} preload
         * Will begin preloading the media immediately.
         * @accessor
         */
        preload: true,

        /**
         * @cfg {Boolean} loop
         * Will loop the media forever.
         * @accessor
         */
        loop: false,

        /**
         * @cfg {Ext.Element} media
         * A reference to the underlying audio/video element.
         * @accessor
         */
        media: null,

        /**
         * @cfg {Number} volume
         * The volume of the media from 0.0 to 1.0.
         * @accessor
         */
        volume: 1,

        /**
         * @cfg {Boolean} muted
         * Whether or not the media is muted. This will also set the volume to zero.
         * @accessor
         */
        muted: false
    },

    constructor: function() {
        this.mediaEvents = {};
        this.callSuper(arguments);
    },

    initialize: function() {
        var me = this;
        me.callParent();

        me.on({
            scope: me,

            activate  : me.onActivate,
            deactivate: me.onDeactivate
        });

        me.addMediaListener({
            canplay: 'onCanPlay',
            play: 'onPlay',
            pause: 'onPause',
            ended: 'onEnd',
            volumechange: 'onVolumeChange',
            timeupdate: 'onTimeUpdate'
        });
    },

    addMediaListener: function(event, fn) {
        var me = this,
            dom = me.media.dom,
            bind = Ext.Function.bind;

        Ext.Object.each(event, function(e, fn) {
            fn = bind(me[fn], me);
            me.mediaEvents[e] = fn;
            dom.addEventListener(e, fn);
        });
    },

    onPlay: function() {
        this.fireEvent('play', this);
    },

    onCanPlay: function() {
        this.fireEvent('canplay', this);
    },

    onPause: function() {
        this.fireEvent('pause', this, this.getCurrentTime());
    },

    onEnd: function() {
        this.fireEvent('ended', this, this.getCurrentTime());
    },

    onVolumeChange: function() {
        this.fireEvent('volumechange', this, this.media.dom.volume);
    },

    onTimeUpdate: function() {
        this.fireEvent('timeupdate', this, this.getCurrentTime());
    },

    /**
     * Returns if the media is currently playing.
     * @return {Boolean} playing `true` if the media is playing.
     */
    isPlaying: function() {
        return !Boolean(this.media.dom.paused);
    },

    // @private
    onActivate: function() {
        var me = this;

        if (me.getAutoResume() && !me.isPlaying()) {
            me.play();
        }
    },

    // @private
    onDeactivate: function() {
        var me = this;

        if (me.getAutoPause() && me.isPlaying()) {
            me.pause();
        }
    },

    /**
     * Sets the URL of the media element. If the media element already exists, it is update the src attribute of the
     * element. If it is currently playing, it will start the new video.
     */
    updateUrl: function(newUrl) {
        var dom = this.media.dom;

        //when changing the src, we must call load:
        //http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html

        dom.src = newUrl;

        if ('load' in dom) {
            dom.load();
        }

        if (this.isPlaying()) {
            this.play();
        }
    },

    /**
     * Updates the controls of the video element.
     */
    updateEnableControls: function(enableControls) {
        this.media.dom.controls = enableControls ? 'controls' : false;
    },

    /**
     * Updates the loop setting of the media element.
     */
    updateLoop: function(loop) {
        this.media.dom.loop = loop ? 'loop' : false;
    },

    /**
     * Starts or resumes media playback.
     */
    play: function() {
        var dom = this.media.dom;

        if ('play' in dom) {
            dom.play();
            setTimeout(function() {
                dom.play();
            }, 10);
        }
    },

    /**
     * Pauses media playback.
     */
    pause: function() {
        var dom = this.media.dom;

        if ('pause' in dom) {
            dom.pause();
        }
    },

    /**
     * Toggles the media playback state.
     */
    toggle: function() {
        if (this.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    },

    /**
     * Stops media playback and returns to the beginning.
     */
    stop: function() {
        var me = this;

        me.setCurrentTime(0);
        me.fireEvent('stop', me);
        me.pause();
    },

    //@private
    updateVolume: function(volume) {
        this.media.dom.volume = volume;
    },

    //@private
    updateMuted: function(muted) {
        this.fireEvent('mutedchange', this, muted);

        this.media.dom.muted = muted;
    },

    /**
     * Returns the current time of the media, in seconds.
     * @return {Number}
     */
    getCurrentTime: function() {
        return this.media.dom.currentTime;
    },

    /*
     * Set the current time of the media.
     * @param {Number} time The time, in seconds.
     * @return {Number}
     */
    setCurrentTime: function(time) {
        this.media.dom.currentTime = time;

        return time;
    },

    /**
     * Returns the duration of the media, in seconds.
     * @return {Number}
     */
    getDuration: function() {
        return this.media.dom.duration;
    },

    destroy: function() {
        var me = this,
            dom  = me.media.dom,
            mediaEvents = me.mediaEvents;

        Ext.Object.each(mediaEvents, function(event, fn) {
            dom.removeEventListener(event, fn);
        });

        this.callSuper();
    }
});
