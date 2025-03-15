import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Events from './pages/Events';
import Notes from './pages/Notes';
import CalendarPage from './pages/CalendarPage';
import Tasks from './pages/Tasks';
import EditEvent from './pages/EditEvent';
import EditNote from './pages/EditNote';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import MainLayout from './components/MainLayout';

// Componente para rutas no encontradas
const FallbackRoute = () => {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <div>Ruta no encontrada</div>;
};

function App() {
  return (
    <Routes>
      {/* Rutas públicas sin layout */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rutas protegidas con layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/events/edit/:id" element={<EditEvent />} />
          <Route path="/notes/edit/:id" element={<EditNote />} />

          {/* Rutas de administrador anidadas */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      {/* Ruta comodín */}
      <Route path="*" element={<FallbackRoute />} />
    </Routes>
  );
}

export default App;
