using blogServer.Common;
using blogServer.DataContext;
using blogServer.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            var str = CryptoHelper.decode(base64);
            var article = JsonConvert.DeserializeObject<Article>(str) ?? new Models.Article();
            return article;
        }
        [NonAction]
        public ArticleType parseBase64ToArticleType(string base64)
        {
            var str = CryptoHelper.decode(base64);
            var articleType = JsonConvert.DeserializeObject<ArticleType>(str) ?? new Models.ArticleType();
            return articleType;
        }
        /*
         return article & {user: User,typeArr:ArticleType}
         */
        [HttpGet("get")]
        public string get(long id)
        {
            Result<IDictionary<string, object>> result = new Result<IDictionary<string, object>>() { code = "0", data = new Dictionary<string, object>(), msg = "" };
            var article = blogContext.articles.SingleOrDefault(art => art.id == id);
            if (article != null)
            {
                var typeArr = article.types.Split(",").ToHashSet();
                var _user = blogContext.users.SingleOrDefault(u => u.uuid == article.userID);
                var _types = from i in blogContext.articleTypes where typeArr.Contains(i.id.ToString()) select i;
                if (_user != null && _types != null)
                {
                    var types = _types.ToArray();

                    
                    var data = article.ToDictionary();
                    data.Add("user", _user);
                    data.Add("typeArr", types);
                    result.code = "1";
                    result.data = data;
                }
            }
            return result.encode();
        }
        /*
         return List<article & {user: User,typeArr:ArticleType}>
         */
        [HttpGet("getAll")]
        public string getAll()
        {
            Result<List<IDictionary<string, object>>> result = new Result<List<IDictionary<string, object>>>() { code = "0", data = new List<IDictionary<string, object>>(), msg = "" };

            var articles = blogContext.articles.ToList();

            if (articles != null)
            {
                var users = new HashSet<long>();
                var types = new HashSet<long>();
                try
                {
                    articles.ForEach(article => {
                        users.Add(article.userID);
                        var typeStr = article.types.Trim();
                        var typeArr = typeStr.Split(",");
                        if (typeArr != null && article.types != "")
                        {
                            for (int i = 0; i < typeArr.Length; i++)
                            {
                                try
                                {
                                    types.Add(Convert.ToInt64(typeArr[i]));
                                } catch (Exception ex)
                                {
                                    throw new Exception("Type is not long number");
                                }
                            }
                        }
                    });
                    var _users = (from i in blogContext.users where users.Contains(i.uuid) select i).ToList();
                    var _types = (from i in blogContext.articleTypes where types.Contains(i.id) select i).ToList();

                    List<IDictionary<string, object>> data = new List<IDictionary<string, object>>();
                    articles.ForEach(article => {
                        var _article = article.ToDictionary();
                        var _user = _users.Find(d => d.uuid == article.userID);
                        var typeArr = article.types.Split(",").ToHashSet();
                        if (typeArr != null)
                        {
                            var _type = _types.FindAll(d => typeArr.Contains(d.id.ToString()));
                        }

                        if (_user != null)
                        {
                            _article.Add("user", _user);
                            _article.Add("typeArr", types);
                            data.Add(_article);
                        }
                    });

                    result.code = "1";
                    result.data = data;
                } catch (Exception e)
                {
                    result.msg = e.Message;
                }
            }

            return result.encode();
        }
        [HttpPost("create")]
        public string create([FromBody] string base64)
        {
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };

            try
            {
                var article = parseBase64ToArticle(base64);
                if (article.title == null || article.title == "" || article.content == null || article.content == "")
                {
                    result.msg = "Article title or content is null unable";
                } else
                {
                    var _temp = blogContext.articles.Add(article);
                    blogContext.SaveChanges();
                    
                    result.data = _temp.Entity;
                    result.code = "1";
                }
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
            Result<Article> result = new Result<Article>() { code = "0", data = new Article(), msg = "" };

            try
            {
                var article = parseBase64ToArticle(base64);
                if (article.title == null || article.title == "" || article.content == null || article.content == "")
                {
                    result.msg = "Article title or content is null unable";
                }
                else
                {
                    var _article = blogContext.articles.SingleOrDefault(d => d.id == article.id && d.content != article.content && d.userID == article.userID);

                    if (_article != null)
                    {
                        _article.content = article.content;
                        _article.updateTime = DateTime.Now;

                        var _temp = blogContext.articles.Update(_article);
                        blogContext.SaveChanges();

                        result.data = _temp.Entity;
                        result.code = "1";
                    }
                }
            }
            catch (Exception e)
            {
                result.msg = e.Message;
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

            try
            {
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
                        }
                        catch (Exception ex)
                        {
                            result.msg = ex.Message;
                        }

                        if (_article != null && dataUser != null && (dataUser.role == 1 || _article.userID == dataUser.uuid))
                        {
                            blogContext.articles.Remove(_article);
                            blogContext.SaveChanges();
                            result.code = "1";
                            result.data = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result.msg = ex.Message;
            }
            return result.encode();
        }
        [HttpGet("types")]
        public string getTypes()
        {
            Result<List<ArticleType>> result = new Result<List<ArticleType>>() { code = "0", data = new List<ArticleType>(), msg = "" };

            var types = blogContext.articleTypes.ToList();

            if (types != null)
            {
                result.code = "1";
                result.data = types;
            }

            return result.encode();
        }
        [HttpPost("createType")]
        public string createType([FromBody] string base64)
        {
            Result<ArticleType> result = new Result<ArticleType>() { code = "0", data = new ArticleType(), msg = "" };
            try
            {
                var articleType = parseBase64ToArticleType(base64);
                var types = blogContext.articleTypes.SingleOrDefault(d => d.name == articleType.name);

                if (types == null)
                {
                    articleType.id = 0;
                    blogContext.articleTypes.Add(articleType);
                    blogContext.SaveChanges();
                    var type = blogContext.articleTypes.SingleOrDefault(d => d.name == articleType.name);
                    if (type != null)
                    {
                        result.code = "1";
                        result.data = type;
                    }
                }
            }catch (Exception ex)
            {
                result.msg = ex.Message;
            }

            return result.encode();
        }
    }
}
