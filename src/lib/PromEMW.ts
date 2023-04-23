
import { Application } from 'express';

import { Recorder } from './prom/Recorder';

import { IMWOpts, defaultMWOpts } from './types/Opts';


class PromEMW {

    private recorder: Recorder;

    public async install(app: Application, mwOpts?: IMWOpts) {
        const opts = {
            ...defaultMWOpts,
            ...mwOpts
        };

        this.recorder = new Recorder(opts);

        this.setupExtractionMW(app, opts);
        this.setupCollectionEndpoint(app, opts);
    }

    private setupExtractionMW(app: Application, mwOpts: IMWOpts = defaultMWOpts) {
        app.use((req, res, next) => {
            const { collectionPath } = mwOpts;

            const isPromCollectionRequest = req.originalUrl === collectionPath;
            if (isPromCollectionRequest) {
                return next();
            }

            const startTime = process.hrtime();
            res.once('finish', () => this.recorder.recordRequestStats(req, res, startTime));

            return next();
        });
    }

    private setupCollectionEndpoint(app: Application, mwOpts: IMWOpts = defaultMWOpts) {
        const { collectionPath } = mwOpts;

        app.get(collectionPath, async (req, res) => {
            return res.send(await this.recorder.getMetrics());
        });
    }

}

export default new PromEMW();