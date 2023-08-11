const root = document.getElementById("root");
const result = document.getElementById("result");
let upped = false;

const up = () => {
    if (!upped) {
        root.animate([
            {
                top: "0"
            },
            {
                top: "-670px"
            }
        ], {
            duration: 1500,
            fill: "forwards",
            easing: "ease"
        })
        upped = !upped;
    } else {
        document.getElementById("dat").animate([
            { opacity: "1", transform: "translateY(0)" },
            { opacity: "0", transform: "translateY(-24px)" },
        ], {
            duration: 600,
            fill: "forwards",
            easing: "ease"
        })
    }
}

let currentPage = -1;

const f = (url, option) => {
    if (option && option.params) {
        return fetch(`${url}?${new URLSearchParams(option.params).toString()}`, option).then(res => res.json());
    } else {
        return fetch(`${url}`, option).then(res => res.json());
    }
}

const pages = [
    {
        title: "등록된 라면 조회",
        btn: [],
        result: true,
        func: () => {
            f("/ramyun")
                .then(res => {
                    document.getElementById("bl").innerHTML = getDataBlock(res);
                })
        }
    },
    {
        title: "라면 정보 추가",
        btn: [
            {
                name: "이름",
                type: "str"
            },
            {
                name: "가격",
                type: "int"
            },
            {
                name: "수량",
                type: "int"
            },
            {
                name: "유통업체",
                type: "str"
            },
            {
                name: "기업명",
                type: "str"
            },
        ],
        result: false,
        func: () => {
            f("/ramyun/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: document.getElementById("이름").value,
                    price: document.getElementById("가격").value,
                    amount: document.getElementById("수량").value,
                    seller: document.getElementById("판매_대행").value,
                    company: document.getElementById("기업명").value,
                })
            }).then(res => {
                document.getElementById("bl").innerHTML = `<p class="moveup">성공적으로 등록된!</p>`;
            })
        }
    },
    {
        title: "라면 검색",
        btn: [
            {
                name: "라면 이름",
                type: "str"
            },
        ],
        result: true,
        func: () => {
            f(`/ramyun/name`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    name: document.getElementById("라면_이름").value
                }
            }).then(res => {
                document.getElementById("bl").innerHTML = getDataBlock(res);
            })
        }
    },
    {
        title: "유통업체별 라면 검색",
        btn: [
            {
                name: "유통업체명",
                type: "str"
            },
        ],
        result: true,
        func: () => {
            f(`/ramyun/seller`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    name: document.getElementById("유통업체명").value
                }
            }).then(res => {
                document.getElementById("bl").innerHTML = getDataBlock(res);
            })
        }
    },
    {
        title: "기업별 라면 검색",
        btn: [
            {
                name: "기업명",
                type: "str"
            },
        ],
        result: true,
        func: () => {
            f(`/ramyun/company`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    name: document.getElementById("기업명").value
                }
            }).then(res => {
                document.getElementById("bl").innerHTML = getDataBlock(res);
            })
        }
    },
    {
        title: "가격별 라면 검색",
        btn: [
            {
                name: "최소 가격(이상)",
                type: "int"
            },
            {
                name: "최대 가격(미만)",
                type: "int"
            },
        ],
        result: true,
        func: () => {
            let min = document.getElementById("최소_가격(이상)").value;
            let max = document.getElementById("최대_가격(미만)").value;
            min = min.length <= 0 ? '0' : min;
            max = max.length <= 0 ? `100000000` : max;
            f(`/ramyun/price`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    min: min,
                    max: max
                }
            }).then(res => {
                document.getElementById("bl").innerHTML = getDataBlock(res);
            })
        }
    },
    {
        title: "구매 가능한 라면 검색",
        btn: [
            {
                name: "금액",
                type: "str"
            },
        ],
        result: true,
        func: () => {
            f(`/ramyun/can`, {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    price: document.getElementById("금액").value
                }
            }).then(res => {
                document.getElementById("bl").innerHTML = getDataBlock(res);
            })
        }
    },
]

function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getDataBlock = (res) => {
    let block = `<div class="bbox moveup">`;
    if (currentPage === 6) {
        block += `
        <div class="item poo">
            <div class="row1">
                <h3>제품명</h3>
            </div>
            <div class="row2">
                <h3>단위 가격</h3>
                <h3>총 구매량</h3>
                <h3>총 가격</h3>
                <h3>잔액</h3>
                <h3>유통업체</h3>
                <h3>기업명</h3>
            </div>
        </div>`
        res.forEach(value => {
            block += `<div class="item">`;
            block += `<div class="row1">`;
            block += `<p>${value.name}</p>`;
            block += `</div>`;
            block += `<div class="row2"><p>${comma(value.per_price)}원</p><p>${comma(value.total_amount)}개</p><p>${comma(value.total_price)}원</p><p>${comma(value.total_change)}원</p><p>${value.seller}</p><p>${value.company}</p></div>`;
            block += `</div>`;
        });
    } else {
        block += `
        <div class="item poo">
            <div class="row1">
                <h3>제품명</h3>
            </div>
            <div class="row2">
                <h3>가격(개당)</h3>
                <h3>수량</h3>
                <h3>유통업체</h3>
                <h3>기업명</h3>
            </div>
        </div>`
        res.forEach(value => {
            block += `<div class="item">`;
            block += `<div class="row1">`;
            block += `<p>${value.Key}</p>`;
            block += `</div>`;
            block += `<div class="row2"><p>${comma(value.Data.price)}원</p><p>${comma(value.Data.amount)}개</p><p>${value.Data.seller}</p><p>${value.Data.company}</p></div>`;
            block += `</div>`;
        });
    }
    block += `</div>`;
    return block;
}

const getPage = (page) => {
    let block = `<div id="dat" class="${upped ? 'moveup' : 'moveupf'}">`;
    const data = pages[page];

    block += `<h2>${data.title}</h2>`;
    if (data.btn.length > 0) {
        block += `<div class="info">`;
        data.btn.forEach(value => {
            block += `<div class="inputt">`;
            block += `<p>${value.name}</p>`;
            if (value.type === "str") {
                block += `<input id="${value.name.replace(" ", "_")}" type="text" placeholder="${value.name}"/>`;
            } else if (value.type === "int") {
                block += `<input id="${value.name.replace(" ", "_")}" type="number" min="0" placeholder="${value.name}"/>`;
            }
            block += `</div>`;
        });
        block += `</div>`;
    }
    if (currentPage === 1) {
        block += `<button onclick="submit()">등록</button>`;
    } else {
        block += `<button onclick="submit()">조회</button>`;
    }
    block += `<div id="bl"></div>`;
    // if (data.result) {
    //     block += `<textarea readonly id="area"></textarea>`;
    // }
    block += `</div>`;
    console.log(block);
    return block;
}

const page = (page) => {
    up();
    if (currentPage != -1) {
        const btn = document.getElementById(`btn${currentPage}`);
        btn.style.backgroundSize = null;
        btn.style.fontSize = null;
        btn.style.fontWeight = null;
    }
    currentPage = page;
    const btn = document.getElementById(`btn${currentPage}`);
    btn.style.backgroundSize = "100% 1px";
    btn.style.fontSize = "20px";
    btn.style.fontWeight = "800";
    if (upped) {
        setTimeout(() => result.innerHTML = getPage(currentPage), 600);
    } else {
        result.innerHTML = getPage(currentPage);
    }
}

const submit = () => {
    pages[currentPage].func();
}