function check_server_response(ws){
	if(connected){
		ws.send('{"status":"get_clients_status"}');
	}
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
		}
	});
}