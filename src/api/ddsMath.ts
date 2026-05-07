import { TOR_DDS_CONST } from '../types/deviceTypes';

export function getCurrentFrequency(currentFreqReg: number): number {
    return currentFreqReg * (TOR_DDS_CONST.Fclk / TOR_DDS_CONST.FreqRes);
}

export function calcFreqRegFromHz(freqHz: number): number {
    if (freqHz < 0) return 0;
    if (freqHz >= TOR_DDS_CONST.Fclk / 2) return TOR_DDS_CONST.FreqRes - 1;
    return Math.round((TOR_DDS_CONST.FreqRes * freqHz) / TOR_DDS_CONST.Fclk);
}

export function computeNewFrequencyReg(
    newFreqReg: number,
    currentFreqReg: number,
    forceInit: boolean
) {
    let deltaF = newFreqReg - currentFreqReg;
    let initNeeded = false;

    if (Math.abs(deltaF) > TOR_DDS_CONST.MaxDeltaF || forceInit) {
        const aligned = newFreqReg & 0xfffff00;
        initNeeded = true;
        deltaF = newFreqReg - aligned;
        return {
            initNeeded,
            baseReg: aligned,
            deltaReg: deltaF + TOR_DDS_CONST.ZeroShift,
            finalReg: newFreqReg,
        };
    }

    return {
        initNeeded,
        baseReg: null,
        deltaReg: deltaF + TOR_DDS_CONST.ZeroShift,
        finalReg: newFreqReg,
    };
}
