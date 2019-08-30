import Queue from "bull";
import Redis from "ioredis";

const mongoose = require("mongoose");

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(config.db, { keepAlive: 1, useNewUrlParser: true });
}

const redisConfig = {
	  port:6379,
  	host:"149.28.149.49",
  	password:"gwl002.tk",
  	db:0
}

const client = new Redis(redisConfig);
const subscriber = new Redis(redisConfig);

const opts = {
  createClient: function (type) {
    switch (type) {
      case 'client':
        return client;
      case 'subscriber':
        return subscriber;
      default:
        return new Redis(redisConfig);
    }
  }
}



const queue = new Queue("test",opts)


queue.process(function(job,done){
  setTimeout(function(){
    console.log(job.data);
    done();
  },50000)
})


queue.add({
	type:"xxxxx",
	payload:"yyyyy"
})


//chapter job
```
  {
    type:"book",
    url:"xxxx"
  }
```


//book job
```
{
  type:"chapter",
  url:"yyyy"
}
```