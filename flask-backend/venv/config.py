from dotenv import load_dotenv
import os 

load_dotenv()

PAYMONGO_API_KEY = os.getenv("PAYMONGO_API_KEY")
if not PAYMONGO_API_KEY:
    print("API key is missing or not loaded properly!")
else:
    print("API key loaded successfully.")
