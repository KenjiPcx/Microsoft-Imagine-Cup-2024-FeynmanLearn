import constants
from typing import Dict, List, Union

def get_overall_and_average_score_for_session(
        session_analysis: List[Dict[str, Union[int, str]]]
    ) -> Dict[str, float]:
    """Averages and aggregates scores across all questions.
    
    Parameters:
      - session_analysis: A list of dictionaries, each dictionary contain the scores for each question.
    
    Return:
      - scores: A dictionary containing the average and overall score.
    """
    # Initialise scores
    scores = {score_type: 0 for score_type in constants.POST_ANALYSIS_SCORE_TYPE}
    
    # Aggregate scores for each score type
    for question in session_analysis:
        for score_type in constants.POST_ANALYSIS_SCORE_TYPE:
            scores[score_type] += int(question[score_type])
    
    # Calculate average for each score type
    for score_type in scores:
        scores[score_type] = round(scores[score_type] / len(session_analysis), 1)
    
    # Calculate overall average score
    scores['overall_score'] = round(sum(scores.values()) / len(scores), 1)

    return scores
