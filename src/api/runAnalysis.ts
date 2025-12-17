// src/api/runAnalysis.ts
export type AnalysisResult = {
  score: number;
  label: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  moveForward?: boolean;
};

const N8N_URL = "https://yash-rathi.app.n8n.cloud/webhook/recruit-ai-analyze";

export async function runAnalysis(params: {
  jobDescription: string;
  resumeText: string;
  candidateName?: string;
  candidateEmail?: string;
  recruiterEmail?: string;
  roleTitle?: string;
}): Promise<AnalysisResult> {
  const response = await fetch(N8N_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n error ${response.status}: ${text}`);
  }

  const data = await response.json();
  // n8n Respond node returns { success, analysisResult }
  return data.analysisResult as AnalysisResult;
}
