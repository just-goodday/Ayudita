import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Alumnos from './pages/Alumnos';
import Idiomas from './pages/Idiomas';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          {
            path: 'alumnos',
            element: <Alumnos />,
          },
          {
            path: 'idiomas',
            element: <Idiomas />,
          },  
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
