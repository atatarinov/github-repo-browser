import styled from "styled-components";
import Issue from "./Issue";
import { Issue as IssueApiResponse } from "../APIResponseType";

const Container = styled.div`
  width: 50%;
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
`;

const Title = styled.h3`
  padding: 8px;
`;

const IssueList = styled.div`
  padding: 8px;
`;

type IssuesColumnProps = {
  issues: IssueApiResponse[];
};

export default function IssuesColumn({ issues }: IssuesColumnProps) {
  return (
    <Container>
      <Title>Issues</Title>
      <IssueList>
        {issues.map((issue) => (
          <Issue key={issue.id} issue={issue} />
        ))}
      </IssueList>
    </Container>
  );
}
