import { useState, useCallback } from 'react';
import { deviceService } from '../api/deviceService';
import { TOR_DDS_CMD } from '../types/ddsCommands';
import {
    TorDDSDevice,
    WaveformType,
} from '../types/deviceTypes';
import {
    calcFreqRegFromHz,
    computeNewFrequencyReg,
} from '../api/ddsMath';

export function useDDSControl(device: TorDDSDevice | null) {
    const [frequency, setFrequency] = useState(0);
    const [sineAmplitude, setSineAmplitude] = useState(0);
    const [squareAmplitude, setSquareAmplitude] = useState(0);
    const [squareEnabled, setSquareEnabled] = useState(false);
    const [waveform, setWaveform] = useState<WaveformType>('sine');

    const MIN_FREQ = 0.1;
    const MAX_FREQ = 1_000_000;

    const send = useCallback(
        async (raw: number) => {
            if (!device) return;
            await deviceService.sendCommand(device, raw);
        },
        [device]
    );

    const updateFrequency = useCallback(
        async (hz: number) => {
            if (!device) return;

            // 🔥 Ограничение частоты
            if (hz < MIN_FREQ) hz = MIN_FREQ;
            if (hz > MAX_FREQ) hz = MAX_FREQ;

            const oldReg = calcFreqRegFromHz(frequency);
            const newReg = calcFreqRegFromHz(hz);

            const calc = computeNewFrequencyReg(newReg, oldReg, true);

            // Если DDS требует инициализации — отправляем базовый регистр
            if (calc.initNeeded && calc.baseReg !== null) {
                await send(TOR_DDS_CMD.SetFreqReg + (calc.baseReg >> 8));
            }

            // Отправляем дельту
            await send(TOR_DDS_CMD.AddFreqReg + (calc.deltaReg & 0x7fffff));

            // Обновляем состояние
            setFrequency(hz);
        },
        [device, frequency, send]
    );

    const updateSineAmplitude = useCallback(
        async (value: number) => {
            if (!device) return;
            await send(TOR_DDS_CMD.SetSinAmpl + (value & 0xff));
            setSineAmplitude(value);
        },
        [device, send]
    );

    const updateSquareAmplitude = useCallback(
        async (value: number) => {
            if (!device) return;
            await send(TOR_DDS_CMD.SetSqAmpl + (value & 0xff));
            setSquareAmplitude(value);
        },
        [device, send]
    );

    const toggleSquare = useCallback(
        async (enabled: boolean) => {
            if (!device) return;
            await send(TOR_DDS_CMD.EnaSqOut + (enabled ? 1 : 0));
            setSquareEnabled(enabled);
        },
        [device, send]
    );

    const setWaveformType = useCallback(
        async (type: WaveformType) => {
            if (!device) return;
            const isTriangle = type === 'triangle' ? 1 : 0;
            await send(TOR_DDS_CMD.SetCtrlReg + isTriangle);
            setWaveform(type);
        },
        [device, send]
    );

    return {
        frequency,
        sineAmplitude,
        squareAmplitude,
        squareEnabled,
        waveform,
        updateFrequency,
        updateSineAmplitude,
        updateSquareAmplitude,
        toggleSquare,
        setWaveformType,
    };
}
