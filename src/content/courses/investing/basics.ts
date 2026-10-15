// Original course content. Figures are illustrative examples, not forecasts.
import type { Module } from '../../types'
import { L, box, compoundCalculator, cover, diagram, exercise, formula, html, keyIdea, mcq, objectives, section, table, takeaways } from '../../helpers'

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
      title: L('Saving vs investing', 'الادخار مقابل الاستثمار'),
      standfirst: L(
        'Saving keeps money safe for the near future. Investing puts money to work so it can grow over years — in exchange for accepting ups and downs.',
        'الادخار يحفظ المال بأمان للمستقبل القريب. أما الاستثمار فيُشغّل المال لينمو على مدى سنوات — مقابل قبول الصعود والهبوط.',
      ),
      time: L('4 min', '4 دقائق'),
      blocks: [
        objectives([
          L('Explain why cash loses value over time', 'شرح سبب فقدان النقد لقيمته مع الوقت'),
          L('Calculate compound growth', 'حساب النمو المركب'),
          L('Describe the link between risk, return and time', 'وصف العلاقة بين المخاطرة والعائد والزمن'),
          L('Check whether you are ready to invest', 'التحقق مما إذا كنت جاهزًا للاستثمار'),
        ]),
        html(L(
          '<p>Prices rise over time — that is <strong>inflation</strong>. If your money grows more slowly than prices, it buys less every year even though the number in your account goes up.</p>',
          '<p>ترتفع الأسعار مع الوقت — وهذا هو <strong>التضخم</strong>. إذا نما مالك أبطأ من الأسعار، فإنه يشتري أقل كل عام حتى لو ارتفع الرقم في حسابك.</p>',
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
          'A coffee that costs 2.00 today costs about 4.07 in 24 years at 3% inflation. Keep 2.00 in a drawer and it will buy only about half a coffee then. (Illustrative figures.)',
          'كوب قهوة سعره اليوم 2.00 سيكلّف نحو 4.07 بعد 24 سنة بتضخم 3%. احتفظ بـ2.00 في درج، وعندها لن تشتري إلا نصف كوب تقريبًا. (أرقام توضيحية.)',
        )),
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
      standfirst: L('Each year’s growth is added to the pot, so next year grows on a bigger base.', 'يُضاف نمو كل عام إلى الرصيد، فينمو العام التالي على أساس أكبر.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        formula('FV = PV × (1 + r)ⁿ', L('Future value = present value × (1 + yearly return) to the power of years', 'القيمة المستقبلية = القيمة الحالية × (1 + العائد السنوي) مرفوعة لعدد السنوات')),
        html(L(
          '<p>Leave 1,000 to grow at 7% a year. The dark part of each bar is the money you put in; everything above it is <strong>growth</strong>, and it speeds up.</p>',
          '<p>اترك 1,000 تنمو بعائد 7% سنويًا. الجزء الداكن من كل عمود هو المال الذي وضعته؛ وكل ما فوقه <strong>نمو</strong>، ويتسارع مع الوقت.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('1,000 growing at 7% a year', '1,000 تنمو بعائد 7% سنويًا'),
          src: '/diagrams/compounding.svg',
          alt: L(
            'Bar chart: 1,000 grows to about 1,967 after 10 years, 3,870 after 20 years and 7,612 after 30 years.',
            'رسم بالأعمدة: 1,000 تنمو إلى نحو 1,967 بعد 10 سنوات، و3,870 بعد 20 سنة، و7,612 بعد 30 سنة.',
          ),
          caption: L('Years from now. Dark: the 1,000 you put in. Light: growth. Illustrative figures.', 'السنوات من الآن. الداكن: الـ1,000 التي وضعتها. الفاتح: النمو. أرقام توضيحية.'),
        }),
        html(L(
          '<p>Regular contributions compound too. Investing 200 a month for 30 years at 7% a year adds up to about <strong>244,000</strong> — of which only 72,000 is money you put in. The rest is growth.</p>',
          '<p>المساهمات المنتظمة تتراكم أيضًا. استثمار 200 شهريًا لمدة 30 سنة بعائد 7% سنويًا يصل إلى نحو <strong>244,000</strong> — منها 72,000 فقط من مالك، والباقي نمو.</p>',
        )),
        box('keypoint', L('Rule of 72', 'قاعدة 72'), L(
          'Divide 72 by the yearly return to estimate how many years it takes to double: at 7%, about 10 years; at 3%, about 24 years. It works for inflation too.',
          'اقسم 72 على العائد السنوي لتقدير عدد السنوات اللازمة للتضاعف: بعائد 7% نحو 10 سنوات، وبعائد 3% نحو 24 سنة. وتنطبق على التضخم أيضًا.',
        )),
        compoundCalculator,
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Treating these returns as guaranteed. Real returns vary every year and can be negative; the examples show the mechanism, not a promise.',
          'اعتبار هذه العوائد مضمونة. العوائد الحقيقية تتغير كل عام وقد تكون سالبة؛ الأمثلة توضّح الآلية لا الوعد.',
        )),
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
      standfirst: L('Investments that can grow more can also fall further. There is no high return without risk.', 'الاستثمارات التي يمكن أن تنمو أكثر يمكن أن تهبط أكثر أيضًا. لا عائد مرتفع بلا مخاطرة.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        table(
          [L('Holding', 'الأصل'), L('Expected long-run return', 'العائد المتوقع على المدى الطويل'), L('Short-term swings', 'التقلبات قصيرة الأجل')],
          [
            [L('Cash / savings', 'النقد / التوفير'), L('Low', 'منخفض'), L('Very small', 'ضئيلة جدًا')],
            [L('Bonds', 'السندات'), L('Low to medium', 'منخفض إلى متوسط'), L('Moderate', 'معتدلة')],
            [L('Stocks', 'الأسهم'), L('Higher', 'أعلى'), L('Large — falls of 30% or more happen', 'كبيرة — يحدث هبوط بنسبة 30% أو أكثر')],
          ],
        ),
        html(L(
          '<p>Each bar runs from a bad year to a good year. The bigger the possible <strong>gain</strong>, the bigger the possible <strong>fall</strong>.</p>',
          '<p>يمتد كل عمود من عام سيئ إلى عام جيد. كلما كبر <strong>الربح</strong> الممكن، كبر <strong>الهبوط</strong> الممكن.</p>',
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
          '<p><strong>Time horizon</strong> is how long until you need the money. The longer it is, the more time you have to ride out falls, so you can usually afford more risk. Money you need within a few years should not depend on the stock market.</p>',
          '<p><strong>الأفق الزمني</strong> هو المدة حتى تحتاج المال. كلما طالت، زاد الوقت المتاح لتجاوز الهبوط، فيمكنك عادةً تحمّل مخاطرة أكبر. المال الذي تحتاجه خلال بضع سنوات لا ينبغي أن يعتمد على سوق الأسهم.</p>',
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
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<ol><li><strong>Emergency fund</strong>: a common guideline is 3–6 months of essential expenses in easy-to-reach savings.</li><li><strong>High-interest debt</strong>: paying off a credit card charging 20% is a guaranteed 20% “return” — hard to beat by investing.</li><li><strong>Clear goals</strong>: what is the money for, and when will you need it?</li><li><strong>Risk tolerance</strong>: could you watch your investments fall by a third without selling in panic?</li></ol>',
          '<ol><li><strong>صندوق الطوارئ</strong>: إرشاد شائع هو ادخار مصاريف 3–6 أشهر من النفقات الأساسية في حساب سهل الوصول.</li><li><strong>الديون ذات الفائدة المرتفعة</strong>: سداد بطاقة ائتمان بفائدة 20% يعادل «عائدًا» مضمونًا بنسبة 20% — يصعب التفوق عليه بالاستثمار.</li><li><strong>أهداف واضحة</strong>: لأي غرض هذا المال، ومتى ستحتاجه؟</li><li><strong>تحمّل المخاطر</strong>: هل يمكنك رؤية استثماراتك تهبط بمقدار الثلث دون أن تبيع بذعر؟</li></ol>',
        )),
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
  ],
  questions,
}
