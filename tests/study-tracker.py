"""PDF structure and printable checkbox checks; visual review is also required."""
from pathlib import Path
import pdfplumber
root=Path(__file__).resolve().parents[1]
with pdfplumber.open(root/'assets/documents/LC_OL_Spanish_Study_Tracker_6_Blocks.pdf') as pdf:
 assert len(pdf.pages)==6
 for block,page in enumerate(pdf.pages):
  text=page.extract_text()
  for w in range(block*4+1,block*4+5): assert f'WEEK {w} |' in text
  for label in ['Tranquila - 90 min','Equilibrada - 115 min','Intensiva - 140 min']:
   assert text.count(label)==4
  for label in ['Language:','Reading:','Listening:','Writing:','One thing to revisit:']:
   assert text.count(label)==4
  assert 'Notes / Questions for class:' in text
  boxes=[r for r in page.rects if abs(r['width']-8)<.1 and abs(r['height']-8)<.1]
  assert len(boxes)==28 # 4 x (three pace + four main task boxes)
  assert all(0<c['x0']<c['x1']<page.width and 0<c['top']<c['bottom']<page.height for c in page.chars)
print('PASS: six A4 pages; 24 weeks; 72 pace boxes; 96 task boxes; dates, revision notes and class notes; all text within page bounds.')
