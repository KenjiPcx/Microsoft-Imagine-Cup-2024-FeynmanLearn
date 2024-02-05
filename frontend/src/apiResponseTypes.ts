export type LessonVerificationResponse = {
  passed_verification: boolean;
  feedback: string;
  suggestion: string;
};

export type CreateNewSessionResponse = {
  success: boolean;
  session_id?: string;
  error?: string;
};
