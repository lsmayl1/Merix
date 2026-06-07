import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCreateDemoRequestMutation } from "../../redux/features/demo/demoRequestsSlice";

const LogoName = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 213 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M58 49.8438V9.0625L41.0207 22.9638V22.8326L16.829 0H0V58L16.829 43.3032V21.914L29.3005 33.0679L41.0207 22.8326V22.9638V49.8438H58Z"
      fill="white"
    />
    <path
      d="M72.788 50V41.938H93.262V50H72.788ZM72.788 17.462V9.4H93.262V17.462H72.788ZM72.788 32.6V24.712H92.102V32.6H72.788ZM66.292 9.4H75.688V50H66.292V9.4ZM111.389 31.614H121.539L134.241 50H122.757L111.389 31.614ZM101.239 9.4H111.041V50H101.239V9.4ZM107.387 17.694V9.4H116.029C119.509 9.4 122.409 9.96066 124.729 11.082C127.049 12.2033 128.809 13.7693 130.007 15.78C131.206 17.752 131.805 20.0527 131.805 22.682C131.805 25.2727 131.206 27.5733 130.007 29.584C128.809 31.556 127.049 33.1027 124.729 34.224C122.409 35.3453 119.509 35.906 116.029 35.906H107.387V28.308H115.333C116.648 28.308 117.769 28.1147 118.697 27.728C119.664 27.3027 120.399 26.7033 120.901 25.93C121.404 25.118 121.655 24.1513 121.655 23.03C121.655 21.9087 121.404 20.9613 120.901 20.188C120.399 19.376 119.664 18.7573 118.697 18.332C117.769 17.9067 116.648 17.694 115.333 17.694H107.387ZM138.792 9.4H148.768V50H138.792V9.4ZM179.642 9.4H191.764L179.004 29.178L192.634 50H180.512L173.088 36.486L165.432 50H153.31L167.23 29.178L154.76 9.4H166.882L173.146 21.174L179.642 9.4Z"
      fill="white"
    />
  </svg>
);

type Lang = "az" | "en" | "ru";

