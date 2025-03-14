// src/App.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'   // <-- NUEVA
import Events from './pages/Events'
import Notes from './pages/Notes'
import CalendarPage from './pages/CalendarPage'
import Admin from './pages/Admin'
import Tasks from './pages/Tasks'
import EditEvent from './pages/EditEvent'
import EditNote from './pages/EditNote'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} /> {/* NUEVA */}
            <Route path="/events" element={<Events />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
            <Route path="/notes/edit/:id" element={<EditNote />} />
          </Route>

          {/* Rutas para administradores */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
