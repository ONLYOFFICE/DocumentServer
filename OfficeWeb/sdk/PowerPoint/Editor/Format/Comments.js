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
var comments_NoComment = 0;
var comments_NonActiveComment = 1;
var comments_ActiveComment = 2;
function ParaComment() {}
function CWriteCommentData() {
    this.Data = null;
    this.WriteAuthorId = 0;
    this.WriteCommentId = 0;
    this.WriteParentAuthorId = 0;
    this.WriteParentCommentId = 0;
    this.WriteTime = "";
    this.WriteText = "";
    this.AdditionalData = "";
    this.x = 0;
    this.y = 0;
}
CWriteCommentData.prototype = {
    DateToISO8601: function (d) {
        function pad(n) {
            return n < 10 ? "0" + n : n;
        }
        return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
    },
    Iso8601ToDate: function (sDate) {
        var numericKeys = [1, 4, 5, 6, 7, 10, 11];
        var minutesOffset = 0;
        var struct;
        if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(sDate))) {
            for (var i = 0, k;
            (k = numericKeys[i]); ++i) {
                struct[k] = +struct[k] || 0;
            }
            struct[2] = (+struct[2] || 1) - 1;
            struct[3] = +struct[3] || 1;
            if (struct[8] !== "Z" && struct[9] !== undefined) {
                minutesOffset = struct[10] * 60 + struct[11];
                if (struct[9] === "+") {
                    minutesOffset = 0 - minutesOffset;
                }
            }
            var _ret = new Date(Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]));
            return "" + _ret.getTime();
        }
        return "1";
    },
    Calculate: function () {
        var d = new Date(this.Data.m_sTime - 0);
        this.WriteTime = this.DateToISO8601(d);
        this.CalculateAdditionalData();
    },
    Calculate2: function () {
        var _time = this.Iso8601ToDate(this.WriteTime);
        this.WriteTime = _time;
    },
    CalculateAdditionalData: function () {
        if (null == this.Data) {
            this.AdditionalData = "";
        } else {
            this.AdditionalData = "teamlab_data:";
            this.AdditionalData += ("0;" + this.Data.m_sUserId.length + ";" + this.Data.m_sUserId + ";");
            this.AdditionalData += ("1;" + this.Data.m_sUserName.length + ";" + this.Data.m_sUserName + ";");
            this.AdditionalData += ("2;1;" + (this.Data.m_bSolved ? "1;" : "0;"));
        }
    },
    ReadNextInteger: function (_parsed) {
        var _len = _parsed.data.length;
        var _found = -1;
        var _Found = ";".charCodeAt(0);
        for (var i = _parsed.pos; i < _len; i++) {
            if (_Found == _parsed.data.charCodeAt(i)) {
                _found = i;
                break;
            }
        }
        if (-1 == _found) {
            return -1;
        }
        var _ret = parseInt(_parsed.data.substr(_parsed.pos, _found - _parsed.pos));
        if (isNaN(_ret)) {
            return -1;
        }
        _parsed.pos = _found + 1;
        return _ret;
    },
    ParceAdditionalData: function (_comment_data) {
        if (this.AdditionalData.indexOf("teamlab_data:") != 0) {
            return;
        }
        var _parsed = {
            data: this.AdditionalData,
            pos: "teamlab_data:".length
        };
        while (true) {
            var _attr = this.ReadNextInteger(_parsed);
            if (-1 == _attr) {
                break;
            }
            var _len = this.ReadNextInteger(_parsed);
            if (-1 == _len) {
                break;
            }
            var _value = _parsed.data.substr(_parsed.pos, _len);
            _parsed.pos += (_len + 1);
            if (0 == _attr) {
                _comment_data.m_sUserId = _value;
            } else {
                if (1 == _attr) {
                    _comment_data.m_sUserName = _value;
                } else {
                    if (2 == _attr) {
                        _comment_data.m_bSolved = ("1" == _value) ? true : false;
                    }
                }
            }
        }
    }
};
function CCommentAuthor() {
    this.Name = "";
    this.Id = 0;
    this.LastId = 0;
    this.Initials = "";
}
CCommentAuthor.prototype = {
    Calculate: function () {
        var arr = this.Name.split(" ");
        this.Initials = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length > 0) {
                this.Initials += (arr[i].substring(0, 1));
            }
        }
    }
};
function CCommentData() {
    this.m_sText = "";
    this.m_sTime = "";
    this.m_sUserId = "";
    this.m_sUserName = "";
    this.m_sQuoteText = null;
    this.m_bSolved = false;
    this.m_aReplies = [];
}
CCommentData.prototype = {
    Add_Reply: function (CommentData) {
        this.m_aReplies.push(CommentData);
    },
    Set_Text: function (Text) {
        this.m_sText = Text;
    },
    Get_Text: function () {
        return this.m_sText;
    },
    Get_QuoteText: function () {
        return this.m_sQuoteText;
    },
    Set_QuoteText: function (Quote) {
        this.m_sQuoteText = Quote;
    },
    Get_Solved: function () {
        return this.m_bSolved;
    },
    Set_Solved: function (Solved) {
        this.m_bSolved = Solved;
    },
    Set_Name: function (Name) {
        this.m_sUserName = Name;
    },
    Get_Name: function () {
        return this.m_sUserName;
    },
    Get_RepliesCount: function () {
        return this.m_aReplies.length;
    },
    Get_Reply: function (Index) {
        if (Index < 0 || Index >= this.m_aReplies.length) {
            return null;
        }
        return this.m_aReplies[Index];
    },
    Read_FromAscCommentData: function (AscCommentData) {
        this.m_sText = AscCommentData.asc_getText();
        this.m_sTime = AscCommentData.asc_getTime();
        this.m_sUserId = AscCommentData.asc_getUserId();
        this.m_sQuoteText = AscCommentData.asc_getQuoteText();
        this.m_bSolved = AscCommentData.asc_getSolved();
        this.m_sUserName = AscCommentData.asc_getUserName();
        var RepliesCount = AscCommentData.asc_getRepliesCount();
        for (var Index = 0; Index < RepliesCount; Index++) {
            var Reply = new CCommentData();
            Reply.Read_FromAscCommentData(AscCommentData.asc_getReply(Index));
            this.m_aReplies.push(Reply);
        }
    },
    Write_ToBinary2: function (Writer) {
        var Count = this.m_aReplies.length;
        Writer.WriteString2(this.m_sText);
        Writer.WriteString2(this.m_sTime);
        Writer.WriteString2(this.m_sUserId);
        Writer.WriteString2(this.m_sUserName);
        if (null === this.m_sQuoteText) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            Writer.WriteString2(this.m_sQuoteText);
        }
        Writer.WriteBool(this.m_bSolved);
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            this.m_aReplies[Index].Write_ToBinary2(Writer);
        }
    },
    Read_FromBinary2: function (Reader) {
        this.m_sText = Reader.GetString2();
        this.m_sTime = Reader.GetString2();
        this.m_sUserId = Reader.GetString2();
        this.m_sUserName = Reader.GetString2();
        var bNullQuote = Reader.GetBool();
        if (true != bNullQuote) {
            this.m_sQuoteText = Reader.GetString2();
        } else {
            this.m_sQuoteText = null;
        }
        this.m_bSolved = Reader.GetBool();
        var Count = Reader.GetLong();
        this.m_aReplies.length = 0;
        for (var Index = 0; Index < Count; Index++) {
            var oReply = new CCommentData();
            oReply.Read_FromBinary2(Reader);
            this.m_aReplies.push(oReply);
        }
    }
};
var comment_type_Common = 1;
var comment_type_HdrFtr = 2;
function CComment(Parent, Data) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Parent = Parent;
    this.Data = Data;
    this.x = null;
    this.y = null;
    this.selected = false;
    this.m_oTypeInfo = {
        Type: comment_type_Common,
        Data: null
    };
    this.m_oStartInfo = {
        X: 0,
        Y: 0,
        H: 0,
        PageNum: 0,
        ParaId: null
    };
    this.m_oEndInfo = {
        X: 0,
        Y: 0,
        H: 0,
        PageNum: 0,
        ParaId: null
    };
    this.Lock = new CLock();
    if (false === g_oIdCounter.m_bLoad) {
        this.Lock.Set_Type(locktype_Mine, false);
        CollaborativeEditing.Add_Unlock2(this);
    }
    g_oTableId.Add(this, this.Id);
}
CComment.prototype = {
    getObjectType: function () {
        return historyitem_type_Comment;
    },
    hit: function (x, y) {
        var Flags = 0;
        if (this.selected) {
            Flags |= 1;
        }
        if (this.Data.m_aReplies.length > 0) {
            Flags |= 2;
        }
        var dd = editor.WordControl.m_oDrawingDocument;
        return x > this.x && x < this.x + dd.GetCommentWidth(Flags) && y > this.y && y < this.y + dd.GetCommentHeight(Flags);
    },
    setPosition: function (x, y) {
        History.Add(this, {
            Type: historyitem_Comment_Position,
            oldOffsetX: this.x,
            newOffsetX: x,
            oldOffsetY: this.y,
            newOffsetY: y
        });
        this.x = x;
        this.y = y;
    },
    draw: function (graphics) {
        var Flags = 0;
        if (this.selected) {
            Flags |= 1;
        }
        if (this.Data.m_aReplies.length > 0) {
            Flags |= 2;
        }
        var dd = editor.WordControl.m_oDrawingDocument;
        graphics.DrawPresentationComment(Flags, this.x, this.y, dd.GetCommentWidth(), dd.GetCommentHeight());
    },
    Set_StartInfo: function (PageNum, X, Y, H, ParaId) {
        this.m_oStartInfo.X = X;
        this.m_oStartInfo.Y = Y;
        this.m_oStartInfo.H = H;
        this.m_oStartInfo.ParaId = ParaId;
        if (comment_type_Common === this.m_oTypeInfo.Type) {
            this.m_oStartInfo.PageNum = PageNum;
        }
    },
    Set_EndInfo: function (PageNum, X, Y, H, ParaId) {
        this.m_oEndInfo.X = X;
        this.m_oEndInfo.Y = Y;
        this.m_oEndInfo.H = H;
        this.m_oEndInfo.ParaId = ParaId;
        if (comment_type_Common === this.m_oTypeInfo.Type) {
            this.m_oEndInfo.PageNum = PageNum;
        }
    },
    Check_ByXY: function (PageNum, X, Y, Type) {
        if (this.m_oTypeInfo.Type != Type) {
            return false;
        }
        if (comment_type_Common === Type) {
            if (PageNum < this.m_oStartInfo.PageNum || PageNum > this.m_oEndInfo.PageNum) {
                return false;
            }
            if (PageNum === this.m_oStartInfo.PageNum && (Y < this.m_oStartInfo.Y || (Y < (this.m_oStartInfo.Y + this.m_oStartInfo.H) && X < this.m_oStartInfo.X))) {
                return false;
            }
            if (PageNum === this.m_oEndInfo.PageNum && (Y > this.m_oEndInfo.Y + this.m_oEndInfo.H || (Y > this.m_oEndInfo.Y && X > this.m_oEndInfo.X))) {
                return false;
            }
        } else {
            if (comment_type_HdrFtr === Type) {
                var HdrFtr = this.m_oTypeInfo.Data;
                if (null === HdrFtr || false === HdrFtr.Check_Page(PageNum)) {
                    return false;
                }
                if (Y < this.m_oStartInfo.Y || (Y < (this.m_oStartInfo.Y + this.m_oStartInfo.H) && X < this.m_oStartInfo.X)) {
                    return false;
                }
                if (Y > this.m_oEndInfo.Y + this.m_oEndInfo.H || (Y > this.m_oEndInfo.Y && X > this.m_oEndInfo.X)) {
                    return false;
                }
                this.m_oStartInfo.PageNum = PageNum;
                this.m_oEndInfo.PageNum = PageNum;
            }
        }
        return true;
    },
    Set_Data: function (Data) {
        History.Add(this, {
            Type: historyitem_Comment_Change,
            New: Data,
            Old: this.Data
        });
        this.Data = Data;
    },
    Remove_Marks: function () {
        var Para_start = g_oTableId.Get_ById(this.m_oStartInfo.ParaId);
        var Para_end = g_oTableId.Get_ById(this.m_oEndInfo.ParaId);
        if (Para_start === Para_end) {
            if (null != Para_start) {
                Para_start.Remove_CommentMarks(this.Id);
            }
        } else {
            if (null != Para_start) {
                Para_start.Remove_CommentMarks(this.Id);
            }
            if (null != Para_end) {
                Para_end.Remove_CommentMarks(this.Id);
            }
        }
    },
    Set_TypeInfo: function (Type, Data) {
        var New = {
            Type: Type,
            Data: Data
        };
        History.Add(this, {
            Type: historyitem_Comment_TypeInfo,
            New: New,
            Old: this.m_oTypeInfo
        });
        this.m_oTypeInfo = New;
        if (comment_type_HdrFtr === Type) {
            var PageNum = Data.Content.Get_StartPage_Absolute();
            this.m_oStartInfo.PageNum = PageNum;
            this.m_oEndInfo.PageNum = PageNum;
        }
    },
    Get_TypeInfo: function () {
        return this.m_oTypeInfo;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comment_Change:
            this.Data = Data.Old;
            editor.sync_ChangeCommentData(this.Id, this.Data);
            break;
        case historyitem_Comment_TypeInfo:
            this.m_oTypeInfo = Data.Old;
            break;
        case historyitem_Comment_Position:
            this.x = Data.oldOffsetX;
            this.y = Data.oldOffsetY;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comment_Change:
            this.Data = Data.New;
            editor.sync_ChangeCommentData(this.Id, this.Data);
            break;
        case historyitem_Comment_TypeInfo:
            this.m_oTypeInfo = Data.New;
            break;
        case historyitem_Comment_Position:
            this.x = Data.newOffsetX;
            this.y = Data.newOffsetY;
            break;
        }
    },
    Refresh_RecalcData: function (Data) {
        if (this.slideComments) {
            this.slideComments.Refresh_RecalcData();
        }
    },
    recalculate: function () {},
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Comment);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Comment_Change:
            Data.New.Write_ToBinary2(Writer);
            break;
        case historyitem_Comment_TypeInfo:
            var Type = Data.New.Type;
            Writer.WriteLong(Type);
            if (comment_type_HdrFtr === Type) {
                var HdrFtr = Data.New.Data;
                Writer.WriteString2(HdrFtr.Get_Id());
            }
            break;
        case historyitem_Comment_Position:
            Writer.WriteBool(isRealNumber(Data.newOffsetX) && isRealNumber(Data.newOffsetY));
            if (isRealNumber(Data.newOffsetX) && isRealNumber(Data.newOffsetY)) {
                Writer.WriteDouble(Data.newOffsetX);
                Writer.WriteDouble(Data.newOffsetY);
            }
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comment_Change:
            break;
        case historyitem_Comment_TypeInfo:
            break;
        }
        return bRetValue;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Comment != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Comment_Change:
            this.Data.Read_FromBinary2(Reader);
            editor.sync_ChangeCommentData(this.Id, this.Data);
            break;
        case historyitem_Comment_TypeInfo:
            this.m_oTypeInfo.Type = Reader.GetLong();
            if (comment_type_HdrFtr === this.m_oTypeInfo.Type) {
                var HdrFtrId = Reader.GetString2();
                this.m_oTypeInfo.Data = g_oTableId.Get_ById(HdrFtrId);
            }
            break;
        case historyitem_Comment_Position:
            if (Reader.GetBool()) {
                this.x = Reader.GetDouble();
                this.y = Reader.GetDouble();
            } else {
                this.x = null;
                this.y = null;
            }
            break;
        }
        return true;
    },
    Get_Id: function () {
        return this.Id;
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Comment);
        Writer.WriteString2(this.Id);
        this.Data.Write_ToBinary2(Writer);
        Writer.WriteLong(this.m_oTypeInfo.Type);
        if (comment_type_HdrFtr === this.m_oTypeInfo.Type) {
            Writer.WriteString2(this.m_oTypeInfo.Data.Get_Id());
        }
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        this.Data = new CCommentData();
        this.Data.Read_FromBinary2(Reader);
        this.m_oTypeInfo.Type = Reader.GetLong();
        if (comment_type_HdrFtr === this.m_oTypeInfo.Type) {
            this.m_oTypeInfo.Data = g_oTableId.Get_ById(Reader.GetString2());
        }
    },
    Check_MergeData: function () {
        var bUse = true;
        if (null != this.m_oStartInfo.ParaId) {
            var Para_start = g_oTableId.Get_ById(this.m_oStartInfo.ParaId);
            if (true != Para_start.Is_UseInDocument()) {
                bUse = false;
            }
        }
        if (true === bUse && null != this.m_oEndInfo.ParaId) {
            var Para_end = g_oTableId.Get_ById(this.m_oEndInfo.ParaId);
            if (true != Para_end.Is_UseInDocument()) {
                bUse = false;
            }
        }
        if (false === bUse) {
            editor.WordControl.m_oLogicDocument.Remove_Comment(this.Id, true);
        }
    }
};