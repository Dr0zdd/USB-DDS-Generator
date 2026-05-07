import  { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Константы из оригинальной программы Delphi
const FCLK = 50000000;
const FREQ_RES = Math.pow(2, 28);

function App() {
    // --- Состояния ---
    const [mode, setMode] = useState('simulation'); // 'simulation' или 'hardware'
    const [isConnected, setIsConnected] = useState(false);
    const [frequency, setFrequency] = useState(1000);
    const [sineAmpl, setSineAmpl] = useState(128);
    const [squAmpl, setSquAmpl] = useState(128);
    const [isSquareOn, setIsSquareOn] = useState(false);
    const [waveForm, setWaveForm] = useState('sine');
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);

    // --- Логика графика (Осциллограф) ---
    // Генерируем точки для графика
    const graphData = useMemo(() => {
        const points = [];
        const period = 1 / frequency;
        const viewWindow = period * 3; // Показываем 3 периода сигнала

        for (let i = 0; i < 100; i++) {
            const t = time + (i * viewWindow / 100);
            let value = 0;

            if (waveForm === 'sine') {
                value = Math.sin(2 * Math.PI * frequency * t) * (sineAmpl / 255);
            } else if (waveForm === 'triangle') {
                value = (2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1) * (sineAmpl / 255);
            }

            if (isSquareOn) {
                const square = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
                value += square * (squAmpl / 255);
            }

            points.push({ x: i, y: value });
        }
        return points;
    }, [time, frequency, sineAmpl, squAmpl, isSquareOn, waveForm]);

    // Анимация времени для графика
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prev => prev + 0.0001);
            }, 30);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // --- Логика связи ---
    const calculateFTW = (freq) => {
        if (freq < 0) return 0;
        if (freq >= FCLK / 2) return FREQ_RES - 1;
        return Math.round((FREQ_RES * freq) / FCLK);
    };

    const sendCommand = (cmd, data) => {
        if (mode === 'hardware') {
            console.log(`[REAL HID] Cmd: 0x${cmd.toString(16)}, Data: 0x${data.toString(16)}`);
            // Здесь в будущем будет node-hid
        } else {
            console.log(`[SIMULATION] Mock send: 0x${cmd.toString(16)} -> 0x${data.toString(16)}`);
        }
    };

    const handleRunToggle = () => {
        const newState = !isRunning;
        setIsRunning(newState);
        sendCommand(0x00, newState ? 1 : 0);
    };

    const handleSetFreq = () => {
        const ftw = calculateFTW(frequency);
        sendCommand(0x40, (ftw >> 8));
        sendCommand(0x80, (ftw & 0x7FFFFF));
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8 flex flex-col items-center font-sans">

            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8 bg-[#1e1e1e] p-4 rounded-xl border border-gray-800 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-accent animate-pulse' : 'bg-danger'}`} />
                        <span className="text-sm font-mono uppercase tracking-widest">
              Status: <span className={isConnected ? 'text-accent' : 'text-danger'}>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </span>
                    </div>
                    <div className="flex bg-black p-1 rounded-lg border border-gray-700">
                        <button
                            onClick={() => setMode('simulation')}
                            className={`px-3 py-1 text-xs rounded ${mode === 'simulation' ? 'bg-accent text-black font-bold' : 'text-gray-500'}`}
                        >
                            SIMULATION
                        </button>
                        <button
                            onClick={() => setMode('hardware')}
                            className={`px-3 py-1 text-xs rounded ${mode === 'hardware' ? 'bg-accent text-black font-bold' : 'text-gray-500'}`}
                        >
                            HARDWARE
                        </button>
                    </div>
                </div>
                <h1 className="text-xl font-bold tracking-tighter text-gray-400">TOR-DDS PRO ANALYZER</h1>
                <button onClick={() => setIsConnected(!isConnected)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors">
                    {isConnected ? 'Disconnect' : 'Connect Device'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl">

                {/* КОЛОНКА 1: Управление частотой */}
                <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col gap-6">
                    <div className="space-y-4">
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Signal Frequency (Hz)</label>
                        <div className="flex gap-4">
                            <input type="number" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value) || 0)}
                                   className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-2xl font-mono text-accent focus:outline-none focus:border-accent transition-colors"
                            />
                            <button onClick={handleSetFreq} className="bg-accent text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition-colors active:scale-95">SET</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setWaveForm('sine')} className={`p-4 rounded-lg border transition-all ${waveForm === 'sine' ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                            <div className="text-lg font-bold">SINE</div>
                            <div className="text-[10px] opacity-60">Синусоида</div>
                        </button>
                        <button onClick={() => setWaveForm('triangle')} className={`p-4 rounded-lg border transition-all ${waveForm === 'triangle' ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                            <div className="text-lg font-bold">TRI</div>
                            <div className="text-[10px] opacity-60">Треугольник</div>
                        </button>
                    </div>

                    <button onClick={handleRunToggle} className={`w-full py-6 rounded-xl font-black text-2xl transition-all transform active:scale-95 ${isRunning ? 'bg-danger text-white shadow-[0_0_20px_rgba(255,65,65,0.4)]' : 'bg-accent text-black shadow-[0_0_20px_rgba(0,255,65,0.4)]'}`}>
                        {isRunning ? 'STOP GENERATION' : 'RUN GENERATION'}
                    </button>
                </div>

                {/* КОЛОНКА 2: Осциллограф (График) */}
                <div className="lg:col-span-2 bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Real-time Waveform Output</label>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-accent' : 'bg-gray-600'}`} />
                            <span className="text-[10px] font-mono text-gray-500">{isRunning ? 'LIVE' : 'IDLE'}</span>
                        </div>
                    </div>

                    <div className="h-64 w-full bg-black rounded-lg border border-gray-800 p-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="x" hide />
                                <YAxis domain={[-2, 2]} hide />
                                <Line
                                    type="monotone"
                                    dataKey="y"
                                    stroke={isRunning ? "#00ff41" : "#555"}
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="lg:col-span-2 bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col gap-4">
                        {/* 1. Детализация частоты и амплитуды (NEW) */}
                        <div className="flex justify-between items-center text-sm p-3 bg-[#2a2a2a] rounded-lg border border-gray-700/50">
                            <div>
                                <p className="text-gray-500 uppercase text-xs">Текущая Частота:</p>
                                {/* Здесь будет вывод рассчитанной частоты */}
                                <span className="font-mono text-lg text-green-400">{currentFreqDisplay} Hz</span>
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase text-xs">Амплитуда (V):</p>
                                <span className="font-mono text-xl text-yellow-400">{sineAmplitudeValue} V</span>
                            </div>
                        </div>

                        {/* 2. Основной график */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Сигнальная форма</label>
                            <div className="h-64 w-full bg-black rounded-lg border border-gray-800 p-2">
                                {/* Ваш LineChart остается здесь, но теперь он отображает сигнал для контекста */}
                                {/* ... ResponsiveContainer с LineChart ... */}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-4">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sine Amplitude</label>
                                <span className="text-xl font-mono text-accent">{sineAmpl}</span>
                            </div>
                            <input type="range" min="0" max="255" value={sineAmpl} onChange={(e) => setSineAmpl(parseInt(e.target.value))}
                                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Square Amplitude</label>
                                <span className="text-xl font-mono text-accent">{squAmpl}</span>
                            </div>
                            <input type="range" min="0" max="255" value={squAmpl} onChange={(e) => setSquAmpl(parseInt(e.target.value))}
                                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-black/50 rounded-lg border border-gray-800 flex items-center justify-between">
                        <span className="text-sm text-gray-400 uppercase font-semibold">Square Wave Output</span>
                        <button onClick={() => setIsSquareOn(!isSquareOn)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSquareOn ? 'bg-accent' : 'bg-gray-600'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSquareOn ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl mt-8 bg-black p-4 rounded-lg border border-gray-800 font-mono text-[10px] text-gray-500 h-32 overflow-y-auto shadow-inner">
                <div className="text-accent mb-1 underline">SYSTEM LOG:</div>
                <div>{`> Mode set to: ${mode.toUpperCase()}`}</div>
                {isConnected && <div className="text-white">{`> Device connected. Ready to send HID reports.`}</div>}
                {isRunning && <div className="text-white">{`> Signal generation active at ${frequency} Hz. Wave: ${waveForm}`}</div>}
            </div>
        </div>

    );
}

export default App;