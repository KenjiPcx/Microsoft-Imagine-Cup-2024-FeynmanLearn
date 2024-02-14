// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import { Link, createLazyFileRoute } from "@tanstack/react-router";
import {
  Text,
  Title,
  Button,
  Flex,
  Box,
  ScrollArea,
  Stack,
  Paper,
  Center,
} from "@mantine/core";
import { SessionErrorComponent } from "../../components/SessionErrorComponent";
import LineByLineFeedback from "../../components/post_session_analysis/LineByLineFeedback";
import SessionMetadataCard from "../../components/post_session_analysis/SessionMetadata";
import { getRandomColor } from "../../utils/style_helper";

export const Route = createLazyFileRoute(
  "/_layout/sessions/analysis/$sessionId"
)({
  component: PostSessionAnalysisComponent,
  errorComponent: SessionErrorComponent as any,
});

function PostSessionAnalysisComponent() {
  const analysis = Route.useLoaderData();
  // const analysis = mockPostSessionAnalysis;
  console.log(analysis);
  const { post_session_analysis, session_metadata, annotated_transcripts } =
    analysis;
  const {
    assessment_summary,
    general_assessment,
    overall_score,
    objective_reached,
    easier_topics,
    similar_topics,
    session_passed,
    knowledge_gaps,
    fact_check_results,
    constructive_feedback,
  } = post_session_analysis;
  const haveKnowledgeGaps = knowledge_gaps.length > 0;
  const haveFactCheckResults = fact_check_results.length > 0;

  return (
    <ScrollArea h={"80vh"} offsetScrollbars>
      <Stack miw={"40vw"} maw={"50vw"} spacing={50} justify="center">
        <Box>
          <Title order={2} color="blue">
            Session Overview
          </Title>
          <Paper radius={"lg"} p={"xs"} mt={"lg"}>
            <Stack p={"md"} spacing={"xs"}>
              <Text>{assessment_summary}</Text>
              <Text>{general_assessment}</Text>
              <Text>Overall Score: {overall_score}</Text>
              <Text>Session Passed: {session_passed ? "True" : "False"}</Text>
              <Text>
                Objectives Reached: {objective_reached ? "True" : "False"}
              </Text>
            </Stack>
          </Paper>
        </Box>

        <Box>
          <Title order={2} color="blue">
            Errors in the explanation
          </Title>
          <Paper radius={"lg"} p={"xs"} mt={"lg"}>
            <Stack p={"md"} spacing={"xs"}>
              {haveFactCheckResults ? (
                <Box>
                  {fact_check_results.map((res, idx) => (
                    <Text key={`fact-check-res-${idx}`}>{res}</Text>
                  ))}
                </Box>
              ) : (
                "None found, great job! 😊"
              )}
            </Stack>
          </Paper>
        </Box>

        <Box>
          <Title order={2} color="blue">
            Knowledge Gaps
          </Title>
          <Paper radius={"lg"} p={"xs"} mt={"lg"}>
            <Stack p={"md"} spacing={"xs"}>
              {haveKnowledgeGaps ? (
                <>
                  <Box>
                    {knowledge_gaps.map((gaps, idx) => (
                      <Text key={`knowledge-gaps-${idx}`}>{gaps}</Text>
                    ))}
                  </Box>
                  <Flex p={"md"} wrap={"wrap"} gap={"xl"} justify={"center"}>
                    {easier_topics.map((topic, key) => (
                      <Button
                        key={`easier-topic-${key}`}
                        component={Link}
                        to={"/sessions/new"}
                        search={{ topic: topic }}
                        color={getRandomColor()}
                      >
                        {topic}
                      </Button>
                    ))}
                  </Flex>
                </>
              ) : (
                "None found, great job! 😊"
              )}
            </Stack>
          </Paper>
        </Box>

        <SessionMetadataCard session_metadata={analysis.session_metadata} />

        <Box>
          <Title order={2} color="blue">
            Constructive Feedback
          </Title>
          <Paper radius={"lg"} p={"xs"} mt={"lg"}>
            <Stack p={"md"} spacing={"xs"}>
              {constructive_feedback}
            </Stack>
          </Paper>
        </Box>

        <LineByLineFeedback transcripts={analysis.annotated_transcripts} />
        <Box>
          <Title order={2} color="blue">
            Try teaching these topics
          </Title>
          <Paper radius={"lg"} p={"xs"} mt={"lg"}>
            <Flex p={"md"} wrap={"wrap"} gap={"xl"} justify={"center"}>
              {similar_topics.map((topic, key) => (
                <Button
                  key={`similar-topic-${key}`}
                  component={Link}
                  to={"/sessions/new"}
                  search={{ topic: topic }}
                  color={getRandomColor()}
                >
                  {topic}
                </Button>
              ))}
            </Flex>
          </Paper>
        </Box>

        <Center>
          <Button component={Link} to={"/"}>
            Home
          </Button>
        </Center>
      </Stack>
    </ScrollArea>
  );
}
