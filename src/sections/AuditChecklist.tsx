import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { AuditSection } from '@/types/audit';
import { SCORE_OPTIONS } from '@/types/audit';
import { ClipboardList, MessageSquare, Star } from 'lucide-react';

interface AuditChecklistProps {
  sections: AuditSection[];
  onScoreChange: (sectionKey: string, questionId: number, score: number | null) => void;
  onCommentChange: (sectionKey: string, questionId: number, comment: string) => void;
}

const getSectionColor = (sectionName: string): string => {
  const colors: Record<string, string> = {
    'SORT': 'from-red-500 to-red-600',
    'SET IN ORDER': 'from-orange-500 to-orange-600',
    'SAFETY': 'from-yellow-500 to-yellow-600',
    'SHINE': 'from-green-500 to-green-600',
    'STANDARDIZE': 'from-blue-500 to-blue-600',
    'SUSTAIN': 'from-purple-500 to-purple-600'
  };
  return colors[sectionName] || 'from-slate-500 to-slate-600';
};

const getSectionBgColor = (sectionName: string): string => {
  const colors: Record<string, string> = {
    'SORT': 'bg-red-50 border-red-200',
    'SET IN ORDER': 'bg-orange-50 border-orange-200',
    'SAFETY': 'bg-yellow-50 border-yellow-200',
    'SHINE': 'bg-green-50 border-green-200',
    'STANDARDIZE': 'bg-blue-50 border-blue-200',
    'SUSTAIN': 'bg-purple-50 border-purple-200'
  };
  return colors[sectionName] || 'bg-slate-50 border-slate-200';
};

export const AuditChecklist = ({
  sections,
  onScoreChange,
  onCommentChange
}: AuditChecklistProps) => {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.key} className={`shadow-md border-t-4 ${getSectionBgColor(section.name)}`}>
          <CardHeader className={`bg-gradient-to-r ${getSectionColor(section.name)} text-white`}>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              {section.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-12">No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Pertanyaan</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-32">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3" />
                        Score
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-1/3">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Temuan / Saran Perbaikan
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.questions.map((question, index) => (
                    <tr 
                      key={question.id} 
                      className={`border-b border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {question.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {question.question}
                      </td>
                      <td className="px-4 py-3">
                        <Select 
                          value={question.score?.toString() || ''} 
                          onValueChange={(value) => {
                            const score = value ? parseInt(value, 10) : null;
                            onScoreChange(section.key, question.id, score);
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border-slate-300 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Pilih" />
                          </SelectTrigger>
                          <SelectContent>
                            {SCORE_OPTIONS.filter(opt => opt.value !== '').map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      option.value === '5' ? 'border-green-500 text-green-700' :
                                      option.value === '4' ? 'border-blue-500 text-blue-700' :
                                      option.value === '3' ? 'border-yellow-500 text-yellow-700' :
                                      option.value === '2' ? 'border-orange-500 text-orange-700' :
                                      'border-red-500 text-red-700'
                                    }`}
                                  >
                                    {option.value}
                                  </Badge>
                                  <span className="text-xs text-slate-600">
                                    {option.label.split(' - ')[1]}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Textarea
                          value={question.comment}
                          onChange={(e) => onCommentChange(section.key, question.id, e.target.value)}
                          placeholder="Tuliskan temuan dan saran perbaikan di sini..."
                          className="min-h-[60px] text-sm bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
