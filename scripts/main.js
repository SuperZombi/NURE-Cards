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
	if (arg == "characteristics"){
		cleanArray = []
		Object.keys(characteristics).forEach(function (key){
			temp = Object.values(characteristics[key]).filter(word => word != "")
			if (temp.length > 0){
				cleanArray.push(characteristics[key])
			}
		})
		if (cleanArray.length > 0){
			args["characteristics"] = cleanArray
		}
		else{
			delete args["characteristics"]
		}
	}
	if (arg == "pasives"){
		cleanArray = []
		Object.keys(pasives).forEach(function (key){
			temp = Object.values(pasives[key]).filter(word => word != "")
			if (temp.length > 0){
				cleanArray.push(pasives[key])
			}
		})
		if (cleanArray.length > 0){
			args["pasives"] = cleanArray
		}
		else{
			delete args["pasives"]
		}
	}
	update_href()
}


var timout_id;
function update_href(){
	new_link = ""
	Object.keys(args).forEach(function (key){
		if (key == "characteristics" || key == "pasives"){
			new_link += `?${key}=${JSON.stringify(args[key])}`
		}
		else{
			new_link += `?${key}=${args[key]}`
		}
	});
	if (timout_id) {
		clearTimeout(timout_id);
	}
	timout_id = setTimeout(function(){
		location.hash = new_link
	}, 1000);
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
	if (args.hasOwnProperty("characteristics")){
		args['characteristics'] = eval(args['characteristics'])
		characteristics = args['characteristics']
	}
	if (args.hasOwnProperty("pasives")){
		args['pasives'] = eval(args['pasives'])
		pasives = args['pasives']
	}
	if (first_time){
		if (args.hasOwnProperty("characteristics")){
			for (i=0; i < args['characteristics'].length; i++) {
				add_new_tth(
					image = args['characteristics'][i]['icon'],
					title = args['characteristics'][i]['name'],
					value = args['characteristics'][i]['value']
				)
			}
		}

		if (args.hasOwnProperty("pasives")){
			for (i=0; i < args['pasives'].length; i++) {
				add_new_passive(
					image_ico = args['pasives'][i]['icon'],
					description = args['pasives'][i]['description']
				)
			}
		}
	}
	first_time = false;
}

iterator_tth = 0;
function add_new_tth(image="", title="", value=""){
	image_1 = ""
	if (image){
		image_1 = `<img src="${image}">`
	}
	iterator_tth += 1;
	var tr2 = document.createElement('tr')
	tr2.innerHTML = `
	<tr>
		<td>${image_1}</td>
		<td>${title}</td>
		<td>${value}</td>
	</tr>`
	document.getElementById('characteristics').appendChild(tr2)

	function temp(className, x) {
		var td1 = document.createElement('td')
		var cur_i = iterator_tth
		td1.className = className
		input = document.createElement('input')
		input.onkeyup = function(){edit(tr2, td1, cur_i)}
		input.value = x
		td1.appendChild(input)
		tr.appendChild(td1)
	}

	tr = document.createElement('tr')
	temp("icon", image)
	temp("characteristic_name", title)
	temp("characteristic_value", value)

	td = document.createElement('td')
	td.className = "minus"
	td.innerHTML = `<span title="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>`
	td.onclick = function(){
		this.parentNode.remove();
		tr2.remove();
		delete_from_arr(this.parentNode)
	}
	tr.appendChild(td)
	tr.setAttribute('i', iterator_tth)
	document.getElementById('const_base_characteristics').appendChild(tr)
}
function delete_from_arr(i){
	delete characteristics[i.getAttribute("i")-1]
	change("characteristics")
}
function edit(argument1, argument2, iter) {
	dst1 = argument1.getElementsByTagName('td')

	if (argument2.className == "icon"){
		dst1[0].innerHTML = `<img src="${argument2.getElementsByTagName('input')[0].value}">`
	}
	if (argument2.className == "characteristic_name"){
		dst1[1].innerHTML = argument2.getElementsByTagName('input')[0].value
	}
	if (argument2.className == "characteristic_value"){
		dst1[2].innerHTML = argument2.getElementsByTagName('input')[0].value
	}

	try{
		img = dst1[0].getElementsByTagName('img')[0].src
	}
	catch{ img = "" }
	characteristics[iter-1] = {"name":dst1[1].innerHTML, "value":dst1[2].innerHTML, "icon":img}	
	change("characteristics")
}


