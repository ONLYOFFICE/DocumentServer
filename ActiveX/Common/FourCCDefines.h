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
 #ifdef _MSC_VER
	#pragma once			
#endif	

#ifndef _FOURCCDEFINES_H_	
#define _FOURCCDEFINES_H_

#include <Mmsystem.h>
#include "InternalCodecTypes.h"













#define UPPERCASEFOURCC(fcc)\
		(((DWORD)((((BYTE*)&fcc)[0]>='a')&&(((BYTE*)&fcc)[0]<='z')?(((BYTE*)&fcc)[0]-0x20):(((BYTE*)&fcc)[0])))|\
		 ((DWORD)((((BYTE*)&fcc)[1]>='a')&&(((BYTE*)&fcc)[1]<='z')?(((BYTE*)&fcc)[1]-0x20):(((BYTE*)&fcc)[1])))<<8|\
		 ((DWORD)((((BYTE*)&fcc)[2]>='a')&&(((BYTE*)&fcc)[2]<='z')?(((BYTE*)&fcc)[2]-0x20):(((BYTE*)&fcc)[2])))<<16|\
		 ((DWORD)((((BYTE*)&fcc)[3]>='a')&&(((BYTE*)&fcc)[3]<='z')?(((BYTE*)&fcc)[3]-0x20):(((BYTE*)&fcc)[3])))<<24)

#define LOWERCASEFOURCC(fcc)\
		(((DWORD)((((BYTE*)&fcc)[0]>='A')&&(((BYTE*)&fcc)[0]<='Z')?(((BYTE*)&fcc)[0]+0x20):(((BYTE*)&fcc)[0])))|\
		 ((DWORD)((((BYTE*)&fcc)[1]>='A')&&(((BYTE*)&fcc)[1]<='Z')?(((BYTE*)&fcc)[1]+0x20):(((BYTE*)&fcc)[1])))<<8|\
		 ((DWORD)((((BYTE*)&fcc)[2]>='A')&&(((BYTE*)&fcc)[2]<='Z')?(((BYTE*)&fcc)[2]+0x20):(((BYTE*)&fcc)[2])))<<16|\
		 ((DWORD)((((BYTE*)&fcc)[3]>='A')&&(((BYTE*)&fcc)[3]<='Z')?(((BYTE*)&fcc)[3]+0x20):(((BYTE*)&fcc)[3])))<<24)

#define DVHandler			1685288548

#define MsMpeg4v1Handler	877088845
#define MsMpeg4v3Handler	859066445

#define RV10Handler		mmioFOURCC('R','V','1','0')
#define RV20Handler		mmioFOURCC('R','V','2','0')
#define RV30Handler		mmioFOURCC('R','V','3','0')
#define RV40Handler		mmioFOURCC('R','V','4','0')

