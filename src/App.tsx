// src/App.tsx
import React, { useState } from 'react';
import { WaveformType } from './types/deviceTypes';
import { useDeviceConnection } from './hooks/useDeviceConnection';
import { ConnectionManagerButton } from './components/ConnectionManagerButton';
import { SettingsPanel } from './components/SettingsPanel';
import { WaveformDisplay } from './components/WaveformDisplay';

export default function App() {
    const {
        device,
        isConnected,
        status,
        isInitializing,
        connect,
        disconnect,
        connectSimulated,
    } = useDeviceConnection();

    const [waveform, setWaveform] = useState<WaveformType>('sine');
    const [frequency, setFrequency] = useState(1000);
    const [timeScale, setTimeScale] = useState(10);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10 gap-10">
            <h1 className="text-3xl font-bold">TorDDS Web Controller</h1>

            <ConnectionManagerButton
                isConnected={isConnected}
                isInitializing={isInitializing}
                status={status}
                connect={connect}
                disconnect={disconnect}
                connectSimulated={connectSimulated}
            />

            {isConnected && (
                <div className="flex flex-col gap-10 w-full max-w-2xl">

                    <SettingsPanel
                        device={device}
                        onWaveformChange={setWaveform}
                        onFrequencyChange={setFrequency}
                        onTimeScaleChange={setTimeScale}
                    />

                    <WaveformDisplay
                        waveform={waveform}
                        frequency={frequency}
                        timeScale={timeScale}
                    />

                </div>
            )}
        </div>
    );
}
