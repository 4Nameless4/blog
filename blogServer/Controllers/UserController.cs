using blogServer.Common;
using blogServer.DataContext;
using blogServer.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection.Emit;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;

namespace blogServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public static List<string> tokens = new List<string>();
        private readonly BlogContext blogContext;
        public UserController(BlogContext context)
        {
            blogContext = context;
        }
        [NonAction]
        public User parseBase64ToUser(string base64)
        {
            try
            {
                var str = CryptoHelper.decode(base64);
                var _user = JsonConvert.DeserializeObject<User>(str) ?? new Models.User();
                return _user;
            }
            catch
            {
                User user = new User();
                return user;
            }
        }
        // parameter base64: {name:string;pwd:string;nickname:string}
        [HttpPost("signup")]
        public string Signup([FromBody] string base64)
        {
            Result<bool> res = new Result<bool>() { code = "0", data = false, msg = "" };
            try
            {
                var data_user = parseBase64ToUser(base64);
                if (data_user != null)
                {
                    // User user = getUserByName(data_user.name ?? "");
                    var _user = blogContext.users.SingleOrDefault((b) => b.name == data_user.name);
                    if (_user != null)
                    {
                        res.msg = "user exist";
                    }
                    else
                    {
                        blogContext.users.Add(new Models.User() { name = data_user.name, pwd = data_user.pwd, nickname = data_user.nickname });
                        blogContext.SaveChanges();
                        res.code = "1";
                        res.data = true;
                    }
                }
            }
            catch (Exception ex)
            {
                res.msg = ex.Message;
            }
            return res.encode();
        }
        // parameter base64: token string
        [HttpPost("check")]
        public string Check([FromBody] string base64)
        {
            Result<User> res = new Result<User>() { code = "0", data = new User(), msg = "" };
            try
            {
                var token = CryptoHelper.decode(base64);
                var r = TokenHelper.ValidateJwtToken(token);
                if (r != null)
                {
                    User tokenUser = JsonConvert.DeserializeObject<User>(r) ?? new Models.User();
                    var dataUser = blogContext.users.Single((b) => b.name == tokenUser.name && b.uuid == tokenUser.uuid && b.role == tokenUser.role);
                    var flag = tokens.Exists(d => d.Trim() == token.Trim());
                    if (dataUser != null && flag)
                    {
                        res.code = "1";
                        dataUser.pwd = "";
                        res.data = dataUser;
                    }
                    else
                    {
                        res.msg = "user not found";
                    }
                }
            }
            catch (Exception ex)
            {
                res.msg = ex.Message;
            }

            return res.encode();
        }
        // parameter base64: {name:string;pwd:string}
        [HttpPost("signin")]
        public string Signin([FromBody] string base64)
        {
            Result<IDictionary<string, object>> res = new Result<IDictionary<string, object>>() { code = "0", data = new Dictionary<string, object>(), msg = "" };

            try
            {
                var data_user = parseBase64ToUser(base64);

                var _user = blogContext.users.Single((b) => b.name == data_user.name && b.pwd == data_user.pwd);
                if (_user != null)
                {

                    _user.pwd = "";
                    var user = _user.ToDictionary();
                    var token = TokenHelper.CreateJwtToken(user);
                    res.code = "1";
                    res.data = user;

                    var oldToken = tokens.Find(d =>
                    {
                        var r = TokenHelper.ValidateJwtToken(d);
                        if (r != null)
                        {
                            User tokenUser = JsonConvert.DeserializeObject<User>(r) ?? new Models.User();
                            return tokenUser.uuid == _user.uuid;
                        }
                        return false;
                    });
                    if (oldToken != null) {
                        tokens.Remove(oldToken);
                    }
                    tokens.Add(token);
                }
                else
                {
                    res.code = "3";
                    res.msg = "user name or password error";
                }
            }
            catch (Exception ex)
            {
                res.msg = ex.Message;
            }
            return res.encode();
        }
        [HttpPost("logout")]
        public void logout([FromBody] string base64)
        {
            var token = CryptoHelper.decode(base64);
            tokens.Remove(token);
        }
    }
}