const TR: Record<Lang, Record<string, string>> = {
  az: {
    navFeatures:"Xüsusiyyətlər", navBenefits:"Faydalar", navIndustries:"Sənaye",
    navPricing:"Qiymət", navFaq:"Suallar", navDemo:"Demo", navContact:"Əlaqə", navLogin:"Daxil ol",
    heroBadge:"500+ biznes artıq etibar edir",
    heroH1a:"Biznesinizi", heroH1b:"Nəzarət edin",
    heroSub:"Tam ERP/POS sistemi — sürətli ödənişlər, real vaxt anbar izləməsi. Lazım olan hər şey bir platformada.",
    heroCtaPrimary:"Pulsuz sınaq başla",
    heroTrust:"Kredit kartı tələb olunmur · 14 günlük pulsuz sınaq · Dəqiqələrdə quraşdırın",
    statBiz:"Aktiv biznes", statOps:"Əməliyyat/ay", statUp:"İşləmə müddəti",
    modalTitle:"Pulsuz sınaq başla", modalSub:"Məlumatlarınızı göndərin, komandamız sizinlə əlaqə saxlayacaq",
    fldName:"Ad Soyad", fldCompany:"Şirkət adı", fldPhone:"Telefon", fldEmail:"Email",
    fldMsg:"Mesaj (isteğe bağlı)", fldMsgPh:"Biznesiniz haqqında qısaca məlumat verin...",
    btnSend:"Göndər", btnSending:"Göndərilir...", formFooter:"Telefon və ya email ən azı biri tələb olunur",
    successTitle:"Tələbiniz qəbul edildi!", successSub:"Komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq.",
    errRequired:"Ad tələb olunur", errContact:"Telefon və ya email tələb olunur",
    errSend:"Göndərilə bilmədi. Zəhmət olmasa yenidən cəhd edin.", btnClose:"Bağla",
    probTitle:"Pərakəndə biznes çətindir", probSub:"Hər gün eyni problemlərə çıxılır",
    prob1Title:"Anbar xaosu", prob1Desc:"Çatışmazlıq, həddən artıq ehtiyat — düzgün izləmə olmadan pul itirirsiniz.",
    prob2Title:"Kor qərarlar", prob2Desc:"Real vaxt rejimində mənfəət məlumatları olmadan təxminlərlə qiymət təyin olunur.",
    prob3Title:"Yavaş ödənişlər", prob3Desc:"Zəif POS sistemləri uzun növbələr və itirilmiş satışlar yaradır.",
    solTitle:"Bir platforma", solSub:"Əməliyyatlarınızın hər aspektini birləşdirir",
    sol1Title:"Sürətli ödəniş", sol1Desc:"Barkod skanı, çoxlu səbət, ani çəklər.",
    sol2Title:"Ağıllı anbar", sol2Desc:"FIFO partiya, son istifadə tarixi, real vaxt səviyyələri.",
    sol3Title:"Analitika", sol3Desc:"Gəlir, mənfəət, top məhsullar, nağd axını panelləri.",
    sol4Title:"Komanda idarəetməsi", sol4Desc:"Rol əsaslı giriş, növbə izləməsi, PIN qapısı.",
    featTitle:"Xüsusiyyətlər", featSub:"Güclü funksiyalar, kiçik biznesə uyğunlaşdırılmış",
    feat1Title:"FIFO izləməsi", feat1Desc:"First-In-First-Out metodu. Həqiqi mənfəət marjanı dəqiqdir.",
    feat2Title:"Çoxlu ödəniş", feat2Desc:"Nağd, kart, kredit. Avtomatik uyğunlaşdırma.",
    feat3Title:"Barkod və çəki", feat3Desc:"Barkod skanı, EAN, avtomatik çəki oxuması.",
    feat4Title:"Real vaxt analitika", feat4Desc:"Canlı panellər: gəlir, mənfəət, top məhsullar.",
    feat5Title:"Təchizatçı idarəetməsi", feat5Desc:"Təchizatçılar, faturalar, borc izləməsi.",
    feat6Title:"Təhlükəsizlik", feat6Desc:"Rol əsaslı icazələr, şifrlənmə, audit izləri.",
    benTitle:"Faydalar", benSub:"Müştəri faydaları",
    ben1Label:"+40% sürət", ben1Desc:"Növbə vaxtları azalır",
    ben2Label:"+25% mənfəət", ben2Desc:"Dəqiq FIFO",
    ben3Label:"-90% səhv", ben3Desc:"Dəqiq izləmə",
    ben4Label:"15 saat/həftə", ben4Desc:"Avtomatik hesabatlar",
    indTitle:"Sənaye", indSub:"Kiçik mağazalardan çoxfiliallı şəbəkələrə qədər",
    ind1Title:"Baqqal və supermarketlər", ind1Desc:"Çəki barkod, partiya izləməsi, yüksək satış.",
    ind1F1:"EAN-13 çəki əsaslı məhsul dəstəyi", ind1F2:"Son istifadə tarixi izləməsi", ind1F3:"Yüksək sürətli barkod skanirləmə",
    ind2Title:"Əlverişli mağazalar", ind2Desc:"Min SKU, tez axtarış, çoxlu səbət.",
    ind2F1:"Tez məhsul axtarışı", ind2F2:"Məşğul dövrlər üçün çoxlu səbət", ind2F3:"Kassir növbəsi izləməsi",
    ind3Title:"Moda və geyim", ind3Desc:"Ölçü, rəng, mövsüm izləməsi. Trend analitika.",
    ind3F1:"Variant idarəetməsi", ind3F2:"Mövsümi kateqoriya təşkili", ind3F3:"Ən çox satılan analitikası",
    ind4Title:"Tikinti materialları", ind4Desc:"Həcmli ehtiyat, qarışıq vahid, təchizatçı borc.",
    ind4F1:"Qarışıq vahid növləri (kq/ədəd)", ind4F2:"Təchizatçı borc izləməsi", ind4F3:"Kütləvi anbar tənziləmələri",
    ind5Title:"Kafelər və tez xidmət", ind5Desc:"Sifariş emalı, maddə izləməsi, növbə hesabatları.",
    ind5F1:"Tez sifariş emalı", ind5F2:"Maddə ehtiyatı izləməsi", ind5F3:"Kassir növbəsi hesabatları",
    ind6Title:"Aptek və sağlamlıq", ind6Desc:"Partiya/seriya, son istifadə tarixi, audit izləri.",
    ind6F1:"Partiya/seriya izləməsi", ind6F2:"Son istifadə tarixi xəbərdarlıqları", ind6F3:"Tam audit tarixçəsi",
    howTitle:"Addımlar", howSub:"Dəqiqələrdə işə salılırsınız",
    how1Title:"Hesabınızı qurun", how1Desc:"2 dəqiqədə.",
    how2Title:"Məhsullarınızı idxal edin", how2Desc:"Excel vasitəsilə.",
    how3Title:"Satmağa başlayın", how3Desc:"Heç vaxt gözləməyin.", howCta:"Pulsuz sınaq başla",
    testTitle:"Rəylər", testSub:"Müştəri rəylərindən",
    test1Text:"FIFO izləməsi bizə vaxtı bitmiş məhsullardan xilas etdi. Hər gecə saatlar çəkən sayım indi 10 dəqiqə oldu.",
    test1Name:"Aysel Y.", test1Role:"Baqqal sahibi, Bakı",
    test2Text:"3 mağaza idarə edirəm və Merix hamısını sinxron saxlayır. Telefondan istənilən yerdən satışları yoxlaya biliram.",
    test2Name:"Rəşad K.", test2Role:"Çoxfiliallı sahibi, Gəncə",
    test3Text:"Hər gün 200+ müştəriyə xidmət edirik. Sistem heç vaxt yavaşlamır. Mağazam üçün ən yaxşı investisiya.",
    test3Name:"Fərid M.", test3Role:"Supermarket meneceri, Sumqayıt",
    statBizFull:"Aktiv bizneslər", statOpsMonth:"Aylıq əməliyyatlar", statUptime:"İşləmə müddəti SLA", statSupport:"Yerli dəstək",
    priceTitle:"Qiymət", priceSub:"Biznesə uyğun plan seçin",
    plan1Name:"Başlanğıc", plan1Sub:"Kiçik mağazalar üçün ideal",
    plan1F1:"1 POS terminal", plan1F2:"1,000 Məhsul", plan1F3:"Əsas hesabatlar", plan1F4:"Email dəstək",
    plan2Name:"Professional", plan2Sub:"Böyüyən bizneslər üçün", plan2Popular:"Ən populyar",
    plan2F1:"3 POS terminal", plan2F2:"Limitsiz Məhsul", plan2F3:"Qabaqcıl analitika", plan2F4:"Təchizatçı idarəetməsi", plan2F5:"Prioritet dəstək",
    plan3Name:"Korporativ", plan3Sub:"Çoxfiliallı şəbəkələr üçün",
    plan3F1:"Limitsiz terminallar", plan3F2:"Çoxfiliallı dəstək", plan3F3:"Fərdi inteqrasiyalar", plan3F4:"Həsr olunmuş hesab meneceri", plan3F5:"24/7 telefon dəstək",
    planCta1:"Pulsuz sınaq başla", planCta3:"Satış şöbəsi ilə əlaqə", perMonth:"/ay",
    faqTitle:"Suallar", faqSub:"Bilməli olduğunuz hər şey",
    faq1Q:"Quraşdırma nə qədər vaxt aparır?", faq1A:"30 dəqiqə. Excel ilə tez idxal edilir.",
    faq2Q:"Merix-i oflayn istifadə edə bilərəm?", faq2A:"Bəli! Oflayn mod dəstəklənir. Məlumatlar vahid sinxronlaşır.",
    faq3Q:"Xüsusi avadanlıq lazımdır?", faq3A:"Standart barkod skaneri, çek printeri, pul qutusu. USB, Bluetooth dəstəyi.",
    faq4Q:"Plan limitlərini keçsəm nə olar?", faq4A:"Xəbərdar olursunuz. Həmişə keçə bilərsiniz. Əlavə haqq yoxdur.",
    faq5Q:"Məlumatlarım təhlükəsizdir?", faq5A:"256-bit şifrləmə. Gündəlik ehtiyat. Rol əsaslı icazələr.",
    faq6Q:"Məlumatlarımı ixrac edə bilərəm?", faq6A:"Bəli! Excel, PDF ilə ixrac. Tam məlumat tələb əsasında.",
    faq7Q:"Kömək lazımdırsa nə olar?", faq7A:"24/7 çat, email, telefon dəstəyi. Sənədləşmə, videolar.",
    faq8Q:"Müqavilə var?", faq8A:"Yox. Aylıq, istənilən vaxt ləğv. İllik 2 ay pulsuz.",
    demoTitle:"Demo tələb edin", demoSub:"Komandamız 24 saat ərzində sizinlə əlaqə saxlayacaq",
    demoBtn:"Demo tələb et", demoSuccessSub:"Komandamız tezliklə sizinlə əlaqə saxlayacaq.",
    contactTitle:"Bizimlə əlaqə", contactSub:"Sualınız var? Komandamız telefon, WhatsApp, Instagram və email vasitəsilə cavab verməyə hazırdır.",
    ctaTitle:"Hazırsınız?", ctaSub:"500+ pərakəndə satıcı Merix-ə etibar edir. Bu gün başlayın.",
    ctaBtn1:"Pulsuz sınaq başla", ctaBtn2:"Bizimlə əlaqə",
    ctaTrust:"14 günlük pulsuz sınaq · Kredit kartı tələb olunmur · Dəqiqələrdə quraşdırın · İstənilən vaxt ləğv edin",
    footerProduct:"Məhsul", footerCompany:"Şirkət", footerLegal:"Hüquqi",
    footerDesc:"ERP/POS sistemi pərakəndə biznes üçün.",
    footerFeatures:"Xüsusiyyətlər", footerPricing:"Qiymət", footerIndustries:"Sənaye", footerFaq:"Suallar",
    footerAbout:"Haqqımızda", footerContact:"Əlaqə", footerCareers:"Karyera", footerBlog:"Blog",
    footerPrivacy:"Məxfilik Siyasəti", footerTerms:"Xidmət Şərtləri", footerSecurity:"Təhlükəsizlik",
    footerRights:"Bütün hüquqlar qorunur.",
    modBadge:"Tam platforma", modTitle:"Bütün modullar bir yerdə",
    modSub:"Satışdan anbara, analitikadan hesabatlara — idarə etdiyiniz hər şey",
  },
  en: {
    navFeatures:"Features", navBenefits:"Benefits", navIndustries:"Industries",
    navPricing:"Pricing", navFaq:"FAQ", navDemo:"Demo", navContact:"Contact", navLogin:"Log in",
    heroBadge:"500+ businesses already trust us",
    heroH1a:"Control Your", heroH1b:"Business",
    heroSub:"Complete ERP/POS system — fast payments, real-time inventory tracking. Everything you need in one platform.",
    heroCtaPrimary:"Start Free Trial",
    heroTrust:"No credit card required · 14-day free trial · Set up in minutes",
    statBiz:"Active businesses", statOps:"Operations/month", statUp:"Uptime",
    modalTitle:"Start Free Trial", modalSub:"Submit your details and our team will get in touch",
    fldName:"Full Name", fldCompany:"Company Name", fldPhone:"Phone", fldEmail:"Email",
    fldMsg:"Message (optional)", fldMsgPh:"Tell us briefly about your business...",
    btnSend:"Submit", btnSending:"Sending...", formFooter:"Phone or email is required",
    successTitle:"Request received!", successSub:"Our team will contact you within 24 hours.",
    errRequired:"Name is required", errContact:"Phone or email is required",
    errSend:"Could not send. Please try again.", btnClose:"Close",
    probTitle:"Retail is hard", probSub:"The same problems every day",
    prob1Title:"Inventory chaos", prob1Desc:"Stockouts, overstock — without proper tracking you're losing money.",
    prob2Title:"Blind decisions", prob2Desc:"Prices are set by guesswork without real-time profit data.",
    prob3Title:"Slow payments", prob3Desc:"Weak POS systems create long queues and lost sales.",
    solTitle:"One platform", solSub:"Unites every aspect of your operations",
    sol1Title:"Fast checkout", sol1Desc:"Barcode scan, multiple baskets, instant receipts.",
    sol2Title:"Smart inventory", sol2Desc:"FIFO batches, expiry dates, real-time levels.",
    sol3Title:"Analytics", sol3Desc:"Revenue, profit, top products, cash flow dashboards.",
    sol4Title:"Team management", sol4Desc:"Role-based access, shift tracking, PIN gateway.",
    featTitle:"Features", featSub:"Powerful functions tailored for small business",
    feat1Title:"FIFO tracking", feat1Desc:"First-In-First-Out method. Accurate real profit margins.",
    feat2Title:"Multiple payments", feat2Desc:"Cash, card, credit. Automatic reconciliation.",
    feat3Title:"Barcode & weight", feat3Desc:"Barcode scan, EAN, automatic weight reading.",
    feat4Title:"Real-time analytics", feat4Desc:"Live dashboards: revenue, profit, top products.",
    feat5Title:"Supplier management", feat5Desc:"Suppliers, invoices, debt tracking.",
    feat6Title:"Security", feat6Desc:"Role-based permissions, encryption, audit trails.",
    benTitle:"Benefits", benSub:"Customer results",
    ben1Label:"+40% faster", ben1Desc:"Queue times reduced",
    ben2Label:"+25% profit", ben2Desc:"Accurate FIFO",
    ben3Label:"-90% errors", ben3Desc:"Precise tracking",
    ben4Label:"15 hrs/week", ben4Desc:"Automated reports",
    indTitle:"Industries", indSub:"From small shops to multi-branch networks",
    ind1Title:"Grocery & supermarkets", ind1Desc:"Weight barcodes, batch tracking, high volume.",
    ind1F1:"EAN-13 weight-based product support", ind1F2:"Expiry date tracking", ind1F3:"High-speed barcode scanning",
    ind2Title:"Convenience stores", ind2Desc:"Min SKU, quick search, multiple baskets.",
    ind2F1:"Quick product search", ind2F2:"Multiple baskets for busy periods", ind2F3:"Cashier shift tracking",
    ind3Title:"Fashion & clothing", ind3Desc:"Size, colour, season tracking. Trend analytics.",
    ind3F1:"Variant management", ind3F2:"Seasonal category organisation", ind3F3:"Best-seller analytics",
    ind4Title:"Building materials", ind4Desc:"Bulk stock, mixed units, supplier debt.",
    ind4F1:"Mixed unit types (kg/pcs)", ind4F2:"Supplier debt tracking", ind4F3:"Bulk inventory adjustments",
    ind5Title:"Cafes & fast food", ind5Desc:"Order processing, ingredient tracking, shift reports.",
    ind5F1:"Fast order processing", ind5F2:"Ingredient stock tracking", ind5F3:"Cashier shift reports",
    ind6Title:"Pharmacy & health", ind6Desc:"Batch/serial, expiry dates, audit trails.",
    ind6F1:"Batch/serial tracking", ind6F2:"Expiry date alerts", ind6F3:"Full audit history",
    howTitle:"Steps", howSub:"Up and running in minutes",
    how1Title:"Set up your account", how1Desc:"In 2 minutes.",
    how2Title:"Import your products", how2Desc:"Via Excel.",
    how3Title:"Start selling", how3Desc:"No waiting.", howCta:"Start Free Trial",
    testTitle:"Reviews", testSub:"From our customers",
    test1Text:"FIFO tracking saved us from expired products. The nightly count that used to take hours now takes 10 minutes.",
    test1Name:"Aysel Y.", test1Role:"Grocery owner, Baku",
    test2Text:"I manage 3 stores and Merix keeps them all in sync. I can check sales from anywhere on my phone.",
    test2Name:"Rashad K.", test2Role:"Multi-branch owner, Ganja",
    test3Text:"We serve 200+ customers daily. The system never slows down. Best investment for my store.",
    test3Name:"Farid M.", test3Role:"Supermarket manager, Sumgait",
    statBizFull:"Active businesses", statOpsMonth:"Monthly operations", statUptime:"Uptime SLA", statSupport:"Local support",
    priceTitle:"Pricing", priceSub:"Choose a plan that fits your business",
    plan1Name:"Starter", plan1Sub:"Ideal for small shops",
    plan1F1:"1 POS terminal", plan1F2:"1,000 Products", plan1F3:"Basic reports", plan1F4:"Email support",
    plan2Name:"Professional", plan2Sub:"For growing businesses", plan2Popular:"Most popular",
    plan2F1:"3 POS terminals", plan2F2:"Unlimited products", plan2F3:"Advanced analytics", plan2F4:"Supplier management", plan2F5:"Priority support",
    plan3Name:"Enterprise", plan3Sub:"For multi-branch networks",
    plan3F1:"Unlimited terminals", plan3F2:"Multi-branch support", plan3F3:"Custom integrations", plan3F4:"Dedicated account manager", plan3F5:"24/7 phone support",
    planCta1:"Start Free Trial", planCta3:"Contact sales", perMonth:"/mo",
    faqTitle:"FAQ", faqSub:"Everything you need to know",
    faq1Q:"How long does setup take?", faq1A:"30 minutes. Fast import via Excel.",
    faq2Q:"Can I use Merix offline?", faq2A:"Yes! Offline mode is supported. Data syncs when reconnected.",
    faq3Q:"Is special hardware required?", faq3A:"Standard barcode scanner, receipt printer, cash drawer. USB & Bluetooth supported.",
    faq4Q:"What if I exceed plan limits?", faq4A:"You'll be notified. You can always upgrade. No extra charges.",
    faq5Q:"Is my data secure?", faq5A:"256-bit encryption. Daily backups. Role-based permissions.",
    faq6Q:"Can I export my data?", faq6A:"Yes! Export to Excel, PDF. Full data available on request.",
    faq7Q:"What if I need help?", faq7A:"24/7 chat, email, phone support. Documentation & video guides.",
    faq8Q:"Is there a contract?", faq8A:"No. Monthly billing, cancel anytime. Annual plan: 2 months free.",
    demoTitle:"Request a Demo", demoSub:"Our team will contact you within 24 hours",
    demoBtn:"Request demo", demoSuccessSub:"Our team will contact you shortly.",
    contactTitle:"Contact Us", contactSub:"Questions? Our team is ready to help via phone, WhatsApp, Instagram and email.",
    ctaTitle:"Ready?", ctaSub:"500+ retailers trust Merix. Start today.",
    ctaBtn1:"Start Free Trial", ctaBtn2:"Contact Us",
    ctaTrust:"14-day free trial · No credit card · Set up in minutes · Cancel anytime",
    footerProduct:"Product", footerCompany:"Company", footerLegal:"Legal",
    footerDesc:"ERP/POS system for retail businesses.",
    footerFeatures:"Features", footerPricing:"Pricing", footerIndustries:"Industries", footerFaq:"FAQ",
    footerAbout:"About", footerContact:"Contact", footerCareers:"Careers", footerBlog:"Blog",
    footerPrivacy:"Privacy Policy", footerTerms:"Terms of Service", footerSecurity:"Security",
    footerRights:"All rights reserved.",
    modBadge:"Full platform", modTitle:"All modules in one place",
    modSub:"From sales to inventory, analytics to reports — everything you manage",
  },
  ru: {
    navFeatures:"Функции", navBenefits:"Преимущества", navIndustries:"Отрасли",
    navPricing:"Цены", navFaq:"FAQ", navDemo:"Демо", navContact:"Контакты", navLogin:"Войти",
    heroBadge:"500+ бизнесов уже доверяют нам",
    heroH1a:"Управляйте", heroH1b:"Бизнесом",
    heroSub:"Полная ERP/POS-система — быстрые платежи, отслеживание запасов в реальном времени. Всё на одной платформе.",
    heroCtaPrimary:"Начать бесплатно",
    heroTrust:"Без кредитной карты · 14 дней бесплатно · Запуск за минуты",
    statBiz:"Активных бизнесов", statOps:"Операций/мес", statUp:"Время работы",
    modalTitle:"Начать бесплатно", modalSub:"Отправьте данные и мы свяжемся с вами",
    fldName:"Имя Фамилия", fldCompany:"Название компании", fldPhone:"Телефон", fldEmail:"Email",
    fldMsg:"Сообщение (необязательно)", fldMsgPh:"Расскажите кратко о вашем бизнесе...",
    btnSend:"Отправить", btnSending:"Отправляется...", formFooter:"Телефон или email обязателен",
    successTitle:"Запрос получен!", successSub:"Наша команда свяжется с вами в течение 24 часов.",
    errRequired:"Имя обязательно", errContact:"Телефон или email обязателен",
    errSend:"Не удалось отправить. Попробуйте ещё раз.", btnClose:"Закрыть",
    probTitle:"Розничный бизнес сложен", probSub:"Одни и те же проблемы каждый день",
    prob1Title:"Хаос на складе", prob1Desc:"Нехватка товаров, переизбыток — без отслеживания вы теряете деньги.",
    prob2Title:"Слепые решения", prob2Desc:"Цены устанавливаются наугад без данных о прибыли в реальном времени.",
    prob3Title:"Медленные платежи", prob3Desc:"Слабые POS-системы создают очереди и потери продаж.",
    solTitle:"Одна платформа", solSub:"Объединяет все аспекты вашей работы",
    sol1Title:"Быстрая оплата", sol1Desc:"Сканирование штрих-кода, несколько корзин, мгновенные чеки.",
    sol2Title:"Умный склад", sol2Desc:"Партии FIFO, сроки годности, уровни в реальном времени.",
    sol3Title:"Аналитика", sol3Desc:"Выручка, прибыль, топ-товары, дашборды денежных потоков.",
    sol4Title:"Управление командой", sol4Desc:"Ролевой доступ, отслеживание смен, PIN-шлюз.",
    featTitle:"Функции", featSub:"Мощные функции для малого бизнеса",
    feat1Title:"FIFO-учёт", feat1Desc:"Метод первым вошёл — первым вышел. Точная маржа прибыли.",
    feat2Title:"Несколько видов оплаты", feat2Desc:"Наличные, карта, кредит. Автоматическая сверка.",
    feat3Title:"Штрих-код и весы", feat3Desc:"Сканирование штрих-кода, EAN, автоматическое считывание.",
    feat4Title:"Аналитика в реальном времени", feat4Desc:"Живые дашборды: выручка, прибыль, топ-товары.",
    feat5Title:"Управление поставщиками", feat5Desc:"Поставщики, счета, отслеживание долгов.",
    feat6Title:"Безопасность", feat6Desc:"Ролевые разрешения, шифрование, журналы аудита.",
    benTitle:"Преимущества", benSub:"Результаты клиентов",
    ben1Label:"+40% быстрее", ben1Desc:"Сокращение очередей",
    ben2Label:"+25% прибыли", ben2Desc:"Точный FIFO",
    ben3Label:"-90% ошибок", ben3Desc:"Точное отслеживание",
    ben4Label:"15 ч/нед", ben4Desc:"Автоматические отчёты",
    indTitle:"Отрасли", indSub:"От малых магазинов до многофилиальных сетей",
    ind1Title:"Продуктовые магазины", ind1Desc:"Весовые штрих-коды, партионный учёт, высокий объём.",
    ind1F1:"Поддержка весовых товаров EAN-13", ind1F2:"Отслеживание сроков годности", ind1F3:"Высокоскоростное сканирование",
    ind2Title:"Мини-маркеты", ind2Desc:"Мин. SKU, быстрый поиск, несколько корзин.",
    ind2F1:"Быстрый поиск товаров", ind2F2:"Несколько корзин в часы пик", ind2F3:"Учёт смен кассира",
    ind3Title:"Мода и одежда", ind3Desc:"Учёт размеров, цветов, сезонов. Аналитика трендов.",
    ind3F1:"Управление вариантами", ind3F2:"Сезонная организация категорий", ind3F3:"Аналитика бестселлеров",
    ind4Title:"Стройматериалы", ind4Desc:"Оптовый склад, смешанные единицы, долг поставщика.",
    ind4F1:"Смешанные единицы (кг/шт)", ind4F2:"Отслеживание долгов поставщиков", ind4F3:"Массовые корректировки склада",
    ind5Title:"Кафе и фастфуд", ind5Desc:"Обработка заказов, учёт ингредиентов, отчёты смен.",
    ind5F1:"Быстрая обработка заказов", ind5F2:"Учёт запасов ингредиентов", ind5F3:"Отчёты смен кассира",
    ind6Title:"Аптеки и здоровье", ind6Desc:"Партия/серия, сроки годности, журналы аудита.",
    ind6F1:"Партионный/серийный учёт", ind6F2:"Оповещения об истечении срока", ind6F3:"Полная история аудита",
    howTitle:"Шаги", howSub:"Запуск за считанные минуты",
    how1Title:"Создайте аккаунт", how1Desc:"За 2 минуты.",
    how2Title:"Импортируйте товары", how2Desc:"Через Excel.",
    how3Title:"Начните продавать", how3Desc:"Без ожидания.", howCta:"Начать бесплатно",
    testTitle:"Отзывы", testSub:"От наших клиентов",
    test1Text:"FIFO-учёт спас нас от просроченных товаров. Ночной подсчёт, занимавший часы, теперь занимает 10 минут.",
    test1Name:"Айсель Ю.", test1Role:"Владелец бакалеи, Баку",
    test2Text:"Я управляю 3 магазинами, и Merix синхронизирует их все. Могу проверить продажи с телефона из любого места.",
    test2Name:"Рашад К.", test2Role:"Владелец сети, Гянджа",
    test3Text:"Обслуживаем 200+ клиентов в день. Система никогда не тормозит. Лучшая инвестиция для моего магазина.",
    test3Name:"Фарид М.", test3Role:"Менеджер супермаркета, Сумгаит",
    statBizFull:"Активных бизнесов", statOpsMonth:"Операций в месяц", statUptime:"SLA времени работы", statSupport:"Местная поддержка",
    priceTitle:"Цены", priceSub:"Выберите план для вашего бизнеса",
    plan1Name:"Стартовый", plan1Sub:"Идеально для малых магазинов",
    plan1F1:"1 POS-терминал", plan1F2:"1 000 товаров", plan1F3:"Базовые отчёты", plan1F4:"Email-поддержка",
    plan2Name:"Professional", plan2Sub:"Для растущего бизнеса", plan2Popular:"Популярный",
    plan2F1:"3 POS-терминала", plan2F2:"Безлимитные товары", plan2F3:"Расширенная аналитика", plan2F4:"Управление поставщиками", plan2F5:"Приоритетная поддержка",
    plan3Name:"Корпоративный", plan3Sub:"Для многофилиальных сетей",
    plan3F1:"Безлимитные терминалы", plan3F2:"Многофилиальная поддержка", plan3F3:"Инд. интеграции", plan3F4:"Выделенный менеджер", plan3F5:"Тел. поддержка 24/7",
    planCta1:"Начать бесплатно", planCta3:"Связаться с продажами", perMonth:"/мес",
    faqTitle:"FAQ", faqSub:"Всё что нужно знать",
    faq1Q:"Сколько занимает настройка?", faq1A:"30 минут. Быстрый импорт через Excel.",
    faq2Q:"Можно использовать Merix офлайн?", faq2A:"Да! Офлайн-режим поддерживается. Данные синхронизируются.",
    faq3Q:"Нужно специальное оборудование?", faq3A:"Стандартный сканер, принтер чеков, денежный ящик. USB и Bluetooth.",
    faq4Q:"Что если превышу лимиты плана?", faq4A:"Вы получите уведомление. Можно повысить план. Доп. плата отсутствует.",
    faq5Q:"Мои данные в безопасности?", faq5A:"256-битное шифрование. Ежедневные резервные копии. Ролевые разрешения.",
    faq6Q:"Могу экспортировать данные?", faq6A:"Да! Экспорт в Excel, PDF. Полные данные по запросу.",
    faq7Q:"Что если нужна помощь?", faq7A:"Поддержка 24/7: чат, email, телефон. Документация, видео.",
    faq8Q:"Есть договор?", faq8A:"Нет. Помесячно, отмена в любое время. Годовой план: 2 месяца бесплатно.",
    demoTitle:"Запросить демо", demoSub:"Наша команда свяжется с вами в течение 24 часов",
    demoBtn:"Запросить демо", demoSuccessSub:"Наша команда свяжется с вами в ближайшее время.",
    contactTitle:"Свяжитесь с нами", contactSub:"Есть вопросы? Наша команда готова помочь по телефону, WhatsApp, Instagram и email.",
    ctaTitle:"Готовы?", ctaSub:"500+ розничных продавцов доверяют Merix. Начните сегодня.",
    ctaBtn1:"Начать бесплатно", ctaBtn2:"Связаться с нами",
    ctaTrust:"14 дней бесплатно · Без кредитной карты · Запуск за минуты · Отмена в любое время",
    footerProduct:"Продукт", footerCompany:"Компания", footerLegal:"Правовая информация",
    footerDesc:"ERP/POS-система для розничного бизнеса.",
    footerFeatures:"Функции", footerPricing:"Цены", footerIndustries:"Отрасли", footerFaq:"FAQ",
    footerAbout:"О нас", footerContact:"Контакты", footerCareers:"Карьера", footerBlog:"Блог",
    footerPrivacy:"Политика конф.", footerTerms:"Условия использ.", footerSecurity:"Безопасность",
    footerRights:"Все права защищены.",
    modBadge:"Полная платформа", modTitle:"Все модули в одном месте",
    modSub:"От продаж до склада, от аналитики до отчётов — всё под вашим управлением",
  },
};

