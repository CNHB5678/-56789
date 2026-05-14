import logging
import svgwrite
import io
import base64
from typing import List, Dict, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class SVGAnimationResult:
    svg_content: str
    svg_base64: str
    duration: float


ANIMATION_TYPES = {
    "fade": {
        "css": """
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        """,
        "duration": 1.0
    },
    "slide": {
        "css": """
            @keyframes slideInLeft {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutDown {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(100%); opacity: 0; }
            }
        """,
        "duration": 0.8
    },
    "zoom": {
        "css": """
            @keyframes zoomIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes zoomOut {
                from { transform: scale(1); opacity: 1; }
                to { transform: scale(0); opacity: 0; }
            }
        """,
        "duration": 0.6
    },
    "bounce": {
        "css": """
            @keyframes bounceIn {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bounceOut {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(0); opacity: 0; }
            }
        """,
        "duration": 1.0
    },
    "rotate": {
        "css": """
            @keyframes rotateIn {
                from { transform: rotate(-180deg) scale(0); opacity: 0; }
                to { transform: rotate(0deg) scale(1); opacity: 1; }
            }
        """,
        "duration": 0.8
    }
}


class SVGGenerator:
    def __init__(self, width: int = 800, height: int = 600):
        self.width = width
        self.height = height

    async def generate_animation(
        self,
        keywords: List[str],
        animation_type: str = "fade",
        duration: float = 1.0,
        style: str = "modern"
    ) -> SVGAnimationResult:
        drawing = svgwrite.Drawing(
            size=(self.width, self.height),
            viewBox=f"0 0 {self.width} {self.height}"
        )

        anim_config = ANIMATION_TYPES.get(animation_type, ANIMATION_TYPES["fade"])

        style_def = self._generate_style_def(anim_config["css"], animation_type, duration)
        drawing.defs.add(drawing.style(style_def))

        bg = drawing.rect(
            insert=(0, 0),
            size=(self.width, self.height),
            fill=self._get_background_color(style)
        )
        drawing.add(bg)

        shapes = self._generate_shapes_from_keywords(keywords, style)
        for shape in shapes:
            drawing.add(shape)

        svg_content = drawing.tostring()

        buffer = io.BytesIO()
        buffer.write(svg_content.encode('utf-8'))
        svg_base64 = base64.b64encode(buffer.getvalue()).decode()

        return SVGAnimationResult(
            svg_content=svg_content,
            svg_base64=svg_base64,
            duration=duration
        )

    def _generate_style_def(self, css: str, animation_type: str, duration: float) -> str:
        return f"""
            .animated-element {{
                animation-duration: {duration}s;
                animation-timing-function: ease-out;
                animation-fill-mode: forwards;
            }}
            {css}
        """

    def _get_background_color(self, style: str) -> str:
        colors = {
            "modern": "#f8f9fa",
            "dark": "#1a1a2e",
            "gradient": "url(#gradient)",
            "minimal": "#ffffff"
        }
        return colors.get(style, colors["modern"])

    def _generate_shapes_from_keywords(
        self,
        keywords: List[str],
        style: str
    ) -> List:
        shapes = []
        colors = ["#4ECDC4", "#FF6B6B", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

        center_x = self.width // 2
        center_y = self.height // 2

        circle = svgwrite.shapes.Circle(
            center=(center_x, center_y),
            r=min(self.width, self.height) // 4,
            fill=colors[0],
            class_="animated-element",
            style=f"animation-name: fadeIn;"
        )
        shapes.append(circle)

        for i, keyword in enumerate(keywords[:3]):
            import math
            angle = (360 / 3) * i
            x = center_x + 150 * math.cos(math.radians(angle))
            y = center_y + 150 * math.sin(math.radians(angle))

            circle = svgwrite.shapes.Circle(
                center=(x, y),
                r=30,
                fill=colors[(i + 1) % len(colors)],
                class_="animated-element",
                style=f"animation-name: zoomIn; animation-delay: {0.2 * i}s;"
            )
            shapes.append(circle)

        return shapes

    async def generate_static_svg(
        self,
        keywords: List[str],
        style: str = "modern"
    ) -> SVGAnimationResult:
        drawing = svgwrite.Drawing(
            size=(self.width, self.height),
            viewBox=f"0 0 {self.width} {self.height}"
        )

        bg = drawing.rect(
            insert=(0, 0),
            size=(self.width, self.height),
            fill=self._get_background_color(style)
        )
        drawing.add(bg)

        shapes = self._generate_shapes_from_keywords(keywords, style)
        for shape in shapes:
            drawing.add(shape)

        svg_content = drawing.tostring()

        buffer = io.BytesIO()
        buffer.write(svg_content.encode('utf-8'))
        svg_base64 = base64.b64encode(buffer.getvalue()).decode()

        return SVGAnimationResult(
            svg_content=svg_content,
            svg_base64=svg_base64,
            duration=0
        )
