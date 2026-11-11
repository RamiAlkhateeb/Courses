// Original course content. Figures are illustrative examples, not forecasts.
// Unit 1 follows two fictional characters, the same in both languages: Noor (نور), a careful saver, and Karim (كريم),
// a curious first-time investor. Each lesson opens on their story with something to do (a guess, a choice, a sort or
// a myth), then explains.
import type { Module } from '../../types'
import { L, box, choice, compoundCalculator, cover, diagram, exercise, html, keyIdea, mcq, myth, practice, predict, section, sort, table, takeaways } from '../../helpers'

const W = 'basics'
const P = 'invb'

const questions = [
  mcq(P, W, 1, 'inflation',
    L('Cash in a savings account earns 1% a year while prices rise 3% a year. What happens to its purchasing power?', 'نقود في حساب توفير تربح 1% سنويًا بينما ترتفع الأسعار 3% سنويًا. ماذا يحدث لقوتها الشرائية؟'),
    [L('It shrinks', 'تتناقص'), L('It grows by 1% a year', 'تنمو 1% سنويًا'), L('It stays the same', 'تبقى كما هي')], 0,
    L('Prices rise faster (3%) than the money grows (1%), so the same cash buys a little less each year.', 'الأسعار ترتفع (3%) أسرع مما ينمو المال (1%)، فيشتري النقد نفسه أقل قليلًا كل عام.')),
  mcq(P, W, 2, 'compounding',
    L('Why does compounding make starting early so powerful?', 'لماذا تجعل الفائدة المركبة البدء المبكر قويًا جدًا؟'),
    [L('Returns start earning returns of their own, and that effect grows with time', 'العوائد تبدأ بتحقيق عوائد خاصة بها، ويكبر هذا الأثر مع الوقت'), L('Banks pay higher rates to young people', 'البنوك تدفع فوائد أعلى للشباب'), L('Markets always rise in the first years', 'الأسواق ترتفع دائمًا في السنوات الأولى')], 0,
    L('Each year’s growth joins the pot, so the next year grows on a bigger base. More years means more growth on growth.', 'نمو كل عام ينضم إلى الرصيد، فينمو العام التالي على أساس أكبر. سنوات أكثر تعني نموًا أكثر على النمو.')),
  mcq(P, W, 3, 'compounding',
    L('Using the rule of 72, roughly how long does money take to double at 6% a year?', 'باستخدام قاعدة 72، كم تقريبًا يستغرق المال ليتضاعف بعائد 6% سنويًا؟'),
    [L('About 12 years', 'نحو 12 سنة'), L('About 6 years', 'نحو 6 سنوات'), L('About 20 years', 'نحو 20 سنة')], 0,
    L('72 ÷ 6 = 12, so the money doubles in about 12 years.', '72 ÷ 6 = 12، فيتضاعف المال في نحو 12 سنة.')),
  mcq(P, W, 4, 'risk',
    L('In investing, “risk” mainly means…', 'في الاستثمار، تعني «المخاطرة» أساسًا…'),
    [L('Uncertainty about the outcome, including the chance of losing money', 'عدم اليقين بشأن النتيجة، بما في ذلك احتمال خسارة المال'), L('Only fraud', 'الاحتيال فقط'), L('The fee you pay a broker', 'الرسوم التي تدفعها للوسيط')], 0,
    L('Risk means not knowing the result in advance, and that includes the chance of ending up with less than you put in.', 'المخاطرة تعني عدم معرفة النتيجة مسبقًا، ويشمل ذلك احتمال أن ينتهي بك الأمر بأقل مما وضعت.')),
  mcq(P, W, 5, 'horizon',
    L('You need the money for a house deposit in 18 months. Which fits best?', 'تحتاج المال لدفعة أولى لمنزل بعد 18 شهرًا. أيهما الأنسب؟'),
    [L('Low-risk options such as savings or short-term deposits', 'خيارات منخفضة المخاطر مثل التوفير أو الودائع قصيرة الأجل'), L('A single volatile stock', 'سهم واحد شديد التقلب'), L('Cryptocurrency', 'العملات المشفرة')], 0,
    L('Money you need in 18 months has no time to recover from a fall, and stocks or crypto can drop 30% or more in a year.', 'المال الذي تحتاجه بعد 18 شهرًا لا يملك وقتًا للتعافي من الهبوط، والأسهم أو العملات المشفرة قد تهبط 30% أو أكثر في عام.')),
  mcq(P, W, 6, 'readiness',
    L('Which is usually done before investing for the long term?', 'أي مما يلي يُنجز عادةً قبل الاستثمار طويل الأجل؟'),
    [L('Building an emergency fund and paying off high-interest debt', 'بناء صندوق طوارئ وسداد الديون ذات الفائدة المرتفعة'), L('Taking a loan to invest more', 'أخذ قرض لاستثمار المزيد'), L('Waiting for the market to crash', 'انتظار انهيار السوق')], 0,
    L('An emergency fund means you never have to sell investments at a bad time, and clearing 20% debt is a guaranteed saving.', 'صندوق الطوارئ يعني ألا تضطر أبدًا لبيع استثماراتك في وقت سيئ، وسداد دين بفائدة 20% توفير مضمون.')),
  mcq(P, W, 7, 'saving',
    L('Which money belongs in a savings account rather than an investment?', 'أي مال مكانه حساب التوفير لا الاستثمار؟'),
    [L('An emergency fund you might need next month', 'صندوق طوارئ قد تحتاجه الشهر القادم'), L('Retirement money you will not touch for 30 years', 'مال التقاعد الذي لن تلمسه لمدة 30 سنة'), L('Money you plan to leave for 15 years', 'مال تخطط لتركه 15 سنة')], 0,
    L('Saving keeps money safe and close at hand. Investing suits money you can leave alone for years.', 'الادخار يحفظ المال بأمان وفي متناول اليد. أما الاستثمار فيناسب المال الذي يمكنك تركه لسنوات.')),
  mcq(P, W, 8, 'readiness',
    L('Someone offers you 30% a year, guaranteed. What is the most likely explanation?', 'عرض عليك أحدهم 30% سنويًا مضمونة. ما التفسير الأرجح؟'),
    [L('It is probably a scam', 'على الأرجح احتيال'), L('It is a normal stock market return', 'إنه عائد عادي في سوق الأسهم'), L('Banks give it to new customers', 'البنوك تمنحه للعملاء الجدد')], 0,
    L('Real investments never guarantee high returns. A promise of high, guaranteed returns is a classic sign of fraud.', 'الاستثمارات الحقيقية لا تضمن عوائد مرتفعة أبدًا. وعد العوائد المرتفعة المضمونة علامة تقليدية على الاحتيال.')),
  mcq(P, W, 9, 'fees',
    L('In the simulator every buy and every sell costs 1%. You buy for $200 and sell straight away at the same price. About how much do you get back?', 'في المحاكي تكلّف كل عملية شراء وكل عملية بيع 1%. اشتريت بـ200 دولار ثم بعت فورًا بالسعر نفسه. كم تسترد تقريبًا؟'),
    [L('About $196', 'نحو 196 دولارًا'), L('Exactly $200', '200 دولار بالضبط'), L('About $220', 'نحو 220 دولارًا')], 0,
    L('About $2 goes on the buy and about $2 more on the sell, so a quick in-and-out loses roughly 2% even when the price has not moved.', 'يذهب نحو دولارين على الشراء ونحو دولارين آخرين على البيع، فالدخول والخروج السريع يخسر نحو 2% حتى لو لم يتحرك السعر.')),
  mcq(P, W, 10, 'practice',
    L('What is the simulator, with its play money and simulated prices, for?', 'ما الغرض من المحاكي، بماله الافتراضي وأسعاره المحاكاة؟'),
    [L('Practising decisions without risking real money', 'التدرّب على القرارات دون المخاطرة بمال حقيقي'), L('Predicting tomorrow’s real prices', 'توقّع الأسعار الحقيقية للغد'), L('Choosing real products to buy', 'اختيار منتجات حقيقية لشرائها')], 0,
    L('The prices are made up and the money is not real: it lets you feel fees, time and ups and downs safely. It says nothing about real markets.', 'الأسعار مُختلَقة والمال ليس حقيقيًا: يتيح لك أن تشعر بالرسوم والوقت والصعود والهبوط بأمان. ولا يقول شيئًا عن الأسواق الحقيقية.')),
]

