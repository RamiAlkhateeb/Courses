// The Investing Fundamentals book: one chapter per unit, longer and more advanced than the lessons.
import type { Book } from '../../../book'
import { L } from '../../../helpers'
import { ch1 } from './ch1-basics'
import { ch2 } from './ch2-asset-classes'
import { ch3 } from './ch3-diversification'
import { ch4 } from './ch4-valuation'
import { ch5 } from './ch5-retirement'
import { ch6 } from './ch6-plan'

export const book: Book = {
  courseId: 'investing',
  title: L('Investing Fundamentals', 'أساسيات الاستثمار'),
  subtitle: L('A plain guide to how investing works, from first principles to a plan of your own', 'دليل واضح لكيف يعمل الاستثمار، من المبادئ الأولى إلى خطة خاصة بك'),
  preface: L(
    '<p>This book goes further than the lessons in the Zubda app. It covers the same course, unit by unit, in more depth: the reasoning behind each idea, the numbers that show it, and the mistakes it helps you avoid. You can read it from start to finish or open any chapter on its own.</p><p>Every figure in it is an illustration, worked out from simple assumptions to show how something behaves, not a forecast. The book names no real products, funds or companies, and it is not advice: it does not know your situation. For decisions about your own money, talk to a licensed financial adviser.</p>',
    '<p>يذهب هذا الكتاب أبعد من دروس تطبيق زبدة. فهو يغطي الدورة نفسها، وحدة بعد وحدة، بعمق أكبر: المنطق وراء كل فكرة، والأرقام التي تُظهرها، والأخطاء التي تساعدك على تجنبها. يمكنك قراءته من أوله إلى آخره أو فتح أي فصل وحده.</p><p>كل رقم فيه توضيح، محسوب من افتراضات بسيطة ليُظهر كيف يتصرف شيء ما، وليس توقعًا. لا يذكر الكتاب أي منتجات أو صناديق أو شركات حقيقية، وهو ليس نصيحة: فهو لا يعرف وضعك. لقرارات تخص أموالك، استشر مستشارًا ماليًا مرخّصًا.</p>',
  ),
  chapters: [ch1, ch2, ch3, ch4, ch5, ch6],
}
