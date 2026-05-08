// src/api/deviceService.ts
import { REGISTERS, DEVICE_CONSTANTS, FREQUENCY } from '../types/deviceTypes';

/**
 * ========================================
 * ⚡️ ИМИТАЦИЯ СВЯЗИ (HID Communication Layer)
 * ========================================
 */
export const sendCommand = async (commandId: number, dataValue: number): Promise<boolean> => {
    // Это место, где в будущем будет node-hid или webusb API вызов.
    await new Promise(resolve => setTimeout(resolve, 50)); // Симуляция задержки I/O

    if (commandId & 0xFFFFFF) { // Проверка на plausibility команды
        console.log(`[COMMS] Успешно отправлено: Cmd=0x${commandId.toString(16)}, Data=0x${dataValue.toString(16)}`);
        return true;
    } else {
        console.error(`[COMMS] Ошибка: Некорректный ID команды 0x${commandId.toString(16)}.`);
        return false;
    }
};

/**
 * Вычисляет регистровое значение частоты (Frequency to Word).
 */
export const calculateFTW = (freq: number): number => {
    if (freq < 0) return 0;
    const maxFreq = FREQUENCY.FCLK / 2;
    if (freq >= maxFreq) return FREQUENCY.FREQ_RES - 1;
    return Math.round((FREQUENCY.FREQ_RES * freq) / FREQUENCY.FCLK);
};


/**
 * Процедура инициализации устройства (Сброс AD9834).
 */
export const performDeviceInit = async (): Promise<boolean> => {
    console.log("\n--- [CORE] Запуск процедуры сброса и настройки регистров ---");

    // 1. Сбрасываем устройство
    await sendCommand(REGISTERS.SET_CTRL + 0x2, 0x1); // Имитация ResetDevice (0x0100)

    // 2. Очищаем все регистры (Amplitude = 0, Enable = OFF)
    await sendCommand(REGISTERS.SET_SIN_AMP, 0);
    await sendCommand(REGISTERS.SET_SQUARE_AMP, 0);

    console.log("[CORE] Инициализация прошла успешно.");
    return true;
};


/**
 * Основная логика подключения и энумерования (Simulation).
 */
export const initializeConnection = async (): Promise<{ success: boolean, message: string }> => {
    // 1. Симуляция поиска устройства (Enumeration)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Пауза на сканирование USB

    // В реальном коде здесь идет проверка VID/PID через node-hid.
    const isFound = true;

    if (!isFound) {
        return { success: false, message: `❌ Устройство с ID ${DEVICE_CONSTANTS.VENDOR_ID} не обнаружено.` };
    }

    // 2. Проверка и выполнение инициализации
    const initSuccess = await performDeviceInit();

    if (initSuccess) {
        return { success: true, message: '✅ Успешно подключено. Готов к работе.' };
    } else {
        return { success: false, message: '❌ Критическая ошибка связи при инициализации.' };
    }
};

/**
 * Функция отправки всех настроек параметров (частота, амплитуды).
 */
export const setAllParameters = async (freq: number, sinAmp: number, sqAmp: number) => {
    await sendCommand(REGISTERS.SET_FREQ, calculateFTW(freq));
    await sendCommand(REGISTERS.SET_SIN_AMP, sinAmp);
    await sendCommand(REGISTERS.SET_SQUARE_AMP, sqAmp);
}
