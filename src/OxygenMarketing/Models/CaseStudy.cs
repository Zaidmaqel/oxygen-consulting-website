using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OxygenMarketing.Models
{
    /// <summary>
    /// Represents a verified marketing case study / campaign performance report.
    /// All metrics (Reach, CPC, Budget, etc.) are seeded from company records and editable in Admin.
    /// </summary>
    public class CaseStudy
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string TitleAr { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string TitleEn { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string IndustryAr { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string IndustryEn { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string DescriptionAr { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string DescriptionEn { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? Budget { get; set; }

        public long? Reach { get; set; }

        public int? Conversations { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? Cpc { get; set; }

        public int? CreativeScore { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal? ExtraPercent { get; set; }

        [StringLength(255)]
        public string? ImagePath { get; set; }

        public bool IsFeatured { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
