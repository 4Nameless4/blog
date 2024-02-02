using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace blogServer.Models
{
    [Table("user")]
    public class User
    {
        [Key]
        [Column("uuid")]
        public long uuid { get; set; }
        [Column("name")]
        public string name { get; set; } = "";
        [Column("nickname")]
        public string nickname { get; set; } = "";
        [Column("pwd")]
        public string pwd { get; set; } = "";
        [Column("role")]
        public int role { get; set; } = 2;
        [Column("email")]
        public string? email { get; set; } = "";
        [Column("create_time")]
        public DateTime? createTime { get; set; } = DateTime.UtcNow;
        public IDictionary<string, object> ToDictionary()
        {
            var result = new Dictionary<string, object>();
            result.Add("uuid", this.uuid);
            result.Add("name", this.name);
            result.Add("nickname", this.nickname);
            result.Add("pwd", this.pwd);
            result.Add("role", this.role);
            result.Add("email", this.email ?? "");
            result.Add("createTime", (this.createTime ?? DateTime.UtcNow).ToString());
            return result;
        }
    }
}
