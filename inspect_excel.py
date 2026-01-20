import pandas as pd

try:
    df = pd.read_excel('product.xlsx', nrows=5)
    print("Columns:", df.columns.tolist())
    print("First row:", df.iloc[0].to_dict())
except Exception as e:
    print(e)
