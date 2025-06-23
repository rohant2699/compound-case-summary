
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, TrendingUp, Clock } from 'lucide-react';

interface CaseStudyData {
  primaryCompoundCode: string;
  workPackageCode: string;
  studyCode: string;
  csrPublishedActual: string;
}

interface DataSummaryProps {
  data: CaseStudyData[];
  isProcessing: boolean;
}

interface CompoundSummary {
  compoundCode: string;
  caseStudies: CaseStudyData[];
  totalStudies: number;
}

const DataSummary: React.FC<DataSummaryProps> = ({ data, isProcessing }) => {
  const compoundSummaries = useMemo(() => {
    const grouped = data.reduce((acc, study) => {
      const code = study.primaryCompoundCode;
      if (!acc[code]) {
        acc[code] = [];
      }
      acc[code].push(study);
      return acc;
    }, {} as Record<string, CaseStudyData[]>);

    return Object.entries(grouped).map(([compoundCode, caseStudies]) => ({
      compoundCode,
      caseStudies,
      totalStudies: caseStudies.length
    }));
  }, [data]);

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Processing Data...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Case Study Summary
          </CardTitle>
          <CardDescription>
            Upload an Excel file to view case study summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data to display</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Compounds</p>
                <p className="text-2xl font-bold text-gray-900">{compoundSummaries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Case Studies</p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Studies/Compound</p>
                <p className="text-2xl font-bold text-gray-900">
                  {compoundSummaries.length > 0 ? Math.round(data.length / compoundSummaries.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Compound Case Study Details
          </CardTitle>
          <CardDescription>
            Detailed breakdown of case studies by primary compound code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {compoundSummaries.map((summary) => (
                <div key={summary.compoundCode} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {summary.compoundCode}
                    </h3>
                    <Badge variant="secondary">
                      {summary.totalStudies} {summary.totalStudies === 1 ? 'Study' : 'Studies'}
                    </Badge>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Work Package Code</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Study Code</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">CSR Published Actual</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.caseStudies.map((study, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-sm text-gray-900">{study.workPackageCode}</td>
                            <td className="py-2 px-3 text-sm text-gray-900">{study.studyCode}</td>
                            <td className="py-2 px-3 text-sm text-gray-900">{study.csrPublishedActual}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSummary;
