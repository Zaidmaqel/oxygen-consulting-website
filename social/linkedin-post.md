# LinkedIn Content Pack: Oxygen Consulting & Marketing Platform

This document contains publication-ready post copy in two English variants and one native Arabic variant, along with the first-comment link strategy, tagging notes, and a pre-publication checklist.

---

## Post Copy: Option 1 (Recommended — Engineering & Technical Focus)

Most agency websites look great until you switch the layout to Arabic.

I recently built a full-stack web platform for Oxygen Consulting & Marketing as part of a technical hiring assessment. The brief was straightforward on paper: a bilingual agency presence with modern motion and an interactive campaign estimation studio.

The real engineering challenge was bidirectional parity. When flipping from English (LTR) to Arabic (RTL), animations cannot simply be inverted without breaking optical balance. For GSAP scroll storytelling, splitting text by individual characters breaks the cursive ligature connections in Arabic typography, so I had to animate whole-word boundaries instead.

On the backend, ASP.NET Core 8 MVC handles real-time studio calculations, culture cookies, and a private administration portal with brute-force lockout protection. For the 3D WebGL golden ring, capping device pixel ratios and implementing fallback shaders kept framerates steady on mobile devices.

This project was built using AI-assisted development tools, followed by in-depth code review, architectural refinement, and unit testing.

How do you handle bidirectional animation balance across complex RTL and LTR interfaces?

---

## Post Copy: Option 2 (Product & Problem-Solving Focus)

How do you turn a static agency portfolio into an interactive decision tool?

As a hiring assessment for Oxygen Consulting & Marketing, I engineered a full-stack platform featuring a live configurator called the Build-Your-Campaign Studio.

Instead of static inquiry forms, prospective clients select advertising channels and service tiers to calculate real-time budget, reach, and conversation projections powered by a dedicated C# estimation engine.

Architecturally, the project runs on ASP.NET Core 8 MVC, EF Core, and Three.js. The primary hurdle was making heavy visual interactions feel instantaneous on mobile while maintaining strict right-to-left (RTL) Arabic layout integrity. By clamping WebGL pixel ratios and animating at the word level rather than splitting cursive letterforms, the interface stays lightweight and fluid.

The codebase also incorporates an isolated `/admin` management area with brute-force lockout and rate-limited form security. I leveraged AI tools to accelerate prototyping, then thoroughly validated the logic through automated xUnit testing.

What interactive features have made the biggest difference in your client-facing web applications?

---

## Post Copy: Option 3 (Arabic — احترافي وطبيعي)

معظم المواقع تبدو أنيقة باللغة الإنجليزية، لكن التحدي الحقيقي يبدأ عند تحويل الواجهة بالكامل إلى اللغة العربية.

قمت مؤخراً بتطوير منصة ويب متكاملة لمؤسسة أكسجين للاستشارات والتسويق كجزء من تقييم تقني للتوظيف. ركّز المشروع على تقديم تجربة تفاعلية ثنائية اللغة تجمع بين الأداء العالي والتصميم العصري.

التحدي الأكبر كان الحفاظ على انسيابية الحركة في الاتجاهين (RTL/LTR). على سبيل المثال، تقسيم النصوص الإنجليزية حرفاً بحرف في المؤثرات الحركية شائع، لكن تطبيقه على الكلمات العربية يكسر اتصال الحروف ببعضها؛ لذا صممت حركات مكتبة GSAP لتتعامل مع الكلمات ككتل كاملة.

المنصة مبنية باستخدام ASP.NET Core 8 و Entity Framework مع واجهة ثلاثية الأبعاد بـ Three.js واستوديو تفاعلي يقدّم تقديرات فورية لتكاليف الحملات عبر خوارزمية مخصصة. كما يتضمن الموقع لوحة تحكم إدارية خاصة محمية ضد محاولات الدخول العشوائي.

تم إنجاز المشروع بمساعدة أدوات الذكاء الاصطناعي مع مراجعة دقيقة وتدقيق هندسي واختبارات آلية شاملة.

ما هو أكبر تحدٍ واجهك أثناء بناء واجهات ثنائية الاتجاه (عربي/إنجليزي)؟

---

## Suggested Hashtags (Use 3 to 5)

`#DotNet #ASPNETCore #WebDevelopment #ThreeJS #FullStack`

---

## First Comment Strategy

> **Algorithm Tip**: LinkedIn algorithmic distribution penalizes posts with external URLs in the primary body. Post the link immediately after publishing in the first comment:

**Comment Text**:
> Explore the full source code, architecture diagrams, and unit tests on GitHub:  
> https://github.com/Zaidmaqel/oxygen-consulting-website

---

## Tagging Instructions

- If Oxygen Consulting & Marketing has provided permission, tag their official LinkedIn page or representative.
- If unsure or pending approval, publish without tagging specific individuals and mention the company as a demonstration case.

---

## "Before You Post" Checklist

- [ ] **Client Approval**: Confirm with Oxygen Consulting & Marketing that they are comfortable with you showcasing the assessment project and brand logo publicly.
- [ ] **Privacy Check**: Ensure the attached video (`demo-video-4x5.mp4`) and carousel slides do not expose any real personal emails, customer phone numbers, or passwords. (Verified: only seeded sample data is shown).
- [ ] **Claim Accuracy**: Verify that no post text claims real customer results, revenue numbers, or verified commercial analytics (all figures are presented as sample assessment data).
- [ ] **Link in First Comment**: Publish the post text first, then immediately paste the GitHub link in the first comment.
- [ ] **Asset Choice**:
  - For highest organic engagement: Upload **`social/demo-video-4x5.mp4`** (optimal 4:5 vertical video for mobile LinkedIn feed).
  - For document/slide format: Upload **`social/carousel.pdf`** as a LinkedIn Document post (generates an interactive multi-slide swipe carousel).
