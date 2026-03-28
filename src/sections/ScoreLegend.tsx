import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const scoreLegend = [
  { score: 5, label: 'Sangat Baik', description: 'Praktik optimal & berkelanjutan', color: 'bg-green-500' },
  { score: 4, label: 'Baik', description: 'Penerapan konsisten, cukup baik', color: 'bg-blue-500' },
  { score: 3, label: 'Sedang', description: 'Implementasi di permukaan saja', color: 'bg-yellow-500' },
  { score: 2, label: 'Sedikit Usaha', description: 'Tidak terorganisir, butuh banyak perbaikan', color: 'bg-orange-500' },
  { score: 1, label: 'Tidak Ada Usaha', description: 'Tidak ada aktivitas 6S di area kerja', color: 'bg-red-500' }
];

export const ScoreLegend = () => {
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-600" />
          Legenda Skor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {scoreLegend.map((item) => (
            <div 
              key={item.score} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Badge className={`${item.color} text-white w-8 h-8 flex items-center justify-center text-sm font-bold`}>
                {item.score}
              </Badge>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{item.label}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
