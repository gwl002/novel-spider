var rp = require('request-promise-native');
var iconv = require('iconv-lite');
var cheerio = require("cheerio");
var path = require("path");


//医统江山
var url = "http://www.bqugw.com/119_119563/"
var baseUrl = "http://www.bqugw.com/"



async function getChapters(bookID){
	const bookUrl = baseUrl + bookID + "/";
	console.log(bookUrl);
	try{
		let data = await rp({
			uri:bookUrl,
			encoding: null
		})
		let html = iconv.decode(data,"gbk");
		let $ = cheerio.load(html);
		let book = {};
		book.imgSrc = baseUrl + $("#fmimg img").attr("src");
		book.title = $("#info h1").text();
		console.log(book.title,"---------");
		book.author = $("#info p").first().text().split("：")[1];
		book.lastUpdated = $("#info p").last().prev().text().split("：")[1];
		let chapters = $("#list dl dd");
		chapters = chapters.map((index,item)=>{
			return {
				name: $(item).find("a").text(),
				link: baseUrl+ $(item).find("a").attr("href")
			}
		})
		book.url = bookUrl;
		book.chapters = Array.prototype.slice.call(chapters,9);
		return book;
	}catch(err){
		console.log(err)
	}
}

// getChapters(url)

async function getChapter(chapterUrl){
	try{
		let data = await rp({
			uri:chapterUrl,
			encoding: null
		})
		let html = iconv.decode(data,"gbk");
		let $ = cheerio.load(html);
		let chapter ={};
		chapter.title = $(".bookname h1").text();
		chapter.content = $("#content").text();
		return chapter;
	}catch(err){
		console.log("getChapters Error",err)
	}
	
}


module.exports = {
	getChapters,
	getChapter
}
 



