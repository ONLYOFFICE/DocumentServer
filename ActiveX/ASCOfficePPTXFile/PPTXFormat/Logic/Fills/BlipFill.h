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
#ifndef PPTX_LOGIC_BLIPFILL_INCLUDE_H_
#define PPTX_LOGIC_BLIPFILL_INCLUDE_H_

#include "./../../WrapperWritingElement.h"
#include "./../Rect.h"
#include "Blip.h"
#include "Tile.h"
#include "Stretch.h"
#include "../Effects/AlphaModFix.h"

namespace PPTX
{
	namespace Logic
	{

		class BlipFill : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(BlipFill)

			BlipFill& operator=(const BlipFill& oSrc)
			{
				parentFile		= oSrc.parentFile;
				parentElement	= oSrc.parentElement;
				
				blip			= oSrc.blip;
				srcRect			= oSrc.srcRect;
				tile			= oSrc.tile;
				stretch			= oSrc.stretch;

				dpi				= oSrc.dpi;
				rotWithShape	= oSrc.rotWithShape;

				m_namespace = oSrc.m_namespace;
				return *this;
			}

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				m_namespace = XmlUtils::GetNamespace(node.GetName());

				node.ReadAttributeBase(L"dpi", dpi);
				node.ReadAttributeBase(L"rotWithShape", rotWithShape);

				XmlUtils::CXmlNodes oNodes;
				if (node.GetNodes(_T("*"), oNodes))
				{
					int nCount = oNodes.GetCount();
					for (int i = 0; i < nCount; ++i)
					{
						XmlUtils::CXmlNode oNode;
						oNodes.GetAt(i, oNode);

						CString strName = XmlUtils::GetNameNoNS(oNode.GetName());
						if (_T("blip") == strName)
						{
							if (!blip.IsInit())	
								blip = oNode;
						}
						else if (_T("srcRect") == strName)
						{
							if (!srcRect.IsInit())	
								srcRect = oNode;
						}
						else if (_T("tile") == strName)
						{
							if (!tile.IsInit())	
								tile = oNode;
						}
						else if (_T("stretch") == strName)
						{
							if (!stretch.IsInit())	
								stretch = oNode;
						}
					}
				}

				FillParentPointersForChilds();
			}

			virtual CString toXML() const
			{
				XmlUtils::CAttribute oAttr;
				oAttr.Write(_T("dpi"), dpi);
				oAttr.Write(_T("rotWithShape"), rotWithShape);

				XmlUtils::CNodeValue oValue;
				oValue.WriteNullable(blip);
				oValue.WriteNullable(srcRect);
				oValue.WriteNullable(tile);
				oValue.WriteNullable(stretch);

				CString strName = (_T("") == m_namespace) ? _T("blipFill") : (m_namespace + _T(":blipFill"));
				return XmlUtils::CreateNode(strName, oAttr, oValue);
			}

			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				CString strName = (_T("") == m_namespace) ? _T("blipFill") : (m_namespace + _T(":blipFill"));
				pWriter->StartNode(strName);

				pWriter->StartAttributes();
				pWriter->WriteAttribute(_T("dpi"), dpi);
				pWriter->WriteAttribute(_T("rotWithShape"), rotWithShape);
				pWriter->EndAttributes();

				pWriter->Write(blip);
				
				if (srcRect.is_init())
				{
					pWriter->StartNode(_T("a:srcRect"));

					pWriter->StartAttributes();
					pWriter->WriteAttribute(_T("l"), srcRect->l);
					pWriter->WriteAttribute(_T("t"), srcRect->t);
					pWriter->WriteAttribute(_T("r"), srcRect->r);
					pWriter->WriteAttribute(_T("b"), srcRect->b);
					pWriter->EndAttributes();

					pWriter->EndNode(_T("a:srcRect"));
				}

				pWriter->Write(tile);
				pWriter->Write(stretch);

