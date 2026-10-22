"""Rebuild the six-page, hand-tick tracker. Run from the repository root."""
from pathlib import Path
import re,json,html
from reportlab import rl_config
rl_config.useA85 = 0
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("Tracker", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Tracker-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFontFamily("Tracker", normal="Tracker", bold="Tracker-Bold")
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

root=Path(__file__).resolve().parents[1]
blocks=json.loads((root/'docs/study-tracker-content.json').read_text())
plan=(root/'pages/plan.html').read_text()
output=root/'assets/documents/LC_OL_Spanish_Study_Tracker_6_Blocks.pdf'
c=canvas.Canvas(str(output),pagesize=A4)
c.setTitle('LC OL Spanish - Study Tracker - 6 Blocks')
W,H=A4
style=ParagraphStyle('task',fontName='Tracker',fontSize=8.5,leading=10)
def line(text,x,y,size=9,bold=False):
 c.setFont('Tracker-Bold' if bold else 'Tracker',size);c.drawString(x,y,text)
def para(text,x,top,width):
 p=Paragraph(text,style);_,height=p.wrap(width,100)
 p.drawOn(c,x,top-height);return height
def box(x,y):
 c.setLineWidth(.6);c.rect(x,y,8,8,fill=0)
for b,block in enumerate(blocks,1):
 line('LEAVING CERTIFICATE SPANISH - ORDINARY LEVEL',34,H-30,9)
 line(f'{b} / 6',535,H-30,9)
 line('My study tracker',34,H-56,21,True)
 line(block['title'],34,H-76,11,True)
 line('Name: _____________________________   Class: ______________',34,H-94)
 line('Choose a pace each week. All paces share the same four main tasks.',34,H-111)
 line('Mon-Thu + weekend: Tranquila 20 x 4 + 10; Equilibrada 25 x 4 + 15;',34,H-125,8.5)
 line('Intensiva 30 x 4 + 20 minutes. Extra practice has no required ticks.',34,H-137,8.5)
 line('Balanced: correct + recall. Intensive: recall unaided + own sentences.',34,H-149,8)
 y=H-154
 for week in block['weeks']:
  n=week['week']; c.setFillGray(.93);c.rect(34,y-17,W-68,17,fill=1,stroke=0);c.setFillGray(0)
  line(f"WEEK {n} | {week['title']}",39,y-12,9,True)
  line('DATE',514,y-12,7)
  y-=33
  for x,label in [(38,'Tranquila - 90 min'),(201,'Equilibrada - 115 min'),(380,'Intensiva - 140 min')]:
   box(x,y-1);line(label,x+13,y,8.5)
  y-=9
  # Reflect the current live main/review vocabulary choices without duplicating the mapping.
  section=re.search(r'<section class="study-week" id="week-'+str(n)+r'">(.*?)</section>',plan,re.S)[1]
  main=html.unescape(re.search(r'<strong>Main group:</strong> <a[^>]*>(.*?)</a>',section)[1])
  review=html.unescape(re.search(r'class="study-tip vocabulary-review"><strong>.*?</strong> <a[^>]*>(.*?)</a>',section)[1])
  tasks=dict(week['tasks']);tasks['Language']=f'{main}: Understand > Read > Complete/check. Language task online. Review: {review}.'
  for label,text in tasks.items():
   h=para('<b>'+label+':</b> '+html.escape(text),53,y-5,435)
   row=max(18,h+7)
   box(38,y-row/2-4)
   line('____ / ____',500,y-row/2-1,8)
   c.setStrokeGray(.65);c.setLineWidth(.3);c.line(34,y-row,561,y-row);c.setStrokeGray(0)
   y-=row
  line('One thing to revisit: ______________________________________________________',38,y-14,8.5)
  y-=16
 assert y>85, f'Block {b} content overruns: {y}'
 line('Notes / Questions for class:',34,y-8,9,True)
 c.line(34,y-24,561,y-24)
 line('Block completed: ______ / 16 tasks',34,47,9,True)
 line('G = Guided. I = Independent. Use help; pause or repeat a week whenever useful.',34,33,8)
 line('Full instructions: languageprepie.github.io/informal-letter-ol/pages/plan.html',34,21,8)
 c.showPage()
c.save()
print(output)
