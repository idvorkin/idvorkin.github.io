#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "requests",
#     "python-dotenv",
# ]
# ///

"""Test Amazon PA API with minimal setup"""

import os
import json
import hmac
import hashlib
import datetime
import requests
from dotenv import load_dotenv

load_dotenv()

# Credentials
ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG")
REGION = "us-east-1"
SERVICE = "ProductAdvertisingAPI"
HOST = "webservices.amazon.com"


def sign(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()


def get_signature_key(key, date_stamp, region, service):
    k_date = sign(("AWS4" + key).encode("utf-8"), date_stamp)
    k_region = sign(k_date, region)
    k_service = sign(k_region, service)
    k_signing = sign(k_service, "aws4_request")
    return k_signing


# Prepare request
amz_date = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
date_stamp = datetime.datetime.utcnow().strftime("%Y%m%d")

# Request details
method = "POST"
canonical_uri = "/paapi5/getitems"
canonical_querystring = ""
endpoint = f"https://{HOST}{canonical_uri}"

# Headers
headers = {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=UTF-8",
    "host": HOST,
    "x-amz-date": amz_date,
    "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
}

# Payload
payload_dict = {
    "ItemIds": ["B0DNQ8CLXR"],
    "Resources": ["ItemInfo.Title", "Offers.Listings.Price"],
    "PartnerTag": PARTNER_TAG,
    "PartnerType": "Associates",
    "Marketplace": "www.amazon.com",
}
payload = json.dumps(payload_dict)

# Create canonical headers and signed headers
canonical_headers = "\n".join([f"{k}:{v}" for k, v in sorted(headers.items())]) + "\n"
signed_headers = ";".join(sorted(headers.keys()))

# Create payload hash
payload_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

# Create canonical request
canonical_request = f"{method}\n{canonical_uri}\n{canonical_querystring}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
print("Canonical Request:")
print(canonical_request)
print()

# Create string to sign
algorithm = "AWS4-HMAC-SHA256"
credential_scope = f"{date_stamp}/{REGION}/{SERVICE}/aws4_request"
string_to_sign = f"{algorithm}\n{amz_date}\n{credential_scope}\n{hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()}"

# Calculate signature
signing_key = get_signature_key(SECRET_KEY, date_stamp, REGION, SERVICE)
signature = hmac.new(
    signing_key, string_to_sign.encode("utf-8"), hashlib.sha256
).hexdigest()

# Add authorization header
authorization_header = f"{algorithm} Credential={ACCESS_KEY}/{credential_scope}, SignedHeaders={signed_headers}, Signature={signature}"
headers["Authorization"] = authorization_header

print("Headers:")
print(json.dumps(headers, indent=2))
print()

# Make request
response = requests.post(endpoint, headers=headers, data=payload)
print(f"Status: {response.status_code}")
print(f"Response: {response.text[:500]}")
