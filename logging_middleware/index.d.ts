export type EvaluationStack = "backend" | "frontend";
export type EvaluationLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type EvaluationPackage =
  | "api"
  | "auth"
  | "component"
  | "config"
  | "hook"
  | "middleware"
  | "page"
  | "state"
  | "style"
  | "utils";

export declare const VALID_STACKS: Set<EvaluationStack>;
export declare const VALID_LEVELS: Set<EvaluationLevel>;
export declare const VALID_PACKAGES: Set<EvaluationPackage>;

export interface EvaluationLoggerOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  getAccessToken?: () => string | null | Promise<string | null>;
  onFailure?: (error: unknown) => void;
}

export declare function createEvaluationLogger(
  options?: EvaluationLoggerOptions,
): (
  stack: EvaluationStack,
  level: EvaluationLevel,
  packageName: EvaluationPackage,
  message: string,
) => Promise<void>;
