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
		var media = document.createElement("div");
		var video = document.createElement("video");
		video.setAttribute("muted", null);
		var source = document.createElement("source");
		source.setAttribute("src", mediaSrc);
		video.appendChild(source);
		media.appendChild(video);
		
		$(attachment).innerHTML = "";
		$(attachment).appendChild(media);
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
			var mediaDiv = document.createElement("div");
			media = document.createElement("div");
			media.setAttribute("class", "post-media");
			var ext = item["real_attachment"].split(".")[1];
			var src = "https://cdn.stibarc.com/images/" + item["real_attachment"];
			if (images.indexOf(ext) != -1) {
				var img = document.createElement("img");
				img.setAttribute("src", src);
				media.appendChild(img);
			} else if (videos.indexOf(ext) != -1) {
				media.setAttribute("id", item["attachment"]);
				var loading = document.createElement("h3");
				loading.innerHTML = "<br><center>Loading...</center>";
				media.appendChild(loading);
				setMedia(item["attachment"]);
			} else if (audio.indexOf(ext) != -1) {
				var link = document.createElement("a");
				link.setAttribute("href", src);
				link.setAttribute("target", "_blank");
				var img = document.createElement("img");
				img.setAttribute("src", "./assets/images/music.png");
				link.appendChild(img);
				media.appendChild(link);
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
