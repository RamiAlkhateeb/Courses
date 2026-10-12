// Original course content. The coffee-cart numbers are a made-up worked example; tax is ignored to keep it simple.
import type { Module } from '../../types'
import { L, box, cover, exercise, formula, html, mcq, objectives, section, table, takeaways } from '../../helpers'

const W = 'statements'
const P = 'accs'

const questions = [
  mcq(P, W, 1, 'balance-sheet',
    L('Which statement shows what a business owns and owes on one specific date?', 'أي قائمة تُظهر ما يملكه العمل وما عليه في تاريخ محدد؟'),
    [L('Balance sheet', 'الميزانية العمومية'), L('Income statement', 'قائمة الدخل'), L('Cash flow statement', 'قائمة التدفقات النقدية')], 0),
  mcq(P, W, 2, 'equation',
    L('Assets are 50,000 and liabilities are 20,000. What is equity?', 'الأصول 50,000 والخصوم 20,000. كم حقوق الملكية؟'),
    [L('30,000', '30,000'), L('70,000', '70,000'), L('20,000', '20,000')], 0),
  mcq(P, W, 3, 'income-statement',
    L('Revenue 10,000, cost of goods sold 4,000, operating expenses 3,500. Net profit (ignoring tax)?', 'الإيرادات 10,000، وتكلفة البضاعة المباعة 4,000، والمصاريف التشغيلية 3,500. صافي الربح (مع تجاهل الضريبة)؟'),
    [L('2,500', '2,500'), L('6,000', '6,000'), L('6,500', '6,500')], 0),
  mcq(P, W, 4, 'cash-flow',
    L('Buying a delivery van for cash appears in which part of the cash flow statement?', 'شراء شاحنة توصيل نقدًا يظهر في أي جزء من قائمة التدفقات النقدية؟'),
    [L('Investing activities', 'الأنشطة الاستثمارية'), L('Operating activities', 'الأنشطة التشغيلية'), L('Financing activities', 'الأنشطة التمويلية')], 0),
  mcq(P, W, 5, 'profit-vs-cash',
    L('Why can a profitable business still run out of cash?', 'لماذا قد ينفد النقد من عمل رابح؟'),
    [L('Sales are counted as revenue when made, even if customers have not paid yet', 'تُسجَّل المبيعات كإيرادات عند حدوثها، حتى لو لم يدفع العملاء بعد'), L('Profit is always the same as cash', 'الربح يساوي النقد دائمًا'), L('Banks take all profits', 'البنوك تأخذ كل الأرباح')], 0),
  mcq(P, W, 6, 'depreciation',
    L('Depreciation is…', 'الإهلاك هو…'),
    [L('Spreading the cost of a long-lived asset over its useful life — an expense that uses no cash that month', 'توزيع تكلفة أصل طويل الأجل على عمره الإنتاجي — مصروف لا يستهلك نقدًا في ذلك الشهر'), L('A cash payment to the tax office', 'دفعة نقدية لمصلحة الضرائب'), L('Money owed by customers', 'مال مستحق على العملاء')], 0),
]

