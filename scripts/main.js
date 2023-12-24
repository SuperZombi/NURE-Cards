//server = 'https://nure-cards.herokuapp.com'
server = 'https://nure-cards.superzombi.repl.co'

function replaceURI(text){
	let t = text.replaceAll(" ", "%20");
	t = t.replaceAll("<", "%3C");
	t = t.replaceAll(">", "%3E");
	return t;
}
function copyToClipboard(text) {
	const elem = document.createElement('textarea');
	elem.value = replaceURI(text);
	document.body.appendChild(elem);
	elem.select();
	document.execCommand('copy');
	document.body.removeChild(elem);
}
async function share(){
	//navigator.clipboard.writeText(window.location.href + "?share")
	copyToClipboard(decodeURI(window.location.href + "?share"))
	await notice.Success("Ссылка скопирована!")
}
async function share_short(){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", `${server}/short_link`)
	xhr.timeout = 3000;
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({
		'link': decodeURI(window.location.href + "?share"),
	}))
	xhr.onload = async function() {
		if (xhr.status != 200){await notice.Error("Ошибка создания ссылки!")}
		else{
			answer = JSON.parse(xhr.response)
			if (!answer.successfully){await notice.Error("Ошибка создания ссылки!")}
			else{
				copyToClipboard(answer.link)
				await notice.Success("Ссылка скопирована!")
			}			
		}
	}
	xhr.ontimeout = async function() {await notice.Error("Ошибка создания ссылки!")};
	xhr.onerror = async function() {await notice.Error("Ошибка создания ссылки!")};
}

async function server_status(){
	if (menu_active){
		let xhr = new XMLHttpRequest();
		xhr.open("GET", `${server}/status`)
		xhr.timeout = 2000;
		var init = Date.now();
		xhr.send()

		st = document.getElementById("server_status")

		xhr.onload = function() {
			if (xhr.status != 200){
				st.innerHTML = "Server: Offline"
				st.style.color = "red"
			}
			else{
				var load = Date.now();
				answer_status = JSON.parse(xhr.response)
				ping = parseInt(load - init)
				st.innerHTML = `Server: ${ping}ms`
				st.style.color = "lightgreen"
			}
		}
		xhr.ontimeout = function() {
			st.innerHTML = "Server: Offline"
			st.style.color = "red"
		};
		xhr.onerror = function() {
			st.innerHTML = "Server: Offline"
			st.style.color = "red"
		};
		setTimeout(function(){ server_status() }, 5000)
	}
}

register = false
function register_(val){
	register = val
}
async function login_background(name, password){
	let json = JSON.stringify({
		'name': name,
		'password': password
	});

	let xhr = new XMLHttpRequest();
	xhr.open("POST", `${server}/login`)
	xhr.timeout = 5000;
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(json)
	xhr.onload = function() {
		if (xhr.status != 200){
			document.getElementById("status_text").innerHTML = "Ошибка авторизации!"
		}
		else{
			answer = JSON.parse(xhr.response)
			if (!answer.successfully){
				document.getElementById("status_text").innerHTML = "Ошибка авторизации!</br>"+answer.reason
			}
			else{
				document.getElementById("login_form").style.display = "none";
				document.getElementById("user_name").innerHTML = name
				document.getElementById("user").style.display = "block"
				document.getElementById("save_but").style.display = "inline-block"
			}			
		}
	}
	xhr.ontimeout = function() {
		document.getElementById("status_text").innerHTML = "Ошибка авторизации!"
	};
	xhr.onerror = function() {
		document.getElementById("status_text").innerHTML = "Ошибка авторизации!"
	};
}
async function login(x){
	try{ answer_status.online }
	catch{
		document.getElementById("status_text").innerHTML = "Сервер отключен!"
		return
	}
	if (answer_status.online){
		status_anim = document.getElementById("status_animation")
		status_anim.style.display = "block"
		if (register){
			document.getElementById("status_text").innerHTML = "Регистрация..."
			type_ = "register"
		}
		else{
			document.getElementById("status_text").innerHTML = "Вход..."
			type_ = "login"
		}
		els = x.getElementsByTagName("input");
		name = els[0].value;
		password = els[1].value;
		if (name.includes('"')){
			document.getElementById("status_text").innerHTML = "Запрещённый символ в нике!"
			status_anim.style.display = "none"
			return
		}
		var passhash = CryptoJS.MD5(password).toString();

		let json = JSON.stringify({
			'name': name,
			'password': passhash
		});

		let xhr = new XMLHttpRequest();
		xhr.open("POST", `${server}/${type_}`)
		xhr.timeout = 5000;
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(json)
		xhr.onload = function() {
			if (xhr.status != 200){
				document.getElementById("status_text").innerHTML = "Ошибка!"
				setTimeout(function(){status_anim.style.display = "none"}, 2500)
			}
			else{
				answer = JSON.parse(xhr.response)
				setTimeout(function() {	
					if (!answer.successfully){
						document.getElementById("status_text").innerHTML = answer.reason
						status_anim.style.display = "none"
					}
					else{
						localStorage.setItem('name', name);
						localStorage.setItem('password', passhash);
						x.style.display = "none";
						document.getElementById("status_text").innerHTML = ""
						status_anim.style.display = "none"
						document.getElementById("user_name").innerHTML = name
						document.getElementById("user").style.display = "block"
						document.getElementById("save_but").style.display = "inline-block"
					}
				}, 500)				
			}
		}
		xhr.ontimeout = function() {
			document.getElementById("status_text").innerHTML = "Ошибка!"
			setTimeout(function(){status_anim.style.display = "none"}, 2500)
		};
		xhr.onerror = function() {
			document.getElementById("status_text").innerHTML = "Ошибка!"
			setTimeout(function(){status_anim.style.display = "none"}, 2500)
		};
	}
}
async function logout(){
	localStorage.clear();

	document.getElementById("login_form").style.display = "block";
	els = document.getElementById("login_form").getElementsByTagName("input");
	els[0].value = "";
	els[1].value = "";

	document.getElementById("user").style.display = "none"
	document.getElementById("save_but").style.display = "none"
}


