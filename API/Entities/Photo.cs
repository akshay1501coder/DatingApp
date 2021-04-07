using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        //Below 2 properties are added in order to make AppUserId in photos table
        //non-nullable
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}