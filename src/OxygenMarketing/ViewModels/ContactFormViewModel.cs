using System.ComponentModel.DataAnnotations;

namespace OxygenMarketing.ViewModels
{
    /// <summary>
    /// View model for visitor contact and proposal request submissions.
    /// Includes anti-spam honeypot property and Campaign Studio bundle prefill details.
    /// </summary>
    public class ContactFormViewModel
    {
        [Required(ErrorMessage = "Name is required / الاسم مطلوب")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required / رقم الهاتف مطلوب")]
        [Phone(ErrorMessage = "Invalid phone number format / صيغة رقم الهاتف غير صحيحة")]
        [StringLength(30, ErrorMessage = "Phone number cannot exceed 30 characters")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email address is required / البريد الإلكتروني مطلوب")]
        [EmailAddress(ErrorMessage = "Invalid email address / صيغة البريد الإلكتروني غير صحيحة")]
        [StringLength(150, ErrorMessage = "Email cannot exceed 150 characters")]
        public string Email { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Company name cannot exceed 100 characters")]
        public string? Company { get; set; }

        public int? ServiceId { get; set; }

        [Required(ErrorMessage = "Message is required / الرسالة مطلوبة")]
        [StringLength(3000, MinimumLength = 5, ErrorMessage = "Message must be between 5 and 3000 characters")]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Pre-filled campaign bundle configuration from Campaign Studio.
        /// </summary>
        public string? CampaignDetails { get; set; }

        /// <summary>
        /// Spam honeypot field. Must remain empty. If filled by automated bots, the submission is silently dropped.
        /// </summary>
        public string? Website { get; set; }
    }

    /// <summary>
    /// Result structure for AJAX and standard form submissions.
    /// </summary>
    public class ContactSubmissionResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new();
    }
}
