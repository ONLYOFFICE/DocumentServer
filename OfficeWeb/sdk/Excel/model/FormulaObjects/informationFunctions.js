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
cFormulaFunction.Information = {
    "groupName": "Information",
    "ERROR.TYPE": cERROR_TYPE,
    "ISBLANK": cISBLANK,
    "ISERR": cISERR,
    "ISERROR": cISERROR,
    "ISEVEN": cISEVEN,
    "ISLOGICAL": cISLOGICAL,
    "ISNA": cISNA,
    "ISNONTEXT": cISNONTEXT,
    "ISNUMBER": cISNUMBER,
    "ISODD": cISODD,
    "ISREF": cISREF,
    "ISTEXT": cISTEXT,
    "N": cN,
    "NA": cNA,
    "TYPE": cTYPE
};
function cERROR_TYPE() {
    this.name = "ERROR.TYPE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cERROR_TYPE.prototype = Object.create(cBaseFunction.prototype);
cERROR_TYPE.prototype.Calculate = function (arg) {
    function typeError(elem) {
        if (elem instanceof cError) {
            switch (elem.errorType) {
            case cErrorType.null_value:
                return new cNumber(1);
            case cErrorType.division_by_zero:
                return new cNumber(2);
            case cErrorType.wrong_value_type:
                return new cNumber(3);
            case cErrorType.bad_reference:
                return new cNumber(4);
            case cErrorType.wrong_name:
                return new cNumber(5);
            case cErrorType.not_numeric:
                return new cNumber(6);
            case cErrorType.not_available:
                return new cNumber(7);
            case cErrorType.getting_data:
                return new cNumber(8);
            default:
                return new cError(cErrorType.not_available);
            }
        } else {
            return new cError(cErrorType.not_available);
        }
    }
    var arg0 = arg[0];
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.getValue();
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cArray) {
                var ret = new cArray();
                arg0.foreach(function (elem, r, c) {
                    if (!ret.array[r]) {
                        ret.addRow();
                    }
                    ret.addElement(found_operand);
                });
                return this.value = ret;
            }
        }
    }
    return this.value = typeError(arg0);
};
cERROR_TYPE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISBLANK() {
    this.name = "ISBLANK";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISBLANK.prototype = Object.create(cBaseFunction.prototype);
cISBLANK.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
            arg0 = arg0.getValue();
        }
    }
    if (arg0 instanceof cEmpty) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISBLANK.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISERR() {
    this.name = "ISERR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISERR.prototype = Object.create(cBaseFunction.prototype);
cISERR.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cError && arg0.errorType != cErrorType.not_available) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISERR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISERROR() {
    this.name = "ISERROR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISERROR.prototype = Object.create(cBaseFunction.prototype);
cISERROR.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cError) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISERROR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISEVEN() {
    this.name = "ISEVEN";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISEVEN.prototype = Object.create(cBaseFunction.prototype);
cISEVEN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    var arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        return this.value = new cBool((arg0.getValue() & 1) == 0);
    }
};
cISEVEN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number)"
    };
};
function cISLOGICAL() {
    this.name = "ISLOGICAL";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISLOGICAL.prototype = Object.create(cBaseFunction.prototype);
cISLOGICAL.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cBool) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISLOGICAL.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISNA() {
    this.name = "ISNA";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISNA.prototype = Object.create(cBaseFunction.prototype);
cISNA.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cError && arg0.errorType == cErrorType.not_available) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISNA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISNONTEXT() {
    this.name = "ISNONTEXT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISNONTEXT.prototype = Object.create(cBaseFunction.prototype);
cISNONTEXT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (! (arg0 instanceof cString)) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISNONTEXT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISNUMBER() {
    this.name = "ISNUMBER";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISNUMBER.prototype = Object.create(cBaseFunction.prototype);
cISNUMBER.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cNumber) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISNUMBER.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISODD() {
    this.name = "ISODD";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISODD.prototype = Object.create(cBaseFunction.prototype);
cISODD.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    }
    var arg0 = arg0.tocNumber();
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        return this.value = new cBool((arg0.getValue() & 1) == 1);
    }
};
cISODD.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(number)"
    };
};
function cISREF() {
    this.name = "ISREF";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISREF.prototype = Object.create(cBaseFunction.prototype);
cISREF.prototype.Calculate = function (arg) {
    if ((arg[0] instanceof cRef || arg[0] instanceof cArea || arg[0] instanceof cArea3D || arg[0] instanceof cRef3D) && arg[0].isValid && arg[0].isValid()) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISREF.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cISTEXT() {
    this.name = "ISTEXT";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cISTEXT.prototype = Object.create(cBaseFunction.prototype);
cISTEXT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cString) {
        return this.value = new cBool(true);
    } else {
        return this.value = new cBool(false);
    }
};
cISTEXT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cN() {
    this.name = "N";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.noneFormat;
}
cN.prototype = Object.create(cBaseFunction.prototype);
cN.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        var arr = new cArray();
        arg.foreach(function (elem, r, c) {
            if (elem instanceof cNumber || elem instanceof cError) {
                arr.array[r][c] = elem;
            } else {
                if (elem instanceof cBool) {
                    arr.array[r][c] = elem.tocNumber();
                } else {
                    arr.array[r][c] = new cNumber(0);
                }
            }
        });
        return this.value = arr;
    } else {
        if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
            arg0 = arg0.cross(arguments[1].first);
        } else {
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
            }
        }
    }
    if (arg0 instanceof cNumber || arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        if (arg0 instanceof cBool) {
            return this.value = arg0.tocNumber();
        } else {
            return this.value = new cNumber(0);
        }
    }
};
cN.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};
function cNA() {
    this.name = "NA";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cNA.prototype = Object.create(cBaseFunction.prototype);
cNA.prototype.Calculate = function () {
    return this.value = new cError(cErrorType.not_available);
};
cNA.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "()"
    };
};
function cTYPE() {
    this.name = "TYPE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cTYPE.prototype = Object.create(cBaseFunction.prototype);
cTYPE.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    } else {
        if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
            arg0 = arg0.getValue();
        }
    }
    if (arg0 instanceof cNumber) {
        return this.value = new cNumber(1);
    } else {
        if (arg0 instanceof cString) {
            return this.value = new cNumber(2);
        } else {
            if (arg0 instanceof cBool) {
                return this.value = new cNumber(4);
            } else {
                if (arg0 instanceof cError) {
                    return this.value = new cNumber(16);
                } else {
                    return this.value = new cNumber(64);
                }
            }
        }
    }
};
cTYPE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value)"
    };
};