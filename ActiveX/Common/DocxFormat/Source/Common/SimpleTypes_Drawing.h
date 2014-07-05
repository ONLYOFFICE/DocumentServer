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
	
	
	

	enum EAdjAngle
	{
		adjangleAngle = 0,
		adjangleGuide = 1
	};

	template<EAdjAngle eDefValue = adjangleAngle>
	class CAdjAngle : public CSimpleType<EAdjAngle, eDefValue>
	{
	public:

		CAdjAngle() 
		{
			m_nAngle = 0;
		} 

		virtual EAdjAngle FromString(CString &sValue)
		{
			m_nAngle = 0;
			m_sGuide.Empty();

			Parse( sValue );

			return m_eValue;
		}

		virtual CString   ToString() const 
		{
			if ( adjangleAngle == m_eValue )
			{
				CString sResult;
				sResult.Format( _T("%d"), m_nAngle );
				return sResult;
			}
			else
			{
				return m_sGuide;
			}
		}

		SimpleType_FromString     (EAdjAngle)
		SimpleType_Operator_Equal (CAdjAngle)

		double  GetAngle() const
		{
			return m_nAngle / 60000.0;
		}

		CString GetGuide() const
		{
			return m_sGuide;
		}

	private:

		void Parse(CString &sValue)
		{
			bool bAngleValue = true;

			for ( int nIndex = 0; nIndex < sValue.GetLength(); nIndex++ )
			{
				if ( !iswdigit( sValue[nIndex] ) )
				{
					bAngleValue = false;
					break;
				}
			}

			if ( bAngleValue )
			{
				m_eValue = adjangleAngle;
				m_nAngle = _wtoi( sValue.GetString() );
			}
			else
			{
				m_eValue = adjangleGuide;
				m_sGuide = sValue;
			}
		}

	private:

		int     m_nAngle;
		CString m_sGuide;
	};

	
	
	

	enum EAdjCoordinate
	{
		adjcoordinateCoord = 0,
		adjcoordinateGuide = 1
	};

	template<EAdjCoordinate eDefValue = adjcoordinateCoord>
	class CAdjCoordinate : public CUniversalMeasure
	{
	public:

		CAdjCoordinate() 
		{
			m_eValue = eDefValue;
		} 

		virtual double  FromString(CString &sValue)
		{
			m_sGuide.Empty();

			Parse2( sValue );

			return m_dValue;
		}

		virtual CString ToString() const 
		{
			if ( adjcoordinateCoord == m_eValue )
			{
				if ( m_bUnit )
				{
					CString sResult;
					sResult.Format( _T("%.2fpt"), m_dValue );
					return sResult;
				}
				else
				{
					CString sResult;
					sResult.Format( _T("%d"), (int)Pt_To_Emu( m_dValue ) );
					return sResult;
				}
			}
			else
			{
				return m_sGuide;
			}
		}

		SimpleType_FromString     (double)
		SimpleType_Operator_Equal (CAdjCoordinate)

		CString GetGuide() const
		{
			return m_sGuide;
		}

	private:

		void Parse2(CString &sValue)
		{
			Parse( sValue, 12700 );

			bool bGuide = false;
			if ( !m_bUnit )
			{
				for ( int nIndex = 0; nIndex < sValue.GetLength(); nIndex++ )
				{
					if ( !iswdigit( sValue[nIndex] ) )
					{
						bGuide = true;
						break;
					}
				}
			}
			else
			{
				
				for ( int nIndex = 0; nIndex < sValue.GetLength() - 2; nIndex++ )
				{
					if ( !iswdigit( sValue[nIndex] ) && sValue[nIndex] != '.' && sValue[nIndex] != '-' )
					{
						bGuide = true;
						break;
					}
				}
			}


			if ( bGuide )
			{
				m_eValue = adjcoordinateGuide;
				m_sGuide = sValue;
			}
			else
			{
				m_eValue = adjcoordinateCoord;
				
			}
		}

	private:

		EAdjCoordinate m_eValue;
		CString        m_sGuide;
	};




	
	
	

	template<int nDefValue = 0>
	class CAngle : public CSimpleType<int, nDefValue>
	{
	public:

		CAngle() {}

		virtual int     FromString(CString &sValue)
		{
			m_eValue = _wtoi( sValue.GetString() );

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue );
			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CAngle)

		double  GetAngle() const
		{
			return m_eValue / 60000.0;
		}

	};

	
	
	

	enum EAnimationBuildType
	{
		animationbuildtypeAllAtOnce = 0
	};

	template<EAnimationBuildType eDefValue = animationbuildtypeAllAtOnce>
	class CAnimationBuildType : public CSimpleType<EAnimationBuildType, eDefValue>
	{
	public:
		CAnimationBuildType() {}

		virtual EAnimationBuildType FromString(CString &sValue)
		{
			if      ( _T("allAtOnce") == sValue ) m_eValue = animationbuildtypeAllAtOnce;     
			else                                  m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString             ToString  () const 
		{
			switch(m_eValue)
			{
			case animationbuildtypeAllAtOnce : return _T("allAtOnce");
			default                          : return _T("allAtOnce");
			}
		}

		SimpleType_FromString     (EAnimationBuildType)
		SimpleType_Operator_Equal (CAnimationBuildType)
	};

	
	
	

	enum EAnimationChartBuildType
	{
		animationchartbuildtypeAllAtOnce  = 0,
		animationchartbuildtypeCategory   = 1,
		animationchartbuildtypeCategoryEl = 2,
		animationchartbuildtypeSeries     = 3,
		animationchartbuildtypeSeriesEl   = 4
	};

	template<EAnimationChartBuildType eDefValue = animationchartbuildtypeAllAtOnce>
	class CAnimationChartBuildType : public CSimpleType<EAnimationChartBuildType, eDefValue>
	{
	public:
		CAnimationChartBuildType() {}

		virtual EAnimationChartBuildType FromString(CString &sValue)
		{
			if      ( _T("allAtOnce")  == sValue ) m_eValue = animationchartbuildtypeAllAtOnce;     
			else if ( _T("category")   == sValue ) m_eValue = animationchartbuildtypeCategory;     
			else if ( _T("categoryEl") == sValue ) m_eValue = animationchartbuildtypeCategoryEl;     
			else if ( _T("series")     == sValue ) m_eValue = animationchartbuildtypeSeries;     
			else if ( _T("seriesEl")   == sValue ) m_eValue = animationchartbuildtypeSeriesEl;     
			else                                   m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString                  ToString  () const 
		{
			switch(m_eValue)
			{
			case animationchartbuildtypeAllAtOnce  : return _T("allAtOnce");
			case animationchartbuildtypeCategory   : return _T("category");
			case animationchartbuildtypeCategoryEl : return _T("categoryEl");
			case animationchartbuildtypeSeries     : return _T("series");
			case animationchartbuildtypeSeriesEl   : return _T("seriesEl");
			default                                : return _T("allAtOnce");
			}
		}

		SimpleType_FromString     (EAnimationChartBuildType)
		SimpleType_Operator_Equal (CAnimationChartBuildType)
	};



	
	
	

	enum EAnimationChartOnlyBuildType
	{
		animationchartonlybuildtypeCategory   = 0,
		animationchartonlybuildtypeCategoryEl = 1,
		animationchartonlybuildtypeSeries     = 2,
		animationchartonlybuildtypeSeriesEl   = 3
	};

	template<EAnimationChartOnlyBuildType eDefValue = animationchartonlybuildtypeCategory>
	class CAnimationChartOnlyBuildType : public CSimpleType<EAnimationChartOnlyBuildType, eDefValue>
	{
	public:
		CAnimationChartOnlyBuildType() {}

		virtual EAnimationChartOnlyBuildType FromString(CString &sValue)
		{
			if      ( _T("category")   == sValue ) m_eValue = animationchartonlybuildtypeCategory;     
			else if ( _T("categoryEl") == sValue ) m_eValue = animationchartonlybuildtypeCategoryEl;     
			else if ( _T("series")     == sValue ) m_eValue = animationchartonlybuildtypeSeries;     
			else if ( _T("seriesEl")   == sValue ) m_eValue = animationchartonlybuildtypeSeriesEl;     
			else                                   m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString                      ToString  () const 
		{
			switch(m_eValue)
			{
			case animationchartonlybuildtypeCategory   : return _T("category");
			case animationchartonlybuildtypeCategoryEl : return _T("categoryEl");
			case animationchartonlybuildtypeSeries     : return _T("series");
			case animationchartonlybuildtypeSeriesEl   : return _T("seriesEl");
			default                                    : return _T("category");
			}
		}

		SimpleType_FromString     (EAnimationChartOnlyBuildType)
		SimpleType_Operator_Equal (CAnimationChartOnlyBuildType)
	};



	
	
	

	enum EAnimationDgmBuildType
	{
		animationdgmbuildtypeAllAtOnce = 0,
		animationdgmbuildtypeLvlAtOnce = 1,
		animationdgmbuildtypeLvlOne    = 2,
		animationdgmbuildtypeOne       = 3
	};

	template<EAnimationDgmBuildType eDefValue = animationdgmbuildtypeAllAtOnce>
	class CAnimationDgmBuildType : public CSimpleType<EAnimationDgmBuildType, eDefValue>
	{
	public:
		CAnimationDgmBuildType() {}

		virtual EAnimationDgmBuildType FromString(CString &sValue)
		{
			if      ( _T("allAtOnce") == sValue ) m_eValue = animationdgmbuildtypeAllAtOnce;     
			else if ( _T("lvlAtOnce") == sValue ) m_eValue = animationdgmbuildtypeLvlAtOnce;     
			else if ( _T("lvlOne")    == sValue ) m_eValue = animationdgmbuildtypeLvlOne;     
			else if ( _T("one")       == sValue ) m_eValue = animationdgmbuildtypeOne;     
			else                                  m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString                ToString  () const 
		{
			switch(m_eValue)
			{
			case animationdgmbuildtypeAllAtOnce : return _T("allAtOnce");
			case animationdgmbuildtypeLvlAtOnce : return _T("lvlAtOnce");
			case animationdgmbuildtypeLvlOne    : return _T("lvlOne");
			case animationdgmbuildtypeOne       : return _T("one");
			default                             : return _T("allAtOnce");
			}
		}

		SimpleType_FromString     (EAnimationDgmBuildType)
		SimpleType_Operator_Equal (CAnimationDgmBuildType)
	};




	
	
	

	enum EAnimationDgmOnlyBuildType
	{
		animationdgmonlybuildtypeLvlAtOnce = 0,
		animationdgmonlybuildtypeLvlOne    = 1,
		animationdgmonlybuildtypeOne       = 2
	};

	template<EAnimationDgmOnlyBuildType eDefValue = animationdgmonlybuildtypeOne>
	class CAnimationDgmOnlyBuildType : public CSimpleType<EAnimationDgmOnlyBuildType, eDefValue>
	{
	public:
		CAnimationDgmOnlyBuildType() {}

		virtual EAnimationDgmOnlyBuildType FromString(CString &sValue)
		{
			if      ( _T("lvlAtOnce") == sValue ) m_eValue = animationdgmonlybuildtypeLvlAtOnce;     
			else if ( _T("lvlOne")    == sValue ) m_eValue = animationdgmonlybuildtypeLvlOne;     
			else if ( _T("one")       == sValue ) m_eValue = animationdgmonlybuildtypeOne;     
			else                                  m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString                    ToString  () const 
		{
			switch(m_eValue)
			{
			case animationdgmonlybuildtypeLvlAtOnce : return _T("lvlAtOnce");
			case animationdgmonlybuildtypeLvlOne    : return _T("lvlOne");
			case animationdgmonlybuildtypeOne       : return _T("one");
			default                                 : return _T("lvlAtOnce");
			}
		}

		SimpleType_FromString     (EAnimationDgmOnlyBuildType)
		SimpleType_Operator_Equal (CAnimationDgmOnlyBuildType)
	};
	
	
	

	enum EBevelPresetType
	{
		bevelpresettypeAngle        =  0,
		bevelpresettypeArtDeco      =  1,
		bevelpresettypeCircle       =  2,
		bevelpresettypeConvex       =  3,
		bevelpresettypeCoolSlant    =  4,
		bevelpresettypeCross        =  5,
		bevelpresettypeDivot        =  6,
		bevelpresettypeHardEdge     =  7,
		bevelpresettypeRelaxedInset =  8,
		bevelpresettypeRiblet       =  9,
		bevelpresettypeSlope        = 10,
		bevelpresettypeSoftRound    = 11
	};

	template<EBevelPresetType eDefValue = bevelpresettypeAngle>
	class CBevelPresetType : public CSimpleType<EBevelPresetType, eDefValue>
	{
	public:
		CBevelPresetType() {}

		virtual EBevelPresetType FromString(CString &sValue)
		{
			if      ( _T("angle")        == sValue ) m_eValue = bevelpresettypeAngle;     
			else if ( _T("artDeco")      == sValue ) m_eValue = bevelpresettypeArtDeco;     
			else if ( _T("circle")       == sValue ) m_eValue = bevelpresettypeCircle;     
			else if ( _T("convex")       == sValue ) m_eValue = bevelpresettypeConvex;     
			else if ( _T("coolSlant")    == sValue ) m_eValue = bevelpresettypeCoolSlant;     
			else if ( _T("cross")        == sValue ) m_eValue = bevelpresettypeCross;     
			else if ( _T("divot")        == sValue ) m_eValue = bevelpresettypeDivot;     
			else if ( _T("hardEdge")     == sValue ) m_eValue = bevelpresettypeHardEdge;     
			else if ( _T("relaxedInset") == sValue ) m_eValue = bevelpresettypeRelaxedInset;     
			else if ( _T("riblet")       == sValue ) m_eValue = bevelpresettypeRiblet;     
			else if ( _T("slope")        == sValue ) m_eValue = bevelpresettypeSlope;     
			else if ( _T("softRound")    == sValue ) m_eValue = bevelpresettypeSoftRound;     
			else                                     m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString          ToString  () const 
		{
			switch(m_eValue)
			{
			case bevelpresettypeAngle        : return _T("angle");
			case bevelpresettypeArtDeco      : return _T("artDeco");
			case bevelpresettypeCircle       : return _T("circle");
			case bevelpresettypeConvex       : return _T("convex");
			case bevelpresettypeCoolSlant    : return _T("coolSlant");
			case bevelpresettypeCross        : return _T("cross");
			case bevelpresettypeDivot        : return _T("divot");
			case bevelpresettypeHardEdge     : return _T("hardEdge");
			case bevelpresettypeRelaxedInset : return _T("relaxedInset");
			case bevelpresettypeRiblet       : return _T("riblet");
			case bevelpresettypeSlope        : return _T("slope");
			case bevelpresettypeSoftRound    : return _T("softRound");
			default                          : return _T("angle");
			}
		}

		SimpleType_FromString     (EBevelPresetType)
		SimpleType_Operator_Equal (CBevelPresetType)
	};

	
	
	

	enum EBlackWhiteMode
	{
		blackwhitemodeAuto       =  0,
		blackwhitemodeBlack      =  1,
		blackwhitemodeBlackGray  =  2,
		blackwhitemodeBlackWhite =  3,
		blackwhitemodeClr        =  4,
		blackwhitemodeGray       =  5,
		blackwhitemodeGrayWhite  =  6,
		blackwhitemodeHidden     =  7,
		blackwhitemodeInvGray    =  8,
		blackwhitemodeLtGray     =  9,
		blackwhitemodeWhite      = 10
	};

	template<EBlackWhiteMode eDefValue = blackwhitemodeAuto>
	class CBlackWhiteMode : public CSimpleType<EBlackWhiteMode, eDefValue>
	{
	public:
		CBlackWhiteMode() {}

		virtual EBlackWhiteMode FromString(CString &sValue)
		{
			if      ( _T("auto")       == sValue ) m_eValue = blackwhitemodeAuto;     
			else if ( _T("black")      == sValue ) m_eValue = blackwhitemodeBlack;     
			else if ( _T("blackGray")  == sValue ) m_eValue = blackwhitemodeBlackGray;     
			else if ( _T("blackWhite") == sValue ) m_eValue = blackwhitemodeBlackWhite;     
			else if ( _T("clr")        == sValue ) m_eValue = blackwhitemodeClr;     
			else if ( _T("gray")       == sValue ) m_eValue = blackwhitemodeGray;     
			else if ( _T("grayWhite")  == sValue ) m_eValue = blackwhitemodeGrayWhite;     
			else if ( _T("hidden")     == sValue ) m_eValue = blackwhitemodeHidden;     
			else if ( _T("invGray")    == sValue ) m_eValue = blackwhitemodeInvGray;     
			else if ( _T("ltGray")     == sValue ) m_eValue = blackwhitemodeLtGray;     
			else if ( _T("white")      == sValue ) m_eValue = blackwhitemodeWhite;     
			else                                   m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString         ToString  () const 
		{
			switch(m_eValue)
			{
			case blackwhitemodeAuto       : return _T("auto");
			case blackwhitemodeBlack      : return _T("black");
			case blackwhitemodeBlackGray  : return _T("blackGray");
			case blackwhitemodeBlackWhite : return _T("blackWhite");
			case blackwhitemodeClr        : return _T("clr");
			case blackwhitemodeGray       : return _T("gray");
			case blackwhitemodeGrayWhite  : return _T("grayWhite");
			case blackwhitemodeHidden     : return _T("hidden");
			case blackwhitemodeInvGray    : return _T("invGray");
			case blackwhitemodeLtGray     : return _T("ltGray");
			case blackwhitemodeWhite      : return _T("white");
			default                       : return _T("auto");
			}
		}

		SimpleType_FromString     (EBlackWhiteMode)
		SimpleType_Operator_Equal (CBlackWhiteMode)
	};

	
	
	

	enum EBlendMode
	{
		blendmodeDarken  = 0,
		blendmodeLighten = 1,
		blendmodeMult    = 2,
		blendmodeOver    = 3,
		blendmodeScreen  = 4
	};

	template<EBlendMode eDefValue = blendmodeMult>
	class CBlendMode : public CSimpleType<EBlendMode, eDefValue>
	{
	public:
		CBlendMode() {}

		virtual EBlendMode FromString(CString &sValue)
		{
			if      ( _T("darken")  == sValue ) m_eValue = blendmodeDarken;     
			else if ( _T("lighten") == sValue ) m_eValue = blendmodeLighten;     
			else if ( _T("mult")    == sValue ) m_eValue = blendmodeMult;     
			else if ( _T("over")    == sValue ) m_eValue = blendmodeOver;     
			else if ( _T("screen")  == sValue ) m_eValue = blendmodeScreen;     
			else                                m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString    ToString  () const 
		{
			switch(m_eValue)
			{
			case blendmodeDarken  : return _T("darken");
			case blendmodeLighten : return _T("lighten");
			case blendmodeMult    : return _T("mult");
			case blendmodeOver    : return _T("over");
			case blendmodeScreen  : return _T("screen");
			default               : return _T("mult");
			}
		}

		SimpleType_FromString     (EBlendMode)
		SimpleType_Operator_Equal (CBlendMode)
	};


	
	
	
	enum EBlipCompression
	{
		blipcompressionEmail   = 0,
		blipcompressionHQPrint = 1,
		blipcompressionNone    = 2,
		blipcompressionPrint   = 3,
		blipcompressionScreen  = 4
	};

	template<EBlipCompression eDefValue = blipcompressionNone>
	class CBlipCompression : public CSimpleType<EBlipCompression, eDefValue>
	{
	public:
		CBlipCompression() {}

		virtual EBlipCompression FromString(CString &sValue)
		{
			if      ( _T("email")   == sValue ) m_eValue = blipcompressionEmail;     
			else if ( _T("hqprint") == sValue ) m_eValue = blipcompressionHQPrint;     
			else if ( _T("none")    == sValue ) m_eValue = blipcompressionNone;     
			else if ( _T("print")   == sValue ) m_eValue = blipcompressionPrint;     
			else if ( _T("screen")  == sValue ) m_eValue = blipcompressionScreen;     
			else                                m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString          ToString  () const 
		{
			switch(m_eValue)
			{
			case blipcompressionEmail   : return _T("email");
			case blipcompressionHQPrint : return _T("hqprint");
			case blipcompressionNone    : return _T("none");
			case blipcompressionPrint   : return _T("print");
			case blipcompressionScreen  : return _T("screen");
			default                     : return _T("none");
			}
		}

		SimpleType_FromString     (EBlipCompression)
		SimpleType_Operator_Equal (CBlipCompression)
	};

	
	
	
	enum EColorSchemeIndex
	{
		colorschemeindexAccent1  = 0,
		colorschemeindexAccent2  = 1,
		colorschemeindexAccent3  = 2,
		colorschemeindexAccent4  = 3,
		colorschemeindexAccent5  = 4,
		colorschemeindexAccent6  = 5,
		colorschemeindexDk1      = 6,
		colorschemeindexDk2      = 7,
		colorschemeindexFolHlink = 8,
		colorschemeindexHlink    = 9,
		colorschemeindexLt1      = 10,
		colorschemeindexLt2      = 11,
	};

	template<EColorSchemeIndex eDefValue = colorschemeindexAccent1>
	class CColorSchemeIndex : public CSimpleType<EColorSchemeIndex, eDefValue>
	{
	public:
		CColorSchemeIndex() {}

		virtual EColorSchemeIndex FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("accent1")  == sValue ) m_eValue = colorschemeindexAccent1;
				else if ( _T("accent2")  == sValue ) m_eValue = colorschemeindexAccent2;
				else if ( _T("accent3")  == sValue ) m_eValue = colorschemeindexAccent3;
				else if ( _T("accent4")  == sValue ) m_eValue = colorschemeindexAccent4;
				else if ( _T("accent5")  == sValue ) m_eValue = colorschemeindexAccent5;
				else if ( _T("accent6")  == sValue ) m_eValue = colorschemeindexAccent6;
				break;
			case 'd':
				if      ( _T("dk1")      == sValue ) m_eValue = colorschemeindexDk1;
				else if ( _T("dk2")      == sValue ) m_eValue = colorschemeindexDk2;
				break;
			case 'f':
				if      ( _T("folHlink") == sValue ) m_eValue = colorschemeindexFolHlink;
				break;
			case 'h':
				if      ( _T("hlink")    == sValue ) m_eValue = colorschemeindexHlink;
				break;
			case 'l':
				if      ( _T("lt1")      == sValue ) m_eValue = colorschemeindexLt1;
				else if ( _T("lt2")      == sValue ) m_eValue = colorschemeindexLt2;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case colorschemeindexAccent1 : return _T("accent1");			
			case colorschemeindexAccent2 : return _T("accent2");			
			case colorschemeindexAccent3 : return _T("accent3");			
			case colorschemeindexAccent4 : return _T("accent4");			
			case colorschemeindexAccent5 : return _T("accent5");			
			case colorschemeindexAccent6 : return _T("accent6");			
			case colorschemeindexDk1     : return _T("dk1");			
			case colorschemeindexDk2     : return _T("dk2");			
			case colorschemeindexFolHlink: return _T("folHlink");			
			case colorschemeindexHlink   : return _T("hlink");			
			case colorschemeindexLt1     : return _T("lt1");			
			case colorschemeindexLt2     : return _T("lt2");			
			default                      : return _T("accent1");
			}
		}

		SimpleType_FromString     (EColorSchemeIndex)
		SimpleType_Operator_Equal (CColorSchemeIndex)
	};
	
	
	
	enum ECompoundLine
	{
		compoundlineDbl       = 0,
		compoundlineSng       = 1,
		compoundlineThickThin = 2,
		compoundlineThinThick = 3,
		compoundlineTri       = 4,
	};

	template<ECompoundLine eDefValue = compoundlineSng>
	class CCompoundLine : public CSimpleType<ECompoundLine, eDefValue>
	{
	public:
		CCompoundLine() {}

		virtual ECompoundLine FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'd':
				if      ( _T("dbl")       == sValue ) m_eValue = compoundlineDbl;
				break;
			case 's':
				if      ( _T("sng")       == sValue ) m_eValue = compoundlineSng;
				break;
			case 't':
				if      ( _T("thickThin") == sValue ) m_eValue = compoundlineThickThin;
				else if ( _T("thinThick") == sValue ) m_eValue = compoundlineThinThick;
				else if ( _T("tri")       == sValue ) m_eValue = compoundlineTri;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case compoundlineDbl:       return _T("dbl");			
			case compoundlineSng:       return _T("sng");			
			case compoundlineThickThin: return _T("thickThin");			
			case compoundlineThinThick: return _T("thinThick");			
			case compoundlineTri:       return _T("tri");			
			default :                   return _T("sng");
			}
		}

		SimpleType_FromString     (ECompoundLine)
		SimpleType_Operator_Equal (CCompoundLine)
	};
	
    
	
    class CCoordinate : public CUniversalMeasure
    {
    public:
        CCoordinate() {}

 		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_bUnit  = false;
			m_dValue = dValue;
		}

		virtual double  FromString(CString &sValue)
        {
            Parse(sValue, 12700);

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;

            if ( m_bUnit )
                sResult.Format( _T("%fpt"), m_dValue);
            else
                sResult.Format( _T("%d"), (__int64)m_dValue );

            return sResult;
        }

		__int64 ToEmu() const
		{
			return (__int64)Pt_To_Emu( m_dValue );
		}
        SimpleType_FromString     (double)
        SimpleType_Operator_Equal (CCoordinate)
    };

	
    
	
	#define	CCoordinate32 CCoordinate
	
	
	
    template<int nDefValue = 0>
	class CDrawingElementId : public CSimpleType<int, nDefValue>
    {
    public:
        CDrawingElementId() {}

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

        SimpleType_FromString2      (int)
            SimpleType_Operator_Equal   (CDrawingElementId)
    };

	
	
	
	enum EEffectContainerType
	{
		effectcontainertypeSib  = 0,
		effectcontainertypeTree = 1,
	};

	template<EEffectContainerType eDefValue = effectcontainertypeSib>
	class CEffectContainerType : public CSimpleType<EEffectContainerType, eDefValue>
	{
	public:
		CEffectContainerType() {}

		virtual EEffectContainerType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 's':
				if      ( _T("sib")  == sValue ) m_eValue = effectcontainertypeSib;
				break;
			case 't':
				if      ( _T("tree") == sValue ) m_eValue = effectcontainertypeTree;
				break;
			}

			return m_eValue;
		}

		virtual CString              ToString  () const 
		{
			switch(m_eValue)
			{
			case effectcontainertypeSib:  return _T("sib");			
			case effectcontainertypeTree: return _T("tree");		
			default :                     return _T("sib");
			}
		}

		SimpleType_FromString     (EEffectContainerType)
		SimpleType_Operator_Equal (CEffectContainerType)
	};


	
	
	
	template<int nDefValue = 0>
	class CFixedAngle : public CSimpleType<int, nDefValue>
	{
	public:

		CFixedAngle() {}

		void SetValue(int nValue)
		{
			m_eValue = min( 5400000, max( -5400000, nValue ) );
		}

		virtual int     FromString(CString &sValue)
		{
			m_eValue = min( 5400000, max( -5400000, _wtoi( sValue.GetString() ) ) );

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue );
			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CFixedAngle)

		double  GetAngle() const
		{
			return m_eValue / 60000.0;
		}

	};

	
    
	
    class CFixedPercentage 
    {
    public:
        CFixedPercentage() 
		{
			m_dValue = 0;
		}

		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_dValue = min( 100, max( -100, dValue ) );
		}

        virtual double FromString(CString &sValue)
        {
			int nPos = sValue.Find( '%' );
			int nLen = sValue.GetLength();
			if ( -1 == nPos || nPos != sValue.GetLength() - 1 || nLen <= 0  )
			{
				if ( -1 == nPos )
				{
					
					int nValue = min( 100000, max( -100000, _wtoi( sValue ) ) );
					m_dValue = nValue / 1000.0;
				}
				else
					m_dValue = 0;
			}
			else
				m_dValue = min( 100, max( -100, _wtof( sValue.Mid( 0, nLen - 1 ) ) ) );

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%f%%"), m_dValue );

            return sResult;
        }

        SimpleType_FromString2    (double)
        SimpleType_Operator_Equal (CFixedPercentage)

	private:

		double m_dValue;
    };
	
	
	
	enum EFontCollectionIndex
	{
		fontcollectionindexMajor = 0,
		fontcollectionindexMinor = 1,
		fontcollectionindexNone  = 2,
	};

	template<EFontCollectionIndex eDefValue = fontcollectionindexNone>
	class CFontCollectionIndex : public CSimpleType<EFontCollectionIndex, eDefValue>
	{
	public:
		CFontCollectionIndex() {}

		virtual EFontCollectionIndex FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'm':
				if      ( _T("major") == sValue ) m_eValue = fontcollectionindexMajor;
				else if ( _T("minor") == sValue ) m_eValue = fontcollectionindexMinor;
				break;
			case 'n':
				if      ( _T("none")  == sValue ) m_eValue = fontcollectionindexNone;
				break;
			}

			return m_eValue;
		}

		virtual CString              ToString  () const 
		{
			switch(m_eValue)
			{
			case fontcollectionindexMajor: return _T("major");			
			case fontcollectionindexMinor: return _T("minor");		
			case fontcollectionindexNone : return _T("none");		
			default                      : return _T("none");
			}
		}

		SimpleType_FromString     (EFontCollectionIndex)
		SimpleType_Operator_Equal (CFontCollectionIndex)
	};


	
	
	
	template<int nDefValue = 0>
	class CFOVAngle : public CSimpleType<int, nDefValue>
	{
	public:

		CFOVAngle() {}

		void SetValue(int nValue)
		{
			m_eValue = min( 10800000, max( 0, nValue ) );
		}

		virtual int     FromString(CString &sValue)
		{
			m_eValue = min( 10800000, max( 0, _wtoi( sValue.GetString() ) ) );

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue );
			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CFOVAngle)

		double  GetAngle() const
		{
			return m_eValue / 60000.0;
		}

	};

	
	
	
	class CGeomGuideFormula
	{
	public:
		CGeomGuideFormula() {}

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
		SimpleType_Operator_Equal (CGeomGuideFormula)

	private:

		void Parse()
		{
			
		}

	private:

		CString m_sValue;
	};
	
	
	
	class CGeomGuideName
	{
	public:
		CGeomGuideName() {}

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
		SimpleType_Operator_Equal (CGeomGuideName)

	private:

		CString m_sValue;
	};

	
	
	
	enum ELightRigDirection
	{
		lightrigdirectionB  = 0,
		lightrigdirectionBL = 1,
		lightrigdirectionBR = 2,
		lightrigdirectionL  = 3,
		lightrigdirectionR  = 4,
		lightrigdirectionT  = 5,
		lightrigdirectionTL = 6,
		lightrigdirectionTR = 7,
	};

	template<ELightRigDirection eDefValue = lightrigdirectionTR>
	class CLightRigDirection : public CSimpleType<ELightRigDirection, eDefValue>
	{
	public:
		CLightRigDirection() {}

		virtual ELightRigDirection FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("b")  == sValue ) m_eValue = lightrigdirectionB;
				else if ( _T("bl") == sValue ) m_eValue = lightrigdirectionBL;
				else if ( _T("br") == sValue ) m_eValue = lightrigdirectionBR;
				break;
			case 'l':
				if      ( _T("l")  == sValue ) m_eValue = lightrigdirectionL;
				break;
			case 'r':
				if      ( _T("r")  == sValue ) m_eValue = lightrigdirectionR;
				break;
			case 't':
				if      ( _T("t")  == sValue ) m_eValue = lightrigdirectionT;
				else if ( _T("tl") == sValue ) m_eValue = lightrigdirectionTL;
				else if ( _T("tr") == sValue ) m_eValue = lightrigdirectionTR;
				break;
			}

			return m_eValue;
		}

		virtual CString            ToString  () const 
		{
			switch(m_eValue)
			{
			case lightrigdirectionB:  return _T("b");			
			case lightrigdirectionBL: return _T("bl");			
			case lightrigdirectionBR: return _T("br");		
			case lightrigdirectionL:  return _T("l");			
			case lightrigdirectionR:  return _T("r");			
			case lightrigdirectionT:  return _T("t");		
			case lightrigdirectionTL: return _T("tl");			
			case lightrigdirectionTR: return _T("tr");			
			default :                 return _T("tr");
			}
		}

		SimpleType_FromString     (ELightRigDirection)
		SimpleType_Operator_Equal (CLightRigDirection)
	};
	
	
	
	enum ELightRigType
	{
		lightrigtypeBalanced      = 0,
		lightrigtypeBrightRoom    = 1,
		lightrigtypeChilly        = 2,
		lightrigtypeContrasting   = 3,
		lightrigtypeFlat          = 4,
		lightrigtypeFlood         = 5,
		lightrigtypeFreezing      = 6,
		lightrigtypeGlow          = 7,
		lightrigtypeHarsh         = 8,
		lightrigtypeLegacyFlat1   = 9,
		lightrigtypeLegacyFlat2   = 10,
		lightrigtypeLegacyFlat3   = 11,
		lightrigtypeLegacyFlat4   = 12,
		lightrigtypeLegacyHarsh1  = 13,
		lightrigtypeLegacyHarsh2  = 14,
		lightrigtypeLegacyHarsh3  = 15,
		lightrigtypeLegacyHarsh4  = 16,
		lightrigtypeLegacyNormal1 = 17,
		lightrigtypeLegacyNormal2 = 18,
		lightrigtypeLegacyNormal3 = 19,
		lightrigtypeLegacyNormal4 = 20,
		lightrigtypeMorning       = 21,
		lightrigtypeSoft          = 22,
		lightrigtypeSunrise       = 23,
		lightrigtypeSunset        = 24,
		lightrigtypeThreePt       = 25,
		lightrigtypeTwoPt         = 26,
	};

	template<ELightRigType eDefValue = lightrigtypeBalanced>
	class CLightRigType : public CSimpleType<ELightRigType, eDefValue>
	{
	public:
		CLightRigType() {}

		virtual ELightRigType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("balanced")    == sValue ) m_eValue = lightrigtypeBalanced;
				else if ( _T("brightRoom")  == sValue ) m_eValue = lightrigtypeBrightRoom;
				break;
			case 'c':
				if      ( _T("chilly")      == sValue ) m_eValue = lightrigtypeChilly;
				else if ( _T("contrasting") == sValue ) m_eValue = lightrigtypeContrasting;
				break;
			case 'f':
				if      ( _T("flat")        == sValue ) m_eValue = lightrigtypeFlat;
				else if ( _T("flood")       == sValue ) m_eValue = lightrigtypeFlood;
				else if ( _T("freezing")    == sValue ) m_eValue = lightrigtypeFreezing;
				break;
			case 'g':
				if      ( _T("glow")        == sValue ) m_eValue = lightrigtypeGlow;
				break;
			case 'h':
				if      ( _T("harsh")       == sValue ) m_eValue = lightrigtypeHarsh;
				break;
			case 'l':
				if      ( _T("legacyFlat1")   == sValue ) m_eValue = lightrigtypeLegacyFlat1;
				else if ( _T("legacyFlat2")   == sValue ) m_eValue = lightrigtypeLegacyFlat2;
				else if ( _T("legacyFlat3")   == sValue ) m_eValue = lightrigtypeLegacyFlat3;
				else if ( _T("legacyFlat4")   == sValue ) m_eValue = lightrigtypeLegacyFlat4;
				else if ( _T("legacyHarsh1")  == sValue ) m_eValue = lightrigtypeLegacyHarsh1;
				else if ( _T("legacyHarsh2")  == sValue ) m_eValue = lightrigtypeLegacyHarsh2;
				else if ( _T("legacyHarsh3")  == sValue ) m_eValue = lightrigtypeLegacyHarsh3;
				else if ( _T("legacyHarsh4")  == sValue ) m_eValue = lightrigtypeLegacyHarsh4;
				else if ( _T("legacyNormal1") == sValue ) m_eValue = lightrigtypeLegacyNormal1;
				else if ( _T("legacyNormal2") == sValue ) m_eValue = lightrigtypeLegacyNormal2;
				else if ( _T("legacyNormal3") == sValue ) m_eValue = lightrigtypeLegacyNormal3;
				else if ( _T("legacyNormal4") == sValue ) m_eValue = lightrigtypeLegacyNormal4;
				break;
			case 'm':
				if      ( _T("morning") == sValue ) m_eValue = lightrigtypeMorning;
				break;
			case 's':
				if      ( _T("soft")    == sValue ) m_eValue = lightrigtypeSoft;
				else if ( _T("sunrise") == sValue ) m_eValue = lightrigtypeSunrise;
				else if ( _T("sunset")  == sValue ) m_eValue = lightrigtypeSunset;
				break;
			case 't':
				if      ( _T("threePt") == sValue ) m_eValue = lightrigtypeThreePt;
				else if ( _T("twoPt")   == sValue ) m_eValue = lightrigtypeTwoPt;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case lightrigtypeBalanced      : return _T("balanced");
			case lightrigtypeBrightRoom    : return _T("brightRoom");
			case lightrigtypeChilly        : return _T("chilly");
			case lightrigtypeContrasting   : return _T("contrasting");
			case lightrigtypeFlat          : return _T("flat"); 
			case lightrigtypeFlood         : return _T("flood");
			case lightrigtypeFreezing      : return _T("freezing");
			case lightrigtypeGlow          : return _T("glow");
			case lightrigtypeHarsh         : return _T("harsh");
			case lightrigtypeLegacyFlat1   : return _T("legacyFlat1");
			case lightrigtypeLegacyFlat2   : return _T("legacyFlat2");
			case lightrigtypeLegacyFlat3   : return _T("legacyFlat3"); 
			case lightrigtypeLegacyFlat4   : return _T("legacyFlat4");
			case lightrigtypeLegacyHarsh1  : return _T("legacyHarsh1");
			case lightrigtypeLegacyHarsh2  : return _T("legacyHarsh2");
			case lightrigtypeLegacyHarsh3  : return _T("legacyHarsh3");
			case lightrigtypeLegacyHarsh4  : return _T("legacyHarsh4");
			case lightrigtypeLegacyNormal1 : return _T("legacyNormal1");
			case lightrigtypeLegacyNormal2 : return _T("legacyNormal2"); 
			case lightrigtypeLegacyNormal3 : return _T("legacyNormal3");
			case lightrigtypeLegacyNormal4 : return _T("legacyNormal4"); 
			case lightrigtypeMorning       : return _T("morning");
			case lightrigtypeSoft          : return _T("soft"); 
			case lightrigtypeSunrise       : return _T("sunrise"); 
			case lightrigtypeSunset        : return _T("sunset");
			case lightrigtypeThreePt       : return _T("threePt"); 
			case lightrigtypeTwoPt         : return _T("twoPt");			
			default                        : return _T("balanced");
			}
		}

		SimpleType_FromString     (ELightRigType)
		SimpleType_Operator_Equal (CLightRigType)
	};
	
	
	
	enum ELineCap
	{
		linecapFlat = 0,
		linecapRnd  = 1,
		linecapSq   = 2,
	};

	template<ELineCap eDefValue = linecapRnd>
	class CLineCap : public CSimpleType<ELineCap, eDefValue>
	{
	public:
		CLineCap() {}

		virtual ELineCap FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'f':
				if      ( _T("flat") == sValue ) m_eValue = linecapFlat;
				break;
			case 'r':
				if      ( _T("rnd")  == sValue ) m_eValue = linecapRnd;
				break;
			case 's':
				if      ( _T("sq")   == sValue ) m_eValue = linecapSq;
				break;
			}

			return m_eValue;
		}

		virtual CString  ToString  () const 
		{
			switch(m_eValue)
			{
			case linecapFlat: return _T("flat");			
			case linecapRnd:  return _T("rnd");			
			case linecapSq:   return _T("sq");			
			default :         return _T("rnd");
			}
		}

		SimpleType_FromString     (ELineCap)
		SimpleType_Operator_Equal (CLineCap)
	};
	
	
	
	enum ELineEndLength
	{
		lineendlengthLarge  = 0,
		lineendlengthMedium = 1,
		lineendlengthSmall  = 2,
	};

	template<ELineEndLength eDefValue = lineendlengthMedium>
	class CLineEndLength : public CSimpleType<ELineEndLength, eDefValue>
	{
	public:
		CLineEndLength() {}

		virtual ELineEndLength FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'l':
				if      ( _T("lg")  == sValue ) m_eValue = lineendlengthLarge;
				break;
			case 'm':
				if      ( _T("med") == sValue ) m_eValue = lineendlengthMedium;
				break;
			case 's':
				if      ( _T("sm")  == sValue ) m_eValue = lineendlengthSmall;
				break;
			}

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case lineendlengthLarge:  return _T("lg");			
			case lineendlengthMedium: return _T("med");			
			case lineendlengthSmall:  return _T("sm");		
			default :                 return _T("med");
			}
		}

		SimpleType_FromString     (ELineEndLength)
		SimpleType_Operator_Equal (CLineEndLength)
	};


	
	
	
	enum ELineEndType
	{
		lineendtypeArrow    = 0,
		lineendtypeDiamond  = 1,
		lineendtypeNone     = 2,
		lineendtypeOval     = 3,
		lineendtypeStealth  = 4,
		lineendtypeTriangle = 5,
	};

	template<ELineEndType eDefValue = lineendtypeNone>
	class CLineEndType : public CSimpleType<ELineEndType, eDefValue>
	{
	public:
		CLineEndType() {}

		virtual ELineEndType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("arrow")    == sValue ) m_eValue = lineendtypeArrow;
				break;
			case 'd':
				if      ( _T("diamond")  == sValue ) m_eValue = lineendtypeDiamond;
				break;
			case 'n':
				if      ( _T("none")     == sValue ) m_eValue = lineendtypeNone;
				break;
			case 'o':
				if      ( _T("oval")     == sValue ) m_eValue = lineendtypeOval;
				break;
			case 's':
				if      ( _T("stealth")  == sValue ) m_eValue = lineendtypeStealth;
				break;
			case 't':
				if      ( _T("triangle") == sValue ) m_eValue = lineendtypeTriangle;
				break;
			}

			return m_eValue;
		}

		virtual CString      ToString  () const 
		{
			switch(m_eValue)
			{
			case lineendtypeArrow:    return _T("arrow");			
			case lineendtypeDiamond:  return _T("diamond");			
			case lineendtypeNone:     return _T("none");		
			case lineendtypeOval:     return _T("oval");			
			case lineendtypeStealth:  return _T("stealth");			
			case lineendtypeTriangle: return _T("triangle");		
			default :                 return _T("none");
			}
		}

		SimpleType_FromString     (ELineEndType)
		SimpleType_Operator_Equal (CLineEndType)
	};


	
	
	
	enum ELineEndWidth
	{
		lineendwidthLarge  = 0,
		lineendwidthMedium = 1,
		lineendwidthSmall  = 2,
	};

	template<ELineEndWidth eDefValue = lineendwidthMedium>
	class CLineEndWidth : public CSimpleType<ELineEndWidth, eDefValue>
	{
	public:
		CLineEndWidth() {}

		virtual ELineEndWidth FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'l':
				if      ( _T("lg")  == sValue ) m_eValue = lineendwidthLarge;
				break;
			case 'm':
				if      ( _T("med") == sValue ) m_eValue = lineendwidthMedium;
				break;
			case 's':
				if      ( _T("sm")  == sValue ) m_eValue = lineendwidthSmall;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case lineendwidthLarge:  return _T("lg");			
			case lineendwidthMedium: return _T("med");			
			case lineendwidthSmall:  return _T("sm");		
			default :                return _T("med");
			}
		}

		SimpleType_FromString     (ELineEndWidth)
		SimpleType_Operator_Equal (CLineEndWidth)
	};


	
    
	
    template<__int64 nDefValue = 0>
    class CLineWidth : public CSimpleType<__int64, nDefValue>
    {
    public:
        CLineWidth() {}

        virtual __int64 FromString(CString &sValue)
        {
            m_eValue = _wtoi64( sValue );
            if (m_eValue < 0)
                m_eValue = 0;
            if (m_eValue > 20116800)
                m_eValue = 20116800;

            return m_eValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%d"), m_eValue);

            return sResult;
        }

        SimpleType_FromString     (__int64)
        SimpleType_Operator_Equal (CLineWidth)

        double ToPoints()
        {
            return Emu_To_Pt( m_eValue );
        }

        double ToInches()
        {
            return Emu_To_Inch( m_eValue );
        }

		double FromEmu(const __int64 nEmu)
		{
			m_eValue = nEmu;
			return Emu_To_Pt( m_eValue );
		}
    };
	
	
	
	enum EPathFillMode
	{
		pathfillmodeDarken      = 0,
		pathfillmodeDarkenLess  = 1,
		pathfillmodeLighten     = 2,
		pathfillmodeLightenLess = 3,
		pathfillmodeNone        = 4,
		pathfillmodeNorm        = 5,
	};

	template<EPathFillMode eDefValue = pathfillmodeNone>
	class CPathFillMode : public CSimpleType<EPathFillMode, eDefValue>
	{
	public:
		CPathFillMode() {}

		virtual EPathFillMode FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'd':
				if      ( _T("darken")     == sValue ) m_eValue = pathfillmodeDarken;
				else if ( _T("darkenLess") == sValue ) m_eValue = pathfillmodeDarkenLess;
				break;
			case 'l':
				if      ( _T("lighten")    == sValue ) m_eValue = pathfillmodeLighten;
				else if ( _T("darkenLess") == sValue ) m_eValue = pathfillmodeLightenLess;
				break;
			case 'n':
				if      ( _T("none")       == sValue ) m_eValue = pathfillmodeNone;
				else if ( _T("norm")       == sValue ) m_eValue = pathfillmodeNorm;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case pathfillmodeDarken:      return _T("darken");			
			case pathfillmodeDarkenLess:  return _T("darkenLess");			
			case pathfillmodeLighten:     return _T("lighten");		
			case pathfillmodeLightenLess: return _T("lightenLess");			
			case pathfillmodeNone:        return _T("none");			
			case pathfillmodeNorm:        return _T("norm");		
			default :                     return _T("none");
			}
		}

		SimpleType_FromString     (EPathFillMode)
		SimpleType_Operator_Equal (CPathFillMode)
	};


	
	
	
	enum EPathShadeType
	{
		pathshadetypeCircle = 0,
		pathshadetypeRect   = 1,
		pathshadetypeShape  = 2,
	};

	template<EPathShadeType eDefValue = pathshadetypeRect>
	class CPathShadeType : public CSimpleType<EPathShadeType, eDefValue>
	{
	public:
		CPathShadeType() {}

		virtual EPathShadeType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("circle") == sValue ) m_eValue = pathshadetypeCircle;
				break;
			case 'r':
				if      ( _T("rect")   == sValue ) m_eValue = pathshadetypeRect;
				break;
			case 's':
				if      ( _T("shape")  == sValue ) m_eValue = pathshadetypeShape;
				break;
			}

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case pathshadetypeCircle: return _T("circle");			
			case pathshadetypeRect:   return _T("rect");			
			case pathshadetypeShape:  return _T("shape");		
			default :                 return _T("rect");
			}
		}

		SimpleType_FromString     (EPathShadeType)
		SimpleType_Operator_Equal (CPathShadeType)
	};


	
	
	
	enum EPenAlignment
	{
		penalignmentCtr = 0,
		penalignmentIn  = 1,
	};

	template<EPenAlignment eDefValue = penalignmentCtr>
	class CPenAlignment : public CSimpleType<EPenAlignment, eDefValue>
	{
	public:
		CPenAlignment() {}

		virtual EPenAlignment FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("ctr") == sValue ) m_eValue = penalignmentCtr;
				break;
			case 'i':
				if      ( _T("in")  == sValue ) m_eValue = penalignmentIn;
				break;
			}

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case penalignmentCtr: return _T("ctr");			
			case penalignmentIn:  return _T("in");			
			default :             return _T("ctr");
			}
		}

		SimpleType_FromString     (EPenAlignment)
		SimpleType_Operator_Equal (CPenAlignment)
	};
	
    
	
    class CPercentage 
    {
    public:
        CPercentage() 
		{
			m_dValue = 0;
		}

		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_dValue = dValue;
		}

        virtual double FromString(CString &sValue)
        {
			int nPos = sValue.Find( '%' );
			int nLen = sValue.GetLength();
			if ( -1 == nPos || nPos != sValue.GetLength() - 1 || nLen <= 0  )
			{
				if ( -1 == nPos )
				{
					
					int nValue = _wtoi( sValue );
					m_dValue = nValue / 1000.0;
				}
				else
					m_dValue = 0;
			}
			else
				m_dValue = _wtof( sValue.Mid( 0, nLen - 1 ) );

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%f%%"), m_dValue );

            return sResult;
        }

        SimpleType_FromString2    (double)
        SimpleType_Operator_Equal (CPercentage)

	private:

		double m_dValue;
    };
	
    
	
    template<__int64 nDefValue = 0>
    class CPositiveCoordinate : public CSimpleType<__int64, nDefValue>
    {
    public:
        CPositiveCoordinate() {}

        virtual __int64 FromString(CString &sValue)
        {
            m_eValue = _wtoi64( sValue );
            if (m_eValue < 0)
                m_eValue = 0;
            if (m_eValue > 27273042316900)
                m_eValue = 27273042316900;

            return m_eValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%d"), m_eValue);

            return sResult;
        }

        SimpleType_FromString     (__int64)
        SimpleType_Operator_Equal (CPositiveCoordinate)

        double ToPoints() const
        {
            return Emu_To_Pt( m_eValue );
        }
		double ToMM() const
        {
            return Emu_To_Mm( m_eValue );
        }

        double ToInches()
        {
            return Emu_To_Inch( m_eValue );
        }

		double FromEmu(const __int64& nEmu)
		{
			m_eValue = nEmu;
			return Emu_To_Pt( (double)m_eValue );
		}
    };
	
    
	
	#define CPositiveCoordinate32 CPositiveCoordinate
	
	
	
	template<int nDefValue = 0>
	class CPositiveFixedAngle : public CSimpleType<int, nDefValue>
	{
	public:

		CPositiveFixedAngle() {}

		void SetValue(int nValue)
		{
			m_eValue = min( 21600000, max( 0, nValue ) );
		}

		virtual int     FromString(CString &sValue)
		{
			m_eValue = min( 21600000, max( 0, _wtoi( sValue.GetString() ) ) );

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue );
			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CPositiveFixedAngle)

		double  GetAngle() const
		{
			return m_eValue / 60000.0;
		}

	};

	
    
	
    class CPositiveFixedPercentage 
    {
    public:
        CPositiveFixedPercentage() {}

		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_dValue = min( 100, max( 0, dValue ) );
		}

        virtual double FromString(CString &sValue)
        {
			int nPos = sValue.Find( '%' );
			int nLen = sValue.GetLength();
			if ( -1 == nPos || nPos != sValue.GetLength() - 1 || nLen <= 0  )
			{
				if ( -1 == nPos )
				{
					
					int nValue = max( 0, min( 100000, _wtoi( sValue ) ) );
					m_dValue = nValue / 1000.0;
				}
				else
					m_dValue = 0;
			}
			else
				m_dValue = min( 100, max( 0, _wtof( sValue.Mid( 0, nLen - 1 ) ) ) );

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%f%%"), m_dValue );

            return sResult;
        }

        SimpleType_FromString2    (double)
        SimpleType_Operator_Equal (CPositiveFixedPercentage)

	private:

		double m_dValue;
    };
	
    
	
    class CPositivePercentage 
    {
    public:
        CPositivePercentage() {}

		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_dValue = max( 0, dValue );
		}

        virtual double FromString(CString &sValue)
        {
			int nPos = sValue.Find( '%' );
			int nLen = sValue.GetLength();
			if ( -1 == nPos || nPos != sValue.GetLength() - 1 || nLen <= 0  )
			{
				if ( -1 == nPos )
				{
					
					int nValue = max( 0, _wtoi( sValue ) );
					m_dValue = nValue / 1000.0;
				}
				return
					m_dValue = 0;
			}
			else
				m_dValue = max( 0, _wtof( sValue.Mid( 0, nLen - 1 ) ) );

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%f%%"), m_dValue );

            return sResult;
        }

        SimpleType_FromString2    (double)
        SimpleType_Operator_Equal (CPositivePercentage)

	private:

		double m_dValue;
    };
	
	
	
	enum EPresetCameraType
	{
		presetcameratypeIsometricBottomDown, 
		presetcameratypeIsometricBottomUp, 
		presetcameratypeIsometricLeftDown, 
		presetcameratypeIsometricLeftUp, 
		presetcameratypeIsometricOffAxis1Left, 
		presetcameratypeIsometricOffAxis1Right, 
		presetcameratypeIsometricOffAxis1Top, 
		presetcameratypeIsometricOffAxis2Left, 
		presetcameratypeIsometricOffAxis2Right, 
		presetcameratypeIsometricOffAxis2Top, 
		presetcameratypeIsometricOffAxis3Bottom, 
		presetcameratypeIsometricOffAxis3Left, 
		presetcameratypeIsometricOffAxis3Right, 
		presetcameratypeIsometricOffAxis4Bottom, 
		presetcameratypeIsometricOffAxis4Left, 
		presetcameratypeIsometricOffAxis4Right, 
		presetcameratypeIsometricRightDown, 
		presetcameratypeIsometricRightUp, 
		presetcameratypeIsometricTopDown, 
		presetcameratypeIsometricTopUp, 
		presetcameratypeLegacyObliqueBottom, 
		presetcameratypeLegacyObliqueBottomLeft, 
		presetcameratypeLegacyObliqueBottomRight, 
		presetcameratypeLegacyObliqueFront, 
		presetcameratypeLegacyObliqueLeft, 
		presetcameratypeLegacyObliqueRight, 
		presetcameratypeLegacyObliqueTop, 
		presetcameratypeLegacyObliqueTopLeft, 
		presetcameratypeLegacyObliqueTopRight, 
		presetcameratypeLegacyPerspectiveBottom, 
		presetcameratypeLegacyPerspectiveBottomLeft, 
		presetcameratypeLegacyPerspectiveBottomRight, 
		presetcameratypeLegacyPerspectiveFront, 
		presetcameratypeLegacyPerspectiveLeft, 
		presetcameratypeLegacyPerspectiveRight, 
		presetcameratypeLegacyPerspectiveTop, 
		presetcameratypeLegacyPerspectiveTopLeft, 
		presetcameratypeLegacyPerspectiveTopRight, 
		presetcameratypeObliqueBottom, 
		presetcameratypeObliqueBottomLeft, 
		presetcameratypeObliqueBottomRight, 
		presetcameratypeObliqueLeft, 
		presetcameratypeObliqueRight, 
		presetcameratypeObliqueTop, 
		presetcameratypeObliqueTopLeft, 
		presetcameratypeObliqueTopRight, 
		presetcameratypeOrthographicFront, 
		presetcameratypePerspectiveAbove, 
		presetcameratypePerspectiveAboveLeftFacing, 
		presetcameratypePerspectiveAboveRightFacing, 
		presetcameratypePerspectiveBelow, 
		presetcameratypePerspectiveContrastingLeftFacing, 
		presetcameratypePerspectiveContrastingRightFacing, 
		presetcameratypePerspectiveFront, 
		presetcameratypePerspectiveHeroicExtremeLeftFacing, 
		presetcameratypePerspectiveHeroicExtremeRightFacing, 
		presetcameratypePerspectiveHeroicLeftFacing, 
		presetcameratypePerspectiveHeroicRightFacing, 
		presetcameratypePerspectiveLeft, 
		presetcameratypePerspectiveRelaxed, 
		presetcameratypePerspectiveRelaxedModerately, 
		presetcameratypePerspectiveRight, 
	};

	template<EPresetCameraType eDefValue = presetcameratypePerspectiveFront>
	class CPresetCameraType : public CSimpleType<EPresetCameraType, eDefValue>
	{
	public:
		CPresetCameraType() {}

		virtual EPresetCameraType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'i':
				if      ( _T("isometricBottomDown")					== sValue ) m_eValue = presetcameratypeIsometricBottomDown;
				else if ( _T("isometricBottomUp")					== sValue ) m_eValue = presetcameratypeIsometricBottomUp;
				else if ( _T("isometricLeftDown")					== sValue ) m_eValue = presetcameratypeIsometricLeftDown;
				else if ( _T("isometricLeftUp")						== sValue ) m_eValue = presetcameratypeIsometricLeftUp;
				else if ( _T("isometricOffAxis1Left")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis1Left;
				else if ( _T("isometricOffAxis1Right")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis1Right;
				else if ( _T("isometricOffAxis1Top")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis1Top;
				else if ( _T("isometricOffAxis2Left")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis2Left;
				else if ( _T("isometricOffAxis2Right")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis2Right;
				else if ( _T("isometricOffAxis2Top")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis2Top;
				else if ( _T("isometricOffAxis3Bottom")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis3Bottom ;
				else if ( _T("isometricOffAxis3Left")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis3Left;
				else if ( _T("isometricOffAxis3Right")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis3Right;
				else if ( _T("isometricOffAxis4Bottom")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis4Bottom;
				else if ( _T("isometricOffAxis4Left")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis4Left;
				else if ( _T("isometricOffAxis4Right")				== sValue ) m_eValue = presetcameratypeIsometricOffAxis4Right;
				else if ( _T("isometricRightDown")					== sValue ) m_eValue = presetcameratypeIsometricRightDown;
				else if ( _T("isometricRightUp")					== sValue ) m_eValue = presetcameratypeIsometricRightUp;
				else if ( _T("isometricTopDown")					== sValue ) m_eValue = presetcameratypeIsometricTopDown;
				else if ( _T("isometricTopUp")						== sValue ) m_eValue = presetcameratypeIsometricTopUp;
				break;
			case 'l':
				if      ( _T("legacyObliqueBottom")					== sValue ) m_eValue = presetcameratypeLegacyObliqueBottom;
				else if ( _T("legacyObliqueBottomLeft")				== sValue ) m_eValue = presetcameratypeLegacyObliqueBottomLeft;
				else if ( _T("legacyObliqueBottomRight")			== sValue ) m_eValue = presetcameratypeLegacyObliqueBottomRight;
				else if ( _T("legacyObliqueFront")					== sValue ) m_eValue = presetcameratypeLegacyObliqueFront;
				else if ( _T("legacyObliqueLeft")					== sValue ) m_eValue = presetcameratypeLegacyObliqueLeft;
				else if ( _T("legacyObliqueRight")					== sValue ) m_eValue = presetcameratypeLegacyObliqueRight;
				else if ( _T("legacyObliqueTop")					== sValue ) m_eValue = presetcameratypeLegacyObliqueTop;
				else if ( _T("legacyObliqueTopLeft")				== sValue ) m_eValue = presetcameratypeLegacyObliqueTopLeft;
				else if ( _T("legacyObliqueTopRight")				== sValue ) m_eValue = presetcameratypeLegacyObliqueTopRight;
				else if ( _T("legacyPerspectiveBottom")				== sValue ) m_eValue = presetcameratypeLegacyPerspectiveBottom;
				else if ( _T("legacyPerspectiveBottomLeft")			== sValue ) m_eValue = presetcameratypeLegacyPerspectiveBottomLeft; 
				else if ( _T("legacyPerspectiveBottomRight")		== sValue ) m_eValue = presetcameratypeLegacyPerspectiveBottomRight;
				else if ( _T("legacyPerspectiveFront")				== sValue ) m_eValue = presetcameratypeLegacyPerspectiveFront;
				else if ( _T("legacyPerspectiveLeft")				== sValue ) m_eValue = presetcameratypeLegacyPerspectiveLeft;
				else if ( _T("legacyPerspectiveRight")				== sValue ) m_eValue = presetcameratypeLegacyPerspectiveRight;
				else if ( _T("legacyPerspectiveTop")				== sValue ) m_eValue = presetcameratypeLegacyPerspectiveTop;
				else if ( _T("legacyPerspectiveTopLeft")			== sValue ) m_eValue = presetcameratypeLegacyPerspectiveTopLeft;
				else if ( _T("legacyPerspectiveTopRight")			== sValue ) m_eValue = presetcameratypeLegacyPerspectiveTopRight;
				break;
			case 'o':
				if      ( _T("obliqueBottom")						== sValue ) m_eValue = presetcameratypeObliqueBottom;
				else if ( _T("obliqueBottomLeft")					== sValue ) m_eValue = presetcameratypeObliqueBottomLeft;
				else if ( _T("obliqueBottomRight")					== sValue ) m_eValue = presetcameratypeObliqueBottomRight;
				else if ( _T("obliqueLeft")							== sValue ) m_eValue = presetcameratypeObliqueLeft;
				else if ( _T("obliqueRight")						== sValue ) m_eValue = presetcameratypeObliqueRight;
				else if ( _T("obliqueTop")							== sValue ) m_eValue = presetcameratypeObliqueTop;
				else if ( _T("obliqueTopLeft")						== sValue ) m_eValue = presetcameratypeObliqueTopLeft;
				else if ( _T("obliqueTopRight")						== sValue ) m_eValue = presetcameratypeObliqueTopRight;
				else if ( _T("orthographicFront")					== sValue ) m_eValue = presetcameratypeOrthographicFront;
				break;
			case 'p':
				if      ( _T("perspectiveAbove")					== sValue ) m_eValue = presetcameratypePerspectiveAbove;
				else if ( _T("perspectiveAboveLeftFacing")			== sValue ) m_eValue = presetcameratypePerspectiveAboveLeftFacing;
				else if ( _T("perspectiveAboveRightFacing")			== sValue ) m_eValue = presetcameratypePerspectiveAboveRightFacing;
				else if ( _T("perspectiveBelow")					== sValue ) m_eValue = presetcameratypePerspectiveBelow;
				else if ( _T("perspectiveContrastingLeftFacing")	== sValue ) m_eValue = presetcameratypePerspectiveContrastingLeftFacing;
				else if ( _T("perspectiveContrastingRightFacing")	== sValue ) m_eValue = presetcameratypePerspectiveContrastingRightFacing;
				else if ( _T("perspectiveFront")			        == sValue ) m_eValue = presetcameratypePerspectiveFront;
				else if ( _T("perspectiveHeroicExtremeLeftFacing")	== sValue ) m_eValue = presetcameratypePerspectiveHeroicExtremeLeftFacing;
				else if ( _T("perspectiveHeroicExtremeRightFacing") == sValue ) m_eValue = presetcameratypePerspectiveHeroicExtremeRightFacing;
				else if ( _T("perspectiveHeroicLeftFacing")			== sValue ) m_eValue = presetcameratypePerspectiveHeroicLeftFacing;
				else if ( _T("perspectiveHeroicRightFacing")		== sValue ) m_eValue = presetcameratypePerspectiveHeroicRightFacing;
				else if ( _T("perspectiveLeft")						== sValue ) m_eValue = presetcameratypePerspectiveLeft;
				else if ( _T("perspectiveRelaxed")					== sValue ) m_eValue = presetcameratypePerspectiveRelaxed;
				else if ( _T("perspectiveRelaxedModerately")		== sValue ) m_eValue = presetcameratypePerspectiveRelaxedModerately;
				else if ( _T("perspectiveRight")					== sValue ) m_eValue = presetcameratypePerspectiveRight;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case presetcameratypeIsometricBottomDown: return _T("isometricBottomDown"); 
			case presetcameratypeIsometricBottomUp: return _T("isometricBottomUp"); 
			case presetcameratypeIsometricLeftDown: return _T("isometricLeftDown"); 
			case presetcameratypeIsometricLeftUp: return _T("isometricLeftUp"); 
			case presetcameratypeIsometricOffAxis1Left: return _T("isometricOffAxis1Left"); 
			case presetcameratypeIsometricOffAxis1Right: return _T("isometricOffAxis1Right"); 
			case presetcameratypeIsometricOffAxis1Top: return _T("isometricOffAxis1Top"); 
			case presetcameratypeIsometricOffAxis2Left: return _T("isometricOffAxis2Left"); 
			case presetcameratypeIsometricOffAxis2Right: return _T("isometricOffAxis2Right"); 
			case presetcameratypeIsometricOffAxis2Top: return _T("isometricOffAxis2Top"); 
			case presetcameratypeIsometricOffAxis3Bottom: return _T("isometricOffAxis3Bottom"); 
			case presetcameratypeIsometricOffAxis3Left: return _T("isometricOffAxis3Left"); 
			case presetcameratypeIsometricOffAxis3Right: return _T("isometricOffAxis3Right"); 
			case presetcameratypeIsometricOffAxis4Bottom: return _T("isometricOffAxis4Bottom"); 
			case presetcameratypeIsometricOffAxis4Left: return _T("isometricOffAxis4Left"); 
			case presetcameratypeIsometricOffAxis4Right: return _T("isometricOffAxis4Right"); 
			case presetcameratypeIsometricRightDown: return _T("isometricRightDown"); 
			case presetcameratypeIsometricRightUp: return _T("isometricRightUp"); 
			case presetcameratypeIsometricTopDown: return _T("isometricTopDown"); 
			case presetcameratypeIsometricTopUp: return _T("isometricTopUp"); 
			case presetcameratypeLegacyObliqueBottom: return _T("legacyObliqueBottom"); 
			case presetcameratypeLegacyObliqueBottomLeft: return _T("legacyObliqueBottomLeft"); 
			case presetcameratypeLegacyObliqueBottomRight: return _T("legacyObliqueBottomRight"); 
			case presetcameratypeLegacyObliqueFront: return _T("legacyObliqueFront"); 
			case presetcameratypeLegacyObliqueLeft: return _T("legacyObliqueLeft"); 
			case presetcameratypeLegacyObliqueRight: return _T("legacyObliqueRight"); 
			case presetcameratypeLegacyObliqueTop: return _T("legacyObliqueTop"); 
			case presetcameratypeLegacyObliqueTopLeft: return _T("legacyObliqueTopLeft"); 
			case presetcameratypeLegacyObliqueTopRight: return _T("legacyObliqueTopRight"); 
			case presetcameratypeLegacyPerspectiveBottom: return _T("legacyPerspectiveBottom"); 
			case presetcameratypeLegacyPerspectiveBottomLeft: return _T("legacyPerspectiveBottomLeft"); 
			case presetcameratypeLegacyPerspectiveBottomRight: return _T("legacyPerspectiveBottomRight"); 
			case presetcameratypeLegacyPerspectiveFront: return _T("legacyPerspectiveFront"); 
			case presetcameratypeLegacyPerspectiveLeft: return _T("legacyPerspectiveLeft"); 
			case presetcameratypeLegacyPerspectiveRight: return _T("legacyPerspectiveRight"); 
			case presetcameratypeLegacyPerspectiveTop: return _T("legacyPerspectiveTop"); 
			case presetcameratypeLegacyPerspectiveTopLeft: return _T("legacyPerspectiveTopLeft"); 
			case presetcameratypeLegacyPerspectiveTopRight: return _T("legacyPerspectiveTopRight"); 
			case presetcameratypeObliqueBottom: return _T("obliqueBottom"); 
			case presetcameratypeObliqueBottomLeft: return _T("obliqueBottomLeft"); 
			case presetcameratypeObliqueBottomRight: return _T("obliqueBottomRight"); 
			case presetcameratypeObliqueLeft: return _T("obliqueLeft"); 
			case presetcameratypeObliqueRight: return _T("obliqueRight"); 
			case presetcameratypeObliqueTop: return _T("obliqueTop"); 
			case presetcameratypeObliqueTopLeft: return _T("obliqueTopLeft"); 
			case presetcameratypeObliqueTopRight: return _T("obliqueTopRight"); 
			case presetcameratypeOrthographicFront: return _T("orthographicFront"); 
			case presetcameratypePerspectiveAbove: return _T("perspectiveAbove"); 
			case presetcameratypePerspectiveAboveLeftFacing: return _T("perspectiveAboveLeftFacing"); 
			case presetcameratypePerspectiveAboveRightFacing: return _T("perspectiveAboveRightFacing"); 
			case presetcameratypePerspectiveBelow: return _T("perspectiveBelow"); 
			case presetcameratypePerspectiveContrastingLeftFacing: return _T("perspectiveContrastingLeftFacing"); 
			case presetcameratypePerspectiveContrastingRightFacing: return _T("perspectiveContrastingRightFacing"); 
			case presetcameratypePerspectiveFront: return _T("perspectiveFront"); 
			case presetcameratypePerspectiveHeroicExtremeLeftFacing: return _T("perspectiveHeroicExtremeLeftFacing"); 
			case presetcameratypePerspectiveHeroicExtremeRightFacing: return _T("perspectiveHeroicExtremeRightFacing"); 
			case presetcameratypePerspectiveHeroicLeftFacing: return _T("perspectiveHeroicLeftFacing"); 
			case presetcameratypePerspectiveHeroicRightFacing: return _T("perspectiveHeroicRightFacing"); 
			case presetcameratypePerspectiveLeft: return _T("perspectiveLeft"); 
			case presetcameratypePerspectiveRelaxed: return _T("perspectiveRelaxed"); 
			case presetcameratypePerspectiveRelaxedModerately: return _T("perspectiveRelaxedModerately"); 
			case presetcameratypePerspectiveRight: return _T("perspectiveRight"); 
			default :								return _T("orthographicFront");
			}
		}

		SimpleType_FromString     (EPresetCameraType)
		SimpleType_Operator_Equal (CPresetCameraType)
	};


	
	
	
	enum EPresetColorVal
	{
		presetcolorvalAliceBlue = 0, 
		presetcolorvalAntiqueWhite, 
		presetcolorvalAqua, 
		presetcolorvalAquamarine, 
		presetcolorvalAzure, 
		presetcolorvalBeige, 
		presetcolorvalBisque, 
		presetcolorvalBlack, 
		presetcolorvalBlanchedAlmond, 
		presetcolorvalBlue, 
		presetcolorvalBlueViolet, 
		presetcolorvalBrown, 
		presetcolorvalBurlyWood, 
		presetcolorvalCadetBlue, 
		presetcolorvalChartreuse, 
		presetcolorvalChocolate, 
		presetcolorvalCoral, 
		presetcolorvalCornflowerBlue, 
		presetcolorvalCornsilk, 
		presetcolorvalCrimson, 
		presetcolorvalCyan, 
		presetcolorvalDarkBlue, 
		presetcolorvalDarkCyan, 
		presetcolorvalDarkGoldenrod, 
		presetcolorvalDarkGray, 
		presetcolorvalDarkGreen, 
		presetcolorvalDarkGrey, 
		presetcolorvalDarkKhaki, 
		presetcolorvalDarkMagenta, 
		presetcolorvalDarkOliveGreen, 
		presetcolorvalDarkOrange, 
		presetcolorvalDarkOrchid, 
		presetcolorvalDarkRed, 
		presetcolorvalDarkSalmon, 
		presetcolorvalDarkSeaGreen, 
		presetcolorvalDarkSlateBlue, 
		presetcolorvalDarkSlateGray, 
		presetcolorvalDarkSlateGrey, 
		presetcolorvalDarkTurquoise, 
		presetcolorvalDarkViolet, 
		presetcolorvalDeepPink, 
		presetcolorvalDeepSkyBlue, 
		presetcolorvalDimGray, 
		presetcolorvalDimGrey, 
		presetcolorvalDkBlue, 
		presetcolorvalDkCyan, 
		presetcolorvalDkGoldenrod, 
		presetcolorvalDkGray, 
		presetcolorvalDkGreen, 
		presetcolorvalDkGrey, 
		presetcolorvalDkKhaki, 
		presetcolorvalDkMagenta, 
		presetcolorvalDkOliveGreen, 
		presetcolorvalDkOrange, 
		presetcolorvalDkOrchid, 
		presetcolorvalDkRed, 
		presetcolorvalDkSalmon, 
		presetcolorvalDkSeaGreen, 
		presetcolorvalDkSlateBlue, 
		presetcolorvalDkSlateGray, 
		presetcolorvalDkSlateGrey, 
		presetcolorvalDkTurquoise, 
		presetcolorvalDkViolet, 
		presetcolorvalDodgerBlue, 
		presetcolorvalFirebrick, 
		presetcolorvalFloralWhite, 
		presetcolorvalForestGreen, 
		presetcolorvalFuchsia, 
		presetcolorvalGainsboro, 
		presetcolorvalGhostWhite, 
		presetcolorvalGold, 
		presetcolorvalGoldenrod, 
		presetcolorvalGray, 
		presetcolorvalGreen, 
		presetcolorvalGreenYellow, 
		presetcolorvalGrey, 
		presetcolorvalHoneydew, 
		presetcolorvalHotPink, 
		presetcolorvalIndianRed, 
		presetcolorvalIndigo, 
		presetcolorvalIvory, 
		presetcolorvalKhaki, 
		presetcolorvalLavender, 
		presetcolorvalLavenderBlush, 
		presetcolorvalLawnGreen, 
		presetcolorvalLemonChiffon, 
		presetcolorvalLightBlue, 
		presetcolorvalLightCoral, 
		presetcolorvalLightCyan, 
		presetcolorvalLightGoldenrodYellow, 
		presetcolorvalLightGray, 
		presetcolorvalLightGreen, 
		presetcolorvalLightGrey, 
		presetcolorvalLightPink, 
		presetcolorvalLightSalmon, 
		presetcolorvalLightSeaGreen, 
		presetcolorvalLightSkyBlue, 
		presetcolorvalLightSlateGray, 
		presetcolorvalLightSlateGrey, 
		presetcolorvalLightSteelBlue, 
		presetcolorvalLightYellow, 
		presetcolorvalLime, 
		presetcolorvalLimeGreen, 
		presetcolorvalLinen, 
		presetcolorvalLtBlue, 
		presetcolorvalLtCoral, 
		presetcolorvalLtCyan, 
		presetcolorvalLtGoldenrodYellow, 
		presetcolorvalLtGray, 
		presetcolorvalLtGreen, 
		presetcolorvalLtGrey, 
		presetcolorvalLtPink, 
		presetcolorvalLtSalmon, 
		presetcolorvalLtSeaGreen, 
		presetcolorvalLtSkyBlue, 
		presetcolorvalLtSlateGray, 
		presetcolorvalLtSlateGrey, 
		presetcolorvalLtSteelBlue, 
		presetcolorvalLtYellow, 
		presetcolorvalMagenta, 
		presetcolorvalMaroon, 
		presetcolorvalMedAquamarine, 
		presetcolorvalMedBlue, 
		presetcolorvalMediumAquamarine, 
		presetcolorvalMediumBlue, 
		presetcolorvalMediumOrchid, 
		presetcolorvalMediumPurple, 
		presetcolorvalMediumSeaGreen, 
		presetcolorvalMediumSlateBlue, 
		presetcolorvalMediumSpringGreen, 
		presetcolorvalMediumTurquoise, 
		presetcolorvalMediumVioletRed, 
		presetcolorvalMedOrchid, 
		presetcolorvalMedPurple, 
		presetcolorvalMedSeaGreen, 
		presetcolorvalMedSlateBlue, 
		presetcolorvalMedSpringGreen, 
		presetcolorvalMedTurquoise, 
		presetcolorvalMedVioletRed, 
		presetcolorvalMidnightBlue, 
		presetcolorvalMintCream, 
		presetcolorvalMistyRose, 
		presetcolorvalMoccasin, 
		presetcolorvalNavajoWhite, 
		presetcolorvalNavy, 
		presetcolorvalOldLace, 
		presetcolorvalOlive, 
		presetcolorvalOliveDrab, 
		presetcolorvalOrange, 
		presetcolorvalOrangeRed, 
		presetcolorvalOrchid, 
		presetcolorvalPaleGoldenrod, 
		presetcolorvalPaleGreen, 
		presetcolorvalPaleTurquoise, 
		presetcolorvalPaleVioletRed, 
		presetcolorvalPapayaWhip, 
		presetcolorvalPeachPuff, 
		presetcolorvalPeru, 
		presetcolorvalPink, 
		presetcolorvalPlum, 
		presetcolorvalPowderBlue, 
		presetcolorvalPurple, 
		presetcolorvalRed, 
		presetcolorvalRosyBrown, 
		presetcolorvalRoyalBlue, 
		presetcolorvalSaddleBrown, 
		presetcolorvalSalmon, 
		presetcolorvalSandyBrown, 
		presetcolorvalSeaGreen, 
		presetcolorvalSeaShell, 
		presetcolorvalSienna, 
		presetcolorvalSilver, 
		presetcolorvalSkyBlue, 
		presetcolorvalSlateBlue, 
		presetcolorvalSlateGray, 
		presetcolorvalSlateGrey, 
		presetcolorvalSnow, 
		presetcolorvalSpringGreen, 
		presetcolorvalSteelBlue, 
		presetcolorvalTan, 
		presetcolorvalTeal, 
		presetcolorvalThistle, 
		presetcolorvalTomato, 
		presetcolorvalTurquoise, 
		presetcolorvalViolet, 
		presetcolorvalWheat, 
		presetcolorvalWhite, 
		presetcolorvalWhiteSmoke, 
		presetcolorvalYellow, 
		presetcolorvalYellowGreen, 
	};

	template<EPresetColorVal eDefValue = presetcolorvalBlack>
	class CPresetColorVal : public CSimpleType<EPresetColorVal, eDefValue>
	{
	public:
		CPresetColorVal() {}

		virtual EPresetColorVal FromString(CString &sValue)
		{
			m_eValue = presetcolorvalBlack;
			SetRGBA( 0, 0, 0, 255 );

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("aliceBlue")			== sValue ) { m_eValue = presetcolorvalAliceBlue; SetRGBA(240,248,255); } 
				else if ( _T("antiqueWhite")		== sValue ) { m_eValue = presetcolorvalAntiqueWhite; SetRGBA(250,235,215); } 
				else if ( _T("aqua")				== sValue ) { m_eValue = presetcolorvalAqua; SetRGBA(0,255,255); } 
				else if ( _T("aquamarine")			== sValue ) { m_eValue = presetcolorvalAquamarine; SetRGBA(127,255,212); } 
				else if ( _T("azure")				== sValue ) { m_eValue = presetcolorvalAzure; SetRGBA(240,255,255); } 
				break;
			case 'b':
				if      ( _T("beige")				== sValue ) { m_eValue = presetcolorvalBeige; SetRGBA(245,245,220); } 
				else if ( _T("bisque")				== sValue ) { m_eValue = presetcolorvalBisque ; SetRGBA(255,228,196); } 
				else if ( _T("black")				== sValue ) { m_eValue = presetcolorvalBlack ; SetRGBA(0,0,0); } 
				else if ( _T("blanchedAlmond")		== sValue ) { m_eValue = presetcolorvalBlanchedAlmond ; SetRGBA(255,235,205); } 
				else if ( _T("blue")				== sValue ) { m_eValue = presetcolorvalBlue ; SetRGBA(0,0,255); } 
				else if ( _T("blueViolet")			== sValue ) { m_eValue = presetcolorvalBlueViolet ; SetRGBA(138,43,226); } 
				else if ( _T("brown")				== sValue ) { m_eValue = presetcolorvalBrown ; SetRGBA(165,42,42); } 
				else if ( _T("burlyWood")			== sValue ) { m_eValue = presetcolorvalBurlyWood ; SetRGBA(222,184,135); } 
				break;
			case 'c':
				if      ( _T("cadetBlue")			== sValue ) { m_eValue = presetcolorvalCadetBlue ; SetRGBA(95,158,160); } 
				else if ( _T("chartreuse")			== sValue ) { m_eValue = presetcolorvalChartreuse ; SetRGBA(127,255,0); } 
				else if ( _T("chocolate")			== sValue ) { m_eValue = presetcolorvalChocolate ; SetRGBA(210,105,30); } 
				else if ( _T("coral")				== sValue ) { m_eValue = presetcolorvalCoral ; SetRGBA(255,127,80); } 
				else if ( _T("cornflowerBlue")		== sValue ) { m_eValue = presetcolorvalCornflowerBlue ; SetRGBA(100,149,237); } 
				else if ( _T("cornsilk")			== sValue ) { m_eValue = presetcolorvalCornsilk ; SetRGBA(255,248,220); } 
				else if ( _T("crimson")				== sValue ) { m_eValue = presetcolorvalCrimson ; SetRGBA(220,20,60); } 
				else if ( _T("cyan")				== sValue ) { m_eValue = presetcolorvalCyan ; SetRGBA(0,255,255); } 
				break;
			case 'd':
				if      ( _T("darkBlue")			== sValue ) { m_eValue = presetcolorvalDarkBlue ; SetRGBA(0,0,139); } 
				else if ( _T("darkCyan")			== sValue ) { m_eValue = presetcolorvalDarkCyan ; SetRGBA(0,139,139); } 
				else if ( _T("darkGoldenrod")		== sValue ) { m_eValue = presetcolorvalDarkGoldenrod ; SetRGBA(184,134,11); } 
				else if ( _T("darkGray")			== sValue ) { m_eValue = presetcolorvalDarkGray ; SetRGBA(169,169,169); } 
				else if ( _T("darkGreen")			== sValue ) { m_eValue = presetcolorvalDarkGreen ; SetRGBA(0,100,0); } 
				else if ( _T("darkGrey")			== sValue ) { m_eValue = presetcolorvalDarkGrey ; SetRGBA(169,169,169); } 
				else if ( _T("darkKhaki")			== sValue ) { m_eValue = presetcolorvalDarkKhaki ; SetRGBA(189,183,107); } 
				else if ( _T("darkMagenta")			== sValue ) { m_eValue = presetcolorvalDarkMagenta ; SetRGBA(139,0,139); } 
				else if ( _T("darkOliveGreen")		== sValue ) { m_eValue = presetcolorvalDarkOliveGreen ; SetRGBA(85,107,47); } 
				else if ( _T("darkOrange")			== sValue ) { m_eValue = presetcolorvalDarkOrange ; SetRGBA(255,140,0); } 
				else if ( _T("darkOrchid")			== sValue ) { m_eValue = presetcolorvalDarkOrchid ; SetRGBA(153,50,204); } 
				else if ( _T("darkRed")				== sValue ) { m_eValue = presetcolorvalDarkRed ; SetRGBA(139,0,0); } 
				else if ( _T("darkSalmon")			== sValue ) { m_eValue = presetcolorvalDarkSalmon ; SetRGBA(233,150,122); } 
				else if ( _T("darkSeaGreen")		== sValue ) { m_eValue = presetcolorvalDarkSeaGreen ; SetRGBA(143,188,143); } 
				else if ( _T("darkSlateBlue")		== sValue ) { m_eValue = presetcolorvalDarkSlateBlue ; SetRGBA(72,61,139); } 
				else if ( _T("darkSlateGray")		== sValue ) { m_eValue = presetcolorvalDarkSlateGray ; SetRGBA(47,79,79); } 
				else if ( _T("darkSlateGrey")		== sValue ) { m_eValue = presetcolorvalDarkSlateGrey ; SetRGBA(47,79,79); } 
				else if ( _T("darkTurquoise")		== sValue ) { m_eValue = presetcolorvalDarkTurquoise ; SetRGBA(0,206,209); } 
				else if ( _T("darkViolet")			== sValue ) { m_eValue = presetcolorvalDarkViolet ; SetRGBA(148,0,211); } 
				else if ( _T("deepPink")			== sValue ) { m_eValue = presetcolorvalDeepPink ; SetRGBA(255,20,147); } 
				else if ( _T("deepSkyBlue")			== sValue ) { m_eValue = presetcolorvalDeepSkyBlue ; SetRGBA(0,191,255); } 
				else if ( _T("dimGray")				== sValue ) { m_eValue = presetcolorvalDimGray ; SetRGBA(105,105,105); } 
				else if ( _T("dimGrey")				== sValue ) { m_eValue = presetcolorvalDimGrey ; SetRGBA(105,105,105); } 
				else if ( _T("dkBlue")				== sValue ) { m_eValue = presetcolorvalDkBlue ; SetRGBA(0,0,139); } 
				else if ( _T("dkCyan")				== sValue ) { m_eValue = presetcolorvalDkCyan ; SetRGBA(0,139,139); } 
				else if ( _T("dkGoldenrod")			== sValue ) { m_eValue = presetcolorvalDkGoldenrod ; SetRGBA(184,134,11); } 
				else if ( _T("dkGray")				== sValue ) { m_eValue = presetcolorvalDkGray ; SetRGBA(169,169,169); } 
				else if ( _T("dkGreen")				== sValue ) { m_eValue = presetcolorvalDkGreen ; SetRGBA(0,100,0); } 
				else if ( _T("dkGrey")				== sValue ) { m_eValue = presetcolorvalDkGrey ; SetRGBA(169,169,169); } 
				else if ( _T("dkKhaki")				== sValue ) { m_eValue = presetcolorvalDkKhaki ; SetRGBA(189,183,107); } 
				else if ( _T("dkMagenta")			== sValue ) { m_eValue = presetcolorvalDkMagenta ; SetRGBA(139,0,139); } 
				else if ( _T("dkOliveGreen")		== sValue ) { m_eValue = presetcolorvalDkOliveGreen ; SetRGBA(85,107,47); } 
				else if ( _T("dkOrange")			== sValue ) { m_eValue = presetcolorvalDkOrange ; SetRGBA(255,140,0); } 
				else if ( _T("dkOrchid")			== sValue ) { m_eValue = presetcolorvalDkOrchid ; SetRGBA(153,50,204); } 
				else if ( _T("dkRed")				== sValue ) { m_eValue = presetcolorvalDkRed ; SetRGBA(139,0,0); } 
				else if ( _T("dkSalmon")			== sValue ) { m_eValue = presetcolorvalDkSalmon ; SetRGBA(233,150,122); } 
				else if ( _T("dkSeaGreen")			== sValue ) { m_eValue = presetcolorvalDkSeaGreen ; SetRGBA(143,188,139); } 
				else if ( _T("dkSlateBlue")			== sValue ) { m_eValue = presetcolorvalDkSlateBlue ; SetRGBA(72,61,139); } 
				else if ( _T("dkSlateGray")			== sValue ) { m_eValue = presetcolorvalDkSlateGray ; SetRGBA(47,79,79); } 
				else if ( _T("dkSlateGrey")			== sValue ) { m_eValue = presetcolorvalDkSlateGrey ; SetRGBA(47,79,79); } 
				else if ( _T("dkTurquoise")			== sValue ) { m_eValue = presetcolorvalDkTurquoise ; SetRGBA(0,206,209); } 
				else if ( _T("dkViolet")			== sValue ) { m_eValue = presetcolorvalDkViolet ; SetRGBA(148,0,211); } 
				else if ( _T("dodgerBlue")			== sValue ) { m_eValue = presetcolorvalDodgerBlue ; SetRGBA(30,144,255); } 
				break;
			case 'f':
				if      ( _T("firebrick")			== sValue ) { m_eValue = presetcolorvalFirebrick ; SetRGBA(178,34,34); } 
				else if ( _T("floralWhite")			== sValue ) { m_eValue = presetcolorvalFloralWhite ; SetRGBA(255,250,240); } 
				else if ( _T("forestGreen")			== sValue ) { m_eValue = presetcolorvalForestGreen ; SetRGBA(34,139,34); } 
				else if ( _T("fuchsia")				== sValue ) { m_eValue = presetcolorvalFuchsia ; SetRGBA(255,0,255); } 
				break;
			case 'g':
				if      ( _T("gainsboro")			== sValue ) { m_eValue = presetcolorvalGainsboro ; SetRGBA(220,220,220); } 
				else if ( _T("ghostWhite")			== sValue ) { m_eValue = presetcolorvalGhostWhite ; SetRGBA(248,248,255); } 
				else if ( _T("gold")				== sValue ) { m_eValue = presetcolorvalGold ; SetRGBA(255,215,0); } 
				else if ( _T("goldenrod")			== sValue ) { m_eValue = presetcolorvalGoldenrod ; SetRGBA(218,165,32); } 
				else if ( _T("gray")				== sValue ) { m_eValue = presetcolorvalGray ; SetRGBA(128,128,128); } 
				else if ( _T("green")				== sValue ) { m_eValue = presetcolorvalGreen ; SetRGBA(0,128,0); } 
				else if ( _T("greenYellow")			== sValue ) { m_eValue = presetcolorvalGreenYellow ; SetRGBA(173,255,47); } 
				else if ( _T("grey")				== sValue ) { m_eValue = presetcolorvalGrey ; SetRGBA(128,128,128); } 
				break;
			case 'h':
				if      ( _T("honeydew")			== sValue ) { m_eValue = presetcolorvalHoneydew ; SetRGBA(240,255,240); } 
				else if ( _T("hotPink")				== sValue ) { m_eValue = presetcolorvalHotPink ; SetRGBA(255,105,180); } 
				break;
			case 'i':
				if      ( _T("indianRed")			== sValue ) { m_eValue = presetcolorvalIndianRed ; SetRGBA(205,92,92); } 
				else if ( _T("indigo")				== sValue ) { m_eValue = presetcolorvalIndigo ; SetRGBA(75,0,130); } 
				else if ( _T("ivory")				== sValue ) { m_eValue = presetcolorvalIvory ; SetRGBA(255,255,240); } 
				break;
			case 'k':
				if      ( _T("khaki")				== sValue ) { m_eValue = presetcolorvalKhaki ; SetRGBA(240,230,140); } 
				break;
			case 'l':
				if      ( _T("lavender")			== sValue ) { m_eValue = presetcolorvalLavender ; SetRGBA(230,230,250); } 
				else if ( _T("lavenderBlush")		== sValue ) { m_eValue = presetcolorvalLavenderBlush ; SetRGBA(255,240,245); } 
				else if ( _T("lawnGreen")			== sValue ) { m_eValue = presetcolorvalLawnGreen ; SetRGBA(124,252,0); } 
				else if ( _T("lemonChiffon")		== sValue ) { m_eValue = presetcolorvalLemonChiffon ; SetRGBA(255,250,205); } 
				else if ( _T("lightBlue")			== sValue ) { m_eValue = presetcolorvalLightBlue ; SetRGBA(173,216,230); } 
				else if ( _T("lightCoral")			== sValue ) { m_eValue = presetcolorvalLightCoral ; SetRGBA(240,128,128); } 
				else if ( _T("lightCyan")			== sValue ) { m_eValue = presetcolorvalLightCyan ; SetRGBA(224,255,255); } 
				else if ( _T("lightGoldenrodYellow")== sValue ) { m_eValue = presetcolorvalLightGoldenrodYellow; SetRGBA(250,250,210); } 
				else if ( _T("lightGray")			== sValue ) { m_eValue = presetcolorvalLightGray ; SetRGBA(211,211,211); } 
				else if ( _T("lightGreen")			== sValue ) { m_eValue = presetcolorvalLightGreen ; SetRGBA(144,238,144); } 
				else if ( _T("lightGrey")			== sValue ) { m_eValue = presetcolorvalLightGrey ; SetRGBA(211,211,211); } 
				else if ( _T("lightPink")			== sValue ) { m_eValue = presetcolorvalLightPink ; SetRGBA(255,182,193); } 
				else if ( _T("lightSalmon")			== sValue ) { m_eValue = presetcolorvalLightSalmon ; SetRGBA(255,160,122); } 
				else if ( _T("lightSeaGreen")		== sValue ) { m_eValue = presetcolorvalLightSeaGreen ; SetRGBA(32,178,170); } 
				else if ( _T("lightSkyBlue")		== sValue ) { m_eValue = presetcolorvalLightSkyBlue ; SetRGBA(135,206,250); } 
				else if ( _T("lightSlateGray")		== sValue ) { m_eValue = presetcolorvalLightSlateGray ; SetRGBA(119,136,153); } 
				else if ( _T("lightSlateGrey")		== sValue ) { m_eValue = presetcolorvalLightSlateGrey ; SetRGBA(119,136,153); } 
				else if ( _T("lightSteelBlue")		== sValue ) { m_eValue = presetcolorvalLightSteelBlue ; SetRGBA(176,196,222); } 
				else if ( _T("lightYellow")			== sValue ) { m_eValue = presetcolorvalLightYellow ; SetRGBA(255,255,224); } 
				else if ( _T("lime")				== sValue ) { m_eValue = presetcolorvalLime ; SetRGBA(0,255,0); } 
				else if ( _T("limeGreen")			== sValue ) { m_eValue = presetcolorvalLimeGreen ; SetRGBA(50,205,50); } 
				else if ( _T("linen")				== sValue ) { m_eValue = presetcolorvalLinen; SetRGBA(250,240,230); } 
				else if ( _T("ltBlue")				== sValue ) { m_eValue = presetcolorvalLtBlue ; SetRGBA(173,216,230); } 
				else if ( _T("ltCoral")				== sValue ) { m_eValue = presetcolorvalLtCoral ; SetRGBA(240,128,128); } 
				else if ( _T("ltCyan")				== sValue ) { m_eValue = presetcolorvalLtCyan ; SetRGBA(224,255,255); } 
				else if ( _T("ltGoldenrodYellow")	== sValue ) { m_eValue = presetcolorvalLtGoldenrodYellow; SetRGBA(250,250,120); } 
				else if ( _T("ltGray")				== sValue ) { m_eValue = presetcolorvalLtGray ; SetRGBA(211,211,211); } 
				else if ( _T("ltGreen")				== sValue ) { m_eValue = presetcolorvalLtGreen ; SetRGBA(144,238,144); } 
				else if ( _T("ltGrey")				== sValue ) { m_eValue = presetcolorvalLtGrey ; SetRGBA(211,211,211); } 
				else if ( _T("ltPink")				== sValue ) { m_eValue = presetcolorvalLtPink ; SetRGBA(255,182,193); } 
				else if ( _T("ltSalmon")			== sValue ) { m_eValue = presetcolorvalLtSalmon ; SetRGBA(255,160,122); } 
				else if ( _T("ltSeaGreen")			== sValue ) { m_eValue = presetcolorvalLtSeaGreen ; SetRGBA(32,178,170); } 
				else if ( _T("ltSkyBlue")			== sValue ) { m_eValue = presetcolorvalLtSkyBlue ; SetRGBA(135,206,250); } 
				else if ( _T("ltSlateGray")			== sValue ) { m_eValue = presetcolorvalLtSlateGray ; SetRGBA(119,136,153); } 
				else if ( _T("ltSlateGrey")			== sValue ) { m_eValue = presetcolorvalLtSlateGrey ; SetRGBA(119,136,153); } 
				else if ( _T("ltSteelBlue")			== sValue ) { m_eValue = presetcolorvalLtSteelBlue ; SetRGBA(176,196,222); } 
				else if ( _T("ltYellow")			== sValue ) { m_eValue = presetcolorvalLtYellow ; SetRGBA(255,255,224); } 
				break;
			case 'm':
				if      ( _T("magenta")				== sValue ) { m_eValue = presetcolorvalMagenta ; SetRGBA(255,0,255); } 
				else if ( _T("maroon")				== sValue ) { m_eValue = presetcolorvalMaroon ; SetRGBA(128,0,0); } 
				else if ( _T("medAquamarine")		== sValue ) { m_eValue = presetcolorvalMedAquamarine ; SetRGBA(102,205,170); } 
				else if ( _T("medBlue")				== sValue ) { m_eValue = presetcolorvalMedBlue ; SetRGBA(0,0,205); } 
				else if ( _T("mediumAquamarine")	== sValue ) { m_eValue = presetcolorvalMediumAquamarine; SetRGBA(102,205,170); } 
				else if ( _T("mediumBlue")			== sValue ) { m_eValue = presetcolorvalMediumBlue ; SetRGBA(0,0,205); } 
				else if ( _T("mediumOrchid")		== sValue ) { m_eValue = presetcolorvalMediumOrchid ; SetRGBA(186,85,211); } 
				else if ( _T("mediumPurple")		== sValue ) { m_eValue = presetcolorvalMediumPurple ; SetRGBA(147,112,219); } 
				else if ( _T("mediumSeaGreen")		== sValue ) { m_eValue = presetcolorvalMediumSeaGreen ; SetRGBA(60,179,113); } 
				else if ( _T("mediumSlateBlue")		== sValue ) { m_eValue = presetcolorvalMediumSlateBlue ; SetRGBA(123,104,238); } 
				else if ( _T("mediumSpringGreen")	== sValue ) { m_eValue = presetcolorvalMediumSpringGreen; SetRGBA(0,250,154); } 
				else if ( _T("mediumTurquoise")		== sValue ) { m_eValue = presetcolorvalMediumTurquoise ; SetRGBA(72,209,204); } 
				else if ( _T("mediumVioletRed")		== sValue ) { m_eValue = presetcolorvalMediumVioletRed ; SetRGBA(199,21,133); } 
				else if ( _T("medOrchid")			== sValue ) { m_eValue = presetcolorvalMedOrchid ; SetRGBA(186,85,211); } 
				else if ( _T("medPurple")			== sValue ) { m_eValue = presetcolorvalMedPurple ; SetRGBA(147,112,219); } 
				else if ( _T("medSeaGreen")			== sValue ) { m_eValue = presetcolorvalMedSeaGreen ; SetRGBA(60,179,113); } 
				else if ( _T("medSlateBlue")		== sValue ) { m_eValue = presetcolorvalMedSlateBlue ; SetRGBA(123,104,238); } 
				else if ( _T("medSpringGreen")		== sValue ) { m_eValue = presetcolorvalMedSpringGreen ; SetRGBA(0,250,154); } 
				else if ( _T("medTurquoise")		== sValue ) { m_eValue = presetcolorvalMedTurquoise ; SetRGBA(72,209,204); } 
				else if ( _T("medVioletRed")		== sValue ) { m_eValue = presetcolorvalMedVioletRed ; SetRGBA(199,21,133); } 
				else if ( _T("midnightBlue")		== sValue ) { m_eValue = presetcolorvalMidnightBlue ; SetRGBA(25,25,112); } 
				else if ( _T("mintCream")			== sValue ) { m_eValue = presetcolorvalMintCream ; SetRGBA(245,255,250); } 
				else if ( _T("mistyRose")			== sValue ) { m_eValue = presetcolorvalMistyRose ; SetRGBA(255,228,225); } 
				else if ( _T("moccasin")			== sValue ) { m_eValue = presetcolorvalMoccasin ; SetRGBA(255,228,181); } 
				break;
			case 'n':
				if      ( _T("navajoWhite")			== sValue ) { m_eValue = presetcolorvalNavajoWhite ; SetRGBA(255,222,173); } 
				else if ( _T("navy")				== sValue ) { m_eValue = presetcolorvalNavy ; SetRGBA(0,0,128); } 
				break;
			case 'o':
				if      ( _T("oldLace")				== sValue ) { m_eValue = presetcolorvalOldLace ; SetRGBA(253,245,230); } 
				else if ( _T("olive")				== sValue ) { m_eValue = presetcolorvalOlive ; SetRGBA(128,128,0); } 
				else if ( _T("oliveDrab")			== sValue ) { m_eValue = presetcolorvalOliveDrab ; SetRGBA(107,142,35); } 
				else if ( _T("orange")				== sValue ) { m_eValue = presetcolorvalOrange ; SetRGBA(255,165,0); } 
				else if ( _T("orangeRed")			== sValue ) { m_eValue = presetcolorvalOrangeRed ; SetRGBA(255,69,0); } 
				else if ( _T("orchid")				== sValue ) { m_eValue = presetcolorvalOrchid ; SetRGBA(218,112,214); } 
				break;
			case 'p':
				if      ( _T("paleGoldenrod")		== sValue ) { m_eValue = presetcolorvalPaleGoldenrod ; SetRGBA(238,232,170); } 
				else if ( _T("paleGreen")			== sValue ) { m_eValue = presetcolorvalPaleGreen ; SetRGBA(152,251,152); } 
				else if ( _T("paleTurquoise")		== sValue ) { m_eValue = presetcolorvalPaleTurquoise ; SetRGBA(175,238,238); } 
				else if ( _T("paleVioletRed")		== sValue ) { m_eValue = presetcolorvalPaleVioletRed ; SetRGBA(219,112,147); } 
				else if ( _T("papayaWhip")			== sValue ) { m_eValue = presetcolorvalPapayaWhip ; SetRGBA(255,239,213); } 
				else if ( _T("peachPuff")			== sValue ) { m_eValue = presetcolorvalPeachPuff ; SetRGBA(255,218,185); } 
				else if ( _T("peru")				== sValue ) { m_eValue = presetcolorvalPeru ; SetRGBA(205,133,63); } 
				else if ( _T("pink")				== sValue ) { m_eValue = presetcolorvalPink ; SetRGBA(255,192,203); } 
				else if ( _T("plum")				== sValue ) { m_eValue = presetcolorvalPlum ; SetRGBA(221,160,221); } 
				else if ( _T("powderBlue")			== sValue ) { m_eValue = presetcolorvalPowderBlue ; SetRGBA(176,224,230); } 
				else if ( _T("purple")				== sValue ) { m_eValue = presetcolorvalPurple ; SetRGBA(128,0,128); } 
				break;
			case 'r':
				if      ( _T("red")					== sValue ) { m_eValue = presetcolorvalRed ; SetRGBA(255,0,0); } 
				else if ( _T("rosyBrown")			== sValue ) { m_eValue = presetcolorvalRosyBrown ; SetRGBA(188,143,143); } 
				else if ( _T("royalBlue")			== sValue ) { m_eValue = presetcolorvalRoyalBlue ; SetRGBA(65,105,225); } 
				break;
			case 's':
				if      ( _T("saddleBrown")			== sValue ) { m_eValue = presetcolorvalSaddleBrown ; SetRGBA(139,69,19); } 
				else if ( _T("salmon")				== sValue ) { m_eValue = presetcolorvalSalmon ; SetRGBA(250,128,114); } 
				else if ( _T("sandyBrown")			== sValue ) { m_eValue = presetcolorvalSandyBrown ; SetRGBA(244,164,96); } 
				else if ( _T("seaGreen")			== sValue ) { m_eValue = presetcolorvalSeaGreen ; SetRGBA(46,139,87); } 
				else if ( _T("seaShell")			== sValue ) { m_eValue = presetcolorvalSeaShell ; SetRGBA(255,245,238); } 
				else if ( _T("sienna")				== sValue ) { m_eValue = presetcolorvalSienna ; SetRGBA(160,82,45); } 
				else if ( _T("silver")				== sValue ) { m_eValue = presetcolorvalSilver ; SetRGBA(192,192,192); } 
				else if ( _T("skyBlue")				== sValue ) { m_eValue = presetcolorvalSkyBlue ; SetRGBA(135,206,235); } 
				else if ( _T("slateBlue")			== sValue ) { m_eValue = presetcolorvalSlateBlue ; SetRGBA(106,90,205); } 
				else if ( _T("slateGray")			== sValue ) { m_eValue = presetcolorvalSlateGray ; SetRGBA(112,128,144); } 
				else if ( _T("slateGrey")			== sValue ) { m_eValue = presetcolorvalSlateGrey ; SetRGBA(112,128,144); } 
				else if ( _T("snow")				== sValue ) { m_eValue = presetcolorvalSnow ; SetRGBA(255,250,250); } 
				else if ( _T("springGreen")			== sValue ) { m_eValue = presetcolorvalSpringGreen ; SetRGBA(0,255,127); } 
				else if ( _T("steelBlue")			== sValue ) { m_eValue = presetcolorvalSteelBlue ; SetRGBA(70,130,180); } 
				break;
			case 't':
				if      ( _T("tan")					== sValue ) { m_eValue = presetcolorvalTan ; SetRGBA(210,180,140); } 
				else if ( _T("teal")				== sValue ) { m_eValue = presetcolorvalTeal ; SetRGBA(0,128,128); } 
				else if ( _T("thistle")				== sValue ) { m_eValue = presetcolorvalThistle ; SetRGBA(216,191,216); } 
				else if ( _T("tomato")				== sValue ) { m_eValue = presetcolorvalTomato ; SetRGBA(255,99,71); } 
				else if ( _T("turquoise")			== sValue ) { m_eValue = presetcolorvalTurquoise ; SetRGBA(64,224,208); } 
				break;
			case 'v':
				if      ( _T("violet")				== sValue ) { m_eValue = presetcolorvalViolet ; SetRGBA(238,130,238); } 
				break;
			case 'w':
				if      ( _T("wheat")				== sValue ) { m_eValue = presetcolorvalWheat ; SetRGBA(245,222,179); } 
				else if ( _T("white")				== sValue ) { m_eValue = presetcolorvalWhite ; SetRGBA(255,255,255); } 
				else if ( _T("whiteSmoke")			== sValue ) { m_eValue = presetcolorvalWhiteSmoke ; SetRGBA(245,245,245); } 
				break;
			case 'y':
				if      ( _T("yellow")				== sValue ) { m_eValue = presetcolorvalYellow ; SetRGBA(255,255,0); } 
				else if ( _T("yellowGreen")			== sValue ) { m_eValue = presetcolorvalYellowGreen ; SetRGBA(154,205,50); } 
				break;
			}

			return m_eValue;
		}

		virtual CString         ToString  () const 
		{
			switch(m_eValue)
			{
			case presetcolorvalAliceBlue:			return _T("aliceBlue");			
			case presetcolorvalAntiqueWhite:		return _T("antiqueWhite");		
			case presetcolorvalAqua:				return _T("aqua");				
			case presetcolorvalAquamarine:			return _T("aquamarine");			
			case presetcolorvalAzure:				return _T("azure");				
			case presetcolorvalBeige:				return _T("beige");				
			case presetcolorvalBisque:				return _T("bisque");				
			case presetcolorvalBlack :				return _T("black");				
			case presetcolorvalBlanchedAlmond :		return _T("blanchedAlmond");		
			case presetcolorvalBlue :				return _T("blue");				
			case presetcolorvalBlueViolet :			return _T("blueViolet");			
			case presetcolorvalBrown :				return _T("brown");				
			case presetcolorvalBurlyWood :			return _T("burlyWood");			
			case presetcolorvalCadetBlue :			return _T("cadetBlue");			
			case presetcolorvalChartreuse :			return _T("chartreuse");			
			case presetcolorvalChocolate :			return _T("chocolate");			
			case presetcolorvalCoral :				return _T("coral");				
			case presetcolorvalCornflowerBlue :		return _T("cornflowerBlue");		
			case presetcolorvalCornsilk :			return _T("cornsilk");			
			case presetcolorvalCrimson :			return _T("crimson");			
			case presetcolorvalCyan :				return _T("cyan");				
			case presetcolorvalDarkBlue :			return _T("darkBlue");			
			case presetcolorvalDarkCyan :			return _T("darkCyan");			
			case presetcolorvalDarkGoldenrod :		return _T("darkGoldenrod");		
			case presetcolorvalDarkGray :			return _T("darkGray");			
			case presetcolorvalDarkGreen:			return _T("darkGreen");			
			case presetcolorvalDarkGrey :			return _T("darkGrey");			
			case presetcolorvalDarkKhaki:			return _T("darkKhaki");			
			case presetcolorvalDarkMagenta :		return _T("darkMagenta");			
			case presetcolorvalDarkOliveGreen :		return _T("darkOliveGreen");		
			case presetcolorvalDarkOrange :			return _T("darkOrange");			
			case presetcolorvalDarkOrchid :			return _T("darkOrchid");			
			case presetcolorvalDarkRed :			return _T("darkRed");				
			case presetcolorvalDarkSalmon :			return _T("darkSalmon");			
			case presetcolorvalDarkSeaGreen :		return _T("darkSeaGreen");		
			case presetcolorvalDarkSlateBlue :		return _T("darkSlateBlue");		
			case presetcolorvalDarkSlateGray :		return _T("darkSlateGray");		
			case presetcolorvalDarkSlateGrey :		return _T("darkSlateGrey");		
			case presetcolorvalDarkTurquoise :		return _T("darkTurquoise");		
			case presetcolorvalDarkViolet :			return _T("darkViolet");			
			case presetcolorvalDeepPink :			return _T("deepPink");			
			case presetcolorvalDeepSkyBlue :		return _T("deepSkyBlue");			
			case presetcolorvalDimGray :			return _T("dimGray");				
			case presetcolorvalDimGrey :			return _T("dimGrey");				
			case presetcolorvalDkBlue :				return _T("dkBlue");				
			case presetcolorvalDkCyan :				return _T("dkCyan");				
			case presetcolorvalDkGoldenrod :		return _T("dkGoldenrod");			
			case presetcolorvalDkGray :				return _T("dkGray");				
			case presetcolorvalDkGreen :			return _T("dkGreen");				
			case presetcolorvalDkGrey :				return _T("dkGrey");				
			case presetcolorvalDkKhaki :			return _T("dkKhaki");				
			case presetcolorvalDkMagenta :			return _T("dkMagenta");			
			case presetcolorvalDkOliveGreen :		return _T("dkOliveGreen");		
			case presetcolorvalDkOrange :			return _T("dkOrange");			
			case presetcolorvalDkOrchid :			return _T("dkOrchid");			
			case presetcolorvalDkRed :				return _T("dkRed");				
			case presetcolorvalDkSalmon :			return _T("dkSalmon");			
			case presetcolorvalDkSeaGreen :			return _T("dkSeaGreen");			
			case presetcolorvalDkSlateBlue :		return _T("dkSlateBlue");			
			case presetcolorvalDkSlateGray :		return _T("dkSlateGray");			
			case presetcolorvalDkSlateGrey :		return _T("dkSlateGrey");			
			case presetcolorvalDkTurquoise :		return _T("dkTurquoise");			
			case presetcolorvalDkViolet :			return _T("dkViolet");			
			case presetcolorvalDodgerBlue :			return _T("dodgerBlue");			
			case presetcolorvalFirebrick :			return _T("firebrick");			
			case presetcolorvalFloralWhite :		return _T("floralWhite");			
			case presetcolorvalForestGreen :		return _T("forestGreen");			
			case presetcolorvalFuchsia :			return _T("fuchsia");				
			case presetcolorvalGainsboro :			return _T("gainsboro");			
			case presetcolorvalGhostWhite :			return _T("ghostWhite");			
			case presetcolorvalGold :				return _T("gold");				
			case presetcolorvalGoldenrod :			return _T("goldenrod");			
			case presetcolorvalGray :				return _T("gray");				
			case presetcolorvalGreen :				return _T("green");				
			case presetcolorvalGreenYellow :		return _T("greenYellow");			
			case presetcolorvalGrey :				return _T("grey");				
			case presetcolorvalHoneydew :			return _T("honeydew");			
			case presetcolorvalHotPink :			return _T("hotPink");				
			case presetcolorvalIndianRed :			return _T("indianRed");			
			case presetcolorvalIndigo :				return _T("indigo");				
			case presetcolorvalIvory :				return _T("ivory");				
			case presetcolorvalKhaki :				return _T("khaki");				
			case presetcolorvalLavender :			return _T("lavender");			
			case presetcolorvalLavenderBlush :		return _T("lavenderBlush");		
			case presetcolorvalLawnGreen:			return _T("lawnGreen");			
			case presetcolorvalLemonChiffon :		return _T("lemonChiffon");		
			case presetcolorvalLightBlue :			return _T("lightBlue");			
			case presetcolorvalLightCoral :			return _T("lightCoral");			
			case presetcolorvalLightCyan :			return _T("lightCyan");			
			case presetcolorvalLightGoldenrodYellow:return _T("lightGoldenrodYellow");
			case presetcolorvalLightGray :			return _T("lightGray");			
			case presetcolorvalLightGreen :			return _T("lightGreen");			
			case presetcolorvalLightGrey :			return _T("lightGrey");			
			case presetcolorvalLightPink :			return _T("lightPink");			
			case presetcolorvalLightSalmon :		return _T("lightSalmon");			
			case presetcolorvalLightSeaGreen :		return _T("lightSeaGreen");		
			case presetcolorvalLightSkyBlue :		return _T("lightSkyBlue");		
			case presetcolorvalLightSlateGray :		return _T("lightSlateGray");		
			case presetcolorvalLightSlateGrey :		return _T("lightSlateGrey");		
			case presetcolorvalLightSteelBlue :		return _T("lightSteelBlue");		
			case presetcolorvalLightYellow :		return _T("lightYellow");			
			case presetcolorvalLime :				return _T("lime");				
			case presetcolorvalLimeGreen :			return _T("limeGreen");			
			case presetcolorvalLinen:				return _T("linen");				
			case presetcolorvalLtBlue :				return _T("ltBlue");				
			case presetcolorvalLtCoral :			return _T("ltCoral");				
			case presetcolorvalLtCyan :				return _T("ltCyan");				
			case presetcolorvalLtGoldenrodYellow:	return _T("ltGoldenrodYellow");	
			case presetcolorvalLtGray :				return _T("ltGray");				
			case presetcolorvalLtGreen :			return _T("ltGreen");				
			case presetcolorvalLtGrey :				return _T("ltGrey");				
			case presetcolorvalLtPink :				return _T("ltPink");				
			case presetcolorvalLtSalmon :			return _T("ltSalmon");			
			case presetcolorvalLtSeaGreen :			return _T("ltSeaGreen");			
			case presetcolorvalLtSkyBlue :			return _T("ltSkyBlue");			
			case presetcolorvalLtSlateGray :		return _T("ltSlateGray");			
			case presetcolorvalLtSlateGrey :		return _T("ltSlateGrey");			
			case presetcolorvalLtSteelBlue :		return _T("ltSteelBlue");			
			case presetcolorvalLtYellow :			return _T("ltYellow");			
			case presetcolorvalMagenta :			return _T("magenta");				
			case presetcolorvalMaroon :				return _T("maroon");				
			case presetcolorvalMedAquamarine :		return _T("medAquamarine");		
			case presetcolorvalMedBlue :			return _T("medBlue");				
			case presetcolorvalMediumAquamarine:	return _T("mediumAquamarine");	
			case presetcolorvalMediumBlue :			return _T("mediumBlue");			
			case presetcolorvalMediumOrchid :		return _T("mediumOrchid");		
			case presetcolorvalMediumPurple :		return _T("mediumPurple");		
			case presetcolorvalMediumSeaGreen :		return _T("mediumSeaGreen");		
			case presetcolorvalMediumSlateBlue :	return _T("mediumSlateBlue");		
			case presetcolorvalMediumSpringGreen:	return _T("mediumSpringGreen");	
			case presetcolorvalMediumTurquoise :	return _T("mediumTurquoise");		
			case presetcolorvalMediumVioletRed :	return _T("mediumVioletRed");		
			case presetcolorvalMedOrchid :			return _T("medOrchid");			
			case presetcolorvalMedPurple :			return _T("medPurple");			
			case presetcolorvalMedSeaGreen :		return _T("medSeaGreen");			
			case presetcolorvalMedSlateBlue :		return _T("medSlateBlue");		
			case presetcolorvalMedSpringGreen :		return _T("medSpringGreen");		
			case presetcolorvalMedTurquoise :		return _T("medTurquoise");		
			case presetcolorvalMedVioletRed :		return _T("medVioletRed");		
			case presetcolorvalMidnightBlue :		return _T("midnightBlue");		
			case presetcolorvalMintCream :			return _T("mintCream");			
			case presetcolorvalMistyRose :			return _T("mistyRose");			
			case presetcolorvalMoccasin :			return _T("moccasin");			
			case presetcolorvalNavajoWhite :		return _T("navajoWhite");			
			case presetcolorvalNavy :				return _T("navy");				
			case presetcolorvalOldLace :			return _T("oldLace");				
			case presetcolorvalOlive :				return _T("olive");				
			case presetcolorvalOliveDrab :			return _T("oliveDrab");			
			case presetcolorvalOrange :				return _T("orange");				
			case presetcolorvalOrangeRed :			return _T("orangeRed");			
			case presetcolorvalOrchid :				return _T("orchid");				
			case presetcolorvalPaleGoldenrod :		return _T("paleGoldenrod");		
			case presetcolorvalPaleGreen :			return _T("paleGreen");			
			case presetcolorvalPaleTurquoise :		return _T("paleTurquoise");		
			case presetcolorvalPaleVioletRed :		return _T("paleVioletRed");		
			case presetcolorvalPapayaWhip :			return _T("papayaWhip");			
			case presetcolorvalPeachPuff :			return _T("peachPuff");			
			case presetcolorvalPeru :				return _T("peru");				
			case presetcolorvalPink :				return _T("pink");				
			case presetcolorvalPlum :				return _T("plum");				
			case presetcolorvalPowderBlue :			return _T("powderBlue");			
			case presetcolorvalPurple :				return _T("purple");				
			case presetcolorvalRed :				return _T("red");					
			case presetcolorvalRosyBrown :			return _T("rosyBrown");			
			case presetcolorvalRoyalBlue :			return _T("royalBlue");			
			case presetcolorvalSaddleBrown :		return _T("saddleBrown");			
			case presetcolorvalSalmon :				return _T("salmon");				
			case presetcolorvalSandyBrown :			return _T("sandyBrown");			
			case presetcolorvalSeaGreen :			return _T("seaGreen");			
			case presetcolorvalSeaShell :			return _T("seaShell");			
			case presetcolorvalSienna :				return _T("sienna");				
			case presetcolorvalSilver :				return _T("silver");				
			case presetcolorvalSkyBlue :			return _T("skyBlue");				
			case presetcolorvalSlateBlue :			return _T("slateBlue");			
			case presetcolorvalSlateGray :			return _T("slateGray");			
			case presetcolorvalSlateGrey :			return _T("slateGrey");			
			case presetcolorvalSnow :				return _T("snow");				
			case presetcolorvalSpringGreen :		return _T("springGreen");			
			case presetcolorvalSteelBlue :			return _T("steelBlue");			
			case presetcolorvalTan :				return _T("tan");					
			case presetcolorvalTeal :				return _T("teal");				
			case presetcolorvalThistle :			return _T("thistle");				
			case presetcolorvalTomato :				return _T("tomato");				
			case presetcolorvalTurquoise :			return _T("turquoise");			
			case presetcolorvalViolet :				return _T("violet");				
			case presetcolorvalWheat :				return _T("wheat");				
			case presetcolorvalWhite :				return _T("white");				
			case presetcolorvalWhiteSmoke :			return _T("whiteSmoke");			
			case presetcolorvalYellow :				return _T("yellow");				
			case presetcolorvalYellowGreen :		return _T("yellowGreen");			
			default :								return _T("black");
			}
		}

		SimpleType_FromString     (EPresetColorVal)
		SimpleType_Operator_Equal (CPresetColorVal)
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

		void SetRGBA(unsigned char unR, unsigned char unG, unsigned char unB, unsigned char unA = 255)
		{
			m_unR = unR;
			m_unG = unG;
			m_unB = unB;
			m_unA = unA;
		}

	private:

		unsigned char m_unR;
		unsigned char m_unG;
		unsigned char m_unB;
		unsigned char m_unA;
	};


	
	
	
	enum EPresetLineDashVal
	{
		presetlinedashvalDash          = 0,
		presetlinedashvalDashDot       = 1,
		presetlinedashvalDot           = 2,
		presetlinedashvalLgDash        = 3,
		presetlinedashvalLgDashDot     = 4,
		presetlinedashvalLgDashDotDot  = 5,
		presetlinedashvalSolid         = 6,
		presetlinedashvalSysDash       = 7,
		presetlinedashvalSysDashDot    = 8,
		presetlinedashvalSysDashDotDot = 9,
		presetlinedashvalSysDot        = 10,
	};

	template<EPresetLineDashVal eDefValue = presetlinedashvalSolid>
	class CPresetLineDashVal : public CSimpleType<EPresetLineDashVal, eDefValue>
	{
	public:
		CPresetLineDashVal() {}

		virtual EPresetLineDashVal FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'd':
				if      ( _T("dash")          == sValue ) m_eValue = presetlinedashvalDash;
				else if ( _T("dashDot")       == sValue ) m_eValue = presetlinedashvalDashDot;
				else if ( _T("dot")           == sValue ) m_eValue = presetlinedashvalDot;
				break;
			case 'l':
				if      ( _T("lgDash")        == sValue ) m_eValue = presetlinedashvalLgDash;
				else if ( _T("lgDashDot")     == sValue ) m_eValue = presetlinedashvalLgDashDot;
				else if ( _T("lgDashDotDot")  == sValue ) m_eValue = presetlinedashvalLgDashDotDot;
				break;
			case 's':
				if      ( _T("solid")         == sValue ) m_eValue = presetlinedashvalSolid;
				else if ( _T("sysDash")       == sValue ) m_eValue = presetlinedashvalSysDash;
				else if ( _T("sysDashDot")    == sValue ) m_eValue = presetlinedashvalSysDashDot;
				else if ( _T("sysDashDotDot") == sValue ) m_eValue = presetlinedashvalSysDashDotDot;
				else if ( _T("sysDot")        == sValue ) m_eValue = presetlinedashvalSysDot;
				break;
			}

			return m_eValue;
		}

		virtual CString            ToString  () const 
		{
			switch(m_eValue)
			{
			case presetlinedashvalDash:          return _T("dash");			
			case presetlinedashvalDashDot:       return _T("dashDot");			
			case presetlinedashvalDot:           return _T("dot");		
			case presetlinedashvalLgDash:        return _T("lgDash");			
			case presetlinedashvalLgDashDot:     return _T("lgDashDot");			
			case presetlinedashvalLgDashDotDot:  return _T("lgDashDotDot");		
			case presetlinedashvalSolid:         return _T("solid");			
			case presetlinedashvalSysDash:       return _T("sysDash");			
			case presetlinedashvalSysDashDot:    return _T("sysDashDot");		
			case presetlinedashvalSysDashDotDot: return _T("sysDashDotDot");		
			case presetlinedashvalSysDot:        return _T("sysDot");		
			default :                            return _T("solid");
			}
		}

		SimpleType_FromString     (EPresetLineDashVal)
		SimpleType_Operator_Equal (CPresetLineDashVal)
	};


	
	
	
	enum EPresetMaterialType
	{
		presetmaterialtypeClear             = 0,
		presetmaterialtypeDkEdge            = 1,
		presetmaterialtypeFlat              = 2,
		presetmaterialtypeLegacyMatte       = 3,
		presetmaterialtypeLegacyMetal       = 4,
		presetmaterialtypeLegacyPlastic     = 5,
		presetmaterialtypeLegacyWireframe   = 6,
		presetmaterialtypeMatte             = 7,
		presetmaterialtypeMetal             = 8,
		presetmaterialtypePlastic           = 9,
		presetmaterialtypePowder            = 10,
		presetmaterialtypeSoftEdge          = 11,
		presetmaterialtypeSoftmetal         = 12,
		presetmaterialtypeTranslucentPowder = 13,
		presetmaterialtypeWarmMatte         = 14,
	};

	template<EPresetMaterialType eDefValue = presetmaterialtypeClear>
	class CPresetMaterialType : public CSimpleType<EPresetMaterialType, eDefValue>
	{
	public:
		CPresetMaterialType() {}

		virtual EPresetMaterialType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("clear")             == sValue ) m_eValue = presetmaterialtypeClear;
				break;
			case 'd':
				if      ( _T("dkEdge")            == sValue ) m_eValue = presetmaterialtypeDkEdge;
				break;
			case 'f':
				if      ( _T("flat")              == sValue ) m_eValue = presetmaterialtypeFlat;
				break;
			case 'l':
				if      ( _T("legacyMatte")       == sValue ) m_eValue = presetmaterialtypeLegacyMatte;
				else if ( _T("legacyMetal")       == sValue ) m_eValue = presetmaterialtypeLegacyMetal;
				else if ( _T("legacyPlastic")     == sValue ) m_eValue = presetmaterialtypeLegacyPlastic;
				else if ( _T("legacyWireframe")   == sValue ) m_eValue = presetmaterialtypeLegacyWireframe;
				break;
			case 'm':
				if      ( _T("matte")             == sValue ) m_eValue = presetmaterialtypeMatte;
				else if ( _T("metal")             == sValue ) m_eValue = presetmaterialtypeMetal;
				break;
			case 'p':
				if      ( _T("plastic")           == sValue ) m_eValue = presetmaterialtypePlastic;
				else if ( _T("powder")            == sValue ) m_eValue = presetmaterialtypePowder;
				break;
			case 's':
				if      ( _T("softEdge")          == sValue ) m_eValue = presetmaterialtypeSoftEdge;
				else if ( _T("softmetal")         == sValue ) m_eValue = presetmaterialtypeSoftmetal;
				break;
			case 't':
				if      ( _T("translucentPowder") == sValue ) m_eValue = presetmaterialtypeTranslucentPowder;
				break;
			case 'w':
				if      ( _T("warmMatte")         == sValue ) m_eValue = presetmaterialtypeWarmMatte;
				break;
			}

			return m_eValue;
		}

		virtual CString             ToString  () const 
		{
			switch(m_eValue)
			{
			case presetmaterialtypeClear             : return _T("clear");
			case presetmaterialtypeDkEdge            : return _T("dkEdge");
			case presetmaterialtypeFlat              : return _T("flat");
			case presetmaterialtypeLegacyMatte       : return _T("legacyMatte");
			case presetmaterialtypeLegacyMetal       : return _T("legacyMetal"); 
			case presetmaterialtypeLegacyPlastic     : return _T("legacyPlastic");
			case presetmaterialtypeLegacyWireframe   : return _T("legacyWireframe");
			case presetmaterialtypeMatte             : return _T("matte");
			case presetmaterialtypeMetal             : return _T("metal");
			case presetmaterialtypePlastic           : return _T("plastic");
			case presetmaterialtypePowder            : return _T("powder");
			case presetmaterialtypeSoftEdge          : return _T("softEdge"); 
			case presetmaterialtypeSoftmetal         : return _T("softmetal");
			case presetmaterialtypeTranslucentPowder : return _T("translucentPowder");
			case presetmaterialtypeWarmMatte         : return _T("warmMatte");
			default                                  : return _T("clear");
			}
		}

		SimpleType_FromString     (EPresetMaterialType)
		SimpleType_Operator_Equal (CPresetMaterialType)
	};
	
	
	
	enum EPresetPatternVal
	{
		presetpatternvalCross = 0, 
		presetpatternvalDashDnDiag, 
		presetpatternvalDashHorz, 
		presetpatternvalDashUpDiag, 
		presetpatternvalDashVert, 
		presetpatternvalDiagBrick, 
		presetpatternvalDiagCross, 
		presetpatternvalDivot, 
		presetpatternvalDkDnDiag, 
		presetpatternvalDkHorz, 
		presetpatternvalDkUpDiag, 
		presetpatternvalDkVert, 
		presetpatternvalDnDiag, 
		presetpatternvalDotDmnd, 
		presetpatternvalDotGrid, 
		presetpatternvalHorz, 
		presetpatternvalHorzBrick, 
		presetpatternvalLgCheck, 
		presetpatternvalLgConfetti, 
		presetpatternvalLgGrid, 
		presetpatternvalLtDnDiag, 
		presetpatternvalLtHorz, 
		presetpatternvalLtUpDiag, 
		presetpatternvalLtVert, 
		presetpatternvalNarHorz, 
		presetpatternvalNarVert, 
		presetpatternvalOpenDmnd, 
		presetpatternvalPct10, 
		presetpatternvalPct20, 
		presetpatternvalPct25, 
		presetpatternvalPct30, 
		presetpatternvalPct40, 
		presetpatternvalPct5, 
		presetpatternvalPct50, 
		presetpatternvalPct60, 
		presetpatternvalPct70, 
		presetpatternvalPct75, 
		presetpatternvalPct80, 
		presetpatternvalPct90, 
		presetpatternvalPlaid, 
		presetpatternvalShingle, 
		presetpatternvalSmCheck, 
		presetpatternvalSmConfetti, 
		presetpatternvalSmGrid, 
		presetpatternvalSolidDmnd, 
		presetpatternvalSphere, 
		presetpatternvalTrellis, 
		presetpatternvalUpDiag, 
		presetpatternvalVert, 
		presetpatternvalWave, 
		presetpatternvalWdDnDiag, 
		presetpatternvalWdUpDiag, 
		presetpatternvalWeave, 
		presetpatternvalZigZag, 
	};

	template<EPresetPatternVal eDefValue = presetpatternvalPct10>
	class CPresetPatternVal : public CSimpleType<EPresetPatternVal, eDefValue>
	{
	public:
		CPresetPatternVal() {}
		virtual EPresetPatternVal FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("cross")      == sValue ) m_eValue = presetpatternvalCross;
				break;
			case 'd':
				if      ( _T("dashDnDiag") == sValue ) m_eValue = presetpatternvalDashDnDiag;
				else if ( _T("dashHorz")   == sValue ) m_eValue = presetpatternvalDashHorz;
				else if ( _T("dashUpDiag") == sValue ) m_eValue = presetpatternvalDashUpDiag;
				else if ( _T("dashVert")   == sValue ) m_eValue = presetpatternvalDashVert;
				else if ( _T("diagBrick")  == sValue ) m_eValue = presetpatternvalDiagBrick;
				else if ( _T("diagCross")  == sValue ) m_eValue = presetpatternvalDiagCross;
				else if ( _T("divot")      == sValue ) m_eValue = presetpatternvalDivot;
				else if ( _T("dkDnDiag")   == sValue ) m_eValue = presetpatternvalDkDnDiag;
				else if ( _T("dkHorz")     == sValue ) m_eValue = presetpatternvalDkHorz;
				else if ( _T("dkUpDiag")   == sValue ) m_eValue = presetpatternvalDkUpDiag;
				else if ( _T("dkVert")     == sValue ) m_eValue = presetpatternvalDkVert;
				else if ( _T("dnDiag")     == sValue ) m_eValue = presetpatternvalDnDiag;
				else if ( _T("dotDmnd")    == sValue ) m_eValue = presetpatternvalDotDmnd;
				else if ( _T("dotGrid")    == sValue ) m_eValue = presetpatternvalDotGrid;
				break;
			case 'h':
				if      ( _T("horz")       == sValue ) m_eValue = presetpatternvalHorz;
				else if ( _T("horzBrick")  == sValue ) m_eValue = presetpatternvalHorzBrick;
				break;
			case 'l':
				if      ( _T("lgCheck")    == sValue ) m_eValue = presetpatternvalLgCheck;
				else if ( _T("lgConfetti") == sValue ) m_eValue = presetpatternvalLgConfetti;
				else if ( _T("lgGrid")     == sValue ) m_eValue = presetpatternvalLgGrid;
				else if ( _T("ltDnDiag")   == sValue ) m_eValue = presetpatternvalLtDnDiag;
				else if ( _T("ltHorz")     == sValue ) m_eValue = presetpatternvalLtHorz;
				else if ( _T("ltUpDiag")   == sValue ) m_eValue = presetpatternvalLtUpDiag;
				else if ( _T("ltVert")     == sValue ) m_eValue = presetpatternvalLtVert;
				break;
			case 'n':
				if      ( _T("narHorz")    == sValue ) m_eValue = presetpatternvalNarHorz;
				else if ( _T("narVert")    == sValue ) m_eValue = presetpatternvalNarVert;
				break;
			case 'o':
				if      ( _T("openDmnd")   == sValue ) m_eValue = presetpatternvalOpenDmnd;
				break;
			case 'p':
				if      ( _T("pct10")      == sValue ) m_eValue = presetpatternvalPct10;
				else if ( _T("pct20")      == sValue ) m_eValue = presetpatternvalPct20;
				else if ( _T("pct25")      == sValue ) m_eValue = presetpatternvalPct25;
				else if ( _T("pct30")      == sValue ) m_eValue = presetpatternvalPct30;
				else if ( _T("pct40")      == sValue ) m_eValue = presetpatternvalPct40;
				else if ( _T("pct5")       == sValue ) m_eValue = presetpatternvalPct5;
				else if ( _T("pct50")      == sValue ) m_eValue = presetpatternvalPct50;
				else if ( _T("pct60")      == sValue ) m_eValue = presetpatternvalPct60;
				else if ( _T("pct70")      == sValue ) m_eValue = presetpatternvalPct70;
				else if ( _T("pct75")      == sValue ) m_eValue = presetpatternvalPct75;
				else if ( _T("pct80")      == sValue ) m_eValue = presetpatternvalPct80;
				else if ( _T("pct90")      == sValue ) m_eValue = presetpatternvalPct90;
				else if ( _T("plaid")      == sValue ) m_eValue = presetpatternvalPlaid;
				break;
			case 's':
				if      ( _T("shingle")    == sValue ) m_eValue = presetpatternvalShingle;
				else if ( _T("smCheck")    == sValue ) m_eValue = presetpatternvalSmCheck;
				else if ( _T("smConfetti") == sValue ) m_eValue = presetpatternvalSmConfetti;
				else if ( _T("smGrid")     == sValue ) m_eValue = presetpatternvalSmGrid;
				else if ( _T("solidDmnd")  == sValue ) m_eValue = presetpatternvalSolidDmnd;
				else if ( _T("sphere")     == sValue ) m_eValue = presetpatternvalSphere;
				break;
			case 't':
				if      ( _T("trellis")    == sValue ) m_eValue = presetpatternvalTrellis;
				break;
			case 'u':
				if      ( _T("upDiag")     == sValue ) m_eValue = presetpatternvalUpDiag;
				break;
			case 'v':
				if      ( _T("vert")       == sValue ) m_eValue = presetpatternvalVert;
				break;
			case 'w':
				if      ( _T("wave")       == sValue ) m_eValue = presetpatternvalWave;
				else if ( _T("wdDnDiag")   == sValue ) m_eValue = presetpatternvalWdDnDiag;
				else if ( _T("wdUpDiag")   == sValue ) m_eValue = presetpatternvalWdUpDiag;
				else if ( _T("weave")      == sValue ) m_eValue = presetpatternvalWeave;
				break;
			case 'z':
				if      ( _T("zigZag")     == sValue ) m_eValue = presetpatternvalZigZag;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case presetpatternvalCross:      return _T("cross");
			case presetpatternvalDashDnDiag: return _T("dashDnDiag");
			case presetpatternvalDashHorz:   return _T("dashHorz");
			case presetpatternvalDashUpDiag: return _T("dashUpDiag");
			case presetpatternvalDashVert:   return _T("dashVert");
			case presetpatternvalDiagBrick:  return _T("diagBrick");
			case presetpatternvalDiagCross:  return _T("diagCross");
			case presetpatternvalDivot:      return _T("divot");
			case presetpatternvalDkDnDiag:   return _T("dkDnDiag");
			case presetpatternvalDkHorz:     return _T("dkHorz");
			case presetpatternvalDkUpDiag:   return _T("dkUpDiag");
			case presetpatternvalDkVert:     return _T("dkVert");
			case presetpatternvalDnDiag:     return _T("dnDiag");
			case presetpatternvalDotDmnd:    return _T("dotDmnd");
			case presetpatternvalDotGrid:    return _T("dotGrid");
			case presetpatternvalHorz:       return _T("horz");
			case presetpatternvalHorzBrick:  return _T("horzBrick");
			case presetpatternvalLgCheck:    return _T("lgCheck");
			case presetpatternvalLgConfetti: return _T("lgConfetti");
			case presetpatternvalLgGrid:     return _T("lgGrid");
			case presetpatternvalLtDnDiag:   return _T("ltDnDiag");
			case presetpatternvalLtHorz:     return _T("ltHorz");
			case presetpatternvalLtUpDiag:   return _T("ltUpDiag");
			case presetpatternvalLtVert:     return _T("ltVert");
			case presetpatternvalNarHorz:    return _T("narHorz");
			case presetpatternvalNarVert:    return _T("narVert");
			case presetpatternvalOpenDmnd:   return _T("openDmnd");
			case presetpatternvalPct10:      return _T("pct10");
			case presetpatternvalPct20:      return _T("pct20");
			case presetpatternvalPct25:      return _T("pct25");
			case presetpatternvalPct30:      return _T("pct30");
			case presetpatternvalPct40:      return _T("pct40");
			case presetpatternvalPct5:       return _T("pct5");
			case presetpatternvalPct50:      return _T("pct50");
			case presetpatternvalPct60:      return _T("pct60");
			case presetpatternvalPct70:      return _T("pct70");
			case presetpatternvalPct75:      return _T("pct75");
			case presetpatternvalPct80:      return _T("pct80");
			case presetpatternvalPct90:      return _T("pct90");
			case presetpatternvalPlaid:      return _T("plaid");
			case presetpatternvalShingle:    return _T("shingle");
			case presetpatternvalSmCheck:    return _T("smCheck");
			case presetpatternvalSmConfetti: return _T("smConfetti");
			case presetpatternvalSmGrid:     return _T("smGrid");
			case presetpatternvalSolidDmnd:  return _T("solidDmnd");
			case presetpatternvalSphere:     return _T("sphere");
			case presetpatternvalTrellis:    return _T("trellis");
			case presetpatternvalUpDiag:     return _T("upDiag");
			case presetpatternvalVert:       return _T("vert");
			case presetpatternvalWave:       return _T("wave");
			case presetpatternvalWdDnDiag:   return _T("wdDnDiag");
			case presetpatternvalWdUpDiag:   return _T("wdUpDiag");
			case presetpatternvalWeave:      return _T("weave");
			case presetpatternvalZigZag:     return _T("zigZag Zag");
			default :                        return _T("pct10");
			}
		}

		SimpleType_FromString     (EPresetPatternVal)
		SimpleType_Operator_Equal (CPresetPatternVal)
	};


	
	
	
	enum EPresetShadowVal
	{
		presetshadowvalShdw1  = 1,
		presetshadowvalShdw10 = 10,
		presetshadowvalShdw11 = 11,
		presetshadowvalShdw12 = 12,
		presetshadowvalShdw13 = 13,
		presetshadowvalShdw14 = 14,
		presetshadowvalShdw15 = 15,
		presetshadowvalShdw16 = 16,
		presetshadowvalShdw17 = 17,
		presetshadowvalShdw18 = 18,
		presetshadowvalShdw19 = 19,
		presetshadowvalShdw2  = 2,
		presetshadowvalShdw20 = 20,
		presetshadowvalShdw3  = 3,
		presetshadowvalShdw4  = 4,
		presetshadowvalShdw5  = 5,
		presetshadowvalShdw6  = 6,
		presetshadowvalShdw7  = 7,
		presetshadowvalShdw8  = 8,
		presetshadowvalShdw9  = 9,
	};

	template<EPresetShadowVal eDefValue = presetshadowvalShdw14>
	class CPresetShadowVal : public CSimpleType<EPresetShadowVal, eDefValue>
	{
	public:
		CPresetShadowVal() {}
		virtual EPresetShadowVal FromString(CString &sValue)
		{
			if      ( _T("shdw1")  == sValue ) m_eValue = presetshadowvalShdw1;
			else if ( _T("shdw10") == sValue ) m_eValue = presetshadowvalShdw10;
			else if ( _T("shdw11") == sValue ) m_eValue = presetshadowvalShdw11;
			else if ( _T("shdw12") == sValue ) m_eValue = presetshadowvalShdw12;
			else if ( _T("shdw13") == sValue ) m_eValue = presetshadowvalShdw13;
			else if ( _T("shdw14") == sValue ) m_eValue = presetshadowvalShdw14;
			else if ( _T("shdw15") == sValue ) m_eValue = presetshadowvalShdw15;
			else if ( _T("shdw16") == sValue ) m_eValue = presetshadowvalShdw16;
			else if ( _T("shdw17") == sValue ) m_eValue = presetshadowvalShdw17;
			else if ( _T("shdw18") == sValue ) m_eValue = presetshadowvalShdw18;
			else if ( _T("shdw19") == sValue ) m_eValue = presetshadowvalShdw19;
			else if ( _T("shdw2")  == sValue ) m_eValue = presetshadowvalShdw2;
			else if ( _T("shdw20") == sValue ) m_eValue = presetshadowvalShdw20;
			else if ( _T("shdw3")  == sValue ) m_eValue = presetshadowvalShdw3;
			else if ( _T("shdw4")  == sValue ) m_eValue = presetshadowvalShdw4;
			else if ( _T("shdw5")  == sValue ) m_eValue = presetshadowvalShdw5;
			else if ( _T("shdw6")  == sValue ) m_eValue = presetshadowvalShdw6;
			else if ( _T("shdw7")  == sValue ) m_eValue = presetshadowvalShdw7;
			else if ( _T("shdw8")  == sValue ) m_eValue = presetshadowvalShdw8;
			else if ( _T("shdw9")  == sValue ) m_eValue = presetshadowvalShdw9;
			else                               m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString          ToString  () const 
		{
			switch(m_eValue)
			{
			case presetshadowvalShdw1:  return _T("shdw1");			
			case presetshadowvalShdw2:  return _T("shdw2");		
			case presetshadowvalShdw3:  return _T("shdw3");				
			case presetshadowvalShdw4:  return _T("shdw4");			
			case presetshadowvalShdw5:  return _T("shdw5");				
			case presetshadowvalShdw6:  return _T("shdw6");				
			case presetshadowvalShdw7:  return _T("shdw7");				
			case presetshadowvalShdw8:  return _T("shdw8");				
			case presetshadowvalShdw9:  return _T("shdw9");		
			case presetshadowvalShdw10: return _T("shdw10");				
			case presetshadowvalShdw11: return _T("shdw11");			
			case presetshadowvalShdw12: return _T("shdw12");				
			case presetshadowvalShdw13: return _T("shdw13");			
			case presetshadowvalShdw14: return _T("shdw14");			
			case presetshadowvalShdw15: return _T("shdw15");			
			case presetshadowvalShdw16: return _T("shdw16");			
			case presetshadowvalShdw17: return _T("shdw17");				
			case presetshadowvalShdw18: return _T("shdw18");		
			case presetshadowvalShdw19: return _T("shdw19");			
			case presetshadowvalShdw20: return _T("shdw20");			
			default :                   return _T("shdw14");
			}
		}

		SimpleType_FromString     (EPresetShadowVal)
		SimpleType_Operator_Equal (CPresetShadowVal)
	};


	
	
	
	enum ERectAlignment
	{
		rectalignmentB   = 0,
		rectalignmentBL  = 1,
		rectalignmentBR  = 2,
		rectalignmentCtr = 3,
		rectalignmentL   = 4,
		rectalignmentR   = 5,
		rectalignmentT   = 6,
		rectalignmentTL  = 7,
		rectalignmentTR  = 8,
	};

	template<ERectAlignment eDefValue = rectalignmentBL>
	class CRectAlignment : public CSimpleType<ERectAlignment, eDefValue>
	{
	public:
		CRectAlignment() {}

		virtual ERectAlignment FromString(CString &sValue)
		{
			if      ( _T("b")   == sValue ) m_eValue = rectalignmentB;     
			else if ( _T("bl")  == sValue ) m_eValue = rectalignmentBL;     
			else if ( _T("br")  == sValue ) m_eValue = rectalignmentBR;     
			else if ( _T("ctr") == sValue ) m_eValue = rectalignmentCtr;     
			else if ( _T("l")   == sValue ) m_eValue = rectalignmentL;     
			else if ( _T("r")   == sValue ) m_eValue = rectalignmentR;     
			else if ( _T("t")   == sValue ) m_eValue = rectalignmentT;     
			else if ( _T("tl")  == sValue ) m_eValue = rectalignmentTL;     
			else if ( _T("tr")  == sValue ) m_eValue = rectalignmentTR;     
			else                            m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case rectalignmentB  : return _T("b");
			case rectalignmentBL : return _T("bl");
			case rectalignmentBR : return _T("br");
			case rectalignmentCtr: return _T("ctr");
			case rectalignmentL  : return _T("l");
			case rectalignmentR  : return _T("r");
			case rectalignmentT  : return _T("t");
			case rectalignmentTL : return _T("tl");
			case rectalignmentTR : return _T("tr");
			default              : return _T("bl");
			}
		}

		SimpleType_FromString     (ERectAlignment)
		SimpleType_Operator_Equal (CRectAlignment)
	};


	
	
	
	enum EShemeColorVal
	{
		shemecolorvalAccent1  = 0,
		shemecolorvalAccent2  = 1,
		shemecolorvalAccent3  = 2,
		shemecolorvalAccent4  = 3,
		shemecolorvalAccent5  = 4,
		shemecolorvalAccent6  = 5,
		shemecolorvalBg1      = 6,
		shemecolorvalBg2      = 7,
		shemecolorvalDk1      = 8,
		shemecolorvalDk2      = 9,
		shemecolorvalFolHlink = 10,
		shemecolorvalHlink    = 11,
		shemecolorvalLt1      = 12,
		shemecolorvalLt2      = 13,
		shemecolorvalPhClr    = 14,
		shemecolorvalTx1      = 15,
		shemecolorvalTx2      = 16,
	};

	template<EShemeColorVal eDefValue = shemecolorvalAccent1>
	class CShemeColorVal : public CSimpleType<EShemeColorVal, eDefValue>
	{
	public:
		CShemeColorVal() {}

		virtual EShemeColorVal FromString(CString &sValue)
		{
			m_eValue = eDefValue;
			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':
				if      ( _T("accent1") == sValue ) m_eValue = shemecolorvalAccent1;
				else if ( _T("accent2") == sValue ) m_eValue = shemecolorvalAccent2;
				else if ( _T("accent3") == sValue ) m_eValue = shemecolorvalAccent3;
				else if ( _T("accent4") == sValue ) m_eValue = shemecolorvalAccent4;
				else if ( _T("accent5") == sValue ) m_eValue = shemecolorvalAccent5;
				else if ( _T("accent6") == sValue ) m_eValue = shemecolorvalAccent6;
				break;
			case 'b':
				if      ( _T("bg1") == sValue ) m_eValue = shemecolorvalBg1;
				else if ( _T("bg2") == sValue ) m_eValue = shemecolorvalBg2;
				break;
			case 'd':
				if      ( _T("dk1") == sValue ) m_eValue = shemecolorvalDk1;
				else if ( _T("dk2") == sValue ) m_eValue = shemecolorvalDk2;
				break;
			case 'f':
				if      ( _T("folHlink") == sValue ) m_eValue = shemecolorvalFolHlink;
				break;
			case 'h':
				if      ( _T("hlink") == sValue ) m_eValue = shemecolorvalHlink;
				break;
			case 'l':
				if      ( _T("lt1") == sValue ) m_eValue = shemecolorvalLt1;
				else if ( _T("lt2") == sValue ) m_eValue = shemecolorvalLt2;
				break;
			case 'p':
				if      ( _T("phClr") == sValue ) m_eValue = shemecolorvalPhClr;
				break;
			case 't':
				if      ( _T("tx1") == sValue ) m_eValue = shemecolorvalTx1;
				else if ( _T("tx2") == sValue ) m_eValue = shemecolorvalTx2;
				break;
			}

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case shemecolorvalAccent1:  return _T("accent1");			
			case shemecolorvalAccent2:  return _T("accent2");		
			case shemecolorvalAccent3:  return _T("accent3");				
			case shemecolorvalAccent4:  return _T("accent4");			
			case shemecolorvalAccent5:  return _T("accent5");				
			case shemecolorvalAccent6:  return _T("accent6");				
			case shemecolorvalBg1:      return _T("bg1");				
			case shemecolorvalBg2:      return _T("bg2");				
			case shemecolorvalDk1:      return _T("dk1");		
			case shemecolorvalDk2:      return _T("dk2");				
			case shemecolorvalFolHlink: return _T("folHlink");			
			case shemecolorvalHlink:    return _T("hlink");				
			case shemecolorvalLt1:      return _T("lt1");			
			case shemecolorvalLt2:      return _T("lt2");			
			case shemecolorvalPhClr:    return _T("phClr");			
			case shemecolorvalTx1:      return _T("tx1");			
			case shemecolorvalTx2:      return _T("tx2");				
			default :                   return _T("accent1");
			}
		}

		SimpleType_FromString     (EShemeColorVal)
		SimpleType_Operator_Equal (CShemeColorVal)
	};


	
	
	
	enum EShapeType
	{
		shapetypeAccentBorderCallout1 = 0,
		shapetypeAccentBorderCallout2,
		shapetypeAccentBorderCallout3,
		shapetypeAccentCallout1,
		shapetypeAccentCallout2,
		shapetypeAccentCallout3,
		shapetypeActionButtonBackPrevious,
		shapetypeActionButtonBeginning,
		shapetypeActionButtonBlank,
		shapetypeActionButtonDocument,
		shapetypeActionButtonEnd,
		shapetypeActionButtonForwardNext,
		shapetypeActionButtonHelp,
		shapetypeActionButtonHome,
		shapetypeActionButtonInformation,
		shapetypeActionButtonMovie,
		shapetypeActionButtonReturn,
		shapetypeActionButtonSound,
		shapetypeArc,
		shapetypeBentArrow,
		shapetypeBentConnector2,
		shapetypeBentConnector3,
		shapetypeBentConnector4,
		shapetypeBentConnector5,
		shapetypeBentUpArrow,
		shapetypeBevel,
		shapetypeBlockArc,
		shapetypeBorderCallout1,
		shapetypeBorderCallout2,
		shapetypeBorderCallout3,
		shapetypeBracePair,
		shapetypeBracketPair,
		shapetypeCallout1,
		shapetypeCallout2,
		shapetypeCallout3,
		shapetypeCan,
		shapetypeChartPlus,
		shapetypeChartStar,
		shapetypeChartX,
		shapetypeChevron,
		shapetypeChord,
		shapetypeCircularArrow,
		shapetypeCloud,
		shapetypeCloudCallout,
		shapetypeCorner,
		shapetypeCornerTabs,
		shapetypeCube,
		shapetypeCurvedConnector2,
		shapetypeCurvedConnector3,
		shapetypeCurvedConnector4,
		shapetypeCurvedConnector5,
		shapetypeCurvedDownArrow,
		shapetypeCurvedLeftArrow,
		shapetypeCurvedRightArrow,
		shapetypeCurvedUpArrow,
		shapetypeDecagon,
		shapetypeDiagStripe,
		shapetypeDiamond,
		shapetypeDodecagon,
		shapetypeDonut,
		shapetypeDoubleWave,
		shapetypeDownArrow,
		shapetypeDownArrowCallout,
		shapetypeEllipse,
		shapetypeEllipseRibbon,
		shapetypeEllipseRibbon2,
		shapetypeFlowChartAlternateProcess,
		shapetypeFlowChartCollate,
		shapetypeFlowChartConnector,
		shapetypeFlowChartDecision,
		shapetypeFlowChartDelay,
		shapetypeFlowChartDisplay,
		shapetypeFlowChartDocument,
		shapetypeFlowChartExtract,
		shapetypeFlowChartInputOutput,
		shapetypeFlowChartInternalStorage,
		shapetypeFlowChartMagneticDisk,
		shapetypeFlowChartMagneticDrum,
		shapetypeFlowChartMagneticTape,
		shapetypeFlowChartManualInput,
		shapetypeFlowChartManualOperation,
		shapetypeFlowChartMerge,
		shapetypeFlowChartMultidocument,
		shapetypeFlowChartOfflineStorage,
		shapetypeFlowChartOffpageConnector,
		shapetypeFlowChartOnlineStorage,
		shapetypeFlowChartOr,
		shapetypeFlowChartPredefinedProcess,
		shapetypeFlowChartPreparation,
		shapetypeFlowChartProcess,
		shapetypeFlowChartPunchedCard,
		shapetypeFlowChartPunchedTape,
		shapetypeFlowChartSort,
		shapetypeFlowChartSummingJunction,
		shapetypeFlowChartTerminator,
		shapetypeFoldedCorner,
		shapetypeFrame,
		shapetypeFunnel,
		shapetypeGear6,
		shapetypeGear9,
		shapetypeHalfFrame,
		shapetypeHeart,
		shapetypeHeptagon,
		shapetypeHexagon,
		shapetypeHomePlate,
		shapetypeHorizontalScroll,
		shapetypeIrregularSeal1,
		shapetypeIrregularSeal2,
		shapetypeLeftArrow,
		shapetypeLeftArrowCallout,
		shapetypeLeftBrace,
		shapetypeLeftBracket,
		shapetypeLeftCircularArrow,
		shapetypeLeftRightArrow,
		shapetypeLeftRightArrowCallout,
		shapetypeLeftRightCircularArrow,
		shapetypeLeftRightRibbon,
		shapetypeLeftRightUpArrow,
		shapetypeLeftUpArrow,
		shapetypeLightningBolt,
		shapetypeLine,
		shapetypeLineInv,
		shapetypeMathDivide,
		shapetypeMathEqual,
		shapetypeMathMinus,
		shapetypeMathMultiply,
		shapetypeMathNotEqual,
		shapetypeMathPlus,
		shapetypeMoon,
		shapetypeNonIsoscelesTrapezoid,
		shapetypeNoSmoking,
		shapetypeNotchedRightArrow,
		shapetypeOctagon,
		shapetypeParallelogram,
		shapetypePentagon,
		shapetypePie,
		shapetypePieWedge,
		shapetypePlaque,
		shapetypePlaqueTabs,
		shapetypePlus,
		shapetypeQuadArrow,
		shapetypeQuadArrowCallout,
		shapetypeRect,
		shapetypeRibbon,
		shapetypeRibbon2,
		shapetypeRightArrow,
		shapetypeRightArrowCallout,
		shapetypeRightBrace,
		shapetypeRightBracket,
		shapetypeRound1Rect,
		shapetypeRound2DiagRect,
		shapetypeRound2SameRect,
		shapetypeRoundRect,
		shapetypeRtTriangle,
		shapetypeSmileyFace,
		shapetypeSnip1Rect,
		shapetypeSnip2DiagRect,
		shapetypeSnip2SameRect,
		shapetypeSnipRoundRect,
		shapetypeSquareTabs,
		shapetypeStar10,
		shapetypeStar12,
		shapetypeStar16,
		shapetypeStar24,
		shapetypeStar32,
		shapetypeStar4,
		shapetypeStar5,
		shapetypeStar6,
		shapetypeStar7,
		shapetypeStar8,
		shapetypeStraightConnector1,
		shapetypeStripedRightArrow,
		shapetypeSun,
		shapetypeSwooshArrow,
		shapetypeTeardrop,
		shapetypeTrapezoid,
		shapetypeTriangle,
		shapetypeUpArrow,
		shapetypeUpArrowCallout,
		shapetypeUpDownArrow,
		shapetypeUpDownArrowCallout,
		shapetypeUturnArrow,
		shapetypeVerticalScroll,
		shapetypeWave,
		shapetypeWedgeEllipseCallout,
		shapetypeWedgeRectCallout,
		shapetypeWedgeRoundRectCallout,
	};

	template<EShapeType eDefValue = shapetypeRect>
	class CShapeType : public CSimpleType<EShapeType, eDefValue>
	{
	public:
		CShapeType() {}

		virtual EShapeType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'a':

				if      ( _T("accentBorderCallout1")	== sValue ) m_eValue = shapetypeAccentBorderCallout1;
				else if ( _T("accentBorderCallout2")	== sValue ) m_eValue = shapetypeAccentBorderCallout2;
				else if ( _T("accentBorderCallout3")	== sValue ) m_eValue = shapetypeAccentBorderCallout3;
				else if ( _T("accentCallout1")			== sValue ) m_eValue = shapetypeAccentCallout1;
				else if ( _T("accentCallout2")			== sValue ) m_eValue = shapetypeAccentCallout2;
				else if ( _T("accentCallout3")			== sValue ) m_eValue = shapetypeAccentCallout3;
				else if ( _T("actionButtonBackPrevious")== sValue ) m_eValue = shapetypeActionButtonBackPrevious;
				else if ( _T("actionButtonBeginning")	== sValue ) m_eValue = shapetypeActionButtonBeginning;
				else if ( _T("actionButtonBlank")		== sValue ) m_eValue = shapetypeActionButtonBlank;
				else if ( _T("actionButtonDocument")	== sValue ) m_eValue = shapetypeActionButtonDocument;
				else if ( _T("actionButtonEnd")			== sValue ) m_eValue = shapetypeActionButtonEnd;
				else if ( _T("actionButtonForwardNext")	== sValue ) m_eValue = shapetypeActionButtonForwardNext;
				else if ( _T("actionButtonHelp")		== sValue ) m_eValue = shapetypeActionButtonHelp;
				else if ( _T("actionButtonHome")		== sValue ) m_eValue = shapetypeActionButtonHome;
				else if ( _T("actionButtonInformation")	== sValue ) m_eValue = shapetypeActionButtonInformation;
				else if ( _T("actionButtonMovie")		== sValue ) m_eValue = shapetypeActionButtonMovie;
				else if ( _T("actionButtonReturn")		== sValue ) m_eValue = shapetypeActionButtonReturn;
				else if ( _T("actionButtonSound")		== sValue ) m_eValue = shapetypeActionButtonSound;
				else if ( _T("arc")						== sValue ) m_eValue = shapetypeArc;
				break;

			case 'b':
				if      ( _T("bentArrow")				== sValue ) m_eValue = shapetypeBentArrow;
				else if ( _T("bentConnector2")			== sValue ) m_eValue = shapetypeBentConnector2;
				else if ( _T("bentConnector3")			== sValue ) m_eValue = shapetypeBentConnector3;
				else if ( _T("bentConnector4")			== sValue ) m_eValue = shapetypeBentConnector4;
				else if ( _T("bentConnector5")			== sValue ) m_eValue = shapetypeBentConnector5;
				else if ( _T("bentUpArrow")				== sValue ) m_eValue = shapetypeBentUpArrow;
				else if ( _T("bevel")					== sValue ) m_eValue = shapetypeBevel;
				else if ( _T("blockArc")				== sValue ) m_eValue = shapetypeBlockArc;
				else if ( _T("borderCallout1")			== sValue ) m_eValue = shapetypeBorderCallout1;
				else if ( _T("borderCallout2")			== sValue ) m_eValue = shapetypeBorderCallout2;
				else if ( _T("borderCallout3")			== sValue ) m_eValue = shapetypeBorderCallout3;
				else if ( _T("bracePair")				== sValue ) m_eValue = shapetypeBracePair;
				else if ( _T("bracketPair")				== sValue ) m_eValue = shapetypeBracketPair;
				break;

			case 'c':
				if      ( _T("callout1")				== sValue ) m_eValue = shapetypeCallout1;
				else if ( _T("callout2")				== sValue ) m_eValue = shapetypeCallout2;
				else if ( _T("callout3")				== sValue ) m_eValue = shapetypeCallout3;
				else if ( _T("can")						== sValue ) m_eValue = shapetypeCan;
				else if ( _T("chartPlus")				== sValue ) m_eValue = shapetypeChartPlus;
				else if ( _T("chartStar")				== sValue ) m_eValue = shapetypeChartStar;
				else if ( _T("chartX")					== sValue ) m_eValue = shapetypeChartX;
				else if ( _T("chevron")					== sValue ) m_eValue = shapetypeChevron;
				else if ( _T("chord")					== sValue ) m_eValue = shapetypeChord;
				else if ( _T("circularArrow")			== sValue ) m_eValue = shapetypeCircularArrow;
				else if ( _T("cloud")					== sValue ) m_eValue = shapetypeCloud;
				else if ( _T("cloudCallout")			== sValue ) m_eValue = shapetypeCloudCallout;
				else if ( _T("corner")					== sValue ) m_eValue = shapetypeCorner;
				else if ( _T("cornerTabs")				== sValue ) m_eValue = shapetypeCornerTabs;
				else if ( _T("cube")					== sValue ) m_eValue = shapetypeCube;
				else if ( _T("curvedConnector2")		== sValue ) m_eValue = shapetypeCurvedConnector2;
				else if ( _T("curvedConnector3")		== sValue ) m_eValue = shapetypeCurvedConnector3;
				else if ( _T("curvedConnector4")		== sValue ) m_eValue = shapetypeCurvedConnector4;
				else if ( _T("curvedConnector5")		== sValue ) m_eValue = shapetypeCurvedConnector5;
				else if ( _T("curvedDownArrow")			== sValue ) m_eValue = shapetypeCurvedDownArrow;
				else if ( _T("curvedLeftArrow")			== sValue ) m_eValue = shapetypeCurvedLeftArrow;
				else if ( _T("curvedRightArrow")		== sValue ) m_eValue = shapetypeCurvedRightArrow;
				else if ( _T("curvedUpArrow")			== sValue ) m_eValue = shapetypeCurvedUpArrow;
				break;

			case 'd':
				if      ( _T("decagon")					== sValue ) m_eValue = shapetypeDecagon;
				else if ( _T("diagStripe")				== sValue ) m_eValue = shapetypeDiagStripe;
				else if ( _T("diamond")					== sValue ) m_eValue = shapetypeDiamond;
				else if ( _T("dodecagon")				== sValue ) m_eValue = shapetypeDodecagon;
				else if ( _T("donut")					== sValue ) m_eValue = shapetypeDonut;
				else if ( _T("doubleWave")				== sValue ) m_eValue = shapetypeDoubleWave;
				else if ( _T("downArrow")				== sValue ) m_eValue = shapetypeDownArrow;
				else if ( _T("downArrowCallout")		== sValue ) m_eValue = shapetypeDownArrowCallout;
				break;

			case 'e':
				if      ( _T("ellipse")					== sValue ) m_eValue = shapetypeEllipse;
				else if ( _T("ellipseRibbon")			== sValue ) m_eValue = shapetypeEllipseRibbon;
				else if ( _T("ellipseRibbon2")			== sValue ) m_eValue = shapetypeEllipseRibbon2;
				break;

			case 'f':
				if      ( _T("flowChartAlternateProcess")	== sValue ) m_eValue = shapetypeFlowChartAlternateProcess;
				else if ( _T("flowChartCollate")			== sValue ) m_eValue = shapetypeFlowChartCollate;
				else if ( _T("flowChartConnector")			== sValue ) m_eValue = shapetypeFlowChartConnector;
				else if ( _T("flowChartDecision")			== sValue ) m_eValue = shapetypeFlowChartDecision;
				else if ( _T("flowChartDelay")				== sValue ) m_eValue = shapetypeFlowChartDelay;
				else if ( _T("flowChartDisplay")			== sValue ) m_eValue = shapetypeFlowChartDisplay;
				else if ( _T("flowChartDocument")			== sValue ) m_eValue = shapetypeFlowChartDocument;
				else if ( _T("flowChartExtract")			== sValue ) m_eValue = shapetypeFlowChartExtract;
				else if ( _T("flowChartInputOutput")		== sValue ) m_eValue = shapetypeFlowChartInputOutput;
				else if ( _T("flowChartInternalStorage")	== sValue ) m_eValue = shapetypeFlowChartInternalStorage;
				else if ( _T("flowChartMagneticDisk")		== sValue ) m_eValue = shapetypeFlowChartMagneticDisk;
				else if ( _T("flowChartMagneticDrum")		== sValue ) m_eValue = shapetypeFlowChartMagneticDrum;
				else if ( _T("flowChartMagneticTape")		== sValue ) m_eValue = shapetypeFlowChartMagneticTape;
				else if ( _T("flowChartManualInput")		== sValue ) m_eValue = shapetypeFlowChartManualInput;
				else if ( _T("flowChartManualOperation")	== sValue ) m_eValue = shapetypeFlowChartManualOperation;
				else if ( _T("flowChartMerge")				== sValue ) m_eValue = shapetypeFlowChartMerge;
				else if ( _T("flowChartMultidocument")		== sValue ) m_eValue = shapetypeFlowChartMultidocument;
				else if ( _T("flowChartOfflineStorage")		== sValue ) m_eValue = shapetypeFlowChartOfflineStorage;
				else if ( _T("flowChartOffpageConnector")	== sValue ) m_eValue = shapetypeFlowChartOffpageConnector;
				else if ( _T("flowChartOnlineStorage")		== sValue ) m_eValue = shapetypeFlowChartOnlineStorage;
				else if ( _T("flowChartOr")					== sValue ) m_eValue = shapetypeFlowChartOr;
				else if ( _T("flowChartPredefinedProcess")	== sValue ) m_eValue = shapetypeFlowChartPredefinedProcess;
				else if ( _T("flowChartPreparation")		== sValue ) m_eValue = shapetypeFlowChartPreparation;
				else if ( _T("flowChartProcess")			== sValue ) m_eValue = shapetypeFlowChartProcess;
				else if ( _T("flowChartPunchedCard")		== sValue ) m_eValue = shapetypeFlowChartPunchedCard;
				else if ( _T("flowChartPunchedTape")		== sValue ) m_eValue = shapetypeFlowChartPunchedTape;
				else if ( _T("flowChartSort")				== sValue ) m_eValue = shapetypeFlowChartSort;
				else if ( _T("flowChartSummingJunction")	== sValue ) m_eValue = shapetypeFlowChartSummingJunction;
				else if ( _T("flowChartTerminator")			== sValue ) m_eValue = shapetypeFlowChartTerminator;
				else if ( _T("foldedCorner")				== sValue ) m_eValue = shapetypeFoldedCorner;
				else if ( _T("frame")						== sValue ) m_eValue = shapetypeFrame;
				else if ( _T("funnel")						== sValue ) m_eValue = shapetypeFunnel;
				break;

			case 'g':
				if      ( _T("gear6")					== sValue ) m_eValue = shapetypeGear6;
				else if ( _T("gear9")					== sValue ) m_eValue = shapetypeGear9;
				break;

			case 'h':
				if      ( _T("halfFrame")				== sValue ) m_eValue = shapetypeHalfFrame;
				else if ( _T("heart")					== sValue ) m_eValue = shapetypeHeart;
				else if ( _T("heptagon")				== sValue ) m_eValue = shapetypeHeptagon;
				else if ( _T("hexagon")					== sValue ) m_eValue = shapetypeHexagon;
				else if ( _T("homePlate")				== sValue ) m_eValue = shapetypeHomePlate;
				else if ( _T("horizontalScroll")		== sValue ) m_eValue = shapetypeHorizontalScroll;
				break;

			case 'i':
				if      ( _T("irregularSeal1")			== sValue ) m_eValue = shapetypeIrregularSeal1;
				else if ( _T("irregularSeal2")			== sValue ) m_eValue = shapetypeIrregularSeal2;
				break;

			case 'l':
				if      ( _T("leftArrow")				== sValue ) m_eValue = shapetypeLeftArrow;
				else if ( _T("leftArrowCallout")		== sValue ) m_eValue = shapetypeLeftArrowCallout;
				else if ( _T("leftBrace")				== sValue ) m_eValue = shapetypeLeftBrace;
				else if ( _T("leftBracket")				== sValue ) m_eValue = shapetypeLeftBracket;
				else if ( _T("leftCircularArrow")		== sValue ) m_eValue = shapetypeLeftCircularArrow;
				else if ( _T("leftRightArrow")			== sValue ) m_eValue = shapetypeLeftRightArrow;
				else if ( _T("leftRightArrowCallout")	== sValue ) m_eValue = shapetypeLeftRightArrowCallout;
				else if ( _T("leftRightCircularArrow")	== sValue ) m_eValue = shapetypeLeftRightCircularArrow;
				else if ( _T("leftRightRibbon")			== sValue ) m_eValue = shapetypeLeftRightRibbon;
				else if ( _T("leftRightUpArrow")		== sValue ) m_eValue = shapetypeLeftRightUpArrow;
				else if ( _T("leftUpArrow")				== sValue ) m_eValue = shapetypeLeftUpArrow;
				else if ( _T("lightningBolt")			== sValue ) m_eValue = shapetypeLightningBolt;
				else if ( _T("line")					== sValue ) m_eValue = shapetypeLine;
				else if ( _T("lineInv")					== sValue ) m_eValue = shapetypeLineInv;
				break;

			case 'm':
				if      ( _T("mathDivide")				== sValue ) m_eValue = shapetypeMathDivide;
				else if ( _T("mathEqual")				== sValue ) m_eValue = shapetypeMathEqual;
				else if ( _T("mathMinus")				== sValue ) m_eValue = shapetypeMathMinus;
				else if ( _T("mathMultiply")			== sValue ) m_eValue = shapetypeMathMultiply;
				else if ( _T("mathNotEqual")			== sValue ) m_eValue = shapetypeMathNotEqual;
				else if ( _T("mathPlus")				== sValue ) m_eValue = shapetypeMathPlus;
				else if ( _T("moon")					== sValue ) m_eValue = shapetypeMoon;
				break;

			case 'n':
				if      ( _T("nonIsoscelesTrapezoid")	== sValue ) m_eValue = shapetypeNonIsoscelesTrapezoid;
				else if ( _T("noSmoking")				== sValue ) m_eValue = shapetypeNoSmoking;
				else if ( _T("notchedRightArrow")		== sValue ) m_eValue = shapetypeNotchedRightArrow;
				break;

			case 'o':
				if      ( _T("octagon")					== sValue ) m_eValue = shapetypeOctagon;
				break;

			case 'p':
				if      ( _T("parallelogram")			== sValue ) m_eValue = shapetypeParallelogram;
				else if ( _T("pentagon")				== sValue ) m_eValue = shapetypePentagon;
				else if ( _T("pie")						== sValue ) m_eValue = shapetypePie;
				else if ( _T("pieWedge")				== sValue ) m_eValue = shapetypePieWedge;
				else if ( _T("plaque")					== sValue ) m_eValue = shapetypePlaque;
				else if ( _T("plaqueTabs")				== sValue ) m_eValue = shapetypePlaqueTabs;
				else if ( _T("plus")					== sValue ) m_eValue = shapetypePlus;
				break;

			case 'q':
				if      ( _T("quadArrow")				== sValue ) m_eValue = shapetypeQuadArrow;
				else if ( _T("quadArrowCallout")		== sValue ) m_eValue = shapetypeQuadArrowCallout;
				break;

			case 'r':
				if      ( _T("rect")					== sValue ) m_eValue = shapetypeRect;
				else if ( _T("ribbon")					== sValue ) m_eValue = shapetypeRibbon;
				else if ( _T("ribbon2")					== sValue ) m_eValue = shapetypeRibbon2;
				else if ( _T("rightArrow")				== sValue ) m_eValue = shapetypeRightArrow;
				else if ( _T("rightArrowCallout")		== sValue ) m_eValue = shapetypeRightArrowCallout;
				else if ( _T("rightBrace")				== sValue ) m_eValue = shapetypeRightBrace;
				else if ( _T("rightBracket")			== sValue ) m_eValue = shapetypeRightBracket;
				else if ( _T("round1Rect")				== sValue ) m_eValue = shapetypeRound1Rect;
				else if ( _T("round2DiagRect")			== sValue ) m_eValue = shapetypeRound2DiagRect;
				else if ( _T("round2SameRect")			== sValue ) m_eValue = shapetypeRound2SameRect;
				else if ( _T("roundRect")				== sValue ) m_eValue = shapetypeRoundRect;
				else if ( _T("rtTriangle")				== sValue ) m_eValue = shapetypeRtTriangle;
				break;

			case 's':
				if      ( _T("smileyFace")				== sValue ) m_eValue = shapetypeSmileyFace;
				else if ( _T("snip1Rect")				== sValue ) m_eValue = shapetypeSnip1Rect;
				else if ( _T("snip2DiagRect")			== sValue ) m_eValue = shapetypeSnip2DiagRect;
				else if ( _T("snip2SameRect")			== sValue ) m_eValue = shapetypeSnip2SameRect;
				else if ( _T("snipRoundRect")			== sValue ) m_eValue = shapetypeSnipRoundRect;
				else if ( _T("squareTabs")				== sValue ) m_eValue = shapetypeSquareTabs;
				else if ( _T("star10")					== sValue ) m_eValue = shapetypeStar10;
				else if ( _T("star12")					== sValue ) m_eValue = shapetypeStar12;
				else if ( _T("star16")					== sValue ) m_eValue = shapetypeStar16;
				else if ( _T("star24")					== sValue ) m_eValue = shapetypeStar24;
				else if ( _T("star32")					== sValue ) m_eValue = shapetypeStar32;
				else if ( _T("star4")					== sValue ) m_eValue = shapetypeStar4;
				else if ( _T("star5")					== sValue ) m_eValue = shapetypeStar5;
				else if ( _T("star6")					== sValue ) m_eValue = shapetypeStar6;
				else if ( _T("star7")					== sValue ) m_eValue = shapetypeStar7;
				else if ( _T("star8")					== sValue ) m_eValue = shapetypeStar8;
				else if ( _T("straightConnector1")		== sValue ) m_eValue = shapetypeStraightConnector1;
				else if ( _T("stripedRightArrow")		== sValue ) m_eValue = shapetypeStripedRightArrow;
				else if ( _T("sun")						== sValue ) m_eValue = shapetypeSun;
				else if ( _T("swooshArrow")				== sValue ) m_eValue = shapetypeSwooshArrow;
				break;

			case 't':
				if      ( _T("teardrop")				== sValue ) m_eValue = shapetypeTeardrop;
				else if ( _T("trapezoid")				== sValue ) m_eValue = shapetypeTrapezoid;
				else if ( _T("triangle")				== sValue ) m_eValue = shapetypeTriangle;
				break;

			case 'u':
				if      ( _T("upArrow")					== sValue ) m_eValue = shapetypeUpArrow;
				else if ( _T("upArrowCallout")			== sValue ) m_eValue = shapetypeUpArrowCallout;
				else if ( _T("upDownArrow")				== sValue ) m_eValue = shapetypeUpDownArrow;
				else if ( _T("upDownArrowCallout")		== sValue ) m_eValue = shapetypeUpDownArrowCallout;
				else if ( _T("uturnArrow")				== sValue ) m_eValue = shapetypeUturnArrow;
				break;

			case 'v':
				if      ( _T("verticalScroll")			== sValue ) m_eValue = shapetypeVerticalScroll;
				break;

			case 'w':
				if      ( _T("wave")					== sValue ) m_eValue = shapetypeWave;
				else if ( _T("wedgeEllipseCallout")		== sValue ) m_eValue = shapetypeWedgeEllipseCallout;
				else if ( _T("wedgeRectCallout")		== sValue ) m_eValue = shapetypeWedgeRectCallout;
				else if ( _T("wedgeRoundRectCallout")	== sValue ) m_eValue = shapetypeWedgeRoundRectCallout;
				break;
			}

			return m_eValue;
		}

		virtual CString    ToString  () const 
		{
			switch(m_eValue)
			{
			case shapetypeAccentBorderCallout1:			return _T("accentBorderCallout1");
			case shapetypeAccentBorderCallout2:			return _T("accentBorderCallout2");
			case shapetypeAccentBorderCallout3:			return _T("accentBorderCallout3");
			case shapetypeAccentCallout1:				return _T("accentCallout1");
			case shapetypeAccentCallout2:				return _T("accentCallout2");
			case shapetypeAccentCallout3:				return _T("accentCallout3");
			case shapetypeActionButtonBackPrevious:		return _T("accentCallout3");
			case shapetypeActionButtonBeginning:		return _T("actionButtonBeginning");
			case shapetypeActionButtonBlank:			return _T("actionButtonBlank");
			case shapetypeActionButtonDocument:			return _T("actionButtonDocument");
			case shapetypeActionButtonEnd:				return _T("actionButtonEnd");
			case shapetypeActionButtonForwardNext:		return _T("actionButtonForwardNext");
			case shapetypeActionButtonHelp:				return _T("actionButtonHelp");
			case shapetypeActionButtonHome:				return _T("actionButtonHome");
			case shapetypeActionButtonInformation:		return _T("actionButtonInformation");
			case shapetypeActionButtonMovie:			return _T("actionButtonMovie");
			case shapetypeActionButtonReturn:			return _T("actionButtonReturn");
			case shapetypeActionButtonSound:			return _T("actionButtonSound");
			case shapetypeArc:							return _T("arc");
			case shapetypeBentArrow:					return _T("bentArrow");
			case shapetypeBentConnector2:				return _T("bentConnector2");
			case shapetypeBentConnector3:				return _T("bentConnector3");
			case shapetypeBentConnector4:				return _T("bentConnector4");
			case shapetypeBentConnector5:				return _T("bentConnector5");
			case shapetypeBentUpArrow:					return _T("bentUpArrow");
			case shapetypeBevel:						return _T("bevel");
			case shapetypeBlockArc:						return _T("blockArc");
			case shapetypeBorderCallout1:				return _T("borderCallout1");
			case shapetypeBorderCallout2:				return _T("borderCallout2");
			case shapetypeBorderCallout3:				return _T("borderCallout3");
			case shapetypeBracePair:					return _T("bracePair");
			case shapetypeBracketPair:					return _T("bracketPair");
			case shapetypeCallout1:						return _T("callout1");
			case shapetypeCallout2:						return _T("callout2");
			case shapetypeCallout3:						return _T("callout3");
			case shapetypeCan:							return _T("can");
			case shapetypeChartPlus:					return _T("chartPlus");
			case shapetypeChartStar:					return _T("chartStar");
			case shapetypeChartX:						return _T("chartX");
			case shapetypeChevron:						return _T("chevron");
			case shapetypeChord:						return _T("chord");
			case shapetypeCircularArrow:				return _T("circularArrow");
			case shapetypeCloud:						return _T("cloud");
			case shapetypeCloudCallout:					return _T("cloudCallout");
			case shapetypeCorner:						return _T("corner");
			case shapetypeCornerTabs:					return _T("cornerTabs");
			case shapetypeCube:							return _T("cube");
			case shapetypeCurvedConnector2:				return _T("curvedConnector2");
			case shapetypeCurvedConnector3: 			return _T("curvedConnector3");
			case shapetypeCurvedConnector4: 			return _T("curvedConnector4");
			case shapetypeCurvedConnector5: 			return _T("curvedConnector5");
			case shapetypeCurvedDownArrow:				return _T("curvedDownArrow");
			case shapetypeCurvedLeftArrow:				return _T("curvedLeftArrow");
			case shapetypeCurvedRightArrow:				return _T("curvedRightArrow");
			case shapetypeCurvedUpArrow:				return _T("curvedUpArrow");
			case shapetypeDecagon:						return _T("decagon");
			case shapetypeDiagStripe:					return _T("diagStripe");
			case shapetypeDiamond:						return _T("diamond");
			case shapetypeDodecagon:					return _T("dodecagon");
			case shapetypeDonut:						return _T("donut");
			case shapetypeDoubleWave:					return _T("doubleWave");
			case shapetypeDownArrow:					return _T("downArrow");
			case shapetypeDownArrowCallout:				return _T("downArrowCallout");
			case shapetypeEllipse:						return _T("ellipse");
			case shapetypeEllipseRibbon:				return _T("ellipseRibbon");
			case shapetypeEllipseRibbon2:				return _T("ellipseRibbon2");
			case shapetypeFlowChartAlternateProcess:	return _T("flowChartAlternateProcess");
			case shapetypeFlowChartCollate:				return _T("flowChartCollate");
			case shapetypeFlowChartConnector:			return _T("flowChartConnector");
			case shapetypeFlowChartDecision:			return _T("flowChartDecision");
			case shapetypeFlowChartDelay:				return _T("flowChartDelay");
			case shapetypeFlowChartDisplay:				return _T("flowChartDisplay");
			case shapetypeFlowChartDocument:			return _T("flowChartDocument");
			case shapetypeFlowChartExtract:				return _T("flowChartExtract");
			case shapetypeFlowChartInputOutput:			return _T("flowChartInputOutput");
			case shapetypeFlowChartInternalStorage:		return _T("flowChartInternalStorage");
			case shapetypeFlowChartMagneticDisk:		return _T("flowChartMagneticDisk");
			case shapetypeFlowChartMagneticDrum:		return _T("flowChartMagneticDrum");
			case shapetypeFlowChartMagneticTape:		return _T("flowChartMagneticTape");
			case shapetypeFlowChartManualInput:			return _T("flowChartManualInput");
			case shapetypeFlowChartManualOperation:		return _T("flowChartManualOperation");
			case shapetypeFlowChartMerge:				return _T("flowChartMerge");
			case shapetypeFlowChartMultidocument:		return _T("flowChartMultidocument");
			case shapetypeFlowChartOfflineStorage:		return _T("flowChartOfflineStorage");
			case shapetypeFlowChartOffpageConnector:	return _T("flowChartOffpageConnector");
			case shapetypeFlowChartOnlineStorage:		return _T("flowChartOnlineStorage");
			case shapetypeFlowChartOr:					return _T("flowChartOr");
			case shapetypeFlowChartPredefinedProcess:	return _T("flowChartPredefinedProcess");
			case shapetypeFlowChartPreparation:			return _T("flowChartPreparation");
			case shapetypeFlowChartProcess:				return _T("flowChartProcess");
			case shapetypeFlowChartPunchedCard:			return _T("flowChartPunchedCard");
			case shapetypeFlowChartPunchedTape:			return _T("flowChartPunchedTape");
			case shapetypeFlowChartSort:				return _T("flowChartSort");
			case shapetypeFlowChartSummingJunction:		return _T("flowChartSummingJunction");
			case shapetypeFlowChartTerminator:			return _T("flowChartTerminator");
			case shapetypeFoldedCorner:					return _T("foldedCorner");
			case shapetypeFrame:						return _T("frame");
			case shapetypeFunnel:						return _T("funnel");
			case shapetypeGear6:						return _T("gear6");
			case shapetypeGear9:						return _T("gear9");
			case shapetypeHalfFrame:					return _T("halfFrame");
			case shapetypeHeart:						return _T("heart");
			case shapetypeHeptagon:						return _T("heptagon");
			case shapetypeHexagon:						return _T("hexagon");
			case shapetypeHomePlate:					return _T("homePlate");
			case shapetypeHorizontalScroll:				return _T("horizontalScroll");
			case shapetypeIrregularSeal1:				return _T("irregularSeal1");
			case shapetypeIrregularSeal2:				return _T("irregularSeal2");
			case shapetypeLeftArrow:					return _T("leftArrow");
			case shapetypeLeftArrowCallout:				return _T("leftArrowCallout");
			case shapetypeLeftBrace:					return _T("leftBrace");
			case shapetypeLeftBracket:					return _T("leftBracket");
			case shapetypeLeftCircularArrow:			return _T("leftCircularArrow");
			case shapetypeLeftRightArrow:				return _T("leftRightArrow");
			case shapetypeLeftRightArrowCallout:		return _T("leftRightArrowCallout");
			case shapetypeLeftRightCircularArrow:		return _T("leftRightCircularArrow");
			case shapetypeLeftRightRibbon:				return _T("leftRightRibbon");
			case shapetypeLeftRightUpArrow:				return _T("leftRightUpArrow");
			case shapetypeLeftUpArrow:					return _T("leftUpArrow");
			case shapetypeLightningBolt:				return _T("lightningBolt");
			case shapetypeLine:							return _T("line");
			case shapetypeLineInv:						return _T("lineInv");
			case shapetypeMathDivide:					return _T("mathDivide");
			case shapetypeMathEqual:					return _T("mathEqual");
			case shapetypeMathMinus:					return _T("mathMinus");
			case shapetypeMathMultiply:					return _T("mathMultiply");
			case shapetypeMathNotEqual:					return _T("mathNotEqual");
			case shapetypeMathPlus:						return _T("mathPlus");
			case shapetypeMoon:							return _T("moon");
			case shapetypeNonIsoscelesTrapezoid:		return _T("nonIsoscelesTrapezoid");
			case shapetypeNoSmoking:					return _T("noSmoking");
			case shapetypeNotchedRightArrow:			return _T("notchedRightArrow");
			case shapetypeOctagon:						return _T("octagon");
			case shapetypeParallelogram:				return _T("parallelogram");
			case shapetypePentagon:						return _T("pentagon");
			case shapetypePie:							return _T("pie");
			case shapetypePieWedge:						return _T("pieWedge");
			case shapetypePlaque:						return _T("plaque");
			case shapetypePlaqueTabs:					return _T("plaqueTabs");
			case shapetypePlus:							return _T("plus");
			case shapetypeQuadArrow:					return _T("quadArrow");
			case shapetypeQuadArrowCallout:				return _T("quadArrowCallout");
			case shapetypeRect:							return _T("rect");
			case shapetypeRibbon:						return _T("ribbon");
			case shapetypeRibbon2:						return _T("ribbon2");
			case shapetypeRightArrow:					return _T("rightArrow");
			case shapetypeRightArrowCallout:			return _T("rightArrowCallout");
			case shapetypeRightBrace:					return _T("rightBrace");
			case shapetypeRightBracket:					return _T("rightBracket");
			case shapetypeRound1Rect:					return _T("round1Rect");
			case shapetypeRound2DiagRect:				return _T("round2DiagRect");
			case shapetypeRound2SameRect:				return _T("round2SameRect");
			case shapetypeRoundRect:					return _T("roundRect");
			case shapetypeRtTriangle:					return _T("rtTriangle");
			case shapetypeSmileyFace:					return _T("smileyFace");
			case shapetypeSnip1Rect:					return _T("snip1Rect");
			case shapetypeSnip2DiagRect:				return _T("snip2DiagRect");
			case shapetypeSnip2SameRect:				return _T("snip2SameRect");
			case shapetypeSnipRoundRect:				return _T("snipRoundRect");
			case shapetypeSquareTabs:					return _T("squareTabs");
			case shapetypeStar10:						return _T("star10");
			case shapetypeStar12:						return _T("star12");
			case shapetypeStar16:						return _T("star16");
			case shapetypeStar24:						return _T("star24");
			case shapetypeStar32:						return _T("star32");
			case shapetypeStar4:						return _T("star4");
			case shapetypeStar5:						return _T("star5");
			case shapetypeStar6:						return _T("star6");
			case shapetypeStar7:						return _T("star7");
			case shapetypeStar8:						return _T("star8");
			case shapetypeStraightConnector1:			return _T("straightConnector1");
			case shapetypeStripedRightArrow:			return _T("stripedRightArrow");
			case shapetypeSun:							return _T("sun");
			case shapetypeSwooshArrow:					return _T("swooshArrow");
			case shapetypeTeardrop:						return _T("teardrop");
			case shapetypeTrapezoid:					return _T("trapezoid");
			case shapetypeTriangle:						return _T("triangle");
			case shapetypeUpArrow:						return _T("upArrow");
			case shapetypeUpArrowCallout:				return _T("upArrowCallout");
			case shapetypeUpDownArrow:					return _T("upDownArrow");
			case shapetypeUpDownArrowCallout:			return _T("upDownArrowCallout");
			case shapetypeUturnArrow:					return _T("uturnArrow");
			case shapetypeVerticalScroll:				return _T("verticalScroll");
			case shapetypeWave:							return _T("wave");
			case shapetypeWedgeEllipseCallout:			return _T("wedgeEllipseCallout");
			case shapetypeWedgeRectCallout:				return _T("wedgeRectCallout");
			case shapetypeWedgeRoundRectCallout:		return _T("wedgeRoundRectCallout");	
			default :									return _T("rect");
			}
		}

		SimpleType_FromString     (EShapeType)
		SimpleType_Operator_Equal (CShapeType)
	};


	
	
	

	#ifndef COLOR_HOTLIGHT
	#define COLOR_HOTLIGHT          26
	#endif

	#ifndef COLOR_GRADIENTACTIVECAPTION
	#define COLOR_GRADIENTACTIVECAPTION 27
	#endif

	#ifndef COLOR_GRADIENTINACTIVECAPTION
	#define COLOR_GRADIENTINACTIVECAPTION 28
	#endif

	#ifndef COLOR_MENUHILIGHT
	#define COLOR_MENUHILIGHT       29
	#endif

	#ifndef COLOR_MENUBAR
	#define COLOR_MENUBAR           30
	#endif

	enum ESystemColorVal
	{
		systemcolorval3dDkShadow = 0, 
		systemcolorval3dLight, 
		systemcolorvalActiveBorder, 
		systemcolorvalActiveCaption, 
		systemcolorvalAppWorkspace, 
		systemcolorvalBackground, 
		systemcolorvalBtnFace, 
		systemcolorvalBtnHighlight, 
		systemcolorvalBtnShadow, 
		systemcolorvalBtnText, 
		systemcolorvalCaptionText, 
		systemcolorvalGradientActiveCaption, 
		systemcolorvalGradientInactiveCaption, 
		systemcolorvalGrayText, 
		systemcolorvalHighlight, 
		systemcolorvalHighlightText, 
		systemcolorvalHotLight, 
		systemcolorvalInactiveBorder, 
		systemcolorvalInactiveCaption, 
		systemcolorvalInactiveCaptionText, 
		systemcolorvalInfoBk, 
		systemcolorvalInfoText, 
		systemcolorvalMenu, 
		systemcolorvalMenuBar, 
		systemcolorvalMenuHighlight, 
		systemcolorvalMenuText, 
		systemcolorvalScrollBar, 
		systemcolorvalWindow, 
		systemcolorvalWindowFrame, 
		systemcolorvalWindowText, 
	};

	template<ESystemColorVal eDefValue = systemcolorvalWindow>
	class CSystemColorVal : public CSimpleType<ESystemColorVal, eDefValue>
	{
	public:
		CSystemColorVal() {}

		virtual ESystemColorVal FromString(CString &sValue)
		{
			m_eValue = systemcolorvalWindow;
			SetRGBA( 0, 0, 0, 255 );

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case '3':
				if      ( _T("3dDkShadow")              == sValue ) { m_eValue = systemcolorval3dDkShadow; SetRGBASys( COLOR_3DDKSHADOW ); } 
				else if ( _T("3dLight")                 == sValue ) { m_eValue = systemcolorval3dLight; SetRGBASys( COLOR_3DLIGHT ); } 
				break;
			case 'a':
				if      ( _T("activeBorder")            == sValue ) { m_eValue = systemcolorvalActiveBorder; SetRGBASys( COLOR_ACTIVEBORDER ); } 
				else if ( _T("activeCaption")           == sValue ) { m_eValue = systemcolorvalActiveCaption; SetRGBASys( COLOR_ACTIVECAPTION ); } 
				else if ( _T("appWorkspace")            == sValue ) { m_eValue = systemcolorvalAppWorkspace; SetRGBASys( COLOR_APPWORKSPACE ); } 
				break;
			case 'b':
				if      ( _T("background")              == sValue ) { m_eValue = systemcolorvalBackground; SetRGBASys( COLOR_BACKGROUND ); } 
				else if ( _T("btnFace")                 == sValue ) { m_eValue = systemcolorvalBtnFace ; SetRGBASys( COLOR_BTNFACE ); } 
				else if ( _T("btnHighlight")            == sValue ) { m_eValue = systemcolorvalBtnHighlight ; SetRGBASys( COLOR_BTNHIGHLIGHT ); } 
				else if ( _T("btnShadow")               == sValue ) { m_eValue = systemcolorvalBtnShadow ; SetRGBASys( COLOR_BTNSHADOW ); } 
				else if ( _T("btnText")                 == sValue ) { m_eValue = systemcolorvalBtnText ; SetRGBASys( COLOR_BTNTEXT ); } 
				break;
			case 'c':
				if      ( _T("captionText")             == sValue ) { m_eValue = systemcolorvalCaptionText ; SetRGBASys( COLOR_CAPTIONTEXT ); } 
				break;
			case 'g':
				if      ( _T("gradientActiveCaption")   == sValue ) { m_eValue = systemcolorvalGradientActiveCaption ; SetRGBASys( COLOR_GRADIENTACTIVECAPTION ); } 
				else if ( _T("gradientInactiveCaption") == sValue ) { m_eValue = systemcolorvalGradientInactiveCaption ; SetRGBASys( COLOR_GRADIENTINACTIVECAPTION ); } 
				else if ( _T("grayText")                == sValue ) { m_eValue = systemcolorvalGrayText ; SetRGBASys( COLOR_GRAYTEXT ); } 
				break;
			case 'h':
				if      ( _T("highlight")               == sValue ) { m_eValue = systemcolorvalHighlight ; SetRGBASys( COLOR_HIGHLIGHT ); } 
				else if ( _T("highlightText")           == sValue ) { m_eValue = systemcolorvalHighlightText ; SetRGBASys( COLOR_HIGHLIGHTTEXT ); } 
				else if ( _T("hotLight")                == sValue ) { m_eValue = systemcolorvalHotLight ; SetRGBASys( COLOR_HOTLIGHT ); } 
				break;
			case 'i':
				if      ( _T("inactiveBorder")          == sValue ) { m_eValue = systemcolorvalInactiveBorder ; SetRGBASys( COLOR_INACTIVEBORDER ); } 
				else if ( _T("inactiveCaption")         == sValue ) { m_eValue = systemcolorvalInactiveCaption ; SetRGBASys( COLOR_INACTIVECAPTION ); } 
				else if ( _T("inactiveCaptionText")     == sValue ) { m_eValue = systemcolorvalInactiveCaptionText ; SetRGBASys( COLOR_INACTIVECAPTIONTEXT ); } 
				else if ( _T("infoBk")                  == sValue ) { m_eValue = systemcolorvalInfoBk ; SetRGBASys( COLOR_INFOBK ); } 
				else if ( _T("infoText")                == sValue ) { m_eValue = systemcolorvalInfoText ; SetRGBASys( COLOR_INFOTEXT ); } 
				break;
			case 'm':
				if      ( _T("menu")                    == sValue ) { m_eValue = systemcolorvalMenu ; SetRGBASys( COLOR_MENU ); } 
				else if ( _T("menuBar")                 == sValue ) { m_eValue = systemcolorvalMenuBar ; SetRGBASys( COLOR_MENUBAR ); } 
				else if ( _T("menuHighlight")           == sValue ) { m_eValue = systemcolorvalMenuHighlight ; SetRGBASys( COLOR_MENUHILIGHT ); } 
				else if ( _T("menuText")                == sValue ) { m_eValue = systemcolorvalMenuText ; SetRGBASys( COLOR_MENUTEXT ); } 
				break;
			case 's':
				if      ( _T("scrollBar")               == sValue ) { m_eValue = systemcolorvalScrollBar ; SetRGBASys( COLOR_SCROLLBAR ); } 
				break;
			case 'w':
				if      ( _T("window")                  == sValue ) { m_eValue = systemcolorvalWindow ; SetRGBASys( COLOR_WINDOW ); } 
				else if ( _T("windowFrame")             == sValue ) { m_eValue = systemcolorvalWindowFrame ; SetRGBASys( COLOR_WINDOWFRAME ); } 
				else if ( _T("windowText")              == sValue ) { m_eValue = systemcolorvalWindowText ; SetRGBASys( COLOR_WINDOWTEXT ); } 
				break;
			}

			return m_eValue;
		}

		virtual CString         ToString  () const 
		{
			switch(m_eValue)
			{
			case systemcolorval3dDkShadow:              return _T("3dDkShadow");
			case systemcolorval3dLight:                 return _T("3dLight");
			case systemcolorvalActiveBorder:            return _T("activeBorder");
			case systemcolorvalActiveCaption:           return _T("activeCaption");
			case systemcolorvalAppWorkspace:            return _T("appWorkspace");
			case systemcolorvalBackground:              return _T("background");
			case systemcolorvalBtnFace:                 return _T("btnFace");
			case systemcolorvalBtnHighlight:            return _T("btnHighlight");
			case systemcolorvalBtnShadow:               return _T("btnShadow");
			case systemcolorvalBtnText:                 return _T("btnText");
			case systemcolorvalCaptionText:             return _T("captionText");
			case systemcolorvalGradientActiveCaption:   return _T("gradientActiveCaption");
			case systemcolorvalGradientInactiveCaption: return _T("gradientInactiveCaption");
			case systemcolorvalGrayText:                return _T("grayText");
			case systemcolorvalHighlight:               return _T("highlight");
			case systemcolorvalHighlightText:           return _T("highlightText");
			case systemcolorvalHotLight:                return _T("hotLight");
			case systemcolorvalInactiveBorder:          return _T("inactiveBorder");
			case systemcolorvalInactiveCaption:         return _T("inactiveCaption");
			case systemcolorvalInactiveCaptionText:     return _T("inactiveCaptionText");
			case systemcolorvalInfoBk:                  return _T("infoBk");
			case systemcolorvalInfoText:                return _T("infoText");
			case systemcolorvalMenu:                    return _T("menu");
			case systemcolorvalMenuBar:                 return _T("menuBar");
			case systemcolorvalMenuHighlight:           return _T("menuHighlight");
			case systemcolorvalMenuText:                return _T("menuText");
			case systemcolorvalScrollBar:               return _T("scrollBar");
			case systemcolorvalWindow:                  return _T("window");
			case systemcolorvalWindowFrame:             return _T("windowFrame");
			case systemcolorvalWindowText:              return _T("windowText");
			default :                                   return _T("window");
			}
		}

		SimpleType_FromString     (ESystemColorVal)
		SimpleType_Operator_Equal (CSystemColorVal)
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


		void SetRGBASys(int nIndex)
		{
			DWORD dwRGB = ::GetSysColor(nIndex);

			m_unB = static_cast<unsigned char>(dwRGB & 0xFF);
			m_unG = static_cast<unsigned char>((dwRGB & 0xFF00)>>8);
			m_unR = static_cast<unsigned char>((dwRGB & 0xFF0000)>>16);
			m_unA = 255;
		}

		void SetRGBA(unsigned char unR, unsigned char unG, unsigned char unB, unsigned char unA = 255)
		{
			m_unR = unR;
			m_unG = unG;
			m_unB = unB;
			m_unA = unA;
		}

	private:

		unsigned char m_unR;
		unsigned char m_unG;
		unsigned char m_unB;
		unsigned char m_unA;
	};


	
	
	
	enum ETextAnchoringType
	{
		textanchoringtypeB    = 0,
		textanchoringtypeCtr  = 1,
		textanchoringtypeDist = 2,
		textanchoringtypeJust = 3,
		textanchoringtypeT    = 4,
	};

	template<ETextAnchoringType eDefValue = textanchoringtypeT>
	class CTextAnchoringType : public CSimpleType<ETextAnchoringType, eDefValue>
	{
	public:
		CTextAnchoringType() {}

		virtual ETextAnchoringType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'b':
				if      ( _T("b")    == sValue ) m_eValue = textanchoringtypeB;
				break;
			case 'c':
				if      ( _T("ctr")  == sValue ) m_eValue = textanchoringtypeCtr;
				break;
			case 'd':
				if      ( _T("dist") == sValue ) m_eValue = textanchoringtypeDist;
				break;
			case 'j':
				if      ( _T("just") == sValue ) m_eValue = textanchoringtypeJust;
				break;
			case 't':
				if      ( _T("t")    == sValue ) m_eValue = textanchoringtypeT;
				break;
			}

			return m_eValue;
		}

		virtual CString            ToString  () const 
		{
			switch(m_eValue)
			{
			case textanchoringtypeB   : return _T("b");			
			case textanchoringtypeCtr : return _T("ctr");		
			case textanchoringtypeDist: return _T("dist");		
			case textanchoringtypeJust: return _T("just");		
			case textanchoringtypeT   : return _T("t");		
			default                   : return _T("t");
			}
		}

		SimpleType_FromString     (ETextAnchoringType)
		SimpleType_Operator_Equal (CTextAnchoringType)
	};


	
    
	
    template<unsigned char unDefValue = 1>
    class CTextColumnCount : public CSimpleType<unsigned char, unDefValue>
    {
    public:
        CTextColumnCount() {}

		virtual void    SetValue  (unsigned char unValue)
		{
			m_eValue = min( 16, max( 1, unValue ) );
		}
        virtual unsigned char FromString(CString &sValue)
        {
            m_eValue = (unsigned char)_wtoi( sValue );

			if (m_eValue < 1)
                m_eValue = 1;
            if (m_eValue > 16)
                m_eValue = 16;

            return m_eValue;
        }

        virtual CString       ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%d"), m_eValue);

            return sResult;
        }

        SimpleType_FromString     (unsigned char)
        SimpleType_Operator_Equal (CTextColumnCount)
    };
	
    
	
    class CTextFontScalePercentOrPercentString 
    {
    public:
        CTextFontScalePercentOrPercentString() 
		{
			m_dValue = 0;
		}

		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_dValue = dValue;
		}

        virtual double FromString(CString &sValue)
        {
			int nPos = sValue.Find( '%' );
			int nLen = sValue.GetLength();
			if ( -1 == nPos || nPos != sValue.GetLength() - 1 || nLen <= 0  )
			{
				if ( -1 == nPos )
				{
					
					int nValue = min( 100000, max( 1000, _wtoi( sValue ) ) );
					m_dValue = nValue / 1000.0;
				}
				return
					m_dValue = 0;
			}
			else
				m_dValue = _wtof( sValue.Mid( 0, nLen - 1 ) );

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%f%%"), m_dValue );

            return sResult;
        }

        SimpleType_FromString2    (double)
        SimpleType_Operator_Equal (CTextFontScalePercentOrPercentString)

	private:

		double m_dValue;
    };
	
	
	
	enum ETextHorzOverflowType
	{
		texthorzoverflowtypeClip     = 0,
		texthorzoverflowtypeOverflow = 1,
	};

	template<ETextHorzOverflowType eDefValue = texthorzoverflowtypeOverflow>
	class CTextHorzOverflowType : public CSimpleType<ETextHorzOverflowType, eDefValue>
	{
	public:
		CTextHorzOverflowType() {}

		virtual ETextHorzOverflowType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("clip")     == sValue ) m_eValue = texthorzoverflowtypeClip;
				break;
			case 'o':
				if      ( _T("overflow") == sValue ) m_eValue = texthorzoverflowtypeOverflow;
				break;
			}

			return m_eValue;
		}

		virtual CString               ToString  () const 
		{
			switch(m_eValue)
			{
			case texthorzoverflowtypeClip     : return _T("clip");			
			case texthorzoverflowtypeOverflow : return _T("overflow");		
			default                           : return _T("overflow");
			}
		}

		SimpleType_FromString     (ETextHorzOverflowType)
		SimpleType_Operator_Equal (CTextHorzOverflowType)
	};


	
	
	
	enum ETextShapeType
	{
		textshapetypeTextArchDown = 0,
		textshapetypeTextArchDownPour,
		textshapetypeTextArchUp,
		textshapetypeTextArchUpPour,
		textshapetypeTextButton,
		textshapetypeTextButtonPour,
		textshapetypeTextCanDown,
		textshapetypeTextCanUp,
		textshapetypeTextCascadeDown,
		textshapetypeTextCascadeUp,
		textshapetypeTextChevron,
		textshapetypeTextChevronInverted,
		textshapetypeTextCircle,
		textshapetypeTextCirclePour,
		textshapetypeTextCurveDown,
		textshapetypeTextCurveUp,
		textshapetypeTextDeflate,
		textshapetypeTextDeflateBottom,
		textshapetypeTextDeflateInflate,
		textshapetypeTextDeflateInflateDeflate,
		textshapetypeTextDeflateTop,
		textshapetypeTextDoubleWave1,
		textshapetypeTextFadeDown,
		textshapetypeTextFadeLeft,
		textshapetypeTextFadeRight,
		textshapetypeTextFadeUp,
		textshapetypeTextInflate,
		textshapetypeTextInflateBottom,
		textshapetypeTextInflateTop,
		textshapetypeTextNoShape,
		textshapetypeTextPlain,
		textshapetypeTextRingInside,
		textshapetypeTextRingOutside,
		textshapetypeTextSlantDown,
		textshapetypeTextSlantUp,
		textshapetypeTextStop,
		textshapetypeTextTriangle,
		textshapetypeTextTriangleInverted,
		textshapetypeTextWave1,
		textshapetypeTextWave2,
		textshapetypeTextWave4,
	};

	template<ETextShapeType eDefValue = textshapetypeTextPlain>
	class CTextShapeType : public CSimpleType<ETextShapeType, eDefValue>
	{
	public:
		CTextShapeType() {}

		virtual ETextShapeType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 5 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(4);
			switch ( wChar )
			{
			case 'a':

				if      ( _T("textArchDown")		== sValue ) m_eValue = textshapetypeTextArchDown;
				else if ( _T("textArchDownPour")	== sValue ) m_eValue = textshapetypeTextArchDownPour;
				else if ( _T("textArchUp")			== sValue ) m_eValue = textshapetypeTextArchUp;
				else if ( _T("textArchUpPour")		== sValue ) m_eValue = textshapetypeTextArchUpPour;
				break;

			case 'b':

				if      ( _T("textButton")			== sValue ) m_eValue = textshapetypeTextButton;
				else if ( _T("textButtonPour")		== sValue ) m_eValue = textshapetypeTextButtonPour;
				break;

			case 'c':

				if      ( _T("textCanDown")			== sValue ) m_eValue = textshapetypeTextCanDown;
				else if ( _T("textCanUp")			== sValue ) m_eValue = textshapetypeTextCanUp;
				else if ( _T("textCascadeDown")		== sValue ) m_eValue = textshapetypeTextCascadeDown;
				else if ( _T("textCascadeUp")		== sValue ) m_eValue = textshapetypeTextCascadeUp;
				else if ( _T("textChevron")			== sValue ) m_eValue = textshapetypeTextChevron;
				else if ( _T("textChevronInverted")	== sValue ) m_eValue = textshapetypeTextChevronInverted;
				else if ( _T("textCircle")			== sValue ) m_eValue = textshapetypeTextCircle;
				else if ( _T("textCirclePour")		== sValue ) m_eValue = textshapetypeTextCirclePour;
				else if ( _T("textCurveDown")		== sValue ) m_eValue = textshapetypeTextCurveDown;
				else if ( _T("textCurveUp")			== sValue ) m_eValue = textshapetypeTextCurveUp;
				break;

			case 'd':
				if      ( _T("textDeflate")			== sValue ) m_eValue = textshapetypeTextDeflate;
				else if ( _T("textDeflateBottom")	== sValue ) m_eValue = textshapetypeTextDeflateBottom;
				else if ( _T("textDeflateInflate")	== sValue ) m_eValue = textshapetypeTextDeflateInflate;
				else if ( _T("textDeflateInflateDeflate") == sValue ) m_eValue = textshapetypeTextDeflateInflateDeflate;
				else if ( _T("textDeflateTop")		== sValue ) m_eValue = textshapetypeTextDeflateTop;
				else if ( _T("textDoubleWave1")		== sValue ) m_eValue = textshapetypeTextDoubleWave1;
				break;

			case 'f':
				if      ( _T("textFadeDown")		== sValue ) m_eValue = textshapetypeTextFadeDown;
				else if ( _T("textFadeLeft")		== sValue ) m_eValue = textshapetypeTextFadeLeft;
				else if ( _T("textFadeRight")		== sValue ) m_eValue = textshapetypeTextFadeRight;
				else if ( _T("textFadeUp")			== sValue ) m_eValue = textshapetypeTextFadeUp;
				break;

			case 'i':

				if      ( _T("textInflate")			== sValue ) m_eValue = textshapetypeTextInflate;
				else if ( _T("textInflateBottom")	== sValue ) m_eValue = textshapetypeTextInflateBottom;
				else if ( _T("textInflateTop")		== sValue ) m_eValue = textshapetypeTextInflateTop;
				break;

			case 'n':
				if      ( _T("textNoShape")			== sValue ) m_eValue = textshapetypeTextNoShape;
				break;

			case 'p':

				if      ( _T("textPlain")			== sValue ) m_eValue = textshapetypeTextPlain;
				break;

			case 'r':

				if		( _T("textRingInside")		== sValue ) m_eValue = textshapetypeTextRingInside;
				else if ( _T("textRingOutside")		== sValue ) m_eValue = textshapetypeTextRingOutside;
				break;

			case 's':

				if      ( _T("textSlantDown")		== sValue ) m_eValue = textshapetypeTextSlantDown;
				else if ( _T("textSlantUp")			== sValue ) m_eValue = textshapetypeTextSlantUp;
				else if ( _T("textStop")			== sValue ) m_eValue = textshapetypeTextStop;
				break;

			case 't':
				
				if      ( _T("textTriangle")		== sValue ) m_eValue = textshapetypeTextTriangle;
				else if ( _T("textTriangleInverted")== sValue ) m_eValue = textshapetypeTextTriangleInverted;
				break;

			case 'w':
				
				if      ( _T("textWave1")			== sValue ) m_eValue = textshapetypeTextWave1;
				else if ( _T("textWave2")			== sValue ) m_eValue = textshapetypeTextWave2;
				else if ( _T("textWave4")			== sValue ) m_eValue = textshapetypeTextWave4;
				break;
			}

			return m_eValue;
		}

		virtual CString        ToString  () const 
		{
			switch(m_eValue)
			{
			case textshapetypeTextArchDown:				return _T("textArchDown");
			case textshapetypeTextArchDownPour:			return _T("textArchDownPour");
			case textshapetypeTextArchUp:				return _T("textArchUp");
			case textshapetypeTextArchUpPour:			return _T("textArchUpPour");
			case textshapetypeTextButton:				return _T("textButton");
			case textshapetypeTextButtonPour:			return _T("textButtonPour");
			case textshapetypeTextCanDown:				return _T("textCanDown");
			case textshapetypeTextCanUp:				return _T("textCanUp");
			case textshapetypeTextCascadeDown:			return _T("textCascadeDown");
			case textshapetypeTextCascadeUp:			return _T("textCascadeUp");
			case textshapetypeTextChevron:				return _T("textChevron");
			case textshapetypeTextChevronInverted:		return _T("textChevronInverted");
			case textshapetypeTextCircle:				return _T("textCircle");
			case textshapetypeTextCirclePour:			return _T("textCirclePour");
			case textshapetypeTextCurveDown:			return _T("textCurveDown");
			case textshapetypeTextCurveUp:				return _T("textCurveUp");
			case textshapetypeTextDeflate:				return _T("textDeflate");
			case textshapetypeTextDeflateBottom:		return _T("textDeflateBottom");
			case textshapetypeTextDeflateInflate:		return _T("textDeflateInflate");
			case textshapetypeTextDeflateInflateDeflate:return _T("textDeflateInflateDeflate");
			case textshapetypeTextDeflateTop:			return _T("textDeflateTop");
			case textshapetypeTextDoubleWave1:			return _T("textDoubleWave1");
			case textshapetypeTextFadeDown:				return _T("textFadeDown");
			case textshapetypeTextFadeLeft:				return _T("textFadeLeft");
			case textshapetypeTextFadeRight:			return _T("textFadeRight");
			case textshapetypeTextFadeUp:				return _T("textFadeUp");
			case textshapetypeTextInflate:				return _T("textInflate");
			case textshapetypeTextInflateBottom:		return _T("textInflateBottom");
			case textshapetypeTextInflateTop:			return _T("textInflateTop");
			case textshapetypeTextNoShape:				return _T("textNoShape");
			case textshapetypeTextPlain:				return _T("textPlain");
			case textshapetypeTextRingInside:			return _T("textRingInside");
			case textshapetypeTextRingOutside:			return _T("textRingOutside");
			case textshapetypeTextSlantDown:			return _T("textSlantDown");
			case textshapetypeTextSlantUp:				return _T("textSlantUp");
			case textshapetypeTextStop:					return _T("textStop");
			case textshapetypeTextTriangle:				return _T("textTriangle");
			case textshapetypeTextTriangleInverted:		return _T("textTriangleInverted");
			case textshapetypeTextWave1:				return _T("textWave1");
			case textshapetypeTextWave2:				return _T("textWave2");
			case textshapetypeTextWave4:				return _T("textWave4");
			default :									return _T("textPlain");
			}
		}

		SimpleType_FromString     (ETextShapeType)
		SimpleType_Operator_Equal (CTextShapeType)
	};


	
    
	
    class CTextSpacingPercentOrPercentString
    {
    public:
        CTextSpacingPercentOrPercentString() 
		{
			m_dValue = 0;
		}

		double GetValue() const
		{
			return m_dValue;
		}

		void   SetValue(double dValue)
		{
			m_dValue = dValue;
		}

        virtual double FromString(CString &sValue)
        {
			int nPos = sValue.Find( '%' );
			int nLen = sValue.GetLength();
			if ( -1 == nPos || nPos != sValue.GetLength() - 1 || nLen <= 0  )
			{
				if ( -1 == nPos )
				{
					
					int nValue = min( 13200000, max( 0, _wtoi( sValue ) ) );
					m_dValue = nValue / 1000.0;
				}
				return
					m_dValue = 0;
			}
			else
				m_dValue = _wtof( sValue.Mid( 0, nLen - 1 ) );

            return m_dValue;
        }

        virtual CString ToString  () const 
        {
            CString sResult;
            sResult.Format( _T("%f%%"), m_dValue );

            return sResult;
        }

        SimpleType_FromString2    (double)
        SimpleType_Operator_Equal (CTextSpacingPercentOrPercentString)

	private:

		double m_dValue;
    };
	
	
	
	class CTextTypeface
	{
	public:
		CTextTypeface() {}

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
		SimpleType_Operator_Equal (CTextTypeface)

	private:

		CString m_sValue;
	};

	
	
	
	enum ETextVerticalType
	{
		textverticaltypeEaVert         = 0,
		textverticaltypeHorz           = 1,
		textverticaltypeMongolianVert  = 2,
		textverticaltypeVert           = 3,
		textverticaltypeVert270        = 4,
		textverticaltypeWordArtVert    = 5,
		textverticaltypeWordArtVertRtl = 6,
	};

	template<ETextVerticalType eDefValue = textverticaltypeHorz>
	class CTextVerticalType : public CSimpleType<ETextVerticalType, eDefValue>
	{
	public:
		CTextVerticalType() {}

		virtual ETextVerticalType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'e':
				if      ( _T("eaVert")         == sValue ) m_eValue = textverticaltypeEaVert;
				break;
			case 'h':
				if      ( _T("horz")           == sValue ) m_eValue = textverticaltypeHorz;
				break;
			case 'm':
				if      ( _T("mongolianVert")  == sValue ) m_eValue = textverticaltypeMongolianVert;
				break;
			case 'v':
				if      ( _T("vert")           == sValue ) m_eValue = textverticaltypeVert;
				else if ( _T("vert270")        == sValue ) m_eValue = textverticaltypeVert270;
				break;
			case 'w':
				if      ( _T("wordArtVert")    == sValue ) m_eValue = textverticaltypeWordArtVert;
				else if ( _T("wordArtVertRtl") == sValue ) m_eValue = textverticaltypeWordArtVertRtl;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case textverticaltypeEaVert         : return _T("eaVert");			
			case textverticaltypeHorz           : return _T("horz");		
			case textverticaltypeMongolianVert  : return _T("mongolianVert");			
			case textverticaltypeVert           : return _T("vert");		
			case textverticaltypeVert270        : return _T("vert270");			
			case textverticaltypeWordArtVert    : return _T("wordArtVert");		
			case textverticaltypeWordArtVertRtl : return _T("wordArtVertRtl");		
			default                             : return _T("horz");
			}
		}

		SimpleType_FromString     (ETextVerticalType)
		SimpleType_Operator_Equal (CTextVerticalType)
	};


	
	
	
	enum ETextVertOverflowType
	{
		textvertoverflowtypeClip     = 0,
		textvertoverflowtypeEllipsis = 1,
		textvertoverflowtypeOverflow = 2,
	};

	template<ETextVertOverflowType eDefValue = textvertoverflowtypeOverflow>
	class CTextVertOverflowType : public CSimpleType<ETextVertOverflowType, eDefValue>
	{
	public:
		CTextVertOverflowType() {}

		virtual ETextVertOverflowType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'c':
				if      ( _T("clip")     == sValue ) m_eValue = textvertoverflowtypeClip;
				break;
			case 'e':
				if      ( _T("ellipsis") == sValue ) m_eValue = textvertoverflowtypeEllipsis;
				break;
			case 'o':
				if      ( _T("overflow") == sValue ) m_eValue = textvertoverflowtypeOverflow;
				break;
			}

			return m_eValue;
		}

		virtual CString              ToString  () const 
		{
			switch(m_eValue)
			{
			case textvertoverflowtypeClip     : return _T("clip");			
			case textvertoverflowtypeEllipsis : return _T("ellipsis");		
			case textvertoverflowtypeOverflow : return _T("overflow");			
			default                           : return _T("overflow");
			}
		}

		SimpleType_FromString     (ETextVertOverflowType)
		SimpleType_Operator_Equal (CTextVertOverflowType)
	};


	
	
	
	enum ETextWrappingType
	{
		textwrappingtypeNone   = 0,
		textwrappingtypeSquare = 1,
	};

	template<ETextWrappingType eDefValue = textwrappingtypeNone>
	class CTextWrappingType : public CSimpleType<ETextWrappingType, eDefValue>
	{
	public:
		CTextWrappingType() {}

		virtual ETextWrappingType FromString(CString &sValue)
		{
			m_eValue = eDefValue;

			if ( sValue.GetLength() <= 0 )
				return m_eValue;

			wchar_t wChar = sValue.GetAt(0);
			switch ( wChar )
			{
			case 'n':
				if      ( _T("none")   == sValue ) m_eValue = textwrappingtypeNone;
				break;
			case 's':
				if      ( _T("square") == sValue ) m_eValue = textwrappingtypeSquare;
				break;
			}

			return m_eValue;
		}

		virtual CString           ToString  () const 
		{
			switch(m_eValue)
			{
			case textwrappingtypeNone   : return _T("none");			
			case textwrappingtypeSquare : return _T("square");		
			default                     : return _T("none");
			}
		}

		SimpleType_FromString     (ETextWrappingType)
		SimpleType_Operator_Equal (CTextWrappingType)
	};


	
	
	
	enum ETileFlipMode
	{
		tileflipmodeNone = 0,
		tileflipmodeX    = 1,
		tileflipmodeXY   = 2,
		tileflipmodeY    = 3,
	};

	template<ETileFlipMode eDefValue = tileflipmodeNone>
	class CTileFlipMode : public CSimpleType<ETileFlipMode, eDefValue>
	{
	public:
		CTileFlipMode() {}

		virtual ETileFlipMode FromString(CString &sValue)
		{
			if      ( _T("none") == sValue ) m_eValue = tileflipmodeNone;     
			else if ( _T("x")    == sValue ) m_eValue = tileflipmodeX;     
			else if ( _T("xy")   == sValue ) m_eValue = tileflipmodeXY;     
			else if ( _T("y")    == sValue ) m_eValue = tileflipmodeY;        
			else                             m_eValue = eDefValue;     

			return m_eValue;
		}

		virtual CString       ToString  () const 
		{
			switch(m_eValue)
			{
			case tileflipmodeNone: return _T("none");
			case tileflipmodeX   : return _T("x");
			case tileflipmodeXY  : return _T("xy");
			case tileflipmodeY   : return _T("y");
			default              : return _T("none");
			}
		}

		SimpleType_FromString     (ETileFlipMode)
		SimpleType_Operator_Equal (CTileFlipMode)
	};


} 


