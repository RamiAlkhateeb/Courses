// Original course content. Portfolio mixes and fee figures are illustrative examples, not recommendations.
// The story goes on: Karim's (كريم) bakery shares hit trouble, he finds his fund's fee, and Noor (نور) starts investing monthly.
import type { Module } from '../../types'
import { L, box, choice, cover, diagram, exercise, html, keyIdea, mcq, practice, predict, section, sort, table, takeaways } from '../../helpers'

const W = 'diversification'
const P = 'invd'

const questions = [
  mcq(P, W, 1, 'diversification',
    L('Which risk can diversification reduce?', 'أي نوع من المخاطر يمكن للتنويع أن يقلله؟'),
    [L('The risk of one company or sector doing badly', 'خطر سوء أداء شركة أو قطاع واحد'), L('The risk of the whole market falling', 'خطر هبوط السوق بأكمله'), L('All risk', 'كل المخاطر')], 0,
    L('Spreading out limits the damage from one company or sector, but a market-wide fall still hits almost everything.', 'التوزيع يحد من ضرر شركة أو قطاع واحد، لكن هبوط السوق كله يصيب كل شيء تقريبًا.')),
  mcq(P, W, 2, 'allocation',
    L('Asset allocation is…', 'توزيع الأصول هو…'),
    [L('How you split money between asset classes such as stocks, bonds and cash', 'طريقة تقسيم المال بين فئات الأصول مثل الأسهم والسندات والنقد'), L('Choosing the single best stock', 'اختيار أفضل سهم منفرد'), L('The fee a fund charges', 'الرسوم التي يفرضها الصندوق')], 0,
    L('Allocation is the split between asset classes, and that split drives most of a portfolio’s ups and downs.', 'التوزيع هو التقسيم بين فئات الأصول، وهذا التقسيم يحدد معظم صعود المحفظة وهبوطها.')),
  mcq(P, W, 3, 'fees',
    L('100,000 grows at 6% a year for 30 years. Roughly how much does a 1% yearly fee cost compared with a 0.1% fee?', 'ينمو مبلغ 100,000 بنسبة 6% سنويًا لمدة 30 سنة. كم تكلّف تقريبًا رسوم سنوية بنسبة 1% مقارنة برسوم 0.1%؟'),
    [L('About 126,000', 'نحو 126,000'), L('About 900', 'نحو 900'), L('Nothing — fees are too small to matter', 'لا شيء — الرسوم أصغر من أن تؤثر')], 0,
    L('About 558,000 versus 432,000: the extra 0.9% a year compounds against you for 30 years.', 'نحو 558,000 مقابل 432,000: الـ0.9% الإضافية سنويًا تتراكم ضدك طوال 30 سنة.')),
  mcq(P, W, 4, 'dca',
    L('Dollar-cost averaging means…', 'متوسط التكلفة (الاستثمار الدوري) يعني…'),
    [L('Investing a fixed amount at regular intervals regardless of price', 'استثمار مبلغ ثابت على فترات منتظمة بغض النظر عن السعر'), L('Buying only after prices fall', 'الشراء فقط بعد هبوط الأسعار'), L('Converting money to dollars', 'تحويل المال إلى دولارات')], 0,
    L('The same amount on a schedule buys more units when prices are low and fewer when they are high, with no guessing.', 'المبلغ نفسه وفق جدول ثابت يشتري وحدات أكثر عندما تنخفض الأسعار وأقل عندما ترتفع، بلا تخمين.')),
  mcq(P, W, 5, 'rebalancing',
    L('Your target is 60% stocks / 40% bonds. After a strong year you hold 66/34. Rebalancing means…', 'هدفك 60% أسهم / 40% سندات. بعد عام قوي أصبحت تملك 66/34. إعادة التوازن تعني…'),
    [L('Selling some stocks or adding to bonds to get back to 60/40', 'بيع بعض الأسهم أو إضافة سندات للعودة إلى 60/40'), L('Buying more stocks because they are winning', 'شراء المزيد من الأسهم لأنها رابحة'), L('Selling everything', 'بيع كل شيء')], 0,
    L('Rebalancing trims what grew too big and tops up what fell behind, bringing risk back to the 60/40 you chose.', 'إعادة التوازن تقلّص ما كبر أكثر من اللازم وتزيد ما تأخر، فتعيد المخاطرة إلى 60/40 التي اخترتها.')),
  mcq(P, W, 6, 'behaviour',
    L('The market drops 25% and you have 20 years until you need the money. Which reaction usually hurts long-term results most?', 'هبط السوق 25% وأمامك 20 سنة حتى تحتاج المال. أي ردة فعل تضر عادةً بالنتائج طويلة الأجل أكثر؟'),
    [L('Selling in panic and waiting on the sidelines', 'البيع بذعر والانتظار خارج السوق'), L('Sticking to the plan', 'الالتزام بالخطة'), L('Continuing regular contributions', 'الاستمرار في المساهمات المنتظمة')], 0,
    L('Selling after a fall locks in the loss, and waiting outside often means missing the recovery.', 'البيع بعد الهبوط يثبّت الخسارة، والانتظار خارج السوق كثيرًا ما يعني تفويت التعافي.')),
  mcq(P, W, 7, 'behaviour',
    L('Buying whatever went up most last year is called…', 'شراء ما ارتفع أكثر في العام الماضي يُسمى…'),
    [L('Chasing performance', 'مطاردة الأداء'), L('Rebalancing', 'إعادة التوازن'), L('Hedging', 'التحوط')], 0,
    L('Chasing performance means buying last year’s winner, often after its price has already risen.', 'مطاردة الأداء تعني شراء رابح العام الماضي، غالبًا بعد أن يكون سعره قد ارتفع بالفعل.')),
  mcq(P, W, 8, 'diversification',
    L('You own 20 companies in equal amounts and one goes bankrupt. Roughly how much do you lose?', 'تملك 20 شركة بمبالغ متساوية وأفلست إحداها. كم تخسر تقريبًا؟'),
    [L('About 5%', 'نحو 5%'), L('About 50%', 'نحو 50%'), L('Everything', 'كل شيء')], 0,
    L('One company out of twenty is a twentieth of your money: about 5%.', 'شركة واحدة من عشرين تعني جزءًا من عشرين من مالك: نحو 5%.')),
  mcq(P, W, 9, 'allocation',
    L('Who can usually live with a growth mix that has large swings?', 'من يستطيع عادةً تحمّل مزيج نمو بتقلبات كبيرة؟'),
    [L('Someone who will not need the money for 20+ years', 'شخص لن يحتاج المال قبل 20 سنة أو أكثر'), L('Someone buying a house next year', 'شخص سيشتري منزلًا العام القادم'), L('Someone who would panic at a 10% fall', 'شخص سيهلع من هبوط 10%')], 0,
    L('A long horizon gives time to recover from falls. Money needed soon, or nerves that would sell in a fall, call for a calmer mix.', 'الأفق الطويل يمنح وقتًا للتعافي من الهبوط. أما المال المطلوب قريبًا أو الأعصاب التي ستبيع عند الهبوط فتحتاج مزيجًا أهدأ.')),
  mcq(P, W, 10, 'fees',
    L('Which of these can you control?', 'أي مما يلي يمكنك التحكم فيه؟'),
    [L('The fees you pay', 'الرسوم التي تدفعها'), L('Next year’s market return', 'عائد السوق في العام القادم'), L('Interest rate decisions', 'قرارات أسعار الفائدة')], 0,
    L('Nobody controls returns or rates, but you choose what you pay, and every saved fee keeps compounding for you.', 'لا أحد يتحكم في العوائد أو الفائدة، لكنك تختار ما تدفعه، وكل رسم توفّره يواصل التراكم لصالحك.')),
  mcq(P, W, 11, 'rebalancing',
    L('Your example mix is 60% stocks, 30% bonds and 10% cash. After a rally, stocks are 70%. What does rebalancing do?', 'مزيجك المثال 60% أسهم و30% سندات و10% نقد. بعد صعود قوي أصبحت الأسهم 70%. ماذا تفعل إعادة التوازن؟'),
    [L('Sells some stocks and buys bonds and cash back to 60/30/10', 'تبيع بعض الأسهم وتشتري سندات ونقدًا للعودة إلى 60/30/10'), L('Buys more stocks, since they are rising', 'تشتري مزيدًا من الأسهم لأنها ترتفع'), L('Sells everything and holds cash', 'تبيع كل شيء وتحتفظ بالنقد')], 0,
    L('The rally made the portfolio riskier than you chose. Rebalancing trims what grew and tops up what fell behind, back to your mix.', 'الصعود جعل المحفظة أكثر مخاطرة مما اخترت. إعادة التوازن تقلّص ما نما وتكمّل ما تأخر، لتعود إلى مزيجك.')),
  mcq(P, W, 12, 'rebalancing',
    L('Every trade in the simulator pays a 1% fee. Why not rebalance every single week?', 'كل صفقة في المحاكي تدفع رسومًا بنسبة 1%. لماذا لا تعيد التوازن كل أسبوع؟'),
    [L('The fees add up, while small drifts barely change your risk', 'لأن الرسوم تتراكم، بينما الانحرافات الصغيرة بالكاد تغيّر مخاطرتك'), L('Rebalancing is not allowed more than once a season', 'لأن إعادة التوازن غير مسموحة أكثر من مرة في الموسم'), L('Rebalancing always loses money', 'لأن إعادة التوازن تخسر المال دائمًا')], 0,
    L('Each trade costs something. Rebalancing on a schedule, or when the mix has drifted a lot, keeps the risk in line without paying fees for tiny moves.', 'لكل صفقة تكلفة. إعادة التوازن وفق جدول، أو عندما ينحرف المزيج كثيرًا، تُبقي المخاطرة في حدودها دون دفع رسوم على تحركات صغيرة.')),
]

