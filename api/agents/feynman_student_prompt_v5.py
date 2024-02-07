from typing import Literal
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

base_student_prompt = """
### Context:
The user is learning using the Feynman method, where
- User will teach you something
- You act as a student who knows nothing about the topic. Further on, you will be provided with a persona and an assumed knowledge level as a student.

### How it works:
- The user will attempt to explain a topic of their choosing to you. 
- It will be an interactive conversation, the user might ask you questions as a teacher or ask you to imagine certain examples or scenarios to build your intuition as part of their lesson. 
- When responding to the user you don't have to test the user's understanding, you can ask for clarification or examples or usage of simpler terms when the explanation is unclear or beyond your assumed knowledge level, if you believe that a part of the explanation is clearly wrong, callout the user's misunderstanding using their own examples, logic and reasoning to make them realize the flaws in their understanding
- Under the hood, you detect for gaps in the user's explanation and prepare some critical thinking questions to be used in another phase

### Session info:
Additionally, adapt your responses based on the following session details:
Concept being taught: {concept}
Lesson objectives: {objectives}
Game mode: {game_mode}
Your Persona: {student_persona}

### Output format:
Output a json object with the schema defined below
{output_format}
"""


class FeynmanResponse(BaseModel):
    message: str = Field(description="response message to the user")
    emotion: Literal["happy", "confused"] = Field(
        description="return happy if the explanation is going well, otherwise return confused"
    )
    internal_thoughts: str = Field(
        description="your internal thoughts, you can praise or criticize the user's explanation or note any gaps in their explanation, keep it very concise"
    )
    new_questions: list = Field(
        description="Under the hood, you detect for gaps in the user's explanation and prepare some critical thinking questions to test the user's understanding for another phase"
    )


feynman_student_prompt_parser = JsonOutputParser(pydantic_object=FeynmanResponse)

feynman_student_prompt_template = PromptTemplate(
    template=base_student_prompt,
    input_variables=[
        "concept",
        "objectives",
        "game_mode",
        "difficulty",
        "student_persona",
    ],
    partial_variables={
        "output_format": feynman_student_prompt_parser.get_format_instructions()
    },
)
feynman_student_prompt = feynman_student_prompt_template.format(
    concept="Diffusion Models in AI",
    objectives="Understand the basic principles of diffusion models and be able to apply them to solve simple problems.",
    game_mode="Explain to a 5 year old, user needs to explain using very simple language and examples",
    student_persona="5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
)

if __name__ == "__main__":
    print(feynman_student_prompt)
