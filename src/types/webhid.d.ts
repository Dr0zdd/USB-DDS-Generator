interface HIDDevice {
    opened: boolean;
    vendorId: number;
    productId: number;
    productName: string;
    open(): Promise<void>;
    close(): Promise<void>;
    sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;
}

interface HID {
    requestDevice(options: { filters: HIDDeviceFilter[] }): Promise<HIDDevice[]>;
    getDevices(): Promise<HIDDevice[]>;
}

interface HIDDeviceFilter {
    vendorId?: number;
    productId?: number;
}

interface Navigator {
    hid: HID;
}
