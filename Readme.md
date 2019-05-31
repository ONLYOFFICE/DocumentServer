[![License](https://img.shields.io/badge/License-GNU%20AGPL%20V3-green.svg?style=flat)](https://www.gnu.org/licenses/agpl-3.0.en.html) ![Release](https://img.shields.io/badge/Release-v5.2-blue.svg?style=flat)

## Overview

ONLYOFFICE Document Server is a free collaborative online office suite comprising viewers and editors for texts, spreadsheets and presentations, fully compatible with Office Open XML formats: .docx, .xlsx, .pptx and enabling collaborative editing in real time.

## Components

ONLYOFFICE Document Server contains the following components:

* [server](https://github.com/ONLYOFFICE/server "server") - the backend server software layer which is the base for all other components of ONLYOFFICE Document Server.
* [core](https://github.com/ONLYOFFICE/core "core") - server core components of ONLYOFFICE Document Server which enable the conversion between the most popular office document formats (DOC, DOCX, ODT, RTF, TXT, PDF, HTML, EPUB, XPS, DjVu, XLS, XLSX, ODS, CSV, PPT, PPTX, ODP).
* [sdkjs](https://github.com/ONLYOFFICE/sdkjs "sdkjs") - JavaScript SDK for the ONLYOFFICE Document Server which contains API for all the included components client-side interaction.
* [web-apps](https://github.com/ONLYOFFICE/web-apps "web-apps") - the frontend for ONLYOFFICE Document Server which builds the program interface and allows the user create, edit, save and export text, spreadsheet and presentation documents using the common interface of a document editor.
* [dictionaries](https://github.com/ONLYOFFICE/dictionaries "dictionaries") - the dictionaries of various languages used for spellchecking in ONLYOFFICE Document Server.
* [sdkjs-plugins](https://github.com/ONLYOFFICE/sdkjs-plugins "sdkjs-plugins") - the add-ons for ONLYOFFICE Document Server used for the developers to add specific functions to the editors which are not directly related to the OOXML format.

## Functionality

ONLYOFFICE Document Server includes the following editors:

* ONLYOFFICE Document Editor
* ONLYOFFICE Spreadsheet Editor
* ONLYOFFICE Presentation Editor

The editors allow you to create, edit, save and export text, spreadsheet and presentation documents and additionally have the features:

* Collaborative editing
* Hieroglyph support
* Reviewing
* Spell-checking

## ONLYOFFICE Document Server editions

ONLYOFFICE offers different versions of its online document editors that can be deployed on your own servers.

ONLYOFFICE Document Server:

* Community Edition (`onlyoffice-documentserver` package)
* Integration Edition (`onlyoffice-documentserver-ie` package)
* Developer Edition (`onlyoffice-documentserver-de` package)

The table below will help you to make the right choice.

| Pricing and licensing | Community Edition | Integration Edition | Developer Edition |
| ------------- | ------------- | ------------- | ------------- |
| | [Get it now](https://www.onlyoffice.com/download.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Start Free Trial](https://www.onlyoffice.com/connectors-request.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Start Free Trial](https://www.onlyoffice.com/developer-edition-request.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  |
| Cost  | FREE  | [Go to the pricing page](https://www.onlyoffice.com/integration-edition-prices.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Go to the pricing page](https://www.onlyoffice.com/developer-edition-prices.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  |
| Simultaneous connections | up to 20 maximum  | As in chosen pricing plan | As in chosen pricing plan |
| Number of users | up to 20 recommended | As in chosen pricing plan | As in chosen pricing plan |
| License | GNU AGPL v.3 | Proprietary | Proprietary |
| **Support** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Documentation | [Help Center](https://helpcenter.onlyoffice.com/server/docker/opensource/index.aspx) | [Help Center](https://helpcenter.onlyoffice.com/server/integration-edition/index.aspx) | [Help Center](https://helpcenter.onlyoffice.com/server/integration-edition/index.aspx) |
| Standard support | [GitHub](https://github.com/ONLYOFFICE/DocumentServer/issues) or paid | One year support included | One year support included |
| Premium support | [Buy Now](https://www.onlyoffice.com/support.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) | [Buy Now](https://www.onlyoffice.com/support.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) | [Buy Now](https://www.onlyoffice.com/support.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) |
| **Services** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Conversion Service                | + | + | + |
| Document Builder Service          | + | + | + |
| **Interface** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Tabbed interface                       | + | + | + |
| White Label                            | - | - | + |
| Integrated test example (node.js)*     | - | + | + |
| **Plugins & Macros** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Plugins                           | + | + | + |
| Macros                            | + | + | + |
| **Collaborative capabilities** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Two co-editing modes              | + | + | + |
| Comments                          | + | + | + |
| Built-in chat                     | + | + | + |
| Review and tracking changes       | + | + | + |
| Display modes of tracking changes | + | + | + |
| Version history                   | + | + | + |
| **Document Editor features** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Content control                 | + | + | + |
| Layout tools                    | + | + | + |
| Table of contents               | + | + | + |
| Navigation panel                | + | + | + |
| Mail Merge                      | + | + | + |
| **Spreadsheet Editor features** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Functions, formulas, equations  | + | + | + |
| Table templates                 | + | + | + |
| Pivot tables                    | +** | +** | +** |
| **Presentation Editor features** | **Community Edition** | **Integration Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Animations                      | + | + | + |
| Presenter mode                  | + | + | + |
| Notes                           | + | + | + |
| | [Get it now](https://www.onlyoffice.com/download.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Start Free Trial](https://www.onlyoffice.com/connectors-request.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Start Free Trial](https://www.onlyoffice.com/developer-edition-request.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  |

\* Note that by default DocumentServer Community Edition does not contain any document management system.  
Integration Edition and Developer Edition versions include integrated test examples (simplest DMS to test the editors).   
For Community version, please use the [ONLYOFFICE Community Server](https://github.com/ONLYOFFICE/CommunityServer/) or [check out integration](https://www.onlyoffice.com/connectors.aspx) with 3rd party platforms, e.g. ownCloud/Nextcloud

\** Changing style and deleting (Full support coming soon)

## Project Information

Official website: [https://www.onlyoffice.com](https://www.onlyoffice.com/?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)

Code repository: [https://github.com/ONLYOFFICE/DocumentServer](https://github.com/ONLYOFFICE/DocumentServer "https://github.com/ONLYOFFICE/DocumentServer")

Docker Image: [https://github.com/ONLYOFFICE/Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer "https://github.com/ONLYOFFICE/Docker-DocumentServer")

License: [GNU AGPL v3.0](https://help.onlyoffice.com/products/files/doceditor.aspx?fileid=4358397&doc=K0ZUdlVuQzQ0RFhhMzhZRVN4ZFIvaHlhUjN2eS9XMXpKR1M5WEppUk1Gcz0_IjQzNTgzOTci0 "GNU AGPL v3.0")

SaaS version: [https://www.onlyoffice.com/cloud-office.aspx](https://www.onlyoffice.com/cloud-office.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)

## ONLYOFFICE One Click Installation

ONLYOFFICE Document Server is a part of **ONLYOFFICE Community Edition** that comprises also [Community Server](https://github.com/ONLYOFFICE/CommunityServer "Community Server") and [Mail Server](https://github.com/ONLYOFFICE/Docker-MailServer "Mail Server"). To get ONLYOFFICE Free Edition in one click, make use of [ONLYOFFICE One Click Installation](https://controlpanel.onlyoffice.com/ "ONLYOFFICE One Click Installation").

## Documentation

The easiest way to install ONLYOFFICE Document Server is to use the Docker image. You can also install it from the repository or compiling the source code. The following documentation is available to the community depending on the way you choose:

* [Compiling ONLYOFFICE Document Server for a Local Server](http://helpcenter.onlyoffice.com/server/linux/document/compile-source-code.aspx "Compiling ONLYOFFICE Document Server for a Local Server")
* [Installing ONLYOFFICE Document Server Linux Version](http://helpcenter.onlyoffice.com/server/linux/document/linux-installation.aspx "Installing ONLYOFFICE Document Server Linux Version")
* [Installing ONLYOFFICE Document Server Windows Version](http://helpcenter.onlyoffice.com/server/windows/document/install-office-apps.aspx "Installing Document Server for Windows on a Local Server")
* [Installing ONLYOFFICE Document Server Docker Version](http://helpcenter.onlyoffice.com/server/docker/document/docker-installation.aspx "Installing ONLYOFFICE Document Server Docker Version")

## User Feedback and Support

If you have any problems with or questions about [ONLYOFFICE Document Server][2], please visit our official forum to find answers to your questions: [dev.onlyoffice.org][1] or you can ask and answer ONLYOFFICE development questions on [Stack Overflow][3].

  [1]: http://dev.onlyoffice.org
  [2]: https://github.com/ONLYOFFICE/DocumentServer
  [3]: http://stackoverflow.com/questions/tagged/onlyoffice
