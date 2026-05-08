export const TOR_DDS_CMD = {
    SetFreqReg: 0xA0000000,
    AddFreqReg: 0xA1000000,
    SetSinAmpl: 0xB0000000,
    SetSqAmpl: 0xC0000000,
    EnaSqOut:  0xD0000000,
    SetCtrlReg: 0xE0000000,
} as const;
