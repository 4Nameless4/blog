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
        public DateTime? createTime { get; set; } = DateTime.Now;
    }
}
