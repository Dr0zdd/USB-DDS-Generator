// src/api/deviceService.ts
import {
    TOR_DDS_VENDOR_ID,
    TOR_DDS_PRODUCT_ID,
    TOR_DDS_CMD,
    TorDDSCommandPayload,
    TorDDSDevice,
} from '../types/deviceTypes';
import { DDSDeviceSimulator } from './DDSDeviceSimulator';

let simulator = new DDSDeviceSimulator();

export class DeviceService {
    private device: HIDDevice | null = null;
    private useSimulator = false;

    async requestDevice(): Promise<TorDDSDevice> {
        if (!('hid' in navigator)) {
            this.useSimulator = true;
            return simulator;
        }

        const devices = await navigator.hid.requestDevice({
            filters: [{ vendorId: TOR_DDS_VENDOR_ID, productId: TOR_DDS_PRODUCT_ID }],
        });

        if (!devices || devices.length === 0) {
            this.useSimulator = true;
            return simulator;
        }

        this.device = devices[0];
        await this.device.open();

        return {
            name: this.device.productName || 'TorDDS',
            vendorId: TOR_DDS_VENDOR_ID,
            productId: TOR_DDS_PRODUCT_ID,
            sendFeatureReport: async (payload: TorDDSCommandPayload) => {
                const data = new Uint8Array(3);
                data[0] = payload.cmdByte;
                data[1] = payload.dataWord & 0xff;
                data[2] = (payload.dataWord >> 8) & 0xff;
                await this.device!.sendFeatureReport(0, data);
            },
        };
    }

    async sendCommand(
        device: TorDDSDevice,
        rawValue: number
    ): Promise<void> {
        const cmdByte = (rawValue >> 16) & 0xff;
        const dataWord = rawValue & 0xffff;

        const payload: TorDDSCommandPayload = {
            rawValue,
            cmdByte,
            dataWord,
        };

        await device.sendFeatureReport(payload);
    }

    async sendCommandByKey(
        device: TorDDSDevice,
        key: keyof typeof TOR_DDS_CMD,
        data: number
    ): Promise<void> {
        const raw = TOR_DDS_CMD[key] + (data & 0xffff);
        await this.sendCommand(device, raw);
    }
}

export const deviceService = new DeviceService();
