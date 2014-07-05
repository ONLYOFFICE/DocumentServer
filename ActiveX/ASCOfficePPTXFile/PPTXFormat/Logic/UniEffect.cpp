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
 #include "./stdafx.h"

#include "UniEffect.h"
#include "Effects/OuterShdw.h"		
#include "Effects/Glow.h"			
#include "Effects/Duotone.h"		
#include "Effects/XfrmEffect.h"		
#include "Effects/Blur.h"			
#include "Effects/PrstShdw.h"		
#include "Effects/InnerShdw.h"		
#include "Effects/Reflection.h"		
#include "Effects/SoftEdge.h"		
#include "Effects/FillOverlay.h"	
#include "Effects/AlphaCeiling.h"	
#include "Effects/AlphaFloor.h"		
#include "Effects/TintEffect.h"		
#include "Effects/RelOff.h"			
#include "Effects/LumEffect.h"		
#include "Effects/HslEffect.h"		
#include "Effects/Grayscl.h"		
#include "Effects/EffectElement.h"	
#include "Effects/AlphaRepl.h"		
#include "Effects/AlphaOutset.h"	
#include "Effects/AlphaModFix.h"	
#include "Effects/AlphaBiLevel.h"	
#include "Effects/BiLevel.h"		
#include "EffectDag.h"				
#include "Effects/FillEffect.h"		
#include "Effects/ClrRepl.h"		
#include "Effects/ClrChange.h"		
#include "Effects/AlphaInv.h"		
#include "Effects/AlphaMod.h"		
#include "Effects/Blend.h"			

namespace PPTX
{
	namespace Logic
	{
		UniEffect::UniEffect()
		{
		}

		UniEffect::~UniEffect()
		{
			
		}

		UniEffect::UniEffect(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const UniEffect& UniEffect::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}

		void UniEffect::fromXML(XmlUtils::CXmlNode& node)
		{
			CString name = XmlUtils::GetNameNoNS(node.GetName());

			if (name == _T("")) 
				return;
			switch ((int)name[0])
			{
			case 'a':
				{
					if (name == _T("alphaCeiling")){ Effect.reset(new Logic::AlphaCeiling(node)); break; }	
					if (name == _T("alphaFloor")){ Effect.reset(new Logic::AlphaFloor(node)); break; }		
					if (name == _T("alphaRepl")){ Effect.reset(new Logic::AlphaRepl(node)); break; }		
					if (name == _T("alphaOutset")){ Effect.reset(new Logic::AlphaOutset(node)); break; }	
					if (name == _T("alphaModFix")){ Effect.reset(new Logic::AlphaModFix(node)); break; }	
					if (name == _T("alphaBiLevel")){ Effect.reset(new Logic::AlphaBiLevel(node)); break; }	
					if (name == _T("alphaInv")){ Effect.reset(new Logic::AlphaInv(node)); break; }			
					if (name == _T("alphaMod")){ Effect.reset(new Logic::AlphaMod(node)); break; }			
					break;
				}
			case 'b':
				{
					if (name == _T("blur")){ Effect.reset(new Logic::Blur(node)); break; }					
					if (name == _T("biLevel")){ Effect.reset(new Logic::BiLevel(node)); break; }			
					if (name == _T("blend")){ Effect.reset(new Logic::Blend(node)); break; }				
					break;
				}
			case 'c':
				{
					if (name == _T("cont")){ Effect.reset(new Logic::EffectDag(node)); break; }				
					if (name == _T("clrRepl")){ Effect.reset(new Logic::ClrRepl(node)); break; }			
					if (name == _T("clrChange")){ Effect.reset(new Logic::ClrChange(node)); break; }		
					break;
				}
			case 'd':
				{
					if (name == _T("duotone")){ Effect.reset(new Logic::Duotone(node)); break; }			
					break;
				}
			case 'e':
				{
					if (name == _T("effect")){ Effect.reset(new Logic::EffectElement(node)); break; }		
					break;
				}
			case 'f':
				{
					if (name == _T("fillOverlay")){ Effect.reset(new Logic::FillOverlay(node)); break; }	
					if (name == _T("fill")){ Effect.reset(new Logic::FillEffect(node)); break; }			
					break;
				}
			case 'g':
				{
					if (name == _T("glow")){ Effect.reset(new Logic::Glow(node)); break; }					
					if (name == _T("grayscl")){ Effect.reset(new Logic::Grayscl(node)); break; }			
					break;
				}
			case 'h':
				{
					if (name == _T("hsl")){ Effect.reset(new Logic::HslEffect(node)); break; }				
					break;
				}
			case 'i':
				{
					if (name == _T("innerShdw")){ Effect.reset(new Logic::InnerShdw(node)); break; }		
					break;
				}
			case 'l':
				{
					if (name == _T("lum")){ Effect.reset(new Logic::LumEffect(node)); break; }				
					break;
				}
			case 'o':
				{
					if (name == _T("outerShdw")){ Effect.reset(new Logic::OuterShdw(node)); break; }		
					break;
				}
			case 'p':
				{
					if (name == _T("prstShdw")){ Effect.reset(new Logic::PrstShdw(node)); break; }			
					break;
				}
			case 'r':
				{
					if (name == _T("reflection")){ Effect.reset(new Logic::Reflection(node)); break; }		
					if (name == _T("relOff")){ Effect.reset(new Logic::RelOff(node)); break; }				
					break;
				}
			case 's':
				{
					if (name == _T("softEdge")){ Effect.reset(new Logic::SoftEdge(node)); break; }			
					break;
				}
			case 't':
				{
					if (name == _T("tint")){ Effect.reset(new Logic::TintEffect(node)); break; }			
					break;
				}
			case 'x':
				{
					if (name == _T("xfrm")){ Effect.reset(new Logic::XfrmEffect(node)); break; }			
					break;
				}
			default:
				{
					Effect.reset();
					break;
				}
			}
		}

