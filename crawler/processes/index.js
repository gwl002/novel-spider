// const {getChapters,getChapter} = require("../spiders/spider2");

const bookModel = require("../models/book");
const chapterModel = require("../models/chapter");
const queue = require("../queue");

module.exports = async function(job,done){
  // Do some heavy work
  let data = job.data;
  let type = data.type;
  let spiderName = "";
  switch(type){
  	case "book":
        let bookId = data.bookId;
        spiderName = data.spiderName;
        let { getChapters } = require("../spiders/"+spiderName);
        try{
            let book = await getChapters(bookId);
            let doc = await bookModel.findOne({url:book.url}).exec();
            if(!doc){
              doc = new bookModel();
            }
            doc.url = book.url;
            doc.title = book.title;
            doc.author = book.author;
            doc.imgSrc = book.imgSrc;
            doc.updatedAt = book.lastUpdated;
            await doc.save();

            book.chapters.forEach((item,index)=>{
              console.log(`${item.link} put into waiting queue...`);
              createChapterJob(item.link,index,doc._id,spiderName);
            })
            done();
        }catch(err){
            console.log("book job error:",err);
            done(new Error("book error"));
        }
  		return;
  	case "chapter":
        console.log(`${data.url} start crawl...`);
        spiderName = data.spiderName;
        let { getChapter } = require("../spiders/"+spiderName);
        try{
            let chapter = await getChapter(data.url);
            let doc = await chapterModel.findOne({url:data.url}).exec();
            if(!doc){
                doc = new chapterModel();
            }
            doc.url = data.url;
            doc.index = data.index;
            doc.title = chapter.title;
            doc.content = chapter.content;
            doc.book = data.book;
            await doc.save();
            console.log(`${data.url} end crawl...`)
            done();
        }catch(err){
            console.log("chapter job error:",err);
            done(new Error("chapter error"))
        }
  		return;
  }
  return Promise.resolve(result);
}



function createChapterJob(chapterUrl,index,bookId,spiderName){
  queue.add({
    type: "chapter",
    url: chapterUrl,
    index: index,
    book: bookId,
    spiderName
  })
}


function createBookJob(bookId,spiderName){
  queue.add({
    type: "book",
    bookId: bookId,
    spiderName
  })
}


