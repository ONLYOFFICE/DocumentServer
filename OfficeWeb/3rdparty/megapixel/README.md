# Mega pixel image rendering library for iOS6 Safari

Fixes iOS6 Safari's image file rendering issue for large size image (over mega-pixel), which causes unexpected subsampling when drawing it in canvas.
By using this library, you can safely render the image with proper stretching.

About iOS Safari's resource limitation and subsampling, see following link:
[http://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariWebContent/CreatingContentforSafarioniPhone/CreatingContentforSafarioniPhone.html#//apple_ref/doc/uid/TP40006482-SW15](http://developer.apple.com/library/safari/#documentation/AppleApplications/Reference/SafariWebContent/CreatingContentforSafarioniPhone/CreatingContentforSafarioniPhone.html#//apple_ref/doc/uid/TP40006482-SW15)

Although it mainly focuses fixing iOS Safari related issues, it can be safely used in the envionments other than iOS6.


## Usage

See ./test directory.


## FAQ
Q. Photos from iPhone is rotated and not in correct orientation.
A. Orientation of jpeg file is recorded in EXIF format. This library won't detect exif information automatically. To detect the information in JavaScript, use exif.js (https://github.com/jseidelin/exif-js).


