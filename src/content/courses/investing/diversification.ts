// Original course content. Portfolio mixes and fee figures are illustrative examples, not recommendations.
import type { Module } from '../../types'
import { L, box, cover, diagram, exercise, html, keyIdea, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'diversification'
const P = 'invd'

const questions = [
  mcq(P, W, 1, 'diversification',
    L('Which risk can diversification reduce?', 'أي نوع من المخاطر يمكن للتنويع أن يقلله؟'),
    [L('The risk of one company or sector doing badly', 'خطر سوء أداء شركة أو قطاع واحد'), L('The risk of the whole market falling', 'خطر هبوط السوق بأكمله'), L('All risk', 'كل المخاطر')], 0,
    L('Spreading out limits the damage from one company or sector, but a market-wide fall still hits almost everything.', 'التوزيع يحد من ضرر شركة أو قطاع واحد، لكن هبوط السوق كله يصيب كل شيء تقريبًا.')),
  mcq(P, W, 2, 'allocation',
    L('Asset allocation is…', 'توزيع الأصول هو…'),
    [L('How you split money between asset classes such as stocks, bonds and cash', 'طريقة تقسيم المال بين فئات الأصول مثل الأسهم والسندات والنقد'), L('Choosing the single best stock', 'اختيار أفضل سهم منفرد'), L('The fee a fund charges', 'الرسوم التي يفرضها الصندوق')], 0,
    L('Allocation is the split between asset classes, and that split drives most of a portfolio’s ups and downs.', 'التوزيع هو التقسيم بين فئات الأصول، وهذا التقسيم يحدد معظم صعود المحفظة وهبوطها.')),
  mcq(P, W, 3, 'fees',
    L('100,000 grows at 6% a year for 30 years. Roughly how much does a 1% yearly fee cost compared with a 0.1% fee?', 'ينمو مبلغ 100,000 بنسبة 6% سنويًا لمدة 30 سنة. كم تكلّف تقريبًا رسوم سنوية بنسبة 1% مقارنة برسوم 0.1%؟'),
    [L('About 126,000', 'نحو 126,000'), L('About 900', 'نحو 900'), L('Nothing — fees are too small to matter', 'لا شيء — الرسوم أصغر من أن تؤثر')], 0,
    L('About 558,000 versus 432,000: the extra 0.9% a year compounds against you for 30 years.', 'نحو 558,000 مقابل 432,000: الـ0.9% الإضافية سنويًا تتراكم ضدك طوال 30 سنة.')),
  mcq(P, W, 4, 'dca',
    L('Dollar-cost averaging means…', 'متوسط التكلفة (الاستثمار الدوري) يعني…'),
    [L('Investing a fixed amount at regular intervals regardless of price', 'استثمار مبلغ ثابت على فترات منتظمة بغض النظر عن السعر'), L('Buying only after prices fall', 'الشراء فقط بعد هبوط الأسعار'), L('Converting money to dollars', 'تحويل المال إلى دولارات')], 0,
    L('The same amount on a schedule buys more units when prices are low and fewer when they are high, with no guessing.', 'المبلغ نفسه وفق جدول ثابت يشتري وحدات أكثر عندما تنخفض الأسعار وأقل عندما ترتفع، بلا تخمين.')),
  mcq(P, W, 5, 'rebalancing',
    L('Your target is 60% stocks / 40% bonds. After a strong year you hold 66/34. Rebalancing means…', 'هدفك 60% أسهم / 40% سندات. بعد عام قوي أصبحت تملك 66/34. إعادة التوازن تعني…'),
    [L('Selling some stocks or adding to bonds to get back to 60/40', 'بيع بعض الأسهم أو إضافة سندات للعودة إلى 60/40'), L('Buying more stocks because they are winning', 'شراء المزيد من الأسهم لأنها رابحة'), L('Selling everything', 'بيع كل شيء')], 0,
    L('Rebalancing trims what grew too big and tops up what fell behind, bringing risk back to the 60/40 you chose.', 'إعادة التوازن تقلّص ما كبر أكثر من اللازم وتزيد ما تأخر، فتعيد المخاطرة إلى 60/40 التي اخترتها.')),
  mcq(P, W, 6, 'behaviour',
    L('The market drops 25% and you have 20 years until you need the money. Which reaction usually hurts long-term results most?', 'هبط السوق 25% وأمامك 20 سنة حتى تحتاج المال. أي ردة فعل تضر عادةً بالنتائج طويلة الأجل أكثر؟'),
    [L('Selling in panic and waiting on the sidelines', 'البيع بذعر والانتظار خارج السوق'), L('Sticking to the plan', 'الالتزام بالخطة'), L('Continuing regular contributions', 'الاستمرار في المساهمات المنتظمة')], 0,
    L('Selling after a fall locks in the loss, and waiting outside often means missing the recovery.', 'البيع بعد الهبوط يثبّت الخسارة، والانتظار خارج السوق كثيرًا ما يعني تفويت التعافي.')),
  mcq(P, W, 7, 'behaviour',
    L('Buying whatever went up most last year is called…', 'شراء ما ارتفع أكثر في العام الماضي يُسمى…'),
    [L('Chasing performance', 'مطاردة الأداء'), L('Rebalancing', 'إعادة التوازن'), L('Hedging', 'التحوط')], 0,
    L('Chasing performance means buying last year’s winner, often after its price has already risen.', 'مطاردة الأداء تعني شراء رابح العام الماضي، غالبًا بعد أن يكون سعره قد ارتفع بالفعل.')),
  mcq(P, W, 8, 'diversification',
    L('You own 20 companies in equal amounts and one goes bankrupt. Roughly how much do you lose?', 'تملك 20 شركة بمبالغ متساوية وأفلست إحداها. كم تخسر تقريبًا؟'),
    [L('About 5%', 'نحو 5%'), L('About 50%', 'نحو 50%'), L('Everything', 'كل شيء')], 0,
    L('One company out of twenty is a twentieth of your money: about 5%.', 'شركة واحدة من عشرين تعني جزءًا من عشرين من مالك: نحو 5%.')),
  mcq(P, W, 9, 'allocation',
    L('Who can usually live with a growth mix that has large swings?', 'من يستطيع عادةً تحمّل مزيج نمو بتقلبات كبيرة؟'),
    [L('Someone who will not need the money for 20+ years', 'شخص لن يحتاج المال قبل 20 سنة أو أكثر'), L('Someone buying a house next year', 'شخص سيشتري منزلًا العام القادم'), L('Someone who would panic at a 10% fall', 'شخص سيهلع من هبوط 10%')], 0,
    L('A long horizon gives time to recover from falls. Money needed soon, or nerves that would sell in a fall, call for a calmer mix.', 'الأفق الطويل يمنح وقتًا للتعافي من الهبوط. أما المال المطلوب قريبًا أو الأعصاب التي ستبيع عند الهبوط فتحتاج مزيجًا أهدأ.')),
  mcq(P, W, 10, 'fees',
    L('Which of these can you control?', 'أي مما يلي يمكنك التحكم فيه؟'),
    [L('The fees you pay', 'الرسوم التي تدفعها'), L('Next year’s market return', 'عائد السوق في العام القادم'), L('Interest rate decisions', 'قرارات أسعار الفائدة')], 0,
    L('Nobody controls returns or rates, but you choose what you pay, and every saved fee keeps compounding for you.', 'لا أحد يتحكم في العوائد أو الفائدة، لكنك تختار ما تدفعه، وكل رسم توفّره يواصل التراكم لصالحك.')),
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
      lessons: ['diversify'],
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
        html(L(
          '<p>Put the same money into one company, or spread it over twenty. If one company fails, the first loses <strong>everything</strong>; the second loses about <strong>a twentieth</strong>.</p>',
          '<p>ضع المال نفسه في شركة واحدة، أو وزّعه على عشرين. إذا فشلت شركة، يخسر الأول <strong>كل شيء</strong>؛ ويخسر الثاني نحو <strong>جزء من عشرين</strong>.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('One basket or twenty', 'سلة واحدة أم عشرون'),
          src: '/diagrams/diversify.svg',
          alt: L(
            'Left: all the money in one company that fails, a loss of 100%. Right: the money spread over 20 companies, one fails, a loss of about 5%.',
            'يسارًا: كل المال في شركة واحدة تفشل، خسارة 100%. يمينًا: المال موزع على 20 شركة تفشل إحداها، خسارة نحو 5%.',
          ),
          caption: L('Left: one company. Right: twenty companies, one fails. Illustrative.', 'يسارًا: شركة واحدة. يمينًا: عشرون شركة تفشل إحداها. توضيحي.'),
        }),
        keyIdea(L(
          '<p>Diversification shrinks the damage from <strong>one bad company</strong>, but not from a fall of the whole market.</p>',
          '<p>التنويع يقلّص ضرر <strong>شركة سيئة واحدة</strong>، لا ضرر هبوط السوق كله.</p>',
        )),
        exercise('invd-q001'),
        exercise('invd-q008'),
      ],
    }),
    section({
      id: 'allocation',
      lessons: ['allocation'],
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
        keyIdea(L(
          '<p>Your mix of stocks, bonds and cash sets <strong>most of your risk</strong>, so choose it for your horizon, not for last year’s winner.</p>',
          '<p>مزيجك من الأسهم والسندات والنقد يحدد <strong>معظم مخاطرتك</strong>، فاختره وفق أفقك الزمني لا وفق رابح العام الماضي.</p>',
        )),
        exercise('invd-q002'),
        exercise('invd-q009'),
      ],
    }),
    section({
      id: 'fees',
      lessons: ['fees'],
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
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Two fees, thirty years', 'رسمان وثلاثون سنة'),
          src: '/diagrams/fees.svg',
          alt: L(
            'Line chart: 100,000 grows to about 558,000 with a 0.1% fee and to about 432,000 with a 1% fee after 30 years, a gap of about 126,000.',
            'رسم بالخطوط: 100,000 تنمو إلى نحو 558,000 برسوم 0.1% وإلى نحو 432,000 برسوم 1% بعد 30 سنة، بفارق نحو 126,000.',
          ),
          caption: L('Years from now. Dark: 0.1% fee. Light: 1% fee. Illustrative figures.', 'السنوات من الآن. الداكن: رسوم 0.1%. الفاتح: رسوم 1%. أرقام توضيحية.'),
        }),
        box('example', L('Example', 'مثال'), L(
          'Like a phone subscription you forgot to cancel, a fund fee is small each time but never stops. And unlike the subscription, it also takes the growth that money would have earned.',
          'مثل اشتراك هاتف نسيت إلغاءه، رسوم الصندوق صغيرة في كل مرة لكنها لا تتوقف. وعلى عكس الاشتراك، تأخذ أيضًا النمو الذي كان سيحققه ذلك المال.',
        )),
        keyIdea(L(
          '<p>You cannot control returns, but you can control <strong>costs</strong>, and fees compound against you.</p>',
          '<p>لا يمكنك التحكم في العوائد، لكن يمكنك التحكم في <strong>التكاليف</strong>، والرسوم تتراكم ضدك.</p>',
        )),
        exercise('invd-q003'),
        exercise('invd-q010'),
      ],
    }),
    section({
      id: 'habits',
      lessons: ['habits'],
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Regular investing & rebalancing', 'الاستثمار الدوري وإعادة التوازن'),
      title: L('Habits that help', 'عادات مفيدة'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<h3>Invest regularly</h3><p><strong>Dollar-cost averaging</strong>: invest the same amount every month. You automatically buy more units when prices are low and fewer when they are high, and you never have to guess the “right moment”. Timing the market consistently is extremely hard, even for professionals.</p><h3>Rebalance</h3><p>Over time the winners grow into a bigger share of the portfolio. With a 60/40 target, a year where stocks gain 30% and bonds 2% leaves you near 66/34. Rebalancing — once a year, or when a weight drifts more than ~5 points — brings risk back to what you chose.</p>',
          '<h3>استثمر بانتظام</h3><p><strong>متوسط التكلفة</strong>: استثمر المبلغ نفسه كل شهر. ستشتري تلقائيًا وحدات أكثر عندما تنخفض الأسعار وأقل عندما ترتفع، دون الحاجة لتخمين «اللحظة المناسبة». توقيت السوق باستمرار صعب جدًا، حتى على المحترفين.</p><h3>أعد التوازن</h3><p>مع الوقت يكبر وزن الأصول الرابحة في المحفظة. مع هدف 60/40، فإن عامًا ترتفع فيه الأسهم 30% والسندات 2% يتركك قرب 66/34. إعادة التوازن — مرة سنويًا، أو عندما ينحرف وزن بأكثر من ~5 نقاط — تعيد المخاطرة إلى ما اخترته.</p>',
        )),
        box('example', L('Example', 'مثال'), L(
          'Invest 100 every month. When the price is 10 you get 10 units; when it drops to 5 you get 20. The habit buys more when things are cheap. (Illustrative figures.)',
          'استثمر 100 كل شهر. عندما يكون السعر 10 تحصل على 10 وحدات؛ وعندما ينخفض إلى 5 تحصل على 20. هذه العادة تشتري أكثر عندما تكون الأسعار رخيصة. (أرقام توضيحية.)',
        )),
        keyIdea(L(
          '<p>Invest a <strong>fixed amount regularly</strong> and rebalance now and then: no need to guess the right moment.</p>',
          '<p>استثمر <strong>مبلغًا ثابتًا بانتظام</strong> وأعد التوازن بين حين وآخر: لا حاجة لتخمين اللحظة المناسبة.</p>',
        )),
        exercise('invd-q004'),
        exercise('invd-q005'),
      ],
    }),
    section({
      id: 'behaviour',
      lessons: ['behaviour'],
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
        keyIdea(L(
          '<p>Your written plan protects you from <strong>yourself</strong>: decide what you will do before the market falls.</p>',
          '<p>خطتك المكتوبة تحميك من <strong>نفسك</strong>: قرّر ما ستفعله قبل أن يهبط السوق.</p>',
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
