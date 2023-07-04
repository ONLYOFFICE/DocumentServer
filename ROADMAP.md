# ONLYOFFICE Document Server roadmap

This document provides the roadmap of the planned ONLYOFFICE Document Server changes.

This is an updated and corrected version of the roadmap.
We also reserve the right to change it when necessary.

## Version 7.5

### All editors

* Working on RTL in the editors core
* The ability to sign a file in the web version
* Switching to the common history for all editors
* Advanced settings for the `AutoCorrect` feature
* Work with styles and hidden styles
* New types of charts
* The ability to add words to the dictionary for spell
checking in the web version
* Support for SVG

### Forms

* Improvement of form fields. Advanced settings
* Field templates. Working on new fields
* Filling in forms by roles. Signing forms. Application for signing

### Document Editor

* Development of automatic hyphenation

### Spreadsheet Editor

* Support for `Undo` in the Fast co-editing mode
* Inserting images into headers/footers
* New types of formulas
* The ability to display only formulas in cells
* The ability to save spreadsheets to the .csv format with
a separator which differs from comma
* The `Show details` feature for working with a Pivot Table.
Improvement of the ability to open data on a new sheet
by double-clicking a value in a Pivot Table
* Autocompletion for days of the week and months
when stretching a cell value

### Presentation Editor

* New types of animations and transitions

### PDF Viewer

* Support for the PDF forms. Annotations

### Server

* Support for mssql, oracle, and other databases

### Mobile editors

* Support for protection
* Working on the common engine for the native part of mobile applications.
The ability to download sdk on Android and edit files on portals natively,
instead of using the mobile web version

## Version 7.4

### All editors

* File menu reworked: added file names, new Protect tab
* New interface language: Sinhala (Sri Lanka)
* New locale: Dansk (Danmark)
* Support for opening the following formats: MHTML, SXC, ET, ETT, SXI, DPS,
DPT, SXW, STW, WPS, WPT
* New embedded Help language: Turkish
* New feature: text tips for color palettes
* New feature: headers for columns in lists
* New feature: Draw tab
* New feature: Eyedropper for color palettes
* New interface scaling options: 250/300/350/400/450/500%
* New feature: saving objects as pictures
* New feature: copy formatting for graphic objects
* New diagram type: Radar
* New feature: opacity setting for border lines of graphic objects
* Plugin Manager: added Search bar and categories

### Forms

* New feature: no form field filling in edit mode
* New feature: Default value field on the right panel
* New feature: add new form without exiting the current one
* Fixed-form tracking fix
* New API method: filling forms in the interface
* Minor bug fixes

### Document Editor

* New feature: advanced settings for layout columns
* Updated list settings: advanced settings for numbered and multi-level lists,
the Recently Used tab for list types, creating lists in the dialogue window
* New feature: Combine documents
* New feature: exceptions for letter capitalization in AutoCorrect
* Support for saving documents in PNG and JPG formats

### Spreadsheet Editor

* New feature: Print range for spreadsheets
* New formula language: Armenian
* New feature: First page number in print settings
* New feature: Page Break Preview on the View tab
* New feature: Change case
* New number formats: Short Date and Long Date
* New feature: Show Values as for pivot tables
* New contextual menu items for pivot tables
* New functions: SEQUENCE, XMATCH, EXPAND, FILTER, ARRAYTOTEXT, SORT
* New feature: protecting ranges while selecting certain users with editing rights
* The Allow edit ranges button moved to the Protect sheet dialogue window
* Support for saving spreadsheets in PNG and JPG formats

### Presentation Editor

* New feature: exceptions for letter capitalization in AutoCorrect

### Mobile web editors

* New interface language: Sinhala (Sri Lanka)

### Mobile

* New formula languages

### Plugins

* Zotero plugin updated to 1.0.1: updating bibliography and citation fields,
data synchronization with Zotero, converting fields to text for
improved compatibility with other editors

### API updates

