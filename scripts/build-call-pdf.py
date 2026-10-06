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
    c.setTitle("GeniSys 2027 - Call for contribution")
    c.setAuthor("GeniSys 2027 | Computer Science, Rice University")
    c.setSubject("Research posters and presentations from undergraduate, master's, and PhD students")

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
    box(0, 0, WIDTH, 188, NAVY)
    text("RICE UNIVERSITY  /  COMPUTER SCIENCE", MARGIN, 23, 9, True, MINT)
    c.drawImage(str(ROOT / "assets/genisys-mark.png"), MARGIN, HEIGHT - 83,
                width=34, height=34, mask="auto")
    text("GeniSys", 85, 47, 30, True, white)
    text("2027", 85 + pdfmetrics.stringWidth("GeniSys", "CallSans-Bold", 30) + 9, 47, 30, False, MINT)
    text("Call for contribution", MARGIN, 96, 27, True, white)
    text("Research posters & presentations", MARGIN, 132, 13, False, white)
    text("Spring 2027  |  Rice University, Houston, Texas", MARGIN, 155, 10.5, False, MINT)
    text("Exact workshop date to be announced", MARGIN, 170, 9, False, white)

    box(0, 188, WIDTH, 44, MINT)
    text("SUBMISSION DEADLINE", MARGIN, 204, 10, True, NAVY)
    text(deadline_label, 325, 199, 20, True, NAVY)

    paragraph("Connect with people across backgrounds and disciplines, showcase your work to a "
              "wider audience, and find potential collaborators.",
              MARGIN, 249, CONTENT, 11, 15, max_height=30)
    paragraph("<b>Venue:</b> Ralph S. O'Connor Building for Engineering and Science, "
              "fifth-floor conference room.", MARGIN, 286, CONTENT, 9.5, 13,
              color=MUTED, max_height=26)

    text("RESEARCH THEMES", MARGIN, 310, 10, True, TEAL)
    themes = [
        ("Efficient AI", "Algorithm design, agent systems, scalable training/inference, "
         "heterogeneous computing."),
        ("Connected systems", "Networks and infrastructure for distributed intelligence."),
        ("Sustainable computing", "Energy-aware, reliable, and secure systems."),
    ]
    top = 328
    for name, description in themes:
        c.setFillColor(TEAL)
        c.circle(MARGIN + 3, HEIGHT - top - 6, 2.1, stroke=0, fill=1)
        height = paragraph(f"<b>{name}:</b> {description}", MARGIN + 14, top,
                           CONTENT - 14, 10, 13, max_height=13)
        top += height + 7

    # Separate cards make the two submission types and their formats unambiguous.
    card_top, card_height, gap = 395, 168, 14
    card_width = (CONTENT - gap) / 2
    right = MARGIN + card_width + gap
    for x in (MARGIN, right):
        box(x, card_top, card_width, card_height, PALE, radius=7, stroke=LINE)
    text("Research posters", MARGIN + 15, 410, 14, True)
    paragraph("Recent research and previously published work are welcome.<br/>"
              "<b>File format:</b> PPTX<br/>"
              "<b>Recommended size:</b> 36 x 48 in, portrait<br/>"
              "(91 x 122 cm, width x height).<br/>"
              "<b>Poster session:</b> 4:00-5:00 pm",
              MARGIN + 15, 433, card_width - 30, 10, 14, max_height=84)
    text("Research presentations", right + 15, 410, 14, True)
    paragraph("Open to undergraduate, master's, and PhD students.<br/>"
              "<b>File format:</b> PPTX<br/>"
              "<b>Fewer than 15 slides (maximum 14).</b><br/>"
              "15-minute slots, including Q&amp;A and transitions.",
              right + 15, 433, card_width - 30, 10, 14, max_height=84)
    button("Submit a poster", poster_url, MARGIN + 15, 523, card_width - 30)
    button("Submit a presentation", presentation_url, right + 15, 523, card_width - 30)

    paragraph("<b>Presentations:</b> Presentation_First_Lastname_Level.pptx<br/>"
              "<b>Posters:</b> Poster_First_Lastname_Level.pptx<br/>"
              "Replace First/Lastname with your name and Level with Undergrad, Master, or PhD.",
              MARGIN, 574, CONTENT, 9.5, 13, max_height=39)
    paragraph(f'<link href="{SITE}schedule.html" color="#00665c">Full schedule</link>',
              502, 624, 70, 9, 12, max_height=12)
    text("Program: 9:00 am-5:00 pm  |  Central Time  |  Tentative", MARGIN, 624, 10.5, True)
    paragraph("We plan to select 8 undergraduate/master's and 6 PhD talks: 14 talks, 15 minutes each.<br/>"
              "3 external speakers (45 minutes each); posters &amp; demos from 4:00 to 5:00 pm.",
              MARGIN, 644, CONTENT, 10, 14, max_height=28)
    paragraph("Hybrid participation is planned; remote poster arrangements will be announced.",
              MARGIN, 676, CONTENT, 9, 12, color=MUTED, max_height=12)

    c.setStrokeColor(LINE)
    c.line(MARGIN, HEIGHT - 700, WIDTH - MARGIN, HEIGHT - 700)
    text("ORGANIZERS", MARGIN, 713, 8, True, TEAL)
    text("T. S. Eugene Ng  |  Yuke Wang  |  Jiarong Xing", MARGIN, 727, 10, True)
    paragraph(f'<b>Links &amp; full schedule:</b> <link href="{SITE}" color="#00665c">'
              'genisys27.github.io</link><br/>'
              '<b>Contact:</b> <link href="mailto:yuke.wang@rice.edu" color="#00665c">'
              'yuke.wang@rice.edu</link>', MARGIN, 746, CONTENT - 75, 9.5, 13, max_height=26)
    qr = QrCodeWidget(SITE + "#posters")
    x0, y0, x1, y1 = qr.getBounds()
    size = 63
    drawing = Drawing(size, size, transform=[size / (x1 - x0), 0, 0, size / (y1 - y0), 0, 0])
    drawing.add(qr)
    renderPDF.draw(drawing, c, WIDTH - MARGIN - size, 18)
    c.linkURL(SITE + "#posters", (WIDTH - MARGIN - size, 18, WIDTH - MARGIN, 18 + size))
    c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
