import { createServer } from "./server";

const app = createServer();

// Use HTTP for all environments
app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
