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
#ifndef PPTX_LOGIC_GEOMETRY_INCLUDE_H_
#define PPTX_LOGIC_GEOMETRY_INCLUDE_H_

#include "./../WrapperWritingElement.h"
#include "PrstGeom.h"
#include "CustGeom.h"

namespace PPTX
{
	namespace Logic
	{

		class Geometry : public WrapperWritingElement
		{
		public:
			PPTX_LOGIC_BASE(Geometry)

		public:
			virtual void fromXML(XmlUtils::CXmlNode& node)
			{
				CString strName = XmlUtils::GetNameNoNS(node.GetName());
				
				if (strName == _T("prstGeom"))
					m_geometry.reset(new Logic::PrstGeom(node));
				else if (strName == _T("custGeom"))
					m_geometry.reset(new Logic::CustGeom(node));
				else m_geometry.reset();
			}

			virtual void GetGeometryFrom(XmlUtils::CXmlNode& element)
			{
				XmlUtils::CXmlNode oNode;
				if (element.GetNode(_T("a:prstGeom"), oNode))
					m_geometry.reset(new Logic::PrstGeom(oNode));
				else if (element.GetNode(_T("a:custGeom"), oNode))
					m_geometry.reset(new Logic::CustGeom(oNode));
				else m_geometry.reset();
			}
			virtual CString toXML() const
			{
				if (m_geometry.IsInit())
					return m_geometry->toXML();
				return _T("");
			}
			virtual void toXmlWriter(NSBinPptxRW::CXmlWriter* pWriter) const
			{
				if (m_geometry.is_init())
					m_geometry->toXmlWriter(pWriter);
			}

			virtual void toPPTY(NSBinPptxRW::CBinaryFileWriter* pWriter) const
			{
				if (m_geometry.is_init())
					m_geometry->toPPTY(pWriter);
			}
			virtual void fromPPTY(NSBinPptxRW::CBinaryFileReader* pReader)
			{
				LONG _end_rec = pReader->GetPos() + pReader->GetLong() + 4;

				if (pReader->GetPos() < _end_rec)
				{
					BYTE _t = pReader->GetUChar();

					if (GEOMETRY_TYPE_PRST == _t)
					{
						
						LONG _e = pReader->GetPos() + pReader->GetLong() + 4;
						pReader->Skip(1); 

						Logic::PrstGeom* pGeom = new Logic::PrstGeom();

						while (true)
						{
							BYTE _at = pReader->GetUChar();
							if (_at == NSBinPptxRW::g_nodeAttributeEnd)
								break;

							if (0 == _at)
								pGeom->prst.set(pReader->GetString2());								
							else
								break;
						}

						while (pReader->GetPos() < _e)
						{
							BYTE _at = pReader->GetUChar();
							switch (_at)
							{
								case 0:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;
									ULONG _c = pReader->GetULong();

									for (ULONG i = 0; i < _c; ++i)
									{
										pReader->Skip(1);
										pGeom->avLst.Add();
										pGeom->avLst[i].fromPPTY(pReader);
									}

									pReader->Seek(_end_rec2);
									break;
								}
								default:
									break;
							}
						}

						m_geometry.reset(pGeom);
					}
					else if (GEOMETRY_TYPE_CUSTOM == _t)
					{
						LONG _e = pReader->GetPos() + pReader->GetLong() + 4;
						
						Logic::CustGeom* pGeom = new Logic::CustGeom();
						while (pReader->GetPos() < _e)
						{
							BYTE _at = pReader->GetUChar();
							switch (_at)
							{
								case 0:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;
									ULONG _c = pReader->GetULong();

									for (ULONG i = 0; i < _c; ++i)
									{
										pReader->Skip(1);
										pGeom->avLst.Add();
										pGeom->avLst[i].fromPPTY(pReader);
									}

									pReader->Seek(_end_rec2);
									break;
								}
								case 1:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;
									ULONG _c = pReader->GetULong();

									for (ULONG i = 0; i < _c; ++i)
									{
										pReader->Skip(1);
										pGeom->gdLst.Add();
										pGeom->gdLst[i].fromPPTY(pReader);
									}

									pReader->Seek(_end_rec2);
									break;
								}
								case 2:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;
									ULONG _c = pReader->GetULong();

									for (ULONG i = 0; i < _c; ++i)
									{
										BYTE _type1 = pReader->GetUChar();
										pReader->Skip(4); 
										BYTE _type = pReader->GetUChar();
										pReader->Skip(5); 

										if (1 == _type)
										{
											Logic::AhPolar* p = new Logic::AhPolar();
											while (true)
											{
												BYTE _at2 = pReader->GetUChar();
												if (_at2 == NSBinPptxRW::g_nodeAttributeEnd)
													break;

												switch (_at2)
												{
												case 0: p->x = pReader->GetString2(); break;
												case 1: p->y = pReader->GetString2(); break;
												case 2: p->gdRefAng = pReader->GetString2(); break;
												case 3: p->gdRefR = pReader->GetString2(); break;
												case 4: p->maxAng = pReader->GetString2(); break;
												case 5: p->maxR = pReader->GetString2(); break;
												case 6: p->minAng = pReader->GetString2(); break;
												case 7: p->minR = pReader->GetString2(); break;
												default:
													break;
												}
											}
											pGeom->ahLst.Add();
											pGeom->ahLst[i].ah.reset(p);
										}
										else
										{
											Logic::AhXY* p = new Logic::AhXY();
											while (true)
											{
												BYTE _at2 = pReader->GetUChar();
												if (_at2 == NSBinPptxRW::g_nodeAttributeEnd)
													break;

												switch (_at2)
												{
												case 0: p->x = pReader->GetString2(); break;
												case 1: p->y = pReader->GetString2(); break;
												case 2: p->gdRefX = pReader->GetString2(); break;
												case 3: p->gdRefY = pReader->GetString2(); break;
												case 4: p->maxX = pReader->GetString2(); break;
												case 5: p->maxY = pReader->GetString2(); break;
												case 6: p->minX = pReader->GetString2(); break;
												case 7: p->minY = pReader->GetString2(); break;
												default:
													break;
												}
											}
											pGeom->ahLst.Add();
											pGeom->ahLst[i].ah.reset(p);
										}
									}

									pReader->Seek(_end_rec2);
									break;
								}
								case 3:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;

									ULONG _c = pReader->GetULong();

									for (ULONG i = 0; i < _c; ++i)
									{
										BYTE _type = pReader->GetUChar();
										pReader->Skip(5); 

										pGeom->cxnLst.Add();
										while (true)
										{
											BYTE _at2 = pReader->GetUChar();
											if (_at2 == NSBinPptxRW::g_nodeAttributeEnd)
												break;

											switch (_at2)
											{
											case 0:
												pGeom->cxnLst[i].x = pReader->GetString2();
												break;
											case 1:
												pGeom->cxnLst[i].y = pReader->GetString2();
												break;
											case 2:
												pGeom->cxnLst[i].ang = pReader->GetString2();
												break;
											default:
												break;
											}											
										}										
									}

									pReader->Seek(_end_rec2);
									break;
								}
								case 4:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;
									ULONG _c = pReader->GetULong();

