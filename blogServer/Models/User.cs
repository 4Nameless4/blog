namespace blogServer.Models
{
    public class User
    {
        public long uuid { get; set; } = 0;
        public string name { get; set; } = "";
        public string nickname { get; set; } = "";
        public string pwd { get; set; } = "";
        public string role { get; set; } = "user";
    }
}
