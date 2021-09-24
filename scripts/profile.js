server = 'https://nure-cards.herokuapp.com'

function _404(){
	document.getElementById("not_found").style.display = "block"
	document.onmousemove = function(e){
		var targetNode = document.getElementById("404");
		let centerX = targetNode.offsetLeft + targetNode.offsetWidth / 2;
		let centerY = targetNode.offsetTop + targetNode.offsetHeight / 2;

		x1 = (centerX - e.x) /10;
		y1 = (centerY - e.y) /10;

		if (x1 > 30) { x1 = 30 }
		if (y1 > 30){ y1 = 30 }
		if (x1 < -30) { x1 = -30 }
		if (y1 < -30){ y1 = -30 }
			
		document.getElementById("404").style.filter = `drop-shadow(${x1}px ${y1}px 20px grey)`;
	}	
}
function server_error(){
	document.getElementById("not_found").getElementsByTagName("p")[0].innerHTML = "Ошибка сервера!"
	document.getElementById("not_found").getElementsByTagName("h1")[0].style.display = "none"
	document.getElementById("not_found").getElementsByTagName("img")[0].style.display = "inline-block"
	document.getElementById("not_found").style.display = "block"
}
function ckeck_none(){
	if (document.getElementById("user_cards").innerHTML == ""){
		document.getElementById("user_cards").innerHTML = `<h2 id="empty">Тут пусто   ¯\\_(ツ)_/¯</h2>`
	}
}
function load_cards(user) {
	document.getElementById("user_cards").innerHTML = `<div class="card loading"></div>`.repeat(5)
	let xhr = new XMLHttpRequest();
	xhr.open("POST", `${server}/user_cards`)
	xhr.timeout = 5000;
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'user': user}))
	xhr.onload = function() {
		if (xhr.status == 200){
			array = JSON.parse(xhr.response)['cards']
			setTimeout(function(){
				document.getElementById("user_cards").innerHTML = ""
				Object.keys(array).forEach(card_name => {
					var image = array[card_name]['image']

					var div = document.createElement('div')
					div.className = "card"
					div.title = card_name
					div.onclick = function() {show(card_name, div)}
					div.innerHTML = `
						<div class="img_zone loading">
							<img src="${image}">
						</div>
						<div class="card_name">${card_name}</div>
					`
					div.getElementsByTagName("img")[0].onload = function() {
						setTimeout(function(){div.getElementsByClassName("img_zone")[0].classList.remove("loading")}, 500)
					}
					document.getElementById("user_cards").appendChild(div)
				});

				ckeck_none()
			}, 800)
		}
		else{
			document.getElementById("user_cards").innerHTML = ""
			server_error()
		}
	}
	xhr.ontimeout = function() {
		document.getElementById("user_cards").innerHTML = ""
		server_error()
	};
	xhr.onerror = function() {
		document.getElementById("user_cards").innerHTML = ""
		server_error()
	};
}
function load_args(){
	params = window.location.href.split("?").slice(1)
	args = {}
	for (i = 0; i < params.length; i++) {
		temp = params[i].split("=")
		args[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1])
	}
	if (args.hasOwnProperty("user")){
		load_user_info(args["user"])
	}
	else{
		load_my_info()
	}
}
function load_user_info(user){
	let xhr = new XMLHttpRequest();
	xhr.open("POST", `${server}/user_exists`)
	xhr.timeout = 3000;
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'name': user}))
	xhr.onload = function() {
		if (xhr.status != 200){
			server_error()
		}
		else{
			answer = JSON.parse(xhr.response)
			if (answer.exist){
				document.getElementById("user_name").innerHTML = user
				document.getElementById("profile").style.display = "block"
				document.title = `Профиль ${user} - NURE Cards`
				load_cards(user)
			}
			else{
				_404()
			}			
		}
	}
	xhr.ontimeout = function() {
		server_error()
	};
	xhr.onerror = function() {
		server_error()
	};
}
function load_my_info(){
	let name = localStorage.getItem('name');
	if (name){
		document.getElementById("user_name").innerHTML = name
		document.getElementById("profile").style.display = "block"
		document.title = "Мой профиль - NURE Cards"
		load_cards(name)
	}
	else{
		server_error()
		document.getElementById("not_found").getElementsByTagName("p")[0].innerHTML = "Ошибка!"
	}
}

current_show = ""
current_show_obj = ""
var timout_menu;
function show(what, obj){
	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	current_show = what
	current_show_obj = obj
	document.getElementById("card_previewer_name_txt").innerHTML = what;
	pr = document.getElementById("card_previewer").style
	pr.display = "flex"
	pr_name = document.getElementById("card_previewer_name")
	pr_name.style.display = "block"
	timout_menu = setTimeout(function(){
		pr.transform = "translateY(0)"
		pr_name.style.transform = "translateY(0)"
	}, 0)
}
function hide(){
	if (timout_menu) {
		clearTimeout(timout_menu);
	}
	pr = document.getElementById("card_previewer").style
	pr_name = document.getElementById("card_previewer_name")
	
	pr_name.style.transform = ""
	setTimeout(function(){pr.transform = ""}, 100)
	timout_menu = setTimeout(function(){
		pr.display = "none"
		pr_name.style.display = "none"
	}, 400)
}
async function open_in_editor(){
	user = document.getElementById("user_name").innerHTML
	val = window.location.href
	temp = val.substring(val.lastIndexOf('/')+1,val.length)
	href = window.location.href.split(temp)[0] + "index.html#" + "?user=" + user + "?card=" + current_show
	window.location.href = href
}
async function share(){
	user = document.getElementById("user_name").innerHTML
	val = window.location.href
	temp = val.substring(val.lastIndexOf('/')+1,val.length)
	href = window.location.href.split(temp)[0] + "index.html#" + "?user=" + user + "?card=" + current_show
	navigator.clipboard.writeText(href + "?share")
	await Success("Ссылка скопирована!", 3000)
}
async function confirm_delete(){
	await Warning("Удалить?", false, [['Да', delete_], 'Нет'])
}
async function delete_(){
	let name = localStorage.getItem('name');
	let password = localStorage.getItem('password');
	if (name && password){
		let xhr = new XMLHttpRequest();
		xhr.open("POST", `${server}/delete_card`)
		xhr.timeout = 5000;
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify({
			'name': name,
			'password': password,
			'card_name': current_show
		}))
		xhr.onload = async function() {
			if (xhr.status == 200){
				if(JSON.parse(xhr.response)['successfully']){
					current_show_obj.remove()
					hide()
					await Success("Удалено!", 3000)
					ckeck_none()
				}
				else{
					await Error("Ошибка!")
				}	
			}
			else{
				await Error("Ошибка сервера!")
			}
		}
		xhr.ontimeout = async function() {
			await Error("Ошибка сервера!")
		};
		xhr.onerror = async function() {
			await Error("Ошибка сервера!")
		};	
	}
}


window.onload = function() {
	notifications_element = document.getElementById('notifications')
	load_args()
}
