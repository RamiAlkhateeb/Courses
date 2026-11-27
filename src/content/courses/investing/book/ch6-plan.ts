// The book, chapter 6: building your investment plan. Longer and more advanced than unit 6's lessons; no characters
// or questions. Example mixes are illustrations, not recommendations or advice.
import type { BookChapter } from '../../../book'
import { L, box, diagram, html, table } from '../../../helpers'

export const ch6: BookChapter = {
  id: 'plan',
  title: L('Building your investment plan', 'بناء خطتك الاستثمارية'),
  summary: L(
    'Putting the book together: goals with dates, an honest measure of risk, a mix for each goal, automatic saving, a rule for rebalancing, and a one-page plan that decides in calm times what to do in stormy ones.',
    'جمع الكتاب كله: أهداف بمواعيد، وقياس صادق للمخاطرة، ومزيج لكل هدف، وادخار تلقائي، وقاعدة لإعادة التوازن، وخطة من صفحة واحدة تقرر في أوقات الهدوء ما يجب فعله في أوقات العاصفة.',
  ),
  blocks: [
    html(L(
      '<h2>6.1 Start from goals, not products</h2><p>A plan begins with what the money is for. Write down each goal, the amount it needs and the year it needs it: an emergency fund topped up within a year, a car in two years, a home deposit in twelve, retirement in thirty. Goals with dates turn vague hopes into numbers you can plan around, and the date is the single most important input, because it decides how much risk each goal can carry.</p><p>Each goal then gets its own pot, at least on paper. Mixing all savings into one pot hides the fact that some of the money is needed next year and some not for decades, and it tempts you to treat long-term money as spendable.</p>',
      '<h2>6.1 ابدأ من الأهداف لا من المنتجات</h2><p>تبدأ الخطة بالغرض من المال. اكتب كل هدف، والمبلغ الذي يحتاجه، والسنة التي يحتاجه فيها: صندوق طوارئ يُستكمل خلال عام، وسيارة بعد سنتين، ودفعة أولى لمنزل بعد اثنتي عشرة سنة، والتقاعد بعد ثلاثين. الأهداف ذات المواعيد تحوّل الآمال الغامضة إلى أرقام يمكنك التخطيط حولها، والموعد هو أهم مدخل على الإطلاق، لأنه يحدد مقدار المخاطرة التي يحتملها كل هدف.</p><p>ثم يحصل كل هدف على وعاء خاص به، على الورق على الأقل. فخلط كل المدخرات في وعاء واحد يخفي أن بعض المال مطلوب العام القادم وبعضه لن يُطلب قبل عقود، ويغري بمعاملة المال طويل الأجل كأنه قابل للإنفاق.</p>',
    )),
    diagram({
      fig: L('Figure 6.1', 'الشكل 6.1'),
      title: L('Goals by date', 'الأهداف حسب الموعد'),
      src: '/diagrams/goal-dates.svg',
      alt: L('Four goals by years until the money is needed: 1, 2, 12 and 30.', 'أربعة أهداف حسب السنوات المتبقية حتى الحاجة إلى المال: 1 و2 و12 و30.'),
      caption: L('Top to bottom: emergency fund, car, home deposit, retirement. Illustrative.', 'من الأعلى إلى الأسفل: صندوق الطوارئ، السيارة، الدفعة الأولى للمنزل، التقاعد. توضيحي.'),
    }),
    html(L(
      '<h2>6.2 Measure risk honestly</h2><p>Chapter 1 separated two sides of risk. <strong>Risk capacity</strong> is how much loss your life could absorb: it depends on the goal\'s date, the stability of your income, your emergency fund and your other resources. <strong>Risk tolerance</strong> is how much loss you could watch without selling: it depends on temperament and experience. Plan with the lower of the two.</p><p>A practical test for tolerance is to picture an amount, not a percentage. Imagine 10,000 falling to 6,700 in a single year, a fall of a third, which broad share markets have done more than once. If you would hold, or even buy more, your tolerance is high. If you would lie awake and sell, your plan needs less in shares, however much growth that gives up. A plan you abandon in a crash is worse than a more modest plan you keep.</p>',
      '<h2>6.2 قِس المخاطرة بصدق</h2><p>فصل الفصل الأول بين جانبين للمخاطرة. <strong>القدرة على تحمّل المخاطر</strong> هي مقدار الخسارة التي تستطيع حياتك استيعابها: وتعتمد على موعد الهدف، واستقرار دخلك، وصندوق طوارئك، ومواردك الأخرى. و<strong>تحمّل المخاطر</strong> هو مقدار الخسارة التي تستطيع مشاهدتها دون أن تبيع: ويعتمد على الطبع والخبرة. خطط بناءً على الأقل بينهما.</p><p>والاختبار العملي للتحمّل هو تخيّل مبلغ لا نسبة. تخيّل 10,000 تهبط إلى 6,700 في عام واحد، أي هبوطًا بالثلث، وهو ما فعلته أسواق الأسهم الواسعة أكثر من مرة. إن كنت ستتمسك بها، أو حتى تشتري المزيد، فتحمّلك مرتفع. وإن كنت ستسهر قلقًا وتبيع، فخطتك تحتاج حصة أقل في الأسهم، مهما ضحت بذلك من نمو. الخطة التي تتخلى عنها في الانهيار أسوأ من خطة أكثر تواضعًا تلتزم بها.</p>',
    )),
    diagram({
      fig: L('Figure 6.2', 'الشكل 6.2'),
      title: L('A fall of a third, in money', 'هبوط بالثلث، بالمال'),
      src: '/diagrams/one-third.svg',
      alt: L('10,000 falling by a third to 6,700 in one year.', '10,000 تهبط بالثلث إلى 6,700 في عام واحد.'),
      caption: L('Picture your own amount. Illustrative figures.', 'تخيّل المبلغ الخاص بك. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>6.3 A mix for each goal</h2><p>With dates and risk in hand, each goal gets a mix of shares, bonds and cash. A common pattern runs from cautious to growth as the date moves away. Money needed within a year or two stays almost all in cash. Money needed in around five years might hold a cautious mix, for example 40% shares, 50% bonds and 10% cash. Money for a goal twenty-five years away might hold around 80% shares, 10% bonds and 10% cash, adjusted down for a lower tolerance.</p><p>These are examples to show the shape of the idea, not recommendations: the right numbers depend on you. What matters is that each pot\'s mix is chosen deliberately, written down, and connected to its date.</p>',
      '<h2>6.3 مزيج لكل هدف</h2><p>حين تتوفر المواعيد والمخاطرة، يحصل كل هدف على مزيج من الأسهم والسندات والنقد. ويمتد نمط شائع من الحذر إلى النمو كلما ابتعد الموعد. فالمال المطلوب خلال عام أو عامين يبقى كله تقريبًا نقدًا. والمال المطلوب بعد نحو خمس سنوات قد يحمل مزيجًا حذرًا، مثل 40% أسهم و50% سندات و10% نقد. أما مال هدف يبعد خمسًا وعشرين سنة فقد يحمل نحو 80% أسهم و10% سندات و10% نقد، مع تخفيضه إذا كان التحمّل أقل.</p><p>هذه أمثلة لتوضيح شكل الفكرة وليست توصيات: فالأرقام المناسبة تعتمد عليك. المهم أن يُختار مزيج كل وعاء عن قصد، ويُكتب، ويرتبط بموعده.</p>',
    )),
    diagram({
      fig: L('Figure 6.3', 'الشكل 6.3'),
      title: L('Example mixes for three goals', 'أمزجة مثال لثلاثة أهداف'),
      src: '/diagrams/plan-mix.svg',
      alt: L('For a goal 1 year away: 100% cash. 5 years away: 40% shares, 50% bonds, 10% cash. 25 years away: 80% shares, 10% bonds, 10% cash.', 'لهدف يبعد عامًا واحدًا: 100% نقد. ولهدف يبعد 5 سنوات: 40% أسهم و50% سندات و10% نقد. ولهدف يبعد 25 سنة: 80% أسهم و10% سندات و10% نقد.'),
      caption: L('Dark: shares. Blue: bonds. Light: cash. Examples only, not recommendations.', 'الداكن: الأسهم. الأزرق: السندات. الفاتح: النقد. أمثلة فقط وليست توصيات.'),
    }),
    box('keypoint', L('Keep the core simple', 'اجعل النواة بسيطة'), L(
      'For most long-term pots, a small number of broad, low-cost funds covering shares at home and abroad, plus bonds, does the job. Extra funds, single shares and alternatives add complexity faster than they add diversification; if you want them, keep them to a small, clearly limited part of the plan.',
      'لمعظم الأوعية طويلة الأجل، يكفي عدد قليل من الصناديق الواسعة منخفضة التكلفة التي تغطي الأسهم محليًا وخارجيًا، إضافة إلى السندات. أما الصناديق الإضافية والأسهم المنفردة والبدائل فتضيف التعقيد أسرع مما تضيف التنويع؛ وإن أردتها فاجعلها جزءًا صغيرًا ومحدودًا بوضوح من الخطة.',
    )),
    html(L(
      '<h2>6.4 Automate it</h2><p>The best plan is one that runs without willpower. Set up an automatic transfer on payday into each pot, investing straight into its chosen mix. Chapter 3 showed that a fixed monthly amount buys more units when prices fall. At prices of 10, 5 and 8, for example, the average price you saw is about 7.67, but the average cost of what you bought is about 7.06, because the low month bought the most.</p><p>Automation also protects the plan from you. It keeps money going in during falls, when instinct says to stop, and it stops idle cash from building up while you wait for the "right moment". Raise the amount when your income rises, ideally on the same day, before the extra money gets absorbed into everyday spending.</p>',
      '<h2>6.4 اجعلها تلقائية</h2><p>أفضل خطة هي التي تعمل دون الحاجة إلى قوة الإرادة. أنشئ تحويلًا تلقائيًا يوم الراتب إلى كل وعاء، يُستثمر مباشرة في المزيج المختار له. بيّن الفصل الثالث أن المبلغ الشهري الثابت يشتري وحدات أكثر حين تنخفض الأسعار. فبأسعار 10 ثم 5 ثم 8 مثلًا، يكون متوسط السعر الذي رأيته نحو 7.67، أما متوسط تكلفة ما اشتريته فنحو 7.06، لأن الشهر المنخفض اشترى أكثر.</p><p>والأتمتة تحمي الخطة منك أيضًا. فهي تبقي المال يدخل خلال الهبوطات، حين تقول الغريزة توقف، وتمنع تراكم النقد العاطل بينما تنتظر «اللحظة المناسبة». ارفع المبلغ حين يرتفع دخلك، ويُفضّل في اليوم نفسه، قبل أن يذوب المال الإضافي في الإنفاق اليومي.</p>',
    )),
    diagram({
      fig: L('Figure 6.4', 'الشكل 6.4'),
      title: L('Average price and average cost', 'متوسط السعر ومتوسط التكلفة'),
      src: '/diagrams/dca-cost.svg',
      alt: L('100 a month at prices 10, 5 and 8: the average price is about 7.67, the average cost per unit about 7.06.', '100 شهريًا بأسعار 10 و5 و8: متوسط السعر نحو 7.67، ومتوسط التكلفة للوحدة نحو 7.06.'),
      caption: L('A fixed amount buys more when prices are low. Illustrative figures.', 'المبلغ الثابت يشتري أكثر حين تكون الأسعار منخفضة. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>6.5 Rebalance by rule</h2><p>Choose your rebalancing rule now, while markets are calm: once a year on a fixed date, or whenever any part of a mix drifts more than five percentage points from its target. After a strong year for shares, a 60/40 pot might drift to 66/34; the rule says sell a little of the shares and buy bonds to return to 60/40, or direct new contributions to bonds until it gets there. After a fall, the same rule makes you buy shares when they are cheap. Following the rule, not the news, is the whole point.</p>',
      '<h2>6.5 أعد التوازن وفق قاعدة</h2><p>اختر قاعدة إعادة التوازن الآن، والأسواق هادئة: مرة في العام في تاريخ ثابت، أو كلما انجرف أي جزء من المزيج عن هدفه بأكثر من خمس نقاط مئوية. فبعد عام قوي للأسهم قد ينجرف وعاء 60/40 إلى 66/34؛ وتقول القاعدة بع قليلًا من الأسهم واشترِ سندات للعودة إلى 60/40، أو وجّه الدفعات الجديدة إلى السندات حتى يصل إليها. وبعد هبوط تجعلك القاعدة نفسها تشتري الأسهم حين تكون رخيصة. اتباع القاعدة لا الأخبار هو جوهر الأمر.</p>',
    )),
    diagram({
      fig: L('Figure 6.5', 'الشكل 6.5'),
      title: L('Drift and rebalancing', 'الانجراف وإعادة التوازن'),
      src: '/diagrams/plan-rebalance.svg',
      alt: L('A 60/40 target drifts to 66/34 after a strong year for shares, and is brought back to 60/40.', 'هدف 60/40 ينجرف إلى 66/34 بعد عام قوي للأسهم، ثم يُعاد إلى 60/40.'),
      caption: L('Dark: shares. Light: bonds. Illustrative figures.', 'الداكن: الأسهم. الفاتح: السندات. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>6.6 Your one-page plan</h2><p>Bring it together on a single page you can reread in a bad week. Writing it down matters: a written plan is a promise from your calm self to your anxious self. A simple template follows.</p>',
      '<h2>6.6 خطتك في صفحة واحدة</h2><p>اجمع كل شيء في صفحة واحدة يمكنك إعادة قراءتها في أسبوع سيئ. الكتابة مهمة: فالخطة المكتوبة وعد من نفسك الهادئة إلى نفسك القلقة. وفي ما يلي نموذج بسيط.</p>',
    )),
    table(
      [L('Part of the plan', 'جزء الخطة'), L('What to write', 'ما تكتبه')],
      [
        [L('Base', 'الأساس'), L('Emergency fund target and where it is kept; high-interest debts and the date they will be cleared', 'هدف صندوق الطوارئ ومكان حفظه؛ والديون ذات الفائدة المرتفعة وموعد سدادها')],
        [L('Goals', 'الأهداف'), L('Each goal, its amount and its year', 'كل هدف ومبلغه وسنته')],
        [L('Risk', 'المخاطرة'), L('The largest one-year fall, in money, you could hold through', 'أكبر هبوط في عام واحد، بالمال، يمكنك التمسك خلاله')],
        [L('Mix per goal', 'المزيج لكل هدف'), L('Shares / bonds / cash for each pot, and the broad funds used', 'أسهم / سندات / نقد لكل وعاء، والصناديق الواسعة المستخدمة')],
        [L('Automation', 'الأتمتة'), L('Amount and day of each monthly transfer; when it will rise', 'مبلغ ويوم كل تحويل شهري؛ ومتى سيرتفع')],
        [L('Costs', 'التكاليف'), L('Total yearly cost as a percentage; the limit you accept', 'التكلفة السنوية الإجمالية كنسبة مئوية؛ والحد الذي تقبله')],
        [L('Rebalancing', 'إعادة التوازن'), L('The date, or the drift that triggers it', 'التاريخ، أو الانجراف الذي يطلقها')],
        [L('In a crash', 'في الانهيار'), L('What you will do (keep investing, rebalance) and what you will not (sell in a panic)', 'ما ستفعله (مواصلة الاستثمار وإعادة التوازن) وما لن تفعله (البيع بذعر)')],
        [L('Review', 'المراجعة'), L('Once a year, and after any big life change', 'مرة في العام، وبعد أي تغير كبير في الحياة')],
      ],
    ),
    html(L(
      '<h2>6.7 When to change the plan</h2><p>A plan should change when your life changes, not when the market does. A new job, a child, a move, an inheritance, a goal reached or abandoned: these are reasons to review the dates, amounts and mixes. A fall in prices, a frightening headline or a friend\'s winning tip are not. When you do review, change one thing at a time, write the change down and note why. Over the years, that record of calm decisions will be worth more than any forecast.</p>',
      '<h2>6.7 متى تغيّر الخطة</h2><p>يجب أن تتغير الخطة حين تتغير حياتك، لا حين يتغير السوق. وظيفة جديدة، أو طفل، أو انتقال، أو ميراث، أو هدف تحقق أو تُرك: هذه أسباب لمراجعة المواعيد والمبالغ والأمزجة. أما هبوط الأسعار أو عنوان مخيف أو نصيحة رابحة من صديق فليست كذلك. وحين تراجع، غيّر شيئًا واحدًا في كل مرة، واكتب التغيير وسببه. ومع السنين سيساوي هذا السجل من القرارات الهادئة أكثر من أي توقع.</p>',
    )),
    html(L(
      '<h2>Chapter summary</h2><ul><li>Start from goals with amounts and dates; give each its own pot.</li><li>Plan with the lower of your risk capacity and your risk tolerance; picture falls in money.</li><li>Choose a deliberate mix for each goal, cautious for near dates and growth-minded for far ones.</li><li>Automate saving on payday, and raise it when income rises.</li><li>Rebalance by a rule chosen in calm times.</li><li>Write a one-page plan, and change it when your life changes, not when the market does.</li></ul>',
      '<h2>خلاصة الفصل</h2><ul><li>ابدأ من أهداف لها مبالغ ومواعيد، وامنح كل منها وعاءه الخاص.</li><li>خطط بناءً على الأقل بين قدرتك على تحمّل المخاطر وتحمّلك لها، وتخيّل الهبوطات بالمال.</li><li>اختر مزيجًا مقصودًا لكل هدف، حذرًا للمواعيد القريبة وموجهًا للنمو للبعيدة.</li><li>اجعل الادخار تلقائيًا يوم الراتب، وارفعه حين يرتفع الدخل.</li><li>أعد التوازن وفق قاعدة تختارها في أوقات الهدوء.</li><li>اكتب خطة من صفحة واحدة، وغيّرها حين تتغير حياتك لا حين يتغير السوق.</li></ul>',
    )),
  ],
}
