import './App.css';

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Room } from "./Room";
import { Assign } from "./Assign.tsx";
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = '/checkers/api';
axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Assign />,
    },
    {
      path: "/room/:id",
      element: <Room />,
    },
  ],
  { basename: '/checkers' }
);

function App() {
  return (
    <>
      <Toaster position="top-right"></Toaster>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
