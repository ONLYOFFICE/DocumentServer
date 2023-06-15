[![License](https://img.shields.io/badge/License-GNU%20AGPL%20V3-green.svg?style=flat)](https://www.gnu.org/licenses/agpl-3.0.en.html) ![Release](https://img.shields.io/badge/Release-v7.4.0-blue.svg?style=flat)

## Overview

[ONLYOFFICE Docs](https://www.onlyoffice.com/office-suite.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)* is a free collaborative online office suite comprising viewers and editors for texts, spreadsheets and presentations, forms and PDF, fully compatible with Office Open XML formats: .docx, .xlsx, .pptx and enabling collaborative editing in real time.

ONLYOFFICE Docs can be used as a part of [ONLYOFFICE Workspace](https://www.onlyoffice.com/workspace.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubCS) or with [third-party sync&share solutions](https://www.onlyoffice.com/all-connectors.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) (e.g. Nextcloud, ownCloud, Seafile) to enable collaborative editing within their interface.

It has three editions - [Community, Enterprise, and Developer](#onlyoffice-docs-editions). 

\* Starting from version 6.0, Document Server is distributed under a new name - ONLYOFFICE Docs.

## Components

ONLYOFFICE Docs contains the following components:

* [server](https://github.com/ONLYOFFICE/server) - the backend server software layer which is the base for all other components of ONLYOFFICE Docs.
* [core](https://github.com/ONLYOFFICE/core) - server core components of ONLYOFFICE Docs which enable the conversion between the most popular office document formats (DOC, DOCX, ODT, RTF, TXT, PDF, HTML, EPUB, XPS, DjVu, XLS, XLSX, ODS, CSV, PPT, PPTX, ODP).
* [sdkjs](https://github.com/ONLYOFFICE/sdkjs) - JavaScript SDK for the ONLYOFFICE Docs which contains API for all the included components client-side interaction.
* [web-apps](https://github.com/ONLYOFFICE/web-apps) - the frontend for ONLYOFFICE Docs which builds the program interface and allows the user create, edit, save and export text, spreadsheet and presentation documents using the common interface of a document editor.
* [dictionaries](https://github.com/ONLYOFFICE/dictionaries) - the dictionaries of various languages used for spellchecking in ONLYOFFICE Docs.

## Plugins

ONLYOFFICE Docs offer support for plugins allowing developers to add specific features to the editors that are not directly related to the OOXML format. For more information see [our API](https://api.onlyoffice.com/plugin/basic) or visit github [plugins repo](https://github.com/ONLYOFFICE/onlyoffice.github.io).

## Functionality

ONLYOFFICE Docs includes the following editors:

* [ONLYOFFICE Document Editor](https://www.onlyoffice.com/document-editor.aspx?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDesktop)
* [ONLYOFFICE Spreadsheet Editor](https://www.onlyoffice.com/spreadsheet-editor.aspx?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDesktop)
* [ONLYOFFICE Presentation Editor](https://www.onlyoffice.com/presentation-editor.aspx?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDesktop)
* [ONLYOFFICE Form Creator](https://www.onlyoffice.com/form-creator.aspx?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDesktop)
* [ONLYOFFICE PDF reader and converter](https://www.onlyoffice.com/pdf-reader.aspx?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDesktop)

The editors allow you to create, edit, save and export text, spreadsheet and presentation documents and additionally have the features:

* Collaborative editing
* Hieroglyph support
* Reviewing
* Spell-checking

## ONLYOFFICE Docs editions

ONLYOFFICE offers different versions of its online document editors that can be deployed on your own servers.

ONLYOFFICE Docs (packaged as Document Server):

* Community Edition (`onlyoffice-documentserver` package)
* Enterprise Edition (`onlyoffice-documentserver-ee` package)
* Developer Edition (`onlyoffice-documentserver-de` package)

The table below will help you to make the right choice.

| Pricing and licensing | Community Edition | Enterprise Edition | Developer Edition |
| ------------- | ------------- | ------------- | ------------- |
| | [Get it now](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-enterprise)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-developer)  |
| Cost  | FREE  | [Go to the pricing page](https://www.onlyoffice.com/docs-enterprise-prices.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Go to the pricing page](https://www.onlyoffice.com/developer-edition-prices.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  |
| Simultaneous connections | up to 20 maximum  | As in chosen pricing plan | As in chosen pricing plan |
| Number of users | up to 20 recommended | As in chosen pricing plan | As in chosen pricing plan |
| Clusterization | - | + | + |
| License | GNU AGPL v.3 | Proprietary | Proprietary |
| **Support** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Documentation | [Help Center](https://helpcenter.onlyoffice.com/installation/docs-community-index.aspx) | [Help Center](https://helpcenter.onlyoffice.com/installation/docs-enterprise-index.aspx) | [Help Center](https://helpcenter.onlyoffice.com/installation/docs-developer-index.aspx) |
| Standard support | [GitHub](https://github.com/ONLYOFFICE/DocumentServer/issues) or paid | One year support included | One year support included |
| Premium support | [Contact Us](mailto:sales@onlyoffice.com) | [Contact Us](mailto:sales@onlyoffice.com) | [Contact Us](mailto:sales@onlyoffice.com) |
| **Services** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Conversion Service                | + | + | + |
| Document Builder Service          | + | + | + |
| **Interface** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Tabbed interface                       | + | + | + |
| Dark theme                             | + | + | + |
| 125%, 150%, 175%, 200% scaling         | + | + | + |
| White label                            | - | - | + |
| Integrated test example (node.js)      | + | + | + |
| Mobile web editors                     | - | +** | +** |
| **Plugins & Macros** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Plugins                           | + | + | + |
| Macros                            | + | + | + |
| **Collaborative capabilities** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Two co-editing modes              | + | + | + |
| Comments                          | + | + | + |
| Built-in chat                     | + | + | + |
| Review and tracking changes       | + | + | + |
| Display modes of tracking changes | + | + | + |
| Version history                   | + | + | + |
| **Document Editor features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Adding Content control          | + | + | + |
| Editing Content control         | + | + | + |
| Layout tools                    | + | + | + |
| Table of contents               | + | + | + |
| Navigation panel                | + | + | + |
| Mail Merge                      | + | + | + |
| Comparing Documents             | + | + | + |
| **Spreadsheet Editor features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Functions, formulas, equations  | + | + | + |
| Table templates                 | + | + | + |
| Pivot tables                    | + | + | + |
| Data validation                 | + | + | + |
| Conditional formatting          | + | + | + |
| Sparklines                      | + | + | + |
| Sheet Views                     | + | + | + |
| **Presentation Editor features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Transitions                     | + | + | + |
| Presenter mode                  | + | + | + |
| Notes                           | + | + | + |
| **Form creator features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Adding form fields              | + | + | + |
| Form preview                    | + | + | + |
| Saving as PDF                   | + | + | + |
| **Security features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| End-to-end encryption via Private Rooms***  | + | + | - |
| | [Get it now](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-enterprise)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-developer)  |

\** If supported by DMS  
\*** End-to-end encryption via Private Rooms requires ONLYOFFICE Workspace

## How to Install on a local server

The easiest way to install ONLYOFFICE Docs is to use **the Docker image** ([the official source code](https://github.com/ONLYOFFICE/Docker-DocumentServer))

* [Installing ONLYOFFICE Docs Docker](https://helpcenter.onlyoffice.com/installation/docs-community-install-docker.aspx)
* [Installing ONLYOFFICE Docs for Linux](https://helpcenter.onlyoffice.com/installation/docs-community-install-ubuntu.aspx)
* [Installing ONLYOFFICE Docs for Windows](https://helpcenter.onlyoffice.com/installation/docs-community-install-windows.aspx)

## How to Build

Instructions for building ONLYOFFICE Docs for a local server from source code are in [our helpcenter](https://helpcenter.onlyoffice.com/installation/docs-community-compile.aspx).

## License

ONLYOFFICE Docs is licensed under the GNU Affero Public License, version 3.0. See [LICENSE](https://onlyo.co/38YZGJh) for more information.

## User Feedback and Support

If you have any problems with or questions about ONLYOFFICE Docs, please visit our official forum to find answers to your questions: [forum.onlyoffice.com](https://forum.onlyoffice.com) or you can ask and answer ONLYOFFICE development questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/onlyoffice).
