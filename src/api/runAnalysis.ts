// src/api/runAnalysis.ts
export type AnalysisResult = {
  candidateName: string;
  roleTitle: string;
  score: number;
  label: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
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
  try {
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
    
    // Handle webhook response - arrays are converted to strings
    return {
      candidateName: Array.isArray(data.candidateName) ? data.candidateName[0] : data.candidateName || '',
      roleTitle: Array.isArray(data.roleTitle) ? data.roleTitle[0] : data.roleTitle || '',
      score: data.score,
      label: data.label,
      summary: data.summary,
      matchedSkills: data.matchedSkills || [],
      missingSkills: data.missingSkills || [],
      extraSkills: data.extraSkills || [],
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to reach n8n webhook. Please ensure CORS is enabled on your n8n webhook and the workflow is active.');
    }
    throw error;
  }
}
