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

#include "XML.h"

namespace OOX
{
	class Namespaces
	{
	public:
		Namespaces();

	public:
		const XML::XNamespace a;
		const XML::XNamespace b;
		const XML::XNamespace cdr;
		const XML::XNamespace cp;
		const XML::XNamespace dc;
		const XML::XNamespace dchrt;
		const XML::XNamespace dcmitype;
		const XML::XNamespace dcterms;
		const XML::XNamespace ddgrm;
		const XML::XNamespace dgm;
		const XML::XNamespace dlckcnv;
		const XML::XNamespace dpct;
		const XML::XNamespace ds;
		const XML::XNamespace m;
		const XML::XNamespace o;
		const XML::XNamespace p;
		const XML::XNamespace pic;
		const XML::XNamespace pvml;
		const XML::XNamespace r;
		const XML::XNamespace s;
		const XML::XNamespace sl;
		const XML::XNamespace v;
		const XML::XNamespace ve;
		const XML::XNamespace vp;
		const XML::XNamespace vt;
		const XML::XNamespace w;
		const XML::XNamespace w10;
		const XML::XNamespace wne;
		const XML::XNamespace wp;
		const XML::XNamespace x;
		const XML::XNamespace xdr;
		const XML::XNamespace xmlns;
		const XML::XNamespace xsd;
		const XML::XNamespace xsi;
	};
} 

#endif // OOX_NAMESPACES_INCLUDE_H_