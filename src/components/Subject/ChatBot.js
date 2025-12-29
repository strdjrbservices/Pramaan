import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, Button, List, ListItem, ListItemText, Typography, IconButton, Avatar } from '@mui/material';
import { SmartToy as SmartToyIcon, Close as CloseIcon } from '@mui/icons-material';

const ChatBot = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I help you with your appraisal review today?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (input.trim()) {
            const userMessage = { sender: 'user', text: input };
            setMessages(prevMessages => [...prevMessages, userMessage]);

            // Simulate bot response
            setTimeout(() => {
                const botResponse = { sender: 'bot', text: `I've received your message: "${input}". I'm still learning, but I'll do my best to help!` };
                setMessages(prevMessages => [...prevMessages, botResponse]);
            }, 1000);

            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!open) {
        return null;
    }

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 350,
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1300,
                borderRadius: '10px',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 1 }}>
                        <SmartToyIcon />
                    </Avatar>
                    <Typography variant="h6">DJRB Bot</Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon sx={{ color: 'primary.contrastText' }} />
                </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                <List>
                    {messages.map((message, index) => (
                        <ListItem key={index} sx={{
                            display: 'flex',
                            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 1,
                                    maxWidth: '80%',
                                    bgcolor: message.sender === 'user' ? 'secondary.light' : 'grey.200',
                                }}
                            >
                                <ListItemText primary={message.text} />
                            </Paper>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button variant="contained" onClick={handleSend}>Send</Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ChatBot;