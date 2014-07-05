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
#include "../Common/SimpleTypes_Base.h"

namespace SimpleTypes
{
	namespace Spreadsheet
	{	
		enum EVisibleType
		{
			visibleHidden		=  0,
			visibleVeryHidden	=  1,
			visibleVisible		=  2,
		};

		template<EVisibleType eDefValue = visibleVisible>
		class CVisibleType : public CSimpleType<EVisibleType, eDefValue>
		{
		public:
			CVisibleType() {}

			virtual EVisibleType FromString(CString &sValue)
			{
				if      ( _T("hidden")            == sValue ) m_eValue = visibleHidden;
				else if ( _T("veryHidden")      == sValue ) m_eValue = visibleVeryHidden;
				else if ( _T("visible")    == sValue ) m_eValue = visibleVisible; 
				else                                             m_eValue = eDefValue; 

				return m_eValue;
			}

			virtual CString       ToString  () const 
			{
				switch(m_eValue)
				{
				case visibleHidden : return _T("hidden");break;
				case visibleVeryHidden : return _T("veryHidden");break;
				case visibleVisible : return _T("visible");break;
				default : return _T("visible");

				}
			}

			SimpleType_FromString     (EVisibleType)
				SimpleType_Operator_Equal (CVisibleType)
		};

		enum EPhoneticAlignmentType
		{
			phoneticalignmentCenter			=  0,
			phoneticalignmentDistributed	=  1,
			phoneticalignmentLeft			=  2,
			phoneticalignmentNoControl 		=  3,
		};

		template<EPhoneticAlignmentType eDefValue = phoneticalignmentNoControl>
		class CPhoneticAlignment : public CSimpleType<EPhoneticAlignmentType, eDefValue>
		{
		public:
			CPhoneticAlignment() {}

			virtual EPhoneticAlignmentType FromString(CString &sValue)
			{
				if      ( _T("center")            == sValue ) m_eValue = phoneticalignmentCenter;
				else if ( _T("distributed")      == sValue ) m_eValue = phoneticalignmentDistributed;
				else if ( _T("left")    == sValue ) m_eValue = phoneticalignmentLeft; 
				else if ( _T("noControl")    == sValue ) m_eValue = phoneticalignmentNoControl; 
				else                                             m_eValue = eDefValue; 

				return m_eValue;
			}

			virtual CString       ToString  () const 
			{
				return _T("noControl");
			}

			SimpleType_FromString     (EPhoneticAlignmentType)
				SimpleType_Operator_Equal (CPhoneticAlignment)
		};

		enum EPhoneticTypeType
		{
			phonetictypeFullwidthKatakana			=  0,
			phonetictypeHalfwidthKatakana			=  1,
			phonetictypeHiragana					=  2,
			phonetictypeNoConversion 				=  3,
		};

		template<EPhoneticTypeType eDefValue = phonetictypeNoConversion>
		class CPhoneticType : public CSimpleType<EPhoneticTypeType, eDefValue>
		{
		public:
			CPhoneticType() {}

			virtual EPhoneticTypeType FromString(CString &sValue)
			{
				if      ( _T("fullwidthKatakana")            == sValue ) m_eValue = phonetictypeFullwidthKatakana;
				else if ( _T("halfwidthKatakana")      == sValue ) m_eValue = phonetictypeHalfwidthKatakana;
				else if ( _T("hiragana")    == sValue ) m_eValue = phonetictypeHiragana; 
				else if ( _T("noConversion")    == sValue ) m_eValue = phonetictypeNoConversion; 
				else                                             m_eValue = eDefValue; 

				return m_eValue;
			}

			virtual CString       ToString  () const 
			{
				return _T("noConversion");
			}

			SimpleType_FromString     (EPhoneticTypeType)
				SimpleType_Operator_Equal (CPhoneticType)
		};




		enum EFontCharset
		{
			fontcharsetANSI        =   0, 
			fontcharsetDefault     =   1, 
			fontcharsetSymbol      =   2, 
			fontcharsetMacintosh   =  77, 
			fontcharsetShitJIS     = 128, 
			fontcharsetHangeul     = 129, 
			fontcharsetJohab       = 130, 
			fontcharsetGB2313      = 134, 
			fontcharsetChineseBig5 = 136, 
			fontcharsetGreek       = 161, 
			fontcharsetTurkish     = 162, 
			fontcharsetVietnamese  = 163, 
			fontcharsetHebrew      = 177, 
			fontcharsetArabic      = 178, 
			fontcharsetBaltic      = 186, 
			fontcharsetRussian     = 204, 
			fontcharsetThai        = 222, 
			fontcharsetEastEurope  = 238, 
			fontcharsetOEM         = 255, 
		};

		template<EFontCharset eDefValue = fontcharsetANSI>
		class CFontCharset : public CSimpleType<EFontCharset, eDefValue>
		{
		public:
			CFontCharset() {}

			virtual EFontCharset FromString(CString &sValue)
			{
				int nCharset = _wtoi(sValue);
				switch(nCharset)
				{
				case 0: m_eValue = fontcharsetANSI;break;
				case 1: m_eValue = fontcharsetDefault;break;
				case 2: m_eValue = fontcharsetSymbol;break;
				case 77: m_eValue = fontcharsetMacintosh;break;
				case 128: m_eValue = fontcharsetShitJIS;break;
				case 129: m_eValue = fontcharsetHangeul;break;
				case 130: m_eValue = fontcharsetJohab;break;
				case 134: m_eValue = fontcharsetGB2313;break;
				case 136: m_eValue = fontcharsetChineseBig5;break;
				case 161: m_eValue = fontcharsetGreek;break;
				case 162: m_eValue = fontcharsetTurkish;break;
				case 163: m_eValue = fontcharsetVietnamese;break;
				case 177: m_eValue = fontcharsetHebrew;break;
				case 178: m_eValue = fontcharsetArabic;break;
				case 186: m_eValue = fontcharsetBaltic;break;
				case 204: m_eValue = fontcharsetRussian;break;
				case 222: m_eValue = fontcharsetThai;break;
				case 238: m_eValue = fontcharsetEastEurope;break;
				case 255: m_eValue = fontcharsetOEM;break;
				default:m_eValue = eDefValue;
				}

				return m_eValue;
			}

			virtual CString       ToString  () const 
			{
				CString sRes;
				sRes.Format(_T("%d"), (long)m_eValue);
				return sRes;
			}
			virtual CString       ToHexString  () const 
			{
				CString sRes;
				switch(m_eValue)
				{
				case fontcharsetANSI: sRes = _T("00");break;
				case fontcharsetDefault: sRes = _T("01");break;
				case fontcharsetSymbol: sRes = _T("02");break;
				case fontcharsetMacintosh: sRes = _T("4D");break;
				case fontcharsetShitJIS: sRes = _T("80");break;
				case fontcharsetHangeul: sRes = _T("81");break;
				case fontcharsetJohab: sRes = _T("82");break;
				case fontcharsetGB2313: sRes = _T("86");break;
				case fontcharsetChineseBig5: sRes = _T("88");break;
				case fontcharsetGreek: sRes = _T("A1");break;
				case fontcharsetTurkish: sRes = _T("A2");break;
				case fontcharsetVietnamese: sRes = _T("A3");break;
				case fontcharsetHebrew: sRes = _T("B1");break;
				case fontcharsetArabic: sRes = _T("B2");break;
				case fontcharsetBaltic: sRes = _T("BA");break;
				case fontcharsetRussian: sRes = _T("CC");break;
				case fontcharsetThai: sRes = _T("DE");break;
				case fontcharsetEastEurope: sRes = _T("EE");break;
				case fontcharsetOEM: sRes = _T("FF");break;
				}
				return sRes;
			}

			SimpleType_FromString     (EFontCharset)
				SimpleType_Operator_Equal (CFontCharset)
		};

		enum EThemeColor
		{
			themecolorDark1             =  0,
			themecolorLight1            =  1,
			themecolorDark2             =  2,
			themecolorLight2            =  3,
			themecolorAccent1           =  4,
			themecolorAccent2           =  5,
			themecolorAccent3           =  6,
			themecolorAccent4           =  7,
			themecolorAccent5           =  8,
			themecolorAccent6           =  9,
			themecolorHyperlink         = 10,
			themecolorFollowedHyperlink = 11
		};

		template<EThemeColor eDefValue = themecolorDark1>
		class CThemeColor : public CSimpleType<EThemeColor, eDefValue>
		{
		public:
			CThemeColor() {}

