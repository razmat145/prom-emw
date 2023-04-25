
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Request, Response } from 'express';

import { RouteIdrr } from 'eroute-idrr';

import Extractor from '../../src/lib/prom/Extractor';
import Session from '../../src/lib/util/Session';

const sessionGetConfigItemSpy = jest.spyOn(Session, 'getConfigItem');
const normalizeUriSpy = jest.spyOn(RouteIdrr, 'getNormalizedUri')

describe('Extractor', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('extractDefaultLabels', () => {

        const mockReq = {
            originalUrl: 'mockUrl101',
            method: 'mockMethod101'
        };
        const mockRes = {
            statusCode: 401
        };

        it(`should return default labels normalizing the status code if it's not escaped`, () => {
            sessionGetConfigItemSpy.mockReturnValue([]);
            normalizeUriSpy.mockReturnValue(mockReq.originalUrl);

            const sutResult = Extractor.extractDefaultLabels(<Request>mockReq, <Response><unknown>mockRes);

            expect(normalizeUriSpy).toHaveBeenCalled();
            expect(normalizeUriSpy).toHaveBeenCalledWith(mockReq.originalUrl);

            expect(sutResult).toEqual({
                path: mockReq.originalUrl,
                method: mockReq.method,
                statusCode: '4xx'
            });
        });

        it(`should return default labels with escaped status code`, () => {
            sessionGetConfigItemSpy.mockReturnValue([mockRes.statusCode]);
            normalizeUriSpy.mockReturnValue(mockReq.originalUrl);

            const sutResult = Extractor.extractDefaultLabels(<Request>mockReq, <Response><unknown>mockRes);

            expect(normalizeUriSpy).toHaveBeenCalled();
            expect(normalizeUriSpy).toHaveBeenCalledWith(mockReq.originalUrl);

            expect(sutResult).toEqual({
                path: mockReq.originalUrl,
                method: mockReq.method,
                statusCode: `${mockRes.statusCode}`
            });
        });

    });

});