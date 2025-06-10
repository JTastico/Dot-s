import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";
import Layout from "./layouts/layout/Layout";
import Game from "./pages/Game/Game";
import JoinGame from "./pages/Home/JoinGame";
import GameResults from "./pages/GameResults/GameResults";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,  // ✅ SIN Layout wrapper
    errorElement: <NotFound />
  },
  {
    path: '/join',
    element: <JoinGame />  // ✅ SIN Layout wrapper
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    )
  },
  {
    path: '/register',
    element: (
      <Layout>
        <Register/>
      </Layout>
    )
  },
  {
    path: '/admin',
    element: <Admin />  // ✅ Ya sin Layout
  },
  {
    path: '/game',
    element: <Game />  // ✅ Ya sin Layout
  },
  {
    path: '/game-results',
    element: (
      <Layout>
        <GameResults />
      </Layout>
    )
  }
]);

export default function App() { 
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}