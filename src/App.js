import { ToastProvider } from 'react-toast-notifications';
import { Room } from './Room';
import { Assign } from './Assign';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// axios.defaults.baseURL = window.location.origin.replace('3000', '4000');
// axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
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
