import {
    TOR_DDS_CMD,
    TOR_DDS_CONST,
    TorDDSCommandPayload,
} from '../types/ddsCommands';

import { TorDDSDevice, TorDDSState, WaveformType } from '../types/deviceTypes';

export async function setAllParameters(params: any) {
    // TODO
}

export class DDSDeviceSimulator implements TorDDSDevice {
    id = 'simulator';
    name = 'TorDDS Simulator';
    vendorId = 0x16c0;
    productId = 0x05df;

    private state: TorDDSState = {
        connected: true,
        initialized: true,
        ledOn: false,
        frequencyHz: 100,
        sineAmplitude: 1,
        squareAmplitude: 1,
        squareEnabled: true,
        waveform: 'sine',
    };

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async sendCommand(cmd: number): Promise<void> {
        await this.delay(10);

        const opcode = cmd & 0xff0000;
        const data = cmd & 0x00ffff;

        switch (opcode) {
            case TOR_DDS_CMD.SetLED:
                this.state.ledOn = data !== 0;
                break;

            case TOR_DDS_CMD.SetSinAmpl:
                this.state.sineAmplitude = data;
                break;

            case TOR_DDS_CMD.SetSqAmpl:
                this.state.squareAmplitude = data;
                break;

            case TOR_DDS_CMD.EnaSqOut:
                this.state.squareEnabled = data !== 0;
                break;

            case TOR_DDS_CMD.SetCtrlReg: {
                const triangle = (data & TOR_DDS_CONST.ModeTriangle) !== 0;
                this.state.waveform = triangle ? 'triangle' : 'sine';
                if (data & TOR_DDS_CONST.ResetDevice) {
                    this.state.initialized = false;
                    this.state.frequencyHz = 0;
                } else {
                    this.state.initialized = true;
                }
                break;
            }

            case TOR_DDS_CMD.SetFreqReg: {
                const reg = data << 8;
                const freq = reg * (TOR_DDS_CONST.Fclk / TOR_DDS_CONST.FreqRes);
                this.state.frequencyHz = freq;
                break;
            }

            case TOR_DDS_CMD.AddFreqReg: {
                const delta = data - TOR_DDS_CONST.ZeroShift;
                const currentReg = Math.round(
                    (this.state.frequencyHz * TOR_DDS_CONST.FreqRes) / TOR_DDS_CONST.Fclk,
                );
                const newReg = currentReg + delta;
                const freq = newReg * (TOR_DDS_CONST.Fclk / TOR_DDS_CONST.FreqRes);
                this.state.frequencyHz = freq;
                break;
            }
        }
    }

    async setFrequency(hz: number): Promise<void> {
        this.state.frequencyHz = hz;
    }

    async setSineAmplitude(value: number): Promise<void> {
        this.state.sineAmplitude = value;
    }

    async setSquareAmplitude(value: number): Promise<void> {
        this.state.squareAmplitude = value;
    }

    async enableSquare(enabled: boolean): Promise<void> {
        this.state.squareEnabled = enabled;
    }

    async setWaveform(type: WaveformType): Promise<void> {
        this.state.waveform = type;
    }

    getState(): TorDDSState {
        return { ...this.state };
    }
}
