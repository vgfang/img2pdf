# img2pdf

simple web app for converting images to pdf file with an image on each page

[available on github pages](https://vgfang.github.io/img2pdf/)

### features

- greyscale toggle
- image scale up to maximize content toggle
- page formats
- adjust page margin in inches

### specs

- outputs to 300 DPI and scales images down if too big
- uses JPEG compression to lower file size

### tech

- vite react app with tailwind and shadcd components
- pdflib for the file operations

### why

i was resorting to using imagemagick to convert scanned images to pdf and this is an easily accesible cross platform solution
