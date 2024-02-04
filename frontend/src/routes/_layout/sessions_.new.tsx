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
  Grid,
  Col,

} from "@mantine/core";
import { useForm } from "@mantine/form";
import "./sessions.css";

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

  const submitStepData = (data) => {
    fetch('/get_session_configurations', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const nextStep = () => {
    if (form.validate().hasErrors) {
      return;
    }

    if (active === 0) {
      const stepData = {
        conceptToExplain: form.values.conceptToExplain,
        additionalInformation: form.values.additionalInformation,
        referenceUrl: form.values.referenceUrl,
        referenceType: form.values.referenceType,
      };
      submitStepData(stepData);
    }

    setActive(current => current < 3 ? current + 1 : current);
  };

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
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        className="stepper"
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
            label="Goal of the lesson"
            description="(Optional) Define detailed key objectives of your lesson, this helps you scope the lesson and keep it focused"
            placeholder="In this lesson, I want to explain specifically how the Feynman method can be used to learn new concepts, and what makes it so effective."
            {...form.getInputProps("additionalInformation")}
          />
          <br />
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
          </Group>
        </Stepper.Step>

        <Stepper.Step
          label="Second step"
          description="Configure learner agent"
          disabled={active === 3}
        >
          <div style={{ margin: '20px 0' }}>
            <label style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', display: 'block' }}>
              Game mode
            </label>
            <Grid>
            {["Playground", "Explain to a 5 year old", "5 levels", "Expert (Mastery)"].map((mode, index) => (
              <Col span={6} key={mode}>
                <Button
                  fullWidth
                  variant="filled"
                  color={form.values.agentConfig.gameMode === mode ? "blue" : "gray"}
                  onClick={() => form.setFieldValue("agentConfig.gameMode", mode)}
                >
                  {mode}
                </Button>
              </Col>
            ))}
          </Grid>
          </div>
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
        <Group mt="xl" position="center" className="group">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>
            Back
          </Button>
          <Button onClick={nextStep} disabled={active === 3}>
            {active === 2 ? "Confirm" : "Next step"}
          </Button>
        </Group>
      )}
    </>
  );
}
