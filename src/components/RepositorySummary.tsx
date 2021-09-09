import { useState } from "react";
import { Repo, Issue } from "../APIResponseType";

export default function RepositorySummary() {
  const [apiKey, setApiKey] = useState("");
  const [repos, setRepos] = useState([] as Repo[]);
  const [issues, setIssues] = useState([] as Issue[]);

  async function requestRepos() {
    if (apiKey) {
      const response = await fetch("https://api.github.com/user", {
        headers: { Authorization: `bearer ${apiKey}` },
      });

      const userInfo = await response.json();
      const reposResponse = await fetch(userInfo.repos_url);
      const repos = await reposResponse.json();

      setRepos(repos);
      setApiKey("");
    }
  }

  async function requestIssuesForRepo(repoName: string) {
    const response = await fetch(
      `https://api.github.com/repos/${repoName}/issues`
    );

    const issues = await response.json();
    setIssues(issues);
  }

  return (
    <div className="content-container">
      <div className="input-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestRepos();
          }}
        >
          <label htmlFor="apiKey">Please enter your GitHub API key</label>
          <input
            placeholder="API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button>Submit</button>
        </form>
      </div>
      <div className="repos-summary">
        <div className="repos-container">
          {repos.length ? (
            <div>
              {repos.map((repo) => {
                return (
                  <div
                    className="repos-item"
                    key={repo.id}
                    onClick={(_) => requestIssuesForRepo(repo.full_name)}
                  >
                    <h4>{repo.name}</h4>
                  </div>
                );
              })}
            </div>
          ) : (
            <h3>No Repos Found</h3>
          )}
        </div>
        <div className="issues-container">
          {issues.length
            ? issues.map((issue) => (
                <div className="issues-item" key={issue.id}>
                  <img
                    src={issue.assignee?.avatar_url}
                    alt="User avatar"
                    width="40"
                    height="40"
                  />
                  <h4>{issue.title}</h4>
                  <h4>{issue.created_at}</h4>
                  <h4>{issue.updated_at}</h4>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
