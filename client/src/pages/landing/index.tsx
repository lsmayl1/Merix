import React, { useState } from "react";
import { Link } from "react-router-dom";

const LogoName = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 213 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M58 49.8438V9.0625L41.0207 22.9638V22.8326L16.829 0H0V58L16.829 43.3032V21.914L29.3005 33.0679L41.0207 22.8326V22.9638V49.8438H58Z"
      fill="black"
    />
    <path
      d="M72.788 50V41.938H93.262V50H72.788ZM72.788 17.462V9.4H93.262V17.462H72.788ZM72.788 32.6V24.712H92.102V32.6H72.788ZM66.292 9.4H75.688V50H66.292V9.4ZM111.389 31.614H121.539L134.241 50H122.757L111.389 31.614ZM101.239 9.4H111.041V50H101.239V9.4ZM107.387 17.694V9.4H116.029C119.509 9.4 122.409 9.96066 124.729 11.082C127.049 12.2033 128.809 13.7693 130.007 15.78C131.206 17.752 131.805 20.0527 131.805 22.682C131.805 25.2727 131.206 27.5733 130.007 29.584C128.809 31.556 127.049 33.1027 124.729 34.224C122.409 35.3453 119.509 35.906 116.029 35.906H107.387V28.308H115.333C116.648 28.308 117.769 28.1147 118.697 27.728C119.664 27.3027 120.399 26.7033 120.901 25.93C121.404 25.118 121.655 24.1513 121.655 23.03C121.655 21.9087 121.404 20.9613 120.901 20.188C120.399 19.376 119.664 18.7573 118.697 18.332C117.769 17.9067 116.648 17.694 115.333 17.694H107.387ZM138.792 9.4H148.768V50H138.792V9.4ZM179.642 9.4H191.764L179.004 29.178L192.634 50H180.512L173.088 36.486L165.432 50H153.31L167.23 29.178L154.76 9.4H166.882L173.146 21.174L179.642 9.4Z"
      fill="black"
    />
  </svg>
);

const industries = [
  {
    icon: "🏪",
    title: "Baqqal və supermarketlər",
    desc: "Çəki barkod, partiya izləməsi, yüksək satış.",
    features: ["EAN-13 çəki əsaslı məhsul dəstəyi", "Son istifadə tarixi izləməsi", "Yüksək sürətli barkod skanirləmə"],
  },
  {
    icon: "🏬",
    title: "Əlverişli mağazalar",
    desc: "Min SKU, tez axtarış, çoxlu səbət.",
    features: ["Tez məhsul axtarışı", "Məşğul dövrlər üçün çoxlu səbət", "Kassir növbəsi izləməsi"],
  },
  {
    icon: "👗",
    title: "Moda və geyim",
    desc: "Ölçü, rəng, mövsüm izləməsi. Trend analitika.",
    features: ["Variant idarəetməsi", "Mövsümi kateqoriya təşkili", "Ən çox satılan analitikası"],
  },
  {
    icon: "🏗️",
    title: "Tikinti materialları",
    desc: "Həcmli ehtiyat, qarışıq vahid, təchizatçı borc.",
    features: ["Qarışıq vahid növləri (kq/ədəd)", "Təchizatçı borc izləməsi", "Kütləvi anbar tənziləmələri"],
  },
  {
    icon: "☕",
    title: "Kafelər və tez xidmət",
    desc: "Sifariş emalı, maddə izləməsi, növbə hesabatları.",
    features: ["Tez sifariş emalı", "Maddə ehtiyatı izləməsi", "Kassir növbəsi hesabatları"],
  },
  {
    icon: "💊",
    title: "Aptek və sağlamlıq",
    desc: "Partiya/seriya, son istifadə tarixi, audit izləri.",
    features: ["Partiya/seriya izləməsi", "Son istifadə tarixi xəbərdarlıqları", "Tam audit tarixçəsi"],
  },
];

const faqs = [
  { q: "Quraşdırma nə qədər vaxt aparır?", a: "30 dəqiqə. Excel ilə tez idxal edilir." },
  { q: "Merix-i oflayn istifadə edə bilərəm?", a: "Bəli! Oflayn mod dəstəklənir. Məlumatlar vahid sinxronlaşır." },
  { q: "Xüsusi avadanlıq lazımdır?", a: "Standart barkod skaneri, çek printeri, pul qutusu. USB, Bluetooth dəstəyi." },
  { q: "Plan limitlərini keçsəm nə olar?", a: "Xəbərdar olursunuz. Həmişə keçə bilərsiniz. Əlavə haqq yoxdur." },
  { q: "Məlumatlarım təhlükəsizdir?", a: "256-bit şifrləmə. Gündəlik ehtiyat. Rol əsaslı icazələr." },
  { q: "Məlumatlarımı ixrac edə bilərəm?", a: "Bəli! Excel, PDF ilə ixrac. Tam məlumat tələb əsasında." },
  { q: "Kömək lazımdırsa nə olar?", a: "24/7 çat, email, telefon dəstəyi. Sənədləşmə, videolar." },
  { q: "Müqavilə var?", a: "Yox. Aylıq, istənilən vaxt ləğv. İllik 2 ay pulsuz." },
];

