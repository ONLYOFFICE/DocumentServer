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

#include "SimpleTypes_Base.h"
#include "SimpleTypes_Drawing.h"


namespace SimpleTypes
{
	
	
	
	enum EEditAs
	{
		editasBullseye = 0,
		editasCanvas   = 1,
		editasCycle    = 2,
		editasOrgchart = 3,
		editasRadial   = 4,
		editasStacked  = 5,
		editasVenn     = 6,
	};

	template<EEditAs eDefValue = editasCanvas>
	class CEditAs : public CSimpleType<EEditAs, eDefValue>
	{
	public:
		CEditAs() {}
		virtual EEditAs FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("bullseye") == sValue ) m_eValue = editasBullseye;
				break;
			case 'c':
				if      ( _T("canvas")   == sValue ) m_eValue = editasCanvas;
				else if ( _T("cycle")    == sValue ) m_eValue = editasCycle;
				break;
			case 'o':
				if      ( _T("orgchart") == sValue ) m_eValue = editasOrgchart;
				break;
			case 'r':
				if      ( _T("radial")   == sValue ) m_eValue = editasRadial;
				break;
			case 's':
				if      ( _T("stacked")  == sValue ) m_eValue = editasStacked;
				break;
			case 'v':
				if      ( _T("venn")     == sValue ) m_eValue = editasVenn;
				break;
			}

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case editasBullseye : return _T("bullseye");
			case editasCanvas   : return _T("canvas");
			case editasCycle    : return _T("cycle");
			case editasOrgchart : return _T("orgchart");
			case editasRadial   : return _T("radial");
			case editasStacked  : return _T("stacked");
			case editasVenn     : return _T("venn");
			default             : return _T("canvas");
			}
		}

		SimpleType_FromString     (EEditAs)
		SimpleType_Operator_Equal (CEditAs)

	};


	
	
	
	enum EExt
	{
		extBackwardCompatible = 0,
		extEdit               = 1,
		extView               = 2,
	};

	template<EExt eDefValue = extView>
	class CExt : public CSimpleType<EExt, eDefValue>
	{
	public:
		CExt() {}
		virtual EExt    FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("backwardCompatible") == sValue ) m_eValue = extBackwardCompatible;
				break;
			case 'e':
				if      ( _T("edit")               == sValue ) m_eValue = extEdit;
				break;
			case 'v':
				if      ( _T("view")               == sValue ) m_eValue = extView;
				break;
			}

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case extBackwardCompatible : return _T("backwardCompatible");
			case extEdit               : return _T("edit");
			case extView               : return _T("view");
			default                    : return _T("view");
			}
		}

		SimpleType_FromString     (EExt)
		SimpleType_Operator_Equal (CExt)

	};


	
	
	
	enum EFillMethod
	{
		fillmethodAny,
		fillmethodLinear,
		fillmethodLinearSigma,
		fillmethodSigma,
		fillmethodNone
	};
	template<EFillMethod eDefValue = fillmethodNone>
	class CFillMethod : public CSimpleType<EFillMethod, eDefValue>
	{
	public:
		CFillMethod() {}

		virtual EFillMethod FromString(CString& sValue)
		{
			if		(_T("any")			== sValue)	m_eValue = fillmethodAny;
			else if	(_T("linear")		== sValue)	m_eValue = fillmethodLinear;
			else if	(_T("linear sigma")	== sValue)	m_eValue = fillmethodLinearSigma;
			else if (_T("sigma")		== sValue)	m_eValue = fillmethodSigma;
			else if (_T("none")			== sValue)	m_eValue = fillmethodNone;
			else									m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString ToString() const
		{
			switch (m_eValue)
			{
			case fillmethodAny	        : return _T("any");
			case fillmethodLinear	    : return _T("linear");
			case fillmethodLinearSigma	: return _T("linearSigma");
			case fillmethodSigma		: return _T("sigma");
			case fillmethodNone			: return _T("none");
			default						: return _T("none");
			}
		}

		SimpleType_FromString     (EFillMethod)
			SimpleType_Operator_Equal (CFillMethod)
	};
	
	
	
	enum EFillType
	{
		filltypeBackground       = 0,
		filltypeFrame            = 1,
		filltypeGradient         = 2,
		filltypeGradientCenter   = 3,
		filltypeGradientRadial   = 4,
		filltypeGradientUnscaled = 5,
		filltypePattern          = 6,
		filltypeSolid            = 7,
		filltypeTile             = 8
	};
	
	template<EFillType eDefValue = filltypeSolid, int nType = 0>
	class CFillType : public CSimpleType<EFillType, eDefValue>
	{
	public:
		CFillType() {}

		virtual void    SetValue  (EFillType eValue)
		{
			if ( 0 == nType )
			{
				if ( filltypeFrame == eValue || filltypeGradient == eValue || eValue == filltypeGradientRadial ||
					 filltypePattern == eValue || filltypeSolid == eValue || filltypeTile == eValue )
					 m_eValue = eValue;
				else
					m_eValue = eDefValue;
			}
			else
				m_eValue = eValue;
		}
		virtual EFillType FromString(CString &sValue)
		{
			if ( 0 == nType )
			{
				if      (_T("frame")			== sValue)	m_eValue = filltypeFrame;
				else if (_T("gradient")			== sValue)	m_eValue = filltypeGradient;
				else if (_T("gradientRadial")	== sValue)	m_eValue = filltypeGradientRadial;
				else if (_T("pattern")			== sValue)	m_eValue = filltypePattern;
				else if (_T("solid")			== sValue)	m_eValue = filltypeSolid;
				else if (_T("tile")				== sValue)	m_eValue = filltypeTile;
				else										m_eValue = eDefValue;
			}
			else
			{
				if      (_T("background")		== sValue)	m_eValue = filltypeBackground;
				else if (_T("frame")			== sValue)	m_eValue = filltypeFrame;
				else if (_T("gradient")			== sValue)	m_eValue = filltypeGradient;
				else if (_T("gradientCenter")   == sValue)	m_eValue = filltypeGradientCenter;
				else if (_T("gradientRadial")	== sValue)	m_eValue = filltypeGradientRadial;
				else if (_T("gradientUnscaled") == sValue)	m_eValue = filltypeGradientUnscaled;
				else if (_T("pattern")			== sValue)	m_eValue = filltypePattern;
				else if (_T("solid")			== sValue)	m_eValue = filltypeSolid;
				else if (_T("tile")				== sValue)	m_eValue = filltypeTile;
				else										m_eValue = eDefValue;
			}

			return m_eValue;
		}

		virtual CString ToString() const
		{
			if ( 0 == nType )
			{
				switch (m_eValue)
				{
				case filltypeFrame			: return _T("frame");
				case filltypeGradient		: return _T("gradient");
				case filltypeGradientRadial	: return _T("gradientRadial");
				case filltypePattern		: return _T("pattern");
				case filltypeSolid			: return _T("solid");
				case filltypeTile			: return _T("tile");
				default						: return _T("solid");
				}
			}
			else
			{
				switch (m_eValue)
				{
				case filltypeBackground		  : return _T("background");
				case filltypeFrame			  : return _T("frame");
				case filltypeGradient		  : return _T("gradient");
				case filltypeGradientCenter	  : return _T("gradientCenter");
				case filltypeGradientRadial	  : return _T("gradientRadial");
				case filltypeGradientUnscaled : return _T("gradientUnscaled");
				case filltypePattern		  : return _T("pattern");
				case filltypeSolid			  : return _T("solid");
				case filltypeTile			  : return _T("tile");
				default						  : return _T("solid");
				}
			}
		}

		SimpleType_FromString     (EFillType)
		SimpleType_Operator_Equal (CFillType)
	};

	
	
	
	enum EImageAspect
	{
		imageaspectAtLeast = 0,
		imageaspectAtMost  = 1,
		imageaspectIgnore  = 2,
	};

	template<EImageAspect eDefValue = imageaspectIgnore>
	class CImageAspect : public CSimpleType<EImageAspect, eDefValue>
	{
	public:
		CImageAspect() {}
		virtual EImageAspect FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("atLeast") == sValue ) m_eValue = imageaspectAtLeast;
				else if ( _T("atMost")  == sValue ) m_eValue = imageaspectAtMost;
				break;
			case 'i':
				if      ( _T("ignore")  == sValue ) m_eValue = imageaspectIgnore;
				break;
			}

			return m_eValue;
		}

		virtual CString      ToString  () const 
		{
			switch(m_eValue)
			{
			case imageaspectAtLeast : return _T("atLeast");
			case imageaspectAtMost  : return _T("atMost");
			case imageaspectIgnore  : return _T("ignore");
			default                 : return _T("ignore");
			}
		}

		SimpleType_FromString     (EImageAspect)
		SimpleType_Operator_Equal (CImageAspect)

	};


	
	
	
	enum EShadowType
	{
		shadowtypeDouble,
		shadowtypeEmboss,
		shadowtypePerspective,
		shadowtypeSingle,
	};
	template<EShadowType eDefValue = shadowteprSingle>
	class CShadowType : public CSimpleType<EShadowType, eDefValue>
	{
	public:
		CShadowType() {}

		virtual EShadowType FromString(CString &sValue)
		{
			if      (_T("double")		== sValue)	m_eValue = shadowtypeDouble;
			else if (_T("emboss")		== sValue)	m_eValue = shadowtypeEmboss;
			else if (_T("perspective")	== sValue)	m_eValue = shadowtypePerspective;
			else if (_T("single")		== sValue)	m_eValue = shadowtypeSingle;
			else									m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString ToString() const
		{
			switch (m_eValue)
			{
			case shadowtypeDouble	    : return _T("double");
			case shadowtypeEmboss	    : return _T("emboss");
			case shadowtypePerspective	: return _T("perspective");
			case shadowtypeSingle		: return _T("single");
			default						: return _T("single");
			}
		}

		SimpleType_FromString		(EShadowType);
		SimpleType_Operator_Equal	(CShadowType);
	};
	
	
	
	enum EStrokeArrowLength
	{
		strokearrowlengthLong   = 0,
		strokearrowlengthMedium = 1,
		strokearrowlengthShort  = 2,
	};

	template<EStrokeArrowLength eDefValue = strokearrowlengthMedium>
	class CStrokeArrowLength : public CSimpleType<EStrokeArrowLength, eDefValue>
	{
	public:
		CStrokeArrowLength() {}
		virtual EStrokeArrowLength FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'l':
				if      ( _T("long")   == sValue ) m_eValue = strokearrowlengthLong;
				break;
			case 'm':
				if      ( _T("medium") == sValue ) m_eValue = strokearrowlengthMedium;
				break;
			case 's':
				if      ( _T("short")  == sValue ) m_eValue = strokearrowlengthShort;
				break;
			}

			return m_eValue;
		}

		virtual CString            ToString  () const 
		{
			switch(m_eValue)
			{
			case strokearrowlengthLong   : return _T("long");
			case strokearrowlengthMedium : return _T("medium");
			case strokearrowlengthShort  : return _T("short");
			default                      : return _T("medium");
			}
		}

		SimpleType_FromString     (EStrokeArrowLength)
		SimpleType_Operator_Equal (CStrokeArrowLength)

	};


	
	
	
	enum EStrokeArrowType
	{
		strokearrowtypeBlock   = 0,
		strokearrowtypeClassic = 1,
		strokearrowtypeDiamond = 2,
		strokearrowtypeNone    = 3,
		strokearrowtypeOpen    = 4,
		strokearrowtypeOval    = 5,
	};

	template<EStrokeArrowType eDefValue = strokearrowtypeNone>
	class CStrokeArrowType : public CSimpleType<EStrokeArrowType, eDefValue>
	{
	public:
		CStrokeArrowType() {}
		virtual EStrokeArrowType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("block")   == sValue ) m_eValue = strokearrowtypeBlock;
				break;
			case 'c':
				if      ( _T("classic") == sValue ) m_eValue = strokearrowtypeClassic;
				break;
			case 'd':
				if      ( _T("diamond") == sValue ) m_eValue = strokearrowtypeDiamond;
				break;
			case 'n':
				if      ( _T("none")    == sValue ) m_eValue = strokearrowtypeNone;
				break;
			case 'o':
				if      ( _T("open")    == sValue ) m_eValue = strokearrowtypeOpen;
				else if ( _T("oval")    == sValue ) m_eValue = strokearrowtypeOval;
				break;
			}

			return m_eValue;
		}

		virtual CString          ToString  () const 
		{
			switch(m_eValue)
			{
			case strokearrowtypeBlock   : return _T("block");
			case strokearrowtypeClassic : return _T("classic");
			case strokearrowtypeDiamond : return _T("diamond");
			case strokearrowtypeNone    : return _T("none");
			case strokearrowtypeOpen    : return _T("open");
			case strokearrowtypeOval    : return _T("oval");
			default                     : return _T("none");
			}
		}

		SimpleType_FromString     (EStrokeArrowType)
		SimpleType_Operator_Equal (CStrokeArrowType)

	};


	
	
	
	enum EStrokeArrowWidth
	{
		strokearrowwidthMedium = 0,
		strokearrowwidthNarrow = 1,
		strokearrowwidthWide   = 2,
	};

	template<EStrokeArrowWidth eDefValue = strokearrowwidthMedium>
	class CStrokeArrowWidth : public CSimpleType<EStrokeArrowWidth, eDefValue>
	{
	public:
		CStrokeArrowWidth() {}
		virtual EStrokeArrowWidth FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'm':
				if      ( _T("medium") == sValue ) m_eValue = strokearrowwidthMedium;
				break;
			case 'n':
				if      ( _T("narrow") == sValue ) m_eValue = strokearrowwidthNarrow;
				break;
			case 'w':
				if      ( _T("wide")   == sValue ) m_eValue = strokearrowwidthWide;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case strokearrowwidthMedium : return _T("medium");
			case strokearrowwidthNarrow : return _T("narrow");
			case strokearrowwidthWide   : return _T("wide");
			default                     : return _T("medium");
			}
		}

		SimpleType_FromString     (EStrokeArrowWidth)
		SimpleType_Operator_Equal (CStrokeArrowWidth)

	};


	
	
	
	enum EStrokeEndCap
	{
		strokeendcapFlat   = 0,
		strokeendcapRound  = 1,
		strokeendcapSqaure = 2,
	};

	template<EStrokeEndCap eDefValue = strokeendcapRound>
	class CStrokeEndCap : public CSimpleType<EStrokeEndCap, eDefValue>
	{
	public:
		CStrokeEndCap() {}
		virtual EStrokeEndCap FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'f':
				if      ( _T("flat")   == sValue ) m_eValue = strokeendcapFlat;
				break;
			case 'r':
				if      ( _T("round")  == sValue ) m_eValue = strokeendcapRound;
				break;
			case 's':
				if      ( _T("square") == sValue ) m_eValue = strokeendcapSqaure;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case strokeendcapFlat   : return _T("flat");
			case strokeendcapRound  : return _T("round");
			case strokeendcapSqaure : return _T("square");
			default                 : return _T("round");
			}
		}

		SimpleType_FromString     (EStrokeEndCap)
		SimpleType_Operator_Equal (CStrokeEndCap)

	};


	
	
	
	enum EStrokeJoinStyle
	{
		strokejoinstyleBevel,
		strokejoinstyleMiter,
		strokejoinstyleRound,
	};
	template<EStrokeJoinStyle eDefValue = strokejoinstyleRound>
	class CStrokeJoinStyle : public CSimpleType<EStrokeJoinStyle, eDefValue>
	{
	public:
		CStrokeJoinStyle() {}

		virtual EStrokeJoinStyle FromString(CString &sValue)
		{
			if      (_T("round")	== sValue)	m_eValue = strokejoinstyleRound;
			else if (_T("miter")	== sValue)	m_eValue = strokejoinstyleMiter;
			else if (_T("bevel")	== sValue)	m_eValue = strokejoinstyleMiter;
			else								m_eValue = strokejoinstyleRound;

			return m_eValue;
		}

		virtual CString ToString() const
		{
			switch (m_eValue)
			{
			case strokejoinstyleRound	: return _T("round");
			case strokejoinstyleMiter	: return _T("miter");
			case strokejoinstyleBevel	: return _T("bevel");
			default						: return _T("round");
			}
		}

		SimpleType_FromString     (EStrokeJoinStyle)
		SimpleType_Operator_Equal (CStrokeJoinStyle)
	};
	
	
	
	enum EStrokeLineStyle
	{
		strokelinestyleSingle           = 0,
		strokelinestyleThickBetweenThin = 1,
		strokelinestyleThickThin        = 2,
		strokelinestyleThinThick        = 3,
		strokelinestyleThinThin         = 4,
	};

	template<EStrokeLineStyle eDefValue = strokelinestyleSingle>
	class CStrokeLineStyle : public CSimpleType<EStrokeLineStyle, eDefValue>
	{
	public:
		CStrokeLineStyle() {}
		virtual EStrokeLineStyle FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 's':
				if      ( _T("single")           == sValue ) m_eValue = strokelinestyleSingle;
				break;
			case 't':
				if      ( _T("thickBetweenThin") == sValue ) m_eValue = strokelinestyleThickBetweenThin;
				else if ( _T("thickThin")        == sValue ) m_eValue = strokelinestyleThickThin;
				else if ( _T("thinThick")        == sValue ) m_eValue = strokelinestyleThinThick;
				else if ( _T("thinThin")         == sValue ) m_eValue = strokelinestyleThinThin;
				break;
			}

			return m_eValue;
		}

		virtual CString          ToString  () const 
		{
			switch(m_eValue)
			{
			case strokelinestyleSingle            : return _T("single");
			case strokelinestyleThickBetweenThin  : return _T("thickBetweenThin");
			case strokelinestyleThickThin         : return _T("thickThin");
			case strokelinestyleThinThick         : return _T("thinThick");
			case strokelinestyleThinThin          : return _T("thinThin");
			default                               : return _T("single");
			}
		}

		SimpleType_FromString     (EStrokeLineStyle)
		SimpleType_Operator_Equal (CStrokeLineStyle)

	};


}
namespace SimpleTypes
{
	
	
	
