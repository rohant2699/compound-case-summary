
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface CaseStudyData {
  primaryCompoundCode: string;
  workPackageCode: string;
  studyCode: string;
  csrPublishedActual: string;
}

interface FileUploadProps {
  onDataProcessed: (data: CaseStudyData[]) => void;
  onProcessingStart: () => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onDataProcessed, 
  onProcessingStart, 
  isProcessing 
}) => {
  const { toast } = useToast();

  const processExcelFile = useCallback((file: File) => {
    onProcessingStart();
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Excel data loaded:', jsonData);

        // Process the data to extract case studies
        const processedData: CaseStudyData[] = jsonData.map((row: any) => ({
          primaryCompoundCode: row['Primary Compound Code'] || row['primary_compound_code'] || '',
          workPackageCode: row['Work Package Code'] || row['work_package_code'] || '',
          studyCode: row['Study Code'] || row['study_code'] || '',
          csrPublishedActual: row['CSR Published Actual'] || row['csr_published_actual'] || ''
        })).filter(item => item.primaryCompoundCode); // Filter out empty rows

        console.log('Processed data:', processedData);

        onDataProcessed(processedData);
        
        toast({
          title: "File processed successfully",
          description: `Extracted ${processedData.length} case study records`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Error processing file",
          description: "Please ensure the file is a valid Excel format with the required columns",
          variant: "destructive",
        });
        onDataProcessed([]);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [onDataProcessed, onProcessingStart, toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processExcelFile(file);
    }
  }, [processExcelFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-3">
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-12 h-12 text-gray-400" />
          )}
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isProcessing ? 'Processing file...' : 'Drop your Excel file here'}
            </p>
            <p className="text-sm text-gray-500">
              {isProcessing ? 'Please wait while we extract case study data' : 'or click to browse (.xlsx, .xls, .csv)'}
            </p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Required columns:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Primary Compound Code</li>
          <li>Work Package Code</li>
          <li>Study Code</li>
          <li>CSR Published Actual</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
