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
 using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;
using System.Configuration;
using System.Runtime.Serialization;
using System.Threading;
using System.Data;
using Amazon;
using Amazon.SQS;
using Amazon.SQS.Model;
using log4net;

namespace FileConverterUtils2
{

    class CTaskQueueAmazonSQS : ITaskQueue
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(CTaskQueueAmazonSQS));
        private struct SQSDataKey
        {
            public string m_strReceiptHandle;
            public Priority m_oPriority;
        }

        private const string m_cstrLowPriorityQueueSettings = "utils.taskqueue.sqs.lp";
        private const string m_cstrNormalPriorityQueueSettings = "utils.taskqueue.sqs.np";
        private const string m_cstrHighPriorityQueueSettings = "utils.taskqueue.sqs.hp";

        private string m_strLowPriorityQueueUrl;
        private string m_strNormalPriorityQueueUrl;
        private string m_strHighPriorityQueueUrl;
        private bool m_LongPoolingEnable;

        private TimeSpan m_oVisibilityTimeout;

        private static int m_nIsHPRead;
        private static int m_nIsNPRead;
        private static int m_nIsLPRead;

        private delegate ErrorTypes ExecuteTaskAdder(TaskQueueData oTask, Priority oPriority);
        private delegate TaskQueueData ExecuteTaskGetter();
        private delegate ErrorTypes ExecuteTaskRemover(object key);

        private class TransportClass : TransportClassAsyncOperation
        {
            public ExecuteTaskAdder m_delegateAdder = null;
            public ExecuteTaskGetter m_delegateGetter = null;
            public ExecuteTaskRemover m_delegateRemover = null;

            public ErrorTypes m_eError = ErrorTypes.NoError;
            public TransportClass(AsyncCallback fCallback, object oParam)
                : base(fCallback, oParam)
            {
            }
            public override void Close()
            {

            }
            public override void Dispose()
            {
                m_eError = ErrorTypes.TaskQueue;

            }
        }

        private TransportClass m_oAddTask = null;
        private TransportClass m_oGetTask = null;
        private TransportClass m_oRemoveTask = null;

        public CTaskQueueAmazonSQS()
        {
            try
            {
                m_strLowPriorityQueueUrl = ConfigurationManager.AppSettings[m_cstrLowPriorityQueueSettings];
                m_strNormalPriorityQueueUrl = ConfigurationManager.AppSettings[m_cstrNormalPriorityQueueSettings];
                m_strHighPriorityQueueUrl = ConfigurationManager.AppSettings[m_cstrHighPriorityQueueSettings];

                m_LongPoolingEnable = bool.Parse(ConfigurationManager.AppSettings["utils.taskqueue.sqs.longpooling"] ?? "false");

                m_oVisibilityTimeout = TimeSpan.FromSeconds(double.Parse(ConfigurationManager.AppSettings["utils.taskqueue.db.visibility_timeout"] ?? "60"));
            }
            catch
            {
            }
        }

        private string GetQueueUrl(Priority oPriority)
        {
            string strUrlQueue = "";
            switch (oPriority)
            {
                case Priority.Low:
                    strUrlQueue = m_strLowPriorityQueueUrl;
                    break;
                case Priority.Normal:
                    strUrlQueue = m_strNormalPriorityQueueUrl;
                    break;
                case Priority.High:
                    strUrlQueue = m_strHighPriorityQueueUrl;
                    break;
            }
            return strUrlQueue;
        }

        public ErrorTypes AddTask(TaskQueueData oTask, Priority oPriority)
        {
            ErrorTypes eResult = ErrorTypes.Unknown;
            string strUrlQueue = GetQueueUrl(oPriority);

            try
            {
                oTask.VisibilityTimeout = m_oVisibilityTimeout;
                
                string strData = TaskQueueData.SerializeToXml(oTask);

                using (AmazonSQS oSQSClient = AWSClientFactory.CreateAmazonSQSClient())
                {
                    
                    SendMessageRequest oSendMessageRequest = new SendMessageRequest();
                    oSendMessageRequest.QueueUrl = strUrlQueue;   
                    oSendMessageRequest.MessageBody = strData;
                    oSQSClient.SendMessage(oSendMessageRequest);
                    eResult = ErrorTypes.NoError;
                }
            }
            catch (AmazonSQSException)
            {
                eResult = ErrorTypes.TaskQueue;
            }
            catch
            {
                eResult = ErrorTypes.TaskQueue;
            }

            return eResult;
        }
        public void AddTaskBegin(TaskQueueData oTask, Priority oPriority, AsyncCallback fCallback, object oParam)
        {

            m_oAddTask = new TransportClass(fCallback, oParam);
            try
            {
                m_oAddTask.m_delegateAdder = AddTask;
                m_oAddTask.m_delegateAdder.BeginInvoke(oTask, oPriority, m_oAddTask.m_fCallback, m_oAddTask.m_oParam);
            }
            catch
            {
                m_oAddTask.DisposeAndCallback();
            }
            return;
        }

        public ErrorTypes AddTaskEnd(IAsyncResult ar)
        {
            ErrorTypes eResult = m_oAddTask.m_eError;
            if (ErrorTypes.NoError == m_oAddTask.m_eError)
            {
                try
                {
                    m_oAddTask.m_delegateAdder.EndInvoke(ar);
                    m_oAddTask.Close();
                }
                catch
                {
                    m_oAddTask.Dispose();
                }
            }
            return eResult;
        }

        private TaskQueueData GetTask(Priority oPriority)
        {
            string strUrlQueue = GetQueueUrl(oPriority);

            TaskQueueData oData = null;
            try
            {
                
                using (AmazonSQS oSQSClient = AWSClientFactory.CreateAmazonSQSClient())
                {
                    
                    ReceiveMessageRequest oReceiveMessageRequest = new ReceiveMessageRequest();
                    oReceiveMessageRequest.QueueUrl = strUrlQueue;
                    oReceiveMessageRequest.MaxNumberOfMessages = 1;

                    ReceiveMessageResponse oReceiveMessageResponse = oSQSClient.ReceiveMessage(oReceiveMessageRequest);
                    if (oReceiveMessageResponse.IsSetReceiveMessageResult())
                    {
                        ReceiveMessageResult oReceiveMessageResult = oReceiveMessageResponse.ReceiveMessageResult;
                        foreach (Message oMessage in oReceiveMessageResult.Message)
                        {
                            oData = TaskQueueData.DeserializeFromXml(oMessage.Body);

                            SQSDataKey oSQSDataKey = new SQSDataKey();
                            oSQSDataKey.m_oPriority = oPriority;
                            oSQSDataKey.m_strReceiptHandle = oMessage.ReceiptHandle;
                            oData.m_oDataKey = oSQSDataKey;
                            break;
                        }
                    }
                }
            }
            catch (AmazonSQSException)
            {
            }
            catch
            {
            }

            return oData;
        }
        public TaskQueueData GetTask()
        {
            TaskQueueData oData = null;

            if (m_LongPoolingEnable)
                oData = GetTaskFromLongPoolingQueue();
            else
                oData = GetTaskFromQueue();

            return oData;
        }
        private TaskQueueData GetTaskFromLongPoolingQueue()
        {
            TaskQueueData oData = null;

            if (0 == Interlocked.CompareExchange(ref m_nIsHPRead, 1, 0)) 
            {
                _log.Debug("Try to get high priority task...");
                oData = GetTask(Priority.High);
                Interlocked.Exchange(ref m_nIsHPRead, 0);
            }
            else if (0 == Interlocked.CompareExchange(ref m_nIsNPRead, 1, 0)) 
            {
                _log.Debug("Try to get normal priority task...");
                oData = GetTask(Priority.Normal);
                Interlocked.Exchange(ref m_nIsNPRead, 0);
            }
            else if (0 == Interlocked.CompareExchange(ref m_nIsLPRead, 1, 0)) 
            {
                _log.Debug("Try to get low priority task...");
                oData = GetTask(Priority.Low);
                Interlocked.Exchange(ref m_nIsLPRead, 0);
            }
            else
            {
                _log.Debug("All task queue listening!");
            }

            return oData;
        }
        private TaskQueueData GetTaskFromQueue()
        {
            TaskQueueData oData = null;

            oData = GetTask(Priority.High);
            if (null != oData)
                return oData;

            oData = GetTask(Priority.Normal);
            if (null != oData)
                return oData;

            oData = GetTask(Priority.Low);

            return oData;
        }
        public void GetTaskBegin(AsyncCallback fCallback, object oParam)
        {
            m_oGetTask = new TransportClass(fCallback, oParam);
            try
            {
                m_oGetTask.m_delegateGetter = GetTask;
                m_oGetTask.m_delegateGetter.BeginInvoke(m_oGetTask.m_fCallback, m_oGetTask.m_oParam);
            }
            catch
            {
                m_oGetTask.DisposeAndCallback();
            }
        }
        public TaskQueueData GetTaskEnd(IAsyncResult ar)
        {
            TaskQueueData oTaskQueueDate = null;
            if (ErrorTypes.NoError == m_oGetTask.m_eError)
            {
                try
                {
                    if (null != m_oGetTask.m_delegateGetter)
                    {
                        oTaskQueueDate = m_oGetTask.m_delegateGetter.EndInvoke(ar);
                    }
                    m_oGetTask.Close();
                }
                catch
                {
                    m_oGetTask.Dispose();
                }
            }
            return oTaskQueueDate;
        }
        public ErrorTypes RemoveTask(object key)
        {
            ErrorTypes eResult = ErrorTypes.Unknown;
            try
            {
                SQSDataKey oSQSDataKey = (SQSDataKey)key;
                string strUrlQueue = GetQueueUrl(oSQSDataKey.m_oPriority);

                using (AmazonSQS oSQSClient = AWSClientFactory.CreateAmazonSQSClient())
                {
                    
                    DeleteMessageRequest oDeleteRequest = new DeleteMessageRequest();
                    oDeleteRequest.QueueUrl = strUrlQueue;
                    oDeleteRequest.ReceiptHandle = (string)oSQSDataKey.m_strReceiptHandle;

                    oSQSClient.DeleteMessage(oDeleteRequest);
                    eResult = ErrorTypes.NoError;
                }
            }
            catch (AmazonSQSException)
            {
            }
            catch
            {
            }

            return eResult;
        }
        public void RemoveTaskBegin(object key, AsyncCallback fCallback, object oParam)
        {
            m_oRemoveTask = new TransportClass(fCallback, oParam);
            try
            {
                m_oRemoveTask.m_delegateRemover = RemoveTask;
                m_oRemoveTask.m_delegateRemover.BeginInvoke(key, fCallback, oParam);
            }
            catch
            {
                m_oRemoveTask.DisposeAndCallback();
            }
        }
        public ErrorTypes RemoveTaskEnd(IAsyncResult ar)
        {
            if (ErrorTypes.NoError == m_oRemoveTask.m_eError)
            {
                try
                {
                    m_oRemoveTask.m_delegateRemover.EndInvoke(ar);
                    m_oRemoveTask.Close();
                }
                catch
                {
                    m_oRemoveTask.Dispose();
                }
            }
            return ErrorTypes.NoError;
        }

        private GetQueueAttributesResult GetTaskQueueAttr(Priority oPriority)
        {
            string strUrlQueue = GetQueueUrl(oPriority);

            GetQueueAttributesResult oGetQueueAttributesResult = null;

            try
            {
                
                using (AmazonSQS oSQSClient = AWSClientFactory.CreateAmazonSQSClient())
                {
                    GetQueueAttributesRequest oGetQueueAttributesRequest = new GetQueueAttributesRequest();
                    oGetQueueAttributesRequest.QueueUrl = strUrlQueue;

                    GetQueueAttributesResponse oGetQueueAttributesResponse = oSQSClient.GetQueueAttributes(oGetQueueAttributesRequest);
                    if (oGetQueueAttributesResponse.IsSetGetQueueAttributesResult())
                    {
                        oGetQueueAttributesResult = oGetQueueAttributesResponse.GetQueueAttributesResult;
                    }
                }
            }
            catch (AmazonSQSException)
            {
            }
            catch
            {
            }

            return oGetQueueAttributesResult;
        }
    }
}