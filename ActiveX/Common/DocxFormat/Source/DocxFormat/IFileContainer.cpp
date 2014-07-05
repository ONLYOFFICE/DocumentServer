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
 #include "IFileContainer.h"
#include "Rels.h"
#include "FileFactory.h"
#include "ContentTypes.h"

#include "FileType.h"
#include "External\External.h"
#include "External\HyperLink.h"
#include "Media\Image.h"
#include "Media\OleObject.h"
#include "FileTypes.h"

#include "../XlsxFormat/FileFactory_Spreadsheet.h"
BOOL XmlUtils::CStringWriter::m_bInitTable = FALSE;
BYTE XmlUtils::CStringWriter::m_arTableUnicodes[65536];

namespace OOX
{
	UnknowTypeFile IFileContainer::Unknown;

	void IFileContainer::Read (const OOX::CPath& oPath)
	{
		
		OOX::CRels oRels( oPath );

		
		Read( oRels, oPath.GetDirectory() );
	}


	void IFileContainer::Read (const OOX::CRels& oRels, const OOX::CPath& oPath)
	{
		int nCount = oRels.m_arrRelations.GetSize();

		for ( int nIndex = 0; nIndex < nCount; ++nIndex )
		{
			const Rels::CRelationShip& oCurRels = oRels.m_arrRelations[nIndex];
			smart_ptr<OOX::File> oFile = OOX::CreateFile( oPath, oCurRels );
			if(oFile.IsInit() && FileTypes::Unknow == oFile->type())
				oFile = OOX::Spreadsheet::CreateFile( oPath, oCurRels );
			Add( oCurRels.rId(), oFile );
		}
	}


