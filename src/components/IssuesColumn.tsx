import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Issue from "./Issue";
import { Issue as IssueApiResponse } from "../APIResponseType";

const Container = styled.div`
  width: 100%;
`;

const IssueList = styled.div`
  padding: 8px;
  margin-top: 9px;
`;

type IssuesColumnProps = {
  issues: IssueApiResponse[];
};

export default function IssuesColumn({ issues }: IssuesColumnProps) {
  return (
    <Container>
      <Droppable droppableId={"issue-column"}>
        {(provided) => (
          <IssueList {...provided.droppableProps} ref={provided.innerRef}>
            {issues.map((issue, index) => (
              <Issue key={issue.id} issue={issue} index={index} />
            ))}
            {provided.placeholder}
          </IssueList>
        )}
      </Droppable>
    </Container>
  );
}
