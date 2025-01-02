import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BotMessage = ({ message, isTyping }) => {
  // Function to preprocess the message content
  const preprocessMessageContent = (content) => {
    return content
      .replace(/(\d+)\.\s+/g, '$1\\. ') // Escape the period after numbers
      .replace(/^(\s*)-\s+/gm, '$1- '); // Preserve spaces before list items
  };

  return (
    <div className="message bot-message">
      <div className="text">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p {...props} />,
            li: ({ node, ...props }) => (
              <li style={{ whiteSpace: 'pre-wrap', marginLeft: '0.5em' }} {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul style={{ listStyleType: 'none', paddingLeft: 0 }} {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol style={{ paddingLeft: '1.5em', marginBottom: '1em' }} {...props} />
            ),
          }}
        >
          {preprocessMessageContent(message.messageContent)}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default BotMessage;