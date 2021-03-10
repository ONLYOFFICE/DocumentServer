# ONLYOFFICE Document Server roadmap

This document provides the roadmap of the planned ONLYOFFICE Document Server changes.

This is an updated and corrected version of the roadmap.
We also reserve the right to change it when necessary.

## Version 6.3

### All editors

* Dark theme
* Adding/editing/deleting passwords in the online version
* 150% scaling
* Adding files to Favorites folder*
* New chart types (line and scatter)
* Entering names for anonymous users

\* Should be implemented in DMS as well

### Document editor

* Forms tab
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
* New cell formats: dd/mm, dd/mm/yyyy, dd/mm/yy
* New currency for cell format - Croatian kuna

### Presentation editor

* Transparency setting to slide properties in the right panel
* Column setting for text in a shape on the toolbar
* Buttons for changing text case and highlighting text with color

## Version 6.2

### All editors

* Setting font size up to 300px (up to 409px in spreadsheets) manually
* Navigating through fields (text box, combobox) using Tab/Shift+Tab

### Document editor

* Forms tab (moved to v6.3)
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