export const basics: Module = {
  id: W,
  courseId: 'investing',
  order: 1,
  cover: cover(L('Foundations · Module 1', 'الأساسيات · الوحدة 1'), L('How investing works', 'كيف يعمل الاستثمار'), L('≈ 25 min', '≈ 25 دقيقة')),
  sections: [
    section({
      id: 'why',
      lessons: ['why'],
      label: L('Intro', 'مقدمة'),
      nav: L('Saving vs investing', 'الادخار مقابل الاستثمار'),
      title: L('The money in the drawer', 'المال في الدرج'),
      standfirst: L('Cash feels safe. Here is what it quietly loses.', 'النقد يبدو آمنًا. إليك ما يخسره بصمت.'),
      time: L('4 min', '4 دقائق'),
      blocks: [
        html(L(
          '<p>Meet <strong>Noor</strong>. She is careful with money: 1,000 sits in a drawer at home, safe from any market crash. Her friend <strong>Karim</strong> has just started investing and thinks she is missing out. Noor plans to leave the cash alone for 24 years, while prices rise 3% a year.</p>',
          '<p>تعرّف إلى <strong>نور</strong>. إنها حريصة على مالها: 1,000 في درج بالبيت، بعيدًا عن أي انهيار في السوق. صديقها <strong>كريم</strong> بدأ الاستثمار للتوّ، ويظن أنها تفوّت فرصة. تنوي نور ترك النقد كما هو 24 سنة، بينما ترتفع الأسعار 3% كل عام.</p>',
        )),
        predict(
          L('In 24 years, what will Noor’s 1,000 buy?', 'بعد 24 سنة، ماذا ستشتري الـ1,000 التي لدى نور؟'),
          [L('Still 1,000 worth', 'ما قيمته 1,000 كما هي'), L('About 750 worth', 'ما قيمته نحو 750'), L('About 500 worth', 'ما قيمته نحو 500'), L('About 250 worth', 'ما قيمته نحو 250')],
          2,
          L(
            'About 492 worth. The note still says 1,000, but prices have doubled, so it buys about half as much. (Illustrative figures.)',
            'ما قيمته نحو 492. الورقة ما زالت تقول 1,000، لكن الأسعار تضاعفت، فصارت تشتري نحو النصف. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>That silent loss is <strong>inflation</strong>: prices creep up almost every year. The number in Noor’s drawer never moves, so every year it buys a little less. Nothing was stolen and nothing crashed. The cash simply stood still while the world got more expensive.</p>',
          '<p>هذه الخسارة الصامتة هي <strong>التضخم</strong>: الأسعار تزحف للأعلى كل عام تقريبًا. الرقم في درج نور لا يتحرك، فيشتري أقل قليلًا كل عام. لم يُسرق شيء ولم ينهَر شيء. النقد ببساطة وقف مكانه بينما صار العالم أغلى.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('What 1,000 in cash buys over time', 'ماذا تشتري 1,000 نقدًا مع مرور الوقت'),
          src: '/diagrams/inflation.svg',
          alt: L(
            'Bar chart: 1,000 today buys what 789 buys in 8 years, 623 in 16 years and 492 in 24 years.',
            'رسم بالأعمدة: 1,000 اليوم تشتري ما تشتريه 789 بعد 8 سنوات، و623 بعد 16 سنة، و492 بعد 24 سنة.',
          ),
          caption: L('Years from now, at 3% inflation a year. Illustrative figures.', 'السنوات من الآن، بتضخم 3% سنويًا. أرقام توضيحية.'),
        }),
        box('example', L('Example', 'مثال'), L(
          'Noor’s morning coffee costs 2.00 today. At 3% inflation, the same cup costs about 4.07 in 24 years. Keep 2.00 in the drawer for her older self, and one day it buys only half a cup. (Illustrative figures.)',
          'قهوة نور الصباحية تكلّف اليوم 2.00. بتضخم 3% سيكلّف الكوب نفسه نحو 4.07 بعد 24 سنة. احتفظ بـ2.00 في الدرج لنور في كِبرها، وسيأتي يوم لا تشتري فيه إلا نصف كوب. (أرقام توضيحية.)',
        )),
        html(L(
          '<p>So should Noor invest everything? No. <strong>Saving</strong> keeps money safe and close for the next few years. <strong>Investing</strong> puts money to work for many years, and accepts ups and downs on the way. Most people need both. The real question is which money goes where.</p>',
          '<p>إذن هل تستثمر نور كل شيء؟ لا. <strong>الادخار</strong> يحفظ المال آمنًا وقريبًا للسنوات القليلة القادمة. و<strong>الاستثمار</strong> يُشغّل المال لسنوات طويلة، ويقبل الصعود والهبوط على الطريق. معظم الناس يحتاجون الاثنين. السؤال الحقيقي: أي مال يذهب إلى أين؟</p>',
        )),
        sort(
          L('Saving or investing? Sort Noor’s money by when she will need it.', 'ادخار أم استثمار؟ صنّف مال نور حسب موعد حاجتها إليه.'),
          [L('Saving', 'ادخار'), L('Investing', 'استثمار')],
          [
            [L('Rent due in two weeks', 'إيجار مستحق بعد أسبوعين'), 0],
            [L('Her retirement, 30 years away', 'تقاعدها، بعد 30 سنة'), 1],
            [L('A fund for car repairs', 'مبلغ لإصلاحات السيارة'), 0],
            [L('Her niece’s university, 15 years away', 'جامعة ابنة أختها، بعد 15 سنة'), 1],
          ],
          L(
            'Money needed within a few years stays in savings, safe from a fall. Money that can sit for many years has time to ride out the ups and downs.',
            'المال المطلوب خلال بضع سنوات يبقى في الادخار، بعيدًا عن الهبوط. والمال الذي يمكن تركه سنوات طويلة لديه وقت لتجاوز الصعود والهبوط.',
          ),
        ),
        keyIdea(L(
          '<p>Money that grows slower than prices <strong>loses buying power</strong>, even when the number in your account goes up.</p>',
          '<p>المال الذي ينمو أبطأ من الأسعار <strong>يفقد قوته الشرائية</strong>، حتى لو ارتفع الرقم في حسابك.</p>',
        )),
        exercise('invb-q001'),
        exercise('invb-q007'),
      ],
    }),
    section({
      id: 'compounding',
      lessons: ['compounding'],
      label: L('Part 1', 'الجزء ١'),
      nav: L('Compounding', 'الفائدة المركبة'),
      title: L('Compounding: returns on your returns', 'الفائدة المركبة: عوائد على عوائدك'),
      standfirst: L('Why Karim’s money grows faster every year, without him adding a cent.', 'لماذا ينمو مال كريم أسرع كل عام، دون أن يضيف قرشًا.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p><strong>Karim</strong> is 25. He invests 1,000 once, then leaves it alone. It earns 7% a year and he never adds more. Most people work it out like this: 7% of 1,000 is 70, so add 70 a year. Make your guess before the chart.</p>',
          '<p><strong>كريم</strong> عمره 25 سنة. استثمر 1,000 مرة واحدة ثم تركها. تربح 7% سنويًا ولا يضيف إليها شيئًا. معظم الناس يحسبونها هكذا: 7% من 1,000 تساوي 70، فأضِف 70 كل عام. خمّن قبل أن ترى الرسم.</p>',
        )),
        predict(
          L('What is Karim’s 1,000 worth at 55, thirty years later?', 'كم تساوي الـ1,000 التي لدى كريم عندما يبلغ 55، بعد ثلاثين سنة؟'),
          [L('About 3,100', 'نحو 3,100'), L('About 4,500', 'نحو 4,500'), L('About 7,600', 'نحو 7,600'), L('About 15,000', 'نحو 15,000')],
          2,
          L(
            'About 7,612. Adding 70 a year gives only 3,100. The rest is compounding: each year’s growth starts earning growth of its own. (Illustrative figures.)',
            'نحو 7,612. إضافة 70 كل عام تعطي 3,100 فقط. والباقي فائدة مركبة: نمو كل عام يبدأ بتحقيق نمو خاص به. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>That is <strong>compounding</strong>: returns earning returns. In the chart, the dark part of each bar is Karim’s 1,000; everything above it is growth. Look at the last ten years: they add more than the first twenty put together.</p>',
          '<p>هذه هي <strong>الفائدة المركبة</strong>: عوائد تربح عوائد. في الرسم، الجزء الداكن من كل عمود هو الـ1,000 التي وضعها كريم؛ وكل ما فوقه نمو. انظر إلى السنوات العشر الأخيرة: تضيف أكثر من العشرين الأولى مجتمعة.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('1,000 growing at 7% a year', '1,000 تنمو بعائد 7% سنويًا'),
          src: '/diagrams/compounding.svg',
          alt: L(
            'Bar chart: 1,000 grows to about 1,967 after 10 years, 3,870 after 20 years and 7,612 after 30 years.',
            'رسم بالأعمدة: 1,000 تنمو إلى نحو 1,967 بعد 10 سنوات، و3,870 بعد 20 سنة، و7,612 بعد 30 سنة.',
          ),
          caption: L('Years from now. Dark: the 1,000 put in. Light: growth. Illustrative figures.', 'السنوات من الآن. الداكن: الـ1,000 الموضوعة. الفاتح: النمو. أرقام توضيحية.'),
        }),
        box('keypoint', L('Rule of 72', 'قاعدة 72'), L(
          'A shortcut: divide 72 by the yearly return to see roughly how many years money takes to double. At 7%, about 10 years; at 3%, about 24. It works for inflation too: that is why Noor’s cash halved.',
          'اختصار: اقسم 72 على العائد السنوي لتعرف تقريبًا كم سنة يحتاج المال ليتضاعف. بعائد 7% نحو 10 سنوات، وبعائد 3% نحو 24. وتنطبق على التضخم أيضًا: لهذا تقلّص نقد نور إلى النصف.',
        )),
        html(L(
          '<p>Noor likes the idea, but she has no lump sum. She could invest <strong>200 a month</strong> instead. Over 30 years at 7% a year, that grows to about <strong>244,000</strong>, and only 72,000 of it is money she put in. Small, regular amounts compound too. (Illustrative figures.)</p>',
          '<p>أعجبت نور الفكرة، لكن ليس لديها مبلغ كبير. يمكنها بدلًا من ذلك استثمار <strong>200 شهريًا</strong>. على مدى 30 سنة بعائد 7% سنويًا، يصل ذلك إلى نحو <strong>244,000</strong>، منها 72,000 فقط من مالها. المبالغ الصغيرة المنتظمة تتراكم أيضًا. (أرقام توضيحية.)</p>',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Treating 7% as a promise. Real returns change every year and some years are negative; the examples show how compounding works, not what will happen.',
          'اعتبار 7% وعدًا. العوائد الحقيقية تتغير كل عام وبعض السنوات سالبة؛ الأمثلة توضّح كيف تعمل الفائدة المركبة، لا ما سيحدث.',
        )),
        compoundCalculator,
        myth(
          L('You need a lot of money before you can start investing.', 'تحتاج مالًا كثيرًا قبل أن تبدأ الاستثمار.'),
          false,
          L(
            'Many funds accept small amounts, and Noor’s 200 a month grew to about 244,000 in the example. Starting early matters more than starting big.',
            'كثير من الصناديق تقبل مبالغ صغيرة، و200 شهريًا من نور وصلت إلى نحو 244,000 في المثال. البدء المبكر أهم من البدء بمبلغ كبير.',
          ),
        ),
        keyIdea(L(
          '<p>Compounding rewards <strong>time</strong>: the earlier you start, the more your growth earns growth of its own.</p>',
          '<p>الفائدة المركبة تكافئ <strong>الوقت</strong>: كلما بدأت أبكر، حقق نموك نموًا خاصًا به أكثر.</p>',
        )),
        exercise('invb-q002'),
        exercise('invb-q003'),
      ],
    }),
    section({
      id: 'risk-return',
      lessons: ['risk-return'],
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Risk and return', 'المخاطرة والعائد'),
      title: L('Risk and return go together', 'المخاطرة والعائد متلازمان'),
      standfirst: L('Karim’s first bad year, and what it teaches.', 'أول عام سيئ لكريم، وما يعلّمه.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Year two. Karim opens his app and his investments are down <strong>30%</strong>: the 1,000 he put in now shows 700. The news is gloomy and his friends are nervous. He will not need this money for another 20 years.</p>',
          '<p>العام الثاني. يفتح كريم تطبيقه فيجد استثماراته منخفضة <strong>30%</strong>: الـ1,000 التي وضعها تظهر الآن 700. الأخبار قاتمة وأصدقاؤه قلقون. ولن يحتاج هذا المال قبل 20 سنة أخرى.</p>',
        )),
        choice(L('Karim is down 30%. What would you do in his place?', 'كريم خاسر 30%. ماذا كنت ستفعل مكانه؟'), [
          [
            L('Sell everything before it falls further', 'أبيع كل شيء قبل أن يهبط أكثر'),
            L(
              'Selling turns a fall on the screen into a real loss, plus fees. If prices recover later, Karim is no longer there for it.',
              'البيع يحوّل الهبوط على الشاشة إلى خسارة حقيقية، مع الرسوم. وإذا تعافت الأسعار لاحقًا، فلن يكون كريم موجودًا ليستفيد.',
            ),
          ],
          [
            L('Hold and wait', 'أحتفظ وأنتظر'),
            L(
              'Holding means riding out the fall. Past falls have often recovered over the years, but there is no guarantee, and nobody knows how long it takes.',
              'الاحتفاظ يعني تحمّل الهبوط حتى يمر. هبوطات سابقة كثيرًا ما تعافت مع السنين، لكن لا ضمان، ولا أحد يعرف كم يستغرق ذلك.',
            ),
          ],
          [
            L('Invest a little more with spare cash', 'أستثمر قليلًا إضافيًا من مال فائض'),
            L(
              'Buying when prices are low can pay off over a long horizon, but only with money he will not need for years. It also puts more at risk if prices keep falling.',
              'الشراء والأسعار منخفضة قد يفيد على مدى طويل، لكن فقط بمال لن يحتاجه لسنوات. كما أنه يعرّض مالًا أكثر للخطر إذا واصلت الأسعار الهبوط.',
            ),
          ],
        ]),
        html(L(
          '<p>Karim’s bad year is the price of chasing growth. <strong>Risk</strong> means not knowing the outcome in advance, including the chance of losing money. The investments that can grow the most are the ones that can fall the furthest. Here is how three kinds compare.</p>',
          '<p>عام كريم السيئ هو ثمن السعي إلى النمو. <strong>المخاطرة</strong> تعني عدم معرفة النتيجة مسبقًا، بما في ذلك احتمال خسارة المال. الاستثمارات التي يمكن أن تنمو أكثر هي نفسها التي يمكن أن تهبط أكثر. إليك مقارنة بين ثلاثة أنواع.</p>',
        )),
        table(
          [L('Holding', 'الأصل'), L('Expected long-run return', 'العائد المتوقع على المدى الطويل'), L('Short-term swings', 'التقلبات قصيرة الأجل')],
          [
            [L('Cash / savings', 'النقد / التوفير'), L('Low', 'منخفض'), L('Very small', 'ضئيلة جدًا')],
            [L('Bonds', 'السندات'), L('Low to medium', 'منخفض إلى متوسط'), L('Moderate', 'معتدلة')],
            [L('Stocks', 'الأسهم'), L('Higher', 'أعلى'), L('Large — falls of 30% or more happen', 'كبيرة — يحدث هبوط بنسبة 30% أو أكثر')],
          ],
        ),
        html(L(
          '<p>Each bar runs from a bad year to a good year. The bigger the possible <strong>gain</strong>, the bigger the possible <strong>fall</strong>: Karim’s 30% drop sits well inside the stocks bar.</p>',
          '<p>يمتد كل عمود من عام سيئ إلى عام جيد. كلما كبر <strong>الربح</strong> الممكن، كبر <strong>الهبوط</strong> الممكن: هبوط كريم بنسبة 30% يقع داخل عمود الأسهم بوضوح.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('A bad year and a good year', 'عام سيئ وعام جيد'),
          src: '/diagrams/risk-return.svg',
          alt: L(
            'Ranges of yearly results: cash from 0% to +5%, bonds from −10% to +15%, stocks from −40% to +50%.',
            'نطاقات النتائج السنوية: النقد من 0% إلى +5%، والسندات من −10% إلى +15%، والأسهم من −40% إلى +50%.',
          ),
          caption: L('Left to right: cash, bonds, stocks. Illustrative ranges, not forecasts.', 'من اليسار إلى اليمين: النقد، السندات، الأسهم. نطاقات توضيحية لا توقعات.'),
        }),
        html(L(
          '<p>Why can Karim sit tight when Noor could not? His <strong>time horizon</strong>, how long until he needs the money, is 20 years: plenty of time for prices to recover. Noor is saving for a wedding next year. A 30% fall would hit her before it could heal, so that money should not depend on the stock market.</p>',
          '<p>لماذا يستطيع كريم الصبر بينما لا تستطيع نور؟ <strong>أفقه الزمني</strong>، أي المدة حتى يحتاج المال، 20 سنة: وقت كافٍ لتتعافى الأسعار. أما نور فتدّخر لعرس في العام القادم. هبوط 30% سيصيبها قبل أن يتعافى، لذا لا ينبغي أن يعتمد ذلك المال على سوق الأسهم.</p>',
        )),
        box('analogy', L('Analogy', 'تشبيه'), L(
          'A short trip by car versus a long road trip: on a short trip one traffic jam ruins your timing; on a long trip the delays average out over the journey.',
          'رحلة قصيرة بالسيارة مقابل رحلة طويلة: في الرحلة القصيرة، زحمة واحدة تفسد موعدك؛ أما في الطويلة فتتوزع التأخيرات على الطريق كله.',
        )),
        keyIdea(L(
          '<p>Higher expected return comes with <strong>bigger falls</strong> along the way, so match the risk to when you need the money.</p>',
          '<p>العائد المتوقع الأعلى يأتي مع <strong>هبوط أكبر</strong> على الطريق، فاجعل المخاطرة تناسب موعد حاجتك للمال.</p>',
        )),
        exercise('invb-q004'),
        exercise('invb-q005'),
      ],
    }),
    section({
      id: 'ready',
      lessons: ['ready'],
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Are you ready to invest?', 'هل أنت جاهز للاستثمار؟'),
      title: L('Before you invest', 'قبل أن تستثمر'),
      standfirst: L('Noor wants to start. Four checks come first.', 'نور تريد البدء. أربعة فحوص تأتي أولًا.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>After a year of watching Karim, Noor wants to start. She has <strong>2,000</strong> spare. She also has a credit card balance charging <strong>20% a year</strong>. Over the long run, stock markets have returned around 7% a year, with big swings along the way. (Illustrative figures.)</p>',
          '<p>بعد عام من مراقبة كريم، تريد نور أن تبدأ. لديها <strong>2,000</strong> فائضة. ولديها أيضًا رصيد على بطاقة ائتمان بفائدة <strong>20% سنويًا</strong>. على المدى الطويل حققت أسواق الأسهم نحو 7% سنويًا، مع تقلبات كبيرة على الطريق. (أرقام توضيحية.)</p>',
        )),
        choice(L('Noor has 2,000 and a card charging 20%. What would you do?', 'لدى نور 2,000 وبطاقة بفائدة 20%. ماذا كنت ستفعل؟'), [
          [
            L('Pay off the card first', 'أسدد البطاقة أولًا'),
            L('Every 1,000 paid off saves 200 a year in interest, for certain. Very few investments come anywhere near that, and none guarantee it.', 'كل 1,000 تُسدَّد توفّر 200 سنويًا من الفوائد، بشكل مؤكد. قليل جدًا من الاستثمارات يقترب من ذلك، ولا شيء منها يضمنه.'),
          ],
          [
            L('Invest it all and keep the card', 'أستثمر كل شيء وأبقي البطاقة'),
            L('Her investments would need more than 20% a year just to keep level with the interest: far above what markets usually return, and not guaranteed.', 'ستحتاج استثماراتها أكثر من 20% سنويًا فقط لتعادل الفائدة: أعلى بكثير مما تحققه الأسواق عادة، ودون ضمان.'),
          ],
          [
            L('Split it half and half', 'أقسمه نصفين'),
            L('Better than ignoring the card, but the half on the card is the half with the sure 20%. The other half is racing against it.', 'أفضل من تجاهل البطاقة، لكن النصف الذي يذهب للبطاقة هو صاحب الـ20% المؤكدة. والنصف الآخر يسابقه.'),
          ],
        ]),
        html(L(
          '<p>Paying off a 20% debt works like a guaranteed 20% return. The chart puts that next to a long-run stock average, which is hoped for, not promised. That gap is why expensive debt usually comes before investing.</p>',
          '<p>سداد دين بفائدة 20% يعمل كعائد مضمون بنسبة 20%. يضع الرسم ذلك بجانب متوسط الأسهم على المدى الطويل، وهو متوقَّع لا مضمون. هذه الفجوة هي سبب أن الدين المكلف يأتي عادة قبل الاستثمار.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('A sure 20% against a hoped-for 7%', '20% مؤكدة مقابل 7% متوقَّعة'),
          src: '/diagrams/debt-vs-invest.svg',
          alt: L(
            'Two bars: 20% for the interest saved by paying off a card, and about 7% for a long-run stock market average.',
            'عمودان: 20% للفائدة الموفَّرة بسداد البطاقة، ونحو 7% لمتوسط سوق الأسهم على المدى الطويل.',
          ),
          caption: L('Left: interest saved, for certain. Right: a long-run average, not guaranteed. Illustrative figures.', 'اليسار: فائدة موفَّرة، مؤكدة. اليمين: متوسط طويل الأجل، غير مضمون. أرقام توضيحية.'),
        }),
        html(L(
          '<ol><li><strong>Emergency fund</strong>: a common guideline is 3–6 months of essential expenses in easy-to-reach savings.</li><li><strong>High-interest debt</strong>: like Noor’s card, clear it first.</li><li><strong>Clear goals</strong>: what is the money for, and when will you need it?</li><li><strong>Risk tolerance</strong>: could you watch your investments fall by a third, as Karim did, without selling in panic?</li></ol>',
          '<ol><li><strong>صندوق الطوارئ</strong>: إرشاد شائع هو ادخار مصاريف 3–6 أشهر من النفقات الأساسية في حساب سهل الوصول.</li><li><strong>الديون ذات الفائدة المرتفعة</strong>: مثل بطاقة نور، سدّدها أولًا.</li><li><strong>أهداف واضحة</strong>: لأي غرض هذا المال، ومتى ستحتاجه؟</li><li><strong>تحمّل المخاطر</strong>: هل يمكنك رؤية استثماراتك تهبط بمقدار الثلث، كما حدث لكريم، دون أن تبيع بذعر؟</li></ol>',
        )),
        myth(
          L('Once you invest, your money is locked away for years.', 'بمجرد أن تستثمر، يُحبس مالك لسنوات.'),
          false,
          L(
            'Many funds can be sold on any working day. The reason to leave money for years is the swings: selling during a fall turns it into a real loss.',
            'كثير من الصناديق يمكن بيعها في أي يوم عمل. سبب ترك المال لسنوات هو التقلبات: البيع أثناء الهبوط يحوّله إلى خسارة حقيقية.',
          ),
        ),
        box('mistake', L('Watch out', 'انتبه'), L(
          'Promises of high, guaranteed returns are a classic sign of a scam. Real investments never guarantee high returns.',
          'وعود العوائد المرتفعة والمضمونة علامة تقليدية على الاحتيال. الاستثمارات الحقيقية لا تضمن عوائد مرتفعة أبدًا.',
        )),
        keyIdea(L(
          '<p>Build an <strong>emergency fund</strong> and clear expensive debt first; invest money you can leave alone for years.</p>',
          '<p>ابنِ <strong>صندوق طوارئ</strong> وسدّد الديون المكلفة أولًا؛ واستثمر المال الذي يمكنك تركه لسنوات.</p>',
        )),
        exercise('invb-q006'),
        exercise('invb-q008'),
        takeaways([
          L('Cash that grows slower than inflation loses value', 'النقد الذي ينمو أبطأ من التضخم يفقد قيمته'),
          L('Compounding rewards time — start early, contribute regularly', 'الفائدة المركبة تكافئ الوقت — ابدأ مبكرًا وساهم بانتظام'),
          L('Higher expected return means higher risk', 'العائد المتوقع الأعلى يعني مخاطرة أعلى'),
          L('Emergency fund and expensive debt come first', 'صندوق الطوارئ والديون المكلفة تأتي أولًا'),
        ]),
      ],
    }),
    section({
      id: 'practice-first-buy',
      lessons: ['practice-first-buy'],
      label: L('Practice', 'تدريب'),
      nav: L('Your first investment', 'استثمارك الأول'),
      title: L('Practice: your first investment', 'تدريب: استثمارك الأول'),
      standfirst: L(
        'Karim started with one small buy. Now it is your turn, with play money.',
        'بدأ كريم بعملية شراء صغيرة واحدة. والآن دورك، بمال افتراضي.',
      ),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Below is the simulator: <strong>play money</strong> and made-up prices, practice only and not advice. Pick any investment, choose an amount and tap <strong>Buy</strong>. That first buy starts the clock: one real week is one simulated year. Every buy and every sell costs a <strong>1% fee</strong>, so quick in-and-out trades cost you twice.</p>',
          '<p>في الأسفل المحاكي: <strong>مال افتراضي</strong> وأسعار مُختلَقة، للتدريب فقط وليس نصيحة. اختر أي استثمار، وحدّد مبلغًا، واضغط <strong>شراء</strong>. أول عملية شراء تشغّل الساعة: كل أسبوع حقيقي يعادل سنة في المحاكاة. وكل عملية شراء أو بيع تكلّف <strong>رسومًا بنسبة 1%</strong>، فالدخول والخروج السريع يكلّفك مرتين.</p>',
        )),
        practice('first-buy'),
        keyIdea(L(
          '<p>Investing puts money to work for <strong>years</strong>: time, not the tap on Buy, does most of the growing.</p>',
          '<p>الاستثمار يُشغّل المال <strong>لسنوات</strong>: الوقت، لا ضغطة الشراء، هو ما يصنع معظم النمو.</p>',
        )),
        exercise('invb-q009'),
        exercise('invb-q010'),
      ],
    }),
  ],
  questions,
}
