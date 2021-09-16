function share(){
	navigator.clipboard.writeText(window.location.href + "?share")
	alert("Ссылка скопирована!")
}

function change(arg) {
	if (arg == "name"){
		document.getElementById('name').innerHTML = document.getElementById('input_name').value;
		args["name"] = document.getElementById('input_name').value;
	}
	if (arg == "image"){
		document.getElementById('main_img').src = document.getElementById('input_image').value;
		args["image"] = document.getElementById('input_image').value;
	}
	if (arg == "stars"){
		document.getElementById('stars').innerHTML = ""
		for (i=0; i < document.getElementById('input_stars').value; i++) {
			document.getElementById('stars').innerHTML += '<img src="https://rerollcdn.com/SDSGC/ui/skill_star.png">'
		}
		args["stars"] = document.getElementById('input_stars').value;
	}
	update_href()
}

function update_href(){
	new_link = ""
	Object.keys(args).forEach(function (key){
		new_link += `?${key}=${args[key]}`
	});
	location.hash = new_link
}

function load_args(){
	params = window.location.href.split("?").slice(1)
	args = {}
	for (i = 0; i < params.length; i++) {
		temp = params[i].split("=")
		args[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1])
	}
	if (args.hasOwnProperty("name")){
		document.getElementById('name').innerHTML = args['name']
		document.getElementById('input_name').value = args['name']
	}
	if (args.hasOwnProperty("image")){
		document.getElementById('main_img').src = args['image']
		document.getElementById('input_image').value = args['image']
	}
	if (args.hasOwnProperty("stars")){
		document.getElementById('input_stars').value = args['stars']
		document.getElementById('stars').innerHTML = ""
		for (i=0; i < args['stars']; i++) {
			document.getElementById('stars').innerHTML += '<img src="https://rerollcdn.com/SDSGC/ui/skill_star.png">'
		}
	}
}

window.onload = async function(){
	await load_args()
	if (args.hasOwnProperty("share")){
		document.getElementById("share").style.display = "none";
		document.getElementById("card_area").style.display = "block";
		document.getElementById('card_area').style.textAlign = "center";
		document.getElementById('card_area').style.transform = "scale(0.9)";
	}
	else{
		document.getElementById("constructor").style.display = "block";
		document.getElementById("share").style.display = "block";
	}
	document.getElementById("card").style.opacity = "1";
	document.getElementById("card_front").style.transform = "rotateY(0deg)"
	document.getElementById("card_back").style.transform = "rotateY(-180deg)"

	window.addEventListener("hashchange", function(){load_args();});
}
