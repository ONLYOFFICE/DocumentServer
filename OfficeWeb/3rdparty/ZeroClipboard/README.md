Zero Clipboard
==============

The Zero Clipboard library provides an easy way to copy text to the clipboard using an invisible [Adobe Flash](http://en.wikipedia.org/wiki/Adobe_Flash) movie, and a [JavaScript](http://en.wikipedia.org/wiki/JavaScript) interface. The "Zero" signifies that the library is invisible and the user interface is left entirely up to you.

This library is fully compatible with Flash Player 10, which requires that the clipboard copy operation be initiated by a user click event inside the Flash movie. This is achieved by automatically floating the invisible movie on top of a [DOM](http://en.wikipedia.org/wiki/Document_Object_Model) element of your choice. Standard mouse events are even propagated out to your DOM element, so you can still have rollover and mouse down effects.

See the [Instructions](https://github.com/jonrohan/ZeroClipboard/blob/master/docs/instructions.md) for instructions on how to use the library on your site.

Here is a working [Test Page](http://jonrohan.github.com/ZeroClipboard/#demo) where you can try out ZeroClipboard in your browser.

### Zero Clipboard Does Not Work From Local Disk

This is a security restriction by Adobe Flash Player. Unfortunately, since we are utilizing the `JavaScript-to-Flash` interface ("`ExternalInterface`") this only works while truly online (if the page URL starts with "http://" or "https://"). It won't work running from a local file on disk.

However, there is a way for you to edit your local Flash Player security settings and allow this. Go to this website:

http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04a.html

And add the path to your local "ZeroClipboard.swf" file to the trusted files list, or try the "allow all" option.
