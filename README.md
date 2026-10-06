# 🎓 Gaadh Xirfad - Online Learning & Course Platform

**Gaadh Xirfad** waa madal casri ah oo loogu talagalay iibinta koorsooyinka iyo barashada xirfadaha dijitaalka ah ee afka Soomaaliga (LMS - Learning Management System).

Platform-ku wuxuu si toos ah u taageeraa lacag-bixinta maxalliga ah ee Soomaaliya sida **Zaad Service (Telesom)**, **EVC Plus (Hormuud)**, iyo **Sahal (Golis)**, isagoo bixiya maamul buuxa (Admin Dashboard) oo loogu talagalay `mohaking918@gmail.com`.

---

## 🚀 Tiknoolajiyadda (Tech Stack)
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (Sleek dark theme, emerald accents, glassmorphism)
- **Icons:** `lucide-react`
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Google OAuth, Row Level Security)
- **Animation & Effects:** `canvas-confetti`
- **Hosting Targets:** Vercel / Netlify / Cloudflare Pages

---

## 🔑 User Roles & Amniga

### 1. Maamulaha (Admin):
- **Email-ka Rasmiga ah:** `mohaking918@gmail.com`
- Marka qofka soo galay uu yahay `mohaking918@gmail.com`, wuxuu si toos ah u helayaa:
  - **Admin Dashboard** oo leh amniga adag (Route Guard).
  - Xisaabinta dakhliga la xaqiijiyay (**Total Verified Revenue** in USD).
  - Dalabaadka sugaya xaqiijinta (**Pending Approval Orders**).
  - Tirada guud ee ardayda (**Total Enrolled Students**).
  - Shaxda dalabaadka oo leh shaandhayn (All, Pending, Approved, Rejected) iyo search.
  - Badhanka **"Xaqiiji" (Approve)** oo isla markiiba ardayga u furaya koorsada.
  - Badhanka **"Diid" (Reject)**.
  - Xiriir toos ah oo WhatsApp ah oo lala yeelan karo arday kasta.
  - Daabacaadda koorsooyin cusub (**Add Course Modal**).

### 2. Ardayda (Students & Public):
- **Hero & Discovery:** Baarista koorsooyinka, shaandhaynta qeybaha (Web Development, Graphic Design, Video Editing, Basic Computer, Mobile Apps).
- **Curriculum & Preview:** Eegista qaybaha manhajka (Syllabus) iyo daawashada muuqaal tusaale ah (Free Preview).
- **Lacag-bixinta Maxalliga ah (Payment Modal):**
  - Number-ka Qaataha: `+252 676863923`
  - Hababka: **Zaad Service**, **EVC Plus**, **Sahal**
  - Koodhadhka tooska ah ee USSD:
    - Zaad: `*880*0676863923*Amount#`
    - EVC Plus: `*712*0676863923*Amount#`
    - Sahal: `*899*0676863923*Amount#`
  - Badhanka 1: **"Diiwaangeli Dalabka"** (Wuxuu dalabka ku keydiyaa database-ka oo status-kiisu yahay `pending`).
  - Badhanka 2: **"Xaqiiji Lacagta WhatsApp-ka"** (Wuxuu furayaa WhatsApp toos ah oo ku socda `+252 676863923` oo wata fariin buuxda):
    ```text
    Asc Admin, Waxaan lacag bixin u sameeyay koorsada: {Course Title} (${Course Price})
    Magaca: {Student Name}
    Email: {Student Email}
    Habka: {Payment Method}
    Numberka: {Sender Phone}
    Tixraaca: {TxID}
    ```
- **Koorsooyinkayga (Student Dashboard):**
  - Muujinta koorsooyinka uu ardaygu dalbaday.
  - Calaamadda `Sugaya Xaqiijin` (Pending Approval).
  - Marka Admin-ku xaqiijiyo, waxay isu beddeshaa `La Xaqiijiyay` (Approved) waxaana furmaya **"Gal Casharrada / Start Learning"** oo leh video player iyo playlist dhamaystiran!

---

## 🗄️ Database Schema & Supabase Setup

Faylka [supabase-schema.sql](file:///d:/Gaadh%20Xirfad%20website/supabase-schema.sql) wuxuu ka kooban yahay SQL-ka rasmiga ah ee Supabase:
1. `profiles`: Xogta dadka isticmaalayaasha ah iyo doorkooda (`admin` ama `student`).
2. `courses`: Koorsooyinka, qiimaha, sawirrada, iyo manhajka JSONB.
3. `enrollments`: Dalabaadka ardayda, habka lacagta, number-ka soo diray, TxID, iyo xaaladda (`pending`, `approved`, `rejected`).
4. **Row Level Security (RLS)**: Xeerar hubinaya in `mohaking918@gmail.com` oo kaliya uu wax ka beddeli karo xaaladda dalabaadka iyo koorsooyinka.
5. **Seed Data**: 6 koorso oo diyaarsan oo leh manhaj iyo qiimo.

### Sida loogu shaqaysiiyo Supabase:
1. Gal [Supabase Dashboard](https://supabase.com).
2. Samee mashruuc cusub.
3. Fur **SQL Editor**, ku dheji nuxurka faylka `supabase-schema.sql`, kadibna guji **Run**.
4. Nuqul ka qaado **Project URL** iyo **Anon Public Key**.
5. Ku dar faylka `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *(Ama si toos ah ugu qor badhanka "Supabase Live / Ready" ee ku yaalla Navbar-ka).*

---

## 💻 Sida Loo Orodhsiiyo Mashruuca (Local Development)

```bash
# 1. Gal folder-ka
cd "d:\Gaadh Xirfad website"

# 2. Ku shub dependencies (haddii aadan hore u shubin)
npm install

# 3. Kici server-ka
npm run dev
```

Website-ka wuxuu toos uga furmayaa: `http://localhost:5173/`

### Tijaabinta Hadda (Instant Test Features):
- **Tijaabada Admin:** Guji "Gal / Sign In" -> dooro badhanka **"Gal sidii Admin (mohaking918@gmail.com)"**. Waxaad toos u arki doontaa qaybta maamulka ee **Admin Dashboard** oo aad ku xaqiijin karto dalabaadka!
- **Tijaabada Ardayga:** Dooro **"Gal sidii Arday"** si aad u aragto aragtida ardayga iyo fasalka waxbarashada!
