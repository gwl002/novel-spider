var rp = require('request-promise-native');
var iconv = require('iconv-lite');
var cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");

var url ="http://www.shizongzui.cc/santi/";
var baseUrl = "http://www.shizongzui.cc/"



async function getChapters(bookUrl){
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
		book.chapters = Array.prototype.slice.call(chapters);
		return book;
	}catch(err){
		console.log(err)
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
		content = content.replace(/<br><br>/g,"\n").replace(/<div.+<\/div>/ig,"");
		chapter.content = content;
		return chapter;
	}catch(err){
		console.log(err)
	}
}

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

async  function downloadBook(bookUrl){
	let book = await getChapters(bookUrl);
	let chapters = book.chapters;
	let filePath = path.resolve(book.title+".txt");
	try{
		if(fs.existsSync(filePath)){
			fs.unlinkSync(filePath)
		}
		for(let i=0;i<chapters.length;i++){
			let chapter = await getChapter(chapters[i].link);
			console.log(`正在写入${chapter.title}...`)
			let content = chapter.content;
			//格式化 缩进为2space
			// content = content.replace(/(\n|\r)(\s{5})/g,"$1  ").replace(/\s{4}/,"  ");
			await writeFile("\n"+chapter.title+"\n",filePath,"a");
			await writeFile(content,filePath,"a");
		}
	}catch(err){
		console.log(err);
	}	
}

downloadBook(url);