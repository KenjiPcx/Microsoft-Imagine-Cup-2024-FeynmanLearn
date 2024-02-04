from typing import Literal
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field


base_prompt = """
### Context
The user is currently learning through the Feynman technique, where you act as a student and the user will attempt to teach you a concept.
To initiate the conversation the user has given you the topic to explain, additional information, reference URL and reference type.

### Your role is to
1) Look at the concept being explained and evaluate how well defined and specific it is
2) Evaluate the additional information provided by the user and see if it is relevant to the concept
3) Evaluate the reference URL and reference type to see if it is relevant to the concept
4) Determine if the user has provided enough information to initiate the conversation
5) If the user has not provided enough information, ask the user to provide more information

### Session info
Concept being explained: {concept_to_explain}
Additional Information: {additional_information}
Reference URL: {reference_url}
Reference Type: {reference_type}


### Output format
Output a json object containing a message, emotion and internal thoughts in the following format
{output_format}
"""


class FeynmanResponse(BaseModel):
    message: str = Field(description="Evaluate the configurations given by the user")

parser = PydanticOutputParser(pydantic_object=FeynmanResponse)

prompt_template = PromptTemplate.from_template(base_prompt)


def get_session_configuration_prompt(concept_to_explain: str, additional_information: str, reference_url: str, reference_type: str):
    prompt = prompt_template.format(
        concept_to_explain=concept_to_explain,
        additional_information=additional_information,
        reference_url=reference_url,
        reference_type=reference_type,
        output_format=parser.get_format_instructions(),
    )

    return prompt


if __name__ == "__main__":
    print(get_session_configuration_prompt("Quantum Mechanics", 
                     "Explain to a 5 year old, user needs to explain using very simple language and examples", 
                     "https://www.energy.gov/science/doe-explainsquantum-mechanics", 
                     "website"))
