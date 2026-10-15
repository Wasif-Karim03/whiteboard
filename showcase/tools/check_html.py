"""Static artifact checks. This does not run a browser or prove visual accessibility."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
root = Path(__file__).resolve().parents[2]
class Check(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.labels=[]; self.refs=[]; self.assets=[]
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if 'id' in d: self.ids.append(d['id'])
        if 'for' in d: self.labels.append(d['for'])
        if 'href' in d: self.refs.append(d['href'])
        if tag in ['script','img','link','iframe'] and ('src' in d or 'href' in d): self.assets.append(d)
p=root/'Claude outputs/Pellwin-Showcase.html'; parsed=Check(); parsed.feed(p.read_text())
assert len(parsed.ids)==len(set(parsed.ids)), 'Duplicate document ID'
assert all(x in parsed.ids for x in parsed.labels), 'Missing label target'
assert all(x[1:] in parsed.ids for x in parsed.refs if x.startswith('#')), 'Broken local anchor'
assert not parsed.assets, 'Unexpected runtime network asset'
archive=root/'showcase/archive/showcase_v1_2026-10-15.html'
assert hashlib.sha256(archive.read_bytes()).hexdigest()=='090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd'
print(f'Static HTML checks passed; {p.stat().st_size:,} bytes; archive unchanged.')
