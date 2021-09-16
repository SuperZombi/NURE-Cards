function change(arg) {
	if (arg == "name"){
		document.getElementById('name').innerHTML = document.getElementById('input_name').value;
	}
	if (arg == "image"){
		document.getElementById('main_img').src = document.getElementById('input_image').value;
	}
	if (arg == "stars"){
		document.getElementById('stars').innerHTML = ""
		for (i=0; i < document.getElementById('input_stars').value; i++) {
			document.getElementById('stars').innerHTML += '<img src="https://rerollcdn.com/SDSGC/ui/skill_star.png">'
		}
	}
}