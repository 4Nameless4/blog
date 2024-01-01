using Newtonsoft.Json;

namespace blogServer.Models
{
    public class Result<T>
    {
        public string code { get; set; } = "0";
        public required T data { get; set; }
        public string msg { get; set; } = "";
    }
}
