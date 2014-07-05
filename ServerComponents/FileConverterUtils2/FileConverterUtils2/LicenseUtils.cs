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
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Xml;
using System.IO;

namespace FileConverterUtils2
{

    public class LicenseUtils
    {
        #if !OPEN_SOURCE

        public static Boolean VerifyXml(XmlDocument Doc, RSA Key)
        {
            
            if (Doc == null)
                throw new ArgumentException("Doc");
            if (Key == null)
                throw new ArgumentException("Key");

            SignedXml signedXml = new SignedXml(Doc);

            XmlNodeList nodeList = Doc.GetElementsByTagName("Signature");

            if (nodeList.Count <= 0)
            {
                throw new CryptographicException("Verification failed: No Signature was found in the document.");
            }

            if (nodeList.Count >= 2)
            {
                throw new CryptographicException("Verification failed: More that one signature was found for the document.");
            }

            signedXml.LoadXml((XmlElement)nodeList[0]);

            return signedXml.CheckSignature(Key);
        }

        public static string symmetricDecrypt(byte[] content, byte[] keyAndIv)
        {
            RijndaelManaged RMCrypto = new RijndaelManaged();
            KeySizes[] keySizes = RMCrypto.LegalKeySizes;

            if (keySizes.Length == 0)
                throw new InvalidOperationException("No Rijndael key sizes");

            int keySize = (keySizes[0].MaxSize / 8); 
            int blockSize = (RMCrypto.BlockSize / 8); 

            byte[] Key = new byte[keySize];
            byte[] IV = new byte[blockSize];

            for (int i = 0; i < keySize; ++i)
            {
                Key[i] = (byte)i;
            }
            for (int i = 0; i < blockSize; ++i)
            {
                IV[i] = (byte)i;
            }

            if (keyAndIv.Length >= keySize)
            {
                Array.Copy(keyAndIv, Key, keySize);
            }
            else
            {
                Array.Copy(keyAndIv, Key, keyAndIv.Length);
            }

            if (keyAndIv.Length >= blockSize)
            {
                Array.Copy(keyAndIv, IV, blockSize);
            }
            else
            {
                Array.Copy(keyAndIv, IV, keyAndIv.Length);
            }
            
            MemoryStream stream = new MemoryStream(content);
            CryptoStream cryptStream = new CryptoStream(stream
                , RMCrypto.CreateDecryptor(Key, IV)
                , CryptoStreamMode.Read);

            StreamReader sReader = new StreamReader (cryptStream);
            string res = sReader.ReadToEnd();

            sReader.Close();
            cryptStream.Close();
            stream.Close();

            return res;
        }
#endif
    }

}
