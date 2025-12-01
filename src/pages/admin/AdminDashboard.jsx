import React from 'react';
import { useMetrics } from '../../hooks/useMetrics';
import { useProducts } from '../../hooks/useProducts';
import { Package, Layers, AlertTriangle, Eye, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const { metrics, recentProducts, loading } = useMetrics();
  const { getLowStockProducts } = useProducts();
  const [lowStockProducts, setLowStockProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchLowStock = async () => {
      const result = await getLowStockProducts();
      if (result.success) {
        setLowStockProducts(result.data);
      }
    };
    fetchLowStock();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Cargando métricas...</div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Productos',
      value: metrics.totalProducts,
      icon: Package,
      color: 'bg-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Categorías',
      value: metrics.totalCategories,
      icon: Layers,
      color: 'bg-purple-600',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Stock Bajo',
      value: metrics.lowStockCount,
      icon: AlertTriangle,
      color: 'bg-yellow-600',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Total Vistas',
      value: metrics.totalViews,
      icon: Eye,
      color: 'bg-green-600',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Resumen general de tu tienda</p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-red-600 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${card.color} bg-opacity-20 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Productos recientes y stock bajo */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Productos recientes */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-white">Productos Recientes</h2>
          </div>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 bg-black bg-opacity-50 p-3 rounded-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{product.name}</p>
                  <p className="text-gray-400 text-xs">S/ {product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold text-sm">{product.stock} und</p>
                  <p className="text-gray-500 text-xs">{product.views} vistas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos con stock bajo */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-bold text-white">Stock Bajo (menos de 10)</h2>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">✅ Todos los productos tienen stock suficiente</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 bg-yellow-900 bg-opacity-20 p-3 rounded-lg border border-yellow-800"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-bold text-lg">{product.stock}</p>
                    <p className="text-gray-500 text-xs">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}