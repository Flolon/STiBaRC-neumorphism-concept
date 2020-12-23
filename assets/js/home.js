// --- home.js --- //
function emojiPost(text) {
	for (var emoji in emojiIndex) {
		var re = new RegExp("\\:" + emoji + "\\:", "g");
		text = text.replace(
			re,
			'<img src="https://cdn.stibarc.com/emojis/' +
				emojiIndex[emoji].filename +
				'" class="emoji" title=":' +
				emoji +
				':"></img>'
		);
	}
	return text;
}

var postsHTML = "";
function toLink(id, item) {
	try {
		if (item["deleted"]) {
			item["title"] = "Post deleted";
		}
		var title = item["title"]
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		var contentClass = "";
		var content = item["content"]
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		var date = getDayOfWeek(toDate(item["postdate"])) + toDate(item["postdate"]);
		datee = new Date();
		month = datee.getMonth();
		day = datee.getDate()
		hour = datee.getHours();
		minute = datee.getMinutes();
		time = datee.getTime();
		datee2 = toDate(item["postdate"]);
		year2 = datee2.getFullYear();
		month2 = datee2.getMonth();
		day2 = datee2.getDate()
		hour2 = datee2.getHours();
		minute2 = datee2.getMinutes();
		time2 = datee2.getTime();
		console.log((time - time2) / 60000);
		
		if (
			((time - time2) / 60000) < ((hour * 60) + (minute))
		) {
			var date = "Today";
		} else if (
			((time - time2) / 60000) < ((hour * 60) + 1440 + (minute))
		) {
			var date = "Yesterday";
		} else if (
			((time - time2) / 60000) < ((hour * 60) + 8640 + (minute))
		) {
			var date = getDayOfWeek(toDate(item["postdate"]));
		} else {
			var date = month2 + "/" + day2 + "/" + year2
		}
		
		var comments = "0 comments";
		if (item["comments"] == 1) {
			comments = "1 comment";
		} else if (item["comemnts"] > 0) {
			comments = item["comments"] + " comments";
		}
		var media = "";
		var images = ["png", "jpg", "gif", "webp", "svg"];
		var videos = ["mov", "mp4", "m4a", "webm"];
		var audio = ["spx", "m3a", "wma", "wav", "mp3"];
		if (
			item["real_attachment"] != undefined &&
			item["real_attachment"] != "" &&
			item["real_attachment"] != "none"
		) {
			contentClass = "has-media";
			var ext = item["real_attachment"].split(".")[1];
			if (images.indexOf(ext) != -1) {
				media =
					'<div class="post-media"><img src="https://cdn.stibarc.com/images/' +
					item["real_attachment"] +
					'"></div>';
			} else if (videos.indexOf(ext) != -1) {
				media =
					'<div class="post-media"><video controls muted src="https://cdn.stibarc.com/images/' +
					item["real_attachment"] +
					'"></video></div>';
			} else if (audio.indexOf(ext) != -1) {
				media =
					'<a style="color:white" href="https://cdn.stibarc.com/images/' + item["real_attachment"] + '"><div class="post-media"><img src="./assets/images/music.png"></div></a>';
			}
		}
		postsHTML +=
			'<div> <div class="post"> <div class="post-votes"><img class="vote up" src="./assets/images/up.png">' +
			item["upvotes"] +
			'<img class="vote down" src="./assets/images/down.png">' +
			item["downvotes"] +
			"</div> <h2 class='post-title'>" +
			emojiPost(title) +
			"</h2> <h2>" +
			item["poster"] +
			'</h2> <h3 class="post-content ' +
			contentClass +
			'">' +
			content +
			'</h3> <div class="post-meta"><span>' +
			date +
			'</span><span class="flex-grow"></span>&nbsp;<span>' +
			comments +
			"</span>" +
			media +
			"</div> </div> </div>";
	} catch (err) {
		console.log(err);
	}
}

function loadPosts() {
	$("posts").innerHTML = "";
	updateEmojiIndex();
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		var tmp = JSON.parse(this.responseText);
		$("posts").innerHTML = "";
		var totalPosts = tmp["totalposts"];
		for (var i = totalPosts; i > totalPosts - 16; i--) {
			toLink(i, tmp[i]);
		}
		$("posts").innerHTML = postsHTML;
	};
	xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs", true);
	xhttp.send();
}

loadPosts();
