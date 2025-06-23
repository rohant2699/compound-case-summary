
import React, { useState } from 'react';
import { Upload, FileText, Database, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/FileUpload';
import DataSummary from '@/components/DataSummary';
import DocumentStatus from '@/components/DocumentStatus';

interface CaseStudyData {
  primaryCompoundCode: string;
  workPackageCode: string;
  studyCode: string;
  csrPublishedActual: string;
}

const Index = () => {
  const [uploadedData, setUploadedData] = useState<CaseStudyData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDataProcessed = (data: CaseStudyData[]) => {
    setUploadedData(data);
    setIsProcessing(false);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Medical Document Management System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your Book of Work to extract and summarize case study information for PSUR, DSUR, and IB document updates
          </p>
        </div>

        {/* Document Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <DocumentStatus 
            title="PSUR" 
            description="Periodic Safety Update Report"
            icon={<FileText className="w-6 h-6" />}
            status="pending"
          />
          <DocumentStatus 
            title="DSUR" 
            description="Development Safety Update Report"
            icon={<Database className="w-6 h-6" />}
            status="pending"
          />
          <DocumentStatus 
            title="IB" 
            description="Investigator's Brochure"
            icon={<Activity className="w-6 h-6" />}
            status="pending"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Upload Book of Work
                </CardTitle>
                <CardDescription>
                  Upload your Excel file containing case study data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onDataProcessed={handleDataProcessed}
                  onProcessingStart={handleProcessingStart}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          </div>

          {/* Data Summary Section */}
          <div className="lg:col-span-2">
            <DataSummary 
              data={uploadedData}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
