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
import axios from "axios";
import { VERIFY_LESSON_SCOPE_ENDPOINT } from "../../backendEndpoints";
import { notifications } from "@mantine/notifications";

export const Route = new FileRoute("/_layout/sessions/new").createRoute({
  component: NewSessionConfigurationComponent,
});

export type NewSessionConfigurationForm = {
  lessonConcept: string;
  lessonObjectives: string;
  // referenceUrl: string;
  // referenceType: "Article" | "Video" | "PDF" | "";
  //   customDataFiles: File[]; // Will try for now but I guess we can handle this in the future
  gameMode: string;
  depth: string;
  persona: string;
};

export type LessonVerificationResponse = {
  passed_verification: boolean;
  feedback: string;
  suggestions: string;
};

function NewSessionConfigurationComponent() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(-1);
  const nextStep = async () => {
    console.log("CALled");
    if (form.validate().hasErrors) {
      console.log("had erros");
      return;
    }

    if (active === 0) {
      try {
        const data = {
          lesson_concept: form.values.lessonConcept,
          lesson_objective: form.values.lessonObjectives,
        };
        console.log("data", data);
        setLoading(1);
        const res = await axios.post<LessonVerificationResponse>(
          VERIFY_LESSON_SCOPE_ENDPOINT,
          data
        );
        setLoading(-1);
        console.log(res.data);
        if (res.data.passed_verification) {
          notifications.show({
            title: "Success",
            message: "Lesson scope is feasible!",
            color: "green",
          });
          setActive((current) => (current < 3 ? current + 1 : current));
        } else {
          notifications.show({
            title: res.data.feedback || "Error",
            message: res.data.suggestions,
            color: "red",
          });
        }
      } catch (error) {
        console.error(error);
        notifications.show({
          title: "Error",
          message: "Failed to verify lesson scope. Please try again.",
          color: "red",
        });
      }
    } else {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const form = useForm<NewSessionConfigurationForm>({
    initialValues: {
      lessonConcept: "",
      lessonObjectives: "",
      // referenceUrl: "",
      // referenceType: "",
      //   customDataFiles: [],
      gameMode: "",
      depth: "",
      persona: "",
    },

    validate: (values) => {
      if (active === 0) {
        return {
          lessonConcept:
            values.lessonConcept === ""
              ? "Concept to explain is required"
              : null,
          lessonObjectives:
            values.lessonObjectives === ""
              ? "Lesson objectives is required"
              : null,
        };
      }

      return {};
    },
  });

  return (
    <Stack maw={"40%"}>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        <Stepper.Step
          label="First step"
          description="Select a topic"
          disabled={active === 3}
          loading={loading === 1}
        >
          <TextInput
            mt={"xl"}
            label="Concept to explain"
            description="Define the concept you want to teach in this session"
            placeholder="The Feynman method"
            size="md"
            required
            {...form.getInputProps("lessonConcept")}
          />
          <br />
          <Textarea
            label="Lesson objective(s)"
            description="Define detailed key objective(s) for your lesson, this should be well scoped and feasible to teach within a short timeframe."
            placeholder="Student will understand specifically how the Feynman method can be used to learn new concepts, and what makes it so effective."
            size="md"
            required
            {...form.getInputProps("lessonObjectives")}
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
          loading
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
            {form.values.lessonConcept}
          </Text>
          {form.values.lessonObjectives && (
            <Text size="xl">
              Lesson objective(s): {form.values.lessonObjectives}
            </Text>
          )}
          {/* {form.values.referenceUrl && (
            <Text size="xl">
              Reference: {form.values.referenceUrl} ({form.values.referenceType}
              )
            </Text>
          )} */}

          <Text size="xl">
            <Text fw={"bold"}>Lesson depth: </Text> {form.values.depth}
          </Text>
          {form.values.persona && (
            <Text size="xl">Learner persona: {form.values.persona}</Text>
          )}
          <Text size="xl">
            <Text fw={"bold"}>Game mode: </Text> {form.values.gameMode}
          </Text>
        </Stepper.Step>
        <Stepper.Completed>Session created! Redirecting...</Stepper.Completed>
      </Stepper>

      {active < 3 && (
        <Group mt="xl" position="apart">
          <Button variant="light" color="gray" onClick={prevStep}>
            Back
          </Button>
          <Button variant="light" color="blue" onClick={nextStep}>
            {active >= 2 ? "Confirm" : "Next step"}
          </Button>
        </Group>
      )}
    </Stack>
  );
}
