import urllib.request
import re

url = 'https://vcsamersham.co.uk/live-dosa-catering/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')

# Find all stylesheet links
css_links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', html)
print(f"Found {len(css_links)} stylesheets")

# Search for element IDs or classes in the page or inline <style> tags
inline_styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.S)
print(f"Found {len(inline_styles)} inline style blocks")

for style in inline_styles:
    if '5791c08' in style or 'elementor-heading-title' in style or 'What\'s Included' in style:
        print("=== INLINE STYLE MATCH ===")
        print(style[:1500])

for css_url in css_links:
    if 'post-1024' in css_url or 'post-' in css_url or 'autoptimize' in css_url or 'elementor/css' in css_url:
        print(f"\nChecking CSS: {css_url}")
        try:
            css_req = urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0'})
            css_content = urllib.request.urlopen(css_req, timeout=10).read().decode('utf-8', errors='ignore')
            for m in re.finditer(r'([^{}]*5791c08[^{}]*)\{([^}]*)\}', css_content):
                print("Rule:", m.group(1).strip(), "=>", m.group(2).strip())
            for m in re.finditer(r'([^{}]*elementor-heading-title[^{}]*)\{([^}]*)\}', css_content):
                print("Heading Title Rule:", m.group(1).strip(), "=>", m.group(2).strip())
            for m in re.finditer(r'([^{}]*elementor-element-6a410c38[^{}]*)\{([^}]*)\}', css_content):
                print("Container Rule:", m.group(1).strip(), "=>", m.group(2).strip())
            for m in re.finditer(r'([^{}]*elementor-icon-list-item[^{}]*)\{([^}]*)\}', css_content):
                print("Icon list item Rule:", m.group(1).strip(), "=>", m.group(2).strip())
        except Exception as e:
            print("Error loading CSS:", e)
