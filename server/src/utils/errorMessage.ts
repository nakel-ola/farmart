const errorMessage = (err: any) => {
  if (err.errors) {
    const errorMsg = err.errors.map((error: any) => error.message).join(",");
    return errorMsg;
  }
  return err.message;
};
export default errorMessage;
