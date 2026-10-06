import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Course, PaymentMethod } from '../types';
import { useAuth } from '../context/AuthContext';
import { MERCHANT_PHONE, createEnrollment } from '../lib/supabase';

interface PaymentModalProps {
  course: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Zaad');
  const [studentName, setStudentName] = useState(user?.full_name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!course) return null;

  const copyRecipientNumber = () => {
    navigator.clipboard.writeText('+252 676863923');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getUSSDCode = (method: PaymentMethod, amount: number) => {
    switch (method) {
      case 'Zaad':
        return `*880*0676863923*${amount}#`;
      case 'EVC Plus':
        return `*712*0676863923*${amount}#`;
      case 'Sahal':
        return `*899*0676863923*${amount}#`;
      default:
        return `*712*0676863923*${amount}#`;
    }
  };

  const generateWhatsAppLink = () => {
    const sName = studentName.trim() || 'Arday';
    const sEmail = studentEmail.trim() || 'email-ma-sheegin';
    const sPhone = senderNumber.trim() || 'Lama sheegin';
    const sTxId = transactionId.trim() || 'Ma jiro';

    const messageText = 
`Asc Admin, Waxaan lacag bixin u sameeyay koorsada: ${course.title} ($${course.price})
Magaca: ${sName}
Email: ${sEmail}
Habka: ${paymentMethod}
Numberka: ${sPhone}
Tixraaca: ${sTxId}`;

    const cleanNumber = MERCHANT_PHONE.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
  };

  const handleSubmitEnrollment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!studentName.trim()) {
      setErrorMsg('Fadlan geli magacaaga oo buuxa.');
      return;
    }
    if (!studentEmail.trim()) {
      setErrorMsg('Fadlan geli email-kaaga.');
      return;
    }
    if (!senderNumber.trim()) {
      setErrorMsg('Fadlan geli number-ka aad lacagta ka soo dirtay.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createEnrollment({
        user_id: user?.id,
        course_id: course.id,
        student_name: studentName.trim(),
        student_email: studentEmail.trim(),
        course_title: course.title,
        amount: course.price,
        payment_method: paymentMethod,
        sender_number: senderNumber.trim(),
        transaction_id: transactionId.trim() || undefined
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore confetti
      }

      setSubmitted(true);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Khalad ayaa dhacay marka la diiwaangelinayay dalabka. Fadlan isku day markale.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[95vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white font-heading">
                Dalabkaaga Waa La Diiwaangeliyay! 🎉
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Mahadsanid, <strong>{studentName}</strong>. Dalabkaaga koorsada <strong>"{course.title}"</strong> waxaa loo diray xafiiska maamulka.
              </p>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-emerald-500/30 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Koorsada:</span>
                <span className="text-white font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Qiimaha:</span>
                <span className="text-emerald-400 font-bold">${course.price} USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Habka & Number-ka:</span>
                <span className="text-white font-medium">{paymentMethod} ({senderNumber})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Xaaladda:</span>
                <span className="text-amber-400 font-semibold">Sugaya Xaqiijin (Pending)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-400">
                Si koorsadaada laguugu furo dhowr daqiiqo gudahood, fadlan xaqiiji lacag-bixintaada adoo toos ula hadlaya Admin-ka:
              </p>

              {/* Action Button 2: WhatsApp Link */}
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-xl shadow-[#25D366]/25 transition-all transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Xaqiiji Lacagta WhatsApp-ka</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              >
                Ku Noqo Bogga / Eeg Koorsooyinkayga
              </button>
            </div>
          </div>
        ) : (
          /* FORM / PAYMENT INSTRUCTIONS */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Lacag Bixin Toos ah & Amni ah</span>
              </div>
              <h2 className="text-2xl font-black text-white font-heading">
                Is-qoritaanka Koorsada
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Koorsada: <strong className="text-slate-200">{course.title}</strong>
              </p>
            </div>

            {/* Merchant Payment Details Box */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Number-ka Qaataha (Recipient):</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Lacag-bixinta Rasmiga ah
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg sm:text-xl font-mono font-bold tracking-wider text-white">
                    +252 676863923
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyRecipientNumber}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>La koobiyay!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Koobiyeey</span>
                    </>
                  )}
                </button>
              </div>

              {/* Payment Methods selector */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Dooro Habka aad ku bixinayso:</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['Zaad', 'EVC Plus', 'Sahal'] as PaymentMethod[]).map((method) => {
                    const isSelected = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/30'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick USSD Dial Code */}
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Koodhka Diilista:</span>
                <span className="font-mono font-bold text-amber-300">
                  {getUSSDCode(paymentMethod, course.price)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">Wadarta la dirayo:</span>
                <span className="text-lg font-black text-emerald-400 font-heading">
                  ${course.price} USD
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmitEnrollment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Magacaaga oo Buuxa <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Tusaale: Axmed Cali Faarax"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email-kaaga <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="Tusaale: axmed@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Number-ka aad ka dirtay <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="Tusaale: 0612345678"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tixraaca Lacagta (TxID - ikhtiyaari)
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Tusaale: TX98723"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>
              </div>

              {/* Action Buttons: 1 & 2 */}
              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Waa la diiwaangelinayaa...' : 'Diiwaangeli Dalabka'}</span>
                </button>

                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-lg shadow-[#25D366]/20 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Xaqiiji Lacagta WhatsApp-ka</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
