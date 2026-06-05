import { execSync } from "child_process";

try {
  const result = execSync(
    `netstat -ano | findstr :3000 | findstr LISTENING`,
    { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
  );
  const lines = result.trim().split("\n");
  lines.forEach((line) => {
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && pid !== "0") {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "pipe" });
        console.log(`Killed stale process PID ${pid} on port 3000`);
      } catch {}
    }
  });
} catch {
  // port is free
}
