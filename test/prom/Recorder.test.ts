
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

import { Recorder } from '../../src/lib/prom/Recorder';
import Extractor from '../../src/lib/prom/Extractor';
import Session from '../../src/lib/util/Session';

import { defaultLabels } from '../../src/lib/types/Label';

const sessionGetConfigItemSpy = jest.spyOn(Session, 'getConfigItem');

const extractorExtractDefaultLabels = jest.spyOn(Extractor, 'extractDefaultLabels');
const extractorExtractTimingSeconds = jest.spyOn(Extractor, 'extractTimingSeconds');

jest.mock('prom-client');

describe('Recorder', () => {

    const mockRegister = {
        registerMetric: jest.fn(),
        metrics: jest.fn<() => Promise<string>>()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {

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

    describe('recordRequestStats', () => {
        it('should call the extractor and call to record the extracted values', () => {
            const mockReq = 'mockReq101';
            const mockRes = 'mockRes101';
            const mockTiming: [number, number] = [101, 101];

            const mockDefaultLabels = 'defaultLabels101';
            const mockTimingSeconds = 'timingSeconds101';

            const requestCounterSpy = jest.fn();
            const timingHistogramSpy = jest.fn();

            const sutRecorder = new Recorder();

            sutRecorder['requestCounter'] = <any>{ inc: requestCounterSpy };
            sutRecorder['timingHistogram'] = <any>{ observe: timingHistogramSpy };

            extractorExtractDefaultLabels.mockReturnValue(<any>mockDefaultLabels);
            extractorExtractTimingSeconds.mockReturnValue(<any>mockTimingSeconds);

            sutRecorder.recordRequestStats(<any>mockReq, <any>mockRes, mockTiming);

            expect(extractorExtractDefaultLabels).toHaveBeenCalled();
            expect(extractorExtractDefaultLabels).toHaveBeenCalledWith(mockReq, mockRes);

            expect(extractorExtractTimingSeconds).toHaveBeenCalled();
            expect(extractorExtractTimingSeconds).toHaveBeenCalledWith(mockTiming);

            expect(requestCounterSpy).toHaveBeenCalled();
            expect(requestCounterSpy).toHaveBeenCalledWith(mockDefaultLabels);

            expect(timingHistogramSpy).toHaveBeenCalled();
            expect(timingHistogramSpy).toHaveBeenCalledWith(mockDefaultLabels, mockTimingSeconds);
        });
    });

    describe('getMetrics', () => {
        it('should call to return the registry\'s metrics', async () => {
            (<jest.Mock><unknown>Registry).mockReturnValue(mockRegister);

            const mockReturn = 'mockReturn101';
            mockRegister.metrics.mockResolvedValue(mockReturn);

            const sutRecorder = new Recorder();
            const sutResult = await sutRecorder.getMetrics();

            expect(mockRegister.metrics).toHaveBeenCalled();
            expect(sutResult).toEqual(mockReturn);
        });
    });

});