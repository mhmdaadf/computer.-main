from rest_framework.renderers import JSONRenderer


class StandardJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        renderer_context = renderer_context or {}
        response = renderer_context.get("response")
        status_code = getattr(response, "status_code", 200)
        success = 200 <= status_code < 300

        if isinstance(data, dict) and "success" in data and ("data" in data or "errors" in data):
            payload = data
        elif success:
            payload = {
                "success": True,
                "message": "",
                "data": data,
            }
        else:
            if isinstance(data, dict):
                payload = {
                    "success": False,
                    "message": data.get("message", "Request failed"),
                    "errors": data.get("errors", data),
                }
            else:
                payload = {
                    "success": False,
                    "message": "Request failed",
                    "errors": data,
                }

        return super().render(payload, accepted_media_type, renderer_context)
