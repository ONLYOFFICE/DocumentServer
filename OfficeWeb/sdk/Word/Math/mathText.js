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
var DIV_CENT = 0.1386;
var StartTextElement = 11034;
function CMathSize() {
    this.width = 0;
    this.height = 0;
    this.ascent = 0;
}
CMathSize.prototype.SetZero = function () {
    this.width = 0;
    this.height = 0;
    this.ascent = 0;
};
function CMathText(bJDraw) {
    this.Type = para_Math_Text;
    this.bJDraw = (undefined === bJDraw ? false : bJDraw);
    this.value = null;
    this.RecalcInfo = {
        StyleCode: null,
        bAccentIJ: false,
        bSpaceSpecial: false,
        bApostrophe: false,
        bSpecialOperator: false
    };
    this.Parent = null;
    this.size = new CMathSize();
    this.pos = new CMathPosition();
    this.rasterOffsetX = 0;
    this.rasterOffsetY = 0;
    this.GapLeft = 0;
    this.GapRight = 0;
    this.FontSlot = fontslot_ASCII;
}
CMathText.prototype = {
    constructor: CMathText,
    add: function (code) {
        this.value = code;
    },
    addTxt: function (txt) {
        var code = txt.charCodeAt(0);
        this.add(code);
    },
    getCode: function () {
        var code = this.value;
        var bNormal = this.bJDraw ? null : this.Parent.IsNormalText();
        if (this.Type === para_Math_Placeholder || this.bJDraw || bNormal) {
            return code;
        }
        var Compiled_MPrp = this.Parent.GetCompiled_ScrStyles();
        var bAccent = this.Parent.IsAccent();
        var bCapitale = (code > 64 && code < 91),
        bSmall = (code > 96 && code < 123),
        bDigit = (code > 47 && code < 58);
        var bCapGreek = (code > 912 && code < 938),
        bSmallGreek = (code > 944 && code < 970);
        var Scr = Compiled_MPrp.scr,
        Sty = Compiled_MPrp.sty;
        if (code == 42) {
            code = 8727;
        } else {
            if (code == 45) {
                code = 8722;
            } else {
                if (Scr == TXT_ROMAN) {
                    if (Sty == STY_ITALIC) {
                        if (code == 104) {
                            code = 8462;
                        } else {
                            if (code == 105 && bAccent) {
                                code = 2835;
                            } else {
                                if (code == 106 && bAccent) {
                                    code = 2836;
                                } else {
                                    if (bCapitale) {
                                        code = code + 119795;
                                    } else {
                                        if (bSmall) {
                                            code = code + 119789;
                                        } else {
                                            if (code == 1012) {
                                                code = 120563;
                                            } else {
                                                if (code == 8711) {
                                                    code = 120571;
                                                } else {
                                                    if (bCapGreek) {
                                                        code = code + 119633;
                                                    } else {
                                                        if (bSmallGreek) {
                                                            code = code + 119627;
                                                        } else {
                                                            if (code == 8706) {
                                                                code = 120597;
                                                            } else {
                                                                if (code == 1013) {
                                                                    code = 120598;
                                                                } else {
                                                                    if (code == 977) {
                                                                        code = 120599;
                                                                    } else {
                                                                        if (code == 1008) {
                                                                            code = 120600;
                                                                        } else {
                                                                            if (code == 981) {
                                                                                code = 120601;
                                                                            } else {
                                                                                if (code == 1009) {
                                                                                    code = 120602;
                                                                                } else {
                                                                                    if (code == 982) {
                                                                                        code = 120603;
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
                    } else {
                        if (Sty == STY_BI) {
                            if (code == 105 && bAccent) {
                                code = 2841;
                            } else {
                                if (code == 106 && bAccent) {
                                    code = 2842;
                                } else {
                                    if (bCapitale) {
                                        code = code + 119847;
                                    } else {
                                        if (bSmall) {
                                            code = code + 119841;
                                        } else {
                                            if (bDigit) {
                                                code = code + 120734;
                                            } else {
                                                if (code == 1012) {
                                                    code = 120621;
                                                } else {
                                                    if (code == 8711) {
                                                        code = 120629;
                                                    } else {
                                                        if (bCapGreek) {
                                                            code = code + 119691;
                                                        } else {
                                                            if (bSmallGreek) {
                                                                code = code + 119685;
                                                            } else {
                                                                if (code == 8706) {
                                                                    code = 120655;
                                                                } else {
                                                                    if (code == 1013) {
                                                                        code = 120656;
                                                                    } else {
                                                                        if (code == 977) {
                                                                            code = 120657;
                                                                        } else {
                                                                            if (code == 1008) {
                                                                                code = 120658;
                                                                            } else {
                                                                                if (code == 981) {
                                                                                    code = 120659;
                                                                                } else {
                                                                                    if (code == 1009) {
                                                                                        code = 120660;
                                                                                    } else {
                                                                                        if (code == 982) {
                                                                                            code = 120661;
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
                        } else {
                            if (Sty == STY_BOLD) {
                                if (code == 105 && bAccent) {
                                    code = 2829;
                                } else {
                                    if (code == 106 && bAccent) {
                                        code = 2830;
                                    } else {
                                        if (bCapitale) {
                                            code = code + 119743;
                                        } else {
                                            if (bSmall) {
                                                code = code + 119737;
                                            } else {
                                                if (bDigit) {
                                                    code = code + 120734;
                                                } else {
                                                    if (code == 1012) {
                                                        code = 120505;
                                                    } else {
                                                        if (code == 8711) {
                                                            code = 120513;
                                                        } else {
                                                            if (bCapGreek) {
                                                                code = code + 119575;
                                                            } else {
                                                                if (bSmallGreek) {
                                                                    code = code + 119569;
                                                                } else {
                                                                    if (code == 8706) {
                                                                        code = 120539;
                                                                    } else {
                                                                        if (code == 1013) {
                                                                            code = 120540;
                                                                        } else {
                                                                            if (code == 977) {
                                                                                code = 120541;
                                                                            } else {
                                                                                if (code == 1008) {
                                                                                    code = 120542;
                                                                                } else {
                                                                                    if (code == 981) {
                                                                                        code = 120543;
                                                                                    } else {
                                                                                        if (code == 1009) {
                                                                                            code = 120544;
                                                                                        } else {
                                                                                            if (code == 982) {
                                                                                                code = 120545;
                                                                                            } else {
                                                                                                if (code == 988) {
                                                                                                    code = 120778;
                                                                                                } else {
                                                                                                    if (code == 989) {
                                                                                                        code = 120779;
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
                            } else {
                                if (bAccent) {
                                    if (code == 105 && bAccent) {
                                        code = 199;
                                    } else {
                                        if (code == 106 && bAccent) {
                                            code = 2828;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (Scr == TXT_DOUBLE_STRUCK) {
                        if (code == 105 && bAccent) {
                            code = 2851;
                        } else {
                            if (code == 106 && bAccent) {
                                code = 2852;
                            } else {
                                if (code == 67) {
                                    code = 8450;
                                } else {
                                    if (code == 72) {
                                        code = 8461;
                                    } else {
                                        if (code == 78) {
                                            code = 8469;
                                        } else {
                                            if (code == 80) {
                                                code = 8473;
                                            } else {
                                                if (code == 81) {
                                                    code = 8474;
                                                } else {
                                                    if (code == 82) {
                                                        code = 8477;
                                                    } else {
                                                        if (code == 90) {
                                                            code = 8484;
                                                        } else {
                                                            if (bCapitale) {
                                                                code = code + 120055;
                                                            } else {
                                                                if (bSmall) {
                                                                    code = code + 120049;
                                                                } else {
                                                                    if (bDigit) {
                                                                        code = code + 120744;
                                                                    } else {
                                                                        if (code == 1576) {
                                                                            code = 126625;
                                                                        } else {
                                                                            if (code == 1580) {
                                                                                code = 126626;
                                                                            } else {
                                                                                if (code == 1583) {
                                                                                    code = 126627;
                                                                                } else {
                                                                                    if (code == 1608) {
                                                                                        code = 126629;
                                                                                    } else {
                                                                                        if (code == 1586) {
                                                                                            code = 126630;
                                                                                        } else {
                                                                                            if (code == 1581) {
                                                                                                code = 126631;
                                                                                            } else {
                                                                                                if (code == 1591) {
                                                                                                    code = 126632;
                                                                                                } else {
                                                                                                    if (code == 1610) {
                                                                                                        code = 126633;
                                                                                                    } else {
                                                                                                        if (code == 1604) {
                                                                                                            code = 126635;
                                                                                                        } else {
                                                                                                            if (code == 1605) {
                                                                                                                code = 126636;
                                                                                                            } else {
                                                                                                                if (code == 1606) {
                                                                                                                    code = 126637;
                                                                                                                } else {
                                                                                                                    if (code == 1587) {
                                                                                                                        code = 126638;
                                                                                                                    } else {
                                                                                                                        if (code == 1593) {
                                                                                                                            code = 126639;
                                                                                                                        } else {
                                                                                                                            if (code == 1601) {
                                                                                                                                code = 126640;
                                                                                                                            } else {
                                                                                                                                if (code == 1589) {
                                                                                                                                    code = 126641;
                                                                                                                                } else {
                                                                                                                                    if (code == 1602) {
                                                                                                                                        code = 126642;
                                                                                                                                    } else {
                                                                                                                                        if (code == 1585) {
                                                                                                                                            code = 126643;
                                                                                                                                        } else {
                                                                                                                                            if (code == 1588) {
                                                                                                                                                code = 126644;
                                                                                                                                            } else {
                                                                                                                                                if (code == 1578) {
                                                                                                                                                    code = 126645;
                                                                                                                                                } else {
                                                                                                                                                    if (code == 1579) {
                                                                                                                                                        code = 126646;
                                                                                                                                                    } else {
                                                                                                                                                        if (code == 1582) {
                                                                                                                                                            code = 126647;
                                                                                                                                                        } else {
                                                                                                                                                            if (code == 1584) {
                                                                                                                                                                code = 126648;
                                                                                                                                                            } else {
                                                                                                                                                                if (code == 1590) {
                                                                                                                                                                    code = 126649;
                                                                                                                                                                } else {
                                                                                                                                                                    if (code == 1592) {
                                                                                                                                                                        code = 126650;
                                                                                                                                                                    } else {
                                                                                                                                                                        if (code == 1594) {
                                                                                                                                                                            code = 126651;
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
                    } else {
                        if (Scr == TXT_MONOSPACE) {
                            if (code == 105 && bAccent) {
                                code = 4547;
                            } else {
                                if (code == 106 && bAccent) {
                                    code = 4548;
                                } else {
                                    if (bCapitale) {
                                        code = code + 120367;
                                    } else {
                                        if (bSmall) {
                                            code = code + 120361;
                                        } else {
                                            if (bDigit) {
                                                code = code + 120774;
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (Scr == TXT_FRAKTUR) {
                                if (Sty == STY_BOLD || Sty == STY_BI) {
                                    if (code == 105 && bAccent) {
                                        code = 2849;
                                    } else {
                                        if (code == 106 && bAccent) {
                                            code = 2850;
                                        } else {
                                            if (bCapitale) {
                                                code = code + 120107;
                                            } else {
                                                if (bSmall) {
                                                    code = code + 120101;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (code == 105 && bAccent) {
                                        code = 2847;
                                    } else {
                                        if (code == 106 && bAccent) {
                                            code = 2848;
                                        } else {
                                            if (code == 67) {
                                                code = 8493;
                                            } else {
                                                if (code == 72) {
                                                    code = 8460;
                                                } else {
                                                    if (code == 73) {
                                                        code = 8465;
                                                    } else {
                                                        if (code == 82) {
                                                            code = 8476;
                                                        } else {
                                                            if (code == 90) {
                                                                code = 8488;
                                                            } else {
                                                                if (bCapitale) {
                                                                    code = code + 120003;
                                                                } else {
                                                                    if (bSmall) {
                                                                        code = code + 119997;
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
                            } else {
                                if (Scr == TXT_SANS_SERIF) {
                                    if (Sty == STY_ITALIC) {
                                        if (code == 105 && bAccent) {
                                            code = 2857;
                                        } else {
                                            if (code == 106 && bAccent) {
                                                code = 2858;
                                            } else {
                                                if (bCapitale) {
                                                    code = code + 120263;
                                                } else {
                                                    if (bSmall) {
                                                        code = code + 120257;
                                                    } else {
                                                        if (bDigit) {
                                                            code = code + 120754;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (Sty == STY_BOLD) {
                                            if (code == 105 && bAccent) {
                                                code = 2855;
                                            } else {
                                                if (code == 106 && bAccent) {
                                                    code = 2856;
                                                } else {
                                                    if (bCapitale) {
                                                        code = code + 120211;
                                                    } else {
                                                        if (bSmall) {
                                                            code = code + 120205;
                                                        } else {
                                                            if (bDigit) {
                                                                code = code + 120764;
                                                            } else {
                                                                if (code == 1012) {
                                                                    code = 120679;
                                                                } else {
                                                                    if (code == 8711) {
                                                                        code = 120687;
                                                                    } else {
                                                                        if (bCapGreek) {
                                                                            code = code + 119749;
                                                                        } else {
                                                                            if (bSmallGreek) {
                                                                                code = code + 119743;
                                                                            } else {
                                                                                if (code == 8706) {
                                                                                    code = 120713;
                                                                                } else {
                                                                                    if (code == 1013) {
                                                                                        code = 120714;
                                                                                    } else {
                                                                                        if (code == 977) {
                                                                                            code = 120715;
                                                                                        } else {
                                                                                            if (code == 1008) {
                                                                                                code = 120716;
                                                                                            } else {
                                                                                                if (code == 981) {
                                                                                                    code = 120717;
                                                                                                } else {
                                                                                                    if (code == 1009) {
                                                                                                        code = 120718;
                                                                                                    } else {
                                                                                                        if (code == 982) {
                                                                                                            code = 120719;
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
                                        } else {
                                            if (Sty == STY_BI) {
                                                if (code == 105 && bAccent) {
                                                    code = 2859;
                                                } else {
                                                    if (code == 106 && bAccent) {
                                                        code = 2860;
                                                    } else {
                                                        if (bCapitale) {
                                                            code = code + 120315;
                                                        } else {
                                                            if (bSmall) {
                                                                code = code + 120309;
                                                            } else {
                                                                if (bDigit) {
                                                                    code = code + 120764;
                                                                } else {
                                                                    if (code == 1012) {
                                                                        code = 120737;
                                                                    } else {
                                                                        if (code == 8711) {
                                                                            code = 120745;
                                                                        } else {
                                                                            if (bCapGreek) {
                                                                                code = code + 119807;
                                                                            } else {
                                                                                if (bSmallGreek) {
                                                                                    code = code + 119801;
                                                                                } else {
                                                                                    if (code == 8706) {
                                                                                        code = 120771;
                                                                                    } else {
                                                                                        if (code == 1013) {
                                                                                            code = 120772;
                                                                                        } else {
                                                                                            if (code == 977) {
                                                                                                code = 1169349;
                                                                                            } else {
                                                                                                if (code == 1008) {
                                                                                                    code = 120774;
                                                                                                } else {
                                                                                                    if (code == 981) {
                                                                                                        code = 120775;
                                                                                                    } else {
                                                                                                        if (code == 1009) {
                                                                                                            code = 120776;
                                                                                                        } else {
                                                                                                            if (code == 982) {
                                                                                                                code = 120777;
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
                                            } else {
                                                if (code == 105 && bAccent) {
                                                    code = 2853;
                                                } else {
                                                    if (code == 106 && bAccent) {
                                                        code = 2854;
                                                    } else {
                                                        if (bCapitale) {
                                                            code = code + 120159;
                                                        } else {
                                                            if (bSmall) {
                                                                code = code + 120153;
                                                            } else {
                                                                if (bDigit) {
                                                                    code = code + 120754;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (Scr == TXT_SCRIPT) {
                                        if (Sty == STY_ITALIC || Sty == STY_PLAIN) {
                                            if (code == 105 && bAccent) {
                                                code = 2843;
                                            } else {
                                                if (code == 106 && bAccent) {
                                                    code = 2844;
                                                } else {
                                                    if (code == 66) {
                                                        code = 8492;
                                                    } else {
                                                        if (code == 69) {
                                                            code = 8496;
                                                        } else {
                                                            if (code == 70) {
                                                                code = 8497;
                                                            } else {
                                                                if (code == 72) {
                                                                    code = 8459;
                                                                } else {
                                                                    if (code == 73) {
                                                                        code = 8464;
                                                                    } else {
                                                                        if (code == 76) {
                                                                            code = 8466;
                                                                        } else {
                                                                            if (code == 77) {
                                                                                code = 8499;
                                                                            } else {
                                                                                if (code == 82) {
                                                                                    code = 8475;
                                                                                } else {
                                                                                    if (code == 101) {
                                                                                        code = 8495;
                                                                                    } else {
                                                                                        if (code == 103) {
                                                                                            code = 8458;
                                                                                        } else {
                                                                                            if (code == 111) {
                                                                                                code = 8500;
                                                                                            } else {
                                                                                                if (bCapitale) {
                                                                                                    code = code + 119899;
                                                                                                } else {
                                                                                                    if (bSmall) {
                                                                                                        code = code + 119893;
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
                                        } else {
                                            if (code == 105 && bAccent) {
                                                code = 2845;
                                            } else {
                                                if (code == 106 && bAccent) {
                                                    code = 2846;
                                                } else {
                                                    if (bCapitale) {
                                                        code = code + 119951;
                                                    } else {
                                                        if (bSmall) {
                                                            code = code + 119945;
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
        return code;
    },
    getCodeChr: function () {
        return this.value;
    },
    fillPlaceholders: function () {
        this.Type = para_Math_Placeholder;
        this.value = StartTextElement;
    },
    Resize: function (oMeasure, RPI, InfoTextPr) {
        var metricsTxt;
        if (this.bJDraw) {
            this.RecalcInfo.StyleCode = this.value;
            metricsTxt = oMeasure.Measure2Code(this.value);
        } else {
            var ascent, width, height, descent;
            this.FontSlot = InfoTextPr.GetFontSlot(this.value);
            var letter = this.getCode();
            var bAccentIJ = !InfoTextPr.bNormalText && this.Parent.IsAccent() && (this.value == 105 || this.value == 106);
            this.RecalcInfo.StyleCode = letter;
            this.RecalcInfo.bAccentIJ = bAccentIJ;
            if (bAccentIJ || this.RecalcInfo.bApostrophe) {
                oMeasure.SetStringGid(true);
            }
            if (InfoTextPr.NeedUpdateFont(this.value, this.FontSlot, this.IsPlaceholder())) {
                g_oTextMeasurer.SetFont(InfoTextPr.Font);
            } else {
                if (InfoTextPr.CurrType == MathTextInfo_NormalText) {
                    var FontKoef = InfoTextPr.GetFontKoef(this.FontSlot);
                    g_oTextMeasurer.SetFontSlot(this.FontSlot, FontKoef);
                }
            }
            metricsTxt = oMeasure.MeasureCode(letter);
            if (bAccentIJ || this.RecalcInfo.bApostrophe) {
                oMeasure.SetStringGid(false);
            }
        }
        if (letter == 8289) {
            width = 0;
            height = 0;
            ascent = 0;
            this.RecalcInfo.bSpaceSpecial = true;
        } else {
            this.rasterOffsetX = metricsTxt.rasterOffsetX;
            this.rasterOffsetY = metricsTxt.rasterOffsetY;
            ascent = metricsTxt.Ascent;
            descent = (metricsTxt.Height - metricsTxt.Ascent);
            height = ascent + descent;
            if (this.bJDraw) {
                width = metricsTxt.WidthG;
            } else {
                width = metricsTxt.Width;
            }
        }
        this.size.width = this.GapLeft + this.GapRight + width;
        this.size.height = height;
        this.size.ascent = ascent;
    },
    PreRecalc: function (Parent, ParaMath, ArgSize, RPI) {
        if (!this.bJDraw) {
            this.Parent = Parent;
        } else {
            this.Parent = null;
        }
    },
    Get_WidthVisible: function () {
        return this.size.width;
    },
    draw: function (x, y, pGraphics, InfoTextPr) {
        var X = this.pos.x + x,
        Y = this.pos.y + y;
        if (this.bJDraw) {
            pGraphics.FillTextCode(X, Y, this.RecalcInfo.StyleCode);
        } else {
            if (this.RecalcInfo.bSpaceSpecial == false) {
                if (InfoTextPr.NeedUpdateFont(this.value, this.FontSlot, this.IsPlaceholder())) {
                    pGraphics.SetFont(InfoTextPr.Font);
                } else {
                    if (InfoTextPr.CurrType == MathTextInfo_NormalText) {
                        var FontKoef = InfoTextPr.GetFontKoef(this.FontSlot);
                        pGraphics.SetFontSlot(this.FontSlot, FontKoef);
                    }
                }
                if (this.RecalcInfo.bAccentIJ || this.RecalcInfo.bApostrophe) {
                    pGraphics.tg(this.RecalcInfo.StyleCode, X, Y);
                } else {
                    pGraphics.FillTextCode(X, Y, this.RecalcInfo.StyleCode);
                }
            }
        }
    },
    setPosition: function (pos) {
        try {
            if (!this.bJDraw) {
                this.pos.x = pos.x + this.GapLeft;
                this.pos.y = pos.y;
            } else {
                this.pos.x = pos.x - this.rasterOffsetX;
                this.pos.y = pos.y - this.rasterOffsetY + this.size.ascent;
            }
        } catch(e) {}
    },
    getInfoLetter: function (Info) {
        var code = this.value;
        var bCapitale = (code > 64 && code < 91),
        bSmall = (code > 96 && code < 123) || code == 305 || code == 567;
        Info.Latin = bCapitale || bSmall;
        var bCapGreek = (code > 912 && code < 938),
        bSmallGreek = (code > 944 && code < 970);
        Info.Greek = bCapGreek || bSmallGreek;
    },
    setCoeffTransform: function (sx, shx, shy, sy) {
        this.transform = {
            sx: sx,
            shx: shx,
            shy: shy,
            sy: sy
        };
        this.applyTransformation();
    },
    applyTransformation: function () {
        var sx = this.transform.sx,
        shx = this.transform.shx,
        shy = this.transform.shy,
        sy = this.transform.sy;
        sy = (sy < 0) ? -sy : sy;
        this.size.width = this.size.width * sx + (-1) * this.size.width * shx;
        this.size.height = this.size.height * sy + this.size.height * shy;
        this.size.ascent = this.size.ascent * (sy + shy);
        this.size.descent = this.size.descent * (sy + shy);
        this.size.center = this.size.center * (sy + shy);
    },
    IsJustDraw: function () {
        return this.bJDraw;
    },
    relate: function (parent) {
        this.Parent = parent;
    },
    IsPlaceholder: function () {
        return this.Type == para_Math_Placeholder;
    },
    IsAlignPoint: function () {
        return false;
    },
    IsText: function () {
        return true;
    },
    Is_Punctuation: function () {
        var bPunc = 1 === g_aPunctuation[this.value],
        bMathSign = this.value == 8727 || this.value == 8722;
        return bPunc || bMathSign;
    },
    Is_NBSP: function () {
        return false;
    },
    Is_SpecilalOperator: function () {
        var val = this.value,
        bSpecialOperator = val == 33 || val == 35 || (val >= 40 && val <= 47) || (val >= 58 && val <= 63) || (val >= 91 && val <= 95) || (val >= 123 && val <= 161) || val == 172 || val == 177 || val == 183 || val == 191 || val == 215 || val == 247 || (val >= 8208 && val <= 8212) || val == 8214 || (val >= 8224 && val <= 8226) || val == 8230,
        bSpecialArrow = val >= 8592 && val <= 8703,
        bSpecialSymbols = val == 8704 || val == 8705 || val == 8707 || val == 8708 || val == 8710 || (val >= 8712 && val <= 8717) || (val >= 8719 && val <= 8734) || (val >= 8739 && val <= 8766) || (val >= 8767 && val <= 8893) || (val >= 8896 && val <= 8959) || val == 8965 || val == 8966 || (val >= 8968 && val <= 8971) || (val >= 8988 && val <= 8991) || val == 8994 || val == 8995 || val == 9001 || val == 9002 || val == 9023 || val == 9136 || val == 9137,
        bOtherArrows = (val >= 10193 && val <= 10624) || (val >= 10626 && val <= 10650) || (val >= 10678 && val <= 10681) || val == 10688 || val == 10689 || (val >= 10692 && val <= 10696) || (val >= 10702 && val <= 10715) || val == 10719 || (val >= 10721 && val <= 10726) || val == 10731 || (val >= 10740 && val <= 11007 && val !== 10977 && val !== 10993) || (val >= 12308 && val <= 12311);
        return bSpecialOperator || bSpecialArrow || bSpecialSymbols || bOtherArrows;
    },
    Copy: function () {
        var NewLetter = new CMathText(this.bJDraw);
        NewLetter.Type = this.Type;
        NewLetter.value = this.value;
        return NewLetter;
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
        Writer.WriteLong(this.Type);
        Writer.WriteLong(this.value);
    },
    Read_FromBinary: function (Reader) {
        this.Type = Reader.GetLong();
        this.value = Reader.GetLong();
    }
};
function CMathAmp() {
    this.bEqqArray = false;
    this.Type = para_Math_Ampersand;
    this.GapLeft = 0;
    this.GapRight = 0;
    this.pos = new CMathPosition();
    this.AmpText = new CMathText(false);
    this.AmpText.add(38);
    this.size = null;
    this.Parent = null;
}
CMathAmp.prototype = {
    Resize: function (oMeasure, RPI, InfoTextPr) {
        this.bEqqArray = RPI.bEqqArray;
        this.AmpText.Resize(oMeasure, RPI, InfoTextPr);
        if (this.bEqqArray) {
            this.size = {
                width: 0,
                height: 0,
                ascent: 0
            };
        } else {
            this.size = {
                width: this.AmpText.size.width + this.GapLeft + this.GapRight,
                height: this.AmpText.size.height,
                ascent: this.AmpText.size.ascent
            };
        }
    },
    PreRecalc: function (Parent, ParaMath, ArgSize, RPI) {
        this.Parent = Parent;
        this.AmpText.PreRecalc(Parent, ParaMath, ArgSize, RPI);
    },
    getCodeChr: function () {
        var code = null;
        if (!this.bEqqArray) {
            code = this.AmpText.getCodeChr();
        }
        return code;
    },
    IsText: function () {
        return !this.bEqqArray;
    },
    Get_WidthVisible: function () {
        return this.size.width;
    },
    setPosition: function (pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        if (this.bEqqArray == false) {
            this.AmpText.setPosition(pos);
        }
    },
    draw: function (x, y, pGraphics, InfoTextPr) {
        if (this.bEqqArray == false) {
            this.AmpText.draw(x + this.GapLeft, y, pGraphics, InfoTextPr);
        } else {
            if (editor.ShowParaMarks) {
                var X = x + this.pos.x + this.size.width,
                Y = y + this.pos.y,
                Y2 = y + this.pos.y - this.AmpText.size.height;
                pGraphics.drawVerLine(0, X, Y, Y2, 0.1);
            }
        }
    },
    IsPlaceholder: function () {
        return false;
    },
    GetCompiled_ScrStyles: function () {
        return this.Parent.GetCompiled_ScrStyles();
    },
    IsAccent: function () {
        return this.Parent.IsAccent();
    },
    IsAlignPoint: function () {
        return this.bEqqArray;
    },
    Copy: function () {
        return new CMathAmp();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
    },
    Read_FromBinary: function (Reader) {}
};
var MathFont_ForMathText = 1;
var MathFont_ForSpecialOperator = 2;
function GetMathModifiedFont(type, TextPr, Class) {
    var NewMathTextPr = new CTextPr();
    if (type == MathFont_ForMathText) {
        NewMathTextPr.RFonts = TextPr.RFonts;
        NewMathTextPr.FontFamily = TextPr.FontFamily;
        NewMathTextPr.Bold = TextPr.Bold;
        NewMathTextPr.Italic = TextPr.Italic;
        NewMathTextPr.FontSize = MathApplyArgSize(TextPr.FontSize, Class.Parent.Compiled_ArgSz.value);
        NewMathTextPr.CS = TextPr.CS;
        NewMathTextPr.bRTL = TextPr.RTL;
        NewMathTextPr.Lang = TextPr.Lang;
        if (!Class.IsNormalText()) {
            NewMathTextPr.Italic = false;
            NewMathTextPr.Bold = false;
        }
    } else {
        if (type == MathFont_ForSpecialOperator) {
            NewMathTextPr.FontFamily = {
                Name: "Cambria Math",
                Index: -1
            };
            NewMathTextPr.RFonts.Set_All("Cambria Math", -1);
            NewMathTextPr.FontSize = TextPr.FontSize;
            NewMathTextPr.Bold = TextPr.Bold;
            NewMathTextPr.Italic = TextPr.Italic;
        }
    }
    return NewMathTextPr;
}
function CMathInfoTextPr(TextPr, ArgSize, bNormalText, Theme) {
    this.BFirstSetTextPr = true;
    this.TextPr = new CTextPr();
    this.CurrentTextPr = new CTextPr();
    this.bNormalText = bNormalText;
    this.bSpecialOperator = false;
    this.Theme = Theme;
    this.RFontsCompare = [];
    this.SetTextPr(TextPr, ArgSize);
}
CMathInfoTextPr.prototype.SetTextPr = function (TextPr, ArgSize) {
    this.TextPr.RFonts = TextPr.RFonts;
    this.TextPr.FontFamily = TextPr.FontFamily;
    this.TextPr.Bold = TextPr.Bold;
    this.TextPr.Italic = TextPr.Italic;
    this.TextPr.FontSize = MathApplyArgSize(TextPr.FontSize, ArgSize);
    this.TextPr.CS = TextPr.CS;
    this.TextPr.RTL = TextPr.RTL;
    this.TextPr.Lang = TextPr.Lang;
    this.RFontsCompare[fontslot_ASCII] = undefined !== this.TextPr.RFonts.Ascii && this.TextPr.RFonts.Ascii.Name == "Cambria Math";
    this.RFontsCompare[fontslot_HAnsi] = undefined !== this.TextPr.RFonts.HAnsi && this.TextPr.RFonts.HAnsi.Name == "Cambria Math";
    this.RFontsCompare[fontslot_CS] = undefined !== this.TextPr.RFonts.CS && this.TextPr.RFonts.CS.Name == "Cambria Math";
    this.RFontsCompare[fontslot_EastAsia] = undefined !== this.TextPr.RFonts.EastAsia && this.TextPr.RFonts.EastAsia.Name == "Cambria Math";
    this.CurrentTextPr.Merge(this.TextPr);
};
CMathInfoTextPr.prototype.NeedUpdateTextPrp = function (code, fontSlot, IsPlaceholder) {
    var NeedUpdate = false;
    if (this.BFirstSetTextPr == true) {
        this.BFirstSetTextPr = false;
        NeedUpdate = true;
    }
    if (this.bNormalText == false || IsPlaceholder) {
        var BoldItalicForMath = this.RFontsCompare[fontSlot] == true && (this.CurrentTextPr.Bold !== false || this.CurrentTextPr.Italic !== false),
        BoldItalicForOther = this.RFontsCompare[fontSlot] == false && (this.CurrentTextPr.Bold !== this.TextPr.Bold || this.CurrentTextPr.Italic !== this.TextPr.Italic);
        var BoldItalicPlh = IsPlaceholder && (this.CurrentTextPr.Bold !== false || this.CurrentTextPr.Italic !== false);
        if (BoldItalicForMath || BoldItalicPlh) {
            this.CurrentTextPr.Italic = false;
            this.CurrentTextPr.Bold = false;
            NeedUpdate = true;
        } else {
            if (BoldItalicForOther) {
                this.CurrentTextPr.Bold = this.TextPr.Bold;
                this.CurrentTextPr.Italic = this.TextPr.Italic;
                NeedUpdate = true;
            }
        }
        var checkSpOperator = Math_Is_SpecilalOperator(code),
        IsPlh = IsPlaceholder && this.RFontsCompare[fontSlot] == false;
        if (checkSpOperator !== this.bSpecialOperator || IsPlh) {
            if (checkSpOperator == false) {
                this.CurrentTextPr.FontFamily = this.TextPr.FontFamily;
                this.CurrentTextPr.RFonts.Set_FromObject(this.TextPr.RFonts);
                this.bSpecialOperator = false;
                NeedUpdate = true;
            } else {
                if (this.RFontsCompare[fontSlot] == false) {
                    this.CurrentTextPr.FontFamily = {
                        Name: "Cambria Math",
                        Index: -1
                    };
                    this.CurrentTextPr.RFonts.Set_All("Cambria Math", -1);
                    this.bSpecialOperator = true;
                    NeedUpdate = true;
                }
            }
        }
    }
    return NeedUpdate;
};
CMathInfoTextPr.prototype.GetFontSlot = function (code) {
    var Hint = this.TextPr.RFonts.Hint;
    var bCS = this.TextPr.CS;
    var bRTL = this.TextPr.RTL;
    var lcid = this.TextPr.Lang.EastAsia;
    return g_font_detector.Get_FontClass(code, Hint, lcid, bCS, bRTL);
};
var MathTextInfo_MathText = 1;
var MathTextInfo_SpecialOperator = 2;
var MathTextInfo_NormalText = 3;
function CMathInfoTextPr_2(TextPr, ArgSize, bNormalText) {
    this.CurrType = -1;
    this.TextPr = TextPr;
    this.ArgSize = ArgSize;
    this.Font = {
        FontFamily: {
            Name: "Cambria Math",
            Index: -1
        },
        FontSize: TextPr.FontSize,
        Italic: false,
        Bold: false
    };
    this.bNormalText = bNormalText;
    this.RFontsCompare = [];
    this.RFontsCompare[fontslot_ASCII] = undefined !== this.TextPr.RFonts.Ascii && this.TextPr.RFonts.Ascii.Name == "Cambria Math";
    this.RFontsCompare[fontslot_HAnsi] = undefined !== this.TextPr.RFonts.HAnsi && this.TextPr.RFonts.HAnsi.Name == "Cambria Math";
    this.RFontsCompare[fontslot_CS] = undefined !== this.TextPr.RFonts.CS && this.TextPr.RFonts.CS.Name == "Cambria Math";
    this.RFontsCompare[fontslot_EastAsia] = undefined !== this.TextPr.RFonts.EastAsia && this.TextPr.RFonts.EastAsia.Name == "Cambria Math";
}
CMathInfoTextPr_2.prototype.NeedUpdateFont = function (code, fontSlot, IsPlaceholder) {
    var NeedUpdateFont = false;
    var bMathText = this.bNormalText == false || IsPlaceholder;
    var Type;
    if (bMathText && (this.RFontsCompare[fontSlot] == true || IsPlaceholder)) {
        Type = MathTextInfo_MathText;
    } else {
        if (bMathText && this.RFontsCompare[fontSlot] == false && this.IsSpecilalOperator(code)) {
            Type = MathTextInfo_SpecialOperator;
        } else {
            Type = MathTextInfo_NormalText;
        }
    }
    var bChangeType = this.CurrType !== MathTextInfo_MathText && this.CurrType !== MathTextInfo_SpecialOperator;
    if (bChangeType && Type !== MathTextInfo_NormalText) {
        this.Font.FontSize = fontSlot !== fontslot_CS ? this.TextPr.FontSize : this.TextPr.FontSizeCS;
        this.Font.FontSize *= this.GetFontKoef(fontSlot);
        NeedUpdateFont = true;
    }
    this.CurrType = Type;
    return NeedUpdateFont;
};
CMathInfoTextPr_2.prototype.GetFontKoef = function (fontSlot) {
    var FontSize = fontSlot == fontslot_CS ? this.TextPr.FontSizeCS : this.TextPr.FontSize;
    return MatGetKoeffArgSize(FontSize, this.ArgSize);
};
CMathInfoTextPr_2.prototype.GetFontSlot = function (code) {
    var Hint = this.TextPr.RFonts.Hint;
    var bCS = this.TextPr.CS;
    var bRTL = this.TextPr.RTL;
    var lcid = this.TextPr.Lang.EastAsia;
    return g_font_detector.Get_FontClass(code, Hint, lcid, bCS, bRTL);
};
CMathInfoTextPr_2.prototype.IsSpecilalOperator = function (val) {
    var bSpecialOperator = val == 33 || val == 35 || (val >= 40 && val <= 47) || (val >= 58 && val <= 63) || (val >= 91 && val <= 95) || (val >= 123 && val <= 161) || val == 172 || val == 177 || val == 183 || val == 191 || val == 215 || val == 247 || (val >= 8208 && val <= 8212) || val == 8214 || (val >= 8224 && val <= 8226) || val == 8230,
    bSpecialArrow = val >= 8592 && val <= 8703,
    bSpecialSymbols = val == 8704 || val == 8705 || val == 8707 || val == 8708 || val == 8710 || (val >= 8712 && val <= 8717) || (val >= 8719 && val <= 8734) || (val >= 8739 && val <= 8766) || (val >= 8767 && val <= 8893) || (val >= 8896 && val <= 8959) || val == 8965 || val == 8966 || (val >= 8968 && val <= 8971) || (val >= 8988 && val <= 8991) || val == 8994 || val == 8995 || val == 9001 || val == 9002 || val == 9023 || val == 9136 || val == 9137,
    bOtherArrows = (val >= 10193 && val <= 10624) || (val >= 10626 && val <= 10650) || (val >= 10678 && val <= 10681) || val == 10688 || val == 10689 || (val >= 10692 && val <= 10696) || (val >= 10702 && val <= 10715) || val == 10719 || (val >= 10721 && val <= 10726) || val == 10731 || (val >= 10740 && val <= 11007 && val !== 10977 && val !== 10993) || (val >= 12308 && val <= 12311);
    return bSpecialOperator || bSpecialArrow || bSpecialSymbols || bOtherArrows;
};