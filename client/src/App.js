import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedLayout from './components/ProtectedLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InternshipList from './pages/InternshipList';
import AddInternship from './pages/AddInternship';
import InternshipDetail from './pages/InternshipDetail';
import Analytics from './pages/Analytics';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';

import Kanban from './pages/Kanban';
import AIReport from './pages/AIReport';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/internships" element={<InternshipList />} />
              <Route path="/internships/:id" element={<InternshipDetail />} />
              <Route path="/add" element={<AddInternship />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/reminders" element={<Reminders />} />
              <Route path="/ai-report" element={<AIReport />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
