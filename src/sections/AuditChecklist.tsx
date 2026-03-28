import { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CameraCapture } from '@/components/CameraCapture';
import type { AuditSection } from '@/types/audit';
import { SCORE_OPTIONS } from '@/types/audit';
import { ClipboardList, MessageSquare, Star, Camera, ImageIcon } from 'lucide-react';

interface AuditChecklistProps {
  sections: AuditSection[];
  onScoreChange: (sectionKey: string, questionId: number, score: number | null) => void;
  onCommentChange: (sectionKey: string, questionId: number, comment: string) => void;
  onPhotoChange: (sectionKey: string, questionId: number, photoLocal: string | null) => void;
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
  onCommentChange,
  onPhotoChange
}: AuditChecklistProps) => {
  const [activeCamera, setActiveCamera] = useState<{sectionKey: string, questionId: number} | null>(null);

  const handlePhotoCapture = (sectionKey: string, questionId: number, imageBase64: string) => {
    onPhotoChange(sectionKey, questionId, imageBase64);
    setActiveCamera(null);
  };

  const handlePhotoDelete = (sectionKey: string, questionId: number) => {
    onPhotoChange(sectionKey, questionId, null);
  };

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
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-28">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3" />
                        Score
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-[25%]">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Temuan
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-20">
                      <div className="flex items-center justify-center gap-1">
                        <Camera className="w-3 h-3" />
                        Foto
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
                          placeholder="Tuliskan temuan..."
                          className="min-h-[60px] text-sm bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Dialog 
                          open={activeCamera?.sectionKey === section.key && activeCamera?.questionId === question.id}
                          onOpenChange={(open) => {
                            if (!open) setActiveCamera(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              onClick={() => setActiveCamera({ sectionKey: section.key, questionId: question.id })}
                              className={`w-full h-12 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                                question.photoLocal || question.photoUrl
                                  ? 'border-green-400 bg-green-50 hover:bg-green-100'
                                  : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              {question.photoLocal || question.photoUrl ? (
                                <div className="flex items-center gap-1">
                                  <ImageIcon className="w-4 h-4 text-green-600" />
                                  <Badge className="bg-green-500 text-white text-xs">Ada</Badge>
                                </div>
                              ) : (
                                <Camera className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Ambil Foto Temuan
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <p className="text-sm text-slate-600 mb-4">
                                {question.question.substring(0, 80)}...
                              </p>
                              <CameraCapture
                                onCapture={(imageBase64) => handlePhotoCapture(section.key, question.id, imageBase64)}
                                onCancel={() => setActiveCamera(null)}
                                existingPhoto={question.photoLocal || question.photoUrl}
                                onDelete={() => handlePhotoDelete(section.key, question.id)}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
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
