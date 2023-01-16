import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {services} from "./firebase/utils";

import './App.scss';
import Admin from './pages/Admin';
import AppointmentForm from './pages/AppointmentForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/appointments/add" element={<AppointmentForm serviceList={services}/>} />
        <Route path="/" element={<Admin serviceList={services}/>} />
      </Routes>
    </Router>
  );
}

export default App;