async function save_card_root(){
	let name = localStorage.getItem('name');
	let password = localStorage.getItem('password');
	let json = JSON.stringify({
		'name': name,
		'password': password,
		'card_name': document.getElementById("input_name").value,
		'card_image': document.getElementById("input_image").value,
		'card_body': window.location.href.split(window.location.href.split("?")[0])[1]
	});

	let xhr = new XMLHttpRequest();
	xhr.open("POST", `${server}/save_card`)
	xhr.timeout = 5000;
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(json)
	xhr.onload = async function() {
		if (xhr.status != 200){
			await notice.Error("Ошибка сервера!")
		}
		else{
			answer = JSON.parse(xhr.response)
			if (!answer.successfully){
				await notice.Error("Ошибка!")
			}
			else{
				await notice.Success("Сохранено!")
			}
		}
	}
	xhr.ontimeout = async function() {
		await notice.Error("Ошибка сервера!")
	};
	xhr.onerror = async function() {
		await notice.Error("Ошибка сервера!")
	};
}
async function save_card(){
	let name = localStorage.getItem('name');
	let password = localStorage.getItem('password');
	if (name && password){
		if (document.getElementById("input_name").value){
			if (document.getElementById("input_image").value){
				let json1 = JSON.stringify({
					'name': name,
					'card_name': document.getElementById("input_name").value
				});
				let xhr1 = new XMLHttpRequest();
				xhr1.open("POST", `${server}/card_exist`)
				xhr1.timeout = 5000;
				xhr1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
				xhr1.send(json1)
				xhr1.onload = async function() {
					if (xhr1.status != 200){
						await notice.Error("Ошибка сервера!")
					}
					else{
						answer1 = JSON.parse(xhr1.response)
						if (answer1.exist){
							await notice.Warning("Такая карточка уже существует!</br>Заменить?", false, [['Да', save_card_root], 'Нет'])
						}
						else{
							save_card_root()
						}
					}
				}
				xhr1.ontimeout = async function() {
					await notice.Error("Ошибка сервера!")
				};
				xhr1.onerror = async function() {
					await notice.Error("Ошибка сервера!")
				};
			}
			else{
				await notice.Error("У карточки нет картинки!")
			}
		}
		else{
			await notice.Error("У карточки нет названия!")
		}
	}
	else{
		await notice.Error("Войдите в аккаунт!")
	}
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
			document.getElementById('stars').innerHTML += '<img src="images/skill_star.png">'
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
			new_link += `?${key}=${JSON.stringify(args[key]).replaceAll("'", "\\'").replaceAll("\"", "'")}`
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
	}, 450);
}

