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
 cFormulaFunction.Logical = {
    "groupName": "Logical",
    "AND": function () {
        var r = new cBaseFunction("AND");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var argResult = null;
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
                    var argArr = arg[i].getValue();
                    for (var j = 0; j < argArr.length; j++) {
                        if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) {
                            continue;
                        } else {
                            if (argArr[j] instanceof cError) {
                                return this.value = argArr[j];
                            } else {
                                if (argResult == null) {
                                    argResult = argArr[j].tocBool();
                                } else {
                                    argResult = new cBool(argResult.value && argArr[j].tocBool().value);
                                }
                                if (argResult.value == false) {
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
                                var thas = this;
                                arg[i].foreach(function (elem) {
                                    if (elem instanceof cError) {
                                        argResult = elem;
                                        return true;
                                    } else {
                                        if (elem instanceof cString || elem instanceof cEmpty) {
                                            return;
                                        } else {
                                            if (argResult == null) {
                                                argResult = elem.tocBool();
                                            } else {
                                                argResult = new cBool(argResult.value && elem.tocBool().value);
                                            }
                                            if (argResult.value == false) {
                                                return true;
                                            }
                                        }
                                    }
                                });
                            } else {
                                if (argResult == null) {
                                    argResult = arg[i].tocBool();
                                } else {
                                    argResult = new cBool(argResult.value && arg[i].tocBool().value);
                                }
                                if (argResult.value == false) {
                                    return this.value = new cBool(false);
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(logical1, logical2, ...)"
            };
        };
        return r;
    },
    "FALSE": function () {
        var r = new cBaseFunction("FALSE");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function () {
            return this.value = new cBool(false);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "()"
            };
        };
        return r;
    },
    "IF": function () {
        var r = new cBaseFunction("IF");
        r.setArgumentsMin(1);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(logical_test, value_if_true, value_if_false)"
            };
        };
        return r;
    },
    "IFERROR": function () {
        var r = new cBaseFunction("IFERROR");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(value, value_if_error)"
            };
        };
        return r;
    },
    "NOT": function () {
        var r = new cBaseFunction("NOT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(logical)"
            };
        };
        return r;
    },
    "OR": function () {
        var r = new cBaseFunction("OR");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var argResult = null;
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
                    var argArr = arg[i].getValue();
                    for (var j = 0; j < argArr.length; j++) {
                        if (argArr[j] instanceof cString || argArr[j] instanceof cEmpty) {
                            continue;
                        } else {
                            if (argArr[j] instanceof cError) {
                                return this.value = argArr[j];
                            } else {
                                if (argResult == null) {
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
                                var thas = this;
                                arg[i].foreach(function (elem) {
                                    if (elem instanceof cError) {
                                        argResult = elem;
                                        return true;
                                    } else {
                                        if (elem instanceof cString || elem instanceof cEmpty) {
                                            return;
                                        } else {
                                            if (argResult == null) {
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
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(logical1, logical2, ...)"
            };
        };
        return r;
    },
    "TRUE": function () {
        var r = new cBaseFunction("TRUE");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function () {
            return this.value = new cBool(true);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "()"
            };
        };
        return r;
    }
};