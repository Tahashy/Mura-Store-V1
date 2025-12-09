import React, { useState, useRef } from 'react';
import { useCoupons } from '../../hooks/useCoupons';
import { Plus, Trash2, Tag, Printer, Copy } from 'lucide-react';
import Toast from '../../components/Toast';

export default function ManageCoupons() {
  const { coupons, loading, createCoupon, deleteCoupon } = useCoupons();
  const [discount, setDiscount] = useState('20');
  const [generatedCoupon, setGeneratedCoupon] = useState(null);
  const printRef = useRef();

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleGenerate = async () => {
    if (!discount || discount < 1 || discount > 100) {
      showToast('⚠️ El descuento debe estar entre 1% y 100%', 'warning');
      return;
    }

    const result = await createCoupon(parseInt(discount));

    if (result.success) {
      setGeneratedCoupon(result.data);
      showToast(`🎉 Cupón generado: ${result.data.code}`, 'success');
    } else {
      showToast('❌ Error al generar cupón', 'error');
    }
  };

  const handlePrint = () => {
    showToast('🖨️ Preparando impresión...', 'info');
    const printContent = printRef.current.innerHTML;

    const win = window.open('', '', 'width=400,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Imprimir Cupón</title>
          <style>
            body { font-family: Arial; padding: 20px; text-align: center; }
            .coupon { border: 3px dashed #DC2626; padding: 30px; margin: 20px; }
            .code { font-size: 32px; font-weight: bold; color: #DC2626; margin: 20px 0; letter-spacing: 3px; }
            .discount { font-size: 48px; font-weight: bold; color: #000; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          ${printContent}
          <button onclick="window.print()">Imprimir</button>
        </body>
      </html>
    `);
    win.document.close();
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`📋 Código ${code} copiado`, 'info');
  };

  if (loading) {
    return <div className="text-white text-center py-12">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Cupones</h1>
        <p className="text-gray-400">Genera cupones de descuento para tus clientes</p>
      </div>

      {/* Generar nuevo cupón */}
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-600 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Generar Nuevo Cupón</h3>

        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="text-sm text-gray-400 block mb-2">Descuento (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="20"
              min="1"
              max="100"
              className="w-full px-4 py-3 bg-black border border-gray-700 text-white rounded-lg text-lg focus:border-red-600 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Generar
          </button>
        </div>

        {/* Cupón generado */}
        {generatedCoupon && (
          <div className="space-y-4">
            <div
              ref={printRef}
              className="bg-white border-4 border-dashed border-red-600 rounded-xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-black mb-4">MURASTORE</h2>
              <div className="bg-red-600 text-white py-2 px-4 rounded-lg inline-block mb-4">
                <p className="text-5xl font-bold">{generatedCoupon.discount}% OFF</p>
              </div>
              <p className="text-gray-600 mb-2">Código de cupón:</p>
              <p className="text-3xl font-bold text-red-600 tracking-widest mb-4">
                {generatedCoupon.code}
              </p>
              <p className="text-sm text-gray-500">Válido por una sola compra</p>
              <p className="text-xs text-gray-400 mt-2">
                Generado: {new Date(generatedCoupon.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimir Cupón
              </button>

              <button
                onClick={() => copyCoupon(generatedCoupon.code)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copiar Código
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Cupones Creados ({coupons.length})</h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`bg-gradient-to-br from-gray-900 to-black border rounded-xl p-4 ${
                coupon.is_used ? 'border-gray-800 opacity-60' : 'border-red-900'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      coupon.is_used ? 'bg-gray-800' : 'bg-red-600 bg-opacity-20'
                    }`}
                  >
                    <Tag
                      className={`w-4 h-4 ${
                        coupon.is_used ? 'text-gray-600' : 'text-red-600'
                      }`}
                    />
                  </div>

                  <div>
                    <p className="text-white font-bold text-sm">{coupon.code}</p>
                    <p className="text-xs text-gray-500">
                      {coupon.is_used ? '✓ Usado' : '○ Disponible'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    deleteCoupon(coupon.id);
                    showToast('🗑️ Cupón eliminado', 'info');
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-red-600 font-bold text-lg">{coupon.discount}% OFF</p>
                <p className="text-xs text-gray-600">
                  Creado: {new Date(coupon.created_at).toLocaleDateString()}
                </p>

                {coupon.used_at && (
                  <p className="text-xs text-gray-600">
                    Usado: {new Date(coupon.used_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!coupon.is_used && (
                <button
                  onClick={() => copyCoupon(coupon.code)}
                  className="w-full mt-3 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 text-sm flex items-center justify-center gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Copiar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
