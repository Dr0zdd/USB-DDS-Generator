export const TOR_DDS_CMD = {
    SetLED: 0x010000,
    SetSinAmpl: 0x020000,
    SetSqAmpl: 0x030000,
    EnaSqOut: 0x040000,
    SetCtrlReg: 0x050000,
    SetFreqReg: 0x060000,
    AddFreqReg: 0x070000,
} as const;

export const TOR_DDS_CONST = {
    ModeTriangle: 0x01,
    ResetDevice: 0x02,
    ZeroShift: 0x800000,
    Fclk: 25_000_000,
    FreqRes: 0x1000000,
    MaxDeltaF: 5000, // ← добавлено
} as const;


export interface TorDDSCommandPayload {
    cmdByte: number;
    dataWord: number;
}
