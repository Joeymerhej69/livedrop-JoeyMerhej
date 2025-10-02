import ipywidgets as widgets
from IPython.display import display, Markdown
import requests

PUBLIC_URL = ngrok.get_tunnels()[0].public_url
print(f"✅ Chat endpoint: {PUBLIC_URL}/chat")

chat_box = widgets.Output()
text_input = widgets.Text(placeholder='Ask your question...')
send_button = widgets.Button(description='Send', button_style='primary')

def on_send(b):
    user_input = text_input.value.strip()
    if not user_input:
        return

    with chat_box:
        display(Markdown(f"**You:** {user_input}"))

        try:
            response = requests.post(f"{PUBLIC_URL}/chat", json={"query": user_input})
            if response.status_code == 200:
                data = response.json()
                answer = data.get("answer", "(No answer)")
                sources = ", ".join(data.get("sources", [])) or "Unknown"
                confidence = data.get("confidence", "Unknown")
                prompt_used = data.get("prompt_used", "Unknown")

                bot_reply = f"**Answer:** {answer}\n\n**Source(s):** {sources}\n\n**Confidence:** {confidence}"
            else:
                bot_reply = f"(Error {response.status_code}: {response.text})"
        except Exception as e:
            bot_reply = f"(Error calling API: {e})"

        display(Markdown(f"**Bot:** {bot_reply}"))

    text_input.value = ""  

send_button.on_click(on_send)

display(widgets.VBox([text_input, send_button, chat_box]))
