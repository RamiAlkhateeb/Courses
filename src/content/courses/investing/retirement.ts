// Original course content. Explains retirement saving in general, country-neutral terms; no products or providers are
// recommended, and every figure is an illustration, not a forecast. Rules differ by country.
// The story goes on: Noor (نور) and Karim (كريم) plan for the longest goal of all.
import type { Module } from '../../types'
import { L, box, choice, compoundCalculator, cover, diagram, exercise, html, keyIdea, mcq, myth, practice, predict, section, sort, table, takeaways } from '../../helpers'

const W = 'retirement'
const P = 'invr'

const questions = [
  mcq(P, W, 1, 'start-early',
    L('Amira invests 200 a month from 25 to 35, then stops. Omar invests 200 a month from 35 to 65. Both earn 7% a year. Who has more at 65? (Illustrative figures.)', 'تستثمر أميرة 200 شهريًا من سن 25 إلى 35 ثم تتوقف. ويستثمر عمر 200 شهريًا من سن 35 إلى 65. كلاهما يحقق 7% سنويًا. من يملك أكثر في سن 65؟ (أرقام توضيحية.)'),
    [L('Amira, with about 281,000 from only 24,000 put in', 'أميرة، بنحو 281,000 من 24,000 فقط وضعتها'), L('Omar, because he put in three times as much', 'عمر، لأنه وضع ثلاثة أضعاف المبلغ'), L('They end up with the same', 'ينتهيان بالمبلغ نفسه')], 0,
    L('Amira’s 24,000 compounds for 30 more years and reaches about 281,000. Omar’s 72,000 reaches about 244,000: early money has more time to grow.', 'تتراكم الـ24,000 التي وضعتها أميرة لمدة 30 سنة إضافية فتصل إلى نحو 281,000، بينما تصل الـ72,000 التي وضعها عمر إلى نحو 244,000: المال المبكر يملك وقتًا أطول لينمو.')),
  mcq(P, W, 2, 'start-early',
    L('Starting at 25 instead of 35 adds 24,000 of contributions but about 281,000 to the final pot. Where does most of the difference come from?', 'البدء في سن 25 بدل 35 يضيف 24,000 من المساهمات، لكنه يضيف نحو 281,000 إلى الرصيد النهائي. من أين يأتي معظم الفرق؟'),
    [L('Ten extra years of growth on the earliest contributions', 'عشر سنوات إضافية من النمو على أول المساهمات'), L('Higher returns for younger investors', 'عوائد أعلى للمستثمرين الأصغر سنًا'), L('Lower fees for long accounts', 'رسوم أقل للحسابات الطويلة')], 0,
    L('The return is the same 7% in both cases. The early contributions simply compound for ten more years, and the last years of compounding add the most.', 'العائد هو 7% نفسها في الحالتين. المساهمات المبكرة تتراكم ببساطة عشر سنوات أخرى، والسنوات الأخيرة من التراكم تضيف أكثر من غيرها.')),
  mcq(P, W, 3, 'employer',
    L('Your employer matches half of what you put into the workplace plan, up to 6% of salary. On a 40,000 salary you put in 6%. How much does the employer add? (Illustrative figures.)', 'يطابق صاحب العمل نصف ما تضعه في خطة العمل، حتى 6% من الراتب. براتب 40,000 تضع 6%. كم يضيف صاحب العمل؟ (أرقام توضيحية.)'),
    [L('1,200 a year', '1,200 سنويًا'), L('2,400 a year', '2,400 سنويًا'), L('Nothing until you retire', 'لا شيء حتى تتقاعد')], 0,
    L('6% of 40,000 is 2,400, and half of that is 1,200: extra money on top of your own, before any market growth.', '6% من 40,000 تساوي 2,400، ونصفها 1,200: مال إضافي فوق مالك، قبل أي نمو في السوق.')),
  mcq(P, W, 4, 'employer',
    L('In a defined contribution plan, what decides how much you have at retirement?', 'في خطة المساهمات المحددة، ما الذي يحدد ما تملكه عند التقاعد؟'),
    [L('How much goes in and how the investments perform', 'مقدار ما يُدفع فيها وأداء الاستثمارات'), L('A fixed promise based on your final salary', 'وعد ثابت مبني على راتبك الأخير'), L('Nothing: the amount is the same for everyone', 'لا شيء: المبلغ واحد للجميع')], 0,
    L('A defined contribution plan is your own pot: contributions plus investment returns. A fixed promise based on salary describes a defined benefit plan.', 'خطة المساهمات المحددة رصيدك الخاص: المساهمات مضافًا إليها عوائد الاستثمار. أما الوعد الثابت المبني على الراتب فيصف خطة المزايا المحددة.')),
  mcq(P, W, 5, 'tax',
    L('In a tax-deferred account, when do you usually pay income tax?', 'في الحساب المؤجَّل الضريبة، متى تدفع ضريبة الدخل عادةً؟'),
    [L('When you take the money out', 'عندما تسحب المال'), L('Every year on the growth', 'كل عام على النمو'), L('Never', 'أبدًا')], 0,
    L('Tax-deferred means “later”: money goes in before tax and grows untaxed, and income tax is due when you withdraw it.', 'مؤجَّل الضريبة يعني «لاحقًا»: يدخل المال قبل الضريبة وينمو دون ضريبة، وتُستحق ضريبة الدخل عند السحب.')),
  mcq(P, W, 6, 'tax',
    L('10,000 grows at 6% a year for 30 years. Roughly how much more is there if the growth is not taxed each year, compared with 20% tax on each year’s growth?', 'تنمو 10,000 بعائد 6% سنويًا لمدة 30 سنة. كم يزيد المبلغ تقريبًا إذا لم يُفرض ضريبة على النمو كل عام، مقارنة بضريبة 20% على نمو كل عام؟'),
    [L('About 16,600', 'نحو 16,600'), L('About 600', 'نحو 600'), L('No difference', 'لا فرق')], 0,
    L('About 57,400 versus 40,800. Tax taken every year shrinks the base that compounds, so the gap widens with time.', 'نحو 57,400 مقابل 40,800. الضريبة المقتطعة كل عام تصغّر الأساس الذي يتراكم، فيتسع الفارق مع الوقت.')),
  mcq(P, W, 7, 'tax',
    L('You read about a retirement account with a specific name from another country. What is the safest conclusion?', 'قرأت عن حساب تقاعد باسم معيّن في بلد آخر. ما الاستنتاج الأسلم؟'),
    [L('The idea may carry over, but the rules are local: check your own country’s rules or a licensed adviser', 'قد تنطبق الفكرة، لكن القواعد محلية: راجع قواعد بلدك أو مستشارًا مرخّصًا'), L('The same account and limits exist everywhere', 'الحساب نفسه وحدوده موجودة في كل مكان'), L('Tax rules never change', 'قواعد الضرائب لا تتغير أبدًا')], 0,
    L('Names, limits, ages and tax rates differ by country and change over time. The concepts travel; the details have to be checked locally.', 'الأسماء والحدود والأعمار ونسب الضريبة تختلف من بلد لآخر وتتغير مع الوقت. المفاهيم تنتقل، أما التفاصيل فيجب التحقق منها محليًا.')),
  mcq(P, W, 8, 'saving-rate',
    L('“Pay yourself first” means…', '«ادفع لنفسك أولًا» تعني…'),
    [L('Moving a set share of income to savings on payday, before spending', 'تحويل نسبة محددة من الدخل إلى الادخار يوم الراتب، قبل الإنفاق'), L('Saving whatever is left at the end of the month', 'ادخار ما يتبقى في نهاية الشهر'), L('Buying something for yourself before paying bills', 'شراء شيء لنفسك قبل دفع الفواتير')], 0,
    L('Saving first, ideally automatically, makes it a habit that does not depend on how much is left over at the end of the month.', 'الادخار أولًا، ويُفضّل أن يكون تلقائيًا، يجعله عادة لا تعتمد على ما يتبقى في نهاية الشهر.')),
  mcq(P, W, 9, 'saving-rate',
    L('At 35 you take 10,000 out of a retirement account early. Besides any penalty and tax, what else does it cost? (Illustrative, at 7% a year.)', 'في سن 35 تسحب 10,000 مبكرًا من حساب التقاعد. إلى جانب أي غرامة وضريبة، ماذا يكلّفك أيضًا؟ (توضيحي، بعائد 7% سنويًا.)'),
    [L('The growth it would have earned: about 76,000 by 65', 'النمو الذي كان سيحققه: نحو 76,000 عند سن 65'), L('Nothing else', 'لا شيء آخر'), L('Only a small bank fee', 'رسوم مصرفية صغيرة فقط')], 0,
    L('10,000 left to grow at 7% for 30 years becomes about 76,000. Taking it out early gives up that growth for good.', '10,000 تُترك لتنمو بعائد 7% لمدة 30 سنة تصبح نحو 76,000. سحبها مبكرًا يتخلى عن هذا النمو نهائيًا.')),
  mcq(P, W, 10, 'lifecycle',
    L('What does a target-date (lifecycle) fund do?', 'ماذا يفعل صندوق التاريخ المستهدف (صندوق دورة الحياة)؟'),
    [L('Gradually shifts from stocks towards bonds and cash as its target year approaches', 'ينتقل تدريجيًا من الأسهم نحو السندات والنقد كلما اقتربت سنته المستهدفة'), L('Guarantees a set amount on the target date', 'يضمن مبلغًا محددًا في التاريخ المستهدف'), L('Holds only cash until the target year', 'يحتفظ بالنقد فقط حتى السنة المستهدفة')], 0,
    L('It follows a glide path: growth-heavy when the target is far away, calmer as it gets close. Nothing about it is guaranteed.', 'يتبع مسار انحدار: يميل إلى النمو عندما يكون الهدف بعيدًا، ويصبح أهدأ كلما اقترب. ولا شيء فيه مضمون.')),
  mcq(P, W, 11, 'lifecycle',
    L('Why does the mix usually get calmer close to retirement?', 'لماذا يصبح المزيج عادةً أهدأ قرب التقاعد؟'),
    [L('A big fall just before or during withdrawals has little time to recover', 'الهبوط الكبير قبيل السحب أو أثناءه لا يجد وقتًا كافيًا للتعافي'), L('Stocks stop growing after 60', 'الأسهم تتوقف عن النمو بعد سن 60'), L('Bonds always return more than stocks', 'السندات تحقق دائمًا أكثر من الأسهم')], 0,
    L('With a short horizon and money starting to come out, a 30% fall can do lasting damage, so smaller swings matter more than higher growth.', 'مع أفق قصير وبدء سحب المال، قد يُحدث هبوط بنسبة 30% ضررًا دائمًا، فتصبح التقلبات الأصغر أهم من النمو الأعلى.')),
  mcq(P, W, 12, 'drawdown',
    L('Using the 4% rule as a rough illustration, how much might savings of 500,000 provide in the first year?', 'باستخدام قاعدة 4% كتوضيح تقريبي، كم قد توفّر مدخرات قدرها 500,000 في السنة الأولى؟'),
    [L('About 20,000', 'نحو 20,000'), L('About 50,000', 'نحو 50,000'), L('About 4,000', 'نحو 4,000')], 0,
    L('4% of 500,000 is 20,000. In later years that amount is raised with inflation rather than recalculated.', '4% من 500,000 تساوي 20,000. وفي السنوات التالية يُرفع هذا المبلغ مع التضخم بدل إعادة حسابه.')),
  mcq(P, W, 13, 'drawdown',
    L('Prices rise 3% a year through a 24-year retirement. Roughly what happens to the cost of the same shopping?', 'ترتفع الأسعار 3% سنويًا خلال تقاعد يمتد 24 سنة. ماذا يحدث تقريبًا لتكلفة المشتريات نفسها؟'),
    [L('It roughly doubles', 'تتضاعف تقريبًا'), L('It rises by 3% in total', 'ترتفع 3% إجمالًا'), L('It stays the same once you retire', 'تبقى كما هي بعد التقاعد')], 0,
    L('By the rule of 72, 72 ÷ 3 = 24: prices double in about 24 years, so retirement income needs to keep growing.', 'بقاعدة 72، 72 ÷ 3 = 24: تتضاعف الأسعار في نحو 24 سنة، لذا يحتاج دخل التقاعد إلى أن يواصل النمو.')),
  mcq(P, W, 14, 'drawdown',
    L('Which statement about the 4% rule is accurate?', 'أي عبارة عن قاعدة 4% دقيقة؟'),
    [L('It is a rough rule of thumb from past market data, not a guarantee', 'قاعدة تقريبية مستخلصة من بيانات أسواق سابقة، وليست ضمانًا'), L('It guarantees your money lasts forever', 'تضمن أن يدوم مالك إلى الأبد'), L('It is the same law in every country', 'هي القانون نفسه في كل بلد')], 0,
    L('It comes from studies of past returns and served most historical periods, but future markets, fees and taxes can differ.', 'تأتي من دراسات للعوائد السابقة ونجحت في معظم الفترات التاريخية، لكن الأسواق والرسوم والضرائب في المستقبل قد تختلف.')),
  mcq(P, W, 15, 'lifecycle',
    L('A saver wants retirement investments that follow Islamic finance principles. Which is true?', 'يريد مدّخر استثمارات تقاعد تتبع مبادئ التمويل الإسلامي. أي مما يلي صحيح؟'),
    [L('Sharia-compliant options exist in many markets, and the same ideas of regular saving, diversification and low costs still apply', 'توجد خيارات متوافقة مع الشريعة في أسواق كثيرة، وتبقى أفكار الادخار المنتظم والتنويع والتكاليف المنخفضة نفسها صالحة'), L('Such options never exist, so saving is impossible', 'لا توجد مثل هذه الخيارات أبدًا، فيستحيل الادخار'), L('They are guaranteed not to lose money', 'مضمون ألا تخسر المال')], 0,
    L('Sharia-compliant funds and plans are offered in many places. They still carry market risk, and the usual habits matter just as much.', 'تُعرض صناديق وخطط متوافقة مع الشريعة في أماكن كثيرة. وهي تحمل مخاطر السوق أيضًا، والعادات المعتادة تبقى مهمة بالقدر نفسه.')),
  mcq(P, W, 16, 'pay-yourself-first',
    L('Auto-invest buys a fixed amount every month. What is its main benefit?', 'الاستثمار التلقائي يشتري مبلغًا ثابتًا كل شهر. ما فائدته الرئيسية؟'),
    [L('The habit keeps going without a decision each month', 'تستمر العادة دون الحاجة إلى قرار كل شهر'), L('It guarantees a profit', 'يضمن الربح'), L('It avoids every market fall', 'يتجنّب كل هبوط في السوق')], 0,
    L('Automating takes willpower and timing out of it: the money goes in first, every month, in good and bad markets. It guarantees nothing about returns.', 'الأتمتة تُخرج الإرادة والتوقيت من المعادلة: يذهب المال أولًا كل شهر، في الأسواق الجيدة والسيئة. ولا تضمن شيئًا بشأن العوائد.')),
  mcq(P, W, 17, 'pay-yourself-first',
    L('In the simulator, when is a month of auto-invest skipped?', 'في المحاكي، متى يُتخطّى شهر من الاستثمار التلقائي؟'),
    [L('When cash cannot cover the amount plus the 1% fee', 'عندما لا يكفي النقد للمبلغ ورسوم 1%'), L('When prices have fallen', 'عندما تهبط الأسعار'), L('When market news arrives', 'عندما تصل أخبار السوق')], 0,
    L('Like a real standing order, it needs the money to be there. Falling prices do not stop it: the same amount simply buys more units.', 'كأمر تحويل دائم حقيقي، يحتاج إلى وجود المال. والأسعار الهابطة لا توقفه: المبلغ نفسه يشتري ببساطة وحدات أكثر.')),
]

