import { render, screen } from "@testing-library/react";
import Repo from "./Repo";

describe("Repo", () => {
  it("renders repo when given one", () => {
    render(<Repo name="some name" issueCount={0} />);

    expect(screen.getByText("some name")).toBeInTheDocument();
    expect(screen.getByText("Open issues 0")).toBeInTheDocument();
  });
});
