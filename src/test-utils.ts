import { setupServer } from "msw/node";

type MswServer = ReturnType<typeof setupServer>;

export function setupMsw(): MswServer {
  const server = setupServer();
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  return server;
}
