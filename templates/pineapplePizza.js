function initialize() {
    // Initialize page output.
    initialize_title();
    initialize_image_upload();
    initialize_url_upload();
}

function initialize_title() {
    var welcome_message = document.createElement("FORM");
    welcome_message.style.position = 'absolute';
    welcome_message.style.height = 0;
    welcome_message.align = "center";
    // welcome_message.style.width = window.innerWidth/2+'px';
    welcome_message.style.width = '50%';
    // welcome_message.style.left = window.innerWidth/4+'px';
    welcome_message.style.left = '25%';
    welcome_message.innerHTML = '<center>' +
        'Upload below the image of doubtful content in order to automatically ' +
        'detect if the unnameable ingredient is present in your pizza' +
        '</center>';


    document.body.appendChild(welcome_message)
}

function initialize_image_upload(){
    var div = document.createElement('div');

    div.style.position = 'absolute';
    // div.style.top = window.innerHeight/8+'px';
    div.style.top = '13%';
    // div.style.left = window.innerWidth/4+'px';
    div.style.left = '25%';

    // div.style.height = window.innerHeight/2+'px';
    div.style.height = '50%';
    // div.style.width = window.innerWidth/2+'px';
    div.style.width = '50%';

    div.style.backgroundImage = get_bg();
        div.class = "uploader";
    div.id = "ingredientDetector";
    // div.style.height = window.innerHeight/2+'px';
    div.style.height = '50%';
    div.onclick = "$('#filePhoto').click()";
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundSize = 'contain';
    div.addEventListener('change', handleImage, false);

    var imgLoader = document.createElement('INPUT');
    imgLoader.type = "file";
    imgLoader.id = "filePhoto";
    imgLoader.style.width = '100%';
    imgLoader.style.height = '100%';
    imgLoader.style.opacity = 0;
    div.appendChild(imgLoader);
    document.body.appendChild(div);
}

function initialize_url_upload(){
    var welcome_message = document.createElement("FORM");
    welcome_message.style.position = 'absolute';
    welcome_message.style.height = 0;
    welcome_message.align = "center";
    // welcome_message.style.width = window.innerWidth/2+'px';
    welcome_message.style.width = '50%';
    // welcome_message.style.left = window.innerWidth/4+'px';
    welcome_message.style.left = '25%';
    welcome_message.style.top = '70%';

    welcome_message.innerHTML = '<center>' +
        'You can also insert here the url of an image suspect of showing a pineapple pizza' +
        '</center>';


    document.body.appendChild(welcome_message);




    var btn = document.createElement('BUTTON');
    var text = document.createElement('INPUT');
    btn.style.position = 'absolute';
    text.style.position = 'absolute';
    btn.style.top = '80%';
    text.style.top = '80%';
    text.type = 'text';
    btn.type = 'btn';
    text.placeholder = 'pizza url';
    text.id = 'Url';
    btn.innerHTML = 'run';
    btn.addEventListener('click', handleUrl, false);

    text.style.left = (window.innerWidth/2-150)+'px';
    btn.style.left = (window.innerWidth/2 + 110) + 'px';
    document.body.appendChild(btn);
    document.body.appendChild(text);
}

function handleUrl() {
    var text = document.getElementById('Url');
    text = text.value;
    $.post("/submit", {data: 'url', src: text}, function(result){
        alert(result)
    });
    document.getElementById("ingredientDetector").style.backgroundImage = "url(" + text + ")";
}


function handleImage(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = function(){
        var base64 = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        // var base64 = reader.result;
        // var bin = get_binary(reader.result);
        $.post("/submit", {data: 'bin', src: base64}, function(result){
            alert(result)
        });
        document.getElementById("ingredientDetector").style.backgroundImage = "url(" + reader.result + ")";
    };
}

function get_binary(base64_url) {
    var base64 = base64_url.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    var binary_img = bin_encode(base64);

    return bin_encode(binary_img);
}


