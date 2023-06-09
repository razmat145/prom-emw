# prom-emw

Prometheus Express Middleware

## Description

Improving API visibility via a simple plugin and forget interface.       

### Current workings
##### Default recordings
- request count as `requests_total` Prom Counter
- request timing as `request_timing_seconds` Prom Histogram

##### Default labels
Currently used default labels are:
- `path` being called
- `method` being used
- `statusCode` being replied

##### Notes:
- `statusCode`s are normalized by prefix, i.e. 2xx, 4xx, 5xx etc
- `path`s are normalized via `eroute-idrr` (https://github.com/razmat145/eroute-idrr) by reading express app routes

### Installing

```
npm install --save prom-emw
```

### Usage

Given an example express app
```typescript
public async initialise(port: number) {
    const app = express();

    await PromEMW.install(app); // install the MW

    app.get('/myapi/test', (req, res) => {

        const randSample = _.sample([1, 3, 15, 20]);
        switch (true) { // change status randomly
            case randSample % 5 === 0 && randSample % 3 === 0:
                res.status(400);
                break;

            case randSample % 5 === 0:
                res.status(500);
                break;

            default:
                res.status(200);
                break;
        }

        const randomResponseTime = _.sample([0.5, 1, 1.5, 2]);
        setTimeout(() => { // reply in random times
            return res.json('Hello');
        }, randomResponseTime * 1000);
    });

    app.listen(port);
    logger.info(`Listening on port: ${port}`);
}
```

#### Example observations
For more queries examples, look into PromQL https://prometheus.io/docs/prometheus/latest/querying/basics/

###### Request rate over time   
`rate(requests_total[5m])`   

![Request rate](./img/requestRateOverTime.png)

###### 90 quantile slow request timings   
`histogram_quantile(0.9, rate(request_timing_seconds_bucket[5m]))`   

![90 quantile timings](./img/90quatileTimings.png)

###### Average request timing rate over time   
`sum(rate(request_timing_seconds_sum[5m])) / sum(rate(request_timing_seconds_count[5m]))`   

![Average request rate](./img/averageRequestRateOverTime.png)

###### Noticing the Unauthorized spike via escaping 401 status codes  `escapeStatusCodes: [401]`   
`rate(requests_total{statusCode='401'}[10s])`   

![Unauthorized spike](./img/escapingUnauthorized.png)

###### Cpu usage if `collectDefaultMetrics` is true 
`rate(process_cpu_system_seconds_total[5m])`   

![Cpu Usage](./img/cpuUsage.png)

###### Heap size if `collectDefaultMetrics` is true 
`nodejs_heap_size_used_bytes`   

![Heap Size](./img/heapSize.png)

###### Parameters are normalized by default
Given a path of `'/myapi/test/:myId'`, despite of being called with `myId` of `[101, 102, ... 9999]` it will get normalized to it's base
![Param Normalization](./img/parameterNormalization.png)

### Configuration
```typescript
interface IMWOpts {
    // Prom collection endpoint path
    collectionPath?: string; // defaults to /metrics 

    // App name to be appended to Prom metric type names
    appName?: string; // defaults to ''

    // Http status codes to be escaped from normalization
    escapeStatusCodes?: Array<number>;

    // If to collect default NodeJS metrics see https://github.com/siimon/prom-client#default-metrics
    collectDefaultMetrics?: boolean;
    
    // If to enable paremeter path normalization - recommended in order to reduce `path` label dimensions
    enableParameterNormalization?: boolean; // defaults to true
}
```

### TODOs
- more config flexibility and options
- pm2 cluster support
- custom metrics
- nodejs cluster support if desired


## License
This library is licensed under the Apache 2.0 License