#define _3IV0Handler	mmioFOURCC('3','I','V','0')
#define _3IV1Handler	mmioFOURCC('3','I','V','1')
#define _3IV2Handler	mmioFOURCC('3','I','V','2')
#define _3IVDHandler	mmioFOURCC('3','I','V','D')
#define _3IVXHandler	mmioFOURCC('3','I','V','X')
#define _8BPSHandler	mmioFOURCC('8','B','P','S')
#define _SGIHandler		mmioFOURCC('.','S','G','I')
#define AAS4Handler		mmioFOURCC('A','A','S','4')
#define AASCHandler		mmioFOURCC('A','A','S','C')
#define ABYRHandler		mmioFOURCC('A','B','Y','R')
#define ADV1Handler		mmioFOURCC('A','D','V','1')
#define ADVJHandler		mmioFOURCC('A','D','V','J')
#define AEMIHandler		mmioFOURCC('A','E','M','I')
#define AFLCHandler		mmioFOURCC('A','F','L','C')
#define AFLIHandler		mmioFOURCC('A','F','L','I')
#define ALPHHandler		mmioFOURCC('A','L','P','H')
#define AMPGHandler		mmioFOURCC('A','M','P','G')
#define ANIMHandler		mmioFOURCC('A','N','I','M')
#define AP41Handler		mmioFOURCC('A','P','4','1')
#define ASV1Handler		mmioFOURCC('A','S','V','1')
#define ASV2Handler		mmioFOURCC('A','S','V','2')
#define ASVXHandler		mmioFOURCC('A','S','V','X')
#define AUR2Handler		mmioFOURCC('A','U','R','2')
#define AURAHandler		mmioFOURCC('A','U','R','A')
#define AUVXHandler		mmioFOURCC('A','U','V','X')
#define AVC1Handler		mmioFOURCC('A','V','C','1')
#define AVDJHandler		mmioFOURCC('A','V','D','J')
#define AVI1Handler		mmioFOURCC('A','V','I','1')
#define AVI2Handler		mmioFOURCC('A','V','I','2')
#define AVRHandler		mmioFOURCC('A','V','R',' ')
#define AVRNHandler		mmioFOURCC('A','V','R','N')
#define AZPRHandler		mmioFOURCC('A','Z','P','R')
#define B16GHandler		mmioFOURCC('B','1','6','G')
#define B32AHandler		mmioFOURCC('B','3','2','A')
#define B48RHandler		mmioFOURCC('B','4','8','R')
#define B64AHandler		mmioFOURCC('B','6','4','A')
#define BASEHandler		mmioFOURCC('B','A','S','E')
#define BGRHandler		mmioFOURCC('B','G','R',' ')
#define BINKHandler		mmioFOURCC('B','I','N','K')
#define BITMHandler		mmioFOURCC('B','I','T','M')
#define BLZ0Handler		mmioFOURCC('B','L','Z','0')
#define BT20Handler		mmioFOURCC('B','T','2','0')
#define BTCVHandler		mmioFOURCC('B','T','C','V')
#define BTVCHandler		mmioFOURCC('B','T','V','C')
#define BW10Handler		mmioFOURCC('B','W','1','0')
#define CC12Handler		mmioFOURCC('C','C','1','2')
#define CDVCHandler		mmioFOURCC('C','D','V','C')
#define CFCCHandler		mmioFOURCC('C','F','C','C')
#define CGDIHandler		mmioFOURCC('C','G','D','I')
#define CHAMHandler		mmioFOURCC('C','H','A','M')
#define CJPGHandler		mmioFOURCC('C','J','P','G')
#define CLJRHandler		mmioFOURCC('C','L','J','R')
#define CLOUHandler		mmioFOURCC('C','L','O','U')
#define CLPLHandler		mmioFOURCC('C','L','P','L')
#define CM10Handler		mmioFOURCC('C','M','1','0')
#define CMYKHandler		mmioFOURCC('C','M','Y','K')
#define COL0Handler		mmioFOURCC('C','O','L','0')
#define COL1Handler		mmioFOURCC('C','O','L','1')
#define CPLAHandler		mmioFOURCC('C','P','L','A')
#define CRAMHandler		mmioFOURCC('C','R','A','M')
#define CT10Handler		mmioFOURCC('C','T','1','0')
#define CVIDHandler		mmioFOURCC('C','V','I','D')
#define CWLTHandler		mmioFOURCC('C','W','L','T')
#define CYUVHandler		mmioFOURCC('C','Y','U','V')
#define CYUYHandler		mmioFOURCC('C','Y','U','Y')
#define D261Handler		mmioFOURCC('D','2','6','1')
#define D263Handler		mmioFOURCC('D','2','6','3')
#define DCAPHandler		mmioFOURCC('D','C','A','P')
#define DCMJHandler		mmioFOURCC('D','C','M','J')
#define DIBHandler		mmioFOURCC('D','I','B',' ')
#define DIV1Handler		mmioFOURCC('D','I','V','1')
#define DIV2Handler		mmioFOURCC('D','I','V','2')
#define DIV3Handler		mmioFOURCC('D','I','V','3')
#define DIV4Handler		mmioFOURCC('D','I','V','4')
#define DIV5Handler		mmioFOURCC('D','I','V','5')
#define DIV6Handler		mmioFOURCC('D','I','V','6')
#define DIVXHandler		mmioFOURCC('D','I','V','X')
#define DJPGHandler		mmioFOURCC('D','J','P','G')
#define DMB1Handler		mmioFOURCC('D','M','B','1')
#define DMB2Handler		mmioFOURCC('D','M','B','2')
#define DP02Handler		mmioFOURCC('D','P','0','2')
#define DP16Handler		mmioFOURCC('D','P','1','6')
#define DP18Handler		mmioFOURCC('D','P','1','8')
#define DP26Handler		mmioFOURCC('D','P','2','6')
#define DP28Handler		mmioFOURCC('D','P','2','8')
#define DP96Handler		mmioFOURCC('D','P','9','6')
#define DP98Handler		mmioFOURCC('D','P','9','8')
#define DP9LHandler		mmioFOURCC('D','P','9','L')
#define DPS0Handler		mmioFOURCC('D','P','S','0')
#define DPSCHandler		mmioFOURCC('D','P','S','C')
#define DRWXHandler		mmioFOURCC('D','R','W','X')
#define DSVDHandler		mmioFOURCC('D','S','V','D')
#define DUCKHandler		mmioFOURCC('D','U','C','K')
#define DV1NHandler		mmioFOURCC('D','V','1','N')
#define DV1PHandler		mmioFOURCC('D','V','1','P')
#define DV25Handler		mmioFOURCC('D','V','2','5')
#define DV50Handler		mmioFOURCC('D','V','5','0')
#define DV5NHandler		mmioFOURCC('D','V','5','N')
#define DV5PHandler		mmioFOURCC('D','V','5','P')
#define DVCHandler		mmioFOURCC('D','V','C',' ')
#define DVCPHandler		mmioFOURCC('D','V','C','P')
#define DVCSHandler		mmioFOURCC('D','V','C','S')
#define DVE2Handler		mmioFOURCC('D','V','E','2')
#define DVH1Handler		mmioFOURCC('D','V','H','1')
#define DVH5Handler		mmioFOURCC('D','V','H','5')
#define DVH6Handler		mmioFOURCC('D','V','H','6')
#define DVHDHandler		mmioFOURCC('D','V','H','D')
#define DVHPHandler		mmioFOURCC('D','V','H','P')
#define DVNMHandler		mmioFOURCC('D','V','N','M')
#define DVMAHandler		mmioFOURCC('D','V','M','A')
#define DVPPHandler		mmioFOURCC('D','V','P','P')
#define DVSDHandler		mmioFOURCC('D','V','S','D')
#define DVSLHandler		mmioFOURCC('D','V','S','L')
#define DVX1Handler		mmioFOURCC('D','V','X','1')
#define DVX2Handler		mmioFOURCC('D','V','X','2')
#define DVX3Handler		mmioFOURCC('D','V','X','3')
#define DX50Handler		mmioFOURCC('D','X','5','0')
#define DXT0Handler		mmioFOURCC('D','X','T','0')
#define DXT1Handler		mmioFOURCC('D','X','T','1')
#define DXT2Handler		mmioFOURCC('D','X','T','2')
#define DXT3Handler		mmioFOURCC('D','X','T','3')
#define DXT4Handler		mmioFOURCC('D','X','T','4')
#define DXT5Handler		mmioFOURCC('D','X','T','5')
#define DXT6Handler		mmioFOURCC('D','X','T','6')
#define DXT7Handler		mmioFOURCC('D','X','T','7')
#define DXT8Handler		mmioFOURCC('D','X','T','8')
#define DXT9Handler		mmioFOURCC('D','X','T','9')
#define DXTAHandler		mmioFOURCC('D','X','T','A')
#define DXTBHandler		mmioFOURCC('D','X','T','B')
#define DXTCHandler		mmioFOURCC('D','X','T','C')
#define DXTDHandler		mmioFOURCC('D','X','T','D')
#define DXTEHandler		mmioFOURCC('D','X','T','E')
#define DXTFHandler		mmioFOURCC('D','X','T','F')
#define DXTGHandler		mmioFOURCC('D','X','T','G')
#define DXTHHandler		mmioFOURCC('D','X','T','H')
#define DXTIHandler		mmioFOURCC('D','X','T','I')
#define DXTJHandler		mmioFOURCC('D','X','T','J')
#define DXTKHandler		mmioFOURCC('D','X','T','K')
#define DXTLHandler		mmioFOURCC('D','X','T','L')
#define DXTMHandler		mmioFOURCC('D','X','T','M')
#define DXTNHandler		mmioFOURCC('D','X','T','N')
#define DXTOHandler		mmioFOURCC('D','X','T','O')
#define DXTPHandler		mmioFOURCC('D','X','T','P')
#define DXTQHandler		mmioFOURCC('D','X','T','Q')
#define DXTRHandler		mmioFOURCC('D','X','T','R')
#define DXTSHandler		mmioFOURCC('D','X','T','S')
#define DXTTHandler		mmioFOURCC('D','X','T','T')
#define DXTUHandler		mmioFOURCC('D','X','T','U')
#define DXTVHandler		mmioFOURCC('D','X','T','V')
#define DXTWHandler		mmioFOURCC('D','X','T','W')
#define DXTXHandler		mmioFOURCC('D','X','T','X')
#define DXTYHandler		mmioFOURCC('D','X','T','Y')
#define DXTZHandler		mmioFOURCC('D','X','T','Z')
#define EKQ0Handler		mmioFOURCC('E','K','Q','0')
#define ELK0Handler		mmioFOURCC('E','L','K','0')
#define EM2VHandler		mmioFOURCC('E','M','2','V')
#define EM4AHandler		mmioFOURCC('E','M','4','A')
#define ESCPHandler		mmioFOURCC('E','S','C','P')
#define ETV1Handler		mmioFOURCC('E','T','V','1')
#define ETV2Handler		mmioFOURCC('E','T','V','2')
#define ETVCHandler		mmioFOURCC('E','T','V','C')
#define FIREHandler		mmioFOURCC('F','I','R','E')
#define FLICHandler		mmioFOURCC('F','L','I','C')
#define FLJPHandler		mmioFOURCC('F','L','J','P')
#define FLV1Handler		mmioFOURCC('F','L','V','1')
#define FLV4Handler		mmioFOURCC('F','L','V','4')
#define FMP4Handler		mmioFOURCC('F','M','P','4')
#define FPS1Handler		mmioFOURCC('F','P','S','1')
#define FRWAHandler		mmioFOURCC('F','R','W','A')
#define FRWDHandler		mmioFOURCC('F','R','W','D')
#define FRWTHandler		mmioFOURCC('F','R','W','T')
#define FRWUHandler		mmioFOURCC('F','R','W','U')
#define FSV1Handler		mmioFOURCC('F','S','V','1')
#define FVF1Handler		mmioFOURCC('F','V','F','1')
#define FVFWHandler		mmioFOURCC('F','V','F','W')
#define FXT1Handler		mmioFOURCC('F','X','T','1')
#define G2M2Handler		mmioFOURCC('G','2','M','2')
#define G2M3Handler		mmioFOURCC('G','2','M','3')
#define G2M4Handler		mmioFOURCC('G','2','M','4')
#define GEOVHandler		mmioFOURCC('G','E','O','V')
#define GEPJHandler		mmioFOURCC('G','E','P','J')
#define GIFHandler		mmioFOURCC('G','I','F',' ')
#define GLZWHandler		mmioFOURCC('G','L','Z','W')
#define GPEGHandler		mmioFOURCC('G','P','E','G')
#define GPJMHandler		mmioFOURCC('G','P','J','M')
#define GREYHandler		mmioFOURCC('G','R','E','Y')
#define GWLTHandler		mmioFOURCC('G','W','L','T')
#define H260Handler		mmioFOURCC('H','2','6','0')
#define H261Handler		mmioFOURCC('H','2','6','1')
#define H262Handler		mmioFOURCC('H','2','6','2')
#define H263Handler		mmioFOURCC('H','2','6','3')
#define H264Handler		mmioFOURCC('H','2','6','4')
#define H265Handler		mmioFOURCC('H','2','6','5')
#define H266Handler		mmioFOURCC('H','2','6','6')
#define H267Handler		mmioFOURCC('H','2','6','7')
#define H268Handler		mmioFOURCC('H','2','6','8')
#define H269Handler		mmioFOURCC('H','2','6','9')
#define HDV9Handler		mmioFOURCC('H','D','V','9')
#define HDYCHandler		mmioFOURCC('H','D','Y','C')
#define HFYUHandler		mmioFOURCC('H','F','Y','U')
#define HMCRHandler		mmioFOURCC('H','M','C','R')
#define HMRRHandler		mmioFOURCC('H','M','R','R')
#define I263Handler		mmioFOURCC('I','2','6','3')
#define I420Handler		mmioFOURCC('I','4','2','0')
#define IANHandler		mmioFOURCC('I','A','N',' ')
#define ICLBHandler		mmioFOURCC('I','C','L','B')
#define IF09Handler		mmioFOURCC('I','F','0','9')
#define IGORHandler		mmioFOURCC('I','G','O','R')
#define IJPGHandler		mmioFOURCC('I','J','P','G')
#define ILVCHandler		mmioFOURCC('I','L','V','C')
#define ILVRHandler		mmioFOURCC('I','L','V','R')
#define IMACHandler		mmioFOURCC('I','M','A','C')
#define IMC1Handler		mmioFOURCC('I','M','C','1')
#define IMC2Handler		mmioFOURCC('I','M','C','2')
#define IMC3Handler		mmioFOURCC('I','M','C','3')
#define IMC4Handler		mmioFOURCC('I','M','C','4')
#define IPDVHandler		mmioFOURCC('I','P','D','V')
#define IR21Handler		mmioFOURCC('I','R','2','1')
#define IRAWHandler		mmioFOURCC('I','R','A','W')
#define ISMEHandler		mmioFOURCC('I','S','M','E')
#define IUYVHandler		mmioFOURCC('I','U','Y','V')
#define IV30Handler		mmioFOURCC('I','V','3','0')
#define IV31Handler		mmioFOURCC('I','V','3','1')
#define IV32Handler		mmioFOURCC('I','V','3','2')
#define IV33Handler		mmioFOURCC('I','V','3','3')
#define IV34Handler		mmioFOURCC('I','V','3','4')
#define IV35Handler		mmioFOURCC('I','V','3','5')
#define IV36Handler		mmioFOURCC('I','V','3','6')
#define IV37Handler		mmioFOURCC('I','V','3','7')
#define IV38Handler		mmioFOURCC('I','V','3','8')
#define IV39Handler		mmioFOURCC('I','V','3','9')
#define IV40Handler		mmioFOURCC('I','V','4','0')
#define IV41Handler		mmioFOURCC('I','V','4','1')
#define IV42Handler		mmioFOURCC('I','V','4','2')
#define IV43Handler		mmioFOURCC('I','V','4','3')
#define IV44Handler		mmioFOURCC('I','V','4','4')
#define IV45Handler		mmioFOURCC('I','V','4','5')
#define IV46Handler		mmioFOURCC('I','V','4','6')
#define IV47Handler		mmioFOURCC('I','V','4','7')
#define IV48Handler		mmioFOURCC('I','V','4','8')
#define IV49Handler		mmioFOURCC('I','V','4','9')
#define IV50Handler		mmioFOURCC('I','V','5','0')
#define IY41Handler		mmioFOURCC('I','Y','4','1')
#define IYU1Handler		mmioFOURCC('I','Y','U','1')
#define IYU2Handler		mmioFOURCC('I','Y','U','2')
#define IYUVHandler		mmioFOURCC('I','Y','U','V')
#define JBYRHandler		mmioFOURCC('J','B','Y','R')
#define JFIFHandler		mmioFOURCC('J','F','I','F')
#define JPEGHandler		mmioFOURCC('J','P','E','G')	
#define JPGLHandler		mmioFOURCC('J','P','G','L')
#define KMVCHandler		mmioFOURCC('K','M','V','C')
#define KPCDHandler		mmioFOURCC('K','P','C','D')
#define L261Handler		mmioFOURCC('L','2','6','1')
#define L263Handler		mmioFOURCC('L','2','6','3')
#define LCMWHandler		mmioFOURCC('L','C','M','W')
#define LEADHandler		mmioFOURCC('L','E','A','D')
#define LGRYHandler		mmioFOURCC('L','G','R','Y')
#define LIA1Handler		mmioFOURCC('L','I','A','1')
#define LJPGHandler		mmioFOURCC('L','J','P','G')
#define LMP4Handler		mmioFOURCC('L','M','P','4')
#define LSV0Handler		mmioFOURCC('L','S','V','0')
#define LSVCHandler		mmioFOURCC('L','S','V','C')
#define LSVMHandler		mmioFOURCC('L','S','V','M')
#define LSVWHandler		mmioFOURCC('L','S','V','W')
#define LZO1Handler		mmioFOURCC('L','Z','O','1')
#define M101Handler		mmioFOURCC('M','1','0','1')
#define M261Handler		mmioFOURCC('M','2','6','1')
#define M263Handler		mmioFOURCC('M','2','6','3')
#define M4S2Handler		mmioFOURCC('M','4','S','2')
#define M4CCHandler		mmioFOURCC('M','4','C','C')
#define MC12Handler		mmioFOURCC('M','C','1','2')
#define MC24Handler		mmioFOURCC('M','C','2','4')
#define MCAMHandler		mmioFOURCC('M','C','A','M')
#define MDVDHandler		mmioFOURCC('M','D','V','D')
#define MJ2CHandler		mmioFOURCC('M','J','2','C')
#define MJP2Handler		mmioFOURCC('M','J','P','2')
#define MJPAHandler		mmioFOURCC('M','J','P','A')
#define MJPBHandler		mmioFOURCC('M','J','P','B')
#define MJPGHandler		mmioFOURCC('M','J','P','G')
#define MMESHandler		mmioFOURCC('M','M','E','S')
#define MMIFHandler		mmioFOURCC('M','M','I','F')
#define MP2AHandler		mmioFOURCC('M','P','2','A')
#define MP2THandler		mmioFOURCC('M','P','2','T')
#define MP2VHandler		mmioFOURCC('M','P','2','V')
#define MP41Handler		mmioFOURCC('M','P','4','1')
#define MP42Handler		mmioFOURCC('M','P','4','2')
#define MP43Handler		mmioFOURCC('M','P','4','3')
#define MP4AHandler		mmioFOURCC('M','P','4','A')
#define MP4SHandler		mmioFOURCC('M','P','4','S')
#define MP4THandler		mmioFOURCC('M','P','4','T')
#define MP4VHandler		mmioFOURCC('M','P','4','V')
#define MPEGHandler		mmioFOURCC('M','P','E','G')
#define MPG1Handler		mmioFOURCC('M','P','G','1')
#define MPG2Handler		mmioFOURCC('M','P','G','2')
#define MPG3Handler		mmioFOURCC('M','P','G','3')
#define MPG4Handler		mmioFOURCC('M','P','G','4')
#define MPGIHandler		mmioFOURCC('M','P','G','I')
#define MPNGHandler		mmioFOURCC('M','P','N','G')
#define MRCAHandler		mmioFOURCC('M','R','C','A')
#define MRLEHandler		mmioFOURCC('M','R','L','E')
#define MSS1Handler		mmioFOURCC('M','S','S','1')
#define MSS2Handler		mmioFOURCC('M','S','S','2')
#define MSV1Handler		mmioFOURCC('M','S','V','1')
#define MSVCHandler		mmioFOURCC('M','S','V','C')
#define MSZHHandler		mmioFOURCC('M','S','Z','H')
#define MTGAHandler		mmioFOURCC('M','T','G','A')
#define MTX1Handler		mmioFOURCC('M','T','X','1')
#define MTX2Handler		mmioFOURCC('M','T','X','2')
#define MTX3Handler		mmioFOURCC('M','T','X','3')
#define MTX4Handler		mmioFOURCC('M','T','X','4')
#define MTX5Handler		mmioFOURCC('M','T','X','5')
#define MTX6Handler		mmioFOURCC('M','T','X','6')
#define MTX7Handler		mmioFOURCC('M','T','X','7')
#define MTX8Handler		mmioFOURCC('M','T','X','8')
#define MTX9Handler		mmioFOURCC('M','T','X','9')
#define MV10Handler		mmioFOURCC('M','W','1','0')
#define MV11Handler		mmioFOURCC('M','W','1','1')
#define MV12Handler		mmioFOURCC('M','W','1','2')
#define MV99Handler		mmioFOURCC('M','W','9','9')
#define MVC1Handler		mmioFOURCC('M','W','C','1')
#define MVC2Handler		mmioFOURCC('M','W','C','2')
#define MVC9Handler		mmioFOURCC('M','W','C','9')
#define MVC9Handler		mmioFOURCC('M','W','C','9')
#define MWV1Handler		mmioFOURCC('M','W','V','1')
#define MYUVHandler		mmioFOURCC('M','Y','U','V')
#define NAVIHandler		mmioFOURCC('N','A','V','I')
#define NHVUHandler		mmioFOURCC('N','H','V','U')
#define NT00Handler		mmioFOURCC('N','T','0','0')
#define NTN1Handler		mmioFOURCC('N','T','N','1')
#define NUV1Handler		mmioFOURCC('N','U','V','1')
#define NV12Handler		mmioFOURCC('N','V','1','2')
#define NV21Handler		mmioFOURCC('N','V','2','1')
#define NVDSHandler		mmioFOURCC('N','V','D','S')
#define NVHSHandler		mmioFOURCC('N','V','H','S')
#define NVHUHandler		mmioFOURCC('N','V','H','U')
#define NVS0Handler		mmioFOURCC('N','V','S','0')
#define NVS1Handler		mmioFOURCC('N','V','S','1')
#define NVS2Handler		mmioFOURCC('N','V','S','2')
#define NVS3Handler		mmioFOURCC('N','V','S','3')
#define NVS4Handler		mmioFOURCC('N','V','S','4')
#define NVS5Handler		mmioFOURCC('N','V','S','5')
#define NVS6Handler		mmioFOURCC('N','V','S','6')
#define NVS7Handler		mmioFOURCC('N','V','S','7')
#define NVS8Handler		mmioFOURCC('N','V','S','8')
#define NVS9Handler		mmioFOURCC('N','V','S','9')
#define NVT0Handler		mmioFOURCC('N','V','T','0')
#define NVT1Handler		mmioFOURCC('N','V','T','1')
#define NVT2Handler		mmioFOURCC('N','V','T','2')
#define NVT3Handler		mmioFOURCC('N','V','T','3')
#define NVT4Handler		mmioFOURCC('N','V','T','4')
#define NVT5Handler		mmioFOURCC('N','V','T','5')
#define NVT6Handler		mmioFOURCC('N','V','T','6')
#define NVT7Handler		mmioFOURCC('N','V','T','7')
#define NVT8Handler		mmioFOURCC('N','V','T','8')
#define NVT9Handler		mmioFOURCC('N','V','T','9')
#define NY12Handler		mmioFOURCC('N','Y','1','2')
#define NYUVHandler		mmioFOURCC('N','Y','U','V')
#define PATHHandler		mmioFOURCC('P','A','T','H')
#define PCL2Handler		mmioFOURCC('P','C','L','2')
#define PCLEHandler		mmioFOURCC('P','C','L','E')
#define PDVCHandler		mmioFOURCC('P','D','V','C')
#define PGVVHandler		mmioFOURCC('P','G','V','V')
#define PHMOHandler		mmioFOURCC('P','H','M','O')
#define PIM1Handler		mmioFOURCC('P','I','M','1')
#define PIM2Handler		mmioFOURCC('P','I','M','2')
#define PIMJHandler		mmioFOURCC('P','I','M','J')
#define PIXLHandler		mmioFOURCC('P','I','X','L')
#define PNGHandler		mmioFOURCC('P','N','G',' ')
#define PNTGHandler		mmioFOURCC('P','N','T','G')
#define PVEZHandler		mmioFOURCC('P','V','E','Z')
#define PVMMHandler		mmioFOURCC('P','V','M','M')
#define PVW2Handler		mmioFOURCC('P','V','W','2')
#define PXLTHandler		mmioFOURCC('P','X','L','T')
#define Q1_0Handler		mmioFOURCC('Q','1','.','0')
#define Q1_1Handler		mmioFOURCC('Q','1','.','1')
#define QDRWHandler		mmioFOURCC('Q','D','R','W')
#define QDGXHandler		mmioFOURCC('Q','D','G','X')
#define QPEGHandler		mmioFOURCC('Q','P','E','G')
#define QPEQHandler		mmioFOURCC('Q','P','E','Q')
#define R408Handler		mmioFOURCC('R','4','0','8')
#define RAWHandler		mmioFOURCC('R','A','W',' ')
#define RGBHandler		mmioFOURCC('R','G','B',' ')
#define RGB1Handler		mmioFOURCC('R','G','B','1')
#define RGBAHandler		mmioFOURCC('R','G','B','A')
#define RGBOHandler		mmioFOURCC('R','G','B','O')
#define RGBPHandler		mmioFOURCC('R','G','B','P')
#define RGBQHandler		mmioFOURCC('R','G','B','Q')
#define RGBRHandler		mmioFOURCC('R','G','B','R')
#define RGBTHandler		mmioFOURCC('R','G','B','T')
#define RIPLHandler		mmioFOURCC('R','I','P','L')
#define RIVAHandler		mmioFOURCC('R','I','V','A')
#define RPZAHandler		mmioFOURCC('R','P','Z','A')
#define RLE4Handler		mmioFOURCC('R','L','E','4')
#define RLE8Handler		mmioFOURCC('R','L','E','8')
#define RLEHandler		mmioFOURCC('R','L','E',' ')
#define RLNDHandler		mmioFOURCC('R','L','N','D')
#define RT21Handler		mmioFOURCC('R','T','2','1')
#define RVXHandler		mmioFOURCC('R','V','X',' ')
#define RMP4Handler		mmioFOURCC('R','M','P','4')
#define ROQVHandler		mmioFOURCC('R','O','Q','V')
#define S263Handler		mmioFOURCC('S','2','6','3')
#define S263Handler		mmioFOURCC('S','2','6','3')
#define SCREHandler		mmioFOURCC('S','C','R','E')
#define SEDGHandler		mmioFOURCC('S','E','D','G')
#define SCREHandler		mmioFOURCC('S','C','R','E')
#define SMCHandler		mmioFOURCC('S','M','C',' ')
#define SMYKHandler		mmioFOURCC('S','M','Y','K')
#define SP53Handler		mmioFOURCC('S','P','5','3')
#define SP54Handler		mmioFOURCC('S','P','5','4')
#define SP55Handler		mmioFOURCC('S','P','5','5')
#define SP56Handler		mmioFOURCC('S','P','5','6')
#define SP57Handler		mmioFOURCC('S','P','5','7')
#define SP58Handler		mmioFOURCC('S','P','5','8')
#define SPIGHandler		mmioFOURCC('S','P','I','G')
#define SPLCHandler		mmioFOURCC('S','P','L','C')
#define SQZ2Handler		mmioFOURCC('S','Q','Z','2')
#define STVAHandler		mmioFOURCC('S','T','V','A')
#define STVBHandler		mmioFOURCC('S','T','V','B')
#define STVCHandler		mmioFOURCC('S','T','V','C')
#define STVXHandler		mmioFOURCC('S','T','V','X')
#define STVYHandler		mmioFOURCC('S','T','V','Y')
#define SV10Handler		mmioFOURCC('S','V','1','0')
#define SVQ1Handler		mmioFOURCC('S','V','Q','1')
#define SVQ3Handler		mmioFOURCC('S','V','Q','3')
#define SWC1Handler		mmioFOURCC('S','W','C','1')
#define SYV9Handler		mmioFOURCC('S','Y','V','9')
#define T420Handler		mmioFOURCC('T','4','2','0')
#define TGAHandler		mmioFOURCC('T','G','A',' ')
#define THEOHandler		mmioFOURCC('T','H','E','O')
#define TIFFHandler		mmioFOURCC('T','I','F','F')
#define TIM2Handler		mmioFOURCC('T','I','M','2')
#define TLMSHandler		mmioFOURCC('T','L','M','S')
#define TLSTHandler		mmioFOURCC('T','L','S','T')
#define TM20Handler		mmioFOURCC('T','M','2','0')
#define TM2AHandler		mmioFOURCC('T','M','2','A')
#define TM2XHandler		mmioFOURCC('T','M','2','X')
#define TMICHandler		mmioFOURCC('T','M','I','C')
#define TMOTHandler		mmioFOURCC('T','M','O','T')
#define TR20Handler		mmioFOURCC('T','R','2','0')
#define TSCCHandler		mmioFOURCC('T','S','C','C')
#define TV10Handler		mmioFOURCC('T','V','1','0')
#define TVJPHandler		mmioFOURCC('T','V','J','P')
#define TVMJHandler		mmioFOURCC('T','V','M','J')
#define TY0NHandler		mmioFOURCC('T','Y','0','N')
#define TY2CHandler		mmioFOURCC('T','Y','2','C')
#define TY2NHandler		mmioFOURCC('T','Y','2','N')
#define U263Handler		mmioFOURCC('U','2','6','3')
#define UCODHandler		mmioFOURCC('U','C','O','D')
#define ULTIHandler		mmioFOURCC('U','L','T','I')
#define UMP4Handler		mmioFOURCC('U','M','P','4')
#define UYNVHandler		mmioFOURCC('U','Y','N','V')
#define UYVPHandler		mmioFOURCC('U','Y','V','P')
#define UYVYHandler		mmioFOURCC('U','Y','V','Y')
#define V210Handler		mmioFOURCC('V','2','1','0')
#define V216Handler		mmioFOURCC('V','2','1','6')
#define V261Handler		mmioFOURCC('V','2','6','1')
#define V308Handler		mmioFOURCC('V','3','0','8')
#define V408Handler		mmioFOURCC('V','4','0','8')
#define V410Handler		mmioFOURCC('V','4','1','0')
#define V422Handler		mmioFOURCC('V','4','2','2')
#define V655Handler		mmioFOURCC('V','6','5','5')
#define VCR1Handler		mmioFOURCC('V','C','R','1')
#define VCR2Handler		mmioFOURCC('V','C','R','2')
#define VCR3Handler		mmioFOURCC('V','C','R','3')
#define VCR4Handler		mmioFOURCC('V','C','R','4')
#define VCR5Handler		mmioFOURCC('V','C','R','5')
#define VCR6Handler		mmioFOURCC('V','C','R','6')
#define VCR7Handler		mmioFOURCC('V','C','R','7')
#define VCR8Handler		mmioFOURCC('V','C','R','8')
#define VCR9Handler		mmioFOURCC('V','C','R','9')
#define VDCTHandler		mmioFOURCC('V','D','C','T')
#define VDOMHandler		mmioFOURCC('V','D','O','M')
#define VDOWHandler		mmioFOURCC('V','D','O','W')
#define VDSTHandler		mmioFOURCC('V','D','S','T')
#define VDTZHandler		mmioFOURCC('V','D','T','Z')
#define VGPXHandler		mmioFOURCC('V','G','P','X')
#define VIDSHandler		mmioFOURCC('V','I','D','S')
#define VIFPHandler		mmioFOURCC('V','I','F','P')
#define VIV1Handler		mmioFOURCC('V','I','V','1')
#define VIV2Handler		mmioFOURCC('V','I','V','2')
#define VIVOHandler		mmioFOURCC('V','I','V','O')
#define VIXLHandler		mmioFOURCC('V','I','X','L')
#define VLV1Handler		mmioFOURCC('V','L','V','1')
#define VP3_Handler		mmioFOURCC('V','P','3',' ')
#define VP30Handler		mmioFOURCC('V','P','3','0')
#define VP31Handler		mmioFOURCC('V','P','3','1')
#define VP5_Handler		mmioFOURCC('V','P','5',' ')
#define VP50Handler		mmioFOURCC('V','P','5','0')
#define VP6_Handler		mmioFOURCC('V','P','6',' ')
#define VP60Handler		mmioFOURCC('V','P','6','0')
#define VP61Handler		mmioFOURCC('V','P','6','1')
#define VP62Handler		mmioFOURCC('V','P','6','2')
#define VP6AHandler		mmioFOURCC('V','P','6','A')
#define VP6FHandler		mmioFOURCC('V','P','6','F')
#define VP8_Handler		mmioFOURCC('V','P','8',' ')
#define VQC1Handler		mmioFOURCC('V','Q','C','F')
#define VQC2Handler		mmioFOURCC('V','Q','C','2')
#define VQJPHandler		mmioFOURCC('V','Q','J','P')
#define VQS4Handler		mmioFOURCC('V','Q','S','4')
#define VSSVHandler		mmioFOURCC('V','S','S','V')
#define VTC1Handler		mmioFOURCC('V','T','C','1')
#define VTC2Handler		mmioFOURCC('V','T','C','2')
#define VTC3Handler		mmioFOURCC('V','T','C','3')
#define VTC4Handler		mmioFOURCC('V','T','C','4')
#define VTC5Handler		mmioFOURCC('V','T','C','5')
#define VTC6Handler		mmioFOURCC('V','T','C','6')
#define VTC7Handler		mmioFOURCC('V','T','C','7')
#define VTC8Handler		mmioFOURCC('V','T','C','8')
#define VTC9Handler		mmioFOURCC('V','T','C','9')
#define VTLPHandler		mmioFOURCC('V','T','L','P')
#define VUY2Handler		mmioFOURCC('2','V','U','Y')
#define VX1KHandler		mmioFOURCC('V','X','1','K')
#define VX2KHandler		mmioFOURCC('V','X','2','K')
#define VXSPHandler		mmioFOURCC('V','X','S','P')
#define VYU9Handler		mmioFOURCC('V','Y','U','9')
#define VYUYHandler		mmioFOURCC('V','Y','U','Y')
#define WBVCHandler		mmioFOURCC('W','B','V','C')
#define WHAMHandler		mmioFOURCC('W','H','A','M')
#define WINXHandler		mmioFOURCC('W','I','N','X')
#define WJPGHandler		mmioFOURCC('W','J','P','G')
#define WMS2Handler		mmioFOURCC('W','M','S','2')
#define WMV1Handler		mmioFOURCC('W','M','V','1')
#define WMV2Handler		mmioFOURCC('W','M','V','2')
#define WMV3Handler		mmioFOURCC('W','M','V','3')
#define WMVAHandler		mmioFOURCC('W','M','V','A')
#define WMVPHandler     mmioFOURCC('W','M','V','P')
#define WNV1Handler		mmioFOURCC('W','N','V','1')
#define WNVAHandler		mmioFOURCC('W','N','V','A')
#define WPY2Handler		mmioFOURCC('W','P','Y','2')
#define WRAWHandler		mmioFOURCC('W','R','A','W')
#define WRLEHandler		mmioFOURCC('W','R','L','E')
#define WRPRHandler		mmioFOURCC('W','R','P','R')
#define WV1FHandler		mmioFOURCC('W','V','1','F')
#define WVP1Handler		mmioFOURCC('W','V','P','1')
#define WVC1Handler		mmioFOURCC('W','V','C','1')
#define WVP2Handler		mmioFOURCC('W','V','P','2')
#define WZCDHandler		mmioFOURCC('W','Z','C','D')
#define WZDCHandler		mmioFOURCC('W','Z','D','C')
#define X263Handler		mmioFOURCC('X','2','6','3')
#define X264Handler		mmioFOURCC('X','2','6','4')
#define XLV0Handler		mmioFOURCC('X','L','V','0')
#define XJPGHandler		mmioFOURCC('X','J','P','G')
#define XMPGHandler		mmioFOURCC('X','M','P','G')
#define XVIDHandler		mmioFOURCC('X','V','I','D')
#define XVIXHandler		mmioFOURCC('X','V','I','X')
#define XWV0Handler		mmioFOURCC('X','W','V','0')
#define XWV1Handler		mmioFOURCC('X','W','V','1')
#define XWV2Handler		mmioFOURCC('X','W','V','2')
#define XWV3Handler		mmioFOURCC('X','W','V','3')
#define XWV4Handler		mmioFOURCC('X','W','V','4')
#define XWV5Handler		mmioFOURCC('X','W','V','5')
#define XWV6Handler		mmioFOURCC('X','W','V','6')
#define XWV7Handler		mmioFOURCC('X','W','V','7')
#define XWV8Handler		mmioFOURCC('X','W','V','8')
#define XWV9Handler		mmioFOURCC('X','W','V','9')
#define XXANHandler		mmioFOURCC('X','X','A','N')
#define Y211Handler		mmioFOURCC('Y','2','1','1')
#define Y411Handler		mmioFOURCC('Y','4','1','1')
#define Y41BHandler		mmioFOURCC('Y','4','1','B')
#define Y41PHandler		mmioFOURCC('Y','4','1','P')
#define Y41THandler		mmioFOURCC('Y','4','1','T')
#define Y420Handler		mmioFOURCC('Y','4','2','0')
#define Y422Handler		mmioFOURCC('Y','4','2','2')
#define Y42BHandler		mmioFOURCC('Y','4','2','B')
#define Y42THandler		mmioFOURCC('Y','4','2','T')
#define Y800Handler		mmioFOURCC('Y','8','0','0')
#define Y8Handler		mmioFOURCC('Y','8',' ',' ')
#define YC12Handler		mmioFOURCC('Y','C','1','2')
#define YCCKHandler		mmioFOURCC('Y','C','C','K')
#define YU92Handler		mmioFOURCC('Y','U','9','2')
#define YUNVHandler		mmioFOURCC('Y','U','N','V')
#define YUV2Handler		mmioFOURCC('Y','U','V','2')
#define YUV8Handler		mmioFOURCC('Y','U','V','8')
#define YUV9Handler		mmioFOURCC('Y','U','V','9')
#define YUVPHandler		mmioFOURCC('Y','U','V','P')
#define YUY2Handler		mmioFOURCC('Y','U','Y','2')
#define YUVSHandler		mmioFOURCC('Y','U','V','S')
#define YUVUHandler		mmioFOURCC('Y','U','V','U')
#define YUYVHandler		mmioFOURCC('Y','U','Y','V')
#define YV12Handler		mmioFOURCC('Y','V','1','2')
#define YV16Handler		mmioFOURCC('Y','V','1','6')
#define YV24Handler		mmioFOURCC('Y','V','2','4')
#define YVU9Handler		mmioFOURCC('Y','V','U','9')
#define YVYUHandler		mmioFOURCC('Y','V','Y','U')
#define ZLIBHandler		mmioFOURCC('Z','L','I','B')
#define ZPEGHandler		mmioFOURCC('Z','P','E','G')
#define ZPG1Handler		mmioFOURCC('Z','P','G','1')
#define ZPG2Handler		mmioFOURCC('Z','P','G','2')
#define ZPG3Handler		mmioFOURCC('Z','P','G','3')
#define ZPG4Handler		mmioFOURCC('Z','P','G','4')
#define ZYGOHandler		mmioFOURCC('Z','Y','G','O')

