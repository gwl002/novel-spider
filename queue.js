const Queue = require("bull");
const  Redis = require("ioredis");

const config = require("./config");


const client = new Redis(config.redis);
const subscriber = new Redis(config.redis);

const opts = {
  createClient: function (type) {
    switch (type) {
      case 'client':
        return client;
      case 'subscriber':
        return subscriber;
      default:
        return new Redis(config.redis);
    }
  }
}


const queue = new Queue("test",opts);


module.exports = queue;
