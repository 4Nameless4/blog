using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace blogServer.Models
{
    [Table("article")]
    public class Article
    {
        [Key]
        [Column("id")]
        public long id { get; set; }
        [Column("title")]
        public string title { get; set; } = "";
        [Column("content")]
        public string content { get; set; } = "";
        [Column("create_time")]
        public DateTime create_time { get; set; } = DateTime.Now;
        [Column("update_time")]
        public DateTime update_time { get; set; } = DateTime.Now;
        [Column("user_id")]
        public long user_id { get; set; }
        [Column("view_count")]
        public long view_count { get; set; } = 0;
        [Column("types")]
        public string types { get; set; } = "";
    }
}
