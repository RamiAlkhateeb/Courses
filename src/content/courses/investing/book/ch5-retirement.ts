// The book, chapter 5: retirement and tax-advantaged accounts. Longer and more advanced than unit 5's lessons; no
// characters or questions. Rules differ by country; figures are illustrations, not forecasts, tax or legal advice.
import type { BookChapter } from '../../../book'
import { L, box, diagram, formula, html, table } from '../../../helpers'

export const ch5: BookChapter = {
  id: 'retirement',
  title: L('Retirement and tax-advantaged accounts', 'التقاعد والحسابات ذات المزايا الضريبية'),
  summary: L(
    'The longest goal most people ever save for: why starting early matters so much, the help that workplaces and tax rules can give, how much is enough, and how to make savings last once the salary stops.',
    'أطول هدف يدخر له معظم الناس: لماذا يهم البدء المبكر إلى هذا الحد، والمساعدة التي يمكن أن تقدمها أماكن العمل والقواعد الضريبية، وكم يكفي، وكيف تجعل المدخرات تدوم بعد توقف الراتب.',
  ),
  blocks: [
    html(L(
      '<h2>5.1 The goal that rewards an early start most</h2><p>Retirement is usually the furthest goal in a working life, often 30 or 40 years away, which makes it the one where compounding does the most work. Saving 200 a month at 7% a year from age 25 to 65 builds about 525,000, of which 96,000 is money put in. Starting the same plan at 35 builds about 244,000 from 72,000. The extra ten years cost only 24,000 in contributions and add roughly 280,000 at the end.</p><p>For someone starting later, the lesson is not that it is too late, but that the same result needs larger contributions. Every year of delay raises the monthly amount required to reach the same goal.</p>',
      '<h2>5.1 الهدف الذي يكافئ البدء المبكر أكثر من غيره</h2><p>التقاعد هو عادةً أبعد هدف في الحياة العملية، وكثيرًا ما يبعد 30 أو 40 سنة، مما يجعله الهدف الذي تقوم فيه الفائدة المركبة بأكبر عمل. ادخار 200 شهريًا بعائد 7% سنويًا من سن 25 إلى 65 يبني نحو 525,000، منها 96,000 مال مدفوع. وبدء الخطة نفسها في سن 35 يبني نحو 244,000 من 72,000. السنوات العشر الإضافية لا تكلّف إلا 24,000 من الدفعات وتضيف قرابة 280,000 في النهاية.</p><p>أما من يبدأ متأخرًا فالدرس ليس أن الأوان قد فات، بل أن النتيجة نفسها تحتاج دفعات أكبر. فكل سنة تأخير ترفع المبلغ الشهري المطلوب لبلوغ الهدف نفسه.</p>',
    )),
    diagram({
      fig: L('Figure 5.1', 'الشكل 5.1'),
      title: L('200 a month until 65, starting at 25 or 35', '200 شهريًا حتى سن 65، بدءًا من 25 أو 35'),
      src: '/diagrams/retirement-start.svg',
      alt: L('Starting at 25: about 525,000 at 65 from 96,000 put in. Starting at 35: about 244,000 from 72,000.', 'البدء في سن 25: نحو 525,000 في سن 65 من 96,000 مدفوعة. والبدء في سن 35: نحو 244,000 من 72,000.'),
      caption: L('Dark: money put in. Light: growth. 7% a year. Illustrative figures.', 'الداكن: المال المدفوع. الفاتح: النمو. 7% سنويًا. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>5.2 Workplace plans and employer contributions</h2><p>In many countries, employers offer retirement plans that take a share of salary straight into investments before it reaches your account. Some also add money of their own, often by <strong>matching</strong> part of what you put in. If you save 6% of a 30,000 salary, 1,800 a year, and your employer matches half, they add 900: an immediate 50% return on your 1,800 before any investment growth.</p><p>Where a match exists, saving at least enough to receive all of it is one of the few near-certain gains in personal finance. Leaving it unclaimed is turning down part of your pay.</p>',
      '<h2>5.2 خطط مكان العمل ومساهمات صاحب العمل</h2><p>في كثير من البلدان يقدم أصحاب العمل خطط تقاعد تقتطع حصة من الراتب وتضعها مباشرة في استثمارات قبل أن تصل إلى حسابك. ويضيف بعضهم أيضًا مالًا من عندهم، كثيرًا ما يكون <strong>بمطابقة</strong> جزء مما تدفعه. فإذا ادخرت 6% من راتب قدره 30,000، أي 1,800 سنويًا، وطابق صاحب العمل النصف، فإنه يضيف 900: عائد فوري بنسبة 50% على الـ1,800 قبل أي نمو استثماري.</p><p>وحيث توجد المطابقة، يكون ادخار ما يكفي على الأقل لتحصيلها كلها من المكاسب القليلة شبه المؤكدة في التمويل الشخصي. وتركها دون مطالبة يعني رفض جزء من أجرك.</p>',
    )),
    diagram({
      fig: L('Figure 5.2', 'الشكل 5.2'),
      title: L('An employer match', 'مطابقة صاحب العمل'),
      src: '/diagrams/match.svg',
      alt: L('6% of a 30,000 salary is 1,800; an employer matching half adds 900, making 2,700 a year.', '6% من راتب قدره 30,000 تساوي 1,800؛ وصاحب عمل يطابق النصف يضيف 900، فيصبح المجموع 2,700 سنويًا.'),
      caption: L('Rules differ by employer and country. Illustrative figures.', 'تختلف القواعد حسب صاحب العمل والبلد. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>5.3 Tax-advantaged accounts</h2><p>Many governments encourage retirement saving with special accounts in which investments grow with less tax. The details differ widely from country to country, but they usually take one of two shapes: you pay no tax on the money going in and pay it when you take money out, or you pay tax on the way in and nothing on the way out. In both, the growth in between is not taxed year by year.</p><p>That untaxed growth compounds. 10,000 growing at 6% a year for 30 years reaches about 57,400 if nothing is taxed along the way. If 20% of each year\'s growth is taxed, it effectively grows at 4.8% and reaches about 40,800. The difference, about 16,600, is the value of the shelter.</p>',
      '<h2>5.3 الحسابات ذات المزايا الضريبية</h2><p>تشجع حكومات كثيرة الادخار للتقاعد بحسابات خاصة تنمو فيها الاستثمارات بضرائب أقل. تختلف التفاصيل كثيرًا من بلد إلى آخر، لكنها تأخذ عادةً أحد شكلين: لا تدفع ضريبة على المال الداخل وتدفعها عند السحب، أو تدفع الضريبة عند الدخول ولا شيء عند الخروج. وفي الحالتين لا يُفرض ضريبة على النمو في ما بينهما عامًا بعد عام.</p><p>وهذا النمو المعفى يتضاعف. 10,000 تنمو بنسبة 6% سنويًا لمدة 30 سنة تصل إلى نحو 57,400 إذا لم يُفرض أي ضريبة على الطريق. وإذا فُرضت ضريبة بنسبة 20% على نمو كل عام، فإنها تنمو فعليًا بنسبة 4.8% وتصل إلى نحو 40,800. الفرق، نحو 16,600، هو قيمة الحماية الضريبية.</p>',
    )),
    diagram({
      fig: L('Figure 5.3', 'الشكل 5.3'),
      title: L('Growth with and without yearly tax', 'النمو مع ضريبة سنوية ومن دونها'),
      src: '/diagrams/retirement-tax.svg',
      alt: L('10,000 over 30 years at 6%: untaxed while invested it reaches 57,400; with 20% tax on each year\'s growth, 40,800, a gap of 16,600.', '10,000 على مدى 30 سنة بنسبة 6%: دون ضريبة أثناء الاستثمار تصل إلى 57,400، ومع ضريبة 20% على نمو كل عام تصل إلى 40,800، بفارق 16,600.'),
      caption: L('Tax rules differ by country. Illustrative figures.', 'تختلف القواعد الضريبية حسب البلد. أرقام توضيحية.'),
    }),
    html(L(
      '<p>The price of the tax break is usually access: money in these accounts is meant to stay there until retirement, and taking it out early can bring penalties or lost benefits. Worse, it loses the growth it would have had. 10,000 taken out at 35 is 10,000; left to grow at 7% a year until 65, it would be about 76,000. That is why an emergency fund outside the retirement account matters: it keeps the long-term money long-term.</p>',
      '<p>ثمن الميزة الضريبية عادةً هو إمكانية الوصول: فالمال في هذه الحسابات يُفترض أن يبقى فيها حتى التقاعد، وسحبه مبكرًا قد يجلب غرامات أو خسارة مزايا. والأسوأ أنه يخسر النمو الذي كان سيحققه. 10,000 تُسحب في سن 35 هي 10,000؛ ولو تُركت تنمو بنسبة 7% سنويًا حتى سن 65 لصارت نحو 76,000. ولهذا يهم وجود صندوق طوارئ خارج حساب التقاعد: فهو يُبقي المال طويل الأجل طويل الأجل.</p>',
    )),
    diagram({
      fig: L('Figure 5.4', 'الشكل 5.4'),
      title: L('The cost of taking money out early', 'تكلفة السحب المبكر'),
      src: '/diagrams/early-withdraw.svg',
      alt: L('10,000 taken out at 35, or left to grow at 7% a year to about 76,000 at 65.', '10,000 تُسحب في سن 35، أو تُترك تنمو بنسبة 7% سنويًا إلى نحو 76,000 في سن 65.'),
      caption: L('Before any penalties or tax. Illustrative figures.', 'قبل أي غرامات أو ضرائب. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>5.4 How much is enough?</h2><p>A common starting point is to save around 10% to 15% of income for retirement, counting any employer contribution, from the start of a working life. Starting later calls for more. A second rough guide looks at the end point: many plans aim for savings of about 25 times the yearly amount you will need from them, beyond any state or workplace pension.</p><p>That second guide comes from a common rule of thumb for spending in retirement: withdrawing about 4% of the starting balance in the first year, then the same amount adjusted for inflation each year after, has historically lasted around 30 years in many markets. It is a guide drawn from past markets, not a promise, and many planners now suggest spending flexibly: a little less after bad years, a little more after good ones.</p>',
      '<h2>5.4 كم يكفي؟</h2><p>من نقاط البداية الشائعة ادخار نحو 10% إلى 15% من الدخل للتقاعد، مع احتساب أي مساهمة من صاحب العمل، منذ بداية الحياة العملية. والبدء المتأخر يتطلب أكثر. وهناك إرشاد تقريبي ثانٍ ينظر إلى نقطة النهاية: تستهدف خطط كثيرة مدخرات تعادل نحو 25 ضعف المبلغ السنوي الذي ستحتاجه منها، فوق أي معاش حكومي أو من مكان العمل.</p><p>يأتي هذا الإرشاد الثاني من قاعدة تقريبية شائعة للإنفاق في التقاعد: سحب نحو 4% من الرصيد الأولي في العام الأول، ثم المبلغ نفسه معدلًا وفق التضخم كل عام بعده، استمر تاريخيًا نحو 30 سنة في أسواق كثيرة. إنه إرشاد مستمد من أسواق الماضي وليس وعدًا، ويقترح كثير من المخططين اليوم إنفاقًا مرنًا: أقل قليلًا بعد السنوات السيئة، وأكثر قليلًا بعد الجيدة.</p>',
    )),
    formula('savings target ≈ 25 × the yearly amount needed from savings', L('Needing 20,000 a year from savings suggests a target of about 500,000; 4% of 500,000 is 20,000. A rule of thumb, not a guarantee.', 'الحاجة إلى 20,000 سنويًا من المدخرات تشير إلى هدف قدره نحو 500,000؛ و4% من 500,000 تساوي 20,000. قاعدة تقريبية وليست ضمانًا.')),
    html(L(
      '<h2>5.5 Target-date funds and the glide path</h2><p>As retirement approaches, the risk in a portfolio matters more: a large fall just before the money is needed leaves little time to recover. Many investors therefore move gradually from shares towards bonds and cash as the date nears. This planned shift is called a <strong>glide path</strong>. One example: about 90% in shares with 40 years to go, 75% with 20 years, 60% with 10 years and around 40% at the target date.</p><p><strong>Target-date funds</strong> do this automatically. You choose the fund named for the year you expect to retire, and it holds a broad mix that becomes more cautious each year. They are simple, which is their strength; their weakness is that every holder of the same date gets the same mix, whatever their other savings or their comfort with risk. Check the fees, which vary widely.</p>',
      '<h2>5.5 صناديق تاريخ الهدف ومسار الانزلاق</h2><p>مع اقتراب التقاعد تزداد أهمية المخاطرة في المحفظة: فالهبوط الكبير قبل الحاجة إلى المال مباشرة لا يترك وقتًا كافيًا للتعافي. لذلك ينتقل كثير من المستثمرين تدريجيًا من الأسهم نحو السندات والنقد مع اقتراب الموعد. يُسمى هذا التحول المخطط <strong>مسار الانزلاق</strong>. مثال على ذلك: نحو 90% في الأسهم حين يتبقى 40 سنة، و75% حين يتبقى 20 سنة، و60% حين يتبقى 10 سنوات، ونحو 40% في التاريخ المستهدف.</p><p>و<strong>صناديق تاريخ الهدف</strong> تفعل ذلك تلقائيًا. تختار الصندوق المسمى بالسنة التي تتوقع أن تتقاعد فيها، فيحمل مزيجًا واسعًا يصبح أكثر حذرًا كل عام. بساطتها هي قوتها؛ وضعفها أن كل من يختار التاريخ نفسه يحصل على المزيج نفسه، مهما كانت مدخراته الأخرى أو مدى ارتياحه للمخاطرة. تحقق من الرسوم، فهي تتفاوت كثيرًا.</p>',
    )),
    diagram({
      fig: L('Figure 5.5', 'الشكل 5.5'),
      title: L('A glide path', 'مسار انزلاق'),
      src: '/diagrams/glide.svg',
      alt: L('The share of shares falls from 90% with 40 years to go, to 75% at 20 years, 60% at 10 and 40% at the target date.', 'تنخفض حصة الأسهم من 90% حين يتبقى 40 سنة، إلى 75% عند 20 سنة، و60% عند 10، و40% في التاريخ المستهدف.'),
      caption: L('Years until the target date along the bottom. One illustrative path.', 'السنوات المتبقية حتى التاريخ المستهدف في الأسفل. مسار توضيحي واحد.'),
    }),
    html(L(
      '<h2>5.6 Making it last</h2><p>Retirement can last 25 or 30 years, and prices keep rising throughout. A year of spending that costs 20,000 at 65 costs about 26,900 at 75 and about 40,700 at 89 at 3% inflation. That is why a retirement portfolio usually keeps a meaningful share in growth assets even after the salary stops: money spent in the second half of retirement may stay invested for twenty years or more.</p><p>The other risk is <strong>sequence of returns</strong>: a big market fall early in retirement, while withdrawals are being taken, does more damage than the same fall later, because selling at low prices to fund spending leaves less to recover. Keeping one or two years of spending in cash or short-term bonds lets a retiree avoid selling shares during a slump.</p>',
      '<h2>5.6 جعل المدخرات تدوم</h2><p>قد يستمر التقاعد 25 أو 30 سنة، وتستمر الأسعار في الارتفاع طوالها. عام من الإنفاق يكلّف 20,000 في سن 65 يكلّف نحو 26,900 في سن 75 ونحو 40,700 في سن 89 بتضخم 3%. لهذا تحتفظ محفظة التقاعد عادةً بحصة معتبرة في أصول النمو حتى بعد توقف الراتب: فالمال الذي يُنفق في النصف الثاني من التقاعد قد يبقى مستثمرًا عشرين سنة أو أكثر.</p><p>والخطر الآخر هو <strong>تسلسل العوائد</strong>: الهبوط الكبير في السوق في بداية التقاعد، أثناء السحب، يُحدث ضررًا أكبر من الهبوط نفسه لاحقًا، لأن البيع بأسعار منخفضة لتمويل الإنفاق يترك أقل مما يمكنه التعافي. والاحتفاظ بإنفاق سنة أو سنتين نقدًا أو في سندات قصيرة الأجل يتيح للمتقاعد تجنب بيع الأسهم خلال الركود.</p>',
    )),
    diagram({
      fig: L('Figure 5.6', 'الشكل 5.6'),
      title: L('The same year of spending, later in retirement', 'عام الإنفاق نفسه في مرحلة لاحقة من التقاعد'),
      src: '/diagrams/drawdown.svg',
      alt: L('A year of spending costs 20,000 at 65, about 26,900 at 75 and about 40,700 at 89.', 'عام من الإنفاق يكلّف 20,000 في سن 65، ونحو 26,900 في سن 75، ونحو 40,700 في سن 89.'),
      caption: L('Age along the bottom, at 3% inflation a year. Illustrative figures.', 'العمر في الأسفل، بتضخم 3% سنويًا. أرقام توضيحية.'),
    }),
    table(
      [L('Stage', 'المرحلة'), L('Main job', 'المهمة الرئيسية'), L('Typical focus', 'التركيز المعتاد')],
      [
        [L('Early career', 'بداية المسار المهني'), L('Start, and claim any match', 'البدء والمطالبة بأي مطابقة'), L('Mostly shares; automate contributions', 'أسهم في الغالب؛ دفعات تلقائية')],
        [L('Mid career', 'منتصف المسار المهني'), L('Raise the saving rate with pay rises', 'رفع نسبة الادخار مع زيادات الأجر'), L('A broad mix; rebalance yearly', 'مزيج واسع؛ إعادة توازن سنوية')],
        [L('Last ten years', 'السنوات العشر الأخيرة'), L('Reduce the risk of a late fall', 'تقليل خطر هبوط متأخر'), L('More bonds and cash, gradually', 'مزيد من السندات والنقد تدريجيًا')],
        [L('In retirement', 'أثناء التقاعد'), L('Make it last, keep pace with prices', 'جعل المال يدوم ومجاراة الأسعار'), L('A cash buffer plus some growth assets', 'احتياطي نقدي مع بعض أصول النمو')],
      ],
    ),
    box('mistake', L('Rules vary', 'القواعد تختلف'), L(
      'Retirement accounts, employer plans, tax treatment and state pensions differ greatly between countries and change over time. Use this chapter to understand the ideas, then check the rules that apply to you, ideally with a licensed adviser.',
      'تختلف حسابات التقاعد وخطط أصحاب العمل والمعاملة الضريبية والمعاشات الحكومية كثيرًا بين البلدان وتتغير مع الوقت. استخدم هذا الفصل لفهم الأفكار، ثم تحقق من القواعد التي تنطبق عليك، ويُفضّل مع مستشار مرخّص.',
    )),
    html(L(
      '<h2>5.7 The cost of waiting, in monthly terms</h2><p>Section 5.1 showed what an early start adds. The same idea looks sharper the other way round: how much must be saved each month to reach the same target from different starting ages? Take a target of 500,000 by 65, enough for about 20,000 a year under the rule of thumb in section 5.4, and assume 6% a year.</p>',
      '<h2>5.7 تكلفة الانتظار بالأرقام الشهرية</h2><p>بيّن القسم 5.1 ما يضيفه البدء المبكر. والفكرة نفسها تبدو أوضح من الاتجاه المعاكس: كم يجب ادخاره كل شهر لبلوغ الهدف نفسه من أعمار بدء مختلفة؟ خذ هدفًا قدره 500,000 بحلول سن 65، يكفي لنحو 20,000 سنويًا وفق القاعدة التقريبية في القسم 5.4، وافترض 6% سنويًا.</p>',
    )),
    table(
      [L('Start saving at', 'بدء الادخار في سن'), L('Years to 65', 'السنوات حتى 65'), L('Monthly saving needed', 'الادخار الشهري المطلوب')],
      [
        [L('30', '30'), L('35', '35'), L('≈ 351', '≈ 351')],
        [L('40', '40'), L('25', '25'), L('≈ 722', '≈ 722')],
        [L('50', '50'), L('15', '15'), L('≈ 1,719', '≈ 1,719')],
      ],
    ),
    box('keypoint', L('Every decade roughly doubles the bill', 'كل عقد يضاعف الفاتورة تقريبًا'), L(
      'Waiting from 30 to 40 roughly doubles the monthly amount; waiting from 40 to 50 more than doubles it again. Anyone starting late can still reach a goal, but through a larger saving rate, a later retirement date or a smaller target, not through a riskier portfolio. Illustrative figures, before tax and fees.',
      'الانتظار من 30 إلى 40 يضاعف المبلغ الشهري تقريبًا، والانتظار من 40 إلى 50 يضاعفه مرة أخرى وأكثر. ومن يبدأ متأخرًا يمكنه بلوغ الهدف مع ذلك، لكن بنسبة ادخار أكبر أو موعد تقاعد أبعد أو هدف أصغر، لا بمحفظة أكثر مخاطرة. أرقام توضيحية، قبل الضرائب والرسوم.',
    )),
    html(L(
      '<h2>Chapter summary</h2><ul><li>Retirement is the goal where starting early matters most; delay raises the monthly amount needed.</li><li>An employer match is an immediate return; claim all of it where it exists.</li><li>Tax-advantaged accounts let growth compound untaxed; early withdrawals cost far more than the amount taken.</li><li>Around 10% to 15% of income is a common starting saving rate; about 25 times yearly needs is a common target.</li><li>Glide paths and target-date funds reduce risk as the date nears.</li><li>In retirement, inflation and early falls are the main threats; a cash buffer helps with both.</li></ul>',
      '<h2>خلاصة الفصل</h2><ul><li>التقاعد هو الهدف الذي يهم فيه البدء المبكر أكثر من غيره؛ والتأخير يرفع المبلغ الشهري المطلوب.</li><li>مطابقة صاحب العمل عائد فوري؛ طالب بها كاملة حيث توجد.</li><li>الحسابات ذات المزايا الضريبية تترك النمو يتضاعف دون ضريبة؛ والسحب المبكر يكلّف أكثر بكثير من المبلغ المسحوب.</li><li>نحو 10% إلى 15% من الدخل نسبة ادخار ابتدائية شائعة؛ ونحو 25 ضعف الاحتياج السنوي هدف شائع.</li><li>مسارات الانزلاق وصناديق تاريخ الهدف تقلل المخاطرة مع اقتراب الموعد.</li><li>في التقاعد يكون التضخم والهبوطات المبكرة أكبر التهديدات؛ والاحتياطي النقدي يساعد في مواجهتهما.</li></ul>',
    )),
  ],
}
