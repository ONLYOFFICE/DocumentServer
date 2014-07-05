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
#ifndef PPTX_LOGIC_UNIMEDIA_INCLUDE_H_
#define PPTX_LOGIC_UNIMEDIA_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "Media/AudioCD.h"
#include "Media/WavAudioFile.h"
#include "Media/MediaFile.h"

namespace PPTX
{
	namespace Logic
	{
		class UniMedia : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(UniMedia)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				CString name = XmlUtils::GetNameNoNS(node.GetName());

				if (name == _T("audioCd"))
					Media.reset(new Logic::AudioCD(node));
				else if (name == _T("wavAudioFile"))
					Media.reset(new Logic::WavAudioFile(node));
				else if (name == _T("audioFile"))
					Media.reset(new Logic::MediaFile(node));
				else if (name == _T("videoFile"))
					Media.reset(new Logic::MediaFile(node));
				else if (name == _T("quickTimeFile"))
					Media.reset(new Logic::MediaFile(node));
				else Media.reset();
			}

			virtual void GetMediaFrom(XmlUtils::CXmlNode& element)
			{
				XmlUtils::CXmlNode oNode;
				if (element.GetNode(_T("a:audioCd"), oNode))
					Media.reset(new Logic::AudioCD(oNode));
				else if (element.GetNode(_T("a:wavAudioFile"), oNode))
					Media.reset(new Logic::WavAudioFile(oNode));
				else if (element.GetNode(_T("a:audioFile"), oNode))
					Media.reset(new Logic::MediaFile(oNode));
				else if (element.GetNode(_T("a:videoFile"), oNode))
					Media.reset(new Logic::MediaFile(oNode));
				else if (element.GetNode(_T("a:quickTimeFile"), oNode))
					Media.reset(new Logic::MediaFile(oNode));
				else Media.reset();
			}

			virtual CString toXML() const
			{
				if (Media.IsInit())
					return Media->toXML();
				return _T("");
			}

			
			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				
			}

			virtual void toPPTY(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				
				if (Media.is_init())
					Media->toXmlWriter(pWriter);
			}

			virtual bool is_init()const{return (Media.IsInit());};
			
			template<class T> AVSINLINE const bool	is() const	{ return Media.is<T>(); }
			template<class T> AVSINLINE T&			as()		{ return Media.as<T>(); }
			template<class T> AVSINLINE const T&	as() const 	{ return Media.as<T>(); }
		
		private:
			smart_ptr<WrapperWritingElement> Media;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual void SetParentPointer(const WrapperWritingElement* pParent)
			{
				if(is_init())
					Media->SetParentPointer(pParent);
			};
		};
	} 
} 

#endif // PPTX_LOGIC_UNIMEDIA_INCLUDE_H