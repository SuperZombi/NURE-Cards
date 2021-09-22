server = 'https://nure-cards.herokuapp.com'

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
	xhr.timeout = 5000;
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify({'name': user}))
	xhr.onload = function() {
		if (xhr.status != 200){
			document.getElementById("not_found").getElementsByTagName("p")[0].innerHTML = "Ошибка сервера!"
			document.getElementById("not_found").getElementsByTagName("h1")[0].style.display = "none"
			document.getElementById("not_found").style.display = "block"	
		}
		else{
			answer = JSON.parse(xhr.response)
			if (answer.exist){
				document.getElementById("user_name").innerHTML = user
				document.getElementById("profile").style.display = "block"
				document.title = `Профиль ${user} - NURE Cards`
			}
			else{
				document.getElementById("not_found").style.display = "block"
			}			
		}
	}
	xhr.ontimeout = function() {
		document.getElementById("not_found").getElementsByTagName("p")[0].innerHTML = "Ошибка сервера!"
		document.getElementById("not_found").getElementsByTagName("h1")[0].style.display = "none"
		document.getElementById("not_found").style.display = "block"
	};
	xhr.onerror = function() {
		document.getElementById("not_found").getElementsByTagName("p")[0].innerHTML = "Ошибка сервера!"
		document.getElementById("not_found").getElementsByTagName("h1")[0].style.display = "none"
		document.getElementById("not_found").style.display = "block"
	};
}
function load_my_info(){
	let name = localStorage.getItem('name');
	if (name){
		document.getElementById("user_name").innerHTML = name
		document.getElementById("profile").style.display = "block"
		document.title = "Мой профиль - NURE Cards"
	}
}


window.onload = function() {
	load_args()
}
