import React from 'react';
import { MessageCircle, Mail, Phone, Heart, Shield } from 'lucide-react';
import { ADMIN_EMAIL, MERCHANT_PHONE } from '../lib/supabase';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-emerald-500/40 shadow-md">
                <img src="/logo.jpg" alt="Gaadh Xirfad" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white">
                Gaadh Xirfad
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Madasha ugu casrisan ee lagu barto xirfadaha tiknoolajiyadda iyo ganacsiga afka Soomaaliga. Ka gaar heerkii aad hiigsanaysay xirfad dhab ah.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Lacag-bixin Amni ah (Zaad & EVC Plus)</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Qeybaha Koorsooyinka
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 cursor-pointer">Web Development (Full-Stack)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Graphic Design & UI/UX</li>
              <li className="hover:text-emerald-400 cursor-pointer">Video Editing & VFX</li>
              <li className="hover:text-emerald-400 cursor-pointer">Basic Computer & Office</li>
              <li className="hover:text-emerald-400 cursor-pointer">Mobile Apps (Flutter)</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Nala Soo Xiriir
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{MERCHANT_PHONE}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{ADMIN_EMAIL}</span>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${MERCHANT_PHONE.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 text-xs font-semibold hover:bg-[#25D366]/30 transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kala hadal WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Gaadh Xirfad. Dhammaan xuquuqda waa dhowran tahay.</p>
          <p className="flex items-center gap-1">
            <span>Lagu dhisay kalgacal & xirfad</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>ardayda Soomaaliyeed</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
