import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية — تطبيق كاتب المعاريض',
  description: 'سياسة الخصوصية لتطبيق كاتب المعاريض على Google Play',
}

const CONTACT_EMAIL = 'privacy@daleel-adawat.com'

export default function MaroodPrivacyPage() {
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
        قانوني · تطبيق كاتب المعاريض
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
        آخر تحديث: 13 يوليو 2026
      </p>

      {[
        {
          title: '١. عن التطبيق',
          body: `تطبيق «كاتب المعاريض» تطبيق مجاني لتوليد خطابات ومعاريض رسمية عربية على أندرويد. يعمل بالكامل بدون اتصال إنترنت.`,
        },
        {
          title: '٢. البيانات التي يحفظها التطبيق',
          body: `عند تعبئة أي خطاب، قد تُدخل بياناتك الشخصية (الاسم، رقم الهوية، رقم الجوال). يحفظ التطبيق هذه البيانات على جهازك فقط باستخدام مساحة تخزين محلية، لغرض واحد: تعبئتها تلقائياً في المرة القادمة.`,
        },
        {
          title: '٣. هل يرسل التطبيق بياناتك لأي جهة؟',
          body: `لا. التطبيق لا يحتوي على خوادم، ولا يرسل أي بيانات عبر الإنترنت، ولا يشاركها مع أي طرف ثالث.`,
        },
        {
          title: '٤. الإعلانات والتتبع',
          body: `التطبيق لا يحتوي على أي إعلانات، ولا أي أدوات تتبع أو تحليلات (Analytics)، ولا يتطلب إنشاء حساب.`,
        },
        {
          title: '٥. مشاركة الملفات',
          body: `عند اختيارك مشاركة خطاب (PDF أو نص) عبر واتساب أو أي تطبيق آخر، تتم هذه المشاركة عبر نظام المشاركة القياسي في جهازك، وتحت اختيارك الكامل.`,
        },
        {
          title: '٦. خصوصية الأطفال',
          body: `التطبيق غير موجه للأطفال ولا يجمع بيانات عن قصد من أي مستخدم.`,
        },
        {
          title: '٧. تغييرات على هذه السياسة',
          body: `قد تُحدَّث هذه الصفحة من وقت لآخر. سيظهر تاريخ آخر تحديث أعلى الصفحة دائماً.`,
        },
        {
          title: '٨. التواصل',
          body: `لأي استفسار حول هذه السياسة: ${CONTACT_EMAIL}`,
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
