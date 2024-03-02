using blogServer.Common;
using blogServer.DataContext;
using blogServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Runtime.Intrinsics.X86;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace blogServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WebsocketController : ControllerBase
    {
        private readonly BlogContext blogContext;
        private static readonly List<WebSocketClient> clients = new List<WebSocketClient>();
        public WebsocketController(BlogContext context)
        {
            blogContext = context;
        }
        [HttpGet("link")]
        public async Task _Get(string uuid)
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                if (uuid.Trim() == "")
                {
                    uuid = Guid.NewGuid().ToString() + "_temp";
                }
                await Echo(webSocket, uuid);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }
        [NonAction]
        public void sendClientsMsg(ArraySegment<byte> data)
        {
            clients.ForEach(c => {
                c.send(data);
            });
        }
        [NonAction]
        public ArraySegment<byte> setMsgResult(WebSocketMessage msg, User _user)
        {
            var result = new Result<IDictionary<string, object>>()
            {
                data = new Dictionary<string, object>()
            };
            _user.pwd = "";

            var data = new Dictionary<string, object>{
                    { "user", _user },
                    { "value", msg.value},
                    { "time", msg.time ?? DateTime.Now }
                };
            result.data = data;
            result.code = "1";
            
            return WebSocketClient.getData(result);
        }
        [NonAction]
        public ArraySegment<byte> setUserListResult()
        {
            var result = new Result<User[]>()
            {
                data = []
            };

            List<User> list = new List<User>();
            clients.ForEach(c =>
            {
                list.Add(c.user);
            });
            result.data = list.ToArray();
            result.code = "2";

            return WebSocketClient.getData(result);
        }
        [NonAction]
        public WebSocketMessage getMsg(byte[] buffer, int length)
        {
            var str = CryptoHelper.decode(buffer, 0, length);
            var obj = JsonConvert.DeserializeObject<WebSocketMessage>(str) ?? new WebSocketMessage();
            return obj;
        }
        [NonAction]
        public bool checkUserExist(User user) {
            var result = false;
            for (int i = 0;i<clients.Count;i++)
            {
                if (clients[i].user.uuid == user.uuid) {
                    result = true;
                    break;
                }
            }
            return result;
        }
        [NonAction]
        private async Task Echo(WebSocket webSocket, string uuid)
        {
            // ******** open
            var buffer = new byte[1024 * 4];
            var open_user = blogContext.users.SingleOrDefault((b) => b.uuid == long.Parse(uuid));
            if (open_user == null)
            {
                return;
            }
            open_user.pwd = "";
            var client = new WebSocketClient() { webSocket = webSocket, user = open_user };
            if (!checkUserExist(open_user))
            {
                clients.Add(client);
            }
            sendClientsMsg(setUserListResult());

            // ******** connect send msg
            WebSocketReceiveResult? receiveResult = null;

            do {
                await client.receive(buffer);
                receiveResult = client.receiveResult;

                var msg = getMsg(buffer, receiveResult.Count);
                var _user = blogContext.users.SingleOrDefault((b) => b.uuid == msg.user);

                ArraySegment<byte> result = WebSocketClient.getData(new Result<bool>()
                {
                    code = "0",
                    data = false
                });
                bool flag = false;

                if (_user != null)
                {
                    result = setMsgResult(msg, _user);
                    flag = true;
                }

                if (flag)
                {
                    sendClientsMsg(result);
                }
            }
            while (!receiveResult.CloseStatus.HasValue);

            // ******** close
            clients.Remove(client);
            sendClientsMsg(setUserListResult());
            await webSocket.CloseAsync(
                receiveResult.CloseStatus.Value,
                receiveResult.CloseStatusDescription,
                CancellationToken.None);
        }
    }
}
