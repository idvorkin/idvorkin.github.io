# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "typer[all]",
#     "rich",
#     "openai>=1.40.0",
#     "pillow",
#     "python-dotenv",
# ]
# ///

"""
CLI to generate raccoon illustrations for Igor's Eulogy using OpenAI's image models.

Features
- Generate a consistent character sheet
- Generate the full eulogy illustration pack (magic, bike, fitness, meditate, technologist, family, husband)
- Generate a single custom image

Notes
- Uses the Images API (model: gpt-image-1) to produce images.
- Saves images as .webp in the specified output directory.
- Requires OPENAI_API_KEY in environment or a .env file.
"""

from __future__ import annotations

import base64
import os
from pathlib import Path
from typing import Dict, List, Optional

import typer
from typing_extensions import Annotated
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TimeElapsedColumn
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
from urllib.request import urlopen, Request

from openai import OpenAI


app = typer.Typer(
    help="Generate raccoon illustrations for Igor's Eulogy using OpenAI images.",
    add_completion=False,
    no_args_is_help=True,
)
console = Console()


def _require_api_key() -> str:
    load_dotenv(override=False)
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        console.print(
            Panel(
                "OPENAI_API_KEY not set. Export it or add to a .env file.",
                title="Missing API key",
                style="bold red",
            )
        )
        raise typer.Exit(code=1)
    return api_key


def _ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)



def _save_b64_image_webp(b64: str, out_path: Path) -> None:
    data = base64.b64decode(b64)
    img = Image.open(BytesIO(data))
    # Convert to RGB for webp safety
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="WEBP")


def generate_image(
    client: OpenAI,
    prompt: str,
    out_path: Path,
    *,
    model: str = "gpt-image-1",
    size: str = "1024x1536",
) -> Path:
    """Generate a single image from a prompt and save as WEBP."""
    resp = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        quality="high",
    )
    # Prefer base64 if available; otherwise download from URL
    datum = resp.data[0]
    b64 = getattr(datum, "b64_json", None)
    if b64:
        _save_b64_image_webp(b64, out_path)
    else:
        url = getattr(datum, "url", None)
        if not url:
            raise RuntimeError("Image response contained neither b64_json nor url")
        req = Request(url, headers={"User-Agent": "curl/8"})
        data = urlopen(req).read()
        img = Image.open(BytesIO(data))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        out_path.parent.mkdir(parents=True, exist_ok=True)
        img.save(out_path, format="WEBP")
    return out_path


BASE_STYLE = (
    "Cute anthropomorphic raccoon character, big rainbow round glasses, green t-shirt with bold white text, "
    "blue left Croc and yellow right Croc, soft plush 3D/vinyl illustration, big friendly eyes, studio softbox lighting, "
    "clean pastel background, subtle vintage film grain, children’s book style. Full body."
)


def eulogy_prompts() -> Dict[str, str]:
    """Standard illustration pack: filename -> prompt."""
    return {
        "raccoon-magic.webp": (
            f"{BASE_STYLE} Performing a playful magic trick with a fan of cards and a shiny coin, a few sparkles, delighted expression. Shirt text: 'DEALER OF WONDER'."
        ),
        "raccoon-bike.webp": (
            f"{BASE_STYLE} Standing proudly beside a yellow folding bicycle, hint of transit icon in background, energetic pose. Shirt text: 'CAR-FREE SPIRIT'."
        ),
        "raccoon-lifting-weights.webp": (
            f"{BASE_STYLE} Holding an orange 32 kg kettlebell, colorful plates nearby, confident smile. Shirt text: 'FIT FELLOW'."
        ),
        "raccoon-meditate.webp": (
            f"{BASE_STYLE} Sitting cross‑legged on a cushion, calm glow, small cloud overhead (no rain), peaceful vibe. Shirt text: 'PAIN GOOD! TAKE ACTION!'."
        ),
        "raccoon-nerd.webp": (
            f"{BASE_STYLE} At a minimalist laptop with terminal-style screen (no logos), a tiny 'VIM' sticker, tidy desk cable. Shirt text: 'TECHNOLOGIST'."
        ),
        "raccoon-family.webp": (
            f"{BASE_STYLE} With two smaller raccoon kids holding hands, stacking rings and a balloon nearby, warm family scene. Shirt text: 'FAMILY'."
        ),
        "raccoon-husband.webp": (
            f"{BASE_STYLE} Holding an open ring box with a sparkling ring, affectionate smile, subtle heart. Shirt text: 'IGOR ♥ TORI'."
        ),
    }


