import urllib.request
import re

url = 'https://vcsamersham.co.uk/outdoor-catering/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')

css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', html)
print(f"Found {len(css_links)} stylesheets on outdoor catering")

for css_url in css_links:
    if 'post-' in css_url or 'autoptimize' in css_url or 'elementor/css' in css_url:
        try:
            css_req = urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0'})
            css_content = urllib.request.urlopen(css_req, timeout=10).read().decode('utf-8', errors='ignore')
            for m in re.finditer(r'([^{}]*elementor-heading-title[^{}]*)\{([^}]*)\}', css_content):
                print("Heading Rule:", m.group(1).strip()[-60:], "=>", m.group(2).strip())
        except Exception as e:
            pass
