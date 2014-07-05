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
 #include "stdafx.h"

#include "AnimationTypes.h"







#pragma region _MACROSES_

#define GET_ENUM_STRING(NAME,VALUE)											\
	case  TL_##NAME##VALUE:													\
	return CString(_T("TL_")) + CString(_T(#NAME)) + CString(#VALUE);		\
	break;

#define GET_EFFECT_NAME_BY_ID(VALUE,DESCRIPTION)							\
	case (##VALUE) : return CString(_T(#DESCRIPTION)); break;

#pragma endregion

namespace Animations
{
	CString ODHelpers::GetTimePropertyID4TimeNode ( TimePropertyID4TimeNode Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( TPID_, Display );
			GET_ENUM_STRING ( TPID_, MasterPos );
			GET_ENUM_STRING ( TPID_, SlaveType );
			GET_ENUM_STRING ( TPID_, EffectID );
			GET_ENUM_STRING ( TPID_, EffectDir );
			GET_ENUM_STRING ( TPID_, AfterEffect );
			GET_ENUM_STRING ( TPID_, SlideCount );
			GET_ENUM_STRING ( TPID_, TimeFilter );
			GET_ENUM_STRING ( TPID_, EventFilter );
			GET_ENUM_STRING ( TPID_, HideWhenStopped );
			GET_ENUM_STRING ( TPID_, GroupID );
			GET_ENUM_STRING ( TPID_, EffectNodeType );
			GET_ENUM_STRING ( TPID_, PlaceholderNode );
			GET_ENUM_STRING ( TPID_, MediaVolume );
			GET_ENUM_STRING ( TPID_, MediaMute );
			GET_ENUM_STRING ( TPID_, ZoomToFullScreen );

		default: 
			return CString ( _T("TimePropertyID4TimeNode : Unknown Enum") );
		}
	};

	CString ODHelpers::GetTimeVariantTypeEnum ( TimeVariantTypeEnum Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( TVT_, Bool );
			GET_ENUM_STRING ( TVT_, Int );
			GET_ENUM_STRING ( TVT_, Float );
			GET_ENUM_STRING ( TVT_, String );

		default: 
			return CString ( _T("TimeVariantTypeEnum : Unknown Enum") );
		}
	};

	CString ODHelpers::GetTimeNodeTypeEnum ( TimeNodeTypeEnum Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( TNT_, Parallel );
			GET_ENUM_STRING ( TNT_, Sequential );
			GET_ENUM_STRING ( TNT_, Behavior );
			GET_ENUM_STRING ( TNT_, Media );

		default: 
			return CString ( _T("TimeNodeTypeEnum : Unknown Enum") );
		}
	};

	CString ODHelpers::GetTriggerObjectEnum ( TriggerObjectEnum Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( TOT_, None );				
			GET_ENUM_STRING ( TOT_, VisualElement );	
			GET_ENUM_STRING ( TOT_, TimeNode );			
			GET_ENUM_STRING ( TOT_, RuntimeNodeRef );	

		default: 
			return CString ( _T("TriggerObjectEnum : Unknown Enum") );
		}
	}

	CString ODHelpers::GetTimeVisualElementEnum ( TimeVisualElementEnum Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( TVET_, Shape );			
			GET_ENUM_STRING ( TVET_, Page );	
			GET_ENUM_STRING ( TVET_, TextRange );		
			GET_ENUM_STRING ( TVET_, Audio );	
			GET_ENUM_STRING ( TVET_, Video );			
			GET_ENUM_STRING ( TVET_, ChartElement );	
			GET_ENUM_STRING ( TVET_, ShapeOnly );		
			GET_ENUM_STRING ( TVET_, AllTextRange );	

		default: 
			return CString ( _T("TimeVisualElementEnum : Unknown Enum") );
		}
	}

	CString ODHelpers::GetElementTypeEnum ( ElementTypeEnum Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( ET_, ShapeType );			
			GET_ENUM_STRING ( ET_, SoundType );	

		default: 
			return CString ( _T("ElementTypeEnum : Unknown Enum") );
		}
	}

	CString ODHelpers::GetTimeAnimateBehaviorValueTypeEnum ( TimeAnimateBehaviorValueTypeEnum Value )
	{
		switch ( Value )
		{
			GET_ENUM_STRING ( TABVT_, String );			
			GET_ENUM_STRING ( TABVT_, Number );	
			GET_ENUM_STRING ( TABVT_, Color );	

		default: 
			return CString ( _T("TimeAnimateBehaviorValueTypeEnum : Unknown Enum") );
		}
	}

	CString ODHelpers::IntToHexString ( DWORD Value )
	{
		TCHAR buffer [ 16 ];
		_stprintf ( buffer, _T("0x%.8x"), Value );
		return CString ( buffer );
	}

	CString ODHelpers::DoubleToString ( double Value )
	{
		TCHAR buffer [ 16 ];
		_stprintf ( buffer, _T("%f"), Value );
		return CString ( buffer );
	}
	CString ODHelpers::IntToString ( int Value )
	{
		TCHAR buffer [ 16 ];
		_stprintf ( buffer, _T("%d"), Value );
		return CString ( buffer );
	}
	CString ODHelpers::GetAnimationClassName ( AnimationsClassType Value )
	{
		switch ( Value )
		{
		case Animations::RT_TimeNode:
			return CString (_T("TimeNodeAtom") );

		case Animations::RT_TimePropertyList:	
			return CString (_T("TimePropertyList4TimeNodeContainer"));

		case Animations::RT_TimeExtTimeNodeContainer:
			return CString (_T("ExtTimeNodeContainer"));

		case Animations::RT_SlideTime10Atom	:
			return CString (_T("SlideTime10Atom"));

		case Animations::RT_SlideFlags10Atom:
			return CString (_T("SlideFlags10Atom"));

		case Animations::RT_HashCodeAtom:
			return CString (_T("HashCode10Atom"));

		case Animations::RT_TimeSequenceData:
			return CString (_T("TimeSequenceDataAtom"));

		case Animations::RT_TimeConditionContainer:
			return CString (_T("TimeConditionContainer")); 

		case Animations::RT_TimeCondition:
			return CString (_T("TimeConditionAtom")); 
		}

		return CString (_T(""));
	}

	CString ODHelpers::GetEffectTypeOfGroup ( DWORD Value )
	{
		if ( 0x00000001	==	Value )
			return CString ( _T("Entrance") );
		if ( 0x00000002	==	Value )
			return CString ( _T("Exit") );
		if ( 0x00000003	==	Value )
			return CString ( _T("Emphasis") );
		if ( 0x00000004	==	Value )
			return CString ( _T("MotionPath") );
		if ( 0x00000005	==	Value )
			return CString ( _T("ActionVerb") );
		if ( 0x00000006	==	Value )
			return CString ( _T("MediaCommand") );

		return CString ( _T("") );
	}
	
	CString ODHelpers::GetEffectEntranceOrExitNameByID ( DWORD EffectID )
	{
		switch ( EffectID )
		{
			GET_EFFECT_NAME_BY_ID ( 0x00000000,  Custom );				
			GET_EFFECT_NAME_BY_ID ( 0x00000001,  Appear );				
			GET_EFFECT_NAME_BY_ID ( 0x00000002,  FlyIn );				
			GET_EFFECT_NAME_BY_ID ( 0x00000003,  Blinds );				
			GET_EFFECT_NAME_BY_ID ( 0x00000004,  Box );					
			GET_EFFECT_NAME_BY_ID ( 0x00000005,  CheckBoard );			
			GET_EFFECT_NAME_BY_ID ( 0x00000006,  Circle );				
			GET_EFFECT_NAME_BY_ID ( 0x00000007,  Crawl );				
			GET_EFFECT_NAME_BY_ID ( 0x00000008,  Diamond );				
			GET_EFFECT_NAME_BY_ID ( 0x00000009,  Dissolve );			
			GET_EFFECT_NAME_BY_ID ( 0x0000000A,  Fade );				
			GET_EFFECT_NAME_BY_ID ( 0x0000000B,  FlashOnce );			
			GET_EFFECT_NAME_BY_ID ( 0x0000000C,  Peek );				
			GET_EFFECT_NAME_BY_ID ( 0x0000000D,  Plus );				
			GET_EFFECT_NAME_BY_ID ( 0x0000000E,  RandomBars );			
			GET_EFFECT_NAME_BY_ID ( 0x0000000F,  Spiral );				
			GET_EFFECT_NAME_BY_ID ( 0x00000010,  Split );				
			GET_EFFECT_NAME_BY_ID ( 0x00000011,  Stretch );				
			GET_EFFECT_NAME_BY_ID ( 0x00000012,  Strips );				
			GET_EFFECT_NAME_BY_ID ( 0x00000013,  Swivel );				
			GET_EFFECT_NAME_BY_ID ( 0x00000014,  Wedge );				
			GET_EFFECT_NAME_BY_ID ( 0x00000015,  Wheel );				
			GET_EFFECT_NAME_BY_ID ( 0x00000016,  Wipe );				
			GET_EFFECT_NAME_BY_ID ( 0x00000017,  Zoom );				
			GET_EFFECT_NAME_BY_ID ( 0x00000018,  RandomEffects );		
			GET_EFFECT_NAME_BY_ID ( 0x00000019,  Boomerang );			
			GET_EFFECT_NAME_BY_ID ( 0x0000001A,  Bounce );				
			GET_EFFECT_NAME_BY_ID ( 0x0000001B,  ColorReveal );			
			GET_EFFECT_NAME_BY_ID ( 0x0000001C,  Credits );				
			GET_EFFECT_NAME_BY_ID ( 0x0000001D,  EaseIn );				
			GET_EFFECT_NAME_BY_ID ( 0x0000001E,  Float );				
			GET_EFFECT_NAME_BY_ID ( 0x0000001F,  GrowAndTurn );			
			
			
			GET_EFFECT_NAME_BY_ID ( 0x00000022,  LightSpeed );			
			GET_EFFECT_NAME_BY_ID ( 0x00000023,  PinWheel );			
			
			GET_EFFECT_NAME_BY_ID ( 0x00000025,  RiseUp );				
			GET_EFFECT_NAME_BY_ID ( 0x00000026,  Swish );				
			GET_EFFECT_NAME_BY_ID ( 0x00000027,  ThinLine );			
			GET_EFFECT_NAME_BY_ID ( 0x00000028,  Unfold );				
			GET_EFFECT_NAME_BY_ID ( 0x00000029,  Whip );				
			GET_EFFECT_NAME_BY_ID ( 0x0000002A,  Ascend );				
			GET_EFFECT_NAME_BY_ID ( 0x0000002B,  CenterRevolve );		
			
			GET_EFFECT_NAME_BY_ID ( 0x0000002D,  FadedSwivel );			
			
			GET_EFFECT_NAME_BY_ID ( 0x0000002F,  Descend );				
			GET_EFFECT_NAME_BY_ID ( 0x00000030,  Sling );				
			GET_EFFECT_NAME_BY_ID ( 0x00000031,  Spinner );				
			GET_EFFECT_NAME_BY_ID ( 0x00000032,  Compress );			
			GET_EFFECT_NAME_BY_ID ( 0x00000033,  Zip );					
			GET_EFFECT_NAME_BY_ID ( 0x00000034,  ArcUp );				
			GET_EFFECT_NAME_BY_ID ( 0x00000035,  FadedZoom );			
			GET_EFFECT_NAME_BY_ID ( 0x00000036,  Glide );				
			GET_EFFECT_NAME_BY_ID ( 0x00000037,  Expand );				
			GET_EFFECT_NAME_BY_ID ( 0x00000038,  Flip );				
			
			GET_EFFECT_NAME_BY_ID ( 0x0000003A,  Fold );				
		default :			  
			break;
		}
		return CString(_T("Unknown EffectID"));
	}

	
	CString ODHelpers::GetEffectEmphasisNameByID ( DWORD EffectID )
	{
		switch ( EffectID )
		{
			GET_EFFECT_NAME_BY_ID ( 0x00000001,  ChangeFillColor );		
			GET_EFFECT_NAME_BY_ID ( 0x00000002,  ChangeFont );			
			GET_EFFECT_NAME_BY_ID ( 0x00000003,  ChangeFillColor );		
			GET_EFFECT_NAME_BY_ID ( 0x00000004,  ChangeFontSize );		
			GET_EFFECT_NAME_BY_ID ( 0x00000005,  ChangeFontStyle );		
			GET_EFFECT_NAME_BY_ID ( 0x00000006,  GrowAndShrink );		
			GET_EFFECT_NAME_BY_ID ( 0x00000007,  ChangeFillColor );		
			GET_EFFECT_NAME_BY_ID ( 0x00000008,  Spin );				
			GET_EFFECT_NAME_BY_ID ( 0x00000009,  Transparency );		
			GET_EFFECT_NAME_BY_ID ( 0x0000000A,  BoldFlash );			
			
			
			
			GET_EFFECT_NAME_BY_ID ( 0x0000000E,  Blast );				
			GET_EFFECT_NAME_BY_ID ( 0x0000000F,  BoldReveal );			
			GET_EFFECT_NAME_BY_ID ( 0x00000010,  BrushOnColor );		
			
			GET_EFFECT_NAME_BY_ID ( 0x00000012,  BrushOnUnderline );	
			GET_EFFECT_NAME_BY_ID ( 0x00000013,  ColorBlend );			
			GET_EFFECT_NAME_BY_ID ( 0x00000014,  ColorWave );			
			GET_EFFECT_NAME_BY_ID ( 0x00000015,  ComplementaryColor );	
			GET_EFFECT_NAME_BY_ID ( 0x00000016,  ComplementaryColor2 );	
			GET_EFFECT_NAME_BY_ID ( 0x00000017,  ContrastingColor );	
			GET_EFFECT_NAME_BY_ID ( 0x00000018,  Darken );				
			GET_EFFECT_NAME_BY_ID ( 0x00000019,  Desaturate );			
			GET_EFFECT_NAME_BY_ID ( 0x0000001A,  FlashBulb );			
			GET_EFFECT_NAME_BY_ID ( 0x0000001B,  Flicker );				
			GET_EFFECT_NAME_BY_ID ( 0x0000001C,  GrowWithColor );		
			
			GET_EFFECT_NAME_BY_ID ( 0x0000001E,  Lighten );				
			GET_EFFECT_NAME_BY_ID ( 0x0000001F,  StyleEmphasis );		
			GET_EFFECT_NAME_BY_ID ( 0x00000020,  Teeter );				
			GET_EFFECT_NAME_BY_ID ( 0x00000021,  VerticalGrow );		
			GET_EFFECT_NAME_BY_ID ( 0x00000022,  Wave );				
			GET_EFFECT_NAME_BY_ID ( 0x00000023,  Blink );				
			GET_EFFECT_NAME_BY_ID ( 0x00000024,  Shimmer );				
		default :			  
			break;
		}
		return CString(_T("Unknown EffectID"));
	}
	
	CString ODHelpers::GetEffectMotionPathNameByID ( DWORD EffectID )
	{
		switch ( EffectID )
		{
			GET_EFFECT_NAME_BY_ID ( 0x00000000,  Custom ); 
			GET_EFFECT_NAME_BY_ID ( 0x00000001,  Circle );  
			GET_EFFECT_NAME_BY_ID ( 0x00000002,  RightTriangle );   
			GET_EFFECT_NAME_BY_ID ( 0x00000003,  Diamond );   
			GET_EFFECT_NAME_BY_ID ( 0x00000004,  Hexagon );   
			GET_EFFECT_NAME_BY_ID ( 0x00000005,  FivePointStar );   
			GET_EFFECT_NAME_BY_ID ( 0x00000006,  CrescentMoon );   
			GET_EFFECT_NAME_BY_ID ( 0x00000007,  Square );  
			GET_EFFECT_NAME_BY_ID ( 0x00000008,  Trapezoid );   
			GET_EFFECT_NAME_BY_ID ( 0x00000009,  Heart ); 
			GET_EFFECT_NAME_BY_ID ( 0x0000000A,  Octagon );   
			GET_EFFECT_NAME_BY_ID ( 0x0000000B,  SixPointStar );  
			GET_EFFECT_NAME_BY_ID ( 0x0000000C,  Football );  
			GET_EFFECT_NAME_BY_ID ( 0x0000000D,  EqualTriangle );  
			GET_EFFECT_NAME_BY_ID ( 0x0000000E,  Parallelogram );  
			GET_EFFECT_NAME_BY_ID ( 0x0000000F,  Pentagon ); 
			GET_EFFECT_NAME_BY_ID ( 0x00000010,  FourPointStar );   
			GET_EFFECT_NAME_BY_ID ( 0x00000011,  EightPointStar );   
			GET_EFFECT_NAME_BY_ID ( 0x00000012,  Teardrop ); 
			GET_EFFECT_NAME_BY_ID ( 0x00000013,  PointyStar );   
			GET_EFFECT_NAME_BY_ID ( 0x00000014,  CurvedSquare );   
			GET_EFFECT_NAME_BY_ID ( 0x00000015,  CurvedX );  
			GET_EFFECT_NAME_BY_ID ( 0x00000016,  VerticalFigure8 );  
			GET_EFFECT_NAME_BY_ID ( 0x00000017,  CurvyStar );  
			GET_EFFECT_NAME_BY_ID ( 0x00000018,  LoopDeLoop );  
			GET_EFFECT_NAME_BY_ID ( 0x00000019,  BuzzSaw );   
			GET_EFFECT_NAME_BY_ID ( 0x0000001A,  HorizontalFigure8 );   
			GET_EFFECT_NAME_BY_ID ( 0x0000001B,  Peanut );  
			GET_EFFECT_NAME_BY_ID ( 0x0000001C,  Figure8four );   
			GET_EFFECT_NAME_BY_ID ( 0x0000001D,  Neutron ); 
			GET_EFFECT_NAME_BY_ID ( 0x0000001E,  Swoosh );  
			GET_EFFECT_NAME_BY_ID ( 0x0000001F,  Bean );  
			GET_EFFECT_NAME_BY_ID ( 0x00000020,  Plus );  
			GET_EFFECT_NAME_BY_ID ( 0x00000021,  InvertedTriangle ); 
			GET_EFFECT_NAME_BY_ID ( 0x00000022,  InvertedSquare );  
			GET_EFFECT_NAME_BY_ID ( 0x00000023,  Left );   
			GET_EFFECT_NAME_BY_ID ( 0x00000024,  TurnRight );  
			GET_EFFECT_NAME_BY_ID ( 0x00000025,  ArcDown );   
			GET_EFFECT_NAME_BY_ID ( 0x00000026,  Zigzag );   
			GET_EFFECT_NAME_BY_ID ( 0x00000027,  SCurve2 );  
			GET_EFFECT_NAME_BY_ID ( 0x00000028,  SineWave );    
			GET_EFFECT_NAME_BY_ID ( 0x00000029,  BounceLeft );   
			GET_EFFECT_NAME_BY_ID ( 0x0000002A,  Down );   
			GET_EFFECT_NAME_BY_ID ( 0x0000002B,  TurnUp );   
			GET_EFFECT_NAME_BY_ID ( 0x0000002C,  ArcUp );  
			GET_EFFECT_NAME_BY_ID ( 0x0000002D,  HeartBeat );   
			GET_EFFECT_NAME_BY_ID ( 0x0000002E,  SpiralRight );   
			GET_EFFECT_NAME_BY_ID ( 0x0000002F,  Wave );  
			GET_EFFECT_NAME_BY_ID ( 0x00000030,  CurvyLeft );  
			GET_EFFECT_NAME_BY_ID ( 0x00000031,  DiagonalDownRight );  
			GET_EFFECT_NAME_BY_ID ( 0x00000032,  TurnDown );   
			GET_EFFECT_NAME_BY_ID ( 0x00000033,  ArcLeft );  
			GET_EFFECT_NAME_BY_ID ( 0x00000034,  Funnel );  
			GET_EFFECT_NAME_BY_ID ( 0x00000035,  Spring );  
			GET_EFFECT_NAME_BY_ID ( 0x00000036,  BounceRight );   
			GET_EFFECT_NAME_BY_ID ( 0x00000037,  SpiralLeft );  
			GET_EFFECT_NAME_BY_ID ( 0x00000038,  DiagonalUpRight );  
			GET_EFFECT_NAME_BY_ID ( 0x00000039,  TurnUpRight );  
			GET_EFFECT_NAME_BY_ID ( 0x0000003A,  ArcRight );  
			GET_EFFECT_NAME_BY_ID ( 0x0000003B,  Scurve1 );   
			GET_EFFECT_NAME_BY_ID ( 0x0000003C,  DecayingWave );   
			GET_EFFECT_NAME_BY_ID ( 0x0000003D,  CurvyRight );   
			GET_EFFECT_NAME_BY_ID ( 0x0000003E,  StairsDown );   
			GET_EFFECT_NAME_BY_ID ( 0x0000003F,  Right );  
			GET_EFFECT_NAME_BY_ID ( 0x00000040,  Up );  
		default :			  
			break;
		}
		return CString(_T("Unknown EffectID"));
	}

	CString ODHelpers::GetEffectNameByID ( DWORD EffectType, DWORD EffectID )
	{
		switch ( EffectType )
		{
		case 0x00000001:	
		case 0x00000002:	
			return Animations::ODHelpers::GetEffectEntranceOrExitNameByID ( EffectID );
			break;
		case 0x00000003:	
			return Animations::ODHelpers::GetEffectEmphasisNameByID ( EffectID );
			break;
		case 0x00000004:	
			return Animations::ODHelpers::GetEffectMotionPathNameByID ( EffectID );
			break;
		case 0x00000005:	
		case 0x00000006:	
		default:
			break;
		}

		return CString ( _T("") );
	}
}
