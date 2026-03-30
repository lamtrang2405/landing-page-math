# VTMathEdu — Landing ôn thi Toán THCS & THPT

Trang tĩnh: mở `index.html` hoặc dùng bất kỳ static server nào.

## Đưa lên GitHub

Trong thư mục project (đã cài [Git](https://git-scm.com/) và đăng nhập GitHub):

```bash
cd toan-vui-academy
git init
git add .
git commit -m "Initial commit: VTMathEdu landing page"
git branch -M main
git remote add origin https://github.com/lamtrang2405/landing-page-math.git
git push -u origin main
```

Nếu remote đã tồn tại: `git remote set-url origin https://github.com/lamtrang2405/landing-page-math.git`

## GitHub Pages

1. Repo **Settings** → **Pages**
2. **Source**: Deploy from a branch → **main** → **/ (root)** → Save
3. Sau vài phút: `https://lamtrang2405.github.io/landing-page-math/`

File `.nojekyll` giúp GitHub không xử lý site qua Jekyll.
