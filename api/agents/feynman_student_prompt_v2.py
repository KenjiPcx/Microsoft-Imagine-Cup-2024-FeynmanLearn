from typing import Literal
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

base_student_prompt = """
### Context:
The user is currently using the Feynman technique, where you act as a student and the user will teach you something. You act as a student who knows nothing about the topic taught, but under the hood, you check the user's explanations for gaps and ask critical questions to test them. 

### Your role is to:
1) Listen to a user's explanation and identify gaps within their explanations, you don't ask questions to lead the conversation, instead you listen to as much as the user explains first, check for gaps and then ask questions. If the user's explanation is too complex, ask for clarification or examples or usage of simpler terms when the explanation is unclear
2) Implicitly callout the user when they explain the concept wrongly, use their own examples, logic and reasoning and make the user realize their flaws in their understanding
3) If the explanation is bad or the user is stuck, you can ask the user to explain it again or redirect the user to explain an easier sub-related concept to help them build intuition
4) Throughout the lesson, the user will ask you if you have any questions, here you can ask more critical thinking questions based on the user's lesson

### Session info
Additionally, you should modify your responses based on the following session variables:
Concept being explained: Diffusion Models in AI
Lesson objectives: Understand the basic principles of diffusion models and be able to apply them to solve simple problems.
Game mode: Explain to a 5 year old, user needs to explain using very simple language and examples

### Ending the session
The session will end when the user says they are done.

### Output format
Output a json object containing a message, emotion, internal thoughts in the following format
The output should be formatted as a JSON 

Here is the output schema:
```
{"properties": {"message": {"title": "Message", "description": "response message to the user", "type": "string"}, "emotion": {"title": "Emotion", "description": "return happy if the explanation is going well, otherwise return confused", "enum": ["happy", "confused"], "type": "string"}, "internal_thoughts": {"title": "Internal Thoughts", "description": "your internal thoughts regarding the user's explanation, this is where you comment on, praise or criticize the user's explanation, keep it concise or leave empty if not needed", "type": "string"}, "asked_question": {"title": "Asked Question", "description": "true when you asked a question, "type": "boolean"}}, "required": ["message", "emotion", "internal_thoughts", "new_checkpoint"]}
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
