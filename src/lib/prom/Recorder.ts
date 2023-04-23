
import { Request, Response } from 'express';
import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

import Extractor from './Extractor';
import Session from '../util/Session';

import { defaultLabels } from '../types/Label';


export class Recorder {

    private registry = new Registry();

    private requestCounter: Counter;
    private requestCounterSuffix = 'requests_total';

    private timingHistogram: Histogram;
    private timingHistogramSuffix = 'request_timing_seconds';

    constructor() {
        const appName = Session.getConfigItem('appName');

        this.requestCounter = new Counter({
            name: this.attachBucketPrefix(this.requestCounterSuffix, appName),
            help: 'Total number of requests',
            labelNames: defaultLabels
        });
        this.registry.registerMetric(this.requestCounter);

        this.timingHistogram = new Histogram({
            name: this.attachBucketPrefix(this.timingHistogramSuffix, appName),
            help: 'Request timing in seconds',
            labelNames: defaultLabels
        });
        this.registry.registerMetric(this.timingHistogram);

        if (Session.getConfigItem('collectDefaultMetrics')) {
            collectDefaultMetrics({ register: this.registry });
        }
    }

    public recordRequestStats(req: Request, res: Response, startTiming: [number, number]) {

        const defaultLabels = Extractor.extractDefaultLabels(req, res);
        const timingSeconds = Extractor.extractTimingSeconds(startTiming);

        this.requestCounter.inc(defaultLabels);
        this.timingHistogram.observe(defaultLabels, timingSeconds);
    }

    public getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    private attachBucketPrefix(bucketName: string, bucketPrefix = '') {
        return bucketPrefix
            ? `${bucketPrefix}_${bucketName}`
            : bucketName;
    }

}