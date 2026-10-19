using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OxygenMarketing.Models
{
    /// <summary>
    /// Represents an inbound inquiry sent via the public website or pre-filled from Campaign Studio.
    /// Includes spam prevention metadata (IP address, honeypot validation, rate check).
    /// </summary>
    public class ContactMessage
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(30)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Company { get; set; }

        public int? ServiceId { get; set; }

        [ForeignKey("ServiceId")]
        public Service? Service { get; set; }

        [Required]
        [StringLength(3000)]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Optional serialized campaign configuration chosen in Campaign Studio.
        /// </summary>
        [StringLength(2000)]
        public string? CampaignDetails { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        [StringLength(50)]
        public string? IpAddress { get; set; }
    }
}
