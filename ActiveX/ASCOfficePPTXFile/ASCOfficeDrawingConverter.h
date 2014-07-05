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
#include "stdafx.h"
#include "resource.h"       

#include "../Common/OfficeFileTemplate.h"
#include "./PPTXFormat/Logic/SpTreeElem.h"

#include "../Common/DocxFormat/Source/Common/SimpleTypes_Base.h"
#include "../ASCPresentationEditor/OfficeDrawing/Shapes/Shape.h"

#include "./PPTXFormat/Logic/Geometry.h"

namespace PPTX
{
	class CCSS
	{
	public:
		CAtlMap<CString, CString> m_mapSettings;
		CString m_strClassName;

	public:
		CCSS()
		{
			Clear();
		}
		~CCSS()
		{
		}
		AVSINLINE void Clear()
		{
			m_strClassName = _T("");
			m_mapSettings.RemoveAll();
		}

	public:
		void LoadFromString(CString& strParams)
		{
			Clear();

			
			TCHAR* pData	= strParams.GetBuffer();
			int nCount		= strParams.GetLength();

			int nPosition	= 0;
			TCHAR* pDataMem = pData;

			while ((nPosition < nCount) && ((TCHAR(' ') == *pDataMem) || (TCHAR('\n') == *pDataMem) || (TCHAR('.') == *pDataMem)))
			{
				++nPosition;
				++pDataMem;
			}

			int nPosNameStart = nPosition;
			while ((nPosition < nCount) && (TCHAR(' ') != *pDataMem) && (TCHAR('{') != *pDataMem))
			{
				++nPosition;
				++pDataMem;
			}
			m_strClassName = strParams.Mid(nPosNameStart, nPosition - nPosNameStart);

			while (true)
			{
				++nPosition;
				++pDataMem;
				
				
				while ((nPosition < nCount) && ((TCHAR(' ') == *pDataMem) || (TCHAR('{') == *pDataMem)))
				{
					++nPosition;
					++pDataMem;
				}

				int nPosOld = nPosition;

				
				while ((nPosition < nCount) && (TCHAR(':') != *pDataMem))
				{
					++nPosition;
					++pDataMem;
				}

				if (nPosOld == nPosition)
				{
					
					break;
				}
				CString strName = strParams.Mid(nPosOld, nPosition - nPosOld);

				
				++nPosition;
				++pDataMem;

				
				while ((nPosition < nCount) && (TCHAR(' ') == *pDataMem))
				{
					++nPosition;
					++pDataMem;
				}

				nPosOld = nPosition;

				
				while ((nPosition < nCount) && (TCHAR(';') != *pDataMem) && (TCHAR('}') != *pDataMem))
				{
					++nPosition;
					++pDataMem;
				}

				CString strValue = strParams.Mid(nPosOld, nPosition - nPosOld);

				m_mapSettings.SetAt(strName, strValue);
			}
		}

		void LoadFromString2(CString& strParams)
		{
			Clear();

			
			TCHAR* pData	= strParams.GetBuffer();
			int nCount		= strParams.GetLength();

			int nPosition	= 0;
			TCHAR* pDataMem = pData;

			m_strClassName = _T("");

			while (true)
			{
				
				while ((nPosition < nCount) && ((TCHAR(' ') == *pDataMem) || (TCHAR('{') == *pDataMem) || (TCHAR(';') == *pDataMem)))
				{
					++nPosition;
					++pDataMem;
				}

				int nPosOld = nPosition;

				
				while ((nPosition < nCount) && (TCHAR(':') != *pDataMem))
				{
					++nPosition;
					++pDataMem;
				}

				if (nPosOld == nPosition)
				{
					
					break;
				}
				CString strName = strParams.Mid(nPosOld, nPosition - nPosOld);

				
				++nPosition;
				++pDataMem;

				
				while ((nPosition < nCount) && (TCHAR(' ') == *pDataMem))
				{
					++nPosition;
					++pDataMem;
				}

				nPosOld = nPosition;

				
				while ((nPosition < nCount) && (TCHAR(';') != *pDataMem) && (TCHAR('}') != *pDataMem))
				{
					++nPosition;
					++pDataMem;
				}

				CString strValue = strParams.Mid(nPosOld, nPosition - nPosOld);

				if (pData[nPosOld] == WCHAR('.'))
					strValue = (_T("0") + strValue);

				m_mapSettings.SetAt(strName, strValue);
			}
		}

	};

