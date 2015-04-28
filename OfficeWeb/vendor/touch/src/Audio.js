/**
 * {@link Ext.Audio} is a simple class which provides a container for the [HTML5 Audio element](http://developer.mozilla.org/en-US/docs/Using_HTML5_audio_and_video).
 *
 * ## Recommended File Types/Compression:
 * * Uncompressed WAV and AIF audio
 * * MP3 audio
 * * AAC-LC
 * * HE-AAC audio
 *
 * ## Notes
 * On Android devices, the audio tags controls do not show. You must use the {@link #method-play}, {@link #method-pause} and
 * {@link #toggle} methods to control the audio (example below).
 *
 * ## Examples
 *
 * Here is an example of the {@link Ext.Audio} component in a fullscreen container:
 *
 *     @example preview
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: {
 *             type : 'vbox',
 *             pack : 'center',
 *             align: 'stretch'
 *         },
 *         items: [
 *             {
 *                 xtype : 'toolbar',
 *                 docked: 'top',
 *                 title : 'Ext.Audio'
 *             },
 *             {
 *                 xtype: 'audio',
 *                 url  : 'touch/examples/audio/crash.mp3'
 *             }
 *         ]
 *     });
 *
 * You can also set the {@link #hidden} configuration of the {@link Ext.Audio} component to true by default,
 * and then control the audio by using the {@link #method-play}, {@link #method-pause} and {@link #toggle} methods:
 *
 *     @example preview
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: {
 *             type: 'vbox',
 *             pack: 'center'
 *         },
 *         items: [
 *             {
 *                 xtype : 'toolbar',
 *                 docked: 'top',
 *                 title : 'Ext.Audio'
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 defaults: {
 *                     xtype: 'button',
 *                     handler: function() {
 *                         var container = this.getParent().getParent(),
 *                             // use ComponentQuery to get the audio component (using its xtype)
 *                             audio = container.down('audio');
 *
 *                         audio.toggle();
 *                         this.setText(audio.isPlaying() ? 'Pause' : 'Play');
 *                     }
 *                 },
 *                 items: [
 *                     { text: 'Play', flex: 1 }
 *                 ]
 *             },
 *             {
 *                 html: 'Hidden audio!',
 *                 styleHtmlContent: true
 *             },
 *             {
 *                 xtype : 'audio',
 *                 hidden: true,
 *                 url   : 'touch/examples/audio/crash.mp3'
 *             }
 *         ]
 *     });
 * @aside example audio
 */
Ext.define('Ext.Audio', {
    extend: 'Ext.Media',
    xtype : 'audio',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'audio'

        /**
         * @cfg {String} url
         * The location of the audio to play.
         *
         * ### Recommended file types are:
         * * Uncompressed WAV and AIF audio
         * * MP3 audio
         * * AAC-LC
         * * HE-AAC audio
         * @accessor
         */
    },

    // @private
    onActivate: function() {
        var me = this;

        me.callParent();

        if (Ext.os.is.Phone) {
            me.element.show();
        }
    },

    // @private
    onDeactivate: function() {
        var me = this;

        me.callParent();

        if (Ext.os.is.Phone) {
            me.element.hide();
        }
    },

    template: [{
        reference: 'media',
        preload: 'auto',
        tag: 'audio',
        cls: Ext.baseCSSPrefix + 'component'
    }]
});
