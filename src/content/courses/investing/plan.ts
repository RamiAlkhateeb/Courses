// Original course content. Every mix and figure is an illustrative example, not a recommendation.
// The story ends here: Noor (نور) puts everything she has learned into a one-page plan, with Karim (كريم) along.
import type { Module } from '../../types'
import { L, box, choice, cover, diagram, exercise, html, keyIdea, mcq, myth, practice, predict, section, sort, table, takeaways } from '../../helpers'

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
  mcq(P, W, 13, 'goals',
    L('The season goal “never fall more than 15% from a peak” is mainly about…', 'هدف الموسم «لا تهبط أكثر من 15% عن أعلى قمة» يتعلق أساسًا بـ…'),
    [L('Keeping the size of falls within what you can bear', 'إبقاء حجم الهبوط ضمن ما تتحمّله'), L('Earning the highest possible return', 'تحقيق أعلى عائد ممكن'), L('Collecting as many dividends as possible', 'جمع أكبر قدر من التوزيعات')], 0,
    L('It is a risk goal: it rewards a mix calm enough to avoid deep drops, the same idea as matching your plan to your risk tolerance and capacity.', 'إنه هدف مخاطرة: يكافئ مزيجًا هادئًا بما يكفي لتجنّب الهبوط العميق، وهي الفكرة نفسها في مواءمة خطتك مع تحمّلك للمخاطر وقدرتك عليها.')),
  mcq(P, W, 14, 'goals',
    L('Why pick the goal before the season rather than after it ends?', 'لماذا تختار الهدف قبل الموسم لا بعد انتهائه؟'),
    [L('A goal set in advance guides your choices and can be checked honestly', 'الهدف المحدد مسبقًا يوجّه اختياراتك ويمكن التحقق منه بأمانة'), L('Goals picked afterwards pay more', 'الأهداف المختارة لاحقًا تدفع أكثر'), L('It makes prices go up', 'يجعل الأسعار ترتفع')], 0,
    L('Chosen afterwards, you would simply pick whichever goal you happened to meet. Set first, it works like a written plan: it shapes what you do.', 'لو اخترته لاحقًا لاخترت ببساطة الهدف الذي صادف أنك حققته. أما إذا حددته أولًا فيعمل كخطة مكتوبة: يوجّه ما تفعله.')),
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
      standfirst: L('Noor writes her plan. It starts with what the money is for, and when.', 'تكتب نور خطتها. وتبدأ بالغرض من المال، ومتى تحتاجه.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Five years after the money in the drawer, Noor sits down to write a real plan. She lists her goals: a trip next summer, a car in two years, a home deposit in twelve, retirement in thirty. Karim asks which of them she should invest for. Help her sort them.</p>',
          '<p>بعد خمس سنوات من المال في الدرج، تجلس نور لتكتب خطة حقيقية. تدوّن أهدافها: رحلة الصيف القادم، وسيارة بعد سنتين، ودفعة أولى لمنزل بعد اثني عشر عامًا، والتقاعد بعد ثلاثين. يسألها كريم أيها تستثمر من أجله. ساعدها على تصنيفها.</p>',
        )),
        sort(
          L('Keep it in savings, or invest it?', 'تبقيه في التوفير أم تستثمره؟'),
          [L('Savings', 'توفير'), L('Invest', 'استثمار')],
          [
            [L('A trip next summer', 'رحلة الصيف القادم'), 0],
            [L('Retirement in 30 years', 'التقاعد بعد 30 سنة'), 1],
            [L('A car in 2 years', 'سيارة بعد سنتين'), 0],
            [L('A home deposit in 12 years', 'دفعة أولى لمنزل بعد 12 سنة'), 1],
          ],
          L(
            'Under about 3 years, money has no time to recover from a fall, so it stays in savings. Ten years or more leaves room to invest for growth.',
            'خلال أقل من 3 سنوات تقريبًا لا يملك المال وقتًا للتعافي من الهبوط، فيبقى في التوفير. أما عشر سنوات فأكثر فتترك مجالًا للاستثمار من أجل النمو.',
          ),
        ),
        html(L(
          '<p>Write each goal with a rough amount and a <strong>date</strong>. Then sort them into buckets: <strong>short-term</strong> (under about 3 years) stays in savings, <strong>medium-term</strong> (about 3–10 years) takes a cautious mix, <strong>long-term</strong> (10+ years) can carry more stocks. The emergency fund stays apart: a safety net, not a goal.</p>',
          '<p>دوّن كل هدف بمبلغ تقريبي و<strong>موعد</strong>. ثم صنّفها في سلال: <strong>قصيرة الأجل</strong> (أقل من 3 سنوات تقريبًا) تبقى في التوفير، و<strong>متوسطة الأجل</strong> (نحو 3–10 سنوات) تأخذ مزيجًا حذرًا، و<strong>طويلة الأجل</strong> (10 سنوات فأكثر) يمكنها حمل أسهم أكثر. ويبقى صندوق الطوارئ منفصلًا: شبكة أمان لا هدف.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Noor’s goals by date', 'أهداف نور حسب الموعد'),
          src: '/diagrams/goal-dates.svg',
          alt: L('Years until each of Noor’s goals: the trip in 1, the car in 2, the home deposit in 12, retirement in 30.', 'السنوات حتى كل هدف من أهداف نور: الرحلة بعد 1، والسيارة بعد 2، والدفعة الأولى بعد 12، والتقاعد بعد 30.'),
          caption: L('Years until the money is needed, top to bottom: trip, car, home deposit, retirement. Illustrative.', 'السنوات حتى الحاجة إلى المال، من الأعلى إلى الأسفل: الرحلة، السيارة، الدفعة الأولى، التقاعد. توضيحي.'),
        }),
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
      standfirst: L('Karim feels brave. His finances may not agree.', 'كريم يشعر بالشجاعة. وأمواله قد لا توافقه.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Karim tells Noor he can take any risk: “Falls don’t scare me anymore.” But he has just changed jobs, his emergency fund is half empty, and he still owes on his car. Noor wonders whether feeling calm is the same as being able to afford a big fall.</p>',
          '<p>يقول كريم لنور إنه يستطيع تحمّل أي مخاطرة: «الهبوط لم يعد يخيفني». لكنه غيّر وظيفته للتوّ، وصندوق طوارئه نصف فارغ، وما زال عليه قسط السيارة. تتساءل نور: هل الشعور بالهدوء هو نفسه القدرة على تحمّل هبوط كبير؟</p>',
        )),
        myth(
          L('If you feel calm about losses, you can afford more risk.', 'إذا كنت هادئًا تجاه الخسائر، فبإمكانك تحمّل مخاطرة أكبر.'),
          false,
          L(
            'Feeling calm is tolerance. Affording a fall is capacity: income, savings, debts and time. Karim’s tolerance is high but his capacity is low, and the lower one sets the limit.',
            'الهدوء تحمّل نفسي. أما القدرة على تحمّل الهبوط فتعتمد على الدخل والمدخرات والديون والوقت. تحمّل كريم مرتفع لكن قدرته منخفضة، والأدنى منهما يحدد الحد.',
          ),
        ),
        html(L(
          '<p><strong>Risk tolerance</strong> is how big a fall you can watch without selling. <strong>Risk capacity</strong> is how big a fall your life can absorb: steady income, an emergency fund, little debt and a long horizon all raise it. When the two disagree, let the <strong>lower one</strong> set your risk.</p>',
          '<p><strong>التحمّل النفسي للمخاطر</strong> هو حجم الهبوط الذي تستطيع مشاهدته دون أن تبيع. و<strong>القدرة على تحمّل المخاطر</strong> هي حجم الهبوط الذي تستطيع حياتك امتصاصه: الدخل الثابت وصندوق الطوارئ وقلة الديون والأفق الطويل كلها ترفعها. وعندما يختلفان، دع <strong>الأدنى منهما</strong> يحدد مخاطرتك.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('A fall of a third', 'هبوط بمقدار الثلث'),
          src: '/diagrams/one-third.svg',
          alt: L('10,000 of long-term money showing 6,700 after falling by a third in one year.', '10,000 من المال طويل الأجل تظهر 6,700 بعد هبوط بمقدار الثلث في عام واحد.'),
          caption: L('A simple test: picture this, then ask whether you would sell, wait, or keep adding. Illustrative.', 'اختبار بسيط: تخيّل هذا، ثم اسأل نفسك هل ستبيع أم تنتظر أم تواصل الإضافة. توضيحي.'),
        }),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Judging your tolerance in a rising market. Everyone feels brave while prices climb; the real test is what you do after a fall, so answer the 6,700 question honestly, before it happens.',
          'الحكم على تحمّلك في سوق صاعدة. الجميع يشعر بالشجاعة والأسعار ترتفع؛ أما الاختبار الحقيقي فهو ما تفعله بعد الهبوط، فأجب عن سؤال الـ6,700 بصدق قبل أن يحدث.',
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
      standfirst: L('Same person, three goals, three very different mixes.', 'شخص واحد، وثلاثة أهداف، وثلاثة أمزجة مختلفة جدًا.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Noor now picks a split for each bucket between <strong>stocks</strong> (growth, big swings), <strong>bonds</strong> (steadier) and <strong>cash</strong> (ready to spend). In the example she follows, money for 25 years from now holds about 80% stocks. She has to fill in her one-year goal.</p>',
          '<p>تختار نور الآن لكل سلة تقسيمًا بين <strong>الأسهم</strong> (نمو وتقلبات كبيرة) و<strong>السندات</strong> (أكثر ثباتًا) و<strong>النقد</strong> (جاهز للإنفاق). في المثال الذي تتبعه، يحمل المال المخصص لما بعد 25 سنة نحو 80% أسهمًا. وعليها أن تملأ هدف السنة الواحدة.</p>',
        )),
        predict(
          L('In the example, how much of the one-year money is in stocks?', 'في المثال، ما نسبة الأسهم في مال السنة الواحدة؟'),
          [L('0%', '0%'), L('20%', '20%'), L('40%', '40%'), L('80%', '80%')],
          0,
          L(
            'None: it is all cash. Money needed within a year has no time to recover from a fall, so in the example it does not hold stocks at all. (Illustrative splits, not recommendations.)',
            'لا شيء: كله نقد. المال المطلوب خلال عام لا يملك وقتًا للتعافي من الهبوط، لذا لا يحمل في المثال أي أسهم. (تقسيمات توضيحية لا توصيات.)',
          ),
        ),
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
      standfirst: L('Noor sets it up once, and the habit does the rest.', 'تضبطها نور مرة واحدة، والعادة تتولى الباقي.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Noor sets <strong>100 a month</strong> to move into her fund the day after payday. Over three months the price is 10, then 5, then 8. Her 300 buys 42.5 units in total. The average price she saw was about 7.67. What did each of her units actually cost?</p>',
          '<p>تضبط نور تحويل <strong>100 شهريًا</strong> إلى صندوقها في اليوم التالي للراتب. خلال ثلاثة أشهر كان السعر 10، ثم 5، ثم 8. اشترت الـ300 ما مجموعه 42.5 وحدة. ومتوسط السعر الذي رأته نحو 7.67. فكم كلّفتها كل وحدة فعلًا؟</p>',
        )),
        predict(
          L('What was Noor’s average cost per unit?', 'كم كان متوسط تكلفة الوحدة لدى نور؟'),
          [L('About 6', 'نحو 6'), L('About 7.06', 'نحو 7.06'), L('About 7.67', 'نحو 7.67'), L('About 10', 'نحو 10')],
          1,
          L(
            'About 7.06: 300 ÷ 42.5. Lower than the 7.67 average price, because the cheap month bought the most units. (Illustrative figures.)',
            'نحو 7.06: أي 300 ÷ 42.5. أقل من متوسط السعر 7.67، لأن الشهر الرخيص اشترى أكبر عدد من الوحدات. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>A good plan runs without you. <strong>Automate</strong> a fixed amount on a fixed day and you stop relying on willpower or guessing the moment. Investing on a schedule like this is <strong>dollar-cost averaging</strong>: it quietly buys more when prices are low.</p>',
          '<p>الخطة الجيدة تعمل من دونك. <strong>أتمت</strong> مبلغًا ثابتًا في يوم ثابت، فتتوقف عن الاعتماد على قوة الإرادة أو تخمين اللحظة. والاستثمار وفق جدول كهذا هو <strong>متوسط التكلفة</strong>: يشتري بهدوء أكثر عندما تنخفض الأسعار.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Average price and average cost', 'متوسط السعر ومتوسط التكلفة'),
          src: '/diagrams/dca-cost.svg',
          alt: L('Over three months at prices of 10, 5 and 8, the average price was about 7.67 and the average cost per unit about 7.06.', 'على مدى ثلاثة أشهر بأسعار 10 و5 و8، كان متوسط السعر نحو 7.67 ومتوسط تكلفة الوحدة نحو 7.06.'),
          caption: L('Left: the average price. Right: what each unit cost Noor. Illustrative figures.', 'يسارًا: متوسط السعر. يمينًا: ما كلّفته كل وحدة لنور. أرقام توضيحية.'),
        }),
        table(
          [L('Month', 'الشهر'), L('Invested', 'المبلغ المستثمر'), L('Price', 'السعر'), L('Units bought', 'الوحدات المشتراة')],
          [
            [L('1', '1'), L('100', '100'), L('10', '10'), L('10', '10')],
            [L('2', '2'), L('100', '100'), L('5', '5'), L('20', '20')],
            [L('3', '3'), L('100', '100'), L('8', '8'), L('12.5', '12.5')],
          ],
        ),
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
      standfirst: L('Markets move your mix without asking.', 'الأسواق تحرّك مزيجك دون أن تستأذنك.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>After two strong years, stocks are now <strong>68%</strong> of Karim’s long-term money. His target was 60%, and his rule is to act when a weight drifts more than 5 points. He has some new money arriving next month. What would you do in his place?</p>',
          '<p>بعد عامين قويين، صارت الأسهم <strong>68%</strong> من مال كريم طويل الأجل. وكان هدفه 60%، وقاعدته أن يتحرك عندما ينحرف وزن بأكثر من 5 نقاط. ولديه مال جديد يصل الشهر القادم. ماذا كنت ستفعل مكانه؟</p>',
        )),
        choice(L('Stocks are 68% against a 60% target. What would you do?', 'الأسهم 68% مقابل هدف 60%. ماذا كنت ستفعل؟'), [
          [
            L('Sell some stocks, buy bonds', 'أبيع بعض الأسهم وأشتري سندات'),
            L('The mix is back at 60/40 right away, but selling costs fees and possibly tax on the gains.', 'يعود المزيج إلى 60/40 فورًا، لكن البيع يكلّف رسومًا وربما ضريبة على الأرباح.'),
          ],
          [
            L('Put the new money into bonds', 'أضع المال الجديد في السندات'),
            L('The mix moves back toward target with no sale, so no selling fee or tax. It is slower, and may take a few months.', 'يعود المزيج نحو الهدف دون بيع، فلا رسوم بيع ولا ضريبة. لكنه أبطأ، وقد يستغرق بضعة أشهر.'),
          ],
          [
            L('Leave it: stocks are doing well', 'أتركه: الأسهم تحقق أداءً جيدًا'),
            L('Karim now carries more risk than he chose. If stocks fall, a 68% mix falls further than the plan he wrote.', 'يتحمّل كريم الآن مخاطرة أكبر مما اختار. وإذا هبطت الأسهم، يهبط مزيج الـ68% أكثر من الخطة التي كتبها.'),
          ],
        ]),
        html(L(
          '<p>After a strong run for stocks, a 60/40 target drifts, and you carry more risk than you chose. <strong>Rebalancing</strong> puts it back: trim what grew, or point new money at what fell behind. Do it <strong>by the calendar</strong>, once or twice a year, or <strong>by a band</strong>, when a weight drifts more than about 5 points.</p>',
          '<p>بعد صعود قوي للأسهم ينحرف هدف 60/40، فتتحمّل مخاطرة أكبر مما اخترت. و<strong>إعادة التوازن</strong> تعيده: قلّص ما نما، أو وجّه المال الجديد إلى ما تأخر. افعل ذلك <strong>حسب التقويم</strong>، مرة أو مرتين في السنة، أو <strong>حسب النطاق</strong>، عندما ينحرف وزن بأكثر من 5 نقاط تقريبًا.</p>',
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
      standfirst: L('One page, written while calm, for the day the market is not.', 'صفحة واحدة، تُكتب في الهدوء، ليوم لا يكون فيه السوق هادئًا.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Noor puts it all on <strong>one page</strong>. Karim offers to “improve” it with what he picked up online this week. A plan you can read in two minutes is a plan you will actually check, so only some things belong on it. Which ones?</p>',
          '<p>تجمع نور كل شيء في <strong>صفحة واحدة</strong>. ويعرض كريم أن «يحسّنها» بما التقطه على الإنترنت هذا الأسبوع. الخطة التي تقرؤها في دقيقتين هي خطة ستراجعها فعلًا، لذا لا ينتمي إليها إلا بعض الأشياء. فأيها؟</p>',
        )),
        sort(
          L('On Noor’s one-page plan, or not?', 'في خطة نور ذات الصفحة الواحدة أم لا؟'),
          [L('On the plan', 'في الخطة'), L('Not on it', 'ليس فيها')],
          [
            [L('Goals with dates and amounts', 'الأهداف بمواعيدها ومبالغها'), 0],
            [L('A hot tip from social media', 'نصيحة رائجة من وسائل التواصل'), 1],
            [L('100 a month, the day after payday', '100 شهريًا في اليوم التالي للراتب'), 0],
            [L('A forecast of next year’s returns', 'توقع لعوائد العام القادم'), 1],
          ],
          L(
            'A plan records what you control: goals, mixes, the monthly amount and when you rebalance. Tips and forecasts are guesses, and guesses change every week.',
            'الخطة تسجل ما تتحكم فيه: الأهداف والأمزجة والمبلغ الشهري وموعد إعادة التوازن. أما النصائح والتوقعات فتخمينات، والتخمينات تتغير كل أسبوع.',
          ),
        ),
        html(L(
          '<p>Then add rules for a <strong>crash</strong>, written while calm: “If the market falls 30%, I keep my monthly amount going. I do not sell long-term money. I rebalance on my usual date. I change the plan only when my life changes, not because prices did.”</p>',
          '<p>ثم أضف قواعد لـ<strong>الانهيار</strong>، واكتبها وأنت هادئ: «إذا هبط السوق 30%، أستمر في مبلغي الشهري. لا أبيع المال طويل الأجل. أعيد التوازن في موعدي المعتاد. أغيّر الخطة فقط عندما تتغير حياتي، لا عندما تتغير الأسعار.»</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('What the crash rules protect', 'ما تحميه قواعد الانهيار'),
          src: '/diagrams/panic-sell.svg',
          alt: L('Bars: 1,000 before a fall, 700 at the bottom, 1,100 a few years later if held, and 700 if sold at the bottom.', 'أعمدة: 1,000 قبل الهبوط، و700 في القاع، و1,100 بعد بضع سنوات إن احتُفظ بها، و700 إن بيعت في القاع.'),
          caption: L('Left to right: before, the bottom, later if held, later if sold. Illustrative: recoveries are not guaranteed.', 'من اليسار إلى اليمين: قبل، القاع، لاحقًا إن احتُفظ بها، لاحقًا إن بيعت. توضيحي: التعافي غير مضمون.'),
        }),
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
    section({
      id: 'practice-goal',
      lessons: ['practice-goal'],
      label: L('Practice', 'تدريب'),
      nav: L('Season goal', 'هدف الموسم'),
      title: L('Practice: set a season goal', 'تدريب: حدّد هدف الموسم'),
      standfirst: L(
        'Noor’s plan starts with a goal. So does yours: choose what success means before the season plays out.',
        'خطة نور تبدأ بهدف. وكذلك خطتك: اختر معنى النجاح قبل أن يمضي الموسم.',
      ),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>A plan starts with a goal. With <strong>play money</strong> and simulated prices (practice, not advice), open the <strong>Season goal</strong> card and pick one: beat inflation, never fall more than 15% from a peak, or earn $50 in dividends and interest. The season summary checks it at the end, so you see whether your choices matched your plan.</p>',
          '<p>تبدأ الخطة بهدف. بـ<strong>مال افتراضي</strong> وأسعار محاكاة (للتدريب، لا نصيحة)، افتح بطاقة <strong>هدف الموسم</strong> واختر واحدًا: التفوّق على التضخم، أو ألا تهبط أكثر من 15% عن أعلى قمة، أو ربح 50 دولارًا من التوزيعات والفوائد. يتحقق ملخص الموسم منه في النهاية، فترى هل وافقت اختياراتك خطتك.</p>',
        )),
        practice('goal'),
        keyIdea(L(
          '<p>Decide what <strong>success</strong> means before you start, then judge your choices against it, not against the luckiest result.</p>',
          '<p>حدّد معنى <strong>النجاح</strong> قبل أن تبدأ، ثم قِس اختياراتك عليه، لا على أكثر النتائج حظًا.</p>',
        )),
        exercise('invp-q013'),
        exercise('invp-q014'),
      ],
    }),
  ],
  questions,
}
