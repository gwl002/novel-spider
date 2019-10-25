module.exports = function(chapter,type){
	let index = chapter.index;
	if(type === "pre" && index > 0){
		index = index - 1
	}else if(type === "next"){
		index = index + 1
	}
	return `/book/${chapter.book._id}/${index}`
}