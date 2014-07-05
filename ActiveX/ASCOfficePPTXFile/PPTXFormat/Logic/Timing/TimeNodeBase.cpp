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

#include "TimeNodeBase.h"
#include "Seq.h"
#include "Par.h"
#include "Audio.h"
#include "Video.h"
#include "Excl.h"
#include "Anim.h"
#include "AnimClr.h"
#include "AnimEffect.h"
#include "AnimMotion.h"
#include "AnimRot.h"
#include "AnimScale.h"
#include "Cmd.h"
#include "Set.h"

namespace PPTX
{
	namespace Logic
	{

		TimeNodeBase::TimeNodeBase()
		{
		}

		TimeNodeBase::~TimeNodeBase()
		{
		}

		TimeNodeBase::TimeNodeBase(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
		}

		const TimeNodeBase& TimeNodeBase::operator =(XmlUtils::CXmlNode& node)
		{
			fromXML(node);
			return *this;
		}

		void TimeNodeBase::fromXML(XmlUtils::CXmlNode& node)
		{
			CString name = XmlUtils::GetNameNoNS(node.GetName());

			if(name == _T("seq"))
				m_node.reset(new Logic::Seq(node));
			else if(name == _T("par"))
				m_node.reset(new Logic::Par(node));
			else if(name == _T("audio"))
				m_node.reset(new Logic::Audio(node));
			else if(name == _T("video"))
				m_node.reset(new Logic::Video(node));
			else if(name == _T("excl"))
				m_node.reset(new Logic::Excl(node));
			else if(name == _T("anim"))
				m_node.reset(new Logic::Anim(node));
			else if(name == _T("animClr"))
				m_node.reset(new Logic::AnimClr(node));
			else if(name == _T("animEffect"))
				m_node.reset(new Logic::AnimEffect(node));
			else if(name == _T("animMotion"))
				m_node.reset(new Logic::AnimMotion(node));
			else if(name == _T("animRot"))
				m_node.reset(new Logic::AnimRot(node));
			else if(name == _T("animScale"))
				m_node.reset(new Logic::AnimScale(node));
			else if(name == _T("cmd"))
				m_node.reset(new Logic::Cmd(node));
			else if(name == _T("set"))
				m_node.reset(new Logic::Set(node));
			else m_node.reset();
		}

		void TimeNodeBase::GetTimeNodeFrom(XmlUtils::CXmlNode& element)
		{
			XmlUtils::CXmlNode oNode;			
			if(element.GetNode(_T("p:seq"), oNode))
				m_node.reset(new Logic::Seq(oNode));
			else if(element.GetNode(_T("p:par"), oNode))
				m_node.reset(new Logic::Par(oNode));
			else if(element.GetNode(_T("p:audio"), oNode))
				m_node.reset(new Logic::Audio(oNode));
			else if(element.GetNode(_T("p:video"), oNode))
				m_node.reset(new Logic::Video(oNode));
			else if(element.GetNode(_T("p:excl"), oNode))
				m_node.reset(new Logic::Excl(oNode));
			else if(element.GetNode(_T("p:anim"), oNode))
				m_node.reset(new Logic::Anim(oNode));
			else if(element.GetNode(_T("p:animClr"), oNode))
				m_node.reset(new Logic::AnimClr(oNode));
			else if(element.GetNode(_T("p:animEffect"), oNode))
				m_node.reset(new Logic::AnimEffect(oNode));
			else if(element.GetNode(_T("p:animMotion"), oNode))
				m_node.reset(new Logic::AnimMotion(oNode));
			else if(element.GetNode(_T("p:animRot"), oNode))
				m_node.reset(new Logic::AnimRot(oNode));
			else if(element.GetNode(_T("p:animScale"), oNode))
				m_node.reset(new Logic::AnimScale(oNode));
			else if(element.GetNode(_T("p:cmd"), oNode))
				m_node.reset(new Logic::Cmd(oNode));
			else if(element.GetNode(_T("p:set"), oNode))
				m_node.reset(new Logic::Set(oNode));
			else m_node.reset();
		}

		CString TimeNodeBase::toXML() const
		{
			if (m_node.IsInit())
				return m_node->toXML();
			return _T("");
		}

	} 
} // namespace PPTX