	enum EAlternateMathContentType
	{
		alternatemathcontenttypeOfficeOpenXmlMath = 0,
		alternatemathcontenttypeMathMl            = 1,
	};

	template<EAlternateMathContentType eDefValue = alternatemathcontenttypeOfficeOpenXmlMath>
	class CAlternateMathContentType : public CSimpleType<EAlternateMathContentType, eDefValue>
	{
	public:
		CAlternateMathContentType() {}

		virtual EAlternateMathContentType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'o':
				if      ( _T("officeopenxmlmath") == sValue ) m_eValue = alternatemathcontenttypeOfficeOpenXmlMath;
				break;
			case 'm':
				if      ( _T("mathml")            == sValue ) m_eValue = alternatemathcontenttypeMathMl;
				break;
			}

			return m_eValue;
		}

		virtual CString                   ToString  () const 
		{
			switch(m_eValue)
			{
			case alternatemathcontenttypeOfficeOpenXmlMath: return _T("officeopenxmlmath");			
			case alternatemathcontenttypeMathMl:            return _T("mathml");			
			default :                                       return _T("officeopenxmlmath");
			}
		}

		SimpleType_FromString     (EAlternateMathContentType)
		SimpleType_Operator_Equal (CAlternateMathContentType)
	};


	
	
	
	enum EVmlAngle
	{
		vmlangle30   = 0,
		vmlangle45   = 1,
		vmlangle60   = 2,
		vmlangle90   = 3,
		vmlangleAny  = 4,
		vmlangleAuto = 5
	};

	template<EVmlAngle eDefValue = vmlangleAuto>
	class CVmlAngle : public CSimpleType<EVmlAngle, eDefValue>
	{
	public:
		CVmlAngle() {}

		virtual EVmlAngle FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case '3':
				if      ( _T("30")   == sValue ) m_eValue = vmlangle30;
				break;
			case '4':
				if      ( _T("45")   == sValue ) m_eValue = vmlangle45;
				break;
			case '6':
				if      ( _T("60")   == sValue ) m_eValue = vmlangle60;
				break;
			case '9':
				if      ( _T("90")   == sValue ) m_eValue = vmlangle90;
				break;
			case 'a':  
				if      ( _T("any")  == sValue ) m_eValue = vmlangleAny;
				else if ( _T("auto") == sValue ) m_eValue = vmlangleAuto;
				break;

			}

			return m_eValue;
		}

		virtual CString   ToString  () const 
		{
			switch(m_eValue)
			{
			case vmlangle30:   return _T("30");			
			case vmlangle45:   return _T("45");			
			case vmlangle60:   return _T("60");			
			case vmlangle90:   return _T("90");					
			case vmlangleAny:  return _T("any");					
			case vmlangleAuto: return _T("auto");					
			default :          return _T("auto");
			}
		}

		SimpleType_FromString     (EVmlAngle)
		SimpleType_Operator_Equal (CVmlAngle)
	};


	
	
	
	enum EBWMode
	{
		bwmodeAuto              = 0,
		bwmodeBlack             = 1,
		bwmodeBlackTextAndLines = 2,
		bwmodeColor             = 3,
		bwmodeGrayOutline       = 4,
		bwmodeGrayScale         = 5,
		bwmodeHide              = 6,
		bwmodeHighContrast      = 7,
		bwmodeInverseGray       = 8,
		bwmodeLightGrayscale    = 9,
		bwmodeUndrawn           = 10,
		bwmodeWhite             = 11,
	};

	template<EBWMode eDefValue = bwmodeAuto>
	class CBWMode : public CSimpleType<EBWMode, eDefValue>
	{
	public:
		CBWMode() {}

		virtual EBWMode FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("auto")              == sValue ) m_eValue = bwmodeAuto;
				break;
			case 'b':
				if      ( _T("black")             == sValue ) m_eValue = bwmodeBlack;
				else if ( _T("blackTextAndLines") == sValue ) m_eValue = bwmodeBlackTextAndLines;
				break;
			case 'c':
				if      ( _T("color")             == sValue ) m_eValue = bwmodeColor;
				break;
			case 'g':
				if      ( _T("grayOutline")       == sValue ) m_eValue = bwmodeGrayOutline;
				else if ( _T("grayScale")         == sValue ) m_eValue = bwmodeGrayScale;
				break;
			case 'h':  
				if      ( _T("hide")              == sValue ) m_eValue = bwmodeHide;
				else if ( _T("highContrast")      == sValue ) m_eValue = bwmodeHighContrast;
				break;
			case 'i':
				if      ( _T("inverseGray")       == sValue ) m_eValue = bwmodeInverseGray;
				break;
			case 'l':
				if      ( _T("lightGrayscale")    == sValue ) m_eValue = bwmodeLightGrayscale;
				break;
			case 'u':
				if      ( _T("undrawn")           == sValue ) m_eValue = bwmodeUndrawn;
				break;
			case 'w':
				if      ( _T("white")             == sValue ) m_eValue = bwmodeWhite;
				break;

			}

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case bwmodeAuto:              return _T("auto");			
			case bwmodeBlack:             return _T("black");			
			case bwmodeBlackTextAndLines: return _T("blackTextAndLines");			
			case bwmodeColor:             return _T("color");					
			case bwmodeGrayOutline:       return _T("grayOutline");					
			case bwmodeGrayScale:         return _T("grayScale");					
			case bwmodeHide:              return _T("hide");			
			case bwmodeHighContrast:      return _T("highContrast");			
			case bwmodeInverseGray:       return _T("inverseGray");					
			case bwmodeLightGrayscale:    return _T("lightGrayscale");					
			case bwmodeUndrawn:           return _T("undrawn");					
			case bwmodeWhite:             return _T("white");					
			default :                     return _T("auto");
			}
		}

		SimpleType_FromString     (EBWMode)
		SimpleType_Operator_Equal (CBWMode)
	};


	
	
	
	class CCalloutDrop
	{
	public:
		CCalloutDrop() {}

		CString GetValue() const
		{
			return m_sValue;
		}

		void    SetValue(CString &sValue)
		{
			m_sValue = sValue;
		}


		CString FromString(CString &sValue)
		{
			m_sValue = sValue;

			return m_sValue;
		}

		CString ToString  () const 
		{
			return m_sValue;
		}

		SimpleType_FromString2    (CString)
		SimpleType_Operator_Equal (CCalloutDrop)

	private:

		CString m_sValue;
	};

	
	
	
	enum EColorMode
	{
		colormodeAuto   = 0,
		colormodeCustom = 1,
	};

	template<EColorMode eDefValue = colormodeAuto>
	class CColorMode : public CSimpleType<EColorMode, eDefValue>
	{
	public:
		CColorMode() {}

		virtual EColorMode FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("auto")   == sValue ) m_eValue = colormodeAuto;
				break;
			case 'c':
				if      ( _T("custom") == sValue ) m_eValue = colormodeCustom;
				break;
			}

			return m_eValue;
		}

		virtual CString    ToString  () const 
		{
			switch(m_eValue)
			{
			case colormodeAuto:   return _T("auto");			
			case colormodeCustom: return _T("custom");			
			default :             return _T("auto");
			}
		}

		SimpleType_FromString     (EColorMode)
		SimpleType_Operator_Equal (CColorMode)
	};


	
	
	
	enum EConnectorType
	{
		connectortypeCurved   = 0,
		connectortypeElbow    = 1,
		connectortypeNone     = 2,
		connectortypeStraight = 3,
	};

	template<EConnectorType eDefValue = connectortypeNone>
	class CConnectorType : public CSimpleType<EConnectorType, eDefValue>
	{
	public:
		CConnectorType() {}

		virtual EConnectorType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("curved")   == sValue ) m_eValue = connectortypeCurved;
				break;
			case 'e':
				if      ( _T("elbow")    == sValue ) m_eValue = connectortypeElbow;
				break;
			case 'n':
				if      ( _T("none")     == sValue ) m_eValue = connectortypeNone;
				break;
			case 's':
				if      ( _T("straight") == sValue ) m_eValue = connectortypeStraight;
				break;
			}

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case connectortypeCurved  : return _T("curved");			
			case connectortypeElbow   : return _T("elbow");			
			case connectortypeNone    : return _T("none");			
			case connectortypeStraight: return _T("straight");			
			default                   : return _T("none");
			}
		}

		SimpleType_FromString     (EConnectorType)
		SimpleType_Operator_Equal (CConnectorType)
	};


	
	
	
	enum EConnectType
	{
		connecttypeCustom   = 0,
		connecttypeNone     = 1,
		connecttypeRect     = 2,
		connecttypeSegments = 3,
	};

	template<EConnectType eDefValue = connecttypeNone>
	class CConnectType : public CSimpleType<EConnectType, eDefValue>
	{
	public:
		CConnectType() {}

		virtual EConnectType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("custom")   == sValue ) m_eValue = connecttypeCustom;
				break;
			case 'n':
				if      ( _T("none")     == sValue ) m_eValue = connecttypeNone;
				break;
			case 'r':
				if      ( _T("rect")     == sValue ) m_eValue = connecttypeRect;
				break;
			case 's':
				if      ( _T("segments") == sValue ) m_eValue = connecttypeSegments;
				break;
			}

			return m_eValue;
		}

		virtual CString      ToString  () const 
		{
			switch(m_eValue)
			{
			case connecttypeCustom  : return _T("custom");			
			case connecttypeNone    : return _T("none");			
			case connecttypeRect    : return _T("rect");			
			case connecttypeSegments: return _T("segments");			
			default                 : return _T("none");
			}
		}

		SimpleType_FromString     (EConnectType)
		SimpleType_Operator_Equal (CConnectType)
	};


	
	
	
	class CContentType
	{
	public:
		CContentType() {}

		CString GetValue() const
		{
			return m_sValue;
		}

		void    SetValue(CString &sValue)
		{
			m_sValue = sValue;
		}


		CString FromString(CString &sValue)
		{
			m_sValue = sValue;

			return m_sValue;
		}

		CString ToString  () const 
		{
			return m_sValue;
		}

		SimpleType_FromString2    (CString)
		SimpleType_Operator_Equal (CContentType)

	private:

		CString m_sValue;
	};

	
	
	
	enum EDiagramLayout
	{
		diagramlayout0 = 0,
		diagramlayout1 = 1,
		diagramlayout2 = 2,
		diagramlayout3 = 3,
	};

	template<EDiagramLayout eDefValue = diagramlayout0>
	class CDiagramLayout : public CSimpleType<EDiagramLayout, eDefValue>
	{
	public:
		CDiagramLayout() {}

		virtual EDiagramLayout FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case '0':
				if      ( _T("0") == sValue ) m_eValue = diagramlayout0;
				break;
			case '1':
				if      ( _T("1") == sValue ) m_eValue = diagramlayout1;
				break;
			case '2':
				if      ( _T("2") == sValue ) m_eValue = diagramlayout2;
				break;
			case '3':
				if      ( _T("3") == sValue ) m_eValue = diagramlayout3;
				break;
			}

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case diagramlayout0 : return _T("0");			
			case diagramlayout1 : return _T("1");			
			case diagramlayout2 : return _T("2");			
			case diagramlayout3 : return _T("3");			
			default             : return _T("0");
			}
		}

		SimpleType_FromString     (EDiagramLayout)
		SimpleType_Operator_Equal (CDiagramLayout)
	};


	
	
	
	enum EExtrusionPlane
	{
		extrusionplaneXY = 0,
		extrusionplaneYZ = 1,
		extrusionplaneZX = 2,
	};

	template<EExtrusionPlane eDefValue = extrusionplaneXY>
	class CExtrusionPlane : public CSimpleType<EExtrusionPlane, eDefValue>
	{
	public:
		CExtrusionPlane() {}

		virtual EExtrusionPlane FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'X':
				if      ( _T("XY") == sValue ) m_eValue = extrusionplaneXY;
				break;
			case 'Y':
				if      ( _T("YZ") == sValue ) m_eValue = extrusionplaneYZ;
				break;
			case 'Z':
				if      ( _T("ZX") == sValue ) m_eValue = extrusionplaneZX;
				break;
			case 'x':
				if      ( _T("xy") == sValue ) m_eValue = extrusionplaneXY;
				break;
			case 'y':
				if      ( _T("yz") == sValue ) m_eValue = extrusionplaneYZ;
				break;
			case 'z':
				if      ( _T("zx") == sValue ) m_eValue = extrusionplaneZX;
				break;
			}

			return m_eValue;
		}

		virtual CString         ToString  () const 
		{
			switch(m_eValue)
			{
			case extrusionplaneXY: return _T("XY");			
			case extrusionplaneYZ: return _T("YZ");			
			case extrusionplaneZX: return _T("ZX");			
			default :              return _T("XY");
			}
		}

		SimpleType_FromString     (EExtrusionPlane)
		SimpleType_Operator_Equal (CExtrusionPlane)
	};


	
	
	
	enum EExtrusionRender
	{
		extrusionrenderBoundingCube = 0,
		extrusionrenderSolid        = 1,
		extrusionrenderWireFrame    = 2,
	};

	template<EExtrusionRender eDefValue = extrusionrenderSolid>
	class CExtrusionRender : public CSimpleType<EExtrusionRender, eDefValue>
	{
	public:
		CExtrusionRender() {}

		virtual EExtrusionRender FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("boundingCube") == sValue ) m_eValue = extrusionrenderBoundingCube;
				break;
			case 's':
				if      ( _T("solid")        == sValue ) m_eValue = extrusionrenderSolid;
				break;
			case 'w':
				if      ( _T("wireFrame")    == sValue ) m_eValue = extrusionrenderWireFrame;
				break;
			}

			return m_eValue;
		}

		virtual CString          ToString  () const 
		{
			switch(m_eValue)
			{
			case extrusionrenderBoundingCube: return _T("boundingCube");			
			case extrusionrenderSolid:        return _T("solid");			
			case extrusionrenderWireFrame:    return _T("wireFrame");			
			default :                         return _T("solid");
			}
		}

		SimpleType_FromString     (EExtrusionRender)
		SimpleType_Operator_Equal (CExtrusionRender)
	};


	
	
	
	enum EExtrusionType
	{
		extrusiontypeParallel,
		extrusiontypePerspective
	};
	template<EExtrusionType eDefValue = extrusiontypeParallel>
	class CExtrusionType : public CSimpleType<EExtrusionType, eDefValue>
	{
	public:
		CExtrusionType() {}

		virtual EExtrusionType FromString(CString& sValue)
		{
			if		(_T("parallel")    == sValue ) m_eValue = extrusiontypeParallel;
			else if	(_T("perspective") == sValue ) m_eValue = extrusiontypePerspective;
			else								   m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString ToString() const
		{
			switch (m_eValue)
			{
			case extrusiontypeParallel		: return _T("parallel");
			case extrusiontypePerspective	: return _T("perspective");
			default							: return _T("parallel");
			}
		}

		SimpleType_FromString     (EExtrusionType)
		SimpleType_Operator_Equal (CExtrusionType)
	};
	
	
	
	enum EHow
	{
		howBottom = 0,
		howCenter = 1,
		howLeft   = 2,
		howMiddle = 3,
		howRight  = 4,
		howTop    = 5,
	};

	template<EHow eDefValue = howTop>
	class CHow : public CSimpleType<EHow, eDefValue>
	{
	public:
		CHow() {}

		virtual EHow    FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("bottom") == sValue ) m_eValue = howBottom;
				break;
			case 'c':
				if      ( _T("center") == sValue ) m_eValue = howCenter;
				break;
			case 'l':
				if      ( _T("left")   == sValue ) m_eValue = howLeft;
				break;
			case 'm':
				if      ( _T("middle") == sValue ) m_eValue = howMiddle;
				break;
			case 'r':
				if      ( _T("right")  == sValue ) m_eValue = howRight;
				break;
			case 't':
				if      ( _T("top")    == sValue ) m_eValue = howTop;
				break;
			}

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case howBottom: return _T("bottom");			
			case howCenter: return _T("center");			
			case howLeft  : return _T("left");			
			case howMiddle: return _T("middle");			
			case howRight : return _T("right");			
			case howTop   : return _T("top");			
			default       : return _T("top");
			}
		}

		SimpleType_FromString     (EHow)
		SimpleType_Operator_Equal (CHow)
	};


	
	
	
	enum EHrAlign
	{
		hralignCenter = 0,
		hralignLeft   = 1,
		hralignRight  = 2,
	};

	template<EHrAlign eDefValue = hralignLeft>
	class CHrAlign : public CSimpleType<EHrAlign, eDefValue>
	{
	public:
		CHrAlign() {}

		virtual EHrAlign FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("center") == sValue ) m_eValue = hralignCenter;
				break;
			case 'l':
				if      ( _T("left")   == sValue ) m_eValue = hralignLeft;
				break;
			case 'r':
				if      ( _T("right")  == sValue ) m_eValue = hralignRight;
				break;
			}

			return m_eValue;
		}

		virtual CString  ToString  () const 
		{
			switch(m_eValue)
			{
			case hralignCenter: return _T("center");			
			case hralignLeft  : return _T("left");			
			case hralignRight : return _T("right");			
			default           : return _T("left");
			}
		}

		SimpleType_FromString     (EHrAlign)
		SimpleType_Operator_Equal (CHrAlign)
	};


	
	
	
	enum EInsetMode
	{
		insetmodeAuto   = 0,
		insetmodeCustom = 1,
	};

	template<EInsetMode eDefValue = insetmodeAuto>
	class CInsetMode : public CSimpleType<EInsetMode, eDefValue>
	{
	public:
		CInsetMode() {}

		virtual EInsetMode FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("auto")   == sValue ) m_eValue = insetmodeAuto;
				break;
			case 'c':
				if      ( _T("custom") == sValue ) m_eValue = insetmodeCustom;
				break;
			}

			return m_eValue;
		}

		virtual CString    ToString  () const 
		{
			switch(m_eValue)
			{
			case insetmodeAuto   : return _T("auto");			
			case insetmodeCustom : return _T("custom");			
			default              : return _T("auto");
			}
		}

		SimpleType_FromString     (EInsetMode)
		SimpleType_Operator_Equal (CInsetMode)
	};


	
	
	
	enum EOLEDrawAspect
	{
		oledrawaspectContent = 0,
		oledrawaspectIcon    = 1,
	};
	template<EOLEDrawAspect eDefValue = oledrawaspectIcon>
	class COLEDrawAspect : public CSimpleType<EOLEDrawAspect, eDefValue>
	{
	public:
		COLEDrawAspect() {}

		virtual EOLEDrawAspect FromString(CString &sValue)
		{
			if      (_T("Content")	== sValue)	m_eValue = oledrawaspectContent;
			else if (_T("Icon")		== sValue)	m_eValue = oledrawaspectIcon;
			else								m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString        ToString() const
		{
			switch (m_eValue)
			{
			case oledrawaspectContent	: return _T("Content");
			case oledrawaspectIcon		: return _T("Icon");
			default						: return _T("Content");
			}
		}

		SimpleType_FromString		(EOLEDrawAspect);
		SimpleType_Operator_Equal	(COLEDrawAspect);
	};

	
	
	
	enum EOLELinkType
	{
		olelinktypeBitmap  = 0,
		olelinktypeEmf     = 1,
		olelinktypeJpeg    = 2,
		olelinktypePicture = 3,
		olelinktypePng     = 4,
	};

	template<EOLELinkType eDefValue = olelinktypeBitmap>
	class COLELinkType : public CSimpleType<EOLELinkType, eDefValue>
	{
	public:
		COLELinkType() {}

		virtual EOLELinkType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'B':
				if      ( _T("Bitmap")           == sValue ) m_eValue = olelinktypeBitmap;
				break;
			case 'E':
				if      ( _T("EnhancedMetaFile") == sValue ) m_eValue = olelinktypeEmf;
				break;
			case 'J':
				if      ( _T("Jpeg")             == sValue ) m_eValue = olelinktypeJpeg;
				break;
			case 'P':
				if      ( _T("Picture")          == sValue ) m_eValue = olelinktypePicture;
				else if ( _T("Png")              == sValue ) m_eValue = olelinktypePng;
				break;
			}

			return m_eValue;
		}

		virtual CString      ToString  () const 
		{
			switch(m_eValue)
			{
			case olelinktypeBitmap:  return _T("Bitmap");			
			case olelinktypeEmf:     return _T("EnhancedMetaFile");			
			case olelinktypeJpeg:    return _T("Jpeg");			
			case olelinktypePicture: return _T("Picture");			
			case olelinktypePng:     return _T("Png");			
			default :                return _T("Bitmap");
			}
		}

		SimpleType_FromString     (EOLELinkType)
		SimpleType_Operator_Equal (COLELinkType)
	};


	
	
	
	enum EOLEType
	{
		oletypeEmbed = 0,
		oletypeLink  = 1,
	};
	template<EOLEType eDefValue = oletypeEmbed>
	class COLEType : public CSimpleType<EOLEType, eDefValue>
	{
	public:
		COLEType() {}

		virtual EOLEType FromString(CString &sValue)
		{
			if      (_T("embed")	== sValue)	m_eValue = oletypeEmbed;
			else if (_T("link")		== sValue)	m_eValue = oletypeLink;
			else								m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString  ToString() const
		{
			switch (m_eValue)
			{
			case oletypeEmbed	: return _T("embed");
			case oletypeLink	: return _T("link");
			default				: return _T("embed");
			}
		}

		SimpleType_FromString		(EOLEType);
		SimpleType_Operator_Equal	(COLEType);
	};
	
	
	
	enum EOLEUpdateMode
	{
		oleupdatemodeAlways = 0,
		oleupdatemodeOnCall = 1,
	};
	template<EOLEUpdateMode eDefValue = oleupdatemodeAlways>
	class COLEUpdateMode : public CSimpleType<EOLEUpdateMode, eDefValue>
	{
	public:
		COLEUpdateMode() {}

		virtual EOLEUpdateMode FromString(CString &sValue)
		{
			if      (_T("Always")	== sValue)	m_eValue = oleupdatemodeAlways;
			else if (_T("OnCall")	== sValue)	m_eValue = oleupdatemodeOnCall;
			else								m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString        ToString() const
		{
			switch (m_eValue)
			{
			case oleupdatemodeAlways : return _T("Always");
			case oleupdatemodeOnCall : return _T("OnCall");
			default				     : return _T("Always");
			}
		}

		SimpleType_FromString		(EOLEUpdateMode);
		SimpleType_Operator_Equal	(COLEUpdateMode);
	};
	
	
	
	enum ERType
	{
		rtypeAlign     = 0,
		rtypeArc       = 1,
		rtypeCallout   = 2,
		rtypeConnector = 3,
	};

	template<ERType eDefValue = rtypeAlign>
	class CRType : public CSimpleType<ERType, eDefValue>
	{
	public:
		CRType() {}

		virtual ERType  FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("align")     == sValue ) m_eValue = rtypeAlign;
				else if ( _T("arc")       == sValue ) m_eValue = rtypeArc;
				break;
			case 'c':
				if      ( _T("callout")   == sValue ) m_eValue = rtypeCallout;
				else if ( _T("connector") == sValue ) m_eValue = rtypeConnector;
				break;
			}

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case rtypeAlign    : return _T("align");			
			case rtypeArc      : return _T("arc");			
			case rtypeCallout  : return _T("callout");			
			case rtypeConnector: return _T("connector");			
			default            : return _T("align");
			}
		}

		SimpleType_FromString     (ERType)
		SimpleType_Operator_Equal (CRType)
	};


	
	
	
	enum EScreenSize
	{
		screensize1024x768 = 0,
		screensize1152x862 = 1,
		screensize544x376  = 2,
		screensize640x480  = 3,
		screensize720x512  = 4,
		screensize800x600  = 5,
	};

	template<EScreenSize eDefValue = screensize640x480>
	class CScreenSize : public CSimpleType<EScreenSize, eDefValue>
	{
	public:
		CScreenSize() {}
		virtual EScreenSize FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case '1':
				if      ( _T("1024,768")  == sValue ) m_eValue = screensize1024x768;
				else if ( _T("1152,862")  == sValue ) m_eValue = screensize1152x862;
				break;
			case '5':
				if      ( _T("544,376")   == sValue ) m_eValue = screensize544x376;
				break;
			case '6':
				if      ( _T("640,480")   == sValue ) m_eValue = screensize640x480;
				break;
			case '7':
				if      ( _T("720,512")   == sValue ) m_eValue = screensize720x512;
				break;
			case '8':
				if      ( _T("800,600")   == sValue ) m_eValue = screensize800x600;
				break;
			}

			return m_eValue;
		}

		virtual CString     ToString  () const 
		{
			switch(m_eValue)
			{
			case screensize1024x768: return _T("1024,768");			
			case screensize1152x862: return _T("1152,862");			
			case screensize544x376 : return _T("544,376");			
			case screensize640x480 : return _T("640,480");			
			case screensize720x512 : return _T("720,512");			
			case screensize800x600 : return _T("800,600");			
			default                : return _T("640,480");
			}
		}

		SimpleType_FromString     (EScreenSize)
		SimpleType_Operator_Equal (CScreenSize)
	};


} 


