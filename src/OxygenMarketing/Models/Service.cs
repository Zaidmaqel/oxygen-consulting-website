using System.ComponentModel.DataAnnotations;

namespace OxygenMarketing.Models
{
    /// <summary>
    /// Represents an agency marketing service offered in Arabic and English.
    /// Fully manageable from the Admin portal.
    /// </summary>
    public class Service
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string TitleAr { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string TitleEn { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string DescriptionAr { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string DescriptionEn { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Icon { get; set; }

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
