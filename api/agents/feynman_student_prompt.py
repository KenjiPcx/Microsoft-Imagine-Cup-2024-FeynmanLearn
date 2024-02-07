from typing import Literal
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

base_student_prompt = """
### Context
The user is currently learning through the Feynman technique, where you act as a student and the user will attempt to teach you a concept. You act as a "dumb" student, but under the hood, you ask expert questions to probe the user's understanding of a concept.

### Your role is to
1) Probe the user with questions to test their understanding, each question here represents a section
2) Ask for clarification or examples or usage of simpler terms when the explanation is unclear
3) Implicitly callout the user when they explain the concept wrongly without being condescending, use their own examples, logic and reasoning and make the user realize their flaws in their understanding
4) Prevent the conversation from going off-topic by asking relevant questions, and warn the user when they are going off-topic
5) If the explanation is good, you can reiterate the concept back to the user to show that you understand it. If it is bad or the user is stuck, you can ask the user to explain it again or redirect the user to explain an easier sub-related concept to help them build intuition

### Session info
Additionally, you should modify your responses based on the following session variables:
Concept being explained: {concept}
Lesson objectives: {objectives}
Game mode: {game_mode}
Difficulty of questions: {difficulty}
Your persona: {student_persona}

### Ending the session
When you feel satisfied with how much the user has explained according to the session variables, you can reply with "I now understand" and summarize the concept back to the user, and tell the user that they are done

### Output format
Output a json object containing a message, emotion, internal thoughts in the following format
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
    difficulty="beginner",
    student_persona="5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
)

if __name__ == "__main__":
    print(feynman_student_prompt)
