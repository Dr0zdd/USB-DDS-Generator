// src/components/SignalReadouts.tsx
import React from 'react';

interface SignalReadoutsProps {
    frequencyHz: number;
    sinAmpV: number;
    sqAmpV: number;
}

const MeasurementCard = ({ title, value, unit, color }: any) => (
    <div className="bg-[#2a2a2a] p-3 rounded-lg border border-gray-700">
        <p className="text-xs uppercase text-gray-500 mb-1">{title}</p>
        <span className={`font-mono text-xl ${color}`}>{value} <span className="text-base opacity-80">{unit}</span></span>
    </div>
);

const SignalReadouts: React.FC<SignalReadoutsProps> = ({ frequencyHz, sinAmpV, sqAmpV }) => {
    return (
        <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-800 shadow-inner">
            <h3 className="text-2xl font-semibold uppercase text-yellow-400 mb-4 tracking-wider border-b border-gray-700 pb-2">Измерения параметров</h3>

            {/* Используем Grid для имитации панели измерений */}
            <div className="grid grid-cols-3 gap-4">
                {/* Частота */}
                <MeasurementCard
                    title="Frequency"
                    value={`${frequencyHz.toFixed(3)}`}
                    unit="Hz"
                    color="text-green-400"
                />

                {/* Амплитуда синуса */}
                <MeasurementCard
                    title="Sine Amplitude"
                    value={`${sinAmpV.toFixed(2)}`}
                    unit="V"
                    color="text-yellow-400"
                />

                {/* Амплитуда меандра */}
                <MeasurementCard
                    title="Square Amplitude"
                    value={`${sqAmpV.toFixed(2)}`}
                    unit="V"
                    color="text-cyan-400"
                />
            </div>
        </div>
    );
}

export default SignalReadouts;
