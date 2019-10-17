var rp = require('request-promise-native');
var iconv = require('iconv-lite');
var cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");

var url ="http://www.shizongzui.cc/santi/";
var baseUrl = "http://www.shizongzui.cc/"



async function getChapters(bookId){
	let bookUrl = baseUrl + bookId;
	try{
		let data = await rp({
			uri:bookUrl,
			encoding: null
		})
		let html = iconv.decode(data,"utf-8");
		let $ = cheerio.load(html,{decodeEntities: false});
		let book = {};
		book.imgSrc = null;
		book.title = $(".v h1").text();
		book.author = $(".site").next().text().split("：")[1].trim();
		book.lastUpdated = null;
		let chapters = $(".booklist>span>a");
		chapters = chapters.map((index,item)=>{
			return {
				name: $(item).text(),
				link: $(item).attr("href")
			}
		})
		book.url = bookUrl;
		book.chapters = Array.prototype.slice.call(chapters);
		console.log(book);
		return book;
	}catch(err){
		console.log(`${bookUrl} book crawl failed`,err)
        throw err;
	}
}

async function getChapter(chapterUrl){
	try{
		let data = await rp({
			uri:chapterUrl,
			encoding: null
		})
		let html = iconv.decode(data,"utf-8");
		//禁止自解析
		let $ = cheerio.load(html,{decodeEntities: false});
		let chapter ={};
		chapter.title = $(".chaptertitle h1").text();
		console.log("读取"+chapter.title+".....");
		let content = $(".bookcontent").html();
		//格式化内容 去除多余字符 增加换行
		content = content.replace(/<br><br>/g,"\n\n").replace(/<div.+<\/div>/ig,"");
		chapter.content = content;
		return chapter;
	}catch(err){
		console.log(`${chapterUrl} chapter crawl failed`,err)
        throw err;
	}
}

module.exports = {
	getChapters,
	getChapter
}

// getChapters("santi");