FROM python:3.12-slim
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY pyproject.toml .
RUN uv pip install --system --no-cache \
    paho-mqtt psycopg2-binary pydantic-settings python-dotenv sqlalchemy
COPY Subscriber/ .
CMD ["python", "main.py"]
