// Original course content. Every mix and figure is an illustrative example, not a recommendation.
import type { Module } from '../../types'
import { L, box, cover, diagram, exercise, html, keyIdea, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'plan'
const P = 'invp'

const questions = [
  mcq(P, W, 1, 'goals',
    L('You will need money for a car in 18 months. Which bucket does it belong in?', 'ستحتاج مالًا لشراء سيارة بعد 18 شهرًا. إلى أي سلة ينتمي؟'),
    [L('Short-term: kept in savings', 'قصيرة الأجل: يُحفظ في التوفير'), L('Long-term: mostly stocks', 'طويلة الأجل: أسهم في الغالب'), L('Whichever bucket grew most last year', 'السلة التي نمت أكثر في العام الماضي')], 0,
    L('Money needed in under about 3 years has no time to recover from a fall, so it stays in savings.', 'المال المطلوب خلال أقل من 3 سنوات تقريبًا لا يملك وقتًا للتعافي من الهبوط، فيبقى في التوفير.')),
  mcq(P, W, 2, 'goals',
    L('Why does the date of a goal matter so much in a plan?', 'لماذا يهم موعد الهدف كثيرًا في الخطة؟'),
    [L('It tells you how long the money has to ride out a fall', 'لأنه يحدد المدة المتاحة للمال لتجاوز الهبوط'), L('Later goals always earn guaranteed returns', 'لأن الأهداف البعيدة تحقق دائمًا عوائد مضمونة'), L('It sets the fee you pay', 'لأنه يحدد الرسوم التي تدفعها')], 0,
    L('The further away the date, the more time there is to recover from a bad year, so the more risk the money can usually carry.', 'كلما بعُد الموعد، زاد الوقت المتاح للتعافي من عام سيئ، فيمكن للمال عادةً تحمّل مخاطرة أكبر.')),
  mcq(P, W, 3, 'risk-capacity',
    L('Risk capacity means…', 'القدرة على تحمّل المخاطر تعني…'),
    [L('How much of a fall your finances can absorb without hurting your life', 'مقدار الهبوط الذي تستطيع أموالك امتصاصه دون أن يضر حياتك'), L('How brave you feel about losses', 'مدى شجاعتك تجاه الخسائر'), L('The highest return you can hope for', 'أعلى عائد يمكنك أن تأمله')], 0,
    L('Capacity is about your situation: income, savings, debts and horizon. How you feel about losses is tolerance.', 'القدرة تتعلق بوضعك: الدخل والمدخرات والديون والأفق الزمني. أما شعورك تجاه الخسائر فهو التحمّل النفسي.')),
  mcq(P, W, 4, 'risk-capacity',
    L('Your risk tolerance is high but your risk capacity is low. Which should set the risk you take?', 'تحمّلك النفسي للمخاطر مرتفع لكن قدرتك على تحمّلها منخفضة. أيهما يجب أن يحدد المخاطرة التي تأخذها؟'),
    [L('The lower one: capacity', 'الأدنى منهما: القدرة'), L('The higher one: tolerance', 'الأعلى منهما: التحمّل النفسي'), L('Neither — only past returns matter', 'لا هذا ولا ذاك — العوائد السابقة وحدها تهم')], 0,
    L('Feeling calm does not pay the bills after a fall. When the two disagree, the lower one sets the limit.', 'الشعور بالهدوء لا يسدد الفواتير بعد الهبوط. عندما يختلفان، يحدد الأدنى منهما الحد.')),
  mcq(P, W, 5, 'mix',
    L('In the illustration, why does the 25-year goal hold far more stocks than the 1-year goal?', 'في التوضيح، لماذا يحمل هدف الـ25 سنة أسهمًا أكثر بكثير من هدف السنة الواحدة؟'),
    [L('It has many years to recover from falls', 'لأن أمامه سنوات كثيرة للتعافي من الهبوط'), L('Stocks are guaranteed to rise over 25 years', 'لأن الأسهم مضمونة الارتفاع على مدى 25 سنة'), L('Long goals are not allowed to hold cash', 'لأن الأهداف البعيدة لا يُسمح لها بحمل النقد')], 0,
    L('Time gives room to ride out bad years. Nothing is guaranteed, but a long horizon can usually carry bigger swings.', 'الوقت يمنح مجالًا لتجاوز الأعوام السيئة. لا شيء مضمون، لكن الأفق الطويل يستطيع عادةً تحمّل تقلبات أكبر.')),
  mcq(P, W, 6, 'mix',
    L('As a goal’s date gets closer, a plan like the illustration usually…', 'مع اقتراب موعد الهدف، فإن خطة مثل التوضيح عادةً…'),
    [L('Shifts step by step toward bonds and cash', 'تنتقل تدريجيًا نحو السندات والنقد'), L('Moves everything into stocks for one last boost', 'تنقل كل شيء إلى الأسهم لدفعة أخيرة'), L('Never changes the mix', 'لا تغيّر المزيج أبدًا')], 0,
    L('Near the date there is less time to recover, so the mix gets calmer gradually rather than all at once.', 'قرب الموعد يقل الوقت المتاح للتعافي، فيصبح المزيج أهدأ تدريجيًا لا دفعة واحدة.')),
  mcq(P, W, 7, 'automate',
    L('What is the main benefit of automating a monthly investment?', 'ما الفائدة الرئيسية من أتمتة استثمار شهري؟'),
    [L('It happens without relying on willpower or guessing the right moment', 'يحدث دون الاعتماد على قوة الإرادة أو تخمين اللحظة المناسبة'), L('It guarantees a profit', 'يضمن الربح'), L('It removes all fees', 'يلغي كل الرسوم')], 0,
    L('An automatic transfer keeps going in good months and bad ones, so you never have to decide whether now is a good time.', 'التحويل التلقائي يستمر في الأشهر الجيدة والسيئة، فلا تحتاج أبدًا لتقرير ما إذا كان الآن وقتًا مناسبًا.')),
  mcq(P, W, 8, 'automate',
    L('You invest 100 a month. The price is 10, then 5, then 8. How many units do you own after three months?', 'تستثمر 100 كل شهر. السعر 10، ثم 5، ثم 8. كم وحدة تملك بعد ثلاثة أشهر؟'),
    [L('42.5', '42.5'), L('30', '30'), L('39', '39')], 0,
    L('10 + 20 + 12.5 = 42.5 units. The cheap month bought the most units.', '10 + 20 + 12.5 = 42.5 وحدة. الشهر الرخيص اشترى أكبر عدد من الوحدات.')),
  mcq(P, W, 9, 'rebalance',
    L('Your target is 60% stocks and you rebalance when a weight drifts more than 5 points. Stocks are now 63%. What does the rule say?', 'هدفك 60% أسهم، وتعيد التوازن عندما ينحرف وزن بأكثر من 5 نقاط. الأسهم الآن 63%. ماذا تقول القاعدة؟'),
    [L('Do nothing yet', 'لا تفعل شيئًا بعد'), L('Sell all your stocks', 'بع كل أسهمك'), L('Buy more stocks', 'اشترِ المزيد من الأسهم')], 0,
    L('63% is only 3 points away from the 60% target, inside the 5-point band, so you leave it alone.', '63% تبعد 3 نقاط فقط عن هدف 60%، أي داخل نطاق 5 نقاط، فتتركها كما هي.')),
  mcq(P, W, 10, 'rebalance',
    L('Which way of rebalancing avoids selling anything?', 'أي طريقة لإعادة التوازن تتجنب بيع أي شيء؟'),
    [L('Directing new contributions to the part that fell behind', 'توجيه المساهمات الجديدة إلى الجزء الذي تأخر'), L('Waiting until the mix fixes itself', 'الانتظار حتى يصلح المزيج نفسه'), L('Buying more of what grew most', 'شراء المزيد مما نما أكثر')], 0,
    L('Adding new money to the lagging part moves the mix back toward target with no sale, so no selling fee or tax on gains.', 'إضافة المال الجديد إلى الجزء المتأخر تعيد المزيج نحو الهدف دون بيع، فلا رسوم بيع ولا ضريبة على الأرباح.')),
  mcq(P, W, 11, 'written-plan',
    L('Which of these belongs on a one-page investment plan?', 'أي مما يلي مكانه خطة استثمار من صفحة واحدة؟'),
    [L('Goals with dates, the mix, the monthly amount and when you rebalance', 'الأهداف ومواعيدها، والمزيج، والمبلغ الشهري، وموعد إعادة التوازن'), L('A list of hot tips from social media', 'قائمة نصائح رائجة من وسائل التواصل'), L('A forecast of next year’s returns', 'توقع لعوائد العام القادم')], 0,
    L('A plan records what you control: goals, mix, contributions and rules. Tips and forecasts are guesses, not a plan.', 'الخطة تسجل ما تتحكم فيه: الأهداف والمزيج والمساهمات والقواعد. أما النصائح والتوقعات فتخمينات لا خطة.')),
  mcq(P, W, 12, 'written-plan',
    L('The market falls 30%. Your long-term money is 20 years from being needed, and your plan says to keep going. Following the plan means…', 'هبط السوق 30%. مالك طويل الأجل لن تحتاجه قبل 20 سنة، وخطتك تقول استمر. الالتزام بالخطة يعني…'),
    [L('Keeping the monthly amount going and not selling', 'الاستمرار في المبلغ الشهري وعدم البيع'), L('Selling now and buying back later', 'البيع الآن والشراء لاحقًا'), L('Rewriting the plan the same day', 'إعادة كتابة الخطة في اليوم نفسه')], 0,
    L('The crash rules were written while calm for exactly this moment: keep investing, don’t sell long-term money, rebalance on your usual date.', 'قواعد الانهيار كُتبت بهدوء من أجل هذه اللحظة تحديدًا: استمر في الاستثمار، ولا تبع المال طويل الأجل، وأعد التوازن في موعدك المعتاد.')),
]

export const plan: Module = {
  id: W,
  courseId: 'investing',
  order: 6,
  cover: cover(
    L('Going deeper · Module 6', 'التعمق أكثر · الوحدة 6'),
    L('Building your investment plan', 'بناء خطتك الاستثمارية'),
    L('≈ 30 min', '≈ 30 دقيقة'),
  ),
  sections: [
    section({
      id: 'goals',
      lessons: ['goals'],
      label: L('Part 1', 'الجزء ١'),
      nav: L('Goals and time horizons', 'الأهداف والآفاق الزمنية'),
      title: L('Start with goals and dates', 'ابدأ بالأهداف والمواعيد'),
      standfirst: L('A plan begins with what the money is for and when you will need it.', 'تبدأ الخطة بالغرض من المال وموعد حاجتك إليه.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        objectives([
          L('Sort your goals into short, medium and long-term buckets', 'تصنيف أهدافك في سلال قصيرة ومتوسطة وطويلة الأجل'),
          L('Tell risk tolerance from risk capacity', 'التمييز بين التحمّل النفسي للمخاطر والقدرة على تحمّلها'),
          L('Picture a mix of stocks, bonds and cash for each horizon', 'تصوّر مزيج من الأسهم والسندات والنقد لكل أفق زمني'),
          L('Automate regular investing and rebalance on a schedule', 'أتمتة الاستثمار المنتظم وإعادة التوازن وفق جدول'),
          L('Write a one-page plan with rules for a crash', 'كتابة خطة من صفحة واحدة مع قواعد للانهيار'),
        ]),
        html(L(
          '<p>Write each goal down with a rough amount and a <strong>date</strong>: a laptop next year, a home deposit in five years, retirement in thirty. The date matters most, because it tells you how long the money can wait out a fall before you need it. Keep your emergency fund apart from all of these: it is a safety net, not a goal.</p>',
          '<p>دوّن كل هدف بمبلغ تقريبي و<strong>موعد</strong>: حاسوب العام القادم، ودفعة أولى لمنزل بعد خمس سنوات، والتقاعد بعد ثلاثين. الموعد هو الأهم، لأنه يخبرك كم يستطيع المال انتظار انتهاء الهبوط قبل أن تحتاجه. وأبقِ صندوق الطوارئ منفصلًا عن كل ذلك: فهو شبكة أمان لا هدف.</p>',
        )),
        html(L(
          '<p>Then sort goals into three buckets. <strong>Short-term</strong> (under about 3 years) stays in savings. <strong>Medium-term</strong> (about 3–10 years) takes a cautious mix. <strong>Long-term</strong> (10+ years) can carry more stocks.</p>',
          '<p>ثم صنّف الأهداف في ثلاث سلال. <strong>قصيرة الأجل</strong> (أقل من 3 سنوات تقريبًا) تبقى في التوفير. و<strong>متوسطة الأجل</strong> (نحو 3–10 سنوات) تأخذ مزيجًا حذرًا. و<strong>طويلة الأجل</strong> (10 سنوات فأكثر) يمكنها حمل أسهم أكثر.</p>',
        )),
        box('example', L('Example', 'مثال'), L(
          'Layla, 28, has a car to buy in two years (short), a flat deposit in seven (medium) and retirement in about 35 (long). One person, three different answers to “how much risk?”. (Illustrative.)',
          'ليلى، 28 عامًا، ستشتري سيارة بعد سنتين (قصيرة)، ولديها دفعة أولى لشقة بعد سبع (متوسطة)، وتقاعد بعد نحو 35 (طويلة). شخص واحد وثلاث إجابات مختلفة عن «كم من المخاطرة؟». (توضيحي.)',
        )),
        keyIdea(L(
          '<p>Every goal needs a <strong>date</strong>: the date, not the market, decides how much risk that money can carry.</p>',
          '<p>كل هدف يحتاج <strong>موعدًا</strong>: الموعد، لا السوق، هو ما يحدد مقدار المخاطرة التي يتحملها ذلك المال.</p>',
        )),
        exercise('invp-q001'),
        exercise('invp-q002'),
      ],
    }),
    section({
      id: 'risk-profile',
      lessons: ['risk-profile'],
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Risk tolerance and capacity', 'تحمّل المخاطر والقدرة عليها'),
      title: L('How much risk can you take?', 'كم من المخاطرة يمكنك أن تتحمّل؟'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p><strong>Risk tolerance</strong> is how big a fall you can watch without selling. <strong>Risk capacity</strong> is how big a fall your life can absorb: steady income, an emergency fund, little debt and a long horizon all raise it. The two can differ: a calm person with an uncertain job may have high tolerance but low capacity.</p>',
          '<p><strong>التحمّل النفسي للمخاطر</strong> هو حجم الهبوط الذي تستطيع مشاهدته دون أن تبيع. و<strong>القدرة على تحمّل المخاطر</strong> هي حجم الهبوط الذي تستطيع حياتك امتصاصه: الدخل الثابت وصندوق الطوارئ وقلة الديون والأفق الطويل كلها ترفعها. وقد يختلفان: فشخص هادئ بوظيفة غير مستقرة قد يملك تحمّلًا مرتفعًا وقدرة منخفضة.</p>',
        )),
        html(L(
          '<p>A simple test: picture your long-term money falling by a third in one year, 10,000 showing as 6,700. Would you sell, wait, or keep adding? Answer honestly, before it happens. When tolerance and capacity disagree, let the <strong>lower one</strong> set your risk.</p>',
          '<p>اختبار بسيط: تخيّل مالك طويل الأجل يهبط بمقدار الثلث في عام واحد، فتظهر 10,000 على أنها 6,700. هل ستبيع، أم تنتظر، أم تستمر في الإضافة؟ أجب بصدق قبل أن يحدث ذلك. وعندما يختلف التحمّل والقدرة، دع <strong>الأدنى منهما</strong> يحدد مخاطرتك.</p>',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Judging your tolerance in a rising market. Everyone feels brave while prices climb; the real test is what you do after a fall.',
          'الحكم على تحمّلك في سوق صاعدة. الجميع يشعر بالشجاعة والأسعار ترتفع؛ أما الاختبار الحقيقي فهو ما تفعله بعد الهبوط.',
        )),
        keyIdea(L(
          '<p>Take the risk your feelings <strong>and</strong> your finances can both survive: the lower of the two sets the limit.</p>',
          '<p>خذ المخاطرة التي تتحملها مشاعرك <strong>وأموالك</strong> معًا: الأدنى منهما يحدد الحد.</p>',
        )),
        exercise('invp-q003'),
        exercise('invp-q004'),
      ],
    }),
    section({
      id: 'asset-mix',
      lessons: ['asset-mix'],
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Choosing a mix', 'اختيار المزيج'),
      title: L('A mix for each bucket', 'مزيج لكل سلة'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>With your buckets and your risk in mind, picture a split for each bucket between <strong>stocks</strong> (growth, big swings), <strong>bonds</strong> (steadier) and <strong>cash</strong> (ready to spend). The longer the horizon, the more room there usually is for stocks.</p>',
          '<p>مع وضع سلالك ومخاطرتك في الاعتبار، تصوّر لكل سلة تقسيمًا بين <strong>الأسهم</strong> (نمو وتقلبات كبيرة) و<strong>السندات</strong> (أكثر ثباتًا) و<strong>النقد</strong> (جاهز للإنفاق). كلما طال الأفق، اتسع المجال عادةً للأسهم.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Three goals, three mixes', 'ثلاثة أهداف وثلاثة أمزجة'),
          src: '/diagrams/plan-mix.svg',
          alt: L(
            'Stacked bars by years until the money is needed: 1 year, 100% cash; 5 years, 40% stocks, 50% bonds, 10% cash; 25 years, 80% stocks, 10% bonds, 10% cash.',
            'أعمدة مكدسة حسب السنوات حتى الحاجة إلى المال: سنة واحدة، 100% نقد؛ 5 سنوات، 40% أسهم و50% سندات و10% نقد؛ 25 سنة، 80% أسهم و10% سندات و10% نقد.',
          ),
          caption: L('Years until the money is needed. Dark: stocks. Blue: bonds. Light: cash. Illustrative splits, not recommendations.', 'السنوات حتى الحاجة إلى المال. الداكن: الأسهم. الأزرق: السندات. الفاتح: النقد. تقسيمات توضيحية لا توصيات.'),
        }),
        html(L(
          '<p>A goal does not keep the same mix forever. As its date gets closer there is less time to recover from a fall, so many plans shift the mix <strong>step by step</strong> toward bonds and cash, a little each year, rather than all at once.</p>',
          '<p>لا يحتفظ الهدف بالمزيج نفسه إلى الأبد. مع اقتراب موعده يقل الوقت المتاح للتعافي من الهبوط، لذا تنقل خطط كثيرة المزيج <strong>تدريجيًا</strong> نحو السندات والنقد، قليلًا كل عام، لا دفعة واحدة.</p>',
        )),
        box('keypoint', L('Not a recommendation', 'ليست توصية'), L(
          'These splits only show how the horizon shapes a mix. The right one depends on your whole situation, and no mix removes the chance of loss.',
          'هذه التقسيمات توضح فقط كيف يشكّل الأفق الزمني المزيج. المزيج المناسب يعتمد على وضعك كاملًا، ولا يزيل أي مزيج احتمال الخسارة.',
        )),
        keyIdea(L(
          '<p>Each bucket gets its own mix, and a goal’s mix gets <strong>calmer</strong> as its date comes closer.</p>',
          '<p>لكل سلة مزيجها الخاص، ويصبح مزيج الهدف <strong>أهدأ</strong> كلما اقترب موعده.</p>',
        )),
        exercise('invp-q005'),
        exercise('invp-q006'),
      ],
    }),
    section({
      id: 'automate',
      lessons: ['automate'],
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Automate it', 'أتمتة الخطة'),
      title: L('Make the plan run by itself', 'اجعل الخطة تعمل وحدها'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>A good plan runs without you. <strong>Automate</strong> it: set a fixed amount to move into your investments on the same day each month, just after payday. You stop relying on willpower, and you never have to decide whether “now” is a good moment to invest.</p>',
          '<p>الخطة الجيدة تعمل من دونك. <strong>أتمتها</strong>: حدّد مبلغًا ثابتًا ينتقل إلى استثماراتك في اليوم نفسه من كل شهر، بعد استلام الراتب مباشرة. فتتوقف عن الاعتماد على قوة الإرادة، ولا تحتاج أبدًا لتقرير ما إذا كان «الآن» وقتًا مناسبًا للاستثمار.</p>',
        )),
        html(L(
          '<p>Investing a fixed amount on a schedule is called <strong>dollar-cost averaging</strong> (or pound-cost averaging). When prices fall, the same amount buys more units; when they rise, it buys fewer. So your average cost per unit ends up below the average price you saw.</p>',
          '<p>استثمار مبلغ ثابت وفق جدول يُسمى <strong>متوسط التكلفة</strong> (الاستثمار الدوري). عندما تنخفض الأسعار يشتري المبلغ نفسه وحدات أكثر، وعندما ترتفع يشتري أقل. لذلك ينتهي متوسط تكلفتك للوحدة أدنى من متوسط الأسعار التي رأيتها.</p>',
        )),
        table(
          [L('Month', 'الشهر'), L('Invested', 'المبلغ المستثمر'), L('Price', 'السعر'), L('Units bought', 'الوحدات المشتراة')],
          [
            [L('1', '1'), L('100', '100'), L('10', '10'), L('10', '10')],
            [L('2', '2'), L('100', '100'), L('5', '5'), L('20', '20')],
            [L('3', '3'), L('100', '100'), L('8', '8'), L('12.5', '12.5')],
          ],
        ),
        html(L(
          '<p>Together, 300 bought 42.5 units: an average cost of about <strong>7.06</strong> per unit, while the average price was about 7.67. (Illustrative figures.) In the Playground, with play money, auto-invest works the same way: a fixed buy every 4 weeks, whatever the price.</p>',
          '<p>معًا، اشترت 300 نحو 42.5 وحدة: بمتوسط تكلفة نحو <strong>7.06</strong> للوحدة، بينما كان متوسط السعر نحو 7.67. (أرقام توضيحية.) وفي التجربة، بأموال افتراضية، يعمل الاستثمار التلقائي بالطريقة نفسها: شراء ثابت كل 4 أسابيع أيًا كان السعر.</p>',
        )),
        keyIdea(L(
          '<p>Automate a <strong>fixed amount</strong> on a fixed day: the habit keeps going in good months and bad ones.</p>',
          '<p>أتمت <strong>مبلغًا ثابتًا</strong> في يوم ثابت: العادة تستمر في الأشهر الجيدة والسيئة.</p>',
        )),
        exercise('invp-q007'),
        exercise('invp-q008'),
      ],
    }),
    section({
      id: 'rebalance',
      lessons: ['rebalance'],
      label: L('Part 5', 'الجزء ٥'),
      nav: L('Rebalancing', 'إعادة التوازن'),
      title: L('Keep the mix you chose', 'حافظ على المزيج الذي اخترته'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Markets move your mix without asking. After a strong run for stocks, a 60/40 target can drift to 66/34, and you now carry more risk than you chose. <strong>Rebalancing</strong> puts it back: trim what grew, or point new money at what fell behind.</p>',
          '<p>الأسواق تحرّك مزيجك دون أن تستأذنك. بعد صعود قوي للأسهم، قد ينحرف هدف 60/40 إلى 66/34، فتصبح مخاطرتك أكبر مما اخترت. و<strong>إعادة التوازن</strong> تعيده: قلّص ما نما، أو وجّه المال الجديد إلى ما تأخر.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Drift and back', 'الانحراف والعودة'),
          src: '/diagrams/plan-rebalance.svg',
          alt: L(
            'Three stacked bars: a 60% stocks / 40% bonds target, a drift to 66% / 34% after a strong year for stocks, and back to 60% / 40% after rebalancing.',
            'ثلاثة أعمدة مكدسة: هدف 60% أسهم / 40% سندات، ثم انحراف إلى 66% / 34% بعد عام قوي للأسهم، ثم العودة إلى 60% / 40% بعد إعادة التوازن.',
          ),
          caption: L('Left: the target. Middle: after a strong year for stocks. Right: rebalanced. Dark: stocks. Light: bonds. Illustrative.', 'يسارًا: الهدف. في الوسط: بعد عام قوي للأسهم. يمينًا: بعد إعادة التوازن. الداكن: الأسهم. الفاتح: السندات. توضيحي.'),
        }),
        html(L(
          '<p>Two common rules. <strong>By the calendar</strong>: check once or twice a year, on a fixed date. <strong>By a band</strong>: act only when a weight drifts more than about 5 points from target. Topping up the lagging part with new money avoids selling, and with it fees and tax.</p>',
          '<p>قاعدتان شائعتان. <strong>حسب التقويم</strong>: راجع مرة أو مرتين في السنة في موعد ثابت. <strong>حسب النطاق</strong>: تحرّك فقط عندما ينحرف وزن بأكثر من نحو 5 نقاط عن الهدف. وزيادة الجزء المتأخر بالمال الجديد تتجنب البيع، ومعه الرسوم والضرائب.</p>',
        )),
        box('example', L('Try it', 'جرّبها'), L(
          'In the Playground (play money), check the allocation ring after a few simulated years, then practise bringing your split back.',
          'في التجربة (بأموال افتراضية)، راجع حلقة التوزيع بعد بضع سنوات افتراضية، ثم تدرّب على إعادة تقسيمك إلى هدفه.',
        )),
        keyIdea(L(
          '<p>Rebalance on a <strong>schedule or a band</strong>, not on a hunch, so your risk stays the risk you chose.</p>',
          '<p>أعد التوازن وفق <strong>جدول أو نطاق</strong>، لا وفق حدس، لتبقى مخاطرتك هي المخاطرة التي اخترتها.</p>',
        )),
        exercise('invp-q009'),
        exercise('invp-q010'),
      ],
    }),
    section({
      id: 'written-plan',
      lessons: ['written-plan'],
      label: L('Part 6', 'الجزء ٦'),
      nav: L('Your one-page plan', 'خطتك في صفحة واحدة'),
      title: L('Write it down, before the storm', 'دوّنها قبل العاصفة'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Put it all on <strong>one page</strong>: your goals with dates and amounts, the mix for each bucket, how much you invest each month and on which day, and when you rebalance. Short is good: a plan you can read in two minutes is a plan you will actually check.</p>',
          '<p>اجمع كل شيء في <strong>صفحة واحدة</strong>: أهدافك بمواعيدها ومبالغها، والمزيج لكل سلة، وكم تستثمر كل شهر وفي أي يوم، ومتى تعيد التوازن. الإيجاز مفيد: الخطة التي تقرؤها في دقيقتين هي خطة ستراجعها فعلًا.</p>',
        )),
        html(L(
          '<p>Then add your rules for a <strong>crash</strong>, written while you are calm: “If the market falls 30%, I keep my monthly amount going. I do not sell long-term money. I rebalance on my usual date. I change the plan only when my life changes, not because prices did.”</p>',
          '<p>ثم أضف قواعدك عند <strong>الانهيار</strong>، واكتبها وأنت هادئ: «إذا هبط السوق 30%، أستمر في مبلغي الشهري. لا أبيع المال طويل الأجل. أعيد التوازن في موعدي المعتاد. أغيّر الخطة فقط عندما تتغير حياتي، لا عندما تتغير الأسعار.»</p>',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Rewriting the plan in the middle of a fall. Change it when your goals, income or horizon change, not because of headlines.',
          'إعادة كتابة الخطة في منتصف الهبوط. غيّرها عندما تتغير أهدافك أو دخلك أو أفقك الزمني، لا بسبب العناوين الإخبارية.',
        )),
        keyIdea(L(
          '<p>A plan written while calm is what you <strong>follow</strong> when markets are not.</p>',
          '<p>الخطة المكتوبة في الهدوء هي ما <strong>تتبعه</strong> حين لا تكون الأسواق هادئة.</p>',
        )),
        exercise('invp-q011'),
        exercise('invp-q012'),
        takeaways([
          L('Give every goal a date and put it in a bucket', 'امنح كل هدف موعدًا وضعه في سلة'),
          L('Let the lower of tolerance and capacity set your risk', 'دع الأدنى من التحمّل والقدرة يحدد مخاطرتك'),
          L('Pick a mix per bucket and make it calmer as the date nears', 'اختر مزيجًا لكل سلة واجعله أهدأ مع اقتراب الموعد'),
          L('Automate a fixed amount and rebalance on a schedule', 'أتمت مبلغًا ثابتًا وأعد التوازن وفق جدول'),
          L('Write one page, with crash rules, and follow it', 'اكتب صفحة واحدة بقواعد للانهيار والتزم بها'),
        ]),
      ],
    }),
  ],
  questions,
}
