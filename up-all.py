# Скрипт для автоматического запуска всех сервисов проекта.
#
# Использование:
# $ python3 up-all.py 80 3000 3001


import os
import sys


def main():
    if len(sys.argv) < 4:
        print("Not enough arguments.")
        exit(1)

    for i in range(1, 4):
        if not is_int(sys.argv[i]):
            print("Arguments should be numbers.")
            exit(1)

    frontend_port=sys.argv[1]
    api_port=sys.argv[2]
    files_port=sys.argv[3]
    frontend_uri=f"http://localhost:{frontend_port}"
    api_uri=f"http://localhost:{api_port}"
    files_uri=f"http://localhost:{files_port}"
    postgres_password="default"

    print(f"Frontend port: {frontend_port}")
    print(f"API port: {api_port}")
    print(f"Files port: {files_port}")

    if os.path.exists(".env"):
        os.remove(".env")

    with open(".env", "w") as envFile:
        envFile.write(
            f"FRONTEND_PORT={frontend_port}\n" +
            f"API_PORT={api_port}\n" +
            f"FILES_PORT={files_port}\n" +
            f"FRONTEND_URI={frontend_uri}\n" +
            f"API_URI={api_uri}\n" +
            f"FILES_URI={files_uri}\n" +
            f"POSTGRES_PASSWORD={postgres_password}\n"
        )

    os.system("docker compose up -d")

    print("Services URIs:")
    print(f"Frontend: {frontend_uri}")
    print(f"API: {api_uri}")
    print(f"Files: {files_uri}")


def is_int(n: str):
    try:
        int(n)
        return True
    except ValueError:
        return False


if __name__ == "__main__":
    main()

