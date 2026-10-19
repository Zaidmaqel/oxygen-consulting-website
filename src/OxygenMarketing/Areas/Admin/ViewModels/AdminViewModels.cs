using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OxygenMarketing.Models;

namespace OxygenMarketing.Areas.Admin.ViewModels
{
    public class AdminLoginViewModel
    {
        [Required(ErrorMessage = "Email is required / البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required / كلمة المرور مطلوبة")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; } = false;
    }

    public class AdminDashboardViewModel
    {
        public int TotalMessages { get; set; }
        public int UnreadMessages { get; set; }
        public int TotalServices { get; set; }
        public int TotalCaseStudies { get; set; }
        public List<ContactMessage> RecentMessages { get; set; } = new();
    }
}
