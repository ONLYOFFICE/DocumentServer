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
 var fontslot_ASCII = 0;
var fontslot_EastAsia = 1;
var fontslot_CS = 2;
var fontslot_HAnsi = 3;
var fonthint_Default = 0;
var fonthint_CS = 1;
var fonthint_EastAsia = 2;
var lcid_unknown = 0;
var lcid_ar = 1;
var lcid_bg = 2;
var lcid_ca = 3;
var lcid_zhHans = 4;
var lcid_cs = 5;
var lcid_da = 6;
var lcid_de = 7;
var lcid_el = 8;
var lcid_en = 9;
var lcid_es = 10;
var lcid_fi = 11;
var lcid_fr = 12;
var lcid_he = 13;
var lcid_hu = 14;
var lcid_is = 15;
var lcid_it = 16;
var lcid_ja = 17;
var lcid_ko = 18;
var lcid_nl = 19;
var lcid_no = 20;
var lcid_pl = 21;
var lcid_pt = 22;
var lcid_rm = 23;
var lcid_ro = 24;
var lcid_ru = 25;
var lcid_hr = 26;
var lcid_sk = 27;
var lcid_sq = 28;
var lcid_sv = 29;
var lcid_th = 30;
var lcid_tr = 31;
var lcid_ur = 32;
var lcid_id = 33;
var lcid_uk = 34;
var lcid_be = 35;
var lcid_sl = 36;
var lcid_et = 37;
var lcid_lv = 38;
var lcid_lt = 39;
var lcid_tg = 40;
var lcid_fa = 41;
var lcid_vi = 42;
var lcid_hy = 43;
var lcid_az = 44;
var lcid_eu = 45;
var lcid_hsb = 46;
var lcid_mk = 47;
var lcid_tn = 50;
var lcid_xh = 52;
var lcid_zu = 53;
var lcid_af = 54;
var lcid_ka = 55;
var lcid_fo = 56;
var lcid_hi = 57;
var lcid_mt = 58;
var lcid_se = 59;
var lcid_ga = 60;
var lcid_ms = 62;
var lcid_kk = 63;
var lcid_ky = 64;
var lcid_sw = 65;
var lcid_tk = 66;
var lcid_uz = 67;
var lcid_tt = 68;
var lcid_bn = 69;
var lcid_pa = 70;
var lcid_gu = 71;
var lcid_or = 72;
var lcid_ta = 73;
var lcid_te = 74;
var lcid_kn = 75;
var lcid_ml = 76;
var lcid_as = 77;
var lcid_mr = 78;
var lcid_sa = 79;
var lcid_mn = 80;
var lcid_bo = 81;
var lcid_cy = 82;
var lcid_km = 83;
var lcid_lo = 84;
var lcid_gl = 86;
var lcid_kok = 87;
var lcid_syr = 90;
var lcid_si = 91;
var lcid_iu = 93;
var lcid_am = 94;
var lcid_tzm = 95;
var lcid_ne = 97;
var lcid_fy = 98;
var lcid_ps = 99;
var lcid_fil = 100;
var lcid_dv = 101;
var lcid_ha = 104;
var lcid_yo = 106;
var lcid_quz = 107;
var lcid_nso = 108;
var lcid_ba = 109;
var lcid_lb = 110;
var lcid_kl = 111;
var lcid_ig = 112;
var lcid_ii = 120;
var lcid_arn = 122;
var lcid_moh = 124;
var lcid_br = 126;
var lcid_ug = 128;
var lcid_mi = 129;
var lcid_oc = 130;
var lcid_co = 131;
var lcid_gsw = 132;
var lcid_sah = 133;
var lcid_qut = 134;
var lcid_rw = 135;
var lcid_wo = 136;
var lcid_prs = 140;
var lcid_gd = 145;
var lcid_arSA = 1025;
var lcid_bgBG = 1026;
var lcid_caES = 1027;
var lcid_zhTW = 1028;
var lcid_csCZ = 1029;
var lcid_daDK = 1030;
var lcid_deDE = 1031;
var lcid_elGR = 1032;
var lcid_enUS = 1033;
var lcid_esES_tradnl = 1034;
var lcid_fiFI = 1035;
var lcid_frFR = 1036;
var lcid_heIL = 1037;
var lcid_huHU = 1038;
var lcid_isIS = 1039;
var lcid_itIT = 1040;
var lcid_jaJP = 1041;
var lcid_koKR = 1042;
var lcid_nlNL = 1043;
var lcid_nbNO = 1044;
var lcid_plPL = 1045;
var lcid_ptBR = 1046;
var lcid_rmCH = 1047;
var lcid_roRO = 1048;
var lcid_ruRU = 1049;
var lcid_hrHR = 1050;
var lcid_skSK = 1051;
var lcid_sqAL = 1052;
var lcid_svSE = 1053;
var lcid_thTH = 1054;
var lcid_trTR = 1055;
var lcid_urPK = 1056;
var lcid_idID = 1057;
var lcid_ukUA = 1058;
var lcid_beBY = 1059;
var lcid_slSI = 1060;
var lcid_etEE = 1061;
var lcid_lvLV = 1062;
var lcid_ltLT = 1063;
var lcid_tgCyrlTJ = 1064;
var lcid_faIR = 1065;
var lcid_viVN = 1066;
var lcid_hyAM = 1067;
var lcid_azLatnAZ = 1068;
var lcid_euES = 1069;
var lcid_wenDE = 1070;
var lcid_mkMK = 1071;
var lcid_stZA = 1072;
var lcid_tsZA = 1073;
var lcid_tnZA = 1074;
var lcid_venZA = 1075;
var lcid_xhZA = 1076;
var lcid_zuZA = 1077;
var lcid_afZA = 1078;
var lcid_kaGE = 1079;
var lcid_foFO = 1080;
var lcid_hiIN = 1081;
var lcid_mtMT = 1082;
var lcid_seNO = 1083;
var lcid_msMY = 1086;
var lcid_kkKZ = 1087;
var lcid_kyKG = 1088;
var lcid_swKE = 1089;
var lcid_tkTM = 1090;
var lcid_uzLatnUZ = 1091;
var lcid_ttRU = 1092;
var lcid_bnIN = 1093;
var lcid_paIN = 1094;
var lcid_guIN = 1095;
var lcid_orIN = 1096;
var lcid_taIN = 1097;
var lcid_teIN = 1098;
var lcid_knIN = 1099;
var lcid_mlIN = 1100;
var lcid_asIN = 1101;
var lcid_mrIN = 1102;
var lcid_saIN = 1103;
var lcid_mnMN = 1104;
var lcid_boCN = 1105;
var lcid_cyGB = 1106;
var lcid_kmKH = 1107;
var lcid_loLA = 1108;
var lcid_myMM = 1109;
var lcid_glES = 1110;
var lcid_kokIN = 1111;
var lcid_mni = 1112;
var lcid_sdIN = 1113;
var lcid_syrSY = 1114;
var lcid_siLK = 1115;
var lcid_chrUS = 1116;
var lcid_iuCansCA = 1117;
var lcid_amET = 1118;
var lcid_tmz = 1119;
var lcid_neNP = 1121;
var lcid_fyNL = 1122;
var lcid_psAF = 1123;
var lcid_filPH = 1124;
var lcid_dvMV = 1125;
var lcid_binNG = 1126;
var lcid_fuvNG = 1127;
var lcid_haLatnNG = 1128;
var lcid_ibbNG = 1129;
var lcid_yoNG = 1130;
var lcid_quzBO = 1131;
var lcid_nsoZA = 1132;
var lcid_baRU = 1133;
var lcid_lbLU = 1134;
var lcid_klGL = 1135;
var lcid_igNG = 1136;
var lcid_krNG = 1137;
var lcid_gazET = 1138;
var lcid_tiER = 1139;
var lcid_gnPY = 1140;
var lcid_hawUS = 1141;
var lcid_soSO = 1143;
var lcid_iiCN = 1144;
var lcid_papAN = 1145;
var lcid_arnCL = 1146;
var lcid_mohCA = 1148;
var lcid_brFR = 1150;
var lcid_ugCN = 1152;
var lcid_miNZ = 1153;
var lcid_ocFR = 1154;
var lcid_coFR = 1155;
var lcid_gswFR = 1156;
var lcid_sahRU = 1157;
var lcid_qutGT = 1158;
var lcid_rwRW = 1159;
var lcid_woSN = 1160;
var lcid_prsAF = 1164;
var lcid_pltMG = 1165;
var lcid_gdGB = 1169;
var lcid_arIQ = 2049;
var lcid_zhCN = 2052;
var lcid_deCH = 2055;
var lcid_enGB = 2057;
var lcid_esMX = 2058;
var lcid_frBE = 2060;
var lcid_itCH = 2064;
var lcid_nlBE = 2067;
var lcid_nnNO = 2068;
var lcid_ptPT = 2070;
var lcid_roMO = 2072;
var lcid_ruMO = 2073;
var lcid_srLatnCS = 2074;
var lcid_svFI = 2077;
var lcid_urIN = 2080;
var lcid_azCyrlAZ = 2092;
var lcid_dsbDE = 2094;
var lcid_seSE = 2107;
var lcid_gaIE = 2108;
var lcid_msBN = 2110;
var lcid_uzCyrlUZ = 2115;
var lcid_bnBD = 2117;
var lcid_paPK = 2118;
var lcid_mnMongCN = 2128;
var lcid_boBT = 2129;
var lcid_sdPK = 2137;
var lcid_iuLatnCA = 2141;
var lcid_tzmLatnDZ = 2143;
var lcid_neIN = 2145;
var lcid_quzEC = 2155;
var lcid_tiET = 2163;
var lcid_arEG = 3073;
var lcid_zhHK = 3076;
var lcid_deAT = 3079;
var lcid_enAU = 3081;
var lcid_esES = 3082;
var lcid_frCA = 3084;
var lcid_srCyrlCS = 3098;
var lcid_seFI = 3131;
var lcid_tmzMA = 3167;
var lcid_quzPE = 3179;
var lcid_arLY = 4097;
var lcid_zhSG = 4100;
var lcid_deLU = 4103;
var lcid_enCA = 4105;
var lcid_esGT = 4106;
var lcid_frCH = 4108;
var lcid_hrBA = 4122;
var lcid_smjNO = 4155;
var lcid_arDZ = 5121;
var lcid_zhMO = 5124;
var lcid_deLI = 5127;
var lcid_enNZ = 5129;
var lcid_esCR = 5130;
var lcid_frLU = 5132;
var lcid_bsLatnBA = 5146;
var lcid_smjSE = 5179;
var lcid_arMA = 6145;
var lcid_enIE = 6153;
var lcid_esPA = 6154;
var lcid_frMC = 6156;
var lcid_srLatnBA = 6170;
var lcid_smaNO = 6203;
var lcid_arTN = 7169;
var lcid_enZA = 7177;
var lcid_esDO = 7178;
var lcid_frWest = 7180;
var lcid_srCyrlBA = 7194;
var lcid_smaSE = 7227;
var lcid_arOM = 8193;
var lcid_enJM = 8201;
var lcid_esVE = 8202;
var lcid_frRE = 8204;
var lcid_bsCyrlBA = 8218;
var lcid_smsFI = 8251;
var lcid_arYE = 9217;
var lcid_enCB = 9225;
var lcid_esCO = 9226;
var lcid_frCG = 9228;
var lcid_srLatnRS = 9242;
var lcid_smnFI = 9275;
var lcid_arSY = 10241;
var lcid_enBZ = 10249;
var lcid_esPE = 10250;
var lcid_frSN = 10252;
var lcid_srCyrlRS = 10266;
var lcid_arJO = 11265;
var lcid_enTT = 11273;
var lcid_esAR = 11274;
var lcid_frCM = 11276;
var lcid_srLatnME = 11290;
var lcid_arLB = 12289;
var lcid_enZW = 12297;
var lcid_esEC = 12298;
var lcid_frCI = 12300;
var lcid_srCyrlME = 12314;
var lcid_arKW = 13313;
var lcid_enPH = 13321;
var lcid_esCL = 13322;
var lcid_frML = 13324;
var lcid_arAE = 14337;
var lcid_enID = 14345;
var lcid_esUY = 14346;
var lcid_frMA = 14348;
var lcid_arBH = 15361;
var lcid_enHK = 15369;
var lcid_esPY = 15370;
var lcid_frHT = 15372;
var lcid_arQA = 16385;
var lcid_enIN = 16393;
var lcid_esBO = 16394;
var lcid_enMY = 17417;
var lcid_esSV = 17418;
var lcid_enSG = 18441;
var lcid_esHN = 18442;
var lcid_esNI = 19466;
var lcid_esPR = 20490;
var lcid_esUS = 21514;
var lcid_bsCyrl = 25626;
var lcid_bsLatn = 26650;
var lcid_srCyrl = 27674;
var lcid_srLatn = 28698;
var lcid_smn = 28731;
var lcid_azCyrl = 29740;
var lcid_sms = 29755;
var lcid_zh = 30724;
var lcid_nn = 30740;
var lcid_bs = 30746;
var lcid_azLatn = 30764;
var lcid_sma = 30779;
var lcid_uzCyrl = 30787;
var lcid_mnCyrl = 30800;
var lcid_iuCans = 30813;
var lcid_zhHant = 31748;
var lcid_nb = 31764;
var lcid_sr = 31770;
var lcid_tgCyrl = 31784;
var lcid_dsb = 31790;
var lcid_smj = 31803;
var lcid_uzLatn = 31811;
var lcid_mnMong = 31824;
var lcid_iuLatn = 31837;
var lcid_tzmLatn = 31839;
var lcid_haLatn = 31848;
(function (document) {
    function CDetectFontUse() {
        this.DetectData = null;
        this.TableChunkLen = 65536;
        this.TableChunks = 4;
        this.TableChunkMain = 0;
        this.TableChunkHintEA = this.TableChunkLen;
        this.TableChunkHintZH = 2 * this.TableChunkLen;
        this.TableChunkHintEACS = 3 * this.TableChunkLen;
        this.Init = function () {
            this.DetectData = g_memory.Alloc(this.TableChunkLen * this.TableChunks);
            var _data = this.DetectData.data;
            var i, j;
            j = 0;
            for (i = 0; i <= 127; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 160; i <= 1279; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 1424; i <= 1983; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 4352; i <= 4607; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 7680; i <= 7935; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 7936; i <= 10175; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 11904; i <= 12703; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 12800; i <= 19855; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 19968; i <= 40879; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 40960; i <= 42191; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 44032; i <= 55215; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 55296; i <= 57343; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 57344; i <= 63743; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 63744; i <= 64255; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64256; i <= 64284; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 64285; i <= 65023; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65072; i <= 65135; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 65136; i <= 65278; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65280; i <= 65519; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            j = this.TableChunkHintEA;
            for (i = 0; i <= 127; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 160; i <= 1279; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            _data[161 + j] = fontslot_EastAsia;
            _data[164 + j] = fontslot_EastAsia;
            _data[167 + j] = fontslot_EastAsia;
            _data[168 + j] = fontslot_EastAsia;
            _data[170 + j] = fontslot_EastAsia;
            _data[173 + j] = fontslot_EastAsia;
            _data[175 + j] = fontslot_EastAsia;
            _data[176 + j] = fontslot_EastAsia;
            _data[177 + j] = fontslot_EastAsia;
            _data[178 + j] = fontslot_EastAsia;
            _data[179 + j] = fontslot_EastAsia;
            _data[180 + j] = fontslot_EastAsia;
            _data[182 + j] = fontslot_EastAsia;
            _data[183 + j] = fontslot_EastAsia;
            _data[184 + j] = fontslot_EastAsia;
            _data[185 + j] = fontslot_EastAsia;
            _data[186 + j] = fontslot_EastAsia;
            _data[188 + j] = fontslot_EastAsia;
            _data[189 + j] = fontslot_EastAsia;
            _data[190 + j] = fontslot_EastAsia;
            _data[191 + j] = fontslot_EastAsia;
            _data[215 + j] = fontslot_EastAsia;
            _data[247 + j] = fontslot_EastAsia;
            for (i = 688; i <= 1279; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 1424; i <= 1983; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 4352; i <= 4607; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 7680; i <= 7935; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 7936; i <= 8191; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 8192; i <= 10175; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 11904; i <= 12703; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 12800; i <= 19855; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 19968; i <= 40879; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 40960; i <= 42191; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 44032; i <= 55215; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 55296; i <= 57343; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 57344; i <= 63743; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 63744; i <= 64255; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64256; i <= 64284; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64285; i <= 65023; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65072; i <= 65135; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 65136; i <= 65278; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65280; i <= 65519; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            j = this.TableChunkHintZH;
            for (i = 0; i <= 127; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 160; i <= 255; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            _data[161 + j] = fontslot_EastAsia;
            _data[164 + j] = fontslot_EastAsia;
            _data[167 + j] = fontslot_EastAsia;
            _data[168 + j] = fontslot_EastAsia;
            _data[170 + j] = fontslot_EastAsia;
            _data[173 + j] = fontslot_EastAsia;
            _data[175 + j] = fontslot_EastAsia;
            _data[176 + j] = fontslot_EastAsia;
            _data[177 + j] = fontslot_EastAsia;
            _data[178 + j] = fontslot_EastAsia;
            _data[179 + j] = fontslot_EastAsia;
            _data[180 + j] = fontslot_EastAsia;
            _data[182 + j] = fontslot_EastAsia;
            _data[183 + j] = fontslot_EastAsia;
            _data[184 + j] = fontslot_EastAsia;
            _data[185 + j] = fontslot_EastAsia;
            _data[186 + j] = fontslot_EastAsia;
            _data[188 + j] = fontslot_EastAsia;
            _data[189 + j] = fontslot_EastAsia;
            _data[190 + j] = fontslot_EastAsia;
            _data[191 + j] = fontslot_EastAsia;
            _data[215 + j] = fontslot_EastAsia;
            _data[247 + j] = fontslot_EastAsia;
            _data[224 + j] = fontslot_EastAsia;
            _data[225 + j] = fontslot_EastAsia;
            _data[232 + j] = fontslot_EastAsia;
            _data[233 + j] = fontslot_EastAsia;
            _data[234 + j] = fontslot_EastAsia;
            _data[236 + j] = fontslot_EastAsia;
            _data[237 + j] = fontslot_EastAsia;
            _data[242 + j] = fontslot_EastAsia;
            _data[243 + j] = fontslot_EastAsia;
            _data[249 + j] = fontslot_EastAsia;
            _data[250 + j] = fontslot_EastAsia;
            _data[252 + j] = fontslot_EastAsia;
            for (i = 256; i <= 687; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 688; i <= 1279; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 1424; i <= 1983; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 4352; i <= 4607; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 7680; i <= 7935; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 7936; i <= 8191; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 8192; i <= 10175; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 11904; i <= 12703; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 12800; i <= 19855; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 19968; i <= 40879; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 40960; i <= 42191; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 44032; i <= 55215; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 55296; i <= 57343; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 57344; i <= 63743; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 63744; i <= 64255; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64256; i <= 64284; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64285; i <= 65023; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65072; i <= 65135; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 65136; i <= 65278; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65280; i <= 65519; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            j = this.TableChunkHintEACS;
            for (i = 0; i <= 127; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 160; i <= 255; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            _data[161 + j] = fontslot_EastAsia;
            _data[164 + j] = fontslot_EastAsia;
            _data[167 + j] = fontslot_EastAsia;
            _data[168 + j] = fontslot_EastAsia;
            _data[170 + j] = fontslot_EastAsia;
            _data[173 + j] = fontslot_EastAsia;
            _data[175 + j] = fontslot_EastAsia;
            _data[176 + j] = fontslot_EastAsia;
            _data[177 + j] = fontslot_EastAsia;
            _data[178 + j] = fontslot_EastAsia;
            _data[179 + j] = fontslot_EastAsia;
            _data[180 + j] = fontslot_EastAsia;
            _data[182 + j] = fontslot_EastAsia;
            _data[183 + j] = fontslot_EastAsia;
            _data[184 + j] = fontslot_EastAsia;
            _data[185 + j] = fontslot_EastAsia;
            _data[186 + j] = fontslot_EastAsia;
            _data[188 + j] = fontslot_EastAsia;
            _data[189 + j] = fontslot_EastAsia;
            _data[190 + j] = fontslot_EastAsia;
            _data[191 + j] = fontslot_EastAsia;
            _data[215 + j] = fontslot_EastAsia;
            _data[247 + j] = fontslot_EastAsia;
            for (i = 256; i <= 687; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 688; i <= 1279; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 1424; i <= 1983; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 4352; i <= 4607; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 7680; i <= 7935; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 7936; i <= 8191; i++) {
                _data[i + j] = fontslot_HAnsi;
            }
            for (i = 8192; i <= 10175; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 11904; i <= 12703; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 12800; i <= 19855; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 19968; i <= 40879; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 40960; i <= 42191; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 44032; i <= 55215; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 55296; i <= 57343; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 57344; i <= 63743; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 63744; i <= 64255; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64256; i <= 64284; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 64285; i <= 65023; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65072; i <= 65135; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
            for (i = 65136; i <= 65278; i++) {
                _data[i + j] = fontslot_ASCII;
            }
            for (i = 65280; i <= 65519; i++) {
                _data[i + j] = fontslot_EastAsia;
            }
        };
        this.Get_FontClass = function (nUnicode, nHint, nEastAsia_lcid, bCS, bRTL) {
            var _glyph_slot = fontslot_ASCII;
            if (nHint != fonthint_EastAsia) {
                _glyph_slot = this.DetectData.data[nUnicode];
            } else {
                if (nEastAsia_lcid == lcid_zh) {
                    _glyph_slot = this.DetectData.data[this.TableChunkHintZH + nUnicode];
                } else {
                    _glyph_slot = this.DetectData.data[this.TableChunkHintEA + nUnicode];
                }
                if (_glyph_slot == fontslot_EastAsia) {
                    return _glyph_slot;
                }
            }
            if (bCS || bRTL) {
                return fontslot_CS;
            }
            return _glyph_slot;
        };
    }
    window["CDetectFontUse"] = CDetectFontUse;
})(window.document);
var g_font_detector = new CDetectFontUse();
g_font_detector.Init();