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
 #include "stdafx.h"
#include "audiodefines.h"

void SetChannelsMaskPreset(long& Channels,DWORD& Mask)
{
	if (Mask)return;
	Mask=SPEAKER_FRONT_LEFT| SPEAKER_FRONT_RIGHT;
	switch (Channels)
	{
		case MONO:
			Mask=SPEAKER_FRONT_LEFT| SPEAKER_FRONT_RIGHT;
		break;
		case STEREO:
		break;
		case CHANNELS_2_1:
			Channels=3;
			Mask|=SPEAKER_LOW_FREQUENCY;
		break;
		case CHANNELS_3_0:
			Channels=3;
			Mask|=SPEAKER_FRONT_CENTER;
		break;
		case CHANNELS_3_1:
			Channels=4;
			Mask|=SPEAKER_LOW_FREQUENCY;
			Mask|=SPEAKER_FRONT_CENTER;
			break;
		case CHANNELS_2_2:
			Channels=4;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
		break;
		case CHANNELS_3_2:
			Channels=5;
			Mask|=SPEAKER_FRONT_CENTER;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
		break;
		case CHANNELS_4_1:
			Channels=5;
			Mask|=SPEAKER_LOW_FREQUENCY;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
		break;
		case CHANNELS_5_1:
			Channels=6;
			Mask|=SPEAKER_LOW_FREQUENCY;
			Mask|=SPEAKER_FRONT_CENTER;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
		break;
		case CHANNELS_4_2:
			Channels=6;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
			Mask|=SPEAKER_SIDE_LEFT|SPEAKER_SIDE_RIGHT;
		break;
		case CHANNELS_5_2:
			Channels=7;
			Mask|=SPEAKER_FRONT_CENTER;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
			Mask|=SPEAKER_SIDE_LEFT|SPEAKER_SIDE_RIGHT;
		break;
		case CHANNELS_7_1:
			Channels=8;
			Mask|=SPEAKER_LOW_FREQUENCY;
			Mask|=SPEAKER_FRONT_CENTER;
			Mask|=SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
			Mask|=SPEAKER_SIDE_LEFT|SPEAKER_SIDE_RIGHT;
		break;
	}		
}