function load_args(){
	params = window.location.href.split("?").slice(1)
	args = {}
	for (i = 0; i < params.length; i++) {
		temp = params[i].split("=")
		args[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1])
	}
	if (args.hasOwnProperty("user") && args.hasOwnProperty("card")){
		let json = JSON.stringify({
			'user': args['user'],
			'card': args['card']
		});
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `${server}/get_card`)
		xhr.timeout = 5000;
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(json)
		xhr.onload = async function() {
			if (xhr.status != 200){
				await notice.Error("Ошибка сервера!")
				if (!args.hasOwnProperty("share")){window.location.hash = ""}
			}
			else{
				answer = JSON.parse(xhr.response)
				if (answer.successfully){
					if (args.hasOwnProperty("share")){
						window.location.href = "index.html#" + answer.card_body + "?share"
						window.location.reload()
					}
					else{
						window.location.href = "index.html#" + answer.card_body
						window.location.reload()
					}
				}
				else{
					await notice.Error("Карточка не найдена!", false)
					if (!args.hasOwnProperty("share")){window.location.hash = ""}	
				}
			}
		}
		xhr.ontimeout = async function() {
			await notice.Error("Ошибка сервера!")
			if (!args.hasOwnProperty("share")){window.location.hash = ""}	
		};
		xhr.onerror = async function() {
			await notice.Error("Ошибка сервера!")
			if (!args.hasOwnProperty("share")){window.location.hash = ""}	
		};
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
			document.getElementById('stars').innerHTML += '<img src="images/skill_star.png">'
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




var timout_menu;
menu_active = false;
async function show_menu() {
	menu_active = true;
	window.scrollTo(0, 0)
	but = document.getElementsByClassName("menu_but")[0]
	but.className = "menu_but menu_active"
	but.title = "Закрыть"
	but.onclick = close_menu

	document.getElementById("menu").style.display = "block"
	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	setTimeout(function() {
		document.getElementById("menu").className = "menu_showed"
	},0)
	
	document.body.style.overflow = "hidden"
	other = document.getElementById("other").style
	other.pointerEvents = "none";
	other.userSelect = "none";
	if (window.innerWidth > 850){
		timout_menu = setTimeout(function(){
			other.filter = "blur(4px)";
		},300)
	}

	server_status()
}
async function close_menu(){
	menu_active = false;
	but = document.getElementsByClassName("menu_but")[0]
	but.className = "menu_but"
	but.title = "Меню"
	but.onclick = show_menu

	document.getElementById("menu").className = ""
	
	other = document.getElementById("other").style
	other.pointerEvents = "auto";
	other.filter = "blur(0px)";
	other.userSelect = "auto";
	document.body.style.overflow = "auto"


	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	timout_menu = setTimeout(function(){
		document.getElementById("menu").style.display = "none"
	}, 500);
}



characteristics = []
pasives = []
window.onload = async function(){
	notice = new Notifications('#notifications');
	
	first_time = true;
	await load_args()
	if (args.hasOwnProperty("share")){
		document.title = args["name"] + " - NURE Cards"
		document.getElementById("card_area").style.display = "block";
		document.getElementById('card_area').style.textAlign = "center";
		document.getElementById('card_area').style.transform = "scale(0.95)";
		document.getElementById('card_area').style.marginBottom = "20px";
		ads_ = document.getElementById("ads").style
		ads_.display = "block";
		ads_.opacity = 0;
		setTimeout(function() {
			window.addEventListener("scroll", function(){ check_scroll() });
			check_scroll()
		}, 2000)
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

	if (args.hasOwnProperty("share")){}
	else{
		let name = localStorage.getItem('name');
		let password = localStorage.getItem('password');
		if (name && password){
			login_background(name, password)
		}
	}


	var details = document.querySelectorAll('div.transition');
	Object.keys(details).forEach(function (key){
		details[key].onclick = function(){return false;}
	})

	setTimeout(function(){window.scrollTo(0, 0)}, 0)
}
function check_scroll() {
	ads_ = document.getElementById("ads").style;
	if (window.innerWidth > 850){
		if(window.scrollY + window.innerHeight + 10 >= document.documentElement.scrollHeight) {
			ads_.opacity = "";
			ads_.transform = "translateY(0)";
		}
		else{
			ads_.opacity = 0;
			ads_.transform = "translateY(60px)";
		}
	}
	else{
		if(window.scrollY + window.innerHeight + 60 >= document.documentElement.scrollHeight) {
			ads_.opacity = "";
			ads_.transform = "translateY(0)";
		}
		else{
			ads_.opacity = 0;
			ads_.transform = "translateY(60px)";
		}
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
