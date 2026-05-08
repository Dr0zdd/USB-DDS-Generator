import React from 'react';
import { WaveformType } from '../types/deviceTypes';

interface SettingsPanelProps {
    frequency: number;
    setFrequency: (v: number) => void;

    sineAmplitude: number;
    setSineAmplitude: (v: number) => void;

    squareAmplitude: number;
    setSquareAmplitude: (v: number) => void;

    waveform: WaveformType;
    setWaveform: (w: WaveformType) => void;

    timeScaleMsPerDiv: number;
    setTimeScaleMsPerDiv: (v: number) => void;

    sweepMode: 'stop' | 'roll' | 'sweep';
    setSweepMode: (m: 'stop' | 'roll' | 'sweep') => void;

    isRunning: boolean;
    setIsRunning: (v: boolean) => void;

    triggerSingleSweep: () => void;

    autoAmplitude: boolean;
    setAutoAmplitude: (v: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
                                                         frequency,
                                                         setFrequency,
                                                         sineAmplitude,
                                                         setSineAmplitude,
                                                         squareAmplitude,
                                                         setSquareAmplitude,
                                                         waveform,
                                                         setWaveform,
                                                         timeScaleMsPerDiv,
                                                         setTimeScaleMsPerDiv,
                                                         sweepMode,
                                                         setSweepMode,
                                                         isRunning,
                                                         setIsRunning,
                                                         triggerSingleSweep,
                                                         autoAmplitude,
                                                         setAutoAmplitude,
                                                     }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Частота */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Частота (Гц)</label>
                <input
                    type="number"
                    value={frequency}
                    min={0.1}
                    max={1_000_000}
                    step={0.1}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="p-2 rounded bg-[#2a2a2a] border border-gray-700 text-white"
                />
            </div>

            {/* Форма сигнала */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Форма сигнала</label>
                <div className="flex gap-3">
                    <button
                        onClick={() => setWaveform('sine')}
                        className={`px-3 py-2 rounded ${waveform === 'sine' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        Синус
                    </button>
                    <button
                        onClick={() => setWaveform('triangle')}
                        className={`px-3 py-2 rounded ${waveform === 'triangle' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        Треугольник
                    </button>
                    <button
                        onClick={() => setWaveform('square')}
                        className={`px-3 py-2 rounded ${waveform === 'square' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        Меандр
                    </button>
                </div>
            </div>

            {/* Амплитуда синуса */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Амплитуда синуса (В)</label>
                <input
                    type="number"
                    value={sineAmplitude}
                    min={0}
                    max={5}
                    step={0.01}
                    onChange={(e) => setSineAmplitude(Number(e.target.value))}
                    className="p-2 rounded bg-[#2a2a2a] border border-gray-700 text-white"
                />
            </div>

            {/* Амплитуда меандра */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Амплитуда меандра (В)</label>
                <input
                    type="number"
                    value={squareAmplitude}
                    min={0}
                    max={5}
                    step={0.01}
                    onChange={(e) => setSquareAmplitude(Number(e.target.value))}
                    className="p-2 rounded bg-[#2a2a2a] border border-gray-700 text-white"
                />
            </div>

            {/* AUTO амплитуда */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={autoAmplitude}
                    onChange={(e) => setAutoAmplitude(e.target.checked)}
                    className="w-5 h-5"
                />
                <span className="text-gray-300 font-mono">AUTO амплитуда</span>
            </div>

            {/* Развёртка */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Развёртка (ms/div)</label>
                <select
                    value={timeScaleMsPerDiv}
                    onChange={(e) => setTimeScaleMsPerDiv(Number(e.target.value))}
                    className="p-2 rounded bg-[#2a2a2a] border border-gray-700 text-white"
                >
                    <option value={0.1}>0.1 ms/div</option>
                    <option value={1}>1 ms/div</option>
                    <option value={5}>5 ms/div</option>
                    <option value={10}>10 ms/div</option>
                    <option value={50}>50 ms/div</option>
                    <option value={100}>100 ms/div</option>
                    <option value={500}>500 ms/div</option>
                </select>
            </div>

            {/* Режим развёртки */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Режим развёртки</label>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setSweepMode('stop');
                            setIsRunning(false);
                        }}
                        className={`px-3 py-2 rounded ${sweepMode === 'stop' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        Stop
                    </button>
                    <button
                        onClick={() => {
                            setSweepMode('roll');
                            setIsRunning(true);
                        }}
                        className={`px-3 py-2 rounded ${sweepMode === 'roll' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        Roll
                    </button>
                    <button
                        onClick={() => {
                            setSweepMode('sweep');
                            setIsRunning(false);
                        }}
                        className={`px-3 py-2 rounded ${sweepMode === 'sweep' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    >
                        Sweep
                    </button>
                </div>

                <div className="flex gap-3 mt-3">
                    {sweepMode === 'roll' && (
                        <button
                            onClick={() => setIsRunning(!isRunning)}
                            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700"
                        >
                            {isRunning ? 'Stop' : 'Start'}
                        </button>
                    )}

                    {sweepMode === 'sweep' && (
                        <button
                            onClick={triggerSingleSweep}
                            className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700"
                        >
                            Single Sweep
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
