import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";


import './index.css';
import Management from './pages/Management';
import Table from './pages/Table';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Management />,
  },
  {
    path: "/table",
    element: <Table />,
    children: [
    {
      path: '/table/:id',
      element: <Table />
    }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);