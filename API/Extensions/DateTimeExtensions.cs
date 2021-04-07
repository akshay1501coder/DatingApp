using System;

namespace API.Extensions
{
    //Extension Method to calculate age
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (dob.Date > today.AddYears(-age))
            {
                age--;
            }
            return age;
        }
    }
}