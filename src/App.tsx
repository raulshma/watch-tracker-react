import React, { useEffect, useState } from 'react';
import Login from './components/authentication/Login';
import Home from './views/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/authentication/RequireAuth';
import { AuthProvider } from './providers/AuthProvider';
import AuthBasic from './components/authentication/Auth';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          index
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/auth" element={<AuthBasic />} />
        <Route path="/oldauth" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