namespace SimpleTypes
{
	
	
	
	enum EBorderShadow
	{
		bordershadowFalse = 0,
		bordershadowTrue  = 1,
	};

	template<EBorderShadow eDefValue = bordershadowFalse>
	class CBorderShadow : public CSimpleType<EBorderShadow, eDefValue>
	{
	public:
		CBorderShadow() {}

		virtual EBorderShadow FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'f':
				if      ( _T("f") == sValue || _T("false") == sValue ) m_eValue = bordershadowFalse;
				break;
			case 't':
				if      ( _T("t") == sValue || _T("true") == sValue  ) m_eValue = bordershadowTrue;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case bordershadowTrue:  return _T("t");			
			case bordershadowFalse: return _T("f");			
			default :               return _T("f");
			}
		}

		SimpleType_FromString     (EBorderShadow)
		SimpleType_Operator_Equal (CBorderShadow)
	};


	
	
	
	enum EBorderType
	{
		bordertypeDash = 0, 
		bordertypeDashDotDot, 
		bordertypeDashDotStroked, 
		bordertypeDashedSmall, 
		bordertypeDot, 
		bordertypeDotDash, 
		bordertypeDouble, 
		bordertypeDoubleWave, 
		bordertypeHairline, 
		bordertypeHTMLInset, 
		bordertypeHTMLOutset, 
		bordertypeNone, 
		bordertypeSingle, 
		bordertypeThick, 
		bordertypeThickBetweenThin, 
		bordertypeThickBetweenThinLarge, 
		bordertypeThickBetweenThinSmall, 
		bordertypeThickThin, 
		bordertypeThickThinLarge, 
		bordertypeThickThinSmall, 
		bordertypeThinThick, 
		bordertypeThinThickLarge, 
		bordertypeThinThickSmall, 
		bordertypeThreeDEmboss, 
		bordertypeThreeDEngrave, 
		bordertypeTriple, 
		bordertypeWave, 
	};

	template<EBorderType eDefValue = bordertypeNone>
	class CBorderType : public CSimpleType<EBorderType, eDefValue>
	{
	public:
		CBorderType() {}

		virtual EBorderType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'd':
				if      ( _T("dash")           == sValue ) m_eValue = bordertypeDash;
				else if ( _T("dashDotDot")     == sValue ) m_eValue = bordertypeDashDotDot;
				else if ( _T("dashDotStroked") == sValue ) m_eValue = bordertypeDashDotStroked;
				else if ( _T("dashedSmall")    == sValue ) m_eValue = bordertypeDashedSmall;
				else if ( _T("dot")            == sValue ) m_eValue = bordertypeDot;
				else if ( _T("dotDash")        == sValue ) m_eValue = bordertypeDotDash;
				else if ( _T("double")         == sValue ) m_eValue = bordertypeDouble;
				else if ( _T("doubleWave")     == sValue ) m_eValue = bordertypeDoubleWave;
				break;
			case 'h':
				if      ( _T("hairline")      == sValue ) m_eValue = bordertypeHairline;
				break;

			case 'H':
				if      ( _T("HTMLInset")     == sValue ) m_eValue = bordertypeHTMLInset;
				else if ( _T("HTMLOutset")    == sValue ) m_eValue = bordertypeHTMLOutset;
				break;

			case 'n':
				if      ( _T("none")          == sValue ) m_eValue = bordertypeNone;
				break;

			case 's':
				if      ( _T("single")        == sValue ) m_eValue = bordertypeSingle;
				break;

			case 't':
				if      ( _T("thick")                 == sValue ) m_eValue = bordertypeThick;
				else if ( _T("thickBetweenThin")      == sValue ) m_eValue = bordertypeThickBetweenThin;
				else if ( _T("thickBetweenThinLarge") == sValue ) m_eValue = bordertypeThickBetweenThinLarge;
				else if ( _T("thickBetweenThinSmall") == sValue ) m_eValue = bordertypeThickBetweenThinSmall;
				else if ( _T("thickThin")             == sValue ) m_eValue = bordertypeThickThin;
				else if ( _T("thickThinLarge")        == sValue ) m_eValue = bordertypeThickThinLarge;
				else if ( _T("thickThinSmall")        == sValue ) m_eValue = bordertypeThickThinSmall;
				else if ( _T("thinThick")             == sValue ) m_eValue = bordertypeThinThick;
				else if ( _T("thinThickLarge")        == sValue ) m_eValue = bordertypeThinThickLarge;
				else if ( _T("thinThickSmall")        == sValue ) m_eValue = bordertypeThinThickSmall;
				else if ( _T("threeDEmboss")          == sValue ) m_eValue = bordertypeThreeDEmboss;
				else if ( _T("threeDEngrave")         == sValue ) m_eValue = bordertypeThreeDEngrave;
				else if ( _T("triple")                == sValue ) m_eValue = bordertypeTriple;
				break;

			case 'w':
				if      ( _T("wave")                  == sValue ) m_eValue = bordertypeWave;
				break;
			}

			return m_eValue;
		}

		virtual CString     ToString  () const 
		{
			switch(m_eValue)
			{
			case bordertypeDash:                  return _T("dash");			
			case bordertypeDashDotDot:            return _T("dashDotDot");			
			case bordertypeDashDotStroked:        return _T("dashDotStroked");			
			case bordertypeDashedSmall:           return _T("dashedSmall");			
			case bordertypeDot:                   return _T("dot");			
			case bordertypeDotDash:               return _T("dotDash");			
			case bordertypeDouble:                return _T("double");			
			case bordertypeDoubleWave:            return _T("doubleWave");			
			case bordertypeHairline:              return _T("hairline");			
			case bordertypeHTMLInset:             return _T("HTMLInset");			
			case bordertypeHTMLOutset:            return _T("HTMLOutset");			
			case bordertypeNone:                  return _T("none");			
			case bordertypeSingle:                return _T("single");	
			case bordertypeThick:                 return _T("thick");
			case bordertypeThickBetweenThin:      return _T("thickBetweenThin");
			case bordertypeThickBetweenThinLarge: return _T("thickBetweenThinLarge");
			case bordertypeThickBetweenThinSmall: return _T("thickBetweenThinSmall");
			case bordertypeThickThin:             return _T("thickThin");
			case bordertypeThickThinLarge:        return _T("thickThinLarge");
			case bordertypeThickThinSmall:        return _T("thickThinSmall");
			case bordertypeThinThick:             return _T("thinThick");
			case bordertypeThinThickLarge:        return _T("thinThickLarge");
			case bordertypeThinThickSmall:        return _T("thinThickSmall");
			case bordertypeThreeDEmboss:          return _T("threeDEmboss");
			case bordertypeThreeDEngrave:         return _T("threeDEngrave");
			case bordertypeTriple:                return _T("triple");
			case bordertypeWave:                  return _T("wave");
			default :                             return _T("none");
			}
		}

		SimpleType_FromString     (EBorderType)
		SimpleType_Operator_Equal (CBorderType)
	};


	
	
	
	enum EHorizontalAnchor
	{
		horizontalanchorChar   = 0,
		horizontalanchorMargin = 1,
		horizontalanchorPage   = 2,
		horizontalanchorText   = 3,
	};

	template<EHorizontalAnchor eDefValue = horizontalanchorChar>
	class CHorizontalAnchor : public CSimpleType<EHorizontalAnchor, eDefValue>
	{
	public:
		CHorizontalAnchor() {}

		virtual EHorizontalAnchor FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("char")   == sValue ) m_eValue = horizontalanchorChar;
				break;
			case 'm':
				if      ( _T("margin") == sValue ) m_eValue = horizontalanchorMargin;
				break;

			case 'p':
				if      ( _T("page")   == sValue ) m_eValue = horizontalanchorPage;
				break;

			case 't':
				if      ( _T("text")   == sValue ) m_eValue = horizontalanchorText;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case horizontalanchorChar:   return _T("char");			
			case horizontalanchorMargin: return _T("margin");			
			case horizontalanchorPage:   return _T("page");			
			case horizontalanchorText:   return _T("text");					
			default :                    return _T("char");
			}
		}

		SimpleType_FromString     (EHorizontalAnchor)
		SimpleType_Operator_Equal (CHorizontalAnchor)
	};


	
	
	
	enum EVerticalAnchor
	{
		verticalanchorLine   = 0,
		verticalanchorMargin = 1,
		verticalanchorPage   = 2,
		verticalanchorText   = 3,
	};

	template<EVerticalAnchor eDefValue = verticalanchorLine>
	class CVerticalAnchor : public CSimpleType<EVerticalAnchor, eDefValue>
	{
	public:
		CVerticalAnchor() {}

		virtual EVerticalAnchor FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'l':
				if      ( _T("line")   == sValue ) m_eValue = verticalanchorLine;
				break;
			case 'm':
				if      ( _T("margin") == sValue ) m_eValue = verticalanchorMargin;
				break;

			case 'p':
				if      ( _T("page")   == sValue ) m_eValue = verticalanchorPage;
				break;

			case 't':
				if      ( _T("text")   == sValue ) m_eValue = verticalanchorText;
				break;
			}

			return m_eValue;
		}

		virtual CString         ToString  () const 
		{
			switch(m_eValue)
			{
			case verticalanchorLine:   return _T("line");			
			case verticalanchorMargin: return _T("margin");			
			case verticalanchorPage:   return _T("page");			
			case verticalanchorText:   return _T("text");					
			default :                  return _T("line");
			}
		}

		SimpleType_FromString     (EVerticalAnchor)
		SimpleType_Operator_Equal (CVerticalAnchor)
	};


	
	
	
	enum EWrapSide
	{
		wrapsideBoth    = 0,
		wrapsideLargest = 1,
		wrapsideLeft    = 2,
		wrapsideRight   = 3,
	};

	template<EWrapSide eDefValue = wrapsideBoth>
	class CWrapSide : public CSimpleType<EWrapSide, eDefValue>
	{
	public:
		CWrapSide() {}

		virtual EWrapSide FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("both")    == sValue ) m_eValue = wrapsideBoth;
				break;
			case 'l':
				if      ( _T("largest") == sValue ) m_eValue = wrapsideLargest;
				else if ( _T("left")    == sValue ) m_eValue = wrapsideLeft;
				break;

			case 'r':
				if      ( _T("right")   == sValue ) m_eValue = wrapsideRight;
				break;

			}

			return m_eValue;
		}

		virtual CString   ToString  () const 
		{
			switch(m_eValue)
			{
			case wrapsideBoth:    return _T("both");			
			case wrapsideLargest: return _T("largest");			
			case wrapsideLeft:    return _T("left");			
			case wrapsideRight:   return _T("right");					
			default :             return _T("both");
			}
		}

		SimpleType_FromString     (EWrapSide)
		SimpleType_Operator_Equal (CWrapSide)
	};


	
	
	
	enum EWrapType
	{
		wraptypeNone         = 0,
		wraptypeSquare       = 1,
		wraptypeThrough      = 2,
		wraptypeTight        = 3,
		wraptypeTopAndBottom = 4,
	};

	template<EWrapType eDefValue = wraptypeNone>
	class CWrapType : public CSimpleType<EWrapType, eDefValue>
	{
	public:
		CWrapType() {}

		virtual EWrapType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'n':
				if      ( _T("none")         == sValue ) m_eValue = wraptypeNone;
				break;
			case 's':
				if      ( _T("square")       == sValue ) m_eValue = wraptypeSquare;
				break;

			case 't':  
				if      ( _T("through")      == sValue ) m_eValue = wraptypeThrough;
				else if ( _T("tight")        == sValue ) m_eValue = wraptypeTight;
				else if ( _T("topAndBottom") == sValue ) m_eValue = wraptypeTopAndBottom;
				break;

			}

			return m_eValue;
		}

		virtual CString   ToString  () const 
		{
			switch(m_eValue)
			{
			case wraptypeNone:         return _T("none");			
			case wraptypeSquare:       return _T("square");			
			case wraptypeThrough:      return _T("through");			
			case wraptypeTight:        return _T("tight");					
			case wraptypeTopAndBottom: return _T("topAndBottom");					
			default :                  return _T("none");
			}
		}

		SimpleType_FromString     (EWrapType)
		SimpleType_Operator_Equal (CWrapType)
	};


} 


