import React, { useEffect, useRef } from 'react';
import { WaveformType } from '../types/deviceTypes';

interface WaveformDisplayProps {
    waveform: WaveformType;
    frequency: number;
    amplitude: number;
    timeScaleMsPerDiv: number;
    sweepMode: 'stop' | 'roll' | 'sweep';
    isRunning: boolean;
    singleSweepTrigger: number;
    autoAmplitude: boolean;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
                                                             waveform,
                                                             frequency,
                                                             amplitude,
                                                             timeScaleMsPerDiv,
                                                             sweepMode,
                                                             isRunning,
                                                             singleSweepTrigger,
                                                             autoAmplitude,
                                                         }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const phaseRef = useRef<number>(0);
    const sweepProgressRef = useRef<number>(0);
    const lastTriggerRef = useRef<number>(singleSweepTrigger);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Подгоняем canvas под реальный размер контейнера
        const W = canvas.clientWidth;
        const H = canvas.clientHeight;
        canvas.width = W;
        canvas.height = H;

        const gridX = W / 10;
        const gridY = H / 5;

        const totalMs = Math.max(0.001, timeScaleMsPerDiv * 10);
        const totalSec = totalMs / 1000;

        const capFrequency = 50;
        const omegaCap = 2 * Math.PI * capFrequency;

        let lastTs = performance.now();

        const drawStatic = (offsetPhase = 0, sweepWindow = 1) => {
            ctx.clearRect(0, 0, W, H);

            // Сетка
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
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

            ctx.strokeStyle = '#4ade80';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const periods = Math.max(0, frequency) * totalSec;

            const startX = Math.floor((1 - sweepWindow) * W);

            // Авто‑амплитуда: волна занимает ~70% высоты
            const verticalScale = autoAmplitude ? (H * 0.35) : (H / 3) * amplitude;

            for (let x = startX; x < W; x++) {
                const rel = (x - startX) / Math.max(1, W - startX);
                const t = (rel * periods * 2 * Math.PI) + offsetPhase;

                let yNorm = 0;
                if (waveform === 'sine') {
                    yNorm = Math.sin(t);
                } else if (waveform === 'triangle') {
                    const tri = (t % (2 * Math.PI)) / (2 * Math.PI);
                    yNorm = tri < 0.5 ? tri * 4 - 1 : 3 - tri * 4;
                } else {
                    yNorm = Math.sin(t) >= 0 ? 1 : -1;
                }

                const y = H / 2 - yNorm * verticalScale;
                if (x === startX) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const step = (ts: number) => {
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            if (sweepMode === 'roll' && isRunning) {
                const physicalOmega = 2 * Math.PI * Math.max(0, frequency);
                const visualOmega = Math.min(physicalOmega, omegaCap);
                phaseRef.current += visualOmega * dt;
                drawStatic(phaseRef.current % (2 * Math.PI), 1);
            } else if (sweepMode === 'sweep') {
                const duration = Math.max(0.001, totalSec);
                sweepProgressRef.current += dt / duration;
                if (sweepProgressRef.current > 1) sweepProgressRef.current = 1;
                drawStatic(phaseRef.current, sweepProgressRef.current);
            } else {
                drawStatic(phaseRef.current % (2 * Math.PI), 1);
            }

            rafRef.current = requestAnimationFrame(step);
        };

        // Sweep
        if (sweepMode === 'sweep') {
            if (lastTriggerRef.current !== singleSweepTrigger) {
                lastTriggerRef.current = singleSweepTrigger;
                sweepProgressRef.current = 0;
                phaseRef.current = 0;
            }
            if (!rafRef.current) {
                lastTs = performance.now();
                rafRef.current = requestAnimationFrame(step);
            }
        }

        // Roll
        else if (sweepMode === 'roll') {
            if (isRunning) {
                if (!rafRef.current) {
                    lastTs = performance.now();
                    rafRef.current = requestAnimationFrame(step);
                }
            } else {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
                drawStatic(phaseRef.current % (2 * Math.PI), 1);
            }
        }

        // Stop
        else {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            drawStatic(phaseRef.current % (2 * Math.PI), 1);
        }

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [
        waveform,
        frequency,
        amplitude,
        timeScaleMsPerDiv,
        sweepMode,
        isRunning,
        singleSweepTrigger,
        autoAmplitude,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className="rounded-lg bg-black w-full h-[300px]"
        />
    );
};

export default WaveformDisplay;
