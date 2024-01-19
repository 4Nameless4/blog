using Microsoft.Extensions.Configuration.Json;

namespace blogServer.Common
{
    public class AppConfiguration
    {
            public static IConfiguration Configuration { get; set; }
            static AppConfiguration()
            {
                //ReloadOnChange = true 当appsettings.json被修改时重新加载            
                Configuration = new ConfigurationBuilder()
                //.SetBasePath(Directory.GetCurrentDirectory())
                //AppDomain.CurrentDomain.BaseDirectory是程序集基目录，所以appsettings.json,需要复制一份放在程序集目录下，
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .Add(new JsonConfigurationSource { Path = "appsettings.json", ReloadOnChange = false })
                .Build();
            }
    }
}