namespace SimpleTypes
{
	namespace Vml
	{
		enum EVmlClientDataObjectType
		{
			vmlclientdataobjecttypeButton      = 0,
			vmlclientdataobjecttypeCheckbox      = 1,
			vmlclientdataobjecttypeDialog      = 2,
			vmlclientdataobjecttypeDrop      = 3,
			vmlclientdataobjecttypeEdit      = 4,
			vmlclientdataobjecttypeGBox      = 5,
			vmlclientdataobjecttypeGroup      = 6,
			vmlclientdataobjecttypeLabel      = 7,
			vmlclientdataobjecttypeLineA      = 8,
			vmlclientdataobjecttypeList      = 9,
			vmlclientdataobjecttypeMovie      = 10,
			vmlclientdataobjecttypeNote      = 11,
			vmlclientdataobjecttypePict      = 12,
			vmlclientdataobjecttypeRadio      = 13,
			vmlclientdataobjecttypeRect      = 14,
			vmlclientdataobjecttypeRectA      = 15,
			vmlclientdataobjecttypeScroll      = 16,
			vmlclientdataobjecttypeShape      = 17,
			vmlclientdataobjecttypeSpin      = 18
		};
		template<EVmlClientDataObjectType eDefValue = vmlclientdataobjecttypeButton>
		class CVmlClientDataObjectType : public CSimpleType<EVmlClientDataObjectType, eDefValue>
		{
		public:
			CVmlClientDataObjectType() {}

			virtual EVmlClientDataObjectType FromString(CString &sValue)
			{
				m_eValue = eDefValue;

				if ( sValue.GetLength() <= 0 )
					return m_eValue;

				if      ( _T("Button") == sValue ) m_eValue = vmlclientdataobjecttypeButton;
				else if ( _T("Checkbox") == sValue ) m_eValue = vmlclientdataobjecttypeCheckbox;
				else if ( _T("Dialog") == sValue ) m_eValue = vmlclientdataobjecttypeDialog;
				else if ( _T("Drop") == sValue ) m_eValue = vmlclientdataobjecttypeDrop;
				else if ( _T("Edit") == sValue ) m_eValue = vmlclientdataobjecttypeEdit;
				else if ( _T("GBox") == sValue ) m_eValue = vmlclientdataobjecttypeGBox;
				else if ( _T("Group") == sValue ) m_eValue = vmlclientdataobjecttypeGroup;
				else if ( _T("Label") == sValue ) m_eValue = vmlclientdataobjecttypeLabel;
				else if ( _T("LineA") == sValue ) m_eValue = vmlclientdataobjecttypeLineA;
				else if ( _T("List") == sValue ) m_eValue = vmlclientdataobjecttypeList;
				else if ( _T("Movie") == sValue ) m_eValue = vmlclientdataobjecttypeMovie;
				else if ( _T("Note") == sValue ) m_eValue = vmlclientdataobjecttypeNote;
				else if ( _T("Pict") == sValue ) m_eValue = vmlclientdataobjecttypePict;
				else if ( _T("Radio") == sValue ) m_eValue = vmlclientdataobjecttypeRadio;
				else if ( _T("Rect") == sValue ) m_eValue = vmlclientdataobjecttypeRect;
				else if ( _T("RectA") == sValue ) m_eValue = vmlclientdataobjecttypeRectA;
				else if ( _T("Scroll") == sValue ) m_eValue = vmlclientdataobjecttypeScroll;
				else if ( _T("Shape") == sValue ) m_eValue = vmlclientdataobjecttypeShape;
				else if ( _T("Spin") == sValue ) m_eValue = vmlclientdataobjecttypeSpin;
				return m_eValue;
			}

			virtual CString         ToString  () const 
			{
				switch(m_eValue)
				{
				case vmlclientdataobjecttypeButton:      return _T("Button");
				case vmlclientdataobjecttypeCheckbox:      return _T("Checkbox");
				case vmlclientdataobjecttypeDialog:      return _T("Dialog");
				case vmlclientdataobjecttypeDrop:      return _T("Drop");
				case vmlclientdataobjecttypeEdit:      return _T("Edit");
				case vmlclientdataobjecttypeGBox:      return _T("GBox");
				case vmlclientdataobjecttypeGroup:      return _T("Group");
				case vmlclientdataobjecttypeLabel:      return _T("Label");
				case vmlclientdataobjecttypeLineA:      return _T("LineA");
				case vmlclientdataobjecttypeList:      return _T("List");
				case vmlclientdataobjecttypeMovie:      return _T("Movie");
				case vmlclientdataobjecttypeNote:      return _T("Note");
				case vmlclientdataobjecttypePict:      return _T("Pict");
				case vmlclientdataobjecttypeRadio:      return _T("Radio");
				case vmlclientdataobjecttypeRect:      return _T("Rect");
				case vmlclientdataobjecttypeRectA:      return _T("RectA");
				case vmlclientdataobjecttypeScroll:      return _T("Scroll");
				case vmlclientdataobjecttypeShape:      return _T("Shape");
				case vmlclientdataobjecttypeSpin:      return _T("Spin");
				default :                          return _T("Button");
				}
			}

			SimpleType_FromString     (EVmlClientDataObjectType)
				SimpleType_Operator_Equal (CVmlClientDataObjectType)
		};
		
		
		
		enum EVmlCalloutType
		{
			vmlcallouttypeRectangle      = 0,
			vmlcallouttypeRoundRectangle = 1,
			vmlcallouttypeOval           = 2,
			vmlcallouttypeCloud          = 3,
		};

		template<EVmlCalloutType eDefValue = vmlcallouttypeRectangle>
		class CVmlCalloutType : public CSimpleType<EVmlCalloutType, eDefValue>
		{
		public:
			CVmlCalloutType() {}

			virtual EVmlCalloutType FromString(CString &sValue)
			{
				m_eValue = eDefValue;

				if ( sValue.GetLength() <= 0 )
					return m_eValue;

				wchar_t wChar = sValue.GetAt(0);
				switch ( wChar )
				{
				case 'r':
					if      ( _T("rectangle")        == sValue ) m_eValue = vmlcallouttypeRectangle;
					else if ( _T("roundedrectangle") == sValue ) m_eValue = vmlcallouttypeRoundRectangle;
					break;
				case 'o':
					if      ( _T("oval")             == sValue ) m_eValue = vmlcallouttypeOval;
					break;
				case 'c':
					if      ( _T("cloud")            == sValue ) m_eValue = vmlcallouttypeCloud;
					break;
				}

				return m_eValue;
			}

			virtual CString         ToString  () const 
			{
				switch(m_eValue)
				{
				case vmlcallouttypeRectangle:      return _T("rectangle");			
				case vmlcallouttypeRoundRectangle: return _T("roundedrectangle");			
				case vmlcallouttypeOval:           return _T("oval");			
				case vmlcallouttypeCloud:          return _T("cloud");					
				default :                          return _T("rectangle");
				}
			}

			SimpleType_FromString     (EVmlCalloutType)
				SimpleType_Operator_Equal (CVmlCalloutType)
		};

		
		
		
		class CVmlPath
		{
		public:
			CVmlPath() {}

			CString GetValue() const
			{
				return m_sValue;
			}

			void    SetValue(CString &sValue)
			{
				m_sValue = sValue;
			}


			CString FromString(CString &sValue)
			{
				
				m_sValue = sValue;

				return m_sValue;
			}

			CString ToString  () const 
			{
				return m_sValue;
			}

			SimpleType_FromString2    (CString)
			SimpleType_Operator_Equal (CVmlPath)

		private:

			CString m_sValue;
		};

		
		
		
		enum EVmlDashStyle
		{
			vmldashstyleSolid           = 0,
			vmldashstyleShortDash       = 1,
			vmldashstyleShortDot        = 2,
			vmldashstyleShortDashDot    = 3,
			vmldashstyleShortDashDotDot = 4,
			vmldashstyleDot             = 5,
			vmldashstyleDash            = 6,
			vmldashstyleLongDash        = 7,
			vmldashstyleDashDot         = 8,
			vmldashstyleLongDashDot     = 9,
			vmldashstyleLongDashDotDot  = 10,
			vmldashstyleCustom          = 11,
		};

		template<EVmlDashStyle eDefValue = vmldashstyleSolid>
		class CVmlDashStyle : public CSimpleType<EVmlDashStyle, eDefValue>
		{
		public:
			CVmlDashStyle() 
			{
				m_nCount    = 0;
			}
			virtual ~CVmlDashStyle()
			{
			}

			virtual EVmlDashStyle FromString(CString &sValue)
			{
				m_nCount    = 0;

				m_eValue = eDefValue;

				if ( sValue.GetLength() <= 0 )
					return m_eValue;

				wchar_t wChar = sValue.GetAt(0);
				switch ( wChar )
				{
				case 's':
					if      ( _T("solid")           == sValue ) m_eValue = vmldashstyleSolid;
					else if ( _T("shortdash")       == sValue ) m_eValue = vmldashstyleShortDash;
					else if ( _T("shortdot")        == sValue ) m_eValue = vmldashstyleShortDot;
					else if ( _T("shortdashdot")    == sValue ) m_eValue = vmldashstyleShortDashDot;
					else if ( _T("shortdashdotdot") == sValue ) m_eValue = vmldashstyleShortDashDotDot;
					break;
				case 'd':
					if      ( _T("dot")             == sValue ) m_eValue = vmldashstyleDot;
					else if ( _T("dash")            == sValue ) m_eValue = vmldashstyleDash;
					else if ( _T("dashdot")         == sValue ) m_eValue = vmldashstyleDashDot;
					break;
				case 'l':
					if      ( _T("longdash")        == sValue ) m_eValue = vmldashstyleLongDash;
					else if ( _T("longdashdot")     == sValue ) m_eValue = vmldashstyleLongDashDot;
					else if ( _T("longdashdotdot")  == sValue ) m_eValue = vmldashstyleLongDashDotDot;
					break;

				default:
					{
						m_eValue = vmldashstyleCustom;

						CString sTemp = sValue;
						for ( int nIndex = 0; nIndex < sValue.GetLength(); nIndex++ )
						{
							int nChar = sValue.GetAt( nIndex );
							if ( ' ' == nChar )
								continue;

							int nEndPos = sValue.Find( _T(" "), nIndex );
							if ( -1 == nEndPos )
								nEndPos = sValue.GetLength();

							int nLen = nEndPos - nIndex;

							if ( nLen <= 0 )
								continue;

							CString sTemp = sValue.Mid( nIndex, nLen );
							double dVal = _wtof( sTemp.GetBuffer() );

							if ( m_nCount >= 32 )
								break;

							m_arrValues[m_nCount++] = dVal;
						}
					}
				}

				return m_eValue;
			}

			virtual CString       ToString  () const 
			{
				switch(m_eValue)
				{
				case vmldashstyleSolid          :  return _T("solid");
				case vmldashstyleShortDash      :  return _T("shortdash");
				case vmldashstyleShortDot       :  return _T("shortdot");
				case vmldashstyleShortDashDot   :  return _T("shortdashdot");
				case vmldashstyleShortDashDotDot:  return _T("shortdashdotdot");
				case vmldashstyleDot            :  return _T("dot");
				case vmldashstyleDash           :  return _T("dash");
				case vmldashstyleLongDash       :  return _T("longdash");
				case vmldashstyleDashDot        :  return _T("dashdot");
				case vmldashstyleLongDashDot    :  return _T("longdashdot");
				case vmldashstyleLongDashDotDot :  return _T("longdashdotdot");
				case vmldashstyleCustom         :
					{
						CString sResult;

						for (int nIndex = 0; nIndex < m_nCount; nIndex++)
						{
							sResult += XmlUtils::DoubleToString( m_arrValues[nIndex] );
							sResult += _T(" ");
						}
						return sResult;
					}
				default: return _T("solid");
				}
			}

			SimpleType_FromString     (EVmlDashStyle)
				SimpleType_Operator_Equal (CVmlDashStyle)

		private:

			double  m_arrValues[32];
			int     m_nCount;

		};


		
		
		
		class CVml_1_65536
		{
		public:
			CVml_1_65536() 
			{
				m_dValue = 0;
			}

			double GetValue() const
			{
				return m_dValue;
			}

			void   SetValue(double dValue)
			{
				m_dValue = max( 0, min( 1, dValue) );
			}

			void   SetValue(int nValue)
			{
				m_dValue = max( 0, min( 65536, nValue) ) / 65536.0;
			}