	class CStylesCSS
	{
	public: 
		CAtlArray<CCSS> m_arStyles;

	public:
		CStylesCSS() : m_arStyles()
		{
		}
		~CStylesCSS()
		{
		}
		AVSINLINE void Clear()
		{
			m_arStyles.RemoveAll();
		}

	public:
		void LoadStyles(CString& strParams)
		{
			Clear();

			TCHAR* pData	= strParams.GetBuffer();
			int nCount		= strParams.GetLength();

			int nPosition	 = 0;
			int nPositionOld = 0;
			TCHAR* pDataMem = pData;

			while (nPosition < nCount)
			{
				if (*pDataMem == TCHAR('}'))
				{
					CString strTemp = strParams.Mid(nPositionOld, nPosition - nPositionOld + 1);
					m_arStyles.Add();
					m_arStyles[m_arStyles.GetCount() - 1].LoadFromString(strTemp);

					nPositionOld = nPosition + 1;
				}

				++nPosition;
				++pDataMem;
			}
		}
	};
}


[object, uuid("44B693E1-F4F9-4547-ACEF-0AE037C84485"), dual, pointer_default(unique)]
__interface IAVSODObjectProps : IDispatch
{
	[id(1)]			HRESULT GetProperty([in] LONG lId, [out, retval] VARIANT* pProp);
	[id(2)]			HRESULT SetProperty([in] LONG lId, [in] VARIANT prop);	
	
	[id(1000)]		HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(1001)]		HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);
};


[object, uuid("8E0FBC40-9B34-40bf-B68A-0FA320E1B004"), dual, pointer_default(unique)]
__interface IAVSOfficeDrawingConverter : IDispatch
{
	[id(1)]				HRESULT SetMainDocument([in] IUnknown* pDocument);
	[id(2)]				HRESULT SetRelsPath([in] BSTR bsRelsPath);
	[id(3)]				HRESULT	SetMediaDstPath([in] BSTR bsMediaPath);
	
	[id(9)]				HRESULT AddShapeType([in] BSTR bsXml);
	[id(10)]			HRESULT AddObject([in] BSTR bsXml, [out] BSTR* pMainProps, [out, satype("BYTE")] SAFEARRAY** ppBinary);
	[id(11)]			HRESULT SaveObject([in, satype("BYTE")] SAFEARRAY* pBinaryObj, [in] LONG lStart, [in] LONG lLength, [in] BSTR bsMainProps, [out] BSTR* bsXml);
	[id(12)]			HRESULT SaveObjectEx([in, satype("BYTE")] SAFEARRAY* pBinaryObj, [in] LONG lStart, [in] LONG lLength, [in] BSTR bsMainProps, [in] LONG lDocType, [out] BSTR* bsXml);

	[id(13)]			HRESULT GetRecordBinary([in] LONG lRecordType, [in] BSTR bsXml, [out, satype("BYTE")] SAFEARRAY** ppBinary);
	[id(14)]			HRESULT GetRecordXml([in, satype("BYTE")] SAFEARRAY* pBinaryObj, [in] LONG lStart, [in] LONG lLength, [in] LONG lRecType, [in] LONG lDocType, [out] BSTR* bsXml);
		
	[id(20)]			HRESULT AddObject2([in] BSTR bsXml, [in, satype("BYTE")] SAFEARRAY* pBinaryObj, [out] BSTR* pXmlOutput);
	
	[id(30)]			HRESULT GetThemeBinary([in] BSTR bsThemeFilePath, [out, satype("BYTE")] SAFEARRAY** ppBinary);
	[id(31)]			HRESULT SaveThemeXml([in, satype("BYTE")] SAFEARRAY* pBinaryTheme, [in] LONG lStart, [in] LONG lLength, [in] BSTR bsThemePath);

	[id(40)]			HRESULT SetDstContentRels();
	[id(41)]			HRESULT SaveDstContentRels([in] BSTR bsRelsPath);
	[id(42)]			HRESULT WriteRels([in] BSTR bsType, [in] BSTR bsTarget, [in] BSTR bsTargetMode, [out] LONG* lId);

	[id(50)]			HRESULT LoadClrMap([in] BSTR bsXml);

	[id(60)]			HRESULT GetTxBodyBinary([in] BSTR bsXml, [out, satype("BYTE")] SAFEARRAY** ppBinary);
	[id(61)]			HRESULT GetTxBodyXml([in, satype("BYTE")] SAFEARRAY* pBinary, [in] LONG lStart, [in] LONG lLength, BSTR* pbstrXml);
	[id(62)]			HRESULT SetFontDir([in] BSTR bsFontDir);
	
	[id(1000)]			HRESULT SetAdditionalParam([in] BSTR ParamName, [in] VARIANT ParamValue);
	[id(1001)]			HRESULT GetAdditionalParam([in] BSTR ParamName, [out, retval] VARIANT* ParamValue);
};

