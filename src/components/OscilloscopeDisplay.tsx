import React, { useRef, useEffect } from 'react';
// import { signalState } from '../types/signalTypes';

interface OscilloscopeProps {
    // Получаем параметры из главного App.tsx
    frequencyHz: number;
    sineAmplitudeV: number;
    squareActive: boolean;
}

const OscilloscopeDisplay: React.FC<OscilloscopeProps> = ({ frequencyHz, sineAmplitudeV, squareActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // --- Вспомогательные функции отрисовки (для чистоты кода) ---
    const drawGrids = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
        // Горизонтальные линии сетки
        for (let i = 0; i <= 10; i++) { // 11 линий включая центральную
            ctx.beginPath();
            ctx.moveTo(0, (height / 10) * i);
            ctx.lineTo(width, (height / 10) * i);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Вертикальные линии сетки
        for (let j = 0; j <= 4; j++) { // 5 секций по ширине
            ctx.beginPath();
            ctx.moveTo(width / 5 * j, 0);
            ctx.lineTo(width / 5 * j, height);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Центральная линия (X-axis)
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const drawSineWave = (ctx: CanvasRenderingContext2D, frequencyHz: number, amplitudeV: number): void => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        // Масштабирование: 10 Вольт на всю высоту канваса (удобный диапазон)
        const scaleFactorY = height / 2; // Полная высота от центральной линии

        ctx.beginPath();
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 3;

        // Начинаем с первой точки
        ctx.moveTo(0, height / 2);

        // Обход по ширине канваса
        for (let x = 0; x <= width; x += 5) {
            // Расчет синусоиды: A * sin(2 * PI * f * t / SampleRate)
            const time = x / (width / frequencyHz);
            const yOffset = amplitudeV * Math.sin(time * 2 * Math.PI);
            let y = height / 2 - (yOffset * scaleFactorY) / 2;

            ctx.lineTo(x, y);
        }
        ctx.stroke();
    };

    const drawSquareWave = (ctx: CanvasRenderingContext2D): void => {
        // Простая имитация импульсов для меандра (постоянные прямоугольники)
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        ctx.fillStyle = '#00ff41'; // Используем зеленый, как в примере

        // Рисуем 5-6 импульсов по ширине канваса
        for (let i = 1; i <= 6; i++) {
            const startX = width / 6 * (i - 1) + 20;
            const endX = width / 6 * i - 20;
            const yPos = height / 2 - (Math.random() > 0.5 ? 10 : 0); // Небольшая вертикальная смена

            ctx.fillRect(startX, yPos - 3, endX - startX, 6);
        }
    };

    /**
     * Основной цикл анимации: перерисовывает сигнал в каждом кадре.
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Запускаем цикл анимации (имитация реального осциллографа)
        const animateSignal = () => {
            // 1. Очистка холста
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 2. Рисование сетки (основа прибора)
            drawGrids(ctx, canvas.width, canvas.height);

            // 3. Отрисовка Синусоиды
            drawSineWave(ctx, frequencyHz, sineAmplitudeV);

            // 4. Отрисовка Меандра
            if (squareActive) {
                drawSquareWave(ctx);
            }

            requestAnimationFrame(animateSignal); // Используем rAF для плавности
        };

        const animationFrameId = requestAnimationFrame(animateSignal);

        return () => cancelAnimationFrame(animationFrameId);
    }, [frequencyHz, sineAmplitudeV, squareActive]);


    return (
        <div className="bg-[#1e1e1e] p-2 rounded-xl border border-gray-800 shadow-inner">
            <canvas
                ref={canvasRef}
                width={1200} // Фиксированная ширина для идеального масштабирования
                height={350}  // Высота канваса
                className="block w-full"
            />
        </div>
    );
};

export default OscilloscopeDisplay;
