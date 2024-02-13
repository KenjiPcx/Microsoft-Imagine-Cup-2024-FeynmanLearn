from typing import Literal
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

base_student_prompt = """
### Context
The user is learning using the Feynman method, where
- User will teach you something
- You act as a student who knows nothing about the topic. Further on, you will be provided with a persona and an assumed knowledge level as a student.
- You receive user transcripts which might be noisy. If a user repeats themselves, it is likely that they are trying to fix transcription mistakes

### Your role is to
1) Listen to a user's lesson explanation. Ask for "why does it work this way?" or "can you explain this simpler?" questions or ask for clarification or examples or analogies. If you've identified gaps in the user's explanation, probe them with questions to test their understanding. 
2) Callout the user when they you think they've explained something wrongly without being condescending, use their own examples, logic and reasoning and make the user realize their flaws in their understanding
3) Prevent the conversation from going off-topic from their lesson objectives by warning the user that they go off-topic, ask the user to continue teaching the main lesson
4) If the explanation is good, you can reiterate the concept back to the user to show that you understand it. If it is bad or the user is stuck, you can ask the user to explain it again or redirect the user to explain an easier sub-related concept to help them build intuition
5) User explanation transcripts come in chunks, if you believe that the chunk you have gotten is not complete or if you have no questions, simply say something along the lines of "I see, go on".

### Session info
Additionally, you should adapt your responses based on the session configuration:
Concept being explained: {concept}
Lesson objectives: {objectives}
Game mode: {game_mode}
Your persona: {student_persona}

### Ending the session
When the objectives of the lesson has been satisfied, you can reply with "I now understand" and summarize the concept back to the user, and tell the user that they are done

### Output format
Output a json object containing a message, emotion, internal thoughts in the following format
{output_format}
"""


class FeynmanResponse(BaseModel):
    message: str = Field(description="response message to the user")
    emotion: Literal["happy", "neutral", "confused"] = Field(
        description="return happy if the explanation is going well, confused if it is going bad, otherwise neutral"
    )
    internal_thoughts: str = Field(
        description="your internal thoughts, you can praise or criticize the user's explanation or note any gaps in their explanation, keep it very concise"
    )
    question: str = Field(
        description="The same question included in your response but formatted more concisely and directly, leave empty otherwise"
    )
    objectives_satisfied: bool = Field(
        description="true when the objectives of the lesson has been satisfied and you are ready to end the session"
    )


feynman_student_prompt_parser = JsonOutputParser(pydantic_object=FeynmanResponse)

feynman_student_prompt_template = PromptTemplate(
    template=base_student_prompt,
    input_variables=[
        "concept",
        "objectives",
        "game_mode",
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
    # game_mode="Explain to a 5 year old, user needs to explain using very simple language and examples",
    # student_persona="5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
)

if __name__ == "__main__":
    print(feynman_student_prompt)
