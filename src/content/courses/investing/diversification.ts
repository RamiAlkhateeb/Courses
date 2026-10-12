// Original course content. Portfolio mixes and fee figures are illustrative examples, not recommendations.
import type { Module } from '../../types'
import { L, box, cover, exercise, html, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'diversification'
const P = 'invd'

const questions = [
  mcq(P, W, 1, 'diversification',
    L('Which risk can diversification reduce?', 'أي نوع من المخاطر يمكن للتنويع أن يقلله؟'),
    [L('The risk of one company or sector doing badly', 'خطر سوء أداء شركة أو قطاع واحد'), L('The risk of the whole market falling', 'خطر هبوط السوق بأكمله'), L('All risk', 'كل المخاطر')], 0),
  mcq(P, W, 2, 'allocation',
    L('Asset allocation is…', 'توزيع الأصول هو…'),
    [L('How you split money between asset classes such as stocks, bonds and cash', 'طريقة تقسيم المال بين فئات الأصول مثل الأسهم والسندات والنقد'), L('Choosing the single best stock', 'اختيار أفضل سهم منفرد'), L('The fee a fund charges', 'الرسوم التي يفرضها الصندوق')], 0),
  mcq(P, W, 3, 'fees',
    L('100,000 grows at 6% a year for 30 years. Roughly how much does a 1% yearly fee cost compared with a 0.1% fee?', 'ينمو مبلغ 100,000 بنسبة 6% سنويًا لمدة 30 سنة. كم تكلّف تقريبًا رسوم سنوية بنسبة 1% مقارنة برسوم 0.1%؟'),
    [L('About 126,000', 'نحو 126,000'), L('About 900', 'نحو 900'), L('Nothing — fees are too small to matter', 'لا شيء — الرسوم أصغر من أن تؤثر')], 0),
  mcq(P, W, 4, 'dca',
    L('Dollar-cost averaging means…', 'متوسط التكلفة (الاستثمار الدوري) يعني…'),
    [L('Investing a fixed amount at regular intervals regardless of price', 'استثمار مبلغ ثابت على فترات منتظمة بغض النظر عن السعر'), L('Buying only after prices fall', 'الشراء فقط بعد هبوط الأسعار'), L('Converting money to dollars', 'تحويل المال إلى دولارات')], 0),
  mcq(P, W, 5, 'rebalancing',
    L('Your target is 60% stocks / 40% bonds. After a strong year you hold 66/34. Rebalancing means…', 'هدفك 60% أسهم / 40% سندات. بعد عام قوي أصبحت تملك 66/34. إعادة التوازن تعني…'),
    [L('Selling some stocks or adding to bonds to get back to 60/40', 'بيع بعض الأسهم أو إضافة سندات للعودة إلى 60/40'), L('Buying more stocks because they are winning', 'شراء المزيد من الأسهم لأنها رابحة'), L('Selling everything', 'بيع كل شيء')], 0),
  mcq(P, W, 6, 'behaviour',
    L('The market drops 25% and you have 20 years until you need the money. Which reaction usually hurts long-term results most?', 'هبط السوق 25% وأمامك 20 سنة حتى تحتاج المال. أي ردة فعل تضر عادةً بالنتائج طويلة الأجل أكثر؟'),
    [L('Selling in panic and waiting on the sidelines', 'البيع بذعر والانتظار خارج السوق'), L('Sticking to the plan', 'الالتزام بالخطة'), L('Continuing regular contributions', 'الاستمرار في المساهمات المنتظمة')], 0),
  mcq(P, W, 7, 'behaviour',
    L('Buying whatever went up most last year is called…', 'شراء ما ارتفع أكثر في العام الماضي يُسمى…'),
    [L('Chasing performance', 'مطاردة الأداء'), L('Rebalancing', 'إعادة التوازن'), L('Hedging', 'التحوط')], 0),
]

export const diversification: Module = {
  id: W,
  courseId: 'investing',
  order: 3,
  cover: cover(
    L('Foundations · Module 3', 'الأساسيات · الوحدة 3'),
    L('Diversification, costs &amp; behaviour', 'التنويع والتكاليف والسلوك'),
    L('≈ 30 min', '≈ 30 دقيقة'),
  ),
  sections: [
    section({
      id: 'diversify',
      label: L('Part 1', 'الجزء ١'),
      nav: L('Diversification', 'التنويع'),
      title: L('Don’t put all your eggs in one basket', 'لا تضع كل البيض في سلة واحدة'),
      standfirst: L('Spreading money across many investments lowers the damage any single one can do.', 'توزيع المال على استثمارات كثيرة يقلل الضرر الذي يمكن أن يسببه أي استثمار منفرد.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        objectives([
          L('Explain what diversification can and cannot do', 'شرح ما يستطيع التنويع فعله وما لا يستطيع'),
          L('Describe asset allocation and rebalancing', 'وصف توزيع الأصول وإعادة التوازن'),
          L('Measure the long-term cost of fees', 'قياس التكلفة طويلة الأجل للرسوم'),
          L('Recognise the behaviour mistakes that cost investors most', 'التعرف على الأخطاء السلوكية الأكثر كلفة للمستثمرين'),
        ]),
        html(L(
          '<p>There are two kinds of risk. <strong>Specific risk</strong> belongs to one company or sector (a failed product, a scandal). <strong>Market risk</strong> hits almost everything at once (a recession). Holding many different companies, sectors and countries greatly reduces specific risk — but no amount of diversification removes market risk.</p>',
          '<p>هناك نوعان من المخاطر. <strong>المخاطر الخاصة</strong> ترتبط بشركة أو قطاع واحد (منتج فاشل، فضيحة). و<strong>مخاطر السوق</strong> تصيب كل شيء تقريبًا معًا (الركود). امتلاك شركات وقطاعات ودول مختلفة كثيرة يقلل المخاطر الخاصة كثيرًا — لكن لا يزيل أي قدر من التنويع مخاطر السوق.</p>',
        )),
        exercise('invd-q001'),
      ],
    }),
    section({
      id: 'allocation',
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Asset allocation', 'توزيع الأصول'),
      title: L('Asset allocation: the biggest decision', 'توزيع الأصول: القرار الأكبر'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>How you split money between stocks, bonds and cash drives most of your portfolio’s ups and downs. The right mix depends on your time horizon, goals and how much decline you can live with.</p>',
          '<p>طريقة تقسيم المال بين الأسهم والسندات والنقد تحدد معظم صعود محفظتك وهبوطها. يعتمد المزيج المناسب على أفقك الزمني وأهدافك ومقدار الهبوط الذي يمكنك تحمّله.</p>',
        )),
        table(
          [L('Illustrative mix', 'مزيج توضيحي'), L('Stocks / bonds', 'أسهم / سندات'), L('Character', 'الطابع')],
          [
            [L('Conservative', 'متحفظ'), L('30 / 70', '30 / 70'), L('Smaller swings, lower expected growth', 'تقلبات أصغر ونمو متوقع أقل')],
            [L('Balanced', 'متوازن'), L('60 / 40', '60 / 40'), L('Middle ground', 'حل وسط')],
            [L('Growth', 'نمو'), L('90 / 10', '90 / 10'), L('Large swings, higher expected growth, needs a long horizon', 'تقلبات كبيرة ونمو متوقع أعلى، ويحتاج أفقًا طويلًا')],
          ],
        ),
        box('keypoint', L('Not a recommendation', 'ليست توصية'), L(
          'These mixes only show the trade-off. The right one for you depends on your own situation.',
          'هذه الأمزجة توضح المفاضلة فقط. المزيج المناسب لك يعتمد على وضعك الخاص.',
        )),
        exercise('invd-q002'),
      ],
    }),
    section({
      id: 'fees',
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Costs and fees', 'التكاليف والرسوم'),
      title: L('Small fees, big difference', 'رسوم صغيرة وفرق كبير'),
      standfirst: L('You cannot control returns, but you can control costs.', 'لا يمكنك التحكم في العوائد، لكن يمكنك التحكم في التكاليف.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        table(
          [L('Yearly fee', 'الرسوم السنوية'), L('100,000 after 30 years at 6% before fees', '100,000 بعد 30 سنة بعائد 6% قبل الرسوم')],
          [
            [L('0.1%', '0.1%'), L('≈ 558,000', '≈ 558,000')],
            [L('1.0%', '1.0%'), L('≈ 432,000', '≈ 432,000')],
          ],
        ),
        html(L(
          '<p>The 0.9% difference costs about <strong>126,000</strong> — because fees compound against you just as returns compound for you. Also watch trading commissions, account fees, and the tax you pay on gains.</p>',
          '<p>فرق 0.9% يكلّف نحو <strong>126,000</strong> — لأن الرسوم تتراكم ضدك تمامًا كما تتراكم العوائد لصالحك. انتبه أيضًا لعمولات التداول ورسوم الحساب والضريبة على الأرباح.</p>',
        )),
        exercise('invd-q003'),
      ],
    }),
    section({
      id: 'habits',
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Regular investing & rebalancing', 'الاستثمار الدوري وإعادة التوازن'),
      title: L('Habits that help', 'عادات مفيدة'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<h3>Invest regularly</h3><p><strong>Dollar-cost averaging</strong>: invest the same amount every month. You automatically buy more units when prices are low and fewer when they are high, and you never have to guess the “right moment”. Timing the market consistently is extremely hard, even for professionals.</p><h3>Rebalance</h3><p>Over time the winners grow into a bigger share of the portfolio. With a 60/40 target, a year where stocks gain 30% and bonds 2% leaves you near 66/34. Rebalancing — once a year, or when a weight drifts more than ~5 points — brings risk back to what you chose.</p>',
          '<h3>استثمر بانتظام</h3><p><strong>متوسط التكلفة</strong>: استثمر المبلغ نفسه كل شهر. ستشتري تلقائيًا وحدات أكثر عندما تنخفض الأسعار وأقل عندما ترتفع، دون الحاجة لتخمين «اللحظة المناسبة». توقيت السوق باستمرار صعب جدًا، حتى على المحترفين.</p><h3>أعد التوازن</h3><p>مع الوقت يكبر وزن الأصول الرابحة في المحفظة. مع هدف 60/40، فإن عامًا ترتفع فيه الأسهم 30% والسندات 2% يتركك قرب 66/34. إعادة التوازن — مرة سنويًا، أو عندما ينحرف وزن بأكثر من ~5 نقاط — تعيد المخاطرة إلى ما اخترته.</p>',
        )),
        exercise('invd-q004'),
        exercise('invd-q005'),
      ],
    }),
    section({
      id: 'behaviour',
      label: L('Part 5', 'الجزء ٥'),
      nav: L('Behaviour mistakes', 'الأخطاء السلوكية'),
      title: L('Your biggest risk is often you', 'أكبر خطر عليك غالبًا هو أنت'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        table(
          [L('Mistake', 'الخطأ'), L('What it looks like', 'كيف يبدو'), L('Antidote', 'العلاج')],
          [
            [L('Panic selling', 'البيع بذعر'), L('Selling after a crash, locking in the loss', 'البيع بعد الانهيار وتثبيت الخسارة'), L('Write your plan down before the fall', 'دوّن خطتك قبل الهبوط')],
            [L('Chasing performance', 'مطاردة الأداء'), L('Buying last year’s winner at a high price', 'شراء الرابح في العام الماضي بسعر مرتفع'), L('Stick to your allocation', 'التزم بتوزيع أصولك')],
            [L('Overconfidence', 'الثقة المفرطة'), L('Frequent trading, concentrated bets', 'تداول متكرر ورهانات مركزة'), L('Diversify; trade rarely', 'نوّع وتداول نادرًا')],
            [L('Herd behaviour / FOMO', 'سلوك القطيع / الخوف من الفوات'), L('Buying because everyone is talking about it', 'الشراء لأن الجميع يتحدث عنه'), L('Ask: does this fit my goals?', 'اسأل: هل يناسب أهدافي؟')],
          ],
        ),
        box('analogy', L('Analogy', 'تشبيه'), L(
          'Investing is like growing a tree: digging it up every week to check the roots does not make it grow faster.',
          'الاستثمار كزراعة شجرة: اقتلاعها كل أسبوع لفحص الجذور لا يجعلها تنمو أسرع.',
        )),
        exercise('invd-q006'),
        exercise('invd-q007'),
        takeaways([
          L('Diversify across companies, sectors and countries', 'نوّع بين الشركات والقطاعات والدول'),
          L('Asset allocation sets most of your risk', 'توزيع الأصول يحدد معظم مخاطرتك'),
          L('Keep costs low — fees compound too', 'أبقِ التكاليف منخفضة — الرسوم تتراكم أيضًا'),
          L('Invest regularly, rebalance, and don’t panic', 'استثمر بانتظام، وأعد التوازن، ولا تهلع'),
        ]),
      ],
    }),
  ],
  questions,
}
