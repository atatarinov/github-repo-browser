import { render, screen } from "@testing-library/react";
import { DragDropContext } from "react-beautiful-dnd";
import IssuesColumn from "./IssuesColumn";
import { Issue as IssueApiResponse } from "../APIResponseType";

describe("Issue", () => {
  it("displays issue when given in props", async () => {
    const issues = [
      {
        id: 1,
        title: "some-title",
        created_at: "2021-09-13T19:37:41Z",
        updated_at: "2021-09-13T19:37:41Z",
        assignee: null,
      },
    ] as IssueApiResponse[];

    render(
      <DragDropContext onDragEnd={() => {}}>
        <IssuesColumn issues={issues} />
      </DragDropContext>
    );

    const issueCard = await screen.findByRole("button");
    expect(issueCard).toBeInTheDocument();
  });

  it("renders assignee avatar image when given", async () => {
    const issues = [
      {
        id: 1,
        title: "some-title",
        created_at: "2021-09-13T19:37:41Z",
        updated_at: "2021-09-13T19:37:41Z",
        assignee: {
          avatar_url: "http://some-test-url.com",
        },
      },
    ] as IssueApiResponse[];

    render(
      <DragDropContext onDragEnd={() => {}}>
        <IssuesColumn issues={issues} />
      </DragDropContext>
    );

    const renderedImage = await screen.findByRole("img");
    expect(renderedImage).toBeInTheDocument();
    expect(renderedImage).toHaveAttribute("src", "http://some-test-url.com");
  });
});
