import { AnalysisResult } from '@/context/AnalysisContext';

const SKILL_KEYWORDS = [
  "react", "node", "node.js", "typescript", "javascript",
  "python", "java", "aws", "gcp", "azure",
  "docker", "kubernetes", "graphql",
  "sql", "nosql", "mongodb", "postgres", "mysql",
  "rest", "api", "microservices",
  "cicd", "ci/cd", "git", "agile", "scrum",
  "html", "css", "sass", "tailwind", "redux",
  "vue", "angular", "next.js", "express",
  "redis", "elasticsearch", "kafka",
  "machine learning", "ml", "ai", "data science",
  "testing", "jest", "cypress", "selenium"
];

function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  return SKILL_KEYWORDS.filter(skill => {
    // Handle special cases like "ci/cd" and "node.js"
    const searchTerm = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${searchTerm}\\b`, 'i');
    return regex.test(lowerText);
  });
}

export function analyzeMatch(jdText: string, resumeText: string): AnalysisResult {
  const jdSkills = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);
  
  const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
  const extraSkills = resumeSkills.filter(skill => !jdSkills.includes(skill));
  
  // Calculate coverage
  const coverage = jdSkills.length ? matchedSkills.length / jdSkills.length : 0;
  
  // Calculate score
  const score = Math.min(
    100,
    Math.round(70 * coverage + 30 * (extraSkills.length / (jdSkills.length + 4 || 4)))
  );
  
  // Determine classification
  let label: AnalysisResult['label'];
  if (score >= 80) {
    label = "Strong Recommend";
  } else if (score >= 60) {
    label = "Consider";
  } else if (score >= 40) {
    label = "Weak Fit";
  } else {
    label = "Not Recommended";
  }
  
  // Generate summary
  let summary: string;
  const matchPercent = Math.round(coverage * 100);
  
  if (label === "Strong Recommend") {
    summary = `This candidate demonstrates excellent alignment with ${matchPercent}% of required skills. They bring additional expertise in ${extraSkills.slice(0, 3).join(', ') || 'related areas'} that could add value to the team.`;
  } else if (label === "Consider") {
    summary = `The candidate shows good potential with ${matchPercent}% skill match. While there are some gaps in ${missingSkills.slice(0, 2).join(' and ') || 'a few areas'}, their background suggests they could grow into the role.`;
  } else if (label === "Weak Fit") {
    summary = `This candidate has partial alignment (${matchPercent}% match) with the job requirements. Key gaps include ${missingSkills.slice(0, 3).join(', ')}. Consider only if other candidates are unavailable.`;
  } else {
    summary = `The candidate's profile shows limited alignment (${matchPercent}% match) with the core requirements. Major skill gaps in ${missingSkills.slice(0, 3).join(', ') || 'essential areas'} would require significant training.`;
  }
  
  return {
    score,
    label,
    matchedSkills,
    missingSkills,
    extraSkills,
    summary
  };
}