* New database: Dameng
* New feature: font size customization
* New license check parameter: start_date
* New WOPI discovery parameters: mobileView and mobileEdit action to open
mobile editors
* New plugin methods to return and replace the current word/sentence
* New editor configuration parameter: hiding the Draw tab
* node-redis connector updated to 4.6.5
* JS core debug in Chrome
* New feature added: pluginsmanager

## Version 7.3

### All editors

* Styles panel now fits the whole number of visible styles
* Table templates are now categorized
* New feature: 3D rotation for diagrams
* New dictionaries: Uzbek (Cyrillic + Latin)
* New feature: presets for inserting text boxes
* New feature: hiding right and left sidebars via the View tab
* New feature: quick access panel for equations
* New feature: changing the size of dialog windows for charts, OLE-objects
and Mail Merge recipients
* New feature: error bars
* New feature: inserting Smart Art objects

### Document Editor

* Support for equations in Unicode and LaTeX
* New feature: word count in the status bar
* Document password protection update: editing rights restriction

### Spreadsheet Editor

* Templates for tables, pivot tables, cell styles are now categorized
* New feature: Watch Window for functions
* New Paste Special feature: links to other files within the portal
* New functions added: TEXTBEFORE, TEXTAFTER, TEXTSPLIT, VSTACK, HSTACK, TOROW,
TOCOL, WRAPROWS, WRAPCOLS, TAKE, DROP, CHOOSEROWS, CHOOSECOLS

### Presentation Editor

* New setting: adjusting guidelines via the View tab
* New feature: Paste Special for slides

### Mobile

* New feature: Sharing Settings

## Version 7.2

### All editors

* Ability to rename document at the top of the editor window
* Warning when a macro makes a request to any URL
* Search field is reworked
* The `View` tab is available in read-only mode and comment mode
* Ability to edit OLE objects
* Advanced settings are reworked
* Ability to enable/disable using the Option key to navigate
the editors via keyboard
* Web editor interface theme can be synchronized with the
system theme
* New web editor info: the `About` section contains build number
* New search panel in the embedded versions of the
Document Editor and the Spreadsheet Editor
* Top toolbar is reworked
* New interface languages: Basque, Malay,
Portuguese (Portugal), Chinese (Traditional, Taiwan)

### Forms

* New interface language: Indonesian
* Ability to add tags

### Document Editor

* New interface language: Indonesian
* PDF viewer navigation panel is renamed and has its own settings:
expand/collapse all, expand to level X, font size, wrap headings
* Ability to remove headers/footers via toolbar
* Ability to include current title in the table of contents via toolbar
and designated button
* New spellcheck settings in the advanced settings

### Spreadsheet Editor

* Ability to use custom images as bullets in bullet lists
* Ability to switch rows/columns using the diagram settings
in the right panel

### Presentation Editor

* New spellcheck settings in the advanced settings
* Support for PPSX files, they open in preview mode
* Ability to use custom images as bullets in bullet lists
* Reworked advanced settings' `Placement` tab for precise
positioning of images, tables, and charts

### Mobile

* New interface language: Indonesian
* New features in the Document Editor: header navigation,
ability to add table of contents and configure its setting

### Plugins

* New translation mechanic in plugins: ability to add `langs.json`
to folder with translations;  first there is a request for a full match
in file name and language, then up to the `-` symbol

### API updates

* New feature: live viewer for tracking changes in real-time
* The Document Server information contains live viewer/editor data
* New interface translation support: 4-letter language designation
is supported. Currently it is used for Portuguese (Portugal) and
Chinese (Traditional, Taiwan)

### WOPI

* Ability to open embedded viewer in WOPI discovery

## Version 7.1

### All editors

* New menu for inserting autoshapes
* Ability to edit points of a selected autoshape
* Ability to open new diagram types: Pyramid, Bar (Pyramid),
vertical and horizontal cylinders, vertical and horizontal cones
* Ability to crop a selected image to shape
* Sorting comments on the left sidebar by group
* Ability to see your file protection password when entering it

