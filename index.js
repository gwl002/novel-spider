const mongoose = require("mongoose");

const config = require("./config");
const processes = require("./processes");
const queue = require("./queue");

function listen(data){
  console.log("mongodb connect successfully!");
}

function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect(config.mongo, { keepAlive: 1, useNewUrlParser: true });
}



connect();


queue.process(3,processes);


// queue.add({
//   type: "book",
//   bookId: "12_12725"
// })

//chapter job
// ```
//   {
//     type:"book",
//     url:"xxxx"
//   }
// ```


// //book job
// ```
// {
//   type:"chapter",
//   url:"yyyy"
// }
// ```
