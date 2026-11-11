// Original course content. Describes how asset classes work in general; no products are recommended.
// The story of unit 1 goes on: Noor (نور) has cleared her card and is ready to start; Karim (كريم) shows her what he owns.
import type { Module } from '../../types'
import { L, box, choice, cover, diagram, exercise, html, keyIdea, mcq, myth, practice, predict, section, sort, table, takeaways } from '../../helpers'

const W = 'asset-classes'
const P = 'inva'

const questions = [
  mcq(P, W, 1, 'stocks',
    L('Owning a share of a company gives you…', 'امتلاك سهم في شركة يمنحك…'),
    [L('A small piece of ownership in the company', 'حصة صغيرة من ملكية الشركة'), L('A loan the company must repay', 'قرضًا يجب على الشركة سداده'), L('A guaranteed yearly payment', 'دفعة سنوية مضمونة')], 0,
    L('A share is ownership, not a loan, so nothing is guaranteed: you share in the company’s ups and downs.', 'السهم ملكية لا قرض، فلا شيء مضمون: أنت تشارك الشركة صعودها وهبوطها.')),
  mcq(P, W, 2, 'stocks',
    L('Where does a stock’s return come from?', 'من أين يأتي عائد السهم؟'),
    [L('Price changes plus any dividends', 'تغيّر السعر إضافة إلى أي أرباح موزعة'), L('Only the interest the company pays', 'الفائدة التي تدفعها الشركة فقط'), L('A fixed coupon', 'كوبون ثابت')], 0,
    L('Total return = price change + dividends. Interest and coupons belong to bonds.', 'العائد الكلي = تغيّر السعر + توزيعات الأرباح. الفائدة والكوبونات تخص السندات.')),
  mcq(P, W, 3, 'bonds',
    L('When market interest rates rise, the price of an existing bond usually…', 'عندما ترتفع أسعار الفائدة في السوق، فإن سعر السند القائم عادةً…'),
    [L('Falls', 'ينخفض'), L('Rises', 'يرتفع'), L('Does not change', 'لا يتغير')], 0,
    L('New bonds now pay more, so nobody pays full price for an older bond with a lower coupon; its price drops.', 'السندات الجديدة تدفع الآن أكثر، فلا أحد يدفع السعر الكامل لسند قديم بكوبون أقل؛ فينخفض سعره.')),
  mcq(P, W, 4, 'bonds',
    L('What is credit risk for a bond?', 'ما مخاطر الائتمان في السند؟'),
    [L('The risk that the borrower cannot pay interest or repay the loan', 'خطر عجز المقترض عن دفع الفائدة أو سداد القرض'), L('The risk that prices rise', 'خطر ارتفاع الأسعار'), L('The risk of forgetting your password', 'خطر نسيان كلمة المرور')], 0,
    L('Credit risk is about the borrower: it might not pay the interest or return the money. Riskier borrowers pay more interest.', 'مخاطر الائتمان تتعلق بالمقترض: قد لا يدفع الفائدة أو يعيد المال. المقترضون الأعلى مخاطرة يدفعون فائدة أعلى.')),
  mcq(P, W, 5, 'funds',
    L('What does an index fund do?', 'ماذا يفعل صندوق المؤشر؟'),
    [L('Holds all (or a sample of) the securities in an index to match its return', 'يمتلك جميع الأوراق المالية في مؤشر ما (أو عينة منها) ليطابق عائده'), L('Picks a few stocks it expects to beat the market', 'يختار بضعة أسهم يتوقع أن تتفوق على السوق'), L('Guarantees it will not lose money', 'يضمن عدم خسارة المال')], 0,
    L('An index fund does not pick winners; it holds the whole index (or a sample) and follows it, up or down.', 'صندوق المؤشر لا ينتقي الرابحين؛ بل يمتلك المؤشر كله (أو عينة منه) ويتبعه صعودًا وهبوطًا.')),
  mcq(P, W, 6, 'alternatives',
    L('Which statement about cryptocurrency fits this course’s view?', 'أي عبارة عن العملات المشفرة تتوافق مع رؤية هذه الدورة؟'),
    [L('It is highly volatile and speculative; only risk money you can afford to lose', 'شديدة التقلب ومضاربية؛ لا تخاطر إلا بمال يمكنك تحمّل خسارته'), L('It is a safe replacement for savings', 'بديل آمن للمدخرات'), L('Its returns are guaranteed by governments', 'عوائدها مضمونة من الحكومات')], 0,
    L('Crypto prices can halve in months, and it pays no income, so it is speculation, not a safe place for savings.', 'أسعار العملات المشفرة قد تنخفض للنصف خلال أشهر، ولا تدر دخلًا، فهي مضاربة لا مكان آمن للمدخرات.')),
  mcq(P, W, 7, 'overview',
    L('What is an asset class?', 'ما فئة الأصول؟'),
    [L('A group of investments that behave in similar ways', 'مجموعة من الاستثمارات التي تتصرف بطرق متشابهة'), L('A course you must pass before investing', 'دورة يجب اجتيازها قبل الاستثمار'), L('The shares of one company', 'أسهم شركة واحدة')], 0,
    L('Stocks, bonds and cash are asset classes: each group behaves in its own way, with its own mix of growth, income and risk.', 'الأسهم والسندات والنقد فئات أصول: كل مجموعة تتصرف بطريقتها، ولها مزيجها من النمو والدخل والمخاطرة.')),
  mcq(P, W, 8, 'overview',
    L('Why do most portfolios mix a few asset classes?', 'لماذا تمزج معظم المحافظ بين عدد من فئات الأصول؟'),
    [L('They behave differently, so they rarely all fall at once', 'لأنها تتصرف بشكل مختلف، فنادرًا ما تهبط كلها معًا'), L('Mixing guarantees a profit', 'لأن المزج يضمن الربح'), L('The law requires exactly three', 'لأن القانون يشترط ثلاثًا بالضبط')], 0,
    L('When one class has a bad year, another may hold up. Mixing smooths the ride, but it guarantees nothing.', 'عندما تمر فئة بعام سيئ، قد تصمد أخرى. المزج يخفف التقلب، لكنه لا يضمن شيئًا.')),
  mcq(P, W, 9, 'cash',
    L('Which money fits best in cash?', 'أي مال يناسبه النقد أكثر؟'),
    [L('Next month’s rent', 'إيجار الشهر القادم'), L('Retirement savings for 30 years from now', 'مدخرات التقاعد بعد 30 سنة'), L('Money you want to grow over decades', 'مال تريده أن ينمو على مدى عقود')], 0,
    L('Cash barely moves in value, so it is ready the day you need it. Long-term money can afford to aim for growth.', 'قيمة النقد بالكاد تتحرك، فهو جاهز يوم تحتاجه. أما المال طويل الأجل فيمكنه السعي إلى النمو.')),
  mcq(P, W, 10, 'cash',
    L('Over many years, what is the main weakness of cash?', 'على مدى سنوات طويلة، ما نقطة الضعف الرئيسية في النقد؟'),
    [L('It often barely keeps up with inflation', 'كثيرًا ما بالكاد يواكب التضخم'), L('Its value swings wildly', 'قيمته تتقلب بشدة'), L('It is hard to take out', 'يصعب سحبه')], 0,
    L('Cash is stable and easy to reach, but its low interest can lag behind rising prices, so it loses buying power over time.', 'النقد مستقر وسهل الوصول، لكن فائدته المنخفضة قد تتأخر عن ارتفاع الأسعار، فيفقد قوته الشرائية مع الوقت.')),
  mcq(P, W, 11, 'funds',
    L('What is a fund’s expense ratio?', 'ما نسبة المصاريف في الصندوق؟'),
    [L('The yearly fee the fund takes from your money', 'الرسوم السنوية التي يأخذها الصندوق من مالك'), L('The share of stocks in the fund', 'حصة الأسهم في الصندوق'), L('A tax you pay when you buy', 'ضريبة تدفعها عند الشراء')], 0,
    L('It is a yearly percentage taken automatically from your money, every year, whether the fund gains or loses.', 'إنها نسبة سنوية تُقتطع تلقائيًا من مالك كل عام، سواء ربح الصندوق أو خسر.')),
  mcq(P, W, 12, 'alternatives',
    L('Why is property a poor place for an emergency fund?', 'لماذا العقار مكان غير مناسب لصندوق الطوارئ؟'),
    [L('It can take months to sell', 'قد يستغرق بيعه أشهرًا'), L('Its price never changes', 'سعره لا يتغير أبدًا'), L('It never pays rent', 'لا يدر إيجارًا أبدًا')], 0,
    L('An emergency needs money within days. Selling a property takes time and costs a lot.', 'الطوارئ تحتاج المال خلال أيام. أما بيع العقار فيستغرق وقتًا ويكلّف كثيرًا.')),
  mcq(P, W, 13, 'overview',
    L('Which of these holds three different kinds of investment?', 'أيٌّ مما يلي يضم ثلاثة أنواع مختلفة من الاستثمار؟'),
    [L('Safe Savings, Government Bonds and Gold', 'الادخار الآمن والسندات الحكومية والذهب'), L('A World Stocks ETF, a US 500 Index ETF and a Tech Stocks ETF', 'صندوق الأسهم العالمية وصندوق مؤشر أكبر 500 شركة أمريكية وصندوق أسهم التقنية'), L('Three different tech company shares', 'أسهم ثلاث شركات تقنية مختلفة')], 0,
    L('Cash, lending and gold are three kinds. Three stock funds, or three tech shares, are still one kind: stocks, which tend to fall together.', 'النقد والإقراض والذهب ثلاثة أنواع. أما ثلاثة صناديق أسهم أو ثلاثة أسهم تقنية فهي نوع واحد: الأسهم، التي تميل إلى الهبوط معًا.')),
  mcq(P, W, 14, 'overview',
    L('In the same simulated year, why can Safe Savings, bonds and a stock fund end up with very different results?', 'في السنة المحاكاة نفسها، لماذا قد تنتهي نتائج الادخار الآمن والسندات وصندوق الأسهم مختلفة جدًا؟'),
    [L('They are different kinds of asset, driven by different things', 'لأنها أنواع مختلفة من الأصول، تحرّكها عوامل مختلفة'), L('The simulator picks a winner at random', 'لأن المحاكي يختار رابحًا عشوائيًا'), L('Only the amount you bought decides the result', 'لأن المبلغ الذي اشتريته وحده يحدد النتيجة')], 0,
    L('Savings pay interest, bond prices move with interest rates, and stocks follow company profits, so the same news can push them in different directions.', 'الادخار يدفع فائدة، وأسعار السندات تتحرك مع أسعار الفائدة، والأسهم تتبع أرباح الشركات، فقد يدفعها الخبر نفسه في اتجاهات مختلفة.')),
]

