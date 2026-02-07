(function () {
    var yesBtn = document.getElementById('yesBtn');
    var noBtn = document.getElementById('noBtn');
    var frame = document.getElementById('buttonsFrame');

    if (!noBtn || !yesBtn) return;

    // 10cm away from cursor (1cm ≈ 37.8px at 96dpi)
    var MOVE_DISTANCE_CM = 10;
    var MOVE_DISTANCE_PX = MOVE_DISTANCE_CM * 37.8;
    var isTouchDevice = function() { return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)); };

    function moveNoAway(clientX, clientY) {
        var noRect = noBtn.getBoundingClientRect();
        var noCenterX = noRect.left + noRect.width / 2;
        var noCenterY = noRect.top + noRect.height / 2;

        var dx = clientX - noCenterX;
        var dy = clientY - noCenterY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) return;

        // Move exactly 10cm away from cursor, in the direction away from cursor
        var angle = Math.atan2(dy, dx);
        var newCenterX = noCenterX + Math.cos(angle) * MOVE_DISTANCE_PX;
        var newCenterY = noCenterY + Math.sin(angle) * MOVE_DISTANCE_PX;

        // Keep button within viewport (whole page)
        var margin = 20;
        var minX = noRect.width / 2 + margin;
        var maxX = window.innerWidth - noRect.width / 2 - margin;
        var minY = noRect.height / 2 + margin;
        var maxY = window.innerHeight - noRect.height / 2 - margin;

        newCenterX = Math.max(minX, Math.min(maxX, newCenterX));
        newCenterY = Math.max(minY, Math.min(maxY, newCenterY));

        // position: fixed uses viewport coordinates (top-left of button)
        noBtn.style.transform = 'none';
        noBtn.style.left = (newCenterX - noRect.width / 2) + 'px';
        noBtn.style.top = (newCenterY - noRect.height / 2) + 'px';
        
        // Add animation effect
        noBtn.classList.add('btn-moving');
        setTimeout(function() { noBtn.classList.remove('btn-moving'); }, 300);
    }

    var CURSOR_NEAR_PX = 120;

    function onMouseMove(e) {
        if (isTouchDevice()) return;
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
    
    function onTouchMove(e) {
        if (e.touches && e.touches.length > 0) {
            var touch = e.touches[0];
            moveNoAway(touch.clientX, touch.clientY);
        }
    }

    // No button: fixed so it can run away; initial position next to Yes for proper alignment
    noBtn.style.position = 'fixed';
    noBtn.style.transition = 'left 0.5s ease-out, top 0.5s ease-out';
    noBtn.style.pointerEvents = 'auto';
    noBtn.style.zIndex = 10;

    function positionNoNextToYes() {
        var yesRect = yesBtn.getBoundingClientRect();
        var noRect = noBtn.getBoundingClientRect();
        var gap = 12;
        // No below Yes, same horizontal center (stacked for mobile)
        var left = yesRect.left + (yesRect.width / 2) - (noRect.width / 2);
        var top = yesRect.bottom + gap;
        var margin = 12;
        left = Math.max(margin, Math.min(window.innerWidth - noRect.width - margin, left));
        top = Math.max(margin, Math.min(window.innerHeight - noRect.height - margin, top));
        noBtn.style.transform = 'none';
        noBtn.style.left = left + 'px';
        noBtn.style.top = top + 'px';
    }

    if (frame && yesBtn) {
        function initNoPosition() {
            positionNoNextToYes();
        }
        if (document.readyState === 'complete') {
            setTimeout(initNoPosition, 0);
        } else {
            window.addEventListener('load', initNoPosition);
        }
        window.addEventListener('resize', positionNoNextToYes);
    } else {
        noBtn.style.left = '50%';
        noBtn.style.top = '50%';
        noBtn.style.transform = 'translate(-50%, -50%)';
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    noBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        moveNoAway(e.clientX || (e.touches && e.touches[0].clientX), 
                   e.clientY || (e.touches && e.touches[0].clientY));
        return false;
    });

    noBtn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.touches && e.touches.length > 0) {
            var touch = e.touches[0];
            moveNoAway(touch.clientX, touch.clientY);
        }
        return false;
    });

    noBtn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    yesBtn.addEventListener('click', function () {
        var overlay = document.getElementById('confirmOverlay');
        if (overlay) {
            overlay.classList.add('confirm-overlay-visible');
            overlay.setAttribute('aria-hidden', 'false');
            playHeartAnimation();
        }
    });

    var confirmYesBtn = document.getElementById('confirmYesBtn');
    var confirmNoBtn = document.getElementById('confirmNoBtn');
    var confirmOverlay = document.getElementById('confirmOverlay');

    if (confirmYesBtn) {
        confirmYesBtn.addEventListener('click', function () {
            playHeartBurst();
            setTimeout(function() {
                window.location.href = 'success.html';
            }, 600);
        });
    }
    if (confirmNoBtn) {
        confirmNoBtn.addEventListener('click', function () {
            window.location.href = 'crying.html';
        });
    }
    
    function playHeartAnimation() {
        var hearts = document.createElement('div');
        hearts.className = 'heart-burst';
        for (var i = 0; i < 10; i++) {
            var heart = document.createElement('span');
            heart.textContent = '\u2665';
            heart.className = 'floating-heart';
            heart.style.left = (Math.random() * 100) + '%';
            heart.style.setProperty('--delay', (i * 0.1) + 's');
            hearts.appendChild(heart);
        }
        document.body.appendChild(hearts);
        setTimeout(function() { hearts.remove(); }, 2000);
    }
    
    function playHeartBurst() {
        var yesRect = yesBtn.getBoundingClientRect();
        var startX = yesRect.left + yesRect.width / 2;
        var startY = yesRect.top + yesRect.height / 2;
        
        for (var i = 0; i < 15; i++) {
            var heart = document.createElement('div');
            heart.textContent = '\u2665';
            heart.className = 'burst-heart';
            heart.style.left = startX + 'px';
            heart.style.top = startY + 'px';
            heart.style.setProperty('--angle', (i * 24) + 'deg');
            document.body.appendChild(heart);
            setTimeout(function(h) { return function() { h.remove(); }; }(heart), 800);
        }
    }
})();
