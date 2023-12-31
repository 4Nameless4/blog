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
                          var role = keyvalues[4];
                          var list = users.ToList();
                          list.Add(new User { uuid = uuid, name = name, nickname = nick, pwd = pwd, role = role });
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
        public void setUser(string name, string nick, string pwd, string role)
        {
            var uuid = ++uuids;
            using (FileStream fs = new FileStream("user.dat", FileMode.OpenOrCreate, FileAccess.Write))
            {
                byte[] ub = new UTF8Encoding().GetBytes(uuid + "," + name + "," + pwd + "," + nick + "," + role + ";");
                fs.Position = fs.Length;
                fs.Write(ub, 0, ub.Length);
                fs.Flush();
            };
            var list = users.ToList();
            list.Add(new Models.User() { uuid = uuid, name = name, nickname = nick, pwd = pwd, role = role });
            users = list.ToArray();
        }
        [NonAction]
        public User findUserByName(User[] arr, User user)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                var iuser = arr[i];
                if (iuser.name == user.name)
                {
                    return arr[i];
                }
            }
            return new Models.User() { uuid = -1 };
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
                User isFind = findUserByName(us, data_user);
                if (isFind.uuid != -1)
                {
                    res.msg = "user exist";
                    return res;
                }
                else
                {
                    setUser(data_user.name, data_user.nickname, data_user.pwd, "user");
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
                var _user = findUserByName(users, user);
                bool flag = _user.uuid != -1;
                if (r != "error" && flag)
                {
                    res.code = "1";
                    res.data.Add("token", token);
                    res.data.Add("name", _user.name);
                    res.data.Add("nickname", _user.nickname);
                    res.data.Add("role", _user.role);
                    res.data.Add("uuid", _user.uuid.ToString());
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

                User user = findUserByName(us, data_user);
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
