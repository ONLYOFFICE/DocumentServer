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


namespace SimpleTypes
{
	
	
	

	class CRelationshipId
	{
	public:
		CRelationshipId() {}

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
		SimpleType_Operator_Equal (CRelationshipId)

	private:

		CString m_sValue;
	};


} 


namespace SimpleTypes
{
	
	
	
	enum ECalendarType
	{
		calendartypeGregorian            =  0,
		calendartypeGregorianArabic      =  1,
		calendartypeGregorianMeFrench    =  2,
		calendartypeGregorianUs          =  3,
		calendartypeGregorianXlitEnglish =  4,
		calendartypeGregorianXlitFrench  =  5,
		calendartypeHebrew               =  6,
		calendartypeHijri                =  7,
		calendartypeJapan                =  8,
		calendartypeKorea                =  9,
		calendartypeNone                 = 10,
		calendartypeSaka                 = 11,
		calendartypeTaiwan               = 12,
		calendartypeThai                 = 13
	};

	template<ECalendarType eDefValue = calendartypeNone>
	class CCalendarType : public CSimpleType<ECalendarType, eDefValue>
	{
	public:
		CCalendarType() {}

		virtual ECalendarType FromString(CString &sValue)
		{
			if      ( _T("gregorian")            == sValue ) m_eValue = calendartypeGregorian;
			else if ( _T("gregorianArabic")      == sValue ) m_eValue = calendartypeGregorianArabic;
			else if ( _T("gregorianMeFrench")    == sValue ) m_eValue = calendartypeGregorianMeFrench; 
			else if ( _T("gregorianUs")          == sValue ) m_eValue = calendartypeGregorianUs; 
			else if ( _T("gregorianXlitEnglish") == sValue ) m_eValue = calendartypeGregorianXlitEnglish; 
			else if ( _T("gregorianXlitFrench")  == sValue ) m_eValue = calendartypeGregorianXlitFrench; 
			else if ( _T("hebrew")               == sValue ) m_eValue = calendartypeHebrew; 
			else if ( _T("hijri")                == sValue ) m_eValue = calendartypeHijri; 
			else if ( _T("japan")                == sValue ) m_eValue = calendartypeJapan; 
			else if ( _T("korea")                == sValue ) m_eValue = calendartypeKorea; 
			else if ( _T("none")                 == sValue ) m_eValue = calendartypeNone; 
			else if ( _T("saka")                 == sValue ) m_eValue = calendartypeSaka; 
			else if ( _T("taiwan")               == sValue ) m_eValue = calendartypeTaiwan; 
			else if ( _T("thai")                 == sValue ) m_eValue = calendartypeThai; 
			else                                             m_eValue = eDefValue; 

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case calendartypeGregorian            : return _T("gregorian");
			case calendartypeGregorianArabic      : return _T("gregorianArabic");
			case calendartypeGregorianMeFrench    : return _T("gregorianMeFrench");
			case calendartypeGregorianUs          : return _T("gregorianUs");
			case calendartypeGregorianXlitEnglish : return _T("gregorianXlitEnglish");
			case calendartypeGregorianXlitFrench  : return _T("gregorianXlitFrench");
			case calendartypeHebrew               : return _T("hebrew");
			case calendartypeHijri                : return _T("hijri");
			case calendartypeJapan                : return _T("japan");
			case calendartypeKorea                : return _T("korea");
			case calendartypeNone                 : return _T("none");
			case calendartypeSaka                 : return _T("saka");
			case calendartypeTaiwan               : return _T("taiwan");
			case calendartypeThai                 : return _T("thai");
			default                               : return _T("none");
			}
		}

