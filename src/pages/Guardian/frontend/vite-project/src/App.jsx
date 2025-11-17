import './App.css';
import { Toaster } from "react-hot-toast";
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/loginPage.jsx';
 

function App(){
  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-right" /> 
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;