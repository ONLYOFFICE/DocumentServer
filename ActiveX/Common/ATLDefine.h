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
 #ifndef ATLDEFINE_H_DEFINE
#define ATLDEFINE_H_DEFINE

#if _MSC_VER >= 1000
#pragma once
#endif 


#define LINK_PROPERTY_LONG(propName, memberName)\
	STDMETHOD(get_##propName##)(long* pVal)\
	{\
		*pVal = ##memberName##;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(long newVal)\
	{\
		##memberName## = newVal;\
		return S_OK;\
	}
#define LINK_PROPERTY_SHORT(propName, memberName)\
	STDMETHOD(get_##propName##)(SHORT* pVal)\
	{\
		*pVal = ##memberName##;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(SHORT newVal)\
	{\
		##memberName## = newVal;\
		return S_OK;\
	}
#define LINK_PROPERTY_BOOL(propName, memberName)\
	STDMETHOD(get_##propName##)(VARIANT_BOOL* pVal)\
	{\
		*pVal = ##memberName## ? VARIANT_TRUE : VARIANT_FALSE;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(VARIANT_BOOL newVal)\
	{\
		##memberName## = (VARIANT_FALSE!=newVal);\
		return S_OK;\
	}
#define LINK_PROPERTY_VARIANT_BOOL(propName, memberName)\
	STDMETHOD(get_##propName##)(VARIANT_BOOL* pVal)\
	{\
		*pVal = ##memberName## ? VARIANT_TRUE : VARIANT_FALSE;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(VARIANT_BOOL newVal)\
	{\
		##memberName## = (VARIANT_FALSE!=newVal)?VARIANT_TRUE : VARIANT_FALSE;\
		return S_OK;\
	}
#define LINK_PROPERTY_ULONG(propName, memberName)\
	STDMETHOD(get_##propName##)(ULONG* pVal)\
	{\
		*pVal = ##memberName##;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(ULONG newVal)\
	{\
		##memberName## = newVal;\
		return S_OK;\
	}
#define LINK_PROPERTY_USHORT(propName, memberName)\
	STDMETHOD(get_##propName##)(USHORT* pVal)\
	{\
		*pVal = ##memberName##;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(USHORT newVal)\
	{\
		##memberName## = newVal;\
		return S_OK;\
	}
#define LINK_PROPERTY_BSTR(propName, memberName)\
	STDMETHOD(get_##propName##)(BSTR* pVal)\
	{\
		*pVal = ##memberName##.AllocSysString();\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(BSTR newVal)\
	{\
		##memberName## = newVal;\
		return S_OK;\
	}
#define LINK_PROPERTY_DOUBLE(propName, memberName)\
	STDMETHOD(get_##propName##)(double* pVal)\
	{\
		*pVal = ##memberName##;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(double newVal)\
	{\
		##memberName## = newVal;\
		return S_OK;\
	}

#define LINK_PROPERTY_SAFEARRAY(propName, memberName)\
	STDMETHOD(get_##propName##)(LPSAFEARRAY* pVal)\
	{\
		*pVal = NULL;\
		if (NULL!=##memberName##)\
		{\
			SAFEARRAYBOUND rgsaBound[1];\
			rgsaBound[0].lLbound = 0;\
			rgsaBound[0].cElements = ##memberName##->rgsabound[0].cElements;\
			*pVal = SafeArrayCreate(VT_UI1, 1, rgsaBound);\
			memcpy((*pVal)->pvData, ##memberName##->pvData, ##memberName##->rgsabound[0].cElements);\
		}\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(LPSAFEARRAY newVal)\
	{\
		RELEASEARRAY(##memberName##);\
		if (NULL!=newVal)\
		{\
			SAFEARRAYBOUND rgsaBound[1];\
			rgsaBound[0].lLbound = 0;\
			rgsaBound[0].cElements = newVal->rgsabound[0].cElements;\
			##memberName## = SafeArrayCreate(VT_UI1, 1, rgsaBound);\
			if (NULL==##memberName##)\
				return S_FALSE;\
			memcpy(##memberName##->pvData, newVal->pvData, newVal->rgsabound->cElements);\
		}\
		return S_OK;\
	}

#define LINK_PROPERTY_ARRAY_LONG(propName, arrayName, memberName)\
	STDMETHOD(get_##propName##)(long Index, long* pVal)\
	{\
		if ((0>Index)||(Index>=(long)##arrayName##.GetCount()))\
			return S_OK;\
		*pVal = ##arrayName##[Index].##memberName##;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(long Index, long newVal)\
	{\
		if ((0>Index)||(Index>=(long)##arrayName##.GetCount()))\
			return S_OK;\
		##arrayName##[Index].##memberName## = newVal;\
		return S_OK;\
	}
#define LINK_PROPERTY_ARRAY_BOOL(propName, arrayName, memberName)\
	STDMETHOD(get_##propName##)(long Index, VARIANT_BOOL* pVal)\
	{\
		if ((0>Index)||(Index>=(long)##arrayName##.GetCount()))\
			return S_OK;\
		*pVal = ##arrayName##[Index].##memberName## ? VARIANT_TRUE : VARIANT_FALSE;\
		return S_OK;\
	}\
	STDMETHOD(put_##propName##)(long Index, VARIANT_BOOL newVal)\
	{\
		if ((0>Index)||(Index>=(long)##arrayName##.GetCount()))\
			return S_OK;\
		##arrayName##[Index].##memberName## = (VARIANT_FALSE!=newVal);\
		return S_OK;\
	}


#define ADDREFINTERFACE(pinterface)\
{\
	if (pinterface!=NULL)\
	{\
		pinterface->AddRef();\
	}\
}
#define RELEASEINTERFACE(pinterface)\
{\
	if (pinterface!=NULL)\
	{\
		pinterface->Release();\
		pinterface=NULL;\
	}\
}
#define RELEASEMEM(pobject)\
{\
	if (pobject!=NULL)\
	{\
		free(pobject);\
		pobject=NULL;\
	}\
}
#define RELEASEOBJECT(pobject)\
{\
	if (pobject!=NULL)\
	{\
		delete pobject;\
		pobject=NULL;\
	}\
}
#define RELEASEARRAYOBJECTS(pobject)\
{\
	if (pobject!=NULL)\
	{\
		delete []pobject;\
		pobject=NULL;\
	}\
}
#define RELEASEHEAP(pmem)\
{\
	if (pmem!=NULL)\
	{\
		HeapFree(GetProcessHeap(), 0, pmem);\
		pmem=NULL;\
	}\
}
#define RELEASEARRAY(parray)\
{\
	if (parray!=NULL)\
	{\
		SafeArrayDestroy(parray);\
		parray=NULL;\
	}\
}
#define RELEASESYSSTRING(pstring)\
{\
	if (pstring!=NULL)\
	{\
		SysFreeString(pstring);\
		pstring=NULL;\
	}\
}
#define RELEASEHANDLE(phandle)\
{\
	if (phandle!=NULL)\
	{\
		CloseHandle(phandle);\
		phandle=NULL;\
	}\
}
#endif //ATLDEFINE