const contactLinks = [
  {
    label: "Telefon",
    value: "+994 51 571 56 59",
    href: "tel:+994515715659",
    color: "bg-[#4F46E5]/15 text-[#818CF8]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.51 5.51l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
      />
    ),
  },
  {
    label: "WhatsApp",
    value: "+994 51 571 56 59",
    href: "https://wa.me/994515715659",
    color: "bg-[#10B981]/15 text-[#34D399]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.42-4.03 8-9 8a9.86 9.86 0 01-4.26-.95L3 20l1.32-3.95A7.58 7.58 0 013 12c0-4.42 4.03-8 9-8s9 3.58 9 8z"
      />
    ),
  },
  {
    label: "Instagram",
    value: "@merixerp",
    href: "https://www.instagram.com/merixerp",
    color: "bg-[#EC4899]/15 text-[#F472B6]",
    icon: (
      <>
        <rect width="16" height="16" x="4" y="4" rx="5" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11.37A3 3 0 1112.63 9 3 3 0 0115 11.37zM17.5 6.5h.01" />
      </>
    ),
  },
  {
    label: "Email",
    value: "merixerp@gmail.com",
    href: "mailto:merixerp@gmail.com",
    color: "bg-[#F59E0B]/15 text-[#FBBF24]",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#10B981] mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

type DemoForm = { name: string; company: string; phone: string; email: string; message: string };

export const LandingPage = () => {
  const [lang, setLang] = useState<Lang>("az");
  const tr = TR[lang];
  const [createDemoRequest] = useCreateDemoRequestMutation();

  const industries = [
    { icon:"🏪", title:tr.ind1Title, desc:tr.ind1Desc, features:[tr.ind1F1,tr.ind1F2,tr.ind1F3] },
    { icon:"🏬", title:tr.ind2Title, desc:tr.ind2Desc, features:[tr.ind2F1,tr.ind2F2,tr.ind2F3] },
    { icon:"👗", title:tr.ind3Title, desc:tr.ind3Desc, features:[tr.ind3F1,tr.ind3F2,tr.ind3F3] },
    { icon:"🏗️", title:tr.ind4Title, desc:tr.ind4Desc, features:[tr.ind4F1,tr.ind4F2,tr.ind4F3] },
    { icon:"☕", title:tr.ind5Title, desc:tr.ind5Desc, features:[tr.ind5F1,tr.ind5F2,tr.ind5F3] },
    { icon:"💊", title:tr.ind6Title, desc:tr.ind6Desc, features:[tr.ind6F1,tr.ind6F2,tr.ind6F3] },
  ];

  const faqs = [
    { q:tr.faq1Q, a:tr.faq1A }, { q:tr.faq2Q, a:tr.faq2A },
    { q:tr.faq3Q, a:tr.faq3A }, { q:tr.faq4Q, a:tr.faq4A },
    { q:tr.faq5Q, a:tr.faq5A }, { q:tr.faq6Q, a:tr.faq6A },
    { q:tr.faq7Q, a:tr.faq7A }, { q:tr.faq8Q, a:tr.faq8A },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState("pos");
  const [demoForm, setDemoForm] = useState<DemoForm>({ name: "", company: "", phone: "", email: "", message: "" });
  const [demoState, setDemoState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [demoError, setDemoError] = useState("");

  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialForm, setTrialForm] = useState<DemoForm>({ name: "", company: "", phone: "", email: "", message: "" });
  const [trialState, setTrialState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [trialError, setTrialError] = useState("");

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialForm.name) { setTrialError(tr.errRequired); return; }
    if (!trialForm.phone && !trialForm.email) { setTrialError(tr.errContact); return; }
    setTrialError("");
    setTrialState("loading");
    try {
      await createDemoRequest(trialForm).unwrap();
      setTrialState("success");
    } catch {
      setTrialState("error");
      setTrialError(tr.errSend);
    }
  };

  const closeTrialModal = () => {
    setShowTrialModal(false);
    setTrialState("idle");
    setTrialError("");
    setTrialForm({ name: "", company: "", phone: "", email: "", message: "" });
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name) { setDemoError(tr.errRequired); return; }
    if (!demoForm.phone && !demoForm.email) { setDemoError(tr.errContact); return; }
    setDemoError("");
    setDemoState("loading");
    try {
      await createDemoRequest(demoForm).unwrap();
      setDemoState("success");
    } catch {
      setDemoState("error");
      setDemoError(tr.errSend);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14]">
      <style>{`
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-50px) scale(1.12); }
          66%      { transform: translate(-30px,30px) scale(0.9); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-50px,25px) scale(1.08); }
          70%     { transform: translate(35px,-20px) scale(0.93); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(25px,40px) scale(1.1); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulseRing {
          0%   { transform:scale(1); opacity:.8; }
          100% { transform:scale(2.4); opacity:0; }
        }
        @keyframes floatA {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-12px); }
        }
        @keyframes floatB {
          0%,100% { transform:translateY(-6px); }
          50%     { transform:translateY(6px); }
        }
        @keyframes floatC {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-9px); }
        }
        @keyframes gridFade {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes btnGlow {
          0%,100% { box-shadow: 0 0 20px 0px rgba(79,70,229,0.5); }
          50%     { box-shadow: 0 0 35px 6px rgba(79,70,229,0.7); }
        }
        .hero-shimmer {
          background: linear-gradient(90deg,
            #a78bfa 0%, #818cf8 20%, #fff 40%, #818cf8 60%, #a78bfa 80%, #c4b5fd 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 4s linear infinite;
        }
        .btn-glow { animation: btnGlow 2.5s ease-in-out infinite; }
        @keyframes slideInCart {
          from { opacity:0; transform:translateX(14px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes scanBeam {
          0%   { top:6px;  opacity:1; }
          80%  { top:calc(100% - 6px); opacity:0.7; }
          100% { top:calc(100% - 6px); opacity:0; }
        }
        @keyframes scanGlow {
          0%,100% { border-color:rgba(16,185,129,0.5); box-shadow:0 0 0 0 rgba(16,185,129,0); }
          50%     { border-color:rgba(16,185,129,0.9); box-shadow:0 0 14px 3px rgba(16,185,129,0.3); }
        }
        @keyframes notifPop {
          from { opacity:0; transform:translateY(-10px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes mockupFloat {
          0%,100% { transform:translateY(0px) rotate(0.5deg); }
          50%     { transform:translateY(-10px) rotate(0.5deg); }
        }
        @keyframes tabFade {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes barGrow {
          from { transform:scaleY(0); }
          to   { transform:scaleY(1); }
        }
      `}</style>

      {/* Free Trial Modal */}
      {showTrialModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeTrialModal(); }}
        >
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={closeTrialModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-white/50 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {trialState === "success" ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-[#10B981]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{tr.successTitle}</h3>
                <p className="text-white/55 mb-6">{tr.successSub}</p>
                <button
                  onClick={closeTrialModal}
                  className="bg-[#4F46E5] text-white px-6 py-2.5 rounded-xl hover:bg-[#4338CA] transition font-medium text-sm"
                >
                  {tr.btnClose}
                </button>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="p-8 space-y-5">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-white">{tr.modalTitle}</h2>
                  <p className="text-sm text-white/45 mt-1">{tr.modalSub}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/65 mb-1.5">
                      {tr.fldName} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={trialForm.name}
                      onChange={(e) => setTrialForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Əli Həsənov"
                      className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldCompany}</label>
                    <input
                      type="text"
                      value={trialForm.company}
                      onChange={(e) => setTrialForm((f) => ({ ...f, company: e.target.value }))}
                      placeholder="ABC Mağaza"
                      className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldPhone}</label>
                    <input
                      type="tel"
                      value={trialForm.phone}
                      onChange={(e) => setTrialForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+994 50 000 00 00"
                      className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldEmail}</label>
                    <input
                      type="email"
                      value={trialForm.email}
                      onChange={(e) => setTrialForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="ali@example.com"
                      className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldMsg}</label>
                  <textarea
                    rows={3}
                    value={trialForm.message}
                    onChange={(e) => setTrialForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder={tr.fldMsgPh}
                    className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition resize-none placeholder:text-white/30"
                  />
                </div>
                {trialError && (
                  <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">{trialError}</p>
                )}
                <button
                  type="submit"
                  disabled={trialState === "loading"}
                  className="w-full bg-[#4F46E5] text-white py-3.5 rounded-xl hover:bg-[#4338CA] transition font-semibold text-sm disabled:opacity-60"
                >
                  {trialState === "loading" ? tr.btnSending : tr.btnSend}
                </button>
                <p className="text-xs text-center text-white/40">{tr.formFooter}</p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#060A12]/95 backdrop-blur-sm border-b border-white/6 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <LogoName className="h-6 w-auto" />
            <div className="hidden md:flex items-center space-x-6">
              {([
                ["#features", tr.navFeatures],
                ["#benefits", tr.navBenefits],
                ["#industries", tr.navIndustries],
                ["#pricing", tr.navPricing],
                ["#faq", tr.navFaq],
                ["#demo", tr.navDemo],
                ["#contact", tr.navContact],
              ] as [string,string][]).map(([href, label]) => (
                <a key={href} href={href} className="text-white/55 hover:text-white transition text-sm">
                  {label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-white/5 border border-white/8 rounded-lg p-0.5">
                {(["az","en","ru"] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase transition-all duration-150 ${
                      lang === l ? "bg-[#4F46E5] text-white shadow" : "text-white/45 hover:text-white/75"
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
              <Link
                to="/login"
                className="hidden sm:block bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition font-medium text-xs"
              >
                {tr.navLogin}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/8 transition"
              >
                <span className={`block h-0.5 w-5 bg-white/70 transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 w-5 bg-white/70 transition-all duration-200 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 w-5 bg-white/70 transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>
        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#060A12] border-t border-white/6 px-4 py-4 space-y-1">
            {([
              ["#features", tr.navFeatures],
              ["#benefits", tr.navBenefits],
              ["#industries", tr.navIndustries],
              ["#pricing", tr.navPricing],
              ["#faq", tr.navFaq],
              ["#demo", tr.navDemo],
              ["#contact", tr.navContact],
            ] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-white/65 hover:text-white hover:bg-white/5 rounded-lg transition">
                {label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/8">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-[#4F46E5] text-white text-center px-4 py-2.5 rounded-lg hover:bg-[#4338CA] transition font-medium text-sm">
                {tr.navLogin}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-14 md:pt-32 md:pb-28 overflow-hidden bg-[#080B14]">

        {/* Animated colour orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ animation:"orb1 14s ease-in-out infinite" }}
               className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full bg-[#4F46E5]/25 blur-[120px]" />
          <div style={{ animation:"orb2 18s ease-in-out infinite" }}
               className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/20 blur-[110px]" />
          <div style={{ animation:"orb3 22s ease-in-out infinite" }}
               className="absolute -bottom-16 left-1/3 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/15 blur-[100px]" />
        </div>

        {/* Dot-grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"36px 36px", animation:"gridFade 1.2s ease forwards" }} />

        {/* Radial vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,#080B14_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

            {/* ── LEFT: text ── */}
            <div className="text-center lg:text-left mb-14 lg:mb-0">

              {/* Live badge */}
              <div style={{ animation:"fadeUp .55s ease forwards" }}
                   className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-white/75 mb-8 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span style={{ animation:"pulseRing 1.6s ease-out infinite" }}
                        className="absolute inline-flex h-full w-full rounded-full bg-[#10B981]" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                </span>
                {tr.heroBadge}
              </div>

              {/* Headline */}
              <h1 style={{ animation:"fadeUp .55s .1s ease both" }}
                  className="text-3xl sm:text-5xl md:text-[68px] font-extrabold leading-[1.06] tracking-tight mb-4 md:mb-6 text-white">
                {tr.heroH1a}<br />
                <span className="hero-shimmer">{tr.heroH1b}</span>
              </h1>

              {/* Sub */}
              <p style={{ animation:"fadeUp .55s .22s ease both" }}
                 className="text-sm md:text-lg text-white/55 mb-7 md:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {tr.heroSub}
              </p>

              {/* CTAs */}
              <div style={{ animation:"fadeUp .55s .34s ease both" }}
                   className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-7">
                <button
                  onClick={() => setShowTrialModal(true)}
                  className="btn-glow group relative w-full sm:w-auto bg-[#4F46E5] text-white px-9 py-4 rounded-2xl font-semibold text-base transition-all duration-200 hover:bg-[#4338CA] hover:scale-105 active:scale-100 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {tr.heroCtaPrimary}
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#4F46E5]" />
                </button>
                <a href="https://wa.me/994515715659" target="_blank" rel="noopener noreferrer"
                   className="group w-full sm:w-auto flex items-center justify-center gap-2.5 border border-white/15 text-white/80 px-9 py-4 rounded-2xl font-semibold text-base backdrop-blur-sm hover:bg-white/8 hover:border-white/30 hover:text-white transition-all duration-200 hover:scale-105 active:scale-100">
                  <svg className="w-5 h-5 text-[#10B981]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Trust */}
              <p style={{ animation:"fadeUp .55s .44s ease both" }}
                 className="text-white/30 text-xs md:text-sm mb-6 md:mb-10">
                {tr.heroTrust}
              </p>

              {/* Stat cards row */}
              <div style={{ animation:"fadeUp .55s .56s ease both" }}
                   className="grid grid-cols-3 gap-3">
                {[
                  { value:"500+",  label:tr.statBiz, color:"text-[#818CF8]", anim:"floatA 4s ease-in-out infinite" },
                  { value:"1M+",   label:tr.statOps, color:"text-[#34D399]", anim:"floatB 5s ease-in-out infinite" },
                  { value:"99.9%", label:tr.statUp,  color:"text-[#F472B6]", anim:"floatC 6s ease-in-out infinite" },
                ].map((s) => (
                  <div key={s.label} style={{ animation:s.anim }}
                       className="bg-white/4 border border-white/8 rounded-xl px-3 py-4 text-center backdrop-blur-sm">
                    <div className={`text-xl font-bold ${s.color} mb-0.5`}>{s.value}</div>
                    <div className="text-[10px] text-white/40 font-medium leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: POS mockup ── */}
            <div className="relative hidden lg:block" style={{ animation:"mockupFloat 6s ease-in-out infinite, fadeUp .55s .3s ease both" }}>

              {/* Payment success toast */}
              <div style={{ animation:"notifPop .5s .8s ease both", opacity:0 }}
                   className="absolute -top-5 right-2 z-20 flex items-center gap-2.5 bg-[#0F3D2E] border border-[#10B981]/30 rounded-xl px-4 py-2.5 shadow-lg shadow-black/30">
                <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#10B981] text-xs font-semibold">Ödəniş qəbul edildi</p>
                  <p className="text-white/50 text-[10px]">Sifariş #0041 · ₼12.40</p>
                </div>
              </div>

              {/* App window frame */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#4F46E5]/15 bg-[#0B1120]">

                {/* macOS window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#060A12] border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                  <div className="flex-1 mx-6 bg-[#0B1120] rounded-md px-3 py-1 text-center">
                    <span className="text-white/25 text-[11px]">MerixERP POS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span style={{ animation:"pulseRing 2s ease-out infinite" }}
                            className="absolute inline-flex h-full w-full rounded-full bg-[#10B981]" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                    </span>
                    <span className="text-[#10B981] text-[10px] font-medium">Aktiv</span>
                  </div>
                </div>

                {/* App header bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-semibold">Yeni Sifariş</span>
                    <span className="bg-[#4F46E5]/20 text-[#818CF8] text-[10px] font-medium px-2 py-0.5 rounded-full">#0042</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 text-xs">Kassir: Əli</span>
                    <div className="w-6 h-6 rounded-full bg-[#4F46E5]/40 flex items-center justify-center text-[10px] text-white font-medium">Ə</div>
                  </div>
                </div>

                {/* Main POS area */}
                <div className="flex" style={{ height:"340px" }}>

                  {/* Left: product grid */}
                  <div className="flex-1 p-3 border-r border-white/5 flex flex-col min-w-0">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-[#1E293B] rounded-lg px-3 py-2 mb-3">
                      <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                      <span className="text-white/25 text-xs">Axtar və ya barkod skan et...</span>
                    </div>
                    {/* Product grid 2×3 */}
                    <div className="grid grid-cols-2 gap-2 overflow-hidden flex-1">
                      {[
                        { emoji:"🥛", name:"Süd 1L",    price:"₼1.50", bg:"bg-blue-500/15",   scan:true  },
                        { emoji:"🍞", name:"Çörək",     price:"₼0.80", bg:"bg-yellow-500/15", scan:false },
                        { emoji:"🥚", name:"Yumurta",   price:"₼2.40", bg:"bg-orange-500/15", scan:false },
                        { emoji:"🧀", name:"Pendir",    price:"₼3.20", bg:"bg-amber-500/15",  scan:false },
                        { emoji:"💧", name:"Su 0.5L",   price:"₼0.50", bg:"bg-cyan-500/15",   scan:false },
                        { emoji:"🥩", name:"Kolbasa",   price:"₼4.80", bg:"bg-red-500/15",    scan:false },
                      ].map((p) => (
                        <div key={p.name}
                             style={p.scan ? { animation:"scanGlow 2s ease-in-out infinite", border:"1px solid rgba(16,185,129,0.5)" } : { border:"1px solid rgba(255,255,255,0.06)" }}
                             className="relative rounded-xl p-2.5 cursor-pointer hover:border-white/20 transition-all duration-150 overflow-hidden">
                          {/* scan beam */}
                          {p.scan && (
                            <div style={{ animation:"scanBeam 1.8s ease-in-out infinite", position:"absolute", left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,rgba(16,185,129,0.8),transparent)" }} />
                          )}
                          <div className={`w-8 h-8 ${p.bg} rounded-lg flex items-center justify-center text-lg mb-2`}>
                            {p.emoji}
                          </div>
                          <p className="text-white text-[11px] font-medium leading-tight">{p.name}</p>
                          <p className="text-[#818CF8] text-[11px] font-semibold mt-0.5">{p.price}</p>
                          {p.scan && (
                            <div className="absolute top-1.5 right-1.5 bg-[#10B981] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: cart */}
                  <div className="w-44 shrink-0 flex flex-col bg-[#060A12]">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-white/40 text-[10px] uppercase tracking-wider font-medium">Səbət</p>
                    </div>
                    {/* Cart items */}
                    <div className="flex-1 p-3 space-y-2 overflow-hidden">
                      {[
                        { emoji:"🥛", name:"Süd 1L",  qty:"×2", total:"₼3.00", delay:"0.7s" },
                        { emoji:"🥚", name:"Yumurta", qty:"×1", total:"₼2.40", delay:"1.1s" },
                        { emoji:"🧀", name:"Pendir",  qty:"×1", total:"₼3.20", delay:"1.5s" },
                      ].map((item) => (
                        <div key={item.name}
                             style={{ animation:`slideInCart .4s ${item.delay} ease both`, opacity:0 }}
                             className="flex items-center gap-2 bg-[#0F172A] rounded-lg p-2">
                          <span className="text-base shrink-0">{item.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-[11px] font-medium truncate">{item.name}</p>
                            <p className="text-white/35 text-[10px]">{item.qty}</p>
                          </div>
                          <span className="text-[#818CF8] text-[11px] font-semibold shrink-0">{item.total}</span>
                        </div>
                      ))}
                    </div>
                    {/* Total + pay */}
                    <div className="p-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/50 text-xs">Cəmi</span>
                        <span className="text-white font-bold text-sm">₼8.60</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button className="bg-[#1E293B] text-white/60 rounded-lg py-2 text-[11px] font-medium hover:bg-[#293548] transition">Nağd</button>
                        <button className="bg-[#4F46E5] text-white rounded-lg py-2 text-[11px] font-semibold hover:bg-[#4338CA] transition">Kart</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today revenue floating card */}
              <div style={{ animation:"floatB 5s ease-in-out infinite, notifPop .5s 1.1s ease both", opacity:0 }}
                   className="absolute -bottom-5 -left-5 z-20 flex items-center gap-3 bg-[#0F172A]/90 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-md shadow-xl shadow-black/30">
                <div className="w-8 h-8 rounded-xl bg-[#4F46E5]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-[9px] uppercase tracking-wider">Bu gün</p>
                  <p className="text-white font-bold text-sm">₼1,247.80</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── Modules Showcase ── */}
      <section id="modules" className="py-12 md:py-24 bg-[#080B14] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize:"32px 32px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-6 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-white/60 mb-4">
              <svg className="w-3 h-3 text-[#818CF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              {tr.modBadge}
            </div>
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-2">{tr.modTitle}</h2>
            <p className="text-white/45 text-sm md:text-lg max-w-2xl mx-auto">{tr.modSub}</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:flex-wrap md:overflow-visible md:pb-0">
            {[
              { id:"pos",        label:"POS / Satış",     icon:"M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 21h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { id:"inventory",  label:"Anbar",           icon:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { id:"analytics",  label:"Analitika",       icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { id:"suppliers",  label:"Təchizatçılar",   icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { id:"staff",      label:"Əməkdaşlar",      icon:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
              { id:"reports",    label:"Hesabatlar",      icon:"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            ].map((m) => (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                  activeModule === m.id
                    ? "bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/30"
                    : "bg-white/5 text-white/55 border border-white/8 hover:bg-white/10 hover:text-white/80"
                }`}>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={m.icon}/>
                </svg>
                {m.label}
              </button>
            ))}
          </div>

          {/* App window */}
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#060A12] border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"/><div className="w-3 h-3 rounded-full bg-[#FEBC2E]"/><div className="w-3 h-3 rounded-full bg-[#28C840]"/>
              <div className="flex-1 mx-4 bg-[#0B1120] rounded-md px-3 py-1 text-center"><span className="text-white/25 text-[11px]">MerixERP — {["pos","inventory","analytics","suppliers","staff","reports"].includes(activeModule) ? { pos:"Satış nöqtəsi", inventory:"Anbar idarəetməsi", analytics:"Analitika paneli", suppliers:"Təchizatçılar", staff:"Əməkdaşlar", reports:"Hesabatlar" }[activeModule] : ""}</span></div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2"><span style={{ animation:"pulseRing 2s ease-out infinite" }} className="absolute inline-flex h-full w-full rounded-full bg-[#10B981]"/><span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]"/></span>
                <span className="text-[#10B981] text-[10px] font-medium">Aktiv</span>
              </div>
            </div>

            {/* Tab content */}
            <div key={activeModule} style={{ animation:"tabFade .3s ease forwards" }} className="bg-[#0B1120]">

              {/* ── POS ── */}
              {activeModule === "pos" && (
                <div className="flex flex-col md:flex-row md:h-[460px]">
                  {/* Products */}
                  <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
                    {/* Category filter — scrollable on mobile */}
                    <div className="p-2.5 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
                      {["Hamısı","İçkilər","Çörək","Süd","Et","Meyvə"].map((c,i) => (
                        <button key={c} className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${i===0?"bg-[#4F46E5] text-white":"bg-white/5 text-white/40 hover:text-white/70"}`}>{c}</button>
                      ))}
                      <div className="shrink-0 ml-auto flex items-center gap-1.5 bg-[#1E293B] rounded-lg px-2.5 py-1">
                        <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        <span className="text-white/25 text-xs">Axtar...</span>
                      </div>
                    </div>
                    {/* Product grid — 3 cols on mobile, 4 on desktop */}
                    <div className="p-2.5 grid grid-cols-3 md:grid-cols-4 gap-2 content-start overflow-y-auto" style={{ maxHeight:"240px" }}>
                      {[
                        { e:"🥛",n:"Süd 1L",    p:"₼1.50",bg:"bg-blue-500/15",  hot:true  },
                        { e:"🍞",n:"Çörək",     p:"₼0.80",bg:"bg-yellow-500/15",hot:false },
                        { e:"🥚",n:"Yumurta",   p:"₼2.40",bg:"bg-orange-500/15",hot:false },
                        { e:"🧀",n:"Pendir",    p:"₼3.20",bg:"bg-amber-500/15", hot:false },
                        { e:"💧",n:"Su 0.5L",   p:"₼0.50",bg:"bg-cyan-500/15",  hot:false },
                        { e:"🥩",n:"Kolbasa",   p:"₼4.80",bg:"bg-red-500/15",   hot:false },
                        { e:"🍫",n:"Şokolad",   p:"₼1.20",bg:"bg-pink-500/15",  hot:true  },
                        { e:"🧃",n:"Şirə 1L",   p:"₼1.80",bg:"bg-green-500/15", hot:false },
                        { e:"☕",n:"Qəhvə",     p:"₼2.90",bg:"bg-stone-500/15", hot:false },
                        { e:"🥗",n:"Kəsmik",    p:"₼1.60",bg:"bg-teal-500/15",  hot:false },
                        { e:"🍳",n:"Yağ 0.5L",  p:"₼3.90",bg:"bg-lime-500/15",  hot:false },
                        { e:"🧂",n:"Duz 1kq",   p:"₼0.60",bg:"bg-slate-500/15", hot:false },
                      ].map((p) => (
                        <div key={p.n} className="relative bg-[#0F172A] border border-white/6 rounded-xl p-2 cursor-pointer hover:border-[#4F46E5]/50 transition-all duration-150">
                          {p.hot && <div className="absolute top-1 right-1 bg-[#EF4444] text-white text-[7px] font-bold px-1 py-0.5 rounded-full">HOT</div>}
                          <div className={`w-8 h-8 ${p.bg} rounded-lg flex items-center justify-center text-lg mb-1.5`}>{p.e}</div>
                          <p className="text-white text-[10px] font-medium leading-tight truncate">{p.n}</p>
                          <p className="text-[#818CF8] text-[10px] font-bold mt-0.5">{p.p}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Cart — full panel on desktop, compact strip on mobile */}
                  <div className="md:w-52 md:shrink-0 flex flex-col bg-[#060A12]">
                    <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                      <span className="text-white text-xs font-semibold">Sifariş #0042</span>
                      <span className="text-white/30 text-[10px]">4 məhsul</span>
                    </div>
                    {/* Cart items — hidden on mobile to save space, shown on md+ */}
                    <div className="hidden md:block flex-1 p-3 space-y-1.5 overflow-y-auto">
                      {[
                        { e:"🥛",n:"Süd 1L",  q:2,p:"₼3.00" },
                        { e:"🥚",n:"Yumurta", q:1,p:"₼2.40" },
                        { e:"🧀",n:"Pendir",  q:1,p:"₼3.20" },
                        { e:"🍫",n:"Şokolad", q:3,p:"₼3.60" },
                      ].map((it) => (
                        <div key={it.n} className="flex items-center gap-2 bg-[#0F172A] rounded-lg p-2">
                          <span className="text-sm shrink-0">{it.e}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-[10px] font-medium truncate">{it.n}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <button className="w-4 h-4 rounded bg-white/5 text-white/40 text-[10px] flex items-center justify-center">-</button>
                              <span className="text-white/50 text-[10px] w-3 text-center">{it.q}</span>
                              <button className="w-4 h-4 rounded bg-white/5 text-white/40 text-[10px] flex items-center justify-center">+</button>
                            </div>
                          </div>
                          <span className="text-[#818CF8] text-[10px] font-semibold shrink-0">{it.p}</span>
                        </div>
                      ))}
                    </div>
                    {/* Mobile: compact cart items list */}
                    <div className="md:hidden p-2.5 flex gap-2 overflow-x-auto">
                      {[
                        { e:"🥛",n:"Süd×2",p:"₼3.00" },
                        { e:"🥚",n:"Yum×1",p:"₼2.40" },
                        { e:"🧀",n:"Pend×1",p:"₼3.20" },
                        { e:"🍫",n:"Şok×3",p:"₼3.60" },
                      ].map((it) => (
                        <div key={it.n} className="shrink-0 bg-[#0F172A] rounded-lg px-2.5 py-2 flex items-center gap-1.5">
                          <span className="text-sm">{it.e}</span>
                          <div>
                            <p className="text-white text-[10px] font-medium">{it.n}</p>
                            <p className="text-[#818CF8] text-[10px] font-bold">{it.p}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Total + pay */}
                    <div className="p-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-semibold">Cəmi</span>
                        <span className="text-white font-bold">₼12.20</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button className="bg-[#1E293B] text-white/60 rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1">💵 Nağd</button>
                        <button className="bg-[#4F46E5] text-white rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1">💳 Kart</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── INVENTORY ── */}
              {activeModule === "inventory" && (
                <div className="p-3 md:p-5">
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-[#1E293B] rounded-xl px-3 py-2 flex-1 min-w-0">
                      <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      <span className="text-white/25 text-xs truncate">Məhsul axtar...</span>
                    </div>
                    <button className="shrink-0 flex items-center gap-1.5 bg-[#4F46E5] text-white text-xs px-3 py-2 rounded-xl">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                      Yeni
                    </button>
                  </div>
                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[
                      { v:"148",  l:"Cəmi məhsul",   c:"text-white" },
                      { v:"12",   l:"Az ehtiyat",     c:"text-[#FBBF24]" },
                      { v:"3",    l:"Vaxtı keçmiş",   c:"text-[#EF4444]" },
                      { v:"₼42k", l:"Anbar dəyəri",   c:"text-[#34D399]" },
                    ].map((s) => (
                      <div key={s.l} className="bg-[#0F172A] rounded-xl px-4 py-3 border border-white/5">
                        <p className={`text-xl font-bold ${s.c} mb-0.5`}>{s.v}</p>
                        <p className="text-white/40 text-xs">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  {/* Table */}
                  <div className="rounded-xl overflow-hidden border border-white/8 overflow-x-auto">
                    <table className="w-full text-xs min-w-[500px]">
                      <thead><tr className="bg-[#0F172A] border-b border-white/5">
                        {["Məhsul","Kateqoriya","Ehtiyat","Min","Partiya","Son tarix","Status"].map(h => <th key={h} className="text-left px-3 py-2 text-white/40 font-medium whitespace-nowrap">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[
                          { n:"Süd 1L",       c:"İçkilər",   s:245, m:50,  b:"P-241",expiry:"15.12.2024",st:"ok" },
                          { n:"Çörək",        c:"Çörək",     s:18,  m:20,  b:"P-242",expiry:"30.11.2024",st:"low" },
                          { n:"Yumurta ×10",  c:"Süd m.",    s:89,  m:30,  b:"P-240",expiry:"05.01.2025",st:"ok" },
                          { n:"Pendir 200q",  c:"Süd m.",    s:12,  m:15,  b:"P-239",expiry:"28.11.2024",st:"low" },
                          { n:"Kolbasa 200q", c:"Et",        s:4,   m:10,  b:"P-238",expiry:"22.11.2024",st:"critical" },
                          { n:"Su 0.5L",      c:"İçkilər",   s:520, m:100, b:"P-243",expiry:"01.06.2025",st:"ok" },
                          { n:"Yağ 1L",       c:"Yağlar",    s:0,   m:15,  b:"P-237",expiry:"10.11.2024",st:"critical" },
                        ].map((r) => (
                          <tr key={r.n} className={`border-b border-white/5 hover:bg-white/3 transition ${r.st==="critical"?"bg-red-500/5":r.st==="low"?"bg-yellow-500/4":""}`}>
                            <td className="px-3 py-2.5 text-white font-medium">{r.n}</td>
                            <td className="px-3 py-2.5 text-white/50">{r.c}</td>
                            <td className={`px-3 py-2.5 font-semibold ${r.s===0?"text-[#EF4444]":r.s<r.m?"text-[#FBBF24]":"text-white"}`}>{r.s}</td>
                            <td className="px-3 py-2.5 text-white/40">{r.m}</td>
                            <td className="px-3 py-2.5 text-white/40 font-mono text-[10px]">{r.b}</td>
                            <td className="px-3 py-2.5 text-white/40">{r.expiry}</td>
                            <td className="px-3 py-2.5">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.st==="ok"?"bg-green-500/15 text-green-400":r.st==="low"?"bg-yellow-500/15 text-yellow-400":"bg-red-500/15 text-red-400"}`}>
                                {r.st==="ok"?"Yaxşı":r.st==="low"?"Az ehtiyat":"Kritik"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── ANALYTICS ── */}
              {activeModule === "analytics" && (
                <div className="p-3 md:p-5">
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div>
                      <h3 className="text-white text-sm font-semibold">Analitika paneli</h3>
                      <p className="text-white/40 text-xs">Son yenilənmə: bu gün 14:32</p>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {["Bu gün","Bu həftə","Bu ay","3 ay"].map((p,i) => (
                        <button key={p} className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${i===2?"bg-[#4F46E5] text-white":"bg-[#1E293B] text-white/40 hover:text-white/70"}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  {/* KPI cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[
                      { v:"₼8,420",l:"Gəlir",      d:"+12%",up:true,  c:"text-white" },
                      { v:"₼2,105",l:"Mənfəət",    d:"+8%", up:true,  c:"text-[#34D399]" },
                      { v:"147",   l:"Satış sayı", d:"-3%", up:false, c:"text-white" },
                      { v:"₼57.3", l:"Orta çek",   d:"+5%", up:true,  c:"text-[#818CF8]" },
                    ].map((k) => (
                      <div key={k.l} className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                        <p className="text-white/40 text-xs mb-1">{k.l}</p>
                        <p className={`text-xl font-bold ${k.c}`}>{k.v}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${k.up?"text-[#34D399]":"text-[#EF4444]"}`}>
                          {k.up?"↑":"↓"} {k.d}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col md:grid md:grid-cols-[1fr_220px] gap-3">
                    {/* Bar chart */}
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
                      <p className="text-white/50 text-xs font-medium mb-4">Son 7 gün gəliri</p>
                      <div className="flex items-end gap-3 h-28">
                        {[
                          { d:"B.e",v:65,  a:"₼980"  },
                          { d:"Ç.a",v:80,  a:"₼1,120"},
                          { d:"Ç",  v:55,  a:"₼890"  },
                          { d:"C.a",v:95,  a:"₼1,340"},
                          { d:"C",  v:100, a:"₼1,580"},
                          { d:"Ş",  v:85,  a:"₼1,890"},
                          { d:"B",  v:42,  a:"₼620"  },
                        ].map((b,i) => (
                          <div key={b.d} className="flex-1 flex flex-col items-center gap-1 group">
                            <span className="text-white/0 group-hover:text-white/60 text-[9px] transition whitespace-nowrap">{b.a}</span>
                            <div className="w-full relative" style={{ height:`${b.v}%` }}>
                              <div style={{ animation:`barGrow .6s ${i*0.08}s ease both`, transformOrigin:"bottom" }}
                                   className={`w-full h-full rounded-t-md ${i===5?"bg-[#4F46E5]":"bg-[#4F46E5]/40"} hover:bg-[#4F46E5] transition-colors duration-150 cursor-pointer`} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 px-0.5">
                        {["B.e","Ç.a","Ç","C.a","C","Ş","B"].map(d => <span key={d} className="text-[10px] text-white/30">{d}</span>)}
                      </div>
                    </div>
                    {/* Right panel */}
                    <div className="flex flex-col md:flex-col gap-3">
                      <div className="bg-[#0F172A] rounded-xl p-3 border border-white/5 flex-1">
                        <p className="text-white/50 text-xs font-medium mb-3">Top məhsullar</p>
                        {[
                          { n:"Süd 1L",    pct:78, v:"₼1,240",c:"bg-[#4F46E5]" },
                          { n:"Yumurta",   pct:61, v:"₼980",  c:"bg-[#7C3AED]" },
                          { n:"Çörək",     pct:45, v:"₼720",  c:"bg-[#EC4899]" },
                          { n:"Su 0.5L",   pct:38, v:"₼610",  c:"bg-[#06B6D4]" },
                          { n:"Kolbasa",   pct:29, v:"₼465",  c:"bg-[#10B981]" },
                        ].map((p) => (
                          <div key={p.n} className="mb-2.5 last:mb-0">
                            <div className="flex justify-between mb-1">
                              <span className="text-white/70 text-[11px]">{p.n}</span>
                              <span className="text-white/50 text-[11px]">{p.v}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div style={{ width:`${p.pct}%`, animation:`barGrow .5s ease both`, transformOrigin:"left" }} className={`h-full ${p.c} rounded-full`}/>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-[#0F172A] rounded-xl p-4 border border-white/5">
                        <p className="text-white/50 text-xs font-medium mb-3">Ödəniş növü</p>
                        {[
                          { l:"Nağd",   v:"58%", c:"bg-[#4F46E5]" },
                          { l:"Kart",   v:"34%", c:"bg-[#7C3AED]" },
                          { l:"Kredit", v:"8%",  c:"bg-[#06B6D4]" },
                        ].map((p) => (
                          <div key={p.l} className="flex items-center gap-2 mb-2 last:mb-0">
                            <div className={`w-2.5 h-2.5 rounded-full ${p.c} shrink-0`}/>
                            <span className="text-white/60 text-xs flex-1">{p.l}</span>
                            <span className="text-white text-xs font-medium">{p.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── SUPPLIERS ── */}
              {activeModule === "suppliers" && (
                <div className="p-3 md:p-5">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 bg-[#1E293B] rounded-xl px-3 py-2 flex-1 min-w-0">
                      <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      <span className="text-white/25 text-xs truncate">Axtar...</span>
                    </div>
                    <button className="shrink-0 flex items-center gap-1.5 bg-[#4F46E5] text-white text-xs px-3 py-2 rounded-xl">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                      Yeni
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { v:"8",     l:"Aktiv təchizatçı", c:"text-white" },
                      { v:"₼4,230",l:"Ümumi borc",       c:"text-[#FBBF24]" },
                      { v:"₼18,5k",l:"Bu ay alınış",     c:"text-[#34D399]" },
                    ].map((s) => (
                      <div key={s.l} className="bg-[#0F172A] rounded-xl px-4 py-3 border border-white/5">
                        <p className={`text-2xl font-bold ${s.c} mb-0.5`}>{s.v}</p>
                        <p className="text-white/40 text-xs">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/8 overflow-x-auto">
                    <table className="w-full text-xs min-w-[460px]">
                      <thead><tr className="bg-[#0F172A] border-b border-white/5">
                        {["Şirkət","Əlaqə","Bu ay","Borc","Son sifariş","Status"].map(h => <th key={h} className="text-left px-3 py-2 text-white/40 font-medium whitespace-nowrap">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[
                          { n:"Arzu MMC",         t:"+994 51 234 56 78",p:"₼5,400",b:"₼2,400",d:"3 gün əvvəl",st:"active" },
                          { n:"Fresh Food LLC",   t:"+994 55 876 54 32",p:"₼3,200",b:"₼0",    d:"Bu gün",     st:"active" },
                          { n:"Qida İdxal ASC",   t:"+994 70 123 45 67",p:"₼2,800",b:"₼1,830",d:"8 gün əvvəl",st:"overdue"},
                          { n:"Bakı Distribüter", t:"+994 12 493 22 11",p:"₼4,100",b:"₼0",    d:"Dünən",      st:"active" },
                          { n:"AgroSupply",       t:"+994 55 312 78 90",p:"₼3,000",b:"₼0",    d:"5 gün əvvəl",st:"active" },
                        ].map((r) => (
                          <tr key={r.n} className={`border-b border-white/5 hover:bg-white/3 transition ${r.st==="overdue"?"bg-red-500/4":""}`}>
                            <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-[#4F46E5]/20 flex items-center justify-center text-[11px] text-[#818CF8] font-bold">{r.n[0]}</div><span className="text-white font-medium">{r.n}</span></div></td>
                            <td className="px-4 py-3 text-white/45 font-mono text-[11px]">{r.t}</td>
                            <td className="px-4 py-3 text-[#34D399] font-medium">{r.p}</td>
                            <td className={`px-4 py-3 font-semibold ${r.b==="₼0"?"text-white/40":"text-[#FBBF24]"}`}>{r.b}</td>
                            <td className="px-4 py-3 text-white/40">{r.d}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.st==="active"?"bg-green-500/15 text-green-400":"bg-red-500/15 text-red-400"}`}>
                                {r.st==="active"?"Aktiv":"Gecikmiş"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── STAFF ── */}
              {activeModule === "staff" && (
                <div className="p-3 md:p-5">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex gap-2">
                      {[
                        { v:"6",l:"Cəmi", c:"text-white" },
                        { v:"4",l:"Aktiv", c:"text-[#34D399]" },
                        { v:"2",l:"Oflayn", c:"text-white/40" },
                      ].map((s) => (
                        <div key={s.l} className="bg-[#0F172A] rounded-xl px-3 py-2 border border-white/5 text-center">
                          <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                          <p className="text-white/40 text-[10px]">{s.l}</p>
                        </div>
                      ))}
                    </div>
                    <button className="shrink-0 flex items-center gap-1.5 bg-[#4F46E5] text-white text-xs px-3 py-2 rounded-xl">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                      Yeni
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
                    {[
                      { n:"Əli Həsənov",    r:"Admin",    online:true,  last:"İndi aktiv",       perm:["Satış","Anbar","Hesabat","Parametr"],  init:"ƏH", g:"from-[#4F46E5] to-[#7C3AED]" },
                      { n:"Aytən Quliyeva", r:"Kassir",   online:true,  last:"İndi aktiv",       perm:["Satış"],                               init:"AQ", g:"from-[#EC4899] to-[#F43F5E]" },
                      { n:"Rauf Əliyev",    r:"Kassir",   online:false, last:"2 saat əvvəl",     perm:["Satış"],                               init:"RƏ", g:"from-[#10B981] to-[#06B6D4]" },
                      { n:"Nigar Babayeva", r:"Anbardar", online:true,  last:"İndi aktiv",       perm:["Anbar","Hesabat"],                     init:"NB", g:"from-[#F59E0B] to-[#EF4444]" },
                      { n:"Kamran Nəsirov", r:"Kassir",   online:true,  last:"İndi aktiv",       perm:["Satış"],                               init:"KN", g:"from-[#8B5CF6] to-[#6366F1]" },
                      { n:"Leyla Məmmədova",r:"Mühasib",  online:false, last:"Dünən 18:30",      perm:["Hesabat","Maliyyə"],                   init:"LM", g:"from-[#06B6D4] to-[#3B82F6]" },
                    ].map((s) => (
                      <div key={s.n} className="bg-[#0F172A] rounded-xl p-4 border border-white/5 hover:border-white/15 transition">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.g} flex items-center justify-center text-white font-bold text-sm shrink-0`}>{s.init}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium truncate">{s.n}</p>
                              <span className={`w-2 h-2 rounded-full shrink-0 ${s.online?"bg-[#10B981]":"bg-white/20"}`}/>
                            </div>
                            <p className="text-white/40 text-xs">{s.last}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2 ${s.r==="Admin"?"bg-[#4F46E5]/20 text-[#818CF8]":s.r==="Kassir"?"bg-[#10B981]/15 text-[#34D399]":s.r==="Anbardar"?"bg-[#F59E0B]/15 text-[#FBBF24]":"bg-[#EC4899]/15 text-[#F472B6]"}`}>{s.r}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.perm.map(p => <span key={p} className="bg-white/5 text-white/40 text-[9px] px-1.5 py-0.5 rounded-md">{p}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── REPORTS ── */}
              {activeModule === "reports" && (
                <div className="p-3 md:p-5">
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {["Bu gün","Bu həftə","Bu ay","3 ay","İl","Xüsusi"].map((p,i) => (
                        <button key={p} className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${i===2?"bg-[#4F46E5] text-white":"bg-[#1E293B] text-white/40 hover:text-white/70"}`}>{p}</button>
                      ))}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button className="flex items-center gap-1.5 bg-[#1E293B] border border-white/8 text-white/60 text-xs px-3 py-1.5 rounded-xl">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                        Excel
                      </button>
                      <button className="flex items-center gap-1.5 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs px-3 py-1.5 rounded-xl">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        PDF
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {[
                      { v:"₼8,420", l:"Gəlir",    d:"+12%", c:"text-white",     up:true  },
                      { v:"₼2,105", l:"Mənfəət",  d:"+8%",  c:"text-[#34D399]", up:true  },
                      { v:"147",    l:"Satış",     d:"-3%",  c:"text-white",     up:false },
                      { v:"₼6,315", l:"Xərc",     d:"+4%",  c:"text-[#F472B6]", up:false },
                    ].map((k) => (
                      <div key={k.l} className="bg-[#0F172A] rounded-xl p-3 border border-white/5">
                        <p className="text-white/40 text-xs mb-1">{k.l}</p>
                        <p className={`text-xl font-bold ${k.c}`}>{k.v}</p>
                        <span className={`text-[10px] ${k.up?"text-[#34D399]":"text-[#EF4444]"}`}>{k.up?"↑":"↓"} {k.d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/8 overflow-x-auto">
                    <table className="w-full text-xs min-w-[400px]">
                      <thead><tr className="bg-[#0F172A] border-b border-white/5">
                        {["Tarix","Satış","Gəlir","Xərc","Mənfəət","Margin"].map(h => <th key={h} className="text-left px-3 py-2 text-white/40 font-medium whitespace-nowrap">{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[
                          { d:"01.11.2024",s:18,r:"₼980",  x:"₼720", p:"₼260", m:"26.5%" },
                          { d:"02.11.2024",s:24,r:"₼1,240",x:"₼890", p:"₼350", m:"28.2%" },
                          { d:"03.11.2024",s:15,r:"₼820",  x:"₼610", p:"₼210", m:"25.6%" },
                          { d:"04.11.2024",s:31,r:"₼1,580",x:"₼1,120",p:"₼460",m:"29.1%" },
                          { d:"05.11.2024",s:28,r:"₼1,340",x:"₼980", p:"₼360", m:"26.9%" },
                          { d:"06.11.2024",s:20,r:"₼1,020",x:"₼760", p:"₼260", m:"25.5%" },
                          { d:"07.11.2024",s:11,r:"₼440",  x:"₼335", p:"₼105", m:"23.9%" },
                        ].map((r) => (
                          <tr key={r.d} className="border-b border-white/5 hover:bg-white/3 transition">
                            <td className="px-4 py-2.5 text-white/60 font-mono">{r.d}</td>
                            <td className="px-4 py-2.5 text-white">{r.s}</td>
                            <td className="px-4 py-2.5 text-[#34D399] font-medium">{r.r}</td>
                            <td className="px-4 py-2.5 text-white/50">{r.x}</td>
                            <td className="px-4 py-2.5 text-[#818CF8] font-semibold">{r.p}</td>
                            <td className="px-4 py-2.5"><span className="bg-[#4F46E5]/15 text-[#818CF8] px-2 py-0.5 rounded-full font-semibold">{r.m}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-12 md:py-20 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.probTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.probSub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title:tr.prob1Title, desc:tr.prob1Desc, icon:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title:tr.prob2Title, desc:tr.prob2Desc, icon:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title:tr.prob3Title, desc:tr.prob3Desc, icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((p) => (
              <div key={p.title} className="bg-red-500/8 rounded-2xl p-8 border border-red-500/20">
                <div className="w-12 h-12 bg-red-500/15 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-12 md:py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.solTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.solSub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { color: "bg-[#4F46E5]", title: tr.sol1Title, desc: tr.sol1Desc, icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 21h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { color: "bg-[#7C3AED]", title: tr.sol2Title, desc: tr.sol2Desc, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { color: "bg-[#EC4899]", title: tr.sol3Title, desc: tr.sol3Desc, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { color: "bg-[#10B981]", title: tr.sol4Title, desc: tr.sol4Desc, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            ].map((s) => (
              <div key={s.title} className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-white/45 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.featTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.featSub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { bg: "bg-[#4F46E5]/15", iconColor: "text-[#818CF8]", title: tr.feat1Title, desc: tr.feat1Desc, icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" },
              { bg: "bg-[#7C3AED]/15", iconColor: "text-[#A78BFA]", title: tr.feat2Title, desc: tr.feat2Desc, icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
              { bg: "bg-[#EC4899]/15", iconColor: "text-[#F472B6]", title: tr.feat3Title, desc: tr.feat3Desc, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { bg: "bg-[#10B981]/15", iconColor: "text-[#34D399]", title: tr.feat4Title, desc: tr.feat4Desc, icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { bg: "bg-[#F59E0B]/15", iconColor: "text-[#FBBF24]", title: tr.feat5Title, desc: tr.feat5Desc, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { bg: "bg-[#3B82F6]/15", iconColor: "text-[#60A5FA]", title: tr.feat6Title, desc: tr.feat6Desc, icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            ].map((f) => (
              <div key={f.title} className="bg-[#0F172A] rounded-2xl p-8 border border-white/8 hover:border-white/15 hover:shadow-lg hover:shadow-black/30 transition">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${f.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-12 md:py-20 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.benTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.benSub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "40%", color: "text-[#818CF8]", label: tr.ben1Label, desc: tr.ben1Desc },
              { value: "25%", color: "text-[#A78BFA]", label: tr.ben2Label, desc: tr.ben2Desc },
              { value: "90%", color: "text-[#F472B6]", label: tr.ben3Label, desc: tr.ben3Desc },
              { value: "15", color: "text-[#34D399]", label: tr.ben4Label, desc: tr.ben4Desc },
            ].map((b) => (
              <div key={b.label} className="text-center">
                <div className={`text-5xl font-bold ${b.color} mb-2`}>{b.value}</div>
                <p className="text-white/70 font-medium mb-2">{b.label}</p>
                <p className="text-white/40 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-12 md:py-20 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.indTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.indSub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 cursor-pointer transition ${
                  activeIndustry === index
                    ? "border-[#4F46E5] bg-[#4F46E5]/10"
                    : "border-white/8 bg-[#0F172A] hover:border-[#4F46E5]/50"
                }`}
                onClick={() => setActiveIndustry(activeIndustry === index ? null : index)}
              >
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{industry.title}</h3>
                <p className="text-white/50 mb-4">{industry.desc}</p>
                <ul className="space-y-2 text-sm text-white/50">
                  {industry.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-4 h-4 text-[#818CF8] mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.howTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.howSub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 1, title: tr.how1Title, desc: tr.how1Desc },
              { n: 2, title: tr.how2Title, desc: tr.how2Desc },
              { n: 3, title: tr.how3Title, desc: tr.how3Desc },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-16 h-16 bg-[#4F46E5] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {s.n}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-white/50">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowTrialModal(true)}
              className="inline-flex items-center bg-[#4F46E5] text-white px-8 py-4 rounded-xl hover:bg-[#4338CA] transition font-semibold text-lg shadow-lg shadow-[#4F46E5]/30"
            >
              {tr.howCta}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.testTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.testSub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { initials: "AY", gradient: "from-[#4F46E5] to-[#7C3AED]", name: tr.test1Name, role: tr.test1Role, text: tr.test1Text },
              { initials: "RK", gradient: "from-[#10B981] to-[#3B82F6]", name: tr.test2Name, role: tr.test2Role, text: tr.test2Text },
              { initials: "FM", gradient: "from-[#EC4899] to-[#F59E0B]", name: tr.test3Name, role: tr.test3Role, text: tr.test3Text },
            ].map((t) => (
              <div key={t.name} className="bg-[#0F172A] rounded-2xl p-8 border border-white/8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} />)}
                </div>
                <p className="text-white/65 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${t.gradient} rounded-full flex items-center justify-center text-white font-semibold mr-4`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-white/40 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {[
              { val: "500+", label: tr.statBizFull },
              { val: "1M+", label: tr.statOpsMonth },
              { val: "99.9%", label: tr.statUptime },
              { val: "24/7", label: tr.statSupport },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-white">{s.val}</div>
                <div className="text-white/40 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 md:py-20 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.priceTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.priceSub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-[#0F172A] rounded-2xl p-8 border border-white/8">
              <h3 className="text-xl font-semibold text-white mb-2">{tr.plan1Name}</h3>
              <p className="text-white/40 mb-6">{tr.plan1Sub}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₼49</span>
                <span className="text-white/40">{tr.perMonth}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[tr.plan1F1, tr.plan1F2, tr.plan1F3, tr.plan1F4].map((i) => (
                  <li key={i} className="flex items-center text-white/65"><CheckIcon />{i}</li>
                ))}
              </ul>
              <button onClick={() => setShowTrialModal(true)} className="block w-full bg-[#4F46E5]/15 text-[#818CF8] text-center py-3 rounded-xl hover:bg-[#4F46E5]/25 transition font-semibold">
                {tr.planCta1}
              </button>
            </div>
            {/* Professional */}
            <div className="bg-[#0F172A] rounded-2xl p-8 border-2 border-[#4F46E5] relative shadow-lg shadow-[#4F46E5]/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#4F46E5] text-white px-4 py-1 rounded-full text-sm font-medium">
                {tr.plan2Popular}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{tr.plan2Name}</h3>
              <p className="text-white/40 mb-6">{tr.plan2Sub}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₼99</span>
                <span className="text-white/40">{tr.perMonth}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[tr.plan2F1, tr.plan2F2, tr.plan2F3, tr.plan2F4, tr.plan2F5].map((i) => (
                  <li key={i} className="flex items-center text-white/80"><CheckIcon />{i}</li>
                ))}
              </ul>
              <button onClick={() => setShowTrialModal(true)} className="block w-full bg-[#4F46E5] text-white text-center py-3 rounded-xl hover:bg-[#4338CA] transition font-semibold">
                {tr.planCta1}
              </button>
            </div>
            {/* Enterprise */}
            <div className="bg-[#0F172A] rounded-2xl p-8 border border-white/8">
              <h3 className="text-xl font-semibold text-white mb-2">{tr.plan3Name}</h3>
              <p className="text-white/40 mb-6">{tr.plan3Sub}</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₼199</span>
                <span className="text-white/40">{tr.perMonth}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[tr.plan3F1, tr.plan3F2, tr.plan3F3, tr.plan3F4, tr.plan3F5].map((i) => (
                  <li key={i} className="flex items-center text-white/65"><CheckIcon />{i}</li>
                ))}
              </ul>
              <a href="#contact" className="block w-full bg-[#4F46E5]/15 text-[#818CF8] text-center py-3 rounded-xl hover:bg-[#4F46E5]/25 transition font-semibold">
                {tr.planCta3}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 md:py-20 bg-[#080B14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.faqTitle}</h2>
            <p className="text-xl text-white/50">{tr.faqSub}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/8 rounded-xl overflow-hidden bg-[#0F172A]">
                <button
                  className="w-full px-6 py-4 text-left hover:bg-white/3 transition flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-white/40 transform transition shrink-0 ml-4 ${openFaq === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-white/50 border-t border-white/5 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request */}
      <section id="demo" className="py-12 md:py-20 bg-[#0B1120]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.demoTitle}</h2>
            <p className="text-xl text-white/50">{tr.demoSub}</p>
          </div>

          {demoState === "success" ? (
            <div className="bg-[#0F172A] rounded-2xl p-10 border border-white/8 text-center">
              <div className="w-16 h-16 bg-[#10B981]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{tr.successTitle}</h3>
              <p className="text-white/50">{tr.demoSuccessSub}</p>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="bg-[#0F172A] rounded-2xl p-8 border border-white/8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/65 mb-1.5">
                    {tr.fldName} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={demoForm.name}
                    onChange={(e) => setDemoForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Əli Həsənov"
                    className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldCompany}</label>
                  <input
                    type="text"
                    value={demoForm.company}
                    onChange={(e) => setDemoForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="ABC Mağaza"
                    className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldPhone}</label>
                  <input
                    type="tel"
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+994 50 000 00 00"
                    className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldEmail}</label>
                  <input
                    type="email"
                    value={demoForm.email}
                    onChange={(e) => setDemoForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="ali@example.com"
                    className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition placeholder:text-white/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/65 mb-1.5">{tr.fldMsg}</label>
                <textarea
                  rows={3}
                  value={demoForm.message}
                  onChange={(e) => setDemoForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder={tr.fldMsgPh}
                  className="w-full bg-[#1E293B] border border-white/15 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition resize-none placeholder:text-white/30"
                />
              </div>
              {demoError && (
                <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">{demoError}</p>
              )}
              <button
                type="submit"
                disabled={demoState === "loading"}
                className="w-full bg-[#4F46E5] text-white py-3.5 rounded-xl hover:bg-[#4338CA] transition font-semibold text-sm disabled:opacity-60"
              >
                {demoState === "loading" ? tr.btnSending : tr.demoBtn}
              </button>
              <p className="text-xs text-center text-white/40">{tr.formFooter}</p>
            </form>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 md:py-20 bg-[#080B14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">{tr.contactTitle}</h2>
            <p className="text-sm md:text-xl text-white/50 max-w-3xl mx-auto">{tr.contactSub}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactLinks.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group bg-[#0F172A] rounded-2xl p-6 border border-white/8 hover:-translate-y-1 hover:border-white/15 hover:shadow-lg hover:shadow-black/30 transition"
              >
                <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center mb-5`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {contact.icon}
                  </svg>
                </div>
                <div className="text-sm font-medium text-white/40 mb-2">{contact.label}</div>
                <div className="text-lg font-semibold text-white break-words group-hover:text-[#818CF8] transition">
                  {contact.value}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-4">{tr.ctaTitle}</h2>
          <p className="text-sm md:text-xl text-indigo-100 mb-7 md:mb-10 max-w-2xl mx-auto">{tr.ctaSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => setShowTrialModal(true)}
              className="w-full sm:w-auto bg-white text-[#4F46E5] px-8 py-4 rounded-xl hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
            >
              {tr.ctaBtn1}
            </button>
            <a
              href="#contact"
              className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-xl hover:bg-white/10 transition font-semibold text-lg border-2 border-white/30"
            >
              {tr.ctaBtn2}
            </a>
          </div>
          <p className="text-indigo-200 text-sm">{tr.ctaTrust}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-bold text-white block mb-3">Merix</span>
              <p className="text-gray-400 text-xs md:text-sm">{tr.footerDesc}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{tr.footerProduct}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {([["#features", tr.footerFeatures], ["#pricing", tr.footerPricing], ["#industries", tr.footerIndustries], ["#faq", tr.footerFaq]] as [string,string][]).map(([href, label]) => (
                  <li key={href}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{tr.footerCompany}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {([["#", tr.footerAbout], ["#contact", tr.footerContact], ["#", tr.footerCareers], ["#", tr.footerBlog]] as [string,string][]).map(([href, label]) => (
                  <li key={href}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{tr.footerLegal}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {([["#", tr.footerPrivacy], ["#", tr.footerTerms], ["#", tr.footerSecurity]] as [string,string][]).map(([href, label]) => (
                  <li key={href}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1E293B] mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
            © {new Date().getFullYear()} Merix. {tr.footerRights}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
