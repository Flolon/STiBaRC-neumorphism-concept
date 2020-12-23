function $(id) {
	if (id.startsWith(".")) {
		return document.getElementsByClassName(id.substring(1));
	} else {
		return document.getElementById(id);
	}
}

function toTwo(num) {
	var tmp = "";
	var tmp2 = num.toString();
	if (tmp2.length >= 2) {
		tmp = tmp2;
	} else {
		tmp = "0" + tmp2;
	}
	return tmp;
}

function toDate(date) {
	var datetmp = date.split(" ");
	var timetmp = datetmp[0].split(":");
	var hours = parseInt(timetmp[0]);
	var minutes = parseInt(timetmp[1]);
	if (datetmp[1] == "PM") {
		if (hours != 12) {
			hours = hours + 12;
		}
	} else {
		if (hours == 12) {
			hours = 0;
		}
	}
	var datetmptmp = datetmp[3].split("/");
	var month = parseInt(datetmptmp[0]);
	var day = parseInt(datetmptmp[1]);
	var year = parseInt(datetmptmp[2]);
	var offsetCalc = new Date(
		year +
			"-" +
			toTwo(month) +
			"-" +
			toTwo(day) +
			"T" +
			toTwo(hours) +
			":" +
			toTwo(minutes) +
			":00"
	);
	return offsetCalc;
}

function getDayOfWeek(date) {
	const dayOfWeek = new Date(date).getDay();
	return isNaN(dayOfWeek)
		? null
		: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
		  ][dayOfWeek];
}

var emojiIndex = {};
if (
	localStorage.getItem("emojiIndex") !== null &&
	localStorage.getItem("emojiIndex") !== ""
) {
	emojiIndex = JSON.parse(localStorage.getItem("emojiIndex"));
}

function emojiHTML(emoji) {
	return (
		'<img src="https://cdn.stibarc.com/emojis/' +
		emojiIndex[emoji].filename +
		'" class="emoji" title=":' +
		emoji +
		':" alt=":' +
		emoji +
		':">'
	);
}

function updateEmojiIndex(callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		emojiIndex = JSON.parse(this.responseText);
		localStorage.setItem("emojiIndex", this.responseText);
		if (callback == "post") {
			emojisReplace(emojiIndex);
		}
	};
	xhttp.open("GET", "https://cdn.stibarc.com/emojis/index.json", true);
	xhttp.send(null);
}