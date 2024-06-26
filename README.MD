# HTTP Request Handler

## Description

The HTTP Request Handler is a flexible and powerful library for crafting and executing HTTP requests in TypeScript. It provides a set of customizable hooks and utilities for handling various HTTP methods, response parsing, and error handling. This library leverages the `@ocubist/error-alchemy` package for robust error handling and utilizes `Zod` schemas extensively to ensure advanced type-safety with comprehensive type inference.

## Installation

To install the HTTP Request Handler, use npm or yarn:

```bash
npm install @ocubist/http-request-handler
# or
yarn add @ocubist/http-request-handler
```

## Usage

### Basic Example

```ts
import { useHttpRequestHandler } from "@ocubist/http-request-handler";
import { z } from "zod";

// Define your Zod schemas
const pathParamsSchema = z.object({
  userId: z.string(),
});

const queryParamsSchema = z.object({
  includePosts: z.boolean(),
});

const responseBodySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

// Initialize the HTTP request handler
const { craftGetRequest } = useHttpRequestHandler({
  baseUrl: "https://api.example.com",
});

// Craft a GET request
const getUser = craftGetRequest({
  pathParamsSchema,
  queryParamsSchema,
  responseBodySchema,
  endpointTemplate: "/users/{userId}",
});

// Use the crafted request function
const fetchUser = async (userId: string) => {
  try {
    const response = await getUser({
      pathParams: { userId },
      queryParams: { includePosts: true },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const userResponse = await fetchUser("123");

if (userResponse) {
  const { id, name, email } = userResponse.data;
  console.log(`Fetched user '${name}' with id '${id}' and email '${email}'`);
  // Fetched user 'USER_NAME' with id '123' and email 'EMAIL'
}
```

### Advanced Example with POST Request

```ts
import { useHttpRequestHandler } from "@ocubist/http-request-handler";
import { z } from "zod";

// Define your Zod schemas
const pathParamsSchema = z.object({
  userId: z.string(),
});

const queryParamsSchema = z.object({});

const requestBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const responseBodySchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    post: z.object({
      postId: z.string(),
      title: z.string(),
      content: z.string(),
    }),
  }),
});

// Initialize the HTTP request handler
const { craftPostRequest } = useHttpRequestHandler({
  baseUrl: "https://api.example.com",
});

// Craft a POST request
const createPost = craftPostRequest({
  pathParamsSchema,
  queryParamsSchema,
  requestBodySchema,
  responseBodySchema,
  endpointTemplate: "/users/{userId}/posts",
});

// Use the crafted request function
const submitPost = async (userId: string, title: string, content: string) => {
  try {
    const response = await createPost({
      pathParams: { userId },
      queryParams: {},
      requestBody: { title, content },
    });
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

const postResponse = await submitPost(
  "123",
  "Hello World",
  "This is my first post."
);

if (postResponse) {
  const { user, post } = postResponse.data;
  console.log(
    `Post by user '${user.name}' with id '${user.userId}' and title '${post.title}': "${post.content}"`
  );
  // Post by user 'USER_NAME' with id '123' and title 'Hello World': "This is my first post."
}
```

## API Documentation

### `useHttpRequestHandler`

#### Description

The `useHttpRequestHandler` function initializes the HTTP request handler with the provided configurations. It returns a set of factory functions to craft different types of HTTP requests, such as GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, PURGE, LINK, and UNLINK.

#### Parameters

- `props: UseHttpRequestHandlerProps`
  - `baseUrl: string`
  - `headers?: Headers`
  - `retryOptions?: OptionalRetryOptions`
  - `timeout?: Timeout`
  - `responseType?: ResponseType`
  - `logger?: Logger`

#### Returns

- `UseHttpRequestHandlerReturn`
  - `craftGetRequest: Function`
  - `craftPostRequest: Function`
  - `craftPutRequest: Function`
  - `craftDeleteRequest: Function`
  - `craftPatchRequest: Function`
  - `craftOptionsRequest: Function`
  - `craftHeadRequest: Function`
  - `craftPurgeRequest: Function`
  - `craftLinkRequest: Function`
  - `craftUnlinkRequest: Function`

### `craftGetRequest`, `craftDeleteRequest`, `craftOptionsRequest`

#### Description

The `useHttpRequestHandler` function initializes the HTTP request handler with the provided configurations. It returns a set of factory functions to craft different types of HTTP requests, such as GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD, PURGE, LINK, and UNLINK.

#### Parameters

- `factoryProps: FactoryFunctionPropsWithoutRequestBody`
  - `endpointTemplate?: string`
  - `pathParamsSchema: ZodSchema`
  - `queryParamsSchema: ZodSchema`
  - `responseBodySchema?: ZodSchema`
  - `headers?: Headers`
  - `retryOptions?: OptionalRetryOptions`
  - `timeout?: Timeout`
  - `responseType?: ResponseType`
  - `logger?: Logger`

