import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { TransitionGroup } from 'react-transition-group';
import { TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MyContext from '../../../contextes/globalState';

const gamersNum = localStorage.getItem('size')
export default function NewGamersAdd({ servicesaveWrite , gameSize}) {
  const [inputs, setInputs] = React.useState([]);
   const navigate = useNavigate()
   const {globalState, setGlobalState} = React.useContext(MyContext)
  const handleAddInput = () => {
    if (inputs.length<gameSize) {
          setInputs((prevInputs) => [...prevInputs, '']);
    }
  };

  const handleInputChange = (index, value) => {
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = value;
      return newInputs;
    });
    console.log(inputs)
     setGlobalState((prevState)=>({
            ...prevState,
            gamers: inputs
     }))
  };

  const handleRemoveInput = (index) => {
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs.splice(index, 1);
      return newInputs;
    });
  };

  const addInputButton = (
     <Box
  component="form"
  sx={{
    '& .MuiTextField-root': { ml:1 , width: '100%' },
  }}
  noValidate
  autoComplete="off"
>
       <Button variant="contained" onClick={handleAddInput} sx={{ ml: 1, width: '100%'}}>
      Ajouter les joueurs
    </Button>
    </Box>
  );
const handleSave = () => {
  // Récupère les valeurs des inputs et les stocke dans un tableau
  const inputValues = inputs.map((input) => input.trim());

  // Fais quelque chose avec le tableau de valeurs (par exemple, l'afficher dans la console)
  console.log(inputValues);
};
 return (
  <div>
    {addInputButton}
    <Box sx={{ mt: 1, width: '100%' }}>
      <List>
        <TransitionGroup>
          {inputs.map((input, index) => (
            <Collapse key={index}>
              <ListItem
              
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    title="Delete"
                    onClick={() => handleRemoveInput(index)}
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                style={{mr:1, width:'100%'}}
                  primary={
                    <Box
  component="form"
  sx={{
    '& .MuiTextField-root': { ml:-1 , width: '100%' },
  }}
  noValidate
  autoComplete="off"
>
                    <TextField
                       style={{width:'100%'}}
                      type="text"
                      placeholder={'Joueur ' + parseInt(index + 1)}
                      value={input}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
         </Box>
                  }
                />
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Button color='primary' variant='contained' disabled={inputs.length===gameSize} onClick={()=>{
        navigate('/play-space')
      }}>
        Continuer
      </Button>
    </Box>
    
  </div>
);

}
