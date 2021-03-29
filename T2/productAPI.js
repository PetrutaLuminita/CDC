const http = require ('http');
const port = 3300;

let products = [
	{ id: 1, name: 'Apple', description: 'description apple' },
	{ id: 2, name: 'Cookie', description: 'description cookie' },
	{ id: 3, name: 'Water', description: 'description water' },
	{ id: 4, name: 'Chips', description: 'description chips' },
	{ id: 5, name: 'Grapefruit', description: 'description grapefruit' },
	{ id: 6, name: 'Pen', description: 'description pen' },
];

const requestHandler = (request, response) => {
	switch(request.method) {
		case 'HEAD':
			headHandler(request,response);
			break;

		case 'GET':
			getHandler(request,response);
			break;

		case 'POST':
			postHandler(request,response);
			break;

		case 'PUT':
			putHandler(request,response);
			break;

		case 'PATCH':
			patchHandler(request,response);
			break;

		case 'DELETE':
			deleteHandler(request,response);
			break;

		default:
			fallbackHandler(response);
			break;
	}
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
	if (err) {
		return console.log('Connection error', err)
	}
	
    console.log('Server is listening on port ' + port)
});


function headHandler(request,response) {
	if (request.url === '/products') {
		response.setHeader('Content-Type', 'application/json');
		response.statusCode = 200;
		response.end();
	} else if (request.url.split('/')[1] == 'products' && request.url.split('/')[2]) {
		const product = products.find((f) => f.id == request.url.split('/')[2]);

		if (product) {
			response.setHeader('Content-Type', 'application/json');
			response.statusCode = 200;
			response.end();
		} else {
			response.statusCode = 404;
			response.end('Product not found!')
		}
	} else {
		response.statusCode = 404;
		response.end()
	}
}

function getHandler(request,response) {
	if (request.url === '/products') {
		response.setHeader('Content-Type', 'application/json');
		response.statusCode = 200;
		response.end(JSON.stringify(products));
	} else if (request.url.split('/')[1] == 'products' && request.url.split('/')[2]) {
		const product = products.find((f) => f.id == request.url.split('/')[2]);

		if (product) {
		    response.setHeader('Content-Type', 'application/json');
			response.statusCode = 200;
		    response.end(JSON.stringify(product));
		} else {
		    response.statusCode = 404;
		    response.end('Product not found!')
		}
	} else {
	    response.statusCode = 404;
	    response.end('Not found! Please make sure the route is correct!')
	}
}

function postHandler(request,response) {
	if (request.url == '/products') { 
        let receivedJSON = '';

		request.on('data', function(data) {
			receivedJSON += data;
		})

		request.on('end', function() {
			if (!receivedJSON) {
				response.statusCode = 404;
				response.end('No data! Insert some.');
				return;
			}

			const newProduct = JSON.parse(receivedJSON);

            if (!newProduct.name) {
			    response.statusCode = 400;
			    response.end('Required field is empty: name');
			    return;
			}

			if (!newProduct.description) {
				response.statusCode = 400;
				response.end('Required field is empty: description');
				return;
			}

			let products_ids = products.map(el => el.id);
			newProduct.id = products_ids.length ? Math.max(...products_ids) + 1 : 1;

			if (products.find(f => f.id == newProduct.id)) {
			    response.statusCode = 400;
			    response.end('Product already exists!');
			    return;
			}

		    products.push(newProduct);
		    response.statusCode = 200;
		    response.setHeader ('Content-Type', 'application/json');
		    response.end(JSON.stringify(products));
		});
	} else {
		response.statusCode = 404;
		response.end('Not found! Please make sure the route is correct!');
	}
}

function putHandler(request, response) {
	if (request.url === '/products') {
		let receivedJSON = '';
		
		request.on('data',function(data) {
			receivedJSON += data;
		});

		request.on('end',function() {
			if (!receivedJSON) {
				response.statusCode = 404;
				response.end('No data! Insert some.');
				return;
			}

			const newArray = JSON.parse(receivedJSON);

			if (newArray.length >= 0) {
				let count = 1;

				products = newArray.map(product => {
					return { id: count++, name: product.name, description: product.description }
				});

				response.setHeader('Content-Type', 'application/json');
				response.end(JSON.stringify(products));
			} else {
				response.statusCode = 400;
				response.end('The body is invalid!');
			}
		});
	} else if (request.url.split('/')[1] === 'products' && request.url.split('/')[2]) {
		let receivedJSON ='';

		request.on('data',function(data) {
			receivedJSON += data;
		});

		request.on('end',function() {
			if (!receivedJSON) {
				response.statusCode = 404;
				response.end('No data! Insert some.');
				return;
			}

			const productBody = JSON.parse(receivedJSON);
			let id = request.url.split('/')[2];

			if (id) {
				const product = products.find(f => f.id == id);
				if (!product) {
					productBody["id"] = id;
					products.push(productBody);
					response.statusCode = 200;
					response.setHeader('Content-Type', 'application/json');
					response.end(JSON.stringify(products));
				} else {
					if (!productBody.name) {
						response.statusCode = 400;
						response.end('Required field is empty: name');
						return;
					}

					if (!productBody.description) {
						response.statusCode = 400;
						response.end('Required field is empty: description');
						return;
					}

				    product.name = productBody.name;
				    product.description = productBody.description;
				    response.statusCode = 200;
				    response.setHeader('Content-Type', 'application/json');
				    response.end(JSON.stringify(products));
				}
			} else {
    			response.statusCode = 404;
    			response.end('ID is missing');
			}
		});
	} else {
		response.statusCode = 404;
		response.end('Not found! Please make sure the route is correct.');
	}
}

function patchHandler(request, response) {
	if (request.url.split('/')[1] === 'products' && request.url.split('/')[2]) {
		let receivedJSON ='';

		request.on('data',function(data) {
			receivedJSON += data;
		});

		request.on('end',function() {
			if (!receivedJSON) {
				response.statusCode = 404;
				response.end('No data! Insert some.');
				return;
			}

			const productBody = JSON.parse(receivedJSON);
			let id = request.url.split('/')[2];

			if (id) {
				const product = products.find(f => f.id == id);

				if (!product) {
					response.statusCode = 404;
					response.end('Product not found! Please make sure you are updating an existing product.');
				} else {
					product.name = productBody.name ? productBody.name : product.name;
					product.description = productBody.description ? productBody.description : product.description;

					response.statusCode = 200;
					response.setHeader('Content-Type', 'application/json');
					response.end(JSON.stringify(products));
				}
			} else {
				response.statusCode = 404;
				response.end('ID is missing');
			}
		});
	} else {
		response.statusCode = 404;
		response.end('Not found! Please make sure the route is correct.');
	}
}

function deleteHandler(request,response) {
	if(request.url === '/products') {
		response.setHeader('Content-Type', 'application/json');
		products = [];
		response.end(JSON.stringify(products));
	} else if (request.url.split('/')[1] === 'products' && request.url.split('/')[2]) {
		const product = products.find(f => f.id == request.url.split('/')[2]);
		
        if (product) {
			products = products.filter(f => f.id !== product.id);
			response.setHeader('Content-Type', 'application/json');
			response.end(JSON.stringify(product));
			response.statusCode = 200;
		} else {
			response.statusCode = 404;
			response.end('Product not found!')
		}
	} else {
		response.statusCode = 404;
		response.end('Not found! Please make sure the route is correct.')
	}
}

function fallbackHandler(response) {
	response.statusCode = 404;
	response.end('Method not implemented. Try: HEAD, GET, POST, PUT, PATCH, DELETE');
}