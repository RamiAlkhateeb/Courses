// The book's appendix: every formula used in the chapters, in one place, with the chapter it comes from.
import { L, table } from '../../../helpers'

export const formulas = {
  id: 'formulas',
  title: L('Formulas at a glance', 'المعادلات في لمحة'),
  blocks: [
    table(
      [L('Formula', 'المعادلة'), L('What it gives', 'ما تعطيه'), L('Chapter', 'الفصل')],
      [
        [L('r = (1 + n) ÷ (1 + i) − 1', 'r = (1 + n) ÷ (1 + i) − 1'), L('The real return from a nominal return n and inflation i', 'العائد الحقيقي من عائد اسمي n وتضخم i'), L('1.2', '1.2')],
        [L('FV = P × (1 + r) ^ t', 'FV = P × (1 + r) ^ t'), L('What an amount P grows to at a yearly return r over t years', 'ما يصبح عليه مبلغ P بعائد سنوي r خلال t سنة'), L('1.4', '1.4')],
        [L('72 ÷ r', '72 ÷ r'), L('Roughly how many years money takes to double at r% a year', 'تقريبًا كم سنة يحتاجها المال ليتضاعف بنسبة r% سنويًا'), L('1.4', '1.4')],
        [L('M = FV × r ÷ ((1 + r) ^ n − 1)', 'M = FV × r ÷ ((1 + r) ^ n − 1)'), L('The monthly saving M that reaches a goal FV in n months at a monthly return r', 'الادخار الشهري M الذي يبلغ هدفًا FV خلال n شهرًا بعائد شهري r'), L('1.8', '1.8')],
        [L('net return ≈ gross return − all costs', 'العائد الصافي ≈ العائد الإجمالي − كل التكاليف'), L('What is left after fees', 'ما يتبقى بعد الرسوم'), L('3.3', '3.3')],
        [L('margin = profit ÷ revenue', 'الهامش = الربح ÷ الإيرادات'), L('How much of each sale becomes profit', 'كم من كل عملية بيع يصبح ربحًا'), L('4.2', '4.2')],
        [L('P/E = price ÷ earnings per share', 'المكرر = السعر ÷ ربحية السهم'), L('How many years of today\'s profit the price pays for', 'كم سنة من ربح اليوم يدفع السعر ثمنها'), L('4.3', '4.3')],
        [L('yield = dividend ÷ price', 'العائد = التوزيعات ÷ السعر'), L('Cash paid each year per 100 of price', 'النقد المدفوع سنويًا لكل 100 من السعر'), L('4.4', '4.4')],
        [L('equity = assets − liabilities', 'حقوق الملكية = الأصول − الالتزامات'), L('What belongs to the owners', 'ما يخص المالكين'), L('4.5', '4.5')],
        [L('target ≈ 25 × yearly need', 'الهدف ≈ 25 × الاحتياج السنوي'), L('A rough retirement savings target (the 4% rule of thumb)', 'هدف تقريبي لمدخرات التقاعد (قاعدة 4% التقريبية)'), L('5.4', '5.4')],
      ],
    ),
  ],
}
