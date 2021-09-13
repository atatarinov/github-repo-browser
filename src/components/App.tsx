import { createGlobalStyle } from "styled-components";
import RepoSummary from "./RepoSummary";
import Header from "./Header";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f5f8fa;
    margin: 0;
  }
`;

export default function App() {
  return (
    <div>
      <GlobalStyle />
      <Header />
      <RepoSummary />
    </div>
  );
}
