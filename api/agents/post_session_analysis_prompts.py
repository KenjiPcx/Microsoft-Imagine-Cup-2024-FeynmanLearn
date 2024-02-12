from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

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
    general_assessment: str = Field(description="general assessment of the user's performance in their explanation")
    general_assessment_summary: str = Field(description="sentence to summarize the user's performance")
    knowledge_gaps: List[str] = Field(description="knowledge gaps relevant to the concept being explained, not the user's explanation skills")
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


analyze_transcripts_parser = PydanticOutputParser(pydantic_object=AnalyzeTranscriptsResponse)

analyze_transcripts_prompt_template = PromptTemplate(
    template=analyze_transcripts_base_prompt,
    input_variables=["concept", "objectives", "student_persona", "transcripts"],
    partial_variables={
        "format_instructions": analyze_transcripts_parser.get_format_instructions()
    },
)
analyze_transcripts_prompt = analyze_transcripts_prompt_template.format(
    concept="Quantum Mechanics",
    objectives="Students will understand the basic principles of quantum mechanics and be able to apply them to solve simple problems.",
    student_persona="5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
    transcripts="The user started by explaining the basic principles of quantum mechanics, then moved on to explaining how to apply them to solve simple problems. The user was clear and concise, using examples and simple language. The student was happy with the explanation.",
)

if __name__ == "__main__":
    print(analyze_transcripts_prompt)
