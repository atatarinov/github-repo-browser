import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Issue as IssueApiResponse } from "../APIResponseType";

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  background-color: white;
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
          <img
            src={issue.assignee?.avatar_url}
            alt="avatar"
            width="40"
            height="40"
          />
          <p>{issue.title}</p>
          <p>{issue.created_at}</p>
          <p>{issue.updated_at}</p>
        </Container>
      )}
    </Draggable>
  );
}
