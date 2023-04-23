
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Application } from 'express';

import { PromEMW } from '../src/';
import { Recorder } from '../src/lib/prom/Recorder';
import { defaultMWOpts } from '../src/lib/types/Opts';

jest.mock('../src/lib/prom/Recorder');

const mockExpressApp = {
    use: jest.fn(),
    get: jest.fn()
};

describe('PromEMW', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call to initialise the recorder with defaults and call to setup express handlers', async () => {

        await PromEMW.install(<Application><unknown>mockExpressApp);

        expect(Recorder).toHaveBeenCalled();
        expect(Recorder).toHaveBeenCalledWith(defaultMWOpts);

        expect(mockExpressApp.use).toHaveBeenCalled();
        expect(mockExpressApp.get).toHaveBeenCalled();
    });

    it('should call to initialise the recorder with the provided args and call to setup express handlers', async () => {

        const mockOpts = {
            collectionPath: '/collectMe',
            appName: 'MyTestApp'
        };

        await PromEMW.install(<Application><unknown>mockExpressApp, mockOpts);

        expect(Recorder).toHaveBeenCalled();
        expect(Recorder).toHaveBeenCalledWith(mockOpts);

        expect(mockExpressApp.use).toHaveBeenCalled();
        expect(mockExpressApp.get).toHaveBeenCalled();
    });

});