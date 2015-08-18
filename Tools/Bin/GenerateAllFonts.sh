#!/bin/sh

DIR="/var/www/onlyoffice/documentserver"

#Start generate AllFonts.js, font thumbnails and font_selection.bin
"$DIR/Tools/AllFontsGen"\
 "/usr/share/fonts"\
 "$DIR/DocService/OfficeWeb/sdk/Common/AllFonts.js"\
 "$DIR/DocService/OfficeWeb/sdk/Common/Images"\
 "$DIR/FileConverterService/Bin/font_selection.bin"
