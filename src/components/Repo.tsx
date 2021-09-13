import styled from "styled-components";
import { GitRepository } from "@styled-icons/remix-line/GitRepository";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid lightgrey;
  padding: 15px;
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: white;
  height: 3rem;
  :hover {
    background-color: #f5f8fa;
  }
`;

const RepoName = styled.div`
  font-weight: bold;
  font-size: 15px;
  display: inline-block;
  :hover {
    cursor: pointer;
    color: #166dd7;
  }
`;

const RepoContent = styled.div``;

const IssueCount = styled.div`
  font-size: 12px;
  margin-top: 5px;
  margin-top: 16px;
`;

const RepoIcon = styled(GitRepository)`
  height: 18px;
  margin-right: 5px;
  color: grey;
`;

type RepoProps = {
  name: string;
  issueCount: number;
};

export default function Repo({ name, issueCount }: RepoProps) {
  return (
    <Container>
      <RepoContent>
        <RepoIcon />
        <RepoName>{name}</RepoName>
      </RepoContent>
      <IssueCount>Open issues {issueCount}</IssueCount>
    </Container>
  );
}
