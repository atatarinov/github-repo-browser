import { useState } from "react";
import { Repo } from "../APIResponseType";

export default function RepositorySummary() {
  const [repos, setRepos] = useState([] as Repo[]);
  const [apiKey, setApiKey] = useState("");

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

  return (
    <div>
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
      {!repos.length ? (
        <h2>No Repos Found</h2>
      ) : (
        <div className="repos-container">
          {repos.map((repo) => {
            return (
              <div className="repos-item" key={repo.id}>
                <h4>{repo.name}</h4>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
