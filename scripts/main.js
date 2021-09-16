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
	update_href()
}

function update_href(){
	new_link = ""
	Object.keys(args).forEach(function (key){
		if (key == "characteristics"){
			new_link += `?${key}=${JSON.stringify(args[key])}`
		}
		else{
			new_link += `?${key}=${args[key]}`
		}
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
	if (first_time){
		if (args.hasOwnProperty("characteristics")){
			args['characteristics'] = eval(args['characteristics'])
			characteristics = args['characteristics']
			for (i=0; i < args['characteristics'].length; i++) {
				add_new_tth(
					image = args['characteristics'][i]['icon'],
					title = args['characteristics'][i]['name'],
					value = args['characteristics'][i]['value']
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


characteristics = []
window.onload = async function(){
	first_time = true;
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
