from pymongo import MongoClient
import json
import glob
import names
import random
from tqdm import trange, tqdm
import faker

HOST = 'localhost'
PORT = '27107'
DB_NAME = 'scnus'

url = f"mongodb://{HOST}:{PORT}/"
client = MongoClient()

client.drop_database(DB_NAME)
db = client[DB_NAME]

print('Inserting Customers')
CUSTOMER_N = 1000
customers = []
for _ in trange(CUSTOMER_N):
	customers.append({
		"name": f"{names.get_first_name()} {names.get_last_name()}",
		"phone": random.randint(80000000, 99999999)
	})
print()

print('Inserting Merchants')
MERCHANT_N = 30
merchants = []
for _ in trange(MERCHANT_N):
	merchants.append({
		"name": faker.Faker().company(),
		"phone": random.randint(80000000, 99999999)
	})
print()

db.customers.insert_many(customers)
db.merchants.insert_many(merchants)

customer_ids = [str(id) for id in db.customers.find().distinct('_id')]
merchant_ids = [str(id) for id in db.merchants.find().distinct('_id')]

print('Inserting Tokens')
TOKEN_N = 15
tokens = []
for i in trange(TOKEN_N):
	tokens.append({
		"event": "NUS Fintech Lab",
		"name": faker.Faker().company(),
		"description": faker.Faker().catch_phrase(),
		"imageURL": f"https://picsum.photos/id/{i + 1}/200",
		"owners": random.sample(customer_ids, random.randint(50, 100))
	})
print()

print('Inserting Redemptions')
REDEMPTION_N = 3000
discounts = [0.1, 0.2, 0.3]
redemptions = []
for i in trange(REDEMPTION_N):
	amount = round(random.uniform(5, 10), 1)
	redemptions.append({
		"merchantId": random.choice(merchant_ids),
		"customerId": random.choice(customer_ids),
		"amount": amount,
		"discount": random.choice(discounts) * amount,
		"time": f"{faker.Faker().date_between('-3d')}T{random.randint(10, 17)}:{random.randint(10, 59)}:{random.randint(10, 59)}+08:00"
	})
print()

db.tokens.insert_many(tokens)
db.redemptions.insert_many(redemptions)