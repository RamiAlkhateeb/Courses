// Original course content. Figures are illustrative examples; 50/30/20 and the 3–6 month buffer are common rules of
// thumb, not rules. The course follows the same two fictional characters as Investing: Noor (نور), a careful saver,
// and Karim (كريم), who earns well but runs out before the month does. Each lesson opens on their story with something
// to do (a guess, a choice, a sort or a myth), then explains.
import type { Module } from '../../types'
import { L, box, choice, cover, diagram, exercise, html, keyIdea, mcq, myth, predict, section, sort } from '../../helpers'

const W = 'budgeting'
const P = 'pfb'

const questions = [
  mcq(P, W, 1, 'income',
    L('A budget should start from…', 'يجب أن تبدأ الميزانية من…'),
    [L('Net income: what actually reaches your account after tax', 'صافي الدخل: ما يصل فعلًا إلى حسابك بعد الضريبة'), L('Gross salary before tax', 'الراتب الإجمالي قبل الضريبة'), L('The income you hope to earn next year', 'الدخل الذي تأمل أن تحققه العام القادم')], 0,
    L('You can only spend what arrives. Tax and deductions leave before the salary reaches you, so a plan built on the gross figure overspends from day one.', 'لا يمكنك إنفاق إلا ما يصل. الضريبة والاقتطاعات تُخصم قبل وصول الراتب، فالخطة المبنية على الرقم الإجمالي تتجاوز الدخل من اليوم الأول.')),
  mcq(P, W, 2, '50-30-20',
    L('Net income is 3,000 a month. Under the 50/30/20 guideline, how much goes to savings and debt repayment?', 'صافي الدخل 3,000 شهريًا. وفق قاعدة 50/30/20، كم يذهب للادخار وسداد الديون؟'),
    [L('600', '600'), L('900', '900'), L('1,500', '1,500')], 0,
    L('Savings and extra debt payments get 20%, and 20% of 3,000 is 600. The 900 is wants (30%) and the 1,500 is needs (50%).', 'الادخار والسداد الإضافي للديون لهما 20%، و20% من 3,000 تساوي 600. الـ900 للرغبات (30%) والـ1,500 للحاجات (50%).')),
  mcq(P, W, 3, 'needs-wants',
    L('Which is a “want” rather than a “need”?', 'أي مما يلي «رغبة» وليس «حاجة»؟'),
    [L('A streaming subscription', 'اشتراك في خدمة بث'), L('Rent', 'الإيجار'), L('Minimum loan payment', 'الحد الأدنى لقسط القرض')], 0,
    L('Life goes on without the subscription. Rent and the minimum loan payment have to be paid, or things get much worse.', 'الحياة تستمر دون الاشتراك. أما الإيجار والحد الأدنى للقسط فلا بد من دفعهما، وإلا ساءت الأمور كثيرًا.')),
  mcq(P, W, 4, 'pay-yourself-first',
    L('“Pay yourself first” means…', '«ادفع لنفسك أولًا» تعني…'),
    [L('Moving money to savings automatically on payday, before spending', 'تحويل المال إلى الادخار تلقائيًا يوم الراتب قبل الإنفاق'), L('Buying something nice for yourself each month', 'شراء شيء لطيف لنفسك كل شهر'), L('Saving whatever is left at month end', 'ادخار ما يتبقى في نهاية الشهر')], 0,
    L('“Yourself” is your future self: savings are paid like a bill, on payday, before the rest of the month can spend them.', '«نفسك» هي نفسك في المستقبل: يُدفع الادخار كأنه فاتورة، يوم الراتب، قبل أن ينفقه باقي الشهر.')),
  mcq(P, W, 5, 'emergency',
    L('Essential expenses are 1,800 a month. A 3–6 month emergency fund is…', 'النفقات الأساسية 1,800 شهريًا. صندوق طوارئ يغطي من 3 إلى 6 أشهر يساوي…'),
    [L('5,400 – 10,800', 'من 5,400 إلى 10,800'), L('1,800', '1,800'), L('18,000 – 36,000', 'من 18,000 إلى 36,000')], 0,
    L('1,800 × 3 = 5,400 and 1,800 × 6 = 10,800. The fund is sized on essentials, not on everything you spend.', '1,800 × 3 = 5,400 و1,800 × 6 = 10,800. يُحسب الصندوق على الأساسيات، لا على كل ما تنفقه.')),
  mcq(P, W, 6, 'emergency',
    L('Where should an emergency fund usually be kept?', 'أين يُحفظ صندوق الطوارئ عادةً؟'),
    [L('A separate, easy-to-reach savings account', 'حساب توفير منفصل يسهل الوصول إليه'), L('Individual stocks', 'أسهم منفردة'), L('A long-term fixed deposit you cannot withdraw', 'وديعة طويلة الأجل لا يمكن سحبها')], 0,
    L('An emergency needs money that is there, in full, on the day. Stocks may be down that day and a locked deposit can’t be reached.', 'الطارئ يحتاج مالًا موجودًا كاملًا في يومه. الأسهم قد تكون هابطة ذلك اليوم، والوديعة المقفلة لا يمكن الوصول إليها.')),
  mcq(P, W, 7, 'tracking',
    L('Karim earns 3,000 and spends about 3,100 a month, but doesn’t know where it goes. What is the best first step?', 'يكسب كريم 3,000 وينفق نحو 3,100 شهريًا، لكنه لا يعرف أين يذهب المال. ما أفضل خطوة أولى؟'),
    [L('Track one month of spending from his statements', 'تتبّع إنفاق شهر واحد من كشوف حسابه'), L('Cut every category by 10%', 'خفض كل فئة بنسبة 10%'), L('Borrow 100 a month to cover the gap', 'اقتراض 100 كل شهر لسد الفجوة')], 0,
    L('He can’t fix what he can’t see. One month of real numbers shows where the leak is, often in small buys nobody remembers.', 'لا يمكنه إصلاح ما لا يراه. شهر واحد من الأرقام الحقيقية يكشف مكان التسرّب، وكثيرًا ما يكون في مشتريات صغيرة لا يتذكرها أحد.')),
  mcq(P, W, 8, 'pay-yourself-first',
    L('When is the best day for Noor’s automatic transfer to savings?', 'ما أفضل يوم لتحويل نور التلقائي إلى الادخار؟'),
    [L('The day her salary arrives', 'يوم وصول راتبها'), L('The last day of the month', 'آخر يوم في الشهر'), L('Whenever she remembers', 'متى تذكّرت')], 0,
    L('On payday the money is all there. By the last day of the month it has usually been spent, and memory is not a plan.', 'يوم الراتب يكون المال كله موجودًا. وفي آخر الشهر يكون قد أُنفق عادةً، والتذكّر ليس خطة.')),
]

