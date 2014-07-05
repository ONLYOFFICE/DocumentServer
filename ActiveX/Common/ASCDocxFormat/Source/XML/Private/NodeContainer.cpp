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
 
#include "precompiled_xml.h"


#include "NodeContainer.h"
#include "./../XElement.h"
#include "./../XComment.h"
#include "./../XText.h"
#include "XList.h"
#include "XNamespaceContainer.h"
#include "Exception/not_implement.h"
#include "Utility.h"


namespace XML
{
	namespace Private
	{

		NodeContainer::NodeContainer()
			: Nodes(),
				Elements(Nodes),
				Texts(Nodes)
		{
		}


		NodeContainer::NodeContainer(const XNodeContainer& nodes)
			: Nodes(nodes),
				Elements(Nodes),
				Texts(Nodes)
		{
		}


		NodeContainer::~NodeContainer()
		{
		}


		NodeContainer::NodeContainer(const XElement& element)
			: Nodes(),
				Elements(Nodes),
				Texts(Nodes)
		{
			Elements.Add(element);
		}


		NodeContainer::NodeContainer(const XText& text)
			: Nodes(),
				Elements(Nodes),
				Texts(Nodes)
		{
			Texts.Add(text);
		}


		NodeContainer::NodeContainer(const XComment& comment)
			: Nodes(),
				Elements(Nodes),
				Texts(Nodes)
		{
			Nodes.Add(comment);
		}


		NodeContainer::NodeContainer(const XList& list)
			: Nodes(),
				Elements(Nodes),
				Texts(Nodes)
		{
			Nodes.merge(list.Nodes);
		}


		const bool NodeContainer::isElement() const
		{
			return false;
		}


		const bool NodeContainer::isText() const
		{
			return false;
		}


		const bool NodeContainer::isComment() const
		{
			return false;
		}


		void NodeContainer::fromSource(NSCommon::smart_ptr<XSingleSource> source, const XNamespaceContainer& ns, const XSpace& space)
		{
			if (space.isDefault())
				source->skipSpace();

			while (true)
			{
				if (source->get() == '<')
				{
					source->next();
					if (source->get() == '/')
						break;
					if (isComment(source))
						insertComment(source);	
					else
						Nodes.push_back(XElement(source, ns, space));
				}
				else
				{
					Nodes.push_back(XText(source->getString('<')));
				}
				if (space.isDefault())
					source->skipSpace();
			}
			source->next();
		}


		void NodeContainer::fromSource(NSCommon::smart_ptr<XWideSource> source, const XNamespaceContainer& ns, const XSpace& space)
		{
			if (space.isDefault())
				source->skipSpace();

			while (true)
			{
				if (source->get() == L'<')
				{
					source->next();
					if (source->get() == L'/')
						break;
					if (isComment(source))
						insertComment(source);	
					else
						Nodes.push_back(XElement(source, ns, space));
				}
				else
				{
					Nodes.push_back(XText(Encoding::unicode2utf8(source->getString(L'<'))));
				}
				if (space.isDefault())
					source->skipSpace();
			}
			source->next();
		}


		const std::string NodeContainer::ToString() const
		{
			return Nodes.ToString();
		}


		const std::wstring NodeContainer::ToWString() const
		{
			
			throw not_implement();
		}


		void NodeContainer::SaveToStringList(std::list<std::string>& strList) const
		{
			Nodes.SaveToStringList(strList);
		}


		void NodeContainer::SaveToWStringList(std::list<std::wstring>& strList) const
		{
			Nodes.SaveToWStringList(strList);
		}


		void NodeContainer::Add(const XNode& node)
		{
			Nodes.Add(node);
		}


		void NodeContainer::Add(const XElement& element)
		{
			Elements.Add(element);
		}


		void NodeContainer::Add(const XText& text)
		{
			Texts.Add(text);
		}


		void NodeContainer::Add(const XComment& comment)
		{
			Nodes.Add(comment);
		}


		void NodeContainer::Add(const XList& list)
		{
			Nodes.merge(list.Nodes);
		}


		const bool NodeContainer::isComment(NSCommon::smart_ptr<XSingleSource> source)
		{
			if (source->get() == '!')
			{
				source->next();
				if (source->get() == '-')
				{
					source->next();
					if (source->get() == '-')
					{
						source->next();
						return true;															
					}
				}
			}
			return false;
		}


		void NodeContainer::insertComment(NSCommon::smart_ptr<XSingleSource> source)
		{
			std::string comment;
			while(true)
			{
				comment += source->getString('-');									
				source->next();
				if (source->get() == '-')
				{										
					source->next();
					if (source->get() == '>')
					{
						source->next();
						break;		
					}
					else
					{
						comment += "--";						
					}
				}
				else
				{
					comment += "-";
				}
			}
			Nodes.push_back(XComment(comment));
		}


		const bool NodeContainer::isComment(NSCommon::smart_ptr<XWideSource> source)
		{
			if (source->get() == L'!')
			{
				source->next();
				if (source->get() == L'-')
				{
					source->next();
					if (source->get() == L'-')
					{
						source->next();
						return true;															
					}
				}
			}
			return false;
		}


		void NodeContainer::insertComment(NSCommon::smart_ptr<XWideSource> source)
		{
			std::wstring comment;
			while(true)
			{
				comment += source->getString(L'-');									
				source->next();
				if (source->get() == L'-')
				{										
					source->next();
					if (source->get() == L'>')
					{
						source->next();
						break;		
					}
					else
					{
						comment += L"--";						
					}
				}
				else
				{
					comment += L"-";
				}
			}
			Nodes.push_back(XComment(Encoding::unicode2utf8(comment)));
		}

	} 
} // namespace XML