@app.command("custom", help="Generate a single image from a custom prompt.")
def cmd_custom(
    prompt: Annotated[str, typer.Argument(help="Text prompt describing the image")],
    output: Annotated[Path, typer.Argument(help="Output WEBP file path")],
    model: Annotated[str, typer.Option(help="Image model", show_default=True)] = "gpt-image-1",
    size: Annotated[str, typer.Option(help="Image size WxH", show_default=True)] = "1024x1536",
):
    _require_api_key()
    client = OpenAI()
    console.print(Panel(f"Model: [bold]{model}[/]\nSize: {size}\nOut: {output}", title="Generate Image"))
    with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}"), BarColumn(), TimeElapsedColumn()) as progress:
        progress.add_task("Calling OpenAI", total=None)
        path = generate_image(client, prompt, output, model=model, size=size)
    console.print(Panel(f"Saved to [bold]{path}[/]", title="Done", style="green"))


@app.command("character", help="Generate a base character sheet for consistency.")
def cmd_character(
    out_dir: Annotated[Path, typer.Argument(help="Directory to save the character sheet image")],
    model: Annotated[str, typer.Option(help="Image model", show_default=True)] = "gpt-image-1",
    size: Annotated[str, typer.Option(help="Image size WxH", show_default=True)] = "1024x1536",
):
    _require_api_key()
    client = OpenAI()
    _ensure_dir(out_dir)
    out_file = out_dir / "raccoon-character-sheet.webp"
    prompt = (
        f"{BASE_STYLE} Character sheet style pose, neutral stance, front view, clean background."
    )
    console.print(Panel(f"Creating base character → {out_file}", title="Character Sheet"))
    generate_image(client, prompt, out_file, model=model, size=size)
    console.print(Panel("Character sheet generated", style="green"))


@app.command("eulogy", help="Generate the full eulogy illustration pack.")
def cmd_eulogy(
    out_dir: Annotated[Path, typer.Argument(help="Directory to save all images")],
    model: Annotated[str, typer.Option(help="Image model", show_default=True)] = "gpt-image-1",
    size: Annotated[str, typer.Option(help="Image size WxH", show_default=True)] = "1024x1536",
    overwrite: Annotated[bool, typer.Option("--overwrite", help="Overwrite existing files")]=False,
):
    _require_api_key()
    client = OpenAI()
    _ensure_dir(out_dir)
    pack = eulogy_prompts()
    console.print(Panel(f"Generating {len(pack)} images to {out_dir}", title="Eulogy Pack"))
    with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}"), BarColumn(), TimeElapsedColumn()) as progress:
        task = progress.add_task("Working", total=len(pack))
        for filename, prompt in pack.items():
            out_path = out_dir / filename
            if out_path.exists() and not overwrite:
                progress.console.log(f"[yellow]Skip existing[/] {out_path}")
                progress.update(task, advance=1)
                continue
            try:
                generate_image(client, prompt, out_path, model=model, size=size)
                progress.console.log(f"[green]Saved[/] {out_path}")
            except Exception as exc:  # pragma: no cover
                progress.console.log(f"[red]Failed[/] {filename}: {exc}")
            finally:
                progress.update(task, advance=1)
    console.print(Panel("All done", style="green", title="Success"))


@app.command("verify", help="Sanity check: make a tiny text call using Responses API.")
def cmd_verify(
    model: Annotated[str, typer.Option(help="Text model for verification", show_default=True)] = "o4-mini",
):
    _require_api_key()
    client = OpenAI()
    out = client.responses.create(model=model, input="Say hello in five words.")
    console.print(Panel(out.output_text or "<no text>", title="Responses API"))


if __name__ == "__main__":  # pragma: no cover
    app()


