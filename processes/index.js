module.exports = function(job,done){
  // Do some heavy work
  let data = job.data;
  let type. = data.type;
  let spider = data.spider;
  switch(type){
  	case "book":
  		crawelBook();
  		return;
  	case "chapter":
  		crawelChapter();
  		return;
  }
  return Promise.resolve(result);
}


