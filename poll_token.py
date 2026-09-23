import time
import requests
import os
import json

device_code = "kVoxwOX7JMUmKRpwgbzqtkc8aMUOzKYUHqGM4xoEdVM"
interval = 5

while True:
    try:
        response = requests.post(
            "https://antideploy.com/api/v1/device/token",
            json={"deviceCode": device_code}
        )
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get("token")
            if token:
                config_dir = os.path.expanduser("~/.antideploy")
                os.makedirs(config_dir, exist_ok=True)
                config_path = os.path.join(config_dir, "config.json")
                with open(config_path, "w") as f:
                    json.dump({"token": token}, f)
                # Ensure correct permissions
                try:
                    os.chmod(config_path, 0o600)
                except Exception:
                    pass
                print("Token successfully retrieved and saved.")
                break
        elif response.status_code == 400:
            data = response.json()
            error = data.get("error")
            if error == "authorization_pending":
                # Keep polling
                time.sleep(interval)
                continue
            elif error == "access_denied":
                print("User denied access.")
                break
            elif error == "expired_token":
                print("Token expired.")
                break
            else:
                print(f"Unknown error: {error}")
                time.sleep(interval)
        else:
            print(f"Unexpected status code: {response.status_code}")
            time.sleep(interval)
    except Exception as e:
        print(f"Polling error: {e}")
        time.sleep(interval)