const static LONG GetInternalVideoCodecByFourCC(DWORD fccHandler)
{
	LONG	InternalCodecType=0;
	fccHandler=UPPERCASEFOURCC(fccHandler);

	bool	not_found=false;
	while (!not_found)
	{
		switch (fccHandler)
		{
		case MPG1Handler:
		case AEMIHandler:
		case MPEGHandler:
		case MPGIHandler:
		case PIM1Handler:

		case MPG2Handler:
		case EM2VHandler:
		case MMESHandler:
		case MMIFHandler:
		case MP2VHandler:
		case HDV9Handler:
			InternalCodecType=MPEG2_INTERNALCODEC;
			break;
		case D263Handler:
		case H263Handler:
		case H269Handler:
		case I263Handler:
		case ILVRHandler:
		case L263Handler:
		case M263Handler:
		case U263Handler:
		case VDOWHandler:
		case VIV1Handler:
		case VIV2Handler:
		case VIVOHandler:
		case X263Handler:
			InternalCodecType=FF_H263P_INTERNALCODEC;
			break;
		case SCREHandler:
			InternalCodecType = FF_FLASHSV_INTERNALCODEC;
			break;
		case S263Handler:
			InternalCodecType=FF_FLV_INTERNALCODEC;
			break;
		case SVQ1Handler:
			InternalCodecType=FF_SVQ1_INTERNALCODEC;
			break;
		case SVQ3Handler:
			InternalCodecType=FF_SVQ3_INTERNALCODEC;
			break;
		case ADVJHandler:
		case AVDJHandler:
		case AVI1Handler:
		case AVI2Handler:
		case AVRHandler:
		case AVRNHandler:
		case CFCCHandler:
		case CJPGHandler:
		case DJPGHandler:
		case DMB1Handler:
		case DMB2Handler:
		case DPS0Handler:
		case DPSCHandler:
		case FLJPHandler:
		case FRWAHandler:
		case FRWDHandler:
		case FRWTHandler:
		case GEPJHandler:
		case GPEGHandler:
		case IJPGHandler:
		case JFIFHandler:
		case JPEGHandler:
		case JPGLHandler:
		case MC24Handler:
		case MJPAHandler:
		case MJPGHandler:

		case MTX1Handler:
		case MTX2Handler:
		case MTX3Handler:
		case MTX4Handler:
		case MTX5Handler:
		case MTX6Handler:
		case MTX7Handler:
		case MTX8Handler:
		case MTX9Handler:

		case PGVVHandler:
		case PIXLHandler:
		case SWC1Handler:
		case TVJPHandler:
		case TVMJHandler:
		case VIXLHandler:
		case WJPGHandler:
		case XJPGHandler:
			InternalCodecType=FF_MJPEG_INTERNALCODEC;
			break;
		case MJPBHandler:
			InternalCodecType=FF_MJPEGB_INTERNALCODEC;
			break;
		case LJPGHandler:
		case PIMJHandler:
			InternalCodecType=FF_LJPEG_INTERNALCODEC;
			break;
		case MJP2Handler:
			InternalCodecType=FF_JPEG2000_INTERNALCODEC;
			break;
		case CDVCHandler:
		case DSVDHandler:
		case DVCHandler:
		case DVCPHandler:
		case DVCSHandler:
		case DVHDHandler:
		case DVSDHandler:
		case DVSLHandler:
		case IPDVHandler:
		case PDVCHandler:
			InternalCodecType=FF_DV_INTERNALCODEC;
			break;
		case IR21Handler:
		case RT21Handler:
			InternalCodecType=FF_INDEO2_INTERNALCODEC;
			break;
		case IV30Handler:
		case IV31Handler:
		case IV32Handler:
		case IV33Handler:
		case IV34Handler:
		case IV35Handler:
		case IV36Handler:
		case IV37Handler:
		case IV38Handler:
		case IV39Handler:
			InternalCodecType=FF_INDEO3_INTERNALCODEC;
			break;
		case CVIDHandler:
			InternalCodecType=FF_CINEPAK_INTERNALCODEC;
			break;

		case FVFWHandler:
		case RMP4Handler:
		case XVIDHandler:
		case XVIXHandler:
		case DIV4Handler:
		case DIV5Handler:
		case DIV6Handler:
		case DIVXHandler:

			InternalCodecType=XVID_INTERNALCODEC;
			break;
		case DX50Handler:		
		case BLZ0Handler:
		case DP02Handler:
		case FMP4Handler:
		case M4S2Handler:
		case MDVDHandler:
		case MP4SHandler:
		case MP4VHandler:
		case NAVIHandler:
		case _3IV0Handler:
		case _3IV1Handler:
		case _3IV2Handler:
		case _3IVXHandler:
			InternalCodecType=FF_MSMPEG4_INTERNALCODEC;
			break;

		case DIV1Handler:
		case MP41Handler:
		case MPG4Handler:
			InternalCodecType=FF_MSMPEG4V1_INTERNALCODEC;
			break;

		case DIV2Handler:
		case MP42Handler:
			InternalCodecType=FF_MSMPEG4V2_INTERNALCODEC;
			break;

		case _3IVDHandler:
		case COL0Handler:
		case COL1Handler:
		case DIV3Handler:
		case MP43Handler:
			InternalCodecType=FF_MSMPEG4V3_INTERNALCODEC;
			break;

		case AVC1Handler:
		case H264Handler:
		case X264Handler:
			InternalCodecType=FF_H264_INTERNALCODEC;
			break;

		case WMV1Handler:
			InternalCodecType = FF_WMV7_INTERNALCODEC;
			break;

		case WMV2Handler:
			InternalCodecType = FF_WMV8_INTERNALCODEC;
			break;

		case WMV3Handler:
			InternalCodecType = FF_WMV9_INTERNALCODEC;
			break;

		case WVC1Handler:
			InternalCodecType = FF_VC1_INTERNALCODEC;
			break;

		case VP3_Handler:
		case VP30Handler:
		case VP31Handler:
			InternalCodecType = FF_ON2VP3_INTERNALCODEC;
			break;

		case VP5_Handler:
		case VP50Handler:
			InternalCodecType = FF_ON2VP5_INTERNALCODEC;
			break;

		case VP6_Handler:
		case VP60Handler:
		case VP61Handler:
		case VP62Handler:
			InternalCodecType = FF_ON2VP6_INTERNALCODEC;
			break;

		case VP6AHandler:
		case VP6FHandler:
		case FLV4Handler:
			InternalCodecType = FF_ON2VP6F_INTERNALCODEC;
			break;

		case RV10Handler:
			InternalCodecType = FF_RV10_INTERNALCODEC;
			break;

		case RV20Handler:
			InternalCodecType = FF_RV20_INTERNALCODEC;
			break;

		case RV30Handler:
			InternalCodecType = FF_RV30_INTERNALCODEC;
			break;

		case RV40Handler:
			InternalCodecType = FF_RV40_INTERNALCODEC;
			break;

		case FPS1Handler:
			InternalCodecType = FF_FRAPS_INTERNALCODEC;
			break;


		case IYUVHandler:
			InternalCodecType = UNCOMPRESSEDVIDEO_INTERNALCODEC;
			break;
		default:
			not_found=true;
			break;
		}

		if (not_found)
		{
			DWORD	fccHandler2=LOWERCASEFOURCC(fccHandler);
			not_found=(fccHandler==fccHandler2);
			fccHandler=fccHandler2;
		} else
			break;
	}

	return InternalCodecType;
}


#endif // #ifndef _FOURCCDEFINES_H_	// For Borland compiler