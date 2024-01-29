import GameSpace from "../components/sections/GameSpace/GameSpace";
import { Form1, Form2 } from "../components/sections/Register/ConfigGame";
import StartPage from "../components/sections/StartPage/StartPage";
import MyModal from "../components/widgets/MyModal/MyModal";

export const    items = [
        {
            route: '',
            component: <StartPage />
        },
        {
            route: 'form1',
            component: <MyModal children={<Form1 />}/>
        },
          {
        route: 'form2',
            component: <MyModal children={<Form2 />}/>
        },
          {
        route: 'play-space',
        component: <GameSpace />
        },

        
    ]