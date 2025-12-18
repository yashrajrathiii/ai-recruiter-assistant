import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import { runAnalysis } from '@/api/runAnalysis';
import { useToast } from '@/hooks/use-toast';

const SAMPLE_JD = `We are looking for a Senior Full Stack Developer with expertise in:

- React and TypeScript for frontend development
- Node.js and Express for backend APIs
- PostgreSQL and MongoDB for database management
- AWS or GCP cloud services
- Docker and Kubernetes for containerization
- CI/CD pipelines and Git workflows
- REST and GraphQL APIs
- Agile/Scrum methodologies

5+ years of experience required.`;

// PDF extraction helper - uses dynamic import to avoid build issues
async function extractPdfText(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      textParts.push(pageText);
    }
    
    return textParts.join('\n\n');
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Could not read PDF. Please try another file.');
  }
}

const InputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jdText, setJdText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errors, setErrors] = useState<{ jd?: string; resume?: string }>({});

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setExtractionError('Please upload a PDF file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setExtractionError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setExtractionError('');
    setIsExtracting(true);
    setResumeText('');

    try {
      const text = await extractPdfText(selectedFile);
      setResumeText(text);
      setErrors((prev) => ({ ...prev, resume: undefined }));
    } catch (error) {
      setExtractionError(error instanceof Error ? error.message : 'Failed to extract text from PDF');
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        const fakeEvent = {
          target: { files: [droppedFile] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange]
  );

  const handleAnalyze = async () => {
    const newErrors: { jd?: string; resume?: string } = {};

    if (!jdText.trim()) {
      newErrors.jd = 'Please enter a job description';
    }
    if (!resumeText) {
      newErrors.resume = 'Please upload a resume PDF';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsAnalyzing(true);
    setErrors({});

    try {
      const analysisResult = await runAnalysis({
        jobDescription: jdText,
        resumeText,
      });
      
      navigate('/decision', {
        state: { analysisResult },
      });
    } catch (error) {
      toast({
        title: 'Analysis Error',
        description: error instanceof Error ? error.message : 'Something went wrong during analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isButtonDisabled = !jdText.trim() || !resumeText || isExtracting || isAnalyzing;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 animate-fade-in">
            Screen Candidates in Minutes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Upload a job description and a resume. Our AI analyzes the match and provides actionable hiring recommendations.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="card-elevated p-6 md:p-8">
            <div className="space-y-6">
              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="jd" className="text-base font-semibold">
                  Job Description
                </Label>
                <Textarea
                  id="jd"
                  placeholder={SAMPLE_JD}
                  value={jdText}
                  onChange={(e) => {
                    setJdText(e.target.value);
                    if (errors.jd) setErrors((prev) => ({ ...prev, jd: undefined }));
                  }}
                  className="min-h-[180px] resize-none text-sm"
                />
                {errors.jd && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.jd}
                  </p>
                )}
              </div>

              {/* Resume Upload */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Resume (PDF)</Label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                    hover:border-primary/50 hover:bg-primary/5
                    ${file && resumeText ? 'border-success bg-success/5' : 'border-border'}
                    ${extractionError ? 'border-destructive bg-destructive/5' : ''}
                  `}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    disabled={isExtracting}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer block">
                    {isExtracting ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-muted-foreground">Extracting text...</p>
                      </div>
                    ) : file && resumeText ? (
                      <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-success">Text extracted ✓</p>
                        </div>
                      </div>
                    ) : extractionError ? (
                      <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-10 h-10 text-destructive" />
                        <p className="text-destructive">{extractionError}</p>
                        <p className="text-sm text-muted-foreground">Click to try again</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-muted-foreground">PDF only · Max 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {errors.resume && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.resume}
                  </p>
                )}
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isButtonDisabled}
                className="w-full h-12 text-base font-semibold shadow-elevated hover:shadow-card-hover transition-all"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Candidate with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <FileText className="w-4 h-4 inline-block mr-1" />
            Analysis is powered by AI via n8n webhook.
          </p>
        </div>
      </section>
    </div>
  );
};

export default InputPage;