void CheckChannelsMask(long& Channels,DWORD& Mask)
{
	bool Change=false;
	if (Mask)
	{
		
		long ChannelsRealy=0;
			if (Mask & SPEAKER_FRONT_LEFT)ChannelsRealy++;
			if (Mask & SPEAKER_FRONT_RIGHT)ChannelsRealy++;
			if (Mask & SPEAKER_FRONT_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_LOW_FREQUENCY)ChannelsRealy++;
			if (Mask & SPEAKER_BACK_LEFT)ChannelsRealy++;
			if (Mask & SPEAKER_BACK_RIGHT)ChannelsRealy++;
			if (Mask & SPEAKER_FRONT_LEFT_OF_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_FRONT_RIGHT_OF_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_BACK_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_SIDE_LEFT)ChannelsRealy++;
			if (Mask & SPEAKER_SIDE_RIGHT)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_FRONT_LEFT)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_FRONT_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_FRONT_RIGHT)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_BACK_LEFT)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_BACK_CENTER)ChannelsRealy++;
			if (Mask & SPEAKER_TOP_BACK_RIGHT)ChannelsRealy++;

		if (ChannelsRealy!=Channels)
		{
			Change=true;
		}
	}else Change=true;

	if (Change)
	{
		
		switch (Channels)
		{
				case 1:
					Mask=SPEAKER_FRONT_LEFT;
					break;
				case 2:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT;
					break;
				case 3:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT|SPEAKER_LOW_FREQUENCY;
					break;
				case 4:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT|SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT;
					break;
				case 5:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT|SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT|SPEAKER_FRONT_CENTER;
					break;
				case 6:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT|SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT|SPEAKER_FRONT_CENTER|SPEAKER_LOW_FREQUENCY;
					break;
				case 7:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT|SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT|SPEAKER_FRONT_CENTER|SPEAKER_SIDE_LEFT|SPEAKER_SIDE_RIGHT;
					break;
				case 8:
					Mask=SPEAKER_FRONT_LEFT|SPEAKER_FRONT_RIGHT|SPEAKER_BACK_LEFT|SPEAKER_BACK_RIGHT|SPEAKER_FRONT_CENTER|SPEAKER_LOW_FREQUENCY|SPEAKER_SIDE_LEFT|SPEAKER_SIDE_RIGHT;
					break;
		}
	}
}

	inline CComBSTR GetSampleRateStr(long SampleRate)
	{
		CComBSTR str="";
		if (SampleRate)
		{
			char Ch[80];
			
			sprintf_s(Ch,"%u Hz, ",SampleRate);
			str=Ch;
		}
		return str;
	}
	inline CComBSTR GetSampleSizeStr(long SampleSize)
	{
		CComBSTR str="";
		if (SampleSize)
		{
			char Ch[40];ltoa(SampleSize,Ch,10);
			str=Ch;str.Append(" bits, ");
		}
		return str;
	}
	inline CComBSTR GetChannelsStr(long Channels,DWORD ChannelsMask)
	{
		CComBSTR str="";
		if (Channels==1) str=" Mono, ";
		else if (Channels==2)str=" Stereo, ";
		else
		{
			if (ChannelsMask == (SPEAKER_LOW_FREQUENCY | SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT))str=" Surround 2.1, "; 
			else if (ChannelsMask == (SPEAKER_LOW_FREQUENCY | SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_FRONT_CENTER))str=" Surround 3.1, "; 
			else if (ChannelsMask == (SPEAKER_LOW_FREQUENCY | SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_BACK_RIGHT | SPEAKER_BACK_LEFT ))str=" Surround 4.1, "; 
			else if (ChannelsMask == (SPEAKER_LOW_FREQUENCY | SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_BACK_RIGHT | SPEAKER_BACK_LEFT | SPEAKER_FRONT_CENTER))str=" Surround 5.1, "; 
			else if (ChannelsMask == (SPEAKER_LOW_FREQUENCY | SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_BACK_RIGHT | SPEAKER_BACK_LEFT | SPEAKER_FRONT_CENTER  | SPEAKER_SIDE_RIGHT | SPEAKER_SIDE_LEFT))str=" Surround 7.1, "; 
			else if (ChannelsMask == (SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_BACK_RIGHT | SPEAKER_BACK_LEFT ))str=" Quadrophonic 4, "; 
			else if (ChannelsMask == (SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_BACK_RIGHT | SPEAKER_BACK_LEFT | SPEAKER_FRONT_CENTER))str=" Surround 5.0, "; 
			else if (ChannelsMask == (SPEAKER_FRONT_RIGHT | SPEAKER_FRONT_LEFT  | SPEAKER_BACK_RIGHT | SPEAKER_BACK_LEFT  | SPEAKER_SIDE_RIGHT | SPEAKER_SIDE_LEFT ))str=" Quadrophonic 6, "; 
			else 
			{
				char Ch[40];ltoa(Channels,Ch,10);str=" Channels ";
				str.Append(Ch);
				str+= " (";
				if (ChannelsMask & SPEAKER_FRONT_LEFT )str += " FL";
				if (ChannelsMask & SPEAKER_FRONT_CENTER )str += " FC";	
				if (ChannelsMask & SPEAKER_FRONT_RIGHT )str += " FR";
				if (ChannelsMask & SPEAKER_LOW_FREQUENCY )str += " LFE";
				if (ChannelsMask & SPEAKER_BACK_LEFT )str += " BL";
				if (ChannelsMask & SPEAKER_BACK_CENTER )str += " BC";
				if (ChannelsMask & SPEAKER_BACK_RIGHT )str += " BR";
				if (ChannelsMask & SPEAKER_SIDE_LEFT )str += " SL";
				if (ChannelsMask & SPEAKER_SIDE_RIGHT )str += " SR";
				if (ChannelsMask & SPEAKER_FRONT_LEFT_OF_CENTER)str += " FLC";
				if (ChannelsMask & SPEAKER_FRONT_RIGHT_OF_CENTER)str += " FRC";
				if (ChannelsMask & SPEAKER_TOP_CENTER)str += " TC";
				if (ChannelsMask & SPEAKER_TOP_FRONT_LEFT)str += " TFL";
				if (ChannelsMask & SPEAKER_TOP_FRONT_CENTER)str += " TFC";
				if (ChannelsMask & SPEAKER_TOP_FRONT_RIGHT)str += " TFR";
				if (ChannelsMask & SPEAKER_TOP_BACK_LEFT)str += " TBL";
				if (ChannelsMask & SPEAKER_TOP_BACK_CENTER)str += " TBC";
				if (ChannelsMask & SPEAKER_TOP_BACK_RIGHT)str += " TBR";
				str+=" ), ";
			}
		}
		return str;
	}
	inline CComBSTR GetBitrateStr(double Bitrate,double BitrateMax,double BitrateAvg)
	{
		CComBSTR str="";
		if (Bitrate)
		{
			char Ch[80];
			
			str=Ch;
			if (BitrateMax>Bitrate)
			{
				sprintf_s(Ch,"%.2f-%.2f kbps; ",Bitrate,BitrateMax);
			}else
				sprintf_s(Ch,"%.2f kbps; ",Bitrate);
			if (BitrateAvg>0 && BitrateAvg!=Bitrate)
				sprintf_s(Ch,"%s Average %.2f kbps; ",Ch,BitrateAvg);
			str=Ch;
		}
		return str;
	}
	__int64 abs64(__int64 Val)
	{
		if (Val>0)return Val;
		else return -Val;
	}
	__int64 xabs64(__int64 Val)
	{
		if (Val>0)return Val;
		else return -Val;
	}