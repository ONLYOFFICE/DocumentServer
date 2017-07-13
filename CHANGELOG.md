# Change log

## 4.4.2
### New features
#### Spreadsheet Editor
* Support some more new options in sparklines (bug #35296)

### Fixes
#### Document Editor
* Fix problem with setting tab several time (bug #34923)
* Fix printing in Edge (bug #35323)
* Fix help for moving shape by pixel (bug #24983)
* Fix special paste in fast co-edit (bug #35310)
* Fix duplicates in strict mode after special paste (bug #35312)

#### Spreadsheet Editor
* Fix box for `Show empty cells as` in Russian (bug #35299)
* Fix sparkline type in setting window (bug #35296)
* Hide not implemented formulas: `CUBEKPIMEMBER`, `CUBEMEMBER`, 
`CUBEMEMBERPROPERTY`, `CUBERANKEDMEMBER`, `CUBESET`, 
`CUBESETCOUNT`, `CUBEVALUE` (bug #35314)
* Fix JS error in conditional formatting with formula and offset (duplicate variable) (bug #35334)
* Fix JS error in SEARCH formula (bug #35340)
* Fix freeze pane shadow not hiding (bug #35359)

#### Presentation Editor
* Fix changing presentation language if no shape selected (bug #35231)
* Fix columns in placeholder (bug #35074)
* Fix connector losing shape after moving shape in group (bug #35317) 
* Fix disconnecting connect after ungrouping (bug #35316) 
* Fix hidden markers for connector on chart and image (bug #35300)
* Fix cell link after copy paste (bug #35362, [DocumentServer#122](https://github.com/ONLYOFFICE/DocumentServer/issues/122))

#### x2t
##### xls
* Fix custom shape with connectors

##### ods
* Fix margins

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
* Abitity to specify custom columns

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
* Better convertation from/to RTF
* Better support of password protected ooxml, binary ms
* Support of password protected ppt

## 4.4.0
### No public release

## 4.3.6
### Fixes
#### Rebranding
* Fix problems with logos

## 4.3.5
### New Feature
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

