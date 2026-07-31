// Các hàm Helper từ các phiếu trước
function lineTotal(p) {
  return p.price * p.qty;
}

function inventoryValue(list) {
  return list.reduce((sum, p) => sum + lineTotal(p), 0);
}

function stockLevel(qty) {
  if (qty >= 5) return "Du";
  if (qty >= 2) return "Sap het";
  return "Can nhap";
}

function findProductBySku(list, sku) {
  return list.find((p) => p.sku === sku);
}

function countByCategory(list, categoryId) {
  return list.filter((p) => p.category_id === categoryId).length;
}

// Lấy tên danh mục theo id
function categoryName(id) {
  const c = categories.find((c) => c.id === id);
  return c ? c.name : "?";
}

// Hàm render toàn bộ card sản phẩm từ mảng JS vào DOM
function render(list) {
  const grid = document.querySelector('[data-testid="cm-product-table"]');
  if (!grid) return;
  grid.innerHTML = "";

  for (const p of list) {
    const card = document.createElement("article");
    card.className = "cm-card";
    card.dataset.testid = "cm-product-row";
    card.dataset.sku = p.sku;

    const h3 = document.createElement("h3");
    h3.textContent = p.name;
    h3.className = "cm-card-title";

    const cat = document.createElement("p");
    cat.className = "cm-card-cat";
    cat.textContent = categoryName(p.category_id);

    const price = document.createElement("p");
    price.className = "cm-card-price";
    price.textContent = String(p.price);

    const stock = document.createElement("p");
    stock.className = "cm-stock";
    stock.textContent = stockLevel(p.qty);

    card.append(h3, cat, price, stock);
    grid.appendChild(card);
  }

  // Nhiệm vụ B: Cập nhật hiển thị số lượng sản phẩm
  const countEl = document.querySelector('[data-testid="cm-visible-count"]');
  if (countEl) {
    countEl.textContent = `Hien thi: ${list.length} san pham`;
  }
}

// Trạng thái mảng hiện tại ban đầu
let currentList = products;
render(currentList);

// Thống kê kho tổng quan
function updateStats() {
  const el = document.querySelector("#stats");
  if (!el) return;
  const total = inventoryValue(products);
  el.textContent = `So san pham = ${products.length}\nTong gia tri kho = ${total}`;
}
updateStats();

// Nhiệm vụ A: Bộ lọc theo danh mục
const select = document.querySelector('[data-testid="cm-filter-category"]');
if (select) {
  select.addEventListener("change", () => {
    const v = select.value;
    currentList =
      v === "all"
        ? products
        : products.filter((p) => p.category_id === Number(v));
    render(currentList);
  });
}

// Nhiệm vụ C: Sắp xếp giá tăng dần (bất biến mảng gốc)
const sortBtn = document.querySelector("#sort-price");
if (sortBtn) {
  sortBtn.addEventListener("click", () => {
    const sorted = [...currentList].sort((a, b) => a.price - b.price);
    render(sorted);
  });
}

// Nhiệm vụ D: Event delegation trên khối lưới sản phẩm
const gridContainer = document.querySelector('[data-testid="cm-product-table"]');
if (gridContainer) {
  gridContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".cm-card");
    if (!card) return;
    console.log("Ban vua bam card:", card.dataset.sku);
  });
}