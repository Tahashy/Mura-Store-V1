import React, { useState } from 'react';
import MuraStore from './components/MuraStore';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageCoupons from './pages/admin/ManageCoupons';

import { Settings, LayoutDashboard, Package, Layers, Store,Tag, X ,UserLock} from 'lucide-react';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [currentAdminPage, setCurrentAdminPage] = useState('dashboard');
  const [loginError, setLoginError] = useState(false);

  const handleAdminLogin = () => {
    if (adminPassword === 'Mura@2025') {
      setIsAdminAuth(true);
      setAdminPassword('false');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    setAdminPassword('');
    setShowAdmin(false);
    setCurrentAdminPage('dashboard');
  };

  const adminPages = {
    dashboard: <AdminDashboard />,
    products: <ManageProducts />,
    categories: <ManageCategories />,
    coupons: <ManageCoupons />
  };

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'categories', label: 'Categorías', icon: Layers },
  { id: 'coupons', label: 'Cupones', icon: Tag }
];
  return (
    <div className="min-h-screen bg-black">
      {!showAdmin ? (
        // TIENDA PRINCIPAL
        <>
          <MuraStore />
          {/* Botón flotante para acceder al admin */}
          <button
            onClick={() => setShowAdmin(true)}
            className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition z-50"
            title="Panel de Administración"
          >
            <Settings className="w-6 h-6" />
          </button>
        </>
      ) : !isAdminAuth ? (
        // PANTALLA DE LOGIN ADMIN
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-red-600 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserLock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Panel de Administración</h2>
              <p className="text-gray-400">Ingresa tu contraseña</p>
            </div>
            
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value);
                setLoginError(false);
              }}

              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Contraseña"
              className={`w-full mb-4 px-4 py-3 bg-black border-2 ${loginError ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg mb-2 focus:border-red-600 focus:outline-none transition`}
            />
            {loginError && (
              <p className="text-red-500 text-sm mb-4 text-center">❌ Contraseña incorrecta. Inténtalo de nuevo.</p>
            )}
            
            <button
              onClick={handleAdminLogin}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition mb-3"
            >
              Ingresar
            </button>
            
            <button
              onClick={() => setShowAdmin(false)}
              className="w-full text-gray-400 py-2 hover:text-white transition"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      ) : (
        // PANEL ADMIN
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <div className="w-64 bg-gradient-to-br from-gray-900 to-black border-r border-gray-800 p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-red-600 mb-1">MuraStore</h1>
              <p className="text-gray-400 text-sm">Panel Admin</p>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentAdminPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    currentAdminPage === item.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition mt-8"
              >
                <Store className="w-5 h-5" />
                <span className="font-medium">Volver a Tienda</span>
              </button>
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 p-8 overflow-y-auto">
            {adminPages[currentAdminPage]}
          </div>
        </div>
      )}
    </div>
  );
}