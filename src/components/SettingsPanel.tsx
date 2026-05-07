// src/components/SettingsPanel.tsx
import React, { useState } from 'react';
import { TorDDSDevice, WaveformType } from '../types/deviceTypes';
import { useDDSControl } from '../hooks/useDDSControl';

interface Props {
    device: TorDDSDevice | null;
    onWaveformChange: (w: WaveformType) => void;
    onFrequencyChange: (hz: number) => void;
    onTimeScaleChange: (ms: number) => void;
}

export const SettingsPanel: React.FC<Props> = ({
                                                   device,
                                                   onWaveformChange,
                                                   onFrequencyChange,
                                                   onTimeScaleChange,
                                               }) => {
    const {
        frequency,
        sineAmplitude,
        squareAmplitude,
        squareEnabled,
        waveform,
        updateFrequency,
        updateSineAmplitude,
        updateSquareAmplitude,
        toggleSquare,
        setWaveformType,
    } = useDDSControl(device);

    const MIN_FREQ = 0.1;
    const MAX_FREQ = 1_000_000;

    const [freqInput, setFreqInput] = useState(frequency.toString());
    const [timeScale, setTimeScale] = useState(10);

    const changeWaveform = (type: WaveformType) => {
        setWaveformType(type);
        onWaveformChange(type);
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-gray-800 rounded-xl text-white w-full max-w-xl">

            {/* Частота */}
            <div className="flex flex-col gap-2">
                <label className="text-sm">Частота (Гц)</label>
                <input
                    type="number"
                    value={freqInput}
                    onChange={(e) => setFreqInput(e.target.value)}
                    onBlur={() => {
                        let hz = Number(freqInput);

                        if (hz < MIN_FREQ) hz = MIN_FREQ;
                        if (hz > MAX_FREQ) hz = MAX_FREQ;

                        setFreqInput(hz.toString());
                        updateFrequency(hz);
                        onFrequencyChange(hz);
                    }}
                    className="px-3 py-2 rounded bg-gray-700 outline-none"
                />
                <div className="text-xs text-gray-400">
                    Диапазон: {MIN_FREQ} Гц — {MAX_FREQ.toLocaleString()} Гц
                </div>
            </div>

            {/* Развёртка */}
            <div className="flex flex-col gap-2">
                <label className="text-sm">Развёртка (ms/div)</label>
                <select
                    value={timeScale}
                    onChange={(e) => {
                        const ms = Number(e.target.value);
                        setTimeScale(ms);
                        onTimeScaleChange(ms);
                    }}
                    className="px-3 py-2 rounded bg-gray-700"
                >
                    <option value={1}>1 ms/div</option>
                    <option value={5}>5 ms/div</option>
                    <option value={10}>10 ms/div</option>
                    <option value={20}>20 ms/div</option>
                    <option value={50}>50 ms/div</option>
                    <option value={100}>100 ms/div</option>
                </select>
            </div>

            {/* Выбор формы сигнала */}
            <div className="flex gap-4">
                <button
                    onClick={() => changeWaveform('sine')}
                    className={`px-4 py-2 rounded ${waveform === 'sine' ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                    Синус
                </button>

                <button
                    onClick={() => changeWaveform('triangle')}
                    className={`px-4 py-2 rounded ${waveform === 'triangle' ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                    Треугольник
                </button>
            </div>
        </div>
    );
};