									for (ULONG i = 0; i < _c; ++i)
									{
										BYTE _type = pReader->GetUChar();
										pGeom->pathLst.Add();
										pGeom->pathLst[i].fromPPTY(pReader);
									}

									pReader->Seek(_end_rec2);
									break;
								}
								case 5:
								{
									LONG _end_rec2 = pReader->GetPos() + pReader->GetLong() + 4;

									pReader->Skip(1); 

									pGeom->rect = new Logic::Rect();
									pGeom->rect->m_name = _T("a:rect");
									pGeom->rect->l = _T("l");
									pGeom->rect->t = _T("t");
									pGeom->rect->r = _T("r");
									pGeom->rect->b = _T("b");
									while (true)
									{
										BYTE _at2 = pReader->GetUChar();
										if (_at2 == NSBinPptxRW::g_nodeAttributeEnd)
											break;

										switch (_at2)
										{
										case 0:
											pGeom->rect->l = pReader->GetString2();
											break;
										case 1:
											pGeom->rect->t = pReader->GetString2();
											break;
										case 2:
											pGeom->rect->r = pReader->GetString2();
											break;
										case 3:
											pGeom->rect->b = pReader->GetString2();
											break;
										default:
											break;
										}
									}

									pReader->Seek(_end_rec2);
									break;
								}
								default:
									break;
							}
						}

						m_geometry.reset(pGeom);
					}
				}

				pReader->Seek(_end_rec);
			}

			virtual bool is_init() const {return (m_geometry.IsInit());};

			template<class T> AVSINLINE const bool	is() const	{ return m_geometry.is<T>(); }
			template<class T> AVSINLINE T&			as()		{ return m_geometry.as<T>(); }
			template<class T> AVSINLINE const T&	as() const 	{ return m_geometry.as<T>(); }
		
		private:
			smart_ptr<WrapperWritingElement> m_geometry;
		protected:
			virtual void FillParentPointersForChilds(){};
		public:
			virtual void SetParentPointer(const WrapperWritingElement* pParent)
			{
				if(is_init())
					m_geometry->SetParentPointer(pParent);
			};

#ifdef AVS_USE_CONVERT_PPTX_TOCUSTOM_VML
			void ConvertToCustomVML(IASCRenderer* punkRenderer, CString& strPath, CString& strRect, LONG& lWidth, LONG& lHeight);
#endif
		};
	} 
} 

#endif 
