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
				break;
		}
	});
}