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
#include "resource.h"
#include "IOfficeOCR.h"
#include "../../Common/ASCATLError.h"

#define OUTPUT_FORMAT_TYPE_XML	0
#define OUTPUT_FORMAT_TYPE_TEXT	1

[ coclass, uuid("5E4BC6BB-26B4-4237-894E-2C872842A8EE"), threading(apartment), vi_progid("AVSOfficeUtils.OfficeOCR"), progid("AVSOfficeUtils.OfficeOCR.1"), version(1.0), support_error_info(IOfficeOCR) ]
class ATL_NO_VTABLE COfficeOCR : public IOfficeOCR, public CAVSATLError
{
public :

	COfficeOCR();

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct();
	void FinalRelease();

public :

	STDMETHOD ( Recognize )( IUnknown *Image, BSTR* Text );					

	STDMETHOD ( put_OutputFormat )( LONG Type );							
	STDMETHOD ( get_OutputFormat )( LONG *Type );							

	STDMETHOD ( put_GrayLevel )( LONG Type );								
	STDMETHOD ( get_GrayLevel )( LONG *Type );								

	STDMETHOD ( put_DustSize )( LONG Type );								
	STDMETHOD ( get_DustSize )( LONG *Type );								

	STDMETHOD ( put_SpaceWidthDots )( LONG Type );							
	STDMETHOD ( get_SpaceWidthDots )( LONG *Type );							

	STDMETHOD ( put_Certainty )( LONG Type );								
	STDMETHOD ( get_Certainty )( LONG *Type );								

	STDMETHOD ( SetAdditionalParam )( BSTR ParamName, VARIANT ParamValue );	
	STDMETHOD ( GetAdditionalParam )( BSTR ParamName, VARIANT *ParamValue );

private :

	LONG m_lOutputFormatType;												
	LONG m_lGrayLevel;														
	LONG m_lDustSize;														
	LONG m_lSpaceWidthDots;													
	LONG m_lCertainty;														
};