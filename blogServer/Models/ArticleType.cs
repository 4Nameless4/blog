using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace blogServer.Models
{
    [Table("article_type")]
    public class ArticleType
    {
        [Key]
        [Column("id")]
        public long id { get; set; }
        [Column("name")]
        public string name { get; set; } = "";
    }
}
