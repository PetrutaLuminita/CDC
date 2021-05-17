const api = "https://europe-central2-project1-313716.cloudfunctions.net";

const productsTable = document.getElementById("productsTable");

const xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        // Create table content
        const elements = JSON.parse(this.responseText);
        for (let i = 0; i < elements.length; i++) {
            const tr = document.createElement("tr");

            const td1 = document.createElement("td");
            td1.setAttribute("data-label", "Name");
            td1.innerText = elements[i].name;

            const td2 = document.createElement("td");
            td2.setAttribute("data-label", "Price (RON)");
            td2.innerText = elements[i].price;

            const td3 = document.createElement("td");
            td3.setAttribute("data-label", "Quantity");
            td3.innerText = elements[i].quantity;

            const td4 = document.createElement("td");
            td4.setAttribute("data-label", "Description");
            td4.innerText = elements[i].description;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            productsTable.appendChild(tr);
        }
    }
});

xhr.open("GET", `${api}/getProducts`);
xhr.send();
xhr.corsEnabledFunction = (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        res.send('Cookie Organizer');
    }
};


const addProduct = document.getElementById("addProduct");
addProduct.addEventListener("click", function () {
    Swal.fire({
        html: '<span>Name</span>' +
            '<input id="swal-input1" class="swal2-input">' +
            '<span>Price (RON)</span>' +
            '<input id="swal-input2" class="swal2-input">' +
            '<span>Quantity</span>' +
            '<input id="swal-input3" class="swal2-input">' +
            '<span>Description</span>' +
            '<input id="swal-input4" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
            return [
                addInput(
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value,
                    document.getElementById('swal-input3').value,
                    document.getElementById('swal-input4').value,
                )
            ]
        }
    })
});

function addInput(name, price, quantity, description) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            window.location.reload(true);
        }
    });
    xhr.open("POST", `${api}/addProduct?name=${name}&price=${price}&quantity=${quantity}&description=${description}`);
    xhr.send();
    xhr.corsEnabledFunction = (req, res) => {
        res.set('Access-Control-Allow-Origin', '*');

        if (req.method === 'OPTIONS') {
            res.set('Access-Control-Allow-Methods', 'GET');
            res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.set('Access-Control-Max-Age', '3600');
            res.status(204).send('');
        } else {
            res.send('Cookie Organizer');
        }
    };
}