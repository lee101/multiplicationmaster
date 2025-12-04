#!/usr/bin/env python3
"""Cloudflare cache clearing for multiplicationmaster.com"""
import os
import requests
import sys

def clear_cache():
    api_key = os.environ.get('CLOUDFLARE_API_KEY')
    zone_id = os.environ.get('CLOUDFLARE_ZONE_ID')
    email = os.environ.get('CLOUDFLARE_EMAIL', 'lee@netwrck.com')

    if not api_key or not zone_id:
        print("Missing CLOUDFLARE_API_KEY or CLOUDFLARE_ZONE_ID")
        return False

    headers = {
        'X-Auth-Email': email,
        'X-Auth-Key': api_key,
        'Content-Type': 'application/json'
    }

    # URLs to purge
    domain = 'multiplicationmaster.com'
    cdn = 'multiplicationmasterstatic.multiplicationmaster.com'

    urls = [
        f'https://{domain}/',
        f'https://www.{domain}/',
        f'https://{cdn}/static/js/game.js',
        f'https://{cdn}/static/css/style.css',
    ]

    # Add common static paths
    for path in ['js', 'css', 'img']:
        urls.append(f'https://{cdn}/static/{path}/')

    print(f"Clearing {len(urls)} URLs...")

    response = requests.post(
        f'https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache',
        headers=headers,
        json={"files": urls}
    )

    if response.status_code == 200 and response.json().get('success'):
        print(f"Cache cleared for {len(urls)} URLs")
        return True
    else:
        print(f"Failed: {response.text}")
        return False

if __name__ == '__main__':
    sys.exit(0 if clear_cache() else 1)
