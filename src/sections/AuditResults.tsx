import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AuditSummary } from '@/types/audit';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { TrendingUp, Award, BarChart3, Info } from 'lucide-react';

interface AuditResultsProps {
  summary: AuditSummary;
  radarData: Array<{ subject: string; A: number; fullMark: number }>;
}

const getScoreColor = (score: number): string => {
  if (score >= 4.5) return 'text-green-600 bg-green-100 border-green-300';
  if (score >= 3.5) return 'text-blue-600 bg-blue-100 border-blue-300';
  if (score >= 3.0) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
  if (score >= 2.0) return 'text-orange-600 bg-orange-100 border-orange-300';
  return 'text-red-600 bg-red-100 border-red-300';
};

const getKategoriColor = (kategori: string): string => {
  const colors: Record<string, string> = {
    'Sangat Baik': 'bg-green-500',
    'Baik': 'bg-blue-500',
    'Sedang': 'bg-yellow-500',
    'Kurang': 'bg-orange-500',
    'Sangat Kurang': 'bg-red-500'
  };
  return colors[kategori] || 'bg-slate-500';
};

export const AuditResults = ({ summary, radarData }: AuditResultsProps) => {
  const hasData = summary.avgOverall > 0;

  const scoreCards = [
    { label: 'SORT', value: summary.avgSort },
    { label: 'SET IN ORDER', value: summary.avgSetInOrder },
    { label: 'SAFETY', value: summary.avgSafety },
    { label: 'SHINE', value: summary.avgShine },
    { label: 'STANDARDIZE', value: summary.avgStandardize },
    { label: 'SUSTAIN', value: summary.avgSustain },
  ];

  return (
    <div className="space-y-6">
      {/* Score Summary Cards */}
      <Card className="shadow-lg border-t-4 border-t-indigo-600">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Ringkasan Skor per Aspek
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {scoreCards.map((card) => (
              <div 
                key={card.label}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  hasData 
                    ? getScoreColor(card.value) 
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide mb-1">
                  {card.label}
                </div>
                <div className="text-2xl font-bold">
                  {hasData ? card.value.toFixed(1) : '-'}
                </div>
              </div>
            ))}
          </div>

          {/* Total Score */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Total Score</div>
              <div className="text-3xl font-bold text-slate-800">
                {hasData ? summary.totalScore : '-'}
                <span className="text-lg text-slate-500 font-normal"> / 225</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Rata-rata Overall</div>
              <div className={`text-3xl font-bold ${
                hasData ? getScoreColor(summary.avgOverall).split(' ')[0] : 'text-slate-400'
              }`}>
                {hasData ? summary.avgOverall.toFixed(2) : '-'}
                <span className="text-lg text-slate-500 font-normal"> / 5.00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Diagram Radar 6S
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 5]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickCount={6}
                  />
                  <Radar
                    name="Rata-rata per aspek"
                    dataKey="A"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-slate-800">
                              {payload[0].payload.subject}
                            </p>
                            <p className="text-blue-600 font-bold">
                              Score: {Number(payload[0].value).toFixed(2)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Belum ada data penilaian</p>
                  <p className="text-sm">Silakan isi skor terlebih dahulu</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Result */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Kategori Hasil Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {hasData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge 
                  className={`${getKategoriColor(summary.kategori)} text-white text-lg px-4 py-2`}
                >
                  {summary.kategori}
                </Badge>
                <span className="text-slate-600">
                  Rata-rata skor: <strong>{summary.avgOverall.toFixed(2)}</strong>
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700">{summary.penjelasan}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Belum ada penilaian</p>
              <p className="text-sm">Silakan isi skor untuk melihat kategori</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
