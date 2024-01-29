import { Box, Container, Modal, Slide } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyModal({user , children}) {

    const [open , setOpen] = useState(true)
    const navigate = useNavigate()
    const handleCloseModal = ()=>{
        setOpen(false)
    }
    useEffect(()=>{
        setOpen(true)
        return ()=>{
            setOpen(false)
        }
    }, [])
    return (
        <Box>
             <Modal open={open} onClose={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Slide direction="left" in={open} mountOnEnter unmountOnExit timeout={2000}>
        <Container  maxWidth="sm" style={{
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '15px',
    marginTop: '50px',
    maxHeight: window.innerHeight,
    overflowY: 'auto',
   
  }} className='container'>
    {children}
  </Container>
  </Slide>
  </Modal>
</Box>
    );
}

export default MyModal;