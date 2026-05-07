export const TOR_DDS_VENDOR_ID = 0x16c0;
export const TOR_DDS_PRODUCT_ID = 0x05df;
export const TOR_DDS_PRODUCT_NAME = 'TorDDS';


export const TOR_DDS_CMD = {
    AddFreqReg: 0x800000,
    SetFreqReg: 0x400000,
    SetPhaseReg: 0x200000,
    SetCtrlReg: 0x100000,
    WriteToAD: 0x080000,
    SetSinAmpl: 0x040000,
    SetSqAmpl: 0x020000,
    EnaSqOut: 0x010000,
    SetLED: 0x000000,
} as const;

export type TorDDSCommandKey = keyof typeof TOR_DDS_CMD;


export const TOR_DDS_CONST = {
    InitWord: 0x2000,
    MaxDeltaF: 0x3fffff,
    ZeroShift: 0x400000,
    MaskFP: 0x0c0000,
    ModeTriangle: 0x02,
    ResetDevice: 0x0100,
    Fclk: 50_000_000,
    FreqRes: 0x10000000,
} as const;


export type FrequencyHz = number;


export type AmplitudeLevel = number;


export type WaveformType = 'sine' | 'triangle';


export interface TorDDSState {
    connected: boolean;
    initialized: boolean;
    ledOn: boolean;

    frequencyHz: FrequencyHz;
    sineAmplitude: AmplitudeLevel;
    squareAmplitude: AmplitudeLevel;
    squareEnabled: boolean;
    waveform: WaveformType;
}

export interface TorDDSCommandPayload {
    rawValue: number;
    cmdByte: number;
    dataWord: number;
}

export interface TorDDSDevice {
    name: string;
    vendorId: number;
    productId: number;

    sendFeatureReport(payload: TorDDSCommandPayload): Promise<void>;
}
