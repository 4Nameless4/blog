namespace blogServer.Models
{
    public class WebSocketMessage
    {
        public long from { get; set; } = -1;
        public string value { get; set; } = "";
        public DateTime? createTime { get; set; } = DateTime.Now;
    }
}
