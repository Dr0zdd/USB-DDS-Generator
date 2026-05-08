// src/components/SettingsPanel.tsx
import React from 'react';

interface SettingsPanelProps {
    frequency: number;
    setFrequency: (v: number) => void;

    sineAmplitude: number;
    setSineAmplitude: (v: number) => void;

    squareAmplitude: number;
    setSquareAmplitude: (v: number) => void;

    isSquareEnabled: boolean;
    setIsSquareEnabled: (v: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
                                                         frequency,
                                                         setFrequency,

                                                         sineAmplitude,
                                                         setSineAmplitude,

                                                         squareAmplitude,
                                                         setSquareAmplitude,

                                                         isSquareEnabled,
                                                         setIsSquareEnabled
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
                <span className="text-gray-500 text-sm font-mono">
                    Диапазон: 0.1 Гц — 1 000 000 Гц
                </span>
            </div>

            {/* Амплитуда синуса */}
            <div className="flex flex-col">
                <label className="text-gray-300 font-mono mb-1">Амплитуда синуса (В)</label>
                <input
                    type="number"
                    value={sineAmplitude}
                    min={0}
                    max={5}
                    step={0.1}
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
                    step={0.1}
                    onChange={(e) => setSquareAmplitude(Number(e.target.value))}
                    className="p-2 rounded bg-[#2a2a2a] border border-gray-700 text-white"
                />
            </div>

            {/* Включение/выключение меандра */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isSquareEnabled}
                    onChange={(e) => setIsSquareEnabled(e.target.checked)}
                    className="w-5 h-5"
                />
                <label className="text-gray-300 font-mono">Включить меандр</label>
            </div>

        </div>
    );
};

export default SettingsPanel;
