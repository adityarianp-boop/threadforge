import { ViralAnalyzer } from "@/components/viral/viral-analyzer";

export default function ViralPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium">Riset Viral</h1>
        <p className="text-sm text-textSecondary">Analisis potensi viral konten sebelum posting. Dapatkan skor, hook siap pakai, dan strategi terbaik.</p>
      </div>
      <ViralAnalyzer />
    </div>
  );
}
