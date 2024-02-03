from typing import Literal
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

base_prompt = """
Can you create an image to illustrate a student having the following persona: {student_persona}, while teaching: {concept}
"""

prompt_template = PromptTemplate.from_template(base_prompt)
prompt = prompt_template.format(
    concept="Quantum Mechanics",
    game_mode="Explain to a 5 year old, user needs to explain using very simple language and examples",
    depth="beginner - just ask really basic information",
    student_persona="5 year old, you don't know a lot of things, if the user mentions something a 5 year old wouldn't know, you ask them to explain again in the words of a 5 year old",
)

if __name__ == "__main__":
    print(prompt)