### Forms

* Ability to zoom a form

### Document editor

* Ability to use the Page Thumbnails panel and to display
the document's contents on the left sidebar for PDF files
* Ability to use special symbols when searching documents
* Ability to add a period with double-space

### Spreadsheet editor

* New view settings: Combine sheet and status bars,
Always show toolbar, Interface theme, Show frozen panes shadow
* New currency: CFP franc
* Using tips when working with formulas for tables
* Ability to set a text qualifier when importing text from TXT/CSV
* Using a built-in preview panel before printing out a spreadsheet

### Presentation editor

* Ability to duplicate slides using the `Add slide` menu
* Ability to move a slide to beginning/end using a slide context menu
* Ability to insert recently used shapes using a new panel on the `Insert` tab
* Ability to add a period with double-space

### API updates

* The last `callbackUrl`  is needed for sending a link to a compiled file
if a file was edited by the same user on different tabs
* New environment variable `X2T_MEMORY_LIMIT` limiting memory
for the x2t process
* New sections `Features` and `Layout` for `Customization`,
the following parameters are renamed: `leftMenu` -> `layout.leftMenu`,
`rightMenu` -> `layout.rightMenu`, `toolbar` -> `layout.toolbar`,
`statusBar` -> `layout.statusBar`, `spellcheck` -> `features.spellcheck`
* Ability to see the `customer_id` and the build type on `index.html`

## Version 7.0

### All editors

* Sorting comments on the left sidebar by date and author
* Ability to change document settings using the `alt` + `key` keyboard shortcuts
* DarkMode
* Changing contents of the `Create new...` section in the `File` menu

### Document editor

* Ability to choose the display mode for review changes:
Show by click in balloons, Show by hover in tooltips
* Ability to choose mail merge data from a local file and from URL
* Hyperlinks autocorrect

### Spreadsheet editor

* Button with the sheet list to switch to the certain sheet
* Descriptions and names of function arguments in Portuguese (Brazil)
* Opening / saving a query table
* Version history
* Ability to open the status bar in two bars
* `Saving status` block in the status bar
* Ability to protect a workbook and sheet in the `Protection` tab
* Displaying selections made by other users

### Presentation editor

* Ability to show animations contained in a file
* Moving slide transition settings from the right-side panel
to the `Transitions` tab of the top toolbar
* Hyperlinks autocorrect

### API updates

* Ability to add additional interface themes
* New  `outputtype: "ooxml", "odf"` types in the  `conversionapi` to convert
files to any format (docx, docm, xlsx, xlsm, pptx, pptm, or odt, ods, odp)
* When opening documents with macros, the `downloadAs` panel contains
the docm, xlsm, pptm formats (determined by the `fileType` parameter)
* `assemblyFormatAsOrigin` parameter is enabled by default to save
the assemblied file in the same format, in which it is opened
* New `review` section and new `hideReviewDisplay`, `showReviewChanges`,
`reviewDisplay`, `trackChanges`, `hoverMode` parameters
in the `customization` section of the document editor config
* New `fileType parameter` for `onDownloadAs`, `onRequestSaveAs`,
`onRequestRestore`
* Ability to insert several images from the portal using
the `insertImage` method

## Version 6.4

### All editors

* Web Application Open Platform Interface (WOPI) support
* 125% and 175% scaling
* Resolving all comments
* Support for chart styles
* Chart styles for people with disabilities
* New previews for bulleted, numbered, multi-level lists
* Navigating controls (checkbox, radiobox, button with text) using Tab/Shift+Tab
* Updated work on the client:
  * Decoding pictures in all popular raster formats
  * Working with zip archives (open / save / edit)
  * Digital signatures

### Document editor

* Converting text to tables and vice versa
* Auto-capitalization for the 1st word in a sentence

### Spreadsheet editor

