import {
    TOR_DDS_CMD,
    TOR_DDS_CONST,
    TorDDSCommandPayload,
} from '../types/ddsCommands';

import { TorDDSDevice, TorDDSState } from '../types/deviceTypes';

export class DDSDeviceSimulator implements TorDDSDevice {
    id = 'simulator';
    name = 'TorDDS Simulator';
    vendorId = 0x16c0;
    productId = 0x05df;

    private state: TorDDSState = {
        connected: true,
        initialized: true,
        ledOn: false,
        frequencyHz: 1000,
        sineAmplitude: 1,
        squareAmplitude: 1,
        squareEnabled: true,
        waveform: 'sine',
    };

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async sendCommand(raw: number): Promise<void> {
        await this.delay(10);

        const cmd = raw & 0xFF0000;
        const data = raw & 0x00FFFF;

        switch (cmd) {
            case TOR_DDS_CMD.SetSinAmpl:
                this.state.sineAmplitude = data;
                break;

            case TOR_DDS_CMD.SetSqAmpl:
                this.state.squareAmplitude = data;
                break;

            case TOR_DDS_CMD.EnaSqOut:
                this.state.squareEnabled = data !== 0;
                break;

            case TOR_DDS_CMD.SetCtrlReg:
                this.state.waveform = data === 1 ? 'triangle' : 'sine';
                break;

            case TOR_DDS_CMD.SetFreqReg:
                this.state.frequencyHz = data;
                break;

            case TOR_DDS_CMD.AddFreqReg:
                this.state.frequencyHz += data;
                break;
        }
    }

    async setFrequency(hz: number): Promise<void> {
        this.state.frequencyHz = hz;
    }

    async setSineAmplitude(v: number): Promise<void> {
        this.state.sineAmplitude = v;
    }

    async setSquareAmplitude(v: number): Promise<void> {
        this.state.squareAmplitude = v;
    }

    async setWaveform(type: 'sine' | 'triangle' | 'square'): Promise<void> {
        this.state.waveform = type;
    }

    async enableSquare(enabled: boolean): Promise<void> {
        this.state.squareEnabled = enabled;
    }

    getState(): TorDDSState {
        return { ...this.state };
    }
}
