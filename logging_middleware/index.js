const DEFAULT_ENDPOINT = "http://20.207.122.201/evaluation-service/logs";
const VALID_STACKS = new Set(["backend", "frontend"]);
const VALID_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const VALID_PACKAGES = new Set([
  "api",
  "auth",
  "component",
  "config",
  "hook",
  "middleware",
  "page",
  "state",
  "style",
  "utils",
]);

function createEvaluationLogger(options = {}) {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const fetchImpl = options.fetchImpl ?? fetch;
  const getAccessToken = options.getAccessToken ?? (() => null);
  const onFailure = options.onFailure ?? (() => {});

  return async function log(stack, level, packageName, message) {
    if (
      !VALID_STACKS.has(stack) ||
      !VALID_LEVELS.has(level) ||
      !VALID_PACKAGES.has(packageName) ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return;
    }

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        return;
      }

      await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message: message.trim().slice(0, 120),
        }),
        cache: "no-store",
      });
    } catch (error) {
      onFailure(error);
    }
  };
}

module.exports = {
  VALID_LEVELS,
  VALID_PACKAGES,
  VALID_STACKS,
  createEvaluationLogger,
};
