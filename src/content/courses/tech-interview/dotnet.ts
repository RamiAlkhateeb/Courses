// Source: the ".NET FAQ" of the original Arabic README (docs/content-sources/README.ar.md), questions 1–35.
// Arabic text is the original; English is a translation. Question numbers match the README so they stay
// traceable. Each entry renders as a heading + official answer + an analogy box.
import type { Block, Localized, Section, Module } from '../../types'
import { COURSE_ID, cover, heading, mcq } from './helpers'

const W = 'dotnet'

interface QA {
  n: number
  q: Localized
  /** The textbook answer */
  a: Localized
  /** Everyday analogy that makes it stick */
  analogy: Localized
}

const qa: QA[] = [
  {
    n: 1,
    q: { en: 'What is the difference between value types and reference types?', ar: 'ما الفرق بين أنواع القيمة (Value Types) والأنواع المرجعية (Reference Types)؟' },
    a: {
      en: 'Value types (like <code>int</code> and <code>struct</code>) hold their data directly and are usually stored on the <strong>stack</strong>. Reference types (like <code>class</code> and <code>string</code>) store a reference (a memory address) to the data, and the data itself lives on the <strong>heap</strong>.',
      ar: 'أنواع القيمة (مثل <code>int</code> و <code>struct</code>) تحمل البيانات مباشرة وتُخزن عادةً في <strong>Stack</strong>. بينما الأنواع المرجعية (مثل <code>class</code> و <code>string</code>) تخزن مرجعاً (عنوان ذاكرة) للبيانات، وتكون البيانات نفسها مخزنة في <strong>Heap</strong>.',
    },
    analogy: {
      en: 'A value type is cash in your pocket — it is right there with you. A reference type is a locker key at the gym: the key is not your clothes, it just tells you where the clothes are.',
      ar: 'نوع القيمة مثل أن تحمل النقود (الكاش) في جيبك؛ هي معك مباشرة. النوع المرجعي مثل أن تحمل مفتاح خزانة في النادي. المفتاح ليس هو الملابس، بل هو مجرد أداة تدلك على مكان وجود الملابس.',
    },
  },
  {
    n: 2,
    q: { en: 'When should you use an interface versus an abstract class?', ar: 'متى يجب عليك استخدام الواجهة (Interface) مقابل الفئة المجردة (Abstract Class)؟' },
    a: {
      en: 'Use an <strong>abstract class</strong> when you want to give derived classes ready-made shared functionality — an “is-a” relationship. Use an <strong>interface</strong> to define a contract or capability that unrelated classes can implement — a “can-do” relationship — and to support multiple inheritance.',
      ar: 'استخدم Abstract Class عندما تريد توفير وظائف مشتركة جاهزة للصفوف المشتقة — علاقة «هو يكون» (is-a). استخدم <strong>الواجهة</strong> لتعريف عقد أو قدرة يمكن لصفوف غير مرتبطة ببعضها تنفيذها — علاقة «يستطيع أن يفعل» (can-do) — ولدعم الوراثة المتعددة.',
    },
    analogy: {
      en: 'An abstract class is the blueprint of a “vehicle” (it has an engine and wheels). An interface is a “taxi licence”. A car is a vehicle (inheritance) and holds a taxi licence (interface); a boat can hold one too, even though it is not a car.',
      ar: 'الفئة المجردة مثل مخطط «المركبة»؛ يحدد أن لها محركاً وعجلات. أما الواجهة فهي مثل «رخصة التاكسي». السيارة هي مركبة (وراثة)، ولديها رخصة تاكسي (واجهة). القارب أيضاً يمكن أن يحصل على رخصة تاكسي (واجهة) رغم أنه ليس سيارة.',
    },
  },
  {
    n: 3,
    q: { en: 'What is Dependency Injection and why is it used in .NET Core?', ar: 'ما هو (Dependency Injection) ولماذا يُستخدم في .NET Core؟' },
    a: {
      en: 'A design pattern that achieves Inversion of Control (IoC): services (dependencies) are injected into a class instead of being created inside it. This makes code easier to test and maintain and loosely coupled.',
      ar: 'هو نمط تصميم يُستخدم لتحقيق «عكس التحكم» (IoC). فهو يسمح لك بحقن الخدمات (dependencies) داخل الصف بدلاً من إنشائها داخل الصف نفسه. هذا يجعل الكود أكثر قابلية للاختبار والصيانة، وأقل ارتباطاً (Loosely coupled).',
    },
    analogy: {
      en: 'Imagine building a house with furniture glued to the floor. To change the sofa you must tear down the living room. That is what happens when you hard-code dependencies with <code>new</code> inside your classes.',
      ar: 'تخيل أنك تبني منزلاً أثاثه ملتصق بالأرضية. إذا أردت تغيير الأريكة، عليك هدم غرفة المعيشة. هذا ما يحدث عندما تُضمّن التبعيات بشكل ثابت (باستخدام الكلمة المفتاحية <code>new</code>) داخل صفوفك البرمجية.',
    },
  },
  {
    n: 4,
    q: { en: 'Explain the purpose of the async and await keywords.', ar: 'اشرح الغرض من الكلمات المفتاحية async و await.' },
    a: {
      en: 'They are used for asynchronous programming. <code>async</code> marks a method as asynchronous; <code>await</code> pauses that method until the awaited task completes <em>without blocking the thread</em> — essential for responsive UIs and high web traffic.',
      ar: 'تُستخدم للبرمجة غير المتزامنة. <code>async</code> تميز الدالة بأنها غير متزامنة، و <code>await</code> توقف تنفيذ تلك الدالة مؤقتاً حتى تكتمل المهمة المنتظرة، دون حجب الخيط الرئيسي (Thread)، وهو أمر ضروري لاستجابة واجهات المستخدم والتعامل مع حركة مرور الويب العالية.',
    },
    analogy: {
      en: 'Synchronous code is a waiter standing at the chef’s elbow until your food is ready. Async/await is a waiter who hands your order to the kitchen, serves other tables while the chef cooks, and comes back when the food is ready.',
      ar: 'البرمجة العادية تشبه نادلاً يقف أمام الطباخ وينتظر حتى يجهز طعامك. Async/Await تشبه نادلاً يوصل طلبك للمطبخ، ثم يذهب لخدمة زبائن آخرين بينما يطبخ الشيف. عندما يجهز الطعام، يعود ليقدمه لك.',
    },
  },
  {
    n: 5,
    q: { en: 'How does garbage collection work in .NET?', ar: 'كيف يعمل جمع القمامة (Garbage Collection) في .NET؟' },
    a: {
      en: 'The garbage collector manages memory allocation automatically. It periodically checks the heap for objects the application no longer uses (nothing references them) and reclaims that memory. It uses <strong>generations</strong> (0, 1, 2) to optimise performance.',
      ar: 'يقوم جامع القمامة بإدارة تخصيص الذاكرة تلقائياً. فهو يتحقق بشكل دوري من كومة الذاكرة (Heap) بحثاً عن الكائنات التي لم يعد التطبيق يستخدمها (لا توجد مراجع لها) ويستعيد تلك الذاكرة. يستخدم «الأجيال» (0، 1، 2) لتحسين الأداء.',
    },
    analogy: {
      en: 'In a restaurant you do not wash your own plate. When you leave the table (the reference is removed), the busser (the GC) sees the empty plate and clears it so the table is ready for the next guest.',
      ar: 'في المطعم، أنت لا تغسل صحنك بنفسك. عندما تنتهي وتغادر الطاولة (إزالة المرجع)، يأتي عامل التنظيف (GC)، يرى الصحن الفارغ، ويزيله لتصبح الطاولة جاهزة لزبون آخر.',
    },
  },
  {
    n: 6,
    q: { en: 'What is the difference between IEnumerable and IQueryable?', ar: 'ما الفرق بين IEnumerable و IQueryable؟' },
    a: {
      en: '<code>IEnumerable</code> pulls all the data from the database into memory and then filters it (client-side filtering). <code>IQueryable</code> builds a SQL statement and runs the filter inside the database (server-side filtering), which performs far better on large data.',
      ar: '<code>IEnumerable</code> يسحب كل البيانات من قاعدة البيانات إلى الذاكرة ثم يقوم بتصفيتها (فلترة عند العميل). أما <code>IQueryable</code> فيقوم ببناء جملة SQL وينفذ التصفية داخل قاعدة البيانات (فلترة عند الخادم)، وهو أفضل للأداء مع البيانات الضخمة.',
    },
    analogy: {
      en: '<code>IEnumerable</code> is borrowing every book from the library and taking them home to find the red ones. <code>IQueryable</code> is asking the librarian: “please bring me only the red books”.',
      ar: '<code>IEnumerable</code> مثل استعارة كل الكتب من المكتبة وأخذها للمنزل للبحث عن الكتب الحمراء. <code>IQueryable</code> هو أن تطلب من أمين المكتبة: «من فضلك، أحضر لي الكتب الحمراء فقط».',
    },
  },
  {
    n: 7,
    q: { en: 'Can you explain the SOLID principles?', ar: 'هل يمكنك شرح مبادئ SOLID؟' },
    a: {
      en: 'Five design principles that make software design clearer, more flexible and easier to maintain: <strong>S</strong>ingle responsibility, <strong>O</strong>pen/closed, <strong>L</strong>iskov substitution, <strong>I</strong>nterface segregation and <strong>D</strong>ependency inversion.',
      ar: 'هي مجموعة من خمسة مبادئ تصميمية تهدف لجعل تصميم البرمجيات أكثر وضوحاً ومرونة وقابلية للصيانة: <strong>S</strong>ingle responsibility، <strong>O</strong>pen/closed، <strong>L</strong>iskov substitution، <strong>I</strong>nterface segregation، <strong>D</strong>ependency inversion.',
    },
    analogy: {
      en: 'Think of building with LEGO. If you follow the rules (SOLID), every piece snaps into place and you can swap the roof without breaking the floor. If you glue random pieces together (bad design), you cannot change anything later.',
      ar: 'تخيل البناء بمكعبات «ليغو». إذا اتبعت القواعد (SOLID)، كل قطعة تركب مكانها، ويمكنك تغيير السقف دون كسر الأرضية. إذا ألصقت قطعاً عشوائية ببعضها (تصميم سيء)، فلن تستطيع تعديل أي شيء لاحقاً.',
    },
  },
  {
    n: 8,
    q: { en: 'What are boxing and unboxing?', ar: 'ما هما الـ Boxing والـ Unboxing؟' },
    a: {
      en: 'Boxing converts a value type to a reference type (<code>object</code>). Unboxing extracts the value back out of the object. Both consume system resources (a performance cost).',
      ar: 'Boxing هو عملية تحويل «نوع القيمة» إلى «نوع مرجعي» (Object). Unboxing هو استخراج القيمة مرة أخرى من الـ Object. هذه العملية تستهلك موارد النظام (Performance Cost).',
    },
    analogy: {
      en: 'Boxing is putting a phone (a value) in a cardboard box and wrapping it (an object). Unboxing is tearing the box open to take the phone out. Doing this thousands of times wastes a lot of time and effort.',
      ar: 'Boxing هو وضع هاتف (قيمة) داخل صندوق كرتوني وتغليفه (Object). Unboxing هو تمزيق الصندوق لاستخراج الهاتف. القيام بهذا الأمر آلاف المرات يضيع الكثير من الوقت والجهد.',
    },
  },
  {
    n: 9,
    q: { en: 'What is middleware in .NET Core and how does it work?', ar: 'ما هو الـ Middleware في .NET Core وكيف يعمل؟' },
    a: {
      en: 'Software components arranged in a <strong>pipeline</strong> to handle requests and responses. Each component decides either to pass the request to the next component or to handle it and short-circuit the pipeline.',
      ar: 'هي مكونات برمجية تُرتّب في «خط أنابيب» (Pipeline) لمعالجة الطلبات والردود. كل مكون يقرر إما تمرير الطلب للمكون التالي أو معالجته وإيقافه.',
    },
    analogy: {
      en: 'Airport checkpoints: first your ticket is checked (authentication), then your bags (validation). If you pass every checkpoint, you reach the plane (the controller).',
      ar: 'تشبه نقاط التفتيش في المطار. أولاً يتم فحص تذكرتك (توثيق)، ثم فحص الحقائب (تحقق). إذا مررت من جميع النقاط، تصل إلى الطائرة (Controller).',
    },
  },
  {
    n: 10,
    q: { en: 'What are the service lifetimes (Singleton, Scoped, Transient) in dependency injection?', ar: 'ما هي دورات حياة الخدمة المختلفة (Singleton, Scoped, Transient) في حقن التبعية؟' },
    a: {
      en: '<strong>Transient</strong>: a new instance every time it is requested. <strong>Scoped</strong>: one instance per HTTP request. <strong>Singleton</strong>: a single instance created at application start and shared by all requests for the app’s lifetime.',
      ar: '<strong>Transient</strong>: يتم إنشاء نسخة جديدة في كل مرة يُطلب فيها. <strong>Scoped</strong>: يتم إنشاء نسخة واحدة لكل طلب HTTP (لكل مستخدم في تلك اللحظة). <strong>Singleton</strong>: يتم إنشاء نسخة واحدة فقط عند بدء التطبيق وتستخدمها كل الطلبات طوال الوقت.',
    },
    analogy: {
      en: 'Transient is a plastic cup — use it once and throw it away. Scoped is a water bottle for one trip — it stays with you until the trip ends. Singleton is the public water fountain — everyone drinks from the same tap all the time.',
      ar: 'Transient: مثل الكوب البلاستيكي؛ تستخدمه مرة وترميه. Scoped: مثل زجاجة مياه مخصصة لرحلة معينة؛ تبقى معك حتى تنتهي الرحلة. Singleton: مثل «سبيل الماء» العام؛ الجميع يشرب من نفس الصنبور طوال الوقت.',
    },
  },
  {
    n: 11,
    q: { en: 'When should you use a Dictionary instead of a List?', ar: 'متى يجب عليك استخدام Dictionary بدلاً من List؟' },
    a: {
      en: 'A <code>List</code> stores items sequentially and you access them by index (position); searching by value is O(n). A <code>Dictionary</code> stores key–value pairs and uses a hash table, giving very fast (≈ O(1)) access by key.',
      ar: 'اللائحة List تخزن العناصر بشكل متسلسل ويتم الوصول إليها عبر الفهرس (الترتيب). Dictionary تخزن أزواجاً من (مفتاح-قيمة) وتستخدم جدول تجزئة (Hash Table) للوصول السريع جداً باستخدام المفتاح.',
    },
    analogy: {
      en: 'Searching a List is reading a notebook page by page until you find the name. Searching a Dictionary is using an organised phone book: you jump straight to the right letter.',
      ar: 'البحث في List يشبه قراءة دفتر ملاحظات صفحة بصفحة حتى تجد الاسم. البحث في Dictionary يشبه استخدام دليل هاتف منظم، حيث تذهب فوراً لحرف «س» لتجد «سعيد».',
    },
  },
  {
    n: 12,
    q: { en: 'What is the purpose of the finally block in exception handling?', ar: 'ما هو الغرض من كتلة finally في معالجة الاستثناءات؟' },
    a: {
      en: 'The <code>finally</code> block of a try–catch runs certain code whether or not an error occurred. It is typically used to clean up resources (closing files or database connections).',
      ar: 'كتلة <code>finally</code> في هيكلية try-catch تُستخدم لتنفيذ كود معين بغض النظر عما إذا حدث خطأ أم لا. تُستخدم عادة لتنظيف الموارد (إغلاق الملفات أو اتصالات قاعدة البيانات).',
    },
    analogy: {
      en: 'You are working in an office (try). You may finish successfully, or the alarm may ring (catch). Whatever happens, you must switch off the lights (finally) before leaving.',
      ar: 'تخيل أنك تعمل في مكتب (try). قد تنهي عملك بنجاح، أو قد يرن جرس الإنذار (catch). بغض النظر عما حدث، يجب عليك إطفاء الأنوار (finally) قبل المغادرة.',
    },
  },
  {
    n: 13,
    q: { en: 'What is Entity Framework and why do we use it?', ar: 'ما هو Entity Framework ولماذا نستخدمه؟' },
    a: {
      en: 'An ORM tool that lets developers work with the database using .NET objects instead of writing complicated SQL by hand.',
      ar: 'هو أداة (ORM) تمكن المبرمجين من التعامل مع قاعدة البيانات باستخدام كائنات .NET (Objects) بدلاً من كتابة أكواد SQL المعقدة يدوياً.',
    },
    analogy: {
      en: 'The database speaks “SQL” and your code speaks “C#”. Entity Framework is the interpreter standing in the middle, translating your C# into SQL so the database understands you.',
      ar: 'قاعدة البيانات تتحدث لغة «SQL» وكودك يتحدث «C#». Entity Framework هو المترجم الفوري الواقف في المنتصف، يترجم كلامك من C# إلى SQL لتفهمك قاعدة البيانات.',
    },
  },
  {
    n: 14,
    q: { en: 'What is the difference between REST and SOAP APIs?', ar: 'ما الفرق بين REST API و SOAP؟' },
    a: {
      en: 'SOAP is a strict protocol that uses XML and has high security standards. REST is a more flexible architectural style that uses standard HTTP methods and usually the JSON format.',
      ar: 'SOAP هو بروتوكول صارم يستخدم XML ومعايير أمان عالية. REST هو نمط معماري أكثر مرونة، يستخدم طرق HTTP القياسية، وغالباً ما يستخدم تنسيق JSON.',
    },
    analogy: {
      en: 'SOAP is a formal legal letter sealed with wax — secure but heavy and slow. REST is a postcard or a WhatsApp message — fast, light and easy to read.',
      ar: 'SOAP يشبه إرسال رسالة قانونية رسمية ومختومة بالشمع؛ آمنة لكنها ثقيلة وبطيئة. REST يشبه إرسال بطاقة بريدية أو رسالة «واتساب»؛ سريعة، خفيفة، وسهلة القراءة.',
    },
  },
  {
    n: 15,
    q: { en: 'What is a JWT and what is it used for?', ar: 'ما هو JWT وفيما يُستخدم؟' },
    a: {
      en: 'A compact, secure way of transmitting “claims” (data) between two parties. It is commonly used for authentication in web applications (stateless authentication).',
      ar: 'هو وسيلة مدمجة وآمنة لنقل «المطالبات» (البيانات) بين طرفين. يُستخدم عادةً للمصادقة في تطبيقات الويب (Stateless Authentication).',
    },
    analogy: {
      en: 'At a hotel, instead of checking your ID at every door they give you a wristband (the JWT). You carry it, and simply showing it proves who you are and which areas you may enter.',
      ar: 'في الفندق، بدلاً من فحص هويتك عند كل باب، يعطونك سواراً (JWT). أنت تحمل السوار معك، ومجرد إظهاره يثبت من أنت وما هي الأماكن المسموح لك بدخولها.',
    },
  },
  {
    n: 16,
    q: { en: 'What is the difference between managed and unmanaged code?', ar: 'ما الفرق بين الـ Managed Code والـ Unmanaged Code؟' },
    a: {
      en: 'Managed code runs under the supervision of the runtime (the CLR), which takes care of things like garbage collection and exception handling. Unmanaged code runs directly on the operating system outside the .NET environment (e.g. legacy C++), and the developer is responsible for managing its memory.',
      ar: 'Managed Code هو الكود الذي يتم تنفيذه تحت إشراف بيئة التشغيل (CLR)، حيث تتولى هي مهام مثل جمع القمامة ومعالجة الاستثناءات. أما Unmanaged Code فهو الكود الذي يتم تنفيذه مباشرة من قبل نظام التشغيل خارج بيئة الـ .NET (مثل كود C++ القديم)، والمبرمج هو المسؤول عن إدارة الذاكرة فيه.',
    },
    analogy: {
      en: 'Managed code is a child playing in a fenced playground under supervision: if they fall or break something, someone helps and cleans up. Unmanaged code is a child in an open forest: completely responsible for their own safety.',
      ar: 'Managed Code مثل طفل يلعب في «منطقة ألعاب مغلقة» تحت إشراف المربين؛ إذا سقط أو أفسد شيئاً، هناك من يساعده وينظف المكان. أما Unmanaged Code فهو مثل طفل يلعب في «غابة مفتوحة»؛ هو المسؤول تماماً عن سلامته وتدبير أموره.',
    },
  },
  {
    n: 17,
    q: { en: 'What is reflection in .NET?', ar: 'ما هو الـ Reflection في .NET؟' },
    a: {
      en: 'A feature that lets a program inspect its own metadata at runtime — for example discovering the names of methods or properties in an assembly without knowing them in advance — and even invoke them dynamically.',
      ar: 'هي ميزة تسمح للبرنامج بفحص بياناته الخاصة (Metadata) أثناء وقت التشغيل (Runtime)، مثل معرفة أسماء الدوال أو الخصائص داخل الـ Assembly دون معرفتها مسبقاً، ويمكن حتى استدعاؤها ديناميكياً.',
    },
    analogy: {
      en: 'The code looks in a mirror to see its own face. Instead of you telling the code what it has, it looks at itself and finds out: “I have a method called X with parameters Y”.',
      ar: 'تخيل أن الكود ينظر في المرآة ليرى تفاصيل وجهه. بدلاً من أن تخبر الكود بما لديه، هو يلقي نظرة على نفسه ويعرف: «آه، أنا عندي دالة اسمها X ومعاملاتها Y».',
    },
  },
  {
    n: 18,
    q: { en: 'What is the difference between String and StringBuilder?', ar: 'ما الفرق بين String و StringBuilder؟' },
    a: {
      en: '<code>String</code> is immutable: any modification creates a new copy in memory. <code>StringBuilder</code> is mutable: it edits the text in place, which is much faster when you make many modifications.',
      ar: 'الـ <code>String</code> هو Immutable (غير قابل للتعديل)؛ أي أن أي عملية تعديل عليه تخلق نسخة جديدة في الذاكرة. أما <code>StringBuilder</code> فهو Mutable؛ يسمح بتعديل النص في نفس المكان في الذاكرة، مما يجعله أسرع بكثير عند إجراء تعديلات كثيرة.',
    },
    analogy: {
      en: 'A String is an oil painting: to change one small detail you must repaint the whole canvas. A StringBuilder is a chalkboard: you wipe one word and write another in the same place.',
      ar: 'الـ String مثل «اللوحة الزيتية»؛ إذا أردت تغيير تفصيل صغير، عليك إعادة رسم اللوحة بالكامل. أما StringBuilder فهو مثل «السبورة»؛ يمكنك مسح كلمة وكتابة أخرى في نفس المكان بسهولة.',
    },
  },
  {
    n: 19,
    q: { en: 'What is a deadlock in multithreading?', ar: 'ما هو الـ Deadlock في البرمجة المتعددة (Multithreading)؟' },
    a: {
      en: 'A situation where two threads wait for each other to release locked resources, so the whole program stops because each side refuses to give up what it holds until it gets what the other holds.',
      ar: 'هو حالة تحدث عندما ينتظر «خيطان» (Threads) بعضهما البعض لتحرير موارد محجوزة، مما يؤدي لتوقف البرنامج بالكامل لأن كل طرف يرفض التنازل عما لديه حتى يحصل على ما عند الطرف الآخر.',
    },
    analogy: {
      en: 'Two cars face each other in a very narrow street. Car A waits for car B to reverse, and car B waits for A to reverse. Result: nobody moves and the street is blocked.',
      ar: 'تخيل سيارتين متقابلتين في شارع ضيق جداً. السيارة (أ) تنتظر السيارة (ب) لترجع للخلف، والسيارة (ب) تنتظر (أ) لترجع للخلف. النتيجة؟ لا أحد يتحرك والشارع يتوقف تماماً.',
    },
  },
  {
    n: 20,
    q: { en: 'What are extension methods?', ar: 'ما هي الـ Extension Methods؟' },
    a: {
      en: 'A feature that lets you add new methods to existing types (like <code>string</code> or <code>int</code>) without modifying their original code or inheriting from them.',
      ar: 'هي ميزة تسمح لك بإضافة دوال جديدة لأنواع موجودة مسبقاً (مثل string أو int) دون الحاجة لتعديل الكود الأصلي لتلك الأنواع أو الوراثة منها.',
    },
    analogy: {
      en: 'You own a regular blender and buy an attachment that also lets it chop vegetables. You did not open the motor and modify it; you added a feature from the outside.',
      ar: 'تخيل أن لديك «خلاطاً» عادياً، وقمت بشراء «قطعة إضافية» تركب عليه لجعله يقطع الخضار أيضاً. أنت لم تفتح الموتور وتعدله، بل أضفت له ميزة من الخارج.',
    },
  },
  {
    n: 21,
    q: { en: 'What is the difference between overloading and overriding?', ar: 'ما الفرق بين الـ Overloading والـ Overriding؟' },
    a: {
      en: '<strong>Overloading</strong>: several methods with the same name in the same class but different parameters. <strong>Overriding</strong>: rewriting a method of the parent class inside the child class to change its behaviour.',
      ar: '<strong>Overloading</strong> هو وجود أكثر من دالة بنفس الاسم في نفس الفئة ولكن بمعاملات مختلفة. أما <strong>Overriding</strong> فهو إعادة كتابة دالة موجودة في الفئة الأب داخل الفئة الابن لتغيير سلوكها.',
    },
    analogy: {
      en: 'Overloading is a coffee machine with several “coffee” buttons — black, or with milk (same name, different contents). Overriding is a son who takes his father’s recipe but changes the quantities to make it taste his own way.',
      ar: 'Overloading مثل آلة قهوة فيها عدة أزرار «قهوة»؛ زر يعطيك قهوة سادة، وزر قهوة بحليب (نفس الاسم لكن المحتوى مختلف). Overriding مثل ابن أخذ «وصفة الطبخ» من أبيه، لكنه قرر تغيير المقادير ليجعل الطعم مختلفاً بطريقته الخاصة.',
    },
  },
  {
    n: 22,
    q: { en: 'What is LINQ?', ar: 'ما هو الـ LINQ؟' },
    a: {
      en: 'Short for Language Integrated Query: a .NET feature for writing queries over data (arrays, databases, XML) directly in C# code in one consistent, readable style.',
      ar: 'هي اختصار لـ Language Integrated Query، وهي ميزة في .NET تسمح بكتابة استعلامات (Queries) للبيانات (سواء كانت مصفوفات، قواعد بيانات، أو XML) مباشرة داخل كود الـ C# بأسلوب موحد وسهل القراءة.',
    },
    analogy: {
      en: 'You have a box full of toys. Instead of searching by hand, you have a magic sieve and say: “give me only the red cars made after 2020” — and it sorts them out instantly.',
      ar: 'تخيل أن لديك صندوقاً مليئاً بالألعاب، وبدلاً من البحث يدوياً، لديك «منخل سحري» تقل له: «أعطني فقط السيارات الحمراء التي صنعت بعد عام 2020»، فيقوم بفرزها لك بلحظة.',
    },
  },
  {
    n: 23,
    q: { en: 'What is the difference between authentication and authorization?', ar: 'ما الفرق بين الـ Authentication والـ Authorization؟' },
    a: {
      en: 'Authentication verifies the user’s identity (who are you?). Authorization checks which permissions that user has (what are you allowed to do?).',
      ar: 'Authentication هي عملية التأكد من هوية المستخدم (من أنت؟). أما Authorization فهي التأكد من الصلاحيات المسموحة لهذا المستخدم (ماذا يحق لك أن تفعل؟).',
    },
    analogy: {
      en: 'Entering a company, the guard asks for your ID to make sure you are who you say you are (authentication). Inside, you try to enter the manager’s room and the guard stops you because you have no key (authorization).',
      ar: 'عند دخولك شركة، يطلب منك الحارس «الهوية» ليتأكد أنك الشخص المطلوب (Authentication). بعد الدخول، تحاول دخول غرفة المدير فيمنعك الحارس لأنك لا تملك مفتاحها (Authorization).',
    },
  },
  {
    n: 24,
    q: { en: 'What is unit testing?', ar: 'ما هو الـ Unit Testing؟' },
    a: {
      en: 'Writing small pieces of code that test one “unit” of the program (such as a single method) to make sure it works correctly and gives the expected results in different cases.',
      ar: 'هو كتابة كود صغير لاختبار «وحدة» معينة من البرنامج (مثل دالة واحدة) للتأكد من أنها تعمل بشكل صحيح وتعطي النتائج المتوقعة في حالات مختلفة.',
    },
    analogy: {
      en: 'Before assembling a car, the factory tests the lamp on its own and the motor on its own. If every part works perfectly, the car as a whole will probably work well.',
      ar: 'قبل تجميع السيارة، يقوم المصنع باختبار «المصباح» لوحده، و«الموتور» لوحده. إذا تأكدنا أن كل قطعة تعمل بامتياز، فمن المرجح أن السيارة ككل ستعمل بشكل جيد.',
    },
  },
  {
    n: 25,
    q: { en: 'What does “stateless” mean in Web APIs?', ar: 'ما المقصود بـ Stateless في الـ Web APIs؟' },
    a: {
      en: 'The server keeps no information about the user’s “state” between requests. Every request must contain everything needed to process it completely on its own.',
      ar: 'تعني أن الخادم (Server) لا يحتفظ بأي معلومات عن «حالة» المستخدم بين الطلبات المختلفة. كل طلب يصل للخادم يجب أن يحتوي على كل المعلومات اللازمة لمعالجته بشكل مستقل تماماً.',
    },
    analogy: {
      en: 'An ATM does not remember you just because you are standing in front of it. For every operation you insert the card and enter the PIN; it never says “you are the one who withdrew money a moment ago, go ahead without a PIN”.',
      ar: 'جهاز الصراف لا يتذكرك بمجرد وقوفك أمامه. في كل عملية تريد القيام بها، يجب أن تضع البطاقة وتدخل الرقم السري؛ هو لا يقول لك: «أهلاً، أنت الذي سحبت نقوداً قبل قليل، تفضل بدون رقم سري».',
    },
  },
  {
    n: 26,
    q: { en: 'How can a memory leak happen in .NET even though there is a garbage collector?', ar: 'كيف يمكن أن يحدث «تسريب ذاكرة» في .NET رغم وجود جامع القمامة (GC)؟' },
    a: {
      en: 'A leak happens when objects stay alive because references still point to them. The most common causes: not unsubscribing from event handlers, misusing static objects, or not releasing external (unmanaged) resources.',
      ar: 'يحدث التسريب عندما تبقى الكائنات «حية» في الذاكرة لأن هناك مراجع (References) لا تزال تشير إليها. أشهر الأسباب: عدم إلغاء الاشتراك في الأحداث (Event Handlers)، استخدام الكائنات الساكنة (Static Objects) بشكل خاطئ، أو عدم إغلاق الاتصالات الخارجية (Unmanaged Resources).',
    },
    analogy: {
      en: 'You rented a hotel room and left, but forgot to hand the key back. To the hotel the room is still booked: nobody can clean it or move in, even though you are no longer inside.',
      ar: 'تخيل إنك استأجرت غرفة بفندق وطلعت منها، بس «نسيت تسلم المفتاح» للإدارة. بالنسبة للفندق، الغرفة لسه محجوزة وما حدا بيقدر ينظفها أو يسكن فيها غيرك، رغم إنك فعلياً مو جواتها.',
    },
  },
  {
    n: 27,
    q: { en: 'What is the difference between Span<T> and Memory<T>, and when do we use Span<T>?', ar: 'الفرق بين Span<T> و Memory<T>: متى نستخدم Span<T> وكيف يساهم في تحسين الأداء؟' },
    a: {
      en: 'Both are data structures that let you work with slices of memory (arrays, strings) <em>without copying</em> them. <code>Span&lt;T&gt;</code> lives on the stack and is very fast for immediate operations; <code>Memory&lt;T&gt;</code> can live on the heap and is used in asynchronous operations.',
      ar: 'هما تراكيب بيانات تسمح بالتعامل مع أجزاء من الذاكرة (مثل المصفوفات أو النصوص) بدون الحاجة لعمل «نسخ» (Copy) لها. <code>Span&lt;T&gt;</code> يُخزن في الـ Stack وهو سريع جداً للعمليات اللحظية، بينما <code>Memory&lt;T&gt;</code> يمكن تخزينه في الـ Heap ويُستخدم في العمليات غير المتزامنة (Async).',
    },
    analogy: {
      en: 'Instead of cutting a piece out of a long carpet (copy) just to see its pattern, you open a “window” (Span) and focus on that piece. You saw what you wanted without cutting up the original carpet.',
      ar: 'بدل ما تقص قطعة من «برداية» طويلة (Copy) مشان تشوف زخرفتها، أنت بس بتفتح «شباك» (Span) وبتركز نظرك على هي القطعة. هيك أنت شفت اللي بدك ياه بدون ما تخرب أو تقص البرداية الأصلية.',
    },
  },
  {
    n: 28,
    q: { en: 'Why is the order of middleware in Program.cs critical?', ar: 'لماذا يعتبر ترتيب الـ Middleware في Program.cs أمراً حرجاً؟' },
    a: {
      en: 'Because the request passes through them in sequence. If you put <code>Authorization</code> before <code>Authentication</code>, the system tries to check permissions for a user it has not even identified yet — a logic error.',
      ar: 'لأن الطلب (Request) يمر عبرها بالتسلسل. إذا وضعت الـ <code>Authorization</code> قبل الـ <code>Authentication</code> مثلاً، سيحاول النظام التحقق من صلاحيات مستخدم لم يتم التعرف على هويته أصلاً، مما يؤدي لخطأ منطقي.',
    },
    analogy: {
      en: 'You cannot go through bag screening before your passport is stamped. If you mix up the order you will be sent back and have to redo everything — or you will let in people who should not be there.',
      ar: 'ما بصير تمر من «تفتيش الشنط» قبل ما «تختم جوازك». إذا خربطت بالترتيب، رح ترجع من نص الطريق وتعيد العملية كلها، أو رح تفوت ناس مالهن مصلحة.',
    },
  },
  {
    n: 29,
    q: { en: 'How do you handle distributed transactions in microservices?', ar: 'كيف تعالج مشكلة العمليات الموزعة (Distributed Transactions) في المعماريات المصغرة؟ (نمط الـ Saga)' },
    a: {
      en: 'We use the <strong>Saga</strong> pattern: split the big operation into several small independent operations. If one fails, we run a <em>compensating transaction</em> to undo the ones that already succeeded, keeping the data consistent.',
      ar: 'نستخدم نمط الـ <strong>Saga</strong>. وهو تقسيم العملية الكبيرة لعدة عمليات صغيرة مستقلة. إذا فشلت واحدة، نقوم بعملية «تعويضية» (Compensating Transaction) لإلغاء مفعول العمليات التي نجحت قبلها لضمان اتساق البيانات.',
    },
    analogy: {
      en: 'You ordered a pizza online; the app took your money, but the restaurant turned out to be closed. The Saga steps in: since the order did not complete, the system automatically runs a reverse operation and refunds your account.',
      ar: 'طلبت بيتزا أونلاين، التطبيق حجز المصاري، بس المطعم طلع مسكر. هون الـ Saga بتتدخل: بما إنه الطلب ما كمل، السيستم آلياً بيعمل «عملية عكسية» وبيرجعلك المصاري لحسابك.',
    },
  },
  {
    n: 30,
    q: { en: 'What is the CQRS pattern and what is its benefit in large systems?', ar: 'ما هو نمط الـ CQRS (Command Query Responsibility Segregation) وفائدته في الأنظمة الضخمة؟' },
    a: {
      en: 'Separating <em>read</em> operations (queries) from <em>write/update</em> operations (commands). This lets you build a very fast store for reads (e.g. Elasticsearch) and another durable store for writes, which hugely improves performance.',
      ar: 'هو فصل عمليات «القراءة» (Queries) عن عمليات «الكتابة والتعديل» (Commands). هذا يسمح بتطوير قاعدة بيانات سريعة جداً للقراءة (مثل Elasticsearch) وقاعدة بيانات أخرى متينة للكتابة، مما يحسن الأداء بشكل هائل.',
    },
    analogy: {
      en: 'Instead of one window for people who want to order and people who want to collect, a fast-food restaurant has an “order counter” and a “pickup counter”. The queue moves faster and neither side blocks the other.',
      ar: 'بدل ما يكون فيه «شباك واحد» للعالم اللي بدها تطلب والناس اللي بدها تستلم، بنعمل «كاونتر للطلب» و«كاونتر للتسليم». هيك الطابور بيمشي أسرع وما حدا بيعطل التاني.',
    },
  },
  {
    n: 31,
    q: { en: 'What is the benefit of IAsyncEnumerable<T> over Task<List<T>>?', ar: 'ما الفائدة من استخدام IAsyncEnumerable<T> بدلاً من Task<List<T>>؟' },
    a: {
      en: 'It lets you process data as soon as it arrives from the source (e.g. a database), piece by piece, instead of waiting for the whole list to load into memory. That saves memory and improves time-to-first-result.',
      ar: 'تسمح بمعالجة البيانات فور وصولها من المصدر (مثل Database) قطعة بقطعة، بدلاً من انتظار تحميل القائمة كاملة في الذاكرة. هذا يوفر استهلاك الذاكرة ويحسن زمن الاستجابة الأول.',
    },
    analogy: {
      en: '<code>Task&lt;List&gt;</code> is downloading a whole film before you can watch it. <code>IAsyncEnumerable</code> is streaming on YouTube: you start watching the first minute while the rest keeps loading in the background.',
      ar: '<code>Task&lt;List&gt;</code> متل لما تحمل فيلم كامل لتقدر تشوفه. أما <code>IAsyncEnumerable</code> فهي متل «الستريمينغ» على يوتيوب؛ بتبلش تحضر أول دقيقة والفيلم لسه عم يكمل تحميل بالخلفية.',
    },
  },
  {
    n: 32,
    q: { en: 'Explain the difference between concurrency and parallelism.', ar: 'اشرح الفرق بين التزامن (Concurrency) والتوازي (Parallelism).' },
    a: {
      en: '<strong>Concurrency</strong> is dealing with several tasks at the same time by switching between them. <strong>Parallelism</strong> is actually executing several tasks at the same instant using multiple CPU cores.',
      ar: '<strong>التزامن</strong> هو التعامل مع عدة مهام في نفس الوقت (تبديل بينها)، أما <strong>التوازي</strong> فهو تنفيذ عدة مهام فعلياً في نفس اللحظة باستخدام معالجات (CPU Cores) متعددة.',
    },
    analogy: {
      en: '<strong>Concurrency:</strong> one chef cooking two dishes — stirring one a little, then chopping vegetables for the other. <strong>Parallelism:</strong> two chefs in the same kitchen, each working on a dish at the very same moment.',
      ar: '<strong>التزامن:</strong> شيف واحد عم يطبخ طبختين، بيحرك هي شوي وبيروح بيقطع خضرة لهي شوي. <strong>التوازي:</strong> شيفين عم يطبخوا بنفس المطبخ، كل واحد ماسك طبخة وعم يشتغل فيها بنفس اللحظة.',
    },
  },
  {
    n: 33,
    q: { en: 'Why do we prefer Source Generators over classic reflection in modern .NET?', ar: 'لماذا نفضل الـ Source Generators في .NET الحديثة على الـ Reflection التقليدي؟' },
    a: {
      en: 'Reflection works at runtime and is slow and resource-hungry. Source Generators generate code at build time (compile-time), making the program much faster and supporting AOT (ahead-of-time) compilation.',
      ar: 'الـ Reflection يعمل أثناء التشغيل (Runtime) وهو بطيء ويستهلك موارد. أما Source Generators فتقوم بتوليد الكود أثناء بناء المشروع (Compile-time)، مما يجعل البرنامج أسرع بكثير ويدعم الـ AOT (Ahead-of-Time compilation).',
    },
    analogy: {
      en: '<strong>Reflection:</strong> guests arrive, then you go to the kitchen to think about what to cook and hunt for ingredients (slow). <strong>Source Generators:</strong> you prepare and pack all the food before the guests arrive, and serve it the moment they do (fast and ready).',
      ar: '<strong>Reflection:</strong> متل لما يجوا الضيوف وتدخل عالمطبخ تفكر شو بدك تطبخ وتدور عالاغراض (بطيء). <strong>Source Generators:</strong> متل لما تجهز الأكل كله وتغلفه قبل ما يوصلوا الضيوف، بس يوصلوا بتقدمه فوراً (سريع وجاهز).',
    },
  },
  {
    n: 34,
    q: { en: 'How can you avoid deadlocks in ASP.NET Core applications?', ar: 'كيف يمكن تجنب حدوث Deadlock في تطبيقات الـ ASP.NET Core؟' },
    a: {
      en: 'Avoid <code>.Result</code> or <code>.Wait()</code> on asynchronous tasks, and use <code>async/await</code> all the way down. In library code, prefer <code>ConfigureAwait(false)</code> so the task is not forced to return to the same context.',
      ar: 'تجنب استخدام <code>.Result</code> أو <code>.Wait()</code> على المهام غير المتزامنة، واستخدم دائماً <code>async/await</code> للنهاية. أيضاً، يفضل استخدام <code>ConfigureAwait(false)</code> في مكتبات الكود (Libraries) لعدم إجبار المهمة على العودة لنفس الـ Context.',
    },
    analogy: {
      en: 'Two people in a revolving door, one pushing one way and the other pushing the opposite way. If both hold their ground (a thread waiting for the other), the door will not turn. The fix: one lets go and lets the other through first.',
      ar: 'تخيل شخصين فايتين بباب دوار، واحد عم يدفع لجهة والتاني عم يدفع عكسه. إذا ضلوا متمسكين برأيهن (الـ Thread ناطر التاني)، الباب مارح يدور. الحل إنه واحد يترك ويخلي التاني يمر أول.',
    },
  },
  {
    n: 35,
    q: { en: 'What actually happens behind the scenes when you use yield return?', ar: 'ماذا يحدث فعلياً خلف الكواليس عند استخدام كلمة yield؟' },
    a: {
      en: 'The compiler builds a complex <strong>state machine</strong>. It remembers where the method stopped, and when the next element is requested the method resumes exactly where it left off, without re-executing from the start.',
      ar: 'يقوم المترجم (Compiler) ببناء «آلة حالة» (State Machine) معقدة. هي تحفظ مكان توقف الدالة، وعند طلب العنصر التالي، تعود الدالة للعمل من حيث توقفت تماماً، دون إعادة التنفيذ من البداية.',
    },
    analogy: {
      en: 'Ask the greengrocer for a kilo of apples and he hands you one apple at a time — not necessarily the whole crate at once. He remembers where he got to, and each time you say “one more” he gives you the next one.',
      ar: 'متل لما تطلب من البياع كيلو تفاح، بيعطيك تفاحة وتفاحة.. مو شرط يعطيك السحارة كلها مرة وحدة. هو بيتذكر وين وصل، وكل ما تطلب «كمان وحدة»، بيعطيك ياها من اللي جنبه.',
    },
  },
]

