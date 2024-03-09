import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { onValue, push, ref } from 'firebase/database';
import { ArrowBack, Send } from '@material-ui/icons';
import { db } from '../rtdb/config';

const username  = localStorage.getItem('username');
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
    outline: 'none',
    padding: theme.spacing(2),
  },
  messageList: {
    maxHeight: '80%',
    overflowY: 'auto',
    marginTop: 50
  },
  messageForm: {
    position: 'absolute',
    bottom: theme.spacing(0),
    left: 0,
    width: '60%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
    header: {
    position: 'absolute',
    top: theme.spacing(0),
    left: 0,
    width: '60%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  sendButton: {
    marginLeft: theme.spacing(1),
    padding: 16
  },
}));

const ChatBox = ({user}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
   
  };


 useEffect(() => {
  const dataRef = ref(db, 'messages/');
  const unsubscribe = onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messagesData = Object.entries(data).map(([id, item]) => ({ id, ...item }));
      setMessages(messagesData);
    } else {
      setMessages([]);
    }
  });

  setOpen(true);

  return () => {
    unsubscribe(); // Désabonnez-vous de la mise à jour de la base de données lors du démontage du composant
    setOpen(false);
  };
}, []);

   const sendMessage = () => {
    const messageBody = {
      sender: localStorage.getItem('username'),
      message: message,
      date: new Date().toISOString(),
    };

    const chatRef = ref(db, 'messages');

    push(chatRef, messageBody).then(() => {
      setMessage('');
    });
  };

    const handleSendMessage = () => {
      const MAX_WORD_LENGTH = 20;
        const words = message.split(' ');

    for (const word of words) {
      if (word.length < MAX_WORD_LENGTH) {
         if (message.trim() !== '') {
      const data = {
        messageText: message,
        sender: localStorage.getItem('username') ,
        date: new Date().toISOString()
      }
   sendMessage()
      setMessage('');
    }

        return;
      }
    }
   
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
        disableEnforceFocus
        disableAutoFocus
      >
        <Slide direction="right" in={open} mountOnEnter unmountOnExit>
          <Paper className={classes.modalContent+ ' ' + 'container'}>
               <div className={classes.header + ' ' + ' bg-gray-200'}>

                  <IconButton onClick={()=>{
                    handleClose()
                  }}>
                    <ArrowBack />
                  </IconButton>
                 
                
                 
            </div>
            {/* Liste des messages */}
            <div className={classes.messageList + '   ' + 'container'}>
                 {messages.map((msg, index) => {
  
             const words = msg.message.split(' ');

    for (const word of words) {
      if (word.length < 20) {
       
       return(
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === username ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor:msg.sender === username ? '#1976d2' : '#F5F5F5',
                   color:msg.sender === username ? 'white' : '',
                  borderRadius: '8px',
                  p: 2,
                  maxWidth: '75%',
                  width: 'fit-content',
                }}
              >
                 <Typography >
                    <b>{msg.sender}</b>
                 </Typography>

                <Typography variant="body1">{msg.message}</Typography>
              </Box>
              <div id='#bottom'>
              </div>
            </Box>
          )
      }
   }

          })}
            </div>

            {/* Formulaire d'envoi de message */}
            <div className={classes.messageForm + ' ' + ' bg-gray-200'}>
              <TextField
                placeholder="Nouveau message"
                variant="outlined"
                value={message}
                multiline
                onChange={(e)=>{
                    setMessage(e.target.value)
                }}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.sendButton}
                onClick={handleSendMessage}
              >
                <Send />
              </Button>
            </div>
          </Paper>
        </Slide>
      </Modal>
    </div>
  );
};

export default ChatBox;
