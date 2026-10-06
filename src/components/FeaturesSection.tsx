import React from 'react';
import {
  Video,
  CreditCard,
  MessageCircle,
  Award
} from 'lucide-react';
import { MERCHANT_PHONE } from '../lib/supabase';

export const FeaturesSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Dooro Koorsadaada',
      desc: 'Ka dhex baaro liiska koorsooyinka xirfadaha casriga ah sida Web Development, Graphic Design, iyo Video Editing.'
    },
    {
      num: '02',
      title: 'Ku Bixi Zaad ama EVC Plus',
      desc: `U dir kharashka number-ka ${MERCHANT_PHONE}. Kadibna geli number-kaaga iyo tixraaca si dalabkaaga loo diiwaangeliyo.`
    },
    {
      num: '03',
      title: 'Xaqiiji oo Bilow Waxbarashada',
      desc: 'Admin-ka ayaa daqiiqado gudahood ku xaqiijinaya dalabkaaga, kadibna casharrada ayaa si toos ah kuugu furmaya.'
    }
  ];

  const features = [
    {
      icon: <Video className="w-6 h-6 text-emerald-400" />,
      title: 'Casharro Muuqaal ah oo Tayo Sare Leh',
      desc: 'Muuqaallo Full HD ah oo si fudud oo ficil ah laguugu sharxayo talaabo kasta.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-teal-400" />,
      title: 'Lacag Bixin Maxalli ah (Zaad & EVC)',
      desc: 'Uma baahnid kaarka MasterCard ama Visa; waxaad si fudud ugu bixin kartaa Zaad, EVC Plus, ama Sahal.'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
      title: 'Taageero Toos ah oo WhatsApp ah',
      desc: 'Wada hadal toos ah oo aad su\'aalahaaga iyo caqabadahaaga kula wadaagayso macallinka iyo maamulka.'
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: 'Shahaado Rasmi ah',
      desc: 'Hel shahaado caddeynaysa inaad si guul leh u dhameysatay koorsada oo aad ku dari karto CV-gaaga.'
    }
  ];

  return (
    <div className="py-20 border-t border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HOW IT WORKS SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Sida Ay U Shaqeyso
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 font-heading">
            3 Talaabo oo Fudud Ku Bilaaw
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Wax dhib ah ma laha. Daqiiqado gudahood ku xaqiiji dalabkaaga oo gal fasalkaaga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden group border border-slate-800 hover:border-emerald-500/30"
            >
              <div className="text-4xl font-black text-slate-800 group-hover:text-emerald-500/20 transition-colors font-heading mb-4">
                {st.num}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE US */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Faa'iidooyinka
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 font-heading">
            Maxaa Loo Doortaa Gaadh Xirfad?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            Waxaan diiradda saarnaa tababar ficil ah oo kuu furaya fursado shaqo iyo freelance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