export const assetClasses: Module = {
  id: W,
  courseId: 'investing',
  order: 2,
  cover: cover(L('Foundations · Module 2', 'الأساسيات · الوحدة 2'), L('Asset classes', 'فئات الأصول'), L('≈ 25 min', '≈ 25 دقيقة')),
  sections: [
    section({
      id: 'overview',
      lessons: ['overview'],
      label: L('Intro', 'مقدمة'),
      nav: L('Overview', 'نظرة عامة'),
      title: L('What can you invest in?', 'في ماذا يمكنك أن تستثمر؟'),
      standfirst: L('Owning, lending, keeping: three ways money can work.', 'التملّك والإقراض والحفظ: ثلاث طرق ليعمل المال.'),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Noor’s card is paid off and she is ready. “So what do you actually own?” she asks Karim. He opens his app: part of a bakery chain, a loan to the government, some cash. Almost everything you can invest in is one of two things: <strong>owning</strong> something, or <strong>lending</strong> money to someone.</p>',
          '<p>سدّدت نور بطاقتها وصارت جاهزة. تسأل كريم: «ماذا تملك فعلًا؟». يفتح تطبيقه: جزء من سلسلة مخابز، وقرض للحكومة، وبعض النقد. كل ما يمكنك الاستثمار فيه تقريبًا واحد من أمرين: <strong>تملّك</strong> شيء، أو <strong>إقراض</strong> المال لأحد.</p>',
        )),
        sort(
          L('Owning or lending? Sort what Karim holds.', 'تملّك أم إقراض؟ صنّف ما يملكه كريم.'),
          [L('Owning', 'تملّك'), L('Lending', 'إقراض')],
          [
            [L('Shares of a bakery chain', 'أسهم في سلسلة مخابز'), 0],
            [L('A government bond', 'سند حكومي'), 1],
            [L('A fund holding hundreds of companies', 'صندوق يضم مئات الشركات'), 0],
            [L('Money in a savings account', 'مال في حساب توفير'), 1],
          ],
          L(
            'Shares and stock funds are ownership. Bonds and even a savings account are loans: the government, or the bank, pays you interest to use your money.',
            'الأسهم وصناديق الأسهم ملكية. والسندات، وحتى حساب التوفير، قروض: الحكومة أو البنك يدفع لك فائدة مقابل استخدام مالك.',
          ),
        ),
        html(L(
          '<p>Investments that behave alike form an <strong>asset class</strong>: <strong>stocks</strong> (owning part of a business), <strong>bonds</strong> (lending), <strong>cash</strong> (keeping money safe and close) and alternatives such as property or gold. In the same year they can do very different things.</p>',
          '<p>الاستثمارات التي تتصرف بشكل متشابه تشكّل <strong>فئة أصول</strong>: <strong>الأسهم</strong> (امتلاك جزء من شركة)، و<strong>السندات</strong> (الإقراض)، و<strong>النقد</strong> (حفظ المال آمنًا وقريبًا)، والبدائل مثل العقار أو الذهب. وفي العام نفسه قد تفعل أشياء مختلفة جدًا.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('One year, three asset classes', 'عام واحد وثلاث فئات أصول'),
          src: '/diagrams/asset-year.svg',
          alt: L('Bar chart for one year: cash +2%, bonds −3%, stocks +18%.', 'رسم بالأعمدة لعام واحد: النقد +2%، السندات −3%، الأسهم +18%.'),
          caption: L('Left to right: cash, bonds, stocks, in one example year. Illustrative figures.', 'من اليسار إلى اليمين: النقد، السندات، الأسهم، في عام مثالي واحد. أرقام توضيحية.'),
        }),
        keyIdea(L(
          '<p>Each asset class does a different job: <strong>growth</strong>, <strong>income</strong> or <strong>safety</strong>.</p>',
          '<p>كل فئة أصول تؤدي مهمة مختلفة: <strong>النمو</strong> أو <strong>الدخل</strong> أو <strong>الأمان</strong>.</p>',
        )),
        exercise('inva-q007'),
        exercise('inva-q008'),
      ],
    }),
    section({
      id: 'stocks',
      lessons: ['stocks'],
      label: L('Part 1', 'الجزء ١'),
      nav: L('Stocks', 'الأسهم'),
      title: L('Stocks: owning part of a business', 'الأسهم: امتلاك جزء من شركة'),
      standfirst: L('Karim owns a tiny slice of a bakery chain. Here is how that pays.', 'كريم يملك شريحة صغيرة من سلسلة مخابز. إليك كيف يربح منها.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Karim bought one <strong>share</strong> of a bakery chain for 50. A year later the share is worth 54. The bakery also had a good year and paid each shareholder 1 from its profits. Before you read on, work out what Karim earned.</p>',
          '<p>اشترى كريم <strong>سهمًا</strong> واحدًا في سلسلة مخابز بـ50. بعد عام صار السهم يساوي 54. وحققت المخابز عامًا جيدًا فدفعت لكل مساهم 1 من أرباحها. قبل أن تكمل، احسب كم ربح كريم.</p>',
        )),
        predict(
          L('What was Karim’s total return for the year?', 'كم كان عائد كريم الكلي في العام؟'),
          [L('2%', '2%'), L('8%', '8%'), L('10%', '10%'), L('54%', '54%')],
          2,
          L(
            '10%. The price rose by 4 and the payout added 1: 5 on 50. Most people forget the payout, or count the whole 54. (Illustrative figures.)',
            '10%. ارتفع السعر 4 وأضافت التوزيعات 1: أي 5 من 50. معظم الناس ينسون التوزيعات، أو يحسبون الـ54 كلها. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>A share is a small slice of a company. When profits grow, the slice tends to be worth more. Some companies also hand part of their profits to shareholders as <strong>dividends</strong>. Add the two and you get the <strong>total return</strong>: price change plus dividends.</p>',
          '<p>السهم شريحة صغيرة من شركة. عندما تنمو الأرباح، تميل قيمة الشريحة إلى الارتفاع. وتعطي بعض الشركات جزءًا من أرباحها للمساهمين على شكل <strong>توزيعات أرباح</strong>. اجمع الاثنين تحصل على <strong>العائد الكلي</strong>: تغيّر السعر مع التوزيعات.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('One share, one year', 'سهم واحد، عام واحد'),
          src: '/diagrams/stock-return.svg',
          alt: L('Two bars: the share at 50 when bought, then 54 a year later plus a dividend of 1, a 10% total return.', 'عمودان: السهم بـ50 عند الشراء، ثم 54 بعد عام مع توزيعات قدرها 1، أي عائد كلي 10%.'),
          caption: L('Years from purchase. Dark: the 50 paid. Blue: the price rise. Light: the dividend. Illustrative figures.', 'السنوات منذ الشراء. الداكن: الـ50 المدفوعة. الأزرق: ارتفاع السعر. الفاتح: التوزيعات. أرقام توضيحية.'),
        }),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Putting everything into one company you love. Bakeries close, and a single company can go to zero. A broad mix of hundreds of companies very rarely does.',
          'وضع كل شيء في شركة واحدة تحبها. المخابز تُغلق، وقد تصل شركة واحدة إلى الصفر. أما مزيج واسع من مئات الشركات فنادرًا جدًا ما يحدث له ذلك.',
        )),
        keyIdea(L(
          '<p>A share is a <strong>slice of a business</strong>: it tends to rise when profits grow, and it can fall to zero if the business fails.</p>',
          '<p>السهم <strong>شريحة من شركة</strong>: يميل إلى الارتفاع عندما تنمو الأرباح، وقد يهبط إلى الصفر إذا فشلت الشركة.</p>',
        )),
        exercise('inva-q001'),
        exercise('inva-q002'),
      ],
    }),
    section({
      id: 'bonds',
      lessons: ['bonds'],
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Bonds', 'السندات'),
      title: L('Bonds: lending your money', 'السندات: إقراض مالك'),
      standfirst: L('Noor prefers lending. Lending has a twist.', 'نور تفضّل الإقراض. وللإقراض مفاجأة.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Noor likes steady things, so she buys a <strong>bond</strong>: a 10-year loan to the government for 100, paying 3% a year. A year later, new government bonds pay <strong>5%</strong>. Noor wonders what someone would pay her for her old 3% bond.</p>',
          '<p>نور تحب الأشياء المستقرة، فاشترت <strong>سندًا</strong>: قرضًا للحكومة مدته 10 سنوات بـ100، يدفع 3% سنويًا. بعد عام صارت السندات الحكومية الجديدة تدفع <strong>5%</strong>. تتساءل نور كم سيدفع لها أحد مقابل سندها القديم ذي الـ3%.</p>',
        )),
        predict(
          L('Roughly what would a buyer pay for Noor’s 3% bond now?', 'كم سيدفع المشتري تقريبًا الآن مقابل سند نور ذي الـ3%؟'),
          [L('About 115', 'نحو 115'), L('Still 100', '100 كما هو'), L('About 85', 'نحو 85'), L('About 50', 'نحو 50')],
          2,
          L(
            'About 85. Why pay 100 for 3% a year when a new bond pays 5%? The old bond’s price falls until it is as good a deal as a new one. (Illustrative figures.)',
            'نحو 85. لماذا يدفع أحد 100 مقابل 3% سنويًا والسند الجديد يدفع 5%؟ ينخفض سعر السند القديم حتى يصبح صفقة جيدة كالجديد. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>A bond is a loan to a government or a company. The borrower pays regular interest, the <strong>coupon</strong>, and returns the original amount at <strong>maturity</strong>. Held to the end, Noor still gets her 100 back. Sold early, she gets today’s price.</p>',
          '<p>السند قرض لحكومة أو شركة. يدفع المقترض فائدة منتظمة هي <strong>الكوبون</strong>، ويعيد المبلغ الأصلي عند <strong>الاستحقاق</strong>. إن احتفظت نور به حتى النهاية تسترد الـ100. وإن باعته مبكرًا تحصل على سعر اليوم.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('When rates rise, old bonds fall', 'عندما ترتفع الفائدة، تنخفض السندات القديمة'),
          src: '/diagrams/bond-price.svg',
          alt: L('Two bars: a 3% bond priced 100, then about 85 once new bonds pay 5%.', 'عمودان: سند بـ3% سعره 100، ثم نحو 85 بعدما صارت السندات الجديدة تدفع 5%.'),
          caption: L('A 3% bond with 10 years left, before and after new bonds pay 5%. Illustrative figures.', 'سند بـ3% بقي على استحقاقه 10 سنوات، قبل أن تدفع السندات الجديدة 5% وبعده. أرقام توضيحية.'),
        }),
        table(
          [L('Risk', 'المخاطرة'), L('What it means', 'معناها')],
          [
            [L('Interest-rate risk', 'مخاطر سعر الفائدة'), L('When rates rise, older bonds fall in price, as Noor’s did. Longer bonds are hit harder.', 'عندما ترتفع الفائدة تنخفض أسعار السندات القديمة، كما حدث لسند نور. السندات الأطول أجلًا تتأثر أكثر.')],
            [L('Credit risk', 'مخاطر الائتمان'), L('The borrower may fail to pay. Riskier borrowers must offer higher interest.', 'قد يعجز المقترض عن السداد. على المقترضين الأعلى مخاطرة تقديم فائدة أعلى.')],
            [L('Inflation risk', 'مخاطر التضخم'), L('Fixed payments buy less if prices rise faster than expected.', 'الدفعات الثابتة تشتري أقل إذا ارتفعت الأسعار أسرع من المتوقع.')],
          ],
        ),
        keyIdea(L(
          '<p>A bond is a <strong>loan</strong>: steady interest, but its price falls when interest rates rise or the borrower struggles.</p>',
          '<p>السند <strong>قرض</strong>: فائدة منتظمة، لكن سعره ينخفض عندما ترتفع الفائدة أو يتعثر المقترض.</p>',
        )),
        exercise('inva-q003'),
        exercise('inva-q004'),
      ],
    }),
    section({
      id: 'cash',
      lessons: ['cash'],
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Cash', 'النقد'),
      title: L('Cash and cash equivalents', 'النقد وما يعادله'),
      standfirst: L('The safest place for money, and the one that slowly shrinks.', 'أكثر الأماكن أمانًا للمال، والمكان الذي ينكمش فيه ببطء.'),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Noor still keeps her emergency fund in a savings account paying 1% a year. Karim teases her that it is “doing nothing”. She points out that it has never lost a single cent. Which of them is right? Decide before you read on.</p>',
          '<p>ما زالت نور تحتفظ بصندوق طوارئها في حساب توفير يدفع 1% سنويًا. يمازحها كريم بأنه «لا يفعل شيئًا». فترد بأنه لم يخسر قرشًا واحدًا قط. أيهما على حق؟ قرّر قبل أن تكمل.</p>',
        )),
        myth(
          L('Money in a savings account can’t lose value.', 'المال في حساب التوفير لا يمكن أن يفقد قيمته.'),
          false,
          L(
            'The number never drops, but its buying power can. At 1% interest and 3% inflation, the same balance buys a little less every year.',
            'الرقم لا ينخفض أبدًا، لكن قوته الشرائية قد تنخفض. بفائدة 1% وتضخم 3%، يشتري الرصيد نفسه أقل قليلًا كل عام.',
          ),
        ),
        html(L(
          '<p><strong>Cash</strong> means savings accounts, term deposits, money-market funds and short-term government bills. Its value barely moves, so it is ready the day you need it. Over many years, though, its low interest often trails rising prices.</p>',
          '<p><strong>النقد</strong> يعني حسابات التوفير والودائع لأجل وصناديق سوق النقد وأذون الخزانة قصيرة الأجل. قيمته بالكاد تتحرك، فهو جاهز يوم تحتاجه. لكن على مدى سنوات طويلة كثيرًا ما تتأخر فائدته المنخفضة عن ارتفاع الأسعار.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('1,000 in savings against rising prices', '1,000 في التوفير مقابل ارتفاع الأسعار'),
          src: '/diagrams/cash-vs-prices.svg',
          alt: L('Three bars: 1,000 today; 1,105 after 10 years at 1% interest; 1,344, what the same things cost after 10 years at 3% inflation.', 'ثلاثة أعمدة: 1,000 اليوم؛ و1,105 بعد 10 سنوات بفائدة 1%؛ و1,344، ثمن الأشياء نفسها بعد 10 سنوات بتضخم 3%.'),
          caption: L('Years from now. Blue: the savings. Outline: what the same shopping costs. Illustrative figures.', 'السنوات من الآن. الأزرق: المدخرات. المحدَّد: ثمن المشتريات نفسها. أرقام توضيحية.'),
        }),
        box('example', L('Example', 'مثال'), L(
          'Both are right. Next month’s rent, a car-repair fund and Noor’s emergency fund belong in cash, where their value won’t drop the week she needs them. Money for 20 years from now needs to grow.',
          'كلاهما على حق. إيجار الشهر القادم وصندوق إصلاح السيارة وصندوق طوارئ نور مكانها النقد، حيث لن تنخفض قيمتها في الأسبوع الذي تحتاجها فيه. أما المال المخصص لما بعد 20 سنة فيحتاج إلى النمو.',
        )),
        keyIdea(L(
          '<p>Cash is for <strong>safety and soon</strong>, not for long-term growth.</p>',
          '<p>النقد <strong>للأمان وللقريب</strong>، لا للنمو طويل الأجل.</p>',
        )),
        exercise('inva-q009'),
        exercise('inva-q010'),
      ],
    }),
    section({
      id: 'funds',
      lessons: ['funds'],
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Funds and ETFs', 'الصناديق وصناديق المؤشرات المتداولة'),
      title: L('Funds: buying many investments at once', 'الصناديق: شراء استثمارات كثيرة دفعة واحدة'),
      standfirst: L('One purchase, hundreds of companies.', 'شراء واحد، ومئات الشركات.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Karim has 500 more to put into stocks. He has three ideas: more of the bakery chain he knows, a fund whose manager picks companies to try to beat the market, or an <strong>index fund</strong> that simply holds every large company in the market.</p>',
          '<p>لدى كريم 500 إضافية يريد وضعها في الأسهم. لديه ثلاث أفكار: المزيد من سلسلة المخابز التي يعرفها، أو صندوق يختار مديره الشركات محاولًا التفوق على السوق، أو <strong>صندوق مؤشر</strong> يمتلك ببساطة كل الشركات الكبيرة في السوق.</p>',
        )),
        choice(L('Where would you put Karim’s 500?', 'أين كنت ستضع الـ500 التي لدى كريم؟'), [
          [
            L('More of the bakery chain', 'المزيد من سلسلة المخابز'),
            L('All his stock money then rides on one business. If the bakery struggles, there is nothing else to soften the fall.', 'عندها يعتمد كل مال أسهمه على شركة واحدة. إذا تعثرت المخابز، فلا شيء آخر يخفف الهبوط.'),
          ],
          [
            L('A fund with a manager picking stocks', 'صندوق يختار مديره الأسهم'),
            L('He gets many companies and a professional’s choices, but pays a higher yearly fee, and most such funds do not beat the market over the long run.', 'يحصل على شركات كثيرة واختيارات محترف، لكنه يدفع رسومًا سنوية أعلى، ومعظم هذه الصناديق لا تتفوق على السوق على المدى الطويل.'),
          ],
          [
            L('An index fund of the whole market', 'صندوق مؤشر للسوق كله'),
            L('He owns a slice of hundreds of companies, usually for a low fee. He gets the market’s return, never more, and falls with it in a bad year.', 'يملك شريحة من مئات الشركات، عادةً برسوم منخفضة. يحصل على عائد السوق، لا أكثر، ويهبط معه في العام السيئ.'),
          ],
        ]),
        html(L(
          '<p>A <strong>fund</strong> pools many people’s money to buy many investments at once, like a fruit basket instead of single pieces of fruit. If one company in a fund of a hundred fails, you lose one slice, not everything.</p>',
          '<p><strong>الصندوق</strong> يجمع أموال كثير من الناس ليشتري استثمارات كثيرة دفعة واحدة، كسلة فواكه بدل حبات منفردة. إذا فشلت شركة واحدة في صندوق من مئة شركة، تخسر شريحة واحدة، لا كل شيء.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('When one company fails', 'عندما تفشل شركة واحدة'),
          src: '/diagrams/one-vs-many.svg',
          alt: L('Two bars: 1,000 in one company that fails is worth 0; 1,000 spread over 100 companies, one of which fails, is worth 990.', 'عمودان: 1,000 في شركة واحدة تفشل تصبح 0؛ و1,000 موزعة على 100 شركة تفشل إحداها تصبح 990.'),
          caption: L('Number of companies held: 1 or 100. Illustrative figures.', 'عدد الشركات المملوكة: 1 أو 100. أرقام توضيحية.'),
        }),
        table(
          [L('Type', 'النوع'), L('How it works', 'كيف يعمل')],
          [
            [L('Mutual fund', 'صندوق استثمار مشترك'), L('Pools investors’ money; priced once a day.', 'يجمع أموال المستثمرين؛ يُسعَّر مرة يوميًا.')],
            [L('ETF (exchange-traded fund)', 'صندوق مؤشرات متداول (ETF)'), L('A fund that trades on a stock exchange like a share, throughout the day.', 'صندوق يُتداول في البورصة كالسهم طوال اليوم.')],
            [L('Index fund', 'صندوق مؤشر'), L('Follows an index instead of picking stocks. Can be a mutual fund or an ETF.', 'يتبع مؤشرًا بدل انتقاء الأسهم. قد يكون صندوقًا مشتركًا أو صندوقًا متداولًا.')],
            [L('Active fund', 'صندوق مُدار بنشاط'), L('A manager picks investments to try to beat the market; usually higher fees.', 'يختار مدير الاستثمارات محاولًا التفوق على السوق؛ وعادةً برسوم أعلى.')],
          ],
        ),
        box('keypoint', L('Check the cost', 'تحقّق من التكلفة'), L(
          'Every fund charges a yearly fee, the <strong>expense ratio</strong>, taken from your money automatically. The next module shows how much a small difference adds up to.',
          'كل صندوق يفرض رسومًا سنوية تسمى <strong>نسبة المصاريف</strong>، تُقتطع من مالك تلقائيًا. توضح الوحدة التالية كم يتراكم فرق صغير منها.',
        )),
        keyIdea(L(
          '<p>A fund buys <strong>many investments at once</strong>; an index fund simply follows the market, usually for a low fee.</p>',
          '<p>الصندوق يشتري <strong>استثمارات كثيرة دفعة واحدة</strong>؛ وصندوق المؤشر يتبع السوق ببساطة، عادةً برسوم منخفضة.</p>',
        )),
        exercise('inva-q005'),
        exercise('inva-q011'),
      ],
    }),
    section({
      id: 'alternatives',
      lessons: ['alternatives'],
      label: L('Part 5', 'الجزء ٥'),
      nav: L('Real estate, gold, crypto', 'العقار والذهب والعملات المشفرة'),
      title: L('Alternatives', 'البدائل'),
      standfirst: L('Gold, property and crypto: each comes with a catch.', 'الذهب والعقار والعملات المشفرة: لكلٍّ منها عيب.'),
      time: L('4 min', '4 دقائق'),
      blocks: [
        html(L(
          '<p>At a family dinner, Noor’s aunt says the only safe investment is <strong>gold</strong>: “It never loses value.” Her cousin swears by property, and a friend of Karim’s has put his savings into a crypto coin. Everyone at the table is sure. Is the aunt right?</p>',
          '<p>على عشاء عائلي، تقول خالة نور إن الاستثمار الآمن الوحيد هو <strong>الذهب</strong>: «لا يفقد قيمته أبدًا». ويقسم ابن خالتها بالعقار، أما صديق لكريم فوضع مدخراته في عملة مشفرة. الجميع على المائدة واثقون. هل الخالة على حق؟</p>',
        )),
        myth(
          L('Gold never loses value.', 'الذهب لا يفقد قيمته أبدًا.'),
          false,
          L(
            'Gold has fallen by a quarter or more in some years, and it pays no income while you wait. Some people hold a little as a hedge, not as a sure thing.',
            'هبط الذهب بالربع أو أكثر في بعض السنوات، ولا يدر أي دخل أثناء الانتظار. يحتفظ بعض الناس بقليل منه للتحوط، لا كأمر مضمون.',
          ),
        ),
        html(L(
          '<p>Every alternative has a catch. Property pays rent but takes big sums and months to sell. Gold pays nothing and swings with fear. Crypto can halve in months and pays nothing either. The chart shows how far each has fallen in a bad year.</p>',
          '<p>لكل بديل عيب. العقار يدر إيجارًا لكنه يحتاج مبالغ كبيرة وأشهرًا لبيعه. الذهب لا يدر شيئًا ويتقلب مع الخوف. والعملات المشفرة قد تنخفض للنصف خلال أشهر ولا تدر شيئًا أيضًا. يوضح الرسم مدى هبوط كل منها في عام سيئ.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('A bad year for each alternative', 'عام سيئ لكل بديل'),
          src: '/diagrams/alt-falls.svg',
          alt: L('Falls in a bad year: property −20%, gold −28%, crypto −75%.', 'الهبوط في عام سيئ: العقار −20%، الذهب −28%، العملات المشفرة −75%.'),
          caption: L('Left to right: property, gold, crypto. Illustrative figures, not forecasts.', 'من اليسار إلى اليمين: العقار، الذهب، العملات المشفرة. أرقام توضيحية لا توقعات.'),
        }),
        table(
          [L('Asset', 'الأصل'), L('Points to weigh', 'نقاط للموازنة')],
          [
            [L('Property', 'العقار'), L('Rent and long-term growth, but large sums, high costs, debt and slow to sell. Property funds (REITs) trade like shares.', 'إيجار ونمو طويل الأجل، لكنه يتطلب مبالغ كبيرة وتكاليف مرتفعة وديونًا، وبيعه بطيء. صناديق العقار (REITs) تُتداول كالأسهم.')],
            [L('Gold', 'الذهب'), L('No income; moves with fear and currencies. Some hold a little as a hedge.', 'لا دخل؛ يتحرك مع الخوف والعملات. يحتفظ البعض بقليل منه للتحوط.')],
            [L('Cryptocurrency', 'العملات المشفرة'), L('Extremely volatile, no income, exposed to hacks and fraud. Speculation.', 'شديدة التقلب، لا دخل، ومعرضة للاختراق والاحتيال. مضاربة.')],
          ],
        ),
        keyIdea(L(
          '<p>Property, gold and crypto each have a catch: <strong>hard to sell</strong>, <strong>no income</strong> or <strong>wild swings</strong>. Know which one you are taking on.</p>',
          '<p>لكل من العقار والذهب والعملات المشفرة عيب: <strong>صعوبة البيع</strong> أو <strong>غياب الدخل</strong> أو <strong>التقلبات الشديدة</strong>. اعرف أيها تتحمل.</p>',
        )),
        exercise('inva-q006'),
        exercise('inva-q012'),
        takeaways([
          L('Stocks: ownership — higher growth, bigger swings', 'الأسهم: ملكية — نمو أعلى وتقلبات أكبر'),
          L('Bonds: lending — income, hurt by rising rates and defaults', 'السندات: إقراض — دخل، وتتضرر من ارتفاع الفائدة والتعثر'),
          L('Cash: stability for short-term needs', 'النقد: استقرار للاحتياجات قصيرة الأجل'),
          L('Funds bundle many holdings; always check the fee', 'الصناديق تجمع أصولًا كثيرة؛ تحقّق دائمًا من الرسوم'),
        ]),
      ],
    }),
    section({
      id: 'practice-spread',
      lessons: ['practice-spread'],
      label: L('Practice', 'تدريب'),
      nav: L('Hold three kinds', 'امتلك ثلاثة أنواع'),
      title: L('Practice: hold three kinds at once', 'تدريب: امتلك ثلاثة أنواع معًا'),
      standfirst: L(
        'Noor holds cash, a bond and a stock fund. Build a mix like hers and watch each part move.',
        'نور تملك نقدًا وسندًا وصندوق أسهم. ابنِ مزيجًا مثله وشاهد كل جزء يتحرك.',
      ),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Put the asset classes side by side. With <strong>play money</strong> and made-up prices (practice, not advice), hold <strong>three different investments</strong> at once, for example Safe Savings, Government Bonds and a stock fund. Tap each one, choose an amount and buy. Then watch cash, lending and ownership each move in their own way.</p>',
          '<p>ضع فئات الأصول جنبًا إلى جنب. بـ<strong>مال افتراضي</strong> وأسعار مُختلَقة (للتدريب، لا نصيحة)، امتلك <strong>ثلاثة استثمارات مختلفة</strong> معًا، مثل الادخار الآمن والسندات الحكومية وصندوق أسهم. اضغط على كل منها، وحدّد مبلغًا، واشترِ. ثم شاهد النقد والإقراض والملكية يتحرك كلٌّ منها بطريقته.</p>',
        )),
        practice('spread'),
        keyIdea(L(
          '<p>Each kind of asset carries a <strong>different risk</strong>: cash stays steady, bonds follow interest rates, stocks follow company profits.</p>',
          '<p>لكل نوع من الأصول <strong>مخاطرة مختلفة</strong>: النقد يبقى مستقرًا، والسندات تتبع أسعار الفائدة، والأسهم تتبع أرباح الشركات.</p>',
        )),
        exercise('inva-q013'),
        exercise('inva-q014'),
      ],
    }),
  ],
  questions,
}