		SimpleType_FromString     (ECalendarType)
		SimpleType_Operator_Equal (CCalendarType)
	};

	
	
	
	enum EConformanceClass
	{
		conformanceclassStrict       = 0,
		conformanceclassTransitional = 1
	};

	template<EConformanceClass eDefValue = conformanceclassStrict>
	class CConformanceClass : public CSimpleType<EConformanceClass, conformanceclassStrict>
	{
	public:
		CConformanceClass() {}

		virtual EConformanceClass FromString(CString &sValue)
		{
			if      ( _T("strict")       == sValue ) m_eValue = conformanceclassStrict;
			else if ( _T("transitional") == sValue ) m_eValue = conformanceclassTransitional;
			else                                     m_eValue = eDefValue; 

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case conformanceclassStrict       : return _T("strict");
			case conformanceclassTransitional : return _T("transitional");
			default                           : return _T("strict");
			}
		}

		SimpleType_FromString     (EConformanceClass)
		SimpleType_Operator_Equal (CConformanceClass)
	};
	
	
	

	class CGuid
	{
	public:
		CGuid() {}

		bool    FromString(CString &sValue)
		{
			

			TGuid oZeroGUID = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
			m_oGUID = oZeroGUID;

			if ( sValue.GetLength() != 38 )
				return false;
			
			unsigned __int64 unTemp = 0;

			if ( !HexToInt( sValue.Mid( 1, 8 ), unTemp ) )
				return false;

			m_oGUID.a = (unsigned int)unTemp;

			if ( !HexToInt( sValue.Mid( 10, 4 ), unTemp ) )
				return false;

			m_oGUID.b = (unsigned short)unTemp;

			if ( !HexToInt( sValue.Mid( 15, 4 ), unTemp ) )
				return false;

			m_oGUID.c = (unsigned short)unTemp;

			if ( !HexToInt( sValue.Mid( 20, 2 ), unTemp ) )
				return false;

			m_oGUID.d = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 22, 2 ), unTemp ) )
				return false;

			m_oGUID.e = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 25, 2 ), unTemp ) )
				return false;

			m_oGUID.f = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 27, 2 ), unTemp ) )
				return false;

			m_oGUID.g = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 29, 2 ), unTemp ) )
				return false;

			m_oGUID.h = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 31, 2 ), unTemp ) )
				return false;

			m_oGUID.i = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 33, 2 ), unTemp ) )
				return false;

			m_oGUID.j = (unsigned char)unTemp;

			if ( !HexToInt( sValue.Mid( 35, 2 ), unTemp ) )
				return false;

			m_oGUID.k = (unsigned char)unTemp;

			return true;
		}

		bool    FromString(const BSTR bsValue)
		{
			CString sTemp( bsValue );
			return FromString( (CString &)sTemp );
		}
		bool    FromString(const wchar_t* cwsStr)
		{
			CWCharWrapper wsStr = cwsStr;
			return FromString( (const CWCharWrapper&)wsStr );
		}
		bool    FromString(const CWCharWrapper& wsStr)
		{
			
			CString sTemp( wsStr.m_cwsString );
			return FromString( (CString &)sTemp );
		}
		CString ToString  () const 
		{
			CString sResult;
			sResult.Format( _T("{%08X-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X}"), m_oGUID.a, m_oGUID.b, m_oGUID.c, m_oGUID.d, m_oGUID.e, m_oGUID.f, m_oGUID.g, m_oGUID.h, m_oGUID.i, m_oGUID.j, m_oGUID.k );
			return sResult;
		}

		SimpleType_Operator_Equal (CGuid)

	private:

		bool HexToInt(CString& sValue, unsigned __int64& unResult)
		{
			bool bResult = true;

			unResult = 0;
			for ( int nIndex = sValue.GetLength() - 1, nMult = 0; nIndex >= 0; nIndex--, nMult += 4 )
			{
				unResult += HexToInt( (int)sValue[nIndex], bResult ) << nMult;
			}

			return bResult;
		}

		int	 HexToInt(int nHex, bool &bResult)
		{
			if ( nHex >= '0' && nHex <= '9' ) return (nHex - '0');
			if ( nHex >= 'a' && nHex <= 'f' ) return (nHex - 'a' + 10);
			if ( nHex >= 'A' && nHex <= 'F' ) return (nHex - 'A' + 10);

			bResult = false;

			return 0;
		}


	public:

		struct TGuid
		{
			unsigned int   a;
			unsigned short b;
			unsigned short c;
			unsigned char  d;
			unsigned char  e;
			unsigned char  f;
			unsigned char  g;
			unsigned char  h;
			unsigned char  i;
			unsigned char  j;
			unsigned char  k;
		} m_oGUID;

	};
	
	
	
	template<int nDefValue = 0>
	class CHexColorRGB : public CSimpleType<int, nDefValue>
	{
	public:
		CHexColorRGB() 
		{
			m_unR = 0;
			m_unG = 0;
			m_unB = 0;
			m_unA = 255;
		}

		virtual int     FromString(CString &sValue)
		{
			if ( 6 <= sValue.GetLength() )
				Parse( sValue.Mid( 0, 6 ) );
			else
				m_eValue = nDefValue;    

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			CString sResult;

			sResult.Format( _T("%.6X"), m_eValue );

			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CHexColorRGB)
		unsigned char Get_R() const
		{
			return m_unR;
		}
		unsigned char Get_G() const
		{
			return m_unG;
		}

		unsigned char Get_B() const
		{
			return m_unB;
		}
		unsigned char Get_A() const
		{
			return m_unA;
		}

		void          Set_RGBA(unsigned char unR, unsigned char unG, unsigned char unB, unsigned char unA = 255)
		{
			m_unR = unR;
			m_unG = unG;
			m_unB = unB;
			m_unA = unA;

			m_eValue = ((int)m_unR << 16) + ((int)m_unG << 8) + m_unB;
		}

	private:

		void Parse(CString& sValue)
		{
			if ( sValue.GetLength() < 6 )
				return;

			m_unR = HexToInt( (int)sValue[1] ) + (unsigned char)(HexToInt( (int)sValue[0] ) << 4);
			m_unG = HexToInt( (int)sValue[3] ) + (unsigned char)(HexToInt( (int)sValue[2] ) << 4);
			m_unB = HexToInt( (int)sValue[5] ) + (unsigned char)(HexToInt( (int)sValue[4] ) << 4);
			m_unA = 255;

			m_eValue = ((int)m_unR << 16) + ((int)m_unG << 8) + m_unB;
		}

		int	HexToInt(int nHex)
		{
			if ( nHex >= '0' && nHex <= '9' ) return (nHex - '0');
			if ( nHex >= 'a' && nHex <= 'f' ) return (nHex - 'a' + 10);
			if ( nHex >= 'A' && nHex <= 'F' ) return (nHex - 'A' + 10);

			return 0;
		}

	private:

		unsigned char m_unR;
		unsigned char m_unG;
		unsigned char m_unB;	
		unsigned char m_unA;
	};

	
	
	

	
	class CLang
	{
	public:
		CLang() {}

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
		SimpleType_Operator_Equal (CLang)

	private:

		CString m_sValue;
	};


	
	
	

	
	enum EOnOff
	{
		onoffFalse = 0,
		onoffTrue  = 1
	};
	enum EOnOffToString
	{
		onofftostringTrue = 0,
		onofftostringT = 1,
		onofftostringOn  = 2,
		onofftostring1  = 3
	};
	template<EOnOff eDefValue = onoffFalse>
	class COnOff : public CSimpleType<EOnOff, eDefValue>
	{
	public:
		COnOff() {}

		virtual EOnOff  FromString(CString &sValue)
		{
			if      ( _T("true")  == sValue ) m_eValue = onoffTrue;
			else if ( _T("True")  == sValue ) m_eValue = onoffTrue;
			else if ( _T("1")     == sValue ) m_eValue = onoffTrue;
			else if ( _T("t")     == sValue ) m_eValue = onoffTrue;
			else if ( _T("on")    == sValue ) m_eValue = onoffTrue;
			else if ( _T("f")     == sValue ) m_eValue = onoffFalse; 
			else if ( _T("0")     == sValue ) m_eValue = onoffFalse; 
			else if ( _T("false") == sValue ) m_eValue = onoffFalse;
			else if ( _T("False") == sValue ) m_eValue = onoffFalse;
			else if ( _T("off")   == sValue ) m_eValue = onoffFalse;
			else                              m_eValue = eDefValue; 

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case onoffFalse : return _T("false");
			case onoffTrue  : return _T("true");
			default         : return _T("false");
			}
		}
		CString ToString2(EOnOffToString eType) const 
		{
			if(onofftostringTrue == eType)
			{
				switch(m_eValue)
				{
				case onoffFalse : return _T("false");
				case onoffTrue  : return _T("true");
				default         : return _T("false");
				}
			}
			else if(onofftostring1 == eType)
			{
				switch(m_eValue)
				{
				case onoffFalse : return _T("0");
				case onoffTrue  : return _T("1");
				default         : return _T("0");
				}
			}
			else if(onofftostringOn == eType)
			{
				switch(m_eValue)
				{
				case onoffFalse : return _T("off");
				case onoffTrue  : return _T("on");
				default         : return _T("off");
				}
			}
			else if(onofftostringT == eType)
			{
				switch(m_eValue)
				{
				case onoffFalse : return _T("f");
				case onoffTrue  : return _T("t");
				default         : return _T("f");
				}
			}
			return _T("false");
		}
		bool ToBool() 
		{
			return onoffTrue == m_eValue;
		}
		void FromBool(bool bVal) 
		{
			m_eValue = (false != bVal) ? onoffTrue : onoffFalse;
		}

		SimpleType_FromString     (EOnOff)
		SimpleType_Operator_Equal (COnOff)
	};

	
	
	

	class CPanose
	{
	public:
		CPanose() {}

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
			if ( 20 > sValue.GetLength() )
			{
				m_sValue = sValue;
				for ( int nIndex = 0; nIndex < 20 - sValue.GetLength(); nIndex++ )
				{
					m_sValue += _T("0");
				}
			}
			else if ( 20 == sValue.GetLength() )
				m_sValue = sValue;
			else
			{
				m_sValue = sValue.Mid( 0, 20 );
			}

			return m_sValue;
		}

		CString ToString  () const 
		{
			return m_sValue;
		}

		SimpleType_FromString2    (CString)
		SimpleType_Operator_Equal (CPanose)

		unsigned char Get_Number(int nIndex)
		{
			if ( m_sValue.GetLength() < 20 )
				return 0;

			nIndex = max( 0, min( 9, nIndex ) );

			unsigned int unChar1 = XmlUtils::GetDigit( m_sValue[2 * nIndex] );
			unsigned int unChar2 = XmlUtils::GetDigit( m_sValue[2 * nIndex + 1] );

			return (unChar2 + (unsigned char)(unChar1 << 4));
		}

	private:

		CString m_sValue;
	};


	
	
	

	

	
	
	

	class CTwipsMeasure : public CUniversalMeasure
	{
	public:
		CTwipsMeasure() {}

		virtual double  FromString(CString &sValue)
		{
			Parse(sValue, 20);

			
			m_dValue = fabs( m_dValue );

			return m_dValue;
		}

		virtual CString ToString  () const 
		{
			CString sResult;

			if ( m_bUnit )
				sResult.Format( _T("%fpt"), m_dValue);
			else
				sResult.Format( _T("%d"), (int)(m_dValue * 20) );

			return sResult;
		}

		virtual double FromPoints(double dValue)
		{
			m_dValue = fabs( dValue );
			return m_dValue;
		}
		virtual double FromInches(double dValue)
		{
			m_dValue = fabs( dValue ) * 72;
			return m_dValue;
		}


  
		SimpleType_FromString          (double)
		SimpleType_Operator_Equal      (CTwipsMeasure)
		UniversalMeasure_AdditionalOpearators(CTwipsMeasure)
	};




	
	
	

	template<unsigned int unDefValue = 0>
	class CUnsignedDecimalNumber : public CSimpleType<unsigned int, unDefValue>
	{
	public:
		CUnsignedDecimalNumber() {}

		virtual unsigned int FromString(CString &sValue)
		{
			m_eValue = _wtoi( sValue );

			return m_eValue;
		}

		virtual CString      ToString  () const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue);

			return sResult;
		}


		SimpleType_FromString     (unsigned int)
		SimpleType_Operator_Equal (CUnsignedDecimalNumber)
	};

	
	
	

	enum EVerticalAlignRun
	{
		verticalalignrunBaseline    = 0,
		verticalalignrunSubscript   = 1,
		verticalalignrunSuperscript = 2
	};

	template<EVerticalAlignRun eDefValue = verticalalignrunBaseline>
	class CVerticalAlignRun : public CSimpleType<EVerticalAlignRun, eDefValue>
	{
	public:
		CVerticalAlignRun() {}

		virtual EVerticalAlignRun    FromString(CString &sValue)
		{
			if      ( _T("baseline")    == sValue ) m_eValue = verticalalignrunBaseline;
			else if ( _T("subscript")   == sValue ) m_eValue = verticalalignrunSubscript;   
			else if ( _T("superscript") == sValue ) m_eValue = verticalalignrunSuperscript; 
			else                                    m_eValue = eDefValue;   

			return m_eValue;
		}

		virtual CString              ToString  () const 
		{
			switch(m_eValue)
			{
			case verticalalignrunBaseline    : return _T("baseline");
			case verticalalignrunSubscript   : return _T("subscript");
			case verticalalignrunSuperscript : return _T("superscript");
			default                          : return _T("baseline");
			}
		}

		SimpleType_FromString     (EVerticalAlignRun)
		SimpleType_Operator_Equal (CVerticalAlignRun)
	};


	
	
	

	enum EXAlign
	{
		xalignCenter  = 0,
		xalignInside  = 1,
		xalignLeft    = 2,
		xalignOutside = 3,
		xalignRight   = 4
	};

	template<EXAlign eDefValue = xalignLeft>
	class CXAlign : public CSimpleType<EXAlign, eDefValue>
	{
	public:
		CXAlign() {}

		virtual EXAlign FromString(CString &sValue)
		{
			if      ( _T("center")  == sValue ) m_eValue = xalignCenter;
			else if ( _T("inside")  == sValue ) m_eValue = xalignInside;   
			else if ( _T("left")    == sValue ) m_eValue = xalignLeft; 
			else if ( _T("outside") == sValue ) m_eValue = xalignOutside;   
			else if ( _T("right")   == sValue ) m_eValue = xalignRight; 
			else                                m_eValue = eDefValue;   

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case xalignCenter  : return _T("center");
			case xalignInside  : return _T("inside");
			case xalignLeft    : return _T("left");
			case xalignOutside : return _T("outside");
			case xalignRight   : return _T("right");
			default            : return _T("left");
			}
		}

		SimpleType_FromString     (EXAlign)
		SimpleType_Operator_Equal (CXAlign)
	};




	
	
	

	enum EYAlign
	{
		yalignBottom  = 0,
		yalignCenter  = 1,
		yalignInline  = 2,
		yalignInside  = 3,
		yalignOutside = 4,
		yalignTop     = 5
	};

	template<EYAlign eDefValue = yalignTop>
	class CYAlign : public CSimpleType<EYAlign, eDefValue>
	{
	public:
		CYAlign() {}

		virtual EYAlign FromString(CString &sValue)
		{
			if      ( _T("bottom")  == sValue ) m_eValue = yalignBottom;
			else if ( _T("center")  == sValue ) m_eValue = yalignCenter;   
			else if ( _T("inline")  == sValue ) m_eValue = yalignInline; 
			else if ( _T("inside")  == sValue ) m_eValue = yalignInside;   
			else if ( _T("outside") == sValue ) m_eValue = yalignOutside; 
			else if ( _T("top")     == sValue ) m_eValue = yalignTop; 
			else                                m_eValue = eDefValue;   

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			switch(m_eValue)
			{
			case yalignBottom  : return _T("bottom");
			case yalignCenter  : return _T("center");
			case yalignInline  : return _T("inline");
			case yalignInside  : return _T("inside");
			case yalignOutside : return _T("outside");
			case yalignTop     : return _T("top");
			default            : return _T("top");
			}
		}

		SimpleType_FromString     (EYAlign)
		SimpleType_Operator_Equal (CYAlign)
	};





} 


