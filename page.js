/* AshishKingdom */

let login_html_content = undefined;
let username = "", channel = "default"
let server;
let server_status;
let connected = false;
let chat_window;


function check_input() {
	let nick_name = document.getElementById("inp-nickname").value;
	let warn_element = document.getElementById("warning-msg");
	if(nick_name==""){
		warn_element.style.display = "block";
		warn_element.innerHTML = "Please enter a nickname";
	} else {
		re = /^\w+$/;
		if(!re.test(nick_name)){
			warn_element.style.display = "block";
			warn_element.innerHTML = "Symbols are not allowed in nickname";
			return;
		}
		warn_element.style.display = "none";
		username = nick_name;
		connect_to_server();
	}
}

function init() {
	document.getElementById("chat-app-state-2").style.display = "none"; //hide the second interface

	//add event listener on nickname textbox so that it submits name on pressing ENTER key.
	document.getElementById("inp-nickname")
	.addEventListener("keyup", function (e) {
		if(e.keyCode===13){
			document.getElementById("btn-enter").click();
		}
	});
	// let tmp = "test <br>";
	// for(var i=0;i<200;i++){
	// 	tmp+="test <br>";
	// }
	var x = document.querySelector("#chat-area iframe");
	chat_window = (x.contentWindow || x.contentDocument);
	if(chat_window.document)chat_window=chat_window.document;
	// frm.body.innerHTML = tmp;
	// frm.body.style.backgroundColor = "rgb(140,140,140)"
}

function connect_to_server(){
	server = new WebSocket("ws://192.168.0.108:41000");
	receive_server_response(server);

	server_status = setInterval(check_server_response,2500,server);
}

function exit_chat(){
	document.getElementById("chat-app-state-2").style.display = "none";
	document.getElementById("chat-app-state-1").style.display = "block";
}