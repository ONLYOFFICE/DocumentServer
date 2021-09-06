# ONLYOFFICE Document Server roadmap

This document provides the roadmap of the planned ONLYOFFICE Document Server changes.

This is an updated and corrected version of the roadmap.
We also reserve the right to change it when necessary.

## Version 6.5

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
