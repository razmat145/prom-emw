
import { Application } from 'express';

import { Recorder } from './prom/Recorder';
import Session from './util/Session';

import { IMWOpts } from './types/Opts';


class PromEMW {

    private recorder: Recorder;

    public async install(app: Application, mwOpts?: IMWOpts) {
        Session.setConfigOpts(mwOpts);

        this.recorder = new Recorder();

        this.setupExtractionMW(app);
        this.setupCollectionEndpoint(app);
    }

    private setupExtractionMW(app: Application) {
        app.use((req, res, next) => {
            const collectionPath = Session.getConfigItem('collectionPath');

            const isPromCollectionRequest = req.originalUrl === collectionPath;
            if (isPromCollectionRequest) {
                return next();
            }

            const startTime = process.hrtime();
            res.once('finish', () => this.recorder.recordRequestStats(req, res, startTime));

            return next();
        });
    }

    private setupCollectionEndpoint(app: Application) {
        const collectionPath = Session.getConfigItem('collectionPath');

        app.get(collectionPath, async (req, res) => {
            return res.send(await this.recorder.getMetrics());
        });
    }

}

export default new PromEMW();