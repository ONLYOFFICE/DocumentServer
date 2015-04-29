/*
    Copyright (c) Ascensio System SIA 2014. All rights reserved.
    http://www.onlyoffice.com
*/
function initEditor(docKey, docVkey, mode, type) {
    //mode for editor
    window.mode = window.mode || mode || "view";
    mode = window.mode;

    //mode for editor
    window.type = window.type || type || "desktop";
    type = window.type;

    //url for document
    window.docUrl = document.getElementById("documentUrl").value;

    //key for chaching and collaborate editing
    window.docKey = window.docKey || docKey || key(docUrl);
    docKey = window.docKey;

    //vkey parameter is necessary if you use our SaaS based editors only. 
    if (document.getElementById("scriptApi").getAttribute("src").indexOf("doc.onlyoffice.com") != -1
        && !docVkey) {
        if (typeof vkey !== "function") {
            var script = document.createElement("script")
            script.setAttribute("src", "vkey.js")
            document.getElementsByTagName("head")[0].appendChild(script);
            return;
        } else {
            docVkey = vkey(docKey);
        }
    }

    //type for document
    var docType = docUrl.substring(docUrl.lastIndexOf(".") + 1).trim().toLowerCase();
    //type for editor
    var documentType = getDocumentType(docType);

    //creating object editing
    new DocsAPI.DocEditor("placeholder",
        {
            type: type,
            width: (type == "desktop" ? "100%" : undefined),
            height: (type == "desktop" ? "100%" : undefined),
            documentType: documentType,
            document: {
                title: docUrl,
                url: docUrl,
                fileType: docType,
                key: docKey,
                vkey: docVkey,
                permissions: {
                    edit: true
                }
            },
            editorConfig: {
                mode: mode,
            },
            events: {
                "onSave": function (event) { alert("You can get changed document by url: " + event.data); }
            }
        });
}

function key(k) {
    var result = k.replace(new RegExp("[^0-9-.a-zA-Z_=]", "g"), "_") + (new Date()).getTime();
    return result.substring(result.length - Math.min(result.length, 20));
};

var getDocumentType = function (ext) {
    if (".docx.doc.odt.rtf.txt.html.htm.mht.pdf.djvu.fb2.epub.xps".indexOf(ext) != -1) return "text";
    if (".xls.xlsx.ods.csv".indexOf(ext) != -1) return "spreadsheet";
    if (".pps.ppsx.ppt.pptx.odp".indexOf(ext) != -1) return "presentation";
    return null;
};