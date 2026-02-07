(function () {
    var yesBtn = document.getElementById('yesBtn');
    var noBtn = document.getElementById('noBtn');
    var frame = document.getElementById('buttonsFrame');

    if (!frame || !noBtn || !yesBtn) return;

    function getFrameBounds() {
        var r = frame.getBoundingClientRect();
        return {
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height
        };
    }

    function moveNoAway(clientX, clientY) {
        var bounds = getFrameBounds();
        var noRect = noBtn.getBoundingClientRect();
        var noCenterX = noRect.left + noRect.width / 2;
        var noCenterY = noRect.top + noRect.height / 2;

        var dx = clientX - noCenterX;
        var dy = clientY - noCenterY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) return;

        // Move further away when trying to click
        var moveDist = Math.min(180, Math.max(100, dist * 0.8));
        var angle = Math.atan2(dy, dx);
        var newCenterX = noCenterX + Math.cos(angle) * moveDist;
        var newCenterY = noCenterY + Math.sin(angle) * moveDist;

        var minX = bounds.left + noRect.width / 2;
        var maxX = bounds.left + bounds.width - noRect.width / 2;
        var minY = bounds.top + noRect.height / 2;
        var maxY = bounds.top + bounds.height - noRect.height / 2;

        newCenterX = Math.max(minX, Math.min(maxX, newCenterX));
        newCenterY = Math.max(minY, Math.min(maxY, newCenterY));

        var leftPx = newCenterX - bounds.left - noRect.width / 2;
        var topPx = newCenterY - bounds.top - noRect.height / 2;

        noBtn.style.transform = 'none';
        noBtn.style.left = leftPx + 'px';
        noBtn.style.top = topPx + 'px';
    }

    var CURSOR_NEAR_PX = 120;
    var isMoving = false;

    function onMouseMove(e) {
        var noRect = noBtn.getBoundingClientRect();
        var mx = e.clientX;
        var my = e.clientY;
        var centerX = noRect.left + noRect.width / 2;
        var centerY = noRect.top + noRect.height / 2;
        var dist = Math.sqrt((mx - centerX) * (mx - centerX) + (my - centerY) * (my - centerY));
        
        if (dist < CURSOR_NEAR_PX) {
            moveNoAway(mx, my);
        }
    }

    function onMouseDown(e) {
        var noRect = noBtn.getBoundingClientRect();
        var mx = e.clientX;
        var my = e.clientY;
        var centerX = noRect.left + noRect.width / 2;
        var centerY = noRect.top + noRect.height / 2;
        var dist = Math.sqrt((mx - centerX) * (mx - centerX) + (my - centerY) * (my - centerY));
        
        // If clicking near the No button, move it away aggressively
        if (dist < 150) {
            e.preventDefault();
            e.stopPropagation();
            moveNoAway(mx, my);
            // Move it again after a short delay to make it harder to catch
            setTimeout(function() {
                moveNoAway(mx + (Math.random() - 0.5) * 50, my + (Math.random() - 0.5) * 50);
            }, 100);
            return false;
        }
    }

    noBtn.style.position = 'absolute';
    noBtn.style.left = '50%';
    noBtn.style.top = '50%';
    noBtn.style.transform = 'translate(-50%, -50%)';
    noBtn.style.transition = 'left 0.8s ease-out, top 0.8s ease-out';
    noBtn.style.pointerEvents = 'auto';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

    noBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var noRect = noBtn.getBoundingClientRect();
        moveNoAway(noRect.left + noRect.width / 2, noRect.top + noRect.height / 2);
        return false;
    });

    noBtn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    yesBtn.addEventListener('click', function () {
        window.location.href = 'success.html';
    });
})();
