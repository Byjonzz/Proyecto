import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Fab, Paper, Typography, IconButton, TextField,
    Avatar, CircularProgress
} from '@mui/material';
import { SmartToy, Close, Send, AccountCircle } from '@mui/icons-material';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const AsistenteFlotante = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(false);

    const [historial, setHistorial] = useState([
        { role: 'assistant', content: '¡Hola! Soy SolitBot. 🤖 ¿En qué puedo ayudarte hoy con tus rutas, planes o comisiones?' }
    ]);

    const contenedorChatRef = useRef(null);

    useEffect(() => {
        if (contenedorChatRef.current) {
            contenedorChatRef.current.scrollTop = contenedorChatRef.current.scrollHeight;
        }
    }, [historial, loading]);

    const handleEnviarMensaje = async (e) => {
        e.preventDefault();
        if (!mensaje.trim() || loading) return;

        const nuevoMensajeUsuario = { role: 'user', content: mensaje.trim() };
        const historialActualizado = [...historial, nuevoMensajeUsuario];

        setHistorial(historialActualizado);
        setMensaje('');
        setLoading(true);

        try {
            const res = await api.post('/asistente-ia/', {
                historial: historialActualizado
            }, { timeout: 60000 });

            if (res.data && res.data.respuesta) {
                setHistorial([...historialActualizado, { role: 'assistant', content: res.data.respuesta }]);
            }
        } catch (error) {
            console.error('Error en el chat de IA:', error);
            setHistorial([...historialActualizado, { role: 'assistant', content: ' Error de comunicación con el servidor central.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>

            {!isOpen && (
                <Fab color="primary" aria-label="chat-ia" onClick={() => setIsOpen(true)} sx={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }}>
                    <SmartToy />
                </Fab>
            )}

            {isOpen && (
                <Paper variant="outlined" sx={{
                    width: { xs: 320, sm: 380 }, height: 500, borderRadius: 4, display: 'flex',
                    flexDirection: 'column', overflow: 'hidden', boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }}>
                    <Box sx={{ bgcolor: '#0f172a', color: 'white', px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SmartToy sx={{ color: '#3b82f6' }} />
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>SolitBot</Typography>
                                <Typography variant="caption" sx={{ color: '#10b981', display: 'block', lineHeight: 1 }}>● Conectado a BD</Typography>
                            </Box>
                        </Box>
                        <IconButton size="small" sx={{ color: 'white' }} onClick={() => setIsOpen(false)}>
                            <Close fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box ref={contenedorChatRef} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {historial.map((msg, idx) => {
                            const isUser = msg.role === 'user';
                            return (
                                <Box key={idx} sx={{ display: 'flex', gap: 1, flexDirection: isUser ? 'row-reverse' : 'row', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
                                    <Avatar sx={{ width: 28, height: 28, bgcolor: isUser ? '#2563eb' : '#334155', mt: 0.5 }}>
                                        {isUser ? <AccountCircle fontSize="small" /> : <SmartToy fontSize="small" />}
                                    </Avatar>
                                    <Box sx={{
                                        p: 1.5, borderRadius: 3,
                                        bgcolor: isUser ? '#2563eb' : 'white',
                                        color: isUser ? 'white' : '#1e293b',
                                        boxShadow: isUser ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                                        border: isUser ? 'none' : '1px solid #e2e8f0',
                                        borderTopRightRadius: isUser ? 4 : 12,
                                        borderTopLeftRadius: isUser ? 12 : 4,
                                    }}>
                                        {isUser ? (
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                                                {msg.content}
                                            </Typography>
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    h3: ({ node, ...props }) => <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2563eb', mt: 1.5, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }} {...props} />,
                                                    p: ({ node, ...props }) => <Typography variant="body2" sx={{ mb: 1, fontSize: '0.85rem', lineHeight: 1.5 }} {...props} />,
                                                    ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 1 }} {...props} />,
                                                    li: ({ node, ...props }) => <Typography component="li" variant="body2" sx={{ mb: 0.8, fontSize: '0.85rem', lineHeight: 1.4 }} {...props} />,
                                                    strong: ({ node, ...props }) => <Box component="span" sx={{ fontWeight: 800, color: '#0f172a' }} {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}

                        {loading && (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pl: 1 }}>
                                <CircularProgress size={16} />
                                <Typography variant="caption" color="text.secondary">Analizando bases de datos...</Typography>
                            </Box>
                        )}
                    </Box>

                    <Box component="form" onSubmit={handleEnviarMensaje} sx={{ p: 1.5, bgcolor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            placeholder="Pregúntame por planes..." fullWidth size="small" variant="standard"
                            value={mensaje} onChange={(e) => setMensaje(e.target.value)} disabled={loading}
                            InputProps={{ disableUnderline: true, sx: { fontSize: '0.9rem', px: 1 } }}
                        />
                        <IconButton type="submit" color="primary" disabled={!mensaje.trim() || loading} size="small">
                            <Send fontSize="small" />
                        </IconButton>
                    </Box>

                </Paper>
            )}
        </Box>
    );
};

export default AsistenteFlotante;