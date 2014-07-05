/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 #pragma once
#ifndef OOX_NAMESPACES_INCLUDE_H_
#define OOX_NAMESPACES_INCLUDE_H_

#include "../../../Common/DocxFormat/Source/Base/Base.h"
#include <atlstr.h>

namespace OOX
{
	class Namespace
	{
	public:
		CString m_strName;
		CString m_strLink;

	public:
		Namespace(LPCSTR sName, LPCSTR sLink) : m_strName(sName), m_strLink(sLink)
		{
		}
		Namespace(LPCWSTR sName, LPCWSTR sLink) : m_strName(sName), m_strLink(sLink)
		{
		}
	};
	
	class Namespaces
	{
	public:
		Namespaces() : a("a", "http://schemas.openxmlformats.org/drawingml/2006/main"),
			b("b", "http://schemas.openxmlformats.org/officeDocument/2006/bibliography"),
			cdr("cdr", "http://schemas.openxmlformats.org/drawingml/2006/chartDrawing"),
			cp("cp", "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"),
			dc("dc", "http://purl.org/dc/elements/1.1/"),
			dchrt("dchrt", "http://schemas.openxmlformats.org/drawingml/2006/chart"),
			dcmitype("dcmitype", "http://purl.org/dc/dcmitype/"),
			dcterms("dcterms", "http://purl.org/dc/terms/"),
			ddgrm("ddgrm", "http://schemas.openxmlformats.org/drawingml/2006/diagram"),
			dgm("dgm", "http://schemas.openxmlformats.org/drawingml/2006/diagram"),
			dlckcnv("dlckcnv", "http://schemas.openxmlformats.org/drawingml/2006/lockedCanvas"),
			dpct("dpct", "http://schemas.openxmlformats.org/drawingml/2006/picture"),
			ds("ds", "http://schemas.openxmlformats.org/officeDocument/2006/customXml"),
			m("m", "http://schemas.openxmlformats.org/officeDocument/2006/math"),
			o("o", "urn:schemas-microsoft-com:office:office"),
			p("p", "http://schemas.openxmlformats.org/presentationml/2006/main"),
			pic("pic", "http://schemas.openxmlformats.org/drawingml/2006/picture"),
			pvml("pvml", "urn:schemas-microsoft-com:office:powerpoint"),
			r("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships"),
			s("s", "http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes"),
			sl("sl", "http://schemas.openxmlformats.org/schemaLibrary/2006/main"),
			v("v", "urn:schemas-microsoft-com:vml"),
			ve("ve", "http://schemas.openxmlformats.org/markup-compatibility/2006"),
			vp("vp", "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"),
			vt("vt", "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"),
			w("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main"),
			w10("w10", "urn:schemas-microsoft-com:office:word"),
			wne("wne", "http://schemas.microsoft.com/office/word/2006/wordml"),
			wp("wp", "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"),
			x("x", "urn:schemas-microsoft-com:office:excel"),
			xdr("xdr", "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"),
			xmlns("xmlns",  "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"),
			xsd("xsd", "http://www.w3.org/2001/XMLSchema"),
			xsi("xsi", "http://www.w3.org/2001/XMLSchema-instance")
		{
		}

	public:
		const Namespace a;
		const Namespace b;
		const Namespace cdr;
		const Namespace cp;
		const Namespace dc;
		const Namespace dchrt;
		const Namespace dcmitype;
		const Namespace dcterms;
		const Namespace ddgrm;
		const Namespace dgm;
		const Namespace dlckcnv;
		const Namespace dpct;
		const Namespace ds;
		const Namespace m;
		const Namespace o;
		const Namespace p;
		const Namespace pic;
		const Namespace pvml;
		const Namespace r;
		const Namespace s;
		const Namespace sl;
		const Namespace v;
		const Namespace ve;
		const Namespace vp;
		const Namespace vt;
		const Namespace w;
		const Namespace w10;
		const Namespace wne;
		const Namespace wp;
		const Namespace x;
		const Namespace xdr;
		const Namespace xmlns;
		const Namespace xsd;
		const Namespace xsi;
	};
} 

#endif // OOX_NAMESPACES_INCLUDE_H_