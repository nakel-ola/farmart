"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableException = exports.InternalServerErrorException = exports.RequestTimeoutException = exports.NotAcceptableException = exports.ForbiddenException = exports.NotFoundException = exports.UnauthorizedException = exports.BadRequestException = void 0;
const error_1 = require("graphql/error");
const exception = (message, code, status) => new error_1.GraphQLError(message, { extensions: { code, status } });
const BadRequestException = (message) => exception(message, 400, "Bad Request");
exports.BadRequestException = BadRequestException;
const UnauthorizedException = (message) => exception(message, 401, "Unauthorized");
exports.UnauthorizedException = UnauthorizedException;
const NotFoundException = (message) => exception(message, 404, "Not Found");
exports.NotFoundException = NotFoundException;
const ForbiddenException = (message) => exception(message, 403, "Forbidden");
exports.ForbiddenException = ForbiddenException;
const NotAcceptableException = (message) => exception(message, 406, "Not Acceptable");
exports.NotAcceptableException = NotAcceptableException;
const RequestTimeoutException = (message) => exception(message, 408, "Request Timeout");
exports.RequestTimeoutException = RequestTimeoutException;
const InternalServerErrorException = (message) => exception(message, 500, "Internal Server Error");
exports.InternalServerErrorException = InternalServerErrorException;
const ServiceUnavailableException = (message) => exception(message, 503, "Service Unavailable");
exports.ServiceUnavailableException = ServiceUnavailableException;
