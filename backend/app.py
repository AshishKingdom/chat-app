# Chat app backend
# AshishKingdom

import asyncio
import websockets
import json
import time

client_list = []
client_list_lower_case = []
connections = set()


async def handler(ws):
    print("connection was made")
    await ws.send(json.dumps({"status": "connected"}))
    nickname = ""
    while True:
        try:
            r = await ws.recv()
        except:
            break

        r = json.loads(r)
        print(r)

        if r['status'] == "new_client":
            if r['name'].lower() in client_list_lower_case:
                print("error_duplicate_nickname")
                await ws.send(json.dumps({'status': 'error_duplicate_nickname', 'message': 'nickname already in use'}))
                break
            else:
                client_list.append(r["name"])
                client_list_lower_case.append((r["name"].lower()))
                nickname = r["name"]
                connections.add(ws)
                await ws.send(json.dumps({"status": "nickname_accepted"}))

        if r["status"] == "get_clients_status":
            last_resp = time.time()
            await ws.send(json.dumps({"status": "online_status",
                                      "response": {
                                          "clients": client_list
                                      }}))

        if r["status"] == "new_message_req":
            message = r["content"]
            websockets.broadcast(connections, json.dumps({
                "status": "new_message",
                "user": nickname,
                "message_content": message
            }))

        if r["status"] == "connection_close_req":
            break

    connections.remove(ws)
    client_list.remove(nickname)
    client_list_lower_case.remove(nickname.lower())


async def main():
    async with websockets.serve(handler, "127.0.0.1", 41000):
        print("Server started")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