class CSpTreeElemProps
{
public:
	LONG X;
	LONG Y;
	LONG Width;
	LONG Height;

	bool IsTop;

public:
	CSpTreeElemProps()
	{
		X = 0;
		Y = 0;
		Width = 0;
		Height = 0;

		IsTop = true;
	}
};

class CElementProps
{
public:
	CAtlMap<LONG, VARIANT> m_Properties;

public:
	CElementProps() : m_Properties()
	{
	}

	~CElementProps()
	{
		FinalRelease();
	}

	void FinalRelease()
	{
		POSITION pos = m_Properties.GetStartPosition();
		while (pos != NULL)
		{
			CAtlMap<LONG, VARIANT>::CPair * pPair = m_Properties.GetNext(pos);
			if (NULL != pPair)
			{
				if (pPair->m_value.vt == VT_BSTR)
					SysFreeString(pPair->m_value.bstrVal);
			}
		}
		m_Properties.RemoveAll();
	}

public:
	STDMETHOD(GetProperty)(LONG lId, VARIANT* pProp)
	{
		if (NULL == pProp)
			return S_FALSE;

		CAtlMap<LONG, VARIANT>::CPair * pPair = m_Properties.Lookup(lId);
		if (NULL == pPair)
			return S_FALSE;

		bool bIsSupportProp = CopyProperty(*pProp, pPair->m_value);

		if (!bIsSupportProp)
		{
			return S_FALSE;
		}

		return S_OK;
	}
	STDMETHOD(SetProperty)(LONG lId, VARIANT prop)
	{
		VARIANT var;
		bool bIsSupportProp = CopyProperty(var, prop);
		if (!bIsSupportProp)
			return S_FALSE;

		CAtlMap<LONG, VARIANT>::CPair* pPair = m_Properties.Lookup(lId);
		if (NULL != pPair)
		{
			if (pPair->m_value.vt == VT_BSTR)
				SysFreeString(pPair->m_value.bstrVal);
		}

		m_Properties.SetAt(lId, var);
		return S_OK;
	}

public:
	static bool CopyProperty(VARIANT& oDst, const VARIANT& oSrc)
	{
		oDst.vt = oSrc.vt;
		switch (oDst.vt)
		{
		case VT_I4:
			{
				oDst.lVal = oSrc.lVal;
				break;
			}
		case VT_R8:
			{
				oDst.dblVal = oSrc.dblVal;
				break;
			}
		case VT_BSTR:
			{
				oDst.bstrVal = SysAllocString(oSrc.bstrVal);
				break;
			}
		default:
			return false;			
		}
		return true;
	}
};


[coclass, uuid("4AB04382-4B51-4674-A691-BE2691A5F387"), threading(apartment), vi_progid("AVSOfficePPTXFile.ODObjectProps"), progid("AVSOfficePPTXFile.ODObjectProps.1"), version(1.0), registration_script("control.rgs")]
class ATL_NO_VTABLE CAVSODObjectProps 
	:	public IAVSODObjectProps
{
private:
	CElementProps m_oProps;

public:

	CAVSODObjectProps() : m_oProps()
	{
	}

	~CAVSODObjectProps()
	{
	}

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		return S_OK;
	}

	void FinalRelease()
	{
		m_oProps.FinalRelease();		
	}

