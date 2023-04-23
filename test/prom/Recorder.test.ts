
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

import { Recorder } from '../../src/lib/prom/Recorder';
import Session from '../../src/lib/util/Session';

import { defaultLabels } from '../../src/lib/types/Label';

const sessionGetConfigItemSpy = jest.spyOn(Session, 'getConfigItem');
jest.mock('prom-client');

describe('Recorder', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {

        const mockRegister = {
            registerMetric: jest.fn()
        };

        it(`should initialise the default registry`, () => {
            sessionGetConfigItemSpy.mockReturnValue('');

            (<jest.Mock><unknown>Registry).mockReturnValue(mockRegister);

            const sutRecorder = new Recorder();

            expect(sessionGetConfigItemSpy).toHaveBeenCalledTimes(2);
            expect(sessionGetConfigItemSpy).toHaveBeenNthCalledWith(1, 'appName');
            expect(sessionGetConfigItemSpy).toHaveBeenNthCalledWith(2, 'collectDefaultMetrics');

            expect(Registry).toHaveBeenCalled();

            expect(Counter).toHaveBeenCalled();
            expect(Counter).toHaveBeenCalledWith({
                name: sutRecorder['requestCounterSuffix'],
                help: 'Total number of requests',
                labelNames: defaultLabels
            });

            expect(Histogram).toHaveBeenCalled();
            expect(Histogram).toHaveBeenCalledWith({
                name: sutRecorder['timingHistogramSuffix'],
                help: 'Request timing in seconds',
                labelNames: defaultLabels
            })

            expect(mockRegister.registerMetric).toHaveBeenCalledTimes(2);
        });


        it(`should enable default metrics if instructed`, () => {
            sessionGetConfigItemSpy.mockReturnValueOnce('');
            sessionGetConfigItemSpy.mockReturnValueOnce(true);

            (<jest.Mock><unknown>Registry).mockReturnValue(mockRegister);

            const sutRecorder = new Recorder();

            expect(sessionGetConfigItemSpy).toHaveBeenCalledTimes(2);
            expect(sessionGetConfigItemSpy).toHaveBeenNthCalledWith(1, 'appName');
            expect(sessionGetConfigItemSpy).toHaveBeenNthCalledWith(2, 'collectDefaultMetrics');

            expect(Registry).toHaveBeenCalled();

            expect(Counter).toHaveBeenCalled();
            expect(Counter).toHaveBeenCalledWith({
                name: sutRecorder['requestCounterSuffix'],
                help: 'Total number of requests',
                labelNames: defaultLabels
            });

            expect(Histogram).toHaveBeenCalled();
            expect(Histogram).toHaveBeenCalledWith({
                name: sutRecorder['timingHistogramSuffix'],
                help: 'Request timing in seconds',
                labelNames: defaultLabels
            })

            expect(mockRegister.registerMetric).toHaveBeenCalledTimes(2);

            expect(collectDefaultMetrics).toHaveBeenCalled();
            expect(collectDefaultMetrics).toHaveBeenCalledWith({ register: mockRegister });
        });

    });

});