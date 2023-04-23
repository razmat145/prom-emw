
import { IMWOpts, defaultMWOpts } from '../types/Opts';


class Session {

    private opts: IMWOpts;

    public setConfigOpts(opts: IMWOpts) {
        this.opts = {
            ...defaultMWOpts,
            ...opts
        };
    }

    public getConfigItem<T extends keyof IMWOpts>(configKey: T) {
        if (this.opts) {
            return this.opts[configKey];
        } else {
            throw new Error('Session config opts not initialised');
        }
    }

}

export default new Session();