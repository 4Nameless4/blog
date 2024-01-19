using blogServer.Common;
using blogServer.DataContext;
using Microsoft.EntityFrameworkCore;
using System.Net;

var appConfig = AppConfiguration.Configuration;

var builder = WebApplication.CreateBuilder(args);

var corsname = "originCors_mzw_blog";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsname,
                      policy =>
                      {
                          policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                          // policy.WithOrigins("http://localhost:3000").WithMethods("*").WithHeaders("Access-Control-Allow-Origin:*");
                      });
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

string connectStr = appConfig.GetConnectionString("DefaultConnection") ?? "";
builder.Services.AddDbContext<BlogContext>(oprions => oprions.UseMySql(connectStr, new MySqlServerVersion(new Version(8, 0, 35))));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};

app.UseWebSockets(webSocketOptions);

app.UseCors(corsname);

app.UseAuthorization();

app.MapControllers();

System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable();

var hostName = Dns.GetHostName();
var host = Dns.GetHostEntry(hostName);
var ip = host.AddressList.FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
var configHost = appConfig.GetValue<string>("HostAddress") ?? "http://localhost:5136";

app.Urls.Clear();
app.Urls.Add(configHost);
if (ip != null && configHost.Contains("localhost"))
{
    var ipStr = configHost.Replace("localhost", ip.ToString());
    app.Urls.Add(ipStr);
}

app.Run();
