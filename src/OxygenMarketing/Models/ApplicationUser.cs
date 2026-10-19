using System;
using Microsoft.AspNetCore.Identity;

namespace OxygenMarketing.Models
{
    /// <summary>
    /// Application user entity extending ASP.NET Core Identity.
    /// Used strictly for private admin staff authentication at /admin.
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = "Oxygen Administrator";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
