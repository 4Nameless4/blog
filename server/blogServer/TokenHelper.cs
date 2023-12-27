using JWT;
using JWT.Algorithms;
using JWT.Exceptions;
using JWT.Serializers;

namespace blogServer
{
    public class TokenHelper
    {
        public static string secret = "$zas|wd%m";
        public static string CreateJwtToken(IDictionary<string,string> payload)
        {
            IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
            IJsonSerializer serializer = new JsonNetSerializer();
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
            IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);

            var token = encoder.Encode(payload, secret);

            return token;
        }

        public static string ValidateJwtToken(string token)
        {
            try
            {
                IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
                IJsonSerializer serializer = new JsonNetSerializer();
                IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
                IDateTimeProvider dateProvider = new UtcDateTimeProvider();
                IJwtValidator validator = new JwtValidator(serializer, dateProvider);
                IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder, algorithm);
                var json = decoder.Decode(token, secret, true);
                return json;
            }
            catch
            {
                return "error";
            }
        }
    }
}
