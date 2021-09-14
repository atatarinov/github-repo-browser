import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupMsw } from "../test-utils";
import RepoSummary from "./RepoSummary";

describe("RepoSummary", () => {
  const server = setupMsw();

  describe("Login Form", () => {
    it("displays login form on page load", () => {
      render(<RepoSummary />);

      const page = screen.getByText(/please enter your github api key/i);
      expect(page).toBeInTheDocument();
    });

    it("hides login form after api key is entered", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              repos_url: "https://api.github.com/users/some-user/repos",
            })
          );
        })
      );

      server.use(
        rest.get(
          "https://api.github.com/users/some-user/repos",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  id: 1,
                  name: "some-repo-name",
                  full_name: "some-full-name",
                  open_issues: 0,
                },
              ])
            );
          }
        )
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      await waitFor(async () => {
        expect(await screen.findByText("some-repo-name")).toBeInTheDocument();
      });

      expect(
        screen.queryByText("No Repos Found For This Key")
      ).not.toBeInTheDocument();
    });

    it("shows user alert when api key is invalid", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(ctx.status(401));
        })
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      expect(await screen.findByText("Invalid API Key")).toBeInTheDocument();
    });

    it("shows user alert if there is network error", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      expect(await screen.findByText("Invalid API Key")).toBeInTheDocument();
    });

    it("hides user alert after user starts typing the key again", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(ctx.status(401));
        })
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some wrong api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      expect(await screen.findByText("Invalid API Key")).toBeInTheDocument();

      fireEvent.change(inputArea, {
        target: {
          value: "something",
        },
      });

      expect(screen.queryByText("Invalid API Key")).not.toBeInTheDocument();
    });
  });

  describe("fetch repos", () => {
    it("displays repos when given from API", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              repos_url: "https://api.github.com/users/some-user/repos",
            })
          );
        })
      );

      server.use(
        rest.get(
          "https://api.github.com/users/some-user/repos",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  id: 1,
                  name: "first-repo",
                  full_name: "some-user/first-repo",
                  open_issues: 0,
                },
                {
                  id: 2,
                  name: "second-repo",
                  full_name: "some-user/second-repo",
                  open_issues: 0,
                },
              ])
            );
          }
        )
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      await waitFor(() => {
        expect(screen.getByText("first-repo")).toBeInTheDocument();
        expect(screen.getByText("second-repo")).toBeInTheDocument();
      });
    });
    it("shows user alert if no repos available", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              repos_url: "https://api.github.com/users/some-user/repos",
            })
          );
        })
      );

      server.use(
        rest.get(
          "https://api.github.com/users/some-user/repos",
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json([]));
          }
        )
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      expect(
        await screen.findByRole("heading", {
          name: "No Repos Found For This Key",
        })
      ).toBeInTheDocument();
    });

    it("shows user alert if there is network error", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              repos_url: "https://api.github.com/users/some-user/repos",
            })
          );
        })
      );

      server.use(
        rest.get(
          "https://api.github.com/users/some-user/repos",
          (_, res, ctx) => {
            return res(ctx.status(500));
          }
        )
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      expect(
        await screen.findByRole("heading", {
          name: "No Repos Found For This Key",
        })
      ).toBeInTheDocument();
    });
  });

  describe("fetch issues", () => {
    it("displays issues when given from API", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              repos_url: "https://api.github.com/users/some-user/repos",
            })
          );
        })
      );

      server.use(
        rest.get(
          "https://api.github.com/users/some-user/repos",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  id: 1,
                  name: "first-repo",
                  full_name: "some-user/first-repo",
                  open_issues: 1,
                },
              ])
            );
          }
        )
      );

      server.use(
        rest.get(
          "https://api.github.com/repos/some-user/first-repo/issues",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  id: 1,
                  title: "some-issue-title",
                  created_at: new Date(),
                  updated_at: new Date(),
                  assignee: null,
                },
              ])
            );
          }
        )
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      await waitFor(() => {
        expect(screen.getByText("first-repo")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("first-repo"));

      await waitFor(() => {
        expect(screen.getByText("some-issue-title")).toBeInTheDocument();
      });
    });

    it("does not display issues when no issues available", async () => {
      server.use(
        rest.get("https://api.github.com/user", (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              repos_url: "https://api.github.com/users/some-user/repos",
            })
          );
        })
      );

      server.use(
        rest.get(
          "https://api.github.com/users/some-user/repos",
          (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  id: 1,
                  name: "first-repo",
                  full_name: "some-user/first-repo",
                  open_issues: 0,
                },
              ])
            );
          }
        )
      );

      server.use(
        rest.get(
          "https://api.github.com/repos/some-user/first-repo/issues",
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json([]));
          }
        )
      );

      render(<RepoSummary />);

      const inputArea = screen.getByPlaceholderText("Type the key...");

      fireEvent.change(inputArea, {
        target: {
          value: "some api key",
        },
      });

      userEvent.click(screen.getByRole("button", { name: /show repos/i }));

      await waitFor(() => {
        expect(screen.getByText("first-repo")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("first-repo"));

      await waitFor(() => {
        expect(screen.queryByText(/created/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/last updated/i)).not.toBeInTheDocument();
      });
    });
  });
});
