// The book, chapter 2: asset classes. Longer and more advanced than unit 2's lessons; no characters or questions.
// Figures are illustrations, not forecasts or advice.
import type { BookChapter } from '../../../book'
import { L, box, diagram, html, table } from '../../../helpers'

export const ch2: BookChapter = {
  id: 'asset-classes',
  title: L('Asset classes', 'فئات الأصول'),
  summary: L(
    'What you actually own when you invest: shares, bonds, cash, the funds that hold them, and the alternatives around them. How each one makes money, how each one can lose it, and why most portfolios hold more than one.',
    'ما الذي تملكه فعلًا حين تستثمر: الأسهم والسندات والنقد والصناديق التي تجمعها، والبدائل من حولها. كيف يحقق كل منها المال، وكيف يخسره، ولماذا تضم معظم المحافظ أكثر من نوع.',
  ),
  blocks: [
    html(L(
      '<h2>2.1 Three building blocks</h2><p>Almost every investment is built from three basic kinds of asset. <strong>Shares</strong> (also called stocks or equities) make you a part-owner of a company. <strong>Bonds</strong> make you a lender to a government or a company. <strong>Cash</strong>, in savings accounts and very short-term deposits, is money kept ready. Each has a different job, a different source of return and a different way of going wrong.</p><p>They also behave differently in the same year. In a year when companies do well, shares may rise strongly while bonds slip and cash earns its small, steady interest. In a crisis the order can reverse. That difference in behaviour is not a nuisance; it is the raw material of diversification, the subject of the next chapter.</p>',
      '<h2>2.1 ثلاث لبنات أساسية</h2><p>يُبنى كل استثمار تقريبًا من ثلاثة أنواع أساسية من الأصول. <strong>الأسهم</strong> تجعلك شريكًا في ملكية شركة. و<strong>السندات</strong> تجعلك مُقرضًا لحكومة أو شركة. و<strong>النقد</strong>، في حسابات التوفير والودائع قصيرة الأجل جدًا، مال يُحفظ جاهزًا. لكل منها وظيفة مختلفة، ومصدر عائد مختلف، وطريقة مختلفة في أن تسوء الأمور.</p><p>وهي تتصرف بشكل مختلف في العام نفسه. ففي عام تحقق فيه الشركات أداءً جيدًا قد ترتفع الأسهم بقوة بينما تتراجع السندات ويكسب النقد فائدته الصغيرة الثابتة. وفي الأزمات قد ينقلب الترتيب. هذا الاختلاف في السلوك ليس إزعاجًا؛ بل هو المادة الخام للتنويع، موضوع الفصل التالي.</p>',
    )),
    diagram({
      fig: L('Figure 2.1', 'الشكل 2.1'),
      title: L('One year, three results', 'عام واحد وثلاث نتائج'),
      src: '/diagrams/asset-year.svg',
      alt: L('Three bars for one year: cash +2%, bonds −3%, shares +18%.', 'ثلاثة أعمدة لعام واحد: النقد +2%، والسندات −3%، والأسهم +18%.'),
      caption: L('Left to right: cash, bonds, shares. One illustrative year.', 'من اليسار إلى اليمين: النقد، السندات، الأسهم. عام توضيحي واحد.'),
    }),
    html(L(
      '<h2>2.2 Shares: owning a slice of a business</h2><p>A share is a small piece of ownership in a company. If a company is divided into a million shares and you hold one thousand, you own a thousandth of it: a thousandth of its buildings, its products, its debts and, above all, its future profits. You earn from a share in two ways. The price can rise, because the company grows or because investors expect it to; and the company may pay part of its profit to its owners as a <strong>dividend</strong>.</p><p>Add the two together and you have the <strong>total return</strong>. A share bought at 50 that is worth 54 a year later and paid a dividend of 1 has earned 5 on 50, or 10%. Judging a share only by its price misses the dividend; judging it only by its dividend misses the growth.</p>',
      '<h2>2.2 الأسهم: امتلاك شريحة من شركة</h2><p>السهم جزء صغير من ملكية شركة. فإذا قُسّمت شركة إلى مليون سهم وأنت تملك ألفًا منها، فأنت تملك جزءًا من ألف منها: من مبانيها ومنتجاتها وديونها، وقبل كل شيء من أرباحها المستقبلية. وتكسب من السهم بطريقتين: قد يرتفع السعر لأن الشركة تنمو أو لأن المستثمرين يتوقعون نموها، وقد تدفع الشركة جزءًا من أرباحها لمالكيها في صورة <strong>توزيعات أرباح</strong>.</p><p>اجمع الاثنين معًا تحصل على <strong>العائد الإجمالي</strong>. سهم اشتُري بسعر 50 وصارت قيمته 54 بعد عام ودفع توزيعات قدرها 1 قد كسب 5 على 50، أي 10%. الحكم على السهم بسعره وحده يغفل التوزيعات، والحكم عليه بتوزيعاته وحدها يغفل النمو.</p>',
    )),
    diagram({
      fig: L('Figure 2.2', 'الشكل 2.2'),
      title: L('Total return on one share', 'العائد الإجمالي لسهم واحد'),
      src: '/diagrams/stock-return.svg',
      alt: L('A share bought at 50 rises by 4 and pays a dividend of 1: a total of 5, or 10%.', 'سهم اشتُري بسعر 50 يرتفع بمقدار 4 ويدفع توزيعات قدرها 1: المجموع 5، أي 10%.'),
      caption: L('Price change plus dividend. Illustrative figures.', 'تغيّر السعر مضافًا إليه التوزيعات. أرقام توضيحية.'),
    }),
    html(L(
      '<p>Shares have the highest long-run returns of the three building blocks, and the largest falls. Owners are paid last: when a company struggles, its workers, suppliers and lenders are paid before shareholders see anything, and if it fails the shares can be worth nothing. That position at the back of the queue is exactly why shares are expected to pay more over time. A single company can collapse; a market of thousands rarely does, which is why the advice to hold many companies rather than a few runs through the rest of this book.</p>',
      '<p>للأسهم أعلى عائد طويل الأجل بين اللبنات الثلاث، وأكبر الهبوطات أيضًا. فالمالكون يُدفع لهم أخيرًا: حين تتعثر شركة يُدفع للعاملين والموردين والمُقرضين قبل أن يرى المساهمون شيئًا، وإذا أفلست فقد تصبح الأسهم بلا قيمة. هذا الموقع في آخر الصف هو بالضبط سبب توقع أن تدفع الأسهم أكثر مع الوقت. قد تنهار شركة واحدة، أما سوق من آلاف الشركات فنادرًا ما ينهار، ولهذا تتكرر في بقية هذا الكتاب نصيحة امتلاك شركات كثيرة لا قليلة.</p>',
    )),
    html(L(
      '<h2>2.3 Bonds: lending for a fixed return</h2><p>A bond is a loan. You lend, say, 1,000 to a government or a company for a set number of years. In return the borrower pays you interest, called the <strong>coupon</strong>, usually once or twice a year, and returns the 1,000 at the end, on the <strong>maturity</strong> date. If the borrower keeps its promise and you hold the bond to the end, you know your return in advance. That predictability is what bonds are for.</p><p>Two things can go wrong. The first is <strong>credit risk</strong>: the borrower may fail to pay. Bonds from stable governments carry very little of this risk and pay less; bonds from weaker companies pay more to make up for it. The second is <strong>interest-rate risk</strong>, and it surprises many new investors: when interest rates rise, the price of existing bonds falls.</p>',
      '<h2>2.3 السندات: إقراض مقابل عائد ثابت</h2><p>السند قرض. تُقرض مثلًا 1,000 لحكومة أو شركة لعدد محدد من السنوات. ومقابل ذلك يدفع لك المقترض فائدة تُسمى <strong>القسيمة</strong>، عادةً مرة أو مرتين في العام، ويعيد إليك الـ1,000 في النهاية، في تاريخ <strong>الاستحقاق</strong>. فإذا وفى المقترض بوعده واحتفظت بالسند حتى نهايته، عرفت عائدك مسبقًا. وهذه القابلية للتوقع هي الغاية من السندات.</p><p>هناك أمران قد يسوءان. الأول <strong>مخاطر الائتمان</strong>: قد يعجز المقترض عن الدفع. سندات الحكومات المستقرة تحمل القليل جدًا من هذه المخاطر وتدفع أقل، وسندات الشركات الأضعف تدفع أكثر تعويضًا عنها. والثاني <strong>مخاطر أسعار الفائدة</strong>، وهي تفاجئ كثيرًا من المستثمرين الجدد: حين ترتفع أسعار الفائدة ينخفض سعر السندات القائمة.</p>',
    )),
    html(L(
      '<p>The reason is simple once you see it. Suppose you hold a bond that pays 3% a year with ten years left, and new bonds now pay 5%. Nobody will pay full price for your 3% when 5% is on offer, so the price of your bond falls until its return to a new buyer roughly matches 5%: to about 85 for every 100 of face value. The reverse also holds: when rates fall, existing bonds rise in price. The longer a bond has left to run, the more its price moves for each change in rates. That sensitivity is called <strong>duration</strong>, and it is why long-term bonds can fall sharply in a year of rising rates even though nobody has defaulted.</p>',
      '<p>السبب بسيط حين تراه. افترض أنك تملك سندًا يدفع 3% سنويًا وبقيت له عشر سنوات، وأن السندات الجديدة صارت تدفع 5%. لن يدفع أحد السعر الكامل مقابل 3% بينما تُعرض 5%، فينخفض سعر سندك إلى أن يقارب عائده لمشترٍ جديد 5%: إلى نحو 85 لكل 100 من القيمة الاسمية. والعكس صحيح أيضًا: حين تنخفض الفائدة ترتفع أسعار السندات القائمة. وكلما طالت المدة المتبقية للسند تحرك سعره أكثر مع كل تغير في الفائدة. تُسمى هذه الحساسية <strong>المدة</strong>، وهي السبب في أن السندات طويلة الأجل قد تهبط بحدة في عام ترتفع فيه الفائدة مع أن أحدًا لم يتخلف عن السداد.</p>',
    )),
    diagram({
      fig: L('Figure 2.3', 'الشكل 2.3'),
      title: L('When rates rise, an old bond is worth less', 'حين ترتفع الفائدة تقل قيمة السند القديم'),
      src: '/diagrams/bond-price.svg',
      alt: L('A 3% bond with 10 years left is priced 100. When new bonds pay 5%, a buyer pays about 85 for it.', 'سند بفائدة 3% بقيت له 10 سنوات سعره 100. حين تدفع السندات الجديدة 5%، يدفع المشتري نحو 85 مقابله.'),
      caption: L('Prices of existing bonds move against interest rates. Illustrative figures.', 'أسعار السندات القائمة تتحرك عكس أسعار الفائدة. أرقام توضيحية.'),
    }),
    table(
      [L('Kind of bond', 'نوع السند'), L('Credit risk', 'مخاطر الائتمان'), L('Typical yield', 'العائد المعتاد'), L('Used for', 'يُستخدم في')],
      [
        [L('Short-term government', 'حكومي قصير الأجل'), L('Very low', 'منخفضة جدًا'), L('Lowest', 'الأدنى'), L('Safety, near-cash', 'الأمان، شبيه بالنقد')],
        [L('Long-term government', 'حكومي طويل الأجل'), L('Very low', 'منخفضة جدًا'), L('Low to medium', 'منخفض إلى متوسط'), L('Steadying a mix of shares', 'تهدئة مزيج من الأسهم')],
        [L('Strong companies', 'شركات قوية'), L('Low', 'منخفضة'), L('Medium', 'متوسط'), L('A little more income', 'دخل أعلى قليلًا')],
        [L('Weaker companies ("high yield")', 'شركات أضعف («عائد مرتفع»)'), L('High', 'مرتفعة'), L('Highest', 'الأعلى'), L('Income, with share-like falls', 'دخل، مع هبوطات تشبه الأسهم')],
      ],
    ),
    html(L(
      '<h2>2.4 Cash: safe, ready and slowly shrinking</h2><p>Cash is the only asset whose number never falls. That makes it ideal for money needed soon and for an emergency fund. Its weakness is the one met in chapter 1: over long periods its interest has often trailed inflation, so its buying power slowly drains away. Cash is the right home for money with a short horizon and the wrong home for money meant to grow for decades.</p><p>Cash also has a quieter use inside a portfolio: it is what lets you act. Money set aside in cash can be invested after a fall rather than forcing you to sell something else at a bad time.</p>',
      '<h2>2.4 النقد: آمن وجاهز ويتآكل ببطء</h2><p>النقد هو الأصل الوحيد الذي لا ينخفض رقمه أبدًا. وهذا يجعله مثاليًا للمال الذي ستحتاجه قريبًا ولصندوق الطوارئ. أما ضعفه فهو ما رأيناه في الفصل الأول: على مدى فترات طويلة كثيرًا ما تأخرت فائدته عن التضخم، فتتسرب قوته الشرائية ببطء. النقد هو المكان المناسب للمال ذي الأفق القصير، والمكان الخطأ للمال الذي يُراد له أن ينمو عقودًا.</p><p>وللنقد استخدام أهدأ داخل المحفظة: فهو ما يتيح لك التصرف. المال المجنّب نقدًا يمكن استثماره بعد هبوط بدل أن يضطرك إلى بيع شيء آخر في وقت سيئ.</p>',
    )),
    diagram({
      fig: L('Figure 2.4', 'الشكل 2.4'),
      title: L('1,000 in savings against rising prices', '1,000 في التوفير مقابل ارتفاع الأسعار'),
      src: '/diagrams/cash-vs-prices.svg',
      alt: L('After 10 years, 1,000 in savings at 1% a year is 1,105, while what 1,000 bought at the start now costs 1,344.', 'بعد 10 سنوات تصبح 1,000 في التوفير بفائدة 1% سنويًا 1,105، بينما صار ما كانت تشتريه 1,000 في البداية يكلّف 1,344.'),
      caption: L('1% interest against 3% inflation, over 10 years. Illustrative figures.', 'فائدة 1% مقابل تضخم 3%، على مدى 10 سنوات. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>2.5 Funds: many holdings in one</h2><p>Buying dozens of shares or bonds one by one is expensive and slow. A <strong>fund</strong> pools money from many investors and buys a whole basket at once, so a single purchase can give you a slice of hundreds or thousands of holdings. Two broad kinds matter most.</p><ul><li><strong>Index funds</strong> simply copy a market index, for example the largest companies of a country or of the world. They do not try to pick winners, so they are cheap to run, and they deliver the market\'s return, minus a small fee.</li><li><strong>Actively managed funds</strong> employ managers who choose what to buy, hoping to beat the market. They charge more for that work, and over long periods most of them have not beaten the index they compete with once their higher fees are counted.</li></ul><p>An <strong>exchange-traded fund</strong> (ETF) is a fund whose units trade on a stock exchange like a single share, which makes it easy to buy and sell. Most ETFs are index funds, but the label describes how a fund is traded, not what it holds: always look at what is inside and what it costs.</p>',
      '<h2>2.5 الصناديق: ممتلكات كثيرة في واحد</h2><p>شراء عشرات الأسهم أو السندات واحدًا تلو الآخر مكلف وبطيء. أما <strong>الصندوق</strong> فيجمع أموال كثير من المستثمرين ويشتري سلة كاملة دفعة واحدة، فتمنحك عملية شراء واحدة شريحة من مئات أو آلاف الممتلكات. وهناك نوعان رئيسيان يهمان أكثر من غيرهما.</p><ul><li><strong>صناديق المؤشرات</strong> تنسخ ببساطة مؤشرًا للسوق، مثل أكبر شركات بلد ما أو العالم. لا تحاول اختيار الرابحين، فإدارتها رخيصة، وتقدم عائد السوق مطروحًا منه رسم صغير.</li><li><strong>الصناديق المُدارة بنشاط</strong> يعمل فيها مديرون يختارون ما يُشترى على أمل التفوق على السوق. وهي تتقاضى أكثر مقابل هذا العمل، وعلى مدى فترات طويلة لم يتفوق معظمها على المؤشر الذي تنافسه بعد احتساب رسومها الأعلى.</li></ul><p>و<strong>صندوق المؤشرات المتداول</strong> صندوق تُتداول وحداته في البورصة كأنها سهم واحد، مما يسهل شراءه وبيعه. معظم هذه الصناديق صناديق مؤشرات، لكن التسمية تصف طريقة تداول الصندوق لا ما يحتويه: انظر دائمًا إلى ما في داخله وإلى تكلفته.</p>',
    )),
    diagram({
      fig: L('Figure 2.5', 'الشكل 2.5'),
      title: L('One company or a hundred', 'شركة واحدة أم مئة'),
      src: '/diagrams/one-vs-many.svg',
      alt: L('1,000 in one company that fails is worth 0. 1,000 spread over 100 companies, one of which fails, is worth 990.', '1,000 في شركة واحدة تفلس تصبح 0. و1,000 موزعة على 100 شركة تفلس إحداها تصبح 990.'),
      caption: L('The same failure, two very different outcomes. Illustrative figures.', 'الإفلاس نفسه، ونتيجتان مختلفتان جدًا. أرقام توضيحية.'),
    }),
    box('keypoint', L('What to check in any fund', 'ما يجب التحقق منه في أي صندوق'), L(
      'What it holds and how many holdings; whether it follows an index or a manager\'s choices; its yearly fee (the expense ratio); and how much of it is in one country, one sector or one company. Two funds with similar names can hold very different things.',
      'ما يحتويه وعدد ممتلكاته؛ وهل يتبع مؤشرًا أم اختيارات مدير؛ ورسومه السنوية (نسبة المصروفات)؛ وكم منه في بلد واحد أو قطاع واحد أو شركة واحدة. صندوقان باسمين متشابهين قد يحتويان أشياء مختلفة جدًا.',
    )),
    html(L(
      '<h2>2.6 Alternatives: property, gold and crypto</h2><p>Beyond the three building blocks sit assets that many people own or hear about. Each has a real role for some investors, and each has a catch.</p><ul><li><strong>Property</strong> can pay rent and rise with prices over time. But buying a building ties up a large sum in one place, costs a lot to buy and sell, and can take months to turn back into cash. Property funds, which own many buildings and pass on most of the rent, spread the risk and trade more easily, but they still fall in bad years.</li><li><strong>Gold</strong> pays nothing while you hold it. Its price moves with fear, interest rates and currencies, and it has fallen by a quarter or more in some years. Some investors hold a little as insurance against crises, not as a source of growth.</li><li><strong>Crypto-assets</strong> have no earnings, no rent and no interest behind them; their price depends entirely on what the next buyer will pay. They have risen spectacularly and fallen by three quarters or more within months. If held at all, they belong only in the small part of a portfolio you could lose entirely.</li></ul>',
      '<h2>2.6 البدائل: العقار والذهب والعملات المشفرة</h2><p>بعيدًا عن اللبنات الثلاث توجد أصول يملكها كثير من الناس أو يسمعون عنها. لكل منها دور حقيقي لدى بعض المستثمرين، ولكل منها عيب.</p><ul><li><strong>العقار</strong> قد يدر إيجارًا ويرتفع مع الأسعار مع الوقت. لكن شراء مبنى يربط مبلغًا كبيرًا في مكان واحد، ويكلّف كثيرًا عند الشراء والبيع، وقد يستغرق أشهرًا ليعود نقدًا. أما صناديق العقار، التي تملك مباني كثيرة وتوزع معظم الإيجار، فتوزع المخاطر ويسهل تداولها، لكنها تهبط هي أيضًا في السنوات السيئة.</li><li><strong>الذهب</strong> لا يدر شيئًا أثناء الاحتفاظ به. يتحرك سعره مع الخوف وأسعار الفائدة والعملات، وقد هبط بالربع أو أكثر في بعض السنوات. يحتفظ بعض المستثمرين بقليل منه تأمينًا ضد الأزمات، لا مصدرًا للنمو.</li><li><strong>الأصول المشفرة</strong> لا تقف وراءها أرباح ولا إيجار ولا فائدة؛ يعتمد سعرها كليًا على ما سيدفعه المشتري التالي. لقد ارتفعت ارتفاعًا مذهلًا وهبطت بثلاثة أرباع أو أكثر خلال أشهر. وإن احتُفظ بها أصلًا، فمكانها فقط الجزء الصغير من المحفظة الذي يمكنك أن تخسره كله.</li></ul>',
    )),
    diagram({
      fig: L('Figure 2.6', 'الشكل 2.6'),
      title: L('A bad year for each alternative', 'عام سيئ لكل بديل'),
      src: '/diagrams/alt-falls.svg',
      alt: L('Illustrative falls in a bad year: property −20%, gold −28%, crypto −75%.', 'هبوطات توضيحية في عام سيئ: العقار −20%، والذهب −28%، والعملات المشفرة −75%.'),
      caption: L('Left to right: property, gold, crypto. Illustrative figures.', 'من اليسار إلى اليمين: العقار، الذهب، العملات المشفرة. أرقام توضيحية.'),
    }),
    table(
      [L('Asset', 'الأصل'), L('How it earns', 'كيف يكسب'), L('Main risk', 'المخاطرة الرئيسية'), L('Usual role', 'الدور المعتاد')],
      [
        [L('Shares', 'الأسهم'), L('Growth and dividends', 'النمو والتوزيعات'), L('Large falls, a company failing', 'هبوطات كبيرة، إفلاس شركة'), L('Long-term growth', 'النمو طويل الأجل')],
        [L('Bonds', 'السندات'), L('Interest', 'الفائدة'), L('Rising rates, default', 'ارتفاع الفائدة، التخلف عن السداد'), L('Stability and income', 'الاستقرار والدخل')],
        [L('Cash', 'النقد'), L('Interest', 'الفائدة'), L('Inflation', 'التضخم'), L('Safety, emergencies, the near term', 'الأمان والطوارئ والمدى القريب')],
        [L('Property', 'العقار'), L('Rent and price', 'الإيجار والسعر'), L('Cost, slow to sell, falls', 'التكلفة، بطء البيع، الهبوط'), L('Income, some inflation protection', 'دخل وبعض الحماية من التضخم')],
        [L('Gold', 'الذهب'), L('Price only', 'السعر فقط'), L('Long flat or falling spells', 'فترات طويلة من الثبات أو الهبوط'), L('A small hedge', 'تحوط صغير')],
        [L('Crypto', 'العملات المشفرة'), L('Price only', 'السعر فقط'), L('Extreme swings, total loss', 'تقلبات حادة، خسارة كاملة'), L('Speculation, if any', 'مضاربة، إن وُجدت')],
      ],
    ),
    html(L(
      '<h2>2.7 Why hold more than one</h2><p>Each building block has a weakness the others cover. Shares grow but fall hard; bonds steady the ride but grow slowly and suffer when rates rise; cash is safe but loses to inflation. Held together, they make a whole that is more comfortable to live with than any part alone. How much of each to hold is called <strong>asset allocation</strong>, and it matters more to your results than almost any individual choice of share or fund. The next chapter shows how to think about it.</p>',
      '<h2>2.7 لماذا تمتلك أكثر من نوع</h2><p>لكل لبنة أساسية ضعف تغطيه الأخرى. الأسهم تنمو لكنها تهبط بقوة؛ والسندات تهدئ الرحلة لكنها تنمو ببطء وتتضرر حين ترتفع الفائدة؛ والنقد آمن لكنه يخسر أمام التضخم. وحين تُجمع معًا تصنع كلًا أسهل في التعايش معه من أي جزء وحده. يُسمى مقدار ما تملكه من كل منها <strong>توزيع الأصول</strong>، وهو يؤثر في نتائجك أكثر من أي اختيار فردي تقريبًا لسهم أو صندوق. ويبيّن الفصل التالي كيف تفكر فيه.</p>',
    )),
    html(L(
      '<h2>Chapter summary</h2><ul><li>Shares are ownership: growth plus dividends, with the largest long-run returns and the largest falls.</li><li>Bonds are loans: known returns if held to the end, but prices fall when interest rates rise, more so for long bonds.</li><li>Cash is safe and ready but slowly loses to inflation.</li><li>Funds give many holdings in one purchase; low-cost index funds deliver the market\'s return.</li><li>Property, gold and crypto each have a catch; crypto belongs only in money you could lose entirely.</li><li>Holding several kinds, in proportions that suit your goals, is the core of a portfolio.</li></ul>',
      '<h2>خلاصة الفصل</h2><ul><li>الأسهم ملكية: نمو وتوزيعات، مع أعلى العوائد طويلة الأجل وأكبر الهبوطات.</li><li>السندات قروض: عوائد معروفة عند الاحتفاظ بها حتى النهاية، لكن أسعارها تنخفض حين ترتفع الفائدة، وأكثر في السندات الطويلة.</li><li>النقد آمن وجاهز لكنه يخسر ببطء أمام التضخم.</li><li>الصناديق تمنح ممتلكات كثيرة في عملية شراء واحدة؛ وصناديق المؤشرات منخفضة التكلفة تقدم عائد السوق.</li><li>للعقار والذهب والعملات المشفرة عيوب؛ ومكان العملات المشفرة فقط في المال الذي يمكنك خسارته كله.</li><li>امتلاك أنواع عدة، بنسب تناسب أهدافك، هو جوهر المحفظة.</li></ul>',
    )),
  ],
}
