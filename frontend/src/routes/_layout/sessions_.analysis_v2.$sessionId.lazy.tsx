// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import {
  createFileRoute,
  createLazyFileRoute,
  redirect,
} from "@tanstack/react-router";
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
  Indicator,
  Skeleton,
  Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  capitalizeFirstLetterForFeedback,
  transformQuestionAnalysis,
} from "../../utils/helper";
import {
  AnalysisByQuestion,
  PostSessionAnalysis,
  getPostSessionAnalysis,
} from "../../utils/sessionAnalysisService";
import { useEffect, useState } from "react";
import {
  feedback,
  questionFeedback,
} from "../../mock_data/mockPostSessionAnalysis_v2";
import { useDisclosure } from "@mantine/hooks";

export const Route = createLazyFileRoute(
  "/_layout/sessions/analysis_v2/$sessionId"
)({
  component: PostSessionAnalysisComponent,
});

function PostSessionAnalysisComponent() {
  const [postSessionAnalysisData, setPostSessionAnalysisData] =
    useState<PostSessionAnalysis>(null);
  const [analysisByQuestionData, setAnalysisByQuestionData] =
    useState<AnalysisByQuestion[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchPostSessionAnalysis = async () => {
      setIsLoading(true);
      try {
        const analysis_data = await getPostSessionAnalysis(
          "KenjiPcx",
          "78c99c1d-34fb-492a-9cac-ea3567cf6030"
        ); // TODO: get actual user_id and session_id
        setIsLoading(false);
        setPostSessionAnalysisData(analysis_data.post_session_analysis);
        setAnalysisByQuestionData(analysis_data.analysis_by_question);
      } catch (error) {
        setIsLoading(false);
        setPostSessionAnalysisData(feedback); // TODO: delete this once in production
        setAnalysisByQuestionData(questionFeedback); // TODO: delete this once in production
        setError(false); // TODO: set this to false once in production
      }
    };
    fetchPostSessionAnalysis();
  }, []);

  const [
    openedQuestionFeedback,
    { open: openQuestionFeedback, close: closeQuestionFeedback },
  ] = useDisclosure(false);

  return (
    <>
      {postSessionAnalysisData && (
        <>
          <Flex gap={"20px"}>
            <Card
              p={"50px"}
              radius={"lg"}
              maw={"800px"}
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(40, 50, 63, 0.8)",
              }}
            >
              <Box mb={"20px"}>
                <Title order={3}>
                  Well done for completing a Feynman session! 😁
                </Title>
                <Text size={"sm"} pt={5}>
                  {postSessionAnalysisData.qualitative_analysis.overall_comment}
                </Text>

                <Indicator inline color={"yellow"} size={10} mt={"15px"}>
                  <Button
                    variant={"light"}
                    color={"blue"}
                    size={"xs"}
                    onClick={openQuestionFeedback}
                  >
                    See Detailed Feedback
                  </Button>
                </Indicator>

                <Box style={{ marginTop: "15px" }}>
                  <Accordion>
                    <Accordion.Item value={"1"} ml={"-10px"}>
                      <Accordion.Control>
                        <Group style={{ margin: "md" }}>
                          <Text size={"lg"}>Concept Explored 🔍</Text>
                          <Text size={"lg"} weight={"bold"}>
                            {postSessionAnalysisData.concept_explored}
                          </Text>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel ml={"5px"}>
                        {postSessionAnalysisData.questions_asked.map(
                          (question, key) => {
                            return (
                              <Text size={"sm"}>
                                {key + 1}. {question}
                              </Text>
                            );
                          }
                        )}
                      </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value={"2"} ml={"-10px"}>
                      <Accordion.Control>
                        <Group style={{ margin: "md" }}>
                          <Text size={"lg"}>Overall Score ⭐</Text>
                          <Text size={"lg"} weight={"bold"}>
                            {postSessionAnalysisData.scores.overall_score}
                          </Text>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel ml={"5px"}>
                        <ScrollArea h={150} type={"hover"}>
                          <Box pr={"15px"}>
                            <Group mb={"15px"}>
                              {Object.entries(postSessionAnalysisData.scores)
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
                                {
                                  postSessionAnalysisData.qualitative_analysis
                                    .strengths
                                }
                              </Text>
                            </Box>
                            <Box my={"15px"}>
                              <Title order={5}>Room for improvement 🚧</Title>
                              <Text size={"sm"}>
                                {
                                  postSessionAnalysisData.qualitative_analysis
                                    .room_for_improvement
                                }
                              </Text>
                            </Box>
                            <Box my={"15px"}>
                              <Title order={5}>What you could do 💡</Title>
                              <Text size={"sm"}>
                                {
                                  postSessionAnalysisData.qualitative_analysis
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
                {postSessionAnalysisData.satisfactory_outcome && (
                  <Text size={"md"}>
                    Perhaps you might want to look into these topics next...
                  </Text>
                )}
                {!postSessionAnalysisData.satisfactory_outcome && (
                  <Text size={"md"}>
                    Consider these topics to strengthen your foundational
                    knowledge...
                  </Text>
                )}

                <Flex wrap={"wrap"} sx={{ maxWidth: "600px" }}>
                  {postSessionAnalysisData.suggested_topics.map(
                    (topic: string) => (
                      <Button
                        variant={"light"}
                        color={"blue"}
                        style={{ marginTop: "10px", marginRight: "10px" }}
                        size={"xs"}
                      >
                        {topic}
                      </Button>
                    )
                  )}
                </Flex>
              </Box>
            </Card>
          </Flex>
          <Modal
            opened={openedQuestionFeedback}
            onClose={closeQuestionFeedback}
            title={
              <Title order={3} mt={"10px"} mx={"10px"}>
                Feedback by Question
              </Title>
            }
            centered
            size={"850px"}
            radius={"lg"}
            styles={{
              header: { backgroundColor: "#242c3c" },
              content: { backgroundColor: "#242c3c" },
            }}
          >
            <Accordion p={"10px"}>
              {analysisByQuestionData.length > 1 &&
                analysisByQuestionData.map(
                  (question: AnalysisByQuestion, key) => {
                    const transformedQuestion =
                      transformQuestionAnalysis(question);
                    return (
                      <Accordion.Item value={String(key)} ml={"-10px"}>
                        <Accordion.Control>
                          <Group style={{ margin: "md" }}>
                            <Text size={"lg"}>
                              {key + 1}. {question.question}
                            </Text>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel ml={"5px"}>
                          <ScrollArea h={"450px"} offsetScrollbars>
                            {transformedQuestion.map((q) => {
                              return (
                                <>
                                  <Flex my={"10px"}>
                                    <Text>
                                      {capitalizeFirstLetterForFeedback(
                                        q.score_type
                                      )}
                                    </Text>
                                    <Text>: {q.score}</Text>
                                  </Flex>
                                  <Text size={"sm"}>{q.explanation}</Text>
                                </>
                              );
                            })}
                          </ScrollArea>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  }
                )}
            </Accordion>
          </Modal>
        </>
      )}
      {isLoading && (
        <Flex
          w={"100%"}
          h={"100%"}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton width={"60%"} height={"60%"} visible={true} radius={"lg"} />
        </Flex>
      )}
      {error && (
        <Flex
          w={"60%"}
          h={"60%"}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            padding={"50px"}
            radius={"lg"}
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(40, 50, 63, 0.8)",
            }}
            maw={"800px"}
          >
            <Title order={3}>Error ⚠️</Title>
            <Text size={"sm"} pt={5}>
              Oops! Something went wrong.
            </Text>
          </Card>
        </Flex>
      )}
    </>
  );
}
