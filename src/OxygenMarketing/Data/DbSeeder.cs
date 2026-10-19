using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OxygenMarketing.Models;

namespace OxygenMarketing.Data
{
    /// <summary>
    /// Seeds default database tables (Admin user, Services, Case Studies, and Site Settings)
    /// on initial startup. Idempotent and safe to run on every boot.
    /// </summary>
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

            try
            {
                // Ensure database is created and migrations are applied
                await context.Database.MigrateAsync();

                // 1. Seed Roles
                const string adminRole = "Admin";
                if (!await roleManager.RoleExistsAsync(adminRole))
                {
                    await roleManager.CreateAsync(new IdentityRole(adminRole));
                    logger.LogInformation("Role '{Role}' created successfully.", adminRole);
                }

                // 2. Seed Admin User (password must be provided via user-secrets or configuration)
                var adminEmail = config["AdminUser:Email"] ?? "admin@oxygen.jo";
                var adminPassword = config["AdminUser:Password"];
                var adminName = config["AdminUser:FullName"] ?? "Oxygen Executive Administrator";

                var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
                if (existingAdmin == null)
                {
                    if (string.IsNullOrWhiteSpace(adminPassword))
                    {
                        logger.LogWarning("AdminUser:Password is not configured. Admin user was not seeded. Configure it via 'dotnet user-secrets set \"AdminUser:Password\" \"<YourPassword>\"' or environment variables.");
                    }
                    else
                    {
                        var newAdmin = new ApplicationUser
                        {
                            UserName = adminEmail,
                            Email = adminEmail,
                            EmailConfirmed = true,
                            FullName = adminName,
                            CreatedAt = DateTime.UtcNow
                        };

                        var result = await userManager.CreateAsync(newAdmin, adminPassword);
                        if (result.Succeeded)
                        {
                            await userManager.AddToRoleAsync(newAdmin, adminRole);
                            logger.LogInformation("Admin user '{Email}' seeded successfully.", adminEmail);
                        }
                        else
                        {
                            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                            logger.LogError("Failed to seed admin user: {Errors}", errors);
                        }
                    }
                }

                // 3. Seed Site Settings
                if (!await context.SiteSettings.AnyAsync())
                {
                    var settings = new List<SiteSetting>
                    {
                        new()
                        {
                            Key = "CompanyName",
                            ValueAr = "مؤسسة أكسجين للاستشارات والتسويق",
                            ValueEn = "Oxygen Consulting & Marketing",
                            Description = "Official registered company name"
                        },
                        new()
                        {
                            Key = "Tagline",
                            ValueAr = "دع علامتك تتنفس",
                            ValueEn = "Let Your Brand Breathe",
                            Description = "Company signature slogan"
                        },
                        new()
                        {
                            Key = "Phone",
                            ValueAr = "+962796690421",
                            ValueEn = "+962796690421",
                            Description = "Official telephone and WhatsApp number"
                        },
                        new()
                        {
                            Key = "Email",
                            ValueAr = "infooxygenmedia2022@gmail.com",
                            ValueEn = "infooxygenmedia2022@gmail.com",
                            Description = "Primary contact email address"
                        },
                        new()
                        {
                            Key = "Address",
                            ValueAr = "الصويفية، عمّان، الأردن",
                            ValueEn = "Sweifieh, Amman, Jordan",
                            Description = "Physical office headquarters location"
                        },
                        new()
                        {
                            Key = "FacebookUrl",
                            ValueAr = "https://www.facebook.com/oxygenmedia2022/",
                            ValueEn = "https://www.facebook.com/oxygenmedia2022/",
                            Description = "Official Facebook page URL"
                        },
                        new()
                        {
                            Key = "InstagramUrl",
                            ValueAr = "https://www.instagram.com/oxygen_consulting__marketing",
                            ValueEn = "https://www.instagram.com/oxygen_consulting__marketing",
                            Description = "Official Instagram profile URL"
                        },
                        new()
                        {
                            Key = "GoogleMapsEmbed",
                            ValueAr = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13543.123562635952!2d35.859666!3d31.954881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca118b62dbd63%3A0xe54d9c490cba7fe7!2sAs-Suwayfiyyah%2C%20Amman!5e0!3m2!1sen!2sjo!4v1700000000000!5m2!1sen!2sjo",
                            ValueEn = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13543.123562635952!2d35.859666!3d31.954881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca118b62dbd63%3A0xe54d9c490cba7fe7!2sAs-Suwayfiyyah%2C%20Amman!5e0!3m2!1sen!2sjo!4v1700000000000!5m2!1sen!2sjo",
                            Description = "Google Maps iframe embed URL for Sweifieh, Amman"
                        },
                        new()
                        {
                            Key = "AboutText",
                            ValueAr = "نحن أكسجين للاستشارات والتسويق، نساعد العلامات التجارية على بناء حضور قوي عبر جميع منصات التواصل الاجتماعي، من خلال استراتيجيات تسويقية مدروسة، وصناعة محتوى إبداعي، وإدارة الحسابات والحملات الإعلانية، وتحليل الأداء لتحقيق أهدافها وزيادة تفاعلها مع جمهورها.",
                            ValueEn = "We are Oxygen Consulting & Marketing. We help brands build a commanding presence across all social media platforms through data-driven marketing strategies, creative content production, end-to-end account and campaign management, and in-depth performance analytics that amplify engagement and achieve business goals.",
                            Description = "Official agency profile statement"
                        }
                    };

                    await context.SiteSettings.AddRangeAsync(settings);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Default SiteSettings seeded successfully.");
                }

                // 4. Seed Services
                if (!await context.Services.AnyAsync())
                {
                    var services = new List<Service>
                    {
                        new()
                        {
                            TitleAr = "استراتيجية منصات التواصل والاستشارات",
                            TitleEn = "Social Media Strategy & Consulting",
                            DescriptionAr = "دراسة السوق والجمهور وبناء استراتيجيات تسويقية مدروسة ومخصصة لتحقيق أهداف علامتك التجارية وتوجيه الإنفاق بأعلى كفاءة.",
                            DescriptionEn = "In-depth market and audience research, formulating bespoke marketing roadmaps tailored to achieve your core commercial objectives.",
                            Icon = "compass",
                            SortOrder = 1,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "صناعة المحتوى الإبداعي",
                            TitleEn = "Creative Content Creation",
                            DescriptionAr = "إنتاج وتصميم محتوى بصري وكتابي مبتكر يعكس هوية علامتك ويخلق تفاعلاً حقيقياً مع جمهورك عبر مختلف القنوات.",
                            DescriptionEn = "Conceptualizing and crafting high-impact visual, motion, and written assets that embody your brand identity and spark genuine conversation.",
                            Icon = "sparkles",
                            SortOrder = 2,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "إدارة الحسابات عبر جميع المنصات",
                            TitleEn = "Account Management Across Platforms",
                            DescriptionAr = "إدارة يومية متكاملة لجميع حسابات التواصل الاجتماعي، جدولة النشر، والمتابعة الحثيثة للمجتمع الرقمي وبناء علاقات متينة.",
                            DescriptionEn = "Seamless day-to-day social account management, content scheduling, community moderation, and proactive brand advocacy.",
                            Icon = "share-nodes",
                            SortOrder = 3,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "الحملات الإعلانية المدفوعة",
                            TitleEn = "Paid Advertising Campaigns",
                            DescriptionAr = "ندير حملاتك الإعلانية المدفوعة عبر منصات التواصل الاجتماعي للوصول إلى جمهورك المستهدف بأقل تكلفة ممكنة وأعلى عائد استثمار.",
                            DescriptionEn = "We manage your targeted paid advertising campaigns across social media platforms to reach your ideal audience with precision and maximum ROI.",
                            Icon = "bullhorn",
                            SortOrder = 4,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "تحليل الأداء وإعداد التقارير",
                            TitleEn = "Performance Analysis & Reporting",
                            DescriptionAr = "تُقاس نتائج الحملات وفق مؤشرات الأداء الرئيسية المعتمدة (KPIs) بما يتناسب مع أهداف كل حملة وتقديم توصيات مستمرة للتحسين.",
                            DescriptionEn = "Campaign results are rigorously measured against accredited Key Performance Indicators (KPIs) matching campaign goals, backed by continuous data insights.",
                            Icon = "chart-line",
                            SortOrder = 5,
                            IsActive = true
                        }
                    };

                    await context.Services.AddRangeAsync(services);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Default Services seeded successfully.");
                }

                // 5. Seed Case Studies
                if (!await context.CaseStudies.AnyAsync())
                {
                    var cases = new List<CaseStudy>
                    {
                        new()
                        {
                            TitleAr = "دراسة حالة — قطاع ملابس",
                            TitleEn = "Case Study — Fashion & Apparel Brand",
                            IndustryAr = "ملابس",
                            IndustryEn = "Fashion & Apparel",
                            DescriptionAr = "إعادة هيكلة الحملات الإعلانية، تقسيم الجماهير المستهدفة، واختبار تصاميم إبداعية متعددة مع إعادة توزيع ذكية للميزانية لتحقيق أعلى معدل تحويل.",
                            DescriptionEn = "Full restructuring of ad campaigns, refined demographic segmentation, creative variation testing, and dynamic budget reallocation to scale e-commerce orders.",
                            Budget = 700m,
                            Reach = 100000,
                            Conversations = 3500,
                            Cpc = 0.20m,
                            CreativeScore = 85,
                            ExtraPercent = 80m,
                            ImagePath = "/images/cases/case-clothing.jpg",
                            IsFeatured = true,
                            SortOrder = 1,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "دراسة حالة — عيادات التجميل",
                            TitleEn = "Case Study — Aesthetic & Beauty Clinics",
                            IndustryAr = "عيادات التجميل",
                            IndustryEn = "Beauty & Clinics",
                            DescriptionAr = "تحسين استهداف الجمهور المهتم بالإجراءات الطبية والتجميلية، اختبار إعلانات الفيديو الإبداعية، وخفض تكلفة المحادثة والحجز المباشر.",
                            DescriptionEn = "Targeting high-intent medical aesthetics audiences, deploying engaging video creatives, and reducing direct appointment inquiry costs drastically.",
                            Budget = 950m,
                            Reach = 85000,
                            Conversations = 1200,
                            Cpc = 0.20m,
                            CreativeScore = 75,
                            ExtraPercent = 75m,
                            ImagePath = "/images/cases/case-beauty.jpg",
                            IsFeatured = true,
                            SortOrder = 2,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "دراسة حالة — قطاع إسكانات",
                            TitleEn = "Case Study — Real Estate & Housing Projects",
                            IndustryAr = "إسكانات",
                            IndustryEn = "Real Estate",
                            DescriptionAr = "توليد عملاء محتملين مهتمين بالوحدات السكنية والتجارية، إعادة استهداف زوار المنصات، وتحقيق محادثات مؤهلة بأسعار نقرة تنافسية.",
                            DescriptionEn = "Generating qualified high-value leads for residential developments, retargeting engaged prospects, and securing qualified sales appointments.",
                            Budget = 1500m,
                            Reach = 170000,
                            Conversations = 3000,
                            Cpc = 0.50m,
                            CreativeScore = 80,
                            ExtraPercent = 70m,
                            ImagePath = "/images/cases/case-realestate.jpg",
                            IsFeatured = true,
                            SortOrder = 3,
                            IsActive = true
                        },
                        new()
                        {
                            TitleAr = "دراسة حالة — مركز تعليمي",
                            TitleEn = "Case Study — Educational Center & Academies",
                            IndustryAr = "مركز تعليمي",
                            IndustryEn = "Education",
                            DescriptionAr = "تحسين رسائل الحملات الإعلانية، استهداف الطلاب والمهنيين، وخفض تكلفة النقرة من 2.0 دولار إلى 0.70 دولار مع زيادة التسجيلات.",
                            DescriptionEn = "Refining ad messaging for prospective learners and professionals, driving down cost-per-click from $2.00 to $0.70 while expanding student enrollments.",
                            Budget = 800m,
                            Reach = 65000,
                            Conversations = 1150,
                            Cpc = 0.70m,
                            CreativeScore = 65,
                            ExtraPercent = 65m,
                            ImagePath = "/images/cases/case-education.jpg",
                            IsFeatured = true,
                            SortOrder = 4,
                            IsActive = true
                        }
                    };

                    await context.CaseStudies.AddRangeAsync(cases);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Default Case Studies seeded successfully.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }
    }
}
