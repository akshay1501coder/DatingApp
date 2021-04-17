namespace API.Entities
{
    public class Connection
    {
        //providing a default constructor so that ef doesn't throw any error.
        public Connection()
        {

        }
        // So with this if we create any new instance of this class, we have to pass
        //connectionId and username properties as paramter in it.
        public Connection(string connectionId, string username)
        {
            ConnectionId = connectionId;
            Username = username;
        }

        //since it has contained Id in it , ef will automatically consider it as primary key
        public string ConnectionId { get; set; }
        public string Username { get; set; }
    }
}