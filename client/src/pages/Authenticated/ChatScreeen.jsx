import "./MainScreen.css";
import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../context/AuthProvider";
import { toast } from "react-toastify";
import logo from "../../assets/placeholder.svg";
import { SyncLoader } from "react-spinners";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import Modal from "@mui/material/Modal";
import ChatSkeleton from "../../components/Skeleton/ChatSkeleton";
import { Is_Hebrew } from "../../services";
import { ArrowBack, AttachFile } from "@mui/icons-material";
import SideBar from "./SideBar";
import UserMessage from "../../components/Layout/Message/UserMessage";
import BotMessage from "../../components/Layout/Message/BotMessage";
import {
  createThread,
  getAssistants as getAgents,
  getThreadMessages,
  getThreads,
  sendMessage,
} from "../../api/assistant.js";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { postRequest } from '../../api';;

const initialMessage = (assistantName) => ({
  _id: Date.now(),
  messageContent: `**Greetings, sir!** I am *${assistantName}*, your dedicated AI assistant here on WorkOnIt. In order to get started, please log in.`,
  isPrompt: false,
  timestamp: new Date(),
});

const MainScreen = ({ agentProp }) => {
  const hide = false;
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const { logout, isLoggedIn, getJWT } = useAuth();
  const chatBodyRef = useRef();
  const [isFetching, setIsFetching] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [rows, setRows] = useState(1);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const { agentName, companyId, companyName } = useParams();
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the role from query parameters
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role');
  const getMessagesThreadId = ()=>{
    
    if(messages[0]){
      console.log("messages[0].inboxId", messages[0].inboxId)
      if(messages[0].inboxId){
          return messages[0].inboxId
      }
    }
    console.log("activeThread", activeThread)
    return activeThread
  }

  const handleError = (err, message, onUnauthorized) => {
    if (err?.response?.status === 401) {
      logout();
      onUnauthorized && onUnauthorized();
      return;
    }
    toast.error(message);
    console.error(err);
  };

  useEffect(() => {
    // Assuming agents is already populated with the agents data
    if (agentName) {
      const tmpAgent = agents.find(
        (agent) => agent.name.toLowerCase() === agentName.toLowerCase()
      );
      if (tmpAgent) {
        setSelectedAgent(tmpAgent);
      }
    }
  }, [agentName, agents]);



  const getInbox = async () => {
    if (!selectedAgent) return;

    setIsFetching(true);
    setIsTyping(true);
    const token = getJWT();

    if (!token) {
      setMessages([initialMessage(selectedAgent?.name)]);
      setIsFetching(false);
      setIsTyping(false);
      return;
    }

    try {
      console.log("selectedAgent is", selectedAgent);
      let _threads = await getThreads(selectedAgent?.assistant_id);

      if (_threads.data.threads.length === 0) {
        console.log("No threads");
        const res = await createThread(
          selectedAgent?.assistant_id
        );
        _threads.data.threads = [res.data.thread];
        setActiveThread(_threads.data.threads[0].id);
      } else {
        setActiveThread(_threads.data.threads[0].threadId);
      }
      setThreads(_threads.data.threads);
      console.log("_threads.data.threads", _threads.data.threads);
    } catch (err) {
      handleError(err, "Error fetching threads", () => {
        setMessages([initialMessage(selectedAgent?.name)]);
      });
    } finally {
      setIsFetching(false);
      setIsTyping(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      if (!activeThread) return;

      setIsTyping(true);

      try {
        const res = await getThreadMessages(activeThread);
        console.log("Messages are ", res.data.messages);
        setMessages(res.data.messages);
       
      } catch (err) {
        handleError(err, "Error fetching messages");
      } finally {
        setIsTyping(false);
      }
    };

    getMessages();
  }, [threads, activeThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    try{
      const urlParams = new URLSearchParams(window.location.search);
      const myParam = urlParams.get('code');
      console.log(myParam);
      if(myParam){postRequest('/twitter/sendcode', {code:myParam})}
      }finally{
          console.log('no code')
      }
    setIsLoading(true);
    setIsTyping(true);
    const getAssistants = async () => {
      try {
        const res = await getAgents();
        setAgents(res.data.assistants);
      } catch (err) {
        toast.error("Error fetching agents");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    };
    getAssistants();
  }, []);

  useEffect(() => {
    getInbox();
  }, [selectedAgent, isLoggedIn]);

  useEffect(() => {
    if(companyName && companyId && !isLoggedIn) {
      setShowEmployeeModal(true);
    }
  }, [companyName, companyId, isLoggedIn]);

  const handleAgentClick = (agent) => {
    if (agent === selectedAgent) return; // Do nothing if the agent is already selected
    setMessages([]);
    window.history.pushState({}, "", `/${agent?.name?.toLowerCase()}`);
    setSelectedAgent(agent);
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    setInput(input.trim());
    if (input.length === 0) return;

    const token = getJWT();

    if (!token) {
      toast.error("Please login to continue");
      setShowModal(true);
      return;
    }

    if (isTyping) {
      toast.success("Please wait while the agent is responding");
      return;
    }

    const newMessage = {
      messageContent: input,
      isPrompt: true,
      timestamp: Date.now(),
    };

    // setMessages(() => [...messages, {
    //     _id: Date.now(),
    //     messageContent: input,
    //     isPrompt: true,
    //     timestamp: Date.now()
    // }]);

    const tempUserMessage = {
      _id: Date.now(),
      messageContent: input,
      isPrompt: true,
      timestamp: Date.now(),
    };

    // todo
    const tempResponse = {
        _id: Date.now(),
        messageContent: Is_Hebrew(input)
          ? "אני על זה"
          : "I'm on it",
        isPrompt: false,
        timestamp: new Date(),
      };
    setMessages(() => [...messages, tempUserMessage, tempResponse]);
    scrollToBottom();
    setInput("");
    setIsTyping(true);
    try {
      console.log("activeThread is", activeThread);
      const res = await sendMessage({
        messageContent: input,
        assistantId: selectedAgent?.assistant_id,
        threadId: activeThread,
      });

      setIsTyping(false);

      if(getMessagesThreadId() ==res.data.message.inboxId ){

      setMessages(() => [...messages, tempUserMessage, res.data.message]);
      }

      scrollToBottom();
      setInput("");
    } catch (err) {
      toast.error("Error sending message");
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };
  const scrollToBottom = () => {
    // if (chatBodyRef.current) {
    //     chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    // }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type.split("/")[0] === "image") {
      toast.error("Please select a document file");
      return;
    }
    setFile(file);
    setNewMessage(file.name);
  };

  const handleAttachmentClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault(); // Prevent the default action (new line)
      setInput((prevInput) => prevInput + "\n"); // Add a newline character
      setRows((prevRows) => prevRows + 1); // Increase the number of rows
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action (new line)
      submitMessage(event); // Call the submitMessage function
    }
  };

  return (
    <div className="main-screen">
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="modal__login">
          <Login setShowModal={setShowModal} />
        </div>
      </Modal>

      <Modal open={showEmployeeModal} onClose={() => setShowEmployeeModal(false)}>
        <div className="modal__login">
          <Signup setSignUpModal={setShowEmployeeModal} companyName={companyName} companyId={companyId} role={role}/>
        </div>
      </Modal>


      <SideBar
        handleAgentClick={handleAgentClick}
        selectedAgent={selectedAgent}
        hide={hide}
        isLoading={isLoading}
        agents={agents}
        setShowModal={setShowModal}
      />
      <div className={selectedAgent == null ? "chat hidden" : "chat"}>
        <div className="chat__header">
          {selectedAgent && (
            <div
              className="chat__back"
              onClick={() => {
                setSelectedAgent(null);
              }}
            >
              <ArrowBack />
            </div>
          )}

          <div className="chat__headerInfo">
            <h3>
              {selectedAgent == null
                ? "Chats"
                : `${selectedAgent?.name}'s Chat`}
            </h3>
          </div>
        </div>
        {selectedAgent ? (
          <div className="chat__body" ref={chatBodyRef}>
            <section className="chat">
              <div className="messages-chat">
                {isFetching ? (
                  <div className="chat__skeleton__container">
                    <ChatSkeleton />
                  </div>
                ) : (
                  <>
                    {" "}
                    <div className="messages__list">
                      {messages.map((message) =>
                        message.isPrompt ? (
                          <UserMessage message={message} key={message._id} />
                        ) : (
                          <BotMessage message={message} key={message._id} />
                        )
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="typing-indicator">
                      <SyncLoader
                        color="rgb(0,0,0,0.7)"
                        loading={isTyping}
                        size={8}
                        speedMultiplier={0.7}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>
            {/* Invisible element at the end of your messages */}
          </div>
        ) : (
          <div className="select-agent">
            <img className="svg" src={logo} alt="Logo" />
          </div>
        )}
        {selectedAgent != null && (
          // <div className="chat__footer">
          //     <div className="footer__buttons" onClick={handleAttachmentClick}>
          //         <AttachFile />
          //     </div>
          //     <form className="message-form">
          //         <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
          //         <textarea
          //             value={input}
          //             onChange={(event) => setInput(event.target.value)}
          //             onKeyDown={handleKeyPress}
          //             placeholder="Type a message"
          //             rows={rows}
          //             className="chat__input"
          //         />
          //         <button
          //             onClick={submitMessage}
          //             disabled={input.length === 0}
          //         >
          //             Send a message
          //         </button>
          //     </form>

          //     <div onClick={submitMessage} className="footer__buttons">
          //         <SendIcon
          //             style={{
          //                 color: isTyping ? 'gray' : '#5F8F47',
          //                 fontSize: '30px'
          //             }}
          //         />
          //     </div>
          // </div>
          <div className="chat__footer">
            <div className="footer__buttons" onClick={handleAttachmentClick}>
              <AttachFile />
            </div>
            <form className="message-form">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message"
                rows={rows}
                className="chat__input"
              />
              <button
                onClick={submitMessage}
                disabled={input.length === 0}
                className="send-button"
              >
                Send
              </button>
            </form>
            <div onClick={submitMessage} className="footer__buttons">
              <SendIcon
                style={{
                  color: isTyping ? "gray" : "#5F8F47",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainScreen;