		void UniEffect::GetEffectFrom(XmlUtils::CXmlNode& element)
		{
			XmlUtils::CXmlNode oNode;
			
			if(element.GetNode(_T("a:outerShdw"), oNode))
				Effect.reset(new Logic::OuterShdw(oNode));				
			else if(element.GetNode(_T("a:glow"), oNode))
				Effect.reset(new Logic::Glow(oNode));					
			else if(element.GetNode(_T("a:duotone"), oNode))
				Effect.reset(new Logic::Duotone(oNode));				
			else if(element.GetNode(_T("a:xfrm"), oNode))
				Effect.reset(new Logic::XfrmEffect(oNode));				
			else if(element.GetNode(_T("a:blur"), oNode))
				Effect.reset(new Logic::Blur(oNode));					
			else if(element.GetNode(_T("a:prstShdw"), oNode))
				Effect.reset(new Logic::PrstShdw(oNode));				
			else if(element.GetNode(_T("a:innerShdw"), oNode))
				Effect.reset(new Logic::InnerShdw(oNode));				
			else if(element.GetNode(_T("a:reflection"), oNode))
				Effect.reset(new Logic::Reflection(oNode));				
			else if(element.GetNode(_T("a:softEdge"), oNode))
				Effect.reset(new Logic::SoftEdge(oNode));				
			else if(element.GetNode(_T("a:fillOverlay"), oNode))
				Effect.reset(new Logic::FillOverlay(oNode));			
			else if(element.GetNode(_T("a:alphaCeiling"), oNode))
				Effect.reset(new Logic::AlphaCeiling(oNode));			
			else if(element.GetNode(_T("a:alphaFloor"), oNode))
				Effect.reset(new Logic::AlphaFloor(oNode));				
			else if(element.GetNode(_T("a:tint"), oNode))
				Effect.reset(new Logic::TintEffect(oNode));				
			else if(element.GetNode(_T("a:relOff"), oNode))
				Effect.reset(new Logic::RelOff(oNode));					
			else if(element.GetNode(_T("a:lum"), oNode))
				Effect.reset(new Logic::LumEffect(oNode));				
			else if(element.GetNode(_T("a:hsl"), oNode))
				Effect.reset(new Logic::HslEffect(oNode));				
			else if(element.GetNode(_T("a:grayscl"), oNode))
				Effect.reset(new Logic::Grayscl(oNode));				
			else if(element.GetNode(_T("a:effect"), oNode))
				Effect.reset(new Logic::EffectElement(oNode));			
			else if(element.GetNode(_T("a:alphaRepl"), oNode))
				Effect.reset(new Logic::AlphaRepl(oNode));				
			else if(element.GetNode(_T("a:alphaOutset"), oNode))
				Effect.reset(new Logic::AlphaOutset(oNode));			
			else if(element.GetNode(_T("a:alphaModFix"), oNode))
				Effect.reset(new Logic::AlphaModFix(oNode));			
			else if(element.GetNode(_T("a:alphaBiLevel"), oNode))
				Effect.reset(new Logic::AlphaBiLevel(oNode));			
			else if(element.GetNode(_T("a:biLevel"), oNode))
				Effect.reset(new Logic::BiLevel(oNode));				
			else if(element.GetNode(_T("a:cont"), oNode))
				Effect.reset(new Logic::EffectDag(oNode));				
			else if(element.GetNode(_T("a:fill"), oNode))
				Effect.reset(new Logic::FillEffect(oNode));				
			else if(element.GetNode(_T("a:clrRepl"), oNode))
				Effect.reset(new Logic::ClrRepl(oNode));				
			else if(element.GetNode(_T("a:clrChange"), oNode))
				Effect.reset(new Logic::ClrChange(oNode));				
			else if(element.GetNode(_T("a:alphaInv"), oNode))
				Effect.reset(new Logic::AlphaInv(oNode));				
			else if(element.GetNode(_T("a:alphaMod"), oNode))
				Effect.reset(new Logic::AlphaMod(oNode));				
			else if(element.GetNode(_T("a:blend"), oNode))
				Effect.reset(new Logic::Blend(oNode));					
			else Effect.reset();
		}

		CString UniEffect::toXML() const
		{
			if (Effect.IsInit())
				return Effect->toXML();
			return _T("");
		}
	} 
} // namespace PPTX