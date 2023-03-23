// CORE MODULES

// we can use it to read data
const fs = require('fs');
//network capability
const http = require('http');
//personalize the URL
const url = require('url');

//===========================
// IMPORTED FUNCTIONS

// Imported the anonymous function, renaming it
const replaceTemplate = require('./modules/replaceTemplate');

//===========================
// FILES


//===========================
// SERVER

//funcao create com request e response nos parametros
const tempOverview= fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8'); 
const tempCard= fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8'); 
const tempProduct= fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8'); 


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); 

//temos todos os objetos de data.json nesse array
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

	//pathname receive the requested URL
	const {query, pathname } = url.parse(req.url, true);
	

	// Overview Page
	if (pathname === '/' || pathname === '/overview'){
		
		res.writeHead(200, {'Content-type': 'html'});
		
		const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
		const output = tempOverview.replace('{%PRODUCT_CARD%', cardsHtml);

		res.end(output);
	}

	// Product Page
	 else if(pathname === '/product'){
		res.writeHead(200, { 'Content-type': 'text/html'});
		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);
	}
	// API
	else if(pathname === '/api'){
		//res.end('API');
			res.writeHead(200, {'Content-type': 'application/json'});
			res.end(data);
	}
	// Page Not Found
	else {
		res.writeHead(404, {'Content-type': 'text/html',
							'my-own-header': 'hello-world'
		});
		res.end('<h1> Page Not Found! </h1>');
	}
		
		
});

//startup the server
server.listen(8000, '127.0.0.1', () => {
	console.log('Open to requests on port 8000');
});