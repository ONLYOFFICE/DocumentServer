/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
using System.Data;
using System.Configuration;

namespace Odtff_fonts
{
    public static class ZBase32Encoder
    {
        private const string EncodingTable = "ybndrfg8ejkmcpqxot1uwisza345h769";

        private static readonly byte[] DecodingTable = new byte[128];

        static ZBase32Encoder()
        {
            for (var i = 0; i < DecodingTable.Length; ++i)
            {
                DecodingTable[i] = byte.MaxValue;
            }

            for (var i = 0; i < EncodingTable.Length; ++i)
            {
                DecodingTable[EncodingTable[i]] = (byte)i;
            }
        }

        public static string Encode(byte[] data)
        {
            if (data == null)
            {
                throw new ArgumentNullException("data");
            }

            var encodedResult = new StringBuilder((int)Math.Ceiling(data.Length * 8.0 / 5.0));

            for (var i = 0; i < data.Length; i += 5)
            {
                var byteCount = Math.Min(5, data.Length - i);

                ulong buffer = 0;
                for (var j = 0; j < byteCount; ++j)
                {
                    buffer = (buffer << 8) | data[i + j];
                }

                var bitCount = byteCount * 8;
                while (bitCount > 0)
                {
                    var index = bitCount >= 5
                                ? (int)(buffer >> (bitCount - 5)) & 0x1f
                                : (int)(buffer & (ulong)(0x1f >> (5 - bitCount))) << (5 - bitCount);

                    encodedResult.Append(EncodingTable[index]);
                    bitCount -= 5;
                }
            }

            return encodedResult.ToString();
        }

        public static byte[] Decode(string data)
        {
            if (data == string.Empty)
            {
                return new byte[0];
            }

            var result = new List<byte>((int)Math.Ceiling(data.Length * 5.0 / 8.0));

            var index = new int[8];
            for (var i = 0; i < data.Length; )
            {
                i = CreateIndexByOctetAndMovePosition(ref data, i, ref index);

                var shortByteCount = 0;
                ulong buffer = 0;
                for (var j = 0; j < 8 && index[j] != -1; ++j)
                {
                    buffer = (buffer << 5) | (ulong)(DecodingTable[index[j]] & 0x1f);
                    shortByteCount++;
                }

                var bitCount = shortByteCount * 5;
                while (bitCount >= 8)
                {
                    result.Add((byte)((buffer >> (bitCount - 8)) & 0xff));
                    bitCount -= 8;
                }
            }

            return result.ToArray();
        }

        private static int CreateIndexByOctetAndMovePosition(ref string data, int currentPosition, ref int[] index)
        {
            var j = 0;
            while (j < 8)
            {
                if (currentPosition >= data.Length)
                {
                    index[j++] = -1;
                    continue;
                }

                if (IgnoredSymbol(data[currentPosition]))
                {
                    currentPosition++;
                    continue;
                }

                index[j] = data[currentPosition];
                j++;
                currentPosition++;
            }

            return currentPosition;
        }

        private static bool IgnoredSymbol(char checkedSymbol)
        {
            return checkedSymbol >= DecodingTable.Length || DecodingTable[checkedSymbol] == byte.MaxValue;
        }
    }
}