			virtual EThemeColor FromString(CString &sValue)
			{
				int nThemeColor = _wtoi(sValue);
				switch(nThemeColor)
				{
				case 0:m_eValue = themecolorDark1;break;
				case 1:m_eValue = themecolorLight1;break;
				case 2:m_eValue = themecolorDark2;break;
				case 3:m_eValue = themecolorLight2;break;
				case 4:m_eValue = themecolorAccent1;break;
				case 5:m_eValue = themecolorAccent2;break;
				case 6:m_eValue = themecolorAccent3;break;
				case 7:m_eValue = themecolorAccent4;break;
				case 8:m_eValue = themecolorAccent5;break;
				case 9:m_eValue = themecolorAccent6;break;
				case 10:m_eValue = themecolorHyperlink;break;
				case 11:m_eValue = themecolorFollowedHyperlink;break;
				default:m_eValue = eDefValue;
				}
				return m_eValue;
			}
			virtual CString     ToString  () const 
			{
				return _T("0");
			}

			SimpleType_FromString     (EThemeColor)
				SimpleType_Operator_Equal (CThemeColor)
		};

		class CHexColor
		{
		public:
			CHexColor() 
			{
				m_unA = 255;
				m_unR = 0;
				m_unG = 0;
				m_unB = 0;
			}
			CHexColor(unsigned char r, unsigned char g, unsigned char b, unsigned char a = 255) 
			{
				m_unA = a;
				m_unR = r;
				m_unG = g;
				m_unB = b;
			}
			CHexColor(const wchar_t* cwsValue)
			{
				FromString( cwsValue );
			}

			virtual void FromString(CString sValue)
			{
				Parse(sValue);
			}

			virtual CString   ToString  () const 
			{
				CString sResult;
				if(m_unA > 0x0f)
					sResult.AppendFormat(_T("%X"), m_unA);
				else
					sResult.AppendFormat(_T("0%X"), m_unA);
				if(m_unR > 0x0f)
					sResult.AppendFormat(_T("%X"), m_unR);
				else
					sResult.AppendFormat(_T("0%X"), m_unR);
				if(m_unG > 0x0f)
					sResult.AppendFormat(_T("%X"), m_unG);
				else
					sResult.AppendFormat(_T("0%X"), m_unG);
				if(m_unB > 0x0f)
					sResult.AppendFormat(_T("%X"), m_unB);
				else
					sResult.AppendFormat(_T("0%X"), m_unB);
				return sResult;
			}
			void Set_R(unsigned char R)
			{
				m_unR = R;
			}
			void Set_G(unsigned char G)
			{
				m_unG = G;
			}
			void Set_B(unsigned char B)
			{
				m_unB = B;
			}
			void Set_A(unsigned char A)
			{
				m_unA = A;
			}
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
			int ToInt() const
			{
				int nRes = m_unB;
				nRes += m_unG << 8;
				nRes += m_unR << 16;
				nRes += m_unA << 24;
				return nRes;
			}
			void FromInt(int nColor)
			{
				m_unB = static_cast<unsigned char>(nColor & 0xFF);
				m_unG = static_cast<unsigned char>((nColor & 0xFF00)>>8);
				m_unR = static_cast<unsigned char>((nColor & 0xFF0000)>>16);
				m_unA = 255;
			}
		private:

			void Parse(CString& sValue)
			{
				int nValueLength = sValue.GetLength();
				if(3 == nValueLength)
				{
					int nTempR = HexToInt( (int)sValue[0] );
					int nTempG = HexToInt( (int)sValue[1] );
					int nTempB = HexToInt( (int)sValue[2] );
					m_unR = nTempR +  (unsigned char)(nTempR << 4);
					m_unG = nTempG +  (unsigned char)(nTempG << 4);
					m_unB = nTempB +  (unsigned char)(nTempB << 4);
				}
				else if(6 == nValueLength)
				{
					m_unR = HexToInt( (int)sValue[1] ) + (unsigned char)(HexToInt( (int)sValue[0] ) << 4);
					m_unG = HexToInt( (int)sValue[3] ) + (unsigned char)(HexToInt( (int)sValue[2] ) << 4);
					m_unB = HexToInt( (int)sValue[5] ) + (unsigned char)(HexToInt( (int)sValue[4] ) << 4);
				}
				else if(8 == nValueLength)
				{
					m_unA = HexToInt( (int)sValue[1] ) + (unsigned char)(HexToInt( (int)sValue[0] ) << 4);
					m_unR = HexToInt( (int)sValue[3] ) + (unsigned char)(HexToInt( (int)sValue[2] ) << 4);
					m_unG = HexToInt( (int)sValue[5] ) + (unsigned char)(HexToInt( (int)sValue[4] ) << 4);
					m_unB = HexToInt( (int)sValue[7] ) + (unsigned char)(HexToInt( (int)sValue[6] ) << 4);
				}
			}

			int	HexToInt(int nHex)
			{
				if ( nHex >= '0' && nHex <= '9' ) return (nHex - '0');
				if ( nHex >= 'a' && nHex <= 'f' ) return (nHex - 'a' + 10);
				if ( nHex >= 'A' && nHex <= 'F' ) return (nHex - 'A' + 10);

				return 0;
			}
		private:
			unsigned char m_unA;
			unsigned char m_unR;
			unsigned char m_unG;
			unsigned char m_unB;		
		};


		enum EFontFamily
		{
			fontfamilyNotApplicable		=  0,
			fontfamilyRoman				=  1,
			fontfamilySwiss				=  2,
			fontfamilyModern			=  3,
			fontfamilyScript			=  4,
			fontfamilyDecorative		=  5,
		};
		template<EFontFamily eDefValue = fontfamilyNotApplicable>
		class CFontFamily : public CSimpleType<EFontFamily, eDefValue>
		{
		public:
			CFontFamily() {}

			virtual EFontFamily FromString(CString &sValue)
			{
				int nFontFamily = _wtoi(sValue);
				switch(nThemeColor)
				{
				case 0:m_eValue = fontfamilyNotApplicable;break;
				case 1:m_eValue = fontfamilyRoman;break;
				case 2:m_eValue = fontfamilySwiss;break;
				case 3:m_eValue = fontfamilyModern;break;
				case 4:m_eValue = fontfamilyScript;break;
				case 5:m_eValue = fontfamilyDecorative;break;
				default:m_eValue = eDefValue;
				}
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				default                          : return _T("0");
				}
			}

			SimpleType_FromString     (EFontFamily)
				SimpleType_Operator_Equal (CFontFamily)
		};

		enum EFontScheme
		{
			fontschemeMajor		=  0,
			fontschemeMinor		=  1,
			fontschemeNone		=  2
		};
		template<EFontScheme eDefValue = fontschemeNone>
		class CFontScheme : public CSimpleType<EFontScheme, eDefValue>
		{
		public:
			CFontScheme() {}

			virtual EFontScheme FromString(CString &sValue)
			{
				if(_T("major") == sValue)
					m_eValue = fontschemeMajor;
				else if(_T("minor") == sValue)
					m_eValue = fontschemeMinor;
				else if(_T("none") == sValue)
					m_eValue = fontschemeNone;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sRes;
				switch(m_eValue)
				{
				case fontschemeMajor: sRes = _T("major");break;
				case fontschemeMinor: sRes = _T("minor");break;
				case fontschemeNone: sRes = _T("none");break;
				}
				return sRes;
			}

			SimpleType_FromString     (EFontScheme)
				SimpleType_Operator_Equal (CFontScheme)
		};
		enum EUnderline
		{
			underlineDouble				=  0,
			underlineDoubleAccounting	=  1,
			underlineNone				=  2,
			underlineSingle				=  3,
			underlineSingleAccounting	=  4
		};
		template<EUnderline eDefValue = underlineSingle>
		class CUnderline : public CSimpleType<EUnderline, eDefValue>
		{
		public:
			CUnderline() {}

			virtual EUnderline FromString(CString &sValue)
			{
				if(_T("double") == sValue)
					m_eValue = underlineDouble;
				else if(_T("doubleAccounting") == sValue)
					m_eValue = underlineDoubleAccounting;
				else if(_T("none") == sValue)
					m_eValue = underlineNone;
				else if(_T("single") == sValue)
					m_eValue = underlineSingle;
				else if(_T("singleAccounting") == sValue)
					m_eValue = underlineSingleAccounting;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case underlineDouble: return _T("double");break;
				case underlineDoubleAccounting: return _T("doubleAccounting");break;
				case underlineNone: return _T("none");break;
				case underlineSingle: return _T("single");break;
				case underlineSingleAccounting: return _T("singleAccounting");break;
				default: return _T("none");
				}
			}

