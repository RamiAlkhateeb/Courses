// Source: the resume section of the original Arabic README (docs/content-sources/README.ar.md).
// English is a translation of that text plus a few examples added for the course.
import type { Module } from '../../types'
import { COURSE_ID, cover, heading, html, mcq } from './helpers'

const W = 'resume'

const questions = [
  mcq(
    'res', W, 1, 'template',
    { en: 'Which fonts are safest for an ATS-friendly resume?', ar: 'ما الخطوط الأكثر أمانًا لسيرة ذاتية متوافقة مع ATS؟' },
    [
      { en: 'Arial, Calibri or Garamond', ar: 'Arial أو Calibri أو Garamond' },
      { en: 'Any decorative font that stands out', ar: 'أي خط زخرفي يلفت النظر' },
      { en: 'A different font for every section', ar: 'خط مختلف لكل قسم' },
    ],
    0,
  ),
  mcq(
    'res', W, 2, 'template',
    { en: 'Why avoid unusual fonts?', ar: 'لماذا نتجنب الخطوط غير المألوفة؟' },
    [
      { en: 'They print badly', ar: 'تُطبع بشكل سيئ' },
      { en: 'The ATS may turn the letters into unreadable symbols', ar: 'قد يحوّل النظام الحروف إلى رموز غير مقروءة' },
      { en: 'Recruiters dislike creativity', ar: 'لا يحب المسؤولون عن التوظيف الإبداع' },
    ],
    1,
  ),
  mcq(
    'res', W, 3, 'content',
    { en: 'Which order of sections is recommended?', ar: 'ما ترتيب الأقسام الموصى به؟' },
    [
      { en: 'Education, hobbies, skills, experience', ar: 'التعليم، الهوايات، المهارات، الخبرات' },
      { en: 'Professional summary, work experience, education, technical skills', ar: 'الملخص المهني، الخبرات العملية، التعليم، المهارات التقنية' },
      { en: 'Technical skills only', ar: 'المهارات التقنية فقط' },
    ],
    1,
  ),
  mcq(
    'res', W, 4, 'keywords',
    { en: 'Where do you find the keywords to put in your resume?', ar: 'من أين نأخذ الكلمات المفتاحية لوضعها في السيرة؟' },
    [
      { en: 'From a random list of buzzwords', ar: 'من قائمة عشوائية من الكلمات الرنانة' },
      { en: 'From the job description of the role you are applying for', ar: 'من الوصف الوظيفي للوظيفة التي تتقدم إليها' },
      { en: 'From your friends’ resumes', ar: 'من سير أصدقائك الذاتية' },
    ],
    1,
  ),
  mcq(
    'res', W, 5, 'experience',
    { en: 'In what order do you list work experience?', ar: 'بأي ترتيب تُعرض الخبرات العملية؟' },
    [
      { en: 'Reverse chronological: newest first', ar: 'ترتيب زمني عكسي: من الأحدث إلى الأقدم' },
      { en: 'Oldest first', ar: 'من الأقدم إلى الأحدث' },
      { en: 'Alphabetical by company', ar: 'أبجديًا حسب اسم الشركة' },
    ],
    0,
  ),
  mcq(
    'res', W, 6, 'experience',
    { en: 'Which bullet is written best?', ar: 'أي نقطة مكتوبة بشكل أفضل؟' },
    [
      { en: 'Responsible for the database', ar: 'مسؤول عن قاعدة البيانات' },
      { en: 'Cut report load time by 60% by adding indexes and caching to the reporting queries', ar: 'خفّضت زمن تحميل التقارير بنسبة 60% بإضافة فهارس وتخزين مؤقت لاستعلامات التقارير' },
      { en: 'Worked on many things in a fast-paced team', ar: 'عملت على أشياء كثيرة ضمن فريق سريع الوتيرة' },
    ],
    1,
  ),
]

