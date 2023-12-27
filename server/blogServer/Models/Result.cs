namespace blogServer.Models
{
    public class Result<T>
    {
        public string code { get; set; }
        public T data { get; set; }
    }
}
