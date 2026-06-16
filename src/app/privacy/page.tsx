import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية لموقع دليل أدوات الذكاء الاصطناعي بالعربية',
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://daleel-adawat.com'
const CONTACT_EMAIL = 'privacy@daleel-adawat.com'

export default function PrivacyPage() {
  return (
    <div style={{ padding: '40px 0', maxWidth: 720 }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 11,
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--accent)' }} />
        قانوني
      </div>

      <h1 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 8,
      }}>
        سياسة الخصوصية
      </h1>

      <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: 'var(--text-muted)', marginBottom: 40 }}>
        آخر تحديث: يونيو 2026
      </p>

      {[
        {
          title: '١. المعلومات التي نجمعها',
          body: `نجمع المعلومات التي تقدمها طوعاً عند الاشتراك في نشرتنا البريدية (البريد الإلكتروني فقط). لا نجمع بيانات شخصية دون إذنك.\n\nقد تجمع أدوات التحليل (مثل Google Analytics) معلومات مجهولة الهوية عن زياراتك مثل نوع المتصفح، الدولة، والصفحات التي تزورها.`,
        },
        {
          title: '٢. كيف نستخدم معلوماتك',
          body: `نستخدم بريدك الإلكتروني فقط لإرسال النشرة البريدية التي اشتركت فيها. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تسويقية.`,
        },
        {
          title: '٣. الإعلانات وبرامج الشركاء (Affiliate)',
          body: `يعرض الموقع إعلانات عبر Google AdSense. قد يستخدم Google ملفات تعريف الارتباط (cookies) لعرض إعلانات ذات صلة باهتماماتك.\n\nيحتوي الموقع على روابط شركاء (affiliate links). إذا اشتريت من خلال هذه الروابط، قد نحصل على عمولة دون أي تكلفة إضافية عليك. نُشير بوضوح إلى هذه الروابط.`,
        },
        {
          title: '٤. ملفات تعريف الارتباط (Cookies)',
          body: `نستخدم ملفات تعريف الارتباط الضرورية لتشغيل الموقع، وملفات تحليلية لفهم كيفية استخدامك للموقع (مجهولة الهوية). يمكنك تعطيل الكوكيز من إعدادات متصفحك.`,
        },
        {
          title: '٥. الاحتفاظ بالبيانات',
          body: `نحتفظ ببريدك الإلكتروني طالما أنت مشترك في النشرة. يمكنك إلغاء الاشتراك في أي وقت عبر رابط "إلغاء الاشتراك" في أي رسالة.`,
        },
        {
          title: '٦. حقوقك',
          body: `لديك الحق في الاطلاع على بياناتك، تصحيحها، أو حذفها. للتواصل: ${CONTACT_EMAIL}`,
        },
        {
          title: '٧. تغييرات على هذه السياسة',
          body: `قد نحدّث هذه السياسة من وقت لآخر. سننشر التغييرات على هذه الصفحة مع تاريخ التحديث.`,
        },
        {
          title: '٨. التواصل',
          body: `لأي استفسار عن الخصوصية: ${CONTACT_EMAIL}\nالموقع: ${SITE_URL}`,
        },
      ].map(({ title, body }) => (
        <section key={title} style={{ marginBottom: 32 }}>
          <h2 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: 12,
          }}>
            {title}
          </h2>
          <p style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 15,
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}>
            {body}
          </p>
        </section>
      ))}
    </div>
  )
}
