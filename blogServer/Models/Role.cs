﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace blogServer.Models
{
    [Table("permissions")]
    public class Role
    {
        [Key]
        [Column("id")]
        public int id { get; set; }
        [Column("name")]
        public string name { get; set; } = "";
    }
}