			SimpleType_FromString     (EUnderline)
				SimpleType_Operator_Equal (CUnderline)
		};

		enum EBorderStyle
		{
			borderstyleDashDot			=  0,
			borderstyleDashDotDot		=  1,
			borderstyleDashed			=  2,
			borderstyleDotted			=  3,
			borderstyleDouble			=  4,
			borderstyleHair				=  5,
			borderstyleMedium			=  6,
			borderstyleMediumDashDot	=  7,
			borderstyleMediumDashDotDot	=  8,
			borderstyleMediumDashed		=  9,
			borderstyleNone				= 10,
			borderstyleSlantDashDot		= 11,
			borderstyleThick			= 12,
			borderstyleThin				= 13
		};
		template<EBorderStyle eDefValue = borderstyleNone>
		class CBorderStyle : public CSimpleType<EBorderStyle, eDefValue>
		{
		public:
			CBorderStyle() {}

			virtual EBorderStyle FromString(CString &sValue)
			{
				if(_T("dashDot") == sValue)
					m_eValue = borderstyleDashDot;
				else if(_T("dashDotDot") == sValue)
					m_eValue = borderstyleDashDotDot;
				else if(_T("dashed") == sValue)
					m_eValue = borderstyleDashed;
				else if(_T("dotted") == sValue)
					m_eValue = borderstyleDotted;
				else if(_T("double") == sValue)
					m_eValue = borderstyleDouble;
				else if(_T("hair") == sValue)
					m_eValue = borderstyleHair;
				else if(_T("medium") == sValue)
					m_eValue = borderstyleMedium;
				else if(_T("mediumDashDot") == sValue)
					m_eValue = borderstyleMediumDashDot;
				else if(_T("mediumDashDotDot") == sValue)
					m_eValue = borderstyleMediumDashDotDot;
				else if(_T("mediumDashed") == sValue)
					m_eValue = borderstyleMediumDashed;
				else if(_T("none") == sValue)
					m_eValue = borderstyleNone;
				else if(_T("slantDashDot") == sValue)
					m_eValue = borderstyleSlantDashDot;
				else if(_T("thick") == sValue)
					m_eValue = borderstyleThick;
				else if(_T("thin") == sValue)
					m_eValue = borderstyleThin;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case borderstyleDashDot : return _T("dashDot");break;
				case borderstyleDashed : return _T("dashed");break;
				case borderstyleDotted : return _T("dotted");break;
				case borderstyleDouble : return _T("double");break;
				case borderstyleHair : return _T("hair");break;
				case borderstyleMedium : return _T("medium");break;
				case borderstyleMediumDashDot : return _T("mediumDashDot");break;
				case borderstyleMediumDashDotDot : return _T("mediumDashDotDot");break;
				case borderstyleMediumDashed : return _T("mediumDashed");break;
				case borderstyleNone : return _T("none");break;
				case borderstyleSlantDashDot : return _T("slantDashDot");break;
				case borderstyleThick : return _T("thick");break;
				case borderstyleThin : return _T("thin");break;
				default:return _T("none");
				}
			}

			SimpleType_FromString     (EBorderStyle)
				SimpleType_Operator_Equal (CBorderStyle)
		};

		enum EHorizontalAlignment
		{
			horizontalalignmentCenter				=  0,
			horizontalalignmentContinuous		=  1,
			horizontalalignmentDistributed			=  2,
			horizontalalignmentFill					=  3,
			horizontalalignmentGeneral				=  4,
			horizontalalignmentJustify				=  5,
			horizontalalignmentLeft					=  6,
			horizontalalignmentRight				=  7
		};
		template<EHorizontalAlignment eDefValue = horizontalalignmentGeneral>
		class CHorizontalAlignment : public CSimpleType<EHorizontalAlignment, eDefValue>
		{
		public:
			CHorizontalAlignment() {}

			virtual EHorizontalAlignment FromString(CString &sValue)
			{
				if(_T("center") == sValue)
					m_eValue = horizontalalignmentCenter;
				else if(_T("continuous") == sValue)
					m_eValue = horizontalalignmentContinuous;
				else if(_T("distributed") == sValue)
					m_eValue = horizontalalignmentDistributed;
				else if(_T("fill") == sValue)
					m_eValue = horizontalalignmentFill;
				else if(_T("general") == sValue)
					m_eValue = horizontalalignmentGeneral;
				else if(_T("justify") == sValue)
					m_eValue = horizontalalignmentJustify;
				else if(_T("left") == sValue)
					m_eValue = horizontalalignmentLeft;
				else if(_T("right") == sValue)
					m_eValue = horizontalalignmentRight;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case horizontalalignmentCenter : return _T("center"); break;
				case horizontalalignmentContinuous : return _T("continuous"); break;
				case horizontalalignmentDistributed : return _T("distributed"); break;
				case horizontalalignmentFill : return _T("fill"); break;
				case horizontalalignmentGeneral : return _T("general"); break;
				case horizontalalignmentJustify : return _T("justify"); break;
				case horizontalalignmentLeft : return _T("left"); break;
				case horizontalalignmentRight : return _T("right"); break;
				default : return _T("general");
				}
			}

			SimpleType_FromString     (EHorizontalAlignment)
				SimpleType_Operator_Equal (CHorizontalAlignment)
		};
		enum EVerticalAlignment
		{
			verticalalignmentBottom				=  0,
			verticalalignmentCenter				=  1,
			verticalalignmentDistributed		=  2,
			verticalalignmentJustify			=  3,
			verticalalignmentTop				=  4
		};
		template<EVerticalAlignment eDefValue = verticalalignmentBottom>
		class CVerticalAlignment : public CSimpleType<EVerticalAlignment, eDefValue>
		{
		public:
			CVerticalAlignment() {}

			virtual EVerticalAlignment FromString(CString &sValue)
			{
				if(_T("bottom") == sValue)
					m_eValue = verticalalignmentBottom;
				else if(_T("center") == sValue)
					m_eValue = verticalalignmentCenter;
				else if(_T("distributed") == sValue)
					m_eValue = verticalalignmentDistributed;
				else if(_T("justify") == sValue)
					m_eValue = verticalalignmentJustify;
				else if(_T("top") == sValue)
					m_eValue = verticalalignmentTop;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case verticalalignmentBottom : return _T("bottom"); break;
				case verticalalignmentCenter : return _T("center"); break;
				case verticalalignmentDistributed : return _T("distributed"); break;
				case verticalalignmentJustify : return _T("justify"); break;
				case verticalalignmentTop : return _T("top"); break;
				default:return _T("bottom");
				}
			}

			SimpleType_FromString     (EVerticalAlignment)
				SimpleType_Operator_Equal (CVerticalAlignment)
		};
		enum EGradientType
		{
			gradienttypeLine				=  0,
			gradienttypePath				=  1
		};
		template<EGradientType eDefValue = gradienttypeLine>
		class CGradientType : public CSimpleType<EGradientType, eDefValue>
		{
		public:
			CGradientType() {}

			virtual EGradientType FromString(CString &sValue)
			{
				if(_T("line") == sValue)
					m_eValue = gradienttypeLine;
				else if(_T("path") == sValue)
					m_eValue = gradienttypePath;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				return _T("line");
			}

			SimpleType_FromString     (EGradientType)
				SimpleType_Operator_Equal (CGradientType)
		};
		enum EPatternType
		{
			patterntypeDarkDown				=  0,
			patterntypeDarkGray				=  1,
			patterntypeDarkGrid				=  2,
			patterntypeDarkHorizontal		=  3,
			patterntypeDarkTrellis			=  4,
			patterntypeDarkUp				=  5,
			patterntypeDarkVertical			=  6,
			patterntypeGray0625				=  7,
			patterntypeGray125				=  8,
			patterntypeLightDown			=  9,
			patterntypeLightGray			= 10,
			patterntypeLightGrid			= 11,
			patterntypeLightHorizontal		= 12,
			patterntypeLightTrellis			= 13,
			patterntypeLightUp			= 14,
			patterntypeLightVertical	= 15,
			patterntypeMediumGray		= 16,
			patterntypeNone					= 17,
			patterntypeSolid				= 18
		};
		template<EPatternType eDefValue = patterntypeNone>
		class CPatternType : public CSimpleType<EPatternType, eDefValue>
		{
		public:
			CPatternType() {}

			virtual EPatternType FromString(CString &sValue)
			{
				if(_T("darkDown") == sValue)
					m_eValue = patterntypeDarkDown;
				else if(_T("darkGray") == sValue)
					m_eValue = patterntypeDarkGray;
				else if(_T("darkGrid") == sValue)
					m_eValue = patterntypeDarkGrid;
				else if(_T("darkHorizontal") == sValue)
					m_eValue = patterntypeDarkHorizontal;
				else if(_T("darkTrellis") == sValue)
					m_eValue = patterntypeDarkTrellis;
				else if(_T("darkUp") == sValue)
					m_eValue = patterntypeDarkUp;
				else if(_T("darkVertical") == sValue)
					m_eValue = patterntypeDarkVertical;
				else if(_T("gray0625") == sValue)
					m_eValue = patterntypeGray0625;
				else if(_T("gray125") == sValue)
					m_eValue = patterntypeGray125;
				else if(_T("lightDown") == sValue)
					m_eValue = patterntypeLightDown;
				else if(_T("lightGray") == sValue)
					m_eValue = patterntypeLightGray;
				else if(_T("lightGrid") == sValue)
					m_eValue = patterntypeLightGrid;
				else if(_T("lightHorizontal") == sValue)
					m_eValue = patterntypeLightHorizontal;
				else if(_T("lightTrellis") == sValue)
					m_eValue = patterntypeLightTrellis;
				else if(_T("lightUp") == sValue)
					m_eValue = patterntypeLightUp;
				else if(_T("lightVertical") == sValue)
					m_eValue = patterntypeLightVertical;
				else if(_T("mediumGray") == sValue)
					m_eValue = patterntypeMediumGray;
				else if(_T("none") == sValue)
					m_eValue = patterntypeNone;
				else if(_T("solid") == sValue)
					m_eValue = patterntypeSolid;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
					case patterntypeDarkDown:return _T("darkDown");break;
					case patterntypeDarkGray:return _T("darkGray");break;
					case patterntypeDarkGrid:return _T("darkGrid");break;
					case patterntypeDarkHorizontal:return _T("darkHorizontal");break;
					case patterntypeDarkTrellis:return _T("darkTrellis");break;
					case patterntypeDarkUp:return _T("darkUp");break;
					case patterntypeDarkVertical:return _T("darkVertical");break;
					case patterntypeGray0625:return _T("gray0625");break;
					case patterntypeGray125:return _T("gray125");break;
					case patterntypeLightDown:return _T("lightDown");break;
					case patterntypeLightGray:return _T("lightGray");break;
					case patterntypeLightGrid:return _T("lightGrid");break;
					case patterntypeLightHorizontal:return _T("lightHorizontal");break;
					case patterntypeLightTrellis:return _T("lightTrellis");break;
					case patterntypeLightUp:return _T("lightUp");break;
					case patterntypeLightVertical:return _T("lightVertical");break;
					case patterntypeMediumGray:return _T("mediumGray");break;
					case patterntypeNone:return _T("none");break;
				case patterntypeSolid:return _T("solid");break;
				default: return _T("none");
				}

				return _T("none");
			}

			SimpleType_FromString     (EPatternType)
				SimpleType_Operator_Equal (CPatternType)
		};

		enum ETableStyleType
		{
			tablestyletypeBlankRow			=  0,
			tablestyletypeFirstColumn			=  1,
			tablestyletypeFirstColumnStripe			=  2,
			tablestyletypeFirstColumnSubheading			=  3,
			tablestyletypeFirstHeaderCell			=  4,
			tablestyletypeFirstRowStripe			=  5,
			tablestyletypeFirstRowSubheading			=  6,
			tablestyletypeFirstSubtotalColumn			=  7,
			tablestyletypeFirstSubtotalRow			=  8,
			tablestyletypeFirstTotalCell			=  9,
			tablestyletypeHeaderRow			=  10,
			tablestyletypeLastColumn			=  11,
			tablestyletypeLastHeaderCell			=  12,
			tablestyletypeLastTotalCell			=  13,
			tablestyletypePageFieldLabels			=  14,
			tablestyletypePageFieldValues			=  15,
			tablestyletypeSecondColumnStripe			=  16,
			tablestyletypeSecondColumnSubheading			=  17,
			tablestyletypeSecondRowStripe			=  18,
			tablestyletypeSecondRowSubheading			=  19,
			tablestyletypeSecondSubtotalColumn			=  20,
			tablestyletypeSecondSubtotalRow			=  21,
			tablestyletypeThirdColumnSubheading			=  22,
			tablestyletypeThirdRowSubheading			=  23,
			tablestyletypeThirdSubtotalColumn			=  24,
			tablestyletypeThirdSubtotalRow			=  25,
			tablestyletypeTotalRow			=  26,
			tablestyletypeWholeTable			=  27
		};
		template<ETableStyleType eDefValue = tablestyletypeBlankRow>
		class CTableStyleType : public CSimpleType<ETableStyleType, eDefValue>
		{
		public:
			CTableStyleType() {}

			virtual ETableStyleType FromString(CString &sValue)
			{
				if(_T("blankRow") == sValue)
					m_eValue = tablestyletypeBlankRow;
				else if(_T("firstColumn") == sValue)
					m_eValue = tablestyletypeFirstColumn;
				else if(_T("firstColumnStripe") == sValue)
					m_eValue = tablestyletypeFirstColumnStripe;
				else if(_T("firstColumnSubheading") == sValue)
					m_eValue = tablestyletypeFirstColumnSubheading;
				else if(_T("firstHeaderCell") == sValue)
					m_eValue = tablestyletypeFirstHeaderCell;
				else if(_T("firstRowStripe") == sValue)
					m_eValue = tablestyletypeFirstRowStripe;
				else if(_T("firstRowSubheading") == sValue)
					m_eValue = tablestyletypeFirstRowSubheading;
				else if(_T("firstSubtotalColumn") == sValue)
					m_eValue = tablestyletypeFirstSubtotalColumn;
				else if(_T("firstSubtotalRow") == sValue)
					m_eValue = tablestyletypeFirstSubtotalRow;
				else if(_T("firstTotalCell") == sValue)
					m_eValue = tablestyletypeFirstTotalCell;
				else if(_T("headerRow") == sValue)
					m_eValue = tablestyletypeHeaderRow;
				else if(_T("lastColumn") == sValue)
					m_eValue = tablestyletypeLastColumn;
				else if(_T("lastHeaderCell") == sValue)
					m_eValue = tablestyletypeLastHeaderCell;
				else if(_T("lastTotalCell") == sValue)
					m_eValue = tablestyletypeLastTotalCell;
				else if(_T("pageFieldLabels") == sValue)
					m_eValue = tablestyletypePageFieldLabels;
				else if(_T("pageFieldValues") == sValue)
					m_eValue = tablestyletypePageFieldValues;
				else if(_T("secondColumnStripe") == sValue)
					m_eValue = tablestyletypeSecondColumnStripe;
				else if(_T("secondColumnSubheading") == sValue)
					m_eValue = tablestyletypeSecondColumnSubheading;
				else if(_T("secondRowStripe") == sValue)
					m_eValue = tablestyletypeSecondRowStripe;
				else if(_T("secondRowSubheading") == sValue)
					m_eValue = tablestyletypeSecondRowSubheading;
				else if(_T("secondSubtotalColumn") == sValue)
					m_eValue = tablestyletypeSecondSubtotalColumn;
				else if(_T("secondSubtotalRow") == sValue)
					m_eValue = tablestyletypeSecondSubtotalRow;
				else if(_T("thirdColumnSubheading") == sValue)
					m_eValue = tablestyletypeThirdColumnSubheading;
				else if(_T("thirdRowSubheading") == sValue)
					m_eValue = tablestyletypeThirdRowSubheading;
				else if(_T("thirdSubtotalColumn") == sValue)
					m_eValue = tablestyletypeThirdSubtotalColumn;
				else if(_T("thirdSubtotalRow") == sValue)
					m_eValue = tablestyletypeThirdSubtotalRow;
				else if(_T("totalRow") == sValue)
					m_eValue = tablestyletypeTotalRow;
				else if(_T("wholeTable") == sValue)
					m_eValue = tablestyletypeWholeTable;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case tablestyletypeBlankRow: return _T("blankRow");break;
				case tablestyletypeFirstColumn: return _T("firstColumn");break;
				case tablestyletypeFirstColumnStripe: return _T("firstColumnStripe");break;
				case tablestyletypeFirstColumnSubheading: return _T("firstColumnSubheading");break;
				case tablestyletypeFirstHeaderCell: return _T("firstHeaderCell");break;
				case tablestyletypeFirstRowStripe: return _T("firstRowStripe");break;
				case tablestyletypeFirstRowSubheading: return _T("firstRowSubheading");break;
				case tablestyletypeFirstSubtotalColumn: return _T("firstSubtotalColumn");break;
				case tablestyletypeFirstSubtotalRow: return _T("firstSubtotalRow");break;
				case tablestyletypeFirstTotalCell: return _T("firstTotalCell");break;
				case tablestyletypeHeaderRow: return _T("headerRow");break;
				case tablestyletypeLastColumn: return _T("lastColumn");break;
				case tablestyletypeLastHeaderCell: return _T("lastHeaderCell");break;
				case tablestyletypeLastTotalCell: return _T("lastTotalCell");break;
				case tablestyletypePageFieldLabels: return _T("pageFieldLabels");break;
				case tablestyletypePageFieldValues: return _T("pageFieldValues");break;
				case tablestyletypeSecondColumnStripe: return _T("secondColumnStripe");break;
				case tablestyletypeSecondColumnSubheading: return _T("secondColumnSubheading");break;
				case tablestyletypeSecondRowStripe: return _T("secondRowStripe");break;
				case tablestyletypeSecondRowSubheading: return _T("secondRowSubheading");break;
				case tablestyletypeSecondSubtotalColumn: return _T("secondSubtotalColumn");break;
				case tablestyletypeSecondSubtotalRow: return _T("secondSubtotalRow");break;
				case tablestyletypeThirdColumnSubheading: return _T("thirdColumnSubheading");break;
				case tablestyletypeThirdRowSubheading: return _T("thirdRowSubheading");break;
				case tablestyletypeThirdSubtotalColumn: return _T("thirdSubtotalColumn");break;
				case tablestyletypeThirdSubtotalRow: return _T("thirdSubtotalRow");break;
				case tablestyletypeTotalRow: return _T("totalRow");break;
				case tablestyletypeWholeTable: return _T("wholeTable");break;
				default : return _T("blankRow");break;
				}
				return _T("blankRow");
			}

			SimpleType_FromString     (ETableStyleType)
				SimpleType_Operator_Equal (CTableStyleType)
		};
		enum ECellFormulaType
		{
			cellformulatypeArray			=  0,
			cellformulatypeDataTable		=  1,
			cellformulatypeNormal			=  2,
			cellformulatypeShared			=  3
		};
		template<ECellFormulaType eDefValue = cellformulatypeNormal>
		class CCellFormulaType : public CSimpleType<ECellFormulaType, eDefValue>
		{
		public:
			CCellFormulaType() {}

			virtual ECellFormulaType FromString(CString &sValue)
			{
				if(_T("array") == sValue)
					m_eValue = cellformulatypeArray;
				else if(_T("dataTable") == sValue)
					m_eValue = cellformulatypeDataTable;
				else if(_T("normal") == sValue)
					m_eValue = cellformulatypeNormal;
				else if(_T("shared") == sValue)
					m_eValue = cellformulatypeShared;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case cellformulatypeArray : return _T("array");break;
				case cellformulatypeDataTable : return _T("dataTable");break;
				case cellformulatypeNormal : return _T("normal");break;
				case cellformulatypeShared : return _T("shared");break;
				default: return _T("normal");
				}
			}

			SimpleType_FromString     (ECellFormulaType)
				SimpleType_Operator_Equal (CCellFormulaType)
		};
		enum EUpdateLinksType
		{
			updatelinksAlways			=  0,
			updatelinksNever			=  1,
			updatelinksUserSet			=  2
		};
		template<EUpdateLinksType eDefValue = updatelinksAlways>
		class CUpdateLinksType : public CSimpleType<EUpdateLinksType, eDefValue>
		{
		public:
			CUpdateLinksType() {}

			virtual EUpdateLinksType FromString(CString &sValue)
			{
				if(_T("always") == sValue)
					m_eValue = updatelinksAlways;
				else if(_T("never") == sValue)
					m_eValue = updatelinksNever;
				else if(_T("userSet") == sValue)
					m_eValue = updatelinksUserSet;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				return _T("always");
			}

			SimpleType_FromString     (EUpdateLinksType)
				SimpleType_Operator_Equal (CUpdateLinksType)
		};
		enum ECellTypeType
		{
			celltypeBool			=  0,
			celltypeDate			=  1,
			celltypeError			=  2,
			celltypeInlineStr		=  3,
			celltypeNumber			=  4,
			celltypeSharedString	=  5,
			celltypeStr				=  6
		};
		template<ECellTypeType eDefValue = celltypeNumber>
		class CCellTypeType : public CSimpleType<ECellTypeType, eDefValue>
		{
		public:
			CCellTypeType() {}

			virtual ECellTypeType FromString(CString &sValue)
			{
				if(_T("b") == sValue)
					m_eValue = celltypeBool;
				else if(_T("d") == sValue)
					m_eValue = celltypeDate;
				else if(_T("e") == sValue)
					m_eValue = celltypeError;
				else if(_T("inlineStr") == sValue)
					m_eValue = celltypeInlineStr;
				else if(_T("n") == sValue)
					m_eValue = celltypeNumber;
				else if(_T("s") == sValue)
					m_eValue = celltypeSharedString;
				else if(_T("str") == sValue)
					m_eValue = celltypeStr;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case celltypeBool: return _T("b");break;
				case celltypeDate: return _T("d");break;
				case celltypeError: return _T("e");break;
				case celltypeInlineStr: return _T("inlineStr");break;
				case celltypeNumber: return _T("n");break;
				case celltypeSharedString: return _T("s");break;
				case celltypeStr: return _T("str");break;
				default: return _T("n");
				}
			}

			SimpleType_FromString     (ECellTypeType)
				SimpleType_Operator_Equal (CCellTypeType)
		};
		enum ECellAnchorType
		{
			cellanchorAbsolute			=  0,
			cellanchorOneCell			=  1,
			cellanchorTwoCell			=  2
		};
		template<ECellAnchorType eDefValue = cellanchorTwoCell>
		class CCellAnchorType : public CSimpleType<ECellAnchorType, eDefValue>
		{
		public:
			CCellAnchorType() {}

			virtual ECellAnchorType FromString(CString &sValue)
			{
				if(_T("absolute") == sValue)
					m_eValue = cellanchorAbsolute;
				else if(_T("oneCell") == sValue)
					m_eValue = cellanchorOneCell;
				else if(_T("twoCell") == sValue)
					m_eValue = cellanchorTwoCell;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case cellanchorAbsolute: return _T("absolute"); break;
				case cellanchorOneCell: return _T("oneCell"); break;
				case cellanchorTwoCell: return _T("twoCell"); break;
				default: return _T("twoCell");
				}
			}

			SimpleType_FromString     (ECellAnchorType)
				SimpleType_Operator_Equal (CCellAnchorType)
		};

		enum ESheetViewType
		{
			sheetviewNormal				=  0,
			sheetviewPageBreakPreview	=  1,
			sheetviewPageLayout			=  2
		};
		template<ESheetViewType eDefValue = sheetviewNormal>
		class CSheetViewType : public CSimpleType<ESheetViewType, eDefValue>
		{
		public:
			CSheetViewType() {}

			virtual ESheetViewType FromString(CString &sValue)
			{
				if(_T("normal") == sValue)
					m_eValue = sheetviewNormal;
				else if(_T("pageBreakPreview") == sValue)
					m_eValue = sheetviewPageBreakPreview;
				else if(_T("pageLayout") == sValue)
					m_eValue = sheetviewPageLayout;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case sheetviewNormal: return _T("normal"); break;
				case sheetviewPageBreakPreview: return _T("pageBreakPreview"); break;
				case sheetviewPageLayout: return _T("pageLayout"); break;
				default: return _T("normal");
				}
			}

			SimpleType_FromString     (ESheetViewType)
				SimpleType_Operator_Equal (CSheetViewType)
		};
		enum EChartLegendPos
		{
			chartlegendposLeft		=  0,
			chartlegendposTop		=  1,
			chartlegendposRight		=  2,
			chartlegendposBottom	=  3,
			chartlegendposRightTop	=  4
		};
		template<EChartLegendPos eDefValue = chartlegendposTop>
		class CChartLegendPos : public CSimpleType<EChartLegendPos, eDefValue>
		{
		public:
			CChartLegendPos() {}

			virtual EChartLegendPos FromString(CString &sValue)
			{
				if(_T("l") == sValue)
					m_eValue = chartlegendposLeft;
				else if(_T("t") == sValue)
					m_eValue = chartlegendposTop;
				else if(_T("r") == sValue)
					m_eValue = chartlegendposRight;
				else if(_T("b") == sValue)
					m_eValue = chartlegendposBottom;
				else if(_T("tr") == sValue)
					m_eValue = chartlegendposRightTop;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case chartlegendposLeft: return _T("l"); break;
				case chartlegendposTop: return _T("t"); break;
				case chartlegendposRight: return _T("r"); break;
				case chartlegendposBottom: return _T("b"); break;
				case chartlegendposRightTop: return _T("tr"); break;
				default: return _T("t");
				}
			}

			SimpleType_FromString     (EChartLegendPos)
				SimpleType_Operator_Equal (CChartLegendPos)
		};
		enum EChartHMode
		{
			charthmodeFactor	=  0,
			charthmodeEdge		=  1
		};
		template<EChartHMode eDefValue = charthmodeFactor>
		class CChartHMode : public CSimpleType<EChartHMode, eDefValue>
		{
		public:
			CChartHMode() {}

			virtual EChartHMode FromString(CString &sValue)
			{
				if(_T("factor") == sValue)
					m_eValue = charthmodeFactor;
				else if(_T("edge") == sValue)
					m_eValue = charthmodeEdge;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case charthmodeFactor: return _T("factor"); break;
				case charthmodeEdge: return _T("edge"); break;
				default: return _T("factor");
				}
			}

			SimpleType_FromString     (EChartHMode)
				SimpleType_Operator_Equal (CChartHMode)
		};
		enum EChartLayoutTarget
		{
			chartlayouttargetInner	=  0,
			chartlayouttargetOuter	=  1
		};
		template<EChartLayoutTarget eDefValue = chartlayouttargetInner>
		class CChartLayoutTarget : public CSimpleType<EChartLayoutTarget, eDefValue>
		{
		public:
			CChartLayoutTarget() {}

			virtual EChartLayoutTarget FromString(CString &sValue)
			{
				if(_T("inner") == sValue)
					m_eValue = chartlayouttargetInner;
				else if(_T("outer") == sValue)
					m_eValue = chartlayouttargetOuter;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case chartlayouttargetInner: return _T("inner"); break;
				case chartlayouttargetOuter: return _T("outer"); break;
				default: return _T("inner");
				}
			}

			SimpleType_FromString     (EChartLayoutTarget)
				SimpleType_Operator_Equal (CChartLayoutTarget)
		};
		enum EChartAxPos
		{
			chartaxposLeft	=  0,
			chartaxposTop	=  1,
			chartaxposRight	=  2,
			chartaxposBottom=  3
		};
		template<EChartAxPos eDefValue = chartaxposLeft>
		class CChartAxPos : public CSimpleType<EChartAxPos, eDefValue>
		{
		public:
			CChartAxPos() {}

			virtual EChartAxPos FromString(CString &sValue)
			{
				if(_T("l") == sValue)
					m_eValue = chartaxposLeft;
				else if(_T("t") == sValue)
					m_eValue = chartaxposTop;
				else if(_T("r") == sValue)
					m_eValue = chartaxposRight;
				else if(_T("b") == sValue)
					m_eValue = chartaxposBottom;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case chartaxposLeft: return _T("l"); break;
				case chartaxposTop: return _T("t"); break;
				case chartaxposRight: return _T("r"); break;
				case chartaxposBottom: return _T("b"); break;
				default: return _T("l");
				}
			}

			SimpleType_FromString     (EChartAxPos)
				SimpleType_Operator_Equal (CChartAxPos)
		};
		enum EChartBarGrouping
		{
			chartbargroupingClustered	=  0,
			chartbargroupingPercentStacked	=  1,
			chartbargroupingStacked	=  2,
			chartbargroupingStandard=  3
		};
		template<EChartBarGrouping eDefValue = chartbargroupingClustered>
		class CChartBarGrouping : public CSimpleType<EChartBarGrouping, eDefValue>
		{
		public:
			CChartBarGrouping() {}

			virtual EChartBarGrouping FromString(CString &sValue)
			{
				if(_T("clustered") == sValue)
					m_eValue = chartbargroupingClustered;
				else if(_T("percentStacked") == sValue)
					m_eValue = chartbargroupingPercentStacked;
				else if(_T("stacked") == sValue)
					m_eValue = chartbargroupingStacked;
				else if(_T("standard") == sValue)
					m_eValue = chartbargroupingStandard;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case chartbargroupingClustered: return _T("clustered"); break;
				case chartbargroupingPercentStacked: return _T("percentStacked"); break;
				case chartbargroupingStacked: return _T("stacked"); break;
				case chartbargroupingStandard: return _T("standard"); break;
				default: return _T("clustered");
				}
			}

			SimpleType_FromString     (EChartBarGrouping)
				SimpleType_Operator_Equal (CChartBarGrouping)
		};
		enum EChartBarDerection
		{
			chartbardirectionBar	=  0,
			chartbardirectionCol	=  1
		};
		template<EChartBarDerection eDefValue = chartbardirectionBar>
		class CChartBarDerection : public CSimpleType<EChartBarDerection, eDefValue>
		{
		public:
			CChartBarDerection() {}

			virtual EChartBarDerection FromString(CString &sValue)
			{
				if(_T("bar") == sValue)
					m_eValue = chartbardirectionBar;
				else if(_T("col") == sValue)
					m_eValue = chartbardirectionCol;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case chartbardirectionBar: return _T("bar"); break;
				case chartbardirectionCol: return _T("col"); break;
				default: return _T("bar");
				}
			}

			SimpleType_FromString     (EChartBarDerection)
				SimpleType_Operator_Equal (CChartBarDerection)
		};
		enum EChartSymbol
		{
			chartsymbolCircle	=  0,
			chartsymbolDash	=  1,
			chartsymbolDiamond	=  2,
			chartsymbolDot	=  3,
			chartsymbolNone	=  4,
			chartsymbolPicture =  5,
			chartsymbolPlus	=  6,
			chartsymbolSquare	=  7,
			chartsymbolStare	=  8,
			chartsymbolStar	=  9,
			chartsymbolTriangle	=  10,
			chartsymbolX	=  11
		};
		template<EChartSymbol eDefValue = chartsymbolNone>
		class CChartSymbol : public CSimpleType<EChartSymbol, eDefValue>
		{
		public:
			CChartSymbol() {}

			virtual EChartSymbol FromString(CString &sValue)
			{
				if(_T("circle") == sValue)
					m_eValue = chartsymbolCircle;
				else if(_T("dash") == sValue)
					m_eValue = chartsymbolDash;
				else if(_T("diamond") == sValue)
					m_eValue = chartsymbolDiamond;
				else if(_T("dot") == sValue)
					m_eValue = chartsymbolDot;
				else if(_T("none") == sValue)
					m_eValue = chartsymbolNone;
				else if(_T("picture") == sValue)
					m_eValue = chartsymbolPicture;
				else if(_T("plus") == sValue)
					m_eValue = chartsymbolPlus;
				else if(_T("square") == sValue)
					m_eValue = chartsymbolSquare;
				else if(_T("star") == sValue)
					m_eValue = chartsymbolStare;
				else if(_T("triangle") == sValue)
					m_eValue = chartsymbolTriangle;
				else if(_T("x") == sValue)
					m_eValue = chartsymbolX;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				switch(m_eValue)
				{
				case chartsymbolCircle: return _T("circle"); break;
				case chartsymbolDash: return _T("dash"); break;
				case chartsymbolDiamond: return _T("diamond"); break;
				case chartsymbolDot: return _T("dot"); break;
				case chartsymbolNone: return _T("none"); break;
				case chartsymbolPicture: return _T("picture"); break;
				case chartsymbolPlus: return _T("plus"); break;
				case chartsymbolSquare: return _T("square"); break;
				case chartsymbolStare: return _T("star"); break;
				case chartsymbolTriangle: return _T("triangle"); break;
				case chartsymbolX: return _T("x"); break;
				default: return _T("none");
				}
			}

			SimpleType_FromString     (EChartSymbol)
				SimpleType_Operator_Equal (CChartSymbol)
		};
		enum EPageSize
		{
			pagesizeLetterPaper	=  1,
			pagesizeLetterSmall	=  2,
			pagesizeTabloidPaper =  3,
			pagesizeLedgerPaper =  4,
			pagesizeLegalPaper =  5,
			pagesizeStatementPaper =  6,
			pagesizeExecutivePaper =  7,
			pagesizeA3Paper =  8,
			pagesizeA4Paper =  9,
			pagesizeA4SmallPaper =  10,
			pagesizeA5Paper =  11,
			pagesizeB4Paper =  12,
			pagesizeB5Paper =  13,
			pagesizeFolioPaper =  14,
			pagesizeQuartoPaper =  15,
			pagesizeStandardPaper1 =  16,
			pagesizeStandardPaper2 =  17,
			pagesizeNotePaper =  18,
			pagesize9Envelope =  19,
			pagesize10Envelope =  20,
			pagesize11Envelope =  21,
			pagesize12Envelope =  22,
			pagesize14Envelope =  23,
			pagesizeCPaper =  24,
			pagesizeDPaper =  25,
			pagesizeEPaper =  26,
			pagesizeDLEnvelope =  27,
			pagesizeC5Envelope =  28,
			pagesizeC3Envelope =  29,
			pagesizeC4Envelope =  30,
			pagesizeC6Envelope =  31,
			pagesizeC65Envelope =  32,
			pagesizeB4Envelope =  33,
			pagesizeB5Envelope =  34,
			pagesizeB6Envelope =  35,
			pagesizeItalyEnvelope =  36,
			pagesizeMonarchEnvelope =  37,
			pagesize6_3_4Envelope =  38,
			pagesizeUSStandardFanfold =  39,
			pagesizeGermanStandardFanfold =  40,
			pagesizeGermanLegalFanfold =  41,
			pagesizeISOB4 =  42,
			pagesizeJapaneseDoublePostcard =  43,
			pagesizeStandardPaper3 =  44,
			pagesizeStandardPaper4 =  45,
			pagesizeStandardPaper5 =  46,
			pagesizeInviteEnvelope =  47,
			pagesizeLetterExtraPaper =  50,
			pagesizeLegalExtraPaper =  51,
			pagesizeTabloidExtraPaper =  52,
			pagesizeA4ExtraPaper =  53,
			pagesizeLetterTransversePaper =  54,
			pagesizeA4TransversePaper =  55,
			pagesizeLetterExtraTransversePaper =  56,
			pagesizeSuperA_SuperA_A4Paper =  57,
			pagesizeSuperB_SuperB_A3Paper =  58,
			pagesizeLetterPlusPaper =  59,
			pagesizeA4PlusPaper =  60,
			pagesizeA5TransversePaper =  61,
			pagesizeJISB5TransversePaper =  62,
			pagesizeA3ExtraPaper =  63,
			pagesizeA5ExtraPaper =  64,
			pagesizeISOB5ExtraPaper =  65,
			pagesizeA2Paper =  66,
			pagesizeA3TransversePaper =  67,
			pagesizeA3ExtraTransversePaper =  68
		};
		template<EPageSize eDefValue = pagesizeA4Paper>
		class CPageSize : public CSimpleType<EPageSize, eDefValue>
		{
		public:
			CPageSize() {}

			virtual EPageSize FromString(CString &sValue)
			{
				int nCharset = _wtoi(sValue);
				m_eValue = (EPageSize)nCharset;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sResult;
				sResult.Format( _T("%d"), m_eValue );
				return sResult;
			}

			SimpleType_FromString     (EPageSize)
				SimpleType_Operator_Equal (CPageSize)
		};
		enum ETotalsRowFunction
		{
			totalrowfunctionAverage	=  1,
			totalrowfunctionCount =  2,
			totalrowfunctionCountNums =  3,
			totalrowfunctionCustom =  4,
			totalrowfunctionMax =  5,
			totalrowfunctionMin =  6,
			totalrowfunctionNone =  7,
			totalrowfunctionStdDev =  8,
			totalrowfunctionSum =  9,
			totalrowfunctionVar =  10
		};
		template<ETotalsRowFunction eDefValue = totalrowfunctionNone>
		class CTotalsRowFunction : public CSimpleType<ETotalsRowFunction, eDefValue>
		{
		public:
			CTotalsRowFunction() {}

			virtual ETotalsRowFunction FromString(CString &sValue)
			{
				if(_T("average") == sValue)
					m_eValue = totalrowfunctionAverage;
				else if(_T("count") == sValue)
					m_eValue = totalrowfunctionCount;
				else if(_T("countNums") == sValue)
					m_eValue = totalrowfunctionCountNums;
				else if(_T("custom") == sValue)
					m_eValue = totalrowfunctionCustom;
				else if(_T("max") == sValue)
					m_eValue = totalrowfunctionMax;
				else if(_T("min") == sValue)
					m_eValue = totalrowfunctionMin;
				else if(_T("none") == sValue)
					m_eValue = totalrowfunctionNone;
				else if(_T("stdDev") == sValue)
					m_eValue = totalrowfunctionStdDev;
				else if(_T("sum") == sValue)
					m_eValue = totalrowfunctionSum;
				else if(_T("var") == sValue)
					m_eValue = totalrowfunctionVar;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sResult;
				switch(m_eValue)
				{
				case totalrowfunctionAverage: sResult="average";break;
				case totalrowfunctionCount: sResult="count";break;
				case totalrowfunctionCountNums: sResult="countNums";break;
				case totalrowfunctionCustom: sResult="custom";break;
				case totalrowfunctionMax: sResult="max";break;
				case totalrowfunctionMin: sResult="min";break;
				case totalrowfunctionNone: sResult="none";break;
				case totalrowfunctionStdDev: sResult="stdDev";break;
				case totalrowfunctionSum: sResult="sum";break;
				case totalrowfunctionVar: sResult="var";break;
				}
				return sResult;
			}

			SimpleType_FromString     (ETotalsRowFunction)
				SimpleType_Operator_Equal (CTotalsRowFunction)
		};
		enum ESortBy
		{
			sortbyCellColor	=  1,
			sortbyFontColor =  2,
			sortbyIcon =  3,
			sortbyValue =  4
		};
		template<ESortBy eDefValue = sortbyValue>
		class CSortBy : public CSimpleType<ESortBy, eDefValue>
		{
		public:
			CSortBy() {}

			virtual ESortBy FromString(CString &sValue)
			{
				if(_T("cellColor") == sValue)
					m_eValue = sortbyCellColor;
				else if(_T("fontColor") == sValue)
					m_eValue = sortbyFontColor;
				else if(_T("icon") == sValue)
					m_eValue = sortbyIcon;
				else if(_T("value") == sValue)
					m_eValue = sortbyValue;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sResult;
				switch(m_eValue)
				{
				case sortbyCellColor: sResult="cellColor";break;
				case sortbyFontColor: sResult="fontColor";break;
				case sortbyIcon: sResult="icon";break;
				case sortbyValue: sResult="value";break;
				}
				return sResult;
			}

			SimpleType_FromString     (ESortBy)
				SimpleType_Operator_Equal (CSortBy)
		};
		enum ECustomFilter
		{
			customfilterEqual	=  1,
			customfilterGreaterThan =  2,
			customfilterGreaterThanOrEqual =  3,
			customfilterLessThan =  4,
			customfilterLessThanOrEqual =  5,
			customfilterNotEqual =  6
		};
		template<ECustomFilter eDefValue = customfilterEqual>
		class CCustomFilter : public CSimpleType<ECustomFilter, eDefValue>
		{
		public:
			CCustomFilter() {}

			virtual ECustomFilter FromString(CString &sValue)
			{
				if(_T("equal") == sValue)
					m_eValue = customfilterEqual;
				else if(_T("greaterThan") == sValue)
					m_eValue = customfilterGreaterThan;
				else if(_T("greaterThanOrEqual") == sValue)
					m_eValue = customfilterGreaterThanOrEqual;
				else if(_T("lessThan") == sValue)
					m_eValue = customfilterLessThan;
				else if(_T("lessThanOrEqual") == sValue)
					m_eValue = customfilterLessThanOrEqual;
				else if(_T("notEqual") == sValue)
					m_eValue = customfilterNotEqual;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sResult;
				switch(m_eValue)
				{
				case customfilterEqual: sResult="equal";break;
				case customfilterGreaterThan: sResult="greaterThan";break;
				case customfilterGreaterThanOrEqual: sResult="greaterThanOrEqual";break;
				case customfilterLessThan: sResult="lessThan";break;
				case customfilterLessThanOrEqual: sResult="lessThanOrEqual";break;
				case customfilterNotEqual: sResult="notEqual";break;
				}
				return sResult;
			}

			SimpleType_FromString     (ECustomFilter)
				SimpleType_Operator_Equal (CCustomFilter)
		};
		enum EDateTimeGroup
		{
			datetimegroupDay	=  1,
			datetimegroupHour =  2,
			datetimegroupMinute =  3,
			datetimegroupMonth =  4,
			datetimegroupSecond =  5,
			datetimegroupYear =  6
		}; 
		template<EDateTimeGroup eDefValue = datetimegroupDay>
		class CDateTimeGroup : public CSimpleType<EDateTimeGroup, eDefValue>
		{
		public:
			CDateTimeGroup() {}

			virtual EDateTimeGroup FromString(CString &sValue)
			{
				if(_T("day") == sValue)
					m_eValue = datetimegroupDay;
				else if(_T("hour") == sValue)
					m_eValue = datetimegroupHour;
				else if(_T("minute") == sValue)
					m_eValue = datetimegroupMinute;
				else if(_T("month") == sValue)
					m_eValue = datetimegroupMonth;
				else if(_T("second") == sValue)
					m_eValue = datetimegroupSecond;
				else if(_T("year") == sValue)
					m_eValue = datetimegroupYear;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sResult;
				switch(m_eValue)
				{
				case datetimegroupDay: sResult="day";break;
				case datetimegroupHour: sResult="hour";break;
				case datetimegroupMinute: sResult="minute";break;
				case datetimegroupMonth: sResult="month";break;
				case datetimegroupSecond: sResult="second";break;
				case datetimegroupYear: sResult="year";break;
				}
				return sResult;
			}

			SimpleType_FromString     (EDateTimeGroup)
				SimpleType_Operator_Equal (CDateTimeGroup)
		};
		enum EDynamicFilterType
		{
			dynamicfiltertypeAboveAverage = 1,
			dynamicfiltertypeBelowAverage = 2,
			dynamicfiltertypeLastMonth = 3,
			dynamicfiltertypeLastQuarter = 4,
			dynamicfiltertypeLastWeek = 5,
			dynamicfiltertypeLastYear = 6,
			dynamicfiltertypeM1 = 7,
			dynamicfiltertypeM10 = 8,
			dynamicfiltertypeM11 = 9,
			dynamicfiltertypeM12 = 10,
			dynamicfiltertypeM2 = 11,
			dynamicfiltertypeM3 = 12,
			dynamicfiltertypeM4 = 13,
			dynamicfiltertypeM5 = 14,
			dynamicfiltertypeM6 = 15,
			dynamicfiltertypeM7 = 16,
			dynamicfiltertypeM8 = 17,
			dynamicfiltertypeM9 = 18,
			dynamicfiltertypeNextMonth = 19,
			dynamicfiltertypeNextQuarter = 20,
			dynamicfiltertypeNextWeek = 21,
			dynamicfiltertypeNextYear = 22,
			dynamicfiltertypeNull = 23,
			dynamicfiltertypeQ1 = 24,
			dynamicfiltertypeQ2 = 25,
			dynamicfiltertypeQ3 = 26,
			dynamicfiltertypeQ4 = 27,
			dynamicfiltertypeThisMonth = 28,
			dynamicfiltertypeThisQuarter = 29,
			dynamicfiltertypeThisWeek = 30,
			dynamicfiltertypeThisYear = 31,
			dynamicfiltertypeToday = 32,
			dynamicfiltertypeTomorrow = 33,
			dynamicfiltertypeYearToDate = 34,
			dynamicfiltertypeYesterday = 35
		}; 
		template<EDynamicFilterType eDefValue = dynamicfiltertypeNull>
		class CDynamicFilterType : public CSimpleType<EDynamicFilterType, eDefValue>
		{
		public:
			CDynamicFilterType() {}

			virtual EDynamicFilterType FromString(CString &sValue)
			{
				if(_T("aboveAverage") == sValue)
					m_eValue = dynamicfiltertypeAboveAverage;
				else if(_T("belowAverage") == sValue)
					m_eValue = dynamicfiltertypeBelowAverage;
				else if(_T("lastMonth") == sValue)
					m_eValue = dynamicfiltertypeLastMonth;
				else if(_T("lastQuarter") == sValue)
					m_eValue = dynamicfiltertypeLastQuarter;
				else if(_T("lastWeek") == sValue)
					m_eValue = dynamicfiltertypeLastWeek;
				else if(_T("lastYear") == sValue)
					m_eValue = dynamicfiltertypeLastYear;
				else if(_T("M1") == sValue)
					m_eValue = dynamicfiltertypeM1;
				else if(_T("M10") == sValue)
					m_eValue = dynamicfiltertypeM10;
				else if(_T("M11") == sValue)
					m_eValue = dynamicfiltertypeM11;
				else if(_T("M12") == sValue)
					m_eValue = dynamicfiltertypeM12;
				else if(_T("M2") == sValue)
					m_eValue = dynamicfiltertypeM2;
				else if(_T("M3") == sValue)
					m_eValue = dynamicfiltertypeM3;
				else if(_T("M4") == sValue)
					m_eValue = dynamicfiltertypeM4;
				else if(_T("M5") == sValue)
					m_eValue = dynamicfiltertypeM5;
				else if(_T("M6") == sValue)
					m_eValue = dynamicfiltertypeM6;
				else if(_T("M7") == sValue)
					m_eValue = dynamicfiltertypeM7;
				else if(_T("M8") == sValue)
					m_eValue = dynamicfiltertypeM8;
				else if(_T("M9") == sValue)
					m_eValue = dynamicfiltertypeM9;
				else if(_T("nextMonth") == sValue)
					m_eValue = dynamicfiltertypeNextMonth;
				else if(_T("nextQuarter") == sValue)
					m_eValue = dynamicfiltertypeNextQuarter;
				else if(_T("nextWeek") == sValue)
					m_eValue = dynamicfiltertypeNextWeek;
				else if(_T("nextYear") == sValue)
					m_eValue = dynamicfiltertypeNextYear;
				else if(_T("null") == sValue)
					m_eValue = dynamicfiltertypeNull;
				else if(_T("Q1") == sValue)
					m_eValue = dynamicfiltertypeQ1;
				else if(_T("Q2") == sValue)
					m_eValue = dynamicfiltertypeQ2;
				else if(_T("Q3") == sValue)
					m_eValue = dynamicfiltertypeQ3;
				else if(_T("Q4") == sValue)
					m_eValue = dynamicfiltertypeQ4;
				else if(_T("thisMonth") == sValue)
					m_eValue = dynamicfiltertypeThisMonth;
				else if(_T("thisQuarter") == sValue)
					m_eValue = dynamicfiltertypeThisQuarter;
				else if(_T("thisWeek") == sValue)
					m_eValue = dynamicfiltertypeThisWeek;
				else if(_T("thisYear") == sValue)
					m_eValue = dynamicfiltertypeThisYear;
				else if(_T("today") == sValue)
					m_eValue = dynamicfiltertypeToday;
				else if(_T("tomorrow") == sValue)
					m_eValue = dynamicfiltertypeTomorrow;
				else if(_T("yearToDate") == sValue)
					m_eValue = dynamicfiltertypeYearToDate;
				else if(_T("yesterday") == sValue)
					m_eValue = dynamicfiltertypeYesterday;
				else
					m_eValue = eDefValue;
				return m_eValue;
			}

			virtual CString     ToString  () const 
			{
				CString sResult;
				switch(m_eValue)
				{
				case dynamicfiltertypeAboveAverage: sResult="aboveAverage";break;
				case dynamicfiltertypeBelowAverage: sResult="belowAverage";break;
				case dynamicfiltertypeLastMonth: sResult="lastMonth";break;
				case dynamicfiltertypeLastQuarter: sResult="lastQuarter";break;
				case dynamicfiltertypeLastWeek: sResult="lastWeek";break;
				case dynamicfiltertypeLastYear: sResult="lastYear";break;
				case dynamicfiltertypeM1: sResult="M1";break;
				case dynamicfiltertypeM10: sResult="M10";break;
				case dynamicfiltertypeM11: sResult="M11";break;
				case dynamicfiltertypeM12: sResult="M12";break;
				case dynamicfiltertypeM2: sResult="M2";break;
				case dynamicfiltertypeM3: sResult="M3";break;
				case dynamicfiltertypeM4: sResult="M4";break;
				case dynamicfiltertypeM5: sResult="M5";break;
				case dynamicfiltertypeM6: sResult="M6";break;
				case dynamicfiltertypeM7: sResult="M7";break;
				case dynamicfiltertypeM8: sResult="M8";break;
				case dynamicfiltertypeM9: sResult="M9";break;
				case dynamicfiltertypeNextMonth: sResult="nextMonth";break;
				case dynamicfiltertypeNextQuarter: sResult="nextQuarter";break;
				case dynamicfiltertypeNextWeek: sResult="nextWeek";break;
				case dynamicfiltertypeNextYear: sResult="nextYear";break;
				case dynamicfiltertypeNull: sResult="null";break;
				case dynamicfiltertypeQ1: sResult="Q1";break;
				case dynamicfiltertypeQ2: sResult="Q2";break;
				case dynamicfiltertypeQ3: sResult="Q3";break;
				case dynamicfiltertypeQ4: sResult="Q4";break;
				case dynamicfiltertypeThisMonth: sResult="thisMonth";break;
				case dynamicfiltertypeThisQuarter: sResult="thisQuarter";break;
				case dynamicfiltertypeThisWeek: sResult="thisWeek";break;
				case dynamicfiltertypeThisYear: sResult="thisYear";break;
				case dynamicfiltertypeToday: sResult="today";break;
				case dynamicfiltertypeTomorrow: sResult="tomorrow";break;
				case dynamicfiltertypeYearToDate: sResult="yearToDate";break;
				case dynamicfiltertypeYesterday: sResult="yesterday";break;
				}
				return sResult;
			}

			SimpleType_FromString     (EDynamicFilterType)
				SimpleType_Operator_Equal (CDynamicFilterType)
		};
	};
} 