export const resume: Module = {
  id: W,
  courseId: COURSE_ID,
  order: 1,
  cover: cover(
    { en: 'Getting hired · Module 1', ar: 'الحصول على الوظيفة · الوحدة 1' },
    { en: 'Resume &amp; ATS', ar: 'السيرة الذاتية و ATS' },
    { en: '≈ 15 min', ar: '≈ 15 دقيقة' },
  ),
  sections: [
    {
      id: 'overview',
      navLabel: { en: 'Overview', ar: 'نظرة عامة' },
      sectionLabel: { en: 'Overview', ar: 'نظرة عامة' },
      timeEst: { en: '2 min', ar: '2 دقيقة' },
      headingHtml: heading(
        { en: 'Writing a software engineer’s resume', ar: 'كتابة السيرة الذاتية لمهندس برمجيات' },
        {
          en: 'Most companies filter resumes with an Applicant Tracking System (ATS) before a human reads them. Your first goal is to get past it.',
          ar: 'تقوم معظم الشركات بفرز السير الذاتية عبر نظام تتبع المتقدمين (ATS) قبل أن يقرأها إنسان. هدفك الأول هو تجاوز هذا النظام.',
        },
      ),
      blocks: [
        {
          type: 'objectives',
          label: { en: 'After this module you can', ar: 'بعد هذه الوحدة ستتمكن من' },
          items: [
            { en: 'Pick an ATS-friendly template and fonts', ar: 'اختيار قالب وخطوط متوافقة مع ATS' },
            { en: 'Structure and order the sections of a resume', ar: 'تنظيم أقسام السيرة الذاتية وترتيبها' },
            { en: 'Tailor keywords to a job description', ar: 'مواءمة الكلمات المفتاحية مع الوصف الوظيفي' },
            { en: 'Write achievement-style experience bullets', ar: 'كتابة نقاط الخبرة بأسلوب الإنجازات' },
            { en: 'Check your resume with free tools', ar: 'مراجعة سيرتك بأدوات مجانية' },
          ],
        },
      ],
    },
    {
      id: 'template',
      navLabel: { en: '1. ATS-friendly template', ar: '١. قالب متوافق مع ATS' },
      sectionLabel: { en: 'Step 1', ar: 'الخطوة ١' },
      timeEst: { en: '2 min', ar: '2 دقيقة' },
      headingHtml: heading({ en: 'Start from an ATS-friendly template', ar: 'ابدأ بقالب سيرة ذاتية متوافق مع ATS' }),
      blocks: [
        html({
          en: '<p>Use a simple, clean template that applicant tracking systems can parse. Stick to standard fonts only — <strong>Arial</strong>, <strong>Calibri</strong> or <strong>Garamond</strong> — and never go below <strong>10 pt</strong> so it stays readable.</p>',
          ar: '<p>ابدأ باستخدام قالب سيرة ذاتية بسيط ومنسق بشكل يدعم أنظمة تتبع المتقدمين. استخدم خطوطًا قياسية فقط مثل <strong>Arial</strong> أو <strong>Calibri</strong> أو <strong>Garamond</strong>، وتأكد أن حجم الخط لا يقل عن <strong>10</strong> لضمان الوضوح عند القراءة.</p>',
        }),
        {
          type: 'box',
          variant: 'mistake',
          label: { en: 'Common mistake', ar: 'خطأ شائع' },
          html: {
            en: 'Fancy or unfamiliar fonts, columns, icons and graphics. They can turn letters into symbols the system cannot read — your content never reaches a human.',
            ar: 'الخطوط الجديدة أو غير المألوفة والأعمدة والأيقونات والرسومات. قد تُحوّل الحروف إلى رموز غير مقروءة من قبل النظام فلا يصل محتواك إلى إنسان.',
          },
        },
        { type: 'exercise', questionId: 'res-q001' },
        { type: 'exercise', questionId: 'res-q002' },
      ],
    },
    {
      id: 'content',
      navLabel: { en: '2. Fill in the content', ar: '٢. تعبئة المحتوى' },
      sectionLabel: { en: 'Step 2', ar: 'الخطوة ٢' },
      timeEst: { en: '2 min', ar: '2 دقيقة' },
      headingHtml: heading({ en: 'Fill the template with clear, structured content', ar: 'املأ القالب بمحتوى منظم وواضح' }),
      blocks: [
        html({
          en: '<p>Fill in your professional details in a logical order. Keep these sections, in this order:</p>',
          ar: '<p>املأ القالب بمعلوماتك المهنية بشكل منسق ومنطقي. رتّب الأقسام بوضوح كما يلي:</p>',
        }),
        {
          type: 'table',
          headers: [{ en: 'Section', ar: 'القسم' }, { en: 'What goes in it', ar: 'ما يوضع فيه' }],
          rows: [
            [{ en: 'Professional summary', ar: 'الملخص المهني' }, { en: '2–3 lines: role, years, strongest stack', ar: 'سطران أو ثلاثة: الدور والسنوات وأقوى تقنياتك' }],
            [{ en: 'Work experience', ar: 'الخبرات العملية' }, { en: 'Reverse-chronological jobs with achievements', ar: 'الوظائف بترتيب زمني عكسي مع الإنجازات' }],
            [{ en: 'Education', ar: 'التعليم' }, { en: 'Degree, institution, year', ar: 'الدرجة والجامعة والسنة' }],
            [{ en: 'Technical skills', ar: 'المهارات التقنية' }, { en: 'Languages, frameworks, databases, tools', ar: 'اللغات والأطر وقواعد البيانات والأدوات' }],
          ],
        },
        { type: 'exercise', questionId: 'res-q003' },
      ],
    },
    {
      id: 'keywords',
      navLabel: { en: '3. Keywords & priority', ar: '٣. الكلمات المفتاحية' },
      sectionLabel: { en: 'Step 3', ar: 'الخطوة ٣' },
      timeEst: { en: '2 min', ar: '2 دقيقة' },
      headingHtml: heading({ en: 'Optimise with keywords and priority', ar: 'حسّن السيرة بالكلمات المفتاحية والأولوية' }),
      blocks: [
        html({
          en: '<p>Use keywords tied to the role you are applying for to raise the chance of passing the ATS. Put the most important skills and experience <strong>first</strong>, especially the ones the job description asks for.</p>',
          ar: '<p>استخدم كلمات مفتاحية مرتبطة بالوظيفة المطلوبة لزيادة فرصة مرور السيرة الذاتية عبر أنظمة ATS. قدّم أهم المهارات والخبرات في <strong>البداية</strong>، خاصة تلك المطلوبة في الوصف الوظيفي.</p>',
        }),
        {
          type: 'box',
          variant: 'keypoint',
          label: { en: 'Tip', ar: 'نصيحة' },
          html: {
            en: 'Copy the job description into a text file, underline the nouns (skills, tools, methods) and make sure each one that is true for you appears in your resume using the same wording (“PostgreSQL”, not “Postgres/relational DB”).',
            ar: 'انسخ الوصف الوظيفي إلى ملف نصي، وضع خطًا تحت الأسماء (المهارات والأدوات والمنهجيات)، وتأكد أن كل ما ينطبق عليك يظهر في سيرتك بنفس الصياغة (مثل “PostgreSQL” وليس “قاعدة بيانات علائقية”).',
          },
        },
        { type: 'exercise', questionId: 'res-q004' },
      ],
    },
    {
      id: 'experience',
      navLabel: { en: '4. Work experience', ar: '٤. الخبرة العملية' },
      sectionLabel: { en: 'Step 4', ar: 'الخطوة ٤' },
      timeEst: { en: '4 min', ar: '4 دقائق' },
      headingHtml: heading({ en: 'Write your work experience', ar: 'كتابة الخبرة العملية' }),
      blocks: [
        html({
          en: '<p>List jobs in <strong>reverse chronological order</strong> — newest to oldest — using this structure:</p>',
          ar: '<p>اعرض الخبرات <strong>بترتيب زمني عكسي</strong> — من الأحدث إلى الأقدم — وفق البنية التالية:</p>',
        }),
        { type: 'formula', eq: '[Company], [Location] | [Job Title] | [MM/YYYY – MM/YYYY]', note: { en: 'Header line of each job', ar: 'سطر العنوان لكل وظيفة' } },
        { type: 'code', code: 'Facebook, Singapore | Front End Engineering Lead | 08/2018 - Present' },
        html({
          en: '<p>For each job include the scope of your duties and the skills you used, then your achievements, written so the result is visible:</p>',
          ar: '<p>لكل وظيفة، اذكر نطاق المهام والمهارات المستخدمة، ثم الإنجازات بأسلوب يوضح النتيجة:</p>',
        }),
        { type: 'formula', eq: '[Achievement]: [action taken] → [measurable result]', note: { en: 'Bullet formula', ar: 'صيغة النقطة' } },
        {
          type: 'box',
          variant: 'example',
          label: { en: 'Example', ar: 'مثال' },
          html: {
            en: '<strong>Faster reports</strong>: added indexes and result caching to the reporting queries, cutting load time from 12 s to 4.5 s (−60%).',
            ar: '<strong>تقارير أسرع</strong>: أضفت فهارس وتخزينًا مؤقتًا لاستعلامات التقارير، فانخفض زمن التحميل من 12 ثانية إلى 4.5 ثانية (−60%).',
          },
        },
        { type: 'exercise', questionId: 'res-q005' },
        { type: 'exercise', questionId: 'res-q006' },
      ],
    },
    {
      id: 'tools',
      navLabel: { en: '5. Test & improve', ar: '٥. اختبر وحسّن' },
      sectionLabel: { en: 'Step 5', ar: 'الخطوة ٥' },
      timeEst: { en: '3 min', ar: '3 دقائق' },
      headingHtml: heading({ en: 'Test and improve with free tools', ar: 'اختبار وتحسين السيرة بالأدوات المجانية' }),
      blocks: [
        html({
          en: '<p>Review your resume and its formatting with free tools:</p>',
          ar: '<p>استخدم أدوات مجانية لمراجعة سيرتك الذاتية وجودة تنسيقها:</p>',
        }),
        {
          type: 'table',
          headers: [{ en: 'Tool', ar: 'الأداة' }, { en: 'Use it for', ar: 'استخدمها من أجل' }],
          rows: [
            [{ en: '<strong>Tech Interview Handbook</strong> resume review', ar: '<strong>Tech Interview Handbook</strong> (مراجعة السيرة)' }, { en: 'Feedback from engineers and technical reviewers', ar: 'تعليقات من مهندسين ومراجعين تقنيين' }],
            [{ en: '<strong>Resume Worded</strong>, <strong>AI Resume Judge</strong>', ar: '<strong>Resume Worded</strong> و <strong>AI Resume Judge</strong>' }, { en: 'Checking ATS compatibility', ar: 'اختبار التوافق مع أنظمة ATS' }],
            [{ en: '<strong>Targeted Resume</strong>, <strong>Resume Shortlister</strong>', ar: '<strong>Targeted Resume</strong> و <strong>Resume Shortlister</strong>' }, { en: 'Matching a specific job and adding missing keywords', ar: 'مطابقة السيرة مع وظيفة محددة وإضافة الكلمات المفتاحية الناقصة' }],
          ],
        },
        {
          type: 'takeaways',
          label: { en: 'Key takeaways', ar: 'أهم النقاط' },
          items: [
            { en: 'Simple template, standard fonts, 10 pt or larger', ar: 'قالب بسيط وخطوط قياسية وحجم 10 فأكثر' },
            { en: 'Summary → experience → education → skills', ar: 'الملخص ← الخبرات ← التعليم ← المهارات' },
            { en: 'Mirror the job description’s keywords', ar: 'استخدم كلمات الوصف الوظيفي نفسها' },
            { en: 'Reverse-chronological jobs; bullets show measurable results', ar: 'وظائف بترتيب زمني عكسي ونقاط تُظهر نتائج قابلة للقياس' },
          ],
        },
      ],
    },
  ],
  questions,
}
