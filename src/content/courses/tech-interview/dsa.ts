// Original teaching content. Problem statements follow the LeetCode problems the author practised in
// solutions/ (Two Sum, Valid Parentheses, Climbing Stairs, Binary Search, ...); the code shown here is the
// clean pattern solution in each language, not a copy of the practice files.
import type { Block, Module } from '../../types'
import { COURSE_ID, cover, heading, html, mcq } from './helpers'

const W = 'dsa'

/** Python / C# / JavaScript tabs for one solution. */
const code = (py: string, cs: string, js: string): Block => ({
  type: 'tabs',
  tabs: [
    { label: { en: 'Python' }, blocks: [{ type: 'code', code: py, lang: 'python' }] },
    { label: { en: 'C#' }, blocks: [{ type: 'code', code: cs, lang: 'csharp' }] },
    { label: { en: 'JavaScript' }, blocks: [{ type: 'code', code: js, lang: 'javascript' }] },
  ],
})

const pattern = (en: string, ar: string): Block => ({
  type: 'box',
  variant: 'keypoint',
  label: { en: 'Recognise it when…', ar: 'تعرّف عليه عندما…' },
  html: { en, ar },
})

const complexity = (en: string, ar: string): Block => ({
  type: 'box',
  variant: 'example',
  label: { en: 'Complexity', ar: 'التعقيد' },
  html: { en, ar },
})

const questions = [
  mcq('dsa', W, 1, 'complexity',
    { en: 'What is the time complexity of looking up a key in a hash map (average case)?', ar: 'ما التعقيد الزمني للبحث عن مفتاح في خريطة التجزئة (المتوسط)؟' },
    [{ en: 'O(1)', ar: 'O(1)' }, { en: 'O(n)', ar: 'O(n)' }, { en: 'O(log n)', ar: 'O(log n)' }], 0),
  mcq('dsa', W, 2, 'hash-map',
    { en: 'Two Sum with a hash map runs in…', ar: 'حل Two Sum بخريطة التجزئة يعمل في…' },
    [{ en: 'O(n) time, O(n) space', ar: 'زمن O(n) ومساحة O(n)' }, { en: 'O(n²) time, O(1) space', ar: 'زمن O(n²) ومساحة O(1)' }, { en: 'O(log n) time', ar: 'زمن O(log n)' }], 0),
  mcq('dsa', W, 3, 'two-pointers',
    { en: 'Which problem is a natural fit for two pointers?', ar: 'أي مسألة مناسبة بطبيعتها لنمط المؤشرين؟' },
    [{ en: 'Checking whether one string is a subsequence of another', ar: 'التحقق مما إذا كان نص تسلسلًا جزئيًا من نص آخر' }, { en: 'Counting word frequencies', ar: 'عدّ تكرار الكلمات' }, { en: 'Detecting a cycle with a visited set only', ar: 'اكتشاف دورة بمجموعة الزيارات فقط' }], 0),
  mcq('dsa', W, 4, 'sliding-window',
    { en: 'In a sliding window, when do you move the left edge?', ar: 'في النافذة المنزلقة، متى تحرّك الحافة اليسرى؟' },
    [{ en: 'When the window satisfies (or breaks) the condition and can shrink', ar: 'عندما تحقق النافذة الشرط (أو تكسره) ويمكنها أن تنكمش' }, { en: 'Never', ar: 'أبدًا' }, { en: 'After every element', ar: 'بعد كل عنصر' }], 0),
  mcq('dsa', W, 5, 'stack',
    { en: 'Which data structure checks balanced brackets?', ar: 'أي بنية بيانات تتحقق من توازن الأقواس؟' },
    [{ en: 'Stack', ar: 'المكدس (Stack)' }, { en: 'Queue', ar: 'الطابور (Queue)' }, { en: 'Heap', ar: 'الكومة (Heap)' }], 0),
  mcq('dsa', W, 6, 'linked-list',
    { en: 'How does Floyd’s algorithm detect a cycle in O(1) extra space?', ar: 'كيف تكتشف خوارزمية فلويد الدورة بمساحة إضافية O(1)؟' },
    [{ en: 'A slow pointer (1 step) and a fast pointer (2 steps) eventually meet if there is a cycle', ar: 'مؤشر بطيء (خطوة) ومؤشر سريع (خطوتان) يلتقيان في النهاية إذا وُجدت دورة' }, { en: 'Store every node in a set', ar: 'تخزين كل عقدة في مجموعة' }, { en: 'Reverse the list twice', ar: 'عكس القائمة مرتين' }], 0),
  mcq('dsa', W, 7, 'binary-search',
    { en: 'Binary search requires the input to be…', ar: 'يتطلب البحث الثنائي أن تكون المدخلات…' },
    [{ en: 'Sorted', ar: 'مرتبة' }, { en: 'Unique', ar: 'غير مكررة' }, { en: 'Positive numbers', ar: 'أعدادًا موجبة' }], 0),
  mcq('dsa', W, 8, 'trees',
    { en: 'Level-order traversal of a binary tree uses…', ar: 'يستخدم المرور بالمستويات في الشجرة الثنائية…' },
    [{ en: 'A queue (BFS)', ar: 'طابورًا (BFS)' }, { en: 'A stack only', ar: 'مكدسًا فقط' }, { en: 'Sorting the nodes first', ar: 'ترتيب العقد أولًا' }], 0),
  mcq('dsa', W, 9, 'dp',
    { en: 'Climbing Stairs: how many ways to climb n = 5 steps (1 or 2 at a time)?', ar: 'صعود الدرج: كم طريقة لصعود n = 5 درجات (1 أو 2 في كل مرة)؟' },
    [{ en: '8', ar: '8' }, { en: '5', ar: '5' }, { en: '10', ar: '10' }], 0),
  mcq('dsa', W, 10, 'dp',
    { en: 'Why does dynamic programming help Climbing Stairs?', ar: 'لماذا تفيد البرمجة الديناميكية في مسألة صعود الدرج؟' },
    [{ en: 'The answer for n reuses the answers for n−1 and n−2 (overlapping subproblems)', ar: 'إجابة n تعيد استخدام إجابتي n−1 و n−2 (مسائل فرعية متداخلة)' }, { en: 'It sorts the steps', ar: 'ترتب الدرجات' }, { en: 'It avoids using loops', ar: 'تتجنب استخدام الحلقات' }], 0),
]

