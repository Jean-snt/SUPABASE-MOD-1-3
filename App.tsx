import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import OpeningModal from './components/OpeningModal';

const App: React.FC = () => {
  // State to track if the cash register is open
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // State for the modal visibility (it's visible initially if register is closed)
  const [showModal, setShowModal] = useState(true);

  const handleOpenRegister = (amount: string, note: string) => {
    console.log(`Opening register with amount: ${amount} and note: ${note}`);
    setIsRegisterOpen(true);
    setShowModal(false);
  };

  const handleDiscard = () => {
    console.log("Discard clicked");
    // In a real app, this might redirect or show a warning. 
    // For now, we just reset inputs visually.
  };

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
          />
        </div>
      )}
    </div>
  );
};

export default App;