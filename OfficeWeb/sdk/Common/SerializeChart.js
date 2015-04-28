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
 "use strict";
var st_pagesetuporientationDEFAULT = 0;
var st_pagesetuporientationPORTRAIT = 1;
var st_pagesetuporientationLANDSCAPE = 2;
var st_dispblanksasSPAN = 0;
var st_dispblanksasGAP = 1;
var st_dispblanksasZERO = 2;
var st_legendposB = 0;
var st_legendposTR = 1;
var st_legendposL = 2;
var st_legendposR = 3;
var st_legendposT = 4;
var st_layouttargetINNER = 0;
var st_layouttargetOUTER = 1;
var st_layoutmodeEDGE = 0;
var st_layoutmodeFACTOR = 1;
var st_orientationMAXMIN = 0;
var st_orientationMINMAX = 1;
var st_axposB = 0;
var st_axposL = 1;
var st_axposR = 2;
var st_axposT = 3;
var st_tickmarkCROSS = 0;
var st_tickmarkIN = 1;
var st_tickmarkNONE = 2;
var st_tickmarkOUT = 3;
var st_ticklblposHIGH = 0;
var st_ticklblposLOW = 1;
var st_ticklblposNEXTTO = 2;
var st_ticklblposNONE = 3;
var st_crossesAUTOZERO = 0;
var st_crossesMAX = 1;
var st_crossesMIN = 2;
var st_timeunitDAYS = 0;
var st_timeunitMONTHS = 1;
var st_timeunitYEARS = 2;
var st_lblalgnCTR = 0;
var st_lblalgnL = 1;
var st_lblalgnR = 2;
var st_builtinunitHUNDREDS = 0;
var st_builtinunitTHOUSANDS = 1;
var st_builtinunitTENTHOUSANDS = 2;
var st_builtinunitHUNDREDTHOUSANDS = 3;
var st_builtinunitMILLIONS = 4;
var st_builtinunitTENMILLIONS = 5;
var st_builtinunitHUNDREDMILLIONS = 6;
var st_builtinunitBILLIONS = 7;
var st_builtinunitTRILLIONS = 8;
var st_crossbetweenBETWEEN = 0;
var st_crossbetweenMIDCAT = 1;
var st_sizerepresentsAREA = 0;
var st_sizerepresentsW = 1;
var st_markerstyleCIRCLE = 0;
var st_markerstyleDASH = 1;
var st_markerstyleDIAMOND = 2;
var st_markerstyleDOT = 3;
var st_markerstyleNONE = 4;
var st_markerstylePICTURE = 5;
var st_markerstylePLUS = 6;
var st_markerstyleSQUARE = 7;
var st_markerstyleSTAR = 8;
var st_markerstyleTRIANGLE = 9;
var st_markerstyleX = 10;
var st_markerstyleAUTO = 11;
var st_pictureformatSTRETCH = 0;
var st_pictureformatSTACK = 1;
var st_pictureformatSTACKSCALE = 2;
var st_dlblposBESTFIT = 0;
var st_dlblposB = 1;
var st_dlblposCTR = 2;
var st_dlblposINBASE = 3;
var st_dlblposINEND = 4;
var st_dlblposL = 5;
var st_dlblposOUTEND = 6;
var st_dlblposR = 7;
var st_dlblposT = 8;
var st_trendlinetypeEXP = 0;
var st_trendlinetypeLINEAR = 1;
var st_trendlinetypeLOG = 2;
var st_trendlinetypeMOVINGAVG = 3;
var st_trendlinetypePOLY = 4;
var st_trendlinetypePOWER = 5;
var st_errdirX = 0;
var st_errdirY = 1;
var st_errbartypeBOTH = 0;
var st_errbartypeMINUS = 1;
var st_errbartypePLUS = 2;
var st_errvaltypeCUST = 0;
var st_errvaltypeFIXEDVAL = 1;
var st_errvaltypePERCENTAGE = 2;
var st_errvaltypeSTDDEV = 3;
var st_errvaltypeSTDERR = 4;
var st_splittypeAUTO = 0;
var st_splittypeCUST = 1;
var st_splittypePERCENT = 2;
var st_splittypePOS = 3;
var st_splittypeVAL = 4;
var st_ofpietypePIE = 0;
var st_ofpietypeBAR = 1;
var st_bardirBAR = 0;
var st_bardirCOL = 1;
var st_bargroupingPERCENTSTACKED = 0;
var st_bargroupingCLUSTERED = 1;
var st_bargroupingSTANDARD = 2;
var st_bargroupingSTACKED = 3;
var st_shapeCONE = 0;
var st_shapeCONETOMAX = 1;
var st_shapeBOX = 2;
var st_shapeCYLINDER = 3;
var st_shapePYRAMID = 4;
var st_shapePYRAMIDTOMAX = 5;
var st_scatterstyleNONE = 0;
var st_scatterstyleLINE = 1;
var st_scatterstyleLINEMARKER = 2;
var st_scatterstyleMARKER = 3;
var st_scatterstyleSMOOTH = 4;
var st_scatterstyleSMOOTHMARKER = 5;
var st_radarstyleSTANDARD = 0;
var st_radarstyleMARKER = 1;
var st_radarstyleFILLED = 2;
var st_groupingPERCENTSTACKED = 0;
var st_groupingSTANDARD = 1;
var st_groupingSTACKED = 2;
var c_oserct_extlstEXT = 0;
var c_oserct_chartspaceDATE1904 = 0;
var c_oserct_chartspaceLANG = 1;
var c_oserct_chartspaceROUNDEDCORNERS = 2;
var c_oserct_chartspaceALTERNATECONTENT = 3;
var c_oserct_chartspaceSTYLE = 4;
var c_oserct_chartspaceCLRMAPOVR = 5;
var c_oserct_chartspacePIVOTSOURCE = 6;
var c_oserct_chartspacePROTECTION = 7;
var c_oserct_chartspaceCHART = 8;
var c_oserct_chartspaceSPPR = 9;
var c_oserct_chartspaceTXPR = 10;
var c_oserct_chartspaceEXTERNALDATA = 11;
var c_oserct_chartspacePRINTSETTINGS = 12;
var c_oserct_chartspaceUSERSHAPES = 13;
var c_oserct_chartspaceEXTLST = 14;
var c_oserct_chartspaceTHEMEOVERRIDE = 15;
var c_oserct_booleanVAL = 0;
var c_oserct_relidID = 0;
var c_oserct_pagesetupPAPERSIZE = 0;
var c_oserct_pagesetupPAPERHEIGHT = 1;
var c_oserct_pagesetupPAPERWIDTH = 2;
var c_oserct_pagesetupFIRSTPAGENUMBER = 3;
var c_oserct_pagesetupORIENTATION = 4;
var c_oserct_pagesetupBLACKANDWHITE = 5;
var c_oserct_pagesetupDRAFT = 6;
var c_oserct_pagesetupUSEFIRSTPAGENUMBER = 7;
var c_oserct_pagesetupHORIZONTALDPI = 8;
var c_oserct_pagesetupVERTICALDPI = 9;
var c_oserct_pagesetupCOPIES = 10;
var c_oserct_pagemarginsL = 0;
var c_oserct_pagemarginsR = 1;
var c_oserct_pagemarginsT = 2;
var c_oserct_pagemarginsB = 3;
var c_oserct_pagemarginsHEADER = 4;
var c_oserct_pagemarginsFOOTER = 5;
var c_oserct_headerfooterODDHEADER = 0;
var c_oserct_headerfooterODDFOOTER = 1;
var c_oserct_headerfooterEVENHEADER = 2;
var c_oserct_headerfooterEVENFOOTER = 3;
var c_oserct_headerfooterFIRSTHEADER = 4;
var c_oserct_headerfooterFIRSTFOOTER = 5;
var c_oserct_headerfooterALIGNWITHMARGINS = 6;
var c_oserct_headerfooterDIFFERENTODDEVEN = 7;
var c_oserct_headerfooterDIFFERENTFIRST = 8;
var c_oserct_printsettingsHEADERFOOTER = 0;
var c_oserct_printsettingsPAGEMARGINS = 1;
var c_oserct_printsettingsPAGESETUP = 2;
var c_oserct_externaldataAUTOUPDATE = 0;
var c_oserct_externaldataID = 1;
var c_oserct_dispblanksasVAL = 0;
var c_oserct_legendentryIDX = 0;
var c_oserct_legendentryDELETE = 1;
var c_oserct_legendentryTXPR = 2;
var c_oserct_legendentryEXTLST = 3;
var c_oserct_unsignedintVAL = 0;
var c_oserct_extensionANY = 0;
var c_oserct_extensionURI = 1;
var c_oserct_legendposVAL = 0;
var c_oserct_legendLEGENDPOS = 0;
var c_oserct_legendLEGENDENTRY = 1;
var c_oserct_legendLAYOUT = 2;
var c_oserct_legendOVERLAY = 3;
var c_oserct_legendSPPR = 4;
var c_oserct_legendTXPR = 5;
var c_oserct_legendEXTLST = 6;
var c_oserct_layoutMANUALLAYOUT = 0;
var c_oserct_layoutEXTLST = 1;
var c_oserct_manuallayoutLAYOUTTARGET = 0;
var c_oserct_manuallayoutXMODE = 1;
var c_oserct_manuallayoutYMODE = 2;
var c_oserct_manuallayoutWMODE = 3;
var c_oserct_manuallayoutHMODE = 4;
var c_oserct_manuallayoutX = 5;
var c_oserct_manuallayoutY = 6;
var c_oserct_manuallayoutW = 7;
var c_oserct_manuallayoutH = 8;
var c_oserct_manuallayoutEXTLST = 9;
var c_oserct_layouttargetVAL = 0;
var c_oserct_layoutmodeVAL = 0;
var c_oserct_doubleVAL = 0;
var c_oserct_dtableSHOWHORZBORDER = 0;
var c_oserct_dtableSHOWVERTBORDER = 1;
var c_oserct_dtableSHOWOUTLINE = 2;
var c_oserct_dtableSHOWKEYS = 3;
var c_oserct_dtableSPPR = 4;
var c_oserct_dtableTXPR = 5;
var c_oserct_dtableEXTLST = 6;
var c_oserct_seraxAXID = 0;
var c_oserct_seraxSCALING = 1;
var c_oserct_seraxDELETE = 2;
var c_oserct_seraxAXPOS = 3;
var c_oserct_seraxMAJORGRIDLINES = 4;
var c_oserct_seraxMINORGRIDLINES = 5;
var c_oserct_seraxTITLE = 6;
var c_oserct_seraxNUMFMT = 7;
var c_oserct_seraxMAJORTICKMARK = 8;
var c_oserct_seraxMINORTICKMARK = 9;
var c_oserct_seraxTICKLBLPOS = 10;
var c_oserct_seraxSPPR = 11;
var c_oserct_seraxTXPR = 12;
var c_oserct_seraxCROSSAX = 13;
var c_oserct_seraxCROSSES = 14;
var c_oserct_seraxCROSSESAT = 15;
var c_oserct_seraxTICKLBLSKIP = 16;
var c_oserct_seraxTICKMARKSKIP = 17;
var c_oserct_seraxEXTLST = 18;
var c_oserct_scalingLOGBASE = 0;
var c_oserct_scalingORIENTATION = 1;
var c_oserct_scalingMAX = 2;
var c_oserct_scalingMIN = 3;
var c_oserct_scalingEXTLST = 4;
var c_oserct_logbaseVAL = 0;
var c_oserct_orientationVAL = 0;
var c_oserct_axposVAL = 0;
var c_oserct_chartlinesSPPR = 0;
var c_oserct_titleTX = 0;
var c_oserct_titleLAYOUT = 1;
var c_oserct_titleOVERLAY = 2;
var c_oserct_titleSPPR = 3;
var c_oserct_titleTXPR = 4;
var c_oserct_titleEXTLST = 5;
var c_oserct_txRICH = 0;
var c_oserct_txSTRREF = 1;
var c_oserct_strrefF = 0;
var c_oserct_strrefSTRCACHE = 1;
var c_oserct_strrefEXTLST = 2;
var c_oserct_strdataPTCOUNT = 0;
var c_oserct_strdataPT = 1;
var c_oserct_strdataEXTLST = 2;
var c_oserct_strvalV = 0;
var c_oserct_strvalIDX = 1;
var c_oserct_numfmtFORMATCODE = 0;
var c_oserct_numfmtSOURCELINKED = 1;
var c_oserct_tickmarkVAL = 0;
var c_oserct_ticklblposVAL = 0;
var c_oserct_crossesVAL = 0;
var c_oserct_skipVAL = 0;
var c_oserct_timeunitVAL = 0;
var c_oserct_dateaxAXID = 0;
var c_oserct_dateaxSCALING = 1;
var c_oserct_dateaxDELETE = 2;
var c_oserct_dateaxAXPOS = 3;
var c_oserct_dateaxMAJORGRIDLINES = 4;
var c_oserct_dateaxMINORGRIDLINES = 5;
var c_oserct_dateaxTITLE = 6;
var c_oserct_dateaxNUMFMT = 7;
var c_oserct_dateaxMAJORTICKMARK = 8;
var c_oserct_dateaxMINORTICKMARK = 9;
var c_oserct_dateaxTICKLBLPOS = 10;
var c_oserct_dateaxSPPR = 11;
var c_oserct_dateaxTXPR = 12;
var c_oserct_dateaxCROSSAX = 13;
var c_oserct_dateaxCROSSES = 14;
var c_oserct_dateaxCROSSESAT = 15;
var c_oserct_dateaxAUTO = 16;
var c_oserct_dateaxLBLOFFSET = 17;
var c_oserct_dateaxBASETIMEUNIT = 18;
var c_oserct_dateaxMAJORUNIT = 19;
var c_oserct_dateaxMAJORTIMEUNIT = 20;
var c_oserct_dateaxMINORUNIT = 21;
var c_oserct_dateaxMINORTIMEUNIT = 22;
var c_oserct_dateaxEXTLST = 23;
var c_oserct_lbloffsetVAL = 0;
var c_oserct_axisunitVAL = 0;
var c_oserct_lblalgnVAL = 0;
var c_oserct_cataxAXID = 0;
var c_oserct_cataxSCALING = 1;
var c_oserct_cataxDELETE = 2;
var c_oserct_cataxAXPOS = 3;
var c_oserct_cataxMAJORGRIDLINES = 4;
var c_oserct_cataxMINORGRIDLINES = 5;
var c_oserct_cataxTITLE = 6;
var c_oserct_cataxNUMFMT = 7;
var c_oserct_cataxMAJORTICKMARK = 8;
var c_oserct_cataxMINORTICKMARK = 9;
var c_oserct_cataxTICKLBLPOS = 10;
var c_oserct_cataxSPPR = 11;
var c_oserct_cataxTXPR = 12;
var c_oserct_cataxCROSSAX = 13;
var c_oserct_cataxCROSSES = 14;
var c_oserct_cataxCROSSESAT = 15;
var c_oserct_cataxAUTO = 16;
var c_oserct_cataxLBLALGN = 17;
var c_oserct_cataxLBLOFFSET = 18;
var c_oserct_cataxTICKLBLSKIP = 19;
var c_oserct_cataxTICKMARKSKIP = 20;
var c_oserct_cataxNOMULTILVLLBL = 21;
var c_oserct_cataxEXTLST = 22;
var c_oserct_dispunitslblLAYOUT = 0;
var c_oserct_dispunitslblTX = 1;
var c_oserct_dispunitslblSPPR = 2;
var c_oserct_dispunitslblTXPR = 3;
var c_oserct_builtinunitVAL = 0;
var c_oserct_dispunitsBUILTINUNIT = 0;
var c_oserct_dispunitsCUSTUNIT = 1;
var c_oserct_dispunitsDISPUNITSLBL = 2;
var c_oserct_dispunitsEXTLST = 3;
var c_oserct_crossbetweenVAL = 0;
var c_oserct_valaxAXID = 0;
var c_oserct_valaxSCALING = 1;
var c_oserct_valaxDELETE = 2;
var c_oserct_valaxAXPOS = 3;
var c_oserct_valaxMAJORGRIDLINES = 4;
var c_oserct_valaxMINORGRIDLINES = 5;
var c_oserct_valaxTITLE = 6;
var c_oserct_valaxNUMFMT = 7;
var c_oserct_valaxMAJORTICKMARK = 8;
var c_oserct_valaxMINORTICKMARK = 9;
var c_oserct_valaxTICKLBLPOS = 10;
var c_oserct_valaxSPPR = 11;
var c_oserct_valaxTXPR = 12;
var c_oserct_valaxCROSSAX = 13;
var c_oserct_valaxCROSSES = 14;
var c_oserct_valaxCROSSESAT = 15;
var c_oserct_valaxCROSSBETWEEN = 16;
var c_oserct_valaxMAJORUNIT = 17;
var c_oserct_valaxMINORUNIT = 18;
var c_oserct_valaxDISPUNITS = 19;
var c_oserct_valaxEXTLST = 20;
var c_oserct_sizerepresentsVAL = 0;
var c_oserct_bubblescaleVAL = 0;
var c_oserct_bubbleserIDX = 0;
var c_oserct_bubbleserORDER = 1;
var c_oserct_bubbleserTX = 2;
var c_oserct_bubbleserSPPR = 3;
var c_oserct_bubbleserINVERTIFNEGATIVE = 4;
var c_oserct_bubbleserDPT = 5;
var c_oserct_bubbleserDLBLS = 6;
var c_oserct_bubbleserTRENDLINE = 7;
var c_oserct_bubbleserERRBARS = 8;
var c_oserct_bubbleserXVAL = 9;
var c_oserct_bubbleserYVAL = 10;
var c_oserct_bubbleserBUBBLESIZE = 11;
var c_oserct_bubbleserBUBBLE3D = 12;
var c_oserct_bubbleserEXTLST = 13;
var c_oserct_sertxSTRREF = 0;
var c_oserct_sertxV = 1;
var c_oserct_dptIDX = 0;
var c_oserct_dptINVERTIFNEGATIVE = 1;
var c_oserct_dptMARKER = 2;
var c_oserct_dptBUBBLE3D = 3;
var c_oserct_dptEXPLOSION = 4;
var c_oserct_dptSPPR = 5;
var c_oserct_dptPICTUREOPTIONS = 6;
var c_oserct_dptEXTLST = 7;
var c_oserct_markerSYMBOL = 0;
var c_oserct_markerSIZE = 1;
var c_oserct_markerSPPR = 2;
var c_oserct_markerEXTLST = 3;
var c_oserct_markerstyleVAL = 0;
var c_oserct_markersizeVAL = 0;
var c_oserct_pictureoptionsAPPLYTOFRONT = 0;
var c_oserct_pictureoptionsAPPLYTOSIDES = 1;
var c_oserct_pictureoptionsAPPLYTOEND = 2;
var c_oserct_pictureoptionsPICTUREFORMAT = 3;
var c_oserct_pictureoptionsPICTURESTACKUNIT = 4;
var c_oserct_pictureformatVAL = 0;
var c_oserct_picturestackunitVAL = 0;
var c_oserct_dlblsDLBL = 0;
var c_oserct_dlblsITEMS = 1;
var c_oserct_dlblsDLBLPOS = 2;
var c_oserct_dlblsDELETE = 3;
var c_oserct_dlblsLEADERLINES = 4;
var c_oserct_dlblsNUMFMT = 5;
var c_oserct_dlblsSEPARATOR = 6;
var c_oserct_dlblsSHOWBUBBLESIZE = 7;
var c_oserct_dlblsSHOWCATNAME = 8;
var c_oserct_dlblsSHOWLEADERLINES = 9;
var c_oserct_dlblsSHOWLEGENDKEY = 10;
var c_oserct_dlblsSHOWPERCENT = 11;
var c_oserct_dlblsSHOWSERNAME = 12;
var c_oserct_dlblsSHOWVAL = 13;
var c_oserct_dlblsSPPR = 14;
var c_oserct_dlblsTXPR = 15;
var c_oserct_dlblsEXTLST = 16;
var c_oserct_dlblIDX = 0;
var c_oserct_dlblITEMS = 1;
var c_oserct_dlblDLBLPOS = 2;
var c_oserct_dlblDELETE = 3;
var c_oserct_dlblLAYOUT = 4;
var c_oserct_dlblNUMFMT = 5;
var c_oserct_dlblSEPARATOR = 6;
var c_oserct_dlblSHOWBUBBLESIZE = 7;
var c_oserct_dlblSHOWCATNAME = 8;
var c_oserct_dlblSHOWLEGENDKEY = 9;
var c_oserct_dlblSHOWPERCENT = 10;
var c_oserct_dlblSHOWSERNAME = 11;
var c_oserct_dlblSHOWVAL = 12;
var c_oserct_dlblSPPR = 13;
var c_oserct_dlblTX = 14;
var c_oserct_dlblTXPR = 15;
var c_oserct_dlblEXTLST = 16;
var c_oserct_dlblposVAL = 0;
var c_oserct_trendlineNAME = 0;
var c_oserct_trendlineSPPR = 1;
var c_oserct_trendlineTRENDLINETYPE = 2;
var c_oserct_trendlineORDER = 3;
var c_oserct_trendlinePERIOD = 4;
var c_oserct_trendlineFORWARD = 5;
var c_oserct_trendlineBACKWARD = 6;
var c_oserct_trendlineINTERCEPT = 7;
var c_oserct_trendlineDISPRSQR = 8;
var c_oserct_trendlineDISPEQ = 9;
var c_oserct_trendlineTRENDLINELBL = 10;
var c_oserct_trendlineEXTLST = 11;
var c_oserct_trendlinetypeVAL = 0;
var c_oserct_orderVAL = 0;
var c_oserct_periodVAL = 0;
var c_oserct_trendlinelblLAYOUT = 0;
var c_oserct_trendlinelblTX = 1;
var c_oserct_trendlinelblNUMFMT = 2;
var c_oserct_trendlinelblSPPR = 3;
var c_oserct_trendlinelblTXPR = 4;
var c_oserct_trendlinelblEXTLST = 5;
var c_oserct_errbarsERRDIR = 0;
var c_oserct_errbarsERRBARTYPE = 1;
var c_oserct_errbarsERRVALTYPE = 2;
var c_oserct_errbarsNOENDCAP = 3;
var c_oserct_errbarsPLUS = 4;
var c_oserct_errbarsMINUS = 5;
var c_oserct_errbarsVAL = 6;
var c_oserct_errbarsSPPR = 7;
var c_oserct_errbarsEXTLST = 8;
var c_oserct_errdirVAL = 0;
var c_oserct_errbartypeVAL = 0;
var c_oserct_errvaltypeVAL = 0;
var c_oserct_numdatasourceNUMLIT = 0;
var c_oserct_numdatasourceNUMREF = 1;
var c_oserct_numdataFORMATCODE = 0;
var c_oserct_numdataPTCOUNT = 1;
var c_oserct_numdataPT = 2;
var c_oserct_numdataEXTLST = 3;
var c_oserct_numvalV = 0;
var c_oserct_numvalIDX = 1;
var c_oserct_numvalFORMATCODE = 2;
var c_oserct_numrefF = 0;
var c_oserct_numrefNUMCACHE = 1;
var c_oserct_numrefEXTLST = 2;
var c_oserct_axdatasourceMULTILVLSTRREF = 0;
var c_oserct_axdatasourceNUMLIT = 1;
var c_oserct_axdatasourceNUMREF = 2;
var c_oserct_axdatasourceSTRLIT = 3;
var c_oserct_axdatasourceSTRREF = 4;
var c_oserct_multilvlstrrefF = 0;
var c_oserct_multilvlstrrefMULTILVLSTRCACHE = 1;
var c_oserct_multilvlstrrefEXTLST = 2;
var c_oserct_lvlPT = 0;
var c_oserct_multilvlstrdataPTCOUNT = 0;
var c_oserct_multilvlstrdataLVL = 1;
var c_oserct_multilvlstrdataEXTLST = 2;
var c_oserct_bubblechartVARYCOLORS = 0;
var c_oserct_bubblechartSER = 1;
var c_oserct_bubblechartDLBLS = 2;
var c_oserct_bubblechartBUBBLE3D = 3;
var c_oserct_bubblechartBUBBLESCALE = 4;
var c_oserct_bubblechartSHOWNEGBUBBLES = 5;
var c_oserct_bubblechartSIZEREPRESENTS = 6;
var c_oserct_bubblechartAXID = 7;
var c_oserct_bubblechartEXTLST = 8;
var c_oserct_bandfmtsBANDFMT = 0;
var c_oserct_surface3dchartWIREFRAME = 0;
var c_oserct_surface3dchartSER = 1;
var c_oserct_surface3dchartBANDFMTS = 2;
var c_oserct_surface3dchartAXID = 3;
var c_oserct_surface3dchartEXTLST = 4;
var c_oserct_surfaceserIDX = 0;
var c_oserct_surfaceserORDER = 1;
var c_oserct_surfaceserTX = 2;
var c_oserct_surfaceserSPPR = 3;
var c_oserct_surfaceserCAT = 4;
var c_oserct_surfaceserVAL = 5;
var c_oserct_surfaceserEXTLST = 6;
var c_oserct_bandfmtIDX = 0;
var c_oserct_bandfmtSPPR = 1;
var c_oserct_surfacechartWIREFRAME = 0;
var c_oserct_surfacechartSER = 1;
var c_oserct_surfacechartBANDFMTS = 2;
var c_oserct_surfacechartAXID = 3;
var c_oserct_surfacechartEXTLST = 4;
var c_oserct_secondpiesizeVAL = 0;
var c_oserct_splittypeVAL = 0;
var c_oserct_ofpietypeVAL = 0;
var c_oserct_custsplitSECONDPIEPT = 0;
var c_oserct_ofpiechartOFPIETYPE = 0;
var c_oserct_ofpiechartVARYCOLORS = 1;
var c_oserct_ofpiechartSER = 2;
var c_oserct_ofpiechartDLBLS = 3;
var c_oserct_ofpiechartGAPWIDTH = 4;
var c_oserct_ofpiechartSPLITTYPE = 5;
var c_oserct_ofpiechartSPLITPOS = 6;
var c_oserct_ofpiechartCUSTSPLIT = 7;
var c_oserct_ofpiechartSECONDPIESIZE = 8;
var c_oserct_ofpiechartSERLINES = 9;
var c_oserct_ofpiechartEXTLST = 10;
var c_oserct_pieserIDX = 0;
var c_oserct_pieserORDER = 1;
var c_oserct_pieserTX = 2;
var c_oserct_pieserSPPR = 3;
var c_oserct_pieserEXPLOSION = 4;
var c_oserct_pieserDPT = 5;
var c_oserct_pieserDLBLS = 6;
var c_oserct_pieserCAT = 7;
var c_oserct_pieserVAL = 8;
var c_oserct_pieserEXTLST = 9;
var c_oserct_gapamountVAL = 0;
var c_oserct_bar3dchartBARDIR = 0;
var c_oserct_bar3dchartGROUPING = 1;
var c_oserct_bar3dchartVARYCOLORS = 2;
var c_oserct_bar3dchartSER = 3;
var c_oserct_bar3dchartDLBLS = 4;
var c_oserct_bar3dchartGAPWIDTH = 5;
var c_oserct_bar3dchartGAPDEPTH = 6;
var c_oserct_bar3dchartSHAPE = 7;
var c_oserct_bar3dchartAXID = 8;
var c_oserct_bar3dchartEXTLST = 9;
var c_oserct_bardirVAL = 0;
var c_oserct_bargroupingVAL = 0;
var c_oserct_barserIDX = 0;
var c_oserct_barserORDER = 1;
var c_oserct_barserTX = 2;
var c_oserct_barserSPPR = 3;
var c_oserct_barserINVERTIFNEGATIVE = 4;
var c_oserct_barserPICTUREOPTIONS = 5;
var c_oserct_barserDPT = 6;
var c_oserct_barserDLBLS = 7;
var c_oserct_barserTRENDLINE = 8;
var c_oserct_barserERRBARS = 9;
var c_oserct_barserCAT = 10;
var c_oserct_barserVAL = 11;
var c_oserct_barserSHAPE = 12;
var c_oserct_barserEXTLST = 13;
var c_oserct_shapeVAL = 0;
var c_oserct_overlapVAL = 0;
var c_oserct_barchartBARDIR = 0;
var c_oserct_barchartGROUPING = 1;
var c_oserct_barchartVARYCOLORS = 2;
var c_oserct_barchartSER = 3;
var c_oserct_barchartDLBLS = 4;
var c_oserct_barchartGAPWIDTH = 5;
var c_oserct_barchartOVERLAP = 6;
var c_oserct_barchartSERLINES = 7;
var c_oserct_barchartAXID = 8;
var c_oserct_barchartEXTLST = 9;
var c_oserct_holesizeVAL = 0;
var c_oserct_doughnutchartVARYCOLORS = 0;
var c_oserct_doughnutchartSER = 1;
var c_oserct_doughnutchartDLBLS = 2;
var c_oserct_doughnutchartFIRSTSLICEANG = 3;
var c_oserct_doughnutchartHOLESIZE = 4;
var c_oserct_doughnutchartEXTLST = 5;
var c_oserct_firstsliceangVAL = 0;
var c_oserct_pie3dchartVARYCOLORS = 0;
var c_oserct_pie3dchartSER = 1;
var c_oserct_pie3dchartDLBLS = 2;
var c_oserct_pie3dchartEXTLST = 3;
var c_oserct_piechartVARYCOLORS = 0;
var c_oserct_piechartSER = 1;
var c_oserct_piechartDLBLS = 2;
var c_oserct_piechartFIRSTSLICEANG = 3;
var c_oserct_piechartEXTLST = 4;
var c_oserct_scatterserIDX = 0;
var c_oserct_scatterserORDER = 1;
var c_oserct_scatterserTX = 2;
var c_oserct_scatterserSPPR = 3;
var c_oserct_scatterserMARKER = 4;
var c_oserct_scatterserDPT = 5;
var c_oserct_scatterserDLBLS = 6;
var c_oserct_scatterserTRENDLINE = 7;
var c_oserct_scatterserERRBARS = 8;
var c_oserct_scatterserXVAL = 9;
var c_oserct_scatterserYVAL = 10;
var c_oserct_scatterserSMOOTH = 11;
var c_oserct_scatterserEXTLST = 12;
var c_oserct_scatterstyleVAL = 0;
var c_oserct_scatterchartSCATTERSTYLE = 0;
var c_oserct_scatterchartVARYCOLORS = 1;
var c_oserct_scatterchartSER = 2;
var c_oserct_scatterchartDLBLS = 3;
var c_oserct_scatterchartAXID = 4;
var c_oserct_scatterchartEXTLST = 5;
var c_oserct_radarserIDX = 0;
var c_oserct_radarserORDER = 1;
var c_oserct_radarserTX = 2;
var c_oserct_radarserSPPR = 3;
var c_oserct_radarserMARKER = 4;
var c_oserct_radarserDPT = 5;
var c_oserct_radarserDLBLS = 6;
var c_oserct_radarserCAT = 7;
var c_oserct_radarserVAL = 8;
var c_oserct_radarserEXTLST = 9;
var c_oserct_radarstyleVAL = 0;
var c_oserct_radarchartRADARSTYLE = 0;
var c_oserct_radarchartVARYCOLORS = 1;
var c_oserct_radarchartSER = 2;
var c_oserct_radarchartDLBLS = 3;
var c_oserct_radarchartAXID = 4;
var c_oserct_radarchartEXTLST = 5;
var c_oserct_stockchartSER = 0;
var c_oserct_stockchartDLBLS = 1;
var c_oserct_stockchartDROPLINES = 2;
var c_oserct_stockchartHILOWLINES = 3;
var c_oserct_stockchartUPDOWNBARS = 4;
var c_oserct_stockchartAXID = 5;
var c_oserct_stockchartEXTLST = 6;
var c_oserct_lineserIDX = 0;
var c_oserct_lineserORDER = 1;
var c_oserct_lineserTX = 2;
var c_oserct_lineserSPPR = 3;
var c_oserct_lineserMARKER = 4;
var c_oserct_lineserDPT = 5;
var c_oserct_lineserDLBLS = 6;
var c_oserct_lineserTRENDLINE = 7;
var c_oserct_lineserERRBARS = 8;
var c_oserct_lineserCAT = 9;
var c_oserct_lineserVAL = 10;
var c_oserct_lineserSMOOTH = 11;
var c_oserct_lineserEXTLST = 12;
var c_oserct_updownbarsGAPWIDTH = 0;
var c_oserct_updownbarsUPBARS = 1;
var c_oserct_updownbarsDOWNBARS = 2;
var c_oserct_updownbarsEXTLST = 3;
var c_oserct_updownbarSPPR = 0;
var c_oserct_line3dchartGROUPING = 0;
var c_oserct_line3dchartVARYCOLORS = 1;
var c_oserct_line3dchartSER = 2;
var c_oserct_line3dchartDLBLS = 3;
var c_oserct_line3dchartDROPLINES = 4;
var c_oserct_line3dchartGAPDEPTH = 5;
var c_oserct_line3dchartAXID = 6;
var c_oserct_line3dchartEXTLST = 7;
var c_oserct_groupingVAL = 0;
var c_oserct_linechartGROUPING = 0;
var c_oserct_linechartVARYCOLORS = 1;
var c_oserct_linechartSER = 2;
var c_oserct_linechartDLBLS = 3;
var c_oserct_linechartDROPLINES = 4;
var c_oserct_linechartHILOWLINES = 5;
var c_oserct_linechartUPDOWNBARS = 6;
var c_oserct_linechartMARKER = 7;
var c_oserct_linechartSMOOTH = 8;
var c_oserct_linechartAXID = 9;
var c_oserct_linechartEXTLST = 10;
var c_oserct_area3dchartGROUPING = 0;
var c_oserct_area3dchartVARYCOLORS = 1;
var c_oserct_area3dchartSER = 2;
var c_oserct_area3dchartDLBLS = 3;
var c_oserct_area3dchartDROPLINES = 4;
var c_oserct_area3dchartGAPDEPTH = 5;
var c_oserct_area3dchartAXID = 6;
var c_oserct_area3dchartEXTLST = 7;
var c_oserct_areaserIDX = 0;
var c_oserct_areaserORDER = 1;
var c_oserct_areaserTX = 2;
var c_oserct_areaserSPPR = 3;
var c_oserct_areaserPICTUREOPTIONS = 4;
var c_oserct_areaserDPT = 5;
var c_oserct_areaserDLBLS = 6;
var c_oserct_areaserTRENDLINE = 7;
var c_oserct_areaserERRBARS = 8;
var c_oserct_areaserCAT = 9;
var c_oserct_areaserVAL = 10;
var c_oserct_areaserEXTLST = 11;
var c_oserct_areachartGROUPING = 0;
var c_oserct_areachartVARYCOLORS = 1;
var c_oserct_areachartSER = 2;
var c_oserct_areachartDLBLS = 3;
var c_oserct_areachartDROPLINES = 4;
var c_oserct_areachartAXID = 5;
var c_oserct_areachartEXTLST = 6;
var c_oserct_plotareaLAYOUT = 0;
var c_oserct_plotareaITEMS = 1;
var c_oserct_plotareaAREA3DCHART = 2;
var c_oserct_plotareaAREACHART = 3;
var c_oserct_plotareaBAR3DCHART = 4;
var c_oserct_plotareaBARCHART = 5;
var c_oserct_plotareaBUBBLECHART = 6;
var c_oserct_plotareaDOUGHNUTCHART = 7;
var c_oserct_plotareaLINE3DCHART = 8;
var c_oserct_plotareaLINECHART = 9;
var c_oserct_plotareaOFPIECHART = 10;
var c_oserct_plotareaPIE3DCHART = 11;
var c_oserct_plotareaPIECHART = 12;
var c_oserct_plotareaRADARCHART = 13;
var c_oserct_plotareaSCATTERCHART = 14;
var c_oserct_plotareaSTOCKCHART = 15;
var c_oserct_plotareaSURFACE3DCHART = 16;
var c_oserct_plotareaSURFACECHART = 17;
var c_oserct_plotareaITEMS1 = 18;
var c_oserct_plotareaCATAX = 19;
var c_oserct_plotareaDATEAX = 20;
var c_oserct_plotareaSERAX = 21;
var c_oserct_plotareaVALAX = 22;
var c_oserct_plotareaDTABLE = 23;
var c_oserct_plotareaSPPR = 24;
var c_oserct_plotareaEXTLST = 25;
var c_oserct_thicknessVAL = 0;
var c_oserct_surfaceTHICKNESS = 0;
var c_oserct_surfaceSPPR = 1;
var c_oserct_surfacePICTUREOPTIONS = 2;
var c_oserct_surfaceEXTLST = 3;
var c_oserct_perspectiveVAL = 0;
var c_oserct_depthpercentVAL = 0;
var c_oserct_rotyVAL = 0;
var c_oserct_hpercentVAL = 0;
var c_oserct_rotxVAL = 0;
var c_oserct_view3dROTX = 0;
var c_oserct_view3dHPERCENT = 1;
var c_oserct_view3dROTY = 2;
var c_oserct_view3dDEPTHPERCENT = 3;
var c_oserct_view3dRANGAX = 4;
var c_oserct_view3dPERSPECTIVE = 5;
var c_oserct_view3dEXTLST = 6;
var c_oserct_pivotfmtIDX = 0;
var c_oserct_pivotfmtSPPR = 1;
var c_oserct_pivotfmtTXPR = 2;
var c_oserct_pivotfmtMARKER = 3;
var c_oserct_pivotfmtDLBL = 4;
var c_oserct_pivotfmtEXTLST = 5;
var c_oserct_pivotfmtsPIVOTFMT = 0;
var c_oserct_chartTITLE = 0;
var c_oserct_chartAUTOTITLEDELETED = 1;
var c_oserct_chartPIVOTFMTS = 2;
var c_oserct_chartVIEW3D = 3;
var c_oserct_chartFLOOR = 4;
var c_oserct_chartSIDEWALL = 5;
var c_oserct_chartBACKWALL = 6;
var c_oserct_chartPLOTAREA = 7;
var c_oserct_chartLEGEND = 8;
var c_oserct_chartPLOTVISONLY = 9;
var c_oserct_chartDISPBLANKSAS = 10;
var c_oserct_chartSHOWDLBLSOVERMAX = 11;
var c_oserct_chartEXTLST = 12;
var c_oserct_protectionCHARTOBJECT = 0;
var c_oserct_protectionDATA = 1;
var c_oserct_protectionFORMATTING = 2;
var c_oserct_protectionSELECTION = 3;
var c_oserct_protectionUSERINTERFACE = 4;
var c_oserct_pivotsourceNAME = 0;
var c_oserct_pivotsourceFMTID = 1;
var c_oserct_pivotsourceEXTLST = 2;
var c_oserct_style1VAL = 0;
var c_oserct_styleVAL = 0;
var c_oserct_textlanguageidVAL = 0;
var c_oseralternatecontentCHOICE = 0;
var c_oseralternatecontentFALLBACK = 1;
var c_oseralternatecontentchoiceSTYLE = 0;
var c_oseralternatecontentchoiceREQUIRES = 1;
var c_oseralternatecontentfallbackSTYLE = 0;
function BinaryChartWriter(memory) {
    this.memory = memory;
    this.bs = new BinaryCommonWriter(this.memory);
}
BinaryChartWriter.prototype.WriteCT_extLst = function (oVal) {
    var oThis = this;
    if (null != oVal.m_ext) {
        for (var i = 0, length = oVal.m_ext.length; i < length; ++i) {
            var oCurVal = oVal.m_ext[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_extlstEXT, function () {
                    oThis.WriteCT_Extension(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ChartSpace = function (oVal) {
    var oThis = this;
    if (null != oVal.date1904) {
        this.bs.WriteItem(c_oserct_chartspaceDATE1904, function () {
            oThis.WriteCT_Boolean(oVal.date1904);
        });
    }
    if (null != oVal.lang) {
        this.bs.WriteItem(c_oserct_chartspaceLANG, function () {
            oThis.WriteCT_TextLanguageID(oVal.lang);
        });
    }
    if (null != oVal.roundedCorners) {
        this.bs.WriteItem(c_oserct_chartspaceROUNDEDCORNERS, function () {
            oThis.WriteCT_Boolean(oVal.roundedCorners);
        });
    }
    if (null != oVal.style) {
        this.bs.WriteItem(c_oserct_chartspaceALTERNATECONTENT, function () {
            oThis.bs.WriteItem(c_oseralternatecontentCHOICE, function () {
                oThis.bs.WriteItem(c_oseralternatecontentchoiceREQUIRES, function () {
                    oThis.memory.WriteString3("c14");
                });
                oThis.bs.WriteItem(c_oseralternatecontentchoiceSTYLE, function () {
                    oThis.WriteCT_Style(100 + oVal.style);
                });
            });
            oThis.bs.WriteItem(c_oseralternatecontentFALLBACK, function () {
                oThis.bs.WriteItem(c_oseralternatecontentfallbackSTYLE, function () {
                    oThis.WriteCT_Style1(oVal.style);
                });
            });
        });
    }
    if (null != oVal.pivotSource) {
        this.bs.WriteItem(c_oserct_chartspacePIVOTSOURCE, function () {
            oThis.WriteCT_PivotSource(oVal.pivotSource);
        });
    }
    if (null != oVal.protection) {
        this.bs.WriteItem(c_oserct_chartspacePROTECTION, function () {
            oThis.WriteCT_Protection(oVal.protection);
        });
    }
    if (null != oVal.chart) {
        this.bs.WriteItem(c_oserct_chartspaceCHART, function () {
            oThis.WriteCT_Chart(oVal.chart);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_chartspaceSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_chartspaceTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.printSettings) {
        this.bs.WriteItem(c_oserct_chartspacePRINTSETTINGS, function () {
            oThis.WriteCT_PrintSettings(oVal.printSettings);
        });
    }
    if (null != oVal.themeOverride) {
        this.bs.WriteItem(c_oserct_chartspaceTHEMEOVERRIDE, function () {
            window.global_pptx_content_writer.WriteTheme(oThis.memory, oVal.themeOverride);
        });
    }
};
BinaryChartWriter.prototype.WriteSpPr = function (oVal) {
    window.global_pptx_content_writer.WriteSpPr(this.memory, oVal);
};
BinaryChartWriter.prototype.WriteTxPr = function (oVal) {
    window.global_pptx_content_writer.WriteTextBody(this.memory, oVal);
};
BinaryChartWriter.prototype.percentToString = function (val, bInteger, bSign) {
    var sRes;
    if (bInteger) {
        sRes = parseInt(val).toString();
    } else {
        sRes = val.toString();
    }
    if (bSign) {
        sRes += "%";
    }
    return sRes;
};
BinaryChartWriter.prototype.metricToString = function (val, bInteger) {
    var sRes;
    if (bInteger) {
        sRes = parseInt(val).toString();
    } else {
        sRes = val.toString();
    }
    sRes += "mm";
    return sRes;
};
BinaryChartWriter.prototype.WriteCT_Boolean = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_booleanVAL, function () {
            oThis.memory.WriteBool(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RelId = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_id;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_relidID, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PageSetup = function (oVal) {
    var oThis = this;
    if (null != oVal.paperSize) {
        this.bs.WriteItem(c_oserct_pagesetupPAPERSIZE, function () {
            oThis.memory.WriteLong(oVal.paperSize);
        });
    }
    if (null != oVal.paperHeight) {
        this.bs.WriteItem(c_oserct_pagesetupPAPERHEIGHT, function () {
            oThis.memory.WriteString3(oThis.metricToString(oVal.paperHeight, false));
        });
    }
    if (null != oVal.paperWidth) {
        this.bs.WriteItem(c_oserct_pagesetupPAPERWIDTH, function () {
            oThis.memory.WriteString3(oThis.metricToString(oVal.paperWidth, false));
        });
    }
    if (null != oVal.firstPageNumber) {
        this.bs.WriteItem(c_oserct_pagesetupFIRSTPAGENUMBER, function () {
            oThis.memory.WriteLong(oVal.firstPageNumber);
        });
    }
    if (null != oVal.orientation) {
        var nVal = null;
        switch (oVal.orientation) {
        case PAGE_SETUP_ORIENTATION_DEFAULT:
            nVal = st_pagesetuporientationDEFAULT;
            break;
        case PAGE_SETUP_ORIENTATION_PORTRAIT:
            nVal = st_pagesetuporientationPORTRAIT;
            break;
        case PAGE_SETUP_ORIENTATION_LANDSCAPE:
            nVal = st_pagesetuporientationLANDSCAPE;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_pagesetupORIENTATION, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
    if (null != oVal.blackAndWhite) {
        this.bs.WriteItem(c_oserct_pagesetupBLACKANDWHITE, function () {
            oThis.memory.WriteBool(oVal.blackAndWhite);
        });
    }
    if (null != oVal.draft) {
        this.bs.WriteItem(c_oserct_pagesetupDRAFT, function () {
            oThis.memory.WriteBool(oVal.draft);
        });
    }
    if (null != oVal.useFirstPageNumb) {
        this.bs.WriteItem(c_oserct_pagesetupUSEFIRSTPAGENUMBER, function () {
            oThis.memory.WriteBool(oVal.useFirstPageNumb);
        });
    }
    if (null != oVal.horizontalDpi) {
        this.bs.WriteItem(c_oserct_pagesetupHORIZONTALDPI, function () {
            oThis.memory.WriteLong(oVal.horizontalDpi);
        });
    }
    if (null != oVal.verticalDpi) {
        this.bs.WriteItem(c_oserct_pagesetupVERTICALDPI, function () {
            oThis.memory.WriteLong(oVal.verticalDpi);
        });
    }
    if (null != oVal.copies) {
        this.bs.WriteItem(c_oserct_pagesetupCOPIES, function () {
            oThis.memory.WriteLong(oVal.copies);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PageMargins = function (oVal) {
    var oThis = this;
    if (null != oVal.l) {
        this.bs.WriteItem(c_oserct_pagemarginsL, function () {
            oThis.memory.WriteDouble2(oVal.l);
        });
    }
    if (null != oVal.r) {
        this.bs.WriteItem(c_oserct_pagemarginsR, function () {
            oThis.memory.WriteDouble2(oVal.r);
        });
    }
    if (null != oVal.t) {
        this.bs.WriteItem(c_oserct_pagemarginsT, function () {
            oThis.memory.WriteDouble2(oVal.t);
        });
    }
    if (null != oVal.b) {
        this.bs.WriteItem(c_oserct_pagemarginsB, function () {
            oThis.memory.WriteDouble2(oVal.b);
        });
    }
    if (null != oVal.header) {
        this.bs.WriteItem(c_oserct_pagemarginsHEADER, function () {
            oThis.memory.WriteDouble2(oVal.header);
        });
    }
    if (null != oVal.footer) {
        this.bs.WriteItem(c_oserct_pagemarginsFOOTER, function () {
            oThis.memory.WriteDouble2(oVal.footer);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_HeaderFooter = function (oVal) {
    var oThis = this;
    if (null != oVal.oddHeader) {
        this.bs.WriteItem(c_oserct_headerfooterODDHEADER, function () {
            oThis.memory.WriteString3(oVal.oddHeader);
        });
    }
    if (null != oVal.oddFooter) {
        this.bs.WriteItem(c_oserct_headerfooterODDFOOTER, function () {
            oThis.memory.WriteString3(oVal.oddFooter);
        });
    }
    if (null != oVal.evenHeader) {
        this.bs.WriteItem(c_oserct_headerfooterEVENHEADER, function () {
            oThis.memory.WriteString3(oVal.evenHeader);
        });
    }
    if (null != oVal.evenFooter) {
        this.bs.WriteItem(c_oserct_headerfooterEVENFOOTER, function () {
            oThis.memory.WriteString3(oVal.evenFooter);
        });
    }
    if (null != oVal.firstHeader) {
        this.bs.WriteItem(c_oserct_headerfooterFIRSTHEADER, function () {
            oThis.memory.WriteString3(oVal.firstHeader);
        });
    }
    if (null != oVal.firstFooter) {
        this.bs.WriteItem(c_oserct_headerfooterFIRSTFOOTER, function () {
            oThis.memory.WriteString3(oVal.firstFooter);
        });
    }
    if (null != oVal.alignWithMargins) {
        this.bs.WriteItem(c_oserct_headerfooterALIGNWITHMARGINS, function () {
            oThis.memory.WriteBool(oVal.alignWithMargins);
        });
    }
    if (null != oVal.differentOddEven) {
        this.bs.WriteItem(c_oserct_headerfooterDIFFERENTODDEVEN, function () {
            oThis.memory.WriteBool(oVal.differentOddEven);
        });
    }
    if (null != oVal.differentFirst) {
        this.bs.WriteItem(c_oserct_headerfooterDIFFERENTFIRST, function () {
            oThis.memory.WriteBool(oVal.differentFirst);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PrintSettings = function (oVal) {
    var oThis = this;
    if (null != oVal.headerFooter) {
        this.bs.WriteItem(c_oserct_printsettingsHEADERFOOTER, function () {
            oThis.WriteCT_HeaderFooter(oVal.headerFooter);
        });
    }
    if (null != oVal.pageMargins) {
        this.bs.WriteItem(c_oserct_printsettingsPAGEMARGINS, function () {
            oThis.WriteCT_PageMargins(oVal.pageMargins);
        });
    }
    if (null != oVal.pageSetup) {
        this.bs.WriteItem(c_oserct_printsettingsPAGESETUP, function () {
            oThis.WriteCT_PageSetup(oVal.pageSetup);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ExternalData = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_autoUpdate;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_externaldataAUTOUPDATE, function () {
            oThis.WriteCT_Boolean(oCurVal);
        });
    }
    var oCurVal = oVal.m_id;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_externaldataID, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DispBlanksAs = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case DISP_BLANKS_AS_SPAN:
            nVal = st_dispblanksasSPAN;
            break;
        case DISP_BLANKS_AS_GAP:
            nVal = st_dispblanksasGAP;
            break;
        case DISP_BLANKS_AS_ZERO:
            nVal = st_dispblanksasZERO;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_dispblanksasVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LegendEntry = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_legendentryIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_legendentryDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_legendentryTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_UnsignedInt = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_unsignedintVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Extension = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_Any;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_extensionANY, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
    var oCurVal = oVal.m_uri;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_extensionURI, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LegendPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case LEGEND_POS_B:
            nVal = st_legendposB;
            break;
        case LEGEND_POS_TR:
            nVal = st_legendposTR;
            break;
        case LEGEND_POS_L:
            nVal = st_legendposL;
            break;
        case LEGEND_POS_R:
            nVal = st_legendposR;
            break;
        case LEGEND_POS_T:
            nVal = st_legendposT;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_legendposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Legend = function (oVal) {
    var oThis = this;
    if (null != oVal.legendPos) {
        this.bs.WriteItem(c_oserct_legendLEGENDPOS, function () {
            oThis.WriteCT_LegendPos(oVal.legendPos);
        });
    }
    if (null != oVal.legendEntryes) {
        for (var i = 0, length = oVal.legendEntryes.length; i < length; ++i) {
            var oCurVal = oVal.legendEntryes[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_legendLEGENDENTRY, function () {
                    oThis.WriteCT_LegendEntry(oCurVal);
                });
            }
        }
    }
    this.bs.WriteItem(c_oserct_legendLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.overlay) {
        this.bs.WriteItem(c_oserct_legendOVERLAY, function () {
            oThis.WriteCT_Boolean(oVal.overlay);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_legendSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_legendTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Layout = function (oVal) {
    var oThis = this;
    if (null != oVal.layout) {
        this.bs.WriteItem(c_oserct_layoutMANUALLAYOUT, function () {
            oThis.WriteCT_ManualLayout(oVal.layout);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ManualLayout = function (oVal) {
    var oThis = this;
    if (null != oVal.layoutTarget) {
        this.bs.WriteItem(c_oserct_manuallayoutLAYOUTTARGET, function () {
            oThis.WriteCT_LayoutTarget(oVal.layoutTarget);
        });
    }
    if (null != oVal.xMode) {
        this.bs.WriteItem(c_oserct_manuallayoutXMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.xMode);
        });
    }
    if (null != oVal.yMode) {
        this.bs.WriteItem(c_oserct_manuallayoutYMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.yMode);
        });
    }
    if (null != oVal.wMode) {
        this.bs.WriteItem(c_oserct_manuallayoutWMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.wMode);
        });
    }
    if (null != oVal.hMode) {
        this.bs.WriteItem(c_oserct_manuallayoutHMODE, function () {
            oThis.WriteCT_LayoutMode(oVal.hMode);
        });
    }
    if (null != oVal.x) {
        this.bs.WriteItem(c_oserct_manuallayoutX, function () {
            oThis.WriteCT_Double(oVal.x);
        });
    }
    if (null != oVal.y) {
        this.bs.WriteItem(c_oserct_manuallayoutY, function () {
            oThis.WriteCT_Double(oVal.y);
        });
    }
    if (null != oVal.w) {
        this.bs.WriteItem(c_oserct_manuallayoutW, function () {
            oThis.WriteCT_Double(oVal.w);
        });
    }
    if (null != oVal.h) {
        this.bs.WriteItem(c_oserct_manuallayoutH, function () {
            oThis.WriteCT_Double(oVal.h);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LayoutTarget = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case LAYOUT_TARGET_INNER:
            nVal = st_layouttargetINNER;
            break;
        case LAYOUT_TARGET_OUTER:
            nVal = st_layouttargetOUTER;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_layouttargetVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LayoutMode = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case LAYOUT_MODE_EDGE:
            nVal = st_layoutmodeEDGE;
            break;
        case LAYOUT_MODE_FACTOR:
            nVal = st_layoutmodeFACTOR;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_layoutmodeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Double = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_doubleVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DTable = function (oVal) {
    var oThis = this;
    if (null != oVal.showHorzBorder) {
        this.bs.WriteItem(c_oserct_dtableSHOWHORZBORDER, function () {
            oThis.WriteCT_Boolean(oVal.showHorzBorder);
        });
    }
    if (null != oVal.showVertBorder) {
        this.bs.WriteItem(c_oserct_dtableSHOWVERTBORDER, function () {
            oThis.WriteCT_Boolean(oVal.showVertBorder);
        });
    }
    if (null != oVal.showOutline) {
        this.bs.WriteItem(c_oserct_dtableSHOWOUTLINE, function () {
            oThis.WriteCT_Boolean(oVal.showOutline);
        });
    }
    if (null != oVal.showKeys) {
        this.bs.WriteItem(c_oserct_dtableSHOWKEYS, function () {
            oThis.WriteCT_Boolean(oVal.showKeys);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dtableSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dtableTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SerAx = function (oVal) {
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_seraxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_seraxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_seraxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_seraxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_seraxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_seraxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
    if (null != oVal.title) {
        this.bs.WriteItem(c_oserct_seraxTITLE, function () {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_seraxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_seraxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_seraxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_seraxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_seraxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_seraxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_seraxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_seraxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_seraxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.tickLblSkip) {
        this.bs.WriteItem(c_oserct_seraxTICKLBLSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickLblSkip);
        });
    }
    if (null != oVal.tickMarkSkip) {
        this.bs.WriteItem(c_oserct_seraxTICKMARKSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickMarkSkip);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Scaling = function (oVal) {
    var oThis = this;
    if (null != oVal.logBase) {
        this.bs.WriteItem(c_oserct_scalingLOGBASE, function () {
            oThis.WriteCT_LogBase(oVal.logBase);
        });
    }
    if (null != oVal.orientation) {
        this.bs.WriteItem(c_oserct_scalingORIENTATION, function () {
            oThis.WriteCT_Orientation(oVal.orientation);
        });
    }
    if (null != oVal.max) {
        this.bs.WriteItem(c_oserct_scalingMAX, function () {
            oThis.WriteCT_Double(oVal.max);
        });
    }
    if (null != oVal.min) {
        this.bs.WriteItem(c_oserct_scalingMIN, function () {
            oThis.WriteCT_Double(oVal.min);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LogBase = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_logbaseVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Orientation = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case ORIENTATION_MAX_MIN:
            nVal = st_orientationMAXMIN;
            break;
        case ORIENTATION_MIN_MAX:
            nVal = st_orientationMINMAX;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_orientationVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_AxPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case AX_POS_B:
            nVal = st_axposB;
            break;
        case AX_POS_L:
            nVal = st_axposL;
            break;
        case AX_POS_R:
            nVal = st_axposR;
            break;
        case AX_POS_T:
            nVal = st_axposT;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_axposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ChartLines = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_chartlinesSPPR, function () {
            oThis.WriteSpPr(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Title = function (oVal) {
    var oThis = this;
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_titleTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    this.bs.WriteItem(c_oserct_titleLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.overlay) {
        this.bs.WriteItem(c_oserct_titleOVERLAY, function () {
            oThis.WriteCT_Boolean(oVal.overlay);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_titleSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_titleTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Tx = function (oVal) {
    var oThis = this;
    if (null != oVal.rich) {
        this.bs.WriteItem(c_oserct_txRICH, function () {
            oThis.WriteTxPr(oVal.rich);
        });
    }
    if (null != oVal.strRef) {
        this.bs.WriteItem(c_oserct_txSTRREF, function () {
            oThis.WriteCT_StrRef(oVal.strRef);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_StrRef = function (oVal) {
    var oThis = this;
    if (null != oVal.f) {
        this.bs.WriteItem(c_oserct_strrefF, function () {
            oThis.memory.WriteString3(oVal.f);
        });
    }
    if (null != oVal.strCache) {
        this.bs.WriteItem(c_oserct_strrefSTRCACHE, function () {
            oThis.WriteCT_StrData(oVal.strCache);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_StrData = function (oVal) {
    var oThis = this;
    if (null != oVal.ptCount) {
        this.bs.WriteItem(c_oserct_strdataPTCOUNT, function () {
            oThis.WriteCT_UnsignedInt(oVal.ptCount);
        });
    }
    if (null != oVal.pt) {
        for (var i = 0, length = oVal.pt.length; i < length; ++i) {
            var oCurVal = oVal.pt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_strdataPT, function () {
                    oThis.WriteCT_StrVal(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_StrVal = function (oVal) {
    var oThis = this;
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_strvalV, function () {
            oThis.memory.WriteString3(oVal.val);
        });
    }
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_strvalIDX, function () {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_NumFmt = function (oVal) {
    var oThis = this;
    if (null != oVal.formatCode) {
        this.bs.WriteItem(c_oserct_numfmtFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
    if (null != oVal.sourceLinked) {
        this.bs.WriteItem(c_oserct_numfmtSOURCELINKED, function () {
            oThis.memory.WriteBool(oVal.sourceLinked);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TickMark = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case TICK_MARK_CROSS:
            nVal = st_tickmarkCROSS;
            break;
        case TICK_MARK_IN:
            nVal = st_tickmarkIN;
            break;
        case TICK_MARK_NONE:
            nVal = st_tickmarkNONE;
            break;
        case TICK_MARK_OUT:
            nVal = st_tickmarkOUT;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_tickmarkVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_TickLblPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case TICK_LABEL_POSITION_HIGH:
            nVal = st_ticklblposHIGH;
            break;
        case TICK_LABEL_POSITION_LOW:
            nVal = st_ticklblposLOW;
            break;
        case TICK_LABEL_POSITION_NEXT_TO:
            nVal = st_ticklblposNEXTTO;
            break;
        case TICK_LABEL_POSITION_NONE:
            nVal = st_ticklblposNONE;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_ticklblposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Crosses = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case CROSSES_AUTO_ZERO:
            nVal = st_crossesAUTOZERO;
            break;
        case CROSSES_MAX:
            nVal = st_crossesMAX;
            break;
        case CROSSES_MIN:
            nVal = st_crossesMIN;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_crossesVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Skip = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_skipVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TimeUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case TIME_UNIT_DAYS:
            nVal = st_timeunitDAYS;
            break;
        case TIME_UNIT_MONTHS:
            nVal = st_timeunitMONTHS;
            break;
        case TIME_UNIT_YEARS:
            nVal = st_timeunitYEARS;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_timeunitVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_DateAx = function (oVal) {
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_dateaxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_dateaxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_dateaxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_dateaxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_dateaxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_dateaxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
    if (null != oVal.title) {
        this.bs.WriteItem(c_oserct_dateaxTITLE, function () {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_dateaxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_dateaxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_dateaxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_dateaxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dateaxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dateaxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_dateaxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_dateaxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_dateaxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.auto) {
        this.bs.WriteItem(c_oserct_dateaxAUTO, function () {
            oThis.WriteCT_Boolean(oVal.auto);
        });
    }
    if (null != oVal.lblOffset) {
        this.bs.WriteItem(c_oserct_dateaxLBLOFFSET, function () {
            oThis.WriteCT_LblOffset(oVal.lblOffset);
        });
    }
    if (null != oVal.baseTimeUnit) {
        this.bs.WriteItem(c_oserct_dateaxBASETIMEUNIT, function () {
            oThis.WriteCT_TimeUnit(oVal.baseTimeUnit);
        });
    }
    if (null != oVal.majorUnit) {
        this.bs.WriteItem(c_oserct_dateaxMAJORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.majorUnit);
        });
    }
    if (null != oVal.majorTimeUnit) {
        this.bs.WriteItem(c_oserct_dateaxMAJORTIMEUNIT, function () {
            oThis.WriteCT_TimeUnit(oVal.majorTimeUnit);
        });
    }
    if (null != oVal.minorUnit) {
        this.bs.WriteItem(c_oserct_dateaxMINORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.minorUnit);
        });
    }
    if (null != oVal.minorTimeUnit) {
        this.bs.WriteItem(c_oserct_dateaxMINORTIMEUNIT, function () {
            oThis.WriteCT_TimeUnit(oVal.minorTimeUnit);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LblOffset = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_lbloffsetVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_AxisUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_axisunitVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_LblAlgn = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case LBL_ALG_CTR:
            nVal = st_lblalgnCTR;
            break;
        case LBL_ALG_L:
            nVal = st_lblalgnL;
            break;
        case LBL_ALG_R:
            nVal = st_lblalgnR;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_lblalgnVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_CatAx = function (oVal) {
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_cataxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_cataxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_cataxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_cataxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_cataxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_cataxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
    if (null != oVal.title) {
        this.bs.WriteItem(c_oserct_cataxTITLE, function () {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_cataxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_cataxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_cataxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_cataxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_cataxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_cataxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_cataxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_cataxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_cataxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.auto) {
        this.bs.WriteItem(c_oserct_cataxAUTO, function () {
            oThis.WriteCT_Boolean(oVal.auto);
        });
    }
    if (null != oVal.lblAlgn) {
        this.bs.WriteItem(c_oserct_cataxLBLALGN, function () {
            oThis.WriteCT_LblAlgn(oVal.lblAlgn);
        });
    }
    if (null != oVal.lblOffset) {
        this.bs.WriteItem(c_oserct_cataxLBLOFFSET, function () {
            oThis.WriteCT_LblOffset(oVal.lblOffset);
        });
    }
    if (null != oVal.tickLblSkip) {
        this.bs.WriteItem(c_oserct_cataxTICKLBLSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickLblSkip);
        });
    }
    if (null != oVal.tickMarkSkip) {
        this.bs.WriteItem(c_oserct_cataxTICKMARKSKIP, function () {
            oThis.WriteCT_Skip(oVal.tickMarkSkip);
        });
    }
    if (null != oVal.noMultiLvlLbl) {
        this.bs.WriteItem(c_oserct_cataxNOMULTILVLLBL, function () {
            oThis.WriteCT_Boolean(oVal.noMultiLvlLbl);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DispUnitsLbl = function (oVal) {
    var oThis = this;
    this.bs.WriteItem(c_oserct_dispunitslblLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_dispunitslblTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dispunitslblSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dispunitslblTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BuiltInUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case BUILT_IN_UNIT_HUNDREDS:
            nVal = st_builtinunitHUNDREDS;
            break;
        case BUILT_IN_UNIT_THOUSANDS:
            nVal = st_builtinunitTHOUSANDS;
            break;
        case BUILT_IN_UNIT_TEN_THOUSANDS:
            nVal = st_builtinunitTENTHOUSANDS;
            break;
        case BUILT_IN_UNIT_HUNDRED_THOUSANDS:
            nVal = st_builtinunitHUNDREDTHOUSANDS;
            break;
        case BUILT_IN_UNIT_MILLIONS:
            nVal = st_builtinunitMILLIONS;
            break;
        case BUILT_IN_UNIT_TEN_MILLIONS:
            nVal = st_builtinunitTENMILLIONS;
            break;
        case BUILT_IN_UNIT_HUNDRED_MILLIONS:
            nVal = st_builtinunitHUNDREDMILLIONS;
            break;
        case BUILT_IN_UNIT_BILLIONS:
            nVal = st_builtinunitBILLIONS;
            break;
        case BUILT_IN_UNIT_TRILLIONS:
            nVal = st_builtinunitTRILLIONS;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_builtinunitVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_DispUnits = function (oVal) {
    var oThis = this;
    if (null != oVal.builtInUnit) {
        this.bs.WriteItem(c_oserct_dispunitsBUILTINUNIT, function () {
            oThis.WriteCT_BuiltInUnit(oVal.builtInUnit);
        });
    }
    if (null != oVal.custUnit) {
        this.bs.WriteItem(c_oserct_dispunitsCUSTUNIT, function () {
            oThis.WriteCT_Double(oVal.custUnit);
        });
    }
    if (null != oVal.dispUnitsLbl) {
        this.bs.WriteItem(c_oserct_dispunitsDISPUNITSLBL, function () {
            oThis.WriteCT_DispUnitsLbl(oVal.dispUnitsLbl);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_CrossBetween = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case CROSS_BETWEEN_BETWEEN:
            nVal = st_crossbetweenBETWEEN;
            break;
        case CROSS_BETWEEN_MID_CAT:
            nVal = st_crossbetweenMIDCAT;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_crossbetweenVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ValAx = function (oVal) {
    var oThis = this;
    if (null != oVal.axId) {
        this.bs.WriteItem(c_oserct_valaxAXID, function () {
            oThis.WriteCT_UnsignedInt(oVal.axId);
        });
    }
    if (null != oVal.scaling) {
        this.bs.WriteItem(c_oserct_valaxSCALING, function () {
            oThis.WriteCT_Scaling(oVal.scaling);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_valaxDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.axPos) {
        this.bs.WriteItem(c_oserct_valaxAXPOS, function () {
            oThis.WriteCT_AxPos(oVal.axPos);
        });
    }
    if (null != oVal.majorGridlines) {
        this.bs.WriteItem(c_oserct_valaxMAJORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.majorGridlines);
        });
    }
    if (null != oVal.minorGridlines) {
        this.bs.WriteItem(c_oserct_valaxMINORGRIDLINES, function () {
            oThis.WriteCT_ChartLines(oVal.minorGridlines);
        });
    }
    if (null != oVal.title) {
        this.bs.WriteItem(c_oserct_valaxTITLE, function () {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_valaxNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.majorTickMark) {
        this.bs.WriteItem(c_oserct_valaxMAJORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.majorTickMark);
        });
    }
    if (null != oVal.minorTickMark) {
        this.bs.WriteItem(c_oserct_valaxMINORTICKMARK, function () {
            oThis.WriteCT_TickMark(oVal.minorTickMark);
        });
    }
    if (null != oVal.tickLblPos) {
        this.bs.WriteItem(c_oserct_valaxTICKLBLPOS, function () {
            oThis.WriteCT_TickLblPos(oVal.tickLblPos);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_valaxSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_valaxTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.crossAx) {
        this.bs.WriteItem(c_oserct_valaxCROSSAX, function () {
            oThis.WriteCT_UnsignedInt(oVal.crossAx.axId);
        });
    }
    if (null != oVal.crosses) {
        this.bs.WriteItem(c_oserct_valaxCROSSES, function () {
            oThis.WriteCT_Crosses(oVal.crosses);
        });
    }
    if (null != oVal.crossesAt) {
        this.bs.WriteItem(c_oserct_valaxCROSSESAT, function () {
            oThis.WriteCT_Double(oVal.crossesAt);
        });
    }
    if (null != oVal.crossBetween) {
        this.bs.WriteItem(c_oserct_valaxCROSSBETWEEN, function () {
            oThis.WriteCT_CrossBetween(oVal.crossBetween);
        });
    }
    if (null != oVal.majorUnit) {
        this.bs.WriteItem(c_oserct_valaxMAJORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.majorUnit);
        });
    }
    if (null != oVal.minorUnit) {
        this.bs.WriteItem(c_oserct_valaxMINORUNIT, function () {
            oThis.WriteCT_AxisUnit(oVal.minorUnit);
        });
    }
    if (null != oVal.dispUnits) {
        this.bs.WriteItem(c_oserct_valaxDISPUNITS, function () {
            oThis.WriteCT_DispUnits(oVal.dispUnits);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SizeRepresents = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case SIZE_REPRESENTS_AREA:
            nVal = st_sizerepresentsAREA;
            break;
        case SIZE_REPRESENTS_W:
            nVal = st_sizerepresentsW;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_sizerepresentsVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_BubbleScale = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_bubblescaleVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BubbleSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_bubbleserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_bubbleserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_bubbleserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_bubbleserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.invertIfNegative) {
        this.bs.WriteItem(c_oserct_bubbleserINVERTIFNEGATIVE, function () {
            oThis.WriteCT_Boolean(oVal.invertIfNegative);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bubbleserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_bubbleserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_bubbleserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
    if (null != oVal.errBars) {
        this.bs.WriteItem(c_oserct_bubbleserERRBARS, function () {
            oThis.WriteCT_ErrBars(oVal.errBars);
        });
    }
    if (null != oVal.xVal) {
        this.bs.WriteItem(c_oserct_bubbleserXVAL, function () {
            oThis.WriteCT_AxDataSource(oVal.xVal);
        });
    }
    if (null != oVal.yVal) {
        this.bs.WriteItem(c_oserct_bubbleserYVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.yVal);
        });
    }
    if (null != oVal.bubbleSize) {
        this.bs.WriteItem(c_oserct_bubbleserBUBBLESIZE, function () {
            oThis.WriteCT_NumDataSource(oVal.bubbleSize);
        });
    }
    if (null != oVal.bubble3D) {
        this.bs.WriteItem(c_oserct_bubbleserBUBBLE3D, function () {
            oThis.WriteCT_Boolean(oVal.bubble3D);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SerTx = function (oVal) {
    var oThis = this;
    if (null != oVal.strRef) {
        this.bs.WriteItem(c_oserct_sertxSTRREF, function () {
            oThis.WriteCT_StrRef(oVal.strRef);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_sertxV, function () {
            oThis.memory.WriteString3(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DPt = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_dptIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.invertIfNegative) {
        this.bs.WriteItem(c_oserct_dptINVERTIFNEGATIVE, function () {
            oThis.WriteCT_Boolean(oVal.invertIfNegative);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_dptMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.bubble3D) {
        this.bs.WriteItem(c_oserct_dptBUBBLE3D, function () {
            oThis.WriteCT_Boolean(oVal.bubble3D);
        });
    }
    if (null != oVal.explosion) {
        this.bs.WriteItem(c_oserct_dptEXPLOSION, function () {
            oThis.WriteCT_UnsignedInt(oVal.explosion);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dptSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_dptPICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Marker = function (oVal) {
    var oThis = this;
    if (null != oVal.symbol) {
        this.bs.WriteItem(c_oserct_markerSYMBOL, function () {
            oThis.WriteCT_MarkerStyle(oVal.symbol);
        });
    }
    if (null != oVal.size) {
        this.bs.WriteItem(c_oserct_markerSIZE, function () {
            oThis.WriteCT_MarkerSize(oVal.size);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_markerSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_MarkerStyle = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case SYMBOL_CIRCLE:
            nVal = st_markerstyleCIRCLE;
            break;
        case SYMBOL_DASH:
            nVal = st_markerstyleDASH;
            break;
        case SYMBOL_DIAMOND:
            nVal = st_markerstyleDIAMOND;
            break;
        case SYMBOL_DOT:
            nVal = st_markerstyleDOT;
            break;
        case SYMBOL_NONE:
            nVal = st_markerstyleNONE;
            break;
        case SYMBOL_PICTURE:
            nVal = st_markerstylePICTURE;
            break;
        case SYMBOL_PLUS:
            nVal = st_markerstylePLUS;
            break;
        case SYMBOL_SQUARE:
            nVal = st_markerstyleSQUARE;
            break;
        case SYMBOL_STAR:
            nVal = st_markerstyleSTAR;
            break;
        case SYMBOL_TRIANGLE:
            nVal = st_markerstyleTRIANGLE;
            break;
        case SYMBOL_X:
            nVal = st_markerstyleX;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_markerstyleVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_MarkerSize = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_markersizeVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PictureOptions = function (oVal) {
    var oThis = this;
    if (null != oVal.applyToFront) {
        this.bs.WriteItem(c_oserct_pictureoptionsAPPLYTOFRONT, function () {
            oThis.WriteCT_Boolean(oVal.applyToFront);
        });
    }
    if (null != oVal.applyToSides) {
        this.bs.WriteItem(c_oserct_pictureoptionsAPPLYTOSIDES, function () {
            oThis.WriteCT_Boolean(oVal.applyToSides);
        });
    }
    if (null != oVal.applyToEnd) {
        this.bs.WriteItem(c_oserct_pictureoptionsAPPLYTOEND, function () {
            oThis.WriteCT_Boolean(oVal.applyToEnd);
        });
    }
    if (null != oVal.pictureFormat) {
        this.bs.WriteItem(c_oserct_pictureoptionsPICTUREFORMAT, function () {
            oThis.WriteCT_PictureFormat(oVal.pictureFormat);
        });
    }
    if (null != oVal.pictureStackUnit) {
        this.bs.WriteItem(c_oserct_pictureoptionsPICTURESTACKUNIT, function () {
            oThis.WriteCT_PictureStackUnit(oVal.pictureStackUnit);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PictureFormat = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case PICTURE_FORMAT_STACK_STRETCH:
            nVal = st_pictureformatSTRETCH;
            break;
        case PICTURE_FORMAT_STACK:
            nVal = st_pictureformatSTACK;
            break;
        case PICTURE_FORMAT_STACK_SCALE:
            nVal = st_pictureformatSTACKSCALE;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_pictureformatVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_PictureStackUnit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_picturestackunitVAL, function () {
            oThis.memory.WriteDouble2(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DLbls = function (oVal) {
    var oThis = this;
    if (null != oVal.dLbl) {
        for (var i = 0, length = oVal.dLbl.length; i < length; ++i) {
            var oCurVal = oVal.dLbl[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_dlblsDLBL, function () {
                    oThis.WriteCT_DLbl(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLblPos) {
        this.bs.WriteItem(c_oserct_dlblsDLBLPOS, function () {
            oThis.WriteCT_DLblPos(oVal.dLblPos);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_dlblsDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    if (null != oVal.leaderLines) {
        this.bs.WriteItem(c_oserct_dlblsLEADERLINES, function () {
            oThis.WriteCT_ChartLines(oVal.leaderLines);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_dlblsNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.separator) {
        this.bs.WriteItem(c_oserct_dlblsSEPARATOR, function () {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
    if (null != oVal.showBubbleSize) {
        this.bs.WriteItem(c_oserct_dlblsSHOWBUBBLESIZE, function () {
            oThis.WriteCT_Boolean(oVal.showBubbleSize);
        });
    }
    if (null != oVal.showCatName) {
        this.bs.WriteItem(c_oserct_dlblsSHOWCATNAME, function () {
            oThis.WriteCT_Boolean(oVal.showCatName);
        });
    }
    if (null != oVal.showLeaderLines) {
        this.bs.WriteItem(c_oserct_dlblsSHOWLEADERLINES, function () {
            oThis.WriteCT_Boolean(oVal.showLeaderLines);
        });
    }
    if (null != oVal.showLegendKey) {
        this.bs.WriteItem(c_oserct_dlblsSHOWLEGENDKEY, function () {
            oThis.WriteCT_Boolean(oVal.showLegendKey);
        });
    }
    if (null != oVal.showPercent) {
        this.bs.WriteItem(c_oserct_dlblsSHOWPERCENT, function () {
            oThis.WriteCT_Boolean(oVal.showPercent);
        });
    }
    if (null != oVal.showSerName) {
        this.bs.WriteItem(c_oserct_dlblsSHOWSERNAME, function () {
            oThis.WriteCT_Boolean(oVal.showSerName);
        });
    }
    if (null != oVal.showVal) {
        this.bs.WriteItem(c_oserct_dlblsSHOWVAL, function () {
            oThis.WriteCT_Boolean(oVal.showVal);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dlblsSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dlblsTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DLbl = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_dlblIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.dLblPos) {
        this.bs.WriteItem(c_oserct_dlblDLBLPOS, function () {
            oThis.WriteCT_DLblPos(oVal.dLblPos);
        });
    }
    if (null != oVal.bDelete) {
        this.bs.WriteItem(c_oserct_dlblDELETE, function () {
            oThis.WriteCT_Boolean(oVal.bDelete);
        });
    }
    this.bs.WriteItem(c_oserct_dlblLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_dlblNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.separator) {
        this.bs.WriteItem(c_oserct_dlblSEPARATOR, function () {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
    if (null != oVal.showBubbleSize) {
        this.bs.WriteItem(c_oserct_dlblSHOWBUBBLESIZE, function () {
            oThis.WriteCT_Boolean(oVal.showBubbleSize);
        });
    }
    if (null != oVal.showCatName) {
        this.bs.WriteItem(c_oserct_dlblSHOWCATNAME, function () {
            oThis.WriteCT_Boolean(oVal.showCatName);
        });
    }
    if (null != oVal.showLegendKey) {
        this.bs.WriteItem(c_oserct_dlblSHOWLEGENDKEY, function () {
            oThis.WriteCT_Boolean(oVal.showLegendKey);
        });
    }
    if (null != oVal.showPercent) {
        this.bs.WriteItem(c_oserct_dlblSHOWPERCENT, function () {
            oThis.WriteCT_Boolean(oVal.showPercent);
        });
    }
    if (null != oVal.showSerName) {
        this.bs.WriteItem(c_oserct_dlblSHOWSERNAME, function () {
            oThis.WriteCT_Boolean(oVal.showSerName);
        });
    }
    if (null != oVal.showVal) {
        this.bs.WriteItem(c_oserct_dlblSHOWVAL, function () {
            oThis.WriteCT_Boolean(oVal.showVal);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_dlblSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_dlblTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_dlblTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DLblPos = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case DLBL_POS_BEST_FIT:
            nVal = st_dlblposBESTFIT;
            break;
        case DLBL_POS_B:
            nVal = st_dlblposB;
            break;
        case DLBL_POS_CTR:
            nVal = st_dlblposCTR;
            break;
        case DLBL_POS_IN_BASE:
            nVal = st_dlblposINBASE;
            break;
        case DLBL_POS_IN_END:
            nVal = st_dlblposINEND;
            break;
        case DLBL_POS_L:
            nVal = st_dlblposL;
            break;
        case DLBL_POS_OUT_END:
            nVal = st_dlblposOUTEND;
            break;
        case DLBL_POS_R:
            nVal = st_dlblposR;
            break;
        case DLBL_POS_T:
            nVal = st_dlblposT;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_dlblposVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Trendline = function (oVal) {
    var oThis = this;
    if (null != oVal.name) {
        this.bs.WriteItem(c_oserct_trendlineNAME, function () {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_trendlineSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.trendlineType) {
        this.bs.WriteItem(c_oserct_trendlineTRENDLINETYPE, function () {
            oThis.WriteCT_TrendlineType(oVal.trendlineType);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_trendlineORDER, function () {
            oThis.WriteCT_Order(oVal.order);
        });
    }
    if (null != oVal.period) {
        this.bs.WriteItem(c_oserct_trendlinePERIOD, function () {
            oThis.WriteCT_Period(oVal.period);
        });
    }
    if (null != oVal.forward) {
        this.bs.WriteItem(c_oserct_trendlineFORWARD, function () {
            oThis.WriteCT_Double(oVal.forward);
        });
    }
    if (null != oVal.backward) {
        this.bs.WriteItem(c_oserct_trendlineBACKWARD, function () {
            oThis.WriteCT_Double(oVal.backward);
        });
    }
    if (null != oVal.intercept) {
        this.bs.WriteItem(c_oserct_trendlineINTERCEPT, function () {
            oThis.WriteCT_Double(oVal.intercept);
        });
    }
    if (null != oVal.dispRSqr) {
        this.bs.WriteItem(c_oserct_trendlineDISPRSQR, function () {
            oThis.WriteCT_Boolean(oVal.dispRSqr);
        });
    }
    if (null != oVal.dispEq) {
        this.bs.WriteItem(c_oserct_trendlineDISPEQ, function () {
            oThis.WriteCT_Boolean(oVal.dispEq);
        });
    }
    if (null != oVal.trendlineLbl) {
        this.bs.WriteItem(c_oserct_trendlineTRENDLINELBL, function () {
            oThis.WriteCT_TrendlineLbl(oVal.trendlineLbl);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TrendlineType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case TRENDLINE_TYPE_EXP:
            nVal = st_trendlinetypeEXP;
            break;
        case TRENDLINE_TYPE_LINEAR:
            nVal = st_trendlinetypeLINEAR;
            break;
        case TRENDLINE_TYPE_LOG:
            nVal = st_trendlinetypeLOG;
            break;
        case TRENDLINE_TYPE_MOVING_AVG:
            nVal = st_trendlinetypeMOVINGAVG;
            break;
        case TRENDLINE_TYPE_POLY:
            nVal = st_trendlinetypePOLY;
            break;
        case TRENDLINE_TYPE_POWER:
            nVal = st_trendlinetypePOWER;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_trendlinetypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Order = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_orderVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Period = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_periodVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TrendlineLbl = function (oVal) {
    var oThis = this;
    this.bs.WriteItem(c_oserct_trendlinelblLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_trendlinelblTX, function () {
            oThis.WriteCT_Tx(oVal.tx);
        });
    }
    if (null != oVal.numFmt) {
        this.bs.WriteItem(c_oserct_trendlinelblNUMFMT, function () {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_trendlinelblSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_trendlinelblTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ErrBars = function (oVal) {
    var oThis = this;
    if (null != oVal.errDir) {
        this.bs.WriteItem(c_oserct_errbarsERRDIR, function () {
            oThis.WriteCT_ErrDir(oVal.errDir);
        });
    }
    if (null != oVal.errBarType) {
        this.bs.WriteItem(c_oserct_errbarsERRBARTYPE, function () {
            oThis.WriteCT_ErrBarType(oVal.errBarType);
        });
    }
    if (null != oVal.errValType) {
        this.bs.WriteItem(c_oserct_errbarsERRVALTYPE, function () {
            oThis.WriteCT_ErrValType(oVal.errValType);
        });
    }
    if (null != oVal.noEndCap) {
        this.bs.WriteItem(c_oserct_errbarsNOENDCAP, function () {
            oThis.WriteCT_Boolean(oVal.noEndCap);
        });
    }
    if (null != oVal.plus) {
        this.bs.WriteItem(c_oserct_errbarsPLUS, function () {
            oThis.WriteCT_NumDataSource(oVal.plus);
        });
    }
    if (null != oVal.minus) {
        this.bs.WriteItem(c_oserct_errbarsMINUS, function () {
            oThis.WriteCT_NumDataSource(oVal.minus);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_errbarsVAL, function () {
            oThis.WriteCT_Double(oVal.val);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_errbarsSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ErrDir = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case ERR_DIR_X:
            nVal = st_errdirX;
            break;
        case ERR_DIR_Y:
            nVal = st_errdirY;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_errdirVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ErrBarType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case ERR_BAR_TYPE_BOTH:
            nVal = st_errbartypeBOTH;
            break;
        case ERR_BAR_TYPE_MINUS:
            nVal = st_errbartypeMINUS;
            break;
        case ERR_BAR_TYPE_PLUS:
            nVal = st_errbartypePLUS;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_errbartypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ErrValType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case ERR_VAL_TYPE_CUST:
            nVal = st_errvaltypeCUST;
            break;
        case ERR_VAL_TYPE_FIXED_VAL:
            nVal = st_errvaltypeFIXEDVAL;
            break;
        case ERR_VAL_TYPE_PERCENTAGE:
            nVal = st_errvaltypePERCENTAGE;
            break;
        case ERR_VAL_TYPE_STD_DEV:
            nVal = st_errvaltypeSTDDEV;
            break;
        case ERR_VAL_TYPE_STD_ERR:
            nVal = st_errvaltypeSTDERR;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_errvaltypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_NumDataSource = function (oVal) {
    var oThis = this;
    if (null != oVal.numLit) {
        this.bs.WriteItem(c_oserct_numdatasourceNUMLIT, function () {
            oThis.WriteCT_NumData(oVal.numLit);
        });
    }
    if (null != oVal.numRef) {
        this.bs.WriteItem(c_oserct_numdatasourceNUMREF, function () {
            oThis.WriteCT_NumRef(oVal.numRef);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_NumData = function (oVal) {
    var oThis = this;
    if (null != oVal.formatCode) {
        this.bs.WriteItem(c_oserct_numdataFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
    if (null != oVal.ptCount) {
        this.bs.WriteItem(c_oserct_numdataPTCOUNT, function () {
            oThis.WriteCT_UnsignedInt(oVal.ptCount);
        });
    }
    if (null != oVal.pts) {
        for (var i = 0, length = oVal.pts.length; i < length; ++i) {
            var oCurVal = oVal.pts[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_numdataPT, function () {
                    oThis.WriteCT_NumVal(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_NumVal = function (oVal) {
    var oThis = this;
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_numvalV, function () {
            oThis.memory.WriteString3(oVal.val);
        });
    }
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_numvalIDX, function () {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if (null != oVal.formatCode) {
        this.bs.WriteItem(c_oserct_numvalFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_NumRef = function (oVal) {
    var oThis = this;
    if (null != oVal.f) {
        this.bs.WriteItem(c_oserct_numrefF, function () {
            oThis.memory.WriteString3(oVal.f);
        });
    }
    if (null != oVal.numCache) {
        this.bs.WriteItem(c_oserct_numrefNUMCACHE, function () {
            oThis.WriteCT_NumData(oVal.numCache);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_AxDataSource = function (oVal) {
    var oThis = this;
    if (null != oVal.multiLvlStrRef) {
        this.bs.WriteItem(c_oserct_axdatasourceMULTILVLSTRREF, function () {
            oThis.WriteCT_MultiLvlStrRef(oVal.multiLvlStrRef);
        });
    }
    if (null != oVal.numLit) {
        this.bs.WriteItem(c_oserct_axdatasourceNUMLIT, function () {
            oThis.WriteCT_NumData(oVal.numLit);
        });
    }
    if (null != oVal.numRef) {
        this.bs.WriteItem(c_oserct_axdatasourceNUMREF, function () {
            oThis.WriteCT_NumRef(oVal.numRef);
        });
    }
    if (null != oVal.strLit) {
        this.bs.WriteItem(c_oserct_axdatasourceSTRLIT, function () {
            oThis.WriteCT_StrData(oVal.strLit);
        });
    }
    if (null != oVal.strRef) {
        this.bs.WriteItem(c_oserct_axdatasourceSTRREF, function () {
            oThis.WriteCT_StrRef(oVal.strRef);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_MultiLvlStrRef = function (oVal) {
    var oThis = this;
    if (null != oVal.f) {
        this.bs.WriteItem(c_oserct_multilvlstrrefF, function () {
            oThis.memory.WriteString3(oVal.f);
        });
    }
    if (null != oVal.multiLvlStrCache) {
        this.bs.WriteItem(c_oserct_multilvlstrrefMULTILVLSTRCACHE, function () {
            oThis.WriteCT_MultiLvlStrData(oVal.multiLvlStrCache);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_lvl = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_lvlPT, function () {
                    oThis.WriteCT_StrVal(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_MultiLvlStrData = function (oVal) {
    var oThis = this;
    if (null != oVal.ptCount) {
        this.bs.WriteItem(c_oserct_multilvlstrdataPTCOUNT, function () {
            oThis.WriteCT_UnsignedInt(oVal.ptCount);
        });
    }
    if (null != oVal.lvl) {
        this.bs.WriteItem(c_oserct_multilvlstrdataLVL, function () {
            oThis.WriteCT_lvl(oVal.lvl);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BubbleChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_bubblechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bubblechartSER, function () {
                    oThis.WriteCT_BubbleSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_bubblechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.bubble3D) {
        this.bs.WriteItem(c_oserct_bubblechartBUBBLE3D, function () {
            oThis.WriteCT_Boolean(oVal.bubble3D);
        });
    }
    if (null != oVal.bubbleScale) {
        this.bs.WriteItem(c_oserct_bubblechartBUBBLESCALE, function () {
            oThis.WriteCT_BubbleScale(oVal.bubbleScale);
        });
    }
    if (null != oVal.showNegBubbles) {
        this.bs.WriteItem(c_oserct_bubblechartSHOWNEGBUBBLES, function () {
            oThis.WriteCT_Boolean(oVal.showNegBubbles);
        });
    }
    if (null != oVal.sizeRepresents) {
        this.bs.WriteItem(c_oserct_bubblechartSIZEREPRESENTS, function () {
            oThis.WriteCT_SizeRepresents(oVal.sizeRepresents);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_bubblechartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_bandFmts = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bandfmtsBANDFMT, function () {
                    oThis.WriteCT_BandFmt(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Surface3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.wireframe) {
        this.bs.WriteItem(c_oserct_surface3dchartWIREFRAME, function () {
            oThis.WriteCT_Boolean(oVal.wireframe);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_surface3dchartSER, function () {
                    oThis.WriteCT_SurfaceSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.bandFmts && oVal.bandFmts.length > 0) {
        this.bs.WriteItem(c_oserct_surface3dchartBANDFMTS, function () {
            oThis.WriteCT_bandFmts(oVal.bandFmts);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_surface3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_SurfaceSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_surfaceserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_surfaceserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_surfaceserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_surfaceserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.cat) {
        this.bs.WriteItem(c_oserct_surfaceserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_surfaceserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BandFmt = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_bandfmtIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_bandfmtSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SurfaceChart = function (oVal) {
    var oThis = this;
    if (null != oVal.wireframe) {
        this.bs.WriteItem(c_oserct_surfacechartWIREFRAME, function () {
            oThis.WriteCT_Boolean(oVal.wireframe);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_surfacechartSER, function () {
                    oThis.WriteCT_SurfaceSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.bandFmts && oVal.bandFmts.length > 0) {
        this.bs.WriteItem(c_oserct_surfacechartBANDFMTS, function () {
            oThis.WriteCT_bandFmts(oVal.bandFmts);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_surfacechartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_SecondPieSize = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_secondpiesizeVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_SplitType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case SPLIT_TYPE_AUTO:
            nVal = st_splittypeAUTO;
            break;
        case SPLIT_TYPE_CUST:
            nVal = st_splittypeCUST;
            break;
        case SPLIT_TYPE_PERCENT:
            nVal = st_splittypePERCENT;
            break;
        case SPLIT_TYPE_POS:
            nVal = st_splittypePOS;
            break;
        case SPLIT_TYPE_VAL:
            nVal = st_splittypeVAL;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_splittypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_OfPieType = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case OF_PIE_TYPE_PIE:
            nVal = st_ofpietypePIE;
            break;
        case OF_PIE_TYPE_BAR:
            nVal = st_ofpietypeBAR;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_ofpietypeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_custSplit = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_custsplitSECONDPIEPT, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_OfPieChart = function (oVal) {
    var oThis = this;
    if (null != oVal.ofPieType) {
        this.bs.WriteItem(c_oserct_ofpiechartOFPIETYPE, function () {
            oThis.WriteCT_OfPieType(oVal.ofPieType);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_ofpiechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_ofpiechartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_ofpiechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_ofpiechartGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.splitType) {
        this.bs.WriteItem(c_oserct_ofpiechartSPLITTYPE, function () {
            oThis.WriteCT_SplitType(oVal.splitType);
        });
    }
    if (null != oVal.splitPos) {
        this.bs.WriteItem(c_oserct_ofpiechartSPLITPOS, function () {
            oThis.WriteCT_Double(oVal.splitPos);
        });
    }
    if (null != oVal.custSplit && oVal.custSplit.length > 0) {
        this.bs.WriteItem(c_oserct_ofpiechartCUSTSPLIT, function () {
            oThis.WriteCT_custSplit(oVal.custSplit);
        });
    }
    if (null != oVal.secondPieSize) {
        this.bs.WriteItem(c_oserct_ofpiechartSECONDPIESIZE, function () {
            oThis.WriteCT_SecondPieSize(oVal.secondPieSize);
        });
    }
    if (null != oVal.serLines) {
        this.bs.WriteItem(c_oserct_ofpiechartSERLINES, function () {
            oThis.WriteCT_ChartLines(oVal.serLines);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PieSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_pieserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_pieserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_pieserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_pieserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.explosion) {
        this.bs.WriteItem(c_oserct_pieserEXPLOSION, function () {
            oThis.WriteCT_UnsignedInt(oVal.explosion);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_pieserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_pieserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.cat) {
        this.bs.WriteItem(c_oserct_pieserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_pieserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_GapAmount = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_gapamountVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Bar3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.barDir) {
        this.bs.WriteItem(c_oserct_bar3dchartBARDIR, function () {
            oThis.WriteCT_BarDir(oVal.barDir);
        });
    }
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_bar3dchartGROUPING, function () {
            oThis.WriteCT_BarGrouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_bar3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_bar3dchartSER, function () {
                    oThis.WriteCT_BarSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_bar3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_bar3dchartGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_bar3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_BarDir = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case BAR_DIR_BAR:
            nVal = st_bardirBAR;
            break;
        case BAR_DIR_COL:
            nVal = st_bardirCOL;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_bardirVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_BarGrouping = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case BAR_GROUPING_PERCENT_STACKED:
            nVal = st_bargroupingPERCENTSTACKED;
            break;
        case BAR_GROUPING_CLUSTERED:
            nVal = st_bargroupingCLUSTERED;
            break;
        case BAR_GROUPING_STANDARD:
            nVal = st_bargroupingSTANDARD;
            break;
        case BAR_GROUPING_STACKED:
            nVal = st_bargroupingSTACKED;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_bargroupingVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_BarSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_barserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_barserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_barserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_barserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.invertIfNegative) {
        this.bs.WriteItem(c_oserct_barserINVERTIFNEGATIVE, function () {
            oThis.WriteCT_Boolean(oVal.invertIfNegative);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_barserPICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_barserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_barserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_barserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
    if (null != oVal.errBars) {
        this.bs.WriteItem(c_oserct_barserERRBARS, function () {
            oThis.WriteCT_ErrBars(oVal.errBars);
        });
    }
    if (null != oVal.cat) {
        this.bs.WriteItem(c_oserct_barserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_barserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
    if (null != oVal.shape) {
        this.bs.WriteItem(c_oserct_barserSHAPE, function () {
            oThis.WriteCT_Shape(oVal.shape);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Shape = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case BAR_SHAPE_CONE:
            nVal = st_shapeCONE;
            break;
        case BAR_SHAPE_CONETOMAX:
            nVal = st_shapeCONETOMAX;
            break;
        case BAR_SHAPE_BOX:
            nVal = st_shapeBOX;
            break;
        case BAR_SHAPE_CYLINDER:
            nVal = st_shapeCYLINDER;
            break;
        case BAR_SHAPE_PYRAMID:
            nVal = st_shapePYRAMID;
            break;
        case BAR_SHAPE_PYRAMIDTOMAX:
            nVal = st_shapePYRAMIDTOMAX;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_shapeVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Overlap = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_overlapVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_BarChart = function (oVal) {
    var oThis = this;
    if (null != oVal.barDir) {
        this.bs.WriteItem(c_oserct_barchartBARDIR, function () {
            oThis.WriteCT_BarDir(oVal.barDir);
        });
    }
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_barchartGROUPING, function () {
            oThis.WriteCT_BarGrouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_barchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_barchartSER, function () {
                    oThis.WriteCT_BarSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_barchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_barchartGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.overlap) {
        this.bs.WriteItem(c_oserct_barchartOVERLAP, function () {
            oThis.WriteCT_Overlap(oVal.overlap);
        });
    }
    if (null != oVal.serLines) {
        this.bs.WriteItem(c_oserct_barchartSERLINES, function () {
            oThis.WriteCT_ChartLines(oVal.serLines);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_barchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_HoleSize = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_holesizeVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DoughnutChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_doughnutchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_doughnutchartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_doughnutchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.firstSliceAng) {
        this.bs.WriteItem(c_oserct_doughnutchartFIRSTSLICEANG, function () {
            oThis.WriteCT_FirstSliceAng(oVal.firstSliceAng);
        });
    }
    if (null != oVal.holeSize) {
        this.bs.WriteItem(c_oserct_doughnutchartHOLESIZE, function () {
            oThis.WriteCT_HoleSize(oVal.holeSize);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_FirstSliceAng = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_firstsliceangVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Pie3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_pie3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_pie3dchartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_pie3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PieChart = function (oVal) {
    var oThis = this;
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_piechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_piechartSER, function () {
                    oThis.WriteCT_PieSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_piechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.firstSliceAng) {
        this.bs.WriteItem(c_oserct_piechartFIRSTSLICEANG, function () {
            oThis.WriteCT_FirstSliceAng(oVal.firstSliceAng);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ScatterSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_scatterserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_scatterserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_scatterserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_scatterserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_scatterserMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_scatterserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_scatterserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_scatterserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
    if (null != oVal.errBars) {
        this.bs.WriteItem(c_oserct_scatterserERRBARS, function () {
            oThis.WriteCT_ErrBars(oVal.errBars);
        });
    }
    if (null != oVal.xVal) {
        this.bs.WriteItem(c_oserct_scatterserXVAL, function () {
            oThis.WriteCT_AxDataSource(oVal.xVal);
        });
    }
    if (null != oVal.yVal) {
        this.bs.WriteItem(c_oserct_scatterserYVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.yVal);
        });
    }
    if (null != oVal.smooth) {
        this.bs.WriteItem(c_oserct_scatterserSMOOTH, function () {
            oThis.WriteCT_Boolean(oVal.smooth);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_ScatterStyle = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case SCATTER_STYLE_NONE:
            nVal = st_scatterstyleNONE;
            break;
        case SCATTER_STYLE_LINE:
            nVal = st_scatterstyleLINE;
            break;
        case SCATTER_STYLE_LINE_MARKER:
            nVal = st_scatterstyleLINEMARKER;
            break;
        case SCATTER_STYLE_MARKER:
            nVal = st_scatterstyleMARKER;
            break;
        case SCATTER_STYLE_SMOOTH:
            nVal = st_scatterstyleSMOOTH;
            break;
        case SCATTER_STYLE_SMOOTH_MARKER:
            nVal = st_scatterstyleSMOOTHMARKER;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_scatterstyleVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_ScatterChart = function (oVal) {
    var oThis = this;
    if (null != oVal.scatterStyle) {
        this.bs.WriteItem(c_oserct_scatterchartSCATTERSTYLE, function () {
            oThis.WriteCT_ScatterStyle(oVal.scatterStyle);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_scatterchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_scatterchartSER, function () {
                    oThis.WriteCT_ScatterSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_scatterchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_scatterchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_RadarSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_radarserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_radarserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_radarserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_radarserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_radarserMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_radarserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_radarserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.cat) {
        this.bs.WriteItem(c_oserct_radarserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_radarserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RadarStyle = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case RADAR_STYLE_STANDARD:
            nVal = st_radarstyleSTANDARD;
            break;
        case RADAR_STYLE_MARKER:
            nVal = st_radarstyleMARKER;
            break;
        case RADAR_STYLE_FILLED:
            nVal = st_radarstyleFILLED;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_radarstyleVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_RadarChart = function (oVal) {
    var oThis = this;
    if (null != oVal.radarStyle) {
        this.bs.WriteItem(c_oserct_radarchartRADARSTYLE, function () {
            oThis.WriteCT_RadarStyle(oVal.radarStyle);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_radarchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_radarchartSER, function () {
                    oThis.WriteCT_RadarSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_radarchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_radarchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_StockChart = function (oVal) {
    var oThis = this;
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_stockchartSER, function () {
                    oThis.WriteCT_LineSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_stockchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_stockchartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.hiLowLines) {
        this.bs.WriteItem(c_oserct_stockchartHILOWLINES, function () {
            oThis.WriteCT_ChartLines(oVal.hiLowLines);
        });
    }
    if (null != oVal.upDownBars) {
        this.bs.WriteItem(c_oserct_stockchartUPDOWNBARS, function () {
            oThis.WriteCT_UpDownBars(oVal.upDownBars);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_stockchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LineSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_lineserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_lineserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_lineserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_lineserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_lineserMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_lineserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_lineserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_lineserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
    if (null != oVal.errBars) {
        this.bs.WriteItem(c_oserct_lineserERRBARS, function () {
            oThis.WriteCT_ErrBars(oVal.errBars);
        });
    }
    if (null != oVal.cat) {
        this.bs.WriteItem(c_oserct_lineserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_lineserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
    if (null != oVal.smooth) {
        this.bs.WriteItem(c_oserct_lineserSMOOTH, function () {
            oThis.WriteCT_Boolean(oVal.smooth);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_UpDownBars = function (oVal) {
    var oThis = this;
    if (null != oVal.gapWidth) {
        this.bs.WriteItem(c_oserct_updownbarsGAPWIDTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapWidth);
        });
    }
    if (null != oVal.upBars) {
        this.bs.WriteItem(c_oserct_updownbarsUPBARS, function () {
            oThis.WriteCT_UpDownBar(oVal.upBars);
        });
    }
    if (null != oVal.downBars) {
        this.bs.WriteItem(c_oserct_updownbarsDOWNBARS, function () {
            oThis.WriteCT_UpDownBar(oVal.downBars);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_UpDownBar = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_updownbarSPPR, function () {
            oThis.WriteSpPr(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Line3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_line3dchartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_line3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_line3dchartSER, function () {
                    oThis.WriteCT_LineSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_line3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_line3dchartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.gapDepth) {
        this.bs.WriteItem(c_oserct_line3dchartGAPDEPTH, function () {
            oThis.WriteCT_GapAmount(oVal.gapDepth);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_line3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Grouping = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        var nVal = null;
        switch (oVal) {
        case GROUPING_PERCENT_STACKED:
            nVal = st_groupingPERCENTSTACKED;
            break;
        case GROUPING_STANDARD:
            nVal = st_groupingSTANDARD;
            break;
        case GROUPING_STACKED:
            nVal = st_groupingSTACKED;
            break;
        }
        if (null != nVal) {
            this.bs.WriteItem(c_oserct_groupingVAL, function () {
                oThis.memory.WriteByte(nVal);
            });
        }
    }
};
BinaryChartWriter.prototype.WriteCT_LineChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_linechartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_linechartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_linechartSER, function () {
                    oThis.WriteCT_LineSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_linechartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_linechartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.hiLowLines) {
        this.bs.WriteItem(c_oserct_linechartHILOWLINES, function () {
            oThis.WriteCT_ChartLines(oVal.hiLowLines);
        });
    }
    if (null != oVal.upDownBars) {
        this.bs.WriteItem(c_oserct_linechartUPDOWNBARS, function () {
            oThis.WriteCT_UpDownBars(oVal.upDownBars);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_linechartMARKER, function () {
            oThis.WriteCT_Boolean(oVal.marker);
        });
    }
    if (null != oVal.smooth) {
        this.bs.WriteItem(c_oserct_linechartSMOOTH, function () {
            oThis.WriteCT_Boolean(oVal.smooth);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_linechartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Area3DChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_area3dchartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_area3dchartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_area3dchartSER, function () {
                    oThis.WriteCT_AreaSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_area3dchartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_area3dchartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_area3dchartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_AreaSer = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_areaserIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.order) {
        this.bs.WriteItem(c_oserct_areaserORDER, function () {
            oThis.WriteCT_UnsignedInt(oVal.order);
        });
    }
    if (null != oVal.tx) {
        this.bs.WriteItem(c_oserct_areaserTX, function () {
            oThis.WriteCT_SerTx(oVal.tx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_areaserSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_areaserPICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
    if (null != oVal.dPt) {
        for (var i = 0, length = oVal.dPt.length; i < length; ++i) {
            var oCurVal = oVal.dPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_areaserDPT, function () {
                    oThis.WriteCT_DPt(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_areaserDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.trendline) {
        this.bs.WriteItem(c_oserct_areaserTRENDLINE, function () {
            oThis.WriteCT_Trendline(oVal.trendline);
        });
    }
    if (null != oVal.errBars) {
        this.bs.WriteItem(c_oserct_areaserERRBARS, function () {
            oThis.WriteCT_ErrBars(oVal.errBars);
        });
    }
    if (null != oVal.cat) {
        this.bs.WriteItem(c_oserct_areaserCAT, function () {
            oThis.WriteCT_AxDataSource(oVal.cat);
        });
    }
    if (null != oVal.val) {
        this.bs.WriteItem(c_oserct_areaserVAL, function () {
            oThis.WriteCT_NumDataSource(oVal.val);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_AreaChart = function (oVal) {
    var oThis = this;
    if (null != oVal.grouping) {
        this.bs.WriteItem(c_oserct_areachartGROUPING, function () {
            oThis.WriteCT_Grouping(oVal.grouping);
        });
    }
    if (null != oVal.varyColors) {
        this.bs.WriteItem(c_oserct_areachartVARYCOLORS, function () {
            oThis.WriteCT_Boolean(oVal.varyColors);
        });
    }
    if (null != oVal.series) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_areachartSER, function () {
                    oThis.WriteCT_AreaSer(oCurVal);
                });
            }
        }
    }
    if (null != oVal.dLbls) {
        this.bs.WriteItem(c_oserct_areachartDLBLS, function () {
            oThis.WriteCT_DLbls(oVal.dLbls);
        });
    }
    if (null != oVal.dropLines) {
        this.bs.WriteItem(c_oserct_areachartDROPLINES, function () {
            oThis.WriteCT_ChartLines(oVal.dropLines);
        });
    }
    if (null != oVal.axId) {
        for (var i = 0, length = oVal.axId.length; i < length; ++i) {
            var oCurVal = oVal.axId[i];
            if (null != oCurVal && null != oCurVal.axId) {
                this.bs.WriteItem(c_oserct_areachartAXID, function () {
                    oThis.WriteCT_UnsignedInt(oCurVal.axId);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_PlotArea = function (oVal) {
    var oThis = this;
    this.bs.WriteItem(c_oserct_plotareaLAYOUT, function () {
        oThis.WriteCT_Layout(oVal);
    });
    for (var i = 0, length = oVal.charts.length; i < length; ++i) {
        var chart = oVal.charts[i];
        if (chart instanceof CAreaChart) {
            this.bs.WriteItem(c_oserct_plotareaAREACHART, function () {
                oThis.WriteCT_AreaChart(chart);
            });
        } else {
            if (chart instanceof CBarChart) {
                this.bs.WriteItem(c_oserct_plotareaBARCHART, function () {
                    oThis.WriteCT_BarChart(chart);
                });
            } else {
                if (chart instanceof CBubbleChart) {
                    this.bs.WriteItem(c_oserct_plotareaBUBBLECHART, function () {
                        oThis.WriteCT_BubbleChart(chart);
                    });
                } else {
                    if (chart instanceof CDoughnutChart) {
                        this.bs.WriteItem(c_oserct_plotareaDOUGHNUTCHART, function () {
                            oThis.WriteCT_DoughnutChart(chart);
                        });
                    } else {
                        if (chart instanceof CLineChart) {
                            this.bs.WriteItem(c_oserct_plotareaLINECHART, function () {
                                oThis.WriteCT_LineChart(chart);
                            });
                        } else {
                            if (chart instanceof COfPieChart) {
                                this.bs.WriteItem(c_oserct_plotareaOFPIECHART, function () {
                                    oThis.WriteCT_OfPieChart(chart);
                                });
                            } else {
                                if (chart instanceof CPieChart) {
                                    this.bs.WriteItem(c_oserct_plotareaPIECHART, function () {
                                        oThis.WriteCT_PieChart(chart);
                                    });
                                } else {
                                    if (chart instanceof CRadarChart) {
                                        this.bs.WriteItem(c_oserct_plotareaRADARCHART, function () {
                                            oThis.WriteCT_RadarChart(chart);
                                        });
                                    } else {
                                        if (chart instanceof CScatterChart) {
                                            this.bs.WriteItem(c_oserct_plotareaSCATTERCHART, function () {
                                                oThis.WriteCT_ScatterChart(chart);
                                            });
                                        } else {
                                            if (chart instanceof CStockChart) {
                                                this.bs.WriteItem(c_oserct_plotareaSTOCKCHART, function () {
                                                    oThis.WriteCT_StockChart(chart);
                                                });
                                            } else {
                                                if (chart instanceof CSurfaceChart) {
                                                    this.bs.WriteItem(c_oserct_plotareaSURFACECHART, function () {
                                                        oThis.WriteCT_SurfaceChart(chart);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    for (var i = 0, length = oVal.axId.length; i < length; ++i) {
        var axis = oVal.axId[i];
        if (axis instanceof CCatAx) {
            this.bs.WriteItem(c_oserct_plotareaCATAX, function () {
                oThis.WriteCT_CatAx(axis);
            });
        } else {
            if (axis instanceof CValAx) {
                this.bs.WriteItem(c_oserct_plotareaVALAX, function () {
                    oThis.WriteCT_ValAx(axis);
                });
            } else {
                if (axis instanceof CDateAx) {
                    this.bs.WriteItem(c_oserct_plotareaDATEAX, function () {
                        oThis.WriteCT_DateAx(axis);
                    });
                } else {
                    if (axis instanceof CSerAx) {
                        this.bs.WriteItem(c_oserct_plotareaSERAX, function () {
                            oThis.WriteCT_SerAx(axis);
                        });
                    }
                }
            }
        }
    }
    if (null != oVal.dTable) {
        this.bs.WriteItem(c_oserct_plotareaDTABLE, function () {
            oThis.WriteCT_DTable(oVal.dTable);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_plotareaSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Thickness = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_thicknessVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Surface = function (oVal) {
    var oThis = this;
    if (null != oVal.thickness) {
        this.bs.WriteItem(c_oserct_surfaceTHICKNESS, function () {
            oThis.WriteCT_Thickness(oVal.thickness);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_surfaceSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.pictureOptions) {
        this.bs.WriteItem(c_oserct_surfacePICTUREOPTIONS, function () {
            oThis.WriteCT_PictureOptions(oVal.pictureOptions);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Perspective = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_perspectiveVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_DepthPercent = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_depthpercentVAL, function () {
            oThis.memory.WriteString3(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RotY = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_rotyVAL, function () {
            oThis.memory.WriteLong(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_HPercent = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_hpercentVAL, function () {
            oThis.memory.WriteString3(oThis.percentToString(oVal, true, false));
        });
    }
};
BinaryChartWriter.prototype.WriteCT_RotX = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_rotxVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_View3D = function (oVal) {
    var oThis = this;
    if (null != oVal.rotX) {
        this.bs.WriteItem(c_oserct_view3dROTX, function () {
            oThis.WriteCT_RotX(oVal.rotX);
        });
    }
    if (null != oVal.hPercent) {
        this.bs.WriteItem(c_oserct_view3dHPERCENT, function () {
            oThis.WriteCT_HPercent(oVal.hPercent);
        });
    }
    if (null != oVal.rotY) {
        this.bs.WriteItem(c_oserct_view3dROTY, function () {
            oThis.WriteCT_RotY(oVal.rotY);
        });
    }
    if (null != oVal.depthPercent) {
        this.bs.WriteItem(c_oserct_view3dDEPTHPERCENT, function () {
            oThis.WriteCT_DepthPercent(oVal.depthPercent);
        });
    }
    if (null != oVal.rAngAx) {
        this.bs.WriteItem(c_oserct_view3dRANGAX, function () {
            oThis.WriteCT_Boolean(oVal.rAngAx);
        });
    }
    if (null != oVal.perspective) {
        this.bs.WriteItem(c_oserct_view3dPERSPECTIVE, function () {
            oThis.WriteCT_Perspective(oVal.perspective);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PivotFmt = function (oVal) {
    var oThis = this;
    if (null != oVal.idx) {
        this.bs.WriteItem(c_oserct_pivotfmtIDX, function () {
            oThis.WriteCT_UnsignedInt(oVal.idx);
        });
    }
    if (null != oVal.spPr) {
        this.bs.WriteItem(c_oserct_pivotfmtSPPR, function () {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if (null != oVal.txPr) {
        this.bs.WriteItem(c_oserct_pivotfmtTXPR, function () {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if (null != oVal.marker) {
        this.bs.WriteItem(c_oserct_pivotfmtMARKER, function () {
            oThis.WriteCT_Marker(oVal.marker);
        });
    }
    if (null != oVal.dLbl) {
        this.bs.WriteItem(c_oserct_pivotfmtDLBL, function () {
            oThis.WriteCT_DLbl(oVal.dLbl);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_pivotFmts = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        for (var i = 0, length = oVal.length; i < length; ++i) {
            var oCurVal = oVal[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_pivotfmtsPIVOTFMT, function () {
                    oThis.WriteCT_PivotFmt(oCurVal);
                });
            }
        }
    }
};
BinaryChartWriter.prototype.WriteCT_Chart = function (oVal) {
    var oThis = this;
    if (null != oVal.title) {
        this.bs.WriteItem(c_oserct_chartTITLE, function () {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if (null != oVal.autoTitleDeleted) {
        this.bs.WriteItem(c_oserct_chartAUTOTITLEDELETED, function () {
            oThis.WriteCT_Boolean(oVal.autoTitleDeleted);
        });
    }
    if (null != oVal.pivotFmts && oVal.pivotFmts.length > 0) {
        this.bs.WriteItem(c_oserct_chartPIVOTFMTS, function () {
            oThis.WriteCT_pivotFmts(oVal.pivotFmts);
        });
    }
    if (null != oVal.view3D) {
        this.bs.WriteItem(c_oserct_chartVIEW3D, function () {
            oThis.WriteCT_View3D(oVal.view3D);
        });
    }
    if (null != oVal.floor) {
        this.bs.WriteItem(c_oserct_chartFLOOR, function () {
            oThis.WriteCT_Surface(oVal.floor);
        });
    }
    if (null != oVal.sideWall) {
        this.bs.WriteItem(c_oserct_chartSIDEWALL, function () {
            oThis.WriteCT_Surface(oVal.sideWall);
        });
    }
    if (null != oVal.backWall) {
        this.bs.WriteItem(c_oserct_chartBACKWALL, function () {
            oThis.WriteCT_Surface(oVal.backWall);
        });
    }
    if (null != oVal.plotArea) {
        this.bs.WriteItem(c_oserct_chartPLOTAREA, function () {
            oThis.WriteCT_PlotArea(oVal.plotArea);
        });
    }
    if (null != oVal.legend) {
        this.bs.WriteItem(c_oserct_chartLEGEND, function () {
            oThis.WriteCT_Legend(oVal.legend);
        });
    }
    if (null != oVal.plotVisOnly) {
        this.bs.WriteItem(c_oserct_chartPLOTVISONLY, function () {
            oThis.WriteCT_Boolean(oVal.plotVisOnly);
        });
    }
    if (null != oVal.dispBlanksAs) {
        this.bs.WriteItem(c_oserct_chartDISPBLANKSAS, function () {
            oThis.WriteCT_DispBlanksAs(oVal.dispBlanksAs);
        });
    }
    if (null != oVal.showDLblsOverMax) {
        this.bs.WriteItem(c_oserct_chartSHOWDLBLSOVERMAX, function () {
            oThis.WriteCT_Boolean(oVal.showDLblsOverMax);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Protection = function (oVal) {
    var oThis = this;
    if (null != oVal.chartObject) {
        this.bs.WriteItem(c_oserct_protectionCHARTOBJECT, function () {
            oThis.WriteCT_Boolean(oVal.chartObject);
        });
    }
    if (null != oVal.data) {
        this.bs.WriteItem(c_oserct_protectionDATA, function () {
            oThis.WriteCT_Boolean(oVal.data);
        });
    }
    if (null != oVal.formatting) {
        this.bs.WriteItem(c_oserct_protectionFORMATTING, function () {
            oThis.WriteCT_Boolean(oVal.formatting);
        });
    }
    if (null != oVal.selection) {
        this.bs.WriteItem(c_oserct_protectionSELECTION, function () {
            oThis.WriteCT_Boolean(oVal.selection);
        });
    }
    if (null != oVal.userInterface) {
        this.bs.WriteItem(c_oserct_protectionUSERINTERFACE, function () {
            oThis.WriteCT_Boolean(oVal.userInterface);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_PivotSource = function (oVal) {
    var oThis = this;
    if (null != oVal.name) {
        this.bs.WriteItem(c_oserct_pivotsourceNAME, function () {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if (null != oVal.fmtId) {
        this.bs.WriteItem(c_oserct_pivotsourceFMTID, function () {
            oThis.WriteCT_UnsignedInt(oVal.fmtId);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Style1 = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_style1VAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_Style = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_styleVAL, function () {
            oThis.memory.WriteByte(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteCT_TextLanguageID = function (oVal) {
    var oThis = this;
    if (null != oVal) {
        this.bs.WriteItem(c_oserct_textlanguageidVAL, function () {
            oThis.memory.WriteString3(oVal);
        });
    }
};
BinaryChartWriter.prototype.WriteAlternateContent = function (oVal) {
    var oThis = this;
    if (null != oVal.m_Choice) {
        for (var i = 0, length = oVal.m_Choice.length; i < length; ++i) {
            var oCurVal = oVal.m_Choice[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oseralternatecontentCHOICE, function () {
                    oThis.WriteAlternateContentChoice(oCurVal);
                });
            }
        }
    }
    var oCurVal = oVal.m_Fallback;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentFALLBACK, function () {
            oThis.WriteAlternateContentFallback(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteAlternateContentChoice = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_style;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentchoiceSTYLE, function () {
            oThis.WriteCT_Style(oCurVal);
        });
    }
    var oCurVal = oVal.m_Requires;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentchoiceREQUIRES, function () {
            oThis.memory.WriteString3(oCurVal);
        });
    }
};
BinaryChartWriter.prototype.WriteAlternateContentFallback = function (oVal) {
    var oThis = this;
    var oCurVal = oVal.m_style;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oseralternatecontentfallbackSTYLE, function () {
            oThis.WriteCT_Style1(oCurVal);
        });
    }
};
function BinaryChartReader(stream) {
    this.stream = stream;
    this.bcr = new Binary_CommonReader(this.stream);
}
BinaryChartReader.prototype.ReadCT_extLst = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_extlstEXT === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Extension(t, l, oNewVal);
        });
        if (null == val.m_ext) {
            val.m_ext = [];
        }
        val.m_ext.push(oNewVal);
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ExternalReadCT_ChartSpace = function (length, val, curWorksheet) {
    var res = c_oSerConstants.ReadOk;
    this.curWorksheet = curWorksheet;
    var oThis = this;
    this.curChart = val;
    res = this.bcr.Read1(length, function (t, l) {
        return oThis.ReadCT_ChartSpace(t, l, val);
    });
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartSpace = function (type, length, val, curWorksheet) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartspaceDATE1904 === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setDate1904(oNewVal.m_val);
        }
    } else {
        if (c_oserct_chartspaceLANG === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_TextLanguageID(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setLang(oNewVal.m_val);
            }
        } else {
            if (c_oserct_chartspaceROUNDEDCORNERS === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setRoundedCorners(oNewVal.m_val);
                }
            } else {
                if (c_oserct_chartspaceALTERNATECONTENT === type) {
                    var oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadAlternateContent(t, l, oNewVal);
                    });
                    var nNewStyle = null;
                    if (null != oNewVal.m_Choice && oNewVal.m_Choice.length > 0) {
                        var choice = oNewVal.m_Choice[0];
                        if (null != choice.m_style && null != choice.m_style.m_val) {
                            nNewStyle = choice.m_style.m_val - 100;
                        }
                    }
                    if (null == nNewStyle && null != oNewVal.m_Fallback && null != oNewVal.m_Fallback.m_style && null != oNewVal.m_Fallback.m_style.m_val) {
                        nNewStyle = oNewVal.m_Fallback.m_style.m_val;
                    }
                    if (null != nNewStyle) {
                        val.setStyle(nNewStyle);
                    }
                } else {
                    if (c_oserct_chartspaceSTYLE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Style1(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setStyle(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_chartspaceCLRMAPOVR === type) {
                            val.setClrMapOvr(this.ReadClrOverride(length));
                        } else {
                            if (c_oserct_chartspacePIVOTSOURCE === type) {
                                var oNewVal = new CPivotSource();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_PivotSource(t, l, oNewVal);
                                });
                                val.setPivotSource(oNewVal);
                            } else {
                                if (c_oserct_chartspacePROTECTION === type) {
                                    var oNewVal = new CProtection();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Protection(t, l, oNewVal);
                                    });
                                    val.setProtection(oNewVal);
                                } else {
                                    if (c_oserct_chartspaceCHART === type) {
                                        var oNewVal = new CChart();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Chart(t, l, oNewVal);
                                        });
                                        val.setChart(oNewVal);
                                    } else {
                                        if (c_oserct_chartspaceSPPR === type) {
                                            val.setSpPr(this.ReadSpPr(length));
                                            val.spPr.setParent(val);
                                        } else {
                                            if (c_oserct_chartspaceTXPR === type) {
                                                val.setTxPr(this.ReadTxPr(length));
                                                val.txPr.setParent(val);
                                            } else {
                                                if (c_oserct_chartspacePRINTSETTINGS === type) {
                                                    var oNewVal = new CPrintSettings();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_PrintSettings(t, l, oNewVal);
                                                    });
                                                    val.setPrintSettings(oNewVal);
                                                } else {
                                                    if (c_oserct_chartspaceEXTLST === type) {
                                                        var oNewVal;
                                                        oNewVal = {};
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                                        });
                                                    } else {
                                                        if (c_oserct_chartspaceTHEMEOVERRIDE === type) {
                                                            var theme = window.global_pptx_content_loader.ReadTheme(this, this.stream);
                                                            if (null != theme) {
                                                                val.setThemeOverride(theme);
                                                            }
                                                            res = c_oSerConstants.ReadUnknown;
                                                        } else {
                                                            res = c_oSerConstants.ReadUnknown;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadSpPr = function (length) {
    return window.global_pptx_content_loader.ReadShapeProperty(this.stream);
};
BinaryChartReader.prototype.ReadClrOverride = function (lenght) {
    var loader = new BinaryPPTYLoader();
    loader.stream = new FileStream();
    loader.stream.obj = this.stream.obj;
    loader.stream.data = this.stream.data;
    loader.stream.size = this.stream.size;
    loader.stream.pos = this.stream.pos;
    loader.stream.cur = this.stream.cur;
    var s = loader.stream;
    var _main_type = s.GetUChar();
    var clr_map = new ClrMap();
    loader.ReadClrMap(clr_map);
    this.stream.pos = s.pos;
    this.stream.cur = s.cur;
    return clr_map;
};
BinaryChartReader.prototype.ReadTxPr = function (length) {
    var cur = this.stream.cur;
    var ret = window.global_pptx_content_loader.ReadTextBody(null, this.stream, null, this.curWorksheet);
    this.stream.cur = cur + length;
    return ret;
};
BinaryChartReader.prototype.ParsePersent = function (val) {
    var nVal = parseFloat(val);
    if (!isNaN(nVal)) {
        return nVal;
    } else {
        return null;
    }
};
BinaryChartReader.prototype.ParseMetric = function (val) {
    var nVal = parseFloat(val);
    var nRes = null;
    if (!isNaN(nVal)) {
        if (-1 != val.indexOf("mm")) {
            nRes = nVal;
        } else {
            if (-1 != val.indexOf("cm")) {
                nRes = nVal * 10;
            } else {
                if (-1 != val.indexOf("in")) {
                    nRes = nVal * 2.54 * 10;
                } else {
                    if (-1 != val.indexOf("pt")) {
                        nRes = nVal * 2.54 * 10 / 72;
                    } else {
                        if (-1 != val.indexOf("pc") || -1 != val.indexOf("pi")) {
                            nRes = nVal * 12 * 2.54 * 10 / 72;
                        }
                    }
                }
            }
        }
    }
    return nRes;
};
BinaryChartReader.prototype.ConvertSurfaceToLine = function (oSurface, aChartWithAxis) {
    var oLine = new CLineChart();
    oLine.setGrouping(GROUPING_STANDARD);
    oLine.setVaryColors(false);
    for (var i = 0, length = oSurface.series.length; i < length; ++i) {
        var surfaceSer = oSurface.series[i];
        var lineSer = new CLineSeries();
        if (null != surfaceSer.idx) {
            lineSer.setIdx(surfaceSer.idx);
        }
        if (null != surfaceSer.order) {
            lineSer.setOrder(surfaceSer.order);
        }
        if (null != surfaceSer.tx) {
            lineSer.setTx(surfaceSer.tx);
        }
        if (null != surfaceSer.spPr) {
            lineSer.setSpPr(surfaceSer.spPr);
        }
        if (null != surfaceSer.cat) {
            lineSer.setCat(surfaceSer.cat);
        }
        if (null != surfaceSer.val) {
            lineSer.setVal(surfaceSer.val);
        }
        var marker = new CMarker();
        marker.setSymbol(SYMBOL_NONE);
        lineSer.setMarker(marker);
        lineSer.setSmooth(false);
        oLine.addSer(lineSer);
    }
    var dLbls = new CDLbls();
    dLbls.setShowLegendKey(false);
    dLbls.setShowVal(false);
    dLbls.setShowCatName(false);
    dLbls.setShowSerName(false);
    dLbls.setShowPercent(false);
    dLbls.setShowBubbleSize(false);
    oLine.setDLbls(dLbls);
    oLine.setMarker(true);
    oLine.setSmooth(false);
    this.CorrectChartWithAxis(oSurface, oLine, aChartWithAxis);
    return oLine;
};
BinaryChartReader.prototype.ConvertSurfaceValAxToLineValAx = function (oSurfaceValAx) {
    oSurfaceValAx.setCrossBetween(CROSS_BETWEEN_BETWEEN);
    oSurfaceValAx.setTickLblPos(TICK_LABEL_POSITION_NEXT_TO);
};
BinaryChartReader.prototype.ConvertRadarToLine = function (oRadar, aChartWithAxis) {
    var bMarkerNull = RADAR_STYLE_FILLED == oRadar.radarStyle;
    var oLine = new CLineChart();
    oLine.setGrouping(GROUPING_STANDARD);
    if (null != oRadar.varyColors) {
        oLine.setVaryColors(oRadar.varyColors);
    }
    if (null != oRadar.dLbls) {
        oLine.setDLbls(oRadar.dLbls);
    }
    for (var i = 0, length = oRadar.series.length; i < length; ++i) {
        var radarSer = oRadar.series[i];
        var lineSer = new CLineSeries();
        if (null != radarSer.idx) {
            lineSer.setIdx(radarSer.idx);
        }
        if (null != radarSer.order) {
            lineSer.setOrder(radarSer.order);
        }
        if (null != radarSer.tx) {
            lineSer.setTx(radarSer.tx);
        }
        if (null != radarSer.spPr) {
            lineSer.setSpPr(radarSer.spPr);
        }
        if (null != radarSer.marker) {
            lineSer.setMarker(radarSer.marker);
        } else {
            if (bMarkerNull) {
                var marker = new CMarker();
                marker.setSymbol(SYMBOL_NONE);
                lineSer.setMarker(marker);
            }
        }
        for (var j = 0, length2 = radarSer.dPt.length; j < length2; ++j) {
            lineSer.addDPt(radarSer.dPt[j]);
        }
        if (null != radarSer.dLbls) {
            lineSer.setDLbls(radarSer.dLbls);
        }
        if (null != radarSer.cat) {
            lineSer.setCat(radarSer.cat);
        }
        if (null != radarSer.val) {
            lineSer.setVal(radarSer.val);
        }
        lineSer.setSmooth(false);
        oLine.addSer(lineSer);
    }
    oLine.setMarker(true);
    oLine.setSmooth(false);
    this.CorrectChartWithAxis(oRadar, oLine, aChartWithAxis);
    return oLine;
};
BinaryChartReader.prototype.ConvertBubbleToScatter = function (oBubble, aChartWithAxis) {
    var oScatter = new CScatterChart();
    oScatter.setScatterStyle(SCATTER_STYLE_LINE_MARKER);
    if (null != oBubble.varyColors) {
        oScatter.setVaryColors(oBubble.varyColors);
    }
    if (null != oBubble.dLbls) {
        oScatter.setDLbls(oBubble.dLbls);
    }
    for (var i = 0, length = oBubble.series.length; i < length; ++i) {
        var bubbleSer = oBubble.series[i];
        var scatterSer = new CScatterSeries();
        if (null != bubbleSer.idx) {
            scatterSer.setIdx(bubbleSer.idx);
        }
        if (null != bubbleSer.order) {
            scatterSer.setOrder(bubbleSer.order);
        }
        if (null != bubbleSer.tx) {
            scatterSer.setTx(bubbleSer.tx);
        }
        for (var j = 0, length2 = bubbleSer.dPt.length; j < length2; ++j) {
            scatterSer.addDPt(bubbleSer.dPt[j]);
        }
        if (null != bubbleSer.dLbls) {
            scatterSer.setDLbls(bubbleSer.dLbls);
        }
        if (null != bubbleSer.trendline) {
            scatterSer.setTrendline(bubbleSer.trendline);
        }
        if (null != bubbleSer.errBars) {
            scatterSer.setErrBars(bubbleSer.errBars);
        }
        if (null != bubbleSer.xVal) {
            scatterSer.setXVal(bubbleSer.xVal);
        }
        if (null != bubbleSer.yVal) {
            scatterSer.setYVal(bubbleSer.yVal);
        }
        var spPr = new CSpPr();
        var ln = new CLn();
        ln.setW(28575);
        var uni_fill = new CUniFill();
        uni_fill.setFill(new CNoFill());
        ln.setFill(uni_fill);
        spPr.setLn(ln);
        scatterSer.setSpPr(spPr);
        scatterSer.setSmooth(false);
        oScatter.addSer(scatterSer);
    }
    this.CorrectChartWithAxis(oBubble, oScatter, aChartWithAxis);
    return oScatter;
};
BinaryChartReader.prototype.ConvertOfPieToPie = function (oOfPie, aChartWithAxis) {
    var oPie = new CPieChart();
    if (null != oOfPie.varyColors) {
        oPie.setVaryColors(oOfPie.varyColors);
    }
    if (null != oOfPie.dLbls) {
        oPie.setDLbls(oOfPie.dLbls);
    }
    for (var i = 0, length = oOfPie.series.length; i < length; ++i) {
        oPie.addSer(oOfPie.series[i]);
    }
    oPie.setFirstSliceAng(0);
    this.CorrectChartWithAxis(oOfPie, oPie, aChartWithAxis);
    return oPie;
};
BinaryChartReader.prototype.CorrectChartWithAxis = function (chartOld, chartNew, aChartWithAxis) {
    for (var i = 0, length = aChartWithAxis.length; i < length; ++i) {
        var item = aChartWithAxis[i];
        if (item.chart == chartOld) {
            item.chart = chartNew;
        }
    }
};
BinaryChartReader.prototype.ReadCT_Boolean = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_booleanVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetBool();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ExternalReadCT_RelId = function (length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    res = this.bcr.Read1(length, function (t, l) {
        return oThis.ReadCT_RelId(t, l, val);
    });
    return res;
};
BinaryChartReader.prototype.ReadCT_RelId = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_relidID === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_id = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PageSetup = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pagesetupPAPERSIZE === type) {
        val.setPaperSize(this.stream.GetULongLE());
    } else {
        if (c_oserct_pagesetupPAPERHEIGHT === type) {
            var mm = this.ParseMetric(this.stream.GetString2LE(length));
            if (null != mm) {
                val.setPaperHeight(mm);
            }
        } else {
            if (c_oserct_pagesetupPAPERWIDTH === type) {
                var mm = this.ParseMetric(this.stream.GetString2LE(length));
                if (null != mm) {
                    val.setPaperWidth(mm);
                }
            } else {
                if (c_oserct_pagesetupFIRSTPAGENUMBER === type) {
                    val.setFirstPageNumber(this.stream.GetULongLE());
                } else {
                    if (c_oserct_pagesetupORIENTATION === type) {
                        switch (this.stream.GetUChar()) {
                        case st_pagesetuporientationDEFAULT:
                            val.setOrientation(PAGE_SETUP_ORIENTATION_DEFAULT);
                            break;
                        case st_pagesetuporientationPORTRAIT:
                            val.setOrientation(PAGE_SETUP_ORIENTATION_PORTRAIT);
                            break;
                        case st_pagesetuporientationLANDSCAPE:
                            val.setOrientation(PAGE_SETUP_ORIENTATION_LANDSCAPE);
                            break;
                        }
                    } else {
                        if (c_oserct_pagesetupBLACKANDWHITE === type) {
                            val.setBlackAndWhite(this.stream.GetBool());
                        } else {
                            if (c_oserct_pagesetupDRAFT === type) {
                                val.setBlackAndWhite(this.stream.GetBool());
                            } else {
                                if (c_oserct_pagesetupUSEFIRSTPAGENUMBER === type) {
                                    val.setUseFirstPageNumb(this.stream.GetBool());
                                } else {
                                    if (c_oserct_pagesetupHORIZONTALDPI === type) {
                                        val.setHorizontalDpi(this.stream.GetULongLE());
                                    } else {
                                        if (c_oserct_pagesetupVERTICALDPI === type) {
                                            val.setVerticalDpi(this.stream.GetULongLE());
                                        } else {
                                            if (c_oserct_pagesetupCOPIES === type) {
                                                val.setCopies(this.stream.GetULongLE());
                                            } else {
                                                res = c_oSerConstants.ReadUnknown;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PageMargins = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pagemarginsL === type) {
        val.setL(this.stream.GetDoubleLE());
    } else {
        if (c_oserct_pagemarginsR === type) {
            val.setR(this.stream.GetDoubleLE());
        } else {
            if (c_oserct_pagemarginsT === type) {
                val.setT(this.stream.GetDoubleLE());
            } else {
                if (c_oserct_pagemarginsB === type) {
                    val.setB(this.stream.GetDoubleLE());
                } else {
                    if (c_oserct_pagemarginsHEADER === type) {
                        val.setHeader(this.stream.GetDoubleLE());
                    } else {
                        if (c_oserct_pagemarginsFOOTER === type) {
                            val.setFooter(this.stream.GetDoubleLE());
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_HeaderFooter = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_headerfooterODDHEADER === type) {
        val.setOddHeader(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_headerfooterODDFOOTER === type) {
            val.setOddFooter(this.stream.GetString2LE(length));
        } else {
            if (c_oserct_headerfooterEVENHEADER === type) {
                val.setEvenHeader(this.stream.GetString2LE(length));
            } else {
                if (c_oserct_headerfooterEVENFOOTER === type) {
                    val.setEvenFooter(this.stream.GetString2LE(length));
                } else {
                    if (c_oserct_headerfooterFIRSTHEADER === type) {
                        val.setFirstHeader(this.stream.GetString2LE(length));
                    } else {
                        if (c_oserct_headerfooterFIRSTFOOTER === type) {
                            val.setFirstFooter(this.stream.GetString2LE(length));
                        } else {
                            if (c_oserct_headerfooterALIGNWITHMARGINS === type) {
                                val.setAlignWithMargins(this.stream.GetBool());
                            } else {
                                if (c_oserct_headerfooterDIFFERENTODDEVEN === type) {
                                    val.setDifferentOddEven(this.stream.GetBool());
                                } else {
                                    if (c_oserct_headerfooterDIFFERENTFIRST === type) {
                                        val.setDifferentFirst(this.stream.GetBool());
                                    } else {
                                        res = c_oSerConstants.ReadUnknown;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PrintSettings = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_printsettingsHEADERFOOTER === type) {
        var oNewVal = new CHeaderFooterChart();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_HeaderFooter(t, l, oNewVal);
        });
        val.setHeaderFooter(oNewVal);
    } else {
        if (c_oserct_printsettingsPAGEMARGINS === type) {
            var oNewVal = new CPageMarginsChart();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_PageMargins(t, l, oNewVal);
            });
            val.setPageMargins(oNewVal);
        } else {
            if (c_oserct_printsettingsPAGESETUP === type) {
                var oNewVal = new CPageSetup();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_PageSetup(t, l, oNewVal);
                });
                val.setPageSetup(oNewVal);
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ExternalData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_externaldataAUTOUPDATE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        val.m_autoUpdate = oNewVal;
    } else {
        if (c_oserct_externaldataID === type) {
            var oNewVal;
            oNewVal = this.stream.GetString2LE(length);
            val.m_id = oNewVal;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DispBlanksAs = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dispblanksasVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_dispblanksasSPAN:
            val.m_val = DISP_BLANKS_AS_SPAN;
            break;
        case st_dispblanksasGAP:
            val.m_val = DISP_BLANKS_AS_GAP;
            break;
        case st_dispblanksasZERO:
            val.m_val = DISP_BLANKS_AS_ZERO;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LegendEntry = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_legendentryIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_legendentryDELETE === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setDelete(oNewVal.m_val);
            }
        } else {
            if (c_oserct_legendentryTXPR === type) {
                val.setTxPr(this.ReadTxPr(length));
                val.txPr.setParent(val);
            } else {
                if (c_oserct_legendentryEXTLST === type) {
                    var oNewVal;
                    oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_UnsignedInt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_unsignedintVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Extension = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_extensionANY === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_Any = oNewVal;
    } else {
        if (c_oserct_extensionURI === type) {
            var oNewVal;
            oNewVal = this.stream.GetString2LE(length);
            val.m_uri = oNewVal;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LegendPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_legendposVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_legendposB:
            val.m_val = LEGEND_POS_B;
            break;
        case st_legendposTR:
            val.m_val = LEGEND_POS_TR;
            break;
        case st_legendposL:
            val.m_val = LEGEND_POS_L;
            break;
        case st_legendposR:
            val.m_val = LEGEND_POS_R;
            break;
        case st_legendposT:
            val.m_val = LEGEND_POS_T;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Legend = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_legendLEGENDPOS === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LegendPos(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setLegendPos(oNewVal.m_val);
        }
    } else {
        if (c_oserct_legendLEGENDENTRY === type) {
            var oNewVal = new CLegendEntry();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_LegendEntry(t, l, oNewVal);
            });
            val.addLegendEntry(oNewVal);
        } else {
            if (c_oserct_legendLAYOUT === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Layout(t, l, val);
                });
            } else {
                if (c_oserct_legendOVERLAY === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setOverlay(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_legendSPPR === type) {
                        val.setSpPr(this.ReadSpPr(length));
                    } else {
                        if (c_oserct_legendTXPR === type) {
                            val.setTxPr(this.ReadTxPr(length));
                            val.txPr.setParent(val);
                        } else {
                            if (c_oserct_legendEXTLST === type) {
                                var oNewVal;
                                oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Layout = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_layoutMANUALLAYOUT === type) {
        var oNewVal = new CLayout();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ManualLayout(t, l, oNewVal);
        });
        val.setLayout(oNewVal);
    } else {
        if (c_oserct_layoutEXTLST === type) {
            var oNewVal;
            oNewVal = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_extLst(t, l, oNewVal);
            });
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ManualLayout = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_manuallayoutLAYOUTTARGET === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LayoutTarget(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setLayoutTarget(oNewVal.m_val);
        }
    } else {
        if (c_oserct_manuallayoutXMODE === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_LayoutMode(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setXMode(oNewVal.m_val);
            }
        } else {
            if (c_oserct_manuallayoutYMODE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_LayoutMode(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setYMode(oNewVal.m_val);
                }
            } else {
                if (c_oserct_manuallayoutWMODE === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_LayoutMode(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setWMode(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_manuallayoutHMODE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_LayoutMode(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setHMode(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_manuallayoutX === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_Double(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setX(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_manuallayoutY === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Double(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setY(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_manuallayoutW === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Double(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.m_val) {
                                        val.setW(oNewVal.m_val);
                                    }
                                } else {
                                    if (c_oserct_manuallayoutH === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Double(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setH(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_manuallayoutEXTLST === type) {
                                            var oNewVal;
                                            oNewVal = {};
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                            });
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LayoutTarget = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_layouttargetVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_layouttargetINNER:
            val.m_val = LAYOUT_TARGET_INNER;
            break;
        case st_layouttargetOUTER:
            val.m_val = LAYOUT_TARGET_OUTER;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LayoutMode = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_layoutmodeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_layoutmodeEDGE:
            val.m_val = LAYOUT_MODE_EDGE;
            break;
        case st_layoutmodeFACTOR:
            val.m_val = LAYOUT_MODE_FACTOR;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Double = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_doubleVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DTable = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dtableSHOWHORZBORDER === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setShowHorzBorder(oNewVal.m_val);
        }
    } else {
        if (c_oserct_dtableSHOWVERTBORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setShowVertBorder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_dtableSHOWOUTLINE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setShowOutline(oNewVal.m_val);
                }
            } else {
                if (c_oserct_dtableSHOWKEYS === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setShowKeys(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_dtableSPPR === type) {
                        val.setSpPr(this.ReadSpPr(length));
                    } else {
                        if (c_oserct_dtableTXPR === type) {
                            val.setTxPr(this.ReadTxPr(length));
                            val.txPr.setParent(val);
                        } else {
                            if (c_oserct_dtableEXTLST === type) {
                                var oNewVal;
                                oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SerAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_seraxAXID === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setAxId(oNewVal.m_val);
        }
    } else {
        if (c_oserct_seraxSCALING === type) {
            var oNewVal = new CScaling();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Scaling(t, l, oNewVal);
            });
            val.setScaling(oNewVal);
        } else {
            if (c_oserct_seraxDELETE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setDelete(oNewVal.m_val);
                }
            } else {
                if (c_oserct_seraxAXPOS === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_AxPos(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setAxPos(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_seraxMAJORGRIDLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setMajorGridlines(oNewVal.spPr);
                        } else {
                            val.setMajorGridlines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_seraxMINORGRIDLINES === type) {
                            var oNewVal = {
                                spPr: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_ChartLines(t, l, oNewVal);
                            });
                            if (null != oNewVal.spPr) {
                                val.setMinorGridlines(oNewVal.spPr);
                            } else {
                                val.setMinorGridlines(new CSpPr());
                            }
                        } else {
                            if (c_oserct_seraxTITLE === type) {
                                var oNewVal = new CTitle();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Title(t, l, oNewVal);
                                });
                                if (!isRealBool(oNewVal.overlay)) {
                                    oNewVal.setOverlay(false);
                                }
                                val.setTitle(oNewVal);
                            } else {
                                if (c_oserct_seraxNUMFMT === type) {
                                    var oNewVal = new CNumFmt();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_NumFmt(t, l, oNewVal);
                                    });
                                    val.setNumFmt(oNewVal);
                                } else {
                                    if (c_oserct_seraxMAJORTICKMARK === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_TickMark(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setMajorTickMark(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_seraxMINORTICKMARK === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_TickMark(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setMinorTickMark(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_seraxTICKLBLPOS === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_TickLblPos(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setTickLblPos(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_seraxSPPR === type) {
                                                    val.setSpPr(this.ReadSpPr(length));
                                                } else {
                                                    if (c_oserct_seraxTXPR === type) {
                                                        val.setTxPr(this.ReadTxPr(length));
                                                        val.txPr.setParent(val);
                                                    } else {
                                                        if (c_oserct_seraxCROSSAX === type) {
                                                            var oNewVal = {
                                                                m_val: null
                                                            };
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                                            });
                                                            if (null != oNewVal.m_val) {
                                                                val.crossAxId = oNewVal.m_val;
                                                            }
                                                        } else {
                                                            if (c_oserct_seraxCROSSES === type) {
                                                                var oNewVal = {
                                                                    m_val: null
                                                                };
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadCT_Crosses(t, l, oNewVal);
                                                                });
                                                                if (null != oNewVal.m_val) {
                                                                    val.setCrosses(oNewVal.m_val);
                                                                }
                                                            } else {
                                                                if (c_oserct_seraxCROSSESAT === type) {
                                                                    var oNewVal = {
                                                                        m_val: null
                                                                    };
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_Double(t, l, oNewVal);
                                                                    });
                                                                    if (null != oNewVal.m_val) {
                                                                        val.setCrossesAt(oNewVal.m_val);
                                                                    }
                                                                } else {
                                                                    if (c_oserct_seraxTICKLBLSKIP === type) {
                                                                        var oNewVal = {
                                                                            m_val: null
                                                                        };
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadCT_Skip(t, l, oNewVal);
                                                                        });
                                                                        if (null != oNewVal.m_val) {
                                                                            val.setTickLblSkip(oNewVal.m_val);
                                                                        }
                                                                    } else {
                                                                        if (c_oserct_seraxTICKMARKSKIP === type) {
                                                                            var oNewVal = {
                                                                                m_val: null
                                                                            };
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadCT_Skip(t, l, oNewVal);
                                                                            });
                                                                            if (null != oNewVal.m_val) {
                                                                                val.setTickMarkSkip(oNewVal.m_val);
                                                                            }
                                                                        } else {
                                                                            if (c_oserct_seraxEXTLST === type) {
                                                                                var oNewVal;
                                                                                oNewVal = {};
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                                });
                                                                            } else {
                                                                                res = c_oSerConstants.ReadUnknown;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Scaling = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scalingLOGBASE === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LogBase(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setLogBase(oNewVal.m_val);
        }
    } else {
        if (c_oserct_scalingORIENTATION === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Orientation(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrientation(oNewVal.m_val);
            }
        } else {
            if (c_oserct_scalingMAX === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Double(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setMax(oNewVal.m_val);
                }
            } else {
                if (c_oserct_scalingMIN === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Double(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setMin(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_scalingEXTLST === type) {
                        var oNewVal;
                        oNewVal = {};
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_extLst(t, l, oNewVal);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LogBase = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_logbaseVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Orientation = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_orientationVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_orientationMAXMIN:
            val.m_val = ORIENTATION_MAX_MIN;
            break;
        case st_orientationMINMAX:
            val.m_val = ORIENTATION_MIN_MAX;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_AxPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_axposVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_axposB:
            val.m_val = AX_POS_B;
            break;
        case st_axposL:
            val.m_val = AX_POS_L;
            break;
        case st_axposR:
            val.m_val = AX_POS_R;
            break;
        case st_axposT:
            val.m_val = AX_POS_T;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ChartLines = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartlinesSPPR === type) {
        val.spPr = this.ReadSpPr(length);
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Title = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_titleTX === type) {
        var oNewVal = new CChartText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Tx(t, l, oNewVal);
        });
        oNewVal.setChart(this.curChart);
        val.setTx(oNewVal);
    } else {
        if (c_oserct_titleLAYOUT === type) {
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Layout(t, l, val);
            });
        } else {
            if (c_oserct_titleOVERLAY === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setOverlay(oNewVal.m_val);
                }
            } else {
                if (c_oserct_titleSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_titleTXPR === type) {
                        val.setTxPr(this.ReadTxPr(length));
                        val.txPr.setParent(val);
                    } else {
                        if (c_oserct_titleEXTLST === type) {
                            var oNewVal;
                            oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_extLst(t, l, oNewVal);
                            });
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Tx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_txRICH === type) {
        val.setRich(this.ReadTxPr(length));
        val.rich.setParent(val);
    } else {
        if (c_oserct_txSTRREF === type) {
            var oNewVal = new CStrRef();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_StrRef(t, l, oNewVal);
            });
            val.setStrRef(oNewVal);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StrRef = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_strrefF === type) {
        val.setF(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_strrefSTRCACHE === type) {
            var oNewVal = new CStrCache();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_StrData(t, l, oNewVal);
            });
            val.setStrCache(oNewVal);
        } else {
            if (c_oserct_strrefEXTLST === type) {
                var oNewVal;
                oNewVal = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_extLst(t, l, oNewVal);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StrData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_strdataPTCOUNT === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setPtCount(oNewVal.m_val);
        }
    } else {
        if (c_oserct_strdataPT === type) {
            var oNewVal = new CStringPoint();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_StrVal(t, l, oNewVal);
            });
            val.addPt(oNewVal);
        } else {
            if (c_oserct_strdataEXTLST === type) {
                var oNewVal;
                oNewVal = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_extLst(t, l, oNewVal);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StrVal = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_strvalV === type) {
        val.setVal(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_strvalIDX === type) {
            val.setIdx(this.stream.GetULongLE());
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numfmtFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_numfmtSOURCELINKED === type) {
            val.setSourceLinked(this.stream.GetBool());
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TickMark = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_tickmarkVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_tickmarkCROSS:
            val.m_val = TICK_MARK_CROSS;
            break;
        case st_tickmarkIN:
            val.m_val = TICK_MARK_IN;
            break;
        case st_tickmarkNONE:
            val.m_val = TICK_MARK_NONE;
            break;
        case st_tickmarkOUT:
            val.m_val = TICK_MARK_OUT;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TickLblPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_ticklblposVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_ticklblposHIGH:
            val.m_val = TICK_LABEL_POSITION_HIGH;
            break;
        case st_ticklblposLOW:
            val.m_val = TICK_LABEL_POSITION_LOW;
            break;
        case st_ticklblposNEXTTO:
            val.m_val = TICK_LABEL_POSITION_NEXT_TO;
            break;
        case st_ticklblposNONE:
            val.m_val = TICK_LABEL_POSITION_NONE;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Crosses = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_crossesVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_crossesAUTOZERO:
            val.m_val = CROSSES_AUTO_ZERO;
            break;
        case st_crossesMAX:
            val.m_val = CROSSES_MAX;
            break;
        case st_crossesMIN:
            val.m_val = CROSSES_MIN;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Skip = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_skipVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TimeUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_timeunitVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_timeunitDAYS:
            val.m_val = TIME_UNIT_DAYS;
            break;
        case st_timeunitMONTHS:
            val.m_val = TIME_UNIT_MONTHS;
            break;
        case st_timeunitYEARS:
            val.m_val = TIME_UNIT_YEARS;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DateAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dateaxAXID === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setAxId(oNewVal.m_val);
        }
    } else {
        if (c_oserct_dateaxSCALING === type) {
            var oNewVal = new CScaling();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Scaling(t, l, oNewVal);
            });
            val.setScaling(oNewVal);
        } else {
            if (c_oserct_dateaxDELETE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setDelete(oNewVal.m_val);
                }
            } else {
                if (c_oserct_dateaxAXPOS === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_AxPos(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setAxPos(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_dateaxMAJORGRIDLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setMajorGridlines(oNewVal.spPr);
                        } else {
                            val.setMajorGridlines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_dateaxMINORGRIDLINES === type) {
                            var oNewVal = {
                                spPr: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_ChartLines(t, l, oNewVal);
                            });
                            if (null != oNewVal.spPr) {
                                val.setMinorGridlines(oNewVal.spPr);
                            } else {
                                val.setMinorGridlines(new CSpPr());
                            }
                        } else {
                            if (c_oserct_dateaxTITLE === type) {
                                var oNewVal = new CTitle();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Title(t, l, oNewVal);
                                });
                                if (!isRealBool(oNewVal.overlay)) {
                                    oNewVal.setOverlay(false);
                                }
                                val.setTitle(oNewVal);
                            } else {
                                if (c_oserct_dateaxNUMFMT === type) {
                                    var oNewVal = new CNumFmt();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_NumFmt(t, l, oNewVal);
                                    });
                                    val.setNumFmt(oNewVal);
                                } else {
                                    if (c_oserct_dateaxMAJORTICKMARK === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_TickMark(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setMajorTickMark(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_dateaxMINORTICKMARK === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_TickMark(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setMinorTickMark(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_dateaxTICKLBLPOS === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_TickLblPos(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setTickLblPos(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_dateaxSPPR === type) {
                                                    val.setSpPr(this.ReadSpPr(length));
                                                } else {
                                                    if (c_oserct_dateaxTXPR === type) {
                                                        val.setTxPr(this.ReadTxPr(length));
                                                        val.txPr.setParent(val);
                                                    } else {
                                                        if (c_oserct_dateaxCROSSAX === type) {
                                                            var oNewVal = {
                                                                m_val: null
                                                            };
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                                            });
                                                            if (null != oNewVal.m_val) {
                                                                val.crossAxId = oNewVal.m_val;
                                                            }
                                                        } else {
                                                            if (c_oserct_dateaxCROSSES === type) {
                                                                var oNewVal = {
                                                                    m_val: null
                                                                };
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadCT_Crosses(t, l, oNewVal);
                                                                });
                                                                if (null != oNewVal.m_val) {
                                                                    val.setCrosses(oNewVal.m_val);
                                                                }
                                                            } else {
                                                                if (c_oserct_dateaxCROSSESAT === type) {
                                                                    var oNewVal = {
                                                                        m_val: null
                                                                    };
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_Double(t, l, oNewVal);
                                                                    });
                                                                    if (null != oNewVal.m_val) {
                                                                        val.setCrossesAt(oNewVal.m_val);
                                                                    }
                                                                } else {
                                                                    if (c_oserct_dateaxAUTO === type) {
                                                                        var oNewVal = {
                                                                            m_val: null
                                                                        };
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                                        });
                                                                        if (null != oNewVal.m_val) {
                                                                            val.setAuto(oNewVal.m_val);
                                                                        }
                                                                    } else {
                                                                        if (c_oserct_dateaxLBLOFFSET === type) {
                                                                            var oNewVal = {
                                                                                m_val: null
                                                                            };
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadCT_LblOffset(t, l, oNewVal);
                                                                            });
                                                                            if (null != oNewVal.m_val) {
                                                                                val.setLblOffset(oNewVal.m_val);
                                                                            }
                                                                        } else {
                                                                            if (c_oserct_dateaxBASETIMEUNIT === type) {
                                                                                var oNewVal = {
                                                                                    m_val: null
                                                                                };
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadCT_TimeUnit(t, l, oNewVal);
                                                                                });
                                                                            } else {
                                                                                if (c_oserct_dateaxMAJORUNIT === type) {
                                                                                    var oNewVal = {
                                                                                        m_val: null
                                                                                    };
                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                        return oThis.ReadCT_AxisUnit(t, l, oNewVal);
                                                                                    });
                                                                                } else {
                                                                                    if (c_oserct_dateaxMAJORTIMEUNIT === type) {
                                                                                        var oNewVal = {
                                                                                            m_val: null
                                                                                        };
                                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                                            return oThis.ReadCT_TimeUnit(t, l, oNewVal);
                                                                                        });
                                                                                    } else {
                                                                                        if (c_oserct_dateaxMINORUNIT === type) {
                                                                                            var oNewVal = {
                                                                                                m_val: null
                                                                                            };
                                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                                return oThis.ReadCT_AxisUnit(t, l, oNewVal);
                                                                                            });
                                                                                        } else {
                                                                                            if (c_oserct_dateaxMINORTIMEUNIT === type) {
                                                                                                var oNewVal = {
                                                                                                    m_val: null
                                                                                                };
                                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                                    return oThis.ReadCT_TimeUnit(t, l, oNewVal);
                                                                                                });
                                                                                            } else {
                                                                                                if (c_oserct_dateaxEXTLST === type) {
                                                                                                    var oNewVal;
                                                                                                    oNewVal = {};
                                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                                                    });
                                                                                                } else {
                                                                                                    res = c_oSerConstants.ReadUnknown;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LblOffset = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lbloffsetVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_AxisUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_axisunitVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LblAlgn = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lblalgnVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_lblalgnCTR:
            val.m_val = LBL_ALG_CTR;
            break;
        case st_lblalgnL:
            val.m_val = LBL_ALG_L;
            break;
        case st_lblalgnR:
            val.m_val = LBL_ALG_R;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_CatAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_cataxAXID === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setAxId(oNewVal.m_val);
        }
    } else {
        if (c_oserct_cataxSCALING === type) {
            var oNewVal = new CScaling();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Scaling(t, l, oNewVal);
            });
            val.setScaling(oNewVal);
        } else {
            if (c_oserct_cataxDELETE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setDelete(oNewVal.m_val);
                }
            } else {
                if (c_oserct_cataxAXPOS === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_AxPos(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setAxPos(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_cataxMAJORGRIDLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setMajorGridlines(oNewVal.spPr);
                        } else {
                            val.setMajorGridlines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_cataxMINORGRIDLINES === type) {
                            var oNewVal = {
                                spPr: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_ChartLines(t, l, oNewVal);
                            });
                            if (null != oNewVal.spPr) {
                                val.setMinorGridlines(oNewVal.spPr);
                            } else {
                                val.setMinorGridlines(new CSpPr());
                            }
                        } else {
                            if (c_oserct_cataxTITLE === type) {
                                var oNewVal = new CTitle();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Title(t, l, oNewVal);
                                });
                                if (!isRealBool(oNewVal.overlay)) {
                                    oNewVal.setOverlay(true);
                                }
                                val.setTitle(oNewVal);
                            } else {
                                if (c_oserct_cataxNUMFMT === type) {
                                    var oNewVal = new CNumFmt();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_NumFmt(t, l, oNewVal);
                                    });
                                    val.setNumFmt(oNewVal);
                                } else {
                                    if (c_oserct_cataxMAJORTICKMARK === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_TickMark(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setMajorTickMark(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_cataxMINORTICKMARK === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_TickMark(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setMinorTickMark(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_cataxTICKLBLPOS === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_TickLblPos(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setTickLblPos(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_cataxSPPR === type) {
                                                    val.setSpPr(this.ReadSpPr(length));
                                                } else {
                                                    if (c_oserct_cataxTXPR === type) {
                                                        val.setTxPr(this.ReadTxPr(length));
                                                        val.txPr.setParent(val);
                                                    } else {
                                                        if (c_oserct_cataxCROSSAX === type) {
                                                            var oNewVal = {
                                                                m_val: null
                                                            };
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                                            });
                                                            if (null != oNewVal.m_val) {
                                                                val.crossAxId = oNewVal.m_val;
                                                            }
                                                        } else {
                                                            if (c_oserct_cataxCROSSES === type) {
                                                                var oNewVal = {
                                                                    m_val: null
                                                                };
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadCT_Crosses(t, l, oNewVal);
                                                                });
                                                                if (null != oNewVal.m_val) {
                                                                    val.setCrosses(oNewVal.m_val);
                                                                }
                                                            } else {
                                                                if (c_oserct_cataxCROSSESAT === type) {
                                                                    var oNewVal = {
                                                                        m_val: null
                                                                    };
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_Double(t, l, oNewVal);
                                                                    });
                                                                    if (null != oNewVal.m_val) {
                                                                        val.setCrossesAt(oNewVal.m_val);
                                                                    }
                                                                } else {
                                                                    if (c_oserct_cataxAUTO === type) {
                                                                        var oNewVal = {
                                                                            m_val: null
                                                                        };
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                                        });
                                                                        if (null != oNewVal.m_val) {
                                                                            val.setAuto(oNewVal.m_val);
                                                                        }
                                                                    } else {
                                                                        if (c_oserct_cataxLBLALGN === type) {
                                                                            var oNewVal = {
                                                                                m_val: null
                                                                            };
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadCT_LblAlgn(t, l, oNewVal);
                                                                            });
                                                                            if (null != oNewVal.m_val) {
                                                                                val.setLblAlgn(oNewVal.m_val);
                                                                            }
                                                                        } else {
                                                                            if (c_oserct_cataxLBLOFFSET === type) {
                                                                                var oNewVal = {
                                                                                    m_val: null
                                                                                };
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadCT_LblOffset(t, l, oNewVal);
                                                                                });
                                                                                if (null != oNewVal.m_val) {
                                                                                    val.setLblOffset(oNewVal.m_val);
                                                                                }
                                                                            } else {
                                                                                if (c_oserct_cataxTICKLBLSKIP === type) {
                                                                                    var oNewVal = {
                                                                                        m_val: null
                                                                                    };
                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                        return oThis.ReadCT_Skip(t, l, oNewVal);
                                                                                    });
                                                                                    if (null != oNewVal.m_val) {
                                                                                        val.setTickLblSkip(oNewVal.m_val);
                                                                                    }
                                                                                } else {
                                                                                    if (c_oserct_cataxTICKMARKSKIP === type) {
                                                                                        var oNewVal = {
                                                                                            m_val: null
                                                                                        };
                                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                                            return oThis.ReadCT_Skip(t, l, oNewVal);
                                                                                        });
                                                                                        if (null != oNewVal.m_val) {
                                                                                            val.setTickMarkSkip(oNewVal.m_val);
                                                                                        }
                                                                                    } else {
                                                                                        if (c_oserct_cataxNOMULTILVLLBL === type) {
                                                                                            var oNewVal = {
                                                                                                m_val: null
                                                                                            };
                                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                                return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                                                            });
                                                                                            if (null != oNewVal.m_val) {
                                                                                                val.setNoMultiLvlLbl(oNewVal.m_val);
                                                                                            }
                                                                                        } else {
                                                                                            if (c_oserct_cataxEXTLST === type) {
                                                                                                var oNewVal;
                                                                                                oNewVal = {};
                                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                                                });
                                                                                            } else {
                                                                                                res = c_oSerConstants.ReadUnknown;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DispUnitsLbl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dispunitslblLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    } else {
        if (c_oserct_dispunitslblTX === type) {
            var oNewVal = new CChartText();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Tx(t, l, oNewVal);
            });
            val.setTx(oNewVal);
        } else {
            if (c_oserct_dispunitslblSPPR === type) {
                val.setSpPr(this.ReadSpPr(length));
            } else {
                if (c_oserct_dispunitslblTXPR === type) {
                    val.setTxPr(this.ReadTxPr(length));
                    val.txPr.setParent(val);
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BuiltInUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_builtinunitVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_builtinunitHUNDREDS:
            val.m_val = BUILT_IN_UNIT_HUNDREDS;
            break;
        case st_builtinunitTHOUSANDS:
            val.m_val = BUILT_IN_UNIT_THOUSANDS;
            break;
        case st_builtinunitTENTHOUSANDS:
            val.m_val = BUILT_IN_UNIT_TEN_THOUSANDS;
            break;
        case st_builtinunitHUNDREDTHOUSANDS:
            val.m_val = BUILT_IN_UNIT_HUNDRED_THOUSANDS;
            break;
        case st_builtinunitMILLIONS:
            val.m_val = BUILT_IN_UNIT_MILLIONS;
            break;
        case st_builtinunitTENMILLIONS:
            val.m_val = BUILT_IN_UNIT_TEN_MILLIONS;
            break;
        case st_builtinunitHUNDREDMILLIONS:
            val.m_val = BUILT_IN_UNIT_HUNDRED_MILLIONS;
            break;
        case st_builtinunitBILLIONS:
            val.m_val = BUILT_IN_UNIT_BILLIONS;
            break;
        case st_builtinunitTRILLIONS:
            val.m_val = BUILT_IN_UNIT_TRILLIONS;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DispUnits = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dispunitsBUILTINUNIT === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BuiltInUnit(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setBuiltInUnit(oNewVal.m_val);
        }
    } else {
        if (c_oserct_dispunitsCUSTUNIT === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Double(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setCustUnit(oNewVal.m_val);
            }
        } else {
            if (c_oserct_dispunitsDISPUNITSLBL === type) {
                var oNewVal = new CDLbl();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_DispUnitsLbl(t, l, oNewVal);
                });
                val.setDispUnitsLbl(oNewVal);
            } else {
                if (c_oserct_dispunitsEXTLST === type) {
                    var oNewVal;
                    oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_CrossBetween = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_crossbetweenVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_crossbetweenBETWEEN:
            val.m_val = CROSS_BETWEEN_BETWEEN;
            break;
        case st_crossbetweenMIDCAT:
            val.m_val = CROSS_BETWEEN_MID_CAT;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ValAx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_valaxAXID === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setAxId(oNewVal.m_val);
        }
    } else {
        if (c_oserct_valaxSCALING === type) {
            var oNewVal = new CScaling();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Scaling(t, l, oNewVal);
            });
            val.setScaling(oNewVal);
        } else {
            if (c_oserct_valaxDELETE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setDelete(oNewVal.m_val);
                }
            } else {
                if (c_oserct_valaxAXPOS === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_AxPos(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setAxPos(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_valaxMAJORGRIDLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setMajorGridlines(oNewVal.spPr);
                        } else {
                            val.setMajorGridlines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_valaxMINORGRIDLINES === type) {
                            var oNewVal = {
                                spPr: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_ChartLines(t, l, oNewVal);
                            });
                            if (null != oNewVal.spPr) {
                                val.setMinorGridlines(oNewVal.spPr);
                            } else {
                                val.setMinorGridlines(new CSpPr());
                            }
                        } else {
                            if (c_oserct_valaxTITLE === type) {
                                var oNewVal = new CTitle();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Title(t, l, oNewVal);
                                });
                                if (!isRealBool(oNewVal.overlay)) {
                                    oNewVal.setOverlay(true);
                                }
                                val.setTitle(oNewVal);
                            } else {
                                if (c_oserct_valaxNUMFMT === type) {
                                    var oNewVal = new CNumFmt();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_NumFmt(t, l, oNewVal);
                                    });
                                    val.setNumFmt(oNewVal);
                                } else {
                                    if (c_oserct_valaxMAJORTICKMARK === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_TickMark(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setMajorTickMark(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_valaxMINORTICKMARK === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_TickMark(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setMinorTickMark(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_valaxTICKLBLPOS === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_TickLblPos(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setTickLblPos(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_valaxSPPR === type) {
                                                    val.setSpPr(this.ReadSpPr(length));
                                                } else {
                                                    if (c_oserct_valaxTXPR === type) {
                                                        val.setTxPr(this.ReadTxPr(length));
                                                        val.txPr.setParent(val);
                                                    } else {
                                                        if (c_oserct_valaxCROSSAX === type) {
                                                            var oNewVal = {
                                                                m_val: null
                                                            };
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                                            });
                                                            if (null != oNewVal.m_val) {
                                                                val.crossAxId = oNewVal.m_val;
                                                            }
                                                        } else {
                                                            if (c_oserct_valaxCROSSES === type) {
                                                                var oNewVal = {
                                                                    m_val: null
                                                                };
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadCT_Crosses(t, l, oNewVal);
                                                                });
                                                                if (null != oNewVal.m_val) {
                                                                    val.setCrosses(oNewVal.m_val);
                                                                }
                                                            } else {
                                                                if (c_oserct_valaxCROSSESAT === type) {
                                                                    var oNewVal = {
                                                                        m_val: null
                                                                    };
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_Double(t, l, oNewVal);
                                                                    });
                                                                    if (null != oNewVal.m_val) {
                                                                        val.setCrossesAt(oNewVal.m_val);
                                                                    }
                                                                } else {
                                                                    if (c_oserct_valaxCROSSBETWEEN === type) {
                                                                        var oNewVal = {
                                                                            m_val: null
                                                                        };
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadCT_CrossBetween(t, l, oNewVal);
                                                                        });
                                                                        if (null != oNewVal.m_val) {
                                                                            val.setCrossBetween(oNewVal.m_val);
                                                                        }
                                                                    } else {
                                                                        if (c_oserct_valaxMAJORUNIT === type) {
                                                                            var oNewVal = {
                                                                                m_val: null
                                                                            };
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadCT_AxisUnit(t, l, oNewVal);
                                                                            });
                                                                            if (null != oNewVal.m_val) {
                                                                                val.setMajorUnit(oNewVal.m_val);
                                                                            }
                                                                        } else {
                                                                            if (c_oserct_valaxMINORUNIT === type) {
                                                                                var oNewVal = {
                                                                                    m_val: null
                                                                                };
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadCT_AxisUnit(t, l, oNewVal);
                                                                                });
                                                                                if (null != oNewVal.m_val) {
                                                                                    val.setMinorUnit(oNewVal.m_val);
                                                                                }
                                                                            } else {
                                                                                if (c_oserct_valaxDISPUNITS === type) {
                                                                                    var oNewVal = new CDispUnits();
                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                        return oThis.ReadCT_DispUnits(t, l, oNewVal);
                                                                                    });
                                                                                    val.setDispUnits(oNewVal);
                                                                                } else {
                                                                                    if (c_oserct_valaxEXTLST === type) {
                                                                                        var oNewVal;
                                                                                        oNewVal = {};
                                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                                        });
                                                                                    } else {
                                                                                        res = c_oSerConstants.ReadUnknown;
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SizeRepresents = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_sizerepresentsVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_sizerepresentsAREA:
            val.m_val = SIZE_REPRESENTS_AREA;
            break;
        case st_sizerepresentsW:
            val.m_val = SIZE_REPRESENTS_W;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BubbleScale = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bubblescaleVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BubbleSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bubbleserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_bubbleserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_bubbleserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_bubbleserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_bubbleserINVERTIFNEGATIVE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setInvertIfNegative(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_bubbleserDPT === type) {
                            var oNewVal = new CDPt();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_DPt(t, l, oNewVal);
                            });
                            val.addDPt(oNewVal);
                        } else {
                            if (c_oserct_bubbleserDLBLS === type) {
                                var oNewVal = new CDLbls();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                                });
                                val.setDLbls(oNewVal);
                            } else {
                                if (c_oserct_bubbleserTRENDLINE === type) {
                                    var oNewVal = new CTrendLine();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Trendline(t, l, oNewVal);
                                    });
                                    val.setTrendline(oNewVal);
                                } else {
                                    if (c_oserct_bubbleserERRBARS === type) {
                                        var oNewVal = new CErrBars();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_ErrBars(t, l, oNewVal);
                                        });
                                        val.setErrBars(oNewVal);
                                    } else {
                                        if (c_oserct_bubbleserXVAL === type) {
                                            var oNewVal = new CCat();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                            });
                                            val.setXVal(oNewVal);
                                        } else {
                                            if (c_oserct_bubbleserYVAL === type) {
                                                var oNewVal = new CYVal();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                                });
                                                val.setYVal(oNewVal);
                                            } else {
                                                if (c_oserct_bubbleserBUBBLESIZE === type) {
                                                    var oNewVal = new CYVal();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                                    });
                                                    val.setBubbleSize(oNewVal);
                                                } else {
                                                    if (c_oserct_bubbleserBUBBLE3D === type) {
                                                        var oNewVal = {
                                                            m_val: null
                                                        };
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                        });
                                                        if (null != oNewVal.m_val) {
                                                            val.setBubble3D(oNewVal.m_val);
                                                        }
                                                    } else {
                                                        if (c_oserct_bubbleserEXTLST === type) {
                                                            var oNewVal;
                                                            oNewVal = {};
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                                            });
                                                        } else {
                                                            res = c_oSerConstants.ReadUnknown;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SerTx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_sertxSTRREF === type) {
        var oNewVal = new CStrRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrRef(t, l, oNewVal);
        });
        val.setStrRef(oNewVal);
    } else {
        if (c_oserct_sertxV === type) {
            val.setVal(this.stream.GetString2LE(length));
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DPt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dptIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_dptINVERTIFNEGATIVE === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setInvertIfNegative(oNewVal.m_val);
            }
        } else {
            if (c_oserct_dptMARKER === type) {
                var oNewVal = new CMarker();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Marker(t, l, oNewVal);
                });
                val.setMarker(oNewVal);
            } else {
                if (c_oserct_dptBUBBLE3D === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setBubble3D(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_dptEXPLOSION === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setExplosion(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_dptSPPR === type) {
                            val.setSpPr(this.ReadSpPr(length));
                        } else {
                            if (c_oserct_dptPICTUREOPTIONS === type) {
                                var oNewVal = new CPictureOptions();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_PictureOptions(t, l, oNewVal);
                                });
                                val.setPictureOptions(oNewVal);
                            } else {
                                if (c_oserct_dptEXTLST === type) {
                                    var oNewVal;
                                    oNewVal = {};
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Marker = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_markerSYMBOL === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MarkerStyle(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setSymbol(oNewVal.m_val);
        }
    } else {
        if (c_oserct_markerSIZE === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_MarkerSize(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setSize(oNewVal.m_val);
            }
        } else {
            if (c_oserct_markerSPPR === type) {
                val.setSpPr(this.ReadSpPr(length));
            } else {
                if (c_oserct_markerEXTLST === type) {
                    var oNewVal;
                    oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_MarkerStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_markerstyleVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_markerstyleCIRCLE:
            val.m_val = SYMBOL_CIRCLE;
            break;
        case st_markerstyleDASH:
            val.m_val = SYMBOL_DASH;
            break;
        case st_markerstyleDIAMOND:
            val.m_val = SYMBOL_DIAMOND;
            break;
        case st_markerstyleDOT:
            val.m_val = SYMBOL_DOT;
            break;
        case st_markerstyleNONE:
            val.m_val = SYMBOL_NONE;
            break;
        case st_markerstylePICTURE:
            val.m_val = SYMBOL_PICTURE;
            break;
        case st_markerstylePLUS:
            val.m_val = SYMBOL_PLUS;
            break;
        case st_markerstyleSQUARE:
            val.m_val = SYMBOL_SQUARE;
            break;
        case st_markerstyleSTAR:
            val.m_val = SYMBOL_STAR;
            break;
        case st_markerstyleTRIANGLE:
            val.m_val = SYMBOL_TRIANGLE;
            break;
        case st_markerstyleX:
            val.m_val = SYMBOL_X;
            break;
        case st_markerstyleAUTO:
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_MarkerSize = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_markersizeVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PictureOptions = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pictureoptionsAPPLYTOFRONT === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setApplyToFront(oNewVal.m_val);
        }
    } else {
        if (c_oserct_pictureoptionsAPPLYTOSIDES === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setApplyToSides(oNewVal.m_val);
            }
        } else {
            if (c_oserct_pictureoptionsAPPLYTOEND === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setApplyToEnd(oNewVal.m_val);
                }
            } else {
                if (c_oserct_pictureoptionsPICTUREFORMAT === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_PictureFormat(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setPictureFormat(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_pictureoptionsPICTURESTACKUNIT === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_PictureStackUnit(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setPictureStackUnit(oNewVal.m_val);
                        }
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PictureFormat = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pictureformatVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_pictureformatSTRETCH:
            val.m_val = PICTURE_FORMAT_STACK_STRETCH;
            break;
        case st_pictureformatSTACK:
            val.m_val = PICTURE_FORMAT_STACK;
            break;
        case st_pictureformatSTACKSCALE:
            val.m_val = PICTURE_FORMAT_STACK_SCALE;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PictureStackUnit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_picturestackunitVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetDoubleLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DLbls = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dlblsDLBL === type) {
        var oNewVal = new CDLbl();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DLbl(t, l, oNewVal);
        });
        val.addDLbl(oNewVal);
    } else {
        if (c_oserct_dlblsDLBLPOS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_DLblPos(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setDLblPos(oNewVal.m_val);
            }
        } else {
            if (c_oserct_dlblsDELETE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setDelete(oNewVal.m_val);
                }
            } else {
                if (c_oserct_dlblsLEADERLINES === type) {
                    var oNewVal = {
                        spPr: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_ChartLines(t, l, oNewVal);
                    });
                    if (null != oNewVal.spPr) {
                        val.setLeaderLines(oNewVal.spPr);
                    } else {
                        val.setLeaderLines(new CSpPr());
                    }
                } else {
                    if (c_oserct_dlblsNUMFMT === type) {
                        var oNewVal = new CNumFmt();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_NumFmt(t, l, oNewVal);
                        });
                        val.setNumFmt(oNewVal);
                    } else {
                        if (c_oserct_dlblsSEPARATOR === type) {
                            val.setSeparator(this.stream.GetString2LE(length));
                        } else {
                            if (c_oserct_dlblsSHOWBUBBLESIZE === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setShowBubbleSize(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_dlblsSHOWCATNAME === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.m_val) {
                                        val.setShowCatName(oNewVal.m_val);
                                    }
                                } else {
                                    if (c_oserct_dlblsSHOWLEADERLINES === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setShowLeaderLines(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_dlblsSHOWLEGENDKEY === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_Boolean(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setShowLegendKey(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_dlblsSHOWPERCENT === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setShowPercent(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_dlblsSHOWSERNAME === type) {
                                                    var oNewVal = {
                                                        m_val: null
                                                    };
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                    });
                                                    if (null != oNewVal.m_val) {
                                                        val.setShowSerName(oNewVal.m_val);
                                                    }
                                                } else {
                                                    if (c_oserct_dlblsSHOWVAL === type) {
                                                        var oNewVal = {
                                                            m_val: null
                                                        };
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                        });
                                                        if (null != oNewVal.m_val) {
                                                            val.setShowVal(oNewVal.m_val);
                                                        }
                                                    } else {
                                                        if (c_oserct_dlblsSPPR === type) {
                                                            val.setSpPr(this.ReadSpPr(length));
                                                        } else {
                                                            if (c_oserct_dlblsTXPR === type) {
                                                                val.setTxPr(this.ReadTxPr(length));
                                                                val.txPr.setParent(val);
                                                            } else {
                                                                if (c_oserct_dlblsEXTLST === type) {
                                                                    var oNewVal;
                                                                    oNewVal = {};
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                    });
                                                                } else {
                                                                    res = c_oSerConstants.ReadUnknown;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DLbl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dlblIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_dlblDLBLPOS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_DLblPos(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setDLblPos(oNewVal.m_val);
            }
        } else {
            if (c_oserct_dlblDELETE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setDelete(oNewVal.m_val);
                }
            } else {
                if (c_oserct_dlblLAYOUT === type) {
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Layout(t, l, val);
                    });
                } else {
                    if (c_oserct_dlblNUMFMT === type) {
                        var oNewVal = new CNumFmt();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_NumFmt(t, l, oNewVal);
                        });
                        val.setNumFmt(oNewVal);
                    } else {
                        if (c_oserct_dlblSEPARATOR === type) {
                            val.setSeparator(this.stream.GetString2LE(length));
                        } else {
                            if (c_oserct_dlblSHOWBUBBLESIZE === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setShowBubbleSize(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_dlblSHOWCATNAME === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.m_val) {
                                        val.setShowCatName(oNewVal.m_val);
                                    }
                                } else {
                                    if (c_oserct_dlblSHOWLEGENDKEY === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setShowLegendKey(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_dlblSHOWPERCENT === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_Boolean(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setShowPercent(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_dlblSHOWSERNAME === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setShowSerName(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_dlblSHOWVAL === type) {
                                                    var oNewVal = {
                                                        m_val: null
                                                    };
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                    });
                                                    if (null != oNewVal.m_val) {
                                                        val.setShowVal(oNewVal.m_val);
                                                    }
                                                } else {
                                                    if (c_oserct_dlblSPPR === type) {
                                                        val.setSpPr(this.ReadSpPr(length));
                                                    } else {
                                                        if (c_oserct_dlblTX === type) {
                                                            var oNewVal = new CChartText();
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_Tx(t, l, oNewVal);
                                                            });
                                                            val.setTx(oNewVal);
                                                        } else {
                                                            if (c_oserct_dlblTXPR === type) {
                                                                val.setTxPr(this.ReadTxPr(length));
                                                                val.txPr.setParent(val);
                                                            } else {
                                                                if (c_oserct_dlblEXTLST === type) {
                                                                    var oNewVal;
                                                                    oNewVal = {};
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                    });
                                                                } else {
                                                                    res = c_oSerConstants.ReadUnknown;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DLblPos = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_dlblposVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_dlblposBESTFIT:
            val.m_val = DLBL_POS_BEST_FIT;
            break;
        case st_dlblposB:
            val.m_val = DLBL_POS_B;
            break;
        case st_dlblposCTR:
            val.m_val = DLBL_POS_CTR;
            break;
        case st_dlblposINBASE:
            val.m_val = DLBL_POS_IN_BASE;
            break;
        case st_dlblposINEND:
            val.m_val = DLBL_POS_IN_END;
            break;
        case st_dlblposL:
            val.m_val = DLBL_POS_L;
            break;
        case st_dlblposOUTEND:
            val.m_val = DLBL_POS_OUT_END;
            break;
        case st_dlblposR:
            val.m_val = DLBL_POS_R;
            break;
        case st_dlblposT:
            val.m_val = DLBL_POS_T;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Trendline = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_trendlineNAME === type) {
        val.setName(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_trendlineSPPR === type) {
            val.setSpPr(this.ReadSpPr(length));
        } else {
            if (c_oserct_trendlineTRENDLINETYPE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_TrendlineType(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setTrendlineType(oNewVal.m_val);
                }
            } else {
                if (c_oserct_trendlineORDER === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Order(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setOrder(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_trendlinePERIOD === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Period(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setPeriod(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_trendlineFORWARD === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_Double(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setForward(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_trendlineBACKWARD === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Double(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setBackward(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_trendlineINTERCEPT === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Double(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.m_val) {
                                        val.setIntercept(oNewVal.m_val);
                                    }
                                } else {
                                    if (c_oserct_trendlineDISPRSQR === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setDispRSqr(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_trendlineDISPEQ === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_Boolean(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setDispEq(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_trendlineTRENDLINELBL === type) {
                                                var oNewVal = new CDLbl();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_TrendlineLbl(t, l, oNewVal);
                                                });
                                                val.setTrendlineLbl(oNewVal);
                                            } else {
                                                if (c_oserct_trendlineEXTLST === type) {
                                                    var oNewVal;
                                                    oNewVal = {};
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                                    });
                                                } else {
                                                    res = c_oSerConstants.ReadUnknown;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TrendlineType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_trendlinetypeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_trendlinetypeEXP:
            val.m_val = TRENDLINE_TYPE_EXP;
            break;
        case st_trendlinetypeLINEAR:
            val.m_val = TRENDLINE_TYPE_LINEAR;
            break;
        case st_trendlinetypeLOG:
            val.m_val = TRENDLINE_TYPE_LOG;
            break;
        case st_trendlinetypeMOVINGAVG:
            val.m_val = TRENDLINE_TYPE_MOVING_AVG;
            break;
        case st_trendlinetypePOLY:
            val.m_val = TRENDLINE_TYPE_POLY;
            break;
        case st_trendlinetypePOWER:
            val.m_val = TRENDLINE_TYPE_POWER;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Order = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_orderVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Period = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_periodVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TrendlineLbl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_trendlinelblLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    } else {
        if (c_oserct_trendlinelblTX === type) {
            var oNewVal = new CChartText();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Tx(t, l, oNewVal);
            });
            val.setTx(oNewVal);
        } else {
            if (c_oserct_trendlinelblNUMFMT === type) {
                var oNewVal = new CNumFmt();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_NumFmt(t, l, oNewVal);
                });
                val.setNumFmt(oNewVal);
            } else {
                if (c_oserct_trendlinelblSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_trendlinelblTXPR === type) {
                        val.setTxPr(this.ReadTxPr(length));
                        val.txPr.setParent(val);
                    } else {
                        if (c_oserct_trendlinelblEXTLST === type) {
                            var oNewVal;
                            oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_extLst(t, l, oNewVal);
                            });
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrBars = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errbarsERRDIR === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ErrDir(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setErrDir(oNewVal.m_val);
        }
    } else {
        if (c_oserct_errbarsERRBARTYPE === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_ErrBarType(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setErrBarType(oNewVal.m_val);
            }
        } else {
            if (c_oserct_errbarsERRVALTYPE === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_ErrValType(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setErrValType(oNewVal.m_val);
                }
            } else {
                if (c_oserct_errbarsNOENDCAP === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setNoEndCap(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_errbarsPLUS === type) {
                        var oNewVal = new CMinusPlus();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                        });
                        val.setPlus(oNewVal);
                    } else {
                        if (c_oserct_errbarsMINUS === type) {
                            var oNewVal = new CMinusPlus();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                            });
                            val.setMinus(oNewVal);
                        } else {
                            if (c_oserct_errbarsVAL === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Double(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setVal(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_errbarsSPPR === type) {
                                    val.setSpPr(this.ReadSpPr(length));
                                } else {
                                    if (c_oserct_errbarsEXTLST === type) {
                                        var oNewVal;
                                        oNewVal = {};
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                        });
                                    } else {
                                        res = c_oSerConstants.ReadUnknown;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrDir = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errdirVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_errdirX:
            val.m_val = ERR_DIR_X;
            break;
        case st_errdirY:
            val.m_val = ERR_DIR_Y;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrBarType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errbartypeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_errbartypeBOTH:
            val.m_val = ERR_BAR_TYPE_BOTH;
            break;
        case st_errbartypeMINUS:
            val.m_val = ERR_BAR_TYPE_MINUS;
            break;
        case st_errbartypePLUS:
            val.m_val = ERR_BAR_TYPE_PLUS;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ErrValType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_errvaltypeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_errvaltypeCUST:
            val.m_val = ERR_VAL_TYPE_CUST;
            break;
        case st_errvaltypeFIXEDVAL:
            val.m_val = ERR_VAL_TYPE_FIXED_VAL;
            break;
        case st_errvaltypePERCENTAGE:
            val.m_val = ERR_VAL_TYPE_PERCENTAGE;
            break;
        case st_errvaltypeSTDDEV:
            val.m_val = ERR_VAL_TYPE_STD_DEV;
            break;
        case st_errvaltypeSTDERR:
            val.m_val = ERR_VAL_TYPE_STD_ERR;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumDataSource = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numdatasourceNUMLIT === type) {
        var oNewVal = new CNumLit();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumData(t, l, oNewVal);
        });
        val.setNumLit(oNewVal);
    } else {
        if (c_oserct_numdatasourceNUMREF === type) {
            var oNewVal = new CNumRef();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_NumRef(t, l, oNewVal);
            });
            val.setNumRef(oNewVal);
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numdataFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_numdataPTCOUNT === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setPtCount(oNewVal.m_val);
            }
        } else {
            if (c_oserct_numdataPT === type) {
                var oNewVal = new CNumericPoint();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_NumVal(t, l, oNewVal);
                });
                val.addPt(oNewVal);
            } else {
                if (c_oserct_numdataEXTLST === type) {
                    var oNewVal;
                    oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumVal = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numvalV === type) {
        var nVal = parseFloat(this.stream.GetString2LE(length));
        if (isNaN(nVal)) {
            nVal = 0;
        }
        val.setVal(nVal);
    } else {
        if (c_oserct_numvalIDX === type) {
            val.setIdx(this.stream.GetULongLE());
        } else {
            if (c_oserct_numvalFORMATCODE === type) {
                val.setFormatCode(this.stream.GetString2LE(length));
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_NumRef = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_numrefF === type) {
        val.setF(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_numrefNUMCACHE === type) {
            var oNewVal = new CNumLit();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_NumData(t, l, oNewVal);
            });
            val.setNumCache(oNewVal);
        } else {
            if (c_oserct_numrefEXTLST === type) {
                var oNewVal = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_extLst(t, l, oNewVal);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_AxDataSource = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_axdatasourceMULTILVLSTRREF === type) {
        var oNewVal = new CMultiLvlStrRef();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_MultiLvlStrRef(t, l, oNewVal);
        });
        val.setMultiLvlStrRef(oNewVal);
    } else {
        if (c_oserct_axdatasourceNUMLIT === type) {
            var oNewVal = new CNumLit();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_NumData(t, l, oNewVal);
            });
            val.setNumLit(oNewVal);
        } else {
            if (c_oserct_axdatasourceNUMREF === type) {
                var oNewVal = new CNumRef();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_NumRef(t, l, oNewVal);
                });
                val.setNumRef(oNewVal);
            } else {
                if (c_oserct_axdatasourceSTRLIT === type) {
                    var oNewVal = new CStrCache();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_StrData(t, l, oNewVal);
                    });
                    val.setStrLit(oNewVal);
                } else {
                    if (c_oserct_axdatasourceSTRREF === type) {
                        var oNewVal = new CStrRef();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_StrRef(t, l, oNewVal);
                        });
                        val.setStrRef(oNewVal);
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_MultiLvlStrRef = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_multilvlstrrefF === type) {
        val.setF(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_multilvlstrrefMULTILVLSTRCACHE === type) {
            var oNewVal = new CMultiLvlStrCache();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_MultiLvlStrData(t, l, oNewVal);
            });
            val.setMultiLvlStrCache(oNewVal);
        } else {
            if (c_oserct_multilvlstrrefEXTLST === type) {
                var oNewVal;
                oNewVal = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_extLst(t, l, oNewVal);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_lvl = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lvlPT === type) {
        var oNewVal = new CStringPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StrVal(t, l, oNewVal);
        });
        val.push(oNewVal);
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_MultiLvlStrData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_multilvlstrdataPTCOUNT === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setPtCount(oNewVal.m_val);
        }
    } else {
        if (c_oserct_multilvlstrdataLVL === type) {
            var oNewVal = [];
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_lvl(t, l, oNewVal);
            });
            for (var i = 0; i < oNewVal.length; ++i) {
                val.setLvl(oNewVal[i]);
            }
        } else {
            if (c_oserct_multilvlstrdataEXTLST === type) {
                var oNewVal = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_extLst(t, l, oNewVal);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BubbleChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bubblechartVARYCOLORS === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setVaryColors(oNewVal.m_val);
        }
    } else {
        if (c_oserct_bubblechartSER === type) {
            var oNewVal = new CBubbleSeries();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_BubbleSer(t, l, oNewVal);
            });
            val.addSer(oNewVal);
        } else {
            if (c_oserct_bubblechartDLBLS === type) {
                var oNewVal = new CDLbls();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                });
                val.setDLbls(oNewVal);
            } else {
                if (c_oserct_bubblechartBUBBLE3D === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setBubble3D(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_bubblechartBUBBLESCALE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_BubbleScale(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setBubbleScale(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_bubblechartSHOWNEGBUBBLES === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_Boolean(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setShowNegBubbles(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_bubblechartSIZEREPRESENTS === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_SizeRepresents(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setSizeRepresents(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_bubblechartAXID === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.m_val) {
                                        aChartWithAxis.push({
                                            axisId: oNewVal.m_val,
                                            chart: val
                                        });
                                    }
                                } else {
                                    if (c_oserct_bubblechartEXTLST === type) {
                                        var oNewVal = {};
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                        });
                                    } else {
                                        res = c_oSerConstants.ReadUnknown;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_bandFmts = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bandfmtsBANDFMT === type) {
        var oNewVal = new CBandFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BandFmt(t, l, oNewVal);
        });
        val.addBandFmt(oNewVal);
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Surface3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surface3dchartWIREFRAME === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setWireframe(oNewVal.m_val);
        }
    } else {
        if (c_oserct_surface3dchartSER === type) {
            var oNewVal = new CSurfaceSeries();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_SurfaceSer(t, l, oNewVal);
            });
            val.addSer(oNewVal);
        } else {
            if (c_oserct_surface3dchartBANDFMTS === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_bandFmts(t, l, val);
                });
            } else {
                if (c_oserct_surface3dchartAXID === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        aChartWithAxis.push({
                            axisId: oNewVal.m_val,
                            chart: val,
                            surface: true
                        });
                    }
                } else {
                    if (c_oserct_surface3dchartEXTLST === type) {
                        var oNewVal = {};
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_extLst(t, l, oNewVal);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SurfaceSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surfaceserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_surfaceserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_surfaceserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_surfaceserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_surfaceserCAT === type) {
                        var oNewVal = new CCat();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                        });
                        val.setCat(oNewVal);
                    } else {
                        if (c_oserct_surfaceserVAL === type) {
                            var oNewVal = new CYVal();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                            });
                            val.setVal(oNewVal);
                        } else {
                            if (c_oserct_surfaceserEXTLST === type) {
                                var oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BandFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bandfmtIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_bandfmtSPPR === type) {
            val.setSpPr(this.ReadSpPr(length));
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SurfaceChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surfacechartWIREFRAME === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setWireframe(oNewVal.m_val);
        }
    } else {
        if (c_oserct_surfacechartSER === type) {
            var oNewVal = new CSurfaceSeries();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_SurfaceSer(t, l, oNewVal);
            });
            val.addSer(oNewVal);
        } else {
            if (c_oserct_surfacechartBANDFMTS === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_bandFmts(t, l, val);
                });
            } else {
                if (c_oserct_surfacechartAXID === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        aChartWithAxis.push({
                            axisId: oNewVal.m_val,
                            chart: val,
                            surface: true
                        });
                    }
                } else {
                    if (c_oserct_surfacechartEXTLST === type) {
                        var oNewVal;
                        oNewVal = {};
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_extLst(t, l, oNewVal);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SecondPieSize = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_secondpiesizeVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_SplitType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_splittypeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_splittypeAUTO:
            val.m_val = SPLIT_TYPE_AUTO;
            break;
        case st_splittypeCUST:
            val.m_val = SPLIT_TYPE_CUST;
            break;
        case st_splittypePERCENT:
            val.m_val = SPLIT_TYPE_PERCENT;
            break;
        case st_splittypePOS:
            val.m_val = SPLIT_TYPE_POS;
            break;
        case st_splittypeVAL:
            val.m_val = SPLIT_TYPE_VAL;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_OfPieType = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_ofpietypeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_ofpietypePIE:
            val.m_val = OF_PIE_TYPE_PIE;
            break;
        case st_ofpietypeBAR:
            val.m_val = OF_PIE_TYPE_BAR;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_custSplit = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_custsplitSECONDPIEPT === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.addCustSplit(oNewVal.m_val);
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_OfPieChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_ofpiechartOFPIETYPE === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_OfPieType(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setOfPieType(oNewVal.m_val);
        }
    } else {
        if (c_oserct_ofpiechartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_ofpiechartSER === type) {
                var oNewVal = new CPieSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_PieSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_ofpiechartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_ofpiechartGAPWIDTH === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_GapAmount(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setGapWidth(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_ofpiechartSPLITTYPE === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_SplitType(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setSplitType(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_ofpiechartSPLITPOS === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Double(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setSplitPos(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_ofpiechartCUSTSPLIT === type) {
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_custSplit(t, l, val);
                                    });
                                } else {
                                    if (c_oserct_ofpiechartSECONDPIESIZE === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_SecondPieSize(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setSecondPieSize(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_ofpiechartSERLINES === type) {
                                            var oNewVal = {
                                                spPr: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_ChartLines(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.spPr) {
                                                val.setSerLines(oNewVal.spPr);
                                            } else {
                                                val.setSerLines(new CSpPr());
                                            }
                                        } else {
                                            if (c_oserct_ofpiechartEXTLST === type) {
                                                var oNewVal;
                                                oNewVal = {};
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                                });
                                            } else {
                                                res = c_oSerConstants.ReadUnknown;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PieSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pieserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_pieserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_pieserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_pieserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_pieserEXPLOSION === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setExplosion(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_pieserDPT === type) {
                            var oNewVal = new CDPt();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_DPt(t, l, oNewVal);
                            });
                            val.addDPt(oNewVal);
                        } else {
                            if (c_oserct_pieserDLBLS === type) {
                                var oNewVal = new CDLbls();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                                });
                                val.setDLbls(oNewVal);
                            } else {
                                if (c_oserct_pieserCAT === type) {
                                    var oNewVal = new CCat();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                    });
                                    val.setCat(oNewVal);
                                } else {
                                    if (c_oserct_pieserVAL === type) {
                                        var oNewVal = new CYVal();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                        });
                                        val.setVal(oNewVal);
                                    } else {
                                        if (c_oserct_pieserEXTLST === type) {
                                            var oNewVal = {};
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                            });
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_GapAmount = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_gapamountVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Bar3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bar3dchartBARDIR === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarDir(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setBarDir(oNewVal.m_val);
        }
    } else {
        if (c_oserct_bar3dchartGROUPING === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_BarGrouping(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setGrouping(oNewVal.m_val);
            }
        } else {
            if (c_oserct_bar3dchartVARYCOLORS === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setVaryColors(oNewVal.m_val);
                }
            } else {
                if (c_oserct_bar3dchartSER === type) {
                    var oNewVal = new CBarSeries();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_BarSer(t, l, oNewVal);
                    });
                    val.addSer(oNewVal);
                } else {
                    if (c_oserct_bar3dchartDLBLS === type) {
                        var oNewVal = new CDLbls();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_DLbls(t, l, oNewVal);
                        });
                        val.setDLbls(oNewVal);
                    } else {
                        if (c_oserct_bar3dchartGAPWIDTH === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_GapAmount(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setGapWidth(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_bar3dchartGAPDEPTH === type) {
                                var oNewVal;
                                oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_GapAmount(t, l, oNewVal);
                                });
                            } else {
                                if (c_oserct_bar3dchartSHAPE === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Shape(t, l, oNewVal);
                                    });
                                } else {
                                    if (c_oserct_bar3dchartAXID === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            aChartWithAxis.push({
                                                axisId: oNewVal.m_val,
                                                chart: val
                                            });
                                        }
                                    } else {
                                        if (c_oserct_bar3dchartEXTLST === type) {
                                            var oNewVal;
                                            oNewVal = {};
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                            });
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BarDir = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bardirVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_bardirBAR:
            val.m_val = BAR_DIR_BAR;
            break;
        case st_bardirCOL:
            val.m_val = BAR_DIR_COL;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BarGrouping = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_bargroupingVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_bargroupingPERCENTSTACKED:
            val.m_val = BAR_GROUPING_PERCENT_STACKED;
            break;
        case st_bargroupingCLUSTERED:
            val.m_val = BAR_GROUPING_CLUSTERED;
            break;
        case st_bargroupingSTANDARD:
            val.m_val = BAR_GROUPING_STANDARD;
            break;
        case st_bargroupingSTACKED:
            val.m_val = BAR_GROUPING_STACKED;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BarSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_barserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_barserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_barserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_barserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_barserINVERTIFNEGATIVE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setInvertIfNegative(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_barserPICTUREOPTIONS === type) {
                            var oNewVal = new CPictureOptions();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_PictureOptions(t, l, oNewVal);
                            });
                            val.setPictureOptions(oNewVal);
                        } else {
                            if (c_oserct_barserDPT === type) {
                                var oNewVal = new CDPt();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DPt(t, l, oNewVal);
                                });
                                val.addDPt(oNewVal);
                            } else {
                                if (c_oserct_barserDLBLS === type) {
                                    var oNewVal = new CDLbls();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                                    });
                                    val.setDLbls(oNewVal);
                                } else {
                                    if (c_oserct_barserTRENDLINE === type) {
                                        var oNewVal = new CTrendLine();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Trendline(t, l, oNewVal);
                                        });
                                        val.setTrendline(oNewVal);
                                    } else {
                                        if (c_oserct_barserERRBARS === type) {
                                            var oNewVal = new CErrBars();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_ErrBars(t, l, oNewVal);
                                            });
                                            val.setErrBars(oNewVal);
                                        } else {
                                            if (c_oserct_barserCAT === type) {
                                                var oNewVal = new CCat();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                                });
                                                val.setCat(oNewVal);
                                            } else {
                                                if (c_oserct_barserVAL === type) {
                                                    var oNewVal = new CYVal();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                                    });
                                                    val.setVal(oNewVal);
                                                } else {
                                                    if (c_oserct_barserSHAPE === type) {
                                                        var oNewVal = {
                                                            m_val: null
                                                        };
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_Shape(t, l, oNewVal);
                                                        });
                                                        if (null != oNewVal.m_val) {
                                                            val.setShape(oNewVal.m_val);
                                                        }
                                                    } else {
                                                        if (c_oserct_barserEXTLST === type) {
                                                            var oNewVal = {};
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                                            });
                                                        } else {
                                                            res = c_oSerConstants.ReadUnknown;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Shape = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_shapeVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_shapeCONE:
            val.m_val = BAR_SHAPE_CONE;
            break;
        case st_shapeCONETOMAX:
            val.m_val = BAR_SHAPE_CONETOMAX;
            break;
        case st_shapeBOX:
            val.m_val = BAR_SHAPE_BOX;
            break;
        case st_shapeCYLINDER:
            val.m_val = BAR_SHAPE_CYLINDER;
            break;
        case st_shapePYRAMID:
            val.m_val = BAR_SHAPE_PYRAMID;
            break;
        case st_shapePYRAMIDTOMAX:
            val.m_val = BAR_SHAPE_PYRAMIDTOMAX;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Overlap = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_overlapVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_BarChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_barchartBARDIR === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_BarDir(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setBarDir(oNewVal.m_val);
        }
    } else {
        if (c_oserct_barchartGROUPING === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_BarGrouping(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setGrouping(oNewVal.m_val);
            }
        } else {
            if (c_oserct_barchartVARYCOLORS === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setVaryColors(oNewVal.m_val);
                }
            } else {
                if (c_oserct_barchartSER === type) {
                    var oNewVal = new CBarSeries();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_BarSer(t, l, oNewVal);
                    });
                    val.addSer(oNewVal);
                } else {
                    if (c_oserct_barchartDLBLS === type) {
                        var oNewVal = new CDLbls();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_DLbls(t, l, oNewVal);
                        });
                        val.setDLbls(oNewVal);
                    } else {
                        if (c_oserct_barchartGAPWIDTH === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_GapAmount(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setGapWidth(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_barchartOVERLAP === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Overlap(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    val.setOverlap(oNewVal.m_val);
                                }
                            } else {
                                if (c_oserct_barchartSERLINES === type) {
                                    var oNewVal = {
                                        spPr: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_ChartLines(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.spPr) {
                                        val.setSerLines(oNewVal.spPr);
                                    } else {
                                        val.setSerLines(new CSpPr());
                                    }
                                } else {
                                    if (c_oserct_barchartAXID === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            aChartWithAxis.push({
                                                axisId: oNewVal.m_val,
                                                chart: val
                                            });
                                        }
                                    } else {
                                        if (c_oserct_barchartEXTLST === type) {
                                            var oNewVal;
                                            oNewVal = {};
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                            });
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_HoleSize = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_holesizeVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DoughnutChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_doughnutchartVARYCOLORS === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setVaryColors(oNewVal.m_val);
        }
    } else {
        if (c_oserct_doughnutchartSER === type) {
            var oNewVal = new CPieSeries();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_PieSer(t, l, oNewVal);
            });
            val.addSer(oNewVal);
        } else {
            if (c_oserct_doughnutchartDLBLS === type) {
                var oNewVal = new CDLbls();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                });
                val.setDLbls(oNewVal);
            } else {
                if (c_oserct_doughnutchartFIRSTSLICEANG === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_FirstSliceAng(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setFirstSliceAng(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_doughnutchartHOLESIZE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_HoleSize(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setHoleSize(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_doughnutchartEXTLST === type) {
                            var oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_extLst(t, l, oNewVal);
                            });
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_FirstSliceAng = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_firstsliceangVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Pie3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pie3dchartVARYCOLORS === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setVaryColors(oNewVal.m_val);
        }
    } else {
        if (c_oserct_pie3dchartSER === type) {
            var oNewVal = new CPieSeries();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_PieSer(t, l, oNewVal);
            });
            val.addSer(oNewVal);
        } else {
            if (c_oserct_pie3dchartDLBLS === type) {
                var oNewVal = new CDLbls();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                });
                val.setDLbls(oNewVal);
            } else {
                if (c_oserct_pie3dchartEXTLST === type) {
                    var oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PieChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_piechartVARYCOLORS === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setVaryColors(oNewVal.m_val);
        }
    } else {
        if (c_oserct_piechartSER === type) {
            var oNewVal = new CPieSeries();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_PieSer(t, l, oNewVal);
            });
            val.addSer(oNewVal);
        } else {
            if (c_oserct_piechartDLBLS === type) {
                var oNewVal = new CDLbls();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                });
                val.setDLbls(oNewVal);
            } else {
                if (c_oserct_piechartFIRSTSLICEANG === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_FirstSliceAng(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setFirstSliceAng(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_piechartEXTLST === type) {
                        var oNewVal = {};
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_extLst(t, l, oNewVal);
                        });
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ScatterSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scatterserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_scatterserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_scatterserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_scatterserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_scatterserMARKER === type) {
                        var oNewVal = new CMarker();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Marker(t, l, oNewVal);
                        });
                        val.setMarker(oNewVal);
                    } else {
                        if (c_oserct_scatterserDPT === type) {
                            var oNewVal = new CDPt();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_DPt(t, l, oNewVal);
                            });
                            val.addDPt(oNewVal);
                        } else {
                            if (c_oserct_scatterserDLBLS === type) {
                                var oNewVal = new CDLbls();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                                });
                                val.setDLbls(oNewVal);
                            } else {
                                if (c_oserct_scatterserTRENDLINE === type) {
                                    var oNewVal = new CTrendLine();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Trendline(t, l, oNewVal);
                                    });
                                    val.setTrendline(oNewVal);
                                } else {
                                    if (c_oserct_scatterserERRBARS === type) {
                                        var oNewVal = new CErrBars();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_ErrBars(t, l, oNewVal);
                                        });
                                        val.setErrBars(oNewVal);
                                    } else {
                                        if (c_oserct_scatterserXVAL === type) {
                                            var oNewVal = new CCat();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                            });
                                            val.setXVal(oNewVal);
                                        } else {
                                            if (c_oserct_scatterserYVAL === type) {
                                                var oNewVal = new CYVal();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                                });
                                                val.setYVal(oNewVal);
                                            } else {
                                                if (c_oserct_scatterserSMOOTH === type) {
                                                    var oNewVal = {
                                                        m_val: null
                                                    };
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                    });
                                                    if (null != oNewVal.m_val) {
                                                        val.setSmooth(oNewVal.m_val);
                                                    }
                                                } else {
                                                    if (c_oserct_scatterserEXTLST === type) {
                                                        var oNewVal = {};
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                                        });
                                                    } else {
                                                        res = c_oSerConstants.ReadUnknown;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ScatterStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scatterstyleVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_scatterstyleNONE:
            val.m_val = SCATTER_STYLE_NONE;
            break;
        case st_scatterstyleLINE:
            val.m_val = SCATTER_STYLE_LINE;
            break;
        case st_scatterstyleLINEMARKER:
            val.m_val = SCATTER_STYLE_LINE_MARKER;
            break;
        case st_scatterstyleMARKER:
            val.m_val = SCATTER_STYLE_MARKER;
            break;
        case st_scatterstyleSMOOTH:
            val.m_val = SCATTER_STYLE_SMOOTH;
            break;
        case st_scatterstyleSMOOTHMARKER:
            val.m_val = SCATTER_STYLE_SMOOTH_MARKER;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_ScatterChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_scatterchartSCATTERSTYLE === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ScatterStyle(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setScatterStyle(oNewVal.m_val);
        }
    } else {
        if (c_oserct_scatterchartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_scatterchartSER === type) {
                var oNewVal = new CScatterSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_ScatterSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_scatterchartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_scatterchartAXID === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            aChartWithAxis.push({
                                axisId: oNewVal.m_val,
                                chart: val
                            });
                        }
                    } else {
                        if (c_oserct_scatterchartEXTLST === type) {
                            var oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_extLst(t, l, oNewVal);
                            });
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_RadarSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_radarserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_radarserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_radarserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_radarserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_radarserMARKER === type) {
                        var oNewVal = new CMarker();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Marker(t, l, oNewVal);
                        });
                        val.setMarker(oNewVal);
                    } else {
                        if (c_oserct_radarserDPT === type) {
                            var oNewVal = new CDPt();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_DPt(t, l, oNewVal);
                            });
                            val.addDPt(oNewVal);
                        } else {
                            if (c_oserct_radarserDLBLS === type) {
                                var oNewVal = new CDLbls();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                                });
                                val.setDLbls(oNewVal);
                            } else {
                                if (c_oserct_radarserCAT === type) {
                                    var oNewVal = new CCat();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                    });
                                    val.setCat(oNewVal);
                                } else {
                                    if (c_oserct_radarserVAL === type) {
                                        var oNewVal = new CYVal();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                        });
                                        val.setVal(oNewVal);
                                    } else {
                                        if (c_oserct_radarserEXTLST === type) {
                                            var oNewVal;
                                            oNewVal = {};
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_extLst(t, l, oNewVal);
                                            });
                                        } else {
                                            res = c_oSerConstants.ReadUnknown;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_RadarStyle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_radarstyleVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_radarstyleSTANDARD:
            val.m_val = RADAR_STYLE_STANDARD;
            break;
        case st_radarstyleMARKER:
            val.m_val = RADAR_STYLE_MARKER;
            break;
        case st_radarstyleFILLED:
            val.m_val = RADAR_STYLE_FILLED;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_RadarChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_radarchartRADARSTYLE === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RadarStyle(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setRadarStyle(oNewVal.m_val);
        }
    } else {
        if (c_oserct_radarchartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_radarchartSER === type) {
                var oNewVal = new CRadarSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_RadarSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_radarchartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_radarchartAXID === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            aChartWithAxis.push({
                                axisId: oNewVal.m_val,
                                chart: val
                            });
                        }
                    } else {
                        if (c_oserct_radarchartEXTLST === type) {
                            var oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_extLst(t, l, oNewVal);
                            });
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_StockChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_stockchartSER === type) {
        var oNewVal = new CLineSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_LineSer(t, l, oNewVal);
        });
        val.addSer(oNewVal);
    } else {
        if (c_oserct_stockchartDLBLS === type) {
            var oNewVal = new CDLbls();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_DLbls(t, l, oNewVal);
            });
            val.setDLbls(oNewVal);
        } else {
            if (c_oserct_stockchartDROPLINES === type) {
                var oNewVal = {
                    spPr: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_ChartLines(t, l, oNewVal);
                });
                if (null != oNewVal.spPr) {
                    val.setDropLines(oNewVal.spPr);
                } else {
                    val.setDropLines(new CSpPr());
                }
            } else {
                if (c_oserct_stockchartHILOWLINES === type) {
                    var oNewVal = {
                        spPr: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_ChartLines(t, l, oNewVal);
                    });
                    if (null != oNewVal.spPr) {
                        val.setHiLowLines(oNewVal.spPr);
                    } else {
                        val.setHiLowLines(new CSpPr());
                    }
                } else {
                    if (c_oserct_stockchartUPDOWNBARS === type) {
                        var oNewVal = new CUpDownBars();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_UpDownBars(t, l, oNewVal);
                        });
                        val.setUpDownBars(oNewVal);
                    } else {
                        if (c_oserct_stockchartAXID === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                aChartWithAxis.push({
                                    axisId: oNewVal.m_val,
                                    chart: val
                                });
                            }
                        } else {
                            if (c_oserct_stockchartEXTLST === type) {
                                var oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LineSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_lineserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_lineserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_lineserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_lineserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_lineserMARKER === type) {
                        var oNewVal = new CMarker();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Marker(t, l, oNewVal);
                        });
                        val.setMarker(oNewVal);
                    } else {
                        if (c_oserct_lineserDPT === type) {
                            var oNewVal = new CDPt();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_DPt(t, l, oNewVal);
                            });
                            val.addDPt(oNewVal);
                        } else {
                            if (c_oserct_lineserDLBLS === type) {
                                var oNewVal = new CDLbls();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                                });
                                val.setDLbls(oNewVal);
                            } else {
                                if (c_oserct_lineserTRENDLINE === type) {
                                    var oNewVal = new CTrendLine();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Trendline(t, l, oNewVal);
                                    });
                                    val.setTrendline(oNewVal);
                                } else {
                                    if (c_oserct_lineserERRBARS === type) {
                                        var oNewVal = new CErrBars();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_ErrBars(t, l, oNewVal);
                                        });
                                        val.setErrBars(oNewVal);
                                    } else {
                                        if (c_oserct_lineserCAT === type) {
                                            var oNewVal = new CCat();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                            });
                                            val.setCat(oNewVal);
                                        } else {
                                            if (c_oserct_lineserVAL === type) {
                                                var oNewVal = new CYVal();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                                });
                                                val.setVal(oNewVal);
                                            } else {
                                                if (c_oserct_lineserSMOOTH === type) {
                                                    var oNewVal = {
                                                        m_val: null
                                                    };
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                    });
                                                    if (null != oNewVal.m_val) {
                                                        val.setSmooth(oNewVal.m_val);
                                                    }
                                                } else {
                                                    if (c_oserct_lineserEXTLST === type) {
                                                        var oNewVal = {};
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                                        });
                                                    } else {
                                                        res = c_oSerConstants.ReadUnknown;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_UpDownBars = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_updownbarsGAPWIDTH === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_GapAmount(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setGapWidth(oNewVal.m_val);
        }
    } else {
        if (c_oserct_updownbarsUPBARS === type) {
            var oNewVal = {
                spPr: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UpDownBar(t, l, oNewVal);
            });
            if (null != oNewVal.spPr) {
                val.setUpBars(oNewVal.spPr);
            } else {
                val.setUpBars(new CSpPr());
            }
        } else {
            if (c_oserct_updownbarsDOWNBARS === type) {
                var oNewVal = {
                    spPr: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_UpDownBar(t, l, oNewVal);
                });
                if (null != oNewVal.spPr) {
                    val.setDownBars(oNewVal.spPr);
                } else {
                    val.setDownBars(new CSpPr());
                }
            } else {
                if (c_oserct_updownbarsEXTLST === type) {
                    var oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_UpDownBar = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_updownbarSPPR === type) {
        val.spPr = this.ReadSpPr(length);
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Line3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_line3dchartGROUPING === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setGrouping(oNewVal.m_val);
        }
    } else {
        if (c_oserct_line3dchartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_line3dchartSER === type) {
                var oNewVal = new CLineSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_LineSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_line3dchartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_line3dchartDROPLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setDropLines(oNewVal.spPr);
                        } else {
                            val.setDropLines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_line3dchartGAPDEPTH === type) {
                            var oNewVal;
                            oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_GapAmount(t, l, oNewVal);
                            });
                        } else {
                            if (c_oserct_line3dchartAXID === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    aChartWithAxis.push({
                                        axisId: oNewVal.m_val,
                                        chart: val
                                    });
                                }
                            } else {
                                if (c_oserct_line3dchartEXTLST === type) {
                                    var oNewVal = {};
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Grouping = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_groupingVAL === type) {
        switch (this.stream.GetUChar()) {
        case st_groupingPERCENTSTACKED:
            val.m_val = GROUPING_PERCENT_STACKED;
            break;
        case st_groupingSTANDARD:
            val.m_val = GROUPING_STANDARD;
            break;
        case st_groupingSTACKED:
            val.m_val = GROUPING_STACKED;
            break;
        }
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_LineChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_linechartGROUPING === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setGrouping(oNewVal.m_val);
        }
    } else {
        if (c_oserct_linechartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_linechartSER === type) {
                var oNewVal = new CLineSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_LineSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_linechartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_linechartDROPLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setDropLines(oNewVal.spPr);
                        } else {
                            val.setDropLines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_linechartHILOWLINES === type) {
                            var oNewVal = {
                                spPr: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_ChartLines(t, l, oNewVal);
                            });
                            if (null != oNewVal.spPr) {
                                val.setHiLowLines(oNewVal.spPr);
                            } else {
                                val.setHiLowLines(new CSpPr());
                            }
                        } else {
                            if (c_oserct_linechartUPDOWNBARS === type) {
                                var oNewVal = new CUpDownBars();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_UpDownBars(t, l, oNewVal);
                                });
                                val.setUpDownBars(oNewVal);
                            } else {
                                if (c_oserct_linechartMARKER === type) {
                                    var oNewVal = {
                                        m_val: null
                                    };
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                    });
                                    if (null != oNewVal.m_val) {
                                        val.setMarker(oNewVal.m_val);
                                    }
                                } else {
                                    if (c_oserct_linechartSMOOTH === type) {
                                        var oNewVal = {
                                            m_val: null
                                        };
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                                        });
                                        if (null != oNewVal.m_val) {
                                            val.setSmooth(oNewVal.m_val);
                                        }
                                    } else {
                                        if (c_oserct_linechartAXID === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                aChartWithAxis.push({
                                                    axisId: oNewVal.m_val,
                                                    chart: val
                                                });
                                            }
                                        } else {
                                            if (c_oserct_linechartEXTLST === type) {
                                                var oNewVal = {};
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                                });
                                            } else {
                                                res = c_oSerConstants.ReadUnknown;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Area3DChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_area3dchartGROUPING === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setGrouping(oNewVal.m_val);
        }
    } else {
        if (c_oserct_area3dchartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_area3dchartSER === type) {
                var oNewVal = new CAreaSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_AreaSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_area3dchartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_area3dchartDROPLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setDropLines(oNewVal.spPr);
                        } else {
                            val.setDropLines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_area3dchartGAPDEPTH === type) {
                            var oNewVal;
                            oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_GapAmount(t, l, oNewVal);
                            });
                        } else {
                            if (c_oserct_area3dchartAXID === type) {
                                var oNewVal = {
                                    m_val: null
                                };
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                                });
                                if (null != oNewVal.m_val) {
                                    aChartWithAxis.push({
                                        axisId: oNewVal.m_val,
                                        chart: val
                                    });
                                }
                            } else {
                                if (c_oserct_area3dchartEXTLST === type) {
                                    var oNewVal = {};
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                    });
                                } else {
                                    res = c_oSerConstants.ReadUnknown;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_AreaSer = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_areaserIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_areaserORDER === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setOrder(oNewVal.m_val);
            }
        } else {
            if (c_oserct_areaserTX === type) {
                var oNewVal = new CTx();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_SerTx(t, l, oNewVal);
                });
                val.setTx(oNewVal);
            } else {
                if (c_oserct_areaserSPPR === type) {
                    val.setSpPr(this.ReadSpPr(length));
                } else {
                    if (c_oserct_areaserPICTUREOPTIONS === type) {
                        var oNewVal = new CPictureOptions();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_PictureOptions(t, l, oNewVal);
                        });
                        val.setPictureOptions(oNewVal);
                    } else {
                        if (c_oserct_areaserDPT === type) {
                            var oNewVal = new CDPt();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_DPt(t, l, oNewVal);
                            });
                            val.addDPt(oNewVal);
                        } else {
                            if (c_oserct_areaserDLBLS === type) {
                                var oNewVal = new CDLbls();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DLbls(t, l, oNewVal);
                                });
                                val.setDLbls(oNewVal);
                            } else {
                                if (c_oserct_areaserTRENDLINE === type) {
                                    var oNewVal = new CTrendLine();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Trendline(t, l, oNewVal);
                                    });
                                    val.setTrendline(oNewVal);
                                } else {
                                    if (c_oserct_areaserERRBARS === type) {
                                        var oNewVal = new CErrBars();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_ErrBars(t, l, oNewVal);
                                        });
                                        val.setErrBars(oNewVal);
                                    } else {
                                        if (c_oserct_areaserCAT === type) {
                                            var oNewVal = new CCat();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_AxDataSource(t, l, oNewVal);
                                            });
                                            val.setCat(oNewVal);
                                        } else {
                                            if (c_oserct_areaserVAL === type) {
                                                var oNewVal = new CYVal();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_NumDataSource(t, l, oNewVal);
                                                });
                                                val.setVal(oNewVal);
                                            } else {
                                                if (c_oserct_areaserEXTLST === type) {
                                                    var oNewVal = {};
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                                    });
                                                } else {
                                                    res = c_oSerConstants.ReadUnknown;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_AreaChart = function (type, length, val, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_areachartGROUPING === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Grouping(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setGrouping(oNewVal.m_val);
        }
    } else {
        if (c_oserct_areachartVARYCOLORS === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setVaryColors(oNewVal.m_val);
            }
        } else {
            if (c_oserct_areachartSER === type) {
                var oNewVal = new CAreaSeries();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_AreaSer(t, l, oNewVal);
                });
                val.addSer(oNewVal);
            } else {
                if (c_oserct_areachartDLBLS === type) {
                    var oNewVal = new CDLbls();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DLbls(t, l, oNewVal);
                    });
                    val.setDLbls(oNewVal);
                } else {
                    if (c_oserct_areachartDROPLINES === type) {
                        var oNewVal = {
                            spPr: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_ChartLines(t, l, oNewVal);
                        });
                        if (null != oNewVal.spPr) {
                            val.setDropLines(oNewVal.spPr);
                        } else {
                            val.setDropLines(new CSpPr());
                        }
                    } else {
                        if (c_oserct_areachartAXID === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                aChartWithAxis.push({
                                    axisId: oNewVal.m_val,
                                    chart: val
                                });
                            }
                        } else {
                            if (c_oserct_areachartEXTLST === type) {
                                var oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PlotArea = function (type, length, val, oIdToAxisMap, aChartWithAxis) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_plotareaLAYOUT === type) {
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Layout(t, l, val);
        });
    } else {
        if (c_oserct_plotareaAREA3DCHART === type) {
            var oNewVal = new CAreaChart();
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Area3DChart(t, l, oNewVal, aChartWithAxis);
            });
            val.addChart(oNewVal);
        } else {
            if (c_oserct_plotareaAREACHART === type) {
                var oNewVal = new CAreaChart();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_AreaChart(t, l, oNewVal, aChartWithAxis);
                });
                val.addChart(oNewVal);
            } else {
                if (c_oserct_plotareaBAR3DCHART === type) {
                    var oNewVal = new CBarChart();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Bar3DChart(t, l, oNewVal, aChartWithAxis);
                    });
                    if (BAR_GROUPING_STANDARD == oNewVal.grouping) {
                        oNewVal.setGrouping(BAR_GROUPING_CLUSTERED);
                    } else {
                        if (BAR_GROUPING_CLUSTERED != oNewVal.grouping) {
                            oNewVal.setOverlap(100);
                        }
                    }
                    val.addChart(oNewVal);
                } else {
                    if (c_oserct_plotareaBARCHART === type) {
                        var oNewVal = new CBarChart();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_BarChart(t, l, oNewVal, aChartWithAxis);
                        });
                        val.addChart(oNewVal);
                    } else {
                        if (c_oserct_plotareaBUBBLECHART === type) {
                            var oNewVal = new CBubbleChart();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_BubbleChart(t, l, oNewVal, aChartWithAxis);
                            });
                            var scatter = this.ConvertBubbleToScatter(oNewVal, aChartWithAxis);
                            val.addChart(scatter);
                        } else {
                            if (c_oserct_plotareaDOUGHNUTCHART === type) {
                                var oNewVal = new CDoughnutChart();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_DoughnutChart(t, l, oNewVal, aChartWithAxis);
                                });
                                val.addChart(oNewVal);
                            } else {
                                if (c_oserct_plotareaLINE3DCHART === type) {
                                    var oNewVal = new CLineChart();
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_Line3DChart(t, l, oNewVal, aChartWithAxis);
                                    });
                                    oNewVal.setMarker(true);
                                    oNewVal.setSmooth(false);
                                    for (var i = 0, length = oNewVal.series.length; i < length; ++i) {
                                        var seria = oNewVal.series[i];
                                        if (null == seria.marker) {
                                            var marker = new CMarker();
                                            marker.setSymbol(SYMBOL_NONE);
                                            seria.setMarker(marker);
                                        }
                                    }
                                    val.addChart(oNewVal);
                                } else {
                                    if (c_oserct_plotareaLINECHART === type) {
                                        var oNewVal = new CLineChart();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_LineChart(t, l, oNewVal, aChartWithAxis);
                                        });
                                        val.addChart(oNewVal);
                                    } else {
                                        if (c_oserct_plotareaOFPIECHART === type) {
                                            var oNewVal = new COfPieChart();
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_OfPieChart(t, l, oNewVal, aChartWithAxis);
                                            });
                                            var pie = this.ConvertOfPieToPie(oNewVal, aChartWithAxis);
                                            val.addChart(pie);
                                        } else {
                                            if (c_oserct_plotareaPIE3DCHART === type) {
                                                var oNewVal = new CPieChart();
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_Pie3DChart(t, l, oNewVal, aChartWithAxis);
                                                });
                                                oNewVal.setFirstSliceAng(0);
                                                val.addChart(oNewVal);
                                            } else {
                                                if (c_oserct_plotareaPIECHART === type) {
                                                    var oNewVal = new CPieChart();
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_PieChart(t, l, oNewVal, aChartWithAxis);
                                                    });
                                                    val.addChart(oNewVal);
                                                } else {
                                                    if (c_oserct_plotareaRADARCHART === type) {
                                                        var oNewVal = new CRadarChart();
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_RadarChart(t, l, oNewVal, aChartWithAxis);
                                                        });
                                                        var line = this.ConvertRadarToLine(oNewVal, aChartWithAxis);
                                                        val.addChart(line);
                                                    } else {
                                                        if (c_oserct_plotareaSCATTERCHART === type) {
                                                            var oNewVal = new CScatterChart();
                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                return oThis.ReadCT_ScatterChart(t, l, oNewVal, aChartWithAxis);
                                                            });
                                                            val.addChart(oNewVal);
                                                        } else {
                                                            if (c_oserct_plotareaSTOCKCHART === type) {
                                                                var oNewVal = new CStockChart();
                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                    return oThis.ReadCT_StockChart(t, l, oNewVal, aChartWithAxis);
                                                                });
                                                                val.addChart(oNewVal);
                                                            } else {
                                                                if (c_oserct_plotareaSURFACE3DCHART === type) {
                                                                    var oNewVal = new CSurfaceChart();
                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                        return oThis.ReadCT_Surface3DChart(t, l, oNewVal, aChartWithAxis);
                                                                    });
                                                                    var line = this.ConvertSurfaceToLine(oNewVal, aChartWithAxis);
                                                                    val.addChart(line);
                                                                } else {
                                                                    if (c_oserct_plotareaSURFACECHART === type) {
                                                                        var oNewVal = new CSurfaceChart();
                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                            return oThis.ReadCT_SurfaceChart(t, l, oNewVal, aChartWithAxis);
                                                                        });
                                                                        var line = this.ConvertSurfaceToLine(oNewVal, aChartWithAxis);
                                                                        val.addChart(line);
                                                                    } else {
                                                                        if (c_oserct_plotareaCATAX === type) {
                                                                            var oNewVal = new CCatAx();
                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                return oThis.ReadCT_CatAx(t, l, oNewVal);
                                                                            });
                                                                            if (null != oNewVal.axId) {
                                                                                oIdToAxisMap[oNewVal.axId] = oNewVal;
                                                                            }
                                                                            val.addAxis(oNewVal);
                                                                        } else {
                                                                            if (c_oserct_plotareaDATEAX === type) {
                                                                                var oNewVal = new CDateAx();
                                                                                res = this.bcr.Read1(length, function (t, l) {
                                                                                    return oThis.ReadCT_DateAx(t, l, oNewVal);
                                                                                });
                                                                                if (null != oNewVal.axId) {
                                                                                    oIdToAxisMap[oNewVal.axId] = oNewVal;
                                                                                }
                                                                                val.addAxis(oNewVal);
                                                                            } else {
                                                                                if (c_oserct_plotareaSERAX === type) {
                                                                                    var oNewVal = new CSerAx();
                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                        return oThis.ReadCT_SerAx(t, l, oNewVal);
                                                                                    });
                                                                                    if (null != oNewVal.axId) {
                                                                                        oIdToAxisMap[oNewVal.axId] = oNewVal;
                                                                                    }
                                                                                    val.addAxis(oNewVal);
                                                                                } else {
                                                                                    if (c_oserct_plotareaVALAX === type) {
                                                                                        var oNewVal = new CValAx();
                                                                                        res = this.bcr.Read1(length, function (t, l) {
                                                                                            return oThis.ReadCT_ValAx(t, l, oNewVal);
                                                                                        });
                                                                                        if (null != oNewVal.axId) {
                                                                                            oIdToAxisMap[oNewVal.axId] = oNewVal;
                                                                                        }
                                                                                        val.addAxis(oNewVal);
                                                                                    } else {
                                                                                        if (c_oserct_plotareaDTABLE === type) {
                                                                                            var oNewVal = new CDTable();
                                                                                            res = this.bcr.Read1(length, function (t, l) {
                                                                                                return oThis.ReadCT_DTable(t, l, oNewVal);
                                                                                            });
                                                                                            val.setDTable(oNewVal);
                                                                                        } else {
                                                                                            if (c_oserct_plotareaSPPR === type) {
                                                                                                val.setSpPr(this.ReadSpPr(length));
                                                                                            } else {
                                                                                                if (c_oserct_plotareaEXTLST === type) {
                                                                                                    var oNewVal = {};
                                                                                                    res = this.bcr.Read1(length, function (t, l) {
                                                                                                        return oThis.ReadCT_extLst(t, l, oNewVal);
                                                                                                    });
                                                                                                } else {
                                                                                                    res = c_oSerConstants.ReadUnknown;
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Thickness = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_thicknessVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Surface = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_surfaceTHICKNESS === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Thickness(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setThickness(oNewVal.m_val);
        }
    } else {
        if (c_oserct_surfaceSPPR === type) {
            val.setSpPr(this.ReadSpPr(length));
        } else {
            if (c_oserct_surfacePICTUREOPTIONS === type) {
                var oNewVal = new CPictureOptions();
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_PictureOptions(t, l, oNewVal);
                });
                val.setPictureOptions(oNewVal);
            } else {
                if (c_oserct_surfaceEXTLST === type) {
                    var oNewVal = {};
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_extLst(t, l, oNewVal);
                    });
                } else {
                    res = c_oSerConstants.ReadUnknown;
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Perspective = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_perspectiveVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_DepthPercent = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_depthpercentVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_RotY = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_rotyVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetULongLE();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_HPercent = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_hpercentVAL === type) {
        val.m_val = this.ParsePersent(this.stream.GetString2LE(length));
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_RotX = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_rotxVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_View3D = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_view3dROTX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_RotX(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setRotX(oNewVal.m_val);
        }
    } else {
        if (c_oserct_view3dHPERCENT === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_HPercent(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setHPercent(oNewVal.m_val);
            }
        } else {
            if (c_oserct_view3dROTY === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_RotY(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setRotY(oNewVal.m_val);
                }
            } else {
                if (c_oserct_view3dDEPTHPERCENT === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_DepthPercent(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setDepthPercent(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_view3dRANGAX === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setRAngAx(oNewVal.m_val);
                        }
                    } else {
                        if (c_oserct_view3dPERSPECTIVE === type) {
                            var oNewVal = {
                                m_val: null
                            };
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_Perspective(t, l, oNewVal);
                            });
                            if (null != oNewVal.m_val) {
                                val.setPerspective(oNewVal.m_val);
                            }
                        } else {
                            if (c_oserct_view3dEXTLST === type) {
                                var oNewVal = {};
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_extLst(t, l, oNewVal);
                                });
                            } else {
                                res = c_oSerConstants.ReadUnknown;
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PivotFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pivotfmtIDX === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setIdx(oNewVal.m_val);
        }
    } else {
        if (c_oserct_pivotfmtSPPR === type) {
            val.setSpPr(this.ReadSpPr(length));
        } else {
            if (c_oserct_pivotfmtTXPR === type) {
                val.setTxPr(this.ReadTxPr(length));
                val.txPr.setParent(val);
            } else {
                if (c_oserct_pivotfmtMARKER === type) {
                    var oNewVal = new CMarker();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Marker(t, l, oNewVal);
                    });
                    val.setMarker(oNewVal);
                } else {
                    if (c_oserct_pivotfmtDLBL === type) {
                        var oNewVal = new CDLbl();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_DLbl(t, l, oNewVal);
                        });
                        val.setLbl(oNewVal);
                    } else {
                        if (c_oserct_pivotfmtEXTLST === type) {
                            var oNewVal = {};
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_extLst(t, l, oNewVal);
                            });
                        } else {
                            res = c_oSerConstants.ReadUnknown;
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_pivotFmts = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pivotfmtsPIVOTFMT === type) {
        var oNewVal = new CPivotFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PivotFmt(t, l, oNewVal);
        });
        val.setPivotFmts(oNewVal);
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Chart = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_chartTITLE === type) {
        var oNewVal = new CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        if (!isRealBool(oNewVal.overlay)) {
            oNewVal.setOverlay(false);
        }
        val.setTitle(oNewVal);
    } else {
        if (c_oserct_chartAUTOTITLEDELETED === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setAutoTitleDeleted(oNewVal.m_val);
            }
        } else {
            if (c_oserct_chartPIVOTFMTS === type) {
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_pivotFmts(t, l, val);
                });
            } else {
                if (c_oserct_chartVIEW3D === type) {
                    var oNewVal = new CView3d();
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_View3D(t, l, oNewVal);
                    });
                    val.setView3D(oNewVal);
                } else {
                    if (c_oserct_chartFLOOR === type) {
                        var oNewVal = new CChartWall();
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Surface(t, l, oNewVal);
                        });
                        val.setFloor(oNewVal);
                    } else {
                        if (c_oserct_chartSIDEWALL === type) {
                            var oNewVal = new CChartWall();
                            res = this.bcr.Read1(length, function (t, l) {
                                return oThis.ReadCT_Surface(t, l, oNewVal);
                            });
                            val.setSideWall(oNewVal);
                        } else {
                            if (c_oserct_chartBACKWALL === type) {
                                var oNewVal = new CChartWall();
                                res = this.bcr.Read1(length, function (t, l) {
                                    return oThis.ReadCT_Surface(t, l, oNewVal);
                                });
                                val.setBackWall(oNewVal);
                            } else {
                                if (c_oserct_chartPLOTAREA === type) {
                                    var oNewVal = new CPlotArea();
                                    var oIdToAxisMap = {};
                                    var aChartWithAxis = [];
                                    res = this.bcr.Read1(length, function (t, l) {
                                        return oThis.ReadCT_PlotArea(t, l, oNewVal, oIdToAxisMap, aChartWithAxis);
                                    });
                                    for (var nAxIndex = 0; nAxIndex < oNewVal.axId.length; ++nAxIndex) {
                                        var oCurAxis = oNewVal.axId[nAxIndex];
                                        oCurAxis.setCrossAx(oIdToAxisMap[oCurAxis.crossAxId]);
                                        delete oCurAxis.crossAxId;
                                    }
                                    for (var nChartIndex = 0; nChartIndex < aChartWithAxis.length; ++nChartIndex) {
                                        var oCurChartWithAxis = aChartWithAxis[nChartIndex];
                                        var axis = oIdToAxisMap[oCurChartWithAxis.axisId];
                                        oCurChartWithAxis.chart.addAxId(axis);
                                        if (axis && axis.getObjectType() === historyitem_type_ValAx && !isRealNumber(axis.crossBetween)) {
                                            if (oCurChartWithAxis.chart.getObjectType() === historyitem_type_AreaChart) {
                                                axis.setCrossBetween(CROSS_BETWEEN_MID_CAT);
                                            } else {
                                                axis.setCrossBetween(CROSS_BETWEEN_BETWEEN);
                                            }
                                        }
                                    }
                                    val.setPlotArea(oNewVal);
                                } else {
                                    if (c_oserct_chartLEGEND === type) {
                                        var oNewVal = new CLegend();
                                        res = this.bcr.Read1(length, function (t, l) {
                                            return oThis.ReadCT_Legend(t, l, oNewVal);
                                        });
                                        val.setLegend(oNewVal);
                                    } else {
                                        if (c_oserct_chartPLOTVISONLY === type) {
                                            var oNewVal = {
                                                m_val: null
                                            };
                                            res = this.bcr.Read1(length, function (t, l) {
                                                return oThis.ReadCT_Boolean(t, l, oNewVal);
                                            });
                                            if (null != oNewVal.m_val) {
                                                val.setPlotVisOnly(oNewVal.m_val);
                                            }
                                        } else {
                                            if (c_oserct_chartDISPBLANKSAS === type) {
                                                var oNewVal = {
                                                    m_val: null
                                                };
                                                res = this.bcr.Read1(length, function (t, l) {
                                                    return oThis.ReadCT_DispBlanksAs(t, l, oNewVal);
                                                });
                                                if (null != oNewVal.m_val) {
                                                    val.setDispBlanksAs(oNewVal.m_val);
                                                }
                                            } else {
                                                if (c_oserct_chartSHOWDLBLSOVERMAX === type) {
                                                    var oNewVal = {
                                                        m_val: null
                                                    };
                                                    res = this.bcr.Read1(length, function (t, l) {
                                                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                                                    });
                                                    if (null != oNewVal.m_val) {
                                                        val.setShowDLblsOverMax(oNewVal.m_val);
                                                    }
                                                } else {
                                                    if (c_oserct_chartEXTLST === type) {
                                                        var oNewVal = {};
                                                        res = this.bcr.Read1(length, function (t, l) {
                                                            return oThis.ReadCT_extLst(t, l, oNewVal);
                                                        });
                                                    } else {
                                                        res = c_oSerConstants.ReadUnknown;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Protection = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_protectionCHARTOBJECT === type) {
        var oNewVal = {
            m_val: null
        };
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        if (null != oNewVal.m_val) {
            val.setChartObject(oNewVal.m_val);
        }
    } else {
        if (c_oserct_protectionDATA === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_Boolean(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setData(oNewVal.m_val);
            }
        } else {
            if (c_oserct_protectionFORMATTING === type) {
                var oNewVal = {
                    m_val: null
                };
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_Boolean(t, l, oNewVal);
                });
                if (null != oNewVal.m_val) {
                    val.setFormatting(oNewVal.m_val);
                }
            } else {
                if (c_oserct_protectionSELECTION === type) {
                    var oNewVal = {
                        m_val: null
                    };
                    res = this.bcr.Read1(length, function (t, l) {
                        return oThis.ReadCT_Boolean(t, l, oNewVal);
                    });
                    if (null != oNewVal.m_val) {
                        val.setSelection(oNewVal.m_val);
                    }
                } else {
                    if (c_oserct_protectionUSERINTERFACE === type) {
                        var oNewVal = {
                            m_val: null
                        };
                        res = this.bcr.Read1(length, function (t, l) {
                            return oThis.ReadCT_Boolean(t, l, oNewVal);
                        });
                        if (null != oNewVal.m_val) {
                            val.setUserInterface(oNewVal.m_val);
                        }
                    } else {
                        res = c_oSerConstants.ReadUnknown;
                    }
                }
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_PivotSource = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_pivotsourceNAME === type) {
        val.setName(this.stream.GetString2LE(length));
    } else {
        if (c_oserct_pivotsourceFMTID === type) {
            var oNewVal = {
                m_val: null
            };
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadCT_UnsignedInt(t, l, oNewVal);
            });
            if (null != oNewVal.m_val) {
                val.setFmtId(oNewVal.m_val);
            }
        } else {
            if (c_oserct_pivotsourceEXTLST === type) {
                var oNewVal = {};
                res = this.bcr.Read1(length, function (t, l) {
                    return oThis.ReadCT_extLst(t, l, oNewVal);
                });
            } else {
                res = c_oSerConstants.ReadUnknown;
            }
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Style1 = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_style1VAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_Style = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_styleVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetUChar();
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadCT_TextLanguageID = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_textlanguageidVAL === type) {
        var oNewVal;
        oNewVal = this.stream.GetString2LE(length);
        val.m_val = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
BinaryChartReader.prototype.ReadAlternateContent = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oseralternatecontentCHOICE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadAlternateContentChoice(t, l, oNewVal);
        });
        if (null == val.m_Choice) {
            val.m_Choice = [];
        }
        val.m_Choice.push(oNewVal);
    } else {
        if (c_oseralternatecontentFALLBACK === type) {
            var oNewVal;
            oNewVal = {};
            res = this.bcr.Read1(length, function (t, l) {
                return oThis.ReadAlternateContentFallback(t, l, oNewVal);
            });
            val.m_Fallback = oNewVal;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadAlternateContentChoice = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oseralternatecontentchoiceSTYLE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Style(t, l, oNewVal);
        });
        val.m_style = oNewVal;
    } else {
        if (c_oseralternatecontentchoiceREQUIRES === type) {
            var oNewVal;
            oNewVal = this.stream.GetString2LE(length);
            val.m_Requires = oNewVal;
        } else {
            res = c_oSerConstants.ReadUnknown;
        }
    }
    return res;
};
BinaryChartReader.prototype.ReadAlternateContentFallback = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oseralternatecontentfallbackSTYLE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Style1(t, l, oNewVal);
        });
        val.m_style = oNewVal;
    } else {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};