using blogServer.Common;
using blogServer.DataContext;
using blogServer.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace blogServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly BlogContext blogContext;
        public ArticleController(BlogContext context)
        {
            blogContext = context;
        }
        [NonAction]
        public Article parseBase64ToArticle(string base64)
        {
            try
            {
                var str = CryptoHelper.decode(base64);
                var article = JsonConvert.DeserializeObject<Article>(str) ?? new Models.Article();
                return article;
            }
            catch
            {
                Article article = new Article();
                return article;
            }
        }
        [HttpGet("get")]
        public string get(long id)
        {
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };
            var article = blogContext.articles.SingleOrDefault(art => art.id == id);
            if (article != null)
            {
                result.code = "1";
                result.data = article;
            }
            return result.encode();
        }
        // TODO
        [HttpGet("getTypes")]
        public string getTypes()
        {
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };
            return result.encode();
        }
        // TODO
        [HttpGet("getAll")]
        public string getAll()
        {
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };
            return result.encode();
        }
        [HttpPost("create")]
        public string create([FromBody] string base64)
        {
            var article = parseBase64ToArticle(base64);
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };

            try
            {
                blogContext.articles.Add(article);
                blogContext.SaveChanges();
                result.code = "1";
                result.data = article;
            }
            catch (Exception e)
            {
                result.msg = e.Message;
            }


            return result.encode();
        }
        [HttpPost("update")]
        public string update([FromBody] string base64)
        {
            var article = parseBase64ToArticle(base64);
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };

            var _article = blogContext.articles.SingleOrDefault(d => d.id == article.id && d.content != article.content && d.user_id == article.user_id);

            if (_article != null)
            {
                _article.content = article.content;
                _article.update_time = DateTime.Now;

                try
                {
                    blogContext.articles.Update(_article);
                    blogContext.SaveChanges();

                    result.code = "1";
                    result.data = _article;
                }
                catch(Exception e)
                {
                    result.msg = e.Message;
                }
            }

            return result.encode();
        }
        [HttpPost("delete")]
        public string delete([FromBody] string base64)
        {
            Result<bool> result = new Result<bool>() { code = "0", data = false, msg = "" };
            var str = CryptoHelper.decode(base64);
            var data = JsonConvert.DeserializeObject<IDictionary<string, string>>(str) ?? new Dictionary<string, string>();
            string? articleID = null;
            string? userToken = null;

            if (data.TryGetValue("articleID", out articleID) && data.TryGetValue("userToken", out userToken))
            {
                var r = TokenHelper.ValidateJwtToken(userToken);
                var flag = UserController.tokens.Exists(d => d.Equals(userToken));

                if (flag && r != null)
                {
                    User tokenUser = JsonConvert.DeserializeObject<User>(r) ?? new Models.User();
                    var dataUser = blogContext.users.Single((b) => b.name == tokenUser.name && b.uuid == tokenUser.uuid && b.role == tokenUser.role);
                    Article? _article = null;

                    try
                    {
                        var _articleID = Convert.ToInt64(articleID);
                        _article = blogContext.articles.SingleOrDefault(d => d.id == _articleID);
                    } catch (Exception ex)
                    {
                        result.msg = ex.Message;
                    }

                    if (_article != null && dataUser != null && ( dataUser.role == 1 || _article.user_id == dataUser.uuid))
                    {
                        try
                        {
                            blogContext.articles.Remove(_article);
                            blogContext.SaveChanges();
                            result.code = "1";
                            result.data = true;
                        }
                        catch (Exception ex)
                        {
                            result.msg = ex.Message;
                        }
                    }
                }
            }

            return result.encode();
        }
    }
}
