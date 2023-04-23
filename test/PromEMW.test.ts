
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Application } from 'express';

import { PromEMW } from '../src/';
import { Recorder } from '../src/lib/prom/Recorder';
import Session from '../src/lib/util/Session';

jest.mock('../src/lib/prom/Recorder');

const sessionGetConfigItemSpy = jest.spyOn(Session, 'getConfigItem');

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

        expect(sessionGetConfigItemSpy).toHaveBeenCalled();

        expect(Recorder).toHaveBeenCalled();

        expect(mockExpressApp.use).toHaveBeenCalled();
        expect(mockExpressApp.get).toHaveBeenCalled();
    });

    it('should call to initialise the recorder with the provided args and call to setup express handlers', async () => {

        const mockOpts = {
            collectionPath: '/collectMe',
            appName: 'MyTestApp'
        };

        await PromEMW.install(<Application><unknown>mockExpressApp, mockOpts);

        expect(sessionGetConfigItemSpy).toHaveBeenCalled();

        expect(Recorder).toHaveBeenCalled();

        expect(mockExpressApp.use).toHaveBeenCalled();
        expect(mockExpressApp.get).toHaveBeenCalled();
    });

});