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
 function CCommentData() {
    this.m_sText = "";
    this.m_sTime = "";
    this.m_sUserId = "";
    this.m_sUserName = "";
    this.m_sQuoteText = null;
    this.m_bSolved = false;
    this.m_aReplies = new Array();
    this.Add_Reply = function (CommentData) {
        this.m_aReplies.push(CommentData);
    };
    this.Set_Text = function (Text) {
        this.m_sText = Text;
    };
    this.Get_Text = function () {
        return this.m_sText;
    };
    this.Get_QuoteText = function () {
        return this.m_sQuoteText;
    };
    this.Set_QuoteText = function (Quote) {
        this.m_sQuoteText = Quote;
    };
    this.Get_Solved = function () {
        return this.m_bSolved;
    };
    this.Set_Solved = function (Solved) {
        this.m_bSolved = Solved;
    };
    this.Set_Name = function (Name) {
        this.m_sUserName = Name;
    };
    this.Get_Name = function () {
        return this.m_sUserName;
    };
    this.Get_RepliesCount = function () {
        return this.m_aReplies.length;
    };
    this.Get_Reply = function (Index) {
        if (Index < 0 || Index >= this.m_aReplies.length) {
            return null;
        }
        return this.m_aReplies[Index];
    };
    this.Read_FromAscCommentData = function (AscCommentData) {
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
    };
    this.Write_ToBinary2 = function (Writer) {
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
    };
    this.Read_FromBinary2 = function (Reader) {
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
    };
}
var comment_type_Common = 1;
var comment_type_HdrFtr = 2;
function CComment(Parent, Data) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Parent = Parent;
    this.Data = Data;
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
    this.Set_StartInfo = function (PageNum, X, Y, H, ParaId) {
        this.m_oStartInfo.X = X;
        this.m_oStartInfo.Y = Y;
        this.m_oStartInfo.H = H;
        this.m_oStartInfo.ParaId = ParaId;
        if (comment_type_Common === this.m_oTypeInfo.Type) {
            this.m_oStartInfo.PageNum = PageNum;
        }
    };
    this.Set_EndInfo = function (PageNum, X, Y, H, ParaId) {
        this.m_oEndInfo.X = X;
        this.m_oEndInfo.Y = Y;
        this.m_oEndInfo.H = H;
        this.m_oEndInfo.ParaId = ParaId;
        if (comment_type_Common === this.m_oTypeInfo.Type) {
            this.m_oEndInfo.PageNum = PageNum;
        }
    };
    this.Check_ByXY = function (PageNum, X, Y, Type) {
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
    };
    this.Set_Data = function (Data) {
        History.Add(this, {
            Type: historyitem_Comment_Change,
            New: Data,
            Old: this.Data
        });
        this.Data = Data;
    };
    this.Remove_Marks = function () {
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
    };
    this.Set_TypeInfo = function (Type, Data) {
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
    };
    this.Get_TypeInfo = function () {
        return this.m_oTypeInfo;
    };
    this.Undo = function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comment_Change:
            this.Data = Data.Old;
            editor.sync_ChangeCommentData(this.Id, this.Data);
            break;
        case historyitem_Comment_TypeInfo:
            this.m_oTypeInfo = Data.Old;
            break;
        }
    };
    this.Redo = function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comment_Change:
            this.Data = Data.New;
            editor.sync_ChangeCommentData(this.Id, this.Data);
            break;
        case historyitem_Comment_TypeInfo:
            this.m_oTypeInfo = Data.New;
            break;
        }
    };
    this.Refresh_RecalcData = function (Data) {};
    this.Save_Changes = function (Data, Writer) {
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
        }
        return Writer;
    };
    this.Save_Changes2 = function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comment_Change:
            break;
        case historyitem_Comment_TypeInfo:
            break;
        }
        return bRetValue;
    };
    this.Load_Changes = function (Reader, Reader2) {
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
        }
        return true;
    };
    this.Get_Id = function () {
        return this.Id;
    };
    this.Set_Id = function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    };
    this.Write_ToBinary2 = function (Writer) {
        Writer.WriteLong(historyitem_type_Comment);
        Writer.WriteString2(this.Id);
        this.Data.Write_ToBinary2(Writer);
        Writer.WriteLong(this.m_oTypeInfo.Type);
        if (comment_type_HdrFtr === this.m_oTypeInfo.Type) {
            Writer.WriteString2(this.m_oTypeInfo.Data.Get_Id());
        }
    };
    this.Read_FromBinary2 = function (Reader) {
        this.Id = Reader.GetString2();
        this.Data = new CCommentData();
        this.Data.Read_FromBinary2(Reader);
        this.m_oTypeInfo.Type = Reader.GetLong();
        if (comment_type_HdrFtr === this.m_oTypeInfo.Type) {
            this.m_oTypeInfo.Data = g_oTableId.Get_ById(Reader.GetString2());
        }
    };
    this.Check_MergeData = function () {
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
    };
    g_oTableId.Add(this, this.Id);
}
var comments_NoComment = 0;
var comments_NonActiveComment = 1;
var comments_ActiveComment = 2;
function CComments() {
    this.Id = g_oIdCounter.Get_NewId();
    this.m_bUse = false;
    this.m_aComments = {};
    this.m_sCurrent = null;
    this.m_aCurrentDraw = new Array();
    this.Get_Id = function () {
        return this.Id;
    };
    this.Set_Id = function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    };
    this.Set_Use = function (Use) {
        this.m_bUse = Use;
    };
    this.Is_Use = function () {
        return this.m_bUse;
    };
    this.Add = function (Comment) {
        var Id = Comment.Get_Id();
        History.Add(this, {
            Type: historyitem_Comments_Add,
            Id: Id,
            Comment: Comment
        });
        this.m_aComments[Id] = Comment;
    };
    this.Get_ById = function (Id) {
        if ("undefined" != typeof(this.m_aComments[Id])) {
            return this.m_aComments[Id];
        }
        return null;
    };
    this.Remove_ById = function (Id) {
        if ("undefined" != typeof(this.m_aComments[Id])) {
            History.Add(this, {
                Type: historyitem_Comments_Remove,
                Id: Id,
                Comment: this.m_aComments[Id]
            });
            var Comment = this.m_aComments[Id];
            delete this.m_aComments[Id];
            Comment.Remove_Marks();
            return true;
        }
        return false;
    };
    this.Reset_CurrentDraw = function (PageNum) {
        this.m_aCurrentDraw.length = 0;
        for (var Id in this.m_aComments) {
            var Comment = this.m_aComments[Id];
            if (PageNum > Comment.m_oStartInfo.PageNum && PageNum <= Comment.m_oEndInfo.PageNum) {
                this.m_aCurrentDraw.push(Comment.Get_Id());
            }
        }
    };
    this.Add_CurrentDraw = function (Id) {
        if (null != this.Get_ById(Id)) {
            this.m_aCurrentDraw.push(Id);
        }
    };
    this.Remove_CurrentDraw = function (Id) {
        var Count = this.m_aCurrentDraw.length;
        for (var Index = 0; Index < Count; Index++) {
            if (Id === this.m_aCurrentDraw[Index]) {
                this.m_aCurrentDraw.splice(Index, 1);
                return;
            }
        }
    };
    this.Check_CurrentDraw = function () {
        var Flag = comments_NoComment;
        var Count = this.m_aCurrentDraw.length;
        if (Count > 0) {
            Flag = comments_NonActiveComment;
        }
        for (var Index = 0; Index < Count; Index++) {
            if (this.m_aCurrentDraw[Index] === this.m_sCurrent) {
                Flag = comments_ActiveComment;
                return Flag;
            }
        }
        return Flag;
    };
    this.Set_Current = function (Id) {
        this.m_sCurrent = Id;
    };
    this.Set_StartInfo = function (Id, PageNum, X, Y, H, ParaId) {
        var Comment = this.Get_ById(Id);
        if (null != Comment) {
            Comment.Set_StartInfo(PageNum, X, Y, H, ParaId);
        }
    };
    this.Set_EndInfo = function (Id, PageNum, X, Y, H, ParaId) {
        var Comment = this.Get_ById(Id);
        if (null != Comment) {
            Comment.Set_EndInfo(PageNum, X, Y, H, ParaId);
        }
    };
    this.Get_ByXY = function (PageNum, X, Y, Type) {
        for (var Id in this.m_aComments) {
            var Comment = this.m_aComments[Id];
            if (true === Comment.Check_ByXY(PageNum, X, Y, Type)) {
                return Comment;
            }
        }
        return null;
    };
    this.Get_Current = function () {
        if (null != this.m_sCurrent) {
            var Comment = this.Get_ById(this.m_sCurrent);
            if (null != Comment) {
                return Comment;
            }
        }
        return null;
    };
    this.Get_CurrentId = function () {
        return this.m_sCurrent;
    };
    this.Set_CommentData = function (Id, CommentData) {
        var Comment = this.Get_ById(Id);
        if (null != Comment) {
            Comment.Set_Data(CommentData);
        }
    };
    this.Check_MergeData = function () {
        for (var Id in this.m_aComments) {
            this.m_aComments[Id].Check_MergeData();
        }
    };
    this.Undo = function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comments_Add:
            delete this.m_aComments[Data.Id];
            editor.sync_RemoveComment(Data.Id);
            break;
        case historyitem_Comments_Remove:
            this.m_aComments[Data.Id] = Data.Comment;
            editor.sync_AddComment(Data.Id, Data.Comment.Data);
            break;
        }
    };
    this.Redo = function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comments_Add:
            this.m_aComments[Data.Id] = Data.Comment;
            editor.sync_AddComment(Data.Id, Data.Comment.Data);
            break;
        case historyitem_Comments_Remove:
            delete this.m_aComments[Data.Id];
            editor.sync_RemoveComment(Data.Id);
            break;
        }
    };
    this.Refresh_RecalcData = function (Data) {};
    this.Document_Is_SelectionLocked = function (Id) {
        var Comment = this.Get_ById(Id);
        if (null != Comment) {
            Comment.Lock.Check(Comment.Get_Id());
        }
    };
    this.Save_Changes = function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Comments);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Comments_Add:
            Writer.WriteString2(Data.Id);
            break;
        case historyitem_Comments_Remove:
            Writer.WriteString2(Data.Id);
            break;
        }
        return Writer;
    };
    this.Save_Changes2 = function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Comments_Add:
            break;
        case historyitem_Comments_Remove:
            break;
        }
        return bRetValue;
    };
    this.Load_Changes = function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Comments != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Comments_Add:
            var CommentId = Reader.GetString2();
            var Comment = g_oTableId.Get_ById(CommentId);
            this.m_aComments[CommentId] = Comment;
            editor.sync_AddComment(CommentId, Comment.Data);
            break;
        case historyitem_Comments_Remove:
            var CommentId = Reader.GetString2();
            delete this.m_aComments[CommentId];
            editor.sync_RemoveComment(CommentId);
            break;
        }
        return true;
    };
    g_oTableId.Add(this, this.Id);
}