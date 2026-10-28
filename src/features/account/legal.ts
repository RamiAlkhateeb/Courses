import type { Localized } from '../../content/types'

// Plain-language drafts of the Terms of Use, Privacy Policy and Help pages linked from sign-up and Account. They say what
// the app really does today (no analytics, no ads, an optional account kept in Supabase, play money only). They are DRAFTS:
// the owner must review them (and the Arabic) before launch, and update them whenever the app collects something new.

export interface LegalPage {
  title: Localized
  sections: { h: Localized; p: Localized }[]
  /** An address shown as a link under the text (Help: where to report a problem) */
  link?: string
}

const L = (en: string, ar: string): Localized => ({ en, ar })

export const LEGAL_PAGES = ['terms', 'privacy', 'help'] as const
export type LegalPageId = (typeof LEGAL_PAGES)[number]

export const LEGAL: Record<LegalPageId, LegalPage> = {
  terms: {
    title: L('Terms of Use', 'شروط الاستخدام'),
    sections: [
      {
        h: L('What Zubda is', 'ما هو تطبيق زبدة'),
        p: L(
          'Zubda is a free app for learning about investing. It is for learning only. Nothing in it is financial advice, and nothing in it tells you to buy or sell anything.',
          'زبدة تطبيق مجاني لتعلّم الاستثمار. هو للتعلّم فقط. لا شيء فيه نصيحة مالية، ولا شيء فيه يطلب منك أن تشتري أو تبيع أي شيء.',
        ),
      },
      {
        h: L('Play money', 'الأموال التجريبية'),
        p: L(
          'The money you earn from lessons and use in the Playground is play money. It has no real value, cannot be withdrawn or exchanged, and you cannot lose real money with it. The simulated market is made up: how it behaves says nothing about how real markets will behave.',
          'الأموال التي تكسبها من الدروس وتستخدمها في ساحة التجارب أموال تجريبية. ليس لها قيمة حقيقية، ولا يمكن سحبها أو استبدالها، ولا يمكنك خسارة أموال حقيقية بها. السوق المحاكى مُختلَق: سلوكه لا يدل على سلوك الأسواق الحقيقية.',
        ),
      },
      {
        h: L('Your account', 'حسابك'),
        p: L(
          'An account is optional. If you make one, keep your password safe and use an email address you can open, because we send confirmation and reset links to it. You are responsible for what happens under your account.',
          'الحساب اختياري. إذا أنشأت حساباً فحافظ على كلمة مرورك واستخدم بريداً إلكترونياً تستطيع فتحه، لأننا نرسل إليه روابط التأكيد وإعادة التعيين. أنت مسؤول عمّا يحدث في حسابك.',
        ),
      },
      {
        h: L('Using the app fairly', 'الاستخدام العادل'),
        p: L(
          'Please do not try to break the app, reach other people’s data, or use it for anything unlawful.',
          'يرجى عدم محاولة تعطيل التطبيق أو الوصول إلى بيانات الآخرين أو استخدامه في أي أمر مخالف للقانون.',
        ),
      },
      {
        h: L('Changes', 'التغييرات'),
        p: L(
          'We may change the app or these terms. If a change matters to you, we will say so in the app.',
          'قد نغيّر التطبيق أو هذه الشروط. إذا كان التغيير مهماً لك فسنذكر ذلك في التطبيق.',
        ),
      },
    ],
  },
  privacy: {
    title: L('Privacy Policy', 'سياسة الخصوصية'),
    sections: [
      {
        h: L('Without an account', 'بدون حساب'),
        p: L(
          'Nothing leaves your device. Your progress, play money and settings are kept in this browser only.',
          'لا يغادر شيء جهازك. يبقى تقدمك وأموالك التجريبية وإعداداتك في هذا المتصفح فقط.',
        ),
      },
      {
        h: L('With an account', 'مع حساب'),
        p: L(
          'We keep your name, your email address, and a copy of your learning progress, settings and Playground (play money) so they follow you to other devices. Your email is used only to sign you in and to send confirmation and password-reset emails.',
          'نحتفظ باسمك وبريدك الإلكتروني ونسخة من تقدمك التعليمي وإعداداتك وساحة التجارب (الأموال التجريبية) لتتبعك إلى أجهزتك الأخرى. يُستخدم بريدك فقط لتسجيل دخولك ولإرسال رسائل التأكيد وإعادة تعيين كلمة المرور.',
        ),
      },
      {
        h: L('Where it is kept', 'أين تُحفظ'),
        p: L(
          'Account data is stored with Supabase, a hosted database and sign-in service. Access rules make sure each account can read and change only its own data.',
          'تُحفظ بيانات الحساب لدى Supabase، وهي خدمة قاعدة بيانات وتسجيل دخول مستضافة. تضمن قواعد الوصول أن كل حساب يقرأ ويعدّل بياناته وحدها.',
        ),
      },
      {
        h: L('What we do not do', 'ما لا نفعله'),
        p: L(
          'No ads, no selling your data, and no analytics or tracking of what you do in the app.',
          'لا إعلانات، ولا بيع لبياناتك، ولا تحليلات أو تتبّع لما تفعله في التطبيق.',
        ),
      },
      {
        h: L('Your choices', 'خياراتك'),
        p: L(
          'Logging out keeps this device’s copy as guest progress. Deleting your account (Account → Delete account) removes your account and the copy we keep online; this device keeps its own copy until you clear this site’s data in your browser.',
          'تسجيل الخروج يُبقي نسخة هذا الجهاز كتقدّم ضيف. حذف حسابك (الحساب ← حذف الحساب) يزيل حسابك والنسخة التي نحتفظ بها على الإنترنت؛ ويحتفظ هذا الجهاز بنسخته إلى أن تمسح بيانات هذا الموقع من متصفحك.',
        ),
      },
    ],
  },
  help: {
    title: L('Help and support', 'المساعدة والدعم'),
    sections: [
      {
        h: L('I did not get the confirmation email', 'لم تصلني رسالة التأكيد'),
        p: L(
          'Check your spam folder and that the address is right. On the “Confirm your email” screen you can resend it after the short wait.',
          'تحقق من مجلد الرسائل غير المرغوب فيها ومن صحة العنوان. في شاشة «أكّد بريدك الإلكتروني» يمكنك إعادة الإرسال بعد الانتظار القصير.',
        ),
      },
      {
        h: L('I forgot my password', 'نسيت كلمة المرور'),
        p: L(
          'On the Log in screen, tap “Forgot password?” and we will email you a link to choose a new one.',
          'في شاشة تسجيل الدخول اضغط «نسيت كلمة المرور؟» وسنرسل لك رابطاً لاختيار كلمة جديدة.',
        ),
      },
      {
        h: L('Is any of this real money?', 'هل أي من هذا مال حقيقي؟'),
        p: L(
          'No. Everything you earn and trade is play money, and Zubda never asks for payment details.',
          'لا. كل ما تكسبه وتتداوله أموال تجريبية، ولا يطلب تطبيق زبدة أي بيانات دفع.',
        ),
      },
      {
        h: L('How do I use my progress on another device?', 'كيف أستخدم تقدمي على جهاز آخر؟'),
        p: L(
          'Log in with the same account there. Your progress, play money and settings are brought across.',
          'سجّل الدخول بالحساب نفسه هناك. يُنقل تقدمك وأموالك التجريبية وإعداداتك.',
        ),
      },
      {
        h: L('How do I delete my account?', 'كيف أحذف حسابي؟'),
        p: L('Open Me → Account → Delete account.', 'افتح أنا ← الحساب ← حذف الحساب.'),
      },
      {
        h: L('Found a problem?', 'وجدت مشكلة؟'),
        p: L('Tell us on the project’s issue page:', 'أخبرنا في صفحة المشكلات الخاصة بالمشروع:'),
      },
    ],
    link: 'https://github.com/RamiAlkhateeb/Courses/issues',
  },
}
