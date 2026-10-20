// Original course content. Describes how asset classes work in general; no products are recommended.
import type { Module } from '../../types'
import { L, box, cover, exercise, html, keyIdea, mcq, objectives, practice, section, table, takeaways } from '../../helpers'

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
      standfirst: L('An asset class is a group of investments that behave in similar ways. Most portfolios are built from a few of them.', 'فئة الأصول مجموعة من الاستثمارات التي تتصرف بطرق متشابهة. تُبنى معظم المحافظ من عدد قليل منها.'),
      time: L('2 min', '2 دقيقة'),
      blocks: [
        objectives([
          L('Explain how stocks and bonds make or lose money', 'شرح كيف تربح الأسهم والسندات أو تخسر'),
          L('Know the role of cash', 'معرفة دور النقد'),
          L('Tell mutual funds, ETFs and index funds apart', 'التمييز بين صناديق الاستثمار المشتركة وصناديق المؤشرات المتداولة وصناديق المؤشرات'),
          L('Judge alternatives such as real estate, gold and crypto', 'تقييم البدائل مثل العقار والذهب والعملات المشفرة'),
        ]),
        html(L(
          '<p>The main ones are <strong>stocks</strong> (owning part of a business), <strong>bonds</strong> (lending money), <strong>cash</strong> (keeping it safe) and alternatives such as property or gold.</p>',
          '<p>أهمها <strong>الأسهم</strong> (امتلاك جزء من شركة)، و<strong>السندات</strong> (إقراض المال)، و<strong>النقد</strong> (حفظه بأمان)، والبدائل مثل العقار أو الذهب.</p>',
        )),
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
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>A <strong>share</strong> (stock) is a small slice of a company. If the company grows its profits, its shares tend to become worth more. Some companies also pay part of their profits to shareholders as <strong>dividends</strong>.</p><p>Total return = price change + dividends.</p>',
          '<p><strong>السهم</strong> شريحة صغيرة من شركة. إذا نمت أرباح الشركة، تميل قيمة أسهمها إلى الارتفاع. وتدفع بعض الشركات جزءًا من أرباحها للمساهمين على شكل <strong>توزيعات أرباح</strong>.</p><p>العائد الكلي = تغيّر السعر + توزيعات الأرباح.</p>',
        )),
        box('example', L('Example', 'مثال'), L(
          'You buy one share of a bakery chain at 50. A year later it is worth 54, and it paid you a dividend of 1. Your total return is 5 on 50, or 10%. (Illustrative figures.)',
          'تشتري سهمًا واحدًا في سلسلة مخابز بسعر 50. بعد عام صار يساوي 54، ودفع لك توزيعات أرباح قدرها 1. عائدك الكلي 5 من 50، أي 10%. (أرقام توضيحية.)',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Putting everything into one company you like. A single company can fail completely; a broad mix of companies very rarely goes to zero.',
          'وضع كل شيء في شركة واحدة تحبها. قد تفشل شركة واحدة تمامًا؛ أما مزيج واسع من الشركات فنادرًا جدًا ما يصل إلى الصفر.',
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
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>A <strong>bond</strong> is a loan to a government or a company. The borrower pays regular interest (the <strong>coupon</strong>) and returns the original amount at <strong>maturity</strong>.</p>',
          '<p><strong>السند</strong> قرض لحكومة أو شركة. يدفع المقترض فائدة منتظمة (<strong>الكوبون</strong>) ويعيد المبلغ الأصلي عند <strong>الاستحقاق</strong>.</p>',
        )),
        table(
          [L('Risk', 'المخاطرة'), L('What it means', 'معناها')],
          [
            [L('Interest-rate risk', 'مخاطر سعر الفائدة'), L('When rates rise, new bonds pay more, so older bonds with lower coupons fall in price. Longer bonds are hit harder.', 'عندما ترتفع الفائدة تدفع السندات الجديدة أكثر، فتنخفض أسعار السندات القديمة ذات الكوبونات الأقل. السندات الأطول أجلًا تتأثر أكثر.')],
            [L('Credit risk', 'مخاطر الائتمان'), L('The borrower may fail to pay. Higher-risk borrowers must offer higher interest.', 'قد يعجز المقترض عن السداد. على المقترضين الأعلى مخاطرة تقديم فائدة أعلى.')],
            [L('Inflation risk', 'مخاطر التضخم'), L('Fixed payments buy less if prices rise faster than expected.', 'الدفعات الثابتة تشتري أقل إذا ارتفعت الأسعار أسرع من المتوقع.')],
          ],
        ),
        box('analogy', L('Analogy', 'تشبيه'), L(
          'You hold a bond paying 3%. New bonds now pay 5%. Nobody will pay full price for your 3% bond when 5% is on offer — so its price drops until its yield is competitive.',
          'تملك سندًا يدفع 3%، والسندات الجديدة تدفع الآن 5%. لن يدفع أحد السعر الكامل لسندك ذي الـ3% بينما يتوفر 5% — لذا ينخفض سعره حتى يصبح عائده منافسًا.',
        )),
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
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Savings accounts, term deposits, money-market funds and short-term government bills. Their value barely moves, which makes them right for emergency funds and money you need soon. Over long periods, though, they often barely keep up with inflation.</p>',
          '<p>حسابات التوفير والودائع لأجل وصناديق سوق النقد وأذون الخزانة قصيرة الأجل. قيمتها بالكاد تتحرك، ما يجعلها مناسبة لصناديق الطوارئ والمال الذي تحتاجه قريبًا. لكنها على المدى الطويل كثيرًا ما بالكاد تواكب التضخم.</p>',
        )),
        box('example', L('Example', 'مثال'), L(
          'Next month’s rent, a car-repair fund, a deposit for a trip: money you may need soon belongs in cash, where its value will not drop the week you need it.',
          'إيجار الشهر القادم، أو صندوق لإصلاح السيارة، أو عربون رحلة: المال الذي قد تحتاجه قريبًا مكانه النقد، حيث لن تنخفض قيمته في الأسبوع الذي تحتاجه فيه.',
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
      time: L('6 min', '6 دقائق'),
      blocks: [
        table(
          [L('Type', 'النوع'), L('How it works', 'كيف يعمل')],
          [
            [L('Mutual fund', 'صندوق استثمار مشترك'), L('Pools investors’ money; priced once a day.', 'يجمع أموال المستثمرين؛ يُسعَّر مرة يوميًا.')],
            [L('ETF (exchange-traded fund)', 'صندوق مؤشرات متداول (ETF)'), L('A fund that trades on a stock exchange like a share, throughout the day.', 'صندوق يُتداول في البورصة كالسهم طوال اليوم.')],
            [L('Index fund', 'صندوق مؤشر'), L('Tracks an index (e.g. a country’s largest companies) instead of picking stocks. Can be a mutual fund or an ETF.', 'يتبع مؤشرًا (مثل أكبر شركات بلد ما) بدل انتقاء الأسهم. قد يكون صندوقًا مشتركًا أو صندوقًا متداولًا.')],
            [L('Active fund', 'صندوق مُدار بنشاط'), L('A manager picks investments trying to beat the market; usually charges higher fees.', 'يختار مدير الاستثمارات محاولًا التفوق على السوق؛ وعادةً يفرض رسومًا أعلى.')],
          ],
        ),
        box('analogy', L('Analogy', 'تشبيه'), L(
          'A fund is like a fruit basket: one purchase gets you many kinds of fruit, instead of buying each one separately.',
          'الصندوق كسلة فواكه: شراء واحد يمنحك أنواعًا كثيرة من الفاكهة، بدل شراء كل نوع على حدة.',
        )),
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
      time: L('4 min', '4 دقائق'),
      blocks: [
        table(
          [L('Asset', 'الأصل'), L('Points to weigh', 'نقاط للموازنة')],
          [
            [L('Property', 'العقار'), L('Rental income and long-term growth, but large sums, high costs, debt and hard to sell quickly. REITs give exposure through the stock market.', 'دخل إيجاري ونمو طويل الأجل، لكنه يتطلب مبالغ كبيرة وتكاليف مرتفعة وديونًا، ويصعب بيعه بسرعة. صناديق الاستثمار العقاري (REITs) تتيح التعرض له عبر البورصة.')],
            [L('Gold', 'الذهب'), L('No income; price moves with fear and currency changes. Some hold a small amount as a hedge.', 'لا يدر دخلًا؛ يتحرك سعره مع الخوف وتغيّر العملات. يحتفظ البعض بكمية صغيرة منه للتحوط.')],
            [L('Cryptocurrency', 'العملات المشفرة'), L('Extremely volatile, no income, exposed to hacks and fraud. Treat as speculation.', 'شديدة التقلب، لا تدر دخلًا، ومعرضة للاختراق والاحتيال. تعامل معها كمضاربة.')],
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
        'Hold three different kinds of investment and watch each move in its own way.',
        'امتلك ثلاثة أنواع مختلفة من الاستثمار وشاهد كلًّا منها يتحرك بطريقته.',
      ),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Now put the asset classes side by side. With <strong>play money</strong> and simulated prices (practice, not advice), hold <strong>three different investments</strong> at the same time, for example Safe Savings, Government Bonds and a stock fund. Tap each one, choose an amount and buy. Then watch how cash, lending and ownership move in their own ways.</p>',
          '<p>ضع الآن فئات الأصول جنبًا إلى جنب. بـ<strong>مال افتراضي</strong> وأسعار محاكاة (للتدريب، لا نصيحة)، امتلك <strong>ثلاثة استثمارات مختلفة</strong> في الوقت نفسه، مثل الادخار الآمن والسندات الحكومية وصندوق أسهم. اضغط على كل منها، وحدّد مبلغًا، واشترِ. ثم شاهد كيف يتحرك النقد والإقراض والملكية كلٌّ بطريقته.</p>',
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
