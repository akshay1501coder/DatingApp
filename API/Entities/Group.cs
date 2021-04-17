using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Group
    {
        public Group()
        {

        }
        public Group(string groupName)
        {
            GroupName = groupName;
        }

        [Key]
        public string GroupName { get; set; }
        public ICollection<Connection> Connections { get; set; }= new List<Connection>();
        //above line will assure when we create a groupname , we automatically wants a list
        //inside it where we can dump new connections with the group. means if user is 
        //connected from laptop or phone it will have different connections.
    }
}