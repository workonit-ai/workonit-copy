const formatMessage = (message) => {
    return {
        _id: message.id,
        isPrompt: message.role === 'user',
        inboxId: message.thread_id,
        messageContent: message.assistant_id=='asst_BnEVbXDYqnG5qs95XCSuQrEW'?JSON.parse(message.content[0].text.value):message.content[0].text.value,
        timestamp: message.created_at
    };
}


// Sort the messages based on the timestamp and then return it
const formatMessages = (messages) => {
    
    const data = messages.map((message) => formatMessage(message))
                   .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    try{
        if(messages[0].assistant_id=='asst_BnEVbXDYqnG5qs95XCSuQrEW' ){
            data[0].messageContent = data[0].messageContent.slice(4)
        }
    }finally{
        return data
    }
    
    
};

module.exports = {
    formatMessage,
    formatMessages
}
