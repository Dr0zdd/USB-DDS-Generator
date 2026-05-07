// src/components/WaveformDisplay.tsx
import React, { useRef, useEffect } from 'react';
import { WaveformType } from '../types/deviceTypes';

interface Props {
    waveform: WaveformType;
    frequency: number;
    timeScale: number; // ms/div
}

export const WaveformDisplay: React.FC<Props> = ({ waveform, frequency, timeScale }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        // сетка
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;

        for (let x = 0; x < W; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }

        for (let y = 0; y < H; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // волна
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.beginPath();

        // 🔥 Время на экран (как в осциллографе)
        const totalMs = timeScale * 10; // 10 делений
        const totalSec = totalMs / 1000;

        // 🔥 Сколько периодов поместится
        const periods = frequency * totalSec;

        for (let x = 0; x < W; x++) {
            const t = (x / W) * periods * 2 * Math.PI;

            let y;
            if (waveform === 'sine') {
                y = Math.sin(t);
            } else {
                const tri = (t % (2 * Math.PI)) / (2 * Math.PI);
                y = tri < 0.5 ? tri * 4 - 1 : 3 - tri * 4;
            }

            const yy = H / 2 - y * (H / 3);

            if (x === 0) ctx.moveTo(x, yy);
            else ctx.lineTo(x, yy);
        }

        ctx.stroke();
    }, [waveform, frequency, timeScale]);

    return (
        <div className="bg-gray-800 p-4 rounded-xl">
            <canvas ref={canvasRef} width={600} height={250} />
        </div>
    );
};
