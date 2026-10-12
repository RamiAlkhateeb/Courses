// Original course content. Describes how asset classes work in general; no products are recommended.
import type { Module } from '../../types'
import { L, box, cover, exercise, html, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'asset-classes'
const P = 'inva'

const questions = [
  mcq(P, W, 1, 'stocks',
    L('Owning a share of a company gives you…', 'امتلاك سهم في شركة يمنحك…'),
    [L('A small piece of ownership in the company', 'حصة صغيرة من ملكية الشركة'), L('A loan the company must repay', 'قرضًا يجب على الشركة سداده'), L('A guaranteed yearly payment', 'دفعة سنوية مضمونة')], 0),
  mcq(P, W, 2, 'stocks',
    L('Where does a stock’s return come from?', 'من أين يأتي عائد السهم؟'),
    [L('Price changes plus any dividends', 'تغيّر السعر إضافة إلى أي أرباح موزعة'), L('Only the interest the company pays', 'الفائدة التي تدفعها الشركة فقط'), L('A fixed coupon', 'كوبون ثابت')], 0),
  mcq(P, W, 3, 'bonds',
    L('When market interest rates rise, the price of an existing bond usually…', 'عندما ترتفع أسعار الفائدة في السوق، فإن سعر السند القائم عادةً…'),
    [L('Falls', 'ينخفض'), L('Rises', 'يرتفع'), L('Does not change', 'لا يتغير')], 0),
  mcq(P, W, 4, 'bonds',
    L('What is credit risk for a bond?', 'ما مخاطر الائتمان في السند؟'),
    [L('The risk that the borrower cannot pay interest or repay the loan', 'خطر عجز المقترض عن دفع الفائدة أو سداد القرض'), L('The risk that prices rise', 'خطر ارتفاع الأسعار'), L('The risk of forgetting your password', 'خطر نسيان كلمة المرور')], 0),
  mcq(P, W, 5, 'funds',
    L('What does an index fund do?', 'ماذا يفعل صندوق المؤشر؟'),
    [L('Holds all (or a sample of) the securities in an index to match its return', 'يمتلك جميع الأوراق المالية في مؤشر ما (أو عينة منها) ليطابق عائده'), L('Picks a few stocks it expects to beat the market', 'يختار بضعة أسهم يتوقع أن تتفوق على السوق'), L('Guarantees it will not lose money', 'يضمن عدم خسارة المال')], 0),
  mcq(P, W, 6, 'alternatives',
    L('Which statement about cryptocurrency fits this course’s view?', 'أي عبارة عن العملات المشفرة تتوافق مع رؤية هذه الدورة؟'),
    [L('It is highly volatile and speculative; only risk money you can afford to lose', 'شديدة التقلب ومضاربية؛ لا تخاطر إلا بمال يمكنك تحمّل خسارته'), L('It is a safe replacement for savings', 'بديل آمن للمدخرات'), L('Its returns are guaranteed by governments', 'عوائدها مضمونة من الحكومات')], 0),
]

export const assetClasses: Module = {
  id: W,
  courseId: 'investing',
  order: 2,
  cover: cover(L('Foundations · Module 2', 'الأساسيات · الوحدة 2'), L('Asset classes', 'فئات الأصول'), L('≈ 25 min', '≈ 25 دقيقة')),
  sections: [
    section({
      id: 'overview',
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
      ],
    }),
    section({
      id: 'stocks',
      label: L('Part 1', 'الجزء ١'),
      nav: L('Stocks', 'الأسهم'),
      title: L('Stocks: owning part of a business', 'الأسهم: امتلاك جزء من شركة'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>A <strong>share</strong> (stock) is a small slice of a company. If the company grows its profits, its shares tend to become worth more. Some companies also pay part of their profits to shareholders as <strong>dividends</strong>.</p><p>Total return = price change + dividends.</p>',
          '<p><strong>السهم</strong> شريحة صغيرة من شركة. إذا نمت أرباح الشركة، تميل قيمة أسهمها إلى الارتفاع. وتدفع بعض الشركات جزءًا من أرباحها للمساهمين على شكل <strong>توزيعات أرباح</strong>.</p><p>العائد الكلي = تغيّر السعر + توزيعات الأرباح.</p>',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Putting everything into one company you like. A single company can fail completely; a broad mix of companies very rarely goes to zero.',
          'وضع كل شيء في شركة واحدة تحبها. قد تفشل شركة واحدة تمامًا؛ أما مزيج واسع من الشركات فنادرًا جدًا ما يصل إلى الصفر.',
        )),
        exercise('inva-q001'),
        exercise('inva-q002'),
      ],
    }),
    section({
      id: 'bonds',
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
        exercise('inva-q003'),
        exercise('inva-q004'),
      ],
    }),
    section({
      id: 'cash',
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Cash', 'النقد'),
      title: L('Cash and cash equivalents', 'النقد وما يعادله'),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Savings accounts, term deposits, money-market funds and short-term government bills. Their value barely moves, which makes them right for emergency funds and money you need soon. Over long periods, though, they often barely keep up with inflation.</p>',
          '<p>حسابات التوفير والودائع لأجل وصناديق سوق النقد وأذون الخزانة قصيرة الأجل. قيمتها بالكاد تتحرك، ما يجعلها مناسبة لصناديق الطوارئ والمال الذي تحتاجه قريبًا. لكنها على المدى الطويل كثيرًا ما بالكاد تواكب التضخم.</p>',
        )),
      ],
    }),
    section({
      id: 'funds',
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
        box('keypoint', L('Check the cost', 'تحقّق من التكلفة'), L(
          'Every fund charges a yearly fee, the <strong>expense ratio</strong>, taken from your money automatically. The next module shows how much a small difference adds up to.',
          'كل صندوق يفرض رسومًا سنوية تسمى <strong>نسبة المصاريف</strong>، تُقتطع من مالك تلقائيًا. توضح الوحدة التالية كم يتراكم فرق صغير منها.',
        )),
        exercise('inva-q005'),
      ],
    }),
    section({
      id: 'alternatives',
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
        exercise('inva-q006'),
        takeaways([
          L('Stocks: ownership — higher growth, bigger swings', 'الأسهم: ملكية — نمو أعلى وتقلبات أكبر'),
          L('Bonds: lending — income, hurt by rising rates and defaults', 'السندات: إقراض — دخل، وتتضرر من ارتفاع الفائدة والتعثر'),
          L('Cash: stability for short-term needs', 'النقد: استقرار للاحتياجات قصيرة الأجل'),
          L('Funds bundle many holdings; always check the fee', 'الصناديق تجمع أصولًا كثيرة؛ تحقّق دائمًا من الرسوم'),
        ]),
      ],
    }),
  ],
  questions,
}
