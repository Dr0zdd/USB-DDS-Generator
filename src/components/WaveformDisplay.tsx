// src/components/WaveformDisplay.tsx
import React, { useRef, useEffect } from 'react';
import { WaveformType } from '../types/deviceTypes';

interface WaveformDisplayProps {
    waveform: WaveformType;
    frequency: number;
    amplitude: number;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
                                                             waveform,
                                                             frequency,
                                                             amplitude
                                                         }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;

        // Очистка
        ctx.clearRect(0, 0, W, H);

        // -----------------------------
        // 1. Рисуем сетку (как Agilent)
        // -----------------------------
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;

        const gridX = 60; // 10 делений по 60px
        const gridY = 50;

        for (let x = 0; x < W; x += gridX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }

        for (let y = 0; y < H; y += gridY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // -----------------------------
        // 2. Рисуем волну
        // -----------------------------
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.beginPath();

        // Время на экран (как на реальном осциллографе)
        // 10 делений * 10 ms/div = 100 ms
        const timePerDiv = 10; // ms/div
        const totalMs = timePerDiv * 10;
        const totalSec = totalMs / 1000;

        // Сколько периодов помещается
        const periods = frequency * totalSec;

        for (let x = 0; x < W; x++) {
            const t = (x / W) * periods * 2 * Math.PI;

            let yNorm = 0;

            if (waveform === 'sine') {
                yNorm = Math.sin(t);
            } else if (waveform === 'triangle') {
                const tri = (t % (2 * Math.PI)) / (2 * Math.PI);
                yNorm = tri < 0.5 ? tri * 4 - 1 : 3 - tri * 4;
            } else if (waveform === 'square') {
                yNorm = Math.sin(t) >= 0 ? 1 : -1;
            }

            const y = H / 2 - yNorm * (H / 3) * amplitude;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();
    }, [waveform, frequency, amplitude]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={250}
            className="rounded-lg bg-black"
        />
    );
};

export default WaveformDisplay;
