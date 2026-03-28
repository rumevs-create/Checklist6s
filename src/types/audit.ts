// Types for 6S Audit Application

export interface AuditQuestion {
  id: number;
  question: string;
  score: number | null;
  comment: string;
  photoUrl?: string | null; // URL foto temuan
  photoLocal?: string | null; // Base64 untuk preview sebelum upload
}

export interface AuditSection {
  name: string;
  key: string;
  questions: AuditQuestion[];
}

export interface AuditData {
  area: string;
  lokasi: string;
  auditors: string[];
  tanggal: string;
  sections: AuditSection[];
}

export interface AuditSummary {
  avgSort: number;
  avgSetInOrder: number;
  avgSafety: number;
  avgShine: number;
  avgStandardize: number;
  avgSustain: number;
  totalScore: number;
  avgOverall: number;
  kategori: string;
  penjelasan: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  clientId: string;
}

export const AUDITORS_LIST = [
  "Ikhwanul Muttaqien",
  "Fahroni",
  "Mawardi",
  "M.Diki Kurnaedi",
  "Abdul Rahman",
  "Ryan Zulfikar",
  "Hajar Laraswati",
  "Rahmat Hidayat",
  "Saliwan",
  "Rojiallah",
  "Ahmad Syahrar",
  "Rezky Fadli",
  "Agus Supratman",
  "Yastuti",
  "Reza Pahlepi",
  "Mufrodi",
  "R. Wira Hadi Surya",
  "Hajiji Abdullah",
  "A.Susanti",
  "Afreiza M.T",
  "Dedi Setiadi",
  "Arziz Mardy",
  "Egi Wardoyo",
  "Aaz Rusmaji"
];

export const AREA_OPTIONS = [
  { value: "", label: "-- Pilih Area Utama --" },
  { value: "Area I", label: "Area I" },
  { value: "Area II", label: "Area II" },
  { value: "Area III", label: "Area III" },
  { value: "Area IV", label: "Area IV" }
];

export const LOKASI_OPTIONS: Record<string, { value: string; label: string }[]> = {
  "Area I": [
    { value: "Area I - Cutter", label: "Cutter" },
    { value: "Area I - Filter Cleaning", label: "Filter Cleaning" },
    { value: "Area I - DCS", label: "DCS" },
    { value: "Area I - Bagging & Bulk Loading", label: "Bagging & Bulk Loading" },
    { value: "Area I - CFH panel", label: "CFH panel" },
    { value: "Area I - Chemical storage", label: "Chemical storage" }
  ],
  "Area II": [
    { value: "Area II - Warehouse Office", label: "Warehouse Office" },
    { value: "Area II - Gudang Material", label: "Gudang Material" },
    { value: "Area II - Spare part/Store", label: "Spare part/Store" },
    { value: "Area II - Gudang Safety", label: "Gudang Safety" },
    { value: "Area II - Ruang klinik", label: "Ruang klinik" },
    { value: "Area II - Area B3", label: "Area B3" },
    { value: "Area II - Fire station", label: "Fire station" }
  ],
  "Area III": [
    { value: "Area III - Workshop", label: "Workshop" },
    { value: "Area III - Office Maintenance", label: "Office Maintenance" },
    { value: "Area III - Area Utama Ruang Lab", label: "Area Utama Ruang Lab" },
    { value: "Area III - Extruder", label: "Extruder" }
  ],
  "Area IV": [
    { value: "Area IV - Ruang Kerja Procurement", label: "Ruang Kerja Procurement" },
    { value: "Area IV - Ruangan ITS", label: "Ruangan ITS" },
    { value: "Area IV - Ruangan Accounting", label: "Ruangan Accounting" },
    { value: "Area IV - Area parkir", label: "Area parkir" },
    { value: "Area IV - Pos 1 Security", label: "Pos 1 Security" }
  ]
};