/** Q&A entries in order; `quiz` maps a Q&A number to the questions that test it, which follow right after it
 *  (so a lesson only asks about what it has just shown). */
const blocksFor = (numbers: number[], quiz: Record<number, number[]>): Block[] =>
  numbers.flatMap((n): Block[] => {
    const item = qa.find((x) => x.n === n)!
    return [
      {
        type: 'html',
        html: {
          en: `<h3>${n}. ${item.q.en}</h3><p>${item.a.en}</p>`,
          ar: `<h3>${n}. ${item.q.ar}</h3><p>${item.a.ar}</p>`,
        },
      },
      { type: 'box', variant: 'analogy', label: { en: 'Analogy', ar: 'التشبيه' }, html: item.analogy },
      ...exercises(...(quiz[n] ?? [])),
    ]
  })

const exercises = (...ns: number[]): Block[] => ns.map((n) => ({ type: 'exercise', questionId: `net-q${String(n).padStart(3, '0')}` }))

const questions = [
  mcq('net', W, 1, 'types',
    { en: 'Where are value types usually stored, and where is the data of reference types stored?', ar: 'أين تُخزن أنواع القيمة عادةً، وأين تُخزن بيانات الأنواع المرجعية؟' },
    [{ en: 'Value types: stack; reference-type data: heap', ar: 'أنواع القيمة: Stack؛ بيانات الأنواع المرجعية: Heap' }, { en: 'Both on the heap', ar: 'كلاهما في Heap' }, { en: 'Value types: heap; reference-type data: stack', ar: 'أنواع القيمة: Heap؛ بيانات الأنواع المرجعية: Stack' }], 0),
  mcq('net', W, 2, 'types',
    { en: 'Which relationship does an interface express?', ar: 'أي علاقة تعبّر عنها الواجهة (Interface)؟' },
    [{ en: '“is-a” (shared base behaviour)', ar: '«هو يكون» (سلوك أساسي مشترك)' }, { en: '“can-do” (a capability/contract)', ar: '«يستطيع أن يفعل» (قدرة/عقد)' }, { en: '“has-a” only', ar: '«يملك» فقط' }], 1),
  mcq('net', W, 3, 'memory',
    { en: 'What is boxing?', ar: 'ما هو الـ Boxing؟' },
    [{ en: 'Converting a value type to a reference type (object)', ar: 'تحويل نوع قيمة إلى نوع مرجعي (object)' }, { en: 'Compressing an object to save memory', ar: 'ضغط كائن لتوفير الذاكرة' }, { en: 'Moving an object from the heap to the stack', ar: 'نقل كائن من Heap إلى Stack' }], 0),
  mcq('net', W, 4, 'memory',
    { en: 'Why is StringBuilder faster than String for many edits?', ar: 'لماذا StringBuilder أسرع من String عند التعديلات الكثيرة؟' },
    [{ en: 'It edits the text in place instead of creating a new string each time', ar: 'لأنه يعدّل النص في مكانه بدل إنشاء نص جديد في كل مرة' }, { en: 'It compresses the characters', ar: 'لأنه يضغط الحروف' }, { en: 'It runs on a separate thread', ar: 'لأنه يعمل على خيط منفصل' }], 0),
  mcq('net', W, 5, 'memory',
    { en: 'How can a memory leak happen with a garbage collector?', ar: 'كيف يحدث تسريب الذاكرة مع وجود جامع القمامة؟' },
    [{ en: 'Objects stay referenced (e.g. un-removed event handlers or static fields)', ar: 'تبقى الكائنات مُشار إليها (مثل معالجات أحداث لم تُزل أو حقول static)' }, { en: 'The GC only runs once at startup', ar: 'يعمل الـ GC مرة واحدة فقط عند البدء' }, { en: 'Value types are never collected', ar: 'أنواع القيمة لا يتم جمعها أبدًا' }], 0),
  mcq('net', W, 6, 'linq',
    { en: 'Which is true about IQueryable vs IEnumerable with a database?', ar: 'أي عبارة صحيحة عن IQueryable مقابل IEnumerable مع قاعدة البيانات؟' },
    [{ en: 'IQueryable filters inside the database; IEnumerable filters in memory after loading', ar: 'IQueryable يفلتر داخل قاعدة البيانات؛ IEnumerable يفلتر في الذاكرة بعد التحميل' }, { en: 'They behave identically', ar: 'يتصرفان بنفس الطريقة' }, { en: 'IEnumerable generates SQL', ar: 'IEnumerable يولّد SQL' }], 0),
  mcq('net', W, 7, 'async',
    { en: 'What does await do?', ar: 'ماذا تفعل await؟' },
    [{ en: 'Pauses the method until the task completes without blocking the thread', ar: 'توقف الدالة مؤقتًا حتى تكتمل المهمة دون حجب الخيط' }, { en: 'Starts a new OS process', ar: 'تبدأ عملية جديدة في نظام التشغيل' }, { en: 'Blocks the thread until the task completes', ar: 'تحجب الخيط حتى تكتمل المهمة' }], 0),
  mcq('net', W, 8, 'async',
    { en: 'Which pair is correct?', ar: 'أي زوج صحيح؟' },
    [{ en: 'Concurrency = switching between tasks; parallelism = running at the same instant on several cores', ar: 'التزامن = التبديل بين المهام؛ التوازي = التنفيذ في نفس اللحظة على عدة أنوية' }, { en: 'Concurrency = several cores; parallelism = one core', ar: 'التزامن = عدة أنوية؛ التوازي = نواة واحدة' }, { en: 'They mean the same thing', ar: 'لهما المعنى نفسه' }], 0),
  mcq('net', W, 9, 'async',
    { en: 'Which habit risks a deadlock in ASP.NET Core?', ar: 'أي عادة قد تسبب Deadlock في ASP.NET Core؟' },
    [{ en: 'Calling .Result or .Wait() on an async task', ar: 'استدعاء .Result أو .Wait() على مهمة غير متزامنة' }, { en: 'Using async/await all the way down', ar: 'استخدام async/await حتى النهاية' }, { en: 'Using ConfigureAwait(false) in libraries', ar: 'استخدام ConfigureAwait(false) في المكتبات' }], 0),
  mcq('net', W, 10, 'async',
    { en: 'What does the finally block guarantee?', ar: 'ماذا تضمن كتلة finally؟' },
    [{ en: 'It runs whether or not an exception occurred', ar: 'تُنفَّذ سواء حدث استثناء أم لا' }, { en: 'It runs only when an exception occurred', ar: 'تُنفَّذ فقط عند حدوث استثناء' }, { en: 'It prevents exceptions', ar: 'تمنع حدوث الاستثناءات' }], 0),
  mcq('net', W, 11, 'di',
    { en: 'What is the main benefit of dependency injection?', ar: 'ما الفائدة الرئيسية لحقن التبعيات؟' },
    [{ en: 'Loose coupling and easier testing', ar: 'ارتباط ضعيف وسهولة الاختبار' }, { en: 'Faster compilation', ar: 'ترجمة أسرع' }, { en: 'Removing the need for interfaces', ar: 'الاستغناء عن الواجهات' }], 0),
  mcq('net', W, 12, 'di',
    { en: 'A service registered as Scoped is created…', ar: 'الخدمة المسجلة كـ Scoped يتم إنشاؤها…' },
    [{ en: 'once per HTTP request', ar: 'مرة واحدة لكل طلب HTTP' }, { en: 'every time it is requested', ar: 'في كل مرة تُطلب' }, { en: 'once for the whole application', ar: 'مرة واحدة للتطبيق كله' }], 0),
  mcq('net', W, 13, 'web',
    { en: 'Which describes middleware?', ar: 'أي عبارة تصف الـ Middleware؟' },
    [{ en: 'Components in a pipeline that each pass the request on or handle it', ar: 'مكونات في خط أنابيب يمرر كل منها الطلب أو يعالجه' }, { en: 'A database layer', ar: 'طبقة قاعدة بيانات' }, { en: 'A type of controller', ar: 'نوع من المتحكمات' }], 0),
  mcq('net', W, 14, 'web',
    { en: 'Why must Authentication come before Authorization in the pipeline?', ar: 'لماذا يجب أن يأتي Authentication قبل Authorization في خط الأنابيب؟' },
    [{ en: 'You cannot check permissions for a user you have not identified yet', ar: 'لا يمكن التحقق من صلاحيات مستخدم لم يتم التعرف عليه بعد' }, { en: 'Alphabetical order', ar: 'الترتيب الأبجدي' }, { en: 'It does not matter', ar: 'لا يهم' }], 0),
  mcq('net', W, 15, 'web',
    { en: 'What does “stateless” mean for a Web API?', ar: 'ماذا تعني «Stateless» في Web API؟' },
    [{ en: 'Each request carries all the information needed to process it', ar: 'كل طلب يحمل كل المعلومات اللازمة لمعالجته' }, { en: 'The API has no database', ar: 'لا تملك الواجهة قاعدة بيانات' }, { en: 'The server remembers the user between requests', ar: 'يتذكر الخادم المستخدم بين الطلبات' }], 0),
  mcq('net', W, 16, 'web',
    { en: 'What is a JWT typically used for?', ar: 'فيمَ يُستخدم JWT عادةً؟' },
    [{ en: 'Stateless authentication: carrying signed claims between parties', ar: 'مصادقة بدون حالة: نقل مطالبات موقّعة بين الأطراف' }, { en: 'Compressing responses', ar: 'ضغط الردود' }, { en: 'Querying a database', ar: 'الاستعلام من قاعدة بيانات' }], 0),
  mcq('net', W, 17, 'architecture',
    { en: 'Which pattern handles distributed transactions with compensating actions?', ar: 'أي نمط يعالج العمليات الموزعة بإجراءات تعويضية؟' },
    [{ en: 'Saga', ar: 'Saga' }, { en: 'Singleton', ar: 'Singleton' }, { en: 'Decorator', ar: 'Decorator' }], 0),
  mcq('net', W, 18, 'architecture',
    { en: 'What does CQRS separate?', ar: 'ماذا يفصل CQRS؟' },
    [{ en: 'Reads (queries) from writes (commands)', ar: 'القراءة (الاستعلامات) عن الكتابة (الأوامر)' }, { en: 'Front end from back end', ar: 'الواجهة الأمامية عن الخلفية' }, { en: 'Compile time from runtime', ar: 'وقت الترجمة عن وقت التشغيل' }], 0),
  mcq('net', W, 19, 'performance',
    { en: 'Why prefer Source Generators over reflection?', ar: 'لماذا نفضّل Source Generators على Reflection؟' },
    [{ en: 'They generate code at compile time, so it is faster and AOT-friendly', ar: 'تولّد الكود وقت الترجمة فيكون أسرع ومتوافقًا مع AOT' }, { en: 'They are older and more stable', ar: 'هي أقدم وأكثر استقرارًا' }, { en: 'They avoid using types', ar: 'تتجنب استخدام الأنواع' }], 0),
  mcq('net', W, 20, 'performance',
    { en: 'When is IAsyncEnumerable<T> better than Task<List<T>>?', ar: 'متى يكون IAsyncEnumerable<T> أفضل من Task<List<T>>؟' },
    [{ en: 'When you want to process items as they arrive without loading the whole list in memory', ar: 'عندما تريد معالجة العناصر فور وصولها دون تحميل القائمة كلها في الذاكرة' }, { en: 'When the list is tiny', ar: 'عندما تكون القائمة صغيرة جدًا' }, { en: 'Never — they are identical', ar: 'أبدًا — هما متطابقان' }], 0),
]