			virtual double FromString(CString &sValue)
			{
				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				bool bFraction = ( 'f' == sValue.GetAt( nLen - 1 ) );

				if ( bFraction )
				{
					int nValue = _wtoi( sValue.Mid( 0, nLen - 1 ) );
					SetValue( nValue );
				}
				else
				{
					double dValue = _wtof( sValue );
					SetValue( dValue );
				}

				return m_dValue;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f"), m_dValue );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_1_65536)

		private:

			double m_dValue;
		};
		
		
		
		class CVml_Vector3D_65536
		{
		public:
			CVml_Vector3D_65536() 
			{
				m_nX = 0;
				m_nY = 0;
				m_nZ = 0;
			}

			double GetX() const
			{
				return (double)(m_nX / 65536.0);
			}
			double GetY() const
			{
				return (double)(m_nY / 65536.0);
			}
			double GetZ() const
			{
				return (double)(m_nZ / 65536.0);
			}

			void   SetValue(int nX, int nY, int nZ)
			{
				m_nX = nX;
				m_nX = nY;
				m_nX = nZ;
			}

			void   SetValue(double dX, double dY, double dZ)
			{
				m_nX = (int)(dX * 65536);
				m_nX = (int)(dY * 65536);
				m_nX = (int)(dZ * 65536);
			}

			virtual double FromString(CString &sValue)
			{
				m_nX = 0;
				m_nY = 0;
				m_nZ = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				m_nX = _wtoi( sValue.Mid( 0, nPos ) );

				int nPos2 = sValue.Find( _T(","), nPos + 1 );
				if ( -1 == nPos2 )
					return 0;

				m_nY = _wtoi( sValue.Mid( nPos + 1, nPos2 - nPos - 1) );

				m_nZ = _wtoi( sValue.Mid( nPos2 + 1, nLen - nPos2 - 1 ) );

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%d,%d,%d"), m_nX, m_nY, m_nZ );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector3D_65536)

		private:

			int m_nX;
			int m_nY;
			int m_nZ;
		};
		
		
		
		class CVml_Vector3D
		{
		public:
			CVml_Vector3D() 
			{
				m_nX = 0;
				m_nY = 0;
				m_nZ = 0;
			}

			int GetX() const
			{
				return m_nX;
			}
			int GetY() const
			{
				return m_nY;
			}
			int GetZ() const
			{
				return m_nZ;
			}

			void   SetValue(int nX, int nY, int nZ)
			{
				m_nX = nX;
				m_nX = nY;
				m_nX = nZ;
			}

			virtual double FromString(CString &sValue)
			{
				m_nX = 0;
				m_nY = 0;
				m_nZ = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				m_nX = _wtoi( sValue.Mid( 0, nPos ) );

				int nPos2 = sValue.Find( _T(","), nPos + 1 );
				if ( -1 == nPos2 )
					return 0;

				m_nY = _wtoi( sValue.Mid( nPos + 1, nPos2 - nPos - 1) );

				m_nZ = _wtoi( sValue.Mid( nPos2 + 1, nLen - nPos2 - 1 ) );

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%d,%d,%d"), m_nX, m_nY, m_nZ );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector3D)

		private:

			int m_nX;
			int m_nY;
			int m_nZ;
		};
		
		
		
		class CVml_Vector2D
		{
		public:
			CVml_Vector2D() 
			{
				m_nX = 0;
				m_nY = 0;
			}

			int GetX() const
			{
				return m_nX;
			}
			int GetY() const
			{
				return m_nY;
			}

			void   SetValue(int nX, int nY)
			{
				m_nX = nX;
				m_nX = nY;
			}

			virtual double FromString(CString &sValue)
			{
				m_nX = 0;
				m_nY = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				m_nX = _wtoi( sValue.Mid( 0, nPos ) );

				m_nY = _wtoi( sValue.Mid( nPos + 1, nLen - nPos - 1 ) );

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%d,%d"), m_nX, m_nY );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D)

		private:

			int m_nX;
			int m_nY;
		};
		
		
		
		class CVml_Vector2D_F
		{
		public:
			CVml_Vector2D_F() 
			{
				m_dX = 0;
				m_dY = 0;
			}

			double GetX() const
			{
				return m_dX;
			}
			double GetY() const
			{
				return m_dY;
			}

			void   SetValue(double dX, double dY)
			{
				m_dX = dX;
				m_dX = dY;
			}

			virtual double FromString(CString &sValue)
			{
				m_dX = 0;
				m_dY = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				m_dX = _wtof( sValue.Mid( 0, nPos ) );

				m_dY = _wtof( sValue.Mid( nPos + 1, nLen - nPos - 1 ) );

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f,%f"), m_dX, m_dY );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D_F)

		private:

			double m_dX;
			double m_dY;
		};
		
		
		
		class CVml_Polygon2D
		{
		public:
			CVml_Polygon2D() 
			{
			}

			int GetX(int nIndex) const
			{
				if ( nIndex < 0 || nIndex >= m_arrPoints.GetSize()  )
					return 0;

				return m_arrPoints[nIndex].nX;
			}
			int GetY(int nIndex) const
			{
				if ( nIndex < 0 || nIndex >= m_arrPoints.GetSize()  )
					return 0;

				return m_arrPoints[nIndex].nY;
			}

			void   AddPoint(int nX, int nY)
			{
				TPoint oPt( nX, nY );
				m_arrPoints.Add( oPt );
			}

			virtual double FromString(CString &sValue)
			{
				m_arrPoints.RemoveAll();

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nStartPos = 0;
				while ( true )
				{
					int nMidPos = sValue.Find( _T(","), nStartPos );
					int nEndPos = sValue.Find( _T(","), nMidPos + 1 );

					if ( -1 == nMidPos )
						break;

					if ( -1 == nEndPos )
						nEndPos = nLen;

					int nX = _wtoi( sValue.Mid( nStartPos, nMidPos - nStartPos ) );
					int nY = _wtoi( sValue.Mid( nMidPos + 1, nEndPos - nMidPos - 1 ) );
					m_arrPoints.Add( TPoint( nX, nY ) );

					nStartPos = nEndPos + 1;
				}


				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;

				int nLen = m_arrPoints.GetSize();
				for ( int nIndex = 0; nIndex < nLen; nIndex++ )
				{
					CString sTemp;
					if ( nIndex < nLen - 1 )
						sTemp.Format( _T("%d,%d,"), m_arrPoints[nIndex].nX, m_arrPoints[nIndex].nY );
					else
						sTemp.Format( _T("%d,%d"), m_arrPoints[nIndex].nX, m_arrPoints[nIndex].nY );
					sResult += sTemp;
				}

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Polygon2D)

		private:

			struct TPoint
			{
				int nX;
				int nY;

				TPoint( int n_X, int n_Y )
				{
					nX = n_X;
					nY = n_Y;
				}
			};

			CSimpleArray<TPoint> m_arrPoints;
		};
		
		
		

		#define CSS_MAX_NAME_LEN 127
		static void RemoveWhiteSpaces(CString *psText)
		{
			psText->Remove( 0x01 ); psText->Remove( 0x10 );
			psText->Remove( 0x02 ); psText->Remove( 0x11 );
			psText->Remove( 0x03 ); psText->Remove( 0x12 );
			psText->Remove( 0x04 ); psText->Remove( 0x13 );
			psText->Remove( 0x05 ); psText->Remove( 0x14 );
			psText->Remove( 0x06 ); psText->Remove( 0x15 );
			psText->Remove( 0x07 ); psText->Remove( 0x16 );
			psText->Remove( 0x08 ); psText->Remove( 0x17 );
			psText->Remove( 0x09 ); psText->Remove( 0x18 );
			psText->Remove( 0x0a ); psText->Remove( 0x19 );
			psText->Remove( 0x0b ); psText->Remove( 0x1a );
			psText->Remove( 0x0c ); psText->Remove( 0x1b );
			psText->Remove( 0x0d ); psText->Remove( 0x1c );
			psText->Remove( 0x0e ); psText->Remove( 0x1d );
			psText->Remove( 0x0f ); psText->Remove( 0x1e );
			psText->Remove( 0x20 ); psText->Remove( 0x1f );
		}

		enum ECssPropertyType
		{
			cssptUnknown                        = 0000,

			cssptFlip                           = 1000,
			cssptHeight                         = 1001,
			cssptLeft                           = 1002,
			cssptMarginBottom                   = 1003,
			cssptMarginLeft                     = 1004,
			cssptMarginRight                    = 1005,
			cssptMarginTop                      = 1006,
			cssptMsoPositionHorizontal          = 1007,
			cssptMsoPositionHorizontalRelative  = 1008,
			cssptMsoPositionVertical            = 1009,
			cssptMsoPositionVerticalRelative    = 1010,
			cssptMsoWrapDistanceBottom          = 1011,
			cssptMsoWrapDistanceLeft            = 1012,
			cssptMsoWrapDistanceRight           = 1013,
			cssptMsoWrapDistanceTop             = 1014,
			cssptMsoWrapEdited                  = 1015,
			cssptMsoWrapStyle                   = 1016,
			cssptPosition                       = 1017,
			cssptRotation                       = 1018,
			cssptTop                            = 1019,
			cssptVisibility                     = 1020,
			cssptWidth                          = 1021,
			cssptZIndex                         = 1022,

			
			cssptDirection                      = 1100,
			cssptLayoutFlow                     = 1101,
			cssptMsoDirectionAlt                = 1102,
			cssptMsoFitShapeToText              = 1103,
			cssptMsoFitTextToShape              = 1104,
			cssptMsoLayoutFlowAlt               = 1105,
			cssptMsoNextTextbox                 = 1106,
			cssptMsoRotate                      = 1107,
			cssptMsoTextScale                   = 1108,
			cssptVTextAnchor                    = 1109,
			
			
			cssptFont                           = 1200,
			cssptFontFamily                     = 1201,
			cssptFontSize                       = 1202,
			cssptFontStyle                      = 1203,
			cssptFontVariant                    = 1204,
			cssptFontWeight                     = 1205,
			cssptMsoTextShadow                  = 1206,
			cssptTextDecoration                 = 1207,
			cssptVRotateLetters                 = 1208,
			cssptVSameLetterHeights             = 1209,
			cssptVTextAlign                     = 1210,
			cssptVTextKern                      = 1211,
			cssptVTextReverse                   = 1212,
			cssptVTextSpacingMode               = 1213,
			cssptVTextSpacing                   = 1214,
		};

		enum ECssFlip
		{
			cssflipX  = 0,
			cssflipY  = 1,
			cssflipXY = 2,
			cssflipYX = 3,
		};
		enum ECssUnitsType
		{
			cssunitstypeAuto  = 0,
			cssunitstypeUnits = 1,
			cssunitstypePerc  = 2,
		};
		struct TCssUnitsValue
		{
			ECssUnitsType eType;
			double        dValue; 
		};
		enum ECssMsoPosHor
		{
			cssmsoposhorAbsolute = 0,
			cssmsoposhorLeft     = 1,
			cssmsoposhorCenter   = 2,
			cssmsoposhorRight    = 3,
			cssmsoposhorInside   = 4,
			cssmsoposhorOutside  = 5,
		};
		enum ECssMsoPosHorRel
		{
			cssmsoposhorrelMargin = 0,
			cssmsoposhorrelPage   = 1,
			cssmsoposhorrelText   = 2,
			cssmsoposhorrelChar   = 3,
		};
		enum ECssMsoPosVer
		{
			cssmsoposverAbsolute = 0,
			cssmsoposverTop      = 1,
			cssmsoposverCenter   = 2,
			cssmsoposverBottom   = 3,
			cssmsoposverInside   = 4,
			cssmsoposverOutside  = 5,
		};
		enum ECssMsoPosVerRel
		{
			cssmsoposverrelMargin = 0,
			cssmsoposverrelPage   = 1,
			cssmsoposverrelText   = 2,
			cssmsoposverrelLine   = 3,
		};
		enum ECssMsoWrapStyle
		{
			cssmsowrapstyleSqaure = 0,
			cssmsowrapstyleNone   = 1,
		};
		enum ECssPosition
		{
			csspositionStatic   = 0,
			csspositionAbsolute = 1,
			csspositionRelative = 2,
		};
		enum ECssVisibility
		{
			cssvisibilityHidden  = 0,
			cssvisibilityInherit = 1,
		};
		enum ECssZIndexType
		{
			csszindextypeAuto  = 0,
			csszindextypeOrder = 1,
		};
		struct TCssZIndexValue
		{
			ECssZIndexType eType;
			int            nOrder;
		};
		enum ECssDirection
		{
			cssdirectionLTR = 0,
			cssdirectionRTL = 1,
		};
		enum ECssLayoutFlow
		{
			csslayoutflowHorizontal            = 0,
			csslayoutflowVertical              = 1,
			csslayoutflowVerticalIdeographic   = 2,
			csslayoutflowHorizontalIdeographic = 3,
		};
		enum ECssDirectionAlt
		{
			cssdirectionaltContext = 0,
		};
		enum ECssLayoutFlowAlt
		{
			csslayoutflowaltBottomToTop = 0,
		};

		enum ECssMsoRotate
		{
			cssmsorotate0   =   0,
			cssmsorotate90  =  90,
			cssmsorotate180 = 180,
			cssmsorotate270 = -90,
		};
		enum ECssVTextAnchor
		{
			cssvtextanchorTop                  = 0,
			cssvtextanchorMiddle               = 1,
			cssvtextanchorBottom               = 2,
			cssvtextanchorTopCenter            = 3,
			cssvtextanchorMiddleCenter         = 4,
			cssvtextanchorBottomCenter         = 5,
			cssvtextanchorTopBaseline          = 6,
			cssvtextanchorBottomBaseline       = 7,
			cssvtextanchorTopCenterBaseline    = 8,
			cssvtextanchorBottomCenterBaseline = 9,
		};
		enum ECssFontStyle
		{
			cssfontstyleNormal  = 0,
			cssfontstyleItalic  = 1,
			cssfontstyleOblique = 2,
		};
		enum ECssFontVarian
		{
			cssfontvariantNormal    = 0,
			cssfontvariantSmallCaps = 1,
		};
		enum ECssFontWeight
		{
			cssfontweightNormal  = 0,
			cssfontweightLighter = 1,
			cssfontweight100     = 100,
			cssfontweight200     = 200,
			cssfontweight300     = 300,
			cssfontweight400     = 400,
			cssfontweightBold    = 550,
			cssfontweightBolder  = 750,
			cssfontweight500     = 500,
			cssfontweight600     = 600,
			cssfontweight700     = 700,
			cssfontweight800     = 800,
			cssfontweight900     = 900
		};
		enum ECssTextDecoration
		{
			csstextdecorationNone        = 0,
			csstextdecorationUnderline   = 1,
			csstextdecorationOverline    = 2,
			csstextdecorationLineThrough = 3,
			csstextdecorationBlink       = 4,
		};
		enum ECssVTextAlign
		{
			cssvtextalignLeft           = 0,
			cssvtextalignRight          = 1,
			cssvtextalignCenter         = 2,
			cssvtextalignJustify        = 3,
			cssvtextalignLetterJustify  = 4,
			cssvtextalignStretchJustify = 5,
		};
		enum ECssVTextSpacingMode
		{
			cssvtextspacingmodeTightening = 0,
			cssvtextspacingmodeTracking   = 1
		};


		union UCssValue
		{
			ECssFlip             eFlip;
			TCssUnitsValue       oValue;
			ECssMsoPosHor        eMsoPosHor;
			ECssMsoPosHorRel     eMsoPosHorRel;
			ECssMsoPosVer        eMsoPosVer;
			ECssMsoPosVerRel     eMsoPosVerRel;
			double               dValue;
			bool                 bValue;
			ECssMsoWrapStyle     eMsoWrapStyle;
			ECssPosition         ePosition;
			ECssVisibility       eVisibility;
			TCssZIndexValue      oZIndex;
			ECssDirection        eDirection;
			ECssLayoutFlow       eLayoutFlow;
			ECssDirectionAlt     eDirectionAlt;
			ECssLayoutFlowAlt    eLayoutFlowAlt;
			wchar_t              wsValue[CSS_MAX_NAME_LEN + 1];
			ECssMsoRotate        eRotate;
			ECssVTextAnchor      eVTextAnchor;
			ECssFontStyle        eFontStyle;
			ECssFontVarian       eFontVariant;
			ECssFontWeight       eFontWeight;
			ECssTextDecoration   eTextDecoration;
			ECssVTextAlign       eVTextAlign;
			ECssVTextSpacingMode eVTextSpacingMode;
		};
		class CCssProperty
		{
		public:

			CCssProperty()
			{
				m_eType = cssptUnknown;
			}

			CCssProperty(CString sBuffer)
			{
				Parse(sBuffer);
			}
			~CCssProperty()
			{
			}


			const UCssValue &get_Value() const
			{
				return m_oValue;
			}

			const ECssPropertyType &get_Type() const
			{
				return m_eType;
			}

		private:

