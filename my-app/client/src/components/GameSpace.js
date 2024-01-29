import { Group, SportsEsports } from '@mui/icons-material';
import { Avatar, Box, Card, Grid, List, ListItem, ListItemAvatar, ListItemText, Slide, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import GameTable from './Table';
import { io } from 'socket.io-client';
 const socket = io('http://localhost:3001');
const gamersNum = localStorage.getItem('size')


function GameSpace(props) {
    const [ open , setOpen] = useState(true)
    const[ game, setGame] = useState(null)
     useEffect(()=>{
      socket.on('gameCreated',(gameCreated)=>{
         console.log(gameCreated)
         if (gameCreated) {
           setGame(gameCreated) 
           console.log(gameCreated)
         }
      })
     }, [])
   if (game!==null) {
      return (
     <Box> 
        <Grid container>
              <Grid xs={12} sm={12} md={8} lg={8} item>
                 <Box minHeight={window.innerHeight} >
                   <GameTable />
                 </Box>
              </Grid>

               <Grid xs={12} sm={12} md={6} lg={4} item>
                 <Card sx={{minHeight: window.innerHeight}}>
                      <List>
                         <ListItem>
           <h1 style={{textAlign: 'center'}}>Paramètres de jeux</h1>
           </ListItem>
             <ListItem>
                <ListItemAvatar>
                 <Avatar>
                    <SportsEsports />
           </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Nombre de joueurs" secondary={game.numberOfPlayers} />
      </ListItem>

       <ListItem>
                <ListItemAvatar>
                 <Avatar>
                    <Group />
           </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Participants de Jeu"  />
      </ListItem>
       
             {
            game.participants.map((gamer)=>{
                return<ListItem>
                    {gamer}
                </ListItem>
            })
         }
    
        </List>
                 </Card>
              </Grid>
            </Grid>       
     </Box>
    ); 
   }
}

export default GameSpace;