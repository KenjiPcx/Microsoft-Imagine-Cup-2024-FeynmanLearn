// Here is where we analyse a session after it has been completed
// 1. Display key gaps of knowledge
// 2. Display a summary of user performance
// 3. Display line by line feedback
// 4. Give an overall score
// 5. Suggest next steps - resources to read, simpler concepts to explain

import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute(
  "/sessions/analysis/$sessionId"
).createRoute({
  component: PostSessionAnalysisComponent,
});

function PostSessionAnalysisComponent() {
  return <div>
    <h1>Post Session Analysis</h1>
    <p>Here is where we analyse a session after it has been completed</p>
    <ol>
      <li>Display key gaps of knowledge</li>
      <li>Display a summary of user performance</li>
      <li>Display line by line feedback</li>
      <li>Give an overall score</li>
      <li>Suggest next steps - resources to read, simpler concepts to explain</li>
    </ol>
  </div>;
}
