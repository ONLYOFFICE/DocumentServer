# Overview

The *Zero Clipboard* [JavaScript](http://en.wikipedia.org/wiki/JavaScript) library provides an easy way to copy text to the clipboard using an invisible [Adobe Flash](http://en.wikipedia.org/wiki/Adobe_Flash) movie.  The "Zero" signifies that the library is invisible and the user interface is left entirely up to you.

This library is fully compatible with Flash Player 10, which requires that the copy operation initiated by a user click event inside the Flash movie.  This is achieved by automatically floating the invisible movie on top of a [DOM](http://en.wikipedia.org/wiki/Document_Object_Model) element of your choice.  Standard mouse events are even propagated out to your DOM element, so you can still have rollover and mouse down effects.

Flash Player 9 is also supported.  Please note that if you use the new *Rich HTML* feature, your users must have Flash Player 10.  There is no automatic fallback to the Flash 9 movie.

## Usage

The following subsections describe how to use the clipboard library.

### Setup

To use the library, simply include the following JavaScript file in your page:

```
  <script type="text/javascript" src="ZeroClipboard.js"></script>
```

You also need to have the "`"ZeroClipboard.swf`" file available to the browser.  If this file is located in the same directory as your web page, then it will work out of the box.  However, if the SWF file is hosted elsewhere, you need to set the URL like this (place this code _after_ the script tag):

```
  ZeroClipboard.setMoviePath( 'http://YOURSERVER/path/ZeroClipboard.swf' );
```

To use the new *Rich HTML* feature available in Zero Clipboard 1.0.7, you must set the movie path to the new "`ZeroClipboard10.swf`" file, which is included in the 1.0.7 archive.  Example:

```
  ZeroClipboard.setMoviePath( 'ZeroClipboard10.swf' );
```

Or, in a custom location other than the current directory:

```
  ZeroClipboard.setMoviePath( 'http://YOURSERVER/path/ZeroClipboard10.swf' );
```

### Clients

Now you are ready to create one or more *Clients*.  A client is a single instance of the clipboard library on the page, linked to a particular button or other DOM element.  You probably only need a single instance, but if you have multiple copy-to-clipboard buttons on your page, potentially containing different text, you can activate an instance for each.  Here is how to create a client instance:

```
  var clip = new ZeroClipboard.Client();
```

Next, you can set some options.

### Setting Options

Once you have your client instance, you can set some options.  These include setting the initial text to be copied, amongst other things.  The following subsections describe all the available options you can set.

#### Text To Copy

This function allows you to set the text to be copied to the clipboard, once the user clicks on the control.  You can call this function at any time; when the page first loads, or later in an `onMouseOver` or `onMouseDown` handler.  Example:

```
  clip.setText( "Copy me!" );
```

#### Hand Cursor

This setting controls whether the "hand" or "arrow" cursor is shown when the mouse hovers over the Flash movie.  Here is an example:

```
  clip.setHandCursor( true );
```

The only values accepted are *true* (show "hand" cursor), or *false* (show "arrow" cursor).  The default is *true*.  You can set this option at any time.

### Gluing

Gluing refers to the process of "linking" the Flash movie to a DOM element on the page.  Meaning, the library will automatically generate a movie that is the exact size of the DOM element, and float it just above the element.  Since the Flash movie is completely transparent, the user sees nothing out of the ordinary.

The Flash movie receives the click event and copies the current text (last set with `setText()`) to the clipboard (a requirement of Flash Player 10 is that a user click event inside the movie must initiate the thread that interacts with the clipboard).  Also, mouse actions like hovering and mouse-down generate events that you can capture (see *Event Handlers* below) and set [http://en.wikipedia.org/wiki/Cascading_Style_Sheets CSS] classes on your DOM element too (see *CSS Effects* below).

Here is how to glue your clip library instance to a DOM element:

```
  clip.glue( 'd_clip_button' );
```

You can pass in a DOM element ID (as shown above), or a reference to the actual DOM element object itself.  The rest all happens automatically -- the movie is created, all your options set, and it is floated above the element, awaiting clicks from the user.

The glue system is an optional implementation.  If you would prefer to handle your own implementation of the Flash movie, see *Custom Implementation* below.

#### Recommended Implementation

It is highly recommended you create a "container" DIV element around your button, set its CSS "position" to "relative", and place your button just inside.  Then, pass *two* arguments to `glue()`, your button DOM element or ID, and the container DOM element or ID.  This way Zero Clipboard can position the floating Flash movie relative to the container DIV (not the page body), resulting in much more exact positioning.  Example (HTML):

```
<div id="d_clip_container" style="position:relative">
   <div id="d_clip_button">Copy to Clipboard</div>
</div>
```

And the code:

```
  clip.glue( 'd_clip_button', 'd_clip_container' );
```

Note that gluing to a container element does not work with the `reposition()` method (see next section).

### Page Resizing

If the page gets resized, or something happens which moves your DOM element, you will need to reposition the movie.  This can be achieved by calling the `reposition()` method.  Example:

```
  clip.reposition();
```

A typical use of this is to put it inside a `window.onresize` handler.

If for some reason your DOM element was destroyed and recreated, you can pass the new ID or DOM element reference to the `reposition()` method.  However please note that the new element *must* be the same size as the previous element.  The library does not (yet) support elements that change size.

Note that repositioning only works if you glue using a single argument.  If you glue to a parent container element, you cannot (and probably won't ever need to) call `reposition()`.

### Hiding and Showing

You can also show and hide the Flash movie on demand, if you have an AJAX web app that dynamically changes content, potentially obscuring the clipboard button.  Examples:

```
  clip.hide();
  clip.show();
```

The `show()` function also calls `reposition()`.

#### CSS Effects

Since the Flash movie is floating on top of your DOM element, it will receive all the mouse events before the browser has a chance to catch them.  However, for convenience these events are passed through to your clipboard client which you can capture (see *Event Handlers* below).  But in addition to this, the Flash movie can also activate CSS classes on your DOM element to simulate the ":hover" and ":active" pseudo-classes.

If this feature is enabled, the CSS classes "hover" and "active" are added / removed to your DOM element as the mouse hovers over and clicks the Flash movie.  This essentially allows your button to behave normally, even though the floating Flash movie is receiving all the mouse events.  Please note that the actual CSS pseudo-classes ":hover" and ":active" are not used -- these cannot be programmatically activated with current browser software.  Instead, sub-classes named "hover" and "active" are used.  Example CSS:

```
  #d_clip_button {
    width:150px;
    text-align:center;
    border:1px solid black;
    background-color:#ccc;
    margin:10px; padding:10px;
  }
  #d_clip_button.hover { background-color:#eee; }
  #d_clip_button.active { background-color:#aaa; }
```

These classes are for a DOM element with an ID: "d_clip_button".  The "hover" and "active" sub-classes would automatically be activated as the user hovers over, and clicks down on the Flash movie, respectively.  They behave exactly like CSS pseudo-classes of the same names.

The CSS Effect system is enabled by default.  To disable it, pass *false* to the `setCSSEffects()` method.  Example:

```
  clip.setCSSEffects( false );
```

You can set this option at any time.

### Custom Implementation

If you would prefer to instantiate the Flash movie yourself, and completely disable the entire glue and CSS systems, you can simply call the `getHTML()` method, which returns the actual OBJECT/EMBED tag for the Flash movie.  Example:

```
  var html = clip.getHTML( 150, 20 );
```

The method requires that you pass in the desired pixel width and height of the movie.  The returned HTML can then be inserted into a DOM element of your choice, or written to the page with `document.write()`.

*Note:* Microsoft Internet Explorer seems to have a bug where the Flash External Interface (the communication layer between JavaScript and Flash) doesn't activate properly unless you insert the OBJECT tag into an element that is _already appended to the DOM_.  So make sure you call `appendChild()` before you insert the HTML into the `innerHTML` property of your element.

### Event Handlers

The clipboard library allows you set a number of different event handlers.  These are all set by calling the `addEventListener()` method, as in this example:

```
  clip.addEventListener( 'onLoad', my_load_handler );
```

The first argument is the name of the event, and the second is a reference to your function.  The function may be passed by name (string), an actual reference to the function object, or a PHP-style object/method array:

```
  clip.addEventListener( 'onMouseDown', [myObject, 'myMethod'] );
```

This allows you to get back into object context by calling a specific method on a specific object, as seen in PHP.  However, I suppose you could just use the JavaScript `bind()` function to achieve the same effect.

The event names are not case sensitive, and the prefix "on" is optional.  For example, the values "onLoad", "onload" and "load" all mean the same thing.

Your custom function will be passed at least one argument -- a reference to the clipboard client object.  However, certain events pass additional arguments, which are described in each section below.  The following subsections describe all the available events you can hook.

#### onLoad

The `onLoad` event is fired when the Flash movie completes loading and is ready for action.  Please note that you don't need to listen for this event to set options -- those are automatically passed to the movie if you call them before it loads.  Example use:

```
  clip.addEventListener( 'onLoad', my_load_handler );

  function my_load_handler( client ) {
    alert( "movie has loaded" );
  }
```

The handler is passed a reference to the clipboard client object.

#### onMouseOver

The `onMouseOver` event is fired when the user's mouse pointer enters the Flash movie.  You can use this to simulate a rollover effect on your DOM element, however see *CSS Effects* for an easier way to do this.  Example use:

```
  clip.addEventListener( 'onMouseOver', my_mouse_over_handler );

  function my_mouse_over_handler( client ) {
    alert( "mouse is over movie" );
  }
```

The handler is passed a reference to the clipboard client object.

#### onMouseOut

The `onMouseOut` event is fired when the user's mouse pointer leaves the Flash movie.  You can use this to simulate a rollover effect on your DOM element, however see *CSS Effects* for an easier way to do this.  Example use:

```
  clip.addEventListener( 'onMouseOut', my_mouse_out_handler );

  function my_mouse_out_handler(client) {
    alert( "mouse has left movie" );
  }
```

The handler is passed a reference to the clipboard client object.

#### onMouseDown

The `onMouseDown` event is fired when the user clicks on the Flash movie.  Please note that this does not guarantee that the user will release the mouse button while still over the movie (i.e. resulting in a click).  You can use this to simulate a click effect on your DOM element, however see *CSS Effects* for an easier way to do this.  Example use:

```
  clip.addEventListener( 'onMouseDown', my_mouse_down_handler );

  function my_mouse_down_handler(client) {
    alert( "mouse button is down" );
  }
```

The handler is passed a reference to the clipboard client object.

#### onMouseUp

The `onMouseUp` event is fired when the user releases the mouse button (having first pressed the mouse button while hovering over the movie).  Please note that this does not guarantee that the mouse cursor is still over the movie (i.e. resulting in a click).  You can use this to simulate a click effect on your DOM element, however see *CSS Effects* for an easier way to do this.  Example use:

```
  clip.addEventListener( 'onMouseUp', my_mouse_up_handler );

  function my_mouse_up_handler( client ) {
    alert( "mouse button is up" );
  }
```

The handler is passed a reference to the clipboard client object.

#### onComplete

The `onComplete` event is fired when the text is successfully copied to the clipboard.  Example use:

```
  clip.addEventListener( 'onComplete', my_complete );

  function my_complete( client, text ) {
    alert("Copied text to clipboard: " + text );
  }
```

The handler is passed two arguments: a reference to the clipboard client object, and the text that was copied.

#### Destroying

You may want to completely destroy the clipboard client movie, for example after a successful copy-to-clipboard.  This means that the user cannot click to copy additional text.  To do this, simply call the `destroy()` method, as in this example:

```
  clip.destroy();
```

This will remove the Flash movie from the DOM, and completely reset the client clipboard object.  If you want to reinitialize the object with another container, simply call `glue()` again (see *Gluing* above), or `getHTML()`.

*Note:* For safety reasons, you may not want to call this method directly in your `onComplete` handler function.  The reason is that the JavaScript thread originated from within the Flash movie, which you are attempting to destroy with the `destroy()` call.  This can cause crashes in certain browsers (namely IE).  Better to set a timer with `setTimeout()` and call destroy in its own, safe thread.

## Examples

The following are complete, working examples of using the clipboard client library in HTML pages.

### Minimal Example

Here is a quick example using as few calls as possible:

```
  <html>
  <body>
    <script type="text/javascript" src="ZeroClipboard.js"></script>

    <div id="d_clip_button" style="border:1px solid black; padding:20px;">Copy To Clipboard</div>

    <script language="JavaScript">
      var clip = new ZeroClipboard.Client();
      clip.setText( 'Copy me!' );
      clip.glue( 'd_clip_button' );
    </script>
  </body>
  </html>
```

When clicked, the text "Copy me!" will be copied to the clipboard.

### Complete Example

Here is a complete example which exercises every option and event handler:

```
  <html>
  <head>
    <style type="text/css">
      #d_clip_button {
        text-align:center;
        border:1px solid black;
        background-color:#ccc;
        margin:10px; padding:10px;
      }
      #d_clip_button.hover { background-color:#eee; }
      #d_clip_button.active { background-color:#aaa; }
    </style>
  </head>
  <body>
    <script type="text/javascript" src="ZeroClipboard.js"></script>

    Copy to Clipboard: <input type="text" id="clip_text" size="40" value="Copy me!"/><br/><br/>

    <div id="d_clip_button">Copy To Clipboard</div>

    <script language="JavaScript">
      var clip = new ZeroClipboard.Client();

      clip.setText( '' ); // will be set later on mouseDown
      clip.setHandCursor( true );
      clip.setCSSEffects( true );

      clip.addEventListener( 'onLoad', function(client) {
        // alert( "movie is loaded" );
      } );

      clip.addEventListener( 'onComplete', function(client, text) {
        alert("Copied text to clipboard: " + text );
      } );

      clip.addEventListener( 'onMouseOver', function(client) {
        // alert("mouse over");
      } );

      clip.addEventListener( 'onMouseOut', function(client) {
        // alert("mouse out");
      } );

      clip.addEventListener( 'onMouseDown', function(client) {
        // set text to copy here
        clip.setText( document.getElementById('clip_text').value );

        // alert("mouse down");
      } );

      clip.addEventListener( 'onMouseUp', function(client) {
        // alert("mouse up");
      } );

      clip.glue( 'd_clip_button' );
    </script>
  </body>
  </html>
```

## Browser Support

The Zero Clipboard Library has been tested on the following browsers / platforms:

|| *Browser* || *Windows XP SP3* || *Windows Vista* || *Mac OS X Leopard* ||
|| Internet Exploder || 7.0 || 7.0 || - ||
|| Firefox || 3.0 || 3.0 || 3.0 ||
|| Safari || - || - || 3.0 ||
|| Google Chrome || 1.0 || 1.0 || - ||

Adobe Flash Flash Player versions 9 and 10 are supported.
