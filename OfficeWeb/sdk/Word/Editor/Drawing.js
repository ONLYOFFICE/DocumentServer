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
 var Canvas = {
    Width: 597,
    Height: 842,
    GetHtmlElement: function () {
        return document.getElementById("canvas");
    },
    Drawing_Init: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.fillStyle = "rgb(0,0,0)";
        Context.strokeRect(0, 0, this.Width, this.Height);
    },
    Clear: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.clearRect(0, 0, this.Width, this.Height);
        Context.strokeRect(0, 0, this.Width, this.Height);
    },
    Clear2: function (X, Y, W, H) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.clearRect(X + 1, Y, W - 2, H);
        Context.strokeRect(0, 0, this.Width, this.Height);
    },
    BeginPath: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.beginPath();
    },
    MoveTo: function (X, Y) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.moveTo(X, Y);
    },
    LineTo: function (X, Y) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineTo(X, Y);
    },
    ClosePath: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.closePath();
    },
    Stroke: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.stroke();
    },
    SetLineWidth: function (W) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineWidth = W;
    },
    GetLineWidth: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        return Context.lineWidth;
    },
    FillText: function (X, Y, Text) {
        if (UseFontTest) {
            gDrawingCanvasObj.drawChar(Text, X, Y);
        } else {
            var Context = this.GetHtmlElement().getContext("2d");
            Context.fillText(Text, X, Y);
        }
    },
    Measure: function (Text) {
        var Width = 0;
        var Height = 0;
        if (UseFontTest) {
            var Temp = gDrawingCanvasObj.MeasureChar(Text.charCodeAt(0));
            Width = Temp.fAdvanceX;
            Height = 0;
        } else {
            var Context = this.GetHtmlElement().getContext("2d");
            Width = Context.measureText(Text).width;
            Height = 0;
        }
        return {
            Width: Width,
            Height: Height
        };
    },
    GetFont: function () {
        return this.GetHtmlElement().getContext("2d").font;
    },
    SetFont: function (font) {
        if (UseFontTest) {
            var sName, nSize = 12;
            if ("string" == typeof(font)) {
                sName = font;
                nSize = 12;
            } else {
                sName = font.FontFamily;
                nSize = font.FontSize;
            }
            var bItalic = true === font.Italic;
            var bBold = true === font.Bold;
            var oFontStyle = FontStyle.FontStyleRegular;
            if (!bItalic && bBold) {
                oFontStyle = FontStyle.FontStyleBold;
            } else {
                if (bItalic && !bBold) {
                    oFontStyle = FontStyle.FontStyleItalic;
                } else {
                    if (bItalic && bBold) {
                        oFontStyle = FontStyle.FontStyleBoldItalic;
                    }
                }
            }
            if (-1 != sName.indexOf("Arial")) {
                gDrawingCanvasObj.loadFont2("arial", nSize, oFontStyle, 96, 96);
            } else {
                if (-1 != sName.indexOf("Courier")) {
                    gDrawingCanvasObj.loadFont2("cour", nSize, oFontStyle, 96, 96);
                } else {
                    gDrawingCanvasObj.loadFont2("times", nSize, oFontStyle, 96, 96);
                }
            }
        } else {
            if ("string" == typeof(font)) {
                this.GetHtmlElement().getContext("2d").font = font;
            } else {
                if ("object" == typeof(font)) {
                    var sFont = "";
                    if (true === font.Bold) {
                        sFont += "bold ";
                    }
                    if (true === font.Italic) {
                        sFont += "italic ";
                    }
                    sFont += font.FontSize + "pt" + " " + font.FontFamily;
                    this.GetHtmlElement().getContext("2d").font = sFont;
                }
            }
        }
    },
    SetFillStyle: function (style) {
        this.GetHtmlElement().getContext("2d").fillStyle = style;
    },
    GetFillStyle: function () {
        return this.GetHtmlElement().getContext("2d").fillStyle;
    },
    Focus: function () {
        document.getElementById("canvas").focus();
    },
    DrawImage: function (Img, X, Y, W, H) {
        this.GetHtmlElement().getContext("2d").drawImage(Img, X, Y, W, H);
    }
};
var Canvas2 = {
    Font: "",
    Elements: [],
    Width: 597,
    Height: 842,
    GetHtmlElement: function () {
        return document.getElementById("canvas");
    },
    Drawing_Init: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.fillStyle = "rgb(0,0,0)";
        Context.strokeRect(0, 0, this.Width, this.Height);
    },
    Clear: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.clearRect(0, 0, this.Width, this.Height);
        Context.strokeRect(0, 0, this.Width, this.Height);
        for (var Index = 0; Index < this.Elements.length; Index++) {
            document.body.removeChild(this.Elements[Index]);
        }
        this.Elements.length = 0;
    },
    BeginPath: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.beginPath();
    },
    MoveTo: function (X, Y) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.moveTo(X, Y);
    },
    LineTo: function (X, Y) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineTo(X, Y);
    },
    ClosePath: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.closePath();
    },
    Stroke: function () {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.stroke();
    },
    SetLineWidth: function (W) {
        var Context = this.GetHtmlElement().getContext("2d");
        Context.lineWidth = W;
    },
    FillText: function (X, Y, Text) {
        var Div = document.createElement("div");
        Div.innerText = Text;
        Div.style.font = this.Font;
        Div.style.position = "absolute";
        Div.style.left = X;
        Div.style.top = Y;
        document.body.appendChild(Div);
        this.Elements.push(Div);
    },
    Measure: function (Text) {
        var Context = this.GetHtmlElement().getContext("2d");
        var Width = Context.measureText(Text).width;
        var Height = 0;
        return {
            Width: Width,
            Height: Height
        };
    },
    GetFont: function () {
        return this.GetHtmlElement().getContext("2d").font;
    },
    SetFont: function (font) {
        if ("string" == typeof(font)) {
            this.Font = font;
        } else {
            if ("object" == typeof(font)) {
                var sFont = "";
                if (true === font.Bold) {
                    sFont += "bold ";
                }
                if (true === font.Italic) {
                    sFont += "italic ";
                }
                sFont += font.FontSize + "pt" + " " + font.FontFamily;
                this.Font = sFont;
            }
        }
    },
    SetFillStyle: function (style) {
        this.GetHtmlElement().getContext("2d").fillStyle = style;
    },
    Focus: function () {
        document.forms[0].canvas.focus();
    }
};
var Interface = {
    ShowParaMarks: true,
    TextPr: {
        Bold: false,
        Italic: false,
        Underline: false,
        Strikeout: false,
        FontSize: 12,
        FontFamily: {
            Name: "Times New Roman",
            Index: -1
        },
        VertAlign: vertalign_Baseline,
        Color: {
            r: 0,
            g: 0,
            b: 0
        },
        HighLight: highlight_None
    },
    ParaPr: {
        Ind: {
            Line: null,
            Both: false,
            Left: 0,
            Right: 0,
            FirstLine: 0
        }
    },
    SectPr: {
        PgMar: {
            Left: 50,
            Right: 50
        }
    },
    NumPr: {
        Bullet: false,
        Number: false
    },
    FlyTextPr: {
        Div: null,
        X: 0,
        Y: 0,
        W: 0,
        H: 0,
        Show: false
    },
    UpdateNumbering: function (NumPr) {
        for (var Item in NumPr) {
            this.NumPr[Item] = NumPr[Item];
        }
        if (this.NumPr.Bullet) {
            bulletlistpressed = true;
        }
        if (this.NumPr.Number) {
            numberedlistpressed = true;
        }
    },
    UpdateShowParaMarks: function () {
        if (this.ShowParaMarks) {
            document.getElementById("ParaMarks").src = "Images/paragraphMarks_clicked.PNG";
        } else {
            document.getElementById("ParaMarks").src = "Images/paragraphMarks.PNG";
        }
    },
    UpdateTextPr: function (TextPr) {
        if ("undefined" != typeof(TextPr)) {
            if ("undefined" != typeof(TextPr.Bold)) {
                this.TextPr.Bold = TextPr.Bold;
            }
            if ("undefined" != typeof(TextPr.Italic)) {
                this.TextPr.Italic = TextPr.Italic;
            }
            if ("undefined" != typeof(TextPr.Underline)) {
                this.TextPr.Underline = TextPr.Underline;
            }
            if ("undefined" != typeof(TextPr.Strikeout)) {
                this.TextPr.Strikeout = TextPr.Strikeout;
            }
            if ("undefined" != typeof(TextPr.FontSize)) {
                this.TextPr.FontSize = TextPr.FontSize;
            }
            if ("undefined" != typeof(TextPr.FontFamily)) {
                this.TextPr.FontFamily = TextPr.FontFamily;
            }
            if ("undefined" != typeof(TextPr.VertAlign)) {
                this.TextPr.VertAlign = TextPr.VertAlign;
            }
            if ("undefined" != typeof(TextPr.Color)) {
                this.TextPr.Color = TextPr.Color;
            }
            if ("undefined" != typeof(TextPr.HighLight)) {
                this.TextPr.HighLight = TextPr.HighLight;
            }
        }
        this.Internal_UpdateBold();
        this.Internal_UpdateItalic();
        this.Internal_UpdateUnderline();
        this.Internal_UpdateStrikeout();
        this.Internal_UpdateFontSize();
        this.Internal_UpdateFontFamily();
        this.Internal_UpdateVertAlign();
        this.Internal_UpdateColor();
        this.Internal_UpdateHighLight();
    },
    Internal_UpdateVertAlign: function () {},
    Internal_UpdateColor: function () {},
    Internal_UpdateHighLight: function () {
        if (highlight_None === this.TextPr.HighLight) {} else {}
    },
    Internal_UpdateBold: function () {},
    Internal_UpdateItalic: function () {},
    Internal_UpdateUnderline: function () {},
    Internal_UpdateStrikeout: function () {},
    Internal_UpdateFontSize: function () {},
    Internal_UpdateFontFamily: function () {},
    Update_ParaInd: function (Ind) {
        if ("undefined" != typeof(Ind)) {
            if ("undefined" != typeof(Ind.FirstLine)) {
                this.ParaPr.Ind.FirstLine = Ind.FirstLine;
            }
            if ("undefined" != typeof(Ind.Left)) {
                this.ParaPr.Ind.Left = Ind.Left;
            }
            if ("undefined" != typeof(Ind.Right)) {
                this.ParaPr.Ind.Right = Ind.Right;
            }
        }
        this.Internal_Update_Ind_Left();
        this.Internal_Update_Ind_FirstLine();
        this.Internal_Update_Ind_Right();
    },
    Internal_Update_Ind_FirstLine: function () {
        oWordControl.m_oHorRuler.m_dIndentLeftFirst = (this.ParaPr.Ind.FirstLine + this.ParaPr.Ind.Left);
        oWordControl.UpdateHorRuler();
    },
    Internal_Update_Ind_Left: function () {
        oWordControl.m_oHorRuler.m_dIndentLeft = this.ParaPr.Ind.Left;
        oWordControl.UpdateHorRuler();
    },
    Internal_Update_Ind_Right: function () {
        oWordControl.m_oHorRuler.m_dIndentRight = this.ParaPr.Ind.Right;
        oWordControl.UpdateHorRuler();
    },
    FlyTextPr_Init: function (X, Y) {
        this.FlyTextPr_Remove();
        var DivW = 172 + 2 + 4;
        var DivH = 54 + 2 + 4;
        var DivY = Y - 30 - DivH;
        var DivX = X;
        var Div = document.createElement("div");
        Div.id = "FlyTextPr";
        Div.style.position = "absolute";
        Div.style.left = X + 50;
        Div.style.top = DivY + 100;
        Div.style.width = 172;
        Div.style.height = 54;
        Div.style.border = "1px solid silver";
        Div.style.padding = 2;
        Div.style.backgroundColor = "#fff";
        Div.style.zIndex = 100;
        Div.innerHTML = '<input id="FlyTextPr_Input_FontFamily" style="float:left;width:130;height:30;margin-right:2px;margin-bottom: 2px" type="text" value="Arial" onchange="Actions_SetFontFamily( this.value );"/>                          <input id="FlyTextPr_Input_FontSize" style="float:left;width:40;height:30;margin-bottom: 2px" type="text" value="10" onChange="Actions_SetFontSize( this.value );"/>                          <img id="FlyTextPr_Text_Bold" style="float:left;" src="Images/bold.png" onclick="Actions_TextPr(\'Bold\')"/>                          <img id="FlyTextPr_Text_Italic" style="float:left;" src="Images/italic.png" onclick="Actions_TextPr(\'Italic\')"/>                          <img id="FlyTextPr_Text_Underline" style="float:left;" src="Images/underline.png" onclick="Actions_TextPr(\'Underline\')"/>                          <img id="FlyTextPr_Text_Strikeout" style="float:left;" src="Images/strikeout.png" onclick="Actions_TextPr(\'Strikeout\')"/>';
        document.body.appendChild(Div);
        this.FlyTextPr.Div = Div;
        this.FlyTextPr.X = X;
        this.FlyTextPr.Y = DivY;
        this.FlyTextPr.W = DivW;
        this.FlyTextPr.H = DivH;
        this.FlyTextPr.Show = false;
        this.UpdateTextPr();
    },
    FlyTextPr_Remove: function () {
        try {
            if (null != this.FlyTextPr.Div) {
                document.body.removeChild(this.FlyTextPr.Div);
                this.FlyTextPr.Div = null;
                this.FlyTextPr.X = 0;
                this.FlyTextPr.Y = 0;
                this.FlyTextPr.W = 0;
                this.FlyTextPr.H = 0;
                this.FlyTextPr.Show = false;
            }
        } catch(e) {}
    },
    FlyTextPr_SetOpacity: function (X, Y) {
        if (null != this.FlyTextPr.Div) {
            var Diff = -1;
            if (X < this.FlyTextPr.X) {
                if (Y < this.FlyTextPr.Y) {
                    Diff = Math.max(this.FlyTextPr.Y - Y, this.FlyTextPr.X - X);
                } else {
                    if (Y > this.FlyTextPr.Y + this.FlyTextPr.H) {
                        Diff = Math.max(Y - this.FlyTextPr.Y - this.FlyTextPr.H, this.FlyTextPr.X - X);
                    } else {
                        Diff = this.FlyTextPr.X - X;
                    }
                }
            } else {
                if (X > this.FlyTextPr.X + this.FlyTextPr.W) {
                    if (Y < this.FlyTextPr.Y) {
                        Diff = Math.max(this.FlyTextPr.Y - Y, X - this.FlyTextPr.X - this.FlyTextPr.W);
                    } else {
                        if (Y > this.FlyTextPr.Y + this.FlyTextPr.H) {
                            Diff = Math.max(Y - this.FlyTextPr.Y - this.FlyTextPr.H, X - this.FlyTextPr.X - this.FlyTextPr.W);
                        } else {
                            Diff = X - this.FlyTextPr.X - this.FlyTextPr.W;
                        }
                    }
                } else {
                    if (Y < this.FlyTextPr.Y) {
                        Diff = this.FlyTextPr.Y - Y;
                    } else {
                        if (Y > this.FlyTextPr.Y + this.FlyTextPr.H) {
                            Diff = Y - this.FlyTextPr.Y - this.FlyTextPr.H;
                        } else {
                            Diff = 0;
                        }
                    }
                }
            }
            var Div = this.FlyTextPr.Div;
            if (Diff > 150) {
                this.FlyTextPr_Remove();
            } else {
                if (Diff > 0) {
                    if (true == this.FlyTextPr.Show) {
                        Div.style.opacity = Math.max((100 - Diff) / 100, 0);
                    } else {
                        Div.style.opacity = Math.max((35 - Diff) / 35, 0);
                    }
                } else {
                    Div.style.opacity = 1;
                    this.FlyTextPr.Show = true;
                }
            }
        }
    },
    Ind_Init: function () {},
    Ind_MarginLine_Init: function (X, Y, Height) {
        this.Ind_MarginLine_Remove();
        var DivW = 1;
        var DivH = Height;
        var DivY = Y;
        var DivX = X;
        var Div = document.createElement("div");
        Div.style.position = "absolute";
        Div.style.left = DivX + 50;
        Div.style.top = DivY + 100;
        Div.style.width = DivW;
        Div.style.height = DivH;
        Div.style.borderLeft = "1px dashed black";
        Div.style.zIndex = 100;
        document.body.appendChild(Div);
        this.ParaPr.Ind.Line = Div;
    },
    Ind_MarginLine_Remove: function () {
        if (null != this.ParaPr.Ind.Line) {
            document.body.removeChild(this.ParaPr.Ind.Line);
            this.ParaPr.Ind.Line = null;
        }
    },
    Ind_MarginLine_Move: function (X, Y) {
        if (null != this.ParaPr.Ind.Line) {
            var Div = this.ParaPr.Ind.Line;
            Div.style.left = X + 50;
            Div.style.top = Y + 100;
        }
    },
    Update_ParaAlign: function (Align) {},
    Update_ParaSpacing: function (Spacing) {},
    Update_ParaStyleName: function (StyleName) {},
    Update_ParaShd: function (Shd) {
        switch (Shd.Value) {
        case shd_Nil:
            break;
        case shd_Clear:
            break;
        }
    }
};
function Drawing_Target_Draw() {
    if ("block" != document.getElementById("Target").style.display) {
        document.getElementById("Target").style.display = "block";
    } else {
        document.getElementById("Target").style.display = "none";
    }
}
var Target = {
    IntervalId: null,
    Size: 10,
    Show: false,
    GetHtmlElement: function () {
        return document.getElementById("Target");
    },
    Update: function (X, Y) {
        var Targ = this.GetHtmlElement();
        Targ.style.left = X + 50;
        Targ.style.top = Y + 100 - this.Size;
    },
    SetSize: function (newSize) {
        var Targ = this.GetHtmlElement();
        this.Size = newSize;
        Targ.style.height = (Number(this.Size) + Number(0.3 * this.Size));
    },
    Drawing_Init: function () {
        if (this.IntervalId) {
            clearInterval(this.IntervalId);
        }
        this.IntervalId = setInterval(Drawing_Target_Draw, 500);
        this.Show = true;
    },
    Drawing_Remove: function () {
        clearInterval(this.IntervalId);
        this.GetHtmlElement().style.display = "none";
        this.Show = false;
    }
};
var Cursor = {
    Locked: false,
    Set_Type: function (Type) {
        if (true != this.Locked) {
            Canvas.GetHtmlElement().style.cursor = Type;
        }
    },
    Lock: function () {
        this.Locked = true;
    },
    Unlock: function () {
        this.Locked = false;
    }
};
var Drag = {
    obj: null,
    init: function (o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper) {
        o.onmousedown = Drag.start;
        o.hmode = bSwapHorzRef ? false : true;
        o.vmode = bSwapVertRef ? false : true;
        o.root = oRoot && oRoot != null ? oRoot : o;
        if (o.hmode && isNaN(parseInt(o.root.style.left))) {
            o.root.style.left = "0px";
        }
        if (o.vmode && isNaN(parseInt(o.root.style.top))) {
            o.root.style.top = "350px";
        }
        if (!o.hmode && isNaN(parseInt(o.root.style.right))) {
            o.root.style.right = "0px";
        }
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) {
            o.root.style.bottom = "0px";
        }
        o.minX = typeof minX != "undefined" ? minX : null;
        o.minY = typeof minY != "undefined" ? minY : null;
        o.maxX = typeof maxX != "undefined" ? maxX : null;
        o.maxY = typeof maxY != "undefined" ? maxY : null;
        o.xMapper = fXMapper ? fXMapper : null;
        o.yMapper = fYMapper ? fYMapper : null;
        o.root.onDragStart = new Function();
        o.root.onDragEnd = new Function();
        o.root.onDrag = new Function();
    },
    start: function (e) {
        var o = Drag.obj = this;
        e = Drag.fixE(e);
        var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right);
        o.root.onDragStart(x, y);
        o.lastMouseX = e.clientX;
        o.lastMouseY = e.clientY;
        if (o.hmode) {
            if (o.minX != null) {
                o.minMouseX = e.clientX - x + o.minX;
            }
            if (o.maxX != null) {
                o.maxMouseX = o.minMouseX + o.maxX - o.minX;
            }
        } else {
            if (o.minX != null) {
                o.maxMouseX = -o.minX + e.clientX + x;
            }
            if (o.maxX != null) {
                o.minMouseX = -o.maxX + e.clientX + x;
            }
        }
        if (o.vmode) {
            if (o.minY != null) {
                o.minMouseY = e.clientY - y + o.minY;
            }
            if (o.maxY != null) {
                o.maxMouseY = o.minMouseY + o.maxY - o.minY;
            }
        } else {
            if (o.minY != null) {
                o.maxMouseY = -o.minY + e.clientY + y;
            }
            if (o.maxY != null) {
                o.minMouseY = -o.maxY + e.clientY + y;
            }
        }
        document.onmousemove = Drag.drag;
        document.onmouseup = Drag.end;
        return false;
    },
    drag: function (e) {
        e = Drag.fixE(e);
        var o = Drag.obj;
        var ey = e.clientY;
        var ex = e.clientX;
        var y = parseInt(o.vmode ? o.root.style.top : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right);
        var nx, ny;
        if (o.minX != null) {
            ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
        }
        if (o.maxX != null) {
            ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
        }
        if (o.minY != null) {
            ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
        }
        if (o.maxY != null) {
            ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);
        }
        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));
        if (o.xMapper) {
            nx = o.xMapper(y);
        } else {
            if (o.yMapper) {
                ny = o.yMapper(x);
            }
        }
        if (o.hmode) {
            Drag.obj.root.style.left = nx + "px";
        } else {
            Drag.obj.root.style.right = nx + "px";
        }
        if (o.vmode) {
            Drag.obj.root.style.top = ny + "px";
        } else {
            Drag.obj.root.style.bottom = ny + "px";
        }
        Drag.obj.lastMouseX = ex;
        Drag.obj.lastMouseY = ey;
        Drag.obj.root.onDrag(nx, ny);
        return false;
    },
    end: function () {
        document.onmousemove = null;
        document.onmouseup = null;
        var x_pos = parseInt(Drag.obj.hmode ? Drag.obj.root.style.left : Drag.obj.root.style.right);
        var y_pos = parseInt(Drag.obj.vmode ? Drag.obj.root.style.top : Drag.obj.root.style.bottom);
        Drag.obj.root.onDragEnd(x_pos, y_pos);
        Drag.obj = null;
    },
    fixE: function (e) {
        if (typeof e == "undefined") {
            e = window.event;
        }
        if (typeof e.layerX == "undefined") {
            e.layerX = e.offsetX;
        }
        if (typeof e.layerY == "undefined") {
            e.layerY = e.offsetY;
        }
        return e;
    }
};