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
 #include "oMathPara.h"





namespace OOX
{	
	namespace Logic
	{
		void    CMathArgNodes::fromXML(XmlUtils::CXmlLiteReader& oReader)
		{
			sNodeName = oReader.GetName();				
			if(sNodeName == _T("m:deg"))
					eType = et_m_deg;
				else if (sNodeName == _T("m:den"))
					eType = et_m_den;
				else if (sNodeName == _T("m:e"))
					eType = et_m_e;
				else if (sNodeName == _T("m:fName"))
					eType = et_m_fName;
				else if (sNodeName == _T("m:lim"))
					eType = et_m_lim;
				else if (sNodeName == _T("m:num"))
					eType = et_m_num;
				else if (sNodeName == _T("m:oMath"))
					eType = et_m_oMath;
				else if (sNodeName == _T("m:sub"))
					eType = et_m_sub;
				else if (sNodeName == _T("m:sup"))
					eType = et_m_sup;
				else
					eType = et_Unknown;

			if ( oReader.IsEmptyNode())
				return;

			int nParentDepth = oReader.GetDepth();
			while( oReader.ReadNextSiblingNode( nParentDepth ) )
			{
				CWCharWrapper sName = oReader.GetName();
				WritingElement *pItem = NULL;

				if ( _T("m:acc") == sName )
					pItem = new OOX::Logic::CAcc( oReader );
				else if ( _T("m:argPr") == sName )
					pItem = new OOX::Logic::CArgPr( oReader );
				else if ( _T("m:bar") == sName )
					pItem = new OOX::Logic::CBar( oReader );
				else if ( _T("w:bookmarkEnd") == sName )
					pItem = new OOX::Logic::CBookmarkEnd( oReader );
				else if ( _T("w:bookmarkStart") == sName )
					pItem = new OOX::Logic::CBookmarkStart( oReader );
				else if ( _T("m:borderBox") == sName )
					pItem = new OOX::Logic::CBorderBox( oReader );
				else if ( _T("m:box") == sName )
					pItem = new OOX::Logic::CBox( oReader );
				else if ( _T("w:commentRangeEnd") == sName )
					pItem = new OOX::Logic::CCommentRangeEnd( oReader );
				else if ( _T("w:commentRangeStart") == sName )
					pItem = new OOX::Logic::CCommentRangeStart( oReader );
				else if ( _T("m:ctrlPr") == sName )
					pItem = new OOX::Logic::CCtrlPr( oReader );
				else if ( _T("w:customXmlDelRangeEnd") == sName ) 
					pItem = new OOX::Logic::CCustomXmlDelRangeEnd( oReader );
				else if ( _T("w:customXmlDelRangeStart") == sName )
					pItem = new OOX::Logic::CCustomXmlDelRangeStart( oReader );
				else if ( _T("w:customXmlInsRangeEnd") == sName )
					pItem = new OOX::Logic::CCustomXmlInsRangeEnd( oReader );
				else if ( _T("w:customXmlInsRangeStart") == sName )
					pItem = new OOX::Logic::CCustomXmlInsRangeStart( oReader );
				else if ( _T("w:customXmlMoveFromRangeEnd") == sName )
					pItem = new OOX::Logic::CCustomXmlMoveFromRangeEnd( oReader );
				else if ( _T("w:customXmlMoveFromRangeStart") == sName )
					pItem = new OOX::Logic::CCustomXmlMoveFromRangeStart( oReader );
				else if ( _T("w:customXmlMoveToRangeEnd") == sName )
					pItem = new OOX::Logic::CCustomXmlMoveToRangeEnd( oReader );
				else if ( _T("w:customXmlMoveToRangeStart") == sName )
					pItem = new OOX::Logic::CCustomXmlMoveToRangeStart( oReader );
				else if ( _T("m:d") == sName )
					pItem = new OOX::Logic::CDelimiter( oReader );
				else if ( _T("w:del") == sName )
					pItem = new CDel( oReader );
				else if ( _T("m:eqArr") == sName )
					pItem = new OOX::Logic::CEqArr( oReader );
				else if ( _T("m:f") == sName )
					pItem = new OOX::Logic::CFraction( oReader );
				else if ( _T("m:func") == sName )
					pItem = new OOX::Logic::CFunc( oReader );
				else if ( _T("m:groupChr") == sName )
					pItem = new CGroupChr( oReader );
				else if ( _T("w:ins") == sName )
					pItem = new CIns( oReader );
				else if ( _T("m:limLow") == sName )
					pItem = new OOX::Logic::CLimLow( oReader );
				else if ( _T("m:limUpp") == sName )
					pItem = new OOX::Logic::CLimUpp( oReader );
				else if ( _T("m:m") == sName )
					pItem = new OOX::Logic::CMatrix( oReader );
				
				
				else if ( _T("w:moveFromRangeEnd") == sName )
					pItem = new OOX::Logic::CMoveFromRangeEnd( oReader );
				else if ( _T("w:moveFromRangeStart") == sName )
					pItem = new OOX::Logic::CMoveFromRangeStart( oReader );
				
				
				else if ( _T("w:moveToRangeEnd") == sName )
					pItem = new OOX::Logic::CMoveToRangeEnd( oReader );
				else if ( _T("w:moveToRangeStart") == sName )
					pItem = new OOX::Logic::CMoveToRangeStart( oReader );
				else if ( _T("m:nary") == sName )
					pItem = new OOX::Logic::CNary( oReader );
				else if ( _T("m:oMath") == sName )
					pItem = new OOX::Logic::COMath( oReader );
				else if ( _T("m:oMathPara") == sName )
					pItem = new OOX::Logic::COMathPara( oReader );
				else if ( _T("w:permEnd") == sName )
					pItem = new OOX::Logic::CPermEnd( oReader );
				else if ( _T("w:permStart") == sName )
					pItem = new OOX::Logic::CPermStart( oReader );
				else if ( _T("m:phant") == sName )
					pItem = new OOX::Logic::CPhant( oReader );
				else if ( _T("w:proofErr") == sName )
					pItem = new OOX::Logic::CProofErr( oReader );
				else if ( _T("m:r") == sName )
					pItem = new OOX::Logic::CMRun( oReader );
				else if ( _T("m:rad") == sName )
					pItem = new OOX::Logic::CRad( oReader );
				else if ( _T("m:sPre") == sName )
					pItem = new OOX::Logic::CSPre( oReader );
				else if ( _T("m:sSub") == sName )
					pItem = new OOX::Logic::CSSub( oReader );
				else if ( _T("m:sSubSup") == sName )
					pItem = new OOX::Logic::CSSubSup( oReader );
				else if ( _T("m:sSup") == sName )
					pItem = new OOX::Logic::CSSup( oReader );

				if ( pItem )
					m_arrItems.Add( pItem );
			}
		}
	}
}//namespace OOX