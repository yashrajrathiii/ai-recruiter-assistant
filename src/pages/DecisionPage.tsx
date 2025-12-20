import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UserCheck, UserX, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ResultCard from '@/components/ResultCard';
import type { AnalysisResult } from '@/api/runAnalysis';

type LocationState = {
  analysisResult: AnalysisResult;
};

const DecisionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [decision, setDecision] = useState<'forward' | 'reject' | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleMoveForward = () => {
    setDecision('forward');
  };

  const handleReject = () => {
    setDecision('reject');
  };

  // No analysis result - show empty state
  if (!state?.analysisResult) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center card-elevated p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Analysis Found</h2>
            <p className="text-muted-foreground mb-6">
              Please start from the input page to analyze a candidate.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to JD & Resume Input
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { analysisResult } = state;
  const { candidateName, roleTitle } = analysisResult;

  // Convert API result to match local AnalysisResult type for ResultCard
  const formattedResult = {
    score: analysisResult.score,
    label: analysisResult.label as "Strong Recommend" | "Consider" | "Weak Fit" | "Not Recommended",
    summary: analysisResult.summary,
    matchedSkills: analysisResult.matchedSkills,
    missingSkills: analysisResult.missingSkills,
    extraSkills: analysisResult.extraSkills || [],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Analyze another candidate
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              Step 2 of 2
            </span>
            <span>·</span>
            <span>HR Decision</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Recommendation for {candidateName || 'This Candidate'}
          </h1>
          {roleTitle && (
            <p className="text-muted-foreground mb-6">Role: {roleTitle}</p>
          )}

          {/* Result Card */}
          <ResultCard result={formattedResult} />

          {/* Decision Section */}
          <div className="mt-8">
            {decision ? (
              <div
                className={`card-elevated p-6 animate-fade-in ${
                  decision === 'forward' ? 'border-success/30' : 'border-destructive/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {decision === 'forward' ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Marked as Move Forward
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Great! You can now schedule interviews in your ATS. The candidate has
                          been flagged for the next step in your hiring pipeline.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Marked as Not Moving Forward
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          This candidate has been marked as rejected. The decision will be kept
                          in your audit trail for compliance purposes.
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" onClick={handleBack} className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Analyze Another Candidate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-foreground mb-4">HR Decision</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleMoveForward}
                    className="flex-1 h-12 text-base font-semibold"
                    size="lg"
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                    Move Forward with Candidate
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 h-12 text-base font-semibold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    size="lg"
                  >
                    <UserX className="w-5 h-5 mr-2" />
                    Reject Candidate
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionPage;
