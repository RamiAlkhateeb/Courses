// Investing terms explained in one line, shown when a learner taps a term in a lesson (`markTerms` in
// src/domain/glossary.ts finds them). `match` lists the forms as they appear in lesson text; longer forms first is not
// needed (the matcher sorts them). Educational definitions only.
import type { Localized } from './types'
import { L } from './helpers'

export interface GlossaryTerm {
  id: string
  /** The headword shown on the definition card */
  term: Localized
  match: { en: string[]; ar: string[] }
  def: Localized
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'etf',
    term: L('ETF (exchange-traded fund)', 'صندوق المؤشرات المتداول (ETF)'),
    match: { en: ['ETFs', 'ETF', 'exchange-traded funds', 'exchange-traded fund'], ar: ['صناديق المؤشرات المتداولة', 'صندوق المؤشرات المتداول', 'ETF'] },
    def: L('A fund that holds many investments at once and trades on the stock market like a single share.', 'صندوق يضم استثمارات كثيرة في آن واحد ويُتداول في سوق الأسهم كأنه سهم واحد.'),
  },
  {
    id: 'index-fund',
    term: L('Index fund', 'صندوق المؤشر'),
    match: { en: ['index funds', 'index fund'], ar: ['صناديق المؤشرات', 'صندوق المؤشر', 'صناديق المؤشر'] },
    def: L('A fund that simply copies a market index, such as the biggest companies of a country, at a low cost.', 'صندوق ينسخ مؤشرًا للسوق ببساطة، مثل أكبر شركات بلد ما، وبتكلفة منخفضة.'),
  },
  {
    id: 'compounding',
    term: L('Compounding', 'الفائدة المركبة'),
    match: { en: ['compound interest', 'compounding'], ar: ['الفائدة المركبة', 'العائد المركب'] },
    def: L('Growth on growth: returns are added to the pot, and the next year earns returns on them too.', 'نمو على النمو: تُضاف العوائد إلى الرصيد، فيربح العام التالي عوائد عليها أيضًا.'),
  },
  {
    id: 'inflation',
    term: L('Inflation', 'التضخم'),
    match: { en: ['inflation'], ar: ['التضخم'] },
    def: L('The general rise in prices over time, so the same money buys a little less each year.', 'الارتفاع العام في الأسعار مع الوقت، فيشتري المال نفسه أقل قليلًا كل عام.'),
  },
  {
    id: 'diversification',
    term: L('Diversification', 'التنويع'),
    match: { en: ['diversification', 'diversify', 'diversified'], ar: ['التنويع'] },
    def: L('Spreading money across many investments, so one bad result can only do limited damage.', 'توزيع المال على استثمارات كثيرة، فلا تُحدث نتيجة سيئة واحدة إلا ضررًا محدودًا.'),
  },
  {
    id: 'dividend',
    term: L('Dividend', 'توزيعات الأرباح'),
    match: { en: ['dividends', 'dividend'], ar: ['توزيعات الأرباح', 'الأرباح الموزعة', 'الأرباح الموزّعة'] },
    def: L('A share of a company’s profit paid out in cash to the people who own its shares.', 'جزء من أرباح الشركة يُدفع نقدًا لمن يملكون أسهمها.'),
  },
  {
    id: 'bond',
    term: L('Bond', 'السند'),
    match: { en: ['bonds', 'bond'], ar: ['السندات'] },
    def: L('A loan you make to a government or company: it pays you interest and returns the money at the end.', 'قرض تمنحه لحكومة أو شركة: يدفع لك فائدة ويعيد المال في النهاية.'),
  },
  {
    id: 'stock',
    term: L('Stock (share)', 'السهم'),
    match: { en: ['stocks', 'stock'], ar: ['الأسهم'] },
    def: L('A small piece of ownership in a company. Its price rises and falls with how the company is expected to do.', 'حصة صغيرة من ملكية شركة. يرتفع سعرها وينخفض بحسب التوقعات لأداء الشركة.'),
  },
  {
    id: 'volatility',
    term: L('Volatility', 'التقلب'),
    match: { en: ['volatility', 'volatile'], ar: ['التقلب', 'التقلّب'] },
    def: L('How much and how fast a price swings up and down. More volatility means a bumpier ride.', 'مقدار تأرجح السعر صعودًا وهبوطًا وسرعته. تقلب أكثر يعني رحلة أكثر اضطرابًا.'),
  },
  {
    id: 'asset-allocation',
    term: L('Asset allocation', 'توزيع الأصول'),
    match: { en: ['asset allocation', 'asset mix'], ar: ['توزيع الأصول', 'مزيج الأصول'] },
    def: L('How your money is split between types of investment, such as stocks, bonds and cash.', 'طريقة تقسيم أموالك بين أنواع الاستثمار، مثل الأسهم والسندات والنقد.'),
  },
  {
    id: 'rebalancing',
    term: L('Rebalancing', 'إعادة التوازن'),
    match: { en: ['rebalancing', 'rebalance'], ar: ['إعادة التوازن'] },
    def: L('Selling a little of what grew and buying what fell behind, to get back to the mix you chose.', 'بيع قليل مما نما وشراء ما تأخر، للعودة إلى المزيج الذي اخترته.'),
  },
  {
    id: 'fees',
    term: L('Expense ratio', 'نسبة المصروفات'),
    match: { en: ['expense ratios', 'expense ratio'], ar: ['نسبة المصروفات', 'نسبة المصاريف'] },
    def: L('The yearly fee a fund charges, as a share of your money in it: 0.2% costs $2 a year per $1,000.', 'الرسوم السنوية التي يتقاضاها الصندوق كنسبة من أموالك فيه: 0.2% تكلف 2$ سنويًا لكل 1,000$.'),
  },
  {
    id: 'emergency-fund',
    term: L('Emergency fund', 'صندوق الطوارئ'),
    match: { en: ['emergency funds', 'emergency fund'], ar: ['صندوق الطوارئ', 'صندوق طوارئ'] },
    def: L('Savings kept safe and easy to reach for surprises, often a few months of essential costs.', 'مدخرات محفوظة بأمان وسهلة الوصول للمفاجآت، غالبًا تكاليف أساسية لبضعة أشهر.'),
  },
  {
    id: 'interest-rate',
    term: L('Interest rate', 'سعر الفائدة'),
    match: { en: ['interest rates', 'interest rate'], ar: ['أسعار الفائدة', 'سعر الفائدة'] },
    def: L('The price of borrowing money, as a yearly percentage. Savers earn it; borrowers pay it.', 'ثمن اقتراض المال كنسبة سنوية. المدخرون يربحونه والمقترضون يدفعونه.'),
  },
  {
    id: 'reit',
    term: L('REIT (property fund)', 'صندوق الاستثمار العقاري (REIT)'),
    match: { en: ['REITs', 'REIT'], ar: ['صناديق الاستثمار العقاري', 'صندوق الاستثمار العقاري', 'REIT'] },
    def: L('A fund that owns buildings and pays out most of the rent it collects to its investors.', 'صندوق يملك مبانيَ ويوزع معظم الإيجار الذي يحصّله على مستثمريه.'),
  },
  {
    id: 'pe',
    term: L('P/E ratio', 'مكرر الربحية (P/E)'),
    match: { en: ['P/E ratio', 'P/E'], ar: ['مكرر الربحية', 'مضاعف الربحية', 'P/E'] },
    def: L('Share price divided by profit per share: how many years of today’s profit the price pays for.', 'سعر السهم مقسومًا على ربح السهم: كم سنة من أرباح اليوم يدفع ثمنها السعر.'),
  },
  {
    id: 'liquidity',
    term: L('Liquidity', 'السيولة'),
    match: { en: ['liquidity', 'liquid'], ar: ['السيولة'] },
    def: L('How quickly something can be turned into cash without losing value.', 'مدى سرعة تحويل الشيء إلى نقد دون خسارة في قيمته.'),
  },
  {
    id: 'dca',
    term: L('Dollar-cost averaging', 'متوسط التكلفة'),
    match: { en: ['dollar-cost averaging', 'pound-cost averaging'], ar: ['متوسط تكلفة الدولار', 'متوسط التكلفة'] },
    def: L('Investing the same amount on a schedule, so you buy more when prices are low and less when high.', 'استثمار المبلغ نفسه وفق جدول ثابت، فتشتري أكثر حين تنخفض الأسعار وأقل حين ترتفع.'),
  },
  {
    id: 'risk-tolerance',
    term: L('Risk tolerance', 'تحمّل المخاطر'),
    match: { en: ['risk tolerance'], ar: ['تحمّل المخاطر', 'تحمل المخاطر'] },
    def: L('How much ups and downs you can live with without selling in a panic.', 'مقدار الصعود والهبوط الذي تستطيع تقبّله دون أن تبيع في ذعر.'),
  },
]
