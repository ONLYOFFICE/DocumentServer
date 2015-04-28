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
var g_bIsAppleDevices = AscBrowser.isAppleDevices;
function get_raster_bounds(data, width, height, stride) {
    var ret = {
        dist_l: 0,
        dist_t: 0,
        dist_r: 0,
        dist_b: 0
    };
    var bIsBreak = false;
    for (var i = 0; i < width; i++) {
        var _ind = i * 4 + 3;
        for (var j = 0; j < height; j++, _ind += stride) {
            if (data[_ind] != 0) {
                bIsBreak = true;
                break;
            }
        }
        if (bIsBreak) {
            break;
        }
        ret.dist_l++;
    }
    bIsBreak = false;
    for (var i = width - 1; i >= 0; i--) {
        var _ind = i * 4 + 3;
        for (var j = 0; j < height; j++, _ind += stride) {
            if (data[_ind] != 0) {
                bIsBreak = true;
                break;
            }
        }
        if (bIsBreak) {
            break;
        }
        ret.dist_r++;
    }
    var bIsBreak = false;
    for (var j = 0; j < height; j++) {
        var _ind = j * stride + 3;
        for (var i = 0; i < width; i++, _ind += 4) {
            if (data[_ind] != 0) {
                bIsBreak = true;
                break;
            }
        }
        if (bIsBreak) {
            break;
        }
        ret.dist_t++;
    }
    var bIsBreak = false;
    for (var j = height - 1; j >= 0; j--) {
        var _ind = j * stride + 3;
        for (var i = 0; i < width; i++, _ind += 4) {
            if (data[_ind] != 0) {
                bIsBreak = true;
                break;
            }
        }
        if (bIsBreak) {
            break;
        }
        ret.dist_b++;
    }
    if (null != raster_memory.m_oBuffer) {
        var nIndexDst = 3;
        var nPitch = 4 * (raster_memory.width - width);
        var dst = raster_memory.m_oBuffer.data;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                dst[nIndexDst] = 0;
                nIndexDst += 4;
            }
            nIndexDst += nPitch;
        }
    }
    return ret;
}
function CGlyphData() {
    this.m_oCanvas = null;
    this.m_oContext = null;
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.RasterData = null;
    this.TempImage = null;
}
CGlyphData.prototype = {
    init: function (width, height) {
        if (width == 0 || height == 0) {
            return;
        }
        this.m_oCanvas = document.createElement("canvas");
        this.m_oCanvas.width = width;
        this.m_oCanvas.height = height;
        this.m_oContext = this.m_oCanvas.getContext("2d");
        this.m_oContext.globalCompositeOperation = "source-atop";
    },
    checkColor: function (r, g, b, w, h) {
        if ((r == this.R) && (g == this.G) && (b == this.B)) {
            return;
        }
        if (!g_bIsAppleDevices) {
            this.R = r;
            this.G = g;
            this.B = b;
            if (this.m_oCanvas != null) {
                this.m_oContext.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
                this.m_oContext.fillRect(0, 0, w, h);
            } else {
                var _raster = this.RasterData;
                _raster.Chunk.CanvasCtx.fillStyle = "rgb(" + this.R + "," + this.G + "," + this.B + ")";
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;
                this.RasterData.Chunk.CanvasCtx.fillRect(_x, _y, w, h);
            }
        } else {
            var _r = r;
            var _g = g;
            var _b = b;
            this.TempImage = document.createElement("canvas");
            this.TempImage.width = w;
            this.TempImage.height = h;
            var ctxD = this.TempImage.getContext("2d");
            var pixDst = null;
            if (this.m_oCanvas != null) {
                pixDst = this.m_oContext.getImageData(0, 0, w, h);
                var dataPx = pixDst.data;
                var cur = 0;
                var cnt = w * h;
                for (var i = 0; i < cnt; i++) {
                    dataPx[cur++] = _r;
                    dataPx[cur++] = _g;
                    dataPx[cur++] = _b;
                    cur++;
                }
            } else {
                var _raster = this.RasterData;
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;
                pixDst = _raster.Chunk.CanvasCtx.getImageData(_x, _y, w, h);
                var dataPx = pixDst.data;
                var cur = 0;
                var cnt = w * h;
                for (var i = 0; i < cnt; i++) {
                    dataPx[cur++] = _r;
                    dataPx[cur++] = _g;
                    dataPx[cur++] = _b;
                    cur++;
                }
            }
            ctxD.putImageData(pixDst, 0, 0, 0, 0, w, h);
        }
    }
};
function TGlyphBitmap() {
    this.nX = 0;
    this.nY = 0;
    this.nWidth = 0;
    this.nHeight = 0;
    this.oGlyphData = new CGlyphData();
}
TGlyphBitmap.prototype = {
    fromAlphaMask: function (font_manager) {
        var bIsCanvas = false;
        var _chunk_size = (font_manager.RasterMemory == null) ? 0 : font_manager.RasterMemory.ChunkHeapSize;
        if (Math.max(this.nWidth, this.nHeight) > (_chunk_size / 10)) {
            bIsCanvas = true;
        }
        var _x = 0;
        var _y = 0;
        var ctx = null;
        if (bIsCanvas) {
            this.oGlyphData.init(this.nWidth, this.nHeight);
            ctx = this.oGlyphData.m_oContext;
        } else {
            this.oGlyphData.RasterData = font_manager.RasterMemory.Alloc(this.nWidth, this.nHeight);
            ctx = this.oGlyphData.RasterData.Chunk.CanvasCtx;
            _x = this.oGlyphData.RasterData.Line.Height * this.oGlyphData.RasterData.Index;
            _y = this.oGlyphData.RasterData.Line.Y;
        }
        if (true) {
            ctx.putImageData(raster_memory.m_oBuffer, _x, _y, 0, 0, this.nWidth, this.nHeight);
        } else {
            var gamma = 1.1;
            var nIndexDst = 3;
            var nPitch = 4 * (raster_memory.width - this.nWidth);
            var dst = raster_memory.m_oBuffer.data;
            for (var j = 0; j < this.nHeight; j++) {
                for (var i = 0; i < this.nWidth; i++) {
                    dst[nIndexDst] = Math.min(parseInt(dst[nIndexDst] * gamma), 255);
                    nIndexDst += 4;
                }
                nIndexDst += nPitch;
            }
            ctx.putImageData(raster_memory.m_oBuffer, _x, _y, 0, 0, this.nWidth, this.nHeight);
        }
        if (null != raster_memory.m_oBuffer) {
            var nIndexDst = 3;
            var nPitch = 4 * (raster_memory.width - this.nWidth);
            var dst = raster_memory.m_oBuffer.data;
            for (var j = 0; j < this.nHeight; j++) {
                for (var i = 0; i < this.nWidth; i++) {
                    dst[nIndexDst] = 0;
                    nIndexDst += 4;
                }
                nIndexDst += nPitch;
            }
        }
    },
    draw: function (context2D, x, y) {
        var nW = this.nWidth;
        var nH = this.nHeight;
        if (null != this.oGlyphData.TempImage) {
            context2D.drawImage(this.oGlyphData.TempImage, 0, 0, nW, nH, x, y, nW, nH);
            this.oGlyphData.TempImage = null;
        } else {
            if (null != this.oGlyphData.m_oCanvas) {
                context2D.drawImage(this.oGlyphData.m_oCanvas, 0, 0, nW, nH, x, y, nW, nH);
            } else {
                var _raster = this.oGlyphData.RasterData;
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;
                context2D.drawImage(_raster.Chunk.CanvasImage, _x, _y, nW, nH, x, y, nW, nH);
            }
        }
    },
    drawCrop: function (context2D, x, y, w, h, cx) {
        if (null != this.oGlyphData.TempImage) {
            context2D.drawImage(this.oGlyphData.TempImage, cx, 0, w, h, x, y, w, h);
            this.oGlyphData.TempImage = null;
        } else {
            if (null != this.oGlyphData.m_oCanvas) {
                context2D.drawImage(this.oGlyphData.m_oCanvas, cx, 0, w, h, x, y, w, h);
            } else {
                var _raster = this.oGlyphData.RasterData;
                var _x = _raster.Line.Height * _raster.Index;
                var _y = _raster.Line.Y;
                context2D.drawImage(_raster.Chunk.CanvasImage, _x + cx, _y, w, h, x, y, w, h);
            }
        }
    },
    drawCropInRect: function (context2D, x, y, clipRect) {
        var _x = x;
        var _y = y;
        var _r = x + this.nWidth;
        var _b = y + this.nHeight;
        var _dstX = 0;
        var _dstY = 0;
        var _dstW = this.nWidth;
        var _dstH = this.nHeight;
        if (_x < clipRect.l) {
            _dstX = clipRect.l - _x;
            _x += _dstX;
            _dstW -= _dstX;
        }
        if (_y < clipRect.t) {
            _dstY = clipRect.t - _y;
            _y += _dstY;
            _dstH -= _dstY;
        }
        if (_r > clipRect.r) {
            _dstW -= (_r - clipRect.r);
        }
        if (_b > clipRect.b) {
            _dstH -= (_b - clipRect.b);
        }
        if (_dstW <= 0 || _dstH <= 0) {
            return;
        }
        if (null != this.oGlyphData.TempImage) {
            context2D.drawImage(this.oGlyphData.TempImage, _dstX, _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
            this.oGlyphData.TempImage = null;
        } else {
            if (null != this.oGlyphData.m_oCanvas) {
                context2D.drawImage(this.oGlyphData.m_oCanvas, _dstX, _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
            } else {
                var _raster = this.oGlyphData.RasterData;
                var __x = _raster.Line.Height * _raster.Index;
                var __y = _raster.Line.Y;
                context2D.drawImage(_raster.Chunk.CanvasImage, __x + _dstX, __y + _dstY, _dstW, _dstH, _x, _y, _dstW, _dstH);
            }
        }
    },
    Free: function () {
        if (null != this.oGlyphData.RasterData) {
            this.oGlyphData.RasterData.Chunk.Free(this.oGlyphData.RasterData);
        }
    }
};
function CRasterHeapLineFree() {
    this.Y = 0;
    this.Height = 0;
}
function CRasterDataInfo() {
    this.Chunk = null;
    this.Line = null;
    this.Index = 0;
}
function CRasterHeapLine() {
    this.Y = 0;
    this.Height = 0;
    this.Count = 0;
    this.CountBusy = 0;
    this.Images = null;
    this.Index = 0;
}
CRasterHeapLine.prototype = {
    CreatePlaces: function (width, height, widthLine) {
        this.Height = height;
        this.Count = (widthLine / width) >> 0;
        var _size = this.Count;
        var arr = null;
        if (typeof(Int8Array) != "undefined" && !window.opera) {
            arr = new Int8Array(_size);
        } else {
            arr = new Array(_size);
        }
        for (var i = 0; i < _size; i++) {
            arr[i] = 0;
        }
        this.Images = arr;
    },
    Alloc: function () {
        if (this.Count == this.CountBusy) {
            return -1;
        }
        var arr = this.Images;
        if (arr[this.CountBusy] == 0) {
            arr[this.CountBusy] = 1;
            this.CountBusy += 1;
            return this.CountBusy - 1;
        }
        var _len = this.Count;
        for (var i = 0; i < _len; i++) {
            if (arr[i] == 0) {
                arr[i] = 1;
                this.CountBusy += 1;
                return i;
            }
        }
        return -1;
    },
    Free: function (index) {
        if (this.Images[index] == 1) {
            this.Images[index] = 0;
            this.CountBusy -= 1;
        }
        return this.CountBusy;
    }
};
function CRasterHeapChuck() {
    this.CanvasImage = null;
    this.CanvasCtx = null;
    this.Width = 0;
    this.Height = 0;
    this.LinesFree = [];
    this.LinesBusy = [];
    this.CurLine = null;
    this.FindOnlyEqualHeight = false;
}
CRasterHeapChuck.prototype = {
    Create: function (width, height) {
        this.Width = width;
        this.Height = height;
        this.CanvasImage = document.createElement("canvas");
        this.CanvasImage.width = width;
        this.CanvasImage.height = height;
        this.CanvasCtx = this.CanvasImage.getContext("2d");
        this.CanvasCtx.globalCompositeOperation = "source-atop";
        var _freeLine = new CRasterHeapLineFree();
        _freeLine.Y = 0;
        _freeLine.Height = this.Height;
        this.LinesFree[0] = _freeLine;
    },
    Clear: function () {
        this.LinesBusy.splice(0, this.LinesBusy.length);
        this.LinesFree.splice(0, this.LinesFree.length);
        var _freeLine = new CRasterHeapLineFree();
        _freeLine.Y = 0;
        _freeLine.Height = this.Height;
        this.LinesFree[0] = _freeLine;
    },
    Alloc: function (width, height) {
        var _need_height = Math.max(width, height);
        var _busy_len = this.LinesBusy.length;
        for (var i = 0; i < _busy_len; i++) {
            var _line = this.LinesBusy[i];
            if (_line.Height >= _need_height) {
                var _index = _line.Alloc();
                if (-1 != _index) {
                    var _ret = new CRasterDataInfo();
                    _ret.Chunk = this;
                    _ret.Line = _line;
                    _ret.Index = _index;
                    return _ret;
                }
            }
        }
        var _need_height1 = (3 * _need_height) >> 1;
        if (this.FindOnlyEqualHeight) {
            _need_height1 = _need_height;
        }
        var _free_len = this.LinesFree.length;
        var _index_found_koef1 = -1;
        for (var i = 0; i < _free_len; i++) {
            var _line = this.LinesFree[i];
            if (_line.Height >= _need_height1) {
                var _new_line = new CRasterHeapLine();
                _new_line.CreatePlaces(_need_height1, _need_height1, this.Width);
                _new_line.Y = _line.Y;
                _new_line.Index = this.LinesBusy.length;
                this.LinesBusy.push(_new_line);
                _line.Y += _need_height1;
                _line.Height -= _need_height1;
                if (_line.Height == 0) {
                    this.LinesFree.splice(i, 1);
                }
                var _ret = new CRasterDataInfo();
                _ret.Chunk = this;
                _ret.Line = _new_line;
                _ret.Index = _new_line.Alloc();
                return _ret;
            } else {
                if (_line.Height >= _need_height && -1 == _index_found_koef1) {
                    _index_found_koef1 = i;
                }
            }
        }
        if (-1 != _index_found_koef1) {
            var _line = this.LinesFree[_index_found_koef1];
            var _new_line = new CRasterHeapLine();
            _new_line.CreatePlaces(_need_height, _need_height, this.Width);
            _new_line.Y = _line.Y;
            _new_line.Index = this.LinesBusy.length;
            this.LinesBusy.push(_new_line);
            _line.Y += _need_height;
            _line.Height -= _need_height;
            if (_line.Height == 0) {
                this.LinesFree.splice(i, 1);
            }
            var _ret = new CRasterDataInfo();
            _ret.Chunk = this;
            _ret.Line = _new_line;
            _ret.Index = _new_line.Alloc();
            return _ret;
        }
        return null;
    },
    Free: function (obj) {
        var _refs = obj.Line.Free(obj.Index);
        if (_refs == 0) {
            var _line = obj.Line;
            this.LinesBusy.splice(_line.Index, 1);
            var _lines_busy = this.LinesBusy;
            var _busy_len = _lines_busy.length;
            for (var i = _line.Index; i < _busy_len; i++) {
                _lines_busy[i].Index = i;
            }
            var y1 = _line.Y;
            var y2 = _line.Y + _line.Height;
            var _lines_free = this.LinesFree;
            var _free_len = _lines_free.length;
            var _ind_prev = -1;
            var _ind_next = -1;
            for (var i = 0; i < _free_len; i++) {
                var _line_f = _lines_free[i];
                if (-1 == _ind_prev) {
                    if (y1 == (_line_f.Y + _line_f.Height)) {
                        _ind_prev = i;
                    }
                } else {
                    if (-1 == _ind_next) {
                        if (y2 == _line_f.Y) {
                            _ind_next = i;
                        }
                    } else {
                        break;
                    }
                }
            }
            if (-1 != _ind_prev && -1 != _ind_next) {
                _lines_free[_ind_prev].Height += (_line.Height + _lines_free[_ind_next].Height);
                _lines_free.splice(_ind_next, 1);
            } else {
                if (-1 != _ind_prev) {
                    _lines_free[_ind_prev].Height += _line.Height;
                } else {
                    if (-1 != _ind_next) {
                        _lines_free[_ind_next].Y -= _line.Height;
                        _lines_free[_ind_next].Height += _line.Height;
                    } else {
                        var _new_line = new CRasterHeapLineFree();
                        _new_line.Y = _line.Y;
                        _new_line.Height = _line.Height;
                        _lines_free.push(_new_line);
                    }
                }
            }
            _line = null;
        }
    }
};
function CRasterHeapTotal(_size) {
    this.ChunkHeapSize = (undefined === _size) ? 3000 : _size;
    this.Chunks = [];
}
CRasterHeapTotal.prototype = {
    Clear: function () {
        var _len = this.Chunks.length;
        for (var i = 0; i < _len; i++) {
            this.Chunks[i].Clear();
        }
        if (_len > 1) {
            this.Chunks.splice(1, _len - 1);
        }
    },
    Alloc: function (width, height) {
        var _len = this.Chunks.length;
        for (var i = 0; i < _len; i++) {
            var _ret = this.Chunks[i].Alloc(width, height);
            if (null != _ret) {
                return _ret;
            }
        }
        this.HeapAlloc(this.ChunkHeapSize, this.ChunkHeapSize);
        return this.Chunks[_len].Alloc(width, height);
    },
    HeapAlloc: function (width, height) {
        var _chunk = new CRasterHeapChuck();
        _chunk.Create(width, height);
        this.Chunks[this.Chunks.length] = _chunk;
    },
    CreateFirstChuck: function (_w, _h) {
        if (0 == this.Chunks.length) {
            this.Chunks[0] = new CRasterHeapChuck();
            this.Chunks[0].Create((undefined == _w) ? this.ChunkHeapSize : _w, (undefined == _h) ? this.ChunkHeapSize : _h);
        }
    }
};
function LoadFontFile(library, stream_index, name, faceindex) {
    var args = new FT_Open_Args();
    args.flags = 2;
    args.stream = g_fonts_streams[stream_index];
    var face = library.FT_Open_Face(args, faceindex);
    if (null == face) {
        return null;
    }
    var font = new CFontFile(name, faceindex);
    font.m_lUnits_Per_Em = face.units_per_EM;
    font.m_lAscender = face.ascender;
    font.m_lDescender = face.descender;
    font.m_lLineHeight = face.height;
    if (window["USE_FONTS_WIN_PARAMS"] === true && face.horizontal && face.os2 && face.os2.version != 65535) {
        var bIsUseWin = false;
        if (face.horizontal.Ascender == 0 || face.horizontal.Descender == 0) {
            bIsUseWin = true;
        }
        if (face.os2.sTypoAscender == 0 || face.os2.sTypoDescender == 0) {
            bIsUseWin = true;
        }
        var _h1 = face.horizontal.Ascender - face.horizontal.Descender + face.horizontal.Line_Gap;
        var _h2 = face.os2.sTypoAscender - face.os2.sTypoDescender + face.os2.sTypoLineGap;
        var _h3 = face.os2.usWinAscent + face.os2.usWinDescent;
        if (_h1 != _h2 && _h2 != _h3 && _h1 != _h3 && (_h3 > _h1 && _h3 > _h2)) {
            bIsUseWin = true;
        }
        if (bIsUseWin) {
            font.m_lAscender = face.os2.usWinAscent;
            font.m_lDescender = -face.os2.usWinDescent;
            font.m_lLineHeight = face.os2.usWinAscent + face.os2.usWinDescent;
        }
    }
    font.m_nNum_charmaps = face.num_charmaps;
    font.m_pFace = face;
    font.LoadDefaultCharAndSymbolicCmapIndex();
    font.m_nError = FT_Set_Char_Size(face, 0, font.m_fSize * 64, 0, 0);
    if (!font.IsSuccess()) {
        font = null;
        face = null;
        return null;
    }
    font.ResetTextMatrix();
    font.ResetFontMatrix();
    if (true === font.m_bUseKerning) {
        font.m_bUseKerning = ((face.face_flags & 64) != 0 ? true : false);
    }
    return font;
}
function CFontFilesCache() {
    this.m_oLibrary = null;
    this.m_lMaxSize = 1000;
    this.m_lCurrentSize = 0;
    this.Fonts = {};
    this.LockFont = function (stream_index, fontName, faceIndex, fontSize, _ext) {
        var key = fontName + faceIndex + fontSize;
        if (undefined !== _ext) {
            key += _ext;
        }
        var pFontFile = this.Fonts[key];
        if (pFontFile) {
            return pFontFile;
        }
        pFontFile = this.Fonts[key] = LoadFontFile(this.m_oLibrary, stream_index, fontName, faceIndex);
        return pFontFile;
    };
}
function CDefaultFont() {
    this.m_oLibrary = null;
    this.m_arrDefaultFont = new Array(4);
    this.SetDefaultFont = function (sFamilyName) {
        var fontInfo = g_fontApplication.GetFontInfo(sFamilyName);
        var font = null;
        var _defaultIndex = fontInfo.indexR;
        if (-1 == _defaultIndex) {
            _defaultIndex = fontInfo.indexI;
        }
        if (-1 == _defaultIndex) {
            _defaultIndex = fontInfo.indexB;
        }
        if (-1 == _defaultIndex) {
            _defaultIndex = fontInfo.indexBI;
        }
        var _indexR = fontInfo.indexR != -1 ? fontInfo.indexR : _defaultIndex;
        var _indexI = fontInfo.indexI != -1 ? fontInfo.indexI : _defaultIndex;
        var _indexB = fontInfo.indexB != -1 ? fontInfo.indexB : _defaultIndex;
        var _indexBI = fontInfo.indexBI != -1 ? fontInfo.indexBI : _defaultIndex;
        font = window.g_font_infos[_indexR];
        this.m_arrDefaultFont[0] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexR);
        this.m_arrDefaultFont[0].UpdateStyles(false, false);
        font = window.g_font_infos[_indexB];
        this.m_arrDefaultFont[1] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexB);
        this.m_arrDefaultFont[1].UpdateStyles(true, false);
        font = window.g_font_infos[_indexI];
        this.m_arrDefaultFont[2] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexI);
        this.m_arrDefaultFont[2].UpdateStyles(false, true);
        font = window.g_font_infos[_indexBI];
        this.m_arrDefaultFont[3] = this.m_oLibrary.LoadFont(font.stream_index, font.id, fontInfo.faceIndexBI);
        this.m_arrDefaultFont[3].UpdateStyles(true, true);
    };
    this.GetDefaultFont = function (bBold, bItalic) {
        var nIndex = (bBold ? 1 : 0) + (bItalic ? 2 : 0);
        return this.m_arrDefaultFont[nIndex];
    };
}
var FONT_ITALIC_ANGLE = 0.3090169943749;
var FT_ENCODING_UNICODE = 1970170211;
var FT_ENCODING_NONE = 0;
var FT_ENCODING_MS_SYMBOL = 1937337698;
var FT_ENCODING_APPLE_ROMAN = 1634889070;
var LOAD_MODE = 40970;
var REND_MODE = 0;
var FontStyle = {
    FontStyleRegular: 0,
    FontStyleBold: 1,
    FontStyleItalic: 2,
    FontStyleBoldItalic: 3,
    FontStyleUnderline: 4,
    FontStyleStrikeout: 8
};
var EGlyphState = {
    glyphstateNormal: 0,
    glyphstateDeafault: 1,
    glyphstateMiss: 2
};
function CPoint1() {
    this.fX = 0;
    this.fY = 0;
    this.fWidth = 0;
    this.fHeight = 0;
}
function CPoint2() {
    this.fLeft = 0;
    this.fTop = 0;
    this.fRight = 0;
    this.fBottom = 0;
}
function TMetrics() {
    this.fWidth = 0;
    this.fHeight = 0;
    this.fHoriBearingX = 0;
    this.fHoriBearingY = 0;
    this.fHoriAdvance = 0;
    this.fVertBearingX = 0;
    this.fVertBearingY = 0;
    this.fVertAdvance = 0;
}
function TGlyph() {
    this.lUnicode = 0;
    this.fX = 0;
    this.fY = 0;
    this.fLeft = 0;
    this.fTop = 0;
    this.fRight = 0;
    this.fBottom = 0;
    this.oMetrics = null;
    this.eState = EGlyphState.glyphstateNormal;
    this.bBitmap = false;
    this.oBitmap = null;
    this.Clear = function () {
        this.bBitmap = false;
        this.eState = EGlyphState.glyphstateNormal;
    };
}
function TBBox() {
    this.fMinX = 0;
    this.fMaxX = 0;
    this.fMinY = 0;
    this.fMaxY = 0;
    this.rasterDistances = null;
}
function TFontCacheSizes() {
    this.ushUnicode;
    this.eState;
    this.nCMapIndex;
    this.ushGID;
    this.fAdvanceX;
    this.oBBox = new TBBox();
    this.oMetrics = new TMetrics();
    this.bBitmap = false;
    this.oBitmap = null;
}
function CGlyphString() {
    this.m_fX = 0;
    this.m_fY = 0;
    this.m_fEndX = 0;
    this.m_fEndY = 0;
    this.m_nGlyphIndex = -1;
    this.m_nGlyphsCount = 0;
    this.m_pGlyphsBuffer = new Array(100);
    this.m_arrCTM = [];
    this.m_dIDet = 1;
    this.m_fTransX = 0;
    this.m_fTransY = 0;
    this.SetString = function (wsString, fX, fY) {
        this.m_fX = fX + this.m_fTransX;
        this.m_fY = fY + this.m_fTransY;
        this.m_nGlyphsCount = wsString.length;
        this.m_nGlyphIndex = 0;
        for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex) {
            if (undefined == this.m_pGlyphsBuffer[nIndex]) {
                this.m_pGlyphsBuffer[nIndex] = new TGlyph();
            } else {
                this.m_pGlyphsBuffer[nIndex].Clear();
            }
            this.m_pGlyphsBuffer[nIndex].lUnicode = wsString.charCodeAt(nIndex);
            this.m_pGlyphsBuffer[nIndex].bBitmap = false;
        }
    };
    this.SetStringGID = function (gid, fX, fY) {
        this.m_fX = fX + this.m_fTransX;
        this.m_fY = fY + this.m_fTransY;
        this.m_nGlyphsCount = 1;
        this.m_nGlyphIndex = 0;
        for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex) {
            if (undefined == this.m_pGlyphsBuffer[nIndex]) {
                this.m_pGlyphsBuffer[nIndex] = new TGlyph();
            } else {
                this.m_pGlyphsBuffer[nIndex].Clear();
            }
            this.m_pGlyphsBuffer[nIndex].lUnicode = gid;
            this.m_pGlyphsBuffer[nIndex].bBitmap = false;
        }
    };
    this.GetLength = function () {
        return this.m_nGlyphsCount;
    };
    this.GetAt = function (nIndex) {
        if (this.m_nGlyphsCount <= 0) {
            return null;
        }
        var nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
        return this.m_pGlyphsBuffer[nCurIndex];
    };
    this.SetStartPoint = function (nIndex, fX, fY) {
        if (this.m_nGlyphsCount <= 0) {
            return;
        }
        var nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
        this.m_pGlyphsBuffer[nCurIndex].fX = fX;
        this.m_pGlyphsBuffer[nCurIndex].fY = fY;
    };
    this.SetState = function (nIndex, eState) {
        if (this.m_nGlyphsCount <= 0) {
            return;
        }
        var nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
        this.m_pGlyphsBuffer[nCurIndex].eState = eState;
    };
    this.SetBBox = function (nIndex, fLeft, fTop, fRight, fBottom) {
        if (this.m_nGlyphsCount <= 0) {
            return;
        }
        var nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
        var _g = this.m_pGlyphsBuffer[nCurIndex];
        _g.fLeft = fLeft;
        _g.fTop = fTop;
        _g.fRight = fRight;
        _g.fBottom = fBottom;
    };
    this.SetMetrics = function (nIndex, fWidth, fHeight, fHoriAdvance, fHoriBearingX, fHoriBearingY, fVertAdvance, fVertBearingX, fVertBearingY) {
        if (this.m_nGlyphsCount <= 0) {
            return;
        }
        var nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
        var _g = this.m_pGlyphsBuffer[nCurIndex];
        _g.oMetrics.fHeight = fHeight;
        _g.oMetrics.fHoriAdvance = fHoriAdvance;
        _g.oMetrics.fHoriBearingX = fHoriBearingX;
        _g.oMetrics.fHoriBearingY = fHoriBearingY;
        _g.oMetrics.fVertAdvance = fVertAdvance;
        _g.oMetrics.fVertBearingX = fVertBearingX;
        _g.oMetrics.fVertBearingY = fVertBearingY;
        _g.oMetrics.fWidth = fWidth;
    };
    this.ResetCTM = function () {
        var m = this.m_arrCTM;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 1;
        m[4] = 0;
        m[5] = 0;
        this.m_dIDet = 1;
    };
    this.GetBBox = function (nIndex, nType) {
        var oPoint = new CPoint2();
        if (typeof nIndex == "undefined") {
            nIndex = -1;
        }
        if (typeof nType == "undefined") {
            nType = 0;
        }
        var nCurIndex = 0;
        if (nIndex < 0) {
            if (this.m_nGlyphsCount <= 0 || this.m_nGlyphIndex < 1 || this.m_nGlyphIndex > this.m_nGlyphsCount) {
                return oPoint;
            }
            nCurIndex = this.m_nGlyphIndex - 1;
        } else {
            if (this.m_nGlyphsCount <= 0) {
                return oPoint;
            }
            nCurIndex = Math.min(this.m_nGlyphsCount - 1, Math.max(0, nIndex));
        }
        var _g = this.m_pGlyphsBuffer[nCurIndex];
        var m = this.m_arrCTM;
        var fBottom = -_g.fBottom;
        var fRight = _g.fRight;
        var fLeft = _g.fLeft;
        var fTop = -_g.fTop;
        if (0 == nType && !(1 == m[0] && 0 == m[1] && 0 == m[2] && 1 == m[3] && 0 == m[4] && 0 == m[5])) {
            var arrfX = [fLeft, fLeft, fRight, fRight];
            var arrfY = [fTop, fBottom, fBottom, fTop];
            var fMinX = (arrfX[0] * m[0] + arrfY[0] * m[2]);
            var fMinY = (arrfX[0] * m[1] + arrfY[0] * m[3]);
            var fMaxX = fMinX;
            var fMaxY = fMinY;
            for (var nIndex = 1; nIndex < 4; ++nIndex) {
                var fX = (arrfX[nIndex] * m[0] + arrfY[nIndex] * m[2]);
                var fY = (arrfX[nIndex] * m[1] + arrfY[nIndex] * m[3]);
                fMaxX = Math.max(fMaxX, fX);
                fMinX = Math.min(fMinX, fX);
                fMaxY = Math.max(fMaxY, fY);
                fMinY = Math.min(fMinY, fY);
            }
            fLeft = fMinX;
            fRight = fMaxX;
            fTop = fMinY;
            fBottom = fMaxY;
        }
        oPoint.fLeft = fLeft + _g.fX + this.m_fX;
        oPoint.fRight = fRight + _g.fX + this.m_fX;
        oPoint.fTop = fTop + _g.fY + this.m_fY;
        oPoint.fBottom = fBottom + _g.fY + this.m_fY;
        return oPoint;
    };
    this.GetBBox2 = function () {
        var oPoint = new CPoint2();
        if (this.m_nGlyphsCount <= 0) {
            return oPoint;
        }
        var fBottom = 0;
        var fRight = 0;
        var fLeft = 0;
        var fTop = 0;
        for (var nIndex = 0; nIndex < this.m_nGlyphsCount; ++nIndex) {
            fBottom = Math.max(fBottom, -this.m_pGlyphsBuffer[nIndex].fBottom);
            fTop = Math.min(fTop, -this.m_pGlyphsBuffer[nIndex].fTop);
        }
        var m = this.m_arrCTM;
        if (! (1 == m[0] && 0 == m[1] && 0 == m[2] && 1 == m[3] && 0 == m[4] && 0 == m[5])) {
            var arrfX = [fLeft, fLeft, fRight, fRight];
            var arrfY = [fTop, fBottom, fBottom, fTop];
            var fMinX = (arrfX[0] * m[0] + arrfY[0] * m[2]);
            var fMinY = (arrfX[0] * m[1] + arrfY[0] * m[3]);
            var fMaxX = fMinX;
            var fMaxY = fMinY;
            for (var nIndex = 1; nIndex < 4; ++nIndex) {
                var fX = (arrfX[nIndex] * m[0] + arrfY[nIndex] * m[2]);
                var fY = (arrfX[nIndex] * m[1] + arrfY[nIndex] * m[3]);
                fMaxX = Math.max(fMaxX, fX);
                fMinX = Math.min(fMinX, fX);
                fMaxY = Math.max(fMaxY, fY);
                fMinY = Math.min(fMinY, fY);
            }
            fLeft = fMinX;
            fRight = fMaxX;
            fTop = fMinY;
            fBottom = fMaxY;
        }
        fLeft += this.m_fX;
        fRight += this.m_fX;
        fTop += this.m_fY;
        fBottom += this.m_fY;
        oPoint.fLeft = Math.min(fLeft, Math.min(this.m_fX, this.m_fEndX));
        oPoint.fRight = Math.max(fRight, Math.max(this.m_fX, this.m_fEndX));
        oPoint.fTop = Math.min(fTop, Math.min(this.m_fY, this.m_fEndY));
        oPoint.fBottom = Math.max(fBottom, Math.max(this.m_fY, this.m_fEndY));
        return oPoint;
    };
    this.GetNext = function () {
        if (this.m_nGlyphIndex >= this.m_nGlyphsCount || this.m_nGlyphIndex < 0) {
            return undefined;
        }
        return this.m_pGlyphsBuffer[this.m_nGlyphIndex++];
    };
    this.SetTrans = function (fX, fY) {
        var m = this.m_arrCTM;
        this.m_fTransX = this.m_dIDet * (fX * m[3] - m[2] * fY);
        this.m_fTransY = this.m_dIDet * (fY * m[0] - m[1] * fX);
    };
    this.SetCTM = function (fA, fB, fC, fD, fE, fF) {
        var m = this.m_arrCTM;
        m[0] = fA;
        m[1] = fB;
        m[2] = fC;
        m[3] = fD;
        m[4] = fE;
        m[5] = fF;
        var dDet = fA * fD - fB * fC;
        if (dDet < 0.001 && dDet >= 0) {
            dDet = 0.001;
        } else {
            if (dDet > -0.001 && dDet < 0) {
                dDet = -0.001;
            }
        }
        this.m_dIDet = 1 / dDet;
    };
}
function CFontManager() {
    this.m_oLibrary = null;
    this.m_pFont = null;
    this.m_oGlyphString = new CGlyphString();
    this.error = 0;
    this.fontName = undefined;
    this.m_bUseDefaultFont = false;
    this.m_fCharSpacing = 0;
    this.m_bStringGID = false;
    this.m_oFontsCache = null;
    this.m_oDefaultFont = new CDefaultFont();
    this.m_lUnits_Per_Em = 0;
    this.m_lAscender = 0;
    this.m_lDescender = 0;
    this.m_lLineHeight = 0;
    this.RasterMemory = null;
    this.LOAD_MODE = 40970;
    this.AfterLoad = function () {
        if (null == this.m_pFont) {
            this.m_lUnits_Per_Em = 0;
            this.m_lAscender = 0;
            this.m_lDescender = 0;
            this.m_lLineHeight = 0;
        } else {
            var f = this.m_pFont;
            this.m_lUnits_Per_Em = f.m_lUnits_Per_Em;
            this.m_lAscender = f.m_lAscender;
            this.m_lDescender = f.m_lDescender;
            this.m_lLineHeight = f.m_lLineHeight;
            f.CheckHintsSupport();
        }
    };
    this.Initialize = function (is_init_raster_memory) {
        this.m_oLibrary = new FT_Library();
        this.m_oLibrary.Init();
        this.m_oFontsCache = new CFontFilesCache();
        this.m_oFontsCache.m_oFontManager = this;
        this.m_oFontsCache.m_oLibrary = this.m_oLibrary;
        if (is_init_raster_memory === true) {
            if (AscBrowser.isIE && !AscBrowser.isArm) {
                this.RasterMemory = new CRasterHeapTotal();
                this.RasterMemory.CreateFirstChuck();
            }
        }
    };
    this.ClearFontsRasterCache = function () {
        for (var i in this.m_oFontsCache.Fonts) {
            if (this.m_oFontsCache.Fonts[i]) {
                this.m_oFontsCache.Fonts[i].ClearCache();
            }
        }
        this.ClearRasterMemory();
    };
    this.ClearRasterMemory = function () {
        if (null == this.RasterMemory || null == this.m_oFontsCache) {
            return;
        }
        var _fonts = this.m_oFontsCache.Fonts;
        for (var i in _fonts) {
            if (_fonts[i] !== undefined && _fonts[i] != null) {
                _fonts[i].ClearCacheNoAttack();
            }
        }
        this.RasterMemory.Clear();
    };
    this.SetDefaultFont = function (name) {
        this.m_oDefaultFont.m_oLibrary = this.m_oLibrary;
        this.m_oDefaultFont.SetDefaultFont(name);
    };
    this.UpdateSize = function (dOldSize, dDpi, dNewDpi) {
        if (0 == dNewDpi) {
            dNewDpi = 72;
        }
        if (0 == dDpi) {
            dDpi = 72;
        }
        return dOldSize * dDpi / dNewDpi;
    };
    this.LoadString = function (wsBuffer, fX, fY) {
        if (!this.m_pFont) {
            return false;
        }
        this.m_oGlyphString.SetString(wsBuffer, fX, fY);
        this.m_pFont.GetString(this.m_oGlyphString);
        return true;
    };
    this.LoadString2 = function (wsBuffer, fX, fY) {
        if (!this.m_pFont) {
            return false;
        }
        this.m_oGlyphString.SetString(wsBuffer, fX, fY);
        this.m_pFont.GetString2(this.m_oGlyphString);
        return true;
    };
    this.LoadString3 = function (gid, fX, fY) {
        if (!this.m_pFont) {
            return false;
        }
        this.SetStringGID(true);
        this.m_oGlyphString.SetStringGID(gid, fX, fY);
        this.m_pFont.GetString2(this.m_oGlyphString);
        this.SetStringGID(false);
        return true;
    };
    this.LoadString3C = function (gid, fX, fY) {
        if (!this.m_pFont) {
            return false;
        }
        this.SetStringGID(true);
        var string = this.m_oGlyphString;
        string.m_fX = fX + string.m_fTransX;
        string.m_fY = fY + string.m_fTransY;
        string.m_nGlyphsCount = 1;
        string.m_nGlyphIndex = 0;
        var buffer = string.m_pGlyphsBuffer;
        if (buffer[0] == undefined) {
            buffer[0] = new TGlyph();
        }
        var _g = buffer[0];
        _g.bBitmap = false;
        _g.oBitmap = null;
        _g.eState = EGlyphState.glyphstateNormal;
        _g.lUnicode = gid;
        this.m_pFont.GetString2C(string);
        this.SetStringGID(false);
        return true;
    };
    this.LoadString2C = function (wsBuffer, fX, fY) {
        if (!this.m_pFont) {
            return false;
        }
        var string = this.m_oGlyphString;
        string.m_fX = fX + string.m_fTransX;
        string.m_fY = fY + string.m_fTransY;
        string.m_nGlyphsCount = 1;
        string.m_nGlyphIndex = 0;
        var buffer = string.m_pGlyphsBuffer;
        if (buffer[0] == undefined) {
            buffer[0] = new TGlyph();
        }
        var _g = buffer[0];
        _g.bBitmap = false;
        _g.oBitmap = null;
        _g.eState = EGlyphState.glyphstateNormal;
        _g.lUnicode = wsBuffer.charCodeAt(0);
        this.m_pFont.GetString2C(string);
        return string.m_fEndX;
    };
    this.LoadString4C = function (lUnicode, fX, fY) {
        if (!this.m_pFont) {
            return false;
        }
        var string = this.m_oGlyphString;
        string.m_fX = fX + string.m_fTransX;
        string.m_fY = fY + string.m_fTransY;
        string.m_nGlyphsCount = 1;
        string.m_nGlyphIndex = 0;
        var buffer = string.m_pGlyphsBuffer;
        if (buffer[0] == undefined) {
            buffer[0] = new TGlyph();
        }
        var _g = buffer[0];
        _g.bBitmap = false;
        _g.oBitmap = null;
        _g.eState = EGlyphState.glyphstateNormal;
        _g.lUnicode = lUnicode;
        this.m_pFont.GetString2C(string);
        return string.m_fEndX;
    };
    this.LoadStringPathCode = function (code, isGid, fX, fY, worker) {
        if (!this.m_pFont) {
            return false;
        }
        this.SetStringGID(isGid);
        var string = this.m_oGlyphString;
        string.m_fX = fX + string.m_fTransX;
        string.m_fY = fY + string.m_fTransY;
        string.m_nGlyphsCount = 1;
        string.m_nGlyphIndex = 0;
        var buffer = string.m_pGlyphsBuffer;
        if (buffer[0] == undefined) {
            buffer[0] = new TGlyph();
        }
        var _g = buffer[0];
        _g.bBitmap = false;
        _g.oBitmap = null;
        _g.eState = EGlyphState.glyphstateNormal;
        _g.lUnicode = code;
        this.m_pFont.GetStringPath(string, worker);
        this.SetStringGID(false);
        return true;
    };
    this.LoadChar = function (lUnicode) {
        if (!this.m_pFont) {
            return false;
        }
        return this.m_pFont.GetChar2(lUnicode);
    };
    this.MeasureChar = function (lUnicode, is_raster_distances) {
        if (!this.m_pFont) {
            return;
        }
        return this.m_pFont.GetChar(lUnicode, is_raster_distances);
    };
    this.GetKerning = function (unPrevGID, unGID) {
        if (!this.m_pFont) {
            return;
        }
        return this.m_pFont.GetKerning(unPrevGID, unGID);
    };
    this.MeasureString = function () {
        var oPoint = new CPoint1();
        var len = this.m_oGlyphString.GetLength();
        if (len <= 0) {
            return oPoint;
        }
        var fTop = 65535,
        fBottom = -65535,
        fLeft = 65535,
        fRight = -65535;
        for (var nIndex = 0; nIndex < len; ++nIndex) {
            var oSizeTmp = this.m_oGlyphString.GetBBox(nIndex);
            if (fBottom < oSizeTmp.fBottom) {
                fBottom = oSizeTmp.fBottom;
            }
            if (fTop > oSizeTmp.fTop) {
                fTop = oSizeTmp.fTop;
            }
            if (fLeft > oSizeTmp.fLeft) {
                fLeft = oSizeTmp.fLeft;
            }
            if (fRight < oSizeTmp.fRight) {
                fRight = oSizeTmp.fRight;
            }
        }
        oPoint.fX = fLeft;
        oPoint.fY = fTop;
        oPoint.fWidth = Math.abs((fRight - fLeft));
        oPoint.fHeight = Math.abs((fTop - fBottom));
        return oPoint;
    };
    this.MeasureString2 = function () {
        var oPoint = new CPoint1();
        if (this.m_oGlyphString.GetLength() <= 0) {
            return oPoint;
        }
        var fTop = 65535,
        fBottom = -65535,
        fLeft = 65535,
        fRight = -65535;
        var oSizeTmp = this.m_oGlyphString.GetBBox2();
        oPoint.fX = oSizeTmp.fLeft;
        oPoint.fY = oSizeTmp.fTop;
        oPoint.fWidth = Math.abs((oSizeTmp.fRight - oSizeTmp.fLeft));
        oPoint.fHeight = Math.abs((oSizeTmp.fTop - oSizeTmp.fBottom));
        return oPoint;
    };
    this.GetNextChar2 = function () {
        return this.m_oGlyphString.GetNext();
    };
    this.IsSuccess = function () {
        return (0 == this.error);
    };
    this.SetTextMatrix = function (fA, fB, fC, fD, fE, fF) {
        if (!this.m_pFont) {
            return false;
        }
        if (this.m_pFont.SetTextMatrix(fA, fB, fC, fD, 0, 0)) {
            this.m_oGlyphString.SetCTM(fA, fB, fC, fD, 0, 0);
        }
        this.m_oGlyphString.SetTrans(fE, fF);
        return true;
    };
    this.SetTextMatrix2 = function (fA, fB, fC, fD, fE, fF) {
        if (!this.m_pFont) {
            return false;
        }
        this.m_pFont.SetTextMatrix(fA, fB, fC, fD, 0, 0);
        this.m_oGlyphString.SetCTM(fA, fB, fC, fD, 0, 0);
        this.m_oGlyphString.SetTrans(fE, fF);
        return true;
    };
    this.SetStringGID = function (bStringGID) {
        this.m_bStringGID = bStringGID;
        if (!this.m_pFont) {
            return;
        }
        this.m_pFont.SetStringGID(this.m_bStringGID);
    };
    this.SetHintsProps = function (bIsHinting, bIsSubpixHinting) {
        if (undefined === g_fontManager.m_oLibrary.tt_hint_props) {
            return;
        }
        if (bIsHinting && bIsSubpixHinting) {
            this.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
            this.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = true;
            this.LOAD_MODE = 40968;
        } else {
            if (bIsHinting) {
                this.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
                this.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;
                this.LOAD_MODE = 40968;
            } else {
                this.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
                this.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;
                this.LOAD_MODE = 40970;
            }
        }
    };
}