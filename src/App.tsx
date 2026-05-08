import React, { useEffect, useState } from 'react';
import { ConnectionManagerButton } from './components/ConnectionManagerButton';
import OscilloscopeDisplay from './components/OscilloscopeDisplay';
import SignalReadouts from './components/SignalReadouts';
import SettingsPanel from './components/SettingsPanel';
import { useDeviceConnection } from './hooks/useDeviceConnection';
import { setAllParameters } from './api/deviceService';
import { WaveformType } from './types/deviceTypes';

const App: React.FC = () => {
    const [frequency, setFrequency] = useState<number>(1000);
    const [sineAmplitude, setSineAmplitude] = useState<number>(1.0);
    const [squareAmplitude, setSquareAmplitude] = useState<number>(0.5);
    const [waveform, setWaveform] = useState<WaveformType>('sine');

    const [timeScaleMsPerDiv, setTimeScaleMsPerDiv] = useState<number>(10);
    const [sweepMode, setSweepMode] = useState<'stop' | 'roll' | 'sweep'>('stop');
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [singleSweepTrigger, setSingleSweepTrigger] = useState<number>(0);

    const [autoAmplitude, setAutoAmplitude] = useState<boolean>(false);

    const { connectionState, connectReal, connectSimulated, disconnect } =
        useDeviceConnection();

    useEffect(() => {
        if (connectionState.isInitialized) {
            (async () => {
                await setAllParameters(frequency, sineAmplitude, squareAmplitude);
            })();
        }
    }, [frequency, sineAmplitude, squareAmplitude, connectionState.isInitialized]);

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 tracking-wider">
                DDS Signal Generator Controller (Prototype)
            </h1>

            <div className="mb-8 w-full max-w-5xl mx-auto">
                <ConnectionManagerButton
                    connectionState={connectionState}
                    onConnectReal={connectReal}
                    onConnectSimulated={connectSimulated}
                    onDisconnect={disconnect}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
                <div className="lg:col-span-1 flex flex-col gap-6 p-4 bg-[#1e1e1e] rounded-xl border border-gray-800 shadow-xl">
                    <SettingsPanel
                        frequency={frequency}
                        setFrequency={setFrequency}
                        sineAmplitude={sineAmplitude}
                        setSineAmplitude={setSineAmplitude}
                        squareAmplitude={squareAmplitude}
                        setSquareAmplitude={setSquareAmplitude}
                        waveform={waveform}
                        setWaveform={setWaveform}
                        timeScaleMsPerDiv={timeScaleMsPerDiv}
                        setTimeScaleMsPerDiv={setTimeScaleMsPerDiv}
                        sweepMode={sweepMode}
                        setSweepMode={setSweepMode}
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        triggerSingleSweep={() => setSingleSweepTrigger((t) => t + 1)}
                        autoAmplitude={autoAmplitude}
                        setAutoAmplitude={setAutoAmplitude}
                    />
                </div>

                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="w-full">
                        <h3 className="text-xl font-mono text-white border-b border-gray-700 pb-2 mb-4">
                            Осциллограмма (Real-time Signal View)
                        </h3>

                        <OscilloscopeDisplay
                            frequencyHz={frequency}
                            sineAmplitudeV={sineAmplitude}
                            squareAmplitudeV={squareAmplitude}
                            waveform={waveform}
                            timeScaleMsPerDiv={timeScaleMsPerDiv}
                            sweepMode={sweepMode}
                            isRunning={isRunning}
                            singleSweepTrigger={singleSweepTrigger}
                            autoAmplitude={autoAmplitude}
                        />
                    </div>

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
