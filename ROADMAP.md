# ONLYOFFICE Document Server roadmap

This document provides the roadmap of the planned ONLYOFFICE Document Server changes.

This is an updated and corrected version of the roadmap.
We also reserve the right to change it when necessary.

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
