from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response(
            {
                "message": "Internal server error",
                "errors": {"detail": ["An unexpected error occurred."]},
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    default_message = "Request failed"
    if response.status_code == status.HTTP_400_BAD_REQUEST:
        default_message = "Validation error"
    elif response.status_code == status.HTTP_401_UNAUTHORIZED:
        default_message = "Authentication failed"
    elif response.status_code == status.HTTP_403_FORBIDDEN:
        default_message = "Permission denied"
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        default_message = "Resource not found"

    detail = response.data.get("detail") if isinstance(response.data, dict) else None
    message = detail if isinstance(detail, str) else default_message

    response.data = {
        "message": message,
        "errors": response.data,
    }
    return response