#### Returns

- `RequestFunctionWithoutRequestBody`

### `craftPostRequest`, `craftPutRequest`, `craftPatchRequest`, `craftPurgeRequest`, `craftLinkRequest`, `craftUnlinkRequest`

#### Description

These factory functions are used to create HTTP request functions for the respective HTTP methods (POST, PUT, PATCH, PURGE, LINK, UNLINK) with a request body. They ensure the request is crafted with the specified configurations and validate both the request body and the response using the provided Zod schemas.

#### Parameters

- `factoryProps: FactoryFunctionProps`
  - `endpointTemplate?: string`
  - `pathParamsSchema: ZodSchema`
  - `queryParamsSchema: ZodSchema`
  - `requestBodySchema: ZodSchema`
  - `responseBodySchema?: ZodSchema`
  - `headers?: Headers`
  - `retryOptions?: OptionalRetryOptions`
  - `timeout?: Timeout`
  - `responseType?: ResponseType`
  - `logger?: Logger`

#### Returns

- `RequestFunctionWithRequestBody`

### `craftHeadRequest`

#### Description

The `craftHeadRequest` function is used to create an HTTP HEAD request function. HEAD requests are used to retrieve the headers for a specific resource without fetching the body.

#### Returns

- `() => Promise<HttpResponse<{}, {}, never, never>>`

### `makeHttpRequest`

#### Description

The `makeHttpRequest` function directly performs an HTTP request with the provided configurations. It is a lower-level function compared to the crafted request functions and can be used when more direct control over the request is needed.

#### Parameters

- `props: MakeHttpRequestProps`
  - `urlTemplate: string`
  - `method: Method`
  - `headers?: Headers`
  - `timeout?: Timeout`
  - `retryOptions?: OptionalRetryOptions`
  - `responseType?: ResponseType`
  - `pathParams?: ParamWithOptionalSchema<TPathParams>`
  - `queryParams?: ParamWithOptionalSchema<TQueryParams>`
  - `requestBody?: ParamWithOptionalSchema<TRequestBody>`
  - `responseBodySchema?: ZodSchema<TResponseBody>`
  - `logger?: Logger`

#### Returns

- `Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>`

### Functions Crafted by Factory Functions

#### Description

These functions are crafted by the factory functions returned by `useHttpRequestHandler`. They are used to execute HTTP requests with the specified configurations.

#### Parameters

- `params: RequestParamsWithoutRequestBody | RequestParamsWithRequestBody`
  - `pathParams: TPathParams`
  - `queryParams: TQueryParams`
  - `requestBody?: TRequestBody` (only for functions crafted by `craftPostRequest`, `craftPutRequest`, `craftPatchRequest`, `craftPurgeRequest`, `craftLinkRequest`, `craftUnlinkRequest`)

#### Returns

- `Promise<HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>>`

## Error Handling

### Description

The HTTP Request Handler uses the `@ocubist/error-alchemy` package for robust error handling. All errors thrown by this library are instances of the `MysticError` class, which extends the `TransmutedError` class from `@ocubist/error-alchemy`. This provides a rich error handling experience, including detailed error properties and a consistent error structure.

### Error Types

#### `PathParameterParsingError`

Occurs when the provided path parameters do not match the expected schema defined by Zod.

#### `QueryParsingError`

Occurs when the provided query parameters do not match the expected schema defined by Zod.

#### `RequestBodyParsingError`

Occurs when the provided request body does not match the expected schema defined by Zod.

#### `HttpResponseError`

Occurs when the server responds with an error status code.

#### `NetworkError`

Occurs when there is a network connectivity issue.

#### `TimeoutError`

Occurs when the request times out.

#### `UnexpectedAxiosError`

Occurs when an unexpected error occurs within Axios.

#### `UnexpectedError`

Occurs when an unexpected error occurs that doesn't fit into the other categories.

### Properties of `MysticError`

- `instanceUuid: string` - A unique identifier for the error instance.
- `name: string` - The name of the error.
- `severity: Severity` - The severity level of the error.
- `origin?: unknown` - The original error that caused this error.
- `cause?: string` - A brief description of the cause of the error.
- `payload: Payload` - Additional data that help debugging
- `module?: string` - The module in which the error occurred.
- `context?: string` - The context in which the error occurred.
- `errorCode: ErrorCode` - A code representing the error type.
- `message: string` - A message describing the error.
- `stack?: string` - The stack trace at the point where the error was thrown.

These properties provide comprehensive details about the error, making it easier to diagnose and handle errors effectively.

## License

The HTTP Request Handler is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
