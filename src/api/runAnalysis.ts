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

const N8N_URL = "https://yash-rathi.app.n8n.cloud/webhook-test/recruit-ai-analyze";

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
    
    // n8n returns [{ output: "JSON string" }] format
    let parsed = data;
    if (Array.isArray(data) && data[0]?.output) {
      parsed = JSON.parse(data[0].output);
    }
    
    // Handle webhook response - arrays are converted to strings
    return {
      candidateName: Array.isArray(parsed.candidateName) ? parsed.candidateName[0] : parsed.candidateName || '',
      roleTitle: Array.isArray(parsed.roleTitle) ? parsed.roleTitle[0] : parsed.roleTitle || '',
      score: parsed.score,
      label: parsed.label,
      summary: parsed.summary,
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
      extraSkills: parsed.extraSkills || [],
    };
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to reach n8n webhook. Please ensure CORS is enabled on your n8n webhook and the workflow is active.');
    }
    throw error;
  }
}
