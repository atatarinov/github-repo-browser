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
  @media (max-width: 760px) {
    width: 40%;
  }
  @media (max-width: 600px) {
    width: 40%;
  }
`;

const IssueContainer = styled.div`
  display: flex;
  width: 20%;
  margin: 2rem;
  justify-content: center;
`;

const UserNotice = styled.h4`
  padding: 8px;
  @media (max-width: 600px) {
    padding: 0;
  }
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
  @media (max-width: 760px) {
    width: 60%;
  }
`;

const Button = styled.button`
  color: white;
  background-color: #2ba44e;
  border-radius: 5px;
  border: 1px solid lightgrey;
  font-size: 16px;
  margin-left: 1rem;
  margin-right: 1rem;
  width: 8rem;
  @media (max-width: 760px) {
    width: 30%;
    font-size: 12px;
  }
  @media (max-width: 600px) {
    font-size: 10px;
  }
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
    const NO_REPOS_RESPONSE = "No Repos Found For This Key";
    let userInfo;

    if (apiKey) {
      try {
        const response = await fetch("https://api.github.com/user", {
          headers: { Authorization: `bearer ${apiKey}` },
        });

        if (response.status !== 200) {
          setApiKey("");
          setRepoNotice("Invalid API Key");
          return;
        }

        userInfo = await response.json();
        sessionStorage.setItem("apiKey", apiKey);
      } catch (error) {
        console.error("Error while validating user ", error);
        setApiKey("");
        setRepoNotice("Invalid API Key");
        return;
      }
    }

    if (userInfo) {
      try {
        const reposResponse = await fetch(userInfo.repos_url);

        if (reposResponse.status !== 200) {
          setApiKey("");
          setRepoNotice(NO_REPOS_RESPONSE);
          return;
        }

        const repos = await reposResponse.json();

        setRepos(repos);
        setApiKey("");
        setShowLoginForm(false);

        if (repos.length === 0) {
          setRepoNotice(NO_REPOS_RESPONSE);
        }
      } catch (error) {
        console.error("Error while fetching repos ", error);
        setApiKey("");
        setRepoNotice(NO_REPOS_RESPONSE);
        return;
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

        createIssueList(issues, repoName);
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

  function createIssueList(issues: Issue[], repoName: string) {
    const issueList: Record<number, Issue> = {};

    const existingIssuesIds = sessionStorage.getItem(repoName);
    const parsedIssuesIds = existingIssuesIds
      ? JSON.parse(existingIssuesIds)
      : null;

    const issueIds = issues.map((issue) => {
      issueList[issue.id] = issue;
      return issue.id;
    });

    let currentIssues;

    if (parsedIssuesIds && parsedIssuesIds.length === issues.length) {
      currentIssues = parsedIssuesIds.map((issueId: number) => {
        return issueList[issueId];
      });

      setIssueIds(parsedIssuesIds);
    } else {
      currentIssues = issueIds.map((issueId: number) => {
        return issueList[issueId];
      });

      if (issueIds.length > 0) {
        sessionStorage.setItem(repoName, JSON.stringify(issueIds));
      }
      setIssueIds(issueIds);
    }

    setIssues(currentIssues);
    setIssueList(issueList);
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

    sessionStorage.setItem(currentRepo, JSON.stringify(newIssueIds));
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
            <UserNotice>{repoNotice}</UserNotice>
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