iterator_pas = 0;
function add_new_passive(image_ico="", description=""){
	image_2 = ""
	if (image_ico){
		image_2 = `<img src="${image_ico}">`
	}
	iterator_pas += 1;
	var tr2 = document.createElement('tr')
	tr2.innerHTML = `
	<tr>
		<td>${image_2}</td>
		<td>${description}</td>
	</tr>`
	document.getElementById('pasives').appendChild(tr2)

	function temp(className, x) {
		var td1 = document.createElement('td')
		var cur_i = iterator_pas
		td1.className = className
		input = document.createElement('input')
		input.onkeyup = function(){edit2(tr2, td1, cur_i)}
		input.value = x
		td1.appendChild(input)
		tr.appendChild(td1)
	}

	tr = document.createElement('tr')
	temp("icon", image_ico)
	temp("description", description)

	td = document.createElement('td')
	td.className = "minus"
	td.innerHTML = `<span title="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg></span>`
	td.onclick = function(){
		this.parentNode.remove();
		tr2.remove();
		delete_from_arr2(this.parentNode)
	}
	tr.appendChild(td)
	tr.setAttribute('i', iterator_pas)
	document.getElementById('const_passives').appendChild(tr)	
}
function delete_from_arr2(i){
	delete pasives[i.getAttribute("i")-1]
	change("pasives")
}
function edit2(argument1, argument2, iter) {
	dst1 = argument1.getElementsByTagName('td')

	if (argument2.className == "icon"){
		dst1[0].innerHTML = `<img src="${argument2.getElementsByTagName('input')[0].value}">`
	}
	if (argument2.className == "description"){
		dst1[1].innerHTML = argument2.getElementsByTagName('input')[0].value
	}

	try{
		img = dst1[0].getElementsByTagName('img')[0].src
	}
	catch{ img = "" }
	pasives[iter-1] = {"description":dst1[1].innerHTML, "icon":img}	
	change("pasives")
}

function go_to_editor(){
	window.location.href = window.location.href.split("?share")[0]
	location.reload()
}


characteristics = []
pasives = []
window.onload = async function(){
	first_time = true;
	await load_args()
	if (args.hasOwnProperty("share")){
		document.title = args["name"] + " - NURE Cards"
		document.getElementById("card_area").style.display = "block";
		document.getElementById('card_area').style.textAlign = "center";
		document.getElementById('card_area').style.transform = "scale(0.95)";
		ads_ = document.getElementById("ads").style
		ads_.display = "block";
		ads_.opacity = 0;
		setTimeout(function() {
			window.addEventListener("scroll", function(){ check_scroll() });
			check_scroll()
		}, 3000)
	}
	else{
		document.getElementById("constructor").style.display = "block";
		document.getElementById("header").style.display = "block";
	}
	document.getElementById("card").style.opacity = "1";
	document.getElementById("card_front").style.transform = "rotateY(0deg)"
	document.getElementById("card_back").style.transform = "rotateY(-180deg)"

	window.addEventListener("hashchange", function(){load_args();});
	window.addEventListener("resize", function(){ check_widht() });
	check_widht()
}
function check_scroll() {
	ads_ = document.getElementById("ads").style;
	if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
		ads_.opacity = "";
		ads_.transform = "translateY(0)";
	}
	else{
		ads_.opacity = 0;
		ads_.transform = "translateY(60px)";
	}
}

function check_widht(){
	if (window.innerWidth > 850){
		document.getElementById("card_front").style.maxWidth = "410px";
		document.getElementById("card").style.margin = "10px";
	}
	else{
		document.getElementById("card_front").style.maxWidth = "100vw";
		document.getElementById("card").style.margin = "0";
	}	
}
