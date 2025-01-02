// import './Message.css';

// const UserMessage = ({ message }) => {
//   const dateObject = new Date(message.timestamp);

//   const options = { hour: "numeric", minute: "numeric", hour12: true };
//   const formattedTime = dateObject.toLocaleTimeString("en-US", options);

//   return (
//     <>
//       <div className="message text-only">
//         <div className="response">
//           <div className="text">
//             <p>{message.messageContent}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserMessage;
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Message.css';

const UserMessage = ({ message }) => {
  const dateObject = new Date(message.timestamp);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = dateObject.toLocaleTimeString("en-US", options);

  const preprocessMessageContent = (content) => {
    return content
      .replace(/(\d+)\.\s+/g, '$1\\. ')
      .replace(/^(\s*)-\s+/gm, '$1- ');
  };

  return (
    <div className="message user-message">
      <div className="response">
        <div className="text">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node, ...props }) => <p style={{ marginBottom: '0.5em' }} {...props} />,
              li: ({ node, ...props }) => (
                <li style={{ whiteSpace: 'pre-wrap', marginBottom: '0.5em' }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }} {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol style={{ paddingLeft: '1.5em', marginBottom: '0.5em' }} {...props} />
              ),
            }}
          >
            {preprocessMessageContent(message.messageContent)}
          </ReactMarkdown>
        </div>
        <span className="time">{formattedTime}</span>
      </div>
    </div>
  );
};

export default UserMessage;