* Adding/setting/deleting conditional formatting
* Adding sparklines
* Importing data from txt and csv
* Changing select on Tab+Enter
* Ability to assign a macro to be executed when you click on a graphic object
* Descriptions and names of function arguments in Polish,
  Japanese, Korean, Latvian, Lao, Norwegian, Romanian, Slovak,
  Slovenian, Swedish, Turkish, Vietnamese, Catalan, Czech, Chinese, Danish, Dutch,
  Finnish, Greek, Hungarian, Indonesian, Bulgarian, Portuguese, Ukrainian
* Hyperlinks autocorrect
* Presets for Freeze Panes
* Setting for displaying zeros in cells (Show zeros)
* Argument names in the function setting dialog
* Storing comment threads in a spreadsheet

### Presentation editor

* Version history
* Setting to hide the notes panel
* Auto-capitalization for the 1st word in a sentence

### Mobile web editors

* Rework on ReactJS

### API updates

* `requestClose` method for closing the editor
* Differentiation of access rights to commenting
* Setting the default co-editing mode and ability to prohibit changing it
* `customization.hideNotes` parameter to hide the notes panel in presentations
* New methods and properties for `ApiRange` for `apiBuilder` (spreadsheets)
* `editorConfig.customization.uiTheme` to set the interface theme

## Version 6.3

### All editors

* Dark theme
* Adding/editing/deleting passwords in the online version
* 150% scaling
* Adding files to Favorites folder*
* New chart types (line and scatter)
* Hints on creating macros
* New scheme for the spellchecker (local work)
* Entering names for anonymous users

\* Should be implemented in DMS as well

### Document editor

* Button to change wrapping settings on the toolbar (Layout tab)
* Changing indent in the paragraph settings on the right panel
* Changing text case
* Changing list levels
* Fixed color set in the color picker for forms/content controls
* Saving Track Changes status to file
* Downloading files as/saving as HTML, FB2, EPUB

### Spreadsheet editor

* Combo chart settings
* `XLOOKUP` function
* Grouping/ungrouping data in pivot tables
* Left/right indent to align cell content
* New cell formats: dd/mm, dd/mm/yyyy, dd/mm/yy
* New currency for cell format - Croatian kuna

### Presentation editor

* Transparency setting to slide properties in the right panel
* Column setting for text in a shape on the toolbar
* Buttons for changing text case and highlighting text with color
* Preserving animations already added to the presentation.

## Version 6.2

### All editors

* Setting font size up to 300px (up to 409px in spreadsheets) manually
* Navigating through fields (text box, combobox) using Tab/Shift+Tab

### Document editor

* New options to work with text fields
* Table of figures

### Spreadsheet editor

* Autoexpansion for formatted tables
* Slicers for pivot tables
* Data validation settings for cells
* Custom number format
* `GROWTH`, `TREND`, `LOGEST`, `UNIQUE`, `MUNIT`, `RANDARRAY` functions

### Presentation editor

* Autoformat as you type settings
* Increment/decrement font size buttons on the toolbar

### Plugins

* Enabling Track Changes in all docs by default

### Desktop

* New Document Server integration scheme

### iOS app

* The source code of the documents module is public

### API

`customization.trackChanges` parameter to enable/disable Track Changes by default

`customization.toolbarHideFileName` to hide the doc's name from the toolbar

## Version 6.1

### All editors

* New options for operations with objects:
  * setting an arbitrary angle for a gradient fill
  * setting the picker position using a spinner in the fill settings
  * buttons for adding/removing the current picker
  * adding a new picker - without changing the current view of the gradient
* New options for proofing:
  * editing AutoCorrect options for math equations
  * recognized functions
  * autoformatting as you type
* Icons for context menu
* New File panel
* `Help` parameter for plugins

### Document editor

* Line numbers
* Inserting, editing, and converting endnotes
* Creating cross-references
* Fb2 for viewing and html/epub/mht available for all platforms
* Differentiation for reviewing permissions

### Spreadsheet editor

* Button to insert a pivot table in the Insert tab
* Custom sheet view
* Additional options for editing chart data (series and categories)
* Setting the shadows display for locked areas
