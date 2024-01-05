using blogServer.Common;
using blogServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Buffers.Text;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace blogServer.Controllers
{
    [ApiController]
    public class WebsocketController : ControllerBase
    {
        [Route("/chatroom/ws")]
        public async Task Get()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                await Echo(webSocket);
            }
            else
            {
                HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
            }
        }
        private static async Task Echo(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            var receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!receiveResult.CloseStatus.HasValue)
            {
                var str = CryptoHelper.decode(buffer, 0, receiveResult.Count);
                var obj = JsonConvert.DeserializeObject<WebSocketMessage>(str);

                var msgStr = JsonConvert.SerializeObject(obj);
                var msgBytes = Encoding.UTF8.GetBytes(msgStr);
                var arrseg = new ArraySegment<byte>(msgBytes);
                await webSocket.SendAsync(
                    arrseg,
                    receiveResult.MessageType,
                    receiveResult.EndOfMessage,
                    CancellationToken.None);

                receiveResult = await webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(
                receiveResult.CloseStatus.Value,
                receiveResult.CloseStatusDescription,
                CancellationToken.None);
        }
    }
}
