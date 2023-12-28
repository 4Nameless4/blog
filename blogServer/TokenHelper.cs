using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;
using JWT.Serializers;

namespace blogServer
{
    public class TokenHelper
    {
        public static string secret = "$zas|wd%m";
        public static string CreateJwtToken(IDictionary<string,object> payload)
        {
            var token = JwtBuilder.Create()
                      .WithAlgorithm(new HMACSHA256Algorithm())
                      .AddClaim("exp", DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds())
                      .WithSecret(secret)
                      .Encode(payload);

            return token;
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
