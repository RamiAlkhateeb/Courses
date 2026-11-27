// The book, chapter 4: reading a company, valuation basics. Longer and more advanced than unit 4's lessons; no
// characters or questions. Companies are fictional; figures are illustrations, not forecasts or advice.
import type { BookChapter } from '../../../book'
import { L, box, diagram, formula, html, table } from '../../../helpers'

export const ch4: BookChapter = {
  id: 'valuation',
  title: L('Reading a company: valuation basics', 'قراءة الشركة: أساسيات التقييم'),
  summary: L(
    'How to read the few numbers that describe a business, what the price of a share is really paying for, and why a good company can still be a poor investment at the wrong price.',
    'كيف تقرأ الأرقام القليلة التي تصف شركة، وما الذي يدفع ثمنه سعر السهم فعلًا، ولماذا قد تكون الشركة الجيدة استثمارًا سيئًا بسعر خاطئ.',
  ),
  blocks: [
    html(L(
      '<h2>4.1 A share is a claim on future profits</h2><p>Chapter 2 described a share as a slice of ownership. This chapter asks what that slice is worth. In the long run, the value of a business comes from the profits it will earn for its owners over the rest of its life, whether paid out as dividends or reinvested to grow. A share price is the market\'s running estimate of that stream, and it moves every day as estimates change.</p><p>Over long periods, prices follow profits. If a company\'s profit doubles over ten years and investors\' expectations stay the same, its share price tends to double too. Over short periods, prices also follow mood, news and changing expectations, which is why they can swing far more than the business underneath.</p>',
      '<h2>4.1 السهم حق في الأرباح المستقبلية</h2><p>وصف الفصل الثاني السهم بأنه شريحة من الملكية. ويسأل هذا الفصل عن قيمة تلك الشريحة. على المدى الطويل تأتي قيمة الشركة من الأرباح التي ستحققها لمالكيها طوال بقية عمرها، سواء وُزّعت أرباحًا أو أُعيد استثمارها للنمو. وسعر السهم هو تقدير السوق المتجدد لهذا التدفق، ويتحرك كل يوم مع تغير التقديرات.</p><p>على مدى فترات طويلة تتبع الأسعار الأرباح. فإذا تضاعف ربح شركة خلال عشر سنوات وبقيت توقعات المستثمرين كما هي، يميل سعر سهمها إلى التضاعف أيضًا. أما على مدى فترات قصيرة فتتبع الأسعار أيضًا المزاج والأخبار والتوقعات المتغيرة، ولهذا يمكن أن تتأرجح أكثر بكثير من الشركة التي تحتها.</p>',
    )),
    diagram({
      fig: L('Figure 4.1', 'الشكل 4.1'),
      title: L('Over time, price follows profit', 'مع الوقت يتبع السعر الربح'),
      src: '/diagrams/price-profit.svg',
      alt: L('Profit doubles from 150 to 300 over ten years; with the same expectations, the share price doubles from 20 to 40.', 'يتضاعف الربح من 150 إلى 300 خلال عشر سنوات؛ ومع التوقعات نفسها يتضاعف سعر السهم من 20 إلى 40.'),
      caption: L('A fictional company, over ten years. Illustrative figures.', 'شركة خيالية، على مدى عشر سنوات. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>4.2 Revenue, costs, profit and margin</h2><p>Every company report begins with the <strong>income statement</strong>, which reads from top to bottom like a funnel. <strong>Revenue</strong> is everything customers paid. Take away the costs, materials, wages, rent, interest and tax, and what remains is <strong>profit</strong>, also called net income or earnings. The share of revenue that survives as profit is the <strong>margin</strong>.</p><p>A fictional company with revenue of 1,000 million and costs of 850 million earns a profit of 150 million: a 15% margin. Margins say a great deal about a business. A high, stable margin often means customers are loyal or competitors find it hard to copy what the company does. A thin margin means a small rise in costs can wipe out the profit.</p>',
      '<h2>4.2 الإيرادات والتكاليف والربح والهامش</h2><p>يبدأ كل تقرير للشركة بـ<strong>قائمة الدخل</strong>، وتُقرأ من الأعلى إلى الأسفل كالقمع. <strong>الإيرادات</strong> هي كل ما دفعه العملاء. اطرح التكاليف من مواد وأجور وإيجار وفائدة وضريبة، فما يتبقى هو <strong>الربح</strong>، ويُسمى أيضًا صافي الدخل أو الأرباح. ونسبة الإيرادات التي تبقى ربحًا هي <strong>الهامش</strong>.</p><p>شركة خيالية إيراداتها 1,000 مليون وتكاليفها 850 مليونًا تحقق ربحًا قدره 150 مليونًا: هامش 15%. والهوامش تقول الكثير عن الشركة. فالهامش المرتفع والمستقر يعني غالبًا أن العملاء أوفياء أو أن المنافسين يصعب عليهم تقليد ما تفعله الشركة. أما الهامش الرقيق فيعني أن ارتفاعًا صغيرًا في التكاليف قد يمحو الربح.</p>',
    )),
    diagram({
      fig: L('Figure 4.2', 'الشكل 4.2'),
      title: L('From revenue to profit', 'من الإيرادات إلى الربح'),
      src: '/diagrams/valuation-income.svg',
      alt: L('Revenue of 1,000, costs of 850, profit of 150: a 15% margin.', 'إيرادات 1,000، وتكاليف 850، وربح 150: هامش 15%.'),
      caption: L('One year of a fictional company, in millions. Illustrative figures.', 'عام واحد لشركة خيالية، بالملايين. أرقام توضيحية.'),
    }),
    formula('margin = profit ÷ revenue', L('150 ÷ 1,000 = 15%', '150 ÷ 1,000 = 15%')),
    html(L(
      '<h2>4.3 Earnings per share and the P/E ratio</h2><p>Profit belongs to all the shares together, so analysts divide it by the number of shares to get <strong>earnings per share</strong> (EPS). Dividing the share price by EPS gives the <strong>price-to-earnings ratio</strong> (P/E): how many years of today\'s profit the price pays for.</p><p>Two fictional companies each earn 2 per share. One trades at 20, a P/E of 10; the other at 60, a P/E of 30. Buyers of the second are paying three times as much for the same profit today, which makes sense only if they expect its profit to grow much faster. A high P/E is a bet on growth; a low P/E may be a bargain, or a warning that the market expects profits to shrink. The number starts a question; it does not answer it.</p>',
      '<h2>4.3 ربحية السهم ومكرر الربحية</h2><p>الربح ملك للأسهم كلها معًا، لذا يقسمه المحللون على عدد الأسهم ليحصلوا على <strong>ربحية السهم</strong>. وقسمة سعر السهم على ربحية السهم تعطي <strong>مكرر الربحية</strong>: كم سنة من ربح اليوم يدفع السعر ثمنها.</p><p>شركتان خياليتان تربح كل منهما 2 للسهم. الأولى تُتداول بسعر 20، أي مكرر 10؛ والثانية بسعر 60، أي مكرر 30. مشترو الثانية يدفعون ثلاثة أضعاف مقابل الربح نفسه اليوم، وهذا لا يكون منطقيًا إلا إذا توقعوا أن ينمو ربحها أسرع بكثير. المكرر المرتفع رهان على النمو؛ والمكرر المنخفض قد يكون صفقة رابحة، أو تحذيرًا من أن السوق يتوقع تقلص الأرباح. الرقم يبدأ سؤالًا ولا يجيب عنه.</p>',
    )),
    diagram({
      fig: L('Figure 4.3', 'الشكل 4.3'),
      title: L('The same profit at two prices', 'الربح نفسه بسعرين'),
      src: '/diagrams/valuation-pe.svg',
      alt: L('Two companies both earn 2 a share: at a price of 20 the P/E is 10, at a price of 60 it is 30.', 'شركتان تربح كل منهما 2 للسهم: بسعر 20 يكون المكرر 10، وبسعر 60 يكون 30.'),
      caption: L('Bar height is the P/E. Fictional companies, illustrative figures.', 'ارتفاع العمود هو المكرر. شركات خيالية وأرقام توضيحية.'),
    }),
    formula('P/E = share price ÷ earnings per share', L('60 ÷ 2 = 30; its inverse, 2 ÷ 60 ≈ 3.3%, is the earnings yield: the profit each 100 of price buys today.', '60 ÷ 2 = 30؛ ومقلوبه، 2 ÷ 60 ≈ 3.3%، هو عائد الأرباح: الربح الذي تشتريه كل 100 من السعر اليوم.')),
    html(L(
      '<h2>4.4 Dividends and yield</h2><p>Some companies pay part of their profit to shareholders as a cash dividend; others keep it all to reinvest. The <strong>dividend yield</strong> is the yearly dividend divided by the share price. A share paying 0.80 a year at a price of 20 yields 4%. If the price halves to 10 while the dividend stays at 0.80, the yield doubles to 8%.</p><p>That arithmetic hides a common trap. A very high yield is often high because the price has collapsed, and the price has often collapsed because investors expect the dividend to be cut. The <strong>payout ratio</strong>, dividends divided by profit, helps: a company paying out more than it earns cannot keep it up for long. A modest yield from a company with growing profits is usually worth more than a large yield from one in trouble.</p>',
      '<h2>4.4 التوزيعات وعائدها</h2><p>تدفع بعض الشركات جزءًا من ربحها للمساهمين توزيعات نقدية، وتحتفظ أخرى به كله لإعادة استثماره. و<strong>عائد التوزيعات</strong> هو التوزيعات السنوية مقسومة على سعر السهم. سهم يدفع 0.80 سنويًا بسعر 20 يحقق عائدًا قدره 4%. فإذا انخفض السعر إلى النصف ليصبح 10 بينما بقيت التوزيعات 0.80، يتضاعف العائد إلى 8%.</p><p>يخفي هذا الحساب فخًا شائعًا. فالعائد المرتفع جدًا كثيرًا ما يكون مرتفعًا لأن السعر انهار، وكثيرًا ما ينهار السعر لأن المستثمرين يتوقعون خفض التوزيعات. وتساعد <strong>نسبة التوزيع</strong>، أي التوزيعات مقسومة على الربح: فالشركة التي توزع أكثر مما تربح لا تستطيع الاستمرار طويلًا. وعائد متواضع من شركة أرباحها تنمو يساوي عادةً أكثر من عائد كبير من شركة في ورطة.</p>',
    )),
    diagram({
      fig: L('Figure 4.4', 'الشكل 4.4'),
      title: L('The same dividend at two prices', 'التوزيعات نفسها بسعرين'),
      src: '/diagrams/yield.svg',
      alt: L('A dividend of 0.80: at a price of 20 the yield is 4%; when the price halves to 10 it is 8%.', 'توزيعات قدرها 0.80: بسعر 20 يكون العائد 4%، وحين ينخفض السعر إلى النصف ليصبح 10 يصبح 8%.'),
      caption: L('A higher yield can simply mean a falling price. Illustrative figures.', 'العائد الأعلى قد يعني ببساطة سعرًا هابطًا. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>4.5 The balance sheet: what it owns and what it owes</h2><p>The income statement shows a year of business; the <strong>balance sheet</strong> shows a moment. On one side are the company\'s <strong>assets</strong>: cash, buildings, machines, stock, money owed to it. On the other are its <strong>liabilities</strong>, what it owes to lenders and suppliers. What is left for the owners is <strong>equity</strong>.</p><p>Two fictional companies each have assets of 900 million. One owes 300 million, leaving equity of 600; the other owes 750 million, leaving only 150. In good years the second may look more impressive, because borrowed money magnifies its returns. In a bad year its lenders must still be paid, and a modest fall in the value of its assets could wipe out its owners. Debt is not bad in itself, but heavy debt turns a difficult year into a dangerous one.</p>',
      '<h2>4.5 الميزانية العمومية: ما تملكه وما عليها</h2><p>تُظهر قائمة الدخل عامًا من العمل؛ أما <strong>الميزانية العمومية</strong> فتُظهر لحظة واحدة. في جانب منها <strong>أصول</strong> الشركة: النقد والمباني والآلات والمخزون والأموال المستحقة لها. وفي الجانب الآخر <strong>التزاماتها</strong>، أي ما تدين به للمُقرضين والموردين. وما يتبقى للمالكين هو <strong>حقوق الملكية</strong>.</p><p>شركتان خياليتان لكل منهما أصول قدرها 900 مليون. الأولى مدينة بـ300 مليون، فتبقى حقوق ملكية قدرها 600؛ والثانية مدينة بـ750 مليونًا، فلا يبقى إلا 150. في السنوات الجيدة قد تبدو الثانية أكثر إثارة للإعجاب، لأن المال المقترض يضخّم عوائدها. لكن في عام سيئ يجب أن يُدفع لمُقرضيها مع ذلك، وقد يمحو هبوط متواضع في قيمة أصولها حصة مالكيها كلها. الدين ليس سيئًا في ذاته، لكن الدين الثقيل يحوّل العام الصعب إلى عام خطير.</p>',
    )),
    diagram({
      fig: L('Figure 4.5', 'الشكل 4.5'),
      title: L('The same assets, different debts', 'الأصول نفسها وديون مختلفة'),
      src: '/diagrams/balance.svg',
      alt: L('Two companies with assets of 900: one owes 300, leaving equity of 600; the other owes 750, leaving 150.', 'شركتان أصول كل منهما 900: الأولى مدينة بـ300 فتبقى حقوق ملكية 600، والثانية مدينة بـ750 فيبقى 150.'),
      caption: L('In millions. Fictional companies, illustrative figures.', 'بالملايين. شركات خيالية وأرقام توضيحية.'),
    }),
    formula('equity = assets − liabilities', L('900 − 300 = 600; 900 − 750 = 150. Debt ÷ equity: 0.5 for the first, 5 for the second.', '900 − 300 = 600؛ و900 − 750 = 150. الدين ÷ حقوق الملكية: 0.5 للأولى، و5 للثانية.')),
    html(L(
      '<h2>4.6 Price and value: why expectations matter</h2><p>A share price already contains the market\'s expectations. That is why a company can report rising profits and still see its shares fall: if buyers had expected 25% growth and the company delivers 15%, the price may drop, say from 60 to 45, even though the business improved. What moves prices is the surprise, the gap between what happened and what was expected.</p><p>This is also why picking individual winners is so hard. Everyone can see that a company is excellent; the question is whether its excellence is already in the price. The difference between a great company and a great investment is the price paid for it.</p>',
      '<h2>4.6 السعر والقيمة: لماذا تهم التوقعات</h2><p>يحمل سعر السهم بالفعل توقعات السوق. لهذا قد تعلن شركة عن أرباح متزايدة ومع ذلك تهبط أسهمها: فإذا توقع المشترون نموًا بنسبة 25% وحققت الشركة 15%، قد ينخفض السعر، من 60 إلى 45 مثلًا، مع أن الشركة تحسنت. ما يحرك الأسعار هو المفاجأة، أي الفجوة بين ما حدث وما كان متوقعًا.</p><p>وهذا أيضًا سبب صعوبة اختيار الرابحين المنفردين. فالجميع يرى أن شركة ما ممتازة؛ والسؤال هو هل امتيازها محسوب في السعر بالفعل. الفرق بين شركة عظيمة واستثمار عظيم هو السعر المدفوع مقابلها.</p>',
    )),
    diagram({
      fig: L('Figure 4.6', 'الشكل 4.6'),
      title: L('Growth below expectations', 'نمو أقل من التوقعات'),
      src: '/diagrams/expectations.svg',
      alt: L('Buyers expected 25% profit growth; the company grew 15%. The share price falls from 60 to 45 although profits rose.', 'توقع المشترون نموًا في الأرباح بنسبة 25%، ونمت الشركة 15%. يهبط سعر السهم من 60 إلى 45 مع أن الأرباح ارتفعت.'),
      caption: L('A fictional company. Illustrative figures.', 'شركة خيالية. أرقام توضيحية.'),
    }),
    table(
      [L('Measure', 'المقياس'), L('What it tells you', 'ما يخبرك به'), L('Watch out for', 'انتبه إلى')],
      [
        [L('Margin', 'الهامش'), L('How much of each sale becomes profit', 'كم من كل عملية بيع يصبح ربحًا'), L('A one-off good year', 'عام جيد استثنائي')],
        [L('P/E', 'مكرر الربحية'), L('How many years of profit the price pays for', 'كم سنة من الربح يدفع السعر ثمنها'), L('Profits about to fall', 'أرباح على وشك الهبوط')],
        [L('Dividend yield', 'عائد التوزيعات'), L('Cash paid each year per 100 of price', 'النقد المدفوع سنويًا لكل 100 من السعر'), L('A high yield from a collapsing price', 'عائد مرتفع ناتج عن سعر منهار')],
        [L('Debt ÷ equity', 'الدين ÷ حقوق الملكية'), L('How much the company relies on borrowing', 'مدى اعتماد الشركة على الاقتراض'), L('Heavy debt before a downturn', 'دين ثقيل قبل تراجع')],
      ],
    ),
    box('keypoint', L('Why most investors buy the whole market', 'لماذا يشتري معظم المستثمرين السوق كله'), L(
      'Understanding these numbers makes you a better-informed owner, but it does not make beating the market easy: thousands of professionals study the same figures every day. That is why broad, low-cost funds that own the whole market are such a common choice for the core of a portfolio.',
      'فهم هذه الأرقام يجعلك مالكًا أكثر اطلاعًا، لكنه لا يجعل التفوق على السوق سهلًا: فآلاف المحترفين يدرسون الأرقام نفسها كل يوم. لهذا تُعد الصناديق الواسعة منخفضة التكلفة التي تملك السوق كله خيارًا شائعًا جدًا لنواة المحفظة.',
    )),
    html(L(
      '<h2>4.7 Cash flow: profit you can spend</h2><p>Profit is an accounting figure: it includes sales not yet paid for and spreads the cost of big purchases over many years. <strong>Cash flow</strong> is what actually moved through the bank account. <strong>Free cash flow</strong>, the cash from running the business minus what it spends to maintain and grow it, is the money truly available to pay dividends, repay debt or invest. A company that reports profits year after year but never produces free cash flow deserves a closer look; one whose free cash flow steadily matches or exceeds its profit is usually on firmer ground.</p>',
      '<h2>4.7 التدفق النقدي: الربح الذي يمكن إنفاقه</h2><p>الربح رقم محاسبي: يشمل مبيعات لم تُدفع بعد، ويوزع تكلفة المشتريات الكبيرة على سنوات كثيرة. أما <strong>التدفق النقدي</strong> فهو ما تحرك فعلًا عبر الحساب المصرفي. و<strong>التدفق النقدي الحر</strong>، أي النقد الناتج عن تشغيل الشركة ناقص ما تنفقه للحفاظ عليها وتنميتها، هو المال المتاح حقًا لدفع التوزيعات أو سداد الديون أو الاستثمار. والشركة التي تعلن أرباحًا عامًا بعد عام ولا تنتج تدفقًا نقديًا حرًا أبدًا تستحق نظرة أدق؛ أما التي يساوي تدفقها النقدي الحر ربحها أو يزيد عليه باستمرار فتقف عادةً على أرض أصلب.</p>',
    )),
    table(
      [L('A fictional company, one year', 'شركة خيالية، عام واحد'), L('Figure', 'الرقم'), L('Worked out', 'طريقة الحساب')],
      [
        [L('Revenue', 'الإيرادات'), L('2,000', '2,000'), L('Given, in millions', 'معطى، بالملايين')],
        [L('Costs', 'التكاليف'), L('1,760', '1,760'), L('Given', 'معطى')],
        [L('Profit', 'الربح'), L('240', '240'), L('2,000 − 1,760', '2,000 − 1,760')],
        [L('Margin', 'الهامش'), L('12%', '12%'), L('240 ÷ 2,000', '240 ÷ 2,000')],
        [L('Earnings per share (100 million shares)', 'ربحية السهم (100 مليون سهم)'), L('2.40', '2.40'), L('240 ÷ 100', '240 ÷ 100')],
        [L('P/E at a price of 36', 'المكرر بسعر 36'), L('15', '15'), L('36 ÷ 2.40', '36 ÷ 2.40')],
        [L('Dividend yield (0.96 a share)', 'عائد التوزيعات (0.96 للسهم)'), L('≈ 2.7%', '≈ 2.7%'), L('0.96 ÷ 36', '0.96 ÷ 36')],
        [L('Payout ratio', 'نسبة التوزيع'), L('40%', '40%'), L('0.96 ÷ 2.40', '0.96 ÷ 2.40')],
        [L('Debt ÷ equity (debt 400, equity 800)', 'الدين ÷ حقوق الملكية (دين 400، حقوق 800)'), L('0.5', '0.5'), L('400 ÷ 800', '400 ÷ 800')],
      ],
    ),
    box('example', L('Reading the worked example', 'قراءة المثال المحلول'), L(
      'This fictional company keeps 12% of each sale as profit, is priced at 15 years of today\'s profit, pays out 40% of its profit and keeps the rest to grow, and borrows moderately. None of these numbers says "buy" or "sell" on its own; together they describe a business you can compare with others and with its own past. Illustrative figures.',
      'تحتفظ هذه الشركة الخيالية بـ12% من كل عملية بيع ربحًا، وتُسعّر بما يعادل 15 سنة من ربح اليوم، وتوزع 40% من ربحها وتحتفظ بالباقي للنمو، وتقترض باعتدال. لا يقول أي من هذه الأرقام وحده «اشترِ» أو «بِع»؛ لكنها معًا تصف شركة يمكنك مقارنتها بغيرها وبماضيها. أرقام توضيحية.',
    )),
    html(L(
      '<h2>Chapter summary</h2><ul><li>A share is a claim on a company\'s future profits; over time, prices follow profits.</li><li>Revenue minus costs is profit; profit over revenue is the margin.</li><li>The P/E ratio says how many years of profit the price pays for; a high one is a bet on growth.</li><li>Dividend yield rises when prices fall; a very high yield can be a warning.</li><li>Equity is assets minus debts; heavy debt makes bad years dangerous.</li><li>Prices move on surprises against expectations; a great company is not always a great investment.</li></ul>',
      '<h2>خلاصة الفصل</h2><ul><li>السهم حق في أرباح الشركة المستقبلية؛ ومع الوقت تتبع الأسعار الأرباح.</li><li>الإيرادات ناقص التكاليف تساوي الربح؛ والربح مقسومًا على الإيرادات هو الهامش.</li><li>مكرر الربحية يبيّن كم سنة من الربح يدفع السعر ثمنها؛ والمرتفع منه رهان على النمو.</li><li>عائد التوزيعات يرتفع حين تنخفض الأسعار؛ والعائد المرتفع جدًا قد يكون تحذيرًا.</li><li>حقوق الملكية هي الأصول ناقص الديون؛ والدين الثقيل يجعل السنوات السيئة خطيرة.</li><li>تتحرك الأسعار مع المفاجآت مقارنة بالتوقعات؛ والشركة العظيمة ليست دائمًا استثمارًا عظيمًا.</li></ul>',
    )),
  ],
}
