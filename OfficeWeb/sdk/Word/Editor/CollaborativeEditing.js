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
 function CIdCounter() {
    this.m_sUserId = null;
    this.m_bLoad = true;
    this.m_nIdCounterLoad = 0;
    this.m_nIdCounterEdit = 0;
    this.Get_NewId = function () {
        if (true === this.m_bLoad || null === this.m_sUserId) {
            this.m_nIdCounterLoad++;
            return ("" + this.m_nIdCounterLoad);
        } else {
            this.m_nIdCounterEdit++;
            return ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
        }
    };
    this.Set_UserId = function (sUserId) {
        this.m_sUserId = sUserId;
    };
    this.Set_Load = function (bValue) {
        this.m_bLoad = bValue;
    };
}
var g_oIdCounter = new CIdCounter();
function CTableId() {
    this.m_aPairs = new Object();
    this.m_bTurnOff = false;
    this.Add = function (Class, Id) {
        if (false === this.m_bTurnOff) {
            Class.Id = Id;
            this.m_aPairs[Id] = Class;
            History.Add(this, {
                Type: historyitem_TableId_Add,
                Id: Id,
                Class: Class
            });
        }
    };
    this.Add(this, g_oIdCounter.Get_NewId());
    this.Get_ById = function (Id) {
        if ("" === Id) {
            return null;
        }
        if ("undefined" != typeof(this.m_aPairs[Id])) {
            return this.m_aPairs[Id];
        }
        return null;
    };
    this.Get_ByClass = function (Class) {
        if ("undefined" != typeof(Class.Get_Id)) {
            return Class.Get_Id();
        }
        if ("undefined" != typeof(Class.GetId())) {
            return Class.GetId();
        }
        return null;
    };
    this.Reset_Id = function (Class, Id_new, Id_old) {
        if (Class === this.m_aPairs[Id_old]) {
            delete this.m_aPairs[Id_old];
            this.m_aPairs[Id_new] = Class;
            History.Add(this, {
                Type: historyitem_TableId_Reset,
                Id_new: Id_new,
                Id_old: Id_old
            });
        } else {
            this.Add(Class, Id_new);
        }
    };
    this.Get_Id = function () {
        return this.Id;
    };
    this.Undo = function (Data) {};
    this.Redo = function (Redo) {};
    this.Refresh_RecalcData = function (Data) {};
    this.Read_Class_FromBinary = function (Reader) {
        var ElementType = Reader.GetLong();
        var Element = null;
        this.m_bTurnOff = true;
        switch (ElementType) {
        case historyitem_type_Paragraph:
            Element = new Paragraph();
            break;
        case historyitem_type_TextPr:
            Element = new ParaTextPr();
            break;
        case historyitem_type_Hyperlink:
            Element = new ParaHyperlinkStart();
            break;
        case historyitem_type_Drawing:
            Element = new ParaDrawing();
            break;
        case historyitem_type_DrawingObjects:
            Element = new CDrawingObjects();
            break;
        case historyitem_type_FlowObjects:
            Element = new FlowObjects();
            break;
        case historyitem_type_FlowImage:
            Element = new FlowImage();
            break;
        case historyitem_type_Table:
            Element = new CTable();
            break;
        case historyitem_type_TableRow:
            Element = new CTableRow();
            break;
        case historyitem_type_TableCell:
            Element = new CTableCell();
            break;
        case historyitem_type_DocumentContent:
            Element = new CDocumentContent();
            break;
        case historyitem_type_FlowTable:
            Element = new FlowTable();
            break;
        case historyitem_type_HdrFtr:
            Element = new CHeaderFooter();
            break;
        case historyitem_type_AbstractNum:
            Element = new CAbstractNum();
            break;
        case historyitem_type_Comment:
            Element = new CComment();
            break;
        case historyitem_type_Shape:
            Element = new WordShape();
            break;
        case historyitem_type_Image:
            Element = new WordImage();
            break;
        case historyitem_type_GroupShapes:
            Element = new WordGroupShapes();
            break;
        case historyitem_type_Chart:
            Element = new CChartAsGroup();
            break;
        case historyitem_type_WrapPolygon:
            Element = new CWrapPolygon();
            break;
        case historyitem_type_HdrFtrGrObjects:
            Element = new HeaderFooterGraphicObjects();
            break;
        case historyitem_type_Style:
            Element = new CStyle();
            break;
        case historyitem_type_TextBody:
            Element = new CTextBody();
            break;
        case historyitem_type_ChartTitle:
            Element = new CChartTitle();
            break;
        }
        Element.Read_FromBinary2(Reader);
        this.m_bTurnOff = false;
        return Element;
    };
    this.Save_Changes = function (Data, Writer) {
        Writer.WriteLong(historyitem_type_TableId);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_TableId_Add:
            Writer.WriteString2(Data.Id);
            Data.Class.Write_ToBinary2(Writer);
            break;
        case historyitem_TableId_Reset:
            Writer.WriteString2(Data.Id_new);
            Writer.WriteString2(Data.Id_old);
            break;
        }
    };
    this.Save_Changes2 = function (Data, Writer) {
        return false;
    };
    this.Load_Changes = function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_TableId != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_TableId_Add:
            var Id = Reader.GetString2();
            var Class = this.Read_Class_FromBinary(Reader);
            this.m_aPairs[Id] = Class;
            break;
        case historyitem_TableId_Reset:
            var Id_new = Reader.GetString2();
            var Id_old = Reader.GetString2();
            if ("undefined" != this.m_aPairs[Id_old]) {
                var Class = this.m_aPairs[Id_old];
                delete this.m_aPairs[Id_old];
                this.m_aPairs[Id_new] = Class;
            }
            break;
        }
        return true;
    };
    this.Unlock = function (Data) {};
}
var g_oTableId = null;
function CCollaborativeChanges() {
    this.m_sId = null;
    this.m_pData = null;
    this.Set_Id = function (sId) {
        this.m_sId = sId;
    };
    this.Set_Data = function (pData) {
        this.m_pData = pData;
    };
    this.Set_FromUndoRedo = function (Class, Data, Binary) {
        if ("undefined" === typeof(Class.Get_Id)) {
            return false;
        }
        this.m_sId = Class.Get_Id();
        this.m_pData = this.Internal_Save_Data(Class, Data, Binary);
        return true;
    };
    this.Apply_Data = function () {
        var LoadData = this.Internal_Load_Data(this.m_pData);
        var Type = LoadData.Reader.GetLong();
        var Class = null;
        if (historyitem_type_HdrFtr === Type) {
            Class = editor.WordControl.m_oLogicDocument.HdrFtr;
        } else {
            Class = g_oTableId.Get_ById(this.m_sId);
        }
        LoadData.Reader.Seek2(0);
        if (null != Class) {
            return Class.Load_Changes(LoadData.Reader, LoadData.Reader2);
        } else {
            return false;
        }
    };
    this.Internal_Load_Data = function (szSrc) {
        var srcLen = szSrc.length;
        var index = -1;
        while (true) {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                index++;
                break;
            }
        }
        var bPost = false;
        while (index < srcLen) {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                index++;
                bPost = true;
                break;
            }
        }
        if (true === bPost) {
            return {
                Reader: this.Internal_Load_Data2(szSrc, 0, index - 1),
                Reader2: this.Internal_Load_Data2(szSrc, index, srcLen)
            };
        } else {
            return {
                Reader: this.Internal_Load_Data2(szSrc, 0, szSrc.length),
                Reader2: null
            };
        }
    };
    this.Internal_Load_Data2 = function (szSrc, offset, srcLen) {
        var nWritten = 0;
        var index = -1 + offset;
        var dst_len = "";
        while (true) {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0)) {
                index++;
                break;
            }
            dst_len += String.fromCharCode(_c);
        }
        var dstLen = parseInt(dst_len);
        var pointer = g_memory.Alloc(dstLen);
        var stream = new FT_Stream2(pointer.data, dstLen);
        stream.obj = pointer.obj;
        var dstPx = stream.data;
        if (window.chrome) {
            while (index < srcLen) {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i = 0; i < 4; i++) {
                    if (index >= srcLen) {
                        break;
                    }
                    var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                    if (nCh == -1) {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }
                dwCurr <<= 24 - nBits;
                for (i = 0; i < nBits / 8; i++) {
                    dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                    dwCurr <<= 8;
                }
            }
        } else {
            var p = b64_decode;
            while (index < srcLen) {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i = 0; i < 4; i++) {
                    if (index >= srcLen) {
                        break;
                    }
                    var nCh = p[szSrc.charCodeAt(index++)];
                    if (nCh == undefined) {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }
                dwCurr <<= 24 - nBits;
                for (i = 0; i < nBits / 8; i++) {
                    dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }
        return stream;
    };
    this.Internal_Save_Data = function (Class, Data, Binary) {
        var Writer = History.BinaryWriter;
        var Pos = Binary.Pos;
        var Len = Binary.Len;
        if ("undefined" != typeof(Class.Save_Changes2)) {
            var Writer2 = CollaborativeEditing.m_oMemory;
            Writer.Seek(0);
            if (true === Class.Save_Changes2(Data, Writer2)) {
                return Len + ";" + Writer.GetBase64Memory2(Pos, Len) + ";" + Writer2.GetCurPosition() + ";" + Writer2.GetBase64Memory();
            }
        }
        return Len + ";" + Writer.GetBase64Memory2(Pos, Len);
    };
}
function CCollaborativeEditing() {
    this.m_bUse = false;
    this.m_aUsers = [];
    this.m_aChanges = [];
    this.m_aNeedUnlock = [];
    this.m_aNeedUnlock2 = [];
    this.m_aNeedLock = [];
    this.m_aLinkData = [];
    this.m_bGlobalLock = false;
    this.m_aCheckLocks = [];
    this.m_aNewObjects = [];
    this.m_aNewImages = [];
    this.m_aDC = {};
    this.m_aChangedClasses = {};
    this.m_oMemory = new CMemory();
    var oThis = this;
    this.Start_CollaborationEditing = function () {
        this.m_bUse = true;
    };
    this.Add_User = function (UserId) {
        if (-1 === this.Find_User(UserId)) {
            this.m_aUsers.push(UserId);
        }
    };
    this.Find_User = function (UserId) {
        var Len = this.m_aUsers.length;
        for (var Index = 0; Index < Len; Index++) {
            if (this.m_aUsers[Index] === UserId) {
                return Index;
            }
        }
        return -1;
    };
    this.Remove_User = function (UserId) {
        var Pos = this.Find_User(UserId);
        if (-1 != Pos) {
            this.m_aUsers.splice(Pos, 1);
        }
    };
    this.Add_Changes = function (Changes) {
        this.m_aChanges.push(Changes);
    };
    this.Add_Unlock = function (LockClass) {
        this.m_aNeedUnlock.push(LockClass);
    };
    this.Add_Unlock2 = function (Lock) {
        this.m_aNeedUnlock2.push(Lock);
    };
    this.Apply_OtherChanges = function () {
        g_oIdCounter.Set_Load(true);
        while (this.m_aChanges.length > 0) {
            var Changes = this.m_aChanges[0];
            Changes.Apply_Data();
            this.m_aChanges.splice(0, 1);
        }
        this.Apply_LinkData();
        this.Check_MergeData();
        this.OnEnd_ReadForeignChanges();
        g_oIdCounter.Set_Load(false);
    };
    this.Get_SelfChanges = function () {
        var aChanges = new Array();
        var PointsCount = History.Points.length;
        for (var PointIndex = 0; PointIndex < PointsCount; PointIndex++) {
            var Point = History.Points[PointIndex];
            var LastPoint = Point.Items.length;
            for (var Index = 0; Index < LastPoint; Index++) {
                var Item = Point.Items[Index];
                var oChanges = new CCollaborativeChanges();
                oChanges.Set_FromUndoRedo(Item.Class, Item.Data, Item.Binary);
                aChanges.push({
                    "id": oChanges.m_sId,
                    "data": oChanges.m_pData
                });
            }
        }
        return aChanges;
    };
    this.Apply_Changes = function () {
        if (true != this.m_bUse) {
            editor.CoAuthoringApi.saveChanges(new Array());
            return;
        }
        editor.WordControl.m_oLogicDocument.Stop_Recalculate();
        editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var DocState = LogicDocument.Get_SelectionState2();
        this.Clear_NewImages();
        this.Apply_OtherChanges();
        this.Lock_NeedLock();
        LogicDocument.Set_SelectionState2(DocState);
        this.OnStart_Load_Objects();
    };
    this.Send_Changes = function () {
        if (true != this.m_bUse) {
            return;
        }
        this.Refresh_DCChanges();
        History.Clear_Redo();
        var aChanges = new Array();
        var PointsCount = History.Points.length;
        for (var PointIndex = 0; PointIndex < PointsCount; PointIndex++) {
            var Point = History.Points[PointIndex];
            for (var Index = 0; Index < Point.Items.length; Index++) {
                var Item = Point.Items[Index];
                var oChanges = new CCollaborativeChanges();
                oChanges.Set_FromUndoRedo(Item.Class, Item.Data, Item.Binary);
                aChanges.push(oChanges);
            }
        }
        this.Release_Locks();
        var UnlockCount2 = this.m_aNeedUnlock2.length;
        for (var Index = 0; Index < UnlockCount2; Index++) {
            var Class = this.m_aNeedUnlock2[Index];
            Class.Lock.Set_Type(locktype_None, false);
            editor.CoAuthoringApi.releaseLocks(Class.Get_Id());
        }
        this.m_aNeedUnlock.length = 0;
        this.m_aNeedUnlock2.length = 0;
        editor.CoAuthoringApi.saveChanges(aChanges);
        History.Clear();
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
        editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
        editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    };
    this.Release_Locks = function () {
        var UnlockCount = this.m_aNeedUnlock.length;
        for (var Index = 0; Index < UnlockCount; Index++) {
            var CurLockType = this.m_aNeedUnlock[Index].Lock.Get_Type();
            if (locktype_Other3 != CurLockType && locktype_Other != CurLockType) {
                this.m_aNeedUnlock[Index].Lock.Set_Type(locktype_None, false);
                if (this.m_aNeedUnlock[Index] instanceof CHeaderFooterController) {
                    editor.sync_UnLockHeaderFooters();
                } else {
                    if (this.m_aNeedUnlock[Index] instanceof CDocument) {
                        editor.sync_UnLockDocumentProps();
                    } else {
                        if (this.m_aNeedUnlock[Index] instanceof CComment) {
                            editor.sync_UnLockComment(this.m_aNeedUnlock[Index].Get_Id());
                        } else {
                            if (this.m_aNeedUnlock[Index] instanceof CGraphicObjects) {
                                editor.sync_UnLockDocumentSchema();
                            }
                        }
                    }
                }
            } else {
                if (locktype_Other3 === CurLockType) {
                    this.m_aNeedUnlock[Index].Lock.Set_Type(locktype_Other, false);
                }
            }
        }
    };
    this.OnStart_Load_Objects = function () {
        oThis.m_bGlobalLock = true;
        editor.pre_Save(oThis.m_aNewImages);
    };
    this.OnEnd_Load_Objects = function () {
        oThis.m_bGlobalLock = false;
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var RecalculateData = {
            Inline: {
                Pos: 0,
                PageNum: 0
            },
            Flow: new Array(),
            HdrFtr: new Array()
        };
        var HdrFtr_Content = LogicDocument.HdrFtr.Content[0];
        if (null != HdrFtr_Content.Header.First) {
            RecalculateData.HdrFtr.push(HdrFtr_Content.Header.First);
        }
        if (null != HdrFtr_Content.Footer.First) {
            RecalculateData.HdrFtr.push(HdrFtr_Content.Footer.First);
        }
        if (null != HdrFtr_Content.Header.Even) {
            RecalculateData.HdrFtr.push(HdrFtr_Content.Header.Even);
        }
        if (null != HdrFtr_Content.Footer.Even) {
            RecalculateData.HdrFtr.push(HdrFtr_Content.Footer.Even);
        }
        if (null != HdrFtr_Content.Header.Odd) {
            RecalculateData.HdrFtr.push(HdrFtr_Content.Header.Odd);
        }
        if (null != HdrFtr_Content.Footer.Odd) {
            RecalculateData.HdrFtr.push(HdrFtr_Content.Footer.Odd);
        }
        LogicDocument.Reset_RecalculateCache();
        LogicDocument.DrawingObjects.calculateAfterOpen();
        LogicDocument.Recalculate(false, false, RecalculateData);
        LogicDocument.Document_UpdateSelectionState();
        LogicDocument.Document_UpdateInterfaceState();
        editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);
    };
    this.Clear_LinkData = function () {
        this.m_aLinkData.length = 0;
    };
    this.Add_LinkData = function (Class, LinkData) {
        this.m_aLinkData.push({
            Class: Class,
            LinkData: LinkData
        });
    };
    this.Apply_LinkData = function () {
        var Count = this.m_aLinkData.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.m_aLinkData[Index];
            Item.Class.Load_LinkData(Item.LinkData);
        }
        this.Clear_LinkData();
    };
    this.Check_MergeData = function () {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        LogicDocument.Comments.Check_MergeData();
    };
    this.Get_GlobalLock = function () {
        return this.m_bGlobalLock;
    };
    this.OnStart_CheckLock = function () {
        this.m_aCheckLocks.length = 0;
    };
    this.Add_CheckLock = function (oItem) {
        this.m_aCheckLocks.push(oItem);
    };
    this.OnEnd_CheckLock = function () {
        var aIds = new Array();
        var Count = this.m_aCheckLocks.length;
        for (var Index = 0; Index < Count; Index++) {
            var oItem = this.m_aCheckLocks[Index];
            if (true === oItem) {
                return true;
            } else {
                if (false !== oItem) {
                    aIds.push(oItem);
                }
            }
        }
        if (aIds.length > 0) {
            editor.CoAuthoringApi.askLock(aIds, this.OnCallback_AskLock);
            if (true === this.m_bUse) {
                this.m_bGlobalLock = true;
            } else {
                var Count = this.m_aCheckLocks.length;
                for (var Index = 0; Index < Count; Index++) {
                    var oItem = this.m_aCheckLocks[Index];
                    if (true !== oItem && false !== oItem) {
                        var Class = g_oTableId.Get_ById(oItem);
                        if (null != Class) {
                            Class.Lock.Set_Type(locktype_Mine);
                            this.Add_Unlock2(Class);
                        }
                    }
                }
                this.m_aCheckLocks.length = 0;
            }
        }
        return false;
    };
    this.OnCallback_AskLock = function (result) {
        oThis.m_bGlobalLock = false;
        if (result["lock"]) {
            var Count = oThis.m_aCheckLocks.length;
            for (var Index = 0; Index < Count; Index++) {
                var oItem = oThis.m_aCheckLocks[Index];
                if (true !== oItem && false !== oItem) {
                    var Class = g_oTableId.Get_ById(oItem);
                    if (null != Class) {
                        Class.Lock.Set_Type(locktype_Mine);
                        oThis.Add_Unlock2(Class);
                    }
                }
            }
        } else {
            if (result["error"]) {
                if (true === editor.isChartEditor) {
                    editor.sync_closeChartEditor();
                }
                editor.WordControl.m_oLogicDocument.Document_Undo();
                History.Clear_Redo();
            }
        }
        editor.isChartEditor = false;
    };
    this.Reset_NeedLock = function () {
        this.m_aNeedLock = {};
    };
    this.Add_NeedLock = function (Id, sUser) {
        this.m_aNeedLock[Id] = sUser;
    };
    this.Remove_NeedLock = function (Id) {
        delete this.m_aNeedLock[Id];
    };
    this.Lock_NeedLock = function () {
        for (var Id in this.m_aNeedLock) {
            var Class = g_oTableId.Get_ById(Id);
            if (null != Class) {
                var Lock = Class.Lock;
                Lock.Set_Type(locktype_Other, false);
                Lock.Set_UserId(this.m_aNeedLock[Id]);
            }
        }
        this.Reset_NeedLock();
    };
    this.Clear_NewObjects = function () {
        this.m_aNewObjects.length = 0;
    };
    this.Add_NewObject = function (Class) {
        this.m_aNewObjects.push(Class);
        Class.FromBinary = true;
    };
    this.OnEnd_ReadForeignChanges = function () {
        var Count = this.m_aNewObjects.length;
        for (var Index = 0; Index < Count; Index++) {
            var Class = this.m_aNewObjects[Index];
            Class.FromBinary = false;
        }
        this.Clear_NewObjects();
    };
    this.Clear_NewImages = function () {
        this.m_aNewImages.length = 0;
    };
    this.Add_NewImage = function (Url) {
        this.m_aNewImages.push(Url);
    };
    this.Add_NewDC = function (Class) {
        var Id = Class.Get_Id();
        this.m_aDC[Id] = Class;
    };
    this.Clear_DCChanges = function () {
        for (var Id in this.m_aDC) {
            this.m_aDC[Id].Clear_ContentChanges();
        }
        this.m_aDC = {};
    };
    this.Refresh_DCChanges = function () {
        for (var Id in this.m_aDC) {
            this.m_aDC[Id].Refresh_ContentChanges();
        }
        this.Clear_DCChanges();
    };
    this.Add_ChangedClass = function (Class) {
        var Id = Class.Get_Id();
        this.m_aChangedClasses[Id] = Class;
    };
    this.Clear_CollaborativeMarks = function (bRepaint) {
        for (var Id in this.m_aChangedClasses) {
            this.m_aChangedClasses[Id].Clear_CollaborativeMarks();
        }
        this.m_aChangedClasses = {};
        if (true === bRepaint) {
            editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
            editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
        }
    };
}
var CollaborativeEditing = new CCollaborativeEditing();
var changestype_None = 0;
var changestype_Paragraph_Content = 1;
var changestype_Paragraph_Properties = 2;
var changestype_Document_Content = 10;
var changestype_Document_Content_Add = 11;
var changestype_Document_SectPr = 12;
var changestype_Table_Properties = 20;
var changestype_Table_RemoveCells = 21;
var changestype_Image_Properties = 23;
var changestype_HdrFtr = 30;
var changestype_Remove = 40;
var changestype_Delete = 41;
var changestype_Drawing_Props = 51;
var changestype_ColorScheme = 60;
var changestype_2_InlineObjectMove = 1;
var changestype_2_HdrFtr = 2;
var changestype_2_Comment = 3;
var changestype_2_Element_and_Type = 4;
var changestype_2_ElementsArray_and_Type = 5;
var locktype_None = 1;
var locktype_Mine = 2;
var locktype_Other = 3;
var locktype_Other2 = 4;
var locktype_Other3 = 5;
function CLock() {
    this.Type = locktype_None;
    this.UserId = null;
    this.Get_Type = function () {
        return this.Type;
    };
    this.Set_Type = function (NewType, Redraw) {
        if (NewType === locktype_None) {
            this.UserId = null;
        }
        this.Type = NewType;
        if (false != Redraw) {
            var DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            DrawingDocument.ClearCachePages();
            DrawingDocument.FirePaint();
        }
    };
    this.Check = function (Id) {
        if (this.Type === locktype_Mine) {
            CollaborativeEditing.Add_CheckLock(false);
        } else {
            if (this.Type === locktype_Other || this.Type === locktype_Other2 || this.Type === locktype_Other3) {
                CollaborativeEditing.Add_CheckLock(true);
            } else {
                CollaborativeEditing.Add_CheckLock(Id);
            }
        }
    };
    this.Lock = function (bMine) {
        if (locktype_None === this.Type) {
            if (true === bMine) {
                this.Type = locktype_Mine;
            } else {
                true.Type = locktype_Other;
            }
        }
    };
    this.Is_Locked = function () {
        if (locktype_None != this.Type && locktype_Mine != this.Type) {
            return true;
        }
        return false;
    };
    this.Set_UserId = function (UserId) {
        this.UserId = UserId;
    };
    this.Get_UserId = function () {
        return this.UserId;
    };
    this.Have_Changes = function () {
        if (locktype_Other2 === this.Type || locktype_Other3 === this.Type) {
            return true;
        }
        return false;
    };
}
var contentchanges_Add = 1;
var contentchanges_Remove = 2;
function CContentChangesElement(Type, Pos, Count, Data) {
    this.m_nType = Type;
    this.m_nPos = Pos;
    this.m_nCount = Count;
    this.m_pData = Data;
    this.Refresh_BinaryData = function () {
        var Binary_Writer = History.BinaryWriter;
        var Binary_Pos = Binary_Writer.GetCurPosition();
        this.m_pData.Data.UseArray = true;
        this.m_pData.Data.PosArray = this.m_aPositions;
        this.m_pData.Class.Save_Changes(this.m_pData.Data, Binary_Writer);
        var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;
        this.m_pData.Binary.Pos = Binary_Pos;
        this.m_pData.Binary.Len = Binary_Len;
    };
    this.Check_Changes = function (Type, Pos) {
        var CurPos = Pos;
        if (contentchanges_Add === Type) {
            for (var Index = 0; Index < this.m_nCount; Index++) {
                if (false !== this.m_aPositions[Index]) {
                    if (CurPos <= this.m_aPositions[Index]) {
                        this.m_aPositions[Index]++;
                    } else {
                        if (contentchanges_Add === this.m_nType) {
                            CurPos++;
                        } else {
                            CurPos--;
                        }
                    }
                }
            }
        } else {
            for (var Index = 0; Index < this.m_nCount; Index++) {
                if (false !== this.m_aPositions[Index]) {
                    if (CurPos < this.m_aPositions[Index]) {
                        this.m_aPositions[Index]--;
                    } else {
                        if (CurPos > this.m_aPositions[Index]) {
                            if (contentchanges_Add === this.m_nType) {
                                CurPos++;
                            } else {
                                CurPos--;
                            }
                        } else {
                            if (contentchanges_Remove === this.m_nType) {
                                this.m_aPositions[Index] = false;
                                return false;
                            } else {
                                CurPos++;
                            }
                        }
                    }
                }
            }
        }
        return CurPos;
    };
    this.Make_ArrayOfSimpleActions = function (Type, Pos, Count) {
        var Positions = new Array();
        if (contentchanges_Add === Type) {
            for (var Index = 0; Index < Count; Index++) {
                Positions[Index] = Pos + Index;
            }
        } else {
            for (var Index = 0; Index < Count; Index++) {
                Positions[Index] = Pos;
            }
        }
        return Positions;
    };
    this.m_aPositions = this.Make_ArrayOfSimpleActions(Type, Pos, Count);
}
function CContentChanges() {
    this.m_aChanges = new Array();
    this.Add = function (Changes) {
        this.m_aChanges.push(Changes);
    };
    this.Clear = function () {
        this.m_aChanges.length = 0;
    };
    this.Check = function (Type, Pos) {
        var CurPos = Pos;
        var Count = this.m_aChanges.length;
        for (var Index = 0; Index < Count; Index++) {
            var NewPos = this.m_aChanges[Index].Check_Changes(Type, CurPos);
            if (false === NewPos) {
                return false;
            }
            CurPos = NewPos;
        }
        return CurPos;
    };
    this.Refresh = function () {
        var Count = this.m_aChanges.length;
        for (var Index = 0; Index < Count; Index++) {
            this.m_aChanges[Index].Refresh_BinaryData();
        }
    };
}