namespace SimpleTypes
{
	
	
	
	enum EColorType
	{
		colortypeNone,
		colortypeRGB,
		colortypeAqua,
		colortypeBlack,
		colortypeBlue,
		colortypeFuchsia,
		colortypeGray,
		colortypeGreen,
		colortypeLime,
		colortypeMaroon,
		colortypeNavy,
		colortypeOlive,
		colortypePurple,
		colortypeRed,
		colortypeSilver,
		colortypeTeal,
		colortypeWhite,
		colortypeYellow,
	};
	template<EColorType eDefValue = colortypeNone>
	class CColorType : public CSimpleType<EColorType, eDefValue>
	{
	public:
		CColorType()
		{
			m_unR = 0;
			m_unB = 0;
			m_unG = 0;
		}

		virtual EColorType FromString(CString& sValue)
		{
			wchar_t wsFirstChar = 0;
			if (sValue.GetLength() > 0)
				wsFirstChar = sValue[0];

			m_sValue = sValue;
			if (wsFirstChar == _T('#'))
				ByHexColor(sValue.Mid(1));
			else
				ByColorName(sValue);

			return m_eValue;
		}

		virtual CString ToString() const
		{
			return m_sValue;			
		}

		void SetRGB(unsigned char unR, unsigned char unG, unsigned char unB)
		{
			m_eValue = colortypeRGB;
			m_unR = unR;
			m_unG = unG;
			m_unB = unB;

			m_sValue.Format( _T("#%02X%02X%02X"), unR, unG, unB );
		}

