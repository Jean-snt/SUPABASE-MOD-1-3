import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerCashMovement } from '../services/salesService';
import { Banknote, X, AlertCircle, CheckCircle } from 'lucide-react';

interface CashRegisterProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CashRegister: React.FC<CashRegisterProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('0.00');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleOpenRegister = async () => {
    if (!user || !user.auth_user_id) {
      setError('Usuario no autenticado');
      return;
    }

    // Validar monto
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount < 0) {
      setError('Monto inválido. Ingrese un valor numérico válido.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Registrar apertura de caja
      const result = await registerCashMovement({
        user_id: user.auth_user_id,
        movement_type: 'apertura',
        amount: numericAmount,
        note: note || 'Apertura de caja'
      });

      if (result.success) {
        setSuccess(true);
        console.log('Caja abierta exitosamente:', result.movementId);
        
        // Llamar callback de éxito después de 1 segundo
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
        }, 1000);
      } else {
        setError('Error al abrir la caja. Intente nuevamente.');
      }
    } catch (err: any) {
      console.error('Error al abrir caja:', err);
      setError(err.message || 'Error al registrar apertura de caja');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y punto/coma decimal
    if (/^\d*[.,]?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  if (success) {
    return (
      <div className="w-[600px] bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Caja Abierta!</h2>
          <p className="text-gray-600">La caja ha sido abierta exitosamente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[600px] bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-[#704559]">
        <h2 className="text-lg font-bold text-white">Control de Apertura de Caja</h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Usuario Actual */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Usuario:</span> {user?.full_name || user?.email}
          </p>
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Monto de Apertura (S/.)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded text-gray-700 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#704559] focus:border-transparent"
                disabled={loading}
              />
              {/* Clear 'X' button inside input */}
              <button 
                onClick={() => setAmount('0.00')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            
            {/* Cash Icon Button */}
            <button 
              className="px-4 py-3 border border-gray-300 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              disabled={loading}
            >
              <Banknote size={24} />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Ingrese el monto inicial con el que abre la caja
          </p>
        </div>

        {/* Note Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nota de Apertura (Opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Añadir una nota de apertura..."
            className="w-full h-24 p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#704559] focus:border-transparent resize-none text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 flex items-center gap-3 border-t border-gray-200">
        <button
          onClick={handleOpenRegister}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#704559] hover:bg-[#5a3748] disabled:bg-gray-400 text-white font-semibold rounded shadow-sm transition-colors text-sm disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Abriendo...
            </span>
          ) : (
            'Abrir Caja Registradora'
          )}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

export default CashRegister;
