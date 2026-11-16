# ⚡ نظام الطابور الذكي العام (Smart Queue System MVP)

> **نظام طابور ذكي فائق الخفة مخصص للعيادات الطبية، صالونات الحلاقة، مكاتب التوثيق، والمصالح الإدارية والجامعية لإفراغ قاعات الانتظار بصفر تكلفة عتاد إضافي (بدون شاشات تلفاز وبدون طابعات تذاكر).**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/amir-lebbaz/smart-queue-system)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amir-lebbaz/smart-queue-system)

---

## 🌟 الميزات الجوهرية (Core Features)

1. **صفر تكلفة عتاد (Zero Extra Hardware)**: يعمل بالكامل عبر هاتف المسير الذكي (`PWA Remote`) وملصق جداري واحد يحمل رمز QR.
2. **دعم أصحاب الهواتف البسيطة ("هاتف حطبة / بدون هاتف")**:
   - يسجل المسير تذكرة حضورية بنقرة واحدة.
   - يحسب النظام تلقائياً وقت العودة الدقيق بالساعة والدقيقة (`HH:MM`) ليغادر الزبون القاعة ويعود في وقته.
   - أزرار اتصال مباشر `tel:` (رنة Bip مجانية) و `sms:` جاهزة بنقرة واحدة.
3. **تجميد وحفظ الدور للغائب المؤقت (Smart Hold)**:
   - إذا نودي على الزبون ولم يحضر بعد، ينقر المسير "تأجيل خطوة (Hold)" ليستدعي الزبون التالي فوراً مع الاحتفاظ بدور الغائب في أعلى القائمة للدخول كأولوية قصوى بمجرد وصوله.
4. **العمل بدون إنترنت (Offline Resilience & PWA)**:
   - يحفظ هاتف الزبون التذكرة محلياً، مع عداد تنازلي مستقل يعمل بدون اتصال.
   - تنبيه صوتي واهتزاز فور اقتراب الدور (أقل من شخصين أو أقل من 10 دقائق).
5. **نداء صوتي عربي أصيل (Arabic Voice Announcement)**:
   - نطق صوتي تلقائي للأرقام المستدعاة بالعربية الفصحى عبر `Web Speech API`.
6. **ملصق حائط QR فيكتور محلي 100%**:
   - إمكانية طباعة ملصق الجدار مباشرة بجودة عالية دون الحاجة للاتصال بخوادم خارجية.
7. **متعدد القطاعات والمصطلحات**:
   - مهيأ مسبقاً لـ:
     - عيادة طبية (`مريض` / `الطبيب`)
     - صالون حلاقة (`زبون` / `الحلاق`)
     - مصلحة جامعية (`طالب` / `مسؤول الشباك`)

---

## 🚀 النشر المجاني الفوري (1-Click Free Deployment)

### 1. النشر على منصة Render (الخيار الأفضل لاستمرارية SQLite):
انقر على الزر التالي لإنشاء الخدمة مجاناً 100%:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/amir-lebbaz/smart-queue-system)

- **نوع الخدمة**: Web Service
- **خطة مجانية**: Free tier
- **أمر البناء**: `npm install && npm run build`
- **أمر التشغيل**: `npm run start`

---

### 2. النشر على منصة Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amir-lebbaz/smart-queue-system)

---

## 💻 التشغيل المحلي (Local Development)

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل بيئة التطوير
npm run dev

# أو البناء والتشغيل بالإنتاج
npm run build
npm run start
```

افتح المتصفح على: `http://localhost:3000`

---

## 📱 الروابط والمسارات

- `/`: البوابة الرئيسية والنماذج التجريبية الثلاثة
- `/q/[slug]`: تذكرة الزبون الذكية
- `/admin/[slug]`: ريموت المسير (رمز PIN الافتراضي: `1234`)
- `/super-admin`: لوحة مالك النظام لإضافة المشتركين
