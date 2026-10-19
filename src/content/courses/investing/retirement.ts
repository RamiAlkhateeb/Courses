// Original course content. Explains retirement saving in general, country-neutral terms; no products or providers are
// recommended, and every figure is an illustration, not a forecast. Rules differ by country.
import type { Module } from '../../types'
import { L, box, compoundCalculator, cover, diagram, exercise, html, keyIdea, mcq, objectives, section, table, takeaways } from '../../helpers'

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
      standfirst: L('Retirement is decades away, which makes time your biggest ally.', 'التقاعد بعيد بعقود، وهذا يجعل الوقت أكبر حليف لك.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        objectives([
          L('Show how starting early changes the size of a retirement pot', 'توضيح كيف يغيّر البدء المبكر حجم رصيد التقاعد'),
          L('Explain employer plans and matching contributions', 'شرح خطط أصحاب العمل والمساهمات المطابقة'),
          L('Compare taxable, tax-deferred and tax-free accounts', 'المقارنة بين الحسابات الخاضعة للضريبة والمؤجَّلة الضريبة والمعفاة منها'),
          L('Describe target-date funds and the 4% rule as rough guides', 'وصف صناديق التاريخ المستهدف وقاعدة 4% كأدلة تقريبية'),
        ]),
        html(L(
          '<p>Retirement is the longest goal most people save for: money put aside at 25 may not be spent until 65 or later, and then has to last 20 or 30 years. That long horizon is exactly what lets <strong>compounding</strong> do the heavy lifting, as long as the money is left alone.</p>',
          '<p>التقاعد هو أطول هدف يدّخر له معظم الناس: المال الذي يُدّخر في سن 25 قد لا يُنفق قبل سن 65 أو بعدها، ثم عليه أن يكفي 20 أو 30 سنة. هذا الأفق الطويل هو بالضبط ما يتيح لـ<strong>الفائدة المركبة</strong> أن تقوم بالعمل الأكبر، طالما بقي المال دون أن يُمس.</p>',
        )),
        html(L(
          '<p>Invest 200 a month at 7% a year until 65. Start at 25 and you put in 96,000 and end with about <strong>525,000</strong>. Start at 35 and you put in 72,000 and end with about <strong>244,000</strong>.</p>',
          '<p>استثمر 200 شهريًا بعائد 7% سنويًا حتى سن 65. إن بدأت في سن 25 تضع 96,000 وتنتهي بنحو <strong>525,000</strong>. وإن بدأت في سن 35 تضع 72,000 وتنتهي بنحو <strong>244,000</strong>.</p>',
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
          'Waiting to start until you earn more. A small amount invested early often ends up larger than a bigger amount started ten years later, because the early money gets the extra years of growth that cannot be bought back.',
          'تأجيل البدء حتى يرتفع دخلك. المبلغ الصغير الذي يُستثمر مبكرًا كثيرًا ما ينتهي أكبر من مبلغ أكبر يبدأ بعد عشر سنوات، لأن المال المبكر يحصل على سنوات النمو الإضافية التي لا يمكن شراؤها لاحقًا.',
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
      standfirst: L('Many employers help you save for retirement, sometimes with money of their own.', 'يساعدك كثير من أصحاب العمل على الادخار للتقاعد، وأحيانًا بمال من عندهم.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Many employers, and some governments, run a <strong>workplace pension</strong>: a share of each salary goes into a retirement plan automatically, before it reaches your account. Because it happens without a decision every month, it is one of the easiest ways to save steadily for decades.</p>',
          '<p>يدير كثير من أصحاب العمل، وبعض الحكومات، <strong>معاش عمل</strong>: تذهب نسبة من كل راتب إلى خطة تقاعد تلقائيًا، قبل أن تصل إلى حسابك. ولأن ذلك يحدث دون قرار كل شهر، فهو من أسهل طرق الادخار بانتظام لعقود.</p>',
        )),
        table(
          [L('Plan type', 'نوع الخطة'), L('What you get', 'ما تحصل عليه'), L('Who carries the risk', 'من يتحمّل المخاطرة')],
          [
            [L('Defined benefit', 'مزايا محددة'), L('A promised income, often based on salary and years worked', 'دخل موعود، يُبنى غالبًا على الراتب وسنوات العمل'), L('Mainly the employer or the scheme', 'صاحب العمل أو الصندوق أساسًا')],
            [L('Defined contribution', 'مساهمات محددة'), L('Your own pot: what goes in plus investment returns', 'رصيدك الخاص: ما يُدفع فيه مضافًا إليه عوائد الاستثمار'), L('Mainly you', 'أنت أساسًا')],
          ],
        ),
        html(L(
          '<p>Some plans add a <strong>matching contribution</strong>. Say the employer adds half of what you put in, up to 6% of salary. On a salary of 40,000, putting in 6% (2,400) brings 1,200 more from the employer: an instant 50% on that money, before any market growth. (Illustrative figures.)</p>',
          '<p>تضيف بعض الخطط <strong>مساهمة مطابقة</strong>. لنفترض أن صاحب العمل يضيف نصف ما تضعه، حتى 6% من الراتب. براتب 40,000، وضع 6% (2,400) يجلب 1,200 إضافية من صاحب العمل: زيادة فورية بنسبة 50% على ذلك المال، قبل أي نمو في السوق. (أرقام توضيحية.)</p>',
        )),
        box('keypoint', L('Read the plan rules', 'اقرأ قواعد الخطة'), L(
          'Employer money sometimes becomes fully yours only after you have worked somewhere for a set time, often called vesting. Leaving earlier can mean leaving part of it behind, so the plan rules are worth reading before you change jobs.',
          'أحيانًا لا يصبح مال صاحب العمل ملكك بالكامل إلا بعد العمل مدة محددة، وهو ما يُسمى غالبًا الاستحقاق. المغادرة قبل ذلك قد تعني ترك جزء منه، لذا تستحق قواعد الخطة القراءة قبل تغيير الوظيفة.',
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
      standfirst: L('Many countries give retirement savings a tax break, in exchange for rules.', 'تمنح دول كثيرة مدخرات التقاعد ميزة ضريبية، مقابل قواعد.'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        html(L(
          '<p>In an ordinary <strong>taxable account</strong>, interest, dividends and gains can be taxed as they arrive. To encourage saving, many countries offer <strong>tax-advantaged</strong> retirement accounts instead. In exchange they set rules: how much can go in each year, and from what age the money can come out.</p>',
          '<p>في <strong>الحساب الخاضع للضريبة</strong> العادي، قد تُفرض الضريبة على الفوائد وتوزيعات الأرباح والمكاسب عند تحققها. ولتشجيع الادخار، تقدّم دول كثيرة بدلًا من ذلك حسابات تقاعد <strong>ذات مزايا ضريبية</strong>. وفي المقابل تضع قواعد: كم يمكن إيداعه كل عام، ومن أي سن يمكن سحب المال.</p>',
        )),
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
          '<p>These accounts have local names, such as the 401(k) in the US or the ISA in the UK. They are mentioned only as examples, not recommendations. Limits, ages and tax rates differ by country and change over time, so the details are worth checking in your country’s official rules or with a licensed adviser.</p>',
          '<p>لهذه الحسابات أسماء محلية، مثل 401(k) في الولايات المتحدة أو ISA في المملكة المتحدة. وتُذكر هنا أمثلةً فقط لا توصيات. الحدود والأعمار ونسب الضريبة تختلف من بلد لآخر وتتغير مع الوقت، لذا تستحق التفاصيل التحقق منها في القواعد الرسمية لبلدك أو مع مستشار مرخّص.</p>',
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
      standfirst: L('A set percentage, saved automatically, beats saving whatever is left over.', 'نسبة محددة تُدّخر تلقائيًا أفضل من ادخار ما يتبقى.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p><strong>Pay yourself first</strong>: on payday, a set percentage of income moves to savings automatically, and only what remains is for spending. Saving “whatever is left at the end of the month” often means saving nothing, because spending tends to grow to fill the money available.</p>',
          '<p><strong>ادفع لنفسك أولًا</strong>: في يوم الراتب، تنتقل نسبة محددة من الدخل إلى الادخار تلقائيًا، ولا يُنفق إلا ما يتبقى. أما ادخار «ما يتبقى في نهاية الشهر» فكثيرًا ما يعني عدم ادخار شيء، لأن الإنفاق يميل إلى التمدد حتى يملأ المال المتاح.</p>',
        )),
        html(L(
          '<p>How much? A commonly quoted guideline for retirement is around 10–15% of income, counting any employer contribution. It is only a rough starting point: age, income and other pensions all change the picture. Starting smaller and adding a point each year also works.</p>',
          '<p>كم؟ إرشاد شائع للتقاعد هو نحو 10–15% من الدخل، مع احتساب أي مساهمة من صاحب العمل. وهو مجرد نقطة بداية تقريبية: العمر والدخل والمعاشات الأخرى كلها تغيّر الصورة. والبدء بنسبة أصغر مع إضافة نقطة كل عام ينجح أيضًا.</p>',
        )),
        box('example', L('Example', 'مثال'), L(
          'On a pay of 3,000 a month, 10% means 300 moving to savings on payday. After a raise to 3,200, saving 11% takes 352 and still leaves more to spend than before. (Illustrative figures.)',
          'براتب 3,000 شهريًا، تعني 10% أن 300 تنتقل إلى الادخار يوم الراتب. وبعد زيادة إلى 3,200، يأخذ ادخار 11% مبلغ 352 ويترك مع ذلك للإنفاق أكثر من قبل. (أرقام توضيحية.)',
        )),
        html(L(
          '<p>Taking money out of a retirement account early often costs three times: a <strong>penalty</strong> in many countries, <strong>income tax</strong>, and the <strong>growth</strong> it would have earned. 10,000 taken out at 35 would have grown to about 76,000 by 65 at 7% a year. (Illustrative figures.)</p>',
          '<p>سحب المال من حساب التقاعد مبكرًا يكلّف غالبًا ثلاث مرات: <strong>غرامة</strong> في دول كثيرة، و<strong>ضريبة الدخل</strong>، و<strong>النمو</strong> الذي كان سيحققه. 10,000 تُسحب في سن 35 كانت ستنمو إلى نحو 76,000 عند سن 65 بعائد 7% سنويًا. (أرقام توضيحية.)</p>',
        )),
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
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>A <strong>target-date fund</strong>, also called a lifecycle fund, is a single fund named after a year close to when its savers plan to retire. It starts with mostly stocks for growth, then shifts step by step towards bonds and cash as that year approaches. The planned path is called the <strong>glide path</strong>.</p>',
          '<p><strong>صندوق التاريخ المستهدف</strong>، ويُسمى أيضًا صندوق دورة الحياة، صندوق واحد يحمل اسم سنة قريبة من موعد تقاعد مدّخريه. يبدأ بالأسهم غالبًا من أجل النمو، ثم ينتقل خطوة بخطوة نحو السندات والنقد كلما اقتربت تلك السنة. ويُسمى هذا المسار المخطط <strong>مسار الانحدار</strong>.</p>',
        )),
        table(
          [L('Years to the target', 'السنوات حتى الهدف'), L('Illustrative stocks / bonds', 'أسهم / سندات توضيحيًا')],
          [
            [L('40', '40'), L('90 / 10', '90 / 10')],
            [L('20', '20'), L('75 / 25', '75 / 25')],
            [L('10', '10'), L('60 / 40', '60 / 40')],
            [L('0', '0'), L('40 / 60', '40 / 60')],
          ],
        ),
        html(L(
          '<p>Why shift? Close to retirement there is little time to recover from a big fall, and money soon starts coming out. The trade-offs: one path is set for everyone born around the same year, fees differ from fund to fund, and the mix inside is worth reading before choosing one.</p>',
          '<p>لماذا الانتقال؟ قرب التقاعد يقل الوقت المتاح للتعافي من هبوط كبير، ويبدأ المال في الخروج قريبًا. أما المفاضلات: فمسار واحد يُحدد لكل من وُلدوا في السنوات نفسها تقريبًا، والرسوم تختلف من صندوق لآخر، والمزيج الذي بداخله يستحق القراءة قبل اختيار أي منها.</p>',
        )),
        html(L(
          '<p>Some savers want options that follow <strong>Islamic finance</strong> principles, which avoid interest-based income and screen out certain businesses. Sharia-compliant pension plans and funds exist in many markets, usually reviewed by a Sharia board. They still carry market risk, and the same habits apply: regular saving, diversification and low costs.</p>',
          '<p>يريد بعض المدّخرين خيارات تتبع مبادئ <strong>التمويل الإسلامي</strong>، التي تتجنب الدخل القائم على الفائدة وتستبعد أنشطة تجارية معينة. وتوجد خطط تقاعد وصناديق متوافقة مع الشريعة في أسواق كثيرة، تراجعها عادةً هيئة شرعية. وهي تحمل مخاطر السوق أيضًا، وتنطبق عليها العادات نفسها: الادخار المنتظم والتنويع والتكاليف المنخفضة.</p>',
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
          '<p>Retirement can last 25 or 30 years, and <strong>inflation</strong> keeps working the whole time. At 3% a year, prices double in about 24 years, so an income that feels comfortable at 65 buys about half as much at 89. Retirement money usually needs to keep some growth, not just sit in cash.</p>',
          '<p>قد يمتد التقاعد 25 أو 30 سنة، ويواصل <strong>التضخم</strong> عمله طوال الوقت. بتضخم 3% سنويًا تتضاعف الأسعار في نحو 24 سنة، فالدخل الذي يبدو مريحًا في سن 65 يشتري نحو نصف ذلك في سن 89. لذا يحتاج مال التقاعد عادةً إلى بعض النمو، لا أن يبقى نقدًا فقط.</p>',
        )),
        html(L(
          '<p>The <strong>4% rule</strong> is a rough illustration from studies of past US markets: take 4% of savings in the first year, then the same amount raised with inflation each year, and in most past periods the money lasted 30 years. With 500,000, that is 20,000 in year one. Flipped around, it suggests a pot of about 25 times yearly spending.</p>',
          '<p><strong>قاعدة 4%</strong> توضيح تقريبي مستخلص من دراسات لأسواق الولايات المتحدة في الماضي: اسحب 4% من المدخرات في السنة الأولى، ثم المبلغ نفسه مرفوعًا مع التضخم كل عام، وفي معظم الفترات السابقة دام المال 30 سنة. مع 500,000، يعني ذلك 20,000 في السنة الأولى. وبعكسها، تشير إلى رصيد يقارب 25 ضعف الإنفاق السنوي.</p>',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Treating the 4% rule as a promise. Future returns, fees, taxes and how long you live can all differ from the past, so it works as a first rough estimate for planning, not as a guarantee that the money will last.',
          'اعتبار قاعدة 4% وعدًا. العوائد والرسوم والضرائب في المستقبل، وطول العمر، قد تختلف كلها عن الماضي، لذا تصلح القاعدة تقديرًا أوليًا تقريبيًا للتخطيط، لا ضمانًا بأن المال سيدوم.',
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
  ],
  questions,
}
