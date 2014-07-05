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
 cFormulaFunction.Mathematic = {
    "groupName": "Mathematic",
    "ABS": function () {
        var r = new cBaseFunction("ABS");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            this.array[r][c] = new cNumber(Math.abs(elem.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    return this.value = new cNumber(Math.abs(arg0.getValue()));
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ACOS": function () {
        var r = new cBaseFunction("ACOS");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.acos(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.acos(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ACOSH": function () {
        var r = new cBaseFunction("ACOSH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.acosh(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.acosh(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ASIN": function () {
        var r = new cBaseFunction("ASIN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.asin(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.asin(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ASINH": function () {
        var r = new cBaseFunction("ASINH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.asinh(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.asinh(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ATAN": function () {
        var r = new cBaseFunction("ATAN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.atan(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    var a = Math.atan(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ATAN2": function () {
        var r = new cBaseFunction("ATAN2");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(b.getValue(), a.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(b.getValue(), a.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0,
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = a.getValue() == 0 && b.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(b.getValue(), a.getValue()));
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            return this.value = (arg0 instanceof cError ? arg0 : arg1 instanceof cError ? arg1 : arg1.getValue() == 0 && arg0.getValue() == 0 ? new cError(cErrorType.division_by_zero) : new cNumber(Math.atan2(arg1.getValue(), arg0.getValue())));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( x, y )"
            };
        };
        return r;
    },
    "ATANH": function () {
        var r = new cBaseFunction("ATANH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.atanh(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.atanh(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "CEILING": function () {
        var r = new cBaseFunction("CEILING");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg[0].tocNumber();
            arg1 = arg[1].tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            function ceilingHelper(number, significance) {
                if (significance == 0) {
                    return new cNumber(0);
                }
                if ((number > 0 && significance < 0) || (number < 0 && significance > 0)) {
                    return new cError(cErrorType.not_numeric);
                } else {
                    if (number / significance === Infinity) {
                        return new cError(cErrorType.not_numeric);
                    } else {
                        var quotient = number / significance;
                        if (quotient == 0) {
                            return new cNumber(0);
                        }
                        var quotientTr = Math.floor(quotient);
                        var nolpiat = 5 * (quotient < 0 ? -1 : quotient > 0 ? 1 : 0) * Math.pow(10, Math.floor(Math.log(Math.abs(quotient)) / Math.log(10)) - cExcelSignificantDigits);
                        if (Math.abs(quotient - quotientTr) > nolpiat) {
                            ++quotientTr;
                        }
                        return new cNumber(quotientTr * significance);
                    }
                }
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = ceilingHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = ceilingHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0,
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = ceilingHelper(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            return this.value = ceilingHelper(arg0.getValue(), arg1.getValue());
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, significance)"
            };
        };
        return r;
    },
    "COMBIN": function () {
        var r = new cBaseFunction("COMBIN");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            if (a.getValue() <= 0 || b.getValue() <= 0) {
                                this.array[r][c] = new cError(cErrorType.not_numeric);
                            }
                            this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0,
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                if (a.getValue() <= 0 || b.getValue() <= 0 || a.getValue() < b.getValue()) {
                                    this.array[r][c] = new cError(cErrorType.not_numeric);
                                }
                                this.array[r][c] = new cNumber(Math.binomCoeff(a.getValue(), b.getValue()));
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (arg0.getValue() <= 0 || arg1.getValue() <= 0 || arg0.getValue() < arg1.getValue()) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            return this.value = new cNumber(Math.binomCoeff(arg0.getValue(), arg1.getValue()));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number , number-chosen )"
            };
        };
        return r;
    },
    "COS": function () {
        var r = new cBaseFunction("COS");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.cos(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.cos(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "COSH": function () {
        var r = new cBaseFunction("COSH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.cosh(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.cosh(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "DEGREES": function () {
        var r = new cBaseFunction("DEGREES");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = elem.getValue();
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a * 180 / Math.PI);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = arg0.getValue();
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a * 180 / Math.PI);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ECMA.CEILING": function () {
        var r = new cBaseFunction("ECMA_CEILING");
        return r;
    },
    "EVEN": function () {
        var r = new cBaseFunction("EVEN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function evenHelper(arg) {
                var arg0 = arg.getValue();
                if (arg0 >= 0) {
                    arg0 = Math.ceil(arg0);
                    if ((arg0 & 1) == 0) {
                        return new cNumber(arg0);
                    } else {
                        return new cNumber(arg0 + 1);
                    }
                } else {
                    arg0 = Math.floor(arg0);
                    if ((arg0 & 1) == 0) {
                        return new cNumber(arg0);
                    } else {
                        return new cNumber(arg0 - 1);
                    }
                }
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg0 instanceof cArray) {
                arg0.foreach(function (elem, r, c) {
                    if (elem instanceof cNumber) {
                        this.array[r][c] = evenHelper(elem);
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg0;
            } else {
                if (arg0 instanceof cNumber) {
                    return this.value = evenHelper(arg0);
                }
            }
            return this.value = new cError(cErrorType.wrong_value_type);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "EXP": function () {
        var r = new cBaseFunction("EXP");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.exp(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                }
            }
            if (! (arg0 instanceof cNumber)) {
                return this.value = new cError(cErrorType.not_numeric);
            } else {
                var a = Math.exp(arg0.getValue());
                return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "FACT": function () {
        var r = new cBaseFunction("FACT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            if (elem.getValue() < 0) {
                                this.array[r][c] = new cError(cErrorType.not_numeric);
                            } else {
                                var a = Math.fact(elem.getValue());
                                this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                            }
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    if (arg0.getValue() < 0) {
                        return this.value = new cError(cErrorType.not_numeric);
                    }
                    var a = Math.fact(arg0.getValue());
                    return this.value = isNaN(a) || a == Infinity ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "FACTDOUBLE": function () {
        var r = new cBaseFunction("FACTDOUBLE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function factDouble(n) {
                if (n < 0) {
                    return Number.NaN;
                } else {
                    if (n > 300) {
                        return Number.Infinity;
                    }
                }
                n = Math.floor(n);
                var k = 1,
                res = n,
                _n = n,
                ost = -(_n & 1);
                n -= 2;
                while (n != ost) {
                    res *= n;
                    n -= 2;
                }
                return res;
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            if (elem.getValue() < 0) {
                                this.array[r][c] = new cError(cErrorType.not_numeric);
                            } else {
                                var a = factDouble(elem.getValue());
                                this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                            }
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    if (arg0.getValue() < 0) {
                        return this.value = new cError(cErrorType.not_numeric);
                    }
                    var a = factDouble(arg0.getValue());
                    return this.value = isNaN(a) || a == Infinity ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "FLOOR": function () {
        var r = new cBaseFunction("FLOOR");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg[0].tocNumber();
            arg1 = arg[1].tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            function floorHelper(number, significance) {
                if (significance == 0) {
                    return new cNumber(0);
                }
                if ((number > 0 && significance < 0) || (number < 0 && significance > 0)) {
                    return new cError(cErrorType.not_numeric);
                } else {
                    if (number / significance === Infinity) {
                        return new cError(cErrorType.not_numeric);
                    } else {
                        var quotient = number / significance;
                        if (quotient == 0) {
                            return new cNumber(0);
                        }
                        var nolpiat = 5 * (quotient < 0 ? -1 : quotient > 0 ? 1 : 0) * Math.pow(10, Math.floor(Math.log(Math.abs(quotient)) / Math.log(10)) - cExcelSignificantDigits);
                        return new cNumber(Math.floor(quotient + nolpiat) * significance);
                    }
                }
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = floorHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = floorHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0;
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = floorHelper(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (arg0 instanceof cString || arg1 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.value = floorHelper(arg0.getValue(), arg1.getValue());
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, significance)"
            };
        };
        return r;
    },
    "GCD": function () {
        var r = new cBaseFunction("GCD");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var _gcd = 0;
            function gcd(a, b) {
                var _a = parseInt(a),
                _b = parseInt(b);
                while (_b != 0) {
                    _b = _a % (_a = _b);
                }
                return _a;
            }
            for (var i = 0; i < this.getArguments(); i++) {
                var argI = arg[i];
                if (argI instanceof cArea || argI instanceof cArea3D) {
                    var argArr = argI.getValue();
                    for (var j = 0; j < argArr.length; j++) {
                        if (argArr[j] instanceof cError) {
                            return this.value = argArr[j];
                        }
                        if (argArr[j] instanceof cString) {
                            continue;
                        }
                        if (argArr[j] instanceof cBool) {
                            argArr[j] = argArr[j].tocNumber();
                        }
                        if (argArr[j].getValue() < 0) {
                            return this.value = new cError(cErrorType.not_numeric);
                        }
                        _gcd = gcd(_gcd, argArr[j].getValue());
                    }
                } else {
                    if (argI instanceof cArray) {
                        var argArr = argI.tocNumber();
                        if (argArr.foreach(function (arrElem) {
                            if (arrElem instanceof cError) {
                                _gcd = arrElem;
                                return true;
                            }
                            if (arrElem instanceof cBool) {
                                arrElem = arrElem.tocNumber();
                            }
                            if (arrElem instanceof cString) {
                                return;
                            }
                            if (arrElem.getValue() < 0) {
                                _gcd = new cError(cErrorType.not_numeric);
                                return true;
                            }
                            _gcd = gcd(_gcd, arrElem.getValue());
                        })) {
                            return this.value = _gcd;
                        }
                    } else {
                        argI = argI.tocNumber();
                        if (argI.getValue() < 0) {
                            return this.value = new cError(cErrorType.not_numeric);
                        }
                        if (argI instanceof cError) {
                            return this.value = argI;
                        }
                        _gcd = gcd(_gcd, argI.getValue());
                    }
                }
            }
            return this.value = new cNumber(_gcd);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( argument-list )"
            };
        };
        return r;
    },
    "INT": function () {
        var r = new cBaseFunction("INT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg0 instanceof cString) {
                this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg0 instanceof cArray) {
                arg0.foreach(function (elem, r, c) {
                    if (elem instanceof cNumber) {
                        this.array[r][c] = new cNumber(Math.floor(elem.getValue()));
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
            } else {
                return this.value = new cNumber(Math.floor(arg0.getValue()));
            }
            return this.value = new cNumber(Math.floor(arg0.getValue()));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "ISO.CEILING": function () {
        var r = new cBaseFunction("ISO_CEILING");
        return r;
    },
    "LCM": function () {
        var r = new cBaseFunction("LCM");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var _lcm = 1;
            function gcd(a, b) {
                var _a = parseInt(a),
                _b = parseInt(b);
                while (_b != 0) {
                    _b = _a % (_a = _b);
                }
                return _a;
            }
            function lcm(a, b) {
                return Math.abs(parseInt(a) * parseInt(b)) / gcd(a, b);
            }
            for (var i = 0; i < this.getArguments(); i++) {
                var argI = arg[i];
                if (argI instanceof cArea || argI instanceof cArea3D) {
                    var argArr = argI.getValue();
                    for (var j = 0; j < argArr.length; j++) {
                        if (argArr[j] instanceof cError) {
                            return this.value = argArr[j];
                        }
                        if (argArr[j] instanceof cString) {
                            continue;
                        }
                        if (argArr[j] instanceof cBool) {
                            argArr[j] = argArr[j].tocNumber();
                        }
                        if (argArr[j].getValue() <= 0) {
                            return this.value = new cError(cErrorType.not_numeric);
                        }
                        _lcm = lcm(_lcm, argArr[j].getValue());
                    }
                } else {
                    if (argI instanceof cArray) {
                        var argArr = argI.tocNumber();
                        if (argArr.foreach(function (arrElem) {
                            if (arrElem instanceof cError) {
                                _lcm = arrElem;
                                return true;
                            }
                            if (arrElem instanceof cBool) {
                                arrElem = arrElem.tocNumber();
                            }
                            if (arrElem instanceof cString) {
                                return;
                            }
                            if (arrElem.getValue() <= 0) {
                                _lcm = new cError(cErrorType.not_numeric);
                                return true;
                            }
                            _lcm = lcm(_lcm, arrElem.getValue());
                        })) {
                            return this.value = _lcm;
                        }
                    } else {
                        argI = argI.tocNumber();
                        if (argI.getValue() <= 0) {
                            return this.value = new cError(cErrorType.not_numeric);
                        }
                        if (argI instanceof cError) {
                            return this.value = argI;
                        }
                        _lcm = lcm(_lcm, argI.getValue());
                    }
                }
            }
            return this.value = new cNumber(_lcm);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( argument-list )"
            };
        };
        return r;
    },
    "LN": function () {
        var r = new cBaseFunction("LN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg0 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            if (elem.getValue() <= 0) {
                                this.array[r][c] = new cError(cErrorType.not_numeric);
                            } else {
                                this.array[r][c] = new cNumber(Math.log(elem.getValue()));
                            }
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    if (arg0.getValue() <= 0) {
                        return this.value = new cError(cErrorType.not_numeric);
                    } else {
                        return this.value = new cNumber(Math.log(arg0.getValue()));
                    }
                }
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "LOG": function () {
        var r = new cBaseFunction("LOG");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1] ? arg[1] : new cNumber(10);
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1 ? arg1 : new cNumber(10);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            if (a.getValue() <= 0 || a.getValue() <= 0) {
                                this.array[r][c] = new cError(cErrorType.not_numeric);
                            }
                            this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0,
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                if (a.getValue() <= 0 || a.getValue() <= 0) {
                                    this.array[r][c] = new cError(cErrorType.not_numeric);
                                }
                                this.array[r][c] = new cNumber(Math.log(a.getValue()) / Math.log(b.getValue()));
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg0.getValue() <= 0 || (arg1 && arg1.getValue() <= 0)) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            return this.value = new cNumber(Math.log(arg0.getValue()) / Math.log(arg1.getValue()));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number [ , base ])"
            };
        };
        return r;
    },
    "LOG10": function () {
        var r = new cBaseFunction("LOG10");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg0 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            if (elem.getValue() <= 0) {
                                this.array[r][c] = new cError(cErrorType.not_numeric);
                            } else {
                                this.array[r][c] = new cNumber(Math.log(elem.getValue()) / Math.log(10));
                            }
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    if (arg0.getValue() <= 0) {
                        return this.value = new cError(cErrorType.not_numeric);
                    } else {
                        return this.value = new cNumber(Math.log(arg0.getValue()) / Math.log(10));
                    }
                }
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "MDETERM": function () {
        var r = new cBaseFunction("MDETERM");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function determ(A) {
                var N = A.length,
                denom = 1,
                exchanges = 0;
                for (var i = 0; i < N; i++) {
                    for (var j = 0; j < A[i].length; j++) {
                        if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
                            return NaN;
                        }
                    }
                }
                for (var i = 0; i < N - 1; i++) {
                    var maxN = i,
                    maxValue = Math.abs(A[i][i] instanceof cEmpty ? NaN : A[i][i]);
                    for (var j = i + 1; j < N; j++) {
                        var value = Math.abs(A[j][i] instanceof cEmpty ? NaN : A[j][i]);
                        if (value > maxValue) {
                            maxN = j;
                            maxValue = value;
                        }
                    }
                    if (maxN > i) {
                        var temp = A[i];
                        A[i] = A[maxN];
                        A[maxN] = temp;
                        exchanges++;
                    } else {
                        if (maxValue == 0) {
                            return maxValue;
                        }
                    }
                    var value1 = A[i][i] instanceof cEmpty ? NaN : A[i][i];
                    for (var j = i + 1; j < N; j++) {
                        var value2 = A[j][i] instanceof cEmpty ? NaN : A[j][i];
                        A[j][i] = 0;
                        for (var k = i + 1; k < N; k++) {
                            A[j][k] = (A[j][k] * value1 - A[i][k] * value2) / denom;
                        }
                    }
                    denom = value1;
                }
                if (exchanges % 2) {
                    return -A[N - 1][N - 1];
                } else {
                    return A[N - 1][N - 1];
                }
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArray) {
                arg0 = arg0.getMatrix();
            } else {
                return this.value = new cError(cErrorType.not_available);
            }
            if (arg0[0].length != arg0.length) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            arg0 = determ(arg0);
            if (!isNaN(arg0)) {
                return this.value = new cNumber(arg0);
            } else {
                return this.value = new cError(cErrorType.not_available);
            }
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "MINVERSE": function () {
        var r = new cBaseFunction("MINVERSE");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function Determinant(A) {
                var N = A.length,
                B = [],
                denom = 1,
                exchanges = 0;
                for (var i = 0; i < N; ++i) {
                    B[i] = [];
                    for (var j = 0; j < N; ++j) {
                        B[i][j] = A[i][j];
                    }
                }
                for (var i = 0; i < N - 1; ++i) {
                    var maxN = i,
                    maxValue = Math.abs(B[i][i]);
                    for (var j = i + 1; j < N; ++j) {
                        var value = Math.abs(B[j][i]);
                        if (value > maxValue) {
                            maxN = j;
                            maxValue = value;
                        }
                    }
                    if (maxN > i) {
                        var temp = B[i];
                        B[i] = B[maxN];
                        B[maxN] = temp;
                        ++exchanges;
                    } else {
                        if (maxValue == 0) {
                            return maxValue;
                        }
                    }
                    var value1 = B[i][i];
                    for (var j = i + 1; j < N; ++j) {
                        var value2 = B[j][i];
                        B[j][i] = 0;
                        for (var k = i + 1; k < N; ++k) {
                            B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
                        }
                    }
                    denom = value1;
                }
                if (exchanges % 2) {
                    return -B[N - 1][N - 1];
                } else {
                    return B[N - 1][N - 1];
                }
            }
            function MatrixCofactor(i, j, __A) {
                var N = __A.length,
                sign = ((i + j) % 2 == 0) ? 1 : -1;
                for (var m = 0; m < N; m++) {
                    for (var n = j + 1; n < N; n++) {
                        __A[m][n - 1] = __A[m][n];
                    }
                    __A[m].length--;
                }
                for (var k = (i + 1); k < N; k++) {
                    __A[k - 1] = __A[k];
                }
                __A.length--;
                return sign * Determinant(__A);
            }
            function AdjugateMatrix(_A) {
                var N = _A.length,
                B = [],
                adjA = [];
                for (var i = 0; i < N; i++) {
                    adjA[i] = [];
                    for (var j = 0; j < N; j++) {
                        for (var m = 0; m < N; m++) {
                            B[m] = [];
                            for (var n = 0; n < N; n++) {
                                B[m][n] = _A[m][n];
                            }
                        }
                        adjA[i][j] = MatrixCofactor(j, i, B);
                    }
                }
                return adjA;
            }
            function InverseMatrix(A) {
                for (var i = 0; i < A.length; i++) {
                    for (var j = 0; j < A[i].length; j++) {
                        if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
                            return new cError(cErrorType.not_available);
                        } else {
                            A[i][j] = A[i][j].getValue();
                        }
                    }
                }
                var detA = Determinant(A),
                invertA,
                res;
                if (detA != 0) {
                    invertA = AdjugateMatrix(A);
                    var datA = 1 / detA;
                    for (var i = 0; i < invertA.length; i++) {
                        for (var j = 0; j < invertA[i].length; j++) {
                            invertA[i][j] = new cNumber(datA * invertA[i][j]);
                        }
                    }
                    res = new cArray();
                    res.fillFromArray(invertA);
                } else {
                    res = new cError(cErrorType.not_available);
                }
                return res;
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArray) {
                arg0 = arg0.getMatrix();
            } else {
                return this.value = new cError(cErrorType.not_available);
            }
            if (arg0[0].length != arg0.length) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.value = InverseMatrix(arg0);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "MMULT": function () {
        var r = new cBaseFunction("MMULT");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function mult(A, B) {
                for (var i = 0; i < A.length; i++) {
                    for (var j = 0; j < A[i].length; j++) {
                        if (A[i][j] instanceof cEmpty || A[i][j] instanceof cString) {
                            return new cError(cErrorType.not_available);
                        }
                    }
                }
                for (var i = 0; i < B.length; i++) {
                    for (var j = 0; j < B[i].length; j++) {
                        if (B[i][j] instanceof cEmpty || B[i][j] instanceof cString) {
                            return new cError(cErrorType.not_available);
                        }
                    }
                }
                if (A.length != B[0].length) {
                    return new cError(cErrorType.wrong_value_type);
                }
                var C = new Array(A.length);
                for (var i = 0; i < A.length; i++) {
                    C[i] = new Array(B[0].length);
                    for (var j = 0; j < B[0].length; j++) {
                        C[i][j] = 0;
                        for (var k = 0; k < B.length; k++) {
                            C[i][j] += A[i][k].getValue() * B[k][j].getValue();
                        }
                        C[i][j] = new cNumber(C[i][j]);
                    }
                }
                var res = new cArray();
                res.fillFromArray(C);
                return res;
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArray) {
                arg0 = arg0.getMatrix();
            } else {
                return this.value = new cError(cErrorType.not_available);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArray) {
                arg1 = arg1.getMatrix();
            } else {
                return this.value = new cError(cErrorType.not_available);
            }
            return this.value = mult(arg0, arg1);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array1, array2 )"
            };
        };
        r.setFormat(r.formatType.noneFormat);
        return r;
    },
    "MOD": function () {
        var r = new cBaseFunction("MOD");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = new cNumber((b.getValue() < 0 ? -1 : 1) * (Math.abs(a.getValue()) % Math.abs(b.getValue())));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = new cNumber((b.getValue() < 0 ? -1 : 1) * (Math.abs(a.getValue()) % Math.abs(b.getValue())));
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0,
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = new cNumber((b.getValue() < 0 ? -1 : 1) * (Math.abs(a.getValue()) % Math.abs(b.getValue())));
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg1.getValue() == 0) {
                return this.value = new cError(cErrorType.division_by_zero);
            }
            return this.value = new cNumber((arg1.getValue() < 0 ? -1 : 1) * (Math.abs(arg0.getValue()) % Math.abs(arg1.getValue())));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, divisor)"
            };
        };
        return r;
    },
    "MROUND": function () {
        var r = new cBaseFunction("MROUND");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            var multiple;
            function mroundHelper(num) {
                var multiplier = Math.pow(10, Math.floor(Math.log(Math.abs(num)) / Math.log(10)) - cExcelSignificantDigits + 1);
                var nolpiat = 0.5 * (num > 0 ? 1 : num < 0 ? -1 : 0) * multiplier;
                var y = (num + nolpiat) / multiplier;
                y = y / Math.abs(y) * Math.floor(Math.abs(y));
                var x = y * multiplier / multiple;
                var nolpiat = 5 * (x / Math.abs(x)) * Math.pow(10, Math.floor(Math.log(Math.abs(x)) / Math.log(10)) - cExcelSignificantDigits);
                x = x + nolpiat;
                x = x | x;
                return x * multiple;
            }
            function f(a, b, r, c) {
                if (a instanceof cNumber && b instanceof cNumber) {
                    if (a.getValue() == 0) {
                        this.array[r][c] = new cNumber(0);
                    } else {
                        if (a.getValue() < 0 && b.getValue() > 0 || arg0.getValue() > 0 && b.getValue() < 0) {
                            this.array[r][c] = new cError(cErrorType.not_numeric);
                        } else {
                            multiple = b.getValue();
                            this.array[r][c] = new cNumber(mroundHelper(a.getValue() + b.getValue() / 2));
                        }
                    }
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cString || arg1 instanceof cString) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1, r, c);
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            f.call(this, arg0, elem, r, c);
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (arg1.getValue() == 0) {
                return this.value = new cNumber(0);
            }
            if (arg0.getValue() < 0 && arg1.getValue() > 0 || arg0.getValue() > 0 && arg1.getValue() < 0) {
                return this.value = new cError(cErrorType.not_numeric);
            }
            multiple = arg1.getValue();
            return this.value = new cNumber(mroundHelper(arg0.getValue() + arg1.getValue() / 2));
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, multiple)"
            };
        };
        return r;
    },
    "MULTINOMIAL": function () {
        var r = new cBaseFunction("MULTINOMIAL");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var arg0 = new cNumber(0),
            fact = 1;
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
                    var _arrVal = arg[i].getValue();
                    for (var j = 0; j < _arrVal.length; j++) {
                        if (_arrVal[j] instanceof cNumber) {
                            if (_arrVal[j].getValue() < 0) {
                                return this.value = new cError(cError.not_numeric);
                            }
                            arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "+");
                            fact *= Math.fact(_arrVal[j].getValue());
                        } else {
                            if (_arrVal[j] instanceof cError) {
                                return this.value = _arrVal[j];
                            } else {
                                return this.value = new cError(cError.wrong_value_type);
                            }
                        }
                    }
                } else {
                    if (arg[i] instanceof cArray) {
                        if (arg[i].foreach(function (arrElem) {
                            if (arrElem instanceof cNumber) {
                                if (arrElem.getValue() < 0) {
                                    return true;
                                }
                                arg0 = _func[arg0.type][arrElem.type](arg0, arrElem, "+");
                                fact *= Math.fact(arrElem.getValue());
                            } else {
                                return true;
                            }
                        })) {
                            return this.value = new cError(cErrorType.wrong_value_type);
                        }
                    } else {
                        if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                            var _arg = arg[i].getValue();
                            if (_arg.getValue() < 0) {
                                return this.value = new cError(cErrorType.not_numeric);
                            }
                            if (_arg instanceof cNumber) {
                                if (_arg.getValue() < 0) {
                                    return this.value = new cError(cError.not_numeric);
                                }
                                arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
                                fact *= Math.fact(_arg.getValue());
                            } else {
                                if (_arg instanceof cError) {
                                    return this.value = _arg;
                                } else {
                                    return this.value = new cError(cErrorType.wrong_value_type);
                                }
                            }
                        } else {
                            if (arg[i] instanceof cNumber) {
                                if (arg[i].getValue() < 0) {
                                    return this.value = new cError(cErrorType.not_numeric);
                                }
                                arg0 = _func[arg0.type][arg[i].type](arg0, arg[i], "+");
                                fact *= Math.fact(arg[i].getValue());
                            } else {
                                if (arg[i] instanceof cError) {
                                    return this.value = arg[i];
                                } else {
                                    return this.value = new cError(cErrorType.wrong_value_type);
                                }
                            }
                        }
                    }
                }
                if (arg0 instanceof cError) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            if (arg0.getValue() > 170) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.value = new cNumber(Math.fact(arg0.getValue()) / fact);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( argument-list )"
            };
        };
        return r;
    },
    "ODD": function () {
        var r = new cBaseFunction("ODD");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function oddHelper(arg) {
                var arg0 = arg.getValue();
                if (arg0 >= 0) {
                    arg0 = Math.ceil(arg0);
                    if ((arg0 & 1) == 1) {
                        return new cNumber(arg0);
                    } else {
                        return new cNumber(arg0 + 1);
                    }
                } else {
                    arg0 = Math.floor(arg0);
                    if ((arg0 & 1) == 1) {
                        return new cNumber(arg0);
                    } else {
                        return new cNumber(arg0 - 1);
                    }
                }
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg0 instanceof cArray) {
                arg0.foreach(function (elem, r, c) {
                    if (elem instanceof cNumber) {
                        this.array[r][c] = oddHelper(elem);
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
                return this.value = arg0;
            } else {
                if (arg0 instanceof cNumber) {
                    return this.value = oddHelper(arg0);
                }
            }
            return this.value = new cError(cErrorType.wrong_value_type);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "PI": function () {
        var r = new cBaseFunction("PI");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function () {
            return new cNumber(Math.PI);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "()"
            };
        };
        return r;
    },
    "POWER": function () {
        var r = new cBaseFunction("POWER");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function powerHelper(a, b) {
                if (a == 0 && b < 0) {
                    return new cError(cErrorType.division_by_zero);
                }
                if (a == 0 && b == 0) {
                    return new cError(cErrorType.not_numeric);
                }
                return new cNumber(Math.pow(a, b));
            }
            function f(a, b, r, c) {
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = powerHelper(a.getValue(), b.getValue());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1, r, c);
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            f.call(this, arg0, elem, r, c);
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.value = powerHelper(arg0.getValue(), arg1.getValue());
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, power)"
            };
        };
        return r;
    },
    "PRODUCT": function () {
        var r = new cBaseFunction("PRODUCT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var arg0 = new cNumber(1),
            _aVal = null;
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
                    var _arrVal = arg[i].getValue();
                    for (var j = 0; j < _arrVal.length; j++) {
                        arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "*");
                        if (arg0 instanceof cError) {
                            return this.value = arg0;
                        }
                    }
                } else {
                    if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                        var _arg = arg[i].getValue();
                        arg0 = _func[arg0.type][_arg.type](arg0, _arg, "*");
                    } else {
                        if (arg[i] instanceof cArray) {
                            arg[i].foreach(function (elem) {
                                if (elem instanceof cString || elem instanceof cBool || elem instanceof cEmpty) {
                                    return;
                                }
                                arg0 = _func[arg0.type][elem.type](arg0, elem, "*");
                            });
                        } else {
                            arg0 = _func[arg0.type][arg[i].type](arg0, arg[i], "*");
                        }
                    }
                }
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number1, number2, ... )"
            };
        };
        return r;
    },
    "QUOTIENT": function () {
        var r = new cBaseFunction("QUOTIENT");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function quotient(a, b) {
                if (b.getValue() != 0) {
                    return new cNumber(parseInt(a.getValue() / b.getValue()));
                } else {
                    return new cError(cErrorType.division_by_zero);
                }
            }
            function f(a, b, r, c) {
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = quotient(a, b);
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1, r, c);
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            f.call(this, arg0, elem, r, c);
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.setCA(quotient(arg0, arg1), true);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( dividend , divisor )"
            };
        };
        return r;
    },
    "RADIANS": function () {
        var r = new cBaseFunction("RADIANS");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function radiansHelper(ang) {
                return ang * Math.PI / 180;
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cArray) {
                arg0.foreach(function (elem, r, c) {
                    if (elem instanceof cNumber) {
                        this.array[r][c] = new cNumber(radiansHelper(elem.getValue()));
                    } else {
                        this.array[r][c] = new cError(cErrorType.wrong_value_type);
                    }
                });
            } else {
                return this.value = (arg0 instanceof cError ? arg0 : new cNumber(radiansHelper(arg0.getValue())));
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "RAND": function () {
        var r = new cBaseFunction("RAND");
        r.setArgumentsMin(0);
        r.setArgumentsMax(0);
        r.Calculate = function () {
            return this.setCA(new cNumber(Math.random()), true);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "()"
            };
        };
        return r;
    },
    "RANDBETWEEN": function () {
        var r = new cBaseFunction("RANDBETWEEN");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function randBetween(a, b) {
                return new cNumber(Math.round(Math.random() * Math.abs(a - b)) + a);
            }
            function f(a, b, r, c) {
                if (a instanceof cNumber && b instanceof cNumber) {
                    this.array[r][c] = randBetween(a.getValue(), b.getValue());
                } else {
                    this.array[r][c] = new cError(cErrorType.wrong_value_type);
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg1 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1.getElementRowCol(r, c), r, c);
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        f.call(this, elem, arg1, r, c);
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            f.call(this, arg0, elem, r, c);
                        });
                        return this.value = arg1;
                    }
                }
            }
            if (! (arg0 instanceof cNumber) || (arg1 && !(arg0 instanceof cNumber))) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            return this.setCA(new cNumber(randBetween(arg0.getValue(), arg1.getValue())), true);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( lower-bound , upper-bound )"
            };
        };
        return r;
    },
    "ROMAN": function () {
        var r = new cBaseFunction("ROMAN");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function roman(fVal, fMode) {
                if ((fMode >= 0) && (fMode < 5) && (fVal >= 0) && (fVal < 4000)) {
                    var pChars = ["M", "D", "C", "L", "X", "V", "I"];
                    var pValues = [1000, 500, 100, 50, 10, 5, 1];
                    var nMaxIndex = pValues.length - 1;
                    var aRoman = "";
                    var nVal = fVal;
                    var nMode = fMode;
                    for (var i = 0; i <= nMaxIndex / 2; i++) {
                        var nIndex = 2 * i;
                        var nDigit = parseInt(nVal / pValues[nIndex]);
                        if ((nDigit % 5) == 4) {
                            var nIndex2 = (nDigit == 4) ? nIndex - 1 : nIndex - 2;
                            var nSteps = 0;
                            while ((nSteps < nMode) && (nIndex < nMaxIndex)) {
                                nSteps++;
                                if (pValues[nIndex2] - pValues[nIndex + 1] <= nVal) {
                                    nIndex++;
                                } else {
                                    nSteps = nMode;
                                }
                            }
                            aRoman += pChars[nIndex];
                            aRoman += pChars[nIndex2];
                            nVal = (nVal + pValues[nIndex]);
                            nVal = (nVal - pValues[nIndex2]);
                        } else {
                            if (nDigit > 4) {
                                aRoman += pChars[nIndex - 1];
                            }
                            for (var j = nDigit % 5; j > 0; j--) {
                                aRoman += pChars[nIndex];
                            }
                            nVal %= pValues[nIndex];
                        }
                    }
                    return new cString(aRoman);
                } else {
                    return new cError(cErrorType.wrong_value_type);
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D || arg1 instanceof cArea || arg1 instanceof cArea3D) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            arg0 = arg0.tocNumber();
            arg1 = arg1.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = roman(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem,
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = roman(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0,
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = roman(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            return this.value = roman(arg0.getValue(), arg1.getValue());
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number, form )"
            };
        };
        return r;
    },
    "ROUND": function () {
        var r = new cBaseFunction("ROUND");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function SignZeroPositive(number) {
                return number < 0 ? -1 : 1;
            }
            function truncate(n) {
                return Math[n > 0 ? "floor" : "ceil"](n);
            }
            function sign(n) {
                return n == 0 ? 0 : n < 0 ? -1 : 1;
            }
            function Floor(number, significance) {
                var quotient = number / significance;
                if (quotient == 0) {
                    return 0;
                }
                var nolpiat = 5 * sign(quotient) * Math.pow(10, Math.floor(Math.log(Math.abs(quotient)) / Math.log(10)) - cExcelSignificantDigits);
                return truncate(quotient + nolpiat) * significance;
            }
            function roundHelper(number, num_digits) {
                if (num_digits > cExcelMaxExponent) {
                    if (Math.abs(number) < 1 || num_digits < 10000000000) {
                        return new cNumber(number);
                    }
                    return new cNumber(0);
                } else {
                    if (num_digits < cExcelMinExponent) {
                        if (Math.abs(number) < 0.01) {
                            return new cNumber(number);
                        }
                        return new cNumber(0);
                    }
                }
                var significance = SignZeroPositive(number) * Math.pow(10, -truncate(num_digits));
                number += significance / 2;
                if (number / significance == Infinity) {
                    return new cNumber(number);
                }
                return new cNumber(Floor(number, significance));
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    if (arg0 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg0 = arg0.tocNumber();
                    }
                }
            } else {
                arg0 = arg0.tocNumber();
            }
            if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
                arg1 = arg1.getValue();
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    if (arg1 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg1 = arg1.tocNumber();
                    }
                }
            } else {
                arg1 = arg1.tocNumber();
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = roundHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = roundHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0;
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = roundHelper(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            var number = arg0.getValue(),
            num_digits = arg1.getValue();
            return this.value = roundHelper(number, num_digits);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, num_digits)"
            };
        };
        return r;
    },
    "ROUNDDOWN": function () {
        var r = new cBaseFunction("ROUNDDOWN");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function rounddownHelper(number, num_digits) {
                if (num_digits > cExcelMaxExponent) {
                    if (Math.abs(number) >= 1e-100 || num_digits <= 98303) {
                        return new cNumber(number);
                    }
                    return new cNumber(0);
                } else {
                    if (num_digits < cExcelMinExponent) {
                        if (Math.abs(number) >= 1e+100) {
                            return new cNumber(number);
                        }
                        return new cNumber(0);
                    }
                }
                var significance = Math.pow(10, -(num_digits | num_digits));
                if (Number.POSITIVE_INFINITY == Math.abs(number / significance)) {
                    return new cNumber(number);
                }
                var x = number * Math.pow(10, num_digits);
                x = x | x;
                return new cNumber(x * significance);
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    if (arg0 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg0 = arg0.tocNumber();
                    }
                }
            } else {
                arg0 = arg0.tocNumber();
            }
            if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
                arg1 = arg1.getValue();
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    if (arg1 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg1 = arg1.tocNumber();
                    }
                }
            } else {
                arg1 = arg1.tocNumber();
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = rounddownHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = rounddownHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0;
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = rounddownHelper(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            var number = arg0.getValue(),
            num_digits = arg1.getValue();
            return this.value = rounddownHelper(number, num_digits);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, num_digits)"
            };
        };
        return r;
    },
    "ROUNDUP": function () {
        var r = new cBaseFunction("ROUNDUP");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function roundupHelper(number, num_digits) {
                if (num_digits > cExcelMaxExponent) {
                    if (Math.abs(number) >= 1e-100 || num_digits <= 98303) {
                        return new cNumber(number);
                    }
                    return new cNumber(0);
                } else {
                    if (num_digits < cExcelMinExponent) {
                        if (Math.abs(number) >= 1e+100) {
                            return new cNumber(number);
                        }
                        return new cNumber(0);
                    }
                }
                var significance = Math.pow(10, -(num_digits | num_digits));
                if (Number.POSITIVE_INFINITY == Math.abs(number / significance)) {
                    return new cNumber(number);
                }
                var x = number * Math.pow(10, num_digits);
                x = (x | x) + (x > 0 ? 1 : x < 0 ? -1 : 0) * 1;
                return new cNumber(x * significance);
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    if (arg0 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg0 = arg0.tocNumber();
                    }
                }
            } else {
                arg0 = arg0.tocNumber();
            }
            if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
                arg1 = arg1.getValue();
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    if (arg1 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg1 = arg1.tocNumber();
                    }
                }
            } else {
                arg1 = arg1.tocNumber();
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = roundupHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = roundupHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0;
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = roundupHelper(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            var number = arg0.getValue(),
            num_digits = arg1.getValue();
            return this.value = roundupHelper(number, num_digits);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number, num_digits)"
            };
        };
        return r;
    },
    "SERIESSUM": function () {
        var r = new cBaseFunction("SERIESSUM");
        r.setArgumentsMin(4);
        r.setArgumentsMax(4);
        r.Calculate = function (arg) {
            function SERIESSUM(x, n, m, a) {
                x = x.getValue();
                n = n.getValue();
                m = m.getValue();
                for (var i = 0; i < a.length; i++) {
                    if (! (a[i] instanceof cNumber)) {
                        return new cError(cErrorType.wrong_value_type);
                    }
                    a[i] = a[i].getValue();
                }
                function sumSeries(x, n, m, a) {
                    var sum = 0;
                    for (var i = 0; i < a.length; i++) {
                        sum += a[i] * Math.pow(x, n + i * m);
                    }
                    return sum;
                }
                return new cNumber(sumSeries(x, n, m, a));
            }
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2],
            arg3 = arg[3];
            if (arg0 instanceof cNumber || arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.tocNumber();
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg1 instanceof cNumber || arg1 instanceof cRef || arg1 instanceof cRef3D) {
                arg1 = arg1.tocNumber();
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg2 instanceof cNumber || arg2 instanceof cRef || arg2 instanceof cRef3D) {
                arg2 = arg2.tocNumber();
            } else {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg3 instanceof cNumber || arg3 instanceof cRef || arg3 instanceof cRef3D) {
                arg3 = [arg3.tocNumber()];
            } else {
                if (arg3 instanceof cArea || arg3 instanceof cArea3D) {
                    arg3 = arg3.getValue();
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            return this.value = SERIESSUM(arg0, arg1, arg2, arg3);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( input-value , initial-power , step , coefficients )"
            };
        };
        return r;
    },
    "SIGN": function () {
        var r = new cBaseFunction("SIGN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            function signHelper(arg) {
                if (arg < 0) {
                    return new cNumber(-1);
                } else {
                    if (arg == 0) {
                        return new cNumber(0);
                    } else {
                        return new cNumber(1);
                    }
                }
            }
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = elem.getValue();
                            this.array[r][c] = signHelper(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = arg0.getValue();
                    return this.value = signHelper(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "SIN": function () {
        var r = new cBaseFunction("SIN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.sin(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.sin(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "SINH": function () {
        var r = new cBaseFunction("SINH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.sinh(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.sinh(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "SQRT": function () {
        var r = new cBaseFunction("SQRT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.sqrt(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.sqrt(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number )"
            };
        };
        return r;
    },
    "SQRTPI": function () {
        var r = new cBaseFunction("SQRTPI");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.sqrt(elem.getValue() * Math.PI);
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.sqrt(arg0.getValue() * Math.PI);
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( number )"
            };
        };
        return r;
    },
    "SUBTOTAL": function () {
        var r = new cBaseFunction("SUBTOTAL");
        return r;
    },
    "SUM": function () {
        var r = new cBaseFunction("SUM");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var arg0 = new cNumber(0),
            _aVal = null;
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
                    var _arrVal = arg[i].getValue();
                    for (var j = 0; j < _arrVal.length; j++) {
                        if (! (_arrVal[j] instanceof cBool || _arrVal[j] instanceof cString)) {
                            arg0 = _func[arg0.type][_arrVal[j].type](arg0, _arrVal[j], "+");
                        }
                        if (arg0 instanceof cError) {
                            return this.value = arg0;
                        }
                    }
                } else {
                    if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                        var _arg = arg[i].getValue();
                        if (! (_arg instanceof cBool || _arg instanceof cString)) {
                            arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
                        }
                    } else {
                        if (arg[i] instanceof cArray) {
                            arg[i].foreach(function (arrElem) {
                                if (! (arrElem instanceof cBool || arrElem instanceof cString || arrElem instanceof cEmpty)) {
                                    arg0 = _func[arg0.type][arrElem.type](arg0, arrElem, "+");
                                }
                            });
                        } else {
                            var _arg = arg[i].tocNumber();
                            arg0 = _func[arg0.type][_arg.type](arg0, _arg, "+");
                        }
                    }
                }
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number1, number2, ...)"
            };
        };
        return r;
    },
    "SUMIF": function () {
        var r = new cBaseFunction("SUMIF");
        r.setArgumentsMin(2);
        r.setArgumentsMax(3);
        r.Calculate = function (arg) {
            var arg0 = arg[0],
            arg1 = arg[1],
            arg2 = arg[2] ? arg[2] : arg[0],
            _sum = 0,
            valueForSearching,
            regexpSearch;
            if (! (arg0 instanceof cRef || arg0 instanceof cRef3D || arg0 instanceof cArea)) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (! (arg2 instanceof cRef || arg2 instanceof cRef3D || arg2 instanceof cArea)) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            } else {
                if (arg1 instanceof cArray) {
                    arg1 = arg1.getElementRowCol(0, 0);
                }
            }
            arg1 = arg1.tocString();
            if (! (arg1 instanceof cString)) {
                return this.value = new cError(cErrorType.wrong_value_type);
            }
            function matching(x, y, oper) {
                var res = false,
                rS;
                if (y instanceof cString) {
                    rS = searchRegExp(y.toString());
                    switch (oper) {
                    case "<>":
                        res = !rS.test(x.value);
                        break;
                    case "=":
                        default:
                        res = rS.test(x.value);
                        break;
                    }
                } else {
                    if (typeof x === typeof y) {
                        switch (oper) {
                        case "<>":
                            res = (x.value != y.value);
                            break;
                        case ">":
                            res = (x.value > y.value);
                            break;
                        case "<":
                            res = (x.value < y.value);
                            break;
                        case ">=":
                            res = (x.value >= y.value);
                            break;
                        case "<=":
                            res = (x.value <= y.value);
                            break;
                        case "=":
                            default:
                            res = (x.value == y.value);
                            break;
                        }
                    }
                }
                return res;
            }
            arg1 = arg1.toString();
            var operators = new RegExp("^ *[<=> ]+ *"),
            match = arg1.match(operators),
            search,
            oper,
            val;
            if (match) {
                search = arg1.substr(match[0].length);
                oper = match[0].replace(/\s/g, "");
            } else {
                search = arg1;
            }
            valueForSearching = parseNum(search) ? new cNumber(search) : new cString(search);
            if (arg0 instanceof cArea) {
                var arg0Matrix = arg0.getMatrix(),
                arg2Matrix = arg2.getMatrix(),
                valMatrix0,
                valMatrix2;
                for (var i = 0; i < arg0Matrix.length; i++) {
                    for (var j = 0; j < arg0Matrix[i].length; j++) {
                        valMatrix0 = arg0Matrix[i][j];
                        valMatrix2 = arg2Matrix[i][j] ? arg2Matrix[i][j] : new cEmpty();
                        if (matching(valMatrix0, valueForSearching, oper)) {
                            if (valMatrix2 instanceof cNumber) {
                                _sum += valMatrix2.getValue();
                            }
                        }
                    }
                }
            } else {
                val = arg0.getValue();
                if (matching(val, valueForSearching, oper)) {
                    var r = arg0.getRange(),
                    ws = arg0.getWS(),
                    r1 = r.first.getRow0() + 0,
                    c1 = arg2.getRange().first.getCol0();
                    r = new cRef(ws.getRange3(r1, c1, r1, c1).getName(), ws);
                    if (r.getValue() instanceof cNumber) {
                        _sum += r.getValue().getValue();
                    }
                }
            }
            return this.value = new cNumber(_sum);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( cell-range, selection-criteria [ , sum-range ] )"
            };
        };
        return r;
    },
    "SUMIFS": function () {
        var r = new cBaseFunction("SUMIFS");
        return r;
    },
    "SUMPRODUCT": function () {
        var r = new cBaseFunction("SUMPRODUCT");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var arg0 = new cNumber(0),
            resArr = [],
            col = 0,
            row = 0,
            res = 1,
            _res = [];
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea3D) {
                    return this.value = new cError(cErrorType.bad_reference);
                }
                if (arg[i] instanceof cArea || arg[i] instanceof cArray) {
                    resArr[i] = arg[i].getMatrix();
                } else {
                    if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                        resArr[i] = [[arg[i].getValue()]];
                    } else {
                        resArr[i] = [[arg[i]]];
                    }
                }
                row = Math.max(resArr[0].length, row);
                col = Math.max(resArr[0][0].length, col);
                if (row != resArr[i].length || col != resArr[i][0].length) {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
                if (arg[i] instanceof cError) {
                    return this.value = arg[i];
                }
            }
            for (var iRow = 0; iRow < row; iRow++) {
                for (var iCol = 0; iCol < col; iCol++) {
                    res = 1;
                    for (var iRes = 0; iRes < resArr.length; iRes++) {
                        arg0 = resArr[iRes][iRow][iCol];
                        if (arg0 instanceof cError) {
                            return this.value = arg0;
                        } else {
                            if (arg0 instanceof cString) {
                                if (arg0.tocNumber() instanceof cError) {
                                    res *= 0;
                                } else {
                                    res *= arg0.tocNumber().getValue();
                                }
                            } else {
                                res *= arg0.tocNumber().getValue();
                            }
                        }
                    }
                    _res.push(res);
                }
            }
            res = 0;
            for (var i = 0; i < _res.length; i++) {
                res += _res[i];
            }
            return this.value = new cNumber(res);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( argument-lists )"
            };
        };
        return r;
    },
    "SUMSQ": function () {
        var r = new cBaseFunction("SUMSQ");
        r.setArgumentsMin(1);
        r.setArgumentsMax(255);
        r.Calculate = function (arg) {
            var arg0 = new cNumber(0),
            _aVal = null;
            function sumsqHelper(a, b) {
                var c = _func[b.type][b.type](b, b, "*");
                return _func[a.type][c.type](a, c, "+");
            }
            for (var i = 0; i < arg.length; i++) {
                if (arg[i] instanceof cArea || arg[i] instanceof cArea3D) {
                    var _arrVal = arg[i].getValue();
                    for (var j = 0; j < _arrVal.length; j++) {
                        if (_arrVal[j] instanceof cNumber) {
                            arg0 = sumsqHelper(arg0, _arrVal[j]);
                        } else {
                            if (_arrVal[j] instanceof cError) {
                                return this.value = _arrVal[j];
                            }
                        }
                    }
                } else {
                    if (arg[i] instanceof cRef || arg[i] instanceof cRef3D) {
                        var _arg = arg[i].getValue();
                        if (_arg instanceof cNumber) {
                            arg0 = sumsqHelper(arg0, _arg);
                        }
                    } else {
                        if (arg[i] instanceof cArray) {
                            arg[i].foreach(function (arrElem) {
                                if (arrElem instanceof cNumber) {
                                    arg0 = sumsqHelper(arg0, arrElem);
                                }
                            });
                        } else {
                            var _arg = arg[i].tocNumber();
                            arg0 = sumsqHelper(arg0, _arg);
                        }
                    }
                }
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( argument-list )"
            };
        };
        return r;
    },
    "SUMX2MY2": function () {
        var r = new cBaseFunction("SUMX2MY2");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function sumX2MY2(a, b, _3d) {
                var sum = 0;
                function a2Mb2(a, b) {
                    return a * a - b * b;
                }
                if (!_3d) {
                    if (a.length == b.length && a[0].length == b[0].length) {
                        for (var i = 0; i < a.length; i++) {
                            for (var j = 0; j < a[0].length; j++) {
                                if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
                                    sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue());
                                } else {
                                    return new cError(cErrorType.wrong_value_type);
                                }
                            }
                        }
                        return new cNumber(sum);
                    } else {
                        return new cError(cErrorType.wrong_value_type);
                    }
                } else {
                    if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
                        for (var i = 0; i < a.length; i++) {
                            for (var j = 0; j < a[0].length; j++) {
                                for (var k = 0; k < a[0][0].length; k++) {
                                    if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
                                        sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue());
                                    } else {
                                        return new cError(cErrorType.wrong_value_type);
                                    }
                                }
                            }
                        }
                        return new cNumber(sum);
                    } else {
                        return new cError(cErrorType.wrong_value_type);
                    }
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
                return this.value = sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
            }
            if (arg0 instanceof cArea || arg0 instanceof cArray) {
                arg0 = arg0.getMatrix();
            } else {
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
                arg1 = arg1.getMatrix();
            } else {
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            return this.value = sumX2MY2(arg0, arg1, false);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array-1 , array-2 )"
            };
        };
        return r;
    },
    "SUMX2PY2": function () {
        var r = new cBaseFunction("SUMX2PY2");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function sumX2MY2(a, b, _3d) {
                var sum = 0;
                function a2Mb2(a, b) {
                    return a * a + b * b;
                }
                if (!_3d) {
                    if (a.length == b.length && a[0].length == b[0].length) {
                        for (var i = 0; i < a.length; i++) {
                            for (var j = 0; j < a[0].length; j++) {
                                if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
                                    sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue());
                                } else {
                                    return new cError(cErrorType.wrong_value_type);
                                }
                            }
                        }
                        return new cNumber(sum);
                    } else {
                        return new cError(cErrorType.wrong_value_type);
                    }
                } else {
                    if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
                        for (var i = 0; i < a.length; i++) {
                            for (var j = 0; j < a[0].length; j++) {
                                for (var k = 0; k < a[0][0].length; k++) {
                                    if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
                                        sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue());
                                    } else {
                                        return new cError(cErrorType.wrong_value_type);
                                    }
                                }
                            }
                        }
                        return new cNumber(sum);
                    } else {
                        return new cError(cErrorType.wrong_value_type);
                    }
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
                return this.value = sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
            }
            if (arg0 instanceof cArea || arg0 instanceof cArray) {
                arg0 = arg0.getMatrix();
            } else {
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
                arg1 = arg1.getMatrix();
            } else {
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            return this.value = sumX2MY2(arg0, arg1, false);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array-1 , array-2 )"
            };
        };
        return r;
    },
    "SUMXMY2": function () {
        var r = new cBaseFunction("SUMXMY2");
        r.setArgumentsMin(2);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function sumX2MY2(a, b, _3d) {
                var sum = 0;
                function a2Mb2(a, b) {
                    return (a - b) * (a - b);
                }
                if (!_3d) {
                    if (a.length == b.length && a[0].length == b[0].length) {
                        for (var i = 0; i < a.length; i++) {
                            for (var j = 0; j < a[0].length; j++) {
                                if (a[i][j] instanceof cNumber && b[i][j] instanceof cNumber) {
                                    sum += a2Mb2(a[i][j].getValue(), b[i][j].getValue());
                                } else {
                                    return new cError(cErrorType.wrong_value_type);
                                }
                            }
                        }
                        return new cNumber(sum);
                    } else {
                        return new cError(cErrorType.wrong_value_type);
                    }
                } else {
                    if (a.length == b.length && a[0].length == b[0].length && a[0][0].length == b[0][0].length) {
                        for (var i = 0; i < a.length; i++) {
                            for (var j = 0; j < a[0].length; j++) {
                                for (var k = 0; k < a[0][0].length; k++) {
                                    if (a[i][j][k] instanceof cNumber && b[i][j][k] instanceof cNumber) {
                                        sum += a2Mb2(a[i][j][k].getValue(), b[i][j][k].getValue());
                                    } else {
                                        return new cError(cErrorType.wrong_value_type);
                                    }
                                }
                            }
                        }
                        return new cNumber(sum);
                    } else {
                        return new cError(cErrorType.wrong_value_type);
                    }
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1];
            if (arg0 instanceof cArea3D && arg1 instanceof cArea3D) {
                return this.value = sumX2MY2(arg0.getMatrix(), arg1.getMatrix(), true);
            }
            if (arg0 instanceof cArea || arg0 instanceof cArray) {
                arg0 = arg0.getMatrix();
            } else {
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            if (arg1 instanceof cArea || arg1 instanceof cArray || arg1 instanceof cArea3D) {
                arg1 = arg1.getMatrix();
            } else {
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    return this.value = new cError(cErrorType.wrong_value_type);
                }
            }
            return this.value = sumX2MY2(arg0, arg1, false);
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( array-1 , array-2 )"
            };
        };
        return r;
    },
    "TAN": function () {
        var r = new cBaseFunction("TAN");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.tan(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.tan(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "TANH": function () {
        var r = new cBaseFunction("TANH");
        r.setArgumentsMin(1);
        r.setArgumentsMax(1);
        r.Calculate = function (arg) {
            var arg0 = arg[0];
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            arg0 = arg0.tocNumber();
            if (arg0 instanceof cError) {
                return this.value = arg0;
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        if (elem instanceof cNumber) {
                            var a = Math.tanh(elem.getValue());
                            this.array[r][c] = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                } else {
                    var a = Math.tanh(arg0.getValue());
                    return this.value = isNaN(a) ? new cError(cErrorType.not_numeric) : new cNumber(a);
                }
            }
            return this.value = arg0;
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "(number)"
            };
        };
        return r;
    },
    "TRUNC": function () {
        var r = new cBaseFunction("TRUNC");
        r.setArgumentsMin(1);
        r.setArgumentsMax(2);
        r.Calculate = function (arg) {
            function truncHelper(a, b) {
                var c = a < 0 ? 1 : 0;
                if (b == 0) {
                    return new cNumber(a.toString().substr(0, 1 + c));
                } else {
                    if (b > 0) {
                        return new cNumber(a.toString().substr(0, b + 2 + c));
                    } else {
                        return new cNumber(0);
                    }
                }
            }
            var arg0 = arg[0],
            arg1 = arg[1] ? arg[1] : new cNumber(0);
            if (arg0 instanceof cArea || arg0 instanceof cArea3D) {
                arg0 = arg0.cross(arguments[1].first);
            }
            if (arg1 instanceof cArea || arg1 instanceof cArea3D) {
                arg1 = arg1.cross(arguments[1].first);
            }
            if (arg0 instanceof cError) {
                return this.value = arg0;
            }
            if (arg1 instanceof cError) {
                return this.value = arg1;
            }
            if (arg0 instanceof cRef || arg0 instanceof cRef3D) {
                arg0 = arg0.getValue();
                if (arg0 instanceof cError) {
                    return this.value = arg0;
                } else {
                    if (arg0 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg0 = arg0.tocNumber();
                    }
                }
            } else {
                arg0 = arg0.tocNumber();
            }
            if (arg1 instanceof cRef || arg1 instanceof cRef3D) {
                arg1 = arg1.getValue();
                if (arg1 instanceof cError) {
                    return this.value = arg1;
                } else {
                    if (arg1 instanceof cString) {
                        return this.value = new cError(cErrorType.wrong_value_type);
                    } else {
                        arg1 = arg1.tocNumber();
                    }
                }
            } else {
                arg1 = arg1.tocNumber();
            }
            if (arg0 instanceof cArray && arg1 instanceof cArray) {
                if (arg0.getCountElement() != arg1.getCountElement() || arg0.getRowCount() != arg1.getRowCount()) {
                    return this.value = new cError(cErrorType.not_available);
                } else {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1.getElementRowCol(r, c);
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = truncHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                }
            } else {
                if (arg0 instanceof cArray) {
                    arg0.foreach(function (elem, r, c) {
                        var a = elem;
                        b = arg1;
                        if (a instanceof cNumber && b instanceof cNumber) {
                            this.array[r][c] = truncHelper(a.getValue(), b.getValue());
                        } else {
                            this.array[r][c] = new cError(cErrorType.wrong_value_type);
                        }
                    });
                    return this.value = arg0;
                } else {
                    if (arg1 instanceof cArray) {
                        arg1.foreach(function (elem, r, c) {
                            var a = arg0;
                            b = elem;
                            if (a instanceof cNumber && b instanceof cNumber) {
                                this.array[r][c] = truncHelper(a.getValue(), b.getValue());
                            } else {
                                this.array[r][c] = new cError(cErrorType.wrong_value_type);
                            }
                        });
                        return this.value = arg1;
                    }
                }
            }
            return this.value = truncHelper(arg0.getValue(), arg1.getValue());
        };
        r.getInfo = function () {
            return {
                name: this.name,
                args: "( x [ , number-digits ] )"
            };
        };
        return r;
    }
};