import time
from flask import Flask, request, jsonify
import json
from flask_cors import CORS
import pyshorteners

app = Flask(__name__)
CORS(app)


@app.route("/")
def main():
	return '''<a style="color: #fff;padding:10px 15px;text-decoration:none;font-size:15pt;font-weight:bold;cursor:pointer;transition:all 0.5s ease;position:relative;top:20px;left:20px;display:inline-block;outline:none;border-radius:20px;border:2px solid #2c0b8e;background:#2c0b8e;text-align:center;" href="https://superzombi.github.io/NURE-Cards/" onmouseover="this.style.background='#fff';this.style.color='#2c0b8e';"onmouseout="this.style.background='#2c0b8e';this.style.color='#fff';">NURE Cards</a>'''

@app.route("/status")
def status():
	return jsonify({'online': True, 'time': time.time()})


@app.route("/short_link", methods=["POST"])
def short_link():
	try:
		s = pyshorteners.Shortener()
		link = s.tinyurl.short(request.json['link'])
		return {'successfully': True, 'link': link}
	except:
		return {'successfully': False}


users = {}
def load_users():
	global users
	try:
		with open('users.bd', 'r', encoding='utf8') as file:
			users = eval("{" + file.read() +"}")
	except FileNotFoundError:
		None
load_users()

def save_user(name, password):
	with open('users.bd', 'a', encoding='utf8') as file:
		file.write(f'"{name}": "{password}",\n')


cards = {}
def load_cards():
	global cards
	try:
		with open('cards.bd', 'r', encoding='utf8') as file:
			cards = eval(file.read())
	except FileNotFoundError:
		None
load_cards()

def save_cards():
	global cards
	with open('cards.bd', 'w', encoding='utf8') as file:
		file.write(json.dumps(cards, indent=4, ensure_ascii=False))


@app.route("/login", methods=["POST"])
def login():
	if request.json['name'] in users.keys():
		if users[request.json['name']] == request.json['password']:
			return jsonify({'successfully': True})
		else:
			return jsonify({'successfully': False, 'reason':'Не верное имя пользователя или пароль!'})
		
	return jsonify({'successfully': False, 'reason':'Такого пользователя не существует!'})

@app.route("/register", methods=["POST"])
def register():
	if request.json['name'] in users.keys():
		return jsonify({'successfully': False, 'reason':'Этот ник уже занят!'})
	
	if '"' in request.json['name']:
		return jsonify({'successfully': False, 'reason':'Запрещённый символ в нике!'})
		
	users[request.json['name']] = request.json['password']
	save_user(request.json['name'], request.json['password'])
	return jsonify({'successfully': True})


@app.route("/user_exists", methods=["POST"])
def user_exists():
	if request.json['name'] in users.keys():
		return jsonify({'exist': True})
	return jsonify({'exist': False})

@app.route("/save_card", methods=["POST"])
def save_card():
	global cards
	if request.json['name'] in users.keys():
		if users[request.json['name']] == request.json['password']:
			try:
				cards[request.json['name']][request.json['card_name']] = {"image": request.json['card_image'],
																		  "card_body": request.json['card_body']}
			except:
				cards.update({request.json['name']:{}})
				cards[request.json['name']][request.json['card_name']] = {"image": request.json['card_image'],
																		  "card_body": request.json['card_body']}
			save_cards()
			return jsonify({'successfully': True})

	return jsonify({'successfully': False})

@app.route("/card_exist", methods=["POST"])
def card_exist():
	if request.json['name'] in users.keys():
		try:
			if cards[request.json['name']][request.json['card_name']]:
				return jsonify({'exist': True})
		except:
			None

	return jsonify({'exist': False})

@app.route("/user_cards", methods=["POST"])
def user_cards():
	if request.json['user'] in users.keys():
		try:
			return jsonify({'cards': cards[request.json['user']]})
		except:
			None
	return jsonify({'cards': []})

@app.route("/delete_card", methods=["POST"])
def delete_card():
	global cards
	if request.json['name'] in users.keys():
		if users[request.json['name']] == request.json['password']:
			try:
				del cards[request.json['name']][request.json['card_name']]
				save_cards()
				return jsonify({'successfully': True})
			except:
				None


	return jsonify({'successfully': False})


@app.route("/get_card", methods=["POST"])
def get_card():
	try:
		return jsonify({'successfully': True,
						'card_body': cards[request.json['user']][request.json['card']]['card_body']})
	except:
		None

	return jsonify({'successfully': False})


app.run(host='0.0.0.0', port='80')
#app.run(debug=True)
