[![License](https://img.shields.io/badge/License-GNU%20AGPL%20V3-green.svg?style=flat)](https://docspace.onlyoffice.com/s/gnC2xcxWjHhHmsM) [![Release](https://img.shields.io/github/v/tag/ONLYOFFICE/DocumentServer?sort=semver&style=flat&label=Release&color=blue)](https://github.com/ONLYOFFICE/DocumentServer/tags)

## Welcome to the ONLYOFFICE Docs repo!

[ONLYOFFICE Docs](https://www.onlyoffice.com/docs?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)* is a free collaborative online office suite comprising viewers and editors for texts, spreadsheets, presentations, forms, PDFs, and diagrams. It is fully compatible with Office Open XML formats (.docx, .xlsx, .pptx) and enables collaborative editing in real time.

ONLYOFFICE Docs can be used as a part of  [ONLYOFFICE DocSpace](https://www.onlyoffice.com/docspace?utm_source=github&utm_medium=cpc&utm_campaign=GitHubCS) and [ONLYOFFICE Workspace](https://www.onlyoffice.com/workspace?utm_source=github&utm_medium=cpc&utm_campaign=GitHubCS), or with [third-party sync&share solutions](https://www.onlyoffice.com/all-connectors?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) (e.g. Odoo, Moodle, ownCloud, Seafile, etc.) to enable collaborative editing within their interface.

ONLYOFFICE Docs is available in three tailored editions to suit your needs: [Community, Enterprise, and Developer](#onlyoffice-docs-editions). 

\* Starting from version 6.0, Document Server is distributed under a new name - ONLYOFFICE Docs.

![ONLYOFFICE Docs](./screenshots/ONLYOFFICE%20Docs.png)

## Features you'll love ✨

Take advantage of the powerful editors included in ONLYOFFICE Docs:

* [ONLYOFFICE Document Editor](https://www.onlyoffice.com/word-processor?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDS)
* [ONLYOFFICE Spreadsheet Editor](https://www.onlyoffice.com/sheets?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDS)
* [ONLYOFFICE Presentation Editor](https://www.onlyoffice.com/slides?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDS)
* [ONLYOFFICE Form Creator](https://www.onlyoffice.com/form-creator?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDS)
* [ONLYOFFICE PDF Editor](https://www.onlyoffice.com/pdf-editor?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDS)
* [ONLYOFFICE Diagram Viewer](https://www.onlyoffice.com/diagram-viewer?utm_source=GitHub&utm_medium=social&utm_campaign=GitHubDS)

The editors empower you to create, edit, save, and export text documents, spreadsheets, presentations, PDFs, create and fill out PDF forms, open diagrams, all while offering additional advanced features such as:

* [Collaborative editing](https://www.onlyoffice.com/seamless-collaboration?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) 🤝
* [AI-powered assistants](https://www.onlyoffice.com/ai-assistants?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) 🤖
* Reviewing 📝
* Spell-checking 🔍
* [Accessibility](https://www.onlyoffice.com/blog/2026/04/onlyoffice-for-every-user?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) 👩‍💻
* Scalable UI options (including dark mode 🌓)
* [Security tools and services](https://www.onlyoffice.com/security?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS) 🔒

## Localization 🌐

ONLYOFFICE is constantly improving localization of the editors to make the suite accessible to all users, all over the world.

* Interface available in 46 languages
* RTL support
* Hieroglyph support 🈴

## Plugins 🧩

ONLYOFFICE Docs offer support for plugins allowing developers to add specific features to the editors that are not directly related to the OOXML format. For more information, see [our API](https://api.onlyoffice.com/docs/plugin-and-macros/structure/getting-started/) or visit the [GitHub plugins repo](https://github.com/ONLYOFFICE/onlyoffice.github.io).

Would like to explore the existing plugins in details? You are welcome to visit our [Marketplace](https://www.onlyoffice.com/app-directory?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS).

## Components 📦

ONLYOFFICE Docs contains the following components:

* [server](https://github.com/ONLYOFFICE/server) - the backend server software layer which is the base for all other components of ONLYOFFICE Docs.
* [core](https://github.com/ONLYOFFICE/core) - server core components of ONLYOFFICE Docs which enable the conversion between the most popular office document formats (DOC, DOCX, ODT, RTF, TXT, PDF, HTML, EPUB, XPS, DjVu, XLS, XLSX, ODS, CSV, PPT, PPTX, ODP).
* [core-fonts](https://github.com/ONLYOFFICE/core-fonts) - open-source fonts bundled with ONLYOFFICE Docs for document rendering and conversion.
* [sdkjs](https://github.com/ONLYOFFICE/sdkjs) - JavaScript SDK for the ONLYOFFICE Docs which contains API for all the included components client-side interaction.
* [web-apps](https://github.com/ONLYOFFICE/web-apps) - the frontend for ONLYOFFICE Docs which builds the program interface and allows the user create, edit, save and export text, spreadsheet and presentation documents using the common interface of a document editor.
* [dictionaries](https://github.com/ONLYOFFICE/dictionaries) - the dictionaries of various languages used for spellchecking in ONLYOFFICE Docs.
* [document-formats](https://github.com/ONLYOFFICE/document-formats) - metadata describing the file formats supported by ONLYOFFICE editors.
* [document-templates](https://github.com/ONLYOFFICE/document-templates) - blank and sample templates used when creating new documents.

## ONLYOFFICE Docs editions

ONLYOFFICE offers different versions of its online document editors that can be deployed on your own servers.

ONLYOFFICE Docs (packaged as Document Server):

* Community Edition 🆓 (`onlyoffice-documentserver` package) – Perfect for small teams and personal use.
* Enterprise Edition 🏢 (`onlyoffice-documentserver-ee` package) – Designed for businesses with advanced features & support.
* Developer Edition ⚙️ (`onlyoffice-documentserver-de` package) – Designed for integrators who need to bring document editing to their app users. 

The table below will help you to make the right choice.

| Pricing and licensing | Community Edition | Enterprise Edition | Developer Edition |
| ------------- | ------------- | ------------- | ------------- |
| | [Get it now](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-enterprise)  | [Start Free Trial](https://www.onlyoffice.com/download-developer?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-developer)  |
| Cost  | FREE  | [Go to the pricing page](https://www.onlyoffice.com/docs-enterprise-prices?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  | [Go to the pricing page](https://www.onlyoffice.com/developer-edition-prices?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS)  |
| Number of users | up to 20 recommended | As in chosen pricing plan | As in chosen pricing plan |
| Clusterization | - | + | + |
| License | GNU AGPL v.3 | Proprietary | Proprietary |
| **Support** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Documentation | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/community) | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/enterprise) | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/developer) |
| Standard support | [GitHub](https://github.com/ONLYOFFICE/DocumentServer/issues) or [Community](https://community.onlyoffice.com/) | One or three years support included | One year support included |
| Premium support | [Contact Us](mailto:sales@onlyoffice.com) | [Contact Us](mailto:sales@onlyoffice.com) | [Contact Us](mailto:sales@onlyoffice.com) |
| **Services** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Conversion Service                | + | + | + |
| [Live Viewer](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works/viewing/#live-viewer-vs-common-viewer) | + | + | + |
| Document Builder Service          | - | - | + |
| [Automation API](https://www.onlyoffice.com/automation-api)  | - | - | + |
| **Interface** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Tabbed interface                       | + | + | + |
| Dark theme                             | + | + | + |
| 125%, 150%, 175%, 200% scaling         | + | + | + |
| White label                            | - | - | + |
| Integrated test example (node.js)      | + | + | + |
| Admin Panel                            | - | + | + |
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
| Comparing documents             | + | + | + |
| Multipage View             | + | + | + |
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
| Solver                          | + | + | + |
| **Presentation Editor features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Font and paragraph formatting   | + | + | + |
| Object insertion                | + | + | + |
| Transitions                     | + | + | + |
| Animations                      | + | + | + |
| Presenter mode                  | + | + | + |
| Notes                           | + | + | + |
| Slide Master                    | + | + | + |
| **Form creator features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Adding form fields              | + | + | + |
| Form preview                    | + | + | + |
| Saving as PDF                   | + | + | + |
| Role-matching colors for fields | + | + | + |
| **PDF Editor features**      | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| Text editing and co-editing     | + | + | + |
| Work with pages (adding, deleting, rotating)   | + | + | + |
| Inserting objects (shapes, images, hyperlinks, etc.) | + | + | + |
| Text annotations (highlight, underline, cross out, stamps) | + | + | + |
| Comments                        | + | + | + |
| Redact                          | + | + | + |
| Freehand drawings               | + | + | + |
| Form filling                    | + | + | + |
| **Security features** | **Community Edition** | **Enterprise Edition** | **Developer Edition** |
| End-to-end encryption via Private Rooms***  | + | + | - |
| JWT                    | + | + | + |
| | [Get it now](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-enterprise)  | [Start Free Trial](https://www.onlyoffice.com/download-developer?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS#docs-developer)  |

\** If supported by DMS  
\*** End-to-end encryption via Private Rooms requires ONLYOFFICE Workspace

## 🚀 Get started: How to install on a local server

The easiest way to install ONLYOFFICE Docs is to use **the Docker image** 👉 [Check the official source code](https://github.com/ONLYOFFICE/Docker-DocumentServer)

Explore these step-by-step guides:

* [Installing ONLYOFFICE Docs Docker](https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-docker.aspx)
* [Installing ONLYOFFICE Docs for Linux](https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-ubuntu.aspx)
* [Installing ONLYOFFICE Docs for Windows](https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-windows.aspx)

## How to build 🛠

You can find the detailed instructions for building ONLYOFFICE Docs on a local server from source code in our [Help Center](https://helpcenter.onlyoffice.com/docs/installation/docs-community-compile.aspx).

## License 📄

ONLYOFFICE Docs is licensed under the GNU Affero Public License, version 3.0, ensuring its transparency and commitment to the open-source community. 

See [LICENSE](https://docspace.onlyoffice.com/s/gnC2xcxWjHhHmsM) for more information.

## 💡 User Feedback and Support

If you face any issues, have questions about ONLYOFFICE Docs, or want to share suggestions, please visit our official forum: [community.onlyoffice.com](https://community.onlyoffice.com/).

Need help for developers? 👨‍💻 Check our [API documentation](https://api.onlyoffice.com). You are also welcome to ask and answer ONLYOFFICE development questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/onlyoffice).

Join [our Discord community](https://discord.gg/Hcgtf5n4uF) for connecting with fellow developers.

Collaborate better with ONLYOFFICE Docs! 🌟