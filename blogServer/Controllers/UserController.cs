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
        // private static string selectUserSql = "select t1.uuid,t1.name,t1.nickname,t1.pwd,t1.email,t1.create_time,t1.role from user as t1";
        // private static string insertUserSql = "INSERT INTO `blog`.`user` (`id`, `uuid`, `name`, `pwd`, `role`, `nickname`) VALUES ('3', '4', 'asdfg', 'asdfg', '2', 'asdfg');";
        // private static string selectRoleSql = "select * from permissions as t1";
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
        //[NonAction]
        //private User getUserFromDataBase(MySqlDataReader reader)
        //{
        //    User user = new User();

        //    if (reader.Read())
        //    {
        //        user.uuid = DBHelper.GetValueByColName<long>(reader, "uuid", -1);
        //        user.name = DBHelper.GetValueByColName(reader, "name", "");
        //        user.nickname = DBHelper.GetValueByColName(reader, "nickname", "");
        //        user.pwd = DBHelper.GetValueByColName(reader, "pwd", "");
        //        user.email = DBHelper.GetValueByColName(reader, "email", "");
        //        user.createTime = DBHelper.GetValueByColName(reader, "create_time", new DateTime(2000, 1, 1, 00, 00, 00));
        //        user.role = DBHelper.GetValueByColName(reader, "role", 3);
        //    }
        //    return user;
        //}
        //[NonAction]
        //private User getUserByName(string name)
        //{
        //    User user = new User() { uuid = -1 };
        //    try
        //    {
        //        using (MySqlConnection con = new MySqlConnection(AppConfiguration.Configuration.GetConnectionString("DefaultConnection")))
        //        {
        //            con.Open();
        //            MySqlCommand comd = new MySqlCommand($"{selectUserSql} where t1.name = \"{name}\"", con);
        //            var reader = comd.ExecuteReader();
        //            var datauser = getUserFromDataBase(reader);
        //            return datauser;
        //        }
        //    }
        //    catch { }
        //    return user;
        //}
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
                        return res.encode();
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
                        return res.encode();
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
                    var userStore = new Dictionary<string, object>() { { "name", _user.name }, { "nickname", _user.nickname }, { "role", _user.role }, { "uuid", _user.uuid.ToString() } };
                    var token = TokenHelper.CreateJwtToken(userStore);
                    res.code = "1";
                    _user.pwd = "";
                    res.data = new Dictionary<string, object>() { { "token", token }, { "uuid", _user.uuid }, { "name", _user.name }, { "nickname", _user.nickname }, { "email", _user.email ?? "" }, { "role", _user.role }, { "createTime", _user.createTime ?? new DateTime(2000,1,1,0,0,0) } };

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
    }
}
