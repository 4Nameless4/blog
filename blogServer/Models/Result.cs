using blogServer.Common;
using Newtonsoft.Json;
using System.Buffers.Text;

namespace blogServer.Models
{
    public class Result<T>
    {
        public string code { get; set; } = "0";
        public required T data { get; set; }
        public string msg { get; set; } = "";
        public string encode()
        {
            var obj = JsonConvert.SerializeObject(this) ?? "";
            var str = CryptoHelper.encode(obj);
            return str;
        }
    }
}
