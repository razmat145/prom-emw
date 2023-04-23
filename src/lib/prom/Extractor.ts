
import { Request, Response } from 'express';

import Session from '../util/Session';

import { IDefaultLabels } from '../types/Label';


class Extractor {

    public extractDefaultLabels(req: Request, res: Response): IDefaultLabels {

        const { originalUrl, method } = req;
        const { statusCode } = res;

        return {
            path: originalUrl,
            method,
            statusCode: this.extractBaseStatus(statusCode)
        };
    }

    public extractTimingSeconds(startTiming: [number, number]) {

        const sinceStart = process.hrtime(startTiming);

        const timingSeconds = sinceStart[0] + sinceStart[1] / 1e+9
        const trimmedTimingSeconds = Math.round((timingSeconds + Number.EPSILON) * 1000) / 1000;

        return trimmedTimingSeconds;
    }

    private extractBaseStatus(statusCode: number): string {
        const escapedCodes = Session.getConfigItem('escapeStatusCodes');

        if (escapedCodes.includes(statusCode)) {
            return `${statusCode}`;
        } else {
            const base = statusCode.toString()[0];

            return `${base}xx`;
        }
    }

}

export default new Extractor();