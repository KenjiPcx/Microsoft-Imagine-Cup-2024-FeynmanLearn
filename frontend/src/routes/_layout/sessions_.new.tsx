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
  TextInput,
  Textarea,
  Select,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export const Route = new FileRoute("/_layout/sessions/new").createRoute({
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
    <Stack>
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
          <TextInput
            label="Concept to explain"
            description="Define the concept you want to teach in this session"
            placeholder="The Feynman method"
            required
            {...form.getInputProps("conceptToExplain")}
          />
          <br />
          <Textarea
            label="Lesson objective(s)"
            description="Define one or many detailed key objectives of your lesson, this helps you scope the lesson and keep it focused"
            placeholder="Student will understand specifically how the Feynman method can be used to learn new concepts, and what makes it so effective."
            required
            {...form.getInputProps("additionalInformation")}
          />
          <br />
          {/* 
          Remove for MVP
          <Group>
            <TextInput
              label="Online references"
              description="If contents of your lesson are not widely available on the Internet, provide a link to an online resources that explains the concept."
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
          </Group> */}
        </Stepper.Step>

        <Stepper.Step
          label="Second step"
          description="Configure learner agent"
          disabled={active === 3}
        >
          <Select
            label="Lesson depth"
            description="What kind of lesson will this be for your learner?"
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
            description="(Optional) Give your learner agent a personality to make the session more engaging."
            placeholder="sassy, curious, friendly, etc."
            {...form.getInputProps("agentConfig.persona")}
          />
          <br />
          <Select
            label="Game mode"
            description="Some fun challenges to make the session more engaging"
            placeholder="Playground"
            defaultValue={"Playground"}
            data={[
              "Playground",
              "Explain to a 5 year old",
              "5 levels",
              "Expert (Mastery) - Possesses comprehensive knowledge. Teaches, debates, and creates new insights. Handles any question with in-depth, nuanced explanations and diverse examples.",
            ]}
            required
            {...form.getInputProps("agentConfig.gameMode")}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Final step"
          description="Review"
          disabled={active === 3}
        >
          <Title order={2}>Review your session configuration</Title>
          <Text size="xl">
            <Text fw={"bold"}>Concept to explain: </Text>{" "}
            {form.values.conceptToExplain}
          </Text>
          {form.values.additionalInformation && (
            <Text size="xl">
              Lesson objective: {form.values.additionalInformation}
            </Text>
          )}
          {form.values.referenceUrl && (
            <Text size="xl">
              Reference: {form.values.referenceUrl} ({form.values.referenceType}
              )
            </Text>
          )}

          <Text size="xl">
            <Text fw={"bold"}>Lesson depth: </Text>{" "}
            {form.values.agentConfig.depth}
          </Text>
          {form.values.agentConfig.persona && (
            <Text size="xl">
              Learner persona: {form.values.agentConfig.persona}
            </Text>
          )}
          <Text size="xl">
            <Text fw={"bold"}>Game mode: </Text>{" "}
            {form.values.agentConfig.gameMode}
          </Text>
        </Stepper.Step>
        <Stepper.Completed>Session created! Redirecting...</Stepper.Completed>
      </Stepper>

      {active < 3 && (
        <Group mt="xl" position="apart">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>
            {active >= 2 ? "Confirm" : "Next step"}
          </Button>
        </Group>
      )}
    </Stack>
  );
}
