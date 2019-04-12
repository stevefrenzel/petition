(function() {
    "use strict";

    const redis = require("redis");
    const { promisify } = require("util");
    const client = redis.createClient(
        process.env.REDIS_URL || { host: "localhost", port: 6379 }
    );

    client.on("error", err => {
        console.log(err);
    });

    exports.get = promisify(client.get).bind(client);
    exports.setex = promisify(client.setex).bind(client);
    exports.del = promisify(client.del).bind(client);
})();
