import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineCalendar, HiOutlineClipboardList, HiOutlineDocumentText, HiOutlineCog } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Sidebar: React.FC<{ isOpen: boolean; isAdmin: boolean }> = ({ isOpen, isAdmin }) => {
  return (
    <motion.div
      className={`fixed left-0 top-0 h-screen bg-azure-900 dark:bg-azure-950 text-white transition-all duration-300 shadow-lg flex flex-col`}
      initial={{ width: 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
    >
      {/* Logo - Ahora es un Link navegable */}
      <div className="py-4 px-6 text-center border-b border-azure-800 dark:border-azure-700">
        <Link to="/" className={`text-lg font-bold text-azure-200 hover:text-white transition ${isOpen ? 'block' : 'hidden'}`}>
          Agenda Personal
        </Link>
      </div>

      {/* Navegación */}
      <nav className="mt-4 space-y-2 flex-1 overflow-y-auto">
        <SidebarLink to="/" icon={<HiOutlineViewGrid />} label="Dashboard" isOpen={isOpen} />
        <SidebarLink to="/events" icon={<HiOutlineCalendar />} label="Eventos" isOpen={isOpen} />
        <SidebarLink to="/notes" icon={<HiOutlineDocumentText />} label="Notas" isOpen={isOpen} />
        <SidebarLink to="/calendar" icon={<HiOutlineClipboardList />} label="Calendario" isOpen={isOpen} />
        <SidebarLink to="/tasks" icon={<HiOutlineClipboardList />} label="Tareas" isOpen={isOpen} />

        {/* Sección de administrador */}
        {isAdmin && (
          <div className="mt-6">
            <h3 className={`px-4 text-sm font-semibold uppercase text-azure-400 ${isOpen ? 'block' : 'hidden'}`}>
              Admin
            </h3>
            <SidebarLink to="/admin" icon={<HiOutlineCog />} label="Administración" isOpen={isOpen} />
          </div>
        )}
      </nav>
    </motion.div>
  );
};

const SidebarLink: React.FC<{ to: string; icon: JSX.Element; label: string; isOpen: boolean }> = ({ to, icon, label, isOpen }) => {
  return (
    <Link to={to} className="flex items-center space-x-3 px-4 py-2 text-azure-200 hover:text-white hover:bg-azure-700 dark:hover:bg-azure-800 transition rounded-md">
      <span className="text-2xl">{icon}</span>
      <span className={`text-lg transition-all ${isOpen ? 'block' : 'hidden'}`}>{label}</span>
    </Link>
  );
};

export default Sidebar;