export const statements: Module = {
  id: W,
  courseId: 'accounting',
  order: 1,
  cover: cover(L('Foundations · Module 1', 'الأساسيات · الوحدة 1'), L('The three financial statements', 'القوائم المالية الثلاث'), L('≈ 30 min', '≈ 30 دقيقة')),
  sections: [
    section({
      id: 'overview',
      label: L('Intro', 'مقدمة'),
      nav: L('Overview', 'نظرة عامة'),
      title: L('Three views of one business', 'ثلاث نظرات إلى عمل واحد'),
      standfirst: L('Every business reports three statements. Each answers a different question.', 'كل عمل يُصدر ثلاث قوائم، وكل منها تجيب عن سؤال مختلف.'),
      time: L('3 min', '3 دقائق'),
      blocks: [
        objectives([
          L('Read an income statement, a balance sheet and a cash flow statement', 'قراءة قائمة الدخل والميزانية العمومية وقائمة التدفقات النقدية'),
          L('Use the accounting equation', 'استخدام المعادلة المحاسبية'),
          L('Explain why profit and cash differ', 'شرح سبب اختلاف الربح عن النقد'),
        ]),
        table(
          [L('Statement', 'القائمة'), L('Question it answers', 'السؤال الذي تجيب عنه'), L('Covers', 'تغطي')],
          [
            [L('Income statement (P&amp;L)', 'قائمة الدخل (الأرباح والخسائر)'), L('Did we make a profit?', 'هل حققنا ربحًا؟'), L('A period (month, year)', 'فترة (شهر، سنة)')],
            [L('Balance sheet', 'الميزانية العمومية'), L('What do we own and owe?', 'ماذا نملك وماذا علينا؟'), L('One date', 'تاريخ واحد')],
            [L('Cash flow statement', 'قائمة التدفقات النقدية'), L('Where did the cash come from and go?', 'من أين جاء النقد وإلى أين ذهب؟'), L('A period', 'فترة')],
          ],
        ),
        box('example', L('Running example', 'المثال المستمر'), L(
          'Sara opens a coffee cart. She invests 15,000 of her own money and buys an espresso machine for 12,000 (expected to last 5 years). In month one she sells 10,000 of coffee: 8,000 paid in cash and 2,000 invoiced to an office that pays next month. She pays 3,000 for beans and cups, 2,500 wages and 1,000 rent.',
          'تفتتح سارة عربة قهوة. تستثمر 15,000 من مالها الخاص وتشتري آلة إسبريسو بـ12,000 (يُتوقع أن تعمل 5 سنوات). في الشهر الأول تبيع قهوة بـ10,000: منها 8,000 نقدًا و2,000 بفاتورة لمكتب يدفع الشهر القادم. وتدفع 3,000 للبن والأكواب، و2,500 أجورًا، و1,000 إيجارًا.',
        )),
      ],
    }),
    section({
      id: 'income-statement',
      label: L('Part 1', 'الجزء ١'),
      nav: L('Income statement', 'قائمة الدخل'),
      title: L('Income statement: did we make money?', 'قائمة الدخل: هل ربحنا؟'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        formula('Revenue − Expenses = Net profit', L('Revenue is recorded when the sale is made, not when cash arrives', 'تُسجَّل الإيرادات عند البيع، لا عند وصول النقد')),
        table(
          [L('Sara’s coffee cart, month 1', 'عربة قهوة سارة، الشهر الأول'), L('Amount', 'المبلغ')],
          [
            [L('Revenue', 'الإيرادات'), L('10,000', '10,000')],
            [L('− Cost of goods sold (beans, cups)', '− تكلفة البضاعة المباعة (البن، الأكواب)'), L('(3,000)', '(3,000)')],
            [L('<strong>= Gross profit</strong>', '<strong>= مجمل الربح</strong>'), L('<strong>7,000</strong>', '<strong>7,000</strong>')],
            [L('− Wages', '− الأجور'), L('(2,500)', '(2,500)')],
            [L('− Rent', '− الإيجار'), L('(1,000)', '(1,000)')],
            [L('− Depreciation (12,000 ÷ 60 months)', '− الإهلاك (12,000 ÷ 60 شهرًا)'), L('(200)', '(200)')],
            [L('<strong>= Net profit</strong>', '<strong>= صافي الربح</strong>'), L('<strong>3,300</strong>', '<strong>3,300</strong>')],
          ],
        ),
        box('keypoint', L('Depreciation', 'الإهلاك'), L(
          'The machine is not an expense of month one alone — it will make coffee for 5 years. So its cost is spread out: 200 a month. No cash leaves when depreciation is recorded.',
          'الآلة ليست مصروفًا للشهر الأول وحده — ستعمل 5 سنوات. لذلك تُوزَّع تكلفتها: 200 شهريًا. لا يخرج أي نقد عند تسجيل الإهلاك.',
        )),
        exercise('accs-q003'),
        exercise('accs-q006'),
      ],
    }),
    section({
      id: 'balance-sheet',
      label: L('Part 2', 'الجزء ٢'),
      nav: L('Balance sheet', 'الميزانية العمومية'),
      title: L('Balance sheet: a snapshot', 'الميزانية العمومية: لقطة في لحظة'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        formula('Assets = Liabilities + Equity', L('The accounting equation — it always balances', 'المعادلة المحاسبية — دائمًا متوازنة')),
        html(L(
          '<p><strong>Assets</strong>: what the business owns or is owed (cash, receivables, equipment). <strong>Liabilities</strong>: what it owes others (loans, unpaid bills). <strong>Equity</strong>: what belongs to the owners — the money they put in plus profits kept in the business.</p>',
          '<p><strong>الأصول</strong>: ما يملكه العمل أو المستحق له (النقد، الذمم المدينة، المعدات). <strong>الخصوم</strong>: ما يدين به للآخرين (القروض، الفواتير غير المدفوعة). <strong>حقوق الملكية</strong>: ما يخص المالكين — المال الذي ضخوه إضافة إلى الأرباح المحتجزة في العمل.</p>',
        )),
        table(
          [L('End of month 1', 'نهاية الشهر الأول'), L('Amount', 'المبلغ')],
          [
            [L('Cash', 'النقد'), L('4,500', '4,500')],
            [L('Accounts receivable (office invoice)', 'الذمم المدينة (فاتورة المكتب)'), L('2,000', '2,000')],
            [L('Machine (12,000 − 200 depreciation)', 'الآلة (12,000 − 200 إهلاك)'), L('11,800', '11,800')],
            [L('<strong>Total assets</strong>', '<strong>إجمالي الأصول</strong>'), L('<strong>18,300</strong>', '<strong>18,300</strong>')],
            [L('Liabilities', 'الخصوم'), L('0', '0')],
            [L('Owner’s capital', 'رأس مال المالك'), L('15,000', '15,000')],
            [L('Retained profit', 'الأرباح المحتجزة'), L('3,300', '3,300')],
            [L('<strong>Total liabilities + equity</strong>', '<strong>إجمالي الخصوم + حقوق الملكية</strong>'), L('<strong>18,300</strong>', '<strong>18,300</strong>')],
          ],
        ),
        exercise('accs-q001'),
        exercise('accs-q002'),
      ],
    }),
    section({
      id: 'cash-flow',
      label: L('Part 3', 'الجزء ٣'),
      nav: L('Cash flow statement', 'قائمة التدفقات النقدية'),
      title: L('Cash flow statement: follow the cash', 'قائمة التدفقات النقدية: تتبّع النقد'),
      time: L('7 min', '7 دقائق'),
      blocks: [
        table(
          [L('Section', 'القسم'), L('Sara, month 1', 'سارة، الشهر الأول')],
          [
            [L('<strong>Operating</strong>: cash from customers − cash paid for costs (8,000 − 6,500)', '<strong>التشغيلية</strong>: النقد من العملاء − النقد المدفوع للتكاليف (8,000 − 6,500)'), L('+1,500', '+1,500')],
            [L('<strong>Investing</strong>: buying the machine', '<strong>الاستثمارية</strong>: شراء الآلة'), L('−12,000', '−12,000')],
            [L('<strong>Financing</strong>: Sara’s own money in', '<strong>التمويلية</strong>: مال سارة الخاص'), L('+15,000', '+15,000')],
            [L('<strong>Net change in cash</strong>', '<strong>صافي التغير في النقد</strong>'), L('<strong>+4,500</strong>', '<strong>+4,500</strong>')],
          ],
        ),
        box('keypoint', L('Profit ≠ cash', 'الربح ≠ النقد'), L(
          'Sara made 3,300 profit but operations brought in only 1,500 cash. The gap: 2,000 still owed by the office, partly offset by the 200 depreciation that used no cash (3,300 + 200 − 2,000 = 1,500).',
          'حققت سارة ربحًا قدره 3,300 لكن العمليات جلبت 1,500 نقدًا فقط. الفرق: 2,000 ما زال المكتب مدينًا بها، يقابلها جزئيًا إهلاك 200 لم يستهلك نقدًا (3,300 + 200 − 2,000 = 1,500).',
        )),
        box('mistake', L('Common mistake', 'خطأ شائع'), L(
          'Watching only profit. Many growing businesses fail not because they are unprofitable but because they run out of cash while waiting for customers to pay.',
          'مراقبة الربح فقط. كثير من الأعمال النامية تفشل ليس لأنها خاسرة، بل لأن نقدها ينفد أثناء انتظار سداد العملاء.',
        )),
        exercise('accs-q004'),
        exercise('accs-q005'),
      ],
    }),
    section({
      id: 'connections',
      label: L('Summary', 'ملخص'),
      nav: L('How they connect', 'كيف ترتبط'),
      title: L('How the statements connect', 'كيف ترتبط القوائم'),
      time: L('3 min', '3 دقائق'),
      blocks: [
        html(L(
          '<ul><li>Net profit from the income statement is added to <strong>retained profit</strong> on the balance sheet.</li><li>The cash flow statement explains the change in the <strong>cash</strong> line of the balance sheet.</li><li>The cash flow’s operating section starts from net profit and adjusts for non-cash items and timing differences.</li></ul>',
          '<ul><li>يُضاف صافي الربح من قائمة الدخل إلى <strong>الأرباح المحتجزة</strong> في الميزانية العمومية.</li><li>تشرح قائمة التدفقات النقدية التغير في بند <strong>النقد</strong> في الميزانية العمومية.</li><li>يبدأ القسم التشغيلي من صافي الربح ويعدّله بالبنود غير النقدية وفروق التوقيت.</li></ul>',
        )),
        takeaways([
          L('Income statement: profit over a period', 'قائمة الدخل: الربح خلال فترة'),
          L('Balance sheet: Assets = Liabilities + Equity, on one date', 'الميزانية العمومية: الأصول = الخصوم + حقوق الملكية في تاريخ واحد'),
          L('Cash flow: operating, investing, financing', 'التدفقات النقدية: تشغيلية، استثمارية، تمويلية'),
          L('Profit and cash are different — watch both', 'الربح والنقد مختلفان — راقب كليهما'),
        ]),
      ],
    }),
  ],
  questions,
}