				pWriter->EndNode(strName);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				pWriter->StartRecord(FILL_TYPE_BLIP);

				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeStart);
				pWriter->WriteInt2(0, dpi);
				pWriter->WriteBool2(1, rotWithShape);
				pWriter->WriteBYTE(NSBinPptxRW::g_nodeAttributeEnd);

				pWriter->WriteRecord2(0, blip);
				pWriter->WriteRecord2(1, srcRect);
				pWriter->WriteRecord2(2, tile);
				pWriter->WriteRecord2(3, stretch);

				pWriter->EndRecord();
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				pReader->Skip(4); 
				BYTE _type = pReader->GetUChar(); 
				LONG _e = pReader->GetPos() + pReader->GetLong() + 4;

				pReader->Skip(1);

				while (true)
				{
					BYTE _at = pReader->GetUChar();
					if (_at == NSBinPptxRW::g_nodeAttributeEnd)
						break;

					switch (_at)
					{
						case 0:
							dpi = pReader->GetLong();
							break;
						case 1:
							rotWithShape = pReader->GetBool();
							break;
						default:
							break;
					}
				}

				while (pReader->GetPos() < _e)
				{
					BYTE rec = pReader->GetUChar();

					switch (rec)
					{
						case 0:
						{
							LONG _s2 = pReader->GetPos();
							LONG _e2 = _s2 + pReader->GetLong() + 4;

							pReader->Skip(1);

							while (true)
							{
								BYTE _at = pReader->GetUChar();
								if (NSBinPptxRW::g_nodeAttributeEnd == _at)
									break;

								if (_at == 0)
									pReader->Skip(1);
							}

							while (pReader->GetPos() < _e2)
							{
								BYTE _t = pReader->GetUChar();

								switch (_t)
								{
									case 0:
									case 1:
									{
										
										pReader->Skip(4);
										break;
									}
									case 10:
									case 11:
									{
										
										pReader->GetString2();
										break;
									}
									case 2:
									{
										pReader->Skip(4);
										ULONG count_effects = pReader->GetULong();
										for (ULONG _eff = 0; _eff < count_effects; ++_eff)
										{
											pReader->Skip(1); 
											ULONG rec_len = pReader->GetULong();
											if (0 == rec_len)
												continue;
											
											BYTE rec = pReader->GetUChar();
											
											if (rec == EFFECT_TYPE_ALPHAMODFIX)
											{
												
												LONG _e22 = pReader->GetPos() + pReader->GetLong() + 4;

												pReader->Skip(1); 

												PPTX::Logic::AlphaModFix* pEffect = new PPTX::Logic::AlphaModFix();
												while (true)
												{
													BYTE _at = pReader->GetUChar();
													if (NSBinPptxRW::g_nodeAttributeEnd == _at)
														break;

													if (_at == 0)
														pEffect->amt = pReader->GetLong();
												}

												if (!blip.is_init())
													blip = new PPTX::Logic::Blip();

												blip->Effects.Add();
												blip->Effects[0].InitPointer(pEffect);

												pReader->Seek(_e22);
											}
											else
											{
												pReader->SkipRecord();
											}
										}
										break;
									}
									case 3:
									{
										pReader->Skip(6); 

										
										CString strUrl = pReader->GetString2();
										CString strTempFile = _T("");
										CString strOrigBase64 = _T("");

										if (0 == strUrl.Find(_T("data:")))
										{
											strOrigBase64 = strUrl;
											int nFind = strUrl.Find(_T(","));
											strUrl.Delete(0, nFind + 1);

											CStringA __s = (CStringA)strUrl;
											int len = __s.GetLength();
											int dstLenTemp = Base64DecodeGetRequiredLength(len);

											BYTE* pDstBuffer = new BYTE[dstLenTemp];
											int dstLen = dstLenTemp;
											Base64Decode(__s.GetBuffer(), len, pDstBuffer, &dstLen);

											strTempFile = pReader->m_strFolder + _T("\\media\\temp.jpg");
											CFile oTempFile;
											oTempFile.CreateFile(strTempFile);
											oTempFile.WriteFile((void*)pDstBuffer, (DWORD)dstLen);
											oTempFile.CloseFile();
											
											strUrl = strTempFile;
											RELEASEARRAYOBJECTS(pDstBuffer);
										}
										else
										{
											if (0 != strUrl.Find(_T("http:")) &&
												0 != strUrl.Find(_T("https:")) &&
												0 != strUrl.Find(_T("ftp:")) &&
												0 != strUrl.Find(_T("file:")))
											{
												if (0 == strUrl.Find(_T("theme")))
												{
													strUrl = pReader->m_strFolderThemes + _T("\\") + strUrl;
												}
												else
												{
													strUrl = pReader->m_strFolder + _T("\\media\\") + strUrl;
												}
											}
										}
										
										
										LONG lId = pReader->m_oRels.WriteImage(strUrl, strOrigBase64);

										
										if (strTempFile != _T(""))
										{
											::DeleteFile(strTempFile);
										}
										

										if (!blip.is_init())
											blip = new PPTX::Logic::Blip();

										blip->embed = new OOX::RId((size_t)lId);

										pReader->Skip(1); 
										break;
									}
									default:
									{
										pReader->SkipRecord();
										break;
									}
								}
							}

							pReader->Seek(_e2);
							break;
						}
						case 1:
						{
							srcRect = new PPTX::Logic::Rect();
							srcRect->fromPPTY(pReader);							
							break;
						}
						case 2:
						{
							tile = new PPTX::Logic::Tile();
							pReader->SkipRecord();
							break;
						}
						case 3:
						{
							stretch = new PPTX::Logic::Stretch();
							pReader->SkipRecord();
							break;
						}
						default:
						{
							
							pReader->SkipRecord();
						}
					}
				}

				pReader->Seek(_e);
			}

		public:
			nullable<Blip>		blip;
			nullable<Rect>		srcRect;
			nullable<Tile>		tile;
			nullable<Stretch>	stretch;

			nullable_int		dpi;
			nullable_bool		rotWithShape;

			mutable CString m_namespace;
		protected:
			virtual void FillParentPointersForChilds()
			{
				if(blip.IsInit())
					blip->SetParentPointer(this);
				if(srcRect.IsInit())
					srcRect->SetParentPointer(this);
				if(tile.IsInit())
					tile->SetParentPointer(this);
				if(stretch.IsInit())
					stretch->SetParentPointer(this);
			}

			AVSINLINE void Normalize()
			{
				dpi.normalize_positive();
			}
		};
	} 
} 

#endif // PPTX_LOGIC_BLIPFILL_INCLUDE_H_