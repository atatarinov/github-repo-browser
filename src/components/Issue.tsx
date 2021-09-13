import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Github } from "@styled-icons/bootstrap/Github";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
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

const TitleContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 13px;
`;

const DatesContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const LastUpdatedDate = styled.p`
  margin-top: 5px;
`;

const AvatarPlaceholderIcon = styled(Github)`
  height: 40px;
  margin-right: 5px;
  color: grey;
`;

const AvatarIcon = styled.img`
  height: 40px;
  height: 40px;
  border-radius: 50%;
`;

type IssueProps = {
  issue: IssueApiResponse;
  index: number;
};

export default function Issue({ issue, index }: IssueProps) {
  const cteatedDate = dayjs(issue.created_at).format("DD/MM/YYYY");
  dayjs.extend(relativeTime);
  const lastUpdated = dayjs(issue.updated_at).fromNow();

  const avatar = issue.assignee?.avatar_url ? (
    <AvatarIcon src={issue.assignee?.avatar_url} />
  ) : (
    <AvatarPlaceholderIcon />
  );

  return (
    <Draggable draggableId={issue.id.toString()} index={index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <TitleContent>
            <Title>{issue.title}</Title>
            {avatar}
          </TitleContent>
          <DatesContent>
            <p>Created {cteatedDate}</p>
            <LastUpdatedDate>Last updated {lastUpdated}</LastUpdatedDate>
          </DatesContent>
        </Container>
      )}
    </Draggable>
  );
}
