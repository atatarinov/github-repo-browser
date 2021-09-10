import styled from "styled-components";
import { Issue as IssueApiResponse } from "../APIResponseType";

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
`;

type IssueProps = {
  issue: IssueApiResponse;
};

export default function Issue({ issue }: IssueProps) {
  return (
    <Container>
      <img
        src={issue.assignee?.avatar_url}
        alt="avatar"
        width="40"
        height="40"
      />
      <h4>{issue.title}</h4>
      <h4>{issue.created_at}</h4>
      <h4>{issue.updated_at}</h4>
    </Container>
  );
}