export const retirement: Module = {
  id: W,
  courseId: 'investing',
  order: 5,
  cover: cover(
    L('Going deeper · Module 5', 'التعمق أكثر · الوحدة 5'),
    L('Retirement &amp; tax-advantaged accounts', 'التقاعد والحسابات ذات المزايا الضريبية'),
    L('≈ 35 min', '≈ 35 دقيقة'),
  ),
  sections: [
    section({
      id: 'start-early',
      lessons: ['start-early'],
      label: L('Intro', 'مقدمة'),
      nav: L('Why start early', 'لماذا تبدأ مبكرًا'),
      title: L('The longest goal you will save for', 'أطول هدف ستدّخر له'),
      standfirst: L('Ten years’ head start is worth more than you think.', 'السبق بعشر سنوات يساوي أكثر مما تظن.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Karim is 25 and starts putting <strong>200 a month</strong> towards retirement. His cousin Tariq laughs: “Retirement? I’ll start at 35, when I earn more.” Both will invest the same 200 a month until 65, at 7% a year. Tariq thinks ten years won’t matter much.</p>',
          '<p>كريم عمره 25 ويبدأ بوضع <strong>200 شهريًا</strong> للتقاعد. يضحك ابن عمه طارق: «التقاعد؟ سأبدأ في الخامسة والثلاثين عندما يزيد دخلي». كلاهما سيستثمر 200 شهريًا حتى سن 65 بعائد 7% سنويًا. ويظن طارق أن عشر سنوات لن تفرق كثيرًا.</p>',
        )),
        predict(
          L('At 65, how much more does Karim have than Tariq?', 'في سن 65، كم يزيد ما لدى كريم عمّا لدى طارق؟'),
          [L('About 24,000', 'نحو 24,000'), L('About 100,000', 'نحو 100,000'), L('About 280,000', 'نحو 280,000'), L('About 500,000', 'نحو 500,000')],
          2,
          L(
            'About 280,000: some 525,000 against 244,000. Karim put in only 24,000 more; the rest is the extra ten years of growth on his earliest money. (Illustrative figures.)',
            'نحو 280,000: قرابة 525,000 مقابل 244,000. وضع كريم 24,000 فقط زيادة؛ والباقي سنوات النمو العشر الإضافية على أول أمواله. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>Retirement is the longest goal most people save for: money put aside at 25 may not be spent until 65, and then has to last 20 or 30 years. That long horizon is exactly what lets <strong>compounding</strong> do the heavy lifting, as long as the money is left alone.</p>',
          '<p>التقاعد هو أطول هدف يدّخر له معظم الناس: المال الذي يُدّخر في سن 25 قد لا يُنفق قبل سن 65، ثم عليه أن يكفي 20 أو 30 سنة. هذا الأفق الطويل هو بالضبط ما يتيح لـ<strong>الفائدة المركبة</strong> أن تقوم بالعمل الأكبر، طالما بقي المال دون أن يُمس.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Starting at 25 or at 35', 'البدء في سن 25 أم 35'),
          src: '/diagrams/retirement-start.svg',
          alt: L(
            'Bar chart: 200 a month at 7% until 65 grows to about 525,000 when started at 25 (96,000 put in) and about 244,000 when started at 35 (72,000 put in).',
            'رسم بالأعمدة: 200 شهريًا بعائد 7% حتى سن 65 تنمو إلى نحو 525,000 عند البدء في سن 25 (96,000 مدفوعة) وإلى نحو 244,000 عند البدء في سن 35 (72,000 مدفوعة).',
          ),
          caption: L('Starting age. Dark: money put in. Light: growth. Illustrative figures, not a forecast.', 'سن البدء. الداكن: المال المدفوع. الفاتح: النمو. أرقام توضيحية لا توقعات.'),
        }),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Waiting to start until you earn more, like Tariq. A small amount invested early often ends up larger than a bigger amount started ten years later: the early years of growth cannot be bought back.',
          'تأجيل البدء حتى يرتفع دخلك، كما فعل طارق. المبلغ الصغير الذي يُستثمر مبكرًا كثيرًا ما ينتهي أكبر من مبلغ أكبر يبدأ بعد عشر سنوات: سنوات النمو الأولى لا يمكن شراؤها لاحقًا.',
        )),
        compoundCalculator,
        keyIdea(L(
          '<p>For retirement, <strong>time in the market</strong> does most of the work: the first years of saving grow the longest.</p>',
          '<p>في التقاعد، <strong>الوقت في السوق</strong> يقوم بمعظم العمل: سنوات الادخار الأولى هي التي تنمو أطول مدة.</p>',
        )),
        exercise('invr-q001'),
        exercise('invr-q002'),
      ],
    }),
    section({
      id: 'employer',
      lessons: ['employer'],
      label: L('Part 1', 'الجزء ١'),
      nav: L('Workplace plans', 'خطط العمل'),
      title: L('Workplace pensions and matching', 'معاشات العمل والمساهمات المطابقة'),
      standfirst: L('Noor’s new job offers free money. She almost misses it.', 'وظيفة نور الجديدة تعرض مالًا مجانيًا. وكادت تفوّته.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Noor starts a new job with a salary of <strong>30,000</strong> a year. Buried in the welcome pack: “If you put up to 6% of your salary into the workplace plan, we add half of it.” Noor almost skips the form. If she puts in the full 6%, what does the employer add?</p>',
          '<p>تبدأ نور وظيفة جديدة براتب <strong>30,000</strong> سنويًا. ومدفونًا في حزمة الترحيب: «إذا وضعت حتى 6% من راتبك في خطة العمل، نضيف نصفها». كادت نور تتجاهل الاستمارة. إذا وضعت الـ6% كاملة، كم يضيف صاحب العمل؟</p>',
        )),
        predict(
          L('How much does Noor’s employer add each year?', 'كم يضيف صاحب عمل نور كل عام؟'),
          [L('Nothing', 'لا شيء'), L('450', '450'), L('900', '900'), L('1,800', '1,800')],
          2,
          L(
            '900. 6% of 30,000 is 1,800, and half of that is 900: an instant 50% on her own money, before any market growth. (Illustrative figures.)',
            '900. 6% من 30,000 تساوي 1,800، ونصفها 900: زيادة فورية بنسبة 50% على مالها، قبل أي نمو في السوق. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>That is a <strong>matching contribution</strong>. Many employers, and some governments, run a <strong>workplace pension</strong>: a share of each salary goes into a retirement plan automatically, before it reaches your account. Because nothing has to be decided each month, it is one of the easiest ways to save for decades.</p>',
          '<p>هذه <strong>مساهمة مطابقة</strong>. يدير كثير من أصحاب العمل، وبعض الحكومات، <strong>معاش عمل</strong>: تذهب نسبة من كل راتب إلى خطة تقاعد تلقائيًا، قبل أن تصل إلى حسابك. ولأنه لا حاجة لأي قرار كل شهر، فهو من أسهل طرق الادخار لعقود.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Her money, and the match', 'مالها والمساهمة المطابقة'),
          src: '/diagrams/match.svg',
          alt: L('Noor puts in 1,800 a year; with the employer’s 900 on top, 2,700 goes into her plan.', 'تضع نور 1,800 سنويًا؛ ومع 900 من صاحب العمل فوقها، يدخل خطتها 2,700.'),
          caption: L('A year of saving. Dark: Noor’s 6%. Blue: the employer’s match. Illustrative figures.', 'عام من الادخار. الداكن: الـ6% من نور. الأزرق: مساهمة صاحب العمل. أرقام توضيحية.'),
        }),
        table(
          [L('Plan type', 'نوع الخطة'), L('What you get', 'ما تحصل عليه'), L('Who carries the risk', 'من يتحمّل المخاطرة')],
          [
            [L('Defined benefit', 'مزايا محددة'), L('A promised income, often based on salary and years worked', 'دخل موعود، يُبنى غالبًا على الراتب وسنوات العمل'), L('Mainly the employer or the scheme', 'صاحب العمل أو الصندوق أساسًا')],
            [L('Defined contribution', 'مساهمات محددة'), L('Your own pot: what goes in plus investment returns', 'رصيدك الخاص: ما يُدفع فيه مضافًا إليه عوائد الاستثمار'), L('Mainly you', 'أنت أساسًا')],
          ],
        ),
        box('keypoint', L('Read the plan rules', 'اقرأ قواعد الخطة'), L(
          'Employer money sometimes becomes fully yours only after you have worked somewhere for a set time, often called vesting. Leaving earlier can mean leaving part of it behind, so read the rules before you change jobs.',
          'أحيانًا لا يصبح مال صاحب العمل ملكك بالكامل إلا بعد العمل مدة محددة، وهو ما يُسمى غالبًا الاستحقاق. المغادرة قبل ذلك قد تعني ترك جزء منه، فاقرأ القواعد قبل تغيير الوظيفة.',
        )),
        keyIdea(L(
          '<p>A matching contribution is <strong>extra money on top of yours</strong>; not taking it leaves part of your pay unclaimed.</p>',
          '<p>المساهمة المطابقة <strong>مال إضافي فوق مالك</strong>؛ وعدم الاستفادة منها يترك جزءًا من أجرك دون مطالبة.</p>',
        )),
        exercise('invr-q003'),
        exercise('invr-q004'),
      ],
    }),
    section({
      id: 'tax-accounts',
      lessons: ['tax-accounts'],
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Tax-advantaged accounts', 'الحسابات ذات المزايا الضريبية'),
      title: L('Tax now, tax later, or tax-free', 'ضريبة الآن أم لاحقًا أم إعفاء'),
      standfirst: L('Same investments, different wrappers, very different results.', 'الاستثمارات نفسها، وأغلفة مختلفة، ونتائج مختلفة جدًا.'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        html(L(
          '<p>Karim holds his index fund in an ordinary account, where interest, dividends and gains can be taxed as they arrive. Noor’s workplace plan is a <strong>tax-advantaged</strong> account: to encourage saving, many countries let retirement money grow without tax along the way, in exchange for rules. Which accounts let growth build untaxed?</p>',
          '<p>يحتفظ كريم بصندوق المؤشر في حساب عادي، حيث قد تُفرض الضريبة على الفوائد والتوزيعات والمكاسب عند تحققها. أما خطة عمل نور فحساب <strong>ذو مزايا ضريبية</strong>: لتشجيع الادخار، تسمح دول كثيرة لمال التقاعد بالنمو دون ضريبة على الطريق، مقابل قواعد. أي الحسابات تترك النمو يتراكم دون ضريبة؟</p>',
        )),
        sort(
          L('Taxed along the way, or growing untaxed?', 'تُفرض عليه الضريبة على الطريق، أم ينمو دون ضريبة؟'),
          [L('Taxed along the way', 'ضريبة على الطريق'), L('Grows untaxed', 'ينمو دون ضريبة')],
          [
            [L('Karim’s ordinary investment account', 'حساب الاستثمار العادي لدى كريم'), 0],
            [L('A tax-deferred retirement account', 'حساب تقاعد مؤجَّل الضريبة'), 1],
            [L('Interest in a normal savings account', 'الفائدة في حساب توفير عادي'), 0],
            [L('A tax-free retirement account', 'حساب تقاعد معفى من الضريبة'), 1],
          ],
          L(
            'Ordinary accounts can be taxed every year. Tax-deferred accounts tax the money when it comes out; tax-free accounts tax it before it goes in. Either way, the growth compounds untaxed.',
            'الحسابات العادية قد تُفرض عليها الضريبة كل عام. الحسابات المؤجَّلة الضريبة تفرضها عند خروج المال؛ والمعفاة تفرضها قبل دخوله. وفي الحالتين يتراكم النمو دون ضريبة.',
          ),
        ),
        table(
          [L('Account type', 'نوع الحساب'), L('When tax is paid', 'متى تُدفع الضريبة'), L('While invested', 'أثناء الاستثمار')],
          [
            [L('Taxable', 'خاضع للضريبة'), L('On income and gains as they arrive', 'على الدخل والمكاسب عند تحققها'), L('Growth is taxed along the way', 'يُفرض الضريبة على النمو أولًا بأول')],
            [L('Tax-deferred', 'مؤجَّل الضريبة'), L('Later: money goes in before tax, tax is due on withdrawal', 'لاحقًا: يدخل المال قبل الضريبة، وتُستحق عند السحب'), L('Grows untaxed', 'ينمو دون ضريبة')],
            [L('Tax-free growth', 'نمو معفى من الضريبة'), L('Now: money goes in after tax, withdrawals within the rules are tax-free', 'الآن: يدخل المال بعد الضريبة، والسحب وفق القواعد معفى'), L('Grows untaxed', 'ينمو دون ضريبة')],
          ],
        ),
        html(L(
          '<p>Leave 10,000 at 6% a year for 30 years. With no tax along the way it grows to about <strong>57,400</strong>; with 20% tax on each year’s growth, to about <strong>40,800</strong>.</p>',
          '<p>اترك 10,000 بعائد 6% سنويًا لمدة 30 سنة. دون ضريبة على الطريق تنمو إلى نحو <strong>57,400</strong>؛ ومع ضريبة 20% على نمو كل عام، إلى نحو <strong>40,800</strong>.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Growth taxed every year, or not', 'نمو تُفرض عليه الضريبة كل عام أم لا'),
          src: '/diagrams/retirement-tax.svg',
          alt: L(
            'Line chart: 10,000 at 6% a year grows to about 57,400 after 30 years with no yearly tax, and to about 40,800 with 20% tax on each year’s growth, a gap of about 16,600.',
            'رسم بالخطوط: 10,000 بعائد 6% سنويًا تنمو إلى نحو 57,400 بعد 30 سنة دون ضريبة سنوية، وإلى نحو 40,800 مع ضريبة 20% على نمو كل عام، بفارق نحو 16,600.',
          ),
          caption: L('Years from now. Dark: no yearly tax. Light: 20% tax on each year’s growth. Illustrative figures.', 'السنوات من الآن. الداكن: دون ضريبة سنوية. الفاتح: ضريبة 20% على نمو كل عام. أرقام توضيحية.'),
        }),
        html(L(
          '<p>These accounts have local names, such as the 401(k) in the US or the ISA in the UK, mentioned only as examples, not recommendations. Limits, ages and tax rates differ by country and change over time, so check your country’s official rules or a licensed adviser.</p>',
          '<p>لهذه الحسابات أسماء محلية، مثل 401(k) في الولايات المتحدة أو ISA في المملكة المتحدة، تُذكر أمثلةً فقط لا توصيات. الحدود والأعمار ونسب الضريبة تختلف من بلد لآخر وتتغير مع الوقت، فراجع القواعد الرسمية لبلدك أو مستشارًا مرخّصًا.</p>',
        )),
        keyIdea(L(
          '<p>Tax-advantaged accounts change <strong>when you pay tax</strong>; untaxed growth compounds on a bigger base.</p>',
          '<p>الحسابات ذات المزايا الضريبية تغيّر <strong>موعد دفع الضريبة</strong>؛ والنمو غير الخاضع للضريبة يتراكم على أساس أكبر.</p>',
        )),
        exercise('invr-q005'),
        exercise('invr-q006'),
        exercise('invr-q007'),
      ],
    }),
    section({
      id: 'saving-rate',
      lessons: ['saving-rate'],
      label: L('Part 3', 'الجزء ٣'),
      nav: L('How much to save', 'كم تدّخر'),
      title: L('Pay yourself first', 'ادفع لنفسك أولًا'),
      standfirst: L('Karim gets a raise. Where does it go?', 'كريم يحصل على زيادة. إلى أين تذهب؟'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Karim gets a raise: <strong>200 more</strong> a month. He already saves 10% of his pay, moved automatically on payday. A new phone is calling his name, and his retirement plan could take more. Nobody else will decide this for him.</p>',
          '<p>حصل كريم على زيادة: <strong>200 إضافية</strong> شهريًا. وهو يدّخر أصلًا 10% من راتبه، تُحوَّل تلقائيًا يوم الراتب. هاتف جديد يناديه، وخطة تقاعده يمكنها أن تأخذ أكثر. ولن يقرر أحد غيره.</p>',
        )),
        choice(L('What would you do with Karim’s raise?', 'ماذا كنت ستفعل بزيادة كريم؟'), [
          [
            L('Spend all of it', 'أنفقها كلها'),
            L('Life gets a little nicer now, and his saving stays at 10%. Spending tends to grow to fill whatever money is available.', 'تصبح الحياة أجمل قليلًا الآن، ويبقى ادخاره عند 10%. والإنفاق يميل إلى التمدد ليملأ المال المتاح.'),
          ],
          [
            L('Save half, spend half', 'أدّخر نصفها وأنفق نصفها'),
            L('He enjoys some of it and lifts his saving rate. Raising the rate a little with each raise means his take-home pay never actually drops.', 'يستمتع ببعضها ويرفع نسبة ادخاره. رفع النسبة قليلًا مع كل زيادة يعني ألا ينخفض ما يصله فعلًا أبدًا.'),
          ],
          [
            L('Save all of it', 'أدّخرها كلها'),
            L('His saving jumps the most, and he never gets used to spending it. It only lasts if the budget still feels livable.', 'يقفز ادخاره أكثر، ولا يعتاد إنفاقها أبدًا. لكنه لا يدوم إلا إذا بقيت الميزانية محتملة.'),
          ],
        ]),
        html(L(
          '<p><strong>Pay yourself first</strong>: on payday a set percentage moves to savings automatically, and only the rest is for spending. A commonly quoted guide for retirement is around 10–15% of income, counting any employer match. It is a rough starting point; starting smaller and adding a point a year also works.</p>',
          '<p><strong>ادفع لنفسك أولًا</strong>: يوم الراتب تنتقل نسبة محددة إلى الادخار تلقائيًا، ولا يُنفق إلا الباقي. إرشاد شائع للتقاعد هو نحو 10–15% من الدخل، مع احتساب أي مساهمة من صاحب العمل. وهو نقطة بداية تقريبية؛ والبدء بنسبة أصغر مع إضافة نقطة كل عام ينجح أيضًا.</p>',
        )),
        html(L(
          '<p>Taking money out of a retirement account early often costs three times: a <strong>penalty</strong> in many countries, <strong>income tax</strong>, and the <strong>growth</strong> it would have earned. 10,000 taken out at 35 would have grown to about 76,000 by 65 at 7% a year. (Illustrative figures.)</p>',
          '<p>سحب المال من حساب التقاعد مبكرًا يكلّف غالبًا ثلاث مرات: <strong>غرامة</strong> في دول كثيرة، و<strong>ضريبة الدخل</strong>، و<strong>النمو</strong> الذي كان سيحققه. 10,000 تُسحب في سن 35 كانت ستنمو إلى نحو 76,000 عند سن 65 بعائد 7% سنويًا. (أرقام توضيحية.)</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('What an early withdrawal gives up', 'ما يتخلى عنه السحب المبكر'),
          src: '/diagrams/early-withdraw.svg',
          alt: L('10,000 taken out at 35, against about 76,000 at 65 if left to grow at 7% a year.', '10,000 تُسحب في سن 35، مقابل نحو 76,000 في سن 65 لو تُركت تنمو بعائد 7% سنويًا.'),
          caption: L('Age. Left: the amount taken out. Right: what it would have become. Illustrative figures.', 'العمر. يسارًا: المبلغ المسحوب. يمينًا: ما كان سيصبح عليه. أرقام توضيحية.'),
        }),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Using retirement savings as an emergency fund. A separate cushion of easy-to-reach savings means a car repair or a lost job does not force an early withdrawal, with its penalty, its tax and the lost years of growth.',
          'استخدام مدخرات التقاعد كصندوق طوارئ. وجود احتياطي منفصل من مدخرات سهلة الوصول يعني أن إصلاح سيارة أو فقدان وظيفة لا يفرض سحبًا مبكرًا بما فيه من غرامة وضريبة وسنوات نمو ضائعة.',
        )),
        keyIdea(L(
          '<p>Save a <strong>set percentage first</strong>, automatically, and leave it alone until retirement.</p>',
          '<p>ادّخر <strong>نسبة محددة أولًا</strong>، تلقائيًا، واتركها دون مساس حتى التقاعد.</p>',
        )),
        exercise('invr-q008'),
        exercise('invr-q009'),
      ],
    }),
    section({
      id: 'lifecycle',
      lessons: ['lifecycle'],
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Target-date funds', 'صناديق التاريخ المستهدف'),
      title: L('A mix that changes with age', 'مزيج يتغير مع العمر'),
      standfirst: L('One fund that gets calmer as retirement gets closer.', 'صندوق واحد يهدأ كلما اقترب التقاعد.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Noor’s workplace plan offers a fund named after the year she will turn 65. The leaflet says it “takes care of everything until your retirement date”. Her aunt reads it over her shoulder and is impressed: “So your money is safe on that date.” Is it?</p>',
          '<p>تعرض خطة عمل نور صندوقًا يحمل اسم السنة التي ستبلغ فيها 65. تقول النشرة إنه «يتولى كل شيء حتى موعد تقاعدك». تقرأ خالتها من فوق كتفها وتنبهر: «إذن مالك آمن في ذلك التاريخ». فهل هو كذلك؟</p>',
        )),
        myth(
          L('A target-date fund guarantees your money on the target date.', 'صندوق التاريخ المستهدف يضمن مالك في التاريخ المستهدف.'),
          false,
          L(
            'It follows a plan, not a promise. It gets calmer as the date nears, but it still holds stocks and bonds, and it can still fall, even in the final year.',
            'إنه يتبع خطة لا وعدًا. يهدأ كلما اقترب التاريخ، لكنه ما زال يملك أسهمًا وسندات، وقد يهبط، حتى في السنة الأخيرة.',
          ),
        ),
        html(L(
          '<p>A <strong>target-date fund</strong>, or lifecycle fund, starts with mostly stocks for growth, then shifts step by step towards bonds and cash as its year approaches. That planned path is the <strong>glide path</strong>: close to retirement there is little time to recover from a big fall.</p>',
          '<p><strong>صندوق التاريخ المستهدف</strong>، أو صندوق دورة الحياة، يبدأ بالأسهم غالبًا من أجل النمو، ثم ينتقل خطوة بخطوة نحو السندات والنقد كلما اقتربت سنته. هذا المسار المخطط هو <strong>مسار الانحدار</strong>: قرب التقاعد يقل الوقت المتاح للتعافي من هبوط كبير.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('The stock share along the glide path', 'حصة الأسهم على مسار الانحدار'),
          src: '/diagrams/glide.svg',
          alt: L('Share in stocks: 90% with 40 years to go, 75% at 20, 60% at 10 and 40% at the target year.', 'حصة الأسهم: 90% قبل 40 سنة، و75% قبل 20، و60% قبل 10، و40% في السنة المستهدفة.'),
          caption: L('Years to the target; the rest is bonds and cash. Illustrative figures.', 'السنوات حتى الهدف؛ والباقي سندات ونقد. أرقام توضيحية.'),
        }),
        html(L(
          '<p>The trade-offs: one path is set for everyone born around the same year, fees differ from fund to fund, and the mix inside is worth reading. Some savers want options that follow <strong>Islamic finance</strong> principles; Sharia-compliant plans exist in many markets, still carry market risk, and the same habits apply.</p>',
          '<p>المفاضلات: مسار واحد يُحدد لكل من وُلدوا في السنوات نفسها تقريبًا، والرسوم تختلف من صندوق لآخر، والمزيج الذي بداخله يستحق القراءة. ويريد بعض المدّخرين خيارات تتبع مبادئ <strong>التمويل الإسلامي</strong>؛ والخطط المتوافقة مع الشريعة موجودة في أسواق كثيرة، وتحمل مخاطر السوق أيضًا، وتنطبق عليها العادات نفسها.</p>',
        )),
        keyIdea(L(
          '<p>A lifecycle mix takes <strong>more risk early and less near the end</strong>, matching risk to the time left.</p>',
          '<p>مزيج دورة الحياة يتحمّل <strong>مخاطرة أكبر في البداية وأقل قرب النهاية</strong>، فيوائم المخاطرة مع الوقت المتبقي.</p>',
        )),
        exercise('invr-q010'),
        exercise('invr-q011'),
        exercise('invr-q015'),
      ],
    }),
    section({
      id: 'drawdown',
      lessons: ['drawdown'],
      label: L('Part 5', 'الجزء ٥'),
      nav: L('Making it last', 'كيف يدوم المال'),
      title: L('Making the money last', 'كيف يدوم المال'),
      standfirst: L('Retirement can last decades, and prices keep rising the whole time.', 'قد يمتد التقاعد عقودًا، والأسعار تواصل الارتفاع طوال الوقت.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Jump ahead: Noor is 65 and retiring. She works out that her life costs <strong>20,000</strong> a year. Retirement could last 25 years or more, and prices keep rising about 3% a year the whole time. She wants to know what the same life will cost when she is 89.</p>',
          '<p>لننتقل إلى المستقبل: نور في الخامسة والستين وتتقاعد. حسبت أن حياتها تكلّف <strong>20,000</strong> سنويًا. وقد يمتد التقاعد 25 سنة أو أكثر، والأسعار ترتفع نحو 3% سنويًا طوال الوقت. وتريد أن تعرف كم ستكلّف الحياة نفسها عندما تبلغ 89.</p>',
        )),
        predict(
          L('At 3% inflation, what does Noor’s year cost at 89?', 'بتضخم 3%، كم تكلّف سنة نور في سن 89؟'),
          [L('About 20,600', 'نحو 20,600'), L('About 30,000', 'نحو 30,000'), L('About 40,000', 'نحو 40,000'), L('About 60,000', 'نحو 60,000')],
          2,
          L(
            'About 40,700. By the rule of 72, prices double in about 24 years. Retirement money usually needs to keep some growth, not just sit in cash. (Illustrative figures.)',
            'نحو 40,700. بقاعدة 72، تتضاعف الأسعار في نحو 24 سنة. لذا يحتاج مال التقاعد عادةً إلى بعض النمو، لا أن يبقى نقدًا فقط. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p><strong>Inflation</strong> keeps working through retirement: an income that feels comfortable at 65 buys about half as much at 89. That is why most retirement plans keep part of the money invested for growth, even after the paychecks stop.</p>',
          '<p><strong>التضخم</strong> يواصل عمله طوال التقاعد: الدخل الذي يبدو مريحًا في سن 65 يشتري نحو نصف ذلك في سن 89. لهذا تُبقي معظم خطط التقاعد جزءًا من المال مستثمرًا من أجل النمو، حتى بعد توقف الرواتب.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('The same year of life, getting dearer', 'السنة نفسها من الحياة وهي تغلو'),
          src: '/diagrams/drawdown.svg',
          alt: L('The same year of spending costs 20,000 at 65, about 26,900 at 75 and about 40,700 at 89, at 3% inflation.', 'السنة نفسها من الإنفاق تكلّف 20,000 في سن 65، ونحو 26,900 في سن 75، ونحو 40,700 في سن 89، بتضخم 3%.'),
          caption: L('Age. Illustrative figures at 3% inflation a year.', 'العمر. أرقام توضيحية بتضخم 3% سنويًا.'),
        }),
        html(L(
          '<p>The <strong>4% rule</strong> is a rough illustration from studies of past US markets: take 4% of savings in the first year, then the same amount raised with inflation each year, and in most past periods the money lasted 30 years. For Noor’s 20,000, that means a pot of about 500,000: 25 times her yearly spending.</p>',
          '<p><strong>قاعدة 4%</strong> توضيح تقريبي مستخلص من دراسات لأسواق الولايات المتحدة في الماضي: اسحب 4% من المدخرات في السنة الأولى، ثم المبلغ نفسه مرفوعًا مع التضخم كل عام، وفي معظم الفترات السابقة دام المال 30 سنة. ولـ20,000 التي تحتاجها نور، يعني ذلك رصيدًا يقارب 500,000: أي 25 ضعف إنفاقها السنوي.</p>',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Treating the 4% rule as a promise. Future returns, fees, taxes and how long you live can all differ from the past, so it is a first rough estimate, not a guarantee that the money will last.',
          'اعتبار قاعدة 4% وعدًا. العوائد والرسوم والضرائب في المستقبل، وطول العمر، قد تختلف كلها عن الماضي، لذا هي تقدير أولي تقريبي، لا ضمان بأن المال سيدوم.',
        )),
        keyIdea(L(
          '<p>Plan for a <strong>long retirement with rising prices</strong>; the 4% rule is a rough guide, not a guarantee.</p>',
          '<p>خطّط لـ<strong>تقاعد طويل بأسعار متزايدة</strong>؛ قاعدة 4% دليل تقريبي لا ضمان.</p>',
        )),
        exercise('invr-q012'),
        exercise('invr-q013'),
        exercise('invr-q014'),
        takeaways([
          L('Start early: the first years of saving grow the longest', 'ابدأ مبكرًا: سنوات الادخار الأولى تنمو أطول مدة'),
          L('An employer match is extra money on top of yours', 'مطابقة صاحب العمل مال إضافي فوق مالك'),
          L('Tax-advantaged accounts change when tax is paid; rules differ by country', 'الحسابات ذات المزايا الضريبية تغيّر موعد دفع الضريبة؛ والقواعد تختلف من بلد لآخر'),
          L('Pay yourself first and avoid early withdrawals', 'ادفع لنفسك أولًا وتجنّب السحب المبكر'),
          L('Inflation and the 4% rule: plan for a long retirement, with rough guides only', 'التضخم وقاعدة 4%: خطّط لتقاعد طويل، بأدلة تقريبية فقط'),
        ]),
      ],
    }),
    section({
      id: 'practice-auto',
      lessons: ['practice-auto'],
      label: L('Practice', 'تدريب'),
      nav: L('Auto-invest', 'الاستثمار التلقائي'),
      title: L('Practice: pay yourself first, automatically', 'تدريب: ادفع لنفسك أولًا، تلقائيًا'),
      standfirst: L(
        'Do what Karim did: set a fixed amount to invest every month, without lifting a finger.',
        'افعل ما فعله كريم: حدّد مبلغًا ثابتًا يُستثمر كل شهر، دون أن تحرّك إصبعًا.',
      ),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Make saving automatic. With <strong>play money</strong> and simulated prices (practice, not advice), find the <strong>Auto-invest</strong> card and tap <strong>Set up</strong>. Choose an amount and an investment, then tap <strong>Start auto-invest</strong>. It buys once every simulated month, about every two real hours; a month your cash can’t cover, with its 1% fee, is skipped.</p>',
          '<p>اجعل الادخار تلقائيًا. بـ<strong>مال افتراضي</strong> وأسعار محاكاة (للتدريب، لا نصيحة)، ابحث عن بطاقة <strong>الاستثمار التلقائي</strong> واضغط <strong>إعداد</strong>. اختر مبلغًا واستثمارًا، ثم اضغط <strong>ابدأ الاستثمار التلقائي</strong>. يشتري مرة كل شهر في المحاكاة، أي نحو كل ساعتين حقيقيتين؛ والشهر الذي لا يكفي فيه نقدك للمبلغ ورسوم 1% يُتخطّى.</p>',
        )),
        practice('auto'),
        keyIdea(L(
          '<p>Paying yourself first works best when it is <strong>automatic</strong>: the money is invested before you can spend it.</p>',
          '<p>الدفع لنفسك أولًا ينجح أكثر حين يكون <strong>تلقائيًا</strong>: يُستثمر المال قبل أن تتمكن من إنفاقه.</p>',
        )),
        exercise('invr-q016'),
        exercise('invr-q017'),
      ],
    }),
  ],
  questions,
}
