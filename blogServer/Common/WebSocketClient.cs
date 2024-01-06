using blogServer.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.WebSockets;
using System.Text;

namespace blogServer.Common
{
    public class WebSocketClient
    {
        public WebSocket webSocket { get; set; }
        public User user { get; set; }
        public WebSocketReceiveResult receiveResult { get; set; }
        public static ArraySegment<byte> getData<T>(Result<T> result)
        {
            var msgStr = result.encode();
            var msgBytes = Encoding.UTF8.GetBytes(msgStr);
            var arrseg = new ArraySegment<byte>(msgBytes);
            return arrseg;
        }
        public Task send(ArraySegment<byte> buffer)
        {
            return webSocket.SendAsync(
                buffer,
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
        }
        public async Task receive(byte[] buffer)
        {
            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
            return;
        }
        public Task close()
        {
            return webSocket.CloseAsync(
                receiveResult!.CloseStatus!.Value,
                receiveResult.CloseStatusDescription,
                CancellationToken.None);
        }
    }
}
