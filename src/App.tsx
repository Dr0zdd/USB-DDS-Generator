// src/App.tsx — Главный компонент приложения
import React, { useState, useEffect } from 'react';

// Компоненты
import { ConnectionManagerButton } from './components/ConnectionManagerButton';
import OscilloscopeDisplay from './components/OscilloscopeDisplay';
import SignalReadouts from './components/SignalReadouts';

// Хуки
import { useDeviceConnection } from './hooks/useDeviceConnection';

// API
import { setAllParameters } from './api/deviceService';

const App: React.FC = () => {
    // --- 1. Локальное состояние параметров ---
    const [frequency, setFrequency] = useState<number>(1000); // начальное значение 1 кГц
    const [sineAmplitude, setSineAmplitude] = useState<number>(1.0);
    const [squareAmplitude, setSquareAmplitude] = useState<number>(0.5);
    const [isSquareEnabled, setIsSquareEnabled] = useState<boolean>(true);

    // --- 2. Состояние подключения ---
    const { connectionState } = useDeviceConnection();

    // --- 3. Синхронизация параметров с устройством ---
    useEffect(() => {
        if (connectionState.isInitialized) {
            (async () => {
                await setAllParameters(
                    frequency,
                    sineAmplitude,
                    squareAmplitude
                );
            })();
        } else if (!connectionState.statusMessage.includes("Ошибка")) {
            console.warn(
                "[APP] ⚠️ Устройство не инициализировано — параметры не отправлены."
            );
        }
    }, [
        frequency,
        sineAmplitude,
        squareAmplitude,
        isSquareEnabled,
        connectionState.isInitialized
    ]);

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">

            <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 tracking-wider">
                DDS Signal Generator Controller (Prototype)
            </h1>

            {/* 1. Управление соединением */}
            <div className="mb-8 w-full max-w-5xl mx-auto">
                <ConnectionManagerButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">

                {/* 2. Панель управления */}
                <div className="lg:col-span-1 flex flex-col gap-6 p-4 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-xl">
                    {/* Здесь будет SettingsPanel — пока пусто */}
                    <p className="text-gray-400">Панель управления в разработке…</p>
                </div>

                {/* 3. Осциллограф + измерения */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* Осциллограмма */}
                    <div className="w-full">
                        <h3 className="text-xl font-mono text-white border-b border-gray-700 pb-2 mb-4">
                            Осциллограмма (Real-time Signal View)
                        </h3>

                        <OscilloscopeDisplay
                            frequencyHz={frequency}
                            sineAmplitudeV={sineAmplitude}
                            squareActive={isSquareEnabled}
                        />
                    </div>

                    {/* Панель измерений */}
                    <div>
                        <h3 className="text-xl font-mono text-white border-b border-gray-700 pb-2 mb-4">
                            Анализ параметров (Measurements)
                        </h3>

                        <SignalReadouts
                            frequencyHz={frequency}
                            sinAmpV={sineAmplitude}
                            sqAmpV={squareAmplitude}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default App;
