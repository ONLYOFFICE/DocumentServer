[![License](https://img.shields.io/badge/License-GNU%20AGPL%20V3-green.svg?style=flat)](https://www.gnu.org/licenses/agpl-3.0.en.html) ![Release](https://img.shields.io/badge/Release-v6.3-blue.svg?style=flat)

## Overview

ONLYOFFICE Document Server is a free collaborative online office suite comprising viewers and editors for texts, spreadsheets and presentations, fully compatible with Office Open XML formats: .docx, .xlsx, .pptx and enabling collaborative editing in real time.

Starting from version 6.0, Document Server is distributed under a new name - ONLYOFFICE Docs. 

ONLYOFFICE Docs can be used as a part of [ONLYOFFICE Workspace](#onlyoffice-workspace) or with third-party sync&share solutions (e.g. Nextcloud, ownCloud, Seafile) to enable collaborative editing within their interface.

It has three editions - [Community, Enterprise, and Developer](#onlyoffice-docs-editions). 

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
| Premium support | [Buy Now](https://www.onlyoffice.com/support.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) | [Buy Now](https://www.onlyoffice.com/support.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) | [Buy Now](https://www.onlyoffice.com/support.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) |
| **Services** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Conversion Service                | + | + | + |
| Document Builder Service          | + | + | + |
| **Interface** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Tabbed interface                       | + | + | + |
| Dark theme                             | + | + | + |
| 150% scaling                           | + | + | + |
| White label                            | - | - | + |
| Integrated test example (node.js)     | + | + | + |
| Mobile web editors                     | - | +* | +* |
| Access to pro features via desktop     | - | + | - |
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
| Adding Content control          | - | + | + |
| Editing Content control         | + | + | + |
| Layout tools                    | + | + | + |
| Table of contents               | + | + | + |
| Navigation panel                | + | + | + |
| Mail Merge                      | + | + | + |
| Comparing Documents             | - | + | + |
| **Spreadsheet Editor features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Functions, formulas, equations  | + | + | + |
| Table templates                 | + | + | + |
| Pivot tables                    | + | + | + |
| Data validation                 | + | + | + |
| Conditional formatting  for viewing | +** | +** | +** |
| Sheet Views                     | - | + | + |
| **Presentation Editor features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Transitions                  | + | + | + |
| Presenter mode                  | + | + | + |
| Notes                           | + | + | + |
| **Security features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| End-to-end encryption via Private Rooms  | + | + | - |
| | [Get it now](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-enterprise)  | [Start Free Trial](https://www.onlyoffice.com/download-docs.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-developer)  |

\* If supported by DMS

\** Support for all conditions and gradient. Adding/Editing capabilities are coming soon

## Documentation

The easiest way to install ONLYOFFICE Document Server is to use the Docker image. You can also install it from the repository or compile it from source code. The following documentation is available to the community depending on the way you choose:

* [Compiling ONLYOFFICE Document Server for a local server](https://helpcenter.onlyoffice.com/installation/docs-community-compile.aspx "Compiling ONLYOFFICE Document Server for a Local Server")
* [Installing ONLYOFFICE Document Server Linux version](https://helpcenter.onlyoffice.com/installation/docs-community-install-ubuntu.aspx "Installing ONLYOFFICE Document Server Linux Version")
* [Installing ONLYOFFICE Document Server Windows version](https://helpcenter.onlyoffice.com/installation/docs-community-install-windows.aspx "Installing Document Server for Windows on a Local Server")
* [Installing ONLYOFFICE Document Server Docker version](https://helpcenter.onlyoffice.com/installation/docs-community-install-docker.aspx "Installing ONLYOFFICE Document Server Docker Version")

## ONLYOFFICE Workspace

ONLYOFFICE Docs packaged as Document Server is a part of **ONLYOFFICE Workspace** that also includes ONLYOFFICE Groups packaged as [Community Server](https://github.com/ONLYOFFICE/CommunityServer "Community Server"), [Mail Server](https://github.com/ONLYOFFICE/Docker-MailServer "Mail Server"), Control Panel and Talk (instant messaging app). 

It can also be integrated with third-party sync and share solutions. 

## Project information

Official website: [https://www.onlyoffice.com](https://www.onlyoffice.com/?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)

Code repository: [https://github.com/ONLYOFFICE/DocumentServer](https://github.com/ONLYOFFICE/DocumentServer "https://github.com/ONLYOFFICE/DocumentServer")

Docker Image: [https://github.com/ONLYOFFICE/Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer "https://github.com/ONLYOFFICE/Docker-DocumentServer")

License: [GNU AGPL v3.0](https://onlyo.co/38YZGJh)

ONLYOFFICE Docs on official website: [https://www.onlyoffice.com/office-suite.aspx](https://www.onlyoffice.com/office-suite.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)

ONLYOFFICE Workspace on official website: [https://www.onlyoffice.com/workspace.aspx](https://www.onlyoffice.com/workspace.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)

List of available integrations: [https://www.onlyoffice.com/all-connectors.aspx](https://www.onlyoffice.com/all-connectors.aspx?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)

## User Feedback and Support

If you have any problems with or questions about [ONLYOFFICE Document Server][2], please visit our official forum to find answers to your questions: [forum.onlyoffice.com][1] or you can ask and answer ONLYOFFICE development questions on [Stack Overflow][3].

  [1]: https://forum.onlyoffice.com
  [2]: https://github.com/ONLYOFFICE/DocumentServer
  [3]: https://stackoverflow.com/questions/tagged/onlyoffice
