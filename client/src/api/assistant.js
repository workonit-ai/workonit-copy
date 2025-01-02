import { getRequest, postRequest } from './index.js';

export const getAssistants = async () => getRequest('/assistant');

export const getThreads = async (threadId) => getRequest(`/assistant/${threadId}`);

export const createThread = async (assistantId) => getRequest(`/chat/thread/new/${assistantId}`);

// export const deleteThread = async (threadId) => TODO;

export const getThreadMessages = async (threadId) => getRequest(`/chat/thread/${threadId}`);

// export const getNewShiftsThread = async (assistantId, metadata) => getRequest(`/chat/assistants/${assistantId}/threads/new/`);

export const getNewShiftsThread = async (assistantId, metadata) => {
    
    const queryParams = new URLSearchParams(metadata).toString();

    const url = `/chat/assistants/${assistantId}/threads/new?${queryParams}`;
  
    return getRequest(url);
  };

export const sendMessage = async (data = {
    threadId: '',
    assistantId: '',
    messageContent: ''
}) => postRequest('/chat/message', data);


export const externalMessages = async (data = {
    thread: '',
    assistantId: '',
    messageContent: ''
}) => postRequest('/chat/external', data);