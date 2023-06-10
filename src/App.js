import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Room } from './Room';
import { Assign } from './Assign';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

axios.defaults.baseURL = '/checkers/api';

function App() {
  return (
    <Router basename='/checkers'>
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path="/Room/:id" element={<Room></Room>}></Route>
        <Route path="/" element={<Assign></Assign>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
