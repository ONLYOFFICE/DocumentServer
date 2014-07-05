window.onload = function() {
  var fileInput = document.getElementById('fileInput');
  fileInput.onchange = function() {
    var file = fileInput.files[0];
    // MegaPixImage constructor accepts File/Blob object.
    var mpImg = new MegaPixImage(file);

    // Render resized image into image element using quality option.
    // Quality option is valid when rendering into image element.
    var resImg = document.getElementById('resultImage');
    mpImg.render(resImg, { maxWidth: 300, maxHeight: 300, quality: 0.5 });

    // Render resized image into canvas element.
    var resCanvas1 = document.getElementById('resultCanvas1');
    mpImg.render(resCanvas1, { maxWidth: 300, maxHeight: 300 });

    // Render resized image into canvas element, rotating orientation = 6 (90 deg rotate right)
    // Types of orientation is defined in EXIF specification.
    // To detect orientation of JPEG file in JS, you can use exif.js from https://github.com/jseidelin/exif-js
    var resCanvas2 = document.getElementById('resultCanvas2');
    mpImg.render(resCanvas2, { maxWidth: 300, maxHeight: 300, orientation: 6 });
  };
};
