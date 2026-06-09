import os
import re
from pathlib import Path

PROJECT_ROOT = Path(r"c:\Users\angel\OneDrive\Escritorio\solit\Proyecto")
SKIP_DIRS = {'.git', 'node_modules'}

COMMENT_PATTERNS = {
    '.js': [r'(?<!:)//.*', r'/\*[\s\S]*?\*/'],
    '.jsx': [r'(?<!:)//.*', r'/\*[\s\S]*?\*/'],
    '.ts': [r'(?<!:)//.*', r'/\*[\s\S]*?\*/'],
    '.tsx': [r'(?<!:)//.*', r'/\*[\s\S]*?\*/'],
    '.html': [r'<!--([\s\S]*?)-->'],
    '.css': [r'/\*[\s\S]*?\*/'],
    '.md': [r'<!--([\s\S]*?)-->'],
    '.sh': [r'(^|\n)\s*#.*'],
    '.bat': [r'(^|\n)\s*REM .*', r'(^|\n)\s*::.*']
}

EXTENSIONS = set(COMMENT_PATTERNS.keys())


def is_binary(path: Path) -> bool:
    try:
        with path.open('rb') as f:
            data = f.read(1024)
        return b'\0' in data
    except Exception:
        return True


def remove_comments(text: str, suffix: str) -> str:
    patterns = COMMENT_PATTERNS.get(suffix.lower(), [])
    for pattern in patterns:
        text = re.sub(pattern, '', text, flags=re.MULTILINE)
    return text


def main():
    modified = []
    processed = 0

    for path in PROJECT_ROOT.rglob('*'):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.suffix.lower() not in EXTENSIONS:
            continue
        if is_binary(path):
            continue

        processed += 1
        try:
            original = path.read_text(encoding='utf-8', errors='replace')
        except Exception:
            continue

        cleaned = remove_comments(original, path.suffix.lower())
        if cleaned != original:
            path.write_text(cleaned, encoding='utf-8')
            modified.append(path.relative_to(PROJECT_ROOT))

    print(f'Archivos procesados: {processed}')
    print(f'Archivos modificados: {len(modified)}')
    for path in modified:
        print(f' - {path}')


if __name__ == '__main__':
    main()
