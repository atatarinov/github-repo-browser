import { render, screen } from "@testing-library/react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Issue from "./Issue";

describe("Issue", () => {
  it("displays issue when given one", () => {
    const issue = {
      id: 1,
      title: "some-issue-title",
      created_at: "2021-09-13T19:37:41Z",
      updated_at: "2021-09-13T19:37:41Z",
      assignee: null,
    };
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId={"issue-column"}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Issue key={issue.id} issue={issue} index={1} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );

    expect(screen.getByText("some-issue-title")).toBeInTheDocument();
    expect(screen.getByText("Created 13/09/2021")).toBeInTheDocument();
  });
});
