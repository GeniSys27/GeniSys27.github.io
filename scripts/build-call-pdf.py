#!/usr/bin/env python3
"""Build the one-page research call. Requires reportlab; links/date use workshop.json."""

import json
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

import reportlab
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "output/pdf/genisys-2027-call-for-submissions.pdf"
SITE = "https://genisys27.github.io/"
NAVY = HexColor("#071e3b")
INK = HexColor("#132d42")
TEAL = HexColor("#00665c")
MINT = HexColor("#a3f0db")
MUTED = HexColor("#5b6c78")
PALE = HexColor("#f3f7f5")
LINE = HexColor("#dce4e6")
WIDTH, HEIGHT = 612, 792
MARGIN = 40
CONTENT = WIDTH - MARGIN * 2


def submission_url(config, key):
    value = config.get(key, "").strip()
    if value:
        parts = urlsplit(value)
        if parts.scheme != "https" or not parts.hostname or parts.username or parts.password:
            raise ValueError(f"{key} must be an HTTPS URL without credentials")
    return value


def build():
    config = json.loads((ROOT / "workshop.json").read_text())
    poster_url = submission_url(config, "boxUploadUrl")
    presentation_url = submission_url(config, "studentPresentationUrl")
    iso = config.get("submissionDeadline", "").strip()
    if iso:
        deadline = date.fromisoformat(iso)
        if deadline.isoformat() != iso:
            raise ValueError("submissionDeadline must use YYYY-MM-DD")
        deadline_label = f"{deadline:%B} {deadline.day}, {deadline.year}"
    else:
        deadline_label = "To be announced"

    # Embed the sans-serif fonts shipped with ReportLab for consistent rendering.
    fonts = Path(reportlab.__file__).parent / "fonts"
    pdfmetrics.registerFont(TTFont("CallSans", str(fonts / "Vera.ttf")))
    pdfmetrics.registerFont(TTFont("CallSans-Bold", str(fonts / "VeraBd.ttf")))
    pdfmetrics.registerFontFamily("CallSans", normal="CallSans", bold="CallSans-Bold")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=(WIDTH, HEIGHT), pageCompression=1, invariant=1)
    c.setTitle("GeniSys 2027 - Call for submissions")
    c.setAuthor("GeniSys 2027 | Computer Science, Rice University")
    c.setSubject("Research posters and presentations from students and postdoctoral researchers")

    def box(x, top, width, height, fill, radius=0, stroke=None):
        c.setFillColor(fill)
        if stroke:
            c.setStrokeColor(stroke)
            c.setLineWidth(0.7)
        if radius:
            c.roundRect(x, HEIGHT - top - height, width, height, radius,
                        fill=1, stroke=int(stroke is not None))
        else:
            c.rect(x, HEIGHT - top - height, width, height,
                   fill=1, stroke=int(stroke is not None))

    def text(label, x, top, size=10, bold=False, color=INK):
        c.setFillColor(color)
        c.setFont("CallSans-Bold" if bold else "CallSans", size)
        c.drawString(x, HEIGHT - top - size, label)

    def paragraph(label, x, top, width, size=10, leading=14, color=INK, max_height=None):
        style = ParagraphStyle("call", fontName="CallSans", fontSize=size,
                               leading=leading, textColor=color, spaceAfter=0)
        p = Paragraph(label, style)
        _, height = p.wrap(width, HEIGHT)
        if max_height is not None and height > max_height:
            raise ValueError(f"PDF text exceeds its layout area: {label}")
        p.drawOn(c, x, HEIGHT - top - height)
        return height

    def button(label, url, x, top, width):
        box(x, top, width, 28, NAVY if url else MUTED, radius=4)
        shown = label if url else "Submission link coming soon"
        c.setFillColor(white)
        c.setFont("CallSans-Bold", 10)
        c.drawCentredString(x + width / 2, HEIGHT - top - 18, shown)
        if url:
            c.linkURL(url, (x, HEIGHT - top - 28, x + width, HEIGHT - top), relative=0)

    # Header and the shared deadline are the first things a reader sees.
    box(0, 0, WIDTH, 166, NAVY)
    text("RICE UNIVERSITY  /  COMPUTER SCIENCE", MARGIN, 23, 9, True, MINT)
    c.drawImage(str(ROOT / "assets/genisys-mark.png"), MARGIN, HEIGHT - 83,
                width=34, height=34, mask="auto")
    text("GeniSys", 85, 47, 30, True, white)
    text("2027", 85 + pdfmetrics.stringWidth("GeniSys", "CallSans-Bold", 30) + 9, 47, 30, False, MINT)
    text("Call for submissions", MARGIN, 90, 27, True, white)
    text("Research posters & presentations", MARGIN, 123, 13, False, white)
    text("Spring 2027  |  Rice University, Houston, Texas  |  Exact date: TBA",
         MARGIN, 146, 9.5, False, MINT)

    box(0, 166, WIDTH, 44, MINT)
    text("SUBMISSION DEADLINE", MARGIN, 182, 10, True, NAVY)
    text(deadline_label, 325, 177, 20, True, NAVY)

    text("Share your work. Get feedback. Find collaborators.", MARGIN, 230, 18, True)
    paragraph("Open to undergraduate, master's and PhD students, and postdoctoral researchers. "
              "Work in progress, course projects, and recent or published research are welcome.",
              MARGIN, 261, CONTENT, 10.5, 14, max_height=28)

    text("RESEARCH THEMES", MARGIN, 309, 9, True, TEAL)
    theme_gap = 10
    theme_width = (CONTENT - theme_gap * 2) / 3
    for index, name in enumerate(("Efficient AI", "Connected systems", "Sustainable computing")):
        x = MARGIN + index * (theme_width + theme_gap)
        box(x, 325, theme_width, 34, PALE, radius=5, stroke=LINE)
        c.setFillColor(INK)
        c.setFont("CallSans-Bold", 9.5)
        c.drawCentredString(x + theme_width / 2, HEIGHT - 346, name)

    # Two spacious cards keep the submission choices easy to compare.
    card_top, card_height, gap = 382, 153, 14
    card_width = (CONTENT - gap) / 2
    right = MARGIN + card_width + gap
    for x in (MARGIN, right):
        box(x, card_top, card_width, card_height, PALE, radius=7, stroke=LINE)
    text("Research poster", MARGIN + 17, 398, 15, True)
    paragraph("<b>PPTX or PDF</b><br/>"
              "36 x 48 in, portrait<br/>"
              "Poster session: 4:00-5:00 pm",
              MARGIN + 17, 427, card_width - 34, 10.5, 17, max_height=52)
    text("Research presentation", right + 17, 398, 15, True)
    paragraph("<b>PPTX - maximum 14 slides</b><br/>"
              "15-minute slot<br/>"
              "Includes Q&amp;A and transition",
              right + 17, 427, card_width - 34, 10.5, 17, max_height=52)
    button("Submit a poster", poster_url, MARGIN + 17, 490, card_width - 34)
    button("Submit a presentation", presentation_url, right + 17, 490, card_width - 34)

    box(MARGIN, 552, CONTENT, 57, PALE, radius=5, stroke=LINE)
    text("WORKSHOP DETAILS", MARGIN + 12, 563, 8.5, True, TEAL)
    paragraph("<b>Spring 2027 - exact date TBA</b>  |  9:00 am-5:00 pm, Central Time<br/>"
              "Ralph S. O'Connor Building, fifth-floor conference room, Rice University",
              MARGIN + 12, 578, CONTENT - 24, 10, 14, max_height=28)

    box(MARGIN, 625, CONTENT, 64, PALE, radius=5)
    text("SUBMISSION FILENAMES", MARGIN + 12, 636, 8.5, True, TEAL)
    paragraph("<b>Presentation filename:</b> Presentation_Dept_First_Lastname_Level.pptx<br/>"
              "<b>Poster filename:</b> Poster_Dept_First_Lastname_Level.pptx or Poster_Dept_First_Lastname_Level.pdf<br/>"
              "Dept: CS/ECE  |  Level: Undergrad, Master, PhD, or Postdoc",
              MARGIN + 12, 651, CONTENT - 24, 8.7, 12, max_height=36)

    c.setStrokeColor(LINE)
    c.line(MARGIN, HEIGHT - 708, WIDTH - MARGIN, HEIGHT - 708)
    text("ORGANIZERS", MARGIN, 718, 8, True, TEAL)
    text("T. S. Eugene Ng  |  Yuke Wang  |  Jiarong Xing", MARGIN, 730, 10, True)
    paragraph(f'<b>Details &amp; schedule:</b> <link href="{SITE}" color="#00665c">'
              'genisys27.github.io</link><br/>'
              '<b>Contact:</b> <link href="mailto:yuke.wang@rice.edu" color="#00665c">'
              'yuke.wang@rice.edu</link>', MARGIN, 747, CONTENT - 75, 9.5, 12, max_height=24)
    qr = QrCodeWidget(SITE + "#posters")
    x0, y0, x1, y1 = qr.getBounds()
    size = 52
    drawing = Drawing(size, size, transform=[size / (x1 - x0), 0, 0, size / (y1 - y0), 0, 0])
    drawing.add(qr)
    renderPDF.draw(drawing, c, WIDTH - MARGIN - size, 20)
    c.linkURL(SITE + "#posters", (WIDTH - MARGIN - size, 20, WIDTH - MARGIN, 20 + size))
    text("Scan for details", WIDTH - MARGIN - size, 778, 7, False, TEAL)
    c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
