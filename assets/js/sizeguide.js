(function () {

    // Each row: [size, {label: cm_value, ...}]
    const CM_TO_IN = 0.3937;

    const catalog = {
        Men: {
            "Tops": {
                cols: ["Chest", "Waist", "Neck", "Sleeve"],
                rows: [
                    ["XS", 86, 71, 36, 60],
                    ["S", 91, 76, 37, 61.5],
                    ["M", 97, 81, 39, 63],
                    ["L", 102, 87, 41, 64.5],
                    ["XL", 109, 94, 43, 66],
                    ["XXL", 117, 102, 45, 67.5]
                ]
            },
            "Bottoms": {
                cols: ["Waist", "Hip", "Inseam"],
                rows: [
                    ["28", 71, 88, 79],
                    ["30", 76, 93, 80],
                    ["32", 81, 98, 81],
                    ["34", 87, 104, 82],
                    ["36", 92, 109, 82],
                    ["38", 97, 114, 83],
                    ["40", 102, 119, 83]
                ]
            },
            "Outerwear": {
                cols: ["Chest", "Waist", "Shoulder", "Sleeve"],
                rows: [
                    ["XS", 88, 74, 43, 61],
                    ["S", 93, 79, 44.5, 62.5],
                    ["M", 99, 85, 46, 64],
                    ["L", 105, 91, 47.5, 65.5],
                    ["XL", 112, 98, 49, 67],
                    ["XXL", 120, 106, 50.5, 68.5]
                ]
            }
        },
        Women: {
            "Tops & Blouses": {
                cols: ["Bust", "Waist", "Hip"],
                rows: [
                    ["XS", 80, 62, 87],
                    ["S", 84, 66, 91],
                    ["M", 89, 71, 96],
                    ["L", 95, 77, 102],
                    ["XL", 102, 84, 109],
                    ["XXL", 110, 92, 117]
                ]
            },
            "Dresses & Jumpers": {
                cols: ["Bust", "Waist", "Hip", "Length"],
                rows: [
                    ["XS", 80, 62, 87, 96],
                    ["S", 84, 66, 91, 97],
                    ["M", 89, 71, 96, 98],
                    ["L", 95, 77, 102, 99],
                    ["XL", 102, 84, 109, 100],
                    ["XXL", 110, 92, 117, 101]
                ]
            },
            "Bottoms": {
                cols: ["Waist", "Hip", "Inseam"],
                rows: [
                    ["24", 62, 87, 76],
                    ["26", 66, 91, 77],
                    ["28", 71, 96, 78],
                    ["30", 77, 102, 78],
                    ["32", 84, 109, 79],
                    ["34", 92, 117, 79]
                ]
            }
        }
    };

    let currentDept = "Men";
    let currentCat = "Tops";
    let currentUnit = "cm";

    const catNav = document.getElementById('catNav');
    const panels = document.getElementById('panels');
    const panelTitle = document.getElementById('panelTitle');

    function fmt(cmVal) {
        if (currentUnit === 'cm') return cmVal.toFixed(cmVal % 1 === 0 ? 0 : 1);
        const inches = cmVal * CM_TO_IN;
        return inches.toFixed(inches % 1 === 0 ? 0 : 1);
    }

    function buildTable(catName, data) {
        let html = `<table class="size-table"><caption>${catName}</caption><thead><tr><th>Size</th>`;
        data.cols.forEach(c => html += `<th>${c} (${currentUnit})</th>`);
        html += `</tr></thead><tbody>`;
        data.rows.forEach(row => {
            html += `<tr><td>${row[0]}</td>`;
            for (let i = 1; i < row.length; i++) {
                html += `<td>${fmt(row[i])}</td>`;
            }
            html += `</tr>`;
        });
        html += `</tbody></table>`;
        return html;
    }

    function renderCatNav() {
        const cats = Object.keys(catalog[currentDept]);
        if (!cats.includes(currentCat)) currentCat = cats[0];
        catNav.innerHTML = cats.map(cat =>
            `<button type="button" class="${cat === currentCat ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
        ).join('');
        catNav.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCat = btn.dataset.cat;
                renderCatNav();
                renderPanel();
            });
        });
    }

    function renderPanel() {
        const data = catalog[currentDept][currentCat];
        panelTitle.textContent = `${currentDept} — ${currentCat}`;
        panels.innerHTML = `<div class="table-responsive">${buildTable(currentCat, data)}</div>`;
    }

    document.getElementById('deptSwitch').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        document.querySelectorAll('#deptSwitch button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDept = btn.dataset.dept;
        renderCatNav();
        renderPanel();
    });

    document.getElementById('unitToggle').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        document.querySelectorAll('#unitToggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUnit = btn.dataset.unit;
        renderPanel();
    });

    renderCatNav();
    renderPanel();
})();