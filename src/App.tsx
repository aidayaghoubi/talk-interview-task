
import React, { useState } from 'react';
import { SettingsIcon } from './svgs';
import ControlAccess from './components/controlAccess';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen min-w-full p-6 box-border bg-gray-200">
      {showSettings ? (
        <ControlAccess />
      ) : (
        <div className="max-w-7xl min-h-full mx-auto flex items-center justify-center">
          <button
            onClick={() => setShowSettings(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <SettingsIcon className="w-5 h-5" />
            Open Settings
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
