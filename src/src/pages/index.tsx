import type { NextPage } from 'next';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { io, Socket } from 'socket.io-client';

const Home: NextPage = () => {
  const messagesElement = useRef(null);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket>();
  const isConnected = useRef<boolean>(false);
  const chatSetting = useRef<boolean>(false);

  useEffect(() => {
    if (!socket) {
      if (!isConnected.current) {
        setSocket(io(process.env.NEXT_PUBLIC_CHAT_SERVER));
        isConnected.current = true;
      }
    } else {
      if (!chatSetting.current) {
        socket.on('chat message', (msg: string) => {
          console.log('chat message on');
          let messages: HTMLUListElement | null = messagesElement.current;
          if (messages) {
            messages = messages as HTMLUListElement;
            const item = document.createElement('li');
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
          }
        });
        socket.on('connect_error', (err) => {
          console.log(err);
        });
        chatSetting.current = true;
      }
    }
  }, [socket]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage('');

    if (socket && data.get('message')) {
      socket.emit('chat message', data.get('message'));
    }
  };

  return (
    <Box sx={{ paddingBottom: '66px' }}>
      <Box component="ul" ref={messagesElement}></Box>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '5px 10px',
          zIndex: '2',
          backgroundColor: 'white',
        }}
      >
        <TextField
          id="message"
          name="message"
          variant="outlined"
          placeholder="メッセージ"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setMessage(e.target.value)}
          sx={{ width: 'calc(100% - 100px)' }}
        />
        <Button type="submit" variant="contained">
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
