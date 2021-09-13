import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Issue as IssueApiResponse } from "../APIResponseType";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid lightgrey;
  padding: 15px;
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: white;
`;

const IssueTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;
const IssueDates = styled.div`
  display: flex;
  justify-content: space-between;
`;

type IssueProps = {
  issue: IssueApiResponse;
  index: number;
};

export default function Issue({ issue, index }: IssueProps) {
  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <IssueTitle>
            <img
              src={issue.assignee?.avatar_url}
              alt="avatar"
              width="40"
              height="40"
            />
            <p>{issue.title}</p>
          </IssueTitle>
          <IssueDates>
            <p>{issue.created_at}</p>
            <p>{issue.updated_at}</p>
          </IssueDates>
        </Container>
      )}
    </Draggable>
  );
}
