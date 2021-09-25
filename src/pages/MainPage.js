import * as React from 'react';
import {  BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import LoginPage from "./LoginPage";




export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>

          <Router>
          <Link to="/login"> </Link>
          <Switch>          
          <Route path="/login" component={LoginPage}/>  

          </Switch>
         </Router>
          </ListItemIcon>
          <ListItemText primary="Вход" /> 

        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>

          </ListItemIcon>
          <ListItemText primary="Выход" />
        </ListItemButton>
      </List>
      <Divider />

    </Box>
  );
}
