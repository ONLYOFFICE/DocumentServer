/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Copyright (C) 2006
 * Miha Vrhovnik (http://simail.sf.net, http://xcollect.sf.net)
 * All Rights Reserved.
 *
 * Contributor(s):
 * 
 *  
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** **/
#include "hunspelldll.h"
#include <windows.h>

#include <stdio.h>
#include <stdlib.h>
#include <cstring>
#include <cstdlib>
#include <cstdio>

LIBHUNSPELL_DLL_EXPORTED void * hunspell_initialize(char *aff_file, char *dict_file)
{
    Hunspell * pMS = new Hunspell(aff_file, dict_file);
    return pMS;
}

LIBHUNSPELL_DLL_EXPORTED void * hunspell_initialize_key(char *aff_file, char *dict_file, char * key)
{
    Hunspell * pMS = new Hunspell(aff_file, dict_file, key);
    return pMS;
}

LIBHUNSPELL_DLL_EXPORTED void hunspell_uninitialize(Hunspell *pMS)
{
    delete pMS;
}

LIBHUNSPELL_DLL_EXPORTED int hunspell_spell(Hunspell *pMS, char *word)
{
    return pMS->spell(word);
}

LIBHUNSPELL_DLL_EXPORTED int hunspell_suggest(Hunspell *pMS, char *word, char ***slst)
{
    return pMS->suggest(slst, word);
}

#ifdef HUNSPELL_EXPERIMENTAL
LIBHUNSPELL_DLL_EXPORTED int hunspell_suggest_auto(Hunspell *pMS, char *word, char ***slst)
{
    return pMS->suggest_auto(slst, word);
}
#endif

LIBHUNSPELL_DLL_EXPORTED void hunspell_free_list(Hunspell *pMS, char ***slst, int len)
{
    pMS->free_list(slst, len);
}

// deprecated (use hunspell_free_list)
LIBHUNSPELL_DLL_EXPORTED void hunspell_suggest_free(Hunspell *pMS, char **slst, int len)
{
    for (int i = 0; i < len; i++) {
        free(slst[i]);
    }
}

LIBHUNSPELL_DLL_EXPORTED char * hunspell_get_dic_encoding(Hunspell *pMS)
{
    return pMS->get_dic_encoding();
}

LIBHUNSPELL_DLL_EXPORTED int hunspell_add(Hunspell *pMS, char *word)
{
    return pMS->add(word);
}

LIBHUNSPELL_DLL_EXPORTED int hunspell_add_with_affix(Hunspell *pMS, char *word, char *modelword)
{
    return pMS->add_with_affix(word, modelword);
}

BOOL APIENTRY DllMain (HINSTANCE hInst     /* Library instance handle. */ ,
                       DWORD reason        /* Reason this function is being called. */ ,
                       LPVOID reserved     /* Not used. */ )
{
    switch (reason)
    {
      case DLL_PROCESS_ATTACH:
        break;

      case DLL_PROCESS_DETACH:
        break;

      case DLL_THREAD_ATTACH:
        break;

      case DLL_THREAD_DETACH:
        break;
    }

    /* Returns TRUE on success, FALSE on failure */
    return TRUE;
}
