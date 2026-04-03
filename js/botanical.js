/**
 * botanical.js — Animated branches, vines, and floating syringa petals
 *
 * Creates:
 * - Growing SVG branches from screen edges
 * - Floating lilac petals drifting down
 * - Theme toggle button (flower/moon icon)
 *
 * Activated when body has class "botanical"
 */

// ============================================================
// THEME TOGGLE
// ============================================================

function createThemeToggle() {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.title = 'Toggle botanical theme';

    function updateLabel() {
        const active = isBotanical();
        btn.innerHTML = active
            ? '<span class="toggle-icon">🌙</span> Dark mode'
            : '<span class="toggle-icon">🌸</span> Botanical';
    }

    updateLabel();

    btn.addEventListener('click', () => {
        document.body.classList.toggle('botanical');
        const active = isBotanical();
        localStorage.setItem('mh-botanical', active ? '1' : '0');
        updateLabel();

        if (active) {
            startBotanical();
        } else {
            stopBotanical();
        }
    });
    document.body.appendChild(btn);
}

function isBotanical() {
    return document.body.classList.contains('botanical');
}

// ============================================================
// BRANCH RENDERER — growing SVG vines from edges
// ============================================================

let branchCanvas = null;
let branchCtx = null;
let branchAnimId = null;
let branches = [];

function createBranchCanvas() {
    if (branchCanvas) return;
    branchCanvas = document.createElement('canvas');
    branchCanvas.id = 'botanical-canvas';
    branchCanvas.width = window.innerWidth;
    branchCanvas.height = window.innerHeight;
    document.body.prepend(branchCanvas);
    branchCtx = branchCanvas.getContext('2d');

    window.addEventListener('resize', () => {
        branchCanvas.width = window.innerWidth;
        branchCanvas.height = window.innerHeight;
    });
}

function removeBranchCanvas() {
    if (branchCanvas) {
        branchCanvas.remove();
        branchCanvas = null;
        branchCtx = null;
    }
}

