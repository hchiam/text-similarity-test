# -*- coding: utf-8 -*-
"""text-similarity-test_gpt4all-j_groovy.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1dO0IKyncxta37RObJ-8-z9YXypp-lVek
"""

# Commented out IPython magic to ensure Python compatibility.
# %%capture
# !pip install gpt4all
# import gpt4all
# model = gpt4all.GPT4All("ggml-gpt4all-j-v1.3-groovy.bin")
# # model.chat_completion() doc: https://docs.gpt4all.io/gpt4all_python.html#gpt4all.gpt4all.GPT4All.chat_completion
# # other documentation: https://github.com/nomic-ai/gpt4all/blob/main/gpt4all-bindings/python/docs/gpt4all_python.md

def print_response(prompt: str) -> str:
  messages = [{'role': 'user', 'content': prompt}]
  response = model.chat_completion(messages)
  print(response)
  # print(response.get('choices',[{'message':{'content':''}}])[0]['message']['content'])

print_response("""Your task is to indicate how similar the student answer is to the teacher answer. Only say "not similar at all", or "similar", or "exact match", don't say anything else.

# Teacher answer:
Purple.

# Student answer:
A colour.
""")