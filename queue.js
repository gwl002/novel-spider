import Queue from "bull";
import Redis from "ioredis";

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