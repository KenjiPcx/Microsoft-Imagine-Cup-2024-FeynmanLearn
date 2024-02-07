// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import { FileRoute, redirect } from "@tanstack/react-router";
import {
  Card,
  Text,
  Group,
  Title,
  Button,
  Flex,
  Box,
  ScrollArea,
  Accordion,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { feedback } from "../../mock_data/mockPostSessionAnalysis";
import { capitalizeFirstLetterForFeedback } from "../../utils/helper";

export const Route = new FileRoute(
  "/_layout/sessions/analysis/$sessionId"
).createRoute({
  component: PostSessionAnalysisComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      notifications.show({
        color: "yellow",
        title: "Unauthorized",
        message: "You are not authorized yet, please login first",
      });
      throw redirect({
        to: "/",
      });
    }
  },
});

function PostSessionAnalysisComponent() {
  return (
    <>
      <Flex gap={"20px"}>
        <Card
          padding={"50px"}
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
            <Text size={"sm"} pt={5}>
              {feedback.qualitative_analysis.overall_comment}
            </Text>

            <Box style={{ marginTop: "15px" }}>
              <Accordion>
                <Accordion.Item value={"1"} ml={"-10px"}>
                  <Accordion.Control>
                    <Group style={{ margin: "md" }}>
                      <Text size={"lg"}>Concept Explored 🔍</Text>
                      <Text size={"lg"} weight={"bold"}>
                        {feedback.concept_explored}
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel ml={"5px"}>
                    {feedback.questions_asked.map((question) => {
                      return <Text size={"sm"}>{question}</Text>;
                    })}
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={"2"} ml={"-10px"}>
                  <Accordion.Control>
                    <Group style={{ margin: "md" }}>
                      <Text size={"lg"}>Overall Score ⭐</Text>
                      <Text size={"lg"} weight={"bold"}>
                        {feedback.scores.overall_score}
                      </Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel ml={"5px"}>
                    <ScrollArea h={150} type={"hover"}>
                      <Box pr={"15px"}>
                        <Group mb={"15px"}>
                          {Object.entries(feedback.scores)
                            .filter(([key]) => key !== "overall_score")
                            .map(([key, value]) => (
                              <Text key={key} size={"md"}>
                                {`${capitalizeFirstLetterForFeedback(key).replace(/_/g, " ")}: ${value}`}
                              </Text>
                            ))}
                        </Group>
                        <Box my={"15px"}>
                          <Title order={5}>What went well! 💪</Title>
                          <Text size={"sm"}>
                            {feedback.qualitative_analysis.strengths}
                          </Text>
                        </Box>
                        <Box my={"15px"}>
                          <Title order={5}>Room for improvement 🚧</Title>
                          <Text size={"sm"}>
                            {feedback.qualitative_analysis.strengths}
                          </Text>
                        </Box>
                        <Box my={"15px"}>
                          <Title order={5}>What you could do 💡</Title>
                          <Text size={"sm"}>
                            {
                              feedback.qualitative_analysis
                                .suggestions_for_improvement
                            }
                          </Text>
                        </Box>
                      </Box>
                    </ScrollArea>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Box>
          </Box>

          <Box>
            {feedback.satisfactory_outcome && (
              <Text size={"md"}>
                Perhaps you might want to look into these topics next...
              </Text>
            )}
            {!feedback.satisfactory_outcome && (
              <Text size={"md"}>
                Consider these topics to strengthen your foundational
                knowledge...
              </Text>
            )}

            <Flex wrap={"wrap"} sx={{ maxWidth: "800px" }}>
              {feedback.suggested_topics.map((topic: string) => (
                <Button
                  variant="light"
                  color="blue"
                  style={{ marginTop: "10px", marginRight: "10px" }}
                >
                  {topic}
                </Button>
              ))}
            </Flex>
          </Box>
        </Card>
      </Flex>
    </>
  );
}