export const budgeting: Module = {
  id: W,
  courseId: 'personal-finance',
  order: 1,
  cover: cover(L('Money basics · Module 1', 'أساسيات المال · الوحدة 1'), L('Budgeting &amp; emergency fund', 'الميزانية وصندوق الطوارئ'), L('≈ 20 min', '≈ 20 دقيقة')),
  sections: [
    section({
      id: 'cash-flow',
      lessons: ['cash-flow'],
      label: L('Part 1', 'الجزء ١'),
      nav: L('Know your cash flow', 'اعرف تدفقك النقدي'),
      title: L('Where did the month go?', 'أين ذهب الشهر؟'),
      standfirst: L('Karim earns well, and still runs out. A month of tracking shows why.', 'كريم يكسب جيدًا، ومع ذلك ينفد ماله. شهر من التتبّع يكشف السبب.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Meet <strong>Karim</strong>. His salary lands on the 1st: 3,000 after tax. By the 25th his account is nearly empty, and he can’t say where it went. Rent was 1,100, so that isn’t the mystery. This month his friend <strong>Noor</strong> dares him to write down every purchase, however small.</p>',
          '<p>تعرّف إلى <strong>كريم</strong>. راتبه يصل في اليوم الأول: 3,000 بعد الضريبة. وبحلول اليوم 25 يكاد حسابه يفرغ، ولا يعرف أين ذهب المال. الإيجار 1,100، فليس هو اللغز. هذا الشهر تتحدّاه صديقته <strong>نور</strong> أن يدوّن كل عملية شراء مهما صغرت.</p>',
        )),
        predict(
          L('Coffees, deliveries, taxis and apps, each under 20. What did they add up to in one month?', 'قهوة وتوصيل طعام وسيارات أجرة وتطبيقات، كل منها أقل من 20. كم بلغ مجموعها في شهر واحد؟'),
          [L('About 150', 'نحو 150'), L('About 300', 'نحو 300'), L('About 600', 'نحو 600'), L('About 900', 'نحو 900')],
          2,
          L(
            'About 600: around 20 a day, every day. No single buy felt like much, which is exactly why nobody remembers them. (Illustrative figures.)',
            'نحو 600: قرابة 20 كل يوم، يوميًا. لم تبدُ أي عملية شراء كبيرة، ولهذا تحديدًا لا يتذكرها أحد. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>Every budget starts with one line: <strong>net income − spending = what’s left</strong>. Net income is what actually reaches your account, after tax. For Karim that line ended at −100: the month cost more than he earned, and his card quietly covered the gap. Small daily buys were the second-biggest cost after rent.</p>',
          '<p>كل ميزانية تبدأ بسطر واحد: <strong>صافي الدخل − الإنفاق = ما يتبقى</strong>. صافي الدخل هو ما يصل فعلًا إلى حسابك بعد الضريبة. عند كريم انتهى هذا السطر عند −100: كلّف الشهر أكثر مما كسب، وغطّت بطاقته الفرق بصمت. والمشتريات اليومية الصغيرة كانت ثاني أكبر تكلفة بعد الإيجار.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Karim’s month: in and out', 'شهر كريم: ما يدخل وما يخرج'),
          src: '/diagrams/pf-cash-flow.svg',
          alt: L(
            'Two bars. Left, income: 3,000. Right, spending: 3,100, made of rent 1,100, small buys 600 (highlighted), food 550, transport 300, bills 250 and other 300. The gap is −100.',
            'عمودان. على اليسار الدخل: 3,000. وعلى اليمين الإنفاق: 3,100، مكوّن من الإيجار 1,100، والمشتريات الصغيرة 600 (مميّزة)، والطعام 550، والمواصلات 300، والفواتير 250، وأخرى 300. الفرق −100.',
          ),
          caption: L('Left: net income. Right: spending, rent at the bottom, small buys highlighted. Illustrative figures.', 'اليسار: صافي الدخل. اليمين: الإنفاق، الإيجار في الأسفل والمشتريات الصغيرة مميّزة. أرقام توضيحية.'),
        }),
        html(L(
          '<p>To see your own month, take one to three months of bank and card statements and sort each line into a few groups: housing, food, transport, bills, debt, fun, other. Mark each cost as <strong>fixed</strong>, the same every month like rent, or <strong>variable</strong>, like eating out. Variable costs are where change is quickest.</p>',
          '<p>لترى شهرك أنت، خذ كشوف الحساب والبطاقة لشهر إلى ثلاثة أشهر وصنّف كل سطر في مجموعات قليلة: السكن، الطعام، المواصلات، الفواتير، الديون، الترفيه، أخرى. وحدّد كل تكلفة: <strong>ثابتة</strong> تتكرر كل شهر مثل الإيجار، أو <strong>متغيرة</strong> مثل الأكل خارج البيت. التكاليف المتغيرة هي الأسرع في التغيير.</p>',
        )),
        keyIdea(L(
          '<p>You can’t plan money you can’t see: <strong>track one real month</strong> before you change anything.</p>',
          '<p>لا يمكنك التخطيط لمال لا تراه: <strong>تتبّع شهرًا حقيقيًا واحدًا</strong> قبل أن تغيّر أي شيء.</p>',
        )),
        exercise('pfb-q001'),
        exercise('pfb-q007'),
      ],
    }),
    section({
      id: 'plan',
      lessons: ['plan'],
      label: L('Part 2', 'الجزء ٢'),
      nav: L('The 50/30/20 guideline', 'قاعدة 50/30/20'),
      title: L('A simple starting point: 50/30/20', 'نقطة بداية بسيطة: 50/30/20'),
      standfirst: L('Three boxes for every salary, and how to tell a need from a want.', 'ثلاثة صناديق لكل راتب، وكيف تفرّق بين الحاجة والرغبة.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Karim now knows where his money goes. Next he needs a plan for where it <em>should</em> go. Noor shows him the split she started with: half of her net income for needs, almost a third for wants, and a fifth for savings. First he has to tell the two kinds of spending apart.</p>',
          '<p>صار كريم يعرف أين يذهب ماله. والآن يحتاج خطة لأين <em>يجب</em> أن يذهب. تُريه نور التقسيم الذي بدأت به: نصف صافي دخلها للحاجات، وقرابة الثلث للرغبات، والخُمس للادخار. لكن عليه أولًا أن يفرّق بين نوعي الإنفاق.</p>',
        )),
        sort(
          L('Need or want? Sort Karim’s monthly costs.', 'حاجة أم رغبة؟ صنّف تكاليف كريم الشهرية.'),
          [L('Need', 'حاجة'), L('Want', 'رغبة')],
          [
            [L('Rent', 'الإيجار'), 0],
            [L('Food delivery', 'توصيل الطعام'), 1],
            [L('Bus pass to work', 'اشتراك الحافلة إلى العمل'), 0],
            [L('A second streaming app', 'تطبيق بث ثانٍ'), 1],
          ],
          L(
            'A need keeps life and work running: a home, basic food, getting to work, minimum debt payments. A want makes life nicer but could pause for a month.',
            'الحاجة تُبقي الحياة والعمل مستمرين: سكن، وطعام أساسي، والوصول إلى العمل، والحد الأدنى لأقساط الديون. والرغبة تجعل الحياة ألطف لكن يمكن إيقافها شهرًا.',
          ),
        ),
        html(L(
          '<p>The <strong>50/30/20</strong> guideline splits net income into three boxes: 50% for needs, 30% for wants, and 20% for savings and paying debt down faster. On Karim’s 3,000 that is 1,500, 900 and 600. It is not a law, just an easy first plan that guarantees one thing: saving gets a fixed share.</p>',
          '<p>قاعدة <strong>50/30/20</strong> تقسم صافي الدخل إلى ثلاثة صناديق: 50% للحاجات، و30% للرغبات، و20% للادخار وتسريع سداد الديون. على 3,000 لدى كريم يعني ذلك 1,500 و900 و600. إنها ليست قانونًا، بل خطة أولى سهلة تضمن أمرًا واحدًا: للادخار حصة ثابتة.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('50/30/20 on a 3,000 salary', '50/30/20 على راتب 3,000'),
          src: '/diagrams/pf-50-30-20.svg',
          alt: L(
            'Three bars: needs 1,500 (50%), wants 900 (30%), savings and extra debt payments 600 (20%).',
            'ثلاثة أعمدة: الحاجات 1,500 (50%)، والرغبات 900 (30%)، والادخار والسداد الإضافي للديون 600 (20%).',
          ),
          caption: L('Needs, wants, then savings and extra debt payments. Illustrative figures.', 'الحاجات، ثم الرغبات، ثم الادخار والسداد الإضافي للديون. أرقام توضيحية.'),
        }),
        box('example', L('Adjust it', 'عدّله'), L(
          'In an expensive city Karim’s rent alone is over a third of his pay, so needs may take 60%. That’s fine: he trims wants to 20% and keeps savings at 20%. The split bends; the savings share is the part to protect.',
          'في مدينة مكلفة يتجاوز إيجار كريم وحده ثلث راتبه، فقد تأخذ الحاجات 60%. لا بأس: يخفّض الرغبات إلى 20% ويُبقي الادخار عند 20%. التقسيم مرن، وحصة الادخار هي الجزء الذي يجب حمايته.',
        )),
        keyIdea(L(
          '<p>Whatever the split, give <strong>saving a fixed share</strong> of every salary, not whatever happens to be left.</p>',
          '<p>مهما كان التقسيم، امنح <strong>الادخار حصة ثابتة</strong> من كل راتب، لا ما يتبقى صدفة.</p>',
        )),
        exercise('pfb-q002'),
        exercise('pfb-q003'),
      ],
    }),
    section({
      id: 'automate',
      lessons: ['automate'],
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Pay yourself first', 'ادفع لنفسك أولًا'),
      title: L('Pay yourself first', 'ادفع لنفسك أولًا'),
      standfirst: L('Why saving on payday beats saving at month-end, every time.', 'لماذا يتفوّق الادخار يوم الراتب على الادخار آخر الشهر، في كل مرة.'),
      time: L('4 min', '4 دقائق'),
      blocks: [
        html(L(
          '<p>Payday. 3,000 has just landed in <strong>Noor’s</strong> account, and her plan says 300 of it is for savings. She can move it now, or keep it in her everyday account and save whatever is left on the 30th. Karim always picked the second way. Which would you pick?</p>',
          '<p>يوم الراتب. وصلت للتوّ 3,000 إلى حساب <strong>نور</strong>، وخطتها تقول إن 300 منها للادخار. يمكنها تحويلها الآن، أو إبقاؤها في حسابها اليومي وادخار ما يتبقى في يوم 30. كريم كان يختار الطريقة الثانية دائمًا. ماذا كنت ستختار؟</p>',
        )),
        choice(L('What should Noor do with the 300?', 'ماذا تفعل نور بالـ300؟'), [
          [
            L('Move it to savings today, automatically', 'تحوّلها إلى الادخار اليوم، تلقائيًا'),
            L('The 300 is saved before she can spend it. She lives on 2,700 and hardly notices, because she never saw the 300 in her everyday account.', 'تُدّخر الـ300 قبل أن تنفقها. تعيش على 2,700 وبالكاد تلاحظ، لأنها لم ترَ الـ300 في حسابها اليومي أصلًا.'),
          ],
          [
            L('Wait and save what’s left on the 30th', 'تنتظر وتدّخر ما يتبقى يوم 30'),
            L('Some months 120 is left, most months nothing. The money was there all along, so it got spent. That is how Karim saved 160 in six months.', 'في بعض الأشهر يتبقى 120، وفي معظمها لا شيء. كان المال موجودًا طوال الوقت، فأُنفق. هكذا ادّخر كريم 160 في ستة أشهر.'),
          ],
          [
            L('Move it when she remembers', 'تحوّلها متى تذكّرت'),
            L('Good months she remembers, busy months she forgets. Saving that depends on memory and willpower tends to fade by the third month.', 'في الأشهر الجيدة تتذكر، وفي المزدحمة تنسى. الادخار المعتمد على الذاكرة وقوة الإرادة يتلاشى عادةً بحلول الشهر الثالث.'),
          ],
        ]),
        html(L(
          '<p><strong>Pay yourself first</strong> means treating savings like a bill to your future self. Set an automatic transfer for the day your salary arrives, into a separate account. Money you never see in your everyday account is much easier not to spend. Then spend the rest freely, within your plan.</p>',
          '<p><strong>ادفع لنفسك أولًا</strong> يعني أن تعامل الادخار كفاتورة لنفسك في المستقبل. أنشئ تحويلًا تلقائيًا في يوم وصول راتبك إلى حساب منفصل. المال الذي لا تراه في حسابك اليومي يسهل كثيرًا ألا تنفقه. ثم أنفق الباقي بحرية ضمن خطتك.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Saved after six months', 'ما ادُّخر بعد ستة أشهر'),
          src: '/diagrams/pf-pay-first.svg',
          alt: L(
            'Two bars after six months: saving what is left at month-end comes to 160; saving 300 on payday comes to 1,800.',
            'عمودان بعد ستة أشهر: ادخار ما يتبقى آخر الشهر يصل إلى 160، وادخار 300 يوم الراتب يصل إلى 1,800.',
          ),
          caption: L('Left: saving what is left at month-end. Right: 300 moved on payday. Illustrative figures.', 'اليسار: ادخار ما يتبقى آخر الشهر. اليمين: 300 تُحوَّل يوم الراتب. أرقام توضيحية.'),
        }),
        keyIdea(L(
          '<p>Save <strong>on payday, automatically</strong>: what never reaches your everyday account is hard to spend.</p>',
          '<p>ادّخر <strong>يوم الراتب، تلقائيًا</strong>: ما لا يصل إلى حسابك اليومي يصعب إنفاقه.</p>',
        )),
        exercise('pfb-q004'),
        exercise('pfb-q008'),
      ],
    }),
    section({
      id: 'emergency',
      lessons: ['emergency'],
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Emergency fund', 'صندوق الطوارئ'),
      title: L('Build an emergency fund', 'ابنِ صندوق طوارئ'),
      standfirst: L('A cushion for the month that goes wrong, so it doesn’t turn into debt.', 'وسادة للشهر الذي يسوء، حتى لا يتحول إلى دين.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>In March, Karim’s car breaks down: 900 to fix, due this week. He has no savings, so it goes on his credit card at a high interest rate. Noor had a dental bill of the same size last year. She paid it from a separate account and refilled it over a few months. Same bad luck, very different cost.</p>',
          '<p>في مارس تتعطل سيارة كريم: 900 للإصلاح، مستحقة هذا الأسبوع. لا مدخرات لديه، فتذهب على بطاقته الائتمانية بفائدة مرتفعة. نور واجهت فاتورة أسنان بالحجم نفسه العام الماضي، فدفعتها من حساب منفصل ثم أعادت ملأه خلال بضعة أشهر. الحظ السيئ نفسه، والتكلفة مختلفة جدًا.</p>',
        )),
        myth(
          L('An emergency fund is money doing nothing; it should be invested instead.', 'صندوق الطوارئ مال عاطل؛ الأفضل أن يُستثمر.'),
          false,
          L(
            'Its job is to be there, in full, on a bad day. Invested money might be down 20% exactly when the car breaks. The fund also protects your investments: you never have to sell them at a bad time.',
            'وظيفته أن يكون موجودًا كاملًا في اليوم السيئ. المال المستثمر قد يكون هابطًا 20% في اللحظة التي تتعطل فيها السيارة. والصندوق يحمي استثماراتك أيضًا: لن تضطر لبيعها في وقت سيئ.',
          ),
        ),
        html(L(
          '<p>A common guide is an <strong>emergency fund</strong> of three to six months of essential costs: the needs, not everything you spend. If your essentials are 1,800 a month, that is 5,400 to 10,800. Aim nearer six months if your income is irregular or a family depends on you. Start with a first target of one month, so the progress shows.</p>',
          '<p>من الإرشادات الشائعة أن يغطي <strong>صندوق الطوارئ</strong> من ثلاثة إلى ستة أشهر من التكاليف الأساسية: الحاجات، لا كل ما تنفقه. إذا كانت أساسياتك 1,800 شهريًا فالمبلغ من 5,400 إلى 10,800. اقترب من ستة أشهر إذا كان دخلك غير منتظم أو تعتمد عليك أسرة. وابدأ بهدف أول قدره شهر واحد، ليظهر التقدم.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('An emergency fund for 1,800 a month of essentials', 'صندوق طوارئ لأساسيات قدرها 1,800 شهريًا'),
          src: '/diagrams/pf-buffer.svg',
          alt: L(
            'Three bars: one month is 1,800, three months 5,400, six months 10,800.',
            'ثلاثة أعمدة: شهر واحد 1,800، وثلاثة أشهر 5,400، وستة أشهر 10,800.',
          ),
          caption: L('Months of essential costs covered: a first target of 1, then 3 to 6. Illustrative figures.', 'أشهر التكاليف الأساسية المغطاة: هدف أول قدره 1، ثم من 3 إلى 6. أرقام توضيحية.'),
        }),
        box('example', L('Where to keep it', 'أين تحفظه'), L(
          'Noor keeps hers in a separate savings account: safe, reachable within a day, but not on her everyday card. She uses it only for real emergencies, like a repair, a medical bill or a lost job, and refills it straight after.',
          'تحفظ نور صندوقها في حساب توفير منفصل: آمن، ويمكن الوصول إليه خلال يوم، لكنه ليس على بطاقتها اليومية. تستخدمه للطوارئ الحقيقية فقط، مثل إصلاح أو فاتورة طبية أو فقدان عمل، وتعيد ملأه فورًا بعدها.',
        )),
        keyIdea(L(
          '<p>Keep <strong>3–6 months of essentials</strong> somewhere safe and separate, so a bad month never becomes debt.</p>',
          '<p>احتفظ <strong>بأساسيات من 3 إلى 6 أشهر</strong> في مكان آمن ومنفصل، حتى لا يتحول شهر سيئ إلى دين أبدًا.</p>',
        )),
        exercise('pfb-q005'),
        exercise('pfb-q006'),
      ],
    }),
  ],
  questions,
}