export const dsa: Module = {
  id: W,
  courseId: COURSE_ID,
  order: 3,
  cover: cover(
    { en: 'Technical rounds · Module 3', ar: 'الجولات التقنية · الوحدة 3' },
    { en: 'Data structures &amp; algorithms patterns', ar: 'أنماط هياكل البيانات والخوارزميات' },
    { en: '≈ 90 min', ar: '≈ 90 دقيقة' },
  ),
  sections: [
    {
      id: 'approach',
      navLabel: { en: 'How to approach a problem', ar: 'كيف تقارب المسألة' },
      sectionLabel: { en: 'Intro', ar: 'مقدمة' },
      timeEst: { en: '5 min', ar: '5 دقائق' },
      headingHtml: heading(
        { en: 'Patterns beat memorising problems', ar: 'الأنماط أفضل من حفظ المسائل' },
        {
          en: 'Coding rounds reuse a small set of patterns. Learn to recognise the pattern from the problem statement and the solution follows.',
          ar: 'تعيد جولات البرمجة استخدام مجموعة صغيرة من الأنماط. تعلّم أن تتعرف على النمط من نص المسألة ويأتي الحل بعدها.',
        },
      ),
      blocks: [
        {
          type: 'objectives',
          label: { en: 'You will learn', ar: 'ستتعلم' },
          items: [
            { en: 'Read time/space complexity and talk about it', ar: 'قراءة تعقيد الزمن والمساحة والحديث عنه' },
            { en: 'Hash map, two pointers, sliding window, stack', ar: 'خريطة التجزئة، المؤشران، النافذة المنزلقة، المكدس' },
            { en: 'Linked lists, binary search, tree BFS, dynamic programming', ar: 'القوائم المترابطة، البحث الثنائي، BFS للأشجار، البرمجة الديناميكية' },
          ],
        },
        html({
          en: '<p>A reliable routine for every problem:</p><ol><li><strong>Clarify</strong>: restate the problem, ask about input size, duplicates, empty input.</li><li><strong>Examples</strong>: work one small example and one edge case by hand.</li><li><strong>Brute force first</strong>: say it out loud and state its complexity.</li><li><strong>Optimise</strong>: name the pattern that removes the bottleneck.</li><li><strong>Code, then test</strong> with your examples and edge cases.</li></ol>',
          ar: '<p>روتين موثوق لكل مسألة:</p><ol><li><strong>وضّح</strong>: أعد صياغة المسألة واسأل عن حجم المدخلات والتكرار والمدخلات الفارغة.</li><li><strong>أمثلة</strong>: جرّب مثالًا صغيرًا وحالة حدّية يدويًا.</li><li><strong>الحل البدائي أولًا</strong>: قله بصوت عالٍ واذكر تعقيده.</li><li><strong>حسّن</strong>: سمِّ النمط الذي يزيل عنق الزجاجة.</li><li><strong>اكتب الكود ثم اختبر</strong> بأمثلتك وحالاتك الحدّية.</li></ol>',
        }),
      ],
    },
    {
      id: 'big-o',
      navLabel: { en: 'Big-O in 5 minutes', ar: 'Big-O في 5 دقائق' },
      sectionLabel: { en: 'Pattern 0', ar: 'النمط 0' },
      timeEst: { en: '8 min', ar: '8 دقائق' },
      headingHtml: heading(
        { en: 'Big-O: talking about speed', ar: 'Big-O: الحديث عن السرعة' },
        { en: 'How the work grows as the input n grows — ignore constants and small terms.', ar: 'كيف ينمو العمل مع نمو المدخلات n — تجاهل الثوابت والحدود الصغيرة.' },
      ),
      blocks: [
        {
          type: 'table',
          headers: [{ en: 'Class', ar: 'الصنف' }, { en: 'Name', ar: 'الاسم' }, { en: 'Typical example', ar: 'مثال نموذجي' }],
          rows: [
            [{ en: '<code>O(1)</code>', ar: '<code>O(1)</code>' }, { en: 'Constant', ar: 'ثابت' }, { en: 'Hash map lookup, array index', ar: 'بحث في خريطة التجزئة، فهرس مصفوفة' }],
            [{ en: '<code>O(log n)</code>', ar: '<code>O(log n)</code>' }, { en: 'Logarithmic', ar: 'لوغاريتمي' }, { en: 'Binary search', ar: 'البحث الثنائي' }],
            [{ en: '<code>O(n)</code>', ar: '<code>O(n)</code>' }, { en: 'Linear', ar: 'خطي' }, { en: 'One pass over an array', ar: 'مرور واحد على مصفوفة' }],
            [{ en: '<code>O(n log n)</code>', ar: '<code>O(n log n)</code>' }, { en: 'Linearithmic', ar: 'خطي لوغاريتمي' }, { en: 'Efficient sorting (merge sort)', ar: 'الترتيب الفعّال (merge sort)' }],
            [{ en: '<code>O(n²)</code>', ar: '<code>O(n²)</code>' }, { en: 'Quadratic', ar: 'تربيعي' }, { en: 'Nested loops over the same array', ar: 'حلقتان متداخلتان على المصفوفة نفسها' }],
          ],
        },
        {
          type: 'box',
          variant: 'mistake',
          label: { en: 'Common mistake', ar: 'خطأ شائع' },
          html: {
            en: 'Forgetting space. Interviewers ask “and the memory?” — a hash map trades <code>O(n)</code> extra space for time.',
            ar: 'نسيان المساحة. يسأل المحاورون «وماذا عن الذاكرة؟» — خريطة التجزئة تبادل مساحة إضافية <code>O(n)</code> بالزمن.',
          },
        },
        { type: 'exercise', questionId: 'dsa-q001' },
      ],
    },
    {
      id: 'hash-map',
      navLabel: { en: 'Hash map: Two Sum', ar: 'خريطة التجزئة: Two Sum' },
      sectionLabel: { en: 'Pattern 1', ar: 'النمط 1' },
      timeEst: { en: '10 min', ar: '10 دقائق' },
      headingHtml: heading(
        { en: 'Hash map: remember what you have seen', ar: 'خريطة التجزئة: تذكّر ما رأيته' },
        { en: 'Trade memory for speed: turn an inner search loop into an O(1) lookup.', ar: 'بادل الذاكرة بالسرعة: حوّل حلقة البحث الداخلية إلى بحث O(1).' },
      ),
      blocks: [
        html({
          en: '<p><strong>Two Sum</strong> — given an array <code>nums</code> and a <code>target</code>, return the indices of the two numbers that add up to it. Brute force checks every pair, <code>O(n²)</code>. Instead, for each number ask: “have I already seen <code>target − n</code>?”</p>',
          ar: '<p><strong>Two Sum</strong> — بمعلومية مصفوفة <code>nums</code> وهدف <code>target</code>، أعد فهرسَي العددين اللذين مجموعهما الهدف. الحل البدائي يفحص كل زوج بتعقيد <code>O(n²)</code>. بدلًا من ذلك اسأل مع كل عدد: «هل رأيت <code>target − n</code> من قبل؟»</p>',
        }),
        code(
          `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []`,
          `public int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>(); // value -> index
    for (int i = 0; i < nums.Length; i++)
    {
        if (seen.TryGetValue(target - nums[i], out var j))
            return new[] { j, i };
        seen[nums[i]] = i;
    }
    return Array.Empty<int>();
}`,
          `function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
        ),
        complexity('Time <code>O(n)</code>, space <code>O(n)</code>. Check the complement <em>before</em> inserting so an element is never paired with itself.', 'الزمن <code>O(n)</code> والمساحة <code>O(n)</code>. افحص المتمم <em>قبل</em> الإدراج حتى لا يقترن العنصر بنفسه.'),
        pattern('you need fast “have I seen this?”, counting, grouping or de-duplication — Two Sum, Single Number, anagrams, frequency problems.', 'تحتاج إجابة سريعة عن «هل رأيت هذا؟» أو العدّ أو التجميع أو إزالة التكرار — Two Sum وSingle Number والجناس والتكرارات.'),
        { type: 'exercise', questionId: 'dsa-q002' },
      ],
    },
    {
      id: 'two-pointers',
      navLabel: { en: 'Two pointers & window', ar: 'المؤشران والنافذة' },
      sectionLabel: { en: 'Pattern 2', ar: 'النمط 2' },
      timeEst: { en: '12 min', ar: '12 دقيقة' },
      headingHtml: heading(
        { en: 'Two pointers and the sliding window', ar: 'المؤشران والنافذة المنزلقة' },
        { en: 'Walk through the data once with two indices instead of re-scanning.', ar: 'امشِ على البيانات مرة واحدة بمؤشرين بدل إعادة المسح.' },
      ),
      blocks: [
        html({
          en: '<h3>Two pointers — Is Subsequence</h3><p>Is <code>s</code> a subsequence of <code>t</code> (characters in order, gaps allowed)? Keep one pointer in <code>s</code>; scan <code>t</code> once and advance it on every match.</p>',
          ar: '<h3>المؤشران — Is Subsequence</h3><p>هل <code>s</code> تسلسل جزئي من <code>t</code> (حروف بالترتيب مع السماح بالفجوات)؟ احتفظ بمؤشر في <code>s</code>؛ امسح <code>t</code> مرة واحدة وقدّمه عند كل تطابق.</p>',
        }),
        code(
          `def is_subsequence(s, t):
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    return i == len(s)`,
          `public bool IsSubsequence(string s, string t)
{
    int i = 0;
    foreach (char ch in t)
        if (i < s.Length && s[i] == ch) i++;
    return i == s.Length;
}`,
          `function isSubsequence(s, t) {
  let i = 0;
  for (const ch of t) {
    if (i < s.length && s[i] === ch) i++;
  }
  return i === s.length;
}`,
        ),
        html({
          en: '<h3>Sliding window — Minimum Size Subarray Sum</h3><p>Shortest contiguous subarray whose sum is at least <code>target</code> (positive numbers). Grow the window on the right; while it is big enough, record its size and shrink from the left.</p>',
          ar: '<h3>النافذة المنزلقة — Minimum Size Subarray Sum</h3><p>أقصر مصفوفة جزئية متصلة مجموعها لا يقل عن <code>target</code> (أعداد موجبة). وسّع النافذة من اليمين؛ وما دامت كافية سجّل حجمها وضيّقها من اليسار.</p>',
        }),
        code(
          `def min_sub_array_len(target, nums):
    left = total = 0
    best = float("inf")
    for right, n in enumerate(nums):
        total += n
        while total >= target:
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1
    return 0 if best == float("inf") else best`,
          `public int MinSubArrayLen(int target, int[] nums)
{
    int left = 0, total = 0, best = int.MaxValue;
    for (int right = 0; right < nums.Length; right++)
    {
        total += nums[right];
        while (total >= target)
        {
            best = Math.Min(best, right - left + 1);
            total -= nums[left++];
        }
    }
    return best == int.MaxValue ? 0 : best;
}`,
          `function minSubArrayLen(target, nums) {
  let left = 0, total = 0, best = Infinity;
  for (let right = 0; right < nums.length; right++) {
    total += nums[right];
    while (total >= target) {
      best = Math.min(best, right - left + 1);
      total -= nums[left++];
    }
  }
  return best === Infinity ? 0 : best;
}`,
        ),
        complexity('Both run in <code>O(n)</code> time and <code>O(1)</code> space: each pointer only moves forward.', 'كلاهما يعمل في زمن <code>O(n)</code> ومساحة <code>O(1)</code>: كل مؤشر يتحرك للأمام فقط.'),
        pattern('the input is a sorted array or a string and you look for a pair, a subsequence, or the best contiguous range.', 'المدخل مصفوفة مرتبة أو نص وتبحث عن زوج أو تسلسل جزئي أو أفضل مدى متصل.'),
        { type: 'exercise', questionId: 'dsa-q003' },
        { type: 'exercise', questionId: 'dsa-q004' },
      ],
    },
    {
      id: 'stack',
      navLabel: { en: 'Stack: Valid Parentheses', ar: 'المكدس: Valid Parentheses' },
      sectionLabel: { en: 'Pattern 3', ar: 'النمط 3' },
      timeEst: { en: '8 min', ar: '8 دقائق' },
      headingHtml: heading(
        { en: 'Stack: last in, first out', ar: 'المكدس: آخر من يدخل أول من يخرج' },
        { en: 'The most recent unmatched thing is always the next one that must be closed.', ar: 'آخر شيء غير مطابَق هو دائمًا التالي الذي يجب إغلاقه.' },
      ),
      blocks: [
        html({
          en: '<p><strong>Valid Parentheses</strong> — a string of <code>()[]{}</code> is valid if every bracket is closed by the same type, in the right order. Push openers; on a closer, the top of the stack must be its matching opener.</p>',
          ar: '<p><strong>Valid Parentheses</strong> — نص من <code>()[]{}</code> صالح إذا أُغلق كل قوس بنفس نوعه وبالترتيب الصحيح. ادفع الأقواس الفاتحة؛ وعند قوس مغلق يجب أن تكون قمة المكدس هي فاتحه المطابق.</p>',
        }),
        code(
          `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack`,
          `public bool IsValid(string s)
{
    var pairs = new Dictionary<char, char> { [')'] = '(', [']'] = '[', ['}'] = '{' };
    var stack = new Stack<char>();
    foreach (var c in s)
    {
        if (pairs.TryGetValue(c, out var open))
        {
            if (stack.Count == 0 || stack.Pop() != open) return false;
        }
        else stack.Push(c);
    }
    return stack.Count == 0;
}`,
          `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const c of s) {
    if (c in pairs) {
      if (stack.pop() !== pairs[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`,
        ),
        complexity('Time <code>O(n)</code>, space <code>O(n)</code>. Do not forget the final check that the stack is empty (<code>"(("</code>).', 'الزمن <code>O(n)</code> والمساحة <code>O(n)</code>. لا تنسَ الفحص الأخير أن المكدس فارغ (<code>"(("</code>).'),
        pattern('things must be matched or undone in reverse order — brackets, nested structures, “next greater element”, undo/redo.', 'يجب مطابقة الأشياء أو التراجع عنها بترتيب معكوس — الأقواس والبنى المتداخلة و«العنصر الأكبر التالي» والتراجع/الإعادة.'),
        { type: 'exercise', questionId: 'dsa-q005' },
      ],
    },
    {
      id: 'linked-list',
      navLabel: { en: 'Linked lists', ar: 'القوائم المترابطة' },
      sectionLabel: { en: 'Pattern 4', ar: 'النمط 4' },
      timeEst: { en: '12 min', ar: '12 دقيقة' },
      headingHtml: heading(
        { en: 'Linked lists: rewire the pointers', ar: 'القوائم المترابطة: أعد توصيل المؤشرات' },
        { en: 'Reverse in place, and find cycles with a slow and a fast pointer.', ar: 'اعكس في المكان، واكتشف الدورات بمؤشر بطيء وآخر سريع.' },
      ),
      blocks: [
        html({
          en: '<h3>Reverse a list in place</h3><p>Keep <code>prev</code>; for each node save the next one, point the node back at <code>prev</code>, and step forward. No extra list needed.</p>',
          ar: '<h3>عكس قائمة في المكان</h3><p>احتفظ بـ <code>prev</code>؛ لكل عقدة احفظ التالية ووجّه العقدة إلى <code>prev</code> ثم تقدّم. لا حاجة لقائمة إضافية.</p>',
        }),
        code(
          `def reverse_list(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev = head
        head = nxt
    return prev`,
          `public ListNode ReverseList(ListNode head)
{
    ListNode prev = null;
    while (head != null)
    {
        var next = head.next;
        head.next = prev;
        prev = head;
        head = next;
    }
    return prev;
}`,
          `function reverseList(head) {
  let prev = null;
  while (head) {
    const next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}`,
        ),
        html({
          en: '<h3>Detect a cycle (Floyd)</h3><p>Move <code>slow</code> one step and <code>fast</code> two steps. If there is a cycle they must meet; if <code>fast</code> reaches the end, there is none. Storing visited nodes works but costs <code>O(n)</code> memory.</p>',
          ar: '<h3>اكتشاف الدورة (فلويد)</h3><p>حرّك <code>slow</code> خطوة و<code>fast</code> خطوتين. إذا وُجدت دورة فلا بد أن يلتقيا؛ وإذا وصل <code>fast</code> إلى النهاية فلا دورة. تخزين العقد المزارة يعمل لكنه يكلّف ذاكرة <code>O(n)</code>.</p>',
        }),
        code(
          `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
          `public bool HasCycle(ListNode head)
{
    var slow = head;
    var fast = head;
    while (fast != null && fast.next != null)
    {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
          `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        ),
        complexity('Both are <code>O(n)</code> time and <code>O(1)</code> space. Draw the pointers on paper for 3 nodes — that is what interviewers want to see.', 'كلاهما بزمن <code>O(n)</code> ومساحة <code>O(1)</code>. ارسم المؤشرات على الورق لثلاث عقد — هذا ما يريد المحاورون رؤيته.'),
        { type: 'exercise', questionId: 'dsa-q006' },
      ],
    },
    {
      id: 'binary-search',
      navLabel: { en: 'Binary search', ar: 'البحث الثنائي' },
      sectionLabel: { en: 'Pattern 5', ar: 'النمط 5' },
      timeEst: { en: '8 min', ar: '8 دقائق' },
      headingHtml: heading(
        { en: 'Binary search: halve the problem', ar: 'البحث الثنائي: نصّف المسألة' },
        { en: 'On sorted data, throw away half of the candidates every step.', ar: 'على بيانات مرتبة، تخلّص من نصف المرشحين في كل خطوة.' },
      ),
      blocks: [
        code(
          `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
          `public int Search(int[] nums, int target)
{
    int lo = 0, hi = nums.Length - 1;
    while (lo <= hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
          `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
        ),
        {
          type: 'box',
          variant: 'mistake',
          label: { en: 'Common mistake', ar: 'خطأ شائع' },
          html: {
            en: 'Off-by-one errors: use <code>lo &lt;= hi</code> with <code>mid ± 1</code>. Compute <code>mid = lo + (hi − lo) / 2</code> to avoid integer overflow in C#/Java.',
            ar: 'أخطاء الإزاحة بواحد: استخدم <code>lo &lt;= hi</code> مع <code>mid ± 1</code>. احسب <code>mid = lo + (hi − lo) / 2</code> لتجنب تجاوز الأعداد الصحيحة في C#/Java.',
          },
        },
        complexity('Time <code>O(log n)</code>, space <code>O(1)</code>. Also applies to “search the answer” problems: find the smallest value for which a yes/no check passes.', 'الزمن <code>O(log n)</code> والمساحة <code>O(1)</code>. ينطبق أيضًا على مسائل «ابحث عن الإجابة»: أوجد أصغر قيمة ينجح عندها فحص نعم/لا.'),
        { type: 'exercise', questionId: 'dsa-q007' },
      ],
    },
    {
      id: 'trees',
      navLabel: { en: 'Trees: level order (BFS)', ar: 'الأشجار: بالمستويات (BFS)' },
      sectionLabel: { en: 'Pattern 6', ar: 'النمط 6' },
      timeEst: { en: '10 min', ar: '10 دقائق' },
      headingHtml: heading(
        { en: 'Trees: breadth-first with a queue', ar: 'الأشجار: بحث بالعرض باستخدام طابور' },
        { en: 'Process a tree one level at a time.', ar: 'عالج الشجرة مستوى بمستوى.' },
      ),
      blocks: [
        html({
          en: '<p><strong>Binary Tree Level Order Traversal</strong> — return the values level by level. Snapshot the queue size at the start of each round: exactly that many nodes belong to the current level.</p>',
          ar: '<p><strong>Binary Tree Level Order Traversal</strong> — أعد القيم مستوى بمستوى. خذ لقطة لحجم الطابور في بداية كل جولة: هذا العدد بالضبط من العقد يخص المستوى الحالي.</p>',
        }),
        code(
          `from collections import deque

def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
          `public IList<IList<int>> LevelOrder(TreeNode root)
{
    var result = new List<IList<int>>();
    if (root == null) return result;
    var queue = new Queue<TreeNode>();
    queue.Enqueue(root);
    while (queue.Count > 0)
    {
        var level = new List<int>();
        for (int n = queue.Count; n > 0; n--)
        {
            var node = queue.Dequeue();
            level.Add(node.val);
            if (node.left != null) queue.Enqueue(node.left);
            if (node.right != null) queue.Enqueue(node.right);
        }
        result.Add(level);
    }
    return result;
}`,
          `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length) {
    result.push(queue.map((node) => node.val));
    queue = queue.flatMap((node) => [node.left, node.right]).filter(Boolean);
  }
  return result;
}`,
        ),
        complexity('Time <code>O(n)</code>, space <code>O(w)</code> where <em>w</em> is the widest level. For depth-first problems (validate a BST, max depth) use recursion instead.', 'الزمن <code>O(n)</code> والمساحة <code>O(w)</code> حيث <em>w</em> أعرض مستوى. لمسائل البحث بالعمق (التحقق من BST، أقصى عمق) استخدم الاستدعاء الذاتي.'),
        { type: 'exercise', questionId: 'dsa-q008' },
      ],
    },
    {
      id: 'dp',
      navLabel: { en: 'Dynamic programming', ar: 'البرمجة الديناميكية' },
      sectionLabel: { en: 'Pattern 7', ar: 'النمط 7' },
      timeEst: { en: '10 min', ar: '10 دقائق' },
      headingHtml: heading(
        { en: 'Dynamic programming: reuse sub-answers', ar: 'البرمجة الديناميكية: أعد استخدام الإجابات الفرعية' },
        { en: 'If the answer for n is built from smaller answers, store them instead of recomputing.', ar: 'إذا كانت إجابة n مبنية من إجابات أصغر، خزّنها بدل إعادة حسابها.' },
      ),
      blocks: [
        html({
          en: '<p><strong>Climbing Stairs</strong> — you can climb 1 or 2 steps at a time; how many ways to reach step <code>n</code>? The last move was a 1-step (from <code>n−1</code>) or a 2-step (from <code>n−2</code>), so <code>ways(n) = ways(n−1) + ways(n−2)</code> — Fibonacci. We only need the last two values.</p>',
          ar: '<p><strong>Climbing Stairs</strong> — تصعد درجة أو درجتين في كل مرة؛ كم طريقة للوصول إلى الدرجة <code>n</code>؟ آخر حركة كانت خطوة واحدة (من <code>n−1</code>) أو خطوتين (من <code>n−2</code>)، إذن <code>ways(n) = ways(n−1) + ways(n−2)</code> — فيبوناتشي. نحتاج القيمتين الأخيرتين فقط.</p>',
        }),
        code(
          `def climb_stairs(n):
    if n <= 2:
        return n
    prev, curr = 1, 2          # ways(1), ways(2)
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
          `public int ClimbStairs(int n)
{
    if (n <= 2) return n;
    int prev = 1, curr = 2; // ways(1), ways(2)
    for (int i = 3; i <= n; i++)
    {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}`,
          `function climbStairs(n) {
  if (n <= 2) return n;
  let prev = 1, curr = 2; // ways(1), ways(2)
  for (let i = 3; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}`,
        ),
        {
          type: 'box',
          variant: 'keypoint',
          label: { en: 'The DP recipe', ar: 'وصفة DP' },
          html: {
            en: '1) Define the state (<code>ways(n)</code>). 2) Write the recurrence. 3) Set the base cases. 4) Pick top-down (recursion + memo) or bottom-up (loop). 5) Shrink memory if you only need the last few states.',
            ar: '1) عرّف الحالة (<code>ways(n)</code>). 2) اكتب العلاقة التراجعية. 3) حدّد الحالات الأساسية. 4) اختر من الأعلى للأسفل (استدعاء ذاتي + تخزين) أو من الأسفل للأعلى (حلقة). 5) قلّل الذاكرة إن احتجت آخر حالات قليلة فقط.',
          },
        },
        complexity('Time <code>O(n)</code>, space <code>O(1)</code>. Plain recursion without memo is <code>O(2ⁿ)</code>.', 'الزمن <code>O(n)</code> والمساحة <code>O(1)</code>. الاستدعاء الذاتي البسيط دون تخزين هو <code>O(2ⁿ)</code>.'),
        { type: 'exercise', questionId: 'dsa-q009' },
        { type: 'exercise', questionId: 'dsa-q010' },
      ],
    },
    {
      id: 'cheatsheet',
      navLabel: { en: 'Pattern cheat sheet', ar: 'ملخص الأنماط' },
      sectionLabel: { en: 'Summary', ar: 'ملخص' },
      timeEst: { en: '3 min', ar: '3 دقائق' },
      headingHtml: heading({ en: 'Pattern cheat sheet', ar: 'ملخص الأنماط' }),
      blocks: [
        {
          type: 'table',
          headers: [{ en: 'If the problem says…', ar: 'إذا قالت المسألة…' }, { en: 'Try', ar: 'جرّب' }, { en: 'Practice in this repo', ar: 'تدرّب في هذا المستودع' }],
          rows: [
            [{ en: 'find a pair / count / de-duplicate', ar: 'أوجد زوجًا / عدّ / أزل التكرار' }, { en: 'Hash map', ar: 'خريطة التجزئة' }, { en: '<code>solutions/python/TwoSum.py</code>', ar: '<code>solutions/python/TwoSum.py</code>' }],
            [{ en: 'sorted array, subsequence, longest/shortest range', ar: 'مصفوفة مرتبة، تسلسل جزئي، أطول/أقصر مدى' }, { en: 'Two pointers / sliding window', ar: 'المؤشران / النافذة المنزلقة' }, { en: '<code>solutions/javascript/MinSubArrayLen.js</code>', ar: '<code>solutions/javascript/MinSubArrayLen.js</code>' }],
            [{ en: 'brackets, nesting, undo', ar: 'أقواس، تداخل، تراجع' }, { en: 'Stack', ar: 'المكدس' }, { en: '<code>solutions/java/ValidParentheses.java</code>', ar: '<code>solutions/java/ValidParentheses.java</code>' }],
            [{ en: 'linked list, cycle', ar: 'قائمة مترابطة، دورة' }, { en: 'Pointer rewiring / fast & slow', ar: 'إعادة توصيل المؤشرات / سريع وبطيء' }, { en: '<code>solutions/python/ReverseLinkedList.py</code>', ar: '<code>solutions/python/ReverseLinkedList.py</code>' }],
            [{ en: 'sorted input, “minimum that works”', ar: 'مدخل مرتب، «أصغر قيمة تنجح»' }, { en: 'Binary search', ar: 'البحث الثنائي' }, { en: '<code>solutions/python/BinarySearch.py</code>', ar: '<code>solutions/python/BinarySearch.py</code>' }],
            [{ en: 'tree by levels', ar: 'شجرة بالمستويات' }, { en: 'BFS with a queue', ar: 'BFS بطابور' }, { en: '<code>solutions/python/Binary Tree Level Order Traversal.py</code>', ar: '<code>solutions/python/Binary Tree Level Order Traversal.py</code>' }],
            [{ en: 'count ways / min / max built from smaller cases', ar: 'عدّ الطرق / أدنى / أقصى مبنية من حالات أصغر' }, { en: 'Dynamic programming', ar: 'البرمجة الديناميكية' }, { en: '<code>solutions/csharp/Climbing Stairs.cs</code>', ar: '<code>solutions/csharp/Climbing Stairs.cs</code>' }],
          ],
        },
        {
          type: 'takeaways',
          label: { en: 'Key takeaways', ar: 'أهم النقاط' },
          items: [
            { en: 'State brute force first, then name the pattern that improves it', ar: 'اذكر الحل البدائي أولًا ثم سمِّ النمط الذي يحسّنه' },
            { en: 'Always give time and space complexity', ar: 'اذكر دائمًا تعقيد الزمن والمساحة' },
            { en: 'Test with an empty input, one element and a duplicate', ar: 'اختبر بمدخل فارغ وعنصر واحد وعنصر مكرر' },
          ],
        },
      ],
    },
  ],
  questions,
}
