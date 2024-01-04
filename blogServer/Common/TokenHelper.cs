using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;
using JWT.Serializers;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Security.Claims;
using System.Text;

namespace blogServer.Common
{
    public class TokenHelper
    {
        static string secret;
        static TokenHelper()
        {
            secret = AppConfiguration.Configuration.GetValue<string>("token:secret") ?? "$zas|wd%m";
        }
        public static string CreateJwtToken(IDictionary<string, object> claims)
        {
            var builder = JwtBuilder.Create()
                      .WithAlgorithm(new HMACSHA256Algorithm())
                      .AddClaim("exp", DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds())
                      .WithSecret(secret);

            foreach (var (key, value) in claims)
            {
                builder.AddClaim(key, value);
            }
                      ;

            return builder.Encode();
        }

        public static string ValidateJwtToken(string token)
        {
            var json = JwtBuilder.Create()
                     .WithAlgorithm(new HMACSHA256Algorithm())
                     .WithSecret(secret)
                     .MustVerifySignature()
                     .Decode(token);
            return json;
        }
    }
}
