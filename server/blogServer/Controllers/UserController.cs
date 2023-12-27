using blogServer.Models;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
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
                          list.Add(new User { UUID = uuid, Name = name, Nickname = nick, pwd = pwd });
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
            list.Add(new Models.User() { UUID = uuid, Name = name, Nickname = nick, pwd = pwd });
            users = list.ToArray();
        }
        [NonAction]
        public bool findUser(User[] arr, string name)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (arr[i].Name == name)
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
                if (arr[i].Name == name)
                {
                    return arr[i];
                }
            }
            return new Models.User();
        }
        [NonAction]
        public bool checkUser(User[] arr, User user)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                if (
                    arr[i].Name == user.Name && 
                    arr[i].UUID == user.UUID && 
                    arr[i].Nickname == user.Nickname && 
                    arr[i].pwd == user.pwd
                    )
                {
                    return true;
                }
            }
            return false;
        }
        [HttpPost("signup")]
        public Result<bool> Signup(string name, string nick, string pwd)
        {
            User[] us = getUsers();
            bool isFind = findUser(us, name);
            Result<bool> res = new Result<bool>();
            if (isFind)
            {
                res.code = "0";
                res.data = false;
                return res;
            }
            try
            {
                setUser(name, nick, pwd);
            }
            catch
            {
                res.code = "0";
                res.data = false;
                return res;
            }
            res.code = "1";
            res.data = true;
            return res;
        }
        [HttpPost("check")]
        public Result<bool> Check(string token)
        {
            var users = getUsers();
            Result<bool> res = new Result<bool>();

            string r = TokenHelper.ValidateJwtToken(token);

            User user = JsonConvert.DeserializeObject<User>(r);
            if (r != "error" && checkUser(users, user))
            {
                res.code = "1";
                res.data = true;
                return res;
            }
            else
            {
                res.code = "0";
                res.data = false;
            }

            return res;
        }
        [HttpPost("signin")]
        public Result<string> Signin(string name, string pwd)
        {
            Result<string> res = new Result<string>();
            User[] us = getUsers();

            User user = findUser2(us, name);
            if (user.Name == name && user.pwd == pwd)
            {
                var objstr = JsonConvert.SerializeObject(user);
                //string(json) 转 Dictionary
                var dict = JsonConvert.DeserializeObject<Dictionary<string, string>>(objstr);
                var token = TokenHelper.CreateJwtToken(dict);
                res.code = "1";
                res.data = token;
            } else
            {
                res.code = "0";
                res.data = "";
            }
            return res;
        }
    }
}
