module.exports = function(chapters,book){
	chapters = chapters.sort((a,b)=> a.index - b.index);
	let str = chapters.map((chapter,index) => {
		return `<li><a href="/book/${book._id}/${chapter.index}">${chapter.title}${book.title}</a></li>`
	}).join("")
	return `<ul class="chapter-list clearfix">${str}</ul>`;
}