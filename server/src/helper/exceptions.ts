import { GraphQLError } from "graphql/error";

const exception = (message: string, code: number, status: string) =>
  new GraphQLError(message, { extensions: { code, status } });

const BadRequestException = (message: string) =>
  exception(message, 400, "Bad Request");

const UnauthorizedException = (message: string) =>
  exception(message, 401, "Unauthorized");

const NotFoundException = (message: string) =>
  exception(message, 404, "Not Found");

const ForbiddenException = (message: string) =>
  exception(message, 403, "Forbidden");

const NotAcceptableException = (message: string) =>
  exception(message, 406, "Not Acceptable");

const RequestTimeoutException = (message: string) =>
  exception(message, 408, "Request Timeout");

const InternalServerErrorException = (message: string) =>
  exception(message, 500, "Internal Server Error");

const ServiceUnavailableException = (message: string) =>
  exception(message, 503, "Service Unavailable");

export {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  InternalServerErrorException,
  ServiceUnavailableException,
};
