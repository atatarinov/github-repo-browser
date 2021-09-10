import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
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
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("apiKey"));
  const [repos, setRepos] = useState([] as RepoApiResponse[]);
  const [issues, setIssues] = useState([] as Issue[]);
  const [issueList, setIssueList] = useState([] as Record<number, Issue>);
  const [issueIds, setIssueIds] = useState([] as number[]);
  const [currentRepo, setCurrentRepo] = useState("");

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
        sessionStorage.setItem("apiKey", apiKey);
        setApiKey("");
      } catch (error) {
        console.error("Error while fetching repos ", error);
        setApiKey("");
      }
    }
  }

  async function requestIssuesForRepo(repoName: string) {
    if (currentRepo !== repoName) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoName}/issues`
        );
        const issues = await response.json();

        createIssueList(issues);
        setCurrentRepo(repoName);
      } catch (error) {
        console.error("Error while fetching issues ", error);
      }
    }
  }

  function updateIssueList(issueIds: number[]) {
    const updatedIssues = issueIds.map((issueId) => {
      return issueList[issueId];
    });

    setIssues(updatedIssues);
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

    setIssues(currentIssues);
    setIssueList(issueList);
    setIssueIds(issueIds);
  }

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newIssueIds = Array.from(issueIds);
    newIssueIds.splice(source.index, 1);
    newIssueIds.splice(destination.index, 0, parseInt(draggableId, 10));

    setIssueIds(newIssueIds);
    updateIssueList(newIssueIds);
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
            value={apiKey ? apiKey : ""}
            onChange={(e) => setApiKey(e.target.value)}
            type="password"
          />
          <button>Show Repos</button>
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
        {issues.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <IssuesColumn issues={issues} />
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
