# Change log

## 4.3.0
### New Features
#### Editors
* Full support of high-dpi monitors
* Ability to set alternative text for shapes

#### Document Editor
* Undo-Redo in Fast co-edit
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
* Undo-Redo in Fast co-edit

#### Mobile Web Editors
* Completely new mobile web editors

#### Back-end
* Ability to run documentserver on custom port
* Ability to check and kick-out idled users
* Ability to perform forced save (by timeout and by button)

#### x2t
* Extended reading xml (in pptx), sppr, txpr in chart without DrawingConverter
* Faster working with chart without office_drawing
* OfficeUtils - add sort for compress
* Remove libxml2 from DocxFormat

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
* Fixed an issue with absolute reference when inserting a new row (#41)
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

#### x2t
* Improve compatibility with all supported formats

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

