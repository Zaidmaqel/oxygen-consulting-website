using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Models;

namespace OxygenMarketing.Data
{
    /// <summary>
    /// Entity Framework Core database context configured for ASP.NET Core Identity
    /// and business entities. Kept provider-agnostic to allow seamless switching between
    /// SQLite (default for development/portable deploy) and Microsoft SQL Server.
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Service> Services => Set<Service>();
        public DbSet<CaseStudy> CaseStudies => Set<CaseStudy>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Service
            builder.Entity<Service>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.TitleAr).IsRequired().HasMaxLength(150);
                entity.Property(s => s.TitleEn).IsRequired().HasMaxLength(150);
                entity.HasIndex(s => s.SortOrder);
            });

            // Configure CaseStudy
            builder.Entity<CaseStudy>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.TitleAr).IsRequired().HasMaxLength(150);
                entity.Property(c => c.TitleEn).IsRequired().HasMaxLength(150);
                entity.Property(c => c.IndustryAr).IsRequired().HasMaxLength(100);
                entity.Property(c => c.IndustryEn).IsRequired().HasMaxLength(100);
                entity.HasIndex(c => c.SortOrder);
                entity.HasIndex(c => c.IsFeatured);
            });

            // Configure ContactMessage
            builder.Entity<ContactMessage>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Name).IsRequired().HasMaxLength(100);
                entity.Property(m => m.Email).IsRequired().HasMaxLength(150);
                entity.Property(m => m.Phone).IsRequired().HasMaxLength(30);
                entity.HasIndex(m => m.CreatedAt);
                entity.HasIndex(m => m.IsRead);

                entity.HasOne(m => m.Service)
                      .WithMany()
                      .HasForeignKey(m => m.ServiceId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure SiteSetting
            builder.Entity<SiteSetting>(entity =>
            {
                entity.HasKey(s => s.Key);
                entity.Property(s => s.Key).HasMaxLength(100);
            });
        }
    }
}
