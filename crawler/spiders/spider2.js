//website  http://www.bquwu.com/

var rp = require('request-promise-native');
var iconv = require('iconv-lite');
var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");

function writeFile(content,filePath,flag){
	return new Promise((resolve,reject)=>{
		fs.writeFile(filePath,content,{flag:flag},(err)=>{
			if(err){
				reject(err)
			}
			resolve();
		})
	})
}

//医统江山
var url = "http://www.bqugw.com/119_119563/"
var baseUrl = "http://www.bqugw.com"



async function getChapters(bookID){
	const bookUrl = baseUrl + "/" + bookID + "/";
	try{
		let data = await rp({
			uri:bookUrl,
			encoding: null
		})
		let html = iconv.decode(data,"gbk");
		let $ = cheerio.load(html);
		let book = {};
		book.imgSrc = $("#fmimg img").attr("src");
		if(book.imgSrc){
			book.imgSrc = baseUrl + book.imgSrc;
		}
		if(!book.imgSrc){
			let scriptCode = $("#fmimg").html();
			let matches = scriptCode.match(/src=[\"|\'](.+?)[\"|\']/);
			let thumbnailUrl;
			if(matches){
				thumbnailUrl = baseUrl + matches[1];
			}
			try{
				thumbnailUrl= thumbnailUrl.replace("&amp;","&");
				book.imgSrc = await getBookThumbnail(thumbnailUrl);
			}catch(err){
				console.log(err);
			}
		}
		book.title = $("#info h1").text();
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
        console.log(`${bookUrl} book crawl failed`,err)
        throw err;
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
		let $ = cheerio.load(html,{decodeEntities: false});
		let chapter ={};
		chapter.title = $(".bookname h1").text();
		let content = $("#content").text();
		content = content.trim();
		content = content.replace(/\n/g,"AABBCC").replace(/\s{4}/g,"\t").replace(/AABBCC/g,"\n");
		content = "\t" + content;
		chapter.content = content;
		return chapter;
	}catch(err){
        console.log(`${chapterUrl} chapter crawl failed`,err)
        throw err;
	}
	
}

async function getBookThumbnail(url){
	if(!url){
		return undefined;
	}
	try{
		let data = await rp({
			uri: url
		})
		let matches = data.match(/src=[\"|\'](.+?)[\"|\']/);
		let imgSrc = matches[1];
		return imgSrc;
	}catch(err){
		console.log(`get thumbnail failed!`)
	}
}


module.exports = {
	getChapters,
	getChapter
}


// getChapters("119_119563")

// getChapter("http://www.bqugw.com/79_79416/52092918.html");



