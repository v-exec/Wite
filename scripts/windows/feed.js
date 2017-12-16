var postNum = 0;

//load profile
function loadProfile() {
	//load json file
	readJSON("scripts/windows/feed.json", function(text) {
		var myFeed = JSON.parse(text);
		if (myFeed) {
			loadFeeds(myFeed);
		}
	});
}

//loads feeds
function loadFeeds(myFeed) {
	var following = myFeed.portal;

	var feedline = document.getElementById('feedline');
	var timeline = document.createElement('div');
	timeline.setAttribute('id', 'timeline');

	//for every feed
	for (var i = 0; i < following.length; i++) {

		//check both http and https
		readJSON("//" + following[i], function(text) {
			if (text != null) {
				var user = JSON.parse(text);
				loadPosts(user);
			}
		});
	}

	feedline.append(timeline);
}

//loads all posts of a user
function loadPosts(user) {


	//check if user has feed
	if (user.feed) {
		//limit post count to 30
		var postCount = user.feed.length;
		if (postCount > 30) postsCount = 30;

		var posts = user.feed;

		//for each post
		for (var i = 0; i < postCount; i++) {
			var listEntry = document.createElement('li');
			listEntry.className = 'post';

			//post
			var post = document.createElement('div');
			post.className = 'user-entry';

			//media
			if (posts[i].media) {
				if (posts[i].media.indexOf('youtube') !== -1) {
					//video
					var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					var match = posts[i].media.match(regExp);

					var video = document.createElement('iframe');
					video.src = 'https://www.youtube-nocookie.com/embed/' + match[2] + '?rel=0&amp;showinfo=0"';
					video.className = 'post-video';
					post.append(video);
				} else {
					//image
					var image = document.createElement('img');
					image.src = posts[i].media;
					image.className = 'post-image';
					post.append(image);
				}
			}

			//text
			if (posts[i].text) {
				var text = document.createElement('p');
				var textContent = document.createTextNode(posts[i].text);
				text.append(textContent);
				post.append(text);
			}

			//append post entry
			listEntry.append(post);

			//divider
			var divider = document.createElement('div');
			divider.className = 'divider';
			listEntry.append(divider);

			//footer
			var footer = document.createElement('div');
			footer.className = 'user-footer';

			//pic
			if (user.profile.avatar) {
				var avatar = document.createElement('img');
				avatar.src = user.profile.avatar;
				avatar.className = 'avatar';
				footer.append(avatar);
			}

			//user info
			var userInfo = document.createElement('ul');
			userInfo.className = 'user-info';

			var nameAndLocation = document.createElement('li');
			nameAndLocation.className = 'user-info-item';

			//username
			if (user.profile.name) {
				var userName = document.createElement('span');
				userName.className = 'user-name';
				var userNameText = document.createTextNode(user.profile.name);
				userName.append(userNameText);
				nameAndLocation.append(userName);
			}

			//location
			if (user.profile.location) {
				var location = document.createElement('span');
				location.className = 'user-location';
				var locationText = document.createTextNode(' from ' + user.profile.location);
				location.append(locationText);
				nameAndLocation.append(location);
			}

			userInfo.append(nameAndLocation);

			//time
			if (posts[i].time) {
				var timeHolder = document.createElement('li');
				timeHolder.className = 'time';

				var newDate = new Date();
				newDate.setTime(posts[i].time*1000);
				dateString = newDate.toUTCString();

				var time = document.createTextNode(dateString);
				timeHolder.append(time);

				listEntry.setAttribute('postTime', posts[i].time);
			}

			//toggle
			var toggle = document.createElement('a');
			var toggleSymbol = document.createTextNode('~');
			toggle.append(toggleSymbol);
			toggle.className = 'toggle';

			//toggle json origin (using closure to keep postNum)
			(function (postNum) {
				toggle.onclick = (function() {
					var currentPost = postNum;
					var jsonOrigin = document.getElementById("json_" + currentPost);
					if (jsonOrigin.style.display == "none") jsonOrigin.style.display = "block";
					else jsonOrigin.style.display = "none";
				});
			})(postNum);

			timeHolder.append(toggle);
			userInfo.append(timeHolder);

			//link
			if (posts[i].url) {
				var url = document.createElement('a');
				var urlText = document.createTextNode('link');
				url.append(urlText);
				url.href = posts[i].url;
				url.style = "color:" + user.profile.color;
				url.className = 'post-link';
				footer.append(url);
			}

			//source
			var source = document.createElement('div');
			source.className = 'json-source';
			source.id = 'json_' + postNum;
			source.style = 'display: none';
			var sourceText = document.createTextNode(JSON.stringify(posts[i]));
			source.append(sourceText);

			//append user info
			footer.append(userInfo);

			//append source data
			footer.append(source);

			//append footer
			listEntry.append(footer);

			//append post
			timeline.append(listEntry);

			orderPosts();

			postNum++;
		}
	}
}

//reads JSON file
function readJSON(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType('application/json');
	rawFile.withCredentials = false;
	rawFile.open('GET', file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == 200) {
			callback(rawFile.responseText);
		} else if (rawFile.readyState === 4) {
			//if load didn't work, try to request url with https protocol
			readJSONEncrypted(file, function(text) {
				callback(text);
			});
		}
	}
	rawFile.send();
}

//reads JSON file with https protocol
function readJSONEncrypted(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType('application/json');
	rawFile.withCredentials = false;
	rawFile.open('GET', 'https:' + file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == 200) {
			callback(rawFile.responseText);
		} else if (rawFile.readyState === 4) {
			callback(null);
		}
	}
	rawFile.send();
}

//orders posts
function orderPosts() {
	var timeline = document.getElementById('timeline');
	var children = timeline.children;

	//call array method to slice children into actual array
	var properChildren = [].slice.call(children);

	properChildren.sort(function (a, b) {
		if (a.getAttribute('postTime') == b.getAttribute('postTime')) return 0;
		return (a.getAttribute('postTime') > b.getAttribute('postTime')) ? -1 : 1;
	});

	for (i = 0; i < properChildren.length; i++) {
		timeline.appendChild(properChildren[i]);
	}
}