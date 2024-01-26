// Here is where we configure a session
// 1. Select content to teach
// 2. Select game mode, student configs
// 3. Launch session
// 4. Redirect back new session id to /sessions/:id
//<li>We could have a input src concept to explain button</li>
// <li>We could have some common agent configs</li>

import React, { useRef, useState } from "react";
import { FileRoute, Link } from "@tanstack/react-router";
import {
  Stepper,
  Button,
  Group,
  Fieldset,
  TextInput,
  Textarea,
  Select,
  Code,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export const Route = new FileRoute("/sessions/new").createRoute({
  component: NewSessionConfigurationComponent,
});

export type AgentSessionConfig = {
  gameMode: string;
  depth: string;
  persona: string;
};

export type NewSessionConfigurationForm = {
  conceptToExplain: string;
  additionalInformation: string;
  referenceUrl: string;
  referenceType: "Article" | "Video" | "PDF" | "";
  //   customDataFiles: File[]; // Will try for now but I guess we can handle this in the future
  agentConfig: AgentSessionConfig;
};

function NewSessionConfigurationComponent() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm<NewSessionConfigurationForm>({
    initialValues: {
      conceptToExplain: "",
      additionalInformation: "",
      referenceUrl: "",
      referenceType: "",
      //   customDataFiles: [],
      agentConfig: {
        gameMode: "",
        depth: "",
        persona: "",
      },
    },

    validate: (values) => {
      if (active === 0) {
        return {
          conceptToExplain:
            values.conceptToExplain === ""
              ? "Concept to explain is required"
              : null,
        };
      }

      return {};
    },
  });

  return (
    <>
      <div>
        <li>
          We can provide a piece of text describing the concept (simple copy
          paste), an article url, video url, or a pdf link here
        </li>
        <li>
          This info will be used to form a high level plan to guide the session
        </li>
        <li>Files can be attached to the agent's memory</li>
        <br></br>
      </div>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step
          label="First step"
          description="Select a topic"
          disabled={active === 3}
        >
          <Fieldset legend="Session configuration">
            <TextInput
              label="Concept to explain"
              description="The concept you want to teach in this session"
              placeholder="The Feynman method"
              required
              {...form.getInputProps("conceptToExplain")}
            />
            <br />
            <Textarea
              label="Additional information on concept"
              description="Optional additional information on what exactly you want to teach, useful to define for broad and abstract concepts"
              placeholder="I want to explain specifically how the Feynman method can be used to learn new concepts"
              {...form.getInputProps("additionalInformation")}
            />
            <br />
            <Group justify="space-between">
              <TextInput
                label="Online references"
                description="Provide a link to an online resources that explain the concept, useful if concept is very niche, new or not well known"
                placeholder="https://en.wikipedia.org/wiki/Feynman_technique"
                {...form.getInputProps("referenceUrl")}
              />
              <Select
                label="Reference type"
                description="Format of the online reference"
                placeholder="Article"
                data={["Article", "Video", "PDF"]}
                {...form.getInputProps("referenceType")}
              />
            </Group>
          </Fieldset>
        </Stepper.Step>

        <Stepper.Step
          label="Second step"
          description="Configure learner agent"
          disabled={active === 3}
        >
          Step 2 content: Select agent configuration
          <div>
            We should just hardcode some modes, then let user customize or
            overrride them below these prebuilt modes
          </div>
          <div>
            In the future, we can aim to have a grid of prebuilt modes, then we
            can browse for personas and select them
          </div>
          <Fieldset legend="Learner agent configuration">
            <Select
              label="Explanation depth"
              description="How deep you are expected to explain the concept"
              placeholder="Select explanation depth"
              data={[
                "Beginner (Awareness) - Understands and communicates basic definitions and core principles. Answers straightforward questions and applies the concept in familiar contexts.",
                "Intermediate (Application) - Explains how the concept works and applies it in problem-solving. Handles moderately challenging questions and connects different parts of the concept.",
                "Advanced (Analysis) - Discusses subtle or complex aspects. Analyzes, critiques, and draws connections to other concepts. Answers complex questions with detailed explanation.",
                "Expert (Mastery) - Possesses comprehensive knowledge. Teaches, debates, and creates new insights. Handles any question with in-depth, nuanced explanations and diverse examples.",
              ]}
              required
              {...form.getInputProps("agentConfig.depth")}
            />
            <br />
            <Textarea
              label="Learner persona"
              description="The personality of the learner agent"
              placeholder="Richard Feynman (Theoretical physicist) - Will jump straight for deep end questions, playfully pokes holes in arguments, always hunting for the 'why' behind the 'what.'"
              {...form.getInputProps("agentConfig.persona")}
            />
            <br />
            <Textarea
              label="Game mode"
              description="Some fun challenges to make the session more engaging"
              placeholder="Must provide an analogy as an explanation for each question asked by the learner agent"
              {...form.getInputProps("agentConfig.gameMode")}
            />
          </Fieldset>
        </Stepper.Step>

        <Stepper.Step
          label="Final step"
          description="Review"
          disabled={active === 3}
        >
          Step 3 content: Confirm and start
        </Stepper.Step>
        <Stepper.Completed>
          Redirecting Completed! Form values:
          <Code block mt="xl">
            {JSON.stringify(form.values, null, 2)}
          </Code>
        </Stepper.Completed>
      </Stepper>

      {active < 3 && (
        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>
            {active >= 2 ? "Confirm" : "Next step"}
          </Button>
        </Group>
      )}
    </>
  );
}
