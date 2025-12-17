import { AnalysisResult } from '@/context/AnalysisContext';
import SkillBadge from './SkillBadge';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-strong';
    if (score >= 60) return 'score-consider';
    if (score >= 40) return 'score-weak';
    return 'score-not-recommended';
  };

  const getLabelColor = (label: AnalysisResult['label']) => {
    switch (label) {
      case 'Strong Recommend':
        return 'bg-success/10 text-success border-success/30';
      case 'Consider':
        return 'bg-info/10 text-info border-info/30';
      case 'Weak Fit':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'Not Recommended':
        return 'bg-destructive/10 text-destructive border-destructive/30';
    }
  };

  return (
    <div className="card-elevated p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">Candidate Analysis</p>
          <div
            className={cn(
              'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border',
              getLabelColor(result.label)
            )}
          >
            {result.label}
          </div>
        </div>
        
        {/* Score Circle */}
        <div
          className={cn(
            'w-16 h-16 rounded-full flex flex-col items-center justify-center',
            getScoreColor(result.score)
          )}
        >
          <span className="text-xl font-bold">{result.score}</span>
          <span className="text-[10px] uppercase tracking-wider opacity-80">Score</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Analysis Summary</h3>
        <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
      </div>

      {/* Matched Skills */}
      {result.matchedSkills.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Matched Skills ({result.matchedSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="matched" />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-destructive"></span>
          Missing from Resume
        </h3>
        {result.missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {result.missingSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="missing" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No major gaps detected</p>
        )}
      </div>

      {/* Extra Skills */}
      {result.extraSkills.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-info"></span>
            Additional Skills ({result.extraSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.extraSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="extra" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
