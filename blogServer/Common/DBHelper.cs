using MySql.Data.MySqlClient;

namespace blogServer.Common
{
    public class DBHelper
    {
        static int GetColumnOrdinal(MySqlDataReader r, string columnName)
        {
            try
            {
                return r.GetOrdinal(columnName);
            }
            catch (IndexOutOfRangeException)
            {
                // 处理列不存在的情况，这里可以记录日志或采取其他措施
                // 返回一个表示列不存在的值，例如 -1
                return -1;
            }
        }
        static public T LoadValue<T>(MySqlDataReader r, int fldNum, T defaultVal)
        {
            if (r.IsDBNull(fldNum))
               return defaultVal;
            else
            {
                return (T)r.GetValue(fldNum);
            }
        }
        static public T GetValueByColName<T>(MySqlDataReader r, string colname, T defaultVal)
        {
            int index = GetColumnOrdinal(r, colname);
            return LoadValue(r, index, defaultVal);
        }
    }
}