			void Parse(CString &sBuffer)
			{
				int nPos = sBuffer.Find( ':' );
				CString sValue;

				if ( -1 == nPos )
				{
					m_eType = cssptUnknown;
				}
				else
				{
					CString sProperty = sBuffer.Mid( 0, nPos );
					sValue = sBuffer.Mid( nPos + 1, sBuffer.GetLength() - (nPos + 1) );

					RemoveWhiteSpaces( &sProperty );

					if ( sProperty.GetLength() <= 2 )
					{
						m_eType = cssptUnknown;
						return;
					}

					
					int nChar1 = sProperty.GetAt( 0 );
					int nChar2 = sProperty.GetAt( 1 );

					switch( nChar1 )
					{
					case 'd':
						{
							if      ( _T("direction") == sProperty ) m_eType = cssptDirection;
							else                                       m_eType = cssptUnknown;

							break;
						}
					case 'f': 
						{
							switch( nChar2 )
							{
							case 'l':
								{
									if ( _T("flip") == sProperty ) m_eType = cssptFlip;
									else                             m_eType = cssptUnknown;

									break;
								}
							case 'o':
								{
									if      ( _T("font")         == sProperty ) m_eType = cssptFont;
									else if ( _T("font-family")  == sProperty ) m_eType = cssptFontFamily;
									else if ( _T("font-size")    == sProperty ) m_eType = cssptFontSize;
									else if ( _T("font-style")   == sProperty ) m_eType = cssptFontStyle;
									else if ( _T("font-variant") == sProperty ) m_eType = cssptFontVariant;
									else if ( _T("font-weight")  == sProperty ) m_eType = cssptFontWeight;
									else                                          m_eType = cssptUnknown;

									break;
								}
							default:
								{
									m_eType = cssptUnknown;
									break;
								}
							}
							break;
						}
					case 'h':
						{
							if      ( _T("height") == sProperty ) m_eType = cssptHeight;
							else                                    m_eType = cssptUnknown;

							break;
						}
					case 'l':
						{
							if      ( _T("layout-flow") == sProperty ) m_eType = cssptLayoutFlow;
							else if ( _T("left")       == sProperty ) m_eType = cssptLeft;
							else                                         m_eType = cssptUnknown;

							break;
						}		
					case 'm':
						{
							switch( nChar2 )
							{
							case 'a':
								{
									if      ( _T("margin-bottom") == sProperty ) m_eType = cssptMarginBottom;
									else if ( _T("margin-left")   == sProperty ) m_eType = cssptMarginLeft;
									else if ( _T("margin-right")  == sProperty ) m_eType = cssptMarginRight;
									else if ( _T("margin-top")    == sProperty ) m_eType = cssptMarginTop;
									else                                           m_eType = cssptUnknown;

									break;
								}
							case 's':
								{
									if      ( _T("mso-direction-alt")                == sProperty ) m_eType = cssptMsoDirectionAlt;
									else if ( _T("mso-fit-shape-to-text")            == sProperty ) m_eType = cssptMsoFitShapeToText;
									else if ( _T("mso-fit-text-to-shape")            == sProperty ) m_eType = cssptMsoFitTextToShape;
									else if ( _T("mso-layout-flow-alt")              == sProperty ) m_eType = cssptMsoLayoutFlowAlt;
									else if ( _T("mso-next-textbox")                 == sProperty ) m_eType = cssptMsoNextTextbox;
									else if ( _T("mso-position-horizontal")          == sProperty ) m_eType = cssptMsoPositionHorizontal;
									else if ( _T("mso-position-horizontal-relative") == sProperty ) m_eType = cssptMsoPositionHorizontalRelative;
									else if ( _T("mso-position-vertical")            == sProperty ) m_eType = cssptMsoPositionVertical;
									else if ( _T("mso-position-vertical-relative")   == sProperty ) m_eType = cssptMsoPositionVerticalRelative;
									else if ( _T("mso-rotate")                       == sProperty ) m_eType = cssptMsoRotate;
									else if ( _T("mso-text-scale")                   == sProperty ) m_eType = cssptMsoTextScale;
									else if ( _T("mso-text-shadow")                  == sProperty ) m_eType = cssptMsoTextShadow;
									else if ( _T("mso-wrap-distance-bottom")         == sProperty ) m_eType = cssptMsoWrapDistanceBottom;
									else if ( _T("mso-wrap-distance-left")           == sProperty ) m_eType = cssptMsoWrapDistanceLeft;
									else if ( _T("mso-wrap-distance-right")          == sProperty ) m_eType = cssptMsoWrapDistanceRight;
									else if ( _T("mso-wrap-distance-top")            == sProperty ) m_eType = cssptMsoWrapDistanceTop;
									else if ( _T("mso-wrap-edited")                  == sProperty ) m_eType = cssptMsoWrapEdited;
									else if ( _T("mso-wrap-style")                   == sProperty ) m_eType = cssptMsoWrapStyle;
									else                                                              m_eType = cssptUnknown;

									break;
								}
							default:
								{
									m_eType = cssptUnknown;
									break;
								}
							}
							break;
						}
					case 'p':
						{
							if      ( _T("position") == sProperty ) m_eType = cssptPosition;
							else                                      m_eType = cssptUnknown;

							break;
						}
					case 'r':
						{
							if      ( _T("rotation") == sProperty ) m_eType = cssptRotation;
							else                                      m_eType = cssptUnknown;

							break;
						}
					case 't':
						{
							if      ( _T("text-decoration") == sProperty ) m_eType = cssptTextDecoration;
							else if ( _T("top")             == sProperty ) m_eType = cssptTop;
							else							                 m_eType = cssptUnknown;

							break;
						}
					case 'v':
						{
							if      ( _T("visibility")            == sProperty ) m_eType = cssptVisibility;
							else if ( _T("v-rotate-letters ")     == sProperty ) m_eType = cssptVRotateLetters;
							else if ( _T("v-same-letter-heights") == sProperty ) m_eType = cssptVSameLetterHeights;
							else if ( _T("v-text-align")          == sProperty ) m_eType = cssptVTextAlign;
							else if ( _T("v-text-anchor")         == sProperty ) m_eType = cssptVTextAnchor;
							else if ( _T("v-text-kern")           == sProperty ) m_eType = cssptVTextKern;
							else if ( _T("v-text-reverse")        == sProperty ) m_eType = cssptVTextReverse;
							else if ( _T("v-text-spacing-mode")   == sProperty ) m_eType = cssptVTextSpacingMode;
							else if ( _T("v-text-spacing")        == sProperty ) m_eType = cssptVTextSpacing;
							else                                                 m_eType = cssptUnknown;

							break;
						}
					case 'w':
						{
							if ( _T("width")  == sProperty ) m_eType = cssptWidth;
							else                               m_eType = cssptUnknown;

							break;
						}
					case 'z':
						{
							if   ( _T("z-index") == sProperty ) m_eType = cssptZIndex;
							else                                  m_eType = cssptUnknown;

							break;
						}
					default:
						{
							m_eType = cssptUnknown; 
							break;
						}
					}
				}

				switch ( m_eType )
				{
				case cssptUnknown                        : ReadValue_Unknown( sValue ); break;

				case cssptFlip                           : ReadValue_Flip( sValue ); break;
				case cssptHeight                         : ReadValue_Units( sValue ); break;
				case cssptLeft                           : ReadValue_Units( sValue ); break;
				case cssptMarginBottom                   : ReadValue_Units( sValue ); break;
				case cssptMarginLeft                     : ReadValue_Units( sValue ); break;
				case cssptMarginRight                    : ReadValue_Units( sValue ); break;
				case cssptMarginTop                      : ReadValue_Units( sValue ); break;
				case cssptMsoPositionHorizontal          : ReadValue_MsoPosHor( sValue ); break;
				case cssptMsoPositionHorizontalRelative  : ReadValue_MsoPosHorRel( sValue ); break;
				case cssptMsoPositionVertical            : ReadValue_MsoPosVer( sValue ); break;
				case cssptMsoPositionVerticalRelative    : ReadValue_MsoPosVerRel( sValue ); break;
				case cssptMsoWrapDistanceBottom          : ReadValue_Double( sValue ); break;
				case cssptMsoWrapDistanceLeft            : ReadValue_Double( sValue ); break;
				case cssptMsoWrapDistanceRight           : ReadValue_Double( sValue ); break;
				case cssptMsoWrapDistanceTop             : ReadValue_Double( sValue ); break;
				case cssptMsoWrapEdited                  : ReadValue_Boolean( sValue ); break;
				case cssptMsoWrapStyle                   : ReadValue_MsoWrapStyle( sValue ); break;
				case cssptPosition                       : ReadValue_Position( sValue ); break;
				case cssptRotation                       : ReadValue_Rotation( sValue ); break;
				case cssptTop                            : ReadValue_Units( sValue ); break;
				case cssptVisibility                     : ReadValue_Visibility( sValue ); break;
				case cssptWidth                          : ReadValue_Units( sValue ); break;
				case cssptZIndex                         : ReadValue_ZIndex( sValue ); break;

				case cssptDirection                      : ReadValue_Direction( sValue ); break;
				case cssptLayoutFlow                     : ReadValue_LayoutFlow( sValue ); break;
				case cssptMsoDirectionAlt                : ReadValue_DirectionAlt( sValue ); break;
				case cssptMsoFitShapeToText              : ReadValue_Boolean( sValue ); break;
				case cssptMsoFitTextToShape              : ReadValue_Boolean( sValue ); break;
				case cssptMsoLayoutFlowAlt               : ReadValue_LayoutFlowAlt( sValue ); break;
				case cssptMsoNextTextbox                 : ReadValue_String( sValue ); break;
				case cssptMsoRotate                      : ReadValue_MsoRotate( sValue ); break;
				case cssptMsoTextScale                   : ReadValue_Double( sValue ); break;
				case cssptVTextAnchor                    : ReadValue_VTextAnchor( sValue ); break;

				case cssptFont                           : ReadValue_String( sValue ); break;
				case cssptFontFamily                     : ReadValue_String( sValue ); break;
				case cssptFontSize                       : ReadValue_Double( sValue ); break;
				case cssptFontStyle                      : ReadValue_FontStyle( sValue ); break;
				case cssptFontVariant                    : ReadValue_FontVariant( sValue ); break;
				case cssptFontWeight                     : ReadValue_FontWeight( sValue ); break;
				case cssptMsoTextShadow                  : ReadValue_Boolean( sValue ); break;
				case cssptTextDecoration                 : ReadValue_TextDecoration( sValue ); break;
				case cssptVRotateLetters                 : ReadValue_Boolean( sValue ); break;
				case cssptVSameLetterHeights             : ReadValue_Boolean( sValue ); break;
				case cssptVTextAlign                     : ReadValue_VTextAlign( sValue ); break;
				case cssptVTextKern                      : ReadValue_Boolean( sValue ); break;
				case cssptVTextReverse                   : ReadValue_Boolean( sValue ); break;
				case cssptVTextSpacingMode               : ReadValue_VTextSpacingMode( sValue ); break;
				case cssptVTextSpacing                   : ReadValue_Double( sValue ); break;
				};
			}

		private:

