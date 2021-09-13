import { useState } from "react";
import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Repo as RepoApiResponse, Issue } from "../APIResponseType";
import IssuesColumn from "./IssuesColumn";
import Repo from "./Repo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f8fa;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f8fa;
  width: 55%;
  height: 7rem;
  margin: 3rem auto;
  border: 1px solid lightgrey;
  border-radius: 5px;
  box-shadow: 0px 0px 2px lightgray;
`;

const RepoContainer = styled.div`
  width: 50%;
  margin: 2rem;
  justify-content: center;
`;

const IssueContainer = styled.div`
  display: flex;
  width: 20%;
  margin: 2rem;
  justify-content: center;
`;

const SubTitle = styled.h5`
  padding: 8px;
`;

const RepoList = styled.div`
  padding: 1rem;
`;

const FormLabel = styled.h6`
  color: #57606a;
  margin-left: 15px;
  padding-top: 23px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FormSubmit = styled.div`
  display: flex;
`;

const Input = styled.input`
  height: 1.5rem;
  background-color: #f5f8fa;
  border: 1px solid lightgrey;
  border-radius: 5px;
  width: 80%;
  margin-left: 15px;
`;

const Button = styled.button`
  color: white;
  background-color: #2ba44e;
  border-radius: 5px;
  border: 1px solid lightgrey;
  font-size: 16px;
  margin-left: 1rem;
  width: 8rem;
`;

export default function RepoSummary() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("apiKey"));
  const [repos, setRepos] = useState([] as RepoApiResponse[]);
  const [issues, setIssues] = useState([] as Issue[]);
  const [issueList, setIssueList] = useState([] as Record<number, Issue>);
  const [issueIds, setIssueIds] = useState([] as number[]);
  const [currentRepo, setCurrentRepo] = useState("");
  const [repoNotice, setRepoNotice] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(true);

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
        setShowLoginForm(false);
      } catch (error) {
        console.error("Error while fetching repos ", error);
        setApiKey("");
        setRepoNotice("No Repos Found For This Key");
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
    const newIssueOrder = issueIds.map((issueId) => {
      return issueList[issueId];
    });

    setIssues(newIssueOrder);
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

    sessionStorage.setItem(currentRepo, JSON.stringify(issueIds));
    // var storedNames = JSON.parse(localStorage.getItem("names"));
    setIssueIds(newIssueIds);
    updateIssueList(newIssueIds);
  }

  function handleFormChange() {
    if (repoNotice !== "") {
      setRepoNotice("");
    }
  }

  return (
    <Container>
      {showLoginForm && (
        <FormContainer>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              requestRepos();
            }}
            onChange={handleFormChange}
          >
            <FormLabel>Please enter your GitHub API key </FormLabel>
            <FormSubmit>
              <Input
                placeholder="Type the key..."
                value={apiKey ? apiKey : ""}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <Button>Show Repos</Button>
            </FormSubmit>
          </Form>
        </FormContainer>
      )}
      <ContentContainer>
        <RepoContainer>
          {/* <Title>Repos</Title> */}
          {repos.length ? (
            <RepoList>
              {repos.map((repo) => {
                return (
                  <div
                    key={repo.id}
                    onClick={(_) => requestIssuesForRepo(repo.full_name)}
                  >
                    <Repo name={repo.name} issueCount={repo.open_issues} />
                  </div>
                );
              })}
            </RepoList>
          ) : (
            <SubTitle>{repoNotice}</SubTitle>
          )}
        </RepoContainer>
        {issues.length > 0 && (
          <IssueContainer>
            <DragDropContext onDragEnd={handleDragEnd}>
              <IssuesColumn issues={issues} />
            </DragDropContext>
          </IssueContainer>
        )}
      </ContentContainer>
    </Container>
  );
}
