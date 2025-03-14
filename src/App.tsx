import React, { useState, useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Events from './pages/Events';
import Notes from './pages/Notes';
import CalendarPage from './pages/CalendarPage';
import Admin from './pages/Admin';
import Tasks from './pages/Tasks';
import EditEvent from './pages/EditEvent';
import EditNote from './pages/EditNote';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const FallbackRoute = () => {
  const { token } = useContext(AuthContext);
  if (!token) {
    // Si no está logueado, redirige a /login
    return <Navigate to="/login" replace />;
  }
  // Si está logueado, muestra mensaje de ruta no encontrada
  return <div>Ruta no encontrada</div>;
};

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'ADMIN'; // Verifica si el usuario es admin

  const hideNavbarRoutes = ['/login', '/register'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  // Estado para el Sidebar (expandido/minimizado)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="w-full min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Mostrar Sidebar solo si no estamos en login/register */}
      {showNavbar && <Sidebar isOpen={isSidebarOpen} isAdmin={isAdmin} />}

      {/* Contenedor principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showNavbar ? (isSidebarOpen ? 'ml-64' : 'ml-20') : 'ml-0 flex items-center justify-center'
        }`}
      >
        {showNavbar && <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}

        <main className={`p-6 ${!showNavbar ? 'w-full max-w-md' : ''}`}>
          <Routes>
            {/* Rutas públicas */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Rutas protegidas */}
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

            {/* Rutas de administrador */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Ruta comodín */}
            <Route path="*" element={<FallbackRoute />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
