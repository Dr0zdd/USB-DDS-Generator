// src/types/deviceTypes.ts

// Тип формы сигнала (для осциллографа, настроек и API)
export type WaveformType = 'sine' | 'triangle' | 'square';

// Тип устройства DDS
export interface TorDDSDevice {
    id: string;

    // Частота
    setFrequency: (hz: number) => Promise<void>;

    // Амплитуды
    setSineAmplitude: (value: number) => Promise<void>;
    setSquareAmplitude: (value: number) => Promise<void>;

    // Включение/выключение меандра
    enableSquare: (enabled: boolean) => Promise<void>;

    // Универсальная отправка команд
    sendCommand: (cmd: number) => Promise<void>;
}

// Статус подключения (используется в useDeviceConnection)
export interface ConnectionState {
    isConnected: boolean;
    isInitialized: boolean;
    statusMessage: string;
}
