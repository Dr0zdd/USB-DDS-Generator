import {
    TOR_DDS_CMD,
    TOR_DDS_CONST,
    TorDDSCommandPayload,
    TorDDSDevice,
    TorDDSState,
} from '../types/deviceTypes';

export class DDSDeviceSimulator implements TorDDSDevice {
    name = 'TorDDS Simulator';
    vendorId = 0x16c0;
    productId = 0x05df;

    private state: TorDDSState = {
        connected: true,
        initialized: false,
        ledOn: false,
        frequencyHz: 0,
        sineAmplitude: 0,
        squareAmplitude: 0,
        squareEnabled: false,
        waveform: 'sine',
    };

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async sendFeatureReport(payload: TorDDSCommandPayload): Promise<void> {
        await this.delay(50);

        const cmd = payload.cmdByte << 16;

        if (cmd === TOR_DDS_CMD.SetLED) {
            this.state.ledOn = payload.dataWord !== 0;
            return;
        }

        if (cmd === TOR_DDS_CMD.SetSinAmpl) {
            this.state.sineAmplitude = payload.dataWord & 0xff;
            return;
        }

        if (cmd === TOR_DDS_CMD.SetSqAmpl) {
            this.state.squareAmplitude = payload.dataWord & 0xff;
            return;
        }

        if (cmd === TOR_DDS_CMD.EnaSqOut) {
            this.state.squareEnabled = payload.dataWord !== 0;
            return;
        }

        if (cmd === TOR_DDS_CMD.SetCtrlReg) {
            const triangle = (payload.dataWord & TOR_DDS_CONST.ModeTriangle) !== 0;
            this.state.waveform = triangle ? 'triangle' : 'sine';
            if (payload.dataWord & TOR_DDS_CONST.ResetDevice) {
                this.state.initialized = false;
                this.state.frequencyHz = 0;
            } else {
                this.state.initialized = true;
            }
            return;
        }

        if (cmd === TOR_DDS_CMD.SetFreqReg) {
            const reg = payload.dataWord << 8;
            const freq =
                reg * (TOR_DDS_CONST.Fclk / TOR_DDS_CONST.FreqRes);
            this.state.frequencyHz = freq;
            return;
        }

        if (cmd === TOR_DDS_CMD.AddFreqReg) {
            const delta = payload.dataWord - TOR_DDS_CONST.ZeroShift;
            const currentReg = Math.round(
                (this.state.frequencyHz * TOR_DDS_CONST.FreqRes) /
                TOR_DDS_CONST.Fclk
            );
            const newReg = currentReg + delta;
            const freq =
                newReg * (TOR_DDS_CONST.Fclk / TOR_DDS_CONST.FreqRes);
            this.state.frequencyHz = freq;
            return;
        }
    }

    getState(): TorDDSState {
        return { ...this.state };
    }
}