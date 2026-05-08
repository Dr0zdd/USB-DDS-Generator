// src/components/OscilloscopeDisplay.tsx
import React from 'react';
import { WaveformType } from '../types/deviceTypes';
import WaveformDisplay from './WaveformDisplay';

interface OscilloscopeDisplayProps {
    frequencyHz: number;
    sineAmplitudeV: number;
    squareActive: boolean;
}

const OscilloscopeDisplay: React.FC<OscilloscopeDisplayProps> = ({
                                                                     frequencyHz,
                                                                     sineAmplitudeV,
                                                                     squareActive
                                                                 }) => {

    // Определяем тип волны
    const waveform: WaveformType = squareActive ? 'square' : 'sine';

    return (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-xl border border-gray-800 shadow-lg">
            <WaveformDisplay
                waveform={waveform}
                frequency={frequencyHz}
                amplitude={sineAmplitudeV}
            />
        </div>
    );
};

export default OscilloscopeDisplay;
