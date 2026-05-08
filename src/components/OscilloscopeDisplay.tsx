import React from 'react';
import { WaveformType } from '../types/deviceTypes';
import WaveformDisplay from './WaveformDisplay';

interface OscilloscopeDisplayProps {
    frequencyHz: number;
    sineAmplitudeV: number;
    squareAmplitudeV: number;
    waveform: WaveformType;

    timeScaleMsPerDiv: number;
    sweepMode: 'stop' | 'roll' | 'sweep';
    isRunning: boolean;
    singleSweepTrigger: number;

    autoAmplitude: boolean;
}

const OscilloscopeDisplay: React.FC<OscilloscopeDisplayProps> = ({
                                                                     frequencyHz,
                                                                     sineAmplitudeV,
                                                                     squareAmplitudeV,
                                                                     waveform,
                                                                     timeScaleMsPerDiv,
                                                                     sweepMode,
                                                                     isRunning,
                                                                     singleSweepTrigger,
                                                                     autoAmplitude,
                                                                 }) => {
    const amplitude = waveform === 'square' ? squareAmplitudeV : sineAmplitudeV;

    return (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-xl border border-gray-800 shadow-lg">
            <WaveformDisplay
                waveform={waveform}
                frequency={frequencyHz}
                amplitude={amplitude}
                timeScaleMsPerDiv={timeScaleMsPerDiv}
                sweepMode={sweepMode}
                isRunning={isRunning}
                singleSweepTrigger={singleSweepTrigger}
                autoAmplitude={autoAmplitude}
            />
        </div>
    );
};

export default OscilloscopeDisplay;
