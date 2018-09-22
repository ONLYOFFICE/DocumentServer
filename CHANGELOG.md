# Change log

## 5.2.0

### New Features

#### All Editors

* New menu with tabbed interface for DocumentServer OpenSource (previously only for paid version)
* Customize initial zoom for the embedded editors
* Customize availability of help in the editor
* Add File and Plugins tabs for viewers
* Mark username by color in the comments, review changes, chat messages
* Show edit-mode users in format
* Don't duplicate online users in the left chat panel
* Sort comments in the popover by ascending creation time

#### Document Editor

* Ability to work with bookmarks
* Ability to add/change hyperlinks anchored to bookmarks/headings
* Change numbering value, start/continue numbering
* Ability to continue numberings
* Content controls settings (highlight and appearance)
* Review changes and comments are in combined window
* Add page presets А0, А1, А2, А6 (bug #36583)
* Enable closing chart dialog while loading (bug #36870)
* Change encoding format for txt files (bug #36998)
* Add mode for filling forms
* Enable closing window when save to txt
* Enable inserting shapes when shape is selected
* Check new revisions in fast co-editing mode
* Save track-changes option for file key

#### Spreadsheet Editor

* Set options for saving in PDF format (bug #34914)
* Cell settings in the right panel
* Add Layout tab: save margins, page size, orientation for sheets,
 align/arrange, group/ungroup objects (shapes, images, charts)
* Added hint for autofilters
* Change encoding format for csv files (bug #36998)
* Enable closing window when save to csv
* Save page options to file before printing
* The following API functions are added: `GetRows`, `GetCols`, `GetCount`,
 `GetHidden`, `SetHidden`, `GetColumnWidth`, `SetColumnWidth`, `GetRowHeight`,
 `SetRowHeight`, `GetWpar`, `SetOffset`, `GetAdress`, `SetLeftMargin`, `GetLeftMargin`,
 `SetRightMargin`, `GetRightMargin`, `SetTopMargin`, `GetTopMargin`, `SetBottomMargin`,
  `GetBottomMargin`, `SetPageOrientation`, `GetPageOrientation`, `GetSelection`
* The following API properties are added: `Rows`, `Cols`, `Count`, `Hidden`,
 `ColumnWidth`, `Width`, `RowHeight`, `Height`, `MergeArea`, `WrapText`, `LeftMargin`,
 `Orientation`, `PrintHeadings`, `PrintGridlines`, `Selection`

#### Presentation Editors

* Add hints to presentation themes (bug #21362)
* Add presenter preview in the viewer (bug #37499)
* Enable closing chart dialog while loading (bug #36870)

#### Mobile Web Editors

* Rename sheets in the mobile editor (bug #37701)

### Fixes

#### All Editors

* Fix lossing comment from other user (bug #37570)

#### DocumentEditor

* Disable bookmarks in the document headers (bug #38957)

#### Spreadsheet Editor

* Fix change active cell in selection across merge. Previously, passing
 through the first cell of the merge range, we fell into the merge range,
 even if it was not selected (through the selection of a row / column)
* Fix selection when selecting row/col/all
* Hide options for headings, gridlines, freeze panes in the viewer (bug #38033)

## 5.1.5

### New feature

#### Back-End

* Add license connections and users limit error to log
* Add license warning limit percents to config and log
* Add check license file for Connections or UserCount errors.  
Add constants UsersCountOS and ConnectionsOS for license result

### Fixes

#### All editors

* Update translations
* Fix JS error while changing shape connector (bug #37788)
* Fix error while changing default tab in shape (bug #38084)
* Fix opening custom color for shape (bug #37841)

#### Spreadsheet Editor

* Fix deleting comments (bug #37772)
* Fix check pane and opening some xlsx files (bug #38113)
* Fix hyphenation position for chinese symbols with wrap
* Fix missed french and spanish formulas
* Fix missed region formats
* Disable table settings when cell is edited

#### Presentation Editor

* Fix copy-paste placeholder in fast coedit (bug #37922)
* Fix bug copy/paste slide with picture (bug #37928)
* Fix placeholder titles in Chinese (bug #37927) ([onlyoffice-owncloud#189](https://github.com/ONLYOFFICE/onlyoffice-owncloud/issues/189))

#### Mobile Editors

* Fix browser hangup while adding shapes (bug #37601)
* Fix js error in specific xlsx file (bug #37824) ([DocumentServer#311](https://github.com/ONLYOFFICE/DocumentServer/issues/311))
* Fix incorrect info while loading document (bug #37687)
* Fix closing document while pressing `Back` button (bug #37649)
* Fix settings icon placement (bug #37738)

#### PDF Viewer

* Fix browser hangup on `adSm.pdf` (bug #37466)

#### Docker

* Fix recursive gzip on container restart ([DocumentServer#317](https://github.com/ONLYOFFICE/DocumentServer/issues/317))

#### Convert Services

* Fix opening some xps files (bug #37565)
* Fix problem with the clip in the EMF (bug #36423)
* Fix bug with calculating inverse matrix in PDF

#### x2t

* Fix shape position in xls ([DocumentServer#308](https://github.com/ONLYOFFICE/DocumentServer/issues/308)))
* Fix losing document after reopen xlsx file (bug #37892) ([DocumentServer#316](https://github.com/ONLYOFFICE/DocumentServer/issues/316))
* Fix open file with unknown picture format

##### odf

* Fix table width in odt (bug #37832)
* Fix users files

##### rtf

* Fix reading rtf comments
* Fix opening file with image in shape (bug #37902)
* Fix users files
* Fix saving plugin data (bug #34747)

##### xls

* Fix problems with multichart files (bug #37945, 37946)
* Fix users files

## 5.1.4
### New feature
#### All editors
* Add warning when open file protected with password
* Don't show resolved comments by default in Document and Spreadsheet editor

#### Back-End
* Add openProtectedFile option to disable opening password-protected files

#### Deb and rpm
* Remove upper version dependency of node.js
* Remove `librabbitmq-tools` dependency

#### x2t
* Bump compatibilityMode setting. Prevent opening files in compatibility mode in Word 2016.
* Windows: add long file names support

### Fixes
#### All editors
* Update translations
* Fix z-index for synchronize tooltip
* Fix position for zoom buttons in the toolbar
* Fix tab 'File' lost active state when click inner panels
* Fix `Replace image by url` in context menu (#37651)
* Fix copy comments from comment balloon (#37666, #35896)
* Fix footnote dialog layout (#37660)
* Fix layout for review changes dialog

#### Document Editor
* Fix getting parent cell in blocklevelstd
* Fix justify chinese text (#37659) [DocumentServer#293](https://github.com/ONLYOFFICE/DocumentServer/issues/293))
* Fix forcus problem with navigation sidebar in Firefox (#37460)
* Fix setting option Realtime collaboration changes to "View All"
* Fix proteced document window layout (#37658)

#### Spreadsheet Editor
* Fix enter formula with arrow keys and scroll
* Fix multiselect autofit column width. Autofit only exist columns (#37555)
* Fix formula dependency and file assemble after copying with drag and drop
* Fix out of memory error in case of insert rows in file with many columns
* Fix incorrect error for chart with empty dataset (#37762)

#### Presentation Editor
* Fix deleting placholder text in strict co-edit (#37712)
* Fix duplicate comments in exported pptx (#37698)
* Fix JS error while opening empty presentation in comment mode (#37679)

#### Mobile Editors
* Disable edit button while document loading
* Fix formulas descriptions (#37691)
* Fix round corners for module windows (#37700)

#### Back-end
* JWT: Remove payload field from jwt when 'inBody' option is on
* Refactor install/uninstall shared libs

#### Deb and rpm
* Fix 'DS_COUNT: command not found' uninstall error in .deb
* Fix uninstall error with documentserver-prepare4shutdown.sh problems in .deb
* Fix libcurl dependency for Ubuntu 18.04

##### x2t
* Fix doc, rtf, xls users files
* Fix exporting current list of XLSX to csv (#37579)
* Fix opening specific pptx file (#37589)
* Fix save comments for presentation (undelete ms office)
* Fix opening specific RTF document (#37500)
* Fix slide theme for ODT export (#37740)
* Fix chart legend in ODS file (#37746)
* Downgrade icu to 58.2 (compatible with WinXp, Win Vista)

## 5.1.3
### New features
#### All editors
* New `View Settings` menu in top right corner
* New selector for links type in Spreadsheet and Presentation Editor
* Ability to replace image via context menu (#11493)
* Customize initial zoom for the embedded editors

#### Document Editor
* Implement an East Asian script and line break in hieroglyphs ([sdkjs#300](https://github.com/ONLYOFFICE/sdkjs/pull/304))
* Add hotkey Ctrl+Shift+Num8 - show/hide non printable symbols
* Add ability to export documents to RTF

#### Spreadsheet Editor
* Add French translation for formulas
* Ability to select Cell format via context menu (#16272)

#### Preseentation Editor
* Add hints to presentation themes (bug #21362)

#### Document Builder
* Add function to get the width of the current column ([sdkjs#315](https://github.com/ONLYOFFICE/sdkjs/pull/315))

#### Back-End
* Update `icu` dependency from `5.5` to `6.0`

#### Mobile Editors
* Ability to go to editing mode from toolbar ([web-apps#135](https://github.com/ONLYOFFICE/web-apps/pull/135))

#### Integration Example
* Support of `ott`, `ots`, `otp` formats

### Fixes
#### All editors
* Improve compatibility with IE11 ([sdkjs#302](https://github.com/ONLYOFFICE/sdkjs/pull/302)) ([sdkjs#317](https://github.com/ONLYOFFICE/sdkjs/pull/317))
* Fix downloading specific docx file (#37454) ([sdkjs#300](https://github.com/ONLYOFFICE/sdkjs/pull/300))
* Fix crash on opening files with empty pie charts ([sdkjs#318](https://github.com/ONLYOFFICE/sdkjs/pull/318))

#### Document Editor
* Fix displaying table after html convert (#37472)
* Fix adding comment to whole doc (#37425, [DocumentServer#287](https://github.com/ONLYOFFICE/DocumentServer/issues/287)) ([sdkjs#319](https://github.com/ONLYOFFICE/sdkjs/pull/319))
* Fix copy Rich Text Content from table (#37546) ([sdkjs#320](https://github.com/ONLYOFFICE/sdkjs/pull/320))

#### Spreadsheet Editor
* Fix formula dependency and file assemble after add col/row ([sdkjs#312](https://github.com/ONLYOFFICE/sdkjs/pull/312))
* Fix opening specific xlsx file (#37515) ([sdkjs#316](https://github.com/ONLYOFFICE/sdkjs/pull/316))

#### Mobile Document Editor
* Fix replacing text while creating new paragraph (#37456)

#### Mobile Spreadsheet Editor
* Fix bug with scrolling

#### x2t
* Fix doc users files with table ([core#71](https://github.com/ONLYOFFICE/core/pull/71))
* Fix opening docx, pptx, rtf, odf usersfiles ([core#75](https://github.com/ONLYOFFICE/core/pull/75)) ([core#76](https://github.com/ONLYOFFICE/core/pull/76))

## 5.1.2
### New features
#### All Editors
* Update help translations

#### Document Editor
* Support of multi comments baloon (bug #37422)

### Fixes
#### All editors
* Fix crash on loading document in Safari 11.1
* Fix undo after copy paste in coedit (bug #37424)
* Fix problems with some thai symbols (bug #37446) ([sdkjs#297](https://github.com/ONLYOFFICE/sdkjs/pull/297))

#### Document Editor
* Fix changing labels of Content Control ([sdkjs#296](https://github.com/ONLYOFFICE/sdkjs/pull/296))
* Fix crash on pdf reconnect or check idle ([sdkjs#291](https://github.com/ONLYOFFICE/sdkjs/pull/291))
* Fix search text in drawing formats ([sdkjs#292](https://github.com/ONLYOFFICE/sdkjs/pull/292))
* Fix problem with loading pdf renamed to docx ([sdkjs#295](https://github.com/ONLYOFFICE/sdkjs/pull/295))

#### Spreadsheet Editor
* Fix copy paste in OpenSource menu (bug #37426)
* Fix Spanish formulas translations
* Fix open pivot tables with VALUES ([sdkjs#298](https://github.com/ONLYOFFICE/sdkjs/pull/298))

#### Presentation Editor
* Fix reporter mode in Safari

#### Back-end
* Fix file corruption after restore connection when version is assembled ([server#80](https://github.com/ONLYOFFICE/server/pull/80))

#### x2t
* Fix mac related build problems
* ppt - fix shape geometry in files from newest ms office

## 5.1.1
### New Features
#### All Editors
* Update translations
* New help entries

#### Spreadsheet Editor
* Add `CONVERT`, `FTEST`, `HYPGEOM.DIST` formulas
* Add Spanish formula translations

#### Back-end
* Add reconnection.attempts, reconnection.delay options to config - applicable for editor-server connection
* Add fonts folder to static content
* Add sockjs config section for testing purposes

### Fixes
#### All Editors
* Hide empty width glyphs fonts in font picker
* Don't save changes for undo/redo in server build mode
* Change size of image pasted form html
* Fix problem in text selection with Shift
* Fix redundant symbol in cell after undo-redo (#37343)
* Fix error with repeated reconnection
* Fix problems with icons of some buttons
* Fix sync coedit button in top toolbar and menu (#37377)

#### Document Editor
* Fix right mouse buttom menu for TOC (#37241)
* Fix usage Clip ParaDrawing by line top and bottom
* Don't clip images in text arts
* Add vertical clip for inline drawing
* Fix problems in drawing inline objects
* Fix bug in calculation text clip rect in documents
* Fix `Cannot read property 'B8a' of null` error in some files (#37378)

#### Spreadsheet Editor
* Fix right mouse button error (#37330)
* Fix inserting hieroglyphs from text editor (#37356)
* Fix bug with enter symbol point in formula autocompleate (#37300)
* Fix bug with enter symbol `_` or `\` in start formula autocompleate (bug #37354)
* Fix bug with enter Chinese numbers in formula autocompleate
* Fix `Cannot read property 'toLocaleString'` error in some files (#37343)
* Fix `Cannot read property '4''` error in some files (#37376)
* Fix sheet context menu visibility (#37307)
* Fix translations for formulas
* Fix inserting function in opened cell (#37348)
* Correct some formulas translations

#### Presentation Editor
* Fix hieroglyph problem in chart title (#37293)
* Fix chart title focus problem in coedit (#37295)
* Fix object selection problem in coedit (#37336)
* Remove `console.log` about `End_CollaborationEditing`
* Clamp scroll_central position
* Bug with clearing cached canvas
* Fix bug in calculation of slide layout bounds
* Fix `Cannot read property 'Ec' of null` error in some files (#37386)

#### Back-end
* Fix font generation
* Fix inconsistent database status after files assemble in case of rapid open/close connection

#### x2t
* Fix reopening files with macros (#37323)
* Fix opening some Docx user files
* Fix opening some XLS user files

#### DesktopEditors
* Fix gradient bug
* Fix printing cell borders (#35367)

## 5.1.0
### New Features
#### All Editors
* New `no squares` font engine, find best replacement font for `□` characters
* Ability to distribute data in tables
* New fonts in default font set
* Fully rewritten composite input for characters
* New header and background color
* Support of shape side panel for images
* Change table size by drag'n'drop
* New bullet list marker - `–`
* Redone connection of second user to document in Strict mode
* Increase supported document size (without media-content)
* New help entries
* Search in help

#### Document Editor
* Ability to set Tab Leader symbols
* Support of Table of Contents
* New `Navigation` left sidebar
* New `Reference` tab
* Rename `Review` tab to `Collaboration`  
* Changes history in Strict Co-Edit
* Rename `Display Modes` entries for Track Changes
* File tab `Go to documents` opens in new tab
* Ability to set negative top and bottom page margin
* Copy paragraph style will not overwright custom run style
* Special paste of tables

#### Spreadsheet Editor
* Custom user cell styles are now placed before default ones
* 8 new formulas: `F.TEST`, `FORECAST.ETS`, `FORECAST.ETS.CONFINT`,
`FORECAST.ETS.SEASONALITY`, `FORECAST.ETS.STAT`, `FORMULATEXT`,
`IFS`, `PDURATION`
* New `None` Table Template
* New editing tools for Pivot Tables
* New regional presets - `Deutsch (Schweiz)`, `Español (México)`,
 `Nederlands (Nederland)`, `Slovenčina (Slovenská republika)`
* New date formats `yy/m/d`, `yy/mm/dd`, `yyyy/m/d`
* CSV preview before opening

#### Presentation Editor
* Special paste
* Presentation level comments

#### Plugins
* Added `Macros` plugin
* Fix plugin autostart problem

#### x2t
* Support a lot of features in xls format (macros, controls etc.)
* Speedup of opening ooxml files on 5-10%
* Better compatibility with OpenFormat, RTF
* Fix a lot of error in user-send files in all supported formats

#### Document Builder
* Add new `GetSheets`, `GetSheet`,  methods
* Add `GetVisible`, `SetVisible`, `GetName` `GetIndex` for ApiWorksheet
* Add getter and setter properties Visible in ApiWorksheet
* Add getter property Index in ApiWorksheet
* Add getter and setter properties Name in ApiWorksheet
* Add getter property Sheets in Api
* Add getter property ActiveCell in ApiWorksheet
* Add function GetValue in ApiRange
* Add getter property Value, function ForEach in ApiRange
* Add function Format in Api
* Add function GetCells in ApiWorksheet
* Add getter property Cells in ApiWorksheet
* Add function GetUsedRange in ApiWorksheet
* Add getter property UsedRange in ApiWorksheet
* Add function GetRowHeight in ApiWorksheet

### Fixes
#### All Editors
* A lot of bugs fixed
* Fix toolbar icons problems
* Fix editing problems while connecting to document with a lot of changes

## 5.0.7
### New Features
#### Licensing
* New license type - by unique users id's and access period

#### Document Builder
* Add a lot of getters and setters
* New methods to AddSheet

#### Spreadsheet Editors
* Add stirkeout, superscript and subscript in top toolbar (bug #26581)

#### Help
* New entries in help for each editor tab

### Fixes
#### All Editors
* Update translations
* Set focus out of the editor frame in IE/Edge

#### Document Editor
* Fix opening docx file with formula in MS Word (bug #36490)
* Fix JS error while inserting Spreadsheet cell with comment (bug #36506)
* Fix bug with inserting the content control in the math equation.
* Fix reset selection from object in header/footer after keyboard move

#### Spreadsheet Editors
* Fix wrong dependence in formula with 3D Ref after removing sheet
* Fix opening odt with chart
* Fix calculating sparkline in some case (bug #36603)
* Fix printing image outside of printed range (bug #36573)

#### Presentation Editor
* Fix shape blocking in coedit for users with different mode (bug #36435)
* Fix chart `Constant proportions` working only once (bug #36494)
* Fix JS error while inserting page number from Document Editor (bug #36508)
* Fix JS error while undo of table (bug #36515)

#### Back-end
* Fix IIS URL Rewrite while uploading image
* Fix ttf fonts not gziped

#### Integration Example
* Remove `Integration Edition` from logo

#### x2t
* Fix some DOCX, DOC, RTF files from users
* Fix DOCX with MathType equations (bug #36524)

## 5.0.6
### New Features
#### Licensing
* New license type - by unique users count

### Fixes
#### Document Editor
* JS Error while inserting empty cell to chart title (bug #36441)
* Remove non-actual Rich Text Content Control help files
* Hide Clipart plugin window if version history opened (bug #36464)

#### Back-end
* Long outbox request authorization headers are reduced (bug #36202)

#### Windows Version
* Fix jwt enabling in ds example

## 5.0.5
### New Features
#### DesktopEditors
* Added two types of restrictions for editing a document - OnlySignatures and View

### Fixes
#### All Editors
* Fix red cross for images in some situations

#### Spreadsheet Editors
* Fix `a.Se is not a function` error while opening file (bug #36344)
* Fix error with merge table colors
* Fix merge cells after apply table template (bug #36405)

#### Presentation Editor
* Check buttons layout in reporter mode
* Disable scroll to target in selectwheel (empty selection)
* Fix applying image as background for several slides (bug #36399)
* Fix mouse slide scroll without change zoom (bug #28096)

#### Plugins
* Fix calling plugins in non-tabbed interface [Docker-DocumentServer#84](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/84)
* Fix crash on unknown ole-object resize
* Yandex.Translate add progress bar

#### x2t
* Fix colors schemes for table cells (bug #36322)
* Fix problem with image in footnote (bug #36380)

#### Back-end
* Fix calculate connections. exclude view users

#### deb
* Fix nodejs dependency (force NodeJS 6 LTS)

#### Document Builder
* Service key size reduced to 20 characters
* Change HTTP error code from 403 to 402 in case of incorrect license

## 5.0.4
### Fixes
#### All Editors
* Remove some unused code
* Fix Polish language bug (altGr + x/c on firefox/edge)
* Fix bug with images paths

#### Document Editor
* Fix bug with removing and adding items from listview (tab list)
* Fix bug with creating several synchronize tips
* Fix line end in thumbnails
* Fix paste simple text to equations
* Fix opening version history

#### Spreadsheet Editor
* Fix JS error for some pivot table styles (bug #36290)
* Check xfIndexNumber when merging styles to avoid errors with column styles
* Fix conditional formatting while changing cell values (bug #36253)

#### Presentation Editor
* Don't disable prev-next buttons for slide demonstration
* Fix presentation demonstration: start from beginning
* Fix notes scroll
* Fix insert text operation duration (bug 36208)
* Fix browser zoom problem with reported pointer

#### Back-end
* Fix conversion task is lost when entering and leaving the editor quickly (endless opening)
* Fix timeout error while first user do not performing save

## 5.0.3
### New Features
#### Distribution
* `onlyoffice-documentserver-integration` renamed to `onlyoffice-documentserver-ie`
* New distribution type for developers - `onlyoffice-documentserver-de`

#### All Editors
* Update limitations messages.
* Added Sogou Pinyin input in Chrome
* Support of fods, fodt, fodp formats

#### Plugins
* New plugins scheme (system & parallel working)

#### Windows Version
* Add 'Accept license' dialog in installation

### Fixes
#### All Editors
* Fix button outlines in Firefox
* Fix `Developer Mode` message rotate in IE11 (bug #36076)

#### Document Editor
* Fix JS error while adding Text Art by Enter (bug #36134)
* Fix cursor while rotating object (bug #36114)

#### Presentation Editor
* Fix reporter mode resize in IE
* Fix bug with position of hyperlink tooltip and slide num tooltip
* Fix slide resize bug
* Fix search in text in placeholder (bug #36133)
* Fix layout in reported mode
* Fix js error in Tables_test.pptx (bug #17147)

#### Embedded viewer
* Fix `Error code -23` (bug #36122)

#### Back-end
* Fix view mode was determined without consideration of permissions.comment

#### RPM
* Fix using SELinux with custom ports

#### Pluging
* Bug with resize cursor in the plugins window
* Fix JS error in running `PhotoEditor` (bug #36050)
* Fix problems with scroll

## 5.0.2
### No public release - SAAS-only version
### New Features
#### Back-end
* Add builder service

#### Plugins
* Ability to autostart plugins

### Fixes
#### All Editors
* Update translations

#### Document Editor
* Fix sending mail in mail-merge (bug #36007)

#### Spreadsheet Editor
* Fix loading table styles

#### Presentation Editor
* Fix bugs in Reporter mode
* Fix moving slide (bug #36031)

## 5.0.1
### No public release - SAAS-only version
### New Features
#### Integration Example
* Support OpenDocument Flat Document file type

### Fixes
#### All Editors
* Update translations and help files
* Fix logo rebranding (bug #35860)
* Fix logo click
* Fix input text after copy comment (bug #35851)

#### Spreadsheet Editor
* Fix "Ctrl+L" hotkey problem (bug #35854)
* Fix "Alt+H" hotkey in Firefox (bug #35857)
* Fix "Ctrl+=" hotkey in Firefox (bug #35853)
* Fix recalculating absolute formulas (bug #28388)
* Fix replacing text in pivot tables (bug #35858)
* Fix incorrect symbols after copy-paste in shape (bug #35913)
* Fix soring in some xlsx (bug #35904)
* Fix table header sort (bug #35950)

#### Presentation Editor
* Fix slide preview mode controls (bug #35440)
* Fix bugs with copy notes
* Fix connector connection problem (bug #35867)
* Fix connector problem with copy-paste (bug #35024)

#### Plugins
* Fix opening Symbols Table (bug #35875)
* Fix hotkeys in Symbols Table (bug #35890)

#### Convertation
* Fix saving changes in html files

#### Rpm
* Fix working with enabled `SELinux`

##### Windows
* Use 64-bit nodejs

## 5.0.0
### No public release - SAAS-only version
### New features
#### Spreadsheet Editor
* Ability to open and save Pivot tables
* 69 new formulas: `AGGREGATE`, `BESSELI`, `BESSELJ`, `BESSELK`,
`BESSELY`, `BINOM.DIST.RANGE`, `BITAND`, `BITLSHIFT`, `BITRSHIFT`,
`BITOR`, `BITXOR`, `CHITEST`, `CHISQ.TEST`, `COVARIANCE.P`,
`COVARIANCE.S`, `DAVERAGE`, `DAYS`, `DCOUNT`, `DCOUNTA`,
`DGET`, `DMAX`, `DPRODUCT`, `DSTDEV`, `DSUM`, `DVAR`,
`ECMA.CEILING`, `ERFC.PRECISE`, `FORECAST.LINEAR`, `ISFORMULA`,
`ISOWEEKNUM`, `MAXIFS`, `MINIFS`, `MINIFS`, `MODE.MULT`, `MODE.SNGL`,
`NEGBINOM.DIST`, `NETWORKDAYS.INTL`, `NORM.DIST`, `NORM.INV`,
`NORM.S.DIST`, `NORM.S.INV`, `QUARTILE.INC`, `QUARTILE.EXC`,
`PERMUTATIONA`, `POISSON.DIST`, `PHI`, `RRI`, `SKEW.P`, `SHEET`,
`SHEETS`, `STDEV.P`, `STDEV.S`, `SWITCH`, `T.TEST`, `TEXTJOIN`,
`TRIMMEAN`, `TTEST`, `UNICODE`, `VAR.P`, `VAR.S`, `WEIBULL`,
`WEIBULL.DIST`, `WORKDAY.INTL`, `Z.TEST`, `ZTEST`

#### Presentation Editor
* Ability to add, open and save presentation notes
* Ability to open and save videos

#### Back-end
* DB optimization, faster opening big files
* Ability to rebuild not-builded, forgotten files
* Open files base64 -> typed array

#### x2t
* Read ooxml and xls files with marcos.
* Support audio and video files in all document formats
* Support pivot tables xls

### Fixes
#### Document Editor
* A lot of bugs fixed

#### Spreadsheet Viewer
* Fix not working keys in IE11 ([DocumentServer#107](https://github.com/ONLYOFFICE/DocumentServer/issues/107))
* Fix COUNTIF formula ignores TRUE and FALSE ([DocumentServer#151](https://github.com/ONLYOFFICE/DocumentServer/issues/151))
* Fix conditional formatting bugs

#### x2t
* Fix a lot of user files
* Fix ods formulas

## 4.4.4
### Windows-only release
### Fixes
* Fix log folder creation in `silent` and `verysilent` setup mode

## 4.4.3
### Fixes
#### Document Editor
* Fix opening some docx (bug #35307)
* Fix chart legend blocking in coedit (bug #35492)

#### Spreadsheet Editor
* Fix change shape size by yellow markers (bug #35451)
* Fix case sensitive VLOOKUP and HLOOKUP (bug #35528, [DocumentServer#140](https://github.com/ONLYOFFICE/DocumentServer/issues/140))

#### Presentation Editor
* Fix comment reply duplication (bug #35408)
* Fix bug with drag-and-drop chart into title

## 4.4.2
### New features
#### Spreadsheet Editor
* Support some more new options in sparklines (bug #35296)

### Fixes
#### Document Editor
* Fix problem with setting tab several time (bug #34923)
* Fix printing in Edge (bug #35323)
* Fix help for moving shape by pixel (bug #34983)
* Fix special paste in fast co-edit (bug #35310)
* Fix duplicates in strict mode after special paste (bug #35312)
* Fixed bug with moving cursor to the start of the document after removing content control.
* Fix minor problems with co-edit in real time (bug #35398, #35399, #35400)
* A lot of fixes in translations

#### Spreadsheet Editor
* Fix box for `Show empty cells as` in Russian (bug #35299)
* Fix sparkline type in setting window (bug #35296)
* Hide not implemented formulas: `CUBEKPIMEMBER`, `CUBEMEMBER`,
`CUBEMEMBERPROPERTY`, `CUBERANKEDMEMBER`, `CUBESET`,
`CUBESETCOUNT`, `CUBEVALUE` (bug #35314)
* Fix JS error in conditional formatting with formula and offset (duplicate variable) (bug #35334)
* Fix JS error in SEARCH formula (bug #35340)
* Fix freeze pane shadow not hiding (bug #35359)
* Fix showing hidden objects
* Fix VLOOKUP format cell
* A lot of fixes in translations

#### Presentation Editor
* Fix changing presentation language if no shape selected (bug #35231)
* Fix columns in placeholder (bug #35074)
* Fix connector losing shape after moving shape in group (bug #35317)
* Fix disconnecting connect after ungrouping (bug #35316)
* Fix hidden markers for connector on chart and image (bug #35300)
* Fix cell link after copy paste (bug #35362, [DocumentServer#122](https://github.com/ONLYOFFICE/DocumentServer/issues/122))
* A lot of fixes in translations

#### Mobile Document Editor
* Remove saving show-snaplines option

#### Mobile Presentation Editor
* Remove saving show-snaplines option

#### x2t
##### odt
* Fix saving some files to odt (bug #35389)

##### txt
* Fix empty txt on opening (bug #35396)

##### xls
* Fix custom shape with connectors

##### ods
* Fix margins
* Fix convert named range with formulas

##### pptx
* Fix audio wav files
* Fix old standard ole

##### ppt
* Fix previous users picture
* Fix read picture stream


#### Document Builder
* Fix problems with printing and saving to `pdf`

#### Desktop Editor
* Fix showing 'Changes saved' message (bug #35358)

## 4.4.1
### New features
#### Document Editor
* Special Paste
* Rich text content support
* Translates for Paragraph Styles
* View mode with comments
* Option to hide solved comments
* Ability to specify custom columns

#### Spreadsheet Editor
* Formulas with conditional formatting
* Ability to specify custom delimiter for CSV import\export
* Added `ACOT`, `ACOTH`, `ARABIC`, `BASE`, `BETA.DIST`, `BETA.INV`, `BETADIST`,
        `BINOM.DIST`, `BINOM.INV`, `CEILING.MATH`, `CEILING.PRECISE`,
        `CHIDIST`, `CHIINV`, `CHISQ.DIST`, `CHISQ.DIST.RT`,
        `CHISQ.INV`, `CHISQ.INV.RT`, `COMBINA`, `CONCAT`, `CONFIDENCE.NORM`,
        `CONFIDENCE.T`, `COT`, `COTH`, `CSC`, `CSCH`, `DECIMAL`, `EXPON.DIST`, `F.DIST`,
        `F.DIST.RT`, `F.INV`, `F.INV.RT`, `FDIST`, `FINV`, `FLOOR.MATH`,
        `FLOOR.PRECISE`, `GAMMA`, `GAMMA.DIST`, `GAMMA.INV`, `GAMMA.PRECISE`,
        `GAMMADIST`, `GAMMAINV`, `GAUSS`, `IFNA`, `IMCOSH`, `IMCOT`, `IMCSC`,
        `IMCSCH`, `IMSEC`, `IMSECH`, `IMSINH `, `IMTAN`, `ISO.CEILING`,
        `LOGNORM.DIST`, `LOGNORM.INV`, `NUMBERVALUE`, `PERCENTILE.EXC`, `PERCENTILE.INC`,
        `PERCENTRANK.EXC`, `PERCENTRANK.INC`, `RANK`, `RANK.AVG`, `RANK.EQ`, `SEC`, `SECH`,
        `T.DIST`, `T.DIST.2T`, `T.DIST.RT`, `T.INV`, `T.INV.2T`, `TDIST`, `TINV`, `XOR` formulas
* Exclude hidden rows from copy, autofill, formatting etc...
* Update active cell color        
* Frozen pane now with shadow        
* Translates for cell styles        
* Search and replace by select
* Option to hide solved comments
* Abitity to specify bullets and numbering for text in shape.
* Ability to specify columns for Text Areas
* Ability to add the connectors for the shapes
* Support `Shift+Delete`, `Ctrl+Insert` and `Shift+Insert` for Cut-Paste

#### Presentation Editor
* Ability to connect shapes via lines
* Ability to specify columns for Text Areas
* Ability to create bullet and number lists in the shapes
* Spellcheker in Presentation Editor
* Ability to download as ODP

#### Plugins
* New type for plugin window (without borders, shadows, buttons)

#### x2t
* Speedup for opening ooxml: windows 200%, linux 20%
* Better converting from/to RTF
* Better support of password protected ooxml, binary ms
* Support of password protected ppt

### Fixes
#### Spreadsheet Editor
* Fix duplicate text after carriage return [DocumentServer#109](https://github.com/ONLYOFFICE/DocumentServer/issues/109)

## 4.4.0
### No public release

## 4.3.6
### Fixes
#### Rebranding
* Fix problems with logos

## 4.3.5
### New Features
#### Document Editor
* Add `showReviewChanges` option to config - auto-open review changes panel

### Fixes
#### Document Editor
* Disable version history for pdf/djvu/xps
* Fix problem with DropCap fonts

#### Spreadsheet Editor
* Limit to 1000 cell styles [DocumentServer#113](https://github.com/ONLYOFFICE/DocumentServer/issues/113)
* Fix adding spacing while copying from Excel
* Fix chart axis position

#### Back-end
* Fix crash on windows 2008r2

## 4.3.4
### Fixes
#### Editors
* Fix open error if sdk loads before fonts [sdkjs#118](https://github.com/ONLYOFFICE/sdkjs/pull/118)
* Fix showing shape without gradient angle (bug #34887)
* Show correct limited functionality notification in IE 9, IE 10

#### Back-end
* Fix using user data from JWT
* Add logs for checkHealth of spellchecker

## 4.3.3
### New features
#### Document Editor
* Kazakh language for spellchecker

#### Docker
* Ability to use PostgreSql storage as volume

### Fixes
#### Document Editor
* Aligning of Footnotes setting in Firefox (bug #34840)
* Fix colors for shapes (bug #34785)
* Fix problem with shapes in table

## 4.3.2
### New features
#### Plugins
* New plugins - Photo Editor and Document Templates

### Fixes
#### Editors
* Minor updates to translations
* Fix Plugins icons in @2x (bug #34681)

#### Document Editor
* Fix moving image to header of another page (bug #34637)
* Fix removing shape if undo of grouping is performed (bug #34654)

#### Spreadsheet Editor
* Fix decreasing size of 3D chart (bug #34685)
* Fix problem with pasting formula, while clicking `paste only value`
* Fix tooltip position in @2x (bug #34678)
* Fix problem with shrink to fit (bug #34758)

#### Presentation Editor
* Fix problem with removing comment (bug #34773)

#### Mobile Web Editors
* Fix problem with opening viewer in OpenSource version

#### Back-end
* Fix infinity loop while URI.parse (bug #34716)
* Fix connection leak on healthCheck

#### docx
* Fix broken docx file with copied chart in shape (bug #34695)

#### document-server-integration
* Fix problem with `Go Back` button

#### Windows Installation
* Fix downloading binaries from sourceforge

## 4.3.1
### Fixes
#### Spreadsheet Editor
* Fix broken files if changing style of unsupported charts (bug #34650)
* Fix stack error while copying a big array of formula data
* Fix rendering 3d diagram in small area (bug #34632)
* Fix change chart's range while applying preset

## 4.3.0
### New Features
#### Editors
* Full support of high-dpi monitors
* Ability to set alternative text for shapes

#### Document Editor
* Undo in Fast co-edit
* Do not hide `All changes saved` in bottom toolbar
* Adding and editing Footnotes
* New languages for spellchecker (43 in total)

#### Spreadsheet Editor
* Support `AVERAGEIFS`, `COUNTIFS`, `SUMIFS` formulas
* Formulas refactoring and improvements
* Totally new Cell Format window with more options
* Sort options window while sorting ranges
* Added direction of sort on filter buttons
* Added filter condition at statistical information
* Added special paste feature
* Added support of surface chart
* New cell borders styles (11 in total)

#### Presentation Editor
* Undo in Fast co-edit

#### Mobile Web Editors
* Completely new mobile web editors

#### Back-end
* Ability to run documentserver on custom port
* Ability to check and kick-out idled users
* Ability to perform forced save (by timeout and by button)

#### x2t
* Optimization and speed-up
* Better support of all formats, including (but not limited to):

##### DOC
* Background page

##### XLS
* Data validation
* Decryptor

##### ODF
* Global settings for documents
* SVG refactor
* Background page (image, pattern, gradient)
* Convert smart art
* Sheet/Workbook views
* Support convert OLE objects (and other embedded)

##### RTF
* Generate replacement text hyperlink if absent
* Office digital signatures
* Extended drawings
* Custom shapes
* Text in drawing shapes

#### Plugins
* A lot new plugins feature

### Fixes
#### Document Editor
* Fixed an issue with drag-n-drop a table inside a footnote (bug #33548)
* Fixed an issue with crop of shape group (bug #33110)

#### Spreadsheet Editor
* Fixed an issue with absolute reference when inserting a new row (ONLYOFFICE/DocumentServer#41)
* Fixed an issue with onDocumentStateChange event (ONLYOFFICE/DocumentServer#88)
* Fixed an issue with formulas translation (ONLYOFFICE/DesktopEditors#23)
* Fixed an issue with password-protected xlsx (ONLYOFFICE/DesktopEditors#24)
* Fixed an issue with non-breaking space (ONLYOFFICE/DesktopEditors#26)
* Fixed an issue with AVERAGEA formula with text format
* Fixed an issue with broken workbook after list copy (bug #33588)
* Fixed an issue with formula recalculation by F4 hotkey (bug #32901)
* Fixed an issue with SUMIFS formula (bug #33602)
* Fixed an issue with inserting image size (bug #33604)
* Fixed an issue with zero values sparklines (bug #33612)
* Fixed an issue with changing number format while changing regional format (bug #31395)
* Fixed an issue with replacing formula delimiters (bug #33608)
* Fixed an issue with cell size while drag'n'drop (bug #33607)
* Fixed an issue with cursor size in @2x (bug #33606)
* A whole lot more minor and big bugfixes

## 4.2.11
### New features
#### Editors
* Add ability to hide `about` and left toolbar at all (only for licensed users)

### Fixes
#### Back-end
* Fix jwt token without 'permissions' field breaks downloadAs

## 4.2.10
### Fixes
#### Embedded viewers
* Fix default position top for toolbar

#### Licensing
* Without license file chat and comments buttons are available.

#### Back-end
* Fix problem with jwt access tokens

## 4.2.9
### New Features
#### Spreadsheet Editor
* Polish languages for formulas

### Fixes
#### Spreadsheet Editor
* Fix wrong order of elements in equations (bug #34029)

## 4.2.8
### Fixes
#### Spreadsheet Editor
* Fix entering symbols with diacritical sign (bug #33908)
* Fix horizontal scroll by trackpad (bug #27197)

#### Plugins
* Allow interface customization using plugins

#### Back-end
* Minor fixes for logging and status codes

## 4.2.7
### Fixes
### All Editors
* Do not perform save if there is no changes to save

#### Spreadsheet Editor
* Fix assembling files with Ranges in rare cases

#### Document Convert
* Fix convert xlsx to csv

#### Back-end
* Fix compiling server, if `PRODUCT_VERSION` and `BUILD_NUMBER` variables are not defined

## 4.2.6
### No public release

## 4.2.5
### Fixes
#### All Editors
* Fix a rare problem with saving file with specific type of Chart

#### Presentation Editor
* Fix a problem with saving file with notes, copied from Document Editor
* Fix a problem with saving file with chart, copied from Presentation Editor

#### Back-end
* Fix closing connection until connection is fully opened

## 4.2.4
### Fixes
#### Document Editor
* Fix problem with losing changes while several users enter text at same time (bug #33726)
* Fix bug with positioning of cursor after function InsertContent.

#### Spreadsheet Editor
* Fix `Match` formula return value in some cases (bug #33735)

#### Desktop Editor
* Fix problems with copy-paste

#### Back-end
* Fix lost `Asana-Math` font in default installation, need for equations

## 4.2.3
### Fixes
#### Spreadsheet Editor
* Fix using formulas with references on other sheets

#### Presentation Editor
* Fix timeout error while printing some pptx files.

#### Document Convert
* Fix problem with convert to pdf converted only first page

#### Licensing
* Without license file chat and comments buttons are unavailable. Also
edit customer information and logo image at header of editors is not supported.

## 4.2.2
### Fixes
#### Presentation Editor
* Fix problem with opening password-protected presentations

## 4.2.1
### Fixes
#### Document Editor
* Fix broken `Insert number of page` button
* Fix problem with duplicate of last hieroglyph
* Fix problem with changing chart type from 2D to 3D (bug #33284)

#### Spreadsheet Editor
* JS Error while adding chart in IE and Edge (bug #33597)
* Fix problem with empty cell while changing sparklines (bug #33598)

#### x2t
* Improve compatibility with `doc` format

## 4.2.0
### New Features
#### All Editors
* Ability to set dash type for shapes
* Redesigned embedded viewers
* Better support of HiDPI systems
* Update bootstrap to 3.3.7

#### Document Editor
* Ability to set `Fit to Page` and `Fit to Width` as default zoom value
* Ability to open and edit Footnotes
* Ability to insert number of pages in document
* Redone Version History. Ability to hide minor features.

#### Spreadsheet Editor
* Add ability to insert Equations in Spreadsheet Editor
* Ability to open and edit Sparklines
* Add new formula `SUMIFS`
* Ability to select data from drop-down menu in context menu
* Add multiselect support
* Add rotation of 3D Charts
* Update and improve visual styles for all chart types
* Bring back `Freeze Panes` in `View Settings` menu
* New algorithm for calculating cell height

#### Presentation Editor
* Ability to set `Fit to Width` as default zoom value
* Add ability to insert Equations in Presentation Editor

#### Back-end
* Update `nodejs` from 4.2.0 to current LTS release: 6.9.1

### Fixes
#### Spreadsheet Editor
* Fixed issue [#63](https://github.com/ONLYOFFICE/DocumentServer/issues/63)

#### x2t
* Fixed issue [#55](https://github.com/ONLYOFFICE/DocumentServer/issues/55)

## 4.1.8
### Fixes
#### License
* Minor fix for better license compatibility with 'Hide Menu' functionality

## 4.1.7
### Fixes
#### Editors
* Fix JS error on opening document in IE 9 and IE 10

## 4.1.6
### New features
#### Editors
* Add ability to hide menu bars in Editors via config

## 4.1.5
### Fixes
#### Editors
* Fix copy-paste on macOS Sierra

#### Plugins
* Fix image load and OLE problems
* Viewers do not show plugins any more

## 4.1.4
### Fixes
#### Back-end
* ipfilter can use dns to lookup

## 4.1.3
### New features
#### Plugins
* Sample plugins are enabled by default

## 4.1.2
### New features
#### Back-end
* Use PostgreSQL instead of MySQL on back-end
* Ability to filter users using ipfilter

#### Editors
* Whole-new code handling text input. Better support of languages using hieroglyphs
* Whole-new copy-paste with better compatible with external sources

### Changes
* Improvements in opening of all supported formats

### Fixes
* A lot small bugfixes in all modules of product

## 4.0.3
### Changes
* Ability to use full-toolbar mode in editors with standard license.<br>
Previously users of standard license are forced to use only compact toolbar.

## 4.0.2
### Fixes
#### Spreadsheet Editor
* Fix losing comments on second or further worksheet (bug #32895)
* Fix losing empty values of data with format different of General in autofilter (bug #32805)

#### document-server-integration
* Minor fixes
