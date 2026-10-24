from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from ..core.responses.responses import error_response

class PlatformException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class AuthException(PlatformException):
    def __init__(self, message: str = "Clearance credentials verification failed."):
        super().__init__(code="UNAUTHORIZED", message=message, status_code=401)

class NotFoundException(PlatformException):
    def __init__(self, domain: str, identifier: str):
        super().__init__(
            code=f"{domain.upper()}_NOT_FOUND",
            message=f"The requested {domain} identified by {identifier} does not exist.",
            status_code=404
        )

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(PlatformException)
    async def platform_exception_handler(request: Request, exc: PlatformException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(code=exc.code, message=exc.message)
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content=error_response(
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected server anomaly occurred. Logs record this instance."
            )
        )
