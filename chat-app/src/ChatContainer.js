    import React, { useState, useEffect } from 'react';

    function ChatContainer() {

        const [message, setMessage] = useState('');
        const username = 'You';
        // const [messages, setMessages] = useState([]);
        const [userMessages, setUserMessages] = useState([]);
        const [assistantMessages, setAssistantMessages] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [isResponding, setIsResponding] = useState(false);
        const [isMountedRef, setIsMountedRef] = useState(false);


        useEffect(() => {
            document.getElementsByClassName('chat-input-box')[0].focus();
        }, []);

        useEffect(() => {
            const typingDot = document.getElementById('typing-dot')

            if (typingDot !== null) {
                if (isLoading) {
                    // check if typing dot is not null
                    typingDot.style.display = ' block';
                }
                else {
                    typingDot.style.display = 'none';}}}, [isLoading]);


        function messagesToDictList() {
            // Create a list of dictionaries with the user and assistant messages
            // each dictionary has a key role and content
            // userMessages and assistantMessages have roles of user and asssistant respectively
            let messages = [];
            for (let i = 0; i < userMessages.length + assistantMessages.length; i++) {
                if (i % 2 === 0) {
                    messages.push({role: 'user', content: userMessages[Math.floor(i / 2)]});
                }
                else {
                    messages.push({role: 'assistant', content: assistantMessages[Math.floor(i / 2)]});
                }
            }
            return messages;
        }


        function handleSubmit() {
            
            if (message === '') {
                return;
            }
            if (isLoading) {
                return;
            }
            if (isResponding) {
                return;
            }
            
            setIsLoading(true);

            const sendButton = document.querySelector('.button');
            sendButton.classList.add('.button:active');
            console.log(message);
            
            setUserMessages(userMessages => [...userMessages, message]);
            setMessage('');
                           
            const messageScroll = document.getElementById('message-scroll');
            messageScroll.scrollTop = messageScroll.scrollHeight;

        }

        function ImitateAssistantTyping(newAssistantMessage) {
            // Imitate the assistant typing by iteratively appending characters to the last element of assistantMessages
            
            for (let i = 0; i < newAssistantMessage.length; i++) {
                setTimeout(() => {
                    if (i === 0) {
                        setIsResponding(true);
                    }

                    setAssistantMessages(assistantMessages => [...assistantMessages.slice(0, -1), assistantMessages[assistantMessages.length - 1] + newAssistantMessage[i]]);
                    
                    if (i === newAssistantMessage.length - 1) {
                        setIsResponding(false);
                    }

                }, 30 * i);
            }
            
        }


        useEffect(() => {
        if (!isMountedRef) {
            setIsMountedRef(true);
            return;
        }

        if (userMessages.length === 0) {
            return;
        }

        const url = 'http://localhost:5000/message';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messagesToDictList()),

        })
        .then(
            setAssistantMessages(assistantMessages => [...assistantMessages, ""]),
        )
        .then(response => response.json())
        .then(
            data => {
                console.log(data);
                
                setIsLoading(false);

                // remove and reset the last message
                ImitateAssistantTyping(data.message);

                // setAssistantMessages(assistantMessages => [...assistantMessages, data.message]);

                setTimeout(() => {
                    const messageScroll = document.getElementById('message-scroll');
                    messageScroll.scrollTop = messageScroll.scrollHeight;
                },
                    0)
                })            
                }

        , [userMessages]);

        useEffect(() => {
            const messageScroll = document.getElementById('message-scroll');
            messageScroll.scrollTop = messageScroll.scrollHeight;
            }, [assistantMessages, userMessages]);

        function handleKeyDown(event) {
            // handle cntrl + enter
            if (event.ctrlKey && event.key === 'Enter') {
                // add a newline character
                setMessage(message + '\n');
                return;
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSubmit();
            }
        }

        function handleClear() {
            setAssistantMessages([]);
            setUserMessages([]);
            setIsLoading(false);
        }

        function interweveMessages() {
            // interweave messages starting with user messages
            let messages = [];
            for (let i = 0; i < userMessages.length + assistantMessages.length; i++) {
                if (i % 2 === 0) {
                    messages.push(userMessages[Math.floor(i / 2)]);
                }
                else {
                    messages.push(assistantMessages[Math.floor(i / 2)]);
                }

            }
            console.log(messages);
            return messages;
        }

        const messageElements = interweveMessages().reverse().map((message, index) => {

            console.log(interweveMessages());
            // calculate index - length of messages to determine if message is even or odd
            let class_name = (index - interweveMessages().length) % 2 !== 0 ? "chat-message right chat-message-right-color" : "chat-message left chat-message-left-color";
            let messageFlagClassName = (index - interweveMessages().length) % 2 !== 0 ? "chat-message-flag-right chat-message-right-color" : "chat-message-flag-left chat-message-left-color";

            return (
                <div key={index} className={class_name}>
                    <div className={messageFlagClassName}/>
                        <div name="chat-message-content">
                        <div className='user-message-details'>
                            <span className="chat-message-username">{
                                (index - interweveMessages().length) % 2 !== 0 ? username : 'Assistant'
                            } </span>
                        </div>
                            <p className="chat-message-message">{
                                message

                            }</p>

                            {/* only put the typing-dot div if the message is the last message */}
                            {index === 0 &&
                            <div id="typing-dot">
                                <span className="typing-dot-1 typing-dot"/>
                                <span className="typing-dot-2 typing-dot"/>
                                <span className="typing-dot-3 typing-dot"/>
                            </div>                            
                            }

                    </div>
                </div>
            );
        });

        
        return (
            
            <div className="chat-container-outer">
            <div className="chat-container">
                <div className="chat-messages-scroll" id="message-scroll">
                    <div className="chat-messages">
                        {messageElements}
                    </div>
                <div className="fade-box-bottom"/>
                <div className="fade-box-top"/>
                </div>
            
            <div className="chat-input">
                <div className="chat-input-inner">
                    <textarea
                        className="chat-input-box"
                        placeholder="Type a message..."
                        value={message}
                        onChange={event => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}/>
                    <button className="button" onClick={handleSubmit}>Send</button>
                    <button className="button" onClick={handleClear}>Clear</button>
                </div>
            </div>
            </div>
            </div>
        );
    }

    export default ChatContainer;