const contactLinks = [
  {
    label: "Telefon",
    value: "+994 51 571 56 59",
    href: "tel:+994515715659",
    color: "bg-[#EEF2FF] text-[#4F46E5]",
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
    color: "bg-[#D1FAE5] text-[#059669]",
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
    color: "bg-[#FCE7F3] text-[#DB2777]",
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
    color: "bg-[#FEF3C7] text-[#D97706]",
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

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <LogoName className="h-8 w-auto" />
            <div className="hidden md:flex items-center space-x-8">
              {[
                ["#features", "Xüsusiyyətlər"],
                ["#benefits", "Faydalar"],
                ["#industries", "Sənaye"],
                ["#pricing", "Qiymət"],
                ["#faq", "Suallar"],
                ["#contact", "Əlaqə"],
              ].map(([href, label]) => (
                <a key={href} href={href} className="text-gray-600 hover:text-gray-900 transition text-sm">
                  {label}
                </a>
              ))}
            </div>
            <Link
              to="/login"
              className="bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg hover:bg-[#4338CA] transition font-medium text-sm"
            >
              Daxil ol
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#EEF2FF] via-white to-[#F5F3FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-[#EEF2FF] text-[#4F46E5] rounded-full text-sm font-medium mb-6">
            500+ biznes etibar edir
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Biznesinizi{" "}
            <span className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              Nəzarət
            </span>{" "}
            edin
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Tam ERP/POS sistemi. Sürətli ödənişlər, real vaxt anbar izləməsi. Lazım olan hər şey bir platformada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-[#4F46E5] text-white px-8 py-4 rounded-xl hover:bg-[#4338CA] transition font-semibold text-lg shadow-lg shadow-[#4F46E5]/20"
            >
              Pulsuz sınaq başla
            </Link>
            <a
              href="https://wa.me/994515715659"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#10B981] text-white px-8 py-4 rounded-xl hover:bg-[#059669] transition font-semibold text-lg shadow-lg shadow-[#10B981]/20"
            >
              WhatsApp
            </a>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 text-sm text-gray-500">
            <a href="tel:+994515715659" className="hover:text-[#4F46E5] transition">
              Telefon: +994 51 571 56 59
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="mailto:merixerp@gmail.com" className="hover:text-[#4F46E5] transition">
              merixerp@gmail.com
            </a>
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            Kredit kartı tələb olunmur · 14 günlük pulsuz sınaq · Dəqiqələrdə quraşdırın
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pərakəndə biznes çətindir</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hər gün eyni problemlərə çıxılır</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Anbar xaosu",
                desc: "Çatışmazlıq, həddən artıq ehtiyat — düzgün izləmə olmadan pul itirirsiniz.",
                icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Kor qərarlar",
                desc: "Real vaxt rejimində mənfəət məlumatları olmadan təxminlərlə qiymət təyin olunur.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Yavaş ödənişlər",
                desc: "Zəif POS sistemləri uzun növbələr və itirilmiş satışlar yaradır.",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
            ].map((p) => (
              <div key={p.title} className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Bir platforma</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">Əməliyyatlarınızın hər aspektini birləşdirir</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { color: "bg-[#4F46E5]", title: "Sürətli ödəniş", desc: "Barkod skanı, çoxlu səbət, ani çəklər.", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 21h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { color: "bg-[#7C3AED]", title: "Ağıllı anbar", desc: "FIFO partiya, son istifadə tarixi, real vaxt səviyyələri.", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
              { color: "bg-[#EC4899]", title: "Analitika", desc: "Gəlir, mənfəət, top məhsullar, nağd axını panelləri.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              { color: "bg-[#10B981]", title: "Komanda idarəetməsi", desc: "Rol əsaslı giriş, növbə izləməsi, PIN qapısı.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            ].map((s) => (
              <div key={s.title} className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Xüsusiyyətlər</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Güclü funksiyalar, kiçik biznesə uyğunlaşdırılmış</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { bg: "bg-[#EEF2FF]", iconColor: "text-[#4F46E5]", title: "FIFO izləməsi", desc: "First-In-First-Out metodu. Həqiqi mənfəət marjanı dəqiqdir.", icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14" },
              { bg: "bg-[#F5F3FF]", iconColor: "text-[#7C3AED]", title: "Çoxlu ödəniş", desc: "Nağd, kart, kredit. Avtomatik uyğunlaşdırma.", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
              { bg: "bg-[#FCE7F3]", iconColor: "text-[#EC4899]", title: "Barkod və çəki", desc: "Barkod skanı, EAN, avtomatik çəki oxuması.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { bg: "bg-[#D1FAE5]", iconColor: "text-[#10B981]", title: "Real vaxt analitika", desc: "Canlı panellər: gəlir, mənfəət, top məhsullar.", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { bg: "bg-[#FEF3C7]", iconColor: "text-[#F59E0B]", title: "Təchizatçı idarəetməsi", desc: "Təchizatçılar, faturalar, borc izləməsi.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { bg: "bg-[#DBEAFE]", iconColor: "text-[#3B82F6]", title: "Təhlükəsizlik", desc: "Rol əsaslı icazələr, şifrlənmə, audit izləri.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-6 h-6 ${f.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Faydalar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Müştəri faydaları</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "40%", color: "text-[#4F46E5]", label: "+40% sürət", desc: "Növbə vaxtları azalır" },
              { value: "25%", color: "text-[#7C3AED]", label: "+25% mənfəət", desc: "Dəqiq FIFO" },
              { value: "90%", color: "text-[#EC4899]", label: "-90% səhv", desc: "Dəqiq izləmə" },
              { value: "15 saat", color: "text-[#10B981]", label: "15 saat/həftə", desc: "Avtomatik hesabatlar" },
            ].map((b) => (
              <div key={b.label} className="text-center">
                <div className={`text-5xl font-bold ${b.color} mb-2`}>{b.value}</div>
                <p className="text-gray-700 font-medium mb-2">{b.label}</p>
                <p className="text-gray-500 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sənaye</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Kiçik mağazalardan çoxfiliallı şəbəkələrə qədər</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 cursor-pointer transition ${
                  activeIndustry === index
                    ? "border-[#4F46E5] bg-[#EEF2FF]"
                    : "border-gray-200 bg-white hover:border-[#4F46E5]/50"
                }`}
                onClick={() => setActiveIndustry(activeIndustry === index ? null : index)}
              >
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{industry.title}</h3>
                <p className="text-gray-600 mb-4">{industry.desc}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {industry.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-4 h-4 text-[#4F46E5] mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Addımlar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Dəqiqələrdə işə salılırsınız</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 1, title: "Hesabınızı qurun", desc: "2 dəqiqədə." },
              { n: 2, title: "Məhsullarınızı idxal edin", desc: "Excel vasitəsilə." },
              { n: 3, title: "Satmağa başlayın", desc: "Heç vaxt gözləməyin." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-16 h-16 bg-[#4F46E5] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {s.n}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/login"
              className="inline-flex items-center bg-[#4F46E5] text-white px-8 py-4 rounded-xl hover:bg-[#4338CA] transition font-semibold text-lg shadow-lg shadow-[#4F46E5]/20"
            >
              Pulsuz sınaq başla
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Rəylər</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Müştəri rəylərindən</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                initials: "AY",
                gradient: "from-[#4F46E5] to-[#7C3AED]",
                name: "Aysel Y.",
                role: "Baqqal sahibi, Bakı",
                text: "FIFO izləməsi bizə vaxtı bitmiş məhsullardan xilas etdi. Hər gecə saatlar çəkən sayım indi 10 dəqiqə oldu.",
              },
              {
                initials: "RK",
                gradient: "from-[#10B981] to-[#3B82F6]",
                name: "Rəşad K.",
                role: "Çoxfiliallı sahibi, Gəncə",
                text: "3 mağaza idarə edirəm və Merix hamısını sinxron saxlayır. Telefondan istənilən yerdən satışları yoxlaya biliram.",
              },
              {
                initials: "FM",
                gradient: "from-[#EC4899] to-[#F59E0B]",
                name: "Fərid M.",
                role: "Supermarket meneceri, Sumqayıt",
                text: "Hər gün 200+ müştəriyə xidmət edirik. Sistem heç vaxt yavaşlamır. Mağazam üçün ən yaxşı investisiya.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-[#F8FAFC] rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${t.gradient} rounded-full flex items-center justify-center text-white font-semibold mr-4`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {[
              { val: "500+", label: "Aktiv bizneslər" },
              { val: "1M+", label: "Aylıq əməliyyatlar" },
              { val: "99.9%", label: "İşləmə müddəti SLA" },
              { val: "24/7", label: "Yerli dəstək" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{s.val}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Qiymət</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Biznesə uyğun plan seçin</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Başlanğıc</h3>
              <p className="text-gray-500 mb-6">Kiçik mağazalar üçün ideal</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">₼49</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["1 POS terminal", "1,000 Məhsul", "Əsas hesabatlar", "Email dəstək"].map((i) => (
                  <li key={i} className="flex items-center text-gray-700"><CheckIcon />{i}</li>
                ))}
              </ul>
              <Link to="/login" className="block w-full bg-[#EEF2FF] text-[#4F46E5] text-center py-3 rounded-xl hover:bg-[#E0E7FF] transition font-semibold">
                Pulsuz sınaq başla
              </Link>
            </div>
            {/* Professional */}
            <div className="bg-[#0F172A] rounded-2xl p-8 border-2 border-[#4F46E5] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#4F46E5] text-white px-4 py-1 rounded-full text-sm font-medium">
                Ən populyar
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
              <p className="text-gray-400 mb-6">Böyüyən bizneslər üçün</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">₼99</span>
                <span className="text-gray-400">/ay</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["3 POS terminal", "Limitsiz Məhsul", "Qabaqcıl analitika", "Təchizatçı idarəetməsi", "Prioritet dəstək"].map((i) => (
                  <li key={i} className="flex items-center text-gray-300"><CheckIcon />{i}</li>
                ))}
              </ul>
              <Link to="/login" className="block w-full bg-[#4F46E5] text-white text-center py-3 rounded-xl hover:bg-[#4338CA] transition font-semibold">
                Pulsuz sınaq başla
              </Link>
            </div>
            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Korporativ</h3>
              <p className="text-gray-500 mb-6">Çoxfiliallı şəbəkələr üçün</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">₼199</span>
                <span className="text-gray-500">/ay</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Limitsiz terminallar", "Çoxfiliallı dəstək", "Fərdi inteqrasiyalar", "Həsr olunmuş hesab meneceri", "24/7 telefon dəstək"].map((i) => (
                  <li key={i} className="flex items-center text-gray-700"><CheckIcon />{i}</li>
                ))}
              </ul>
              <a href="#contact" className="block w-full bg-[#EEF2FF] text-[#4F46E5] text-center py-3 rounded-xl hover:bg-[#E0E7FF] transition font-semibold">
                Satış şöbəsi ilə əlaqə
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Suallar</h2>
            <p className="text-xl text-gray-600">Bilməli olduğunuz hər şey</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition ${openFaq === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bizimlə əlaqə</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sualınız var? Komandamız telefon, WhatsApp, Instagram və email vasitəsilə cavab verməyə hazırdır.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactLinks.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center mb-5`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {contact.icon}
                  </svg>
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">{contact.label}</div>
                <div className="text-lg font-semibold text-gray-900 break-words group-hover:text-[#4F46E5] transition">
                  {contact.value}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Hazırsınız?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            500+ pərakəndə satıcı Merix-ə etibar edir. Bu gün başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white text-[#4F46E5] px-8 py-4 rounded-xl hover:bg-gray-100 transition font-semibold text-lg shadow-lg"
            >
              Pulsuz sınaq başla
            </Link>
            <a
              href="#contact"
              className="w-full sm:w-auto bg-transparent text-white px-8 py-4 rounded-xl hover:bg-white/10 transition font-semibold text-lg border-2 border-white/30"
            >
              Bizimlə əlaqə
            </a>
          </div>
          <p className="text-indigo-200 text-sm">
            14 günlük pulsuz sınaq · Kredit kartı tələb olunmur · Dəqiqələrdə quraşdırın · İstənilən vaxt ləğv edin
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="text-xl font-bold text-white block mb-4">Merix</span>
              <p className="text-gray-400 text-sm">ERP/POS sistemi pərakəndə biznes üçün.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Məhsul</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {[["#features", "Xüsusiyyətlər"], ["#pricing", "Qiymət"], ["#industries", "Sənaye"], ["#faq", "Suallar"]].map(([href, label]) => (
                  <li key={label}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Şirkət</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {[["#", "Haqqımızda"], ["#contact", "Əlaqə"], ["#", "Karyera"], ["#", "Blog"]].map(([href, label]) => (
                  <li key={label}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hüquqi</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {[["#", "Məxfilik Siyasəti"], ["#", "Xidmət Şərtləri"], ["#", "Təhlükəsizlik"]].map(([href, label]) => (
                  <li key={label}><a href={href} className="hover:text-white transition">{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1E293B] mt-12 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Merix. Bütün hüquqlar qorunur.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
