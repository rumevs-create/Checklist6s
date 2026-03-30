export const sendToGoogleSheets = async (
  auditId: string,
  auditState: AuditState,
  summary: AuditSummary,
  photos: PhotoData[]
): Promise<boolean> => {
  try {
    console.log("🔥 KIRIM KE GOOGLE SHEETS");

    const payload = {
      timestamp: new Date().toISOString(),
      auditId,
      area: auditState.area,
      lokasi: auditState.lokasi,
      tanggal: auditState.tanggal,
      auditors: auditState.auditors.join("; "),
      avgSort: summary.avgSort,
      avgSetInOrder: summary.avgSetInOrder,
      avgSafety: summary.avgSafety,
      avgShine: summary.avgShine,
      avgStandardize: summary.avgStandardize,
      avgSustain: summary.avgSustain,
      totalScore: summary.totalScore,
      avgOverall: summary.avgOverall,
      kategori: summary.kategori,
      photoUrls: photos.map(p => p.url).join("; "),
      detailScores: "detail"
    };

    console.log("📤 DATA:", payload);

    const formData = new URLSearchParams();
    formData.append("data", JSON.stringify(payload));

    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      body: formData
    });

    console.log("✅ REQUEST TERKIRIM");

    return true;

  } catch (error) {
    console.error("❌ ERROR:", error);
    return false;
  }
};
