# Change log

## 9.0.3

### New features

#### Spreadsheet Editor

* Enabled the ability to insert a range of cells as an image
  using navigator.clipboard ([DocumentServer#985](https://github.com/ONLYOFFICE/DocumentServer/issues/985))

#### Customization

* Added the ability to hide the document title in the toolbar
  using the `customization.toolbarHideFileName` parameter

### Fixes

#### All Editors

* The display of the cursor and text selection is now limited by the size
  of the object/shape
* Fixed some icons for Modern themes when the interface scale
  is higher than 200%
* Improved appearance of the autoshape Merge/Flip icons for the Modern themes

#### Document Editor

* Fixed stopping work of the editor when editing footer in some `DOCX` files
* Fixed errors during Compare/Combine/Text from file operations with files
  containing images
* Fixed a crash when restoring a placeholder with a list when deleting
  Content Control content
* Fixed significant increasing of the file size due to including CJK fonts
  when exporting to `PDF` ([DocumentServer#2934](https://github.com/ONLYOFFICE/DocumentServer/issues/2934))

#### Spreadsheet Editor

* Fixed stopping work of the editor when trying to reference
  a cell with a formula ([DocumentServer#3314](https://github.com/ONLYOFFICE/DocumentServer/issues/3314))
* Fixed appearing the #NAME error in the final file when using
  a custom function and exporting to `PDF`
* Fixed a problem with saving custom function to a file
* Fixed an issue with autofitting row height when changing column width
  if Wrap Text is applied to a cell
* Fixed display of the Zoom option value in the bottom toolbar in RTL UI
  with the Sheet RTL option disabled
* Fixed the incorrect position of the percent sign in the status bar for Zoom
  with Chinese (Simplified) ([DocumentServer#3313](https://github.com/ONLYOFFICE/DocumentServer/issues/3313))

#### Presentation Editor

* Fixed stopping work of the editor when applying some animations
  from the Emphasis Effects section to an image
* Fixed the editor crash when deleting slides sequentially from preview panel
* Fixed stopping work of the editor when copying all content on the slide
  in some `PPTX` files
* Fixed incorrect translations of tools in the Draw menu
  of the Presenter View window

#### Forms

* Fixed stopping work of the editor after applying the TextArt setting
  to the Signature field
* Fixed stopping work of the editor when restoring a file connection
  after a long period of inactivity
* Fixed cursor change for Content Control buttons
* Fixed missing the Clear Fields icons in the form viewing mode
  for the Modern themes

#### PDF Editor

* Fixed stopping work of the editor when performing Cut/Paste operations
  simultaneously on the thumbnail panel
* Fixed display of the text after breaking and restoring a session when working
  with some `PDF` files
* Fixed saving form field settings when there are no other changes
  in the editor
* Blocked the ability to change the contents of the document
  when the connection is lost
* Fixed an error when trying to copy page contents from the thumbnail panel
  for `XPS/DjVu`
* Blocked the ability to display of the form field titles in the embedded mode
* Fixed display of the form field highlight when undoing and redoing actions
* Fixed blocking the ability to enter text immediately after inserting
  a Text Comment

#### Diagram

* Fixed display of the slide in the working area when opening some `VSTX` files

#### Convert

* Fixed crash when converting some `DOCX` files to an image
* Fixed crash when converting some `HWP` files to the binary format
* Fixed endless conversion of some `HWP` files to the binary format
* Fixed endless conversion of some `DOC` files to the binary format
* Fixed the appearance of an error when opening the result of converting
  some `HWP` files to `DOCX` in third-party editors
* Fixed crash when converting some `DOC` files to the binary format
* Fixed the appearance of an error when opening the result of converting
  some `XLS` files to `XLSX` in third-party editors
* Fixed crash when converting some `DOCX` files to the binary format
* Fixed the difference in display of autoshapes after converting
  some `VSDX` files to `PNG`

#### Back-end

* Fixed Configuration save error when saving or resetting AI settings
  on /info when using own runtime.json

#### Mobile

* Fixed the ability to copy contents when initializing the editor
  with the `permissions.copy: false` parameter

## 9.0.2

### Fixes

#### All Editors

* The default Tab style view has been changed to a Line for modern themes

#### Document Editor

* Fixed the problem with header/footer calculation
* Fixed an issue with the first calculation of the document when opened
  document has collaborative changes

#### Spreadsheet Editor

* Fixed the editor crash when exporting `XLSX` files to `PDF`

#### Forms

* Fixed the opening of filled `PDF Forms` in Form and Virtual Data Rooms
  on DocSpace

## 9.0.1

### No public release

## 9.0.0

### New features

#### All Editors

* Added new interface themes: Modern Light and Modern Dark
* Added saving of the last selected languages in spellcheck lists
* Added Arabic spellcheck dictionary used in sixteen dialects
* Added AI-powered macro generation from descriptions and VBA-to-JavaScript
  conversion
* Added the interface translation into Urdu (ur-PK, Urdu (Pakistan))
* Added support for TextArt text settings inside chart labels
* Added support for drawing the Up/Down Bars chart elements

#### Document Editor

* Added correct display of previews for paragraph numbers for RTL
* Improved positioning and settings of TextArt for RTL
* Improved drawing of borders and fill for paragraphs with RTL direction
* Enabled accurate cursor navigation with arrow keys based on the paragraph's
  text direction
* Added the ability to display numbers using Hindi digits
* Added a setting in the File menu for selecting the preferred font size:
  Western/Chinese for the Chinese interface language (Chinese (Simplified))
* Added a Borders button to the Home toolbar to quickly set paragraph settings
* Added support for the `MD` format for reading

#### Spreadsheet Editor

* Added support for displaying bidirectional text
* Added the ability to select external data from another spreadsheet

#### Presentation Editor

* Added the ability to set the paragraph direction (Text Direction > RTL)
  on the toolbar and in the advanced settings
* Added the ability to view animations with text
* Added the "Preserve" option to the Slide Master context menu

#### Forms

* Changed the appearance of the Signature and Image fields: the placeholder
  and signature icon are now always displayed
* Improved user experience when filling in the Signature and Image fields
* Added a new `"type": "signature"` for the Signature field, used in the process
  of filling out forms

#### PDF Editor

* Added the ability to set RTL direction for text
* The Edit Text option is available in the Community Edition build
* Implemented a `PDF` form editor
* Added copying pages between `PDF` files

#### Diagrams

* Release of the first version of the Diagram Viewer with the ability
  to open `VSDX` files

#### Convert

* Added conversion of the `XLSB` format to the editor's internal format,
  allowing editing and saving in `XLSX` without preliminary conversion

#### Back-end

* Added support for Azure Blob Storage (`storage.name = "storage-az"`)
  for editor cache. To use, specify the endpoint, `bucketName`
  and `credentials` (`accessKeyId` and `secretAccessKey`)
* Added flag `storage.useDirectStorageUrls` (`bool`), which controls the issuance
  of links to external storages: direct links or proxying through the server
* Added the ability to prepare static editor data (`html`, `css`, `js`, `fonts`)
  in the browser cache before opening the document using the
  `?preload=placeholder` parameter to the link to `api.js` or a hidden `iframe`
  with `preload.html` located next to `api.js`
* Added setting `runtimeConfig.filePath` - path to dynamic server config,
  allowing to change parameters without restarting, similar to tenant configs
* Added the ability to set parameters and keys of AI models used in editors
  on the /info page
* Added the ability for the server administrator to add own dictionaries

#### Customization

* Added parameter `customization.forceWesternFontSize`: `false`/`true`
  for setting by integrators
* Added a parameter to hide the icon with the user's avatar/initials
  in the header: `customization.layout.header.user`: `true`/`false`.
  The setting is available to users with the extended license

#### API

* Added methods for creating/adding custom `ContentControls`

```javascript
ApiDocument.prototype.AddCheckBoxContentControl = function(checkBoxPr)
ApiDocument.prototype.AddPictureContentControl = function(width, height)
ApiDocument.prototype.AddComboBoxContentControl = function(list, selected)
ApiDocument.prototype.AddDropDownListContentControl = function(list, selected)
ApiDocument.prototype.AddDatePickerContentControl = function(datePickerPr)
Api.prototype.CreateCheckBoxContentControl = function(checkBoxPr)
Api.prototype.CreatePictureContentControl = function(width, height)
Api.prototype.CreateComboBoxContentControl = function(list, selected)
Api.prototype.CreateDropDownListContentControl = function(list, selected)
Api.prototype.CreateDatePickerContentControl = function(datePickerPr)
```

* Added the ability to get `CustomXml` collection

```javascript
ApiDocument.prototype.GetCustomXmlParts = function()
```

* Added support for handling the `Custom XML` collection

```javascript
ApiCustomXmlParts.prototype.Add = function(xml)
ApiCustomXmlParts.prototype.GetCount = function()
ApiCustomXmlParts.prototype.GetById = function(xmlPartId)
ApiCustomXmlParts.prototype.GetByNamespace = function(namespace)
ApiCustomXmlParts.prototype.GetAll = function()
```

* Enabled functionality for managing the `Custom XML` collection element

```javascript
ApiCustomXmlPart.prototype.GetId = function()
ApiCustomXmlPart.prototype.GetNodes = function(xPath)
ApiCustomXmlPart.prototype.GetXml = function()
ApiCustomXmlPart.prototype.Delete = function()
ApiCustomXmlPart.prototype.DeleteAttribute = function(xPath, name)
ApiCustomXmlPart.prototype.InsertAttribute = function(xPath, name, value)
ApiCustomXmlPart.prototype.GetAttribute = function(xPath, name)
ApiCustomXmlPart.prototype.UpdateAttribute = function(xPath, name, value)
ApiCustomXmlPart.prototype.DeleteElement = function(xPath)
ApiCustomXmlPart.prototype.InsertElement = function(xPath, xmlStr, index)
ApiCustomXmlPart.prototype.UpdateElement = function(xPath, xmlStr)
```

* Added support for individual `CustomXML` nodes

```javascript
ApiCustomXmlNode.prototype.GetNodes = function(xPath)
ApiCustomXmlNode.prototype.GetXPath = function ()
ApiCustomXmlNode.prototype.GetNodeName = function()
ApiCustomXmlNode.prototype.GetNodeValue = function()
ApiCustomXmlNode.prototype.GetXml = function()
ApiCustomXmlNode.prototype.GetText = function()
ApiCustomXmlNode.prototype.SetNodeValue = function(xml)
ApiCustomXmlNode.prototype.SetText = function(text)
ApiCustomXmlNode.prototype.SetXml = function (xml)
ApiCustomXmlNode.prototype.Delete = function()
ApiCustomXmlNode.prototype.GetParent = function()
ApiCustomXmlNode.prototype.Add = function(nodeName)
ApiCustomXmlNode.prototype.GetAttributes = function()
ApiCustomXmlNode.prototype.SetAttribute = function(name, value)
ApiCustomXmlNode.prototype.UpdateAttribute = function(name, value)
ApiCustomXmlNode.prototype.DeleteAttribute = function(name)
ApiCustomXmlNode.prototype.GetAttribute = function(name)
```

* Added methods to link `ContentControl` and `CustomXML`

```javascript
ApiInlineLvlSdt.prototype.SetDataBinding = function(xmlMapping)
ApiInlineLvlSdt.prototype.GetDataBinding = function()
ApiInlineLvlSdt.prototype.UpdateFromXmlMapping = function()
ApiInlineLvlSdt.prototype.GetDataForXmlMapping = function()
ApiBlockLvlSdt.prototype.SetDataBinding = function(xmlMapping)
ApiBlockLvlSdt.prototype.GetDataBinding = function()
ApiBlockLvlSdt.prototype.UpdateFromXmlMapping = function()
ApiBlockLvlSdt.prototype.GetDataForXmlMapping = function()
```

* Added method for inserting formulas

```javascript
ApiPresentation.prototype.AddMathEquation(sText, sFormat)
```

* Added new class `ApiNotesPage` for working with notes

```javascript
ApiNotesPage.prototype.GetBodyShape()
ApiNotesPage.prototype.AddBodyShapeText(sText)
```

* Added methods to the `ApiSlide` class

```javascript
ApiSlide.prototype.GetNotesPage()
ApiSlide.prototype.AddNotesText(sText)
```

* Added methods for getting presentation objects

```javascript
ApiPresentation.prototype.GetAllOleObjects()
ApiPresentation.prototype.GetAllCharts()
ApiPresentation.prototype.GetAllShapes()
ApiPresentation.prototype.GetAllImages()
ApiPresentation.prototype.GetAllDrawings()
```

* Added methods for getting all slide templates

```javascript
ApiMaster.prototype.GetAllLayouts()
```

* Added `ApiCore` and `ApiCustomProperties` classes
  for working with file metadata

```javascript
ApiCore.prototype.SetCategory = function (sCategory)
ApiCore.prototype.GetCategory = function ()
ApiCore.prototype.SetContentStatus = function (sStatus)
ApiCore.prototype.GetContentStatus = function ()
ApiCore.prototype.SetCreated = function (oCreated)
ApiCore.prototype.GetCreated = function ()
ApiCore.prototype.SetCreator = function (sCreator)
ApiCore.prototype.GetCreator = function ()
ApiCore.prototype.SetDescription = function (sDescription)
ApiCore.prototype.GetDescription = function ()
ApiCore.prototype.SetIdentifier = function (sIdentifier)
ApiCore.prototype.GetIdentifier = function ()
ApiCore.prototype.SetKeywords = function (sKeywords)
ApiCore.prototype.GetKeywords = function ()
ApiCore.prototype.SetLanguage = function (sLanguage)
ApiCore.prototype.GetLanguage = function ()
ApiCore.prototype.SetLastModifiedBy = function (sLastModifiedBy)
ApiCore.prototype.GetLastModifiedBy = function ()
ApiCore.prototype.SetLastPrinted = function (oLastPrinted)
ApiCore.prototype.GetLastPrinted = function ()
ApiCore.prototype.SetModified = function (oModified)
ApiCore.prototype.GetModified = function ()
ApiCore.prototype.SetRevision = function (sRevision)
ApiCore.prototype.GetRevision = function ()
ApiCore.prototype.SetSubject = function (sSubject)
ApiCore.prototype.GetSubject = function ()
ApiCore.prototype.SetTitle = function (sTitle)
ApiCore.prototype.GetTitle = function ()
ApiCore.prototype.SetVersion = function (sVersion)
ApiCore.prototype.GetVersion = function ()
ApiCustomProperties.prototype.AddStringProperty = function (sName, sValue)
ApiCustomProperties.prototype.AddNumberProperty = function (sName, nValue)
ApiCustomProperties.prototype.AddDateProperty = function (sName, oValue)
ApiCustomProperties.prototype.AddBoolProperty = function (sName, bValue)
ApiCustomProperties.prototype.GetPropertyValueByName = function (sName)
```

* Added methods for getting instances of new classes
  in the editor API

```javascript
ApiDocument.prototype.GetCore()
ApiDocument.prototype.GetCustomProperties()
Api.prototype.GetCore()
Api.prototype.GetCustomProperties()
ApiPresentation.prototype.GetCore()
ApiPresentation.prototype.GetCustomProperties()
```

* Added methods for switching the visual presentation
  of `Content Controls`, accepting values: `"boundingBox"`,
  `"hidden"`

```javascript
ApiInlineLvlSdt.prototype.SetAppearance = function(type)
ApiInlineLvlSdt.prototype.GetAppearance = function()
ApiBlockLvlSdt.prototype.SetAppearance = function(type)
ApiBlockLvlSdt.prototype.GetAppearance = function()
```

* Added methods for getting/setting the role and tag to the base class
for all forms, as well as the ability to set the role when creating a form
through the general form setting `FormPrBase.role`

```javascript
ApiFormBase.prototype.GetTag = function()
ApiFormBase.prototype.SetTag = function(tag)
ApiFormBase.prototype.GetRole = function()
ApiFormBase.prototype.SetRole = function(role)
```

* Added methods to get forms by selected role or key

```javascript
ApiDocument.prototype.GetFormsByRole = function(role)
ApiDocument.prototype.GetFormsByKey = function(key)
```

* Added method to get list of keys linked to the given role

```javascript
ApiDocument.prototype.GetFormKeysByRole = function(role)
```

* Added a method to get the form value directly by key (for a group
 of radio buttons, it returns Choice, i.e. the name of the selected item)

```javascript
ApiDocument.prototype.GetFormValueByKey = function(key)
```

* Added methods for date field to work via built-in JavaScript
 date class

```javascript
ApiDateForm.prototype.SetDate = function(date)
ApiDateForm.prototype.GetDate = function()
```

* Added `fontSlot` parameter to `GetFontFamily` method, accepting values:
  `"ascii"`, `"eastAsia"`, `"hAnsi"`, `"cs"`
* Added automatic font calculation from the theme
  in the `GetFontFamily` method, if specified through the theme

```javascript
ApiTextPr.prototype.GetFontFamily = function(fontSlot)
```

* Added a method to access the role management class,
  returning an object of the new `ApiFormRoles` type

```javascript
ApiDocument.prototype.GetFormRoles = function()
```

* Added methods for working with the `ApiFormRoles` class

```javascript
ApiFormRoles.prototype.Add = function(name, props)
ApiFormRoles.prototype.Remove = function(name, delegateRole)
ApiFormRoles.prototype.GetCount = function()
ApiFormRoles.prototype.GetAllRoles = function()
ApiFormRoles.prototype.HaveRole = function(name)
ApiFormRoles.prototype.GetRoleColor = function(name)
ApiFormRoles.prototype.SetRoleColor = function(name, color)
ApiFormRoles.prototype.MoveUp = function(name)
ApiFormRoles.prototype.MoveDown = function(name)
```

#### Plugins

* Added the ability to add custom buttons using a plugin for `ContentControl`
  in the document editor

#### Mobile

* Enabled slide thumbnail panel adjustment upon device orientation change

## 8.3.3

### Fixes

#### All Editors

#### Document Editor

* Fixed calculation for an RTL paragraph ([DocumentServer#2590](https://github.com/ONLYOFFICE/DocumentServer/issues/2590))
* Fixed the display of the Bullets / Numbering / Multilevel style thumbnails
  for an RTL paragraph
* Fixed the display of numbered lists (bullets) for an RTL paragraph
  ([DocumentServer#3118](https://github.com/ONLYOFFICE/DocumentServer/issues/3118))
* Fixed the display of the date for Arabic in the Formats list
  of the "Date & time" window
* Replaced Latin commas with Arabic ones when using Arabic format
  in the "Date & time" window
* Fixed an issue with calculating position for an empty RTL template
* Fixed changing the Wrapping Style value when applying
  Merge shapes / Arrange > Group
* Enabled standard ligatures for Arabic text writing ([DocumentServer#3115](https://github.com/ONLYOFFICE/DocumentServer/issues/3115))
* Fixed the display of Borders and Fill when rendering an RTL paragraph
* Fixed incorrect work when comparing files at the word level, where a word
  and a paragraph mark were deleted
* Fixed adding TextArt for a paragraph with RTL direction
  ([DocumentServer#3132](https://github.com/ONLYOFFICE/DocumentServer/issues/3132))
* Fixed autonumbering for Indian numbers added via Unicode (U+0660 - U+0669)
* Fixed the ability to select a numbered list deleted in the review mode
* Fixed the display of words with tabulation according to the main direction
  of the text
* Fixed calculation of the non-printing tab stop character position and correct
  work with the tab stop marker on the horizontal ruler for an RTL paragraph
* Fixed an issue with the cursor placement in Arabic text for a paragraph
  with LTR direction
* Fixed incorrect display of French quotes « » (U+00AB and U+00BB )
  for RTL text ([DocumentServer#3177](https://github.com/ONLYOFFICE/DocumentServer/issues/3177))
* Fixed calculation of the tab stop position in some edge situations
* Fixed an issue with calculating the right edge for a paragraph with fill
  and border

#### Spreadsheet Editor

* Fixed stopping work of the editor when entering some formulas
  with circular references
* Fixed deleting a sheet when dragging it to another one
  in the Fast co-editing mode
* Fixed crash when opening a document created in the previous version
  of the application
* Fixed hanging of the editor when calculating some functions that
  work with an array

#### Presentation Editor

* Fixed stopping work of the editor when opening the numbered list panel
* Fixed an error when saving/opening the `PPTX` file with animation applied
  to several Lines objects ([DocumentServer#3191](https://github.com/ONLYOFFICE/DocumentServer/issues/3191))
* Fixed an issue with maintaining direction for RTL text when opening
  some `PPT` files
* Fixed generating unique Shape name identifier for the Lines objects
  ([DocumentServer#3192](https://github.com/ONLYOFFICE/DocumentServer/issues/3192))
* Fixed incorrect translations of tools in the Draw menu of the Presenter View window

#### PDF Editor

* Fixed an error when opening some`PDF` files containing fields to fill in
* Fixed the position of drawing the selection in a text comment
  for some `PDF` files
* Fixed the ability to change the stamp size in `PDF` files

#### Convert

* Fixed stopping work of the editor when converting some `PPTX` files
  to image formats
* Fixed crash when converting some `XLSX` files to `XLSB`
* Restored compatibility with third-party editors after converting some `XLSX`
  files to `XLSB` via binary format

#### Customization

* Fixed hiding the Save option in the Customize Quick Access Toolbar menu when
  setting `layout`.`header`.`save` to `false`

## 8.3.2

### Fixes

#### All Editors

#### Document Editor

* Fixed crash when pasting content into a document in NoHistory mode
* Fixed stopping work of the editor when exiting the header/footer editing mode
  in some scenarios
* Fixed an error when processing comments and data when opening
  some `DOCX` files
* Fixed an issue with calculation of a float shape position in the header
* Fixed navigation using the Arrow Left / Arrow Right keys in Arabic text
  ([DocumentServer#3114](https://github.com/ONLYOFFICE/DocumentServer/issues/3114))
* Fixed the cursor position when entering LTR text in a RTL paragraph
* Fixed calculation of the cursor position for the last line of a RTL paragraph
* Fixed the display of margins for a RTL paragraph
* Fixed alignment for a RTL paragraph in some edge cases
* Fixed the order of text wrapping ranges for RTL paragraphs
* Fixed the handle horizontal ruler for RTL paragraphs
* Fixed calculation of the first line indentation
* Fixed missing line breaks in equations when opening some `DOCX` files
* Fixed calculation of indent range start for RTL paragraphs
* Fixed an issue with parsing props in plugin method for adding a content control
* Fixed display of days of the week in the Date Picker Content Controls
  in the RTL UI mode
* Fixed display of arrows of the Increase / Decrease indent buttons
  in the RTL UI mode
* Fixed display of the Line Numbers button in the RTL UI mode

#### Spreadsheet Editor

* Fixed an error when opening `CSV` files in the Embedded mode
* Fixed stopping work of the editor when inserting a new row if several other
  rows are selected in the `XLSX`file
* Fixed stopping work of the editor when applying changes to the document after
  inserting a hyperlink to a new worksheet
* Fixed crash of the editor when entering some variations of the `IF` formula
* Fixed missing chart when opening some `ODS` files
* Fixed an error that occurred in third-party editors when opening some
  exported `XLSX` files with external links
* Fixed display of the WMF images when opening some `ODS` files
* Fixed copying/pasting the Locked Cell property in the Protect Sheet mode
  ([DocumentServer#2385](https://github.com/ONLYOFFICE/DocumentServer/issues/2385))
* Fixed an error that occurred when opening some `XLSX` files for viewing

#### Presentation Editor

* Fixed an error that occurred in third-party editors when opening
  some exported `PPTX` files ([DocumentServer#2951](https://github.com/ONLYOFFICE/DocumentServer/issues/2951))
* Fixed using the Merge shapes option in Fast co-editing mode when opening
  some `PPTX` files
* Fixed work of the Eraser Screen option in the Presenter window
* Fixed highlighting of the active color in the Ink color menu of the Draw tool
  in the Presenter window
* Fixed display of the Ink color menu of the Draw tool for the window boundary
  values in the Presenter window

#### PDF Editor

* Fixed stopping work of the editor when clicking on the background area
  of the document when opening some `PDF` files

#### PDF Form

* Fixed an issue with clearing forms related to the specified role
* Fixed an issue with using the Next/Prev buttons to navigate only to forms
  associated with the role (If the role is specified)
* Fixed changing roles order

#### Security

* Fixed the XSS vulnerability when opening files via the WOPI protocol

#### Convert

* Fixed stopping the process of converting some `PAGES` files to `PNG`
* Fixed stopping the process of converting some `HTM` and `HTML` files
  to the binary format
* Fixed stopping the process of converting some `HWPX` files
  to the binary format
* Fixed stopping the process of converting some `POT` files to `PPTT`
* Fixed stopping the process of converting some `PPTX` files to `PPTT`
* Fixed stopping the process of converting some `PDF` files
* Fixed stopping the process of converting some `DOCX` files to most formats
* Fixed stopping the process of converting some `XLS` files to `XLSB`
* Fixed stopping the process of converting some `ODS` files to `XLSB`

## 8.3.1

### New features

#### PDF Editor

* Added the ability to move pages in `PDF` files ([DocumentServer#1749](https://github.com/ONLYOFFICE/DocumentServer/issues/3052))

#### Customization

* Added the parameter which hides tips about new features
  `customization.features.featuresTips`: `false`/`true`

### Fixes

#### All Editors

#### Document Editor

* Fixed stopping work of the editor when pasting a large amount of copied data
* Fixed crash after entering the minus sign after the equation
  ([DocumentServer#3120](https://github.com/ONLYOFFICE/DocumentServer/issues/3120))
* Fixed crash after entering a character before the division sign
  ([DocumentServer#3119](https://github.com/ONLYOFFICE/DocumentServer/issues/3119))
* Fixed stopping work of the editor when building some `DOCX` files where
  the table of contents was updated
* Fixed an issue with undone changes when turning off and on the "Show changes
  from other users" option in the live viewer
* Fixed crash of the editor when pasting text in the Track Changes mode in some
  `DOCX` files
* Fixed stopping work of the editor when removing a paragraph
  in the Track Changes mode in some `DOCX` files
* Fixed reset of the Text direction > RTL option when placing the cursor
  in a new paragraph using Double click
* Fixed incorrect display of characters when entering text in RTL before saving
  the document
* Fixed replacing the less than sign to the greater than sign when opening
  a document with RTL contents
* Fixed the movement of picture content control with track handler
* Fixed selecting table cells after removing a comment added to the cells
* Fixed display of Content Controls frames nested within another one
  if the cursor is positioned in one of the nested ones
* Fixed the calculation of line breaks in the East-Asian text
* Fixed replacing the heading color with blue after building a document
  if the color was changed to another one using
  `customization.wordHeadingsColor`
* Fixed changing text alignment when opening some `DOCX` files
* Fixed line break position when there is an inline math equation when opening
  some `DOCX` files

#### Spreadsheet Editor

* Fixed crash of the editor after undoing an action on a sheet deleted
  by another user in Fast co-editing
* Fixed stopping work of the editor when entering data in some `XLSX` files
  ([DocumentServer#3140](https://github.com/ONLYOFFICE/DocumentServer/issues/3140))
* Fixed crash of the editor after redoing the sheet movement
* Fixed stopping work of the editor after trying to select a value in a cell
  in some `XLSX` files
* Fixed an error when expanding the dropdown list in some `XLSX` files
* Fixed incorrect recalculation of the `TAKE` function in some formulas
* Fixed loss of a hyperlink in the resulting workbook when using
  the `IMPORTRANGE` formula
* Fixed the #NAME error when recalculating the `IF` function
  in some `XLSX` files
* Fixed the imaginary ability to continue editing after connection break
* Fixed the #NAME error after adding an external link to a named range
* Fixed work of the Scale with document options for headers and footers
  when printing if the document scale is set to Fit All Columns on One Page
* Fixed appearing the warning after entering a formula
  via the Insert Function window
* Fixed activation of the Undo button after an incorrect attempt to enter
  a formula
* Fixed the "Invalid regular expression" error when creating Calculates Items
  in some `XLSX` files
* Fixed the "There are one or more circular references where a formula refers"
  error when opening some `XLSX` files
* Fixed errors in formula calculations when opening some `XLS` files
* Fixed saving the sorting specified in the view if the `XLSX` file is opened
  in the "Without access to change the filter" mode
* Fixed saving the Freeze Panes position after reloading the `XLSX` document
  ([DocumentServer#3124](https://github.com/ONLYOFFICE/DocumentServer/issues/3124))
* Fixed filling of filtered/hidden data in cells in the view mode (Sheet View)
* Fixed appearing the empty row after moving between two others
* Fixed the ability to scroll the sheet when filling cells with data on HiDPI monitors
* Fixed work of horizontal sheet scrolling with `Shift` + `Mouse Wheel`
  on macOS ([DocumentServer#3040](https://github.com/ONLYOFFICE/DocumentServer/issues/3040))

#### Presentation Editor

* Fixed crash of the editor when opening some `PPSX` files
* Fixed stopping work of the editor when exporting some `PPTX` files to `PDF`
* Fixed data loss when copying a placeholder with a slide number to other slides
* Fixed the ability to exit the Slideshow mode using `Esc` after drawing
* Fixed display of a new theme name after applying the Rename Master option
  without reloading the editor page
* Fixed an issue with table display when exporting some `PPTX` files to `ODP`
* Fixed display of the first characters of a word when using the Morph
  transition with the Words / Letters parameter ([DocumentServer#3096](https://github.com/ONLYOFFICE/DocumentServer/issues/3096))
* Fixed changing the Flip parameter for images after exporting
  some `PPTX` files to `ODF`
* Fixed shifting of the Draw icon on the toolbar in the Slideshow mode
  in Firefox

#### Forms

* Fixed conversion of a form file to a regular `PDF` file when exporting
* Fixed display of the Required field frame for a nested field
  in the Complex field

#### PDF Editor

* Fixed stopping work of the editor when inserting a stamp if the cursor
  is positioned in a text comment
* Fixed crash when undoing adding a Text Comment in some `PDF` files
* Fixed stopping work when clicking Edit Text in some `PDF` files
* Fixed crash when clicking in Text Callout
* Fixed the ability to save the `PDF` file if the cursor is positioned
  in the Text Comment window
* Fixed data loss when opening some `PDF` files created
  in the ItextSharp library
* Fixed missing blocking of elements on the page when editing them
  by another user in co-editing
* Fixed the ability to insert contents to the page removed by another user
* Fixed data loss after copying contents of some `PDF` files and pasting
  the contents into the Document Editor
* Fixed adding a stamp outside the page after rotating it

#### Convert

* Fixed an issue that caused an error when opening the result of converting
  some `XLS` files to `XLSX` in third-party editors
* Fixed appearing a table in the header when converting some `ODT` files
  to `DOCX`
* Fixed appearing an indent before text in tables when converting some `ODT`
  files to `DOCX`
* Fixed losing graphic objects when opening a file in third-party editors
  after converting some `DOCX` files to `ODT`
* Fixed losing text in autoshapes when converting some `ODT` files to `DOCX`
* Fixed offset of multilevel list items when opening some `ODT` files
* Fixed changing the fill when converting some `ODP` files to `PPTX`
* Fixed changing the text style when converting some `ODT` files to `DOCX`
* Fixed changing the indents of table of contents numbering when converting
  some `ODT` files to `DOCX`
* Fixed applying the footnote property to the text following it when converting
  some `ODT` files to `DOCX`
* Fixed removal of headings numbering when converting some `ODT` files to `DOCX`
* Fixed losing an image when converting some `ODT` files to `DOCX`
* Fixed changing the appearance of an arrow when converting some `DOCX`
  files to `PDF`
* Fixed display of images when opening some `ODS` files
* Fixed missing images when opening some `Pages` files
* Fixed changing the font size when converting some `ODT` files to `DOCX`

#### Mobile

* Fixed clearing drawn objects after applying the Erase entire screen option
* Fixed the ability to select a color with a stylus in the drawing mode

#### Package

* Fixed an error when installing the RabbitMQ components during offline
  installation

## 8.3.0

### New features

#### All Editors

* Added support for logical operations on shapes (unite, combine, fragment,
  intersect, subtract)
* Added the Opacity option for images
* Added the ability to reset Crop for images in the right panel
  and context menu
* Added the interface translation into Albanian (sq-AL, Albanian (Albania))
* Added new languages to the list of exceptions for text AutoCorrect
* Implemented RTL interface support for the embedded viewer
* Blocking dialogs that require the editor restart are replaced
  with notifications
* Connection status notifications are moved from the status bar to the top
  of the editor

#### Document Editor

* Implemented support for `customXml` and `dataBinding`, when the content
  of the content control is binded to an element in a custom xml
* When editing protected documents, the tools available for the selected part
  are activated
* Added the ability to change the main direction of the paragraph
* Add the support of the HWP and HWPX formats for opening in the editors
* Added support for opening the Pages (.pages) file format
* Added a setting for character-by-character comparing and merging documents
* Implemented the ability to edit the complex field instruction in the context
  of the editor itself

#### Spreadsheet Editor

* Added support for opening the Numbers (.numbers) file format
* Added support for Calculated items for Pivot tables
* Updated the appearance of the function wizard and argument descriptions
* Added the weekdays/month/years options when autofilling cells
* In the Advanced Settings, added the Default sheet direction option when
  creating a new sheet
* In the External links window, added the option to automatically update
  external links
* Added the feature to automatically detect a separator when opening `CSV` files
* Added the ability to undo basic actions when co-editing
* Added the Show horizontal/vertical scroll bar options
  to the Advanced Settings

#### Presentation Editor

* Added support for opening the Keynote (.key) file format
* The Themes, Colors and Slide size tools are moved from the Home panel to the
  new Design tab
* Added the Rename Master/Layout options to the slide context menu of the Slide
  Master mode
* Added the Hand/Select buttons for switching the cursor type in the
  Slideshow mode
* Added the Start slideshow from the beginning button to the Quick Access
  toolbar
* Added the ability to draw on slides in the Slideshow/Presenter View modes

#### Forms

* Increased the default size of the fixed text field
* Changed logic for calculating the top indent for multi-line text fields with
  small height

#### PDF Editor

* Added support for Stamp annotations
* Improved processing of images cropped using shapes
* Added support for gradients
* Improved text recognition
* Added the function to undo actions in the co-editing mode
* Added the ability to select several pages on the thumbnail panel using
  `Ctrl`/`Shift` for group actions
* Added the Opacity option for Highlight/Strikeout/Underline annotations
* Added a quick panel to change color, add a comment or delete
  the Highlight/Strikeout/Underline annotation

#### Security

* Fixed unsafe cryptographic algorithm in the `createDecipheriv` function
* Fixed the possibility of injection by operating system commands in `build_tools`
* Fixed the possibility of injection by operating system commands when building
  a Docker container
* Removed recommended values for "wopi", "email" and "rabbitmq" sections
  in the `default.json` configuration file
* Removed unsafe handler in the `exports.uploadImageFileOld` function

#### Back-end

* Added the ability to update the editor when the file version changes without
  the need to reboot. The following scenarios are possible:
  * the file version was updated when opening the editor;
  * the connection was lost while working, and after restoring it, it was found
  that the file version had changed (if there are no unsaved changes in the document).
* For the new scheme to work, the following have been added:
  * the `onRequestRefreshFile` event, which should be processed by the integrator;
  * the `refreshFile` method, to which it is necessary to transfer the data
  recommended for opening the document (according to [documentation](https://api.onlyoffice.com/docs/docs-api/additional-api/signature/browser/#opening-file));
  * in case of using Wopi, the file version will be updated without the need for
  changes on the part of the integrator;
  * if the integrator has not implemented support for the new scheme, the work
  will be carried out as before — via the `onOutdatedVersion` event
* Added [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
  to control caching of statics on the editors page
* The [drop](https://api.onlyoffice.com/docs/docs-api/additional-api/command-service/drop/)
  command without the users parameter now closes editing for all users editing
  the key document
* Added the ability to use the multitenancy Boolean field without the alias
  text field, which will be considered obsolete after issuing licenses is completed
* Added the integrator onUserActionRequired event, which comes if it is
  necessary to enter a password or select an encoding/separator when opening a file
* Added the ability to use `RabbitMQ quorum queues`. Settings that contained
  the queue name `"queuedelayed": "ds.delayed"` are now objects where it is
  possible to set the [setting](https://amqp-node.github.io/amqplib/channel_api.html#channel_assertQueue)
  including the quorum queue type

#### Customization

* Added `customization.mobile.info` to hide the Document Info button on mobile
  devices
* Added the `customization.pointerMode: 'hand'/'select'` parameter to set
  the cursor type when opening
* Added support for the `customization.compactToolbar` setting in the viewing
  mode
* Added the `customization.slidePlayerBackground` parameter to set
  the background in the Slideshow mode
* Added the `customization.wordHeadingsColor` parameter to set the default
  color for heading styles
* Updated the `customization.submitForm` configuration parameter, which is
  responsible for settings of the button for submitting completed forms.
  The configuration now looks like this:
  
  `submitForm`:
  
  `visible`: `true/false` — controls the display of the button (`true`
  by default)
  
  `resultMessage`: `'text'` / `''` / `null` / `undefined` — specifies
  the message displayed after the form is submitted:
  
  `''` (empty string) — the message is not displayed
  
  `null` / `undefined` — the default text is displayed
  
  `'text'` — the custom message is displayed
* Preserved backward compatibility with previous versions where
  the `submitForm` parameter could take the `true`/`false` values to control
  the button visibility

#### Mobile

* Added the ability to draw
* Added the Switch to Desktop button to switch to the desktop mode and return
  to mobile using the File menu > Switch to Mobile

#### Package

* Added the new ONLYOFFICE DocumentServer Prerequisites installer containing
  all the necessary components for the installation of the product which makes
  it possible to install it without an Internet connection

## 8.2.3

### Fixes

#### Security

* Fixed the XSS vulnerability when opening files via the WOPI protocol

## 8.2.2

### Fixes

#### All Editors

* Fixed the ability to read out a document in the Firefox browser using
  the screenreader ([DocumentServer#2837](https://github.com/ONLYOFFICE/DocumentServer/issues/2837))
* Fixed displaying some chart types when opening the `DOCX` or `PPTX` documents
* Fixed availability of buttons on the right panel when the zoom is higher
  than 200%

#### Document Editor

* Fixed stopping work of the editor when working with the Text box
  in the Header if it contains the page number
* Fixed slow scrolling of documents if the document extends the visible area
* Fixed stopping work of the editor when comparing some `DOCX` documents
* Fixed text selection when clicking on a paragraph with Justified
  alignment

#### Spreadsheet Editor

* Fixed stopping work of the editor when deleting a formula from a cell
  in some `XLSX` files
* Fixed disappearing formulas when opening some `XLSX` files
* Fixed the ability to scroll a sheet horizontally using
  `Shift` + `Mouse wheel`
* Fixed stopping work of the editor when merging all cells on a sheet
* Fixed loss of graphic objects rendering after rotating them
  in the Sheet Right-to-left mode
* Fixed missing the Multi-Select/Clear Filter of Slicer buttons after scrolling
  horizontally or vertically

#### PDF Editor

* Fixed stopping work of the editor when adding a matrix in a math equation
* Fixed the short-term absence of an image added by one of the users
  in co-editing
* Fixed incorrect selection of paragraphs in the Select tool mode when opening
  `XPS`/`OXPS` files
* Fixed flickering of a column with text when selecting an adjacent one
  in some `PDF` files

#### Convert

* Fixed losing an image added to `watermark.fill` after converting the `DOCX`
  files to `PDF`

#### API

* Fixed work of the `MoveToNextReviewChange` method with external access
  to a document using a connector

#### Mobile

* Fixed the ability to work in a third-party application located
  on the same page with mobile editors
* Fixed appearing the keyboard when touching a document where text input
  is not possible
* Fixed zooming out page content after increasing zoom in the Standard view
  and switching to the Mobile view
* Fixed the ability to enter text in browsers on some devices
* Fixed appearing the Magnifying glass tool when scrolling a document

#### Compilation

* Fixed missing files in the `core/Common/3dParty/` folder during compilation
  ([build_tools#884](https://github.com/ONLYOFFICE/build_tools/issues/884))
  
## 8.2.1

### Fixes

#### All Editors

* Fixed appearance of an extra argument when switching from a linear equation
  to a professional one
* Fixed navigation via menu instead of moving around text when using
  the `Alt` key and keyboard arrows
* Fixed inconsistency in the appearance of labels as compared to other editors
  when opening some documents with charts
* Fixed the ability to add some `TIF`/`TIFF` images to documents

#### Document Editor

* Fixed an issue with calculating spacing before for a paragraph
  in block-level sdt
* Fixed an issue with cell selection after removing table rows
* Fixed calculating footnotes in the extreme case when there is no space even
  for 1 line
* Fixed an issue with the exact row height support when opening `DOCX` files
  ([DocumentServer#2960](https://github.com/ONLYOFFICE/DocumentServer/issues/2960))
* Fixed stopping work of the editors when updating the editor without saving
  changes
* Fixed stopping work of the editor when moving the magnifying glass tool
  to the right toolbar using a stylus
* Fixed the input window overlay on text in the Japanese (Microsoft IME) layout
* Fixed inconsistency in displaying numbered lists as compared to other editors
  when opening some `DOCX` documents
* Fixed appearance of a frame around the paragraph inserted from other sources
* Fixed the presence of artifacts when applying strikethrough or double
  strikethrough in a formula
* Fixed calculation of a math equation that was split into multiple lines
  ([DocumentServer#2173](https://github.com/ONLYOFFICE/DocumentServer/issues/2173))
* Fixed text offset in autoshapes when opening some `DOCX` files
* Fixed table offset in header when opening some `DOCX` files
* Fixed text offset when opening some `DOCX` files
* Fixed saving some `SVG` images when exporting `DOCX` to `PDF`
  ([DocumentServer#2792](https://github.com/ONLYOFFICE/DocumentServer/issues/2792))
* Fixed removing a section break after converting some `RTF` files to `DOCX`
* Fixed removing the Title and Tag properties when moving the Content Control
  that contains an image
* Fixed losing the Drop-down list that was added and modified
  in the Reviewing mode
* Fixed duplicating an input field when moving the Content Control using
  the mouse
* Fixed shifting focus from the Check Box to other elements after changing its
  state in some `DOCX` documents

#### Spreadsheet Editor

* Fixed correct work of data validation specified with the `LEFT` formula
* Fixed consideration of the time zone when inserting a date using `Ctrl` + `;`
  ([DocumentServer #2446](https://github.com/ONLYOFFICE/DocumentServer/issues/2446))
* Fixed stopping work of the editor when copying the cell, containing a link to
  an external file ([DocumentServer#2911](https://github.com/ONLYOFFICE/DocumentServer/issues/2911))
* Fixed stopping work of the editor when changing the column width using a stylus
* Fixed long opening of some `XLSX` files which causes stopping work of the editor
* Fixed displaying autoshapes containing a macro mechanism
* Fixed losing changes when using special paste after building some `XLSX` files
* Fixed the value type error when recalculating the `IF` function in some
  `XLSX` files
* Fixed appearance of extra pages when previewing or printing some `XLSX` files
* Fixed appearance of borders after inserting cells copied from third-party
  applications
* Fixed appearance of an extra warning when editing a link to an external
  data source
* Fixed selecting fractional numbers using Goal Seek
* Fixed incorrect rounding when using the `ROUNDUP` function
* Fixed creating data array as a result of calculating the `VLOOKUP` function
  if the argument is not an array ([DocumentServer#2956](https://github.com/ONLYOFFICE/DocumentServer/issues/2956))
* Fixed the rendering artifacts for some cases when scrolling the content
  of the sheet
* Fixed the dependence of the scroll step on the system scale
* Fixed displaying the drop-down list button
* Fixed the ability to apply the AutoFilter to an imported range
* Fixed the ability to use the space in a name of a protected range
* Fixed jumps when scrolling a sheet using selection with the `Shift` key and
  keyboard arrows
* Fixed switching to a cell via the address bar when the browser zoom is higher
  than 100%
* Fixed the ability to choose cells after scrolling an area frozen with
  the Freeze Panes option if there are other cells below them
* Fixed the position of the comment window when expanding the panel with them
* Fixed overlapping the cell content by a comment
  in the Sheet Right-to-left mode
* Fixed layering of line number when scrolling a sheet
  in the Sheet Right-to-left mode
* Fixed duplicating the comment marker in the Sheet Right-to-left mode
* Fixed shifting of column guides when resizing them
  in the Sheet Right-to-left mode
* Fixed shifting of graphic objects when opening the toolbar
  in the Sheet Right-to-left mode
* Fixed shifting of the equation field when entering values
  in the Sheet Right-to-left mode
* Fixed highlighting of an added equation after after restarting the editor
* Fixed displaying the equation auxiliary menu when switching
  to the Sheet Right-to-left mode
* Fixed displaying the comment after activating the Sheet Right-to-left mode
* Fixed shifting of conditional formatting icons after enabling
  the Sheet Right-to-left mode
* Fixed missing graphic objects in some `XLSX` files on horizontal scrolling
  in the Sheet Right-to-left mode
* Fixed moving graphic objects after their rotation
  in the Sheet Right-to-left mode
* Fixed the displayed number of rows or columns exceeding specification limits
  ([DocumentServer#2938](https://github.com/ONLYOFFICE/DocumentServer/issues/2938))

#### Presentation Editor

* Fixed distortion of some equations after reloading the editor
* Fixed missing a chart when opening some `PPTX` files
* Fixed inline check and numbering bullet check in presentation mode
  for math equations
* Fixed the watermark position when using protection in the DocSpace room
* Fixed missing graphic elements in the presenter mode when demonstrating some
  `PPTX` files
* Fixed changing the color scheme when opening some `PPTX` files
* Fixed the ability to apply columns for a group of SmartArt objects
  ([DocumentServer#2940](https://github.com/ONLYOFFICE/DocumentServer/issues/2940))
* Fixed clipping of transition names in Arabic for the browser zoom of 125%
  and higher
* Fixed applying object formatting performed on a parent slide
  in the Slide Master mode

#### Forms

* Fixed the ability to delete the field with the Lock property
  if the Fixed size setting is enabled
* Fixed the absence of the ability to submit a completed form if it contains
  the Date & Time field with the Required property
* Fixed the work of composite input in fields with the Comb of characters
  property
* Fixed the ability to insert an image from storage or URL to the form field
* Fixed the absence of the ability to go to the Signature field using
  the toolbar buttons
* Fixed the ability to put the cursor to the same paragraph after creating
  an Inline Text Field
* Fixed moving a form field located in a table after activating the Fixed size
  field property
* Fixed the size of the Signature field track when switching from the Edit
  to View mode and vice versa
* Fixed stopping navigation through fields using the Previous/Next Field
  buttons in some forms

#### PDF Editor

* Reworked loading of fonts required for page rendering due to page hang out
  in collaborative mode
* Fixed stopping work of the editor when printing some `PDF` files
* Fixed stopping work of the editor when opening some `PDF` files
* Fixed stopping work of the editor after receiving an autoshape with text
  in co-editing
* Fixed the issue with different text shaping in collaboration mode
* Fixed different appearance of documents after transferring an image
  in co-editing
* Fixed the appearance of a deleted page after re-saving some `PDF` files
* Fixed shifting of a table when adding rows using Tab
* Fixed applying fill when creating some formulas
* Fixed displaying styles of some formulas in co-editing
* Fixed clearing all elements when erasing one of them with the Erase tool
* Fixed missing Text call out after the file formation
* Fixed losing a comment in co-editing if another user replied to it
* Fixed the distortion of the bulleted list after editing some `PDF` files
* Fixed missing notifications about inactivity when working with `PDF` files
  for a long time
* Fixed recording of checkbox state changes in `PDF` files
* Fixed losing an autoshape shadow when opening some `PDF` files
* Fixed changing the color of some images after inserting them and saving the
  `PDF` file
* Fixed changing the color of hieroglyphs when exporting some `PDF` files
  to images
* Fixed rotation of the modified page content after saving some `PDF` files
* Fixed missing added changes on preview or after printing some `PDF` files
  from the portal
* Fixed incorrect selector behavior when selecting lines in some `PDF` files

#### Security

* Fixed the absence of the necessity to enter the password after restarting
  the editor

#### Convert

* Fixed the appearance of an error when opening the result of converting `PDF`
  to `DOCX` in third-party editors
* Fixed stopping work of the editor after opening the result of converting
  some `XLSX` to `XLSB`
* Fixed endless conversion of some `ODP` files to `PPTX`
* Fixed the Segmentation fault error during the conversion of some `ODP` files
  to `OTP`
* Fixed the Segmentation fault error during the conversion of some `DOCX` files
  to `HTML`/`DJVU`/`EPUB`
* Fixed crash when converting some `DOCX` files to `HTML`/`DJVU`/`EPUB` or
  image file formats
* Fixed an error when converting some `XLS` to `XLSX`
* Fixed the appearance of an error when opening the result of converting `XPS`
  to `DOCX` in third-party editors
* Fixed the appearance of an error when opening the result of converting
  `ODP`/`OTP`/`FODT` to `PPTX` in third-party editors
* Fixed the appearance of an error when opening the result of converting `ODT`
  to `DOCX` in third-party editors
* Fixed data loss in a table when converting `DOCX` to `RTF`
* Fixed layering of hieroglyphs in the `EMF` images when opening some `XLSX` files
* Fixed document structure corruption when opening some `EPUB` documents
* Fixed cropping the `EMF` images after converting some `DOCX` files to an image
* Fixed writing the formula calculation result when exporting `XLSX` to `CSV`
* Fixed considering the availability of the VBA macros when converting
  the `XLSB` files
* Fixed corruption of links to sheets containing non-Latin characters after
  exporting to the `ODS` format

#### Mobile

* Fixed stopping work of the editor when opening `CSV`/`TXT` files
* Fixed the issue with the absence of contents when scrolling some `PDF` files
* Fixed the ability to copy and the absence of the Watermark when the document
  protection mechanism is activated

#### Package

* Fixed a bug that caused the `themes.js.gz: not found` record in logs during
  the installation process

## 8.2.0

### New features

#### All Editors

* Optimization of script loading to speed up opening all editors
* Own rendering of some SmartArt objects instead of recorded images in the file
* Updated dictionaries for Spellcheck and Hyphenation
* Support for new types of charts for opening: Histogram, Waterfall, and Funnel
* Improved display of Chart labels for Date axes, Values, and Categories
* Improved touch screen support in the full version of editors
* New Gray interface theme
* The appearance of the Version History panel has been changed
* Updated styles for file renaming
* Menu items in the File menu have been regrouped and icons have been added
* Theme and toolbar settings are moved to a separate Appearance category in the
  File menu - Advanced Settings
* Added the Tab style setting - view of tabs (Fill or Line) in the File menu -
  Advanced Settings
* Added the Use toolbar color as tabs background setting
* Ability to add custom fields to the file information
* Ability to view/add/edit custom fields without pressing the Apply button
* Reorganized fields with file information in the File menu - Info
* Improved work with the Lists of languages - the name of the language
  and region is now duplicated in English
* Implemented search in the Language list by name and in the target language,
  as well as in English

#### Document Editor

* Support for old CheckBox types
* Added the ability to Insert the contents of a third-party document
* New numbered list presets for Arabic interface
* Added the highlight of deleted text in the selected file version
* Ability to add and edit complex fields using field instructions

#### Spreadsheet Editor

* Improved support for smooth scroll
* Support for iterative calculations
* Added the ability to switch the direction of cell placement
* Added a button for setting the number format with separators to the toolbar
* Ability to display pages in real scale in the Print preview window
* The Pivot Table toolbar tab is only displayed when using the pivot table,
  and is otherwise hidden
* The Pivot Table settings right panel now unfolds when adding
  a new Pivot Table
* Added the ability to display trendlines (Equation on chart) to the Chart –
  Advanced Settings

#### Presentation Editor

* Acceleration of opening files due to rendering the slide before loading
  of images
* Implemented a more visual way of selecting animation from the extended list
* Added the `Random` transition

#### Forms

* Added a Signature field with the ability to upload a prepared image

#### PDF Editor

* Added ability to save `PDFs` to the storage
* Added co-editing `PDFs`
* Added correct processing of cropped/combined shapes when opening files
* Added Gradient support
* Improved text recognition

#### Security

* Fixed the XSS injection in the Tooltip of the Animation Pane
* Fixed the vulnerability that allowed bypassing document access rights
  and making changes to it
* Fixed the vulnerabilities in the `FormattedDiskPagePAPX`,
  `SectionPropertiesMapping`, `FormattedDiskPageCHPX`, and `XORCrypt` functions
  leading to Heap Buffer Overflow when converting to the `DOC` format
* Fixed the vulnerabilities in the `ECMADecryptor`, and `DirTree`
  functions leading to Buffer over-read when converting to the `DOC` format

#### Back-end

* Ability to send email notifications about warnings related to license
  and quota
* Added cache reset when regenerating fonts, in the path to the scripts,
  the hash after the version number will be unique for each server
* Added the `mysqlExtraOptions` object with the ability to pass additional
  settings of the `node-mysql2` [module](https://sidorares.github.io/node-mysql2/docs/examples/connections/create-connection#connectionoptions)
  for connection to MySQL, including SSL
* Added the `servicesCoAuthoring.server.forceSaveUsingButtonWithoutChanges`
  option to save the file when force saving by pressing the button without changes
* Added the `users` parameter, similar to `users` in [callback handler](https://api.onlyoffice.com/editors/callback#users)
  in the response to the
  [`info`](https://api.onlyoffice.com/editors/command/info) command
* The `handlers` `ConvertService.ashx` and `coauthoring/CommandService.ashx`
  are deprecated, it is recommended to use `converter` and `command` instead
* The ability to make a `GET` request to `converter` and `command`
  is deprecated, it is recommended to use `POST` instead

#### WOPI

* Added the `Password` and `PasswordToOpen` parameters to the `convert-to`
  request

#### Customization

* Extend support for the
  [`editorConfig.region`](https://api.onlyoffice.com/editors/config/editor#region)
  parameter in the editor's config:

  in all editors, this parameter is used to define the default unit
  of measurement (for regions us-..., ca-... inches are used by default,
  unless otherwise specified in the
  [`customization.unit`](https://api.onlyoffice.com/editors/config/editor/customization#unit)
  parameter;

  support for the [`editorConfig.location`](https://api.onlyoffice.com/editors/config/editor#location)
  parameter, which was used previously, will be discontinued;
  
  the `region` parameter also sets the default numeric format and date/time
  format in the Spreadsheet Editor, as it was in previous versions
* Added parameters for toolbar appearance configuration:

  `customization.features.tabStyle.mode` and `change` for a tab style

  `customization.features.tabBackground.mode` and `change` for a tab background

  `customization.logo.imageLight` = “logoUrl” for a light header

  `customization.logo.imageDark` =”logoUrl” for a dark header
* Common logo for all themes can be specified in the `customization.logo.image` parameter
* Support for the `customization.toolbarNoTabs` parameter has been
  discontinued, instead use `customization.features.tabStyle=line`
  and `customization.features.tabBackground=toolbar`

#### API

* Added methods for implementing Undo/Redo through plugins

  `api.prototype.Undo = function()`

  `api.prototype.Redo = function()`

  `api.prototype.CanUndo = function()`

  `api.prototype.CanRedo = function()`

#### Mobile

* Added processing of the `standardView` parameters for displaying the editor
  in the standard view and `forceView` for display in the read-only mode
* Added support for custom functions based on `jsdoc`

#### Plugins

* Commercial editions now require the installation of plugins via
  the Plugin manager
* The Macros button has been moved to the View tab

## 8.1.3

### Fixes

#### All Editors

* Fixed bugs with cursor and interface objects positioning in Chromium browsers

## 8.1.2

### No public release

## 8.1.1

### New features

#### All Editors

* Added `TIFF` to supported image formats

### Fixes

#### All Editors

* Fixed missing Image button in the SmartArt objects of the Picture type
* Fixed work of the `highlight-toolbar-tab-underline` parameter in the custom
  themes

#### Document Editor

* Fixed crash when applying an autocorrect command in an expression
* Fixed crash when copying or cutting an image pasted from the clipboard
* Fixed crash when pasting a copied list using Keep text only
* Fixed crash when moving autoshape
* Fixed crash in TextShaper when using composite input
* Fixed scroll to target when updating the position of a view port
  in collaborative editing [DocumentServer#2428](https://github.com/ONLYOFFICE/DocumentServer/issues/2428)
* Added the ability to prevent scrolling to the current position when
  performing any action
* Fixed review types for added paragraphs
* Fixed missing the current change in review when receiving spellcheck variants
* Fixed the recalculation of the document when changing the autohyphenation
  option
* Fixed spaces when converting table to text
* Fixed an issue with collecting related levels for the current numbering level
* Added table to track revisions check when adding new table or new row
  to the table
* Fixed an issue with simple text paste when track revisions is turned on
* Fixed freeze when moving through review changes
* Implemented display/accept/reject for review change of a table cell
* Fixed an issue with accepting/rejecting review changes inside a block-level
  sdt [DocumentServer#2669](https://github.com/ONLYOFFICE/DocumentServer/issues/2669)
* Fixed an issue with recalculating table
* Fixed clearing table cells before moving them
* Fixed cursor moving down when selected table cells
* Fixed display of images when opening some `DOCX` files
* Fixed an issue with reading numbering properties in styles and refactor
  using `AscWord.NumPr` class
* Fixed clearing the text properties for an inline-level sdt and merge method
  for `TextPr`
* Fixed incorrect display of autoshape shadow transparency when the No Fill
  option is activated
* Fixed display of nonprinting characters when opening some `DOCX` files
  in the viewing mode

#### Spreadsheet Editor

* Fixed crash in TextShaper after replacing the entered text in the autoshape
* Fixed crash for some usages of the `IMPORTRANGE` formula
* Fixed crash when entering Korean characters into the formula bar in Firefox
* Fixed incorrect formula conversion when using a link to a file
* Fixed crash when opening some `XLSX` files [DocumentServer#2782](https://github.com/ONLYOFFICE/DocumentServer/issues/2782)
* Fixed inserting an empty column after moving a column
  with data [DocumentServer#2499](https://github.com/ONLYOFFICE/DocumentServer/issues/2499)
* Fixed changing line height after applying Merge and Wrap Text, if the text
  extends the cell boundaries
* Colors of row and column headers when hovering the cursor now correspond
  to color schemes
* Fixed formula calculation if there is an intersection with a formatted table
  [DocumentServer#2799](https://github.com/ONLYOFFICE/DocumentServer/issues/2799)
* Fixed formula calculation if they contain Named ranges
* Fixed creating named ranges in languages with ligatures
* Fixed applying a number format when calculating a formula in the total row
  of a formatted table
* Fixed display of shadow of objects after scrolling a sheet
* Fixed updating of the `IMPORTRANGE` formula arguments after updating external
  links

#### Presentation Editor

* Fixed crash after applying Reset slide in certain `PPTX` files
* Fixed crash after copying a slide in the Normal mode and pasting
  in the Slide Master mode
* Fixed crash when opening the Notes and handouts insertion menu
* Fixed the issue with weak characters in RTL at the end of the line
* Fixed presence of the Insert image from file / Insert image from URL buttons
  for SmartArt objects of the Picture type in the Master Slide mode
* Fixed the issue: formatting on layouts in the Add Slides button is displayed
  after the changes are made again in the Slide Master mode
* Fixed display of the name when inserting a Table placeholder
* Fixed applying a theme to the added slide
* Fixed display of a comment when switching to the Slide Master mode
* Fixed the size of placeholders on layouts after removing placeholders
  on the parent layout and applying Duplicate Slide Master
* Fixed work of the Play/Pause buttons in the viewing window
  in the Slideshow mode
* Fixed layering of objects when they are grouped when opening some
  `PPTX` files [DocumentServer#2573](https://github.com/ONLYOFFICE/DocumentServer/issues/2573)
* Fixed work of internal hyperlinks when using the Next Slide parameters
* Fixed work of `Enter` / `Space` / `Arrow Right` / `Arrow Left` keys
  in the Slideshow mode
* Fixed reset of object selection after copying using Drag-and-drop
* Fixed display of shadow in the Slideshow mode
* Fixed duplicating Slide Master when moving it using Drag-and-drop
  in the Slides tab
* Fixed display of text formatting applied on the parent layout
* Fixed incorrect date indication in Header and Footer
* Fixed applying Background theme after creating a custom theme via
  Slide settings and using the Apply to All Slides option
* Fixed display of custom theme layout when opening some `PPTX` files
* Fixed marker overlapping when moving it along the Animation Pane timeline

#### Forms

* Fixed crash when filling in fields in some forms [DocumentServer#2768](https://github.com/ONLYOFFICE/DocumentServer/issues/2768)
* Prevent a checkbox from toggling when moving it
* Fixed the conversion of a fixed form to an inline
* Improved finding anchor position around inline forms
* Fixed the ability to change data in fields when submitting the form
* Fixed "errorCode: -85" when trying to apply Force Save for a file with a form

#### PDF Editor

* Changed the default tool from Hand to Selection
* Added the ability to disable the mini panel when selecting text
  in Advanced Settings
* Fixed crash when opening some `PDF` files
* Fixed crash after several deletions of pages and insertion of
  a graphic element
* Fixed crash when removing table rows when editing some `PDF` files
* Fixed stopping work of the editor after exiting without saving changes
* Fixed crash when moving around a table using `Tab`
* Fixed crash when opening Page Thumbnails in some `PDF` files
* Fixed highlighting of hyperlinks when opening `PDF` files
* Fixed work of composite input in comments
* Fixed filling with color instead of image when opening some `PDF` files
* Fixed work of Undo after changing the text orientation in the `PDF` file
* Fixed transparency of a Watermark when opening some `PDF` files
* Fixed offset of the Select toolbar when selecting words in some `PDF` files
* Fixed text content loss when opening some `PDF` files
* Fixed the Text box content loss after exporting the `PDF` file
* Fixed saving objects located after a link

#### Security

* Fixed the vulnerability in the `AxcExt::serialize`, `SERIESAXIS::serialize`
  and `SS::serialize_default` functions which causes crash when converting
  `XLS` to `XLSX`
* Fixed Segmentation fault in the `ChartSheetSubstream::serialize_legend` and
  `ChartSheetSubstream::serialize_plot_area` methods when converting `XLS` to `XLSX`
* Fixed Segmentation fault in the `IVAXIS::serialize`
  `PIVOTCACHEDEFINITION::serialize_definitions` and `FDB::serialize` functions
  when converting `XLS` to `XLSX`
* Fixed Heap Buffer Overflow in the `ReadStandartEncryptionInfo` function

#### Back-end

* Set `DEFAULT_SHARD_KEY` from environment as shardkey in case of integrator
  did not pass this param
* Enforce request without shardkey to run synchronously in sharded cluster
* Don't send "updateversion" status to viewer when opening Version history
  for `PDF`

#### Convert

* Fixed an issue when converting large `XLSX` files with
  the `thumbnail.first:true` parameter
* Fixed crash when converting some `XLS` files to `XLSB`
* Fixed crash when exporting `DOCX` documents, containing autoshapes, to `HTML`
* Fixed crash when opening some `DOC` files
* Fixed crash when opening some `DOCX` files
* Fixed crash when converting some `XLSM` files to `XLSB`
* Fixed stopping work of the editor when opening some `XLSX` files, containing
  `EMF` images
* Fixed compliance with the `PDF/A` format after exporting a `DOCX` document
* Fixed an error when opening in third-party editors the `XLSX` file obtained
  when converting `XLSB`
* Fixed crash when converting some `XLS` files to XLSB
* Fixed text loss in `SVG` images after exporting the `DOCX` document
  to a different format
* Fixed the reason of errors in the integrator logs after exiting the edited
  `PDF` file
* Fixed display of presentation theme after exporting some `PPTX` to `PDF/A`
* Fixed the "Decimal" and "Use 1000 separator" options loss when exporting
  `XLSX` to `CSV` [DesktopEditors#821](https://github.com/ONLYOFFICE/DesktopEditors/issues/821)

#### Mobile

* Fixed decreasing performance when scrolling `PDF` files
* Fixed appearing the keyboard when tapping on an open `PDF` file
* Fixed decreasing performance when zooming slides in `PPTX` files

#### Package

* Fixed stopping work of the server after executing `logrotate` in EXE packages
* Fixed hanging of the `DsProxy` service in EXE packages, if the document
  is open for editing
* Fixed validation of connection to `rabbitmq` when installing the EXE package,
  if a non-root `vhost` is used [DocumentServer#2773](https://github.com/ONLYOFFICE/DocumentServer/issues/2773)

## 8.1.0

### New features

#### All Editors

* Changes in program interface: manageable functional buttons, Replace button
  is now on the Home tab, Copy style, Clear style, Select all
* Autoshape shadowing settings
* Added the editors translation into Serbian - Cyrillic (sr-Cyrl-RS, Serbian
  (Cyrillic, Serbia))
* Updated the set of color themes available in editors
* Added internal help in Portuguese (pt-br)
* Added Arabic to all regional settings
* Added a title and a button to close the panel to the Chat panel

#### Document Editor

* New button on the top toolbar for changing document editing mode: Editing,
  Reviewing, Viewing
* Added tooltips for new or updated functionality (displayed when loading
  the editor or when switching to the corresponding tab)
* Implemented the ability to set the format for page numbering
* Added support for the page color
* Updated built-in paragraph styles
* New items in the indents menu for opening the right panel and managing
  paragraph indents, the ability to manage paragraph indents via the top toolbar
* Color theme button is now on the Layout tab
* Mail merge button is now on the Collaboration tab
* Line spacing options updated
* Improved work of the algorithm for displaying numbers and punctuation
  in Arabic text for the Neutral and Weak classes
* Improved fitting for paragraphs with main RTL direction

#### Spreadsheet Editor

* New languages added: ligature support
* Selected cells are highlighted on their respective row/column numbers
* New functions: `GETPIVOTDATA`, `IMPORTRANGE`
* New function category: Custom based on `jsdoc`
* Version history update: edited cells are highlighted
* Users get custom protected range cells viewing rights
* Implemented the ability to copy/move sheets between books in one browser
* Changed the appearance of the sheet list in the embedded viewer in accordance
  with the styles of the main spreadsheet editor

#### Presentation Editor

* New slide settings on the right panel: show background graphics, reset
  background to the theme background, apply settings to all slides
* Added Animation pane
* Added a mode for editing master slides and templates

#### Forms

* Forms are now in `PDF` format instead of `DOCXF`
* When adding a fixed form, now it is inserted without wrapping in front
  of the text
* The color of the Picture placeholder corresponds to the color of the role
  for this form
* The thickness of the frame for required fields is now 2px with any zoom
* Added a button to switch to the editing mode (similar to the button
  in the editor header) for forms opened in the View or Fill forms mode
* The presence of this button depends on subscription of the integrator
  to the `onRequestEditRights` event and the `permissions.edit` rights
  (in case of a viewer)

#### PDF Editor

* Added buttons for switching Editing/Viewing (annotations) modes
  to the toolbar and the editor header
* Added tooltips for new or updated functionality (displayed when loading
  the editor or when switching to the corresponding tab)
* In the Edit mode, it's possible to add various objects (using the Home and
  Insert tabs) and configure them using the right panel and context menu
* Added the ability to add, delete or rotate pages using the context menu and
  the toolbar
* Added a mini toolbar for adding annotations when selecting text

#### Security

* Added the ability to connect to `MySQL` using `SSL`/`TLS`
* Added the ability to generate `wopi.privateKey` when installing
* Fixed the vulnerability in the `fs.folderPath` field which allows accessing
  the file system
* Fixed vulnerabilities in the `PtgName::assemble`, `PtgNameX::assemble`,
  `PtgParen::assemble`, `PtgRef3d::assemble`, `PtgList::assemble` and
  `PtgArea3d::assemble` methods which cause crash when converting `XLS` to `XLSX`
* Fixed the vulnerability in the `CDataStream::ReadEmrTextBase` method which
  causes crash when converting `ODP` to `PDF`
* Fixed the vulnerability in the GlobalsSubstream::UpdateDefineNames method
  which causes crash when converting `XLS` to `XLSX`
* Fixed the vulnerability in the `WorkBookStream::UpdateXti` method which causes
  crash when converting `XLS` to `XLSX`
* Fixed Heap Buffer Overflow when converting `EPUB` to `PDF`
* Fixed the vulnerability in the `CPPTUserInfo::LoadExternal` method which allows
  writing a file to a folder with restricted access when converting `PPT` to `PPTX`
* Fixed vulnerabilities which allow reading data from a third-party file when
  converting `OOXML` to `ODF` and vice versa
* Fixed Heap Buffer Overflow in the `CSvmFile::Read_META_BMP` method when
  converting `ODP` to `PPTX`
* Fixed the vulnerability in the `commandSetPassword` method which allows setting
  a password for a document regardless of rights
* Fixed the vulnerability in the /example/editor of the test example which
  allows getting server configuration settings

#### Back-end

* New config parameter `services.CoAuthoring.server.editorStatStorage` for
  changing data storage location for license and statistical data
* New object `persistentStorage` to separate cache file storage, and forgotten
  and error file storage

#### WOPI

* Files opened using `WOPI`: Save Copy as [added](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/putrelativefile#post-wopifilesfile_id)
* When opening `PDFs` in form filling mode using `WOPI`, new discovery action
  formsubmit is [active](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/discovery#formsubmit)
* [Added](https://api.onlyoffice.com/editors/wopi/hostpage) the
  `docs_api_config` parameter of the editor opening form
  via `WOPI` which passes a part of the config for opening the editor
  to the `Docs API`
* Added query param `WOPISrc` for sending requests to one server. Now,
  the parameter sent by the integrator is used for `WOPI`; for `Docs API`, `document
  key` is written in `WOPISrc`
* 2 `WOPISrc` and `shardkey` names can be used as a sharding key

#### Mobile

* Improved mobile view for documents with tables and paragraphs with non-zero
  left and/or right indents

#### Customization

* Added the `customization`->`features`->`roles` : `true`/`false` (`true` by default)
  parameter to the editor config for role configuration functionality for `PDF Forms`
* In the `customization` section of the editor config, added the new parameter:
  close with keys `visible`: `true`/`false` (whether to show the button or not)
  and `text`: 'Close file' (the tooltip text for a button in the editor header
  or the menu item text in mobile editors and the File menu of web editors)
* The `customization.goback.requestClose parameter` is no longer supported
* Value for `customization`->`hideRightMenu` is `true` by default
* Added the parameter which hides the logo in Mobile and Embed:
  `customization`->`logo`->`visible`: `true`/`false` (`true` by default),
  whether to show the logo or not
* Implemented customization of the logo in the header
  (the `customization`->`logo`->`image`/`imageDark` parameter)
* Added a parameter to hide the button for switching editing modes
  in the header: `customization`->`layout`->`header`->`editMode`: `true`/`false`
  (`true` by default)

#### Plugins

* Plugins can make changes to the interface
* Added a plugin method for the document editor to search for and highlight
  the next/previous occurrence of a given text
  `api.prototype.SearchNext = function(oProperties, isForward)`
* In the information for the context menu in plugins, added flags indicating
  that we are editing the header/footer, as well as added flags indicating that
  the menu is called above the header/footer area (if we are not currently
  editing it)

#### Package

* `NSSW` is replaced with `WinSW` for Windows installation; download and install
  necessary prerequisites

## 8.0.1

### Fixes

#### Document Editor

* Fix crash when clicking comment inside a math equation ([DocumentServer#2556](https://github.com/ONLYOFFICE/DocumentServer/issues/2556))
* Fix crash when using the Insert caption feature with the Include chapter
  number option
* Fix crash when inserting a copied image using `Ctrl`
* Fix a problem with rendering collaboration highlight
* Fix an issue with highlighting searching results in some `DOCX` files
* Fix display of highlighting a comment added to RTL text
* Fix text label for Table of Contents in the RTL UI
* Fix an issue with shaping text with different direction (RTL and LTR)
* Improve the calculation of the cursor position in case when it is between
  text with different directions (RTL and LTR)
* Fix an issue with correction of a text selection when passing through
  a complex field
* Fix an issue with calculating the current cursor position while selecting
  elements in table
* Fix selection for the hidden part of complex fields
* Fix an issue with selection draw and cursor positioning in complex fields
* Fix position of diacritics when typing in Arabic
* Hide non-printing characters in header/footer label
* Decrease the height of the header/footer label

#### Spreadsheet Editor

* Fix stopping work of the editor when exporting some `XLSX` files to
  `PNG`/`JPEG`
* Fix display of the `DBNum1` number format when opening some `XLSX` files
* Fix appearing artifacts when inserting an image via Drag-n-Drop and moving it
* Fix saving the current sheet only when exporting a work book to `PNG`/`JPEG`
* Fix display of the #REF! error when adding the `VLOOKUP` formula with
  an argument which is a reference to another file

#### Presentation Editor

* Fix stopping work of the editor when opening some `PPTX` files
  ([DocumentServer#2591](https://github.com/ONLYOFFICE/DocumentServer/issues/2591))

#### Forms

* Fix crash when expanding the Date field in the forms edited in third-party
  editors
* Fix closing a drop-down list in some `PDF` forms with the Turn on screen
  reader support option enabled
* Change the default date-time format for a DatePicker form

#### PDF Editor

* Fix crash when opening some `DjVU` files
* Fix annotations offset when exporting to `PDF`
* Fix the color of the worksheet borders with the Light interface theme

#### Security

* Fixed the vulnerability in 'PIVOTVIEW::loadContent' method when converting
  `XLS` to `XLSX`
* Fixed the vulnerability in 'GlobalsSubstream::UpdateXti()' method when
  converting `XLS` to `XLSX`
* Fixed the vulnerability in 'ChartSheetSubstream::recalc' method when
  converting `XLS` to `XLSX`
* Fixed the vulnerability which leads to buffer overflow when converting
  `ODP` to `PPTX`
* Fixed the vulnerability which allows adding a third party file to a document
  while converting `HTML` to `DOCX`
* Fixed the ability to execute the PowerShell commands when converting
  `DOC` to `PDF`

#### Convert

* Fixed files corruption after converting some `ODT` files to `DOCX`
* Fixed adding the excess 'Default Extension="docxf" parameter when converting
  `DOCXF` to `DOCX`
* Fixed display of a date as a number when opening some `XLS` files
* Fixed losing contents of the cell with an added comment after exporting to `ODS`
* Fixed files corruption after converting some `DOC` files to `DOCX`
* Fixed document appearance in another editors after export some `DOCX` files
* Fixed data loss when converting some `DOC` to `DOCX` ([DocumentServer#2588](https://github.com/ONLYOFFICE/DocumentServer/issues/2588))
* Fixed stopping work of some `XLS` to `CSV` conversion
* Fixed files corruption after converting some `ODS` files to `XLSX`
* Fixed data loss on opening some `TXT` files
* Fixed files corruption after converting some `XLSB` files to `XLSX`

#### Mobile

* Fix stopping work of the editor if "document"."info" is missing in
  the initialization config
* Fix appearing the keyboard when opening a document in the Reader Mode
* Fix an issue with selection bounds in the Reader mode
* Fix text scale in charts for Reader mode
* Improve the table view in Reader mode
* Improve the view of table and paragraph in Reader mode
* Fix display of the toolbar when scrolling a document in the Reader mode
* Fix the search results position in the RTL UI
* Fix work of handwriting input in the form fields
* Fix work of `OFORM` to `PDF` conversion

## 8.0.0

### New features

#### All Editors

* Move adding a comment to the entire document from the bottom of the comments
  panel to the settings button
* Add a button for adding a comment to text to the header of the comments panel
  similar to the button in the toolbar
* Add the interface translation into Serbian (sr-Latn-RS, Serbian (Latin,
  Serbia and Montenegro)) and Arabic (ar-SA, Arabic - Saudi Arabia)
* Add Indonesian language id-id (Indonesian (Indonesia)),
  en-id (English (Indonesia)) to the regional settings
* All buttons that do not fit in height should be placed into More button:
  category buttons, as well as plugins that were opened in the left panel
* Add the setting to enable support for Screen readers
* Add RTL support (beta) to the editors UI

#### Document Editor

* Add partially support for bidirectional text

#### Spreadsheet Editor

* Add the new Goal Seek functionality
* Add the new Series tool for creating number sequences
* Implement a wizard for inserting charts: display a list of recommended charts
  and previews for all types of charts based on the selected data
* Expand cell filling settings
* Add the Expand/Collapse menu item to the toolbar and the context menu
  of Pivot tables
* Add the ability to center a sheet horizontally and vertically when printing
* Add the ability to get a link to the selected range in the viewing mode

#### Presentation Editor

* Add the ability to set the final color for animation effects that change
  color
* Make animation effect icons inactive if the effect cannot be applied
  to an object
* Add partially support for bidirectional text

#### Forms

* Switching from the `OFORM` to `PDF` format containing forms in accordance
  with the OOXML format
* Dialog for converting old `OFORM` files to `PDF`
* For the radio button field, add the setting for the name of the selected
  element (Radio button choice)
* Add a chain of tips when working with `DOCXF` files

#### Security

* Fix vulnerability which allows adding a third-party audio file to a document
  when converting `PPT` to `PPTX`
* Fix vulnerability which leads to buffer overflow when converting `ODP`
  to `PDF`
* Fix vulnerability which leads to buffer overflow when converting `PPT`
  to `PPTX`
* Fix vulnerability which allows performing manipulations on the client
  machine when converting `HTML` to `DOCX`
* Fix XSS in the Shape name field when applying an Animation
* Fix XSS in the Math Autocorrect field when saving the field value
* Fix XSS in the Spreadsheet Editor cell when opening the Number format list
* Fix XSS in the Sheet name value when applying Search
* Fix  XSS in the Custom Number Format when opening a list
* Fix XSS in the Dropdown List field when opening it

#### Back-end

* Add the `formsdataurl` parameter to the Callback handler (to replace
  `formdata`), which contains a link to the `json` file with data from filled
  forms when sending with the `Submit` button
* Add support for Oracle and MS Sql Server databases. For connecting, the `oracle`
  and `mssql` database type is used

  Advanced connection [settings](https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connection-strings)
  for oracle - `oracleExtraOptions`

  Advanced connection [settings](https://github.com/tediousjs/node-mssql#tedious)
  for mssql - `msSqlExtraOptions`
* Add the JSON  `watermark` parameter to conversionapi for inserting
  a watermark when rendering to `PDF` and images

#### WOPI

* Add the `query param` `WOPISrc` to requests from browser to server to send
  requests to a single server. For `WOPI`, the parameter sent by an integrator
  is used, for Docs API,  the `document key` is specified in `WOPISrc`

#### Mobile

* Add the ability to switch to the system theme
* Change the interface for working with forms
* Add formula search and list of recently used formulas in the mobile
  Spreadsheet Editor
* Add the ability to add a custom cell format in the mobile Spreadsheet Editor
* Add switching to the reading or editing mode when opening the mobile Document
  Editor based on the `mobileForceView` parameter in the configuration file
* Add the ability to set the document language in the mobile Document Editor

#### Customization

* Add the ability to set an avatar for the current user using the editor
  config: `config.editorConfig.user.image` (this image will not be visible
  for other users)

#### API

* Add the following methods: `GetFreezePanesType`, `SetFreezePanesType`, and
  the `FreezePanes` property
* Add the `GetFreezePanes` method and the `FreezePanes` property to `ApiWorksheet`
* Add the `ApiFreezePanes` class with the following methods: `FreezeAt`,
  `FreezeColumns`, `FreezeRows`, `GetLocation`, `Unfreeze`
* Add the following methods for obtaining and filling out form data
  to the Builder of the Document Editor:
  `ApiDocument.prototype.GetFormsData = function()`,
  `ApiDocument.prototype.SetFormsData = function(arrData)`
* Add the `ApiDocument.prototype.AddDrawingToPage =
  function(oDrawing, nPage, x, y)` method for adding any `ApiDrawing`
  to a given page
* Add the ability to set avatars for users using the `onRequestUsers`
  integrator event with the `data.c="info”` parameter and the `setUsers` method

#### Plugins

* Add the ability to launch several visual plugins simultaneously (a separate
  button should be added to the left panel for each plugin)
* Move background plugins to the Background Plugins button menu

## 7.5.1

### Fixes

#### All Editors

* Fixed print options (rang) tuning for documents and presentations
* Fixed opening files with size more than 100MB
* Fixed some issues with composite input

#### Document Editor

* Fixed crashing if equation contains "&" or "@" symbols ([DocumentServer#2455](https://github.com/ONLYOFFICE/DocumentServer/issues/2455))
* Fixed crashing on transformation of some equations to Professional mode
* Fixed hanging of the editor after copied data is inserted and equation is added
* Fixed incorrect painting inserted Text Art
* Fixed autocorrection of the equation to the power with few iterations
* Fixed autocorrection "\dots" in the LaTeX mode
* Fixed equations transformation for brackets with "\open" and "\close"
* Fixed moving the part of number to the power after transformation
  of some equations
* Fixed activation of the option "Allow overlap" in some `DOCX` files
* Fixed hiding of Shapes styles list when mouse button was pressed longer
* Improved translations for Chinese (Simplified)

#### Spreadsheet Editor

* Fixed hanging of the editor after image was inserted and operation was canceled
* Fixed crashing after deleting "^" or "`" symbols on some keyboard layouts
* Fixed issue when cell border became hidden due to hide row with part of
  merged cell
* Fixed appearance of editor gridlines for zoom of the window 200% and more
* Fixed equation transformation for Linear/Professional mode switching from
  context menu
* Fixed print issue for Header/Footer
* Fixed recalculation of `COUNTIFS` function if arguments were changed
* Fixed incorrect calculating of `COUNTIFS` function ([DocumentServer#2459](https://github.com/ONLYOFFICE/DocumentServer/issues/2459))
* Fixed displaying data in the Filter window in some `XLSX` files
* Fixed appearance of the Sheet view mode when `High contrast` theme activated
* Fixed reseting of the Page fields by Delete key in the Print dialog

#### Presentation Editor

* Fixed error on click Head & Footer in Insert tools panel
* Fixed crashing in the Reporter mode on changing slide from end demonstration
* Fixed drawing of first Text Art style
* Fixed print text in Header or Footer of the slide
* Fixed hiding of the Animation icon for small size of the editor window
* Fixed appearance of the Presenter mode buttons when `Same as system` theme
  activated

#### Forms

* Fixed shifting of radio button in some `OFORM` files

#### PDF Editor

* Fixed saving document through "Save copy"
* Fixed incorrect processing editor's config (`editorType`)
* Fixed issue for plugin "Send" when there is no email client installed
* Fixed issue related to input disabled on creating
* Fixed issue with loading font when load the PDF editor
* Fixed drawing highlight in some `PDF` files
* Fixed moving to the comment when it was clicked at the comment sidebar
* Fixed hiding of the comment when another page is opened
* Fixed work of `Esc` key when the fields are being filled out
* Fixed work of `Alt` + `Page Up` / `Alt` + `Page Down` keyboard shortcuts

#### Security

* Fixed XSS when adding `Sheet view` name and opening `Version history`
* Fixed XSS when entering into cell and opening format list
* Fixed the vulnerability which allows adding a third party image to a document
  while converting `ODT` to `DOCX`

#### Convert

* Fixed hanging of the editor on opening some `XLSX` files
* Fixed a conversion error of the `DOCX` file
* Fixed incorrect page size after converting some `ODT` files to `DOCX` ([DocumentServer#2456](https://github.com/ONLYOFFICE/DocumentServer/issues/2456))
* Fixed the error after resaving some `ODS` files
* Fixed an image loss after converting some `XML` files to `DOCX`
* Fixed hang up on opening some `PDF` files created with LibreOffice
* Fixed the joining of the content in cells after converting some `ODS` files
* Fixed files corruption after converting some `XLSB` files to `XLSX`
  
## 7.5.0

### New features

#### All Editors

* Interface scaling is preserved for future sessions
* Add a menu for quick access to the most popular symbols to the button
  for inserting symbols
* Support for `SVG`
* Add a setting to hide the toolbar for equation
* Add hints for images in `SmartArt` objects
* Add the ability to open files protected with a password in the embedded
  viewer
* Add the ability to edit points of the autoshape border to the right panel
* Add the support for 225 and 275 interface scaling
* Only `Ctrl` + `.` / `Ctrl` + `,` keyboard shortcuts are now used
  for superscript/subscript characters
* Change keyboard shortcuts for moving through the text on macOS:

  `Cmd` + `Arrow Left` – moving to the beginning of the line
  
  `Cmd` + `Arrow Right` – moving to the end of the line
  
  `Option` + `Arrow Left` – moving one word to the left
  
  `Option` + `Arrow Right`  – moving one word to the right
  
  Removing one word to the left: `Ctrl` + `Backspace` replaced with
  `Option` + `Delete`
  
  Removing one word to the right: `Ctrl` + `Fn` + `Delete` replaced with
  `Option` + `Fn` + `Delete`

#### Document Editor

* Automatic hyphenation
* Change the selection logic, add the `Smart paragraph selection` setting
* Add the `Remove content control when contents are edited` setting
* Change behavior of the `Accept`/`Reject` review buttons in the toolbar
* Disable the `Zoom out` action for the `Ctrl` + `Numpad keyboard` shortcut due
  to the conflict with inserting an em dash
* Change the keyboard shortcut for strikeout text formatting on macOS:
  `Ctrl` + `5` replaced with `Cmd` + `Shift` + `X`
* Change the keyboard shortcut for inserting ellipsis on macOS:
  `Ctrl` + `Option` + `.` replaced with `Option` + `;`

#### Spreadsheet Editor

* The ability to display only formulas in cells
* Trace precedents / dependents
* New function: `SORTBY`
* Margins presets for printing
* Add the ability to set a number format in the field settings
  for `Pivot Tables`
* The `Show details` feature for working with a `Pivot Table`
* Improvement of the ability to open data on a new sheet by double-clicking
  a value in a `Pivot Table`
* Autocompletion for days of the week and months when stretching a cell value
* Drag-and-drop for columns and rows
* Add filters by date and the ability to display data with the "Date" format
  in the form of a tree in the `Autofilter` window
* Inserting images into headers/footers
* External data update for the currently edited source file
* `CSV` files preserve recently used Delimiter and Encoding settings in `Local
  storage` for future sessions
* Insert page breaks
* Add the ability to open the source for external links
* Add the `Alt` + `Down` keyboard shortcut for opening the `Autofilter` window
  when the header of a column with a filter is selected

#### Presentation Editor

* Add the `Morph` transition
* Assigning names to objects
* Selecting a slide for the start of numeration
* `Notes` and `Handouts` in headers/footers settings
* Slide placeholders have alternative descriptions
* `SmartArt` insertion is available via a slide placeholder
* Change the color of the Presentation Editor header
* Add the ability to navigate to the specific slide with the consecutive
  pressing of the *slide number* + `Enter` when previewing a presentation
* Change the keyboard shortcut for starting a presentation on macOS:
  `Cmd` + `Shift` + `Return` is used

#### Forms

* Bring settings on the right toolbar to unified appearance

#### PDF Editor

* Support for the `PDF form`, annotations, comments, draw

#### Security

* Fix vulnerability which allows reading data from memory when converting `DOC`
  to `DOCX`
* Fix vulnerability which allows adding a third party image to a document when
  converting `HTML` to `DOCX`
* Fix vulnerability which allows performing manipulations on the client machine
  when converting `HTML` to `DOCX`
* Fix vulnerability which allows finding out the `JWT secret` of a third party
  server via the `XLSB` file conversion

#### Back-end

* Add commands for working with `forgotten files`: `getForgotten`, `deleteForgotten`,
  `getForgottenList` to [`coauthoring/CommandService.ashx`](https://api.onlyoffice.com/editors/command/)
* Add the [conversion error](https://api.onlyoffice.com/editors/conversionapi#error-codes)
  -9 to Conversion API for displaying the editor selection dialog
* Add parameters to the server config:
  `optionsCluster` (connection via
  [`node-redis`](https://github.com/redis/node-redis/blob/master/docs/clustering.md),
  `iooptionsClusterNodes`, `iooptionsClusterOptions` (connection via
  [`ioredis`](https://github.com/redis/ioredis#cluster)
  for connection to the `redis cluster`
* Add the `formdata` parameter, which contains `json` with data of
  the submitted form, to [`Callback handler`](https://api.onlyoffice.com/editors/callback)
* Add the `allowPrivateIPAddressForSignedRequests` flag, which prohibits
  requests via local links in the multitenancy mode, to the server config
* Assigning license restrictions for tenants in the server multitenancy mode
* Add the ability to override the `default.json` server config for a tenant
  in the multitenancy mode

#### Mobile

* The ability to download sdk on Android and edit files on portals natively,
  instead of using the mobile web version
* Version history
* Change the color of the Presentation Editor header
* Web version of the editors on iOS devices now opens in full and not as
  a mobile version

#### API

* Add methods: `GetWatermarkSettings`, `SetWatermarkSettings`
* Add the `onRequestSelectDocument` event, `setRequestedDocument` method
  instead of `onRequestCompareFile/setRevisedFile`, which are no longer
  supported
* Add the `onRequestSelectSpreadsheet` event, `setRequestedSpreadsheet`
  method instead of `onRequestMailMergeRecipients`/`setMailMergeRecipients`,
  which are no longer supported
* Add the `onRequestOpen` integrator event for opening an external data source

#### Plugins

* Restore working capacity from China
* Add `Developer mode` for the `Plugin Manager`

## 7.4.1

### New features

#### Document Editor

* Add Chinese font size system (for Chinese Simplified)

### Fixes

#### All Editors

* Fix hanging of the editor after switching the editor theme when a form
  is being filled out in the next tab
* Improve the algorithm for selecting a color name in the palette
  on the `Draw` tab
* Fix using bitmap glyphs when Italic is enabled forcefully ([DocumentServer#2271](https://github.com/ONLYOFFICE/DocumentServer/issues/2271))
* Fix displaying of an image used as the fill of a SmartArt object after
  saving a document
* Fix an error when entering text into SmartArt after selecting
* Update the interface translation into Chinese Traditional
* Add new pages to Help in French

#### Document Editor

* Fix XSS when obtaining data for `Mail Merge`
* Fix XSS when adding a `Caption` and `Cross-reference`
* Limit the number of recent lists in the Recently used section
* Fix offset of selection when moving to a monitor with different scaling
* Fix reset of the `Copy style` action after the first use
* Fix duplicating paragraph numbering in the document outline ([DocumentServer#2273](https://github.com/ONLYOFFICE/DocumentServer/issues/2273))
* Fix hanging of the editor after using `Mail Merge` and clicking
  on a paragraph
* Fix hanging of the editor after removing a table and a paragraph
  in some `DOCX` documents
* Fix hanging of the editor when using the Copy and Paste options
  in some `DOCX` documents ([DocumentServer#2299](https://github.com/ONLYOFFICE/DocumentServer/issues/2299))
* Fix displaying of the `Save as oform` and `Mark as favorite` toolbar icons
  for the interface scaling >200%
* Fix an error when adding or updated the Table of Contents in the `DOCX` file

#### Spreadsheet Editor

* Fix XSS in the `Edit Series` field when editing the range of an added chart
* Bring the case of drop-down list items in the `Pivot Table` properties
  to unified appearance
* Fix missing data in the first cell when importing from `TXT`/`CSV`

#### Presentation Editor

* Fix hanging of the editor when changing text alignment with a date and
  the `Update automatically` parameter
* Fix displaying of an image made in the Photo Editor plugin
* Fix displaying of a watermark in the slide show mode, if the Settings
  plugin is installed ([DocumentServer#1433](https://github.com/ONLYOFFICE/DocumentServer/issues/1433))

#### Back-end

* Fix delay when transferring data in the co-editing mode after setting
  a password for a document
* Fix undefined `err.stack` in node-redis
* Add prefix support to the example button
* Add connectivity via virtual path

#### Mobile

* Fix saving changes in documents on the DocSpace portal
* Fix work of buttons for actions with changes in the Review Change tab
  in the "Tracked changes" protection mode
* Fix work of the Cmd + C / Cmd + V / Cmd + X keys on iOS or iPadOS with
  an external keyboard
* Fix work of the "Tracked changes" document protection mode when reopening
  a document
* Fix necessity to switch to the editing mode after enabling
  the "Tracked changes" protection

#### Convert

* Fix the vulnerability which allows adding a third party image to a document
  when converting via x2t
* Fix the vulnerability which allows reading information from a third party
  file after converting a modified document via x2t
* Fix some data loss when converting `DJVU` to `PDF`
* Fix appearing excess content after converting the `HTML` file to `DOCX`
* Fix loss of an image on a slide after resaving the `PPTX` file

#### Docker

* Fix unhandled exception in cache response

#### Customization

* Fix incorrect cursor position when hovering on the slide list in
  a presentation if the `customization.toolbar:false` parameter is used

## 7.4.0

### New features

#### All Editors

* Add the Draw tab to the editors
* Add the ability to add/choose color using the Eyedropper tool in the editors
* Add the ability to copy formatting between graphical object
* Completely rework the Protect tab template in the settings panel
  of the `File` menu, add titles
* Add the ability to save objects as images in the context menu
* Add opacity settings for borders of autoshapes, images, Text Art objects, charts
* Add the support of radar charts
* Add the support of the `MHTML`, `SXC`, `ET`, `ETT`, `SXI`, `DPS`, `DPT`,
  `SXV`, `STW`, `WPS`, `WPT` formats for opening in the editors
* Change the component for displaying lists (add column headers)
* Add the number of results to the Search box
* Add the interface translation into Sinhala (si-LK, Sinhala (Sri Lanka))
* Add Danish (da-DK (Dansk (Danmark)) to the regional settings
* Add hints for color names
* Add help in Turkish
* Add the support for 250/300/350/400/450/500% interface scaling

#### Document Editor

* Add the ability to combine documents
* Add advanced settings for columns
* Add advanced settings for numbered and multilevel lists
* Add sections for recently used lists and lists in the current document in the presets
* Add the ability to create a new list using the settings dialog
* Add the ability to save a document to `PNG` and `JPG`
* Add the exception list for autocorrect of capital letters

#### Spreadsheet Editor

* Add the support for new functions: `SEQUENCE`, `XMATCH`, `EXPAND`, `FILTER`,
  `ARRAYTOTEXT`, `SORT`
* Add the ability to protect ranges by specifying permissions for editing for
  certain people. For other users, the range will be view-only
* Add the ability to change case of text
* Add page break preview
* Add the ability to save a spreadsheet to `PNG` and `JPG`
* Replace the Current sheet option with the Active sheets one
* Add the ability to set a page range for printing
* Add the ability to set the First page number in the print settings
* Add the long and short formats of dates to the number format presets
* Add menu items for working with pivot tables to the context menu
* Add the `Show values` as setting for pivot tables
* Rework the dialog window with sheet protection settings
  (move the `Allow edit ranges` button from the toolbar to the dialog window)
* Change layout for some dialog windows containing lists (named ranges,
  protected ranges, sorting, conditional formatting)
* Add the ability to set the first page number for the workbook sheet
* Add translation of formulas into Armenian

#### Presentation Editor

* Add the exception list for autocorrect of capital letters

#### Forms

* Change the fixed form snapping. The form position is now calculated from
  the beginning of the page
* Add the ability to add a new form without leaving the current one
* Improve track rendering for fixed forms
* Disable the ability to fill out forms in the editing mode
* Remain the ability to fill out forms in the viewing mode
  (the `ViewForms` button)
* Add a new API method for filling forms via the interface
* The current form now has the same fill as the others in the editing mode
* Fix minor issues with functioning of smaller forms inside complex ones
* Added the `Default value` field to the right panel due to disabling
  the ability to fill out forms in the editing mode

#### Back-end

* Add the support for the start_date parameter in the server license
  for supporting licenses which will work in the future
* User with an empty `user id` is considered as [anonymous](https://api.onlyoffice.com/editors/anonymoususers)

#### WOPI

* Add new parameters to `WOPI discovery`: [mobileView](https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/discovery#mobileview)
  and `mobileEdit` action for opening the mobile version of the editors
  It works via the API type parameter: [mobile](https://api.onlyoffice.com/editors/config/#type)

#### Mobile

* Add new formula languages in the Spreadsheet Editor
* Add suggestions for formulas in the Spreadsheet Editor

#### Docker

* Use a `unix socket` by default
* Use the default `supervisord` configuration
* Return the `init.d` supervisor file

#### Customization

* Add the parameter to customize the font size of interface elements (buttons,
  tabs, labels, etc.) in the editor configuration file:
  `customization`->`font`->`size`
  The setting is available for users with an extended license
* Add the parameter to hide the `Draw` tab in the editor configuration file:
  `customization`->`layout`->`toolbar`->`draw`: `true`/`false` (show/hide)
  The setting is available for users with an extended license

#### API

* Add new methods for plugins to get and replace the current word/sentence
It’s possible to get/replace a word/sentence both entirely and partially,
before the cursor and after the cursor.
It is regulated by the `part`=`entirely`|`beforeCursor`|`afterCursor` parameter

```javascript
asc_editor.GetCurrentWord(part)
asc_editor.ReplaceCurrentWord(replaceString, part)
asc_editor.GetCurrentSentence(part)
asc_editor.ReplaceCurrentSentence(replaceString, part)
```

* Add new methods to `ApiBuilder`
`ApiComment.GetCommentId` – returns a unique identifier of the comment created
  in the builder, it can be used again in this file in the future
* Fix an issue with working `ApiDocument.GetCommentById`
`ApiDocument.InsertTextForm` – inserts a text form instead of the selected text
into a document. It’s also possible to turn the selected text into
a Placeholder of this form
* For plugins, add the `onInsertOleObjects` event with the `OLEObjectData`
parameter (the array of objects), which works when inserting `OLE objects`
into a document. The `InsertOleObject`, `ChangeOleObjects` plugin methods
are marked as asynchronous

#### Plugins

* Add the `pluginsmanager` utility for installing/removing plugins in the server

## 7.3.3

### Fixes

#### All Editors

* Fix the vulnerability CVE-2023-30186 with memory exhaustion
  during work with `NativeEngine` function (Bug #60433)
* Fix crash when using Shift+← and Ctrl+→ in a graphical formula (Bug #60984) ([DocumentServer#2131](https://github.com/ONLYOFFICE/DocumentServer/issues/2131))
* Fix distance between labels and the axis
* Fix points label position (max min axis orientation)
* Fix bug with picking symbol fonts (and new scheme for the symbols map)
* Fix bug with "Connection is restored" in version history
* Fix updating other user cursor for the obfuscated version

#### Document Editor

* Fix the XSS vulnerability CVE-2022-47412 in the search and replace panel (Bug #60109)
* Fix font size in the `DOCX` file (Bug #60911)
* Fix crash when opening the DOCX file (Bug #60958)
* Fix display of a nested table (Bug #60963)
* Fix crash when changing the `LaTeX` modes in a graphical formula (Bug #60998)
* Fix letter case in the `DOC` file (Bug #60894)
* Fix crash in the `Unicode` / `LaTeX` modes
  in a graphical formula (Bug #61094)
* Fix display of changes in the document when counting pages (Bug #60567)
* Fix display of graphical formulas created
  in Microsoft Equation Editor 3.0 (MEE) (Bug #61103)
* Fix a conversion error in the `ODT` file (Bug #61117)
* Fix the button name in the Title window in French (Bug #61080)
* Fix saving the selection color when converting `OTT` to `ODT` (Bug #61031)
* Fix an error when saving a file in the Internet Explorer browser (Bug #61173)
* Fix display of a date in Dutch (Bug #61223)
* Fix copying / pasting text from MS Word to the Document Editor (Bug #61356)
* Fix crash when pasting text without keeping its
  original formatting (Bug #61409)
* Fix crash when selecting a table in the `DOCX` file (Bug #61448)
* Fix display of text in the `DOC` file (Bug #59639)
* Fix deleting a table when opening the `DOCX` file (Bug #61412)
* Fix display of data when sending to email (Bug #61300)
* Fix crash when updating cross references (Bug #61489)
* Fix numbering in headings (Bug #61550)
* Fix crash when changing the style of text in the `DOCX` file (Bug #61549)
* Add handling the Adding complex fields
* Add a class for working with the Adding fields data
* Implement the field ID to identify complex fields using plugins
* Add a method for plugins to remove the complex field wrapper
* Add a method for plugins to change editing restrictions
* Fix description of editing restrictions for plugins
* Remove unnecessary check for `ConvertContentView`
* Implement accepting / rejecting for the new review change type
* Add support for the `FORMTEXT` fields as complex fields
* Add a new type of the review change for a table row
* Fix the review `tablePr` change detection during selection
* Fix calculation for tables with an entire vertically merged row
* Fix table correction when loading a document
* Fix numbering in headings (Bug #61564)
* Fix rounding images in the `DOCX` file (Bug #61577)

#### Spreadsheet Editor

* Fix copying / pasting an image from an external source (Bug #60962) ([DocumentServer#2153](https://github.com/ONLYOFFICE/DocumentServer/issues/2153))
* Fix crash when opening the `XLSX` file (Bug #60926)
* Fix selecting a sheet with Ctrl+Shift+Space (Bug #60932)
* Fix crash when printing a workbook from version history (Bug #60973)
* Fix updating links which contain spaces in their titles (Bug #60980)
* Fix crash when opening a workbook for commenting (Bug #61052)
* Fix display of dates when saving a workbook to the `ODS` format (Bug #61089) ([DocumentServer#2102](https://github.com/ONLYOFFICE/DocumentServer/issues/2102))
* Fix removing a comment in the `ODS` file (Bug #61054)
* Fix an error when opening the `XLSX` file (Bug #61406)
* Fix crash when searching and replacing within the cell range (Bug #61572)

#### Presentation Editor

* Fix crash in a graphical formula (Bug #60939)
* Fix display of the `WMF` image in the `PPTX` file (Bug #61090) ([DocumentServer#2100](https://github.com/ONLYOFFICE/DocumentServer/issues/2100))
* Fix crash when opening the paragraph advanced settings
  in the `PPTX` file (Bug #61363)
* Fix crash when copying and autoshape and a graphical formula (Bug #61345)

#### Forms

* Fix display of a text field in co-editing (Bug #60920)
* Fix updating roles in co-editing (Bug #60921)
* Fix determination of the role for the Checkbox field (Bug #60922)
* Fix a field mask in the `OFORM` file (Bug #60945)
* Change display of a dropdown list (Bug #60986)
* Fix changing roles when saving a file (Bug #61070)
* Fix crash when filling in a form on the server with sdk
  without forms (Bug #61297)
* Fix crash when connecting to the server with sdk without forms (Bug #61297)

#### PDF Viewer

* Fix display of an image in the `PDF` file (Bug #61014)
* Fix changing size of the `PDF` before opening

#### Back-end

* Extend length of the jwt token to 32 symbols according to NIST SP 800-117
* Fix a bug with the multiple `update version` error
* Add the changes2forgotten source
* Fix the `session token` check after disconnecting Spreadsheet Editor
* Revert `token.browser` for backward compatibility with changes2forgotten
* Remove unused upgrade scripts of the database
* Remove the unused `doc_changes2` schema in the database
* Add the `extendSession` params to log
* Add a space to the line break in the `changesError` message
  so that Cloudwatch treats it as a single entry

#### Mobile

* Fix display of a warning when opening the `XLSX` file
  with external links (Bug #60297)
* Fix calling the file manager in the `DOCXF` viewing mode (Bug #61314)
* Add a window with the warning about saving to an editable format
  for the PDF and XPS files (Bug #61340)
* Fix scrolling slides (Bug #59816)
* Fix crash in the free Community Edition version
  of the mobile editor (Bug #61396)
* Fix display of the Standard view icon when opening the editor (Bug #58866)
* Fix setup of the mobile offset when the editor is not initialized

#### Convert

* Fix a conversion error of the `XLS` file (Bug #61222)
* Fix a conversion error of the `XLS` file (Bug #61294)
* Fix a conversion error of the `DOCX` file to `PNG` (Bug #61357)
* Fix a conversion error of the `HTML` file to `PNG` (Bug #61296)
* Fix an error when opening the `ODP` file after conversion
  PPTX to ODP (Bug #61445)
* Fix a conversion error of the `DOCX` file to `HTML` (Bug #61318)
* Fix an error when opening the `ODS` file after conversion
  the `XLSX` file to `ODS` (Bug #61353)
* Fix an error when opening the `XLSX`  file after conversion
  the `ODS` file to `XLSX` (Bug #60339)
* Fix a conversion error of the `DOCX` file to `PNG` (Bug #61475)
* Fix a conversion error of the `DPS` file to `PPTX` (Bug #61508)
* Fix an error when converting the `PPT` file to `PPTX` (Bug #61459)
* Fix an error when opening a file in LibreOffice after converting
  the `DOCX` file to `ODT` (Bug 61588)

#### Customization

* Fix display of the Feedback and support button in the mobile editor
  with `customization.feedback: false` (Bug #61123)
* Fix display of the Feedback and support button in the mobile editor
  with `customization.help: false` (Bug #61135)
* Fix display of the logo when setting up `loaderName` or `loaderLogo`
  and loading the editors mobile version (Bug #59658)

#### API

* Add the `locale` parameter to the plugin `GetName` method
* Add sending the plugin event on inserting OLE objects to a document
* Add the `GetPageCount` and `GetAllTables` methods
* Add special characters replacement for the `SearchAndReplace` method

#### Plugins

* Fix the Remove / Install button state in the Plugin Manager (Bug #61030)
* Fix initialization of event `onChangeContentControl` in the plugin (Bug #61194)
* Fix display of images after editing in the Photo Editor plugin (Bug #61261)
* Fix crash when adding a quote or a bibliography using
  the Zotero plugin (Bug #61306)
* Mark `pluginMethod_InsertOleObject` and `pluginMethod_ChangeOleObjects`
  as async methods
* Wrap info about the cursor change

## 7.3.2

### Fixes

#### Back-end

* Fix work of `sessionIdle` parameter (Bug #61049)
* Fix disconnect reason for `socket.io`
* Fix work of shutdown script (Bug #60982)
* Revert to classic `socket.io` upgrade to fix connection issue with proxy
* Fix database creation without `onlyoffice` owner (Bug #59826)

#### API

* Fix bug with double messages from editor

#### Docker

* Fix building docker image (Bug #61002)
* Install `rabbitmq-server` from default ubuntu repo

## 7.3.1

### No public release

## 7.3.0

### New Features

#### All Editors

* Equation quick access panel
* 3D Rotation settings for 3D charts
* Display of chart error bars (for opening only)
* Inserting Smart Art objects
* Uzbek dictionaries for spell checking: `Uzbek (Cyrillic)` and `Uzbek (Latin)`
* Presets for inserting horizontal and vertical text boxes
* Ability to hide left and right panel on the `View` tab of the top toolbar
* Width of the styles / themes panel now fits the whole number of items
* Grouping for table templates
* Cell styles in the OLE object editor
* Ability to resize dialog windows for editing charts, OLE objects,
  and mail merge recipients
* Unified appearance for dialog windows, context menus, toolbar, etc.
* Optimizing display of captions in the toolbar buttons
* Improving display of comments
* Changed metafiles conversion to `SVG`
* Reading and writing `PDF` are combined in a single library to optimize work

#### Document Editor

* Support for entering equations in two modes (`Unicode` and `LaTeX`)
* Ability to protect a document by setting a restriction on editing
* Button for accessing to statistics in the status bar

#### Spreadsheet Editor

* Watch Window
* Ability to select multiple items using ctrl/shift in the Watch Window
* Support for new functions: `TEXTBEFORE`, `TEXTAFTER`, `TEXTSPLIT`, `VSTACK`, `HSTACK`,
 `TOROW`, `TOCOL`, `WRAPROWS`,  `WRAPCOLS`, `TAKE`, `DROP`, `CHOOSEROWS`, `CHOOSECOLS`
* Support for updating links to external files and the ability to create these links
* Ability to add a link between files within the portal using `Paste Special`
* Ability to insert data from the `XML` file (XML Spreadsheet 2003 is supported)
* Grouping for pivot table templates and cell styles
* Changed preview size for cell styles

#### Presentation Editor

* Support for entering equations in two modes (`Unicode` and `LaTeX`)
* Guides and Gridlines settings in the `View` tab and the context menu
* Tooltips when moving guides and the ability to remove the selected guide
* Special Paste parameters for a slide
* Ability to save a shape (graphic object) as a picture in the context menu

#### Forms

* New fields: `Date and time`, `Zip Code`, `Credit Card`
* Managing roles: adding, editing, removing roles, assigning them to fields
* Ability to preview the `DOCXF` file from the point of view of each created role

#### Back-end

* Scheme for editing old binary formats with automatic conversion to
  [ooxml](https://docs.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/online/scenarios/conversion)
  for the `WOPI` protocol
* `/cool/convert-to/<format>` or `/lool/convert-to/<format>` file conversion
  service like in [Collabora](https://sdk.collaboraonline.com/docs/conversion_api.html)
  for the `WOPI` protocol
* Page for converting files from old formats for the `WOPI` protocol
* Library for exchanging data with the server changed
  from [sockjs](https://www.npmjs.com/package/sockjs) to [socket.io](https://socket.io/)
* Service manager in the onlyoffice-documentserver packages changed
  from `supervisord` to `systemd`
  to get rid of excess dependence and simplify functionality for end users
* Ability to work in the non-interactive mode added to the configuration script
  of the document-server `rpm` package.   Configuring is performed via parameters.
  The `-h` parameter is used to display all the available parameters.
  Intended to be used for calling from other scripts etc.
* `jsonwebtocken` library is updated to v9.0.0.

#### x2t

* Refactoring and optimizing the conversion code

#### Customization

* Parameter for customizing the font of the interface elements (buttons, tabs,
  captions etc.) in the configuration file:
  `customization`->`font`->`name: "font name"`.
  The setting is available for users with the extended license.
* Parameters for initial state of the left and right panel display
  in the configuration file:
  
  `customization`->`layout`->`leftMenu`->`mode: true`/`false` (show/hide),
  
  `customization`->`layout`->`rightMenu->mode: true`/`false` (show/hide)

#### Api

* New `GetRange` method for the `ApiRange` class, which allows getting
  a substring from the Range object.

### Fixes

* Fix the vulnerability with adding an admin to Nextcloud via macros (Bug #60088)
* Fix the XSS vulnerability when creating a new style
* All components received countless fixes

## 7.2.2

### Fixes

#### All Editors

* Change selection font for base math font

#### Document Editor

* Fix the document bouncing in fast co-edit mode (Bug #59647) ([DocumentServer#1955](https://github.com/ONLYOFFICE/DocumentServer/issues/1955))
* Fix ability to review the document by anonymous users (Bug #59592)
* Fix changing `Unit of Measurement` property in `Advanced Settings` (Bug #59911)
* Fix the problem with compiling text properties of paragraph numbering (Bug #59324)
* Fix comment highlight rendering (Bug #59640)
* Fix calculating end info of the paragraph (Bug #59997, #60026)
* Fix printing selection for some documents (Bug #60167)
* Fix calculating the end info of a paragraph in table (Bug #60115)

#### Spreadsheet Editor

* Fix print from the integrations (Bug #59466)
* Fix hangup on opening xlsx file (Bug #59549)
* Fix displaying of the descriptions in `Function Arguments` window
  for non-English formula languages

#### Presentation Editor

* Fix applying auto-correction in the equations (Bug #59529) ([DocumentServer#1960](https://github.com/ONLYOFFICE/DocumentServer/issues/1960))

#### Convert

* Fix some specific files in docx to png conversion (Bug #59923)

#### Back-end

* Major improvements of js compilation during convertions
  through creating js caches with fonts
* Fix file collection with setting `FileConverter.converter.errorfiles`
* Add idle session close log and `clientLog` command
* Add `onDocumentContentReady` log message

#### API

* Fix `GetVisibleRegion` method
* Add `WordControl.ScrollToAbsolutePosition` method

#### Mobile Web Editors

* Fix the editors loading in some integrations on iOS and iPadOS (Bug #59604)

#### Docker

* Fix port parsing from `amqp_uri` if host contains digits including IP (Bug #59483)([Docker-DocumentServer#215](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/215))
* Add base image and PostgreSQL version build arguments
* Fix errors when starting the container on CentOS 9 (Bug #59481)([Docker-DocumentServer#522](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/522))

#### Integration Example

* Fixed several issues with jwt in different examples

## 7.2.1

### New Features

#### All Editors

* Major improvements in fonts render engine. Removal of `Alternative input` settings

### Fixes

#### All Editors

* Fix `Help` closing (Bug #59315)

#### Document Editor

* Fix numbering in Portuguese or Basque language (Bug #59091)
* Fix the problem with review types when splitting paragraph (Bug #58512)
* Fix the problem with special paste button (Bug #59149)
* Fix crash on opening docx (Bug #59212)
* Fix the problem with reading `rPrChange` property and review such files (Bug #59205)
* Fix scrolling in co-edit view mode (Bug #57928)
* Fix the problem with performing the global undo (Bug #59270)
* Fix the problem with set the bold property for text in the complex script
  (Bug #59289)
* Fix special paste position (Bug #59139)

#### Spreadsheet Editor

* Fix hangup on opening xlsx file (Bug #58112)
* Fix special paste via hotkey (Bug #59148)

#### Presentation Editor

* Fix animations problems (Bug #59301)
* Fix opening pptx file (Bug #59308)

#### Convert

* Fix xlsb to xlsx conversion (Bug #59002)
* Fix broken docx with 3D charts (Bug #58814)
* Fix some specific files in ppt to pptx conversion (Bug #59074, Bug #59106,
  Bug #59108, Bug #59261, Bug #59276, Bug #59277, Bug #59281, #59261)
* Fix some specific files in xlsx to ods conversion (Bug #59118)
* Fix metadata loss in PDF (Bug #59153)
* Fix problems with opening xps files (Bug #59119)
* Fix empty presentation for ods to pptx conversion (Bug #59220)
* Fix xlsx to ods conversion (Bug #59221, Bug #59353)
* Fix xls to xlsx conversion (Bug #59209)
* Fix rtf to docx conversion (Bug #59322)
* Fix doc to docx conversion (Bug #59329)
* Fix csv number formats (Bug #59357)
* Improve EMF images rendering

#### PDF Viewer

* Fix search highlight (Bug #59069)
* Fix tooltip language for preview (Bug #59087)

#### Forms

* Major improvements in saving forms to PDF
* Implement save text field formats to PDF (Bug #58901)
* Add default form key when creating new forms
* Fix image track display (Bug #59120)
* Fix the problem with highlight of a fixed form (Bug #59105)
* Fix duplicating fixed forms when saving to PDF
* Fix the problem with converting complex field to fixed form (Bug #59262)
* Fix the problem with entering text to form (Bug #59290)
* Fix the problem with working with complex fields and simple fields (Bug #59345)
* Fix keys list problems (Bug #59377)
* Fix the problem with cancel filling the form on form blur (Bug #59373)
* Fix the problem with key of complex forms (Bug #59374)
* Fix complex form filling problem for forms with same key (Bug #59375)
* Fix the problem with printing form borders filled with placeholders (Bug #59378)
* Fix the problem with updating content of a Ref field (Bug #58606, Bug #59278)

#### Back-end

* Calling separate callback for each `pathurl` request
* Fix forgotten migration ([DocumentServer#1911](https://github.com/ONLYOFFICE/DocumentServer/issues/1911))
* Set timeout for entire conversion
* Add `pathurl` command to startRPC
* Check connection status before sending changes
* Add `editor.maxChangesSize` limit to document changes in config
* Fix bug with using built-in Root CAs instead of Windows Store.
* Check license on live viewer authorization
* Add alias field for multi tenancy
* Add acknowledge to authChanges

#### API

* Fix `Api.CreatePictureForm` method (Bug #59159)
* New methods to work with Review mode via API

#### Mobile Web Editors

* Fix SmartArt rendering (Bug #58867)
* Fix hangup on duplicate slide (Bug #59102)
* Fix hidden separator in dark theme (Bug #58272)

#### Docker

* Update base image to `ubuntu:22.04`. Please update `docker-engine`
  to latest stable version (`20.10.21` as of writing this doc)
* Fix build of image (Bug #59310)([Docker-DocumentServer#506](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/506))

#### Integration Example

* Fixed several issues in different examples

## 7.2.0

### New Features

#### All Editors

* JWT with random key enabled by default. This fix CVE-2021-43445,
  CVE-2021-43447, CVE-2021-43448, CVE-2021-43449
* Random secret key by default. Fix CVE-2021-43444
* Fix CVE-2022-32212 by upgrading nodejs version
* Show warning on macros execution if connection to another host. Fix CVE-2021-43446
* Top toolbar optimizations for smaller screens
* Added the ability to choose "Contrast Dark" or "System default"
  interface theme (Bug 59010)
* More options in `View` tab. View tab available in comment and view mode
* Redone of icons in header line
* Ability to rename file from header (Should be supported by DMS)
* Redone of settings page
* Exact build number in `About` page
* New `Live viewer`  - ability to see changes in view mode
 (Should be supported by DMS)
* Stat page will show statistics for `Live viewer`
* New interface languages - `pt-PT`, `zh-TW`, `eu-ES`, `ms-MY`, `hy-AM`
* Redone of color selection component
* New option to disable alternative menu
* Completely redesigned search inside the document
* New hotkeys for `Special Paste`
* Added `Cut` and `Select All` buttons to the toolbar next to `Copy`\`Paste`
* Major improvements in Font engine (For languages like Bengali or Sinhala)
  (Only in Document Editor and Presentation Editor)
* Ligatures support
* Ability to insert tables as OLE object
* Support for images as a bulleted list and the ability to work with them
* Major improvements in `EMF` and `WMF` files rendering
* Completely new plugin marketplace

#### Document Editor

* Ability  to remove Header/Footer from toolbar
* Ability to insert current heading in TOC
* New warning if there is no TOC in document
* Navigation panel renamed to `Headings`
* Major improvements in `pdf`, `djvu`, `xps` convert to `docx`
* Correct display Greek letters as numbered list items
* New types of multilevel lists, which can be applied to Headers
* Redone changes apply in Review mode

##### Spreadsheet Editor

* Ability to `Switch rows and columns` for Chart
* New `Italiano (Svizzera)` language for regional settings
* Row number highlight for filter
* Remove `First sheet` and `Last sheet` from bottom toolbar
* Selection of copied range
* `Get link to this range` in context menu
* Pivot table option - `Auto-fit column widths on update`
* 1904 date system support

##### Presentation Editor

* Animation with Custom path
* New advanced settings `Placement` tab for shapes\charts\images

#### Forms

* Search in embedded and forms mode
* Change field width for `Comb of characters`-enabled field
* Ability to set tag for field
* New `Format` and `Allowed Symbols` settings for field
* New field types - `Phone number`, `Email Address` and `Complex Field`

##### Installation

* Auto detect of DB type in `deb` package
* `arm64` and `amd64` docker images use same tag

###### Back-end

* `WOPI` discovery action for embedded viewer

##### Customization

* Ability to set phone in `About` page

##### Api

* `GetFontNames()` methods for `Paragarph` and `Run`
* New methods to get cross-reference data:
  `ApiDocument.GetAllNumberedParagraphs();`,
  `ApiDocument.GetAllHeadingParagraphs();`,
  `ApiDocument.GetFootnotesFirstParagraphs();`,
  `ApiDocument.GetEndNotesFirstParagraphs();`,
  `ApiDocument.GetAllCaptionParagraphs();`
* New methods to set cross-reference data:
  `ApiParagraph.AddNumberedCrossRef();`,
  `ApiParagraph.AddHeadingCrossRef();`,
  `ApiParagraph.AddBookmarkCrossRef();`,
  `ApiParagraph.AddFootnoteCrossRef();`,
  `ApiParagraph.AddEndnoteCrossRef();`,
  `ApiParagraph.AddCaptionCrossRef();`
* New methods to replace elements:
  
  ```javascript
  ApiParagraph.GetPosInParent();
  ApiParagraph.ReplaceByElement();

  ApiTable.GetPosInParent();
  ApiTable.ReplaceByElement();
  
  ApiBlockLvlSdt.GetPosInParent();
  ApiBlockLvlSdt.ReplaceByElement();
  ```

* New methods to get size in EMU for drawings
  `ApiDrawing.GetWidth();` and `ApiDrawing.GetHeight();`
* Add new methods for chart:

  ```javascript
  ApiChart.ApplyChartStyle();
  ApiChart.SetPlotAreaFill();
  ApiChart.SetPlotAreaOutLine();
  ApiChart.SetSeriesFill();
  ApiChart.SetSeriesOutLine();
  ApiChart.SetDataPointFill();
  ApiChart.SetDataPointOutLine();
  ApiChart.SetMarkerFill();
  ApiChart.SetMarkerOutLine();
  ApiChart.SetTitleFill();
  ApiChart.SetTitleOutLine();
  ApiChart.SetLegendFill();
  ApiChart.SetLegendOutLine();
  ```  

* Improve support of regexps in code like `String.replace(/\s/g, "")`
* Improvements in `oRange.GetValue` and `oRange.GetValue2`
* Dozens of new methods for different objects.
  More detailed list at [here](https://api.onlyoffice.com/docbuilder/changelog)
* Fixes for several methods

### Fixes

* All components received countless fixes

## 7.1.1

### Fixes

#### All Editors

* Fix rendering list of fonts if there is a lot of fonts (Bug #46495)
* Fix rendering of some Chinese fonts (Bug #48564)([DocumentServer#1142](https://github.com/ONLYOFFICE/DocumentServer/issues/1142))
* Update help entries

#### Document Editor

* Fix lost text box in Header (Bug #56940)
* Fix incorrect table width for some doc file (Bug #56901)
* Fix convert of some docx files (Bug #57068, Bug #57177)
* Fix color of SmartArt figures in docx -> odt convert (Bug #57104)
* Fix page count in specific doc file (Bug #57334)
* Fix insert page with merge cells and drag'n'drop (Bug #57305)
* Fix zoom while touch-pad scrolling (Bug #56029)
* Hide "Create new" for offline pdf/djvu/xps files

#### Spreadsheet Editor

* Fix all sheets display while saving as pdf (Bug #49163)
* Fix zoom change with touch-pad on MacOS (Bug #57249)

#### Presentation Editor

* Fix re-save of some pptx files (Bug #57070)
* Fix text align for some ODP files (Bug #57214)
* Fix saving SmartArt in groups (Bug #57112)
* Fix crash on drawing animation labels by shape track

#### PDF Viewer

* Fix lost text in PDF -> ODT (Bug #57274)
* Fix lost text in PDF -> image convert (Bug #57363)
* Fix calling translate plugin (Bug #53808)

#### Mobile Web

* Fix merged button on tablets (Bug #56884)
* Fix interface move after close find & replace (Bug #56966)
* Fix tooltip for function description (Bug #56968)

#### Document Builder

* Fix broken presentation after using `ApiSlide.ApplyTheme` (Bug #57062)

#### Back End

* Fix crash with config with undefined permissions
* Increase connectionAndInactivity to reduce ESOCKETTIMEDOUT
  error on download and save
* Return inBody param for backwards compatibility with changes2forgotten

## 7.1.0

### New Features

#### All Editors

* ARM version for some systems
* New menu for inserting shapes (with list of recent used)
* Ability to edit points of a selected shapes
* Ability to open new diagram types: Pyramid, Bar (Pyramid),
  vertical and horizontal cylinders, vertical and horizontal cones
* Ability to crop a selected image to shape
* Sorting comments on the left sidebar by group
* Ability to see your file protection password when entering it
* Support for SmartArt objects without converting into a group of objects
* New interface languages: Galego/Galician, Azerbaijani
* Notifications appear when connection is lost and being restored
* Gradient fill icon shows the chosen colors

#### Document Editor

* Ability to convert PDF/XPS files into editable files
* New toolbar tab: View
* Ability to accept/reject changes from the context menu
* Ability to use special symbols when searching within documents
* Ability to add a period with a double-space
* Add Chinese/Japanese/Italian language to Watermark settings

#### Document Viewer

* New viewer for PDF, XPS, DJVU files with major performance improvements
  All operations are performed on the client side.
* Ability to use the Page Thumbnails panel and to
  display the document's contents on the left sidebar for PDF files
* Support for external and internal links in PDF opening
* Ability to use Hand/Select tools in PDF viewer
* The Document Info section of the Data tab contains
  information about PDF, XPS, DJVU files

#### Spreadsheet Editor

* Using a built-in preview panel before printing out a spreadsheet
* New `View` tab with settings like: Combine sheet and status bars,
  Always show toolbar,
  Interface theme,
  Show frozen panes shadow
* New currencies as per ISO 4217 without needing to change the locale
* Using tips when working with formulas for tables
* Ability to set a text qualifier when importing text from TXT/CSV
* Support for XLSB files for opening
* New context menu for moving sheets
* Groups can be opened and closed in view/comments mode

#### Presentation Editor

* New toolbar tabs: Animation, View
* Animations can be added to the presentation
* Ability to duplicate slides using the Add slide menu
* Ability to move a slide to beginning/end using a slide context menu
* Ability to insert recently used shapes using a new panel on the Insert tab
* Ability to add a period with double-space

#### Forms

* Ability to zoom a form

#### Mobile Editors

* Dark themes in mobile web editors and viewers
* New button to show lists in spreadsheet

#### API

* The last callbackUrl is needed for sending a link
 to a compiled file if a file was edited by the same user on different tabs
* New sections Features and Layout for Customization.
  Ability to customize interface, toolbar, left, right, bottom sidebar
* The following parameters are renamed:
  `leftMenu` -> `layout.leftMenu`,
  `rightMenu` -> `layout.rightMenu`,
  `toolbar` -> `layout.toolbar`,
  `statusBar` -> `layout.statusBar`,
  `spellcheck` -> `features.spellcheck`
* Ability to see the customer_id and the build type on index.html
* A lot of other changes in API, described [here](https://api.onlyoffice.com/editors/changelog#71)

#### Back end

* New environment variable X2T_MEMORY_LIMIT limiting memory for the x2t process
* [WOPI] New headers for putFile request:
  `X-LOOL-WOPI-IsModifiedByUser`,
  `X-LOOL-WOPI-IsAutosave`,
  `X-LOOL-WOPI-IsExitSave`
* Performance improvements via build components update
* `ttf-mscorefonts-installer` is now mandatory dependency for Linux version, for
  better compatibility with ooxml files

### Fixes

* All components received countless fixes

## 7.0.1

### New Features

#### Spreadsheet Editor

* `French (Switzerland)` regional setting (Bug #53978)

### Fixes

#### All Editors

* Fix problem with broken `About` customization (Bug #55647)

#### Document Editor

* Fix changes in text position (Bug #54485)
* Fix JS error while changing font in some files (Bug #55280)
* Fix the problem with calculating the position
  of flow objects lying in a table cell (Bug #51933)
* Fix the problem with calculating the position of
  a drawing object in the header (Bug #55398)
* Fix the problem with calculating header/footer.
  Forbid to change the page number of a header
  when calculation in progress (Bug #55403)
* Fix the problem with calculating the position
  of a drawing lying in a table cell
  with vertical alignment to the bottom or center (Bug #55406)
* Fix the problem with calculating page count stage (Bug #55458)
* Fix the problem with text position calculation for rotated table cells (Bug #54200)
* Fix `Shift + (` shortcut (Bug #55356)

#### Spreadsheet Editor

* Fix opening protected workbook in Excel (Bug #55027)
* Fix JS error while Find and Replace empty cell (Bug #54999)
* Fix compatibility of some files with Excel (Bug #54956)

#### Presentation Editor

* Fix shape position in slideshow mode (Bug #55068)

#### Forms

* Fix problem with license end (Bug #54910)
* Fix problem float characters limit (Bug #55410)

#### Mobile Editor

* Fix print and download permission problems (Bug #55043)

#### Back End

* Fix Remote Code Execution (Bug #54819)

#### Package

* Fix `rpm` update with some custom `local.json` values (Bug #50603)

## 7.0.0

### New Features

#### All Editors

* New sort types for Comment left sidebar
* Ability to call menu entries by pressing `alt+key`
* New canvas zoom options (up to 500%)
* Ability to customize dark menu logo from API

#### Document Editors

* Ability to add Content Controls and
  use File Comparison is available in OpenSource version
* Completely new mode for creating, filling and sharing forms
* Dark Mode (dark canvas background and other interface changes)
* New settings to change review mode `Track Changes Display`
* Ability to select local file for `Mail Merge`
* New setting for AutoFormat as you type -> hyperlinks and network paths

#### Spreadsheet Editor

* Version History
* Ability to use Sheet Views is available in OpenSource version
* Ability to protect spreadsheet files and separate sheets
* Ability to show other users cursor in co-edit mode
* Ability to separate sheets and status bar
* `pt-br` formulas description and translation
* Do not loose Query Table data
* Copy sheet with drag-n-drop with holding `ctrl`

#### Presentation Editors

* Ability to display animations
* Slide animation settings moved to top Tab
* New setting for AutoFormat as you type -> hyperlinks and network paths
* Ability to save presentation to `BMP` and `PNG`

### Fixes

* All components received countless fixes

## 6.4.2

### Fixes

#### All Editors

* Fix JS errors while copy chart from Document Editor
  to Presentation Editor (Bug #52844)
* Fix `htmlutils.js` not found for `toolbarNoTabs` option (Bug #52849)([DocumentServer#1445](https://github.com/ONLYOFFICE/DocumentServer/issues/1445))

#### Documents Editor

* Fix JS error while comparing some specific docx files (Bug #52909)
* Fix JS error while undo in compare mode (Bug #52865)

#### Spreadsheet Editor

* Fix lost gradient in some files (Bug #52801)

#### Integration Example

* Major updates in all components
* Fix some issues in `WOPI` view

## 6.4.1

### New Features

#### Viewers

* Support of `oxps` file format on view

### Fixes

#### All Editors

* Major improvements in setting East Asia font names in interface
* Fix several issues with 125% and 175% scales (Bug #51946, Bug #49877,
  Bug #52329, Bug #52486, Bug #50724, Bug #52486)
* Fix IE11 problem (Bug #52520)

#### Document Editor

* Fix `To next change` problem in Simple Markup (Bug #52204)
* Fix problem selecting table in specific docx (Bug #52239)
* Fix delimiter while insert cross-reference (Bug #51827)
* Fix JS error for convert table to text for specific docx (Bug #52229)
* Add some exceptions for auto-capitalization (Bug #52357)
* Fix table border while saving PDF (Bug #52223)
* Fix cell spacing in some specific docx (Bug #52435)
* Fix table position for specific docx (Bug #52468)
* Fix non-empty changes set for empty document (Bug #52556)
* Fix page number position for specific document (Bug #52470)
* Fix lost space symbol while inserting text (Bug #52070)
* Fix convert to table single line (Bug #52603)
* Fix JS error while opening some specific docx (Bug #52697)
* Fix issues with dark theme and `New style from selection` (Bug #52672)

#### Spreadsheet Editor

* Fix problem with headers print (Bug #52231)
* Fix memory leak in specific xlsx (Bug #52270)
* Fix chart legend for specific xlsx (Bug #52118)
* Fix changing item to percent conditional formatting (Bug #52189)
* Fix deleting dropdown while using Clear All (Bug #44855)
* Fix maximum call stack error for chart for whole column (Bug #52551)

#### Presentation Editor

* Fix JS error while duplicate slide (Bug #52550)([DocumentServer#1423](https://github.com/ONLYOFFICE/DocumentServer/issues/1423))
* Fix chart style select (Bug #52113)

#### Back End

* Major redone of `AllFontsGen` for better support CJK fonts
* Fix `logrotate` config (Bug #49523)
* WOPI is disabled by default

#### x2t

* Fix `Date` conditional formatting when saving as ODS (Bug #51935)
* Fix convert text to table borders in specific file (Bug #52159)
* Fix conditional formatting with Begins with while saving to ODS (Bug #51937)
* Fix broken pptx file after convert from ppt (Bug #52191)
* Fix page color while converting rtf to docx (Bug #50003)
* Fix convert docx to odt for specific files (Bug #52240)
* Fix convert failure for specific pptx file (Bug #52259)
* Fix image loss while docx -> rtf convert (Bug #52395)
* Fix broken docx file after doc -> docx convert (Bug #52607)

#### Mobile web editors

* Fix locked cell names (Bug #52308)
* Fix memory leak for specific docx file (Bug #52137)
* Fix text input in emulator (Bug #52371)
* Fix text selection in some specific cases (Bug #51121)
* Fix context menu flickering (Bug #52512)

#### Integration Example

* Nodejs: Fix support of IE11
* Add support of oxps files
* Actualize sample templates
* Fix nodejs example on custom port (Bug #50977)(Bug #52552)

#### plugins

* Actualize `macros` plugin libraries
* Fix language select for `translate` plugin

#### Docker

* New `WOPI_ENABLED` environment variable

## 6.4.0

### New Features

### All Editors

* Add support of Web Application Open Platform Interface (WOPI) protocol
* Major improvements in support of chart styles
* Ability to Resolve all comments
* Change list symbols render
* Add chart styles for users with visual impairment
* Add ability to use tab\shift+tab in some controls
* Add 125% and 175% interface scale
* Ability to set theme by config
* Ability to set user permissions for comment mode
* Ability to view unique user link count on info page
* Ability to force co-edit mode via config
* Improved render of CJK fonts in PDF files

### Document Editor

* Ability to convert text to table
* Ability to convert table to text
* Auto-capitalize first letter
* New review mode: Simple markup

### Spreadsheet Editor

* Ability to add/remove/edit conditional formatting
* Ability to add sparklines
* Change select by pressing `tab` + `enter`
* Data import from txt, csv
* Ability to run macros on mouse click over graphic object
* A lot new languages for formulas description (Belarusian, Bulgarian,
  Catalan, Chinese, Czech, Danish, Dutch, Finnish, Greek,
  Hungarian, Indonesian, Japanese, Korean, Lao, Latvian,
  Norwegian, Polish, Portuguese, Romanian, Slovak,
  Slovenian, Swedish, Turkish, Ukrainian, Vietnamese)
* Add setting for hyperlink auto-correction
* Freeze panes presets
* Setting for `show zeros` in cells
* Chain comments support
* Add argument names to function wizard

#### Presentation Editor

* Version History
* Ability to hide notes panel
* Auto-capitalize first letter

#### Mobile Editors

* Mobile web editors completely rewritten on React

### Fixes

* All components received countless fixes

## 6.3.2

### Fixes

#### Document Editor

* Fix display data in `Navigation` panel (Bug #51297)([DocumentServer#1368](https://github.com/ONLYOFFICE/DocumentServer/issues/1368))

## 6.3.1

### New Features

#### Back End

* Add 'license' command to CommandService.ashx

### Fixes

#### All Editors

* Fix fonts in Help entries (Bug #50473)
* Fix several issues related to Dark Theme (Bugs #50284, #50416, #50459, #50656)

#### Document Editor

* Fix opening files with broken `en-ZA` dict (Bug #50471)
* Fix hieroglyph rotation in 150% zoom (Bug #50482)
* Fix file password reset for `Mail Merge` (Bug #50474)
* Fix applying changes in some specific file (Bug #50604)
* Fix parser error for files with continuous space in name (Bug #50466)
* Fix opening documents with deleting password (Bug #50481)
* Fix document print after adding password (Bug #49716)

#### Spreadsheet Editor

* Fix JS error while opening xlsx file (Bug #50509)
* Fix Format as Table in specific file (Bug #50489)
* Fix inserting line in specific file (Bug #50521)
* Fix unnecessary memory consumption in pivot tables
* Fix incorrect `IF` formula calculation (Bug #50549)
* Fix JS error while changing zoom while editing cell (Bug #50642)
* Escape sheet name for regexp on changing sheet name or on deleting sheets
* Fix losses ole-objects on opening

#### Presentation Editor

* Fix table templates preview on different scales (Bug #50446)
* Fix JS error while changing specific shape (Bug #50607)
* Fix theme preview for small size windows (Bug #50578)

#### build_tools

* Fix build on Debian 10 and all actual versions of Ubuntu
* Fix config location and port for running compiled DocumentServer

#### x2t

* Fix ppt => pptx convert (Bug #50383)
* Fix cell color for xls => xlsx convert (Bug #46852)
* Fix missing data in xls (Bug #50426)
* Fix empty rtf file (Bug #50434)

#### Plugins

* Adapt `Marcos` plugin for dark theme (Bug #49768)

## 6.3.0

### New Features

#### All Editors

* Interface Themes support
* 150% interface scaling support
* Spellchecker implemented as SharedWorker. No more back-end service for spellchecker
* Ability to add file to favorites (must be supported on DMS side)
* Password protection support
* New chart types (lines and scatter)
* Ability to setup anonymous user name
* Check hyperlinks for 2083 symbol length
* Ability to print files in Firefox
* Macros methods tooltips

#### Document Editor

* Wrapping for shapes in Top Toolbar
* Indents settings in Paragraph Right Sidebar
* Change Register operation in Top Toolbar
* Change List Level operation
* Track changes mode redone, ability to save it to file
* Export to html, fb2, ePub

#### Spreadsheet Editor

* Add new chart type - combo
* Redone Chart Advanced Setting with more axis settings
* Add ability to set axis label format
* New date format "YYYY-MM-DD" (ISO 8601)
* Cell Indent setting in Table Right Sidebar
* Opening of Microsoft Office XML 2003 files
* Group and Ungroup operation for Pivot Tables
* XLOOKUP function

#### Presentation Editor

* Slide opacity setting
* Setup columns in shape via Top Toolbar
* Presentation Animations are saved after export from our editor

### Fixes

* All components received countless fixes

## 6.2.2

### Fixes

#### Server

* Remove ability to execute DocumentBuilder scripts from Editors
* Fix vulnerability with 'insert image from url' and 'compare document from url`

#### x2t

* Fix convert time for specific document (Bug #49434)
* Fix broken pptx file after open in Presentation Editor (Bug #49429, #49202)

#### Docker

* Fix instruction for using Let's Encrypt ([Docker-DocumentServer#349](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/349))

## 6.2.1

### Fixes

#### Document Editor

* Fix data loss after opening document reviewed by user (Bug #48920)
  ([DocumentServer#1159](https://github.com/ONLYOFFICE/DocumentServer/issues/1159))
* Fix JS error while entering text after cursor mouse move (Bug #49090)
* Fix opening docx file with chart in MS Office (Bug #49219)

#### Spreadsheet Editor

* Fix copy from Document to Spreadsheet (Bug #49013)

#### Presentation Editor

* Fix broken PPTX while opening in Microsoft PowerPoint (Bug #49258)([DocumentServer#1191](https://github.com/ONLYOFFICE/DocumentServer/issues/1191))

#### Integration

* Fix missing plugin tab (Bug #49007)

## 6.2.0

### New Features

#### All Editors

* Ability to use Tab/Shift+Tab in some dialog windows
* Change color of loader to darker one
* Ability to setup font size 300pt (409pt for Spreadsheets)
* New translation to Belarusian, Catalan, Greek, Lao, Romanian
* Beta versions has new `beta` mark in left toolbar

#### Document Editor

* Ability to insert Table of Figures

#### Spreadsheet Editor

* Ability to insert slicers in pivot tables
* Data Validation settings
* Ability to cancel auto-expansion of tables
* Support of custom number format
* `GROWTH`, `TREND`, `LOGEST`, `UNIQUE`, `RANDARRAY` functions support

#### Presentation Editor

* Ability to setup auto-format as you type
* Buttons for increase-decrease font size

#### Back-end

* Mark person clicking the force-save button as file author

### Fixes

* All components received countless fixes

## 6.1.1

### Fixes

#### All Editors

* Fix display units `none` for chart (Bug #43017)
* Show custom message for protected files

#### Document Editor

* Fix JS error while clicking on table in specific docx (Bug #47871)
* Fix JS error while pressing Escape adding free form line (Bug #47958)
* Fix opening `Mail Merge` specific file  (Bug #47747)

#### Spreadsheet Editor

* Fix JS error while clicking on link in shape (Bug #47864)
* Fix translate for Freeze Pane Shadows (Bug #47739)

#### Mobile Editors

* Fix error while showing comment (Bug #47765)

#### Server

* Fix missing `/info` page (Bug #47819)
* Fix ??? symbols in chinese fonts (Bug #47995)([DocumentServer#1099](https://github.com/ONLYOFFICE/DocumentServer/issues/1099))

#### Installation

* Once again fix problem with DB clean
  (`onlyoffice-documentserver.postinst: 124: [: false: unexpected operator`)
  ([DocumentServer#1043](https://github.com/ONLYOFFICE/DocumentServer/issues/1043))
  ([DocumentServer#1088](https://github.com/ONLYOFFICE/DocumentServer/issues/1088))

#### x2t

* Fix problem detecting fodt, fods, fodp files (Bug #47775)
* Fix saving image placeholder to odt (Bug #47278)
* Fix saving file with image name to odt (Bug #47638)
* Fix opening link in specific doc file (Bug #47574)

#### ePub

* Fix `%20` symbol in some ePub files

#### Plugins

* Fix plugin custom width (Bug #47845)
* Fix translator plugin for IE11 (Bug #47773)
* New icons for translator plugin

## 6.1.0

### New Features

#### All Editors

* Complete redone html-based formats (`ePub`, `mht`, `html`)
* `fb2` format can be opened in viewer
* Redone gradient control and ability to set custom angle for gradient fill
* New icons in context menu
* Add support of AutoFormat as you type
* Apply button in File menu always visible
* Ability to copy comment from left sidebar

#### Document Editor

* Ability to show line numbering
* Ability to add cross-reference
* Add support of endnotes
* Ability to edit AutoCorrect list
* Add ability to set review permissions by groups
* Select Data button in Chart Editor

#### Spreadsheet Editor

* Ability to work with sheet view (available only for paid version)
* Support of editing data ranges in Chart
* Redone cell editor height change
* New cursor for column\row hover
* Ability to hide freeze pane shadow
* Pivot Table can be inserted from `Insert` tab

#### Plugins

* Translate plugin uses Google Translate, instead of Yandex
* Add ability to add help to plugin

#### Embedded Viewer

* Print button in Embedded viewer
* Removed deprecated Google+ share

### Fixes

* All components received countless fixes

#### Back-end

* `ttf-mscorefonts-installer` is now optional dependency.

## 6.0.2

### New Features

#### Integration Example

* Integration example now included in open-source version

### Fixes

#### All Editors

* Fix problem with insert BMP image in doc (Bug #47276)

#### Installation

* Fix problem with DB clean
  (`onlyoffice-documentserver.postinst: 124: [: false: unexpected operator`)
  ([DocumentServer#1043](https://github.com/ONLYOFFICE/DocumentServer/issues/1043))

#### Back end

* Fix some issue with PostgreSQL before 9.5 (bug #45406)

## 6.0.1

### Fixes

#### All Editors

* Actualize Help

#### Document Editor

* Fix losing comments added to docx (Bug #46770)

#### Spreadsheet Editor

* Fix pivot refresh in R1C1 (Bug #46052)

#### Convert

* Fix error while opening specific xls (Bug #46728)

#### Back-end

* Fix several vulnerabilities
* Fix CVE-2021-25832
* Fix Path Traversal vulnerability via `download as` params
* Fix ER_DATA_TOO_LONG: Data too long for column 'callback' at row 1
* Fix problem with generating new presentation theme (Bug #46754)

#### Installation

* Fix cluster mode setup

## 6.0.0

### New Features

#### All Editors

* Autofit settings for shape
* Ability to insert special characters
* Autorun settings for macros
* Selecting an image from storage for watermarks, shapes and slides filling
* Added an AutoCorrect list
* Redesign of color selection component
* Ability to change a position and size of chart elements
* Hotkey Ctrl + 0 for zoom resetting
* Changed a behavior of hiding icons in tabs when editor window is reducing

#### Document Editor

* Ability to insert date and time
* Ability to print selection in view mode
* Converting an equation from old formats
* Changed placeholder for content controls
* Redone the algorithm the justifying of a paragraph with condensing spaces

#### Spreadsheet Editor

* Full support of pivot tables
* Autofilter settings in pivot tables
* Support of open all existing in file conditions for data bar conditional formatting
* Support of open all existing in file gradients for data bar conditional formatting
* Full support of slicers for format tables
* Special paste settings
* Ability to move a sheet from one workbook to another
* Internal link to named range
* Print titles
* New component for cells selection
* Ability to remove duplicate values
* Ability to insert function via Function Arguments dialogue
* Wrap Text and Shrink to Fit settings in right toolbar
* Vertical Text option in text orientation settings
* Ability to change the function in Total Row for formatted table
* Delimiter settings for Special Paste and Text to Columns dialogue
* LINEST function
* Hotkeys Ctrl+Shift+'Plus sign' and Ctrl+Shift+'Minus sign' for date and time insertion
* Hotkey Shift+F3 for a function insertion
* Status bar settings
* New mouse actions for work with format tables

#### Presentation Editor

* Changed interface for internal link
* Ability to print selection in view mode
* Redesign of bullet and numbering list menu

#### Mobile Editors

* Ability to insert a comment
* View and edit the comment from context menu or Collaboration tab
* Text Orientation in Edit Cell settings
* Autorun settings for macros
* Redesign of the tabs

#### Back-end

* Check licensed number of editor connections for cluster
* Do not start force save for encrypted files
* Fixed insert jpeg images in encrypted files

### Fixes

* All components received countless fixes

## 5.6.5

### New Features

#### document-server-integration

* Uses `Apache` license instead of `MIT`

### Fixes

#### x2t

* Fix `SIGABR` on ODT color (Bug #46499)([DocumentServer#989](https://github.com/ONLYOFFICE/DocumentServer/issues/989))

#### Back End

* Fix connecting document server with MySQL to community server

#### Package

* Fix package type in info.json for `documentserver-ee` and `documentserver-ie`

## 5.6.4

### Fixes

#### Convert

* Fix several vulnerabilities in `x2t` (Bug #46348, Bug #46352, Bug #46353,
  Bug #46384, Bug #46434, Bug #46436) (CVE-2021-25831, CVE-2021-25829, CVE-2021-25830)
* Fix vulnerability in TXT converter (Bug #46437)

## 5.6.3

### Fixes

#### Back-end

* Fix Path Traversal vulnerability via image upload params (Bug #46113)(CVE-2021-3199)

## 5.6.2

### Fixes

#### Back-end

* Fix Path Traversal vulnerability via `savefile` param (Bug #46037)

## 5.6.1

### Fixes

#### Back-end

* Fix Path Traversal vulnerability via Convert Service param (Bug #45976)(CVE-2021-25833)

#### Docker

* Fix `!=: unary operator expected` while starting
  `onlyoffice/documentserver` (Bug #45985)

## 5.6.0

*From this release we changing numbering scheme of DocumentServer.*  
*This is a bugfix release.*  
*Next major release with a bunch of new features will be 6.0.0*  

### Fixes

#### All Editors

* Fix problems with Auto-Color of shapes
* Fix problems with copy-paste images
* German, French, Italian, Portuguese and Russian translations improvements.

#### Document Editor

* Fix bug with bookmark opening
* Fix bug resetting comment GUID while opening
* Fix wrong `undo`/`redo` state for `comparing` mode
* Fixed in issue with auto-color feature for graphical
  objects in some DOCX user files (Bug #45460)
* Fixed an issue with increasing font size in some DOCX user files (Bug #44852)
* Fixed incorrect displaying of some PDF user files
  (Bug #45336, Bug #39097, Bug #19078)
* Fixed incorrect displaying of watermark on CJK languages (Bug #45886)
* Fixed an export of some DOCX user files to PDF (Bug #45319)

#### Spreadsheet Editor

* Fixed invalid icon in cells border menu (Bug #45910)
* Fixed an error with copy and past format table in some XLSX files (Bug #45731)
* Fixed an error with format table creation in some XLSX files (Bug #45773)
* Fixed an error with entering big data in last partially view cell (Bug #45653)([DocumentServer#903](https://github.com/ONLYOFFICE/DocumentServer/issues/903))

#### Presentation Editor

* Fix `List Settings` window on German (Bug #45417)

#### Mobile Editors

* Fixed an issue with text selection on iOS devices (Bug #45844)
* Fixed an error while presentation slides are swiping (Bug #42758)([DocumentServer#923](https://github.com/ONLYOFFICE/DocumentServer/issues/923))
* Fixed an appearance of first slide creating after theme was changed (Bug #45610)

#### Back-end

* Remove `redis` as dependency for Community Edition
  (it was not used, but required to install)
* Fix logrotate command for Fedora-based Linux ([DocumentServer#902](https://github.com/ONLYOFFICE/DocumentServer/issues/902))
* JWT: Fix uploading encrypted image
* Fixed an issue with saving intermediate version while document
  is opened for view another user (Bug #45406)
* Fix unexpected commands in collaboration editing
* Fix sending Redis custom option (Commercial Version Only) ([DocumentServer#764](https://github.com/ONLYOFFICE/DocumentServer/issues/764))
* Changed a messages in license exceeding windows (Bug #45819)
* Fixed an conversion error while opening ePub and HTML files on CentOS 7 (Bug #31323).
* Fixed deb package `postinstall` typo.
* Removed unused `Microsoft Visual C++ 2010 Redistributable`
  dependency for Windows

#### Plugins

* Fix `GetCurrentContentControlPr` method

#### x2t

* Fix missing page numbers for rtf -> docx (Bug #45439)
* Fixed an issue with increasing font size in some RTF user files (Bug #45439).
* Fix table width for rtf -> docx (Bug #45477)

## 5.5.3

### New Features

#### All Editors

* Added skeleton loader in embedded viewer

#### Document Editor

* Added Mendeley and Zotero plugins
* Ability to add several table rows/columns (Bug #20179)

#### Back-end

* Added JSON logger
* New options: `sslEnabled` and `s3ForcePathStyle`
* Added pgPoolExtraOptions (connection options)
* Reduced fonts cache size for AllFontsGen working

### Fixes

#### All Editors

* Fixed crash while writing a chart with equations in title/axis.
* Fixed an XSS injection in macros names (Bug 45345)

#### Document Editor

* Fixed an editor crashing after adding new rows in table
  in collaborative editing (Bug #45144)
* Fixed an editor crashing after searching and replacing
  in some DOCX files (Bug #45252)
* Fixed displaying of some DOCX files (Bug #44975, Bug #45204)
* Fixed displaying of some RTF files (Bug #45122)
* Fixed scrolling to bookmark in some corrupted DOCX files (Bug #45391)

#### Spreadsheet Editor

* Data validation fixes and improvements.
* Fixed a crash on opening some XLSX files (Bug #45093, [Documentserver#833](https://github.com/ONLYOFFICE/DocumentServer/issues/833))
* Fixed filling cells with formula in R1C1 mode (Bug #44730)
* Fixed recalculating formulas in some XLSX files (Bug #45368)
* Fixed XSS injection in data validation tip (Bug #45112)
* Fixed a crash with edit type of cells filling (Bug #45394)
* Fix some missed icons (Bug #45276)

#### Mobile Editors

* Font picker refactoring

#### Back-end

* Fixed missed require `util` in logger
* Fixed wrong callbackUrl after updating DS without dropping DB
* Fix security problem with JWT token when uploading image

#### x2t

* Fixed an issue with wrong encode of some CSV files (Bug #45171).
* Fixed converting some DOCX files (Bug #44709)
* Fixed converting some RTF files (Bug #45150, Bug #45166, Bug #45195)
* Fixed security issue with builder and working with local files
* Fixed writing corrupted DOCX file with chart in group shape

#### Package

* Use dropping tables instead drop databases database in deb `postrm` scrip
* Replace `wget` with `curl` for prepare4shutdown (Bug #45264)
* Fix security issues with accessing info page (Bug #45295)

#### Plugins

* Add and fix translations in macros plugin

## 5.5.2

### No public release

## 5.5.1

### New features

#### All Editors

* Add instruction how to build all products

#### Spreadsheet Editor

* Added support of reading drop-down lists.
* Added support of reading data validation.

### Fixes

#### All Editors

* Fixed an issue with missing 1.5x icons ([DocumentServer#812](https://github.com/ONLYOFFICE/DocumentServer/issues/812))
* Bulgarian, Chinese, Czech, Deutsch, French, Italian, Russian, Spanish, Turkish
  localization improvements
* Added support of Danish, Finnish, Hungarian, Indonesian, Norwegian, Swedish localization
* Fixed some security issues
* Update copyright year
* Fix some more issues with user files

#### Document Editor

* Fixed an issue with comment duplication in other editors (bug #44689)

#### Spreadsheet Editor

* Better support of TIME function (bug #44849)

#### Back-end

* Reading license file disabled in Community Edition
* Fixed an issue with missing license file in log files (bug #44694), ([DocumentServer#814](https://github.com/ONLYOFFICE/DocumentServer/issues/814))
* Fixed some database-related security issues (CVE-2020-11537)
* Fix mariadb support
* Database optimization for better performance
* Fixed an issue with disabling Download As option after reconnected
  client (bug #44757)
* Fix PostgreSQL command for citus compatibility

#### x2t

* Fixed some security issues (CVE-2020-11534, CVE-2020-11535, CVE-2020-11536)
* Fixed an issues with DOC, RTF and XLSX formats(bug 44756) (bug 44934) (bug 44840)
* Fixed corrupting of mime-type after some DOCX editing (Bug 44957)

#### Docker

* Fix for grep for creating table, so it stops throwing a failure

## 5.5.0

### New Features

#### All Editors

* Loading speed improvements
* `Symbol table` now is system component, not a plugin
* New button `Top Toolbar -> Collaboration -> Remove comments`
* Replace `Default Size` button to `Actual Size`

#### Document Editor

* Ability to compare documents (available only for paid version)
* Adding content control (available only for paid version)
* Ability to remove table cells
* Ability to insert several rows\columns
* Ability to add titles for shapes, table and levels
* New content control types (Picture, Combo box, Drop-down list, Date, Checkbox)
* New options for margins
* New options for bullet lists
* Ability to draw and erase table
* Ability to edit gutter and mirror margins

#### Spreadsheet Editor

* Ability to recalculate all formulas
* New scale options
* New options for cell fill
* Ability to set Cell Snapping
* Sheets multi-select
* Add Hungarian localization
* Bullets and numbering options from context menu
* Ability to change bullets marker
* New spellchecker options
* Ability to sort by several columns\rows
* Option for setting separators

#### Presentation Editor

* Ability to add object to slide template
* Ability to reset slide
* New list settings
* Ability to add object to placeholder

#### Mobile Editors

* Mobile editors available only for paid version
* Ability to save custom colors
* ONLYOFFICE logo added to header (with ability to customize it)

#### Package

* Remove `nodejs` dependency. Each service now is a single binary.

#### Docker

* ubuntu 18.04 as base image

#### Server

* Ability to convert to `PDF\A` via ConvertService
* Redis is not required for `onlyoffice-documentserver` (OpenSource version)
* `gc` service is now part of `docservice`

### Fixes

* All components received countless fixed

## 5.4.2

### New Features

#### All Editors

* Rename `web-apps-pro` repository to `web-apps`

#### Plugins

* Add plugin methods to move the cursor to the start/end
  of the document (`MoveCursorToStart`, `MoveCursorToEnd`)
  (bug #41521)

#### Back-end

* Add custom public key support

### Fixes

#### Document Editor

* Fix the problem with removing previously added text by
  other user in the review mode (bug #43183)
* Fix the problem with moving text in the review mode
  (bug #43238)
* Fix the problem of inserting a table over another table
* Fix the problem with reviewed numbering
* Fix some problems with watermarks
* Fix license error while inserting chart for DocumentServer
  with custom logo (bug #43314)

#### Plugins

* Fix starting PhotoEditor plugin (bug #42473)
* Fix issues with YouTube plugin

#### Embedded mode

* Fix focus in embedded mode
* Fix hiding download button and settings menu.

#### Installation

* Fix issue with cyrillic encoding messages in win installation
* Remove unused installation dependency - `boost-regex` (or similar)

#### x2t

* Fix issue with cell height for xls -> xlsx convert (bug #43072)

## 5.4.1

### New Features

#### Spreadsheet Editor

* Added `sv` locale to number formats

#### Presentation Editor

* Support themes thumbnails params

#### document-server-integration

* Add `blockcontent` mode

### Fixes

#### All Editors

* Fix detecting document info as document change (bug #42717)
* Fix paste in canvas after opening settings
* Fix some issues with loading of translations
* Fix issues with title in black theme (bug #42882)

#### Document Editor

* Fix the problem with drawing a track around a content
  control (bug #42657)
* Fix the problem with accept/reject in case when moved text
  gets into selection (bug #42665)
* Fix the problem with deleting text that was previously
  added by the same user (bug #41242)
* Fix "No image uploaded" for Watermark background (bug #42832)
* Fix rules unit of measurements (bug #42608)
* Fix some watermark bugs
* Fix style list in `Create New Style` window on small
  window size (bug #42799)
* Fix changing display mode for track changes
  (without plugins tab)

#### Spreadsheet Editor

* Fix opening some files with pivot table without pivot style
* Fix JS error in `SUBTOTAL` function (bug #42833)
* Fix scale options while printing (bug #34704)
* Fix adding image from storage (bug #42789)
* Fix auto-sum icon
* Fix button icons (chat, comments)

#### Back-end

* Fix core.zip url for develop environment

#### Plugins

* Fix Thesaurus plugin ([sdkjs-plugins#78](https://github.com/ONLYOFFICE/sdkjs-plugins/issues/78))
* OCR uses remote scripts

#### document-server-integration

* Fix `Open File location` on custom port ([document-server-integration#63](https://github.com/ONLYOFFICE/document-server-integration/issues/63))

#### x2t

##### Common

* Fix fonts picker bugs
* Support flv format
* Fix display some UTF font names (bug #42926) ([DocumentServer#651](https://github.com/ONLYOFFICE/DocumentServer/issues/651))
* Fix GenerateGuid
* Fix building of ICU ([DocumentServer#656](https://github.com/ONLYOFFICE/DocumentServer/issues/656))

##### doc

* Fix extended comments

##### docx

* Fix bookmarks saving inside hyperlink

##### xls

* Fix marker filters in some xls (bug #42239)
* Fix image size in save to xls (bug #42618)
* Fix group data display (bug #42216)

##### xlsx

* Fix tooltip for data validation (bug #42667)
* Fix Excel recovery error for files with comments (bug #42968)
* Remove reply duplicates (bug #42969)

##### odf

* Fix error in headers/footers
* Fix print areas (bug #42654)
* Fix column width (bug #42790)
* Fix cell color (bug #42932)
* Fix link to formatted as table (bug #42938)

##### rtf

* Fix some issues

#### Docker

* Fix token not working correctly with docker-compose ([Docker-DocumentServer#175](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/175))
* Fix amp ssl links ([Docker-DocumentServer#183](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/183))

## 5.4.0

### New Features

#### All Editors

* More options for Paragraph Spacing
* Ability to set paragraph Outline level
* Ability to get current color scheme
* Redone Document Info page
* Better and more templates for tables
* Select languages using keyboard (bug #24317)
* Ability to show shadow for images/shapes
* Add mentions to comments
* Show multi-gradient fill in shapes (bug #40719)
* Add `onRequestSaveAs` Api event for saving file to storage
* Add `onRequestInsertImage` event and `insertImage`
  method for inserting image from storage

#### Document Editor

* Ability create new style - next style same as previous
* Ability to add watermarks
* Ability to print selection
* Ability to save docx in mode compatible with old versions
* Add tooltip for table styles
* Add `onRequestMailMergeRecipients` event and
  `setMailMergeRecipients` method for mail  merge

#### Spreadsheet Editor

* Ability to change look of chart elements
* Ability to set Headers and Footers
* New tab for working with formulas
* Ability to group data
* Spellchecker
* Support of Print area
* Ability to resize autofilter window
* Show the number of cells in autofilter window
* Save 10 last used functions
* Set default value for regional settings (bug #41549)
* Asynchronous loading of formulas

#### Presentation Editor

* New themes for slides
* `Print selection` option for slide
* Ability to set Headers and Footers
* Ability to insert slide number
* Ability to insert date/time
* Add tooltip for table styles

#### Plugins

* Asynchronous loading of plugins

#### Mobile All Editors

* Redone Document Info page
* Ability to set color scheme
* Ability to set unit of measurement
* Show comments
* Show users editing the document

#### Mobile Document Editor

* Ability to view/accept/reject review changes
* Ability to set display mode for review changes
* Ability to add footnotes
* Download to RTF format
* Merge/split table cells
* Add settings for non-printing characters
* Add settings for commenting display

#### Mobile Spreadsheet Editor

* Work with autofilters (bug #34113)
* Add settings for commenting display
* Add regional settings
* Ability to set R1C1 mode
* Add settings for formula language
* Additional settings for search in the spreadsheet
* Add settings for headings and gridlines
* Add layout settings (page size, orientation, margins)
* Ability to freeze panes from context menu

#### Embedded Viewers

* Translate embedded viewers (bug 31297)

### Fixes

#### All Editors

* A lot of bugs fixed

### Deprecations

#### All Editors

* Clipart plugin removed (third party service openclipart.org in unavailable)

## 5.3.4

### New Features

#### Plugins

* Translations for Photo Editor plugin

### Fixes

#### All Editors

* Fix order of spellchecker correction entries ([DesktopEditors#224](https://github.com/ONLYOFFICE/DesktopEditors/issues/224))

#### Document Editor

* Fix JS error while undo insert empty row in table (bug #41995)
* Fix the problem with adding an equation inside a hyperlink
* Fix composite input in Firefox ([DocumentServer#601](https://github.com/ONLYOFFICE/DocumentServer/issues/601))
* Fix crash while opening file with math created by aspose

#### Presentation Editor

* Fix background color of slide

#### x2t

* Decode xlsx escaped chars (bug #36575, #41890)

#### Windows Version

* Fix misprint on redis configure page

## 5.3.3

### No public release

## 5.3.2

### Fixes

#### All Editors

* Fix some more problems with SVG

#### Document Editor

* Fix JS error while scrolling in mail merge window (bug #41787)
* Fix JS error while opening some specific docx (bug #41847)
* Fix JS error while using final mode in review mode (bug #41846)
* Fix the problem with updating positions in the inner
  classes within a paragraph (bug #41848)
* Do not add changes to reviews with changes of the text properties
  if in fact there have been no changes (bug #41833)
* Fix critical bug on setup hideContentControlTrack property
* Fix show changes of second user if show changes disabled (bug #41576)
* Fix the problem with accepting/rejecting review changes

#### Spreadsheet Editor

* Fix JS error for `Replace all` in some cases (bug #41760)
* Fix column index error while insertion
* Fix add changes to history on drawing sparklines

#### Plugins

* Suppress logging locale load error for plugins

#### Back-end

* Fix some false error messages
* Fix unknown issuer name while download by https

## 5.3.1

### New Features

#### Document Editor

* Add support for calculating tabs in word2013 style that lies to the
 right of the right margin

### Fixes

#### All Editors

* Fix a lot of bugs with drawings positioning
* Fix build on actual gcc ([DocumentServer#575](https://github.com/ONLYOFFICE/DocumentServer/issues/575))

#### Document Editor

* Fix JS error while entering text in content control in specific docx (bug #41687)
* Fix the problem with calculating numbering value with merged cells (bug #41699)
* Fix JS error while undo entered text in review mode (bug #41708)
* Fix deleting whole TOC field after selecting it (bug #41714)
* Fix showing numbering as changes for review in specific document (bug #41518)
* Fix opening Modelling_scholarly_communication_report_final1.docx (bug #41717)
* Fix crash on refresh recalculated data
* Fix bug with moving object in group
* Fix the problem with rendering WMF files (bug #41495)

#### Spreadsheet Editor

* Fix undo moved cell in print area (bug #41723)

#### Mobile Web Editors

* Fix adding shape in table (bug #41676)
* Fix inserting formulas on iOS
* Fix blocking app after adding image by url (bug #41677)

#### DocumentBuilder

* Fix errors in DocumentBuilder documentation

#### Package

* Fix 1click installation
* Fix rpm update v5.2.8 -> v5.3.0
* Remove .m4 files from packages
* Fix ds example startup after upgrade
* Fix 'onlyoffice: ERROR (no such group)' error
* Fix example startup after update
* Fix update with custom nginx config

#### Docker

* Fix docker compose startup error ([Docker-DocumentServer#163](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/163))
* Fix DocumentBuilder return "urls": {} if `/var/lib/onlyoffice` mounted ([Docker-DocumentServer#164](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/164))

## 5.3.0

### New Features

#### All Editors

* Tabbed Interface in OpenSource version
* New placements for undo-redo, save and print button in top toolbar
* 250 document languages (mostly without spellchecker)
* Completely redone font engine (Better support of CJK fonts and much more)
* Ability to flip and rotate shape/images
* Ability to crop images
* Adding bookmark do not close bookmark window
* Comments are show in all edit-view modes
* New hotkeys on MacOS
* New license flag `customization`
* Load images from storage
* Add options for objects align (align to page, margin, slide)
* New hints for shapes (Bug #20091)
* Completely new photo editor plugin

#### Document Editor

* Formulas in Tables
* Save as DOTX, PDF-A, OTT
* Show review changes in view mode
* Can't remove review changes of another user
* Can't remove a comments of another user
  (option `customization.commentAuthorOnly` = `true`)
* Add description for moved text and move to changed text in Review mode
* Get link to bookmark
* Search selected text

#### Spreadsheet Editor

* Български, Svenska (Finland), Svenska (Sverige) number format
* Translates of formulas to Italian
* Go to link by click, not control click
* `ASC`, `BETAINV`, `HYPERLINK` formulas
* Support of Print areas
* Ability to set exact text orientations in degrees
* Text to column Wizards
* Paste Text Wizard
* Save as XLTX, PDF-A, OTS
* Support of Array Formula
* Icon and Data Bars Conditional Formatting
* Gradient and Texture cell fill
* Show hint with function/arguments description when typing function
* Show min and max values in status bar
* Distribute objects
* Redone cut cell process (cell not removed after cut immediately)

#### Presentation Editor

* Save as POTX, PDF-A, OTP
* Add font rendering option
* Search and replace text
* Internal hyperlinks: entering the slide number manually

#### Fixes

* A lot of fixes in every subsystem

## 5.2.8

### New Features

#### All Editors

* Update copyrights to 2019 and actual Latvian address
* Update npm-shrinkwrap to actual
* Chinese as document language (without spellchecker) ([DocumentServer#479](https://github.com/ONLYOFFICE/DocumentServer/issues/479))
* Updated translations

#### Plugins

* Add support of system plugins

#### Back-end

* Add robots.txt handler

#### x2t

* xls - write default theme

### Fixes

#### All Editors

* Fix copying chart without `txPr`

#### Document Editor

* Fix border display in some docx files (bug #39461)
* Fix the problem of correcting of hit an drawing anchor in select
* Fix color of content control border on preview (bug #40330)

#### Spreadsheet Editor

* Fix color change after Convert to range for table (bug #38747)
* Fix display cell value in Safari (bug #39878),
  ([DocumentServer#477](https://github.com/ONLYOFFICE/DocumentServer/issues/477)),
  ([DocumentServer#467](https://github.com/ONLYOFFICE/DocumentServer/issues/467))
* Fix display hidden column (bug #40352)
* Fix creating history point on signatureLine adding
* Fix display values of second sheet on first sheet (bug #40038)
* Fix maximum call stack error while copy do Documents or Presentations
* Fix cell scroll in specific files (bug #40294)
* Fix js error while opening some xls file (bug #39529)
* Fix js error while opening settings
* Fix printing file with custom sheet size (bug #40275)

#### Presentation Editor

* Fix bug with resize after fullscreen (view position detect)
* Fix problem with connection drawing
* Fix opening presentation with unused theme'
* Fix pptx shape display (bug #39169)

#### Back-end

* Fix problem with jwt callback url ([DocumentServer#472](https://github.com/ONLYOFFICE/DocumentServer/issues/472))

#### x2t

* A lot of users' files fixed
* Fix MS Office error while opening xlsx with image in header (bug #40124)
* Fix font while opening specific xls file (bug #40178)

## 5.2.7

### New Features

#### All Editors

* Update documentation
* Update nodehun

#### Spreadsheet Editor

* New `sv-SE`, `sv-FI` regional settings

#### Spreadsheet Viewer

* Add ability to change row height or column width in view mode without saving changes

#### Plugins

* Ability to send params to plugin (user, doc information)
* Ability to translate plugins
* New `Highlight Code` and `Thesaurus` plugins

### Fixes

#### All Editors

* Fix error in comparing solid fill
* Fix German translation

#### Document Editor

* Fix problem with updating current position when moving border of the table
* Fix problem with clearing text properties
* Fix problem with opening specific docx file (bug #39941)
* Fix a problem with large nesting of tables (bug #39963)
* Fix JS Error while click in header with loading image (bug #39940)
* Fix a problem with recalculating table (bug #39945)
* Fix bug with recalculating of a footnote in vertically merged cells
* Fix bug with losing changes when moving table
* Fix bug with selection marks when adding a table row
* Fix bug with receiving selection bounds when moving the border of the table
* Fix bug with clearing selection marks in paragraph
* Fix bug with recalculating nested table
* Fix the problem of using End/Home buttons in non recalculated paragraph
* Fix bug with copy-paste when selecting a numbering
* Fix a header/footer entry issue
* Fix bug with adding an extra rows when inserting a table content
* Fix a problem with copying table cell properties

#### Spreadsheet Editor

* Fix blocking save button on open chart frame (bug #39827)
* Fix problem with copy paste hidden range with function (bug #40017)
* Fix issue with calculating `SUMPRODUCT` (bug #40109)
* Fix recalculate formulas into hidden filters area
* Fix apply autofilter to empty column by right click menu
* Fix calculate gradient without distance in conditional formatting (bug #40160)

#### Presentation Editor

* Fix error in copying slide notes

#### Spreadsheet Viewer

* Fix playback of youtube video (bug #40174)

#### Plugins

* Fix problem with double url in youtube plugin (bug #36103)

#### x2t

* Fix showing marked list in some PPT (bug #39929)
* Fix watermark border for some files (bug #39935)
* Fix some odf user files
* Fix shape and cell text layout in some xls (bug #39961)
* Fix missing text format in specific ODP (bug #39983)
* Fix incorrect numbering in ODP (bug #39976)
* Fix lost list in notes of ppt (bug #39929)
* Fix convert of some xls (bug #40065)
* Fix rotation of shape in specific ODP file (bug #39979)
* Fix showing cells values of Time format in ods file (bug #40106)
* Fix some shape in ppt files (bug #40115)
* Fix shapes with no fill in ppt (bug #40116)
* Fix opening xlsx file with image in in header (bug #40124)
* Fix a lot more user files

## 5.2.6

### Fixes

#### Document Editor

* Fix issue with moving nesting tables (bug #40096)

## 5.2.5

### No public release

## 5.2.4

### New Features

#### All Editors

* Enable text/html drag'n'drop to editors
* Ability to set custom logo without link (bug #39696)
* Update `sdkjs` npm requirements

#### Spreadsheet Editor

* Support of R1C1 references style

#### Document Builder

* Add method AddComment to ApiRange

#### Plugins

* Add translation for plugins name and description

#### x2t

* OdfFormatReader - write part tables

### Fixes

#### All Editors

* Fix race condition of sequence "unLockDocument", "isSaveLock"
* Fix building source for custom publisher name with quotes
* Fix special paste icon while inserting ClipArt (bug #39462)
* Show conversion error in case of pdf renamed to docx
* Fix bug with solid fill without color
* Fix logo didn't show in FF and IE
* Fix opening presenter view on owncloud\nextcloud (bug #39559)
* Fix bug when apply new font (current font name and new name are empty)
* Fix bug: open document language dialog when `doc.lang = es-AR`

#### Document Editor

* Fix error after discarding changing font name in combo box
* Fix input of korean, chinese and japanese symbols in Content Control (bug #39724)
* Fix the problem with recalculating a document with large tables
* Fix the problem with accept/reject an uncalculated revision change
* Fix the problem with checking CanUpdateTarget for a table
* Fix bug with recalculating a document when deleting a section
* Fix bug with moving cursor through a block-level sdt
* Fix the problem with checking complex fields in selection
* Fix the problem with updating cursor in collaborative editing
* Fix bug with moving cursor through a table
* Fix bug with recalculating large tables
* Fix the problem with moving an image inside a large table
* Fix bug with accept/reject the change in review
* Fix the problem with updating current position in table after accepting changes
* Fix bug with special paste of paragraph with numbering

#### Spreadsheet Editor

* Fix scrolling issues in specific file (bug #39395)
* Fix issue with open only one SheetView to avoid property conflicts(tabSelected)
  (bug #39511)
* Fix freeze while cut paste several columns (bug #37965)
* Fix incorrect `sum` formula for copied sheet (bug #39548)
* Fix JS error while entering more data than cell width (bug #39623)
* Fix incorrect digit count while using `Decrease Decimal` (bug #39661)
* Fix opening file with 'si', 'formula' without 'ref'
* Fix opening specific file with chart (bug #39902)
* Fix js error while copy specific sheet in file (bug #39921)
* Fix chinese translation for "textPoweredBy" (([web-apps#142](https://github.com/ONLYOFFICE/web-apps/pull/142)))

#### Presentation Editors

* Fix opening specific ppt file (bug #39901)

#### Document Viewer

* Fix using translator plugin with `pdf` and `xps` (bug #36645)

#### Mobile Web Editors

* Fix "SecurityError: Blocked a frame with origin
  from accessing a cross-origin frame" on apple devices
* Fix bug: set active tab when it's not visible in Spreadsheets

#### Back-end

* Fix error in case of 'changesError' command without docId
* Fix ignoring 'access_log off;'

#### x2t

* Fix loss of grouped shape in odt (bug #39467)
* Fix convert of wmf file (bug #39533)
* Fix bug with metadata in UTF16 format
* Fix convert of specific xls (bug #39541)
* OdfFormat - refactoring same auto shapes
* Fix convert vml -> drawing_ml
* Fix opening some specifiс pptx (bug #39747, #39745)
* DocFormat - fix after testing

#### Docker Image

* Fix Docker-compose 503 Service Unavailable ([Docker-DocumentServer#133](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/133))
* Fix `DB_NAME` issue ([Docker-DocumentServer#134](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/134))
* Fix log rotation

## 5.2.3

### New Features

#### All Editors

* Updated translations

#### Spreadsheet Editor

* Enhanced completely rewritten scroll

#### Document Builder

* Add new functions `setLocale` and `getLocale`

#### Server

* Add logging for SaveLock
* Ability to copy changes and files with browser error to special directory

#### x2t

* Odf - refactoring convert word-arts from/to ooxml; convert form controls in spreadsheets
* OdfFormatwriter - convert bookmarks

### Fixes

#### All Editors

* Fix bug with cff fonts (glyph loader)
* Show LoadingScriptError error in case of sdk-all.js loading failure
* Fix `Cannot read property '$icon' of undefined` while
  `ctrl+s` in chart editor (bug #39254)
* Remove 'command+h' hotkey for MacOs

#### Document Editor

* Fix opening docx with track changes and math created by Aspose
* Fix problem with reading the Id of a content control
* Fix crash in `CNumberingLvlLegacy.ReadFromBinary`
* Fix problem with selecting tables
* Fix the problem with replacing misspelled word
* Fix the bug with pressing the tab key
* Fix the critical issue with locking the document on the undo in the fast collaboration
* Fix lost `Hide Degree` menu entry for equations (bug #39135)
* Fix the problem when recalculating in co-editing
* Fix the problem with processing the pageDown button in co-editing
* Fix `Cannot read property 'eb' of nul` while deleting table column (bug #39252)
* Fix problem with render while replacing text (bug #39269)
* Fix `Cannot read property 'length' of null` while opening file (bug #39210)
* Fix problem with saving/loading table state on undo/redo
* Fix showing charts added by macros (bug #39304)
* Fix the problem with calculating a large tables separated by columns

#### Spreadsheet Editor

* Fix crash on build file with comment changes
* Fix incorrect chart for area with autofilter (bug #39168)
* Fix incorrect select cells while changing formula by keyboard (bug #39181)
* Fix brower hangup in some file with formula (bug #39190)
* Fix incorrect display of doughnut chart with autofilter (bug #39200)
* Fix incorrect `IF` formula values (bug #39233)
* Fix problem with replace count (bug #39273)
* Fix `Cannot read property 'Zb' of null` while copy deleted shape (bug #39312)
* Fix `Maximum call stack size exceeded` while opening fullscreen (bug #38972)
* Fix `this.dPc is not a function` while sorting (bug #39397)
* Fix undo for filter in specific files (bug #39402)
* Fix scroll to end of table (bug #21946)
* Fix sorting first row in some files (bug #39397)
* Fix sorting range if there is filtered data (bug #39410)
* Fix double columns borders (bug #39392)
* Fix rendering last rows in some files (bug #39394)
* Disable cell settings when editor is disconnected
* Fix print and calculate. Speed up prepare cache

#### Presentation Editor

* Fix `Cannot read property 'Ia' of null` while opening some pptx (bug #39191)
* Fix problem with negative spacing
* Fix `Cannot read property 'W' of undefined` while copy table (bug #39264)

#### Embedded viewer

* Show error while opening passsword protected files (bug #39251)
* Fix js error while opening txt (bug #39250)

#### Server

* Fix license info endDate for trial
* Fix `Cannot read property 'time' of null`
* Change logrotate conf dir

#### x2t

* Set default value for math nodes with val attribute and COnOfftype
* Fix empty rtf (bug #39172)
* Fix opening some ods (bug #39192)
* graphics - metafile - fix convert to rastr on linux without set fonts
* PptxFormat - fix binary convert mathType version over 3.0
* Fix document structure for specific file (bug #39236)
* Fix opening in MS word some file (bug #39216)
* Fix opening specific docx file (bug #39248)
* XlsFormatReader - fix users file (external defined names)
* PptFormatReader - fix users files
* PptxFormat fix some user files
* OdfFormat, OdfFormatWriter - fix after testing
* Disable truetype fonts convertasion in html viewer
* Fix open some rtf files (bug #39315)
* Fix selecting row in pdf file (bug #39214)
* Fix crash on empty dash pen
* Fix writing only last ConditionalFormatting from Editor.bin (bug #39391)

#### Docker Image

* Fix `‘/var/run/rabbitmq’: Permission denied` on container restart ([Docker-DocumentServer#92](https://github.com/ONLYOFFICE/Docker-DocumentServer/issues/92))
* Remove volume `/etc/onlyoffice`  (fix start on `minishift`)
* Setup logrotate config rights

## 5.2.2

### Fixes

#### rpm

* Fix `DS_PORT` problem while installing with `ONLYOFFICE Enterprise Edition`

## 5.2.1

### No public release

## 5.2.0

### New Features

#### All Editors

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
* Add ability to view Combo Charts
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

#### Server

* Add savefile request handler
* Rename crypted->encrypted, transfer replyStr to saveUrl handler
* Add savefile request handler
* [chat] Add useridoriginal to all messages
* [lock] Use userId instead of sessionId in locks ([server#91](https://github.com/ONLYOFFICE/server/pull/91))
* Add faked file type for PDFA
* [config] Add spawnOptions for x2t
* Use title param in ConvertService.ashx
* Use forked statsd to support ubuntu 18.04
* Branding now int. Check string and boolean for old version
* Use new key 'plugins' instead of 'branding' (revert to boolean)
* [log] Add reSave to mark repeated changes saving
* Add info/json handler for license
* Add `/info` page (available only from localhost)

#### Package

* Use package version for disable cache prefix
* Set up custom port in example url in IIS
* Redone storing configs in  `local.json`
* Add support of logrotate
* Use package version in server urls instead of date
* deb: Add libcurl3-gnutls dependency
* Update license

#### Plugins

* [clipart] Show message when error has occurred

#### Docker Image

* Use nodejs 8
* Output logs to console and correct support of `docker logs`
* Do not require interactive flag to start container

### Fixes

#### All Editors

* Fix comment loss from other user (bug #37570)
* A lot of bug fixed in all editors

#### DocumentEditor

* Disable bookmarks in the document headers (bug #38957)
* Fix `XML Parsing Error` in Firefox (bug #36960)

#### Spreadsheet Editor

* Fix change active cell in selection across merge. Previously, passing
 through the first cell of the merge range, we fell into the merge range,
 even if it was not selected (through the selection of a row / column)
* Fix selection when selecting row/col/all
* Hide options for headings, gridlines, freeze panes in the viewer (bug #38033)

#### Server

* Fix max file size for convert (bug #37559)
* Fix installation on any linux system by using `useradd` ([server#89](https://github.com/ONLYOFFICE/server/pull/89))
* Fix fillForms mode
* Fix healthcheck service in case of disconnected redis or rabbitmq
* [jwt] Do not reduce authorization header in case of inBody option
* Improve average calculation at server start
* Forbid svg image pasting

#### Package

* Update innodependencyinstaller to fix requirements detection

#### Plugins

* [clipart] Fix clipart zero size
* [macros] fix error while adding one (bug #38408)

#### document-server-integration

* Fix adding several files at once (bug #37017)
* Fix uploading big files
* Fix comment mode available only for Spreadsheet Editor
* Java: fix encoding space and path problems
* PHP: fix a lot of problems with urls
* Some more fixes

#### x2t

* A lot of user files fixed

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

* Bump compatibilityMode setting. Prevent opening
  files in compatibility mode in Word 2016.
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
* Fix focus problem with navigation sidebar in Firefox (#37460)
* Fix setting option Realtime collaboration changes to "View All"
* Fix protected document window layout (#37658)

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

* Improve compatibility with IE11 ([sdkjs#302](https://github.com/ONLYOFFICE/sdkjs/pull/302))
  ([sdkjs#317](https://github.com/ONLYOFFICE/sdkjs/pull/317))
* Fix downloading specific docx file (#37454) ([sdkjs#300](https://github.com/ONLYOFFICE/sdkjs/pull/300))
* Fix crash on opening files with empty pie charts ([sdkjs#318](https://github.com/ONLYOFFICE/sdkjs/pull/318))

#### Document Editor

* Fix displaying table after html convert (#37472)
* Fix adding comment to whole doc (#37425,
  [DocumentServer#287](https://github.com/ONLYOFFICE/DocumentServer/issues/287))
  ([sdkjs#319](https://github.com/ONLYOFFICE/sdkjs/pull/319))
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
* Fix opening docx, pptx, rtf, odf usersfiles ([core#75](https://github.com/ONLYOFFICE/core/pull/75))
  ([core#76](https://github.com/ONLYOFFICE/core/pull/76))

## 5.1.2

### New features

#### All Editors

* Update help translations

#### Document Editor

* Support of multicomments balloon (bug #37422)

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

* Add reconnection.attempts, reconnection.delay options
  to config - applicable for editor-server connection
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

* Fix right mouse button menu for TOC (#37241)
* Fix usage Clip ParaDrawing by line top and bottom
* Don't clip images in text arts
* Add vertical clip for inline drawing
* Fix problems in drawing inline objects
* Fix bug in calculation text clip rect in documents
* Fix `Cannot read property 'B8a' of null` error in some files (#37378)

#### Spreadsheet Editor

* Fix right mouse button error (#37330)
* Fix inserting hieroglyphs from text editor (#37356)
* Fix bug with enter symbol point in formula autocomplete (#37300)
* Fix bug with enter symbol `_` or `\` in start formula autocomplete (bug #37354)
* Fix bug with enter Chinese numbers in formula autocomplete
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
* Fix inconsistent database status after files
  assemble in case of rapid open/close connection

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
* Copy paragraph style will not overwrite custom run style
* Special paste of tables

#### Spreadsheet Editor

* Custom user cell styles are now placed before default ones
* 8 new formulas: `F.TEST`, `FORECAST.ETS`, `FORECAST.ETS.CONFINT`,
  `FORECAST.ETS.SEASONALITY`, `FORECAST.ETS.STAT`,
  `FORMULATEXT`, `IFS`, `PDURATION`
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

* Fix conversion task is lost when entering and
  leaving the editor quickly (endless opening)
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
* Fix sorting in some xlsx (bug #35904)
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

* Read ooxml and xls files with macros.
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
* Fixed bug with moving cursor to the start of the
  document after removing content control.
* Fix minor problems with co-edit in real time (bug #35398, #35399, #35400)
* A lot of fixes in translations

#### Spreadsheet Editor

* Fix box for `Show empty cells as` in Russian (bug #35299)
* Fix sparkline type in setting window (bug #35296)
* Hide not implemented formulas: `CUBEKPIMEMBER`, `CUBEMEMBER`,
  `CUBEMEMBERPROPERTY`, `CUBERANKEDMEMBER`, `CUBESET`,
  `CUBESETCOUNT`, `CUBEVALUE` (bug #35314)
* Fix JS error in conditional formatting with formula and offset
  (duplicate variable) (bug #35334)
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
        `IMCSCH`, `IMSEC`, `IMSECH`, `IMSINH`, `IMTAN`, `ISO.CEILING`,
        `LOGNORM.DIST`, `LOGNORM.INV`, `NUMBERVALUE`, `PERCENTILE.EXC`, `PERCENTILE.INC`,
        `PERCENTRANK.EXC`, `PERCENTRANK.INC`, `RANK`, `RANK.AVG`, `RANK.EQ`,
        `SEC`, `SECH`, `T.DIST`, `T.DIST.2T`,
        `T.DIST.RT`, `T.INV`, `T.INV.2T`, `TDIST`, `TINV`, `XOR` formulas
* Exclude hidden rows from copy, autofill, formatting etc...
* Update active cell color
* Frozen pane now with shadow
* Translates for cell styles
* Search and replace by select
* Option to hide solved comments
* Ability to specify bullets and numbering for text in shape.
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

* Full support of HiDPI monitors
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
* Fixed an issue with changing number format
  while changing regional format (bug #31395)
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

* Fix compiling server, if `PRODUCT_VERSION` and
  `BUILD_NUMBER` variables are not defined

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

* Fix problem with losing changes while several
  users enter text at same time (bug #33726)
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

* Ability to use full-toolbar mode in editors with standard license.\
  Previously users of standard license are forced to use only compact toolbar.

## 4.0.2

### Fixes

#### Spreadsheet Editor

* Fix losing comments on second or further worksheet (bug #32895)
* Fix losing empty values of data with format different
  of General in autofilter (bug #32805)

#### document-server-integration

* Minor fixes