const section = (
  id: string,
  label: Localized,
  nav: Localized,
  title: Localized,
  standfirst: Localized,
  numbers: number[],
  quiz: Record<number, number[]>,
  timeEst: string,
): Section => ({
  id,
  navLabel: nav,
  sectionLabel: label,
  timeEst: { en: timeEst, ar: timeEst },
  headingHtml: heading(title, standfirst),
  blocks: blocksFor(numbers, quiz),
})

export const dotnet: Module = {
  id: W,
  courseId: COURSE_ID,
  order: 2,
  cover: cover(
    { en: 'Technical rounds · Module 2', ar: 'الجولات التقنية · الوحدة 2' },
    { en: '.NET interview Q&amp;A', ar: 'أسئلة مقابلات .NET' },
    { en: '≈ 60 min · 35 questions', ar: '≈ 60 دقيقة · 35 سؤالًا' },
  ),
  sections: [
    {
      id: 'how-to-use',
      navLabel: { en: 'How to use this', ar: 'كيف تستخدم هذه الوحدة' },
      sectionLabel: { en: 'Intro', ar: 'مقدمة' },
      headingHtml: heading(
        { en: '35 common .NET questions', ar: '٣٥ سؤالًا شائعًا في .NET' },
        {
          en: 'Each question has the textbook answer an interviewer expects and an everyday analogy that makes it stick. Say the official answer first, then the analogy if you want to show real understanding.',
          ar: 'لكل سؤال الإجابة الرسمية التي يتوقعها المحاور وتشبيه من الحياة اليومية يثبّتها في الذاكرة. اذكر الإجابة الرسمية أولاً ثم التشبيه إن أردت إظهار فهم حقيقي.',
        },
      ),
      blocks: [
        {
          type: 'objectives',
          label: { en: 'You will be able to', ar: 'ستتمكن من' },
          items: [
            { en: 'Explain core C#/.NET runtime concepts clearly', ar: 'شرح مفاهيم C#/.NET الأساسية بوضوح' },
            { en: 'Answer async, DI and middleware questions precisely', ar: 'الإجابة بدقة عن أسئلة async وحقن التبعيات والـ Middleware' },
            { en: 'Discuss architecture patterns (Saga, CQRS) and performance topics', ar: 'مناقشة أنماط العمارة (Saga وCQRS) ومواضيع الأداء' },
          ],
        },
      ],
    },
    section('fundamentals', { en: 'Part 1', ar: 'الجزء ١' }, { en: 'Language & runtime', ar: 'اللغة وبيئة التشغيل' },
      { en: 'Language and runtime fundamentals', ar: 'أساسيات اللغة وبيئة التشغيل' },
      { en: 'Types, memory, exceptions and everyday language features.', ar: 'الأنواع والذاكرة والاستثناءات وميزات اللغة اليومية.' },
      [1, 2, 5, 8, 11, 12, 16, 17, 18, 20, 21, 22], { 1: [1], 2: [2], 8: [3], 12: [10], 18: [4] }, '25 min'),
    section('async-perf', { en: 'Part 2', ar: 'الجزء ٢' }, { en: 'Async, concurrency & performance', ar: 'التزامن والأداء' },
      { en: 'Async, concurrency and performance', ar: 'البرمجة غير المتزامنة والتزامن والأداء' },
      { en: 'Writing responsive code and avoiding the classic traps.', ar: 'كتابة كود سريع الاستجابة وتجنب الفخاخ الشائعة.' },
      [4, 19, 32, 34, 35, 31, 26, 27, 33, 6], { 4: [7], 32: [8], 34: [9], 31: [20], 26: [5], 33: [19], 6: [6] }, '20 min'),
    section('web-arch', { en: 'Part 3', ar: 'الجزء ٣' }, { en: 'Web & architecture', ar: 'الويب والعمارة' },
      { en: 'Web APIs and architecture', ar: 'واجهات الويب والعمارة' },
      { en: 'Dependency injection, the pipeline, security and distributed-system patterns.', ar: 'حقن التبعيات وخط الأنابيب والأمان وأنماط الأنظمة الموزعة.' },
      [3, 7, 9, 10, 28, 13, 14, 15, 23, 24, 25, 29, 30], { 3: [11], 9: [13], 10: [12], 28: [14], 15: [16], 25: [15], 29: [17], 30: [18] }, '20 min'),
  ],
  questions,
}
