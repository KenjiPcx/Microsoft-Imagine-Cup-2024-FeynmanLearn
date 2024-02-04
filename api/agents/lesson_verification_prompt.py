from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

verify_lesson_base_prompt = """
Concept to explain: {concept}
Lesson objectives: {objectives}

Assess if the provided lesson objectives for the concept above are scoped specifically and narrowly enough to be covered in a 15-minute session and can be done fully through speech explanations alone. 

Reject the objectives if:
1. There are too many goals to be covered within 15 minutes.
2. Goals are not specific enough to form a clear, focused lesson plan.
3. Explanation really requires visual aids, only speech explanations are supported currently.

Feedback should be concise, include whether the objectives meet these criteria and concise suggestions for refinement.

Example 1 (Too Many Goals):
Concept: Mathematics - Basic Algebra
Lesson Objectives: Introduce variables, solving linear equations, quadratic equations, graphing functions, and polynomials.
feedback: Too many objectives
suggestion: Consider focusing on one topic, such as "solving linear equations."

Example 2 (Goals Not Specific Enough):
Concept: Mathematics - Geometry
Lesson Objectives: Understand shapes and their properties
feedback: Objectives are too vague
suggestion: A more specific objective could be "Identify and compare properties of 2D shapes, ie triangles and rectangles."

Output Format:
{format_instructions}
"""


class ConceptVerificationResponse(BaseModel):
    feasible: bool = Field(
        description="whether the concept and objectives are feasible to teach within the timeframe"
    )
    feedback: str = Field(
        description="concise reason for failure, leave empty if feasible"
    )
    suggestion: str = Field(
        description="concise suggestions for improvement, leave empty if feasible"
    )


verify_lesson_parser = PydanticOutputParser(pydantic_object=ConceptVerificationResponse)

verify_lesson_prompt_template = PromptTemplate(
    template=verify_lesson_base_prompt,
    input_variables=["concept", "objectives"],
    partial_variables={
        "format_instructions": verify_lesson_parser.get_format_instructions()
    },
)
verify_lesson_prompt = verify_lesson_prompt_template.format(
    concept="Quantum Mechanics",
    objectives="Students will understand the basic principles of quantum mechanics and be able to apply them to solve simple problems.",
    format_instructions=verify_lesson_parser.get_format_instructions(),
)

if __name__ == "__main__":
    print(verify_lesson_prompt)
