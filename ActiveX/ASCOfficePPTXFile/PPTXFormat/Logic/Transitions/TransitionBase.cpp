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

#include "TransitionBase.h"
#include "EmptyTransition.h"
#include "OrientationTransition.h"
#include "EightDirectionTransition.h"
#include "OptionalBlackTransition.h"
#include "SideDirectionTransition.h"
#include "CornerDirectionTransition.h"
#include "WheelTransition.h"
#include "SplitTransition.h"
#include "ZoomTransition.h"

namespace PPTX
{
	namespace Logic
	{

		TransitionBase::TransitionBase()
		{
		}

		TransitionBase::~TransitionBase()
		{
		}

		TransitionBase::TransitionBase(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const TransitionBase& TransitionBase::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}

		void TransitionBase::fromXML(XmlUtils::CXmlNode& node)
		{
			CString name = XmlUtils::GetNameNoNS(node.GetName());

			if (name == _T("random"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("circle"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("dissolve"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("diamond"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("newsflash"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("plus"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("wedge"))
				base.reset(new Logic::EmptyTransition(node));
			else if (name == _T("blinds"))
				base.reset(new Logic::OrientationTransition(node));
			else if (name == _T("checker"))
				base.reset(new Logic::OrientationTransition(node));
			else if (name == _T("comb"))
				base.reset(new Logic::OrientationTransition(node));
			else if (name == _T("randomBar"))
				base.reset(new Logic::OrientationTransition(node));
			else if (name == _T("cover"))
				base.reset(new Logic::EightDirectionTransition(node));
			else if (name == _T("pull"))
				base.reset(new Logic::EightDirectionTransition(node));
			else if (name == _T("cut"))
				base.reset(new Logic::OptionalBlackTransition(node));
			else if (name == _T("fade"))
				base.reset(new Logic::OptionalBlackTransition(node));
			else if (name == _T("push"))
				base.reset(new Logic::SideDirectionTransition(node));
			else if (name == _T("wipe"))
				base.reset(new Logic::SideDirectionTransition(node));
			else if (name == _T("strips"))
				base.reset(new Logic::CornerDirectionTransition(node));
			else if (name == _T("wheel"))
				base.reset(new Logic::WheelTransition(node));
			else if (name == _T("split"))
				base.reset(new Logic::SplitTransition(node));
			else if (name == _T("zoom"))
				base.reset(new Logic::ZoomTransition(node));
			else base.reset();
		}

		void TransitionBase::GetTransitionTypeFrom(XmlUtils::CXmlNode& element)
		{
			XmlUtils::CXmlNode oNode; 
			if(element.GetNode(_T("p:random"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:circle"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:dissolve"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:diamond"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:newsflash"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:plus"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:wedge"), oNode))
				base.reset(new Logic::EmptyTransition(oNode));
			else if(element.GetNode(_T("p:blinds"), oNode))
				base.reset(new Logic::OrientationTransition(oNode));
			else if(element.GetNode(_T("p:checker"), oNode))
				base.reset(new Logic::OrientationTransition(oNode));
			else if(element.GetNode(_T("p:comb"), oNode))
				base.reset(new Logic::OrientationTransition(oNode));
			else if(element.GetNode(_T("p:randomBar"), oNode))
				base.reset(new Logic::OrientationTransition(oNode));
			else if(element.GetNode(_T("p:cover"), oNode))
				base.reset(new Logic::EightDirectionTransition(oNode));
			else if(element.GetNode(_T("p:pull"), oNode))
				base.reset(new Logic::EightDirectionTransition(oNode));
			else if(element.GetNode(_T("p:cut"), oNode))
				base.reset(new Logic::OptionalBlackTransition(oNode));
			else if(element.GetNode(_T("p:fade"), oNode))
				base.reset(new Logic::OptionalBlackTransition(oNode));
			else if(element.GetNode(_T("p:push"), oNode))
				base.reset(new Logic::SideDirectionTransition(oNode));
			else if(element.GetNode(_T("p:wipe"), oNode))
				base.reset(new Logic::SideDirectionTransition(oNode));
			else if(element.GetNode(_T("p:strips"), oNode))
				base.reset(new Logic::CornerDirectionTransition(oNode));
			else if(element.GetNode(_T("p:wheel"), oNode))
				base.reset(new Logic::WheelTransition(oNode));
			else if(element.GetNode(_T("p:split"), oNode))
				base.reset(new Logic::SplitTransition(oNode));
			else if(element.GetNode(_T("p:zoom"), oNode))
				base.reset(new Logic::ZoomTransition(oNode));
			else base.reset();
		}

		CString TransitionBase::toXML() const
		{
			if (base.IsInit())
				return base->toXML();
			
			return _T("");
		}

		
		TransitionSerialize::TransitionSerialize(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const TransitionSerialize& TransitionSerialize::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}

		void TransitionSerialize::fromXML(XmlUtils::CXmlNode& node)
		{
			m_strNodeName = node.GetName();
			node.ReadAllAttributes(m_strAttributesNames, m_strAttributesValues);
		}

		void TransitionSerialize::GetTransitionTypeFrom(XmlUtils::CXmlNode& element)
		{			
			XmlUtils::CXmlNodes oNodes;
			element.GetNodes(_T("*"), oNodes);
			
			if (!oNodes.IsValid())
				return;

			int nCount = oNodes.GetCount();
			if (1 == nCount)
			{
				XmlUtils::CXmlNode oNode;
				oNodes.GetAt(0, oNode);

				m_strNodeName = oNode.GetName();
				oNode.ReadAllAttributes(m_strAttributesNames, m_strAttributesValues);
			}
		}

		CString TransitionSerialize::toXML() const
		{	
			return _T("");
		}
	} 
} // namespace PPTX