[![License](https://img.shields.io/badge/License-GNU%20AGPL%20V3-green.svg?style=flat)](https://docspace.onlyoffice.com/s/gnC2xcxWjHhHmsM) [![Release](https://img.shields.io/github/v/tag/ONLYOFFICE/DocumentServer?sort=semver&style=flat&label=Release&color=blue)](https://github.com/ONLYOFFICE/DocumentServer/tags)

## Welcome to the ONLYOFFICE Docs repo!

[ONLYOFFICE Docs](https://www.onlyoffice.com/docs?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro) (formerly Document Server) is a free collaborative online office suite comprising viewers and editors for texts, spreadsheets, presentations, forms, PDFs, and diagrams. It is fully compatible with Office Open XML formats (.docx, .xlsx, .pptx) and Adobe PDF, including fillable PDF forms, and enables collaborative editing in real time.

Extend ONLYOFFICE Docs with [ONLYOFFICE Apps](https://github.com/ONLYOFFICE/DocSpace): AI agents, Forms, Rooms, and Files. You can also use the editors as part of [ONLYOFFICE Workspace](https://www.onlyoffice.com/workspace?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro) or connect them to [50+ platforms](https://www.onlyoffice.com/all-connectors?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro) such as [Odoo](https://www.onlyoffice.com/office-for-odoo?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro), [Moodle](https://www.onlyoffice.com/office-for-moodle?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro), [Nextcloud](https://www.onlyoffice.com/office-for-nextcloud?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro), [ownCloud](https://www.onlyoffice.com/office-for-owncloud?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro), [Confluence](https://www.onlyoffice.com/office-for-confluence?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro), etc. to enable collaborative editing within their interface.

ONLYOFFICE Docs is available in three editions: [Community, Enterprise, and Developer](#onlyoffice-docs-editions). Don't want to host the editors yourself? Try [Docs Connect](https://www.onlyoffice.com/blog/2026/10/onlyoffice-docs-connect?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro), a cloud service maintained by ONLYOFFICE that you embed into your platform.

**[Download Community for free](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro)** · **[Try Enterprise for 30 days](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro#for-enterprises)** · **[Create a free cloud account](https://www.onlyoffice.com/signup?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro)**

<p align="center">
  <a href="https://www.onlyoffice.com/docs?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=intro">
    <img width="840" src="https://static-blog.onlyoffice.com/wp-content/uploads/2026/05/21115431/ONLYOFFICE-Docs.png" alt="ONLYOFFICE Apps">
  </a>
</p>

## Table of contents

* [What's new in 10.0](#-whats-new-in-100)
* [Features you'll love](#features-youll-love-)
* [Desktop and mobile apps](#desktop-and-mobile-apps-)
* [Localization](#localization-)
* [Plugins](#plugins-)
* [Components](#components-)
* [ONLYOFFICE Docs editions](#onlyoffice-docs-editions)
* [Security](#-security)
* [Quick start with Docker](#-quick-start-with-docker)
* [Get started: How to install on a local server](#-get-started-how-to-install-on-a-local-server)
* [How to build](#how-to-build-)
* [Related repositories](#related-repositories-)
* [License](#license-)
* [User Feedback and Support](#-user-feedback-and-support)

## 🆕 What's new in 10.0

* **AI tools in every editor:** context-aware AI for documents, spreadsheets, presentations, and PDFs, in a dedicated AI Tools tab. Connect any model, including local ones. In the open-source version, AI tools are installed separately.
* **Modular apps:** extend the editors with AI agents, Forms, Rooms, and Files, and turn on only what you need.
* **Smarter PDF Editor:** automatic table recognition, metadata removal, and reusable signatures.
* **Faster spreadsheets**, new presentation views and print options, and export of slides to GIF or video.
* **More formats:** open and convert OFD files, and save spreadsheets as XLS.
* **About 50 new features, 1,000+ bug fixes, and 40+ security fixes.**

**Upgrading an integration?** Version 10.0 turns on JWT by default, scopes tokens for service APIs, requires explicit WOPI hosts, and moves DEB and RPM installations to port 8083. Check the [developer notes](https://www.onlyoffice.com/blog/2026/10/onlyoffice-10-developers?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=whats_new) before you upgrade.

👉 [See everything new in 10.0](https://www.onlyoffice.com/blog/2026/10/onlyoffice-docs-10?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=whats_new) · [Full changelog](https://github.com/ONLYOFFICE/DocumentServer/blob/master/CHANGELOG.md)

## Features you'll love ✨

Work with all your content in one suite:

* [Text documents](https://www.onlyoffice.com/word-processor?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features)
* [Spreadsheets](https://www.onlyoffice.com/sheets?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features)
* [Presentations](https://www.onlyoffice.com/slides?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features)
* [Forms](https://www.onlyoffice.com/form-creator?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features)
* [PDFs](https://www.onlyoffice.com/pdf-editor?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features)
* [Diagrams](https://www.onlyoffice.com/diagram-viewer?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features)

The editors empower you to create, edit, save, and export text documents, spreadsheets, presentations, PDFs, create and fill out PDF forms, open diagrams, all while offering additional advanced features such as:

* [Collaborative editing](https://www.onlyoffice.com/seamless-collaboration?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features) 🤝
* [AI tools](https://www.onlyoffice.com/ai-assistants?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features) 🤖
* Reviewing 📝
* Spell-checking 🔍
* [Accessibility](https://www.onlyoffice.com/blog/2026/04/onlyoffice-for-every-user?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features) 👩‍💻
* Scalable UI options (including dark mode 🌓)
* [Security tools and services](https://www.onlyoffice.com/security?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=features) 🔒

## Desktop and mobile apps 💻📱

Work with the same editors outside the browser with free apps:

* **Desktop Editors** for Windows, macOS, and Linux: edit files offline, connect your cloud, and use AI with your own keys or local models.
* **Mobile apps** for iOS and Android: an AI assistant, AI AutoFill for forms, and voice input on the go.

👉 [Get desktop and mobile apps](https://www.onlyoffice.com/download-desktop?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=apps)

## Localization 🌐

ONLYOFFICE is constantly improving localization of the editors to make the suite accessible to all users, all over the world.

* Interface available in 46 languages
* RTL support
* CJK support (Chinese, Japanese, Korean) 🈴

## Plugins 🧩

ONLYOFFICE Docs supports plugins that let developers add features to the editors that are not directly related to the OOXML format. For more information, see [our API](https://api.onlyoffice.com/docs/plugins/get-started/overview) or visit the [GitHub plugins repo](https://github.com/ONLYOFFICE/onlyoffice.github.io).

Want to explore the existing plugins in detail? Visit our [Marketplace](https://www.onlyoffice.com/marketplace?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=plugins).

## Components 📦

ONLYOFFICE Docs contains the following components:

* [server](https://github.com/ONLYOFFICE/server) - the backend server software layer which is the base for all other components of ONLYOFFICE Docs.
* [core](https://github.com/ONLYOFFICE/core) - server core components of ONLYOFFICE Docs which enable the conversion between the most popular office document formats (DOC, DOCX, ODT, RTF, TXT, PDF, HTML, EPUB, XPS, OFD, DjVu, XLS, XLSX, ODS, CSV, PPT, PPTX, ODP).
* [core-fonts](https://github.com/ONLYOFFICE/core-fonts) - open-source fonts bundled with ONLYOFFICE Docs for document rendering and conversion.
* [sdkjs](https://github.com/ONLYOFFICE/sdkjs) - JavaScript SDK for the ONLYOFFICE Docs which contains API for all the included components client-side interaction.
* [web-apps](https://github.com/ONLYOFFICE/web-apps) - the frontend for ONLYOFFICE Docs which builds the program interface and allows the user create, edit, save and export text, spreadsheet and presentation documents using the common interface of a document editor.
* [dictionaries](https://github.com/ONLYOFFICE/dictionaries) - the dictionaries of various languages used for spellchecking in ONLYOFFICE Docs.
* [document-formats](https://github.com/ONLYOFFICE/document-formats) - metadata describing the file formats supported by ONLYOFFICE editors.
* [document-templates](https://github.com/ONLYOFFICE/document-templates) - blank and sample templates used when creating new documents.

## ONLYOFFICE Docs editions

ONLYOFFICE Docs (packaged as Document Server) comes in three editions that you deploy on your own servers:

* **Community** 🆓 (`onlyoffice-documentserver` package): free and open source for non-critical use.
* **Enterprise** 🏢 (`onlyoffice-documentserver-ee` package): for businesses that need the Admin Panel, support with a guaranteed response time, AI tools, and scaling.
* **Developer** ⚙️ (`onlyoffice-documentserver-de` package): for integrators who bring document editing to their app users.

The table below will help you make the right choice.

**All editions include:** 
* the editors for documents, spreadsheets, presentations, PDFs, and forms; 
* real-time co-editing, comments, chat, track changes, version history, comparison; 
* plugins and macros; 
* Apps (Rooms, Forms, Files, AI agents);  
* HTTPS traffic encryption; 
* JWT protection;
* 50+ ready-made connectors.

| | **Community** | **Enterprise** | **Developer** |
| :---- | :---- | :---- | :---- |
| | [Download free](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions) | [Start free trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions#for-enterprises) | [Start free trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions#for-developers) |
| **Licensing and support** | | | |
| License | GNU AGPL v3 | Commercial | Commercial |
| Recommended number of users | Up to 20 | As in your pricing plan | As in your pricing plan |
| Support | Forum and GitHub | Basic, Plus or Premium | Basic, Plus or Premium |
| First response time (SLA)¹ | No guarantee | 12 to 48 working hours, by level | 12 to 48 working hours, by level |
| Support requests included¹ | — | 5, 10 or 20, by level | 5, 10 or 20, by level |
| Help with installation, configuration, migration and updates | Do it yourself | ✅ | ✅ |
| Help with integrating the editors | Do it yourself | ✅ | ✅ |
| Monitoring and clustering assistance | — | With Premium support | With Premium support |
| Remote sessions and an account engineer | — | With Premium support | With Premium support |
| Priority security and stability fixes | — | ✅ | ✅ |
| **Administration** | | | |
| Admin Panel² | Manual setup in config files and server scripts | Simple setup in a web interface | Simple setup in a web interface |
| Mobile web editors | — | ✅ | ✅ |
| Statistics and health checks | Manual server requests | One click in the Admin Panel | One click in the Admin Panel |
| Final server configuration view | — | ✅ | ✅ |
| Signing certificate for PDF forms | — | ✅ | ✅ |
| **AI and apps (new in 10.0)** | | | |
| AI tools in the editors³ | — | ✅ | ✅ |
| Central AI settings⁴ | — | ✅ | ✅ |
| Local and offline AI models | — | ✅ | ✅ |
| **Scaling and reliability** | | | |
| Server architecture⁵ | Single process, no RabbitMQ or database | RabbitMQ + database, built for high load | RabbitMQ + database, built for high load |
| Cluster | — | Add-on | Add-on |
| Disaster recovery | — | Add-on | Add-on |
| Multi-tenancy | — | Add-on | Add-on |
| **Integration and branding** | | | |
| Live viewer⁶ | — | ✅ | ✅ |
| [Automation API](https://www.onlyoffice.com/automation-api?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions) | — | Add-on | Add-on |
| White Label⁷ | — | — | [Ask about White Label](mailto:sales@onlyoffice.com) |
| **Pricing** | Free | [See prices](https://www.onlyoffice.com/pricing?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions) | [See prices](https://www.onlyoffice.com/pricing?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions) |
| | [Download free](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions) | [Start free trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions#for-enterprises) | [Start free trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=editions#for-developers) |

¹ First response within 48, 24, or 12 working hours with Basic, Plus, or Premium support, which include 5, 10, or 20 requests.  
² Set up HTTPS, WOPI, security, file size limits, fonts, and AI in a web interface, and see statistics and health checks in one place.  
³ Summarize, rewrite, translate, and analyze content inside documents.  
⁴ Assign models to tasks and limit providers server-wide.  
⁵ A message queue and a database share the load across processes and servers, keep editing fast under heavy use, and make clustering and failover possible.  
⁶ See co-authors' changes in real time in view-only mode.  
⁷ Your logo, name, and interface settings.

## 🔐 Security

* **40+ security fixes in 10.0**, covering document conversion, PDF handling, macros, integrations, and server configuration. [Read the overview ↗](https://www.onlyoffice.com/blog/2026/10/security-fixes-onlyoffice-10?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=security)
* **October 2026 Node.js vulnerabilities:** Enterprise and Developer builds now run on Node.js 24.22.1, with fix branches 10.0.2 and 9.4.2 for older versions. [Learn more ↗](https://www.onlyoffice.com/blog/2026/10/onlyoffice-docs-patches-node-js-vulnerability?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=security)
* **Found a vulnerability?** Please report it responsibly to [security@onlyoffice.com](mailto:security@onlyoffice.com).

## 🐳 Quick start with Docker

Run ONLYOFFICE Docs Community with one command:

```bash
sudo docker run -i -t -d -p 80:80 -e JWT_SECRET=my_jwt_secret onlyoffice/documentserver
```

JWT is on by default. Set your own `JWT_SECRET` and use the same value in your integration; otherwise the container generates a random secret. To keep your data between restarts, mount volumes as described in the [Docker-DocumentServer README](https://github.com/ONLYOFFICE/Docker-DocumentServer#storing-data).

## 🚀 Get started: How to install on a local server

The easiest way to install ONLYOFFICE Docs is to use **the Docker image** 👉 [Check the official source code](https://github.com/ONLYOFFICE/Docker-DocumentServer)

Explore these step-by-step guides:

* [Installing ONLYOFFICE Docs Docker](https://helpcenter.onlyoffice.com/docs/installation/community/docker/installing/install)
* [Installing ONLYOFFICE Docs for Linux](https://helpcenter.onlyoffice.com/docs/installation/community/linux/installing/install-ubuntu)
* [Installing ONLYOFFICE Docs for Windows](https://helpcenter.onlyoffice.com/docs/installation/community/windows/install)

## How to build 🛠

You can find the detailed instructions for building ONLYOFFICE Docs on a local server from source code in our [Help Center](https://helpcenter.onlyoffice.com/docs/installation/community/linux/compiling/compile).

## Related repositories 🔗

* [Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer): the Docker image and its configuration options.
* [document-server-integration](https://github.com/ONLYOFFICE/document-server-integration): examples of integrating ONLYOFFICE Docs into your website or application.
* [DesktopEditors](https://github.com/ONLYOFFICE/DesktopEditors): the free desktop apps for Windows, macOS, and Linux.
* [ONLYOFFICE Apps](https://github.com/ONLYOFFICE/DocSpace): AI agents, Forms, Rooms, and Files that extend the editors.

## License 📄

ONLYOFFICE Docs is licensed under the GNU Affero Public License, version 3.0, ensuring its transparency and commitment to the open-source community. 

See [LICENSE](https://docspace.onlyoffice.com/s/gnC2xcxWjHhHmsM) for more information.

## 💡 User Feedback and Support

* **🐞 Found a bug?** Please report it by creating an [issue](https://github.com/ONLYOFFICE/DocumentServer/issues).
* **❓ Have a question?** Ask other users and our developers in the [ONLYOFFICE Community](https://community.onlyoffice.com/).
* **🥷 Want to be a power user?** Visit our [YouTube channel](https://www.youtube.com/onlyofficeTV) and [Help Center](https://helpcenter.onlyoffice.com/docs/getting-started?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=support).
* **👨‍💻 Need help for developers?** Check our [API documentation](https://api.onlyoffice.com/?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=support).
* **💡 Want to suggest a feature?** Share your ideas [here](https://community.onlyoffice.com/c/suggestions/40).
* Join [our Discord community](https://discord.gg/Hcgtf5n4uF) for connecting with fellow developers.

**Ready to try ONLYOFFICE Docs?** 👉 [Download Community for free](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=footer_cta) or [start a free Enterprise trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubDS&utm_content=footer_cta#for-enterprises) ✨

---
<p align="center"> Made with ❤️ by the ONLYOFFICE Team </p>