		SimpleType_FromString     (EColorType)
		SimpleType_Operator_Equal (CColorType)

		unsigned char Get_R() const
		{
			return m_unR;
		}
		unsigned char Get_G() const
		{
			return m_unG;
		}

		unsigned char Get_B() const
		{
			return m_unB;
		}
		unsigned char Get_A() const
		{
			return 255;
		}



	private:
		void ByHexColor(CString& sValue)
		{
			m_eValue = colortypeRGB;

			CHexColor<> hexColor;
			hexColor.FromString(sValue);

			m_unR = hexColor.Get_R();
			m_unG = hexColor.Get_G();
			m_unB = hexColor.Get_B();
		}

		void ByColorName(CString& sValue)
		{
			if      (_T("aqua")		== sValue)
			{
				m_eValue = colortypeAqua;
				m_unR = 0x00;
				m_unG = 0xff;
				m_unB = 0xff;
			}
			else if (_T("black")	== sValue)
			{
				m_eValue = colortypeBlack;
				m_unR = 0x00;
				m_unG = 0x00;
				m_unB = 0x00;
			}
			else if (_T("blue")		== sValue)
			{
				m_eValue = colortypeBlue;
				m_unR = 0x00;
				m_unG = 0x00;
				m_unB = 0xff;
			}
			else if (_T("fuchsia")	== sValue)
			{
				m_eValue = colortypeFuchsia;
				m_unR = 0xff;
				m_unG = 0x00;
				m_unB = 0xff;
			}
			else if (_T("gray")		== sValue)
			{
				m_eValue = colortypeGray;
				m_unR = 0x80;
				m_unG = 0x80;
				m_unB = 0x80;
			}
			else if (_T("green")	== sValue)
			{
				m_eValue = colortypeGreen;
				m_unR = 0x00;
				m_unG = 0x80;
				m_unB = 0x00;
			}
			else if (_T("lime")		== sValue)
			{
				m_eValue = colortypeLime;
				m_unR = 0x00;
				m_unG = 0xff;
				m_unB = 0x00;
			}
			else if (_T("maroon")	== sValue)
			{
				m_eValue = colortypeMaroon;
				m_unR = 0x80;
				m_unG = 0x00;
				m_unB = 0x00;
			}
			else if (_T("navy")		== sValue)
			{
				m_eValue = colortypeNavy;
				m_unR = 0x00;
				m_unG = 0x00;
				m_unB = 0x80;
			}
			else if (_T("olive")	== sValue)
			{
				m_eValue = colortypeOlive;
				m_unR = 0x80;
				m_unG = 0x80;
				m_unB = 0x00;
			}
			else if (_T("purple")	== sValue)
			{
				m_eValue = colortypePurple;
				m_unR = 0x80;
				m_unG = 0x00;
				m_unB = 0x80;
			}
			else if (_T("red")		== sValue)
			{
				m_eValue = colortypeRed;
				m_unR = 0xff;
				m_unG = 0x00;
				m_unB = 0x00;
			}
			else if (_T("silver")	== sValue)
			{
				m_eValue = colortypeSilver;
				m_unR = 0xc0;
				m_unG = 0xc0;
				m_unB = 0xc0;
			}
			else if (_T("teal")		== sValue)
			{
				m_eValue = colortypeTeal;
				m_unR = 0x00;
				m_unG = 0x80;
				m_unB = 0x80;
			}
			else if (_T("white")	== sValue)
			{
				m_eValue = colortypeWhite;
				m_unR = 0xff;
				m_unG = 0xff;
				m_unB = 0xff;
			}
			else if (_T("yellow")	== sValue)
			{
				m_eValue = colortypeYellow;
				m_unR = 0xff;
				m_unG = 0xff;
				m_unB = 0;
			}
			else
			{
				m_eValue = colortypeNone;
				m_unR = 0;
				m_unG = 0;
				m_unB = 0;
			}
		}

