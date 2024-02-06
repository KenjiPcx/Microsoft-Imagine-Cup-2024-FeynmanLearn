# Library for storing global constants

from langchain.output_parsers import ResponseSchema

# Marking rubric for a learner's explanation
MARKING_RUBRIC = """
Clarity (Understanding and simplicity of language)
1: The explanation is confusing, uses complex or technical language excessively, and lacks a logical flow.
2: The explanation has moments of clarity but is often difficult to follow, with some use of technical language that is not well-explained.
3: The explanation is clear for the most part, with a reasonable use of simple language and logical flow, though minor areas may benefit from simplification.
4: The explanation is very clear, with a logical flow and occasional use of technical language that is well-explained. Minor improvements could be made for simplicity.
5: The explanation is exceptionally clear, uses simple and accessible language throughout, and follows a logical and intuitive flow, making the concept easy to understand for all audiences.
Conciseness (Brevity and efficiency of language)
1: The explanation is overly lengthy and filled with unnecessary details or repetition.
2: The explanation is longer than necessary with some repetition, but key points are identifiable.
3: The explanation is moderately concise, with a good balance between detail and brevity, though some sections could be more streamlined.
4: The explanation is concise, with information presented efficiently. Minor areas could be condensed further without losing clarity.
5: The explanation is exceptionally concise, delivering all necessary information in the most efficient manner possible without any unnecessary detail or repetition.
Comprehensiveness (Coverage of key aspects and concepts)
1: The explanation misses several key aspects of the concept, leaving significant gaps in understanding.
2: The explanation covers some aspects of the concept but omits important details or considerations.
3: The explanation covers most key aspects, though it could provide more examples or details for a fuller understanding.
4: The explanation is comprehensive, covering all key aspects and including relevant examples. Minor details may be omitted but do not significantly impact understanding.
5: The explanation is exceptionally comprehensive, thoroughly covering all aspects of the concept, including examples and addressing potential questions or misunderstandings.
Correctness (Accuracy of information)
1: The explanation contains multiple inaccuracies or misconceptions that significantly misrepresent the concept.
2: The explanation has some inaccuracies or oversimplifications that affect the overall understanding of the concept.
3: The explanation is mostly accurate, with minor errors or simplifications that do not significantly impact the overall understanding.
4: The explanation is accurate, with all key aspects correctly explained. There might be extremely minor inaccuracies that do not detract from the overall understanding.
5: The explanation is exceptionally accurate, with all information presented correctly and precisely, reflecting a deep understanding of the concept.
Exemplification (Use and Quality of Examples)
1: The explanation lacks examples, or the examples provided are irrelevant or do not effectively illustrate the concept.
2: The explanation includes examples, but they are minimally effective, only partially relevant, or not well-integrated into the explanation.
3: The explanation includes a reasonable number of relevant examples that contribute to understanding, though some may lack clarity or full integration with the concept.
4: The explanation uses several well-chosen examples that are relevant and effectively integrated into the explanation, enhancing understanding.
5: The explanation excels in using a variety of highly relevant, clear, and well-integrated examples that significantly enhance comprehension and engagement.
Audience (Adaptation to audience's Level)
1: The explanation does not consider the audience's level of understanding; it is either too simplistic for advanced audiences or too complex for beginners.
2: The explanation shows minimal effort to adapt to the audience's level, with occasional adjustments that do not significantly aid comprehension.
3: The explanation is moderately adapted to the audience's level, with a balance of complexity and simplicity that suits an intermediate audience but may not fully cater to beginners or advanced audiences.
4: The explanation shows a good effort to adapt to the audience's level, using appropriate terminology and complexity for the intended audience, though minor improvements could be made for better accessibility or depth.
5: The explanation is exceptionally well-adapted to the audience's level, using language and concepts tailored to the audience's understanding, making it accessible and engaging for audiences at any level.
"""

QUESTION_RESPONSE_SCHEMA = [
    ResponseSchema(name="clarity_score", description="score of clarity of learner's explanation"),
    ResponseSchema(name="clarity_explanation", description="explanation of clarity score given"),
    ResponseSchema(name="conciseness_score", description="score of conciseness of learner's explanation"),
    ResponseSchema(name="conciseness_explanation", description="explanation of conciseness score given"),
    ResponseSchema(name="comprehensiveness_score", description="score of comprehensiveness of learner's explanation"),
    ResponseSchema(name="comprehensiveness_explanation", description="explanation of comprehensiveness score given"),
    ResponseSchema(name="correctness_score", description="score of correctness of learner's explanation"),
    ResponseSchema(name="correctness_explanation", description="explanation of correctness score given"),
    ResponseSchema(name="exemplification_score", description="score of learner's examples in their explanation"),
    ResponseSchema(name="exemplification_explanation", description="explanation on exemplification score given"),
    ResponseSchema(name="adaptation_score", description="score of how well learner adapts explanation"),
    ResponseSchema(name="adaptation_explanation", description="explanation of adaptation score given"),
]

POST_ANALYSIS_SCORE_TYPE = [
    "clarity_score",
    "conciseness_score",
    "comprehensiveness_score",
    "correctness_score",
    "exemplification_score",
    "adaptation_score"
]

POST_SESSION_ANALYSIS_SCHEMA = [
    ResponseSchema(name="overall_comment", description="overall comment across all questions"),
    ResponseSchema(name="strengths", description="areas where the user has excelled"),
    ResponseSchema(name="room_for_improvement", description="aresas the user can improve on"),
    ResponseSchema(name="suggestions_for_improvement", description="suggestions to user on how to improve on explaining the concept"),
]