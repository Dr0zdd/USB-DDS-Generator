// src/api/deviceService.ts
// Унифицированный сервис для отправки команд на DDS-генератор

// Если позже добавишь WebUSB/WebSerial — просто заменишь sendRawCommand()

// -----------------------------
// 1. БАЗОВАЯ ОТПРАВКА КОМАНД
// -----------------------------
import {TorDDSDevice} from "../types/deviceTypes";

async function sendRawCommand(cmd: number): Promise<void> {
    console.log("[deviceService] → CMD:", cmd.toString(16));
    // TODO: здесь будет реальная отправка в устройство
    await new Promise(res => setTimeout(res, 5));
}

// -----------------------------
// 2. КОМАНДЫ DDS (FTW, амплитуды и т.д.)
// -----------------------------

// Пример расчёта FTW (Frequency Tuning Word)
export function calculateFTW(frequencyHz: number): number {
    const DDS_CLOCK = 125_000_000; // 125 MHz
    return Math.floor((frequencyHz * (2 ** 32)) / DDS_CLOCK);
}

// -----------------------------
// 3. УСТАНОВКА ВСЕХ ПАРАМЕТРОВ
// -----------------------------
export async function setAllParameters(
    frequencyHz: number,
    sineAmplitude: number,
    squareAmplitude: number
): Promise<void> {

    console.log("[deviceService] Запись параметров:");
    console.log("  Частота:", frequencyHz);
    console.log("  Амплитуда синуса:", sineAmplitude);
    console.log("  Амплитуда меандра:", squareAmplitude);

    const ftw = calculateFTW(frequencyHz);

    // Здесь будут реальные команды DDS
    await sendRawCommand(0xA0000000 | ftw); // пример
    await sendRawCommand(0xB0000000 | Math.floor(sineAmplitude * 255));
    await sendRawCommand(0xC0000000 | Math.floor(squareAmplitude * 255));

    console.log("[deviceService] ✔ Параметры записаны");
}

// -----------------------------
// 4. Экспорт API
// -----------------------------
export const deviceService = {
    sendRawCommand,
    sendCommand,
    calculateFTW,
    setAllParameters,
};

async function sendCommand(device: TorDDSDevice, raw: number): Promise<void> {
    console.log("[deviceService] → CMD:", raw.toString(16));
    await device.sendCommand(raw); // если устройство умеет
}



