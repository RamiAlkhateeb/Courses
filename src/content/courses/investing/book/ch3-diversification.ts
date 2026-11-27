// The book, chapter 3: diversification, costs and behaviour. Longer and more advanced than unit 3's lessons; no
// characters or questions. Figures are illustrations, not forecasts or advice.
import type { BookChapter } from '../../../book'
import { L, box, diagram, formula, html, table } from '../../../helpers'

export const ch3: BookChapter = {
  id: 'diversification',
  title: L('Diversification, costs and behaviour', 'التنويع والتكاليف والسلوك'),
  summary: L(
    'The three things an investor controls: how widely the money is spread, how much it costs, and how they behave when markets move. Together they decide more of the result than any single choice of investment.',
    'الأمور الثلاثة التي يتحكم بها المستثمر: مدى توزيع المال، وكم يكلّف، وكيف يتصرف حين تتحرك الأسواق. ومعًا تحدد من النتيجة أكثر مما يحدده أي اختيار منفرد لاستثمار.',
  ),
  blocks: [
    html(L(
      '<h2>3.1 Diversification: the only free lunch</h2><p>Investors often call diversification the only free lunch in finance: it lowers risk without lowering the return you can expect. The idea is that the things that sink one company, a failed product, a bad manager, a fraud, rarely strike all companies at once. Spread money across many and any single disaster can only do limited damage.</p><p>The numbers are stark. Put everything into one company that fails and you lose 100%. Spread the same money evenly over twenty companies and the same failure costs you 5%, while the other nineteen carry on. Over a hundred companies, one failure costs 1%.</p>',
      '<h2>3.1 التنويع: الوجبة المجانية الوحيدة</h2><p>كثيرًا ما يسمي المستثمرون التنويع الوجبة المجانية الوحيدة في عالم المال: فهو يخفض المخاطرة دون أن يخفض العائد الذي يمكنك توقعه. والفكرة أن ما يُغرق شركة واحدة، منتج فاشل أو مدير سيئ أو احتيال، نادرًا ما يضرب كل الشركات في وقت واحد. وزّع المال على كثير منها ولن تُحدث أي كارثة منفردة إلا ضررًا محدودًا.</p><p>الأرقام صارخة. ضع كل شيء في شركة واحدة تفلس تخسر 100%. ووزّع المال نفسه بالتساوي على عشرين شركة تكلّفك الكارثة نفسها 5%، بينما تواصل التسع عشرة الأخرى طريقها. وعلى مئة شركة يكلّف الإفلاس الواحد 1%.</p>',
    )),
    diagram({
      fig: L('Figure 3.1', 'الشكل 3.1'),
      title: L('One company fails', 'إفلاس شركة واحدة'),
      src: '/diagrams/diversify.svg',
      alt: L('All money in one company that fails: −100%. The same money spread over 20 companies, one fails: −5%.', 'كل المال في شركة واحدة تفلس: −100%. والمال نفسه موزعًا على 20 شركة تفلس إحداها: −5%.'),
      caption: L('Left: one company. Right: twenty. Illustrative figures.', 'اليسار: شركة واحدة. اليمين: عشرون. أرقام توضيحية.'),
    }),
    html(L(
      '<p>Diversification has a limit, and it is important to know where it is. It removes the risk that belongs to single companies, called <strong>specific risk</strong>. It cannot remove the risk that belongs to the whole market, called <strong>market risk</strong>: in a recession or a crash, most shares fall together. That remaining risk is the one investors are paid to carry, and the only ways to reduce it are to hold other kinds of asset, such as bonds and cash, or to hold less in shares.</p><p>Spreading also works across more than companies: across sectors, so that a slump in one industry does not dominate; across countries, so that one economy\'s bad decade is not yours; and across time, by investing regularly rather than all at once.</p>',
      '<p>للتنويع حد، ومن المهم معرفة مكانه. فهو يزيل المخاطر الخاصة بالشركات المنفردة، وتُسمى <strong>المخاطر الخاصة</strong>. لكنه لا يستطيع إزالة المخاطر التي تخص السوق كله، وتُسمى <strong>مخاطر السوق</strong>: ففي الركود أو الانهيار تهبط معظم الأسهم معًا. هذه المخاطر المتبقية هي التي يحصل المستثمرون على مقابل لتحمّلها، والطريقتان الوحيدتان لتقليلها هما امتلاك أنواع أخرى من الأصول، كالسندات والنقد، أو تقليل الحصة في الأسهم.</p><p>ويصلح التوزيع لأكثر من الشركات: عبر القطاعات، حتى لا يطغى ركود صناعة واحدة؛ وعبر البلدان، حتى لا يصبح العقد السيئ لاقتصاد واحد عقدك أنت؛ وعبر الزمن، بالاستثمار المنتظم بدل الاستثمار دفعة واحدة.</p>',
    )),
    box('mistake', L('The trap of the familiar', 'فخ المألوف'), L(
      'People tend to hold too much of what they know: their own country, their own industry, the company they work for. Owning a lot of your employer\'s shares is the riskiest version, because a bad year for the company could cost you your savings and your income at the same time.',
      'يميل الناس إلى امتلاك الكثير مما يعرفونه: بلدهم وصناعتهم والشركة التي يعملون فيها. وامتلاك كثير من أسهم جهة العمل هو أخطر الصور، لأن عامًا سيئًا للشركة قد يكلّفك مدخراتك ودخلك في الوقت نفسه.',
    )),
    html(L(
      '<h2>3.2 Asset allocation: the decision that matters most</h2><p>The split between shares, bonds and cash, your <strong>asset allocation</strong>, shapes both how much a portfolio can grow and how far it can fall. A mix of 90% shares and 10% bonds will usually grow faster over decades than 30% shares and 70% bonds, and it will also fall much further in a bad year. There is no mix that is best for everyone; there is only the mix that suits a particular goal, a particular time until the money is needed, and a particular person\'s ability to sit through falls.</p>',
      '<h2>3.2 توزيع الأصول: القرار الأهم</h2><p>إن تقسيم المال بين الأسهم والسندات والنقد، أي <strong>توزيع الأصول</strong>، يحدد كم يمكن أن تنمو المحفظة وإلى أي حد يمكن أن تهبط. مزيج من 90% أسهم و10% سندات ينمو عادةً أسرع على مدى عقود من 30% أسهم و70% سندات، لكنه يهبط أيضًا أكثر بكثير في عام سيئ. لا يوجد مزيج هو الأفضل للجميع؛ بل يوجد فقط المزيج الذي يناسب هدفًا محددًا، ووقتًا محددًا حتى الحاجة إلى المال، وقدرة شخص بعينه على الصبر خلال الهبوطات.</p>',
    )),
    diagram({
      fig: L('Figure 3.2', 'الشكل 3.2'),
      title: L('The worst year for three mixes', 'أسوأ عام لثلاثة أمزجة'),
      src: '/diagrams/mixes.svg',
      alt: L('Illustrative worst year for three mixes of shares and bonds: 30/70 falls 8%, 60/40 falls 18%, 90/10 falls 30%.', 'أسوأ عام توضيحي لثلاثة أمزجة من الأسهم والسندات: 30/70 يهبط 8%، و60/40 يهبط 18%، و90/10 يهبط 30%.'),
      caption: L('Shares/bonds, in per cent. Illustrative figures, not forecasts.', 'أسهم/سندات، بالنسبة المئوية. أرقام توضيحية وليست توقعات.'),
    }),
    table(
      [L('Mix (shares/bonds)', 'المزيج (أسهم/سندات)'), L('Growth over decades', 'النمو على مدى عقود'), L('A bad year', 'عام سيئ'), L('Often suits', 'يناسب غالبًا')],
      [
        [L('30/70', '30/70'), L('Modest', 'متواضع'), L('Small falls', 'هبوطات صغيرة'), L('Money needed within a few years', 'مال يُحتاج خلال سنوات قليلة')],
        [L('60/40', '60/40'), L('Moderate', 'متوسط'), L('Noticeable falls', 'هبوطات ملحوظة'), L('Medium horizons, a balanced temper', 'آفاق متوسطة، ومزاج متوازن')],
        [L('90/10', '90/10'), L('Highest', 'الأعلى'), L('Deep falls', 'هبوطات عميقة'), L('Decades away, and calm in a crash', 'عقود قادمة، وهدوء في الانهيار')],
      ],
    ),
    html(L(
      '<h2>3.3 Costs: the return you can be sure of</h2><p>Chapter 1 showed how a 1% yearly fee can take more than a quarter of a 30-year result. Fees come in several forms, and all of them compound against you: the yearly <strong>expense ratio</strong> of a fund; trading costs and spreads each time you buy or sell; account or platform fees; and, less visibly, taxes triggered by frequent selling. A simple test is to add up everything you pay in a year as a share of what you hold. Each 1% saved is 1% more return, every year, guaranteed.</p>',
      '<h2>3.3 التكاليف: العائد الذي يمكنك التأكد منه</h2><p>بيّن الفصل الأول كيف يمكن لرسوم سنوية قدرها 1% أن تأخذ أكثر من ربع نتيجة 30 سنة. وللرسوم أشكال عدة، وكلها تتضاعف ضدك: <strong>نسبة المصروفات</strong> السنوية للصندوق؛ وتكاليف التداول والفروق عند كل شراء أو بيع؛ ورسوم الحساب أو المنصة؛ وبشكل أقل ظهورًا، الضرائب التي يُطلقها البيع المتكرر. والاختبار البسيط أن تجمع كل ما تدفعه في عام كنسبة مما تملكه. كل 1% توفّره هو 1% عائد إضافي، كل عام، بشكل مضمون.</p>',
    )),
    formula('net return ≈ gross return − all costs', L('A fund returning 7% before costs with 1.5% in fees leaves about 5.5%; at 0.2% it leaves about 6.8%. Illustrative figures.', 'صندوق يعود بـ7% قبل التكاليف وبرسوم 1.5% يترك نحو 5.5%، وبرسوم 0.2% يترك نحو 6.8%. أرقام توضيحية.')),
    html(L(
      '<h2>3.4 Investing regularly</h2><p>Most people invest from income, a little each month. That habit has a useful side effect. Investing a fixed amount on a schedule, known as <strong>dollar-cost averaging</strong>, means you automatically buy more units when prices are low and fewer when they are high. Put 100 in each month at prices of 10, 5 and 10 and you buy 10, 20 and 10 units: 40 units for 300, an average cost of 7.50, below the average price of 8.33.</p><p>Regular investing does not guarantee a profit or protect against a falling market. Its real value is behavioural: it removes the question of <em>when</em> to invest, and it keeps you buying through falls, which is exactly when buying is cheapest and hardest to do.</p>',
      '<h2>3.4 الاستثمار المنتظم</h2><p>يستثمر معظم الناس من دخلهم، قليلًا كل شهر. ولهذه العادة أثر جانبي مفيد. فاستثمار مبلغ ثابت وفق جدول، ويُعرف باسم <strong>متوسط التكلفة</strong>، يعني أنك تشتري تلقائيًا وحدات أكثر حين تكون الأسعار منخفضة وأقل حين تكون مرتفعة. ضع 100 كل شهر بأسعار 10 ثم 5 ثم 10 فتشتري 10 ثم 20 ثم 10 وحدات: 40 وحدة مقابل 300، بمتوسط تكلفة 7.50، وهو أقل من متوسط السعر 8.33.</p><p>الاستثمار المنتظم لا يضمن ربحًا ولا يحمي من سوق هابطة. قيمته الحقيقية سلوكية: فهو يلغي سؤال <em>متى</em> تستثمر، ويبقيك تشتري خلال الهبوطات، وهو بالضبط الوقت الذي يكون فيه الشراء أرخص وأصعب.</p>',
    )),
    diagram({
      fig: L('Figure 3.3', 'الشكل 3.3'),
      title: L('The same amount buys more when prices fall', 'المبلغ نفسه يشتري أكثر حين تنخفض الأسعار'),
      src: '/diagrams/dca.svg',
      alt: L('100 invested each month at prices 10, 5 and 10 buys 10, 20 and 10 units.', '100 تُستثمر كل شهر بأسعار 10 و5 و10 تشتري 10 و20 و10 وحدات.'),
      caption: L('Units bought each month, with the price below. Illustrative figures.', 'الوحدات المشتراة كل شهر، والسعر أسفلها. أرقام توضيحية.'),
    }),
    html(L(
      '<h2>3.5 Rebalancing: keeping the mix you chose</h2><p>A mix does not stay put. After a strong year for shares, a 60/40 portfolio might drift to 66/34, quietly taking on more risk than you chose. <strong>Rebalancing</strong> means selling a little of what has grown and buying what has fallen behind, to return to the target. It feels backwards, selling winners and buying losers, and that is part of its value: it makes you buy low and sell high by rule rather than by feeling.</p><p>Two simple methods work. Rebalance on a calendar, once a year for example, or whenever a part drifts more than a set amount, say five percentage points, from its target. Using new money to top up whatever is below target avoids selling at all, which saves fees and, in taxable accounts, taxes.</p>',
      '<h2>3.5 إعادة التوازن: الحفاظ على المزيج الذي اخترته</h2><p>المزيج لا يبقى على حاله. فبعد عام قوي للأسهم قد تنجرف محفظة 60/40 إلى 66/34، فتحمل بصمت مخاطرة أكبر مما اخترت. و<strong>إعادة التوازن</strong> تعني بيع قليل مما نما وشراء ما تأخر، للعودة إلى الهدف. يبدو الأمر معكوسًا، بيع الرابحين وشراء الخاسرين، وهذا جزء من قيمته: فهو يجعلك تشتري بسعر منخفض وتبيع بسعر مرتفع وفق قاعدة لا وفق شعور.</p><p>هناك طريقتان بسيطتان. أعد التوازن وفق التقويم، مرة في العام مثلًا، أو كلما انجرف جزء عن هدفه بأكثر من مقدار محدد، كخمس نقاط مئوية. واستخدام المال الجديد لتعزيز ما هو دون الهدف يغني عن البيع أصلًا، فيوفّر الرسوم، وفي الحسابات الخاضعة للضريبة، الضرائب.</p>',
    )),
    html(L(
      '<h2>3.6 Behaviour: the biggest risk is the investor</h2><p>Studies of real investors find the same pattern again and again: the returns people actually earn are lower than the returns of the funds they hold. The gap comes from timing. People buy after prices have risen, when they feel confident, and sell after prices have fallen, when they feel afraid. The investment did fine; the investor did not.</p><p>The most expensive version is selling in a panic. Suppose 1,000 falls to 700 in a crash. Held, it may recover to 1,100 a few years later. Sold at the bottom, it stays 700, and the fall that was temporary becomes permanent. The market\'s best days often come right after its worst, so stepping out to wait for calm usually means missing the recovery.</p>',
      '<h2>3.6 السلوك: الخطر الأكبر هو المستثمر نفسه</h2><p>تجد دراسات المستثمرين الحقيقيين النمط نفسه مرة بعد مرة: العوائد التي يحققها الناس فعلًا أقل من عوائد الصناديق التي يملكونها. والفجوة تأتي من التوقيت. يشتري الناس بعد أن ترتفع الأسعار، حين يشعرون بالثقة، ويبيعون بعد أن تهبط، حين يشعرون بالخوف. لقد أدّى الاستثمار جيدًا؛ أما المستثمر فلا.</p><p>أكثر الصور كلفة هو البيع بذعر. افترض أن 1,000 هبطت إلى 700 في انهيار. إن احتُفظ بها فقد تتعافى إلى 1,100 بعد بضع سنوات. وإن بيعت في القاع تبقى 700، ويصبح الهبوط المؤقت دائمًا. وكثيرًا ما تأتي أفضل أيام السوق مباشرة بعد أسوئها، فالخروج لانتظار الهدوء يعني عادةً تفويت التعافي.</p>',
    )),
    diagram({
      fig: L('Figure 3.4', 'الشكل 3.4'),
      title: L('Selling at the bottom makes a fall permanent', 'البيع في القاع يجعل الهبوط دائمًا'),
      src: '/diagrams/panic-sell.svg',
      alt: L('1,000 falls to 700. Held, it is 1,100 a few years later; sold at the bottom, it stays 700.', '1,000 تهبط إلى 700. إن احتُفظ بها تصبح 1,100 بعد بضع سنوات، وإن بيعت في القاع تبقى 700.'),
      caption: L('Two paths from the same fall. Illustrative figures.', 'مساران من الهبوط نفسه. أرقام توضيحية.'),
    }),
    table(
      [L('Common mistake', 'خطأ شائع'), L('What it looks like', 'كيف يبدو'), L('A defence', 'وسيلة دفاع')],
      [
        [L('Chasing performance', 'مطاردة الأداء'), L('Buying last year\'s winner', 'شراء رابح العام الماضي'), L('Stick to the mix you chose', 'التزم بالمزيج الذي اخترته')],
        [L('Panic selling', 'البيع بذعر'), L('Selling after a big fall', 'البيع بعد هبوط كبير'), L('An emergency fund, a written plan', 'صندوق طوارئ وخطة مكتوبة')],
        [L('Overconfidence', 'الثقة المفرطة'), L('Trading often, a few big bets', 'التداول المتكرر ورهانات كبيرة قليلة'), L('Broad funds, fewer decisions', 'صناديق واسعة وقرارات أقل')],
        [L('Checking constantly', 'المتابعة المستمرة'), L('Reacting to every daily move', 'التفاعل مع كل حركة يومية'), L('Look less often, rebalance on a schedule', 'انظر أقل، وأعد التوازن وفق جدول')],
        [L('Following the crowd', 'اتباع الجموع'), L('Buying what everyone talks about', 'شراء ما يتحدث عنه الجميع'), L('Ask: does this fit my goal and date?', 'اسأل: هل يناسب هذا هدفي وموعده؟')],
      ],
    ),
    box('keypoint', L('Make the good choice automatic', 'اجعل الخيار الجيد تلقائيًا'), L(
      'The most reliable defence against your own feelings is to decide in advance: a written mix, an automatic monthly investment and a rule for rebalancing. Then a crash calls for no decision at all.',
      'أكثر وسائل الدفاع موثوقية ضد مشاعرك هو أن تقرر مسبقًا: مزيج مكتوب، واستثمار شهري تلقائي، وقاعدة لإعادة التوازن. عندها لا يتطلب الانهيار أي قرار على الإطلاق.',
    )),
    html(L(
      '<h2>3.7 Correlation in plain words</h2><p>Diversification works best when holdings do not move together. The measure of how closely two investments move is <strong>correlation</strong>. Two holdings that always rise and fall together add little to each other; two that often move differently smooth the whole. Shares of companies in the same industry tend to move closely; shares and high-quality government bonds have often moved differently, especially in sharp falls, which is why bonds earn a place beside shares even though they grow more slowly.</p><p>Correlations are not fixed. In a panic, many risky assets fall together, and the protection from holding several kinds of shares shrinks just when it is wanted most. That is the deeper reason a plan keeps some money in truly different assets, such as high-quality bonds and cash, and not only in many kinds of shares.</p>',
      '<h2>3.7 الارتباط بكلمات بسيطة</h2><p>يعمل التنويع على أفضل وجه حين لا تتحرك الممتلكات معًا. ومقياس مدى تحرك استثمارين معًا هو <strong>الارتباط</strong>. فحيازتان ترتفعان وتهبطان معًا دائمًا لا تضيف إحداهما للأخرى إلا القليل؛ أما اللتان تتحركان بشكل مختلف كثيرًا فتهدئان الكل. أسهم الشركات في الصناعة نفسها تميل إلى التحرك معًا عن قرب؛ أما الأسهم والسندات الحكومية عالية الجودة فكثيرًا ما تحركت بشكل مختلف، خصوصًا في الهبوطات الحادة، ولهذا تستحق السندات مكانًا بجانب الأسهم مع أنها تنمو أبطأ.</p><p>الارتباطات ليست ثابتة. ففي حالة الذعر تهبط كثير من الأصول الخطرة معًا، وتتقلص الحماية التي يوفرها امتلاك أنواع عدة من الأسهم تمامًا حين تكون الحاجة إليها أشد. وهذا هو السبب الأعمق لاحتفاظ الخطة ببعض المال في أصول مختلفة حقًا، كالسندات عالية الجودة والنقد، لا في أنواع كثيرة من الأسهم فقط.</p>',
    )),
    box('example', L('Worked example: a rebalance', 'مثال محلول: إعادة توازن'), L(
      'A 60/40 portfolio of 10,000 holds 6,000 in shares and 4,000 in bonds. Shares then rise 20% and bonds stay flat: 7,200 and 4,000, a total of 11,200, now 64.3% shares. The target for shares is 60% of 11,200, or 6,720. Selling 480 of shares and buying 480 of bonds restores 60/40. Directing the next 480 or so of new money to bonds would do the same without selling. Illustrative figures.',
      'محفظة 60/40 قيمتها 10,000 تضم 6,000 في الأسهم و4,000 في السندات. ثم ترتفع الأسهم 20% وتبقى السندات ثابتة: 7,200 و4,000، بمجموع 11,200، صارت الأسهم فيه 64.3%. هدف الأسهم 60% من 11,200، أي 6,720. وبيع 480 من الأسهم وشراء 480 من السندات يعيد 60/40. وتوجيه نحو 480 من المال الجديد التالي إلى السندات يحقق الشيء نفسه دون بيع. أرقام توضيحية.',
    )),
    html(L(
      '<h2>Chapter summary</h2><ul><li>Diversification removes the risk of single companies, not of the whole market.</li><li>Asset allocation, the split between shares, bonds and cash, shapes both growth and falls more than any single pick.</li><li>Costs are a certain drag; every 1% saved is 1% more return each year.</li><li>Regular investing removes the timing question and keeps you buying through falls.</li><li>Rebalancing keeps the risk you chose and enforces buying low and selling high.</li><li>The investor\'s own behaviour is the largest risk; decide in advance and automate.</li></ul>',
      '<h2>خلاصة الفصل</h2><ul><li>التنويع يزيل مخاطر الشركات المنفردة، لا مخاطر السوق كله.</li><li>توزيع الأصول بين الأسهم والسندات والنقد يحدد النمو والهبوط أكثر من أي اختيار منفرد.</li><li>التكاليف عبء مؤكد؛ وكل 1% توفّره هو 1% عائد إضافي كل عام.</li><li>الاستثمار المنتظم يلغي سؤال التوقيت ويبقيك تشتري خلال الهبوطات.</li><li>إعادة التوازن تحافظ على المخاطرة التي اخترتها وتفرض الشراء بسعر منخفض والبيع بسعر مرتفع.</li><li>سلوك المستثمر نفسه هو أكبر خطر؛ قرر مسبقًا واجعل الأمور تلقائية.</li></ul>',
    )),
  ],
}
