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
cFormulaFunction.Logical = {
    "groupName": "Logical",
    "AND": cAND,
    "FALSE": cFALSE,
    "IF": cIF,
    "IFERROR": cIFERROR,
    "NOT": cNOT,
    "OR": cOR,
    "TRUE": cTRUE
};
function cAND() {
    this.name = "AND";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cAND.prototype = Object.create(cBaseFunction.prototype);
cAND.prototype.Calculate = function (arg) {
    var argResult = null;
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
            var argArr = arg[i].getValue();
            for (var j = 0; j < argArr.length; j++) {
                if (argArr[j] instanceof cError) {
                    return this.value = argArr[j];
                } else {
                    if (! (argArr[j] instanceof cString || argArr[j] instanceof cEmpty)) {
                        if (argResult === null) {
                            argResult = argArr[j].tocBool();
                        } else {
                            argResult = new cBool(argResult.value && argArr[j].tocBool().value);
                        }
                        if (argResult.value === false) {
                            return this.value = new cBool(false);
                        }
                    }
                }
            }
        } else {
            if (arg[i] instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                if (arg[i] instanceof cError) {
                    return this.value = arg[i];
                } else {
                    if (arg[i] instanceof cArray) {
                        arg[i].foreach(function (elem) {
                            if (elem instanceof cError) {
                                argResult = elem;
                                return true;
                            } else {
                                if (elem instanceof cString || elem instanceof cEmpty) {
                                    return false;
                                } else {
                                    if (argResult === null) {
                                        argResult = elem.tocBool();
                                    } else {
                                        argResult = new cBool(argResult.value && elem.tocBool().value);
                                    }
                                    if (argResult.value === false) {
                                        return true;
                                    }
                                }
                            }
                        });
                    } else {
                        if (argResult === null) {
                            argResult = arg[i].tocBool();
                        } else {
                            argResult = new cBool(argResult.value && arg[i].tocBool().value);
                        }
                        if (argResult.value === false) {
                            return this.value = new cBool(false);
                        }
                    }
                }
            }
        }
    }
    if (argResult === null) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = argResult;
};
cAND.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(logical1, logical2, ...)"
    };
};
function cFALSE() {
    this.name = "FALSE";
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
cFALSE.prototype = Object.create(cBaseFunction.prototype);
cFALSE.prototype.Calculate = function () {
    return this.value = new cBool(false);
};
cFALSE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "()"
    };
};
function cIF() {
    this.name = "IF";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cIF.prototype = Object.create(cBaseFunction.prototype);
cIF.prototype.Calculate = function (arg) {
    var arg0 = arg[0],
    arg1 = arg[1],
    arg2 = arg[2];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    }
    if (arg1 instanceof cArray) {
        arg1 = arg1.getElement(0);
    }
    if (arg2 instanceof cArray) {
        arg2 = arg2.getElement(0);
    }
    if (arg0 instanceof cError) {
        return this.value = arg0;
    } else {
        arg0 = arg0.tocBool();
        if (arg0 instanceof cString) {
            return this.value = new cError(cErrorType.wrong_value_type);
        } else {
            if (arg0.value) {
                return this.value = arg1 ? arg1 instanceof cEmpty ? new cNumber(0) : arg1 : new cBool(true);
            } else {
                return this.value = arg2 ? arg2 instanceof cEmpty ? new cNumber(0) : arg2 : new cBool(false);
            }
        }
    }
};
cIF.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(logical_test, value_if_true, value_if_false)"
    };
};
function cIFERROR() {
    this.name = "IFERROR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cIFERROR.prototype = Object.create(cBaseFunction.prototype);
cIFERROR.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    }
    if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
        arg0 = arg0.getValue();
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg0 instanceof cError) {
        return this.value = arg[1] instanceof cArray ? arg[1].getElement(0) : arg[1];
    } else {
        return this.value = arg[0];
    }
};
cIFERROR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(value, value_if_error)"
    };
};
function cNOT() {
    this.name = "NOT";
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
cNOT.prototype = Object.create(cBaseFunction.prototype);
cNOT.prototype.Calculate = function (arg) {
    var arg0 = arg[0];
    if (arg0 instanceof cArray) {
        arg0 = arg0.getElement(0);
    }
    if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
        arg0 = arg0.cross(arguments[1].first);
    }
    if (arg0 instanceof cString) {
        var res = arg0.tocBool();
        if (res instanceof cString) {
            return this.value = new cError(cErrorType.wrong_value_type);
        } else {
            return this.value = new cBool(!res.value);
        }
    } else {
        if (arg0 instanceof cError) {
            return this.value = arg0;
        } else {
            return this.value = new cBool(!arg0.tocBool().value);
        }
    }
};
cNOT.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(logical)"
    };
};
function cOR() {
    this.name = "OR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 255;
    this.formatType = {
        def: -1,
        noneFormat: -2
    };
    this.numFormat = this.formatType.def;
}
cOR.prototype = Object.create(cBaseFunction.prototype);
cOR.prototype.Calculate = function (arg) {
    var argResult = null;
    for (var i = 0; i < arg.length; i++) {
        if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
            var argArr = arg[i].getValue();
            for (var j = 0; j < argArr.length; j++) {
                if (argArr[j] instanceof cError) {
                    return this.value = argArr[j];
                } else {
                    if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) {
                        if (argResult === null) {
                            argResult = argArr[j].tocBool();
                        } else {
                            argResult = new cBool(argResult.value || argArr[j].tocBool().value);
                        }
                        if (argResult.value === true) {
                            return this.value = new cBool(true);
                        }
                    }
                }
            }
        } else {
            if (arg[i] instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                if (arg[i] instanceof cError) {
                    return this.value = arg[i];
                } else {
                    if (arg[i] instanceof cArray) {
                        arg[i].foreach(function (elem) {
                            if (elem instanceof cError) {
                                argResult = elem;
                                return true;
                            } else {
                                if (elem instanceof cString || elem instanceof cEmpty) {
                                    return false;
                                } else {
                                    if (argResult === null) {
                                        argResult = elem.tocBool();
                                    } else {
                                        argResult = new cBool(argResult.value || elem.tocBool().value);
                                    }
                                }
                            }
                        });
                    } else {
                        if (argResult == null) {
                            argResult = arg[i].tocBool();
                        } else {
                            argResult = new cBool(argResult.value || arg[i].tocBool().value);
                        }
                        if (argResult.value === true) {
                            return this.value = new cBool(true);
                        }
                    }
                }
            }
        }
    }
    if (argResult == null) {
        return this.value = new cError(cErrorType.wrong_value_type);
    }
    return this.value = argResult;
};
cOR.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "(logical1, logical2, ...)"
    };
};
function cTRUE() {
    this.name = "TRUE";
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
cTRUE.prototype = Object.create(cBaseFunction.prototype);
cTRUE.prototype.Calculate = function () {
    return this.value = new cBool(true);
};
cTRUE.prototype.getInfo = function () {
    return {
        name: this.name,
        args: "()"
    };
};