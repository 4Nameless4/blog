using blogServer.Common;
using blogServer.DataContext;
using Microsoft.EntityFrameworkCore;

var appConfig = AppConfiguration.Configuration;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
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
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
