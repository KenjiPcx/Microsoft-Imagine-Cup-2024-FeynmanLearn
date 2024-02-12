from typing import Literal
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

base_student_prompt = """
### Context
The user is learning using the Feynman method, where
- User will teach you something
- You act as a student who knows nothing about the topic. Further on, you will be provided with a persona and an assumed knowledge level as a student.

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


analyze_transcripts_base_prompt = """
The following is a transcript of a user using the Feynman method to explain a concept to a student. Your task is to analyze the transcript and output the following:
1. A short paragraph general assessment of the user's explanation
2. A sentence to summarize the user's performance
3. Knowledge gaps in the user's explanation, if any.
4. Constructive feedback on how the explanation could be improved.
5. Similar relevant topics for lessons the user can focus on next
6. Simpler subtopics for building stronger intuition
7. A prompt for a personalized 16:9 wallpaper image representing how the lesson went. For example, if I was explaining "Diffusion models" and the lesson went well, the prompt would be "An 16:9 majestic wallpaper image of a water droplet diffusing in a liquid." Make the prompts more creative the better the explanation was.

Follow these instructions to reach your final output
1. Identify if there is anything wrongly explained in the lesson
2. Identify if the user managed to reach the lesson objectives or get carried away with irrelevant information
2. Identify if there are any knowledge gaps in the user's explanation
3. Identify the top 3 things that went well in the explanations, such as being clear and concise, using examples, analogies, simple language, adapting lesson to fit the student's knowledge level etc.
4. Identify what didn't go well in the explanations, such as being unclear, using jargon, being too complex, not adapting lesson to fit the student's knowledge level etc.
5. Identify the most memorable thing about the explanation, this will be used to customize the image prompt
6. Finalize output

### Lesson details
Concept being explained: {concept}
Lesson objectives: {objectives}
Student persona: {student_persona}

<Transcripts of the lesson>
For the student's response, their emotion is also recorded, happy if the explanation is going well, confused if it is not, neutral otherwise.
{transcripts}
<End of transcripts>

Output Format:
Return a json object, the thought_process item should be the first item in the object
{format_instructions}
"""


class AnalyzeTranscriptsResponse(BaseModel):
    thought_process: str = Field(
        description="your thought process on coming up with the assessment following the instructions"
    )
    general_assessment: str = Field(
        description="general assessment of the user's performance in their explanation"
    )
    general_assessment_summary: str = Field(
        description="sentence to summarize the user's performance"
    )
    knowledge_gaps: List[str] = Field(
        description="knowledge gaps relevant to the concept being explained, not the user's explanation skills"
    )
    constructive_feedback: str = Field(
        description="constructive feedback on what could be improved"
    )
    easier_topics: List[str] = Field(
        description="list of 5 easier and relevant topics under the concept being explained to explain"
    )
    similar_topics: List[str] = Field(description="list of 5 similar topics to explain")
    image_prompt: str = Field(
        description="prompt for a personalized 16:9 wallpaper image representing how the lesson went"
    )
    objective_reached: bool = Field(
        description="whether the user managed to reach the lesson objectives"
    )


analyze_transcripts_parser = PydanticOutputParser(
    pydantic_object=AnalyzeTranscriptsResponse
)

analyze_transcripts_prompt_template = PromptTemplate(
    template=analyze_transcripts_base_prompt,
    input_variables=["concept", "objectives", "student_persona", "transcripts"],
    partial_variables={
        "format_instructions": analyze_transcripts_parser.get_format_instructions()
    },
)

if __name__ == "__main__":
    print(feynman_student_prompt)
