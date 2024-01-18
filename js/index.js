
// single product data
class UIGoods {
    constructor(good) {
        this.data = good;
        this.choose = 0;
    }

    // require the total price for current selection
    getTotalPrice() {
        return this.data.price * this.choose;
    }

    // whether the goods is chosen
    isChoose() {
        return this.choose > 0;
    }

    // add one to the selection
    addOne() {
        this.choose++;
    }

    // remove one from the selection
    removeOne() {
        if (this.choose < 0) return;
        this.choose--;
    }
}

// whole interface: data logic
class UIData {
    constructor() {
        var uiGoods = [];
        for (var i = 0; i < goods.length; i++) {
            uiGoods.push(new UIGoods(goods[i]));
        }
        this.uiGoods = uiGoods;
        this.deliveryFee = 5;
        this.deliveryThreshold = 10;
    }

    getTotalPrice() {
        var total = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            total += this.uiGoods[i].getTotalPrice();
        }
        return total;
    }

    // increase specific goods selection #
    addOne(index) {
        this.uiGoods[index].addOne();
    }

    // decrease specific goods selection #
    removeOne(index) {
        this.uiGoods[index].removeOne();
    }

    getTotalGoodsNumber() {
        var total = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            total += this.uiGoods[i].choose;
        }
        return total;
    }

    // whether something in the cart
    hasGoodInCart() {
        return this.getTotalGoodsNumber() > 0;
    }

    // whether the total price is above the threshold
    isAboveThreshold() {
        return this.getTotalPrice() >= this.deliveryThreshold;
    }

    // whether the good is chosen
    isGoodChosen(index) {
        return this.uiGoods[index].isChoose();
    }


}


// whole interface: UI logic
class UI {
    constructor() {
        this.uiData = new UIData();
        this.doms = {
            goodsContainer: document.querySelector(".goods-list"),
            deliveryFee: document.querySelector(".footer-car-tip"),
            footerPay: document.querySelector(".footer-pay"),
            footerPayInnterSpan: document.querySelector(".footer-pay span"),
            totalPrice: document.querySelector(".footer-car-price"),
            footerCart: document.querySelector(".footer-car"),
            footerCartBadge: document.querySelector(".footer-car-badge"),
        }
        // since the posion of the cart icon will never change,
        // calculate it at beginning
        var cartRect = this.doms.footerCart.getBoundingClientRect();
        var target = {
            x: cartRect.left + cartRect.width / 2,
            y: cartRect.top + cartRect.height / 4,
        }
        this.target = target;
        this.createHTML();
        this.updateFooter();
        this.listenEvent();
    }

    // add event listener
    listenEvent() {
        this.doms.footerCart.addEventListener("animationend", function () {
            this.classList.remove("animate");
        })
    }

    // create the HTML according to the data from goods list
    createHTML() {
        // generate the html string
        var html = "";
        for (var i = 0; i < this.uiData.uiGoods.length; i++) {
            var good = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
            <img src="${good.data.pic}" alt="" class="goods-pic">
            <div class="goods-info">
                <h2 class="goods-title">${good.data.title}</h2>
                <p class="goods-desc">
                    ${good.data.desc}
                </p>
                <p class="goods-sell">
                    <span>月销 ${good.data.sellNumber}</span>
                    <span>好评率${good.data.favorRate}%</span>
                </p>
                <div class="goods-confirm">
                    <p class="goods-price">
                        <span class="goods-price-unit">$</span>
                        <span>${good.data.price}</span>
                    </p>
                    <div class="goods-btns">
                        <i index="${i}" class="iconfont i-jianhao"></i>
                        <span>${good.choose}</span>
                        <i index="${i}" class="iconfont i-jiajianzujianjiahao">
                            ::before
                        </i>
                    </div>
                </div>
            </div>
        </div>`;
        }
        this.doms.goodsContainer.innerHTML = html;
    }

    addOne(idx) {
        this.uiData.addOne(idx);
        this.updateGoodItem(idx);
        this.updateFooter();
        this.parabolaAnimation(idx);
    }

    removeOne(idx) {
        this.uiData.removeOne(idx);
        this.updateGoodItem(idx);
        this.updateFooter();
    }

    // update the interface for specific good item(display status)
    updateGoodItem(idx) {
        var goodDom = this.doms.goodsContainer.children[idx];
        if (this.uiData.isGoodChosen(idx)) {
            goodDom.classList.add('active');
        } else {
            goodDom.classList.remove('active');
        }

        var span = goodDom.querySelector(".goods-btns span");
        span.textContent = this.uiData.uiGoods[idx].choose;
    }

    // update the footer interface
    updateFooter() {
        // total price
        var total = this.uiData.getTotalPrice();
        // set the delivery fee
        this.doms.deliveryFee.textContent = this.uiData.isAboveThreshold() ? "免配送费" : "配送费" + this.uiData.deliveryFee + "$";
        // set the price able to make a delivery
        if (this.uiData.isAboveThreshold()) {
            this.doms.footerPay.classList.add("active");
        } else {
            this.doms.footerPay.classList.remove("active");
            // update the remaining price needed
            var remaining = this.uiData.deliveryThreshold - total;
            this.doms.footerPayInnterSpan.textContent = `还差${remaining.toFixed(2)}$起送`;
        }
        //set the total price
        this.doms.totalPrice.textContent = total.toFixed(2);
        //set the cart icon status
        if (this.uiData.hasGoodInCart()) {
            this.doms.footerCart.classList.add("active");
        } else {
            this.doms.footerCart.classList.remove("active");
        }
        //set the badge number for the cart icon
        this.doms.footerCartBadge.textContent = this.uiData.getTotalGoodsNumber();

    }

    // footer cart icon annimation
    cartAnimate() {
        this.doms.footerCart.classList.add("animate");
    }

    // parabola animation
    parabolaAnimation(idx) {
        // coordinate for the start point(footer cart icon)
        // and which position will never change due the fixed position, calculate it at beginning

        var btnAdd = this.doms.goodsContainer.children[idx]
            .querySelector(".i-jiajianzujianjiahao");
        var btnAddRect = btnAdd.getBoundingClientRect();
        var start = {
            x: btnAddRect.left,
            y: btnAddRect.top,
        }

        // now start the animation
        var div = document.createElement("div");
        div.className = "add-to-car";
        var i = document.createElement("i");
        i.className = "iconfont i-jiajianzujianjiahao";
        // init start position
        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`
        div.appendChild(i);
        document.body.appendChild(div);
        // at this point, force the browser to render the div
        div.clientWidth;
        // init end position
        div.style.transform = `translateX(${this.target.x}px)`; // first
        i.style.transform = `translateY(${this.target.y}px)`; // second

        var self = this;
        div.addEventListener("transitionend", () => {
            div.remove();
            self.cartAnimate();
        }, {
            once: true
        }) // only listen once
    }
}


var ui = new UI();


// events
ui.doms.goodsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("i-jiajianzujianjiahao")) {
        var idx = e.target.getAttribute("index");
        ui.addOne(idx);
    } else if (e.target.classList.contains("i-jianhao")) {
        var idx = e.target.getAttribute("index");
        ui.removeOne(idx);
    }
})


