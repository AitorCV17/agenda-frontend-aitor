import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {user?.name}</h1>
      <p className="mb-4">Selecciona una opción del menú para gestionar tus eventos, notas y calendario.</p>
    </div>
  );
};

export default Dashboard;
