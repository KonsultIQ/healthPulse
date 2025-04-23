FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app.py  app.py

EXPOSE 5001

ENV FLASK_APP=app.py
ENV FLASK_ENV=production