class Branch {
    constructor(x, y, angle, length, depth, side) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        this.depth = depth;
        this.side = side;
        this.grown = 0;
        this.speed = 0.6 + Math.random() * 0.8;
        this.children = [];
        this.hasLeaves = depth > 2;
        this.leaves = [];
        this.syringa = depth > 3 && Math.random() > 0.5;
    }

    grow() {
        if (this.grown < this.length) {
            this.grown += this.speed;

            // Spawn child branches
            if (this.depth < 6 && this.grown > this.length * 0.4 && this.children.length === 0) {
                const numChildren = this.depth < 3 ? 2 : (Math.random() > 0.4 ? 2 : 1);
                for (let i = 0; i < numChildren; i++) {
                    const spread = (Math.random() * 0.6 + 0.3) * (i === 0 ? 1 : -1);
                    this.children.push(new Branch(
                        this.tipX(),
                        this.tipY(),
                        this.angle + spread,
                        this.length * (0.55 + Math.random() * 0.2),
                        this.depth + 1,
                        this.side
                    ));
                }
            }

            // Add leaves at tips of deeper branches
            if (this.hasLeaves && this.grown > this.length * 0.7 && this.leaves.length === 0) {
                for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
                    this.leaves.push({
                        offset: 0.5 + Math.random() * 0.5,
                        angle: this.angle + (Math.random() - 0.5) * 1.5,
                        size: 4 + Math.random() * 6,
                    });
                }
            }
        }

        this.children.forEach(c => {
            c.x = this.tipX();
            c.y = this.tipY();
            c.grow();
        });
    }

    tipX() {
        return this.x + Math.cos(this.angle) * this.grown;
    }

    tipY() {
        return this.y + Math.sin(this.angle) * this.grown;
    }

    draw(ctx) {
        // Branch line
        const thickness = Math.max(1, (6 - this.depth) * 1.2);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.tipX(), this.tipY());
        ctx.strokeStyle = this.depth < 3 ? '#6b5c4d' : '#8a7b6b';
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Leaves
        this.leaves.forEach(leaf => {
            const lx = this.x + Math.cos(this.angle) * this.grown * leaf.offset;
            const ly = this.y + Math.sin(this.angle) * this.grown * leaf.offset;
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(leaf.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, leaf.size * 0.4, leaf.size, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 124, 89, ${0.5 + Math.random() * 0.3})`;
            ctx.fill();
            ctx.restore();
        });

        // Syringa flower clusters at tips
        if (this.syringa && this.grown >= this.length * 0.9) {
            const tx = this.tipX();
            const ty = this.tipY();
            for (let i = 0; i < 5; i++) {
                const fx = tx + (Math.random() - 0.5) * 12;
                const fy = ty + (Math.random() - 0.5) * 12;
                ctx.beginPath();
                ctx.arc(fx, fy, 2 + Math.random() * 2.5, 0, Math.PI * 2);
                const purples = ['#c8a2d4', '#b07cc6', '#d4b8e0', '#9b6bab'];
                ctx.fillStyle = purples[Math.floor(Math.random() * purples.length)];
                ctx.fill();
            }
        }

        this.children.forEach(c => c.draw(ctx));
    }
}

function initBranches() {
    branches = [];
    const h = window.innerHeight;
    const w = window.innerWidth;

    // Left side — branches growing right
    branches.push(new Branch(0, h * 0.2, -0.3, 120, 0, 'left'));
    branches.push(new Branch(0, h * 0.6, 0.2, 100, 0, 'left'));
    branches.push(new Branch(0, h * 0.85, -0.15, 90, 1, 'left'));

    // Right side — branches growing left
    branches.push(new Branch(w, h * 0.15, Math.PI + 0.3, 110, 0, 'right'));
    branches.push(new Branch(w, h * 0.5, Math.PI - 0.2, 130, 0, 'right'));
    branches.push(new Branch(w, h * 0.75, Math.PI + 0.1, 95, 1, 'right'));

    // Top — hanging down
    branches.push(new Branch(w * 0.2, 0, Math.PI / 2 + 0.3, 80, 1, 'top'));
    branches.push(new Branch(w * 0.7, 0, Math.PI / 2 - 0.2, 90, 1, 'top'));
}

function isBranchFullyGrown(branch) {
    if (branch.grown < branch.length) return false;
    return branch.children.every(c => isBranchFullyGrown(c));
}

function allBranchesGrown() {
    return branches.every(b => isBranchFullyGrown(b));
}

function animateBranches() {
    if (!branchCtx || !isBotanical()) return;

    branchCtx.clearRect(0, 0, branchCanvas.width, branchCanvas.height);
    branches.forEach(b => {
        b.grow();
        b.draw(branchCtx);
    });

    // Start leaves only after branches are done AND mouse has moved
    if (!leavesStarted && allBranchesGrown() && mouseHasMoved) {
        leavesStarted = true;
        initLeaves();
        animateLeaves();
    }

    branchAnimId = requestAnimationFrame(animateBranches);
}

// ============================================================
// FALLING LEAVES — physics-based, blown toward mouse like wind
// ============================================================

let leafCanvas = null;
let leafCtx = null;
let leafAnimId = null;
let leaves = [];
let leavesStarted = false;
let mouseHasMoved = false;
let leavesPaused = false;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let prevMouseX = mouseX;
let prevMouseY = mouseY;
let windX = 0;
let windY = 0;

const LEAF_COLORS = [
    { fill: '#4a7c59', stroke: '#3a6248' },
    { fill: '#5a8f68', stroke: '#4a7c59' },
    { fill: '#7aab5a', stroke: '#5a8f48' },
    { fill: '#8b5e9b', stroke: '#6b4080' },
    { fill: '#c8a2d4', stroke: '#a080b0' },
];

class Leaf {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -20 - Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = 0.5 + Math.random() * 1;
        this.size = 6 + Math.random() * 10;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02 + Math.random() * 0.03;
        this.color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
        this.opacity = 0.5 + Math.random() * 0.4;
    }

    update() {
        // Wind from mouse movement
        this.vx += windX * 0.015;
        this.vy += windY * 0.005;

        // Gentle wobble
        this.wobble += this.wobbleSpeed;
        this.vx += Math.sin(this.wobble) * 0.05;

        // Gravity
        this.vy += 0.02;

        // Drag
        this.vx *= 0.99;
        this.vy = Math.min(this.vy, 3);

        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed + windX * 0.002;

        // Reset when off screen
        if (this.y > window.innerHeight + 30 || this.x < -50 || this.x > window.innerWidth + 50) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Leaf shape
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(
            this.size * 0.6, -this.size * 0.6,
            this.size * 0.6, this.size * 0.3,
            0, this.size
        );
        ctx.bezierCurveTo(
            -this.size * 0.6, this.size * 0.3,
            -this.size * 0.6, -this.size * 0.6,
            0, -this.size
        );
        ctx.fillStyle = this.color.fill;
        ctx.fill();

        // Leaf vein
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.lineTo(0, this.size * 0.8);
        ctx.strokeStyle = this.color.stroke;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
    }
}

function createLeafCanvas() {
    if (leafCanvas) return;
    leafCanvas = document.createElement('canvas');
    leafCanvas.id = 'botanical-petals';
    Object.assign(leafCanvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '9990',
        pointerEvents: 'none',
    });
    leafCanvas.width = window.innerWidth;
    leafCanvas.height = window.innerHeight;
    document.body.appendChild(leafCanvas);
    leafCtx = leafCanvas.getContext('2d');

    window.addEventListener('resize', () => {
        if (leafCanvas) {
            leafCanvas.width = window.innerWidth;
            leafCanvas.height = window.innerHeight;
        }
    });

    // Track mouse for wind
    document.addEventListener('mousemove', (e) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseHasMoved = true;
    });

    // Pause leaves when scrolled past the fold
    window.addEventListener('scroll', () => {
        leavesPaused = window.scrollY > window.innerHeight * 0.3;
    });
}

function removeLeafCanvas() {
    if (leafCanvas) {
        leafCanvas.remove();
        leafCanvas = null;
        leafCtx = null;
    }
}

function initLeaves() {
    leaves = [];
    for (let i = 0; i < 30; i++) {
        const leaf = new Leaf();
        leaves.push(leaf);
    }
}

function animateLeaves() {
    if (!leafCtx || !isBotanical()) return;

    if (leavesPaused) {
        leafCtx.clearRect(0, 0, leafCanvas.width, leafCanvas.height);
        leafAnimId = requestAnimationFrame(animateLeaves);
        return;
    }

    // Calculate wind from mouse velocity
    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;
    windX += (dx - windX) * 0.1;
    windY += (dy - windY) * 0.1;
    windX *= 0.95; // decay
    windY *= 0.95;

    leafCtx.clearRect(0, 0, leafCanvas.width, leafCanvas.height);
    leaves.forEach(leaf => {
        leaf.update();
        leaf.draw(leafCtx);
    });
    leafAnimId = requestAnimationFrame(animateLeaves);
}

// ============================================================
// START / STOP
// ============================================================

function startBotanical() {
    leavesStarted = false;
    mouseHasMoved = false;
    createBranchCanvas();
    createLeafCanvas();
    initBranches();
    animateBranches();
    // Leaves start automatically once branches are grown + mouse moves
}

function stopBotanical() {
    if (branchAnimId) {
        cancelAnimationFrame(branchAnimId);
        branchAnimId = null;
    }
    if (leafAnimId) {
        cancelAnimationFrame(leafAnimId);
        leafAnimId = null;
    }
    removeBranchCanvas();
    removeLeafCanvas();
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Botanical is the default — only disable if user explicitly chose dark
    if (localStorage.getItem('mh-botanical') === '0') {
        document.body.classList.remove('botanical');
    }

    createThemeToggle();

    if (isBotanical()) {
        startBotanical();
    }
});