	private:

		CString m_sValue;

		unsigned char m_unR;
		unsigned char m_unG;
		unsigned char m_unB;
	};
	
	
	

	enum ETrueFalse
	{
		booleanFalse = 0,
		booleanTrue  = 1
	};

	template<ETrueFalse eDefValue = booleanFalse>
	class CTrueFalse : public CSimpleType<ETrueFalse, eDefValue>
	{
	public:
		CTrueFalse() {}

		virtual ETrueFalse FromString(CString &sValue)
		{
			if      ( _T("t")     == sValue ) m_eValue = booleanTrue;
			else if ( _T("true")  == sValue ) m_eValue = booleanTrue; 
			else if ( _T("True")  == sValue ) m_eValue = booleanTrue;  
			else if ( _T("")      == sValue ) m_eValue = booleanFalse; 
			else if ( _T("f")     == sValue ) m_eValue = booleanFalse; 
			else if ( _T("false") == sValue ) m_eValue = booleanFalse; 
			else if ( _T("False") == sValue ) m_eValue = booleanFalse;
			else                              m_eValue = booleanFalse; 

			return m_eValue;
		}

		virtual CString    ToString  () const 
		{
			switch(m_eValue)
			{
			case booleanFalse : return _T("f");
			case booleanTrue  : return _T("t");
			default           : return _T("f");
			}
		}

		SimpleType_FromString     (ETrueFalse)
		SimpleType_Operator_Equal (CTrueFalse)
	};
} 
