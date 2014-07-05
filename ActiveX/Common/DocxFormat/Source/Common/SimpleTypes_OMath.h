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
	
	
	

	enum EBreakBin
	{
		breakBinAfter  = 0,
		breakBinBefore = 1,
		breakBinRepeat = 2
	};

	template<EBreakBin eDefValue = breakBinRepeat>
	class CBreakBin : public CSimpleType<EBreakBin, eDefValue>
	{
	public:

		CBreakBin() {} 

		virtual EBreakBin FromString(CString &sValue)
		{
			if       ( _T("after")  == sValue ) m_eValue = breakBinAfter;
			else if  ( _T("before") == sValue ) m_eValue = breakBinBefore;
			else								m_eValue = breakBinRepeat;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case breakBinAfter   : return _T("after");
			case breakBinBefore  : return _T("before");
			case breakBinRepeat  : return _T("repeat");
			default              : return _T("repeat");
			}
		}

		SimpleType_FromString     (EBreakBin)
		SimpleType_Operator_Equal (CBreakBin)
	};	

	
	
	

	enum EBreakBinSub
	{
		breakBinPlusMinus  = 0,
		breakBinMinusPlus  = 1,
		breakBinMinusMinus = 2
	};

	template<EBreakBinSub eDefValue = breakBinMinusMinus>
	class CBreakBinSub : public CSimpleType<EBreakBinSub, eDefValue>
	{
	public:

		CBreakBinSub() {} 

		virtual EBreakBinSub FromString(CString &sValue)
		{
			if       ( _T("+-")  == sValue )	m_eValue = breakBinPlusMinus;
			else if  ( _T("-+")  == sValue )	m_eValue = breakBinMinusPlus;
			else								m_eValue = breakBinMinusMinus;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case breakBinPlusMinus  : return _T("+-");
			case breakBinMinusPlus  : return _T("-+");
			case breakBinMinusMinus : return _T("--");
			default					: return _T("--");
			}
		}

		SimpleType_FromString     (EBreakBinSub)
		SimpleType_Operator_Equal (CBreakBinSub)
	};	

	
	
	

    class CMChar
    {
    public:
        CMChar() {}

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

        SimpleType_FromString     (CString)
        SimpleType_Operator_Equal (CMChar)

	private:

		CString m_sValue;
    };

	
	
	

	enum EFType
	{
		fTypeBar	= 0,
		fTypeLin	= 1,
		fTypeNoBar	= 2,
		fTypeSkw	= 3
	};

	template<EFType eDefValue = fTypeBar>
	class CFType : public CSimpleType<EFType, eDefValue>
	{
	public:

		CFType() {} 

		virtual EFType FromString(CString &sValue)
		{
			if       ( _T("bar")	== sValue )	m_eValue = fTypeBar;
			else if  ( _T("lin")	== sValue )	m_eValue = fTypeLin;
			else if  ( _T("noBar")  == sValue )	m_eValue = fTypeNoBar;
			else								m_eValue = fTypeSkw;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case fTypeBar	: return _T("bar");
			case fTypeLin	: return _T("lin");
			case fTypeNoBar : return _T("noBar");
			case fTypeSkw	: return _T("skw");
			default			: return _T("bar");
			}
		}

		SimpleType_FromString     (EFType)
		SimpleType_Operator_Equal (CFType)
	};	

	
	
	

	template<int nDefValue = 0>
	class CInteger2 : public CSimpleType<int, nDefValue>
	{
	public:
		CInteger2() {}

		virtual int FromString(CString &sValue)
		{
			m_eValue = _wtoi( sValue );

			if (m_eValue < -2)
                m_eValue = -2;
            if (m_eValue > 2)
                m_eValue = 2;

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue);

			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CInteger2)

	};
	 
	
	
	

	template<int nDefValue = 1>
	class CInteger255 : public CSimpleType<int, nDefValue>
	{
	public:
		CInteger255() {}

		virtual int FromString(CString &sValue)
		{
			m_eValue = _wtoi( sValue );

			if (m_eValue < 1)
                m_eValue = 1;
            if (m_eValue > 255)
                m_eValue = 255;

			return m_eValue;
		}

		virtual CString ToString  () const 
		{
			CString sResult;
			sResult.Format( _T("%d"), m_eValue);

			return sResult;
		}

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CInteger255)

	};

	
	
	

	enum EMJc
	{
		mjcCenter  = 0,
		mjcCenterGroup = 1,
		mjcLeft = 2,
		mjcRight = 3
	};

	template<EMJc eDefValue = mjcCenterGroup>
	class CMJc : public CSimpleType<EMJc, eDefValue>
	{
	public:

		CMJc() {} 

		virtual EMJc FromString(CString &sValue)
		{
			if       ( _T("center")		 == sValue ) m_eValue = mjcCenter;
			else if  ( _T("centerGroup") == sValue ) m_eValue = mjcCenterGroup;
			else if  ( _T("left")		 == sValue ) m_eValue = mjcLeft;
			else									 m_eValue = mjcRight;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case mjcCenter		: return _T("center");
			case mjcCenterGroup : return _T("centerGroup");
			case mjcLeft		: return _T("left");
			case mjcRight		: return _T("right");
			default             : return _T("centerGroup");
			}
		}

		SimpleType_FromString     (EMJc)
		SimpleType_Operator_Equal (CMJc)
	};
	
	
	
	

	enum ELimLoc
	{
		limLocSubSup  = 0,
		limLocUndOvr  = 1
	};

	template<ELimLoc eDefValue = limLocSubSup>
	class CLimLoc : public CSimpleType<ELimLoc, eDefValue>
	{
	public:

		CLimLoc() {} 

		virtual ELimLoc FromString(CString &sValue)
		{
			if       ( _T("subSup")		 == sValue ) m_eValue = limLocSubSup;
			else									 m_eValue = limLocUndOvr;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case limLocSubSup		: return _T("subSup");
			case limLocUndOvr		: return _T("undOvr");
			default					: return _T("subSup");
			}
		}

		SimpleType_FromString     (ELimLoc)
		SimpleType_Operator_Equal (CLimLoc)
	};
	 
	
	
	

	enum EScript
	{
		scriptDoubleStruck  = 0,
		scriptFraktur		= 1,
		scriptMonospace		= 2,
		scriptRoman			= 3,
		scriptSansSerif		= 4,
		scriptScript		= 5
	};

	template<EScript eDefValue = scriptRoman>
	class CScript : public CSimpleType<EScript, eDefValue>
	{
	public:

		CScript() {} 

		virtual EScript FromString(CString &sValue)
		{
			if       ( _T("double-struck")		== sValue ) m_eValue = scriptDoubleStruck;
			else if  ( _T("fraktur")			== sValue ) m_eValue = scriptFraktur;
			else if  ( _T("monospace")			== sValue ) m_eValue = scriptMonospace;
			else if  ( _T("roman")				== sValue ) m_eValue = scriptRoman;
			else if  ( _T("sans-serif")			== sValue ) m_eValue = scriptSansSerif;
			else											m_eValue = scriptScript;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case scriptDoubleStruck	: return _T("double-struck");
			case scriptFraktur		: return _T("fraktur");
			case scriptMonospace	: return _T("monospace");	
			case scriptRoman		: return _T("roman");
			case scriptSansSerif	: return _T("sans-serif");
			case scriptScript		: return _T("script");
			default					: return _T("roman");
			}
		}

		SimpleType_FromString     (EScript)
		SimpleType_Operator_Equal (CScript)
	};
	
	
	
	

	enum EShp
	{
		shpCentered  = 0,
		shpMatch	 = 1
	};

	template<EShp eDefValue = shpCentered>
	class CShp : public CSimpleType<EShp, eDefValue>
	{
	public:

		CShp() {} 

		virtual EShp FromString(CString &sValue)
		{
			if       ( _T("centered")	== sValue )	 m_eValue = shpCentered;
			else									 m_eValue = shpMatch;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case shpCentered		: return _T("centered");
			case shpMatch			: return _T("match");
			default					: return _T("centered");
			}
		}

		SimpleType_FromString     (EShp)
		SimpleType_Operator_Equal (CShp)
	};
	
	
	
	

	template<int unDefValue = 0>
	class CSpacingRule : public CSimpleType<int, unDefValue>
	{
	public:
		CSpacingRule() {}

		virtual int FromString(CString &sValue)
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

		SimpleType_FromString     (int)
		SimpleType_Operator_Equal (CSpacingRule)
	};
	
	
	
	

	enum EStyle
	{
		styleBold		= 0,
		styleBoldItalic = 1,
		styleItalic		= 2,
		stylePlain		= 3
	};

	template<EStyle eDefValue = styleBoldItalic>
	class CStyle : public CSimpleType<EStyle, eDefValue>
	{
	public:

		CStyle() {} 

		virtual EStyle FromString(CString &sValue)
		{
			if       ( _T("b")			== sValue ) m_eValue = styleBold;
			else if  ( _T("bi")			== sValue ) m_eValue = styleBoldItalic;
			else if  ( _T("i")			== sValue ) m_eValue = styleItalic;
			else									m_eValue = stylePlain;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case styleBold			: return _T("b");
			case styleBoldItalic	: return _T("bi");
			case styleItalic		: return _T("i");	
			case stylePlain			: return _T("p");
			default					: return _T("i");
			}
		}

		SimpleType_FromString     (EStyle)
		SimpleType_Operator_Equal (CStyle)
	};
	
	
	
	

	enum ETopBot
	{
		tbBot	 = 0,
		tbTop	 = 1
	};

	template<ETopBot eDefValue = tbBot>
	class CTopBot : public CSimpleType<ETopBot, eDefValue>
	{
	public:

		CTopBot() {} 

		virtual ETopBot FromString(CString &sValue)
		{
			if       ( _T("bot")	== sValue )	m_eValue = tbBot;
			else								m_eValue = tbTop;

			return m_eValue;
		}

		virtual CString ToString() const 
		{
			switch(m_eValue)
			{
			case tbBot		: return _T("bot");
			case tbTop		: return _T("top");
			default			: return _T("bot");
			}
		}

		SimpleType_FromString     (ETopBot)
		SimpleType_Operator_Equal (CTopBot)
	};

	
	
	

	template<unsigned int unDefValue = 0>
	class CUnSignedInteger : public CSimpleType<unsigned int, unDefValue>
	{
	public:
		CUnSignedInteger() {}

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
		SimpleType_Operator_Equal (CUnSignedInteger)
	};
}