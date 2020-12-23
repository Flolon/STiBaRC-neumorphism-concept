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

function setMedia(attachment) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		var mediaSrc = this.responseText;
		$(attachment).src = mediaSrc;
	}
	xhttp.open("GET", "https://api.stibarc.com/getimage.sjs?id=" + attachment, true);
	xhttp.send();
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
		var date = formatDate(item["postdate"]);

		var comments = "0 comments";
		if (item["comments"] == 1) {
			comments = "1 comment";
		} else if (item["comemnts"] > 0) {
			comments = item["comments"] + " comments";
		}
		var media = '';
		var images = ["png", "jpg", "gif", "webp", "svg"];
		var videos = ["mov", "mp4", "m4a", "webm"];
		var audio = ["spx", "m3a", "wma", "wav", "mp3"];
		if (
			item["real_attachment"] != undefined &&
			item["real_attachment"] != "" &&
			item["real_attachment"] != "none"
		) {
			contentClass = "has-media";
			var mediaDiv = document.createElement("div");
			media = document.createElement("div");
			media.setAttribute("class", "post-media");
			var ext = item["real_attachment"].split(".")[1];
			var src = "https://cdn.stibarc.com/images/" + item["real_attachment"];
			if (images.indexOf(ext) != -1) {
				//media = '<div class="post-media"><img src="' + src + '"></div>';
				var img = document.createElement("img");
				img.setAttribute("src", src);
				media.appendChild(img);
			} else if (videos.indexOf(ext) != -1) {
				//media = '<div class="post-media"><video id="'+ item["attachment"] +'"></video></div>';
				var video = document.createElement("video");
				var source = document.createElement("source");
				source.setAttribute("src", src);
				source.setAttribute("id", item["attachment"]);
				video.appendChild(source);
				media.appendChild(video);
				setMedia(item["attachment"]);
			} else if (audio.indexOf(ext) != -1) {
				//media = '<a style="color:white" href="https://cdn.stibarc.com/images/' + src + '"><div class="post-media"><img src="./assets/images/music.png"></div></a>';
				var link = document.createElement("a");
				link.setAttribute("href", src);
				var img = document.createElement("img");
				img.setAttribute("src", "./assets/images/music.png");
				var embed = link.appendChild(media);
				embed.appendChild(img);
				media = embed;
			}
			mediaDiv.appendChild(media);
			media = mediaDiv.innerHTML;
		}
		postsHTML +=
			'<div> <div class="post"> <div class="post-votes"><img class="vote up" src="./assets/images/up.png">' +
			item["upvotes"] +
			'<img class="vote down" src="./assets/images/down.png">' +
			item["downvotes"] +
			'</div> <h2 class="post-title">' +
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
		for (var i = totalPosts; i > totalPosts - 12; i--) {
			toLink(i, tmp[i]);
		}
		$("posts").innerHTML = postsHTML;
	};
	xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs", true);
	xhttp.send();
}

loadPosts();
