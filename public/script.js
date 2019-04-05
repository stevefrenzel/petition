(function() {
    "use strict";

    // SUBMIT USER INPUT TO SERVER

    const submitButton = document.getElementById("submit-button");

    submitButton.addEventListener("click", () => {
        document.getElementById("hidden-input").value = canvas.toDataURL();
    });

    // CANVAS

    const canvas = document.getElementById("canvas");
    canvas.width = "400";
    canvas.height = "100";
    const ctx = canvas.getContext("2d");
    const deleteButton = document.getElementById("erase-button");

    let sx = 0;
    let sy = 0;
    let clicked = false;

    function horizontal(e) {
        return e.pageX - canvas.offsetLeft;
    }
    function vertical(e) {
        return e.pageY - canvas.offsetTop;
    }

    function draw(e, sx, sy) {
        let x = horizontal(e);
        let y = vertical(e);
        ctx.moveTo(sx, sy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    canvas.addEventListener(
        "mousedown",
        e => {
            sx = horizontal(e);
            sy = vertical(e);
            draw(e, sx, sy);
            clicked = true;
        },
        false
    );

    canvas.addEventListener(
        "mousemove",
        e => {
            if (clicked == true) {
                draw(e, canvas);
            }
        },
        false
    );

    addEventListener(
        "mouseup",
        () => {
            clicked = false;
        },
        false
    );

    deleteButton.addEventListener("click", e => {
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        e.preventDefault();
    });
})();
