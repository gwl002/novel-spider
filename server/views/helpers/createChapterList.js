module.exports = function(chapters,options){
	chapters = chapters.sort((a,b)=> b.index - a.index);
	let str = chapters.map((chapter,index) => {
		return `<li><a href="/chapter/${chapter._id}">${chapter.title}</a></li>`
	}).join("")
	return `<ul class="chapter-list clearfix">${str}</ul>`;
}