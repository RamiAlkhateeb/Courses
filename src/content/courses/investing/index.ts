import type { Course } from '../../courses'
import { L } from '../../helpers'

export const investing: Course = {
  id: 'investing',
  category: 'business',
  audiences: ['professionals'],
  title: L('Investing Fundamentals', 'أساسيات الاستثمار'),
  description: L(
    'How investing works: compounding, risk and return, the main asset classes, diversification, costs and the mistakes that hurt investors most.',
    'كيف يعمل الاستثمار: الفائدة المركبة، والمخاطرة والعائد، وفئات الأصول الرئيسية، والتنويع، والتكاليف، والأخطاء الأكثر ضررًا بالمستثمرين.',
  ),
  audience: L(
    'Beginners who want to understand how investing works before putting money in — no prior knowledge needed.',
    'للمبتدئين الذين يريدون فهم كيف يعمل الاستثمار قبل وضع أموالهم — دون معرفة مسبقة.',
  ),
  notice: L(
    'Educational content only — not financial advice. It does not consider your personal situation, and every investment can lose money. For decisions about your own money, talk to a licensed financial adviser.',
    'محتوى تعليمي فقط — وليس نصيحة مالية. لا يأخذ وضعك الشخصي في الاعتبار، وكل استثمار معرّض لخسارة المال. لقرارات تخص أموالك، استشر مستشارًا ماليًا مرخّصًا.',
  ),
  groups: [
    {
      label: L('Foundations', 'الأساسيات'),
      items: [
        { id: 'basics', title: L('How investing works', 'كيف يعمل الاستثمار') },
        { id: 'asset-classes', title: L('Asset classes', 'فئات الأصول') },
        { id: 'diversification', title: L('Diversification, costs & behaviour', 'التنويع والتكاليف والسلوك') },
      ],
    },
    {
      label: L('Going deeper', 'التعمق أكثر'),
      items: [
        { id: 'valuation', title: L('Reading a company: valuation basics', 'قراءة الشركة: أساسيات التقييم') },
        { id: 'retirement', title: L('Retirement & tax-advantaged accounts', 'التقاعد والحسابات ذات المزايا الضريبية') },
        { id: 'plan', title: L('Building your investment plan', 'بناء خطتك الاستثمارية') },
      ],
    },
  ],
  // Add a loader here (and a nav item above) when a module is written; items without one show "Soon".
  loaders: {
    basics: () => import('./basics').then((m) => m.basics),
    'asset-classes': () => import('./asset-classes').then((m) => m.assetClasses),
    diversification: () => import('./diversification').then((m) => m.diversification),
    valuation: () => import('./valuation').then((m) => m.valuation),
    retirement: () => import('./retirement').then((m) => m.retirement),
    plan: () => import('./plan').then((m) => m.plan),
  },
}