function bin_encode(data) {
    var binArray = [];
    var datEncode = "";

    for (var i=0; i < data.length; i++) {
        binArray.push(data[i].charCodeAt(0).toString(2));
    }
    for (var j=0; j < binArray.length; j++) {
        var pad = padding_left(binArray[j], '0', 8);
        datEncode += pad + ' ';
    }
    function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
        return s;
    }
        var max = (n - s.length)/c.length;
        for (var i = 0; i < max; i++) {
            s = c + s; } return s;
    }
    return binArray;
}


function get_base64_img(img) {
    // Create an empty canvas element
    var canvas = document.createElement("CANVAS");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function get_bg() {
    var bg = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAecAAAD2CAYAAADs8E/eAAAABmJLR0QA/wD/" +
        "AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QwCECccrNcKVwAAABl0RVh0Q29tbWVudABDcmVhdGV" +
        "kIHdpdGggR0lNUFeBDhcAACAASURBVHja7d17WFTV/j/w9yiCCoKAB7VQwdIGBDEBjfP9RoUXUsMgDeUipCJfPYhlfj" +
        "ma32NQPU9qlJbiowFJpuAlE+MIKOKIVGSIF9RMNFCRSpSLylWuvz/8zT4zMDMMwwwXeb+eh+fZw76svdfae31mrb32H" +
        "lFeXl4ziIiIqNvowywgIiJicCYiIiIGZyIiIgZnIiIiYnAmIiJicCYiIiIGZyIiIgZnIiIiYnAmIiJicCYiIiIGZyIi" +
        "ImJwJiIiYnAmIiIiBmciIiIGZyIiImJwJiIiYnAmIiIiBmciIiIGZyIiImJwJiIiIgZnIiIiBmciIiJicCYiImJwJiI" +
        "iIgZnIiIiBmciIiJicCYiImJwJiIiIgZnIiIiYnAmIiJicCYiIiIGZyIiIgZnIiIiYnAmIiJicCYiIiIGZyIiIgZnIi" +
        "IiYnAmIiIiBmciIiIGZyIiImJwJiIiYnAmIiIiBmciIiIGZyIiImJwJiIiYnAmIiIiBmciIiJicCYiImJwJiIiIgZnI" +
        "iIiBmciIiJicCYiImJwJiIiIgZnIiIiBmciIiJicCYiIiIGZyIiIgZnIiIiYnAmIiLqifSYBU+e5557TpjOy8tjhjC/" +
        "SYGKigrExcVBIpGgsLAQVVVVLEcdXgfauk56y/Wm1xMKWla/fv1gZGQEIyMjjBgxAuPGjcPzzz8PV1dX9OvXj1cIMfh" +
        "Tmx4+fAhvb2/cuHGDmUEMztpQX1+P8vJylJeX4/bt28jKygIAmJqawtfXF0uXLoW+vj5LloiUiomJYWAmBufOUF5ejm" +
        "3btuHo0aPYvn07Ro0axdKlTsHWbM8jkUiE6YULF2LJkiUwMzODSCRi5vA6YHDWpNCbmppQVVWFBw8e4Pr168jJyUFSU" +
        "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" +
        "2cPSkpK8Nlnn2Hz5s1aX7crr7eurEPYclbhq6++Eu5R9O3bF9OmTevQ9mQHeO3YsQPu7u4YMWIEBgwYILwgX51fthkz" +
        "Zoww/eOPPypdTtW8zib75pwTJ048sWlKSbvuFJEddCNbluqQHWSj6jl3VWR/jKGt5/ANDQ3b/LJ37ty5Hllmsl9sjh8" +
        "/rnJZ2YFB0jeudefzqDOOTU9PD6GhocLn9gy26si6nXm9dWUdwuCsQH19PbZs2SL3MLmnp2eb927aIn0OWFVLfcuWLW" +
        "1uZ/LkycJ0TEwMHj582GqZ+/fvIzo6utvkqeyglE2bNqGgoOCJTFMqOjpaeMZTVllZmVy5qDuIUNEx7d69GydPnmz3v" +
        "sk+xyp7D1sR2V6Z1NRUhee09BG6nlZmrq6ucteRsrSuXbuGr776SuF63fU80taxLV++XOXjmLLd0S2fZunIut3xeuvs" +
        "OqTXB+fm5mZUVlbijz/+QEZGBj799FO4ubkJoxcBwMrKCmFhYR1OSza4r1y5EufOnUN1dTXKysqQlZUFf3//Vi85UcT" +
        "Ly0u4b/fnn3/C19cXmZmZqKqqQlVVFU6dOgVfX1+tP+PcEa+99powgKm8vBxz5szBpk2bcPHiRVRWVqKpqQnV1dUoLC" +
        "zEyZMn8emnn2LGjBk9Lk2pu3fvwtfXFxkZGUK5ZGRkwNfXV7glYWBgAC8vr3Ztd8aMGRg7diyAxy8kWbZsGdauXYvs7" +
        "Gw8ePAAjY2NePjwIS5evIjY2FiFI7otLS3lKrWysjKlLWjpCx2kvT179+7FvXv3UFtbi+zsbAQEBODy5cs98jzx8vKC" +
        "qakpgMeDL318fBAfH4/i4mLU19fjzp072L17N/z8/FBTUwPgcTdne8usK84jbR3b8ePHMXXqVKxbtw4//vgjysrKUF9" +
        "fj+LiYiQlJWH58uVy9aS21u0u11tX1iHa1iPeENYeY8aMwfbt25W2mtvzZqBt27a12TKeNWsWkpOT29zm1q1b22yxvP" +
        "rqqzh69Ojjb019+mj8CIi23hJ1/fp1zJ8/v13fkjV5564u0mxvPrm7u8t1FyoSFhaGoKCgdh9fQUEBvL295R7za8/xb" +
        "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" +
        "QarVq1Sur6joyPCw8O7JG9Gjx6Nb7/9Vu0fYNBVHnWliIgIiMVipfN9fHwUBmZtlu3ChQvVHtw1ZswYHDhwQOMyI9Im" +
        "jtYmjcm+wnHu3Lkq36rU0vTp0+Hs7Cz8HOLNmzeFn0O0trZW6+cQAWDx4sUYPXo0vv76a1y+fBkNDQ0YOXIkPD09sWD" +
        "Bgnbtk7ZZW1vj8OHDOHbsGNLS0pCbm4vS0lI0NDQIx+nk5KS0e1RbedRVzMzMkJCQgLi4OKSkpOCPP/6Avr4+7Ozs4O" +
        "/vr/InI7VVthYWFkhMTMTOnTuRlZWFoqIilc8mP/PMMzh8+DDS09Nx9OhR5ObmoqysDLW1tRgwYACGDRsmvIiELxghX" +
        "WK3NmmkoKBACCoikQjp6ekKX9dJvQu7dIm0g93a1G41NTV49913hc+TJ09mYCYiYnCmrlJaWorg4GC59zgrGrlNRESa" +
        "4z1nUpuigTKWlpZ49dVXmTlERGw5U3cgEokQERHR6ocTiIiILWfqZMbGxhCLxXj77bfh5OTEDCEi0nbjh6O1iYiIuhd" +
        "2axMRETE4ExEREYMzERERgzMRERExOBMRETE4ExEREYMzERERgzMRERExOBMRETE4ExEREYMzERERMTgTERExOBMRER" +
        "GDMxEREYMzERERMTgTERExOBMRERGDMxEREYMzERERMTgTERERgzMRERGDMxERETE4ExERMTgTERERgzMRERGDMxERE" +
        "TE4ExERMTgTERERgzMRERExOBMRETE4ExEREYMzERERgzMRERExOBMRETE4ExEREYMzERERgzMRERExOBMRERGDMxER" +
        "EYMzERERMTgTERExOBMRERGDMxEREYMzERERMTgTERExOBMRERGDMxERETE4ExERMTgTERERgzMRERGDMxERETE4ExE" +
        "RMTgTERERgzMRERGDMxEREXWp/wdCyiDDoBtKnQAAAABJRU5ErkJggg==)";
    return bg
}