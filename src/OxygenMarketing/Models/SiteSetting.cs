using System.ComponentModel.DataAnnotations;

namespace OxygenMarketing.Models
{
    /// <summary>
    /// Key-value site settings for company coordinates, real social links (Facebook & Instagram only),
    /// and map embeds. Bilingual values allow custom localized text.
    /// </summary>
    public class SiteSetting
    {
        [Key]
        [StringLength(100)]
        public string Key { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? ValueAr { get; set; }

        [StringLength(2000)]
        public string? ValueEn { get; set; }

        [StringLength(255)]
        public string? Description { get; set; }
    }
}
