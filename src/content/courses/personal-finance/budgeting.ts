// Original course content. The 50/30/20 split and the 3–6 month buffer are common rules of thumb, not rules.
import type { Module } from '../../types'
import { L, box, cover, exercise, formula, html, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'budgeting'
const P = 'pfb'

const questions = [
  mcq(P, W, 1, 'income',
    L('A budget should start from…', 'يجب أن تبدأ الميزانية من…'),
    [L('Net income — what actually reaches your account after tax', 'صافي الدخل — ما يصل فعلًا إلى حسابك بعد الضريبة'), L('Gross salary before tax', 'الراتب الإجمالي قبل الضريبة'), L('The income you hope to earn next year', 'الدخل الذي تأمل أن تحققه العام القادم')], 0),
  mcq(P, W, 2, '50-30-20',
    L('Net income is 3,000 a month. Under the 50/30/20 guideline, how much goes to savings and debt repayment?', 'صافي الدخل 3,000 شهريًا. وفق قاعدة 50/30/20، كم يذهب للادخار وسداد الديون؟'),
    [L('600', '600'), L('900', '900'), L('1,500', '1,500')], 0),
  mcq(P, W, 3, 'needs-wants',
    L('Which is a “want” rather than a “need”?', 'أي مما يلي «رغبة» وليس «حاجة»؟'),
    [L('A streaming subscription', 'اشتراك في خدمة بث'), L('Rent', 'الإيجار'), L('Minimum loan payment', 'الحد الأدنى لقسط القرض')], 0),
  mcq(P, W, 4, 'pay-yourself-first',
    L('“Pay yourself first” means…', '«ادفع لنفسك أولًا» تعني…'),
    [L('Moving money to savings automatically on payday, before spending', 'تحويل المال إلى الادخار تلقائيًا يوم الراتب قبل الإنفاق'), L('Buying something nice for yourself each month', 'شراء شيء لطيف لنفسك كل شهر'), L('Saving whatever is left at month end', 'ادخار ما يتبقى في نهاية الشهر')], 0),
  mcq(P, W, 5, 'emergency',
    L('Essential expenses are 1,800 a month. A 3–6 month emergency fund is…', 'النفقات الأساسية 1,800 شهريًا. صندوق طوارئ يغطي 3–6 أشهر يساوي…'),
    [L('5,400 – 10,800', '5,400 – 10,800'), L('1,800', '1,800'), L('18,000 – 36,000', '18,000 – 36,000')], 0),
  mcq(P, W, 6, 'emergency',
    L('Where should an emergency fund usually be kept?', 'أين يُحفظ صندوق الطوارئ عادةً؟'),
    [L('A separate, easy-to-reach savings account', 'حساب توفير منفصل يسهل الوصول إليه'), L('Individual stocks', 'أسهم منفردة'), L('A long-term fixed deposit you cannot withdraw', 'وديعة طويلة الأجل لا يمكن سحبها')], 0),
]

export const budgeting: Module = {
  id: W,
  courseId: 'personal-finance',
  order: 1,
  cover: cover(L('Money basics · Module 1', 'أساسيات المال · الوحدة 1'), L('Budgeting &amp; emergency fund', 'الميزانية وصندوق الطوارئ'), L('≈ 20 min', '≈ 20 دقيقة')),
  sections: [
    section({
      id: 'cash-flow',
      label: L('Part 1', 'الجزء ١'),
      nav: L('Know your cash flow', 'اعرف تدفقك النقدي'),
      title: L('Know where your money goes', 'اعرف أين يذهب مالك'),
      standfirst: L('A budget is not a punishment — it is a plan that tells your money where to go instead of wondering where it went.', 'الميزانية ليست عقابًا — إنها خطة تخبر مالك أين يذهب بدل أن تتساءل أين ذهب.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        objectives([
          L('Work out your net income and spending', 'حساب صافي دخلك وإنفاقك'),
          L('Build a simple budget with the 50/30/20 guideline', 'بناء ميزانية بسيطة بقاعدة 50/30/20'),
          L('Automate saving', 'أتمتة الادخار'),
          L('Size and store an emergency fund', 'تحديد حجم صندوق الطوارئ ومكان حفظه'),
        ]),
        formula('Net income − spending = what you can save', L('If this is negative, the budget is the first thing to fix', 'إذا كانت سالبة، فالميزانية أول ما يجب إصلاحه')),
        html(L(
          '<ol><li>Write down your <strong>net</strong> monthly income (after tax and deductions).</li><li>Collect one to three months of bank and card statements.</li><li>Sort every expense into a few categories: housing, food, transport, bills, debt, fun, other.</li><li>Mark which are <strong>fixed</strong> (rent) and which are <strong>variable</strong> (eating out).</li></ol>',
          '<ol><li>دوّن صافي دخلك الشهري (<strong>بعد</strong> الضريبة والاقتطاعات).</li><li>اجمع كشوف الحساب والبطاقات لشهر إلى ثلاثة أشهر.</li><li>صنّف كل مصروف في فئات قليلة: السكن، الطعام، المواصلات، الفواتير، الديون، الترفيه، أخرى.</li><li>حدّد أيها <strong>ثابت</strong> (الإيجار) وأيها <strong>متغير</strong> (الأكل خارج المنزل).</li></ol>',
        )),
        exercise('pfb-q001'),
      ],
    }),
    section({
      id: 'plan',
      label: L('Part 2', 'الجزء ٢'),
      nav: L('The 50/30/20 guideline', 'قاعدة 50/30/20'),
      title: L('A simple starting point: 50/30/20', 'نقطة بداية بسيطة: 50/30/20'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        table(
          [L('Share of net income', 'النسبة من صافي الدخل'), L('For', 'لـ'), L('Examples', 'أمثلة')],
          [
            [L('50%', '50%'), L('Needs', 'الحاجات'), L('Rent, groceries, utilities, transport, minimum debt payments', 'الإيجار، البقالة، المرافق، المواصلات، الحد الأدنى لأقساط الديون')],
            [L('30%', '30%'), L('Wants', 'الرغبات'), L('Eating out, subscriptions, travel, hobbies', 'الأكل خارج المنزل، الاشتراكات، السفر، الهوايات')],
            [L('20%', '20%'), L('Savings and extra debt payments', 'الادخار والسداد الإضافي للديون'), L('Emergency fund, investing, paying debt down faster', 'صندوق الطوارئ، الاستثمار، تسريع سداد الديون')],
          ],
        ),
        box('keypoint', L('Adjust it', 'عدّله'), L(
          'In expensive cities needs may take 60% or more. That is fine — the guideline is a starting point. The important part is that savings get a fixed share.',
          'في المدن المكلفة قد تأخذ الحاجات 60% أو أكثر. لا بأس — القاعدة نقطة بداية. المهم أن يحصل الادخار على حصة ثابتة.',
        )),
        exercise('pfb-q002'),
        exercise('pfb-q003'),
      ],
    }),
    section({
      id: 'automate',
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Pay yourself first', 'ادفع لنفسك أولًا'),
      title: L('Pay yourself first', 'ادفع لنفسك أولًا'),
      time: L('4 min', '4 دقائق'),
      blocks: [
        html(L(
          '<p>Set up an automatic transfer to savings on the day your salary arrives. What you never see in your current account is much easier not to spend. Then spend what is left freely, within your categories.</p>',
          '<p>أنشئ تحويلًا تلقائيًا إلى الادخار في يوم وصول راتبك. ما لا تراه في حسابك الجاري يسهل كثيرًا ألا تنفقه. ثم أنفق ما يتبقى بحرية ضمن فئاتك.</p>',
        )),
        box('analogy', L('Analogy', 'تشبيه'), L(
          'Saving “whatever is left at the end of the month” is like planning to eat dessert with whatever room is left after a buffet — there rarely is any.',
          'ادخار «ما يتبقى في نهاية الشهر» يشبه التخطيط لتناول الحلوى بما يتبقى من مساحة بعد بوفيه مفتوح — نادرًا ما يتبقى شيء.',
        )),
        exercise('pfb-q004'),
      ],
    }),
    section({
      id: 'emergency',
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Emergency fund', 'صندوق الطوارئ'),
      title: L('Build an emergency fund', 'ابنِ صندوق طوارئ'),
      standfirst: L('A cushion for job loss, medical bills or a broken car — so a bad month does not turn into debt.', 'وسادة لفقدان العمل أو الفواتير الطبية أو تعطل السيارة — حتى لا يتحول شهر سيئ إلى دين.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        formula('Emergency fund ≈ essential monthly expenses × 3 to 6', L('More if your income is irregular or you support a family', 'أكثر إذا كان دخلك غير منتظم أو تعيل أسرة')),
        html(L(
          '<ul><li>Start with a small first target (for example one month) so you see progress.</li><li>Keep it in a <strong>separate</strong> savings account: safe, easy to reach, but not in your everyday account.</li><li>Use it only for real emergencies, then refill it.</li></ul>',
          '<ul><li>ابدأ بهدف أول صغير (مثل شهر واحد) لترى التقدم.</li><li>احفظه في حساب توفير <strong>منفصل</strong>: آمن وسهل الوصول، لكن ليس في حسابك اليومي.</li><li>استخدمه للطوارئ الحقيقية فقط، ثم أعد ملأه.</li></ul>',
        )),
        exercise('pfb-q005'),
        exercise('pfb-q006'),
        takeaways([
          L('Budget from net income, using real statements', 'ضع الميزانية من صافي الدخل وبالاعتماد على كشوف حقيقية'),
          L('50/30/20 is a starting point — give savings a fixed share', '50/30/20 نقطة بداية — امنح الادخار حصة ثابتة'),
          L('Automate saving on payday', 'أتمت الادخار يوم الراتب'),
          L('3–6 months of essentials, kept separate and easy to reach', 'نفقات أساسية لـ3–6 أشهر، منفصلة وسهلة الوصول'),
        ]),
      ],
    }),
  ],
  questions,
}
