import Chart from 'chart.js/auto'

const max = 75;

const data = [
    {
        name: 'backblaze.com',
        color: 'red',
        minPrice: 7,
        storagePrice: 0.005,
        transferPrice: 0.01,
        price: max
    },
    {
        name: 'bunny.net',
        color: 'orange',
        maxPrice: 10,
        storageHddPrice: 0.01,
        storageSsdPrice: 0.02,
        transferPrice: 0.01,
        price: max
    },
    {
        name: 'scaleway.com',
        color: 'violet',
        freeGB: 75,
        storageMultiPrice: 0.06,
        storageSinglePrice: 0.03,
        transferPrice: 0.02,
        price: max
    },
    {
        name: 'vultr.com',
        color: 'blue',
        minPrice: 5,
        storagePrice: 0.01,
        transferPrice: 0.01,
        price: max
    }
];

chartElem = new Chart(
    document.getElementById('bar_graph'), 
    {
        type: 'bar',
        options: {
            indexAxis: 'y',
            animation: true,
            plugins: {
                legend: {
                    display: false
                },
                // tooltip: {
                //     enabled: true
                // },
                // title: {
                //     display: true,
                //     text: 'Prices',
                //     position: 'top',
                //     fontSize: 16,
                //     padding: 20
                // }
            },
            elements: {
                rectangle: {
                    borderSkipped: 'left'
                }
            },           
            scales: {
                x: {
                    // beginAtZero: true,
                    // suggestedMin: 0,
                    suggestedMax: max
                }
            }
            
        },
        data: {
            labels: data.map(row => row.name),
            datasets: [{
                label: 'Price',
                data: data.map(row => row.price),
                backgroundColor: data.map(row => row.color),
                borderColor: '#585858',
                borderWidth: 1,
                // borderSkipped: 'bottom',
                // hoverBackgroundColor: '#A4A4A4',
                // hoverBorderColor: 'blue'

            }]
        }
    }
);

const storage = document.getElementById("storage"),
    storage_label = document.getElementById("storage_label"),
    transfer = document.getElementById("transfer"),
    transfer_label = document.getElementById("transfer_label"),
    hdd = document.getElementById("bunny_op_hdd"),
    ssd = document.getElementById("bunny_op_ssd"),
    multi = document.getElementById("scaleway_op_multi"),
    single = document.getElementById("scaleway_op_single");

storage.addEventListener('input', () => {
    storage_label.textContent = "Storage: " + storage.value + " GB";
});

transfer.addEventListener('input', () => {
    transfer_label.textContent = "Transfer: " + transfer.value + " GB";
});

storage.addEventListener('change', () => {
    calc();
});

transfer.addEventListener('change', () => {
    calc();
});

hdd.addEventListener("change", () => {
    calc();
});

ssd.addEventListener("change", () => {
    calc();
});

multi.addEventListener("change", () => {
    calc();
});

single.addEventListener("change", () => {
    calc();
});

function calc() {

    data[0].price = data[0].storagePrice * storage.value + data[0].transferPrice * transfer.value;
    data[0].price = data[0].price < data[0].minPrice ? data[0].minPrice : data[0].price;

    if (hdd.checked) {
        data[1].price = data[1].storageHddPrice * storage.value + data[1].transferPrice * transfer.value;
    } else {
        data[1].price = data[1].storageSsdPrice * storage.value + data[1].transferPrice * transfer.value;
    }
    data[1].price = data[1].price > data[1].maxPrice ? data[1].maxPrice : data[1].price;

    if (multi.checked) {
        data[2].price = data[2].storageMultiPrice * ((storage.value - data[2].freeGB < 0 ? 0 : storage.value - data[2].freeGB)) + 
            data[2].transferPrice * ((transfer.value - data[2].freeGB < 0 ? 0 : transfer.value - data[2].freeGB));
    } else {
        data[2].price = data[2].storageSinglePrice * ((storage.value - data[2].freeGB < 0 ? 0 : storage.value - data[2].freeGB)) + 
            data[2].transferPrice * ((transfer.value - data[2].freeGB < 0 ? 0 : transfer.value - data[2].freeGB));
    }

    data[3].price = data[3].storagePrice * storage.value + data[3].transferPrice * transfer.value;
    data[3].price = data[3].price < data[3].minPrice ? data[3].minPrice : data[3].price;

    const min = data.reduce((res, item) => (item.price < res ? item.price : res ), max);

    chartElem.data.datasets[0].data = data.map(row => row.price);
    chartElem.data.datasets[0].backgroundColor = data.map(item => (item.price === min ? item.color : 'grey'));
    chartElem.update();

}

calc();
