---
title: "CORS for dummies"
date: "2023-10-11"
draft: false
path: "/notes/cors-for-dummies"
---

# What is CORS?

CORS, an abbreviation for "Cross-Origin Resource Sharing," fundamentally aims to ensure that data is distributed only to "trusted" users.
However, this assurance is not server-side but rather on the client side. For instance, if CORS is enabled on a server, it sends additional
response headers, allowing the client to verify whether the request is permitted from the current origin domain.

Modern browsers block access to data that is not considered "trusted" for the current origin domain. These are the CORS errors that often
occur in the browser's network tab. Using developer tools such as Postman, data can be retrieved from origins not deemed "trusted" because
CORS validation is simply ignored. This can occasionally complicate the analysis of such issues.

# What CORS Headers are there?

Here are some of the essential CORS response headers:

- `Access-Control-Allow-Origin`: Specifies which origin domains are allowed to access the resource. Typically, the origin domain of the
  website is specified here.
- `Access-Control-Allow-Methods`: Defines the HTTP methods (e.g., GET, POST, PUT) allowed for accessing the resource.
- `Access-Control-Allow-Headers`: Indicates which HTTP headers are allowed in a request when accessing the resource.

# What are CORS Preflight requests?

Often, the client initially sends an OPTIONS (HTTP method) request to the server to ensure that further requests are allowed. This is
referred to as a "preflight." This is done to prevent scenarios where a POST / PUT / DELETE request is executed from an untrusted origin.

# What do I need to remember?

- CORS is controlled by the backend/server through response headers.
- Browsers/clients interpret the response headers and may report a CORS error.
- Additional trusted domains must be specified as "trusted" server-side in the `Access-Control-Allow-Origin` header.
- Development tools typically ignore CORS.
- CORS Preflight is nothing more than a preceding OPTIONS request to perform CORS validation.