export const INITIAL_AUDIT_DATA: AuditSection[] = [
  {
    name: "SORT",
    key: "SORT",
    questions: [
      { id: 1, question: "Apakah semua barang di area kerja sudah dipilah-pilah berdasarkan kategorinya (misalnya, alat kerja, dokumen, material, chemical)?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 2, question: "Apakah terdapat barang yang tidak dikategorikan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 3, question: "Apakah terdapat barang yang tercampur dengan kategori lain?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 4, question: "Apakah semua barang yang tidak diperlukan (tidak dipakai, rusak, usang) telah diidentifikasi?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 5, question: "Apakah barang yang tidak diperlukan telah dipisahkan secara fisik dari barang yang masih dipakai?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 6, question: "Apakah terdapat area khusus untuk penyimpanan barang yang tidak diperlukan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 7, question: "Apakah semua barang yang tidak diperlukan telah diberi tanda yang jelas (Red Tag)?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 8, question: "Apakah terdapat format standar untuk penandaan/pelabelan (Red Tag)?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 9, question: "Apakah tempat penyimpanan sementara, aman dan terhindar dari kerusakan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 10, question: "Apakah semua item yang diberi label Red Tag telah ditangani?", score: null, comment: "", photoUrl: null, photoLocal: null }
    ]
  },
  {
    name: "SET IN ORDER",
    key: "SETINORDER",
    questions: [
      { id: 1, question: "Apakah semua barang, peralatan atau dokumen disimpan di tempat yang ditentukan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 2, question: "Apakah tempat penyimpanan mudah diakses dan terlihat dengan jelas?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 3, question: "Apakah barang, peralatan atau dokumen ditata dengan rapi dan teratur?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 4, question: "Apakah area kerja terbebas dari berbagai objek yang tidak diperlukan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 5, question: "Apakah barang, peralatan atau dokumen yang sering digunakan, disimpan di tempat yang mudah dijangkau?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 6, question: "Penyimpanan tool dirancang sedemikian rupa sehingga cepat ditemukan dan mudah dijangkau saat dibutuhkan. Tempat penyimpanan ada label, jika tool tidak ada dapat dengan mudah diketahui/diidentifikasi.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 7, question: "Kertas-kertas kerja memiliki identitas yang jelas, ditempatkan di lokasi yang telah ditentukan, dan mudah dilihat atau ditemukan.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 8, question: "Peralatan, mesin/equipment memiliki identitas yang jelas (nomor, nama, kode warna, dll) dan ditempatkan di area yang telah ditentukan.", score: null, comment: "", photoUrl: null, photoLocal: null }
    ]
  },
  {
    name: "SAFETY",
    key: "SAFETY",
    questions: [
      { id: 1, question: "Tidak ada alat-alat kerja yang menyebabkan bahaya terlilit/tersandung, seperti kabel listrik, tali, dll.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 2, question: "Panel listrik mudah terlihat dan lokasinya mudah dijangkau saat terjadi kondisi darurat (tidak terhalangi/tertutup benda lain).", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 3, question: "Fire extinguisher/alat pemadam api ringan (APAR) dan perlengkapan emergency yang lain (kotak P3K, tandu, dll) harus mudah dilihat dan ditemukan, misalnya dengan dibantu label penunjuk.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 4, question: "Kondisi kerja ergonomis, tools ditempatkan di ketinggian yang sesuai, alat-alat bantu untuk mengangkat tersedia, dll.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 5, question: "Petunjuk penggunaan perlengkapan safety terbaca dengan jelas.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 6, question: "Apakah jalur evakuasi dan pintu darurat mudah diakses dan tidak terhalang oleh peralatan atau material?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 7, question: "Apakah bahan kimia dan material berbahaya disimpan dan diberi label dengan benar sesuai dengan standar keselamatan?", score: null, comment: "", photoUrl: null, photoLocal: null }
    ]
  },
  {
    name: "SHINE",
    key: "SHINE",
    questions: [
      { id: 1, question: "Apakah area kerja, termasuk lantai, dinding, dan permukaannya, bersih dari debu, kotoran, dan noda?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 2, question: "Apakah alat pembersih (seperti sapu, kain lap, dan vacuum cleaner) tersedia dan ditata dengan baik di area kerja?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 3, question: "Apakah sampah dan limbah dibuang dengan benar dan ditempatkan di tempat sampah yang sesuai?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 4, question: "Apakah jadwal pembersihan dan perawatan telah dipajang dan diikuti oleh semua anggota tim di area kerja?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 5, question: "Kertas-kertas tidak kusut, robek, terjaga kebersihannya dan terlindungi dari kotoran (debu, noda, dll).", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 6, question: "Alas kerja/work surface (mesin, meja kerja dan perlengkapan kerja yang lain termasuk panel elektrik) bersih dan dicat.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 7, question: "Lantai terbebas dari kotoran, puing, oli, wadah kosong, material, dll. Jika terdapat saluran pembuangan, lokasinya sesuai dan tidak tersumbat.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 8, question: "Dinding, tembok, partisi, dll dicat dan terjaga kebersihannya.", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 9, question: "Apakah lantai, dinding, langit-langit, dan pipa berada dalam kondisi baik serta bebas dari kotoran/debu?", score: null, comment: "", photoUrl: null, photoLocal: null }
    ]
  },
  {
    name: "STANDARDIZE",
    key: "STANDARDIZE",
    questions: [
      { id: 1, question: "Apakah ada jadwal rutin untuk menginspeksi kepatuhan terhadap standar yang telah diterapkan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 2, question: "Apakah terdapat standar terdokumentasi untuk setiap elemen 6S di area kerja?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 3, question: "Apakah ada tindakan korektif yang ditetapkan dan diterapkan jika standar tidak diikuti atau terjadi penyimpangan?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 4, question: "Apakah semua alat, bahan, dan peralatan ditempatkan sesuai dengan standar penempatan yang telah ditetapkan (misalnya, lokasi yang ditandai)?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 5, question: "Apakah ada panduan visual yang memudahkan untuk memahami dan menerapkan standar yang ada?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 6, question: "Apakah tampilan informasi, tanda, kode warna, dan penandaan lainnya telah ditetapkan di area kerja?", score: null, comment: "", photoUrl: null, photoLocal: null }
    ]
  },
  {
    name: "SUSTAIN",
    key: "SUSTAIN",
    questions: [
      { id: 1, question: "Apakah hasil dari program 6S didokumentasikan dan dipublikasikan secara rutin untuk mempertahankan kesadaran dan komitmen dari departemen?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 2, question: "Apakah ada program pelatihan berkelanjutan untuk memastikan bahwa semua karyawan memahami pentingnya 6S dan bagaimana menerapkannya?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 3, question: "Apakah manajemen secara rutin mengadakan tinjauan dan evaluasi untuk memastikan penerapan 6S tetap konsisten?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 4, question: "Apakah penghargaan atau insentif diberikan kepada karyawan atau tim yang secara konsisten menerapkan dan mempertahankan standar 6S?", score: null, comment: "", photoUrl: null, photoLocal: null },
      { id: 5, question: "Team memiliki inisiatif untuk improvement di area kerjanya masing-masing, untuk hal-hal yang tidak teridentifikasi saat dilaksanakannya audit/patroli 6S.", score: null, comment: "", photoUrl: null, photoLocal: null }
    ]
  }
];

export const SCORE_OPTIONS = [
  { value: "", label: "Pilih" },
  { value: "1", label: "1 - Tidak ada usaha" },
  { value: "2", label: "2 - Sedikit usaha" },
  { value: "3", label: "3 - Sedang" },
  { value: "4", label: "4 - Baik" },
  { value: "5", label: "5 - Sangat Baik" }
];

export const getKategoriPenilaian = (avgOverall: number): { kategori: string; penjelasan: string } => {
  if (avgOverall < 2.0) {
    return {
      kategori: "Sangat Kurang",
      penjelasan: "Penerapan 6S di lokasi ini masih sangat rendah. Perlu tindakan perbaikan mendasar dan intensif."
    };
  } else if (avgOverall < 3.0) {
    return {
      kategori: "Kurang",
      penjelasan: "Penerapan 6S masih lemah. Banyak aspek yang belum konsisten dan membutuhkan perbaikan signifikan."
    };
  } else if (avgOverall < 3.5) {
    return {
      kategori: "Sedang",
      penjelasan: "Penerapan 6S sudah mulai terlihat, namun masih di level permukaan dan perlu penguatan untuk menjadi budaya."
    };
  } else if (avgOverall < 4.5) {
    return {
      kategori: "Baik",
      penjelasan: "Penerapan 6S cukup baik dan relatif konsisten. Diperlukan monitoring dan improvement berkelanjutan."
    };
  } else {
    return {
      kategori: "Sangat Baik",
      penjelasan: "Penerapan 6S sudah sangat baik dan berkelanjutan. Lokasi ini dapat dijadikan benchmark untuk lokasi lain."
    };
  }
};
