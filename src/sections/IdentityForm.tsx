import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AREA_OPTIONS, LOKASI_OPTIONS, AUDITORS_LIST } from '@/types/audit';
import { Calendar, MapPin, Users, Building } from 'lucide-react';

interface IdentityFormProps {
  area: string;
  lokasi: string;
  auditors: string[];
  tanggal: string;
  onAreaChange: (area: string) => void;
  onLokasiChange: (lokasi: string) => void;
  onAuditorToggle: (auditor: string) => void;
  onTanggalChange: (tanggal: string) => void;
}

export const IdentityForm = ({
  area,
  lokasi,
  auditors,
  tanggal,
  onAreaChange,
  onLokasiChange,
  onAuditorToggle,
  onTanggalChange
}: IdentityFormProps) => {
  const availableLokasi = area ? LOKASI_OPTIONS[area] || [] : [];

  return (
    <Card className="shadow-lg border-t-4 border-t-blue-600">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Identitas Audit
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Area Utama */}
          <div className="space-y-2">
            <Label htmlFor="area" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              Area Utama
            </Label>
            <Select value={area} onValueChange={onAreaChange}>
              <SelectTrigger className="w-full bg-white border-slate-300 focus:ring-blue-500">
                <SelectValue placeholder="Pilih Area Utama" />
              </SelectTrigger>
              <SelectContent>
                {AREA_OPTIONS.filter(opt => opt.value !== '').map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lokasi Detail */}
          <div className="space-y-2">
            <Label htmlFor="lokasi" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              Lokasi Detail
            </Label>
            <Select value={lokasi} onValueChange={onLokasiChange} disabled={!area}>
              <SelectTrigger className="w-full bg-white border-slate-300 focus:ring-blue-500">
                <SelectValue placeholder={area ? "Pilih Lokasi" : "Pilih Area terlebih dahulu"} />
              </SelectTrigger>
              <SelectContent>
                {availableLokasi.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tanggal */}
          <div className="space-y-2">
            <Label htmlFor="tanggal" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Tanggal Audit
            </Label>
            <Input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => onTanggalChange(e.target.value)}
              className="bg-white border-slate-300 focus:ring-blue-500"
            />
          </div>

          {/* Auditor Counter */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              Jumlah Auditor
            </Label>
            <div className="flex items-center h-10 px-3 bg-slate-100 rounded-md border border-slate-300">
              <span className="text-lg font-semibold text-blue-600">
                {auditors.length}
              </span>
              <span className="text-slate-500 ml-1">auditor dipilih</span>
            </div>
          </div>
        </div>

        {/* Auditor Selection */}
        <div className="mt-6 space-y-3">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            Auditor (Pilih lebih dari 1)
          </Label>
          
          {/* Selected Auditors Badges */}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-blue-50 rounded-lg border border-blue-200">
            {auditors.length === 0 ? (
              <span className="text-slate-400 text-sm italic">Belum ada auditor yang dipilih...</span>
            ) : (
              auditors.map(auditor => (
                <Badge 
                  key={auditor} 
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
                >
                  {auditor}
                </Badge>
              ))
            )}
          </div>

          {/* Auditor Checkboxes */}
          <ScrollArea className="h-48 border border-slate-300 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {AUDITORS_LIST.map(auditor => (
                <div key={auditor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`auditor-${auditor}`}
                    checked={auditors.includes(auditor)}
                    onCheckedChange={() => onAuditorToggle(auditor)}
                    className="border-slate-400 data-[state=checked]:bg-blue-600"
                  />
                  <Label 
                    htmlFor={`auditor-${auditor}`}
                    className="text-sm text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {auditor}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