	void IFileContainer::Write(const OOX::CPath& oFileName, const OOX::CPath& oDirectory, OOX::CContentTypes& oContent) const
	{
		OOX::CPath oCurrent = oFileName.GetDirectory();
		OOX::CRels oRels;

		Write( oRels, oCurrent, oDirectory, oContent );
		oRels.Write( oFileName );
	}
	void IFileContainer::Write(OOX::CRels& oRels, const OOX::CPath& oCurrent, const OOX::CPath& oDir, OOX::CContentTypes& oContent) const
	{
		CAtlMap<CString, size_t> mNamePair;

		POSITION pos = m_mContainer.GetStartPosition();

		while ( NULL != pos )
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.GetNext( pos );
			
			smart_ptr<OOX::File>     pFile = pPair->m_value;
			smart_ptr<OOX::External> pExt  = pFile.smart_dynamic_cast<OOX::External>();

			if ( !pExt.IsInit() )
			{
				OOX::CPath oDefDir = pFile->DefaultDirectory();
				OOX::CPath oName   = pFile->DefaultFileName();
		
				CAtlMap<CString, size_t>::CPair* pNamePair = mNamePair.Lookup( oName.m_strFilename );
				if ( NULL == pNamePair )
					mNamePair.SetAt( oName.m_strFilename, 1 );
				else
					oName = oName + pNamePair->m_key;

				OOX::CSystemUtility::CreateDirectories( oCurrent / oDefDir );
				pFile->write( oCurrent / oDefDir / oName, oDir / oDefDir, oContent );
				oRels.Registration( pPair->m_key, pFile->type(), oDefDir / oName );
			}
			else
			{
				oRels.Registration( pPair->m_key, pExt );
			}
		}
	}


	void IFileContainer::Commit  (const OOX::CPath& oPath)
	{
		CAtlMap<CString, size_t> mNamepair;

		POSITION pos = m_mContainer.GetStartPosition();
		while ( NULL != pos )
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.GetNext( pos );
			
			smart_ptr<OOX::File>     pFile = pPair->m_value;
			smart_ptr<OOX::External> pExt  = pFile.smart_dynamic_cast<OOX::External>();

			if (!pExt.IsInit())
			{
				OOX::CPath oDefDir = pFile->DefaultDirectory();
				OOX::CPath oName   = pFile->DefaultFileName();

				CAtlMap<CString, size_t>::CPair* pNamePair = mNamepair.Lookup( oName.m_strFilename );
				if (NULL == pNamePair)
					mNamepair.SetAt( oName.m_strFilename, 1 );
				else
					oName = oName + pNamePair->m_key;

				OOX::CSystemUtility::CreateDirectories( oPath / oDefDir );
				
				smart_ptr<OOX::IFileBuilder> pFileBuilder = pPair->m_value.smart_dynamic_cast<OOX::IFileBuilder>();
				if ( pFileBuilder.is_init() )
					pFileBuilder->Commit( oPath / oDefDir / oName );
			}
		}
	}


	void IFileContainer::Finalize(const OOX::CPath& oFileName, const OOX::CPath& oDirectory, OOX::CContentTypes& oContent)
	{
		OOX::CPath oCurrent = oFileName.GetDirectory();
		OOX::CRels oRels;

		Finalize( oRels, oCurrent, oDirectory, oContent );
		oRels.Write( oFileName );
	}	
	void IFileContainer::Finalize(OOX::CRels& oRels, const OOX::CPath& oCurrent, const OOX::CPath& oDir, OOX::CContentTypes& oContent)
	{
		CAtlMap<CString, size_t> mNamepair;

		POSITION pos = m_mContainer.GetStartPosition();
		while ( NULL != pos )
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.GetNext( pos );
			
			smart_ptr<OOX::File>     pFile = pPair->m_value;
			smart_ptr<OOX::External> pExt  = pFile.smart_dynamic_cast<OOX::External>();

			if ( !pExt.IsInit() )
			{
				OOX::CPath oDefDir = pFile->DefaultDirectory();
				OOX::CPath oName   = pFile->DefaultFileName();

				CAtlMap<CString, size_t>::CPair* pNamePair = mNamepair.Lookup( oName.m_strFilename );
				if ( NULL == pNamePair )
					mNamepair.SetAt( oName.m_strFilename, 1 );
				else
					oName = oName + pNamePair->m_key;

				OOX::CSystemUtility::CreateDirectories( oCurrent / oDefDir );				
				smart_ptr<OOX::IFileBuilder> pFileBuilder = pFile.smart_dynamic_cast<OOX::IFileBuilder>(); 
				if ( pFileBuilder.is_init() )
				{
					pFileBuilder->Finalize( oCurrent / oDefDir / oName, oDir / oDefDir, oContent );
				}
				else
				{
					pFile->write( oCurrent / oDefDir / oName, oDir / oDefDir, oContent );
				}

				oRels.Registration( pPair->m_key, pFile->type(), oDefDir / oName );
			}
			else
			{
				oRels.Registration( pPair->m_key, pExt );
			}
		}
	}


	void IFileContainer::ExtractPictures(const OOX::CPath& oPath) const
	{
		POSITION pos = m_mContainer.GetStartPosition();
		while ( NULL != pos )
		{
			smart_ptr<OOX::File> pFile  = m_mContainer.GetNextValue( pos );

			smart_ptr<Image>     pImage = pFile.smart_dynamic_cast<Image>();
			if ( pImage.is_init() )
			{
				pImage->copy_to( oPath );
				continue;
			}

			smart_ptr<IFileContainer> pExt = pFile.smart_dynamic_cast<IFileContainer>();
			if ( pExt.is_init() )
			{
				pExt->ExtractPictures( oPath );
				continue;
			}
		}
	}


	smart_ptr<Image>     IFileContainer::GetImage    (const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());
		if (NULL == pPair)
			return smart_ptr<Image>();
		return pPair->m_value.smart_dynamic_cast<Image>();
	}

	smart_ptr<HyperLink> IFileContainer::GetHyperlink(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());
		if (NULL == pPair)
			return smart_ptr<HyperLink>();
		return pPair->m_value.smart_dynamic_cast<HyperLink>();
	}

	smart_ptr<OleObject> IFileContainer::GetOleObject(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());
		if (NULL == pPair)
			return smart_ptr<OleObject>();
		return pPair->m_value.smart_dynamic_cast<OleObject>();
	}

	const bool IFileContainer::IsExist(const FileType& oType) const
	{
		POSITION pos = m_mContainer.GetStartPosition();
		while ( NULL != pos )
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.GetNext( pos );
			if ( oType == pPair->m_value->type() )
				return true;
		}
		return false;
	}
	const bool IFileContainer::IsExist(const RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());
		return ( NULL != pPair );
	}


	template<typename T>
	const bool IFileContainer::IsExist() const
	{
		T oFile;
		return IsExist( oFile.type() );
	}	
	const bool IFileContainer::IsExternal(const OOX::RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());

		if ( NULL != pPair )
		{
			CString sType = pPair->m_value->type().RelationType();
			CString sName = pPair->m_value->type().DefaultFileName().m_strFilename;
			
			return (( ( sType == OOX::FileTypes::ExternalAudio.RelationType() ) || ( sType == OOX::FileTypes::ExternalImage.RelationType() ) || ( sType == OOX::FileTypes::ExternalVideo.RelationType() ) ) && ( sName == _T("") ) );
		}
		return true;
	}


	smart_ptr<OOX::File> IFileContainer::Get(const FileType& oType)
	{
		POSITION pos = m_mContainer.GetStartPosition();
		while ( NULL != pos )
		{
			CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.GetNext( pos );
			if ( oType == pPair->m_value->type() )
				return pPair->m_value;
		}
		return smart_ptr<OOX::File>(new UnknowTypeFile( Unknown ));
	}


	const RId IFileContainer::Add(smart_ptr<OOX::File>& pFile)
	{
		const RId rId = GetMaxRId().next();
		Add( rId, pFile );
		return rId;
	}


	void      IFileContainer::Add(const OOX::RId& rId, const smart_ptr<OOX::File>& pFile)
	{
		m_lMaxRid = max( m_lMaxRid, rId.getNumber() );
		m_mContainer.SetAt( rId.get(), pFile );
	}
	smart_ptr<OOX::File> IFileContainer::Find(const FileType& oType) const
	{
		POSITION pos = m_mContainer.GetStartPosition();
		while ( NULL != pos )
		{
			const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.GetNext( pos );
			if ( oType == pPair->m_value->type() )
				return pPair->m_value;
		}
		return smart_ptr<OOX::File>( (OOX::File*)new UnknowTypeFile() );
	}

	smart_ptr<OOX::File> IFileContainer::Find(const OOX::RId& rId) const
	{
		const CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());
		if ( NULL != pPair )
			return pPair->m_value;

		return smart_ptr<OOX::File>( (OOX::File*)new UnknowTypeFile() );
	}


	template<typename T>
	T&                   IFileContainer::Find()
	{
		T oFile;
		return dynamic_cast<T&>( Find( oFile.type() ) );
	}	
	smart_ptr<OOX::File> IFileContainer::operator [](const OOX::RId rId)
	{
		CAtlMap<CString, smart_ptr<OOX::File>>::CPair* pPair = m_mContainer.Lookup(rId.get());
		if ( NULL != pPair )
			return pPair->m_value;

		return smart_ptr<OOX::File>( (OOX::File*)new UnknowTypeFile() );
	}


	smart_ptr<OOX::File> IFileContainer::operator [](const FileType& oType)
	{
		return Find( oType );
	}

	const RId IFileContainer::GetMaxRId()
	{
		++m_lMaxRid;
		return RId( m_lMaxRid );
	}





} // namespace OOX