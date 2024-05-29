import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Sidebar, ConversationList, Conversation, Avatar } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import BASE_URL from "../../apiConfig";
import { Button } from "@nextui-org/react";
import assets from "../assets";
import Pusher from 'pusher-js';

const ChatPenggunaPage = ({ isChatOpen, setIsChatOpen, initialSelectedPenyedia }) => {
    const [penyediaList, setPenyediaList] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [idPengguna, setIdPengguna] = useState(null);
    const [selectedPenyedia, setSelectedPenyedia] = useState(initialSelectedPenyedia);

    useEffect(() => {
        fetchIdPengguna();
    }, []);

    useEffect(() => {
        if (isChatOpen) {
            fetchPenyediaList();
        }
    }, [isChatOpen]);

    useEffect(() => {
        if (selectedPenyedia) {
            fetchChatMessages(selectedPenyedia.id_penyedia);
        }
    }, [selectedPenyedia]);

    useEffect(() => {
        if (idPengguna) {
            const pusher = new Pusher('e21838f78ffab644f9fa', {
                cluster: 'ap1'
            });

            const channel = pusher.subscribe('channel-' + idPengguna);
            console.log('Subscribed to channel: ', 'channel-' + idPengguna);
            channel.bind('NotifyyFrontend', function (data) {
                console.log('Received data: ', data);
                if (selectedPenyedia) {
                    fetchChatMessages(selectedPenyedia.id_penyedia);
                }
            });

            return () => {
                channel.unbind_all();
                channel.unsubscribe();
            };
        }
    }, [idPengguna, selectedPenyedia]);

    const fetchIdPengguna = async () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            try {
                const response = await axios.get(`${BASE_URL}/api/pengguna`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setIdPengguna(response.data.data.id_pengguna);
                console.log("User ID fetched:", response.data.data.id_pengguna);
            } catch (error) {
                console.error('Error fetching current user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch current user.',
                });
            }
        }
    };

    const fetchPenyediaList = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/api/listChatPengguna`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setPenyediaList(response.data.data);
            console.log("Penyedia list fetched:", response.data.data);
        } catch (error) {
            console.error('Error fetching penyedia list:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch penyedia list.',
            });
        }
    };

    const fetchChatMessages = async (id_penyedia) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/api/isiChatPengguna`, { id_penyedia }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setChatMessages(response.data.data);
            console.log("Chat messages fetched:", response.data.data);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch chat messages.',
            });
        }
    };

    const handleSendMessage = async (message) => {
        if (!selectedPenyedia) {
            Swal.fire({
                icon: 'warning',
                title: 'No Penyedia Selected',
                text: 'Please select a penyedia to start chatting.',
            });
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/api/chatPengguna`, {
                isi_chat: message,
                id_penyedia: selectedPenyedia.id_penyedia,
                uid_sender: idPengguna
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setChatMessages([...chatMessages, response.data.data]);
        } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send message.',
            });
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const selectPenyedia = (penyedia) => {
        setSelectedPenyedia(penyedia);
        fetchChatMessages(penyedia.id_penyedia);
    };

    return (
        <div className="fixed z-50 bottom-20 right-5">
            {isChatOpen && (
                <div className="w-[600px] h-[500px] bg-white shadow-lg rounded-lg">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold">Pesan</h2>
                        <button onClick={closeChat} className="text-gray-600 hover:text-gray-800">
                            ✕
                        </button>
                    </div>
                    <MainContainer>
                        <Sidebar position="left" scrollable>
                            <ConversationList>
                                {penyediaList.map(penyedia => (
                                    <Conversation
                                        key={penyedia.id_penyedia}
                                        name={penyedia.nama_penyedia}
                                        onClick={() => selectPenyedia(penyedia)}
                                        className={selectedPenyedia?.id_penyedia === penyedia.id_penyedia ? "bg-blue-100" : ""}
                                    >
                                        <Avatar src={penyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + penyedia.gambar_penyedia : assets.profile} />
                                    </Conversation>
                                ))}
                            </ConversationList>
                        </Sidebar>
                        <ChatContainer>
                            <MessageList>
                                {chatMessages
                                    .filter((message) => message.isi_chat)
                                    .map((message, index) => (
                                        <Message
                                            key={index}
                                            model={{
                                                message: message.isi_chat,
                                                direction: message.uid_sender === idPengguna ? "outgoing" : "incoming",
                                            }}
                                        />
                                    ))}
                            </MessageList>
                            <MessageInput 
                                placeholder={selectedPenyedia ? "Type message here" : "Select a penyedia to start chatting"}
                                onSend={handleSendMessage}
                                disabled={!selectedPenyedia}
                            />
                        </ChatContainer>
                    </MainContainer>
                </div>
            )}
            {!isChatOpen && (
                <div>
                    <Button onClick={toggleChat} className="bg-[#FA9884] hover:bg-red-700 text-white w-full">
                        Open Chat
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ChatPenggunaPage;
