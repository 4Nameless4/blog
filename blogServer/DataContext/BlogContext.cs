﻿using blogServer.Models;
using Microsoft.EntityFrameworkCore;

namespace blogServer.DataContext
{
    public class BlogContext:DbContext
    {
        public DbSet<User> users { get; set; }
        public DbSet<Role> roles { get; set; }
        public DbSet<Article> articles { get; set; }
        public DbSet<ArticleType> articleTypes { get; set; }
        public BlogContext(DbContextOptions<BlogContext> options)
        : base(options)
        {
        }
    }
}