			void ReadValue_Unknown(CString& sValue)
			{
				
			}
			void ReadValue_Flip(CString& sValue)
			{
				if      ( _T("x")  == sValue ) m_oValue.eFlip = cssflipX;
				else if ( _T("y")  == sValue ) m_oValue.eFlip = cssflipY;
				else if ( _T("xy") == sValue ) m_oValue.eFlip = cssflipXY;
				else if ( _T("yx") == sValue ) m_oValue.eFlip = cssflipYX;
				else 
					m_eType = cssptUnknown;
			}
			void ReadValue_Units(CString& sValue)
			{
				int nPos = -1;
				if ( -1 != ( nPos = sValue.Find(_T("auto" ) ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeAuto;
				}
				else if ( -1 != ( nPos = sValue.Find( _T("in") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeUnits;

					double dValue = _wtof( sValue.Mid( 0, nPos ) );
					m_oValue.oValue.dValue = Inch_To_Pt(dValue);
				}
				else if ( -1 != ( nPos = sValue.Find( _T("cm") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeUnits;

					double dValue = _wtof( sValue.Mid( 0, nPos ) );
					m_oValue.oValue.dValue = Cm_To_Pt(dValue);
				}
				else if ( -1 != ( nPos = sValue.Find( _T("mm") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeUnits;

					double dValue = _wtof( sValue.Mid( 0, nPos ) );
					m_oValue.oValue.dValue = Mm_To_Pt(dValue);
				}
				else if ( -1 != ( nPos = sValue.Find( _T("em") ) ) )
				{
					
				}
				else if ( -1 != ( nPos = sValue.Find( _T("ex") ) ) )
				{
					
				}
				else if ( -1 != ( nPos = sValue.Find( _T("pt") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeUnits;

					double dValue = _wtof( sValue.Mid( 0, nPos ) );
					m_oValue.oValue.dValue = dValue;
				}
				else if ( -1 != ( nPos = sValue.Find( _T("pc") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeUnits;

					double dValue = _wtof( sValue.Mid( 0, nPos ) );
					m_oValue.oValue.dValue = dValue * 12;
				}
				else if ( -1 != ( nPos = sValue.Find( _T("%") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypePerc;

					m_oValue.oValue.dValue = _wtof( sValue.Mid( 0, nPos ) );
				}
				else if ( -1 != ( nPos = sValue.Find( _T("px") ) ) )
				{
					m_oValue.oValue.eType = cssunitstypeUnits;

					double dValue = _wtof( sValue.Mid( 0, nPos ) );
					m_oValue.oValue.dValue = Px_To_Pt(dValue);
				}
				else
				{
					m_oValue.oValue.eType = cssunitstypeUnits;
					m_oValue.oValue.dValue = _wtof( sValue );
				}
			}

			void ReadValue_MsoPosHor(CString& sValue)
			{
				if      ( _T("absolute") == sValue ) m_oValue.eMsoPosHor = cssmsoposhorAbsolute;
				else if ( _T("left")     == sValue ) m_oValue.eMsoPosHor = cssmsoposhorLeft;
				else if ( _T("center")   == sValue ) m_oValue.eMsoPosHor = cssmsoposhorCenter;
				else if ( _T("right")    == sValue ) m_oValue.eMsoPosHor = cssmsoposhorRight;
				else if ( _T("inside")   == sValue ) m_oValue.eMsoPosHor = cssmsoposhorInside;
				else if ( _T("outside")  == sValue ) m_oValue.eMsoPosHor = cssmsoposhorOutside;
				else 
					m_oValue.eMsoPosHor = cssmsoposhorAbsolute;
			}
			void ReadValue_MsoPosHorRel(CString& sValue)
			{
				if      ( _T("margin") == sValue ) m_oValue.eMsoPosHorRel = cssmsoposhorrelMargin;
				else if ( _T("page")   == sValue ) m_oValue.eMsoPosHorRel = cssmsoposhorrelPage;
				else if ( _T("text")   == sValue ) m_oValue.eMsoPosHorRel = cssmsoposhorrelText;
				else if ( _T("char")   == sValue ) m_oValue.eMsoPosHorRel = cssmsoposhorrelChar;
				else 
					m_oValue.eMsoPosHorRel = cssmsoposhorrelText;
			}
			void ReadValue_MsoPosVer(CString& sValue)
			{
				if      ( _T("absolute") == sValue ) m_oValue.eMsoPosVer = cssmsoposverAbsolute;
				else if ( _T("top")      == sValue ) m_oValue.eMsoPosVer = cssmsoposverTop;
				else if ( _T("center")   == sValue ) m_oValue.eMsoPosVer = cssmsoposverCenter;
				else if ( _T("bottom")   == sValue ) m_oValue.eMsoPosVer = cssmsoposverBottom;
				else if ( _T("inside")   == sValue ) m_oValue.eMsoPosVer = cssmsoposverInside;
				else if ( _T("outside")  == sValue ) m_oValue.eMsoPosVer = cssmsoposverOutside;
				else 
					m_oValue.eMsoPosVer = cssmsoposverAbsolute;
			}
			void ReadValue_MsoPosVerRel(CString& sValue)
			{
				if      ( _T("margin") == sValue ) m_oValue.eMsoPosVerRel = cssmsoposverrelMargin;
				else if ( _T("page")   == sValue ) m_oValue.eMsoPosVerRel = cssmsoposverrelPage;
				else if ( _T("text")   == sValue ) m_oValue.eMsoPosVerRel = cssmsoposverrelText;
				else if ( _T("line")   == sValue ) m_oValue.eMsoPosVerRel = cssmsoposverrelLine;
				else 
					m_oValue.eMsoPosVerRel = cssmsoposverrelText;
			}

			void ReadValue_Rotation(CString& sValue) {
				m_oValue.dValue = _wtof( sValue );
				if (sValue.Find(_T("fd")) != -1)
					m_oValue.dValue /= 6000;
			}

			void ReadValue_Double(CString& sValue)
			{
				m_oValue.dValue = _wtof( sValue );
			}

			void ReadValue_Boolean(CString& sValue)
			{
				if ( _T("true") == sValue || _T("t") == sValue || _T("1") == sValue ) 
					m_oValue.bValue = true;
				else
					m_oValue.bValue = false;
			}

			void ReadValue_MsoWrapStyle(CString& sValue)
			{
				if      ( _T("square") == sValue ) m_oValue.eMsoWrapStyle = cssmsowrapstyleSqaure;
				else if ( _T("none")   == sValue ) m_oValue.eMsoWrapStyle = cssmsowrapstyleNone;
				else 
					m_oValue.eMsoWrapStyle = cssmsowrapstyleSqaure;
			}
			void ReadValue_Position(CString& sValue)
			{
				if      ( _T("static")   == sValue ) m_oValue.ePosition = csspositionStatic;
				else if ( _T("absolute") == sValue ) m_oValue.ePosition = csspositionAbsolute;
				else if ( _T("relative") == sValue ) m_oValue.ePosition = csspositionRelative;
				else 
					m_oValue.ePosition = csspositionAbsolute;
			}
			void ReadValue_Visibility(CString& sValue)
			{
				if      ( _T("hidden")  == sValue ) m_oValue.eVisibility = cssvisibilityHidden;
				else if ( _T("inherit") == sValue ) m_oValue.eVisibility = cssvisibilityInherit;
				else 
					m_oValue.eVisibility = cssvisibilityInherit;
			}
			void ReadValue_ZIndex(CString& sValue)
			{
				if      ( _T("auto")  == sValue ) m_oValue.oZIndex.eType = csszindextypeAuto;
				else
				{
					m_oValue.oZIndex.eType  = csszindextypeOrder;
					m_oValue.oZIndex.nOrder = _wtoi( sValue );

				}
			}
			void ReadValue_Direction(CString& sValue)
			{
				if      ( _T("ltr") == sValue ) m_oValue.eDirection = cssdirectionLTR;
				else if ( _T("rtl") == sValue ) m_oValue.eDirection = cssdirectionRTL;
				else 
					m_oValue.eDirection = cssdirectionLTR;
			}
			void ReadValue_LayoutFlow(CString& sValue)
			{
				if      ( _T("horizontal")             == sValue ) m_oValue.eLayoutFlow = csslayoutflowHorizontal;
				else if ( _T("vertical")               == sValue ) m_oValue.eLayoutFlow = csslayoutflowVertical;
				else if ( _T("vertical-ideographic")   == sValue ) m_oValue.eLayoutFlow = csslayoutflowVerticalIdeographic;
				else if ( _T("horizontal-ideographic") == sValue ) m_oValue.eLayoutFlow = csslayoutflowHorizontalIdeographic;
				else 
					m_oValue.eLayoutFlow = csslayoutflowHorizontal;
			}
			void ReadValue_DirectionAlt(CString& sValue)
			{
				m_oValue.eDirectionAlt = cssdirectionaltContext;
			}
			void ReadValue_LayoutFlowAlt(CString& sValue)
			{
				m_oValue.eLayoutFlowAlt = csslayoutflowaltBottomToTop;
			}
			void ReadValue_String(CString& sValue)
			{
				int nLen = sValue.GetLength();
				if ( nLen > 127 )
					return;

				::memcpy( m_oValue.wsValue, sValue.GetBuffer(), nLen * sizeof( wchar_t ) );
				m_oValue.wsValue[nLen] = '\0';
			}

			void ReadValue_MsoRotate(CString& sValue)
			{
				if      ( _T("0")   == sValue ) m_oValue.eRotate = cssmsorotate0;
				else if ( _T("90")  == sValue ) m_oValue.eRotate = cssmsorotate90;
				else if ( _T("180") == sValue ) m_oValue.eRotate = cssmsorotate180;
				else if ( _T("-90") == sValue ) m_oValue.eRotate = cssmsorotate270;
				else 
					m_oValue.eRotate = cssmsorotate0;
			}
			void ReadValue_VTextAnchor(CString& sValue)
			{
				if      ( _T("top")                    == sValue ) m_oValue.eVTextAnchor = cssvtextanchorTop;
				else if ( _T("middle")                 == sValue ) m_oValue.eVTextAnchor = cssvtextanchorMiddle;
				else if ( _T("bottom")                 == sValue ) m_oValue.eVTextAnchor = cssvtextanchorBottom;
				else if ( _T("top-center")             == sValue ) m_oValue.eVTextAnchor = cssvtextanchorTopCenter;
				else if ( _T("middle-center")          == sValue ) m_oValue.eVTextAnchor = cssvtextanchorMiddleCenter;
				else if ( _T("bottom-center")          == sValue ) m_oValue.eVTextAnchor = cssvtextanchorBottomCenter;
				else if ( _T("top-baseline")           == sValue ) m_oValue.eVTextAnchor = cssvtextanchorTopBaseline;
				else if ( _T("bottom-baseline")        == sValue ) m_oValue.eVTextAnchor = cssvtextanchorBottomBaseline;
				else if ( _T("top-center-baseline")    == sValue ) m_oValue.eVTextAnchor = cssvtextanchorTopCenterBaseline;
				else if ( _T("bottom-center-baseline") == sValue ) m_oValue.eVTextAnchor = cssvtextanchorBottomCenterBaseline;
				else 
					m_oValue.eVTextAnchor = cssvtextanchorTop;
			}
			void ReadValue_FontStyle(CString& sValue)
			{
				if      ( _T("normal")  == sValue ) m_oValue.eFontStyle = cssfontstyleNormal;
				else if ( _T("italic")  == sValue ) m_oValue.eFontStyle = cssfontstyleItalic;
				else if ( _T("oblique") == sValue ) m_oValue.eFontStyle = cssfontstyleOblique;
				else 
					m_oValue.eFontStyle = cssfontstyleNormal;
			}
			void ReadValue_FontVariant(CString& sValue)
			{
				if      ( _T("normal")     == sValue ) m_oValue.eFontVariant = cssfontvariantNormal;
				else if ( _T("small-caps") == sValue ) m_oValue.eFontVariant = cssfontvariantSmallCaps;
				else 
					m_oValue.eFontVariant = cssfontvariantNormal;
			}
			void ReadValue_FontWeight(CString& sValue)
			{
				if      ( _T("normal")  == sValue ) m_oValue.eFontWeight = cssfontweightNormal;
				else if ( _T("lighter") == sValue ) m_oValue.eFontWeight = cssfontweightLighter;
				else if ( _T("100")     == sValue ) m_oValue.eFontWeight = cssfontweight100;
				else if ( _T("200")     == sValue ) m_oValue.eFontWeight = cssfontweight200;
				else if ( _T("300")     == sValue ) m_oValue.eFontWeight = cssfontweight300;
				else if ( _T("400")     == sValue ) m_oValue.eFontWeight = cssfontweight400;
				else if ( _T("bold")    == sValue ) m_oValue.eFontWeight = cssfontweightBold;
				else if ( _T("bolder")  == sValue ) m_oValue.eFontWeight = cssfontweightBolder;
				else if ( _T("500")     == sValue ) m_oValue.eFontWeight = cssfontweight500;
				else if ( _T("600")     == sValue ) m_oValue.eFontWeight = cssfontweight600;
				else if ( _T("700")     == sValue ) m_oValue.eFontWeight = cssfontweight700;
				else if ( _T("800")     == sValue ) m_oValue.eFontWeight = cssfontweight800;
				else if ( _T("900")     == sValue ) m_oValue.eFontWeight = cssfontweight900;
				else 
					m_oValue.eFontWeight = cssfontweightNormal;
			}
			void ReadValue_TextDecoration(CString& sValue)
			{
				if      ( _T("none")         == sValue ) m_oValue.eTextDecoration = csstextdecorationNone;
				else if ( _T("underline")    == sValue ) m_oValue.eTextDecoration = csstextdecorationUnderline;
				else if ( _T("overline")     == sValue ) m_oValue.eTextDecoration = csstextdecorationOverline;
				else if ( _T("line-through") == sValue ) m_oValue.eTextDecoration = csstextdecorationLineThrough;
				else if ( _T("blink")        == sValue ) m_oValue.eTextDecoration = csstextdecorationBlink;
				else 
					m_oValue.eTextDecoration = csstextdecorationNone;
			}
			void ReadValue_VTextAlign(CString& sValue)
			{
				if      ( _T("left")            == sValue ) m_oValue.eVTextAlign = cssvtextalignLeft;
				else if ( _T("right")           == sValue ) m_oValue.eVTextAlign = cssvtextalignRight;
				else if ( _T("center")          == sValue ) m_oValue.eVTextAlign = cssvtextalignCenter;
				else if ( _T("justify")         == sValue ) m_oValue.eVTextAlign = cssvtextalignJustify;
				else if ( _T("letter-justify")  == sValue ) m_oValue.eVTextAlign = cssvtextalignLetterJustify;
				else if ( _T("stretch-justify") == sValue ) m_oValue.eVTextAlign = cssvtextalignStretchJustify;
				else 
					m_oValue.eVTextAlign = cssvtextalignLeft;
			}
			void ReadValue_VTextSpacingMode(CString& sValue)
			{
				if      ( _T("tightening") == sValue ) m_oValue.eVTextSpacingMode = cssvtextspacingmodeTightening;
				else if ( _T("tracking")   == sValue ) m_oValue.eVTextSpacingMode = cssvtextspacingmodeTracking;
				else 
					m_oValue.eVTextSpacingMode = cssvtextspacingmodeTightening;
			}
		private:


			ECssPropertyType  m_eType;
			UCssValue         m_oValue;

		};



		
		
		
		class CCssStyle
		{
		public:
			CCssStyle() 
			{
			}

			CString FromString(CString &sValue)
			{
				m_arrProperties.RemoveAll();
				m_sCss = sValue;
				ParseProperties();

				return m_sCss;
			}

			CString ToString  () const 
			{
				return m_sCss;
			}

			SimpleType_FromString2    (CString)
			SimpleType_Operator_Equal (CCssStyle)

		private:

			bool ParseProperties()
			{
				CString sTemp = m_sCss;
				while ( sTemp.GetLength() > 0 )
				{
					int nPos = sTemp.Find( ';' );
					if ( -1 == nPos )
					{
						CCssProperty oProperty(sTemp);
						if ( cssptUnknown != oProperty.get_Type() )
							m_arrProperties.Add( oProperty );

						sTemp.Empty();
						continue;
					}
					else
					{
						CCssProperty oProperty( sTemp.Mid( 0, nPos ) );
						if ( cssptUnknown != oProperty.get_Type() )
							m_arrProperties.Add( oProperty );

						sTemp = sTemp.Mid( nPos + 1, sTemp.GetLength() - nPos - 1 );
					}
				}

				return true;
			}

		public:

			CSimpleArray<SimpleTypes::Vml::CCssProperty>  m_arrProperties;
			CString                                       m_sCss;
		};
		
		
		
		class CVml_Vector2D_Units
		{
		public:
			CVml_Vector2D_Units() 
			{
				m_dX = 0;
				m_dY = 0;
			}

			double GetX() const
			{
				return m_dX;
			}
			double GetY() const
			{
				return m_dY;
			}

			void   SetValue(double dX, double dY)
			{
				m_dX = dX;
				m_dX = dY;
			}

			virtual double FromString(CString &sValue)
			{
				m_dX = 0;
				m_dY = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				SimpleTypes::CPoint oPt1 = sValue.Mid( 0, nPos );
				m_dX = oPt1.GetValue();

				SimpleTypes::CPoint oPt2 = sValue.Mid( nPos + 1, nLen - nPos - 1 );
				m_dY = oPt2.GetValue();

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f,%f"), m_dX, m_dY );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D_Units)

		private:

			double m_dX; 
			double m_dY; 
		};
		
		
		
		class CVml_Vector2D_Percentage
		{
		public:
			CVml_Vector2D_Percentage() 
			{
				m_dX = 0;
				m_dY = 0;
			}

			double GetX() const
			{
				return m_dX;
			}
			double GetY() const
			{
				return m_dY;
			}

			void   SetValue(double dX, double dY)
			{
				m_dX = dX;
				m_dX = dY;
			}

			virtual double FromString(CString &sValue)
			{
				m_dX = 0;
				m_dY = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				SimpleTypes::CPercentage oPerc1 = sValue.Mid( 0, nPos );
				m_dX = oPerc1.GetValue();

				SimpleTypes::CPercentage oPerc2 = sValue.Mid( nPos + 1, nLen - nPos - 1 );
				m_dY = oPerc2.GetValue();

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f%%,%f%%"), m_dX, m_dY );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D_Percentage)

		private:

			double m_dX; 
			double m_dY; 
		};
		
		
		
		class CVml_Vector2D_1_65536
		{
		public:
			CVml_Vector2D_1_65536() 
			{
				m_dX = 0;
				m_dY = 0;
			}

			double GetX() const
			{
				return m_dX;
			}
			double GetY() const
			{
				return m_dY;
			}

			void   SetValue(double dX, double dY)
			{
				m_dX = dX;
				m_dX = dY;
			}

			virtual double FromString(CString &sValue)
			{
				m_dX = 0;
				m_dY = 0;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				SimpleTypes::Vml::CVml_1_65536 oFraction1 = sValue.Mid( 0, nPos );
				m_dX = oFraction1.GetValue();

				SimpleTypes::Vml::CVml_1_65536 oFraction2 = sValue.Mid( nPos + 1, nLen - nPos - 1 );
				m_dY = oFraction2.GetValue();

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f,%f"), m_dX, m_dY );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D_1_65536)

		private:

			double m_dX; 
			double m_dY; 
		};
		
		
		
		class CVml_TableLimits
		{
		public:
			CVml_TableLimits() 
			{
			}

			int GetSize() const
			{
				return m_arrLimits.GetSize();
			}
			double GetAt(int nIndex) const
			{
				if ( nIndex < 0 || nIndex >= m_arrLimits.GetSize() )
					return 0;

				return m_arrLimits[nIndex];
			}

			void AddValue(double dValue)
			{
				m_arrLimits.Add( dValue );
			}

			int FromString(CString &sValue)
			{
				int nPos = 0;
				int nLen = sValue.GetLength();

				int nSpacePos = 0;
				wchar_t wChar;
				while ( nPos < nLen )
				{
					while ( ' ' == ( wChar = sValue[nPos] ) )
					{
						nPos++;
						if ( nPos >= nLen )
							return 0;
					}

					nSpacePos = sValue.Find( _T(" "), nPos );
					if ( -1 == nSpacePos )
						nSpacePos = nLen;

					SimpleTypes::CPoint oPoint = sValue.Mid( nPos, nSpacePos - nPos );
					nPos = nSpacePos + 1;

					m_arrLimits.Add( oPoint.ToPoints() );
				}

				return 0;
			}

			CString ToString  () const 
			{
				CString sResult;

				for ( int nIndex = 0; nIndex < m_arrLimits.GetSize(); nIndex++ )
				{
					CString sTemp;
					sTemp.Format( _T("%fpt "), m_arrLimits[nIndex] );
					sResult += sTemp;
				}

				return sResult;
			}

			SimpleType_FromString2    (int)
			SimpleType_Operator_Equal (CVml_TableLimits)

		private:

			CSimpleArray<double> m_arrLimits;
		};

		
		
		
		template<int nDefValue = 0>
		class CVml_TableProperties : public CSimpleType<int, nDefValue>
		{
		public:
			CVml_TableProperties() {}

			virtual int     FromString(CString &sValue)
			{
				m_eValue = _wtoi( sValue );

				return m_eValue;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%d"), m_eValue);

				return sResult;
			}

			bool IsTable() const
			{
				return ( m_eValue & 1 ? true : false );
			}

			bool IsPlaceholder() const
			{
				return ( m_eValue & 2 ? true : false );
			}

			bool IsBiDirectionalText() const
			{
				return ( m_eValue & 4 ? true : false );
			}

			SimpleType_FromString           (int)
			SimpleType_Operator_Equal       (CVml_TableProperties)
			SimpleTypes_AdditionalOpearators(CVml_TableProperties)

		};
		
		
		
		enum EVml_Vector2D_Position
		{
			vmlvector2dposConstant    = 0,
			vmlvector2dposFormula     = 1,
			vmlvector2dposAdjValue    = 2,
			vmlvector2dposCenter      = 3,
			vmlvector2dposTopLeft     = 4,
			vmlvector2dposBottomRight = 5,
		};

		class CVml_Vector2D_Position
		{
		public:
			CVml_Vector2D_Position() 
			{

			}

			EVml_Vector2D_Position GetTypeX() const
			{
				return m_eTypeX;
			}
			EVml_Vector2D_Position GetTypeY() const
			{
				return m_eTypeY;
			}
			CString                GetIdX() const
			{
				return m_sIdX;
			}
			CString                GetIdY() const
			{
				return m_sIdY;
			}
			double                 GetX() const
			{
				return m_dX;
			}
			double                 GetY() const
			{
				return m_dY;
			}
			void   SetConstantX(double dX)
			{
				m_eTypeX = vmlvector2dposConstant;
				m_dX     = dX;
			}

			void   SetConstantY(double dY)
			{
				m_eTypeY = vmlvector2dposConstant;
				m_dY     = dY;
			}

			double FromString(CString &sValue)
			{
				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				CString sFirst  = sValue.Mid( 0, nPos );
				CString sSecond = sValue.Mid( nPos + 1, nLen - nPos - 1 );

				Parse( sFirst, true );
				Parse( sSecond, false );

				return 0;
			}

			CString ToString  () const 
			{
				CString sResult;

				switch ( m_eTypeX )
				{
				case vmlvector2dposConstant    : sResult.Format( _T("%f"), m_dX ); break;
				case vmlvector2dposFormula     : sResult = _T("@") + m_sIdX; break;
				case vmlvector2dposAdjValue    : sResult = _T("#") + m_sIdX; break;
				case vmlvector2dposCenter      : sResult = _T("center"); break;
				case vmlvector2dposTopLeft     : sResult = _T("topleft"); break;
				case vmlvector2dposBottomRight : sResult = _T("bottomright"); break;
				};

				sResult += _T(",");

				switch ( m_eTypeY )
				{
				case vmlvector2dposConstant    : 
					{
						CString sTemp;
						sTemp.Format( _T("%f"), m_dY ); 
						sResult += sTemp;
						break;
					}
				case vmlvector2dposFormula     : sResult += _T("@") + m_sIdY; break;
				case vmlvector2dposAdjValue    : sResult += _T("#") + m_sIdY; break;
				case vmlvector2dposCenter      : sResult += _T("center"); break;
				case vmlvector2dposTopLeft     : sResult += _T("topleft"); break;
				case vmlvector2dposBottomRight : sResult += _T("bottomright"); break;
				};

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D_Position)

		private:

			void Parse(CString &sValue, bool bFirst)
			{
				EVml_Vector2D_Position eValue = vmlvector2dposConstant;
				double dValue = 0.0;
				CString sId;


				sValue.Replace( _T(" "), _T("") );
				int nLen = sValue.GetLength();
				if ( nLen > 0 )
				{

					wchar_t wChar = sValue[0];
					switch ( wChar )
					{
					case '0':
					case '1':
					case '2':
					case '3':
					case '4':
					case '5':
					case '6':
					case '7':
					case '8':
					case '9':
					case '.':

						eValue = vmlvector2dposConstant;
						dValue = _wtof( sValue );
						break;

					case 'c':

						if ( _T("center") == sValue )
							eValue = vmlvector2dposCenter;

						break;

					case 't':

						if ( _T("topleft") == sValue )
							eValue = vmlvector2dposTopLeft;

						break;

					case 'b':

						if ( _T("bottomright") == sValue )
							eValue = vmlvector2dposBottomRight;

						break;

					case '@':

						eValue = vmlvector2dposFormula;
						sId    = sValue.Mid( 1, nLen - 1 );
						break;

					case '#':

						eValue = vmlvector2dposAdjValue;
						sId    = sValue.Mid( 1, nLen - 1 );
						break;
					}

				}

				if ( bFirst )
				{
					m_eTypeX = eValue;
					m_sIdX   = sId;
					m_dX     = dValue;
				}
				else
				{
					m_eTypeY = eValue;
					m_sIdY   = sId;
					m_dY     = dValue;
				}
			}

		private:

			EVml_Vector2D_Position m_eTypeX;
			EVml_Vector2D_Position m_eTypeY;

			CString                m_sIdX;  
			CString                m_sIdY;  

			double                 m_dX;    
			double                 m_dY;    
		};
		
		
		
		class CVml_Polygon2D_Units
		{
		public:
			CVml_Polygon2D_Units() 
			{
				m_wcDelimiter = 0x20;
			}
			CVml_Polygon2D_Units(const CVml_Polygon2D_Units &oOther)\
			{
				m_wcDelimiter = 0x20;
				FromString( oOther.ToString() );
			}
			CVml_Polygon2D_Units(const BSTR &bsValue)\
			{
				m_wcDelimiter = 0x20;
				FromString( bsValue );
			}
			CVml_Polygon2D_Units(CString &sValue)
			{
				m_wcDelimiter = 0x20;
				FromString( sValue );
			}
			CVml_Polygon2D_Units(const wchar_t* cwsValue)
			{
				m_wcDelimiter = 0x20;
				FromString( cwsValue );
			}
			CVml_Polygon2D_Units(const CWCharWrapper& wsStr)
			{
				m_wcDelimiter = 0x20;
				FromString( wsStr );
			}
			const CVml_Polygon2D_Units &operator =(CString &sValue)
			{
				FromString( sValue );
				return *this;
			}
			const CVml_Polygon2D_Units &operator =(const BSTR &bsValue)
			{
				FromString( bsValue );
				return *this;
			}
			const CVml_Polygon2D_Units &operator =(const wchar_t* cwsString)
			{
				FromString( cwsString );
				return *this;
			}
			const CVml_Polygon2D_Units &operator =(const CWCharWrapper& wsStr)
			{
				FromString( wsStr );
				return *this;
			}

			void SetDelimiter(wchar_t wcNew) 
			{
				m_wcDelimiter = wcNew;
			}
			double GetX(int nIndex) const
			{
				if ( nIndex < 0 || nIndex >= m_arrPoints.GetSize()  )
					return 0;

				return m_arrPoints[nIndex].dX;
			}
			double GetY(int nIndex) const
			{
				if ( nIndex < 0 || nIndex >= m_arrPoints.GetSize()  )
					return 0;

				return m_arrPoints[nIndex].dY;
			}

			void   AddPoint(double dX, double dY)
			{
				TPoint oPt( dX, dY );
				m_arrPoints.Add( oPt );
			}

			virtual double FromString(CString &sValue)
			{
				m_arrPoints.RemoveAll();

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nStartPos = 0;
				while ( true )
				{
					int nMidPos = sValue.Find( _T(","), nStartPos );
					int nEndPos = sValue.Find( m_wcDelimiter, nMidPos + 1 );

					if ( -1 == nMidPos )
						break;

					if ( -1 == nEndPos )
						nEndPos = nLen;

					int nX = _wtoi( sValue.Mid( nStartPos, nMidPos - nStartPos ) );
					int nY = _wtoi( sValue.Mid( nMidPos + 1, nEndPos - nMidPos - 1 ) );
					m_arrPoints.Add( TPoint( nX, nY ) );

					nStartPos = nEndPos + 1;
				}


				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;

				int nLen = m_arrPoints.GetSize();
				for ( int nIndex = 0; nIndex < nLen; nIndex++ )
				{
					CString sTemp;
					sTemp.Format( _T("%f,%f"), m_arrPoints[nIndex].dX, m_arrPoints[nIndex].dY );
					sResult += sTemp;
					if ( nIndex < nLen - 1 )
						sResult += m_wcDelimiter;
				}

				return sResult;
			}

			SimpleType_FromString2    (double)

		private:

			struct TPoint
			{
				double dX;
				double dY;

				TPoint(double d_X, double d_Y )
				{
					dX = d_X;
					dY = d_Y;
				}
			};

			CSimpleArray<TPoint> m_arrPoints;
			wchar_t              m_wcDelimiter; 
		};
		
		
		
		class CVml_1_65536_Or_Percentage
		{
		public:
			CVml_1_65536_Or_Percentage() 
			{
				m_dValue = 0;
			}

			double GetValue() const
			{
				return m_dValue;
			}

			void   SetValue(double dValue)
			{
				m_dValue = max( 0, min( 1, dValue) );
			}

			void   SetValue(int nValue)
			{
				m_dValue = max( 0, min( 65536, nValue) ) / 65536.0;
			}
			void   SetPercentage(double dValue)
			{
				m_dValue = max( 0, min( 100, dValue ) ) / 100.0;
			}

			virtual double FromString(CString &sValue)
			{
				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				bool bFraction   = ( 'f' == sValue.GetAt( nLen - 1 ) );
				bool bPercentage = ( '%' == sValue.GetAt( nLen - 1 ) );

				if ( bFraction )
				{
					int nValue = _wtoi( sValue.Mid( 0, nLen - 1 ) );
					SetValue( nValue );
				}
				else if ( bPercentage )
				{
					double dValue = _wtof( sValue.Mid( 0, nLen - 1 ) );
					SetPercentage( dValue );
				}
				else
				{
					double dValue = _wtof( sValue );
					SetValue( dValue );
				}

				return m_dValue;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f"), m_dValue );

				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_1_65536_Or_Percentage)

		private:

			double m_dValue;
		};
		
		
		
		class CVml_Matrix
		{
		public:
			CVml_Matrix() 
			{
				ResetMatrix();
			}
			CVml_Matrix(const CVml_Matrix &oOther)\
			{
				ResetMatrix();
				FromString( oOther.ToString() );
			}
			CVml_Matrix(const BSTR &bsValue)\
			{
				ResetMatrix();
				FromString( bsValue );
			}
			CVml_Matrix(CString &sValue)
			{
				ResetMatrix();
				FromString( sValue );
			}
			CVml_Matrix(const wchar_t* cwsValue)
			{
				ResetMatrix();
				FromString( cwsValue );
			}
			CVml_Matrix(const CWCharWrapper& wsStr)
			{
				ResetMatrix();
				FromString( wsStr );
			}
			const CVml_Matrix &operator =(CString &sValue)
			{
				FromString( sValue );
				return *this;
			}
			const CVml_Matrix &operator =(const BSTR &bsValue)
			{
				FromString( bsValue );
				return *this;
			}
			const CVml_Matrix &operator =(const wchar_t* cwsString)
			{
				FromString( cwsString );
				return *this;
			}
			const CVml_Matrix &operator =(const CWCharWrapper& wsStr)
			{
				FromString( wsStr );
				return *this;
			}

			void ResetMatrix() 
			{
				m_dSxx = 1; m_dSxy = 0;
				m_dSyx = 0; m_dSyy = 1;
				m_dPx  = 0; m_dPy  = 0;
			}
			void SetMatrix(double dSxx, double dSxy, double dSyx, double dSyy, double dPx, double dPy) 
			{
				m_dSxx = dSxx; m_dSxy = dSxy;
				m_dSyx = dSyx; m_dSyy = dSyy;
				m_dPx  =  dPx; m_dPy  =  dPy;
			}

			double Get_Sxx() const
			{
				return m_dSxx;
			}
			double Get_Sxy() const
			{
				return m_dSxy;
			}
			double Get_Syx() const
			{
				return m_dSyx;
			}
			double Get_Syy() const
			{
				return m_dSyy;
			}

			double Get_Px() const
			{
				return m_dPx;
			}
			double Get_Py() const
			{
				return m_dPy;
			}

			virtual double FromString(CString &sValue)
			{
				ResetMatrix();

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				
				int nStartPos = 0;
				int nEndPos = sValue.Find( _T(","), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				if ( nEndPos - nStartPos > 0 )
					m_dSxx = _wtof( sValue.Mid( nStartPos, nEndPos - nStartPos ) );

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(","), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				if ( nEndPos - nStartPos > 0 )
					m_dSxy = _wtof( sValue.Mid( nStartPos, nEndPos - nStartPos ) );

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(","), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				if ( nEndPos - nStartPos > 0 )
					m_dSyx = _wtof( sValue.Mid( nStartPos, nEndPos - nStartPos ) );

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(","), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				if ( nEndPos - nStartPos > 0 )
					m_dSyy = _wtof( sValue.Mid( nStartPos, nEndPos - nStartPos ) );

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(","), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				if ( nEndPos - nStartPos > 0 )
					m_dPx = _wtof( sValue.Mid( nStartPos, nEndPos - nStartPos ) );

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(","), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				if ( nEndPos - nStartPos > 0 )
					m_dPy = _wtof( sValue.Mid( nStartPos, nEndPos - nStartPos ) );

				nStartPos = nEndPos + 1;		
				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%f,%f,%f,%f,%f,%f"), m_dSxx, m_dSxy, m_dSyx, m_dSyy,  m_dPx, m_dPy );
				return sResult;
			}

			SimpleType_FromString2    (double)

		private:

			double m_dSxx;
			double m_dSxy;
			double m_dSyx;
			double m_dSyy;
			double m_dPx;
			double m_dPy;

		};
		
		
		
		class CVml_Vector2D_Units_Or_Percentage
		{
		public:
			CVml_Vector2D_Units_Or_Percentage() 
			{
				m_dX = 0;
				m_dY = 0;
				m_bUnitsX = true;
				m_bUnitsY = true;
			}

			double GetX() const
			{
				return m_dX;
			}
			double GetY() const
			{
				return m_dY;
			}
			double IsXinPoints() const
			{
				return m_bUnitsX;
			}
			double IsYinPoints() const
			{
				return m_bUnitsY;
			}

			void   SetValue_Points(double dX, double dY)
			{
				m_dX = dX;
				m_dX = dY;

				m_bUnitsX = true;
				m_bUnitsY = true;
			}

			virtual double FromString(CString &sValue)
			{
				m_dX = 0;
				m_dY = 0;
				m_bUnitsX = true;
				m_bUnitsY = true;

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				int nPos = sValue.Find( _T(",") );
				if ( -1 == nPos )
					return 0;

				CString sTemp = sValue.Mid( 0, nPos );
				if ( -1 != sTemp.Find( '%' ) )
				{
					SimpleTypes::CPercentage oPerc = sTemp;
					m_dX = oPerc.GetValue();
					m_bUnitsX = false;
				}
				else
				{
					SimpleTypes::CPoint oPt = sTemp;
					m_dX = oPt.GetValue();
					m_bUnitsX = true;
				}

				sTemp = sValue.Mid( nPos + 1, nLen - nPos - 1 );
				if ( -1 != sTemp.Find( '%' ) )
				{
					SimpleTypes::CPercentage oPerc = sTemp;
					m_dY = oPerc.GetValue();
					m_bUnitsY = false;
				}
				else
				{
					SimpleTypes::CPoint oPt = sTemp;
					m_dY = oPt.GetValue();
					m_bUnitsY = true;
				}

				return 0;
			}

			virtual CString ToString  () const 
			{
				CString sResult;

				if ( m_bUnitsX )
					sResult.Format( _T("%fpt,"), m_dX );
				else
					sResult.Format( _T("%f%%,"), m_dX );


				if ( m_bUnitsY )
				{
					CString sTemp;
					sTemp.Format( _T("%fpt"), m_dY );
					sResult += sTemp;
				}
				else
				{
					CString sTemp;
					sTemp.Format( _T("%f%%"), m_dY );
					sResult += sTemp;
				}


				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_Vector2D_Units_Or_Percentage)

		private:

			double m_dX; 
			double m_dY; 

			bool   m_bUnitsX;
			bool   m_bUnitsY;
		};
		
		
		
		class CVml_TextBoxInset
		{
		public:
			CVml_TextBoxInset() 
			{
				Set( 0, 0, 0, 0 );
			}

			double GetLeft(int nIndex) const
			{
				return m_dLeft;
			}
			double GetTop(int nIndex) const
			{
				return m_dTop;
			}
			double GetRight(int nIndex) const
			{
				return m_dRight;
			}
			double GetBottom(int nIndex) const
			{
				return m_dBottom;
			}

			void Set(double dL, double dT, double dR, double dB)
			{
				m_dLeft   = dL;
				m_dTop    = dT;
				m_dRight  = dR;
				m_dBottom = dB;
			}

			double FromString(CString &sValue)
			{
				Set( 0, 0, 0, 0 );

				int nLen = sValue.GetLength();
				if ( nLen <= 0 )
					return 0;

				
				sValue.Replace( _T(","), _T(" ") );
				while ( -1 != sValue.Find( _T("  ") ) )
					sValue.Replace( _T("  "), _T(" ") );

				int nStartPos = 0;
				if ( ' ' == sValue[0] )
					nStartPos++;

				
				int nEndPos = sValue.Find( _T(" "), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				SimpleTypes::CPoint oPtLeft = sValue.Mid( nStartPos, nEndPos - nStartPos );
				m_dLeft = oPtLeft.GetValue();

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(" "), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				SimpleTypes::CPoint oPtTop = sValue.Mid( nStartPos, nEndPos - nStartPos );
				m_dTop = oPtTop.GetValue();

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(" "), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				SimpleTypes::CPoint oPtRight = sValue.Mid( nStartPos, nEndPos - nStartPos );
				m_dRight = oPtRight.GetValue();

				
				nStartPos = nEndPos + 1;
				nEndPos = sValue.Find( _T(" "), nStartPos );
				if ( -1 == nEndPos )
					nEndPos = nLen;

				SimpleTypes::CPoint oPtBottom = sValue.Mid( nStartPos, nEndPos - nStartPos );
				m_dBottom = oPtBottom.GetValue();

				return 0;
			}

			CString ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%fpt,%fpt,%fpt,%fpt"), m_dLeft, m_dTop, m_dRight, m_dBottom );
				return sResult;
			}

			SimpleType_FromString2    (double)
			SimpleType_Operator_Equal (CVml_TextBoxInset)

		private:

			double m_dLeft;
			double m_dTop;
			double m_dRight;
			double m_dBottom;
		};
	} 
} 

