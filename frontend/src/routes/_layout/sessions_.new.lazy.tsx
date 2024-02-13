// Here is where we configure a session
// 1. Select content to teach
// 2. Select game mode, student configs
// 3. Launch session
// 4. Redirect back new session id to /sessions/:id
//<li>We could have a input src concept to explain button</li>
// <li>We could have some common agent configs</li>

import { useEffect, useState } from "react";
import {
  createFileRoute,
  createLazyFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
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
  SimpleGrid,
  rem,
  createStyles,
  Code,
  Box,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import {
  CREATE_SESSION_ENDPOINT,
  VERIFY_LESSON_SCOPE_ENDPOINT,
} from "../../backendEndpoints";
import { notifications } from "@mantine/notifications";
import GameCard from "../../components/GameCard";
import {
  CreateNewSessionResponse,
  LessonVerificationResponse,
} from "../../apiResponseTypes";
import { useAuth } from "../../utils/auth";
import { IconCheck, IconCross } from "@tabler/icons-react";

export const Route = createLazyFileRoute("/_layout/sessions/new")({
  component: NewSessionConfigurationComponent,
});

export type NewSessionConfigurationForm = {
  lessonConcept: string;
  lessonObjectives: string;
  // referenceUrl: string;
  // referenceType: "Article" | "Video" | "PDF" | "";
  //   customDataFiles: File[]; // Will try for now but I guess we can handle this in the future
  gameMode: string;
  difficulty: string;
  persona: string;
};

const gameModes = [
  {
    label: "Explain to a kid",
    image: "/explain_to_a_kid.png",
  },
  {
    label: "Custom",
    image: "/custom.png",
  },
];

const selectOptions = [
  "Beginner (Awareness) - Understands and communicates basic definitions and core principles. Answers straightforward questions and applies the concept in familiar contexts.",
  "Intermediate (Application) - Explains how the concept works and applies it in problem-solving. Handles moderately challenging questions and connects different parts of the concept.",
  "Advanced (Analysis) - Discusses subtle or complex aspects. Analyzes, critiques, and draws connections to other concepts. Answers complex questions with detailed explanation.",
  "Expert (Mastery) - Possesses comprehensive knowledge. Teaches, debates, and creates new insights. Handles any question with in-depth, nuanced explanations and diverse examples.",
];

const noOfSteps = 4;

const useStyles = createStyles((theme) => ({
  separator: {
    height: rem(2),
    borderTop: `${rem(2)} dashed ${theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4]}`,
    borderRadius: theme.radius.xl,
    backgroundColor: "transparent",
  },

  separatorActive: {
    borderWidth: 0,
    backgroundImage: theme.fn.linearGradient(
      45,
      theme.colors.blue[6],
      theme.colors.cyan[6]
    ),
  },

  stepIcon: {
    borderColor: "transparent",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.white,
    borderWidth: 0,

    "&[data-completed]": {
      borderWidth: 0,
      backgroundColor: "transparent",
      backgroundImage: theme.fn.linearGradient(
        45,
        theme.colors.blue[7],
        theme.colors.cyan[6]
      ),
    },
  },

  step: {
    transition: "transform 150ms ease",

    "&[data-progress]": {
      transform: "scale(1.05)",
    },
  },
}));

function NewSessionConfigurationComponent() {
  const auth = useAuth();
  const navigate = useNavigate({ from: "/sessions/new" });
  const { classes } = useStyles();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(-1);
  const [scopeVerified, setScopeVerified] = useState(false);
  const [createSessionMsg, setCreateSessionMsg] = useState(
    "Creating session..."
  );
  const { topic } = Route.useSearch();

  const nextStep = async () => {
    if (form.validate().hasErrors) {
      if (active === 1) {
        notifications.show({
          title: "Error",
          message: form.errors.gameMode,
          color: "red",
        });
      }
      return;
    }

    if (active === 0) {
      await handleStepOne();
      return;
    }

    if (active === 3) {
      await handleCreateSession();
      return;
    }

    setActive((current) => (current < noOfSteps ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleStepOne = async () => {
    if (scopeVerified) {
      setActive((current) => (current < noOfSteps ? current + 1 : current));
      return;
    }

    // Verify lesson scope api call
    const notificationId = "lesson-verification-notification";
    const data = {
      lesson_concept: form.values.lessonConcept,
      lesson_objectives: form.values.lessonObjectives,
    };
    setLoading(1);
    notifications.show({
      id: notificationId,
      loading: true,
      title: "Verifying lesson scope",
      message: "Verifying lesson scope, it will take a few moments",
      autoClose: false,
      withCloseButton: false,
    });
    try {
      const res = await axios.post<LessonVerificationResponse>(
        VERIFY_LESSON_SCOPE_ENDPOINT,
        data
      );
      setLoading(-1);
      if (res.data.passed_verification) {
        notifications.update({
          id: notificationId,
          title: "Success",
          message: "Lesson scope is feasible!",
          color: "green",
        });
        setActive((current) => (current < noOfSteps ? current + 1 : current));
        setScopeVerified(true);
        return;
      }
      notifications.update({
        id: notificationId,
        title: res.data.feedback || "Error",
        message: res.data.suggestion,
        color: "red",
      });
    } catch (error) {
      console.error(error);
      notifications.update({
        id: notificationId,
        title: "Error",
        message: "Failed to verify lesson scope. Please try again.",
        color: "red",
      });
      setLoading(-1);
    }
  };

  const handleCreateSession = async () => {
    // Create session
    const data = {
      lesson_concept: form.values.lessonConcept,
      lesson_objectives: form.values.lessonObjectives,
      game_mode: form.values.gameMode,
      difficulty: form.values.difficulty,
      student_persona: form.values.persona,
      user_id: auth.getUserId(),
    };

    const notificationId = "create-session-notification";
    setLoading(4);
    setActive((current) => (current < noOfSteps ? current + 1 : current));
    notifications.show({
      id: notificationId,
      loading: true,
      title: "Creating session",
      message: "Creating session, it will take a few moments",
      autoClose: false,
      withCloseButton: false,
    });
    try {
      const res = await axios.post<CreateNewSessionResponse>(
        CREATE_SESSION_ENDPOINT,
        data
      );
      setLoading(-1);
      if (res.data.success) {
        notifications.update({
          id: notificationId,
          color: "teal",
          title: "Session Created Successfully!",
          message: "Redirecting to the analysis page",
          icon: <IconCheck size="1rem" />,
          autoClose: 2000,
        });
        setCreateSessionMsg("Session created successfully! Redirecting...");
        // Redirect to new session id after 1s
        setTimeout(() => {
          navigate({
            to: "/sessions/run/$sessionId",
            params: { sessionId: res.data.session_id },
          });
        }, 2000);
        return;
      }
      notifications.update({
        id: notificationId,
        color: "red",
        title: "Error Creating Session",
        message: `Failed to create session, please contact developer. ${res.data.error}`,
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
      prevStep();
      return;
    } catch (error) {
      console.error(error);
      notifications.update({
        id: notificationId,
        title: "Error",
        message: `Failed to create session. Please try again. ${error}`,
        color: "red",
      });
      return;
    }
  };

  const form = useForm<NewSessionConfigurationForm>({
    initialValues: {
      lessonConcept: topic,
      lessonObjectives: "",
      // referenceUrl: "",
      // referenceType: "",
      //   customDataFiles: [],
      gameMode: "",
      difficulty: "",
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

      if (active === 1) {
        return {
          gameMode: values.gameMode === "" ? "Game mode is required" : null,
        };
      }

      if (active === 2) {
        return {
          difficulty:
            values.difficulty === "" ? "Difficulty level is required" : null,
        };
      }

      return {};
    },
  });

  const selectGameMode = (gameMode: string) => {
    form.setFieldValue("gameMode", gameMode);
  };

  useEffect(() => {
    setScopeVerified(false);
  }, [form.values.lessonConcept, form.values.lessonObjectives]);

  return (
    <Stack>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        w={"50vw"}
        classNames={classes}
      >
        <Stepper.Step
          label="Step 1"
          description="Select a topic"
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

        <Stepper.Step label="Step 2" description="Configure game mode">
          <SimpleGrid cols={2} mx={"auto"} mt={"xl"} spacing={"xl"}>
            {/* <GameCard label={"Playground"} image={""} />
            <GameCard label={"Time limit"} image={""} /> */}
            {gameModes.map((gameMode) => (
              <GameCard
                label={gameMode.label}
                image={gameMode.image}
                selected={form.values.gameMode === gameMode.label}
                onChoose={() => {
                  selectGameMode(gameMode.label);
                }}
                key={`game-mode-${gameMode.label}`}
              />
            ))}
          </SimpleGrid>
        </Stepper.Step>

        <Stepper.Step label="Step 3" description="Configure agent">
          <Select
            label="Difficulty level"
            description="This is not the complexity of your lesson, but the difficulty of the questions you want to be asked by the agent"
            placeholder="Select difficulty level"
            mt={"xl"}
            data={selectOptions}
            size={"md"}
            required
            {...form.getInputProps("difficulty")}
          />
          <br />
          <Textarea
            label="Learner persona"
            description="(Optional) Give your learner agent a personality to make the session more engaging."
            placeholder="sassy, curious, friendly, etc."
            size={"md"}
            {...form.getInputProps("persona")}
          />
          <br />
        </Stepper.Step>

        <Stepper.Step
          label="Final step"
          description="Review"
          loading={active === 4}
        >
          <Code
            block
            mt={"xl"}
            p={"md"}
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            <Title order={3}>Confirm your session configuration</Title>
            <Box mt={"lg"}>
              <Text size={"lg"} fw={700}>
                Topic Selection
              </Text>
              <Text size={"md"}>
                Concept to explain: {form.values.lessonConcept}
              </Text>
              <Text size={"md"}>
                Lesson objectives: {form.values.lessonObjectives}
              </Text>
            </Box>
            <Box mt={"lg"}>
              <Text size={"lg"} fw={700}>
                Session Configuration
              </Text>
              <Text size={"md"}>Game mode: {form.values.gameMode}</Text>
              <Text size={"md"}>Difficulty: {form.values.difficulty}</Text>
              <Text size={"md"}>
                Agent persona: {form.values.persona || "Not set"}
              </Text>
            </Box>
          </Code>
        </Stepper.Step>
        <Stepper.Completed>
          <Center mt={"xl"}>
            <Text size={"xl"} fw={"bold"}>
              {createSessionMsg}
            </Text>
          </Center>
        </Stepper.Completed>
      </Stepper>

      {active < 4 && (
        <Group mt="xl" position="apart">
          {active > 0 ? (
            <Button variant="light" color="gray" onClick={prevStep}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            variant="light"
            color="blue"
            onClick={nextStep}
            disabled={loading !== -1}
          >
            {active >= 3 ? "Start Session" : "Next step"}
          </Button>
        </Group>
      )}
    </Stack>
  );
}
