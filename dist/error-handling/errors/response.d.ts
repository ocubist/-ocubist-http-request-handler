/// <reference types="node" />
/**
 * Error representing an issue parsing the server response.
 */
export declare const ResponseParsingError: {
    new (props: {
        message: string;
        origin?: unknown;
        payload?: Record<string, unknown> | undefined;
    }): {
        dynamicClassUuid: string;
        instanceUuid: string;
        name: string;
        severity: import("@ocubist/error-alchemy").Severity;
        origin?: unknown;
        cause?: string | undefined;
        payload: Record<string, unknown>;
        module?: string | undefined;
        context?: string | undefined;
        errorCode: import("@ocubist/error-alchemy").ErrorCode;
        readonly severityDescription: string;
        readonly simpleGetter: string;
        readonly identifier: string;
        message: string;
        stack?: string | undefined;
    };
    compare(err: unknown): boolean;
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
//# sourceMappingURL=response.d.ts.map