namespace SimpleTypes
{
	
	
	

	enum EAlignH
	{
		alignhCenter  = 0,
		alignhInside  = 1,
		alignhLeft    = 2,
		alignhOutside = 3,
		alignhRight   = 4
	};

	template<EAlignH eDefValue = alignhLeft>
	class CAlignH : public CSimpleType<EAlignH, eDefValue>
	{
	public:

		CAlignH() {} 

		virtual EAlignH FromString(CString &sValue)
		{
			if       ( _T("center")  == sValue ) m_eValue = alignhCenter;
			else if  ( _T("inside")  == sValue ) m_eValue = alignhInside;
			else if  ( _T("left")    == sValue ) m_eValue = alignhLeft;
			else if  ( _T("outside") == sValue ) m_eValue = alignhOutside;
			else if  ( _T("right")   == sValue ) m_eValue = alignhRight;
			else                                 m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case alignhCenter  : return _T("center");
			case alignhInside  : return _T("inside");
			case alignhLeft    : return _T("left");
			case alignhOutside : return _T("outside");
			case alignhRight   : return _T("right");
			default            : return _T("left");
			}
		}

		SimpleType_FromString     (EAlignH)
		SimpleType_Operator_Equal (CAlignH)
	};



	
	
	

	enum EAlignV
	{
		alignvBottom  = 0,
		alignvCenter  = 1,
		alignvInside  = 2,
		alignvOutside = 3,
		alignvTop     = 4
	};

	template<EAlignV eDefValue = alignvTop>
	class CAlignV : public CSimpleType<EAlignV, eDefValue>
	{
	public:

		CAlignV() {} 

		virtual EAlignV FromString(CString &sValue)
		{
			if       ( _T("bottom")  == sValue ) m_eValue = alignvBottom;
			else if  ( _T("center")  == sValue ) m_eValue = alignvCenter;
			else if  ( _T("inside")  == sValue ) m_eValue = alignvInside;
			else if  ( _T("outside") == sValue ) m_eValue = alignvOutside;
			else if  ( _T("top")     == sValue ) m_eValue = alignvTop;
			else                                 m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case alignvBottom  : return _T("bottom");
			case alignvCenter  : return _T("center");
			case alignvInside  : return _T("inside");
			case alignvOutside : return _T("outside");
			case alignvTop     : return _T("top");
			default            : return _T("top");
			}
		}

		SimpleType_FromString     (EAlignV)
		SimpleType_Operator_Equal (CAlignV)
	};



	
	
	

	template<__int64 nDefValue = 0>
	class CPositionOffset : public CSimpleType<__int64, nDefValue>
	{
	public:
		CPositionOffset() {}

		virtual __int64 FromString(CString &sValue)
		{
			m_eValue = _wtoi64( sValue );

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue);

			return sResult;
		}


		SimpleType_FromString     (__int64)
		SimpleType_Operator_Equal (CPositionOffset)

		double ToPoints()
		{
			return Emu_To_Pt( m_eValue );
		}
		double ToMM() const
		{
			return Emu_To_Mm( m_eValue );
		}
		double ToInches()
		{
			return Emu_To_Inch( m_eValue );
		}
	};

	
	
	

	enum ERelFromH
	{
		relfromhCharacter     = 0,
		relfromhColumn        = 1,
		relfromhInsideMargin  = 2,
		relfromhLeftMargin    = 3,
		relfromhMargin        = 4,
		relfromhOutsideMargin = 5,
		relfromhPage          = 6,
		relfromhRightMargin   = 7
	};

	template<ERelFromH eDefValue = relfromhPage>
	class CRelFromH : public CSimpleType<ERelFromH, eDefValue>
	{
	public:

		CRelFromH() {} 

		virtual ERelFromH FromString(CString &sValue)
		{
			if       ( _T("character")     == sValue ) m_eValue = relfromhCharacter;
			else if  ( _T("column")        == sValue ) m_eValue = relfromhColumn;
			else if  ( _T("insideMargin")  == sValue ) m_eValue = relfromhInsideMargin;
			else if  ( _T("leftMargin")    == sValue ) m_eValue = relfromhLeftMargin;
			else if  ( _T("margin")        == sValue ) m_eValue = relfromhMargin;
			else if  ( _T("outsideMargin") == sValue ) m_eValue = relfromhOutsideMargin;
			else if  ( _T("page")          == sValue ) m_eValue = relfromhPage;
			else if  ( _T("rightMargin")   == sValue ) m_eValue = relfromhRightMargin;
			else                                       m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString   ToString() const 
		{
			switch(m_eValue)
			{
			case relfromhCharacter     : return _T("character");
			case relfromhColumn        : return _T("column");
			case relfromhInsideMargin  : return _T("insideMargin");
			case relfromhLeftMargin    : return _T("leftMargin");
			case relfromhMargin        : return _T("margin");
			case relfromhOutsideMargin : return _T("outsideMargin");
			case relfromhPage          : return _T("page");
			case relfromhRightMargin   : return _T("rightMargin");
			default                    : return _T("page");
			}
		}

		SimpleType_FromString     (ERelFromH)
		SimpleType_Operator_Equal (CRelFromH)
	};




	
	
	

	enum ERelFromV
	{
		relfromvBottomMargin  = 0,
		relfromvInsideMargin  = 1,
		relfromvLine          = 2,
		relfromvMargin        = 3,
		relfromvOutsideMargin = 4,
		relfromvPage          = 5,
		relfromvParagraph     = 6,
		relfromvTopMargin     = 7
	};

	template<ERelFromV eDefValue = relfromvPage>
	class CRelFromV : public CSimpleType<ERelFromV, eDefValue>
	{
	public:

		CRelFromV() {} 

		virtual ERelFromV FromString(CString &sValue)
		{
			if       ( _T("bottomMargin")  == sValue ) m_eValue = relfromvBottomMargin;
			else if  ( _T("insideMargin")  == sValue ) m_eValue = relfromvInsideMargin;
			else if  ( _T("line")          == sValue ) m_eValue = relfromvLine;
			else if  ( _T("margin")        == sValue ) m_eValue = relfromvMargin;
			else if  ( _T("outsideMargin") == sValue ) m_eValue = relfromvOutsideMargin;
			else if  ( _T("page")          == sValue ) m_eValue = relfromvPage;
			else if  ( _T("paragraph")     == sValue ) m_eValue = relfromvParagraph;
			else if  ( _T("topMargin")     == sValue ) m_eValue = relfromvTopMargin;
			else                                       m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString   ToString() const 
		{
			switch(m_eValue)
			{
			case relfromvBottomMargin  : return _T("bottomMargin");
			case relfromvInsideMargin  : return _T("insideMargin");
			case relfromvLine          : return _T("line");
			case relfromvMargin        : return _T("margin");
			case relfromvOutsideMargin : return _T("outsideMargin");
			case relfromvPage          : return _T("page");
			case relfromvParagraph     : return _T("paragraph");
			case relfromvTopMargin     : return _T("topMargin");
			default                    : return _T("page");
			}
		}

		SimpleType_FromString     (ERelFromV)
		SimpleType_Operator_Equal (CRelFromV)
	};




	
	
	

	template<__int64 nDefValue = 0>
	class CWrapDistance : public CSimpleType<__int64, nDefValue>
	{
	public:
		CWrapDistance() {}

		virtual __int64 FromString(CString &sValue)
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


		SimpleType_FromString     (__int64)
		SimpleType_Operator_Equal (CWrapDistance)

		double ToPoints()
		{
			return Emu_To_Pt( m_eValue );
		}
		double ToMM() const 
		{
			return Emu_To_Mm( m_eValue );
		}

		double ToInches()
		{
			return Emu_To_Inch( m_eValue );
		}
	};


	
	
	

	enum EWrapText
	{
		wraptextBothSides = 0,
		wraptextLargest   = 1,
		wraptextLeft      = 2,
		wraptextRight     = 3
	};

	template<EWrapText eDefValue = wraptextLeft>
	class CWrapText : public CSimpleType<EWrapText, eDefValue>
	{
	public:

		CWrapText() {} 

		virtual EWrapText FromString(CString &sValue)
		{
			if       ( _T("bothSides") == sValue ) m_eValue = wraptextBothSides;
			else if  ( _T("largest")   == sValue ) m_eValue = wraptextLargest;
			else if  ( _T("left")      == sValue ) m_eValue = wraptextLeft;
			else if  ( _T("right")     == sValue ) m_eValue = wraptextRight;
			else                                   m_eValue = eDefValue;

			return m_eValue;
		}

		virtual CString   ToString() const 
		{
			switch(m_eValue)
			{
			case wraptextBothSides : return _T("bothSides");
			case wraptextLargest   : return _T("largest");
			case wraptextLeft      : return _T("left");
			case wraptextRight     : return _T("right");
			default                : return _T("left");
			}
		}

		SimpleType_FromString     (EWrapText)
		SimpleType_Operator_Equal (CWrapText)
	};


} 


namespace SimpleTypes
{

} 


namespace SimpleTypes
{

} 


namespace SimpleTypes
{

} 

