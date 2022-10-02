/* AshishKingdom */

function check_server_response(ws){
	if(connected){
		ws.send('{"status":"get_clients_status"}');
	}
}

document.getElementById("message-content")
.addEventListener("keyup", function(e){
	if(e.keyCode===13){
		send_message();
	}
});

function send_message() {
	m = document.getElementById("message-content").value.trim();
	if(m===undefined||m===""){
		return
	}
	data = {"status":"new_message_req", "content":m};
	server.send(JSON.stringify(data));
	document.getElementById("message-content").value = "";
}

function receive_server_response(ws){
	ws.addEventListener("message", ({data})=>{
		resp = JSON.parse(data);
		switch(resp.status){
			case "error_duplicate_nickname":
				w = document.getElementById("warning-msg");
				w.style.display = "block";
				w.innerHTML = resp.message;
				break;
			case "connected":
				ws.send(JSON.stringify({"status":'new_client', "name":username}));
				connected = true;
				break;
			case "nickname_accepted":
					document.getElementById("inp-nickname").value = "";

					document.getElementById("chat-app-state-1").style.display = "none";
					document.getElementById("chat-app-state-2").style.display = "block";
					break;
			case "online_status":
				clients_list = resp.response.clients;
				document.getElementById("online-count").innerHTML = clients_list.length;
				tmp = "";
				for(var i=0;i<clients_list.length;i++){
					if(clients_list[i]!=username){
						tmp+="<li>"+clients_list[i]+"</li>";
					}
				}
				tmp = "<li><u>"+username+"</u></li>"+tmp;
				document.getElementById("client-list").innerHTML = tmp;
				break;
			case "new_message":
				num_colors = client_colors.length
				tmp = chat_window.body.innerHTML;
				n = clients_list.findIndex((c)=>
					(c === resp.user ? true : false)
					);
				n = n % num_colors;
				tmp += "<span style='display:block;background-color:white;padding:4px 0px;'>";
				tmp += "<b style='color:white;padding:4px 5px;border-radius:4px;";
				tmp += "background-color:"+client_colors[n]+"'>"+resp.user+"</b> : "+resp.message_content+"</span><br>";
				chat_window.body.innerHTML = tmp;
				chat_window.scrollTop = chat_window.scrollHeight;
		}
	});
}