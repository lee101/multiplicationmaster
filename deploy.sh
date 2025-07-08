#!/bin/bash
set -e

# Sync static files to Cloudflare R2 bucket. Requires AWS credentials to be set
# in the environment (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY). The bucket
# is hosted on Cloudflare R2 which is compatible with the S3 API.
aws s3 sync static s3://multiplicationmasterstatic.multiplicationmaster.com \
  --endpoint-url=https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com \
  --delete

# Deploy the application to Google App Engine
gcloud app deploy . --project=multiplication-master