export const diversification: Module = {
  id: W,
  courseId: 'investing',
  order: 3,
  cover: cover(
    L('Foundations · Module 3', 'الأساسيات · الوحدة 3'),
    L('Diversification, costs &amp; behaviour', 'التنويع والتكاليف والسلوك'),
    L('≈ 30 min', '≈ 30 دقيقة'),
  ),
  sections: [
    section({
      id: 'diversify',
      lessons: ['diversify'],
      label: L('Part 1', 'الجزء ١'),
      nav: L('Diversification', 'التنويع'),
      title: L('Don’t put all your eggs in one basket', 'لا تضع كل البيض في سلة واحدة'),
      standfirst: L('The bakery chain has a bad week. Karim finds out why spreading out matters.', 'سلسلة المخابز تمر بأسبوع سيئ. يكتشف كريم لماذا يهم التوزيع.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Bad news: the bakery chain Karim owns shares in is caught selling stale bread, and its shares drop 40% in a week. Karim’s index fund barely moves. Some risks belong to <strong>one company</strong>; others hit <strong>the whole market</strong> at once. Can you tell them apart?</p>',
          '<p>خبر سيئ: سلسلة المخابز التي يملك كريم أسهمًا فيها ضُبطت تبيع خبزًا قديمًا، فهبطت أسهمها 40% في أسبوع. أما صندوق المؤشر لدى كريم فبالكاد تحرك. بعض المخاطر تخص <strong>شركة واحدة</strong>، وبعضها يصيب <strong>السوق كله</strong> معًا. هل تستطيع التمييز بينها؟</p>',
        )),
        sort(
          L('One company, or the whole market?', 'شركة واحدة أم السوق كله؟'),
          [L('One company', 'شركة واحدة'), L('Whole market', 'السوق كله')],
          [
            [L('A bakery’s scandal over stale bread', 'فضيحة مخابز بسبب الخبز القديم'), 0],
            [L('A recession across the country', 'ركود في أنحاء البلاد'), 1],
            [L('A phone maker’s new model flops', 'فشل الطراز الجديد لشركة هواتف'), 0],
            [L('Interest rates jump for everyone', 'قفزة في أسعار الفائدة على الجميع'), 1],
          ],
          L(
            'One company’s trouble is specific risk: spreading out shrinks it. A recession or a rate jump is market risk: it hits almost everything, however spread out you are.',
            'متاعب شركة واحدة مخاطر خاصة: التوزيع يقلّصها. أما الركود أو قفزة الفائدة فمخاطر سوق: تصيب كل شيء تقريبًا مهما وزّعت.',
          ),
        ),
        html(L(
          '<p>That is <strong>diversification</strong>. Put the same money into one company, or spread it over twenty. If one company fails, the first loses <strong>everything</strong>; the second loses about <strong>a twentieth</strong>. But no amount of spreading removes <strong>market risk</strong>.</p>',
          '<p>هذا هو <strong>التنويع</strong>. ضع المال نفسه في شركة واحدة، أو وزّعه على عشرين. إذا فشلت شركة، يخسر الأول <strong>كل شيء</strong>؛ ويخسر الثاني نحو <strong>جزء من عشرين</strong>. لكن لا يزيل أي قدر من التوزيع <strong>مخاطر السوق</strong>.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('One basket or twenty', 'سلة واحدة أم عشرون'),
          src: '/diagrams/diversify.svg',
          alt: L(
            'Left: all the money in one company that fails, a loss of 100%. Right: the money spread over 20 companies, one fails, a loss of about 5%.',
            'يسارًا: كل المال في شركة واحدة تفشل، خسارة 100%. يمينًا: المال موزع على 20 شركة تفشل إحداها، خسارة نحو 5%.',
          ),
          caption: L('Left: one company. Right: twenty companies, one fails. Illustrative.', 'يسارًا: شركة واحدة. يمينًا: عشرون شركة تفشل إحداها. توضيحي.'),
        }),
        keyIdea(L(
          '<p>Diversification shrinks the damage from <strong>one bad company</strong>, but not from a fall of the whole market.</p>',
          '<p>التنويع يقلّص ضرر <strong>شركة سيئة واحدة</strong>، لا ضرر هبوط السوق كله.</p>',
        )),
        exercise('invd-q001'),
        exercise('invd-q008'),
      ],
    }),
    section({
      id: 'allocation',
      lessons: ['allocation'],
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Asset allocation', 'توزيع الأصول'),
      title: L('Asset allocation: the biggest decision', 'توزيع الأصول: القرار الأكبر'),
      standfirst: L('How much in stocks, how much in bonds? Noor has to choose.', 'كم في الأسهم وكم في السندات؟ على نور أن تختار.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Noor is putting money aside for retirement, 30 years away. She knows herself: when Karim’s bakery shares fell 40%, she lost sleep just watching. She has to split her money between <strong>stocks</strong> and <strong>bonds</strong>, and the split will decide most of her ups and downs.</p>',
          '<p>تدّخر نور لتقاعدها بعد 30 سنة. وهي تعرف نفسها: عندما هبطت أسهم مخابز كريم 40%، فقدت نومها لمجرد المشاهدة. عليها أن تقسم مالها بين <strong>الأسهم</strong> و<strong>السندات</strong>، وهذا التقسيم سيحدد معظم صعودها وهبوطها.</p>',
        )),
        choice(L('Which mix would you pick for Noor’s retirement money?', 'أي مزيج كنت ستختاره لمال تقاعد نور؟'), [
          [
            L('Cautious: 30% stocks, 70% bonds', 'حذِر: 30% أسهم و70% سندات'),
            L('Smaller falls she can sleep through, but slower expected growth over 30 years. She may need to save more to reach the same goal.', 'هبوط أصغر يمكنها النوم معه، لكن نموًا متوقعًا أبطأ على مدى 30 سنة. قد تحتاج إلى ادخار أكثر لتبلغ الهدف نفسه.'),
          ],
          [
            L('Balanced: 60% stocks, 40% bonds', 'متوازن: 60% أسهم و40% سندات'),
            L('A middle path: real falls in bad years, steadier than all-stocks, and more expected growth than the cautious mix.', 'طريق وسط: هبوط حقيقي في السنوات السيئة، وثبات أكبر من الأسهم وحدها، ونمو متوقع أكثر من المزيج الحذِر.'),
          ],
          [
            L('Growth: 90% stocks, 10% bonds', 'نمو: 90% أسهم و10% سندات'),
            L('The most expected growth over 30 years, and the deepest falls. It only works if she would not sell in a panic when it drops by a third.', 'أعلى نمو متوقع على مدى 30 سنة، وأعمق هبوط. لا ينجح إلا إذا لم تبِع بذعر عندما ينخفض بمقدار الثلث.'),
          ],
        ]),
        html(L(
          '<p>Your split between stocks, bonds and cash is your <strong>asset allocation</strong>. It drives most of a portfolio’s swings, so it depends on three things: how long until you need the money, what it is for, and how big a fall you can live with without selling.</p>',
          '<p>تقسيمك بين الأسهم والسندات والنقد هو <strong>توزيع أصولك</strong>. إنه يحدد معظم تقلبات المحفظة، لذا يعتمد على ثلاثة أمور: المدة حتى تحتاج المال، والغرض منه، وحجم الهبوط الذي تتحمله دون أن تبيع.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('A bad year for each mix', 'عام سيئ لكل مزيج'),
          src: '/diagrams/mixes.svg',
          alt: L('Worst-year falls: 30% stocks / 70% bonds −8%, 60/40 −18%, 90/10 −30%.', 'هبوط أسوأ عام: 30% أسهم / 70% سندات −8%، و60/40 −18%، و90/10 −30%.'),
          caption: L('Stocks / bonds, in a bad year. Illustrative figures, not forecasts.', 'أسهم / سندات، في عام سيئ. أرقام توضيحية لا توقعات.'),
        }),
        box('keypoint', L('Not a recommendation', 'ليست توصية'), L(
          'These mixes only show the trade-off between growth and swings. The right one for anyone depends on their own goals, time and nerves.',
          'هذه الأمزجة توضح المفاضلة بين النمو والتقلبات فقط. المزيج المناسب لأي شخص يعتمد على أهدافه ووقته وأعصابه.',
        )),
        keyIdea(L(
          '<p>Your mix of stocks, bonds and cash sets <strong>most of your risk</strong>, so choose it for your horizon, not for last year’s winner.</p>',
          '<p>مزيجك من الأسهم والسندات والنقد يحدد <strong>معظم مخاطرتك</strong>، فاختره وفق أفقك الزمني لا وفق رابح العام الماضي.</p>',
        )),
        exercise('invd-q002'),
        exercise('invd-q009'),
      ],
    }),
    section({
      id: 'fees',
      lessons: ['fees'],
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Costs and fees', 'التكاليف والرسوم'),
      title: L('Small fees, big difference', 'رسوم صغيرة وفرق كبير'),
      standfirst: L('You cannot control returns, but you can control costs.', 'لا يمكنك التحكم في العوائد، لكن يمكنك التحكم في التكاليف.'),
      time: L('5 min', '5 دقائق'),
      blocks: [
        html(L(
          '<p>Karim finally reads the small print. His fund charges <strong>1% a year</strong>; a similar index fund charges 0.1%. “It’s less than one percent,” he shrugs. Say he leaves 10,000 for 30 years at 6% a year before fees. Guess what that small gap costs him.</p>',
          '<p>قرأ كريم أخيرًا التفاصيل الصغيرة. صندوقه يفرض <strong>1% سنويًا</strong>؛ وصندوق مؤشر مشابه يفرض 0.1%. يهز كتفيه: «أقل من واحد بالمئة». لنفترض أنه ترك 10,000 مدة 30 سنة بعائد 6% سنويًا قبل الرسوم. خمّن كم يكلّفه هذا الفرق الصغير.</p>',
        )),
        predict(
          L('After 30 years, how much more is in the 0.1% fund?', 'بعد 30 سنة، كم يزيد ما في الصندوق ذي الـ0.1%؟'),
          [L('About 300', 'نحو 300'), L('About 2,700', 'نحو 2,700'), L('About 12,600', 'نحو 12,600'), L('About 40,000', 'نحو 40,000')],
          2,
          L(
            'About 12,600: some 55,800 against 43,200. The gap is not 0.9% of 10,000 thirty times; each fee also takes the growth that money would have earned. (Illustrative figures.)',
            'نحو 12,600: قرابة 55,800 مقابل 43,200. الفرق ليس 0.9% من 10,000 ثلاثين مرة؛ فكل رسم يأخذ أيضًا النمو الذي كان سيحققه ذلك المال. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>Fees <strong>compound against you</strong>, just as returns compound for you. On 100,000 the same gap grows to about <strong>126,000</strong>. Watch trading commissions and account fees too: unlike returns, costs are something you control.</p>',
          '<p>الرسوم <strong>تتراكم ضدك</strong>، تمامًا كما تتراكم العوائد لصالحك. على 100,000 يكبر الفرق نفسه إلى نحو <strong>126,000</strong>. انتبه أيضًا لعمولات التداول ورسوم الحساب: على عكس العوائد، التكاليف أمر تتحكم فيه.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Two fees, thirty years', 'رسمان وثلاثون سنة'),
          src: '/diagrams/fees.svg',
          alt: L(
            'Line chart: 100,000 grows to about 558,000 with a 0.1% fee and to about 432,000 with a 1% fee after 30 years, a gap of about 126,000.',
            'رسم بالخطوط: 100,000 تنمو إلى نحو 558,000 برسوم 0.1% وإلى نحو 432,000 برسوم 1% بعد 30 سنة، بفارق نحو 126,000.',
          ),
          caption: L('Years from now. Dark: 0.1% fee. Light: 1% fee. Illustrative figures.', 'السنوات من الآن. الداكن: رسوم 0.1%. الفاتح: رسوم 1%. أرقام توضيحية.'),
        }),
        box('example', L('Example', 'مثال'), L(
          'Like a phone subscription you forgot to cancel, a fund fee is small each time but never stops. And unlike the subscription, it also takes the growth that money would have earned.',
          'مثل اشتراك هاتف نسيت إلغاءه، رسوم الصندوق صغيرة في كل مرة لكنها لا تتوقف. وعلى عكس الاشتراك، تأخذ أيضًا النمو الذي كان سيحققه ذلك المال.',
        )),
        keyIdea(L(
          '<p>You cannot control returns, but you can control <strong>costs</strong>, and fees compound against you.</p>',
          '<p>لا يمكنك التحكم في العوائد، لكن يمكنك التحكم في <strong>التكاليف</strong>، والرسوم تتراكم ضدك.</p>',
        )),
        exercise('invd-q003'),
        exercise('invd-q010'),
      ],
    }),
    section({
      id: 'habits',
      lessons: ['habits'],
      label: L('Part 4', 'الجزء ٤'),
      nav: L('Regular investing & rebalancing', 'الاستثمار الدوري وإعادة التوازن'),
      title: L('Habits that help', 'عادات مفيدة'),
      standfirst: L('Noor stops guessing the right moment, and lets a habit do it.', 'تتوقف نور عن تخمين اللحظة المناسبة، وتترك العادة تقوم بذلك.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>Noor doesn’t want to guess when to buy, so she invests <strong>100 every month</strong>, on payday, whatever the market does. In month one the price is 10. In month two the market slumps and it is 5. In month three it is back at 10.</p>',
          '<p>نور لا تريد أن تخمّن متى تشتري، فهي تستثمر <strong>100 كل شهر</strong> يوم الراتب، مهما فعل السوق. في الشهر الأول كان السعر 10. وفي الشهر الثاني تراجع السوق فصار 5. وفي الشهر الثالث عاد إلى 10.</p>',
        )),
        predict(
          L('How many units does Noor own after three months?', 'كم وحدة تملك نور بعد ثلاثة أشهر؟'),
          [L('30', '30'), L('35', '35'), L('40', '40'), L('45', '45')],
          2,
          L(
            '40: 10 units, then 20 in the slump, then 10. The same 100 bought twice as much when prices were low. (Illustrative figures.)',
            '40: عشر وحدات، ثم 20 أثناء التراجع، ثم 10. المبلغ نفسه، 100، اشترى الضعف عندما انخفضت الأسعار. (أرقام توضيحية.)',
          ),
        ),
        html(L(
          '<p>That is <strong>dollar-cost averaging</strong>: the same amount on a schedule. It buys more when prices are low and less when they are high, with no need to guess the “right moment”, which even professionals rarely manage.</p>',
          '<p>هذا هو <strong>متوسط التكلفة</strong>: المبلغ نفسه وفق جدول ثابت. يشتري أكثر عندما تنخفض الأسعار وأقل عندما ترتفع، دون الحاجة إلى تخمين «اللحظة المناسبة»، وهو أمر نادرًا ما ينجح فيه حتى المحترفون.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('100 a month, three prices', '100 شهريًا وثلاثة أسعار'),
          src: '/diagrams/dca.svg',
          alt: L('Units bought each month with 100: 10 at a price of 10, 20 at a price of 5, 10 at a price of 10.', 'الوحدات المشتراة كل شهر بـ100: عشر بسعر 10، و20 بسعر 5، و10 بسعر 10.'),
          caption: L('Units bought each month; the price is under each bar. Illustrative figures.', 'الوحدات المشتراة كل شهر؛ السعر تحت كل عمود. أرقام توضيحية.'),
        }),
        html(L(
          '<p>The second habit is <strong>rebalancing</strong>. Winners grow into a bigger share: with a 60/40 target, a year where stocks gain 30% and bonds 2% leaves you near 66/34. Once a year, or when a weight drifts more than about 5 points, trim the winner and top up the rest.</p>',
          '<p>العادة الثانية هي <strong>إعادة التوازن</strong>. الرابحون يكبر وزنهم: مع هدف 60/40، عام ترتفع فيه الأسهم 30% والسندات 2% يتركك قرب 66/34. مرة في السنة، أو عندما ينحرف وزن بأكثر من 5 نقاط تقريبًا، قلّص الرابح وأكمل الباقي.</p>',
        )),
        keyIdea(L(
          '<p>Invest a <strong>fixed amount regularly</strong> and rebalance now and then: no need to guess the right moment.</p>',
          '<p>استثمر <strong>مبلغًا ثابتًا بانتظام</strong> وأعد التوازن بين حين وآخر: لا حاجة لتخمين اللحظة المناسبة.</p>',
        )),
        exercise('invd-q004'),
        exercise('invd-q005'),
      ],
    }),
    section({
      id: 'behaviour',
      lessons: ['behaviour'],
      label: L('Part 5', 'الجزء ٥'),
      nav: L('Behaviour mistakes', 'الأخطاء السلوكية'),
      title: L('Your biggest risk is often you', 'أكبر خطر عليك غالبًا هو أنت'),
      standfirst: L('The market falls 30%. What Karim does next matters more than any fund he picked.', 'يهبط السوق 30%. ما يفعله كريم بعدها أهم من أي صندوق اختاره.'),
      time: L('6 min', '6 دقائق'),
      blocks: [
        html(L(
          '<p>The whole market falls 30%. Karim’s group chat is in panic: one friend sold everything, another is buying a coin everyone is talking about. Karim checks his app twenty times a day. Most investing mistakes are not about knowledge; they are about <strong>behaviour</strong>.</p>',
          '<p>يهبط السوق كله 30%. مجموعة أصدقاء كريم في حالة ذعر: أحدهم باع كل شيء، وآخر يشتري عملة يتحدث عنها الجميع. وكريم يتفقد تطبيقه عشرين مرة في اليوم. معظم أخطاء الاستثمار ليست في المعرفة؛ بل في <strong>السلوك</strong>.</p>',
        )),
        sort(
          L('Does it help or hurt in a fall?', 'هل يفيد أم يضر في وقت الهبوط؟'),
          [L('Helps', 'يفيد'), L('Hurts', 'يضر')],
          [
            [L('A plan written before the fall', 'خطة مكتوبة قبل الهبوط'), 0],
            [L('Buying what everyone is talking about', 'شراء ما يتحدث عنه الجميع'), 1],
            [L('Checking the app twenty times a day', 'تفقد التطبيق عشرين مرة يوميًا'), 1],
            [L('Investing the same amount every month', 'استثمار المبلغ نفسه كل شهر'), 0],
          ],
          L(
            'A written plan and a fixed habit decide for you before fear does. Chasing the crowd and staring at prices push you to act on emotion.',
            'الخطة المكتوبة والعادة الثابتة تقرران عنك قبل أن يقرر الخوف. أما ملاحقة الجموع والتحديق في الأسعار فيدفعانك للتصرف بعاطفة.',
          ),
        ),
        html(L(
          '<p>Selling in a crash turns a fall on the screen into a real loss. In the chart, 1,000 drops to 700. Held, it is back above 1,000 a few years later; sold at the bottom, it stays 700 for good.</p>',
          '<p>البيع أثناء الانهيار يحوّل الهبوط على الشاشة إلى خسارة حقيقية. في الرسم، تهبط 1,000 إلى 700. إن احتُفظ بها، تعود فوق 1,000 بعد بضع سنوات؛ وإن بيعت في القاع، تبقى 700 إلى الأبد.</p>',
        )),
        diagram({
          fig: L('Illustration', 'توضيح'),
          title: L('Held or sold at the bottom', 'محتفَظ به أم مبيع في القاع'),
          src: '/diagrams/panic-sell.svg',
          alt: L('Bars: 1,000 before a fall, 700 at the bottom, 1,100 a few years later if held, and 700 if sold at the bottom.', 'أعمدة: 1,000 قبل الهبوط، و700 في القاع، و1,100 بعد بضع سنوات إن احتُفظ بها، و700 إن بيعت في القاع.'),
          caption: L('Left to right: before, the bottom, later if held, later if sold. Illustrative: recoveries are not guaranteed.', 'من اليسار إلى اليمين: قبل، القاع، لاحقًا إن احتُفظ بها، لاحقًا إن بيعت. توضيحي: التعافي غير مضمون.'),
        }),
        table(
          [L('Mistake', 'الخطأ'), L('What it looks like', 'كيف يبدو'), L('Antidote', 'العلاج')],
          [
            [L('Panic selling', 'البيع بذعر'), L('Selling after a crash, locking in the loss', 'البيع بعد الانهيار وتثبيت الخسارة'), L('Write your plan down before the fall', 'دوّن خطتك قبل الهبوط')],
            [L('Chasing performance', 'مطاردة الأداء'), L('Buying last year’s winner at a high price', 'شراء رابح العام الماضي بسعر مرتفع'), L('Stick to your allocation', 'التزم بتوزيع أصولك')],
            [L('Overconfidence', 'الثقة المفرطة'), L('Frequent trading, concentrated bets', 'تداول متكرر ورهانات مركزة'), L('Diversify; trade rarely', 'نوّع وتداول نادرًا')],
            [L('Herd behaviour / FOMO', 'سلوك القطيع / الخوف من الفوات'), L('Buying because everyone is talking about it', 'الشراء لأن الجميع يتحدث عنه'), L('Ask: does this fit my goals?', 'اسأل: هل يناسب أهدافي؟')],
          ],
        ),
        box('analogy', L('Analogy', 'تشبيه'), L(
          'Investing is like growing a tree: digging it up every week to check the roots does not make it grow faster.',
          'الاستثمار كزراعة شجرة: اقتلاعها كل أسبوع لفحص الجذور لا يجعلها تنمو أسرع.',
        )),
        keyIdea(L(
          '<p>Your written plan protects you from <strong>yourself</strong>: decide what you will do before the market falls.</p>',
          '<p>خطتك المكتوبة تحميك من <strong>نفسك</strong>: قرّر ما ستفعله قبل أن يهبط السوق.</p>',
        )),
        exercise('invd-q006'),
        exercise('invd-q007'),
        takeaways([
          L('Diversify across companies, sectors and countries', 'نوّع بين الشركات والقطاعات والدول'),
          L('Asset allocation sets most of your risk', 'توزيع الأصول يحدد معظم مخاطرتك'),
          L('Keep costs low — fees compound too', 'أبقِ التكاليف منخفضة — الرسوم تتراكم أيضًا'),
          L('Invest regularly, rebalance, and don’t panic', 'استثمر بانتظام، وأعد التوازن، ولا تهلع'),
        ]),
      ],
    }),
    section({
      id: 'practice-rebalance',
      lessons: ['practice-rebalance'],
      label: L('Practice', 'تدريب'),
      nav: L('Rebalance', 'إعادة التوازن'),
      title: L('Practice: rebalance to a mix', 'تدريب: أعد التوازن إلى مزيج'),
      standfirst: L(
        'Noor’s stocks have grown past her target. Bring a mix back in one step.',
        'نمت أسهم نور فوق هدفها. أعِد مزيجًا إلى توازنه بخطوة واحدة.',
      ),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<p>Try rebalancing with <strong>play money</strong> and simulated prices (practice, not advice). Make a first buy if you have not yet. Under <strong>Where your money is</strong>, tap <strong>Rebalance</strong> and pick an example mix: Cautious, Balanced or Growth, each split between the World Stocks ETF, Government Bonds and Safe Savings. Check the trades and fees, then tap <strong>Rebalance now</strong>.</p>',
          '<p>جرّب إعادة التوازن بـ<strong>مال افتراضي</strong> وأسعار محاكاة (للتدريب، لا نصيحة). اشترِ أولًا إن لم تفعل بعد. تحت <strong>أين أموالك</strong>، اضغط <strong>إعادة التوازن</strong> واختر مزيجًا مثالًا: حذِر أو متوازن أو نمو، وكلٌّ منها موزّع بين صندوق الأسهم العالمية والسندات الحكومية والادخار الآمن. راجع الصفقات والرسوم، ثم اضغط <strong>أعد التوازن الآن</strong>.</p>',
        )),
        practice('rebalance'),
        keyIdea(L(
          '<p>Rebalancing <strong>sells what grew too big and buys what fell behind</strong>, so your risk stays where you chose it.</p>',
          '<p>إعادة التوازن <strong>تبيع ما كبر أكثر من حصته وتشتري ما تأخر</strong>، فتبقى مخاطرتك حيث اخترتها.</p>',
        )),
        exercise('invd-q011'),
        exercise('invd-q012'),
      ],
    }),
  ],
  questions,
}
