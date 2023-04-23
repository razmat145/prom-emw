
import { describe, it, expect, jest, afterEach } from '@jest/globals';
import { Request, Response } from 'express';

import Extractor from '../../src/lib/prom/Extractor';
import Session from '../../src/lib/util/Session';

const sessionGetConfigItemSpy = jest.spyOn(Session, 'getConfigItem');

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

            const sutResult = Extractor.extractDefaultLabels(<Request>mockReq, <Response><unknown>mockRes);

            expect(sutResult).toEqual({
                path: mockReq.originalUrl,
                method: mockReq.method,
                statusCode: '4xx'
            });
        });

        it(`should return default labels with escaped status code`, () => {
            sessionGetConfigItemSpy.mockReturnValue([mockRes.statusCode]);

            const sutResult = Extractor.extractDefaultLabels(<Request>mockReq, <Response><unknown>mockRes);

            expect(sutResult).toEqual({
                path: mockReq.originalUrl,
                method: mockReq.method,
                statusCode: `${mockRes.statusCode}`
            });
        });

    });

});