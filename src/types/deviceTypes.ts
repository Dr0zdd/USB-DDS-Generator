// src/types/deviceTypes.ts

export const DEVICE_CONSTANTS = {
    VENDOR_ID: 0x16c0, // VID из Delphi кода
    PRODUCT_ID: 0x05df,  // PID из Delphi кода
    NAME: 'TorDDS',
};

// Адреса регистров (сохраняем константы для чистоты)
export const REGISTERS = {
    SET_CTRL: 0x100000,
    WRITE_AD: 0x800000,
    SET_FREQ: 0x400000,
    SET_SIN_AMP: 0x200000,
    SET_SQUARE_AMP: 0x100000,
};

export const FREQUENCY = {
    FCLK: 50000000,
    FREQ_RES: 10000000,
    MAX_DELTA_F: 0x3FFFFF,
};