public:
	STDMETHOD(GetProperty)(LONG lId, VARIANT* pProp)
	{
		return m_oProps.GetProperty(lId, pProp);
	}
	STDMETHOD(SetProperty)(LONG lId, VARIANT prop)
	{
		return m_oProps.SetProperty(lId, prop);
	}
	
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		return S_OK;
	}
};


[coclass, uuid("BA240E3F-CFE4-45d7-96BB-97CDD73F63C3"), event_source(com), threading(apartment), vi_progid("AVSOfficePPTXFile.ODConverter"), progid("AVSOfficePPTXFile.ODConverter.1"), version(1.0), registration_script("control.rgs")]
class ATL_NO_VTABLE CAVSOfficeDrawingConverter 
	:	public IAVSOfficeDrawingConverter
{
public:
	class CElement
	{
	public:
		PPTX::WrapperWritingElement*	m_pElement;
		CElementProps*					m_pProps;

	public:
		CElement()
		{
			m_pElement	= NULL;
			m_pProps	= NULL;
		}
		~CElement()
		{
			RELEASEOBJECT(m_pElement);
			RELEASEOBJECT(m_pProps);
		}

		CElement& operator=(const CElement& oSrc)
		{
			m_pElement	= oSrc.m_pElement;
			m_pProps	= oSrc.m_pProps;
			return *this;
		}
		CElement(const CElement& oSrc)
		{
			*this = oSrc;
		}
	};

	
	CAtlMap<CString, CShape*>				m_mapShapeTypes;
	CAtlMap<CString, smart_ptr<PPTX::CCommonRels>>	m_mapRels;
	CString									m_strCurrentRelsPath;
	
	NSBinPptxRW::CBinaryFileWriter			m_oBinaryWriter;
	int										m_lNextId;

	int										m_lCurrentObjectTop;

	NSBinPptxRW::CBinaryFileReader			m_oReader;
	NSBinPptxRW::CImageManager2				m_oImageManager;
	NSBinPptxRW::CXmlWriter					m_oXmlWriter;
	int										m_nCurrentIndexObject;

	IASCRenderer*							m_pOOXToVMLRenderer;
	BOOL									m_bIsUseConvertion2007;

	NSCommon::smart_ptr<PPTX::WrapperFile>				m_oTheme;
	NSCommon::smart_ptr<PPTX::WrapperWritingElement>	m_oClrMap;

	CString									m_strFontDirectory;

public:

	__event __interface _IAVSOfficeFileTemplateEvents2;

	CAVSOfficeDrawingConverter()
	{
		m_nCurrentIndexObject = 0;
		m_strFontDirectory = _T("");
	}

	~CAVSOfficeDrawingConverter()
	{
	}

	DECLARE_PROTECT_FINAL_CONSTRUCT()

	HRESULT FinalConstruct()
	{
		m_strCurrentRelsPath = _T("");
		m_lNextId = 1;
		m_lCurrentObjectTop = 0;

		m_pOOXToVMLRenderer = NULL;
		m_bIsUseConvertion2007 = TRUE;
		return S_OK;
	}

	void FinalRelease()
	{
		Clear();
		RELEASEINTERFACE(m_pOOXToVMLRenderer);
	}

public:
	STDMETHOD(SetMainDocument)(IUnknown* pDocument)
	{
		m_oBinaryWriter.ClearNoAttack();
		m_oBinaryWriter.m_oCommon.m_oImageManager.NewDocument();
		m_oBinaryWriter.SetMainDocument(pDocument);
		m_oReader.SetMainDocument(pDocument);
		m_lNextId = 1;
		return S_OK;
	}
	STDMETHOD(SetRelsPath)(BSTR bsRelsPath)
	{
		
		m_strCurrentRelsPath = bsRelsPath;
		return SetCurrentRelsPath();
	}
	STDMETHOD(SetMediaDstPath)(BSTR bsMediaPath)
	{
		m_oBinaryWriter.m_oCommon.m_oImageManager.m_strDstMedia = (CString)bsMediaPath;
		m_oImageManager.SetDstMedia(m_oBinaryWriter.m_oCommon.m_oImageManager.m_strDstMedia);

		CreateDirectory(bsMediaPath, NULL);
		return S_OK;
	}
	
	STDMETHOD(AddShapeType)(BSTR bsXml)
	{
		CString strXml = _T("<main ");

		strXml += _T("\
xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" \
xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
xmlns:o=\"urn:schemas-microsoft-com:office:office\" \
xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" \
xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" \
xmlns:v=\"urn:schemas-microsoft-com:vml\" \
xmlns:ve=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" \
xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" \
xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" \
xmlns:w10=\"urn:schemas-microsoft-com:office:word\" \
xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" \
xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" \
xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" \
xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" \
xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" \
xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" \
xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" \
xmlns:a14=\"http://schemas.microsoft.com/office/drawing/2010/main\" \
xmlns:pic=\"http://schemas.openxmlformats.org/drawingml/2006/picture\"");

		strXml += _T(">");

		strXml += (CString)bsXml;

		strXml += _T("</main>");

		XmlUtils::CXmlNode oNode;
		oNode.FromXmlString(strXml);

		if (oNode.IsValid())
		{
			CPPTShape* pShape = new CPPTShape();
			pShape->m_bIsShapeType = true;
			
			XmlUtils::CXmlNode oNodeST = oNode.ReadNodeNoNS(_T("shapetype"));

			CString strId = oNodeST.GetAttribute(_T("id"));
			pShape->LoadFromXMLShapeType(oNodeST);

			CShape* pS = new CShape(NSBaseShape::unknown, 0);
			pS->m_pShape = pShape;
			LoadCoordSize(oNodeST, pS);

			m_mapShapeTypes.SetAt(strId, pS);			
		}

		return S_OK;
	}

	STDMETHOD(AddObject)(BSTR bsXml, BSTR* pMainProps, SAFEARRAY** ppBinary)
	{
		CString strXml = _T("<main ");

		strXml += _T("\
xmlns:wpc=\"http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas\" \
xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
xmlns:o=\"urn:schemas-microsoft-com:office:office\" \
xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" \
xmlns:m=\"http://schemas.openxmlformats.org/officeDocument/2006/math\" \
xmlns:v=\"urn:schemas-microsoft-com:vml\" \
xmlns:ve=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" \
xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" \
xmlns:wp=\"http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing\" \
xmlns:wp14=\"http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing\" \
xmlns:w10=\"urn:schemas-microsoft-com:office:word\" \
xmlns:w14=\"http://schemas.microsoft.com/office/word/2010/wordml\" \
xmlns:w15=\"http://schemas.microsoft.com/office/word/2012/wordml\" \
xmlns:wpg=\"http://schemas.microsoft.com/office/word/2010/wordprocessingGroup\" \
xmlns:wpi=\"http://schemas.microsoft.com/office/word/2010/wordprocessingInk\" \
xmlns:wne=\"http://schemas.microsoft.com/office/word/2006/wordml\" \
xmlns:wps=\"http://schemas.microsoft.com/office/word/2010/wordprocessingShape\" \
xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" \
xmlns:a14=\"http://schemas.microsoft.com/office/drawing/2010/main\" \
xmlns:pic=\"http://schemas.openxmlformats.org/drawingml/2006/picture\" \
xmlns:xdr=\"http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing\"");

		strXml += _T(">");

		strXml += (CString)bsXml;

		strXml += _T("</main>");

		m_oBinaryWriter.m_oCommon.CheckFontPicker();

		++m_lCurrentObjectTop;
		bool bResult = ParceObject(strXml, pMainProps, ppBinary);
		--m_lCurrentObjectTop;

		if (0 == m_lCurrentObjectTop)
		{
			m_oBinaryWriter.ClearNoAttack();
		}

		return bResult ? S_OK : S_FALSE;
	}

	STDMETHOD(AddObject2)(BSTR bsXml, SAFEARRAY* pBinaryObj, BSTR* pXmlOutput)
	{
		return S_OK;
	}

	STDMETHOD(GetThemeBinary)(BSTR bsThemeFilePath, SAFEARRAY** ppBinary);

	STDMETHOD(SaveThemeXml)(SAFEARRAY* pBinaryTheme, LONG lStart, LONG lLength, BSTR bsThemePath);
	STDMETHOD(SaveObject)(SAFEARRAY* pBinaryObj, LONG lStart, LONG lLength, BSTR bsMainProps, BSTR* bsXml);
	STDMETHOD(SaveObjectEx)(SAFEARRAY* pBinaryObj, LONG lStart, LONG lLength, BSTR bsMainProps, LONG lDocType, BSTR* bsXml);

	STDMETHOD(GetRecordBinary)(LONG lRecordType, BSTR bsXml, SAFEARRAY** ppBinary);
	STDMETHOD(GetRecordXml)(SAFEARRAY* pBinaryObj, LONG lStart, LONG lLength, LONG lRecType, LONG lDocType, BSTR* bsXml);

	STDMETHOD(SetDstContentRels)()
	{
		m_oReader.m_oRels.Clear();
		m_oReader.m_oRels.StartRels();
		return S_OK;
	}
	STDMETHOD(SaveDstContentRels)(BSTR bsRelsPath)
	{
		m_oReader.m_oRels.CloseRels();
		m_oReader.m_oRels.SaveRels((CString)bsRelsPath);
		return S_OK;
	}
	STDMETHOD(WriteRels)(BSTR bsType, BSTR bsTarget, BSTR bsTargetMode, LONG* lId)
	{
		if (NULL == lId)
			return S_FALSE;

		*lId = m_oReader.m_oRels.WriteRels(bsType, bsTarget, bsTargetMode);
		return S_OK;
	}

	STDMETHOD(LoadClrMap)(BSTR bsXml);

	STDMETHOD(GetTxBodyBinary)(BSTR bsXml, SAFEARRAY** ppBinary);
	STDMETHOD(GetTxBodyXml)(SAFEARRAY* pBinary, LONG lStart, LONG lLength, BSTR *pbstrXml);
	STDMETHOD(SetFontDir)(BSTR bsFontDir);
		
	STDMETHOD(SetAdditionalParam)(BSTR ParamName, VARIANT ParamValue)
	{
		CString name = (CString)ParamName;
		if (name == _T("SourceFileDir"))
		{
			m_oReader.m_oRels.m_pManager = &m_oImageManager;
			m_oImageManager.m_bIsWord = TRUE;
			m_oReader.m_strFolder = CString(ParamValue.bstrVal);
		}
		else if (name == _T("UseConvertion2007"))
		{
			m_bIsUseConvertion2007 = (ParamValue.boolVal == VARIANT_TRUE) ? true : false;
		}
		else if (name == _T("SerializeImageManager"))
		{
			NSBinPptxRW::CBinaryFileReader oReader;
			oReader.Deserialize(&m_oBinaryWriter.m_oCommon.m_oImageManager, ParamValue.parray);
		}
		else if (name == _T("SerializeImageManager2"))
		{
			NSBinPptxRW::CBinaryFileReader oReader;
			oReader.Deserialize(&m_oImageManager, ParamValue.parray);
		}
		else if (name == _T("FontPicker") && ParamValue.vt == VT_UNKNOWN && NULL != ParamValue.punkVal)
		{
			IOfficeFontPicker* pFontPicker = NULL;
			ParamValue.punkVal->QueryInterface(__uuidof(IOfficeFontPicker), (void**)&pFontPicker);
			
			m_oBinaryWriter.m_oCommon.CreateFontPicker(pFontPicker);
			RELEASEINTERFACE(pFontPicker);
		}
		else if (name == _T("DocumentChartsCount") && ParamValue.vt == VT_I4)
		{
			m_oReader.m_lChartNumber = ParamValue.lVal + 1;
		}		
		return S_OK;
	}
	STDMETHOD(GetAdditionalParam)(BSTR ParamName, VARIANT* ParamValue)
	{
		CString name = (CString)ParamName;
		if (name == _T("SerializeImageManager"))
		{
			NSBinPptxRW::CBinaryFileWriter oWriter;

			ParamValue->vt = VT_ARRAY;
			ParamValue->parray = oWriter.Serialize(&m_oBinaryWriter.m_oCommon.m_oImageManager);
		}
		else if (name == _T("SerializeImageManager2"))
		{
			NSBinPptxRW::CBinaryFileWriter oWriter;

			ParamValue->vt = VT_ARRAY;
			ParamValue->parray = oWriter.Serialize(&m_oImageManager);
		}
		else if (name == _T("FontPicker"))
		{
			ParamValue->vt = VT_UNKNOWN;
			ParamValue->punkVal = NULL;

			if (NULL != m_oBinaryWriter.m_oCommon.m_pFontPicker)
				m_oBinaryWriter.m_oCommon.m_pFontPicker->QueryInterface(IID_IUnknown, (void**)&(ParamValue->punkVal));
		}
		else if (name == _T("DocumentChartsCount"))
		{
			ParamValue->vt = VT_I4;
			ParamValue->lVal = m_oReader.m_lChartNumber;
		}
		else if (name == _T("ContentTypes"))
		{
			ParamValue->vt = VT_BSTR;
			ParamValue->bstrVal = m_oReader.m_strContentTypes.AllocSysString();
		}
		return S_OK;
	}

protected:
	bool ParceObject(CString& strXml, BSTR* pMainProps, SAFEARRAY** ppBinary);
	void SendMainProps(CString& strMainProps, BSTR*& pMainProps);

	PPTX::Logic::SpTreeElem doc_LoadShape(XmlUtils::CXmlNode& oNode, BSTR*& pMainProps, bool bIsTop = true);
	PPTX::Logic::SpTreeElem doc_LoadGroup(XmlUtils::CXmlNode& oNode, BSTR*& pMainProps, bool bIsTop = true);

	CString GetVMLShapeXml(CPPTShape* pPPTShape);
	CString GetVMLShapeXml(PPTX::Logic::SpTreeElem& oElem);

	void CheckBrushShape(PPTX::Logic::SpTreeElem& oElem, XmlUtils::CXmlNode& oNode, PPTShapes::ShapeType eType, CPPTShape* pPPTShape);
	void CheckPenShape(PPTX::Logic::SpTreeElem& oElem, XmlUtils::CXmlNode& oNode, PPTShapes::ShapeType eType, CPPTShape* pPPTShape);
		
	void LoadCoordSize(XmlUtils::CXmlNode& oNode, CShape* pShape);
	CString GetDrawingMainProps(XmlUtils::CXmlNode& oNode, PPTX::CCSS& oCssStyles, CSpTreeElemProps& oProps);

	void ConvertMainPropsToVML(BSTR bsMainProps, NSBinPptxRW::CXmlWriter& oWriter, PPTX::Logic::SpTreeElem& oElem);
	void ConvertShapeVML(PPTX::Logic::SpTreeElem& oShape, BSTR bsMainProps, NSBinPptxRW::CXmlWriter& oWriter);
	void ConvertGroupVML(PPTX::Logic::SpTreeElem& oGroup, BSTR bsMainProps, NSBinPptxRW::CXmlWriter& oWriter);

	void Clear()
	{
		POSITION pos = m_mapShapeTypes.GetStartPosition();
		while (NULL != pos)
		{
			CShape* pMem = m_mapShapeTypes.GetNextValue(pos);
			RELEASEOBJECT(pMem);
		}
		m_mapShapeTypes.RemoveAll();
		m_mapRels.RemoveAll();
	}

	HRESULT SetCurrentRelsPath()
	{
		CAtlMap<CString, smart_ptr<PPTX::CCommonRels>>::CPair* pPair = m_mapRels.Lookup(m_strCurrentRelsPath);

		if (NULL == pPair)
		{
			smart_ptr<PPTX::CCommonRels> pCR = new PPTX::CCommonRels();
			m_mapRels.SetAt(m_strCurrentRelsPath, pCR);

			pPair = m_mapRels.Lookup(m_strCurrentRelsPath);
			OOX::CPath filename = m_strCurrentRelsPath;
			pPair->m_value->_read(filename);
		}

		m_oBinaryWriter.m_pCommonRels = pPair->m_value.smart_dynamic_cast<PPTX::FileContainer>();
		return S_OK;
	}
};
