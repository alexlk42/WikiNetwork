from bs4 import BeautifulSoup
import requests
import json
import re

# Request the `Software engineering` page
center = 'Software_engineering'
r = requests.get('https://en.wikipedia.org/wiki/{0}'.format(center))
assert r.status_code == 200

# Parse its HTML
soup = BeautifulSoup(r.text, 'html.parser')
links = soup.find_all('a')

# Grab all of its h=outgoing linkes
set_links = set()
for each in links:
    id_string = each.get('href')
    if not id_string or not id_string.startswith('/wiki/') or id_string.count(':') > 0: 
        continue

    id_string = re.sub(r'^/wiki/', '', id_string)
    set_links.add(id_string)

# Add the outgoing linkes to a new JSON object
json_object = {'nodes': [], 'links': []}
json_object['nodes'].append({'id': center})
for outgoing_link in set_links:
    if outgoing_link == center: continue
    json_object['nodes'].append({'id': outgoing_link})
    json_object['links'].append({'source': center, 'target': outgoing_link, 'value': 1})
    # json_object['links'].append({'source': outgoing_link, 'target': center, 'value': 1})

# Save that JSON file
with open('example.json', 'wb') as file:
    json.dump(json_object, file, indent=4, separators=(',',':'))