// The book, chapter 1: how investing works. A longer, more advanced text than unit 1's lessons, read as a book: no
// characters, activities or questions. Figures are illustrations, not forecasts or advice.
import type { BookChapter } from '../../../book'
import { L, box, diagram, formula, html, table } from '../../../helpers'

export const ch1: BookChapter = {
  id: 'basics',
  title: L('How investing works', 'كيف يعمل الاستثمار'),
  summary: L(
    'Why money left alone loses ground, how growth builds on growth, what risk really means, and what to have in place before investing a single coin.',
    'لماذا يتراجع المال المتروك على حاله، وكيف يُبنى النمو على النمو، وما الذي تعنيه المخاطرة فعلًا، وما الذي يجب أن يكون جاهزًا قبل استثمار أي مبلغ.',
  ),
  blocks: [
    html(L(
      '<h2>1.1 Money that stands still</h2><p>Cash feels like the safest thing you can own. Its number never falls: 1,000 in a drawer is still 1,000 next year. But the number is not what matters. What matters is what the money can buy, and that changes every year, because prices rise. The general rise in prices is called <strong>inflation</strong>, and it is the reason saving alone is rarely enough for goals that are many years away.</p><p>At 3% inflation a year, prices double in about 24 years. Money that earned nothing over that time would buy roughly half of what it bought at the start. Nothing was lost on paper and nothing crashed; the money simply stood still while the world grew more expensive. Inflation is quiet, steady and cumulative, which is why it is easy to ignore and expensive to forget.</p>',
      '<h2>1.1 المال الذي يقف مكانه</h2><p>يبدو النقد أكثر ما يمكنك امتلاكه أمانًا. فرقمه لا يهبط أبدًا: 1,000 في الدرج تبقى 1,000 في العام القادم. لكن الرقم ليس هو المهم. المهم هو ما يستطيع المال شراءه، وهذا يتغير كل عام لأن الأسعار ترتفع. يُسمى الارتفاع العام في الأسعار <strong>التضخم</strong>، وهو السبب في أن الادخار وحده نادرًا ما يكفي لأهداف تبعد سنوات طويلة.</p><p>بتضخم 3% سنويًا تتضاعف الأسعار في نحو 24 سنة. والمال الذي لم يربح شيئًا خلال تلك المدة سيشتري قرابة نصف ما كان يشتريه في البداية. لم يُخسر شيء على الورق ولم ينهَر شيء؛ كل ما في الأمر أن المال وقف مكانه بينما صار العالم أغلى. التضخم هادئ وثابت ومتراكم، ولهذا يسهل تجاهله ويكلّف نسيانه كثيرًا.</p>',
    )),
    diagram({
      fig: L('Figure 1.1', 'الشكل 1.1'),
      title: L('What 1,000 in cash buys over time', 'ماذا تشتري 1,000 نقدًا مع مرور الوقت'),
      src: '/diagrams/inflation.svg',
      alt: L('Bar chart: 1,000 today buys what 789 buys in 8 years, 623 in 16 years and 492 in 24 years.', 'رسم بالأعمدة: 1,000 اليوم تشتري ما تشتريه 789 بعد 8 سنوات، و623 بعد 16 سنة، و492 بعد 24 سنة.'),
      caption: L('Years from now, at 3% inflation a year. Illustrative figures.', 'السنوات من الآن، بتضخم 3% سنويًا. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>1.2 Nominal and real returns</h2><p>Every return you read about is a <strong>nominal</strong> return: the change in the number. What you actually care about is the <strong>real</strong> return: the change in what the money can buy. A savings account paying 2% while prices rise 3% has a nominal return of +2% and a real return of about −1%. Your balance grows; your buying power shrinks.</p><p>For quick estimates, subtracting inflation from the nominal return is close enough. The exact relationship divides rather than subtracts, and the difference matters only when the numbers are large.</p>',
      '<h2>1.2 العائد الاسمي والعائد الحقيقي</h2><p>كل عائد تقرأ عنه هو عائد <strong>اسمي</strong>: التغير في الرقم. أما ما يهمك فعلًا فهو العائد <strong>الحقيقي</strong>: التغير في ما يستطيع المال شراءه. حساب توفير يدفع 2% بينما ترتفع الأسعار 3% عائده الاسمي +2% وعائده الحقيقي نحو −1%. يكبر رصيدك وتصغر قوته الشرائية.</p><p>للتقدير السريع يكفي طرح التضخم من العائد الاسمي. أما العلاقة الدقيقة فتقسم ولا تطرح، ولا يظهر الفرق إلا حين تكون الأرقام كبيرة.</p>',
    )),
    formula('r = (1 + n) ÷ (1 + i) − 1', L('r is the real return, n the nominal return and i inflation. Example: (1.07 ÷ 1.03) − 1 ≈ 3.9% a year. Subtracting gives 4%, close enough for most decisions.', 'حيث r العائد الحقيقي، وn العائد الاسمي، وi التضخم. مثال: (1.07 ÷ 1.03) − 1 ≈ 3.9% سنويًا. والطرح يعطي 4%، وهو قريب بما يكفي لمعظم القرارات.')),
    html(L(
      '<h2>1.3 Saving and investing are different jobs</h2><p><strong>Saving</strong> keeps money safe and available: its value hardly moves, and it is there the day you need it. <strong>Investing</strong> puts money to work in things that can grow faster than prices over the years, such as shares of companies or loans to governments and firms, and accepts that their value will rise and fall along the way.</p><p>Neither is better. They are tools for different jobs, and the deciding question is <em>when</em> the money will be needed. Money for next month\'s rent, a car repair or a deposit in two years belongs in savings, because a fall in markets could arrive exactly when you need it. Money for a goal ten or thirty years away can be invested, because it has time to recover from the falls that will certainly come.</p>',
      '<h2>1.3 الادخار والاستثمار وظيفتان مختلفتان</h2><p><strong>الادخار</strong> يحفظ المال آمنًا ومتاحًا: قيمته بالكاد تتحرك، وهو موجود يوم تحتاجه. و<strong>الاستثمار</strong> يُشغّل المال في أشياء يمكن أن تنمو أسرع من الأسعار على مر السنين، مثل أسهم الشركات أو القروض للحكومات والشركات، ويقبل أن ترتفع قيمتها وتنخفض على الطريق.</p><p>لا أحدهما أفضل من الآخر. إنهما أداتان لوظيفتين مختلفتين، والسؤال الحاسم هو <em>متى</em> ستحتاج المال. مال إيجار الشهر القادم أو إصلاح السيارة أو دفعة أولى بعد سنتين مكانه الادخار، لأن هبوط الأسواق قد يأتي تمامًا حين تحتاجه. أما مال هدف يبعد عشر سنوات أو ثلاثين فيمكن استثماره، لأن لديه وقتًا ليتعافى من الهبوطات التي ستأتي حتمًا.</p>',
    )),
    table(
      [L('When you need the money', 'متى تحتاج المال'), L('Usually suits', 'يناسبه عادة'), L('Why', 'لماذا')],
      [
        [L('Within about 3 years', 'خلال نحو 3 سنوات'), L('Savings, short-term deposits', 'التوفير والودائع قصيرة الأجل'), L('No time to recover from a fall', 'لا وقت للتعافي من الهبوط')],
        [L('About 3 to 10 years', 'من 3 إلى 10 سنوات تقريبًا'), L('A cautious mix of bonds and shares', 'مزيج حذر من السندات والأسهم'), L('Some growth, smaller swings', 'بعض النمو مع تقلبات أصغر')],
        [L('10 years or more', '10 سنوات أو أكثر'), L('Mostly shares, widely spread', 'أسهم في الغالب، موزعة على نطاق واسع'), L('Time to ride out the ups and downs', 'وقت لتجاوز الصعود والهبوط')],
      ],
    ),
    html(L(
      '<h2>1.4 Compounding: growth on growth</h2><p>When an investment earns a return and the return is left in, the next year\'s return is earned on a bigger amount. That is <strong>compounding</strong>, and it is the most powerful force in long-term investing. It looks unimpressive at first and dramatic later: 1,000 earning 7% a year becomes about 1,967 after 10 years, 3,870 after 20 and 7,612 after 30. The first decade adds less than 1,000; the third adds almost 3,750, with nothing new put in.</p><p>The shape of that curve explains the most common advice in investing: start early. The years at the end of the curve do the heavy lifting, and you only reach them by starting at the beginning.</p>',
      '<h2>1.4 الفائدة المركبة: نمو على النمو</h2><p>حين يحقق الاستثمار عائدًا ويبقى العائد فيه، يُحسب عائد العام التالي على مبلغ أكبر. هذه هي <strong>الفائدة المركبة</strong>، وهي أقوى قوة في الاستثمار طويل الأجل. تبدو متواضعة في البداية ومذهلة لاحقًا: 1,000 تربح 7% سنويًا تصبح نحو 1,967 بعد 10 سنوات، و3,870 بعد 20، و7,612 بعد 30. العقد الأول يضيف أقل من 1,000، والثالث يضيف قرابة 3,750، دون إضافة أي مبلغ جديد.</p><p>شكل هذا المنحنى يفسّر أكثر نصيحة شيوعًا في الاستثمار: ابدأ مبكرًا. السنوات في آخر المنحنى هي التي تقوم بالعمل الثقيل، ولا تصل إليها إلا إذا بدأت من أوله.</p>',
    )),
    diagram({
      fig: L('Figure 1.2', 'الشكل 1.2'),
      title: L('1,000 growing at 7% a year', '1,000 تنمو بنسبة 7% سنويًا'),
      src: '/diagrams/compounding.svg',
      alt: L('Bars at 0, 10, 20 and 30 years: 1,000, 1,967, 3,870 and 7,612. The part above 1,000 is growth.', 'أعمدة عند 0 و10 و20 و30 سنة: 1,000 و1,967 و3,870 و7,612. الجزء فوق 1,000 هو النمو.'),
      caption: L('Nothing is added after the first 1,000. Illustrative figures, not a forecast.', 'لا يُضاف شيء بعد الـ1,000 الأولى. أرقام توضيحية وليست توقعًا.'),
    }),
    formula('FV = P × (1 + r) ^ t', L('FV is the future value, P the amount put in, r the yearly return and t the number of years. Example: 1,000 × 1.07 ^ 30 ≈ 7,612.', 'حيث FV القيمة المستقبلية، وP المبلغ المستثمر، وr العائد السنوي، وt عدد السنوات. مثال: 1,000 × 1.07 ^ 30 ≈ 7,612.')),
    html(L(
      '<p>Regular saving compounds too, and it is how most people actually invest. Putting 200 a month into an investment earning 7% a year adds up to about 244,000 after 30 years, of which 72,000 is money put in and the rest is growth. Starting ten years later and saving the same 200 a month for 20 years gives about 104,000. Waiting a decade costs far more than the 24,000 of missing contributions, because it removes the years in which growth is largest.</p><p>A handy shortcut is the <strong>rule of 72</strong>: divide 72 by the yearly return to estimate how many years money takes to double. At 6% it is about 12 years; at 9%, about 8. The same rule works for inflation: at 3%, prices double in about 24 years.</p>',
      '<p>الادخار المنتظم يتضاعف بالطريقة نفسها، وهو الطريقة التي يستثمر بها معظم الناس فعلًا. وضع 200 شهريًا في استثمار يربح 7% سنويًا يصل إلى نحو 244,000 بعد 30 سنة، منها 72,000 مال مدفوع والباقي نمو. والبدء بعد عشر سنوات مع ادخار الـ200 نفسها شهريًا لمدة 20 سنة يعطي نحو 104,000. تأجيل عقد واحد يكلّف أكثر بكثير من الـ24,000 من الدفعات الفائتة، لأنه يحذف السنوات التي يكون فيها النمو في أكبره.</p><p>ومن الاختصارات المفيدة <strong>قاعدة 72</strong>: اقسم 72 على العائد السنوي لتقدير عدد السنوات التي يحتاجها المال ليتضاعف. عند 6% تكون نحو 12 سنة، وعند 9% نحو 8. والقاعدة نفسها تصلح للتضخم: عند 3% تتضاعف الأسعار في نحو 24 سنة.</p>',
    )),
    table(
      [L('Monthly saving at 7% a year', 'ادخار شهري بعائد 7% سنويًا'), L('Put in', 'المبلغ المدفوع'), L('Worth at the end', 'القيمة في النهاية')],
      [
        [L('200 a month for 30 years', '200 شهريًا لمدة 30 سنة'), L('72,000', '72,000'), L('≈ 244,000', '≈ 244,000')],
        [L('200 a month for 20 years', '200 شهريًا لمدة 20 سنة'), L('48,000', '48,000'), L('≈ 104,000', '≈ 104,000')],
        [L('400 a month for 15 years', '400 شهريًا لمدة 15 سنة'), L('72,000', '72,000'), L('≈ 127,000', '≈ 127,000')],
      ],
    ),
    box('keypoint', L('Time beats amount', 'الوقت يتفوق على المبلغ'), L(
      'The last row puts in the same 72,000 as the first, twice as fast, and ends with about half as much. With compounding, the years matter more than the size of each payment. Illustrative figures.',
      'الصف الأخير يدفع الـ72,000 نفسها التي يدفعها الأول، بضعف السرعة، وينتهي بنحو النصف. مع الفائدة المركبة، السنوات أهم من حجم كل دفعة. أرقام توضيحية.',
    )),
    html(L(
      '<h2>1.5 What risk really means</h2><p>In everyday speech, risk means danger. In investing it means something more precise: <strong>uncertainty about the outcome</strong>, including the chance of ending with less than you put in. A savings account is low-risk not because it pays well but because you know almost exactly what you will have. Shares are higher-risk because next year could bring +30% or −30%, and nobody knows which.</p><p>Investors are paid for accepting that uncertainty. Over long periods, investments with bigger swings have tended to earn more, because people demand a reward, a <strong>risk premium</strong>, for holding something that can fall. That reward is a tendency, not a promise: in any one year, or even one decade, the riskier investment can do worse.</p>',
      '<h2>1.5 ما الذي تعنيه المخاطرة فعلًا</h2><p>في الكلام اليومي تعني المخاطرة الخطر. أما في الاستثمار فتعني شيئًا أدق: <strong>عدم اليقين بشأن النتيجة</strong>، بما في ذلك احتمال أن ينتهي بك الأمر بأقل مما وضعت. حساب التوفير منخفض المخاطر لا لأنه يدفع جيدًا بل لأنك تعرف تقريبًا ما سيكون لديك. والأسهم أعلى مخاطرة لأن العام القادم قد يحمل +30% أو −30% ولا أحد يعرف أيهما.</p><p>يحصل المستثمرون على مقابل لقبولهم عدم اليقين هذا. فعلى مدى فترات طويلة، مالت الاستثمارات ذات التقلبات الأكبر إلى ربح أكثر، لأن الناس يطلبون مكافأة، هي <strong>علاوة المخاطرة</strong>، مقابل الاحتفاظ بشيء قد يهبط. هذه المكافأة ميل وليست وعدًا: في أي عام واحد، أو حتى عقد واحد، قد يكون أداء الاستثمار الأكثر مخاطرة أسوأ.</p>',
    )),
    diagram({
      fig: L('Figure 1.3', 'الشكل 1.3'),
      title: L('A range of yearly results', 'نطاق النتائج السنوية'),
      src: '/diagrams/risk-return.svg',
      alt: L('Three ranges from worst year to best year: cash from 0% to +5%, bonds from −10% to +15%, shares from −40% to +50%.', 'ثلاثة نطاقات من أسوأ عام إلى أفضل عام: النقد من 0% إلى +5%، والسندات من −10% إلى +15%، والأسهم من −40% إلى +50%.'),
      caption: L('Left to right: cash, bonds, shares. Illustrative ranges, not forecasts.', 'من اليسار إلى اليمين: النقد، السندات، الأسهم. نطاقات توضيحية وليست توقعات.'),
    }),
    html(L(
      '<p>Professionals measure this swing as <strong>volatility</strong>, usually the standard deviation of yearly returns. You do not need the formula to use the idea. Two questions do most of the work. First, how far could this fall in a bad year? Broad share markets have fallen by a third or more several times in living memory. Second, could you hold on through that fall without selling? An investment you abandon at the bottom is riskier for you than its numbers suggest, because selling turns a temporary fall into a permanent loss.</p><p>Time changes the picture. Over one year, shares lose money fairly often. Over fifteen or twenty years, broad and widely spread share investments have historically lost money far less often, because good years have had time to outweigh bad ones. That history is encouraging, not guaranteed, and it is the main reason the time until you need the money decides how much risk makes sense.</p>',
      '<p>يقيس المحترفون هذا التأرجح باسم <strong>التقلب</strong>، وعادةً بالانحراف المعياري للعوائد السنوية. لا تحتاج إلى المعادلة لتستخدم الفكرة. سؤالان يقومان بمعظم العمل. أولًا: إلى أي حد قد يهبط هذا في عام سيئ؟ لقد هبطت أسواق الأسهم الواسعة بالثلث أو أكثر عدة مرات خلال ما يتذكره الناس. ثانيًا: هل تستطيع التمسك به خلال ذلك الهبوط دون أن تبيع؟ الاستثمار الذي تتخلى عنه في القاع أخطر عليك مما توحي به أرقامه، لأن البيع يحوّل الهبوط المؤقت إلى خسارة دائمة.</p><p>الوقت يغيّر الصورة. على مدى عام واحد تخسر الأسهم المال بشكل متكرر نسبيًا. أما على مدى خمس عشرة أو عشرين سنة فقد خسرت الاستثمارات الواسعة والموزعة في الأسهم المال تاريخيًا بشكل أقل بكثير، لأن السنوات الجيدة كان لديها وقت لتتغلب على السيئة. هذا التاريخ مشجع وليس مضمونًا، وهو السبب الرئيسي في أن الوقت المتبقي حتى تحتاج المال هو الذي يحدد مقدار المخاطرة المعقول.</p>',
    )),
    box('mistake', L('A warning sign', 'علامة تحذير'), L(
      'High returns and no risk do not come together. Anyone who promises a high return that is also guaranteed, such as 20% or 30% a year, is almost certainly describing a scam.',
      'العوائد المرتفعة وانعدام المخاطرة لا يجتمعان. أي شخص يعد بعائد مرتفع ومضمون في الوقت نفسه، مثل 20% أو 30% سنويًا، يصف على الأرجح احتيالًا.',
    )),
    html(L(
      '<h2>1.6 Costs compound too</h2><p>Compounding works on costs exactly as it works on returns, only against you. A yearly fee of 1% sounds small. On 100,000 invested for 30 years at 6% a year before fees, a fund charging 0.1% a year ends at about 558,000; one charging 1% ends at about 432,000. The difference, about 126,000, is more than the whole starting amount, lost to a number that looked like a rounding error.</p><p>Costs are one of the few things in investing you control completely. Returns are uncertain; fees are certain. That is why low-cost, broadly spread funds are such a common starting point.</p>',
      '<h2>1.6 التكاليف تتضاعف أيضًا</h2><p>تعمل الفائدة المركبة على التكاليف تمامًا كما تعمل على العوائد، لكن ضدك. رسوم سنوية بنسبة 1% تبدو صغيرة. على 100,000 مستثمرة لمدة 30 سنة بعائد 6% سنويًا قبل الرسوم، ينتهي صندوق يتقاضى 0.1% سنويًا عند نحو 558,000، وآخر يتقاضى 1% عند نحو 432,000. الفرق، نحو 126,000، أكبر من المبلغ الأصلي كله، ضاع بسبب رقم بدا كأنه خطأ تقريب.</p><p>التكاليف من الأشياء القليلة في الاستثمار التي تتحكم بها بالكامل. العوائد غير مؤكدة، أما الرسوم فمؤكدة. لهذا تُعد الصناديق منخفضة التكلفة والموزعة على نطاق واسع نقطة بداية شائعة جدًا.</p>',
    )),
    diagram({
      fig: L('Figure 1.4', 'الشكل 1.4'),
      title: L('The same 100,000 with two yearly fees', 'المبلغ نفسه 100,000 برسوم سنوية مختلفة'),
      src: '/diagrams/fees.svg',
      alt: L('Two lines over 30 years from 100,000: with a 0.1% fee it reaches 558,000, with a 1% fee 432,000, a gap of 126,000.', 'خطان على مدى 30 سنة من 100,000: برسوم 0.1% يصل إلى 558,000، وبرسوم 1% إلى 432,000، بفارق 126,000.'),
      caption: L('6% a year before fees. Illustrative figures.', '6% سنويًا قبل الرسوم. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>1.7 Before you invest</h2><p>Investing works best on a solid base. Four things usually come first, in roughly this order.</p><ol><li><strong>An emergency fund.</strong> A common guide is three to six months of essential costs in an easy-to-reach savings account. It means a job loss or a broken car never forces you to sell investments at a bad moment.</li><li><strong>High-interest debt paid off.</strong> Paying off a credit card that charges 20% is a guaranteed 20% saving, far better than the roughly 7% a year shares have averaged over long periods with no guarantee.</li><li><strong>Clear goals with dates.</strong> Each goal, and its date, decides how its money should be invested. "Retirement in 30 years" and "a car in 2 years" need different homes.</li><li><strong>An honest view of risk.</strong> Ask both how much fall you could stomach without selling, your tolerance, and how much your life could absorb, your capacity. The lower of the two is the one to plan with.</li></ol>',
      '<h2>1.7 قبل أن تستثمر</h2><p>يعمل الاستثمار على أفضل وجه فوق أساس متين. عادةً تأتي أربعة أمور أولًا، وبهذا الترتيب تقريبًا.</p><ol><li><strong>صندوق طوارئ.</strong> من الإرشادات الشائعة ادخار تكاليف أساسية لمدة من ثلاثة إلى ستة أشهر في حساب توفير سهل الوصول. وهذا يعني أن فقدان العمل أو تعطل السيارة لن يجبرك أبدًا على بيع استثماراتك في لحظة سيئة.</li><li><strong>سداد الديون ذات الفائدة المرتفعة.</strong> سداد بطاقة ائتمان تتقاضى 20% توفير مضمون بنسبة 20%، وهو أفضل بكثير من نحو 7% سنويًا كان متوسط الأسهم على فترات طويلة دون أي ضمان.</li><li><strong>أهداف واضحة بمواعيد.</strong> كل هدف وموعده يحددان كيف يُستثمر ماله. «التقاعد بعد 30 سنة» و«سيارة بعد سنتين» يحتاجان إلى مكانين مختلفين.</li><li><strong>نظرة صادقة إلى المخاطرة.</strong> اسأل عن مقدار الهبوط الذي تحتمله دون أن تبيع، أي تحمّلك، وعن مقدار ما تستطيع حياتك استيعابه، أي قدرتك. والأقل بينهما هو الذي تُبنى عليه الخطة.</li></ol>',
    )),
    diagram({
      fig: L('Figure 1.5', 'الشكل 1.5'),
      title: L('A sure saving against an uncertain return', 'توفير مؤكد مقابل عائد غير مؤكد'),
      src: '/diagrams/debt-vs-invest.svg',
      alt: L('Two bars: 20% for the interest saved by paying off a card, and about 7% for a long-run stock market average.', 'عمودان: 20% للفائدة الموفَّرة بسداد البطاقة، ونحو 7% لمتوسط سوق الأسهم على المدى الطويل.'),
      caption: L('Left: interest saved, for certain. Right: a long-run average, not guaranteed. Illustrative figures.', 'اليسار: فائدة موفَّرة، مؤكدة. اليمين: متوسط طويل الأجل، غير مضمون. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>Chapter summary</h2><ul><li>Inflation erodes money that stands still; judge returns in real terms.</li><li>Saving and investing do different jobs; the date you need the money decides which.</li><li>Compounding rewards time far more than the size of each payment.</li><li>Risk is uncertainty, including the chance of loss; it is paid for over long periods, never guaranteed.</li><li>Costs compound against you, and they are the part you control.</li><li>An emergency fund, no high-interest debt, clear goals and an honest view of risk come before investing.</li></ul>',
      '<h2>خلاصة الفصل</h2><ul><li>التضخم يأكل المال الذي يقف مكانه؛ احكم على العوائد بقيمتها الحقيقية.</li><li>الادخار والاستثمار يؤديان وظيفتين مختلفتين، وموعد حاجتك إلى المال يحدد أيهما.</li><li>الفائدة المركبة تكافئ الوقت أكثر بكثير من حجم كل دفعة.</li><li>المخاطرة هي عدم اليقين، بما في ذلك احتمال الخسارة؛ يُدفع مقابلها على المدى الطويل ولا تُضمن أبدًا.</li><li>التكاليف تتضاعف ضدك، وهي الجزء الذي تتحكم به.</li><li>صندوق الطوارئ، وغياب الديون ذات الفائدة المرتفعة، والأهداف الواضحة، والنظرة الصادقة إلى المخاطرة تأتي قبل الاستثمار.</li></ul>',
    )),
  ],
}
