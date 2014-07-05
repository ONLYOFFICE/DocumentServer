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

const double c_dMasterUnitsToInchKoef = 1.0 / 576;
const double c_dInchToMillimetreKoef  = 25.4;
const double c_dMasterUnitsToMillimetreKoef = c_dMasterUnitsToInchKoef * c_dInchToMillimetreKoef;

class CMetricInfo
{
public:
	DWORD m_lUnitsHor;
	DWORD m_lUnitsVer;

	DWORD m_lMillimetresHor;
	DWORD m_lMillimetresVer;

public:
	CMetricInfo()
	{
		m_lUnitsHor = 5000;
		m_lUnitsVer = 5000;

		m_lMillimetresHor = 5000;
		m_lMillimetresVer = 5000;
	}

	CMetricInfo& operator =(const CMetricInfo& oSrc)
	{
		m_lUnitsHor = oSrc.m_lUnitsHor;
		m_lUnitsVer = oSrc.m_lUnitsVer;
		m_lMillimetresHor = oSrc.m_lMillimetresHor;
		m_lMillimetresVer = oSrc.m_lMillimetresVer;

		return *this;
	}

	void SetUnitsContainerSize(DWORD lSizeX, DWORD lSizeY)
	{
		m_lUnitsHor = lSizeX;
		m_lUnitsVer = lSizeY;

		m_lMillimetresHor = (DWORD)(m_lUnitsHor * c_dMasterUnitsToMillimetreKoef);
		m_lMillimetresVer = (DWORD)(m_lUnitsVer * c_dMasterUnitsToMillimetreKoef);
	}
};

class CDoubleRect
{
public:
	double left;
	double top;
	double right;
	double bottom;

public:
	CDoubleRect()
	{
		left	= 0;
		top		= 0;
		right	= 0;
		bottom	= 0;
	}
	CDoubleRect& operator=(const CDoubleRect& oSrc)
	{
		left	= oSrc.left;
		top		= oSrc.top;
		right	= oSrc.right;
		bottom	= oSrc.bottom;

		return *this;
	}
	CDoubleRect(const CDoubleRect& oSrc)
	{
		*this = oSrc;
	}

	inline double GetWidth() const
	{
		return right - left;
	}
	inline double GetHeight() const
	{
		return bottom - top;
	}
};

class CGeomShapeInfo
{
public:
	class CPointD
	{
	public:
		double dX;
		double dY;
	public:
		CPointD()
		{
			dX = 0;
			dY = 0;
		}

		CPointD& operator= (const CPointD& oSrc)
		{
			dX = oSrc.dX;
			dY = oSrc.dY;

			return *this;
		}

		CPointD(const CPointD& oSrc)
		{
			*this = oSrc;
		}
	};

public:
	double m_dLeft;
	double m_dTop;
	double m_dWidth;
	double m_dHeight;

	double m_dLimoX;
	double m_dLimoY;

	
	CPointD m_oCurPoint;

	double m_dRotate;
	bool m_bFlipH;
	bool m_bFlipV;

public:
	CGeomShapeInfo()
	{
		m_dLeft = 0; 
		m_dTop = 0;
		m_dWidth = 720; 
		m_dHeight = 576;
		
		m_dLimoX = 0;
		m_dLimoY = 0;

		m_oCurPoint.dX = 0;
		m_oCurPoint.dY = 0;

		m_dRotate = 0.0;
		m_bFlipH = false;
		m_bFlipV = false;
	}
	~CGeomShapeInfo()
	{
	}

	CGeomShapeInfo& operator =(const CGeomShapeInfo& oSrc)
	{
		m_dLeft		= oSrc.m_dLeft; 
		m_dTop		= oSrc.m_dTop;
		m_dWidth	= oSrc.m_dWidth; 
		m_dHeight	= oSrc.m_dHeight;
		
		m_dLimoX	= oSrc.m_dLimoX;
		m_dLimoY	= oSrc.m_dLimoY;

		m_oCurPoint = oSrc.m_oCurPoint;

		m_dRotate	= oSrc.m_dRotate;
		m_bFlipH	= oSrc.m_bFlipH;
		m_bFlipV	= oSrc.m_bFlipV;

		return (*this);
	}

	inline void SetBounds(const CDoubleRect& oRect)
	{
		m_dLeft		= oRect.left;
		m_dTop		= oRect.top;
		m_dWidth	= oRect.GetWidth();	
		m_dHeight	= oRect.GetHeight();
	}

	inline LONG GetFlags()
	{
		LONG lFlags = 0;
		if (m_bFlipH)
			lFlags |= 0x0001;
		if (m_bFlipV)
			lFlags |= 0x0002;

		return lFlags;
	}
};
