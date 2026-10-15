"""Static artifact checks; no browser execution or conformance claim."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json
root = Path(__file__).resolve().parents[2]
class Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.labels=[]; self.refs=[]; self.assets=[]; self.aria=[]
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if 'id' in d: self.ids.append(d['id'])
        if 'for' in d: self.labels.append(d['for'])
        if 'href' in d: self.refs.append(d['href'])
        for key in ['aria-labelledby','aria-describedby','aria-controls']:
            self.aria.extend(d.get(key,'').split())
        if tag in ['script','img','link','iframe'] and ('src' in d or 'href' in d): self.assets.append(d)
    def validate(self):
        assert len(self.ids)==len(set(self.ids)), 'Duplicate ID'
        assert all(x in self.ids for x in self.labels), 'Missing label target'
        assert all(x in self.ids for x in self.aria), 'Missing ARIA reference'
p=root/'Claude outputs/Pellwin-Showcase.html'
parsed=Check(); parsed.feed(p.read_text()); parsed.validate()
assert all(x[1:] in parsed.ids for x in parsed.refs if x.startswith('#')), 'Broken local anchor'
assert not parsed.assets, 'Unexpected runtime network asset'
screens=Path('/tmp/whiteboard-rendered-screens.json')
if screens.exists():
    for screen in json.loads(screens.read_text()):
        q=Check();q.feed(screen['html']);q.validate()
for name,digest in [
    ('showcase_v1_2026-10-15.html','090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd'),
    ('showcase_v2_2026-10-15.html','1c4770e42135d7f879f3948724b084ce1389aaa6f46570de17a578855079c7aa')]:
    assert hashlib.sha256((root/'showcase/archive'/name).read_bytes()).hexdigest()==digest
print(f'Static HTML checks passed; {p.stat().st_size:,} bytes; IDs/labels/ARIA/anchors/assets checked; archives unchanged.')
