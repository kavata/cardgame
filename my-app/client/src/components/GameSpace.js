import { Group, SportsEsports } from '@mui/icons-material';
import { Avatar, Box, Card, Grid, List, ListItem, ListItemAvatar, ListItemText, Button, Slide, Typography, Fab } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import GameTable from './Table';
import { io } from 'socket.io-client';
import  {distributeCards} from './data/distributeCards'
import {ref , onValue , push} from 'firebase/database'
import { db } from '../rtdb/config'
import Chat from './Chat';
import { AddComment } from '@material-ui/icons';

 const socket = io('http://localhost:3001');
const gamersNum = localStorage.getItem('size')


function GameSpace(props) {
    const [ open , setOpen] = useState(false)
    const[ game, setGame] = useState(null)
    const [gamers , setGamers] = useState([])
    const [ramdomCards , setRamdomCards] = useState([])
    const [myCards, setMyCards] = useState([])

     const playCard = (card)=>{
      const username = localStorage.getItem('username')
       const dataRef = ref(db , 'cardsPlayed')
       const data = {
         card: card,
         gamer: username
       }
       push(dataRef , data)
     }
    useEffect(() => {
    const fetchData = async () => {
      socket.on('ramdomCardsUpdated', (ramdomCardsUpdated) => {
        setRamdomCards(ramdomCardsUpdated);
      });

      socket.on('gameCreated', (gameCreated) => {
        console.log(gameCreated);
        if (gameCreated) {
          setGame(gameCreated);
          console.log(gameCreated);

          // Distribuez les cartes  le jeu est créé
          const distributedCards =  distributeCards(gameCreated.participants, ramdomCards);
           
          // Affiche les cartes distribuées pour le joueur actuel (vous pouvez ajuster cela selon vos besoins)
          const username = localStorage.getItem('username');
          const me = distributedCards.find((player) => player.username === username);

          const myHand = localStorage.getItem('my-hand')
          if (myHand===null) {
           
           
           localStorage.setItem('my-hand', JSON.stringify(me.cards))
           
          }
          setMyCards(JSON.parse(myHand));
        }
      });
    };

   

    fetchData();
  }, [ramdomCards]);
   if (game!==null) {
      return (
     <Box> 
        <Grid container>
              <Grid xs={12} sm={12} md={8} lg={6} item>
                 <Box minHeight={window.innerHeight} >
                   <GameTable />
                 </Box>
              </Grid>

               <Grid xs={12} sm={12} md={6} lg={3} item>
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
   <Grid xs={12} sm={12} md={6} lg={3} item>
      <Card>
          <h2>Mes cartes</h2>
         <List>
            {
               myCards.map((card)=>{
                  return(
                     <ListItem title={card}>
                        <Button onClick={()=>{
                           playCard(card)
                        }}>
                           {card}
                        </Button>
                     </ListItem>
                  )
               })
            }
         </List>
      </Card>
   </Grid>
 </Grid>    
  
   <Box sx={{ position: 'fixed', top: '90%', right: '10%', zIndex: 3 }}>
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => {
                   setOpen(true)
                }}
              >
                <AddComment />
              </Fab>
            </Box>
      {
         open &&(
             <Chat />
         )
      }   
     </Box>
    ); 
   }
}

export default GameSpace;