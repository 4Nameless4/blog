using System;
using System.Configuration;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;

namespace blogServer.Common
{
    public class CryptoHelper
    {
        static string key;
        static byte[] keyBytes;
        static string iv;
        static byte[] ivBytes;
        static CryptoHelper()
        {
            var appConfig = AppConfiguration.Configuration;
            key = appConfig.GetValue<string>("api:key") ?? "a2hk3we*4/9d+a5-";
            iv = appConfig.GetValue<string>("api:iv") ?? "089dg|1*h19a//a*";
            keyBytes = Encoding.UTF8.GetBytes(key);
            ivBytes = Encoding.UTF8.GetBytes(iv);
        }
        static byte[] EncryptStringToBytes_Aes(string plainText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");
            byte[] encrypted;

            // Create an Aes object
            // with the specified key and IV.
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.IV = IV;

                // Create an encryptor to perform the stream transform.
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }
        static string DecryptStringFromBytes_Aes(byte[] cipherText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = "";

            // Create an Aes object
            // with the specified key and IV.
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.IV = IV;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }
        public static string decode(byte[] base64DataBytes, int start, int count)
        {
            var base64 = "";
            try
            {
                base64 = Encoding.Default.GetString(base64DataBytes, start, count);
                var dataBytes = Convert.FromBase64String(base64);
                var a = DecryptStringFromBytes_Aes(dataBytes, keyBytes, ivBytes);
                return a;
            }
            catch
            {
                return base64;
            }
        }
        public static string decode(byte[] base64DataBytes)
        {
            var base64 = "";
            try
            {
                base64 = Encoding.Default.GetString(base64DataBytes);
                var a = DecryptStringFromBytes_Aes(base64DataBytes, keyBytes, ivBytes);
                return a;
            }
            catch
            {
                return base64;
            }
        }
        public static string decode(string base64)
        {
            try
            {
                var dataBytes = Convert.FromBase64String(base64);
                var a = DecryptStringFromBytes_Aes(dataBytes, keyBytes, ivBytes);
                return a;
            }
            catch
            {
                return base64;
            }
        }
        public static string encode(string data)
        {
            try
            {
                var a = EncryptStringToBytes_Aes(data, keyBytes, ivBytes);
                var base64 = Convert.ToBase64String(a);
                return base64;
            }
            catch
            {
                return data;
            }
        }
    }
}
