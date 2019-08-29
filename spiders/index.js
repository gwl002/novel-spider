var rp = require('request-promise-native');
var iconv = require('iconv-lite');
var cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");

// var kue = require("kue");
// var queue = kue.createQueue();

// var url = "https://www.bequge.com/3_3109/";
// var baseUrl = "https://www.bequge.com/";

//点到为止
// var url ="http://www.biqgew.com/12_12725/";
// var baseUrl = "http://www.biqgew.com/"

//医统江山
var url = "http://www.bqugw.com/119_119563/"
var baseUrl = "http://www.bqugw.com/"



async function getChapters(bookUrl){
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
		book.author = $("#info p").first().text().split("：")[1];
		book.lastUpdated = $("#info p").last().prev().text().split("：")[1];
		let chapters = $("#list dl dd");
		chapters = chapters.map((index,item)=>{
			return {
				name: $(item).find("a").text(),
				link: baseUrl+ $(item).find("a").attr("href")
			}
		})
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

async function sleep(seconds){
	return new Promise((resolve,reject) => {
		setTimeout(() =>{console.log(`wait for ${seconds} seconds`);resolve()},seconds*1000)
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
			let chapter;
			try{
				chapter = await getChapter(chapters[i].link)
			}catch(err){
				console.log("inner error:",err);
				continue;
			}
			await sleep(2);
			console.log("睡眠结束...")
			if(chapter){
				console.log(`正在写入${chapter.title}...`)
				let content = chapter.content;
				//格式化 缩进为2space
				content = content.replace(/(\n|\r)(\s{5})/g,"$1  ").replace(/\s{4}/,"  ");
				await writeFile(chapter.title+"\n",filePath,"a");
				await writeFile(content,filePath,"a");
			}else{
				console.log(`爬取${chapters[i].link} -- ${chapters[i].name} 失败...`)
			}
		}
	}catch(err){
		console.log("out error:",err);
	}	
}

downloadBook(url);

// for(var i=0;i<list.length;i++){
// 	var url = baseUrl + list[i] + "/";
// 	createBookJob(url);
// }

// createBookJob(url);


async function createBookJob(bookURL){
	console.log("create book job "+bookURL)
	queue.create("getBookInfo",{
		bookURL:bookURL
	}).save();
}


async function createChapterJob(chapterURL,bookTitle,chapterIndex){
	console.log("create chapter job "+bookTitle + " " + chapterIndex)
	queue.create("getChapter",{
		chapterURL:chapterURL,
		bookTitle:bookTitle,
		chapterIndex:chapterIndex
	}).save();
}


// queue.process("getBookInfo",async(job,done)=>{
// 	var bookURL = job.data.bookURL;
// 	console.log("process getBookInfo job " + bookURL )
// 	var book = await getChapters(bookURL);
// 	var chapters = book.chapters;
// 	var bookTitle = book.title;
// 	for(var i=0;i<chapters.length;i++){
// 		await createChapterJob(chapters[i].link,bookTitle,i)
// 	}
// 	done();
// })


// queue.process("getChapter",5,async(job,done)=>{
// 	var bookTitle = job.data.bookTitle;
// 	var chapterURL = job.data.chapterURL;
// 	var chapterIndex = job.data.chapterIndex;
// 	console.log("process getChapter job " + bookTitle + " " + chapterIndex)
// 	var dirName = bookTitle
// 	if(!fs.existsSync(dirName)){
// 		fs.mkdirSync(dirName);
// 	}
// 	var filePath = dirName + "/" + chapterIndex + ".txt";
// 	var chapter = await getChapter(chapterURL);
// 	var content = chapter.title + "\n" + chapter.content;
// 	try{
// 		await writeFile(content,filePath,"w");
// 	}catch(err){
// 		console.log(err)
// 	}finally{
// 		done();
// 	}
	

// })