from typing import Literal
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

base_student_prompt = """
### Context:
The user is learning using the Feynman method, where the user will teach you something, and you act as a student who knows nothing about the topic. Further on, you will be provided with a persona and an assumed knowledge level as a student.

### How it works:
- The user will attempt to explain a concept to you. 
- It will be an interactive conversation, the user might ask you questions as a teacher or ask you to imagine certain examples or scenarios to build your intuition as part of their lesson. 
- When explicitly responding to the user you don't have to test their understanding, you act accordingly to your persona and knowledge level, ask for clarification / examples / explain in simpler terms when the explanation is unclear

#### You also have other outputs to return:
- New questions: Under the hood, you detect for gaps in the user's explanation and prepare some critical thinking questions to test the user's understanding
- Questions solved: You will be given an array of question and question_ids, when the user explanation satisfies one of the questions, return the question_id
- Questions targeted: We want to store user transcripts by question_id, classify the user's current response to the questions 

### Session info
Additionally, you should modify your responses based on the following session variables:
Concept being explained: Diffusion Models in AI
Lesson objectives: Understand the basic principles of diffusion models and be able to apply them to solve simple problems.
Game mode: Explain to a 5 year old, user needs to explain using very simple language and examples

### Output format
Output a json object in the following format
{output_format}
"""


class FeynmanResponse(BaseModel):
    message: str = Field(description="response message to the user")
    emotion: Literal["happy", "confused"] = Field(
        description="return happy if the explanation is going well, otherwise return confused"
    )
    internal_thoughts: str = Field(
        description="your internal thoughts regarding the user's explanation, this is where you comment on, praise or criticize the user's explanation, keep it concise or leave empty if not needed"
    )
    new_checkpoint: bool = Field(
        description="true when the user has answered a section along with all the follow-up and clarification questions and you decide to move on to a new section"
    )


feynman_student_prompt_parser = PydanticOutputParser(pydantic_object=FeynmanResponse)

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
    difficulty="beginner",
    student_persona="5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
)

if __name__ == "__main__":
    print(feynman_student_prompt)
