import { useState } from "react";
import styled from "styled-components";
import { Repo as RepoApiResponse, Issue } from "../APIResponseType";
import IssuesColumn from "./IssuesColumn";
import Repo from "./Repo";

const Container = styled.div`
  width: 50%;
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;

const Title = styled.h3`
  padding: 8px;
`;

const SubTitle = styled.h5`
  padding: 8px;
`;

const RepoList = styled.div`
  padding: 8px;
`;

export default function RepoSummary() {
  const [apiKey, setApiKey] = useState("");
  const [repos, setRepos] = useState([] as RepoApiResponse[]);
  const [issues, setIssues] = useState([] as Issue[]);
  // const [issueIds, setIssueIds] = useState([] as number[]);

  async function requestRepos() {
    if (apiKey) {
      try {
        const response = await fetch("https://api.github.com/user", {
          headers: { Authorization: `bearer ${apiKey}` },
        });

        const userInfo = await response.json();
        const reposResponse = await fetch(userInfo.repos_url);
        const repos = await reposResponse.json();

        setRepos(repos);
        setApiKey("");
      } catch (error) {
        console.error("Error while fetching repos ", error);
        setApiKey("");
      }
    }
  }

  async function requestIssuesForRepo(repoName: string) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoName}/issues`
      );
      const issues = await response.json();

      const currentIssues = createIssueList(issues);
      setIssues(currentIssues);
    } catch (error) {
      console.error("Error while fetching issues ", error);
    }
  }

  function createIssueList(issues: Issue[]) {
    const issueList: Record<number, Issue> = {};

    const issueIds = issues.map((issue) => {
      issueList[issue.id] = issue;
      return issue.id;
    });

    const currentIssues = issueIds.map((issueId) => {
      return issueList[issueId];
    });

    return currentIssues;
  }

  return (
    <div className="content-container">
      <div className="input-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestRepos();
          }}
        >
          <label htmlFor="apiKey">Please enter your GitHub API key</label>
          <input
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button>Submit</button>
        </form>
      </div>
      <div className="repos-summary">
        <Container>
          <Title>Repos</Title>
          {repos.length ? (
            <RepoList>
              {repos.map((repo) => {
                return (
                  <div
                    key={repo.id}
                    onClick={(_) => requestIssuesForRepo(repo.full_name)}
                  >
                    <Repo name={repo.name} />
                  </div>
                );
              })}
            </RepoList>
          ) : (
            <SubTitle>No Repos Found</SubTitle>
          )}
        </Container>
        {issues.length > 0 && <IssuesColumn issues={issues} />}
      </div>
    </div>
  );
}
