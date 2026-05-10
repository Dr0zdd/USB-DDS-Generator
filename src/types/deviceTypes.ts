export type WaveformType = 'sine' | 'triangle' | 'square';

export interface TorDDSDevice {
    id: string;

    setFrequency: (hz: number) => Promise<void>;

    setSineAmplitude: (value: number) => Promise<void>;
    setSquareAmplitude: (value: number) => Promise<void>;

    enableSquare: (enabled: boolean) => Promise<void>;

    setWaveform: (type: WaveformType) => Promise<void>;

    sendCommand: (cmd: number) => Promise<void>;
}

export interface ConnectionState {
    isConnected: boolean;
    isInitialized: boolean;
    statusMessage: string;
}

export interface TorDDSState {
    connected: boolean;
    initialized: boolean;
    ledOn: boolean;
    frequencyHz: number;
    sineAmplitude: number;
    squareAmplitude: number;
    squareEnabled: boolean;
    waveform: WaveformType;
}
