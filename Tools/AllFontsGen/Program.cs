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
 using System;
using System.IO;
using System.Collections.Generic;
using System.Text;

namespace AllFontsGen
{
    class Program
    {
        static void Main(string[] args)
        {

            string sDirectory = "";
            string sDstFile = "";

            if (args.Length == 0)
            {
                System.Console.Write("Error: Incorrect argument number!\n");
                System.Console.Write("Use:\n");
                System.Console.Write("AllFontsGen.exe [FontsFolder] <DestinationFile>\n");
                return;
            }

            if (args.Length == 1)
                sDstFile = args[0];
            else
            {
                sDirectory = args[0];
                sDstFile = args[1];
            }

            try
            {
                System.Console.Write("Generating {0}, please wait...", Path.GetFileName(sDstFile));
                OfficeCore.CWinFontsClass oFonts = new OfficeCore.CWinFontsClass();
                oFonts.Init(sDirectory, false, false);
                oFonts.SetAdditionalParam("AllFonts.js", sDstFile);
                System.Console.Write("Done.");
            }
            catch (Exception e)
            {
                System.Console.Write("Failed.");
            }
        }
    }
}
