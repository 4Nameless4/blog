using blogServer.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Buffers.Text;
using System.Collections.Generic;
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
        public static long uuids = 0;
        public static User[] users = [];
        public static bool isRead = false;
        public static string[] tokens = [];
        [NonAction]
        public User[] getUsers() 
        {
            if (isRead)
            {
                return users;
            }
            string str = "";
            using (FileStream fs = new FileStream("user.dat", FileMode.OpenOrCreate, FileAccess.Read))
            {
              byte[] bts = new byte[fs.Length];
              fs.Read(bts, 0, bts.Length);
              UTF8Encoding encod = new UTF8Encoding();
              str = encod.GetString(bts);
              var usersStr = str.Replace("\n","").Replace("\r","").Split(";");
              foreach (var item in usersStr)
              {
                  if (item.Length > 4)
                  {
                      try
                      {
                          var keyvalues = item.Split(",");
                          var uuid = long.Parse(keyvalues[0]);
                          var name = keyvalues[1];
                          var pwd = keyvalues[2];
                          var nick = keyvalues[3];
                          var list = users.ToList();
                          list.Add(new User { uuid = uuid, name = name, nickname = nick, pwd = pwd });
                          users = list.ToArray();
                          if (uuid > uuids)
                          {
                              uuids = uuid;
                          }
                      }
                      catch {
                          continue;
                      }
                  }
              }
            };
            isRead = true;
            return users;
        }
        [NonAction]
        public void setUser(string name, string nick, string pwd)
        {
            var uuid = ++uuids;
            using (FileStream fs = new FileStream("user.dat", FileMode.OpenOrCreate, FileAccess.Write))
            {
                byte[] ub = new UTF8Encoding().GetBytes(uuid + "," + name + "," + pwd + "," + nick + ";");
                fs.Position = fs.Length;
                fs.Write(ub, 0, ub.Length);
                fs.Flush();
            };
            var list = users.ToList();
            list.Add(new Models.User() { uuid = uuid, name = name, nickname = nick, pwd = pwd });
            users = list.ToArray();
        }
        [NonAction]
        public bool findUser(User[] arr, string name)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i].name == name)
                {
                    return true;
                }
            }
            return false;
        }
        [NonAction]
        public User findUser2(User[] arr, string name)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i].name == name)
                {
                    return arr[i];
                }
            }
            return new Models.User();
        }

        // 检查是否存在此用户
        [NonAction]
        public bool checkUser(User[] arr, User user)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (
                    arr[i].name == user.name && 
                    arr[i].uuid == user.uuid && 
                    arr[i].nickname == user.nickname
                    )
                {
                    return true;
                }
            }
            return false;
        }
        [NonAction]
        public User parseBase64ToUser(string base64)
        {
            try
            {

                var str = CryptoHelper.decode(base64);
                var _user = JsonConvert.DeserializeObject<User>(str);
                return _user;
            } catch {
                User user = new User();
                return user;
            }
        }
        [HttpPost("signup")]
        public Result<bool> Signup([FromBody] string base64)
        {
            Result<bool> res = new Result<bool>() { code = "0", data = false, msg = "" };
            try
            {
                var data_user = parseBase64ToUser(base64);
                User[] us = getUsers();
                bool isFind = findUser(us, data_user.name);
                if (isFind)
                {
                    res.msg = "user exist";
                    return res;
                }
                else
                {
                    setUser(data_user.name, data_user.nickname, data_user.pwd);
                    res.code = "1";
                    res.data = true;
                }
            }
            catch (Exception ex)
            {
                res.msg = ex.Message;
            }
            return res;
        }
        [HttpPost("check")]
        public Result<IDictionary<string, string>> Check([FromBody]string base64)
        {
            Result<IDictionary<string, string>> res = new Result<IDictionary<string, string>>() { code = "0", data = new Dictionary<string, string>(), msg = "" };
            try
            {
                var users = getUsers();

                var token = CryptoHelper.decode(base64);
                var r = TokenHelper.ValidateJwtToken(token);

                User user = JsonConvert.DeserializeObject<User>(r);
                var flag = checkUser(users, user);
                if (r != "error" && flag)
                {
                    res.code = "1";
                    res.data.Add("token", token);
                    res.data.Add("name", user.name);
                    res.data.Add("nickname", user.nickname);
                    res.data.Add("role", user.role);
                    res.data.Add("uuid", user.uuid.ToString());
                    return res;
                }
                else if (flag)
                {
                    res.msg = "token error";
                }
                else
                {
                    res.msg = "user not found";
                }
            }
            catch (Exception ex)
            {
                res.msg = ex.Message;
            }

            return res;
        }
        [HttpPost("signin")]
        public Result<IDictionary<string, string>> Signin([FromBody] string base64)
        {
            Result<IDictionary<string, string>> res = new Result<IDictionary<string, string>>() { code = "0", data = new Dictionary<string, string>(), msg = "" };

            try
            {
                var data_user = parseBase64ToUser(base64);
                User[] us = getUsers();

                User user = findUser2(us, data_user.name);
                if (user.name == data_user.name && user.pwd == data_user.pwd)
                {
                    var userStore = new Dictionary<string, object>() { { "name", user.name }, { "nickname", user.nickname }, { "role", user.role }, { "uuid", user.uuid.ToString() } };
                    var token = TokenHelper.CreateJwtToken(userStore);
                    res.code = "1";
                    res.data.Add("token", token);
                    res.data.Add("name", user.name);
                    res.data.Add("nickname", user.nickname);
                    res.data.Add("role", user.role);
                    res.data.Add("uuid", user.uuid.ToString());
                }
                else if (user.name != data_user.name)
                {
                    res.code = "2";
                    res.msg = "user not found";
                } 
                else
                {
                    res.code = "3";
                    res.msg = "user name or password error";
                }
            }
            catch(Exception ex)
            {
                res.msg = ex.Message;
            }
            return res;
        }
    }
}
