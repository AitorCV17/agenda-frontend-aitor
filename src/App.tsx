import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Events from './pages/Events'
import Notes from './pages/Notes'
import CalendarPage from './pages/CalendarPage'
import Admin from './pages/Admin'
import Tasks from './pages/Tasks'
import EditEvent from './pages/EditEvent'
import EditNote from './pages/EditNote'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Navbar from './components/Navbar'

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register']; 
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {showNavbar && <Navbar />} 

      {/* Contenido principal sin márgenes extra en Login/Register */}
      <div className={`flex-1 ${showNavbar ? 'container mx-auto p-4' : 'flex justify-center items-center'}`}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/events" element={<Events />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/events/edit/:id" element={<EditEvent />} />
            <Route path="/notes/edit/:id" element={<EditNote />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
