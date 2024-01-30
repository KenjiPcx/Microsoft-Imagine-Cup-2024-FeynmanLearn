// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import { FileRoute } from "@tanstack/react-router";
import { Card, Text, Group, Title, Button, Flex, Box } from "@mantine/core";

export const Route = new FileRoute("/_layout/sessions/analysis/$sessionId").createRoute(
  {
    component: PostSessionAnalysisComponent,
  }
);

function PostSessionAnalysisComponent() {
  const session_feedback: string = `
  You demonstrated strengths in using relevant analogies, technical
  accuracy, identifying key properties, responsiveness to feedback,
  and depth of understanding of concepts like eigenvalues and
  eigenvectors. The main gap was the lack of details and examples
  in explanations, but you improved significantly in these areas
  through the session. Good job!`;

  const session_score: number = 5;
  const session_topic: string = "Diffusion models";
  const session_game_mode: string = "Game mode";
  const recommended_topics: string[] = [
    "Computer Vision",
    "Generative Adversarial Networks (GAN)",
    "Generative Pre-trained Transformer (GPT)",
  ];

  return (
    <>
      <Flex gap={"20px"}>
        <Card
          padding={"60px"}
          radius={"lg"}
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(40, 50, 63, 0.8)",
          }}
        >
          <Box style={{ marginBottom: "20px", maxWidth: "800px" }}>
            <Title order={3}>
              Well done for completing a Feynman session! 😁
            </Title>
            <Text>{session_feedback}</Text>
          </Box>
          <Box style={{ marginBottom: "20px" }}>
            <Group style={{ margin: "md" }}>
              <Text size={"lg"}>Score</Text>
              <Text size={"lg"} weight={"bold"}>
                {session_score}
              </Text>
            </Group>

            <Group style={{ margin: "md" }}>
              <Text size={"lg"}>Topic</Text>
              <Text size={"lg"} weight={"bold"}>
                {session_topic}
              </Text>
            </Group>

            <Group style={{ margin: "md" }}>
              <Text size={"lg"}>Game</Text>
              <Text size={"lg"} weight={"bold"}>
                {session_game_mode}
              </Text>
            </Group>
          </Box>

          <Box>
            <Text size={"md"}>
              Perhaps you might want to look into these topics next...
            </Text>

            <Flex wrap={"wrap"} gap={"sm"} max-width={"200px"}>
              {recommended_topics.map((topic: string) => (
                <Button variant="light" color="blue" style={{ marginTop: 14 }}>
                  {topic}
                </Button>
              ))}
            </Flex>
          </Box>
        </Card>

        {/* TODO: Add line by line commetary of the feedback */}
      </Flex>
    </>
  );
}
