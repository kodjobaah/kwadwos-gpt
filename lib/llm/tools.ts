export const my_local_tools = [
    {
            "name": "get_current_weather",
            "description": "Retrieves the current weather for the location you specify.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number",
                        "description": "The latitude of the location.",
                    },
                    "longitude": {
                        "type": "number",
                        "description": "The longitude of the location.",
                    },
                },
                "required": [
                    "latitude",
                    "longitude",
                ]
            }
    }
]