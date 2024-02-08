import { AnalysisByQuestion } from "./sessionAnalysisService";

export const capitalizeFirstLetterForFeedback = (string) => {
  return string
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

type ScoreDetail = {
  score_type: string;
  score: string;
  explanation: string;
};

export function transformQuestionAnalysis(
  response: AnalysisByQuestion
): ScoreDetail[] {
  const scoreTypes = [
    "clarity",
    "conciseness",
    "comprehensiveness",
    "correctness",
    "exemplification",
    "adaptation",
  ];

  return scoreTypes.map((score_type) => {
    return {
      score_type: score_type,
      score: String(
        response[`${score_type}_score` as keyof AnalysisByQuestion]
      ),
      explanation: String(
        response[`${score_type}_explanation` as keyof AnalysisByQuestion]
      ),
    };
  });
}
