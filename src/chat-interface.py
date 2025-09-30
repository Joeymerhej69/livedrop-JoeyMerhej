#!/usr/bin/env python3
"""Simple CLI to call the deployed RAG API exposed via ngrok.

Usage: set the RAG_API_URL env var or pass the URL when prompted.
"""
import os
import requests
import sys
import time

RAG_API_URL = os.environ.get("RAG_API_URL")


def ask_loop(api_url=None):
    url = api_url or RAG_API_URL or input("Enter RAG API URL (ngrok): ")
    print(f"Using API: {url}")
    while True:
        try:
            q = input("\n> ")
            if q.strip().lower() in ("exit", "quit"):
                break
            print("[Retrieving context...]")
            resp = requests.post(url.rstrip('/') + '/chat', json={"question": q}, timeout=30)
            if resp.status_code != 200:
                print("Error from API:", resp.status_code, resp.text)
                continue
            data = resp.json()
            print('\nAnswer:', data.get('answer'))
            print('Sources:', data.get('sources'))
            print('Confidence:', data.get('confidence', 'n/a'))
        except requests.exceptions.RequestException as e:
            print("Connection error:", e)
            time.sleep(1)
        except KeyboardInterrupt:
            print('\nbye')
            break


if __name__ == '__main__':
    ask_loop()
