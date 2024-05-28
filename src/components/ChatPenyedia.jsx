import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, Sidebar, ConversationList, Conversation, Avatar } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import BASE_URL from "../../apiConfig";  // Ensure this path is correct
import { Button } from "@nextui-org/react";
import assets from "../assets";
import Pusher from 'pusher-js';

const ChatPenyediaPage = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [penggunaList, setPenggunaList] = useState([]);
    const [selectedPengguna, setSelectedPengguna] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [idPenyedia, setIdPenyedia] = useState(null);

    useEffect(() => {
        fetchIdPenyedia();
        const pusher = new Pusher('e21838f78ffab644f9fa', {
            cluster: 'ap1'
        });

        const channel = pusher.subscribe('channel-' + idPenyedia);
        channel.bind('NotifyyFrontend', function (data) {
            fetchChatMessages(selectedPengguna.id_pengguna);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [idPenyedia, selectedPengguna]);

    const fetchIdPenyedia = async () => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            axios.get(`${BASE_URL}/api/penyedia`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }).then(response => {
                setIdPenyedia(response.data.data.id_penyedia);
                console.log(response.data);
            }).catch(error => {
                console.error('Error fetching current user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch current user.',
                });
            });
        }
    };

    const fetchPenggunaList = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/api/listChatPenyedia`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setPenggunaList(response.data.data);
        } catch (error) {
            console.error('Error fetching pengguna list:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch pengguna list.',
            });
        }
    };

    const fetchChatMessages = async (id_pengguna) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/api/isiChatPenyedia`, { id_pengguna }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setChatMessages(response.data.data);
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
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/api/chatPenyedia`, {
                isi_chat: message,
                id_pengguna: selectedPengguna.id_pengguna,
                uid_sender: idPenyedia
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
        if (!isChatOpen) {
            fetchPenggunaList();
        }
        setIsChatOpen(!isChatOpen);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const selectPengguna = (pengguna) => {
        setSelectedPengguna(pengguna);
        fetchChatMessages(pengguna.id_pengguna);
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
                                {penggunaList.map(pengguna => (
                                    <Conversation key={pengguna.id_pengguna} name={pengguna.nama_pengguna} onClick={() => selectPengguna(pengguna)}>
                                        <Avatar src={pengguna.gambar_pengguna ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + pengguna.gambar_pengguna : assets.profile} />
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
                                                direction: message.uid_sender === idPenyedia ? "outgoing" : "incoming",
                                            }}
                                        />
                                    ))}
                            </MessageList>
                            {selectedPengguna && (
                                <MessageInput placeholder="Type message here" onSend={handleSendMessage} />
                            )}
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

export default ChatPenyediaPage;
