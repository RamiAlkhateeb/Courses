// Original course content, drawing on widely taught lean-startup practice (customer interviews, MVPs).
import type { Module } from '../../types'
import { L, box, cover, exercise, html, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'validation'
const P = 'entv'

const questions = [
  mcq(P, W, 1, 'problem',
    L('What should you be sure of before building a product?', 'ما الذي يجب أن تتأكد منه قبل بناء منتج؟'),
    [L('That a specific group of people has a real problem they want solved', 'أن مجموعة محددة من الناس لديها مشكلة حقيقية تريد حلها'), L('That your friends like the idea', 'أن أصدقاءك يحبون الفكرة'), L('That the logo looks good', 'أن الشعار يبدو جيدًا')], 0),
  mcq(P, W, 2, 'interviews',
    L('Which interview question gives the most reliable answer?', 'أي سؤال مقابلة يعطي الإجابة الأكثر موثوقية؟'),
    [L('“Tell me about the last time this happened. What did you do?”', '«حدّثني عن آخر مرة حدث فيها ذلك. ماذا فعلت؟»'), L('“Would you buy this if I built it?”', '«هل ستشتري هذا إن بنيته؟»'), L('“Don’t you think this is a great idea?”', '«ألا تعتقد أنها فكرة رائعة؟»')], 0),
  mcq(P, W, 3, 'interviews',
    L('A potential customer says “I love it, great idea!” This is…', 'قال عميل محتمل: «أحببتها، فكرة رائعة!» هذا…'),
    [L('A compliment, not evidence — look for commitment instead', 'مجاملة وليس دليلًا — ابحث عن التزام بدلًا من ذلك'), L('Proof the business will succeed', 'دليل على أن العمل سينجح'), L('A signed contract', 'عقد موقّع')], 0),
  mcq(P, W, 4, 'assumptions',
    L('Which assumption should you test first?', 'أي افتراض يجب أن تختبره أولًا؟'),
    [L('The riskiest one — if it is wrong, the whole idea fails', 'الأكثر خطورة — إذا كان خاطئًا تفشل الفكرة كلها'), L('The easiest one', 'الأسهل'), L('The one about the company name', 'الافتراض المتعلق باسم الشركة')], 0),
  mcq(P, W, 5, 'mvp',
    L('You deliver the service by hand to the first customers before automating anything. This MVP is called…', 'تقدّم الخدمة يدويًا لأوائل العملاء قبل أتمتة أي شيء. يسمى هذا المنتج الأولي…'),
    [L('Concierge MVP', 'منتج أولي بأسلوب الكونسيرج'), L('Landing-page test', 'اختبار صفحة الهبوط'), L('Full launch', 'إطلاق كامل')], 0),
  mcq(P, W, 6, 'signals',
    L('Which is the strongest validation signal?', 'أي إشارة تحقق هي الأقوى؟'),
    [L('Customers pre-paying or signing a letter of intent', 'دفع العملاء مسبقًا أو توقيعهم خطاب نوايا'), L('Many likes on social media', 'إعجابات كثيرة على وسائل التواصل'), L('Positive comments in a survey', 'تعليقات إيجابية في استبيان')], 0),
]

export const validation: Module = {
  id: W,
  courseId: 'entrepreneurship',
  order: 1,
  cover: cover(L('Find the idea · Module 1', 'إيجاد الفكرة · الوحدة 1'), L('Validating a business idea', 'التحقق من فكرة العمل'), L('≈ 25 min', '≈ 25 دقيقة')),
  sections: [
    section({
      id: 'problem',
      label: L('Part 1', 'الجزء ١'),
      nav: L('Start with the problem', 'ابدأ بالمشكلة'),
      title: L('Fall in love with the problem, not the solution', 'أحبب المشكلة لا الحل'),
      standfirst: L('Most new businesses fail because nobody wants what they built. Validation is cheaply finding out before you spend months building.', 'تفشل معظم الأعمال الجديدة لأن لا أحد يريد ما بنته. التحقق هو أن تكتشف ذلك بتكلفة قليلة قبل أن تقضي أشهرًا في البناء.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        objectives([
          L('Describe the problem and customer precisely', 'وصف المشكلة والعميل بدقة'),
          L('Run customer interviews that give honest answers', 'إجراء مقابلات مع العملاء تعطي إجابات صادقة'),
          L('Pick the riskiest assumption and test it with an MVP', 'اختيار الافتراض الأخطر واختباره بمنتج أولي'),
          L('Tell real signals from polite noise', 'التمييز بين الإشارات الحقيقية والمجاملات'),
        ]),
        html(L(
          '<p>Write one sentence: <em>“[Who] struggles with [problem] when [situation], and today they [current workaround].”</em> If you cannot name the who and the workaround, you do not know the problem yet.</p>',
          '<p>اكتب جملة واحدة: <em>«[من] يعاني من [المشكلة] عندما [الموقف]، واليوم يلجأ إلى [الحل البديل الحالي].»</em> إن لم تستطع تسمية «من» والحل البديل، فأنت لا تعرف المشكلة بعد.</p>',
        )),
        box('example', L('Example', 'مثال'), L(
          '“Small restaurant owners struggle to plan staff shifts when orders change every week; today they use paper and WhatsApp groups.”',
          '«يعاني أصحاب المطاعم الصغيرة في تخطيط مناوبات الموظفين عندما تتغير الطلبات كل أسبوع؛ واليوم يستخدمون الورق ومجموعات واتساب.»',
        )),
        exercise('entv-q001'),
      ],
    }),
    section({
      id: 'interviews',
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Customer interviews', 'مقابلات العملاء'),
      title: L('Talk to customers the right way', 'تحدّث مع العملاء بالطريقة الصحيحة'),
      standfirst: L('People are kind. Ask about what they did, not what they would do.', 'الناس لطفاء. اسأل عمّا فعلوه، لا عمّا قد يفعلونه.'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        table(
          [L('Avoid', 'تجنّب'), L('Ask instead', 'اسأل بدلًا من ذلك')],
          [
            [L('“Would you use an app for this?”', '«هل ستستخدم تطبيقًا لهذا؟»'), L('“How do you handle this today?”', '«كيف تتعامل مع هذا اليوم؟»')],
            [L('“How much would you pay?”', '«كم ستدفع؟»'), L('“What have you spent on solving it so far?”', '«كم أنفقت على حلها حتى الآن؟»')],
            [L('“Is this a big problem?”', '«هل هذه مشكلة كبيرة؟»'), L('“When did it last happen? What did it cost you?”', '«متى حدثت آخر مرة؟ وكم كلّفتك؟»')],
            [L('Pitching your idea', 'عرض فكرتك'), L('Listening; asking “why?” and “tell me more”', 'الاستماع؛ وسؤال «لماذا؟» و«أخبرني أكثر»')],
          ],
        ),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Interviewing only friends and family. They want to support you, so their answers are the least reliable. Find strangers who have the problem.',
          'إجراء المقابلات مع الأصدقاء والعائلة فقط. هم يريدون دعمك، لذا إجاباتهم الأقل موثوقية. ابحث عن غرباء لديهم المشكلة.',
        )),
        exercise('entv-q002'),
        exercise('entv-q003'),
      ],
    }),
    section({
      id: 'mvp',
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Test with an MVP', 'اختبر بمنتج أولي'),
      title: L('Test the riskiest assumption with an MVP', 'اختبر الافتراض الأخطر بمنتج أولي'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        html(L(
          '<p>List your assumptions (people have the problem, they will pay, you can reach them, you can deliver). Pick the one that would kill the idea if wrong and design the smallest experiment — a <strong>minimum viable product</strong> — to test it.</p>',
          '<p>دوّن افتراضاتك (الناس لديهم المشكلة، سيدفعون، يمكنك الوصول إليهم، يمكنك التنفيذ). اختر الافتراض الذي يقضي على الفكرة إن كان خاطئًا، وصمّم أصغر تجربة — <strong>منتجًا أوليًا قابلًا للتطبيق</strong> — لاختباره.</p>',
        )),
        table(
          [L('MVP type', 'نوع المنتج الأولي'), L('How it works', 'كيف يعمل'), L('Tests', 'يختبر')],
          [
            [L('Landing page', 'صفحة هبوط'), L('Describe the offer, measure sign-ups or pre-orders', 'صِف العرض، وقِس التسجيلات أو الطلبات المسبقة'), L('Demand', 'الطلب')],
            [L('Concierge', 'الكونسيرج'), L('Deliver the service by hand for a few customers', 'قدّم الخدمة يدويًا لبضعة عملاء'), L('Value, willingness to pay', 'القيمة والاستعداد للدفع')],
            [L('Wizard of Oz', 'ساحر أوز'), L('Looks automated to the customer, done by hand behind the scenes', 'يبدو مؤتمتًا للعميل، لكنه يُنجز يدويًا خلف الكواليس'), L('Whether the experience works', 'نجاح التجربة')],
            [L('Clickable prototype', 'نموذج أولي تفاعلي'), L('Screens without real code', 'شاشات بلا كود حقيقي'), L('Usability, understanding', 'سهولة الاستخدام والفهم')],
          ],
        ),
        exercise('entv-q004'),
        exercise('entv-q005'),
      ],
    }),
    section({
      id: 'signals',
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Read the signals', 'اقرأ الإشارات'),
      title: L('Compliments vs commitment', 'المجاملة مقابل الالتزام'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>The best evidence costs the customer something: <strong>money</strong> (pre-payment, deposit), <strong>time</strong> (a follow-up meeting, a trial with real data) or <strong>reputation</strong> (introducing you to their boss). Likes, compliments and “keep me posted” cost nothing.</p><p>Set a success threshold <em>before</em> the test — for example “10 of 50 interviewees pay a deposit” — then decide: continue, change direction (pivot), or stop.</p>',
          '<p>أفضل دليل يكلّف العميل شيئًا: <strong>المال</strong> (دفع مسبق، عربون)، أو <strong>الوقت</strong> (اجتماع متابعة، تجربة ببيانات حقيقية)، أو <strong>السمعة</strong> (تعريفك بمديره). الإعجابات والمجاملات و«أبقني على اطلاع» لا تكلّف شيئًا.</p><p>حدّد عتبة النجاح <em>قبل</em> الاختبار — مثل «10 من 50 ممن قابلتهم يدفعون عربونًا» — ثم قرر: الاستمرار، أو تغيير الاتجاه (التحوّل)، أو التوقف.</p>',
        )),
        exercise('entv-q006'),
        takeaways([
          L('Name the customer, the problem and today’s workaround', 'سمِّ العميل والمشكلة والحل البديل الحالي'),
          L('Ask about past behaviour, not opinions', 'اسأل عن السلوك السابق لا عن الآراء'),
          L('Test the riskiest assumption with the smallest MVP', 'اختبر الافتراض الأخطر بأصغر منتج أولي'),
          L('Trust commitment over compliments', 'ثق بالالتزام لا بالمجاملات'),
        ]),
      ],
    }),
  ],
  questions,
}
