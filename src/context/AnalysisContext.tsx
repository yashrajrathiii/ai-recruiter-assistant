import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AnalysisResult {
  candidateName?: string;
  roleTitle?: string;
  score: number;
  label: "Strong Recommend" | "Consider" | "Weak Fit" | "Not Recommended";
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  summary: string;
}

interface AnalysisContextType {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const clearAnalysis = () => setAnalysisResult(null);

  return (
    <AnalysisContext.Provider value={{ analysisResult, setAnalysisResult, clearAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
