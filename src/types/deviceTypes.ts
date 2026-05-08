// src/types/deviceTypes.ts

export const DEVICE_CONSTANTS = {
    VENDOR_ID: 0x16c0,
    PRODUCT_ID: 0x05df,
    NAME: 'TorDDS',
};

// Адреса регистров (имитация)
export const REGISTERS = {
    SET_CTRL: 0x100000, // Управление режимом/сбросом
    WRITE_AD: 0x800000, // Регистр для записи данных AD9834
    SET_FREQ: 0x400000,
    SET_SIN_AMP: 0x200000,
    SET_SQUARE_AMP: 0x100000,
    ENA_SQUARE_OUT: 0x080000,
    // ... добавить все остальные константы из Delphi
};

export const FREQUENCY = {
    FCLK: 50000000, // Тактовая частота (Hz)
    FREQ_RES: 10000000, // Разрешение регистра (2^28)
    MAX_DELTA_F: 0x3FFFFF,
};

export type ConnectionState = {
    isConnected: boolean;
    isInitialized: boolean;
    statusMessage: string;
};
