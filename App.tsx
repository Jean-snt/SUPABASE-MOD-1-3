// App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import OpeningModal from './components/OpeningModal';
import Login from './src/components/Login';
import { cashMovementService } from './src/services/cashMovementService';

// Función auxiliar para verificar si una cadena parece un UUID (simple check)
const isUUID = (str: string | undefined): boolean => {
    if (!str) return false;
    // Patrón simple para verificar un UUID (ej: 8-4-4-4-12 caracteres hexadecimales)
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

const AppContent: React.FC = () => {
    const { user, loading, isAuthenticated } = useAuth();
    
    // State for the modal visibility (it's visible initially if register is closed)
    const [showModal, setShowModal] = useState(true);
    const [openingError, setOpeningError] = useState('');

    /* * NOTA IMPORTANTE: Si la apertura de caja es persistente, 
     * es decir, queremos saber si ya abrió antes, necesitaríamos 
     * un useEffect para llamar a cashMovementService.getLastOpening(user.id) 
     * al cargar el componente. Por ahora, asumimos que siempre necesita abrirla.
     */

    const handleOpenRegister = async (amount: string, note: string) => {
        // Obtenemos el UUID: Usamos el ID del usuario de la sesión de Supabase
        // O el auth_user_id del perfil de la tabla users (si tu AppUser lo provee)
        // Usaremos el ID de la sesión que es el más directo y confiable (UUID).
        // En tu AuthContext, el user es AppUser, que no tiene 'id', pero sí tiene 'auth_user_id'.

        // CORRECCIÓN: Si user viene de la tabla users, el UUID es 'auth_user_id'
        const userId = user?.auth_user_id;

        if (!userId || !isUUID(userId)) {
            // El '5' venía porque user?.id era undefined, y al concatenar el mensaje 
            // el código que originalmente tenías usaba un placeholder.
            console.error("Fallo de autenticación o ID de usuario inválido:", userId);
            setOpeningError('Usuario no autenticado o ID inválido. Intente iniciar sesión de nuevo.');
            return;
        }

        try {
            // Convertir el monto a número (reemplazar coma por punto)
            const numericAmount = parseFloat(amount.replace(',', '.'));
            
            if (isNaN(numericAmount) || numericAmount < 0) {
                setOpeningError('Monto inválido');
                return;
            }

            // Registrar la apertura de caja en Supabase
            // userId es ahora el UUID correcto.
            await cashMovementService.registerOpening(userId, numericAmount, note); 
            
            console.log(`Opening register with amount: ${numericAmount} and note: ${note}`);
            setShowModal(false);
            setOpeningError('');
        } catch (error: any) {
            console.error('Error al abrir caja:', error);
            // Capturamos el error de Supabase (ej: RLS violation)
            setOpeningError(error.message || 'Error al registrar apertura de caja');
        }
    };

    const handleDiscard = () => {
        console.log("Discard clicked");
        // Si el usuario descarta, lo ideal es redirigir al login o a una vista sin POS
        // Ya que el POS requiere que la caja esté abierta.
        // Aquí no hacemos nada, pero en producción se podría hacer una redirección.
    };

    // Mostrar loading mientras se verifica la sesión
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#704559] mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, mostrar login
    if (!isAuthenticated) {
        // Redirige al login, lo que evita que se intente abrir la caja sin sesión.
        return <Login />; 
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-100">
            {/* The Dashboard Background - Fully interactive when register is open */}
            <DashboardLayout isBlurred={showModal} />

            {/* The Modal Overlay */}
            {showModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <OpeningModal 
                        onOpenRegister={handleOpenRegister}
                        onDiscard={handleDiscard}
                        error={openingError}
                    />
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;