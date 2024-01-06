namespace blogServer.Models
{
    public class WebSocketMessage
    {
        public long user { get; set; } = -1;
        public string value { get; set; } = "";
        public DateTime? time { get; set; } = DateTime.Now;
    }
}
