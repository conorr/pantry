import pandas as pd
import json

df = pd.read_csv('./inventory.csv')
df = df.fillna(0)
df.invoice = df.invoice.astype(str)

rows = df.to_dict(orient='records')

with open('inventory.json', 'w') as f:
    f.write(json.dumps(rows, indent=4))