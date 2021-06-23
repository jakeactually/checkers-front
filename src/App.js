import { ToastProvider } from 'react-toast-notifications';
import axios from 'axios';
import { Room } from './Room';
import { Assign } from './Assign';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

axios.defaults.baseURL = '/checkers/api/';

function App() {
  return (
    <Router basename="/checkers">
      <ToastProvider>
        <div>
          <Switch>
            <Route path="/Room/:id">
              <Room />
            </Route>
            <Route path="/">
              <Assign />
            </Route>
          </Switch>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
