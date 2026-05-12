export type IdeaCategory = "all" | "meta" | "perf" | "brand" | "funnel" | "design" | "video" | "music" | "life";

export type IdeaSeed = {
  cat: Exclude<IdeaCategory, "all">;
  title: string;
  hook: string;
  why: string;
};

export const ideaCategories: { id: IdeaCategory; label: { en: string; id: string } }[] = [
  { id: "all", label: { en: "All", id: "Semua" } },
  { id: "meta", label: { en: "Meta Ads", id: "Meta Ads" } },
  { id: "perf", label: { en: "Performance", id: "Performance" } },
  { id: "brand", label: { en: "Personal Brand", id: "Personal Brand" } },
  { id: "funnel", label: { en: "Funnel & Offer", id: "Funnel & Offer" } },
  { id: "design", label: { en: "Design & Visual", id: "Desain & Visual" } },
  { id: "video", label: { en: "Video & Photo", id: "Video & Foto" } },
  { id: "music", label: { en: "Music & Culture", id: "Musik & Budaya" } },
  { id: "life", label: { en: "Life & Money", id: "Hidup & Uang" } },
];

export const ideaData: IdeaSeed[] = [
  { cat: "meta", title: "Broad audience vs detailed targeting", hook: '"Gue hapus semua interest targeting. ROAS naik."', why: "Counter-intuitive, langsung bikin penasaran" },
  { cat: "meta", title: "Attribution window bikin angka selalu beda", hook: '"Kenapa angka Ads Manager dan Shopify lo tidak pernah sama?"', why: "Pain point universal semua advertiser" },
  { cat: "meta", title: "Social proof di level iklan mempengaruhi CPM", hook: '"Likes di iklan lama lo itu aset. Bukan dekorasi."', why: "Insight jarang diketahui, langsung actionable" },
  { cat: "meta", title: "Cost cap vs bid cap: kapan salah pilih bunuh delivery", hook: '"Klien gue kehilangan 3 hari delivery gara-gara satu angka."', why: "Spesifik, ada stakes yang jelas" },
  { cat: "meta", title: "Tes hook video, bukan seluruh videonya", hook: '"Gue tidak tes 10 iklan berbeda. Gue tes 10 opening."', why: "Counter-intuitive + langsung bisa dicoba" },
  { cat: "perf", title: "ROAS tinggi tapi bisnis rugi: anatomy-nya", hook: '"ROAS 5x. Profit negatif. Ini bisa terjadi."', why: "Shocking statement yang perlu penjelasan" },
  { cat: "perf", title: "LTV vs CPA sebagai north star metric", hook: '"Lo mungkin sedang optimasi metric yang salah."', why: "Questioning asumsi dasar advertiser" },
  { cat: "perf", title: "Retargeting yang underutilized", hook: '"80% anggaran ads ke cold audience. Retargeting dapat 20%."', why: "Angka konkret langsung memancing respons" },
  { cat: "brand", title: "Transparansi kegagalan menarik lebih banyak klien", hook: '"Gue pernah rekomendasikan strategi yang salah. Ini yang terjadi."', why: "Kejujuran langka = trust builder terkuat" },
  { cat: "brand", title: "Beda antara sibuk dan produktif sebagai consultant", hook: '"Bulan terbaik gue secara revenue adalah bulan paling santai gue."', why: "Relatable + counter-intuitive" },
  { cat: "funnel", title: "Offer lemah tidak bisa diselamatkan ads", hook: '"Ads bagus tidak bisa selamatkan produk yang salah positioning."', why: "Hard truth yang butuh keberanian diucapkan" },
  { cat: "funnel", title: "Landing page adalah silent killer", hook: '"Iklannya bagus. Landing page-nya yang bocor."', why: "Mengalihkan blame ke tempat yang benar" },
  { cat: "design", title: "Logo mahal tidak menjamin brand kuat", hook: '"Lo bayar 10 juta buat logo. Tapi orang masih nggak inget brand lo."', why: "Nyerang asumsi bahwa visual = brand" },
  { cat: "design", title: "Font gratis vs font berbayar: kapan worth it", hook: '"Desainer gue pakai font 500 ribu. Klien nggak bisa bedain sama Arial."', why: "Perdebatan yang selalu muncul di komunitas desain" },
  { cat: "design", title: "Kenapa konten dengan desain jelek kadang lebih viral", hook: '"Post paling viral di akun gue dibuat dalam 5 menit pakai Canva gratis."', why: "Melawan asumsi bahwa desain bagus = performa bagus" },
  { cat: "design", title: "Color psychology yang sebenarnya dipakai brand besar", hook: '"Warna merah di logo brand makanan bukan kebetulan. Ini sains-nya."', why: "Edukasi yang terasa kayak rahasia industri" },
  { cat: "design", title: "Perbedaan desainer yang digaji 3 juta vs 30 juta", hook: '"Keduanya bisa bikin logo. Yang ini tahu kenapa logo itu harus ada."', why: "Positioning content untuk desainer yang mau naik level" },
  { cat: "video", title: "Kenapa video gelap dan grainy justru lebih dipercaya", hook: '"Video iPhone gue yang goyang-goyang dapat 2 juta views. Yang cinematic? 10 ribu."', why: "Counter-intuitive, langsung bikin orang penasaran" },
  { cat: "video", title: "3 detik pertama menentukan 90% performa konten video", hook: '"Lo sudah kalah sebelum orang selesai baca caption lo."', why: "Urgent, langsung actionable" },
  { cat: "video", title: "Foto produk dengan HP vs DSLR: mana yang lebih convert", hook: '"Gue tes dua foto produk yang sama. HP menang. Ini kenapa."', why: "Data nyata melawan asumsi kualitas" },
  { cat: "video", title: "Kenapa videografer lepas susah naik harga", hook: '"Lo jual jam kerja. Klien selalu bisa cari yang lebih murah."', why: "Pain point mendalam komunitas videografer freelance" },
  { cat: "video", title: "Editing yang terlalu bagus justru bikin konten terasa iklan", hook: '"Semakin rapi video lo, semakin orang nggak percaya."', why: "Insight yang melawan instinct kreator konten" },
  { cat: "music", title: "Kenapa lagu rap Indonesia bisa trending padahal liriknya sederhana", hook: '"Lagu dengan lirik paling simple justru yang paling banyak diputar. Ini kenapa."', why: "Memancing diskusi soal taste dan kualitas musik" },
  { cat: "music", title: "Algoritma Spotify lebih jujur dari chart radio", hook: '"Chart radio dibayar. Spotify Discover Weekly tidak bisa dibeli."', why: "Expose sistem yang selama ini dianggap netral" },
  { cat: "music", title: "Kenapa lagu nostalgia selalu comeback setiap 10 tahun", hook: '"Lo dengar lagu SMA lo dan tiba-tiba emosi. Ini bukan kebetulan."', why: "Psikologi yang relatable untuk semua orang" },
  { cat: "music", title: "TikTok tidak membunuh industri musik, tapi mengubah siapa yang menang", hook: '"Dulu butuh label besar. Sekarang butuh 15 detik yang tepat."', why: "Reframing perubahan industri yang sedang terjadi" },
  { cat: "life", title: "Gaji UMR Jakarta vs biaya hidup: matematika yang tidak pernah jujur", hook: '"UMR Jakarta 5 juta. Kost 1,5 juta. Makan 1,5 juta. Sisa? Lo hitung sendiri."', why: "Konten yang langsung relatable untuk mayoritas pekerja" },
  { cat: "life", title: "Kenapa side hustle kebanyakan orang tidak pernah jadi main hustle", hook: '"Lo punya side hustle 2 tahun. Masih side. Ini yang salah."', why: "Mengidentifikasi masalah yang jarang diakui" },
  { cat: "life", title: "Investasi reksa dana vs tabungan biasa: yang tidak diajarkan di sekolah", hook: '"Nenek gue nabung 40 tahun. Hasilnya kalah sama inflasi."', why: "Financial literacy dengan angle emosional" },
  { cat: "life", title: "Kenapa orang pintar sering lebih miskin dari orang berani", hook: '"IPK 3.9. Kerja kantoran. Gaji pas-pasan. Teman yang drop out? Sudah punya rumah."', why: "Melawan narrative bahwa pendidikan = finansial aman" },
  { cat: "life", title: "Loker host live streaming: peluang atau jebakan?", hook: '"Gaji 5 juta sebulan cuma modal ngomong. Tapi kenapa banyak yang burnout dalam 3 bulan?"', why: "Topik yang sedang viral dengan angle kritis" },
];
