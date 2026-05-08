import React, { useState, useEffect } from 'react';
import ConnectionManagerButton from './components/ConnectionManagerButton';
// Импортируем новые компоненты
import OscilloscopeDisplay from './components/OscilloscopeDisplay';
import SignalReadouts from './components/SignalReadouts';

const App: React.FC = () => {
    // --- 1. СОСТОЯНИЕ ПАРАМЕТРОВ УСТРОЙСТВА (Input State) ---
    const [frequency, setFrequency] = useState<number>(300); // Default value preset
    const [sineAmplitude, setSineAmplitude] = useState<number>(1.0);
    const [squareAmplitude, setSquareAmplitude] = useState<number>(0.5);
    const [isSquareEnabled, setIsSquareEnabled] = useState<boolean>(true);


    // --- 2. СОСТОЯНИЕ ПОДКЛЮЧЕНИЯ (Из хука) ---
    const { connectionState } = useDeviceConnectionHook();

    // --- 3. Синхронизация: Отправка параметров на устройство при изменении state ---
    useEffect(() => {
        // Этот эффект срабатывает каждый раз, когда меняется частота или амплитуда
        if (connectionState.isInitialized) {
            (async () => {
                await setAllParameters(frequency, sineAmplitude, squareAmplitude);
                console.log("[APP] Успешно записано на оборудование.");
            })();
        } else {
            // Если устройство отключено, мы не пытаемся писать ему данные
            console.warn("⚠️ Оборудование недоступно. Изменения параметров пока не записываются.");
        }
    }, [frequency, sineAmplitude, squareAmplitude, isSquareEnabled, connectionState.isInitialized]);


    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            {/* Заголовок */}
            <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 tracking-wider">
                DDS Signal Generator Controller
            </h1>

            {/* Блок управления соединением */}
            <div className="mb-8 w-full max-w-5xl mx-auto">
                <ConnectionManagerButton />
            </div >


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">

                {/* ------------------------------ */}
                {/* КОЛОНКА 1: УПРАВЛЕНИЕ (Settings) */}
                <div className="lg:col-span-1 flex flex-col gap-6 p-4 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-semibold uppercase text-yellow-400 mb-4">Параметры сигнала</h3>

                    {/* Элементы управления частотой */}
                    <div>
                        <label className="text-sm uppercase text-gray-500 block mb-2">Частота (Hz)</label>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={frequency}
                                onChange={(e) => setFrequency(parseFloat(e.target.value) || 0)}
                                className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-2xl font-mono text-accent focus:outline-none focus:border-accent transition-colors"
                            />
                            {/* Добавляем сюда кнопки пресетов (Presets) */}
                            <button
                                onClick={() => setFrequency(100)} className="bg-gray-700 hover:bg-green-600 px-4 py-3 text-sm rounded-lg active:scale-95">100 Hz</button>
                            <button
                                onClick={() => setFrequency(300)} className="bg-gray-700 hover:bg-yellow-600 px-4 py-3 text-sm rounded-lg active:scale-95">300 Hz</button>
                        </div>
                    </div>

                    {/* Элементы управления амплитудой и режимами */}
                    <div className="space-y-4">
                        <label className="text-sm uppercase text-gray-500 block mb-2">Амплитуда Синуса (V)</label>
                        <input
                            type="range" min="0.1" max="2.0" step="0.1" value={sineAmplitude}
                            onChange={(e) => setSineAmplitude(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-green-500"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm uppercase text-gray-500 block mb-2 flex items-center gap-3">
                            Меандр (Square)
                            {/* Toggle для включения/выключения меандра */}
                            <input
                                type="checkbox"
                                checked={isSquareEnabled}
                                onChange={(e) => setIsSquareEnabled(e.target.checked)}
                                className="w-5 h-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 cursor-pointer"
                            />
                            <span className={`text-base ${isSquareEnabled ? 'text-green-400' : 'text-red-400'}`}>Включено</span>
                        </label>

                        <label className="text-sm uppercase text-gray-500 block mb-2">Амплитуда Меандра (V)</label>
                        <input
                            type="range" min="0.1" max="1.0" step="0.1" value={squareAmplitude}
                            onChange={(e) => setSquareAmplitude(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500"
                        />
                    </div>

                </div>


                {/* ------------------------------ */}
                {/* КОЛОНКА 2: ОСЦИЛЛОГРАФ И АНАЛИЗ (Visualization) */}
                <div className="col-span-2 lg:col-span-2 flex flex-col gap-8">

                    {/* --- Осциллограф --- */}
                    <div>
                        <h3 className="text-xl font-mono text-white border-b border-gray-700 pb-2 mb-4">Осциллограмма (Real-time Signal View)</h3>
                        <OscilloscopeDisplay
                            frequencyHz={frequency}
                            sineAmplitudeV={sineAmplitude}
                            squareActive={isSquareEnabled}
                        />
                    </div>

                    {/* Панель измерений */}
                    <div>
                        <h3 className="text-xl font-mono text-white border-b border-gray-700 pb-2 mb-4">Анализ параметров (Measurements)</h3>
                        <SignalReadouts
                            frequencyHz={frequency}
                            // Здесь мы можем добавить другие параметры:
                            // sinAmp={sineAmplitude}
                            // sqAmp={squareAmplitude}
                        />
                    </div>

                </div>


            </div>
        </div>
    );
};

export default App;
