// src/components/SignalReadouts.tsx
import React from 'react';

interface SignalReadoutsProps {
    frequencyHz: number;
    sinAmpV: number;
    sqAmpV: number;
}

const SignalReadouts: React.FC<SignalReadoutsProps> = ({
                                                           frequencyHz,
                                                           sinAmpV,
                                                           sqAmpV
                                                       }) => {
    return (
        <div className="w-full bg-[#1e1e1e] p-4 rounded-xl border border-gray-800 shadow-lg">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Частота */}
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm font-mono">Частота</span>
                    <span className="text-2xl font-bold text-green-400 font-mono">
                        {frequencyHz.toFixed(2)} Гц
                    </span>
                </div>

                {/* Амплитуда синуса */}
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm font-mono">Амплитуда синуса</span>
                    <span className="text-2xl font-bold text-blue-400 font-mono">
                        {sinAmpV.toFixed(2)} В
                    </span>
                </div>

                {/* Амплитуда меандра */}
                <div className="flex flex-col">
                    <span className="text-gray-400 text-sm font-mono">Амплитуда меандра</span>
                    <span className="text-2xl font-bold text-yellow-400 font-mono">
                        {sqAmpV.toFixed(2)} В
                    </span>
                </div>

            </div>
        </div>
    );
};

export default SignalReadouts;
