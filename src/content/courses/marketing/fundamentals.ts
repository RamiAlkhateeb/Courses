// Original course content. The LTV:CAC ≈ 3:1 benchmark is a common rule of thumb, mostly from subscription businesses.
import type { Module } from '../../types'
import { L, box, cover, exercise, formula, html, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'fundamentals'
const P = 'mktf'

const questions = [
  mcq(P, W, 1, 'stp',
    L('What is the correct order of the STP process?', 'ما الترتيب الصحيح لعملية STP؟'),
    [L('Segment the market → choose target segments → position your offer', 'تجزئة السوق ← اختيار الشرائح المستهدفة ← تموضع عرضك'), L('Position → segment → target', 'التموضع ← التجزئة ← الاستهداف'), L('Target everyone → segment later', 'استهداف الجميع ← التجزئة لاحقًا')], 0),
  mcq(P, W, 2, 'positioning',
    L('Positioning is…', 'التموضع هو…'),
    [L('The place you want your product to hold in the target customer’s mind, compared with alternatives', 'المكانة التي تريد أن يشغلها منتجك في ذهن العميل المستهدف مقارنة بالبدائل'), L('Where the product sits on a shop shelf', 'مكان المنتج على رف المتجر'), L('Your advertising budget', 'ميزانيتك الإعلانية')], 0),
  mcq(P, W, 3, '4ps',
    L('Which is NOT one of the 4 Ps of the marketing mix?', 'أي مما يلي ليس من عناصر المزيج التسويقي 4P؟'),
    [L('Profit', 'الربح (Profit)'), L('Price', 'السعر (Price)'), L('Place', 'المكان (Place)')], 0),
  mcq(P, W, 4, 'funnel',
    L('2,000 people visit your shop page and 50 buy. What is the conversion rate?', 'زار صفحة متجرك 2,000 شخص واشترى 50. ما معدل التحويل؟'),
    [L('2.5%', '2.5%'), L('25%', '25%'), L('0.25%', '0.25%')], 0),
  mcq(P, W, 5, 'metrics',
    L('A customer pays 30 a month at a 70% gross margin and stays 20 months on average. What is their lifetime value (LTV)?', 'يدفع العميل 30 شهريًا بهامش ربح إجمالي 70% ويبقى 20 شهرًا في المتوسط. ما قيمته على مدى العلاقة (LTV)؟'),
    [L('420', '420'), L('600', '600'), L('21', '21')], 0),
  mcq(P, W, 6, 'metrics',
    L('LTV is 420 and it costs 400 to acquire each customer. What does this suggest?', 'قيمة LTV تساوي 420 وتكلفة اكتساب كل عميل 400. علامَ يدل ذلك؟'),
    [L('Acquisition is too expensive for the value — barely break-even', 'الاكتساب مكلف جدًا مقارنة بالقيمة — بالكاد تعادل'), L('A very healthy business', 'عمل صحي جدًا'), L('Spend more on ads immediately', 'زِد الإنفاق الإعلاني فورًا')], 0),
]

export const fundamentals: Module = {
  id: W,
  courseId: 'marketing',
  order: 1,
  cover: cover(L('Foundations · Module 1', 'الأساسيات · الوحدة 1'), L('Customers, positioning &amp; the funnel', 'العملاء والتموضع ومسار التحويل'), L('≈ 25 min', '≈ 25 دقيقة')),
  sections: [
    section({
      id: 'stp',
      label: L('Part 1', 'الجزء ١'),
      nav: L('Segment, target, position', 'التجزئة والاستهداف والتموضع'),
      title: L('Segment, target, position', 'التجزئة والاستهداف والتموضع'),
      standfirst: L('Marketing to everyone is marketing to no one. Choose who you serve first.', 'التسويق للجميع تسويق لا أحد. اختر أولًا من تخدم.'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        objectives([
          L('Segment a market and choose a target', 'تجزئة السوق واختيار هدف'),
          L('Write a positioning statement', 'كتابة بيان التموضع'),
          L('Use the 4 Ps to shape an offer', 'استخدام عناصر 4P لتشكيل العرض'),
          L('Measure the funnel, CAC and LTV', 'قياس مسار التحويل وتكلفة الاكتساب وقيمة العميل'),
        ]),
        table(
          [L('Step', 'الخطوة'), L('Question', 'السؤال')],
          [
            [L('<strong>Segmentation</strong>', '<strong>التجزئة</strong>'), L('Which groups of customers have different needs? (by age, location, industry, behaviour, budget…)', 'ما مجموعات العملاء ذات الاحتياجات المختلفة؟ (حسب العمر، الموقع، القطاع، السلوك، الميزانية…)')],
            [L('<strong>Targeting</strong>', '<strong>الاستهداف</strong>'), L('Which segment can we serve best, and is it big enough to be worth it?', 'أي شريحة يمكننا خدمتها بأفضل شكل، وهل هي كبيرة بما يكفي لتستحق؟')],
            [L('<strong>Positioning</strong>', '<strong>التموضع</strong>'), L('Why should that segment choose us over the alternatives?', 'لماذا يجب أن تختارنا تلك الشريحة بدل البدائل؟')],
          ],
        ),
        box('example', L('Positioning statement template', 'قالب بيان التموضع'), L(
          'For <em>[target customer]</em> who <em>[need]</em>, <em>[product]</em> is a <em>[category]</em> that <em>[key benefit]</em>. Unlike <em>[main alternative]</em>, we <em>[key difference]</em>.',
          'لـ<em>[العميل المستهدف]</em> الذي <em>[الحاجة]</em>، فإن <em>[المنتج]</em> هو <em>[الفئة]</em> الذي <em>[الفائدة الرئيسية]</em>. على عكس <em>[البديل الرئيسي]</em>، نحن <em>[الفرق الرئيسي]</em>.',
        )),
        exercise('mktf-q001'),
        exercise('mktf-q002'),
      ],
    }),
    section({
      id: 'mix',
      label: L('Part 2', 'الجزء ٢'),
      nav: L('The 4 Ps', 'عناصر 4P'),
      title: L('The marketing mix: the 4 Ps', 'المزيج التسويقي: عناصر 4P'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        table(
          [L('P', 'العنصر'), L('Decisions', 'القرارات')],
          [
            [L('<strong>Product</strong>', '<strong>المنتج</strong>'), L('Features, quality, packaging, service', 'الخصائص، الجودة، التغليف، الخدمة')],
            [L('<strong>Price</strong>', '<strong>السعر</strong>'), L('List price, discounts, payment terms, subscription or one-off', 'السعر المعلن، الخصومات، شروط الدفع، اشتراك أو دفعة واحدة')],
            [L('<strong>Place</strong>', '<strong>المكان</strong>'), L('Where and how customers buy: online, shops, distributors', 'أين وكيف يشتري العملاء: عبر الإنترنت، المتاجر، الموزعون')],
            [L('<strong>Promotion</strong>', '<strong>الترويج</strong>'), L('Advertising, social media, content, PR, sales team', 'الإعلان، وسائل التواصل، المحتوى، العلاقات العامة، فريق المبيعات')],
          ],
        ),
        box('keypoint', L('Consistency', 'الاتساق'), L(
          'The four must tell the same story. A “premium” product sold at bargain prices in discount bins confuses customers.',
          'يجب أن تروي العناصر الأربعة القصة نفسها. منتج «فاخر» يُباع بأسعار زهيدة في سلال التخفيضات يربك العملاء.',
        )),
        exercise('mktf-q003'),
      ],
    }),
    section({
      id: 'funnel',
      label: L('Part 3', 'الجزء ٣'),
      nav: L('The funnel', 'مسار التحويل'),
      title: L('The funnel: from stranger to loyal customer', 'مسار التحويل: من غريب إلى عميل وفيّ'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        table(
          [L('Stage', 'المرحلة'), L('Goal', 'الهدف'), L('Example metric', 'مثال على مقياس')],
          [
            [L('Awareness', 'الوعي'), L('They hear about you', 'يسمعون عنك'), L('Reach, impressions', 'الوصول، مرات الظهور')],
            [L('Consideration', 'الاهتمام'), L('They compare you with alternatives', 'يقارنونك بالبدائل'), L('Site visits, sign-ups', 'زيارات الموقع، التسجيلات')],
            [L('Conversion', 'التحويل'), L('They buy', 'يشترون'), L('Conversion rate', 'معدل التحويل')],
            [L('Retention', 'الاحتفاظ'), L('They buy again and recommend you', 'يشترون مجددًا ويوصون بك'), L('Repeat rate, churn', 'معدل التكرار، معدل الفقد')],
          ],
        ),
        formula('Conversion rate = buyers ÷ visitors × 100%', L('Find the stage where most people drop out and fix that first', 'اعثر على المرحلة التي يخرج فيها معظم الناس وأصلحها أولًا')),
        exercise('mktf-q004'),
      ],
    }),
    section({
      id: 'metrics',
      label: L('Part 4', 'الجزء ٤'),
      nav: L('CAC and LTV', 'تكلفة الاكتساب وقيمة العميل'),
      title: L('Is your marketing worth it? CAC and LTV', 'هل يستحق تسويقك؟ تكلفة الاكتساب وقيمة العميل'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        formula('CAC = marketing & sales spend ÷ new customers', L('Customer acquisition cost', 'تكلفة اكتساب العميل')),
        formula('LTV = monthly revenue × gross margin × months retained', L('Lifetime value — the gross profit a customer brings', 'قيمة العميل على مدى العلاقة — مجمل الربح الذي يجلبه')),
        html(L(
          '<p>Example: a customer pays 30 a month, the gross margin is 70% and customers stay 20 months on average: LTV = 30 × 0.7 × 20 = <strong>420</strong>. If you spend 14,000 to win 100 customers, CAC = <strong>140</strong>, so LTV : CAC = 3 : 1.</p>',
          '<p>مثال: يدفع العميل 30 شهريًا، وهامش الربح الإجمالي 70%، ويبقى العملاء 20 شهرًا في المتوسط: LTV = 30 × 0.7 × 20 = <strong>420</strong>. إذا أنفقت 14,000 لكسب 100 عميل، فإن CAC = <strong>140</strong>، أي أن LTV : CAC = 3 : 1.</p>',
        )),
        box('keypoint', L('Rule of thumb', 'قاعدة عامة'), L(
          'Around 3 : 1 is often seen as healthy. Near 1 : 1 you lose money once other costs are counted; far above 3 : 1 you may be under-investing in growth.',
          'تُعد نسبة 3 : 1 تقريبًا صحية في الغالب. عند 1 : 1 تقريبًا تخسر المال بعد احتساب التكاليف الأخرى؛ وإن كانت أعلى بكثير من 3 : 1 فقد تكون مقصّرًا في الاستثمار بالنمو.',
        )),
        exercise('mktf-q005'),
        exercise('mktf-q006'),
        takeaways([
          L('Choose a target segment before choosing tactics', 'اختر الشريحة المستهدفة قبل اختيار الأساليب'),
          L('Positioning: why us, for whom, versus what', 'التموضع: لماذا نحن، ولمن، ومقابل ماذا'),
          L('Keep the 4 Ps consistent', 'حافظ على اتساق عناصر 4P'),
          L('Measure the funnel and compare LTV with CAC', 'قِس مسار التحويل وقارن LTV بـCAC'),
        ]),
      ],
    }),
  ],
  questions,
}
