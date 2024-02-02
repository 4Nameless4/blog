using Microsoft.AspNetCore.Mvc;
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
        public DateTime createTime { get; set; } = DateTime.UtcNow;
        [Column("update_time")]
        public DateTime updateTime { get; set; } = DateTime.UtcNow;
        [Column("user_id")]
        public long userID { get; set; }
        [Column("view_count")]
        public long viewCount { get; set; } = 0;
        [Column("types")]
        public string types { get; set; } = "";
        public IDictionary<string, object> ToDictionary()
        {
            var result = new Dictionary<string, object>();
            result.Add("id", this.id);
            result.Add("title", this.title);
            result.Add("content", this.content);
            result.Add("createTime", this.createTime.ToString());
            result.Add("updateTime", this.updateTime.ToString());
            result.Add("userID", this.userID);
            result.Add("viewCount", this.viewCount);
            result.Add("types", this.types);
            return result;
        }
    }
}
