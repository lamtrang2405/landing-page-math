#!/usr/bin/env bash
# Chạy sau khi đã cài Xcode CLT: xcode-select --install
set -e
cd "$(dirname "$0")"
REPO="https://github.com/lamtrang2405/landing-page-math.git"

if ! command -v git >/dev/null 2>&1; then
  echo "Chưa có git. Cài Command Line Tools: xcode-select --install"
  exit 1
fi

if [ ! -d .git ]; then
  git init
  git branch -M main
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$REPO"

git add -A
git status
git commit -m "VTMathEdu landing page" || true
git push -u origin main

echo "Xong. Bật Pages: repo → Settings → Pages → branch main, folder /"
